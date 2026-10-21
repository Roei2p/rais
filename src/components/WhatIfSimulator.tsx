import React, { useState } from 'react';
import { CashflowSummary } from '../types';
import { formatILS } from '../utils/cashflow';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Sliders, 
  RotateCcw, 
  CheckCircle,
  HelpCircle,
  ShoppingBag,
  Plane,
  Home,
  Coffee,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WhatIfSimulatorProps {
  summary: CashflowSummary;
  onApplyScenarioBudget: (newBudget: number) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  summary,
  onApplyScenarioBudget,
}) => {
  // Scenario adjustments
  const [diningCut, setDiningCut] = useState(0); // 0, 300, 600
  const [supermarketOptimize, setSupermarketOptimize] = useState(0); // 0, 400, 800
  const [bigPurchase, setBigPurchase] = useState(0); // 0, 2000, 4000
  const [incomeBonus, setIncomeBonus] = useState(0); // 0, 1500, 3000

  // Calculate simulated numbers
  const netSavings = diningCut + supermarketOptimize + incomeBonus - bigPurchase;
  const simulatedRemaining = summary.remainingVariable + netSavings;
  const simulatedEndBalance = summary.projectedEndBalance + netSavings;
  const simulatedDailyAllowance = Math.round(
    simulatedRemaining / Math.max(summary.daysLeft, 1)
  );

  const resetAll = () => {
    setDiningCut(0);
    setSupermarketOptimize(0);
    setBigPurchase(0);
    setIncomeBonus(0);
  };

  const handleApply = () => {
    onApplyScenarioBudget(summary.variableBudget + diningCut + supermarketOptimize);
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              סימולטור החלטות
            </span>
            <span className="text-xs text-gray-400">
              בדקו השפעות לפני שמקבלים החלטה
            </span>
          </div>
          <h2 className="text-xl font-black text-gray-900 mt-1">
            סימולטור תרחישים: "מה יקרה אם...?"
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            הזיזו את המתגים כדי לראות איך שינוי קטן בהרגלים משפיע מיידית על התזרים ועל הפלוס בסוף החודש
          </p>
        </div>

        <button
          onClick={resetAll}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>אפס שינויים</span>
        </button>
      </div>

      {/* Main Simulation Results Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white shadow-md mb-8">
        <div>
          <span className="text-xs text-emerald-200 block font-medium">כסף פנוי צפוי לחודש זה</span>
          <div className="text-3xl font-black mt-1">
            {formatILS(simulatedRemaining)}
          </div>
          <div className="text-[11px] text-emerald-300 mt-1">
            במקום {formatILS(summary.remainingVariable)} במצב הקיים ({netSavings >= 0 ? `+${formatILS(netSavings)}` : formatILS(netSavings)})
          </div>
        </div>

        <div>
          <span className="text-xs text-emerald-200 block font-medium">תחזית סיום החודש</span>
          <div className={`text-3xl font-black mt-1 ${simulatedEndBalance >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
            {simulatedEndBalance >= 0 ? '+' : ''}{formatILS(simulatedEndBalance)}
          </div>
          <div className="text-[11px] text-emerald-200 mt-1">
            {simulatedEndBalance >= 0 ? '🚀 מסיימים בפלוס מעולה' : '⚠️ עדיין בסיכון לחריגה'}
          </div>
        </div>

        <div>
          <span className="text-xs text-emerald-200 block font-medium">תקציב יומי חדש</span>
          <div className="text-3xl font-black mt-1">
            {formatILS(Math.max(simulatedDailyAllowance, 0))}
            <span className="text-xs font-normal text-emerald-300 mr-1">/ יום</span>
          </div>
          <div className="text-[11px] text-emerald-300 mt-1">
            ל-{summary.daysLeft} הימים הנותרים החודש
          </div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Scenario 1: Dining out cut */}
        <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🍝</span>
              <span className="text-sm font-bold text-gray-900">הפחתת משלוחי וולט ומסעדות</span>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
              חיסכון: +{formatILS(diningCut)}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mb-3">
            המרת הזמנה אחת בשבוע בבישול ביתי
          </p>
          <div className="flex gap-2">
            {[0, 250, 500, 750].map((val) => (
              <button
                key={val}
                onClick={() => setDiningCut(val)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  diningCut === val
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {val === 0 ? 'ללא שינוי' : `₪${val}`}
              </button>
            ))}
          </div>
        </div>

        {/* Scenario 2: Supermarket optimization */}
        <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🛒</span>
              <span className="text-sm font-bold text-gray-900">קנייה מרוכזת עם רשימה בסופר</span>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
              חיסכון: +{formatILS(supermarketOptimize)}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mb-3">
            הימנעות ממוצרי דחף ומעבר למותג פרטי
          </p>
          <div className="flex gap-2">
            {[0, 300, 600, 900].map((val) => (
              <button
                key={val}
                onClick={() => setSupermarketOptimize(val)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  supermarketOptimize === val
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {val === 0 ? 'ללא שינוי' : `₪${val}`}
              </button>
            ))}
          </div>
        </div>

        {/* Scenario 3: Large one-off expense */}
        <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🛋️</span>
              <span className="text-sm font-bold text-gray-900">הוצאה גדולה מתוכננת (ספה / מוצר חשמל)</span>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-full">
              השפעה: -{formatILS(bigPurchase)}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mb-3">
            בדיקה האם התזרים החודשי עומד ברכישה מיידית
          </p>
          <div className="flex gap-2">
            {[0, 1500, 3000, 5000].map((val) => (
              <button
                key={val}
                onClick={() => setBigPurchase(val)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  bigPurchase === val
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {val === 0 ? 'ללא' : `₪${val.toLocaleString()}`}
              </button>
            ))}
          </div>
        </div>

        {/* Scenario 4: Income increase / bonus */}
        <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎁</span>
              <span className="text-sm font-bold text-gray-900">בונוס / העלאת שכר / החזר מס</span>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded-full">
              תוספת: +{formatILS(incomeBonus)}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mb-3">
            תכנון ייעוד הכסף לחיסכון או מרווח נשימה
          </p>
          <div className="flex gap-2">
            {[0, 1000, 2500, 5000].map((val) => (
              <button
                key={val}
                onClick={() => setIncomeBonus(val)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  incomeBonus === val
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {val === 0 ? 'ללא' : `₪${val.toLocaleString()}`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
