"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage (persisted session)
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("admin_user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as AdminUser;
          setUser(parsedUser);
          setIsAdmin(true);
        } catch (e) {
          localStorage.removeItem("admin_user");
        }
      }
    }
    setLoading(false);
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

      if (!adminEmail || !adminPassword) {
        throw new Error("Admin email and password must be set in environment variables (NEXT_PUBLIC_ADMIN_EMAIL, NEXT_PUBLIC_ADMIN_PASSWORD)");
      }

      // Trim whitespace to avoid issues
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      const trimmedAdminEmail = adminEmail.trim();
      const trimmedAdminPassword = adminPassword.trim();

      // Check email first
      if (trimmedEmail !== trimmedAdminEmail) {
        throw new Error("Invalid admin credentials");
      }

      // Check password
      if (trimmedPassword !== trimmedAdminPassword) {
        throw new Error("Invalid admin credentials");
      }

      // Create admin user session
      const adminUser: AdminUser = {
        uid: "admin_" + Date.now(),
        email: trimmedEmail,
        emailVerified: true,
        isAnonymous: false,
        displayName: "Admin",
      };

      setUser(adminUser);
      setIsAdmin(true);

      // Persist session in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_user", JSON.stringify(adminUser));
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Clear local session
      setUser(null);
      setIsAdmin(false);

      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_user");
      }

      // Try to sign out from Firebase if available
      try {
        await signOut(auth);
      } catch (e) {
        // Firebase signout is optional
      }
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
