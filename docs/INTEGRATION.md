# Integration Guide

This document provides detailed instructions on how to integrate the Universal SSO System with your existing applications.

## Overview

The Universal SSO System can be integrated with any application that can make HTTP requests. The integration consists of:

1. Redirecting users to the SSO login page
2. Handling the callback with the authentication token
3. Using the token for authenticated API requests
4. Managing token refresh for long-lived sessions

## Integration Steps

### 1. Register Your Application (Coming Soon)

In the future, you'll need to register your application in the SSO admin dashboard to get a client ID and client secret. For now, all applications using the same SSO instance are trusted.

### 2. Frontend Integration

#### Redirect to Login

When a user clicks "Login" in your application, redirect them to the SSO login page:

```javascript
// JavaScript example
function redirectToLogin() {
  const redirectUrl = encodeURIComponent(window.location.origin + '/auth/callback');
  window.location.href = 'https://your-sso-domain.com/login?redirect=' + redirectUrl;
}
```

#### Handle the Callback

Create a route in your application to handle the callback after successful authentication:

```javascript
// Express.js example
app.get('/auth/callback', (req, res) => {
  const token = req.query.token;
  
  if (token) {
    // Store the token securely (httpOnly cookie recommended)
    res.cookie('auth_token', token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    
    // Also store the refresh token if provided
    if (req.cookies.refreshToken) {
      res.cookie('refresh_token', req.cookies.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
    }
    
    // Redirect to your application's homepage or dashboard
    res.redirect('/dashboard');
  } else {
    // Handle error case
    res.redirect('/login?error=authentication_failed');
  }
});
```

#### React Application Example

```jsx
// AuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthCallback() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get the token from the URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      // Store the token in localStorage
      localStorage.setItem('auth_token', token);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } else {
      // Handle error case
      navigate('/login?error=authentication_failed');
    }
  }, [navigate]);
  
  return <div>Authenticating...</div>;
}
```

### 3. API Authentication

Once you have the authentication token, you can use it to make authenticated requests to your APIs:

```javascript
// Example fetch request with authentication token
async function fetchProtectedData() {
  const token = localStorage.getItem('auth_token');
  
  try {
    const response = await fetch('https://your-api.com/protected-data', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 401) {
      // Token expired, attempt to refresh
      await refreshToken();
      return fetchProtectedData(); // Retry with new token
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
```

### 4. Token Refresh

Implement token refresh to maintain user sessions:

```javascript
// Token refresh function
async function refreshToken() {
  try {
    const response = await fetch('https://your-sso-domain.com/auth/refresh-token', {
      method: 'POST',
      credentials: 'include', // Important for sending cookies
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      // Refresh failed, redirect to login
      window.location.href = 'https://your-sso-domain.com/login?redirect=' + 
        encodeURIComponent(window.location.origin + '/auth/callback');
      return;
    }
    
    const data = await response.json();
    
    // Update stored token
    localStorage.setItem('auth_token', data.accessToken);
    
    return data.accessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Redirect to login
    window.location.href = 'https://your-sso-domain.com/login?redirect=' + 
      encodeURIComponent(window.location.origin + '/auth/callback');
  }
}
```

### 5. Logout Integration

Implement logout functionality in your application:

```javascript
// Logout function
async function logout() {
  try {
    // Call SSO logout endpoint
    await fetch('https://your-sso-domain.com/auth/logout', {
      method: 'POST',
      credentials: 'include', // Important for sending cookies
    });
    
    // Clear local storage
    localStorage.removeItem('auth_token');
    
    // Redirect to home page or login
    window.location.href = '/';
  } catch (error) {
    console.error('Logout failed:', error);
  }
}
```

## Backend API Integration

For your backend APIs to verify tokens:

```javascript
// Node.js / Express example
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    req.user = user;
    next();
  });
}

// Use the middleware to protect routes
app.get('/api/protected-data', authenticateToken, (req, res) => {
  // Access user information from req.user
  res.json({ 
    message: 'Protected data accessed successfully',
    userId: req.user.id,
    userRole: req.user.role 
  });
});
```

## Security Considerations

1. Always use HTTPS in production
2. Store tokens in secure, httpOnly cookies when possible
3. Implement proper CORS configuration
4. Keep your JWT_SECRET secure and unique for each environment
5. Set appropriate token expiration times

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure your SSO server has the correct CORS configuration for your application domains
2. **Token expired**: Implement token refresh as shown above
3. **Invalid signature**: Check that your JWT_SECRET is consistent between services

### Debugging

Enable verbose logging in your application to troubleshoot authentication issues:

```javascript
// Debug token verification
try {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  console.log('Token payload:', payload);
} catch (error) {
  console.error('Token verification failed:', error.message);
}
```

## Next Steps

1. Implement a more robust token storage mechanism (consider using a secure cookie library)
2. Add automatic token refresh before expiration
3. Create a higher-level authentication library for your application