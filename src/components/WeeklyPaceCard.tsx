import React from 'react';
import { CashflowSummary } from '../types';
import { formatILS } from '../utils/cashflow';
import { Compass, Calendar, ArrowRight, Zap, Coffee, ShoppingBag } from 'lucide-react';

interface WeeklyPaceCardProps {
  summary: CashflowSummary;
  onOpenAddModal: () => void;
}

export const WeeklyPaceCard: React.FC<WeeklyPaceCardProps> = ({
  summary,
  onOpenAddModal,
}) => {
  const days = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
  const todayIndex = new Date().getDay(); // 0 is Sunday in JS

  const dailyAllowance = Math.max(summary.dailyAllowance, 0);
  const weeklyAllowance = Math.max(summary.weeklyAllowance, 0);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">הקצב המומלץ שלכם</h3>
            <p className="text-[11px] text-gray-500">תקציב יומיומי ושבועי כדי לא לחרוג</p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800">
          כיוון תזרים שבועי
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-5">
        {/* Daily Allowance */}
        <div className="bg-gradient-to-br from-emerald-50/60 to-white p-4 rounded-2xl border border-emerald-100/80">
          <span className="text-xs font-medium text-emerald-900 block">תקציב יומי מומלץ</span>
          <div className="text-2xl font-black text-gray-900 mt-1">
            {formatILS(dailyAllowance)}
            <span className="text-xs font-medium text-gray-500 mr-1">/ יום</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            נשארו {summary.daysLeft} ימים בחודש
          </p>
        </div>

        {/* Weekly Allowance */}
        <div className="bg-gradient-to-br from-teal-50/60 to-white p-4 rounded-2xl border border-teal-100/80">
          <span className="text-xs font-medium text-teal-900 block">תקציב ל-7 הימים הקרובים</span>
          <div className="text-2xl font-black text-gray-900 mt-1">
            {formatILS(weeklyAllowance)}
            <span className="text-xs font-medium text-gray-500 mr-1">/ שבוע</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            כולל סופרמרקט וקניות סופ״ש
          </p>
        </div>
      </div>

      {/* Week Days Visual Tracker */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-xs text-gray-500 mb-2 font-medium">
          <span>ימי השבוע:</span>
          <span className="text-emerald-700 font-bold">היום: יום {days[todayIndex]}</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {days.map((day, idx) => {
            const isToday = idx === todayIndex;
            const isPast = idx < todayIndex;
            return (
              <div
                key={day}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition ${
                  isToday
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isPast
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-gray-50 text-gray-700 border border-gray-100'
                }`}
              >
                <div>{day}</div>
                <div className={`text-[10px] mt-0.5 font-normal ${isToday ? 'text-emerald-100' : 'text-gray-400'}`}>
                  {isToday ? 'היום' : isPast ? '✓' : `₪${Math.round(dailyAllowance)}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Helpful Smart Action */}
      <div className="mt-4 flex items-center justify-between text-xs bg-gray-50 p-3 rounded-2xl">
        <div className="flex items-center gap-2 text-gray-700">
          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
          <span>עשיתם קנייה בסופר או שתיתם קפה? רשמו עכשיו כדי שהתזרים יישאר מדויק:</span>
        </div>
        <button
          onClick={onOpenAddModal}
          className="text-emerald-700 font-bold hover:underline shrink-0 mr-2 cursor-pointer"
        >
          + הוסף
        </button>
      </div>
    </div>
  );
};
