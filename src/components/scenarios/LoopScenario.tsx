import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Check, ChevronRight, MessageSquare } from 'lucide-react';
import type { ScenarioResult } from '../../types';

interface Props {
  onComplete: (result: ScenarioResult) => void;
}

interface Round {
  prompt: string;
  output: string;
  improvements: { id: string; text: string; score: number; feedback: string }[];
}

const rounds: Round[] = [
  {
    prompt: 'Write a social media post about our new coffee shop.',
    output: `Check out our new coffee shop! We have great coffee and a nice atmosphere. Come visit us soon.`,
    improvements: [
      { id: 'platform', text: 'Specify the platform (Instagram, LinkedIn, X/Twitter)', score: 15, feedback: 'Critical — format and length depend entirely on platform.' },
      { id: 'audience', text: 'Define the target audience (students, professionals, families)', score: 15, feedback: 'Essential — tone and appeal change completely by audience.' },
      { id: 'cta', text: 'Add a specific call-to-action (visit, follow, share)', score: 10, feedback: 'Good — every post needs a clear next step.' },
      { id: 'emoji', text: 'Add more emojis', score: 5, feedback: 'Minor — emojis help but are not structural.' },
      { id: 'longer', text: 'Make it much longer and more detailed', score: 0, feedback: 'Risky — social posts should be concise. Longer is not always better.' },
    ],
  },
  {
    prompt: 'Write an Instagram post about our new coffee shop for young professionals, with a CTA.',
    output: `New coffee shop alert! ☕ Perfect for your morning grind or afternoon catch-up. Cozy vibes, quality beans, and WiFi that actually works. Tag your coffee buddy below! #CoffeeShop #NewInTown`,
    improvements: [
      { id: 'differentiator', text: 'Add what makes you different from competitors', score: 15, feedback: 'Strong — differentiation is what drives choice, not just presence.' },
      { id: 'location', text: 'Include location or neighborhood name', score: 15, feedback: 'Critical for local discovery and SEO.' },
      { id: 'hours', text: 'Mention opening hours', score: 10, feedback: 'Useful — removes a barrier to action.' },
      { id: 'hashtags', text: 'Add 20 more hashtags', score: 0, feedback: 'Instagram penalizes hashtag stuffing. 3-5 targeted hashtags beat 20 random ones.' },
      { id: 'formal', text: 'Make the tone more formal and corporate', score: 0, feedback: 'Wrong direction — Instagram for young professionals should feel authentic, not corporate.' },
    ],
  },
  {
    prompt: 'Write an Instagram post about our new coffee shop for young professionals in downtown Austin. We roast our own beans in-house, have fiber WiFi, and open at 7am. Include a CTA.',
    output: `Your new downtown Austin workspace just got better. ☕\n\nWe roast our own beans in-house every morning. Fiber WiFi that never lags. Doors open at 7am for the early grinders.\n\n📍 Downtown Austin\n⏰ 7am — 7pm daily\n\nBring your laptop. Stay a while. Tag someone who needs a new spot.`,
    improvements: [
      { id: 'visual', text: 'Suggest what image or video to pair with this', score: 15, feedback: 'Excellent — the post and visual should be designed together.' },
      { id: 'story', text: 'Add a short founder story or origin motivation', score: 15, feedback: 'Strong — story creates emotional connection and memorability.' },
      { id: 'offer', text: 'Include a first-visit discount or loyalty hook', score: 10, feedback: 'Good — gives immediate incentive to act on the CTA.' },
      { id: 'perfect', text: 'This is perfect, no changes needed', score: 5, feedback: 'There is always room to improve. Iteration mindset means never declaring "done" too early.' },
    ],
  },
];

