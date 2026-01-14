import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn, initializeDemoData } from '@/services/storage.service';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  useEffect(() => {
    // Always ensure demo data is initialized
    initializeDemoData();
  }, []);
  
  if (!isLoggedIn()) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};
