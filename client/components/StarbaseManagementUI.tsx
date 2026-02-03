import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Building2,
  Zap,
  Shield,
  Wrench,
  Rocket,
  Beaker,
  Store,
  Heart,
  Users,
  Package,
  TrendingUp,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowUp,
  Plus,
  MapPin,
  Radio,
  Target,
  Swords,
} from "lucide-react";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type ModuleType = "shipyard" | "research_lab" | "trading_post" | "medical" | "barracks" | "workshops" | "defense_grid" | "docking_bay" | "communications";

interface StationModule {
  id: string;
  type: ModuleType;
  name: string;
  level: number;
  max_level: number;
  benefits: string[];
  power_draw: number;
  crew_required: number;
  upgrade_cost: {
    credits: number;
    time_hours: number;
    resources: { [key: string]: number };
  };
  production?: {
    type: string;
    amount_per_hour: number;
  };
}

interface Starbase {
  id: string;
  name: string;
  level: number;
  location: {
    sector: string;
    coordinates: { x: number; y: number };
  };
  modules: StationModule[];
  docked_ships: DockedShip[];
  personnel: number;
  max_personnel: number;
  capacity: {
    ships: number;
    max_ships: number;
    cargo: number;
    max_cargo: number;
  };
  defense: {
    shields: number;
    max_shields: number;
    weapons: number;
    fighters: number;
  };
  economy: {
    credits_per_hour: number;
    upkeep_cost_per_hour: number;
    net_income: number;
  };
  status: "operational" | "under_attack" | "upgrading" | "damaged";
  upgrade_in_progress?: {
    target_level: number;
    completion_time: Date;
    hours_remaining: number;
  };
}

interface DockedShip {
  id: string;
  name: string;
  class: string;
  status: "docked" | "repairing" | "refueling" | "upgrading";
  repair_progress?: number;
  estimated_completion?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function StarbaseManagementUI() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [selectedStarbaseId, setSelectedStarbaseId] = useState<string>("starbase_001");
  const [playerCredits] = useState<number>(2500000);
  const [playerResources] = useState<{ [key: string]: number }>({
    "Dilithium": 500,
    "Tritanium": 800,
    "Plasma": 400,
    "Isolinear Chips": 300,
    "Duranium": 250,
  });

  // ============================================================================
  // MOCK DATA - STARBASES
  // ============================================================================

