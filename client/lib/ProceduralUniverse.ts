// ProceduralUniverse.ts
// Main procedural universe generator inspired by No Man's Sky
// Generates infinite, explorable universe from a single seed

import { SeededRandom, CoordinateSeedGenerator } from './SeedGenerator';

export interface UniverseConfig {
  seed: string | number;
  galaxyCount: number;
  systemsPerGalaxy: number;
  planetsPerSystem: { min: number; max: number };
}

export interface GalaxyInfo {
  id: string;
  name: string;
  index: number;
  type: 'spiral' | 'elliptical' | 'irregular' | 'barred-spiral';
  color: string;
  systemCount: number;
  centerX: number;
  centerY: number;
  radius: number;
  seed: number;
}

export interface StarSystemInfo {
  id: string;
  name: string;
  galaxyId: string;
  x: number;
  y: number;
  z: number;
  starType: 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M' | 'pulsar' | 'neutron' | 'black-hole';
  starColor: string;
  temperature: number;
  planetCount: number;
  anomalyPresent: boolean;
  faction: string | null;
  dangerLevel: number;
  resources: string[];
  seed: number;
}

export interface PlanetInfo {
  id: string;
  name: string;
  systemId: string;
  orbitDistance: number;
  type: 'terran' | 'arctic' | 'desert' | 'oceanic' | 'volcanic' | 'toxic' | 'barren' | 'gas-giant' | 'ice-giant' | 'exotic';
  size: 'tiny' | 'small' | 'medium' | 'large' | 'huge';
  atmosphere: 'none' | 'thin' | 'breathable' | 'thick' | 'toxic' | 'corrosive';
  temperature: number; // Kelvin
  gravity: number; // Earth = 1.0
  habitability: number; // 0-100
  resources: ResourceDeposit[];
  biomes: BiomeInfo[];
  fauna: FaunaInfo[];
  flora: FloraInfo[];
  anomalies: AnomalyInfo[];
  civilization: CivilizationInfo | null;
  seed: number;
}

export interface ResourceDeposit {
  type: string;
  abundance: 'trace' | 'common' | 'abundant' | 'rich' | 'ultra-rich';
  quality: number; // 0-100
  location: { lat: number; lon: number };
}

export interface BiomeInfo {
  type: string;
  coverage: number; // percentage
  temperature: number;
  description: string;
}

export interface FaunaInfo {
  id: string;
  name: string;
  type: 'herbivore' | 'carnivore' | 'omnivore' | 'sentient';
  size: 'tiny' | 'small' | 'medium' | 'large' | 'giant';
  behavior: 'passive' | 'defensive' | 'aggressive' | 'intelligent';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  description: string;
}

export interface FloraInfo {
  id: string;
  name: string;
  type: 'tree' | 'bush' | 'flower' | 'fungus' | 'crystal' | 'exotic';
  size: 'small' | 'medium' | 'large' | 'massive';
  harvestable: boolean;
  resource: string | null;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

export interface AnomalyInfo {
  id: string;
  type: 'temporal' | 'spatial' | 'subspace' | 'gravimetric' | 'quantum' | 'dimensional';
  name: string;
  description: string;
  dangerLevel: number;
  rewards: any[];
}

export interface CivilizationInfo {
  name: string;
  techLevel: number; // 0-10
  population: number;
  attitude: 'hostile' | 'cautious' | 'neutral' | 'friendly' | 'allied';
  government: 'primitive' | 'tribal' | 'feudal' | 'democratic' | 'totalitarian' | 'hive-mind';
}

export class ProceduralUniverse {
  private config: UniverseConfig;
  private coordGen: CoordinateSeedGenerator;
  private masterRng: SeededRandom;

  // Name generation pools
  private greekLetters = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'];
  private starPrefixes = ['Proxima', 'Sirius', 'Vega', 'Altair', 'Deneb', 'Rigel', 'Betelgeuse', 'Antares', 'Aldebaran', 'Spica', 'Pollux', 'Arcturus', 'Capella', 'Regulus'];
  private planetSuffixes = ['Prime', 'Minor', 'Major', 'Secundus', 'Tertius', 'IV', 'V', 'VI', 'VII', 'VIII'];
  private galaxyNames = ['Andromeda', 'Triangulum', 'Messier', 'Whirlpool', 'Sombrero', 'Pinwheel', 'Cartwheel', 'Tadpole', 'Antennae', 'Sunflower'];

