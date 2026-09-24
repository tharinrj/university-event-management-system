import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";

export type UserRole = "STUDENT" | "ORGANIZER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  token: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

const AUTH_STORAGE_KEY = "unievents_user";

const AuthContext = createContext<AuthContextValue | null>(null);

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(loadUser);

  // Sync to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const setUser = useCallback((newUser: AuthUser) => {
    setUserState(newUser);
  }, []);

  const logout = useCallback(() => {
    setUserState(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
