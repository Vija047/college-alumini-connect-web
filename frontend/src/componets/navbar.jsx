import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, Menu, ChevronDown, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://alumini-connect-backend.vercel.app/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user');

        const data = await response.json();
        setEmail(data.email || '');
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const getInitials = (email) => {
    if (!email) return 'U';
    const parts = email.split('@')[0].split('.');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.charAt(0).toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            <button 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 md:hidden hover:text-gray-900 hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <a href="/" className="flex items-center">
              <div className="bg-blue-600 text-white font-bold rounded-lg h-8 w-8 flex items-center justify-center mr-2">A</div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Alumini</span>
            </a>
          </div>
          
          {/* Desktop Nav Items */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="search"
                className="block w-64 py-2 pl-10 pr-3 text-sm text-gray-900 bg-gray-50 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Search for alumni..."
              />
            </div>
            
            <button className="relative p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-gray-800">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors dark:hover:bg-gray-800"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium shadow-sm">
                  {getInitials(email)}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {loading ? 'Loading...' : email || 'Not signed in'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Alumnus since 2023</p>
                  </div>
                  
                  <div className="py-1">
                    <a href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                      <User className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Profile
                    </a>
                    <a href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                      <svg className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                      </svg>
                      Settings
                    </a>
                    <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="p-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="search"
                  className="block w-full py-2 pl-10 pr-3 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Search..."
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                  {getInitials(email)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {loading ? 'Loading...' : email || 'Not signed in'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Alumnus</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 text-red-600 rounded-md hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-800"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
            
            <a href="/profile" className="flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
              <User className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
              Profile
            </a>
            
            <a href="/settings" className="flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
              <svg className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
              Settings
            </a>
            
            <a href="/notifications" className="flex items-center px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
              <Bell className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
              Notifications
              <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">2</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;