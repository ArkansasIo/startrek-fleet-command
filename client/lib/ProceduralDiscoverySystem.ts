// ProceduralDiscoverySystem.ts
// Discovery, anomaly, and random encounter system
// Inspired by No Man's Sky's exploration and discovery mechanics

import { SeededRandom } from './SeedGenerator';
import type { StarSystemInfo, PlanetInfo } from './ProceduralUniverse';

export interface Discovery {
  id: string;
  type: 'planet' | 'species' | 'flora' | 'mineral' | 'anomaly' | 'artifact' | 'system' | 'phenomenon';
  name: string;
  discoveredBy: string;
  discoveryDate: Date;
  location: {
    systemId?: string;
    planetId?: string;
    coordinates?: { x: number; y: number; z: number };
  };
  scientificValue: number;
  credits: number;
  description: string;
  verified: boolean;
}

export interface SpaceAnomaly {
  id: string;
  type: 'temporal-rift' | 'wormhole' | 'nebula' | 'black-hole' | 'neutron-star' | 'quasar' | 'dark-matter' | 'subspace-tear' | 'gravimetric-distortion';
  name: string;
  dangerLevel: number; // 0-10
  researchValue: number;
  location: {
    systemId: string;
    coordinates: { x: number; y: number; z: number };
  };
  effects: AnomalyEffect[];
  discovered: boolean;
  stable: boolean;
  description: string;
}

export interface AnomalyEffect {
  type: 'damage' | 'warp-disruption' | 'sensor-interference' | 'time-dilation' | 'teleport' | 'energy-drain' | 'boost';
  magnitude: number;
  duration?: number; // seconds
  description: string;
}

export interface RandomEncounter {
  id: string;
  type: 'hostile-ship' | 'distress-signal' | 'derelict' | 'space-station' | 'trader' | 'pirate' | 'alien-probe' | 'diplomatic' | 'scientific';
  title: string;
  description: string;
  choices: EncounterChoice[];
  rewards?: EncounterReward[];
  consequences?: EncounterConsequence[];
}

export interface EncounterChoice {
  id: string;
  text: string;
  requirements?: {
    skill?: string;
    skillLevel?: number;
    technology?: string;
    reputation?: number;
  };
  successChance: number; // 0-100
}

export interface EncounterReward {
  type: 'credits' | 'resources' | 'technology' | 'reputation' | 'information' | 'ship-upgrade' | 'crew-member';
  amount: number;
  item?: string;
  description: string;
}

export interface EncounterConsequence {
  type: 'damage' | 'reputation-loss' | 'resource-loss' | 'crew-injury' | 'ship-damage' | 'time-loss';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
}

export interface AncientArtifact {
  id: string;
  name: string;
  type: 'weapon' | 'shield' | 'data' | 'power-source' | 'navigation' | 'medical' | 'unknown';
  age: number; // years
  civilization: string;
  power: number; // 0-100
  researched: boolean;
  description: string;
  abilities?: string[];
}

export interface ScanResult {
  type: 'planet' | 'ship' | 'station' | 'anomaly' | 'asteroid' | 'debris';
  name: string;
  distance: number;
  composition?: string[];
  lifeSigns?: boolean;
  technologyLevel?: number;
  threat?: number;
  valuable?: boolean;
  description: string;
}

export class ProceduralDiscoverySystem {
  private rng: SeededRandom;
  private discoveries: Map<string, Discovery>;
  private anomalies: Map<string, SpaceAnomaly>;

  // Ancient civilizations
  private ancientCivs = [
    'Iconian', 'Tkon', 'Preservers', 'Progenitors', 'Hurq', 
    'Ancient Humanoids', 'DYota', 'Kalandans', 'Shedai', 'Tholians'
  ];

  // Encounter templates
  private encounterTemplates = [
    {
      type: 'distress-signal' as const,
      title: 'Distress Signal Detected',
      baseDescription: 'A faint distress signal emanates from nearby space.'
    },
    {
      type: 'derelict' as const,
      title: 'Derelict Vessel',
      baseDescription: 'Sensors detect a derelict ship drifting in space.'
    },
    {
      type: 'trader' as const,
      title: 'Trading Opportunity',
      baseDescription: 'A merchant vessel hails you with trade offers.'
    },
    {
      type: 'hostile-ship' as const,
      title: 'Hostile Contact',
      baseDescription: 'Aggressive vessels approach your position!'
    },
    {
      type: 'alien-probe' as const,
      title: 'Unknown Probe',
      baseDescription: 'An alien probe of unknown origin scans your ship.'
    },
    {
      type: 'scientific' as const,
      title: 'Scientific Phenomenon',
      baseDescription: 'Unusual readings detected - potential scientific discovery.'
    }
  ];

