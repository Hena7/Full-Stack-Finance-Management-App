import api from "../axios";
import { Transaction, TransactionType } from "@/hooks/useTransactions";

// Convert Backend response to Frontend Transaction shape
const mapToFrontend = (item: any, type: TransactionType): Transaction => ({
  id: item.id.toString(),
  amount: item.amount,
  type,
  categoryId: item.category?.id ?? undefined,
  category: item.category?.name ?? "Uncategorized",
  description: item.description ?? "",
  date: item.date,
});

// Build the payload Backend expects (IncomeRequest / ExpenseRequest)
const buildPayload = (data: any) => ({
  amount: Number(data.amount),
  description: data.description ?? "",
  date: data.date,
  categoryId: data.categoryId ? Number(data.categoryId) : undefined,
});

export const TransactionService = {
  getAll: async (): Promise<Transaction[]> => {
    const [incomeRes, expenseRes] = await Promise.all([
      api.get("/incomes"),
      api.get("/expenses"),
    ]);

    const incomes = incomeRes.data.map((item: any) =>
      mapToFrontend(item, "income"),
    );
    const expenses = expenseRes.data.map((item: any) =>
      mapToFrontend(item, "expense"),
    );

    return [...incomes, ...expenses];
  },

  create: async (data: any): Promise<Transaction> => {
    const endpoint = data.type === "income" ? "/incomes" : "/expenses";
    const response = await api.post(endpoint, buildPayload(data));
    return mapToFrontend(response.data, data.type);
  },

  update: async (
    id: string,
    type: TransactionType,
    updates: any,
  ): Promise<Transaction> => {
    const endpoint = type === "income" ? "/incomes" : "/expenses";
    const response = await api.put(`${endpoint}/${id}`, buildPayload(updates));
    return mapToFrontend(response.data, type);
  },

  delete: async (id: string, type: TransactionType): Promise<void> => {
    const endpoint = type === "income" ? "/incomes" : "/expenses";
    await api.delete(`${endpoint}/${id}`);
  },
};
