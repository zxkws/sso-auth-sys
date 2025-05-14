import express from 'express';
import passport from 'passport';
import db from '../models/index.js';

const router = express.Router();

// Middleware to ensure user is authenticated and has admin role
const ensureAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden - Admin access required' });
  }
  
  next();
};

// Get all users (admin only)
router.get('/', 
  passport.authenticate('jwt', { session: false }),
  ensureAdmin,
  async (req, res) => {
    try {
      // Pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      // Filtering
      const filter = {};
      if (req.query.role) {
        filter.role = req.query.role;
      }
      if (req.query.search) {
        filter[db.Sequelize.Op.or] = [
          { name: { [db.Sequelize.Op.like]: `%${req.query.search}%` } },
          { email: { [db.Sequelize.Op.like]: `%${req.query.search}%` } }
        ];
      }
      
      // Get users with count
      const { count, rows: users } = await db.User.findAndCountAll({
        where: filter,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [{
          model: db.UserAuthProvider,
          as: 'authProviders',
          attributes: ['provider', 'providerId']
        }]
      });
      
      // Map users to remove sensitive data
      const sanitizedUsers = users.map(user => {
        const userData = user.get({ plain: true });
        delete userData.password;
        
        // Convert authProviders to simple array of provider names
        userData.providers = userData.authProviders.map(p => p.provider);
        delete userData.authProviders;
        
        return userData;
      });
      
      res.json({
        users: sanitizedUsers,
        pagination: {
          total: count,
          page,
          limit,
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get a specific user by ID (admin or self)
router.get('/:id', 
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // Check if user is requesting their own data or is an admin
      if (req.user.id !== req.params.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      const user = await db.User.findByPk(req.params.id, {
        include: [{
          model: db.UserAuthProvider,
          as: 'authProviders',
          attributes: ['provider', 'providerId']
        }]
      });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Remove sensitive data
      const userData = user.get({ plain: true });
      delete userData.password;
      
      // Convert authProviders to simple array of provider names
      userData.providers = userData.authProviders.map(p => p.provider);
      delete userData.authProviders;
      
      res.json({ user: userData });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update a user (admin or self)
router.put('/:id', 
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // Check if user is updating their own data or is an admin
      if (req.user.id !== req.params.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      const user = await db.User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Only allow updating certain fields
      const { name, avatarUrl } = req.body;
      const updateData = {};
      
      if (name) updateData.name = name;
      if (avatarUrl) updateData.avatarUrl = avatarUrl;
      
      // Allow admin to update roles
      if (req.user.role === 'admin' && req.body.role) {
        updateData.role = req.body.role;
      }
      
      // Update user
      await user.update(updateData);
      
      // Return updated user
      const updatedUser = await db.User.findByPk(req.params.id, {
        include: [{
          model: db.UserAuthProvider,
          as: 'authProviders',
          attributes: ['provider', 'providerId']
        }]
      });
      
      // Remove sensitive data
      const userData = updatedUser.get({ plain: true });
      delete userData.password;
      
      // Convert authProviders to simple array of provider names
      userData.providers = userData.authProviders.map(p => p.provider);
      delete userData.authProviders;
      
      res.json({ user: userData });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete a user (admin only)
router.delete('/:id', 
  passport.authenticate('jwt', { session: false }),
  ensureAdmin,
  async (req, res) => {
    try {
      const user = await db.User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Prevent deleting the last admin
      if (user.role === 'admin') {
        const adminCount = await db.User.count({ where: { role: 'admin' } });
        if (adminCount <= 1) {
          return res.status(400).json({ message: 'Cannot delete the last admin user' });
        }
      }
      
      // Delete related records
      await db.UserAuthProvider.destroy({ where: { userId: req.params.id } });
      await db.RefreshToken.destroy({ where: { userId: req.params.id } });
      
      // Delete user
      await user.destroy();
      
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Change user role (admin only)
router.patch('/:id/role', 
  passport.authenticate('jwt', { session: false }),
  ensureAdmin,
  async (req, res) => {
    try {
      const { role } = req.body;
      if (!role || !['admin', 'user'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      
      const user = await db.User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Prevent removing the last admin
      if (user.role === 'admin' && role !== 'admin') {
        const adminCount = await db.User.count({ where: { role: 'admin' } });
        if (adminCount <= 1) {
          return res.status(400).json({ message: 'Cannot change role of the last admin user' });
        }
      }
      
      await user.update({ role });
      
      res.json({ message: 'User role updated successfully', user: { id: user.id, role } });
    } catch (error) {
      console.error('Update role error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;