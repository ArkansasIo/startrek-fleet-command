import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Wrench,
  Zap,
  Shield,
  Target,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowUp,
} from "lucide-react";

type ComponentTier = 1 | 2 | 3 | 4 | 5;

interface ShipComponent {
  id: string;
  name: string;
  type: "warp_core" | "shields" | "weapons" | "sensors" | "engines";
  tier: ComponentTier;
  stats: {
    power_output?: number;
    shield_strength?: number;
    weapon_damage?: number;
    sensor_range?: number;
    speed_bonus?: number;
  };
  power_draw: number;
  condition: number;
  upgrade_cost: { credits: number; materials: string[] };
}

interface Ship {
  id: string;
  name: string;
  class: string;
  components: { [key: string]: ShipComponent };
  total_power_capacity: number;
  current_power_usage: number;
  efficiency: number;
}

export function ShipSystemsUI() {
  const [selectedShipId, setSelectedShipId] = useState<string>("ship_001");
  const [playerCredits] = useState<number>(1500000);

  const [ships, setShips] = useState<Ship[]>([
    {
      id: "ship_001",
      name: "USS Enterprise",
      class: "Galaxy-Class",
      components: {
        warp_core: {
          id: "comp_001",
          name: "Type-7 Warp Core",
          type: "warp_core",
          tier: 3,
          stats: { power_output: 800 },
          power_draw: 800,
          condition: 100,
          upgrade_cost: { credits: 250000, materials: ["Dilithium", "Tritanium"] },
        },
        shields: {
          id: "comp_002",
          name: "Type-9 Shields",
          type: "shields",
          tier: 3,
          stats: { shield_strength: 8500 },
          power_draw: 350,
          condition: 95,
          upgrade_cost: { credits: 200000, materials: ["Tritanium"] },
        },
        weapons: {
          id: "comp_003",
          name: "Type-10 Phasers",
          type: "weapons",
          tier: 3,
          stats: { weapon_damage: 450 },
          power_draw: 400,
          condition: 100,
          upgrade_cost: { credits: 180000, materials: ["Plasma"] },
        },
        sensors: {
          id: "comp_004",
          name: "Type-8 Sensors",
          type: "sensors",
          tier: 2,
          stats: { sensor_range: 15 },
          power_draw: 150,
          condition: 88,
          upgrade_cost: { credits: 120000, materials: ["Isolinear Chips"] },
        },
        engines: {
          id: "comp_005",
          name: "Type-6 Engines",
          type: "engines",
          tier: 2,
          stats: { speed_bonus: 25 },
          power_draw: 300,
          condition: 92,
          upgrade_cost: { credits: 140000, materials: ["Dilithium"] },
        },
      },
      total_power_capacity: 2500,
      current_power_usage: 2000,
      efficiency: 80,
    },
    {
      id: "ship_002",
      name: "USS Defiant",
      class: "Defiant-Class",
      components: {
        warp_core: {
          id: "comp_006",
          name: "Type-5 Warp Core",
          type: "warp_core",
          tier: 3,
          stats: { power_output: 650 },
          power_draw: 650,
          condition: 98,
          upgrade_cost: { credits: 220000, materials: ["Dilithium"] },
        },
        shields: {
          id: "comp_007",
          name: "Type-7 Shields",
          type: "shields",
          tier: 3,
          stats: { shield_strength: 6800 },
          power_draw: 280,
          condition: 100,
          upgrade_cost: { credits: 180000, materials: ["Tritanium"] },
        },
        weapons: {
          id: "comp_008",
          name: "Type-9 Pulse Cannons",
          type: "weapons",
          tier: 3,
          stats: { weapon_damage: 520 },
          power_draw: 350,
          condition: 85,
          upgrade_cost: { credits: 200000, materials: ["Plasma", "Dilithium"] },
        },
      },
      total_power_capacity: 1800,
      current_power_usage: 1280,
      efficiency: 71,
    },
  ]);

  const selectedShip = useMemo(() => {
    return ships.find((s) => s.id === selectedShipId);
  }, [ships, selectedShipId]);

  const powerStatus = useMemo(() => {
    if (!selectedShip) return null;
    const percentage = (selectedShip.current_power_usage / selectedShip.total_power_capacity) * 100;
    const status = percentage > 90 ? "critical" : percentage > 70 ? "warning" : "normal";
    return { percentage, status };
  }, [selectedShip]);

  const damageAlerts = useMemo(() => {
    if (!selectedShip) return [];
    return Object.values(selectedShip.components).filter((comp) => comp && comp.condition < 70);
  }, [selectedShip]);

  const availableUpgrades = useMemo(() => {
    if (!selectedShip) return [];
    return Object.values(selectedShip.components)
      .filter((component) => component && component.tier < 5)
      .map((component) => ({
        component_id: component.id,
        current_tier: component.tier,
        next_tier: (component.tier + 1) as ComponentTier,
        cost: component.upgrade_cost,
        time_hours: component.tier * 2,
        stat_boost: `+20%`,
      }));
  }, [selectedShip]);

  const handleRepairComponent = (shipId: string, componentId: string) => {
    setShips((prevShips) =>
      prevShips.map((ship) => {
        if (ship.id !== shipId) return ship;
        return {
          ...ship,
          components: Object.fromEntries(
            Object.entries(ship.components).map(([key, comp]) => [
              key,
              comp && comp.id === componentId ? { ...comp, condition: 100 } : comp,
            ])
          ),
        };
      })
    );
  };

  const handleUpgradeComponent = (shipId: string, componentId: string) => {
    setShips((prevShips) =>
      prevShips.map((ship) => {
        if (ship.id !== shipId) return ship;
        return {
          ...ship,
          components: Object.fromEntries(
            Object.entries(ship.components).map(([key, comp]) => [
              key,
              comp && comp.id === componentId && comp.tier < 5
                ? {
                    ...comp,
                    tier: (comp.tier + 1) as ComponentTier,
                    stats: Object.fromEntries(
                      Object.entries(comp.stats).map(([stat, val]) => [stat, Math.floor((val as number) * 1.2)])
                    ),
                  }
                : comp,
            ])
          ),
        };
      })
    );
  };

  const handleInstallComponent = (shipId: string, newComponent: ShipComponent) => {
    setShips((prevShips) =>
      prevShips.map((ship) => {
        if (ship.id !== shipId) return ship;
        let newPowerUsage = ship.current_power_usage;
        if (ship.components[newComponent.type]) {
          const oldComp = ship.components[newComponent.type];
          if (oldComp) newPowerUsage -= oldComp.power_draw;
        }
        newPowerUsage += newComponent.power_draw;
        return {
          ...ship,
          components: { ...ship.components, [newComponent.type]: newComponent },
          current_power_usage: newPowerUsage,
        };
      })
    );
  };

  const handleRemoveComponent = (shipId: string, componentType: string) => {
    setShips((prevShips) =>
      prevShips.map((ship) => {
        if (ship.id !== shipId) return ship;
        let newPowerUsage = ship.current_power_usage;
        const comp = ship.components[componentType];
        if (comp) newPowerUsage -= comp.power_draw;
        const newComponents = { ...ship.components };
        delete newComponents[componentType];
        return { ...ship, components: newComponents, current_power_usage: newPowerUsage };
      })
    );
  };

  if (!selectedShip || !powerStatus) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No ship selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ship Systems Management</h1>
          <p className="text-muted-foreground mt-1">Manage and upgrade your ship's components</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <DollarSign className="h-4 w-4 mr-1" />
          {playerCredits.toLocaleString()} Credits
        </Badge>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            {ships.map((ship) => (
              <Button
                key={ship.id}
                variant={selectedShipId === ship.id ? "default" : "outline"}
                onClick={() => setSelectedShipId(ship.id)}
              >
                <Wrench className="h-4 w-4 mr-2" />
                {ship.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Power Status</p>
            <p className="text-2xl font-bold">{powerStatus.percentage.toFixed(0)}%</p>
            <Progress value={powerStatus.percentage} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Efficiency</p>
            <p className="text-2xl font-bold">{selectedShip.efficiency}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Components</p>
            <p className="text-2xl font-bold">{Object.keys(selectedShip.components).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Damage Alerts</p>
            <p className={`text-2xl font-bold ${damageAlerts.length > 0 ? "text-red-500" : "text-green-500"}`}>
              {damageAlerts.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="installed" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="installed">Installed Components</TabsTrigger>
          <TabsTrigger value="upgrades">Available Upgrades</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="installed" className="space-y-4">
          <ScrollArea className="h-[400px]">
            <div className="space-y-3 pr-4">
              {Object.entries(selectedShip.components).map(([type, component]) =>
                component ? (
                  <Card key={component.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{component.name}</h3>
                          <p className="text-sm text-muted-foreground">Tier {component.tier}/5</p>
                        </div>
                        <Badge>{component.condition}% Condition</Badge>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {component.condition < 100 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRepairComponent(selectedShip.id, component.id)}
                          >
                            Repair
                          </Button>
                        )}
                        {component.tier < 5 && (
                          <Button
                            size="sm"
                            onClick={() => handleUpgradeComponent(selectedShip.id, component.id)}
                          >
                            Upgrade
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : null
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="upgrades">
          <ScrollArea className="h-[400px]">
            <div className="space-y-3 pr-4">
              {availableUpgrades.length === 0 ? (
                <p className="text-muted-foreground">All components are at maximum tier</p>
              ) : (
                availableUpgrades.map((upgrade) => (
                  <Card key={upgrade.component_id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">
                            Tier {upgrade.current_tier} → Tier {upgrade.next_tier}
                          </p>
                          <p className="text-sm text-muted-foreground">Stat boost: {upgrade.stat_boost}</p>
                        </div>
                        <Button size="sm">
                          <ArrowUp className="h-4 w-4 mr-1" />
                          Upgrade
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="marketplace">
          <p className="text-muted-foreground">Marketplace coming soon</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
