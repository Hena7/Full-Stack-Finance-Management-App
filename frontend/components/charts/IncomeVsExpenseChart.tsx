"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Transaction } from "@/hooks/useTransactions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface IncomeVsExpenseChartProps {
  transactions: Transaction[];
}

export function IncomeVsExpenseChart({
  transactions,
}: IncomeVsExpenseChartProps) {
  const data = useMemo(() => {
    // Current year monthly data
    const currentYear = new Date().getFullYear();
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i).toLocaleString("default", { month: "short" }),
      income: 0,
      expense: 0,
    }));

    transactions.forEach((t) => {
      const date = new Date(t.date);
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth();
        if (t.type === "income") {
          monthlyData[month].income += Number(t.amount);
        } else {
          monthlyData[month].expense += Number(t.amount);
        }
      }
    });

    // Determine current month to show appropriate range, or just show all 6 months before/after?
    // Vue version showed simplified data. Let's show last 6 months usually, or just full year.
    // Let's filter to only show months with data or surrounding current month.
    // For simplicity, showing full year or filtered in chart view is fine.
    // Let's simplified to show only months that have *some* data or at least accumulated.
    // Actually, usually beneficial to see empty months too.
    return monthlyData;
  }, [transactions]);

  return (
    <Card className="h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">
        Income vs Expenses
      </h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              formatter={(value: number) => [`$${value}`, "Amount"]}
              cursor={{ fill: "#334155", opacity: 0.4 }}
              contentStyle={{
                backgroundColor: "#1e293b",
                borderColor: "#334155",
                color: "#f1f5f9",
              }}
            />
            <Bar
              dataKey="income"
              name="Income"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="expense"
              name="Expense"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
