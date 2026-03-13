import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Subscription from './pages/Subscription';
import PaymentSuccess from './pages/PaymentSuccess';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                    element={<Home />} />
        <Route path="/login"               element={<Login />} />
        <Route path="/register"            element={<Register />} />
        <Route path="/forgot-password"     element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard"           element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin"               element={<ProtectedRoute><AdminRoute><AdminDashboard /></AdminRoute></ProtectedRoute>} />
        <Route path="/subscription"        element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
        <Route path="/payment-success"     element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;