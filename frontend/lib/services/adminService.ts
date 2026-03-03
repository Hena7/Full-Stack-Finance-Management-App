import api from "../axios";

export interface UserSummary {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

export const AdminApiService = {
  // GET /api/admin/users
  getUsers: async (): Promise<UserSummary[]> => {
    const response = await api.get<UserSummary[]>("/admin/users");
    return response.data;
  },

  // DELETE /api/admin/users/:id
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },

  // PATCH /api/admin/users/:id/role
  changeUserRole: async (id: number, role: string): Promise<UserSummary> => {
    const response = await api.patch<UserSummary>(`/admin/users/${id}/role`, {
      role,
    });
    return response.data;
  },
};
