import { AnimatePresence, motion } from 'framer-motion';
import { useAssessment } from './hooks/useAssessment';
import { LandingPage } from './components/LandingPage';
import { IntroPage } from './components/IntroPage';
import { ScenarioRenderer } from './components/ScenarioRenderer';
import { ResultPage } from './components/ResultPage';
import { NeuralFrame } from './components/NeuralFrame';
import type { ScenarioResult } from './types';

export default function App() {
  const { state, startAssessment, startScenarios, submitScenario, reset, getDimensionScores } = useAssessment();

  const handleScenarioComplete = (result: ScenarioResult) => {
    submitScenario(result);
  };

  return (
    <div className="min-h-dvh bg-void text-text-primary font-sans">
      <AnimatePresence mode="wait">
        {state.currentStep === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage onStart={startAssessment} />
          </motion.div>
        )}

        {state.currentStep === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IntroPage onStart={startScenarios} />
          </motion.div>
        )}

        {state.currentStep === 'scenario' && (
          <motion.div
            key={`scenario-${state.currentScenarioIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ScenarioRenderer
              scenarioIndex={state.currentScenarioIndex}
              totalXp={state.totalXp}
              onComplete={handleScenarioComplete}
            />
          </motion.div>
        )}

        {state.currentStep === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ResultPage
              state={state}
              dimensionScores={getDimensionScores()}
              onReset={reset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
