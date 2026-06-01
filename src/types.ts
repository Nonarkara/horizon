export type Dimension = 'communication' | 'orchestration' | 'capability' | 'interaction' | 'safety';

export interface DimensionScore {
  dimension: Dimension;
  score: number; // 0-100
  maxScore: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  dimension?: Dimension;
}

export interface ScenarioResult {
  scenarioId: string;
  score: number;
  maxScore: number;
  dimensionScores: Record<Dimension, number>;
  answers: Record<string, unknown>;
}

export interface AssessmentState {
  name: string;
  currentStep: 'landing' | 'intro' | 'scenario' | 'results';
  currentScenarioIndex: number;
  totalXp: number;
  results: ScenarioResult[];
  completed: boolean;
}

export interface ScenarioChoice {
  id: string;
  text: string;
  score: number;
  feedback?: string;
}

export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  dimension: Dimension;
  icon: string;
  description: string;
  maxScore: number;
}

export interface DimensionInfo {
  id: Dimension;
  name: string;
  shortName: string;
  description: string;
  color: string;
}
