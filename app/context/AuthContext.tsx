"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import GoogleOAuthProviderWrapper from "../components/GoogleOAuthWrapper";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  picture?: string | null;
  gender?: "MALE" | "FEMALE" | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (idToken: string) => Promise<{ success: boolean; error?: string }>;
  loginWithCode: (code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const login = async (
    idToken: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.message ?? "Authentication failed" };
      }

      const userData: User = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        picture: data.picture,
      };

      setUser(userData);
      setToken(data.token);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const loginWithCode = async (
    code: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_URL}/auth/google/code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.message ?? "Authentication failed" };
      }

      const userData: User = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        picture: data.picture,
      };

      setUser(userData);
      setToken(data.token);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <GoogleOAuthProviderWrapper clientId={GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={{ user, token, isLoading, login, loginWithCode, logout, updateUser }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProviderWrapper>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
