import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Ship, 
  Fuel, 
  Users, 
  Zap, 
  Shield, 
  AlertTriangle,
  TrendingUp,
  Package,
  MapPin,
  Clock,
  DollarSign,
  AlertCircle
} from "lucide-react";

interface FleetShip {
  id: string;
  name: string;
  class: string;
  hull: number;
  maxHull: number;
  status: "operational" | "damaged" | "repairing" | "docked";
  crew: number;
  maxCrew: number;
  location: string;
  fuel: number;
  maxFuel: number;
  shields: number;
  maxShields: number;
  weapons: number;
  sensors: number;
  power: number;
}

interface FleetResource {
  type: "credits" | "fuel" | "minerals" | "tech_points" | "research_hours";
  amount: number;
  capacity: number;
  production: number;
  consumption: number;
}

interface LogisticsOperation {
  id: string;
  type: "resupply" | "reinforcement" | "repair" | "relocation";
  status: "pending" | "in_transit" | "completed";
  source: string;
  destination: string;
  items: string[];
  eta: number; // in hours
  cost: number;
}

interface FleetStats {
  totalShips: number;
  totalCrew: number;
  totalPower: number;
  readiness: number;
  morale: number;
  efficiency: number;
}

export function FleetManagementUI() {
  const [fleetShips, setFleetShips] = useState<FleetShip[]>([
    {
      id: "flagship_1",
      name: "USS Enterprise-D",
      class: "Galaxy-class",
      hull: 85,
      maxHull: 100,
      status: "operational",
      crew: 1012,
      maxCrew: 1014,
      location: "Starbase One",
      fuel: 95,
      maxFuel: 100,
      shields: 100,
      maxShields: 100,
      weapons: 8,
      sensors: 9,
      power: 98,
    },
    {
      id: "cruiser_1",
      name: "USS Excelsior",
      class: "Excelsior-class",
      hull: 70,
      maxHull: 100,
      status: "damaged",
      crew: 856,
      maxCrew: 875,
      location: "Starbase Two",
      fuel: 65,
      maxFuel: 100,
      shields: 65,
      maxShields: 100,
      weapons: 7,
      sensors: 8,
      power: 75,
    },
    {
      id: "scout_1",
      name: "USS Copernicus",
      class: "Sabre-class",
      hull: 95,
      maxHull: 100,
      status: "operational",
      crew: 235,
      maxCrew: 250,
      location: "Sector 001",
      fuel: 80,
      maxFuel: 100,
      shields: 90,
      maxShields: 100,
      weapons: 4,
      sensors: 10,
      power: 92,
    },
  ]);

  const [resources, setResources] = useState<FleetResource[]>([
    { type: "credits", amount: 125000, capacity: 500000, production: 2500, consumption: 1200 },
    { type: "fuel", amount: 8500, capacity: 15000, production: 500, consumption: 300 },
    { type: "minerals", amount: 2300, capacity: 10000, production: 200, consumption: 150 },
    { type: "tech_points", amount: 450, capacity: 1000, production: 50, consumption: 30 },
    { type: "research_hours", amount: 850, capacity: 5000, production: 100, consumption: 80 },
  ]);

  const [operations, setOperations] = useState<LogisticsOperation[]>([
    {
      id: "op_1",
      type: "resupply",
      status: "in_transit",
      source: "Starbase One",
      destination: "Sector 001",
      items: ["Fuel", "Medical Supplies"],
      eta: 12,
      cost: 5000,
    },
    {
      id: "op_2",
      type: "repair",
      status: "pending",
      source: "Starbase Two",
      destination: "Starbase One",
      items: ["Hull Plating", "Power Systems"],
      eta: 24,
      cost: 15000,
    },
  ]);

  const fleetStats = useMemo((): FleetStats => {
    const totalShips = fleetShips.length;
    const totalCrew = fleetShips.reduce((sum, ship) => sum + ship.crew, 0);
    const totalPower = Math.floor(fleetShips.reduce((sum, ship) => sum + ship.power, 0) / totalShips);
    const readiness = Math.floor(
      (fleetShips.filter(s => s.status === "operational").length / totalShips) * 100
    );
    const avgShieldHealth = Math.floor(
      fleetShips.reduce((sum, ship) => sum + (ship.shields / ship.maxShields) * 100, 0) / totalShips
    );
    const avgHullHealth = Math.floor(
      fleetShips.reduce((sum, ship) => sum + (ship.hull / ship.maxHull) * 100, 0) / totalShips
    );

    return {
      totalShips,
      totalCrew,
      totalPower,
      readiness,
      morale: Math.floor((totalCrew / 2500) * 100), // Morale based on crew-to-capacity ratio
      efficiency: Math.floor((avgHullHealth + avgShieldHealth) / 2),
    };
  }, [fleetShips]);

  const netResources = useMemo(() => {
    return resources.map(r => ({
      ...r,
      net: r.production - r.consumption,
    }));
  }, [resources]);

  const handleRepairShip = (shipId: string) => {
    setFleetShips(ships =>
      ships.map(ship =>
        ship.id === shipId
          ? { ...ship, hull: Math.min(ship.hull + 10, ship.maxHull), status: "repairing" as const }
          : ship
      )
    );
  };

  const handleRefuelShip = (shipId: string) => {
    setFleetShips(ships =>
      ships.map(ship =>
        ship.id === shipId
          ? { ...ship, fuel: ship.maxFuel }
          : ship
      )
    );
  };

  const handleTransferCrew = (shipId: string, amount: number) => {
    setFleetShips(ships => {
      const updatedShips = [...ships];
      const shipIndex = updatedShips.findIndex(s => s.id === shipId);
      if (shipIndex !== -1) {
        updatedShips[shipIndex] = {
          ...updatedShips[shipIndex],
          crew: Math.min(updatedShips[shipIndex].crew + amount, updatedShips[shipIndex].maxCrew),
        };
      }
      return updatedShips;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "damaged":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "repairing":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "docked":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Ship className="w-8 h-8 text-blue-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">Fleet Management Command</h1>
          <p className="text-gray-400">Manage ships, resources, and logistics operations</p>
        </div>
      </div>

      {/* Fleet Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-gray-900/50 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-400 mb-2">Total Ships</div>
            <div className="text-3xl font-bold text-blue-300">{fleetStats.totalShips}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-green-500/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-400 mb-2">Total Crew</div>
            <div className="text-3xl font-bold text-green-300">{fleetStats.totalCrew.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-yellow-500/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-400 mb-2">Fleet Readiness</div>
            <div className="text-3xl font-bold text-yellow-300">{fleetStats.readiness}%</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-purple-500/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-400 mb-2">Avg Power Output</div>
            <div className="text-3xl font-bold text-purple-300">{fleetStats.totalPower}%</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-orange-500/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-400 mb-2">Fleet Morale</div>
            <div className="text-3xl font-bold text-orange-300">{fleetStats.morale}%</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-cyan-500/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-400 mb-2">System Efficiency</div>
            <div className="text-3xl font-bold text-cyan-300">{fleetStats.efficiency}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="fleet" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="fleet" className="flex items-center gap-2">
            <Ship className="w-4 h-4" />
            Fleet Ships
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="logistics" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Logistics
          </TabsTrigger>
        </TabsList>

        {/* Fleet Ships Tab */}
        <TabsContent value="fleet" className="space-y-4">
          <ScrollArea className="h-[600px] rounded-lg border border-gray-700 p-4">
            <div className="space-y-4 pr-4">
              {fleetShips.map(ship => (
                <Card key={ship.id} className="bg-gray-900/50 border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-blue-300">{ship.name}</CardTitle>
                        <CardDescription className="text-gray-400">{ship.class}</CardDescription>
                      </div>
                      <Badge className={`${getStatusColor(ship.status)}`}>
                        {ship.status.charAt(0).toUpperCase() + ship.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">Location:</span>
                      <span className="text-blue-300">{ship.location}</span>
                    </div>

                    {/* Hull Health */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Hull Integrity</span>
                        <span className="text-blue-300">
                          {ship.hull}/{ship.maxHull}
                        </span>
                      </div>
                      <Progress value={(ship.hull / ship.maxHull) * 100} className="h-2" />
                    </div>

                    {/* Shields */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Shields</span>
                        <span className="text-cyan-300">
                          {ship.shields}/{ship.maxShields}
                        </span>
                      </div>
                      <Progress value={(ship.shields / ship.maxShields) * 100} className="h-2" />
                    </div>

                    {/* Crew */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Crew</span>
                        <span className="text-green-300">
                          {ship.crew}/{ship.maxCrew}
                        </span>
                      </div>
                      <Progress value={(ship.crew / ship.maxCrew) * 100} className="h-2" />
                    </div>

                    {/* Fuel */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Fuel</span>
                        <span className="text-yellow-300">
                          {ship.fuel}/{ship.maxFuel}
                        </span>
                      </div>
                      <Progress value={(ship.fuel / ship.maxFuel) * 100} className="h-2" />
                    </div>

                    {/* Systems Status */}
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-700">
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Power</div>
                        <div className="text-sm font-bold text-purple-300">{ship.power}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Weapons</div>
                        <div className="text-sm font-bold text-red-300">{ship.weapons}/10</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Sensors</div>
                        <div className="text-sm font-bold text-blue-300">{ship.sensors}/10</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-gray-700">
                      <Button
                        onClick={() => handleRepairShip(ship.id)}
                        disabled={ship.status === "operational"}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Repair
                      </Button>
                      <Button
                        onClick={() => handleRefuelShip(ship.id)}
                        disabled={ship.fuel === ship.maxFuel}
                        size="sm"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        Refuel
                      </Button>
                      <Button
                        onClick={() => handleTransferCrew(ship.id, 10)}
                        disabled={ship.crew === ship.maxCrew}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Add Crew
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {netResources.map(resource => (
              <Card key={resource.type} className="bg-gray-900/50 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-blue-300 capitalize">
                      {resource.type.replace("_", " ")}
                    </CardTitle>
                    <Badge className={resource.net > 0 ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}>
                      {resource.net > 0 ? "+" : ""}{resource.net}/hour
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Storage Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Storage</span>
                      <span className="text-blue-300">
                        {resource.amount}/{resource.capacity}
                      </span>
                    </div>
                    <Progress value={(resource.amount / resource.capacity) * 100} className="h-2" />
                  </div>

                  {/* Production/Consumption */}
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-700">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Production</div>
                      <div className="text-lg font-bold text-green-300">+{resource.production}</div>
                      <div className="text-xs text-gray-500">/hour</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Consumption</div>
                      <div className="text-lg font-bold text-red-300">-{resource.consumption}</div>
                      <div className="text-xs text-gray-500">/hour</div>
                    </div>
                  </div>

                  {/* Low Stock Warning */}
                  {(resource.amount / resource.capacity) < 0.2 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-300" />
                      <span className="text-xs text-yellow-300">Low stock warning</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Logistics Tab */}
        <TabsContent value="logistics" className="space-y-4">
          <ScrollArea className="h-[500px] rounded-lg border border-gray-700 p-4">
            <div className="space-y-4 pr-4">
              {operations.map(op => (
                <Card key={op.id} className="bg-gray-900/50 border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg capitalize text-blue-300">
                          {op.type}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          {op.source} → {op.destination}
                        </CardDescription>
                      </div>
                      <Badge
                        className={
                          op.status === "in_transit"
                            ? "bg-blue-500/20 text-blue-300"
                            : op.status === "completed"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-yellow-500/20 text-yellow-300"
                        }
                      >
                        {op.status.replace("_", " ").charAt(0).toUpperCase() + op.status.replace("_", " ").slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Items */}
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Items</div>
                      <div className="flex flex-wrap gap-2">
                        {op.items.map(item => (
                          <Badge key={item} className="bg-blue-500/20 text-blue-300">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* ETA and Cost */}
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-700">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-xs text-gray-500">ETA</div>
                          <div className="text-sm font-bold text-blue-300">{op.eta} hours</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-xs text-gray-500">Cost</div>
                          <div className="text-sm font-bold text-yellow-300">{op.cost.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    {op.status === "in_transit" && (
                      <div>
                        <Progress value={60} className="h-2" />
                        <div className="text-xs text-gray-400 mt-1">60% complete</div>
                      </div>
                    )}

                    {/* Cancel Button */}
                    {op.status !== "completed" && (
                      <Button size="sm" variant="outline" className="w-full mt-2">
                        Cancel Operation
                      </Button>
                    )}
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
