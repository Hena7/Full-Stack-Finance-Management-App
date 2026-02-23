"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthApiService } from "@/lib/services/authService";

const TOKEN_KEY = "budgetwise_token";
const CURRENT_USER_KEY = "budgetwise_current_user";

interface User {
  email: string;
  name: string; // We store this locally since Backend token doesn't include it
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // On app start: check if token + user exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (token && savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Register: call Spring Boot /api/auth/register, then auto-login
  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<void> => {
    setIsSubmitting(true);
    try {
      await AuthApiService.register(name, email, password);
      // After registration, immediately login to get the token
      await login(email, password);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Login: call Spring Boot /api/auth/login, save token
  const login = async (email: string, password: string): Promise<void> => {
    setIsSubmitting(true);
    try {
      const response = await AuthApiService.login(email, password);

      // Save the JWT token (axios interceptor will use it)
      localStorage.setItem(TOKEN_KEY, response.token);

      // Save user info locally (Backend token contains email via JWT claims)
      const user: User = { email, name: email.split("@")[0] }; // Use email prefix as name fallback
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      setCurrentUser(user);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Logout: remove token and user from localStorage
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        isSubmitting,
        register,
        login,
        logout,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
