// TechnologyResearchSystem.ts
// Advanced technology research system with 90+ technologies
// Organized by research categories and tiers

export type TechCategory = 
  | 'propulsion' 
  | 'weapons' 
  | 'defense' 
  | 'sensors' 
  | 'engineering' 
  | 'medical' 
  | 'science' 
  | 'economy' 
  | 'quantum' 
  | 'temporal';

export type TechRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type TechTier = 'tier1' | 'tier2' | 'tier3' | 'tier4' | 'tier5';

export interface TechStat {
  name: string;
  value: number;
  unit?: string;
}

export interface TechEffect {
  type: string;
  modifier: number;
  description: string;
  targetAttribute: string;
}

export interface TechRequirement {
  previousTech?: string[];
  minimumLevel?: number;
  requiredBuildings?: string[];
  minimumPlayerLevel?: number;
  resourcePrerequisites?: Record<string, number>;
}

export interface Technology {
  id: string;
  name: string;
  displayName: string;
  category: TechCategory;
  tier: TechTier;
  rarity: TechRarity;
  description: string;
  longDescription: string;
  
  // Research properties
  maxLevel: number;
  baseResearchTime: number; // seconds
  researchTimeMultiplier: number;
  baseCost: Record<string, number>;
  costScaling: number;
  
  // Stats and effects
  stats: TechStat[];
  effects: TechEffect[];
  requirements: TechRequirement;
  
  // Game mechanics
  unlocksBuildingType?: string;
  unlocksUnitType?: string;
  prerequisiteFor?: string[];
  bonusEffectiveness?: number; // multiplier
  synergiesWith?: string[];
  conflictsWith?: string[];
}

// ============================================
// TIER 1 TECHNOLOGIES (Early Game)
// ============================================

export const TECH_WARP_CORE_BASICS: Technology = {
  id: 'warp_core_basics',
  name: 'Warp Core Fundamentals',
  displayName: 'Warp Core Basics I',
  category: 'propulsion',
  tier: 'tier1',
  rarity: 'common',
  description: 'Basic understanding of warp field generation',
  longDescription: 'Learn the fundamental principles of warp field manipulation. Enables faster-than-light travel using controlled matter-antimatter reactions.',
  maxLevel: 5,
  baseResearchTime: 1800,
  researchTimeMultiplier: 1.3,
  baseCost: { credits: 500, dilithium: 100 },
  costScaling: 1.5,
  stats: [
    { name: 'Max Warp Speed', value: 5, unit: 'warp' },
    { name: 'Fuel Efficiency', value: 85, unit: '%' },
    { name: 'Engine Power', value: 1000, unit: 'MW' },
  ],
  effects: [
    {
      type: 'speed_boost',
      modifier: 0.15,
      description: '+15% fleet movement speed per level',
      targetAttribute: 'ship_speed',
    },
  ],
  requirements: { minimumPlayerLevel: 1 },
  prerequisiteFor: ['advanced_warp_drive', 'transwarp_corridor'],
};

export const TECH_PHASER_EMITTERS: Technology = {
  id: 'phaser_emitters',
  name: 'Phaser Emitter Technology',
  displayName: 'Phaser Emitters I',
  category: 'weapons',
  tier: 'tier1',
  rarity: 'common',
  description: 'Basic directed energy weapon systems',
  longDescription: 'Develop standard phaser technology for ship-to-ship combat. Converts energy directly into plasma bursts.',
  maxLevel: 5,
  baseResearchTime: 2000,
  researchTimeMultiplier: 1.35,
  baseCost: { credits: 600, tritanium: 150 },
  costScaling: 1.6,
  stats: [
    { name: 'DPS', value: 150, unit: 'energy/sec' },
    { name: 'Range', value: 15000, unit: 'km' },
    { name: 'Power Draw', value: 500, unit: 'MW' },
  ],
  effects: [
    {
      type: 'weapon_damage',
      modifier: 0.2,
      description: '+20% weapon damage per level',
      targetAttribute: 'attack_power',
    },
  ],
  requirements: { minimumPlayerLevel: 1 },
  prerequisiteFor: ['advanced_phaser_arrays', 'phaser_cannons'],
};

export const TECH_SHIELD_GENERATORS: Technology = {
  id: 'shield_generators',
  name: 'Shield Generator Technology',
  displayName: 'Shield Generators I',
  category: 'defense',
  tier: 'tier1',
  rarity: 'common',
  description: 'Basic energy shield systems',
  longDescription: 'Establish a stable energy field around ships to absorb damage. The foundation of modern defense systems.',
  maxLevel: 5,
  baseResearchTime: 2000,
  researchTimeMultiplier: 1.33,
  baseCost: { credits: 700, dilithium: 200 },
  costScaling: 1.55,
  stats: [
    { name: 'Shield Strength', value: 500, unit: 'HP' },
    { name: 'Recharge Rate', value: 50, unit: 'HP/sec' },
    { name: 'Coverage', value: 90, unit: '%' },
  ],
  effects: [
    {
      type: 'defense_boost',
      modifier: 0.25,
      description: '+25% shield strength per level',
      targetAttribute: 'shield_strength',
    },
  ],
  requirements: { minimumPlayerLevel: 1 },
  prerequisiteFor: ['advanced_shields', 'shield_harmonics'],
};

export const TECH_SENSOR_ARRAYS: Technology = {
  id: 'sensor_arrays',
  name: 'Long-Range Sensor Arrays',
  displayName: 'Sensor Arrays I',
  category: 'sensors',
  tier: 'tier1',
  rarity: 'common',
  description: 'Basic detection and scanning systems',
  longDescription: 'Detect enemies and objects across vast distances. Provides tactical advantage in space combat.',
  maxLevel: 5,
  baseResearchTime: 1600,
  researchTimeMultiplier: 1.25,
  baseCost: { credits: 400, tritanium: 100 },
  costScaling: 1.4,
  stats: [
    { name: 'Detection Range', value: 50000, unit: 'km' },
    { name: 'Scan Accuracy', value: 85, unit: '%' },
    { name: 'Update Speed', value: 2, unit: 'sec' },
  ],
  effects: [
    {
      type: 'vision_range',
      modifier: 0.2,
      description: '+20% sensor detection range per level',
      targetAttribute: 'visibility_range',
    },
  ],
  requirements: { minimumPlayerLevel: 1 },
  prerequisiteFor: ['advanced_sensors', 'quantum_sensors'],
};

export const TECH_DILITHIUM_REFINING: Technology = {
  id: 'dilithium_refining',
  name: 'Dilithium Crystal Refining',
  displayName: 'Dilithium Refining I',
  category: 'economy',
  tier: 'tier1',
  rarity: 'common',
  description: 'Improve dilithium extraction efficiency',
  longDescription: 'Learn to purify and refine dilithium crystals more effectively from raw ore.',
  maxLevel: 5,
  baseResearchTime: 1500,
  researchTimeMultiplier: 1.2,
  baseCost: { credits: 300 },
  costScaling: 1.3,
  stats: [
    { name: 'Refining Yield', value: 85, unit: '%' },
    { name: 'Processing Speed', value: 100, unit: 'units/min' },
    { name: 'Purity Level', value: 95, unit: '%' },
  ],
  effects: [
    {
      type: 'resource_production',
      modifier: 0.15,
      description: '+15% dilithium production per level',
      targetAttribute: 'mining_yield',
    },
  ],
  requirements: { minimumPlayerLevel: 1 },
  prerequisiteFor: ['advanced_dilithium_processing', 'quantum_resonance_refinement'],
};

export const TECH_CARGO_OPTIMIZATION: Technology = {
  id: 'cargo_optimization',
  name: 'Cargo Hold Optimization',
  displayName: 'Cargo Optimization I',
  category: 'engineering',
  tier: 'tier1',
  rarity: 'common',
  description: 'Improve cargo storage capacity',
  longDescription: 'Design more efficient storage systems to maximize cargo space on ships.',
  maxLevel: 5,
  baseResearchTime: 1400,
  researchTimeMultiplier: 1.22,
  baseCost: { credits: 250, tritanium: 75 },
  costScaling: 1.35,
  stats: [
    { name: 'Cargo Capacity', value: 5000, unit: 'units' },
    { name: 'Weight Reduction', value: 10, unit: '%' },
  ],
  effects: [
    {
      type: 'cargo_bonus',
      modifier: 0.2,
      description: '+20% cargo capacity per level',
      targetAttribute: 'transport_capacity',
    },
  ],
  requirements: { minimumPlayerLevel: 1 },
  prerequisiteFor: ['advanced_storage', 'stasis_containment'],
};

export const TECH_BASIC_MEDICINE: Technology = {
  id: 'basic_medicine',
  name: 'Advanced Medical Protocols',
  displayName: 'Medical Protocols I',
  category: 'medical',
  tier: 'tier1',
  rarity: 'common',
  description: 'Improve crew healing and regeneration',
  longDescription: 'Develop better medical treatments to reduce crew casualties in combat.',
  maxLevel: 5,
  baseResearchTime: 1700,
  researchTimeMultiplier: 1.28,
  baseCost: { credits: 400 },
  costScaling: 1.4,
  stats: [
    { name: 'Healing Rate', value: 50, unit: 'HP/sec' },
    { name: 'Treatment Success', value: 90, unit: '%' },
    { name: 'Recovery Speed', value: 20, unit: '%' },
  ],
  effects: [
    {
      type: 'crew_recovery',
      modifier: 0.15,
      description: '+15% crew survival rate per level',
      targetAttribute: 'crew_retention',
    },
  ],
  requirements: { minimumPlayerLevel: 1 },
  prerequisiteFor: ['advanced_medicine', 'genetic_engineering'],
};

export const TECH_NUCLEAR_FISSION: Technology = {
  id: 'nuclear_fission',
  name: 'Nuclear Fission Reactors',
  displayName: 'Nuclear Fission I',
  category: 'engineering',
  tier: 'tier1',
  rarity: 'uncommon',
  description: 'Harness nuclear fission for power generation',
  longDescription: 'Use controlled nuclear reactions to generate massive amounts of energy for ship systems.',
  maxLevel: 5,
  baseResearchTime: 2200,
  researchTimeMultiplier: 1.4,
  baseCost: { credits: 800, tritanium: 200 },
  costScaling: 1.65,
  stats: [
    { name: 'Power Output', value: 5000, unit: 'MW' },
    { name: 'Efficiency', value: 75, unit: '%' },
    { name: 'Heat Management', value: 80, unit: '%' },
  ],
  effects: [
    {
      type: 'power_generation',
      modifier: 0.3,
      description: '+30% ship power output per level',
      targetAttribute: 'energy_pool',
    },
  ],
  requirements: { minimumPlayerLevel: 3 },
  prerequisiteFor: ['antimatter_reactors', 'quantum_power_systems'],
};

export const TECH_IMPULSE_DRIVE: Technology = {
  id: 'impulse_drive',
  name: 'Impulse Drive Systems',
  displayName: 'Impulse Drives I',
  category: 'propulsion',
  tier: 'tier1',
  rarity: 'uncommon',
  description: 'Sublight propulsion systems for normal space travel',
  longDescription: 'Develop powerful subluminal drives using relativistic physics. Faster than conventional engines.',
  maxLevel: 5,
  baseResearchTime: 2100,
  researchTimeMultiplier: 1.35,
  baseCost: { credits: 750, dilithium: 150 },
  costScaling: 1.58,
  stats: [
    { name: 'Max Speed', value: 0.15, unit: 'c' },
    { name: 'Acceleration', value: 15, unit: 'G' },
    { name: 'Efficiency', value: 88, unit: '%' },
  ],
  effects: [
    {
      type: 'sublight_speed',
      modifier: 0.2,
      description: '+20% sublight speed per level',
      targetAttribute: 'impulse_speed',
    },
  ],
  requirements: { minimumPlayerLevel: 2 },
  prerequisiteFor: ['advanced_impulse', 'warp_field_modulation'],
};

export const TECH_RESOURCE_SCANNING: Technology = {
  id: 'resource_scanning',
  name: 'Resource Scanning Technology',
  displayName: 'Resource Scanning I',
  category: 'sensors',
  tier: 'tier1',
  rarity: 'uncommon',
  description: 'Locate mineral deposits and resources',
  longDescription: 'Develop sensors to detect valuable resources on planets and asteroids.',
  maxLevel: 5,
  baseResearchTime: 1800,
  researchTimeMultiplier: 1.3,
  baseCost: { credits: 500, tritanium: 100 },
  costScaling: 1.45,
  stats: [
    { name: 'Detection Accuracy', value: 92, unit: '%' },
    { name: 'Resource Valuation', value: 95, unit: '%' },
    { name: 'Depth Penetration', value: 5000, unit: 'm' },
  ],
  effects: [
    {
      type: 'resource_bonus',
      modifier: 0.1,
      description: '+10% resource discovery rate per level',
      targetAttribute: 'resource_gathering',
    },
  ],
  requirements: { minimumPlayerLevel: 2 },
  prerequisiteFor: ['advanced_resource_scanning', 'deep_space_prospecting'],
};

// ============================================
// TIER 2 TECHNOLOGIES (Mid Game)
// ============================================

export const TECH_ADVANCED_WARP_DRIVE: Technology = {
  id: 'advanced_warp_drive',
  name: 'Advanced Warp Field Theory',
  displayName: 'Advanced Warp Drive II',
  category: 'propulsion',
  tier: 'tier2',
  rarity: 'uncommon',
  description: 'Enhanced warp field manipulation',
  longDescription: 'Achieve higher warp velocities through refined field harmonics and improved containment.',
  maxLevel: 5,
  baseResearchTime: 3600,
  researchTimeMultiplier: 1.45,
  baseCost: { credits: 2000, dilithium: 500 },
  costScaling: 1.7,
  stats: [
    { name: 'Max Warp Speed', value: 8, unit: 'warp' },
    { name: 'Field Stability', value: 98, unit: '%' },
    { name: 'Fuel Efficiency', value: 92, unit: '%' },
  ],
  effects: [
    {
      type: 'speed_boost',
      modifier: 0.35,
      description: '+35% fleet speed per level',
      targetAttribute: 'ship_speed',
    },
  ],
  requirements: { previousTech: ['warp_core_basics'], minimumPlayerLevel: 5 },
  prerequisiteFor: ['transwarp_corridor', 'quantum_slipstream'],
};

