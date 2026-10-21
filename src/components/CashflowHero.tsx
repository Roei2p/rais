import React, { useState } from 'react';
import { CashflowSummary } from '../types';
import { formatILS } from '../utils/cashflow';
import { 
  ArrowUpRight, 
  Lock, 
  Wallet, 
  PiggyBank, 
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CashflowHeroProps {
  summary: CashflowSummary;
  onUpdateVariableBudget: (newBudget: number) => void;
  onNavigateTab: (tab: string) => void;
}

export const CashflowHero: React.FC<CashflowHeroProps> = ({
  summary,
  onUpdateVariableBudget,
  onNavigateTab,
}) => {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(summary.variableBudget.toString());

  const progressPercent = Math.min(
    Math.round((summary.variableSpent / Math.max(summary.variableBudget, 1)) * 100),
    100
  );

  const monthDayPercent = Math.round((summary.dayOfMonth / summary.daysInMonth) * 100);

  const handleConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#059669', '#10B981', '#34D399', '#6EE7B7'],
    });
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(tempBudget);
    if (!isNaN(val) && val > 0) {
      onUpdateVariableBudget(val);
      setIsEditingBudget(false);
    }
  };

  const isAheadOfSchedule = progressPercent <= monthDayPercent;

  return (
    <div className="bg-white rounded-3xl border border-gray-100/90 shadow-sm overflow-hidden p-6 sm:p-8 relative">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Header of Cashflow */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
              התזרים של החודש
            </span>
            <span className="text-xs text-gray-400">
              יום {summary.dayOfMonth} מתוך {summary.daysInMonth}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            כמה נשאר לנו להוציא החודש?
          </h1>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {summary.remainingVariable >= 0 ? (
            <button
              onClick={handleConfetti}
              title="לחצו לחגיגה!"
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-bold shadow-2xs hover:bg-emerald-100 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {isAheadOfSchedule
                  ? 'מצב מצוין! קצב ההוצאות נמוך מהתקציב 🌟'
                  : 'במסלול חיובי - נשארים בפלוס'}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-2xs">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>חריגה מהתקציב המשתנה - מומלץ למתן הוצאות</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Remaining Amount Display */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-baseline gap-4 relative z-10">
        <div className="flex items-baseline gap-2">
          <span
            className={`text-5xl sm:text-6xl font-black tracking-tight ${
              summary.remainingVariable >= 0 ? 'text-gray-900' : 'text-rose-600'
            }`}
          >
            {formatILS(summary.remainingVariable)}
          </span>
          <span className="text-sm font-semibold text-gray-500">
            {summary.remainingVariable >= 0 ? 'פנוי להוצאות משתנות' : 'חריגה מהתקציב'}
          </span>
        </div>

        <div className="sm:mr-auto flex items-center gap-3">
          <div className="text-right">
            <span className="block text-xs text-gray-500">תחזית לסוף החודש:</span>
            <span
              className={`text-sm font-extrabold ${
                summary.projectedEndBalance >= 0 ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {summary.projectedEndBalance >= 0 ? '+' : ''}
              {formatILS(summary.projectedEndBalance)}
            </span>
          </div>

          <button
            onClick={() => setIsEditingBudget(!isEditingBudget)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-emerald-700 bg-gray-50 hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-gray-200/80 transition cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>הגדרת תקציב</span>
          </button>
        </div>
      </div>

      {/* Edit Budget Form Popover */}
      {isEditingBudget && (
        <form
          onSubmit={handleSaveBudget}
          className="mt-4 p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex flex-wrap items-center gap-3 relative z-10"
        >
          <div className="text-xs font-semibold text-emerald-950">
            תקציב חודשי להוצאות משתנות (סופר, וולט, פנאי):
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={tempBudget}
              onChange={(e) => setTempBudget(e.target.value)}
              className="bg-white px-3 py-1.5 rounded-xl text-sm font-bold border border-emerald-300 w-32 focus:outline-emerald-500"
              autoFocus
            />
            <span className="text-sm font-bold text-gray-700">₪</span>
          </div>
          <button
            type="submit"
            className="bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-xl hover:bg-emerald-700 transition cursor-pointer"
          >
            עדכן תקציב
          </button>
          <button
            type="button"
            onClick={() => setIsEditingBudget(false)}
            className="text-gray-500 text-xs px-2 py-1.5 hover:text-gray-800 cursor-pointer"
          >
            ביטול
          </button>
        </form>
      )}

      {/* Progress Bar of Variable Budget */}
      <div className="mt-8 relative z-10">
        <div className="flex justify-between items-center text-xs font-semibold text-gray-600 mb-2">
          <span>
            הוצאתם: <strong className="text-gray-900">{formatILS(summary.variableSpent)}</strong>{' '}
            מתוך {formatILS(summary.variableBudget)} ({progressPercent}%)
          </span>
          <span className="text-gray-500">
            יום {summary.dayOfMonth} מתוך {summary.daysInMonth} ({monthDayPercent}%)
          </span>
        </div>

        {/* Visual Dual Progress Track */}
        <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden p-0.5">
          {/* Month Time Marker */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-gray-400 z-10 rounded-full"
            style={{ right: `${monthDayPercent}%` }}
            title={`היום בחודש (${summary.dayOfMonth})`}
          />

          {/* Spent Progress Bar */}
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              summary.remainingVariable < 0
                ? 'bg-rose-500'
                : isAheadOfSchedule
                ? 'bg-gradient-to-l from-emerald-500 to-teal-400'
                : 'bg-amber-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-2 text-[11px] text-gray-500">
          <span>תחילת החודש</span>
          <span className="flex items-center gap-1 text-emerald-800 font-medium">
            נשארו עוד {summary.daysLeft} ימים להסתדר עם {formatILS(Math.max(summary.remainingVariable, 0))}
          </span>
          <span>סוף החודש</span>
        </div>
      </div>

      {/* 4 Pillars Grid (The RiseUp Formula) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-gray-100 relative z-10">
        {/* Pillar 1: Incomes */}
        <div 
          onClick={() => onNavigateTab('transactions')}
          className="bg-gray-50/80 hover:bg-emerald-50/50 p-4 rounded-2xl border border-gray-100 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">הכנסות החודש</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-gray-900 mt-2">
            {formatILS(summary.totalIncome)}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
            <span>משכורות וקצבאות</span>
          </div>
        </div>

        {/* Pillar 2: Fixed Expenses */}
        <div 
          onClick={() => onNavigateTab('fixed')}
          className="bg-gray-50/80 hover:bg-blue-50/50 p-4 rounded-2xl border border-gray-100 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">הוצאות קבועות</span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-gray-900 mt-2">
            {formatILS(summary.fixedExpensesTotal)}
          </div>
          <div className="text-[11px] text-blue-700 font-medium mt-0.5 flex items-center gap-1">
            <span>דיור, חינוך, חשבונות</span>
          </div>
        </div>

        {/* Pillar 3: Variable Expenses */}
        <div 
          onClick={() => onNavigateTab('variable')}
          className="bg-gray-50/80 hover:bg-purple-50/50 p-4 rounded-2xl border border-gray-100 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">הוצאות משתנות</span>
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-gray-900 mt-2">
            {formatILS(summary.variableSpent)}
          </div>
          <div className="text-[11px] text-purple-700 font-medium mt-0.5 flex items-center gap-1">
            <span>סופר, וולט, פנאי ודלק</span>
          </div>
        </div>

        {/* Pillar 4: Planned Savings */}
        <div 
          onClick={() => onNavigateTab('savings')}
          className="bg-gray-50/80 hover:bg-amber-50/50 p-4 rounded-2xl border border-gray-100 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">חיסכון מתוכנן</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-gray-900 mt-2">
            ₪2,100
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-0.5 flex items-center gap-1">
            <span>כרית ביטחון ויעדים</span>
          </div>
        </div>
      </div>
    </div>
  );
};
