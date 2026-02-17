"use client";

import React, { useMemo } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { Card } from "@/components/ui/card";
import { ExpensesPieChart } from "@/components/charts/ExpensesPieChart";
import { IncomeVsExpenseChart } from "@/components/charts/IncomeVsExpenseChart";
import { SpendingTrendChart } from "@/components/charts/SpendingTrendChart";

export default function ReportsPage() {
  const { transactions, totalIncome, totalExpense } = useTransactions();

  const uniqueCategories = useMemo(() => {
    const categories = new Set(transactions.map((t) => t.category));
    return categories.size;
  }, [transactions]);

  const avgMonthlyExpense = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    if (expenses.length === 0) return 0;

    // Group by month
    const monthlyTotals: Record<string, number> = {};
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyTotals[key] = (monthlyTotals[key] || 0) + Number(expense.amount);
    });

    const months = Object.keys(monthlyTotals).length;
    if (months === 0) return 0;

    const total = Object.values(monthlyTotals).reduce(
      (sum, val) => sum + val,
      0,
    );
    return Math.round(total / months);
  }, [transactions]);

  const savingsRate = useMemo(() => {
    if (totalIncome === 0) return 0;
    const savings = totalIncome - totalExpense;
    return Math.round((savings / totalIncome) * 100);
  }, [totalIncome, totalExpense]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          Reports & Analytics
        </h1>
        <p className="text-slate-400">Visualize your financial data</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-6">
        <Card>
          <p className="text-sm text-slate-400 mb-1">Total Transactions</p>
          <p className="text-2xl font-bold text-blue-500">
            {transactions.length}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-400 mb-1">Categories Used</p>
          <p className="text-2xl font-bold text-blue-500">{uniqueCategories}</p>
        </Card>

        <Card>
          <p className="text-sm text-slate-400 mb-1">Avg. Monthly Expense</p>
          <p className="text-2xl font-bold text-red-500">
            {formatCurrency(avgMonthlyExpense)}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-400 mb-1">Savings Rate</p>
          <p className="text-2xl font-bold text-emerald-500">{savingsRate}%</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ExpensesPieChart transactions={transactions} />
        <IncomeVsExpenseChart transactions={transactions} />
      </div>

      {/* Spending Trend (Full Width) */}
      <SpendingTrendChart transactions={transactions} />
    </div>
  );
}
