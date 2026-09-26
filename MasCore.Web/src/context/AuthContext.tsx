import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import api from "../services/api";
import type { LoginRequest, LoginResponse } from "../types";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("mascore_token"),
  );

  const login = async (data: LoginRequest) => {
    const response = await api.post<LoginResponse>(
      "/api/auth/login",
      data,
    );

    localStorage.setItem(
      "mascore_token",
      response.data.token,
    );

    setToken(response.data.token);
  };

  const logout = () => {
    localStorage.removeItem("mascore_token");
    setToken(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("mascore_token");

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}