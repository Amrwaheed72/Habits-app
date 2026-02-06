import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ID, Models } from 'react-native-appwrite';
import { account } from './appwrite';

interface AuthContextProps {
  user: Models.User<Models.Preferences> | null;
  isLoading?: boolean;
  isLoggingOut?: boolean;
  signUp: (email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextProps | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const session = await account.get();
      setUser(session);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const session = await account.get();
      setUser(session);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return 'An Error occurred during sign in';
    }
  };
  const signUp = async (email: string, password: string) => {
    try {
      await account.create(ID.unique(), email, password);
      await signIn(email, password);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return 'An Error occurred during sign up';
    }
  };
  const signout = async () => {
    setIsLoggingOut(true);
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signout, isLoading, isLoggingOut }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
