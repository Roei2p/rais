/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BankAccount, 
  CategoryKey, 
  InsightMessage, 
  SavingsGoal, 
  Transaction 
} from './types';
import { 
  INITIAL_ACCOUNTS, 
  INITIAL_MESSAGES, 
  INITIAL_SAVINGS_GOALS, 
  INITIAL_TRANSACTIONS 
} from './data/initialData';
import { calculateCashflow } from './utils/cashflow';
import { Header } from './components/Header';
import { CashflowHero } from './components/CashflowHero';
import { WeeklyPaceCard } from './components/WeeklyPaceCard';
import { VariableExpensesList } from './components/VariableExpensesList';
import { FixedExpensesList } from './components/FixedExpensesList';
import { AccountsBar } from './components/AccountsBar';
import { SavingsGoals } from './components/SavingsGoals';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { TransactionsTable } from './components/TransactionsTable';
import { WhatsAppAdvisor } from './components/WhatsAppAdvisor';
import { AddTransactionModal } from './components/AddTransactionModal';
import { AddAccountModal } from './components/AddAccountModal';
import { 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck, 
  Download, 
  RotateCcw, 
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Load from localStorage or defaults
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('riseup_transactions');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_TRANSACTIONS;
  });

  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem('riseup_accounts');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_ACCOUNTS;
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('riseup_goals');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_SAVINGS_GOALS;
  });

  const [messages, setMessages] = useState<InsightMessage[]>(() => {
    const saved = localStorage.getItem('riseup_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_MESSAGES;
  });

  const [customVariableBudget, setCustomVariableBudget] = useState<number | undefined>(() => {
    const saved = localStorage.getItem('riseup_var_budget');
    return saved ? parseFloat(saved) : undefined;
  });

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('riseup_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('riseup_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('riseup_goals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem('riseup_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (customVariableBudget) {
      localStorage.setItem('riseup_var_budget', customVariableBudget.toString());
    }
  }, [customVariableBudget]);

  // Calculate monthly planned savings
  const totalMonthlySavingsTarget = savingsGoals.reduce((sum, g) => sum + g.monthlyDeposit, 0);

  // Calculate live cashflow summary
  const summary = calculateCashflow(
    transactions,
    currentDate,
    customVariableBudget,
    totalMonthlySavingsTarget
  );

  // Month Switcher
  const handleChangeMonth = (delta: number) => {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + delta);
    setCurrentDate(nextDate);
  };

  // Add Transaction
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update account balance
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.name === newTx.account) {
          return {
            ...acc,
            balance:
              newTx.type === 'income'
                ? acc.balance + newTx.amount
                : acc.balance - newTx.amount,
          };
        }
        return acc;
      })
    );
  };

  // Delete Transaction
  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Add Savings Goal
  const handleAddGoal = (goalData: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: `goal_${Date.now()}`,
    };
    setSavingsGoals((prev) => [...prev, newGoal]);
  };

  // Deposit to Goal
  const handleDepositToGoal = (goalId: string, amount: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
      )
    );
  };

  // Add Account
  const handleAddAccount = (newAcc: BankAccount) => {
    setAccounts((prev) => [...prev, newAcc]);
  };

  // Bank Sync simulation
  const handleSyncAccounts = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setAccounts((prev) =>
        prev.map((acc) => ({
          ...acc,
          lastSync: 'הרגע סונכרן בהצלחה',
        }))
      );
      setSyncToast('הסנכרון מול הבנקים וחברות האשראי הושלם בהצלחה! כל התנועות מעודכנות.');

      // Add a WhatsApp message from RiseUp
      const syncMsg: InsightMessage = {
        id: `msg_sync_${Date.now()}`,
        sender: 'riseup',
        text: `רעננו הרגע את הנתונים מול ${accounts.length} חשבונות וכרטיסים. התזרים שלכם מעודכן ומדויק למועד זה! 🚀`,
        timestamp: 'הרגע',
        type: 'morning',
      };
      setMessages((prev) => [...prev, syncMsg]);

      setTimeout(() => setSyncToast(null), 4000);
    }, 1200);
  };

  // AI Advisor Chat Message Send
  const handleSendMessage = async (text: string) => {
    const userMsg: InsightMessage = {
      id: `msg_usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'הרגע',
      type: 'user',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          cashflowData: {
            totalIncome: summary.totalIncome,
            fixedExpensesTotal: summary.fixedExpensesTotal,
            variableBudget: summary.variableBudget,
            variableSpent: summary.variableSpent,
            remainingVariable: summary.remainingVariable,
            daysLeftInMonth: summary.daysLeft,
            projectedEndBalance: summary.projectedEndBalance,
            topCategories: 'סופר ופארם, מסעדות ו-Wolt, קניות ואופנה',
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const advisorMsg: InsightMessage = {
          id: `msg_ai_${Date.now()}`,
          sender: 'riseup',
          text: data.reply || 'הבנתי את השאלה שלכם! התזרים מראה שאתם במסלול מצוין.',
          timestamp: 'הרגע',
          type: 'tip',
        };
        setMessages((prev) => [...prev, advisorMsg]);
      } else {
        throw new Error('Advisor API response was not ok');
      }
    } catch (err) {
      // Fallback response
      const fallbackMsg: InsightMessage = {
        id: `msg_fallback_${Date.now()}`,
        sender: 'riseup',
        text: `לפי התזרים שלכם לחודש זה: נשארו לכם ₪${summary.remainingVariable.toLocaleString()} להוצאות משתנות ל-${summary.daysLeft} הימים הקרובים (כ-₪${Math.round(summary.dailyAllowance).toLocaleString()} ליום).
אם תשמרו על רף זה - תסיימו את החודש בפלוס צפוי של ₪${summary.projectedEndBalance.toLocaleString()}! כל הכבוד על המעקב והאחריות! 🌟`,
        timestamp: 'הרגע',
        type: 'tip',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Reset demo data
  const handleResetData = () => {
    if (window.confirm('האם לאפס את כל הנתונים לנתוני הדמו המקוריים של רייזאפ?')) {
      localStorage.clear();
      setTransactions(INITIAL_TRANSACTIONS);
      setAccounts(INITIAL_ACCOUNTS);
      setSavingsGoals(INITIAL_SAVINGS_GOALS);
      setMessages(INITIAL_MESSAGES);
      setCustomVariableBudget(undefined);
      confetti({ particleCount: 30, spread: 50 });
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['תאריך', 'עסק', 'סכום', 'סוג', 'קטגוריה', 'חשבון', 'הערות'];
    const rows = transactions.map((t) => [
      t.date,
      `"${t.title.replace(/"/g, '""')}"`,
      t.amount,
      t.type,
      t.category,
      `"${t.account.replace(/"/g, '""')}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `riseup_transactions_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1F2937] flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Header */}
      <Header
        currentDate={currentDate}
        onChangeMonth={handleChangeMonth}
        onOpenAddModal={() => setIsAddTxModalOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        onSyncAccounts={handleSyncAccounts}
        isSyncing={isSyncing}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Sync Toast Notification */}
      {syncToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-800 text-white px-5 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border border-emerald-600 animate-in fade-in slide-in-from-top-4 duration-300">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tab 1: Dashboard (Main RiseUp Cashflow Experience) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <CashflowHero
              summary={summary}
              onUpdateVariableBudget={(budget) => setCustomVariableBudget(budget)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left / Main 2 cols: Weekly Pace & Variable Breakdown */}
              <div className="lg:col-span-2 space-y-6">
                <WeeklyPaceCard
                  summary={summary}
                  onOpenAddModal={() => setIsAddTxModalOpen(true)}
                />

                <VariableExpensesList
                  transactions={transactions}
                  currentDate={currentDate}
                  onOpenAddModal={() => setIsAddTxModalOpen(true)}
                  onSelectCategory={() => setActiveTab('variable')}
                />
              </div>

              {/* Right column: WhatsApp Advisor Preview & Bank status */}
              <div className="space-y-6">
                <WhatsAppAdvisor
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isAiLoading}
                  summary={summary}
                />

                <AccountsBar
                  accounts={accounts}
                  onSync={handleSyncAccounts}
                  isSyncing={isSyncing}
                  onAddAccount={() => setIsAddAccountModalOpen(true)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Variable Expenses */}
        {activeTab === 'variable' && (
          <div className="space-y-6">
            <VariableExpensesList
              transactions={transactions}
              currentDate={currentDate}
              onOpenAddModal={() => setIsAddTxModalOpen(true)}
            />
            <WeeklyPaceCard
              summary={summary}
              onOpenAddModal={() => setIsAddTxModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 3: Fixed Expenses */}
        {activeTab === 'fixed' && (
          <div className="space-y-6">
            <FixedExpensesList
              transactions={transactions}
              currentDate={currentDate}
              onOpenAddModal={() => setIsAddTxModalOpen(true)}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        )}

        {/* Tab 4: Accounts and Credit Cards */}
        {activeTab === 'accounts' && (
          <div className="space-y-6">
            <AccountsBar
              accounts={accounts}
              onSync={handleSyncAccounts}
              isSyncing={isSyncing}
              onAddAccount={() => setIsAddAccountModalOpen(true)}
            />
            <TransactionsTable
              transactions={transactions}
              currentDate={currentDate}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenAddModal={() => setIsAddTxModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 5: Savings Goals */}
        {activeTab === 'savings' && (
          <div className="space-y-6">
            <SavingsGoals
              goals={savingsGoals}
              onAddGoal={handleAddGoal}
              onDeposit={handleDepositToGoal}
            />
          </div>
        )}

        {/* Tab 6: What If Simulator */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <WhatIfSimulator
              summary={summary}
              onApplyScenarioBudget={(b) => setCustomVariableBudget(b)}
            />
          </div>
        )}

        {/* Tab 7: All Transactions */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <TransactionsTable
              transactions={transactions}
              currentDate={currentDate}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenAddModal={() => setIsAddTxModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Floating WhatsApp Advisor Drawer / Modal (When opened from Header on mobile or overlay) */}
      {isChatOpen && (
        <WhatsAppAdvisor
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isAiLoading}
          onClose={() => setIsChatOpen(false)}
          summary={summary}
          isFloating={true}
        />
      )}

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddTxModalOpen}
        onClose={() => setIsAddTxModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        accounts={accounts}
        currentDate={currentDate}
      />

      {/* Add Account Modal */}
      <AddAccountModal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onAddAccount={handleAddAccount}
      />

      {/* Bottom Footer with Brand & Tools */}
      <footer className="mt-12 border-t border-gray-200/80 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-600 flex items-center justify-center text-white text-[10px] font-black">
              R
            </div>
            <span className="font-bold text-gray-800">רייזאפ RiseUp</span>
            <span>•</span>
            <span>לדעת איפה הכסף עומד, לחיות ברוגע ולגמור בפלוס</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 text-gray-600 hover:text-emerald-700 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>יצוא לקובץ CSV</span>
            </button>
            <span>•</span>
            <button
              onClick={handleResetData}
              className="flex items-center gap-1.5 text-gray-400 hover:text-rose-600 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>איפוס נתוני הדגמה</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
