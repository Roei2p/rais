import { Plus } from 'lucide-react';
import { AppData } from '../types';
import { categoryOf } from '../data/categories';
import { MonthSummary, expensesInMonth, shekel } from '../lib/money';
import { ExpenseRow } from './Expenses';

interface Props {
  data: AppData;
  month: Date;
  sum: MonthSummary;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onSeeAll: () => void;
  onSetupMonthly: () => void;
}

export function Home({ data, month, sum, onAdd, onDelete, onSeeAll, onSetupMonthly }: Props) {
  const list = expensesInMonth(data.expenses, month).sort((a, b) => b.date.localeCompare(a.date));
  const noIncome = sum.income === 0;

  return (
    <div className="space-y-5">
      <Hero sum={sum} noIncome={noIncome} onSetupMonthly={onSetupMonthly} />

      {sum.isCurrent && (
        <button onClick={onAdd} className="btn-main !bg-coin !text-ink !min-h-[64px] !text-xl">
          <Plus className="w-7 h-7" strokeWidth={2.5} /> רישום הוצאה
        </button>
      )}

      {!noIncome && <MonthBar sum={sum} />}

      <section className="bg-card rounded-3xl p-5">
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="font-display text-xl">הוצאות אחרונות</h2>
          {list.length > 5 && <button onClick={onSeeAll} className="text-pine font-bold py-2">לכל ההוצאות</button>}
        </div>
        {list.length === 0 ? (
          <p className="text-muted py-3">
            עוד לא רשמת הוצאות החודש. כל פעם שמשלמים על משהו – סופר, דלק, קפה – לוחצים על „רישום הוצאה”. לוקח חמש שניות.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {list.slice(0, 5).map((e) => <ExpenseRow key={e.id} e={e} onDelete={onDelete} />)}
          </ul>
        )}
      </section>

      {list.length > 0 && <WhereItWent data={data} month={month} />}
    </div>
  );
}

function Hero({ sum, noIncome, onSetupMonthly }: { sum: MonthSummary; noIncome: boolean; onSetupMonthly: () => void }) {
  if (noIncome) {
    return (
      <section className="bg-ink text-white rounded-3xl p-6">
        <p className="font-display text-3xl leading-tight">כמה נכנס לך כל חודש?</p>
        <p className="mt-2 text-white/80">כדי לחשב כמה אפשר להוציא, צריך לדעת כמה נכנס וכמה יוצא על תשלומים קבועים.</p>
        <button onClick={onSetupMonthly} className="mt-5 btn-main !bg-coin !text-ink">להזנת משכורת ותשלומים</button>
      </section>
    );
  }

  if (!sum.isCurrent) {
    const good = sum.left >= 0;
    return (
      <section className={`rounded-3xl p-6 ${good ? 'bg-ink text-white' : 'bg-warn text-white'}`}>
        <p className="text-lg text-white/80">{sum.isPast ? 'החודש הזה נגמר' : 'החודש הזה עוד לא התחיל'}</p>
        <p className="font-display text-3xl leading-tight mt-1">
          {sum.isPast ? (good ? 'נשארת בפלוס של' : 'נגמר במינוס של') : 'צפוי להישאר לך'}
        </p>
        <p className="num text-6xl mt-2">{shekel(Math.abs(sum.left))}</p>
      </section>
    );
  }

  if (sum.left <= 0) {
    return (
      <section className="bg-warn text-white rounded-3xl p-6">
        <p className="font-display text-3xl leading-tight">החודש כבר עבר את התקציב</p>
        <p className="num text-6xl mt-3">{shekel(-sum.left)}</p>
        <p className="text-white/85 mt-1">מעבר למה שיש. כדאי לעצור הוצאות שלא חייבים עד סוף החודש ({sum.daysLeft} ימים).</p>
      </section>
    );
  }

  return (
    <section className="bg-ink text-white rounded-3xl p-6 relative overflow-hidden">
      <p className="font-display text-2xl leading-tight">היום אפשר להוציא עד</p>
      <p className="num text-[84px] leading-none mt-2 text-coin">{shekel(sum.perDay)}</p>
      <p className="mt-3 text-lg text-white/85">
        ועדיין לסיים את החודש בלי מינוס. נשארו לך <b className="text-white">{shekel(sum.left)}</b> ל־{sum.daysLeft} {sum.daysLeft === 1 ? 'יום' : 'ימים'}.
      </p>
    </section>
  );
}

function MonthBar({ sum }: { sum: MonthSummary }) {
  const spentPct = sum.free > 0 ? Math.min(100, (sum.spent / sum.free) * 100) : 100;
  const timePct = (sum.dayOfMonth / sum.daysInMonth) * 100;
  const ahead = sum.isCurrent && spentPct > timePct + 5;

  return (
    <section className="bg-card rounded-3xl p-5">
      <div className="flex justify-between items-baseline">
        <h2 className="font-display text-xl">החודש עד עכשיו</h2>
        <span className="text-muted">{shekel(sum.spent)} מתוך {shekel(sum.free)}</span>
      </div>
      <div className="relative h-5 rounded-full bg-pine-soft mt-3 overflow-hidden"
        role="img" aria-label={`הוצאת ${Math.round(spentPct)} אחוז מהכסף הפנוי`}>
        <div className={`absolute inset-y-0 right-0 rounded-full ${spentPct >= 100 ? 'bg-warn' : 'bg-pine'}`} style={{ width: `${spentPct}%` }} />
        {sum.isCurrent && <div className="absolute inset-y-0 w-1 bg-ink" style={{ right: `calc(${timePct}% - 2px)` }} />}
      </div>
      <p className="mt-3 text-muted">
        {sum.isCurrent
          ? ahead
            ? 'הקו השחור מראה כמה מהחודש עבר. ההוצאות רצות קצת מהר יותר – כדאי להאט.'
            : 'הקו השחור מראה כמה מהחודש עבר. ההוצאות בקצב טוב 👍'
          : `נכנס ${shekel(sum.income)}, יצא על קבועים ${shekel(sum.fixed)}.`}
      </p>
      <dl className="grid grid-cols-3 gap-2 mt-4 text-center">
        <Stat label="נכנס" value={sum.income} />
        <Stat label="קבועים" value={sum.fixed} />
        <Stat label="שאר ההוצאות" value={sum.spent} />
      </dl>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-paper rounded-2xl py-2.5">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="num text-xl">{shekel(value)}</dd>
    </div>
  );
}

function WhereItWent({ data, month }: { data: AppData; month: Date }) {
  const list = expensesInMonth(data.expenses, month);
  const total = list.reduce((s, e) => s + e.amount, 0);
  const groups = Object.entries(
    list.reduce<Record<string, number>>((g, e) => ({ ...g, [e.category]: (g[e.category] ?? 0) + e.amount }), {})
  ).sort((a, b) => b[1] - a[1]);

  return (
    <section className="bg-card rounded-3xl p-5">
      <h2 className="font-display text-xl mb-3">על מה הלך הכסף</h2>
      <ul className="space-y-3">
        {groups.map(([key, amount]) => {
          const c = categoryOf(key as never);
          const pct = Math.round((amount / total) * 100);
          return (
            <li key={key}>
              <div className="flex justify-between">
                <span className="font-semibold">{c.emoji} {c.name}</span>
                <span className="num">{shekel(amount)}</span>
              </div>
              <div className="h-2.5 bg-paper rounded-full mt-1 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.color }} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
