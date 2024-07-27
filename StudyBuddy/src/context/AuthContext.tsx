import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from '../config/Firebase';
import * as AuthService from '../services/AuthService';

interface AdditionalUserInfo {
  firstName: string;
  lastName: string;
  university: string;
  courses: string[];
  major: string;
  year: string;
  profilePic: File | null;
}

interface AuthContextType {
  currentUser: User | null;
  signUp: (email: string, password: string, additionalInfo: AdditionalUserInfo) => Promise<User | null>;
  logIn: (email: string, password: string) => Promise<User | null>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user); // Debug log
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, additionalInfo: AdditionalUserInfo) => {
    return AuthService.signUp(email, password, additionalInfo);
  };

  const logIn = async (email: string, password: string) => {
    return AuthService.logIn(email, password);
  };

  const logOut = async () => {
    return AuthService.logOut();
  };

  return (
    <AuthContext.Provider value={{ currentUser, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
