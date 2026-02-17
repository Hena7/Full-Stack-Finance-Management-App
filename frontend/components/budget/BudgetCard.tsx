"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BudgetCardProps {
  category: string;
  budget: number;
  spent: number;
  month: number;
  year: number;
}

export function BudgetCard({ category, budget, spent }: BudgetCardProps) {
  const percentage = Math.min((spent / budget) * 100, 100);
  const isOverBudget = spent > budget;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getProgressBarColor = () => {
    if (percentage < 50) return "bg-emerald-500";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-slate-200">{category}</h3>
          <p className="text-sm text-slate-400">
            {formatCurrency(spent)} spent of {formatCurrency(budget)}
          </p>
        </div>
        <div
          className={cn(
            "px-2 py-1 rounded text-xs font-semibold",
            isOverBudget
              ? "bg-red-500/10 text-red-500"
              : "bg-emerald-500/10 text-emerald-500",
          )}
        >
          {percentage.toFixed(0)}%
        </div>
      </div>

      <div className="w-full bg-slate-700 rounded-full h-2.5 mb-2">
        <div
          className={cn(
            "h-2.5 rounded-full transition-all duration-500",
            getProgressBarColor(),
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-slate-500">0%</span>
        <span
          className={cn(
            "font-medium",
            isOverBudget ? "text-red-500" : "text-slate-400",
          )}
        >
          {isOverBudget
            ? `${formatCurrency(spent - budget)} over`
            : `${formatCurrency(budget - spent)} left`}
        </span>
      </div>
    </Card>
  );
}
