import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// JWT settings
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

// Helper function to generate tokens
const generateTokens = async (user, req) => {
  // Generate access token
  const accessToken = jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  // Generate refresh token
  const refreshToken = uuidv4();
  
  // Calculate expiration date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + parseInt(REFRESH_TOKEN_EXPIRES_IN));
  
  // Save refresh token to database
  await db.RefreshToken.create({
    userId: user.id,
    token: refreshToken,
    expiresAt,
    clientIp: req.ip,
    userAgent: req.headers['user-agent']
  });

  return { accessToken, refreshToken };
};

// GitHub authentication routes
router.get('/github', passport.authenticate('github', { session: false }));

router.get('/github/callback', 
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    try {
      // Update last login time
      await db.User.update(
        { lastLogin: new Date() }, 
        { where: { id: req.user.id } }
      );
      
      // Generate tokens
      const { accessToken, refreshToken } = await generateTokens(req.user, req);
      
      // Set refresh token as a cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'lax'
      });
      
      // Redirect to frontend with access token
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/callback?token=${accessToken}`);
    } catch (error) {
      console.error('Authentication callback error:', error);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=authentication_failed`);
    }
  }
);

// Email & password login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if user has email provider
    const emailProvider = await db.UserAuthProvider.findOne({
      where: { userId: user.id, provider: 'email' }
    });
    
    if (!emailProvider) {
      return res.status(401).json({ 
        message: 'This account doesn\'t use password authentication' 
      });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Update last login time
    await user.update({ lastLogin: new Date() });
    
    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user, req);
    
    // Set refresh token as a cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax'
    });
    
    // Return user info and access token
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl
      },
      accessToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register new user with email & password
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if email already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await db.User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    });
    
    // Create auth provider record
    await db.UserAuthProvider.create({
      userId: user.id,
      provider: 'email'
    });
    
    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user, req);
    
    // Set refresh token as a cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax'
    });
    
    // Return user info and access token
    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Refresh token route
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }
    
    // Find the refresh token in the database
    const tokenRecord = await db.RefreshToken.findOne({
      where: { token: refreshToken, isRevoked: false },
      include: [{ model: db.User, as: 'user' }]
    });
    
    if (!tokenRecord) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    
    // Check if token is expired
    if (new Date() > new Date(tokenRecord.expiresAt)) {
      await tokenRecord.update({ isRevoked: true });
      return res.status(401).json({ message: 'Refresh token expired' });
    }
    
    const user = tokenRecord.user;
    
    // Generate new access token
    const accessToken = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Return new access token
    res.json({ accessToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout route
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    
    if (refreshToken) {
      // Revoke refresh token
      await db.RefreshToken.update(
        { isRevoked: true },
        { where: { token: refreshToken } }
      );
    }
    
    // Clear cookie
    res.clearCookie('refreshToken');
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user (for session validation)
router.get('/status', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Get user auth providers
  db.UserAuthProvider.findAll({ where: { userId: req.user.id } })
    .then(providers => {
      const providerList = providers.map(p => p.provider);
      
      res.json({
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          avatarUrl: req.user.avatarUrl,
          providers: providerList
        }
      });
    })
    .catch(error => {
      console.error('Auth status error:', error);
      res.status(500).json({ message: 'Server error' });
    });
});

export default router;