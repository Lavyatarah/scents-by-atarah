import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getStoredUser, getUserSession, hashPassword, saveStoredUser, setUserSession, type StoredUser } from "@/lib/auth";

export type AuthContextType = {
  isAuthenticated: boolean;
  userEmail: string | null;
  register: (email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const active = getUserSession();
    setIsAuthenticated(active);
    if (active) {
      const storedUser = getStoredUser();
      setUserEmail(storedUser?.email ?? null);
    }
  }, []);

  const register = async (email: string, password: string) => {
    const passwordHash = hashPassword(password);
    const previousUser = getStoredUser();
    if (previousUser && previousUser.email !== email) {
      return false;
    }
    saveStoredUser({ email, passwordHash });
    setUserSession(true);
    setUserEmail(email);
    setIsAuthenticated(true);
    return true;
  };

  const login = async (email: string, password: string) => {
    const storedUser = getStoredUser();
    if (!storedUser) {
      return false;
    }
    if (storedUser.email !== email) {
      return false;
    }
    if (storedUser.passwordHash !== hashPassword(password)) {
      return false;
    }
    setUserSession(true);
    setUserEmail(email);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setUserSession(false);
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
