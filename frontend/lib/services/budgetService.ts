import api from "../axios";

export interface Budget {
  id: string;
  amount: number;
  month: number;
  year: number;
  category: {
    id: number;
    name: string;
  };
}

export const BudgetService = {
  getAll: async (): Promise<Budget[]> => {
    const response = await api.get("/budgets");
    return response.data;
  },

  create: async (data: {
    amount: number;
    categoryId: number;
    month: number;
    year: number;
  }): Promise<Budget> => {
    const response = await api.post("/budgets", data);
    return response.data;
  },

  update: async (
    id: string,
    data: {
      amount: number;
      categoryId: number;
      month: number;
      year: number;
    },
  ): Promise<Budget> => {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/budgets/${id}`);
  },

  getStatus: async (
    userId: number,
    categoryId: number,
    month: number,
    year: number,
  ) => {
    const response = await api.get("/budgets/status", {
      params: { userId, categoryId, month, year },
    });
    return response.data;
  },
};
