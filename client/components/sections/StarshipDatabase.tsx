import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Rocket,
  Shield,
  Zap,
  Users,
  Settings,
  Star,
  Crown,
  Award,
  Target,
  Navigation,
  Radar,
  Wrench,
  Clock,
  TrendingUp,
  Database,
  Ship,
} from "lucide-react";

interface StarshipClass {
  id: string;
  name: string;
  type:
    | "Exploration"
    | "Tactical"
    | "Science"
    | "Support"
    | "Flagship"
    | "Dreadnought"
    | "Escort"
    | "Mothership"
    | "Battlecruiser"
    | "Destroyer"
    | "Frigate";
  size: "Small" | "Medium" | "Large" | "Massive";
  era: "TOS" | "TNG" | "DS9" | "VOY" | "ENT" | "DIS" | "PIC";
  specifications: {
    length: number;
    crew_capacity: number;
    max_warp: number;
    armament_rating: number;
    defensive_rating: number;
    science_rating: number;
    diplomatic_rating: number;
  };
  special_systems: string[];
  description: string;
  construction_time_days: number;
  resource_cost: {
    duranium: number;
    tritanium: number;
    dilithium: number;
    bioneural_gel: number;
  };
  variants?: string[];
}

interface Starship {
  id: string;
  name: string;
  registry: string;
  class_id: string;
  captain: string;
  status:
    | "Active"
    | "In Dock"
    | "Under Construction"
    | "Destroyed"
    | "Missing"
    | "Decommissioned";
  location: string;
  condition: "Excellent" | "Good" | "Fair" | "Poor" | "Critical";
  hull_integrity: number;
  crew_complement: number;
  max_crew: number;
  last_refit: string;
  mission_history: string[];
  current_assignment: string;
  upgrades: string[];
  combat_rating: number;
  is_flagship: boolean;
  fleet_assignment?: string;
}

interface Fleet {
  id: string;
  name: string;
  flagship_id: string;
  ships: string[];
  commander: string;
  formation: "Line" | "Wedge" | "Sphere" | "Diamond" | "Wall";
  mission_type: "Exploration" | "Defense" | "Assault" | "Patrol" | "Diplomatic";
  area_of_operations: string;
  status: "Assembled" | "Dispersed" | "In Transit" | "Engaged" | "Standby";
  coordination_efficiency: number;
}

interface StarshipDatabaseProps {
  activeSubmenu?: string;
}

