import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, GithubIcon, Mail, UserCircle } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <p className="mt-2 text-gray-600">You need to be logged in to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and connected services</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'profile'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'security'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('connections')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'connections'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Connections
            </button>
          </nav>
        </div>

        <div className="px-4 py-5 sm:p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-24 w-24 rounded-full"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserCircle className="h-16 w-16 text-gray-500" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="mt-2 flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {user.role}
                    </span>
                    {user.providers.includes('github') && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-white">
                        <GithubIcon className="h-3 w-3 mr-1" />
                        GitHub
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                <p className="mt-1 text-sm text-gray-600">Update your profile information.</p>

                <form className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        defaultValue={user.name}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        defaultValue={user.email}
                        disabled={user.providers.includes('github')}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      {user.providers.includes('github') && (
                        <p className="mt-1 text-xs text-gray-500">Email managed by GitHub</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Save changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                <p className="mt-1 text-sm text-gray-600">Manage your account security settings.</p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-md font-medium text-gray-900">Change Password</h4>
                {user.providers.includes('github') && !user.providers.includes('email') ? (
                  <div className="mt-4 rounded-md bg-yellow-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Shield className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Password not available</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            You're signed in with GitHub. To set a password, you'll need to connect an email account first.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="current-password"
                        id="current-password"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="new-password"
                        id="new-password"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirm-password"
                        id="confirm-password"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Update password
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-md font-medium text-gray-900">Two-Factor Authentication</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Connected Accounts</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Connect your account to other services for easier sign in.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <ul className="space-y-4">
                  <li className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <GithubIcon className="h-6 w-6 text-gray-800" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">GitHub</h4>
                        <p className="text-sm text-gray-500">
                          {user.providers.includes('github')
                            ? 'Connected'
                            : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    {user.providers.includes('github') ? (
                      <button
                        type="button"
                        className="ml-6 text-sm font-medium text-red-600 hover:text-red-500"
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="ml-6 text-sm font-medium text-primary hover:text-primary/80"
                      >
                        Connect
                      </button>
                    )}
                  </li>

                  <li className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Mail className="h-6 w-6 text-gray-800" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">Email & Password</h4>
                        <p className="text-sm text-gray-500">
                          {user.providers.includes('email')
                            ? 'Connected'
                            : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    {user.providers.includes('email') ? (
                      <button
                        type="button"
                        className="ml-6 text-sm font-medium text-red-600 hover:text-red-500"
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="ml-6 text-sm font-medium text-primary hover:text-primary/80"
                      >
                        Connect
                      </button>
                    )}
                  </li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-md font-medium text-gray-900">Applications Using Your Account</h4>
                <p className="mt-1 text-sm text-gray-600">
                  These applications have access to your Universal SSO account.
                </p>

                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">No applications connected yet.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}