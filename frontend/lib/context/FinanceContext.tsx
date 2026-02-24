"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { UserSettings } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

interface FinanceContextType {
  userSettings: UserSettings;
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  updateCurrency: (currency: string) => void;
  formatCurrency: (value: number) => string;
  isAuthenticated: boolean;
  logout: () => void;
}

const FinanceContext = createContext<FinanceContextType>(
  {} as FinanceContextType,
);

export const useFinance = () => useContext(FinanceContext);

const STORAGE_KEY = "budgetwise_settings";

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser, isAuthenticated, logout: authLogout } = useAuth();

  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    // Try to load from localStorage first
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    }
    return {
      currency: "ETB",
      darkMode: true,
      notifications: true,
      name: "User",
      email: "",
    };
  });

  // Save to localStorage when settings change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userSettings));
  }, [userSettings]);

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

  const toggleDarkMode = () => {
    setUserSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const toggleNotifications = () => {
    setUserSettings((prev) => ({
      ...prev,
      notifications: !prev.notifications,
    }));
  };

  const updateCurrency = (currency: string) => {
    setUserSettings((prev) => ({ ...prev, currency }));
  };

  const formatCurrency = (value: number) => {
    const currencyCode = userSettings.currency === "ETB" ? "ETB" : "USD";
    const locale = userSettings.currency === "ETB" ? "en-ET" : "en-US";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const logout = () => {
    authLogout();
  };

  return (
    <FinanceContext.Provider
      value={{
        userSettings,
        toggleDarkMode,
        toggleNotifications,
        updateCurrency,
        formatCurrency,
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
