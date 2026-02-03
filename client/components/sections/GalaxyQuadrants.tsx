import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Map,
  Navigation,
  Star,
  Globe,
  Shield,
  AlertTriangle,
  Zap,
  Users,
  Eye,
  Crosshair,
  Rocket,
  MapPin,
  Compass,
  Target,
  Search,
  Filter,
  Download,
  FileText,
  Radio,
  Database,
  Sparkles,
} from "lucide-react";

interface Sector {
  id: string;
  name: string;
  coordinates: {
    x: number;
    y: number;
    z: number;
  };
  systems: number;
  inhabited_systems: number;
  major_powers: string[];
  strategic_importance: "Critical" | "High" | "Medium" | "Low" | "None";
  threat_level: "None" | "Low" | "Medium" | "High" | "Extreme";
  federation_presence: "Heavy" | "Moderate" | "Light" | "None";
  exploration_status:
    | "Fully Mapped"
    | "Partially Explored"
    | "Unknown"
    | "Forbidden";
  trade_routes: string[];
  anomalies: string[];
  notable_features: string[];
}

interface QuadrantData {
  name: "Alpha" | "Beta" | "Gamma" | "Delta";
  description: string;
  federation_control: number;
  exploration_percentage: number;
  major_powers: string[];
  capital_worlds: string[];
  strategic_locations: string[];
  wormholes: string[];
  sectors: Sector[];
  threats: string[];
  opportunities: string[];
  recent_activity: string[];
  dominant_species: string[];
  resource_richness: number;
  political_stability: number;
}

interface GalaxyQuadrantsProps {
  activeSubmenu?: string;
}

