import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Building2,
  Users,
  TrendingUp,
  AlertTriangle,
  Zap,
  Droplets,
  Leaf,
  Home,
  Factory,
  Shield,
  Microscope,
  Hammer,
  CheckCircle2,
  Clock,
  DollarSign,
} from "lucide-react";

type ColonyStatus = "established" | "developing" | "thriving" | "struggling";
type InfrastructureType = "residential" | "industrial" | "agricultural" | "research" | "military" | "trade";

interface Colony {
  id: string;
  name: string;
  planet: string;
  population: number;
  status: ColonyStatus;
  morale: number;
  productivity: number;
  development_level: number;
  established_date: Date;
  resources: {
    food: number;
    water: number;
    energy: number;
    materials: number;
  };
  infrastructure: {
    type: InfrastructureType;
    level: number;
    efficiency: number;
  }[];
  defense_rating: number;
  research_points: number;
  trade_value: number;
}

interface ColonyProject {
  id: string;
  colony_id: string;
  colony_name: string;
  name: string;
  type: "infrastructure" | "expansion" | "research" | "defense";
  progress: number;
  total_resources_needed: number;
  resources_allocated: number;
  time_remaining_days: number;
  priority: "low" | "medium" | "high";
  status: "planned" | "in_progress" | "paused" | "completed";
}

