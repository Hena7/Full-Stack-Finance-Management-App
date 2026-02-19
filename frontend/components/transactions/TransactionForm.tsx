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
    value: c.id.toString(), // Use ID as value, not name
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
    categoryId: "", // stores the category ID (number as string)
    paymentMethod: "",
    date: new Date().toISOString().split("T")[0],
    description: "", // maps to Backend's 'description' field
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEdit = !!transaction;

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount.toString(),
        categoryId: transaction.categoryId
          ? transaction.categoryId.toString()
          : "",
        paymentMethod: "",
        date: transaction.date,
        description: transaction.description || "",
      });
    } else {
      setFormData({
        amount: "",
        categoryId: "",
        paymentMethod: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
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

    if (!formData.categoryId) {
      setErrors((prev) => ({
        ...prev,
        categoryId: "Please select a category",
      }));
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
        amount: Number(formData.amount),
        categoryId: Number(formData.categoryId), // Send ID to Backend
        description: formData.description, // Maps to Backend's 'description'
        date: formData.date,
        type,
      });

      if (!isEdit) {
        setFormData({
          amount: "",
          categoryId: "",
          paymentMethod: "",
          date: new Date().toISOString().split("T")[0],
          description: "",
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
        value={formData.categoryId}
        onChange={(e) =>
          setFormData({ ...formData, categoryId: e.target.value })
        }
        error={errors.categoryId}
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
        label="Description (Optional)"
        placeholder="Add a description..."
        rows={3}
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
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
