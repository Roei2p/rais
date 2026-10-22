import { useState } from 'react';
import {
  Baby, Banknote, Car, ChevronLeft, Dumbbell, GraduationCap, HandCoins, HeartPulse, Home, Landmark,
  LucideIcon, Plus, Repeat, ShieldCheck, Tv, Wallet, Wifi, Zap,
} from 'lucide-react';
import { MonthlyItem } from '../types';
import { newId, shekel } from '../lib/money';
import { AmountInput, DeleteButton, Sheet } from './Sheet';
import { IconTile } from './IconTile';

const RULES: [RegExp, LucideIcon, string, string][] = [
  [/דירה|משכנתא|שכירות/, Home, '#1F8A63', '#DDF2E8'],
  [/ארנונה|ועד/, Landmark, '#8A6A4F', '#F2E9E1'],
  [/חשמל|מים|גז/, Zap, '#D99A00', '#FFF1C9'],
  [/טלפון|אינטרנט|סלולר/, Wifi, '#2D6FD6', '#DFEAFB'],
  [/ביטוח|פנסיה/, ShieldCheck, '#0E9AA7', '#D7F2F4'],
  [/גן|צהרון|מטפלת/, Baby, '#E07A1F', '#FDEBD9'],
  [/הלוואה|חוב/, HandCoins, '#D9472F', '#FDE6E1'],
  [/רכב|ליסינג/, Car, '#7C4DDB', '#ECE4FB'],
  [/נטפליקס|טלוויזיה|יס|הוט|מנוי/, Tv, '#D6427A', '#FBE1EB'],
  [/חוג|לימוד|שכר לימוד/, GraduationCap, '#7C4DDB', '#ECE4FB'],
  [/כושר|מכון/, Dumbbell, '#0E9AA7', '#D7F2F4'],
  [/קופת חולים|בריאות/, HeartPulse, '#D9472F', '#FDE6E1'],
];

const iconFor = (i: MonthlyItem) => {
  if (i.kind === 'income') return /קצב|ביטוח לאומי/.test(i.title) ? ([Banknote, '#1F8A63', '#DDF2E8'] as const) : ([Wallet, '#1F8A63', '#DDF2E8'] as const);
  const hit = RULES.find(([re]) => re.test(i.title));
  return hit ? ([hit[1], hit[2], hit[3]] as const) : ([Repeat, '#5B6F67', '#E9EEEB'] as const);
};

interface Props { items: MonthlyItem[]; onChange: (items: MonthlyItem[]) => void; }

export function Monthly({ items, onChange }: Props) {
  const [editing, setEditing] = useState<MonthlyItem | { kind: MonthlyItem['kind'] } | null>(null);
  const income = items.filter((i) => i.kind === 'income');
  const fixed = items.filter((i) => i.kind === 'fixed');
  const sum = (l: MonthlyItem[]) => l.reduce((s, i) => s + i.amount, 0);
  const free = sum(income) - sum(fixed);

  const save = (item: Omit<MonthlyItem, 'id'> & { id?: string }) => {
    if (item.id) onChange(items.map((i) => (i.id === item.id ? (item as MonthlyItem) : i)));
    else onChange([...items, { ...item, id: newId() }]);
    setEditing(null);
  };

  const Section = ({ title, hint, kind, list }: { title: string; hint: string; kind: MonthlyItem['kind']; list: MonthlyItem[] }) => (
    <section className="card p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl">{title}</h2>
        <span className="num text-xl">{shekel(sum(list))}</span>
      </div>
      {list.length === 0 && <p className="text-muted mt-1">{hint}</p>}
      <ul className="divide-y divide-line mt-1">
        {list.map((i) => {
          const [Icon, color, tint] = iconFor(i);
          return (
            <li key={i.id}>
              <button onClick={() => setEditing(i)} className="w-full flex items-center gap-3 py-3 text-right group" aria-label={`עריכת ${i.title}`}>
                <IconTile Icon={Icon} color={color} tint={tint} size={42} />
                <span className="flex-1 font-semibold">{i.title}</span>
                <span className="num text-lg">{shekel(i.amount)}</span>
                <ChevronLeft className="w-5 h-5 text-[#B9C5C0] group-hover:text-ink" aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>
      <button onClick={() => setEditing({ kind })} className="mt-2 flex items-center gap-1.5 text-leaf font-semibold py-2">
        <Plus className="w-5 h-5" strokeWidth={2.5} /> {kind === 'income' ? 'הוספת הכנסה' : 'הוספת תשלום קבוע'}
      </button>
    </section>
  );

  return (
    <div className="space-y-4">
      <div className="px-1">
        <h1 className="text-3xl">כל חודש</h1>
        <p className="text-muted">מה נכנס ומה יוצא קבוע. לוחצים על שורה כדי לשנות.</p>
      </div>

      <section className={`rounded-[26px] p-5 ${free >= 0 ? 'bg-leaf-soft' : 'bg-warn-soft'}`}>
        <p className="font-medium">אחרי התשלומים הקבועים נשאר כל חודש</p>
        <p className={`num text-[44px] leading-tight ${free < 0 ? 'text-warn' : 'text-pine'}`}>{shekel(free)}</p>
        <p className="text-muted text-[15px]">לסופר, דלק, בגדים וכל השאר</p>
      </section>

      {Section({ title: 'מה נכנס', hint: 'משכורת, קצבאות, הכנסה משכירות…', kind: 'income', list: income })}
      {Section({ title: 'תשלומים קבועים', hint: 'שכירות, ארנונה, חשמל, טלפון, ביטוחים, גן…', kind: 'fixed', list: fixed })}

      {editing && (
        <ItemForm
          initial={'id' in editing ? editing : undefined}
          kind={editing.kind}
          onClose={() => setEditing(null)}
          onSave={save}
          onDelete={'id' in editing ? () => { onChange(items.filter((x) => x.id !== editing.id)); setEditing(null); } : undefined}
        />
      )}
    </div>
  );
}

function ItemForm({ initial, kind, onSave, onDelete, onClose }: {
  initial?: MonthlyItem; kind: MonthlyItem['kind'];
  onSave: (i: Omit<MonthlyItem, 'id'> & { id?: string }) => void; onDelete?: () => void; onClose: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const ok = title.trim() && parseFloat(amount) > 0;
  const word = kind === 'income' ? 'הכנסה' : 'תשלום קבוע';

  return (
    <Sheet title={initial ? `עריכת ${word}` : `${word} ${kind === 'income' ? 'חדשה' : 'חדש'}`} onClose={onClose}>
      <form className="space-y-5" onSubmit={(e) => {
        e.preventDefault();
        if (ok) onSave({ id: initial?.id, title: title.trim(), amount: parseFloat(amount), kind });
      }}>
        <label className="block">
          <span className="block text-muted font-medium mb-1.5">שם</span>
          <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus={!initial}
            placeholder={kind === 'income' ? 'למשל: משכורת' : 'למשל: שכר דירה'} />
        </label>
        <AmountInput label="כמה בחודש?" value={amount} onChange={setAmount} />
        <button type="submit" className="btn-main" disabled={!ok}>{initial ? 'שמירת השינויים' : 'הוספה'}</button>
        {onDelete && <DeleteButton label="מחיקה" onClick={() => window.confirm(`למחוק את „${initial?.title}”?`) && onDelete()} />}
      </form>
    </Sheet>
  );
}
