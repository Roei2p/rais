import React, { useState, useRef, useEffect } from 'react';
import { CashflowSummary, InsightMessage } from '../types';
import { 
  Send, 
  Sparkles, 
  TrendingUp, 
  Bot, 
  X, 
  HelpCircle,
  Lightbulb,
  CheckCircle,
  Clock,
  MessageSquare
} from 'lucide-react';

interface WhatsAppAdvisorProps {
  messages: InsightMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onClose?: () => void;
  summary: CashflowSummary;
  isFloating?: boolean;
}

export const WhatsAppAdvisor: React.FC<WhatsAppAdvisorProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onClose,
  summary,
  isFloating = false,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'איפה כדאי לחסוך החודש?',
    'כמה כסף נשאר לי להוציא השבוע?',
    'האם נסיים את החודש בפלוס?',
    'איך להוזיל את קניות הסופר?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    if (!isLoading) {
      onSendMessage(prompt);
    }
  };

  return (
    <div
      className={`flex flex-col bg-[#EFEAE2] overflow-hidden ${
        isFloating
          ? 'fixed bottom-4 left-4 z-50 w-[92vw] sm:w-[420px] h-[580px] rounded-3xl shadow-2xl border border-gray-300'
          : 'rounded-3xl border border-gray-200 shadow-sm h-[640px]'
      }`}
    >
      {/* WhatsApp / RiseUp Header */}
      <div className="bg-[#008069] text-white px-4 py-3.5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/30 font-black relative">
            <TrendingUp className="w-5 h-5" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-300 rounded-full border border-[#008069]"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-sm">
              <span>היועץ של רייזאפ</span>
              <span className="bg-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-semibold text-emerald-200">
                AI Coach
              </span>
            </div>
            <p className="text-[11px] text-emerald-100 flex items-center gap-1">
              <span>תמיד כאן לתמוך בתזרים שלכם</span>
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages List Area (WhatsApp styled background) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px]">
        {/* Date / Security Notice */}
        <div className="text-center">
          <span className="inline-block text-[10px] font-semibold text-gray-600 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-lg shadow-2xs">
            💬 הודעות תזרים והמלצות אישיות מרייזאפ
          </span>
        </div>

        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-2xs text-xs sm:text-[13px] leading-relaxed relative ${
                  isUser
                    ? 'bg-[#E7FFDB] text-gray-900 rounded-bl-2xl rounded-tr-xs'
                    : 'bg-white text-gray-900 rounded-br-2xl rounded-tl-xs border border-gray-100'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#008069] mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>רייזאפ</span>
                  </div>
                )}

                <div className="whitespace-pre-line">{msg.text}</div>

                <div
                  className={`flex items-center gap-1 text-[10px] text-gray-400 mt-1 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <Clock className="w-2.5 h-2.5" />
                  <span>{msg.timestamp}</span>
                  {isUser && <span className="text-[#53BDEB] font-bold">✓✓</span>}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-2xs text-xs text-gray-600 flex items-center gap-2 border border-gray-100">
              <span className="w-2 h-2 rounded-full bg-[#008069] animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-[#008069] animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-[#008069] animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] font-medium text-gray-500 mr-1">היועץ של רייזאפ חושב...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="bg-[#F0F2F5] px-3 py-2 border-t border-gray-200/60 overflow-x-auto scrollbar-none flex gap-1.5 shrink-0">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleQuickPrompt(prompt)}
            disabled={isLoading}
            className="text-[11px] font-medium bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 px-3 py-1 rounded-full border border-gray-200 whitespace-nowrap transition cursor-pointer shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#F0F2F5] p-2.5 flex items-center gap-2 shrink-0 border-t border-gray-200"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="שאלו את היועץ של רייזאפ על התזרים..."
          disabled={isLoading}
          className="flex-1 bg-white px-4 py-2.5 rounded-2xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 border border-gray-300 focus:outline-[#008069] transition"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="w-10 h-10 rounded-full bg-[#008069] hover:bg-[#00705a] disabled:opacity-50 text-white flex items-center justify-center transition shadow-xs cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4 rtl:rotate-180" />
        </button>
      </form>
    </div>
  );
};
