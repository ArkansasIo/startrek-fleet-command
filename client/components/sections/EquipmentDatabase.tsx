import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import {
  Zap,
  Shield,
  Package,
  Stethoscope,
  Wrench,
  Compass,
  Radio,
  Beaker,
  Sword,
  Eye,
  Users,
  Star,
  AlertTriangle,
  CheckCircle,
  Plus,
} from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  type:
    | "Weapon"
    | "Medical"
    | "Engineering"
    | "Science"
    | "Communications"
    | "Navigation"
    | "Personal"
    | "Armor";
  category: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
  era: string;
  faction: string;
  description: string;
  specifications: {
    power?: number;
    range?: number;
    accuracy?: number;
    durability: number;
    weight: number;
    energyConsumption?: number;
  };
  effects: string[];
  requirements: string[];
  locations: string[];
  show: string;
}

const STAR_TREK_EQUIPMENT: Equipment[] = [
  // Weapons
  {
    id: "phaser-type-ii",
    name: "Type II Phaser",
    type: "Weapon",
    category: "Hand Phaser",
    rarity: "Common",
    era: "24th Century",
    faction: "United Federation of Planets",
    description:
      "Standard Starfleet hand phaser with variable power settings from stun to disintegrate.",
    specifications: {
      power: 85,
      range: 100,
      accuracy: 90,
      durability: 95,
      weight: 0.8,
      energyConsumption: 15,
    },
    effects: [
      "Variable power settings",
      "Stun capability",
      "Overload self-destruct",
    ],
    requirements: ["Starfleet authorization", "Phaser training"],
    locations: ["Starfleet vessels", "Security departments", "Away teams"],
    show: "The Next Generation",
  },
  {
    id: "bat-leth",
    name: "Bat'leth",
    type: "Weapon",
    category: "Melee Weapon",
    rarity: "Uncommon",
    era: "24th Century",
    faction: "Klingon Empire",
    description:
      "Traditional Klingon sword of honor, wielded by warriors in ceremonial and actual combat.",
    specifications: {
      power: 75,
      range: 2,
      accuracy: 80,
      durability: 100,
      weight: 2.5,
    },
    effects: [
      "High damage in melee",
      "Symbol of honor",
      "No energy requirements",
    ],
    requirements: ["Klingon heritage", "Warrior training", "Honor code"],
    locations: ["Klingon ships", "Warrior quarters", "Honor ceremonies"],
    show: "The Next Generation",
  },
  {
    id: "compression-rifle",
    name: "Compression Phaser Rifle",
    type: "Weapon",
    category: "Phaser Rifle",
    rarity: "Rare",
    era: "24th Century",
    faction: "United Federation of Planets",
    description:
      "High-powered phaser rifle designed for combat situations and away team missions.",
    specifications: {
      power: 95,
      range: 300,
      accuracy: 95,
      durability: 90,
      weight: 3.2,
      energyConsumption: 25,
    },
    effects: ["High power output", "Extended range", "Multiple firing modes"],
    requirements: [
      "Tactical training",
      "Security clearance",
      "Mission authorization",
    ],
    locations: ["Security armories", "Tactical departments", "Combat missions"],
    show: "Deep Space Nine",
  },

  // Medical Equipment
  {
    id: "medical-tricorder",
    name: "Medical Tricorder",
    type: "Medical",
    category: "Diagnostic Device",
    rarity: "Common",
    era: "24th Century",
    faction: "United Federation of Planets",
    description:
      "Portable medical scanner capable of diagnosing injuries and illnesses in real-time.",
    specifications: {
      accuracy: 98,
      durability: 85,
      weight: 0.5,
      energyConsumption: 5,
    },
    effects: ["Medical scanning", "Vital sign monitoring", "Disease detection"],
    requirements: ["Medical training", "Starfleet authorization"],
    locations: ["Sickbays", "Medical kits", "Away teams"],
    show: "The Next Generation",
  },
  {
    id: "hypospray",
    name: "Hypospray",
    type: "Medical",
    category: "Injection Device",
    rarity: "Common",
    era: "24th Century",
    faction: "United Federation of Planets",
    description:
      "Needle-free injection device for administering medications and treatments.",
    specifications: {
      accuracy: 95,
      durability: 90,
      weight: 0.2,
      energyConsumption: 2,
    },
    effects: [
      "Instant medication delivery",
      "No needle required",
      "Precise dosing",
    ],
    requirements: ["Medical authorization", "Proper medication"],
    locations: ["Medical facilities", "Emergency kits", "Away teams"],
    show: "The Original Series",
  },
  {
    id: "neural-stimulator",
    name: "Neural Stimulator",
    type: "Medical",
    category: "Emergency Device",
    rarity: "Rare",
    era: "24th Century",
    faction: "United Federation of Planets",
    description:
      "Emergency medical device used to stimulate neural activity in unconscious patients.",
    specifications: {
      power: 70,
      accuracy: 92,
      durability: 88,
      weight: 0.4,
      energyConsumption: 12,
    },
    effects: [
      "Neural stimulation",
      "Consciousness restoration",
      "Brain activity monitoring",
    ],
    requirements: ["Medical officer certification", "Emergency authorization"],
    locations: ["Sickbays", "Emergency medical kits", "Critical care units"],
    show: "The Next Generation",
  },

  // Engineering Tools
  {
    id: "engineering-tricorder",
    name: "Engineering Tricorder",
    type: "Engineering",
    category: "Diagnostic Tool",
    rarity: "Common",
    era: "24th Century",
    faction: "United Federation of Planets",
    description:
      "Specialized tricorder for analyzing engineering systems and technical components.",
    specifications: {
      accuracy: 95,
      durability: 92,
      weight: 0.6,
      energyConsumption: 8,
    },
    effects: [
      "System analysis",
      "Component diagnostics",
      "Power level monitoring",
    ],
    requirements: ["Engineering training", "Technical certification"],
    locations: ["Engineering sections", "Maintenance areas", "Technical teams"],
    show: "The Next Generation",
  },
  {
    id: "plasma-torch",
    name: "Plasma Torch",
    type: "Engineering",
    category: "Cutting Tool",
    rarity: "Uncommon",
    era: "24th Century",
    faction: "United Federation of Planets",
    description:
      "High-temperature plasma cutting and welding tool for heavy engineering work.",
    specifications: {
      power: 90,
      accuracy: 85,
      durability: 80,
      weight: 1.5,
      energyConsumption: 35,
    },
    effects: [
      "Metal cutting",
      "Welding capability",
      "High temperature operation",
    ],
    requirements: ["Engineering certification", "Safety training"],
    locations: ["Engineering workshops", "Maintenance bays", "Repair teams"],
    show: "The Next Generation",
  },

  // Science Equipment
  {
    id: "science-tricorder",
    name: "Science Tricorder",
    type: "Science",
    category: "Analysis Device",
    rarity: "Common",
    era: "24th Century",
    faction: "United Federation of Planets",
    description:
      "Multi-purpose scientific scanner for analyzing various phenomena and materials.",
    specifications: {
      accuracy: 97,
      durability: 88,
      weight: 0.5,
      energyConsumption: 6,
    },
    effects: [
      "Material analysis",
      "Atmospheric scanning",
      "Geological surveys",
    ],
    requirements: ["Science training", "Research authorization"],
    locations: ["Science labs", "Research stations", "Exploration teams"],
    show: "The Original Series",
  },
  {
    id: "quantum-resonance-chamber",
    name: "Quantum Resonance Chamber",
    type: "Science",
    category: "Research Equipment",
    rarity: "Epic",
    era: "24th Century",
    faction: "United Federation of Planets",
    description:
      "Advanced quantum physics research device for studying subatomic particles.",
    specifications: {
      power: 98,
      accuracy: 99,
      durability: 75,
      weight: 50.0,
      energyConsumption: 85,
    },
    effects: [
      "Quantum particle analysis",
      "Subspace field generation",
      "Temporal measurements",
    ],
    requirements: [
      "Advanced physics degree",
      "Level 10 clearance",
      "Specialized facility",
    ],
    locations: ["Advanced research labs", "Starfleet R&D", "Science vessels"],
    show: "Voyager",
  },

  // Communications
  {
    id: "communicator",
    name: "Communicator",
    type: "Communications",
    category: "Personal Device",
    rarity: "Common",
    era: "23rd Century",
    faction: "United Federation of Planets",
    description:
      "Portable communication device for ship-to-shore and person-to-person contact.",
    specifications: {
      range: 500,
      accuracy: 92,
      durability: 90,
      weight: 0.1,
      energyConsumption: 3,
    },
    effects: [
      "Ship communication",
      "Emergency beacon",
      "Universal translation",
    ],
    requirements: ["Starfleet authorization", "Communication protocols"],
    locations: ["All Starfleet personnel", "Away teams", "Emergency kits"],
    show: "The Original Series",
  },

  // Personal Equipment
  {
    id: "environmental-suit",
    name: "Environmental Suit",
    type: "Personal",
    category: "Protective Gear",
    rarity: "Uncommon",
    era: "24th Century",
    faction: "United Federation of Planets",
    description:
      "Full-body protective suit for hazardous environments and space walks.",
    specifications: {
      durability: 95,
      weight: 8.0,
      energyConsumption: 20,
    },
    effects: [
      "Environmental protection",
      "Atmospheric filtration",
      "Radiation shielding",
    ],
    requirements: [
      "EVA training",
      "Medical clearance",
      "Mission authorization",
    ],
    locations: ["EVA storage", "Emergency lockers", "Away team equipment"],
    show: "The Next Generation",
  },
  {
    id: "borg-alcove",
    name: "Borg Alcove",
    type: "Personal",
    category: "Regeneration Chamber",
    rarity: "Legendary",
    era: "24th Century",
    faction: "Borg Collective",
    description:
      "Borg regeneration chamber for maintaining cybernetic implants and consciousness.",
    specifications: {
      power: 95,
      durability: 100,
      weight: 150.0,
      energyConsumption: 60,
    },
    effects: [
      "Borg regeneration",
      "Implant maintenance",
      "Collective connection",
    ],
    requirements: [
      "Borg implants",
      "Collective authorization",
      "Adaptation protocols",
    ],
    locations: ["Borg cubes", "Borg vessels", "Unimatrix chambers"],
    show: "Voyager",
  },

  // Armor
  {
    id: "body-armor",
    name: "Starfleet Body Armor",
    type: "Armor",
    category: "Personal Protection",
    rarity: "Uncommon",
    era: "24th Century",
    faction: "United Federation of Planets",
    description:
      "Lightweight protective armor for high-risk missions and combat situations.",
    specifications: {
      durability: 88,
      weight: 2.5,
      energyConsumption: 0,
    },
    effects: [
      "Physical protection",
      "Energy absorption",
      "Mobility preservation",
    ],
    requirements: [
      "Security clearance",
      "Combat training",
      "Mission authorization",
    ],
    locations: [
      "Security armories",
      "Tactical equipment",
      "High-risk missions",
    ],
    show: "Deep Space Nine",
  },
];