export function GalaxyQuadrants({ activeSubmenu }: GalaxyQuadrantsProps) {
  const defaultTab = "overview";
  const [activeTab, setActiveTab] = useState(activeSubmenu || defaultTab);

  useEffect(() => {
    setActiveTab(activeSubmenu || defaultTab);
  }, [activeSubmenu]);
  const [selectedQuadrant, setSelectedQuadrant] = useState("Alpha");
  const [searchFilter, setSearchFilter] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");

  const quadrants: Record<string, QuadrantData> = {
    Alpha: {
      name: "Alpha",
      description:
        "Heart of the United Federation of Planets, containing Earth, Vulcan, Andoria, and most core Federation worlds. Center of Federation political and military power.",
      federation_control: 78,
      exploration_percentage: 87,
      major_powers: [
        "United Federation of Planets",
        "Klingon Empire",
        "Romulan Star Empire",
        "Ferengi Alliance",
      ],
      capital_worlds: [
        "Earth",
        "Vulcan",
        "Andoria",
        "Tellar Prime",
        "Ferenginar",
      ],
      strategic_locations: [
        "Deep Space Nine",
        "Starbase 375",
        "Utopia Planitia",
        "Wolf 359",
      ],
      wormholes: ["Bajoran Wormhole"],
      threats: [
        "Borg Incursions",
        "Dominion Influence",
        "Romulan Intelligence",
      ],
      opportunities: [
        "Trade Expansion",
        "Diplomatic Alliances",
        "Scientific Collaboration",
      ],
      recent_activity: [
        "Increased Starfleet patrols near Romulan border",
        "New trade agreements with Ferengi Alliance",
        "Deep Space Nine reporting stable wormhole activity",
      ],
      dominant_species: [
        "Humans",
        "Vulcans",
        "Andorians",
        "Tellarites",
        "Ferengi",
        "Klingons",
      ],
      resource_richness: 85,
      political_stability: 92,
      sectors: [
        {
          id: "A-001",
          name: "Sol Sector",
          coordinates: { x: 0, y: 0, z: 0 },
          systems: 47,
          inhabited_systems: 23,
          major_powers: ["United Federation of Planets"],
          strategic_importance: "Critical",
          threat_level: "None",
          federation_presence: "Heavy",
          exploration_status: "Fully Mapped",
          trade_routes: ["Earth-Vulcan Corridor", "Terra-Alpha Centauri Route"],
          anomalies: [],
          notable_features: [
            "Earth",
            "Starfleet Headquarters",
            "Utopia Planitia Shipyards",
          ],
        },
        {
          id: "A-002",
          name: "Vulcan Sector",
          coordinates: { x: 16, y: 12, z: 3 },
          systems: 23,
          inhabited_systems: 15,
          major_powers: ["United Federation of Planets"],
          strategic_importance: "Critical",
          threat_level: "None",
          federation_presence: "Heavy",
          exploration_status: "Fully Mapped",
          trade_routes: ["Vulcan-Earth Express", "T'Khasi Trading Route"],
          anomalies: ["Vulcan Science Academy Research Zones"],
          notable_features: [
            "Vulcan",
            "Vulcan Science Academy",
            "Mount Seleya",
          ],
        },
        {
          id: "A-003",
          name: "Bajor Sector",
          coordinates: { x: 23, y: -8, z: 15 },
          systems: 31,
          inhabited_systems: 12,
          major_powers: ["United Federation of Planets", "Bajoran Republic"],
          strategic_importance: "Critical",
          threat_level: "Medium",
          federation_presence: "Heavy",
          exploration_status: "Fully Mapped",
          trade_routes: ["Bajoran Trade Circle", "Gamma Quadrant Supply Line"],
          anomalies: ["Bajoran Wormhole", "Celestial Temple"],
          notable_features: [
            "Deep Space Nine",
            "Bajoran Wormhole",
            "Cardassia Prime",
          ],
        },
        {
          id: "A-004",
          name: "Risa Sector",
          coordinates: { x: -12, y: 28, z: -5 },
          systems: 19,
          inhabited_systems: 8,
          major_powers: ["United Federation of Planets"],
          strategic_importance: "Low",
          threat_level: "None",
          federation_presence: "Light",
          exploration_status: "Fully Mapped",
          trade_routes: ["Risa Resort Circuit", "Pleasure Planet Network"],
          anomalies: [],
          notable_features: [
            "Risa",
            "Resort Complexes",
            "Weather Control Networks",
          ],
        },
      ],
    },

    Beta: {
      name: "Beta",
      description:
        "Contains the powerful Klingon Empire and Romulan Star Empire. Region of military tensions, warrior cultures, and complex political maneuvering.",
      federation_control: 34,
      exploration_percentage: 71,
      major_powers: [
        "Klingon Empire",
        "Romulan Star Empire",
        "Gorn Hegemony",
        "Metron Consortium",
      ],
      capital_worlds: ["Q'onos", "Romulus", "Remus", "Gorn"],
      strategic_locations: [
        "Khitomer",
        "Narendra III",
        "Romulan Neutral Zone",
        "Klingon-Federation Border",
      ],
      wormholes: [],
      threats: [
        "Klingon-Romulan Tensions",
        "Neutral Zone Violations",
        "Gorn Territorial Expansion",
      ],
      opportunities: [
        "Klingon Alliance",
        "Resource Extraction",
        "Strategic Positioning",
      ],
      recent_activity: [
        "Klingon Empire expanding fleet operations",
        "Romulan Star Empire increasing border patrols",
        "Gorn Hegemony diplomatic overtures to Federation",
      ],
      dominant_species: ["Klingons", "Romulans", "Gorn", "Metrons"],
      resource_richness: 78,
      political_stability: 65,
      sectors: [
        {
          id: "B-001",
          name: "Klingon Core Sector",
          coordinates: { x: 45, y: -23, z: 12 },
          systems: 67,
          inhabited_systems: 34,
          major_powers: ["Klingon Empire"],
          strategic_importance: "Critical",
          threat_level: "Medium",
          federation_presence: "Light",
          exploration_status: "Partially Explored",
          trade_routes: ["Klingon Trade Network", "Warrior's Highway"],
          anomalies: ["Praxis Debris Field"],
          notable_features: ["Q'onos", "Klingon High Council", "Boreth"],
        },
        {
          id: "B-002",
          name: "Romulan Neutral Zone",
          coordinates: { x: 34, y: 45, z: -8 },
          systems: 23,
          inhabited_systems: 7,
          major_powers: ["Romulan Star Empire", "United Federation of Planets"],
          strategic_importance: "Critical",
          threat_level: "High",
          federation_presence: "Moderate",
          exploration_status: "Forbidden",
          trade_routes: [],
          anomalies: ["Subspace Distortions", "Cloaking Detection Grids"],
          notable_features: [
            "Neutral Zone Stations",
            "Monitoring Posts",
            "Treaty Boundaries",
          ],
        },
        {
          id: "B-003",
          name: "Gorn Hegemony",
          coordinates: { x: 67, y: -12, z: 34 },
          systems: 41,
          inhabited_systems: 19,
          major_powers: ["Gorn Hegemony"],
          strategic_importance: "High",
          threat_level: "Medium",
          federation_presence: "None",
          exploration_status: "Partially Explored",
          trade_routes: ["Gorn Supply Lines"],
          anomalies: ["Crystal Formation Zones"],
          notable_features: [
            "Gorn Capital",
            "Asteroid Mining Operations",
            "Defense Platforms",
          ],
        },
      ],
    },

    Gamma: {
      name: "Gamma",
      description:
        "Dominated by the Dominion, a vast interstellar empire ruled by the Founders. Contains the most diverse alien species and advanced technologies, but remains largely hostile territory.",
      federation_control: 8,
      exploration_percentage: 23,
      major_powers: [
        "The Dominion",
        "Karemma Commerce Guild",
        "T-Rogorans",
        "Dosi",
      ],
      capital_worlds: ["Founders' Homeworld", "Karemma", "T-Rogoran Prime"],
      strategic_locations: [
        "Idran System",
        "Dominion Shipyards",
        "Ketracel White Facilities",
      ],
      wormholes: ["Bajoran Wormhole (Terminus)"],
      threats: [
        "Dominion Military",
        "Jem'Hadar Fleets",
        "Founder Infiltrators",
        "Unknown Alien Species",
      ],
      opportunities: [
        "Scientific Discovery",
        "Resource Acquisition",
        "Diplomatic Relations",
      ],
      recent_activity: [
        "Dominion fleet movements reported",
        "New species making contact through wormhole",
        "Increased Jem'Hadar patrol activity",
      ],
      dominant_species: [
        "Founders",
        "Vorta",
        "Jem'Hadar",
        "Karemma",
        "Dosi",
        "T-Rogorans",
      ],
      resource_richness: 94,
      political_stability: 87,
      sectors: [
        {
          id: "G-001",
          name: "Idran Sector",
          coordinates: { x: 0, y: 0, z: 70000 },
          systems: 156,
          inhabited_systems: 89,
          major_powers: ["The Dominion"],
          strategic_importance: "Critical",
          threat_level: "Extreme",
          federation_presence: "None",
          exploration_status: "Partially Explored",
          trade_routes: ["Dominion Supply Network"],
          anomalies: ["Wormhole Terminus", "Subspace Phenomena"],
          notable_features: [
            "Bajoran Wormhole Exit",
            "Dominion Outposts",
            "First Contact Stations",
          ],
        },
        {
          id: "G-002",
          name: "Karemma Territory",
          coordinates: { x: 234, y: -156, z: 70123 },
          systems: 78,
          inhabited_systems: 45,
          major_powers: ["Karemma Commerce Guild", "The Dominion"],
          strategic_importance: "High",
          threat_level: "Medium",
          federation_presence: "None",
          exploration_status: "Unknown",
          trade_routes: ["Karemma Trade Routes", "Dominion Commerce Network"],
          anomalies: [],
          notable_features: [
            "Karemma Homeworld",
            "Trading Posts",
            "Commercial Stations",
          ],
        },
        {
          id: "G-003",
          name: "Founder Territory",
          coordinates: { x: -456, y: 789, z: 71000 },
          systems: 234,
          inhabited_systems: 156,
          major_powers: ["The Dominion"],
          strategic_importance: "Critical",
          threat_level: "Extreme",
          federation_presence: "None",
          exploration_status: "Forbidden",
          trade_routes: ["Dominion Command Network"],
          anomalies: ["Changeling Anomalies", "Great Link Phenomena"],
          notable_features: [
            "Founders' Homeworld",
            "Dominion Capital",
            "Vorta Cloning Facilities",
          ],
        },
      ],
    },

    Delta: {
      name: "Delta",
      description:
        "Most distant and unexplored quadrant, home to the Borg Collective and countless unknown species. Known primarily through USS Voyager's seven-year journey and Borg encounters.",
      federation_control: 2,
      exploration_percentage: 15,
      major_powers: [
        "Borg Collective",
        "Vidiian Sodality",
        "Kazon Sects",
        "Talaxian Government",
        "Malon Export",
      ],
      capital_worlds: ["Borg Unicomplex", "Vidiia", "Talaxia"],
      strategic_locations: [
        "Borg Space",
        "Nekrit Expanse",
        "Void",
        "Malon Space",
      ],
      wormholes: [],
      threats: [
        "Borg Collective",
        "Species 8472",
        "Vidiian Phage",
        "Kazon Aggression",
        "Hirogen Hunters",
      ],
      opportunities: [
        "Advanced Technology",
        "New Scientific Discoveries",
        "Unknown Resources",
      ],
      recent_activity: [
        "Borg Collective showing reduced activity",
        "USS Voyager data analysis ongoing",
        "Long-range probes detecting new civilizations",
      ],
      dominant_species: [
        "Borg",
        "Vidiians",
        "Kazon",
        "Talaxians",
        "Hirogen",
        "Malon",
        "Species 8472",
      ],
      resource_richness: 89,
      political_stability: 34,
      sectors: [
        {
          id: "D-001",
          name: "Borg Space",
          coordinates: { x: 45000, y: 23000, z: 12000 },
          systems: 2847,
          inhabited_systems: 2847,
          major_powers: ["Borg Collective"],
          strategic_importance: "Critical",
          threat_level: "Extreme",
          federation_presence: "None",
          exploration_status: "Forbidden",
          trade_routes: [],
          anomalies: ["Transwarp Conduits", "Borg Complexes"],
          notable_features: [
            "Borg Unicomplex",
            "Transwarp Hub",
            "Assimilation Centers",
          ],
        },
        {
          id: "D-002",
          name: "Kazon Territory",
          coordinates: { x: 34000, y: -12000, z: 8000 },
          systems: 167,
          inhabited_systems: 89,
          major_powers: ["Kazon Sects"],
          strategic_importance: "Medium",
          threat_level: "High",
          federation_presence: "None",
          exploration_status: "Partially Explored",
          trade_routes: ["Kazon Trade Networks"],
          anomalies: [],
          notable_features: [
            "Kazon Homeworlds",
            "Sect Territories",
            "Resource Mines",
          ],
        },
        {
          id: "D-003",
          name: "Talaxian Space",
          coordinates: { x: 28000, y: 15000, z: 6000 },
          systems: 45,
          inhabited_systems: 23,
          major_powers: ["Talaxian Government"],
          strategic_importance: "Low",
          threat_level: "Low",
          federation_presence: "None",
          exploration_status: "Partially Explored",
          trade_routes: ["Talaxian Supply Routes"],
          anomalies: [],
          notable_features: ["Talaxia", "Mining Colonies", "Trade Outposts"],
        },
      ],
    },
  };

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case "Alpha":
        return "border-trek-blue text-trek-blue";
      case "Beta":
        return "border-trek-warning text-trek-warning";
      case "Gamma":
        return "border-red-500 text-red-400";
      case "Delta":
        return "border-purple-500 text-purple-400";
      default:
        return "border-trek-text text-trek-text";
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

  const getPresenceColor = (presence: string) => {
    switch (presence) {
      case "Heavy":
        return "text-green-400";
      case "Moderate":
        return "text-trek-blue";
      case "Light":
        return "text-trek-warning";
      case "None":
        return "text-red-400";
      default:
        return "text-trek-text";
    }
  };

  const currentQuadrant = quadrants[selectedQuadrant];
  const filteredSectors = currentQuadrant.sectors.filter((sector) => {
    const matchesSearch =
      sector.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      sector.notable_features.some((feature) =>
        feature.toLowerCase().includes(searchFilter.toLowerCase()),
      );
    const matchesThreat =
      sectorFilter === "all" || sector.threat_level === sectorFilter;
    return matchesSearch && matchesThreat;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          GALAXY QUADRANTS
        </h2>
        <div className="flex gap-2">
          <Button className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark font-semibold">
            <Eye className="w-4 h-4 mr-2" />
            Deep Scan
          </Button>
          <Button
            variant="outline"
            className="border-trek-accent text-trek-text hover:bg-trek-accent"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Maps
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-trek-panel border border-trek-accent">
          <TabsTrigger
            value="overview"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Quadrant Overview
          </TabsTrigger>
          <TabsTrigger
            value="sectors"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Sector Analysis
          </TabsTrigger>
          <TabsTrigger
            value="strategic"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Strategic Map
          </TabsTrigger>
          <TabsTrigger
            value="intelligence"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Intelligence
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            {Object.entries(quadrants).map(([key, quadrant]) => (
              <Button
                key={key}
                variant={selectedQuadrant === key ? "default" : "outline"}
                onClick={() => setSelectedQuadrant(key)}
                className={`p-6 h-auto flex-col ${
                  selectedQuadrant === key
                    ? "bg-trek-blue text-trek-dark"
                    : `border-trek-accent text-trek-text hover:bg-trek-accent ${getQuadrantColor(key)}`
                }`}
              >
                <div className="text-lg font-bold mb-2">
                  {quadrant.name} Quadrant
                </div>
                <div className="text-xs opacity-70">
                  {quadrant.federation_control}% Federation Control
                </div>
                <div className="text-xs opacity-70">
                  {quadrant.exploration_percentage}% Explored
                </div>
              </Button>
            ))}
          </div>

          <Card className="bg-trek-panel border-trek-accent p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-trek-gold mb-2">
                  {currentQuadrant.name} Quadrant
                </h3>
                <p className="text-trek-text/80 max-w-3xl">
                  {currentQuadrant.description}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`${getQuadrantColor(selectedQuadrant)} border-2`}
              >
                {selectedQuadrant} Quadrant
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-trek-gold mb-3">
                  Control & Exploration
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Federation Control</span>
                      <span>{currentQuadrant.federation_control}%</span>
                    </div>
                    <Progress
                      value={currentQuadrant.federation_control}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Exploration Progress</span>
                      <span>{currentQuadrant.exploration_percentage}%</span>
                    </div>
                    <Progress
                      value={currentQuadrant.exploration_percentage}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Resource Richness</span>
                      <span>{currentQuadrant.resource_richness}%</span>
                    </div>
                    <Progress
                      value={currentQuadrant.resource_richness}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Political Stability</span>
                      <span>{currentQuadrant.political_stability}%</span>
                    </div>
                    <Progress
                      value={currentQuadrant.political_stability}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-trek-gold mb-3">
                  Major Powers
                </h4>
                <div className="space-y-2">
                  {currentQuadrant.major_powers.map((power) => (
                    <div key={power} className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-trek-blue" />
                      <span className="text-sm">{power}</span>
                    </div>
                  ))}
                </div>

                <h4 className="font-semibold text-trek-gold mb-3 mt-4">
                  Capital Worlds
                </h4>
                <div className="space-y-2">
                  {currentQuadrant.capital_worlds.map((world) => (
                    <div key={world} className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-trek-gold" />
                      <span className="text-sm">{world}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-trek-gold mb-3">
                  Strategic Locations
                </h4>
                <div className="space-y-2">
                  {currentQuadrant.strategic_locations.map((location) => (
                    <div key={location} className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-red-400" />
                      <span className="text-sm">{location}</span>
                    </div>
                  ))}
                </div>

                {currentQuadrant.wormholes.length > 0 && (
                  <>
                    <h4 className="font-semibold text-trek-gold mb-3 mt-4">
                      Wormholes
                    </h4>
                    <div className="space-y-2">
                      {currentQuadrant.wormholes.map((wormhole) => (
                        <div key={wormhole} className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <span className="text-sm">{wormhole}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-trek-gold mb-3">
                  Primary Threats
                </h4>
                <div className="space-y-2">
                  {currentQuadrant.threats.map((threat) => (
                    <div key={threat} className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-sm">{threat}</span>
                    </div>
                  ))}
                </div>

                <h4 className="font-semibold text-trek-gold mb-3 mt-4">
                  Opportunities
                </h4>
                <div className="space-y-2">
                  {currentQuadrant.opportunities.map((opportunity) => (
                    <div key={opportunity} className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-green-400" />
                      <span className="text-sm">{opportunity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-trek-gold mb-3">
                  Recent Activity
                </h4>
                <div className="space-y-2">
                  {currentQuadrant.recent_activity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Radio className="w-4 h-4 text-trek-blue mt-0.5" />
                      <span className="text-sm">{activity}</span>
                    </div>
                  ))}
                </div>

                <h4 className="font-semibold text-trek-gold mb-3 mt-4">
                  Dominant Species
                </h4>
                <div className="flex flex-wrap gap-1">
                  {currentQuadrant.dominant_species.map((species) => (
                    <Badge
                      key={species}
                      variant="outline"
                      className="text-xs border-trek-blue text-trek-blue"
                    >
                      {species}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sectors" className="mt-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 items-center">
              <Select
                value={selectedQuadrant}
                onValueChange={setSelectedQuadrant}
              >
                <SelectTrigger className="w-48 bg-trek-panel border-trek-accent">
                  <SelectValue placeholder="Select Quadrant" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(quadrants).map((quadrant) => (
                    <SelectItem key={quadrant} value={quadrant}>
                      {quadrant} Quadrant
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex-1 min-w-64">
                <Input
                  placeholder="Search sectors..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="bg-trek-panel border-trek-accent"
                />
              </div>
              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger className="w-48 bg-trek-panel border-trek-accent">
                  <SelectValue placeholder="Filter by threat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Threat Levels</SelectItem>
                  <SelectItem value="None">No Threat</SelectItem>
                  <SelectItem value="Low">Low Threat</SelectItem>
                  <SelectItem value="Medium">Medium Threat</SelectItem>
                  <SelectItem value="High">High Threat</SelectItem>
                  <SelectItem value="Extreme">Extreme Threat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {filteredSectors.map((sector) => (
                <Card
                  key={sector.id}
                  className="bg-trek-panel border-trek-accent p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-bold text-trek-gold">
                          {sector.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="border-trek-blue text-trek-blue"
                        >
                          {sector.id}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={`bg-${getImportanceColor(sector.strategic_importance).split("-")[1]}/20 ${getImportanceColor(sector.strategic_importance)} border-${getImportanceColor(sector.strategic_importance).split("-")[1]}`}
                        >
                          {sector.strategic_importance} Importance
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={`bg-red-500/20 ${getThreatColor(sector.threat_level)} border-red-500`}
                        >
                          {sector.threat_level} Threat
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-trek-text/70 mb-4">
                        <div>
                          <span className="block font-medium">Coordinates</span>
                          <span>
                            {sector.coordinates.x}, {sector.coordinates.y},{" "}
                            {sector.coordinates.z}
                          </span>
                        </div>
                        <div>
                          <span className="block font-medium">Systems</span>
                          <span>
                            {sector.inhabited_systems}/{sector.systems}{" "}
                            inhabited
                          </span>
                        </div>
                        <div>
                          <span className="block font-medium">
                            Federation Presence
                          </span>
                          <span
                            className={getPresenceColor(
                              sector.federation_presence,
                            )}
                          >
                            {sector.federation_presence}
                          </span>
                        </div>
                        <div>
                          <span className="block font-medium">
                            Exploration Status
                          </span>
                          <span>{sector.exploration_status}</span>
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
                        Scan
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
                        Major Powers
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {sector.major_powers.map((power) => (
                          <Badge
                            key={power}
                            variant="outline"
                            className="text-xs border-trek-warning text-trek-warning"
                          >
                            {power}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-trek-text/70 mb-1">
                        Trade Routes
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {sector.trade_routes.map((route) => (
                          <Badge
                            key={route}
                            variant="outline"
                            className="text-xs border-trek-blue text-trek-blue"
                          >
                            {route}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {sector.notable_features.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-trek-text/70 mb-2">
                        Notable Features
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {sector.notable_features.map((feature) => (
                          <Badge
                            key={feature}
                            variant="outline"
                            className="text-xs border-trek-gold text-trek-gold"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {sector.anomalies.length > 0 && (
                    <div>
                      <p className="text-sm text-trek-text/70 mb-2">
                        Space Anomalies
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {sector.anomalies.map((anomaly) => (
                          <Badge
                            key={anomaly}
                            variant="outline"
                            className="text-xs border-purple-500 text-purple-400"
                          >
                            {anomaly}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="strategic" className="mt-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-6">
              Strategic Galactic Map
            </h3>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="relative bg-trek-dark/50 border border-trek-accent rounded-lg p-6 min-h-96">
                <h4 className="text-lg font-semibold text-trek-blue mb-4">
                  Alpha & Beta Quadrants
                </h4>
                <div className="absolute inset-6 bg-gradient-to-br from-trek-blue/20 to-trek-warning/20 rounded border border-trek-accent/30">
                  <div className="relative w-full h-full">
                    {/* Federation Territory */}
                    <div className="absolute top-4 left-4 w-16 h-16 bg-trek-blue/30 border border-trek-blue rounded-full flex items-center justify-center">
                      <span className="text-xs text-trek-blue font-bold">
                        UFP
                      </span>
                    </div>

                    {/* Klingon Empire */}
                    <div className="absolute top-4 right-4 w-16 h-16 bg-trek-warning/30 border border-trek-warning rounded-full flex items-center justify-center">
                      <span className="text-xs text-trek-warning font-bold">
                        KLI
                      </span>
                    </div>

                    {/* Romulan Empire */}
                    <div className="absolute bottom-4 right-4 w-16 h-16 bg-green-500/30 border border-green-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-green-400 font-bold">
                        ROM
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative bg-trek-dark/50 border border-trek-accent rounded-lg p-6 min-h-96">
                <h4 className="text-lg font-semibold text-purple-400 mb-4">
                  Gamma & Delta Quadrants
                </h4>
                <div className="absolute inset-6 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded border border-trek-accent/30">
                  <div className="relative w-full h-full">
                    {/* Dominion */}
                    <div className="absolute top-4 left-4 w-16 h-16 bg-red-500/30 border border-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-red-400 font-bold">
                        DOM
                      </span>
                    </div>

                    {/* Borg Collective */}
                    <div className="absolute bottom-4 right-4 w-16 h-16 bg-purple-500/30 border border-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-purple-400 font-bold">
                        BRG
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-trek-dark/30 border-trek-accent p-4">
                <h4 className="font-semibold text-trek-gold mb-3">
                  Federation Space
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Controlled Systems</span>
                    <span className="text-trek-blue">2,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Member Worlds</span>
                    <span className="text-trek-blue">150+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Starfleet Vessels</span>
                    <span className="text-trek-blue">8,000+</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-trek-dark/30 border-trek-accent p-4">
                <h4 className="font-semibold text-trek-gold mb-3">
                  Threat Assessment
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Critical Threats</span>
                    <span className="text-red-400">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>High Alert Zones</span>
                    <span className="text-trek-warning">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Patrol Routes</span>
                    <span className="text-trek-blue">847</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-trek-dark/30 border-trek-accent p-4">
                <h4 className="font-semibold text-trek-gold mb-3">
                  Exploration Status
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Mapped Systems</span>
                    <span className="text-green-400">67%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Missions</span>
                    <span className="text-trek-blue">234</span>
                  </div>
                  <div className="flex justify-between">
                    <span>New Discoveries</span>
                    <span className="text-trek-gold">47/year</span>
                  </div>
                </div>
              </Card>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="intelligence" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Intelligence Summary
              </h3>
              <div className="space-y-4">
                <div className="p-3 border border-trek-accent rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <h4 className="font-semibold text-red-400">
                      Priority Alpha
                    </h4>
                  </div>
                  <p className="text-sm text-trek-text/80">
                    Borg Collective showing reduced transwarp activity. Possible
                    internal disruption following Voyager encounters.
                  </p>
                </div>

                <div className="p-3 border border-trek-accent rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Radio className="w-4 h-4 text-trek-warning" />
                    <h4 className="font-semibold text-trek-warning">
                      Priority Beta
                    </h4>
                  </div>
                  <p className="text-sm text-trek-text/80">
                    Romulan Star Empire increasing cloaked ship patrols along
                    Neutral Zone. Possible new mining operations detected.
                  </p>
                </div>

                <div className="p-3 border border-trek-accent rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-trek-blue" />
                    <h4 className="font-semibold text-trek-blue">
                      Intelligence Update
                    </h4>
                  </div>
                  <p className="text-sm text-trek-text/80">
                    New contact established with previously unknown species in
                    Delta Quadrant via long-range probe network.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Surveillance Networks
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Long-Range Sensor Arrays</span>
                  <Badge
                    variant="outline"
                    className="border-trek-blue text-trek-blue"
                  >
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Deep Space Monitoring</span>
                  <Badge
                    variant="outline"
                    className="border-trek-blue text-trek-blue"
                  >
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Border Patrol Network</span>
                  <Badge
                    variant="outline"
                    className="border-trek-blue text-trek-blue"
                  >
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subspace Communication</span>
                  <Badge
                    variant="outline"
                    className="border-trek-blue text-trek-blue"
                  >
                    Nominal
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Automated Probe Network</span>
                  <Badge
                    variant="outline"
                    className="border-trek-warning text-trek-warning"
                  >
                    Deploying
                  </Badge>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-trek-accent">
                <h4 className="font-semibold text-trek-gold mb-3">
                  Current Operations
                </h4>
                <div className="text-sm space-y-2">
                  <div>• Deep space probe deployment to Delta Quadrant</div>
                  <div>• Enhanced monitoring of Borg space boundaries</div>
                  <div>• Joint intelligence sharing with Klingon Empire</div>
                  <div>
                    • Diplomatic intelligence gathering in Gamma Quadrant
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
