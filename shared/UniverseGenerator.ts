/**
 * No Man's Sky Style Universe Generator
 * Procedurally generates galaxies, solar systems, planets, moons, and interstellar objects
 * Uses seed-based generation for deterministic universe generation
 */

// Seeded random number generator for deterministic generation
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  nextChoice<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
}

// Types
export interface CelestialObject {
  id: string;
  name: string;
  type: string;
  coordinates: [number, number, number];
  seed: number;
}

export interface Atmosphere {
  type: string;
  density: number; // 0-100
  toxicity: number; // 0-100
  temperature: number; // Celsius
  windStrength: number; // 0-100
}

export interface Biome {
  name: string;
  terrainType: string;
  flora: string[];
  fauna: string[];
  hazards: string[];
}

export interface Planet extends CelestialObject {
  type: "planet";
  parentSystem: string;
  classification: string;
  radius: number; // km
  mass: number; // Earth masses
  gravity: number; // g
  dayLength: number; // hours
  yearLength: number; // days
  atmosphere: Atmosphere;
  waterPercentage: number;
  temperature: number; // Celsius
  biomes: Biome[];
  resources: { name: string; abundance: number }[]; // 0-100
  hazardLevel: number; // 0-100
  discovered: boolean;
}

export interface Moon extends CelestialObject {
  type: "moon";
  parentPlanet: string;
  classification: string;
  radius: number;
  orbitDistance: number; // km
  orbitPeriod: number; // days
  atmosphere: Atmosphere;
  resources: { name: string; abundance: number }[];
}

export interface Asteroid extends CelestialObject {
  type: "asteroid";
  parentSystem: string;
  classification: string; // C, M, S type
  radius: number;
  composition: string[];
  metalContent: number; // 0-100
}

export interface SpaceStation extends CelestialObject {
  type: "spacestation";
  parentSystem: string;
  faction: string;
  level: number; // 1-5
  population: number;
  tradingPosts: number;
  facilities: string[];
}

export interface Star extends CelestialObject {
  type: "star";
  parentGalaxy: string;
  starClass: string; // O, B, A, F, G, K, M
  temperature: number; // Kelvin
  luminosity: number; // Solar luminosity
  radius: number; // Solar radius
  mass: number; // Solar masses
  age: number; // Billion years
  color: string;
  planetsCount: number;
}

export interface SolarSystem extends CelestialObject {
  type: "solarsystem";
  parentGalaxy: string;
  stars: Star[];
  planets: Planet[];
  moons: Moon[];
  asteroids: Asteroid[];
  spaceStations: SpaceStation[];
  economyType: string;
  conflictLevel: number; // 0-100
  veil: number; // 0-100 (how hidden/dangerous)
}

export interface Galaxy extends CelestialObject {
  type: "galaxy";
  classification: string; // Spiral, Elliptical, Irregular
  stars: number;
  diameter: number; // light years
  age: number; // Billion years
  systemCount: number;
}

// Star type data
const STAR_CLASSES = [
  {
    class: "O",
    minTemp: 30000,
    maxTemp: 50000,
    minMass: 16,
    maxMass: 50,
    color: "#3B82F6",
  },
  {
    class: "B",
    minTemp: 10000,
    maxTemp: 30000,
    minMass: 2.1,
    maxMass: 16,
    color: "#60A5FA",
  },
  {
    class: "A",
    minTemp: 7500,
    maxTemp: 10000,
    minMass: 1.04,
    maxMass: 2.1,
    color: "#93C5FD",
  },
  {
    class: "F",
    minTemp: 6000,
    maxTemp: 7500,
    minMass: 1.04,
    maxMass: 1.04,
    color: "#FBBF24",
  },
  {
    class: "G",
    minTemp: 5200,
    maxTemp: 6000,
    minMass: 0.8,
    maxMass: 1.04,
    color: "#FCD34D",
  },
  {
    class: "K",
    minTemp: 3700,
    maxTemp: 5200,
    minMass: 0.45,
    maxMass: 0.8,
    color: "#FB923C",
  },
  {
    class: "M",
    minTemp: 2400,
    maxTemp: 3700,
    minMass: 0.08,
    maxMass: 0.45,
    color: "#DC2626",
  },
];

const PLANET_CLASSIFICATIONS = [
  "Terrestrial",
  "Super-Earth",
  "Neptune-like",
  "Gas Giant",
  "Ice World",
  "Lava World",
  "Barren",
];

const ATMOSPHERE_TYPES = [
  "None",
  "Thin",
  "Dense",
  "Toxic",
  "Exotic",
  "Neon",
  "Sulfuric",
  "Breathable",
];

