"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Transaction } from "@/hooks/useTransactions";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SpendingTrendChartProps {
  transactions: Transaction[];
}

export function SpendingTrendChart({ transactions }: SpendingTrendChartProps) {
  const data = useMemo(() => {
    // Sort transactions by date
    const sorted = [...transactions]
      .filter((t) => t.type === "expense")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (sorted.length === 0) return [];

    // Group by date (daily spending)
    const dailyData: Record<string, number> = {};
    sorted.forEach((t) => {
      const date = new Date(t.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      dailyData[date] = (dailyData[date] || 0) + Number(t.amount);
    });

    return Object.entries(dailyData).map(([date, amount]) => ({
      date,
      amount,
    }));
  }, [transactions]);

  return (
    <Card className="h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">
        Spending Trend
      </h3>
      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500">
          No spending data available
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
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
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                vertical={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  borderColor: "#334155",
                  color: "#f1f5f9",
                }}
                formatter={(value: number) => [`$${value}`, "Spent"]}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorAmount)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
