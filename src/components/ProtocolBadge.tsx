import { motion } from 'framer-motion';
import { Radio, Cpu, ScanEye, RefreshCw, ShieldAlert, Zap, Sparkles } from 'lucide-react';
import type { Badge } from '../types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Radio,
  Cpu,
  ScanEye,
  RefreshCw,
  ShieldAlert,
  Zap,
  Sparkles,
};

interface ProtocolBadgeProps {
  badge: Badge;
  index?: number;
}

export function ProtocolBadge({ badge, index = 0 }: ProtocolBadgeProps) {
  const Icon = iconMap[badge.icon] ?? Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
      className={`relative group p-4 rounded-xl border transition-all duration-300 ${
        badge.unlocked
          ? 'border-neural/20 bg-neural/5 hover:border-neural/40'
          : 'border-white/5 bg-white/[0.02] opacity-40'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            badge.unlocked ? 'bg-neural/10 text-neural' : 'bg-white/5 text-text-muted'
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h4 className={`font-heading font-semibold text-sm ${badge.unlocked ? 'text-text-primary' : 'text-text-tertiary'}`}>
            {badge.name}
          </h4>
          <p className="text-xs text-text-tertiary mt-0.5 leading-relaxed">{badge.description}</p>
        </div>
      </div>
      {badge.unlocked && (
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-neural shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
      )}
    </motion.div>
  );
}
