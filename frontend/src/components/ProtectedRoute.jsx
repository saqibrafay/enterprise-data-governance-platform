import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Wraps any route that requires authentication.
 * Reads the token from Redux — no localStorage check needed.
 */
export default function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/login" replace />;
}
