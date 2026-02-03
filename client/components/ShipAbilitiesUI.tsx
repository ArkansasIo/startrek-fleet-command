import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Zap,
  Shield,
  Rocket,
  Flame,
  Wind,
  Target,
  AlertTriangle,
  Clock,
  Cpu,
  Battery,
  Lock,
  Unlock,
} from "lucide-react";

type AbilityCategory = "offensive" | "defensive" | "tactical" | "utility" | "special";
type AbilityStatus = "ready" | "cooldown" | "charging" | "locked";

interface ShipAbility {
  id: string;
  name: string;
  description: string;
  category: AbilityCategory;
  ship_class: string;
  energy_cost: number;
  cooldown_seconds: number;
  status: AbilityStatus;
  current_cooldown: number;
  effectiveness: number;
  unlock_level: number;
  synergies: string[];
  requirements: {
    ship_systems: string[];
    power_threshold: number;
    crew_level: number;
  };
  effects: {
    type: string;
    value: number;
    duration: number;
  }[];
}

interface ActiveAbility {
  id: string;
  ability_id: string;
  ability_name: string;
  ship_id: string;
  ship_name: string;
  activation_time: Date;
  duration_seconds: number;
  power_consumed: number;
  effectiveness_modifier: number;
  target?: string;
  status: "active" | "expiring" | "expired";
}

interface Synergy {
  id: string;
  name: string;
  abilities: string[];
  bonus_description: string;
  bonus_multiplier: number;
  tier: "common" | "rare" | "epic" | "legendary";
}

