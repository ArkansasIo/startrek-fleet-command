import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Rocket,
  Clock,
  DollarSign,
  Package,
  Zap,
  Shield,
  Swords,
  Gauge,
  Users,
  CheckCircle2,
  XCircle,
  Timer,
  Star,
  Wrench,
  Target,
  TrendingUp,
  AlertCircle,
  Play,
  Pause,
  FastForward,
} from "lucide-react";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type ShipClass = "escort" | "cruiser" | "battleship" | "science" | "carrier" | "destroyer" | "frigate" | "dreadnought";
type ShipRole = "combat" | "exploration" | "support" | "special_ops" | "command";
type ConstructionStatus = "queued" | "in_progress" | "paused" | "completed";

interface ShipBlueprint {
  id: string;
  name: string;
  class: ShipClass;
  role: ShipRole;
  tier: 1 | 2 | 3 | 4 | 5;
  description: string;
  stats: {
    hull: number;
    shields: number;
    weapons: number;
    speed: number;
    crew: number;
    cargo: number;
  };
  construction_cost: {
    credits: number;
    time_hours: number;
    resources: { [key: string]: number };
  };
  requirements: {
    tech_level: number;
    shipyard_level: number;
    unlocked: boolean;
  };
  special_abilities?: string[];
}

interface ConstructionProject {
  id: string;
  blueprint: ShipBlueprint;
  ship_name: string;
  status: ConstructionStatus;
  progress: number;
  started_at: Date;
  estimated_completion?: Date;
  hours_remaining: number;
  rush_cost?: number;
  assigned_engineers: number;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ShipConstructionUI() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [playerCredits] = useState<number>(5000000);
  const [playerResources] = useState<{ [key: string]: number }>({
    "Dilithium": 800,
    "Tritanium": 1200,
    "Plasma": 600,
    "Isolinear Chips": 400,
    "Duranium": 350,
    "Antimatter": 200,
  });
  const [playerTechLevel] = useState<number>(8);
  const [shipyardLevel] = useState<number>(4);

  const [constructionQueue, setConstructionQueue] = useState<ConstructionProject[]>([
    {
      id: "proj_001",
      blueprint: null as any, // Will be set below
      ship_name: "USS Endeavour",
      status: "in_progress",
      progress: 45,
      started_at: new Date(Date.now() - 12 * 60 * 60 * 1000),
      estimated_completion: new Date(Date.now() + 12 * 60 * 60 * 1000),
      hours_remaining: 12,
      rush_cost: 250000,
      assigned_engineers: 150,
    },
    {
      id: "proj_002",
      blueprint: null as any,
      ship_name: "USS Valiant",
      status: "queued",
      progress: 0,
      started_at: new Date(),
      hours_remaining: 18,
      assigned_engineers: 100,
    },
  ]);

  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string | null>(null);
  const [customShipName, setCustomShipName] = useState<string>("");
  const [filterClass, setFilterClass] = useState<ShipClass | "all">("all");
  const [filterTier, setFilterTier] = useState<number | "all">("all");

  // ============================================================================
  // MOCK DATA - SHIP BLUEPRINTS
  // ============================================================================