export function StarshipDatabase({ activeSubmenu }: StarshipDatabaseProps) {
  const normalizeSubmenu = (submenu?: string) => {
    const map: Record<string, "classes" | "ships" | "fleets" | "construction"> =
      {
        active: "ships",
        decommissioned: "ships",
        ships: "ships",
        classes: "classes",
        fleets: "fleets",
        construction: "construction",
      };
    if (!submenu) return "classes";
    return map[submenu] || "classes";
  };

  const [activeTab, setActiveTab] = useState<
    "classes" | "ships" | "fleets" | "construction"
  >(normalizeSubmenu(activeSubmenu));

  useEffect(() => {
    setActiveTab(normalizeSubmenu(activeSubmenu));
  }, [activeSubmenu]);
  const [selectedClass, setSelectedClass] = useState<StarshipClass | null>(
    null,
  );
  const [selectedShip, setSelectedShip] = useState<Starship | null>(null);
  const [selectedFleet, setSelectedFleet] = useState<Fleet | null>(null);

  const starshipClasses: StarshipClass[] = [
    {
      id: "constitution",
      name: "Constitution Class",
      type: "Exploration",
      size: "Large",
      era: "TOS",
      specifications: {
        length: 289,
        crew_capacity: 430,
        max_warp: 8.0,
        armament_rating: 7,
        defensive_rating: 6,
        science_rating: 8,
        diplomatic_rating: 9,
      },
      special_systems: [
        "Duotronic Computer",
        "Original Enterprise Design",
        "Heavy Phaser Arrays",
      ],
      description:
        "The legendary Constitution-class represents the pinnacle of 23rd-century starship design, built for deep space exploration and first contact missions.",
      construction_time_days: 1460,
      resource_cost: {
        duranium: 15000,
        tritanium: 8000,
        dilithium: 500,
        bioneural_gel: 0,
      },
      variants: ["Constitution Refit", "Enterprise Class"],
    },
    {
      id: "galaxy",
      name: "Galaxy Class",
      type: "Exploration",
      size: "Massive",
      era: "TNG",
      specifications: {
        length: 641,
        crew_capacity: 1012,
        max_warp: 9.6,
        armament_rating: 9,
        defensive_rating: 9,
        science_rating: 10,
        diplomatic_rating: 10,
      },
      special_systems: [
        "Saucer Separation",
        "Families Aboard",
        "Advanced Sensors",
        "Diplomatic Facilities",
      ],
      description:
        "The flagship of Starfleet's deep space exploration fleet, designed for extended missions with families aboard and unparalleled scientific capabilities.",
      construction_time_days: 2920,
      resource_cost: {
        duranium: 45000,
        tritanium: 25000,
        dilithium: 2000,
        bioneural_gel: 500,
      },
      variants: ["Galaxy Refit", "Venture Class", "Galaxy Dreadnought"],
    },
    {
      id: "intrepid",
      name: "Intrepid Class",
      type: "Science",
      size: "Medium",
      era: "VOY",
      specifications: {
        length: 344,
        crew_capacity: 150,
        max_warp: 9.975,
        armament_rating: 7,
        defensive_rating: 7,
        science_rating: 9,
        diplomatic_rating: 7,
      },
      special_systems: [
        "Variable Geometry Warp Nacelles",
        "Advanced Astrometrics",
        "Bio-neural Gel Packs",
        "Landing Capability",
      ],
      description:
        "Advanced long-range explorer designed for extended missions beyond Federation space with cutting-edge propulsion and scientific systems.",
      construction_time_days: 1825,
      resource_cost: {
        duranium: 22000,
        tritanium: 15000,
        dilithium: 1200,
        bioneural_gel: 800,
      },
      variants: ["Intrepid Refit", "Bellerophon Class"],
    },
    {
      id: "defiant",
      name: "Defiant Class",
      type: "Escort",
      size: "Small",
      era: "DS9",
      specifications: {
        length: 170,
        crew_capacity: 50,
        max_warp: 9.5,
        armament_rating: 10,
        defensive_rating: 8,
        science_rating: 4,
        diplomatic_rating: 2,
      },
      special_systems: [
        "Pulse Phaser Cannons",
        "Quantum Torpedoes",
        "Ablative Armor",
        "Cloaking Device",
      ],
      description:
        "Starfleet's first pure warship, designed specifically to combat the Borg threat with maximum firepower in a compact frame.",
      construction_time_days: 730,
      resource_cost: {
        duranium: 8000,
        tritanium: 12000,
        dilithium: 800,
        bioneural_gel: 200,
      },
      variants: ["Defiant Refit", "Sao Paulo Class", "Vigilant Class"],
    },
    {
      id: "sovereign",
      name: "Sovereign Class",
      type: "Flagship",
      size: "Large",
      era: "TNG",
      specifications: {
        length: 685,
        crew_capacity: 855,
        max_warp: 9.7,
        armament_rating: 10,
        defensive_rating: 10,
        science_rating: 9,
        diplomatic_rating: 9,
      },
      special_systems: [
        "Quantum Torpedoes",
        "Advanced Shields",
        "Emergency Holographic Program",
        "Advanced Diplomatic Suites",
      ],
      description:
        "The newest generation flagship combining the best of exploration and tactical capabilities, representing Starfleet's finest engineering.",
      construction_time_days: 2555,
      resource_cost: {
        duranium: 38000,
        tritanium: 28000,
        dilithium: 1800,
        bioneural_gel: 1000,
      },
      variants: ["Sovereign Refit", "Imperial Class"],
    },
    {
      id: "odyssey",
      name: "Odyssey Class",
      type: "Mothership",
      size: "Massive",
      era: "PIC",
      specifications: {
        length: 1061,
        crew_capacity: 2500,
        max_warp: 9.97,
        armament_rating: 10,
        defensive_rating: 10,
        science_rating: 10,
        diplomatic_rating: 10,
      },
      special_systems: [
        "Aquarius Escort",
        "Saucer Separation",
        "Advanced Fleet Coordination",
        "Mobile Command Center",
        "Fighter Bay",
      ],
      description:
        "The ultimate expression of Federation engineering - a mobile starbase capable of supporting entire fleets and serving as a command center.",
      construction_time_days: 3650,
      resource_cost: {
        duranium: 80000,
        tritanium: 50000,
        dilithium: 5000,
        bioneural_gel: 2000,
      },
      variants: ["Odyssey Command", "Odyssey Science", "Odyssey Tactical"],
    },
    {
      id: "universe",
      name: "Universe Class",
      type: "Dreadnought",
      size: "Massive",
      era: "PIC",
      specifications: {
        length: 1607,
        crew_capacity: 15000,
        max_warp: 9.99,
        armament_rating: 10,
        defensive_rating: 10,
        science_rating: 10,
        diplomatic_rating: 8,
      },
      special_systems: [
        "Multi-Vector Assault Mode",
        "Planetary Defense Systems",
        "Advanced Shipyard",
        "Fleet Command & Control",
      ],
      description:
        "The largest starship ever constructed by the Federation, essentially a mobile starbase with unprecedented capabilities.",
      construction_time_days: 5475,
      resource_cost: {
        duranium: 150000,
        tritanium: 100000,
        dilithium: 10000,
        bioneural_gel: 5000,
      },
      variants: ["Universe Command", "Universe Carrier"],
    },
    {
      id: "akira",
      name: "Akira Class",
      type: "Tactical",
      size: "Large",
      era: "DS9",
      specifications: {
        length: 464,
        crew_capacity: 500,
        max_warp: 9.8,
        armament_rating: 9,
        defensive_rating: 8,
        science_rating: 6,
        diplomatic_rating: 5,
      },
      special_systems: [
        "Fighter Hangar Bay",
        "Heavy Torpedo Launchers",
        "Enhanced Tactical Systems",
      ],
      description:
        "Heavy cruiser designed for fleet actions with extensive fighter support capabilities and heavy armament.",
      construction_time_days: 1460,
      resource_cost: {
        duranium: 25000,
        tritanium: 18000,
        dilithium: 1000,
        bioneural_gel: 400,
      },
    },
    {
      id: "prometheus",
      name: "Prometheus Class",
      type: "Tactical",
      size: "Medium",
      era: "VOY",
      specifications: {
        length: 415,
        crew_capacity: 141,
        max_warp: 9.9,
        armament_rating: 10,
        defensive_rating: 8,
        science_rating: 7,
        diplomatic_rating: 4,
      },
      special_systems: [
        "Multi-Vector Assault Mode",
        "Emergency Medical Hologram",
        "Regenerative Hull Armor",
      ],
      description:
        "Advanced tactical vessel capable of separating into three independent fighting units for maximum combat effectiveness.",
      construction_time_days: 1095,
      resource_cost: {
        duranium: 20000,
        tritanium: 16000,
        dilithium: 1200,
        bioneural_gel: 600,
      },
    },
    // TOS Era Ships
    {
      id: "excelsior",
      name: "Excelsior Class",
      type: "Exploration",
      size: "Large",
      era: "TOS",
      specifications: {
        length: 467,
        crew_capacity: 750,
        max_warp: 8.0,
        armament_rating: 8,
        defensive_rating: 8,
        science_rating: 7,
        diplomatic_rating: 8,
      },
      special_systems: [
        "Transwarp Drive (experimental)",
        "Enhanced Sensor Arrays",
        "Long-Range Communications",
      ],
      description:
        "Advanced heavy cruiser designed as successor to Constitution-class, featuring experimental transwarp technology.",
      construction_time_days: 2190,
      resource_cost: {
        duranium: 35000,
        tritanium: 20000,
        dilithium: 1500,
        bioneural_gel: 0,
      },
      variants: ["Excelsior Refit", "Enterprise-B Class"],
    },
    {
      id: "miranda",
      name: "Miranda Class",
      type: "Support",
      size: "Medium",
      era: "TOS",
      specifications: {
        length: 243,
        crew_capacity: 220,
        max_warp: 8.0,
        armament_rating: 6,
        defensive_rating: 6,
        science_rating: 7,
        diplomatic_rating: 6,
      },
      special_systems: [
        "Multi-Role Configuration",
        "Science Laboratory Modules",
        "Cargo Transport Capability",
      ],
      description:
        "Versatile medium cruiser designed for scientific missions, transport duties, and patrol operations.",
      construction_time_days: 1095,
      resource_cost: {
        duranium: 18000,
        tritanium: 12000,
        dilithium: 800,
        bioneural_gel: 0,
      },
      variants: ["Miranda Refit", "Reliant Class", "Saratoga Class"],
    },
    {
      id: "oberth",
      name: "Oberth Class",
      type: "Science",
      size: "Small",
      era: "TOS",
      specifications: {
        length: 120,
        crew_capacity: 80,
        max_warp: 6.0,
        armament_rating: 3,
        defensive_rating: 4,
        science_rating: 9,
        diplomatic_rating: 5,
      },
      special_systems: [
        "Advanced Sensor Pod",
        "Scientific Equipment Bay",
        "Research Laboratories",
      ],
      description:
        "Dedicated science vessel with advanced sensor capabilities and research facilities for scientific exploration.",
      construction_time_days: 730,
      resource_cost: {
        duranium: 8000,
        tritanium: 6000,
        dilithium: 400,
        bioneural_gel: 0,
      },
      variants: ["Oberth Refit", "Grissom Class"],
    },
    // TNG Era Ships
    {
      id: "ambassador",
      name: "Ambassador Class",
      type: "Exploration",
      size: "Large",
      era: "TNG",
      specifications: {
        length: 526,
        crew_capacity: 700,
        max_warp: 9.2,
        armament_rating: 8,
        defensive_rating: 8,
        science_rating: 8,
        diplomatic_rating: 9,
      },
      special_systems: [
        "Advanced Diplomatic Facilities",
        "Long-Range Sensors",
        "Multi-Mission Capability",
      ],
      description:
        "Heavy cruiser serving as bridge between Excelsior and Galaxy-class designs, excelling in diplomatic missions.",
      construction_time_days: 2555,
      resource_cost: {
        duranium: 32000,
        tritanium: 22000,
        dilithium: 1400,
        bioneural_gel: 200,
      },
      variants: ["Ambassador Refit", "Yamaguchi Class"],
    },
    {
      id: "nebula",
      name: "Nebula Class",
      type: "Exploration",
      size: "Large",
      era: "TNG",
      specifications: {
        length: 442,
        crew_capacity: 750,
        max_warp: 9.6,
        armament_rating: 8,
        defensive_rating: 8,
        science_rating: 9,
        diplomatic_rating: 8,
      },
      special_systems: [
        "Modular Mission Pod",
        "Galaxy-Class Technology",
        "Configurable Systems",
      ],
      description:
        "Smaller cousin to Galaxy-class with modular mission pod allowing specialization for various mission types.",
      construction_time_days: 2190,
      resource_cost: {
        duranium: 28000,
        tritanium: 20000,
        dilithium: 1300,
        bioneural_gel: 400,
      },
      variants: ["Nebula Refit", "Phoenix Class", "Bonchune Class"],
    },
    // DS9 Era Ships
    {
      id: "steamrunner",
      name: "Steamrunner Class",
      type: "Tactical",
      size: "Medium",
      era: "DS9",
      specifications: {
        length: 310,
        crew_capacity: 200,
        max_warp: 9.5,
        armament_rating: 8,
        defensive_rating: 7,
        science_rating: 5,
        diplomatic_rating: 4,
      },
      special_systems: [
        "Heavy Armament",
        "Rapid Deployment",
        "Combat Maneuvering",
      ],
      description:
        "Fast attack cruiser designed for rapid deployment and heavy combat operations during the Dominion War.",
      construction_time_days: 1095,
      resource_cost: {
        duranium: 20000,
        tritanium: 16000,
        dilithium: 1100,
        bioneural_gel: 300,
      },
    },
    {
      id: "saber",
      name: "Saber Class",
      type: "Escort",
      size: "Small",
      era: "DS9",
      specifications: {
        length: 190,
        crew_capacity: 40,
        max_warp: 9.3,
        armament_rating: 7,
        defensive_rating: 6,
        science_rating: 4,
        diplomatic_rating: 3,
      },
      special_systems: [
        "Compact Design",
        "High Maneuverability",
        "Rapid Response",
      ],
      description:
        "Light cruiser designed for patrol duties and rapid response missions with emphasis on speed and agility.",
      construction_time_days: 730,
      resource_cost: {
        duranium: 12000,
        tritanium: 10000,
        dilithium: 700,
        bioneural_gel: 200,
      },
    },
    {
      id: "norway",
      name: "Norway Class",
      type: "Support",
      size: "Medium",
      era: "DS9",
      specifications: {
        length: 364,
        crew_capacity: 190,
        max_warp: 9.1,
        armament_rating: 6,
        defensive_rating: 7,
        science_rating: 6,
        diplomatic_rating: 7,
      },
      special_systems: [
        "Multi-Mission Pod",
        "Enhanced Shields",
        "Long-Range Capability",
      ],
      description:
        "Versatile cruiser designed for extended independent operations with good defensive capabilities.",
      construction_time_days: 1460,
      resource_cost: {
        duranium: 24000,
        tritanium: 17000,
        dilithium: 1000,
        bioneural_gel: 400,
      },
    },
    // VOY Era Ships
    {
      id: "luna",
      name: "Luna Class",
      type: "Science",
      size: "Medium",
      era: "VOY",
      specifications: {
        length: 454,
        crew_capacity: 350,
        max_warp: 9.8,
        armament_rating: 6,
        defensive_rating: 7,
        science_rating: 10,
        diplomatic_rating: 8,
      },
      special_systems: [
        "Advanced Sensor Arrays",
        "Quantum Slipstream Drive",
        "Scientific Mission Pod",
      ],
      description:
        "Next-generation science vessel incorporating technology from Voyager's Delta Quadrant journey.",
      construction_time_days: 1825,
      resource_cost: {
        duranium: 26000,
        tritanium: 18000,
        dilithium: 1300,
        bioneural_gel: 800,
      },
      variants: ["Luna Refit", "Titan Class"],
    },
    {
      id: "nova",
      name: "Nova Class",
      type: "Science",
      size: "Small",
      era: "VOY",
      specifications: {
        length: 180,
        crew_capacity: 80,
        max_warp: 8.0,
        armament_rating: 4,
        defensive_rating: 5,
        science_rating: 8,
        diplomatic_rating: 6,
      },
      special_systems: [
        "Planetary Landing Capability",
        "Advanced Science Labs",
        "Emergency Medical Hologram",
      ],
      description:
        "Compact science vessel designed for planetary surveys and short-range scientific missions.",
      construction_time_days: 730,
      resource_cost: {
        duranium: 10000,
        tritanium: 8000,
        dilithium: 600,
        bioneural_gel: 300,
      },
      variants: ["Rhode Island Class"],
    },
    // ENT Era Ships
    {
      id: "nx",
      name: "NX Class",
      type: "Exploration",
      size: "Medium",
      era: "ENT",
      specifications: {
        length: 225,
        crew_capacity: 83,
        max_warp: 5.2,
        armament_rating: 5,
        defensive_rating: 4,
        science_rating: 6,
        diplomatic_rating: 7,
      },
      special_systems: [
        "Polarized Hull Plating",
        "Phase Cannons",
        "Grappler Arms",
        "Decontamination Chamber",
      ],
      description:
        "Earth's first true deep space exploration vessel, representing humanity's entry into interstellar exploration.",
      construction_time_days: 2190,
      resource_cost: {
        duranium: 15000,
        tritanium: 10000,
        dilithium: 200,
        bioneural_gel: 0,
      },
      variants: ["NX Refit", "Columbia Class"],
    },
    // DIS Era Ships
    {
      id: "crossfield",
      name: "Crossfield Class",
      type: "Science",
      size: "Large",
      era: "DIS",
      specifications: {
        length: 750,
        crew_capacity: 136,
        max_warp: 9.0,
        armament_rating: 7,
        defensive_rating: 7,
        science_rating: 10,
        diplomatic_rating: 6,
      },
      special_systems: [
        "Spore Displacement Hub",
        "Tardigrade Navigation",
        "Black Alert System",
        "Rotating Saucer Section",
      ],
      description:
        "Experimental science vessel equipped with revolutionary spore drive technology for instantaneous travel.",
      construction_time_days: 2555,
      resource_cost: {
        duranium: 40000,
        tritanium: 30000,
        dilithium: 2000,
        bioneural_gel: 1000,
      },
      variants: ["Discovery Class", "Glenn Class"],
    },
    {
      id: "walker",
      name: "Walker Class",
      type: "Support",
      size: "Medium",
      era: "DIS",
      specifications: {
        length: 200,
        crew_capacity: 200,
        max_warp: 7.0,
        armament_rating: 6,
        defensive_rating: 6,
        science_rating: 6,
        diplomatic_rating: 7,
      },
      special_systems: [
        "Multi-Mission Configuration",
        "Enhanced Communications",
        "Modular Design",
      ],
      description:
        "Reliable workhorse vessel serving as backbone of 23rd-century Starfleet operations.",
      construction_time_days: 1460,
      resource_cost: {
        duranium: 18000,
        tritanium: 14000,
        dilithium: 800,
        bioneural_gel: 0,
      },
      variants: ["Shenzhou Class"],
    },
    // PIC Era Ships
    {
      id: "inquiry",
      name: "Inquiry Class",
      type: "Battlecruiser",
      size: "Large",
      era: "PIC",
      specifications: {
        length: 694,
        crew_capacity: 800,
        max_warp: 9.8,
        armament_rating: 9,
        defensive_rating: 9,
        science_rating: 7,
        diplomatic_rating: 6,
      },
      special_systems: [
        "Heavy Quantum Torpedoes",
        "Enhanced Tactical Systems",
        "Advanced Shield Grid",
      ],
      description:
        "Heavy battlecruiser designed for major fleet actions and defense of core Federation worlds.",
      construction_time_days: 2920,
      resource_cost: {
        duranium: 45000,
        tritanium: 32000,
        dilithium: 2200,
        bioneural_gel: 1200,
      },
    },
  ];

  const starships: Starship[] = [
    {
      id: "enterprise_d",
      name: "U.S.S. Enterprise",
      registry: "NCC-1701-D",
      class_id: "galaxy",
      captain: "Jean-Luc Picard",
      status: "Active",
      location: "Sector 001",
      condition: "Excellent",
      hull_integrity: 100,
      crew_complement: 1012,
      max_crew: 1012,
      last_refit: "2024-01-01",
      mission_history: [
        "First Contact Missions",
        "Diplomatic Negotiations",
        "Scientific Surveys",
      ],
      current_assignment: "Deep Space Exploration",
      upgrades: ["Enhanced Sensors", "Upgraded Shields", "Improved Warp Coils"],
      combat_rating: 9.2,
      is_flagship: true,
      fleet_assignment: "exploration_fleet_alpha",
    },
    {
      id: "voyager",
      name: "U.S.S. Voyager",
      registry: "NCC-74656",
      class_id: "intrepid",
      captain: "Kathryn Janeway",
      status: "Active",
      location: "Delta Quadrant",
      condition: "Good",
      hull_integrity: 95,
      crew_complement: 150,
      max_crew: 150,
      last_refit: "2023-12-15",
      mission_history: [
        "Delta Quadrant Exploration",
        "Borg Encounters",
        "Time Travel Incidents",
      ],
      current_assignment: "Long Range Exploration",
      upgrades: [
        "Ablative Armor",
        "Transphasic Torpedoes",
        "Advanced Astrometrics",
      ],
      combat_rating: 8.7,
      is_flagship: false,
      fleet_assignment: "deep_space_nine",
    },
    {
      id: "defiant_ds9",
      name: "U.S.S. Defiant",
      registry: "NX-74205",
      class_id: "defiant",
      captain: "Benjamin Sisko",
      status: "Active",
      location: "Deep Space Nine",
      condition: "Good",
      hull_integrity: 98,
      crew_complement: 47,
      max_crew: 50,
      last_refit: "2024-01-10",
      mission_history: [
        "Dominion War",
        "Border Patrol",
        "Anti-Borg Operations",
      ],
      current_assignment: "Station Defense",
      upgrades: ["Cloaking Device", "Enhanced Weapons", "Reinforced Hull"],
      combat_rating: 9.8,
      is_flagship: false,
      fleet_assignment: "tactical_fleet_beta",
    },
    {
      id: "enterprise_e",
      name: "U.S.S. Enterprise",
      registry: "NCC-1701-E",
      class_id: "sovereign",
      captain: "Jean-Luc Picard",
      status: "Active",
      location: "Sector 001",
      condition: "Excellent",
      hull_integrity: 100,
      crew_complement: 855,
      max_crew: 855,
      last_refit: "2024-01-05",
      mission_history: [
        "Borg Encounters",
        "Diplomatic Missions",
        "Romulan Incidents",
      ],
      current_assignment: "Flagship Operations",
      upgrades: [
        "Quantum Torpedoes",
        "Enhanced Warp Core",
        "Advanced Tactical Systems",
      ],
      combat_rating: 9.8,
      is_flagship: true,
      fleet_assignment: "command_fleet_alpha",
    },
    {
      id: "odyssey_flagship",
      name: "U.S.S. Odyssey",
      registry: "NCC-97000",
      class_id: "odyssey",
      captain: "Rachel Garrett",
      status: "Active",
      location: "Deep Space",
      condition: "Excellent",
      hull_integrity: 100,
      crew_complement: 2500,
      max_crew: 2500,
      last_refit: "2024-01-01",
      mission_history: [
        "Fleet Command Operations",
        "Border Defense",
        "Deep Space Exploration",
      ],
      current_assignment: "Fleet Command",
      upgrades: [
        "Advanced Fleet Coordination",
        "Enhanced Fighter Wings",
        "Mobile Shipyard",
      ],
      combat_rating: 10.0,
      is_flagship: true,
      fleet_assignment: "command_fleet_alpha",
    },
  ];

  const fleets: Fleet[] = [
    {
      id: "exploration_fleet_alpha",
      name: "Exploration Fleet Alpha",
      flagship_id: "enterprise_d",
      ships: [
        "enterprise_d",
        "voyager",
        "science_vessel_1",
        "science_vessel_2",
      ],
      commander: "Admiral Jean-Luc Picard",
      formation: "Line",
      mission_type: "Exploration",
      area_of_operations: "Beta Quadrant",
      status: "Assembled",
      coordination_efficiency: 95,
    },
    {
      id: "tactical_fleet_beta",
      name: "Tactical Fleet Beta",
      flagship_id: "defiant_ds9",
      ships: ["defiant_ds9", "akira_1", "akira_2", "prometheus_1"],
      commander: "Admiral William Riker",
      formation: "Wedge",
      mission_type: "Defense",
      area_of_operations: "Cardassian Border",
      status: "Patrol",
      coordination_efficiency: 88,
    },
    {
      id: "command_fleet_alpha",
      name: "Command Fleet Alpha",
      flagship_id: "odyssey_flagship",
      ships: [
        "odyssey_flagship",
        "enterprise_e",
        "sovereign_2",
        "galaxy_1",
        "galaxy_2",
      ],
      commander: "Fleet Admiral Kathryn Janeway",
      formation: "Sphere",
      mission_type: "Diplomatic",
      area_of_operations: "Neutral Zone",
      status: "Standby",
      coordination_efficiency: 97,
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Exploration":
        return "text-blue-400 border-blue-400 bg-blue-400/20";
      case "Tactical":
        return "text-red-400 border-red-400 bg-red-400/20";
      case "Science":
        return "text-purple-400 border-purple-400 bg-purple-400/20";
      case "Support":
        return "text-green-400 border-green-400 bg-green-400/20";
      case "Flagship":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Dreadnought":
        return "text-orange-400 border-orange-400 bg-orange-400/20";
      case "Escort":
        return "text-red-500 border-red-500 bg-red-500/20";
      case "Mothership":
        return "text-purple-500 border-purple-500 bg-purple-500/20";
      case "Battlecruiser":
        return "text-red-600 border-red-600 bg-red-600/20";
      case "Destroyer":
        return "text-orange-500 border-orange-500 bg-orange-500/20";
      case "Frigate":
        return "text-yellow-500 border-yellow-500 bg-yellow-500/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  const getSizeColor = (size: string) => {
    switch (size) {
      case "Small":
        return "text-green-400";
      case "Medium":
        return "text-yellow-400";
      case "Large":
        return "text-orange-400";
      case "Massive":
        return "text-red-400";
      default:
        return "text-trek-blue";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-400 border-green-400 bg-green-400/20";
      case "In Dock":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Under Construction":
        return "text-blue-400 border-blue-400 bg-blue-400/20";
      case "Destroyed":
        return "text-red-500 border-red-500 bg-red-500/20";
      case "Missing":
        return "text-purple-400 border-purple-400 bg-purple-400/20";
      case "Decommissioned":
        return "text-gray-400 border-gray-400 bg-gray-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          STARSHIP DATABASE
        </h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "classes" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "classes"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("classes")}
          >
            <Database className="w-4 h-4 mr-2" />
            Ship Classes
          </Button>
          <Button
            variant={activeTab === "ships" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "ships"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("ships")}
          >
            <Ship className="w-4 h-4 mr-2" />
            Active Ships
          </Button>
          <Button
            variant={activeTab === "fleets" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "fleets"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("fleets")}
          >
            <Crown className="w-4 h-4 mr-2" />
            Fleet Command
          </Button>
          <Button
            variant={activeTab === "construction" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "construction"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("construction")}
          >
            <Wrench className="w-4 h-4 mr-2" />
            Shipyard
          </Button>
        </div>
      </div>

      {activeTab === "classes" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {starshipClasses.map((shipClass) => (
              <Card
                key={shipClass.id}
                className={`bg-trek-panel border-trek-accent p-4 cursor-pointer transition-colors hover:border-trek-blue ${
                  selectedClass?.id === shipClass.id
                    ? "border-trek-blue bg-trek-blue/5"
                    : ""
                }`}
                onClick={() => setSelectedClass(shipClass)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-trek-gold text-lg">
                      {shipClass.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getTypeColor(shipClass.type)}`}
                      >
                        {shipClass.type}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`text-xs border-trek-accent text-${getSizeColor(shipClass.size).split("-")[1]}`}
                      >
                        {shipClass.size}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-xs border-trek-gold text-trek-gold"
                      >
                        {shipClass.era}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-right text-sm">
                    <div className="text-trek-text/70">Length</div>
                    <div className="text-trek-blue font-semibold">
                      {shipClass.specifications.length}m
                    </div>
                  </div>
                </div>

                <p className="text-sm text-trek-text/80 mb-3">
                  {shipClass.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Crew:</span>
                    <span className="text-trek-blue">
                      {shipClass.specifications.crew_capacity.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Max Warp:</span>
                    <span className="text-trek-blue">
                      {shipClass.specifications.max_warp}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Weapons:</span>
                    <span className="text-trek-warning">
                      {shipClass.specifications.armament_rating}/10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Shields:</span>
                    <span className="text-trek-blue">
                      {shipClass.specifications.defensive_rating}/10
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {selectedClass && (
            <Card className="bg-trek-panel border-trek-blue p-6">
              <div className="flex items-center gap-3 mb-4">
                <Rocket className="w-8 h-8 text-trek-gold" />
                <div>
                  <h3 className="text-2xl font-bold text-trek-gold">
                    {selectedClass.name}
                  </h3>
                  <p className="text-trek-blue">
                    {selectedClass.type} • {selectedClass.era} Era
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-trek-text/70 text-sm">Length</div>
                      <div className="text-trek-blue font-semibold">
                        {selectedClass.specifications.length} meters
                      </div>
                    </div>
                    <div>
                      <div className="text-trek-text/70 text-sm">
                        Crew Capacity
                      </div>
                      <div className="text-trek-blue font-semibold">
                        {selectedClass.specifications.crew_capacity.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-trek-text/70 text-sm">
                        Maximum Warp
                      </div>
                      <div className="text-trek-blue font-semibold">
                        Warp {selectedClass.specifications.max_warp}
                      </div>
                    </div>
                    <div>
                      <div className="text-trek-text/70 text-sm">
                        Construction Time
                      </div>
                      <div className="text-trek-blue font-semibold">
                        {Math.round(selectedClass.construction_time_days / 365)}{" "}
                        years
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Combat Ratings
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Armament</span>
                        <span className="text-trek-warning">
                          {selectedClass.specifications.armament_rating}/10
                        </span>
                      </div>
                      <Progress
                        value={
                          selectedClass.specifications.armament_rating * 10
                        }
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Defensive Systems</span>
                        <span className="text-trek-blue">
                          {selectedClass.specifications.defensive_rating}/10
                        </span>
                      </div>
                      <Progress
                        value={
                          selectedClass.specifications.defensive_rating * 10
                        }
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Science Capability</span>
                        <span className="text-purple-400">
                          {selectedClass.specifications.science_rating}/10
                        </span>
                      </div>
                      <Progress
                        value={selectedClass.specifications.science_rating * 10}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Diplomatic Facilities</span>
                        <span className="text-green-400">
                          {selectedClass.specifications.diplomatic_rating}/10
                        </span>
                      </div>
                      <Progress
                        value={
                          selectedClass.specifications.diplomatic_rating * 10
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Special Systems
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedClass.special_systems.map((system, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs border-trek-accent text-trek-text"
                      >
                        {system}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Construction Resources
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Duranium:</span>
                      <span className="text-trek-blue">
                        {selectedClass.resource_cost.duranium.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Tritanium:</span>
                      <span className="text-trek-blue">
                        {selectedClass.resource_cost.tritanium.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Dilithium:</span>
                      <span className="text-trek-gold">
                        {selectedClass.resource_cost.dilithium.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Bio-neural Gel:</span>
                      <span className="text-purple-400">
                        {selectedClass.resource_cost.bioneural_gel.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedClass.variants && (
                  <div>
                    <h4 className="font-semibold text-trek-gold mb-2">
                      Known Variants
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedClass.variants.map((variant, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs border-trek-blue text-trek-blue"
                        >
                          {variant}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === "ships" && (
        <div className="space-y-4">
          {starships.map((ship) => {
            const shipClass = starshipClasses.find(
              (sc) => sc.id === ship.class_id,
            );
            return (
              <Card
                key={ship.id}
                className="bg-trek-panel border-trek-accent p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Ship className="w-6 h-6 text-trek-gold" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-trek-gold text-lg">
                          {ship.name}
                        </h3>
                        {ship.is_flagship && (
                          <Crown className="w-5 h-5 text-trek-gold" />
                        )}
                      </div>
                      <p className="text-trek-blue">
                        {ship.registry} • {shipClass?.name}
                      </p>
                      <p className="text-sm text-trek-text/70">
                        Captain {ship.captain}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge
                      variant="secondary"
                      className={`text-xs mb-2 ${getStatusColor(ship.status)}`}
                    >
                      {ship.status}
                    </Badge>
                    <div className="text-sm">
                      <div className="text-trek-text/70">Combat Rating</div>
                      <div className="text-trek-warning font-semibold">
                        {ship.combat_rating}/10
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Hull Integrity
                    </div>
                    <div className="text-trek-blue font-semibold">
                      {ship.hull_integrity}%
                    </div>
                    <Progress
                      value={ship.hull_integrity}
                      className="h-2 mt-1"
                    />
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Crew Complement
                    </div>
                    <div className="text-trek-blue font-semibold">
                      {ship.crew_complement}/{ship.max_crew}
                    </div>
                    <Progress
                      value={(ship.crew_complement / ship.max_crew) * 100}
                      className="h-2 mt-1"
                    />
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Current Location
                    </div>
                    <div className="text-trek-blue font-semibold">
                      {ship.location}
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Current Assignment
                    </div>
                    <div className="text-trek-gold font-semibold text-sm">
                      {ship.current_assignment}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Ship Details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Issue Orders
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-warning text-trek-warning hover:bg-trek-warning hover:text-trek-dark"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Combat Status
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === "fleets" && (
        <div className="space-y-4">
          {fleets.map((fleet) => {
            const flagship = starships.find((s) => s.id === fleet.flagship_id);
            return (
              <Card
                key={fleet.id}
                className="bg-trek-panel border-trek-accent p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Crown className="w-6 h-6 text-trek-gold" />
                    <div>
                      <h3 className="font-bold text-trek-gold text-lg">
                        {fleet.name}
                      </h3>
                      <p className="text-trek-blue">
                        Commander: {fleet.commander}
                      </p>
                      <p className="text-sm text-trek-text/70">
                        Flagship: {flagship?.name}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge
                      variant="secondary"
                      className={`text-xs mb-2 ${getStatusColor(fleet.status)}`}
                    >
                      {fleet.status}
                    </Badge>
                    <div className="text-sm">
                      <div className="text-trek-text/70">Coordination</div>
                      <div className="text-trek-blue font-semibold">
                        {fleet.coordination_efficiency}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Ships in Fleet
                    </div>
                    <div className="text-trek-blue font-semibold">
                      {fleet.ships.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">Formation</div>
                    <div className="text-trek-blue font-semibold">
                      {fleet.formation}
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Mission Type
                    </div>
                    <div className="text-trek-gold font-semibold">
                      {fleet.mission_type}
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Area of Operations
                    </div>
                    <div className="text-trek-blue font-semibold">
                      {fleet.area_of_operations}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-trek-text/70 text-sm mb-1">
                    Fleet Coordination Efficiency
                  </div>
                  <Progress
                    value={fleet.coordination_efficiency}
                    className="h-3"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Fleet Roster
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Fleet Orders
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-warning text-trek-warning hover:bg-trek-warning hover:text-trek-dark"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Battle Formation
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === "construction" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-4">
              Active Construction Projects
            </h3>

            <div className="space-y-4">
              <div className="p-4 border border-trek-accent rounded">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-trek-gold">U.S.S. Titan</h4>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-blue-400/20 text-blue-400 border-blue-400"
                  >
                    Under Construction
                  </Badge>
                </div>
                <p className="text-sm text-trek-blue mb-2">
                  Luna-class Explorer
                </p>
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Construction Progress</span>
                    <span className="text-trek-blue">73%</span>
                  </div>
                  <Progress value={73} className="h-2" />
                </div>
                <div className="text-xs text-trek-text/70">
                  Estimated Completion: 127 days
                </div>
              </div>

              <div className="p-4 border border-trek-accent rounded">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-trek-gold">
                    U.S.S. Yorktown
                  </h4>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-blue-400/20 text-blue-400 border-blue-400"
                  >
                    Planning Phase
                  </Badge>
                </div>
                <p className="text-sm text-trek-blue mb-2">
                  Sovereign-class Flagship
                </p>
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Resource Allocation</span>
                    <span className="text-trek-blue">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="text-xs text-trek-text/70">
                  Construction Start: 89 days
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-4">
              Shipyard Capacity
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Utopia Planitia Shipyards</span>
                  <span className="text-trek-blue">8/12 berths</span>
                </div>
                <Progress value={67} className="h-3" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>San Francisco Fleet Yards</span>
                  <span className="text-trek-blue">5/8 berths</span>
                </div>
                <Progress value={63} className="h-3" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>40 Eridani A Shipyards</span>
                  <span className="text-trek-blue">3/6 berths</span>
                </div>
                <Progress value={50} className="h-3" />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-trek-accent">
              <h4 className="font-semibold text-trek-gold mb-3">
                Available Resources
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-trek-text/70">Duranium</div>
                  <div className="text-trek-blue font-semibold">
                    847,000 tons
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70">Tritanium</div>
                  <div className="text-trek-blue font-semibold">
                    523,000 tons
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70">Dilithium</div>
                  <div className="text-trek-gold font-semibold">
                    12,500 crystals
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70">Bio-neural Gel</div>
                  <div className="text-purple-400 font-semibold">
                    3,200 units
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