  // Resource types
  private resources = [
    'Dilithium', 'Tritanium', 'Duranium', 'Latinum', 'Biomimetic Gel',
    'Isolinear Chips', 'Plasma', 'Deuterium', 'Antimatter', 'Tetryon',
    'Rodinium', 'Pergium', 'Topaline', 'Zenite', 'Trellium-D',
    'Benamite', 'Verterium', 'Polyferranide', 'Iridium', 'Thoron'
  ];

  // Biome types
  private biomeTypes = [
    'Tundra', 'Boreal Forest', 'Temperate Forest', 'Tropical Rainforest',
    'Savanna', 'Desert', 'Ocean', 'Coral Reef', 'Ice Field', 'Volcanic',
    'Crystal Plains', 'Fungal Grove', 'Bioluminescent Caverns', 'Toxic Swamp',
    'Radioactive Wasteland', 'Subspace Rift Zone', 'Temporal Anomaly Field'
  ];

  // Factions
  private factions = [
    'Federation', 'Klingon Empire', 'Romulan Star Empire', 'Cardassian Union',
    'Ferengi Alliance', 'Borg Collective', 'Dominion', 'Breen Confederacy',
    'Gorn Hegemony', 'Tholian Assembly', 'Neutral', 'Independent'
  ];

  constructor(config: Partial<UniverseConfig> = {}) {
    this.config = {
      seed: config.seed || 'StarTrekUniverse-42',
      galaxyCount: config.galaxyCount || 256,
      systemsPerGalaxy: config.systemsPerGalaxy || 10000,
      planetsPerSystem: config.planetsPerSystem || { min: 1, max: 8 }
    };

    this.masterRng = new SeededRandom(this.config.seed);
    this.coordGen = new CoordinateSeedGenerator(this.config.seed);
  }

  /**
   * Generate galaxy information
   */
  generateGalaxy(galaxyIndex: number): GalaxyInfo {
    const rng = this.masterRng.fork(`galaxy-${galaxyIndex}`);
    
    const types: GalaxyInfo['type'][] = ['spiral', 'elliptical', 'irregular', 'barred-spiral'];
    const type = rng.pick(types);
    
    return {
      id: `galaxy-${galaxyIndex}`,
      name: `${rng.pick(this.galaxyNames)} ${galaxyIndex}`,
      index: galaxyIndex,
      type,
      color: this.generateStarColor(rng),
      systemCount: this.config.systemsPerGalaxy,
      centerX: galaxyIndex * 100000,
      centerY: 0,
      radius: rng.nextInt(50000, 100000),
      seed: rng.getSeed()
    };
  }

  /**
   * Generate star system at coordinates
   */
  generateStarSystem(galaxyId: string, x: number, y: number, z: number = 0): StarSystemInfo {
    const rng = this.coordGen.getRandomAt(x, y, z);
    
    const starTypes: StarSystemInfo['starType'][] = ['O', 'B', 'A', 'F', 'G', 'K', 'M', 'pulsar', 'neutron', 'black-hole'];
    const weights = [1, 3, 7, 15, 25, 30, 60, 2, 2, 1]; // Realistic distribution
    const starType = this.weightedPick(rng, starTypes, weights);
    
    const systemName = this.generateStarSystemName(rng, x, y, z);
    const planetCount = rng.nextInt(
      this.config.planetsPerSystem.min,
      this.config.planetsPerSystem.max
    );

    return {
      id: `${galaxyId}-sys-${x}-${y}-${z}`,
      name: systemName,
      galaxyId,
      x,
      y,
      z,
      starType,
      starColor: this.getStarColor(starType),
      temperature: this.getStarTemperature(starType),
      planetCount,
      anomalyPresent: rng.nextBool(0.15), // 15% chance
      faction: rng.nextBool(0.4) ? rng.pick(this.factions) : null,
      dangerLevel: rng.nextInt(1, 10),
      resources: this.generateSystemResources(rng),
      seed: rng.getSeed()
    };
  }

