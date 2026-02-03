// ExplorationSystem.ts
// Handles exploration, random events, and discoveries

import { Player } from "./MMORPGGameEngine";
import { STAR_TREK_PLANETS } from "./StarTrekPlanets";

export interface ExplorationEvent {
  id: string;
  type: 'planet' | 'anomaly' | 'artifact' | 'encounter' | 'resource';
  description: string;
  reward?: any;
}

export function explorePlanet(player: Player, planetId: string): ExplorationEvent {
  // Simple: random event
  const events: ExplorationEvent[] = [
    { id: 'anomaly', type: 'anomaly', description: 'Strange anomaly detected. Research required.' },
    { id: 'artifact', type: 'artifact', description: 'Ancient artifact found! Gain research points.', reward: { research: 100 } },
    { id: 'resource', type: 'resource', description: 'Rich resource deposit discovered.', reward: { dilithium: 200 } },
    { id: 'encounter', type: 'encounter', description: 'Hostile alien encounter! Prepare for combat.' },
    { id: 'planet', type: 'planet', description: 'New habitable zone mapped.' },
  ];
  const event = events[Math.floor(Math.random() * events.length)];
  return event;
}
