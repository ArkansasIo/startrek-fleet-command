import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Hammer,
  Zap,
  AlertTriangle,
  TrendingUp,
  Clock,
  Pause,
  Play,
  Trash2,
  Target,
  Rocket,
  Wrench,
  CheckCircle2,
} from "lucide-react";

type MiningResourceType = "dilithium" | "tritanium" | "latinum" | "duranium" | "verterium" | "pergium";
type MiningStatus = "idle" | "mining" | "paused" | "completed" | "failed";
type RiskLevel = "low" | "moderate" | "high" | "critical";

interface MiningSite {
  id: string;
  name: string;
  location: string;
  resources: {
    type: MiningResourceType;
    quantity: number;
    richness_factor: number;
  }[];
  risk_level: RiskLevel;
  scan_difficulty: number;
  discovery_date: Date;
  depletion_rate: number;
}

interface MiningOperation {
  id: string;
  site_id: string;
  site_name: string;
  resource_type: MiningResourceType;
  status: MiningStatus;
  progress_percent: number;
  total_amount: number;
  extracted_amount: number;
  start_time: Date;
  estimated_completion: Date;
  equipment_condition: number;
  hazards_encountered: string[];
  crew_assigned: number;
  efficiency_modifier: number;
}

export function ResourceMiningUI() {
  const [miningSites, setMiningSites] = useState<MiningSite[]>([
    {
      id: "site_001",
      name: "Asteroid Vega-5",
      location: "Sector 7G",
      resources: [
        { type: "dilithium", quantity: 15000, richness_factor: 0.85 },
        { type: "tritanium", quantity: 8000, richness_factor: 0.70 },
      ],
      risk_level: "low",
      scan_difficulty: 25,
      discovery_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      depletion_rate: 5,
    },
    {
      id: "site_002",
      name: "Planetary Ring System",
      location: "Sector 12K",
      resources: [
        { type: "latinum", quantity: 5000, richness_factor: 0.95 },
        { type: "duranium", quantity: 12000, richness_factor: 0.75 },
        { type: "verterium", quantity: 3000, richness_factor: 0.80 },
      ],
      risk_level: "moderate",
      scan_difficulty: 45,
      discovery_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      depletion_rate: 8,
    },
    {
      id: "site_003",
      name: "Nebula Core Deposits",
      location: "Sector 15Q",
      resources: [
        { type: "pergium", quantity: 8000, richness_factor: 0.90 },
        { type: "dilithium", quantity: 6000, richness_factor: 0.65 },
      ],
      risk_level: "high",
      scan_difficulty: 65,
      discovery_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      depletion_rate: 12,
    },
    {
      id: "site_004",
      name: "Rogue Comet Fragment",
      location: "Sector 8F",
      resources: [
        { type: "tritanium", quantity: 20000, richness_factor: 0.80 },
      ],
      risk_level: "low",
      scan_difficulty: 30,
      discovery_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      depletion_rate: 4,
    },
  ]);

  const [miningOperations, setMiningOperations] = useState<MiningOperation[]>([
    {
      id: "op_001",
      site_id: "site_001",
      site_name: "Asteroid Vega-5",
      resource_type: "dilithium",
      status: "mining",
      progress_percent: 45,
      total_amount: 5000,
      extracted_amount: 2250,
      start_time: new Date(Date.now() - 6 * 60 * 60 * 1000),
      estimated_completion: new Date(Date.now() + 7.5 * 60 * 60 * 1000),
      equipment_condition: 92,
      hazards_encountered: [],
      crew_assigned: 8,
      efficiency_modifier: 0.95,
    },
    {
      id: "op_002",
      site_id: "site_002",
      site_name: "Planetary Ring System",
      resource_type: "latinum",
      status: "mining",
      progress_percent: 28,
      total_amount: 2000,
      extracted_amount: 560,
      start_time: new Date(Date.now() - 3 * 60 * 60 * 1000),
      estimated_completion: new Date(Date.now() + 8 * 60 * 60 * 1000),
      equipment_condition: 87,
      hazards_encountered: ["Radiation spike", "Equipment malfunction"],
      crew_assigned: 10,
      efficiency_modifier: 0.85,
    },
  ]);

  const [completedOperations, setCompletedOperations] = useState<MiningOperation[]>([
    {
      id: "op_completed_001",
      site_id: "site_001",
      site_name: "Asteroid Vega-5",
      resource_type: "tritanium",
      status: "completed",
      progress_percent: 100,
      total_amount: 3000,
      extracted_amount: 3000,
      start_time: new Date(Date.now() - 24 * 60 * 60 * 1000),
      estimated_completion: new Date(Date.now() - 18 * 60 * 60 * 1000),
      equipment_condition: 78,
      hazards_encountered: [],
      crew_assigned: 6,
      efficiency_modifier: 1.0,
    },
  ]);

  const [selectedSiteId, setSelectedSiteId] = useState<string | null>("site_001");
  const [filterRisk, setFilterRisk] = useState<string>("all");

  const selectedSite = useMemo(() => {
    return miningSites.find((s) => s.id === selectedSiteId);
  }, [miningSites, selectedSiteId]);

  const filteredSites = useMemo(() => {
    return miningSites.filter((s) => {
      if (filterRisk !== "all" && s.risk_level !== filterRisk) return false;
      return true;
    });
  }, [miningSites, filterRisk]);

  const stats = useMemo(() => {
    const activeMining = miningOperations.length;
    const totalExtracted = miningOperations.reduce((sum, op) => sum + op.extracted_amount, 0);
    const avgEquipmentCondition =
      miningOperations.length > 0
        ? Math.round(
            miningOperations.reduce((sum, op) => sum + op.equipment_condition, 0) /
              miningOperations.length
          )
        : 100;

    return {
      activeMining,
      totalExtracted: Math.round(totalExtracted),
      avgEquipmentCondition,
      completedCount: completedOperations.length,
    };
  }, [miningOperations, completedOperations]);

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case "low":
        return "bg-green-500";
      case "moderate":
        return "bg-yellow-500";
      case "high":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getResourceColor = (resource: MiningResourceType) => {
    const colors: Record<MiningResourceType, string> = {
      dilithium: "text-cyan-400",
      tritanium: "text-orange-400",
      latinum: "text-yellow-400",
      duranium: "text-red-400",
      verterium: "text-purple-400",
      pergium: "text-green-400",
    };
    return colors[resource] || "text-gray-400";
  };

  const handleStartMining = (siteId: string, resourceType: MiningResourceType) => {
    const site = miningSites.find((s) => s.id === siteId);
    if (!site) return;

    const newOperation: MiningOperation = {
      id: `op_${Date.now()}`,
      site_id: siteId,
      site_name: site.name,
      resource_type: resourceType,
      status: "mining",
      progress_percent: 0,
      total_amount: Math.floor(Math.random() * 3000) + 1000,
      extracted_amount: 0,
      start_time: new Date(),
      estimated_completion: new Date(Date.now() + Math.random() * 12 * 60 * 60 * 1000),
      equipment_condition: 95,
      hazards_encountered: [],
      crew_assigned: Math.floor(Math.random() * 5) + 5,
      efficiency_modifier: 0.8 + Math.random() * 0.2,
    };

    setMiningOperations((prev) => [...prev, newOperation]);
  };

  const handlePauseOperation = (operationId: string) => {
    setMiningOperations((prev) =>
      prev.map((op) =>
        op.id === operationId ? { ...op, status: "paused" as MiningStatus } : op
      )
    );
  };

  const handleResumeOperation = (operationId: string) => {
    setMiningOperations((prev) =>
      prev.map((op) =>
        op.id === operationId ? { ...op, status: "mining" as MiningStatus } : op
      )
    );
  };

  const handleCancelOperation = (operationId: string) => {
    const operation = miningOperations.find((op) => op.id === operationId);
    if (!operation) return;

    setMiningOperations((prev) => prev.filter((op) => op.id !== operationId));
    setCompletedOperations((prev) => [
      ...prev,
      { ...operation, status: "failed" as MiningStatus },
    ]);
  };

  const handleCompleteOperation = (operationId: string) => {
    const operation = miningOperations.find((op) => op.id === operationId);
    if (!operation) return;

    setMiningOperations((prev) => prev.filter((op) => op.id !== operationId));
    setCompletedOperations((prev) => [
      ...prev,
      { ...operation, status: "completed" as MiningStatus, progress_percent: 100, extracted_amount: operation.total_amount },
    ]);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resource Mining Operations</h1>
          <p className="text-muted-foreground mt-1">
            Manage asteroid mining and resource extraction
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Active Operations</p>
            <p className="text-2xl font-bold text-blue-500">{stats.activeMining}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Completed Operations</p>
            <p className="text-2xl font-bold text-green-500">{stats.completedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Extracted</p>
            <p className="text-2xl font-bold text-cyan-400">{stats.totalExtracted.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Equipment Condition</p>
            <p className="text-2xl font-bold text-yellow-500">{stats.avgEquipmentCondition}%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="operations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="operations">Active Operations</TabsTrigger>
          <TabsTrigger value="sites">Mining Sites</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="operations">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3 pr-4">
              {miningOperations.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    <Hammer className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active mining operations. Start mining at a site.</p>
                  </CardContent>
                </Card>
              ) : (
                miningOperations.map((operation) => (
                  <Card key={operation.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{operation.site_name}</h3>
                          <p className={`text-sm font-medium ${getResourceColor(operation.resource_type)}`}>
                            {operation.resource_type.toUpperCase()}
                          </p>
                        </div>
                        <Badge
                          className={`${
                            operation.status === "mining"
                              ? "bg-blue-500"
                              : operation.status === "paused"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                          } text-white`}
                        >
                          {operation.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>
                            {operation.extracted_amount.toLocaleString()} /{" "}
                            {operation.total_amount.toLocaleString()} units
                          </span>
                        </div>
                        <Progress value={operation.progress_percent} />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div>
                          <p className="text-muted-foreground">Equipment</p>
                          <p className="font-semibold">{operation.equipment_condition}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Crew Assigned</p>
                          <p className="font-semibold">{operation.crew_assigned}</p>
                        </div>
                      </div>

                      {operation.hazards_encountered.length > 0 && (
                        <div className="mb-3 p-2 bg-orange-900/30 border border-orange-500/50 rounded text-xs">
                          <p className="font-semibold text-orange-400 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Hazards
                          </p>
                          <p className="text-muted-foreground">
                            {operation.hazards_encountered.join(", ")}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {operation.status === "mining" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePauseOperation(operation.id)}
                              className="flex-1"
                            >
                              <Pause className="h-4 w-4 mr-1" />
                              Pause
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCompleteOperation(operation.id)}
                              className="flex-1"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleResumeOperation(operation.id)}
                            className="flex-1"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Resume
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleCancelOperation(operation.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="sites">
          <div className="space-y-4">
            <select
              className="border rounded px-3 py-2"
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <ScrollArea className="lg:col-span-2 h-[600px]">
                <div className="space-y-3 pr-4">
                  {filteredSites.map((site) => (
                    <Card
                      key={site.id}
                      className={`cursor-pointer ${selectedSiteId === site.id ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setSelectedSiteId(site.id)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{site.name}</h3>
                            <p className="text-sm text-muted-foreground">{site.location}</p>
                          </div>
                          <Badge className={`${getRiskColor(site.risk_level)} text-white`}>
                            {site.risk_level.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="space-y-1 text-sm">
                          {site.resources.map((res, idx) => (
                            <p key={idx} className={`${getResourceColor(res.type)}`}>
                              {res.type}: {res.quantity.toLocaleString()} units (
                              {Math.round(res.richness_factor * 100)}%)
                            </p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>

              {selectedSite && (
                <Card className="border-2 border-primary lg:col-span-1">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-lg mb-4">{selectedSite.name}</h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">LOCATION</p>
                        <p className="text-sm">{selectedSite.location}</p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">RISK LEVEL</p>
                        <Badge className={`${getRiskColor(selectedSite.risk_level)} text-white`}>
                          {selectedSite.risk_level.toUpperCase()}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          AVAILABLE RESOURCES
                        </p>
                        <div className="space-y-2">
                          {selectedSite.resources.map((res) => (
                            <Button
                              key={res.type}
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => handleStartMining(selectedSite.id, res.type)}
                            >
                              <Hammer className="h-4 w-4 mr-2" />
                              <div className="text-left">
                                <p className="font-medium">{res.type.toUpperCase()}</p>
                                <p className="text-xs text-muted-foreground">
                                  {res.quantity.toLocaleString()} units
                                </p>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-muted p-3 rounded text-xs space-y-1">
                        <p>
                          <strong>Depletion Rate:</strong> {selectedSite.depletion_rate}% per day
                        </p>
                        <p>
                          <strong>Discovered:</strong>{" "}
                          {Math.floor(
                            (Date.now() - selectedSite.discovery_date.getTime()) / (24 * 60 * 60 * 1000)
                          )}{" "}
                          days ago
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3 pr-4">
              {completedOperations.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    <Hammer className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No completed mining operations yet.</p>
                  </CardContent>
                </Card>
              ) : (
                completedOperations.map((operation) => (
                  <Card key={operation.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{operation.site_name}</h3>
                          <p className={`text-sm font-medium ${getResourceColor(operation.resource_type)}`}>
                            {operation.resource_type.toUpperCase()}
                          </p>
                        </div>
                        <Badge
                          className={`${
                            operation.status === "completed" ? "bg-green-500" : "bg-red-500"
                          } text-white`}
                        >
                          {operation.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">EXTRACTED</p>
                          <p className="font-semibold">
                            {operation.extracted_amount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">TOTAL AMOUNT</p>
                          <p className="font-semibold">
                            {operation.total_amount.toLocaleString()}
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
