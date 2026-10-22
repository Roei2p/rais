import { LucideIcon } from 'lucide-react';

export function IconTile({ Icon, color, tint, size = 46 }: { Icon: LucideIcon; color: string; tint: string; size?: number }) {
  return (
    <span aria-hidden className="shrink-0 grid place-items-center rounded-2xl"
      style={{ width: size, height: size, background: tint, color }}>
      <Icon style={{ width: size * 0.48, height: size * 0.48 }} strokeWidth={2.2} />
    </span>
  );
}
