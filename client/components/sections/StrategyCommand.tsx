import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  Square,
  FastForward,
  Rewind,
  Crown,
  Coins,
  Zap,
  Factory,
  Users,
  Shield,
  Target,
  Clock,
  TrendingUp,
  Settings,
  MapPin,
  Building,
} from "lucide-react";

interface Resource {
  id: string;
  name: string;
  amount: number;
  production_rate: number;
  consumption_rate: number;
  storage_capacity: number;
  icon: React.ReactNode;
}

interface Building {
  id: string;
  name: string;
  type: "Resource" | "Military" | "Research" | "Infrastructure" | "Defensive";
  level: number;
  max_level: number;
  construction_time: number;
  cost: { [resource: string]: number };
  effects: {
    resource_production?: { [resource: string]: number };
    research_bonus?: number;
    defense_bonus?: number;
    population_capacity?: number;
  };
  prerequisites: string[];
  description: string;
}

interface Research {
  id: string;
  name: string;
  category: "Engineering" | "Science" | "Military" | "Diplomacy" | "Economics";
  level: number;
  max_level: number;
  research_points_required: number;
  research_points_current: number;
  effects: {
    resource_efficiency?: { [resource: string]: number };
    building_unlock?: string[];
    ship_unlock?: string[];
    technology_bonus?: { [tech: string]: number };
  };
  prerequisites: string[];
  description: string;
}

interface GameState {
  turn_number: number;
  game_speed: "Paused" | "1x" | "2x" | "4x" | "8x";
  mode: "RTS" | "Turn-Based";
  time_remaining_seconds?: number;
}

interface Territory {
  id: string;
  name: string;
  type: "Colony" | "Outpost" | "Starbase" | "Capital";
  population: number;
  defense_rating: number;
  resource_nodes: string[];
  buildings: string[];
  under_construction: string[];
  controlled_by: string;
}

