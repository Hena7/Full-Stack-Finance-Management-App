"use client";

import React, { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { LoadingOverlay } from "@/components/ui/loading-spinner";

export default function CategoriesPage() {
  const {
    incomeCategories,
    expenseCategories,
    addCategory,
    deleteCategory,
    isLoading,
    isSubmitting,
  } = useCategories();

  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      try {
        await addCategory(newCategoryName.trim(), "income");
        setNewCategoryName("");
        setShowAddIncome(false);
      } catch (error) {
        console.error("Failed to add income category", error);
      }
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      try {
        await addCategory(newCategoryName.trim(), "expense");
        setNewCategoryName("");
        setShowAddExpense(false);
      } catch (error) {
        console.error("Failed to add expense category", error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
      } catch (error) {
        console.error("Failed to delete category", error);
        alert("Failed to delete category. It might be in use.");
      }
    }
  };

  if (
    isLoading &&
    incomeCategories.length === 0 &&
    expenseCategories.length === 0
  ) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingOverlay />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isSubmitting && <LoadingOverlay />}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Category Management
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Organize your income and expense categories
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Categories */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
              Income Categories
            </h2>
            <Button
              size="sm"
              variant="success"
              onClick={() => setShowAddIncome(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {incomeCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  </div>
                  <span className="font-medium text-slate-900 dark:text-slate-200">
                    {category.name}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {incomeCategories.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">
                  No income categories yet
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Expense Categories */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingDown className="w-6 h-6 text-red-500" />
              Expense Categories
            </h2>
            <Button
              size="sm"
              variant="danger"
              onClick={() => setShowAddExpense(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {expenseCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                  </div>
                  <span className="font-medium text-slate-900 dark:text-slate-200">
                    {category.name}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {expenseCategories.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">
                  No expense categories yet
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Add Income Category Modal */}
      <Modal
        isOpen={showAddIncome}
        onClose={() => setShowAddIncome(false)}
        title="Add Income Category"
      >
        <form onSubmit={handleAddIncome} className="space-y-4">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            label="Category Name"
            placeholder="Enter category name"
            required
          />
          <Button
            type="submit"
            variant="success"
            className="w-full"
            isLoading={isSubmitting}
          >
            Add Category
          </Button>
        </form>
      </Modal>

      {/* Add Expense Category Modal */}
      <Modal
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        title="Add Expense Category"
      >
        <form onSubmit={handleAddExpense} className="space-y-4">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            label="Category Name"
            placeholder="Enter category name"
            required
          />
          <Button
            type="submit"
            variant="danger"
            className="w-full"
            isLoading={isSubmitting}
          >
            Add Category
          </Button>
        </form>
      </Modal>
    </div>
  );
}
