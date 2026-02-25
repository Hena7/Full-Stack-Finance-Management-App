"use client";

import React, { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useFinance } from "@/lib/context/FinanceContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Search,
  Filter,
  Grid,
  List as ListIcon,
  Receipt,
  Wallet,
  Calendar,
  Trash2,
} from "lucide-react";

export default function Transactions() {
  const {
    transactions,
    isLoading,
    deleteTransaction,
    balance,
    totalIncome,
    totalExpense,
  } = useTransactions();
  const { formatCurrency } = useFinance();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter((t) => {
    const matchesCategory =
      filterCategory === "All" ||
      t.category?.toLowerCase() === filterCategory.toLowerCase();
    const matchesSearch =
      t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get unique categories for filter
  const categories = Array.from(
    new Set(transactions.map((t) => t.category).filter(Boolean)),
  );

  const handleDelete = async (id: string, type: "income" | "expense") => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction(id, type);
      } catch (err) {
        alert("Failed to delete transaction");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Transactions</h2>
          <p className="text-slate-400 text-sm mt-1">
            Browse and manage your financial history
          </p>
        </div>
        <div className="flex items-center gap-2 dark:bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-all ${viewMode === "list" ? "dark:bg-slate-800 dark:text-white" : "text-slate-500 hover:text-slate-400"}`}
          >
            <ListIcon size={18} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "dark:bg-slate-800 dark:text-white" : "text-slate-500 hover:text-slate-400"}`}
          >
            <Grid size={18} />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="dark:bg-slate-900 border-slate-800 p-4 border-l-4 border-l-emerald-500">
          <p className="text-slate-500 text-xs font-medium uppercase">
            Net Balance
          </p>
          <p className="text-2xl font-bold dark:text-white mt-1">
            {formatCurrency(balance)}
          </p>
        </Card>
        <Card className="dark:bg-slate-900 border-slate-800 p-4 border-l-4 border-l-blue-500">
          <p className="text-slate-500 text-xs font-medium uppercase">
            Total Income
          </p>
          <p className="text-2xl font-bold dark:text-white mt-1">
            {formatCurrency(totalIncome)}
          </p>
        </Card>
        <Card className="dark:bg-slate-900 border-slate-800 p-4 border-l-4 border-l-red-500">
          <p className="text-slate-500 text-xs font-medium uppercase">
            Total Expenses
          </p>
          <p className="text-2xl font-bold dark:text-white mt-1">
            {formatCurrency(totalExpense)}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search keywords or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 dark:bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white placeholder-slate-500"
          />
        </div>
        <div className="relative w-full md:w-56">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 dark:bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none dark:text-white cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {filteredTransactions.length === 0 ? (
        <Card className="py-20 flex flex-col items-center justify-center dark:bg-slate-900 border-dashed border-2 border-slate-800">
          <div className="p-4 dark:bg-slate-800 rounded-full mb-4">
            <Calendar size={32} className="text-slate-600" />
          </div>
          <p className="text-slate-500 font-medium text-lg">
            No transactions found
          </p>
          <p className="text-slate-600 text-sm mt-1">
            Try adjusting your search or filters
          </p>
          <Button
            variant="ghost"
            className="mt-4 text-emerald-500"
            onClick={() => {
              setSearchQuery("");
              setFilterCategory("All");
            }}
          >
            Clear all filters
          </Button>
        </Card>
      ) : viewMode === "list" ? (
        <div className="space-y-3">
          {filteredTransactions.map((t) => (
            <Card
              key={t.id}
              className="p-4 flex flex-col md:flex-row md:items-center justify-between border-slate-800 dark:bg-slate-900 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center gap-4 mb-2 md:mb-0">
                <div
                  className={`p-3 rounded-lg ${t.type === "income" ? "dark:bg-emerald-500/10 text-emerald-500" : "dark:bg-red-500/10 text-red-400"}`}
                >
                  {t.type === "income" ? (
                    <Wallet size={20} />
                  ) : (
                    <Receipt size={20} />
                  )}
                </div>
                <div>
                  <p className="font-semibold dark:text-white">
                    {t.description || t.category}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <span className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                      {t.category}
                    </span>
                    <span>•</span>
                    <span>{t.date}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span
                  className={`font-bold text-lg ${t.type === "income" ? "text-emerald-500" : "dark:text-white"}`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </span>
                <button
                  onClick={() => handleDelete(t.id, t.type)}
                  className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTransactions.map((t) => (
            <Card
              key={t.id}
              className="dark:bg-slate-900 border-slate-800 p-5 hover:border-slate-700 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-2.5 rounded-lg ${t.type === "income" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}
                >
                  {t.type === "income" ? (
                    <Wallet size={20} />
                  ) : (
                    <Receipt size={20} />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">
                    {t.date}
                  </span>
                  <button
                    onClick={() => handleDelete(t.id, t.type)}
                    className="p-1.5 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-2xl mb-1 dark:text-white">
                {t.type === "income" ? "+" : "-"}
                {formatCurrency(t.amount)}
              </h3>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs dark:bg-slate-800 text-slate-400 px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold">
                  {t.category}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-3 line-clamp-2 min-h-[40px]">
                {t.description || "No notes provided"}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
