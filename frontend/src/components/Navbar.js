import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, LogIn, UserPlus, LogOut, Menu, X, Code } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);


  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link className="flex items-center space-x-2 font-bold text-xl" to="/">
              <Code size={24} />
              <span>Collaborative IDE</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isAuthenticated ? (
                <>
                  <Link className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-150 ease-in-out" to="/home">
                    <Home size={18} className="mr-1" />
                    Home
                  </Link>
                  <button onClick={() => logout()} className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-150 ease-in-out">
                    <LogOut size={18} className="mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-150 ease-in-out" to="/login">
                    <LogIn size={18} className="mr-1" />
                    Login
                  </Link>
                  <Link className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-150 ease-in-out" to="/register">
                    <UserPlus size={18} className="mr-1" />
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                <Link className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition duration-150 ease-in-out" to="/" onClick={toggleMenu}>
                  <Home size={18} className="mr-2" />
                  Home
                </Link>
                <button className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition duration-150 ease-in-out" onClick={() => { logout(); toggleMenu(); }}>
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition duration-150 ease-in-out" to="/login" onClick={toggleMenu}>
                  <LogIn size={18} className="mr-2" />
                  Login
                </Link>
                <Link className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition duration-150 ease-in-out" to="/register" onClick={toggleMenu}>
                  <UserPlus size={18} className="mr-2" />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;