import { useState } from 'react';
import { CalendarClock, ChevronLeft, ChevronRight, Home as HomeIcon, ListOrdered, PiggyBank } from 'lucide-react';
import { useAppData, exampleData, EMPTY } from './lib/store';
import { exportCSV, monthName, newId, summarize, toISO } from './lib/money';
import { Home } from './components/Home';
import { Expenses } from './components/Expenses';
import { Monthly } from './components/Monthly';
import { Goals } from './components/Goals';
import { AddExpense } from './components/AddExpense';
import { Welcome, Logo } from './components/Welcome';
import { Expense } from './types';

type Tab = 'home' | 'expenses' | 'monthly' | 'goals';

const TABS: { id: Tab; label: string; Icon: typeof HomeIcon }[] = [
  { id: 'home', label: 'ראשי', Icon: HomeIcon },
  { id: 'expenses', label: 'הוצאות', Icon: ListOrdered },
  { id: 'monthly', label: 'כל חודש', Icon: CalendarClock },
  { id: 'goals', label: 'חיסכון', Icon: PiggyBank },
];

export default function App() {
  const [data, setData] = useAppData();
  const [tab, setTab] = useState<Tab>('home');
  const [month, setMonth] = useState(() => new Date());
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2600); };

  if (!data.started) {
    return (
      <Welcome
        onStart={(monthly) => setData({ ...EMPTY, started: true, monthly })}
        onExample={() => setData(exampleData())}
      />
    );
  }

  const sum = summarize(data, month);
  const isThisMonth = sum.isCurrent;

  const shiftMonth = (delta: number) => {
    const d = new Date(month.getFullYear(), month.getMonth() + delta, 1);
    const now = new Date();
    setMonth(d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() ? now : d);
  };

  const addExpense = (e: Omit<Expense, 'id'>) => {
    setData((d) => ({ ...d, expenses: [{ ...e, id: newId() }, ...d.expenses] }));
    setAdding(false);
    flash('ההוצאה נשמרה');
  };
  const deleteExpense = (id: string) => setData((d) => ({ ...d, expenses: d.expenses.filter((e) => e.id !== id) }));

  const reset = () => {
    if (window.confirm('למחוק את כל הנתונים ולהתחיל מחדש? אי אפשר לבטל את זה.')) {
      setData(EMPTY);
      setTab('home');
    }
  };

  return (
    <div className="min-h-screen pb-28">
      <header className="sticky top-0 z-30 bg-paper/90 backdrop-blur border-b border-line">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          {(tab === 'home' || tab === 'expenses') && (
            <div className="flex items-center">
              <button onClick={() => shiftMonth(-1)} aria-label="חודש קודם" className="w-11 h-11 grid place-items-center rounded-full hover:bg-card">
                <ChevronRight className="w-6 h-6" />
              </button>
              <span className="font-bold min-w-[104px] text-center">{monthName(month)}</span>
              <button onClick={() => shiftMonth(1)} aria-label="חודש הבא" className="w-11 h-11 grid place-items-center rounded-full hover:bg-card">
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5">
        {!isThisMonth && (tab === 'home' || tab === 'expenses') && (
          <button onClick={() => setMonth(new Date())} className="w-full mb-4 py-2.5 rounded-2xl bg-coin-soft font-bold">
            חזרה לחודש הנוכחי
          </button>
        )}

        {tab === 'home' && (
          <Home data={data} month={month} sum={sum} onAdd={() => setAdding(true)} onDelete={deleteExpense}
            onSeeAll={() => setTab('expenses')} onSetupMonthly={() => setTab('monthly')} />
        )}
        {tab === 'expenses' && <Expenses data={data} month={month} onDelete={deleteExpense} />}
        {tab === 'monthly' && <Monthly items={data.monthly} onChange={(monthly) => setData((d) => ({ ...d, monthly }))} />}
        {tab === 'goals' && (
          <Goals
            goals={data.goals}
            onAdd={(g) => setData((d) => ({ ...d, goals: [...d.goals, { ...g, id: newId(), saved: 0 }] }))}
            onDelete={(id) => setData((d) => ({ ...d, goals: d.goals.filter((g) => g.id !== id) }))}
            onDeposit={(id, amount) => {
              setData((d) => {
                const goal = d.goals.find((g) => g.id === id);
                return {
                  ...d,
                  goals: d.goals.map((g) => (g.id === id ? { ...g, saved: g.saved + amount } : g)),
                  expenses: [{ id: newId(), amount, category: 'savings', note: goal?.title, date: toISO(new Date()) }, ...d.expenses],
                };
              });
              flash('ההפקדה נרשמה');
            }}
          />
        )}

        <footer className="mt-10 text-center text-sm text-muted space-y-3">
          <p>הנתונים נשמרים רק בדפדפן הזה, ולא נשלחים לשום מקום.</p>
          <div className="flex justify-center gap-5">
            <button onClick={() => exportCSV(data)} className="underline underline-offset-4 py-2">שמירת ההוצאות לאקסל</button>
            <button onClick={reset} className="underline underline-offset-4 py-2 hover:text-warn">מחיקת הכל</button>
          </div>
        </footer>
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-40 bg-card border-t border-line pb-[env(safe-area-inset-bottom)]" aria-label="ניווט">
        <ul className="max-w-lg mx-auto grid grid-cols-4">
          {TABS.map(({ id, label, Icon }) => {
            const on = tab === id;
            return (
              <li key={id}>
                <button onClick={() => { setTab(id); window.scrollTo(0, 0); }} aria-current={on ? 'page' : undefined}
                  className={`w-full h-[68px] flex flex-col items-center justify-center gap-0.5 font-semibold text-[15px] ${on ? 'text-ink' : 'text-muted'}`}>
                  <span className={`px-4 py-1 rounded-full ${on ? 'bg-coin' : ''}`}><Icon className="w-6 h-6" /></span>
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {adding && <AddExpense onSave={addExpense} onClose={() => setAdding(false)} />}

      {toast && (
        <div role="status" className="fixed bottom-24 inset-x-0 z-50 flex justify-center pointer-events-none">
          <span className="bg-ink text-white px-5 py-3 rounded-2xl font-bold shadow-lg">✓ {toast}</span>
        </div>
      )}
    </div>
  );
}