export function LoopScenario({ onComplete }: Props) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const round = rounds[roundIndex];

  const handleSelect = (id: string) => {
    if (submitted) return;
    setSelected(id);
  };

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);

    const improvement = round.improvements.find((i) => i.id === selected);
    if (improvement) {
      setTotalScore((s) => s + improvement.score);
    }
  };

  const nextRound = () => {
    if (roundIndex < rounds.length - 1) {
      setRoundIndex((i) => i + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      setFinished(true);
      const dimScores = { communication: 0, orchestration: 0, capability: 0, interaction: totalScore, safety: 0 };
      setTimeout(() => {
        onComplete({
          scenarioId: 'loop',
          score: Math.min(100, totalScore + (round.improvements.find((i) => i.id === selected)?.score ?? 0)),
          maxScore: 100,
          dimensionScores: dimScores,
          answers: { totalScore },
        });
      }, 2000);
    }
  };

  if (finished) {
    return (
      <div className="w-full max-w-lg mx-auto text-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-success/20 bg-success/5"
        >
          <Check className="w-4 h-4 text-success" />
          <span className="text-sm text-success font-mono">Feedback loop complete</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-warn" />
          <span className="text-xs font-mono text-warn uppercase tracking-wider">Feedback Loop</span>
        </div>
        <span className="text-xs font-mono text-text-muted">
          Round {roundIndex + 1} / {rounds.length}
        </span>
      </div>

      <div className="h-1 rounded-full bg-white/5 mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-warn rounded-full"
          animate={{ width: `${((roundIndex + (submitted ? 1 : 0)) / rounds.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Prompt */}
      <div className="mb-4 p-4 rounded-xl border border-neural/20 bg-neural/5">
        <span className="text-xs font-mono text-neural uppercase tracking-wider mb-1 block">Prompt</span>
        <p className="text-sm text-text-primary">{round.prompt}</p>
      </div>

      {/* Output */}
      <div className="mb-6 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
        <span className="text-xs font-mono text-text-tertiary uppercase tracking-wider mb-1 block">AI Output</span>
        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{round.output}</p>
      </div>

      <p className="text-sm text-text-secondary mb-4">
        What is the <span className="text-text-primary font-medium">most valuable</span> improvement for the next iteration?
      </p>

      <div className="space-y-2 mb-6">
        {round.improvements.map((imp, i) => (
          <motion.button
            key={imp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => handleSelect(imp.id)}
            disabled={submitted}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
              submitted && selected === imp.id
                ? imp.score > 0
                  ? 'border-success/30 bg-success/5'
                  : 'border-danger/30 bg-danger/5'
                : selected === imp.id
                ? 'border-warn/30 bg-warn/5'
                : 'border-white/5 bg-white/[0.02] hover:border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  selected === imp.id ? 'border-warn bg-warn/20' : 'border-white/20'
                }`}
              >
                {selected === imp.id && <div className="w-2 h-2 rounded-full bg-warn" />}
              </div>
              <span className={`text-sm ${submitted && selected === imp.id && imp.score === 0 ? 'text-danger' : 'text-text-primary'}`}>
                {imp.text}
              </span>
            </div>

            <AnimatePresence>
              {submitted && selected === imp.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-3 border-t border-white/5"
                >
                  <p className={`text-xs leading-relaxed ${imp.score > 0 ? 'text-success' : 'text-danger'}`}>
                    {imp.feedback}
                  </p>
                  <p className="text-xs text-text-muted mt-1 font-mono">+{imp.score} pts</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full py-4 rounded-xl font-heading font-semibold text-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed bg-neural/10 text-neural border border-neural/20 hover:bg-neural/15 hover:border-neural/40 active:scale-[0.98]"
        >
          Iterate Prompt
        </button>
      ) : (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={nextRound}
          className="w-full group py-4 rounded-xl font-heading font-semibold text-sm transition-all duration-200 bg-neural/10 text-neural border border-neural/20 hover:bg-neural/15 hover:border-neural/40 active:scale-[0.98]"
        >
          <span className="flex items-center justify-center gap-2">
            {roundIndex < rounds.length - 1 ? 'Next Round' : 'Complete Loop'}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </motion.button>
      )}
    </div>
  );
}
