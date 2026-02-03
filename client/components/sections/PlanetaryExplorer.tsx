import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Globe,
  Mountain,
  Waves,
  Zap,
  Users,
  Thermometer,
  Wind,
  Eye,
  Radar,
  Rocket,
  AlertTriangle,
  Leaf,
} from "lucide-react";

interface Planet {
  id: string;
  name: string;
  class: string;
  type:
    | "Terrestrial"
    | "Gas Giant"
    | "Ice World"
    | "Desert"
    | "Ocean"
    | "Volcanic"
    | "Rogue"
    | "Artificial";
  atmosphere: string;
  temperature: number;
  gravity: number;
  population?: string;
  civilization?: string;
  resources: string[];
  phenomena: string[];
  moons: number;
  rings: boolean;
  coordinates: { x: number; y: number; z: number };
  quadrant?: "Alpha" | "Beta" | "Gamma" | "Delta";
  first_contact?: number;
  strategic_importance?: "Low" | "Medium" | "High" | "Critical";
  threat_level?: number;
}

interface Asteroid {
  id: string;
  name: string;
  composition: string;
  size: "Small" | "Medium" | "Large";
  mining_potential: number;
  coordinates: { x: number; y: number; z: number };
}

interface SpacePhenomena {
  id: string;
  name: string;
  type:
    | "Nebula"
    | "Black Hole"
    | "Pulsar"
    | "Anomaly"
    | "Comet"
    | "Asteroid Field";
  description: string;
  threat_level: number;
  scientific_value: number;
  coordinates: { x: number; y: number; z: number };
}

