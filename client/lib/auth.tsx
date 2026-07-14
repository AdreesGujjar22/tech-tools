"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "./firebase";

interface AdminUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  displayName: string;
}

interface AuthContextType {
  user: AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toAdminUser(firebaseUser: {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  displayName: string | null;
}): AdminUser {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || "",
    emailVerified: firebaseUser.emailVerified,
    isAnonymous: firebaseUser.isAnonymous,
    displayName: firebaseUser.displayName || "Admin",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const adminDoc = await getDoc(doc(db, "admins", firebaseUser.uid));
        setUser(toAdminUser(firebaseUser));
        setIsAdmin(adminDoc.exists());
      } catch (error) {
        console.error("Admin authorization check failed:", error);
        setUser(toAdminUser(firebaseUser));
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    if (!auth || !db) {
      throw new Error("Firebase is not configured. Add the Firebase environment variables before signing in.");
    }

    setLoading(true);
    try {
      let credential;
      try {
        credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      } catch (error: any) {
        const messages: Record<string, string> = {
          "auth/invalid-credential": "The email or password is incorrect.",
          "auth/user-not-found": "The email or password is incorrect.",
          "auth/wrong-password": "The email or password is incorrect.",
          "auth/invalid-email": "Enter a valid email address.",
          "auth/user-disabled": "This account has been disabled. Contact the site administrator.",
          "auth/too-many-requests": "Too many sign-in attempts. Wait a moment and try again.",
          "auth/network-request-failed": "We could not connect to Firebase. Check your connection and try again.",
        };
        throw new Error(messages[error?.code] || "We could not sign you in. Please try again.");
      }
      const adminDoc = await getDoc(doc(db, "admins", credential.user.uid));

      if (!adminDoc.exists()) {
        await signOut(auth);
        throw new Error("This account is not authorized to access the admin panel.");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      await signOut(auth);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, loginWithEmail, logout }}>
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