  const shipBlueprints: ShipBlueprint[] = [
    {
      id: "bp_001",
      name: "Defiant-Class",
      class: "escort",
      role: "combat",
      tier: 4,
      description: "A powerful escort designed for combat operations. Compact, heavily armed, and maneuverable.",
      stats: {
        hull: 8500,
        shields: 6800,
        weapons: 520,
        speed: 85,
        crew: 50,
        cargo: 150,
      },
      construction_cost: {
        credits: 850000,
        time_hours: 24,
        resources: {
          "Tritanium": 180,
          "Duranium": 120,
          "Plasma": 90,
        },
      },
      requirements: {
        tech_level: 7,
        shipyard_level: 4,
        unlocked: true,
      },
      special_abilities: ["Ablative Armor", "Pulse Phaser Cannons", "Cloak Detection"],
    },
    {
      id: "bp_002",
      name: "Galaxy-Class",
      class: "cruiser",
      role: "exploration",
      tier: 5,
      description: "The flagship of the fleet. Versatile, powerful, and equipped for long-range missions.",
      stats: {
        hull: 15000,
        shields: 12000,
        weapons: 480,
        speed: 65,
        crew: 1000,
        cargo: 800,
      },
      construction_cost: {
        credits: 2000000,
        time_hours: 48,
        resources: {
          "Tritanium": 350,
          "Duranium": 250,
          "Dilithium": 150,
          "Isolinear Chips": 100,
        },
      },
      requirements: {
        tech_level: 8,
        shipyard_level: 4,
        unlocked: true,
      },
      special_abilities: ["Saucer Separation", "Advanced Sensors", "Diplomatic Suite"],
    },
    {
      id: "bp_003",
      name: "Intrepid-Class",
      class: "science",
      role: "exploration",
      tier: 3,
      description: "A science vessel designed for deep space exploration and research missions.",
      stats: {
        hull: 7200,
        shields: 5800,
        weapons: 320,
        speed: 90,
        crew: 150,
        cargo: 400,
      },
      construction_cost: {
        credits: 650000,
        time_hours: 20,
        resources: {
          "Tritanium": 120,
          "Isolinear Chips": 80,
          "Dilithium": 60,
        },
      },
      requirements: {
        tech_level: 6,
        shipyard_level: 3,
        unlocked: true,
      },
      special_abilities: ["Bio-Neural Circuitry", "Variable Geometry Nacelles", "Enhanced Sensors"],
    },
    {
      id: "bp_004",
      name: "Sovereign-Class",
      class: "battleship",
      role: "combat",
      tier: 5,
      description: "A state-of-the-art battleship combining firepower with advanced technology.",
      stats: {
        hull: 18000,
        shields: 15000,
        weapons: 680,
        speed: 70,
        crew: 750,
        cargo: 500,
      },
      construction_cost: {
        credits: 2500000,
        time_hours: 60,
        resources: {
          "Tritanium": 400,
          "Duranium": 300,
          "Dilithium": 200,
          "Antimatter": 100,
        },
      },
      requirements: {
        tech_level: 9,
        shipyard_level: 5,
        unlocked: false,
      },
      special_abilities: ["Quantum Torpedoes", "Regenerative Shields", "Enhanced Armor"],
    },
    {
      id: "bp_005",
      name: "Akira-Class",
      class: "carrier",
      role: "support",
      tier: 4,
      description: "A carrier vessel capable of launching fighter squadrons and supporting fleet operations.",
      stats: {
        hull: 12000,
        shields: 9500,
        weapons: 420,
        speed: 60,
        crew: 500,
        cargo: 600,
      },
      construction_cost: {
        credits: 1200000,
        time_hours: 36,
        resources: {
          "Tritanium": 250,
          "Duranium": 180,
          "Dilithium": 100,
        },
      },
      requirements: {
        tech_level: 7,
        shipyard_level: 4,
        unlocked: true,
      },
      special_abilities: ["Fighter Bay", "Torpedo Launchers", "Point Defense System"],
    },
    {
      id: "bp_006",
      name: "Miranda-Class",
      class: "frigate",
      role: "support",
      tier: 2,
      description: "A versatile frigate suitable for patrol and escort duties.",
      stats: {
        hull: 5000,
        shields: 3800,
        weapons: 240,
        speed: 70,
        crew: 220,
        cargo: 300,
      },
      construction_cost: {
        credits: 300000,
        time_hours: 12,
        resources: {
          "Tritanium": 80,
          "Duranium": 50,
        },
      },
      requirements: {
        tech_level: 4,
        shipyard_level: 2,
        unlocked: true,
      },
      special_abilities: ["Modular Design", "Emergency Medical Bay"],
    },
    {
      id: "bp_007",
      name: "Nebula-Class",
      class: "cruiser",
      role: "exploration",
      tier: 4,
      description: "A versatile cruiser with modular mission pods for various operations.",
      stats: {
        hull: 12500,
        shields: 10000,
        weapons: 400,
        speed: 68,
        crew: 750,
        cargo: 650,
      },
      construction_cost: {
        credits: 1100000,
        time_hours: 32,
        resources: {
          "Tritanium": 220,
          "Duranium": 160,
          "Dilithium": 90,
        },
      },
      requirements: {
        tech_level: 7,
        shipyard_level: 4,
        unlocked: true,
      },
      special_abilities: ["Mission Pod", "Advanced Lab", "Tractor Beam"],
    },
    {
      id: "bp_008",
      name: "Norway-Class",
      class: "destroyer",
      role: "combat",
      tier: 3,
      description: "A fast destroyer optimized for hit-and-run tactics and escort missions.",
      stats: {
        hull: 6800,
        shields: 5200,
        weapons: 380,
        speed: 88,
        crew: 190,
        cargo: 200,
      },
      construction_cost: {
        credits: 550000,
        time_hours: 18,
        resources: {
          "Tritanium": 140,
          "Duranium": 90,
          "Plasma": 60,
        },
      },
      requirements: {
        tech_level: 6,
        shipyard_level: 3,
        unlocked: true,
      },
      special_abilities: ["Rapid Fire Phasers", "Enhanced Maneuverability"],
    },
    {
      id: "bp_009",
      name: "Excelsior-Class",
      class: "cruiser",
      role: "command",
      tier: 3,
      description: "A reliable cruiser that has served the Federation for decades.",
      stats: {
        hull: 10000,
        shields: 8000,
        weapons: 360,
        speed: 72,
        crew: 750,
        cargo: 500,
      },
      construction_cost: {
        credits: 700000,
        time_hours: 26,
        resources: {
          "Tritanium": 180,
          "Duranium": 120,
          "Dilithium": 70,
        },
      },
      requirements: {
        tech_level: 5,
        shipyard_level: 3,
        unlocked: true,
      },
      special_abilities: ["Proven Design", "Fleet Coordination"],
    },
    {
      id: "bp_010",
      name: "Steamrunner-Class",
      class: "escort",
      role: "combat",
      tier: 3,
      description: "A combat escort designed for frontline engagements.",
      stats: {
        hull: 7000,
        shields: 5500,
        weapons: 420,
        speed: 80,
        crew: 200,
        cargo: 180,
      },
      construction_cost: {
        credits: 480000,
        time_hours: 16,
        resources: {
          "Tritanium": 110,
          "Duranium": 75,
          "Plasma": 50,
        },
      },
      requirements: {
        tech_level: 6,
        shipyard_level: 3,
        unlocked: true,
      },
      special_abilities: ["Heavy Torpedoes", "Reinforced Hull"],
    },
    {
      id: "bp_011",
      name: "Prometheus-Class",
      class: "dreadnought",
      role: "special_ops",
      tier: 5,
      description: "An advanced tactical vessel with multi-vector assault mode.",
      stats: {
        hull: 16000,
        shields: 13500,
        weapons: 750,
        speed: 92,
        crew: 275,
        cargo: 250,
      },
      construction_cost: {
        credits: 3000000,
        time_hours: 72,
        resources: {
          "Tritanium": 450,
          "Duranium": 350,
          "Dilithium": 250,
          "Antimatter": 150,
          "Isolinear Chips": 120,
        },
      },
      requirements: {
        tech_level: 10,
        shipyard_level: 5,
        unlocked: false,
      },
      special_abilities: ["Multi-Vector Assault Mode", "Ablative Generators", "Auto-Targeting"],
    },
    {
      id: "bp_012",
      name: "Saber-Class",
      class: "frigate",
      role: "combat",
      tier: 2,
      description: "A compact frigate designed for border patrol and rapid response.",
      stats: {
        hull: 5500,
        shields: 4200,
        weapons: 300,
        speed: 82,
        crew: 150,
        cargo: 160,
      },
      construction_cost: {
        credits: 350000,
        time_hours: 14,
        resources: {
          "Tritanium": 90,
          "Duranium": 60,
          "Plasma": 40,
        },
      },
      requirements: {
        tech_level: 5,
        shipyard_level: 2,
        unlocked: true,
      },
      special_abilities: ["Rapid Deployment", "Enhanced Shields"],
    },
  ];

