import type { Scenario, DimensionInfo, Badge } from '../types';

export const dimensions: DimensionInfo[] = [
  {
    id: 'communication',
    name: 'Signal Clarity',
    shortName: 'Communication',
    description: 'How precisely you instruct and constrain AI systems',
    color: '#00f0ff',
  },
  {
    id: 'orchestration',
    name: 'Swarm Logic',
    shortName: 'Orchestration',
    description: 'Breaking complex goals into coordinated sub-agents',
    color: '#ff00a0',
  },
  {
    id: 'capability',
    name: 'Reality Check',
    shortName: 'Capability',
    description: 'Knowing what AI can and cannot do reliably',
    color: '#00ff88',
  },
  {
    id: 'interaction',
    name: 'Feedback Loop',
    shortName: 'Interaction',
    description: 'Iterating and refining through conversation',
    color: '#ffb800',
  },
  {
    id: 'safety',
    name: 'Risk Protocol',
    shortName: 'Safety',
    description: 'Spotting dangers, bias, and failure modes',
    color: '#ff2d55',
  },
];

export const scenarios: Scenario[] = [
  {
    id: 'brief',
    title: 'The Brief',
    subtitle: 'Signal Clarity Test',
    dimension: 'communication',
    icon: 'Radio',
    description:
      'You are given a vague request. Your job is not to answer it — your job is to make it answerable. Choose the clarifications that would turn this mess into something an AI can actually work with.',
    maxScore: 100,
  },
  {
    id: 'factory',
    title: 'The Factory',
    subtitle: 'Swarm Logic Test',
    dimension: 'orchestration',
    icon: 'Cpu',
    description:
      'You have a complex goal that no single agent can handle alone. Design a workflow: who does what, in what order, and what passes between them? Think troop, not tool.',
    maxScore: 100,
  },
  {
    id: 'mirror',
    title: 'The Mirror',
    subtitle: 'Reality Check Test',
    dimension: 'capability',
    icon: 'ScanEye',
    description:
      'AI is powerful, but it is not magic. For each situation, decide: is this something AI handles well, or is this a trap? The wrong call costs more than the slow call.',
    maxScore: 100,
  },
  {
    id: 'loop',
    title: 'The Loop',
    subtitle: 'Feedback Loop Test',
    dimension: 'interaction',
    icon: 'RefreshCw',
    description:
      'You get a bad output. Most people blame the AI. You know better. Iterate. Refine. Feed back. Shape the result through three rounds of surgical adjustment.',
    maxScore: 100,
  },
  {
    id: 'warning',
    title: 'The Warning',
    subtitle: 'Risk Protocol Test',
    dimension: 'safety',
    icon: 'ShieldAlert',
    description:
      'Every powerful tool has an edge. Spot the hidden risks in these scenarios — privacy leaks, hallucinations, bias, over-reliance. Then choose the right safeguard.',
    maxScore: 100,
  },
];

export const badges: Badge[] = [
  {
    id: 'clear_signal',
    name: 'Clear Signal',
    description: 'Demonstrated precise communication with AI systems',
    icon: 'Radio',
    unlocked: false,
    dimension: 'communication',
  },
  {
    id: 'swarm_master',
    name: 'Swarm Architect',
    description: 'Built effective multi-agent workflows',
    icon: 'Cpu',
    unlocked: false,
    dimension: 'orchestration',
  },
  {
    id: 'realist',
    name: 'Grounded',
    description: 'Showed accurate understanding of AI capabilities',
    icon: 'ScanEye',
    unlocked: false,
    dimension: 'capability',
  },
  {
    id: 'refiner',
    name: 'Sculptor',
    description: 'Mastered iterative prompt refinement',
    icon: 'RefreshCw',
    unlocked: false,
    dimension: 'interaction',
  },
  {
    id: 'guardian',
    name: 'Guardian',
    description: 'Identified and mitigated AI risks',
    icon: 'ShieldAlert',
    unlocked: false,
    dimension: 'safety',
  },
  {
    id: 'full_sync',
    name: 'Full Sync',
    description: 'Achieved high scores across all dimensions',
    icon: 'Zap',
    unlocked: false,
  },
  {
    id: 'first_contact',
    name: 'First Contact',
    description: 'Completed your first Neural Calibration',
    icon: 'Sparkles',
    unlocked: false,
  },
];

export const levelNames = [
  'Uninitialized',
  'Signal Receiver',
  'Pattern Matcher',
  'Loop Runner',
  'Swarm Coordinator',
  'Neural Architect',
  'Singularity Adjacent',
];

export function getLevel(xp: number): { level: number; name: string; progress: number } {
  const thresholds = [0, 150, 350, 600, 900, 1300, 1800];
  let level = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) level = i;
  }
  const nextThreshold = thresholds[level + 1] ?? thresholds[thresholds.length - 1] * 1.5;
  const currentThreshold = thresholds[level];
  const progress = Math.min(100, Math.round(((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100));
  return { level, name: levelNames[level] ?? levelNames[levelNames.length - 1], progress };
}
