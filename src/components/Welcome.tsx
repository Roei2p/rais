import { useState } from 'react';
import { MonthlyItem } from '../types';
import { newId } from '../lib/money';

const COMMON = ['שכר דירה / משכנתא', 'ארנונה', 'חשמל ומים', 'טלפון ואינטרנט', 'ביטוחים', 'גן / צהרון', 'הלוואה'];

export function Welcome({ onStart, onExample }: { onStart: (items: MonthlyItem[]) => void; onExample: () => void }) {
  const [income, setIncome] = useState('');
  const [fixed, setFixed] = useState<Record<string, string>>({});

  const start = () => {
    const items: MonthlyItem[] = [];
    const inc = parseFloat(income);
    if (inc > 0) items.push({ id: newId(), title: 'משכורת', amount: inc, kind: 'income' });
    for (const [title, v] of Object.entries(fixed)) {
      const n = parseFloat(v);
      if (n > 0) items.push({ id: newId(), title, amount: n, kind: 'fixed' });
    }
    onStart(items);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <header>
        <Logo />
        <h1 className="font-display text-4xl leading-tight mt-6">לדעת כל יום כמה מותר להוציא.</h1>
        <p className="text-lg text-muted mt-3">
          רושמים כמה נכנס ומה משלמים קבוע כל חודש. אחר כך רק רושמים הוצאות – והאפליקציה אומרת כמה נשאר עד סוף החודש.
        </p>
        <p className="mt-3 text-sm font-semibold text-pine">בלי הרשמה ובלי חיבור לבנק. הכל נשמר רק בטלפון שלך.</p>
      </header>

      <section className="card p-5 space-y-4">
        <label className="block">
          <span className="block font-display text-xl mb-2">כמה כסף נכנס לך בחודש?</span>
          <span className="block text-muted mb-2">נטו, אחרי מסים. אם יש שתי משכורות בבית – לחבר אותן.</span>
          <div className="flex items-center gap-2 field focus-within:border-pine">
            <span className="num text-2xl text-muted">₪</span>
            <input type="number" inputMode="decimal" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="0" className="num text-3xl w-full bg-transparent outline-none" />
          </div>
        </label>
      </section>

      <section className="card p-5">
        <h2 className="font-display text-xl">מה משלמים קבוע כל חודש?</h2>
        <p className="text-muted mb-3">ממלאים רק מה שרלוונטי. אפשר לשנות ולהוסיף אחר כך.</p>
        <ul className="space-y-2">
          {COMMON.map((t) => (
            <li key={t} className="flex items-center gap-3">
              <label htmlFor={t} className="flex-1 font-semibold">{t}</label>
              <input id={t} type="number" inputMode="decimal" placeholder="₪" value={fixed[t] ?? ''}
                onChange={(e) => setFixed({ ...fixed, [t]: e.target.value })} className="field num !w-32 text-lg text-left" />
            </li>
          ))}
        </ul>
      </section>

      <button onClick={start} className="btn-main !min-h-[64px] !text-xl" disabled={!(parseFloat(income) > 0)}>מתחילים</button>
      <button onClick={onExample} className="w-full py-3 text-leaf font-semibold">רוצה קודם לראות דוגמה</button>
    </div>
  );
}

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="w-9 h-9 rounded-xl bg-pine grid place-items-center num text-lg text-coin rotate-[-6deg]" aria-hidden>₪</span>
      <span className="text-[22px] font-extrabold tracking-tight">הכסף שלי</span>
    </div>
  );
}