const BIOME_TEMPLATES = [
  {
    name: "Lush",
    terrainType: "Forest",
    flora: ["Giant Trees", "Bioluminescent Plants", "Crystalline Flowers"],
    fauna: ["Herbivores", "Predators", "Flying Creatures"],
    hazards: ["None"],
  },
  {
    name: "Toxic",
    terrainType: "Swamp",
    flora: ["Acid Plants", "Carnivorous Flora"],
    fauna: ["Acid Creatures", "Parasites"],
    hazards: ["Acid Rain", "Toxic Spores"],
  },
  {
    name: "Frozen",
    terrainType: "Tundra",
    flora: ["Ice Mosses", "Frost Plants"],
    fauna: ["Ice Walkers", "Crystalline Creatures"],
    hazards: ["Blizzards", "Avalanches"],
  },
  {
    name: "Desert",
    terrainType: "Sand Dunes",
    flora: ["Cacti", "Sand Plants"],
    fauna: ["Sand Worms", "Desert Lizards"],
    hazards: ["Sand Storms", "Heat"],
  },
  {
    name: "Volcanic",
    terrainType: "Lava Fields",
    flora: ["Heat-Resistant Plants"],
    fauna: ["Lava Creatures"],
    hazards: ["Lava Flows", "Volcanic Gas"],
  },
  {
    name: "Aquatic",
    terrainType: "Ocean",
    flora: ["Kelp", "Coral"],
    fauna: ["Fish", "Whales", "Squid"],
    hazards: ["Strong Currents", "Predators"],
  },
];

const RESOURCES = [
  "Iron",
  "Copper",
  "Gold",
  "Platinum",
  "Uranium",
  "Iridium",
  "Emeril",
  "Albumen Pearl",
  "Storm Crystal",
  "Lush Fruit",
];

const ASTEROID_TYPES = [
  { type: "C", name: "Carbonaceous", metals: [20, 40], composition: ["Carbon", "Silicates"] },
  { type: "M", name: "Metallic", metals: [60, 95], composition: ["Iron", "Nickel", "Platinum"] },
  { type: "S", name: "Silicate", metals: [15, 25], composition: ["Silicates", "Iron"] },
];

const SPACE_STATION_FACILITIES = [
  "Trading Post",
  "Refinery",
  "Farming Facility",
  "Research Lab",
  "Repair Station",
  "Clone Facility",
  "Weapon Shop",
  "Ship Dealer",
];

const FACTIONS = ["Gek", "Korvax", "Vy'keen", "Traders Guild", "Outlaws", "Pirates"];

export class UniverseGenerator {
  private seed: number;
  private rng: SeededRandom;

  constructor(seed: number) {
    this.seed = seed;
    this.rng = new SeededRandom(seed);
  }

  /**
   * Generate a galaxy
   */
  generateGalaxy(galaxyIndex: number): Galaxy {
    const galaxySeed = this.hashSeed(this.seed, galaxyIndex);
    const rng = new SeededRandom(galaxySeed);

    const classifications = ["Spiral", "Elliptical", "Irregular", "Lenticular"];
    const classification = rng.nextChoice(classifications);

    const starCount = rng.nextInt(100000000, 200000000);

    return {
      id: `GALAXY-${galaxyIndex}`,
      name: `Galaxy ${galaxyIndex + 1}`,
      type: "galaxy",
      classification,
      stars: starCount,
      diameter: rng.nextInt(50000, 200000), // light years
      age: rng.nextInt(1, 13.8), // billion years
      systemCount: rng.nextInt(1000, 10000),
      coordinates: [
        rng.nextFloat(-1000000, 1000000),
        rng.nextFloat(-1000000, 1000000),
        rng.nextFloat(-1000000, 1000000),
      ] as [number, number, number],
      seed: galaxySeed,
    };
  }

  /**
   * Generate a solar system within a galaxy
   */
  generateSolarSystem(galaxyIndex: number, systemIndex: number): SolarSystem {
    const systemSeed = this.hashSeed(this.hashSeed(this.seed, galaxyIndex), systemIndex);
    const rng = new SeededRandom(systemSeed);

    // Generate stars (binary/trinary systems possible)
    const starCount = rng.nextInt(1, 3);
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push(this.generateStar(systemSeed, i));
    }

    // Generate planets
    const planetsPerStar = rng.nextInt(3, 12);
    const planets: Planet[] = [];
    for (let i = 0; i < planetsPerStar; i++) {
      planets.push(this.generatePlanet(systemSeed, stars[0].id, i));
    }

    // Generate asteroids in asteroid belt
    const asteroidCount = rng.nextInt(50, 500);
    const asteroids: Asteroid[] = [];
    for (let i = 0; i < asteroidCount; i++) {
      asteroids.push(this.generateAsteroid(systemSeed, i));
    }

    // Generate space stations
    const stationCount = rng.nextInt(0, 3);
    const spaceStations: SpaceStation[] = [];
    for (let i = 0; i < stationCount; i++) {
      spaceStations.push(this.generateSpaceStation(systemSeed, i));
    }

