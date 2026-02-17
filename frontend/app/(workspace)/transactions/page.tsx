"use client";

import React, { useState } from "react";
import { useFinance } from "@/lib/context/FinanceContext";
import { Card } from "@/components/Card";
import { Category, TransactionType } from "@/lib/types";
import {
  Search,
  Filter,
  Grid,
  List as ListIcon,
  Receipt,
  Wallet,
} from "lucide-react";

export default function Transactions() {
  const { transactions, userSettings } = useFinance();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter((t) => {
    const matchesCategory =
      filterCategory === "All" || t.category === filterCategory;
    const matchesSearch =
      t.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md ${viewMode === "list" ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white" : "text-slate-400"}`}
          >
            <ListIcon size={18} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md ${viewMode === "grid" ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white" : "text-slate-400"}`}
          >
            <Grid size={18} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white placeholder-slate-400"
          />
        </div>
        <div className="relative w-full md:w-48">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none dark:text-white cursor-pointer"
          >
            <option value="All">All Categories</option>
            {Object.values(Category).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {viewMode === "list" ? (
        <div className="space-y-3">
          {filteredTransactions.map((t) => (
            <Card
              key={t.id}
              noPadding
              className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:border-teal-500/50 transition-colors"
            >
              <div className="flex items-center gap-4 mb-2 md:mb-0">
                <div
                  className={`p-3 rounded-lg ${t.type === TransactionType.INCOME ? "bg-teal-500/10 text-teal-600 dark:text-teal-400" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"}`}
                >
                  {t.type === TransactionType.INCOME ? (
                    <Wallet size={20} />
                  ) : (
                    <Receipt size={20} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {t.notes || t.category}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.date} • {t.category}
                  </p>
                </div>
              </div>
              <span
                className={`font-semibold text-lg ${t.type === TransactionType.INCOME ? "text-teal-600 dark:text-teal-400" : "text-slate-900 dark:text-slate-100"}`}
              >
                {t.type === TransactionType.INCOME ? "+" : "-"}
                {userSettings.currency}
                {t.amount}
              </span>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTransactions.map((t) => (
            <Card
              key={t.id}
              className="hover:border-teal-500/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-2 rounded-lg ${t.type === TransactionType.INCOME ? "bg-teal-500/10 text-teal-600 dark:text-teal-400" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"}`}
                >
                  {t.type === TransactionType.INCOME ? (
                    <Wallet size={20} />
                  ) : (
                    <Receipt size={20} />
                  )}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {t.date}
                </span>
              </div>
              <h3 className="font-bold text-xl mb-1 dark:text-white">
                {t.type === TransactionType.INCOME ? "+" : "-"}
                {userSettings.currency}
                {t.amount}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                {t.category}
              </p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                {t.notes}
              </p>
            </Card>
          ))}
        </div>
      )}

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p>No transactions found.</p>
        </div>
      )}
    </div>
  );
}