  constructor(seed: number | string) {
    this.rng = new SeededRandom(seed);
    this.discoveries = new Map();
    this.anomalies = new Map();
  }

  /**
   * Generate space anomalies for a system
   */
  generateAnomalies(systemInfo: StarSystemInfo): SpaceAnomaly[] {
    const anomalies: SpaceAnomaly[] = [];
    const anomalyRng = new SeededRandom(systemInfo.seed + 7777);
    
    // Chance based on system properties
    let anomalyChance = 0.1;
    if (systemInfo.starType === 'black-hole' || systemInfo.starType === 'neutron' || systemInfo.starType === 'pulsar') {
      anomalyChance = 0.8;
    } else if (systemInfo.anomalyPresent) {
      anomalyChance = 0.6;
    }
    
    if (!anomalyRng.nextBool(anomalyChance)) return anomalies;
    
    const count = anomalyRng.nextInt(1, 3);
    
    for (let i = 0; i < count; i++) {
      const types: SpaceAnomaly['type'][] = [
        'temporal-rift', 'wormhole', 'nebula', 'black-hole', 
        'neutron-star', 'quasar', 'dark-matter', 'subspace-tear', 
        'gravimetric-distortion'
      ];
      
      const type = anomalyRng.pick(types);
      const anomaly = this.createAnomaly(anomalyRng, type, systemInfo, i);
      anomalies.push(anomaly);
      this.anomalies.set(anomaly.id, anomaly);
    }
    
    return anomalies;
  }

  /**
   * Create a space anomaly
   */
  private createAnomaly(
    rng: SeededRandom,
    type: SpaceAnomaly['type'],
    systemInfo: StarSystemInfo,
    index: number
  ): SpaceAnomaly {
    const dangerLevels: Record<string, number> = {
      'temporal-rift': 8,
      'wormhole': 6,
      'nebula': 3,
      'black-hole': 10,
      'neutron-star': 9,
      'quasar': 10,
      'dark-matter': 7,
      'subspace-tear': 8,
      'gravimetric-distortion': 6
    };
    
    const researchValues: Record<string, number> = {
      'temporal-rift': 95,
      'wormhole': 90,
      'nebula': 60,
      'black-hole': 100,
      'neutron-star': 95,
      'quasar': 100,
      'dark-matter': 85,
      'subspace-tear': 80,
      'gravimetric-distortion': 70
    };
    
    return {
      id: `${systemInfo.id}-anomaly-${index}`,
      type,
      name: this.generateAnomalyName(rng, type),
      dangerLevel: dangerLevels[type] || 5,
      researchValue: researchValues[type] || 50,
      location: {
        systemId: systemInfo.id,
        coordinates: {
          x: rng.nextFloat(-1000, 1000),
          y: rng.nextFloat(-1000, 1000),
          z: rng.nextFloat(-100, 100)
        }
      },
      effects: this.generateAnomalyEffects(rng, type),
      discovered: false,
      stable: rng.nextBool(0.7),
      description: this.generateAnomalyDescription(type)
    };
  }

  /**
   * Generate anomaly name
   */
  private generateAnomalyName(rng: SeededRandom, type: SpaceAnomaly['type']): string {
    const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'];
    const suffixes = ['Expanse', 'Phenomenon', 'Anomaly', 'Formation', 'Region'];
    
    return `${rng.pick(prefixes)} ${type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} ${rng.pick(suffixes)}`;
  }

  /**
   * Generate anomaly description
   */
  private generateAnomalyDescription(type: SpaceAnomaly['type']): string {
    const descriptions: Record<string, string> = {
      'temporal-rift': 'A tear in spacetime causing temporal distortions. Extreme caution advised.',
      'wormhole': 'A stable passage through subspace. Potential shortcut to distant locations.',
      'nebula': 'Dense cloud of interstellar gas and dust. May contain valuable resources.',
      'black-hole': 'Gravitational singularity. Approach with extreme caution.',
      'neutron-star': 'Collapsed stellar remnant with intense radiation and gravitational fields.',
      'quasar': 'Extremely luminous active galactic nucleus. Dangerous radiation levels.',
      'dark-matter': 'Concentration of dark matter. Unknown effects on normal matter.',
      'subspace-tear': 'Rupture in subspace fabric. Unpredictable spatial effects.',
      'gravimetric-distortion': 'Severe gravitational anomaly. Navigation hazard.'
    };
    
    return descriptions[type] || 'Unknown spatial phenomenon requiring investigation.';
  }

