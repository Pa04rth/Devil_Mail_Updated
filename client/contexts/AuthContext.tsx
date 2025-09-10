// client/contexts/AuthContext.tsx
"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin"; // Added role for type safety
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This effect is minimal to avoid session restoration from localStorage,
    // as per the original file's logic.
    setIsLoading(false);
  }, []);

  const login = async (credentials: any) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      setUser(data.user);
      setToken(data.token);

      localStorage.setItem("token", data.token);

      // Redirect admin users to the admin dashboard
      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/devil-mail/inbox");
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    router.push("/login");
  };

  const value = { user, token, login, logout, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
