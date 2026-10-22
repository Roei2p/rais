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
      <button aria-label="סגירה" className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title}
        className="sheet relative w-full sm:max-w-md bg-card rounded-t-3xl sm:rounded-3xl p-5 pb-[max(20px,env(safe-area-inset-bottom))] max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl">{title}</h2>
          <button onClick={onClose} aria-label="סגירה" className="w-11 h-11 -ml-2 grid place-items-center rounded-full hover:bg-paper">
            <X className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AmountInput({ value, onChange, autoFocus, label }: { value: string; onChange: (v: string) => void; autoFocus?: boolean; label: string }) {
  return (
    <label className="block">
      <span className="block text-muted font-semibold mb-1.5">{label}</span>
      <div className="flex items-center gap-2 field focus-within:border-pine">
        <span className="num text-2xl text-muted">₪</span>
        <input
          type="number" inputMode="decimal" min="0" placeholder="0" autoFocus={autoFocus}
          value={value} onChange={(e) => onChange(e.target.value)}
          className="num text-3xl w-full bg-transparent outline-none"
        />
      </div>
    </label>
  );
}
