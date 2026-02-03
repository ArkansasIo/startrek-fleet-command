import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Crown,
  Target,
  Shield,
  Navigation,
  Users,
  Zap,
  Radio,
  Map,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Crosshair,
  Move,
} from "lucide-react";

interface FleetFormation {
  id: string;
  name: string;
  description: string;
  effectiveness: {
    offense: number;
    defense: number;
    maneuverability: number;
    coordination: number;
  };
  optimal_ship_count: number;
  formation_pattern: string[][];
}

interface TacticalManeuver {
  id: string;
  name: string;
  type: "Offensive" | "Defensive" | "Evasive" | "Coordination";
  duration_minutes: number;
  coordination_required: number;
  effects: {
    damage_bonus: number;
    defense_bonus: number;
    speed_modifier: number;
    accuracy_bonus: number;
  };
  description: string;
}

interface FleetStatus {
  formation: string;
  coordination_level: number;
  morale: number;
  combat_readiness: number;
  fuel_status: number;
  maintenance_status: number;
  communication_efficiency: number;
  active_maneuvers: string[];
}

interface EnemyFleet {
  id: string;
  name: string;
  composition: string;
  estimated_strength: number;
  distance: number;
  bearing: number;
  formation: string;
  threat_assessment: "Low" | "Medium" | "High" | "Critical";
  intent: "Patrol" | "Aggressive" | "Defensive" | "Unknown";
}

interface CombatReport {
  id: string;
  timestamp: string;
  action: string;
  ship_involved: string;
  damage_dealt: number;
  damage_received: number;
  status: "Success" | "Failure" | "Partial";
}