export const TECH_PHOTON_TORPEDOES: Technology = {
  id: 'photon_torpedoes',
  name: 'Photon Torpedo Systems',
  displayName: 'Photon Torpedoes II',
  category: 'weapons',
  tier: 'tier2',
  rarity: 'uncommon',
  description: 'Antimatter-based projectile weapons',
  longDescription: 'Launch powerful matter-antimatter warheads that detonate on impact with devastating effect.',
  maxLevel: 5,
  baseResearchTime: 3800,
  researchTimeMultiplier: 1.5,
  baseCost: { credits: 2200, tritanium: 400, dilithium: 200 },
  costScaling: 1.75,
  stats: [
    { name: 'Damage per Hit', value: 5000, unit: 'HP' },
    { name: 'Reload Time', value: 3, unit: 'sec' },
    { name: 'Range', value: 30000, unit: 'km' },
    { name: 'Accuracy', value: 95, unit: '%' },
  ],
  effects: [
    {
      type: 'burst_damage',
      modifier: 0.5,
      description: '+50% burst damage per level',
      targetAttribute: 'critical_strike',
    },
  ],
  requirements: { previousTech: ['phaser_emitters'], minimumPlayerLevel: 7 },
  prerequisiteFor: ['quantum_torpedoes', 'multi_warhead_systems'],
};

export const TECH_ADVANCED_SHIELDS: Technology = {
  id: 'advanced_shields',
  name: 'Multi-Layer Shield Systems',
  displayName: 'Advanced Shields II',
  category: 'defense',
  tier: 'tier2',
  rarity: 'uncommon',
  description: 'Multiple shield frequency layers',
  longDescription: 'Deploy overlapping shield layers that can adapt to incoming attack patterns.',
  maxLevel: 5,
  baseResearchTime: 4000,
  researchTimeMultiplier: 1.48,
  baseCost: { credits: 2400, dilithium: 600 },
  costScaling: 1.68,
  stats: [
    { name: 'Shield Strength', value: 2000, unit: 'HP' },
    { name: 'Recharge Rate', value: 150, unit: 'HP/sec' },
    { name: 'Adaptation Rate', value: 40, unit: '%' },
  ],
  effects: [
    {
      type: 'defense_boost',
      modifier: 0.5,
      description: '+50% defense per level',
      targetAttribute: 'shield_strength',
    },
  ],
  requirements: { previousTech: ['shield_generators'], minimumPlayerLevel: 6 },
  prerequisiteFor: ['quantum_shields', 'shield_harmonics'],
};

export const TECH_QUANTUM_SENSORS: Technology = {
  id: 'quantum_sensors',
  name: 'Quantum Sensor Technology',
  displayName: 'Quantum Sensors II',
  category: 'sensors',
  tier: 'tier2',
  rarity: 'rare',
  description: 'Quantum-entangled sensor networks',
  longDescription: 'Use quantum mechanics to see through interference and detect cloaked vessels.',
  maxLevel: 5,
  baseResearchTime: 4200,
  researchTimeMultiplier: 1.55,
  baseCost: { credits: 2800, dilithium: 700, tritanium: 300 },
  costScaling: 1.8,
  stats: [
    { name: 'Detection Range', value: 100000, unit: 'km' },
    { name: 'Cloak Penetration', value: 60, unit: '%' },
    { name: 'Accuracy', value: 99, unit: '%' },
  ],
  effects: [
    {
      type: 'vision_range',
      modifier: 0.5,
      description: '+50% sensor range per level',
      targetAttribute: 'visibility_range',
    },
    {
      type: 'cloak_detection',
      modifier: 0.15,
      description: '+15% cloaked vessel detection per level',
      targetAttribute: 'stealth_penetration',
    },
  ],
  requirements: { previousTech: ['sensor_arrays', 'quantum_physics'] },
  prerequisiteFor: ['advanced_quantum_sensors', 'omniscient_array'],
};

export const TECH_ANTIMATTER_REACTORS: Technology = {
  id: 'antimatter_reactors',
  name: 'Antimatter Reaction Chambers',
  displayName: 'Antimatter Reactors II',
  category: 'engineering',
  tier: 'tier2',
  rarity: 'rare',
  description: 'Matter-antimatter annihilation reactors',
  longDescription: 'Harness the complete conversion of matter to energy. Ultimate power source for starships.',
  maxLevel: 5,
  baseResearchTime: 4500,
  researchTimeMultiplier: 1.6,
  baseCost: { credits: 3500, dilithium: 1000, tritanium: 500 },
  costScaling: 1.85,
  stats: [
    { name: 'Power Output', value: 50000, unit: 'MW' },
    { name: 'Efficiency', value: 100, unit: '%' },
    { name: 'Stability', value: 96, unit: '%' },
  ],
  effects: [
    {
      type: 'power_generation',
      modifier: 1.0,
      description: '+100% ship power per level',
      targetAttribute: 'energy_pool',
    },
  ],
  requirements: { previousTech: ['nuclear_fission', 'quantum_physics'], minimumPlayerLevel: 10 },
  prerequisiteFor: ['zero_point_energy', 'quantum_power_systems'],
};

export const TECH_CLOAK_TECHNOLOGY: Technology = {
  id: 'cloak_technology',
  name: 'Cloaking Device Technology',
  displayName: 'Cloaking Devices II',
  category: 'defense',
  tier: 'tier2',
  rarity: 'rare',
  description: 'Bend light around your ship',
  longDescription: 'Render your vessel invisible to conventional detection methods.',
  maxLevel: 3,
  baseResearchTime: 5000,
  researchTimeMultiplier: 1.7,
  baseCost: { credits: 4000, dilithium: 1500, tritanium: 600 },
  costScaling: 2.0,
  stats: [
    { name: 'Cloak Effectiveness', value: 95, unit: '%' },
    { name: 'Power Draw', value: 8000, unit: 'MW' },
    { name: 'Cloak Duration', value: 3600, unit: 'sec' },
  ],
  effects: [
    {
      type: 'invisibility',
      modifier: 0.95,
      description: '+95% stealth per level',
      targetAttribute: 'stealth_rating',
    },
  ],
  requirements: { previousTech: ['quantum_sensors'], minimumPlayerLevel: 12 },
  prerequisiteFor: ['advanced_cloaking', 'quantum_tunneling'],
};

export const TECH_TRANSWARP_CORRIDOR: Technology = {
  id: 'transwarp_corridor',
  name: 'Transwarp Corridor Navigation',
  displayName: 'Transwarp Corridors II',
  category: 'propulsion',
  tier: 'tier2',
  rarity: 'rare',
  description: 'Create temporary shortcuts through subspace',
  longDescription: 'Establish a corridor of enhanced warp space to travel at speeds beyond normal warp.',
  maxLevel: 3,
  baseResearchTime: 5200,
  researchTimeMultiplier: 1.65,
  baseCost: { credits: 4500, dilithium: 1800, tritanium: 800 },
  costScaling: 1.95,
  stats: [
    { name: 'Transwarp Speed', value: 14, unit: 'warp' },
    { name: 'Corridor Duration', value: 1200, unit: 'sec' },
    { name: 'Cooldown', value: 1800, unit: 'sec' },
  ],
  effects: [
    {
      type: 'teleport_speed',
      modifier: 0.8,
      description: '+80% teleport speed per level',
      targetAttribute: 'jump_distance',
    },
  ],
  requirements: { previousTech: ['advanced_warp_drive'], minimumPlayerLevel: 15 },
  prerequisiteFor: ['quantum_slipstream', 'wormhole_stabilization'],
};

export const TECH_REGENERATIVE_HULL: Technology = {
  id: 'regenerative_hull',
  name: 'Self-Regenerating Hull Plating',
  displayName: 'Regenerative Hulls II',
  category: 'defense',
  tier: 'tier2',
  rarity: 'rare',
  description: 'Ships that heal themselves over time',
  longDescription: 'Use advanced nanotechnology to repair hull damage automatically during and after combat.',
  maxLevel: 5,
  baseResearchTime: 3900,
  researchTimeMultiplier: 1.52,
  baseCost: { credits: 3000, dilithium: 800, tritanium: 400 },
  costScaling: 1.75,
  stats: [
    { name: 'Hull Regen Rate', value: 100, unit: 'HP/sec' },
    { name: 'Max Hull HP', value: 3000, unit: 'HP' },
    { name: 'Regen Speed Multiplier', value: 2, unit: 'x' },
  ],
  effects: [
    {
      type: 'passive_healing',
      modifier: 0.3,
      description: '+30% hull regeneration per level',
      targetAttribute: 'ship_hp_regen',
    },
  ],
  requirements: { previousTech: ['shield_generators', 'nanotechnology'] },
  prerequisiteFor: ['quantum_regeneration', 'cellular_repair'],
};

export const TECH_WARP_FIELD_HARMONICS: Technology = {
  id: 'warp_field_harmonics',
  name: 'Warp Field Harmonics Optimization',
  displayName: 'Warp Harmonics II',
  category: 'propulsion',
  tier: 'tier2',
  rarity: 'uncommon',
  description: 'Optimize warp field interactions',
  longDescription: 'Reduce warp field distortion and increase stability for faster, safer travel.',
  maxLevel: 5,
  baseResearchTime: 3200,
  researchTimeMultiplier: 1.42,
  baseCost: { credits: 1800, dilithium: 400 },
  costScaling: 1.65,
  stats: [
    { name: 'Field Stability', value: 99, unit: '%' },
    { name: 'Fuel Efficiency', value: 95, unit: '%' },
    { name: 'Distortion Reduction', value: 85, unit: '%' },
  ],
  effects: [
    {
      type: 'efficiency_boost',
      modifier: 0.25,
      description: '+25% fuel efficiency per level',
      targetAttribute: 'fuel_efficiency',
    },
  ],
  requirements: { previousTech: ['warp_core_basics', 'impulse_drive'] },
  prerequisiteFor: ['quantum_warp_field', 'spatial_distortion_mastery'],
};

export const TECH_POLARON_WEAPONS: Technology = {
  id: 'polaron_weapons',
  name: 'Polaron Energy Weapons',
  displayName: 'Polaron Weapons II',
  category: 'weapons',
  tier: 'tier2',
  rarity: 'uncommon',
  description: 'Exotic energy weapon systems',
  longDescription: 'Deploy subspace energy weapons that phase through standard shields.',
  maxLevel: 5,
  baseResearchTime: 3500,
  researchTimeMultiplier: 1.48,
  baseCost: { credits: 2100, tritanium: 500, dilithium: 300 },
  costScaling: 1.7,
  stats: [
    { name: 'DPS', value: 800, unit: 'energy/sec' },
    { name: 'Shield Penetration', value: 40, unit: '%' },
    { name: 'Range', value: 25000, unit: 'km' },
  ],
  effects: [
    {
      type: 'shield_piercing',
      modifier: 0.4,
      description: '+40% shield penetration per level',
      targetAttribute: 'armor_piercing',
    },
    {
      type: 'weapon_damage',
      modifier: 0.25,
      description: '+25% polaron damage per level',
      targetAttribute: 'attack_power',
    },
  ],
  requirements: { previousTech: ['phaser_emitters', 'quantum_physics'] },
  prerequisiteFor: ['tetryon_weapons', 'plasma_weapons'],
};

// ============================================
// TIER 3 TECHNOLOGIES (Advanced Game)
// ============================================

export const TECH_QUANTUM_TORPEDOES: Technology = {
  id: 'quantum_torpedoes',
  name: 'Quantum Torpedo Systems',
  displayName: 'Quantum Torpedoes III',
  category: 'weapons',
  tier: 'tier3',
  rarity: 'rare',
  description: 'Quantum-locked projectile weapons',
  longDescription: 'Fire torpedoes that cannot miss their target through quantum entanglement.',
  maxLevel: 4,
  baseResearchTime: 5000,
  researchTimeMultiplier: 1.6,
  baseCost: { credits: 5000, dilithium: 1500, tritanium: 800 },
  costScaling: 1.85,
  stats: [
    { name: 'Damage per Hit', value: 15000, unit: 'HP' },
    { name: 'Accuracy', value: 100, unit: '%' },
    { name: 'Reload Time', value: 5, unit: 'sec' },
  ],
  effects: [
    {
      type: 'guaranteed_hit',
      modifier: 1.0,
      description: 'Cannot miss targets per level',
      targetAttribute: 'accuracy',
    },
    {
      type: 'burst_damage',
      modifier: 0.8,
      description: '+80% critical damage per level',
      targetAttribute: 'critical_strike',
    },
  ],
  requirements: { previousTech: ['photon_torpedoes', 'quantum_physics'] },
  prerequisiteFor: ['bio_neural_weapons', 'temporal_weapons'],
};

export const TECH_QUANTUM_SHIELDS: Technology = {
  id: 'quantum_shields',
  name: 'Quantum Fluctuation Shields',
  displayName: 'Quantum Shields III',
  category: 'defense',
  tier: 'tier3',
  rarity: 'rare',
  description: 'Shields using quantum uncertainty principle',
  longDescription: 'Deploy shields that exist in superposition, making them nearly impenetrable.',
  maxLevel: 4,
  baseResearchTime: 5200,
  researchTimeMultiplier: 1.65,
  baseCost: { credits: 5500, dilithium: 2000, tritanium: 1000 },
  costScaling: 1.9,
  stats: [
    { name: 'Shield Strength', value: 8000, unit: 'HP' },
    { name: 'Damage Absorption', value: 90, unit: '%' },
    { name: 'Recharge Rate', value: 500, unit: 'HP/sec' },
  ],
  effects: [
    {
      type: 'damage_reduction',
      modifier: 0.9,
      description: '-90% damage taken per level',
      targetAttribute: 'damage_reduction',
    },
  ],
  requirements: { previousTech: ['advanced_shields', 'quantum_physics'] },
  prerequisiteFor: ['dimensional_shields', 'godly_protection'],
};

export const TECH_QUANTUM_PHYSICS: Technology = {
  id: 'quantum_physics',
  name: 'Advanced Quantum Physics',
  displayName: 'Quantum Physics III',
  category: 'science',
  tier: 'tier3',
  rarity: 'rare',
  description: 'Master quantum mechanics at macroscopic scales',
  longDescription: 'Unlock the deepest secrets of quantum mechanics to manipulate reality itself.',
  maxLevel: 4,
  baseResearchTime: 6000,
  researchTimeMultiplier: 1.75,
  baseCost: { credits: 6000, dilithium: 2500, tritanium: 1200 },
  costScaling: 2.0,
  stats: [
    { name: 'Tech Unlock Rate', value: 100, unit: '%' },
    { name: 'Physics Mastery', value: 100, unit: '%' },
  ],
  effects: [
    {
      type: 'research_speed',
      modifier: 0.5,
      description: '+50% research speed for quantum techs per level',
      targetAttribute: 'research_speed',
    },
  ],
  requirements: { previousTech: ['advanced_warp_drive', 'antimatter_reactors'] },
  prerequisiteFor: ['quantum_tunneling', 'zero_point_energy', 'time_manipulation'],
  synergiesWith: ['quantum_sensors', 'quantum_shields', 'quantum_torpedoes'],
};

