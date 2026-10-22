import { ChevronLeft, ReceiptText } from 'lucide-react';
import { AppData, Expense } from '../types';
import { categoryOf } from '../data/categories';
import { expensesInMonth, shekel } from '../lib/money';
import { IconTile } from './IconTile';

export const dayLabel = (iso: string) => {
  const d = new Date(iso + 'T12:00:00');
  const today = new Date();
  const y = new Date(); y.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'היום';
  if (d.toDateString() === y.toDateString()) return 'אתמול';
  return d.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'numeric' });
};

export function ExpenseRow({ e, onEdit, showDay = true }: { e: Expense; onEdit: (e: Expense) => void; showDay?: boolean }) {
  const c = categoryOf(e.category);
  return (
    <li>
      <button onClick={() => onEdit(e)} className="w-full flex items-center gap-3 py-3 text-right group" aria-label={`עריכת ${e.note || c.name}, ${shekel(e.amount)}`}>
        <IconTile Icon={c.Icon} color={c.color} tint={c.tint} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{e.note || c.name}</p>
          <p className="text-sm text-muted truncate">{[e.note ? c.name : null, showDay ? dayLabel(e.date) : null].filter(Boolean).join(' · ')}</p>
        </div>
        <span className="num text-lg">{shekel(e.amount)}</span>
        <ChevronLeft className="w-5 h-5 text-[#B9C5C0] group-hover:text-ink transition" aria-hidden />
      </button>
    </li>
  );
}

export function Expenses({ data, month, onEdit }: { data: AppData; month: Date; onEdit: (e: Expense) => void }) {
  const list = expensesInMonth(data.expenses, month).sort((a, b) => b.date.localeCompare(a.date));
  const total = list.reduce((s, e) => s + e.amount, 0);
  const byDay = list.reduce<Record<string, Expense[]>>((g, e) => ({ ...g, [e.date]: [...(g[e.date] ?? []), e] }), {});

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between px-1">
        <div>
          <h1 className="text-3xl">כל ההוצאות</h1>
          <p className="text-muted">לוחצים על הוצאה כדי לערוך או למחוק</p>
        </div>
        <span className="num text-2xl">{shekel(total)}</span>
      </div>
      {list.length === 0 && (
        <div className="card p-8 text-center text-muted">
          <ReceiptText className="w-10 h-10 mx-auto mb-2 text-[#B9C5C0]" />
          אין הוצאות בחודש הזה.
        </div>
      )}
      {Object.entries(byDay).map(([day, items]) => (
        <section key={day} className="card px-5 py-2">
          <div className="flex justify-between pt-3 text-sm font-semibold text-muted">
            <h2>{dayLabel(day)}</h2>
            <span>{shekel(items.reduce((s, e) => s + e.amount, 0))}</span>
          </div>
          <ul className="divide-y divide-line">
            {items.map((e) => <ExpenseRow key={e.id} e={e} onEdit={onEdit} showDay={false} />)}
          </ul>
        </section>
      ))}
    </div>
  );
}
