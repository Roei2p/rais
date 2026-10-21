export type TransactionType = 'variable' | 'fixed' | 'income';

export type CategoryKey =
  | 'supermarket'
  | 'dining'
  | 'shopping'
  | 'transport'
  | 'leisure'
  | 'kids'
  | 'health'
  | 'housing'
  | 'utilities'
  | 'subscriptions'
  | 'insurance'
  | 'salary'
  | 'other_income'
  | 'other';

export interface CategoryInfo {
  id: CategoryKey;
  name: string;
  type: TransactionType;
  emoji: string;
  color: string;
  bgColor: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string; // YYYY-MM-DD
  category: CategoryKey;
  type: TransactionType;
  account: string; // e.g. "כרטיס מקס (10 לחודש)", "ישראכרט (2 לחודש)", "עו״ש הפועלים"
  notes?: string;
  installments?: {
    current: number;
    total: number;
  };
}

export interface BankAccount {
  id: string;
  name: string;
  type: 'bank' | 'credit';
  balance: number;
  billingDay?: number; // 2, 10, 15
  lastSync: string;
  fourDigits: string;
  color: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  monthlyDeposit: number;
  targetDate: string;
  emoji: string;
  color: string;
}

export interface InsightMessage {
  id: string;
  sender: 'riseup' | 'user';
  text: string;
  timestamp: string;
  type?: 'morning' | 'tip' | 'alert' | 'celebration' | 'user';
  actions?: Array<{ label: string; action: string }>;
}

export interface CashflowSummary {
  totalIncome: number;
  fixedExpensesTotal: number;
  variableBudget: number;
  variableSpent: number;
  remainingVariable: number;
  projectedEndBalance: number;
  daysInMonth: number;
  dayOfMonth: number;
  daysLeft: number;
  dailyAllowance: number;
  weeklyAllowance: number;
  weeklySpent: number;
  isOverBudget: boolean;
}