export function FleetTactical() {
  const [activeTab, setActiveTab] = useState<
    "command" | "formations" | "maneuvers" | "combat"
  >("command");
  const [selectedFormation, setSelectedFormation] =
    useState<string>("line_formation");
  const [activeManeuvers, setActiveManeuvers] = useState<string[]>([]);
  const [combatActive, setCombatActive] = useState(false);
  const [combatTimer, setCombatTimer] = useState(0);

  const [fleetStatus, setFleetStatus] = useState<FleetStatus>({
    formation: "line_formation",
    coordination_level: 87,
    morale: 92,
    combat_readiness: 95,
    fuel_status: 78,
    maintenance_status: 88,
    communication_efficiency: 94,
    active_maneuvers: [],
  });

  const formations: FleetFormation[] = [
    {
      id: "line_formation",
      name: "Line Formation",
      description:
        "Traditional battle line maximizing forward firepower while maintaining unit cohesion.",
      effectiveness: {
        offense: 8,
        defense: 6,
        maneuverability: 4,
        coordination: 9,
      },
      optimal_ship_count: 8,
      formation_pattern: [
        ["🚀", "🚀", "🚀", "🚀"],
        ["🚀", "🚀", "🚀", "🚀"],
      ],
    },
    {
      id: "wedge_formation",
      name: "Wedge Formation",
      description:
        "Aggressive spearhead formation designed to break through enemy lines with concentrated force.",
      effectiveness: {
        offense: 10,
        defense: 5,
        maneuverability: 7,
        coordination: 6,
      },
      optimal_ship_count: 7,
      formation_pattern: [
        ["", "", "👑", "", ""],
        ["", "🚀", "🚀", "🚀", ""],
        ["🚀", "🚀", "", "🚀", "🚀"],
      ],
    },
    {
      id: "sphere_formation",
      name: "Sphere Formation",
      description:
        "Defensive formation providing 360-degree coverage and mutual protection for all vessels.",
      effectiveness: {
        offense: 6,
        defense: 10,
        maneuverability: 5,
        coordination: 8,
      },
      optimal_ship_count: 9,
      formation_pattern: [
        ["", "🚀", "🚀", "🚀", ""],
        ["🚀", "", "👑", "", "🚀"],
        ["", "🚀", "🚀", "🚀", ""],
      ],
    },
    {
      id: "diamond_formation",
      name: "Diamond Formation",
      description:
        "Balanced formation offering good offensive and defensive capabilities with enhanced maneuverability.",
      effectiveness: {
        offense: 7,
        defense: 7,
        maneuverability: 8,
        coordination: 7,
      },
      optimal_ship_count: 5,
      formation_pattern: [
        ["", "", "🚀", "", ""],
        ["", "🚀", "👑", "🚀", ""],
        ["", "", "🚀", "", ""],
      ],
    },
    {
      id: "wall_formation",
      name: "Wall Formation",
      description:
        "Massive defensive wall formation designed to stop enemy advances through overwhelming firepower.",
      effectiveness: {
        offense: 9,
        defense: 9,
        maneuverability: 3,
        coordination: 6,
      },
      optimal_ship_count: 12,
      formation_pattern: [
        ["🚀", "🚀", "👑", "🚀", "🚀"],
        ["🚀", "🚀", "🚀", "🚀", "🚀"],
        ["", "🚀", "", "🚀", ""],
      ],
    },
    {
      id: "swarm_formation",
      name: "Wolf Pack Formation",
      description:
        "Highly mobile formation with ships operating in coordinated groups to outflank enemies.",
      effectiveness: {
        offense: 8,
        defense: 4,
        maneuverability: 10,
        coordination: 5,
      },
      optimal_ship_count: 15,
      formation_pattern: [
        ["🚀", "", "", "", "🚀"],
        ["", "🚀", "👑", "🚀", ""],
        ["", "", "🚀", "", ""],
        ["🚀", "", "", "", "🚀"],
      ],
    },
  ];

  const tacticalManeuvers: TacticalManeuver[] = [
    {
      id: "alpha_strike",
      name: "Alpha Strike",
      type: "Offensive",
      duration_minutes: 5,
      coordination_required: 85,
      effects: {
        damage_bonus: 40,
        defense_bonus: -10,
        speed_modifier: -0.2,
        accuracy_bonus: 25,
      },
      description:
        "Coordinate all fleet weapons for a devastating simultaneous attack.",
    },
    {
      id: "evasive_pattern_delta",
      name: "Evasive Pattern Delta",
      type: "Evasive",
      duration_minutes: 8,
      coordination_required: 70,
      effects: {
        damage_bonus: -15,
        defense_bonus: 35,
        speed_modifier: 0.3,
        accuracy_bonus: -10,
      },
      description:
        "Complex evasive maneuvers to avoid incoming fire while maintaining formation.",
    },
    {
      id: "screen_formation",
      name: "Defensive Screen",
      type: "Defensive",
      duration_minutes: 15,
      coordination_required: 75,
      effects: {
        damage_bonus: 0,
        defense_bonus: 50,
        speed_modifier: -0.1,
        accuracy_bonus: 5,
      },
      description:
        "Smaller ships provide protective screen for larger vessels.",
    },
    {
      id: "pincer_movement",
      name: "Pincer Movement",
      type: "Offensive",
      duration_minutes: 12,
      coordination_required: 90,
      effects: {
        damage_bonus: 30,
        defense_bonus: -5,
        speed_modifier: 0.1,
        accuracy_bonus: 20,
      },
      description:
        "Split fleet to attack enemy from multiple angles simultaneously.",
    },
    {
      id: "tactical_withdrawal",
      name: "Tactical Withdrawal",
      type: "Evasive",
      duration_minutes: 10,
      coordination_required: 60,
      effects: {
        damage_bonus: -25,
        defense_bonus: 20,
        speed_modifier: 0.5,
        accuracy_bonus: -20,
      },
      description: "Coordinated retreat while maintaining defensive posture.",
    },
    {
      id: "fleet_coordination",
      name: "Enhanced Coordination",
      type: "Coordination",
      duration_minutes: 30,
      coordination_required: 80,
      effects: {
        damage_bonus: 15,
        defense_bonus: 15,
        speed_modifier: 0.1,
        accuracy_bonus: 15,
      },
      description: "Improve fleet-wide communication and coordination systems.",
    },
  ];

  const enemyFleets: EnemyFleet[] = [
    {
      id: "borg_fleet_1",
      name: "Borg Tactical Fleet",
      composition: "3 Cubes, 7 Spheres",
      estimated_strength: 95,
      distance: 25000,
      bearing: 315,
      formation: "Geometric Pattern",
      threat_assessment: "Critical",
      intent: "Aggressive",
    },
    {
      id: "klingon_fleet_1",
      name: "Klingon Battle Group",
      composition: "1 Negh'Var, 4 Vor'cha, 6 Bird-of-Prey",
      estimated_strength: 78,
      distance: 18000,
      bearing: 45,
      formation: "Attack Formation",
      threat_assessment: "High",
      intent: "Aggressive",
    },
    {
      id: "romulan_fleet_1",
      name: "Romulan Squadron",
      composition: "2 D'deridex, 5 Warbirds",
      estimated_strength: 65,
      distance: 32000,
      bearing: 180,
      formation: "Cloaked Advance",
      threat_assessment: "Medium",
      intent: "Unknown",
    },
  ];

  const [combatReports, setCombatReports] = useState<CombatReport[]>([
    {
      id: "report_1",
      timestamp: "15:42:33",
      action: "Alpha Strike on Borg Cube",
      ship_involved: "U.S.S. Enterprise",
      damage_dealt: 850,
      damage_received: 240,
      status: "Success",
    },
    {
      id: "report_2",
      timestamp: "15:41:15",
      action: "Evasive Maneuvers",
      ship_involved: "U.S.S. Defiant",
      damage_dealt: 0,
      damage_received: 45,
      status: "Success",
    },
    {
      id: "report_3",
      timestamp: "15:39:28",
      action: "Torpedo Barrage",
      ship_involved: "U.S.S. Voyager",
      damage_dealt: 620,
      damage_received: 180,
      status: "Partial",
    },
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (combatActive) {
      interval = setInterval(() => {
        setCombatTimer((prev) => prev + 1);

        // Simulate combat events
        if (Math.random() > 0.7) {
          const newReport: CombatReport = {
            id: `report_${Date.now()}`,
            timestamp: new Date().toLocaleTimeString().slice(0, 8),
            action: [
              "Phaser Attack",
              "Torpedo Strike",
              "Defensive Maneuver",
              "Shield Adjustment",
            ][Math.floor(Math.random() * 4)],
            ship_involved: [
              "U.S.S. Enterprise",
              "U.S.S. Defiant",
              "U.S.S. Voyager",
              "U.S.S. Intrepid",
            ][Math.floor(Math.random() * 4)],
            damage_dealt: Math.floor(Math.random() * 500),
            damage_received: Math.floor(Math.random() * 300),
            status: ["Success", "Partial", "Failure"][
              Math.floor(Math.random() * 3)
            ] as any,
          };

          setCombatReports((prev) => [newReport, ...prev.slice(0, 4)]);
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [combatActive]);

  const executeManeuver = (maneuverId: string) => {
    const maneuver = tacticalManeuvers.find((m) => m.id === maneuverId);
    if (
      !maneuver ||
      fleetStatus.coordination_level < maneuver.coordination_required
    )
      return;

    setActiveManeuvers((prev) => [...prev, maneuverId]);
    setFleetStatus((prev) => ({
      ...prev,
      active_maneuvers: [...prev.active_maneuvers, maneuverId],
    }));

    // Remove maneuver after duration
    setTimeout(() => {
      setActiveManeuvers((prev) => prev.filter((id) => id !== maneuverId));
      setFleetStatus((prev) => ({
        ...prev,
        active_maneuvers: prev.active_maneuvers.filter(
          (id) => id !== maneuverId,
        ),
      }));
    }, maneuver.duration_minutes * 1000); // Shortened for demo
  };

  const changeFormation = (formationId: string) => {
    setSelectedFormation(formationId);
    setFleetStatus((prev) => ({
      ...prev,
      formation: formationId,
      coordination_level: Math.max(50, prev.coordination_level - 10), // Formation change reduces coordination temporarily
    }));
  };

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case "Critical":
        return "text-red-500 border-red-500 bg-red-500/20";
      case "High":
        return "text-red-400 border-red-400 bg-red-400/20";
      case "Medium":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Low":
        return "text-green-400 border-green-400 bg-green-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  const getManeuverTypeColor = (type: string) => {
    switch (type) {
      case "Offensive":
        return "text-red-400 border-red-400 bg-red-400/20";
      case "Defensive":
        return "text-blue-400 border-blue-400 bg-blue-400/20";
      case "Evasive":
        return "text-green-400 border-green-400 bg-green-400/20";
      case "Coordination":
        return "text-purple-400 border-purple-400 bg-purple-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          FLEET TACTICAL COMMAND
        </h2>
        <div className="flex items-center gap-4">
          {combatActive && (
            <div className="flex items-center gap-2 text-red-400">
              <Activity className="w-5 h-5 animate-pulse" />
              <span>COMBAT ACTIVE: {formatTime(combatTimer)}</span>
            </div>
          )}
          <Button
            variant={combatActive ? "destructive" : "default"}
            className={
              combatActive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
            }
            onClick={() => setCombatActive(!combatActive)}
          >
            {combatActive ? "End Combat" : "Initiate Combat"}
          </Button>
        </div>
      </div>

      {/* Fleet Status Overview */}
      <Card className="bg-trek-panel border-trek-accent p-6">
        <h3 className="text-xl font-bold text-trek-gold mb-4">
          Fleet Status Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-trek-text/70">Coordination</span>
              <span className="text-trek-blue">
                {fleetStatus.coordination_level}%
              </span>
            </div>
            <Progress value={fleetStatus.coordination_level} className="mb-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-trek-text/70">Combat Readiness</span>
              <span className="text-trek-warning">
                {fleetStatus.combat_readiness}%
              </span>
            </div>
            <Progress value={fleetStatus.combat_readiness} className="mb-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-trek-text/70">Morale</span>
              <span className="text-trek-blue">{fleetStatus.morale}%</span>
            </div>
            <Progress value={fleetStatus.morale} className="mb-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-trek-text/70">Communications</span>
              <span className="text-trek-blue">
                {fleetStatus.communication_efficiency}%
              </span>
            </div>
            <Progress
              value={fleetStatus.communication_efficiency}
              className="mb-2"
            />
          </div>
        </div>

        {fleetStatus.active_maneuvers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-trek-accent">
            <h4 className="font-semibold text-trek-gold mb-2">
              Active Maneuvers
            </h4>
            <div className="flex flex-wrap gap-2">
              {fleetStatus.active_maneuvers.map((maneuverId) => {
                const maneuver = tacticalManeuvers.find(
                  (m) => m.id === maneuverId,
                );
                return (
                  <Badge
                    key={maneuverId}
                    variant="secondary"
                    className={`text-xs ${getManeuverTypeColor(maneuver?.type || "")}`}
                  >
                    <Activity className="w-3 h-3 mr-1" />
                    {maneuver?.name}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === "command" ? "default" : "outline"}
          size="sm"
          className={
            activeTab === "command"
              ? "bg-trek-blue text-trek-dark"
              : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
          }
          onClick={() => setActiveTab("command")}
        >
          <Crown className="w-4 h-4 mr-2" />
          Command
        </Button>
        <Button
          variant={activeTab === "formations" ? "default" : "outline"}
          size="sm"
          className={
            activeTab === "formations"
              ? "bg-trek-blue text-trek-dark"
              : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
          }
          onClick={() => setActiveTab("formations")}
        >
          <Move className="w-4 h-4 mr-2" />
          Formations
        </Button>
        <Button
          variant={activeTab === "maneuvers" ? "default" : "outline"}
          size="sm"
          className={
            activeTab === "maneuvers"
              ? "bg-trek-blue text-trek-dark"
              : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
          }
          onClick={() => setActiveTab("maneuvers")}
        >
          <Navigation className="w-4 h-4 mr-2" />
          Maneuvers
        </Button>
        <Button
          variant={activeTab === "combat" ? "default" : "outline"}
          size="sm"
          className={
            activeTab === "combat"
              ? "bg-trek-blue text-trek-dark"
              : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
          }
          onClick={() => setActiveTab("combat")}
        >
          <Target className="w-4 h-4 mr-2" />
          Combat
        </Button>
      </div>

      {activeTab === "command" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enemy Contacts */}
          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-4">
              Enemy Fleet Contacts
            </h3>
            <div className="space-y-3">
              {enemyFleets.map((enemy) => (
                <div
                  key={enemy.id}
                  className="p-3 border border-trek-accent rounded"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-trek-gold">{enemy.name}</h4>
                      <p className="text-sm text-trek-blue">
                        {enemy.composition}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getThreatColor(enemy.threat_assessment)}`}
                    >
                      {enemy.threat_assessment} Threat
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Strength:</span>
                      <span className="text-trek-warning">
                        {enemy.estimated_strength}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Distance:</span>
                      <span className="text-trek-blue">
                        {enemy.distance.toLocaleString()} km
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Formation:</span>
                      <span className="text-trek-blue">{enemy.formation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Intent:</span>
                      <span
                        className={
                          enemy.intent === "Aggressive"
                            ? "text-red-400"
                            : "text-trek-blue"
                        }
                      >
                        {enemy.intent}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                    >
                      <Crosshair className="w-4 h-4 mr-2" />
                      Target
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                    >
                      <Radio className="w-4 h-4 mr-2" />
                      Hail
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Current Formation Display */}
          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-4">
              Current Formation
            </h3>
            <div className="text-center mb-4">
              <h4 className="text-lg font-semibold text-trek-blue">
                {formations.find((f) => f.id === selectedFormation)?.name}
              </h4>
            </div>

            {/* Formation Grid */}
            <div className="bg-trek-dark/50 p-4 rounded border border-trek-accent mb-4">
              {formations
                .find((f) => f.id === selectedFormation)
                ?.formation_pattern.map((row, i) => (
                  <div key={i} className="flex justify-center gap-2 mb-2">
                    {row.map((cell, j) => (
                      <div
                        key={j}
                        className="w-8 h-8 flex items-center justify-center text-lg"
                      >
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-trek-text/70">Offensive Rating:</span>
                <span className="text-red-400">
                  {
                    formations.find((f) => f.id === selectedFormation)
                      ?.effectiveness.offense
                  }
                  /10
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-trek-text/70">Defensive Rating:</span>
                <span className="text-blue-400">
                  {
                    formations.find((f) => f.id === selectedFormation)
                      ?.effectiveness.defense
                  }
                  /10
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-trek-text/70">Maneuverability:</span>
                <span className="text-green-400">
                  {
                    formations.find((f) => f.id === selectedFormation)
                      ?.effectiveness.maneuverability
                  }
                  /10
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-trek-text/70">Coordination:</span>
                <span className="text-purple-400">
                  {
                    formations.find((f) => f.id === selectedFormation)
                      ?.effectiveness.coordination
                  }
                  /10
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "formations" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formations.map((formation) => (
            <Card
              key={formation.id}
              className={`bg-trek-panel border-trek-accent p-4 cursor-pointer transition-colors hover:border-trek-blue ${
                selectedFormation === formation.id
                  ? "border-trek-blue bg-trek-blue/5"
                  : ""
              }`}
              onClick={() => changeFormation(formation.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-trek-gold">{formation.name}</h4>
                {selectedFormation === formation.id && (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
              </div>

              <p className="text-sm text-trek-text/80 mb-3">
                {formation.description}
              </p>

              {/* Mini Formation Display */}
              <div className="bg-trek-dark/30 p-2 rounded mb-3">
                {formation.formation_pattern.map((row, i) => (
                  <div key={i} className="flex justify-center gap-1 mb-1">
                    {row.map((cell, j) => (
                      <div
                        key={j}
                        className="w-4 h-4 flex items-center justify-center text-xs"
                      >
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-trek-text/70">Offense:</span>
                  <span className="text-red-400">
                    {formation.effectiveness.offense}/10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-trek-text/70">Defense:</span>
                  <span className="text-blue-400">
                    {formation.effectiveness.defense}/10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-trek-text/70">Speed:</span>
                  <span className="text-green-400">
                    {formation.effectiveness.maneuverability}/10
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-trek-text/70">Coord:</span>
                  <span className="text-purple-400">
                    {formation.effectiveness.coordination}/10
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "maneuvers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tacticalManeuvers.map((maneuver) => (
            <Card
              key={maneuver.id}
              className="bg-trek-panel border-trek-accent p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-trek-gold">{maneuver.name}</h4>
                  <Badge
                    variant="secondary"
                    className={`text-xs mt-1 ${getManeuverTypeColor(maneuver.type)}`}
                  >
                    {maneuver.type}
                  </Badge>
                </div>
                <div className="text-right text-sm">
                  <div className="text-trek-text/70">Duration</div>
                  <div className="text-trek-blue">
                    {maneuver.duration_minutes}min
                  </div>
                </div>
              </div>

              <p className="text-sm text-trek-text/80 mb-3">
                {maneuver.description}
              </p>

              <div className="space-y-1 text-xs mb-3">
                <div className="flex justify-between">
                  <span className="text-trek-text/70">Damage Bonus:</span>
                  <span
                    className={
                      maneuver.effects.damage_bonus >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {maneuver.effects.damage_bonus > 0 ? "+" : ""}
                    {maneuver.effects.damage_bonus}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-trek-text/70">Defense Bonus:</span>
                  <span
                    className={
                      maneuver.effects.defense_bonus >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {maneuver.effects.defense_bonus > 0 ? "+" : ""}
                    {maneuver.effects.defense_bonus}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-trek-text/70">Speed Modifier:</span>
                  <span
                    className={
                      maneuver.effects.speed_modifier >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {maneuver.effects.speed_modifier > 0 ? "+" : ""}
                    {(maneuver.effects.speed_modifier * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                className="w-full bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                disabled={
                  activeManeuvers.includes(maneuver.id) ||
                  fleetStatus.coordination_level <
                    maneuver.coordination_required
                }
                onClick={() => executeManeuver(maneuver.id)}
              >
                {activeManeuvers.includes(maneuver.id)
                  ? "Active"
                  : "Execute Maneuver"}
              </Button>

              {fleetStatus.coordination_level <
                maneuver.coordination_required && (
                <div className="text-xs text-red-400 mt-1">
                  Requires {maneuver.coordination_required}% coordination
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {activeTab === "combat" && (
        <div className="space-y-4">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-4">
              Combat Report Stream
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {combatReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-2 border border-trek-accent rounded"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-trek-text/70">
                      {report.timestamp}
                    </div>
                    <div className="text-sm">{report.action}</div>
                    <div className="text-xs text-trek-blue">
                      {report.ship_involved}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs">
                      <span className="text-green-400">
                        +{report.damage_dealt}
                      </span>
                      <span className="text-red-400 ml-2">
                        -{report.damage_received}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        report.status === "Success"
                          ? "bg-green-400/20 text-green-400 border-green-400"
                          : report.status === "Partial"
                            ? "bg-yellow-400/20 text-yellow-400 border-yellow-400"
                            : "bg-red-400/20 text-red-400 border-red-400"
                      }`}
                    >
                      {report.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
