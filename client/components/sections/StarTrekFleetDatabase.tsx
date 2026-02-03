import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  Rocket,
  Shield,
  Zap,
  Users,
  Calendar,
  Star,
  Target,
  Search,
  Filter,
  Info,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface Starship {
  id: string;
  name: string;
  registry: string;
  class: string;
  type: string;
  era: string;
  affiliation: string;
  status:
    | "Active"
    | "Destroyed"
    | "Missing"
    | "Decommissioned"
    | "Under Construction";
  captain?: string;
  crew: number;
  launched: number;
  specifications: {
    length: number;
    beam: number;
    height: number;
    decks: number;
    mass: number;
    warpSpeed: number;
    impulseSpeed: number;
  };
  armament: {
    phasers: number;
    torpedoes: number;
    shields: number;
    armor: number;
  };
  missions: string[];
  notableEvents: string[];
  show: string;
}

const STAR_TREK_FLEET: Starship[] = [
  // The Original Series
  {
    id: "enterprise-1701",
    name: "USS Enterprise",
    registry: "NCC-1701",
    class: "Constitution",
    type: "Heavy Cruiser",
    era: "23rd Century",
    affiliation: "United Federation of Planets",
    status: "Destroyed",
    captain: "James T. Kirk",
    crew: 430,
    launched: 2245,
    specifications: {
      length: 288,
      beam: 127,
      height: 72,
      decks: 23,
      mass: 190000,
      warpSpeed: 8.0,
      impulseSpeed: 0.25,
    },
    armament: {
      phasers: 12,
      torpedoes: 6,
      shields: 85,
      armor: 70,
    },
    missions: [
      "Five-year mission",
      "Deep space exploration",
      "First contact protocols",
    ],
    notableEvents: [
      "Khan encounter",
      "Genesis Project",
      "Destruction at Genesis Planet",
    ],
    show: "The Original Series",
  },
  {
    id: "enterprise-1701-a",
    name: "USS Enterprise",
    registry: "NCC-1701-A",
    class: "Constitution (Refit)",
    type: "Heavy Cruiser",
    era: "23rd Century",
    affiliation: "United Federation of Planets",
    status: "Decommissioned",
    captain: "James T. Kirk",
    crew: 430,
    launched: 2286,
    specifications: {
      length: 305,
      beam: 141,
      height: 71,
      decks: 23,
      mass: 210000,
      warpSpeed: 8.0,
      impulseSpeed: 0.25,
    },
    armament: {
      phasers: 12,
      torpedoes: 6,
      shields: 90,
      armor: 75,
    },
    missions: ["Whale Probe crisis", "Klingon peace negotiations"],
    notableEvents: ["Time travel to 1986", "Khitomer Conference"],
    show: "The Original Series Movies",
  },

  // The Next Generation
  {
    id: "enterprise-1701-d",
    name: "USS Enterprise",
    registry: "NCC-1701-D",
    class: "Galaxy",
    type: "Explorer",
    era: "24th Century",
    affiliation: "United Federation of Planets",
    status: "Destroyed",
    captain: "Jean-Luc Picard",
    crew: 1012,
    launched: 2363,
    specifications: {
      length: 641,
      beam: 463,
      height: 195,
      decks: 42,
      mass: 4500000,
      warpSpeed: 9.6,
      impulseSpeed: 0.25,
    },
    armament: {
      phasers: 14,
      torpedoes: 10,
      shields: 95,
      armor: 80,
    },
    missions: [
      "Exploration of unknown space",
      "Diplomatic missions",
      "Scientific research",
    ],
    notableEvents: [
      "First contact with Q",
      "Borg encounters",
      "Destruction at Veridian III",
    ],
    show: "The Next Generation",
  },
  {
    id: "enterprise-1701-e",
    name: "USS Enterprise",
    registry: "NCC-1701-E",
    class: "Sovereign",
    type: "Explorer",
    era: "24th Century",
    affiliation: "United Federation of Planets",
    status: "Active",
    captain: "Jean-Luc Picard",
    crew: 855,
    launched: 2372,
    specifications: {
      length: 685,
      beam: 250,
      height: 88,
      decks: 29,
      mass: 3200000,
      warpSpeed: 9.9,
      impulseSpeed: 0.25,
    },
    armament: {
      phasers: 16,
      torpedoes: 12,
      shields: 98,
      armor: 85,
    },
    missions: ["Borg incursions", "Dominion War", "Romulan conflicts"],
    notableEvents: [
      "Battle of Sector 001",
      "First Contact with Vulcans",
      "Ba'ku incident",
    ],
    show: "TNG Movies",
  },

  // Deep Space Nine
  {
    id: "defiant",
    name: "USS Defiant",
    registry: "NX-74205",
    class: "Defiant",
    type: "Escort",
    era: "24th Century",
    affiliation: "United Federation of Planets",
    status: "Destroyed",
    captain: "Benjamin Sisko",
    crew: 50,
    launched: 2370,
    specifications: {
      length: 170,
      beam: 134,
      height: 30,
      decks: 5,
      mass: 355000,
      warpSpeed: 9.5,
      impulseSpeed: 0.25,
    },
    armament: {
      phasers: 8,
      torpedoes: 4,
      shields: 92,
      armor: 95,
    },
    missions: [
      "Dominion War operations",
      "Anti-Borg warfare",
      "Deep space patrol",
    ],
    notableEvents: [
      "First Federation cloaking device",
      "Dominion War battles",
      "Destruction by Breen",
    ],
    show: "Deep Space Nine",
  },

  // Voyager
  {
    id: "voyager",
    name: "USS Voyager",
    registry: "NCC-74656",
    class: "Intrepid",
    type: "Long Range Science Vessel",
    era: "24th Century",
    affiliation: "United Federation of Planets",
    status: "Active",
    captain: "Kathryn Janeway",
    crew: 150,
    launched: 2371,
    specifications: {
      length: 344,
      beam: 130,
      height: 64,
      decks: 15,
      mass: 700000,
      warpSpeed: 9.975,
      impulseSpeed: 0.25,
    },
    armament: {
      phasers: 13,
      torpedoes: 5,
      shields: 90,
      armor: 75,
    },
    missions: [
      "Delta Quadrant exploration",
      "Journey home from Delta Quadrant",
    ],
    notableEvents: [
      "Stranded in Delta Quadrant",
      "Borg alliance",
      "Return to Alpha Quadrant",
    ],
    show: "Voyager",
  },

  // Enterprise
  {
    id: "enterprise-nx-01",
    name: "Enterprise",
    registry: "NX-01",
    class: "NX",
    type: "Explorer",
    era: "22nd Century",
    affiliation: "United Earth",
    status: "Decommissioned",
    captain: "Jonathan Archer",
    crew: 83,
    launched: 2151,
    specifications: {
      length: 225,
      beam: 136,
      height: 33,
      decks: 7,
      mass: 80000,
      warpSpeed: 5.2,
      impulseSpeed: 0.25,
    },
    armament: {
      phasers: 6,
      torpedoes: 8,
      shields: 0,
      armor: 60,
    },
    missions: [
      "First deep space exploration",
      "Xindi crisis",
      "Founding of Federation",
    ],
    notableEvents: [
      "First warp 5 ship",
      "Temporal Cold War",
      "Coalition of Planets formation",
    ],
    show: "Enterprise",
  },

  // Discovery
  {
    id: "discovery",
    name: "USS Discovery",
    registry: "NCC-1031",
    class: "Crossfield",
    type: "Science Vessel",
    era: "23rd Century",
    affiliation: "United Federation of Planets",
    status: "Active",
    captain: "Michael Burnham",
    crew: 136,
    launched: 2256,
    specifications: {
      length: 750,
      beam: 250,
      height: 100,
      decks: 15,
      mass: 223000,
      warpSpeed: 9.0,
      impulseSpeed: 0.25,
    },
    armament: {
      phasers: 10,
      torpedoes: 8,
      shields: 88,
      armor: 70,
    },
    missions: [
      "Spore drive research",
      "Klingon War",
      "Temporal investigations",
    ],
    notableEvents: [
      "Spore drive development",
      "Mirror Universe travel",
      "Time travel to 32nd century",
    ],
    show: "Discovery",
  },

  // Klingon Ships
  {
    id: "klingon-bird-of-prey",
    name: "IKS Rotarran",
    registry: "B'rel Class",
    class: "Bird-of-Prey",
    type: "Scout/Raider",
    era: "24th Century",
    affiliation: "Klingon Empire",
    status: "Active",
    captain: "Martok",
    crew: 12,
    launched: 2340,
    specifications: {
      length: 110,
      beam: 80,
      height: 20,
      decks: 4,
      mass: 8000,
      warpSpeed: 9.0,
      impulseSpeed: 0.25,
    },
    armament: {
      phasers: 6,
      torpedoes: 4,
      shields: 70,
      armor: 85,
    },
    missions: ["Dominion War", "Honor raids", "Border patrol"],
    notableEvents: [
      "Dominion War battles",
      "Worf's command",
      "Deep Space Nine operations",
    ],
    show: "Deep Space Nine",
  },

  // Romulan Ships
  {
    id: "romulan-warbird",
    name: "IRW Khazara",
    registry: "D'deridex Class",
    class: "Warbird",
    type: "Battlecruiser",
    era: "24th Century",
    affiliation: "Romulan Star Empire",
    status: "Active",
    captain: "Toreth",
    crew: 1500,
    launched: 2344,
    specifications: {
      length: 1353,
      beam: 772,
      height: 285,
      decks: 30,
      mass: 4320000,
      warpSpeed: 9.6,
      impulseSpeed: 0.22,
    },
    armament: {
      phasers: 20,
      torpedoes: 12,
      shields: 95,
      armor: 90,
    },
    missions: [
      "Border patrol",
      "Intelligence operations",
      "Military campaigns",
    ],
    notableEvents: ["Neutral Zone incidents", "Dominion War", "Shinzon crisis"],
    show: "The Next Generation",
  },

  // Borg Ships
  {
    id: "borg-cube",
    name: "Borg Cube",
    registry: "Tactical Cube 138",
    class: "Cube",
    type: "Assault Ship",
    era: "24th Century",
    affiliation: "Borg Collective",
    status: "Destroyed",
    captain: "Borg Queen",
    crew: 129000,
    launched: 0,
    specifications: {
      length: 3000,
      beam: 3000,
      height: 3000,
      decks: 600,
      mass: 90000000,
      warpSpeed: 9.99,
      impulseSpeed: 0.3,
    },
    armament: {
      phasers: 50,
      torpedoes: 0,
      shields: 99,
      armor: 98,
    },
    missions: ["Assimilation", "Sector conquest", "Technology acquisition"],
    notableEvents: ["Wolf 359", "Battle of Sector 001", "Queen's destruction"],
    show: "The Next Generation",
  },
];

