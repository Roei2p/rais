import React from 'react';
import { 
  TrendingUp, 
  RefreshCw, 
  PlusCircle, 
  MessageSquare, 
  ChevronRight, 
  ChevronLeft,
  Calendar,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  currentDate: Date;
  onChangeMonth: (delta: number) => void;
  onOpenAddModal: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  onSyncAccounts: () => void;
  isSyncing: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  onChangeMonth,
  onOpenAddModal,
  onToggleChat,
  isChatOpen,
  onSyncAccounts,
  isSyncing,
  activeTab,
  setActiveTab,
}) => {
  const monthName = currentDate.toLocaleDateString('he-IL', {
    month: 'long',
    year: 'numeric',
  });

  const navItems = [
    { id: 'dashboard', label: 'התזרים של החודש', icon: TrendingUp },
    { id: 'variable', label: 'הוצאות משתנות', badge: 'סופר, וולט, פנאי' },
    { id: 'fixed', label: 'הוצאות קבועות', badge: 'שכירות, חשבונות' },
    { id: 'accounts', label: 'חשבונות ואשראי', badge: 'מועדי חיוב' },
    { id: 'savings', label: 'יעדי חיסכון', badge: 'כרית ביטחון' },
    { id: 'simulator', label: 'מה יקרה אם...?', icon: Sparkles },
    { id: 'transactions', label: 'כל התנועות' },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-xs">
      {/* Top Banner / Brand & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <TrendingUp className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-gray-900">riseup</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  רייזאפ
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">לדעת איפה הכסף עומד, לחיות ברוגע ולגמור בפלוס</p>
            </div>
          </div>

          {/* Month Navigator */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200/80 px-2 py-1 rounded-xl shadow-2xs">
            <button
              onClick={() => onChangeMonth(1)}
              title="חודש הבא"
              className="p-1 rounded-lg hover:bg-white text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 px-2 text-sm font-semibold text-gray-800 min-w-[120px] justify-center">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>{monthName}</span>
            </div>
            <button
              onClick={() => onChangeMonth(-1)}
              title="חודש קודם"
              className="p-1 rounded-lg hover:bg-white text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Sync Accounts */}
            <button
              onClick={onSyncAccounts}
              disabled={isSyncing}
              title="סנכרון נתונים מול כרטיסי האשראי והבנקים"
              className="hidden md:flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-emerald-700 bg-gray-50 hover:bg-emerald-50 px-3 py-2 rounded-xl border border-gray-200/80 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
              <span>{isSyncing ? 'מסנכרן כרטיסים...' : 'סנכרון בנקים'}</span>
            </button>

            {/* WhatsApp / AI Advisor */}
            <button
              onClick={onToggleChat}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isChatOpen
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-200'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">היועץ של רייזאפ</span>
              <span className="sm:hidden">יועץ</span>
            </button>

            {/* Add Transaction */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">תנועה חדשה</span>
              <span className="sm:hidden">הוסף</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 border-t border-gray-100 -mx-4 px-4 sm:mx-0 sm:px-0">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/60'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
