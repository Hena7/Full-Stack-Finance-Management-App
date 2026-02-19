"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useTransactions } from "./useTransactions";

export interface Budget {
  id: string;
  category: string;
  month: number;
  year: number;
  amount: number;
  createdAt: string;
  updatedAt?: string;
}

export function useBudget() {
  const { currentUser } = useAuth();
  const { transactions } = useTransactions();
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const getStorageKey = (email: string) => `budgetwise_budgets_${email}`;

  // Load budgets
  useEffect(() => {
    if (!currentUser) {
      setBudgets([]);
      return;
    }

    const key = getStorageKey(currentUser.email); // Use email instead of id
    const data = localStorage.getItem(key);

    if (data) {
      setBudgets(JSON.parse(data));
    } else {
      setBudgets([]);
    }
  }, [currentUser]);

  const saveBudgets = (newBudgets: Budget[]) => {
    if (!currentUser) return;
    const key = getStorageKey(currentUser.email); // Use email instead of id
    localStorage.setItem(key, JSON.stringify(newBudgets));
    setBudgets(newBudgets);
  };

  const setBudget = (
    category: string,
    month: number,
    year: number,
    amount: number,
  ) => {
    const existingIndex = budgets.findIndex(
      (b) => b.category === category && b.month === month && b.year === year,
    );

    let newBudgets = [...budgets];

    if (existingIndex >= 0) {
      newBudgets[existingIndex] = {
        ...newBudgets[existingIndex],
        amount: Number(amount),
        updatedAt: new Date().toISOString(),
      };
    } else {
      newBudgets.push({
        id: Date.now().toString(),
        category,
        month,
        year,
        amount: Number(amount),
        createdAt: new Date().toISOString(),
      });
    }

    saveBudgets(newBudgets);
  };

  const getBudgetByCategory = (
    category: string,
    month: number,
    year: number,
  ) => {
    return budgets.find(
      (b) => b.category === category && b.month === month && b.year === year,
    );
  };

  const calculateSpent = (category: string, month: number, year: number) => {
    // Use transactions directly and filter manually
    const categoryTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return (
        t.type === "expense" &&
        t.category === category &&
        date.getMonth() === month &&
        date.getFullYear() === year
      );
    });
    return categoryTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
  };

  const calculateRemaining = (
    category: string,
    month: number,
    year: number,
  ) => {
    const budget = getBudgetByCategory(category, month, year);
    if (!budget) return 0;

    const spent = calculateSpent(category, month, year);
    return budget.amount - spent;
  };

  const isOverBudget = (category: string, month: number, year: number) => {
    const remaining = calculateRemaining(category, month, year);
    return remaining < 0;
  };

  const getSpendingPercentage = (
    category: string,
    month: number,
    year: number,
  ) => {
    const budget = getBudgetByCategory(category, month, year);
    if (!budget || budget.amount === 0) return 0;

    const spent = calculateSpent(category, month, year);
    return Math.min((spent / budget.amount) * 100, 100);
  };

  const deleteBudget = (id: string) => {
    const newBudgets = budgets.filter((b) => b.id !== id);
    saveBudgets(newBudgets);
  };

  const getCurrentMonthBudgets = () => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    return budgets.filter((b) => b.month === month && b.year === year);
  };

  return {
    budgets,
    setBudget,
    getBudgetByCategory,
    calculateSpent,
    calculateRemaining,
    isOverBudget,
    getSpendingPercentage,
    deleteBudget,
    getCurrentMonthBudgets,
  };
}
