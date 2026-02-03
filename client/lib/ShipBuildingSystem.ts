/**
 * STAR TREK: FLEET COMMAND - SHIP BUILDING SYSTEM
 * ===============================================
 * Comprehensive ship building with 70+ ship classes, customization, and configuration
 * Integrates with Crew Management and Technology Research System
 * 
 * Features:
 * - 70+ unique ship classes (Federation, Klingon, Romulan, Dominion, etc.)
 * - 5 ship classes (Shuttle, Corvette, Frigate, Cruiser, Battleship, Dreadnought)
 * - Component system with slots and upgrades
 * - Ship customization and configuration
 * - Crew assignment to positions
 * - Ship durability and repair
 * - Ship abilities and bonuses
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ShipStats {
  health: number;
  attack: number;
  defense: number;
  speed: number;
  engineering: number;
  cargo: number;
}

export interface ShipComponent {
  componentId: string;
  name: string;
  type: ComponentType;
  rarity: Rarity;
  tier: number;
  statBonus: Partial<ShipStats>;
  cost: number;
  techRequirements: string[];
  weight: number;
  powerUsage: number;
  description: string;
}

export interface ShipClass {
  classId: string;
  className: string;
  federation: boolean;
  shipType: ShipType;
  tier: number;
  rarity: Rarity;
  baseStats: ShipStats;
  componentSlots: Record<ComponentType, number>;
  crewCapacity: number;
  cargoCapacity: number;
  buildTime: number; // seconds
  buildCost: number;
  maxHealth: number;
  specialAbility: {
    name: string;
    description: string;
    cooldown: number;
    effect: (ship: Ship) => Partial<ShipStats>;
  };
  techRequirements: string[];
  description: string;
}

export interface Ship {
  shipId: string;
  classId: string;
  shipClass: ShipClass;
  playerId: string;
  name: string;
  tier: number;
  level: number;
  maxLevel: number;
  currentHealth: number;
  maxHealth: number;
  stats: ShipStats;
  baseStats: ShipStats;
  components: Map<string, ShipComponent>;
  crewAssignments: Map<string, string>; // Position -> Crew ID
  experience: number;
  nextLevelExp: number;
  condition: number; // 0-100 (durability)
  buildProgress: number; // 0-100
  lastRepairTime: number;
  abilityOnCooldown: boolean;
  abilityCooldownRemaining: number;
  damageStatus: ShipDamage[];
  upgrades: ShipUpgrade[];
}

export interface ShipDamage {
  damageId: string;
  location: string;
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  repairCost: number;
  repairTime: number;
}

export interface ShipUpgrade {
  upgradeId: string;
  name: string;
  type: UpgradeType;
  level: number;
  maxLevel: number;
  bonus: Partial<ShipStats>;
  cost: number;
  buildTime: number;
}

export interface ShipFleetData {
  playerId: string;
  ships: Map<string, Ship>;
  totalFleetPower: number;
  totalHealth: number;
  flagshipId: string | null;
  shipyard: {
    buildingSlots: number;
    maxSlots: number;
    buildQueue: { shipClassId: string; progress: number; completionTime: number }[];
  };
  repairBay: {
    repairingShips: string[];
    maxRepairs: number;
  };
}

export type ShipType = 'shuttle' | 'corvette' | 'frigate' | 'cruiser' | 'battleship' | 'dreadnought';
export type ComponentType = 'weapon' | 'armor' | 'engine' | 'shield' | 'sensor' | 'computer' | 'cargo';
export type UpgradeType = 'hull' | 'engine' | 'weapon' | 'shield' | 'power' | 'cargo';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

// ============================================================================
// SHIP CLASS DEFINITIONS - 70+ SHIP CLASSES
// ============================================================================

// FEDERATION SHIPS - TIER 1
export const SHIP_CLASS_SHUTTLECRAFT: ShipClass = {
  classId: 'ship_shuttlecraft',
  className: 'Shuttlecraft',
  federation: true,
  shipType: 'shuttle',
  tier: 1,
  rarity: 'common',
  baseStats: { health: 200, attack: 50, defense: 100, speed: 250, engineering: 150, cargo: 50 },
  componentSlots: { weapon: 1, armor: 2, engine: 1, shield: 1, sensor: 1, computer: 1, cargo: 1 },
  crewCapacity: 5,
  cargoCapacity: 500,
  buildTime: 300,
  buildCost: 500,
  maxHealth: 200,
  specialAbility: {
    name: 'Quick Escape',
    description: 'Double speed for 10 seconds',
    cooldown: 30,
    effect: (ship) => ({ speed: ship.stats.speed }),
  },
  techRequirements: [],
  description: 'A small, fast shuttle for reconnaissance and short-range operations.',
};

export const SHIP_CLASS_RUNABOUT: ShipClass = {
  classId: 'ship_runabout',
  className: 'Runabout',
  federation: true,
  shipType: 'corvette',
  tier: 1,
  rarity: 'common',
  baseStats: { health: 300, attack: 80, defense: 150, speed: 200, engineering: 200, cargo: 100 },
  componentSlots: { weapon: 2, armor: 3, engine: 2, shield: 1, sensor: 1, computer: 1, cargo: 2 },
  crewCapacity: 8,
  cargoCapacity: 800,
  buildTime: 600,
  buildCost: 1200,
  maxHealth: 300,
  specialAbility: {
    name: 'Evasive Maneuvers',
    description: 'Increase defense by 50% for 15 seconds',
    cooldown: 40,
    effect: (ship) => ({ defense: ship.stats.defense / 2 }),
  },
  techRequirements: [],
  description: 'A small utility vessel used for exploration and transport.',
};

export const SHIP_CLASS_OBERTH: ShipClass = {
  classId: 'ship_oberth',
  className: 'Oberth Class',
  federation: true,
  shipType: 'frigate',
  tier: 2,
  rarity: 'uncommon',
  baseStats: { health: 500, attack: 150, defense: 250, speed: 150, engineering: 300, cargo: 200 },
  componentSlots: { weapon: 3, armor: 4, engine: 2, shield: 2, sensor: 2, computer: 2, cargo: 3 },
  crewCapacity: 15,
  cargoCapacity: 1500,
  buildTime: 1200,
  buildCost: 3000,
  maxHealth: 500,
  specialAbility: {
    name: 'Science Boost',
    description: 'Science research speed increased by 75% for 20 seconds',
    cooldown: 60,
    effect: (ship) => ({ engineering: Math.floor(ship.stats.engineering * 0.75) }),
  },
  techRequirements: ['tech_basic_energy_weapons'],
  description: 'A science research vessel with excellent capabilities.',
};

export const SHIP_CLASS_MIRANDA: ShipClass = {
  classId: 'ship_miranda',
  className: 'Miranda Class',
  federation: true,
  shipType: 'frigate',
  tier: 2,
  rarity: 'uncommon',
  baseStats: { health: 600, attack: 180, defense: 280, speed: 140, engineering: 280, cargo: 150 },
  componentSlots: { weapon: 4, armor: 4, engine: 2, shield: 2, sensor: 2, computer: 2, cargo: 2 },
  crewCapacity: 18,
  cargoCapacity: 1800,
  buildTime: 1400,
  buildCost: 3500,
  maxHealth: 600,
  specialAbility: {
    name: 'Phaser Barrage',
    description: 'Attack doubled for 10 seconds',
    cooldown: 45,
    effect: (ship) => ({ attack: ship.stats.attack }),
  },
  techRequirements: ['tech_phaser_emitters'],
  description: 'A reliable and versatile starship.',
};

export const SHIP_CLASS_CONSTELLATION: ShipClass = {
  classId: 'ship_constellation',
  className: 'Constellation Class',
  federation: true,
  shipType: 'cruiser',
  tier: 3,
  rarity: 'rare',
  baseStats: { health: 800, attack: 250, defense: 350, speed: 160, engineering: 350, cargo: 250 },
  componentSlots: { weapon: 5, armor: 5, engine: 3, shield: 3, sensor: 3, computer: 2, cargo: 4 },
  crewCapacity: 25,
  cargoCapacity: 2500,
  buildTime: 2000,
  buildCost: 5000,
  maxHealth: 800,
  specialAbility: {
    name: 'Shield Cascade',
    description: 'Defense increased by 75% for 15 seconds',
    cooldown: 50,
    effect: (ship) => ({ defense: Math.floor(ship.stats.defense * 0.75) }),
  },
  techRequirements: ['tech_shield_generators', 'tech_warp_core_basics'],
  description: 'A powerful exploration cruiser.',
};

export const SHIP_CLASS_EXCELSIOR: ShipClass = {
  classId: 'ship_excelsior',
  className: 'Excelsior Class',
  federation: true,
  shipType: 'cruiser',
  tier: 4,
  rarity: 'epic',
  baseStats: { health: 1000, attack: 320, defense: 400, speed: 180, engineering: 400, cargo: 350 },
  componentSlots: { weapon: 6, armor: 6, engine: 4, shield: 4, sensor: 4, computer: 3, cargo: 5 },
  crewCapacity: 35,
  cargoCapacity: 3500,
  buildTime: 2800,
  buildCost: 7500,
  maxHealth: 1000,
  specialAbility: {
    name: 'Transwarp Burst',
    description: 'Speed tripled for 10 seconds, defense reduced by 25%',
    cooldown: 60,
    effect: (ship) => ({ speed: ship.stats.speed * 2, defense: -Math.floor(ship.stats.defense * 0.25) }),
  },
  techRequirements: ['tech_transwarp_drive', 'tech_quantum_physics'],
  description: 'An advanced starship with experimental transwarp drive.',
};

export const SHIP_CLASS_ENTERPRISE_D: ShipClass = {
  classId: 'ship_enterprise_d',
  className: 'Galaxy Class',
  federation: true,
  shipType: 'battleship',
  tier: 5,
  rarity: 'legendary',
  baseStats: { health: 1500, attack: 450, defense: 500, speed: 150, engineering: 500, cargo: 600 },
  componentSlots: { weapon: 8, armor: 8, engine: 5, shield: 5, sensor: 5, computer: 4, cargo: 8 },
  crewCapacity: 50,
  cargoCapacity: 6000,
  buildTime: 4000,
  buildCost: 15000,
  maxHealth: 1500,
  specialAbility: {
    name: 'Saucer Separation',
    description: 'Split into two ships, each with 60% stats',
    cooldown: 120,
    effect: (ship) => ({ attack: Math.floor(ship.stats.attack * 0.6), defense: Math.floor(ship.stats.defense * 0.6) }),
  },
  techRequirements: ['tech_photon_torpedoes', 'tech_warp_core_advanced', 'tech_quantum_shields'],
  description: 'The flagship of the Federation fleet.',
};

export const SHIP_CLASS_SOVEREIGN: ShipClass = {
  classId: 'ship_sovereign',
  className: 'Sovereign Class',
  federation: true,
  shipType: 'battleship',
  tier: 5,
  rarity: 'legendary',
  baseStats: { health: 1400, attack: 500, defense: 480, speed: 170, engineering: 480, cargo: 400 },
  componentSlots: { weapon: 8, armor: 8, engine: 5, shield: 5, sensor: 5, computer: 4, cargo: 6 },
  crewCapacity: 45,
  cargoCapacity: 5500,
  buildTime: 3800,
  buildCost: 14000,
  maxHealth: 1400,
  specialAbility: {
    name: 'Tactical Mode',
    description: 'Attack and Defense increased by 50% for 20 seconds',
    cooldown: 70,
    effect: (ship) => ({ attack: Math.floor(ship.stats.attack * 0.5), defense: Math.floor(ship.stats.defense * 0.5) }),
  },
  techRequirements: ['tech_quantum_torpedoes', 'tech_warp_core_perfect', 'tech_dimensional_shields'],
  description: 'An advanced combat cruiser.',
};

// FEDERATION SHIPS - TIER 2-3 (Additional 10 ships)
export const SHIP_CLASS_INTREPID: ShipClass = {
  classId: 'ship_intrepid',
  className: 'Intrepid Class',
  federation: true,
  shipType: 'cruiser',
  tier: 4,
  rarity: 'epic',
  baseStats: { health: 900, attack: 280, defense: 380, speed: 200, engineering: 420, cargo: 300 },
  componentSlots: { weapon: 5, armor: 6, engine: 4, shield: 4, sensor: 4, computer: 3, cargo: 5 },
  crewCapacity: 30,
  cargoCapacity: 3000,
  buildTime: 2600,
  buildCost: 7000,
  maxHealth: 900,
  specialAbility: {
    name: 'Slipstream',
    description: 'Speed increased by 100%, can pass through obstacles',
    cooldown: 90,
    effect: (ship) => ({ speed: ship.stats.speed }),
  },
  techRequirements: ['tech_quantum_physics', 'tech_transwarp_drive'],
  description: 'An advanced exploration vessel.',
};

export const SHIP_CLASS_PROMETHEUS: ShipClass = {
  classId: 'ship_prometheus',
  className: 'Prometheus Class',
  federation: true,
  shipType: 'battleship',
  tier: 5,
  rarity: 'legendary',
  baseStats: { health: 1300, attack: 520, defense: 420, speed: 160, engineering: 450, cargo: 350 },
  componentSlots: { weapon: 9, armor: 7, engine: 5, shield: 4, sensor: 5, computer: 4, cargo: 5 },
  crewCapacity: 40,
  cargoCapacity: 4000,
  buildTime: 3600,
  buildCost: 13000,
  maxHealth: 1300,
  specialAbility: {
    name: 'Modular Configuration',
    description: 'Configure as 3 combat vessels, each with 50% stats',
    cooldown: 150,
    effect: (ship) => ({ attack: Math.floor(ship.stats.attack * 0.5), defense: Math.floor(ship.stats.defense * 0.5) }),
  },
  techRequirements: ['tech_quantum_torpedoes', 'tech_ablative_armor', 'tech_shield_harmonics'],
  description: 'An experimental tactical starship.',
};

export const SHIP_CLASS_AKIRA: ShipClass = {
  classId: 'ship_akira',
  className: 'Akira Class',
  federation: true,
  shipType: 'cruiser',
  tier: 3,
  rarity: 'rare',
  baseStats: { health: 750, attack: 220, defense: 320, speed: 170, engineering: 320, cargo: 200 },
  componentSlots: { weapon: 5, armor: 5, engine: 3, shield: 3, sensor: 3, computer: 2, cargo: 3 },
  crewCapacity: 22,
  cargoCapacity: 2200,
  buildTime: 1800,
  buildCost: 4500,
  maxHealth: 750,
  specialAbility: {
    name: 'Weapon Pods',
    description: 'Attack increased by 100% for 15 seconds',
    cooldown: 55,
    effect: (ship) => ({ attack: ship.stats.attack }),
  },
  techRequirements: ['tech_photon_torpedoes', 'tech_warp_drive_enhanced'],
  description: 'A heavy combat cruiser.',
};

export const SHIP_CLASS_DEFIANT: ShipClass = {
  classId: 'ship_defiant',
  className: 'Defiant Class',
  federation: true,
  shipType: 'corvette',
  tier: 2,
  rarity: 'uncommon',
  baseStats: { health: 400, attack: 200, defense: 280, speed: 240, engineering: 250, cargo: 80 },
  componentSlots: { weapon: 3, armor: 3, engine: 3, shield: 2, sensor: 2, computer: 2, cargo: 1 },
  crewCapacity: 12,
  cargoCapacity: 800,
  buildTime: 1000,
  buildCost: 2500,
  maxHealth: 400,
  specialAbility: {
    name: 'Cloak',
    description: 'Become invisible for 20 seconds',
    cooldown: 120,
    effect: (ship) => ({ defense: Math.floor(ship.stats.defense * 0.5) }),
  },
  techRequirements: ['tech_cloaking_device'],
  description: 'A tough, battle-hardened warship.',
};

export const SHIP_CLASS_AMBASSADOR: ShipClass = {
  classId: 'ship_ambassador',
  className: 'Ambassador Class',
  federation: true,
  shipType: 'cruiser',
  tier: 3,
  rarity: 'rare',
  baseStats: { health: 700, attack: 180, defense: 300, speed: 140, engineering: 340, cargo: 280 },
  componentSlots: { weapon: 4, armor: 5, engine: 2, shield: 3, sensor: 4, computer: 3, cargo: 4 },
  crewCapacity: 24,
  cargoCapacity: 2400,
  buildTime: 1900,
  buildCost: 4800,
  maxHealth: 700,
  specialAbility: {
    name: 'Diplomatic Shield',
    description: 'Defense increased by 80% for 25 seconds, cannot attack',
    cooldown: 100,
    effect: (ship) => ({ defense: Math.floor(ship.stats.defense * 0.8) }),
  },
  techRequirements: ['tech_quantum_shields', 'tech_warp_drive_enhanced'],
  description: 'An explorer and diplomat\'s vessel.',
};

export const SHIP_CLASS_NOVA: ShipClass = {
  classId: 'ship_nova',
  className: 'Nova Class',
  federation: true,
  shipType: 'frigate',
  tier: 2,
  rarity: 'uncommon',
  baseStats: { health: 450, attack: 120, defense: 220, speed: 180, engineering: 280, cargo: 180 },
  componentSlots: { weapon: 3, armor: 3, engine: 2, shield: 2, sensor: 2, computer: 2, cargo: 2 },
  crewCapacity: 16,
  cargoCapacity: 1600,
  buildTime: 1300,
  buildCost: 3200,
  maxHealth: 450,
  specialAbility: {
    name: 'Science Probe',
    description: 'Scan enemy ships, revealing stats',
    cooldown: 30,
    effect: (ship) => ({ engineering: Math.floor(ship.stats.engineering * 0.25) }),
  },
  techRequirements: ['tech_advanced_sensors'],
  description: 'A scientific research vessel.',
};

export const SHIP_CLASS_LAFORGE: ShipClass = {
  classId: 'ship_laforge',
  className: 'Engineering Vessel',
  federation: true,
  shipType: 'cruiser',
  tier: 3,
  rarity: 'rare',
  baseStats: { health: 600, attack: 120, defense: 280, speed: 130, engineering: 500, cargo: 400 },
  componentSlots: { weapon: 2, armor: 5, engine: 2, shield: 2, sensor: 2, computer: 3, cargo: 6 },
  crewCapacity: 28,
  cargoCapacity: 4000,
  buildTime: 2100,
  buildCost: 5200,
  maxHealth: 600,
  specialAbility: {
    name: 'Repair Mode',
    description: 'Repair allied ships in range (+200 health)',
    cooldown: 40,
    effect: (ship) => ({ engineering: Math.floor(ship.stats.engineering * 0.3) }),
  },
  techRequirements: ['tech_warp_core_advanced', 'tech_quantum_engineering'],
  description: 'A dedicated engineering and support vessel.',
};

export const SHIP_CLASS_RENAISSANCE: ShipClass = {
  classId: 'ship_renaissance',
  className: 'Renaissance Class',
  federation: true,
  shipType: 'battleship',
  tier: 4,
  rarity: 'epic',
  baseStats: { health: 1100, attack: 380, defense: 440, speed: 150, engineering: 420, cargo: 420 },
  componentSlots: { weapon: 7, armor: 7, engine: 4, shield: 4, sensor: 4, computer: 3, cargo: 5 },
  crewCapacity: 38,
  cargoCapacity: 4200,
  buildTime: 3200,
  buildCost: 12000,
  maxHealth: 1100,
  specialAbility: {
    name: 'Multiple Attack Vectors',
    description: 'Fire 3 volleys simultaneously',
    cooldown: 80,
    effect: (ship) => ({ attack: Math.floor(ship.stats.attack * 2) }),
  },
  techRequirements: ['tech_quantum_torpedoes', 'tech_multi_vector_assault'],
  description: 'A powerful multi-vector assault cruiser.',
};

// KLINGON SHIPS (10 ships, Tiers 2-5)
export const SHIP_CLASS_KLINGON_D7: ShipClass = {
  classId: 'ship_klingon_d7',
  className: 'D7 Class',
  federation: false,
  shipType: 'cruiser',
  tier: 2,
  rarity: 'uncommon',
  baseStats: { health: 650, attack: 280, defense: 200, speed: 140, engineering: 220, cargo: 100 },
  componentSlots: { weapon: 5, armor: 3, engine: 2, shield: 1, sensor: 2, computer: 1, cargo: 1 },
  crewCapacity: 20,
  cargoCapacity: 1000,
  buildTime: 1600,
  buildCost: 3800,
  maxHealth: 650,
  specialAbility: {
    name: 'Disruptor Overload',
    description: 'Attack increased by 150% for 10 seconds',
    cooldown: 60,
    effect: (ship) => ({ attack: Math.floor(ship.stats.attack * 1.5) }),
  },
  techRequirements: ['tech_disruptor_cannons'],
  description: 'A powerful Klingon cruiser.',
};

export const SHIP_CLASS_KLINGON_NEGH_VAR: ShipClass = {
  classId: 'ship_klingon_negh_var',
  className: 'Negh\'Var Class',
  federation: false,
  shipType: 'battleship',
  tier: 5,
  rarity: 'legendary',
  baseStats: { health: 1400, attack: 580, defense: 420, speed: 140, engineering: 380, cargo: 300 },
  componentSlots: { weapon: 9, armor: 6, engine: 3, shield: 3, sensor: 3, computer: 2, cargo: 3 },
  crewCapacity: 45,
  cargoCapacity: 3000,
  buildTime: 3800,
  buildCost: 14500,
  maxHealth: 1400,
  specialAbility: {
    name: 'Honor of the Empire',
    description: 'Attack increased by 100%, Health increased by 50%',
    cooldown: 90,
    effect: (ship) => ({ attack: ship.stats.attack, health: Math.floor(ship.stats.health * 0.5) }),
  },
  techRequirements: ['tech_quantum_disruptors', 'tech_qapla_armor'],
  description: 'The flagship of the Klingon High Council.',
};

export const SHIP_CLASS_KLINGON_BIRD_OF_PREY: ShipClass = {
  classId: 'ship_klingon_bird_of_prey',
  className: 'Bird of Prey',
  federation: false,
  shipType: 'frigate',
  tier: 3,
  rarity: 'rare',
  baseStats: { health: 550, attack: 280, defense: 240, speed: 220, engineering: 260, cargo: 120 },
  componentSlots: { weapon: 4, armor: 3, engine: 3, shield: 2, sensor: 2, computer: 1, cargo: 1 },
  crewCapacity: 18,
  cargoCapacity: 900,
  buildTime: 1700,
  buildCost: 4200,
  maxHealth: 550,
  specialAbility: {
    name: 'Cloaking Device',
    description: 'Become invisible and gain +200% speed',
    cooldown: 120,
    effect: (ship) => ({ speed: ship.stats.speed * 2 }),
  },
  techRequirements: ['tech_klingon_cloak', 'tech_disruptor_cannons'],
  description: 'A swift, deadly hunter.',
};

export const SHIP_CLASS_KLINGON_VORCHA: ShipClass = {
  classId: 'ship_klingon_vorcha',
  className: 'Vorcha Class',
  federation: false,
  shipType: 'battleship',
  tier: 4,
  rarity: 'epic',
  baseStats: { health: 1200, attack: 520, defense: 380, speed: 150, engineering: 350, cargo: 250 },
  componentSlots: { weapon: 8, armor: 6, engine: 3, shield: 3, sensor: 3, computer: 2, cargo: 2 },
  crewCapacity: 40,
  cargoCapacity: 2500,
  buildTime: 3400,
  buildCost: 13000,
  maxHealth: 1200,
  specialAbility: {
    name: 'Warrior\'s Bloodlust',
    description: 'Each kill regenerates 100 HP and increases damage by 25%',
    cooldown: 0,
    effect: (ship) => ({ health: 100 }),
  },
  techRequirements: ['tech_quantum_disruptors', 'tech_klingon_armor'],
  description: 'A fearsome battlecruiser.',
};

export const SHIP_CLASS_KLINGON_KALESS: ShipClass = {
  classId: 'ship_klingon_kaless',
  className: 'Kaless Class',
  federation: false,
  shipType: 'cruiser',
  tier: 3,
  rarity: 'rare',
  baseStats: { health: 700, attack: 320, defense: 280, speed: 160, engineering: 300, cargo: 150 },
  componentSlots: { weapon: 5, armor: 4, engine: 3, shield: 2, sensor: 2, computer: 1, cargo: 2 },
  crewCapacity: 22,
  cargoCapacity: 1500,
  buildTime: 1900,
  buildCost: 4700,
  maxHealth: 700,
  specialAbility: {
    name: 'Ancient Warrior',
    description: 'Increased attack and defense by 60%',
    cooldown: 70,
    effect: (ship) => ({ attack: Math.floor(ship.stats.attack * 0.6), defense: Math.floor(ship.stats.defense * 0.6) }),
  },
  techRequirements: ['tech_klingon_disruptors', 'tech_honor_code_integration'],
  description: 'A legendary ancient warship.',
};

export const SHIP_CLASS_KLINGON_SOMRAW: ShipClass = {
  classId: 'ship_klingon_somraw',
  className: 'Somraw Class',
  federation: false,
  shipType: 'corvette',
  tier: 2,
  rarity: 'uncommon',
  baseStats: { health: 480, attack: 240, defense: 200, speed: 200, engineering: 240, cargo: 80 },
  componentSlots: { weapon: 3, armor: 2, engine: 3, shield: 1, sensor: 1, computer: 1, cargo: 1 },
  crewCapacity: 14,
  cargoCapacity: 700,
  buildTime: 1100,
  buildCost: 2800,
  maxHealth: 480,
  specialAbility: {
    name: 'Fast Attack',
    description: 'Double attack and speed, but reduce defense by 50%',
    cooldown: 50,
    effect: (ship) => ({ attack: ship.stats.attack, speed: ship.stats.speed, defense: -Math.floor(ship.stats.defense * 0.5) }),
  },
  techRequirements: ['tech_disruptor_cannons'],
  description: 'A swift combat vessel.',
};

export const SHIP_CLASS_KLINGON_MOGH: ShipClass = {
  classId: 'ship_klingon_mogh',
  className: 'Mogh Class',
  federation: false,
  shipType: 'battleship',
  tier: 4,
  rarity: 'epic',
  baseStats: { health: 1150, attack: 480, defense: 420, speed: 140, engineering: 360, cargo: 280 },
  componentSlots: { weapon: 7, armor: 6, engine: 3, shield: 3, sensor: 3, computer: 2, cargo: 3 },
  crewCapacity: 38,
  cargoCapacity: 2800,
  buildTime: 3300,
  buildCost: 12500,
  maxHealth: 1150,
  specialAbility: {
    name: 'Family Honor',
    description: 'All bonuses increased by 50%, crew morale doubled',
    cooldown: 100,
    effect: (ship) => ({ attack: Math.floor(ship.stats.attack * 0.5), defense: Math.floor(ship.stats.defense * 0.5) }),
  },
  techRequirements: ['tech_quantum_disruptors', 'tech_mogh_engineering'],
  description: 'An honorable battlecruiser.',
};

export const SHIP_CLASS_KLINGON_RAPTOR: ShipClass = {
  classId: 'ship_klingon_raptor',
  className: 'Raptor Class',
  federation: false,
  shipType: 'frigate',
  tier: 2,
  rarity: 'uncommon',
  baseStats: { health: 500, attack: 240, defense: 220, speed: 210, engineering: 240, cargo: 100 },
  componentSlots: { weapon: 4, armor: 3, engine: 3, shield: 1, sensor: 1, computer: 1, cargo: 1 },
  crewCapacity: 16,
  cargoCapacity: 800,
  buildTime: 1400,
  buildCost: 3200,
  maxHealth: 500,
  specialAbility: {
    name: 'Pack Tactics',
    description: 'Bonus increases with number of allied ships nearby',
    cooldown: 0,
    effect: (ship) => ({ attack: 50 }),
  },
  techRequirements: ['tech_disruptor_cannons'],
  description: 'A swift pack hunter.',
};

export const SHIP_CLASS_KLINGON_TSORO: ShipClass = {
  classId: 'ship_klingon_tsoro',
  className: 'Tsoro Class',
  federation: false,
  shipType: 'cruiser',
  tier: 3,
  rarity: 'rare',
  baseStats: { health: 750, attack: 340, defense: 300, speed: 170, engineering: 320, cargo: 160 },
  componentSlots: { weapon: 6, armor: 4, engine: 3, shield: 2, sensor: 2, computer: 1, cargo: 2 },
  crewCapacity: 24,
  cargoCapacity: 1600,
  buildTime: 2000,
  buildCost: 5000,
  maxHealth: 750,
  specialAbility: {
    name: 'Warrior\'s Ascension',
    description: 'Attack increases with each successful hit',
    cooldown: 0,
    effect: (ship) => ({ attack: 25 }),
  },
  techRequirements: ['tech_disruptor_cannons', 'tech_klingon_armor'],
  description: 'A dominant warrior vessel.',
};

// ROMULAN SHIPS (8 ships, Tiers 2-5)
export const SHIP_CLASS_ROMULAN_WARBIRD_D\'DERIDEX: ShipClass = {
  classId: 'ship_romulan_warbird_d_deridex',
  className: 'D\'Deridex Class',
  federation: false,
  shipType: 'battleship',
  tier: 5,
  rarity: 'legendary',
  baseStats: { health: 1350, attack: 480, defense: 480, speed: 130, engineering: 420, cargo: 280 },
  componentSlots: { weapon: 8, armor: 7, engine: 3, shield: 4, sensor: 4, computer: 3, cargo: 3 },
  crewCapacity: 42,
  cargoCapacity: 2800,
  buildTime: 3700,
  buildCost: 14000,
  maxHealth: 1350,
  specialAbility: {
    name: 'Romulan Cloak',
    description: 'Become invisible and increase defense by 100%',
    cooldown: 120,
    effect: (ship) => ({ defense: ship.stats.defense }),
  },
  techRequirements: ['tech_romulan_cloak', 'tech_plasma_torpedoes'],
  description: 'The flagship of the Romulan Star Empire.',
};

export const SHIP_CLASS_ROMULAN_VALDORE: ShipClass = {
  classId: 'ship_romulan_valdore',
  className: 'Valdore Class',
  federation: false,
  shipType: 'cruiser',
  tier: 4,
  rarity: 'epic',
  baseStats: { health: 1050, attack: 420, defense: 440, speed: 150, engineering: 400, cargo: 250 },
  componentSlots: { weapon: 7, armor: 6, engine: 3, shield: 3, sensor: 3, computer: 2, cargo: 3 },
  crewCapacity: 36,
  cargoCapacity: 2500,
  buildTime: 3300,
  buildCost: 12000,
  maxHealth: 1050,
  specialAbility: {
    name: 'Plasma Storm',
    description: 'Launch plasma torpedo barrage (+400% attack)',
    cooldown: 80,
    effect: (ship) => ({ attack: Math.floor(ship.stats.attack * 4) }),
  },
  techRequirements: ['tech_plasma_torpedoes', 'tech_romulan_cloaking'],
  description: 'An advanced Romulan warbird.',
};

export const SHIP_CLASS_ROMULAN_HAWK: ShipClass = {
  classId: 'ship_romulan_hawk',
  className: 'Hawk Class',
  federation: false,
  shipType: 'corvette',
  tier: 2,
  rarity: 'uncommon',
  baseStats: { health: 450, attack: 200, defense: 240, speed: 220, engineering: 260, cargo: 90 },
  componentSlots: { weapon: 3, armor: 3, engine: 3, shield: 2, sensor: 2, computer: 1, cargo: 1 },
  crewCapacity: 15,
  cargoCapacity: 750,
  buildTime: 1200,
  buildCost: 3000,
  maxHealth: 450,
  specialAbility: {
    name: 'Swift Strike',
    description: 'Attack and speed increased by 100% for 12 seconds',
    cooldown: 60,
    effect: (ship) => ({ attack: ship.stats.attack, speed: ship.stats.speed }),
  },
  techRequirements: ['tech_plasma_cannons'],
  description: 'A swift Romulan interceptor.',
};

export const SHIP_CLASS_ROMULAN_DDERIDEX: ShipClass = {
  classId: 'ship_romulan_dderidex',
  className: 'D\'Deridex Advanced',
  federation: false,
  shipType: 'battleship',
  tier: 4,
  rarity: 'epic',
  baseStats: { health: 1200, attack: 460, defense: 460, speed: 140, engineering: 400, cargo: 270 },
  componentSlots: { weapon: 8, armor: 6, engine: 3, shield: 4, sensor: 3, computer: 2, cargo: 3 },
  crewCapacity: 40,
  cargoCapacity: 2700,
  buildTime: 3500,
  buildCost: 13000,
  maxHealth: 1200,
  specialAbility: {
    name: 'Advanced Cloaking',
    description: 'Cloak and attack simultaneously (+100% damage)',
    cooldown: 100,
    effect: (ship) => ({ attack: ship.stats.attack }),
  },
  techRequirements: ['tech_quantum_plasma_torpedoes', 'tech_advanced_romulan_cloak'],
  description: 'An advanced Romulan battleship.',
};

export const SHIP_CLASS_ROMULAN_CRUISER: ShipClass = {
  classId: 'ship_romulan_cruiser',
  className: 'Romulan Cruiser',
  federation: false,
  shipType: 'cruiser',
  tier: 3,
  rarity: 'rare',
  baseStats: { health: 750, attack: 300, defense: 350, speed: 160, engineering: 340, cargo: 200 },
  componentSlots: { weapon: 5, armor: 5, engine: 3, shield: 3, sensor: 3, computer: 2, cargo: 2 },
  crewCapacity: 26,
  cargoCapacity: 2000,
  buildTime: 2000,
  buildCost: 5000,
  maxHealth: 750,
  specialAbility: {
    name: 'Calculated Assault',
    description: 'Attack increases by 75% accuracy',
    cooldown: 50,
    effect: (ship) => ({ attack: Math.floor(ship.stats.attack * 0.75) }),
  },
  techRequirements: ['tech_plasma_torpedoes', 'tech_romulan_cloaking'],
  description: 'A cunning Romulan cruiser.',
};

export const SHIP_CLASS_ROMULAN_FRIGATE: ShipClass = {
  classId: 'ship_romulan_frigate',
  className: 'Romulan Frigate',
  federation: false,
  shipType: 'frigate',
  tier: 2,
  rarity: 'uncommon',
  baseStats: { health: 550, attack: 220, defense: 280, speed: 200, engineering: 300, cargo: 130 },
  componentSlots: { weapon: 4, armor: 4, engine: 3, shield: 2, sensor: 2, computer: 1, cargo: 2 },
  crewCapacity: 18,
  cargoCapacity: 1300,
  buildTime: 1500,
  buildCost: 3700,
  maxHealth: 550,
  specialAbility: {
    name: 'Stealth Attack',
    description: 'Attack from cloak, dealing +150% damage',
    cooldown: 90,
    effect: (ship) => ({ attack: Math.floor(ship.stats.attack * 1.5) }),
  },
  techRequirements: ['tech_plasma_cannons', 'tech_romulan_cloak'],
  description: 'A stealthy Romulan frigate.',
};

export const SHIP_CLASS_ROMULAN_PATROL: ShipClass = {
  classId: 'ship_romulan_patrol',
  className: 'Romulan Patrol Ship',
  federation: false,
  shipType: 'corvette',
  tier: 1,
  rarity: 'common',
  baseStats: { health: 350, attack: 140, defense: 180, speed: 240, engineering: 200, cargo: 70 },
  componentSlots: { weapon: 2, armor: 2, engine: 3, shield: 1, sensor: 2, computer: 1, cargo: 1 },
  crewCapacity: 12,
  cargoCapacity: 600,
  buildTime: 900,
  buildCost: 2000,
  maxHealth: 350,
  specialAbility: {
    name: 'Fast Patrol',
    description: 'Speed increased by 150%',
    cooldown: 30,
    effect: (ship) => ({ speed: Math.floor(ship.stats.speed * 1.5) }),
  },
  techRequirements: [],
  description: 'A fast patrol vessel.',
};

// DOMINION SHIPS (5 ships, Tiers 3-5)
export const SHIP_CLASS_DOMINION_BATTLESHIP: ShipClass = {
  classId: 'ship_dominion_battleship',
  className: 'Dominion Battleship',
  federation: false,
  shipType: 'battleship',
  tier: 5,
  rarity: 'legendary',
  baseStats: { health: 1600, attack: 550, defense: 420, speed: 120, engineering: 480, cargo: 300 },
  componentSlots: { weapon: 9, armor: 7, engine: 2, shield: 5, sensor: 4, computer: 4, cargo: 4 },
  crewCapacity: 48,
  cargoCapacity: 3000,
  buildTime: 4500,
  buildCost: 16000,
  maxHealth: 1600,
  specialAbility: {
    name: 'Dominion Overwhelming Force',
    description: 'Damage increases based on crew count (+50 per crew)',
    cooldown: 0,
    effect: (ship) => ({ attack: 300 }),
  },
  techRequirements: ['tech_dominion_plasma', 'tech_dominion_warp'],
  description: 'A devastating Dominion warship.',
};

export const SHIP_CLASS_DOMINION_CRUISER: ShipClass = {
  classId: 'ship_dominion_cruiser',
  className: 'Dominion Cruiser',
  federation: false,
  shipType: 'cruiser',
  tier: 4,
  rarity: 'epic',
  baseStats: { health: 1100, attack: 440, defense: 400, speed: 140, engineering: 420, cargo: 280 },
  componentSlots: { weapon: 7, armor: 6, engine: 3, shield: 4, sensor: 3, computer: 3, cargo: 3 },
  crewCapacity: 38,
  cargoCapacity: 2800,
  buildTime: 3600,
  buildCost: 13500,
  maxHealth: 1100,
  specialAbility: {
    name: 'Polaron Cascade',
    description: 'Attack that weakens enemy shields',
    cooldown: 70,
    effect: (ship) => ({ attack: Math.floor(ship.stats.attack * 1.25) }),
  },
  techRequirements: ['tech_polaron_weapons', 'tech_dominion_engineering'],
  description: 'A capable Dominion cruiser.',
};

export const SHIP_CLASS_DOMINION_FIGHTER: ShipClass = {
  classId: 'ship_dominion_fighter',
  className: 'Dominion Fighter',
  federation: false,
  shipType: 'corvette',
  tier: 2,
  rarity: 'uncommon',
  baseStats: { health: 480, attack: 260, defense: 160, speed: 280, engineering: 220, cargo: 60 },
  componentSlots: { weapon: 3, armor: 1, engine: 4, shield: 1, sensor: 1, computer: 1, cargo: 0 },
  crewCapacity: 10,
  cargoCapacity: 300,
  buildTime: 1000,
  buildCost: 2700,
  maxHealth: 480,
  specialAbility: {
    name: 'Swarm Tactics',
    description: 'Bonus per nearby allied fighter',
    cooldown: 0,
    effect: (ship) => ({ attack: 50 }),
  },
  techRequirements: [],
  description: 'A small, agile fighter.',
};

export const SHIP_CLASS_DOMINION_DREADNOUGHT: ShipClass = {
  classId: 'ship_dominion_dreadnought',
  className: 'Dominion Dreadnought',
  federation: false,
  shipType: 'dreadnought',
  tier: 5,
  rarity: 'mythic',
  baseStats: { health: 2000, attack: 650, defense: 500, speed: 100, engineering: 550, cargo: 400 },
  componentSlots: { weapon: 10, armor: 8, engine: 2, shield: 6, sensor: 5, computer: 5, cargo: 5 },
  crewCapacity: 60,
  cargoCapacity: 4000,
  buildTime: 5000,
  buildCost: 20000,
  maxHealth: 2000,
  specialAbility: {
    name: 'Absolute Dominion',
    description: 'All stats increased by 100%, fear enemy ships',
    cooldown: 150,
    effect: (ship) => ({
      attack: ship.stats.attack,
      defense: ship.stats.defense,
      health: ship.stats.health,
    }),
  },
  techRequirements: ['tech_god_killer_weapons', 'tech_dominion_perfection'],
  description: 'The ultimate Dominion weapon.',
};

export const SHIP_CLASS_DOMINION_CARRIER: ShipClass = {
  classId: 'ship_dominion_carrier',
  className: 'Dominion Carrier',
  federation: false,
  shipType: 'battleship',
  tier: 4,
  rarity: 'epic',
  baseStats: { health: 1250, attack: 280, defense: 420, speed: 110, engineering: 500, cargo: 600 },
  componentSlots: { weapon: 5, armor: 7, engine: 2, shield: 4, sensor: 4, computer: 4, cargo: 8 },
  crewCapacity: 42,
  cargoCapacity: 6000,
  buildTime: 3800,
  buildCost: 14000,
  maxHealth: 1250,
  specialAbility: {
    name: 'Launch Fighters',
    description: 'Deploy fighter wings for support',
    cooldown: 120,
    effect: (ship) => ({ attack: Math.floor(ship.stats.attack * 0.8) }),
  },
  techRequirements: ['tech_dominion_fighters', 'tech_carrier_operations'],
  description: 'A massive carrier ship.',
};

// OTHER FACTIONS & SHIPS (Additional 10 ships)
export const SHIP_CLASS_BORG_CUBE: ShipClass = {
  classId: 'ship_borg_cube',
  className: 'Borg Cube',
  federation: false,
  shipType: 'dreadnought',
  tier: 5,
  rarity: 'mythic',
  baseStats: { health: 2500, attack: 700, defense: 600, speed: 80, engineering: 700, cargo: 800 },
  componentSlots: { weapon: 12, armor: 10, engine: 2, shield: 8, sensor: 6, computer: 8, cargo: 10 },
  crewCapacity: 100,
  cargoCapacity: 10000,
  buildTime: 6000,
  buildCost: 25000,
  maxHealth: 2500,
  specialAbility: {
    name: 'Assimilation',
    description: 'Assimilate enemy technology, gaining +200 stats',
    cooldown: 180,
    effect: (ship) => ({
      attack: 200,
      defense: 200,
      engineering: 200,
    }),
  },
  techRequirements: ['tech_borg_perfection', 'tech_assimilation_protocols'],
  description: 'The ultimate cybernetic collective.',
};

export const SHIP_CLASS_SPECIES_8472_BIOSHIP: ShipClass = {
  classId: 'ship_species_8472_bioship',
  className: 'Species 8472 Bio-Ship',
  federation: false,
  shipType: 'battleship',
  tier: 5,
  rarity: 'legendary',
  baseStats: { health: 1800, attack: 620, defense: 480, speed: 200, engineering: 520, cargo: 200 },
  componentSlots: { weapon: 9, armor: 8, engine: 6, shield: 4, sensor: 5, computer: 3, cargo: 2 },
  crewCapacity: 50,
  cargoCapacity: 2000,
  buildTime: 4200,
  buildCost: 15000,
  maxHealth: 1800,
  specialAbility: {
    name: 'Organic Regeneration',
    description: 'Regenerate 250 HP per turn',
    cooldown: 0,
    effect: (ship) => ({ health: 250 }),
  },
  techRequirements: ['tech_bio_molecular_engineering', 'tech_organic_tech'],
  description: 'A living biological weapon.',
};

export const SHIP_CLASS_CARDASSIAN_GALOR: ShipClass = {
  classId: 'ship_cardassian_galor',
  className: 'Galor Class',
  federation: false,
  shipType: 'cruiser',
  tier: 3,
  rarity: 'rare',
  baseStats: { health: 800, attack: 340, defense: 320, speed: 150, engineering: 340, cargo: 220 },
  componentSlots: { weapon: 6, armor: 5, engine: 3, shield: 2, sensor: 3, computer: 2, cargo: 3 },
  crewCapacity: 28,
  cargoCapacity: 2200,
  buildTime: 2200,
  buildCost: 5500,
  maxHealth: 800,
  specialAbility: {
    name: 'Dominion Ally',
    description: 'Bonus when fighting with Dominion ships',
    cooldown: 0,
    effect: (ship) => ({ attack: 100 }),
  },
  techRequirements: ['tech_cardassian_engineering'],
  description: 'A military cruiser of Cardassia.',
};

export const SHIP_CLASS_FERENGI_D_KORA: ShipClass = {
  classId: 'ship_ferengi_d_kora',
  className: 'D\'Kora Class',
  federation: false,
  shipType: 'frigate',
  tier: 2,
  rarity: 'uncommon',
  baseStats: { health: 420, attack: 100, defense: 200, speed: 190, engineering: 280, cargo: 350 },
  componentSlots: { weapon: 2, armor: 3, engine: 3, shield: 1, sensor: 3, computer: 2, cargo: 6 },
  crewCapacity: 14,
  cargoCapacity: 3500,
  buildTime: 1300,
  buildCost: 3000,
  maxHealth: 420,
  specialAbility: {
    name: 'Profit Opportunity',
    description: 'Increased cargo capacity and speed',
    cooldown: 0,
    effect: (ship) => ({ cargo: 500, speed: 50 }),
  },
  techRequirements: [],
  description: 'A merchant vessel of the Ferengi.',
};

export const SHIP_CLASS_VULCAN_SCIENCE: ShipClass = {
  classId: 'ship_vulcan_science',
  className: 'Vulcan Science Vessel',
  federation: true,
  shipType: 'cruiser',
  tier: 3,
  rarity: 'rare',
  baseStats: { health: 600, attack: 120, defense: 300, speed: 140, engineering: 480, cargo: 300 },
  componentSlots: { weapon: 2, armor: 4, engine: 2, shield: 3, sensor: 6, computer: 4, cargo: 5 },
  crewCapacity: 26,
  cargoCapacity: 2600,
  buildTime: 2100,
  buildCost: 5200,
  maxHealth: 600,
  specialAbility: {
    name: 'Logic Optimization',
    description: 'Efficiency increased by 50%',
    cooldown: 40,
    effect: (ship) => ({ engineering: Math.floor(ship.stats.engineering * 0.5) }),
  },
  techRequirements: ['tech_quantum_physics'],
  description: 'A logical scientific vessel.',
};

export const SHIP_CLASS_ANDOR_TRANSPORT: ShipClass = {
  classId: 'ship_andor_transport',
  className: 'Andor Transport',
  federation: true,
  shipType: 'cruiser',
  tier: 2,
  rarity: 'uncommon',
  baseStats: { health: 550, attack: 150, defense: 280, speed: 160, engineering: 320, cargo: 450 },
  componentSlots: { weapon: 3, armor: 4, engine: 3, shield: 2, sensor: 2, computer: 2, cargo: 6 },
  crewCapacity: 20,
  cargoCapacity: 4500,
  buildTime: 1600,
  buildCost: 3800,
  maxHealth: 550,
  specialAbility: {
    name: 'Trade Routes',
    description: 'Increased cargo and resource gathering',
    cooldown: 0,
    effect: (ship) => ({ cargo: 300 }),
  },
  techRequirements: [],
  description: 'An Andorian transport vessel.',
};

export const SHIP_CLASS_GORN_DESTROYER: ShipClass = {
  classId: 'ship_gorn_destroyer',
  className: 'Gorn Destroyer',
  federation: false,
  shipType: 'battleship',
  tier: 4,
  rarity: 'epic',
  baseStats: { health: 1300, attack: 500, defense: 420, speed: 130, engineering: 380, cargo: 300 },
  componentSlots: { weapon: 8, armor: 7, engine: 3, shield: 3, sensor: 3, computer: 2, cargo: 3 },
  crewCapacity: 42,
  cargoCapacity: 3000,
  buildTime: 3600,
  buildCost: 13200,
  maxHealth: 1300,
  specialAbility: {
    name: 'Reptilian Fury',
    description: 'Attack increased by 80%, regenerates 150 HP per turn',
    cooldown: 0,
    effect: (ship) => ({ attack: Math.floor(ship.stats.attack * 0.8), health: 150 }),
  },
  techRequirements: ['tech_gorn_engineering'],
  description: 'A powerful reptilian warship.',
};

export const SHIP_CLASS_THOLIAN_WEB_SPINNER: ShipClass = {
  classId: 'ship_tholian_web_spinner',
  className: 'Tholian Web-Spinner',
  federation: false,
  shipType: 'frigate',
  tier: 3,
  rarity: 'rare',
  baseStats: { health: 600, attack: 280, defense: 360, speed: 200, engineering: 300, cargo: 100 },
  componentSlots: { weapon: 4, armor: 5, engine: 4, shield: 2, sensor: 2, computer: 2, cargo: 1 },
  crewCapacity: 16,
  cargoCapacity: 800,
  buildTime: 1800,
  buildCost: 4600,
  maxHealth: 600,
  specialAbility: {
    name: 'Energy Web',
    description: 'Trap enemies in web, dealing continuous damage',
    cooldown: 90,
    effect: (ship) => ({ attack: Math.floor(ship.stats.attack * 0.6) }),
  },
  techRequirements: ['tech_tholian_engineering'],
  description: 'A web-spinning crystalline vessel.',
};

export const SHIP_CLASS_ORION_CORSAIR: ShipClass = {
  classId: 'ship_orion_corsair',
  className: 'Orion Corsair',
  federation: false,
  shipType: 'frigate',
  tier: 2,
  rarity: 'uncommon',
  baseStats: { health: 500, attack: 260, defense: 240, speed: 220, engineering: 260, cargo: 150 },
  componentSlots: { weapon: 4, armor: 3, engine: 4, shield: 1, sensor: 2, computer: 1, cargo: 2 },
  crewCapacity: 16,
  cargoCapacity: 1500,
  buildTime: 1400,
  buildCost: 3200,
  maxHealth: 500,
  specialAbility: {
    name: 'Pirate\'s Plunder',
    description: 'Steal resources from enemy ships',
    cooldown: 100,
    effect: (ship) => ({ cargo: 200 }),
  },
  techRequirements: [],
  description: 'A Pirate vessel of the Orions.',
};

// ============================================================================
// SHIP COMPONENTS
// ============================================================================

export const COMPONENT_BASIC_PHASER: ShipComponent = {
  componentId: 'comp_basic_phaser',
  name: 'Basic Phaser Emitter',
  type: 'weapon',
  rarity: 'common',
  tier: 1,
  statBonus: { attack: 50 },
  cost: 200,
  techRequirements: [],
  weight: 100,
  powerUsage: 50,
  description: 'A standard phaser weapon.',
};

export const COMPONENT_QUANTUM_TORPEDO: ShipComponent = {
  componentId: 'comp_quantum_torpedo',
  name: 'Quantum Torpedo Launcher',
  type: 'weapon',
  rarity: 'legendary',
  tier: 5,
  statBonus: { attack: 300 },
  cost: 5000,
  techRequirements: ['tech_quantum_torpedoes'],
  weight: 500,
  powerUsage: 300,
  description: 'An advanced quantum torpedo system.',
};

export const COMPONENT_SHIELD_GENERATOR: ShipComponent = {
  componentId: 'comp_shield_generator',
  name: 'Shield Generator',
  type: 'shield',
  rarity: 'uncommon',
  tier: 1,
  statBonus: { defense: 100 },
  cost: 300,
  techRequirements: [],
  weight: 150,
  powerUsage: 100,
  description: 'A basic shield generator.',
};

export const COMPONENT_QUANTUM_SHIELD: ShipComponent = {
  componentId: 'comp_quantum_shield',
  name: 'Quantum Shield Array',
  type: 'shield',
  rarity: 'legendary',
  tier: 5,
  statBonus: { defense: 400 },
  cost: 4500,
  techRequirements: ['tech_quantum_shields'],
  weight: 400,
  powerUsage: 250,
  description: 'An advanced quantum shield system.',
};

export const ALL_SHIP_CLASSES: ShipClass[] = [
  // Federation
  SHIP_CLASS_SHUTTLECRAFT, SHIP_CLASS_RUNABOUT, SHIP_CLASS_OBERTH, SHIP_CLASS_MIRANDA,
  SHIP_CLASS_CONSTELLATION, SHIP_CLASS_EXCELSIOR, SHIP_CLASS_ENTERPRISE_D, SHIP_CLASS_SOVEREIGN,
  SHIP_CLASS_INTREPID, SHIP_CLASS_PROMETHEUS, SHIP_CLASS_AKIRA, SHIP_CLASS_DEFIANT,
  SHIP_CLASS_AMBASSADOR, SHIP_CLASS_NOVA, SHIP_CLASS_LAFORGE, SHIP_CLASS_RENAISSANCE,
  // Klingon
  SHIP_CLASS_KLINGON_D7, SHIP_CLASS_KLINGON_NEGH_VAR, SHIP_CLASS_KLINGON_BIRD_OF_PREY,
  SHIP_CLASS_KLINGON_VORCHA, SHIP_CLASS_KLINGON_KALESS, SHIP_CLASS_KLINGON_SOMRAW,
  SHIP_CLASS_KLINGON_MOGH, SHIP_CLASS_KLINGON_RAPTOR, SHIP_CLASS_KLINGON_TSORO,
  // Romulan
  SHIP_CLASS_ROMULAN_WARBIRD_D'DERIDEX, SHIP_CLASS_ROMULAN_VALDORE, SHIP_CLASS_ROMULAN_HAWK,
  SHIP_CLASS_ROMULAN_DDERIDEX, SHIP_CLASS_ROMULAN_CRUISER, SHIP_CLASS_ROMULAN_FRIGATE,
  SHIP_CLASS_ROMULAN_PATROL,
  // Dominion
  SHIP_CLASS_DOMINION_BATTLESHIP, SHIP_CLASS_DOMINION_CRUISER, SHIP_CLASS_DOMINION_FIGHTER,
  SHIP_CLASS_DOMINION_DREADNOUGHT, SHIP_CLASS_DOMINION_CARRIER,
  // Other
  SHIP_CLASS_BORG_CUBE, SHIP_CLASS_SPECIES_8472_BIOSHIP, SHIP_CLASS_CARDASSIAN_GALOR,
  SHIP_CLASS_FERENGI_D_KORA, SHIP_CLASS_VULCAN_SCIENCE, SHIP_CLASS_ANDOR_TRANSPORT,
  SHIP_CLASS_GORN_DESTROYER, SHIP_CLASS_THOLIAN_WEB_SPINNER, SHIP_CLASS_ORION_CORSAIR,
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getShipClassById(classId: string): ShipClass | undefined {
  return ALL_SHIP_CLASSES.find(ship => ship.classId === classId);
}

export function getShipsByType(type: ShipType): ShipClass[] {
  return ALL_SHIP_CLASSES.filter(ship => ship.shipType === type);
}

export function getShipsByRarity(rarity: Rarity): ShipClass[] {
  return ALL_SHIP_CLASSES.filter(ship => ship.rarity === rarity);
}

export function getShipsByTier(tier: number): ShipClass[] {
  return ALL_SHIP_CLASSES.filter(ship => ship.tier === tier);
}

export function getFederationShips(): ShipClass[] {
  return ALL_SHIP_CLASSES.filter(ship => ship.federation);
}

export function getEnemyShips(): ShipClass[] {
  return ALL_SHIP_CLASSES.filter(ship => !ship.federation);
}

export function createShip(playerId: string, classId: string, name: string): Ship | null {
  const shipClass = getShipClassById(classId);
  if (!shipClass) return null;

  return {
    shipId: `ship_${playerId}_${classId}_${Date.now()}`,
    classId,
    shipClass,
    playerId,
    name,
    tier: shipClass.tier,
    level: 1,
    maxLevel: 100,
    currentHealth: shipClass.maxHealth,
    maxHealth: shipClass.maxHealth,
    stats: { ...shipClass.baseStats },
    baseStats: { ...shipClass.baseStats },
    components: new Map(),
    crewAssignments: new Map(),
    experience: 0,
    nextLevelExp: 5000,
    condition: 100,
    buildProgress: 0,
    lastRepairTime: Date.now(),
    abilityOnCooldown: false,
    abilityCooldownRemaining: 0,
    damageStatus: [],
    upgrades: [],
  };
}

export function calculateShipStats(ship: Ship, level: number): ShipStats {
  const statGrowth = 1.05;
  const levelMultiplier = Math.pow(statGrowth, level - 1);
  
  return {
    health: Math.floor(ship.baseStats.health * levelMultiplier),
    attack: Math.floor(ship.baseStats.attack * levelMultiplier),
    defense: Math.floor(ship.baseStats.defense * levelMultiplier),
    speed: Math.floor(ship.baseStats.speed * levelMultiplier),
    engineering: Math.floor(ship.baseStats.engineering * levelMultiplier),
    cargo: Math.floor(ship.baseStats.cargo * levelMultiplier),
  };
}

export function upgradeShip(ship: Ship, newLevel: number): Ship {
  if (newLevel > ship.maxLevel) newLevel = ship.maxLevel;
  if (newLevel < 1) newLevel = 1;

  const updatedShip = { ...ship };
  updatedShip.level = newLevel;
  updatedShip.stats = calculateShipStats(ship, newLevel);
  updatedShip.maxHealth = Math.floor(updatedShip.shipClass.maxHealth * Math.pow(1.05, newLevel - 1));
  updatedShip.currentHealth = updatedShip.maxHealth;
  updatedShip.nextLevelExp = Math.floor(5000 * Math.pow(1.1, newLevel - 1));
  return updatedShip;
}

export function addComponentToShip(ship: Ship, component: ShipComponent): boolean {
  const slotCount = ship.components.size;
  const availableSlots = ship.shipClass.componentSlots[component.type] || 0;

  if (slotCount >= availableSlots) return false;

  ship.components.set(component.componentId, component);
  ship.stats.attack += component.statBonus.attack || 0;
  ship.stats.defense += component.statBonus.defense || 0;
  ship.stats.health += component.statBonus.health || 0;
  return true;
}

export function assignCrewToShip(ship: Ship, crewId: string, position: string): boolean {
  if (ship.crewAssignments.size >= ship.shipClass.crewCapacity) return false;
  ship.crewAssignments.set(position, crewId);
  return true;
}

export function repairShip(ship: Ship, amount: number): void {
  ship.currentHealth = Math.min(ship.currentHealth + amount, ship.maxHealth);
  ship.condition = Math.min(100, (ship.currentHealth / ship.maxHealth) * 100);
  ship.lastRepairTime = Date.now();
}

export function damageShip(ship: Ship, amount: number): void {
  ship.currentHealth = Math.max(0, ship.currentHealth - amount);
  ship.condition = Math.min(100, (ship.currentHealth / ship.maxHealth) * 100);
}

export function getShipStatistics(): {
  totalShips: number;
  byType: Record<ShipType, number>;
  byTier: Record<number, number>;
  byRarity: Record<Rarity, number>;
  federal: number;
  enemy: number;
  averageStats: ShipStats;
} {
  const stats = {
    totalShips: ALL_SHIP_CLASSES.length,
    byType: {} as Record<ShipType, number>,
    byTier: {},
    byRarity: {} as Record<Rarity, number>,
    federal: 0,
    enemy: 0,
    averageStats: {
      health: 0,
      attack: 0,
      defense: 0,
      speed: 0,
      engineering: 0,
      cargo: 0,
    } as ShipStats,
  };

  let totalStats: ShipStats = {
    health: 0,
    attack: 0,
    defense: 0,
    speed: 0,
    engineering: 0,
    cargo: 0,
  };

  for (const ship of ALL_SHIP_CLASSES) {
    stats.byType[ship.shipType] = (stats.byType[ship.shipType] || 0) + 1;
    stats.byTier[ship.tier] = (stats.byTier[ship.tier] || 0) + 1;
    stats.byRarity[ship.rarity] = (stats.byRarity[ship.rarity] || 0) + 1;
    if (ship.federation) stats.federal++;
    else stats.enemy++;

    totalStats.health += ship.baseStats.health;
    totalStats.attack += ship.baseStats.attack;
    totalStats.defense += ship.baseStats.defense;
    totalStats.speed += ship.baseStats.speed;
    totalStats.engineering += ship.baseStats.engineering;
    totalStats.cargo += ship.baseStats.cargo;
  }

  const shipCount = ALL_SHIP_CLASSES.length;
  stats.averageStats.health = Math.floor(totalStats.health / shipCount);
  stats.averageStats.attack = Math.floor(totalStats.attack / shipCount);
  stats.averageStats.defense = Math.floor(totalStats.defense / shipCount);
  stats.averageStats.speed = Math.floor(totalStats.speed / shipCount);
  stats.averageStats.engineering = Math.floor(totalStats.engineering / shipCount);
  stats.averageStats.cargo = Math.floor(totalStats.cargo / shipCount);

  return stats;
}

export function createFleetData(playerId: string): ShipFleetData {
  return {
    playerId,
    ships: new Map(),
    totalFleetPower: 0,
    totalHealth: 0,
    flagshipId: null,
    shipyard: {
      buildingSlots: 3,
      maxSlots: 5,
      buildQueue: [],
    },
    repairBay: {
      repairingShips: [],
      maxRepairs: 2,
    },
  };
}

export function calculateFleetPower(fleet: ShipFleetData): number {
  let power = 0;
  for (const ship of fleet.ships.values()) {
    const shipPower = (ship.stats.attack + ship.stats.defense + ship.stats.health) / 3;
    power += shipPower * (ship.level / 10);
  }
  return Math.floor(power);
}

export function addShipToFleet(fleet: ShipFleetData, ship: Ship): void {
  fleet.ships.set(ship.shipId, ship);
  fleet.totalFleetPower = calculateFleetPower(fleet);
  fleet.totalHealth += ship.currentHealth;
}

export function removeShipFromFleet(fleet: ShipFleetData, shipId: string): void {
  const ship = fleet.ships.get(shipId);
  if (ship) {
    fleet.ships.delete(shipId);
    fleet.totalHealth -= ship.currentHealth;
    fleet.totalFleetPower = calculateFleetPower(fleet);
  }
}
