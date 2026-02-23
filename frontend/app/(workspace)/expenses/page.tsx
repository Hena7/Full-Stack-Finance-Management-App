"use client";

import React, { useState } from "react";
import { useTransactions, Transaction } from "@/hooks/useTransactions";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Plus } from "lucide-react";
import { LoadingOverlay } from "@/components/ui/loading-spinner";

export default function ExpensesPage() {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByType,
    totalExpense,
    monthlyExpense,
    isLoading,
    isSubmitting,
  } = useTransactions();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const expenseList = getTransactionsByType("expense");

  const handleAdd = async (data: any) => {
    try {
      await addTransaction({ ...data, type: "expense" });
      setShowAddModal(false);
    } catch (error) {
      console.error("Failed to add expense", error);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };

  const handleUpdate = async (data: any) => {
    if (editingTransaction) {
      try {
        await updateTransaction(editingTransaction.id, "expense", data);
        setShowEditModal(false);
        setEditingTransaction(null);
      } catch (error) {
        console.error("Failed to update expense", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteTransaction(id, "expense");
      } catch (error) {
        console.error("Failed to delete expense", error);
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingOverlay />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isSubmitting && <LoadingOverlay />}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            Expense Management
          </h1>
          <p className="text-slate-400">Track all your expenses</p>
        </div>
        <Button variant="danger" onClick={() => setShowAddModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <p className="text-sm text-slate-400 mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-red-500">
            {formatCurrency(totalExpense)}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-400 mb-1">This Month</p>
          <p className="text-2xl font-bold text-red-500">
            {formatCurrency(monthlyExpense)}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-400 mb-1">Transactions</p>
          <p className="text-2xl font-bold text-blue-500">
            {expenseList.length}
          </p>
        </Card>
      </div>

      {/* Transaction List */}
      <TransactionList
        transactions={expenseList}
        type="expense"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add Expense Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Expense"
      >
        <TransactionForm
          type="expense"
          showCancel
          onSubmit={handleAdd}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Expense Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Expense"
      >
        <TransactionForm
          type="expense"
          transaction={editingTransaction}
          showCancel
          onSubmit={handleUpdate}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </div>
  );
}
