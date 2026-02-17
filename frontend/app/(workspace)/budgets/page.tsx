"use client";

import React, { useState, useMemo } from "react";
import { useBudget } from "@/hooks/useBudget";
import { useCategories } from "@/hooks/useCategories";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BudgetCard } from "@/components/budget/BudgetCard";
import { AlertCircle } from "lucide-react";

export default function BudgetsPage() {
  const { expenseCategories } = useCategories();
  const { setBudget, getCurrentMonthBudgets, calculateSpent } = useBudget();

  const currentDate = new Date();
  const currentMonthBudgets = getCurrentMonthBudgets();

  const currentMonthName = useMemo(() => {
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, []);

  const [budgetForm, setBudgetForm] = useState({
    category: "",
    amount: "",
    month: currentDate.getMonth().toString(),
    year: currentDate.getFullYear().toString(),
  });

  const months = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" },
  ];

  const handleSetBudget = (e: React.FormEvent) => {
    e.preventDefault();
    setBudget(
      budgetForm.category,
      parseInt(budgetForm.month),
      parseInt(budgetForm.year),
      parseFloat(budgetForm.amount),
    );

    // Reset minimal parts of form
    setBudgetForm((prev) => ({ ...prev, category: "", amount: "" }));
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          Budget Planning
        </h1>
        <p className="text-slate-400">
          Set and track monthly budgets for each category
        </p>
      </div>

      {/* Add Budget Form */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">
          Set Monthly Budget
        </h2>
        <form
          onSubmit={handleSetBudget}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          <Select
            label="Category"
            options={expenseCategories.map((c) => ({
              label: c.name,
              value: c.name,
            }))}
            placeholder="Select category"
            required
            value={budgetForm.category}
            onChange={(e) =>
              setBudgetForm({ ...budgetForm, category: e.target.value })
            }
          />

          <Input
            label="Budget Amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            required
            value={budgetForm.amount}
            onChange={(e) =>
              setBudgetForm({ ...budgetForm, amount: e.target.value })
            }
          />

          <Select
            label="Month"
            options={months.map((m) => ({ label: m.label, value: m.value }))}
            required
            value={budgetForm.month}
            onChange={(e) =>
              setBudgetForm({ ...budgetForm, month: e.target.value })
            }
          />

          <Button type="submit" variant="primary" className="w-full">
            Set Budget
          </Button>
        </form>
      </Card>

      {/* Budget Cards */}
      {currentMonthBudgets.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold text-slate-100 mb-4">
            Current Month Budgets ({currentMonthName})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {currentMonthBudgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                category={budget.category}
                budget={budget.amount}
                spent={calculateSpent(
                  budget.category,
                  budget.month,
                  budget.year,
                )}
                month={budget.month}
                year={budget.year}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-100 mb-2">
            No Budgets Set
          </h3>
          <p className="text-slate-400">
            Set your first budget using the form above
          </p>
        </div>
      )}
    </div>
  );
}
