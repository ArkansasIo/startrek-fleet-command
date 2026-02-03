import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Map,
  Globe,
  Star,
  Navigation,
  Radar,
  Search,
  Filter,
  MapPin,
  Compass,
  Target,
  Eye,
  Info,
  AlertTriangle,
  Shield,
  Zap,
  Activity,
  Users,
  Building,
  Rocket,
  Atom,
  Crown,
  Flag,
  Home,
  Factory,
  Anchor,
  Plane,
  Radio,
  Database,
  BarChart3,
  TrendingUp,
} from "lucide-react";

interface Coordinates {
  x: number;
  y: number;
  z: number;
}

interface Territory {
  id: string;
  name: string;
  type:
    | "quadrant"
    | "sector"
    | "system"
    | "planet"
    | "station"
    | "nebula"
    | "anomaly";
  coordinates: Coordinates;
  controllingFaction: string;
  securityLevel: "Safe" | "Caution" | "Restricted" | "Hostile" | "Unknown";
  population?: number;
  resources: string[];
  strategicValue: "Low" | "Medium" | "High" | "Critical";
  description: string;
  parentTerritory?: string;
  subTerritories: string[];
  facilities: string[];
  phenomena: string[];
  threats: string[];
  lastSurvey: string;
  explorationStatus:
    | "Unexplored"
    | "Surveyed"
    | "Colonized"
    | "Contested"
    | "Abandoned";
}

interface GalacticTerritorialProps {
  activeSubmenu?: string;
}