export const TECH_TEMPORAL_MECHANICS: Technology = {
  id: 'temporal_mechanics',
  name: 'Temporal Mechanics Research',
  displayName: 'Temporal Mechanics III',
  category: 'temporal',
  tier: 'tier3',
  rarity: 'epic',
  description: 'Manipulate the flow of time',
  longDescription: 'Learn to slow, stop, or reverse time in localized regions.',
  maxLevel: 3,
  baseResearchTime: 7000,
  researchTimeMultiplier: 1.8,
  baseCost: { credits: 8000, dilithium: 3000, tritanium: 1500 },
  costScaling: 2.1,
  stats: [
    { name: 'Time Dilation Factor', value: 10, unit: 'x' },
    { name: 'Duration', value: 300, unit: 'sec' },
    { name: 'Cooldown', value: 1200, unit: 'sec' },
  ],
  effects: [
    {
      type: 'time_slowdown',
      modifier: 0.9,
      description: 'Slow enemy time by 90% per level',
      targetAttribute: 'enemy_speed_reduction',
    },
  ],
  requirements: { previousTech: ['quantum_physics'] },
  prerequisiteFor: ['time_travel', 'temporal_shielding'],
};

export const TECH_ZERO_POINT_ENERGY: Technology = {
  id: 'zero_point_energy',
  name: 'Zero-Point Energy Extraction',
  displayName: 'Zero-Point Energy III',
  category: 'engineering',
  tier: 'tier3',
  rarity: 'epic',
  description: 'Tap infinite energy from quantum vacuum',
  longDescription: 'Extract unlimited clean energy from the quantum vacuum of space itself.',
  maxLevel: 3,
  baseResearchTime: 6500,
  researchTimeMultiplier: 1.78,
  baseCost: { credits: 7500, dilithium: 2800, tritanium: 1400 },
  costScaling: 2.05,
  stats: [
    { name: 'Power Generation', value: 500000, unit: 'MW' },
    { name: 'Sustainability', value: 100, unit: '%' },
  ],
  effects: [
    {
      type: 'unlimited_power',
      modifier: 1.0,
      description: 'Unlimited energy per level',
      targetAttribute: 'energy_pool',
    },
  ],
  requirements: { previousTech: ['antimatter_reactors', 'quantum_physics'] },
  prerequisiteFor: ['dimensional_power', 'god_mode'],
};

export const TECH_ADVANCED_CLOAKING: Technology = {
  id: 'advanced_cloaking',
  name: 'Advanced Cloaking Field Theory',
  displayName: 'Advanced Cloaking III',
  category: 'defense',
  tier: 'tier3',
  rarity: 'epic',
  description: 'Multi-frequency adaptive cloaking',
  longDescription: 'Deploy cloaking that adapts to any sensor type and can even hide your weapons signature.',
  maxLevel: 3,
  baseResearchTime: 6000,
  researchTimeMultiplier: 1.75,
  baseCost: { credits: 6500, dilithium: 2200, tritanium: 1100 },
  costScaling: 1.95,
  stats: [
    { name: 'Cloak Effectiveness', value: 99.9, unit: '%' },
    { name: 'Power Draw', value: 12000, unit: 'MW' },
    { name: 'Active Weapons', value: 1, unit: 'count' },
  ],
  effects: [
    {
      type: 'perfect_stealth',
      modifier: 0.999,
      description: '+99.9% stealth even when firing per level',
      targetAttribute: 'stealth_rating',
    },
  ],
  requirements: { previousTech: ['cloak_technology', 'quantum_sensors'] },
  prerequisiteFor: ['dimensional_cloaking', 'perfect_invisibility'],
};

export const TECH_NANOTECHNOLOGY: Technology = {
  id: 'nanotechnology',
  name: 'Nanotech Engineering',
  displayName: 'Nanotechnology III',
  category: 'engineering',
  tier: 'tier3',
  rarity: 'rare',
  description: 'Build and repair at molecular level',
  longDescription: 'Manipulate matter at the molecular level using self-replicating nanobots.',
  maxLevel: 4,
  baseResearchTime: 5000,
  researchTimeMultiplier: 1.62,
  baseCost: { credits: 4500, dilithium: 1200, tritanium: 600 },
  costScaling: 1.8,
  stats: [
    { name: 'Repair Speed', value: 200, unit: 'HP/sec' },
    { name: 'Build Efficiency', value: 150, unit: '%' },
    { name: 'Contamination Resistance', value: 95, unit: '%' },
  ],
  effects: [
    {
      type: 'repair_boost',
      modifier: 0.5,
      description: '+50% repair speed per level',
      targetAttribute: 'healing_rate',
    },
    {
      type: 'construction_speed',
      modifier: 0.3,
      description: '+30% building construction speed per level',
      targetAttribute: 'build_speed',
    },
  ],
  requirements: { previousTech: ['regenerative_hull'] },
  prerequisiteFor: ['molecular_engineering', 'grey_goo'],
};

export const TECH_PLASMA_WEAPONS: Technology = {
  id: 'plasma_weapons',
  name: 'Plasma Accelerator Cannons',
  displayName: 'Plasma Weapons III',
  category: 'weapons',
  tier: 'tier3',
  rarity: 'rare',
  description: 'Superheated plasma projectile weapons',
  longDescription: 'Fire superheated plasma bolts that burn through shields and armor.',
  maxLevel: 4,
  baseResearchTime: 4800,
  researchTimeMultiplier: 1.58,
  baseCost: { credits: 4000, tritanium: 1200, dilithium: 600 },
  costScaling: 1.8,
  stats: [
    { name: 'DPS', value: 3000, unit: 'energy/sec' },
    { name: 'Armor Penetration', value: 50, unit: '%' },
    { name: 'Range', value: 40000, unit: 'km' },
    { name: 'Burn Damage', value: 500, unit: 'HP/sec' },
  ],
  effects: [
    {
      type: 'burn_damage',
      modifier: 0.4,
      description: '+40% burn damage over time per level',
      targetAttribute: 'damage_over_time',
    },
    {
      type: 'direct_damage',
      modifier: 0.35,
      description: '+35% direct weapon damage per level',
      targetAttribute: 'attack_power',
    },
  ],
  requirements: { previousTech: ['polaron_weapons', 'antimatter_reactors'] },
  prerequisiteFor: ['disruptor_cannons', 'wave_motion_cannon'],
};

export const TECH_QUANTUM_SLIPSTREAM: Technology = {
  id: 'quantum_slipstream',
  name: 'Quantum Slipstream Drive',
  displayName: 'Quantum Slipstream III',
  category: 'propulsion',
  tier: 'tier3',
  rarity: 'epic',
  description: 'Ride quantum probability waves',
  longDescription: 'Enter a quantum slipstream where you exist in multiple states simultaneously.',
  maxLevel: 3,
  baseResearchTime: 5500,
  researchTimeMultiplier: 1.68,
  baseCost: { credits: 5500, dilithium: 2000, tritanium: 1000 },
  costScaling: 1.92,
  stats: [
    { name: 'Travel Speed', value: 500, unit: 'c' },
    { name: 'Distance per Jump', value: 1000000, unit: 'AU' },
    { name: 'Accuracy', value: 95, unit: '%' },
  ],
  effects: [
    {
      type: 'mega_speed',
      modifier: 5.0,
      description: '+500% travel speed per level',
      targetAttribute: 'ship_speed',
    },
  ],
  requirements: { previousTech: ['transwarp_corridor', 'quantum_physics'] },
  prerequisiteFor: ['hyperdrive_systems', 'ftl_overdrive'],
};

// ============================================
// TIER 4 TECHNOLOGIES (Late Game)
// ============================================

export const TECH_QUANTUM_TUNNELING: Technology = {
  id: 'quantum_tunneling',
  name: 'Quantum Tunneling Drive',
  displayName: 'Quantum Tunneling IV',
  category: 'propulsion',
  tier: 'tier4',
  rarity: 'epic',
  description: 'Phase through spacetime barriers',
  longDescription: 'Use quantum tunneling to pass through solid objects and spatial anomalies.',
  maxLevel: 3,
  baseResearchTime: 7000,
  researchTimeMultiplier: 1.8,
  baseCost: { credits: 8000, dilithium: 3000, tritanium: 1500 },
  costScaling: 2.05,
  stats: [
    { name: 'Phase Duration', value: 60, unit: 'sec' },
    { name: 'Cooldown', value: 300, unit: 'sec' },
    { name: 'Collision Avoidance', value: 100, unit: '%' },
  ],
  effects: [
    {
      type: 'phase_through',
      modifier: 1.0,
      description: 'Pass through any obstacle per level',
      targetAttribute: 'collision_immunity',
    },
  ],
  requirements: { previousTech: ['quantum_physics', 'quantum_slipstream'] },
  prerequisiteFor: ['dimensional_travel', 'multiversal_navigation'],
};

export const TECH_DIMENSIONAL_SHIELDS: Technology = {
  id: 'dimensional_shields',
  name: 'Dimensional Fold Shields',
  displayName: 'Dimensional Shields IV',
  category: 'defense',
  tier: 'tier4',
  rarity: 'epic',
  description: 'Fold damage into alternate dimensions',
  longDescription: 'Redirect incoming damage to alternate dimensions where it is harmless.',
  maxLevel: 3,
  baseResearchTime: 6500,
  researchTimeMultiplier: 1.75,
  baseCost: { credits: 7000, dilithium: 2500, tritanium: 1200 },
  costScaling: 2.0,
  stats: [
    { name: 'Damage Negation', value: 99, unit: '%' },
    { name: 'Recharge Rate', value: 1000, unit: 'HP/sec' },
  ],
  effects: [
    {
      type: 'near_invulnerability',
      modifier: 0.99,
      description: 'Negate 99% damage per level',
      targetAttribute: 'damage_reduction',
    },
  ],
  requirements: { previousTech: ['quantum_shields', 'dimensional_science'] },
  prerequisiteFor: ['godly_protection', 'omniscient_defense'],
};

export const TECH_BIO_NEURAL_WEAPONS: Technology = {
  id: 'bio_neural_weapons',
  name: 'Bio-Neural Weapon Integration',
  displayName: 'Bio-Neural Weapons IV',
  category: 'weapons',
  tier: 'tier4',
  rarity: 'epic',
  description: 'Living organic weapons systems',
  longDescription: 'Merge biological consciousness with weapon systems for perfect targeting.',
  maxLevel: 3,
  baseResearchTime: 6500,
  researchTimeMultiplier: 1.75,
  baseCost: { credits: 7500, dilithium: 2700, tritanium: 1400 },
  costScaling: 2.02,
  stats: [
    { name: 'Self-Targeting', value: 100, unit: '%' },
    { name: 'Adaptive Damage', value: 50000, unit: 'HP' },
    { name: 'Learning Rate', value: 5, unit: '%/sec' },
  ],
  effects: [
    {
      type: 'adaptive_damage',
      modifier: 0.1,
      description: '+10% damage increase per hit per level',
      targetAttribute: 'scaling_damage',
    },
    {
      type: 'intelligence',
      modifier: 0.5,
      description: 'Weapons learn and adapt per level',
      targetAttribute: 'ai_targeting',
    },
  ],
  requirements: { previousTech: ['quantum_torpedoes', 'genetic_engineering'] },
  prerequisiteFor: ['hive_mind_weapons', 'god_killer_weapons'],
};

export const TECH_TEMPORAL_WEAPONS: Technology = {
  id: 'temporal_weapons',
  name: 'Temporal Distortion Cannons',
  displayName: 'Temporal Weapons IV',
  category: 'weapons',
  tier: 'tier4',
  rarity: 'epic',
  description: 'Attack across multiple timelines',
  longDescription: 'Fire weapons that exist in superposition across all timelines, making them impossible to dodge.',
  maxLevel: 2,
  baseResearchTime: 7000,
  researchTimeMultiplier: 1.8,
  baseCost: { credits: 8500, dilithium: 3200, tritanium: 1600 },
  costScaling: 2.1,
  stats: [
    { name: 'Damage per Timeline', value: 10000, unit: 'HP' },
    { name: 'Timelines Hit', value: 5, unit: 'count' },
    { name: 'Dodge Rate Nullification', value: 100, unit: '%' },
  ],
  effects: [
    {
      type: 'undodgeable',
      modifier: 1.0,
      description: 'Attack cannot be dodged per level',
      targetAttribute: 'guaranteed_hit',
    },
    {
      type: 'multiplied_damage',
      modifier: 4.0,
      description: '+400% damage hitting multiple timelines per level',
      targetAttribute: 'attack_power',
    },
  ],
  requirements: { previousTech: ['quantum_torpedoes', 'temporal_mechanics'] },
  prerequisiteFor: ['paradox_weapons', 'god_tier_weapons'],
};

export const TECH_DIMENSIONAL_SCIENCE: Technology = {
  id: 'dimensional_science',
  name: 'Dimensional Physics',
  displayName: 'Dimensional Science IV',
  category: 'science',
  tier: 'tier4',
  rarity: 'epic',
  description: 'Manipulate dimensions and space',
  longDescription: 'Unlock the secrets of higher-dimensional physics.',
  maxLevel: 3,
  baseResearchTime: 7000,
  researchTimeMultiplier: 1.8,
  baseCost: { credits: 8000, dilithium: 3000, tritanium: 1500 },
  costScaling: 2.05,
  stats: [
    { name: 'Dimensional Folding', value: 100, unit: '%' },
    { name: 'Space Compression', value: 50, unit: '%' },
  ],
  effects: [
    {
      type: 'space_manipulation',
      modifier: 0.5,
      description: '+50% all science tech effectiveness per level',
      targetAttribute: 'science_bonus',
    },
  ],
  requirements: { previousTech: ['quantum_physics', 'temporal_mechanics'] },
  prerequisiteFor: ['multiversal_science', 'reality_warping'],
};

export const TECH_BORG_NEURAL_LINK: Technology = {
  id: 'borg_neural_link',
  name: 'Borg Neural Link Adaptation',
  displayName: 'Borg Neural Link IV',
  category: 'science',
  tier: 'tier4',
  rarity: 'legendary',
  description: 'Integrate with Borg collective consciousness',
  longDescription: 'Achieve perfect crew coordination and knowledge sharing via neural links.',
  maxLevel: 2,
  baseResearchTime: 8000,
  researchTimeMultiplier: 1.9,
  baseCost: { credits: 10000, dilithium: 4000, tritanium: 2000 },
  costScaling: 2.2,
  stats: [
    { name: 'Efficiency Gain', value: 200, unit: '%' },
    { name: 'Coordinated Actions', value: 100, unit: '%' },
    { name: 'Adaptation Speed', value: 10, unit: '%/sec' },
  ],
  effects: [
    {
      type: 'coordination_bonus',
      modifier: 2.0,
      description: '+200% crew efficiency per level',
      targetAttribute: 'crew_efficiency',
    },
    {
      type: 'assimilation_resistance',
      modifier: 0.5,
      description: '+50% resistance to assimilation per level',
      targetAttribute: 'borg_resistance',
    },
  ],
  requirements: { previousTech: ['borg_assimilation_defense', 'genetic_engineering'] },
  conflictsWith: ['individuality_preservation'],
};

