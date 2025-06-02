import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader, LogIn, CheckCircle } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Firebase sign-in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Email verification
      if (!user.emailVerified) {
        setErrorMsg('Please verify your email before logging in. Check your inbox for the verification link.');
        setIsLoading(false);
        return;
      }


        // Optionally store Firebase info
        localStorage.setItem('email', user.email);
        localStorage.setItem('uid', user.uid);



        // Replace the userinfo fetch block in your try block with this updated version:

    try {
        const res = await fetch(`https://dsa-algorithm-manager.onrender.com/userinfo?email=${encodeURIComponent(user.email)}`);

        if (!res.ok) {
            throw new Error(`Backend responded with status ${res.status}`);
        }

        const data = await res.json();

        if (!data || !data.first_name || !data.last_name || !data.user_id) {
            throw new Error('Incomplete user profile data returned from backend.');
        }

        localStorage.setItem('first_name', data.first_name);
        localStorage.setItem('last_name', data.last_name);
        localStorage.setItem('user_id', data.user_id);
    } catch (err) {
        console.error('Failed to fetch user data:', err);
        setErrorMsg('Could not load your user data. Please try again later.');
        setIsLoading(false);
        return;
    }






      setIsSuccess(true);
      setTimeout(() => {
      navigate('/home');
    }, 2000);

    } catch (error) {
      console.error('Login error:', error);
      
      // Enhanced Firebase-specific error messages
      switch (error.code) {
        case 'auth/user-not-found':
          setErrorMsg('No account found with this email address. Please check your email or register for a new account.');
          break;
        case 'auth/wrong-password':
          setErrorMsg('Incorrect password. Please check your password and try again.');
          break;
        case 'auth/invalid-email':
          setErrorMsg('Invalid email format. Please enter a valid email address.');
          break;
        case 'auth/user-disabled':
          setErrorMsg('This account has been disabled. Please contact support for assistance.');
          break;
        case 'auth/too-many-requests':
          setErrorMsg('Too many failed attempts. Please wait a few minutes before trying again.');
          break;
        case 'auth/network-request-failed':
          setErrorMsg('Network error. Please check your internet connection and try again.');
          break;
        case 'auth/invalid-credential':
          setErrorMsg('Invalid email or password. Please check your credentials and try again.');
          break;
        default:
          setErrorMsg('An unexpected error occurred. Please try again later.');
      }
    }
    
    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 overflow-hidden">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Welcome Back!</h2>
          <p className="text-gray-200 mb-4">
            Login successful. Redirecting to your dashboard...
          </p>
          <div className="animate-pulse text-purple-300">
            Taking you to your account...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background Elements - Contained within viewport */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 transform -translate-x-32 translate-y-32"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-300">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full bg-white/10 border border-white/30 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full bg-white/10 border border-white/30 rounded-lg pl-12 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                to="/forgot-password" 
                className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 animate-fade-in">
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {errorMsg}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-300">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default Login;
