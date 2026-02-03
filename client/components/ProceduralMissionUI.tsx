import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Target,
  Clock,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Play,
  Pause,
  XCircle,
  MapPin,
} from "lucide-react";

type MissionType =
  | "rescue"
  | "patrol"
  | "cargo_delivery"
  | "scientific_survey"
  | "pirate_hunting"
  | "artifact_recovery"
  | "colony_support"
  | "reconnaissance";

type MissionStatus = "available" | "active" | "completed" | "failed";

interface ProceduralMission {
  id: string;
  type: MissionType;
  title: string;
  description: string;
  difficulty: number;
  objectives: string[];
  rewards: {
    credits: number;
    experience: number;
    research_points: number;
  };
  location: string;
  time_limit_hours?: number;
  success_rate: number;
  status: MissionStatus;
}

export function ProceduralMissionUI() {
  const [missions, setMissions] = useState<ProceduralMission[]>([
    {
      id: "m_001",
      type: "rescue",
      title: "Emergency Evacuation - Sector 7G",
      description: "A Federation colony is under attack. Evacuate all personnel.",
      difficulty: 5,
      objectives: ["Reach colony within 4 hours", "Protect evacuation shuttles", "Defend against attackers"],
      rewards: { credits: 50000, experience: 3000, research_points: 500 },
      location: "Sector 7G",
      time_limit_hours: 4,
      success_rate: 72,
      status: "active",
    },
    {
      id: "m_002",
      type: "patrol",
      title: "Border Patrol - Neutral Zone",
      description: "Routine patrol of Federation border space.",
      difficulty: 2,
      objectives: ["Patrol designated route", "Report any anomalies", "Return to base"],
      rewards: { credits: 15000, experience: 1000, research_points: 200 },
      location: "Neutral Zone",
      success_rate: 95,
      status: "available",
    },
    {
      id: "m_003",
      type: "cargo_delivery",
      title: "Urgent Medical Supplies",
      description: "Deliver critical medical supplies to Starbase 375.",
      difficulty: 3,
      objectives: ["Pick up cargo", "Avoid Romulan patrols", "Deliver within 6 hours"],
      rewards: { credits: 35000, experience: 2000, research_points: 350 },
      location: "Starbase 375",
      time_limit_hours: 6,
      success_rate: 85,
      status: "available",
    },
    {
      id: "m_004",
      type: "scientific_survey",
      title: "Anomaly Investigation - Paulson Nebula",
      description: "Investigate unusual spatial readings in the Paulson Nebula.",
      difficulty: 6,
      objectives: ["Reach anomaly location", "Conduct detailed scans", "Collect samples"],
      rewards: { credits: 60000, experience: 4000, research_points: 2000 },
      location: "Paulson Nebula",
      success_rate: 68,
      status: "available",
    },
    {
      id: "m_005",
      type: "pirate_hunting",
      title: "Pirate Elimination - Disputed Territory",
      description: "Hunt down a pirate fleet terrorizing trade routes.",
      difficulty: 7,
      objectives: ["Locate pirate vessel", "Engage and defeat", "Retrieve stolen cargo"],
      rewards: { credits: 75000, experience: 5000, research_points: 800 },
      location: "Disputed Territory",
      success_rate: 55,
      status: "available",
    },
  ]);

  const [activeMissionId, setActiveMissionId] = useState<string | null>("m_001");
  const [filterDifficulty, setFilterDifficulty] = useState<number | "all">("all");

  const filteredMissions = useMemo(() => {
    return missions.filter((m) => {
      if (filterDifficulty !== "all" && m.difficulty !== filterDifficulty) return false;
      return true;
    });
  }, [missions, filterDifficulty]);

  const stats = useMemo(() => {
    const available = missions.filter((m) => m.status === "available").length;
    const active = missions.filter((m) => m.status === "active").length;
    const completed = missions.filter((m) => m.status === "completed").length;
    const totalRewards = missions
      .filter((m) => m.status === "completed")
      .reduce((sum, m) => sum + m.rewards.credits, 0);

    return { available, active, completed, totalRewards };
  }, [missions]);

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 8) return "bg-red-500";
    if (difficulty >= 6) return "bg-orange-500";
    if (difficulty >= 4) return "bg-yellow-500";
    if (difficulty >= 2) return "bg-blue-500";
    return "bg-green-500";
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty >= 8) return "Extreme";
    if (difficulty >= 6) return "Hard";
    if (difficulty >= 4) return "Medium";
    if (difficulty >= 2) return "Easy";
    return "Trivial";
  };

  const handleStartMission = (missionId: string) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, status: "active" as MissionStatus } : m))
    );
    setActiveMissionId(missionId);
  };

  const handleCompleteMission = (missionId: string) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, status: "completed" as MissionStatus } : m))
    );
  };

  const handleAbandonMission = (missionId: string) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, status: "failed" as MissionStatus } : m))
    );
    if (activeMissionId === missionId) setActiveMissionId(null);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mission Operations Center</h1>
          <p className="text-muted-foreground mt-1">Procedurally generated missions for your fleet</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Available</p>
            <p className="text-2xl font-bold text-blue-500">{stats.available}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-green-500">{stats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-purple-500">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Credits Earned</p>
            <p className="text-2xl font-bold text-yellow-500">{stats.totalRewards.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          <div className="mb-4 flex gap-2">
            <Button
              variant={filterDifficulty === "all" ? "default" : "outline"}
              onClick={() => setFilterDifficulty("all")}
            >
              All Difficulty
            </Button>
            {[1, 3, 5, 7].map((diff) => (
              <Button
                key={diff}
                variant={filterDifficulty === diff ? "default" : "outline"}
                onClick={() => setFilterDifficulty(diff)}
              >
                {getDifficultyLabel(diff)}
              </Button>
            ))}
          </div>

          <ScrollArea className="h-[500px]">
            <div className="space-y-3 pr-4">
              {filteredMissions
                .filter((m) => m.status === "available")
                .map((mission) => (
                  <Card key={mission.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{mission.title}</h3>
                          <p className="text-sm text-muted-foreground">{mission.description}</p>
                        </div>
                        <Badge className={`${getDifficultyColor(mission.difficulty)} text-white`}>
                          {getDifficultyLabel(mission.difficulty)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 my-3 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {mission.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {mission.success_rate}% Success
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {mission.rewards.credits.toLocaleString()} Cr
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs font-medium mb-1">Objectives:</p>
                        <ul className="text-xs space-y-1">
                          {mission.objectives.map((obj, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-muted-foreground">•</span>
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button onClick={() => handleStartMission(mission.id)} className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Accept Mission
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="active">
          <ScrollArea className="h-[500px]">
            <div className="space-y-3 pr-4">
              {missions
                .filter((m) => m.status === "active")
                .map((mission) => (
                  <Card key={mission.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{mission.title}</h3>
                          <Badge className={`${getDifficultyColor(mission.difficulty)} text-white mt-1`}>
                            {getDifficultyLabel(mission.difficulty)}
                          </Badge>
                        </div>
                      </div>

                      {mission.time_limit_hours && (
                        <div className="mb-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <span className="text-yellow-600">
                              Time limit: {mission.time_limit_hours} hours
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="mb-3">
                        <p className="text-xs font-medium mb-2">Objectives:</p>
                        <div className="space-y-2">
                          {mission.objectives.map((obj, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 mt-1 text-muted-foreground" />
                              <span className="text-sm">{obj}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleCompleteMission(mission.id)}
                          className="flex-1"
                          size="sm"
                        >
                          Complete
                        </Button>
                        <Button
                          onClick={() => handleAbandonMission(mission.id)}
                          variant="destructive"
                          size="sm"
                        >
                          Abandon
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="completed">
          <ScrollArea className="h-[500px]">
            <div className="space-y-3 pr-4">
              {missions
                .filter((m) => m.status === "completed")
                .map((mission) => (
                  <Card key={mission.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{mission.title}</h3>
                        <Badge className="bg-green-500 text-white">COMPLETED</Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Credits</p>
                          <p className="font-bold">{mission.rewards.credits.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Experience</p>
                          <p className="font-bold">{mission.rewards.experience.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Research</p>
                          <p className="font-bold">{mission.rewards.research_points.toLocaleString()}</p>
                        </div>
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
