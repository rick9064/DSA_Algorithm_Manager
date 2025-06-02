// src/components/PrivateRoute.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (currentUser) {
    return children;
  }

  return (
   <div className="relative h-screen w-screen">
  {/* Blurred background content */}
  <div className="blur-sm brightness-50 pointer-events-none select-none h-full">
    {children}
  </div>

  {/* Popup overlay */}
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
    <div className="bg-white shadow-2xl rounded-lg p-6 max-w-sm w-full text-center space-y-4 animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-800">Authentication Required</h2>
      <p className="text-sm text-gray-600">Please log in or sign up to access this page.</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          Signup
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

export default PrivateRoute;
