import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Crown,
  Shield,
  Zap,
  Brain,
  Heart,
  Globe,
  Star,
  Target,
  HeartHandshake,
  Sword,
  Search,
  Database,
} from "lucide-react";

interface AlienRace {
  id: string;
  name: string;
  homeworld: string;
  quadrant: "Alpha" | "Beta" | "Gamma" | "Delta";
  classification:
    | "Humanoid"
    | "Silicon-based"
    | "Energy Being"
    | "Crystalline"
    | "Gaseous"
    | "Machine";
  government: string;
  population: string;
  technology_level: number;
  warp_capable: boolean;
  first_contact_year: number;
  relations_with_federation:
    | "Allied"
    | "Neutral"
    | "Hostile"
    | "Unknown"
    | "Member";
  characteristics: {
    physiology: string;
    culture: string;
    notable_traits: string[];
    lifespan: number;
    telepathic: boolean;
  };
  military: {
    strength: number;
    fleet_size: number;
    preferred_tactics: string;
    notable_weapons: string[];
  };
  diplomacy: {
    attitude:
      | "Peaceful"
      | "Aggressive"
      | "Isolationist"
      | "Expansionist"
      | "Neutral";
    trade_relations: number;
    treaties: string[];
  };
  abilities: {
    strength: number;
    intelligence: number;
    technology: number;
    diplomacy: number;
    adaptability: number;
  };
  notable_individuals: string[];
  major_conflicts: string[];
  territories: string[];
  special_technologies: string[];
}

