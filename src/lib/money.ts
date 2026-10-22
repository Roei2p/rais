import { AppData, Expense } from '../types';

export const shekel = (n: number) => {
  const v = Math.round(Math.abs(n)).toLocaleString('he-IL');
  return n < 0 ? `-₪${v}` : `₪${v}`;
};

export const pad = (n: number) => String(n).padStart(2, '0');
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const monthKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;

const MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
export const monthName = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

export const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const expensesInMonth = (expenses: Expense[], month: Date) => {
  const key = monthKey(month);
  return expenses.filter((e) => e.date.startsWith(key));
};

export interface MonthSummary {
  income: number;
  fixed: number;
  free: number;      // what's left after the fixed payments
  spent: number;
  left: number;
  daysLeft: number;  // including today
  daysInMonth: number;
  dayOfMonth: number;
  perDay: number;
  isCurrent: boolean;
  isPast: boolean;
}

export function summarize(data: AppData, month: Date, today = new Date()): MonthSummary {
  const income = data.monthly.filter((m) => m.kind === 'income').reduce((s, m) => s + m.amount, 0);
  const fixed = data.monthly.filter((m) => m.kind === 'fixed').reduce((s, m) => s + m.amount, 0);
  const free = income - fixed;
  const spent = expensesInMonth(data.expenses, month).reduce((s, e) => s + e.amount, 0);
  const left = free - spent;

  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const isCurrent = monthKey(month) === monthKey(today);
  const isPast = monthKey(month) < monthKey(today);
  const dayOfMonth = isCurrent ? today.getDate() : isPast ? daysInMonth : 1;
  const daysLeft = isCurrent ? daysInMonth - dayOfMonth + 1 : isPast ? 0 : daysInMonth;
  const perDay = daysLeft > 0 ? Math.max(0, Math.floor(left / daysLeft)) : 0;

  return { income, fixed, free, spent, left, daysLeft, daysInMonth, dayOfMonth, perDay, isCurrent, isPast };
}

export function exportCSV(data: AppData) {
  const rows = [
    ['תאריך', 'סכום', 'קטגוריה', 'הערה'],
    ...data.expenses.map((e) => [e.date, String(e.amount), e.category, `"${(e.note ?? '').replace(/"/g, '""')}"`]),
  ];
  const blob = new Blob(['﻿' + rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'ההוצאות-שלי.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}
