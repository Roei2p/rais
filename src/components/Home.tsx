import { ArrowDownToLine, CalendarClock, Gauge, Plus, ShoppingBag, ThumbsUp, TriangleAlert, Wallet } from 'lucide-react';
import { AppData, CategoryKey, Expense } from '../types';
import { categoryOf } from '../data/categories';
import { MonthSummary, expensesInMonth, shekel } from '../lib/money';
import { ExpenseRow } from './Expenses';
import { IconTile } from './IconTile';

interface Props {
  data: AppData;
  month: Date;
  sum: MonthSummary;
  onAdd: () => void;
  onEdit: (e: Expense) => void;
  onSeeAll: () => void;
  onSetupMonthly: () => void;
}

export function Home({ data, month, sum, onAdd, onEdit, onSeeAll, onSetupMonthly }: Props) {
  const list = expensesInMonth(data.expenses, month).sort((a, b) => b.date.localeCompare(a.date));
  const noIncome = sum.income === 0;

  return (
    <div className="space-y-4">
      <Hero sum={sum} noIncome={noIncome} onSetupMonthly={onSetupMonthly} />

      {!noIncome && <Numbers sum={sum} />}

      <section className="card p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl">הוצאות אחרונות</h2>
          {list.length > 5 && <button onClick={onSeeAll} className="text-leaf font-semibold py-2">לכולן</button>}
        </div>
        {list.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-muted">עוד לא נרשמו הוצאות החודש.</p>
            {sum.isCurrent && (
              <button onClick={onAdd} className="mt-3 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-coin font-bold">
                <Plus className="w-5 h-5" strokeWidth={2.6} /> לרשום את הראשונה
              </button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {list.slice(0, 5).map((e) => <ExpenseRow key={e.id} e={e} onEdit={onEdit} />)}
          </ul>
        )}
      </section>

      {list.length > 0 && <WhereItWent list={list} />}
    </div>
  );
}

function Hero({ sum, noIncome, onSetupMonthly }: { sum: MonthSummary; noIncome: boolean; onSetupMonthly: () => void }) {
  const base = 'rounded-[30px] p-6 text-white relative overflow-hidden';
  const pine = { background: 'radial-gradient(120% 90% at 100% 0%, #1F6B4E 0%, #0F3D2E 55%, #0B2E22 100%)' };
  const red = { background: 'radial-gradient(120% 90% at 100% 0%, #E8644A 0%, #C33A24 60%, #A82E1B 100%)' };

  if (noIncome) {
    return (
      <section className={base} style={pine}>
        <Wallet className="w-9 h-9 text-coin" />
        <p className="text-3xl font-bold leading-tight mt-3">כמה נכנס לך כל חודש?</p>
        <p className="mt-2 text-white/80">כדי לדעת כמה אפשר להוציא, צריך לדעת כמה נכנס וכמה יוצא על תשלומים קבועים.</p>
        <button onClick={onSetupMonthly} className="mt-5 btn-main !bg-coin !text-ink">להזנת משכורת ותשלומים</button>
      </section>
    );
  }

  const spentPct = sum.free > 0 ? Math.min(100, (sum.spent / sum.free) * 100) : 100;

  if (!sum.isCurrent) {
    const good = sum.left >= 0;
    return (
      <section className={base} style={good ? pine : red}>
        <p className="text-white/75 font-medium">{sum.isPast ? 'החודש הזה נגמר' : 'החודש הזה עוד לא התחיל'}</p>
        <p className="text-2xl font-bold mt-1">
          {sum.isPast ? (good ? 'נשארת בפלוס של' : 'נגמר במינוס של') : 'צפוי להישאר לך'}
        </p>
        <p className="num text-[64px] leading-none mt-3">{shekel(Math.abs(sum.left))}</p>
      </section>
    );
  }

  if (sum.left <= 0) {
    return (
      <section className={base} style={red}>
        <div className="flex items-center gap-2 font-semibold text-white/90"><TriangleAlert className="w-5 h-5" /> חריגה מהתקציב</div>
        <p className="num text-[64px] leading-none mt-3">{shekel(-sum.left)}</p>
        <p className="text-white/90 mt-3">יצא יותר ממה שיש החודש. כדאי לעצור הוצאות שלא חייבים ב־{sum.daysLeft} הימים שנשארו.</p>
      </section>
    );
  }

  return (
    <section className={base} style={pine}>
      <p className="text-lg font-medium text-white/80">היום אפשר להוציא עד</p>
      <p className="num text-[80px] leading-[0.95] mt-1 text-coin">{shekel(sum.perDay)}</p>
      <p className="mt-2 text-white/85">ולסיים את החודש בלי מינוס</p>

      <div className="mt-5 bg-white/10 rounded-2xl p-3.5">
        <div className="flex justify-between text-sm font-medium">
          <span>נשאר <b className="num text-base">{shekel(sum.left)}</b></span>
          <span className="text-white/75">עוד {sum.daysLeft} {sum.daysLeft === 1 ? 'יום' : 'ימים'}</span>
        </div>
        <div className="h-2.5 bg-white/15 rounded-full mt-2 overflow-hidden" role="img" aria-label={`נוצלו ${Math.round(spentPct)} אחוז מהכסף הפנוי`}>
          <div className="h-full rounded-full bg-coin" style={{ width: `${100 - spentPct}%` }} />
        </div>
      </div>
    </section>
  );
}

function Numbers({ sum }: { sum: MonthSummary }) {
  const spentPct = sum.free > 0 ? (sum.spent / sum.free) * 100 : 100;
  const timePct = (sum.dayOfMonth / sum.daysInMonth) * 100;
  const fast = sum.isCurrent && spentPct > timePct + 5;

  return (
    <section className="card p-4">
      <div className="grid grid-cols-3 gap-2">
        <Stat Icon={ArrowDownToLine} color="#1F8A63" tint="#DDF2E8" label="נכנס" value={sum.income} />
        <Stat Icon={CalendarClock} color="#2D6FD6" tint="#DFEAFB" label="קבועים" value={sum.fixed} />
        <Stat Icon={ShoppingBag} color="#E07A1F" tint="#FDEBD9" label="הוצאות" value={sum.spent} />
      </div>
      {sum.isCurrent && (
        <div className={`mt-3 flex items-center gap-3 rounded-2xl p-3 ${fast ? 'bg-warn-soft' : 'bg-leaf-soft'}`}>
          {fast ? <Gauge className="w-6 h-6 text-warn shrink-0" /> : <ThumbsUp className="w-6 h-6 text-leaf shrink-0" />}
          <p className="text-[15px] font-medium">
            {fast
              ? `עבר ${Math.round(timePct)}% מהחודש והוצאת כבר ${Math.round(spentPct)}% מהכסף. כדאי להאט קצת.`
              : `עבר ${Math.round(timePct)}% מהחודש והוצאת ${Math.round(spentPct)}% מהכסף. קצב מצוין.`}
          </p>
        </div>
      )}
    </section>
  );
}

function Stat({ Icon, color, tint, label, value }: { Icon: typeof Wallet; color: string; tint: string; label: string; value: number }) {
  return (
    <div className="rounded-2xl p-3 text-center" style={{ background: tint }}>
      <Icon className="w-5 h-5 mx-auto" style={{ color }} strokeWidth={2.4} />
      <div className="text-[13px] text-muted mt-1">{label}</div>
      <div className="num text-[17px]">{shekel(value)}</div>
    </div>
  );
}

function WhereItWent({ list }: { list: Expense[] }) {
  const total = list.reduce((s, e) => s + e.amount, 0);
  const groups = Object.entries(
    list.reduce<Record<string, number>>((g, e) => ({ ...g, [e.category]: (g[e.category] ?? 0) + e.amount }), {})
  ).sort((a, b) => b[1] - a[1]);

  return (
    <section className="card p-5">
      <h2 className="text-xl mb-4">על מה הלך הכסף</h2>
      <div className="flex h-3.5 rounded-full overflow-hidden gap-0.5 mb-5" aria-hidden>
        {groups.map(([key, amount]) => (
          <div key={key} style={{ width: `${(amount / total) * 100}%`, background: categoryOf(key as CategoryKey).color }} />
        ))}
      </div>
      <ul className="space-y-3">
        {groups.map(([key, amount]) => {
          const c = categoryOf(key as CategoryKey);
          return (
            <li key={key} className="flex items-center gap-3">
              <IconTile Icon={c.Icon} color={c.color} tint={c.tint} size={40} />
              <span className="flex-1 font-semibold">{c.name}</span>
              <span className="text-sm text-muted">{Math.round((amount / total) * 100)}%</span>
              <span className="num w-20 text-left">{shekel(amount)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