export function AlienRaces() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "details" | "relations" | "military"
  >("overview");
  const [selectedRace, setSelectedRace] = useState<AlienRace | null>(null);
  const [filterQuadrant, setFilterQuadrant] = useState<string>("All");
  const [filterRelations, setFilterRelations] = useState<string>("All");

  const alienRaces: AlienRace[] = [
    {
      id: "vulcan",
      name: "Vulcans",
      homeworld: "Vulcan (40 Eridani A)",
      quadrant: "Beta",
      classification: "Humanoid",
      government: "Vulcan High Command",
      population: "6.2 billion",
      technology_level: 9,
      warp_capable: true,
      first_contact_year: 2063,
      relations_with_federation: "Member",
      characteristics: {
        physiology:
          "Humanoid with pointed ears, enhanced strength, and copper-based blood",
        culture:
          "Logic-based society that suppresses emotions through discipline and meditation",
        notable_traits: [
          "Telepathic abilities",
          "Enhanced physical strength",
          "Long lifespan",
          "Pon farr mating cycle",
        ],
        lifespan: 200,
        telepathic: true,
      },
      military: {
        strength: 8,
        fleet_size: 450,
        preferred_tactics: "Defensive formations with precise strikes",
        notable_weapons: [
          "Particle beam weapons",
          "Photonic torpedoes",
          "Neural disruptors",
        ],
      },
      diplomacy: {
        attitude: "Peaceful",
        trade_relations: 95,
        treaties: [
          "Federation Charter",
          "Andorian Accords",
          "Tellarite Trade Agreement",
        ],
      },
      abilities: {
        strength: 8,
        intelligence: 10,
        technology: 9,
        diplomacy: 9,
        adaptability: 7,
      },
      notable_individuals: ["Spock", "T'Pol", "Sarek", "T'Pau", "Tuvok"],
      major_conflicts: ["Vulcan-Andorian Border Conflicts", "Augment Crisis"],
      territories: [
        "Vulcan System",
        "40 Eridani Sector",
        "Vulcan Colony Worlds",
      ],
      special_technologies: [
        "Katra transfer",
        "Advanced meditation techniques",
        "Logic extremism purge methods",
      ],
    },
    {
      id: "klingon",
      name: "Klingons",
      homeworld: "Qo'noS (Kronos)",
      quadrant: "Beta",
      classification: "Humanoid",
      government: "Klingon Empire",
      population: "24.7 billion",
      technology_level: 8,
      warp_capable: true,
      first_contact_year: 2151,
      relations_with_federation: "Allied",
      characteristics: {
        physiology:
          "Humanoid with pronounced cranial ridges, enhanced strength and endurance",
        culture:
          "Warrior society focused on honor, combat prowess, and family loyalty",
        notable_traits: [
          "Redundant organs",
          "Enhanced physical strength",
          "Ritual combat traditions",
          "Honor-based society",
        ],
        lifespan: 150,
        telepathic: false,
      },
      military: {
        strength: 10,
        fleet_size: 1200,
        preferred_tactics: "Aggressive frontal assaults and boarding actions",
        notable_weapons: [
          "Disruptor cannons",
          "Photon torpedoes",
          "Bat'leth weapons",
          "Bird-of-Prey cloaking technology",
        ],
      },
      diplomacy: {
        attitude: "Aggressive",
        trade_relations: 65,
        treaties: ["Khitomer Accords", "Dominion War Alliance"],
      },
      abilities: {
        strength: 10,
        intelligence: 7,
        technology: 8,
        diplomacy: 4,
        adaptability: 8,
      },
      notable_individuals: [
        "Worf",
        "Gowron",
        "Martok",
        "Kahless",
        "Chancellor Gorkon",
      ],
      major_conflicts: [
        "Federation-Klingon War",
        "Klingon Civil War",
        "Dominion War",
      ],
      territories: ["Klingon Empire", "Ketha Province", "First City", "Boreth"],
      special_technologies: [
        "Cloaking device",
        "Bat'leth forging",
        "Honor guard training",
      ],
    },
    {
      id: "romulan",
      name: "Romulans",
      homeworld: "Romulus",
      quadrant: "Beta",
      classification: "Humanoid",
      government: "Romulan Star Empire",
      population: "18.2 billion",
      technology_level: 9,
      warp_capable: true,
      first_contact_year: 2152,
      relations_with_federation: "Hostile",
      characteristics: {
        physiology:
          "Vulcanoid species with pointed ears, similar to Vulcans but more emotional",
        culture:
          "Secretive, militaristic society with emphasis on honor and state loyalty",
        notable_traits: [
          "Vulcan ancestry",
          "Emotional expressiveness",
          "Military discipline",
          "Political intrigue",
        ],
        lifespan: 200,
        telepathic: false,
      },
      military: {
        strength: 9,
        fleet_size: 800,
        preferred_tactics: "Stealth attacks, cloaking, psychological warfare",
        notable_weapons: [
          "Plasma torpedoes",
          "Disruptor beams",
          "Cloaking devices",
          "Thalaron radiation weapons",
        ],
      },
      diplomacy: {
        attitude: "Isolationist",
        trade_relations: 25,
        treaties: ["Treaty of Algeron", "Neutral Zone Agreements"],
      },
      abilities: {
        strength: 8,
        intelligence: 9,
        technology: 9,
        diplomacy: 6,
        adaptability: 7,
      },
      notable_individuals: [
        "Commander Sela",
        "Nero",
        "Senator Vreenak",
        "Tal Shiar operatives",
      ],
      major_conflicts: [
        "Earth-Romulan War",
        "Dominion War",
        "Romulan Civil War",
      ],
      territories: ["Romulan Star Empire", "Neutral Zone", "Romulan colonies"],
      special_technologies: [
        "Advanced cloaking",
        "Thalaron weapons",
        "Artificial quantum singularity cores",
      ],
    },
    {
      id: "cardassian",
      name: "Cardassians",
      homeworld: "Cardassia Prime",
      quadrant: "Alpha",
      classification: "Humanoid",
      government: "Cardassian Union",
      population: "4.6 billion",
      technology_level: 7,
      warp_capable: true,
      first_contact_year: 2318,
      relations_with_federation: "Neutral",
      characteristics: {
        physiology:
          "Reptilian humanoids with pronounced neck ridges and spoon-shaped foreheads",
        culture:
          "Militaristic society with strong family values and appreciation for intellectual pursuits",
        notable_traits: [
          "Enhanced hearing",
          "Preference for heat",
          "Strong family bonds",
          "Military discipline",
        ],
        lifespan: 140,
        telepathic: false,
      },
      military: {
        strength: 7,
        fleet_size: 600,
        preferred_tactics:
          "Defensive positions, orbital bombardment, occupation forces",
        notable_weapons: [
          "Spiral wave disruptors",
          "Photon torpedoes",
          "Orbital defense platforms",
        ],
      },
      diplomacy: {
        attitude: "Neutral",
        trade_relations: 45,
        treaties: ["Federation-Cardassian Treaty", "Dominion Alliance"],
      },
      abilities: {
        strength: 7,
        intelligence: 8,
        technology: 7,
        diplomacy: 6,
        adaptability: 7,
      },
      notable_individuals: [
        "Gul Dukat",
        "Elim Garak",
        "Legate Damar",
        "Gul Madred",
      ],
      major_conflicts: [
        "Cardassian-Federation War",
        "Bajoran Occupation",
        "Dominion War",
      ],
      territories: [
        "Cardassian Union",
        "Bajoran System (former)",
        "Cardassian Border colonies",
      ],
      special_technologies: [
        "Orbital weapons platforms",
        "Advanced interrogation techniques",
        "Military engineering",
      ],
    },
    {
      id: "bajoran",
      name: "Bajorans",
      homeworld: "Bajor",
      quadrant: "Alpha",
      classification: "Humanoid",
      government: "Bajoran Republic",
      population: "3.2 billion",
      technology_level: 6,
      warp_capable: true,
      first_contact_year: 2318,
      relations_with_federation: "Allied",
      characteristics: {
        physiology:
          "Humanoid with distinctive nose ridges and strong spiritual nature",
        culture:
          "Deeply religious society centered around the Prophets and spiritual growth",
        notable_traits: [
          "Strong spiritual beliefs",
          "Artistic nature",
          "Resilient spirit",
          "Connection to Prophets",
        ],
        lifespan: 120,
        telepathic: false,
      },
      military: {
        strength: 4,
        fleet_size: 120,
        preferred_tactics:
          "Guerrilla warfare, resistance movements, defensive strategies",
        notable_weapons: [
          "Phaser arrays",
          "Photon torpedoes",
          "Resistance weapons",
        ],
      },
      diplomacy: {
        attitude: "Peaceful",
        trade_relations: 85,
        treaties: [
          "Federation Non-Aggression Pact",
          "Bajoran-Federation Cooperation Treaty",
        ],
      },
      abilities: {
        strength: 5,
        intelligence: 7,
        technology: 6,
        diplomacy: 8,
        adaptability: 9,
      },
      notable_individuals: [
        "Kai Winn",
        "Major Kira Nerys",
        "Li Nalas",
        "Vedek Bareil",
      ],
      major_conflicts: [
        "Cardassian Occupation",
        "Bajoran Resistance",
        "Circle uprising",
      ],
      territories: ["Bajor", "Bajoran colonies", "Deep Space Nine vicinity"],
      special_technologies: [
        "Orb technology",
        "Spiritual artifacts",
        "Resistance tactics",
      ],
    },
    {
      id: "borg",
      name: "Borg Collective",
      homeworld: "Unknown",
      quadrant: "Delta",
      classification: "Cybernetic",
      government: "Collective Consciousness",
      population: "Trillions",
      technology_level: 10,
      warp_capable: true,
      first_contact_year: 2365,
      relations_with_federation: "Hostile",
      characteristics: {
        physiology:
          "Cybernetically enhanced beings from multiple assimilated species",
        culture:
          "Collective consciousness seeking perfection through assimilation",
        notable_traits: [
          "Cybernetic implants",
          "Collective consciousness",
          "Adaptive technology",
          "Assimilation nanoprobes",
        ],
        lifespan: 0,
        telepathic: true,
      },
      military: {
        strength: 10,
        fleet_size: 10000,
        preferred_tactics: "Overwhelming force, adaptation, assimilation",
        notable_weapons: [
          "Cutting beams",
          "Tractor beams",
          "Nanoprobes",
          "Adaptive shields",
        ],
      },
      diplomacy: {
        attitude: "Aggressive",
        trade_relations: 0,
        treaties: [],
      },
      abilities: {
        strength: 10,
        intelligence: 10,
        technology: 10,
        diplomacy: 0,
        adaptability: 10,
      },
      notable_individuals: ["Borg Queen", "Seven of Nine", "Locutus", "Hugh"],
      major_conflicts: [
        "Battle of Wolf 359",
        "Borg Invasion of 2373",
        "Unimatrix Zero",
      ],
      territories: ["Delta Quadrant", "Borg Space", "Assimilated worlds"],
      special_technologies: [
        "Transwarp technology",
        "Assimilation nanoprobes",
        "Collective consciousness network",
      ],
    },
    {
      id: "ferengi",
      name: "Ferengi",
      homeworld: "Ferenginar",
      quadrant: "Alpha",
      classification: "Humanoid",
      government: "Ferengi Alliance",
      population: "15.7 billion",
      technology_level: 7,
      warp_capable: true,
      first_contact_year: 2364,
      relations_with_federation: "Neutral",
      characteristics: {
        physiology:
          "Small humanoids with large ears, enhanced hearing, and four-lobed brains",
        culture:
          "Capitalist society governed by the Rules of Acquisition and profit",
        notable_traits: [
          "Enhanced hearing",
          "Natural business acumen",
          "Resistance to telepathy",
          "Profit-driven",
        ],
        lifespan: 140,
        telepathic: false,
      },
      military: {
        strength: 5,
        fleet_size: 300,
        preferred_tactics:
          "Economic warfare, avoiding direct conflict when possible",
        notable_weapons: [
          "Energy whips",
          "Plasma cannons",
          "Defensive shields",
        ],
      },
      diplomacy: {
        attitude: "Neutral",
        trade_relations: 90,
        treaties: ["Federation Trade Agreements", "Klingon Commerce Pacts"],
      },
      abilities: {
        strength: 4,
        intelligence: 8,
        technology: 7,
        diplomacy: 9,
        adaptability: 8,
      },
      notable_individuals: ["Grand Nagus Zek", "Quark", "Rom", "Nog", "Ishka"],
      major_conflicts: ["Trade disputes", "Economic conflicts"],
      territories: [
        "Ferengi Alliance",
        "Trade outposts",
        "Commercial ventures",
      ],
      special_technologies: [
        "Advanced banking systems",
        "Holosuites",
        "Latinum refinement",
      ],
    },
    {
      id: "andorian",
      name: "Andorians",
      homeworld: "Andoria",
      quadrant: "Beta",
      classification: "Humanoid",
      government: "Andorian Empire",
      population: "8.9 billion",
      technology_level: 8,
      warp_capable: true,
      first_contact_year: 2151,
      relations_with_federation: "Member",
      characteristics: {
        physiology:
          "Blue-skinned humanoids with antennae and enhanced hearing abilities",
        culture:
          "Warrior society with strong emphasis on honor, family, and military service",
        notable_traits: [
          "Blue skin",
          "Antennae for enhanced hearing",
          "Four-gender reproduction",
          "Warrior culture",
        ],
        lifespan: 130,
        telepathic: false,
      },
      military: {
        strength: 8,
        fleet_size: 400,
        preferred_tactics: "Mobile strike forces, hit-and-run attacks",
        notable_weapons: [
          "Phase cannons",
          "Photonic torpedoes",
          "Particle beam weapons",
        ],
      },
      diplomacy: {
        attitude: "Neutral",
        trade_relations: 80,
        treaties: ["Federation Charter", "Vulcan Border Agreements"],
      },
      abilities: {
        strength: 8,
        intelligence: 7,
        technology: 8,
        diplomacy: 7,
        adaptability: 8,
      },
      notable_individuals: [
        "Shran",
        "Thy'lek Shran",
        "Talas",
        "Commander Shran",
      ],
      major_conflicts: [
        "Vulcan Border Disputes",
        "Xindi Conflict",
        "Romulan War",
      ],
      territories: ["Andorian Empire", "Andorian colonies", "Border outposts"],
      special_technologies: [
        "Ice-based architecture",
        "Advanced sensors",
        "Combat training",
      ],
    },
    {
      id: "tellarite",
      name: "Tellarites",
      homeworld: "Tellar Prime",
      quadrant: "Alpha",
      classification: "Humanoid",
      government: "Tellarite Republic",
      population: "12.4 billion",
      technology_level: 8,
      warp_capable: true,
      first_contact_year: 2152,
      relations_with_federation: "Member",
      characteristics: {
        physiology:
          "Porcine humanoids with enhanced constitution and argumentative nature",
        culture:
          "Democratic society that values debate, engineering, and intellectual discourse",
        notable_traits: [
          "Porcine features",
          "Love of argument",
          "Engineering expertise",
          "Democratic values",
        ],
        lifespan: 100,
        telepathic: false,
      },
      military: {
        strength: 6,
        fleet_size: 280,
        preferred_tactics: "Defensive engineering, fortifications",
        notable_weapons: [
          "Phase cannons",
          "Defensive systems",
          "Engineering tools",
        ],
      },
      diplomacy: {
        attitude: "Neutral",
        trade_relations: 85,
        treaties: ["Federation Charter", "Alpha Quadrant Trade Agreements"],
      },
      abilities: {
        strength: 6,
        intelligence: 8,
        technology: 9,
        diplomacy: 6,
        adaptability: 7,
      },
      notable_individuals: [
        "Ambassador Gral",
        "Captain Gralev",
        "Minister Kells",
      ],
      major_conflicts: ["Border disputes", "Trade conflicts"],
      territories: [
        "Tellarite Republic",
        "Industrial colonies",
        "Trading posts",
      ],
      special_technologies: [
        "Advanced engineering",
        "Industrial manufacturing",
        "Defensive systems",
      ],
    },
    {
      id: "dominion",
      name: "Dominion",
      homeworld: "Unknown Gamma Quadrant",
      quadrant: "Gamma",
      classification: "Multiple",
      government: "Dominion Empire",
      population: "Unknown trillions",
      technology_level: 9,
      warp_capable: true,
      first_contact_year: 2370,
      relations_with_federation: "Hostile",
      characteristics: {
        physiology: "Multi-species empire led by shapeshifting Founders",
        culture:
          "Authoritarian empire focused on order, control, and genetic engineering",
        notable_traits: [
          "Shapeshifting Founders",
          "Genetically engineered soldiers",
          "Absolute loyalty",
          "Order above all",
        ],
        lifespan: 0,
        telepathic: false,
      },
      military: {
        strength: 10,
        fleet_size: 30000,
        preferred_tactics:
          "Overwhelming numbers, genetic soldiers, infiltration",
        notable_weapons: [
          "Polaron beams",
          "Dominion battleships",
          "Jem'Hadar soldiers",
          "Ketracel-white dependency",
        ],
      },
      diplomacy: {
        attitude: "Expansionist",
        trade_relations: 10,
        treaties: ["Cardassian Alliance"],
      },
      abilities: {
        strength: 10,
        intelligence: 9,
        technology: 9,
        diplomacy: 3,
        adaptability: 9,
      },
      notable_individuals: [
        "Female Changeling",
        "Odo",
        "Weyoun",
        "Jem'Hadar soldiers",
      ],
      major_conflicts: ["Dominion War", "Gamma Quadrant expansion"],
      territories: [
        "Gamma Quadrant Empire",
        "Dominion Space",
        "Occupied territories",
      ],
      special_technologies: [
        "Shapeshifting abilities",
        "Genetic engineering",
        "Ketracel-white production",
      ],
    },
    // TOS Era Species
    {
      id: "gorn",
      name: "Gorn Hegemony",
      homeworld: "Gornar",
      quadrant: "Beta",
      classification: "Humanoid",
      government: "Gorn Hegemony",
      population: "2.1 billion",
      technology_level: 7,
      warp_capable: true,
      first_contact_year: 2267,
      relations_with_federation: "Neutral",
      characteristics: {
        physiology:
          "Large reptilian humanoids with incredible strength and durability",
        culture: "Warrior society with focus on territorial defense and honor",
        notable_traits: [
          "Incredible physical strength",
          "Highly durable scales",
          "Cold-blooded metabolism",
          "Territorial nature",
        ],
        lifespan: 300,
        telepathic: false,
      },
      military: {
        strength: 9,
        fleet_size: 450,
        preferred_tactics:
          "Heavy assault, boarding actions, territorial defense",
        notable_weapons: [
          "Plasma cannons",
          "Heavy disruptors",
          "Asteroid bombardment",
        ],
      },
      diplomacy: {
        attitude: "Neutral",
        trade_relations: 35,
        treaties: ["Cestus III Non-Aggression Pact"],
      },
      abilities: {
        strength: 10,
        intelligence: 6,
        technology: 7,
        diplomacy: 5,
        adaptability: 6,
      },
      notable_individuals: ["Gorn Captain", "S'sesslak"],
      major_conflicts: ["Battle of Cestus III", "Gorn Border Wars"],
      territories: ["Gorn Hegemony", "Cestus Sector", "Metron Space borders"],
      special_technologies: [
        "Heavy plasma weapons",
        "Asteroid mining",
        "Territorial defense grids",
      ],
    },
    {
      id: "tholian",
      name: "Tholian Assembly",
      homeworld: "Tholia",
      quadrant: "Alpha",
      classification: "Crystalline",
      government: "Tholian Assembly",
      population: "Unknown",
      technology_level: 8,
      warp_capable: true,
      first_contact_year: 2268,
      relations_with_federation: "Hostile",
      characteristics: {
        physiology:
          "Crystalline silicon-based lifeforms requiring extreme heat",
        culture: "Highly territorial and punctual, intolerant of other species",
        notable_traits: [
          "Silicon-based physiology",
          "Require extreme heat",
          "Perfectly punctual",
          "Territorial extremists",
        ],
        lifespan: 0,
        telepathic: false,
      },
      military: {
        strength: 8,
        fleet_size: 200,
        preferred_tactics: "Energy web entrapment, coordinated assault",
        notable_weapons: [
          "Tholian web",
          "Plasma energy beams",
          "Interphase technology",
        ],
      },
      diplomacy: {
        attitude: "Isolationist",
        trade_relations: 5,
        treaties: [],
      },
      abilities: {
        strength: 7,
        intelligence: 8,
        technology: 8,
        diplomacy: 2,
        adaptability: 4,
      },
      notable_individuals: ["Tholian Commander", "Loskene"],
      major_conflicts: ["USS Defiant Incident", "Tholian Border Conflicts"],
      territories: ["Tholian Assembly", "Tholian Space"],
      special_technologies: [
        "Tholian web",
        "Interphase technology",
        "High-temperature life support",
      ],
    },
    {
      id: "orion",
      name: "Orion Syndicate",
      homeworld: "Orion",
      quadrant: "Alpha",
      classification: "Humanoid",
      government: "Orion Syndicate",
      population: "3.4 billion",
      technology_level: 6,
      warp_capable: true,
      first_contact_year: 2154,
      relations_with_federation: "Hostile",
      characteristics: {
        physiology: "Green-skinned humanoids with pheromone-based abilities",
        culture:
          "Criminal organization focused on slavery, piracy, and smuggling",
        notable_traits: [
          "Powerful pheromones",
          "Natural traders",
          "Criminal tendencies",
          "Slave trade specialists",
        ],
        lifespan: 120,
        telepathic: false,
      },
      military: {
        strength: 6,
        fleet_size: 800,
        preferred_tactics: "Piracy, raids, smuggling operations",
        notable_weapons: [
          "Disruptor cannons",
          "Pirate vessels",
          "Slave collar technology",
        ],
      },
      diplomacy: {
        attitude: "Neutral",
        trade_relations: 60,
        treaties: [],
      },
      abilities: {
        strength: 6,
        intelligence: 7,
        technology: 6,
        diplomacy: 8,
        adaptability: 9,
      },
      notable_individuals: ["Devna", "Maras", "Harrad-Sar"],
      major_conflicts: ["Orion Slave Trade", "Piracy Operations"],
      territories: ["Orion Colonies", "Pirate Bases", "Smuggling Routes"],
      special_technologies: [
        "Pheromone control",
        "Slave collar technology",
        "Cloaking devices",
      ],
    },
    // TNG Era Species
    {
      id: "q_continuum",
      name: "Q Continuum",
      homeworld: "Q Continuum",
      quadrant: "Delta",
      classification: "Energy Being",
      government: "Q Continuum",
      population: "Unknown",
      technology_level: 10,
      warp_capable: true,
      first_contact_year: 2364,
      relations_with_federation: "Unknown",
      characteristics: {
        physiology: "Omnipotent energy beings capable of any form",
        culture: "Ancient beings focused on higher pursuits and cosmic balance",
        notable_traits: [
          "Omnipotence",
          "Reality manipulation",
          "Time travel",
          "Immortality",
        ],
        lifespan: 0,
        telepathic: true,
      },
      military: {
        strength: 10,
        fleet_size: 0,
        preferred_tactics: "Reality manipulation, omnipotent intervention",
        notable_weapons: [
          "Omnipotent powers",
          "Reality alteration",
          "Q weapons",
        ],
      },
      diplomacy: {
        attitude: "Neutral",
        trade_relations: 0,
        treaties: [],
      },
      abilities: {
        strength: 10,
        intelligence: 10,
        technology: 10,
        diplomacy: 5,
        adaptability: 10,
      },
      notable_individuals: ["Q", "Q Junior", "Quinn", "Female Q"],
      major_conflicts: ["Q Civil War", "Q Trials"],
      territories: ["Q Continuum", "All of existence"],
      special_technologies: [
        "Omnipotence",
        "Reality manipulation",
        "Time travel",
      ],
    },
    {
      id: "tamarian",
      name: "Tamarians (Children of Tama)",
      homeworld: "Sigma Tama IV",
      quadrant: "Alpha",
      classification: "Humanoid",
      government: "Tamarian Council",
      population: "890 million",
      technology_level: 8,
      warp_capable: true,
      first_contact_year: 2368,
      relations_with_federation: "Allied",
      characteristics: {
        physiology: "Humanoid with distinctive facial ridges and orange skin",
        culture: "Metaphorical language based on historical allegory and myth",
        notable_traits: [
          "Metaphorical communication",
          "Historical allegory",
          "Peaceful nature",
          "Cultural mythology",
        ],
        lifespan: 150,
        telepathic: false,
      },
      military: {
        strength: 5,
        fleet_size: 120,
        preferred_tactics: "Defensive postures, diplomatic solutions",
        notable_weapons: ["Energy weapons", "Defensive systems"],
      },
      diplomacy: {
        attitude: "Peaceful",
        trade_relations: 75,
        treaties: ["Federation Cultural Exchange"],
      },
      abilities: {
        strength: 5,
        intelligence: 8,
        technology: 8,
        diplomacy: 10,
        adaptability: 7,
      },
      notable_individuals: ["Dathon", "Tamarian Captain"],
      major_conflicts: [],
      territories: ["Sigma Tama system", "Tamarian colonies"],
      special_technologies: [
        "Metaphorical translation",
        "Cultural preservation",
        "Peace treaties",
      ],
    },
    // Voyager Delta Quadrant Species
    {
      id: "kazon",
      name: "Kazon",
      homeworld: "Kazon Prime",
      quadrant: "Delta",
      classification: "Humanoid",
      government: "Kazon Sects",
      population: "45 million",
      technology_level: 5,
      warp_capable: true,
      first_contact_year: 2371,
      relations_with_federation: "Hostile",
      characteristics: {
        physiology:
          "Humanoid with distinctive hair crests and aggressive nature",
        culture: "Violent patriarchal society divided into warring sects",
        notable_traits: [
          "Aggressive warriors",
          "Sectarian conflicts",
          "Scavenging technology",
          "Water scarcity",
        ],
        lifespan: 90,
        telepathic: false,
      },
      military: {
        strength: 6,
        fleet_size: 400,
        preferred_tactics: "Raiding, scavenging, sectarian warfare",
        notable_weapons: [
          "Scavenged weapons",
          "Raider vessels",
          "Energy weapons",
        ],
      },
      diplomacy: {
        attitude: "Aggressive",
        trade_relations: 20,
        treaties: [],
      },
      abilities: {
        strength: 7,
        intelligence: 4,
        technology: 5,
        diplomacy: 2,
        adaptability: 6,
      },
      notable_individuals: ["Culluh", "Seska", "Maj Cullah"],
      major_conflicts: ["Kazon-Voyager Conflicts", "Sectarian Wars"],
      territories: ["Kazon Space", "Various sect territories"],
      special_technologies: [
        "Scavenged Federation tech",
        "Water reclamation",
        "Raiding tactics",
      ],
    },
    {
      id: "vidiian",
      name: "Vidiians",
      homeworld: "Vidiia Prime",
      quadrant: "Delta",
      classification: "Humanoid",
      government: "Vidiian Sodality",
      population: "2.1 billion",
      technology_level: 8,
      warp_capable: true,
      first_contact_year: 2371,
      relations_with_federation: "Hostile",
      characteristics: {
        physiology: "Diseased humanoids requiring constant organ harvesting",
        culture: "Medical society focused on survival through organ theft",
        notable_traits: [
          "Phage disease",
          "Organ harvesting",
          "Medical expertise",
          "Survival instinct",
        ],
        lifespan: 200,
        telepathic: false,
      },
      military: {
        strength: 7,
        fleet_size: 300,
        preferred_tactics: "Surgical strikes, organ harvesting raids",
        notable_weapons: [
          "Medical extraction tools",
          "Phaser scalpels",
          "Harvesting ships",
        ],
      },
      diplomacy: {
        attitude: "Neutral",
        trade_relations: 30,
        treaties: [],
      },
      abilities: {
        strength: 6,
        intelligence: 9,
        technology: 8,
        diplomacy: 4,
        adaptability: 8,
      },
      notable_individuals: ["Dr. Crell Moset", "Sulan", "Danara Pel"],
      major_conflicts: ["Organ Harvesting Wars", "Phage Crisis"],
      territories: ["Vidiian Sodality", "Medical research stations"],
      special_technologies: [
        "Advanced surgery",
        "Organ cultivation",
        "Medical technology",
      ],
    },
    {
      id: "hirogen",
      name: "Hirogen",
      homeworld: "Unknown",
      quadrant: "Delta",
      classification: "Humanoid",
      government: "Hirogen Hierarchy",
      population: "680,000",
      technology_level: 7,
      warp_capable: true,
      first_contact_year: 2374,
      relations_with_federation: "Hostile",
      characteristics: {
        physiology: "Large, powerful humanoids evolved for hunting",
        culture: "Nomadic hunter society focused on the pursuit of worthy prey",
        notable_traits: [
          "Master hunters",
          "Trophy collectors",
          "Nomadic lifestyle",
          "Honor through hunt",
        ],
        lifespan: 200,
        telepathic: false,
      },
      military: {
        strength: 9,
        fleet_size: 150,
        preferred_tactics: "Hunting expeditions, pursuit warfare",
        notable_weapons: [
          "Tetryon weapons",
          "Hunting vessels",
          "Trophy technology",
        ],
      },
      diplomacy: {
        attitude: "Aggressive",
        trade_relations: 15,
        treaties: [],
      },
      abilities: {
        strength: 9,
        intelligence: 7,
        technology: 7,
        diplomacy: 3,
        adaptability: 8,
      },
      notable_individuals: ["Karr", "Idrin", "Donik"],
      major_conflicts: ["Great Hunt", "Hirogen Wars"],
      territories: ["Nomadic fleets", "Hunting grounds"],
      special_technologies: [
        "Hunting technology",
        "Trophy preservation",
        "Long-range sensors",
      ],
    },
    {
      id: "species_8472",
      name: "Species 8472 (Undine)",
      homeworld: "Fluidic Space",
      quadrant: "Delta",
      classification: "Energy Being",
      government: "Species 8472 Collective",
      population: "Unknown",
      technology_level: 10,
      warp_capable: true,
      first_contact_year: 2374,
      relations_with_federation: "Neutral",
      characteristics: {
        physiology:
          "Tripedal beings from fluidic space with incredible immune systems",
        culture: "Highly xenophobic species focused on purity and isolation",
        notable_traits: [
          "Immune to assimilation",
          "Fluidic space natives",
          "Bioships",
          "Telepathic communication",
        ],
        lifespan: 0,
        telepathic: true,
      },
      military: {
        strength: 10,
        fleet_size: 1000,
        preferred_tactics: "Overwhelming bioship assaults",
        notable_weapons: [
          "Bio-ships",
          "Energy focusing weapons",
          "Planet killers",
        ],
      },
      diplomacy: {
        attitude: "Isolationist",
        trade_relations: 0,
        treaties: [],
      },
      abilities: {
        strength: 10,
        intelligence: 9,
        technology: 10,
        diplomacy: 2,
        adaptability: 8,
      },
      notable_individuals: ["Undine representatives"],
      major_conflicts: ["Borg-Species 8472 War", "Fluidic Space incidents"],
      territories: ["Fluidic Space", "Bioship formations"],
      special_technologies: [
        "Bio-ships",
        "Fluidic space travel",
        "Immune system technology",
      ],
    },
    // DS9 Era Species
    {
      id: "jemhadar",
      name: "Jem'Hadar",
      homeworld: "Kurill Prime",
      quadrant: "Gamma",
      classification: "Humanoid",
      government: "Dominion Empire",
      population: "Unknown billions",
      technology_level: 8,
      warp_capable: true,
      first_contact_year: 2370,
      relations_with_federation: "Hostile",
      characteristics: {
        physiology:
          "Genetically engineered soldiers with built-in drug dependency",
        culture: "Warrior society bred for absolute loyalty to the Founders",
        notable_traits: [
          "Ketracel-white dependency",
          "Built-in shrouding",
          "No sleep required",
          "Absolute loyalty",
        ],
        lifespan: 30,
        telepathic: false,
      },
      military: {
        strength: 10,
        fleet_size: 15000,
        preferred_tactics: "Shock troops, suicide missions, overwhelming force",
        notable_weapons: [
          "Polaron weapons",
          "Dominion battleships",
          "Kar'takin blades",
        ],
      },
      diplomacy: {
        attitude: "Aggressive",
        trade_relations: 0,
        treaties: [],
      },
      abilities: {
        strength: 10,
        intelligence: 6,
        technology: 8,
        diplomacy: 1,
        adaptability: 7,
      },
      notable_individuals: ["Omet'iklan", "Ikat'ika", "Kudak'Etan"],
      major_conflicts: ["Dominion War", "Gamma Quadrant conflicts"],
      territories: ["Dominion territories", "Military installations"],
      special_technologies: [
        "Shrouding technology",
        "Ketracel-white",
        "Polaron weapons",
      ],
    },
    {
      id: "vorta",
      name: "Vorta",
      homeworld: "Unknown Gamma Quadrant",
      quadrant: "Gamma",
      classification: "Humanoid",
      government: "Dominion Empire",
      population: "Unknown millions",
      technology_level: 8,
      warp_capable: true,
      first_contact_year: 2370,
      relations_with_federation: "Hostile",
      characteristics: {
        physiology:
          "Genetically engineered administrators with enhanced loyalty",
        culture: "Diplomatic and administrative caste serving the Founders",
        notable_traits: [
          "Genetic loyalty programming",
          "Diplomatic immunity",
          "Cloning technology",
          "Administrative expertise",
        ],
        lifespan: 200,
        telepathic: false,
      },
      military: {
        strength: 3,
        fleet_size: 0,
        preferred_tactics: "Diplomacy, administration, negotiation",
        notable_weapons: ["Suicide implants", "Diplomatic immunity"],
      },
      diplomacy: {
        attitude: "Expansionist",
        trade_relations: 40,
        treaties: ["Dominion treaties"],
      },
      abilities: {
        strength: 3,
        intelligence: 9,
        technology: 8,
        diplomacy: 10,
        adaptability: 8,
      },
      notable_individuals: ["Weyoun", "Borath", "Keevan"],
      major_conflicts: ["Dominion War negotiations"],
      territories: ["Dominion administrative centers"],
      special_technologies: [
        "Cloning technology",
        "Genetic programming",
        "Administrative systems",
      ],
    },
    // Discovery Era Species
    {
      id: "kelpien",
      name: "Kelpiens",
      homeworld: "Kaminar",
      quadrant: "Alpha",
      classification: "Humanoid",
      government: "Kelpien Council",
      population: "200 million",
      technology_level: 6,
      warp_capable: false,
      first_contact_year: 2239,
      relations_with_federation: "Allied",
      characteristics: {
        physiology:
          "Tall humanoids evolved as prey species with enhanced senses",
        culture:
          "Former prey species now achieving balance with predator species",
        notable_traits: [
          "Enhanced threat detection",
          "Vahar'ai transformation",
          "Threat ganglia",
          "Superior senses",
        ],
        lifespan: 200,
        telepathic: false,
      },
      military: {
        strength: 4,
        fleet_size: 0,
        preferred_tactics: "Avoidance, defensive strategies",
        notable_weapons: ["Defensive systems", "Early warning networks"],
      },
      diplomacy: {
        attitude: "Peaceful",
        trade_relations: 85,
        treaties: ["Federation Protectorate Status"],
      },
      abilities: {
        strength: 6,
        intelligence: 8,
        technology: 6,
        diplomacy: 9,
        adaptability: 9,
      },
      notable_individuals: ["Saru", "Siranna", "Aradar"],
      major_conflicts: ["Ba'ul Oppression", "Great Balance"],
      territories: ["Kaminar", "Kelpien settlements"],
      special_technologies: [
        "Threat detection",
        "Balance technology",
        "Sensory enhancement",
      ],
    },
    {
      id: "baul",
      name: "Ba'ul",
      homeworld: "Kaminar",
      quadrant: "Alpha",
      classification: "Humanoid",
      government: "Ba'ul Technology Council",
      population: "50 million",
      technology_level: 8,
      warp_capable: true,
      first_contact_year: 2257,
      relations_with_federation: "Neutral",
      characteristics: {
        physiology: "Advanced predator species with technological superiority",
        culture: "Former predator species learning to coexist with former prey",
        notable_traits: [
          "Advanced technology",
          "Former predators",
          "Camouflage abilities",
          "Technological mastery",
        ],
        lifespan: 300,
        telepathic: false,
      },
      military: {
        strength: 8,
        fleet_size: 100,
        preferred_tactics: "Technological superiority, stealth operations",
        notable_weapons: [
          "Advanced energy weapons",
          "Cloaking technology",
          "Defensive grids",
        ],
      },
      diplomacy: {
        attitude: "Neutral",
        trade_relations: 55,
        treaties: ["Great Balance Agreement"],
      },
      abilities: {
        strength: 7,
        intelligence: 9,
        technology: 8,
        diplomacy: 6,
        adaptability: 7,
      },
      notable_individuals: ["Ba'ul Council Members"],
      major_conflicts: ["Kelpien Oppression", "Balance Wars"],
      territories: ["Kaminar Technology Centers", "Ba'ul Cities"],
      special_technologies: [
        "Advanced camouflage",
        "Energy manipulation",
        "Stealth technology",
      ],
    },
    // Enterprise Era Species
    {
      id: "xindi_aquatic",
      name: "Xindi-Aquatics",
      homeworld: "Azati Prime (destroyed)",
      quadrant: "Alpha",
      classification: "Humanoid",
      government: "Xindi Council",
      population: "45 million",
      technology_level: 8,
      warp_capable: true,
      first_contact_year: 2153,
      relations_with_federation: "Allied",
      characteristics: {
        physiology: "Aquatic humanoids requiring water-based environments",
        culture: "Peaceful Xindi species focused on harmony and cooperation",
        notable_traits: [
          "Aquatic adaptation",
          "Peaceful nature",
          "Advanced hydroponics",
          "Diplomatic wisdom",
        ],
        lifespan: 400,
        telepathic: false,
      },
      military: {
        strength: 6,
        fleet_size: 80,
        preferred_tactics: "Defensive strategies, diplomatic solutions",
        notable_weapons: ["Particle weapons", "Defensive shields"],
      },
      diplomacy: {
        attitude: "Peaceful",
        trade_relations: 90,
        treaties: ["Xindi Alliance", "Earth-Xindi Peace Treaty"],
      },
      abilities: {
        strength: 6,
        intelligence: 9,
        technology: 8,
        diplomacy: 10,
        adaptability: 8,
      },
      notable_individuals: ["Xindi-Aquatic Council Members"],
      major_conflicts: ["Xindi Crisis resolution"],
      territories: ["Xindi space", "Aquatic ships"],
      special_technologies: [
        "Aquatic life support",
        "Hydroponics",
        "Water-based technology",
      ],
    },
    {
      id: "suliban",
      name: "Suliban",
      homeworld: "Suliban Homeworld (destroyed)",
      quadrant: "Alpha",
      classification: "Humanoid",
      government: "Suliban Cabal",
      population: "12 million",
      technology_level: 9,
      warp_capable: true,
      first_contact_year: 2151,
      relations_with_federation: "Hostile",
      characteristics: {
        physiology:
          "Genetically enhanced humanoids with shape-changing abilities",
        culture: "Time-war manipulated species serving future interests",
        notable_traits: [
          "Genetic enhancement",
          "Shape-changing",
          "Temporal manipulation",
          "Advanced infiltration",
        ],
        lifespan: 150,
        telepathic: false,
      },
      military: {
        strength: 7,
        fleet_size: 200,
        preferred_tactics: "Infiltration, temporal warfare, guerrilla tactics",
        notable_weapons: [
          "Particle weapons",
          "Temporal technology",
          "Shape-changing",
        ],
      },
      diplomacy: {
        attitude: "Aggressive",
        trade_relations: 20,
        treaties: [],
      },
      abilities: {
        strength: 7,
        intelligence: 8,
        technology: 9,
        diplomacy: 4,
        adaptability: 9,
      },
      notable_individuals: ["Silik", "Temporal Agent"],
      major_conflicts: ["Temporal Cold War", "Enterprise incidents"],
      territories: ["Helix stations", "Temporal facilities"],
      special_technologies: [
        "Genetic enhancement",
        "Temporal technology",
        "Shape-changing",
      ],
    },
  ];

  const filteredRaces = alienRaces
    .filter((race) => {
      const quadrantMatch =
        filterQuadrant === "All" || race.quadrant === filterQuadrant;
      const relationsMatch =
        filterRelations === "All" ||
        race.relations_with_federation === filterRelations;
      return quadrantMatch && relationsMatch;
    })
    .sort((a, b) => {
      // Sort by relations first (Federation, Allied, Neutral, Hostile, Unknown)
      const relationOrder = {
        Member: 0,
        Allied: 1,
        Neutral: 2,
        Hostile: 3,
        Unknown: 4,
      };
      const relationDiff =
        relationOrder[a.relations_with_federation] -
        relationOrder[b.relations_with_federation];
      if (relationDiff !== 0) return relationDiff;
      // Then by name alphabetically
      return a.name.localeCompare(b.name);
    });

  const getRelationsColor = (relations: string) => {
    switch (relations) {
      case "Member":
        return "text-green-400 border-green-400 bg-green-400/20";
      case "Allied":
        return "text-blue-400 border-blue-400 bg-blue-400/20";
      case "Neutral":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Hostile":
        return "text-red-400 border-red-400 bg-red-400/20";
      case "Unknown":
        return "text-purple-400 border-purple-400 bg-purple-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  const getClassificationIcon = (classification: string) => {
    switch (classification) {
      case "Humanoid":
        return <Users className="w-5 h-5" />;
      case "Silicon-based":
        return <Globe className="w-5 h-5" />;
      case "Energy Being":
        return <Zap className="w-5 h-5" />;
      case "Crystalline":
        return <Star className="w-5 h-5" />;
      case "Cybernetic":
        return <Brain className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          GALACTIC SPECIES DATABASE
        </h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "overview" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "overview"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("overview")}
          >
            <Database className="w-4 h-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeTab === "details" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "details"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("details")}
          >
            <Search className="w-4 h-4 mr-2" />
            Details
          </Button>
          <Button
            variant={activeTab === "relations" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "relations"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("relations")}
          >
            <HeartHandshake className="w-4 h-4 mr-2" />
            Relations
          </Button>
          <Button
            variant={activeTab === "military" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "military"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("military")}
          >
            <Shield className="w-4 h-4 mr-2" />
            Military
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-trek-text/70">Quadrant:</span>
          <div className="flex gap-1">
            {["All", "Alpha", "Beta", "Gamma", "Delta"].map((quadrant) => (
              <Button
                key={quadrant}
                variant={filterQuadrant === quadrant ? "default" : "outline"}
                size="sm"
                className={
                  filterQuadrant === quadrant
                    ? "bg-trek-blue text-trek-dark"
                    : "border-trek-accent text-trek-text hover:bg-trek-accent"
                }
                onClick={() => setFilterQuadrant(quadrant)}
              >
                {quadrant}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-trek-text/70">Relations:</span>
          <div className="flex gap-1">
            {["All", "Member", "Allied", "Neutral", "Hostile"].map(
              (relation) => (
                <Button
                  key={relation}
                  variant={filterRelations === relation ? "default" : "outline"}
                  size="sm"
                  className={
                    filterRelations === relation
                      ? "bg-trek-blue text-trek-dark"
                      : "border-trek-accent text-trek-text hover:bg-trek-accent"
                  }
                  onClick={() => setFilterRelations(relation)}
                >
                  {relation}
                </Button>
              ),
            )}
          </div>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {filteredRaces.map((race) => (
              <Card
                key={race.id}
                className={`bg-trek-panel border-trek-accent p-4 cursor-pointer transition-colors hover:border-trek-blue ${
                  selectedRace?.id === race.id
                    ? "border-trek-blue bg-trek-blue/5"
                    : ""
                }`}
                onClick={() => setSelectedRace(race)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-trek-gold text-xl">
                      {getClassificationIcon(race.classification)}
                    </span>
                    <div>
                      <h3 className="font-bold text-trek-gold text-lg">
                        {race.name}
                      </h3>
                      <p className="text-trek-blue text-sm">{race.homeworld}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className="text-xs border-trek-accent text-trek-text"
                        >
                          {race.quadrant} Quadrant
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getRelationsColor(race.relations_with_federation)}`}
                        >
                          {race.relations_with_federation}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-sm">
                    <div className="text-trek-text/70">Tech Level</div>
                    <div className="text-trek-blue font-semibold">
                      {race.technology_level}/10
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-trek-text/70">Population</div>
                    <div className="text-trek-blue">{race.population}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-trek-text/70">Government</div>
                    <div className="text-trek-blue text-xs">
                      {race.government}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-trek-text/70">First Contact</div>
                    <div className="text-trek-gold">
                      {race.first_contact_year}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {selectedRace && (
            <Card className="bg-trek-panel border-trek-blue p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-trek-gold text-2xl">
                  {getClassificationIcon(selectedRace.classification)}
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-trek-gold">
                    {selectedRace.name}
                  </h3>
                  <p className="text-trek-blue">
                    {selectedRace.homeworld} • {selectedRace.quadrant} Quadrant
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Physiology
                  </h4>
                  <p className="text-sm text-trek-text/80">
                    {selectedRace.characteristics.physiology}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">Culture</h4>
                  <p className="text-sm text-trek-text/80">
                    {selectedRace.characteristics.culture}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-trek-text/70 text-sm">Population</div>
                    <div className="text-trek-blue font-semibold">
                      {selectedRace.population}
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">Lifespan</div>
                    <div className="text-trek-blue font-semibold">
                      {selectedRace.characteristics.lifespan > 0
                        ? `${selectedRace.characteristics.lifespan} years`
                        : "Variable"}
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">Government</div>
                    <div className="text-trek-blue font-semibold">
                      {selectedRace.government}
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      First Contact
                    </div>
                    <div className="text-trek-gold font-semibold">
                      {selectedRace.first_contact_year}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Notable Traits
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedRace.characteristics.notable_traits.map(
                      (trait, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs border-trek-accent text-trek-text"
                        >
                          {trait}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Racial Abilities
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Strength</span>
                        <span className="text-red-400">
                          {selectedRace.abilities.strength}/10
                        </span>
                      </div>
                      <Progress
                        value={selectedRace.abilities.strength * 10}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Intelligence</span>
                        <span className="text-blue-400">
                          {selectedRace.abilities.intelligence}/10
                        </span>
                      </div>
                      <Progress
                        value={selectedRace.abilities.intelligence * 10}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Technology</span>
                        <span className="text-purple-400">
                          {selectedRace.abilities.technology}/10
                        </span>
                      </div>
                      <Progress
                        value={selectedRace.abilities.technology * 10}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Diplomacy</span>
                        <span className="text-green-400">
                          {selectedRace.abilities.diplomacy}/10
                        </span>
                      </div>
                      <Progress
                        value={selectedRace.abilities.diplomacy * 10}
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Notable Individuals
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedRace.notable_individuals.map((individual, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs border-trek-gold text-trek-gold"
                      >
                        {individual}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Additional tabs would go here */}
    </div>
  );
}
