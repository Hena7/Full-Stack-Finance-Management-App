import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Transaction } from "@/hooks/useTransactions";
import { useFinance } from "@/lib/context/FinanceContext";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const { formatCurrency } = useFinance();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Recent Transactions
        </h3>
        {transactions.length > 0 && (
          <Link
            href="/transactions"
            className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
          >
            View all
          </Link>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400">
            No transactions yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const isIncome = transaction.type === "income";
            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      isIncome
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-red-500/10 text-red-500",
                    )}
                  >
                    {isIncome ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-200">
                      {transaction.category}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={cn(
                      "font-semibold",
                      isIncome ? "text-emerald-500" : "text-red-500",
                    )}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
