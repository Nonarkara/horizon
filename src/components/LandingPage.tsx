import { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, ChevronRight, Sparkles } from 'lucide-react';
import { NeuralFrame } from './NeuralFrame';

interface LandingPageProps {
  onStart: (name: string) => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const [name, setName] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onStart(name.trim());
  };

  return (
    <NeuralFrame className="flex flex-col items-center justify-center px-4 py-12">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-neural/30"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
            }}
            animate={{
              y: [null, `${Math.random() * 100}%`],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md">
        {/* Logo / Icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-neural/5 border border-neural/20 flex items-center justify-center">
              <BrainCircuit className="w-10 h-10 text-neural animate-flicker" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-alert animate-pulse-slow" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-center mb-3"
        >
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-text-primary tracking-tight">
            Neural{' '}
            <span className="text-neural text-glow">Calibration</span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-center text-text-secondary text-sm sm:text-base mb-10 leading-relaxed"
        >
          Not trivia. Not acronyms. A practical assessment of how you{' '}
          <span className="text-text-primary font-medium">think with AI</span>.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {['Communication', 'Orchestration', 'Capability', 'Iteration', 'Safety'].map((item, i) => (
            <span
              key={item}
              className="px-3 py-1 rounded-full text-xs font-mono border border-white/10 text-text-tertiary bg-white/[0.02]"
            >
              <span className="text-neural mr-1.5">{String(i + 1).padStart(2, '0')}</span>
              {item}
            </span>
          ))}
        </motion.div>

        {/* Input form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div
            className={`relative rounded-xl border transition-all duration-300 ${
              focused ? 'border-neural/40 shadow-[0_0_20px_rgba(0,240,255,0.08)]' : 'border-white/10'
            }`}
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Enter your callsign..."
              className="w-full bg-surface-raised px-5 py-4 rounded-xl text-text-primary placeholder:text-text-muted outline-none font-mono text-sm"
              maxLength={30}
            />
            <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full group relative py-4 rounded-xl font-heading font-semibold text-sm tracking-wide transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed bg-neural/10 text-neural border border-neural/20 hover:bg-neural/15 hover:border-neural/40 active:scale-[0.98]"
          >
            <span className="flex items-center justify-center gap-2">
              Initialize Calibration
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
        </motion.form>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="text-center text-text-muted text-xs mt-6 font-mono"
        >
          ~ 8 minutes · No memorization required · Progressive disclosure
        </motion.p>
      </div>
    </NeuralFrame>
  );
}