  /**
   * Generate anomaly effects
   */
  private generateAnomalyEffects(rng: SeededRandom, type: SpaceAnomaly['type']): AnomalyEffect[] {
    const effects: AnomalyEffect[] = [];
    
    const effectsByType: Record<string, AnomalyEffect[]> = {
      'temporal-rift': [
        { type: 'time-dilation', magnitude: rng.nextInt(50, 100), description: 'Time moves differently here' },
        { type: 'sensor-interference', magnitude: rng.nextInt(70, 100), description: 'Temporal sensors disrupted' }
      ],
      'wormhole': [
        { type: 'teleport', magnitude: 100, description: 'Instant travel to distant location' },
        { type: 'energy-drain', magnitude: rng.nextInt(20, 50), description: 'Warp field destabilization' }
      ],
      'nebula': [
        { type: 'sensor-interference', magnitude: rng.nextInt(30, 70), description: 'Reduced sensor range' }
      ],
      'black-hole': [
        { type: 'damage', magnitude: rng.nextInt(80, 100), duration: 60, description: 'Extreme gravitational stress' },
        { type: 'warp-disruption', magnitude: 100, description: 'Cannot warp' }
      ],
      'neutron-star': [
        { type: 'damage', magnitude: rng.nextInt(60, 90), duration: 30, description: 'Intense radiation damage' }
      ],
      'dark-matter': [
        { type: 'sensor-interference', magnitude: rng.nextInt(50, 100), description: 'Dark matter interference' }
      ],
      'subspace-tear': [
        { type: 'warp-disruption', magnitude: rng.nextInt(70, 100), description: 'Subspace instability' },
        { type: 'teleport', magnitude: 50, description: 'Random displacement' }
      ],
      'gravimetric-distortion': [
        { type: 'warp-disruption', magnitude: rng.nextInt(40, 80), description: 'Gravity well' }
      ]
    };
    
    return effectsByType[type] || [];
  }

  /**
   * Generate random encounter
   */
  generateRandomEncounter(location: { systemId: string; dangerLevel: number }): RandomEncounter {
    const encounterRng = new SeededRandom(Date.now() + this.rng.getSeed());
    
    const template = encounterRng.pick(this.encounterTemplates);
    const choices = this.generateEncounterChoices(encounterRng, template.type);
    
    return {
      id: `encounter-${encounterRng.nextInt(10000, 99999)}`,
      type: template.type,
      title: template.title,
      description: this.expandEncounterDescription(encounterRng, template.baseDescription, template.type),
      choices,
      rewards: this.generateEncounterRewards(encounterRng, template.type),
      consequences: this.generateEncounterConsequences(encounterRng, template.type)
    };
  }

  /**
   * Expand encounter description
   */
  private expandEncounterDescription(rng: SeededRandom, baseDesc: string, type: RandomEncounter['type']): string {
    const details: Record<string, string[]> = {
      'distress-signal': [
        'The signal is weak but appears to be automated.',
        'Multiple life signs detected on the source vessel.',
        'The distress call is in an unknown language.',
        'Sensors detect weapon signatures nearby.'
      ],
      'derelict': [
        'The ship appears to have been abandoned for years.',
        'Hull breaches detected across multiple sections.',
        'Power readings suggest some systems are still active.',
        'The vessel design is unfamiliar.'
      ],
      'trader': [
        'The merchant claims to have rare items.',
        'They seem eager to conduct business.',
        'Their reputation is unknown in this sector.',
        'They offer competitive prices.'
      ],
      'hostile-ship': [
        'Weapons are charged and targeting systems active.',
        'The vessels bear markings of a known hostile faction.',
        'They are demanding immediate surrender.',
        'Multiple ships are surrounding your position.'
      ],
      'alien-probe': [
        'The technology is centuries ahead of known designs.',
        'It emits strange energy signatures.',
        'The probe seems to be collecting data.',
        'Similar probes have been reported in other sectors.'
      ],
      'scientific': [
        'Initial scans reveal unprecedented readings.',
        'This could be a major scientific breakthrough.',
        'The phenomenon appears to be naturally occurring.',
        'Research teams would pay handsomely for this data.'
      ]
    };
    
    const detail = rng.pick(details[type] || ['Further investigation required.']);
    return `${baseDesc} ${detail}`;
  }

