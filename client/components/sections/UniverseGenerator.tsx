import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Globe,
  Star,
  Zap,
  Mountain,
  Waves,
  Thermometer,
  Wind,
  Snowflake,
  Sun,
  Moon,
  Atom,
  Sparkles,
  RefreshCw,
  Eye,
  Settings,
  Dice1,
  Save,
  Upload,
  Download,
  Hash,
  Navigation,
  MapPin,
  Info,
} from "lucide-react";

interface UniverseSeed {
  value: string;
  timestamp: number;
  parameters: UniverseSettings;
  stats: {
    galaxies: number;
    systems: number;
    planets: number;
    moons: number;
    habitablePlanets: number;
    civilizations: number;
  };
}

interface Galaxy {
  id: string;
  name: string;
  type: "Spiral" | "Elliptical" | "Irregular" | "Dwarf";
  size: "Small" | "Medium" | "Large" | "Massive";
  age_billion_years: number;
  star_count_billions: number;
  inhabited_systems: number;
  dominant_species: string[];
  phenomena: string[];
  threat_level: number;
  exploration_status: number;
  coordinates: { x: number; y: number; z: number };
  seedValue: number;
}

interface StarSystem {
  id: string;
  galaxyId: string;
  name: string;
  star_type:
    | "G-type"
    | "K-type"
    | "M-type"
    | "F-type"
    | "A-type"
    | "B-type"
    | "O-type"
    | "Binary"
    | "Neutron"
    | "Pulsar";
  planets: number;
  habitable_zone_planets: number;
  asteroid_belts: number;
  phenomena: string[];
  colonized: boolean;
  controlling_faction: string;
  resources: string[];
  trade_routes: string[];
  strategic_value: number;
  coordinates: { x: number; y: number; z: number };
  seedValue: number;
}

interface Moon {
  id: string;
  planetId: string;
  name: string;
  type:
    | "Rocky"
    | "Ice"
    | "Volcanic"
    | "Metallic"
    | "Captured Asteroid"
    | "Artificial";
  size: number; // relative to planet
  gravity: number;
  atmosphere: string;
  temperature_c: number;
  orbital_period_days: number;
  tidally_locked: boolean;
  resources: string[];
  inhabited: boolean;
  facilities: string[];
  surface_features: string[];
}

interface Planet {
  id: string;
  systemId: string;
  name: string;
  type:
    | "Terrestrial"
    | "Gas Giant"
    | "Ice World"
    | "Desert"
    | "Ocean"
    | "Volcanic"
    | "Rogue"
    | "Artificial";
  class: "M" | "L" | "K" | "H" | "J" | "T" | "D" | "Y";
  size: number;
  gravity: number;
  atmosphere: string;
  temperature_c: number;
  biomes: BiomeType[];
  population: number;
  civilization_level: number;
  resources: string[];
  moons: Moon[];
  rings: boolean;
  day_length_hours: number;
  year_length_days: number;
  coordinates: { x: number; y: number; z: number };
  seedValue: number;
}

interface BiomeType {
  id: string;
  name: string;
  coverage_percentage: number;
  dominant_features: string[];
  climate:
    | "Arctic"
    | "Temperate"
    | "Tropical"
    | "Desert"
    | "Volcanic"
    | "Underwater"
    | "Aerial"
    | "Underground";
  flora: string[];
  fauna: string[];
  resources: string[];
  habitability: number;
}

interface UniverseSettings {
  galaxy_density: number;
  star_formation_rate: number;
  life_probability: number;
  civilization_probability: number;
  resource_abundance: number;
  anomaly_frequency: number;
  moon_generation_rate: number;
  max_moons_per_planet: number;
}

interface GenerationPhase {
  name: string;
  progress: number;
  status: "pending" | "active" | "complete";
  details: string;
}

