import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Map,
  Flag,
  Shield,
  Flame,
  Users,
  TrendingUp,
  Target,
  AlertTriangle,
  Lock,
  Star,
  Zap,
  Crown,
} from "lucide-react";

type FactionType = "federation" | "klingon" | "romulan" | "ferengi" | "dominion" | "neutral";
type ControlStatus = "controlled" | "contested" | "disputed" | "unclaimed";

interface Territory {
  id: string;
  name: string;
  region: string;
  faction: FactionType;
  control_status: ControlStatus;
  strategic_value: number;
  population: number;
  resources: { [key: string]: number };
  starbases: number;
  defense_rating: number;
  discovery_date: Date;
  adjacent_territories: string[];
}

interface ConflictZone {
  id: string;
  territory_id: string;
  territory_name: string;
  challenger_faction: FactionType;
  defender_faction: FactionType;
  intensity: number;
  duration_days: number;
  casualties: number;
  status: "active" | "ceasefire" | "resolved";
}

interface GalacticAlliance {
  faction: FactionType;
  territories_controlled: number;
  total_population: number;
  military_strength: number;
  diplomatic_relations: { [key: string]: number };
}

export function GalaxyMapUI() {
  const [territories, setTerritories] = useState<Territory[]>([
    {
      id: "ter_001",
      name: "Alpha Quadrant Prime",
      region: "Core",
      faction: "federation",
      control_status: "controlled",
      strategic_value: 95,
      population: 45000000,
      resources: { Dilithium: 8500, Tritanium: 12000 },
      starbases: 5,
      defense_rating: 85,
      discovery_date: new Date(2320, 0, 1),
      adjacent_territories: ["ter_002", "ter_003"],
    },
    {
      id: "ter_002",
      name: "Klingon Territory Seven",
      region: "Core",
      faction: "klingon",
      control_status: "controlled",
      strategic_value: 88,
      population: 32000000,
      resources: { Dilithium: 6500, Pergium: 5000 },
      starbases: 3,
      defense_rating: 92,
      discovery_date: new Date(2310, 0, 1),
      adjacent_territories: ["ter_001", "ter_005"],
    },
    {
      id: "ter_003",
      name: "Neutral Zone Sector 6",
      region: "Disputed",
      faction: "neutral",
      control_status: "disputed",
      strategic_value: 72,
      population: 18000000,
      resources: { Latinum: 3500, Duranium: 7000 },
      starbases: 2,
      defense_rating: 65,
      discovery_date: new Date(2350, 0, 1),
      adjacent_territories: ["ter_001", "ter_002", "ter_006"],
    },
    {
      id: "ter_004",
      name: "Ferengi Trade Hub",
      region: "Commerce",
      faction: "ferengi",
      control_status: "controlled",
      strategic_value: 78,
      population: 28000000,
      resources: { Latinum: 12000, Duranium: 4000 },
      starbases: 4,
      defense_rating: 55,
      discovery_date: new Date(2340, 0, 1),
      adjacent_territories: ["ter_005"],
    },
    {
      id: "ter_005",
      name: "Romulan Space Eastern",
      region: "Spinward",
      faction: "romulan",
      control_status: "controlled",
      strategic_value: 85,
      population: 38000000,
      resources: { Dilithium: 9500, Tritanium: 11000 },
      starbases: 3,
      defense_rating: 88,
      discovery_date: new Date(2330, 0, 1),
      adjacent_territories: ["ter_002", "ter_004"],
    },
    {
      id: "ter_006",
      name: "Uncharted Expanse Zone",
      region: "Frontier",
      faction: "neutral",
      control_status: "unclaimed",
      strategic_value: 55,
      population: 5000000,
      resources: { Dilithium: 2000, Tritanium: 3000, Pergium: 2500 },
      starbases: 0,
      defense_rating: 20,
      discovery_date: new Date(2365, 0, 1),
      adjacent_territories: ["ter_003"],
    },
    {
      id: "ter_007",
      name: "Dominion War Zone",
      region: "Gamma",
      faction: "dominion",
      control_status: "contested",
      strategic_value: 92,
      population: 22000000,
      resources: { Dilithium: 5000, Tritanium: 4000 },
      starbases: 1,
      defense_rating: 78,
      discovery_date: new Date(2370, 0, 1),
      adjacent_territories: [],
    },
  ]);

  const [conflictZones, setConflictZones] = useState<ConflictZone[]>([
    {
      id: "conflict_001",
      territory_id: "ter_003",
      territory_name: "Neutral Zone Sector 6",
      challenger_faction: "klingon",
      defender_faction: "federation",
      intensity: 65,
      duration_days: 45,
      casualties: 12500,
      status: "active",
    },
    {
      id: "conflict_002",
      territory_id: "ter_007",
      territory_name: "Dominion War Zone",
      challenger_faction: "dominion",
      defender_faction: "federation",
      intensity: 85,
      duration_days: 180,
      casualties: 450000,
      status: "active",
    },
  ]);

  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string | null>("ter_001");
  const [filterFaction, setFilterFaction] = useState<string>("all");

  const selectedTerritory = useMemo(() => {
    return territories.find((t) => t.id === selectedTerritoryId);
  }, [territories, selectedTerritoryId]);

  const filteredTerritories = useMemo(() => {
    return territories.filter((t) => {
      if (filterFaction !== "all" && t.faction !== filterFaction) return false;
      return true;
    });
  }, [territories, filterFaction]);

  const getFactionColor = (faction: FactionType) => {
    const colors: Record<FactionType, string> = {
      federation: "bg-blue-600 text-white",
      klingon: "bg-red-600 text-white",
      romulan: "bg-green-600 text-white",
      ferengi: "bg-yellow-600 text-yellow-900",
      dominion: "bg-purple-600 text-white",
      neutral: "bg-gray-600 text-white",
    };
    return colors[faction] || "bg-gray-600 text-white";
  };

  const getFactionName = (faction: FactionType): string => {
    const names: Record<FactionType, string> = {
      federation: "Federation",
      klingon: "Klingon Empire",
      romulan: "Romulan Star Empire",
      ferengi: "Ferengi Alliance",
      dominion: "Dominion",
      neutral: "Neutral Zone",
    };
    return names[faction] || "Unknown";
  };

  const getControlStatusIcon = (status: ControlStatus) => {
    switch (status) {
      case "controlled":
        return <Shield className="h-4 w-4" />;
      case "contested":
        return <Flame className="h-4 w-4 text-orange-500" />;
      case "disputed":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "unclaimed":
        return <Lock className="h-4 w-4 text-gray-500" />;
    }
  };

  const allianceStats = useMemo(() => {
    const factions: Record<FactionType, GalacticAlliance> = {
      federation: {
        faction: "federation",
        territories_controlled: territories.filter((t) => t.faction === "federation").length,
        total_population: territories
          .filter((t) => t.faction === "federation")
          .reduce((sum, t) => sum + t.population, 0),
        military_strength: 315,
        diplomatic_relations: {
          klingon: 45,
          romulan: 35,
          ferengi: 70,
          dominion: 20,
        },
      },
      klingon: {
        faction: "klingon",
        territories_controlled: territories.filter((t) => t.faction === "klingon").length,
        total_population: territories
          .filter((t) => t.faction === "klingon")
          .reduce((sum, t) => sum + t.population, 0),
        military_strength: 340,
        diplomatic_relations: {
          federation: 45,
          romulan: 60,
          ferengi: 40,
          dominion: 15,
        },
      },
      romulan: {
        faction: "romulan",
        territories_controlled: territories.filter((t) => t.faction === "romulan").length,
        total_population: territories
          .filter((t) => t.faction === "romulan")
          .reduce((sum, t) => sum + t.population, 0),
        military_strength: 320,
        diplomatic_relations: {
          federation: 35,
          klingon: 60,
          ferengi: 50,
          dominion: 25,
        },
      },
      ferengi: {
        faction: "ferengi",
        territories_controlled: territories.filter((t) => t.faction === "ferengi").length,
        total_population: territories
          .filter((t) => t.faction === "ferengi")
          .reduce((sum, t) => sum + t.population, 0),
        military_strength: 180,
        diplomatic_relations: {
          federation: 70,
          klingon: 40,
          romulan: 50,
          dominion: 10,
        },
      },
      dominion: {
        faction: "dominion",
        territories_controlled: territories.filter((t) => t.faction === "dominion").length,
        total_population: territories
          .filter((t) => t.faction === "dominion")
          .reduce((sum, t) => sum + t.population, 0),
        military_strength: 450,
        diplomatic_relations: {
          federation: 20,
          klingon: 15,
          romulan: 25,
          ferengi: 10,
        },
      },
      neutral: {
        faction: "neutral",
        territories_controlled: territories.filter((t) => t.faction === "neutral").length,
        total_population: territories
          .filter((t) => t.faction === "neutral")
          .reduce((sum, t) => sum + t.population, 0),
        military_strength: 0,
        diplomatic_relations: {},
      },
    };

    return factions;
  }, [territories]);

  const stats = useMemo(() => {
    const totalTerritories = territories.length;
    const totalPopulation = territories.reduce((sum, t) => sum + t.population, 0);
    const activeConflicts = conflictZones.filter((c) => c.status === "active").length;
    const totalStrategicValue = territories.reduce((sum, t) => sum + t.strategic_value, 0);

    return {
      totalTerritories,
      totalPopulation,
      activeConflicts,
      totalStrategicValue: Math.round(totalStrategicValue / totalTerritories),
    };
  }, [territories, conflictZones]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Galactic Map & Territories</h1>
          <p className="text-muted-foreground mt-1">
            Monitor faction control and strategic territory information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Territories</p>
            <p className="text-2xl font-bold text-blue-500">{stats.totalTerritories}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Population</p>
            <p className="text-2xl font-bold text-green-500">
              {(stats.totalPopulation / 1000000).toFixed(1)}M
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Active Conflicts</p>
            <p className={`text-2xl font-bold ${stats.activeConflicts > 0 ? "text-red-500" : "text-green-500"}`}>
              {stats.activeConflicts}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Avg Strategic Value</p>
            <p className="text-2xl font-bold text-yellow-500">{stats.totalStrategicValue}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="territories" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="territories">Territory Map</TabsTrigger>
          <TabsTrigger value="alliances">Faction Alliances</TabsTrigger>
          <TabsTrigger value="conflicts">Conflict Zones</TabsTrigger>
        </TabsList>

        <TabsContent value="territories" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <select
              className="border rounded px-3 py-2"
              value={filterFaction}
              onChange={(e) => setFilterFaction(e.target.value)}
            >
              <option value="all">All Factions</option>
              <option value="federation">Federation</option>
              <option value="klingon">Klingon</option>
              <option value="romulan">Romulan</option>
              <option value="ferengi">Ferengi</option>
              <option value="dominion">Dominion</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ScrollArea className="lg:col-span-2 h-[600px]">
              <div className="space-y-3 pr-4">
                {filteredTerritories.map((territory) => (
                  <Card
                    key={territory.id}
                    className={`cursor-pointer ${selectedTerritoryId === territory.id ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setSelectedTerritoryId(territory.id)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{territory.name}</h3>
                          <p className="text-sm text-muted-foreground">{territory.region}</p>
                        </div>
                        <Badge className={getFactionColor(territory.faction)}>
                          {getFactionName(territory.faction)}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        {getControlStatusIcon(territory.control_status)}
                        <span className="text-sm text-muted-foreground">
                          {territory.control_status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Strategic Value</p>
                          <p className="font-semibold">{territory.strategic_value}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Starbases</p>
                          <p className="font-semibold">{territory.starbases}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Defense</p>
                          <p className="font-semibold">{territory.defense_rating}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            {selectedTerritory && (
              <Card className="border-2 border-primary lg:col-span-1">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2">{selectedTerritory.name}</h3>
                      <Badge className={getFactionColor(selectedTerritory.faction)}>
                        {getFactionName(selectedTerritory.faction)}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Region:</strong> {selectedTerritory.region}
                      </p>
                      <p>
                        <strong>Population:</strong>{" "}
                        {(selectedTerritory.population / 1000000).toFixed(1)}M
                      </p>
                      <p>
                        <strong>Starbases:</strong> {selectedTerritory.starbases}
                      </p>
                      <p>
                        <strong>Defense Rating:</strong> {selectedTerritory.defense_rating}%
                      </p>
                    </div>

                    <div className="bg-muted p-3 rounded space-y-1">
                      <p className="text-xs font-medium">RESOURCES</p>
                      {Object.entries(selectedTerritory.resources).map(([res, amount]) => (
                        <p key={res} className="text-sm">
                          {res}: {amount.toLocaleString()}
                        </p>
                      ))}
                    </div>

                    {selectedTerritory.adjacent_territories.length > 0 && (
                      <div className="bg-muted p-3 rounded">
                        <p className="text-xs font-medium mb-2">ADJACENT TERRITORIES</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedTerritory.adjacent_territories.length} connected region
                          {selectedTerritory.adjacent_territories.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    )}

                    <Button className="w-full">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="alliances">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4 pr-4">
              {Object.values(allianceStats).map((alliance) => (
                <Card key={alliance.faction}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">{getFactionName(alliance.faction)}</h3>
                      <Badge className={getFactionColor(alliance.faction)}>
                        {getFactionName(alliance.faction)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Territories</p>
                        <p className="text-2xl font-bold">{alliance.territories_controlled}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Military Strength</p>
                        <p className="text-2xl font-bold text-red-500">{alliance.military_strength}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-1">Population</p>
                      <p className="text-sm font-semibold">
                        {(alliance.total_population / 1000000).toFixed(1)}M
                      </p>
                    </div>

                    {Object.keys(alliance.diplomatic_relations).length > 0 && (
                      <div className="bg-muted p-3 rounded">
                        <p className="text-xs font-medium mb-2">DIPLOMATIC RELATIONS</p>
                        <div className="space-y-1 text-xs">
                          {Object.entries(alliance.diplomatic_relations).map(([faction, relation]) => (
                            <p key={faction}>
                              {getFactionName(faction as FactionType)}: {relation > 50 ? "Favorable" : relation > 25 ? "Neutral" : "Hostile"}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="conflicts">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3 pr-4">
              {conflictZones.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active conflict zones detected.</p>
                  </CardContent>
                </Card>
              ) : (
                conflictZones.map((conflict) => (
                  <Card
                    key={conflict.id}
                    className={conflict.status === "active" ? "border-red-500 border-2" : ""}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{conflict.territory_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {getFactionName(conflict.challenger_faction)} vs{" "}
                            {getFactionName(conflict.defender_faction)}
                          </p>
                        </div>
                        <Badge className={conflict.status === "active" ? "bg-red-500" : "bg-yellow-500"}>
                          {conflict.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-xs">
                          <span>Conflict Intensity</span>
                          <span>{conflict.intensity}%</span>
                        </div>
                        <Progress value={conflict.intensity} />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Duration</p>
                          <p className="font-semibold">{conflict.duration_days}d</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Casualties</p>
                          <p className="font-semibold text-red-500">
                            {(conflict.casualties / 1000).toFixed(0)}k
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
      </Tabs>
    </div>
  );
}
