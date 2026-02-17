"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useMemo } from "react";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  paymentMethod?: string;
  date: string;
  note?: string;
  createdAt: string;
  updatedAt?: string;
}

export function useTransactions() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getStorageKey = (userId: string) => `budgetwise_transactions_${userId}`;

  // Load transactions
  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    const key = getStorageKey(currentUser.id);
    const data = localStorage.getItem(key);

    if (data) {
      setTransactions(JSON.parse(data));
    } else {
      setTransactions([]);
    }
    setIsLoading(false);
  }, [currentUser]);

  const saveTransactions = (txs: Transaction[]) => {
    if (!currentUser) return;
    const key = getStorageKey(currentUser.id);
    localStorage.setItem(key, JSON.stringify(txs));
    setTransactions(txs);
  };

  const addTransaction = (data: Omit<Transaction, "id" | "createdAt">) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...data,
      amount: Number(data.amount), // Ensure number
      createdAt: new Date().toISOString(),
    };
    saveTransactions([newTransaction, ...transactions]); // Add to top
    return newTransaction;
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    const newTransactions = transactions.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          ...updates,
          amount: updates.amount ? Number(updates.amount) : t.amount,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });
    saveTransactions(newTransactions);
  };

  const deleteTransaction = (id: string) => {
    const newTransactions = transactions.filter((t) => t.id !== id);
    saveTransactions(newTransactions);
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

  const getTransactionsByMonth = (
    month: number,
    year: number,
    type?: TransactionType,
  ) => {
    return transactions.filter((t) => {
      const date = new Date(t.date);
      const matchesMonth =
        date.getMonth() === month && date.getFullYear() === year;
      const matchesType = type ? t.type === type : true;
      return matchesMonth && matchesType;
    });
  };

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByType,
    getRecentTransactions,
    getTransactionsByMonth,
    totalIncome,
    totalExpense,
    balance,
    monthlyIncome,
    monthlyExpense,
  };
}
