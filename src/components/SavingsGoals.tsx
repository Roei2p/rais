import React, { useState } from 'react';
import { SavingsGoal } from '../types';
import { formatILS } from '../utils/cashflow';
import { 
  PiggyBank, 
  Plus, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight,
  TrendingUp,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  onAddGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  onDeposit: (goalId: string, amount: number) => void;
}

export const SavingsGoals: React.FC<SavingsGoalsProps> = ({
  goals,
  onAddGoal,
  onDeposit,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newMonthly, setNewMonthly] = useState('');
  const [newEmoji, setNewEmoji] = useState('🎯');

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalMonthlySavings = goals.reduce((sum, g) => sum + g.monthlyDeposit, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTarget) return;

    onAddGoal({
      title: newTitle.trim(),
      targetAmount: parseFloat(newTarget),
      currentAmount: 0,
      monthlyDeposit: parseFloat(newMonthly) || 500,
      targetDate: '2027-12-31',
      emoji: newEmoji,
      color: '#059669',
    });

    setNewTitle('');
    setNewTarget('');
    setNewMonthly('');
    setIsAdding(false);

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
    });
  };

  const handleDepositClick = (goalId: string, amount: number) => {
    onDeposit(goalId, amount);
    confetti({
      particleCount: 30,
      spread: 40,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
              העתיד שלכם
            </span>
            <span className="text-xs text-gray-400">
              כריות ביטחון ויעדים מוגדרים
            </span>
          </div>
          <h2 className="text-xl font-black text-gray-900 mt-1">
            יעדי חיסכון וכריות ביטחון
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            הכסף ששומר עליכם מכל הפתעה ומאפשר להגשים חלומות בלי מינוס
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-amber-50/70 border border-amber-200/60 px-4 py-2 rounded-2xl text-left sm:text-right">
            <span className="text-[11px] text-amber-900 block font-medium">נצבר עד כה ביעדים</span>
            <span className="text-xl font-black text-amber-950">{formatILS(totalSaved)}</span>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>יעד חדש</span>
          </button>
        </div>
      </div>

      {/* Add New Goal Form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="mb-6 p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3"
        >
          <div className="text-sm font-bold text-amber-950">הגדרת יעד חיסכון חדש</div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">שם היעד</label>
              <input
                type="text"
                placeholder="למשל: חופשה בקיץ / שיפוץ"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-white px-3 py-2 rounded-xl text-xs border border-amber-300 focus:outline-amber-600"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">סכום יעד (₪)</label>
              <input
                type="number"
                placeholder="10000"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="w-full bg-white px-3 py-2 rounded-xl text-xs border border-amber-300 focus:outline-amber-600"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">הפקדה חודשית (₪)</label>
              <input
                type="number"
                placeholder="800"
                value={newMonthly}
                onChange={(e) => setNewMonthly(e.target.value)}
                className="w-full bg-white px-3 py-2 rounded-xl text-xs border border-amber-300 focus:outline-amber-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">אימוג'י</label>
              <select
                value={newEmoji}
                onChange={(e) => setNewEmoji(e.target.value)}
                className="w-full bg-white px-3 py-2 rounded-xl text-xs border border-amber-300 focus:outline-amber-600"
              >
                <option value="🛡️">🛡️ כרית ביטחון</option>
                <option value="✈️">✈️ חופשה וטיסות</option>
                <option value="🚗">🚗 רכב ותחזוקה</option>
                <option value="🏠">🏠 שיפוץ / בית</option>
                <option value="🎓">🎓 לימודים והשכלה</option>
                <option value="👶">👶 הוצאות לתינוק</option>
                <option value="🎉">🎉 אירוע משפחתי</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 cursor-pointer"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl cursor-pointer"
            >
              שמור יעד
            </button>
          </div>
        </form>
      )}

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {goals.map((goal) => {
          const percent = Math.min(
            Math.round((goal.currentAmount / Math.max(goal.targetAmount, 1)) * 100),
            100
          );
          const isComplete = goal.currentAmount >= goal.targetAmount;

          return (
            <div
              key={goal.id}
              className={`p-5 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between ${
                isComplete
                  ? 'border-emerald-300 bg-emerald-50/40'
                  : 'border-gray-100 bg-gray-50/40 hover:border-gray-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 shadow-2xs flex items-center justify-center text-xl">
                    {goal.emoji}
                  </div>
                  {isComplete ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      היעד הושלם! 🎉
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-gray-500">
                      הפקדה: {formatILS(goal.monthlyDeposit)} / חודש
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-gray-900">{goal.title}</h3>

                <div className="flex items-baseline justify-between mt-3 mb-1.5">
                  <span className="text-xl font-black text-gray-900">
                    {formatILS(goal.currentAmount)}
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">
                    יעד: {formatILS(goal.targetAmount)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isComplete ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-400 mt-1">
                  <span>{percent}% הושלמו</span>
                  <span>נשאר לחסוך: {formatILS(Math.max(goal.targetAmount - goal.currentAmount, 0))}</span>
                </div>
              </div>

              {/* Action Buttons to deposit */}
              <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center gap-2">
                <span className="text-[11px] text-gray-500 font-medium">הפקדה מהירה:</span>
                <button
                  onClick={() => handleDepositClick(goal.id, 250)}
                  className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white border border-gray-200 hover:border-amber-400 hover:text-amber-700 transition cursor-pointer"
                >
                  +₪250
                </button>
                <button
                  onClick={() => handleDepositClick(goal.id, 500)}
                  className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white border border-gray-200 hover:border-amber-400 hover:text-amber-700 transition cursor-pointer"
                >
                  +₪500
                </button>
                <button
                  onClick={() => handleDepositClick(goal.id, 1000)}
                  className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white border border-gray-200 hover:border-amber-400 hover:text-amber-700 transition cursor-pointer"
                >
                  +₪1,000
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
