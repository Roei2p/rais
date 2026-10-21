import React, { useState } from 'react';
import { Transaction } from '../types';
import { CATEGORIES } from '../data/categories';
import { formatILS } from '../utils/cashflow';
import { 
  Lock, 
  Lightbulb, 
  Plus, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  Trash2,
  Edit2
} from 'lucide-react';

interface FixedExpensesListProps {
  transactions: Transaction[];
  currentDate: Date;
  onOpenAddModal: () => void;
  onDeleteTransaction: (id: string) => void;
}

export const FixedExpensesList: React.FC<FixedExpensesListProps> = ({
  transactions,
  currentDate,
  onOpenAddModal,
  onDeleteTransaction,
}) => {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const fixedList = transactions.filter((t) => {
    const d = new Date(t.date);
    return (
      d.getFullYear() === currentYear &&
      d.getMonth() === currentMonth &&
      t.type === 'fixed'
    );
  });

  const totalFixed = fixedList.reduce((sum, t) => sum + t.amount, 0);

  // Group by category
  const groups = fixedList.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
              הוצאות קבועות
            </span>
            <span className="text-xs text-gray-400">
              {fixedList.length} הוצאות חודשיות קבועות
            </span>
          </div>
          <h2 className="text-xl font-black text-gray-900 mt-1">
            הבסיס הקבוע של הבית
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            הוצאות שיורדות אוטומטית בהוראת קבע או אשראי - דיור, חשבונות, ביטוחים ומנויים
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-left sm:text-right bg-blue-50/70 border border-blue-100 px-4 py-2 rounded-2xl">
            <span className="text-[11px] text-blue-900 block font-medium">סך קבועות החודש</span>
            <span className="text-xl font-black text-blue-950">{formatILS(totalFixed)}</span>
          </div>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>הוסף קבועה</span>
          </button>
        </div>
      </div>

      {/* RiseUp Insight Banner for Fixed Expenses */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-200/70 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-950">
          <strong className="font-bold">תובנת רייזאפ:</strong> הוצאות קבועות הן המקום הטוב ביותר לחסוך בלי לפגוע באיכות החיים! בדיקה פשוטה של ביטוחים כפולים (בריאות/רכב) והשוואת חבילת אינטרנט עשויה לחסוך לכם בממוצע <strong>₪350 לחודש</strong> (מעל ₪4,000 בשנה).
        </div>
      </div>

      {/* Fixed Expenses Grouped */}
      <div className="space-y-6">
        {Object.entries(groups).map(([catKey, items]) => {
          const catInfo = CATEGORIES[catKey as keyof typeof CATEGORIES] || CATEGORIES.other;
          const subtotal = items.reduce((s, it) => s + it.amount, 0);

          return (
            <div key={catKey} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/40">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200/60 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{catInfo.emoji}</span>
                  <span className="text-sm font-bold text-gray-900">{catInfo.name}</span>
                </div>
                <span className="text-sm font-extrabold text-gray-800">
                  {formatILS(subtotal)}
                </span>
              </div>

              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 hover:border-gray-200 transition"
                  >
                    <div>
                      <div className="text-xs font-bold text-gray-800 flex items-center gap-2">
                        <span>{item.title}</span>
                        {item.category === 'subscriptions' && (
                          <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-normal">
                            מנוי
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                        <span>חיוב ב-{new Date(item.date).getDate()} לחודש</span>
                        <span>•</span>
                        <span>{item.account}</span>
                        {item.notes && (
                          <>
                            <span>•</span>
                            <span className="text-gray-500">{item.notes}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-gray-900">
                        {formatILS(item.amount)}
                      </span>
                      <button
                        onClick={() => onDeleteTransaction(item.id)}
                        title="מחיקה"
                        className="text-gray-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
