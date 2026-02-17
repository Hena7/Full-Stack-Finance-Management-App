"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFinance } from "@/lib/context/FinanceContext";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Category, TransactionType } from "@/lib/types";
import { CheckCircle, X } from "lucide-react";

export default function AddTransaction() {
  const router = useRouter();
  const { addTransaction } = useFinance();

  const [formData, setFormData] = useState({
    amount: "",
    category: Category.FOOD,
    date: new Date().toISOString().split("T")[0],
    notes: "",
    type: TransactionType.EXPENSE,
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) return;

    addTransaction({
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      notes: formData.notes,
      type: formData.type,
    });

    setShowSuccess(true);
    setTimeout(() => {
      router.push("/transactions");
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
        <CheckCircle size={64} className="text-teal-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Transaction Added!</h2>
        <p className="text-slate-500">Redirecting to list...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Add Transaction</h2>
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
        >
          <X size={24} />
        </button>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Toggle */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, type: TransactionType.EXPENSE })
              }
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.type === TransactionType.EXPENSE ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500"}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, type: TransactionType.INCOME })
              }
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.type === TransactionType.INCOME ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500"}`}
            >
              Income
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                $
              </span>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full pl-8 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white text-lg"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as Category,
                  })
                }
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white cursor-pointer"
              >
                {Object.values(Category).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Notes
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white resize-none"
              placeholder="What was this for?"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" fullWidth className="py-3 text-lg">
              Add Transaction
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
