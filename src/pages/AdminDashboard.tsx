import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, UserCircle, Plus, MoreHorizontal, GithubIcon, Mail, Trash, Edit, Shield } from 'lucide-react';

const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    role: 'admin',
    providers: ['github', 'email'],
    lastLogin: '2023-04-10T15:40:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    role: 'user',
    providers: ['github'],
    lastLogin: '2023-04-09T10:30:00Z'
  },
  {
    id: '3',
    name: 'Mark Johnson',
    email: 'mark@example.com',
    avatarUrl: null,
    role: 'user',
    providers: ['email'],
    lastLogin: '2023-04-05T08:15:00Z'
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    role: 'user',
    providers: ['github', 'email'],
    lastLogin: '2023-04-08T14:20:00Z'
  },
  {
    id: '5',
    name: 'Michael Brown',
    email: 'michael@example.com',
    avatarUrl: null,
    role: 'user',
    providers: ['email'],
    lastLogin: '2023-04-01T16:45:00Z'
  }
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">You need admin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole ? user.role === selectedRole : true;
    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage users, applications, and system settings
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'users'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'applications'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'settings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        <div className="px-4 py-5 sm:p-6">
          {activeTab === 'users' && (
            <div>
              <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <div className="mt-4 sm:mt-0 sm:flex-1">
                  <div className="flex items-center">
                    <div className="w-full max-w-lg">
                      <label htmlFor="search" className="sr-only">
                        Search
                      </label>
                      <div className="relative text-gray-400 focus-within:text-gray-600">
                        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                          <Search className="h-5 w-5" />
                        </div>
                        <input
                          id="search"
                          className="block w-full bg-white py-2 pl-10 pr-3 border border-gray-300 rounded-md leading-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          placeholder="Search users..."
                          type="search"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="ml-4">
                      <select
                        className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        value={selectedRole || ''}
                        onChange={(e) => setSelectedRole(e.target.value || null)}
                      >
                        <option value="">All roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        User
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Role
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Login Methods
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Last Login
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {user.avatarUrl ? (
                                <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt="" />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <UserCircle className="h-6 w-6 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-1">
                            {user.providers.includes('github') && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-800 text-white">
                                <GithubIcon className="h-3 w-3 mr-1" />
                                GitHub
                              </span>
                            )}
                            {user.providers.includes('email') && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.lastLogin)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="relative group">
                            <button className="text-gray-400 hover:text-gray-500 focus:outline-none">
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                            <div className="hidden group-hover:block absolute right-0 z-10 w-36 bg-white rounded-md shadow-lg overflow-hidden ring-1 ring-black ring-opacity-5">
                              <div className="py-1">
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </button>
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Change Role
                                </button>
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No users found matching your search criteria.</p>
                </div>
              )}

              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
                  <span className="font-medium">{mockUsers.length}</span> users
                </div>
                <div className="flex-1 flex justify-between sm:justify-end">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div>
              <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <div className="max-w-xl">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Registered Applications</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage the applications that use your Universal SSO for authentication.
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Register App
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by registering your first application.</p>
                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Register New Application
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <div className="max-w-xl">
                <h3 className="text-lg leading-6 font-medium text-gray-900">System Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure global system settings for your Universal SSO service.
                </p>
              </div>

              <div className="mt-6 space-y-8">
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-md font-medium text-gray-900">Authentication Providers</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Enable or disable authentication providers for your system.
                  </p>

                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between py-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <GithubIcon className="h-6 w-6 text-gray-800" />
                        <div className="ml-4">
                          <h5 className="text-sm font-medium text-gray-900">GitHub Authentication</h5>
                          <p className="text-sm text-gray-500">Allow users to sign in with GitHub</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-3 text-sm text-green-600 font-medium">Enabled</span>
                        <button
                          type="button"
                          className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary bg-primary"
                          role="switch"
                          aria-checked="true"
                        >
                          <span className="sr-only">Use setting</span>
                          <span
                            aria-hidden="true"
                            className="translate-x-5 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                          ></span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <Mail className="h-6 w-6 text-gray-800" />
                        <div className="ml-4">
                          <h5 className="text-sm font-medium text-gray-900">Email Authentication</h5>
                          <p className="text-sm text-gray-500">Allow users to sign in with email/password</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-3 text-sm text-green-600 font-medium">Enabled</span>
                        <button
                          type="button"
                          className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary bg-primary"
                          role="switch"
                          aria-checked="true"
                        >
                          <span className="sr-only">Use setting</span>
                          <span
                            aria-hidden="true"
                            className="translate-x-5 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                          ></span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <svg className="h-6 w-6 text-gray-800" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C6.478 2 2 6.478 2 12C2 17.522 6.478 22 12 22C17.522 22 22 17.522 22 12C22 6.478 17.522 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M15.5 8.5L19 12L15.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8.5 8.5L5 12L8.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 7L10 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="ml-4">
                          <h5 className="text-sm font-medium text-gray-900">Google Authentication</h5>
                          <p className="text-sm text-gray-500">Allow users to sign in with Google</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-3 text-sm text-gray-500 font-medium">Disabled</span>
                        <button
                          type="button"
                          className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary bg-gray-200"
                          role="switch"
                          aria-checked="false"
                        >
                          <span className="sr-only">Use setting</span>
                          <span
                            aria-hidden="true"
                            className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                          ></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-md font-medium text-gray-900">Security Settings</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Configure global security settings for all users.
                  </p>

                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">Require Two-Factor Authentication</h5>
                        <p className="text-sm text-gray-500">Force all users to set up 2FA for their accounts</p>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-3 text-sm text-gray-500 font-medium">Disabled</span>
                        <button
                          type="button"
                          className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary bg-gray-200"
                          role="switch"
                          aria-checked="false"
                        >
                          <span className="sr-only">Use setting</span>
                          <span
                            aria-hidden="true"
                            className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                          ></span>
                        </button>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label htmlFor="session-timeout" className="block text-sm font-medium text-gray-700">
                        Session Timeout (minutes)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="session-timeout"
                          id="session-timeout"
                          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="60"
                          defaultValue="60"
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        How long a user session remains active before requiring re-authentication.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}