"use client";

import React, { useMemo } from "react";
import { Transaction, TransactionType } from "@/hooks/useTransactions";
import { Card } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionListProps {
  transactions: Transaction[];
  type: TransactionType;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({
  transactions,
  type,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [transactions]);

  const amountClass = type === "income" ? "text-emerald-500" : "text-red-500";

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card>
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 mb-2">No {type}s found</p>
          <p className="text-sm text-slate-500">
            Click the button above to add your first {type}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                  Category
                </th>
                {/* {type === "expense" && (
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                    Payment
                  </th>
                )} */}
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                  Note (description)
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">
                  Amount
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-slate-200">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium bg-blue-500/10 text-blue-500">
                      {transaction.category}
                    </span>
                  </td>
                  {/* {type === "expense" && (
                    <td className="py-3 px-4 text-sm text-slate-400">
                      {transaction.type}
                    </td>
                  )} */}
                  <td className="py-3 px-4 text-sm text-slate-400 truncate max-w-xs">
                    {transaction.description || "-"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={cn("font-semibold", amountClass)}>
                      {formatAmount(transaction.amount)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(transaction)}
                        className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(transaction.id)}
                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