export default function StarTrekFleetDatabase() {
  const [ships, setShips] = useState<Starship[]>(STAR_TREK_FLEET);
  const [selectedShip, setSelectedShip] = useState<Starship | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAffiliation, setFilterAffiliation] = useState("All");
  const [filterClass, setFilterClass] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterShow, setFilterShow] = useState("All");

  const affiliations = [...new Set(ships.map((ship) => ship.affiliation))];
  const classes = [...new Set(ships.map((ship) => ship.class))];
  const statuses = [...new Set(ships.map((ship) => ship.status))];
  const shows = [...new Set(ships.map((ship) => ship.show))];

  const filteredShips = ships.filter((ship) => {
    const matchesSearch =
      ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ship.registry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ship.captain?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAffiliation =
      filterAffiliation === "All" || ship.affiliation === filterAffiliation;
    const matchesClass = filterClass === "All" || ship.class === filterClass;
    const matchesStatus =
      filterStatus === "All" || ship.status === filterStatus;
    const matchesShow = filterShow === "All" || ship.show === filterShow;

    return (
      matchesSearch &&
      matchesAffiliation &&
      matchesClass &&
      matchesStatus &&
      matchesShow
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-400";
      case "Destroyed":
        return "text-red-400";
      case "Missing":
        return "text-yellow-400";
      case "Decommissioned":
        return "text-gray-400";
      case "Under Construction":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "Destroyed":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case "Missing":
        return <Search className="w-4 h-4 text-yellow-400" />;
      case "Decommissioned":
        return <Target className="w-4 h-4 text-gray-400" />;
      case "Under Construction":
        return <Rocket className="w-4 h-4 text-blue-400" />;
      default:
        return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const getAffiliationColor = (affiliation: string) => {
    if (affiliation.includes("Federation")) return "text-blue-400";
    if (affiliation.includes("Klingon")) return "text-red-400";
    if (affiliation.includes("Romulan")) return "text-green-400";
    if (affiliation.includes("Borg")) return "text-purple-400";
    if (affiliation.includes("Cardassian")) return "text-orange-400";
    return "text-gray-400";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-blue-400">STARFLEET DATABASE</h1>
        <p className="text-xl text-gray-300">
          Complete Registry of Starships Across the Galaxy
        </p>
      </div>

      <Tabs defaultValue="database" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="database">Ship Database</TabsTrigger>
          <TabsTrigger value="specifications">Ship Specs</TabsTrigger>
          <TabsTrigger value="missions">Mission Records</TabsTrigger>
          <TabsTrigger value="analytics">Fleet Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="database" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              placeholder="Search ships, registry, captain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800/50 border-blue-500/30"
            />
            <Select
              value={filterAffiliation}
              onValueChange={setFilterAffiliation}
            >
              <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                <SelectValue placeholder="Affiliation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Affiliations</SelectItem>
                {affiliations.map((affiliation) => (
                  <SelectItem key={affiliation} value={affiliation}>
                    {affiliation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                <SelectValue placeholder="Ship Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Classes</SelectItem>
                {classes.map((shipClass) => (
                  <SelectItem key={shipClass} value={shipClass}>
                    {shipClass}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterShow} onValueChange={setFilterShow}>
              <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                <SelectValue placeholder="Series/Movie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Series</SelectItem>
                {shows.map((show) => (
                  <SelectItem key={show} value={show}>
                    {show}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredShips.map((ship) => (
              <Card
                key={ship.id}
                className="bg-gray-800/30 border-blue-500/30 hover:border-blue-400/50 transition-colors cursor-pointer"
                onClick={() => setSelectedShip(ship)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-blue-400">
                        {ship.name}
                      </CardTitle>
                      <p className="text-sm text-gray-400">{ship.registry}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusIcon(ship.status)}
                        <span
                          className={`text-sm ${getStatusColor(ship.status)}`}
                        >
                          {ship.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {ship.class}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{ship.era}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Captain:</span>
                    <span className="text-blue-400">
                      {ship.captain || "Unknown"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Crew:</span>
                    <span className="text-blue-400">
                      {ship.crew.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="text-gray-400">Affiliation:</span>
                    <div
                      className={`${getAffiliationColor(ship.affiliation)} font-semibold`}
                    >
                      {ship.affiliation}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-1">
                      <Shield className="w-3 h-3 text-blue-400" />
                      <span>Shields: {ship.armament.shields}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span>Warp: {ship.specifications.warpSpeed}</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">From: {ship.show}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="space-y-4">
          {selectedShip ? (
            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Rocket className="w-5 h-5 mr-2" />
                  {selectedShip.name} ({selectedShip.registry}) - Technical
                  Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-400">
                      Physical Specifications
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Length:</span>
                        <span className="text-blue-400">
                          {selectedShip.specifications.length}m
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Beam:</span>
                        <span className="text-blue-400">
                          {selectedShip.specifications.beam}m
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Height:</span>
                        <span className="text-blue-400">
                          {selectedShip.specifications.height}m
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Decks:</span>
                        <span className="text-blue-400">
                          {selectedShip.specifications.decks}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mass:</span>
                        <span className="text-blue-400">
                          {selectedShip.specifications.mass.toLocaleString()}{" "}
                          metric tons
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-400">
                      Performance
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Warp Speed:</span>
                          <span className="text-blue-400">
                            Warp {selectedShip.specifications.warpSpeed}
                          </span>
                        </div>
                        <Progress
                          value={
                            (selectedShip.specifications.warpSpeed / 10) * 100
                          }
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Impulse Speed:</span>
                          <span className="text-blue-400">
                            {selectedShip.specifications.impulseSpeed}c
                          </span>
                        </div>
                        <Progress
                          value={selectedShip.specifications.impulseSpeed * 400}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-400">
                      Armament
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Phaser Arrays:</span>
                          <span className="text-yellow-400">
                            {selectedShip.armament.phasers}
                          </span>
                        </div>
                        <Progress
                          value={(selectedShip.armament.phasers / 20) * 100}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Torpedo Launchers:</span>
                          <span className="text-red-400">
                            {selectedShip.armament.torpedoes}
                          </span>
                        </div>
                        <Progress
                          value={(selectedShip.armament.torpedoes / 15) * 100}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Shield Strength:</span>
                          <span className="text-blue-400">
                            {selectedShip.armament.shields}%
                          </span>
                        </div>
                        <Progress
                          value={selectedShip.armament.shields}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Armor Rating:</span>
                          <span className="text-green-400">
                            {selectedShip.armament.armor}%
                          </span>
                        </div>
                        <Progress
                          value={selectedShip.armament.armor}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-400">
                      Service Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Launched:</span>
                        <span className="text-blue-400">
                          {selectedShip.launched}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Captain:</span>
                        <span className="text-blue-400">
                          {selectedShip.captain || "Unknown"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Crew Complement:</span>
                        <span className="text-blue-400">
                          {selectedShip.crew.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Class:</span>
                        <span className="text-blue-400">
                          {selectedShip.class}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="text-blue-400">
                          {selectedShip.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardContent className="text-center py-8">
                <Rocket className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">
                  Select a ship from the database to view detailed
                  specifications.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="missions" className="space-y-4">
          {selectedShip ? (
            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400">
                  {selectedShip.name} - Mission Records & Notable Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">
                    Primary Missions
                  </h3>
                  <div className="space-y-2">
                    {selectedShip.missions.map((mission, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-2 p-3 bg-gray-900/50 rounded border border-blue-500/30"
                      >
                        <Target className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{mission}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-yellow-400">
                    Notable Events
                  </h3>
                  <div className="space-y-2">
                    {selectedShip.notableEvents.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-2 p-3 bg-gray-900/50 rounded border border-yellow-500/30"
                      >
                        <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardContent className="text-center py-8">
                <Target className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">
                  Select a ship from the database to view mission records.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Rocket className="w-5 h-5 mr-2" />
                  Fleet Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Ships:</span>
                    <span className="text-blue-400">{ships.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active:</span>
                    <span className="text-green-400">
                      {ships.filter((s) => s.status === "Active").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Destroyed:</span>
                    <span className="text-red-400">
                      {ships.filter((s) => s.status === "Destroyed").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Decommissioned:</span>
                    <span className="text-gray-400">
                      {
                        ships.filter((s) => s.status === "Decommissioned")
                          .length
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  By Affiliation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {affiliations.map((affiliation) => (
                    <div
                      key={affiliation}
                      className="flex justify-between text-sm"
                    >
                      <span className="truncate">
                        {affiliation.split(" ")[0]}:
                      </span>
                      <span className={getAffiliationColor(affiliation)}>
                        {
                          ships.filter((s) => s.affiliation === affiliation)
                            .length
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  By Era
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>22nd Century:</span>
                    <span className="text-yellow-400">
                      {ships.filter((s) => s.era === "22nd Century").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>23rd Century:</span>
                    <span className="text-blue-400">
                      {ships.filter((s) => s.era === "23rd Century").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>24th Century:</span>
                    <span className="text-green-400">
                      {ships.filter((s) => s.era === "24th Century").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {selectedShip && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-900 border-blue-500/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-blue-400">
                    {selectedShip.name}
                  </CardTitle>
                  <p className="text-gray-400">
                    {selectedShip.registry} • {selectedShip.class} Class
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    {getStatusIcon(selectedShip.status)}
                    <span className={getStatusColor(selectedShip.status)}>
                      {selectedShip.status}
                    </span>
                    <Badge
                      variant="outline"
                      className={getAffiliationColor(selectedShip.affiliation)}
                    >
                      {selectedShip.affiliation}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedShip(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">
                    Service Information
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Captain:</span>
                      <span className="text-blue-400">
                        {selectedShip.captain || "Unknown"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Crew:</span>
                      <span className="text-blue-400">
                        {selectedShip.crew.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Launched:</span>
                      <span className="text-blue-400">
                        {selectedShip.launched}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="text-blue-400">{selectedShip.type}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">
                    From Series
                  </h4>
                  <p className="text-gray-300">{selectedShip.show}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
