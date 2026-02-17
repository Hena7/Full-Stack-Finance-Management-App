"use client";

import React, { useState } from "react";
import { useFinance } from "@/lib/context/FinanceContext";
import { Card } from "@/components/Card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TransactionType } from "@/lib/types";

export default function Charts() {
  const { transactions } = useFinance();
  const [chartType, setChartType] = useState<"trends" | "breakdown">("trends");

  // Prepare Data
  const dataByMonth = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString("default", {
      month: "short",
    });
    const existing = acc.find((d) => d.name === month);
    if (existing) {
      if (t.type === TransactionType.INCOME) existing.Income += t.amount;
      else existing.Expense += t.amount;
    } else {
      acc.push({
        name: month,
        Income: t.type === TransactionType.INCOME ? t.amount : 0,
        Expense: t.type === TransactionType.EXPENSE ? t.amount : 0,
      });
    }
    return acc;
  }, [] as any[]);

  const dataByCategory = transactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => {
      const existing = acc.find((d) => d.name === t.category);
      if (existing) existing.value += t.amount;
      else acc.push({ name: t.category, value: t.amount });
      return acc;
    }, [] as any[]);

  const COLORS = [
    "#2dd4bf",
    "#3b82f6",
    "#fbbf24",
    "#f87171",
    "#a78bfa",
    "#fb923c",
    "#64748b",
    "#e2e8f0",
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setChartType("trends")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${chartType === "trends" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500"}`}
          >
            Trends
          </button>
          <button
            onClick={() => setChartType("breakdown")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${chartType === "breakdown" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500"}`}
          >
            Breakdown
          </button>
        </div>
      </div>

      <Card className="h-[500px] flex flex-col justify-center">
        {chartType === "trends" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dataByMonth}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                vertical={false}
              />
              <XAxis dataKey="name" stroke="#64748b" tickLine={false} />
              <YAxis
                stroke="#64748b"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#f8fafc",
                }}
                cursor={{ fill: "#334155", opacity: 0.4 }}
              />
              <Legend />
              <Bar
                dataKey="Income"
                fill="#2dd4bf"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
              <Bar
                dataKey="Expense"
                fill="#f87171"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) =>
                  `${name} ${((percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={160}
                fill="#8884d8"
                dataKey="value"
              >
                {dataByCategory.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    stroke="#1e293b"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#f8fafc",
                }}
                itemStyle={{ color: "#f8fafc" }}
                formatter={(value: any) => [`$${value}`, "Value"]}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center p-6">
          <h4 className="text-slate-500 text-sm font-medium uppercase">
            Highest Spending
          </h4>
          <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
            {dataByCategory.length > 0
              ? dataByCategory.sort((a, b) => b.value - a.value)[0].name
              : "N/A"}
          </p>
        </Card>
        <Card className="text-center p-6">
          <h4 className="text-slate-500 text-sm font-medium uppercase">
            Average Monthly Expense
          </h4>
          <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
            $
            {(
              transactions
                .filter((t) => t.type === TransactionType.EXPENSE)
                .reduce((a, b) => a + b.amount, 0) / (dataByMonth.length || 1)
            ).toFixed(0)}
          </p>
        </Card>
        <Card className="text-center p-6">
          <h4 className="text-slate-500 text-sm font-medium uppercase">
            Savings Rate
          </h4>
          <p className="text-2xl font-bold mt-2 text-teal-500">
            {(() => {
              const inc = transactions
                .filter((t) => t.type === TransactionType.INCOME)
                .reduce((a, b) => a + b.amount, 0);
              const exp = transactions
                .filter((t) => t.type === TransactionType.EXPENSE)
                .reduce((a, b) => a + b.amount, 0);
              return inc > 0
                ? Math.max(0, ((inc - exp) / inc) * 100).toFixed(1)
                : 0;
            })()}
            %
          </p>
        </Card>
      </div>
    </div>
  );
}
