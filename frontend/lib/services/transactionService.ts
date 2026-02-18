import api from "../axios";
import { Transaction } from "@/hooks/useTransactions";

export const TransactionService = {
  getAll: async () => {
    const [incomeRes, expenseRes] = await Promise.all([
      api.get("/incomes"),
      api.get("/expenses"),
    ]);

    const incomes = incomeRes.data.map((item: any) => ({
      ...item,
      type: "income",
    }));

    const expenses = expenseRes.data.map((item: any) => ({
      ...item,
      type: "expense",
    }));

    return [...incomes, ...expenses];
  },

  create: async (data: any) => {
    const endpoint = data.type === "income" ? "/incomes" : "/expenses";
    const response = await api.post(endpoint, data);
    return { ...response.data, type: data.type };
  },

  update: async (id: string, type: "income" | "expense", data: any) => {
    const endpoint = type === "income" ? "/incomes" : "/expenses";
    const response = await api.put(`${endpoint}/${id}`, data);
    return { ...response.data, type: type };
  },

  delete: async (id: string, type: "income" | "expense") => {
    const endpoint = type === "income" ? "/incomes" : "/expenses";
    await api.delete(`${endpoint}/${id}`);
  },
};
