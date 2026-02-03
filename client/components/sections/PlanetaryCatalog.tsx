import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Globe,
  Search,
  Filter,
  MapPin,
  Users,
  Shield,
  AlertTriangle,
  Thermometer,
  Droplets,
  Wind,
  Zap,
  Mountain,
  Waves,
  TreePine,
  Building,
  Rocket,
  Star,
  Moon,
  Sun,
  Eye,
  FileText,
  Download,
  Sparkles,
  Plus,
} from "lucide-react";

interface Planet {
  id: string;
  name: string;
  system: string;
  quadrant: "Alpha" | "Beta" | "Gamma" | "Delta";
  classification:
    | "M"
    | "K"
    | "L"
    | "H"
    | "J"
    | "T"
    | "Y"
    | "D"
    | "B"
    | "G"
    | "N"
    | "R"
    | "P";
  atmosphere: string;
  climate: string;
  gravity: number;
  population: number;
  species: string[];
  government: string;
  technology_level: number;
  federation_status:
    | "Member"
    | "Ally"
    | "Neutral"
    | "Hostile"
    | "Unknown"
    | "Protectorate"
    | "Colony";
  strategic_importance: "Critical" | "High" | "Medium" | "Low" | "None";
  threat_level: "None" | "Low" | "Medium" | "High" | "Extreme";
  resources: string[];
  landmarks: string[];
  first_contact: string;
  description: string;
  orbital_period: number;
  day_length: number;
  moons: number;
  surface_water: number;
  temperature_range: {
    min: number;
    max: number;
  };
  notable_features?: string[];
  trade_goods?: string[];
  diplomatic_notes?: string;
  security_protocols?: string[];
}

interface PlanetaryCatalogProps {
  activeSubmenu?: string;
}

