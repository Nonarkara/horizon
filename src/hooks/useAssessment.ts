import { useState, useCallback } from 'react';
import type { AssessmentState, ScenarioResult, Dimension } from '../types';

const STORAGE_KEY = 'neural-calibration-v1';

function loadState(): AssessmentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AssessmentState;
  } catch {
    return null;
  }
}

function saveState(state: AssessmentState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const initialState: AssessmentState = {
  name: '',
  currentStep: 'landing',
  currentScenarioIndex: 0,
  totalXp: 0,
  results: [],
  completed: false,
};

export function useAssessment() {
  const [state, setState] = useState<AssessmentState>(() => loadState() ?? initialState);

  const update = useCallback((patch: Partial<AssessmentState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      saveState(next);
      return next;
    });
  }, []);

  const startAssessment = useCallback((name: string) => {
    const next: AssessmentState = {
      ...initialState,
      name,
      currentStep: 'intro',
    };
    saveState(next);
    setState(next);
  }, []);

  const startScenarios = useCallback(() => {
    update({ currentStep: 'scenario', currentScenarioIndex: 0 });
  }, [update]);

  const submitScenario = useCallback(
    (result: ScenarioResult) => {
      setState((prev) => {
        const results = [...prev.results, result];
        const totalXp = results.reduce((sum, r) => sum + r.score, 0);
        const nextIndex = prev.currentScenarioIndex + 1;
        const completed = nextIndex >= 5;
        const next: AssessmentState = {
          ...prev,
          results,
          totalXp,
          currentScenarioIndex: nextIndex,
          currentStep: completed ? 'results' : 'scenario',
          completed,
        };
        saveState(next);
        return next;
      });
    },
    []
  );

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
  }, []);

  const getDimensionScores = useCallback((): Record<Dimension, { score: number; max: number }> => {
    const dims: Dimension[] = ['communication', 'orchestration', 'capability', 'interaction', 'safety'];
    const out = {} as Record<Dimension, { score: number; max: number }>;
    for (const d of dims) {
      out[d] = { score: 0, max: 0 };
    }
    for (const r of state.results) {
      for (const [dim, score] of Object.entries(r.dimensionScores)) {
        out[dim as Dimension].score += score;
        out[dim as Dimension].max += r.maxScore / Object.keys(r.dimensionScores).length;
      }
    }
    return out;
  }, [state.results]);

  return {
    state,
    update,
    startAssessment,
    startScenarios,
    submitScenario,
    reset,
    getDimensionScores,
  };
}
