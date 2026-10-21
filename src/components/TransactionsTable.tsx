import React, { useState } from 'react';
import { CategoryKey, Transaction, TransactionType } from '../types';
import { CATEGORIES } from '../data/categories';
import { formatILS } from '../utils/cashflow';
import { 
  Search, 
  Filter, 
  Trash2, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Lock, 
  Wallet,
  Calendar,
  CreditCard
} from 'lucide-react';

interface TransactionsTableProps {
  transactions: Transaction[];
  currentDate: Date;
  onDeleteTransaction: (id: string) => void;
  onOpenAddModal: () => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  currentDate,
  onDeleteTransaction,
  onOpenAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Filter logic
  const filtered = transactions.filter((t) => {
    const d = new Date(t.date);
    const matchesMonth =
      d.getFullYear() === currentYear && d.getMonth() === currentMonth;

    if (!matchesMonth) return false;

    if (typeFilter !== 'all' && t.type !== typeFilter) return false;

    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const inTitle = t.title.toLowerCase().includes(q);
      const inAccount = t.account.toLowerCase().includes(q);
      const inNotes = t.notes?.toLowerCase().includes(q) ?? false;
      const catName = CATEGORIES[t.category]?.name.toLowerCase() ?? '';
      const inCat = catName.includes(q);
      if (!inTitle && !inAccount && !inNotes && !inCat) return false;
    }

    return true;
  });

  // Sort descending by date
  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-800">
              פירוט תנועות מלא
            </span>
            <span className="text-xs text-gray-400">
              {filtered.length} תנועות נמצאו
            </span>
          </div>
          <h2 className="text-xl font-black text-gray-900 mt-1">
            כל ההוצאות וההכנסות
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            רשימה מלאה של כל התנועות המסונכרנות מהבנק ומכרטיסי האשראי
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>הוסף תנועה חדשה</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
          <input
            type="text"
            placeholder="חיפוש לפי עסק, בנק או הערה..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 pr-9 pl-3 py-2 rounded-xl text-xs border border-gray-200 focus:bg-white focus:outline-emerald-600 transition"
          />
        </div>

        {/* Type Filter */}
        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setTypeFilter('all')}
            className={`flex-1 text-xs py-1 rounded-lg font-semibold transition cursor-pointer ${
              typeFilter === 'all' ? 'bg-white shadow-2xs text-gray-900' : 'text-gray-500'
            }`}
          >
            הכל
          </button>
          <button
            onClick={() => setTypeFilter('variable')}
            className={`flex-1 text-xs py-1 rounded-lg font-semibold transition cursor-pointer ${
              typeFilter === 'variable' ? 'bg-white shadow-2xs text-purple-700' : 'text-gray-500'
            }`}
          >
            משתנות
          </button>
          <button
            onClick={() => setTypeFilter('fixed')}
            className={`flex-1 text-xs py-1 rounded-lg font-semibold transition cursor-pointer ${
              typeFilter === 'fixed' ? 'bg-white shadow-2xs text-blue-700' : 'text-gray-500'
            }`}
          >
            קבועות
          </button>
          <button
            onClick={() => setTypeFilter('income')}
            className={`flex-1 text-xs py-1 rounded-lg font-semibold transition cursor-pointer ${
              typeFilter === 'income' ? 'bg-white shadow-2xs text-emerald-700' : 'text-gray-500'
            }`}
          >
            הכנסות
          </button>
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-gray-50 px-3 py-2 rounded-xl text-xs border border-gray-200 focus:bg-white focus:outline-emerald-600 transition cursor-pointer"
        >
          <option value="all">כל הקטגוריות</option>
          {Object.entries(CATEGORIES).map(([key, info]) => (
            <option key={key} value={key}>
              {info.emoji} {info.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[11px]">
              <th className="pb-3 pr-2">עסק / תיאור</th>
              <th className="pb-3 px-2">קטגוריה</th>
              <th className="pb-3 px-2">סוג</th>
              <th className="pb-3 px-2">כרטיס / חשבון</th>
              <th className="pb-3 px-2">תאריך</th>
              <th className="pb-3 px-2 text-left">סכום</th>
              <th className="pb-3 pl-2 text-left">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">
                  לא נמצאו תנועות התואמות את החיפוש והסינון
                </td>
              </tr>
            ) : (
              filtered.map((t) => {
                const cat = CATEGORIES[t.category] || CATEGORIES.other;
                const isIncome = t.type === 'income';

                return (
                  <tr key={t.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-3.5 pr-2">
                      <div className="font-bold text-gray-900 text-sm">{t.title}</div>
                      {t.notes && <div className="text-[11px] text-gray-400 mt-0.5">{t.notes}</div>}
                    </td>

                    <td className="py-3.5 px-2">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
                        style={{ backgroundColor: cat.bgColor, color: cat.color }}
                      >
                        <span>{cat.emoji}</span>
                        <span>{cat.name}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-2">
                      {t.type === 'income' && (
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                          הכנסה
                        </span>
                      )}
                      {t.type === 'fixed' && (
                        <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold">
                          קבועה
                        </span>
                      )}
                      {t.type === 'variable' && (
                        <span className="text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-semibold">
                          משתנה
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-2 text-gray-600 font-medium">
                      {t.account}
                    </td>

                    <td className="py-3.5 px-2 text-gray-500">
                      {new Date(t.date).toLocaleDateString('he-IL', {
                        day: 'numeric',
                        month: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-2 text-left">
                      <span
                        className={`font-black text-sm ${
                          isIncome ? 'text-emerald-600' : 'text-gray-900'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatILS(t.amount)}
                      </span>
                    </td>

                    <td className="py-3.5 pl-2 text-left">
                      <button
                        onClick={() => onDeleteTransaction(t.id)}
                        title="מחק תנועה"
                        className="text-gray-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
