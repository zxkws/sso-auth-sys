import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GithubIcon, Mail, AlertCircle } from 'lucide-react';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export default function Login() {
  const [authMethod, setAuthMethod] = useState<'oauth' | 'email'>('oauth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  const from = locationState?.from?.pathname || '/';

  const handleOAuthLogin = (provider: string) => {
    setError('');
    login(provider);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Implement email login when we have a backend
    // For now, just show an error
    setIsLoading(false);
    setError('Email/password login is not implemented yet. Please use GitHub authentication.');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Access all your applications with a single account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`w-full py-2.5 px-4 text-sm font-medium rounded-md ${
                authMethod === 'oauth'
                  ? 'bg-white text-gray-900 ring-1 ring-inset ring-primary'
                  : 'text-gray-500 bg-white/10 hover:bg-gray-50'
              }`}
              onClick={() => setAuthMethod('oauth')}
            >
              OAuth
            </button>
            <button
              type="button"
              className={`w-full py-2.5 px-4 text-sm font-medium rounded-md ${
                authMethod === 'email'
                  ? 'bg-white text-gray-900 ring-1 ring-inset ring-primary'
                  : 'text-gray-500 bg-white/10 hover:bg-gray-50'
              }`}
              onClick={() => setAuthMethod('email')}
            >
              Email
            </button>
          </div>

          {authMethod === 'oauth' ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleOAuthLogin('github')}
                className="group relative w-full flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-white bg-[#24292E] hover:bg-[#24292E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#24292E]"
              >
                <GithubIcon className="h-5 w-5 mr-2" />
                Sign in with GitHub
              </button>

              <div className="text-center">
                <span className="text-sm text-gray-500">
                  More providers coming soon
                </span>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleEmailLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary/80">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-primary/70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                      </span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <Mail className="h-5 w-5 text-primary/80" aria-hidden="true" />
                      </span>
                      Sign in with Email
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-primary hover:text-primary/80">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}