  /**
   * Generate planet information
   */
  generatePlanet(systemInfo: StarSystemInfo, planetIndex: number): PlanetInfo {
    const rng = new SeededRandom(systemInfo.seed + planetIndex);
    
    const orbitDistance = (planetIndex + 1) * rng.nextFloat(0.5, 2.0);
    const planetTypes: PlanetInfo['type'][] = [
      'terran', 'arctic', 'desert', 'oceanic', 'volcanic', 
      'toxic', 'barren', 'gas-giant', 'ice-giant', 'exotic'
    ];
    const type = this.selectPlanetType(rng, systemInfo.starType, orbitDistance);
    
    const sizes: PlanetInfo['size'][] = ['tiny', 'small', 'medium', 'large', 'huge'];
    const size = rng.pick(sizes);
    
    const atmospheres: PlanetInfo['atmosphere'][] = [
      'none', 'thin', 'breathable', 'thick', 'toxic', 'corrosive'
    ];
    const atmosphere = this.selectAtmosphere(rng, type);
    
    const temperature = this.calculateTemperature(systemInfo.temperature, orbitDistance, atmosphere);
    const gravity = this.calculateGravity(size, type);
    const habitability = this.calculateHabitability(type, atmosphere, temperature, gravity);

    return {
      id: `${systemInfo.id}-planet-${planetIndex}`,
      name: `${systemInfo.name} ${rng.pick(this.planetSuffixes)}`,
      systemId: systemInfo.id,
      orbitDistance,
      type,
      size,
      atmosphere,
      temperature,
      gravity,
      habitability,
      resources: this.generatePlanetResources(rng, type),
      biomes: this.generateBiomes(rng, type, temperature),
      fauna: this.generateFauna(rng, habitability, type),
      flora: this.generateFlora(rng, habitability, type),
      anomalies: this.generateAnomalies(rng),
      civilization: this.generateCivilization(rng, habitability),
      seed: rng.getSeed()
    };
  }

  /**
   * Helper: Generate star system name
   */
  private generateStarSystemName(rng: SeededRandom, x: number, y: number, z: number): string {
    if (rng.nextBool(0.6)) {
      return `${rng.pick(this.starPrefixes)}-${rng.pick(this.greekLetters)}`;
    } else {
      // Coordinate-based designation
      return `Sector ${Math.abs(x)}-${Math.abs(y)}`;
    }
  }

  /**
   * Helper: Generate star color
   */
  private generateStarColor(rng: SeededRandom): string {
    const colors = ['#FF4444', '#FFAA44', '#FFFF44', '#FFFFFF', '#AAAAFF', '#4444FF'];
    return rng.pick(colors);
  }

  /**
   * Helper: Get star color by type
   */
  private getStarColor(type: StarSystemInfo['starType']): string {
    const colorMap: Record<string, string> = {
      'O': '#9BB0FF', 'B': '#AABFFF', 'A': '#CAD7FF', 'F': '#F8F7FF',
      'G': '#FFF4EA', 'K': '#FFD2A1', 'M': '#FFCC6F',
      'pulsar': '#FF00FF', 'neutron': '#00FFFF', 'black-hole': '#000000'
    };
    return colorMap[type] || '#FFFFFF';
  }

  /**
   * Helper: Get star temperature
   */
  private getStarTemperature(type: StarSystemInfo['starType']): number {
    const tempMap: Record<string, number> = {
      'O': 30000, 'B': 20000, 'A': 9000, 'F': 7000,
      'G': 5500, 'K': 4500, 'M': 3000,
      'pulsar': 100000, 'neutron': 600000, 'black-hole': 0
    };
    return tempMap[type] || 5500;
  }

