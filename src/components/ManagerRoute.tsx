import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ManagerRouteProps {
  children: React.ReactNode;
}

const ManagerRoute: React.FC<ManagerRouteProps> = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (!user || role !== 'manager') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ManagerRoute;