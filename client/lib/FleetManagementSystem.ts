/**
 * STAR TREK: FLEET COMMAND - FLEET MANAGEMENT SYSTEM
 * ===================================================
 * Complete fleet management with formations, tactics, and bonuses
 * Integrates with Ship Building and Crew Management Systems
 */

export interface FleetFormation {
  formationId: string;
  name: string;
  type: FormationType;
  shipPositions: ShipPosition[];
  bonus: FleetBonus;
  minShips: number;
  maxShips: number;
  description: string;
}

export interface ShipPosition {
  slot: number;
  role: ShipRole;
  bonusPercent: number;
  x: number;
  y: number;
}

export interface FleetBonus {
  attack: number;
  defense: number;
  speed: number;
  synergy: number; // Affects synergy bonuses
}

export interface Fleet {
  fleetId: string;
  playerId: string;
  name: string;
  level: number;
  formation: FleetFormation;
  ships: string[]; // Ship IDs
  flagship: string | null;
  totalPower: number;
  morale: number;
  experience: number;
  status: FleetStatus;
  lastBattleTime: number;
  currentLocation: FleetLocation;
}

export interface FleetLocation {
  sectorId: string;
  x: number;
  y: number;
  timestamp: number;
}

export interface FleetBattle {
  battleId: string;
  fleetId1: string;
  fleetId2: string;
  startTime: number;
  endTime: number;
  winner: string | null;
  casualtiesFleet1: number;
  casualtiesFleet2: number;
  experienceGained: number;
  rewards: { credits: number; experience: number };
}

export type FormationType = 'wedge' | 'line' | 'phalanx' | 'pincer' | 'echelon' | 'skirmish';
export type ShipRole = 'flagship' | 'support' | 'attack' | 'defense' | 'scout';
export type FleetStatus = 'ready' | 'damaged' | 'repairing' | 'traveling' | 'in-combat';

// FORMATIONS
export const FORMATION_WEDGE: FleetFormation = {
  formationId: 'form_wedge',
  name: 'Wedge Formation',
  type: 'wedge',
  shipPositions: [
    { slot: 0, role: 'flagship', bonusPercent: 15, x: 0, y: 0 },
    { slot: 1, role: 'attack', bonusPercent: 10, x: -50, y: 50 },
    { slot: 2, role: 'attack', bonusPercent: 10, x: 50, y: 50 },
    { slot: 3, role: 'support', bonusPercent: 8, x: -30, y: 100 },
    { slot: 4, role: 'support', bonusPercent: 8, x: 30, y: 100 },
  ],
  bonus: { attack: 25, defense: 15, speed: 10, synergy: 20 },
  minShips: 1,
  maxShips: 5,
  description: 'Aggressive formation focused on forward attack.',
};

export const FORMATION_LINE: FleetFormation = {
  formationId: 'form_line',
  name: 'Line Formation',
  type: 'line',
  shipPositions: [
    { slot: 0, role: 'flagship', bonusPercent: 12, x: 0, y: 0 },
    { slot: 1, role: 'attack', bonusPercent: 12, x: -100, y: 0 },
    { slot: 2, role: 'attack', bonusPercent: 12, x: 100, y: 0 },
    { slot: 3, role: 'defense', bonusPercent: 10, x: -150, y: 0 },
    { slot: 4, role: 'defense', bonusPercent: 10, x: 150, y: 0 },
  ],
  bonus: { attack: 15, defense: 30, speed: 5, synergy: 25 },
  minShips: 1,
  maxShips: 5,
  description: 'Balanced formation with good firing arcs and defense.',
};

export const FORMATION_PHALANX: FleetFormation = {
  formationId: 'form_phalanx',
  name: 'Phalanx Formation',
  type: 'phalanx',
  shipPositions: [
    { slot: 0, role: 'flagship', bonusPercent: 18, x: 0, y: 0 },
    { slot: 1, role: 'defense', bonusPercent: 15, x: -30, y: 30 },
    { slot: 2, role: 'defense', bonusPercent: 15, x: 30, y: 30 },
    { slot: 3, role: 'support', bonusPercent: 12, x: -50, y: 50 },
    { slot: 4, role: 'support', bonusPercent: 12, x: 50, y: 50 },
  ],
  bonus: { attack: 10, defense: 40, speed: -5, synergy: 30 },
  minShips: 1,
  maxShips: 5,
  description: 'Defensive formation prioritizing crew and ship protection.',
};

export const FORMATION_PINCER: FleetFormation = {
  formationId: 'form_pincer',
  name: 'Pincer Formation',
  type: 'pincer',
  shipPositions: [
    { slot: 0, role: 'flagship', bonusPercent: 14, x: 0, y: 0 },
    { slot: 1, role: 'attack', bonusPercent: 14, x: -80, y: -50 },
    { slot: 2, role: 'attack', bonusPercent: 14, x: 80, y: -50 },
    { slot: 3, role: 'scout', bonusPercent: 12, x: -100, y: -100 },
    { slot: 4, role: 'scout', bonusPercent: 12, x: 100, y: -100 },
  ],
  bonus: { attack: 35, defense: 15, speed: 15, synergy: 22 },
  minShips: 1,
  maxShips: 5,
  description: 'Flanking formation to attack enemies from multiple angles.',
};