export const TECH_MOLECULAR_ENGINEERING: Technology = {
  id: 'molecular_engineering',
  name: 'Molecular-Level Engineering',
  displayName: 'Molecular Engineering IV',
  category: 'engineering',
  tier: 'tier4',
  rarity: 'epic',
  description: 'Reconstruct matter at the atomic level',
  longDescription: 'Convert any matter into any other matter composition.',
  maxLevel: 3,
  baseResearchTime: 6500,
  researchTimeMultiplier: 1.75,
  baseCost: { credits: 7000, dilithium: 2500, tritanium: 1200 },
  costScaling: 2.0,
  stats: [
    { name: 'Conversion Efficiency', value: 100, unit: '%' },
    { name: 'Speed', value: 1000, unit: 'units/sec' },
  ],
  effects: [
    {
      type: 'material_conversion',
      modifier: 1.0,
      description: 'Convert resources 1:1 per level',
      targetAttribute: 'resource_transmutation',
    },
  ],
  requirements: { previousTech: ['nanotechnology', 'quantum_physics'] },
  prerequisiteFor: ['universal_transmutation', 'matter_creation'],
};

// ============================================
// TIER 5 TECHNOLOGIES (End Game / Mythic)
// ============================================

export const TECH_TIME_TRAVEL: Technology = {
  id: 'time_travel',
  name: 'Temporal Time Travel Matrix',
  displayName: 'Time Travel V',
  category: 'temporal',
  tier: 'tier5',
  rarity: 'legendary',
  description: 'Travel backward through time itself',
  longDescription: 'Achieve the Holy Grail: true backward time travel without paradoxes.',
  maxLevel: 2,
  baseResearchTime: 10000,
  researchTimeMultiplier: 2.0,
  baseCost: { credits: 15000, dilithium: 5000, tritanium: 2500 },
  costScaling: 2.5,
  stats: [
    { name: 'Temporal Range', value: 1000, unit: 'years' },
    { name: 'Timeline Branches', value: 10, unit: 'count' },
    { name: 'Paradox Immunity', value: 100, unit: '%' },
  ],
  effects: [
    {
      type: 'time_travel',
      modifier: 1.0,
      description: 'Travel to any point in history per level',
      targetAttribute: 'time_control',
    },
    {
      type: 'timeline_creation',
      modifier: 0.5,
      description: 'Create alternate timelines per level',
      targetAttribute: 'reality_warping',
    },
  ],
  requirements: { previousTech: ['temporal_mechanics', 'temporal_shielding'] },
  prerequisiteFor: ['omniscience', 'godhood'],
};

export const TECH_GODLY_PROTECTION: Technology = {
  id: 'godly_protection',
  name: 'Omniscient Defense Matrix',
  displayName: 'Godly Protection V',
  category: 'defense',
  tier: 'tier5',
  rarity: 'legendary',
  description: 'Become virtually invulnerable',
  longDescription: 'Achieve god-like invulnerability through perfect defense.',
  maxLevel: 1,
  baseResearchTime: 12000,
  researchTimeMultiplier: 2.2,
  baseCost: { credits: 20000, dilithium: 7000, tritanium: 3500 },
  costScaling: 2.8,
  stats: [
    { name: 'Damage Immunity', value: 99.99, unit: '%' },
    { name: 'Shield Regen', value: 10000, unit: 'HP/sec' },
  ],
  effects: [
    {
      type: 'near_immunity',
      modifier: 0.9999,
      description: 'Reduce all damage by 99.99%',
      targetAttribute: 'damage_reduction',
    },
  ],
  requirements: { previousTech: ['dimensional_shields', 'zero_point_energy', 'omniscient_array'] },
};

export const TECH_GOD_KILLER_WEAPONS: Technology = {
  id: 'god_killer_weapons',
  name: 'God-Killer Weapon Array',
  displayName: 'God-Killer Weapons V',
  category: 'weapons',
  tier: 'tier5',
  rarity: 'legendary',
  description: 'Weapons that can kill gods',
  longDescription: 'The ultimate in destructive technology - weapons powerful enough to destroy deity-class entities.',
  maxLevel: 1,
  baseResearchTime: 12000,
  researchTimeMultiplier: 2.2,
  baseCost: { credits: 20000, dilithium: 7000, tritanium: 3500 },
  costScaling: 2.8,
  stats: [
    { name: 'Damage Output', value: 999999999, unit: 'HP' },
    { name: 'Accuracy', value: 100, unit: '%' },
    { name: 'Pierce Resistance', value: 100, unit: '%' },
  ],
  effects: [
    {
      type: 'godly_damage',
      modifier: 1.0,
      description: 'Damage everything without exception',
      targetAttribute: 'attack_power',
    },
  ],
  requirements: { previousTech: ['temporal_weapons', 'bio_neural_weapons', 'dimensional_science'] },
};

export const TECH_REALITY_WARPING: Technology = {
  id: 'reality_warping',
  name: 'Reality Warping Engine',
  displayName: 'Reality Warping V',
  category: 'science',
  tier: 'tier5',
  rarity: 'mythic',
  description: 'Rewrite the laws of physics',
  longDescription: 'Achieve absolute control over reality itself. Rewrite physics on a whim.',
  maxLevel: 1,
  baseResearchTime: 15000,
  researchTimeMultiplier: 2.5,
  baseCost: { credits: 25000, dilithium: 8000, tritanium: 4000 },
  costScaling: 3.0,
  stats: [
    { name: 'Reality Distortion', value: 100, unit: '%' },
    { name: 'Physics Control', value: 100, unit: '%' },
  ],
  effects: [
    {
      type: 'omnipotence',
      modifier: 1.0,
      description: 'Reshape reality itself',
      targetAttribute: 'god_power',
    },
  ],
  requirements: { previousTech: ['dimensional_science', 'quantum_physics', 'temporal_mechanics', 'zero_point_energy'] },
};

export const TECH_OMNISCIENT_ARRAY: Technology = {
  id: 'omniscient_array',
  name: 'Omniscient Sensor Network',
  displayName: 'Omniscient Array V',
  category: 'sensors',
  tier: 'tier5',
  rarity: 'legendary',
  description: 'See everything everywhere at once',
  longDescription: 'Achieve god-like awareness of all events across space and time.',
  maxLevel: 1,
  baseResearchTime: 11000,
  researchTimeMultiplier: 2.1,
  baseCost: { credits: 18000, dilithium: 6000, tritanium: 3000 },
  costScaling: 2.6,
  stats: [
    { name: 'Awareness Radius', value: 999999999, unit: 'km' },
    { name: 'Temporal Sight', value: 100, unit: '%' },
    { name: 'Dimensional Sight', value: 100, unit: '%' },
  ],
  effects: [
    {
      type: 'omniscience',
      modifier: 1.0,
      description: 'Know everything everywhere',
      targetAttribute: 'all_seeing_eye',
    },
  ],
  requirements: { previousTech: ['quantum_sensors', 'temporal_mechanics'] },
};

// ============================================
// SPECIALIZED RESEARCH TECHNOLOGIES
// ============================================

export const TECH_GENETIC_ENGINEERING: Technology = {
  id: 'genetic_engineering',
  name: 'Genetic Engineering Mastery',
  displayName: 'Genetic Engineering',
  category: 'science',
  tier: 'tier3',
  rarity: 'rare',
  description: 'Modify DNA at will',
  longDescription: 'Engineer perfect organisms for any task.',
  maxLevel: 5,
  baseResearchTime: 4500,
  researchTimeMultiplier: 1.55,
  baseCost: { credits: 3500, dilithium: 1000, tritanium: 500 },
  costScaling: 1.75,
  stats: [
    { name: 'Modification Accuracy', value: 99, unit: '%' },
    { name: 'Trait Expression', value: 100, unit: '%' },
  ],
  effects: [
    {
      type: 'crew_enhancement',
      modifier: 0.3,
      description: '+30% crew abilities per level',
      targetAttribute: 'crew_stats',
    },
  ],
  requirements: { previousTech: ['basic_medicine'] },
  prerequisiteFor: ['borg_neural_link', 'bio_neural_weapons'],
};

export const TECH_ADVANCED_IMPULSE_DRIVES: Technology = {
  id: 'advanced_impulse_drives',
  name: 'Advanced Impulse Drive Systems',
  displayName: 'Advanced Impulse Drives',
  category: 'propulsion',
  tier: 'tier2',
  rarity: 'uncommon',
  description: 'Enhanced sublight propulsion',
  longDescription: 'Push sublight engines to their theoretical limits.',
  maxLevel: 5,
  baseResearchTime: 3200,
  researchTimeMultiplier: 1.42,
  baseCost: { credits: 1600, dilithium: 400, tritanium: 200 },
  costScaling: 1.6,
  stats: [
    { name: 'Max Speed', value: 0.5, unit: 'c' },
    { name: 'Acceleration', value: 50, unit: 'G' },
  ],
  effects: [
    {
      type: 'speed_boost',
      modifier: 0.4,
      description: '+40% impulse speed per level',
      targetAttribute: 'impulse_speed',
    },
  ],
  requirements: { previousTech: ['impulse_drive'] },
  prerequisiteFor: ['quantum_slipstream', 'transwarp_corridor'],
};

export const TECH_TETRYON_WEAPONS: Technology = {
  id: 'tetryon_weapons',
  name: 'Tetryon Beam Emitters',
  displayName: 'Tetryon Weapons',
  category: 'weapons',
  tier: 'tier2',
  rarity: 'uncommon',
  description: 'High-energy particle beam weapons',
  longDescription: 'Fire exotic particle beams effective against starship hulls.',
  maxLevel: 5,
  baseResearchTime: 3300,
  researchTimeMultiplier: 1.45,
  baseCost: { credits: 1800, tritanium: 400, dilithium: 200 },
  costScaling: 1.62,
  stats: [
    { name: 'DPS', value: 600, unit: 'energy/sec' },
    { name: 'Hull Penetration', value: 60, unit: '%' },
    { name: 'Range', value: 28000, unit: 'km' },
  ],
  effects: [
    {
      type: 'hull_damage',
      modifier: 0.4,
      description: '+40% hull damage per level',
      targetAttribute: 'hull_penetration',
    },
  ],
  requirements: { previousTech: ['polaron_weapons'] },
  prerequisiteFor: ['plasma_weapons', 'disruptor_cannons'],
};

export const TECH_DISRUPTOR_CANNONS: Technology = {
  id: 'disruptor_cannons',
  name: 'Disruptor Cannon Technology',
  displayName: 'Disruptor Cannons',
  category: 'weapons',
  tier: 'tier3',
  rarity: 'rare',
  description: 'Matter disruption weapons',
  longDescription: 'Disrupt molecular bonds to vaporize targets instantly.',
  maxLevel: 4,
  baseResearchTime: 4900,
  researchTimeMultiplier: 1.6,
  baseCost: { credits: 4200, tritanium: 1000, dilithium: 700 },
  costScaling: 1.8,
  stats: [
    { name: 'Disintegration Damage', value: 8000, unit: 'HP' },
    { name: 'Instant Kill Chance', value: 5, unit: '%' },
  ],
  effects: [
    {
      type: 'disintegration',
      modifier: 0.6,
      description: '+60% instant kill chance per level',
      targetAttribute: 'one_shot_kill',
    },
  ],
  requirements: { previousTech: ['plasma_weapons'] },
  prerequisiteFor: ['wave_motion_cannon', 'annihilation_beam'],
};

export const TECH_SHIELD_HARMONICS: Technology = {
  id: 'shield_harmonics',
  name: 'Shield Harmonic Resonance',
  displayName: 'Shield Harmonics',
  category: 'defense',
  tier: 'tier2',
  rarity: 'uncommon',
  description: 'Synchronize shield frequencies',
  longDescription: 'Use resonance patterns to maximize shield efficiency.',
  maxLevel: 5,
  baseResearchTime: 3400,
  researchTimeMultiplier: 1.44,
  baseCost: { credits: 1700, dilithium: 500 },
  costScaling: 1.58,
  stats: [
    { name: 'Resonance Amplification', value: 50, unit: '%' },
    { name: 'Frequency Adaptation', value: 70, unit: '%' },
  ],
  effects: [
    {
      type: 'shield_amplification',
      modifier: 0.3,
      description: '+30% shield effectiveness per level',
      targetAttribute: 'shield_strength',
    },
  ],
  requirements: { previousTech: ['advanced_shields'] },
  prerequisiteFor: ['quantum_shields', 'dimensional_shields'],
};

export const TECH_TEMPORAL_SHIELDING: Technology = {
  id: 'temporal_shielding',
  name: 'Temporal Shield Generators',
  displayName: 'Temporal Shielding',
  category: 'defense',
  tier: 'tier3',
  rarity: 'rare',
  description: 'Shields that work across time',
  longDescription: 'Create protective barriers that protect you from attacks before they happen.',
  maxLevel: 4,
  baseResearchTime: 5000,
  researchTimeMultiplier: 1.62,
  baseCost: { credits: 4500, dilithium: 1500, tritanium: 750 },
  costScaling: 1.82,
  stats: [
    { name: 'Prediction Accuracy', value: 90, unit: '%' },
    { name: 'Preemptive Protection', value: 80, unit: '%' },
  ],
  effects: [
    {
      type: 'dodge_boost',
      modifier: 0.8,
      description: '+80% dodge chance per level',
      targetAttribute: 'evasion',
    },
  ],
  requirements: { previousTech: ['quantum_shields', 'temporal_mechanics'] },
  prerequisiteFor: ['time_travel', 'godly_protection'],
};

export const TECH_WAVE_MOTION_CANNON: Technology = {
  id: 'wave_motion_cannon',
  name: 'Wave Motion Cannon System',
  displayName: 'Wave Motion Cannon',
  category: 'weapons',
  tier: 'tier4',
  rarity: 'epic',
  description: 'Massive beam weapon of ultimate power',
  longDescription: 'Channel massive energy into a planet-destroying beam.',
  maxLevel: 2,
  baseResearchTime: 7500,
  researchTimeMultiplier: 1.85,
  baseCost: { credits: 9000, dilithium: 3500, tritanium: 1800 },
  costScaling: 2.15,
  stats: [
    { name: 'Damage Output', value: 50000, unit: 'HP' },
    { name: 'Charge Time', value: 30, unit: 'sec' },
    { name: 'Coverage Area', value: 50000, unit: 'km' },
  ],
  effects: [
    {
      type: 'planetary_destruction',
      modifier: 1.0,
      description: 'Can destroy planets per level',
      targetAttribute: 'destructive_power',
    },
  ],
  requirements: { previousTech: ['disruptor_cannons', 'zero_point_energy'] },
  prerequisiteFor: ['death_star_weapon', 'galaxy_eraser'],
};

