import { useEffect, useState } from 'react';
import { AppData } from '../types';
import { newId, pad } from './money';

const KEY = 'kesef-sheli-v1';

export const EMPTY: AppData = { started: false, expenses: [], monthly: [], goals: [] };

function load(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...EMPTY, ...JSON.parse(raw) };
  } catch { /* storage unavailable */ }
  return EMPTY;
}

export function useAppData() {
  const [data, setData] = useState<AppData>(load);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* ignore */ }
  }, [data]);
  return [data, setData] as const;
}

/** A small, believable example so people can see how it works. */
export function exampleData(): AppData {
  const now = new Date();
  const ym = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
  const day = (d: number) => `${ym}-${pad(Math.min(d, now.getDate()))}`;
  return {
    started: true,
    monthly: [
      { id: newId(), title: 'משכורת', amount: 9800, kind: 'income' },
      { id: newId(), title: 'משכורת של בן/בת הזוג', amount: 7200, kind: 'income' },
      { id: newId(), title: 'שכר דירה', amount: 5200, kind: 'fixed' },
      { id: newId(), title: 'ארנונה', amount: 620, kind: 'fixed' },
      { id: newId(), title: 'חשמל ומים', amount: 550, kind: 'fixed' },
      { id: newId(), title: 'טלפון ואינטרנט', amount: 190, kind: 'fixed' },
      { id: newId(), title: 'גן וצהרון', amount: 2600, kind: 'fixed' },
    ],
    expenses: [
      { id: newId(), amount: 640, category: 'food', note: 'קנייה גדולה', date: day(2) },
      { id: newId(), amount: 250, category: 'car', date: day(4) },
      { id: newId(), amount: 120, category: 'eating_out', note: 'פיצה', date: day(6) },
      { id: newId(), amount: 410, category: 'food', date: day(9) },
      { id: newId(), amount: 180, category: 'health', note: 'תרופות', date: day(11) },
      { id: newId(), amount: 300, category: 'clothes', date: day(13) },
      { id: newId(), amount: 350, category: 'food', date: day(16) },
      { id: newId(), amount: 90, category: 'fun', note: 'סרט', date: day(18) },
    ],
    goals: [
      { id: newId(), title: 'קופה לשעת חירום', emoji: '🛟', target: 15000, saved: 6200 },
      { id: newId(), title: 'חופשה בקיץ', emoji: '🏖️', target: 8000, saved: 1500 },
    ],
  };
}
