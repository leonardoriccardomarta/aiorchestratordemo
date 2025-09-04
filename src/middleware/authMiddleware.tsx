import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextHooks';

export function withAuthProtection<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <WrappedComponent {...props} />;
  };
}