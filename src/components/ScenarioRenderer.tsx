import { motion, AnimatePresence } from 'framer-motion';
import { BriefScenario } from './scenarios/BriefScenario';
import { FactoryScenario } from './scenarios/FactoryScenario';
import { MirrorScenario } from './scenarios/MirrorScenario';
import { LoopScenario } from './scenarios/LoopScenario';
import { WarningScenario } from './scenarios/WarningScenario';
import { NeuralFrame } from './NeuralFrame';
import { XpBar } from './XpBar';
import { scenarios } from '../data/scenarios';
import type { ScenarioResult } from '../types';
import { ArrowRight } from 'lucide-react';

interface Props {
  scenarioIndex: number;
  totalXp: number;
  onComplete: (result: ScenarioResult) => void;
}

const scenarioComponents = [BriefScenario, FactoryScenario, MirrorScenario, LoopScenario, WarningScenario];

export function ScenarioRenderer({ scenarioIndex, totalXp, onComplete }: Props) {
  const scenario = scenarios[scenarioIndex];
  const ScenarioComponent = scenarioComponents[scenarioIndex];

  return (
    <NeuralFrame className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-neural">MISSION {String(scenarioIndex + 1).padStart(2, '0')}</span>
              <ArrowRight className="w-3 h-3 text-text-muted" />
              <span className="font-mono text-xs text-text-tertiary truncate">{scenario.subtitle.toUpperCase()}</span>
            </div>
            <h2 className="font-heading font-bold text-sm text-text-primary truncate">{scenario.title}</h2>
          </div>
          <div className="w-24 shrink-0">
            <XpBar xp={totalXp} compact />
          </div>
        </div>
      </header>

      {/* Scenario content */}
      <main className="flex-1 px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ScenarioComponent onComplete={onComplete} />
          </motion.div>
        </AnimatePresence>
      </main>
    </NeuralFrame>
  );
}
