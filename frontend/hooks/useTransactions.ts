export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string; // Backend uses Long, but we can treat as string/number
  amount: number;
  type: TransactionType;
  category: string; // Currently string, but backend has Category entity
  description?: string; // Backend uses description, not note
  date: string;
}

import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { TransactionService } from "@/lib/services/transactionService";

export function useTransactions() {
  const { isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load transactions from API
  const refreshTransactions = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await TransactionService.getAll();
      setTransactions(data);
    } catch (err: any) {
      console.error("Failed to fetch transactions:", err);
      setError("Failed to load transactions.");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshTransactions();
    } else {
      setTransactions([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, refreshTransactions]);

  const addTransaction = async (data: any) => {
    try {
      const newTx = await TransactionService.create(data);
      // Optimistic update or refetch
      setTransactions((prev) => [newTx, ...prev]);
      return newTx;
    } catch (err: any) {
      console.error("Add failed:", err);
      throw err;
    }
  };

  const updateTransaction = async (
    id: string,
    type: TransactionType,
    updates: any,
  ) => {
    try {
      const updatedTx = await TransactionService.update(id, type, updates);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updatedTx } : t)),
      );
    } catch (err: any) {
      console.error("Update failed:", err);
      throw err;
    }
  };

  const deleteTransaction = async (id: string, type: TransactionType) => {
    try {
      await TransactionService.delete(id, type);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      console.error("Delete failed:", err);
      throw err;
    }
  };

  const getTransactionsByType = (type: TransactionType) => {
    return transactions.filter((t) => t.type === type);
  };

  const getRecentTransactions = (limit = 5) => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  // Computed
  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [transactions]);

  const balance = useMemo(
    () => totalIncome - totalExpense,
    [totalIncome, totalExpense],
  );

  const monthlyIncome = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return transactions
      .filter((t) => {
        const date = new Date(t.date);
        return (
          t.type === "income" &&
          date.getMonth() === month &&
          date.getFullYear() === year
        );
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [transactions]);

  const monthlyExpense = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return transactions
      .filter((t) => {
        const date = new Date(t.date);
        return (
          t.type === "expense" &&
          date.getMonth() === month &&
          date.getFullYear() === year
        );
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [transactions]);

  return {
    transactions,
    isLoading,
    error,
    refreshTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByType,
    getRecentTransactions,
    totalIncome,
    totalExpense,
    balance,
    monthlyIncome,
    monthlyExpense,
  };
}
