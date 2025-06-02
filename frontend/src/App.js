import React from 'react';
import './css/App.css';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Search from './components/Search';
import Sort from './components/Sort';
import Queue from './components/Queue';
import Footer from './components/Footer';
import BinaryTree from './components/BinaryTree';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import Profile from './components/Profile';
import { ProfileProvider } from './context/ProfileContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function AppLayout() {
  const location = useLocation();
  const { currentUser } = useAuth();

  const authRoutes = [ '/forgot-password', '/login', '/signup'];
  const hideLayout = authRoutes.includes(location.pathname);

  return (
    <div className="App">
      {!hideLayout && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={currentUser ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/signup" element={currentUser ? <Navigate to="/home" replace /> : <Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
        <Route path="/sort" element={<PrivateRoute><Sort /></PrivateRoute>} />
        <Route path="/queue" element={<PrivateRoute><Queue /></PrivateRoute>} />
        <Route path="/binarytree" element={<PrivateRoute><BinaryTree /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideLayout && <Footer />}
    </div>
  );
}


function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <Router>
          <AppLayout />
        </Router>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;