export const TECH_MULTIVERSAL_SCIENCE: Technology = {
  id: 'multiversal_science',
  name: 'Multiversal Physics',
  displayName: 'Multiversal Science',
  category: 'science',
  tier: 'tier4',
  rarity: 'epic',
  description: 'Understand the multiverse',
  longDescription: 'Access knowledge from infinite parallel universes.',
  maxLevel: 2,
  baseResearchTime: 7000,
  researchTimeMultiplier: 1.8,
  baseCost: { credits: 8500, dilithium: 3000, tritanium: 1500 },
  costScaling: 2.08,
  stats: [
    { name: 'Multiverse Access', value: 100, unit: '%' },
    { name: 'Knowledge Gain', value: 500, unit: '%' },
  ],
  effects: [
    {
      type: 'knowledge_multiplier',
      modifier: 5.0,
      description: '+500% research speed per level',
      targetAttribute: 'research_speed',
    },
  ],
  requirements: { previousTech: ['dimensional_science', 'quantum_physics'] },
  prerequisiteFor: ['omniscience', 'godhood'],
};

export const TECH_ANNIHILATION_BEAM: Technology = {
  id: 'annihilation_beam',
  name: 'Matter-Antimatter Annihilation Beam',
  displayName: 'Annihilation Beam',
  category: 'weapons',
  tier: 'tier4',
  rarity: 'epic',
  description: 'Convert target to pure energy',
  longDescription: 'Create a beam that annihilates matter completely, leaving nothing behind.',
  maxLevel: 2,
  baseResearchTime: 7200,
  researchTimeMultiplier: 1.82,
  baseCost: { credits: 8800, dilithium: 3200, tritanium: 1600 },
  costScaling: 2.12,
  stats: [
    { name: 'Annihilation Damage', value: 100000, unit: 'HP' },
    { name: 'Nothing Survives', value: 100, unit: '%' },
  ],
  effects: [
    {
      type: 'complete_destruction',
      modifier: 1.0,
      description: 'Leave no trace of target per level',
      targetAttribute: 'obliteration_power',
    },
  ],
  requirements: { previousTech: ['disruptor_cannons', 'antimatter_reactors'] },
  prerequisiteFor: ['god_killer_weapons', 'universal_annihilation'],
};

export const TECH_INDIVIDUALITY_PRESERVATION: Technology = {
  id: 'individuality_preservation',
  name: 'Individuality Preservation Matrix',
  displayName: 'Individuality Preservation',
  category: 'defense',
  tier: 'tier3',
  rarity: 'rare',
  description: 'Protect against assimilation',
  longDescription: 'Preserve individual consciousness against Borg assimilation.',
  maxLevel: 5,
  baseResearchTime: 4000,
  researchTimeMultiplier: 1.5,
  baseCost: { credits: 3000, dilithium: 800, tritanium: 400 },
  costScaling: 1.7,
  stats: [
    { name: 'Borg Resistance', value: 100, unit: '%' },
    { name: 'Mind Control Immunity', value: 100, unit: '%' },
  ],
  effects: [
    {
      type: 'assimilation_immunity',
      modifier: 1.0,
      description: 'Cannot be assimilated per level',
      targetAttribute: 'borg_resistance',
    },
  ],
  requirements: { previousTech: ['basic_medicine', 'sensor_arrays'] },
  conflictsWith: ['borg_neural_link'],
};

export const TECH_DEEP_SPACE_PROSPECTING: Technology = {
  id: 'deep_space_prospecting',
  name: 'Deep Space Resource Prospecting',
  displayName: 'Deep Space Prospecting',
  category: 'economy',
  tier: 'tier2',
  rarity: 'uncommon',
  description: 'Find resources in deep space',
  longDescription: 'Discover rare resources in the void between stars.',
  maxLevel: 5,
  baseResearchTime: 2800,
  researchTimeMultiplier: 1.35,
  baseCost: { credits: 1200, dilithium: 300 },
  costScaling: 1.5,
  stats: [
    { name: 'Deep Space Yield', value: 200, unit: '%' },
    { name: 'Rare Resource Chance', value: 30, unit: '%' },
  ],
  effects: [
    {
      type: 'resource_quality',
      modifier: 0.5,
      description: '+50% resource value per level',
      targetAttribute: 'mining_yield',
    },
  ],
  requirements: { previousTech: ['resource_scanning'] },
  prerequisiteFor: ['black_hole_mining', 'exotic_matter_harvesting'],
};

export const TECH_BLACK_HOLE_MINING: Technology = {
  id: 'black_hole_mining',
  name: 'Black Hole Energy Harvesting',
  displayName: 'Black Hole Mining',
  category: 'economy',
  tier: 'tier3',
  rarity: 'rare',
  description: 'Extract energy from black holes',
  longDescription: 'Safely harvest massive energy from the event horizons of black holes.',
  maxLevel: 4,
  baseResearchTime: 4500,
  researchTimeMultiplier: 1.55,
  baseCost: { credits: 3500, dilithium: 1200, tritanium: 600 },
  costScaling: 1.75,
  stats: [
    { name: 'Energy per Second', value: 100000, unit: 'MW' },
    { name: 'Safety Margin', value: 99, unit: '%' },
  ],
  effects: [
    {
      type: 'energy_production',
      modifier: 0.8,
      description: '+80% energy production per level',
      targetAttribute: 'power_generation',
    },
  ],
  requirements: { previousTech: ['deep_space_prospecting', 'zero_point_energy'] },
  prerequisiteFor: ['exotic_matter_harvesting', 'supernova_power'],
};

export const TECH_EXOTIC_MATTER_HARVESTING: Technology = {
  id: 'exotic_matter_harvesting',
  name: 'Exotic Matter Harvesting',
  displayName: 'Exotic Matter Harvesting',
  category: 'economy',
  tier: 'tier4',
  rarity: 'epic',
  description: 'Harvest matter from other dimensions',
  longDescription: 'Extract exotic matter with impossible properties from other dimensions.',
  maxLevel: 3,
  baseResearchTime: 6500,
  researchTimeMultiplier: 1.75,
  baseCost: { credits: 7000, dilithium: 2500, tritanium: 1200 },
  costScaling: 2.0,
  stats: [
    { name: 'Exotic Matter Yield', value: 1000, unit: 'units/min' },
    { name: 'Matter Quality', value: 100, unit: '%' },
  ],
  effects: [
    {
      type: 'infinite_resources',
      modifier: 1.0,
      description: 'Access unlimited exotic resources per level',
      targetAttribute: 'resource_production',
    },
  ],
  requirements: { previousTech: ['black_hole_mining', 'dimensional_science'] },
  prerequisiteFor: ['matter_creation', 'godhood'],
};

export const TECH_SUPERNOVA_POWER: Technology = {
  id: 'supernova_power',
  name: 'Supernova Power Conduits',
  displayName: 'Supernova Power',
  category: 'engineering',
  tier: 'tier4',
  rarity: 'epic',
  description: 'Harness supernova energy',
  longDescription: 'Safely contain and use the power of supernovae.',
  maxLevel: 2,
  baseResearchTime: 6800,
  researchTimeMultiplier: 1.8,
  baseCost: { credits: 8000, dilithium: 2800, tritanium: 1400 },
  costScaling: 2.05,
  stats: [
    { name: 'Power Output', value: 1000000, unit: 'MW' },
    { name: 'Containment', value: 100, unit: '%' },
  ],
  effects: [
    {
      type: 'unlimited_power',
      modifier: 1.0,
      description: 'Unlimited clean energy per level',
      targetAttribute: 'energy_pool',
    },
  ],
  requirements: { previousTech: ['zero_point_energy', 'black_hole_mining'] },
  prerequisiteFor: ['godhood', 'omnipotence'],
};

export const TECH_STASIS_CONTAINMENT: Technology = {
  id: 'stasis_containment',
  name: 'Temporal Stasis Containment',
  displayName: 'Stasis Containment',
  category: 'engineering',
  tier: 'tier2',
  rarity: 'uncommon',
  description: 'Freeze cargo in time',
  longDescription: 'Place cargo in stasis fields to prevent decay and maximize storage.',
  maxLevel: 5,
  baseResearchTime: 2900,
  researchTimeMultiplier: 1.38,
  baseCost: { credits: 1300, dilithium: 400 },
  costScaling: 1.52,
  stats: [
    { name: 'Stasis Preservation', value: 100, unit: '%' },
    { name: 'Storage Multiplier', value: 5, unit: 'x' },
  ],
  effects: [
    {
      type: 'storage_bonus',
      modifier: 0.5,
      description: '+50% cargo capacity per level',
      targetAttribute: 'transport_capacity',
    },
  ],
  requirements: { previousTech: ['cargo_optimization', 'temporal_mechanics'] },
  prerequisiteFor: ['dimensional_storage', 'pocket_dimension_vault'],
};

export const TECH_MATTER_CREATION: Technology = {
  id: 'matter_creation',
  name: 'Matter Creation Engine',
  displayName: 'Matter Creation',
  category: 'science',
  tier: 'tier5',
  rarity: 'legendary',
  description: 'Create matter from nothing',
  longDescription: 'Violate conservation of mass. Create any matter desired from quantum foam.',
  maxLevel: 1,
  baseResearchTime: 11000,
  researchTimeMultiplier: 2.1,
  baseCost: { credits: 18000, dilithium: 6000, tritanium: 3000 },
  costScaling: 2.6,
  stats: [
    { name: 'Creation Rate', value: 999999999, unit: 'units/min' },
    { name: 'Fidelity', value: 100, unit: '%' },
  ],
  effects: [
    {
      type: 'infinite_resources',
      modifier: 1.0,
      description: 'Create unlimited resources',
      targetAttribute: 'resource_generation',
    },
  ],
  requirements: { previousTech: ['exotic_matter_harvesting', 'molecular_engineering'] },
};

export const TECH_DIMENSIONAL_TRAVEL: Technology = {
  id: 'dimensional_travel',
  name: 'Dimensional Travel Portals',
  displayName: 'Dimensional Travel',
  category: 'propulsion',
  tier: 'tier4',
  rarity: 'epic',
  description: 'Travel between dimensions',
  longDescription: 'Open stable portals to alternate dimensions for exploration.',
  maxLevel: 2,
  baseResearchTime: 6500,
  researchTimeMultiplier: 1.75,
  baseCost: { credits: 7500, dilithium: 2700, tritanium: 1350 },
  costScaling: 2.02,
  stats: [
    { name: 'Portal Stability', value: 99, unit: '%' },
    { name: 'Dimensions Accessible', value: 100, unit: 'count' },
  ],
  effects: [
    {
      type: 'dimensional_access',
      modifier: 1.0,
      description: 'Access all dimensions per level',
      targetAttribute: 'exploration_range',
    },
  ],
  requirements: { previousTech: ['quantum_tunneling', 'dimensional_science'] },
  prerequisiteFor: ['omniscience', 'godhood'],
};

export const TECH_OMNISCIENCE: Technology = {
  id: 'omniscience',
  name: 'Omniscience Achievement Matrix',
  displayName: 'Omniscience V',
  category: 'science',
  tier: 'tier5',
  rarity: 'mythic',
  description: 'Know everything',
  longDescription: 'Achieve complete knowledge of all things past, present, and future.',
  maxLevel: 1,
  baseResearchTime: 15000,
  researchTimeMultiplier: 2.5,
  baseCost: { credits: 25000, dilithium: 8000, tritanium: 4000 },
  costScaling: 3.0,
  stats: [
    { name: 'Knowledge', value: 100, unit: '%' },
    { name: 'Omniscience', value: 100, unit: '%' },
  ],
  effects: [
    {
      type: 'omniscience_achieved',
      modifier: 1.0,
      description: 'Know all things',
      targetAttribute: 'infinite_knowledge',
    },
  ],
  requirements: { previousTech: ['omniscient_array', 'time_travel', 'dimensional_travel'] },
  prerequisiteFor: ['godhood'],
};

export const TECH_GODHOOD: Technology = {
  id: 'godhood',
  name: 'Ascension to Godhood',
  displayName: 'Godhood V',
  category: 'special',
  tier: 'tier5',
  rarity: 'mythic',
  description: 'Become a god',
  longDescription: 'Transcend mortal limitations and ascend to godhood. Become omniscient, omnipotent, omnipresent.',
  maxLevel: 1,
  baseResearchTime: 20000,
  researchTimeMultiplier: 3.0,
  baseCost: { credits: 30000, dilithium: 10000, tritanium: 5000 },
  costScaling: 3.5,
  stats: [
    { name: 'Divine Power', value: 99999999, unit: '%' },
    { name: 'Immortality', value: 100, unit: '%' },
  ],
  effects: [
    {
      type: 'godhood_achieved',
      modifier: 1.0,
      description: 'Become a god - win the game',
      targetAttribute: 'victory_condition',
    },
  ],
  requirements: { previousTech: ['omniscience', 'godly_protection', 'god_killer_weapons', 'reality_warping'] },
};

// ============================================
// ADDITIONAL SPECIALIZED TECHNOLOGIES
// ============================================

export const TECH_DIMENSIONAL_CLOAKING: Technology = {
  id: 'dimensional_cloaking',
  name: 'Dimensional Cloaking Array',
  displayName: 'Dimensional Cloaking',
  category: 'defense',
  tier: 'tier4',
  rarity: 'epic',
  description: 'Hide in alternate dimensions',
  longDescription: 'Phase your ship partially into another dimension where no sensors can detect you.',
  maxLevel: 2,
  baseResearchTime: 6200,
  researchTimeMultiplier: 1.72,
  baseCost: { credits: 7200, dilithium: 2600, tritanium: 1300 },
  costScaling: 2.0,
  stats: [
    { name: 'Dimensional Phase', value: 99, unit: '%' },
    { name: 'Detection Immunity', value: 100, unit: '%' },
  ],
  effects: [
    {
      type: 'perfect_invisibility',
      modifier: 1.0,
      description: 'Perfect stealth per level',
      targetAttribute: 'stealth_rating',
    },
  ],
  requirements: { previousTech: ['advanced_cloaking', 'dimensional_science'] },
  prerequisiteFor: ['perfect_invisibility', 'omniscience'],
};

export const TECH_PERFECT_INVISIBILITY: Technology = {
  id: 'perfect_invisibility',
  name: 'Perfect Invisibility Protocol',
  displayName: 'Perfect Invisibility',
  category: 'defense',
  tier: 'tier5',
  rarity: 'legendary',
  description: 'Become truly invisible',
  longDescription: 'Achieve complete invisibility even to omniscient sensors.',
  maxLevel: 1,
  baseResearchTime: 10000,
  researchTimeMultiplier: 2.0,
  baseCost: { credits: 16000, dilithium: 5500, tritanium: 2750 },
  costScaling: 2.5,
  stats: [
    { name: 'Invisibility', value: 100, unit: '%' },
    { name: 'Sensor Evasion', value: 100, unit: '%' },
  ],
  effects: [
    {
      type: 'absolute_invisibility',
      modifier: 1.0,
      description: 'Absolutely invisible to all detection',
      targetAttribute: 'stealth_rating',
    },
  ],
  requirements: { previousTech: ['dimensional_cloaking'] },
};