    // Generate moons for planets
    const moons: Moon[] = [];
    planets.forEach((planet) => {
      const moonCount = rng.nextInt(0, 5);
      for (let i = 0; i < moonCount; i++) {
        moons.push(this.generateMoon(systemSeed, planet.id, i));
      }
    });

    return {
      id: `SOL-${galaxyIndex}-${systemIndex}`,
      name: this.generateSystemName(systemSeed),
      type: "solarsystem",
      parentGalaxy: `GALAXY-${galaxyIndex}`,
      stars,
      planets,
      moons,
      asteroids,
      spaceStations,
      economyType: rng.nextChoice(["Mining", "Manufacturing", "Trading", "High Tech", "Scientific"]),
      conflictLevel: rng.nextInt(0, 100),
      veil: rng.nextInt(0, 100),
      coordinates: [
        rng.nextFloat(-50000, 50000),
        rng.nextFloat(-5000, 5000),
        rng.nextFloat(-50000, 50000),
      ] as [number, number, number],
      seed: systemSeed,
    };
  }

  /**
   * Generate a star
   */
  private generateStar(seed: number, starIndex: number): Star {
    const starSeed = this.hashSeed(seed, starIndex);
    const rng = new SeededRandom(starSeed);

    const starClassData = rng.nextChoice(STAR_CLASSES);

    const temperature = rng.nextInt(starClassData.minTemp, starClassData.maxTemp);
    const mass = rng.nextFloat(starClassData.minMass, starClassData.maxMass);
    const luminosity = Math.pow(mass, 3.5);

    return {
      id: `STAR-${starIndex}`,
      name: `Star ${starIndex + 1}`,
      type: "star",
      parentGalaxy: "",
      starClass: starClassData.class,
      temperature,
      luminosity,
      radius: Math.pow(temperature / 5778, 2) * Math.sqrt(luminosity),
      mass,
      age: rng.nextInt(1, 13),
      color: starClassData.color,
      planetsCount: rng.nextInt(3, 12),
      coordinates: [rng.nextFloat(-100, 100), rng.nextFloat(-100, 100), rng.nextFloat(-100, 100)] as [
        number,
        number,
        number,
      ],
      seed: starSeed,
    };
  }

  /**
   * Generate a planet
   */
  private generatePlanet(seed: number, parentStarId: string, planetIndex: number): Planet {
    const planetSeed = this.hashSeed(seed, planetIndex);
    const rng = new SeededRandom(planetSeed);

    const classification = rng.nextChoice(PLANET_CLASSIFICATIONS);
    const radius = rng.nextInt(3000, 150000); // km
    const mass = Math.pow(radius / 6371, 3); // Earth masses

    const atmosphereType = rng.nextChoice(ATMOSPHERE_TYPES);
    const atmosphere: Atmosphere = {
      type: atmosphereType,
      density: rng.nextInt(0, 100),
      toxicity: rng.nextInt(0, 100),
      temperature: rng.nextInt(-200, 150),
      windStrength: rng.nextInt(0, 100),
    };

    // Generate biomes
    const biomeCount = rng.nextInt(1, 4);
    const biomes: Biome[] = [];
    for (let i = 0; i < biomeCount; i++) {
      biomes.push(rng.nextChoice(BIOME_TEMPLATES));
    }

    // Generate resources
    const resourceCount = rng.nextInt(3, 8);
    const resources = [];
    for (let i = 0; i < resourceCount; i++) {
      resources.push({
        name: rng.nextChoice(RESOURCES),
        abundance: rng.nextInt(10, 100),
      });
    }

    return {
      id: `PLANET-${planetIndex}`,
      name: this.generatePlanetName(planetSeed),
      type: "planet",
      parentSystem: "",
      classification,
      radius,
      mass,
      gravity: (mass / Math.pow(radius / 6371, 2)) * 9.81,
      dayLength: rng.nextInt(6, 48),
      yearLength: rng.nextInt(100, 1000),
      atmosphere,
      waterPercentage: rng.nextInt(0, 100),
      temperature: atmosphere.temperature,
      biomes,
      resources,
      hazardLevel: atmosphere.toxicity + rng.nextInt(0, 50),
      discovered: rng.next() > 0.5,
      coordinates: [
        rng.nextFloat(-1000000, 1000000),
        rng.nextFloat(-500000, 500000),
        rng.nextFloat(-1000000, 1000000),
      ] as [number, number, number],
      seed: planetSeed,
    };
  }

  /**
   * Generate a moon
   */
  private generateMoon(seed: number, parentPlanetId: string, moonIndex: number): Moon {
    const moonSeed = this.hashSeed(seed, moonIndex);
    const rng = new SeededRandom(moonSeed);

    const radius = rng.nextInt(1000, 10000);
    const atmosphere: Atmosphere = {
      type: rng.nextChoice(["None", "Thin"]),
      density: rng.nextInt(0, 20),
      toxicity: rng.nextInt(0, 50),
      temperature: rng.nextInt(-100, 50),
      windStrength: rng.nextInt(0, 30),
    };

    const resources = [];
    for (let i = 0; i < rng.nextInt(1, 4); i++) {
      resources.push({
        name: rng.nextChoice(RESOURCES),
        abundance: rng.nextInt(10, 80),
      });
    }

    return {
      id: `MOON-${moonIndex}`,
      name: `${parentPlanetId}'s Moon ${moonIndex + 1}`,
      type: "moon",
      parentPlanet: parentPlanetId,
      classification: rng.nextChoice(["Rocky", "Icy", "Metallic", "Barren"]),
      radius,
      orbitDistance: rng.nextInt(200000, 1000000),
      orbitPeriod: rng.nextInt(1, 100),
      atmosphere,
      resources,
      coordinates: [
        rng.nextFloat(-500000, 500000),
        rng.nextFloat(-250000, 250000),
        rng.nextFloat(-500000, 500000),
      ] as [number, number, number],
      seed: moonSeed,
    };
  }

  /**
   * Generate an asteroid
   */
  private generateAsteroid(seed: number, asteroidIndex: number): Asteroid {
    const asteroidSeed = this.hashSeed(seed, asteroidIndex);
    const rng = new SeededRandom(asteroidSeed);

    const asteroidType = rng.nextChoice(ASTEROID_TYPES);

    return {
      id: `ASTEROID-${asteroidIndex}`,
      name: `Asteroid ${asteroidIndex}`,
      type: "asteroid",
      parentSystem: "",
      classification: asteroidType.type,
      radius: rng.nextInt(100, 10000),
      composition: asteroidType.composition,
      metalContent: rng.nextInt(asteroidType.metals[0], asteroidType.metals[1]),
      coordinates: [
        rng.nextFloat(-100000, 100000),
        rng.nextFloat(-50000, 50000),
        rng.nextFloat(-100000, 100000),
      ] as [number, number, number],
      seed: asteroidSeed,
    };
  }

  /**
   * Generate a space station
   */
  private generateSpaceStation(seed: number, stationIndex: number): SpaceStation {
    const stationSeed = this.hashSeed(seed, stationIndex);
    const rng = new SeededRandom(stationSeed);

    const facilities = [];
    const facilityCount = rng.nextInt(2, 5);
    for (let i = 0; i < facilityCount; i++) {
      facilities.push(rng.nextChoice(SPACE_STATION_FACILITIES));
    }

    return {
      id: `STATION-${stationIndex}`,
      name: this.generateStationName(stationSeed),
      type: "spacestation",
      parentSystem: "",
      faction: rng.nextChoice(FACTIONS),
      level: rng.nextInt(1, 5),
      population: rng.nextInt(100, 10000),
      tradingPosts: rng.nextInt(1, 5),
      facilities,
      coordinates: [
        rng.nextFloat(-10000, 10000),
        rng.nextFloat(-5000, 5000),
        rng.nextFloat(-10000, 10000),
      ] as [number, number, number],
      seed: stationSeed,
    };
  }

  /**
   * Generate names using seed
   */
  private generateSystemName(seed: number): string {
    const rng = new SeededRandom(seed);
    const prefixes = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta"];
    const suffixes = ["-1", "-2", "-3", "-A", "-B", "-C", "-X"];
    return `${rng.nextChoice(prefixes)} ${Math.abs(seed).toString(36).toUpperCase()}${rng.nextChoice(suffixes)}`;
  }

  private generatePlanetName(seed: number): string {
    const rng = new SeededRandom(seed);
    const prefixes = ["Kepler", "Proxima", "Terra", "Nova", "Centauri", "Sirius", "Rigel", "Altair"];
    const suffixes = ["-1", "-2", "-3", "a", "b", "c", "d"];
    return `${rng.nextChoice(prefixes)}${rng.nextChoice(suffixes)}`;
  }

  private generateStationName(seed: number): string {
    const rng = new SeededRandom(seed);
    const prefixes = ["Space", "Orbital", "Trading", "Research", "Mining"];
    const nouns = ["Station", "Hub", "Outpost", "Colony", "Port"];
    return `${rng.nextChoice(prefixes)} ${rng.nextChoice(nouns)} ${Math.abs(seed).toString(36).toUpperCase()}`;
  }

  /**
   * Hash function for seed derivation
   */
  private hashSeed(seed: number, value: number): number {
    let hash = seed;
    hash = (hash ^ (value << 5) + hash) ^ (value >> 2);
    hash = (hash ^ (value * 31)) >>> 0;
    return Math.abs(hash);
  }
}

export default UniverseGenerator;