  // Set blueprints for existing construction projects
  if (constructionQueue[0] && !constructionQueue[0].blueprint) {
    constructionQueue[0].blueprint = shipBlueprints.find((bp) => bp.id === "bp_001")!;
  }
  if (constructionQueue[1] && !constructionQueue[1].blueprint) {
    constructionQueue[1].blueprint = shipBlueprints.find((bp) => bp.id === "bp_003")!;
  }

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const filteredBlueprints = useMemo(() => {
    return shipBlueprints.filter((bp) => {
      if (filterClass !== "all" && bp.class !== filterClass) return false;
      if (filterTier !== "all" && bp.tier !== filterTier) return false;
      return true;
    });
  }, [filterClass, filterTier]);

  const selectedBlueprint = useMemo(() => {
    return shipBlueprints.find((bp) => bp.id === selectedBlueprintId);
  }, [selectedBlueprintId]);

  const constructionStats = useMemo(() => {
    const total = constructionQueue.length;
    const inProgress = constructionQueue.filter((p) => p.status === "in_progress").length;
    const queued = constructionQueue.filter((p) => p.status === "queued").length;
    const completed = constructionQueue.filter((p) => p.status === "completed").length;

    return { total, inProgress, queued, completed };
  }, [constructionQueue]);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const canAffordConstruction = (cost: { credits: number; resources: { [key: string]: number } }) => {
    if (playerCredits < cost.credits) return false;
    return Object.entries(cost.resources).every(
      ([resource, amount]) => (playerResources[resource] || 0) >= amount
    );
  };

