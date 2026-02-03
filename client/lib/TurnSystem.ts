// TurnSystem.ts
// Handles turn/tick processing and scheduling

import { GameState, processTurn } from "./MMORPGGameEngine";

export interface TurnScheduler {
  intervalMs: number;
  lastTick: number;
  running: boolean;
}

export function createTurnScheduler(intervalMs: number): TurnScheduler {
  return {
    intervalMs,
    lastTick: Date.now(),
    running: false,
  };
}

export function runTurn(game: GameState): GameState {
  // Process a single turn
  return processTurn(game);
}

// Example: pseudo async loop (for server-side)
export async function startTurnLoop(game: GameState, scheduler: TurnScheduler, onUpdate: (g: GameState) => void) {
  scheduler.running = true;
  while (scheduler.running) {
    const now = Date.now();
    if (now - scheduler.lastTick >= scheduler.intervalMs) {
      game = runTurn(game);
      onUpdate(game);
      scheduler.lastTick = now;
    }
    await new Promise(res => setTimeout(res, 1000));
  }
}

export function stopTurnLoop(scheduler: TurnScheduler) {
  scheduler.running = false;
}
