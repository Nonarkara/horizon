import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, RotateCcw, Sparkles, ArrowRight, Zap, MessageSquare, Users, Eye, Shield } from 'lucide-react';
import { NeuralFrame } from './NeuralFrame';
import { RadarProfile } from './RadarProfile';
import { ProtocolBadge } from './ProtocolBadge';
import { XpBar } from './XpBar';
import { dimensions, badges as baseBadges, getLevel } from '../data/scenarios';
import type { AssessmentState, Dimension } from '../types';

interface Props {
  state: AssessmentState;
  dimensionScores: Record<Dimension, { score: number; max: number }>;
  onReset: () => void;
}

const dimensionIcons: Record<Dimension, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  communication: MessageSquare,
  orchestration: Users,
  capability: Eye,
  interaction: RotateCcw,
  safety: Shield,
};

const revelations = [
  {
    dimension: 'communication' as Dimension,
    title: 'You naturally ask the right questions',
    body: 'When someone gives you a vague request, your instinct is to clarify before acting. That is exactly what skilled prompt engineering looks like. You do not need to know what "temperature" or "top-p" means. You already understand that garbage in means garbage out.',
  },
  {
    dimension: 'orchestration' as Dimension,
    title: 'You already think in teams',
    body: 'Breaking a big job into specialist roles, sequencing the handoffs, and managing dependencies — this is how every good manager thinks. With AI, those specialists are just faster, cheaper, and never call in sick. You were born for this.',
  },
  {
    dimension: 'capability' as Dimension,
    title: 'You know magic from mechanics',
    body: 'You can tell when something is genuinely possible versus when someone is selling snake oil. That skepticism is your superpower. AI cannot predict the stock market, replace doctors, or read minds. You knew that already.',
  },
  {
    dimension: 'interaction' as Dimension,
    title: 'You iterate until it works',
    body: 'Nobody gets the right answer on the first try. You refine, adjust, and shape outcomes through feedback. That is not "being picky" — that is how every expert uses AI. The best results come from round three, not round one.',
  },
  {
    dimension: 'safety' as Dimension,
    title: 'You protect what matters',
    body: 'You spotted risks others would miss. Privacy. Bias. Over-reliance. You understand that powerful tools need guardrails. That instinct does not come from reading AI safety papers. It comes from being a responsible human being.',
  },
];