export function GalacticTerritories({
  activeSubmenu,
}: GalacticTerritorialProps) {
  const defaultTab = "overview";
  const [activeTab, setActiveTab] = useState(activeSubmenu || defaultTab);

  useEffect(() => {
    setActiveTab(activeSubmenu || defaultTab);
  }, [activeSubmenu]);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFaction, setFilterFaction] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterSecurity, setFilterSecurity] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "map" | "tree">("list");
  const mapRef = useRef<HTMLDivElement>(null);

  const territories: Territory[] = [
    // Quadrants
    {
      id: "alpha-quadrant",
      name: "Alpha Quadrant",
      type: "quadrant",
      coordinates: { x: 0, y: 0, z: 0 },
      controllingFaction: "United Federation of Planets",
      securityLevel: "Safe",
      population: 985000000000,
      resources: ["Dilithium", "Duranium", "Latinum", "Biomass"],
      strategicValue: "Critical",
      description:
        "Primary home of the United Federation of Planets, containing Earth, Vulcan, Andoria, and numerous other key worlds.",
      parentTerritory: "",
      subTerritories: [
        "sol-sector",
        "vulcan-sector",
        "andorian-sector",
        "tellar-sector",
      ],
      facilities: ["Starfleet Headquarters", "Jupiter Station", "Memory Alpha"],
      phenomena: ["Briar Patch", "Azure Nebula"],
      threats: ["Borg Incursions", "Dominion Infiltrators"],
      lastSurvey: "Stardate 98234.5",
      explorationStatus: "Colonized",
    },
    {
      id: "beta-quadrant",
      name: "Beta Quadrant",
      type: "quadrant",
      coordinates: { x: 25000, y: 0, z: 0 },
      controllingFaction: "Klingon Empire",
      securityLevel: "Caution",
      population: 650000000000,
      resources: ["Kelbonite", "Topaline", "Pergium", "Tritanium"],
      strategicValue: "Critical",
      description:
        "Dominated by the Klingon Empire and Romulan Star Empire, a region of military powers and ancient civilizations.",
      parentTerritory: "",
      subTerritories: ["klingon-core", "romulan-sector", "neutral-zone"],
      facilities: ["Khitomer", "Rura Penthe", "Romulan Senate"],
      phenomena: ["Paulson Nebula", "McAllister C-5 Nebula"],
      threats: ["Border Conflicts", "Romulan Cloaked Ships"],
      lastSurvey: "Stardate 98156.2",
      explorationStatus: "Contested",
    },
    {
      id: "gamma-quadrant",
      name: "Gamma Quadrant",
      type: "quadrant",
      coordinates: { x: 0, y: 25000, z: 0 },
      controllingFaction: "Dominion",
      securityLevel: "Hostile",
      population: 1200000000000,
      resources: [
        "Ketracel-white",
        "Yridium",
        "Selenium",
        "Quantum Resonators",
      ],
      strategicValue: "High",
      description:
        "Domain of the Dominion, accessible through the Bajoran wormhole. Home to the Founders and their vast empire.",
      parentTerritory: "",
      subTerritories: [
        "founders-homeworld",
        "cardassian-space",
        "bajoran-sector",
      ],
      facilities: ["Deep Space Nine", "Internment Camp 371"],
      phenomena: ["Bajoran Wormhole", "Dominion Fleet Yards"],
      threats: ["Jem'Hadar Patrols", "Founder Surveillance"],
      lastSurvey: "Stardate 97892.1",
      explorationStatus: "Contested",
    },
    {
      id: "delta-quadrant",
      name: "Delta Quadrant",
      type: "quadrant",
      coordinates: { x: 0, y: 0, z: 25000 },
      controllingFaction: "Borg Collective",
      securityLevel: "Hostile",
      population: 890000000000,
      resources: ["Borg Technology", "Nanoprobes", "Transwarp Coils"],
      strategicValue: "High",
      description:
        "Distant quadrant dominated by the Borg Collective, containing numerous species and advanced technologies.",
      parentTerritory: "",
      subTerritories: [
        "borg-space",
        "kazon-territory",
        "vidiian-space",
        "malon-space",
      ],
      facilities: ["Unimatrix One", "Borg Transwarp Hub"],
      phenomena: ["Borg Transwarp Network", "Nekrit Expanse"],
      threats: ["Borg Cubes", "Species 8472"],
      lastSurvey: "Stardate 97234.8",
      explorationStatus: "Surveyed",
    },

    // Key Sectors
    {
      id: "sol-sector",
      name: "Sol Sector",
      type: "sector",
      coordinates: { x: 150, y: 50, z: 25 },
      controllingFaction: "United Federation of Planets",
      securityLevel: "Safe",
      population: 54000000000,
      resources: [
        "Industrial Capacity",
        "Agricultural Products",
        "Cultural Heritage",
      ],
      strategicValue: "Critical",
      description:
        "Core sector of the Federation containing Earth, the capital world and birthplace of Starfleet.",
      parentTerritory: "alpha-quadrant",
      subTerritories: ["sol-system", "alpha-centauri", "sirius-system"],
      facilities: [
        "Starfleet Headquarters",
        "Starfleet Academy",
        "Jupiter Station",
      ],
      phenomena: ["Sol Corona", "Asteroid Belt"],
      threats: ["Minimal"],
      lastSurvey: "Stardate 98245.2",
      explorationStatus: "Colonized",
    },
    {
      id: "klingon-core",
      name: "Klingon Core Worlds",
      type: "sector",
      coordinates: { x: 24500, y: 200, z: 150 },
      controllingFaction: "Klingon Empire",
      securityLevel: "Restricted",
      population: 78000000000,
      resources: [
        "Military Technology",
        "Warrior Training",
        "Ancient Artifacts",
      ],
      strategicValue: "Critical",
      description:
        "Heart of the Klingon Empire, containing Qo'noS and the most important Klingon worlds.",
      parentTerritory: "beta-quadrant",
      subTerritories: ["qonos-system", "khitomer-system", "rura-penthe"],
      facilities: ["Great Hall", "Klingon Defense Force Command"],
      phenomena: ["Praxis Moon Debris"],
      threats: ["House Politics", "Blood Feuds"],
      lastSurvey: "Stardate 97856.4",
      explorationStatus: "Restricted",
    },

    // Specific Systems
    {
      id: "sol-system",
      name: "Sol System",
      type: "system",
      coordinates: { x: 152, y: 48, z: 22 },
      controllingFaction: "United Federation of Planets",
      securityLevel: "Safe",
      population: 12000000000,
      resources: ["Earth", "Mars Colonies", "Jupiter Mining"],
      strategicValue: "Critical",
      description:
        "Humanity's home system, containing Earth and numerous colonies and facilities.",
      parentTerritory: "sol-sector",
      subTerritories: ["earth", "mars", "jupiter-system", "saturn-system"],
      facilities: [
        "Starfleet Headquarters",
        "Mars Shipyards",
        "Lunar Colonies",
      ],
      phenomena: ["Sol", "Asteroid Belt", "Kuiper Belt"],
      threats: ["None"],
      lastSurvey: "Stardate 98250.1",
      explorationStatus: "Colonized",
    },
    {
      id: "bajor-system",
      name: "Bajor System",
      type: "system",
      coordinates: { x: 2340, y: 890, z: 120 },
      controllingFaction: "Bajoran Provisional Government",
      securityLevel: "Caution",
      population: 3000000000,
      resources: ["Uridium Ore", "Dilithium", "Religious Artifacts"],
      strategicValue: "High",
      description:
        "Strategic system containing Bajor and the Bajoran wormhole to the Gamma Quadrant.",
      parentTerritory: "alpha-quadrant",
      subTerritories: ["bajor", "deep-space-nine"],
      facilities: ["Deep Space Nine", "Bajoran Mining Operations"],
      phenomena: ["Bajoran Wormhole", "Celestial Temple"],
      threats: ["Cardassian Remnants", "Dominion Influence"],
      lastSurvey: "Stardate 98134.7",
      explorationStatus: "Contested",
    },

    // Key Planets
    {
      id: "earth",
      name: "Earth",
      type: "planet",
      coordinates: { x: 152, y: 48, z: 22 },
      controllingFaction: "United Federation of Planets",
      securityLevel: "Safe",
      population: 9500000000,
      resources: [
        "Cultural Heritage",
        "Academy Training",
        "Diplomatic Centers",
      ],
      strategicValue: "Critical",
      description:
        "Capital world of the United Federation of Planets and birthplace of humanity.",
      parentTerritory: "sol-system",
      subTerritories: ["san-francisco", "paris", "new-york", "antarctica"],
      facilities: [
        "Starfleet Headquarters",
        "Starfleet Academy",
        "Federation Council",
      ],
      phenomena: ["Aurora Borealis", "Pacific Ring of Fire"],
      threats: ["None"],
      lastSurvey: "Stardate 98251.0",
      explorationStatus: "Colonized",
    },
    {
      id: "vulcan",
      name: "Vulcan",
      type: "planet",
      coordinates: { x: 234, y: 156, z: 89 },
      controllingFaction: "Vulcan High Command",
      securityLevel: "Safe",
      population: 6200000000,
      resources: [
        "Logic Philosophy",
        "Advanced Technology",
        "Meditation Centers",
      ],
      strategicValue: "High",
      description:
        "Homeworld of the Vulcan species, known for logic, philosophy, and advanced science.",
      parentTerritory: "vulcan-sector",
      subTerritories: ["shikahr", "raal", "vulcana-regar"],
      facilities: [
        "Vulcan Science Academy",
        "Mount Seleya",
        "Vulcan High Command",
      ],
      phenomena: ["Forge Desert", "Mount Seleya"],
      threats: ["Seismic Activity", "Desert Storms"],
      lastSurvey: "Stardate 98156.8",
      explorationStatus: "Colonized",
    },
    {
      id: "qonos",
      name: "Qo'noS",
      type: "planet",
      coordinates: { x: 24502, y: 198, z: 152 },
      controllingFaction: "Klingon Empire",
      securityLevel: "Restricted",
      population: 5800000000,
      resources: ["Military Training", "Honor Codes", "Warrior Culture"],
      strategicValue: "Critical",
      description:
        "Homeworld of the Klingon Empire, center of warrior culture and imperial power.",
      parentTerritory: "qonos-system",
      subTerritories: ["first-city", "ketha-lowlands", "quin-lat"],
      facilities: ["Great Hall", "Imperial Palace", "Klingon Defense Force HQ"],
      phenomena: ["Praxis Moonrise", "Volcanic Regions"],
      threats: ["Political Instability", "Honor Duels"],
      lastSurvey: "Stardate 97923.4",
      explorationStatus: "Restricted",
    },

    // Space Stations
    {
      id: "deep-space-nine",
      name: "Deep Space Nine",
      type: "station",
      coordinates: { x: 2341, y: 889, z: 121 },
      controllingFaction: "United Federation of Planets",
      securityLevel: "Caution",
      population: 7000,
      resources: ["Wormhole Access", "Trade Hub", "Strategic Position"],
      strategicValue: "Critical",
      description:
        "Former Cardassian mining station now serving as Federation outpost guarding the Bajoran wormhole.",
      parentTerritory: "bajor-system",
      subTerritories: ["ops", "promenade", "docking-bays", "habitat-ring"],
      facilities: [
        "Operations Center",
        "Security Office",
        "Infirmary",
        "Holosuites",
      ],
      phenomena: ["Wormhole Proximity", "Ore Processing"],
      threats: ["Dominion Forces", "Cardassian Remnants"],
      lastSurvey: "Stardate 98189.2",
      explorationStatus: "Contested",
    },
    {
      id: "starbase-74",
      name: "Starbase 74",
      type: "station",
      coordinates: { x: 892, y: 234, z: 67 },
      controllingFaction: "United Federation of Planets",
      securityLevel: "Safe",
      population: 12000,
      resources: ["Ship Maintenance", "R&D Facilities", "Personnel Training"],
      strategicValue: "High",
      description:
        "Major Federation starbase providing ship maintenance and strategic support in the Alpha Quadrant.",
      parentTerritory: "alpha-quadrant",
      subTerritories: [
        "docking-complex",
        "engineering-deck",
        "commercial-sector",
      ],
      facilities: ["Starship Yards", "Research Labs", "Recreation Facilities"],
      phenomena: ["Artificial Gravity Wells", "Subspace Communications Array"],
      threats: ["Minimal"],
      lastSurvey: "Stardate 98201.5",
      explorationStatus: "Colonized",
    },

    // Nebulae and Phenomena
    {
      id: "badlands",
      name: "The Badlands",
      type: "nebula",
      coordinates: { x: 1456, y: 2341, z: 89 },
      controllingFaction: "Neutral",
      securityLevel: "Hostile",
      population: 0,
      resources: ["Plasma Storms", "Sensor Interference", "Hidden Bases"],
      strategicValue: "Medium",
      description:
        "Dangerous region of plasma storms and sensor interference, often used by smugglers and rebels.",
      parentTerritory: "alpha-quadrant",
      subTerritories: [],
      facilities: ["Hidden Bases", "Maquis Strongholds"],
      phenomena: ["Plasma Storms", "Tetryon Fields", "Sensor Dead Zones"],
      threats: ["Navigation Hazards", "Maquis Activity"],
      lastSurvey: "Stardate 97456.3",
      explorationStatus: "Surveyed",
    },
    {
      id: "briar-patch",
      name: "Briar Patch",
      type: "nebula",
      coordinates: { x: 1890, y: 567, z: 234 },
      controllingFaction: "Ba'ku",
      securityLevel: "Safe",
      population: 600,
      resources: [
        "Metaphasic Radiation",
        "Regenerative Properties",
        "Natural Beauty",
      ],
      strategicValue: "High",
      description:
        "Unique nebula with metaphasic radiation that has regenerative properties, home to the Ba'ku people.",
      parentTerritory: "alpha-quadrant",
      subTerritories: ["baku-village"],
      facilities: ["Ba'ku Settlement", "Research Outposts"],
      phenomena: ["Metaphasic Radiation", "Time Dilation Effects"],
      threats: ["Son'a Interest", "Temporal Anomalies"],
      lastSurvey: "Stardate 98012.7",
      explorationStatus: "Colonized",
    },
  ];

  const factions = [
    "All",
    "United Federation of Planets",
    "Klingon Empire",
    "Romulan Star Empire",
    "Cardassian Union",
    "Dominion",
    "Borg Collective",
    "Neutral",
    "Ba'ku",
    "Bajoran Provisional Government",
    "Vulcan High Command",
  ];

  const territoryTypes = [
    "All",
    "quadrant",
    "sector",
    "system",
    "planet",
    "station",
    "nebula",
    "anomaly",
  ];

  const securityLevels = [
    "All",
    "Safe",
    "Caution",
    "Restricted",
    "Hostile",
    "Unknown",
  ];

  const filteredTerritories = territories.filter((territory) => {
    const matchesSearch =
      territory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      territory.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      territory.controllingFaction
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFaction =
      filterFaction === "All" || territory.controllingFaction === filterFaction;
    const matchesType = filterType === "All" || territory.type === filterType;
    const matchesSecurity =
      filterSecurity === "All" || territory.securityLevel === filterSecurity;

    return matchesSearch && matchesFaction && matchesType && matchesSecurity;
  });

  const getTerritoryIcon = (type: string) => {
    switch (type) {
      case "quadrant":
        return <Map className="w-5 h-5" />;
      case "sector":
        return <Compass className="w-5 h-5" />;
      case "system":
        return <Star className="w-5 h-5" />;
      case "planet":
        return <Globe className="w-5 h-5" />;
      case "station":
        return <Building className="w-5 h-5" />;
      case "nebula":
        return <Activity className="w-5 h-5" />;
      case "anomaly":
        return <Zap className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const getSecurityColor = (level: string) => {
    switch (level) {
      case "Safe":
        return "text-green-400";
      case "Caution":
        return "text-yellow-400";
      case "Restricted":
        return "text-orange-400";
      case "Hostile":
        return "text-red-400";
      case "Unknown":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  const getStrategicColor = (value: string) => {
    switch (value) {
      case "Critical":
        return "text-red-400";
      case "High":
        return "text-orange-400";
      case "Medium":
        return "text-yellow-400";
      case "Low":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          GALACTIC TERRITORIES
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode("list")}
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            className={
              viewMode === "list" ? "bg-trek-blue hover:bg-trek-blue/80" : ""
            }
          >
            <Database className="w-4 h-4 mr-2" />
            List
          </Button>
          <Button
            onClick={() => setViewMode("map")}
            variant={viewMode === "map" ? "default" : "outline"}
            size="sm"
            className={
              viewMode === "map" ? "bg-trek-blue hover:bg-trek-blue/80" : ""
            }
          >
            <Map className="w-4 h-4 mr-2" />
            Map
          </Button>
          <Button
            onClick={() => setViewMode("tree")}
            variant={viewMode === "tree" ? "default" : "outline"}
            size="sm"
            className={
              viewMode === "tree" ? "bg-trek-blue hover:bg-trek-blue/80" : ""
            }
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Hierarchy
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-trek-panel border border-trek-accent">
          <TabsTrigger
            value="overview"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="quadrants"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Quadrants
          </TabsTrigger>
          <TabsTrigger
            value="sectors"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Sectors
          </TabsTrigger>
          <TabsTrigger
            value="systems"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Systems
          </TabsTrigger>
          <TabsTrigger
            value="facilities"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Facilities
          </TabsTrigger>
          <TabsTrigger
            value="phenomena"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Phenomena
          </TabsTrigger>
        </TabsList>

        {/* Search and Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-trek-text/50" />
            <Input
              placeholder="Search territories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-trek-dark border-trek-accent pl-10"
            />
          </div>
          <Select value={filterFaction} onValueChange={setFilterFaction}>
            <SelectTrigger className="bg-trek-dark border-trek-accent">
              <SelectValue placeholder="Filter by faction" />
            </SelectTrigger>
            <SelectContent>
              {factions.map((faction) => (
                <SelectItem key={faction} value={faction}>
                  {faction}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="bg-trek-dark border-trek-accent">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {territoryTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "All"
                    ? "All Types"
                    : type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterSecurity} onValueChange={setFilterSecurity}>
            <SelectTrigger className="bg-trek-dark border-trek-accent">
              <SelectValue placeholder="Filter by security" />
            </SelectTrigger>
            <SelectContent>
              {securityLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Summary Statistics */}
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Territory Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-trek-text/70">Total Territories:</span>
                  <span className="text-trek-blue font-semibold">
                    {territories.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-trek-text/70">Quadrants:</span>
                  <span className="text-trek-blue">
                    {territories.filter((t) => t.type === "quadrant").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-trek-text/70">Star Systems:</span>
                  <span className="text-trek-blue">
                    {territories.filter((t) => t.type === "system").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-trek-text/70">Inhabited Worlds:</span>
                  <span className="text-trek-blue">
                    {
                      territories.filter(
                        (t) =>
                          t.type === "planet" &&
                          t.population &&
                          t.population > 0,
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-trek-text/70">Space Stations:</span>
                  <span className="text-trek-blue">
                    {territories.filter((t) => t.type === "station").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-trek-text/70">Phenomena:</span>
                  <span className="text-trek-blue">
                    {
                      territories.filter(
                        (t) => t.type === "nebula" || t.type === "anomaly",
                      ).length
                    }
                  </span>
                </div>
              </div>
            </Card>

            {/* Security Status */}
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Security Analysis
              </h3>
              <div className="space-y-4">
                {securityLevels.slice(1).map((level) => {
                  const count = territories.filter(
                    (t) => t.securityLevel === level,
                  ).length;
                  const percentage = (count / territories.length) * 100;
                  return (
                    <div key={level} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-trek-text/70">{level}:</span>
                        <span
                          className={`font-semibold ${getSecurityColor(level)}`}
                        >
                          {count}
                        </span>
                      </div>
                      <div className="w-full bg-trek-dark border border-trek-accent rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            level === "Safe"
                              ? "bg-green-400"
                              : level === "Caution"
                                ? "bg-yellow-400"
                                : level === "Restricted"
                                  ? "bg-orange-400"
                                  : level === "Hostile"
                                    ? "bg-red-400"
                                    : "bg-gray-400"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Strategic Assets */}
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Strategic Assets
              </h3>
              <div className="space-y-3">
                {territories
                  .filter((t) => t.strategicValue === "Critical")
                  .slice(0, 5)
                  .map((territory) => (
                    <div
                      key={territory.id}
                      className="flex items-center gap-3 p-2 bg-trek-dark/50 border border-trek-accent rounded"
                    >
                      <div className="text-red-400">
                        {getTerritoryIcon(territory.type)}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-trek-text">
                          {territory.name}
                        </div>
                        <div className="text-xs text-trek-text/70">
                          {territory.controllingFaction}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-red-400 text-red-400"
                      >
                        CRITICAL
                      </Badge>
                    </div>
                  ))}
              </div>
            </Card>
          </div>

          {/* Recent Survey Reports */}
          <Card className="bg-trek-panel border-trek-accent p-6 mt-6">
            <h3 className="text-xl font-bold text-trek-gold mb-4">
              Recent Survey Reports
            </h3>
            <div className="space-y-4">
              {territories
                .sort((a, b) => b.lastSurvey.localeCompare(a.lastSurvey))
                .slice(0, 8)
                .map((territory) => (
                  <div
                    key={territory.id}
                    className="flex items-center justify-between p-4 bg-trek-dark/50 border border-trek-accent rounded"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-trek-blue">
                        {getTerritoryIcon(territory.type)}
                      </div>
                      <div>
                        <div className="font-semibold text-trek-text">
                          {territory.name}
                        </div>
                        <div className="text-sm text-trek-text/70">
                          {territory.type.charAt(0).toUpperCase() +
                            territory.type.slice(1)}{" "}
                          • {territory.controllingFaction}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-trek-blue">
                        {territory.lastSurvey}
                      </div>
                      <Badge
                        variant="outline"
                        className={`${getSecurityColor(territory.securityLevel)} border-current`}
                      >
                        {territory.securityLevel}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="quadrants" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {territories
              .filter((t) => t.type === "quadrant")
              .map((quadrant) => (
                <Card
                  key={quadrant.id}
                  className="bg-trek-panel border-trek-accent p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-trek-blue">
                        <Map className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-trek-gold">
                        {quadrant.name}
                      </h3>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getSecurityColor(quadrant.securityLevel)} border-current`}
                    >
                      {quadrant.securityLevel}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <p className="text-trek-text/80">{quadrant.description}</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-trek-text/70">
                          Controlling Faction:
                        </span>
                        <div className="font-semibold text-trek-blue">
                          {quadrant.controllingFaction}
                        </div>
                      </div>
                      <div>
                        <span className="text-trek-text/70">Population:</span>
                        <div className="font-semibold text-trek-text">
                          {quadrant.population?.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-trek-text/70">
                          Strategic Value:
                        </span>
                        <div
                          className={`font-semibold ${getStrategicColor(quadrant.strategicValue)}`}
                        >
                          {quadrant.strategicValue}
                        </div>
                      </div>
                      <div>
                        <span className="text-trek-text/70">
                          Exploration Status:
                        </span>
                        <div className="font-semibold text-trek-text">
                          {quadrant.explorationStatus}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-trek-text/70">
                        Primary Resources:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {quadrant.resources.map((resource) => (
                          <Badge
                            key={resource}
                            variant="outline"
                            className="text-xs border-trek-accent text-trek-text"
                          >
                            {resource}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-trek-text/70">
                        Major Phenomena:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {quadrant.phenomena.map((phenomenon) => (
                          <Badge
                            key={phenomenon}
                            variant="outline"
                            className="text-xs border-trek-warning text-trek-warning"
                          >
                            {phenomenon}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {quadrant.threats.length > 0 && (
                      <div>
                        <span className="text-trek-text/70">
                          Current Threats:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {quadrant.threats.map((threat) => (
                            <Badge
                              key={threat}
                              variant="outline"
                              className="text-xs border-red-400 text-red-400"
                            >
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {threat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => setSelectedTerritory(quadrant)}
                    className="w-full mt-4 bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Detailed Analysis
                  </Button>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="sectors" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {territories
              .filter((t) => t.type === "sector")
              .map((sector) => (
                <Card
                  key={sector.id}
                  className="bg-trek-panel border-trek-accent p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Compass className="w-5 h-5 text-trek-blue" />
                      <h3 className="font-bold text-trek-text">
                        {sector.name}
                      </h3>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getSecurityColor(sector.securityLevel)} border-current`}
                    >
                      {sector.securityLevel}
                    </Badge>
                  </div>

                  <p className="text-sm text-trek-text/80 mb-3">
                    {sector.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Population:</span>
                      <span className="text-trek-text">
                        {sector.population?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">
                        Strategic Value:
                      </span>
                      <span
                        className={getStrategicColor(sector.strategicValue)}
                      >
                        {sector.strategicValue}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Last Survey:</span>
                      <span className="text-trek-blue">
                        {sector.lastSurvey}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setSelectedTerritory(sector)}
                    size="sm"
                    className="w-full mt-3 bg-trek-blue/20 hover:bg-trek-blue/40 border border-trek-blue text-trek-blue"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    Details
                  </Button>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="systems" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {territories
              .filter((t) => t.type === "system" || t.type === "planet")
              .map((system) => (
                <Card
                  key={system.id}
                  className="bg-trek-panel border-trek-accent p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {system.type === "system" ? (
                        <Star className="w-5 h-5 text-trek-warning" />
                      ) : (
                        <Globe className="w-5 h-5 text-trek-blue" />
                      )}
                      <h3 className="font-bold text-trek-text">
                        {system.name}
                      </h3>
                    </div>
                    <div className="flex gap-1">
                      <Badge
                        variant="outline"
                        className="text-xs border-trek-accent text-trek-text"
                      >
                        {system.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getSecurityColor(system.securityLevel)} border-current`}
                      >
                        {system.securityLevel}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-trek-text/80 mb-3">
                    {system.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">
                        Controlling Faction:
                      </span>
                      <span className="text-trek-text text-xs">
                        {system.controllingFaction}
                      </span>
                    </div>
                    {system.population && (
                      <div className="flex justify-between">
                        <span className="text-trek-text/70">Population:</span>
                        <span className="text-trek-text">
                          {system.population.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Coordinates:</span>
                      <span className="text-trek-blue font-mono text-xs">
                        {system.coordinates.x}, {system.coordinates.y},{" "}
                        {system.coordinates.z}
                      </span>
                    </div>
                  </div>

                  {system.resources.length > 0 && (
                    <div className="mt-3">
                      <span className="text-trek-text/70 text-sm">
                        Resources:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {system.resources.slice(0, 3).map((resource) => (
                          <Badge
                            key={resource}
                            variant="outline"
                            className="text-xs border-trek-accent text-trek-text"
                          >
                            {resource}
                          </Badge>
                        ))}
                        {system.resources.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs border-trek-accent text-trek-text"
                          >
                            +{system.resources.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => setSelectedTerritory(system)}
                    size="sm"
                    className="w-full mt-3 bg-trek-blue/20 hover:bg-trek-blue/40 border border-trek-blue text-trek-blue"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    Detailed Scan
                  </Button>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="facilities" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {territories
              .filter((t) => t.type === "station")
              .map((station) => (
                <Card
                  key={station.id}
                  className="bg-trek-panel border-trek-accent p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Building className="w-5 h-5 text-trek-gold" />
                      <h3 className="font-bold text-trek-text">
                        {station.name}
                      </h3>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getSecurityColor(station.securityLevel)} border-current`}
                    >
                      {station.securityLevel}
                    </Badge>
                  </div>

                  <p className="text-sm text-trek-text/80 mb-3">
                    {station.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Personnel:</span>
                      <span className="text-trek-text">
                        {station.population?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">
                        Strategic Value:
                      </span>
                      <span
                        className={getStrategicColor(station.strategicValue)}
                      >
                        {station.strategicValue}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Status:</span>
                      <span className="text-trek-text">
                        {station.explorationStatus}
                      </span>
                    </div>
                  </div>

                  {station.facilities.length > 0 && (
                    <div className="mt-3">
                      <span className="text-trek-text/70 text-sm">
                        Facilities:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {station.facilities.slice(0, 3).map((facility) => (
                          <Badge
                            key={facility}
                            variant="outline"
                            className="text-xs border-trek-gold text-trek-gold"
                          >
                            {facility}
                          </Badge>
                        ))}
                        {station.facilities.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs border-trek-gold text-trek-gold"
                          >
                            +{station.facilities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => setSelectedTerritory(station)}
                    size="sm"
                    className="w-full mt-3 bg-trek-gold/20 hover:bg-trek-gold/40 border border-trek-gold text-trek-gold"
                  >
                    <Building className="w-4 h-4 mr-2" />
                    Station Details
                  </Button>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="phenomena" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {territories
              .filter((t) => t.type === "nebula" || t.type === "anomaly")
              .map((phenomenon) => (
                <Card
                  key={phenomenon.id}
                  className="bg-trek-panel border-trek-accent p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-400" />
                      <h3 className="font-bold text-trek-text">
                        {phenomenon.name}
                      </h3>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getSecurityColor(phenomenon.securityLevel)} border-current`}
                    >
                      {phenomenon.securityLevel}
                    </Badge>
                  </div>

                  <p className="text-sm text-trek-text/80 mb-3">
                    {phenomenon.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Type:</span>
                      <span className="text-trek-text capitalize">
                        {phenomenon.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">
                        Strategic Value:
                      </span>
                      <span
                        className={getStrategicColor(phenomenon.strategicValue)}
                      >
                        {phenomenon.strategicValue}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Last Survey:</span>
                      <span className="text-trek-blue">
                        {phenomenon.lastSurvey}
                      </span>
                    </div>
                  </div>

                  {phenomenon.phenomena.length > 0 && (
                    <div className="mt-3">
                      <span className="text-trek-text/70 text-sm">
                        Effects:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {phenomenon.phenomena.map((effect) => (
                          <Badge
                            key={effect}
                            variant="outline"
                            className="text-xs border-purple-400 text-purple-400"
                          >
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {phenomenon.threats.length > 0 && (
                    <div className="mt-2">
                      <span className="text-trek-text/70 text-sm">
                        Hazards:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {phenomenon.threats.map((threat) => (
                          <Badge
                            key={threat}
                            variant="outline"
                            className="text-xs border-red-400 text-red-400"
                          >
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {threat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => setSelectedTerritory(phenomenon)}
                    size="sm"
                    className="w-full mt-3 bg-purple-400/20 hover:bg-purple-400/40 border border-purple-400 text-purple-400"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Phenomenon Analysis
                  </Button>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Detailed Territory Modal */}
      {selectedTerritory && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <Card className="bg-trek-panel border-trek-accent max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="text-trek-blue">
                    {getTerritoryIcon(selectedTerritory.type)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-trek-gold">
                      {selectedTerritory.name}
                    </h2>
                    <p className="text-trek-text/70 capitalize">
                      {selectedTerritory.type} •{" "}
                      {selectedTerritory.controllingFaction}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setSelectedTerritory(null)}
                  variant="ghost"
                  size="sm"
                  className="text-trek-text hover:bg-trek-accent"
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-trek-blue mb-2">
                      Description
                    </h3>
                    <p className="text-trek-text/80">
                      {selectedTerritory.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-trek-blue mb-2">
                      Territorial Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-trek-text/70">
                            Coordinates:
                          </span>
                          <div className="font-mono text-trek-blue">
                            {selectedTerritory.coordinates.x},{" "}
                            {selectedTerritory.coordinates.y},{" "}
                            {selectedTerritory.coordinates.z}
                          </div>
                        </div>
                        <div>
                          <span className="text-trek-text/70">
                            Security Level:
                          </span>
                          <div
                            className={`font-semibold ${getSecurityColor(selectedTerritory.securityLevel)}`}
                          >
                            {selectedTerritory.securityLevel}
                          </div>
                        </div>
                        <div>
                          <span className="text-trek-text/70">
                            Strategic Value:
                          </span>
                          <div
                            className={`font-semibold ${getStrategicColor(selectedTerritory.strategicValue)}`}
                          >
                            {selectedTerritory.strategicValue}
                          </div>
                        </div>
                        <div>
                          <span className="text-trek-text/70">
                            Exploration Status:
                          </span>
                          <div className="text-trek-text">
                            {selectedTerritory.explorationStatus}
                          </div>
                        </div>
                      </div>
                      {selectedTerritory.population && (
                        <div>
                          <span className="text-trek-text/70">Population:</span>
                          <div className="text-trek-text font-semibold">
                            {selectedTerritory.population.toLocaleString()}
                          </div>
                        </div>
                      )}
                      <div>
                        <span className="text-trek-text/70">Last Survey:</span>
                        <div className="text-trek-blue">
                          {selectedTerritory.lastSurvey}
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedTerritory.resources.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-trek-blue mb-2">
                        Resources
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedTerritory.resources.map((resource) => (
                          <Badge
                            key={resource}
                            variant="outline"
                            className="border-trek-accent text-trek-text"
                          >
                            {resource}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {selectedTerritory.facilities.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-trek-blue mb-2">
                        Facilities
                      </h3>
                      <div className="space-y-2">
                        {selectedTerritory.facilities.map((facility) => (
                          <div
                            key={facility}
                            className="flex items-center gap-2 p-2 bg-trek-dark/50 border border-trek-accent rounded"
                          >
                            <Building className="w-4 h-4 text-trek-gold" />
                            <span className="text-trek-text">{facility}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTerritory.phenomena.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-trek-blue mb-2">
                        Phenomena
                      </h3>
                      <div className="space-y-2">
                        {selectedTerritory.phenomena.map((phenomenon) => (
                          <div
                            key={phenomenon}
                            className="flex items-center gap-2 p-2 bg-trek-dark/50 border border-trek-accent rounded"
                          >
                            <Activity className="w-4 h-4 text-purple-400" />
                            <span className="text-trek-text">{phenomenon}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTerritory.threats.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-trek-blue mb-2">
                        Current Threats
                      </h3>
                      <div className="space-y-2">
                        {selectedTerritory.threats.map((threat) => (
                          <div
                            key={threat}
                            className="flex items-center gap-2 p-2 bg-red-400/10 border border-red-400 rounded"
                          >
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="text-red-400">{threat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTerritory.subTerritories.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-trek-blue mb-2">
                        Sub-Territories
                      </h3>
                      <div className="space-y-1">
                        {selectedTerritory.subTerritories.map((subId) => {
                          const subTerritory = territories.find(
                            (t) => t.id === subId,
                          );
                          return subTerritory ? (
                            <div
                              key={subId}
                              className="flex items-center gap-2 p-2 bg-trek-dark/50 border border-trek-accent rounded cursor-pointer hover:bg-trek-accent/20"
                              onClick={() => setSelectedTerritory(subTerritory)}
                            >
                              {getTerritoryIcon(subTerritory.type)}
                              <span className="text-trek-text">
                                {subTerritory.name}
                              </span>
                              <Badge
                                variant="outline"
                                className="ml-auto text-xs border-trek-accent text-trek-text"
                              >
                                {subTerritory.type}
                              </Badge>
                            </div>
                          ) : (
                            <div key={subId} className="text-trek-text/50">
                              {subId}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
