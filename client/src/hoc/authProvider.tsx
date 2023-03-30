import { createContext, useState, ReactNode, useMemo } from 'react';
import IUser from '../types/IUser';
import AuthContextType from '../types/AuthContextType';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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

    const logOut = (cb: () => void) => {
      localStorage.removeItem('user');
      setUser(null);
      cb();
    };

    return { logIn, logOut, user };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
