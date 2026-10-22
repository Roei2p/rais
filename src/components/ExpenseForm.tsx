import { useState } from 'react';
import { Check } from 'lucide-react';
import { Expense, CategoryKey } from '../types';
import { PICKABLE } from '../data/categories';
import { toISO } from '../lib/money';
import { AmountInput, DeleteButton, Sheet } from './Sheet';

interface Props {
  initial?: Expense;
  onSave: (e: Omit<Expense, 'id'>) => void;
  onDelete?: () => void;
  onClose: () => void;
}

export function ExpenseForm({ initial, onSave, onDelete, onClose }: Props) {
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [category, setCategory] = useState<CategoryKey | null>(initial?.category ?? null);
  const [note, setNote] = useState(initial?.note ?? '');
  const [date, setDate] = useState(initial?.date ?? toISO(new Date()));
  const value = parseFloat(amount);
  const ok = value > 0 && category;
  const isSavings = initial?.category === 'savings';

  return (
    <Sheet title={initial ? 'עריכת הוצאה' : 'הוצאה חדשה'} onClose={onClose}>
      <form className="space-y-5" onSubmit={(e) => {
        e.preventDefault();
        if (ok) onSave({ amount: value, category: category!, note: note.trim() || undefined, date });
      }}>
        <AmountInput label="כמה שילמת?" value={amount} onChange={setAmount} autoFocus={!initial} />

        {!isSavings && (
          <fieldset>
            <legend className="text-muted font-medium mb-2">על מה?</legend>
            <div className="grid grid-cols-3 gap-2">
              {PICKABLE.map(({ key, name, Icon, color, tint }) => {
                const on = category === key;
                return (
                  <button type="button" key={key} onClick={() => setCategory(key)} aria-pressed={on}
                    className="min-h-[84px] rounded-[20px] flex flex-col items-center justify-center gap-1.5 text-[14px] font-semibold leading-tight px-1 transition-all"
                    style={on ? { background: color, color: '#fff', boxShadow: `0 6px 16px -6px ${color}` } : { background: tint, color: '#0F2A20' }}>
                    <Icon className="w-6 h-6" strokeWidth={2.2} style={on ? undefined : { color }} />
                    {name}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-muted font-medium mb-1.5">הערה</span>
            <input className="field" value={note} onChange={(e) => setNote(e.target.value)} placeholder="לא חובה" />
          </label>
          <label className="block">
            <span className="block text-muted font-medium mb-1.5">מתי?</span>
            <input type="date" className="field" value={date} max={toISO(new Date())} onChange={(e) => setDate(e.target.value)} />
          </label>
        </div>

        <button type="submit" className="btn-main" disabled={!ok}>
          <Check className="w-6 h-6" strokeWidth={2.5} /> {initial ? 'שמירת השינויים' : 'שמירת ההוצאה'}
        </button>
        {onDelete && <DeleteButton label="מחיקת ההוצאה" onClick={() => window.confirm('למחוק את ההוצאה הזו?') && onDelete()} />}
      </form>
    </Sheet>
  );
}
