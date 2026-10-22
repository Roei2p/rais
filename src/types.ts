export type CategoryKey =
  | 'food' | 'eating_out' | 'car' | 'kids' | 'health'
  | 'clothes' | 'home' | 'fun' | 'gifts' | 'savings' | 'other';

export interface Expense {
  id: string;
  amount: number;
  category: CategoryKey;
  note?: string;
  date: string; // YYYY-MM-DD
}

/** Something that repeats every month: salary in, rent out, etc. */
export interface MonthlyItem {
  id: string;
  title: string;
  amount: number;
  kind: 'income' | 'fixed';
}

export interface Goal {
  id: string;
  title: string;
  icon: string;
  target: number;
  saved: number;
}

export interface AppData {
  started: boolean;
  expenses: Expense[];
  monthly: MonthlyItem[];
  goals: Goal[];
}
