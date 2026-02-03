import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import {
  Zap,
  Target,
  Shield,
  AlertTriangle,
  Crosshair,
  Bomb,
  Swords,
  Eye,
  Wrench,
} from "lucide-react";

interface WeaponsSystemProps {
  activeSubmenu?: string;
}

interface WeaponSpecifications {
  power: number;
  range: number;
  accuracy: number;
  chargeTime: number;
  energyConsumption: number;
  penetration: number;
  areaEffect: number;
  reliability: number;
}

interface Weapon {
  id: string;
  name: string;
  category: string;
  type: string;
  era: string;
  faction: string;
  specifications: WeaponSpecifications;
  description: string;
  advantages: string[];
  disadvantages: string[];
  notableUses: string[];
}

const weaponCategories = [
  "Energy Weapons",
  "Projectile Weapons",
  "Explosives",
  "Defensive Systems",
  "Melee Weapons",
  "Special Weapons",
];

const weaponTypes = {
  "Energy Weapons": [
    "Phaser",
    "Disruptor",
    "Plasma Cannon",
    "Polaron Beam",
    "Antiproton Beam",
    "Tetryon Array",
    "Chroniton Torpedo",
  ],
  "Projectile Weapons": [
    "Photon Torpedo",
    "Quantum Torpedo",
    "Tricobalt Device",
    "Gravimetric Torpedo",
    "Transphasic Torpedo",
  ],
  Explosives: [
    "Isolytic Burst",
    "Subspace Warhead",
    "Trilithium Torpedo",
    "Red Matter Device",
    "Genesis Device",
  ],
  "Defensive Systems": [
    "Deflector Shield",
    "Ablative Armor",
    "Adaptive Shield",
    "Metaphasic Shield",
    "Regenerative Shield",
  ],
  "Melee Weapons": [
    "Bat'leth",
    "Mek'leth",
    "Lirpa",
    "Ahn-woon",
    "Teral'n",
    "Ushaan-tor",
  ],
  "Special Weapons": [
    "Thalaron Weapon",
    "Subspace Weapon",
    "Phase Discriminator",
    "Neural Disruptor",
    "Temporal Disruptor",
  ],
};

const eras = [
  "22nd Century",
  "23rd Century",
  "24th Century",
  "25th Century",
  "26th Century",
  "29th Century",
  "31st Century",
];

const factions = [
  "United Federation of Planets",
  "Klingon Empire",
  "Romulan Star Empire",
  "Cardassian Union",
  "Dominion",
  "Borg Collective",
  "Breen Confederacy",
  "Tholian Assembly",
  "Gorn Hegemony",
  "Orion Syndicate",
  "Ferengi Alliance",
  "Vulcan High Command",
  "Andorian Imperial Guard",
  "Bajoran Militia",
  "Maquis",
  "Section 31",
  "Terran Empire",
  "Species 8472",
  "Vidiian Sodality",
  "Kazon Collective",
];

