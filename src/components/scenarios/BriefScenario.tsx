import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, MessageSquareQuote } from 'lucide-react';
import type { ScenarioResult } from '../../types';

interface Props {
  onComplete: (result: ScenarioResult) => void;
}

const situation = `Your colleague messages you: "Hey, can you use AI to help me with my business? I need something good."`;

const options = [
  { id: 'industry', text: 'What industry is your business in?', score: 15, good: true },
  { id: 'outcome', text: 'What specific outcome do you need — a plan, analysis, pitch, or content?', score: 20, good: true },
  { id: 'audience', text: 'Who is the target audience for this output?', score: 15, good: true },
  { id: 'tried', text: 'What approaches have you already tried?', score: 10, good: true },
  { id: 'budget', text: 'What is your budget and timeline?', score: 15, good: true },
  { id: 'meaning', text: 'What is the true meaning of business success?', score: 0, good: false, feedback: 'Too philosophical. The AI needs constraints, not existential debates.' },
  { id: 'explain', text: 'Can you first explain how AI works?', score: 0, good: false, feedback: 'Off-topic. You need to clarify the task, not educate your colleague on AI fundamentals.' },
  { id: 'book', text: 'Write me a 500-page business strategy book.', score: 0, good: false, feedback: 'Unrealistic scope. Good communication means setting feasible boundaries.' },
  { id: 'tone', text: 'What tone and style should the output have?', score: 15, good: true },
  { id: 'competitors', text: 'Who are your main competitors?', score: 10, good: true },
];

export function BriefScenario({ onComplete }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggle = (id: string) => {
    if (submitted) return;
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const handleSubmit = () => {
    if (selected.size === 0) return;
    setSubmitted(true);

    let score = 0;
    const dimScores = { communication: 0, orchestration: 0, capability: 0, interaction: 0, safety: 0 };

    for (const opt of options) {
      if (selected.has(opt.id)) {
        score += opt.score;
        dimScores.communication += opt.score;
      }
    }

    // Penalty for bad selections
    const badSelected = Array.from(selected).filter((id) => !options.find((o) => o.id === id)?.good).length;
    score = Math.max(0, score - badSelected * 10);
    dimScores.communication = Math.max(0, dimScores.communication - badSelected * 10);

    setTimeout(() => {
      onComplete({
        scenarioId: 'brief',
        score,
        maxScore: 100,
        dimensionScores: dimScores,
        answers: { selected: Array.from(selected) },
      });
    }, 2500);
  };

  const selectedGood = Array.from(selected).filter((id) => options.find((o) => o.id === id)?.good);
  const selectedBad = Array.from(selected).filter((id) => !options.find((o) => o.id === id)?.good);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Situation card */}
      <div className="mb-6 p-5 rounded-xl border border-warn/20 bg-warn/5">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquareQuote className="w-4 h-4 text-warn" />
          <span className="text-xs font-mono text-warn uppercase tracking-wider">The Request</span>
        </div>
        <p className="text-sm text-text-primary leading-relaxed italic">"{situation}"</p>
      </div>

      <p className="text-sm text-text-secondary mb-4">
        Select <span className="text-neural font-medium">all</span> the clarifying questions you would ask before prompting an AI. Choose wisely — wrong picks cost you.
      </p>

      <div className="space-y-2 mb-6">
        {options.map((opt, i) => {
          const isSelected = selected.has(opt.id);
          const showResult = submitted && isSelected;
          return (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => toggle(opt.id)}
              disabled={submitted}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 ${
                showResult
                  ? opt.good
                    ? 'border-success/30 bg-success/5'
                    : 'border-danger/30 bg-danger/5'
                  : isSelected
                  ? 'border-neural/30 bg-neural/5'
                  : 'border-white/5 bg-white/[0.02] hover:border-white/10'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  showResult
                    ? opt.good
                      ? 'border-success bg-success/20'
                      : 'border-danger bg-danger/20'
                    : isSelected
                    ? 'border-neural bg-neural/20'
                    : 'border-white/20'
                }`}
              >
                {showResult ? (
                  opt.good ? (
                    <Check className="w-3 h-3 text-success" />
                  ) : (
                    <X className="w-3 h-3 text-danger" />
                  )
                ) : isSelected ? (
                  <Check className="w-3 h-3 text-neural" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-sm ${showResult && !opt.good ? 'text-danger' : 'text-text-primary'}`}>
                  {opt.text}
                </span>
                <AnimatePresence>
                  {showResult && opt.feedback && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-danger mt-2 leading-relaxed"
                    >
                      {opt.feedback}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selected.size === 0}
          className="w-full py-4 rounded-xl font-heading font-semibold text-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed bg-neural/10 text-neural border border-neural/20 hover:bg-neural/15 hover:border-neural/40 active:scale-[0.98]"
        >
          Transmit Selection ({selected.size} chosen)
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-success/20 bg-success/5">
            <Check className="w-4 h-4 text-success" />
            <span className="text-sm text-success font-mono">
              Signal clarity: {selectedGood.length} good · {selectedBad.length} missed
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
