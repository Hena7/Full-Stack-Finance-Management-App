"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useFinance } from "@/lib/context/FinanceContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Bell, Shield, LogOut } from "lucide-react";

export default function Settings() {
  const {
    userSettings,
    toggleDarkMode,
    toggleNotifications,
    updateCurrency,
    logout,
  } = useFinance();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateCurrency(e.target.value);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* Profile */}
      <Card className="flex items-center gap-6">
        <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
          {userSettings.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {userSettings.name}
          </h3>
          <p className="text-slate-500">{userSettings.email}</p>
          <button className="text-teal-500 text-sm font-medium mt-1 hover:underline">
            Edit Profile
          </button>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="space-y-6">
        <h3 className="text-lg font-semibold border-b border-slate-200 dark:border-slate-700 pb-2">
          Preferences
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
              {userSettings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                Dark Mode
              </p>
              <p className="text-sm text-slate-500">
                Use dark theme by default
              </p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`w-12 h-6 rounded-full transition-colors relative ${userSettings.darkMode ? "bg-teal-500" : "bg-slate-300"}`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${userSettings.darkMode ? "left-7" : "left-1"}`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
              <Bell size={20} />
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                Notifications
              </p>
              <p className="text-sm text-slate-500">
                Receive alerts for unusual spending
              </p>
            </div>
          </div>
          <button
            onClick={toggleNotifications}
            className={`w-12 h-6 rounded-full transition-colors relative ${userSettings.notifications ? "bg-teal-500" : "bg-slate-300"}`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${userSettings.notifications ? "left-7" : "left-1"}`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
              <Shield size={20} />
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                Currency
              </p>
              <p className="text-sm text-slate-500">Display currency format</p>
            </div>
          </div>
          <select
            value={userSettings.currency}
            onChange={handleCurrencyChange}
            className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="ETB">Birr (ETB)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>
      </Card>

      <div className="pt-4">
        <Button
          variant="destructive"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