export function ShipAbilitiesUI() {
  const [shipAbilities, setShipAbilities] = useState<ShipAbility[]>([
    {
      id: "ability_001",
      name: "Warp Burst",
      description: "Emergency warp acceleration for rapid escape or pursuit",
      category: "tactical",
      ship_class: "Defiant-class",
      energy_cost: 2500,
      cooldown_seconds: 180,
      status: "ready",
      current_cooldown: 0,
      effectiveness: 85,
      unlock_level: 1,
      synergies: ["Evasive Maneuvers", "Tactical Mode"],
      requirements: {
        ship_systems: ["Warp Core", "Engines"],
        power_threshold: 2500,
        crew_level: 5,
      },
      effects: [
        { type: "speed_boost", value: 150, duration: 8 },
        { type: "engine_damage", value: -10, duration: 8 },
      ],
    },
    {
      id: "ability_002",
      name: "Phasing Cloak",
      description: "Advanced cloaking technology allowing phased dimensional shift",
      category: "defensive",
      ship_class: "Romulan-class",
      energy_cost: 3000,
      cooldown_seconds: 240,
      status: "ready",
      current_cooldown: 0,
      effectiveness: 92,
      unlock_level: 15,
      synergies: ["Passive Sensors", "Silent Running"],
      requirements: {
        ship_systems: ["Cloak System", "Isolinear Processors"],
        power_threshold: 3000,
        crew_level: 18,
      },
      effects: [
        { type: "invisibility", value: 100, duration: 30 },
        { type: "sensor_blind", value: 100, duration: 30 },
      ],
    },
    {
      id: "ability_003",
      name: "Saucer Separation",
      description: "Galaxy-class tactical ability - separate saucer from engineering section",
      category: "special",
      ship_class: "Galaxy-class",
      energy_cost: 1500,
      cooldown_seconds: 300,
      status: "locked",
      current_cooldown: 0,
      effectiveness: 88,
      unlock_level: 20,
      synergies: ["Tactical Superiority", "Damage Control"],
      requirements: {
        ship_systems: ["Structural Integrity", "Separation System"],
        power_threshold: 1500,
        crew_level: 20,
      },
      effects: [
        { type: "create_secondary_vessel", value: 1, duration: 0 },
        { type: "increase_mobility", value: 80, duration: 3600 },
      ],
    },
    {
      id: "ability_004",
      name: "Multi-Vector Assault Mode",
      description: "Prometheus-class exclusive: Divide into three combat sections",
      category: "offensive",
      ship_class: "Prometheus-class",
      energy_cost: 3500,
      cooldown_seconds: 360,
      status: "locked",
      current_cooldown: 0,
      effectiveness: 95,
      unlock_level: 25,
      synergies: ["Tactical Targeting", "Weapon Amplification"],
      requirements: {
        ship_systems: ["Advanced Weapons", "Structural Modulation"],
        power_threshold: 3500,
        crew_level: 25,
      },
      effects: [
        { type: "triplicates_firepower", value: 300, duration: 45 },
        { type: "defensive_vulnerability", value: 30, duration: 45 },
      ],
    },
    {
      id: "ability_005",
      name: "Temporal Shear",
      description: "Experimental temporal distortion weapon",
      category: "offensive",
      ship_class: "Advanced",
      energy_cost: 4000,
      cooldown_seconds: 480,
      status: "locked",
      current_cooldown: 0,
      effectiveness: 98,
      unlock_level: 30,
      synergies: ["Chroniton Weapons", "Phase Transition"],
      requirements: {
        ship_systems: ["Temporal Imaging", "Exotic Weapons"],
        power_threshold: 4000,
        crew_level: 30,
      },
      effects: [
        { type: "disable_target", value: 100, duration: 15 },
        { type: "temporal_damage", value: 5000, duration: 0 },
      ],
    },
    {
      id: "ability_006",
      name: "Ablative Armor Regeneration",
      description: "Regenerate hull plating at accelerated rate",
      category: "defensive",
      ship_class: "Advanced Combat Vessel",
      energy_cost: 2000,
      cooldown_seconds: 120,
      status: "ready",
      current_cooldown: 0,
      effectiveness: 80,
      unlock_level: 12,
      synergies: ["Shield Harmonics", "Structural Repair"],
      requirements: {
        ship_systems: ["Ablative Plating", "Repair Systems"],
        power_threshold: 2000,
        crew_level: 12,
      },
      effects: [
        { type: "hull_regeneration", value: 30, duration: 20 },
        { type: "shield_reinforcement", value: 40, duration: 20 },
      ],
    },
  ]);

  const [activeAbilities, setActiveAbilities] = useState<ActiveAbility[]>([
    {
      id: "active_001",
      ability_id: "ability_001",
      ability_name: "Warp Burst",
      ship_id: "ship_001",
      ship_name: "USS Enterprise-D",
      activation_time: new Date(Date.now() - 5 * 1000),
      duration_seconds: 8,
      power_consumed: 2500,
      effectiveness_modifier: 1.0,
      target: "Evasion",
      status: "active",
    },
  ]);

  const [synergies, setSynergies] = useState<Synergy[]>([
    {
      id: "syn_001",
      name: "Tactical Superiority",
      abilities: ["Warp Burst", "Evasive Maneuvers"],
      bonus_description: "Increase evasion by 25%",
      bonus_multiplier: 1.25,
      tier: "common",
    },
    {
      id: "syn_002",
      name: "Combat Dominance",
      abilities: ["Multi-Vector Assault Mode", "Weapon Amplification", "Tactical Targeting"],
      bonus_description: "Increase all weapon damage by 40%",
      bonus_multiplier: 1.4,
      tier: "epic",
    },
    {
      id: "syn_003",
      name: "Temporal Mastery",
      abilities: ["Temporal Shear", "Chroniton Weapons", "Phase Transition"],
      bonus_description: "Double temporal ability effectiveness",
      bonus_multiplier: 2.0,
      tier: "legendary",
    },
  ]);

  const [selectedAbilityId, setSelectedAbilityId] = useState<string | null>("ability_001");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedShip, setSelectedShip] = useState("USS Enterprise-D");

  const selectedAbility = useMemo(() => {
    return shipAbilities.find((a) => a.id === selectedAbilityId);
  }, [shipAbilities, selectedAbilityId]);

  const filteredAbilities = useMemo(() => {
    return shipAbilities.filter((a) => {
      if (filterCategory !== "all" && a.category !== filterCategory) return false;
      return true;
    });
  }, [shipAbilities, filterCategory]);

  const stats = useMemo(() => {
    const readyAbilities = shipAbilities.filter((a) => a.status === "ready").length;
    const lockedAbilities = shipAbilities.filter((a) => a.status === "locked").length;
    const totalEnergyCapacity = 5000;
    const energyUsed = activeAbilities.reduce((sum, a) => sum + a.power_consumed, 0);

    return {
      readyAbilities,
      lockedAbilities,
      totalEnergyCapacity,
      energyUsed,
      energyPercent: (energyUsed / totalEnergyCapacity) * 100,
    };
  }, [shipAbilities, activeAbilities]);

  const getCategoryIcon = (category: AbilityCategory) => {
    const icons: Record<AbilityCategory, any> = {
      offensive: <Rocket className="h-5 w-5" />,
      defensive: <Shield className="h-5 w-5" />,
      tactical: <Target className="h-5 w-5" />,
      utility: <Cpu className="h-5 w-5" />,
      special: <Zap className="h-5 w-5" />,
    };
    return icons[category] || <Zap className="h-5 w-5" />;
  };

  const getCategoryColor = (category: AbilityCategory) => {
    switch (category) {
      case "offensive":
        return "bg-red-500";
      case "defensive":
        return "bg-blue-500";
      case "tactical":
        return "bg-yellow-500";
      case "utility":
        return "bg-cyan-500";
      case "special":
        return "bg-purple-500";
    }
  };

  const getStatusColor = (status: AbilityStatus) => {
    switch (status) {
      case "ready":
        return "bg-green-500 text-white";
      case "cooldown":
        return "bg-orange-500 text-white";
      case "charging":
        return "bg-blue-500 text-white";
      case "locked":
        return "bg-gray-600 text-white";
    }
  };

  const handleActivateAbility = (ability: ShipAbility) => {
    if (ability.status !== "ready") return;

    const newActive: ActiveAbility = {
      id: `active_${Date.now()}`,
      ability_id: ability.id,
      ability_name: ability.name,
      ship_id: "ship_001",
      ship_name: selectedShip,
      activation_time: new Date(),
      duration_seconds: ability.effects[0]?.duration || 10,
      power_consumed: ability.energy_cost,
      effectiveness_modifier: 1.0,
      status: "active",
    };

    setActiveAbilities((prev) => [newActive, ...prev]);

    // Start cooldown
    const updatedAbilities = shipAbilities.map((a) =>
      a.id === ability.id
        ? {
            ...a,
            status: "cooldown" as AbilityStatus,
            current_cooldown: a.cooldown_seconds,
          }
        : a
    );
    setShipAbilities(updatedAbilities);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ship Abilities & Special Powers</h1>
          <p className="text-muted-foreground mt-1">
            Manage ship-specific tactical and special abilities
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Ready Abilities</p>
            <p className="text-2xl font-bold text-green-500">{stats.readyAbilities}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Locked Abilities</p>
            <p className="text-2xl font-bold text-gray-500">{stats.lockedAbilities}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Energy Usage</p>
            <p className="text-2xl font-bold text-yellow-500">{stats.energyUsed} / 5000</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Active Abilities</p>
            <p className="text-2xl font-bold text-cyan-500">{activeAbilities.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="abilities" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="abilities">Abilities</TabsTrigger>
          <TabsTrigger value="active">Active Effects</TabsTrigger>
          <TabsTrigger value="synergies">Synergies</TabsTrigger>
        </TabsList>

        <TabsContent value="abilities" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <select
              className="border rounded px-3 py-2"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="offensive">Offensive</option>
              <option value="defensive">Defensive</option>
              <option value="tactical">Tactical</option>
              <option value="utility">Utility</option>
              <option value="special">Special</option>
            </select>

            <select
              className="border rounded px-3 py-2"
              value={selectedShip}
              onChange={(e) => setSelectedShip(e.target.value)}
            >
              <option value="USS Enterprise-D">USS Enterprise-D</option>
              <option value="USS Defiant">USS Defiant</option>
              <option value="USS Prometheus">USS Prometheus</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ScrollArea className="lg:col-span-2 h-[600px]">
              <div className="space-y-3 pr-4">
                {filteredAbilities.map((ability) => (
                  <Card
                    key={ability.id}
                    className={`cursor-pointer ${selectedAbilityId === ability.id ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setSelectedAbilityId(ability.id)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded ${getCategoryColor(ability.category)}`}>
                            {getCategoryIcon(ability.category)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{ability.name}</h3>
                            <p className="text-sm text-muted-foreground">{ability.ship_class}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(ability.status)}>
                          {ability.status === "ready" && "READY"}
                          {ability.status === "cooldown" && "COOLDOWN"}
                          {ability.status === "locked" && <Lock className="h-4 w-4" />}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Energy</p>
                          <p className="font-semibold">{ability.energy_cost}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Cooldown</p>
                          <p className="font-semibold">{ability.cooldown_seconds}s</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Effectiveness</p>
                          <p className="font-semibold">{ability.effectiveness}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            {selectedAbility && (
              <Card className="border-2 border-primary lg:col-span-1">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{selectedAbility.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedAbility.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded ${getCategoryColor(selectedAbility.category)}`}>
                        {getCategoryIcon(selectedAbility.category)}
                      </div>
                      <Badge>{selectedAbility.category.toUpperCase()}</Badge>
                    </div>

                    <div className="bg-muted p-3 rounded space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Energy Cost:</span>
                        <span className="font-semibold">{selectedAbility.energy_cost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cooldown:</span>
                        <span className="font-semibold">{selectedAbility.cooldown_seconds}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Effectiveness:</span>
                        <span className="font-semibold">{selectedAbility.effectiveness}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unlock Level:</span>
                        <span className="font-semibold">{selectedAbility.unlock_level}</span>
                      </div>
                    </div>

                    {selectedAbility.synergies.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          SYNERGIES
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {selectedAbility.synergies.map((syn) => (
                            <Badge key={syn} variant="outline" className="text-xs">
                              {syn}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedAbility.status === "ready" ? (
                      <Button
                        className="w-full"
                        onClick={() => handleActivateAbility(selectedAbility)}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Activate Ability
                      </Button>
                    ) : selectedAbility.status === "locked" ? (
                      <Button className="w-full" disabled>
                        <Lock className="h-4 w-4 mr-2" />
                        Locked (Lvl {selectedAbility.unlock_level})
                      </Button>
                    ) : (
                      <Button className="w-full" disabled>
                        <Clock className="h-4 w-4 mr-2" />
                        On Cooldown
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="active">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3 pr-4">
              {activeAbilities.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active abilities running.</p>
                  </CardContent>
                </Card>
              ) : (
                activeAbilities.map((active) => (
                  <Card key={active.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{active.ability_name}</h3>
                          <p className="text-sm text-muted-foreground">{active.ship_name}</p>
                        </div>
                        <Badge className="bg-green-500 text-white">ACTIVE</Badge>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-xs">
                          <span>Duration Remaining</span>
                          <span>~{active.duration_seconds}s</span>
                        </div>
                        <Progress value={75} />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-muted p-2 rounded">
                          <p className="text-muted-foreground">Power Used</p>
                          <p className="font-semibold">{active.power_consumed}</p>
                        </div>
                        <div className="bg-muted p-2 rounded">
                          <p className="text-muted-foreground">Effectiveness</p>
                          <p className="font-semibold">
                            {Math.round(active.effectiveness_modifier * 100)}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="synergies">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3 pr-4">
              {synergies.map((synergy) => (
                <Card key={synergy.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{synergy.name}</h3>
                      <Badge
                        className={`${
                          synergy.tier === "common"
                            ? "bg-gray-500"
                            : synergy.tier === "rare"
                              ? "bg-blue-500"
                              : synergy.tier === "epic"
                                ? "bg-purple-500"
                                : "bg-yellow-600"
                        } text-white`}
                      >
                        {synergy.tier.toUpperCase()}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {synergy.bonus_description}
                    </p>

                    <div className="mb-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        REQUIRED ABILITIES
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {synergy.abilities.map((ability) => (
                          <Badge key={ability} variant="outline" className="text-xs">
                            {ability}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-muted p-2 rounded text-xs">
                      <p className="text-muted-foreground">Bonus Multiplier</p>
                      <p className="font-semibold">{synergy.bonus_multiplier}x</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
