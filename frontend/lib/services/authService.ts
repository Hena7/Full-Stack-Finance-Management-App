import api from "../axios";

export interface AuthResponse {
  token: string;
  message: string;
}

export const AuthApiService = {
  // POST /api/auth/register
  register: async (
    fullName: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", {
      fullName,
      email,
      password,
    });
    return response.data;
  },

  // POST /api/auth/login
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  },
};
