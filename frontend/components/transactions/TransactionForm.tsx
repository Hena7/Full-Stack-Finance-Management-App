"use client";

import React, { useState, useEffect } from "react";
import { useCategories } from "@/hooks/useCategories";
import { Transaction, TransactionType } from "@/hooks/useTransactions";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface TransactionFormProps {
  type: TransactionType;
  transaction?: Transaction | null;
  showCancel?: boolean;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

export function TransactionForm({
  type,
  transaction,
  showCancel = false,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const { getCategoriesByType } = useCategories();

  const categories = getCategoriesByType(type).map((c) => ({
    label: c.name,
    value: c.name,
  }));

  const paymentMethods = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "Bank Transfer",
    "Other",
  ];

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    paymentMethod: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEdit = !!transaction;

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount.toString(),
        category: transaction.category,
        paymentMethod: transaction.paymentMethod || "",
        date: transaction.date,
        note: transaction.note || "",
      });
    } else {
      setFormData({
        amount: "",
        category: "",
        paymentMethod: "",
        date: new Date().toISOString().split("T")[0],
        note: "",
      });
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.amount || Number(formData.amount) <= 0) {
      setErrors((prev) => ({ ...prev, amount: "Please enter a valid amount" }));
      return;
    }

    if (!formData.category) {
      setErrors((prev) => ({ ...prev, category: "Please select a category" }));
      return;
    }

    if (type === "expense" && !formData.paymentMethod) {
      setErrors((prev) => ({
        ...prev,
        paymentMethod: "Please select a payment method",
      }));
      return;
    }

    setLoading(true);

    try {
      onSubmit({
        ...formData,
        type,
        amount: Number(formData.amount),
      });

      if (!isEdit) {
        setFormData({
          amount: "",
          category: "",
          paymentMethod: "",
          date: new Date().toISOString().split("T")[0],
          note: "",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Amount"
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
        required
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        error={errors.amount}
      />

      <Select
        label="Category"
        options={categories}
        placeholder="Select a category"
        required
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        error={errors.category}
      />

      {type === "expense" && (
        <Select
          label="Payment Method"
          options={paymentMethods}
          placeholder="Select payment method"
          required
          value={formData.paymentMethod}
          onChange={(e) =>
            setFormData({ ...formData, paymentMethod: e.target.value })
          }
          error={errors.paymentMethod}
        />
      )}

      <Input
        label="Date"
        type="date"
        required
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        error={errors.date}
      />

      <Textarea
        label="Note (Optional)"
        placeholder="Add a note..."
        rows={3}
        value={formData.note}
        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Saving..." : isEdit ? "Update" : "Add"}{" "}
          {type === "income" ? "Income" : "Expense"}
        </Button>

        {(isEdit || showCancel) && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
