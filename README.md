# Universal SSO System

A centralized Single Sign-On (SSO) authentication system built with Node.js, Express, MySQL, and React. This system allows you to implement unified authentication across multiple applications with support for OAuth providers like GitHub and email/password login.

## Features

- OAuth integration with GitHub (expandable to other providers)
- Email/password authentication
- JWT-based authentication with refresh tokens
- User profile management
- Admin dashboard for user management
- Cross-domain support for multiple applications
- Role-based access control

## Prerequisites

- Node.js 18+
- MySQL 8+
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/universal-sso-system.git
cd universal-sso-system
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory using the provided `.env.example` as a template:

```bash
cp .env.example .env
```

4. Update the `.env` file with your specific configuration values.

5. Set up the database:

```bash
# Create the database
mysql -u root -p -e "CREATE DATABASE sso_system_dev;"

# The tables will be created automatically when you start the application
```

## GitHub OAuth Setup

1. Go to your GitHub account settings
2. Navigate to "Developer settings" > "OAuth Apps" > "New OAuth App"
3. Fill in the application details:
   - Application name: Universal SSO System
   - Homepage URL: http://localhost:5173
   - Authorization callback URL: http://localhost:3001/auth/github/callback
4. Register the application
5. Copy the Client ID and generate a Client Secret
6. Add these values to your `.env` file

## Running the Application

1. Start the development server:

```bash
# Start both frontend and backend
npm run dev:all

# Or start them separately
npm run dev     # Frontend
npm run server  # Backend
```

2. Open your browser and navigate to http://localhost:5173

## Production Deployment

1. Build the frontend:

```bash
npm run build
```

2. Set the environment variables on your server (including setting `NODE_ENV=production`)

3. Start the server:

```bash
npm run server
```

## Integrating with Your Applications

### Client-Side Integration

To integrate this SSO system with your client applications, follow these steps:

1. Add login button to your application:

```jsx
// Example React component
function LoginButton() {
  const handleLogin = () => {
    window.location.href = 'https://your-sso-domain.com/login?redirect=' + 
      encodeURIComponent(window.location.origin + '/auth/callback');
  };

  return (
    <button onClick={handleLogin}>
      Log in with Universal SSO
    </button>
  );
}
```

2. Create a callback handler in your application:

```jsx
// Example React component - /auth/callback
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthCallback() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get the token from the URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      // Store the token in localStorage or a secure cookie
      localStorage.setItem('auth_token', token);
      
      // Redirect to your application's homepage or dashboard
      navigate('/dashboard');
    } else {
      // Handle error case
      navigate('/login?error=authentication_failed');
    }
  }, [navigate]);
  
  return <div>Authenticating...</div>;
}
```

3. Add authentication check to your protected routes:

```jsx
// Example authentication check
function isAuthenticated() {
  const token = localStorage.getItem('auth_token');
  if (!token) return false;
  
  // Optional: Verify token is not expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch (e) {
    return false;
  }
}

// Protected route component
function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  
  if (!isAuthenticated()) {
    // Redirect to SSO login
    window.location.href = 'https://your-sso-domain.com/login?redirect=' + 
      encodeURIComponent(window.location.origin + '/auth/callback');
    return null;
  }
  
  return children;
}
```

### API Integration

For your backend APIs to verify the JWT token:

1. Install the required package:

```bash
npm install jsonwebtoken
```

2. Create a middleware to verify the token:

```javascript
// Example Express middleware
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    
    req.user = user;
    next();
  });
}

// Use the middleware in your routes
app.get('/api/protected-resource', authenticateToken, (req, res) => {
  // Access req.user for user information
  res.json({ message: 'Protected data', user: req.user });
});
```

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.