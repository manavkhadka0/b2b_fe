"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface AdminUser {
  email: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isChecking: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

const ADMIN_STORAGE_KEY = "adminUser";

// Simple, frontend-only admin credentials
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedUser = window.localStorage.getItem(ADMIN_STORAGE_KEY);
      if (storedUser) {
        const parsed = JSON.parse(storedUser) as AdminUser;
        setUser(parsed);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to read admin user from storage", error);
      window.localStorage.removeItem(ADMIN_STORAGE_KEY);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const isValid = email === ADMIN_EMAIL && password === ADMIN_PASSWORD;

      if (isValid) {
        const adminUser: AdminUser = { email };
        setUser(adminUser);
        setIsAuthenticated(true);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            ADMIN_STORAGE_KEY,
            JSON.stringify(adminUser)
          );
        }

        resolve(true);
      } else {
        resolve(false);
      }
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{ user, isAuthenticated, isChecking, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return ctx;
};
