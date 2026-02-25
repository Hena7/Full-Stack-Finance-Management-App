"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  CategoryService,
  Category as BackendCategory,
} from "@/lib/services/categoryService";

// Frontend-facing Category type (lowercase type to match TransactionType)
export type CategoryType = "income" | "expense";

export interface Category {
  id: number; // Now a number (Backend Long)
  name: string;
  type: CategoryType; // lowercase for Frontend consistency
}

// Default categories to seed for new users
const DEFAULT_INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Gift",
  "Bonus",
  "Others",
];

const DEFAULT_EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Housing & Rent",
  "Utilities",
  "Healthcare",
  "Education",
  "Entertainment",
  "Shopping",
  "Savings",
  "Others",
];

export const OTHERS_CATEGORY_NAME = "Others";

// Module-level guard: prevents concurrent seeding within the same session
const seedingInProgress = new Set<string>();

export function useCategories() {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map Backend category (INCOME/EXPENSE) to Frontend category (income/expense)
  const mapToFrontend = (cat: BackendCategory): Category => ({
    id: cat.id,
    name: cat.name,
    type: cat.type.toLowerCase() as CategoryType,
  });

  // Seed default categories for a brand-new user who has none
  const seedDefaults = useCallback(async () => {
    const all: Category[] = [];
    const createAndCollect = async (
      name: string,
      type: "INCOME" | "EXPENSE",
    ) => {
      try {
        const created = await CategoryService.create(name, type);
        all.push(mapToFrontend(created));
      } catch {
        // ignore individual failures (e.g. duplicate)
      }
    };

    for (const name of DEFAULT_INCOME_CATEGORIES) {
      await createAndCollect(name, "INCOME");
    }
    for (const name of DEFAULT_EXPENSE_CATEGORIES) {
      await createAndCollect(name, "EXPENSE");
    }
    setCategories(all);
  }, []);

  const refreshCategories = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const data = await CategoryService.getAll();
      const mapped = data.map(mapToFrontend);
      setCategories(mapped);

      // Guard: only seed if user truly has 0 categories AND we haven't seeded yet.
      // The localStorage flag persists across logins/StrictMode double-mounts.
      // The module-level Set prevents two concurrent async calls both passing the check.
      const seedKey = "budgetwise_defaults_seeded";
      const alreadySeeded = localStorage.getItem(seedKey);
      if (
        mapped.length === 0 &&
        !alreadySeeded &&
        !seedingInProgress.has(seedKey)
      ) {
        seedingInProgress.add(seedKey);
        localStorage.setItem(seedKey, "true");
        await seedDefaults();
        seedingInProgress.delete(seedKey);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, seedDefaults]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCategories();
    } else {
      setCategories([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, refreshCategories]);

  // Add a new category by calling the Backend
  const addCategory = async (
    name: string,
    type: CategoryType,
  ): Promise<Category> => {
    setIsSubmitting(true);
    try {
      const backendType = type.toUpperCase() as "INCOME" | "EXPENSE";
      const created = await CategoryService.create(name, backendType);
      const mapped = mapToFrontend(created);
      setCategories((prev) => [...prev, mapped]);
      return mapped;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a category - "Others" is protected and cannot be deleted
  const deleteCategory = async (id: number): Promise<void> => {
    const cat = categories.find((c) => c.id === id);
    if (cat?.name === OTHERS_CATEGORY_NAME) {
      alert('The "Others" category cannot be deleted.');
      return;
    }
    setIsSubmitting(true);
    try {
      await CategoryService.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter categories by type (income | expense)
  const getCategoriesByType = (type: CategoryType): Category[] => {
    return categories.filter((c) => c.type === type);
  };

  // Get the "Others" category ID for a given type (used as fallback)
  const getOthersCategoryId = (type: CategoryType): number | null => {
    const others = categories.find(
      (c) => c.type === type && c.name === OTHERS_CATEGORY_NAME,
    );
    return others?.id ?? null;
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
    isLoading,
    isSubmitting,
    addCategory,
    deleteCategory,
    getCategoriesByType,
    getOthersCategoryId,
    incomeCategories,
    expenseCategories,
    refreshCategories,
  };
}