export const TECH_HIVE_MIND_WEAPONS: Technology = {
  id: 'hive_mind_weapons',
  name: 'Hive Mind Weapon Network',
  displayName: 'Hive Mind Weapons',
  category: 'weapons',
  tier: 'tier5',
  rarity: 'legendary',
  description: 'Weapons with collective intelligence',
  longDescription: 'Weapons that share a unified consciousness for perfect coordination.',
  maxLevel: 1,
  baseResearchTime: 11500,
  researchTimeMultiplier: 2.15,
  baseCost: { credits: 19000, dilithium: 6500, tritanium: 3250 },
  costScaling: 2.65,
  stats: [
    { name: 'Coordination', value: 100, unit: '%' },
    { name: 'Combined Damage', value: 500000, unit: 'HP' },
  ],
  effects: [
    {
      type: 'perfect_coordination',
      modifier: 1.0,
      description: 'All weapons perfectly coordinated',
      targetAttribute: 'attack_power',
    },
  ],
  requirements: { previousTech: ['bio_neural_weapons'] },
};

export const TECH_PARADOX_WEAPONS: Technology = {
  id: 'paradox_weapons',
  name: 'Temporal Paradox Weapons',
  displayName: 'Paradox Weapons',
  category: 'weapons',
  tier: 'tier5',
  rarity: 'legendary',
  description: 'Weapons that cause temporal paradoxes',
  longDescription: 'Fire weapons that erase targets from existence across all timelines.',
  maxLevel: 1,
  baseResearchTime: 12000,
  researchTimeMultiplier: 2.2,
  baseCost: { credits: 20000, dilithium: 7000, tritanium: 3500 },
  costScaling: 2.7,
  stats: [
    { name: 'Paradox Damage', value: 999999999, unit: 'HP' },
    { name: 'Timeline Erasure', value: 100, unit: '%' },
  ],
  effects: [
    {
      type: 'existence_erasure',
      modifier: 1.0,
      description: 'Erase targets from all existence',
      targetAttribute: 'absolute_destruction',
    },
  ],
  requirements: { previousTech: ['temporal_weapons', 'time_travel'] },
};

export const TECH_POCKET_DIMENSION_VAULT: Technology = {
  id: 'pocket_dimension_vault',
  name: 'Pocket Dimension Storage Vault',
  displayName: 'Pocket Dimension Vault',
  category: 'engineering',
  tier: 'tier4',
  rarity: 'epic',
  description: 'Store infinite resources in pocket dimensions',
  longDescription: 'Create pocket dimensions to store unlimited resources safely.',
  maxLevel: 2,
  baseResearchTime: 6800,
  researchTimeMultiplier: 1.8,
  baseCost: { credits: 8000, dilithium: 2800, tritanium: 1400 },
  costScaling: 2.05,
  stats: [
    { name: 'Storage Capacity', value: 999999999, unit: 'units' },
    { name: 'Access Speed', value: 100, unit: '%' },
  ],
  effects: [
    {
      type: 'infinite_storage',
      modifier: 1.0,
      description: 'Infinite storage per level',
      targetAttribute: 'inventory_size',
    },
  ],
  requirements: { previousTech: ['stasis_containment', 'dimensional_science'] },
};

export const TECH_DEATH_STAR_WEAPON: Technology = {
  id: 'death_star_weapon',
  name: 'Death Star Superlaser',
  displayName: 'Death Star Weapon',
  category: 'weapons',
  tier: 'tier5',
  rarity: 'mythic',
  description: 'Destroy entire solar systems',
  longDescription: 'Channel the power of a star into a single devastating beam.',
  maxLevel: 1,
  baseResearchTime: 13000,
  researchTimeMultiplier: 2.3,
  baseCost: { credits: 22000, dilithium: 7500, tritanium: 3750 },
  costScaling: 2.8,
  stats: [
    { name: 'System Destruction', value: 1, unit: 'range' },
    { name: 'Damage', value: 9999999999, unit: 'HP' },
  ],
  effects: [
    {
      type: 'system_annihilation',
      modifier: 1.0,
      description: 'Destroy entire star systems',
      targetAttribute: 'apocalyptic_power',
    },
  ],
  requirements: { previousTech: ['wave_motion_cannon', 'god_killer_weapons'] },
};

export const TECH_GALAXY_ERASER: Technology = {
  id: 'galaxy_eraser',
  name: 'Galaxy Eraser Protocol',
  displayName: 'Galaxy Eraser',
  category: 'weapons',
  tier: 'tier5',
  rarity: 'mythic',
  description: 'Delete entire galaxies',
  longDescription: 'Erase entire galaxies from the fabric of spacetime.',
  maxLevel: 1,
  baseResearchTime: 14000,
  researchTimeMultiplier: 2.4,
  baseCost: { credits: 24000, dilithium: 8000, tritanium: 4000 },
  costScaling: 2.9,
  stats: [
    { name: 'Galaxy Annihilation', value: 1, unit: 'range' },
    { name: 'Damage', value: 99999999999, unit: 'HP' },
  ],
  effects: [
    {
      type: 'galactic_erasure',
      modifier: 1.0,
      description: 'Destroy entire galaxies',
      targetAttribute: 'universal_destruction',
    },
  ],
  requirements: { previousTech: ['death_star_weapon', 'reality_warping'] },
};

export const TECH_UNIVERSAL_ANNIHILATION: Technology = {
  id: 'universal_annihilation',
  name: 'Universal Annihilation Device',
  displayName: 'Universal Annihilation',
  category: 'weapons',
  tier: 'tier5',
  rarity: 'mythic',
  description: 'Destroy everything',
  longDescription: 'Create a wave of destruction that unmakes everything it touches.',
  maxLevel: 1,
  baseResearchTime: 15000,
  researchTimeMultiplier: 2.5,
  baseCost: { credits: 25000, dilithium: 8000, tritanium: 4000 },
  costScaling: 3.0,
  stats: [
    { name: 'Universal Erasure', value: 1, unit: 'range' },
    { name: 'Omni-Damage', value: 999999999999, unit: 'HP' },
  ],
  effects: [
    {
      type: 'reality_destruction',
      modifier: 1.0,
      description: 'Destroy all existence',
      targetAttribute: 'doomsday_device',
    },
  ],
  requirements: { previousTech: ['galaxy_eraser', 'annihilation_beam'] },
};

// ============================================
// RESEARCH SYSTEM FUNCTIONS
// ============================================

// Array of all technologies
export const ALL_TECHNOLOGIES: Technology[] = [
  // Tier 1
  TECH_WARP_CORE_BASICS,
  TECH_PHASER_EMITTERS,
  TECH_SHIELD_GENERATORS,
  TECH_SENSOR_ARRAYS,
  TECH_DILITHIUM_REFINING,
  TECH_CARGO_OPTIMIZATION,
  TECH_BASIC_MEDICINE,
  TECH_NUCLEAR_FISSION,
  TECH_IMPULSE_DRIVE,
  TECH_RESOURCE_SCANNING,
  // Tier 2
  TECH_ADVANCED_WARP_DRIVE,
  TECH_PHOTON_TORPEDOES,
  TECH_ADVANCED_SHIELDS,
  TECH_QUANTUM_SENSORS,
  TECH_ANTIMATTER_REACTORS,
  TECH_CLOAK_TECHNOLOGY,
  TECH_TRANSWARP_CORRIDOR,
  TECH_REGENERATIVE_HULL,
  TECH_WARP_FIELD_HARMONICS,
  TECH_POLARON_WEAPONS,
  TECH_ADVANCED_IMPULSE_DRIVES,
  TECH_TETRYON_WEAPONS,
  TECH_SHIELD_HARMONICS,
  TECH_DEEP_SPACE_PROSPECTING,
  TECH_STASIS_CONTAINMENT,
  TECH_TACHYON_EMITTERS,
  TECH_SONIC_DISRUPTORS,
  TECH_NEUTRINO_DETECTION,
  TECH_SHIELD_OSCILLATION,
  // Tier 3
  TECH_QUANTUM_TORPEDOES,
  TECH_QUANTUM_SHIELDS,
  TECH_QUANTUM_PHYSICS,
  TECH_TEMPORAL_MECHANICS,
  TECH_ZERO_POINT_ENERGY,
  TECH_ADVANCED_CLOAKING,
  TECH_NANOTECHNOLOGY,
  TECH_PLASMA_WEAPONS,
  TECH_QUANTUM_SLIPSTREAM,
  TECH_GENETIC_ENGINEERING,
  TECH_DISRUPTOR_CANNONS,
  TECH_TEMPORAL_SHIELDING,
  TECH_BLACK_HOLE_MINING,
  TECH_INDIVIDUALITY_PRESERVATION,
  TECH_GRAVITON_WEAPONS,
  TECH_GRAVITIC_RESONANCE,
  TECH_CHRONO_ACCELERATOR,
  TECH_ADAPTIVE_ARMOR,
  TECH_KINETIC_ABSORPTION,
  TECH_ENERGY_REFLECTION,
  // Tier 4
  TECH_QUANTUM_TUNNELING,
  TECH_DIMENSIONAL_SHIELDS,
  TECH_BIO_NEURAL_WEAPONS,
  TECH_TEMPORAL_WEAPONS,
  TECH_DIMENSIONAL_SCIENCE,
  TECH_BORG_NEURAL_LINK,
  TECH_MOLECULAR_ENGINEERING,
  TECH_WAVE_MOTION_CANNON,
  TECH_MULTIVERSAL_SCIENCE,
  TECH_ANNIHILATION_BEAM,
  TECH_DIMENSIONAL_TRAVEL,
  TECH_DIMENSIONAL_CLOAKING,
  TECH_SUPERNOVA_POWER,
  TECH_EXOTIC_MATTER_HARVESTING,
  TECH_POCKET_DIMENSION_VAULT,
  TECH_STELLAR_COLLAPSE_WEAPON,
  TECH_CHRONO_WEAPONIZATION,
  TECH_PERFECT_DEFENSE,
  TECH_PERPETUAL_MOTION,
  // Tier 5
  TECH_TIME_TRAVEL,
  TECH_GODLY_PROTECTION,
  TECH_GOD_KILLER_WEAPONS,
  TECH_REALITY_WARPING,
  TECH_OMNISCIENT_ARRAY,
  TECH_OMNISCIENCE,
  TECH_GODHOOD,
  TECH_MATTER_CREATION,
  TECH_PERFECT_INVISIBILITY,
  TECH_HIVE_MIND_WEAPONS,
  TECH_PARADOX_WEAPONS,
  TECH_DEATH_STAR_WEAPON,
  TECH_GALAXY_ERASER,
  TECH_UNIVERSAL_ANNIHILATION,
  TECH_TEMPORAL_ANNIHILATION,
  TECH_UNIVERSE_CRUSHING_ENGINE,
];

// Get technology by ID
export function getTechById(id: string): Technology | undefined {
  return ALL_TECHNOLOGIES.find(tech => tech.id === id);
}

// Get all technologies by category
export function getTechsByCategory(category: TechCategory): Technology[] {
  return ALL_TECHNOLOGIES.filter(tech => tech.category === category);
}

// Get all technologies by tier
export function getTechsByTier(tier: TechTier): Technology[] {
  return ALL_TECHNOLOGIES.filter(tech => tech.tier === tier);
}

// Get all technologies by rarity
export function getTechsByRarity(rarity: TechRarity): Technology[] {
  return ALL_TECHNOLOGIES.filter(tech => tech.rarity === rarity);
}

// Calculate research cost for a technology level
export function calculateResearchCost(tech: Technology, level: number): Record<string, number> {
  const baseCost = { ...tech.baseCost };
  const multiplier = Math.pow(tech.costScaling, level - 1);
  
  const cost: Record<string, number> = {};
  for (const [resource, amount] of Object.entries(baseCost)) {
    cost[resource] = Math.floor(amount * multiplier);
  }
  return cost;
}

// Calculate research time for a technology level
export function calculateResearchTime(tech: Technology, level: number): number {
  const multiplier = Math.pow(tech.researchTimeMultiplier, level - 1);
  return Math.floor(tech.baseResearchTime * multiplier);
}

// Get research effect bonus
export function calculateTechBonus(tech: Technology, level: number): Record<string, number> {
  const bonuses: Record<string, number> = {};
  
  for (const effect of tech.effects) {
    const totalModifier = effect.modifier * level;
    bonuses[effect.targetAttribute] = (bonuses[effect.targetAttribute] || 0) + totalModifier;
  }
  
  return bonuses;
}

// Check if a technology can be researched
export function canResearchTech(tech: Technology, playerData: any): boolean {
  const req = tech.requirements;
  
  if (req.minimumPlayerLevel && playerData.level < req.minimumPlayerLevel) {
    return false;
  }
  
  if (req.previousTech) {
    for (const prevTechId of req.previousTech) {
      const prevTech = getTechById(prevTechId);
      if (!prevTech || !playerData.researchedTechs?.[prevTechId]) {
        return false;
      }
    }
  }
  
  if (req.requiredBuildings) {
    for (const building of req.requiredBuildings) {
      if (!playerData.buildings?.[building]) {
        return false;
      }
    }
  }
  
  return true;
}

// Get all available technologies for research
export function getAvailableTechs(playerData: any): Technology[] {
  return ALL_TECHNOLOGIES.filter(tech => canResearchTech(tech, playerData));
}

// Calculate total research cost for multiple levels
export function calculateTotalResearchCost(tech: Technology, startLevel: number, endLevel: number): Record<string, number> {
  const totalCost: Record<string, number> = {};
  
  for (let level = startLevel; level < endLevel; level++) {
    const levelCost = calculateResearchCost(tech, level);
    for (const [resource, amount] of Object.entries(levelCost)) {
      totalCost[resource] = (totalCost[resource] || 0) + amount;
    }
  }
  
  return totalCost;
}

// Get synergistic bonuses
export function getSynergyBonus(tech: Technology, researchedTechs: string[]): number {
  let bonus = 1;
  
  if (tech.synergiesWith) {
    for (const synergyTechId of tech.synergiesWith) {
      if (researchedTechs.includes(synergyTechId)) {
        bonus *= 1.1; // 10% bonus per synergy
      }
    }
  }
  
  return bonus;
}

// Check for conflicting technologies
export function hasConflicts(tech: Technology, researchedTechs: string[]): boolean {
  if (tech.conflictsWith) {
    for (const conflictTechId of tech.conflictsWith) {
      if (researchedTechs.includes(conflictTechId)) {
        return true;
      }
    }
  }
  return false;
}

// ============================================
// ADDITIONAL SPECIALIZED TECHNOLOGIES (15+)
// ============================================