  const [starbases, setStarbases] = useState<Starbase[]>([
    {
      id: "starbase_001",
      name: "Deep Space 9",
      level: 8,
      location: {
        sector: "Bajoran Sector",
        coordinates: { x: 450, y: 320 },
      },
      personnel: 2847,
      max_personnel: 3000,
      capacity: {
        ships: 12,
        max_ships: 15,
        cargo: 45000,
        max_cargo: 50000,
      },
      defense: {
        shields: 18500,
        max_shields: 20000,
        weapons: 450,
        fighters: 24,
      },
      economy: {
        credits_per_hour: 15000,
        upkeep_cost_per_hour: 8500,
        net_income: 6500,
      },
      status: "operational",
      modules: [
        {
          id: "mod_001",
          type: "shipyard",
          name: "Advanced Shipyard",
          level: 4,
          max_level: 5,
          benefits: [
            "Can construct up to Tier 4 ships",
            "-20% construction time",
            "2 simultaneous construction bays",
          ],
          power_draw: 500,
          crew_required: 250,
          upgrade_cost: {
            credits: 500000,
            time_hours: 48,
            resources: { "Duranium": 100, "Tritanium": 150 },
          },
          production: {
            type: "ships",
            amount_per_hour: 0.5,
          },
        },
        {
          id: "mod_002",
          type: "research_lab",
          name: "Science & Research Complex",
          level: 5,
          max_level: 5,
          benefits: [
            "+30% research speed",
            "Can research advanced technologies",
            "Prototype testing available",
          ],
          power_draw: 400,
          crew_required: 180,
          upgrade_cost: {
            credits: 0,
            time_hours: 0,
            resources: {},
          },
        },
        {
          id: "mod_003",
          type: "trading_post",
          name: "Promenade Trading Complex",
          level: 3,
          max_level: 5,
          benefits: [
            "+25% trading profits",
            "Expanded market access",
            "Rare goods available",
          ],
          power_draw: 200,
          crew_required: 120,
          upgrade_cost: {
            credits: 300000,
            time_hours: 24,
            resources: { "Dilithium": 50 },
          },
          production: {
            type: "credits",
            amount_per_hour: 5000,
          },
        },
        {
          id: "mod_004",
          type: "medical",
          name: "Medical Bay",
          level: 3,
          max_level: 5,
          benefits: [
            "Crew health +20%",
            "Faster injury recovery",
            "Disease prevention",
          ],
          power_draw: 150,
          crew_required: 80,
          upgrade_cost: {
            credits: 250000,
            time_hours: 18,
            resources: { "Plasma": 40 },
          },
        },
        {
          id: "mod_005",
          type: "defense_grid",
          name: "Defensive Array",
          level: 4,
          max_level: 5,
          benefits: [
            "+40% shield strength",
            "Automated defense turrets",
            "Early warning systems",
          ],
          power_draw: 600,
          crew_required: 150,
          upgrade_cost: {
            credits: 600000,
            time_hours: 36,
            resources: { "Tritanium": 200, "Plasma": 100 },
          },
        },
      ],
      docked_ships: [
        {
          id: "ship_001",
          name: "USS Defiant",
          class: "Defiant-Class",
          status: "docked",
        },
        {
          id: "ship_002",
          name: "USS Venture",
          class: "Galaxy-Class",
          status: "repairing",
          repair_progress: 65,
          estimated_completion: "4h 20m",
        },
        {
          id: "ship_003",
          name: "USS Yukon",
          class: "Norway-Class",
          status: "refueling",
          repair_progress: 90,
          estimated_completion: "45m",
        },
      ],
    },
    {
      id: "starbase_002",
      name: "Starbase 375",
      level: 5,
      location: {
        sector: "Federation Core",
        coordinates: { x: 200, y: 150 },
      },
      personnel: 1200,
      max_personnel: 1500,
      capacity: {
        ships: 6,
        max_ships: 8,
        cargo: 20000,
        max_cargo: 25000,
      },
      defense: {
        shields: 12000,
        max_shields: 15000,
        weapons: 280,
        fighters: 12,
      },
      economy: {
        credits_per_hour: 8000,
        upkeep_cost_per_hour: 4500,
        net_income: 3500,
      },
      status: "operational",
      modules: [
        {
          id: "mod_006",
          type: "shipyard",
          name: "Standard Shipyard",
          level: 2,
          max_level: 5,
          benefits: [
            "Can construct up to Tier 2 ships",
            "1 construction bay",
          ],
          power_draw: 300,
          crew_required: 150,
          upgrade_cost: {
            credits: 200000,
            time_hours: 24,
            resources: { "Tritanium": 80 },
          },
        },
        {
          id: "mod_007",
          type: "docking_bay",
          name: "Expanded Docking Facilities",
          level: 3,
          max_level: 5,
          benefits: [
            "+3 ship capacity",
            "Faster docking/undocking",
            "Emergency repair capability",
          ],
          power_draw: 250,
          crew_required: 100,
          upgrade_cost: {
            credits: 350000,
            time_hours: 30,
            resources: { "Duranium": 60 },
          },
        },
      ],
      docked_ships: [],
    },
  ]);

  // ============================================================================
  // MODULE TEMPLATES
  // ============================================================================

