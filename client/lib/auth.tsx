"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { auth } from "./firebase";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser && currentUser.email) {
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        setIsAdmin(currentUser.email === adminEmail);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

      if (!adminEmail || !adminPassword) {
        throw new Error("Admin credentials not configured");
      }

      if (email !== adminEmail || password !== adminPassword) {
        throw new Error("Invalid admin credentials");
      }

      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        loginWithEmail,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