export function UniverseGenerator() {
  const [activeTab, setActiveTab] = useState<
    "generator" | "galaxies" | "systems" | "planets" | "moons"
  >("generator");
  const [selectedGalaxy, setSelectedGalaxy] = useState<Galaxy | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<StarSystem | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [customSeed, setCustomSeed] = useState("");
  const [currentSeed, setCurrentSeed] = useState<UniverseSeed | null>(null);
  const [savedSeeds, setSavedSeeds] = useState<UniverseSeed[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhases, setGenerationPhases] = useState<GenerationPhase[]>(
    [],
  );

  const [universeSettings, setUniverseSettings] = useState<UniverseSettings>({
    galaxy_density: 7,
    star_formation_rate: 6,
    life_probability: 4,
    civilization_probability: 3,
    resource_abundance: 5,
    anomaly_frequency: 2,
    moon_generation_rate: 8,
    max_moons_per_planet: 12,
  });

  const [galaxies, setGalaxies] = useState<Galaxy[]>([]);
  const [starSystems, setStarSystems] = useState<StarSystem[]>([]);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [moons, setMoons] = useState<Moon[]>([]);

  // Seeded random number generator
  class SeededRandom {
    private seed: number;

    constructor(seed: string | number) {
      this.seed = typeof seed === "string" ? this.hashCode(seed) : seed;
    }

    private hashCode(str: string): number {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash);
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

    choice<T>(array: T[]): T {
      return array[Math.floor(this.next() * array.length)];
    }
  }

  const galaxyNames = [
    "Andromeda",
    "Milky Way",
    "Triangulum",
    "Large Magellanic Cloud",
    "Small Magellanic Cloud",
    "Whirlpool",
    "Sombrero",
    "Pinwheel",
    "Black Eye",
    "Cartwheel",
    "Antennae",
    "Tadpole",
    "Cigar",
    "Sunflower",
    "Cat's Eye",
    "Spiral Nebula",
    "Void Walker",
    "Star Forge",
    "Quantum Spiral",
    "Dark Matter Web",
    "Photon Fields",
    "Antimatter Core",
    "Warp Cascade",
  ];

  const starNames = [
    "Sol",
    "Alpha Centauri",
    "Sirius",
    "Vega",
    "Arcturus",
    "Capella",
    "Rigel",
    "Procyon",
    "Betelgeuse",
    "Altair",
    "Aldebaran",
    "Antares",
    "Spica",
    "Pollux",
    "Fomalhaut",
    "Wolf",
    "Tau Ceti",
    "Epsilon Eridani",
    "Gliese",
    "Kepler",
    "TRAPPIST",
    "Proxima",
    "Barnard's Star",
    "Ross",
    "Lalande",
    "Groombridge",
    "Lacaille",
    "Struve",
  ];

  const planetNames = [
    "Earth",
    "Vulcan",
    "Andoria",
    "Tellar",
    "Bajor",
    "Cardassia",
    "Romulus",
    "Remus",
    "Kronos",
    "Risa",
    "Ferenginar",
    "Betazed",
    "Trill",
    "Borg Prime",
    "Genesis",
    "New Earth",
    "Paradise",
    "Haven",
    "Sanctuary",
    "Meridian",
    "Pacifica",
    "Rura Penthe",
    "Talos IV",
    "Nimbus III",
    "Neural",
    "Organia",
    "Excalbia",
    "Melkot",
    "Gideon",
  ];

  const moonNames = [
    "Luna",
    "Phobos",
    "Deimos",
    "Europa",
    "Ganymede",
    "Callisto",
    "Io",
    "Titan",
    "Enceladus",
    "Miranda",
    "Triton",
    "Charon",
    "Alpha",
    "Beta",
    "Gamma",
    "Delta",
    "Epsilon",
    "Zeta",
    "Eta",
    "Theta",
    "Iota",
    "Kappa",
    "Lambda",
    "Mu",
    "Nu",
  ];

  const alienSpecies = [
    "Humans",
    "Vulcans",
    "Klingons",
    "Romulans",
    "Cardassians",
    "Bajorans",
    "Ferengi",
    "Betazoids",
    "Trill",
    "Andorians",
    "Tellarites",
    "Borg",
    "Dominion",
    "Jem'Hadar",
    "Vorta",
    "Founders",
    "Gorn",
    "Orions",
    "Nausicaans",
    "Pakled",
    "Bolians",
    "Benzites",
    "Denobulan",
    "Xindi",
  ];

  const biomeTemplates = [
    {
      name: "Temperate Forest",
      climate: "Temperate" as const,
      habitability: 95,
    },
    {
      name: "Tropical Rainforest",
      climate: "Tropical" as const,
      habitability: 85,
    },
    { name: "Desert", climate: "Desert" as const, habitability: 30 },
    { name: "Tundra", climate: "Arctic" as const, habitability: 40 },
    { name: "Ocean", climate: "Temperate" as const, habitability: 60 },
    { name: "Volcanic Plains", climate: "Volcanic" as const, habitability: 20 },
    { name: "Mountain Range", climate: "Temperate" as const, habitability: 70 },
    { name: "Swampland", climate: "Tropical" as const, habitability: 50 },
    {
      name: "Crystal Caverns",
      climate: "Underground" as const,
      habitability: 35,
    },
    { name: "Floating Islands", climate: "Aerial" as const, habitability: 45 },
  ];

  const generateRandomSeed = (): string => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    return `${timestamp}-${random}`;
  };

  const generateUniverse = async (seedValue?: string) => {
    const seed = seedValue || generateRandomSeed();
    const rng = new SeededRandom(seed);

    setIsGenerating(true);
    setGenerationPhases([
      {
        name: "Initializing",
        progress: 0,
        status: "active",
        details: "Setting up cosmic parameters...",
      },
      {
        name: "Galaxies",
        progress: 0,
        status: "pending",
        details: "Generating galactic structures...",
      },
      {
        name: "Star Systems",
        progress: 0,
        status: "pending",
        details: "Creating stellar formations...",
      },
      {
        name: "Planets",
        progress: 0,
        status: "pending",
        details: "Forming planetary bodies...",
      },
      {
        name: "Moons",
        progress: 0,
        status: "pending",
        details: "Generating lunar satellites...",
      },
      {
        name: "Life & Civilizations",
        progress: 0,
        status: "pending",
        details: "Seeding life across the universe...",
      },
    ]);

    // Phase 1: Initialization
    await simulateProgress(0, 15, "Initializing");

    // Phase 2: Generate Galaxies
    updatePhaseStatus(1, "active");
    const newGalaxies = generateGalaxies(rng);
    setGalaxies(newGalaxies);
    await simulateProgress(15, 30, "Galaxies");
    updatePhaseStatus(1, "complete");

    // Phase 3: Generate Star Systems
    updatePhaseStatus(2, "active");
    const newSystems = generateStarSystems(rng, newGalaxies);
    setStarSystems(newSystems);
    await simulateProgress(30, 50, "Star Systems");
    updatePhaseStatus(2, "complete");

    // Phase 4: Generate Planets
    updatePhaseStatus(3, "active");
    const newPlanets = generatePlanets(rng, newSystems);
    setPlanets(newPlanets);
    await simulateProgress(50, 75, "Planets");
    updatePhaseStatus(3, "complete");

    // Phase 5: Generate Moons
    updatePhaseStatus(4, "active");
    const newMoons = generateMoons(rng, newPlanets);
    setMoons(newMoons);
    await simulateProgress(75, 90, "Moons");
    updatePhaseStatus(4, "complete");

    // Phase 6: Generate Life and Civilizations
    updatePhaseStatus(5, "active");
    populateLifeAndCivilizations(rng, newPlanets, newMoons);
    await simulateProgress(90, 100, "Life & Civilizations");
    updatePhaseStatus(5, "complete");

    // Create universe seed record
    const universeSeed: UniverseSeed = {
      value: seed,
      timestamp: Date.now(),
      parameters: { ...universeSettings },
      stats: {
        galaxies: newGalaxies.length,
        systems: newSystems.length,
        planets: newPlanets.length,
        moons: newMoons.length,
        habitablePlanets: newPlanets.filter((p) => p.class === "M").length,
        civilizations: newPlanets.filter((p) => p.civilization_level > 0)
          .length,
      },
    };

    setCurrentSeed(universeSeed);
    setIsGenerating(false);
  };

  const simulateProgress = (
    start: number,
    end: number,
    phase: string,
  ): Promise<void> => {
    return new Promise((resolve) => {
      const duration = 800; // milliseconds
      const steps = 20;
      const stepDuration = duration / steps;
      const progressStep = (end - start) / steps;

      let currentProgress = start;
      const interval = setInterval(() => {
        currentProgress += progressStep;
        updatePhaseProgress(phase, Math.min(currentProgress, end));

        if (currentProgress >= end) {
          clearInterval(interval);
          resolve();
        }
      }, stepDuration);
    });
  };

  const updatePhaseStatus = (
    index: number,
    status: "pending" | "active" | "complete",
  ) => {
    setGenerationPhases((prev) =>
      prev.map((phase, i) => (i === index ? { ...phase, status } : phase)),
    );
  };

  const updatePhaseProgress = (name: string, progress: number) => {
    setGenerationPhases((prev) =>
      prev.map((phase) =>
        phase.name === name ? { ...phase, progress } : phase,
      ),
    );
  };

  const generateGalaxies = (rng: SeededRandom): Galaxy[] => {
    const galaxyCount = Math.floor(universeSettings.galaxy_density * 2) + 3;
    const newGalaxies: Galaxy[] = [];

    for (let i = 0; i < galaxyCount; i++) {
      const galaxy: Galaxy = {
        id: `galaxy_${i}`,
        name: rng.choice(galaxyNames),
        type: rng.choice(["Spiral", "Elliptical", "Irregular", "Dwarf"]),
        size: rng.choice(["Small", "Medium", "Large", "Massive"]),
        age_billion_years: rng.nextFloat(1.0, 13.8),
        star_count_billions: rng.nextInt(10, 1000),
        inhabited_systems: rng.nextInt(50, 2000),
        dominant_species: Array.from({ length: rng.nextInt(1, 4) }, () =>
          rng.choice(alienSpecies),
        ),
        phenomena: Array.from({ length: rng.nextInt(1, 5) }, () =>
          rng.choice([
            "Black Hole",
            "Nebula",
            "Dark Matter",
            "Wormhole",
            "Quantum Storm",
          ]),
        ),
        threat_level: rng.nextInt(1, 10),
        exploration_status: rng.nextInt(1, 100),
        coordinates: {
          x: rng.nextFloat(-1000, 1000),
          y: rng.nextFloat(-1000, 1000),
          z: rng.nextFloat(-100, 100),
        },
        seedValue: rng.nextInt(1, 1000000),
      };
      newGalaxies.push(galaxy);
    }

    return newGalaxies;
  };

  const generateStarSystems = (
    rng: SeededRandom,
    galaxies: Galaxy[],
  ): StarSystem[] => {
    const systems: StarSystem[] = [];
    const systemsPerGalaxy =
      Math.floor(universeSettings.star_formation_rate * 5) + 5;

    galaxies.forEach((galaxy) => {
      for (let i = 0; i < systemsPerGalaxy; i++) {
        const system: StarSystem = {
          id: `${galaxy.id}_system_${i}`,
          galaxyId: galaxy.id,
          name: `${rng.choice(starNames)} ${String.fromCharCode(65 + rng.nextInt(0, 25))}`,
          star_type: rng.choice([
            "G-type",
            "K-type",
            "M-type",
            "F-type",
            "A-type",
            "B-type",
            "O-type",
            "Binary",
            "Neutron",
            "Pulsar",
          ]),
          planets: rng.nextInt(1, 12),
          habitable_zone_planets: rng.nextInt(0, 3),
          asteroid_belts: rng.nextInt(0, 3),
          phenomena: Array.from({ length: rng.nextInt(0, 3) }, () =>
            rng.choice([
              "Solar Flares",
              "Asteroid Field",
              "Nebula",
              "Pulsar Emissions",
              "Gravitational Anomaly",
            ]),
          ),
          colonized:
            rng.next() < universeSettings.civilization_probability / 10,
          controlling_faction: rng.choice(alienSpecies),
          resources: Array.from({ length: rng.nextInt(1, 6) }, () =>
            rng.choice([
              "Dilithium",
              "Duranium",
              "Tritanium",
              "Latinum",
              "Biomatter",
              "Rare Earth",
            ]),
          ),
          trade_routes: [],
          strategic_value: rng.nextInt(1, 10),
          coordinates: {
            x: galaxy.coordinates.x + rng.nextFloat(-100, 100),
            y: galaxy.coordinates.y + rng.nextFloat(-100, 100),
            z: galaxy.coordinates.z + rng.nextFloat(-10, 10),
          },
          seedValue: rng.nextInt(1, 1000000),
        };
        systems.push(system);
      }
    });

    return systems;
  };

  const generatePlanets = (
    rng: SeededRandom,
    systems: StarSystem[],
  ): Planet[] => {
    const planets: Planet[] = [];

    systems.forEach((system) => {
      for (let i = 0; i < system.planets; i++) {
        const isHabitable =
          i < system.habitable_zone_planets &&
          rng.next() < universeSettings.life_probability / 10;
        const planetType = isHabitable
          ? "Terrestrial"
          : rng.choice([
              "Terrestrial",
              "Gas Giant",
              "Ice World",
              "Desert",
              "Ocean",
              "Volcanic",
              "Rogue",
            ]);

        const planet: Planet = {
          id: `${system.id}_planet_${i}`,
          systemId: system.id,
          name: `${rng.choice(planetNames)} ${rng.nextInt(1, 999)}`,
          type: planetType,
          class: isHabitable
            ? "M"
            : rng.choice(["L", "K", "H", "J", "T", "D", "Y"]),
          size: rng.nextFloat(0.3, 3.0),
          gravity: rng.nextFloat(0.1, 2.5),
          atmosphere: rng.choice([
            "Oxygen-Nitrogen",
            "Carbon Dioxide",
            "Methane",
            "None",
            "Toxic",
            "Hydrogen",
          ]),
          temperature_c: rng.nextInt(-200, 500),
          biomes: [],
          population: isHabitable ? rng.nextInt(0, 10000000000) : 0,
          civilization_level:
            isHabitable &&
            rng.next() < universeSettings.civilization_probability / 10
              ? rng.nextInt(1, 10)
              : 0,
          resources: Array.from({ length: rng.nextInt(1, 8) }, () =>
            rng.choice([
              "Dilithium",
              "Duranium",
              "Tritanium",
              "Water",
              "Biomatter",
              "Rare Crystals",
              "Metals",
            ]),
          ),
          moons: [],
          rings: rng.next() < 0.3,
          day_length_hours: rng.nextFloat(1, 100),
          year_length_days: rng.nextInt(50, 2000),
          coordinates: {
            x: rng.nextFloat(0.1, 50), // AU from star
            y: rng.nextFloat(-5, 5),
            z: rng.nextFloat(-1, 1),
          },
          seedValue: rng.nextInt(1, 1000000),
        };

        // Generate biomes for habitable planets
        if (isHabitable) {
          const biomeCount = rng.nextInt(1, 5);
          let remainingCoverage = 100;

          for (let b = 0; b < biomeCount; b++) {
            const template = rng.choice(biomeTemplates);
            const coverage =
              b === biomeCount - 1
                ? remainingCoverage
                : rng.nextInt(5, Math.min(50, remainingCoverage));
            remainingCoverage -= coverage;

            const biome: BiomeType = {
              id: `${planet.id}_biome_${b}`,
              name: template.name,
              coverage_percentage: coverage,
              dominant_features: Array.from({ length: rng.nextInt(2, 5) }, () =>
                rng.choice([
                  "Mountains",
                  "Rivers",
                  "Forests",
                  "Plains",
                  "Caves",
                  "Crystals",
                ]),
              ),
              climate: template.climate,
              flora: Array.from({ length: rng.nextInt(1, 4) }, () =>
                rng.choice([
                  "Trees",
                  "Grass",
                  "Flowers",
                  "Moss",
                  "Fungi",
                  "Coral",
                ]),
              ),
              fauna: Array.from({ length: rng.nextInt(1, 4) }, () =>
                rng.choice([
                  "Mammals",
                  "Birds",
                  "Fish",
                  "Insects",
                  "Reptiles",
                  "Amphibians",
                ]),
              ),
              resources: Array.from({ length: rng.nextInt(1, 4) }, () =>
                rng.choice([
                  "Water",
                  "Minerals",
                  "Timber",
                  "Food",
                  "Medicine",
                  "Energy",
                ]),
              ),
              habitability: template.habitability + rng.nextInt(-20, 20),
            };
            planet.biomes.push(biome);

            if (remainingCoverage <= 0) break;
          }
        }

        planets.push(planet);
      }
    });

    return planets;
  };

  const generateMoons = (rng: SeededRandom, planets: Planet[]): Moon[] => {
    const allMoons: Moon[] = [];

    planets.forEach((planet) => {
      const moonChance = universeSettings.moon_generation_rate / 10;
      if (rng.next() < moonChance) {
        const moonCount = Math.min(
          rng.nextInt(1, Math.max(1, Math.floor(planet.size * 3))),
          universeSettings.max_moons_per_planet,
        );

        for (let i = 0; i < moonCount; i++) {
          const moon: Moon = {
            id: `${planet.id}_moon_${i}`,
            planetId: planet.id,
            name: `${rng.choice(moonNames)} ${i + 1}`,
            type: rng.choice([
              "Rocky",
              "Ice",
              "Volcanic",
              "Metallic",
              "Captured Asteroid",
              "Artificial",
            ]),
            size: rng.nextFloat(0.1, 0.8), // relative to planet
            gravity: rng.nextFloat(0.05, 0.5),
            atmosphere: rng.choice([
              "None",
              "Thin",
              "Dense",
              "Toxic",
              "Oxygen",
            ]),
            temperature_c: planet.temperature_c + rng.nextInt(-100, 50),
            orbital_period_days: rng.nextFloat(1, 100),
            tidally_locked: rng.next() < 0.7,
            resources: Array.from({ length: rng.nextInt(0, 5) }, () =>
              rng.choice([
                "Ice",
                "Minerals",
                "Metals",
                "Rare Elements",
                "Helium-3",
                "Deuterium",
              ]),
            ),
            inhabited: planet.civilization_level > 0 && rng.next() < 0.3,
            facilities: [],
            surface_features: Array.from({ length: rng.nextInt(1, 4) }, () =>
              rng.choice([
                "Craters",
                "Volcanic Vents",
                "Ice Caps",
                "Canyons",
                "Lava Tubes",
                "Mining Operations",
              ]),
            ),
          };

          if (moon.inhabited) {
            moon.facilities = Array.from({ length: rng.nextInt(1, 3) }, () =>
              rng.choice([
                "Mining Station",
                "Research Facility",
                "Military Base",
                "Colony",
                "Observatory",
              ]),
            );
          }

          allMoons.push(moon);
          planet.moons.push(moon);
        }
      }
    });

    return allMoons;
  };

  const populateLifeAndCivilizations = (
    rng: SeededRandom,
    planets: Planet[],
    moons: Moon[],
  ) => {
    // This function would enhance planets and moons with more detailed life and civilization data
    // For now, it's already handled in the generation phases above
  };

  const saveSeed = () => {
    if (currentSeed) {
      setSavedSeeds((prev) => {
        const updated = [
          currentSeed,
          ...prev.filter((s) => s.value !== currentSeed.value),
        ];
        return updated.slice(0, 10); // Keep only 10 most recent
      });
    }
  };

  const loadSeed = (seed: UniverseSeed) => {
    setUniverseSettings(seed.parameters);
    generateUniverse(seed.value);
  };

  const exportSeed = () => {
    if (currentSeed) {
      const dataStr = JSON.stringify(currentSeed, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `universe_seed_${currentSeed.value}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const importSeed = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const seedData = JSON.parse(e.target?.result as string);
          loadSeed(seedData);
        } catch (error) {
          console.error("Failed to import seed:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const getStatusColor = (status: "pending" | "active" | "complete") => {
    switch (status) {
      case "complete":
        return "text-green-400";
      case "active":
        return "text-trek-blue";
      case "pending":
        return "text-trek-text/40";
    }
  };

  const getGalaxyTypeColor = (type: string) => {
    switch (type) {
      case "Spiral":
        return "text-blue-400 border-blue-400 bg-blue-400/20";
      case "Elliptical":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Irregular":
        return "text-purple-400 border-purple-400 bg-purple-400/20";
      case "Dwarf":
        return "text-green-400 border-green-400 bg-green-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  const getStarTypeColor = (type: string) => {
    switch (type) {
      case "G-type":
        return "text-yellow-400";
      case "K-type":
        return "text-orange-400";
      case "M-type":
        return "text-red-400";
      case "F-type":
        return "text-yellow-300";
      case "A-type":
        return "text-white";
      case "B-type":
        return "text-blue-300";
      case "O-type":
        return "text-blue-500";
      case "Binary":
        return "text-purple-400";
      case "Neutron":
        return "text-cyan-400";
      case "Pulsar":
        return "text-pink-400";
      default:
        return "text-trek-blue";
    }
  };

  const getClimateIcon = (climate: string) => {
    switch (climate) {
      case "Arctic":
        return <Snowflake className="w-4 h-4" />;
      case "Temperate":
        return <Sun className="w-4 h-4" />;
      case "Tropical":
        return <Sun className="w-4 h-4" />;
      case "Desert":
        return <Thermometer className="w-4 h-4" />;
      case "Volcanic":
        return <Mountain className="w-4 h-4" />;
      case "Underwater":
        return <Waves className="w-4 h-4" />;
      case "Aerial":
        return <Wind className="w-4 h-4" />;
      case "Underground":
        return <Globe className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getMoonTypeIcon = (type: string) => {
    switch (type) {
      case "Rocky":
        return <Mountain className="w-4 h-4" />;
      case "Ice":
        return <Snowflake className="w-4 h-4" />;
      case "Volcanic":
        return <Zap className="w-4 h-4" />;
      case "Metallic":
        return <Settings className="w-4 h-4" />;
      case "Captured Asteroid":
        return <Star className="w-4 h-4" />;
      case "Artificial":
        return <Atom className="w-4 h-4" />;
      default:
        return <Moon className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          UNIVERSE GENERATION MATRIX
        </h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "generator" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "generator"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("generator")}
          >
            <Atom className="w-4 h-4 mr-2" />
            Generator
          </Button>
          <Button
            variant={activeTab === "galaxies" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "galaxies"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("galaxies")}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Galaxies
          </Button>
          <Button
            variant={activeTab === "systems" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "systems"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("systems")}
          >
            <Star className="w-4 h-4 mr-2" />
            Systems
          </Button>
          <Button
            variant={activeTab === "planets" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "planets"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("planets")}
          >
            <Globe className="w-4 h-4 mr-2" />
            Planets
          </Button>
          <Button
            variant={activeTab === "moons" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "moons"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("moons")}
          >
            <Moon className="w-4 h-4 mr-2" />
            Moons
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value: any) => setActiveTab(value)}
      >
        <TabsContent value="generator" className="space-y-6">
          {/* Seed Management */}
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-gold flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Universe Seed Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter custom seed (leave empty for random)"
                  value={customSeed}
                  onChange={(e) => setCustomSeed(e.target.value)}
                  className="flex-1 bg-trek-bg border-trek-accent text-trek-text"
                />
                <Button
                  onClick={() => setCustomSeed(generateRandomSeed())}
                  className="bg-trek-accent hover:bg-trek-accent/80 text-black"
                >
                  <Dice1 className="w-4 h-4" />
                </Button>
              </div>

              {currentSeed && (
                <div className="bg-trek-bg p-4 rounded border border-trek-accent/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-trek-gold font-semibold">
                      Current Universe Seed
                    </span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={saveSeed}
                        className="bg-trek-accent hover:bg-trek-accent/80 text-black"
                      >
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={exportSeed}
                        variant="outline"
                        className="border-trek-accent text-trek-text"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-trek-text/80 font-mono">
                    {currentSeed.value}
                  </div>
                  <div className="grid grid-cols-6 gap-2 mt-2 text-xs">
                    <div>
                      <span className="text-trek-text/60">Galaxies:</span>{" "}
                      <span className="text-trek-blue">
                        {currentSeed.stats.galaxies}
                      </span>
                    </div>
                    <div>
                      <span className="text-trek-text/60">Systems:</span>{" "}
                      <span className="text-trek-blue">
                        {currentSeed.stats.systems}
                      </span>
                    </div>
                    <div>
                      <span className="text-trek-text/60">Planets:</span>{" "}
                      <span className="text-trek-blue">
                        {currentSeed.stats.planets}
                      </span>
                    </div>
                    <div>
                      <span className="text-trek-text/60">Moons:</span>{" "}
                      <span className="text-trek-blue">
                        {currentSeed.stats.moons}
                      </span>
                    </div>
                    <div>
                      <span className="text-trek-text/60">Habitable:</span>{" "}
                      <span className="text-green-400">
                        {currentSeed.stats.habitablePlanets}
                      </span>
                    </div>
                    <div>
                      <span className="text-trek-text/60">Civilized:</span>{" "}
                      <span className="text-trek-gold">
                        {currentSeed.stats.civilizations}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="file"
                  accept=".json"
                  onChange={importSeed}
                  className="hidden"
                  id="import-seed"
                />
                <label htmlFor="import-seed">
                  <Button
                    asChild
                    variant="outline"
                    className="border-trek-accent text-trek-text"
                  >
                    <span className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Seed
                    </span>
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Generation Parameters */}
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-gold">
                Universe Generation Parameters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="text-sm text-trek-text/70 mb-2 block">
                    Galaxy Density
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={universeSettings.galaxy_density}
                      onChange={(e) =>
                        setUniverseSettings((prev) => ({
                          ...prev,
                          galaxy_density: parseInt(e.target.value),
                        }))
                      }
                      className="flex-1"
                    />
                    <span className="text-trek-blue font-semibold w-8">
                      {universeSettings.galaxy_density}
                    </span>
                  </div>
                  <div className="text-xs text-trek-text/70">
                    Controls number of galaxies generated
                  </div>
                </div>

                <div>
                  <label className="text-sm text-trek-text/70 mb-2 block">
                    Star Formation Rate
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={universeSettings.star_formation_rate}
                      onChange={(e) =>
                        setUniverseSettings((prev) => ({
                          ...prev,
                          star_formation_rate: parseInt(e.target.value),
                        }))
                      }
                      className="flex-1"
                    />
                    <span className="text-trek-blue font-semibold w-8">
                      {universeSettings.star_formation_rate}
                    </span>
                  </div>
                  <div className="text-xs text-trek-text/70">
                    Affects density of star systems
                  </div>
                </div>

                <div>
                  <label className="text-sm text-trek-text/70 mb-2 block">
                    Life Probability
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={universeSettings.life_probability}
                      onChange={(e) =>
                        setUniverseSettings((prev) => ({
                          ...prev,
                          life_probability: parseInt(e.target.value),
                        }))
                      }
                      className="flex-1"
                    />
                    <span className="text-trek-blue font-semibold w-8">
                      {universeSettings.life_probability}
                    </span>
                  </div>
                  <div className="text-xs text-trek-text/70">
                    Chance of life on suitable planets
                  </div>
                </div>

                <div>
                  <label className="text-sm text-trek-text/70 mb-2 block">
                    Civilization Probability
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={universeSettings.civilization_probability}
                      onChange={(e) =>
                        setUniverseSettings((prev) => ({
                          ...prev,
                          civilization_probability: parseInt(e.target.value),
                        }))
                      }
                      className="flex-1"
                    />
                    <span className="text-trek-blue font-semibold w-8">
                      {universeSettings.civilization_probability}
                    </span>
                  </div>
                  <div className="text-xs text-trek-text/70">
                    Likelihood of intelligent species
                  </div>
                </div>

                <div>
                  <label className="text-sm text-trek-text/70 mb-2 block">
                    Resource Abundance
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={universeSettings.resource_abundance}
                      onChange={(e) =>
                        setUniverseSettings((prev) => ({
                          ...prev,
                          resource_abundance: parseInt(e.target.value),
                        }))
                      }
                      className="flex-1"
                    />
                    <span className="text-trek-blue font-semibold w-8">
                      {universeSettings.resource_abundance}
                    </span>
                  </div>
                  <div className="text-xs text-trek-text/70">
                    Availability of strategic resources
                  </div>
                </div>

                <div>
                  <label className="text-sm text-trek-text/70 mb-2 block">
                    Anomaly Frequency
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={universeSettings.anomaly_frequency}
                      onChange={(e) =>
                        setUniverseSettings((prev) => ({
                          ...prev,
                          anomaly_frequency: parseInt(e.target.value),
                        }))
                      }
                      className="flex-1"
                    />
                    <span className="text-trek-blue font-semibold w-8">
                      {universeSettings.anomaly_frequency}
                    </span>
                  </div>
                  <div className="text-xs text-trek-text/70">
                    Rate of spatial anomalies and phenomena
                  </div>
                </div>

                <div>
                  <label className="text-sm text-trek-text/70 mb-2 block">
                    Moon Generation Rate
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={universeSettings.moon_generation_rate}
                      onChange={(e) =>
                        setUniverseSettings((prev) => ({
                          ...prev,
                          moon_generation_rate: parseInt(e.target.value),
                        }))
                      }
                      className="flex-1"
                    />
                    <span className="text-trek-blue font-semibold w-8">
                      {universeSettings.moon_generation_rate}
                    </span>
                  </div>
                  <div className="text-xs text-trek-text/70">
                    Likelihood of moon formation
                  </div>
                </div>

                <div>
                  <label className="text-sm text-trek-text/70 mb-2 block">
                    Max Moons per Planet
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={universeSettings.max_moons_per_planet}
                      onChange={(e) =>
                        setUniverseSettings((prev) => ({
                          ...prev,
                          max_moons_per_planet: parseInt(e.target.value),
                        }))
                      }
                      className="flex-1"
                    />
                    <span className="text-trek-blue font-semibold w-8">
                      {universeSettings.max_moons_per_planet}
                    </span>
                  </div>
                  <div className="text-xs text-trek-text/70">
                    Maximum moons per planet
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-trek-accent">
                <div className="flex gap-4">
                  <Button
                    className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                    onClick={() => generateUniverse(customSeed || undefined)}
                    disabled={isGenerating}
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`}
                    />
                    Generate Universe
                  </Button>
                  <Button
                    variant="outline"
                    className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Changes
                  </Button>
                  <Button
                    variant="outline"
                    className="border-trek-accent text-trek-text hover:bg-trek-accent"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Advanced Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generation Progress */}
          {isGenerating && (
            <Card className="bg-trek-panel border-trek-blue">
              <CardHeader>
                <CardTitle className="text-trek-gold">
                  Generating Universe...
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {generationPhases.map((phase, index) => (
                  <div key={phase.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold ${getStatusColor(phase.status)}`}
                        >
                          {phase.name}
                        </span>
                        {phase.status === "active" && (
                          <RefreshCw className="w-4 h-4 animate-spin text-trek-blue" />
                        )}
                        {phase.status === "complete" && (
                          <span className="text-green-400">✓</span>
                        )}
                      </div>
                      <span className="text-trek-blue text-sm">
                        {Math.round(phase.progress)}%
                      </span>
                    </div>
                    <Progress value={phase.progress} className="h-2" />
                    <div className="text-xs text-trek-text/60">
                      {phase.details}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Saved Seeds */}
          {savedSeeds.length > 0 && (
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold">
                  Saved Universe Seeds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {savedSeeds.map((seed, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-trek-bg/50 rounded border border-trek-accent/30"
                    >
                      <div>
                        <div className="font-mono text-sm text-trek-text">
                          {seed.value}
                        </div>
                        <div className="text-xs text-trek-text/60">
                          {new Date(seed.timestamp).toLocaleDateString()} |
                          {seed.stats.galaxies}G {seed.stats.systems}S{" "}
                          {seed.stats.planets}P {seed.stats.moons}M
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => loadSeed(seed)}
                        className="bg-trek-accent hover:bg-trek-accent/80 text-black"
                      >
                        Load
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generation Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="bg-trek-panel border-trek-accent p-4 text-center">
              <Sparkles className="w-8 h-8 text-trek-blue mx-auto mb-2" />
              <div className="text-2xl font-bold text-trek-blue">
                {galaxies.length}
              </div>
              <div className="text-sm text-trek-text/70">Galaxies</div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-4 text-center">
              <Star className="w-8 h-8 text-trek-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-trek-gold">
                {starSystems.length}
              </div>
              <div className="text-sm text-trek-text/70">Star Systems</div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-4 text-center">
              <Globe className="w-8 h-8 text-trek-blue mx-auto mb-2" />
              <div className="text-2xl font-bold text-trek-blue">
                {planets.length}
              </div>
              <div className="text-sm text-trek-text/70">Planets</div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-4 text-center">
              <Moon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">
                {moons.length}
              </div>
              <div className="text-sm text-trek-text/70">Moons</div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-4 text-center">
              <Mountain className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">
                {planets.filter((p) => p.class === "M").length}
              </div>
              <div className="text-sm text-trek-text/70">Class M Worlds</div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="galaxies" className="space-y-4">
          {galaxies.map((galaxy) => (
            <Card
              key={galaxy.id}
              className="bg-trek-panel border-trek-accent p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-trek-gold" />
                  <div>
                    <h3 className="font-bold text-trek-gold text-lg">
                      {galaxy.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getGalaxyTypeColor(galaxy.type)}`}
                      >
                        {galaxy.type}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-xs border-trek-accent text-trek-text"
                      >
                        {galaxy.size}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-xs border-trek-blue text-trek-blue"
                      >
                        Seed: {galaxy.seedValue}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-trek-text/70">Threat Level</div>
                  <div
                    className={`font-semibold ${galaxy.threat_level > 7 ? "text-red-400" : galaxy.threat_level > 4 ? "text-yellow-400" : "text-green-400"}`}
                  >
                    {galaxy.threat_level}/10
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <div className="text-trek-text/70 text-sm">Age</div>
                  <div className="text-trek-blue font-semibold">
                    {galaxy.age_billion_years.toFixed(1)}B yrs
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm">Star Count</div>
                  <div className="text-trek-blue font-semibold">
                    {galaxy.star_count_billions}B
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm">
                    Inhabited Systems
                  </div>
                  <div className="text-trek-gold font-semibold">
                    {galaxy.inhabited_systems.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm">Exploration</div>
                  <div className="text-trek-blue font-semibold">
                    {galaxy.exploration_status}%
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm">Coordinates</div>
                  <div className="text-trek-accent text-xs font-mono">
                    {galaxy.coordinates.x.toFixed(0)},{" "}
                    {galaxy.coordinates.y.toFixed(0)},{" "}
                    {galaxy.coordinates.z.toFixed(0)}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Dominant Species
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {galaxy.dominant_species.map((species, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs border-trek-blue text-trek-blue"
                      >
                        {species}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Notable Phenomena
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {galaxy.phenomena.map((phenomenon, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs border-trek-warning text-trek-warning"
                      >
                        {phenomenon}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-trek-accent/30">
                <Button
                  size="sm"
                  onClick={() => setSelectedGalaxy(galaxy)}
                  className="bg-trek-accent hover:bg-trek-accent/80 text-black"
                >
                  <Navigation className="w-3 h-3 mr-2" />
                  Explore Systems
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="systems" className="space-y-4">
          {starSystems.map((system) => (
            <Card
              key={system.id}
              className="bg-trek-panel border-trek-accent p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Star
                    className={`w-6 h-6 ${getStarTypeColor(system.star_type)}`}
                  />
                  <div>
                    <h3 className="font-bold text-trek-gold text-lg">
                      {system.name}
                    </h3>
                    <p className="text-sm text-trek-blue">
                      {system.star_type} Star System
                    </p>
                    <p className="text-xs text-trek-text/70">
                      Controlled by: {system.controlling_faction}
                    </p>
                    <Badge
                      variant="secondary"
                      className="text-xs border-trek-blue text-trek-blue mt-1"
                    >
                      Seed: {system.seedValue}
                    </Badge>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-trek-text/70">
                    Strategic Value
                  </div>
                  <div className="text-trek-gold font-semibold">
                    {system.strategic_value}/10
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <div className="text-trek-text/70 text-sm">Planets</div>
                  <div className="text-trek-blue font-semibold">
                    {system.planets}
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm">
                    Habitable Zone
                  </div>
                  <div className="text-green-400 font-semibold">
                    {system.habitable_zone_planets}
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm">
                    Asteroid Belts
                  </div>
                  <div className="text-trek-blue font-semibold">
                    {system.asteroid_belts}
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm">Colonized</div>
                  <div
                    className={`font-semibold ${system.colonized ? "text-green-400" : "text-red-400"}`}
                  >
                    {system.colonized ? "Yes" : "No"}
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm">Coordinates</div>
                  <div className="text-trek-accent text-xs font-mono">
                    {system.coordinates.x.toFixed(0)},{" "}
                    {system.coordinates.y.toFixed(0)},{" "}
                    {system.coordinates.z.toFixed(0)}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Available Resources
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {system.resources.map((resource, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs border-trek-blue text-trek-blue"
                      >
                        {resource}
                      </Badge>
                    ))}
                  </div>
                </div>

                {system.phenomena.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-trek-gold mb-2">
                      System Phenomena
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {system.phenomena.map((phenomenon, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs border-trek-warning text-trek-warning"
                        >
                          {phenomenon}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-trek-accent/30">
                <Button
                  size="sm"
                  onClick={() => setSelectedSystem(system)}
                  className="bg-trek-accent hover:bg-trek-accent/80 text-black"
                >
                  <Globe className="w-3 h-3 mr-2" />
                  Explore Planets
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="planets" className="space-y-4">
          {planets.map((planet) => (
            <Card
              key={planet.id}
              className="bg-trek-panel border-trek-accent p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-trek-gold" />
                  <div>
                    <h3 className="font-bold text-trek-gold text-lg">
                      {planet.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className="text-xs border-trek-blue text-trek-blue"
                      >
                        Class {planet.class}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-xs border-trek-accent text-trek-text"
                      >
                        {planet.type}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-xs border-trek-blue text-trek-blue"
                      >
                        Seed: {planet.seedValue}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-trek-text/70">Population</div>
                  <div className="text-trek-blue font-semibold">
                    {planet.population.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                <div>
                  <div className="text-trek-text/70 text-sm">Size</div>
                  <div className="text-trek-blue font-semibold">
                    {planet.size.toFixed(1)}x
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm">Gravity</div>
                  <div className="text-trek-blue font-semibold">
                    {planet.gravity.toFixed(1)}g
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm">Temperature</div>
                  <div className="text-trek-blue font-semibold">
                    {planet.temperature_c}°C
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm">Day Length</div>
                  <div className="text-trek-blue font-semibold">
                    {planet.day_length_hours.toFixed(1)}h
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm">Moons</div>
                  <div className="text-purple-400 font-semibold">
                    {planet.moons.length}
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm">Coordinates</div>
                  <div className="text-trek-accent text-xs font-mono">
                    {planet.coordinates.x.toFixed(1)} AU
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {planet.biomes.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-trek-gold mb-2">
                      Major Biomes
                    </h4>
                    <div className="space-y-2">
                      {planet.biomes.map((biome, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 border border-trek-accent rounded"
                        >
                          <div className="flex items-center gap-2">
                            {getClimateIcon(biome.climate)}
                            <span className="text-trek-gold">{biome.name}</span>
                            <Badge
                              variant="outline"
                              className="text-xs border-trek-accent text-trek-text"
                            >
                              {biome.climate}
                            </Badge>
                          </div>
                          <div className="text-trek-blue text-sm">
                            {biome.coverage_percentage}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Natural Resources
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {planet.resources.map((resource, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs border-trek-blue text-trek-blue"
                      >
                        {resource}
                      </Badge>
                    ))}
                  </div>
                </div>

                {planet.moons.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-trek-gold mb-2">
                      Lunar System
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {planet.moons.map((moon, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs border-purple-400 text-purple-400"
                        >
                          {moon.name} ({moon.type})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-trek-accent/30">
                <Button
                  size="sm"
                  onClick={() => setSelectedPlanet(planet)}
                  className="bg-trek-accent hover:bg-trek-accent/80 text-black"
                  disabled={planet.moons.length === 0}
                >
                  <Moon className="w-3 h-3 mr-2" />
                  {planet.moons.length > 0 ? "Explore Moons" : "No Moons"}
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="moons" className="space-y-4">
          {moons.map((moon) => {
            const parentPlanet = planets.find((p) => p.id === moon.planetId);
            return (
              <Card
                key={moon.id}
                className="bg-trek-panel border-trek-accent p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getMoonTypeIcon(moon.type)}
                    <div>
                      <h3 className="font-bold text-trek-gold text-lg">
                        {moon.name}
                      </h3>
                      <p className="text-sm text-purple-400">
                        Orbiting {parentPlanet?.name || "Unknown Planet"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className="text-xs border-purple-400 text-purple-400"
                        >
                          {moon.type}
                        </Badge>
                        {moon.inhabited && (
                          <Badge
                            variant="secondary"
                            className="text-xs border-green-400 text-green-400"
                          >
                            Inhabited
                          </Badge>
                        )}
                        {moon.tidally_locked && (
                          <Badge
                            variant="secondary"
                            className="text-xs border-yellow-400 text-yellow-400"
                          >
                            Tidally Locked
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-trek-text/70">
                      Orbital Period
                    </div>
                    <div className="text-purple-400 font-semibold">
                      {moon.orbital_period_days.toFixed(1)} days
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Size (rel. to planet)
                    </div>
                    <div className="text-purple-400 font-semibold">
                      {(moon.size * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">Gravity</div>
                    <div className="text-purple-400 font-semibold">
                      {moon.gravity.toFixed(2)}g
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">Atmosphere</div>
                    <div className="text-purple-400 font-semibold">
                      {moon.atmosphere}
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">Temperature</div>
                    <div className="text-purple-400 font-semibold">
                      {moon.temperature_c}°C
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">Facilities</div>
                    <div className="text-purple-400 font-semibold">
                      {moon.facilities.length}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {moon.surface_features.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-trek-gold mb-2">
                        Surface Features
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {moon.surface_features.map((feature, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs border-purple-400 text-purple-400"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {moon.resources.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-trek-gold mb-2">
                        Available Resources
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {moon.resources.map((resource, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs border-trek-blue text-trek-blue"
                          >
                            {resource}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {moon.facilities.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-trek-gold mb-2">
                        Installed Facilities
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {moon.facilities.map((facility, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs border-green-400 text-green-400"
                          >
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {moon.inhabited && (
                  <Alert className="mt-4 border-green-500 bg-green-500/10">
                    <Info className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-400">
                      This moon supports a{" "}
                      {moon.facilities.length > 0
                        ? "permanent settlement"
                        : "small outpost"}{" "}
                      with various facilities and installations.
                    </AlertDescription>
                  </Alert>
                )}
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