  const moduleTemplates: { [key in ModuleType]: Omit<StationModule, "id"> } = {
    shipyard: {
      type: "shipyard",
      name: "Shipyard",
      level: 1,
      max_level: 5,
      benefits: ["Can construct basic ships", "1 construction bay"],
      power_draw: 250,
      crew_required: 120,
      upgrade_cost: {
        credits: 150000,
        time_hours: 20,
        resources: { "Tritanium": 60 },
      },
    },
    research_lab: {
      type: "research_lab",
      name: "Research Laboratory",
      level: 1,
      max_level: 5,
      benefits: ["+15% research speed", "Basic technology research"],
      power_draw: 300,
      crew_required: 100,
      upgrade_cost: {
        credits: 200000,
        time_hours: 24,
        resources: { "Isolinear Chips": 50 },
      },
    },
    trading_post: {
      type: "trading_post",
      name: "Trading Post",
      level: 1,
      max_level: 5,
      benefits: ["+10% trading profits", "Basic market access"],
      power_draw: 150,
      crew_required: 80,
      upgrade_cost: {
        credits: 120000,
        time_hours: 16,
        resources: { "Dilithium": 30 },
      },
      production: {
        type: "credits",
        amount_per_hour: 2000,
      },
    },
    medical: {
      type: "medical",
      name: "Medical Facility",
      level: 1,
      max_level: 5,
      benefits: ["+10% crew health", "Basic medical care"],
      power_draw: 100,
      crew_required: 50,
      upgrade_cost: {
        credits: 100000,
        time_hours: 12,
        resources: { "Plasma": 20 },
      },
    },
    barracks: {
      type: "barracks",
      name: "Personnel Quarters",
      level: 1,
      max_level: 5,
      benefits: ["+500 personnel capacity", "Crew morale +5%"],
      power_draw: 120,
      crew_required: 40,
      upgrade_cost: {
        credits: 80000,
        time_hours: 10,
        resources: { "Duranium": 40 },
      },
    },
    workshops: {
      type: "workshops",
      name: "Engineering Workshops",
      level: 1,
      max_level: 5,
      benefits: ["-10% repair time", "Component manufacturing"],
      power_draw: 200,
      crew_required: 90,
      upgrade_cost: {
        credits: 140000,
        time_hours: 18,
        resources: { "Tritanium": 50 },
      },
    },
    defense_grid: {
      type: "defense_grid",
      name: "Defense Systems",
      level: 1,
      max_level: 5,
      benefits: ["+20% shield strength", "Basic weapon systems"],
      power_draw: 400,
      crew_required: 100,
      upgrade_cost: {
        credits: 300000,
        time_hours: 28,
        resources: { "Tritanium": 100, "Plasma": 50 },
      },
    },
    docking_bay: {
      type: "docking_bay",
      name: "Docking Bay",
      level: 1,
      max_level: 5,
      benefits: ["+2 ship capacity", "Basic docking facilities"],
      power_draw: 180,
      crew_required: 70,
      upgrade_cost: {
        credits: 180000,
        time_hours: 22,
        resources: { "Duranium": 40 },
      },
    },
    communications: {
      type: "communications",
      name: "Communications Array",
      level: 1,
      max_level: 5,
      benefits: ["Long-range communications", "+10% intel gathering"],
      power_draw: 160,
      crew_required: 60,
      upgrade_cost: {
        credits: 130000,
        time_hours: 14,
        resources: { "Isolinear Chips": 40 },
      },
    },
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const selectedStarbase = useMemo(() => {
    return starbases.find((s) => s.id === selectedStarbaseId);
  }, [starbases, selectedStarbaseId]);

  const starbaseStats = useMemo(() => {
    if (!selectedStarbase) return null;

    const totalPowerDraw = selectedStarbase.modules.reduce((sum, mod) => sum + mod.power_draw, 0);
    const totalCrewRequired = selectedStarbase.modules.reduce((sum, mod) => sum + mod.crew_required, 0);
    const personnelUtilization = (selectedStarbase.personnel / selectedStarbase.max_personnel) * 100;
    const shipsUtilization = (selectedStarbase.capacity.ships / selectedStarbase.capacity.max_ships) * 100;
    const defenseRating = Math.floor(
      (selectedStarbase.defense.shields / 100) + 
      (selectedStarbase.defense.weapons * 2) + 
      (selectedStarbase.defense.fighters * 10)
    );

    return {
      totalPowerDraw,
      totalCrewRequired,
      personnelUtilization,
      shipsUtilization,
      defenseRating,
      availableModuleSlots: Math.max(0, 10 - selectedStarbase.modules.length),
    };
  }, [selectedStarbase]);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const getModuleIcon = (type: ModuleType) => {
    const icons: Record<ModuleType, any> = {
      shipyard: <Rocket className="h-5 w-5" />,
      research_lab: <Beaker className="h-5 w-5" />,
      trading_post: <Store className="h-5 w-5" />,
      medical: <Heart className="h-5 w-5" />,
      barracks: <Users className="h-5 w-5" />,
      workshops: <Wrench className="h-5 w-5" />,
      defense_grid: <Shield className="h-5 w-5" />,
      docking_bay: <Package className="h-5 w-5" />,
      communications: <Radio className="h-5 w-5" />,
    };
    return icons[type] || <Building2 className="h-5 w-5" />;
  };

  const getLevelColor = (level: number, maxLevel: number) => {
    const ratio = level / maxLevel;
    if (ratio === 1) return "bg-purple-500";
    if (ratio >= 0.8) return "bg-blue-500";
    if (ratio >= 0.6) return "bg-green-500";
    if (ratio >= 0.4) return "bg-yellow-500";
    return "bg-gray-500";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-500";
      case "under_attack":
        return "text-red-500";
      case "upgrading":
        return "text-blue-500";
      case "damaged":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };

  const getShipStatusColor = (status: string) => {
    switch (status) {
      case "docked":
        return "bg-blue-500";
      case "repairing":
        return "bg-yellow-500";
      case "refueling":
        return "bg-green-500";
      case "upgrading":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const canAffordUpgrade = (cost: { credits: number; resources: { [key: string]: number } }) => {
    if (playerCredits < cost.credits) return false;
    return Object.entries(cost.resources).every(
      ([resource, amount]) => (playerResources[resource] || 0) >= amount
    );
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleUpgradeModule = (starbaseId: string, moduleId: string) => {
    setStarbases((prev) =>
      prev.map((base) => {
        if (base.id !== starbaseId) return base;

        return {
          ...base,
          modules: base.modules.map((mod) => {
            if (mod.id !== moduleId || mod.level >= mod.max_level) return mod;

            const newLevel = mod.level + 1;
            return {
              ...mod,
              level: newLevel,
              benefits: [
                ...mod.benefits,
                `Level ${newLevel} enhancement: +${newLevel * 10}% effectiveness`,
              ],
              upgrade_cost: {
                credits: Math.floor(mod.upgrade_cost.credits * 1.5),
                time_hours: mod.upgrade_cost.time_hours + 4,
                resources: Object.fromEntries(
                  Object.entries(mod.upgrade_cost.resources).map(([k, v]) => [k, Math.floor(v * 1.3)])
                ),
              },
            };
          }),
        };
      })
    );
  };

  const handleAddModule = (starbaseId: string, moduleType: ModuleType) => {
    const template = moduleTemplates[moduleType];
    const newModule: StationModule = {
      ...template,
      id: `mod_${Date.now()}`,
    };

    setStarbases((prev) =>
      prev.map((base) => {
        if (base.id !== starbaseId) return base;
        if (base.modules.length >= 10) return base; // Max 10 modules

        return {
          ...base,
          modules: [...base.modules, newModule],
        };
      })
    );
  };

  const handleRepairShip = (starbaseId: string, shipId: string) => {
    setStarbases((prev) =>
      prev.map((base) => {
        if (base.id !== starbaseId) return base;

        return {
          ...base,
          docked_ships: base.docked_ships.map((ship) =>
            ship.id === shipId
              ? { ...ship, status: "docked", repair_progress: undefined, estimated_completion: undefined }
              : ship
          ),
        };
      })
    );
  };

  const handleUpgradeStarbase = (starbaseId: string) => {
    setStarbases((prev) =>
      prev.map((base) => {
        if (base.id !== starbaseId) return base;

        return {
          ...base,
          level: base.level + 1,
          max_personnel: base.max_personnel + 500,
          capacity: {
            ...base.capacity,
            max_ships: base.capacity.max_ships + 2,
            max_cargo: base.capacity.max_cargo + 10000,
          },
          defense: {
            ...base.defense,
            max_shields: base.defense.max_shields + 5000,
            weapons: base.defense.weapons + 50,
            fighters: base.defense.fighters + 4,
          },
        };
      })
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!selectedStarbase || !starbaseStats) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No starbase selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Starbase Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage stations, modules, and infrastructure across the galaxy
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <DollarSign className="h-4 w-4 mr-1" />
          {playerCredits.toLocaleString()} Credits
        </Badge>
      </div>

      {/* STARBASE SELECTOR */}
      <Card>
        <CardHeader>
          <CardTitle>Select Starbase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {starbases.map((base) => (
              <Button
                key={base.id}
                variant={selectedStarbaseId === base.id ? "default" : "outline"}
                onClick={() => setSelectedStarbaseId(base.id)}
              >
                <Building2 className="h-4 w-4 mr-2" />
                {base.name}
                <Badge className="ml-2" variant="secondary">
                  Lvl {base.level}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* STARBASE OVERVIEW */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{selectedStarbase.name}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4" />
                {selectedStarbase.location.sector} ({selectedStarbase.location.coordinates.x}, {selectedStarbase.location.coordinates.y})
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className={`${getStatusColor(selectedStarbase.status)}`}>
                {selectedStarbase.status.toUpperCase()}
              </Badge>
              <Badge variant="outline">Level {selectedStarbase.level}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Personnel</p>
              <p className="text-lg font-bold">
                {selectedStarbase.personnel} / {selectedStarbase.max_personnel}
              </p>
              <Progress value={starbaseStats.personnelUtilization} className="h-1 mt-1" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Docked Ships</p>
              <p className="text-lg font-bold">
                {selectedStarbase.capacity.ships} / {selectedStarbase.capacity.max_ships}
              </p>
              <Progress value={starbaseStats.shipsUtilization} className="h-1 mt-1" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Defense Rating</p>
              <p className="text-lg font-bold flex items-center gap-1">
                <Shield className="h-4 w-4" />
                {starbaseStats.defenseRating}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Net Income</p>
              <p className={`text-lg font-bold ${selectedStarbase.economy.net_income > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {selectedStarbase.economy.net_income > 0 ? '+' : ''}{selectedStarbase.economy.net_income}/h
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Modules</p>
              <p className="text-lg font-bold">
                {selectedStarbase.modules.length} / 10
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MAIN TABS */}
      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="modules">Station Modules</TabsTrigger>
          <TabsTrigger value="docked">Docked Ships</TabsTrigger>
          <TabsTrigger value="economy">Economy</TabsTrigger>
          <TabsTrigger value="defense">Defense</TabsTrigger>
        </TabsList>

        {/* MODULES TAB */}
        <TabsContent value="modules" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4 pr-4">
              {selectedStarbase.modules.map((module) => (
                <Card key={module.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          {getModuleIcon(module.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{module.name}</h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {module.type.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${getLevelColor(module.level, module.max_level)} text-white`}>
                        Level {module.level}/{module.max_level}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Benefits:</p>
                      <ul className="space-y-1">
                        {module.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="p-2 bg-muted rounded">
                        <p className="text-xs text-muted-foreground">Power Draw</p>
                        <p className="text-sm font-bold flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {module.power_draw} MW
                        </p>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <p className="text-xs text-muted-foreground">Crew Required</p>
                        <p className="text-sm font-bold flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {module.crew_required}
                        </p>
                      </div>
                      {module.production && (
                        <div className="p-2 bg-muted rounded">
                          <p className="text-xs text-muted-foreground">Production</p>
                          <p className="text-sm font-bold flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {module.production.amount_per_hour}/h
                          </p>
                        </div>
                      )}
                    </div>

                    {module.level < module.max_level && (
                      <div className="mb-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-2">Upgrade Cost:</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span>{module.upgrade_cost.credits.toLocaleString()} Credits</span>
                          <span>{module.upgrade_cost.time_hours}h</span>
                          <span>
                            {Object.entries(module.upgrade_cost.resources)
                              .map(([res, amt]) => `${amt} ${res}`)
                              .join(", ")}
                          </span>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => handleUpgradeModule(selectedStarbase.id, module.id)}
                      disabled={module.level >= module.max_level || !canAffordUpgrade(module.upgrade_cost)}
                      className="w-full"
                    >
                      <ArrowUp className="h-4 w-4 mr-2" />
                      {module.level >= module.max_level
                        ? "Max Level"
                        : canAffordUpgrade(module.upgrade_cost)
                        ? "Upgrade Module"
                        : "Insufficient Resources"}
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {/* Add New Module */}
              {starbaseStats.availableModuleSlots > 0 && (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="text-center py-6">
                      <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-semibold mb-2">Add New Module</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {starbaseStats.availableModuleSlots} slot(s) available
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {Object.keys(moduleTemplates).map((type) => (
                          <Button
                            key={type}
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddModule(selectedStarbase.id, type as ModuleType)}
                          >
                            {getModuleIcon(type as ModuleType)}
                            <span className="ml-2 capitalize">{type.replace("_", " ")}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* DOCKED SHIPS TAB */}
        <TabsContent value="docked" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4 pr-4">
              {selectedStarbase.docked_ships.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Rocket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-semibold">No Ships Docked</p>
                      <p className="text-sm text-muted-foreground">
                        Ships can dock here for repairs, refueling, and upgrades
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                selectedStarbase.docked_ships.map((ship) => (
                  <Card key={ship.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{ship.name}</h3>
                          <p className="text-sm text-muted-foreground">{ship.class}</p>
                        </div>
                        <Badge className={`${getShipStatusColor(ship.status)} text-white`}>
                          {ship.status.toUpperCase()}
                        </Badge>
                      </div>

                      {ship.repair_progress !== undefined && (
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm">{ship.repair_progress}%</span>
                          </div>
                          <Progress value={ship.repair_progress} className="h-2" />
                          {ship.estimated_completion && (
                            <p className="text-xs text-muted-foreground mt-1">
                              <Clock className="h-3 w-3 inline mr-1" />
                              Estimated completion: {ship.estimated_completion}
                            </p>
                          )}
                        </div>
                      )}

                      {ship.status === "repairing" && (
                        <Button
                          onClick={() => handleRepairShip(selectedStarbase.id, ship.id)}
                          variant="outline"
                          className="w-full"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Complete Repairs (Rush)
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ECONOMY TAB */}
        <TabsContent value="economy" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Income Per Hour</p>
                  <p className="text-3xl font-bold text-green-500">
                    +{selectedStarbase.economy.credits_per_hour.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">From modules and trade</p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Upkeep Cost Per Hour</p>
                  <p className="text-3xl font-bold text-red-500">
                    -{selectedStarbase.economy.upkeep_cost_per_hour.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Maintenance and personnel</p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Net Income Per Hour</p>
                  <p className={`text-3xl font-bold ${selectedStarbase.economy.net_income > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {selectedStarbase.economy.net_income > 0 ? '+' : ''}
                    {selectedStarbase.economy.net_income.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedStarbase.economy.net_income > 0 ? 'Profitable' : 'Operating at loss'}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Economic Projections:</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Daily Income</p>
                    <p className="font-bold">
                      {(selectedStarbase.economy.net_income * 24).toLocaleString()} Credits
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Weekly Income</p>
                    <p className="font-bold">
                      {(selectedStarbase.economy.net_income * 24 * 7).toLocaleString()} Credits
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly Income</p>
                    <p className="font-bold">
                      {(selectedStarbase.economy.net_income * 24 * 30).toLocaleString()} Credits
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DEFENSE TAB */}
        <TabsContent value="defense" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Shield Strength</p>
                  <p className="text-2xl font-bold">
                    {selectedStarbase.defense.shields.toLocaleString()} / {selectedStarbase.defense.max_shields.toLocaleString()}
                  </p>
                  <Progress
                    value={(selectedStarbase.defense.shields / selectedStarbase.defense.max_shields) * 100}
                    className="h-2 mt-2"
                  />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Weapon Systems</p>
                  <p className="text-2xl font-bold flex items-center gap-2">
                    <Swords className="h-6 w-6" />
                    {selectedStarbase.defense.weapons}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Active defense turrets</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Fighter Squadron</p>
                  <p className="text-2xl font-bold flex items-center gap-2">
                    <Target className="h-6 w-6" />
                    {selectedStarbase.defense.fighters}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Deployed fighters</p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Overall Defense Rating</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Progress value={Math.min(100, (starbaseStats.defenseRating / 1000) * 100)} className="h-4" />
                  </div>
                  <span className="text-2xl font-bold">{starbaseStats.defenseRating}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {starbaseStats.defenseRating > 800 ? "Excellent defense capabilities" : 
                   starbaseStats.defenseRating > 500 ? "Good defense capabilities" :
                   "Defense needs improvement"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* UPGRADE STARBASE */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">Upgrade Starbase</h3>
              <p className="text-sm text-muted-foreground">
                Increase capacity, defense, and unlock new modules
              </p>
            </div>
            <Button onClick={() => handleUpgradeStarbase(selectedStarbase.id)} size="lg">
              <ArrowUp className="h-4 w-4 mr-2" />
              Upgrade to Level {selectedStarbase.level + 1}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
