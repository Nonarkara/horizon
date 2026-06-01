# Neural Calibration — Developer Notes

## Project

Gamified AI literacy assessment with cyberpunk aesthetic. Built with Vite + React + TypeScript + Tailwind CSS v4.

## Build Commands

```bash
npm run dev      # Development server
npm run build    # Production build (outputs to dist/)
npm run preview  # Preview production build locally
```

## Architecture

```
src/
  App.tsx                          # Main state machine (landing → intro → scenario → results)
  main.tsx                         # Entry point
  index.css                        # Tailwind v4 config + cyberpunk design tokens
  types.ts                         # Shared TypeScript types
  data/scenarios.ts                # Scenario metadata, dimensions, badges, leveling
  hooks/useAssessment.ts           # State management with localStorage persistence
  components/
    NeuralFrame.tsx                # Background wrapper (grid, scanlines, vignette)
    XpBar.tsx                      # XP progress bar (compact + full)
    ProtocolBadge.tsx              # Badge display component
    RadarProfile.tsx               # Recharts radar chart for dimension scores
    LandingPage.tsx                # Intro screen with name input
    IntroPage.tsx                  # Pre-calibration briefing
    ScenarioRenderer.tsx           # Header + scenario routing
    ResultPage.tsx                 # Final results, radar, badges, revelations
    scenarios/
      BriefScenario.tsx            # Communication: multi-select clarifying questions
      FactoryScenario.tsx          # Orchestration: build agent pipeline
      MirrorScenario.tsx           # Capability: yes/no judgment on AI suitability
      LoopScenario.tsx             # Interaction: iterative prompt refinement (3 rounds)
      WarningScenario.tsx          # Safety: spot risks + choose safeguards
```

## State Flow

1. `landing` → user enters name → `startAssessment(name)`
2. `intro` → user reads briefing → `startScenarios()`
3. `scenario` → runs 5 scenarios sequentially → `submitScenario(result)`
4. `results` → shows radar chart, badges, revelations, insights → `reset()`

## Design Tokens

Colors: `--color-void` (#050508), `--color-neural` (#00f0ff), `--color-alert` (#ff00a0), `--color-warn` (#ffb800), `--color-success` (#00ff88), `--color-danger` (#ff2d55)

Fonts: Inter (body), Manrope (headings), JetBrains Mono (mono/terminal)

## Key Decisions

- Tailwind v4 uses CSS-based config (`@theme` in index.css) — no tailwind.config.js
- localStorage persists session state (key: `neural-calibration-v1`)
- All scenarios are interactive (no multiple-choice trivia)
- Gamification terms: "Neural XP", "Cognitive Tiers", "Protocols Unlocked", "Sync Rate"

## Deployment

GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`). Base path: `/horizon/`.
