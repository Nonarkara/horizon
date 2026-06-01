import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Check, X, ChevronRight } from 'lucide-react';
import type { ScenarioResult } from '../../types';

interface Props {
  onComplete: (result: ScenarioResult) => void;
}

interface Case {
  id: string;
  situation: string;
  risks: { id: string; text: string; valid: boolean }[];
  safeguards: { id: string; text: string; score: number; feedback: string }[];
}

const cases: Case[] = [
  {
    id: 'medical',
    situation: `A hospital administrator wants to upload all patient medical records to a cloud AI service to "generate wellness insights and predict readmissions."`,
    risks: [
      { id: 'privacy', text: 'Massive HIPAA/privacy violation', valid: true },
      { id: 'hallucination', text: 'AI could hallucinate dangerous medical advice', valid: true },
      { id: 'slow', text: 'The AI might be too slow to process all records', valid: false },
      { id: 'bias', text: 'Training data bias could skew predictions for minority groups', valid: true },
    ],
    safeguards: [
      { id: 'anonymize', text: 'Anonymize all data before any AI processing', score: 25, feedback: 'Essential first step — removes direct identifiers.' },
      { id: 'local', text: 'Use an on-premise model with no cloud transmission', score: 25, feedback: 'Strong — keeps data within organizational control.' },
      { id: 'consent', text: 'Obtain explicit patient consent with opt-out', score: 20, feedback: 'Required ethically and often legally.' },
      { id: 'audit', text: 'Require human clinician review of all AI outputs', score: 20, feedback: 'Critical — AI suggests, humans decide in medicine.' },
      { id: 'ignore', text: 'Proceed carefully but do not inform patients', score: 0, feedback: 'Unacceptable — transparency is non-negotiable with health data.' },
    ],
  },
  {
    id: 'news',
    situation: `A newsroom starts using AI to write breaking news articles in real-time from social media feeds, publishing without human review to beat competitors.`,
    risks: [
      { id: 'hallucination', text: 'AI could fabricate events or misattribute quotes', valid: true },
      { id: 'speed', text: 'Publishing too fast might crash the website', valid: false },
      { id: 'bias', text: 'Social media feeds amplify sensational or biased content', valid: true },
      { id: 'reputation', text: 'One error could destroy the outlet\'s credibility', valid: true },
    ],
    safeguards: [
      { id: 'human', text: 'Mandate human editor sign-off before publish', score: 30, feedback: 'Non-negotiable for journalism — speed never beats accuracy.' },
      { id: 'source', text: 'Require at least two verified independent sources', score: 25, feedback: 'Standard journalistic practice, even more critical with AI.' },
      { id: 'flag', text: 'Auto-flag uncertain claims for review instead of publishing', score: 25, feedback: 'Smart — uses AI as detector, not publisher.' },
      { id: 'watermark', text: 'Label all AI-generated content transparently', score: 15, feedback: 'Good practice for transparency and trust.' },
      { id: 'compete', text: 'Accept the risk — beating competitors matters most', score: 0, feedback: 'Dangerous — one hallucinated story causes irreversible harm.' },
    ],
  },
  {
    id: 'hiring',
    situation: `A tech company deploys an AI system to screen all job applications, automatically rejecting candidates below a "fit score" threshold without explanation.`,
    risks: [
      { id: 'bias', text: 'Historical hiring data likely encodes existing biases', valid: true },
      { id: 'explain', text: 'Candidates have no way to understand or contest decisions', valid: true },
      { id: 'diversity', text: 'Non-traditional candidates may be filtered out unfairly', valid: true },
      { id: 'cost', text: 'AI screening is more expensive than human review', valid: false },
    ],
    safeguards: [
      { id: 'audit', text: 'Regular third-party bias audits of the screening model', score: 25, feedback: 'Essential — you cannot fix what you do not measure.' },
      { id: 'human', text: 'AI ranks candidates but humans make final decisions', score: 25, feedback: 'Correct — AI assists, humans decide.' },
      { id: 'explain', text: 'Provide rejected candidates with specific, actionable feedback', score: 20, feedback: 'Required for fairness and legal compliance in many jurisdictions.' },
      { id: 'diverse', text: 'Train the model on diverse, representative datasets', score: 20, feedback: 'Important — but ongoing auditing matters more than one-time training.' },
      { id: 'threshold', text: 'Lower the threshold so fewer are auto-rejected', score: 5, feedback: 'Band-aid — does not address the root problem of opaque automation.' },
    ],
  },
];

