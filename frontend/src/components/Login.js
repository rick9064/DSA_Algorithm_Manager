import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import API_BASE_URL from '../config';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader, LogIn, CheckCircle } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [resendMessage, setResendMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await user.reload(); // Ensure latest verification status
      if (!user.emailVerified) {
        await auth.signOut();
        setPendingUser(user);
        setShowVerificationModal(true);
        setIsLoading(false);
        return;
      }

      localStorage.setItem('email', user.email);
      localStorage.setItem('uid', user.uid);

      const res = await fetch(`${API_BASE_URL}/userinfo?email=${encodeURIComponent(user.email)}`);
      if (!res.ok) throw new Error(`Backend responded with status ${res.status}`);

      const data = await res.json();
      if (!data || !data.first_name || !data.last_name || !data.user_id) {
        throw new Error('Incomplete user profile data returned from backend.');
      }

      // Store user-specific keys
      localStorage.setItem(`first_name_${user.email}`, data.first_name);
      localStorage.setItem(`last_name_${user.email}`, data.last_name);
      // Also set generic keys for Navbar initial load
      localStorage.setItem('first_name', data.first_name);
      localStorage.setItem('last_name', data.last_name);
      localStorage.setItem('user_id', data.user_id);
      window.dispatchEvent(new Event('first_name_updated'));

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/home');
      }, 2000);

    } catch (error) {
      console.error('Login error:', error);

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
            Login successful. You can now access your dashboard.
          </p>
          <button
            className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto disabled:opacity-60"
            onClick={() => navigate('/home')}
          >
            Continue to Dashboard
          </button>
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

            <div className="text-right">
              <Link 
                to="/forgot-password" 
                className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 animate-fade-in">
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {errorMsg}
                </p>
              </div>
            )}

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

      {/* Email Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
            <h3 className="text-lg font-bold text-red-600 mb-2">Email Not Verified</h3>
            <p className="text-gray-700 mb-4">First confirm your email. Please check your inbox and click the verification link before logging in.</p>
            {resendMessage && <p className="text-green-600 text-sm mb-2">{resendMessage}</p>}
            <div className="flex flex-col gap-3">
              <button
                className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
                onClick={async () => {
                  try {
                    // Re-authenticate to get a fresh user object
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    await userCredential.user.reload();
                    if (userCredential.user.emailVerified) {
                      setShowVerificationModal(false);
                      setErrorMsg('');
                    } else {
                      await userCredential.user.sendEmailVerification();
                      setResendMessage('Verification email resent.');
                      await auth.signOut();
                    }
                  } catch (err) {
                    setErrorMsg('Could not verify email. Please try again or log in after verifying.');
                  }
                }}
              >
                Resend Verification Email
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-blob { animation: blob 7s infinite; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}

export default Login;
