import { useContext } from 'react';
import AuthContextType from '../types/AuthContextType';
import { AuthContext } from './authProvider';

const useAuth = () => useContext(AuthContext) as AuthContextType;

export default useAuth;
