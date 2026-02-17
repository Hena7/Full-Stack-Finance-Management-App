"use client";

import React, { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";

export default function CategoriesPage() {
  const { incomeCategories, expenseCategories, addCategory, deleteCategory } =
    useCategories();

  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim(), "income");
      setNewCategoryName("");
      setShowAddIncome(false);
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim(), "expense");
      setNewCategoryName("");
      setShowAddExpense(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      const success = deleteCategory(id);
      if (!success) {
        alert("Cannot delete default categories");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          Category Management
        </h1>
        <p className="text-slate-400">
          Organize your income and expense categories
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Categories */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
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
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  </div>
                  <span className="font-medium text-slate-200">
                    {category.name}
                  </span>
                  {category.isDefault && (
                    <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded">
                      Default
                    </span>
                  )}
                </div>

                {!category.isDefault && (
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {incomeCategories.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-500">No income categories yet</p>
              </div>
            )}
          </div>
        </Card>

        {/* Expense Categories */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
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
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                  </div>
                  <span className="font-medium text-slate-200">
                    {category.name}
                  </span>
                  {category.isDefault && (
                    <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded">
                      Default
                    </span>
                  )}
                </div>

                {!category.isDefault && (
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {expenseCategories.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-500">No expense categories yet</p>
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
          <Button type="submit" variant="success" className="w-full">
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
          <Button type="submit" variant="danger" className="w-full">
            Add Category
          </Button>
        </form>
      </Modal>
    </div>
  );
}
