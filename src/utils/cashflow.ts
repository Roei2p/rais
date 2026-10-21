import { CashflowSummary, CategoryKey, Transaction } from '../types';

export function formatILS(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));
  const formatted = absAmount.toLocaleString('he-IL');
  return isNegative ? `-₪${formatted}` : `₪${formatted}`;
}

export function calculateCashflow(
  transactions: Transaction[],
  currentDate: Date = new Date(),
  customVariableBudget?: number,
  monthlySavingsTarget: number = 2100
): CashflowSummary {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Filter transactions for current month
  const monthTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  // Calculate Incomes
  const totalIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate Fixed Expenses
  const fixedExpensesTotal = monthTransactions
    .filter((t) => t.type === 'fixed')
    .reduce((sum, t) => sum + t.amount, 0);

  // Variable budget: Default is Income minus Fixed minus Savings target, or user custom budget
  const defaultVariableBudget = Math.max(totalIncome - fixedExpensesTotal - monthlySavingsTarget, 1000);
  const variableBudget = customVariableBudget ?? defaultVariableBudget;

  // Variable expenses spent so far
  const variableSpent = monthTransactions
    .filter((t) => t.type === 'variable')
    .reduce((sum, t) => sum + t.amount, 0);

  // Remaining for variable expenses
  const remainingVariable = variableBudget - variableSpent;

  // Days in month calculation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dayOfMonth = Math.min(currentDate.getDate(), daysInMonth);
  const daysLeft = Math.max(daysInMonth - dayOfMonth, 1);

  // Allowance per day remaining
  const dailyAllowance = Math.round(remainingVariable / daysLeft);
  const weeklyAllowance = Math.round(dailyAllowance * 7);

  // Weekly spent (last 7 days)
  const oneWeekAgo = new Date(currentDate);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklySpent = monthTransactions
    .filter((t) => {
      if (t.type !== 'variable') return false;
      const td = new Date(t.date);
      return td >= oneWeekAgo && td <= currentDate;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // Projected End Balance
  // End of month balance = totalIncome - fixedExpensesTotal - variableSpent - monthlySavingsTarget
  const projectedEndBalance = totalIncome - fixedExpensesTotal - variableSpent - monthlySavingsTarget;

  return {
    totalIncome,
    fixedExpensesTotal,
    variableBudget,
    variableSpent,
    remainingVariable,
    projectedEndBalance,
    daysInMonth,
    dayOfMonth,
    daysLeft,
    dailyAllowance,
    weeklyAllowance,
    weeklySpent,
    isOverBudget: remainingVariable < 0,
  };
}

export interface CategoryBreakdownItem {
  category: CategoryKey;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export function getVariableCategoryBreakdown(
  transactions: Transaction[],
  currentDate: Date = new Date()
): CategoryBreakdownItem[] {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthVariables = transactions.filter((t) => {
    const d = new Date(t.date);
    return (
      d.getFullYear() === currentYear &&
      d.getMonth() === currentMonth &&
      t.type === 'variable'
    );
  });

  const total = monthVariables.reduce((sum, t) => sum + t.amount, 0) || 1;
  const groups: Record<string, { amount: number; count: number }> = {};

  monthVariables.forEach((t) => {
    if (!groups[t.category]) {
      groups[t.category] = { amount: 0, count: 0 };
    }
    groups[t.category].amount += t.amount;
    groups[t.category].count += 1;
  });

  return Object.entries(groups)
    .map(([category, data]) => ({
      category: category as CategoryKey,
      amount: data.amount,
      percentage: Math.round((data.amount / total) * 100),
      transactionCount: data.count,
    }))
    .sort((a, b) => b.amount - a.amount);
}
