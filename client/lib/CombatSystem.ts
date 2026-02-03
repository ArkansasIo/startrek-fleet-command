// CombatSystem.ts
// Handles PvE, PvP, and boss combat logic

import { Player } from "./MMORPGGameEngine";
import { STAR_TREK_BOSSES } from "./StarTrekBosses";
import { FLEET_UNITS } from "./OGameMechanics";

export interface CombatResult {
  winner: string;
  log: string[];
  playerLosses: { [unitId: string]: number };
  enemyLosses: { [unitId: string]: number };
}

export function simulatePvE(player: Player, bossId: string): CombatResult {
  const boss = STAR_TREK_BOSSES.find(b => b.id === bossId);
  if (!boss) return { winner: "none", log: ["Boss not found"], playerLosses: {}, enemyLosses: {} };
  // Simple combat: compare total attack/defense
  const playerAttack = Object.entries(player.fleets).reduce((sum, [unitId, count]) => {
    const unit = FLEET_UNITS.find(u => u.id === unitId);
    return sum + (unit ? unit.attack * count : 0);
  }, 0);
  const playerDefense = Object.entries(player.fleets).reduce((sum, [unitId, count]) => {
    const unit = FLEET_UNITS.find(u => u.id === unitId);
    return sum + (unit ? unit.defense * count : 0);
  }, 0);
  const bossAttack = boss.attack;
  const bossDefense = boss.defense;
  let log = [
    `Player attack: ${playerAttack}, defense: ${playerDefense}`,
    `Boss attack: ${bossAttack}, defense: ${bossDefense}`
  ];
  let winner = "draw";
  if (playerAttack > bossDefense && playerDefense > bossAttack) winner = player.id;
  else if (bossAttack > playerDefense) winner = boss.id;
  log.push(`Winner: ${winner}`);
  // Losses (simple: all or nothing)
  return {
    winner,
    log,
    playerLosses: winner === player.id ? {} : { ...player.fleets },
    enemyLosses: winner === player.id ? { [boss.id]: 1 } : {},
  };
}

// PvP and fleet-vs-fleet combat can be added similarly
