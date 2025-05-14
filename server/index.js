import express from 'express';
import cors from 'cors';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import db from './models/index.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Passport initialization
app.use(passport.initialize());

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

// Passport JWT Strategy
passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await db.User.findByPk(payload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

// Passport GitHub Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL || 'http://localhost:3001'}/auth/github/callback`,
    scope: ['user:email'],
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create user in database
      let user = await db.User.findOne({ where: { githubId: profile.id } });
      
      if (!user) {
        // Create new user from GitHub profile
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        
        user = await db.User.create({
          name: profile.displayName || profile.username,
          email: email,
          githubId: profile.id,
          avatarUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
          role: 'user', // Default role
        });
        
        // Create auth provider record
        await db.UserAuthProvider.create({
          userId: user.id,
          provider: 'github',
          providerId: profile.id,
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
}

// Static assets (for production)
app.use(express.static(join(__dirname, '../dist')));

// API Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// For any other routes, serve the React app
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// Database connection and server startup
db.sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synchronized');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
  });

export default app;