  /**
   * Helper: Weighted random selection
   */
  private weightedPick<T>(rng: SeededRandom, items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = rng.nextFloat(0, totalWeight);
    
    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) return items[i];
    }
    return items[items.length - 1];
  }

  /**
   * Helper: Select planet type based on star and distance
   */
  private selectPlanetType(rng: SeededRandom, starType: string, distance: number): PlanetInfo['type'] {
    // Inner planets: rocky
    if (distance < 2) {
      return rng.pick(['volcanic', 'barren', 'desert', 'toxic'] as PlanetInfo['type'][]);
    }
    // Habitable zone
    if (distance < 4) {
      return rng.pick(['terran', 'oceanic', 'arctic', 'desert'] as PlanetInfo['type'][]);
    }
    // Outer planets: gas giants and ice
    return rng.pick(['gas-giant', 'ice-giant', 'arctic', 'barren'] as PlanetInfo['type'][]);
  }

  /**
   * Helper: Select atmosphere
   */
  private selectAtmosphere(rng: SeededRandom, type: PlanetInfo['type']): PlanetInfo['atmosphere'] {
    const atmosphereMap: Record<string, PlanetInfo['atmosphere'][]> = {
      'terran': ['breathable', 'thick'],
      'arctic': ['thin', 'breathable'],
      'desert': ['thin', 'none'],
      'oceanic': ['breathable', 'thick'],
      'volcanic': ['toxic', 'corrosive'],
      'toxic': ['toxic', 'corrosive'],
      'barren': ['none', 'thin'],
      'gas-giant': ['thick'],
      'ice-giant': ['thick'],
      'exotic': ['none', 'toxic', 'corrosive']
    };
    const options = atmosphereMap[type] || ['none'];
    return rng.pick(options);
  }

  /**
   * Helper: Calculate temperature
   */
  private calculateTemperature(starTemp: number, distance: number, atmosphere: PlanetInfo['atmosphere']): number {
    const baseTemp = starTemp / (distance * distance);
    const atmosphereMultiplier: Record<string, number> = {
      'none': 1.0, 'thin': 1.1, 'breathable': 1.2, 'thick': 1.5, 'toxic': 1.3, 'corrosive': 1.4
    };
    return baseTemp * (atmosphereMultiplier[atmosphere] || 1.0);
  }

  /**
   * Helper: Calculate gravity
   */
  private calculateGravity(size: PlanetInfo['size'], type: PlanetInfo['type']): number {
    const sizeMap = { 'tiny': 0.3, 'small': 0.6, 'medium': 1.0, 'large': 1.5, 'huge': 2.0 };
    const typeMap: Record<string, number> = {
      'gas-giant': 2.5, 'ice-giant': 1.5, 'barren': 0.8, 'default': 1.0
    };
    return sizeMap[size] * (typeMap[type] || typeMap['default']);
  }

  /**
   * Helper: Calculate habitability
   */
  private calculateHabitability(
    type: PlanetInfo['type'],
    atmosphere: PlanetInfo['atmosphere'],
    temperature: number,
    gravity: number
  ): number {
    let score = 0;
    
    // Type contribution
    const typeScores: Record<string, number> = {
      'terran': 90, 'oceanic': 80, 'arctic': 60, 'desert': 50,
      'volcanic': 20, 'toxic': 10, 'barren': 5, 'gas-giant': 0, 'ice-giant': 0, 'exotic': 30
    };
    score += typeScores[type] || 0;
    
    // Atmosphere
    if (atmosphere === 'breathable') score += 10;
    else if (atmosphere === 'thin') score -= 10;
    else if (atmosphere === 'toxic' || atmosphere === 'corrosive') score -= 30;
    else if (atmosphere === 'none') score -= 40;
    
    // Temperature (ideal: 250-320K)
    if (temperature > 200 && temperature < 350) score += 10;
    else score -= 20;
    
    // Gravity (ideal: 0.8-1.2)
    if (gravity > 0.7 && gravity < 1.3) score += 10;
    else score -= 15;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Helper: Generate system resources
   */
  private generateSystemResources(rng: SeededRandom): string[] {
    const count = rng.nextInt(1, 5);
    return rng.shuffle(this.resources).slice(0, count);
  }

  /**
   * Helper: Generate planet resources
   */
  private generatePlanetResources(rng: SeededRandom, type: PlanetInfo['type']): ResourceDeposit[] {
    const count = rng.nextInt(2, 8);
    const deposits: ResourceDeposit[] = [];
    
    for (let i = 0; i < count; i++) {
      deposits.push({
        type: rng.pick(this.resources),
        abundance: rng.pick(['trace', 'common', 'abundant', 'rich', 'ultra-rich'] as const),
        quality: rng.nextInt(10, 100),
        location: {
          lat: rng.nextFloat(-90, 90),
          lon: rng.nextFloat(-180, 180)
        }
      });
    }
    
    return deposits;
  }

  /**
   * Helper: Generate biomes
   */
  private generateBiomes(rng: SeededRandom, type: PlanetInfo['type'], temperature: number): BiomeInfo[] {
    const count = rng.nextInt(1, 5);
    const biomes: BiomeInfo[] = [];
    let totalCoverage = 0;
    
    for (let i = 0; i < count; i++) {
      const coverage = rng.nextFloat(10, 40);
      if (totalCoverage + coverage > 100) break;
      
      biomes.push({
        type: rng.pick(this.biomeTypes),
        coverage,
        temperature: temperature + rng.nextFloat(-50, 50),
        description: `A ${rng.pick(['vast', 'sprawling', 'dense', 'sparse'])} region`
      });
      
      totalCoverage += coverage;
    }
    
    return biomes;
  }

  /**
   * Helper: Generate fauna
   */
  private generateFauna(rng: SeededRandom, habitability: number, type: PlanetInfo['type']): FaunaInfo[] {
    if (habitability < 20 || type === 'gas-giant' || type === 'ice-giant') return [];
    
    const count = rng.nextInt(0, Math.floor(habitability / 15));
    const fauna: FaunaInfo[] = [];
    
    for (let i = 0; i < count; i++) {
      fauna.push({
        id: `fauna-${rng.nextInt(1000, 9999)}`,
        name: `Species ${rng.pick(this.greekLetters)}-${i + 1}`,
        type: rng.pick(['herbivore', 'carnivore', 'omnivore', 'sentient'] as const),
        size: rng.pick(['tiny', 'small', 'medium', 'large', 'giant'] as const),
        behavior: rng.pick(['passive', 'defensive', 'aggressive', 'intelligent'] as const),
        rarity: rng.pick(['common', 'uncommon', 'rare', 'legendary'] as const),
        description: `Discovered ${new Date().getFullYear()} by explorers`
      });
    }
    
    return fauna;
  }

  /**
   * Helper: Generate flora
   */
  private generateFlora(rng: SeededRandom, habitability: number, type: PlanetInfo['type']): FloraInfo[] {
    if (habitability < 15) return [];
    
    const count = rng.nextInt(0, Math.floor(habitability / 10));
    const flora: FloraInfo[] = [];
    
    for (let i = 0; i < count; i++) {
      const harvestable = rng.nextBool(0.4);
      flora.push({
        id: `flora-${rng.nextInt(1000, 9999)}`,
        name: `Plant ${rng.pick(this.greekLetters)}-${i + 1}`,
        type: rng.pick(['tree', 'bush', 'flower', 'fungus', 'crystal', 'exotic'] as const),
        size: rng.pick(['small', 'medium', 'large', 'massive'] as const),
        harvestable,
        resource: harvestable ? rng.pick(this.resources) : null,
        rarity: rng.pick(['common', 'uncommon', 'rare', 'legendary'] as const)
      });
    }
    
    return flora;
  }

  /**
   * Helper: Generate anomalies
   */
  private generateAnomalies(rng: SeededRandom): AnomalyInfo[] {
    if (!rng.nextBool(0.25)) return []; // 25% chance of any anomalies
    
    const count = rng.nextInt(1, 3);
    const anomalies: AnomalyInfo[] = [];
    
    for (let i = 0; i < count; i++) {
      anomalies.push({
        id: `anomaly-${rng.nextInt(1000, 9999)}`,
        type: rng.pick(['temporal', 'spatial', 'subspace', 'gravimetric', 'quantum', 'dimensional'] as const),
        name: `Anomaly ${rng.pick(this.greekLetters)}-${i + 1}`,
        description: 'Unusual readings detected',
        dangerLevel: rng.nextInt(1, 10),
        rewards: []
      });
    }
    
    return anomalies;
  }

  /**
   * Helper: Generate civilization
   */
  private generateCivilization(rng: SeededRandom, habitability: number): CivilizationInfo | null {
    if (habitability < 50 || !rng.nextBool(0.1)) return null; // 10% chance if habitable
    
    return {
      name: `${rng.pick(this.greekLetters)} Civilization`,
      techLevel: rng.nextInt(0, 10),
      population: rng.nextInt(1000000, 10000000000),
      attitude: rng.pick(['hostile', 'cautious', 'neutral', 'friendly', 'allied'] as const),
      government: rng.pick(['primitive', 'tribal', 'feudal', 'democratic', 'totalitarian', 'hive-mind'] as const)
    };
  }

  /**
   * Get universe configuration
   */
  getConfig(): UniverseConfig {
    return { ...this.config };
  }

  /**
   * Get universe seed
   */
  getSeed(): string | number {
    return this.config.seed;
  }
}

export default ProceduralUniverse;