export const TECH_TACHYON_EMITTERS: Technology = {
  id: 'tachyon_emitters',
  name: 'Tachyon Particle Emitters',
  displayName: 'Tachyon Emitters',
  category: 'sensors',
  tier: 'tier2',
  rarity: 'uncommon',
  description: 'Emit faster-than-light particles for early warning',
  longDescription: 'Send tachyon signals to detect threats before they arrive.',
  maxLevel: 5,
  baseResearchTime: 2600,
  researchTimeMultiplier: 1.32,
  baseCost: { credits: 1400, dilithium: 350 },
  costScaling: 1.53,
  stats: [
    { name: 'Early Warning Time', value: 300, unit: 'sec' },
    { name: 'Detection Accuracy', value: 85, unit: '%' },
  ],
  effects: [
    {
      type: 'early_detection',
      modifier: 0.3,
      description: '+30% warning time per level',
      targetAttribute: 'reaction_time',
    },
  ],
  requirements: { previousTech: ['sensor_arrays'] },
  prerequisiteFor: ['quantum_sensors'],
};

export const TECH_GRAVITON_WEAPONS: Technology = {
  id: 'graviton_weapons',
  name: 'Graviton Beam Cannons',
  displayName: 'Graviton Weapons',
  category: 'weapons',
  tier: 'tier3',
  rarity: 'rare',
  description: 'Weapons using controlled gravitational fields',
  longDescription: 'Crush targets using weaponized gravity wells.',
  maxLevel: 4,
  baseResearchTime: 4700,
  researchTimeMultiplier: 1.58,
  baseCost: { credits: 4000, tritanium: 900, dilithium: 500 },
  costScaling: 1.78,
  stats: [
    { name: 'Crushing Force', value: 4000, unit: 'HP' },
    { name: 'Gravity Well Radius', value: 20000, unit: 'km' },
    { name: 'Pull Strength', value: 500, unit: 'G' },
  ],
  effects: [
    {
      type: 'gravitational_damage',
      modifier: 0.45,
      description: '+45% crushing damage per level',
      targetAttribute: 'attack_power',
    },
    {
      type: 'immobilization',
      modifier: 0.3,
      description: '+30% slow effect per level',
      targetAttribute: 'crowd_control',
    },
  ],
  requirements: { previousTech: ['polaron_weapons', 'quantum_physics'] },
  prerequisiteFor: ['stellar_collapse_weapon'],
};

export const TECH_STELLAR_COLLAPSE_WEAPON: Technology = {
  id: 'stellar_collapse_weapon',
  name: 'Stellar Collapse Inducer',
  displayName: 'Stellar Collapse Weapon',
  category: 'weapons',
  tier: 'tier4',
  rarity: 'epic',
  description: 'Induce stellar collapse in target star',
  longDescription: 'Cause a star to undergo catastrophic collapse, destroying everything nearby.',
  maxLevel: 2,
  baseResearchTime: 7000,
  researchTimeMultiplier: 1.8,
  baseCost: { credits: 8500, dilithium: 3000, tritanium: 1500 },
  costScaling: 2.08,
  stats: [
    { name: 'Star Destruction Radius', value: 10000000, unit: 'km' },
    { name: 'Damage Output', value: 100000, unit: 'HP' },
  ],
  effects: [
    {
      type: 'stellar_annihilation',
      modifier: 1.0,
      description: 'Destroy star systems per level',
      targetAttribute: 'system_destruction',
    },
  ],
  requirements: { previousTech: ['graviton_weapons', 'zero_point_energy'] },
  prerequisiteFor: ['universe_crushing_engine'],
};

export const TECH_SONIC_DISRUPTORS: Technology = {
  id: 'sonic_disruptors',
  name: 'Sonic Disruption Weapons',
  displayName: 'Sonic Disruptors',
  category: 'weapons',
  tier: 'tier2',
  rarity: 'uncommon',
  description: 'Sound-based weapons that shatter targets',
  longDescription: 'Use resonant frequencies to vibrate targets apart.',
  maxLevel: 5,
  baseResearchTime: 3100,
  researchTimeMultiplier: 1.4,
  baseCost: { credits: 1500, tritanium: 300 },
  costScaling: 1.55,
  stats: [
    { name: 'Resonance Damage', value: 400, unit: 'HP/sec' },
    { name: 'Shatter Frequency', value: 50000, unit: 'Hz' },
  ],
  effects: [
    {
      type: 'resonance_damage',
      modifier: 0.2,
      description: '+20% damage over time per level',
      targetAttribute: 'damage_over_time',
    },
  ],
  requirements: { previousTech: ['phaser_emitters'] },
  prerequisiteFor: ['gravitic_resonance'],
};

export const TECH_GRAVITIC_RESONANCE: Technology = {
  id: 'gravitic_resonance',
  name: 'Gravitic Resonance Technology',
  displayName: 'Gravitic Resonance',
  category: 'weapons',
  tier: 'tier3',
  rarity: 'rare',
  description: 'Combine gravity and resonance effects',
  longDescription: 'Use gravitational resonance to create devastating feedback cascades.',
  maxLevel: 4,
  baseResearchTime: 4600,
  researchTimeMultiplier: 1.57,
  baseCost: { credits: 3800, tritanium: 800, dilithium: 600 },
  costScaling: 1.77,
  stats: [
    { name: 'Cascade Damage', value: 6000, unit: 'HP' },
    { name: 'Feedback Loop', value: 5, unit: 'multiplier' },
  ],
  effects: [
    {
      type: 'cascade_damage',
      modifier: 0.5,
      description: '+50% damage to nearby targets per level',
      targetAttribute: 'aoe_damage',
    },
  ],
  requirements: { previousTech: ['sonic_disruptors', 'graviton_weapons'] },
  prerequisiteFor: ['graviton_weapons', 'stellar_collapse_weapon'],
};

export const TECH_CHRONO_ACCELERATOR: Technology = {
  id: 'chrono_accelerator',
  name: 'Chrono-Accelerator Field',
  displayName: 'Chrono Accelerator',
  category: 'temporal',
  tier: 'tier3',
  rarity: 'rare',
  description: 'Speed up time locally around your ship',
  longDescription: 'Experience subjective time faster to plan better.',
  maxLevel: 4,
  baseResearchTime: 5100,
  researchTimeMultiplier: 1.62,
  baseCost: { credits: 4200, dilithium: 1300, tritanium: 650 },
  costScaling: 1.8,
  stats: [
    { name: 'Time Acceleration', value: 10, unit: 'x' },
    { name: 'Duration', value: 600, unit: 'sec' },
    { name: 'Cooldown', value: 1200, unit: 'sec' },
  ],
  effects: [
    {
      type: 'action_speed',
      modifier: 0.4,
      description: '+40% action speed per level',
      targetAttribute: 'attack_speed',
    },
  ],
  requirements: { previousTech: ['temporal_mechanics'] },
  prerequisiteFor: ['chrono_weaponization'],
};

export const TECH_CHRONO_WEAPONIZATION: Technology = {
  id: 'chrono_weaponization',
  name: 'Weaponized Chronological Fields',
  displayName: 'Chrono Weapons',
  category: 'weapons',
  tier: 'tier4',
  rarity: 'epic',
  description: 'Use time manipulation as a weapon',
  longDescription: 'Age targets rapidly or freeze them in time.',
  maxLevel: 2,
  baseResearchTime: 6800,
  researchTimeMultiplier: 1.78,
  baseCost: { credits: 7800, dilithium: 2700, tritanium: 1350 },
  costScaling: 2.03,
  stats: [
    { name: 'Age Acceleration', value: 1000, unit: 'years/sec' },
    { name: 'Time Freeze Duration', value: 30, unit: 'sec' },
  ],
  effects: [
    {
      type: 'aging_damage',
      modifier: 0.7,
      description: '+70% damage to biological targets per level',
      targetAttribute: 'biological_damage',
    },
    {
      type: 'stun_immunity',
      modifier: 0.5,
      description: '+50% stun duration per level',
      targetAttribute: 'crowd_control',
    },
  ],
  requirements: { previousTech: ['chrono_accelerator', 'temporal_weapons'] },
  prerequisiteFor: ['temporal_annihilation'],
};

export const TECH_TEMPORAL_ANNIHILATION: Technology = {
  id: 'temporal_annihilation',
  name: 'Temporal Annihilation Protocol',
  displayName: 'Temporal Annihilation',
  category: 'weapons',
  tier: 'tier5',
  rarity: 'legendary',
  description: 'Erase targets from the timeline',
  longDescription: 'Remove a target from causality itself - they never existed.',
  maxLevel: 1,
  baseResearchTime: 10500,
  researchTimeMultiplier: 2.05,
  baseCost: { credits: 17000, dilithium: 5800, tritanium: 2900 },
  costScaling: 2.55,
  stats: [
    { name: 'Causality Erasure', value: 100, unit: '%' },
    { name: 'Timeline Branches Affected', value: 999999, unit: 'count' },
  ],
  effects: [
    {
      type: 'causality_break',
      modifier: 1.0,
      description: 'Erase targets from causality',
      targetAttribute: 'existence_erasure',
    },
  ],
  requirements: { previousTech: ['chrono_weaponization', 'temporal_weapons'] },
};

export const TECH_NEUTRINO_DETECTION: Technology = {
  id: 'neutrino_detection',
  name: 'Neutrino Flux Sensors',
  displayName: 'Neutrino Detection',
  category: 'sensors',
  tier: 'tier2',
  rarity: 'uncommon',
  description: 'Detect neutrino emissions from reactors',
  longDescription: 'Find hidden ships by detecting neutrino signatures.',
  maxLevel: 5,
  baseResearchTime: 2700,
  researchTimeMultiplier: 1.33,
  baseCost: { credits: 1200, dilithium: 400 },
  costScaling: 1.52,
  stats: [
    { name: 'Neutrino Detection Range', value: 200000, unit: 'km' },
    { name: 'Source Identification', value: 90, unit: '%' },
  ],
  effects: [
    {
      type: 'hidden_detection',
      modifier: 0.25,
      description: '+25% hidden target detection per level',
      targetAttribute: 'stealth_penetration',
    },
  ],
  requirements: { previousTech: ['sensor_arrays'] },
  prerequisiteFor: ['quantum_sensors'],
};

export const TECH_SHIELD_OSCILLATION: Technology = {
  id: 'shield_oscillation',
  name: 'Shield Oscillation Technology',
  displayName: 'Shield Oscillation',
  category: 'defense',
  tier: 'tier2',
  rarity: 'uncommon',
  description: 'Oscillate shields to reflect damage',
  longDescription: 'Make shields vibrate at frequencies that reflect incoming attacks.',
  maxLevel: 5,
  baseResearchTime: 3000,
  researchTimeMultiplier: 1.38,
  baseCost: { credits: 1400, dilithium: 450 },
  costScaling: 1.58,
  stats: [
    { name: 'Reflection Efficiency', value: 50, unit: '%' },
    { name: 'Damage Return', value: 25, unit: '%' },
  ],
  effects: [
    {
      type: 'reflection',
      modifier: 0.2,
      description: '+20% damage reflected per level',
      targetAttribute: 'reflect_damage',
    },
  ],
  requirements: { previousTech: ['advanced_shields'] },
  prerequisiteFor: ['shield_harmonics'],
};

export const TECH_ADAPTIVE_ARMOR: Technology = {
  id: 'adaptive_armor',
  name: 'Adaptive Combat Armor',
  displayName: 'Adaptive Armor',
  category: 'defense',
  tier: 'tier3',
  rarity: 'rare',
  description: 'Armor that adapts to incoming damage types',
  longDescription: 'Hull plating that reorganizes to be strong against recent attack types.',
  maxLevel: 4,
  baseResearchTime: 4400,
  researchTimeMultiplier: 1.54,
  baseCost: { credits: 3600, dilithium: 1100, tritanium: 550 },
  costScaling: 1.76,
  stats: [
    { name: 'Adaptation Speed', value: 100, unit: '%' },
    { name: 'Damage Reduction per Type', value: 30, unit: '%' },
  ],
  effects: [
    {
      type: 'type_resistance',
      modifier: 0.25,
      description: '+25% resistance to attack types per level',
      targetAttribute: 'damage_reduction',
    },
  ],
  requirements: { previousTech: ['shield_oscillation', 'nanotechnology'] },
  prerequisiteFor: ['kinetic_absorption', 'perfect_defense'],
};

export const TECH_KINETIC_ABSORPTION: Technology = {
  id: 'kinetic_absorption',
  name: 'Kinetic Energy Absorption',
  displayName: 'Kinetic Absorption',
  category: 'defense',
  tier: 'tier3',
  rarity: 'rare',
  description: 'Convert kinetic impact into ship power',
  longDescription: 'Turn enemy attacks into fuel for your engines.',
  maxLevel: 4,
  baseResearchTime: 4300,
  researchTimeMultiplier: 1.52,
  baseCost: { credits: 3500, dilithium: 1050, tritanium: 525 },
  costScaling: 1.74,
  stats: [
    { name: 'Energy Conversion Rate', value: 50, unit: '%' },
    { name: 'Power Generation per Hit', value: 1000, unit: 'MW' },
  ],
  effects: [
    {
      type: 'damage_to_power',
      modifier: 0.3,
      description: '+30% energy gained from damage per level',
      targetAttribute: 'energy_regeneration',
    },
  ],
  requirements: { previousTech: ['adaptive_armor'] },
  prerequisiteFor: ['energy_reflection', 'perpetual_motion'],
};

export const TECH_PERFECT_DEFENSE: Technology = {
  id: 'perfect_defense',
  name: 'Perfect Defense System',
  displayName: 'Perfect Defense',
  category: 'defense',
  tier: 'tier4',
  rarity: 'epic',
  description: 'Defense that counters any attack',
  longDescription: 'Automatically generate counter-measures for all damage types.',
  maxLevel: 2,
  baseResearchTime: 6400,
  researchTimeMultiplier: 1.72,
  baseCost: { credits: 7500, dilithium: 2500, tritanium: 1250 },
  costScaling: 1.98,
  stats: [
    { name: 'Counter Effectiveness', value: 100, unit: '%' },
    { name: 'Damage Negation', value: 80, unit: '%' },
  ],
  effects: [
    {
      type: 'perfect_counter',
      modifier: 0.8,
      description: '-80% damage taken per level',
      targetAttribute: 'damage_reduction',
    },
  ],
  requirements: { previousTech: ['adaptive_armor', 'dimensional_shields'] },
  prerequisiteFor: ['godly_protection'],
};

export const TECH_ENERGY_REFLECTION: Technology = {
  id: 'energy_reflection',
  name: 'Energy Reflection Matrices',
  displayName: 'Energy Reflection',
  category: 'defense',
  tier: 'tier3',
  rarity: 'rare',
  description: 'Reflect energy weapons back at attackers',
  longDescription: 'Create reflective barriers that turn weapons against their users.',
  maxLevel: 4,
  baseResearchTime: 4200,
  researchTimeMultiplier: 1.5,
  baseCost: { credits: 3400, dilithium: 1000, tritanium: 500 },
  costScaling: 1.72,
  stats: [
    { name: 'Reflection Accuracy', value: 95, unit: '%' },
    { name: 'Energy Returned', value: 100, unit: '%' },
  ],
  effects: [
    {
      type: 'energy_return',
      modifier: 0.4,
      description: '+40% energy attacks reflected per level',
      targetAttribute: 'reflect_damage',
    },
  ],
  requirements: { previousTech: ['shield_oscillation'] },
  prerequisiteFor: ['perfect_defense'],
};