const presetWeapons: Weapon[] = [
  {
    id: "phaser-type-ii",
    name: "Type II Phaser",
    category: "Energy Weapons",
    type: "Phaser",
    era: "24th Century",
    faction: "United Federation of Planets",
    specifications: {
      power: 85,
      range: 75,
      accuracy: 90,
      chargeTime: 20,
      energyConsumption: 35,
      penetration: 70,
      areaEffect: 15,
      reliability: 95,
    },
    description:
      "Standard Starfleet hand phaser with multiple settings from stun to disintegrate.",
    advantages: [
      "Variable power settings",
      "High accuracy",
      "Non-lethal options",
      "Reliable technology",
    ],
    disadvantages: [
      "Limited range compared to projectiles",
      "Energy signature detectable",
      "Vulnerable to dampening fields",
    ],
    notableUses: [
      "Standard Starfleet away team equipment",
      "Used in countless missions",
      "Preferred by Starfleet officers",
    ],
  },
  {
    id: "disruptor-klingon",
    name: "Klingon Disruptor",
    category: "Energy Weapons",
    type: "Disruptor",
    era: "23rd Century",
    faction: "Klingon Empire",
    specifications: {
      power: 95,
      range: 80,
      accuracy: 75,
      chargeTime: 30,
      energyConsumption: 45,
      penetration: 85,
      areaEffect: 20,
      reliability: 80,
    },
    description:
      "Klingon energy weapon designed for maximum damage and intimidation.",
    advantages: [
      "High damage output",
      "Disruptive energy pattern",
      "Intimidating design",
      "Effective against shields",
    ],
    disadvantages: [
      "Higher energy consumption",
      "Less accurate than phasers",
      "Limited stun settings",
    ],
    notableUses: [
      "Standard Klingon warrior weapon",
      "Used in countless battles",
      "Symbol of Klingon military might",
    ],
  },
  {
    id: "photon-torpedo",
    name: "Mark VI Photon Torpedo",
    category: "Projectile Weapons",
    type: "Photon Torpedo",
    era: "24th Century",
    faction: "United Federation of Planets",
    specifications: {
      power: 95,
      range: 95,
      accuracy: 85,
      chargeTime: 60,
      energyConsumption: 80,
      penetration: 90,
      areaEffect: 85,
      reliability: 90,
    },
    description:
      "Matter/antimatter warhead torpedo, standard armament for Starfleet vessels.",
    advantages: [
      "Extreme destructive power",
      "Long range capability",
      "Warp-capable",
      "High penetration",
    ],
    disadvantages: [
      "Limited ammunition",
      "Expensive to manufacture",
      "Can be intercepted",
      "Requires careful handling",
    ],
    notableUses: [
      "Ship-to-ship combat",
      "Planetary bombardment",
      "Obstacle clearing",
      "Emergency situations",
    ],
  },
  {
    id: "batleth",
    name: "Bat'leth",
    category: "Melee Weapons",
    type: "Bat'leth",
    era: "23rd Century",
    faction: "Klingon Empire",
    specifications: {
      power: 70,
      range: 25,
      accuracy: 80,
      chargeTime: 10,
      energyConsumption: 0,
      penetration: 75,
      areaEffect: 30,
      reliability: 100,
    },
    description:
      "Traditional Klingon sword of honor, wielded by warriors in ceremonial and actual combat.",
    advantages: [
      "No power requirements",
      "Symbol of honor",
      "Versatile combat techniques",
      "Intimidating presence",
    ],
    disadvantages: [
      "Limited range",
      "Requires skill to master",
      "Ineffective against energy shields",
      "Close combat only",
    ],
    notableUses: [
      "Klingon honor duels",
      "Ceremonial occasions",
      "Close quarters combat",
      "Martial arts training",
    ],
  },
  {
    id: "quantum-torpedo",
    name: "Quantum Torpedo",
    category: "Projectile Weapons",
    type: "Quantum Torpedo",
    era: "24th Century",
    faction: "United Federation of Planets",
    specifications: {
      power: 100,
      range: 90,
      accuracy: 90,
      chargeTime: 45,
      energyConsumption: 70,
      penetration: 95,
      areaEffect: 90,
      reliability: 85,
    },
    description:
      "Advanced torpedo using zero-point energy extraction for enhanced destructive capability.",
    advantages: [
      "Superior damage output",
      "More efficient than photon torpedoes",
      "Advanced targeting",
      "Quantum technology",
    ],
    disadvantages: [
      "More complex technology",
      "Higher manufacturing cost",
      "Limited availability",
      "Requires specialized maintenance",
    ],
    notableUses: [
      "USS Defiant primary armament",
      "Critical missions",
      "Against heavily shielded targets",
      "Dominion War",
    ],
  },
  {
    id: "borg-cutting-beam",
    name: "Borg Cutting Beam",
    category: "Energy Weapons",
    type: "Plasma Cannon",
    era: "24th Century",
    faction: "Borg Collective",
    specifications: {
      power: 100,
      range: 60,
      accuracy: 95,
      chargeTime: 15,
      energyConsumption: 90,
      penetration: 100,
      areaEffect: 25,
      reliability: 90,
    },
    description:
      "Precise cutting beam used by Borg drones for assimilation and ship modification.",
    advantages: [
      "Extreme precision",
      "Can cut through any material",
      "Rapid deployment",
      "Adaptive technology",
    ],
    disadvantages: [
      "High energy consumption",
      "Short range",
      "Borg-specific technology",
      "Requires collective connection",
    ],
    notableUses: [
      "Ship assimilation",
      "Drone modifications",
      "Obstacle removal",
      "Surgical precision tasks",
    ],
  },
];

