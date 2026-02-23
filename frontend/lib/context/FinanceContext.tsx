"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { UserSettings } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

interface FinanceContextType {
  userSettings: UserSettings;
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  isAuthenticated: boolean;
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

  const [userSettings, setUserSettings] = useState<UserSettings>({
    currency: "$",
    darkMode: true,
    notifications: true,
    name: "User",
    email: "",
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

  const toggleDarkMode = () => {
    setUserSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const toggleNotifications = () => {
    setUserSettings((prev) => ({
      ...prev,
      notifications: !prev.notifications,
    }));
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
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
