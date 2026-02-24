"use client";

import React, { useState } from "react";
import { useTransactions, Transaction } from "@/hooks/useTransactions";
import { useFinance } from "@/lib/context/FinanceContext";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Plus } from "lucide-react";
import { LoadingOverlay } from "@/components/ui/loading-spinner";

export default function IncomePage() {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByType,
    totalIncome,
    monthlyIncome,
    isLoading,
    isSubmitting,
  } = useTransactions();
  const { formatCurrency } = useFinance();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const incomeList = getTransactionsByType("income");

  const handleAdd = async (data: any) => {
    try {
      await addTransaction({ ...data, type: "income" });
      setShowAddModal(false);
    } catch (error) {
      console.error("Failed to add income", error);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };

  const handleUpdate = async (data: any) => {
    if (editingTransaction) {
      try {
        await updateTransaction(editingTransaction.id, "income", data);
        setShowEditModal(false);
        setEditingTransaction(null);
      } catch (error) {
        console.error("Failed to update income", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this income?")) {
      try {
        await deleteTransaction(id, "income");
      } catch (error) {
        console.error("Failed to delete income", error);
      }
    }
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
            Income Management
          </h1>
          <p className="text-slate-400">Track all your income sources</p>
        </div>
        <Button variant="success" onClick={() => setShowAddModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Income
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <p className="text-sm text-slate-400 mb-1">Total Income</p>
          <p className="text-2xl font-bold text-emerald-500">
            {formatCurrency(totalIncome)}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-400 mb-1">This Month</p>
          <p className="text-2xl font-bold text-emerald-500">
            {formatCurrency(monthlyIncome)}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-400 mb-1">Transactions</p>
          <p className="text-2xl font-bold text-blue-500">
            {incomeList.length}
          </p>
        </Card>
      </div>

      {/* Transaction List */}
      <TransactionList
        transactions={incomeList}
        type="income"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add Income Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Income"
      >
        <TransactionForm
          type="income"
          showCancel
          onSubmit={handleAdd}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Income Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Income"
      >
        <TransactionForm
          type="income"
          transaction={editingTransaction}
          showCancel
          onSubmit={handleUpdate}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </div>
  );
}
