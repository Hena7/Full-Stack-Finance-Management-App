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

  const refreshCategories = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const data = await CategoryService.getAll();
      setCategories(data.map(mapToFrontend));
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

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

  // Delete a category
  const deleteCategory = async (id: number): Promise<void> => {
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
    incomeCategories,
    expenseCategories,
    refreshCategories,
  };
}
