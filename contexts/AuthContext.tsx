"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, LoginCredentials, SignupData, AuthResponse } from "@/types/auth";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials, returnTo?: string) => Promise<void>;
  signup: (data: SignupData, returnTo?: string) => Promise<void>;
  logout: (returnTo?: string) => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
  requireAuth: (returnTo: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const decodeToken = (token: string): any | null => {
    try {
      const [, payload] = token.split(".");
      if (!payload) return null;
      const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(decoded);
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };

  const getUserFromToken = (token: string): User | null => {
    const payload = decodeToken(token);
    if (!payload) return null;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < nowInSeconds) {
      return null;
    }

    const mappedUser: User = {
      id: payload.user_id,
      email: payload.email,
      username: payload.username || payload.email?.split("@")[0] || "",
      first_name: payload.first_name || "",
      last_name: payload.last_name || "",
      user_type: payload.user_type || "Job Seeker",
      gender: payload.gender || "Other",
      phone_number: payload.phone_number,
      address: payload.address,
      created_at: payload.created_at || "",
      updated_at: payload.updated_at || "",
    };

    return mappedUser;
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decodedUser = getUserFromToken(token);
        if (decodedUser) {
          setUser(decodedUser);
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const requireAuth = (returnTo: string) => {
    if (!user && !isLoading) {
      const encodedReturnTo = encodeURIComponent(returnTo);
      router.push(`/login?returnTo=${encodedReturnTo}`);
    }
  };

  const login = async (credentials: LoginCredentials, returnTo?: string) => {
    try {
      const authResponse = await api.post<AuthResponse>(
        "/api/accounts/login/",
        credentials,
      );
      const { access, refresh } = authResponse.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      const decodedUser = getUserFromToken(access);
      if (decodedUser) {
        setUser(decodedUser);
      }

      if (returnTo) {
        router.push(decodeURIComponent(returnTo));
      } else {
        router.push("/");
      }
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw error;
    }
  };

  const signup = async (data: SignupData, returnTo?: string): Promise<void> => {
    try {
      // Backend returns tokens on register; use them directly like login
      const response = await api.post<AuthResponse>(
        "/api/accounts/register/",
        data,
      );
      const { access, refresh } = response.data;

      if (access && refresh) {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);

        const decodedUser = getUserFromToken(access);
        if (decodedUser) {
          setUser(decodedUser);
        }
      }

      if (returnTo) {
        router.push(decodeURIComponent(returnTo));
      } else {
        router.push("/");
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = (returnTo?: string) => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    const redirectUrl = returnTo
      ? `/login?returnTo=${encodeURIComponent(returnTo)}`
      : "/login";
    router.push(redirectUrl);
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await api.patch<User>("/api/user/profile/", data);
      setUser(response.data);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        isLoading,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
