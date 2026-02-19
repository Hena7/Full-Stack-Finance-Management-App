import api from "../axios";

export interface Category {
  id: number; // Backend uses Long (number in TS)
  name: string;
  type: "INCOME" | "EXPENSE"; // Backend uses uppercase enum
}

export const CategoryService = {
  // Get all categories for the logged-in user
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>("/categories");
    return response.data;
  },

  // Create a new category
  create: async (
    name: string,
    type: "INCOME" | "EXPENSE",
  ): Promise<Category> => {
    const response = await api.post<Category>("/categories", { name, type });
    return response.data;
  },

  // Delete a category
  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
