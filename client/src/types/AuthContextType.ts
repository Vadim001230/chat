import IUser from './IUser';

type AuthContextType = {
  logIn: (userData: IUser, cb: () => void) => void;
  logOut: () => void;
  user: IUser | null;
};

export default AuthContextType;
