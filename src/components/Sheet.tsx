import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <button aria-label="סגירה" className="backdrop absolute inset-0 bg-ink/45 backdrop-blur-[2px]" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title}
        className="sheet relative w-full sm:max-w-md bg-card rounded-t-[30px] sm:rounded-[30px] px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))] max-h-[92vh] overflow-y-auto">
        <div className="mx-auto w-10 h-1.5 rounded-full bg-line mb-3 sm:hidden" aria-hidden />
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl">{title}</h2>
          <button onClick={onClose} aria-label="סגירה" className="icon-btn -ml-2 bg-paper"><X className="w-5 h-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AmountInput({ value, onChange, autoFocus, label }: { value: string; onChange: (v: string) => void; autoFocus?: boolean; label: string }) {
  return (
    <label className="block">
      <span className="block text-muted font-medium mb-1.5">{label}</span>
      <div className="field flex items-center gap-2 !py-2">
        <input
          type="number" inputMode="decimal" min="0" placeholder="0" autoFocus={autoFocus}
          value={value} onChange={(e) => onChange(e.target.value)}
          className="num text-4xl w-full bg-transparent outline-none placeholder:text-[#B9C5C0]"
        />
        <span className="num text-3xl text-muted">₪</span>
      </div>
    </label>
  );
}

export function DeleteButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="w-full min-h-[50px] rounded-[18px] font-bold text-warn bg-warn-soft hover:brightness-95">
      {label}
    </button>
  );
}
