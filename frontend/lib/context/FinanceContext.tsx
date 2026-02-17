"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { Transaction, UserSettings, TransactionType } from "@/lib/types";
import { INITIAL_TRANSACTIONS } from "@/lib/services/mockData";
import { useAuth } from "@/context/AuthContext";

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, "id">) => void;
  userSettings: UserSettings;
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const FinanceContext = createContext<FinanceContextType>(
  {} as FinanceContextType,
);

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser, isAuthenticated, logout: authLogout } = useAuth();

  const [transactions, setTransactions] =
    useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    currency: "$",
    darkMode: true,
    notifications: true,
    name: "Guest User",
    email: "guest@example.com",
  });

  // Sync with Auth Context
  useEffect(() => {
    if (currentUser) {
      setUserSettings((prev) => ({
        ...prev,
        name: currentUser.name || "User",
        email: currentUser.email || "",
      }));
    }
  }, [currentUser]);

  // Theme Management
  useEffect(() => {
    if (userSettings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [userSettings.darkMode]);

  // Actions
  const addTransaction = (t: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...t,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const toggleDarkMode = () => {
    setUserSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const toggleNotifications = () => {
    setUserSettings((prev) => ({
      ...prev,
      notifications: !prev.notifications,
    }));
  };

  // Deprecated: Login is handled by AuthContext now, but keeping for compatibility if utilized elsewhere
  const login = (email: string) => {
    console.warn("Login should be handled via AuthContext");
  };

  const logout = () => {
    authLogout();
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        userSettings,
        toggleDarkMode,
        toggleNotifications,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
