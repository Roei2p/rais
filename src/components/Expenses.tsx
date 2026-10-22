import { Trash2 } from 'lucide-react';
import { AppData, Expense } from '../types';
import { categoryOf } from '../data/categories';
import { expensesInMonth, shekel } from '../lib/money';

const dayLabel = (iso: string) => {
  const d = new Date(iso + 'T12:00:00');
  const today = new Date();
  const y = new Date(); y.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'היום';
  if (d.toDateString() === y.toDateString()) return 'אתמול';
  return d.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'numeric' });
};

export function ExpenseRow({ e, onDelete }: { e: Expense; onDelete: (id: string) => void }) {
  const c = categoryOf(e.category);
  return (
    <li className="flex items-center gap-3 py-3">
      <span className="w-11 h-11 shrink-0 rounded-2xl grid place-items-center text-xl" style={{ background: c.color + '1f' }} aria-hidden>{c.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{e.note || c.name}</p>
        <p className="text-sm text-muted">{e.note ? `${c.name} · ` : ''}{dayLabel(e.date)}</p>
      </div>
      <span className="num text-lg">{shekel(e.amount)}</span>
      <button
        onClick={() => window.confirm('למחוק את ההוצאה הזו?') && onDelete(e.id)}
        aria-label={`מחיקת ${e.note || c.name}`}
        className="w-10 h-10 grid place-items-center rounded-full text-muted hover:text-warn hover:bg-warn-soft">
        <Trash2 className="w-5 h-5" />
      </button>
    </li>
  );
}

export function Expenses({ data, month, onDelete }: { data: AppData; month: Date; onDelete: (id: string) => void }) {
  const list = expensesInMonth(data.expenses, month).sort((a, b) => b.date.localeCompare(a.date));
  const total = list.reduce((s, e) => s + e.amount, 0);
  const byDay = list.reduce<Record<string, Expense[]>>((g, e) => ({ ...g, [e.date]: [...(g[e.date] ?? []), e] }), {});

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between px-1">
        <h1 className="font-display text-3xl">כל ההוצאות</h1>
        <span className="num text-2xl">{shekel(total)}</span>
      </div>
      {list.length === 0 && (
        <p className="bg-card rounded-3xl p-5 text-muted">אין הוצאות בחודש הזה.</p>
      )}
      {Object.entries(byDay).map(([day, items]) => (
        <section key={day} className="bg-card rounded-3xl px-5 py-2">
          <h2 className="text-muted font-bold pt-2">{dayLabel(day)}</h2>
          <ul className="divide-y divide-line">
            {items.map((e) => <ExpenseRow key={e.id} e={e} onDelete={onDelete} />)}
          </ul>
        </section>
      ))}
    </div>
  );
}