export function StrategyCommand() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "resources" | "buildings" | "research" | "territories"
  >("overview");
  const [gameState, setGameState] = useState<GameState>({
    turn_number: 247,
    game_speed: "1x",
    mode: "RTS",
    time_remaining_seconds: 300,
  });

  const [resources, setResources] = useState<Resource[]>([
    {
      id: "energy",
      name: "Energy Credits",
      amount: 2847,
      production_rate: 125,
      consumption_rate: 98,
      storage_capacity: 5000,
      icon: <Zap className="w-4 h-4" />,
    },
    {
      id: "minerals",
      name: "Minerals",
      amount: 1923,
      production_rate: 89,
      consumption_rate: 45,
      storage_capacity: 3000,
      icon: <Building className="w-4 h-4" />,
    },
    {
      id: "dilithium",
      name: "Dilithium",
      amount: 456,
      production_rate: 23,
      consumption_rate: 18,
      storage_capacity: 800,
      icon: <Crown className="w-4 h-4" />,
    },
    {
      id: "research",
      name: "Research Points",
      amount: 789,
      production_rate: 67,
      consumption_rate: 67,
      storage_capacity: 1000,
      icon: <Settings className="w-4 h-4" />,
    },
    {
      id: "population",
      name: "Population",
      amount: 15670,
      production_rate: 45,
      consumption_rate: 0,
      storage_capacity: 20000,
      icon: <Users className="w-4 h-4" />,
    },
  ]);

  const buildings: Building[] = [
    {
      id: "power_plant",
      name: "Fusion Power Plant",
      type: "Resource",
      level: 3,
      max_level: 5,
      construction_time: 180,
      cost: { energy: 200, minerals: 150 },
      effects: {
        resource_production: { energy: 45 },
      },
      prerequisites: [],
      description:
        "Advanced fusion reactor providing clean energy for your colonies",
    },
    {
      id: "mining_facility",
      name: "Automated Mining Facility",
      type: "Resource",
      level: 2,
      max_level: 4,
      construction_time: 240,
      cost: { energy: 180, minerals: 120 },
      effects: {
        resource_production: { minerals: 35 },
      },
      prerequisites: [],
      description:
        "Robotic mining operation extracting valuable minerals from asteroids",
    },
    {
      id: "research_lab",
      name: "Advanced Research Laboratory",
      type: "Research",
      level: 4,
      max_level: 6,
      construction_time: 300,
      cost: { energy: 250, minerals: 200, dilithium: 50 },
      effects: {
        research_bonus: 25,
        resource_production: { research: 30 },
      },
      prerequisites: ["basic_research"],
      description:
        "State-of-the-art facility for scientific research and development",
    },
    {
      id: "defense_grid",
      name: "Planetary Defense Grid",
      type: "Defensive",
      level: 2,
      max_level: 3,
      construction_time: 200,
      cost: { energy: 300, minerals: 250, dilithium: 75 },
      effects: {
        defense_bonus: 40,
      },
      prerequisites: ["basic_shields"],
      description:
        "Orbital defense platforms protecting against hostile fleets",
    },
    {
      id: "starbase",
      name: "Deep Space Starbase",
      type: "Military",
      level: 1,
      max_level: 3,
      construction_time: 600,
      cost: { energy: 800, minerals: 600, dilithium: 200 },
      effects: {
        defense_bonus: 80,
        population_capacity: 5000,
      },
      prerequisites: ["advanced_engineering", "starbase_construction"],
      description:
        "Massive space station serving as a military and administrative hub",
    },
  ];

  const research: Research[] = [
    {
      id: "warp_theory",
      name: "Advanced Warp Theory",
      category: "Engineering",
      level: 6,
      max_level: 10,
      research_points_required: 450,
      research_points_current: 287,
      effects: {
        technology_bonus: { warp_speed: 15, fuel_efficiency: 10 },
      },
      prerequisites: ["basic_warp", "subspace_physics"],
      description: "Theoretical breakthroughs in faster-than-light travel",
    },
    {
      id: "quantum_computing",
      name: "Quantum Computing",
      category: "Science",
      level: 4,
      max_level: 8,
      research_points_required: 380,
      research_points_current: 156,
      effects: {
        research_bonus: 20,
        building_unlock: ["quantum_lab", "ai_core"],
      },
      prerequisites: ["advanced_computing", "quantum_mechanics"],
      description:
        "Revolutionary computing technology using quantum entanglement",
    },
    {
      id: "shield_harmonics",
      name: "Shield Harmonics",
      category: "Military",
      level: 3,
      max_level: 6,
      research_points_required: 320,
      research_points_current: 89,
      effects: {
        technology_bonus: { shield_strength: 25, power_efficiency: 15 },
      },
      prerequisites: ["basic_shields", "energy_manipulation"],
      description:
        "Advanced shield modulation techniques for enhanced protection",
    },
    {
      id: "diplomatic_protocols",
      name: "Interspecies Diplomacy",
      category: "Diplomacy",
      level: 5,
      max_level: 7,
      research_points_required: 280,
      research_points_current: 203,
      effects: {
        technology_bonus: { trade_efficiency: 20, negotiation_bonus: 30 },
      },
      prerequisites: ["xenobiology", "cultural_studies"],
      description: "Enhanced understanding of alien cultures and communication",
    },
    {
      id: "resource_efficiency",
      name: "Resource Optimization",
      category: "Economics",
      level: 7,
      max_level: 10,
      research_points_required: 400,
      research_points_current: 340,
      effects: {
        resource_efficiency: { energy: 15, minerals: 10, dilithium: 20 },
      },
      prerequisites: ["industrial_automation", "logistics_optimization"],
      description: "Advanced techniques for maximizing resource utilization",
    },
  ];

  const territories: Territory[] = [
    {
      id: "earth",
      name: "Earth",
      type: "Capital",
      population: 9800000,
      defense_rating: 95,
      resource_nodes: ["energy", "minerals", "research"],
      buildings: ["power_plant", "research_lab", "defense_grid"],
      under_construction: [],
      controlled_by: "Federation",
    },
    {
      id: "mars_colony",
      name: "Mars Colony",
      type: "Colony",
      population: 2300000,
      defense_rating: 45,
      resource_nodes: ["minerals", "energy"],
      buildings: ["mining_facility", "power_plant"],
      under_construction: ["research_lab"],
      controlled_by: "Federation",
    },
    {
      id: "starbase_74",
      name: "Starbase 74",
      type: "Starbase",
      population: 150000,
      defense_rating: 88,
      resource_nodes: ["dilithium", "energy"],
      buildings: ["starbase", "defense_grid"],
      under_construction: [],
      controlled_by: "Federation",
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameState.game_speed !== "Paused") {
      const speed = parseInt(gameState.game_speed.replace("x", ""));
      interval = setInterval(() => {
        if (gameState.mode === "RTS") {
          // Update resources in real-time
          setResources((prev) =>
            prev.map((resource) => ({
              ...resource,
              amount: Math.min(
                resource.storage_capacity,
                resource.amount +
                  ((resource.production_rate - resource.consumption_rate) *
                    speed) /
                    10,
              ),
            })),
          );
        } else {
          // Turn-based timer
          if (
            gameState.time_remaining_seconds &&
            gameState.time_remaining_seconds > 0
          ) {
            setGameState((prev) => ({
              ...prev,
              time_remaining_seconds: Math.max(
                0,
                (prev.time_remaining_seconds || 0) - 1,
              ),
            }));
          }
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.game_speed, gameState.mode]);

  const toggleGameSpeed = () => {
    const speeds = ["Paused", "1x", "2x", "4x", "8x"];
    const currentIndex = speeds.indexOf(gameState.game_speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setGameState((prev) => ({ ...prev, game_speed: speeds[nextIndex] as any }));
  };

  const toggleGameMode = () => {
    setGameState((prev) => ({
      ...prev,
      mode: prev.mode === "RTS" ? "Turn-Based" : "RTS",
      time_remaining_seconds: prev.mode === "RTS" ? 300 : undefined,
    }));
  };

  const nextTurn = () => {
    if (gameState.mode === "Turn-Based") {
      setGameState((prev) => ({
        ...prev,
        turn_number: prev.turn_number + 1,
        time_remaining_seconds: 300,
      }));

      // Process turn-based resource generation
      setResources((prev) =>
        prev.map((resource) => ({
          ...resource,
          amount: Math.min(
            resource.storage_capacity,
            resource.amount +
              (resource.production_rate - resource.consumption_rate),
          ),
        })),
      );
    }
  };

  const getResourceColor = (resourceId: string) => {
    switch (resourceId) {
      case "energy":
        return "text-yellow-400";
      case "minerals":
        return "text-blue-400";
      case "dilithium":
        return "text-purple-400";
      case "research":
        return "text-green-400";
      case "population":
        return "text-cyan-400";
      default:
        return "text-trek-blue";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Engineering":
        return "text-blue-400 border-blue-400 bg-blue-400/20";
      case "Science":
        return "text-green-400 border-green-400 bg-green-400/20";
      case "Military":
        return "text-red-400 border-red-400 bg-red-400/20";
      case "Diplomacy":
        return "text-purple-400 border-purple-400 bg-purple-400/20";
      case "Economics":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  const getBuildingTypeColor = (type: string) => {
    switch (type) {
      case "Resource":
        return "text-green-400 border-green-400 bg-green-400/20";
      case "Military":
        return "text-red-400 border-red-400 bg-red-400/20";
      case "Research":
        return "text-blue-400 border-blue-400 bg-blue-400/20";
      case "Infrastructure":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Defensive":
        return "text-purple-400 border-purple-400 bg-purple-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          STRATEGIC COMMAND CENTER
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-trek-text/70">Mode:</span>
            <Button
              variant="outline"
              size="sm"
              className={`border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark`}
              onClick={toggleGameMode}
            >
              {gameState.mode}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-trek-text/70">Speed:</span>
            <Button
              variant="outline"
              size="sm"
              className={`border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark`}
              onClick={toggleGameSpeed}
            >
              {gameState.game_speed === "Paused" ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span className="ml-1">{gameState.game_speed}</span>
            </Button>
          </div>

          <div className="text-right">
            <div className="text-sm text-trek-text/70">Turn</div>
            <div className="text-trek-blue font-semibold">
              {gameState.turn_number}
            </div>
          </div>

          {gameState.mode === "Turn-Based" && (
            <Button
              className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
              onClick={nextTurn}
            >
              <FastForward className="w-4 h-4 mr-2" />
              Next Turn
            </Button>
          )}
        </div>
      </div>

      {/* Game Status Bar */}
      <Card className="bg-trek-panel border-trek-accent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {resources.slice(0, 4).map((resource) => (
              <div key={resource.id} className="flex items-center gap-2">
                <span className={getResourceColor(resource.id)}>
                  {resource.icon}
                </span>
                <div>
                  <div
                    className={`font-semibold ${getResourceColor(resource.id)}`}
                  >
                    {Math.round(resource.amount)}
                  </div>
                  <div className="text-xs text-trek-text/70">
                    {resource.production_rate > resource.consumption_rate
                      ? "+"
                      : ""}
                    {resource.production_rate - resource.consumption_rate}/turn
                  </div>
                </div>
              </div>
            ))}
          </div>

          {gameState.mode === "Turn-Based" &&
            gameState.time_remaining_seconds && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-trek-warning" />
                <span className="text-trek-warning font-semibold">
                  {Math.floor((gameState.time_remaining_seconds || 0) / 60)}:
                  {((gameState.time_remaining_seconds || 0) % 60)
                    .toString()
                    .padStart(2, "0")}
                </span>
              </div>
            )}
        </div>
      </Card>

      <div className="flex gap-2 mb-6">
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
          <Crown className="w-4 h-4 mr-2" />
          Overview
        </Button>
        <Button
          variant={activeTab === "resources" ? "default" : "outline"}
          size="sm"
          className={
            activeTab === "resources"
              ? "bg-trek-blue text-trek-dark"
              : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
          }
          onClick={() => setActiveTab("resources")}
        >
          <Coins className="w-4 h-4 mr-2" />
          Resources
        </Button>
        <Button
          variant={activeTab === "buildings" ? "default" : "outline"}
          size="sm"
          className={
            activeTab === "buildings"
              ? "bg-trek-blue text-trek-dark"
              : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
          }
          onClick={() => setActiveTab("buildings")}
        >
          <Factory className="w-4 h-4 mr-2" />
          Buildings
        </Button>
        <Button
          variant={activeTab === "research" ? "default" : "outline"}
          size="sm"
          className={
            activeTab === "research"
              ? "bg-trek-blue text-trek-dark"
              : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
          }
          onClick={() => setActiveTab("research")}
        >
          <Settings className="w-4 h-4 mr-2" />
          Research
        </Button>
        <Button
          variant={activeTab === "territories" ? "default" : "outline"}
          size="sm"
          className={
            activeTab === "territories"
              ? "bg-trek-blue text-trek-dark"
              : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
          }
          onClick={() => setActiveTab("territories")}
        >
          <MapPin className="w-4 h-4 mr-2" />
          Territories
        </Button>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Empire Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-trek-blue">
                    {territories.length}
                  </div>
                  <div className="text-sm text-trek-text/70">
                    Controlled Territories
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-trek-gold">
                    {territories
                      .reduce((sum, t) => sum + t.population, 0)
                      .toLocaleString()}
                  </div>
                  <div className="text-sm text-trek-text/70">
                    Total Population
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-trek-blue">
                    {buildings.length}
                  </div>
                  <div className="text-sm text-trek-text/70">
                    Building Types
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-trek-gold">
                    {research.filter((r) => r.level > 0).length}
                  </div>
                  <div className="text-sm text-trek-text/70">
                    Technologies Researched
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Resource Production
              </h3>
              <div className="space-y-3">
                {resources.map((resource) => (
                  <div key={resource.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <div className="flex items-center gap-2">
                        <span className={getResourceColor(resource.id)}>
                          {resource.icon}
                        </span>
                        <span>{resource.name}</span>
                      </div>
                      <span className={getResourceColor(resource.id)}>
                        {Math.round(resource.amount)}/
                        {resource.storage_capacity}
                      </span>
                    </div>
                    <Progress
                      value={
                        (resource.amount / resource.storage_capacity) * 100
                      }
                      className="h-2"
                    />
                    <div className="text-xs text-trek-text/70 mt-1">
                      Production: +{resource.production_rate} | Consumption: -
                      {resource.consumption_rate}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Recent Activity
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-trek-text/70">
                    Turn {gameState.turn_number - 2}
                  </span>
                  <span>Research completed: Shield Harmonics Level 2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-trek-text/70">
                    Turn {gameState.turn_number - 1}
                  </span>
                  <span>Building completed: Mars Mining Facility</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-trek-text/70">
                    Turn {gameState.turn_number}
                  </span>
                  <span>New colony established: Alpha Centauri B</span>
                </div>
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Strategic Goals
              </h3>
              <div className="space-y-3">
                <div className="p-3 border border-trek-accent rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-trek-gold">Expand to 10 Systems</span>
                    <span className="text-trek-blue">7/10</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
                <div className="p-3 border border-trek-accent rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-trek-gold">
                      Research Warp 10 Technology
                    </span>
                    <span className="text-trek-blue">6/10</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div className="p-3 border border-trek-accent rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-trek-gold">
                      Establish Diplomatic Relations
                    </span>
                    <span className="text-trek-blue">4/8</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "resources" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <Card
              key={resource.id}
              className="bg-trek-panel border-trek-accent p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-2xl ${getResourceColor(resource.id)}`}>
                  {resource.icon}
                </span>
                <div>
                  <h3 className="font-bold text-trek-gold">{resource.name}</h3>
                  <div className={`text-sm ${getResourceColor(resource.id)}`}>
                    {Math.round(resource.amount).toLocaleString()} /{" "}
                    {resource.storage_capacity.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Storage</span>
                    <span className={getResourceColor(resource.id)}>
                      {(
                        (resource.amount / resource.storage_capacity) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <Progress
                    value={(resource.amount / resource.storage_capacity) * 100}
                    className="h-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-trek-text/70">Production</div>
                    <div className="text-green-400 font-semibold">
                      +{resource.production_rate}
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70">Consumption</div>
                    <div className="text-red-400 font-semibold">
                      -{resource.consumption_rate}
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70">Net Income</div>
                    <div
                      className={`font-semibold ${resource.production_rate > resource.consumption_rate ? "text-green-400" : "text-red-400"}`}
                    >
                      {resource.production_rate > resource.consumption_rate
                        ? "+"
                        : ""}
                      {resource.production_rate - resource.consumption_rate}
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70">Time to Full</div>
                    <div className="text-trek-blue font-semibold">
                      {resource.production_rate > resource.consumption_rate
                        ? Math.round(
                            (resource.storage_capacity - resource.amount) /
                              (resource.production_rate -
                                resource.consumption_rate),
                          ) + "t"
                        : "∞"}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "buildings" && (
        <div className="space-y-4">
          {buildings.map((building) => (
            <Card
              key={building.id}
              className="bg-trek-panel border-trek-accent p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Factory className="w-6 h-6 text-trek-gold" />
                  <div>
                    <h3 className="font-bold text-trek-gold text-lg">
                      {building.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getBuildingTypeColor(building.type)}`}
                      >
                        {building.type}
                      </Badge>
                      <span className="text-sm text-trek-blue">
                        Level {building.level}/{building.max_level}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-trek-text/70">
                    Construction Time
                  </div>
                  <div className="text-trek-blue font-semibold">
                    {building.construction_time}s
                  </div>
                </div>
              </div>

              <p className="text-sm text-trek-text/80 mb-4">
                {building.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Construction Cost
                  </h4>
                  <div className="space-y-1 text-sm">
                    {Object.entries(building.cost).map(([resource, amount]) => (
                      <div key={resource} className="flex justify-between">
                        <span className="text-trek-text/70 capitalize">
                          {resource}:
                        </span>
                        <span className={getResourceColor(resource)}>
                          {amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">Effects</h4>
                  <div className="space-y-1 text-sm">
                    {building.effects.resource_production &&
                      Object.entries(building.effects.resource_production).map(
                        ([resource, amount]) => (
                          <div key={resource} className="flex justify-between">
                            <span className="text-trek-text/70 capitalize">
                              {resource} Production:
                            </span>
                            <span className="text-green-400">
                              +{amount}/turn
                            </span>
                          </div>
                        ),
                      )}
                    {building.effects.research_bonus && (
                      <div className="flex justify-between">
                        <span className="text-trek-text/70">
                          Research Bonus:
                        </span>
                        <span className="text-green-400">
                          +{building.effects.research_bonus}%
                        </span>
                      </div>
                    )}
                    {building.effects.defense_bonus && (
                      <div className="flex justify-between">
                        <span className="text-trek-text/70">
                          Defense Bonus:
                        </span>
                        <span className="text-green-400">
                          +{building.effects.defense_bonus}%
                        </span>
                      </div>
                    )}
                    {building.effects.population_capacity && (
                      <div className="flex justify-between">
                        <span className="text-trek-text/70">
                          Population Capacity:
                        </span>
                        <span className="text-green-400">
                          +
                          {building.effects.population_capacity.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                  disabled={building.level >= building.max_level}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Upgrade ({building.level + 1}/{building.max_level})
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "research" && (
        <div className="space-y-4">
          {research.map((tech) => (
            <Card
              key={tech.id}
              className="bg-trek-panel border-trek-accent p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-trek-gold" />
                  <div>
                    <h3 className="font-bold text-trek-gold text-lg">
                      {tech.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getCategoryColor(tech.category)}`}
                      >
                        {tech.category}
                      </Badge>
                      <span className="text-sm text-trek-blue">
                        Level {tech.level}/{tech.max_level}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-trek-text/70">Progress</div>
                  <div className="text-trek-blue font-semibold">
                    {tech.research_points_current}/
                    {tech.research_points_required}
                  </div>
                </div>
              </div>

              <p className="text-sm text-trek-text/80 mb-4">
                {tech.description}
              </p>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Research Progress</span>
                  <span className="text-trek-blue">
                    {(
                      (tech.research_points_current /
                        tech.research_points_required) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (tech.research_points_current /
                      tech.research_points_required) *
                    100
                  }
                  className="h-3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {tech.effects.technology_bonus && (
                  <div>
                    <h4 className="font-semibold text-trek-gold mb-2">
                      Technology Bonuses
                    </h4>
                    <div className="space-y-1 text-sm">
                      {Object.entries(tech.effects.technology_bonus).map(
                        ([bonus, value]) => (
                          <div key={bonus} className="flex justify-between">
                            <span className="text-trek-text/70 capitalize">
                              {bonus.replace("_", " ")}:
                            </span>
                            <span className="text-green-400">+{value}%</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {(tech.effects.building_unlock || tech.effects.ship_unlock) && (
                  <div>
                    <h4 className="font-semibold text-trek-gold mb-2">
                      Unlocks
                    </h4>
                    <div className="space-y-1 text-sm">
                      {tech.effects.building_unlock?.map((building, i) => (
                        <div key={i} className="text-trek-blue">
                          Building: {building}
                        </div>
                      ))}
                      {tech.effects.ship_unlock?.map((ship, i) => (
                        <div key={i} className="text-trek-blue">
                          Ship: {ship}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                  disabled={tech.level >= tech.max_level}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Research Next Level
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Set Priority
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "territories" && (
        <div className="space-y-4">
          {territories.map((territory) => (
            <Card
              key={territory.id}
              className="bg-trek-panel border-trek-accent p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-trek-gold" />
                  <div>
                    <h3 className="font-bold text-trek-gold text-lg">
                      {territory.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className="text-xs border-trek-blue text-trek-blue"
                      >
                        {territory.type}
                      </Badge>
                      <span className="text-sm text-trek-text/70">
                        Controlled by {territory.controlled_by}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-trek-text/70">
                    Defense Rating
                  </div>
                  <div className="text-trek-blue font-semibold">
                    {territory.defense_rating}/100
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-trek-text/70 text-sm">Population</div>
                  <div className="text-trek-blue font-semibold">
                    {territory.population.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm">
                    Resource Nodes
                  </div>
                  <div className="text-trek-gold font-semibold">
                    {territory.resource_nodes.length}
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm">Buildings</div>
                  <div className="text-trek-blue font-semibold">
                    {territory.buildings.length}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Active Buildings
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {territory.buildings.map((buildingId, i) => {
                      const building = buildings.find(
                        (b) => b.id === buildingId,
                      );
                      return (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs border-trek-blue text-trek-blue"
                        >
                          {building?.name || buildingId}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {territory.under_construction.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-trek-gold mb-2">
                      Under Construction
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {territory.under_construction.map((buildingId, i) => {
                        const building = buildings.find(
                          (b) => b.id === buildingId,
                        );
                        return (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs border-trek-warning text-trek-warning"
                          >
                            {building?.name || buildingId} (Building...)
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Resource Nodes
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {territory.resource_nodes.map((resourceId, i) => {
                      const resource = resources.find(
                        (r) => r.id === resourceId,
                      );
                      return (
                        <Badge
                          key={i}
                          variant="outline"
                          className={`text-xs border-current ${getResourceColor(resourceId)}`}
                        >
                          {resource?.name || resourceId}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-trek-accent">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                  >
                    <Building className="w-4 h-4 mr-2" />
                    Construct Building
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Upgrade Defenses
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-accent text-trek-text hover:bg-trek-accent"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Territory
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