export function ColonyManagementUI() {
  const [colonies, setColonies] = useState<Colony[]>([
    {
      id: "col_001",
      name: "Federation Prime Settlement",
      planet: "Earth Colony 7",
      population: 850000,
      status: "thriving",
      morale: 88,
      productivity: 92,
      development_level: 85,
      established_date: new Date(2340, 0, 1),
      resources: { food: 45000, water: 32000, energy: 28000, materials: 15000 },
      infrastructure: [
        { type: "residential", level: 5, efficiency: 95 },
        { type: "industrial", level: 4, efficiency: 88 },
        { type: "agricultural", level: 4, efficiency: 92 },
        { type: "research", level: 3, efficiency: 85 },
      ],
      defense_rating: 75,
      research_points: 12500,
      trade_value: 85000,
    },
    {
      id: "col_002",
      name: "Frontier Outpost Alpha",
      planet: "Kepler-442b",
      population: 120000,
      status: "developing",
      morale: 72,
      productivity: 68,
      development_level: 45,
      established_date: new Date(2360, 0, 1),
      resources: { food: 8000, water: 5000, energy: 6000, materials: 3000 },
      infrastructure: [
        { type: "residential", level: 2, efficiency: 80 },
        { type: "agricultural", level: 2, efficiency: 75 },
        { type: "military", level: 1, efficiency: 70 },
      ],
      defense_rating: 45,
      research_points: 2500,
      trade_value: 15000,
    },
    {
      id: "col_003",
      name: "Mining Extraction Site",
      planet: "Vega Mining World",
      population: 280000,
      status: "developing",
      morale: 65,
      productivity: 78,
      development_level: 55,
      established_date: new Date(2350, 0, 1),
      resources: { food: 12000, water: 8000, energy: 18000, materials: 35000 },
      infrastructure: [
        { type: "industrial", level: 5, efficiency: 95 },
        { type: "residential", level: 2, efficiency: 65 },
      ],
      defense_rating: 55,
      research_points: 4000,
      trade_value: 95000,
    },
    {
      id: "col_004",
      name: "Scientific Research Station",
      planet: "Academia Prime",
      population: 95000,
      status: "thriving",
      morale: 85,
      productivity: 88,
      development_level: 70,
      established_date: new Date(2355, 0, 1),
      resources: { food: 5000, water: 3000, energy: 12000, materials: 2000 },
      infrastructure: [
        { type: "research", level: 5, efficiency: 98 },
        { type: "residential", level: 3, efficiency: 90 },
      ],
      defense_rating: 35,
      research_points: 18000,
      trade_value: 45000,
    },
  ]);

  const [colonyProjects, setColonyProjects] = useState<ColonyProject[]>([
    {
      id: "proj_001",
      colony_id: "col_001",
      colony_name: "Federation Prime Settlement",
      name: "Advanced Research Facility",
      type: "infrastructure",
      progress: 65,
      total_resources_needed: 50000,
      resources_allocated: 32500,
      time_remaining_days: 45,
      priority: "high",
      status: "in_progress",
    },
    {
      id: "proj_002",
      colony_id: "col_002",
      colony_name: "Frontier Outpost Alpha",
      name: "Population Expansion",
      type: "expansion",
      progress: 35,
      total_resources_needed: 25000,
      resources_allocated: 8750,
      time_remaining_days: 90,
      priority: "medium",
      status: "in_progress",
    },
    {
      id: "proj_003",
      colony_id: "col_003",
      colony_name: "Mining Extraction Site",
      name: "Defense Grid Installation",
      type: "defense",
      progress: 80,
      total_resources_needed: 35000,
      resources_allocated: 28000,
      time_remaining_days: 15,
      priority: "high",
      status: "in_progress",
    },
  ]);

  const [selectedColonyId, setSelectedColonyId] = useState<string | null>("col_001");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const selectedColony = useMemo(() => {
    return colonies.find((c) => c.id === selectedColonyId);
  }, [colonies, selectedColonyId]);

  const filteredColonies = useMemo(() => {
    return colonies.filter((c) => {
      if (filterStatus !== "all" && c.status !== filterStatus) return false;
      return true;
    });
  }, [colonies, filterStatus]);

  const stats = useMemo(() => {
    const totalPopulation = colonies.reduce((sum, c) => sum + c.population, 0);
    const totalResearchPoints = colonies.reduce((sum, c) => sum + c.research_points, 0);
    const avgMorale = Math.round(colonies.reduce((sum, c) => sum + c.morale, 0) / colonies.length);
    const thrivingColonies = colonies.filter((c) => c.status === "thriving").length;

    return { totalPopulation, totalResearchPoints, avgMorale, thrivingColonies };
  }, [colonies]);

  const getStatusColor = (status: ColonyStatus) => {
    switch (status) {
      case "thriving":
        return "bg-green-500 text-white";
      case "developing":
        return "bg-blue-500 text-white";
      case "established":
        return "bg-cyan-500 text-white";
      case "struggling":
        return "bg-red-500 text-white";
    }
  };

  const getInfrastructureIcon = (type: InfrastructureType) => {
    const icons: Record<InfrastructureType, any> = {
      residential: <Home className="h-5 w-5" />,
      industrial: <Factory className="h-5 w-5" />,
      agricultural: <Leaf className="h-5 w-5" />,
      research: <Microscope className="h-5 w-5" />,
      military: <Shield className="h-5 w-5" />,
      trade: <DollarSign className="h-5 w-5" />,
    };
    return icons[type] || <Building2 className="h-5 w-5" />;
  };

  const handleAllocateResources = (projectId: string, amount: number) => {
    setColonyProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              resources_allocated: Math.min(p.resources_allocated + amount, p.total_resources_needed),
              progress: Math.min(
                100,
                ((p.resources_allocated + amount) / p.total_resources_needed) * 100
              ),
            }
          : p
      )
    );
  };

  const handlePauseProject = (projectId: string) => {
    setColonyProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: "paused" as const } : p))
    );
  };

  const handleResumeProject = (projectId: string) => {
    setColonyProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: "in_progress" as const } : p))
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Colony Management</h1>
          <p className="text-muted-foreground mt-1">
            Establish, develop, and manage planetary colonies
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Population</p>
            <p className="text-2xl font-bold text-blue-500">
              {(stats.totalPopulation / 1000000).toFixed(2)}M
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Research Points</p>
            <p className="text-2xl font-bold text-cyan-500">{stats.totalResearchPoints.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Avg Morale</p>
            <p className="text-2xl font-bold text-green-500">{stats.avgMorale}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Thriving Colonies</p>
            <p className="text-2xl font-bold text-yellow-500">{stats.thrivingColonies}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="colonies" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="colonies">Colonies</TabsTrigger>
          <TabsTrigger value="projects">Development Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="colonies" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <select
              className="border rounded px-3 py-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="thriving">Thriving</option>
              <option value="developing">Developing</option>
              <option value="established">Established</option>
              <option value="struggling">Struggling</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ScrollArea className="lg:col-span-2 h-[600px]">
              <div className="space-y-3 pr-4">
                {filteredColonies.map((colony) => (
                  <Card
                    key={colony.id}
                    className={`cursor-pointer ${selectedColonyId === colony.id ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setSelectedColonyId(colony.id)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{colony.name}</h3>
                          <p className="text-sm text-muted-foreground">{colony.planet}</p>
                        </div>
                        <Badge className={getStatusColor(colony.status)}>
                          {colony.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Morale</span>
                          <span>{colony.morale}%</span>
                        </div>
                        <Progress value={colony.morale} />
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Population</p>
                          <p className="font-semibold">
                            {(colony.population / 1000).toFixed(0)}k
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Development</p>
                          <p className="font-semibold">{colony.development_level}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Defense</p>
                          <p className="font-semibold">{colony.defense_rating}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            {selectedColony && (
              <Card className="border-2 border-primary lg:col-span-1">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-4">{selectedColony.name}</h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">PLANET</p>
                      <p className="text-sm font-semibold">{selectedColony.planet}</p>
                    </div>

                    <div>
                      <Badge className={getStatusColor(selectedColony.status)}>
                        {selectedColony.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="bg-muted p-3 rounded space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Morale</span>
                        <span className="font-semibold">{selectedColony.morale}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Productivity</span>
                        <span className="font-semibold">{selectedColony.productivity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Development</span>
                        <span className="font-semibold">{selectedColony.development_level}%</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        INFRASTRUCTURE
                      </p>
                      <div className="space-y-1">
                        {selectedColony.infrastructure.map((inf) => (
                          <div
                            key={inf.type}
                            className="flex items-center justify-between text-xs p-2 bg-muted rounded"
                          >
                            <div className="flex items-center gap-2">
                              {getInfrastructureIcon(inf.type)}
                              <span className="capitalize">{inf.type}</span>
                            </div>
                            <span className="font-semibold">Lv{inf.level}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full">Manage Colony</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3 pr-4">
              {colonyProjects.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    <Hammer className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No development projects in progress.</p>
                  </CardContent>
                </Card>
              ) : (
                colonyProjects.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">{project.colony_name}</p>
                        </div>
                        <Badge
                          className={`${
                            project.status === "in_progress"
                              ? "bg-blue-500"
                              : project.status === "paused"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          } text-white`}
                        >
                          {project.status === "in_progress" ? "ACTIVE" : project.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{Math.round(project.progress)}%</span>
                        </div>
                        <Progress value={project.progress} />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div>
                          <p className="text-muted-foreground">Time Remaining</p>
                          <p className="font-semibold">{project.time_remaining_days}d</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Priority</p>
                          <p className={`font-semibold ${
                            project.priority === "high" ? "text-red-500" :
                            project.priority === "medium" ? "text-yellow-500" :
                            "text-green-500"
                          }`}>
                            {project.priority.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {project.status === "in_progress" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePauseProject(project.id)}
                              className="flex-1"
                            >
                              <Clock className="h-4 w-4 mr-1" />
                              Pause
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleAllocateResources(project.id, 5000)
                              }
                              className="flex-1"
                            >
                              <TrendingUp className="h-4 w-4 mr-1" />
                              Boost
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleResumeProject(project.id)}
                            className="flex-1"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Resume
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
      </Tabs>
    </div>
  );
}
