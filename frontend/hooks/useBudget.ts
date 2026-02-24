"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { useTransactions } from "./useTransactions";
import {
  BudgetService,
  Budget as ApiBudget,
} from "@/lib/services/budgetService";

export interface Budget {
  id: string;
  category: string;
  categoryId: number;
  month: number;
  year: number;
  amount: number;
}

export function useBudget() {
  const { isAuthenticated } = useAuth();
  const { transactions } = useTransactions();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshBudgets = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await BudgetService.getAll();
      const mappedBudgets: Budget[] = data.map((b: ApiBudget) => ({
        id: b.id.toString(),
        category: b.category.name,
        categoryId: b.category.id,
        month: b.month - 1, // Store 0-indexed month internally to match JS Date and existing frontend logic
        year: b.year,
        amount: b.amount,
      }));
      setBudgets(mappedBudgets);
    } catch (err: any) {
      console.error("Failed to fetch budgets:", err);
      setError("Failed to load budgets.");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshBudgets();
    } else {
      setBudgets([]);
    }
  }, [isAuthenticated, refreshBudgets]);

  const setBudget = async (
    categoryId: number,
    month: number, // 0-indexed
    year: number,
    amount: number,
  ) => {
    setIsLoading(true);
    try {
      const apiMonth = month + 1; // Backend expects 1-indexed
      const existing = budgets.find(
        (b) =>
          b.categoryId === categoryId && b.month === month && b.year === year,
      );

      if (existing) {
        await BudgetService.update(existing.id, {
          amount,
          categoryId,
          month: apiMonth,
          year,
        });
      } else {
        await BudgetService.create({
          amount,
          categoryId,
          month: apiMonth,
          year,
        });
      }
      await refreshBudgets();
    } catch (err: any) {
      console.error("Set budget failed:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBudget = async (id: string) => {
    setIsLoading(true);
    try {
      await BudgetService.delete(id);
      setBudgets((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      console.error("Delete budget failed:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getBudgetByCategory = (
    categoryName: string,
    month: number,
    year: number,
  ) => {
    return budgets.find(
      (b) =>
        b.category === categoryName && b.month === month && b.year === year,
    );
  };

  const calculateSpent = (
    categoryName: string,
    month: number,
    year: number,
  ) => {
    const categoryTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return (
        t.type === "expense" &&
        t.category === categoryName &&
        date.getMonth() === month &&
        date.getFullYear() === year
      );
    });
    return categoryTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
  };

  const calculateRemaining = (
    categoryName: string,
    month: number,
    year: number,
  ) => {
    const budget = getBudgetByCategory(categoryName, month, year);
    if (!budget) return 0;

    const spent = calculateSpent(categoryName, month, year);
    return budget.amount - spent;
  };

  const isOverBudget = (categoryName: string, month: number, year: number) => {
    const remaining = calculateRemaining(categoryName, month, year);
    return remaining < 0;
  };

  const getSpendingPercentage = (
    categoryName: string,
    month: number,
    year: number,
  ) => {
    const budget = getBudgetByCategory(categoryName, month, year);
    if (!budget || budget.amount === 0) return 0;

    const spent = calculateSpent(categoryName, month, year);
    return Math.min((spent / budget.amount) * 100, 100);
  };

  const getCurrentMonthBudgets = () => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    return budgets.filter((b) => b.month === month && b.year === year);
  };

  return {
    budgets,
    isLoading,
    error,
    setBudget,
    getBudgetByCategory,
    calculateSpent,
    calculateRemaining,
    isOverBudget,
    getSpendingPercentage,
    deleteBudget,
    getCurrentMonthBudgets,
    refreshBudgets,
  };
}
