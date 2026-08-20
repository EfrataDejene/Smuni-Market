import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser } = useContext(AppContext);
  const location = useLocation();

  if (!currentUser) {
    // Determine where to redirect for login based on path prefix
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" replace state={{ from: location }} />;
    }
    if (location.pathname.startsWith('/seller')) {
      return <Navigate to="/seller/login" replace state={{ from: location }} />;
    }
    if (location.pathname.startsWith('/delivery')) {
      return <Navigate to="/delivery/login" replace state={{ from: location }} />;
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // User is logged in but doesn't have the required role - redirect to their dashboard
    if (currentUser.role === 'Admin') return <Navigate to="/admin/dashboard" replace />;
    if (currentUser.role === 'Seller') return <Navigate to="/seller/dashboard" replace />;
    if (currentUser.role === 'Delivery') return <Navigate to="/delivery/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
