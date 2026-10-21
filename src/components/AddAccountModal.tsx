import React, { useState } from 'react';
import { BankAccount } from '../types';
import { X, CreditCard, Landmark, Check } from 'lucide-react';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (acc: BankAccount) => void;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  onClose,
  onAddAccount,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [type, setType] = useState<'credit' | 'bank'>('credit');
  const [balance, setBalance] = useState('');
  const [billingDay, setBillingDay] = useState('10');
  const [fourDigits, setFourDigits] = useState('');
  const [color, setColor] = useState('#2563EB');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedBalance = parseFloat(balance) || 0;

    const newAccount: BankAccount = {
      id: `acc_${Date.now()}`,
      name: name.trim(),
      type,
      balance: type === 'credit' && parsedBalance > 0 ? -parsedBalance : parsedBalance,
      billingDay: type === 'credit' ? parseInt(billingDay) : undefined,
      lastSync: 'הרגע עודכן',
      fourDigits: fourDigits || Math.floor(1000 + Math.random() * 9000).toString(),
      color,
    };

    onAddAccount(newAccount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">חיבור כרטיס או חשבון חדש</h3>
            <p className="text-[11px] text-gray-500">סנכרון מועד חיוב ויתרה לתזרים</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">סוג חשבון</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('credit')}
                className={`py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  type === 'credit'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>כרטיס אשראי</span>
              </button>
              <button
                type="button"
                onClick={() => setType('bank')}
                className={`py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  type === 'bank'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                <Landmark className="w-4 h-4" />
                <span>חשבון בנק (עו״ש)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">שם הכרטיס / הבנק</label>
            <input
              type="text"
              placeholder="למשל: כרטיס Max, בנק דיסקונט"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600 px-3 py-2 rounded-xl text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {type === 'credit' ? 'חיוב צפוי (₪)' : 'יתרת עו״ש (₪)'}
              </label>
              <input
                type="number"
                placeholder="0"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600 px-3 py-2 rounded-xl text-xs font-bold"
              />
            </div>
            {type === 'credit' ? (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">מועד החיוב בחודש</label>
                <select
                  value={billingDay}
                  onChange={(e) => setBillingDay(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600 px-3 py-2 rounded-xl text-xs"
                >
                  <option value="2">2 לחודש</option>
                  <option value="10">10 לחודש</option>
                  <option value="15">15 לחודש</option>
                  <option value="20">20 לחודש</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">4 ספרות אחרונות</label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="1234"
                  value={fourDigits}
                  onChange={(e) => setFourDigits(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:outline-emerald-600 px-3 py-2 rounded-xl text-xs"
                />
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-gray-500 hover:text-gray-800 px-4 py-2 cursor-pointer"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2 rounded-xl cursor-pointer"
            >
              הוסף כרטיס
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