export function PlanetaryExplorer() {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [scanMode, setScanMode] = useState<
    "planets" | "asteroids" | "phenomena"
  >("planets");

  const planets: Planet[] = [
    // Original Federation Core Worlds
    {
      id: "earth",
      name: "Earth",
      class: "M",
      type: "Terrestrial",
      atmosphere: "78% N₂, 21% O₂, 1% other",
      temperature: 15,
      gravity: 1.0,
      population: "9.8 Billion",
      civilization: "United Federation of Planets",
      resources: [
        "Dilithium Deposits",
        "Rare Earth Metals",
        "Water",
        "Biomatter",
      ],
      phenomena: ["Aurora Borealis", "Magnetic Field"],
      moons: 1,
      rings: false,
      coordinates: { x: 0, y: 0, z: 0 },
    },
    {
      id: "vulcan",
      name: "Vulcan (40 Eridani A)",
      class: "M",
      type: "Desert",
      atmosphere: "Oxygen-Nitrogen with trace gases",
      temperature: 45,
      gravity: 1.4,
      population: "6.2 Billion",
      civilization: "Vulcan High Command",
      resources: ["Trilithium", "Duranium", "Vulcan Minerals"],
      phenomena: ["Desert Storms", "Volcanic Activity", "Forge Region"],
      moons: 2,
      rings: false,
      coordinates: { x: 16.5, y: -2.1, z: 3.4 },
    },
    {
      id: "andoria",
      name: "Andoria",
      class: "M",
      type: "Ice World",
      atmosphere: "Thin oxygen-nitrogen mix",
      temperature: -28,
      gravity: 1.3,
      population: "8.9 Billion",
      civilization: "Andorian Empire",
      resources: ["Ice Mining", "Rare Crystals", "Industrial Metals"],
      phenomena: ["Aurora Displays", "Ice Storms", "Underground Caverns"],
      moons: 1,
      rings: false,
      coordinates: { x: 23.7, y: 45.2, z: -12.8 },
    },
    {
      id: "tellar",
      name: "Tellar Prime",
      class: "M",
      type: "Terrestrial",
      atmosphere: "Dense oxygen-nitrogen atmosphere",
      temperature: 22,
      gravity: 1.1,
      population: "12.4 Billion",
      civilization: "Tellarite Republic",
      resources: ["Industrial Materials", "Heavy Metals", "Engineering Alloys"],
      phenomena: ["Industrial Zones", "Underground Cities"],
      moons: 0,
      rings: false,
      coordinates: { x: 61.5, y: 12.1, z: 34.7 },
    },
    // Alpha Quadrant Worlds
    {
      id: "qonos",
      name: "Qo'noS (Kronos)",
      class: "M",
      type: "Terrestrial",
      atmosphere: "Standard oxygen-nitrogen mix",
      temperature: 18,
      gravity: 1.2,
      population: "24.7 Billion",
      civilization: "Klingon Empire",
      resources: ["Duranium", "Warrior Forges", "Bloodwine Grapes"],
      phenomena: ["First City", "Great Hall", "Volcanic Regions"],
      moons: 1,
      rings: false,
      coordinates: { x: 112.3, y: -23.4, z: 67.8 },
    },
    {
      id: "romulus",
      name: "Romulus",
      class: "M",
      type: "Terrestrial",
      atmosphere: "Standard Class-M atmosphere",
      temperature: 20,
      gravity: 1.0,
      population: "18.2 Billion",
      civilization: "Romulan Star Empire",
      resources: [
        "Decalithium",
        "Industrial Replicators",
        "Quantum Singularities",
      ],
      phenomena: ["Capital City", "Romulan Senate", "Volcanic Chains"],
      moons: 2,
      rings: false,
      coordinates: { x: 156.7, y: 78.9, z: -45.2 },
    },
    {
      id: "remus",
      name: "Remus",
      class: "M",
      type: "Terrestrial",
      atmosphere: "Harsh, mining-grade atmosphere",
      temperature: 12,
      gravity: 1.1,
      population: "4.8 Billion",
      civilization: "Reman Underground",
      resources: ["Dilithium Mines", "Heavy Metals", "Thalaron Radiation"],
      phenomena: [
        "Underground Cities",
        "Thalaron Deposits",
        "Perpetual Twilight",
      ],
      moons: 0,
      rings: false,
      coordinates: { x: 157.1, y: 79.2, z: -45.8 },
    },
    {
      id: "cardassia",
      name: "Cardassia Prime",
      class: "M",
      type: "Desert",
      atmosphere: "Hot, dry climate preferred by Cardassians",
      temperature: 42,
      gravity: 1.0,
      population: "4.6 Billion",
      civilization: "Cardassian Union",
      resources: [
        "Orbital Defense Platforms",
        "Military Industries",
        "Cultural Archives",
      ],
      phenomena: ["Central Command", "Military Academies", "Desert Fortresses"],
      moons: 3,
      rings: false,
      coordinates: { x: 234.5, y: -67.3, z: 89.1 },
    },
    {
      id: "bajor",
      name: "Bajor",
      class: "M",
      type: "Terrestrial",
      atmosphere: "Standard Class-M with spiritual energy",
      temperature: 24,
      gravity: 1.0,
      population: "3.2 Billion",
      civilization: "Bajoran Republic",
      resources: [
        "Uridium Ore",
        "Spiritual Artifacts",
        "Agricultural Products",
      ],
      phenomena: ["Celestial Temple", "Fire Caves", "Dahkur Province"],
      moons: 5,
      rings: false,
      coordinates: { x: 245.7, y: -71.2, z: 91.4 },
    },
    {
      id: "ferenginar",
      name: "Ferenginar",
      class: "M",
      type: "Ocean",
      atmosphere: "High humidity, constant precipitation",
      temperature: 32,
      gravity: 0.9,
      population: "15.7 Billion",
      civilization: "Ferengi Alliance",
      resources: ["Latinum Deposits", "Rain Forests", "Commercial Networks"],
      phenomena: ["Constant Rain", "Sacred Marketplace", "Tower of Commerce"],
      moons: 0,
      rings: false,
      coordinates: { x: 189.3, y: 23.7, z: -134.5 },
    },
    {
      id: "risa",
      name: "Risa",
      class: "M",
      type: "Ocean",
      atmosphere: "Tropical, weather controlled",
      temperature: 28,
      gravity: 0.9,
      population: "1.2 Million",
      civilization: "Risian Tourism Authority",
      resources: ["Exotic Matter", "Rare Crystals", "Organic Compounds"],
      phenomena: [
        "Weather Control Grid",
        "Tropical Storms",
        "Jamaharon Rituals",
      ],
      moons: 3,
      rings: false,
      coordinates: { x: 47.2, y: 12.8, z: -8.1 },
    },
    // Beta Quadrant Worlds
    {
      id: "trill",
      name: "Trill",
      class: "M",
      type: "Terrestrial",
      atmosphere: "Standard Class-M with symbiont pools",
      temperature: 21,
      gravity: 1.0,
      population: "650 Million",
      civilization: "Trill Symbiosis Commission",
      resources: ["Symbiont Pools", "Cultural Archives", "Medical Technology"],
      phenomena: [
        "Caves of Mak'ala",
        "Symbiont Breeding Pools",
        "Zhian'tara Rituals",
      ],
      moons: 2,
      rings: false,
      coordinates: { x: 78.4, y: 156.7, z: 23.9 },
    },
    {
      id: "betazed",
      name: "Betazed",
      class: "M",
      type: "Terrestrial",
      atmosphere: "Standard Class-M with psionic resonance",
      temperature: 25,
      gravity: 0.98,
      population: "5.7 Billion",
      civilization: "Betazoid Government",
      resources: [
        "Psionic Crystals",
        "Therapeutic Gardens",
        "Mental Health Facilities",
      ],
      phenomena: [
        "Sacred Chalice",
        "Telepathic Gardens",
        "Fourth House Estates",
      ],
      moons: 1,
      rings: false,
      coordinates: { x: 198.2, y: 67.8, z: -89.3 },
    },
    // Delta Quadrant Worlds (from Voyager)
    {
      id: "ocampa",
      name: "Ocampa",
      class: "M",
      type: "Desert",
      atmosphere: "Arid, damaged by Caretaker technology",
      temperature: 38,
      gravity: 1.0,
      population: "500,000",
      civilization: "Ocampan Underground City",
      resources: [
        "Energy Sources",
        "Underground Water",
        "Caretaker Technology",
      ],
      phenomena: [
        "Array Technology",
        "Underground Cities",
        "Psychokinetic Fields",
      ],
      moons: 1,
      rings: false,
      coordinates: { x: 70000, y: 0, z: 0 },
    },
    {
      id: "kazon_ogla",
      name: "Kazon-Ogla Homeworld",
      class: "M",
      type: "Desert",
      atmosphere: "Harsh desert environment",
      temperature: 45,
      gravity: 1.1,
      population: "2.3 Million",
      civilization: "Kazon-Ogla Sect",
      resources: [
        "Water Reclamation",
        "Desert Minerals",
        "Warrior Training Grounds",
      ],
      phenomena: ["Sectarian Conflicts", "Resource Wars", "Desert Strongholds"],
      moons: 0,
      rings: false,
      coordinates: { x: 71234, y: 1567, z: -2341 },
    },
    {
      id: "talax",
      name: "Talax",
      class: "M",
      type: "Terrestrial",
      atmosphere: "Standard Class-M atmosphere",
      temperature: 19,
      gravity: 0.95,
      population: "4.2 Billion",
      civilization: "Talaxian Government",
      resources: ["Leola Root", "Culinary Exports", "Trading Networks"],
      phenomena: [
        "Metreon Cascade Aftermath",
        "Memorial Sites",
        "Cultural Centers",
      ],
      moons: 2,
      rings: false,
      coordinates: { x: 72456, y: 2134, z: -1789 },
    },
    // Gamma Quadrant Worlds
    {
      id: "founders_homeworld",
      name: "Founder's Homeworld",
      class: "M",
      type: "Ocean",
      atmosphere: "Standard with changeling-specific requirements",
      temperature: 26,
      gravity: 1.0,
      population: "Unknown",
      civilization: "Dominion Founders",
      resources: [
        "Great Link",
        "Morphogenic Virus Research",
        "Dominion Command",
      ],
      phenomena: [
        "Great Link Ocean",
        "Shapeshifter Regeneration",
        "Founder's Council",
      ],
      moons: 0,
      rings: false,
      coordinates: { x: -80000, y: 15000, z: 25000 },
    },
    {
      id: "karemma",
      name: "Karemma",
      class: "M",
      type: "Terrestrial",
      atmosphere: "Standard Class-M atmosphere",
      temperature: 23,
      gravity: 1.0,
      population: "890 Million",
      civilization: "Karemma Commerce Ministry",
      resources: [
        "Industrial Manufacturing",
        "Trade Networks",
        "Dominion Tributes",
      ],
      phenomena: [
        "Commercial Districts",
        "Manufacturing Centers",
        "Trade Negotiations",
      ],
      moons: 1,
      rings: false,
      coordinates: { x: -78234, y: 12567, z: 23145 },
    },
    // TOS Era Worlds
    {
      id: "altair_six",
      name: "Altair VI",
      class: "M",
      type: "Terrestrial",
      atmosphere: "Standard Class-M atmosphere",
      temperature: 22,
      gravity: 1.0,
      population: "125 Million",
      civilization: "Altairian Republic",
      resources: [
        "Diplomatic Facilities",
        "Medical Research",
        "Cultural Exchange",
      ],
      phenomena: [
        "Inauguration Ceremonies",
        "Diplomatic Conferences",
        "Medical Centers",
      ],
      moons: 1,
      rings: false,
      coordinates: { x: 234.7, y: 67.8, z: 145.2 },
    },
    {
      id: "genesis",
      name: "Genesis Planet",
      class: "M",
      type: "Terrestrial",
      atmosphere: "Unstable, Genesis Device affected",
      temperature: 25,
      gravity: 1.0,
      population: "0",
      civilization: "Destroyed",
      resources: ["Genesis Matrix", "Protomatter Deposits", "Rapid Evolution"],
      phenomena: [
        "Accelerated Aging",
        "Protomatter Instability",
        "Genesis Effect",
      ],
      moons: 0,
      rings: false,
      coordinates: { x: 567.8, y: -234.5, z: 789.1 },
    },
    {
      id: "neural",
      name: "Neural",
      class: "M",
      type: "Terrestrial",
      atmosphere: "Standard Class-M atmosphere",
      temperature: 20,
      gravity: 1.0,
      population: "100 Million",
      civilization: "Hill People vs. Village People",
      resources: [
        "Primitive Weapons",
        "Natural Resources",
        "Cultural Conflicts",
      ],
      phenomena: [
        "Factional Warfare",
        "Klingon Interference",
        "Prime Directive Violations",
      ],
      moons: 1,
      rings: false,
      coordinates: { x: 345.6, y: 123.4, z: -567.8 },
    },
    // Discovery Era Worlds
    {
      id: "terralysium",
      name: "Terralysium",
      class: "M",
      type: "Terrestrial",
      atmosphere: "Standard Class-M atmosphere",
      temperature: 21,
      gravity: 1.0,
      population: "11,000",
      civilization: "New Eden Colony",
      resources: [
        "Agricultural Products",
        "Simple Technology",
        "Religious Artifacts",
      ],
      phenomena: [
        "Red Angel Signals",
        "Religious Communities",
        "Primitive Technology",
      ],
      moons: 1,
      rings: false,
      coordinates: { x: 890.1, y: 234.5, z: -123.4 },
    },
    {
      id: "kaminar",
      name: "Kaminar",
      class: "M",
      type: "Terrestrial",
      atmosphere: "Standard Class-M atmosphere",
      temperature: 19,
      gravity: 1.05,
      population: "200 Million",
      civilization: "Kelpien/Ba'ul Societies",
      resources: [
        "Sensing Technology",
        "Agricultural Systems",
        "Predator/Prey Balance",
      ],
      phenomena: ["The Vahar'ai", "Ba'ul Technology", "Great Balance"],
      moons: 2,
      rings: false,
      coordinates: { x: 456.7, y: 789.0, z: 123.4 },
    },
    // Strange New Worlds Era
    {
      id: "kiley_279",
      name: "Kiley 279",
      class: "M",
      type: "Terrestrial",
      atmosphere: "Standard Class-M atmosphere",
      temperature: 24,
      gravity: 1.0,
      population: "50 Million",
      civilization: "Various Refugee Species",
      resources: [
        "Multi-species Technology",
        "Refugee Support Systems",
        "Cultural Diversity",
      ],
      phenomena: [
        "Species Integration",
        "Technological Adaptation",
        "Cultural Exchange",
      ],
      moons: 1,
      rings: false,
      coordinates: { x: 678.9, y: 345.6, z: -234.5 },
    },
    // Gas Giants and Special Worlds
    {
      id: "jupiter_sol",
      name: "Jupiter (Sol System)",
      class: "J",
      type: "Gas Giant",
      atmosphere: "Hydrogen/Helium with ammonia clouds",
      temperature: -145,
      gravity: 2.36,
      resources: ["Helium-3", "Deuterium", "Gas Mining Operations"],
      phenomena: ["Great Red Spot", "Io Volcanic Activity", "Europa Ocean"],
      moons: 79,
      rings: true,
      coordinates: { x: 5.2, y: 0, z: 0 },
    },
    {
      id: "saturn_sol",
      name: "Saturn (Sol System)",
      class: "J",
      type: "Gas Giant",
      atmosphere: "Hydrogen/Helium with complex hydrocarbons",
      temperature: -178,
      gravity: 0.916,
      resources: ["Helium-3", "Complex Hydrocarbons", "Ring Materials"],
      phenomena: [
        "Magnificent Ring System",
        "Titan Atmosphere",
        "Hexagonal Storm",
      ],
      moons: 83,
      rings: true,
      coordinates: { x: 9.5, y: 0, z: 0 },
    },
    {
      id: "nibiru",
      name: "Nibiru",
      class: "M",
      type: "Volcanic",
      atmosphere: "Volcanic ash and standard gases",
      temperature: 35,
      gravity: 1.1,
      population: "1.7 Million",
      civilization: "Nibirian Primitives",
      resources: [
        "Volcanic Minerals",
        "Geothermal Energy",
        "Rare Earth Elements",
      ],
      phenomena: [
        "Supervolcano Activity",
        "Cold Fusion Device",
        "Primitive Civilization",
      ],
      moons: 1,
      rings: false,
      coordinates: { x: 789.0, y: 456.7, z: 234.5 },
    },
  ];

  const asteroids: Asteroid[] = [
    {
      id: "ast1",
      name: "Ceres Station",
      composition: "Carbonaceous with ice and dilithium traces",
      size: "Large",
      mining_potential: 85,
      coordinates: { x: 2.8, y: 0.1, z: 0.3 },
    },
    {
      id: "ast2",
      name: "Vesta Mining Complex",
      composition: "Metallic ore, dilithium deposits",
      size: "Medium",
      mining_potential: 92,
      coordinates: { x: 2.4, y: -0.2, z: 0.1 },
    },
    {
      id: "ast3",
      name: "Pallas Field",
      composition: "Rare earth elements, tritanium",
      size: "Medium",
      mining_potential: 67,
      coordinates: { x: 2.9, y: 0.4, z: -0.1 },
    },
    {
      id: "ast4",
      name: "Regula I Station",
      composition: "Hollowed asteroid with research facilities",
      size: "Large",
      mining_potential: 15,
      coordinates: { x: 234.7, y: 67.8, z: -123.4 },
    },
    {
      id: "ast5",
      name: "Rura Penthe Asteroid",
      composition: "Dilithium-rich prison asteroid",
      size: "Large",
      mining_potential: 95,
      coordinates: { x: 456.7, y: -234.5, z: 789.0 },
    },
    {
      id: "ast6",
      name: "Deep Space K-7 Zone",
      composition: "Mixed metals with research potential",
      size: "Medium",
      mining_potential: 73,
      coordinates: { x: 345.6, y: 123.4, z: -456.7 },
    },
    {
      id: "ast7",
      name: "Empok Nor Vicinity",
      composition: "Cardassian mineral deposits",
      size: "Small",
      mining_potential: 56,
      coordinates: { x: 567.8, y: -345.6, z: 123.4 },
    },
  ];

  const phenomena: SpacePhenomena[] = [
    // Classic TOS/TNG Phenomena
    {
      id: "nebula1",
      name: "Mutara Nebula",
      type: "Nebula",
      description:
        "Dense nebula with electromagnetic interference. Contains proto-matter. Site of Genesis Project testing.",
      threat_level: 7,
      scientific_value: 9,
      coordinates: { x: 45.2, y: 12.1, z: -23.4 },
    },
    {
      id: "nebula2",
      name: "Briar Patch",
      type: "Nebula",
      description:
        "Metaphasic radiation field with regenerative properties. Contains dangerous energy discharges.",
      threat_level: 5,
      scientific_value: 10,
      coordinates: { x: 234.5, y: -67.8, z: 145.2 },
    },
    {
      id: "nebula3",
      name: "Badlands Plasma Storms",
      type: "Nebula",
      description:
        "Violent plasma storms create hiding places for smugglers and rebels. Navigation extremely hazardous.",
      threat_level: 8,
      scientific_value: 6,
      coordinates: { x: 189.3, y: 45.6, z: -123.4 },
    },
    {
      id: "nebula4",
      name: "Azure Nebula",
      type: "Nebula",
      description:
        "Beautiful blue nebula with subspace anomalies. Contains Borg transwarp conduits.",
      threat_level: 6,
      scientific_value: 8,
      coordinates: { x: 345.6, y: 123.4, z: 234.5 },
    },
    // Temporal and Spatial Anomalies
    {
      id: "anomaly1",
      name: "Temporal Rift",
      type: "Anomaly",
      description:
        "Unstable temporal distortion causing time displacement. Exercise extreme caution.",
      threat_level: 9,
      scientific_value: 10,
      coordinates: { x: 78.9, y: -34.2, z: 12.7 },
    },
    {
      id: "anomaly2",
      name: "Galactic Barrier",
      type: "Anomaly",
      description:
        "Energy barrier at galaxy's edge. Enhances ESP abilities, extremely dangerous to traverse.",
      threat_level: 10,
      scientific_value: 9,
      coordinates: { x: 50000, y: 0, z: 0 },
    },
    {
      id: "anomaly3",
      name: "Wormhole to Gamma Quadrant",
      type: "Anomaly",
      description:
        "Stable wormhole connecting Alpha and Gamma quadrants. Controlled by Prophets of Bajor.",
      threat_level: 4,
      scientific_value: 10,
      coordinates: { x: 245.7, y: -71.2, z: 91.4 },
    },
    {
      id: "anomaly4",
      name: "Nexus Energy Ribbon",
      type: "Anomaly",
      description:
        "Extradimensional energy ribbon creating temporal paradise. Extremely dangerous but alluring.",
      threat_level: 9,
      scientific_value: 10,
      coordinates: { x: 567.8, y: 234.5, z: -345.6 },
    },
    {
      id: "anomaly5",
      name: "Subspace Rupture",
      type: "Anomaly",
      description:
        "Tears in subspace fabric threatening local space-time. Risk of expanding catastrophically.",
      threat_level: 8,
      scientific_value: 7,
      coordinates: { x: 789.0, y: -456.7, z: 123.4 },
    },
    // Stellar Phenomena
    {
      id: "pulsar1",
      name: "PSR B1919+21",
      type: "Pulsar",
      description:
        "Neutron star emitting regular radiation pulses. Navigation hazard but useful for positioning.",
      threat_level: 6,
      scientific_value: 8,
      coordinates: { x: 1919, y: 21, z: 45.7 },
    },
    {
      id: "blackhole1",
      name: "Singularity at Veridian III",
      type: "Black Hole",
      description:
        "Collapsed star creating extreme gravitational distortion. Site of Enterprise-D destruction.",
      threat_level: 10,
      scientific_value: 9,
      coordinates: { x: 456.7, y: 789.0, z: -234.5 },
    },
    {
      id: "star1",
      name: "Amargosa Star",
      type: "Anomaly",
      description:
        "Star destroyed by trilithium weapon, creating massive stellar destruction.",
      threat_level: 10,
      scientific_value: 8,
      coordinates: { x: 345.6, y: 567.8, z: -123.4 },
    },
    // Borg-Related Phenomena
    {
      id: "borg1",
      name: "Transwarp Conduit Network",
      type: "Anomaly",
      description:
        "Borg-created subspace tunnels allowing rapid transit across vast distances.",
      threat_level: 8,
      scientific_value: 9,
      coordinates: { x: 70000, y: 15000, z: 25000 },
    },
    {
      id: "borg2",
      name: "Unimatrix Zero",
      type: "Anomaly",
      description:
        "Virtual reality construct where Borg drones can reclaim individuality.",
      threat_level: 7,
      scientific_value: 10,
      coordinates: { x: 72345, y: 16789, z: 23456 },
    },
    // Discovery Era Phenomena
    {
      id: "mycelial1",
      name: "Mycelial Network Junction",
      type: "Anomaly",
      description:
        "Connection point to the mycelial network spanning multiple universes.",
      threat_level: 6,
      scientific_value: 10,
      coordinates: { x: 123.4, y: 456.7, z: 789.0 },
    },
    {
      id: "mirror1",
      name: "Mirror Universe Interface",
      type: "Anomaly",
      description:
        "Quantum breach allowing access to the Mirror Universe. Extremely unstable.",
      threat_level: 9,
      scientific_value: 10,
      coordinates: { x: 234.5, y: 678.9, z: -345.6 },
    },
    // Voyager Delta Quadrant Phenomena
    {
      id: "void1",
      name: "The Void",
      type: "Anomaly",
      description:
        "Massive empty region of space trapping ships. No stars, planets, or resources.",
      threat_level: 7,
      scientific_value: 6,
      coordinates: { x: 71234, y: 5678, z: -9012 },
    },
    {
      id: "chaotic1",
      name: "Chaotic Space",
      type: "Anomaly",
      description:
        "Region where physical laws break down. Gravity, time, and space behave unpredictably.",
      threat_level: 9,
      scientific_value: 8,
      coordinates: { x: 73456, y: 7890, z: -1234 },
    },
  ];

  const getPlanetTypeColor = (type: string) => {
    switch (type) {
      case "Terrestrial":
        return "text-green-400 border-green-400 bg-green-400/20";
      case "Gas Giant":
        return "text-purple-400 border-purple-400 bg-purple-400/20";
      case "Ice World":
        return "text-cyan-400 border-cyan-400 bg-cyan-400/20";
      case "Desert":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Ocean":
        return "text-blue-400 border-blue-400 bg-blue-400/20";
      case "Volcanic":
        return "text-red-400 border-red-400 bg-red-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  const getClassIcon = (planetClass: string) => {
    switch (planetClass) {
      case "M":
        return <Leaf className="w-4 h-4" />;
      case "L":
        return <Wind className="w-4 h-4" />;
      case "K":
        return <Mountain className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          PLANETARY EXPLORATION
        </h2>
        <div className="flex gap-2">
          <Button
            variant={scanMode === "planets" ? "default" : "outline"}
            size="sm"
            className={
              scanMode === "planets"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setScanMode("planets")}
          >
            <Globe className="w-4 h-4 mr-2" />
            Planets
          </Button>
          <Button
            variant={scanMode === "asteroids" ? "default" : "outline"}
            size="sm"
            className={
              scanMode === "asteroids"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setScanMode("asteroids")}
          >
            <Mountain className="w-4 h-4 mr-2" />
            Asteroids
          </Button>
          <Button
            variant={scanMode === "phenomena" ? "default" : "outline"}
            size="sm"
            className={
              scanMode === "phenomena"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setScanMode("phenomena")}
          >
            <Zap className="w-4 h-4 mr-2" />
            Phenomena
          </Button>
        </div>
      </div>

      {scanMode === "planets" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {planets.map((planet) => (
              <Card
                key={planet.id}
                className={`bg-trek-panel border-trek-accent p-4 cursor-pointer transition-colors hover:border-trek-blue ${
                  selectedPlanet?.id === planet.id
                    ? "border-trek-blue bg-trek-blue/5"
                    : ""
                }`}
                onClick={() => setSelectedPlanet(planet)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-6 h-6 text-trek-gold" />
                    <div>
                      <h3 className="font-bold text-trek-gold">
                        {planet.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="secondary" className="text-xs">
                          {getClassIcon(planet.class)}
                          <span className="ml-1">Class {planet.class}</span>
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getPlanetTypeColor(planet.type)}`}
                        >
                          {planet.type}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-sm">
                    <div className="text-trek-text/70">
                      Moons: {planet.moons}
                    </div>
                    {planet.rings && (
                      <div className="text-trek-gold">Ring System</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-4 h-4 text-trek-blue" />
                    <span>{planet.temperature}°C</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-trek-blue" />
                    <span>{planet.gravity}g</span>
                  </div>
                  {planet.population && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-trek-blue" />
                      <span className="text-xs">{planet.population}</span>
                    </div>
                  )}
                </div>

                {planet.phenomena.length > 0 && (
                  <div className="mt-2">
                    {planet.phenomena.slice(0, 2).map((phenomenon, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs mr-1 border-trek-warning text-trek-warning"
                      >
                        {phenomenon}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>

          {selectedPlanet && (
            <Card className="bg-trek-panel border-trek-blue p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-8 h-8 text-trek-gold" />
                <div>
                  <h3 className="text-2xl font-bold text-trek-gold">
                    {selectedPlanet.name}
                  </h3>
                  <p className="text-trek-blue">
                    Class {selectedPlanet.class} {selectedPlanet.type} World
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Atmospheric Composition
                  </h4>
                  <p className="text-sm text-trek-text/80">
                    {selectedPlanet.atmosphere}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Surface Temperature
                    </div>
                    <div className="text-trek-blue font-semibold">
                      {selectedPlanet.temperature}°C
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Surface Gravity
                    </div>
                    <div className="text-trek-blue font-semibold">
                      {selectedPlanet.gravity}g
                    </div>
                  </div>
                </div>

                {selectedPlanet.population && (
                  <div>
                    <div className="text-trek-text/70 text-sm">Population</div>
                    <div className="text-trek-blue font-semibold">
                      {selectedPlanet.population}
                    </div>
                    <div className="text-trek-gold text-sm">
                      {selectedPlanet.civilization}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Natural Resources
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedPlanet.resources.map((resource, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-xs border-trek-blue text-trek-blue"
                      >
                        {resource}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Planetary Phenomena
                  </h4>
                  <div className="space-y-1">
                    {selectedPlanet.phenomena.map((phenomenon, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Eye className="w-4 h-4 text-trek-blue" />
                        <span>{phenomenon}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-trek-accent">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                    >
                      <Radar className="w-4 h-4 mr-2" />
                      Deep Scan
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Launch Probe
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {scanMode === "asteroids" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {asteroids.map((asteroid) => (
            <Card
              key={asteroid.id}
              className="bg-trek-panel border-trek-accent p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Mountain className="w-5 h-5 text-trek-gold" />
                <h3 className="font-bold text-trek-gold">{asteroid.name}</h3>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-trek-text/70">Size:</span>
                  <span className="text-trek-blue">{asteroid.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-trek-text/70">Composition:</span>
                  <span className="text-trek-blue text-xs">
                    {asteroid.composition}
                  </span>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-trek-text/70">Mining Potential:</span>
                    <span className="text-trek-blue">
                      {asteroid.mining_potential}%
                    </span>
                  </div>
                  <Progress value={asteroid.mining_potential} className="h-2" />
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="w-full mt-3 border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
              >
                Deploy Mining Operation
              </Button>
            </Card>
          ))}
        </div>
      )}

      {scanMode === "phenomena" && (
        <div className="space-y-4">
          {phenomena.map((phenomenon) => (
            <Card
              key={phenomenon.id}
              className="bg-trek-panel border-trek-accent p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-trek-warning" />
                  <div>
                    <h3 className="font-bold text-trek-gold">
                      {phenomenon.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="mt-1 text-xs border-trek-warning text-trek-warning"
                    >
                      {phenomenon.type}
                    </Badge>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm">
                      Threat: {phenomenon.threat_level}/10
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-trek-blue" />
                    <span className="text-trek-blue text-sm">
                      Science: {phenomenon.scientific_value}/10
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-trek-text/80 mb-4">{phenomenon.description}</p>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                >
                  Scientific Analysis
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-trek-warning text-trek-warning hover:bg-trek-warning hover:text-trek-dark"
                >
                  Maintain Safe Distance
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
