import React, { useState, useRef, useEffect } from 'react';
import { Code2, Menu, X, Search, ArrowUpDown, List, GitBranch, Home, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState(localStorage.getItem('first_name') || 'User');
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('profile_photo') || 'https://i.pravatar.cc/40?u=r');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Detect login status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Update name/photo when events fire
  useEffect(() => {
    const updateProfile = () => {
      setFirstName(localStorage.getItem('first_name') || 'User');
      setProfilePhoto(localStorage.getItem('profile_photo') || 'https://i.pravatar.cc/40?u=r');
    };

    window.addEventListener('first_name_updated', updateProfile);
    window.addEventListener('profile_photo_updated', updateProfile);

    return () => {
      window.removeEventListener('first_name_updated', updateProfile);
      window.removeEventListener('profile_photo_updated', updateProfile);
    };
  }, []);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logged out");
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { to: '/home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { to: '/search', label: 'Search', icon: <Search className="w-4 h-4" /> },
    { to: '/sort', label: 'Sort', icon: <ArrowUpDown className="w-4 h-4" /> },
    { to: '/queue', label: 'Queue', icon: <List className="w-4 h-4" /> },
    { to: '/binaryTree', label: 'Binary Tree', icon: <GitBranch className="w-4 h-4" /> },
  ];

  const Link = ({ to, children, onClick, className }) => (
    <a href={to} onClick={onClick} className={className}>
      {children}
    </a>
  );

  return (
    <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 shadow-lg shadow-slate-900/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-3 group">
            <div className="relative">
              <Code2 className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300 group-hover:rotate-12 transform" />
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-300">
              DSA Algorithm Manager
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-1">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.to}
                    className="group relative flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white transition-all duration-300 hover:bg-white/5"
                  >
                    <span className="text-slate-400 group-hover:text-cyan-400 transition-colors duration-300">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right-side: Auth Control */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="text-slate-300 hidden md:block">Welcome, {firstName}</div>
                <div className="relative" ref={dropdownRef}>
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border border-slate-500 shadow cursor-pointer object-cover"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  />
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 text-sm text-white">
                      <button onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }} className="w-full px-4 py-2 text-left hover:bg-slate-700">Profile</button>
                      <button onClick={() => { setIsDropdownOpen(false); navigate('/settings'); }} className="w-full px-4 py-2 text-left hover:bg-slate-700">Settings</button>
                      <div className="border-t border-slate-600"></div>
                      <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-700">
                        <LogOut className="inline-block w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <button onClick={() => navigate('/login')} className="text-slate-300 hover:text-white transition">Login</button>
                <button onClick={() => navigate('/signup')} className="text-cyan-400 hover:text-cyan-300 transition">Signup</button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <nav>
            <ul className="space-y-2 pt-4 border-t border-slate-700/50">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="group flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white transition-all duration-300 hover:bg-white/5"
                  >
                    <span className="text-slate-400 group-hover:text-cyan-400 transition-colors duration-300">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
    </div>
  );
}

export default Navbar;