  /**
   * Generate encounter choices
   */
  private generateEncounterChoices(rng: SeededRandom, type: RandomEncounter['type']): EncounterChoice[] {
    const choicesByType: Record<string, EncounterChoice[]> = {
      'distress-signal': [
        { id: 'respond', text: 'Respond to the distress call', successChance: 70 },
        { id: 'investigate', text: 'Investigate cautiously', successChance: 85, requirements: { skill: 'tactical', skillLevel: 3 } },
        { id: 'ignore', text: 'Ignore and continue', successChance: 100 }
      ],
      'derelict': [
        { id: 'board', text: 'Board the derelict', successChance: 60 },
        { id: 'scan', text: 'Perform detailed scans', successChance: 90, requirements: { skill: 'science', skillLevel: 2 } },
        { id: 'salvage', text: 'Attempt salvage operations', successChance: 75 },
        { id: 'leave', text: 'Leave it alone', successChance: 100 }
      ],
      'trader': [
        { id: 'trade', text: 'Engage in trade', successChance: 95 },
        { id: 'negotiate', text: 'Negotiate better prices', successChance: 70, requirements: { skill: 'diplomacy', skillLevel: 2 } },
        { id: 'decline', text: 'Decline and move on', successChance: 100 }
      ],
      'hostile-ship': [
        { id: 'fight', text: 'Engage in combat', successChance: 50, requirements: { skill: 'tactical', skillLevel: 4 } },
        { id: 'flee', text: 'Attempt to flee', successChance: 70 },
        { id: 'negotiate', text: 'Try to negotiate', successChance: 40, requirements: { skill: 'diplomacy', skillLevel: 3 } },
        { id: 'intimidate', text: 'Intimidate them', successChance: 45, requirements: { reputation: 50 } }
      ],
      'alien-probe': [
        { id: 'scan', text: 'Scan the probe', successChance: 80 },
        { id: 'communicate', text: 'Attempt communication', successChance: 50, requirements: { skill: 'science', skillLevel: 3 } },
        { id: 'capture', text: 'Try to capture it', successChance: 60, requirements: { technology: 'tractor-beam' } },
        { id: 'avoid', text: 'Avoid it', successChance: 100 }
      ],
      'scientific': [
        { id: 'study', text: 'Conduct detailed study', successChance: 85, requirements: { skill: 'science', skillLevel: 2 } },
        { id: 'collect', text: 'Collect samples', successChance: 75 },
        { id: 'observe', text: 'Observe from distance', successChance: 95 }
      ]
    };
    
    return choicesByType[type] || [
      { id: 'proceed', text: 'Proceed carefully', successChance: 80 },
      { id: 'retreat', text: 'Retreat', successChance: 100 }
    ];
  }

  /**
   * Generate encounter rewards
   */
  private generateEncounterRewards(rng: SeededRandom, type: RandomEncounter['type']): EncounterReward[] {
    const rewardsByType: Record<string, EncounterReward[]> = {
      'distress-signal': [
        { type: 'reputation', amount: rng.nextInt(10, 30), description: 'Gained reputation for heroic rescue' },
        { type: 'credits', amount: rng.nextInt(500, 2000), description: 'Reward from grateful survivors' }
      ],
      'derelict': [
        { type: 'technology', amount: 1, item: 'Ancient Technology', description: 'Recovered advanced technology' },
        { type: 'resources', amount: rng.nextInt(100, 500), description: 'Salvaged materials' }
      ],
      'trader': [
        { type: 'resources', amount: rng.nextInt(50, 200), description: 'Purchased goods' }
      ],
      'hostile-ship': [
        { type: 'credits', amount: rng.nextInt(1000, 5000), description: 'Salvage from victory' },
        { type: 'reputation', amount: rng.nextInt(5, 15), description: 'Combat victory recognized' }
      ],
      'alien-probe': [
        { type: 'information', amount: rng.nextInt(50, 150), description: 'Scientific data recovered' },
        { type: 'technology', amount: 1, item: 'Alien Technology', description: 'Probe technology analyzed' }
      ],
      'scientific': [
        { type: 'credits', amount: rng.nextInt(2000, 8000), description: 'Research grant awarded' },
        { type: 'information', amount: rng.nextInt(100, 300), description: 'Valuable scientific discovery' }
      ]
    };
    
    return rewardsByType[type] || [];
  }

