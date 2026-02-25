"use client";

import React, { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
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

export default function Charts() {
  const { transactions, isLoading } = useTransactions();
  const [chartType, setChartType] = useState<"trends" | "breakdown">("trends");

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  // Prepare Trends Data
  const dataByMonth = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString("default", {
      month: "short",
    });
    const existing = acc.find((d: any) => d.name === month);
    if (existing) {
      if (t.type === "income") existing.Income += t.amount;
      else existing.Expense += t.amount;
    } else {
      acc.push({
        name: month,
        Income: t.type === "income" ? t.amount : 0,
        Expense: t.type === "expense" ? t.amount : 0,
      });
    }
    return acc;
  }, [] as any[]);

  // Prepare Category Breakdown Data (Expenses only)
  const dataByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const catName = t.category || "Uncategorized";
      const existing = acc.find((d: any) => d.name === catName);
      if (existing) existing.value += t.amount;
      else acc.push({ name: catName, value: t.amount });
      return acc;
    }, [] as any[]);

  const COLORS = [
    "#10b981", // emerald-500
    "#3b82f6", // blue-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#06b6d4", // cyan-500
    "#475569", // slate-600
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Analytics</h2>
          <p className="text-slate-400 text-sm mt-1">
            Visual breakdown of your financial habits
          </p>
        </div>
        <div className="flex dark:bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setChartType("trends")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${chartType === "trends" ? "dark:bg-slate-800 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-400"}`}
          >
            Monthly Trends
          </button>
          <button
            onClick={() => setChartType("breakdown")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${chartType === "breakdown" ? "dark:bg-slate-800 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-400"}`}
          >
            Expense Breakdown
          </button>
        </div>
      </div>

      <Card className="h-[450px] flex flex-col justify-center dark:bg-slate-900 border-slate-800 p-6">
        {transactions.length === 0 ? (
          <div className="text-center text-slate-500">
            <p>No data available to display charts.</p>
            <p className="text-xs mt-1">Add some transactions first!</p>
          </div>
        ) : chartType === "trends" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dataByMonth}
              margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis
                stroke="#64748b"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "8px",
                  color: "#f8fafc",
                }}
                cursor={{ fill: "#1e293b", opacity: 0.4 }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
              <Bar
                dataKey="Income"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey="Expense"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
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
                innerRadius={80}
                outerRadius={140}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }: any) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {dataByCategory.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "8px",
                  color: "#f8fafc",
                }}
                itemStyle={{ color: "#f8fafc" }}
                formatter={(value: any) => [`$${value.toFixed(2)}`, "Amount"]}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Summary insights derived from real data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="dark:bg-slate-900 border-slate-800 p-6 flex flex-col items-center">
          <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            Top Spending Room
          </h4>
          <p className="text-xl font-bold mt-2 dark:text-white">
            {dataByCategory.length > 0
              ? dataByCategory.sort((a, b) => b.value - a.value)[0].name
              : "N/A"}
          </p>
        </Card>
        <Card className="dark:bg-slate-900 border-slate-800 p-6 flex flex-col items-center">
          <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            Avg Monthly Expense
          </h4>
          <p className="text-xl text-red-400 font-bold mt-2 dark:text-white">
            $
            {(
              transactions
                .filter((t) => t.type === "expense")
                .reduce((a, b) => a + b.amount, 0) / (dataByMonth.length || 1)
            ).toFixed(2)}
          </p>
        </Card>
        <Card className="dark:bg-slate-900 border-slate-800 p-6 flex flex-col items-center">
          <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            Overall Savings Rate
          </h4>
          <p className="text-xl font-bold mt-2 text-emerald-500">
            {(() => {
              const inc = transactions
                .filter((t) => t.type === "income")
                .reduce((a, b) => a + Number(b.amount), 0);
              const exp = transactions
                .filter((t) => t.type === "expense")
                .reduce((a, b) => a + Number(b.amount), 0);
              return inc > 0
                ? Math.max(0, ((inc - exp) / inc) * 100).toFixed(1)
                : "0.0";
            })()}
            %
          </p>
        </Card>
      </div>
    </div>
  );
}
