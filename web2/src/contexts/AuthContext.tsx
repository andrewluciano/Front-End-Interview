/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "@/APIS/BaseApis";

interface User {
  id: string;
  name: string;
  email: string;
  role: "medico" | "administrador" | "faturista";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string,
  ) => Promise<void>;
  logout: () => void;
  recoverPassword: (email: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem("bearer_token"),
  );
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem("user_data");
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser) as User;
    } catch {
      return null;
    }
  });
  const [isLoading] = useState(false);
  const navigate = useNavigate();

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Credenciais inválidas");

      const data = await response.json();
      const bearerToken = data.token;
      const userData = data.user;

      sessionStorage.setItem("bearer_token", bearerToken);
      sessionStorage.setItem("user_data", JSON.stringify(userData));

      setToken(bearerToken);
      setUser(userData);

      navigate(
        userData.role === "medico" ? "/dashboard/medico" : "/dashboard/admin",
        { replace: true },
      );
    },
    [navigate],
  );

  const register = useCallback(
    async (name: string, email: string, password: string, role: string) => {
      const response = await fetch(`${baseURL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!response.ok) throw new Error("Erro ao criar conta");

      const data = await response.json();
      const bearerToken = data.token;
      const userData = data.user;

      sessionStorage.setItem("bearer_token", bearerToken);
      sessionStorage.setItem("user_data", JSON.stringify(userData));

      setToken(bearerToken);
      setUser(userData);

      navigate(
        userData.role === "medico" ? "/dashboard/medico" : "/dashboard/admin",
        { replace: true },
      );
    },
    [navigate],
  );

  const recoverPassword = useCallback(async (email: string) => {
    const response = await fetch(`${baseURL}/auth/recover`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) throw new Error("Erro ao enviar email de recuperação");
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("bearer_token");
    sessionStorage.removeItem("user_data");
    setToken(null);
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      register,
      logout,
      recoverPassword,
      isLoading,
    }),
    [user, token, login, register, logout, recoverPassword, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