  /**
   * Generate encounter consequences
   */
  private generateEncounterConsequences(rng: SeededRandom, type: RandomEncounter['type']): EncounterConsequence[] {
    const consequencesByType: Record<string, EncounterConsequence[]> = {
      'distress-signal': [
        { type: 'time-loss', severity: 'minor', description: 'Rescue operation delayed your mission' }
      ],
      'derelict': [
        { type: 'crew-injury', severity: 'minor', description: 'Away team encountered hazards' },
        { type: 'damage', severity: 'minor', description: 'Structural instability caused minor damage' }
      ],
      'trader': [],
      'hostile-ship': [
        { type: 'ship-damage', severity: 'moderate', description: 'Combat damage sustained' },
        { type: 'resource-loss', severity: 'minor', description: 'Ammunition and supplies expended' }
      ],
      'alien-probe': [
        { type: 'damage', severity: 'minor', description: 'Probe defense systems activated' }
      ],
      'scientific': []
    };
    
    return consequencesByType[type] || [];
  }

  /**
   * Generate ancient artifact
   */
  generateArtifact(planetInfo: PlanetInfo): AncientArtifact | null {
    const artifactRng = new SeededRandom(planetInfo.seed + 88888);
    
    // Low chance of artifact
    if (!artifactRng.nextBool(0.05)) return null;
    
    const types: AncientArtifact['type'][] = ['weapon', 'shield', 'data', 'power-source', 'navigation', 'medical', 'unknown'];
    const type = artifactRng.pick(types);
    
    return {
      id: `artifact-${artifactRng.nextInt(10000, 99999)}`,
      name: this.generateArtifactName(artifactRng),
      type,
      age: artifactRng.nextInt(1000, 1000000),
      civilization: artifactRng.pick(this.ancientCivs),
      power: artifactRng.nextInt(50, 100),
      researched: false,
      description: this.generateArtifactDescription(type),
      abilities: this.generateArtifactAbilities(artifactRng, type)
    };
  }

  /**
   * Generate artifact name
   */
  private generateArtifactName(rng: SeededRandom): string {
    const prefixes = ['Ancient', 'Lost', 'Forgotten', 'Mysterious', 'Legendary'];
    const suffixes = ['Relic', 'Device', 'Artifact', 'Technology', 'Construct'];
    
    return `${rng.pick(prefixes)} ${rng.pick(suffixes)}`;
  }

  /**
   * Generate artifact description
   */
  private generateArtifactDescription(type: AncientArtifact['type']): string {
    const descriptions: Record<string, string> = {
      'weapon': 'An ancient weapon of immense power.',
      'shield': 'Protective technology far beyond current understanding.',
      'data': 'Contains vast repositories of ancient knowledge.',
      'power-source': 'Energy generation system of unknown origin.',
      'navigation': 'Star charts and navigation data spanning millennia.',
      'medical': 'Advanced medical technology.',
      'unknown': 'Purpose and function remain a mystery.'
    };
    
    return descriptions[type] || 'An artifact of unknown purpose.';
  }

  /**
   * Generate artifact abilities
   */
  private generateArtifactAbilities(rng: SeededRandom, type: AncientArtifact['type']): string[] {
    const abilitiesByType: Record<string, string[]> = {
      'weapon': ['Massive damage output', 'Ignores shields', 'Area effect'],
      'shield': ['Impenetrable defense', 'Regenerates quickly', 'Reflects damage'],
      'data': ['Tech research boost', 'Reveals hidden systems', 'Translation matrix'],
      'power-source': ['Unlimited energy', 'Powers advanced systems', 'Enhances all functions'],
      'navigation': ['Perfect navigation', 'Reveals wormholes', 'Instant travel'],
      'medical': ['Heals all injuries', 'Extends lifespan', 'Cures diseases'],
      'unknown': ['Unknown effect']
    };
    
    const baseAbilities = abilitiesByType[type] || ['Unknown ability'];
    return rng.shuffle(baseAbilities).slice(0, rng.nextInt(1, 3));
  }

