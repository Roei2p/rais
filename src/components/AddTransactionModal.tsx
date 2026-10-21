import React, { useState } from 'react';
import { BankAccount, CategoryKey, Transaction, TransactionType } from '../types';
import { CATEGORIES } from '../data/categories';
import { X, Sparkles, PlusCircle } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  accounts: BankAccount[];
  currentDate: Date;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
  accounts,
  currentDate,
}) => {
  if (!isOpen) return null;

  const nowStr = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('variable');
  const [category, setCategory] = useState<CategoryKey>('supermarket');
  const [account, setAccount] = useState(accounts[1]?.name || accounts[0]?.name || 'כרטיס מקס (10 לחודש)');
  const [date, setDate] = useState(nowStr);
  const [notes, setNotes] = useState('');

  // Israeli quick presets
  const presets = [
    { name: 'שופרסל דיל', cat: 'supermarket' as CategoryKey, type: 'variable' as TransactionType },
    { name: 'Wolt משלוח', cat: 'dining' as CategoryKey, type: 'variable' as TransactionType },
    { name: 'קפה ארומה', cat: 'dining' as CategoryKey, type: 'variable' as TransactionType },
    { name: 'סופר-פארם', cat: 'supermarket' as CategoryKey, type: 'variable' as TransactionType },
    { name: 'פז תדלוק', cat: 'transport' as CategoryKey, type: 'variable' as TransactionType },
    { name: 'זארה ביגוד', cat: 'shopping' as CategoryKey, type: 'variable' as TransactionType },
    { name: 'חברת חשמל', cat: 'utilities' as CategoryKey, type: 'fixed' as TransactionType },
    { name: 'משכורת חודשית', cat: 'salary' as CategoryKey, type: 'income' as TransactionType },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setTitle(p.name);
    setCategory(p.cat);
    setType(p.type);
  };

  const handleTitleChange = async (val: string) => {
    setTitle(val);

    // Call server auto-categorization API
    try {
      const res = await fetch('/api/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: val }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.type) {
          // If match found in dictionary, optionally set
          const catEntries = Object.entries(CATEGORIES);
          const found = catEntries.find(([_, info]) => info.name.includes(data.category) || data.category.includes(info.name));
          if (found) {
            setCategory(found[0] as CategoryKey);
            setType(found[1].type);
          }
        }
      }
    } catch {
      // Ignore if network or server error
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    onAddTransaction({
      title: title.trim(),
      amount: parsedAmount,
      type,
      category,
      account,
      date,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">הוספת תנועה חדשה</h3>
              <p className="text-[11px] text-gray-500">עדכון מהיר של הוצאה או הכנסה בתזרים</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="mt-4">
          <div className="text-[11px] font-bold text-gray-500 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>בחירה מהירה:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="text-[11px] bg-gray-50 hover:bg-emerald-50 hover:text-emerald-800 border border-gray-200 px-2.5 py-1 rounded-lg transition cursor-pointer"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">סוג תנועה</label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setType('variable');
                  if (CATEGORIES[category]?.type !== 'variable') setCategory('supermarket');
                }}
                className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  type === 'variable' ? 'bg-white text-purple-700 shadow-2xs' : 'text-gray-600'
                }`}
              >
                🛒 הוצאה משתנה
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('fixed');
                  if (CATEGORIES[category]?.type !== 'fixed') setCategory('housing');
                }}
                className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  type === 'fixed' ? 'bg-white text-blue-700 shadow-2xs' : 'text-gray-600'
                }`}
              >
                🔒 הוצאה קבועה
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('income');
                  setCategory('salary');
                }}
                className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  type === 'income' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-gray-600'
                }`}
              >
                💵 הכנסה
              </button>
            </div>
          </div>

          {/* Title & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">שם העסק / תיאור</label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="למשל: שופרסל, וולט, נטפליקס"
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600 px-3 py-2 rounded-xl text-xs font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">סכום בש״ח</label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600 px-3 py-2 rounded-xl text-xs font-black text-gray-900"
                  required
                />
                <span className="absolute left-3 top-2 text-xs font-bold text-gray-400">₪</span>
              </div>
            </div>
          </div>

          {/* Category & Account */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">קטגוריה</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryKey)}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer"
              >
                {Object.entries(CATEGORIES).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.emoji} {info.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">אמצעי תשלום / כרטיס</label>
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.name}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">תאריך</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600 px-3 py-2 rounded-xl text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">הערה אישית (רשות)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="למשל: יום הולדת לילד"
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600 px-3 py-2 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-gray-500 hover:text-gray-800 px-4 py-2 cursor-pointer"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
            >
              הוסף לתזרים
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
