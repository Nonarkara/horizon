import { getLevel } from '../data/scenarios';

interface XpBarProps {
  xp: number;
  compact?: boolean;
}

export function XpBar({ xp, compact = false }: XpBarProps) {
  const { level, name, progress } = getLevel(xp);

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-neural transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-mono text-xs text-neural">L{level}</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-neural">L{level}</span>
          <span className="text-xs text-text-secondary">{name}</span>
        </div>
        <span className="font-mono text-xs text-text-tertiary">{xp} XP</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
        <div
          className="h-full rounded-full bg-neural transition-all duration-700 relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
        </div>
      </div>
    </div>
  );
}
