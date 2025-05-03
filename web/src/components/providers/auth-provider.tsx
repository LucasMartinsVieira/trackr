"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { checkAuthStatus, getAuthToken } from "@/app/actions/auth";
import { baseUrlApi } from "@/app/utils/url";

type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setError: (error: string | null) => void;
  setLoggedIn: (status: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  error: null,
  isLoggedIn: false,
  setUser: () => {},
  setToken: () => {},
  setError: () => {},
  setLoggedIn: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const token = await getAuthToken();

      if (token) {
        setToken(token);
      }

      try {
        const response = await fetch(`${baseUrlApi()}/auth/me`, {
          method: "GET",
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();

          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAuthStatus = async () => {
      const status = await checkAuthStatus();
      setLoggedIn(status);
    };

    checkSession();
    fetchAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isLoggedIn,
        setUser,
        setToken,
        setError,
        setLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
