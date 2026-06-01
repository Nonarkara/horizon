import { motion } from 'framer-motion';
import { ChevronRight, Users, MessageSquare, Shield, Eye, RotateCcw } from 'lucide-react';
import { NeuralFrame } from './NeuralFrame';
import { scenarios } from '../data/scenarios';

interface IntroPageProps {
  onStart: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Radio: MessageSquare,
  Cpu: Users,
  ScanEye: Eye,
  RefreshCw: RotateCcw,
  ShieldAlert: Shield,
};

export function IntroPage({ onStart }: IntroPageProps) {
  return (
    <NeuralFrame className="flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="inline-block px-3 py-1 rounded-full border border-neural/20 bg-neural/5 text-neural text-xs font-mono mb-4">
            PRE-CALIBRATION BRIEF
          </span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text-primary mb-3">
            You Do Not Have a Magic Wand
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            You have a <span className="text-text-primary font-medium">troop of able agents</span>.
            Your score depends on one thing: can you deploy them wisely?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 mb-8"
        >
          {scenarios.map((s, i) => {
            const Icon = iconMap[s.icon] ?? MessageSquare;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-text-tertiary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-semibold text-sm text-text-primary">
                    {s.title}
                  </h3>
                  <p className="text-xs text-text-tertiary mt-0.5">{s.subtitle}</p>
                </div>
                <span className="ml-auto font-mono text-xs text-text-muted shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="p-4 rounded-xl border border-warn/20 bg-warn/5 mb-8"
        >
          <p className="text-xs text-warn leading-relaxed">
            <span className="font-semibold">Important:</span> This is not a test of what you know.
            It is a test of how you <span className="font-semibold">think</span>. There are no trick
            questions — only real situations where the right answer is the one that produces the best
            outcome with AI.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          onClick={onStart}
          className="w-full group py-4 rounded-xl font-heading font-semibold text-sm tracking-wide transition-all duration-300 bg-neural/10 text-neural border border-neural/20 hover:bg-neural/15 hover:border-neural/40 active:scale-[0.98]"
        >
          <span className="flex items-center justify-center gap-2">
            Begin Calibration
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </motion.button>
      </div>
    </NeuralFrame>
  );
}
