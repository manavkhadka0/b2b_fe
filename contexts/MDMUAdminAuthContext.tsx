"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface MDMUAdminUser {
  email: string;
}

interface MDMUAdminAuthContextType {
  user: MDMUAdminUser | null;
  isAuthenticated: boolean;
  isChecking: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const MDMUAdminAuthContext = createContext<
  MDMUAdminAuthContextType | undefined
>(undefined);

const MDMU_ADMIN_STORAGE_KEY = "mdmuAdminUser";

// Simple, frontend-only admin credentials for MDMU admin
const MDMU_ADMIN_EMAIL = process.env.NEXT_PUBLIC_MDMU_ADMIN_EMAIL;
const MDMU_ADMIN_PASSWORD = process.env.NEXT_PUBLIC_MDMU_ADMIN_PASSWORD;

export function MDMUAdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MDMUAdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedUser = window.localStorage.getItem(MDMU_ADMIN_STORAGE_KEY);
      if (storedUser) {
        const parsed = JSON.parse(storedUser) as MDMUAdminUser;
        setUser(parsed);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to read MDMU admin user from storage", error);
      window.localStorage.removeItem(MDMU_ADMIN_STORAGE_KEY);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const isValid =
        email === MDMU_ADMIN_EMAIL && password === MDMU_ADMIN_PASSWORD;

      if (isValid) {
        const adminUser: MDMUAdminUser = { email };
        setUser(adminUser);
        setIsAuthenticated(true);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            MDMU_ADMIN_STORAGE_KEY,
            JSON.stringify(adminUser),
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
      window.localStorage.removeItem(MDMU_ADMIN_STORAGE_KEY);
    }
  };

  return (
    <MDMUAdminAuthContext.Provider
      value={{ user, isAuthenticated, isChecking, login, logout }}
    >
      {children}
    </MDMUAdminAuthContext.Provider>
  );
}

export const useMDMUAdminAuth = () => {
  const ctx = useContext(MDMUAdminAuthContext);
  if (!ctx) {
    throw new Error(
      "useMDMUAdminAuth must be used within an MDMUAdminAuthProvider",
    );
  }
  return ctx;
};
