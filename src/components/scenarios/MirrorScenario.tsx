import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Eye, ArrowRight } from 'lucide-react';
import type { ScenarioResult } from '../../types';

interface Props {
  onComplete: (result: ScenarioResult) => void;
}

interface Situation {
  id: string;
  text: string;
  aiCanHelp: boolean;
  explanation: string;
}

const situations: Situation[] = [
  {
    id: 'contract',
    text: 'Summarize the key clauses of a 50-page legal contract for a non-lawyer.',
    aiCanHelp: true,
    explanation: 'AI excels at extracting and simplifying structured text. The user still needs a lawyer for binding interpretation, but summarization is well within capability.',
  },
  {
    id: 'stocks',
    text: 'Predict next month\'s stock prices with high certainty to inform investment decisions.',
    aiCanHelp: false,
    explanation: 'AI cannot predict markets with certainty. Pattern recognition ≠ prophecy. Using AI for guaranteed investment advice is dangerous over-reliance.',
  },
  {
    id: 'ideas',
    text: 'Generate 10 blog post ideas about sustainable urban gardening.',
    aiCanHelp: true,
    explanation: 'Creative ideation from a topic is exactly what AI does well. Low stakes, high variety, easy to filter.',
  },
  {
    id: 'diagnosis',
    text: 'Provide an emergency medical diagnosis based on symptoms described in a chat.',
    aiCanHelp: false,
    explanation: 'Medical diagnosis requires physical examination, liability, and life-or-death precision. AI can suggest possibilities but must never replace emergency care.',
  },
  {
    id: 'debug',
    text: 'Debug a Python error from a stack trace and suggest a fix.',
    aiCanHelp: true,
    explanation: 'Code debugging from explicit error traces is a proven AI strength. The developer still tests the fix, but the diagnosis is reliable.',
  },
  {
    id: 'therapy',
    text: 'Replace a human therapist for ongoing trauma counseling sessions.',
    aiCanHelp: false,
    explanation: 'Therapy requires empathy, therapeutic alliance, and clinical judgment. AI can supplement mental health resources but cannot replace human care for trauma.',
  },
];

export function MirrorScenario({ onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  const current = situations[currentIndex];
  const currentAnswer = answers[current.id];

  const answer = (value: boolean) => {
    if (revealed) return;
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
    setRevealed(true);
  };

  const next = () => {
    if (currentIndex < situations.length - 1) {
      setCurrentIndex((i) => i + 1);
      setRevealed(false);
    } else {
      finish();
    }
  };

  const finish = () => {
    setFinished(true);
    let score = 0;
    const dimScores = { communication: 0, orchestration: 0, capability: 100, interaction: 0, safety: 0 };

    for (const s of situations) {
      const ans = answers[s.id];
      if (ans === s.aiCanHelp) {
        score += 16;
      } else {
        score += 4;
      }
    }
    score = Math.min(100, score + 4); // round up
    dimScores.capability = score;

    setTimeout(() => {
      onComplete({
        scenarioId: 'mirror',
        score,
        maxScore: 100,
        dimensionScores: dimScores,
        answers,
      });
    }, 2000);
  };

  if (finished) {
    const correct = situations.filter((s) => answers[s.id] === s.aiCanHelp).length;
    return (
      <div className="w-full max-w-lg mx-auto text-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-success/20 bg-success/5"
        >
          <Check className="w-4 h-4 text-success" />
          <span className="text-sm text-success font-mono">
            Reality check complete: {correct}/{situations.length} accurate
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-success" />
          <span className="text-xs font-mono text-success uppercase tracking-wider">Reality Check</span>
        </div>
        <span className="text-xs font-mono text-text-muted">
          {String(currentIndex + 1).padStart(2, '0')} / {String(situations.length).padStart(2, '0')}
        </span>
      </div>

      {/* Progress */}
      <div className="h-1 rounded-full bg-white/5 mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-success rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + (revealed ? 1 : 0)) / situations.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Situation card */}
      <motion.div
        key={current.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02]">
          <p className="text-base text-text-primary leading-relaxed">{current.text}</p>
        </div>
      </motion.div>

      {/* Answer buttons */}
      {!revealed ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => answer(true)}
            className="py-4 rounded-xl font-heading font-semibold text-sm transition-all duration-200 bg-success/10 text-success border border-success/20 hover:bg-success/15 hover:border-success/40 active:scale-[0.98]"
          >
            AI Can Handle This
          </button>
          <button
            onClick={() => answer(false)}
            className="py-4 rounded-xl font-heading font-semibold text-sm transition-all duration-200 bg-danger/10 text-danger border border-danger/20 hover:bg-danger/15 hover:border-danger/40 active:scale-[0.98]"
          >
            This Is a Trap
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div
            className={`p-4 rounded-xl border ${
              currentAnswer === current.aiCanHelp
                ? 'border-success/30 bg-success/5'
                : 'border-danger/30 bg-danger/5'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {currentAnswer === current.aiCanHelp ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <X className="w-4 h-4 text-danger" />
              )}
              <span
                className={`text-sm font-semibold ${
                  currentAnswer === current.aiCanHelp ? 'text-success' : 'text-danger'
                }`}
              >
                {currentAnswer === current.aiCanHelp ? 'Correct judgment' : 'Miscalibrated'}
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">{current.explanation}</p>
          </div>

          <button
            onClick={next}
            className="w-full group py-4 rounded-xl font-heading font-semibold text-sm transition-all duration-200 bg-neural/10 text-neural border border-neural/20 hover:bg-neural/15 hover:border-neural/40 active:scale-[0.98]"
          >
            <span className="flex items-center justify-center gap-2">
              {currentIndex < situations.length - 1 ? 'Next Situation' : 'Complete'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
