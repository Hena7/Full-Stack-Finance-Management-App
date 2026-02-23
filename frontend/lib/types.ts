export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string; // ISO date string YYYY-MM-DD
  notes: string;
  type: TransactionType;
}

export interface UserSettings {
  currency: string;
  darkMode: boolean;
  notifications: boolean;
  name: string;
  email: string;
}

export interface AIInsight {
  text: string;
  timestamp: number;
}
