import { useState } from 'react';
import { Check } from 'lucide-react';
import { Expense, CategoryKey } from '../types';
import { PICKABLE } from '../data/categories';
import { toISO } from '../lib/money';
import { AmountInput, Sheet } from './Sheet';

export function AddExpense({ onSave, onClose }: { onSave: (e: Omit<Expense, 'id'>) => void; onClose: () => void }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryKey | null>(null);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(toISO(new Date()));
  const value = parseFloat(amount);
  const ok = value > 0 && category;

  return (
    <Sheet title="הוצאה חדשה" onClose={onClose}>
      <form className="space-y-5" onSubmit={(e) => {
        e.preventDefault();
        if (!ok) return;
        onSave({ amount: value, category: category!, note: note.trim() || undefined, date });
      }}>
        <AmountInput label="כמה שילמת?" value={amount} onChange={setAmount} autoFocus />

        <fieldset>
          <legend className="text-muted font-semibold mb-2">על מה?</legend>
          <div className="grid grid-cols-3 gap-2">
            {PICKABLE.map((c) => {
              const on = category === c.key;
              return (
                <button type="button" key={c.key} onClick={() => setCategory(c.key)} aria-pressed={on}
                  className={`min-h-[76px] rounded-2xl border-2 flex flex-col items-center justify-center gap-0.5 text-[15px] font-semibold leading-tight px-1 ${on ? 'border-ink bg-coin-soft' : 'border-line bg-card'}`}>
                  <span className="text-2xl" aria-hidden>{c.emoji}</span>
                  {c.name}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-muted font-semibold mb-1.5">הערה (לא חובה)</span>
            <input className="field" value={note} onChange={(e) => setNote(e.target.value)} placeholder="למשל: שופרסל" />
          </label>
          <label className="block">
            <span className="block text-muted font-semibold mb-1.5">מתי?</span>
            <input type="date" className="field" value={date} max={toISO(new Date())} onChange={(e) => setDate(e.target.value)} />
          </label>
        </div>

        <button type="submit" className="btn-main" disabled={!ok}>
          <Check className="w-6 h-6" /> שמירת ההוצאה
        </button>
      </form>
    </Sheet>
  );
}
