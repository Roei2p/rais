import { useState } from 'react';
import { Pencil, PiggyBank, Plus, Trophy } from 'lucide-react';
import { Goal } from '../types';
import { GOAL_ICONS, goalIcon } from '../data/categories';
import { shekel } from '../lib/money';
import { AmountInput, DeleteButton, Sheet } from './Sheet';
import { IconTile } from './IconTile';

interface Props {
  goals: Goal[];
  onSave: (g: Goal | Omit<Goal, 'id'>) => void;
  onDeposit: (id: string, amount: number) => void;
  onDelete: (id: string) => void;
}

export function Goals({ goals, onSave, onDeposit, onDelete }: Props) {
  const [editing, setEditing] = useState<Goal | 'new' | null>(null);
  const [depositTo, setDepositTo] = useState<Goal | null>(null);
  const total = goals.reduce((s, g) => s + g.saved, 0);

  return (
    <div className="space-y-4">
      <div className="px-1 flex items-end justify-between">
        <div>
          <h1 className="text-3xl">חיסכון</h1>
          <p className="text-muted">כסף שמים בצד למשהו חשוב</p>
        </div>
        {goals.length > 0 && <span className="num text-2xl text-leaf">{shekel(total)}</span>}
      </div>

      {goals.length === 0 && (
        <div className="card p-6 text-center">
          <PiggyBank className="w-12 h-12 mx-auto text-coin" strokeWidth={1.8} />
          <p className="font-semibold mt-2">עוד אין יעדים</p>
          <p className="text-muted mt-1">כדאי להתחיל ב„קופה לשעת חירום”, היעד הכי חשוב.</p>
        </div>
      )}

      {goals.map((g) => {
        const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
        const done = g.saved >= g.target;
        const gi = goalIcon(g.icon);
        return (
          <section key={g.id} className="card p-5">
            <div className="flex items-center gap-3">
              <IconTile Icon={done ? Trophy : gi.Icon} color={gi.color} tint={gi.tint} size={52} />
              <div className="flex-1 min-w-0">
                <h2 className="text-lg truncate">{g.title}</h2>
                <p className="text-muted text-[15px]">{done ? 'הגעת ליעד! 🎉' : `חסרים ${shekel(g.target - g.saved)}`}</p>
              </div>
              <button onClick={() => setEditing(g)} aria-label={`עריכת ${g.title}`} className="icon-btn"><Pencil className="w-5 h-5" /></button>
            </div>
            <div className="flex items-baseline justify-between mt-4">
              <span className="num text-2xl">{shekel(g.saved)}</span>
              <span className="text-muted text-[15px]">{pct}% מתוך {shekel(g.target)}</span>
            </div>
            <div className="h-3 bg-paper rounded-full mt-2 overflow-hidden">
              <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${pct}%`, background: gi.color }} />
            </div>
            {!done && (
              <button onClick={() => setDepositTo(g)} className="mt-4 w-full min-h-[50px] rounded-[18px] font-bold flex items-center justify-center gap-2"
                style={{ background: gi.tint, color: '#0F2A20' }}>
                <Plus className="w-5 h-5" strokeWidth={2.6} /> להפקיד
              </button>
            )}
          </section>
        );
      })}

      <button onClick={() => setEditing('new')} className="btn-main">
        <Plus className="w-6 h-6" strokeWidth={2.5} /> יעד חיסכון חדש
      </button>

      {editing && (
        <GoalForm
          initial={editing === 'new' ? undefined : editing}
          onClose={() => setEditing(null)}
          onSave={(g) => { onSave(g); setEditing(null); }}
          onDelete={editing === 'new' ? undefined : () => { onDelete(editing.id); setEditing(null); }}
        />
      )}
      {depositTo && <Deposit goal={depositTo} onClose={() => setDepositTo(null)} onSave={(a) => { onDeposit(depositTo.id, a); setDepositTo(null); }} />}
    </div>
  );
}

function GoalForm({ initial, onSave, onDelete, onClose }: {
  initial?: Goal; onSave: (g: Goal | Omit<Goal, 'id'>) => void; onDelete?: () => void; onClose: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [target, setTarget] = useState(initial ? String(initial.target) : '');
  const [saved, setSaved] = useState(initial ? String(initial.saved) : '');
  const [icon, setIcon] = useState(initial?.icon && GOAL_ICONS[initial.icon] ? initial.icon : 'safety');
  const ok = title.trim() && parseFloat(target) > 0;

  return (
    <Sheet title={initial ? 'עריכת יעד' : 'יעד חיסכון חדש'} onClose={onClose}>
      <form className="space-y-5" onSubmit={(e) => {
        e.preventDefault();
        if (!ok) return;
        const g = { title: title.trim(), target: parseFloat(target), saved: Math.max(0, parseFloat(saved) || 0), icon };
        onSave(initial ? { ...initial, ...g } : g);
      }}>
        <label className="block">
          <span className="block text-muted font-medium mb-1.5">בשביל מה חוסכים?</span>
          <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="חופשה, רכב, קופה לשעת חירום…" autoFocus={!initial} />
        </label>
        <fieldset>
          <legend className="text-muted font-medium mb-2">סמל</legend>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(GOAL_ICONS).map(([key, { Icon, color, tint }]) => {
              const on = icon === key;
              return (
                <button type="button" key={key} onClick={() => setIcon(key)} aria-pressed={on} aria-label={key}
                  className="h-14 rounded-2xl grid place-items-center transition-all"
                  style={on ? { background: color, color: '#fff', boxShadow: `0 6px 14px -6px ${color}` } : { background: tint, color }}>
                  <Icon className="w-6 h-6" strokeWidth={2.2} />
                </button>
              );
            })}
          </div>
        </fieldset>
        <AmountInput label="כמה צריך בסך הכל?" value={target} onChange={setTarget} />
        <AmountInput label="כמה כבר יש בצד?" value={saved} onChange={setSaved} />
        <button type="submit" className="btn-main" disabled={!ok}>{initial ? 'שמירת השינויים' : 'יצירת היעד'}</button>
        {onDelete && <DeleteButton label="מחיקת היעד" onClick={() => window.confirm(`למחוק את היעד „${initial?.title}”?`) && onDelete()} />}
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
          {[100, 250, 500, 1000].map((n) => (
            <button type="button" key={n} onClick={() => setAmount(String(n))}
              className={`flex-1 min-h-[48px] rounded-2xl num ${String(n) === amount ? 'bg-pine text-white' : 'bg-paper'}`}>{shekel(n)}</button>
          ))}
        </div>
        <p className="text-sm text-muted">ההפקדה נרשמת כהוצאה של החודש, כדי שלא תוציאו את אותו כסף פעמיים.</p>
        <button type="submit" className="btn-main" disabled={!(v > 0)}>הפקדה</button>
      </form>
    </Sheet>
  );
}
