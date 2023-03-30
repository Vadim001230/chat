import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from './useAuth';

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();

  return auth?.user ? children : <Navigate to="/login" />;
};

export default RequireAuth;
