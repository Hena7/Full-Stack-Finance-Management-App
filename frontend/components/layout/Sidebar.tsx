"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  TrendingUp,
  TrendingDown,
  Tag,
  Wallet,
  BarChart3,
  Settings,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/income", label: "Income", icon: TrendingUp },
  { href: "/expenses", label: "Expenses", icon: TrendingDown },
  { href: "/categories", label: "Categories", icon: Tag },
  { href: "/budgets", label: "Budgets", icon: Wallet },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { currentUser } = useAuth();

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 h-screen z-40 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
              BudgetWise
            </h1>
            <p className="text-sm text-slate-400 mt-1">Manage your finances</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => onClose()} // Close sidebar on mobile nav
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-2 font-medium",
                  isActive
                    ? "text-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800",
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-100 truncate">
                {currentUser?.name || "User"}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {currentUser?.email || "email@example.com"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
