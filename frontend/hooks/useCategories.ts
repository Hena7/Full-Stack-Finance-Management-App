"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useMemo } from "react";

export type CategoryType = "income" | "expense";

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  isDefault: boolean;
  createdAt?: string;
}

const DEFAULT_CATEGORIES = {
  income: ["Salary", "Freelance", "Investment", "Gift"],
  expense: [
    "Food",
    "Transport",
    "Rent",
    "Utilities",
    "Entertainment",
    "Healthcare",
    "Shopping",
  ],
};

export function useCategories() {
  const { currentUser } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);

  const getStorageKey = (userId: string) => `budgetwise_categories_${userId}`;

  // Load categories
  useEffect(() => {
    if (!currentUser) {
      setCategories([]);
      return;
    }

    const key = getStorageKey(currentUser.id);
    const data = localStorage.getItem(key);

    if (data) {
      setCategories(JSON.parse(data));
    } else {
      initializeDefaultCategories();
    }
  }, [currentUser]);

  const saveCategories = (cats: Category[]) => {
    if (!currentUser) return;
    const key = getStorageKey(currentUser.id);
    localStorage.setItem(key, JSON.stringify(cats));
    setCategories(cats);
  };

  const initializeDefaultCategories = () => {
    if (!currentUser) return;

    const defaultCats: Category[] = [];

    DEFAULT_CATEGORIES.income.forEach((name) => {
      defaultCats.push({
        id: `income-${Date.now()}-${Math.random()}`,
        name,
        type: "income",
        isDefault: true,
      });
    });

    DEFAULT_CATEGORIES.expense.forEach((name) => {
      defaultCats.push({
        id: `expense-${Date.now()}-${Math.random()}`,
        name,
        type: "expense",
        isDefault: true,
      });
    });

    saveCategories(defaultCats);
  };

  const addCategory = (name: string, type: CategoryType) => {
    const newCategory: Category = {
      id: `${type}-${Date.now()}`,
      name,
      type,
      isDefault: false,
      createdAt: new Date().toISOString(),
    };
    saveCategories([...categories, newCategory]);
    return newCategory;
  };

  const deleteCategory = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category && !category.isDefault) {
      const newCats = categories.filter((c) => c.id !== id);
      saveCategories(newCats);
      return true;
    }
    return false;
  };

  const getCategoriesByType = (type: CategoryType) => {
    return categories.filter((c) => c.type === type);
  };

  const incomeCategories = useMemo(
    () => getCategoriesByType("income"),
    [categories],
  );
  const expenseCategories = useMemo(
    () => getCategoriesByType("expense"),
    [categories],
  );

  return {
    categories,
    addCategory,
    deleteCategory,
    getCategoriesByType,
    incomeCategories,
    expenseCategories,
  };
}
