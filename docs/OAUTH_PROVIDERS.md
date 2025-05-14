# Adding OAuth Providers

This guide explains how to add additional OAuth providers to the Universal SSO System.

## Supported Providers

Currently, the system supports:

1. GitHub OAuth
2. Email/password authentication

This document outlines how to add support for additional OAuth providers such as Google, Facebook, Twitter, etc.

## General Steps for Adding an OAuth Provider

1. Install the required Passport.js strategy
2. Configure the strategy in `server/index.js`
3. Add auth routes in `server/routes/auth.js`
4. Update the frontend to support the new provider

## Detailed Example: Adding Google OAuth

Here's a step-by-step guide for adding Google OAuth support:

### 1. Install Required Package

```bash
npm install passport-google-oauth20
```

### 2. Configure Google OAuth in the Server

Update `server/index.js` to include Google OAuth strategy:

```javascript
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// ... existing code ...

// Passport Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL || 'http://localhost:3001'}/auth/google/callback`,
    scope: ['profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create user in database
      let user = await db.User.findOne({ where: { googleId: profile.id } });
      
      if (!user) {
        // Get primary email
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        
        // Check if user exists with this email
        if (email) {
          user = await db.User.findOne({ where: { email } });
        }
        
        if (!user) {
          // Create new user from Google profile
          user = await db.User.create({
            name: profile.displayName,
            email: email,
            googleId: profile.id,
            avatarUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
            role: 'user', // Default role
          });
        } else {
          // Update existing user with Google ID
          await user.update({
            googleId: profile.id,
            avatarUrl: user.avatarUrl || (profile.photos && profile.photos[0] ? profile.photos[0].value : null)
          });
        }
        
        // Create auth provider record
        await db.UserAuthProvider.create({
          userId: user.id,
          provider: 'google',
          providerId: profile.id,
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
}
```

### 3. Update Database Model

Make sure the `User` model has a field for the provider ID:

```javascript
// Add to server/models/user.js in the User model definition
googleId: {
  type: DataTypes.STRING,
  allowNull: true,
  unique: true,
},
```

### 4. Add Auth Routes

Update `server/routes/auth.js` to add Google authentication routes:

```javascript
// Google authentication routes
router.get('/google', passport.authenticate('google', { session: false }));

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
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
```

### 5. Update Environment Variables

Add Google OAuth credentials to `.env.example`:

```
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 6. Update Frontend Login Component

Update `src/pages/Login.tsx` to include a Google login option:

```jsx
// Add Google icon import
import { GithubIcon, Mail, AlertCircle } from 'lucide-react';

// Add Google login button to the OAuth section
<div className="space-y-3">
  <button
    type="button"
    onClick={() => handleOAuthLogin('github')}
    className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-white bg-[#24292E] hover:bg-[#24292E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#24292E]"
  >
    <GithubIcon className="h-5 w-5 mr-2" />
    Sign in with GitHub
  </button>
  
  <button
    type="button"
    onClick={() => handleOAuthLogin('google')}
    className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4]"
  >
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"
      />
    </svg>
    Sign in with Google
  </button>
</div>
```

## Adding Other Providers

Follow the same pattern for other OAuth providers:

1. Install the appropriate Passport.js strategy
2. Configure the strategy in the server
3. Add the necessary routes
4. Update the frontend login component

### Common OAuth Providers and Their Passport Strategies

- Facebook: `passport-facebook`
- Twitter: `passport-twitter`
- LinkedIn: `passport-linkedin-oauth2`
- Apple: `passport-apple`
- Microsoft: `passport-microsoft`

## OAuth Provider Configuration Tips

### Facebook

```javascript
import { Strategy as FacebookStrategy } from 'passport-facebook';

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `${process.env.API_URL}/auth/facebook/callback`,
  profileFields: ['id', 'displayName', 'photos', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  // Implementation similar to Google strategy
}));
```

### Twitter

```javascript
import { Strategy as TwitterStrategy } from 'passport-twitter';

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: `${process.env.API_URL}/auth/twitter/callback`,
  includeEmail: true
}, async (accessToken, refreshToken, profile, done) => {
  // Implementation similar to Google strategy
}));
```

## Testing OAuth Integration

1. Create a developer account with the OAuth provider
2. Register a new application to get client ID and secret
3. Set the correct callback URL
4. Add the credentials to your `.env` file
5. Test the login flow

## Security Considerations

1. Store OAuth secrets securely in environment variables
2. Use HTTPS for all redirects
3. Validate and sanitize all user data from OAuth providers
4. Implement proper error handling
5. Consider rate limiting to prevent abuse

## Troubleshooting

Common issues:

1. **Callback URL mismatch**: Ensure the callback URL in your code matches exactly what's registered with the provider
2. **Scope issues**: Some providers require specific scopes to access user information
3. **Expired tokens**: Check if the provider's tokens have expired
4. **API changes**: OAuth providers occasionally change their APIs, so check for updates

## Best Practices

1. Use a consistent user creation/update flow across providers
2. Allow users to connect multiple providers to a single account
3. Provide clear UI for users to manage their connected OAuth providers
4. Implement graceful error handling for failed OAuth attempts