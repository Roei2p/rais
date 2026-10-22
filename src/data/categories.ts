import {
  Baby, Car, Fuel, Gem, Gift, GraduationCap, Home, LifeBuoy, LucideIcon, Package, PartyPopper,
  PiggyBank, Pill, Plane, ShoppingCart, Shirt, Smartphone, Sofa, TreePalm, UtensilsCrossed,
} from 'lucide-react';
import { CategoryKey } from '../types';

export interface Category { key: CategoryKey; name: string; Icon: LucideIcon; color: string; tint: string; }

export const CATEGORIES: Category[] = [
  { key: 'food', name: 'סופר', Icon: ShoppingCart, color: '#1F8A63', tint: '#DDF2E8' },
  { key: 'eating_out', name: 'אוכל בחוץ', Icon: UtensilsCrossed, color: '#E07A1F', tint: '#FDEBD9' },
  { key: 'car', name: 'דלק ונסיעות', Icon: Fuel, color: '#2D6FD6', tint: '#DFEAFB' },
  { key: 'kids', name: 'ילדים', Icon: Baby, color: '#D99A00', tint: '#FFF1C9' },
  { key: 'health', name: 'בריאות ופארם', Icon: Pill, color: '#0E9AA7', tint: '#D7F2F4' },
  { key: 'clothes', name: 'בגדים', Icon: Shirt, color: '#7C4DDB', tint: '#ECE4FB' },
  { key: 'home', name: 'לבית', Icon: Sofa, color: '#8A6A4F', tint: '#F2E9E1' },
  { key: 'fun', name: 'בילויים', Icon: PartyPopper, color: '#D6427A', tint: '#FBE1EB' },
  { key: 'gifts', name: 'מתנות', Icon: Gift, color: '#D9472F', tint: '#FDE6E1' },
  { key: 'savings', name: 'הפקדה לחיסכון', Icon: PiggyBank, color: '#0F3D2E', tint: '#FFF3CF' },
  { key: 'other', name: 'אחר', Icon: Package, color: '#5B6F67', tint: '#E9EEEB' },
];

export const PICKABLE = CATEGORIES.filter((c) => c.key !== 'savings');

export const categoryOf = (key: CategoryKey): Category =>
  CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[CATEGORIES.length - 1];

/** Icons for savings goals */
export const GOAL_ICONS: Record<string, { Icon: LucideIcon; color: string; tint: string }> = {
  safety: { Icon: LifeBuoy, color: '#D9472F', tint: '#FDE6E1' },
  vacation: { Icon: TreePalm, color: '#0E9AA7', tint: '#D7F2F4' },
  flight: { Icon: Plane, color: '#2D6FD6', tint: '#DFEAFB' },
  car: { Icon: Car, color: '#7C4DDB', tint: '#ECE4FB' },
  home: { Icon: Home, color: '#1F8A63', tint: '#DDF2E8' },
  study: { Icon: GraduationCap, color: '#E07A1F', tint: '#FDEBD9' },
  ring: { Icon: Gem, color: '#D6427A', tint: '#FBE1EB' },
  baby: { Icon: Baby, color: '#D99A00', tint: '#FFF1C9' },
  phone: { Icon: Smartphone, color: '#5B6F67', tint: '#E9EEEB' },
  gift: { Icon: Gift, color: '#8A6A4F', tint: '#F2E9E1' },
};

const EMOJI_TO_ICON: Record<string, string> = { '🛟': 'safety', '🏖️': 'vacation', '🚗': 'car', '🏠': 'home', '🎓': 'study', '💍': 'ring', '👶': 'baby', '🎁': 'gift' };
export const goalIcon = (key?: string) => GOAL_ICONS[key ?? ''] ?? GOAL_ICONS[EMOJI_TO_ICON[key ?? ''] ?? 'safety'];