export function ResultPage({ state, dimensionScores, onReset }: Props) {
  const { level, name: levelName } = getLevel(state.totalXp);
  const syncRate = Math.round((state.totalXp / 500) * 100);

  const computedBadges = useMemo(() => {
    const unlocked = new Set<string>();
    const dimEntries = Object.entries(dimensionScores) as [Dimension, { score: number; max: number }][];

    for (const [dim, scores] of dimEntries) {
      const pct = scores.max > 0 ? scores.score / scores.max : 0;
      if (pct >= 0.6) {
        const badge = baseBadges.find((b) => b.dimension === dim);
        if (badge) unlocked.add(badge.id);
      }
    }

    const allHigh = dimEntries.every(([, s]) => s.max > 0 && s.score / s.max >= 0.7);
    if (allHigh) unlocked.add('full_sync');
    unlocked.add('first_contact');

    return baseBadges.map((b) => ({ ...b, unlocked: unlocked.has(b.id) }));
  }, [dimensionScores]);

  const topDimensions = useMemo(() => {
    return (Object.entries(dimensionScores) as [Dimension, { score: number; max: number }][])
      .map(([id, s]) => ({ id, pct: s.max > 0 ? s.score / s.max : 0 }))
      .sort((a, b) => b.pct - a.pct);
  }, [dimensionScores]);

  const weakestDimension = topDimensions[topDimensions.length - 1]?.id;
  const strongestDimension = topDimensions[0]?.id;

  const getInsight = () => {
    if (!weakestDimension) return '';
    const dim = dimensions.find((d) => d.id === weakestDimension);
    if (!dim) return '';
    const suggestions: Record<Dimension, string> = {
      communication: 'Practice writing one constraint-rich prompt per day. Specify audience, format, length, and tone.',
      orchestration: 'Next time you have a complex task, write down who would do what — even if those "people" are AI agents.',
      capability: 'When you see an AI claim, ask: "What would make this fail?" That one question protects you from most AI hype.',
      interaction: 'Take one bad output and force yourself to improve it three times. Round three is where the magic lives.',
      safety: 'Before using any AI tool with real data, ask: "What happens if this leaks?" If the answer scares you, anonymize first.',
    };
    return suggestions[weakestDimension];
  };

  return (
    <NeuralFrame className="min-h-dvh">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neural/5 border border-neural/20 mb-4">
            <BrainCircuit className="w-8 h-8 text-neural" />
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-text-primary mb-2">
            Calibration <span className="text-neural text-glow">Complete</span>
          </h1>
          <p className="text-sm text-text-secondary">
            Your cognitive alignment profile is ready, {state.name}
          </p>
        </motion.div>

        {/* Sync Rate */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-6 rounded-2xl border border-neural/20 bg-neural/5 text-center"
        >
          <span className="text-xs font-mono text-neural uppercase tracking-wider block mb-2">Neural Sync Rate</span>
          <div className="font-heading font-extrabold text-5xl text-neural text-glow mb-1">{syncRate}%</div>
          <span className="text-xs text-text-tertiary font-mono">{levelName} · L{level}</span>
          <div className="mt-4">
            <XpBar xp={state.totalXp} />
          </div>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mb-8 p-5 rounded-2xl border border-white/5 bg-white/[0.02]"
        >
          <h3 className="font-heading font-semibold text-sm text-text-primary mb-4 text-center">
            Cognitive Alignment Profile
          </h3>
          <RadarProfile scores={dimensionScores} />
          <div className="grid grid-cols-2 gap-2 mt-4">
            {dimensions.map((d) => {
              const score = dimensionScores[d.id];
              const pct = score?.max > 0 ? Math.round((score.score / score.max) * 100) : 0;
              const Icon = dimensionIcons[d.id];
              return (
                <div key={d.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                  <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: d.color }} />
                  <div className="min-w-0">
                    <span className="text-xs text-text-secondary block truncate">{d.shortName}</span>
                    <span className="text-xs font-mono font-semibold" style={{ color: d.color }}>
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Protocols Unlocked */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h3 className="font-heading font-semibold text-sm text-text-primary mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-warn" />
            Protocols Unlocked
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {computedBadges.map((badge, i) => (
              <ProtocolBadge key={badge.id} badge={badge} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Revelations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="mb-8"
        >
          <h3 className="font-heading font-semibold text-sm text-text-primary mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-alert" />
            You Already Think Like This
          </h3>
          <div className="space-y-3">
            {revelations.map((rev, i) => {
              const score = dimensionScores[rev.dimension];
              const pct = score?.max > 0 ? score.score / score.max : 0;
              const isStrong = pct >= 0.5;
              return (
                <motion.div
                  key={rev.dimension}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 + i * 0.1 }}
                  className={`p-4 rounded-xl border transition-all ${
                    isStrong
                      ? 'border-success/20 bg-success/5'
                      : 'border-white/5 bg-white/[0.02]'
                  }`}
                >
                  <h4 className="font-heading font-semibold text-sm text-text-primary mb-1">{rev.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{rev.body}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Personalized recommendation */}
        {weakestDimension && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mb-8 p-5 rounded-xl border border-warn/20 bg-warn/5"
          >
            <span className="text-xs font-mono text-warn uppercase tracking-wider block mb-2">
              Growth Vector
            </span>
            <p className="text-sm text-text-primary leading-relaxed">{getInsight()}</p>
          </motion.div>
        )}

        {/* Two styles note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mb-8 p-4 rounded-xl border border-white/5 bg-white/[0.02] text-center"
        >
          <p className="text-xs text-text-tertiary leading-relaxed">
            Prefer the Swiss instrument-panel aesthetic? Try{' '}
            <span className="text-text-secondary font-medium">Horizon Field Lab</span> — the same missions,
            same rigor, different skin.
          </p>
        </motion.div>

        {/* Reset */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          onClick={onReset}
          className="w-full group py-4 rounded-xl font-heading font-semibold text-sm transition-all duration-300 border border-white/10 text-text-secondary hover:border-neural/20 hover:text-neural active:scale-[0.98]"
        >
          <span className="flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Recalibrate
          </span>
        </motion.button>
      </div>
    </NeuralFrame>
  );
}
