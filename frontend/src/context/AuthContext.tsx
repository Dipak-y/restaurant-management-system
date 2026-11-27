
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import api from "../services/api";

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  login: (username: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );

  const [role, setRole] = useState<string | null>(
    localStorage.getItem("role")
  );

  const login = async (
    username: string,
    password: string
  ): Promise<string> => {
    const response = await api.post("/accounts/login/", {
      username,
      password,
    });

    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    localStorage.setItem("role", response.data.role);

    setRole(response.data.role);
    setIsAuthenticated(true);

    return response.data.role;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    try {
      if (refreshToken) {
        await api.post("/accounts/logout/", {
          refresh: refreshToken,
        });
      }
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("role");

      setRole(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