export default function EquipmentDatabase() {
  const [equipment, setEquipment] = useState<Equipment[]>(STAR_TREK_EQUIPMENT);
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterRarity, setFilterRarity] = useState("All");
  const [filterFaction, setFilterFaction] = useState("All");
  const [filterShow, setFilterShow] = useState("All");

  const types = [...new Set(equipment.map((item) => item.type))];
  const rarities = [...new Set(equipment.map((item) => item.rarity))];
  const factions = [...new Set(equipment.map((item) => item.faction))];
  const shows = [...new Set(equipment.map((item) => item.show))];

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || item.type === filterType;
    const matchesRarity =
      filterRarity === "All" || item.rarity === filterRarity;
    const matchesFaction =
      filterFaction === "All" || item.faction === filterFaction;
    const matchesShow = filterShow === "All" || item.show === filterShow;

    return (
      matchesSearch &&
      matchesType &&
      matchesRarity &&
      matchesFaction &&
      matchesShow
    );
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "text-gray-400";
      case "Uncommon":
        return "text-green-400";
      case "Rare":
        return "text-blue-400";
      case "Epic":
        return "text-purple-400";
      case "Legendary":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Weapon":
        return <Sword className="w-4 h-4" />;
      case "Medical":
        return <Stethoscope className="w-4 h-4" />;
      case "Engineering":
        return <Wrench className="w-4 h-4" />;
      case "Science":
        return <Beaker className="w-4 h-4" />;
      case "Communications":
        return <Radio className="w-4 h-4" />;
      case "Navigation":
        return <Compass className="w-4 h-4" />;
      case "Personal":
        return <Users className="w-4 h-4" />;
      case "Armor":
        return <Shield className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Weapon":
        return "text-red-400";
      case "Medical":
        return "text-green-400";
      case "Engineering":
        return "text-orange-400";
      case "Science":
        return "text-blue-400";
      case "Communications":
        return "text-purple-400";
      case "Navigation":
        return "text-yellow-400";
      case "Personal":
        return "text-cyan-400";
      case "Armor":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-blue-400">EQUIPMENT DATABASE</h1>
        <p className="text-xl text-gray-300">
          Starfleet Issue & Alien Technology Catalog
        </p>
      </div>

      <Tabs defaultValue="database" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="database">Equipment Database</TabsTrigger>
          <TabsTrigger value="specifications">Item Details</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Manager</TabsTrigger>
          <TabsTrigger value="analytics">Equipment Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="database" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800/50 border-blue-500/30"
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterRarity} onValueChange={setFilterRarity}>
              <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                <SelectValue placeholder="Rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Rarities</SelectItem>
                {rarities.map((rarity) => (
                  <SelectItem key={rarity} value={rarity}>
                    {rarity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterFaction} onValueChange={setFilterFaction}>
              <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                <SelectValue placeholder="Faction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Factions</SelectItem>
                {factions.map((faction) => (
                  <SelectItem key={faction} value={faction}>
                    {faction}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterShow} onValueChange={setFilterShow}>
              <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                <SelectValue placeholder="Series" />
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
            {filteredEquipment.map((item) => (
              <Card
                key={item.id}
                className="bg-gray-800/30 border-blue-500/30 hover:border-blue-400/50 transition-colors cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-blue-400">
                        {item.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className={getTypeColor(item.type)}>
                          {getTypeIcon(item.type)}
                        </div>
                        <span className="text-sm text-gray-400">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getRarityColor(item.rarity)}`}
                    >
                      {item.rarity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-300">{item.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3 text-blue-400" />
                      <span>Durability: {item.specifications.durability}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Package className="w-3 h-3 text-green-400" />
                      <span>Weight: {item.specifications.weight}kg</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {item.era}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {item.faction.split(" ")[0]}
                    </Badge>
                  </div>

                  <div className="text-xs text-gray-500">From: {item.show}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="space-y-4">
          {selectedItem ? (
            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  {getTypeIcon(selectedItem.type)}
                  <span className="ml-2">
                    {selectedItem.name} - Technical Specifications
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-400">
                      General Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className={getTypeColor(selectedItem.type)}>
                          {selectedItem.type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="text-blue-400">
                          {selectedItem.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rarity:</span>
                        <span className={getRarityColor(selectedItem.rarity)}>
                          {selectedItem.rarity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Era:</span>
                        <span className="text-blue-400">
                          {selectedItem.era}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Faction:</span>
                        <span className="text-blue-400">
                          {selectedItem.faction}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-400">
                      Technical Specifications
                    </h3>
                    <div className="space-y-3">
                      {selectedItem.specifications.power && (
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Power:</span>
                            <span className="text-red-400">
                              {selectedItem.specifications.power}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-red-400 h-2 rounded-full"
                              style={{
                                width: `${selectedItem.specifications.power}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                      {selectedItem.specifications.range && (
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Range:</span>
                            <span className="text-yellow-400">
                              {selectedItem.specifications.range}m
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{
                                width: `${Math.min(selectedItem.specifications.range / 5, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                      {selectedItem.specifications.accuracy && (
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Accuracy:</span>
                            <span className="text-green-400">
                              {selectedItem.specifications.accuracy}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-400 h-2 rounded-full"
                              style={{
                                width: `${selectedItem.specifications.accuracy}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Durability:</span>
                          <span className="text-blue-400">
                            {selectedItem.specifications.durability}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-400 h-2 rounded-full"
                            style={{
                              width: `${selectedItem.specifications.durability}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Weight:</span>
                        <span className="text-blue-400">
                          {selectedItem.specifications.weight} kg
                        </span>
                      </div>
                      {selectedItem.specifications.energyConsumption && (
                        <div className="flex justify-between">
                          <span>Energy Use:</span>
                          <span className="text-purple-400">
                            {selectedItem.specifications.energyConsumption}{" "}
                            units/hour
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-green-400">
                      Effects & Capabilities
                    </h3>
                    <div className="space-y-2">
                      {selectedItem.effects.map((effect, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-300">
                            {effect}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-yellow-400">
                      Requirements
                    </h3>
                    <div className="space-y-2">
                      {selectedItem.requirements.map((requirement, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-300">
                            {requirement}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">
                    Common Locations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.locations.map((location, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardContent className="text-center py-8">
                <Package className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">
                  Select an item from the database to view detailed
                  specifications.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card className="bg-gray-800/30 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Personal Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Package className="w-16 h-16 mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400 mb-4">
                Inventory management system coming soon.
              </p>
              <p className="text-sm text-gray-500">
                Track your equipment, manage loadouts, and monitor item
                conditions.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Equipment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Items:</span>
                    <span className="text-blue-400">{equipment.length}</span>
                  </div>
                  {types.map((type) => (
                    <div key={type} className="flex justify-between text-sm">
                      <span>{type}:</span>
                      <span className={getTypeColor(type)}>
                        {equipment.filter((item) => item.type === type).length}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Rarity Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {rarities.map((rarity) => (
                    <div key={rarity} className="flex justify-between text-sm">
                      <span>{rarity}:</span>
                      <span className={getRarityColor(rarity)}>
                        {
                          equipment.filter((item) => item.rarity === rarity)
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
                  <Users className="w-5 h-5 mr-2" />
                  By Faction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {factions.map((faction) => (
                    <div key={faction} className="flex justify-between text-sm">
                      <span className="truncate">{faction.split(" ")[0]}:</span>
                      <span className="text-blue-400">
                        {
                          equipment.filter((item) => item.faction === faction)
                            .length
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
