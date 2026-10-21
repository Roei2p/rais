import React, { useState } from 'react';
import { CategoryKey, Transaction } from '../types';
import { CATEGORIES } from '../data/categories';
import { formatILS, getVariableCategoryBreakdown } from '../utils/cashflow';
import { 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight, 
  ShoppingBag, 
  Utensils, 
  Car, 
  Tv, 
  Tag, 
  Filter
} from 'lucide-react';

interface VariableExpensesListProps {
  transactions: Transaction[];
  currentDate: Date;
  onOpenAddModal: () => void;
  onSelectCategory?: (category: CategoryKey) => void;
}

export const VariableExpensesList: React.FC<VariableExpensesListProps> = ({
  transactions,
  currentDate,
  onOpenAddModal,
  onSelectCategory,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<CategoryKey | null>('supermarket');

  const breakdown = getVariableCategoryBreakdown(transactions, currentDate);
  const totalVariable = breakdown.reduce((sum, item) => sum + item.amount, 0);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const getCategoryTransactions = (catKey: CategoryKey) => {
    return transactions.filter((t) => {
      const d = new Date(t.date);
      return (
        d.getFullYear() === currentYear &&
        d.getMonth() === currentMonth &&
        t.category === catKey &&
        t.type === 'variable'
      );
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
              הוצאות משתנות
            </span>
            <span className="text-xs text-gray-400">
              {breakdown.length} קטגוריות פעילות
            </span>
          </div>
          <h2 className="text-xl font-black text-gray-900 mt-1">
            לאן הולך הכסף השוטף?
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            ההוצאות שבשליטה יומיומית שלכם - סופרמרקט, הזמנות אוכל, דלק וקניות
          </p>
        </div>

        <div className="text-left sm:text-right bg-purple-50/70 border border-purple-100 px-4 py-2 rounded-2xl">
          <span className="text-[11px] text-purple-900 block font-medium">סך הוצאות משתנות החודש</span>
          <span className="text-xl font-black text-purple-950">{formatILS(totalVariable)}</span>
        </div>
      </div>

      {/* Categories Breakdown List */}
      <div className="space-y-3">
        {breakdown.map((item) => {
          const catInfo = CATEGORIES[item.category] || CATEGORIES.other;
          const isExpanded = expandedCategory === item.category;
          const catTransactions = getCategoryTransactions(item.category);

          return (
            <div
              key={item.category}
              className={`rounded-2xl border transition overflow-hidden ${
                isExpanded ? 'border-gray-300 bg-gray-50/30 shadow-2xs' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div
                onClick={() => setExpandedCategory(isExpanded ? null : item.category)}
                className="p-4 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-2xs"
                    style={{ backgroundColor: catInfo.bgColor }}
                  >
                    {catInfo.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{catInfo.name}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                        {item.transactionCount} תנועות
                      </span>
                    </div>

                    {/* Progress Bar for Category Share */}
                    <div className="flex items-center gap-2 mt-1.5 w-36 sm:w-48">
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: catInfo.color,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 font-semibold">{item.percentage}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <span className="text-base font-extrabold text-gray-900 block">
                      {formatILS(item.amount)}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      ממוצע ₪{Math.round(item.amount / Math.max(item.transactionCount, 1))} לתנועה
                    </span>
                  </div>
                  <div className="text-gray-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Category Transactions */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-white px-4 py-3 divide-y divide-gray-50">
                  <div className="text-[11px] font-bold text-gray-400 pb-2 flex justify-between items-center">
                    <span>עסקאות בקטגוריה זו ({catTransactions.length})</span>
                    <button
                      onClick={onOpenAddModal}
                      className="text-emerald-700 hover:underline cursor-pointer"
                    >
                      + הוסף עסקה
                    </button>
                  </div>
                  {catTransactions.length === 0 ? (
                    <div className="py-3 text-center text-xs text-gray-400">אין תנועות בקטגוריה זו החודש</div>
                  ) : (
                    catTransactions.map((tx) => (
                      <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-gray-800">{tx.title}</div>
                          <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                            <span>{new Date(tx.date).toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' })}</span>
                            <span>•</span>
                            <span>{tx.account}</span>
                            {tx.notes && (
                              <>
                                <span>•</span>
                                <span className="italic">{tx.notes}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="font-black text-gray-900 text-sm">
                          {formatILS(tx.amount)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
