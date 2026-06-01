import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown, Check, X, Cpu, Trash2 } from 'lucide-react';
import type { ScenarioResult } from '../../types';

interface Props {
  onComplete: (result: ScenarioResult) => void;
}

const task = `Launch a new podcast about urban sustainability. You need research, fact-checking, scripting, voice production, editing, and marketing. Design the agent workflow.`;

interface Agent {
  id: string;
  name: string;
  description: string;
}

const availableAgents: Agent[] = [
  { id: 'researcher', name: 'Researcher', description: 'Gathers data, trends, and source material' },
  { id: 'factchecker', name: 'Fact-Checker', description: 'Verifies claims and catches hallucinations' },
  { id: 'scriptwriter', name: 'Scriptwriter', description: 'Turns research into episode scripts' },
  { id: 'voice', name: 'Voice Producer', description: 'Generates or coaches voice delivery' },
  { id: 'editor', name: 'Editor', description: 'Cuts, mixes, and polishes audio' },
  { id: 'marketer', name: 'Marketer', description: 'Creates promotion and distribution strategy' },
  { id: 'illustrator', name: 'Illustrator', description: 'Creates cover art and visual assets' },
  { id: 'lawyer', name: 'Legal Reviewer', description: 'Checks copyright and compliance' },
];

const idealOrder = ['researcher', 'factchecker', 'scriptwriter', 'voice', 'editor', 'marketer'];
const optionalAgents = ['illustrator', 'lawyer'];