export function WarningScenario({ onComplete }: Props) {
  const [caseIndex, setCaseIndex] = useState(0);
  const [phase, setPhase] = useState<'risks' | 'safeguards' | 'review'>('risks');
  const [selectedRisks, setSelectedRisks] = useState<Set<string>>(new Set());
  const [selectedSafeguard, setSelectedSafeguard] = useState<string | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentCase = cases[caseIndex];

  const toggleRisk = (id: string) => {
    const next = new Set(selectedRisks);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRisks(next);
  };

  const submitRisks = () => {
    let score = 0;
    for (const risk of currentCase.risks) {
      if (selectedRisks.has(risk.id) && risk.valid) score += 10;
      if (selectedRisks.has(risk.id) && !risk.valid) score -= 5;
    }
    setTotalScore((s) => s + Math.max(0, score));
    setPhase('safeguards');
  };

  const submitSafeguard = () => {
    const sg = currentCase.safeguards.find((s) => s.id === selectedSafeguard);
    if (sg) setTotalScore((s) => s + sg.score);

    if (caseIndex < cases.length - 1) {
      setCaseIndex((i) => i + 1);
      setSelectedRisks(new Set());
      setSelectedSafeguard(null);
      setPhase('risks');
    } else {
      setFinished(true);
      const dimScores = { communication: 0, orchestration: 0, capability: 0, interaction: 0, safety: Math.min(100, totalScore + (currentCase.safeguards.find((s) => s.id === selectedSafeguard)?.score ?? 0)) };
      setTimeout(() => {
        onComplete({
          scenarioId: 'warning',
          score: dimScores.safety,
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
          <span className="text-sm text-success font-mono">Risk protocol complete</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-danger" />
          <span className="text-xs font-mono text-danger uppercase tracking-wider">Risk Protocol</span>
        </div>
        <span className="text-xs font-mono text-text-muted">
          Case {caseIndex + 1} / {cases.length}
        </span>
      </div>

      <div className="h-1 rounded-full bg-white/5 mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-danger rounded-full"
          animate={{ width: `${((caseIndex + (phase === 'safeguards' ? 1 : 0)) / cases.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Situation */}
      <div className="mb-6 p-5 rounded-xl border border-danger/20 bg-danger/5">
        <p className="text-sm text-text-primary leading-relaxed">{currentCase.situation}</p>
      </div>

      {phase === 'risks' && (
        <>
          <p className="text-sm text-text-secondary mb-4">
            Select <span className="text-danger font-medium">all</span> the real risks in this scenario.
          </p>
          <div className="space-y-2 mb-6">
            {currentCase.risks.map((risk) => {
              const isSelected = selectedRisks.has(risk.id);
              return (
                <button
                  key={risk.id}
                  onClick={() => toggleRisk(risk.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 ${
                    isSelected
                      ? 'border-danger/30 bg-danger/5'
                      : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'border-danger bg-danger/20' : 'border-white/20'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-danger" />}
                  </div>
                  <span className="text-sm text-text-primary">{risk.text}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={submitRisks}
            disabled={selectedRisks.size === 0}
            className="w-full py-4 rounded-xl font-heading font-semibold text-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed bg-neural/10 text-neural border border-neural/20 hover:bg-neural/15 hover:border-neural/40 active:scale-[0.98]"
          >
            Identify Risks
          </button>
        </>
      )}

      {phase === 'safeguards' && (
        <>
          <p className="text-sm text-text-secondary mb-4">
            Choose the <span className="text-text-primary font-medium">best safeguard</span> for this scenario.
          </p>
          <div className="space-y-2 mb-6">
            {currentCase.safeguards.map((sg) => (
              <button
                key={sg.id}
                onClick={() => setSelectedSafeguard(sg.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  selectedSafeguard === sg.id
                    ? 'border-success/30 bg-success/5'
                    : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedSafeguard === sg.id ? 'border-success bg-success/20' : 'border-white/20'
                    }`}
                  >
                    {selectedSafeguard === sg.id && <div className="w-2 h-2 rounded-full bg-success" />}
                  </div>
                  <span className="text-sm text-text-primary">{sg.text}</span>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={submitSafeguard}
            disabled={!selectedSafeguard}
            className="w-full group py-4 rounded-xl font-heading font-semibold text-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed bg-neural/10 text-neural border border-neural/20 hover:bg-neural/15 hover:border-neural/40 active:scale-[0.98]"
          >
            <span className="flex items-center justify-center gap-2">
              {caseIndex < cases.length - 1 ? 'Next Case' : 'Complete Protocol'}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
        </>
      )}
    </div>
  );
}