export default function WeaponsSystem({ activeSubmenu }: WeaponsSystemProps) {
  const normalizeSubmenu = (submenu?: string) => {
    const allowed = new Set(["database", "create", "compare", "analysis"]);
    return submenu && allowed.has(submenu) ? submenu : "database";
  };

  const [activeTab, setActiveTab] = useState(normalizeSubmenu(activeSubmenu));
  const [weapons, setWeapons] = useState<Weapon[]>(presetWeapons);
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [newWeapon, setNewWeapon] = useState<Partial<Weapon>>({
    specifications: {
      power: 50,
      range: 50,
      accuracy: 50,
      chargeTime: 50,
      energyConsumption: 50,
      penetration: 50,
      areaEffect: 50,
      reliability: 50,
    },
    advantages: [],
    disadvantages: [],
    notableUses: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterFaction, setFilterFaction] = useState("All");
  const [filterEra, setFilterEra] = useState("All");
  const [compareMode, setCompareMode] = useState(false);
  const [compareWeapons, setCompareWeapons] = useState<Weapon[]>([]);

  useEffect(() => {
    setActiveTab(normalizeSubmenu(activeSubmenu));
  }, [activeSubmenu]);

  const filteredWeapons = weapons.filter((weapon) => {
    const matchesSearch =
      weapon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      weapon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || weapon.category === filterCategory;
    const matchesFaction =
      filterFaction === "All" || weapon.faction === filterFaction;
    const matchesEra = filterEra === "All" || weapon.era === filterEra;

    return matchesSearch && matchesCategory && matchesFaction && matchesEra;
  });

  const addWeapon = () => {
    if (newWeapon.name && newWeapon.category && newWeapon.type) {
      const weapon: Weapon = {
        id: `weapon-${Date.now()}`,
        name: newWeapon.name,
        category: newWeapon.category,
        type: newWeapon.type,
        era: newWeapon.era || "24th Century",
        faction: newWeapon.faction || "United Federation of Planets",
        specifications: newWeapon.specifications || {
          power: 50,
          range: 50,
          accuracy: 50,
          chargeTime: 50,
          energyConsumption: 50,
          penetration: 50,
          areaEffect: 50,
          reliability: 50,
        },
        description: newWeapon.description || "",
        advantages: newWeapon.advantages || [],
        disadvantages: newWeapon.disadvantages || [],
        notableUses: newWeapon.notableUses || [],
      };

      setWeapons([...weapons, weapon]);
      setNewWeapon({
        specifications: {
          power: 50,
          range: 50,
          accuracy: 50,
          chargeTime: 50,
          energyConsumption: 50,
          penetration: 50,
          areaEffect: 50,
          reliability: 50,
        },
        advantages: [],
        disadvantages: [],
        notableUses: [],
      });
    }
  };

  const toggleCompareWeapon = (weapon: Weapon) => {
    if (compareWeapons.find((w) => w.id === weapon.id)) {
      setCompareWeapons(compareWeapons.filter((w) => w.id !== weapon.id));
    } else if (compareWeapons.length < 3) {
      setCompareWeapons([...compareWeapons, weapon]);
    }
  };

  const getSpecIcon = (spec: string) => {
    switch (spec) {
      case "power":
        return <Zap className="w-4 h-4" />;
      case "range":
        return <Target className="w-4 h-4" />;
      case "accuracy":
        return <Crosshair className="w-4 h-4" />;
      case "chargeTime":
        return <AlertTriangle className="w-4 h-4" />;
      case "energyConsumption":
        return <Zap className="w-4 h-4" />;
      case "penetration":
        return <Shield className="w-4 h-4" />;
      case "areaEffect":
        return <Bomb className="w-4 h-4" />;
      case "reliability":
        return <Wrench className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  const getSpecColor = (value: number) => {
    if (value >= 80) return "text-green-400";
    if (value >= 60) return "text-yellow-400";
    if (value >= 40) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-blue-400">
          WEAPONS SYSTEMS DATABASE
        </h1>
        <p className="text-xl text-gray-300">
          Comprehensive Arsenal Analysis and Management
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="database">Weapons Database</TabsTrigger>
          <TabsTrigger value="create">Create Weapon</TabsTrigger>
          <TabsTrigger value="compare">Compare Arsenal</TabsTrigger>
          <TabsTrigger value="analysis">Tactical Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="database" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search weapons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800/50 border-blue-500/30"
            />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {weaponCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
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
            <Select value={filterEra} onValueChange={setFilterEra}>
              <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                <SelectValue placeholder="Era" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Eras</SelectItem>
                {eras.map((era) => (
                  <SelectItem key={era} value={era}>
                    {era}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={compareMode}
              onCheckedChange={setCompareMode}
              id="compare-mode"
            />
            <Label htmlFor="compare-mode">Compare Mode</Label>
            {compareMode && compareWeapons.length > 0 && (
              <Badge variant="outline" className="text-blue-400">
                {compareWeapons.length} selected
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWeapons.map((weapon) => (
              <Card
                key={weapon.id}
                className="bg-gray-800/30 border-blue-500/30 hover:border-blue-400/50 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-blue-400">
                        {weapon.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {weapon.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {weapon.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {weapon.era}
                        </Badge>
                      </div>
                    </div>
                    {compareMode && (
                      <Button
                        size="sm"
                        variant={
                          compareWeapons.find((w) => w.id === weapon.id)
                            ? "default"
                            : "outline"
                        }
                        onClick={() => toggleCompareWeapon(weapon)}
                        disabled={
                          !compareWeapons.find((w) => w.id === weapon.id) &&
                          compareWeapons.length >= 3
                        }
                      >
                        {compareWeapons.find((w) => w.id === weapon.id)
                          ? "✓"
                          : "+"}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-300">{weapon.description}</p>
                  <div className="text-xs text-gray-400">{weapon.faction}</div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(weapon.specifications)
                      .slice(0, 4)
                      .map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-1">
                          {getSpecIcon(key)}
                          <span className="capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span className={getSpecColor(value)}>{value}%</span>
                        </div>
                      ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedWeapon(weapon)}
                    >
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card className="bg-gray-800/30 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400">Create New Weapon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weapon-name">Weapon Name</Label>
                  <Input
                    id="weapon-name"
                    value={newWeapon.name || ""}
                    onChange={(e) =>
                      setNewWeapon({ ...newWeapon, name: e.target.value })
                    }
                    className="bg-gray-800/50 border-blue-500/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weapon-category">Category</Label>
                  <Select
                    value={newWeapon.category}
                    onValueChange={(value) =>
                      setNewWeapon({ ...newWeapon, category: value })
                    }
                  >
                    <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {weaponCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weapon-type">Type</Label>
                  <Select
                    value={newWeapon.type}
                    onValueChange={(value) =>
                      setNewWeapon({ ...newWeapon, type: value })
                    }
                    disabled={!newWeapon.category}
                  >
                    <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {newWeapon.category &&
                        weaponTypes[
                          newWeapon.category as keyof typeof weaponTypes
                        ]?.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weapon-era">Era</Label>
                  <Select
                    value={newWeapon.era}
                    onValueChange={(value) =>
                      setNewWeapon({ ...newWeapon, era: value })
                    }
                  >
                    <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                      <SelectValue placeholder="Select era" />
                    </SelectTrigger>
                    <SelectContent>
                      {eras.map((era) => (
                        <SelectItem key={era} value={era}>
                          {era}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="weapon-faction">Faction</Label>
                  <Select
                    value={newWeapon.faction}
                    onValueChange={(value) =>
                      setNewWeapon({ ...newWeapon, faction: value })
                    }
                  >
                    <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                      <SelectValue placeholder="Select faction" />
                    </SelectTrigger>
                    <SelectContent>
                      {factions.map((faction) => (
                        <SelectItem key={faction} value={faction}>
                          {faction}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weapon-description">Description</Label>
                <Textarea
                  id="weapon-description"
                  value={newWeapon.description || ""}
                  onChange={(e) =>
                    setNewWeapon({ ...newWeapon, description: e.target.value })
                  }
                  className="bg-gray-800/50 border-blue-500/30"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-400">
                  Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(newWeapon.specifications || {}).map(
                    ([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {getSpecIcon(key)}
                          <Label className="capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </Label>
                          <span className={`text-sm ${getSpecColor(value)}`}>
                            {value}%
                          </span>
                        </div>
                        <Slider
                          value={[value]}
                          onValueChange={(vals) =>
                            setNewWeapon({
                              ...newWeapon,
                              specifications: {
                                ...newWeapon.specifications!,
                                [key]: vals[0],
                              },
                            })
                          }
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>

              <Button onClick={addWeapon} className="w-full">
                Create Weapon
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compare" className="space-y-4">
          {compareWeapons.length === 0 ? (
            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardContent className="text-center py-8">
                <p className="text-gray-400">
                  Enable compare mode and select weapons to compare their
                  specifications.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-blue-400">
                  Weapon Comparison
                </h3>
                <Button variant="outline" onClick={() => setCompareWeapons([])}>
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {compareWeapons.map((weapon) => (
                  <Card
                    key={weapon.id}
                    className="bg-gray-800/30 border-blue-500/30"
                  >
                    <CardHeader>
                      <CardTitle className="text-blue-400">
                        {weapon.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          {weapon.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {weapon.faction}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(weapon.specifications).map(
                          ([key, value]) => (
                            <div key={key} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-1">
                                  {getSpecIcon(key)}
                                  <span className="text-sm capitalize">
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </span>
                                </div>
                                <span
                                  className={`text-sm font-semibold ${getSpecColor(value)}`}
                                >
                                  {value}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    value >= 80
                                      ? "bg-green-400"
                                      : value >= 60
                                        ? "bg-yellow-400"
                                        : value >= 40
                                          ? "bg-orange-400"
                                          : "bg-red-400"
                                  }`}
                                  style={{ width: `${value}%` }}
                                />
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Swords className="w-5 h-5 mr-2" />
                  Arsenal Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Weapons:</span>
                    <span className="text-blue-400">{weapons.length}</span>
                  </div>
                  {weaponCategories.map((category) => (
                    <div
                      key={category}
                      className="flex justify-between text-sm"
                    >
                      <span>{category}:</span>
                      <span className="text-gray-400">
                        {weapons.filter((w) => w.category === category).length}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Faction Arsenal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {factions.slice(0, 8).map((faction) => {
                    const count = weapons.filter(
                      (w) => w.faction === faction,
                    ).length;
                    return count > 0 ? (
                      <div
                        key={faction}
                        className="flex justify-between text-sm"
                      >
                        <span className="truncate">
                          {faction.split(" ")[0]}:
                        </span>
                        <span className="text-gray-400">{count}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Highest Power:</span>
                    <br />
                    <span className="text-green-400">
                      {
                        weapons.reduce((max, w) =>
                          w.specifications.power > max.specifications.power
                            ? w
                            : max,
                        ).name
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Best Accuracy:</span>
                    <br />
                    <span className="text-green-400">
                      {
                        weapons.reduce((max, w) =>
                          w.specifications.accuracy >
                          max.specifications.accuracy
                            ? w
                            : max,
                        ).name
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Longest Range:</span>
                    <br />
                    <span className="text-green-400">
                      {
                        weapons.reduce((max, w) =>
                          w.specifications.range > max.specifications.range
                            ? w
                            : max,
                        ).name
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {selectedWeapon && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-900 border-blue-500/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-blue-400">
                    {selectedWeapon.name}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">{selectedWeapon.category}</Badge>
                    <Badge variant="outline">{selectedWeapon.type}</Badge>
                    <Badge variant="outline">{selectedWeapon.era}</Badge>
                    <Badge variant="outline">{selectedWeapon.faction}</Badge>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedWeapon(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">{selectedWeapon.description}</p>

              <div className="space-y-3">
                <h4 className="font-semibold text-blue-400">Specifications</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedWeapon.specifications).map(
                    ([key, value]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-1">
                            {getSpecIcon(key)}
                            <span className="text-sm capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                          </div>
                          <span
                            className={`text-sm font-semibold ${getSpecColor(value)}`}
                          >
                            {value}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              value >= 80
                                ? "bg-green-400"
                                : value >= 60
                                  ? "bg-yellow-400"
                                  : value >= 40
                                    ? "bg-orange-400"
                                    : "bg-red-400"
                            }`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {selectedWeapon.advantages.length > 0 && (
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">
                    Advantages
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                    {selectedWeapon.advantages.map((advantage, index) => (
                      <li key={index}>{advantage}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedWeapon.disadvantages.length > 0 && (
                <div>
                  <h4 className="font-semibold text-red-400 mb-2">
                    Disadvantages
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                    {selectedWeapon.disadvantages.map((disadvantage, index) => (
                      <li key={index}>{disadvantage}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedWeapon.notableUses.length > 0 && (
                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">
                    Notable Uses
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                    {selectedWeapon.notableUses.map((use, index) => (
                      <li key={index}>{use}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
