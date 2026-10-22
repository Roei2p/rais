import { CategoryKey } from '../types';

export interface Category { key: CategoryKey; name: string; emoji: string; color: string; }

export const CATEGORIES: Category[] = [
  { key: 'food', name: 'סופר', emoji: '🛒', color: '#1E6B52' },
  { key: 'eating_out', name: 'אוכל בחוץ', emoji: '🍕', color: '#D9822B' },
  { key: 'car', name: 'דלק ונסיעות', emoji: '⛽', color: '#2F6FB0' },
  { key: 'kids', name: 'ילדים', emoji: '🧸', color: '#C9A227' },
  { key: 'health', name: 'בריאות ופארם', emoji: '💊', color: '#3A9C8C' },
  { key: 'clothes', name: 'בגדים', emoji: '👕', color: '#8A5BB8' },
  { key: 'home', name: 'לבית', emoji: '🏠', color: '#6B7A75' },
  { key: 'fun', name: 'בילויים', emoji: '🎉', color: '#C8507A' },
  { key: 'gifts', name: 'מתנות', emoji: '🎁', color: '#B8563B' },
  { key: 'savings', name: 'הפקדה לחיסכון', emoji: '🐷', color: '#16302B' },
  { key: 'other', name: 'אחר', emoji: '📦', color: '#8C9A96' },
];

export const PICKABLE = CATEGORIES.filter((c) => c.key !== 'savings');

export const categoryOf = (key: CategoryKey): Category =>
  CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[CATEGORIES.length - 1];
