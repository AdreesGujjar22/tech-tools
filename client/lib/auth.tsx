"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  bootstrapAdmin: () => Promise<void>;
  bypassAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have a simulated local dev bypass session
    if (typeof window !== "undefined") {
      const isSimulated = localStorage.getItem("dev_bypass_active") === "true";
      if (isSimulated) {
        const simulatedUser = {
          uid: "simulated_developer_123",
          email: "webdevsoftwareengineer@gmail.com",
          displayName: "Simulated Developer",
          emailVerified: true,
        } as any;
        setUser(simulatedUser);
        setIsAdmin(true);
        setLoading(false);
        return;
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Check if this user ID exists in the '/admins' collection
          const adminRef = doc(db, "admins", currentUser.uid);
          const adminSnap = await getDoc(adminRef);
          setIsAdmin(adminSnap.exists());
        } catch (error) {
          console.error("Error reading admin status:", error);
          setIsAdmin(false);
        }
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
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signupWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // inside iframe popup may be blocked, try-catch handles it cleanly
      await signInWithPopup(auth, provider);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("dev_bypass_active");
      }
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error("Logout Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const bootstrapAdmin = async () => {
    if (!user) {
      throw new Error("Must be signed in to bootstrap.");
    }
    
    // We can only bootstrap if current email is 'webdevsoftwareengineer@gmail.com'
    if (user.email !== "webdevsoftwareengineer@gmail.com") {
      throw new Error(`Only webdevsoftwareengineer@gmail.com is authorized to bootstrap admin privileges.`);
    }

    try {
      const adminRef = doc(db, "admins", user.uid);
      await setDoc(adminRef, {
        email: user.email,
        bootstrappedAt: new Date().toISOString()
      });
      setIsAdmin(true);
    } catch (error) {
      console.error("Bootstrap Admin Error: ", error);
      throw error;
    }
  };

  const bypassAuth = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dev_bypass_active", "true");
      const simulatedUser = {
        uid: "simulated_developer_123",
        email: "webdevsoftwareengineer@gmail.com",
        displayName: "Simulated Developer",
        emailVerified: true,
      } as any;
      setUser(simulatedUser);
      setIsAdmin(true);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      loading,
      loginWithEmail,
      signupWithEmail,
      loginWithGoogle,
      logout,
      bootstrapAdmin,
      bypassAuth
    }}>
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
