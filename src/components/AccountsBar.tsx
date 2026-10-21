import React from 'react';
import { BankAccount } from '../types';
import { formatILS } from '../utils/cashflow';
import { CreditCard, Landmark, RefreshCw, Plus, Clock, CheckCircle } from 'lucide-react';

interface AccountsBarProps {
  accounts: BankAccount[];
  onSync: () => void;
  isSyncing: boolean;
  onAddAccount: () => void;
}

export const AccountsBar: React.FC<AccountsBarProps> = ({
  accounts,
  onSync,
  isSyncing,
  onAddAccount,
}) => {
  const today = new Date().getDate();

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              בנקים וכרטיסים
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              סנכרון תקין
            </span>
          </div>
          <h3 className="text-lg font-black text-gray-900 mt-1">
            כרטיסי אשראי וחשבון בנק
          </h3>
          <p className="text-xs text-gray-500">
            מעקב אחר מועדי החיוב באשראי (2, 10, 15 לחודש) ויתרת העו״ש
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 border border-gray-200/80 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
            <span>{isSyncing ? 'מרענן עסקאות...' : 'רענן כעת'}</span>
          </button>
          <button
            onClick={onAddAccount}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>הוסף כרטיס / חשבון</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {accounts.map((acc) => {
          const isBank = acc.type === 'bank';
          let daysToBilling = 0;
          if (acc.billingDay) {
            daysToBilling = acc.billingDay >= today ? acc.billingDay - today : 30 - today + acc.billingDay;
          }

          return (
            <div
              key={acc.id}
              className="p-4 rounded-2xl border border-gray-100 bg-gradient-to-b from-gray-50/50 to-white hover:border-gray-300 transition relative overflow-hidden group"
            >
              <div
                className="absolute top-0 right-0 left-0 h-1"
                style={{ backgroundColor: acc.color }}
              />

              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <div className="flex items-center gap-1.5 font-bold text-gray-800">
                  {isBank ? (
                    <Landmark className="w-4 h-4 text-rose-600" />
                  ) : (
                    <CreditCard className="w-4 h-4 text-blue-600" />
                  )}
                  <span>{acc.name}</span>
                </div>
                <span className="font-mono text-[11px] text-gray-400">•••• {acc.fourDigits}</span>
              </div>

              <div className="mt-2">
                <span className="text-[11px] text-gray-500 block">
                  {isBank ? 'יתרת עו״ש נוכחית' : 'חיוב אשראי צפוי'}
                </span>
                <span
                  className={`text-xl font-black block mt-0.5 ${
                    isBank ? 'text-gray-900' : 'text-blue-900'
                  }`}
                >
                  {formatILS(acc.balance)}
                </span>
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
                {acc.billingDay ? (
                  <div className="flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50/80 px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>חיוב ב-{acc.billingDay} (עוד {daysToBilling} ימים)</span>
                  </div>
                ) : (
                  <span className="text-gray-400">חשבון עו״ש ראשי</span>
                )}
                <span className="text-[10px] text-gray-400">{acc.lastSync}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
