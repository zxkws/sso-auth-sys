import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GithubIcon, Lock, Globe, UserPlus, Code, Shield } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Unified Authentication for All Your Apps</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              A simple, secure, and extensible Single Sign-On solution that integrates with GitHub and more.
            </p>
            {user ? (
              <Link 
                to="/profile" 
                className="inline-block px-6 py-3 bg-white text-primary font-semibold rounded-md shadow-md hover:bg-gray-100 transition duration-300"
              >
                View Your Profile
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="inline-block px-6 py-3 bg-white text-primary font-semibold rounded-md shadow-md hover:bg-gray-100 transition duration-300"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="h-12 w-full text-white" preserveAspectRatio="none" viewBox="0 0 1440 48">
            <path d="M0 48h1440V0C722 33.6 0 48 0 48z" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need for Authentication</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our SSO solution provides a complete authentication system that's easy to integrate with all your applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition duration-300">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <GithubIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">OAuth Integration</h3>
            <p className="text-gray-600">
              Connect with GitHub and other OAuth providers with just a few clicks. Easy to extend with more providers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition duration-300">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure by Default</h3>
            <p className="text-gray-600">
              JWT-based authentication, refresh tokens, and HTTPS everywhere ensure your users' data stays protected.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition duration-300">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cross-Domain Support</h3>
            <p className="text-gray-600">
              Use a single login across all your websites and applications with secure cross-domain authentication.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition duration-300">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">User Management</h3>
            <p className="text-gray-600">
              Complete user profile management, role-based access control, and admin dashboard included.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition duration-300">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Developer Friendly</h3>
            <p className="text-gray-600">
              Simple API, comprehensive documentation, and client libraries make integration a breeze.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition duration-300">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Customizable Security</h3>
            <p className="text-gray-600">
              Configure security policies, session timeouts, and access controls to match your requirements.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 md:p-12 text-center md:text-left md:flex md:items-center md:justify-between">
              <div className="md:w-2/3 mb-8 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Ready to simplify your authentication?</h2>
                <p className="text-blue-100 text-lg">
                  Get started in minutes with our easy-to-use SSO solution.
                </p>
              </div>
              <div>
                {user ? (
                  <Link 
                    to="/profile" 
                    className="inline-block px-6 py-3 bg-white text-primary font-semibold rounded-md shadow-md hover:bg-gray-100 transition duration-300"
                  >
                    View Your Profile
                  </Link>
                ) : (
                  <Link 
                    to="/login" 
                    className="inline-block px-6 py-3 bg-white text-primary font-semibold rounded-md shadow-md hover:bg-gray-100 transition duration-300"
                  >
                    Get Started Now
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}