export function FactoryScenario({ onComplete }: Props) {
  const [workflow, setWorkflow] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const addAgent = (id: string) => {
    if (submitted) return;
    if (workflow.includes(id)) return;
    setWorkflow([...workflow, id]);
  };

  const removeAgent = (index: number) => {
    if (submitted) return;
    const next = [...workflow];
    next.splice(index, 1);
    setWorkflow(next);
  };

  const moveAgent = (index: number, direction: -1 | 1) => {
    if (submitted) return;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= workflow.length) return;
    const next = [...workflow];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    setWorkflow(next);
  };

  const handleSubmit = () => {
    if (workflow.length < 3) return;
    setSubmitted(true);

    let score = 0;
    const dimScores = { communication: 0, orchestration: 0, capability: 0, interaction: 0, safety: 0 };

    // Check order correctness
    let orderScore = 0;
    for (let i = 0; i < workflow.length; i++) {
      const agentId = workflow[i];
      const idealIndex = idealOrder.indexOf(agentId);
      if (idealIndex !== -1) {
        // Reward for being close to ideal position
        const distance = Math.abs(i - idealIndex);
        orderScore += Math.max(0, 15 - distance * 5);
      }
    }

    // Bonus for including critical agents
    const hasResearcher = workflow.includes('researcher');
    const hasFactchecker = workflow.includes('factchecker');
    const hasScriptwriter = workflow.includes('scriptwriter');
    const hasMarketer = workflow.includes('marketer');

    if (hasResearcher) orderScore += 10;
    if (hasFactchecker) orderScore += 15;
    if (hasScriptwriter) orderScore += 10;
    if (hasMarketer) orderScore += 10;

    // Penalty for putting marketer before content exists
    const marketerIndex = workflow.indexOf('marketer');
    const contentIndex = Math.max(
      workflow.indexOf('scriptwriter'),
      workflow.indexOf('editor')
    );
    if (marketerIndex !== -1 && contentIndex !== -1 && marketerIndex < contentIndex) {
      orderScore -= 15;
    }

    // Penalty for including unnecessary early
    if (workflow[0] === 'lawyer' || workflow[1] === 'lawyer') orderScore -= 10;

    score = Math.min(100, Math.max(0, orderScore));
    dimScores.orchestration = score;

    setTimeout(() => {
      onComplete({
        scenarioId: 'factory',
        score,
        maxScore: 100,
        dimensionScores: dimScores,
        answers: { workflow },
      });
    }, 3000);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-6 p-5 rounded-xl border border-alert/20 bg-alert/5">
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="w-4 h-4 text-alert" />
          <span className="text-xs font-mono text-alert uppercase tracking-wider">The Mission</span>
        </div>
        <p className="text-sm text-text-primary leading-relaxed">{task}</p>
      </div>

      <p className="text-sm text-text-secondary mb-4">
        Build your agent pipeline. Select agents in the order they should work. Think about{' '}
        <span className="text-text-primary">dependencies</span> — what needs to happen before what?
      </p>

      {/* Available agents */}
      {!submitted && (
        <div className="mb-4">
          <span className="text-xs font-mono text-text-tertiary uppercase tracking-wider mb-2 block">
            Available Agents
          </span>
          <div className="flex flex-wrap gap-2">
            {availableAgents.map((agent) => {
              const used = workflow.includes(agent.id);
              return (
                <button
                  key={agent.id}
                  onClick={() => addAgent(agent.id)}
                  disabled={used}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    used
                      ? 'border-white/5 bg-white/[0.02] text-text-muted cursor-not-allowed'
                      : 'border-white/10 bg-white/[0.04] text-text-secondary hover:border-neural/30 hover:text-neural'
                  }`}
                >
                  {agent.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Workflow pipeline */}
      <div className="mb-6">
        <span className="text-xs font-mono text-text-tertiary uppercase tracking-wider mb-2 block">
          Your Pipeline {workflow.length > 0 && `(${workflow.length} steps)`}
        </span>
        <div className="space-y-2 min-h-[100px] p-4 rounded-xl border border-white/5 bg-white/[0.02]">
          {workflow.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-4">Tap agents above to build your pipeline</p>
          ) : (
            workflow.map((id, index) => {
              const agent = availableAgents.find((a) => a.id === id)!;
              const isIdeal = idealOrder.indexOf(id) === index;
              const showResult = submitted;
              return (
                <motion.div
                  key={`${id}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    showResult
                      ? isIdeal
                        ? 'border-success/30 bg-success/5'
                        : optionalAgents.includes(id)
                        ? 'border-warn/30 bg-warn/5'
                        : 'border-danger/30 bg-danger/5'
                      : 'border-white/5 bg-white/[0.03]'
                  }`}
                >
                  <span className="font-mono text-xs text-text-muted w-6">{String(index + 1).padStart(2, '0')}</span>
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-medium ${showResult && !isIdeal && !optionalAgents.includes(id) ? 'text-danger' : 'text-text-primary'}`}>
                      {agent.name}
                    </span>
                    <p className="text-xs text-text-tertiary">{agent.description}</p>
                  </div>
                  {!submitted && (
                    <div className="flex items-center gap-1">
                      <button onClick={() => moveAgent(index, -1)} className="p-1 rounded hover:bg-white/5 text-text-muted">
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button onClick={() => moveAgent(index, 1)} className="p-1 rounded hover:bg-white/5 text-text-muted">
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button onClick={() => removeAgent(index)} className="p-1 rounded hover:bg-danger/10 text-text-muted hover:text-danger">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {showResult && (
                    <div className="shrink-0">
                      {isIdeal ? (
                        <Check className="w-4 h-4 text-success" />
                      ) : optionalAgents.includes(id) ? (
                        <span className="text-xs text-warn font-mono">OK</span>
                      ) : (
                        <X className="w-4 h-4 text-danger" />
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={workflow.length < 3}
          className="w-full py-4 rounded-xl font-heading font-semibold text-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed bg-neural/10 text-neural border border-neural/20 hover:bg-neural/15 hover:border-neural/40 active:scale-[0.98]"
        >
          Deploy Pipeline
        </button>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-success/20 bg-success/5">
            <Check className="w-4 h-4 text-success" />
            <span className="text-sm text-success font-mono">Pipeline evaluated</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
