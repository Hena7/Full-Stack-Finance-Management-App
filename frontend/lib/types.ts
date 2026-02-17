export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

export enum Category {
  FOOD = "Food",
  TRANSPORT = "Transport",
  HOUSING = "Housing",
  ENTERTAINMENT = "Entertainment",
  SHOPPING = "Shopping",
  SALARY = "Salary",
  FREELANCE = "Freelance",
  OTHER = "Other",
}

export interface Transaction {
  id: string;
  amount: number;
  category: Category;
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
