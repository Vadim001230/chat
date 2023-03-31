import { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from './useAuth';

const RequireAuth: FC<PropsWithChildren> = ({ children }) => {
  const auth = useAuth();

  return auth?.user ? children : <Navigate to="/login" />;
};

export default RequireAuth;