  /**
   * Perform scan
   */
  performScan(scannerRange: number, scannerPower: number): ScanResult[] {
    const results: ScanResult[] = [];
    const scanRng = new SeededRandom(Date.now() + this.rng.getSeed());
    
    const objectCount = scanRng.nextInt(1, 5);
    
    for (let i = 0; i < objectCount; i++) {
      const distance = scanRng.nextFloat(0, scannerRange);
      const types: ScanResult['type'][] = ['planet', 'ship', 'station', 'anomaly', 'asteroid', 'debris'];
      const type = scanRng.pick(types);
      
      results.push(this.generateScanResult(scanRng, type, distance, scannerPower));
    }
    
    return results.sort((a, b) => a.distance - b.distance);
  }

  /**
   * Generate scan result
   */
  private generateScanResult(rng: SeededRandom, type: ScanResult['type'], distance: number, power: number): ScanResult {
    const result: ScanResult = {
      type,
      name: this.generateScanObjectName(rng, type),
      distance,
      description: ''
    };
    
    // Detail level based on scanner power
    if (power > 50) {
      result.composition = rng.shuffle(['Iron', 'Nickel', 'Silicates', 'Ice', 'Organic']).slice(0, rng.nextInt(1, 3));
    }
    
    if (type === 'planet' && power > 60) {
      result.lifeSigns = rng.nextBool(0.3);
    }
    
    if ((type === 'ship' || type === 'station') && power > 70) {
      result.technologyLevel = rng.nextInt(1, 10);
      result.threat = rng.nextInt(0, 10);
    }
    
    if (power > 80) {
      result.valuable = rng.nextBool(0.4);
    }
    
    result.description = this.generateScanDescription(result);
    
    return result;
  }

  /**
   * Generate scan object name
   */
  private generateScanObjectName(rng: SeededRandom, type: ScanResult['type']): string {
    const names: Record<string, string[]> = {
      'planet': ['Uncharted World', 'Unknown Planet', 'Celestial Body'],
      'ship': ['Vessel', 'Starship', 'Craft'],
      'station': ['Space Station', 'Outpost', 'Facility'],
      'anomaly': ['Anomaly', 'Phenomenon', 'Distortion'],
      'asteroid': ['Asteroid', 'Rock', 'Debris Field'],
      'debris': ['Wreckage', 'Debris', 'Remains']
    };
    
    return rng.pick(names[type] || ['Unknown Object']);
  }

  /**
   * Generate scan description
   */
  private generateScanDescription(result: ScanResult): string {
    let desc = `${result.type} detected at ${result.distance.toFixed(1)} units.`;
    
    if (result.composition) {
      desc += ` Composition: ${result.composition.join(', ')}.`;
    }
    
    if (result.lifeSigns !== undefined) {
      desc += result.lifeSigns ? ' Life signs detected!' : ' No life signs.';
    }
    
    if (result.threat !== undefined && result.threat > 5) {
      desc += ' Potential threat detected.';
    }
    
    if (result.valuable) {
      desc += ' Appears to be valuable.';
    }
    
    return desc;
  }

  /**
   * Record discovery
   */
  recordDiscovery(discovery: Omit<Discovery, 'id' | 'discoveryDate' | 'verified'>): Discovery {
    const fullDiscovery: Discovery = {
      ...discovery,
      id: `discovery-${Date.now()}-${this.rng.nextInt(1000, 9999)}`,
      discoveryDate: new Date(),
      verified: false
    };
    
    this.discoveries.set(fullDiscovery.id, fullDiscovery);
    return fullDiscovery;
  }

  /**
   * Get all discoveries
   */
  getDiscoveries(): Discovery[] {
    return Array.from(this.discoveries.values());
  }

  /**
   * Get discoveries by player
   */
  getDiscoveriesByPlayer(playerId: string): Discovery[] {
    return Array.from(this.discoveries.values()).filter(d => d.discoveredBy === playerId);
  }

  /**
   * Calculate discovery value
   */
  calculateDiscoveryValue(discovery: Discovery): { credits: number; reputation: number } {
    let credits = discovery.credits;
    let reputation = Math.floor(discovery.scientificValue / 10);
    
    // Bonuses for rare discoveries
    if (discovery.type === 'species') {
      reputation += 5;
      credits += 500;
    }
    
    if (discovery.type === 'artifact') {
      reputation += 10;
      credits += 2000;
    }
    
    if (discovery.type === 'phenomenon') {
      reputation += 15;
      credits += 5000;
    }
    
    return { credits, reputation };
  }
}

export default ProceduralDiscoverySystem;