export const TECH_PERPETUAL_MOTION: Technology = {
  id: 'perpetual_motion',
  name: 'Perpetual Motion Engine',
  displayName: 'Perpetual Motion',
  category: 'engineering',
  tier: 'tier4',
  rarity: 'epic',
  description: 'Engine that never needs refueling',
  longDescription: 'Create an engine that generates more power than it consumes.',
  maxLevel: 2,
  baseResearchTime: 6600,
  researchTimeMultiplier: 1.76,
  baseCost: { credits: 7800, dilithium: 2800, tritanium: 1400 },
  costScaling: 2.02,
  stats: [
    { name: 'Efficiency Ratio', value: 200, unit: '%' },
    { name: 'Fuel Requirement', value: 0, unit: '%' },
  ],
  effects: [
    {
      type: 'infinite_fuel',
      modifier: 1.0,
      description: 'Never consume fuel per level',
      targetAttribute: 'fuel_consumption',
    },
  ],
  requirements: { previousTech: ['kinetic_absorption', 'zero_point_energy'] },
  prerequisiteFor: ['godhood'],
};

export const TECH_UNIVERSE_CRUSHING_ENGINE: Technology = {
  id: 'universe_crushing_engine',
  name: 'Universe Crushing Engine',
  displayName: 'Universe Crushing Engine',
  category: 'weapons',
  tier: 'tier5',
  rarity: 'mythic',
  description: 'Compress entire universes',
  longDescription: 'Create a singularity that compresses entire universes into nothingness.',
  maxLevel: 1,
  baseResearchTime: 16000,
  researchTimeMultiplier: 2.6,
  baseCost: { credits: 26000, dilithium: 8500, tritanium: 4250 },
  costScaling: 3.1,
  stats: [
    { name: 'Universe Destruction', value: 1, unit: 'range' },
    { name: 'Compression Force', value: 999999999999, unit: 'tons' },
  ],
  effects: [
    {
      type: 'universal_compression',
      modifier: 1.0,
      description: 'Compress all matter and energy',
      targetAttribute: 'doomsday_device',
    },
  ],
  requirements: { previousTech: ['stellar_collapse_weapon', 'reality_warping'] },
};

// Add all new technologies to the main array
export const NEW_TECHNOLOGIES: Technology[] = [
  TECH_TACHYON_EMITTERS,
  TECH_GRAVITON_WEAPONS,
  TECH_STELLAR_COLLAPSE_WEAPON,
  TECH_SONIC_DISRUPTORS,
  TECH_GRAVITIC_RESONANCE,
  TECH_CHRONO_ACCELERATOR,
  TECH_CHRONO_WEAPONIZATION,
  TECH_TEMPORAL_ANNIHILATION,
  TECH_NEUTRINO_DETECTION,
  TECH_SHIELD_OSCILLATION,
  TECH_ADAPTIVE_ARMOR,
  TECH_KINETIC_ABSORPTION,
  TECH_PERFECT_DEFENSE,
  TECH_ENERGY_REFLECTION,
  TECH_PERPETUAL_MOTION,
  TECH_UNIVERSE_CRUSHING_ENGINE,
];

// ============================================
// ADVANCED RESEARCH SYSTEM CLASSES
// ============================================

export interface ResearchProject {
  id: string;
  playerId: string;
  techId: string;
  techLevel: number;
  startTime: number;
  completionTime: number;
  status: 'queued' | 'active' | 'completed' | 'paused';
  progress: number; // 0-100
  resourcesInvested: Record<string, number>;
  labsAssigned: number;
  bonusMultiplier: number;
}

export interface ResearchLab {
  id: string;
  name: string;
  specialization?: TechCategory;
  level: number;
  efficiency: number; // 0-2, research speed multiplier
  currentProject?: string; // Research project ID
  capacity: number; // How many projects at once
  maintenanceCost: Record<string, number>;
}

export interface PlayerResearchData {
  playerId: string;
  completedTechs: Record<string, number>; // tech id -> level
  activeProjects: ResearchProject[];
  researchQueue: string[]; // tech IDs
  totalResearchPoints: number;
  researchSpeedBonus: number; // percentage
  costReductionBonus: number; // percentage
  discoveredTechs: string[];
  favoriteCategories: TechCategory[];
}

export interface TechProgressionPath {
  id: string;
  name: string;
  description: string;
  techs: string[]; // Ordered list of tech IDs
  estimatedTime: number; // total seconds
  estimatedCost: Record<string, number>;
  reward: string; // Special unlockable
}

// ============================================
// RESEARCH PROGRESSION PATHS
// ============================================

export const PROGRESSION_PATHS: TechProgressionPath[] = [
  {
    id: 'combat_specialist',
    name: 'Combat Specialist Path',
    description: 'Master all combat and weapons technologies',
    techs: [
      'phaser_emitters',
      'photon_torpedoes',
      'polaron_weapons',
      'plasma_weapons',
      'quantum_torpedoes',
      'disruptor_cannons',
      'gravitic_resonance',
      'bio_neural_weapons',
      'temporal_weapons',
      'god_killer_weapons',
    ],
    estimatedTime: 250000,
    estimatedCost: { credits: 50000, dilithium: 25000, tritanium: 15000 },
    reward: 'Master Tactician Title',
  },
  {
    id: 'defense_expert',
    name: 'Defense Expert Path',
    description: 'Become an impenetrable fortress',
    techs: [
      'shield_generators',
      'advanced_shields',
      'shield_harmonics',
      'regenerative_hull',
      'adaptive_armor',
      'energy_reflection',
      'quantum_shields',
      'dimensional_shields',
      'perfect_defense',
      'godly_protection',
    ],
    estimatedTime: 240000,
    estimatedCost: { credits: 48000, dilithium: 26000, tritanium: 14000 },
    reward: 'Guardian Shield Mastery',
  },
  {
    id: 'explorer_path',
    name: 'Explorer Path',
    description: 'Master propulsion and exploration',
    techs: [
      'impulse_drive',
      'warp_core_basics',
      'advanced_warp_drive',
      'transwarp_corridor',
      'quantum_slipstream',
      'quantum_tunneling',
      'dimensional_travel',
      'time_travel',
    ],
    estimatedTime: 180000,
    estimatedCost: { credits: 35000, dilithium: 20000, tritanium: 10000 },
    reward: 'Universal Navigator',
  },
  {
    id: 'scientist_path',
    name: 'Pure Scientist Path',
    description: 'Master all scientific technologies',
    techs: [
      'quantum_physics',
      'temporal_mechanics',
      'dimensional_science',
      'genetic_engineering',
      'nanotechnology',
      'molecular_engineering',
      'multiversal_science',
      'omniscience',
    ],
    estimatedTime: 200000,
    estimatedCost: { credits: 42000, dilithium: 22000, tritanium: 12000 },
    reward: 'Omniscient Scholar',
  },
  {
    id: 'economy_master',
    name: 'Economy Master Path',
    description: 'Become an economic powerhouse',
    techs: [
      'dilithium_refining',
      'resource_scanning',
      'deep_space_prospecting',
      'black_hole_mining',
      'cargo_optimization',
      'stasis_containment',
      'exotic_matter_harvesting',
      'matter_creation',
    ],
    estimatedTime: 160000,
    estimatedCost: { credits: 30000, dilithium: 18000, tritanium: 9000 },
    reward: 'Economic Titan',
  },
];

// ============================================
// ADVANCED RESEARCH FUNCTIONS
// ============================================

// Create a research project
export function createResearchProject(
  playerId: string,
  techId: string,
  currentLevel: number,
  labsAssigned: number = 1
): ResearchProject {
  const tech = getTechById(techId);
  if (!tech) throw new Error(`Technology ${techId} not found`);

  const researchTime = calculateResearchTime(tech, currentLevel + 1);
  const bonusMultiplier = 1 + (labsAssigned * 0.1); // 10% per lab

  return {
    id: `proj_${playerId}_${techId}_${Date.now()}`,
    playerId,
    techId,
    techLevel: currentLevel + 1,
    startTime: Date.now(),
    completionTime: Date.now() + researchTime * 1000 / bonusMultiplier,
    status: 'active',
    progress: 0,
    resourcesInvested: calculateResearchCost(tech, currentLevel + 1),
    labsAssigned,
    bonusMultiplier,
  };
}

// Update research progress
export function updateResearchProgress(
  project: ResearchProject,
  elapsedSeconds: number,
  speedBonus: number = 0
): number {
  const totalTime = (project.completionTime - project.startTime) / 1000;
  const adjustedElapsed = elapsedSeconds * (1 + speedBonus / 100) * project.bonusMultiplier;
  const newProgress = Math.min(100, (adjustedElapsed / totalTime) * 100);
  
  project.progress = newProgress;
  if (newProgress >= 100) {
    project.status = 'completed';
  }
  
  return newProgress;
}

// Get research queue estimated completion time
export function getQueueCompletionTime(
  queue: ResearchProject[],
  speedBonus: number = 0
): number {
  let totalTime = 0;
  
  for (const project of queue) {
    const remaining = (project.completionTime - Date.now()) / 1000;
    const adjustedTime = remaining / (1 + speedBonus / 100) / project.bonusMultiplier;
    totalTime += Math.max(0, adjustedTime);
  }
  
  return totalTime;
}

// Get recommended technologies for player level
export function getRecommendedTechs(playerLevel: number, category?: TechCategory): Technology[] {
  const minLevel = playerLevel - 2;
  const maxLevel = playerLevel + 5;
  
  const techs = ALL_TECHNOLOGIES.filter(tech => {
    const req = tech.requirements;
    if (req.minimumPlayerLevel && (req.minimumPlayerLevel < minLevel || req.minimumPlayerLevel > maxLevel)) {
      return false;
    }
    if (category && tech.category !== category) {
      return false;
    }
    return true;
  });
  
  // Sort by rarity (rare first)
  return techs.sort((a, b) => {
    const rarityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5 };
    return rarityOrder[b.rarity] - rarityOrder[a.rarity];
  });
}

// Get research path completion bonus
export function getPathCompletionBonus(playerData: PlayerResearchData, pathId: string): number {
  const path = PROGRESSION_PATHS.find(p => p.id === pathId);
  if (!path) return 0;
  
  const completedCount = path.techs.filter(techId => playerData.completedTechs[techId]).length;
  const completionPercentage = (completedCount / path.techs.length) * 100;
  
  // Bonus increases exponentially with completion
  return Math.pow(completionPercentage / 100, 2) * 50; // Up to 50% bonus
}

// Get tech synergy bonus
export function getTechSynergyBonus(tech: Technology, completedTechs: Record<string, number>): number {
  let bonus = 1;
  
  if (tech.synergiesWith) {
    for (const synergyTechId of tech.synergiesWith) {
      if (completedTechs[synergyTechId]) {
        bonus *= 1.15; // 15% per synergy
      }
    }
  }
  
  return bonus - 1; // Return percentage increase only
}

// Calculate total research efficiency
export function calculateResearchEfficiency(
  labs: ResearchLab[],
  speedBonus: number,
  pathBonus: number,
  synergyBonus: number
): number {
  const labEfficiency = labs.reduce((sum, lab) => sum + lab.efficiency, 0) / Math.max(1, labs.length);
  const totalSpeedBonus = 1 + (speedBonus / 100) + (pathBonus / 100) + synergyBonus;
  
  return labEfficiency * totalSpeedBonus;
}

// Get technology unlock chain
export function getTechUnlockChain(techId: string): Technology[] {
  const chain: Technology[] = [];
  const visited = new Set<string>();
  
  function traverse(id: string) {
    if (visited.has(id)) return;
    visited.add(id);
    
    const tech = getTechById(id);
    if (!tech) return;
    
    chain.push(tech);
    
    if (tech.requirements.previousTech) {
      for (const prevId of tech.requirements.previousTech) {
        traverse(prevId);
      }
    }
  }
  
  traverse(techId);
  return chain.reverse();
}

// Calculate technology tree depth
export function getTechTreeDepth(techId: string): number {
  const chain = getTechUnlockChain(techId);
  return chain.length;
}

// Get all unlocked techs from research completion
export function getUnlockedFromTech(techId: string): Technology[] {
  return ALL_TECHNOLOGIES.filter(tech => 
    tech.requirements.previousTech?.includes(techId)
  );
}

// Validate research completion
export function validateResearchCompletion(
  project: ResearchProject,
  playerData: PlayerResearchData
): boolean {
  const tech = getTechById(project.techId);
  if (!tech) return false;
  
  // Check prerequisites
  if (tech.requirements.previousTech) {
    for (const prevTechId of tech.requirements.previousTech) {
      if (!playerData.completedTechs[prevTechId]) {
        return false;
      }
    }
  }
  
  // Check resource investment
  const requiredCost = calculateResearchCost(tech, project.techLevel);
  for (const [resource, amount] of Object.entries(requiredCost)) {
    if ((project.resourcesInvested[resource] || 0) < amount) {
      return false;
    }
  }
  
  return true;
}

// Get technology statistics
export interface TechStats {
  totalTechs: number;
  byCategory: Record<TechCategory, number>;
  byRarity: Record<TechRarity, number>;
  byTier: Record<TechTier, number>;
  avgResearchTime: number;
  avgCost: Record<string, number>;
}

export function getTechnologyStatistics(): TechStats {
  const stats: TechStats = {
    totalTechs: ALL_TECHNOLOGIES.length,
    byCategory: {} as Record<TechCategory, number>,
    byRarity: {} as Record<TechRarity, number>,
    byTier: {} as Record<TechTier, number>,
    avgResearchTime: 0,
    avgCost: {},
  };
  
  // Count by category
  for (const tech of ALL_TECHNOLOGIES) {
    stats.byCategory[tech.category] = (stats.byCategory[tech.category] || 0) + 1;
    stats.byRarity[tech.rarity] = (stats.byRarity[tech.rarity] || 0) + 1;
    stats.byTier[tech.tier] = (stats.byTier[tech.tier] || 0) + 1;
  }
  
  // Calculate averages
  stats.avgResearchTime = ALL_TECHNOLOGIES.reduce((sum, tech) => sum + tech.baseResearchTime, 0) / ALL_TECHNOLOGIES.length;
  
  const costKeys = new Set<string>();
  for (const tech of ALL_TECHNOLOGIES) {
    for (const key of Object.keys(tech.baseCost)) {
      costKeys.add(key);
    }
  }
  
  for (const key of costKeys) {
    const sum = ALL_TECHNOLOGIES.reduce((sum, tech) => sum + (tech.baseCost[key] || 0), 0);
    stats.avgCost[key] = sum / ALL_TECHNOLOGIES.length;
  }
  
  return stats;
}