export const FORMATION_ECHELON: FleetFormation = {
  formationId: 'form_echelon',
  name: 'Echelon Formation',
  type: 'echelon',
  shipPositions: [
    { slot: 0, role: 'flagship', bonusPercent: 13, x: 0, y: 0 },
    { slot: 1, role: 'attack', bonusPercent: 13, x: 60, y: 50 },
    { slot: 2, role: 'support', bonusPercent: 11, x: 120, y: 100 },
    { slot: 3, role: 'scout', bonusPercent: 11, x: -60, y: 50 },
    { slot: 4, role: 'support', bonusPercent: 11, x: -120, y: 100 },
  ],
  bonus: { attack: 20, defense: 20, speed: 20, synergy: 18 },
  minShips: 1,
  maxShips: 5,
  description: 'Balanced formation with excellent mobility.',
};

export const FORMATION_SKIRMISH: FleetFormation = {
  formationId: 'form_skirmish',
  name: 'Skirmish Formation',
  type: 'skirmish',
  shipPositions: [
    { slot: 0, role: 'flagship', bonusPercent: 10, x: 0, y: 0 },
    { slot: 1, role: 'scout', bonusPercent: 12, x: -100, y: -100 },
    { slot: 2, role: 'scout', bonusPercent: 12, x: 100, y: -100 },
    { slot: 3, role: 'scout', bonusPercent: 12, x: -150, y: 0 },
    { slot: 4, role: 'scout', bonusPercent: 12, x: 150, y: 0 },
  ],
  bonus: { attack: 15, defense: 10, speed: 40, synergy: 15 },
  minShips: 1,
  maxShips: 5,
  description: 'Fast, loose formation for hit-and-run tactics.',
};

export const ALL_FORMATIONS: FleetFormation[] = [
  FORMATION_WEDGE,
  FORMATION_LINE,
  FORMATION_PHALANX,
  FORMATION_PINCER,
  FORMATION_ECHELON,
  FORMATION_SKIRMISH,
];

export function getFormationById(formationId: string): FleetFormation | undefined {
  return ALL_FORMATIONS.find(f => f.formationId === formationId);
}

export function calculateFleetStats(fleet: Fleet): { attack: number; defense: number; speed: number } {
  const formation = fleet.formation;
  return {
    attack: Math.floor(fleet.totalPower * (1 + formation.bonus.attack / 100)),
    defense: Math.floor(fleet.totalPower * (1 + formation.bonus.defense / 100)),
    speed: Math.floor(100 * (1 + formation.bonus.speed / 100)),
  };
}

export function createFleet(playerId: string, name: string, flagship: string): Fleet {
  return {
    fleetId: `fleet_${playerId}_${Date.now()}`,
    playerId,
    name,
    level: 1,
    formation: FORMATION_WEDGE,
    ships: [flagship],
    flagship,
    totalPower: 1000,
    morale: 100,
    experience: 0,
    status: 'ready',
    lastBattleTime: 0,
    currentLocation: { sectorId: 'sector_home', x: 0, y: 0, timestamp: Date.now() },
  };
}

export function addShipToFleet(fleet: Fleet, shipId: string): boolean {
  if (fleet.ships.length >= 6) return false; // Max 6 ships per fleet
  fleet.ships.push(shipId);
  fleet.totalPower += 500; // Simplified power calculation
  return true;
}

export function removeShipFromFleet(fleet: Fleet, shipId: string): boolean {
  const index = fleet.ships.indexOf(shipId);
  if (index < 0) return false;
  fleet.ships.splice(index, 1);
  fleet.totalPower -= 500;
  return true;
}

export function setFleetFormation(fleet: Fleet, formationId: string): boolean {
  const formation = getFormationById(formationId);
  if (!formation) return false;
  if (fleet.ships.length < formation.minShips || fleet.ships.length > formation.maxShips) return false;
  fleet.formation = formation;
  return true;
}

export function updateFleetMorale(fleet: Fleet, delta: number): void {
  fleet.morale = Math.max(0, Math.min(100, fleet.morale + delta));
}

export function moveFleet(fleet: Fleet, sectorId: string, x: number, y: number): void {
  fleet.currentLocation = { sectorId, x, y, timestamp: Date.now() };
  fleet.status = 'traveling';
}

export function damageFleet(fleet: Fleet, damage: number): void {
  fleet.morale = Math.max(0, fleet.morale - (damage / 100));
  if (fleet.morale < 25) fleet.status = 'damaged';
}

export function repairFleet(fleet: Fleet): void {
  fleet.morale = Math.min(100, fleet.morale + 20);
  if (fleet.morale >= 50) fleet.status = 'ready';
}

export function getFleetStatistics(): { totalFleets: number; formations: number } {
  return {
    totalFleets: 0,
    formations: ALL_FORMATIONS.length,
  };
}