  const meetsRequirements = (requirements: { tech_level: number; shipyard_level: number; unlocked: boolean }) => {
    return (
      requirements.unlocked &&
      playerTechLevel >= requirements.tech_level &&
      shipyardLevel >= requirements.shipyard_level
    );
  };

  const getClassIcon = (shipClass: ShipClass) => {
    const icons: Record<ShipClass, any> = {
      escort: <Target className="h-5 w-5" />,
      cruiser: <Rocket className="h-5 w-5" />,
      battleship: <Swords className="h-5 w-5" />,
      science: <Star className="h-5 w-5" />,
      carrier: <Package className="h-5 w-5" />,
      destroyer: <Zap className="h-5 w-5" />,
      frigate: <Shield className="h-5 w-5" />,
      dreadnought: <Gauge className="h-5 w-5" />,
    };
    return icons[shipClass] || <Rocket className="h-5 w-5" />;
  };

  const getTierColor = (tier: number) => {
    const colors = ["bg-gray-500", "bg-green-500", "bg-blue-500", "bg-purple-500", "bg-orange-500", "bg-red-500"];
    return colors[tier] || "bg-gray-500";
  };

  const getStatusColor = (status: ConstructionStatus) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-500";
      case "queued":
        return "bg-yellow-500";
      case "paused":
        return "bg-orange-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleStartConstruction = () => {
    if (!selectedBlueprint || !customShipName) return;
    if (!canAffordConstruction(selectedBlueprint.construction_cost)) return;
    if (!meetsRequirements(selectedBlueprint.requirements)) return;

    const newProject: ConstructionProject = {
      id: `proj_${Date.now()}`,
      blueprint: selectedBlueprint,
      ship_name: customShipName,
      status: constructionStats.inProgress > 0 ? "queued" : "in_progress",
      progress: 0,
      started_at: new Date(),
      hours_remaining: selectedBlueprint.construction_cost.time_hours,
      assigned_engineers: 120,
    };

