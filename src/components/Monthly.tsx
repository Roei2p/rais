import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { MonthlyItem } from '../types';
import { newId, shekel } from '../lib/money';

interface Props { items: MonthlyItem[]; onChange: (items: MonthlyItem[]) => void; }

export function Monthly({ items, onChange }: Props) {
  const income = items.filter((i) => i.kind === 'income');
  const fixed = items.filter((i) => i.kind === 'fixed');
  const sum = (l: MonthlyItem[]) => l.reduce((s, i) => s + i.amount, 0);
  const free = sum(income) - sum(fixed);

  return (
    <div className="space-y-5">
      <div className="px-1">
        <h1 className="font-display text-3xl">כל חודש</h1>
        <p className="text-muted mt-1">מה נכנס ומה יוצא קבוע, בלי שצריך לרשום כל פעם מחדש.</p>
      </div>

      <List title="מה נכנס" hint="משכורת, קצבאות, שכר דירה שמקבלים…" kind="income" items={income} all={items} onChange={onChange} />
      <List title="תשלומים קבועים" hint="שכירות, ארנונה, חשמל, טלפון, ביטוחים, גן…" kind="fixed" items={fixed} all={items} onChange={onChange} />

      <section className={`rounded-3xl p-5 ${free >= 0 ? 'bg-pine-soft' : 'bg-warn-soft'}`}>
        <p className="font-semibold">אחרי התשלומים הקבועים נשאר לך כל חודש</p>
        <p className={`num text-4xl mt-1 ${free < 0 ? 'text-warn' : ''}`}>{shekel(free)}</p>
        <p className="text-muted mt-1">זה הכסף לסופר, דלק, בגדים וכל השאר.</p>
      </section>
    </div>
  );
}

function List({ title, hint, kind, items, all, onChange }: {
  title: string; hint: string; kind: MonthlyItem['kind']; items: MonthlyItem[]; all: MonthlyItem[]; onChange: (i: MonthlyItem[]) => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const start = (item?: MonthlyItem) => {
    setEditing(item?.id ?? 'new');
    setName(item?.title ?? '');
    setAmount(item ? String(item.amount) : '');
  };
  const save = () => {
    const value = parseFloat(amount);
    if (!name.trim() || !(value > 0)) return;
    if (editing === 'new') onChange([...all, { id: newId(), title: name.trim(), amount: value, kind }]);
    else onChange(all.map((i) => (i.id === editing ? { ...i, title: name.trim(), amount: value } : i)));
    setEditing(null);
  };

  return (
    <section className="bg-card rounded-3xl p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-xl">{title}</h2>
        <span className="num text-xl">{shekel(items.reduce((s, i) => s + i.amount, 0))}</span>
      </div>
      {items.length === 0 && editing === null && <p className="text-muted mt-1">{hint}</p>}
      <ul className="divide-y divide-line mt-1">
        {items.map((i) =>
          editing === i.id ? null : (
            <li key={i.id} className="flex items-center gap-2 py-2.5">
              <span className="flex-1 font-semibold">{i.title}</span>
              <span className="num text-lg">{shekel(i.amount)}</span>
              <button onClick={() => start(i)} aria-label={`עריכת ${i.title}`} className="w-10 h-10 grid place-items-center rounded-full text-muted hover:bg-paper"><Pencil className="w-5 h-5" /></button>
              <button onClick={() => window.confirm(`למחוק את „${i.title}”?`) && onChange(all.filter((x) => x.id !== i.id))}
                aria-label={`מחיקת ${i.title}`} className="w-10 h-10 grid place-items-center rounded-full text-muted hover:text-warn hover:bg-warn-soft"><Trash2 className="w-5 h-5" /></button>
            </li>
          )
        )}
      </ul>

      {editing !== null ? (
        <form className="mt-3 space-y-3 bg-paper rounded-2xl p-3" onSubmit={(e) => { e.preventDefault(); save(); }}>
          <input className="field" placeholder={kind === 'income' ? 'למשל: משכורת' : 'למשל: שכר דירה'} value={name} onChange={(e) => setName(e.target.value)} autoFocus aria-label="שם" />
          <input className="field num text-xl" type="number" inputMode="decimal" placeholder="סכום בחודש ₪" value={amount} onChange={(e) => setAmount(e.target.value)} aria-label="סכום בחודש" />
          <div className="flex gap-2">
            <button type="submit" className="btn-main flex-1">שמירה</button>
            <button type="button" onClick={() => setEditing(null)} className="px-5 rounded-2xl font-bold text-muted">ביטול</button>
          </div>
        </form>
      ) : (
        <button onClick={() => start()} className="mt-2 flex items-center gap-1.5 text-pine font-bold py-2">
          <Plus className="w-5 h-5" /> {kind === 'income' ? 'הוספת הכנסה' : 'הוספת תשלום קבוע'}
        </button>
      )}
    </section>
  );
}
