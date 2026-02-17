"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const USERS_KEY = "budgetwise_users";
const CURRENT_USER_KEY = "budgetwise_current_user";

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  register: (name: string, email: string, password: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from local storage on mount
  useEffect(() => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const register = (name: string, email: string, password: string) => {
    const users = getUsers();
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);
    login(email, password);
  };

  const login = (email: string, password: string) => {
    const users = getUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    setCurrentUser(user);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
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
