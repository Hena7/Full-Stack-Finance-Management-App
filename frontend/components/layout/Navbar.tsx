"use client";

import React, { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  // Create current date string
  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  // Determine page title based on path
  const pageTitle = useMemo(() => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/income":
        return "Income Management";
      case "/expenses":
        return "Expense Management";
      case "/categories":
        return "Categories";
      case "/budgets":
        return "Budget Planning";
      case "/reports":
        return "Reports & Analytics";
      case "/settings":
        return "Settings";
      default:
        return "BudgetWise";
    }
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-white/80 border-b border-slate-200 dark:bg-slate-800/50 dark:border-slate-800 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Page Title (hidden on mobile, shown on desktop) */}
        <div className="hidden lg:block">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {pageTitle}
          </h2>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Current Date */}
          <div className="hidden md:block text-sm text-slate-500 dark:text-slate-400">
            {currentDate}
          </div>

          {/* Logout Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