export function PlanetaryCatalog({ activeSubmenu }: PlanetaryCatalogProps) {
  const defaultTab = "az_catalog";
  const [activeTab, setActiveTab] = useState(activeSubmenu || defaultTab);

  useEffect(() => {
    setActiveTab(activeSubmenu || defaultTab);
  }, [activeSubmenu]);
  const [searchFilter, setSearchFilter] = useState("");
  const [quadrantFilter, setQuadrantFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [classificationFilter, setClassificationFilter] = useState("all");
  const [selectedLetter, setSelectedLetter] = useState("A");

  const planets: Planet[] = [
    // A
    {
      id: "PL-A001",
      name: "Andoria",
      system: "Andorian System",
      quadrant: "Alpha",
      classification: "M",
      atmosphere: "Oxygen-Nitrogen with trace methane",
      climate: "Arctic to temperate",
      gravity: 1.1,
      population: 3200000000,
      species: ["Andorians"],
      government: "Parliamentary Republic",
      technology_level: 9,
      federation_status: "Member",
      strategic_importance: "Critical",
      threat_level: "None",
      resources: ["Duranium", "Dilithium", "Ice Crystals", "Rare Metals"],
      landmarks: ["Imperial Guard Academy", "Northern Wastes", "Capital City"],
      first_contact: "2151",
      description:
        "Homeworld of the Andorians, founding member of the United Federation of Planets. Known for its harsh climate and warrior culture.",
      orbital_period: 432,
      day_length: 28.5,
      moons: 1,
      surface_water: 58,
      temperature_range: { min: -30, max: 15 },
      notable_features: [
        "Ancient Ice Sanctuaries",
        "Andorian Imperial Guard Headquarters",
      ],
      trade_goods: ["Ice Wines", "Tactical Equipment", "Precision Instruments"],
      diplomatic_notes:
        "Founding UFP member. Strong military tradition. Current tensions with Vulcan resolved.",
    },
    {
      id: "PL-A002",
      name: "Aldebaran III",
      system: "Aldebaran System",
      quadrant: "Alpha",
      classification: "M",
      atmosphere: "Oxygen-Nitrogen",
      climate: "Tropical to temperate",
      gravity: 0.9,
      population: 156000000,
      species: ["Aldebarians"],
      government: "Colonial Administration",
      technology_level: 7,
      federation_status: "Colony",
      strategic_importance: "Medium",
      threat_level: "None",
      resources: ["Agricultural Products", "Tritanium", "Medicinal Plants"],
      landmarks: ["Music Academy", "Serpent Ridge", "Colonial Capitol"],
      first_contact: "2156",
      description:
        "Famous for its musical culture and Academy. Major agricultural producer for surrounding systems.",
      orbital_period: 312,
      day_length: 25.2,
      moons: 2,
      surface_water: 71,
      temperature_range: { min: 8, max: 35 },
      trade_goods: ["Musical Instruments", "Agricultural Products", "Art"],
    },
    {
      id: "PL-A003",
      name: "Argelius II",
      system: "Argelius System",
      quadrant: "Alpha",
      classification: "M",
      atmosphere: "Oxygen-Nitrogen",
      climate: "Temperate",
      gravity: 0.8,
      population: 45000000,
      species: ["Argelians"],
      government: "Hedonistic Democracy",
      technology_level: 6,
      federation_status: "Ally",
      strategic_importance: "Low",
      threat_level: "None",
      resources: ["Hospitality Services", "Entertainment", "Luxury Goods"],
      landmarks: ["Pleasure Domes", "Administrative Center", "Spaceport"],
      first_contact: "2154",
      description:
        "Peaceful hedonistic society focused on pleasure and hospitality. Popular shore leave destination.",
      orbital_period: 289,
      day_length: 23.8,
      moons: 0,
      surface_water: 82,
      temperature_range: { min: 15, max: 28 },
      trade_goods: ["Entertainment", "Hospitality Services", "Artisanal Foods"],
    },

    // B
    {
      id: "PL-B001",
      name: "Bajor",
      system: "Bajor System",
      quadrant: "Alpha",
      classification: "M",
      atmosphere: "Oxygen-Nitrogen",
      climate: "Temperate",
      gravity: 1.0,
      population: 320000000,
      species: ["Bajorans"],
      government: "Provisional Government",
      technology_level: 6,
      federation_status: "Ally",
      strategic_importance: "High",
      threat_level: "Medium",
      resources: ["Uridium", "Ore Processing", "Agricultural Products"],
      landmarks: [
        "Dahkur Province",
        "Rakantha Province",
        "Fire Caves",
        "Celestial Temple",
      ],
      first_contact: "2318",
      description:
        "Deeply spiritual world recovering from Cardassian occupation. Home to the Bajoran wormhole.",
      orbital_period: 372,
      day_length: 26,
      moons: 5,
      surface_water: 65,
      temperature_range: { min: -5, max: 40 },
      notable_features: [
        "Prophets' Temple",
        "Ancient B'hala Ruins",
        "Dahkur Province Resistance Monuments",
      ],
      trade_goods: ["Jumja", "Hasperat", "Religious Artifacts"],
      diplomatic_notes:
        "Recovering from Cardassian occupation. Strong religious traditions. Wormhole guardians.",
    },
    {
      id: "PL-B002",
      name: "Betazed",
      system: "Betazed System",
      quadrant: "Alpha",
      classification: "M",
      atmosphere: "Oxygen-Nitrogen",
      climate: "Tropical to temperate",
      gravity: 0.9,
      population: 1200000000,
      species: ["Betazoids"],
      government: "Matriarchal Democracy",
      technology_level: 8,
      federation_status: "Member",
      strategic_importance: "High",
      threat_level: "None",
      resources: [
        "Telepathic Training",
        "Psychology Research",
        "Counseling Services",
      ],
      landmarks: ["University of Betazed", "Sacred Chalice", "Jalara Jungle"],
      first_contact: "2245",
      description:
        "Homeworld of telepathic Betazoids. Federation member with strong psychological and diplomatic expertise.",
      orbital_period: 398,
      day_length: 25.5,
      moons: 3,
      surface_water: 78,
      temperature_range: { min: 12, max: 32 },
      trade_goods: [
        "Counseling Services",
        "Telepathic Training",
        "Exotic Foods",
      ],
    },
    {
      id: "PL-B003",
      name: "Breen",
      system: "Breen System",
      quadrant: "Alpha",
      classification: "L",
      atmosphere: "Frozen atmosphere",
      climate: "Extremely cold",
      gravity: 1.2,
      population: 890000000,
      species: ["Breen"],
      government: "Confederacy",
      technology_level: 8,
      federation_status: "Hostile",
      strategic_importance: "High",
      threat_level: "High",
      resources: [
        "Advanced Weapons",
        "Energy Dampening Technology",
        "Cryogenic Technology",
      ],
      landmarks: ["Confederacy Capital", "Weapon Research Facilities"],
      first_contact: "2340",
      description:
        "Mysterious frozen world home to the enigmatic Breen Confederacy. Known for advanced weapons technology.",
      orbital_period: 445,
      day_length: 19.2,
      moons: 2,
      surface_water: 12,
      temperature_range: { min: -180, max: -120 },
      security_protocols: [
        "High Alert Status",
        "Energy Dampening Countermeasures",
        "Intelligence Monitoring",
      ],
    },

    // C
    {
      id: "PL-C001",
      name: "Cardassia Prime",
      system: "Cardassian System",
      quadrant: "Alpha",
      classification: "M",
      atmosphere: "Oxygen-Nitrogen",
      climate: "Hot and dry",
      gravity: 1.1,
      population: 4500000000,
      species: ["Cardassians"],
      government: "Democratic Republic",
      technology_level: 8,
      federation_status: "Neutral",
      strategic_importance: "High",
      threat_level: "Medium",
      resources: [
        "Military Technology",
        "Administrative Expertise",
        "Mining Technology",
      ],
      landmarks: ["Central Command", "Cardassian Assembly", "Lakarian City"],
      first_contact: "2318",
      description:
        "Former capital of the Cardassian Union. Rebuilding after Dominion War devastation.",
      orbital_period: 362,
      day_length: 28,
      moons: 2,
      surface_water: 43,
      temperature_range: { min: 22, max: 55 },
      diplomatic_notes:
        "Post-war reconstruction ongoing. Democratic government established. War reparations in progress.",
    },
    {
      id: "PL-C002",
      name: "Ceti Alpha V",
      system: "Ceti Alpha System",
      quadrant: "Alpha",
      classification: "M",
      atmosphere: "Oxygen-Nitrogen (deteriorating)",
      climate: "Desert",
      gravity: 0.8,
      population: 0,
      species: ["Abandoned"],
      government: "None",
      technology_level: 0,
      federation_status: "Unknown",
      strategic_importance: "None",
      threat_level: "High",
      resources: ["Archaeological Interest"],
      landmarks: ["Botany Bay Crash Site", "Ceti Eel Colonies"],
      first_contact: "2267",
      description:
        "Barren world where Khan Noonien Singh was marooned. Uninhabitable due to orbital shift.",
      orbital_period: 289,
      day_length: 31.4,
      moons: 0,
      surface_water: 8,
      temperature_range: { min: -15, max: 60 },
      security_protocols: ["Restricted Access", "Contamination Protocols"],
    },
    {
      id: "PL-C003",
      name: "Chrysalis",
      system: "Chrysalis System",
      quadrant: "Alpha",
      classification: "M",
      atmosphere: "Oxygen-Nitrogen",
      climate: "Temperate",
      gravity: 1.0,
      population: 78000000,
      species: ["Chrysalians"],
      government: "Collective Consciousness",
      technology_level: 9,
      federation_status: "Neutral",
      strategic_importance: "Medium",
      threat_level: "Low",
      resources: [
        "Biotechnology",
        "Metamorphic Minerals",
        "Organic Technology",
      ],
      landmarks: ["Metamorphosis Chambers", "Collective Nexus"],
      first_contact: "2289",
      description:
        "World of beings who undergo regular metamorphosis. Advanced biotechnology and collective consciousness.",
      orbital_period: 445,
      day_length: 22.1,
      moons: 4,
      surface_water: 69,
      temperature_range: { min: 8, max: 30 },
    },

    // D
    {
      id: "PL-D001",
      name: "Deep Space Nine (Bajor System)",
      system: "Bajor System",
      quadrant: "Alpha",
      classification: "Space Station",
      atmosphere: "Controlled Environment",
      climate: "Artificial",
      gravity: 1.0,
      population: 7000,
      species: ["Various"],
      government: "Starfleet Administration",
      technology_level: 8,
      federation_status: "Ally",
      strategic_importance: "Critical",
      threat_level: "Medium",
      resources: ["Wormhole Access", "Trade Hub", "Strategic Location"],
      landmarks: ["Wormhole", "Promenade", "Ops Center", "Docking Rings"],
      first_contact: "2369",
      description:
        "Former Cardassian mining station, now Federation administered. Gateway to the Gamma Quadrant.",
      orbital_period: 0,
      day_length: 24,
      moons: 0,
      surface_water: 0,
      temperature_range: { min: 18, max: 24 },
      notable_features: [
        "Bajoran Wormhole",
        "Celestial Temple",
        "Gamma Quadrant Gateway",
      ],
    },
    {
      id: "PL-D002",
      name: "Delta IV",
      system: "Delta System",
      quadrant: "Alpha",
      classification: "M",
      atmosphere: "Oxygen-Nitrogen",
      climate: "Tropical",
      gravity: 0.9,
      population: 670000000,
      species: ["Deltans"],
      government: "Harmony Council",
      technology_level: 8,
      federation_status: "Member",
      strategic_importance: "Medium",
      threat_level: "None",
      resources: [
        "Empathic Technology",
        "Harmony Techniques",
        "Therapeutic Services",
      ],
      landmarks: ["Harmony Temples", "Deltan Academy"],
      first_contact: "2267",
      description:
        "Peaceful world of empathic humanoids known for their harmony with emotions and sexuality.",
      orbital_period: 334,
      day_length: 26.7,
      moons: 2,
      surface_water: 85,
      temperature_range: { min: 20, max: 35 },
    },
    {
      id: "PL-D003",
      name: "Deneva",
      system: "Denevan System",
      quadrant: "Alpha",
      classification: "M",
      atmosphere: "Oxygen-Nitrogen",
      climate: "Temperate",
      gravity: 1.0,
      population: 1000000,
      species: ["Humans", "Various"],
      government: "Colonial Government",
      technology_level: 7,
      federation_status: "Colony",
      strategic_importance: "Medium",
      threat_level: "None",
      resources: ["Agriculture", "Industrial Manufacturing"],
      landmarks: ["Colonial Capital", "Agricultural Centers"],
      first_contact: "2164",
      description:
        "Human colony world. Site of neural parasite incident in 2267, now fully recovered.",
      orbital_period: 298,
      day_length: 24.3,
      moons: 1,
      surface_water: 64,
      temperature_range: { min: -2, max: 38 },
    },

    // E
    {
      id: "PL-E001",
      name: "Earth (Terra)",
      system: "Sol System",
      quadrant: "Alpha",
      classification: "M",
      atmosphere: "Oxygen-Nitrogen",
      climate: "Varied",
      gravity: 1.0,
      population: 9300000000,
      species: ["Humans", "Various"],
      government: "United Earth Government",
      technology_level: 9,
      federation_status: "Member",
      strategic_importance: "Critical",
      threat_level: "None",
      resources: [
        "Starfleet Headquarters",
        "Diplomatic Center",
        "Cultural Heritage",
      ],
      landmarks: [
        "Starfleet Headquarters",
        "United Federation of Planets",
        "Golden Gate Bridge",
        "Mount Rushmore",
      ],
      first_contact: "N/A",
      description:
        "Birthworld of humanity and capital of the United Federation of Planets. Center of Starfleet operations.",
      orbital_period: 365,
      day_length: 24,
      moons: 1,
      surface_water: 71,
      temperature_range: { min: -89, max: 58 },
      notable_features: [
        "Starfleet Academy",
        "Federation Council Chambers",
        "Palais de la Concorde",
      ],
      trade_goods: ["Technology", "Cultural Products", "Educational Services"],
    },
    {
      id: "PL-E002",
      name: "Eminiar VII",
      system: "NGC 321 System",
      quadrant: "Alpha",
      classification: "M",
      atmosphere: "Oxygen-Nitrogen",
      climate: "Temperate",
      gravity: 1.0,
      population: 50000000,
      species: ["Eminians"],
      government: "High Council",
      technology_level: 7,
      federation_status: "Neutral",
      strategic_importance: "Low",
      threat_level: "Low",
      resources: ["Advanced Computer Technology", "Simulation Systems"],
      landmarks: ["High Council Chambers", "War Computer Complex"],
      first_contact: "2267",
      description:
        "World that fought a computer-simulated war with Vendikar for 500 years until Enterprise intervention.",
      orbital_period: 401,
      day_length: 27.1,
      moons: 3,
      surface_water: 58,
      temperature_range: { min: 5, max: 40 },
      diplomatic_notes:
        "Peace treaty with Vendikar established 2267. Rebuilding conventional diplomatic relations.",
    },
    {
      id: "PL-E003",
      name: "Excalbia",
      system: "Excalbian System",
      quadrant: "Alpha",
      classification: "Y",
      atmosphere: "Molten rock vapor",
      climate: "Molten",
      gravity: 1.8,
      population: 1000000,
      species: ["Excalbians"],
      government: "Unknown",
      technology_level: 10,
      federation_status: "Unknown",
      strategic_importance: "Low",
      threat_level: "Low",
      resources: ["Advanced Energy Manipulation", "Reality Alteration"],
      landmarks: ["Molten Formations", "Energy Beings' Domain"],
      first_contact: "2269",
      description:
        "Molten world inhabited by powerful energy beings capable of creating matter and recreating historical figures.",
      orbital_period: 567,
      day_length: 14.2,
      moons: 0,
      surface_water: 0,
      temperature_range: { min: 800, max: 1200 },
    },

    // F
    {
      id: "PL-F001",
      name: "Ferenginar",
      system: "Ferenginar System",
      quadrant: "Alpha",
      classification: "M",
      atmosphere: "Oxygen-Nitrogen with high humidity",
      climate: "Tropical rainforest",
      gravity: 1.0,
      population: 2890000000,
      species: ["Ferengi"],
      government: "Ferengi Alliance",
      technology_level: 7,
      federation_status: "Ally",
      strategic_importance: "High",
      threat_level: "None",
      resources: ["Commerce", "Banking", "Trade Networks", "Latinum"],
      landmarks: [
        "Tower of Commerce",
        "Sacred Marketplace",
        "Grand Nagus Palace",
      ],
      first_contact: "2364",
      description:
        "Homeworld of the Ferengi, center of galactic commerce and trade. Perpetually rainy tropical world.",
      orbital_period: 378,
      day_length: 24.6,
      moons: 2,
      surface_water: 89,
      temperature_range: { min: 25, max: 35 },
      notable_features: [
        "Rules of Acquisition Archive",
        "Great Marketplace",
        "Financial District",
      ],
      trade_goods: ["Banking Services", "Exotic Goods", "Commercial Equipment"],
    },
    {
      id: "PL-F002",
      name: "Founder's Homeworld",
      system: "Unknown System",
      quadrant: "Gamma",
      classification: "M",
      atmosphere: "Oxygen-Nitrogen",
      climate: "Temperate",
      gravity: 1.1,
      population: 1000000,
      species: ["Founders", "Vorta", "Jem'Hadar"],
      government: "The Great Link",
      technology_level: 10,
      federation_status: "Hostile",
      strategic_importance: "Critical",
      threat_level: "Extreme",
      resources: [
        "Shapeshifting Technology",
        "Dominion Command",
        "Advanced Genetics",
      ],
      landmarks: ["Great Link", "Dominion Headquarters"],
      first_contact: "2371",
      description:
        "Hidden homeworld of the Founders, ruling species of the Dominion. Location closely guarded secret.",
      orbital_period: 412,
      day_length: 26.8,
      moons: 1,
      surface_water: 76,
      temperature_range: { min: 10, max: 30 },
      security_protocols: [
        "Maximum Security Alert",
        "Approach Forbidden",
        "Cloaked Location",
      ],
    },
    {
      id: "PL-F003",
      name: "Freehaven",
      system: "Freehaven System",
      quadrant: "Alpha",
      classification: "M",
      atmosphere: "Oxygen-Nitrogen",
      climate: "Arid",
      gravity: 0.9,
      population: 15000000,
      species: ["Various"],
      government: "Anarchist Collective",
      technology_level: 6,
      federation_status: "Neutral",
      strategic_importance: "Low",
      threat_level: "Medium",
      resources: [
        "Black Market Goods",
        "Mercenary Services",
        "Information Brokerage",
      ],
      landmarks: ["Free Port", "Underground Markets"],
      first_contact: "2298",
      description:
        "Lawless frontier world serving as haven for smugglers, mercenaries, and those avoiding Federation law.",
      orbital_period: 298,
      day_length: 29.1,
      moons: 0,
      surface_water: 34,
      temperature_range: { min: 8, max: 47 },
    },

    // Continue with more planets for other letters...
    // Adding representative planets for G through Z

    // G
    {
      id: "PL-G001",
      name: "Gorn Hegemony Capital",
      system: "Gorn System",
      quadrant: "Beta",
      classification: "H",
      atmosphere: "Oxygen-Nitrogen with high methane",
      climate: "Hot and humid",
      gravity: 1.3,
      population: 890000000,
      species: ["Gorn"],
      government: "Hegemony",
      technology_level: 7,
      federation_status: "Neutral",
      strategic_importance: "High",
      threat_level: "Medium",
      resources: ["Heavy Metals", "Military Technology", "Territorial Control"],
      landmarks: ["Hegemony Capitol", "Military Complexes"],
      first_contact: "2267",
      description:
        "Capital world of the powerful Gorn Hegemony. Hot, humid world suited to reptilian physiology.",
      orbital_period: 445,
      day_length: 31.2,
      moons: 3,
      surface_water: 45,
      temperature_range: { min: 35, max: 65 },
    },

    // H
    {
      id: "PL-H001",
      name: "Halkana",
      system: "Halkan System",
      quadrant: "Alpha",
      classification: "M",
      atmosphere: "Oxygen-Nitrogen",
      climate: "Temperate",
      gravity: 1.0,
      population: 125000000,
      species: ["Halkans"],
      government: "Pacifist Council",
      technology_level: 5,
      federation_status: "Neutral",
      strategic_importance: "Medium",
      threat_level: "None",
      resources: ["Dilithium", "Peaceful Philosophy", "Agricultural Products"],
      landmarks: ["Peace Temples", "Dilithium Mines"],
      first_contact: "2267",
      description:
        "Peaceful world rich in dilithium. Inhabitants are complete pacifists who refuse violence under any circumstances.",
      orbital_period: 334,
      day_length: 25.8,
      moons: 2,
      surface_water: 67,
      temperature_range: { min: 2, max: 32 },
    },

    // Continue pattern through the alphabet...
    // For brevity, I'll add a few more key planets and then create the interface

    // Q
    {
      id: "PL-Q001",
      name: "Q'onos (Kronos)",
      system: "Klingon System",
      quadrant: "Beta",
      classification: "M",
      atmosphere: "Oxygen-Nitrogen",
      climate: "Varied",
      gravity: 1.24,
      population: 3200000000,
      species: ["Klingons"],
      government: "Klingon Empire",
      technology_level: 8,
      federation_status: "Ally",
      strategic_importance: "Critical",
      threat_level: "Low",
      resources: [
        "Military Technology",
        "Warrior Culture",
        "Strategic Position",
      ],
      landmarks: ["Great Hall", "First City", "Caves of Boreth"],
      first_contact: "2151",
      description:
        "Homeworld of the Klingon Empire. Warrior society with rich cultural traditions and powerful military.",
      orbital_period: 380,
      day_length: 21.7,
      moons: 1,
      surface_water: 55,
      temperature_range: { min: -5, max: 45 },
      notable_features: [
        "Hall of Warriors",
        "Klingon Defense Force Headquarters",
        "Clone Laboratories",
      ],
      diplomatic_notes:
        "Major Federation ally. Khitomer Accords in effect. Strong military partnership.",
    },

    // R
    {
      id: "PL-R001",
      name: "Romulus",
      system: "Romulan System",
      quadrant: "Beta",
      classification: "M",
      atmosphere: "Oxygen-Nitrogen",
      climate: "Temperate",
      gravity: 1.0,
      population: 4500000000,
      species: ["Romulans"],
      government: "Romulan Star Empire",
      technology_level: 8,
      federation_status: "Neutral",
      strategic_importance: "Critical",
      threat_level: "Medium",
      resources: [
        "Cloaking Technology",
        "Intelligence Services",
        "Quantum Singularity Cores",
      ],
      landmarks: [
        "Romulan Senate",
        "Tal Shiar Headquarters",
        "Valley of Chula",
      ],
      first_contact: "2266",
      description:
        "Capital of the secretive Romulan Star Empire. Twin world with Remus, center of Romulan civilization.",
      orbital_period: 295,
      day_length: 28.9,
      moons: 0,
      surface_water: 61,
      temperature_range: { min: -8, max: 42 },
      security_protocols: [
        "Romulan Neutral Zone Monitoring",
        "Cloaking Device Detection",
        "Intelligence Surveillance",
      ],
    },

    // V
    {
      id: "PL-V001",
      name: "Vulcan",
      system: "Vulcan System",
      quadrant: "Alpha",
      classification: "M",
      atmosphere: "Oxygen-Nitrogen with thin atmosphere",
      climate: "Desert",
      gravity: 1.4,
      population: 6200000000,
      species: ["Vulcans"],
      government: "Vulcan High Command",
      technology_level: 9,
      federation_status: "Member",
      strategic_importance: "Critical",
      threat_level: "None",
      resources: [
        "Advanced Logic",
        "Scientific Research",
        "Telepathic Training",
      ],
      landmarks: [
        "Mount Seleya",
        "Vulcan Academy of Sciences",
        "Shi'Kahr",
        "Temple of Amonak",
      ],
      first_contact: "2063",
      description:
        "Desert homeworld of the logical Vulcans. Founding member of the Federation and center of scientific advancement.",
      orbital_period: 234,
      day_length: 25.4,
      moons: 1,
      surface_water: 22,
      temperature_range: { min: 15, max: 65 },
      notable_features: [
        "Katric Ark",
        "Vulcan Science Academy",
        "Mount Seleya Monasteries",
      ],
      trade_goods: [
        "Scientific Equipment",
        "Logic Training",
        "Meditation Techniques",
      ],
    },
  ];

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Member":
        return "bg-trek-blue/20 text-trek-blue border-trek-blue";
      case "Ally":
        return "bg-green-500/20 text-green-400 border-green-500";
      case "Colony":
        return "bg-trek-gold/20 text-trek-gold border-trek-gold";
      case "Neutral":
        return "bg-trek-text/20 text-trek-text border-trek-text";
      case "Hostile":
        return "bg-red-500/20 text-red-400 border-red-500";
      case "Unknown":
        return "bg-purple-500/20 text-purple-400 border-purple-500";
      case "Protectorate":
        return "bg-trek-warning/20 text-trek-warning border-trek-warning";
      default:
        return "bg-trek-text/20 text-trek-text border-trek-text";
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case "None":
        return "text-green-400";
      case "Low":
        return "text-trek-blue";
      case "Medium":
        return "text-trek-warning";
      case "High":
        return "text-red-400";
      case "Extreme":
        return "text-red-600";
      default:
        return "text-trek-text";
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "Critical":
        return "text-red-400";
      case "High":
        return "text-trek-warning";
      case "Medium":
        return "text-trek-blue";
      case "Low":
        return "text-trek-text";
      case "None":
        return "text-trek-text/50";
      default:
        return "text-trek-text";
    }
  };

  const filteredPlanets = planets.filter((planet) => {
    const matchesSearch =
      planet.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      planet.system.toLowerCase().includes(searchFilter.toLowerCase()) ||
      planet.species.some((species) =>
        species.toLowerCase().includes(searchFilter.toLowerCase()),
      );
    const matchesQuadrant =
      quadrantFilter === "all" || planet.quadrant === quadrantFilter;
    const matchesStatus =
      statusFilter === "all" || planet.federation_status === statusFilter;
    const matchesClassification =
      classificationFilter === "all" ||
      planet.classification === classificationFilter;
    return (
      matchesSearch && matchesQuadrant && matchesStatus && matchesClassification
    );
  });

  const planetsByLetter = alphabet.reduce(
    (acc, letter) => {
      acc[letter] = planets.filter(
        (planet) => planet.name.charAt(0).toUpperCase() === letter,
      );
      return acc;
    },
    {} as Record<string, Planet[]>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          PLANETARY CATALOG
        </h2>
        <div className="flex gap-2">
          <Button className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            Add Planet
          </Button>
          <Button
            variant="outline"
            className="border-trek-accent text-trek-text hover:bg-trek-accent"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Database
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-trek-panel border border-trek-accent">
          <TabsTrigger
            value="az_catalog"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            A-Z Catalog
          </TabsTrigger>
          <TabsTrigger
            value="search"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Advanced Search
          </TabsTrigger>
          <TabsTrigger
            value="classifications"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Classifications
          </TabsTrigger>
          <TabsTrigger
            value="strategic"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Strategic Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="az_catalog" className="mt-6">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {alphabet.map((letter) => (
                <Button
                  key={letter}
                  variant={selectedLetter === letter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLetter(letter)}
                  className={
                    selectedLetter === letter
                      ? "bg-trek-blue text-trek-dark"
                      : "border-trek-accent text-trek-text hover:bg-trek-accent"
                  }
                >
                  {letter}
                  <Badge variant="outline" className="ml-2 text-xs">
                    {planetsByLetter[letter]?.length || 0}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {planetsByLetter[selectedLetter]?.map((planet) => (
              <Card
                key={planet.id}
                className="bg-trek-panel border-trek-accent p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-bold text-trek-gold">
                        {planet.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className="border-trek-blue text-trek-blue"
                      >
                        Class {planet.classification}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(planet.federation_status)}
                      >
                        {planet.federation_status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-trek-accent text-trek-text"
                      >
                        {planet.quadrant} Quadrant
                      </Badge>
                    </div>
                    <p className="text-trek-text/70 text-sm mb-2">
                      {planet.system} • {planet.id}
                    </p>
                    <p className="text-trek-text mb-4">{planet.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="block font-medium text-trek-gold">
                          Population
                        </span>
                        <span>{planet.population.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="block font-medium text-trek-gold">
                          Gravity
                        </span>
                        <span>{planet.gravity}G</span>
                      </div>
                      <div>
                        <span className="block font-medium text-trek-gold">
                          Strategic Importance
                        </span>
                        <span
                          className={getImportanceColor(
                            planet.strategic_importance,
                          )}
                        >
                          {planet.strategic_importance}
                        </span>
                      </div>
                      <div>
                        <span className="block font-medium text-trek-gold">
                          Threat Level
                        </span>
                        <span className={getThreatColor(planet.threat_level)}>
                          {planet.threat_level}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-trek-accent text-trek-text hover:bg-trek-accent"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Report
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-trek-text/70 mb-1">
                      Primary Species
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {planet.species.map((species) => (
                        <Badge
                          key={species}
                          variant="outline"
                          className="text-xs border-trek-gold text-trek-gold"
                        >
                          {species}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-trek-text/70 mb-1">
                      Climate & Environment
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Thermometer className="w-4 h-4 text-trek-blue" />
                        <span>
                          {planet.temperature_range.min}°C to{" "}
                          {planet.temperature_range.max}°C
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Droplets className="w-4 h-4 text-trek-blue" />
                        <span>{planet.surface_water}% water</span>
                      </div>
                    </div>
                  </div>
                </div>

                {planet.resources && planet.resources.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-trek-text/70 mb-2">
                      Primary Resources
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {planet.resources.map((resource) => (
                        <Badge
                          key={resource}
                          variant="outline"
                          className="text-xs border-trek-blue text-trek-blue"
                        >
                          {resource}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {planet.landmarks && planet.landmarks.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-trek-text/70 mb-2">
                      Notable Landmarks
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {planet.landmarks.map((landmark) => (
                        <Badge
                          key={landmark}
                          variant="outline"
                          className="text-xs border-trek-accent text-trek-text"
                        >
                          {landmark}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-trek-accent">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-trek-text/70">
                    <div>First Contact: {planet.first_contact}</div>
                    <div>Tech Level: {planet.technology_level}/10</div>
                    <div>Day Length: {planet.day_length}h</div>
                    <div>Moons: {planet.moons}</div>
                  </div>
                </div>
              </Card>
            )) || (
              <Card className="bg-trek-panel border-trek-accent p-6 text-center">
                <p className="text-trek-text/70">
                  No planets found starting with "{selectedLetter}"
                </p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="search" className="mt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search planets..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="bg-trek-panel border-trek-accent"
              />
              <Select value={quadrantFilter} onValueChange={setQuadrantFilter}>
                <SelectTrigger className="bg-trek-panel border-trek-accent">
                  <SelectValue placeholder="Filter by quadrant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Quadrants</SelectItem>
                  <SelectItem value="Alpha">Alpha Quadrant</SelectItem>
                  <SelectItem value="Beta">Beta Quadrant</SelectItem>
                  <SelectItem value="Gamma">Gamma Quadrant</SelectItem>
                  <SelectItem value="Delta">Delta Quadrant</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-trek-panel border-trek-accent">
                  <SelectValue placeholder="Federation status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Member">Federation Member</SelectItem>
                  <SelectItem value="Ally">Allied</SelectItem>
                  <SelectItem value="Colony">Colony</SelectItem>
                  <SelectItem value="Neutral">Neutral</SelectItem>
                  <SelectItem value="Hostile">Hostile</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={classificationFilter}
                onValueChange={setClassificationFilter}
              >
                <SelectTrigger className="bg-trek-panel border-trek-accent">
                  <SelectValue placeholder="Planet class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="M">Class M (Terrestrial)</SelectItem>
                  <SelectItem value="K">Class K (Adaptable)</SelectItem>
                  <SelectItem value="L">Class L (Marginal)</SelectItem>
                  <SelectItem value="H">Class H (Desert)</SelectItem>
                  <SelectItem value="J">Class J (Gas Giant)</SelectItem>
                  <SelectItem value="Y">Class Y (Demon)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {filteredPlanets.map((planet) => (
                <Card
                  key={planet.id}
                  className="bg-trek-panel border-trek-accent p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Globe className="w-8 h-8 text-trek-blue" />
                      <div>
                        <h3 className="text-lg font-bold text-trek-gold">
                          {planet.name}
                        </h3>
                        <p className="text-sm text-trek-text/70">
                          {planet.system} • {planet.quadrant} Quadrant • Class{" "}
                          {planet.classification}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={getStatusColor(planet.federation_status)}
                      >
                        {planet.federation_status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="classifications" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Planet Classifications
              </h3>
              <div className="space-y-4">
                <div className="p-3 border border-trek-accent rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-trek-blue">
                      Class M - Terrestrial
                    </h4>
                    <Badge
                      variant="outline"
                      className="border-trek-blue text-trek-blue"
                    >
                      {planets.filter((p) => p.classification === "M").length}
                    </Badge>
                  </div>
                  <p className="text-sm text-trek-text/70">
                    Earth-like worlds suitable for humanoid life
                  </p>
                </div>

                <div className="p-3 border border-trek-accent rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-trek-warning">
                      Class K - Adaptable
                    </h4>
                    <Badge
                      variant="outline"
                      className="border-trek-warning text-trek-warning"
                    >
                      {planets.filter((p) => p.classification === "K").length}
                    </Badge>
                  </div>
                  <p className="text-sm text-trek-text/70">
                    Adaptable with pressure domes or terraforming
                  </p>
                </div>

                <div className="p-3 border border-trek-accent rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-red-400">
                      Class Y - Demon
                    </h4>
                    <Badge
                      variant="outline"
                      className="border-red-400 text-red-400"
                    >
                      {planets.filter((p) => p.classification === "Y").length}
                    </Badge>
                  </div>
                  <p className="text-sm text-trek-text/70">
                    Extremely hostile environment, uninhabitable
                  </p>
                </div>

                <div className="p-3 border border-trek-accent rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-trek-gold">
                      Class H - Desert
                    </h4>
                    <Badge
                      variant="outline"
                      className="border-trek-gold text-trek-gold"
                    >
                      {planets.filter((p) => p.classification === "H").length}
                    </Badge>
                  </div>
                  <p className="text-sm text-trek-text/70">
                    Hot, arid worlds with minimal water
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Federation Status
              </h3>
              <div className="space-y-3">
                {[
                  "Member",
                  "Ally",
                  "Colony",
                  "Neutral",
                  "Hostile",
                  "Unknown",
                ].map((status) => (
                  <div
                    key={status}
                    className="flex items-center justify-between"
                  >
                    <span>{status}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-trek-accent/30 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-trek-blue"
                          style={{
                            width: `${(planets.filter((p) => p.federation_status === status).length / planets.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-trek-blue font-semibold w-8">
                        {
                          planets.filter((p) => p.federation_status === status)
                            .length
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strategic" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Strategic Assessment
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-red-400 mb-2">
                    Critical Importance
                  </h4>
                  {planets
                    .filter((p) => p.strategic_importance === "Critical")
                    .map((planet) => (
                      <div
                        key={planet.id}
                        className="flex items-center justify-between py-1"
                      >
                        <span className="text-sm">{planet.name}</span>
                        <Badge
                          variant="outline"
                          className={getStatusColor(planet.federation_status)}
                        >
                          {planet.federation_status}
                        </Badge>
                      </div>
                    ))}
                </div>

                <div>
                  <h4 className="font-semibold text-red-400 mb-2">
                    High Threat Worlds
                  </h4>
                  {planets
                    .filter(
                      (p) =>
                        p.threat_level === "High" ||
                        p.threat_level === "Extreme",
                    )
                    .map((planet) => (
                      <div
                        key={planet.id}
                        className="flex items-center justify-between py-1"
                      >
                        <span className="text-sm">{planet.name}</span>
                        <Badge
                          variant="outline"
                          className={`border-red-500 text-red-400`}
                        >
                          {planet.threat_level}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Quadrant Distribution
              </h3>
              <div className="space-y-3">
                {["Alpha", "Beta", "Gamma", "Delta"].map((quadrant) => (
                  <div
                    key={quadrant}
                    className="flex items-center justify-between"
                  >
                    <span>{quadrant} Quadrant</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-trek-accent/30 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-trek-blue"
                          style={{
                            width: `${(planets.filter((p) => p.quadrant === quadrant).length / planets.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-trek-blue font-semibold w-8">
                        {planets.filter((p) => p.quadrant === quadrant).length}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
