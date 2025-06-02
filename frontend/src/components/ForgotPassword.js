// ForgotPassword.js
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase'; // adjust path as needed
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Please check your inbox.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleReset} className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <p className="text-sm text-gray-400 mb-6 text-center">
          Enter your email to receive a password reset link.
        </p>

        {message && <div className="bg-green-700 p-2 rounded mb-4 text-sm">{message}</div>}
        {error && <div className="bg-red-700 p-2 rounded mb-4 text-sm">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-500 transition-colors p-2 rounded"
        >
          Send Reset Link
        </button>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-purple-400 hover:text-purple-300 text-sm">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
