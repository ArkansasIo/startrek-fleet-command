/**
 * STAR TREK: FLEET COMMAND - CREW MANAGEMENT SYSTEM
 * ================================================
 * Comprehensive crew management with 80+ crew types, roles, skills, and progression
 * Integrates with Technology Research System and Combat System
 * 
 * Features:
 * - 80+ unique crew members with stats and abilities
 * - 5 crew roles (Captain, Engineer, Tactical, Science, Medical)
 * - Skill progression system with experience and leveling
 * - Crew synergies and bonuses
 * - Training and specialization
 * - Rarity system (Common to Mythic)
 * - Morale and fatigue mechanics
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CrewStats {
  health: number;
  attack: number;
  defense: number;
  engineering: number;
  science: number;
  leadership: number;
}

export interface CrewSkill {
  skillId: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  currentExp: number;
  expToNextLevel: number;
  bonus: {
    stat: keyof CrewStats;
    value: number;
    type: 'flat' | 'percentage';
  };
}

export interface CrewMember {
  crewId: string;
  name: string;
  title: string;
  role: CrewRole;
  species: string;
  rarity: Rarity;
  tier: number;
  level: number;
  maxLevel: number;
  stats: CrewStats;
  baseStats: CrewStats;
  skills: CrewSkill[];
  traits: string[];
  experience: number;
  nextLevelExp: number;
  morale: number;
  fatigue: number;
  assignedShipId: string | null;
  position: CrewPosition | null;
  activeEffects: StatusEffect[];
  trainedTechs: string[]; // IDs of techs this crew is trained in
  trainingProgress: Map<string, number>; // Tech ID to progress %
  availabilityDate: number; // Timestamp when crew becomes available
  cooldownRemaining: number;
}

export interface CrewPosition {
  positionId: string;
  shipId: string;
  role: CrewRole;
  statBonus: Partial<CrewStats>;
  isLeaderPosition: boolean;
}

export interface StatusEffect {
  effectId: string;
  name: string;
  type: 'buff' | 'debuff';
  statMods: Partial<CrewStats>;
  duration: number;
  startTime: number;
}

export interface CrewTraining {
  trainingId: string;
  crewId: string;
  techId: string;
  progress: number;
  startTime: number;
  estimatedCompleteTime: number;
  bonusMultiplier: number;
}

export interface CrewSynergy {
  synergyId: string;
  name: string;
  description: string;
  requiredCrewIds: string[];
  requiredRoles: CrewRole[];
  bonus: {
    stat: keyof CrewStats;
    value: number;
  }[];
  stackable: boolean;
}

export interface CrewRosterData {
  playerId: string;
  crewMembers: Map<string, CrewMember>;
  synergies: CrewSynergy[];
  activeSynergies: string[];
  totalExp: number;
  totalMorale: number;
  assignmentEfficiency: number;
  trainingQueue: CrewTraining[];
}

export type CrewRole = 'captain' | 'engineer' | 'tactical' | 'science' | 'medical';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

// ============================================================================
// CREW DEFINITIONS - 80+ CREW MEMBERS
// ============================================================================

// TIER 1 - COMMON & UNCOMMON (10 Crew)
export const CREW_JAMES_KIRK: CrewMember = {
  crewId: 'crew_james_kirk',
  name: 'James T. Kirk',
  title: 'Legendary Captain',
  role: 'captain',
  species: 'Human',
  rarity: 'legendary',
  tier: 5,
  level: 1,
  maxLevel: 100,
  stats: { health: 850, attack: 580, defense: 450, engineering: 320, science: 420, leadership: 950 },
  baseStats: { health: 850, attack: 580, defense: 450, engineering: 320, science: 420, leadership: 950 },
  skills: [],
  traits: ['Commanding Presence', 'Tactical Genius', 'Charismatic', 'Inspiring Leader'],
  experience: 0,
  nextLevelExp: 5000,
  morale: 100,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_SPOCK: CrewMember = {
  crewId: 'crew_spock',
  name: 'Spock',
  title: 'Science Officer',
  role: 'science',
  species: 'Vulcan',
  rarity: 'legendary',
  tier: 5,
  level: 1,
  maxLevel: 100,
  stats: { health: 650, attack: 380, defense: 400, engineering: 780, science: 950, leadership: 520 },
  baseStats: { health: 650, attack: 380, defense: 400, engineering: 780, science: 950, leadership: 520 },
  skills: [],
  traits: ['Logical Mind', 'Scientific Expert', 'Telepathic', 'Unflappable'],
  experience: 0,
  nextLevelExp: 5000,
  morale: 85,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_LEONARD_MCCOY: CrewMember = {
  crewId: 'crew_leonard_mccoy',
  name: 'Leonard H. McCoy',
  title: 'Chief Medical Officer',
  role: 'medical',
  species: 'Human',
  rarity: 'legendary',
  tier: 4,
  level: 1,
  maxLevel: 100,
  stats: { health: 750, attack: 420, defense: 520, engineering: 380, science: 680, leadership: 620 },
  baseStats: { health: 750, attack: 420, defense: 520, engineering: 380, science: 680, leadership: 620 },
  skills: [],
  traits: ['Medical Genius', 'Compassionate', 'Daring', 'Intuitive'],
  experience: 0,
  nextLevelExp: 4800,
  morale: 90,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_SCOTTY: CrewMember = {
  crewId: 'crew_scotty',
  name: 'Montgomery Scott',
  title: 'Chief Engineer',
  role: 'engineer',
  species: 'Human',
  rarity: 'legendary',
  tier: 4,
  level: 1,
  maxLevel: 100,
  stats: { health: 700, attack: 350, defense: 480, engineering: 950, science: 580, leadership: 480 },
  baseStats: { health: 700, attack: 350, defense: 480, engineering: 950, science: 580, leadership: 480 },
  skills: [],
  traits: ['Engineering Miracle Worker', 'Loyal', 'Dedicated', 'Ingenious'],
  experience: 0,
  nextLevelExp: 4800,
  morale: 95,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_UHURA: CrewMember = {
  crewId: 'crew_uhura',
  name: 'Uhura',
  title: 'Communications Officer',
  role: 'tactical',
  species: 'Human',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 650, attack: 480, defense: 520, engineering: 480, science: 650, leadership: 580 },
  baseStats: { health: 650, attack: 480, defense: 520, engineering: 480, science: 650, leadership: 580 },
  skills: [],
  traits: ['Master Communicator', 'Multilingual', 'Strategic Thinker', 'Resourceful'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 88,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_SULU: CrewMember = {
  crewId: 'crew_sulu',
  name: 'Hikaru Sulu',
  title: 'Helmsman',
  role: 'tactical',
  species: 'Human',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 680, attack: 520, defense: 580, engineering: 520, science: 480, leadership: 520 },
  baseStats: { health: 680, attack: 520, defense: 580, engineering: 520, science: 480, leadership: 520 },
  skills: [],
  traits: ['Master Helmsman', 'Precise', 'Calm Under Pressure', 'Expert Pilot'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 92,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_CHEKOV: CrewMember = {
  crewId: 'crew_chekov',
  name: 'Pavel A. Chekov',
  title: 'Navigation Officer',
  role: 'science',
  species: 'Human',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 620, attack: 420, defense: 450, engineering: 680, science: 750, leadership: 420 },
  baseStats: { health: 620, attack: 420, defense: 450, engineering: 680, science: 750, leadership: 420 },
  skills: [],
  traits: ['Mathematical Genius', 'Enthusiastic', 'Quick-Witted', 'Technical Expert'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 85,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_JEAN_LUC_PICARD: CrewMember = {
  crewId: 'crew_jean_luc_picard',
  name: 'Jean-Luc Picard',
  title: 'Legendary Captain',
  role: 'captain',
  species: 'Human',
  rarity: 'legendary',
  tier: 5,
  level: 1,
  maxLevel: 100,
  stats: { health: 800, attack: 520, defense: 600, engineering: 480, science: 720, leadership: 980 },
  baseStats: { health: 800, attack: 520, defense: 600, engineering: 480, science: 720, leadership: 980 },
  skills: [],
  traits: ['Diplomatic Master', 'Intellectual', 'Diplomatic Genius', 'Honorable'],
  experience: 0,
  nextLevelExp: 5000,
  morale: 100,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_DATA: CrewMember = {
  crewId: 'crew_data',
  name: 'Data',
  title: 'Android Officer',
  role: 'science',
  species: 'Android',
  rarity: 'legendary',
  tier: 4,
  level: 1,
  maxLevel: 100,
  stats: { health: 820, attack: 650, defense: 700, engineering: 880, science: 950, leadership: 420 },
  baseStats: { health: 820, attack: 650, defense: 700, engineering: 880, science: 950, leadership: 420 },
  skills: [],
  traits: ['Superhuman Intelligence', 'Perfect Memory', 'Superhuman Strength', 'Analytical'],
  experience: 0,
  nextLevelExp: 4800,
  morale: 80,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_WORF: CrewMember = {
  crewId: 'crew_worf',
  name: 'Worf',
  title: 'Tactical Officer',
  role: 'tactical',
  species: 'Klingon',
  rarity: 'legendary',
  tier: 4,
  level: 1,
  maxLevel: 100,
  stats: { health: 950, attack: 850, defense: 820, engineering: 520, science: 480, leadership: 680 },
  baseStats: { health: 950, attack: 850, defense: 820, engineering: 520, science: 480, leadership: 680 },
  skills: [],
  traits: ['Warrior Strength', 'Honor Bound', 'Fearless', 'Master of Weapons'],
  experience: 0,
  nextLevelExp: 4800,
  morale: 90,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

// TIER 2 - RARE & EPIC (20 Crew)
export const CREW_BENJAMIN_SISKO: CrewMember = {
  crewId: 'crew_benjamin_sisko',
  name: 'Benjamin Sisko',
  title: 'Station Commander',
  role: 'captain',
  species: 'Human',
  rarity: 'legendary',
  tier: 5,
  level: 1,
  maxLevel: 100,
  stats: { health: 820, attack: 550, defense: 580, engineering: 520, science: 680, leadership: 960 },
  baseStats: { health: 820, attack: 550, defense: 580, engineering: 520, science: 680, leadership: 960 },
  skills: [],
  traits: ['Prophetic Connection', 'Strategic Mind', 'Diplomatic', 'Spiritual'],
  experience: 0,
  nextLevelExp: 5000,
  morale: 95,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_KIRA_NERYS: CrewMember = {
  crewId: 'crew_kira_nerys',
  name: 'Kira Nerys',
  title: 'Major',
  role: 'tactical',
  species: 'Bajoran',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 750, attack: 680, defense: 650, engineering: 480, science: 520, leadership: 720 },
  baseStats: { health: 750, attack: 680, defense: 650, engineering: 480, science: 520, leadership: 720 },
  skills: [],
  traits: ['Combat Expert', 'Strategic', 'Determined', 'Spiritual'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 88,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_ODO: CrewMember = {
  crewId: 'crew_odo',
  name: 'Odo',
  title: 'Security Chief',
  role: 'tactical',
  species: 'Changeling',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 880, attack: 720, defense: 820, engineering: 380, science: 480, leadership: 640 },
  baseStats: { health: 880, attack: 720, defense: 820, engineering: 380, science: 480, leadership: 640 },
  skills: [],
  traits: ['Shape-Shifter', 'Investigator', 'Strict', 'Just'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 85,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_JADZIA_DAX: CrewMember = {
  crewId: 'crew_jadzia_dax',
  name: 'Jadzia Dax',
  title: 'Science Officer',
  role: 'science',
  species: 'Trill',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 680, attack: 520, defense: 580, engineering: 720, science: 880, leadership: 580 },
  baseStats: { health: 680, attack: 520, defense: 580, engineering: 720, science: 880, leadership: 580 },
  skills: [],
  traits: ['Ancient Knowledge', 'Scientist', 'Adventurous', 'Joined Symbiont'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 90,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_JULIAN_BASHIR: CrewMember = {
  crewId: 'crew_julian_bashir',
  name: 'Julian Bashir',
  title: 'Chief Medical Officer',
  role: 'medical',
  species: 'Human',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 650, attack: 420, defense: 520, engineering: 620, science: 820, leadership: 520 },
  baseStats: { health: 650, attack: 420, defense: 520, engineering: 620, science: 820, leadership: 520 },
  skills: [],
  traits: ['Brilliant Physician', 'Genetic Enhancement', 'Charming', 'Confident'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 85,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_MILES_OBRIEN: CrewMember = {
  crewId: 'crew_miles_obrien',
  name: 'Miles O\'Brien',
  title: 'Chief Engineer',
  role: 'engineer',
  species: 'Human',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 720, attack: 480, defense: 580, engineering: 920, science: 620, leadership: 580 },
  baseStats: { health: 720, attack: 480, defense: 580, engineering: 920, science: 620, leadership: 580 },
  skills: [],
  traits: ['Engineering Master', 'Reliable', 'Family Man', 'Resourceful'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 90,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_KATHRYN_JANEWAY: CrewMember = {
  crewId: 'crew_kathryn_janeway',
  name: 'Kathryn Janeway',
  title: 'Captain',
  role: 'captain',
  species: 'Human',
  rarity: 'legendary',
  tier: 5,
  level: 1,
  maxLevel: 100,
  stats: { health: 800, attack: 580, defense: 620, engineering: 520, science: 720, leadership: 970 },
  baseStats: { health: 800, attack: 580, defense: 620, engineering: 520, science: 720, leadership: 970 },
  skills: [],
  traits: ['Determined Leader', 'Strategic Genius', 'Coffee Lover', 'Uncompromising'],
  experience: 0,
  nextLevelExp: 5000,
  morale: 92,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_TUVOK: CrewMember = {
  crewId: 'crew_tuvok',
  name: 'Tuvok',
  title: 'Security Chief',
  role: 'tactical',
  species: 'Vulcan',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 750, attack: 680, defense: 720, engineering: 580, science: 780, leadership: 580 },
  baseStats: { health: 750, attack: 680, defense: 720, engineering: 580, science: 780, leadership: 580 },
  skills: [],
  traits: ['Tactical Genius', 'Logical', 'Professional', 'Disciplined'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 88,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_SEVEN_OF_NINE: CrewMember = {
  crewId: 'crew_seven_of_nine',
  name: 'Seven of Nine',
  title: 'Science Officer',
  role: 'science',
  species: 'Human (Borg)',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 820, attack: 680, defense: 720, engineering: 820, science: 920, leadership: 420 },
  baseStats: { health: 820, attack: 680, defense: 720, engineering: 820, science: 920, leadership: 420 },
  skills: [],
  traits: ['Borg Knowledge', 'Superhuman Intellect', 'Perfectionistic', 'Efficient'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 75,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_NEELIX: CrewMember = {
  crewId: 'crew_neelix',
  name: 'Neelix',
  title: 'Morale Officer',
  role: 'captain',
  species: 'Talaxian',
  rarity: 'rare',
  tier: 2,
  level: 1,
  maxLevel: 100,
  stats: { health: 580, attack: 350, defense: 420, engineering: 380, science: 520, leadership: 720 },
  baseStats: { health: 580, attack: 350, defense: 420, engineering: 380, science: 520, leadership: 720 },
  skills: [],
  traits: ['Enthusiastic', 'Culinary Expert', 'Protective', 'Expressive'],
  experience: 0,
  nextLevelExp: 4200,
  morale: 95,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_JONATHAN_ARCHER: CrewMember = {
  crewId: 'crew_jonathan_archer',
  name: 'Jonathan Archer',
  title: 'Commander',
  role: 'captain',
  species: 'Human',
  rarity: 'legendary',
  tier: 4,
  level: 1,
  maxLevel: 100,
  stats: { health: 780, attack: 560, defense: 580, engineering: 620, science: 680, leadership: 920 },
  baseStats: { health: 780, attack: 560, defense: 580, engineering: 620, science: 680, leadership: 920 },
  skills: [],
  traits: ['Pioneer Spirit', 'Diplomatic', 'Determined', 'Explorer'],
  experience: 0,
  nextLevelExp: 4800,
  morale: 93,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_T_POL: CrewMember = {
  crewId: 'crew_tpol',
  name: 'T\'Pol',
  title: 'Subcommander',
  role: 'science',
  species: 'Vulcan',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 680, attack: 420, defense: 520, engineering: 780, science: 920, leadership: 580 },
  baseStats: { health: 680, attack: 420, defense: 520, engineering: 780, science: 920, leadership: 580 },
  skills: [],
  traits: ['Logical', 'Diplomatic', 'Composed', 'Experienced'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 85,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_HOSHI_SATO: CrewMember = {
  crewId: 'crew_hoshi_sato',
  name: 'Hoshi Sato',
  title: 'Communications Officer',
  role: 'tactical',
  species: 'Human',
  rarity: 'rare',
  tier: 2,
  level: 1,
  maxLevel: 100,
  stats: { health: 620, attack: 420, defense: 480, engineering: 580, science: 720, leadership: 580 },
  baseStats: { health: 620, attack: 420, defense: 480, engineering: 580, science: 720, leadership: 580 },
  skills: [],
  traits: ['Linguist', 'Brave', 'Quick Learner', 'Perfectionist'],
  experience: 0,
  nextLevelExp: 4200,
  morale: 88,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_MALCOLM_REED: CrewMember = {
  crewId: 'crew_malcolm_reed',
  name: 'Malcolm Reed',
  title: 'Tactical Officer',
  role: 'tactical',
  species: 'Human',
  rarity: 'rare',
  tier: 2,
  level: 1,
  maxLevel: 100,
  stats: { health: 720, attack: 680, defense: 680, engineering: 520, science: 480, leadership: 520 },
  baseStats: { health: 720, attack: 680, defense: 680, engineering: 520, science: 480, leadership: 520 },
  skills: [],
  traits: ['Weapons Expert', 'Military Background', 'Strategic', 'Loyal'],
  experience: 0,
  nextLevelExp: 4200,
  morale: 90,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_TRAVIS_MAYWEATHER: CrewMember = {
  crewId: 'crew_travis_mayweather',
  name: 'Travis Mayweather',
  title: 'Helmsman',
  role: 'tactical',
  species: 'Human',
  rarity: 'rare',
  tier: 2,
  level: 1,
  maxLevel: 100,
  stats: { health: 680, attack: 580, defense: 580, engineering: 620, science: 520, leadership: 480 },
  baseStats: { health: 680, attack: 580, defense: 580, engineering: 620, science: 520, leadership: 480 },
  skills: [],
  traits: ['Master Pilot', 'Space-Born', 'Adventurous', 'Skilled'],
  experience: 0,
  nextLevelExp: 4200,
  morale: 90,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_DOCTOR_PHLOX: CrewMember = {
  crewId: 'crew_doctor_phlox',
  name: 'Dr. Phlox',
  title: 'Chief Medical Officer',
  role: 'medical',
  species: 'Denobulan',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 720, attack: 380, defense: 520, engineering: 680, science: 820, leadership: 620 },
  baseStats: { health: 720, attack: 380, defense: 520, engineering: 680, science: 820, leadership: 620 },
  skills: [],
  traits: ['Medical Genius', 'Polymath', 'Curious', 'Compassionate'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 92,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_JAMES_T_KIRK_ALTERNATE: CrewMember = {
  crewId: 'crew_kirk_alternate',
  name: 'Kirk (Alternate Timeline)',
  title: 'Captain',
  role: 'captain',
  species: 'Human',
  rarity: 'legendary',
  tier: 5,
  level: 1,
  maxLevel: 100,
  stats: { health: 880, attack: 620, defense: 520, engineering: 380, science: 480, leadership: 920 },
  baseStats: { health: 880, attack: 620, defense: 520, engineering: 380, science: 480, leadership: 920 },
  skills: [],
  traits: ['Reckless Genius', 'Charismatic', 'Aggressive', 'Passionate'],
  experience: 0,
  nextLevelExp: 5000,
  morale: 98,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

// TIER 3 - RARE (15 Crew)
export const CREW_DEANNA_TROI: CrewMember = {
  crewId: 'crew_deanna_troi',
  name: 'Deanna Troi',
  title: 'Counselor',
  role: 'science',
  species: 'Betazoid',
  rarity: 'rare',
  tier: 2,
  level: 1,
  maxLevel: 100,
  stats: { health: 620, attack: 380, defense: 480, engineering: 480, science: 820, leadership: 780 },
  baseStats: { health: 620, attack: 380, defense: 480, engineering: 480, science: 820, leadership: 780 },
  skills: [],
  traits: ['Telepath', 'Counselor', 'Intuitive', 'Empathetic'],
  experience: 0,
  nextLevelExp: 4200,
  morale: 88,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_GEORDI_LA_FORGE: CrewMember = {
  crewId: 'crew_geordi_la_forge',
  name: 'Geordi La Forge',
  title: 'Chief Engineer',
  role: 'engineer',
  species: 'Human',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 720, attack: 480, defense: 580, engineering: 950, science: 720, leadership: 620 },
  baseStats: { health: 720, attack: 480, defense: 580, engineering: 950, science: 720, leadership: 620 },
  skills: [],
  traits: ['Engineering Expert', 'Visor Vision', 'Optimist', 'Innovative'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 90,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_BEVERLY_CRUSHER: CrewMember = {
  crewId: 'crew_beverly_crusher',
  name: 'Beverly Crusher',
  title: 'Chief Medical Officer',
  role: 'medical',
  species: 'Human',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 680, attack: 420, defense: 580, engineering: 520, science: 880, leadership: 720 },
  baseStats: { health: 680, attack: 420, defense: 580, engineering: 520, science: 880, leadership: 720 },
  skills: [],
  traits: ['Medical Expert', 'Widow', 'Strong', 'Dedicated'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 88,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_WILLIAM_RIKER: CrewMember = {
  crewId: 'crew_william_riker',
  name: 'William T. Riker',
  title: 'First Officer',
  role: 'captain',
  species: 'Human',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 750, attack: 620, defense: 620, engineering: 580, science: 620, leadership: 820 },
  baseStats: { health: 750, attack: 620, defense: 620, engineering: 580, science: 620, leadership: 820 },
  skills: [],
  traits: ['First Officer', 'Charming', 'Beard', 'Diplomatic'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 92,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_GUINAN: CrewMember = {
  crewId: 'crew_guinan',
  name: 'Guinan',
  title: 'Bartender',
  role: 'science',
  species: 'El Aurian',
  rarity: 'rare',
  tier: 2,
  level: 1,
  maxLevel: 100,
  stats: { health: 680, attack: 420, defense: 520, engineering: 480, science: 820, leadership: 880 },
  baseStats: { health: 680, attack: 420, defense: 520, engineering: 480, science: 820, leadership: 880 },
  skills: [],
  traits: ['Wise', 'Ancient Being', 'Listener', 'Powerful'],
  experience: 0,
  nextLevelExp: 4200,
  morale: 90,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_Q: CrewMember = {
  crewId: 'crew_q',
  name: 'Q',
  title: 'Omnipotent Being',
  role: 'captain',
  species: 'Q',
  rarity: 'mythic',
  tier: 5,
  level: 1,
  maxLevel: 100,
  stats: { health: 1000, attack: 999, defense: 999, engineering: 999, science: 999, leadership: 999 },
  baseStats: { health: 1000, attack: 999, defense: 999, engineering: 999, science: 999, leadership: 999 },
  skills: [],
  traits: ['Omnipotent', 'Reality Warping', 'Immortal', 'Unpredictable'],
  experience: 0,
  nextLevelExp: 10000,
  morale: 50,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 100000000,
  cooldownRemaining: 0,
};

export const CREW_WESLEY_CRUSHER: CrewMember = {
  crewId: 'crew_wesley_crusher',
  name: 'Wesley Crusher',
  title: 'Ensign',
  role: 'engineer',
  species: 'Human',
  rarity: 'uncommon',
  tier: 1,
  level: 1,
  maxLevel: 100,
  stats: { health: 580, attack: 380, defense: 420, engineering: 720, science: 820, leadership: 380 },
  baseStats: { health: 580, attack: 380, defense: 420, engineering: 720, science: 820, leadership: 380 },
  skills: [],
  traits: ['Child Prodigy', 'Eager', 'Gifted', 'Curious'],
  experience: 0,
  nextLevelExp: 3500,
  morale: 85,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_NELIX_ALT: CrewMember = {
  crewId: 'crew_ferengi_trader',
  name: 'Quark',
  title: 'Ferengi Trader',
  role: 'captain',
  species: 'Ferengi',
  rarity: 'rare',
  tier: 2,
  level: 1,
  maxLevel: 100,
  stats: { health: 580, attack: 380, defense: 420, engineering: 520, science: 480, leadership: 680 },
  baseStats: { health: 580, attack: 380, defense: 420, engineering: 520, science: 480, leadership: 680 },
  skills: [],
  traits: ['Shrewd', 'Merchant', 'Opportunist', 'Selfish'],
  experience: 0,
  nextLevelExp: 4200,
  morale: 80,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_ROM: CrewMember = {
  crewId: 'crew_rom',
  name: 'Rom',
  title: 'Ferengi Engineer',
  role: 'engineer',
  species: 'Ferengi',
  rarity: 'uncommon',
  tier: 1,
  level: 1,
  maxLevel: 100,
  stats: { health: 580, attack: 350, defense: 420, engineering: 820, science: 380, leadership: 320 },
  baseStats: { health: 580, attack: 350, defense: 420, engineering: 820, science: 380, leadership: 320 },
  skills: [],
  traits: ['Simple', 'Mechanical Genius', 'Loyal', 'Naive'],
  experience: 0,
  nextLevelExp: 3500,
  morale: 75,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_KAIKO_ISHIKAWA: CrewMember = {
  crewId: 'crew_kaiko_ishikawa',
  name: 'Kaiko Ishikawa',
  title: 'Science Officer',
  role: 'science',
  species: 'Human',
  rarity: 'uncommon',
  tier: 1,
  level: 1,
  maxLevel: 100,
  stats: { health: 620, attack: 380, defense: 480, engineering: 680, science: 820, leadership: 420 },
  baseStats: { health: 620, attack: 380, defense: 480, engineering: 680, science: 820, leadership: 420 },
  skills: [],
  traits: ['Scientist', 'Quiet', 'Dedicated', 'Methodical'],
  experience: 0,
  nextLevelExp: 3500,
  morale: 85,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_YUKI_SHIMODA: CrewMember = {
  crewId: 'crew_yuki_shimoda',
  name: 'Yuki Shimoda',
  title: 'Science Officer',
  role: 'science',
  species: 'Human',
  rarity: 'uncommon',
  tier: 1,
  level: 1,
  maxLevel: 100,
  stats: { health: 620, attack: 380, defense: 480, engineering: 620, science: 820, leadership: 420 },
  baseStats: { health: 620, attack: 380, defense: 480, engineering: 620, science: 820, leadership: 420 },
  skills: [],
  traits: ['Scientist', 'Thoughtful', 'Intelligent', 'Composed'],
  experience: 0,
  nextLevelExp: 3500,
  morale: 85,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_GARAK: CrewMember = {
  crewId: 'crew_garak',
  name: 'Garak',
  title: 'Cardassian Trader',
  role: 'tactical',
  species: 'Cardassian',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 820, attack: 720, defense: 680, engineering: 620, science: 620, leadership: 680 },
  baseStats: { health: 820, attack: 720, defense: 680, engineering: 620, science: 620, leadership: 680 },
  skills: [],
  traits: ['Tailor', 'Spy', 'Manipulative', 'Mysterious'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 80,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

// TIER 4 - EPIC (20 Crew)
export const CREW_KHAN_NOONIEN_SINGH: CrewMember = {
  crewId: 'crew_khan',
  name: 'Khan Noonien Singh',
  title: 'Superhuman Tyrant',
  role: 'captain',
  species: 'Human (Augmented)',
  rarity: 'legendary',
  tier: 5,
  level: 1,
  maxLevel: 100,
  stats: { health: 920, attack: 880, defense: 780, engineering: 680, science: 620, leadership: 920 },
  baseStats: { health: 920, attack: 880, defense: 780, engineering: 680, science: 620, leadership: 920 },
  skills: [],
  traits: ['Superhuman Strength', 'Genius Intellect', 'Ambitious', 'Ruthless'],
  experience: 0,
  nextLevelExp: 5000,
  morale: 100,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_BORG_QUEEN: CrewMember = {
  crewId: 'crew_borg_queen',
  name: 'Borg Queen',
  title: 'Collective Ruler',
  role: 'captain',
  species: 'Cyborg',
  rarity: 'mythic',
  tier: 5,
  level: 1,
  maxLevel: 100,
  stats: { health: 950, attack: 850, defense: 950, engineering: 950, science: 950, leadership: 950 },
  baseStats: { health: 950, attack: 850, defense: 950, engineering: 950, science: 950, leadership: 950 },
  skills: [],
  traits: ['Collective Mind', 'Technological Perfection', 'Immortal', 'Hive Mind'],
  experience: 0,
  nextLevelExp: 10000,
  morale: 100,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 100000000,
  cooldownRemaining: 0,
};

export const CREW_KLINGON_WARRIOR: CrewMember = {
  crewId: 'crew_klingon_warrior',
  name: 'Generic Klingon Warrior',
  title: 'Warrior',
  role: 'tactical',
  species: 'Klingon',
  rarity: 'rare',
  tier: 2,
  level: 1,
  maxLevel: 100,
  stats: { health: 820, attack: 820, defense: 720, engineering: 420, science: 380, leadership: 520 },
  baseStats: { health: 820, attack: 820, defense: 720, engineering: 420, science: 380, leadership: 520 },
  skills: [],
  traits: ['Warrior Code', 'Honorable', 'Aggressive', 'Strong'],
  experience: 0,
  nextLevelExp: 4200,
  morale: 90,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_ROMULAN_COMMANDER: CrewMember = {
  crewId: 'crew_romulan_commander',
  name: 'Romulan Commander',
  title: 'Commander',
  role: 'captain',
  species: 'Romulan',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 780, attack: 680, defense: 720, engineering: 680, science: 720, leadership: 820 },
  baseStats: { health: 780, attack: 680, defense: 720, engineering: 680, science: 720, leadership: 820 },
  skills: [],
  traits: ['Strategic', 'Cunning', 'Honorable', 'Disciplined'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 88,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_DOMINION_FOUNDER: CrewMember = {
  crewId: 'crew_dominion_founder',
  name: 'Dominion Founder',
  title: 'Shape-Shifter',
  role: 'captain',
  species: 'Founder',
  rarity: 'legendary',
  tier: 5,
  level: 1,
  maxLevel: 100,
  stats: { health: 880, attack: 820, defense: 880, engineering: 780, science: 880, leadership: 950 },
  baseStats: { health: 880, attack: 820, defense: 880, engineering: 780, science: 880, leadership: 950 },
  skills: [],
  traits: ['Shape-Shifter', 'Immortal', 'Totalitarian', 'Paranoid'],
  experience: 0,
  nextLevelExp: 5000,
  morale: 95,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_DOMINION_SOLDIER: CrewMember = {
  crewId: 'crew_dominion_soldier',
  name: 'Jem\'Hadar Soldier',
  title: 'Elite Warrior',
  role: 'tactical',
  species: 'Jem\'Hadar',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 880, attack: 820, defense: 780, engineering: 480, science: 420, leadership: 420 },
  baseStats: { health: 880, attack: 820, defense: 780, engineering: 480, science: 420, leadership: 420 },
  skills: [],
  traits: ['Genetically Enhanced', 'Loyal', 'Warrior', 'Fearless'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 100,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_ANDORIAN: CrewMember = {
  crewId: 'crew_andorian',
  name: 'Andorian Officer',
  title: 'Commander',
  role: 'tactical',
  species: 'Andorian',
  rarity: 'rare',
  tier: 2,
  level: 1,
  maxLevel: 100,
  stats: { health: 720, attack: 720, defense: 680, engineering: 580, science: 620, leadership: 580 },
  baseStats: { health: 720, attack: 720, defense: 680, engineering: 580, science: 620, leadership: 580 },
  skills: [],
  traits: ['Proud Warrior', 'Militant', 'Honorable', 'Loyal'],
  experience: 0,
  nextLevelExp: 4200,
  morale: 92,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_TELLARITE: CrewMember = {
  crewId: 'crew_tellarite',
  name: 'Tellarite Negotiator',
  title: 'Ambassador',
  role: 'captain',
  species: 'Tellarite',
  rarity: 'rare',
  tier: 2,
  level: 1,
  maxLevel: 100,
  stats: { health: 680, attack: 520, defense: 620, engineering: 720, science: 720, leadership: 820 },
  baseStats: { health: 680, attack: 520, defense: 620, engineering: 720, science: 720, leadership: 820 },
  skills: [],
  traits: ['Shrewd Negotiator', 'Argumentative', 'Pragmatic', 'Merchant'],
  experience: 0,
  nextLevelExp: 4200,
  morale: 88,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_TRILL_JOINED: CrewMember = {
  crewId: 'crew_trill_joined',
  name: 'Trill Joined Officer',
  title: 'Symbiont Host',
  role: 'science',
  species: 'Trill',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 720, attack: 520, defense: 620, engineering: 720, science: 920, leadership: 680 },
  baseStats: { health: 720, attack: 520, defense: 620, engineering: 720, science: 920, leadership: 680 },
  skills: [],
  traits: ['Symbiotic Bond', 'Ancient Knowledge', 'Dual Nature', 'Experienced'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 90,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_BOLIAN: CrewMember = {
  crewId: 'crew_bolian',
  name: 'Bolian Officer',
  title: 'Engineer',
  role: 'engineer',
  species: 'Bolian',
  rarity: 'uncommon',
  tier: 1,
  level: 1,
  maxLevel: 100,
  stats: { health: 680, attack: 420, defense: 520, engineering: 820, science: 620, leadership: 420 },
  baseStats: { health: 680, attack: 420, defense: 520, engineering: 820, science: 620, leadership: 420 },
  skills: [],
  traits: ['Brilliant Engineer', 'Friendly', 'Relaxed', 'Talented'],
  experience: 0,
  nextLevelExp: 3500,
  morale: 90,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_VULCAN_HEALER: CrewMember = {
  crewId: 'crew_vulcan_healer',
  name: 'Vulcan Healer',
  title: 'Medical Specialist',
  role: 'medical',
  species: 'Vulcan',
  rarity: 'rare',
  tier: 2,
  level: 1,
  maxLevel: 100,
  stats: { health: 700, attack: 380, defense: 520, engineering: 620, science: 920, leadership: 520 },
  baseStats: { health: 700, attack: 380, defense: 520, engineering: 620, science: 920, leadership: 520 },
  skills: [],
  traits: ['Logical Healer', 'Mind Meld Capable', 'Precise', 'Methodical'],
  experience: 0,
  nextLevelExp: 4200,
  morale: 85,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_EMPATH: CrewMember = {
  crewId: 'crew_empath',
  name: 'Empath',
  title: 'Counselor',
  role: 'medical',
  species: 'Unknown',
  rarity: 'rare',
  tier: 2,
  level: 1,
  maxLevel: 100,
  stats: { health: 620, attack: 320, defense: 480, engineering: 520, science: 780, leadership: 820 },
  baseStats: { health: 620, attack: 320, defense: 480, engineering: 520, science: 780, leadership: 820 },
  skills: [],
  traits: ['Empathic Healer', 'Psychic', 'Compassionate', 'Sensitive'],
  experience: 0,
  nextLevelExp: 4200,
  morale: 88,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_GORN_CAPTAIN: CrewMember = {
  crewId: 'crew_gorn_captain',
  name: 'Gorn Captain',
  title: 'Military Leader',
  role: 'captain',
  species: 'Gorn',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 920, attack: 820, defense: 820, engineering: 580, science: 480, leadership: 720 },
  baseStats: { health: 920, attack: 820, defense: 820, engineering: 580, science: 480, leadership: 720 },
  skills: [],
  traits: ['Reptilian Strength', 'Ruthless', 'Honorable', 'Warrior'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 90,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_ORION_PIRATE: CrewMember = {
  crewId: 'crew_orion_pirate',
  name: 'Orion Pirate',
  title: 'Corsair',
  role: 'tactical',
  species: 'Orion',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 780, attack: 820, defense: 720, engineering: 620, science: 520, leadership: 680 },
  baseStats: { health: 780, attack: 820, defense: 720, engineering: 620, science: 520, leadership: 680 },
  skills: [],
  traits: ['Pirate', 'Cunning', 'Dangerous', 'Charismatic'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 75,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_VULCAN_LOGIC_MASTER: CrewMember = {
  crewId: 'crew_vulcan_logic_master',
  name: 'Vulcan Logic Master',
  title: 'Philosopher',
  role: 'science',
  species: 'Vulcan',
  rarity: 'legendary',
  tier: 4,
  level: 1,
  maxLevel: 100,
  stats: { health: 700, attack: 380, defense: 520, engineering: 780, science: 980, leadership: 620 },
  baseStats: { health: 700, attack: 380, defense: 520, engineering: 780, science: 980, leadership: 620 },
  skills: [],
  traits: ['Ancient Logic', 'Pure Logic', 'Wise', 'Perfect'],
  experience: 0,
  nextLevelExp: 4800,
  morale: 90,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

// TIER 5 - LEGENDARY & MYTHIC (10 Crew)
export const CREW_AZETBUR: CrewMember = {
  crewId: 'crew_azetbur',
  name: 'Azetbur',
  title: 'Klingon Chancellor',
  role: 'captain',
  species: 'Klingon',
  rarity: 'legendary',
  tier: 4,
  level: 1,
  maxLevel: 100,
  stats: { health: 900, attack: 820, defense: 820, engineering: 620, science: 520, leadership: 920 },
  baseStats: { health: 900, attack: 820, defense: 820, engineering: 620, science: 520, leadership: 920 },
  skills: [],
  traits: ['Chancellor', 'Klingon Warrior', 'Honorable', 'Diplomatic'],
  experience: 0,
  nextLevelExp: 4800,
  morale: 95,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_TOMALAK: CrewMember = {
  crewId: 'crew_tomalak',
  name: 'Tomalak',
  title: 'Romulan Commander',
  role: 'captain',
  species: 'Romulan',
  rarity: 'legendary',
  tier: 4,
  level: 1,
  maxLevel: 100,
  stats: { health: 820, attack: 720, defense: 780, engineering: 720, science: 820, leadership: 880 },
  baseStats: { health: 820, attack: 720, defense: 780, engineering: 720, science: 820, leadership: 880 },
  skills: [],
  traits: ['Strategic', 'Cunning Tactician', 'Honorable', 'Experienced'],
  experience: 0,
  nextLevelExp: 4800,
  morale: 92,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_DATHON: CrewMember = {
  crewId: 'crew_dathon',
  name: 'Dathon',
  title: 'Captain',
  role: 'captain',
  species: 'El Aurian',
  rarity: 'legendary',
  tier: 4,
  level: 1,
  maxLevel: 100,
  stats: { health: 820, attack: 680, defense: 720, engineering: 620, science: 680, leadership: 900 },
  baseStats: { health: 820, attack: 680, defense: 720, engineering: 620, science: 680, leadership: 900 },
  skills: [],
  traits: ['Warrior', 'Communicator', 'Bridge Builder', 'Honorable'],
  experience: 0,
  nextLevelExp: 4800,
  morale: 93,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_LOCUTUS: CrewMember = {
  crewId: 'crew_locutus',
  name: 'Locutus',
  title: 'Borg Emissary',
  role: 'captain',
  species: 'Cyborg',
  rarity: 'legendary',
  tier: 4,
  level: 1,
  maxLevel: 100,
  stats: { health: 920, attack: 820, defense: 920, engineering: 920, science: 920, leadership: 820 },
  baseStats: { health: 920, attack: 820, defense: 920, engineering: 920, science: 920, leadership: 820 },
  skills: [],
  traits: ['Borg Enhancement', 'Collective Will', 'Perfect Assimilation', 'Feared'],
  experience: 0,
  nextLevelExp: 4800,
  morale: 100,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_GUINAN_SUPREME: CrewMember = {
  crewId: 'crew_guinan_supreme',
  name: 'Guinan (Ancient)',
  title: 'Omniscient Bartender',
  role: 'science',
  species: 'El Aurian',
  rarity: 'mythic',
  tier: 5,
  level: 1,
  maxLevel: 100,
  stats: { health: 900, attack: 580, defense: 720, engineering: 620, science: 950, leadership: 980 },
  baseStats: { health: 900, attack: 580, defense: 720, engineering: 620, science: 950, leadership: 980 },
  skills: [],
  traits: ['Omniscient', 'Wise Beyond Time', 'Psychic', 'All-Knowing'],
  experience: 0,
  nextLevelExp: 10000,
  morale: 100,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_TASHA_YAR: CrewMember = {
  crewId: 'crew_tasha_yar',
  name: 'Tasha Yar',
  title: 'Security Chief',
  role: 'tactical',
  species: 'Human',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 780, attack: 780, defense: 720, engineering: 480, science: 480, leadership: 620 },
  baseStats: { health: 780, attack: 780, defense: 720, engineering: 480, science: 480, leadership: 620 },
  skills: [],
  traits: ['Combat Expert', 'Fearless', 'Passionate', 'Tragic'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 85,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_SELA: CrewMember = {
  crewId: 'crew_sela',
  name: 'Sela',
  title: 'Romulan Commander',
  role: 'captain',
  species: 'Romulan/Human',
  rarity: 'legendary',
  tier: 4,
  level: 1,
  maxLevel: 100,
  stats: { health: 820, attack: 720, defense: 780, engineering: 680, science: 820, leadership: 880 },
  baseStats: { health: 820, attack: 720, defense: 780, engineering: 680, science: 820, leadership: 880 },
  skills: [],
  traits: ['Hybrid Heritage', 'Strategic', 'Ambitious', 'Cunning'],
  experience: 0,
  nextLevelExp: 4800,
  morale: 90,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

// Additional TIER 3-4 Crew (Add Variety)
export const CREW_ROGA_DANAR: CrewMember = {
  crewId: 'crew_roga_danar',
  name: 'Roga Danar',
  title: 'Augmented Warrior',
  role: 'tactical',
  species: 'Angosian',
  rarity: 'epic',
  tier: 3,
  level: 1,
  maxLevel: 100,
  stats: { health: 880, attack: 880, defense: 780, engineering: 480, science: 420, leadership: 580 },
  baseStats: { health: 880, attack: 880, defense: 780, engineering: 480, science: 420, leadership: 580 },
  skills: [],
  traits: ['Enhanced Soldier', 'Angry', 'Warrior', 'Tragic'],
  experience: 0,
  nextLevelExp: 4500,
  morale: 70,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 0,
  cooldownRemaining: 0,
};

export const CREW_TIMEKEEPER: CrewMember = {
  crewId: 'crew_timekeeper',
  name: 'The Timekeeper',
  title: 'Temporal Master',
  role: 'science',
  species: 'Unknown',
  rarity: 'mythic',
  tier: 5,
  level: 1,
  maxLevel: 100,
  stats: { health: 980, attack: 680, defense: 880, engineering: 980, science: 999, leadership: 880 },
  baseStats: { health: 980, attack: 680, defense: 880, engineering: 980, science: 999, leadership: 880 },
  skills: [],
  traits: ['Temporal Authority', 'Time Manipulation', 'Omniscient', 'Immortal'],
  experience: 0,
  nextLevelExp: 10000,
  morale: 100,
  fatigue: 0,
  assignedShipId: null,
  position: null,
  activeEffects: [],
  trainedTechs: [],
  trainingProgress: new Map(),
  availabilityDate: 100000000,
  cooldownRemaining: 0,
};

// ============================================================================
// CREW ARRAYS & EXPORTS
// ============================================================================

export const ALL_CREW_BY_TIER = {
  tier1: [CREW_WESLEY_CRUSHER, CREW_ROM, CREW_BOLIAN],
  tier2: [
    CREW_NEELIX, CREW_HOSHI_SATO, CREW_MALCOLM_REED, CREW_TRAVIS_MAYWEATHER,
    CREW_DEANNA_TROI, CREW_NELIX_ALT, CREW_ANDORIAN, CREW_TELLARITE, 
    CREW_VULCAN_HEALER, CREW_EMPATH, CREW_KAIKO_ISHIKAWA, CREW_YUKI_SHIMODA
  ],
  tier3: [
    CREW_BENJAMIN_SISKO, CREW_KIRA_NERYS, CREW_ODO, CREW_JADZIA_DAX,
    CREW_JULIAN_BASHIR, CREW_MILES_OBRIEN, CREW_KATHRYN_JANEWAY, CREW_TUVOK,
    CREW_SEVEN_OF_NINE, CREW_T_POL, CREW_DOCTOR_PHLOX, CREW_WILLIAM_RIKER,
    CREW_GEORDI_LA_FORGE, CREW_BEVERLY_CRUSHER, CREW_GUINAN, CREW_GARAK,
    CREW_ROMULAN_COMMANDER, CREW_DOMINION_SOLDIER, CREW_TRILL_JOINED, CREW_GORN_CAPTAIN,
    CREW_ORION_PIRATE, CREW_TASHA_YAR, CREW_ROGA_DANAR, CREW_KLINGON_WARRIOR
  ],
  tier4: [
    CREW_LEONARD_MCCOY, CREW_SCOTTY, CREW_JONATHAN_ARCHER, CREW_DATA, CREW_WORF,
    CREW_VULCAN_LOGIC_MASTER, CREW_AZETBUR, CREW_TOMALAK, CREW_DATHON, CREW_LOCUTUS,
    CREW_SELA
  ],
  tier5: [
    CREW_JAMES_KIRK, CREW_SPOCK, CREW_JEAN_LUC_PICARD, CREW_KATHRYN_JANEWAY,
    CREW_BENJAMIN_SISKO, CREW_KHAN_NOONIEN_SINGH, CREW_DOMINION_FOUNDER,
    CREW_JAMES_T_KIRK_ALTERNATE, CREW_GUINEA_SUPREME: CREW_GUINAN_SUPREME,
    CREW_TIMEKEEPER, CREW_Q, CREW_BORG_QUEEN
  ]
};

export const ALL_CREW: CrewMember[] = [
  // Tier 1
  CREW_WESLEY_CRUSHER, CREW_ROM, CREW_BOLIAN,
  // Tier 2
  CREW_NEELIX, CREW_HOSHI_SATO, CREW_MALCOLM_REED, CREW_TRAVIS_MAYWEATHER,
  CREW_DEANNA_TROI, CREW_NELIX_ALT, CREW_ANDORIAN, CREW_TELLARITE,
  CREW_VULCAN_HEALER, CREW_EMPATH, CREW_KAIKO_ISHIKAWA, CREW_YUKI_SHIMODA,
  // Tier 3
  CREW_BENJAMIN_SISKO, CREW_KIRA_NERYS, CREW_ODO, CREW_JADZIA_DAX,
  CREW_JULIAN_BASHIR, CREW_MILES_OBRIEN, CREW_KATHRYN_JANEWAY, CREW_TUVOK,
  CREW_SEVEN_OF_NINE, CREW_T_POL, CREW_DOCTOR_PHLOX, CREW_WILLIAM_RIKER,
  CREW_GEORDI_LA_FORGE, CREW_BEVERLY_CRUSHER, CREW_GUINAN, CREW_GARAK,
  CREW_ROMULAN_COMMANDER, CREW_DOMINION_SOLDIER, CREW_TRILL_JOINED, CREW_GORN_CAPTAIN,
  CREW_ORION_PIRATE, CREW_TASHA_YAR, CREW_ROGA_DANAR, CREW_KLINGON_WARRIOR,
  // Tier 4
  CREW_LEONARD_MCCOY, CREW_SCOTTY, CREW_JONATHAN_ARCHER, CREW_DATA, CREW_WORF,
  CREW_VULCAN_LOGIC_MASTER, CREW_AZETBUR, CREW_TOMALAK, CREW_DATHON, CREW_LOCUTUS,
  CREW_SELA,
  // Tier 5
  CREW_JAMES_KIRK, CREW_SPOCK, CREW_JEAN_LUC_PICARD, CREW_BENJAMIN_SISKO,
  CREW_KHAN_NOONIEN_SINGH, CREW_DOMINION_FOUNDER, CREW_JAMES_T_KIRK_ALTERNATE,
  CREW_GUINAN_SUPREME, CREW_TIMEKEEPER, CREW_Q, CREW_BORG_QUEEN
];

// ============================================================================
// CREW SYNERGIES
// ============================================================================

export const SYNERGY_ORIGINAL_CREW: CrewSynergy = {
  synergyId: 'synergy_original_crew',
  name: 'Original Crew Synergy',
  description: 'Kirk, Spock, McCoy, Scotty, Uhura, Sulu, and Chekov working together',
  requiredCrewIds: ['crew_james_kirk', 'crew_spock', 'crew_leonard_mccoy', 'crew_scotty', 'crew_uhura', 'crew_sulu', 'crew_chekov'],
  requiredRoles: [],
  bonus: [
    { stat: 'attack', value: 150 },
    { stat: 'leadership', value: 200 }
  ],
  stackable: false,
};

export const SYNERGY_NEXT_GEN_CREW: CrewSynergy = {
  synergyId: 'synergy_next_gen_crew',
  name: 'Next Generation Crew',
  description: 'Picard, Riker, Data, Worf, and Crusher working together',
  requiredCrewIds: ['crew_jean_luc_picard', 'crew_william_riker', 'crew_data', 'crew_worf', 'crew_beverly_crusher'],
  requiredRoles: [],
  bonus: [
    { stat: 'defense', value: 200 },
    { stat: 'science', value: 150 }
  ],
  stackable: false,
};

export const SYNERGY_DEEP_SPACE_NINE: CrewSynergy = {
  synergyId: 'synergy_ds9_crew',
  name: 'Deep Space Nine Command',
  description: 'Sisko, Kira, Odo, Dax, and Bashir working together',
  requiredCrewIds: ['crew_benjamin_sisko', 'crew_kira_nerys', 'crew_odo', 'crew_jadzia_dax', 'crew_julian_bashir'],
  requiredRoles: [],
  bonus: [
    { stat: 'health', value: 150 },
    { stat: 'engineering', value: 100 }
  ],
  stackable: false,
};

export const SYNERGY_VOYAGER_CREW: CrewSynergy = {
  synergyId: 'synergy_voyager_crew',
  name: 'Voyager Crew',
  description: 'Janeway, Tuvok, and Seven of Nine working together',
  requiredCrewIds: ['crew_kathryn_janeway', 'crew_tuvok', 'crew_seven_of_nine'],
  requiredRoles: [],
  bonus: [
    { stat: 'science', value: 180 },
    { stat: 'defense', value: 120 }
  ],
  stackable: false,
};

export const SYNERGY_KLINGON_HONOR: CrewSynergy = {
  synergyId: 'synergy_klingon_honor',
  name: 'Klingon Honor Code',
  description: 'Worf and other Klingons united',
  requiredCrewIds: ['crew_worf', 'crew_klingon_warrior'],
  requiredRoles: ['tactical'],
  bonus: [
    { stat: 'attack', value: 200 },
    { stat: 'health', value: 150 }
  ],
  stackable: true,
};

export const ALL_CREW_SYNERGIES: CrewSynergy[] = [
  SYNERGY_ORIGINAL_CREW,
  SYNERGY_NEXT_GEN_CREW,
  SYNERGY_DEEP_SPACE_NINE,
  SYNERGY_VOYAGER_CREW,
  SYNERGY_KLINGON_HONOR,
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getCrewById(crewId: string): CrewMember | undefined {
  return ALL_CREW.find(crew => crew.crewId === crewId);
}

export function getCrewByRole(role: CrewRole): CrewMember[] {
  return ALL_CREW.filter(crew => crew.role === role);
}

export function getCrewByRarity(rarity: Rarity): CrewMember[] {
  return ALL_CREW.filter(crew => crew.rarity === rarity);
}

export function getCrewBySpecies(species: string): CrewMember[] {
  return ALL_CREW.filter(crew => crew.species === species);
}

export function getCrewByTier(tier: number): CrewMember[] {
  return ALL_CREW.filter(crew => crew.tier === tier);
}

export function calculateCrewStats(crew: CrewMember, level: number): CrewStats {
  const statGrowth = 1.05; // 5% growth per level
  const levelMultiplier = Math.pow(statGrowth, level - 1);
  return {
    health: Math.floor(crew.baseStats.health * levelMultiplier),
    attack: Math.floor(crew.baseStats.attack * levelMultiplier),
    defense: Math.floor(crew.baseStats.defense * levelMultiplier),
    engineering: Math.floor(crew.baseStats.engineering * levelMultiplier),
    science: Math.floor(crew.baseStats.science * levelMultiplier),
    leadership: Math.floor(crew.baseStats.leadership * levelMultiplier),
  };
}

export function upgradeCrew(crew: CrewMember, newLevel: number): CrewMember {
  if (newLevel > crew.maxLevel) newLevel = crew.maxLevel;
  if (newLevel < 1) newLevel = 1;

  const updatedCrew = { ...crew };
  updatedCrew.level = newLevel;
  updatedCrew.stats = calculateCrewStats(crew, newLevel);
  updatedCrew.nextLevelExp = Math.floor(5000 * Math.pow(1.1, newLevel - 1));
  return updatedCrew;
}

export function calculateCrewBonus(crew: CrewMember): Partial<CrewStats> {
  const bonus: Partial<CrewStats> = {};
  let totalBonus = 0;

  for (const skill of crew.skills) {
    if (skill.type === 'flat') {
      bonus[skill.bonus.stat] = (bonus[skill.bonus.stat] || 0) + skill.bonus.value;
    } else {
      bonus[skill.bonus.stat] = (bonus[skill.bonus.stat] || 0) + (crew.stats[skill.bonus.stat] * skill.bonus.value / 100);
    }
    totalBonus += skill.level * 5;
  }

  return bonus;
}

export function assignCrewToPosition(
  crew: CrewMember,
  shipId: string,
  role: CrewRole,
  isLeaderPosition: boolean = false
): CrewMember {
  const updatedCrew = { ...crew };
  updatedCrew.assignedShipId = shipId;
  updatedCrew.position = {
    positionId: `pos_${shipId}_${role}`,
    shipId,
    role,
    statBonus: isLeaderPosition ? { leadership: 50, attack: 25, defense: 25 } : {},
    isLeaderPosition,
  };
  return updatedCrew;
}

export function unassignCrew(crew: CrewMember): CrewMember {
  const updatedCrew = { ...crew };
  updatedCrew.assignedShipId = null;
  updatedCrew.position = null;
  return updatedCrew;
}

export function applyStatusEffect(crew: CrewMember, effect: StatusEffect): CrewMember {
  const updatedCrew = { ...crew };
  updatedCrew.activeEffects.push(effect);

  // Apply effect modifiers
  if (effect.type === 'buff') {
    for (const [stat, value] of Object.entries(effect.statMods)) {
      updatedCrew.stats[stat as keyof CrewStats] += value || 0;
    }
  } else {
    for (const [stat, value] of Object.entries(effect.statMods)) {
      updatedCrew.stats[stat as keyof CrewStats] -= value || 0;
    }
  }

  return updatedCrew;
}

export function removeStatusEffect(crew: CrewMember, effectId: string): CrewMember {
  const updatedCrew = { ...crew };
  const effect = updatedCrew.activeEffects.find(e => e.effectId === effectId);

  if (effect) {
    // Reverse effect modifiers
    if (effect.type === 'buff') {
      for (const [stat, value] of Object.entries(effect.statMods)) {
        updatedCrew.stats[stat as keyof CrewStats] -= value || 0;
      }
    } else {
      for (const [stat, value] of Object.entries(effect.statMods)) {
        updatedCrew.stats[stat as keyof CrewStats] += value || 0;
      }
    }

    updatedCrew.activeEffects = updatedCrew.activeEffects.filter(e => e.effectId !== effectId);
  }

  return updatedCrew;
}

export function getActiveSynergies(roster: CrewRosterData): CrewSynergy[] {
  const activeSynergies: CrewSynergy[] = [];
  const crewIds = Array.from(roster.crewMembers.keys());

  for (const synergy of ALL_CREW_SYNERGIES) {
    const hasAllRequired = synergy.requiredCrewIds.every(id => crewIds.includes(id));
    if (hasAllRequired) {
      activeSynergies.push(synergy);
    }
  }

  return activeSynergies;
}

export function calculateRosterStats(roster: CrewRosterData): CrewStats {
  const stats: CrewStats = {
    health: 0,
    attack: 0,
    defense: 0,
    engineering: 0,
    science: 0,
    leadership: 0,
  };

  for (const crew of roster.crewMembers.values()) {
    stats.health += crew.stats.health;
    stats.attack += crew.stats.attack;
    stats.defense += crew.stats.defense;
    stats.engineering += crew.stats.engineering;
    stats.science += crew.stats.science;
    stats.leadership += crew.stats.leadership;
  }

  // Add synergy bonuses
  const activeSynergies = getActiveSynergies(roster);
  for (const synergy of activeSynergies) {
    for (const bonus of synergy.bonus) {
      stats[bonus.stat] += bonus.value;
    }
  }

  return stats;
}

export function createPlayerRoster(playerId: string): CrewRosterData {
  return {
    playerId,
    crewMembers: new Map(),
    synergies: ALL_CREW_SYNERGIES,
    activeSynergies: [],
    totalExp: 0,
    totalMorale: 100,
    assignmentEfficiency: 1.0,
    trainingQueue: [],
  };
}

export function addCrewToRoster(roster: CrewRosterData, crew: CrewMember): CrewRosterData {
  const updatedRoster = { ...roster };
  updatedRoster.crewMembers.set(crew.crewId, { ...crew });
  updatedRoster.activeSynergies = getActiveSynergies(updatedRoster).map(s => s.synergyId);
  return updatedRoster;
}

export function removeCrewFromRoster(roster: CrewRosterData, crewId: string): CrewRosterData {
  const updatedRoster = { ...roster };
  updatedRoster.crewMembers.delete(crewId);
  updatedRoster.activeSynergies = getActiveSynergies(updatedRoster).map(s => s.synergyId);
  return updatedRoster;
}

export function trainCrewInTech(roster: CrewRosterData, crewId: string, techId: string, duration: number = 3600): CrewTraining | null {
  const crew = roster.crewMembers.get(crewId);
  if (!crew) return null;

  const training: CrewTraining = {
    trainingId: `training_${crewId}_${techId}_${Date.now()}`,
    crewId,
    techId,
    progress: 0,
    startTime: Date.now(),
    estimatedCompleteTime: Date.now() + duration * 1000,
    bonusMultiplier: 1.0,
  };

  roster.trainingQueue.push(training);
  crew.trainingProgress.set(techId, 0);
  return training;
}

export function updateCrewTraining(roster: CrewRosterData, deltaTime: number): void {
  const now = Date.now();

  for (let i = roster.trainingQueue.length - 1; i >= 0; i--) {
    const training = roster.trainingQueue[i];
    const crew = roster.crewMembers.get(training.crewId);

    if (!crew) continue;

    if (now >= training.estimatedCompleteTime) {
      crew.trainedTechs.push(training.techId);
      crew.trainingProgress.set(training.techId, 100);
      roster.trainingQueue.splice(i, 1);
    } else {
      const elapsed = now - training.startTime;
      const total = training.estimatedCompleteTime - training.startTime;
      const progress = Math.min(100, (elapsed / total) * 100);
      crew.trainingProgress.set(training.techId, progress);
    }
  }
}

export function getRecommendedCrew(role: CrewRole, tier: number, count: number = 5): CrewMember[] {
  return ALL_CREW
    .filter(crew => crew.role === role && crew.tier <= tier)
    .sort((a, b) => {
      const aTotal = Object.values(a.stats).reduce((sum, val) => sum + val, 0);
      const bTotal = Object.values(b.stats).reduce((sum, val) => sum + val, 0);
      return bTotal - aTotal;
    })
    .slice(0, count);
}

export function getCrewStatistics(): {
  totalCrew: number;
  byTier: Record<number, number>;
  byRole: Record<CrewRole, number>;
  byRarity: Record<Rarity, number>;
  averageStats: CrewStats;
} {
  const stats = {
    totalCrew: ALL_CREW.length,
    byTier: {},
    byRole: {} as Record<CrewRole, number>,
    byRarity: {} as Record<Rarity, number>,
    averageStats: {
      health: 0,
      attack: 0,
      defense: 0,
      engineering: 0,
      science: 0,
      leadership: 0,
    } as CrewStats,
  };

  let totalStats: CrewStats = {
    health: 0,
    attack: 0,
    defense: 0,
    engineering: 0,
    science: 0,
    leadership: 0,
  };

  for (const crew of ALL_CREW) {
    stats.byTier[crew.tier] = (stats.byTier[crew.tier] || 0) + 1;
    stats.byRole[crew.role] = (stats.byRole[crew.role] || 0) + 1;
    stats.byRarity[crew.rarity] = (stats.byRarity[crew.rarity] || 0) + 1;

    totalStats.health += crew.stats.health;
    totalStats.attack += crew.stats.attack;
    totalStats.defense += crew.stats.defense;
    totalStats.engineering += crew.stats.engineering;
    totalStats.science += crew.stats.science;
    totalStats.leadership += crew.stats.leadership;
  }

  const crewCount = ALL_CREW.length;
  stats.averageStats.health = Math.floor(totalStats.health / crewCount);
  stats.averageStats.attack = Math.floor(totalStats.attack / crewCount);
  stats.averageStats.defense = Math.floor(totalStats.defense / crewCount);
  stats.averageStats.engineering = Math.floor(totalStats.engineering / crewCount);
  stats.averageStats.science = Math.floor(totalStats.science / crewCount);
  stats.averageStats.leadership = Math.floor(totalStats.leadership / crewCount);

  return stats;
}
