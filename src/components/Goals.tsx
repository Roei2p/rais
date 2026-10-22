import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Goal } from '../types';
import { shekel } from '../lib/money';
import { AmountInput, Sheet } from './Sheet';

const EMOJIS = ['🛟', '🏖️', '🚗', '🏠', '🎓', '💍', '👶', '🎁'];

interface Props {
  goals: Goal[];
  onAdd: (g: Omit<Goal, 'id' | 'saved'>) => void;
  onDeposit: (id: string, amount: number) => void;
  onDelete: (id: string) => void;
}

export function Goals({ goals, onAdd, onDeposit, onDelete }: Props) {
  const [adding, setAdding] = useState(false);
  const [depositTo, setDepositTo] = useState<Goal | null>(null);

  return (
    <div className="space-y-4">
      <div className="px-1">
        <h1 className="font-display text-3xl">חיסכון</h1>
        <p className="text-muted mt-1">שמים בצד למשהו חשוב. כל הפקדה נרשמת כהוצאה של החודש, כדי שלא תוציאו את אותו כסף פעמיים.</p>
      </div>

      {goals.length === 0 && (
        <p className="bg-card rounded-3xl p-5 text-muted">עוד אין יעדים. אפשר להתחיל ב„קופה לשעת חירום” – זה היעד הכי חשוב.</p>
      )}

      {goals.map((g) => {
        const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
        const done = g.saved >= g.target;
        return (
          <section key={g.id} className="bg-card rounded-3xl p-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden>{g.emoji}</span>
              <div className="flex-1">
                <h2 className="font-display text-xl">{g.title}</h2>
                <p className="text-muted">{done ? 'הגעת ליעד! 🎉' : `חסרים עוד ${shekel(g.target - g.saved)}`}</p>
              </div>
              <button onClick={() => window.confirm(`למחוק את היעד „${g.title}”?`) && onDelete(g.id)}
                aria-label={`מחיקת ${g.title}`} className="w-10 h-10 grid place-items-center rounded-full text-muted hover:text-warn hover:bg-warn-soft">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="h-4 bg-paper rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-coin rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between mt-2">
              <span className="num text-lg">{shekel(g.saved)}</span>
              <span className="text-muted">מתוך {shekel(g.target)}</span>
            </div>
            {!done && (
              <button onClick={() => setDepositTo(g)} className="mt-3 w-full min-h-[50px] rounded-2xl border-2 border-ink font-bold">
                להפקיד כסף
              </button>
            )}
          </section>
        );
      })}

      <button onClick={() => setAdding(true)} className="btn-main">
        <Plus className="w-6 h-6" /> יעד חיסכון חדש
      </button>

      {adding && <NewGoal onClose={() => setAdding(false)} onSave={(g) => { onAdd(g); setAdding(false); }} />}
      {depositTo && <Deposit goal={depositTo} onClose={() => setDepositTo(null)} onSave={(a) => { onDeposit(depositTo.id, a); setDepositTo(null); }} />}
    </div>
  );
}

function NewGoal({ onSave, onClose }: { onSave: (g: Omit<Goal, 'id' | 'saved'>) => void; onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const ok = title.trim() && parseFloat(target) > 0;
  return (
    <Sheet title="יעד חיסכון חדש" onClose={onClose}>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (ok) onSave({ title: title.trim(), target: parseFloat(target), emoji }); }}>
        <label className="block">
          <span className="block text-muted font-semibold mb-1.5">בשביל מה חוסכים?</span>
          <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="למשל: חופשה, רכב, קופה לשעת חירום" autoFocus />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="סמל">
          {EMOJIS.map((em) => (
            <button type="button" key={em} onClick={() => setEmoji(em)} aria-pressed={emoji === em}
              className={`w-12 h-12 rounded-2xl text-2xl border-2 ${emoji === em ? 'border-ink bg-coin-soft' : 'border-line'}`}>{em}</button>
          ))}
        </div>
        <AmountInput label="כמה צריך בסך הכל?" value={target} onChange={setTarget} />
        <button type="submit" className="btn-main" disabled={!ok}>שמירת היעד</button>
      </form>
    </Sheet>
  );
}

function Deposit({ goal, onSave, onClose }: { goal: Goal; onSave: (a: number) => void; onClose: () => void }) {
  const [amount, setAmount] = useState('');
  const v = parseFloat(amount);
  return (
    <Sheet title={`הפקדה ל${goal.title}`} onClose={onClose}>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (v > 0) onSave(v); }}>
        <AmountInput label="כמה לשים בצד?" value={amount} onChange={setAmount} autoFocus />
        <div className="flex gap-2">
          {[100, 250, 500].map((n) => (
            <button type="button" key={n} onClick={() => setAmount(String(n))} className="flex-1 min-h-[48px] rounded-2xl bg-paper num text-lg">{shekel(n)}</button>
          ))}
        </div>
        <button type="submit" className="btn-main" disabled={!(v > 0)}>הפקדה</button>
      </form>
    </Sheet>
  );
}
