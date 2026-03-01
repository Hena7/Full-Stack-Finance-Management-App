"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTransactions } from "@/hooks/useTransactions";
import { useFinance } from "@/lib/context/FinanceContext";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  BarChart3,
  Banknote,
} from "lucide-react";

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const {
    totalIncome,
    totalExpense,
    balance,
    monthlyIncome,
    monthlyExpense,
    getRecentTransactions,
  } = useTransactions();
  const { formatCurrency } = useFinance();

  const recentTransactions = getRecentTransactions(5);

  const userName = currentUser?.name?.split(" ")[0] || "User";

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Welcome back, {userName}!
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Here&#39;s your financial overview
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <StatCard
          label="Total Income"
          value={totalIncome}
          icon={TrendingUp}
          variant="success"
        />

        <StatCard
          label="Total Expenses"
          value={totalExpense}
          icon={TrendingDown}
          variant="danger"
        />

        <StatCard
          label="Balance"
          value={balance}
          icon={Wallet}
          variant={balance >= 0 ? "primary" : "danger"}
        />

        <StatCard
          label="This Month"
          value={monthlyIncome - monthlyExpense}
          icon={BarChart3}
          variant={monthlyIncome - monthlyExpense >= 0 ? "success" : "warning"}
        />
      </div>

      {/* Monthly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        <Card>
          <div className="flex flex-col h-full justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Monthly Income
            </h3>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-emerald-500">
                {formatCurrency(monthlyIncome)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                this month
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col h-full justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Monthly Expenses
            </h3>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-red-500">
                {formatCurrency(monthlyExpense)}
              </p>
              <p className="text-sm text-slate-500">this month</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <RecentTransactions transactions={recentTransactions} />
        </div>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/add"
              className="flex items-center gap-3 p-3 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors group"
            >
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <span className="text-slate-700 dark:text-slate-200 font-medium group-hover:text-emerald-500 transition-colors">
                Add Income
              </span>
            </Link>

            <Link
              href="/add"
              className="flex items-center gap-3 p-3 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors group"
            >
              <TrendingDown className="w-5 h-5 text-red-500" />
              <span className="text-slate-700 dark:text-slate-200 font-medium group-hover:text-red-500 transition-colors">
                Add Expense
              </span>
            </Link>

            <Link
              href="/budgets"
              className="flex items-center gap-3 p-3 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors group"
            >
              <Banknote className="w-5 h-5 text-amber-500" />
              <span className="text-slate-700 dark:text-slate-200 font-medium group-hover:text-amber-500 transition-colors">
                Set Budget
              </span>
            </Link>

            <Link
              href="/reports"
              className="flex items-center gap-3 p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors group"
            >
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <span className="text-slate-700 dark:text-slate-200 font-medium group-hover:text-blue-500 transition-colors">
                View Reports
              </span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
