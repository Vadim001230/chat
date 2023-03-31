import { createContext, useState, ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import IUser from '../types/IUser';
import AuthContextType from '../types/AuthContextType';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const storage = localStorage.getItem('user');
  let currentUser;
  if (storage) {
    currentUser = JSON.parse(storage);
  }
  const [user, setUser] = useState(currentUser || null);

  const value = useMemo(() => {
    const logIn = (userData: IUser, cb: () => void) => {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      cb();
    };

    const logOut = () => {
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    };

    return { logIn, logOut, user };
  }, [navigate, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
