import { useContext } from 'react';
import { AuthContext } from './authProvider';

const useAuth = () => useContext(AuthContext);

export default useAuth;