    setConstructionQueue((prev) => [...prev, newProject]);
    setCustomShipName("");
    setSelectedBlueprintId(null);
  };

  const handlePauseResume = (projectId: string) => {
    setConstructionQueue((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          status: proj.status === "paused" ? "in_progress" : "paused",
        };
      })
    );
  };

  const handleRushConstruction = (projectId: string) => {
    setConstructionQueue((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          progress: 100,
          status: "completed",
          estimated_completion: new Date(),
        };
      })
    );
  };

  const handleCancelConstruction = (projectId: string) => {
    setConstructionQueue((prev) => prev.filter((proj) => proj.id !== projectId));
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ship Construction & Shipyard</h1>
          <p className="text-muted-foreground mt-1">
            Build and customize ships for your fleet
          </p>
        </div>
        <div className="flex gap-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            <DollarSign className="h-4 w-4 mr-1" />
            {playerCredits.toLocaleString()} Credits
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Wrench className="h-4 w-4 mr-1" />
            Shipyard Level {shipyardLevel}
          </Badge>
        </div>
      </div>

      {/* CONSTRUCTION STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{constructionStats.total}</p>
              </div>
              <Rocket className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-blue-500">{constructionStats.inProgress}</p>
              </div>
              <Play className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Queued</p>
                <p className="text-2xl font-bold text-yellow-500">{constructionStats.queued}</p>
              </div>
              <Timer className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-500">{constructionStats.completed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MAIN TABS */}
      <Tabs defaultValue="blueprints" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="blueprints">Ship Blueprints</TabsTrigger>
          <TabsTrigger value="queue">Construction Queue</TabsTrigger>
          <TabsTrigger value="completed">Completed Ships</TabsTrigger>
        </TabsList>

        {/* BLUEPRINTS TAB */}
        <TabsContent value="blueprints" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Ship Class</label>
                  <select
                    className="border rounded px-3 py-2"
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value as any)}
                  >
                    <option value="all">All Classes</option>
                    <option value="escort">Escort</option>
                    <option value="cruiser">Cruiser</option>
                    <option value="battleship">Battleship</option>
                    <option value="science">Science</option>
                    <option value="carrier">Carrier</option>
                    <option value="destroyer">Destroyer</option>
                    <option value="frigate">Frigate</option>
                    <option value="dreadnought">Dreadnought</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tier</label>
                  <select
                    className="border rounded px-3 py-2"
                    value={filterTier}
                    onChange={(e) => setFilterTier(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                  >
                    <option value="all">All Tiers</option>
                    <option value="1">Tier 1</option>
                    <option value="2">Tier 2</option>
                    <option value="3">Tier 3</option>
                    <option value="4">Tier 4</option>
                    <option value="5">Tier 5</option>
                  </select>
                </div>
                <div className="flex-1"></div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Available Blueprints</p>
                  <p className="text-2xl font-bold">{filteredBlueprints.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blueprint Grid */}
          <ScrollArea className="h-[700px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
              {filteredBlueprints.map((blueprint) => {
                const canAfford = canAffordConstruction(blueprint.construction_cost);
                const meetsReqs = meetsRequirements(blueprint.requirements);
                const isLocked = !meetsReqs;

                return (
                  <Card
                    key={blueprint.id}
                    className={`cursor-pointer transition-all ${
                      selectedBlueprintId === blueprint.id ? "ring-2 ring-primary" : ""
                    } ${isLocked ? "opacity-60" : ""}`}
                    onClick={() => !isLocked && setSelectedBlueprintId(blueprint.id)}
                  >
                    <CardContent className="pt-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            {getClassIcon(blueprint.class)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              {blueprint.name}
                              {isLocked && <AlertCircle className="h-4 w-4 text-red-500" />}
                            </h3>
                            <p className="text-sm text-muted-foreground capitalize">
                              {blueprint.class} • {blueprint.role.replace("_", " ")}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${getTierColor(blueprint.tier)} text-white`}>
                          Tier {blueprint.tier}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-4">{blueprint.description}</p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="text-center p-2 bg-muted rounded">
                          <p className="text-xs text-muted-foreground">Hull</p>
                          <p className="text-sm font-bold">{blueprint.stats.hull.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <p className="text-xs text-muted-foreground">Shields</p>
                          <p className="text-sm font-bold">{blueprint.stats.shields.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <p className="text-xs text-muted-foreground">Weapons</p>
                          <p className="text-sm font-bold">{blueprint.stats.weapons}</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <p className="text-xs text-muted-foreground">Speed</p>
                          <p className="text-sm font-bold">{blueprint.stats.speed}</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <p className="text-xs text-muted-foreground">Crew</p>
                          <p className="text-sm font-bold">{blueprint.stats.crew}</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <p className="text-xs text-muted-foreground">Cargo</p>
                          <p className="text-sm font-bold">{blueprint.stats.cargo}</p>
                        </div>
                      </div>

                      {/* Special Abilities */}
                      {blueprint.special_abilities && blueprint.special_abilities.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-medium mb-1">Special Abilities:</p>
                          <div className="flex flex-wrap gap-1">
                            {blueprint.special_abilities.map((ability, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {ability}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cost */}
                      <div className="mb-3 p-2 bg-muted rounded">
                        <p className="text-xs font-medium mb-1">Construction Cost:</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className={canAfford ? "" : "text-red-500"}>
                            {blueprint.construction_cost.credits.toLocaleString()} Credits
                          </span>
                          <span>•</span>
                          <span>{blueprint.construction_cost.time_hours}h</span>
                          <span>•</span>
                          <span>
                            {Object.entries(blueprint.construction_cost.resources)
                              .map(([res, amt]) => `${amt} ${res}`)
                              .join(", ")}
                          </span>
                        </div>
                      </div>

                      {/* Requirements */}
                      {isLocked && (
                        <div className="p-2 bg-red-500/10 border border-red-500/20 rounded mb-3">
                          <p className="text-xs text-red-500 font-medium">Requirements Not Met:</p>
                          <p className="text-xs text-red-500">
                            {!blueprint.requirements.unlocked && "Blueprint not unlocked • "}
                            {playerTechLevel < blueprint.requirements.tech_level &&
                              `Tech Level ${blueprint.requirements.tech_level} required • `}
                            {shipyardLevel < blueprint.requirements.shipyard_level &&
                              `Shipyard Level ${blueprint.requirements.shipyard_level} required`}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>

          {/* Construction Dialog */}
          {selectedBlueprint && (
            <Card className="border-primary">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Start Construction: {selectedBlueprint.name}</h3>
                    <p className="text-sm text-muted-foreground">Enter a name for your new ship</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedBlueprintId(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-4">
                  <Input
                    placeholder="USS Enterprise"
                    value={customShipName}
                    onChange={(e) => setCustomShipName(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleStartConstruction}
                    disabled={
                      !customShipName ||
                      !canAffordConstruction(selectedBlueprint.construction_cost) ||
                      !meetsRequirements(selectedBlueprint.requirements)
                    }
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    Begin Construction
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* CONSTRUCTION QUEUE TAB */}
        <TabsContent value="queue" className="space-y-4">
          <ScrollArea className="h-[700px]">
            <div className="space-y-4 pr-4">
              {constructionQueue.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <Rocket className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-semibold">No Construction Projects</p>
                      <p className="text-sm text-muted-foreground">
                        Start building ships from the Blueprints tab
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                constructionQueue.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="pt-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{project.ship_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {project.blueprint.name} • {project.blueprint.class}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(project.status)} text-white`}>
                          {project.status.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Construction Progress</span>
                          <span className="text-sm">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                        {project.hours_remaining > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {project.hours_remaining}h remaining
                          </p>
                        )}
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="text-center p-2 bg-muted rounded">
                          <p className="text-xs text-muted-foreground">Engineers</p>
                          <p className="text-sm font-bold">{project.assigned_engineers}</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <p className="text-xs text-muted-foreground">Started</p>
                          <p className="text-sm font-bold">
                            {project.started_at.toLocaleDateString()}
                          </p>
                        </div>
                        {project.estimated_completion && (
                          <div className="text-center p-2 bg-muted rounded">
                            <p className="text-xs text-muted-foreground">Completion</p>
                            <p className="text-sm font-bold">
                              {project.estimated_completion.toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {project.status === "in_progress" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePauseResume(project.id)}
                          >
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                        )}
                        {project.status === "paused" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePauseResume(project.id)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </Button>
                        )}
                        {project.rush_cost && project.status === "in_progress" && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleRushConstruction(project.id)}
                          >
                            <FastForward className="h-4 w-4 mr-2" />
                            Rush ({project.rush_cost.toLocaleString()} Credits)
                          </Button>
                        )}
                        {project.status !== "completed" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelConstruction(project.id)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* COMPLETED SHIPS TAB */}
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
                <p className="text-lg font-semibold">No Completed Ships Yet</p>
                <p className="text-sm text-muted-foreground">
                  Completed ships will appear here and be added to your fleet
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
