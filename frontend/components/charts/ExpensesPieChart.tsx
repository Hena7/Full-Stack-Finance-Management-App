"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Transaction } from "@/hooks/useTransactions";
import { useFinance } from "@/lib/context/FinanceContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface ExpensesPieChartProps {
  transactions: Transaction[];
}

export function ExpensesPieChart({ transactions }: ExpensesPieChartProps) {
  const { formatCurrency } = useFinance();
  const data = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const categoryTotals: Record<string, number> = {};

    expenses.forEach((t) => {
      const category = t.category || "Uncategorized";
      categoryTotals[category] =
        (categoryTotals[category] || 0) + Number(t.amount);
    });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const COLORS = [
    "#ef4444", // Red 500
    "#f97316", // Orange 500
    "#eab308", // Yellow 500
    "#22c55e", // Green 500
    "#3b82f6", // Blue 500
    "#a855f7", // Purple 500
    "#ec4899", // Pink 500
    "#64748b", // Slate 500
  ];

  return (
    <Card className="h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold dark:text-slate-100 mb-4">
        Expense Breakdown
      </h3>
      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500">
          No expense data available
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [
                  value ? formatCurrency(Number(value)) : formatCurrency(0),
                  "Amount",
                ]}
                contentStyle={{
                  backgroundColor: "#fff",
                  borderColor: "#334155",
                  color: "#f1f5f9",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
