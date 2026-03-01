"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, X } from "lucide-react";

export default function AddTransaction() {
  const router = useRouter();
  const { addTransaction, isSubmitting } = useTransactions();
  const {
    incomeCategories,
    expenseCategories,
    isLoading: categoriesLoading,
  } = useCategories();

  const [formData, setFormData] = useState({
    amount: "",
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    type: "expense" as "income" | "expense",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  // Set default category when type changes or categories load
  useEffect(() => {
    const categories =
      formData.type === "income" ? incomeCategories : expenseCategories;
    if (categories.length > 0 && !formData.categoryId) {
      setFormData((prev) => ({
        ...prev,
        categoryId: String(categories[0].id),
      }));
    }
  }, [formData.type, incomeCategories, expenseCategories, formData.categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId) return;

    try {
      await addTransaction({
        amount: parseFloat(formData.amount),
        categoryId: parseInt(formData.categoryId),
        date: formData.date,
        description: formData.description,
        type: formData.type,
      });

      setShowSuccess(true);
      setTimeout(() => {
        router.push("/transactions");
      }, 1500);
    } catch (err) {
      console.error("Failed to add transaction:", err);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
        <CheckCircle size={64} className="text-emerald-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Transaction Added!</h2>
        <p className="text-slate-500">Redirecting to history...</p>
      </div>
    );
  }

  const currentCategories =
    formData.type === "income" ? incomeCategories : expenseCategories;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Add Transaction</h2>
        <button
          onClick={() => router.back()}
          className="p-2 dark:hover:bg-slate-800 hover:bg-slate-200 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <Card className="p-6 dark:bg-slate-900 border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Toggle */}
          <div className="flex p-1 dark:bg-slate-950 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  type: "expense",
                  categoryId: expenseCategories[0]?.id.toString() || "",
                })
              }
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                formData.type === "expense"
                  ? "bg-slate-200 dark:bg-slate-800 shadow-sm dark:text-white"
                  : "text-slate-500 hover:text-slate-400"
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  type: "income",
                  categoryId: incomeCategories[0]?.id.toString() || "",
                })
              }
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                formData.type === "income"
                  ? "bg-slate-200 dark:bg-slate-800 shadow-sm dark:text-white"
                  : "text-slate-400"
              }`}
            >
              Income
            </button>
          </div>

          <Input
            label="Amount"
            type="number"
            required
            min="0.01"
            step="0.01"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            placeholder="0.00"
            className="text-lg"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Category"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              options={currentCategories.map((c) => ({
                label: c.name,
                value: String(c.id),
              }))}
              disabled={categoriesLoading}
              placeholder={categoriesLoading ? "Loading..." : "Select category"}
            />

            <Input
              label="Date"
              type="date"
              required
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>

          <Textarea
            label="Description (Notes)"
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="What was this for?"
          />

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full py-4 text-lg"
              variant="success"
              isLoading={isSubmitting}
              disabled={categoriesLoading || currentCategories.length === 0}
            >
              Add {formData.type === "income" ? "Income" : "Expense"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
