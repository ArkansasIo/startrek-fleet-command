import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Target,
  Clock,
  Star,
  Zap,
  Users,
  Eye,
  DollarSign,
  Activity,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Award,
  MapPin,
  Rocket,
  Shield,
  Sword,
  Brain,
  Radio,
  Microscope,
  Calendar,
  Trophy,
  Gift,
  Navigation,
  Compass,
} from "lucide-react";

interface EnhancedMissionSystemProps {
  activeSubmenu?: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  briefing: string;
  type:
    | "exploration"
    | "combat"
    | "diplomatic"
    | "research"
    | "trade"
    | "rescue"
    | "patrol"
    | "survey";
  classification:
    | "routine"
    | "priority"
    | "urgent"
    | "classified"
    | "top_secret";
  difficulty: number;
  estimatedDuration: number; // in hours
  location: {
    sector: string;
    system: string;
    coordinates: string;
  };
  objectives: {
    id: string;
    description: string;
    type: "primary" | "secondary" | "bonus";
    completed: boolean;
    progress: number;
    target: number;
  }[];
  requirements: {
    minLevel: number;
    minRank: string;
    clearanceLevel: number;
    shipClass?: string[];
    crewSpecialties?: string[];
  };
  rewards: {
    experience: number;
    credits: number;
    reputation: number;
    commendations?: string[];
    equipment?: string[];
    resources?: Record<string, number>;
  };
  risks: {
    combat: number;
    diplomatic: number;
    technical: number;
    environmental: number;
  };
  status:
    | "available"
    | "assigned"
    | "in_progress"
    | "completed"
    | "failed"
    | "abandoned";
  assignedAt?: string;
  startedAt?: string;
  completedAt?: string;
  deadline?: string;
  missionControl: {
    officer: string;
    contact: string;
    frequency: string;
  };
}

export const EnhancedMissionSystem: React.FC<EnhancedMissionSystemProps> = ({
  activeSubmenu,
}) => {
  const normalizeSubmenu = (submenu?: string) => {
    const map: Record<string, string> = {
      active: "active",
      completed: "completed",
      classified: "briefing",
    };
    return map[submenu || ""] || "available";
  };

  const [activeTab, setActiveTab] = useState(normalizeSubmenu(activeSubmenu));

  useEffect(() => {
    setActiveTab(normalizeSubmenu(activeSubmenu));
  }, [activeSubmenu]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [activeMissions, setActiveMissions] = useState<Mission[]>([]);
  const [completedMissions, setCompletedMissions] = useState<Mission[]>([]);

  useEffect(() => {
    // Generate sample missions
    const sampleMissions: Mission[] = [
      {
        id: "mission-2387-001",
        title: "First Contact: Zephyrian Confederation",
        description:
          "Establish diplomatic relations with the newly discovered Zephyrian Confederation in the Neutral Zone.",
        briefing:
          "Long-range sensors have detected a previously unknown civilization in Sector 47-Gamma. The Zephyrians appear to have achieved warp capability recently. Your mission is to make first contact and assess their intentions.",
        type: "diplomatic",
        classification: "priority",
        difficulty: 3,
        estimatedDuration: 48,
        location: {
          sector: "Sector 47-Gamma",
          system: "Zephyr Prime System",
          coordinates: "127.4, 89.2, 45.7",
        },
        objectives: [
          {
            id: "obj-001",
            description: "Navigate to Zephyr Prime System",
            type: "primary",
            completed: false,
            progress: 0,
            target: 1,
          },
          {
            id: "obj-002",
            description: "Establish peaceful contact with Zephyrian vessels",
            type: "primary",
            completed: false,
            progress: 0,
            target: 1,
          },
          {
            id: "obj-003",
            description: "Complete cultural exchange protocols",
            type: "primary",
            completed: false,
            progress: 0,
            target: 1,
          },
          {
            id: "obj-004",
            description: "Document Zephyrian technology level",
            type: "secondary",
            completed: false,
            progress: 0,
            target: 5,
          },
          {
            id: "obj-005",
            description: "Establish trade agreements",
            type: "bonus",
            completed: false,
            progress: 0,
            target: 1,
          },
        ],
        requirements: {
          minLevel: 3,
          minRank: "Lieutenant",
          clearanceLevel: 5,
          crewSpecialties: ["Diplomat", "Universal Translator"],
        },
        rewards: {
          experience: 1500,
          credits: 5000,
          reputation: 200,
          commendations: ["First Contact Ribbon"],
        },
        risks: {
          combat: 2,
          diplomatic: 8,
          technical: 3,
          environmental: 1,
        },
        status: "available",
        missionControl: {
          officer: "Admiral Nogura",
          contact: "Starfleet Diplomatic Corps",
          frequency: "248.3 MHz",
        },
      },
      {
        id: "mission-2387-002",
        title: "Borg Incursion Response",
        description:
          "Investigate reports of Borg activity in the outer rim territories.",
        briefing:
          "Multiple Federation outposts have reported unusual subspace distortions consistent with Borg transwarp signatures. Intelligence suggests a possible scouting force. Extreme caution is advised.",
        type: "combat",
        classification: "classified",
        difficulty: 8,
        estimatedDuration: 72,
        location: {
          sector: "Sector 12-Delta",
          system: "Outpost System 47",
          coordinates: "89.7, 156.2, 78.9",
        },
        objectives: [
          {
            id: "obj-010",
            description: "Investigate subspace anomalies",
            type: "primary",
            completed: false,
            progress: 0,
            target: 3,
          },
          {
            id: "obj-011",
            description: "Survive Borg encounter",
            type: "primary",
            completed: false,
            progress: 0,
            target: 1,
          },
          {
            id: "obj-012",
            description: "Rescue assimilated personnel",
            type: "secondary",
            completed: false,
            progress: 0,
            target: 12,
          },
          {
            id: "obj-013",
            description: "Recover Borg technology samples",
            type: "bonus",
            completed: false,
            progress: 0,
            target: 3,
          },
        ],
        requirements: {
          minLevel: 8,
          minRank: "Commander",
          clearanceLevel: 9,
          shipClass: ["Heavy Cruiser", "Battleship"],
          crewSpecialties: ["Tactical Officer", "Chief Medical Officer"],
        },
        rewards: {
          experience: 5000,
          credits: 15000,
          reputation: 500,
          commendations: [
            "Defense of the Federation Medal",
            "Combat Action Ribbon",
          ],
          equipment: ["Borg Shield Adaptation Module"],
        },
        risks: {
          combat: 10,
          diplomatic: 1,
          technical: 7,
          environmental: 4,
        },
        status: "available",
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        missionControl: {
          officer: "Admiral Ross",
          contact: "Starfleet Tactical",
          frequency: "156.7 MHz",
        },
      },
      {
        id: "mission-2387-003",
        title: "Deep Space Cartographic Survey",
        description: "Map uncharted stellar regions beyond the galactic rim.",
        briefing:
          "Starfleet Science Division requires detailed stellar cartography of the unexplored regions in Grid 94-Epsilon. This long-range exploration mission will expand our knowledge of the local galaxy.",
        type: "exploration",
        classification: "routine",
        difficulty: 4,
        estimatedDuration: 120,
        location: {
          sector: "Grid 94-Epsilon",
          system: "Uncharted Region",
          coordinates: "Variable",
        },
        objectives: [
          {
            id: "obj-020",
            description: "Survey 15 star systems",
            type: "primary",
            completed: false,
            progress: 0,
            target: 15,
          },
          {
            id: "obj-021",
            description: "Catalog new planetary bodies",
            type: "primary",
            completed: false,
            progress: 0,
            target: 50,
          },
          {
            id: "obj-022",
            description: "Document space phenomena",
            type: "secondary",
            completed: false,
            progress: 0,
            target: 10,
          },
          {
            id: "obj-023",
            description: "Discover habitable worlds",
            type: "bonus",
            completed: false,
            progress: 0,
            target: 3,
          },
        ],
        requirements: {
          minLevel: 2,
          minRank: "Lieutenant",
          clearanceLevel: 3,
          shipClass: ["Science Vessel", "Explorer"],
          crewSpecialties: ["Science Officer", "Stellar Cartographer"],
        },
        rewards: {
          experience: 2500,
          credits: 8000,
          reputation: 150,
          commendations: ["Exploration Medal"],
          resources: { rare_minerals: 500, scientific_data: 1000 },
        },
        risks: {
          combat: 3,
          diplomatic: 1,
          technical: 5,
          environmental: 6,
        },
        status: "available",
        missionControl: {
          officer: "Dr. T'Pau",
          contact: "Starfleet Science Division",
          frequency: "192.8 MHz",
        },
      },
    ];

    setMissions(sampleMissions);
  }, []);

  const getMissionTypeIcon = (type: Mission["type"]) => {
    switch (type) {
      case "combat":
        return <Zap className="w-4 h-4" />;
      case "exploration":
        return <Compass className="w-4 h-4" />;
      case "diplomatic":
        return <Users className="w-4 h-4" />;
      case "research":
        return <Microscope className="w-4 h-4" />;
      case "trade":
        return <DollarSign className="w-4 h-4" />;
      case "rescue":
        return <Shield className="w-4 h-4" />;
      case "patrol":
        return <Eye className="w-4 h-4" />;
      case "survey":
        return <Activity className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getClassificationColor = (
    classification: Mission["classification"],
  ) => {
    switch (classification) {
      case "routine":
        return "text-green-400 border-green-400";
      case "priority":
        return "text-yellow-400 border-yellow-400";
      case "urgent":
        return "text-orange-400 border-orange-400";
      case "classified":
        return "text-red-400 border-red-400";
      case "top_secret":
        return "text-purple-400 border-purple-400";
      default:
        return "text-gray-400 border-gray-400";
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < difficulty ? "text-yellow-400 fill-current" : "text-gray-600"}`}
      />
    ));
  };

  const acceptMission = (mission: Mission) => {
    const updatedMission = {
      ...mission,
      status: "assigned" as const,
      assignedAt: new Date().toISOString(),
    };

    setMissions((prev) => prev.filter((m) => m.id !== mission.id));
    setActiveMissions((prev) => [...prev, updatedMission]);
  };

  const startMission = (mission: Mission) => {
    const updatedMission = {
      ...mission,
      status: "in_progress" as const,
      startedAt: new Date().toISOString(),
    };

    setActiveMissions((prev) =>
      prev.map((m) => (m.id === mission.id ? updatedMission : m)),
    );
  };

  const formatTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "EXPIRED";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  return (
    <div className="min-h-screen bg-black text-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-blue-400">
            <Target className="inline-block w-8 h-8 mr-3" />
            Mission Operations Center
          </h1>
          <p className="text-blue-300">
            Starfleet Command • Mission Coordination and Assignment
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-blue-500">
            <TabsTrigger
              value="available"
              className="data-[state=active]:bg-blue-600"
            >
              Available ({missions.length})
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-blue-600"
            >
              Active ({activeMissions.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-blue-600"
            >
              Completed ({completedMissions.length})
            </TabsTrigger>
            <TabsTrigger
              value="briefing"
              className="data-[state=active]:bg-blue-600"
            >
              Mission Briefing
            </TabsTrigger>
          </TabsList>

          {/* Available Missions Tab */}
          <TabsContent value="available" className="space-y-4">
            {missions.length === 0 ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-8 text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-300">
                    No Available Missions
                  </h3>
                  <p className="text-gray-400">
                    Check back later for new assignments from Starfleet Command.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {missions.map((mission) => (
                  <Card
                    key={mission.id}
                    className="bg-gray-800 border-gray-600 hover:border-blue-500 transition-colors"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getMissionTypeIcon(mission.type)}
                          <Badge
                            variant="outline"
                            className={getClassificationColor(
                              mission.classification,
                            )}
                          >
                            {mission.classification}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getDifficultyStars(mission.difficulty)}
                        </div>
                      </div>
                      <CardTitle className="text-blue-400">
                        {mission.title}
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        {mission.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Duration:</span>
                          <p className="text-blue-400">
                            {mission.estimatedDuration}h
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">Location:</span>
                          <p className="text-blue-400">
                            {mission.location.sector}
                          </p>
                        </div>
                      </div>

                      {mission.deadline && (
                        <Alert className="bg-amber-900/20 border-amber-500/30">
                          <Clock className="w-4 h-4" />
                          <AlertTitle className="text-amber-400">
                            Time Sensitive
                          </AlertTitle>
                          <AlertDescription className="text-amber-300">
                            Mission expires in:{" "}
                            {formatTimeRemaining(mission.deadline)}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <span className="text-gray-400 text-sm">
                          Primary Objectives:
                        </span>
                        {mission.objectives
                          .filter((obj) => obj.type === "primary")
                          .map((obj) => (
                            <div
                              key={obj.id}
                              className="text-sm text-gray-300 flex items-center"
                            >
                              <Target className="w-3 h-3 mr-2 text-blue-400" />
                              {obj.description}
                            </div>
                          ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Rewards:</span>
                          <div className="text-green-400">
                            +{mission.rewards.experience} XP
                          </div>
                          <div className="text-yellow-400">
                            +{mission.rewards.credits} Credits
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Requirements:</span>
                          <div className="text-blue-400">
                            Level {mission.requirements.minLevel}+
                          </div>
                          <div className="text-purple-400">
                            Clearance {mission.requirements.clearanceLevel}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => setSelectedMission(mission)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Briefing
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => acceptMission(mission)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Accept Mission
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Active Missions Tab */}
          <TabsContent value="active" className="space-y-4">
            {activeMissions.length === 0 ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-8 text-center">
                  <Rocket className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-300">
                    No Active Missions
                  </h3>
                  <p className="text-gray-400">
                    Accept missions from the Available tab to begin your
                    assignments.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeMissions.map((mission) => (
                  <Card
                    key={mission.id}
                    className="bg-gray-800 border-gray-600"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getMissionTypeIcon(mission.type)}
                          <Badge
                            variant={
                              mission.status === "in_progress"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {mission.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="text-right text-sm">
                          <div className="text-gray-400">Mission Control</div>
                          <div className="text-blue-400">
                            {mission.missionControl.officer}
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-blue-400">
                        {mission.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {mission.objectives.map((obj) => (
                          <div key={obj.id} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span
                                className={`${obj.type === "primary" ? "text-blue-400" : obj.type === "secondary" ? "text-yellow-400" : "text-green-400"}`}
                              >
                                {obj.description}
                              </span>
                              <span className="text-gray-400">
                                {obj.progress}/{obj.target}
                              </span>
                            </div>
                            <Progress
                              value={(obj.progress / obj.target) * 100}
                              className="bg-gray-700 h-2"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex space-x-2">
                        {mission.status === "assigned" && (
                          <Button
                            size="sm"
                            onClick={() => startMission(mission)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Begin Mission
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Radio className="w-4 h-4 mr-2" />
                          Contact Control
                        </Button>
                        <Button variant="outline" size="sm">
                          <Navigation className="w-4 h-4 mr-2" />
                          Set Course
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Mission Briefing Tab */}
          <TabsContent value="briefing" className="space-y-4">
            {selectedMission ? (
              <Card className="bg-gray-800 border-gray-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-blue-400">
                        {selectedMission.title}
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        Mission ID: {selectedMission.id}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={getClassificationColor(
                        selectedMission.classification,
                      )}
                    >
                      {selectedMission.classification}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-blue-400 font-medium mb-2">
                      Mission Briefing
                    </h4>
                    <p className="text-gray-300">{selectedMission.briefing}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-blue-400 font-medium mb-2">
                        Mission Parameters
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-blue-400 capitalize">
                            {selectedMission.type}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Estimated Duration:
                          </span>
                          <span className="text-blue-400">
                            {selectedMission.estimatedDuration} hours
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Difficulty:</span>
                          <div className="flex items-center space-x-1">
                            {getDifficultyStars(selectedMission.difficulty)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-blue-400 font-medium mb-2">
                        Mission Control
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Control Officer:
                          </span>
                          <span className="text-blue-400">
                            {selectedMission.missionControl.officer}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Contact:</span>
                          <span className="text-blue-400">
                            {selectedMission.missionControl.contact}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Frequency:</span>
                          <span className="text-blue-400">
                            {selectedMission.missionControl.frequency}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-blue-400 font-medium mb-2">
                      Mission Location
                    </h4>
                    <div className="bg-gray-700/50 p-4 rounded">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Sector:</span>
                          <p className="text-blue-400">
                            {selectedMission.location.sector}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">System:</span>
                          <p className="text-blue-400">
                            {selectedMission.location.system}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">Coordinates:</span>
                          <p className="text-blue-400">
                            {selectedMission.location.coordinates}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-blue-400 font-medium mb-2">
                      Risk Assessment
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-red-400 font-bold text-lg">
                          {selectedMission.risks.combat}/10
                        </div>
                        <div className="text-gray-400 text-sm">Combat</div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-400 font-bold text-lg">
                          {selectedMission.risks.diplomatic}/10
                        </div>
                        <div className="text-gray-400 text-sm">Diplomatic</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 font-bold text-lg">
                          {selectedMission.risks.technical}/10
                        </div>
                        <div className="text-gray-400 text-sm">Technical</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-400 font-bold text-lg">
                          {selectedMission.risks.environmental}/10
                        </div>
                        <div className="text-gray-400 text-sm">
                          Environmental
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-8 text-center">
                  <Eye className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-300">
                    No Mission Selected
                  </h3>
                  <p className="text-gray-400">
                    Select a mission from the Available tab to view detailed
                    briefing.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Completed Missions Tab */}
          <TabsContent value="completed" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8 text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2 text-gray-300">
                  No Completed Missions
                </h3>
                <p className="text-gray-400">
                  Your mission accomplishments will appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Mission Briefing Dialog */}
        {selectedMission && (
          <Dialog>
            <DialogContent className="max-w-4xl max-h-[80vh] bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-blue-400">
                  Mission Briefing: {selectedMission.title}
                </DialogTitle>
                <DialogDescription className="text-gray-300">
                  Classification: {selectedMission.classification.toUpperCase()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 max-h-96 overflow-y-auto">
                <div>
                  <h4 className="text-blue-400 font-medium mb-2">
                    Situation Report
                  </h4>
                  <p className="text-gray-300 text-sm">
                    {selectedMission.briefing}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-4 rounded">
                    <h5 className="text-blue-400 font-medium mb-2">
                      Objectives
                    </h5>
                    <div className="space-y-2">
                      {selectedMission.objectives.map((obj) => (
                        <div
                          key={obj.id}
                          className="flex items-start gap-2 text-sm"
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              obj.type === "primary"
                                ? "bg-blue-400"
                                : obj.type === "secondary"
                                  ? "bg-yellow-400"
                                  : "bg-green-400"
                            }`}
                          ></div>
                          <div>
                            <span className="text-gray-300">
                              {obj.description}
                            </span>
                            <div
                              className={`text-xs ${
                                obj.type === "primary"
                                  ? "text-blue-400"
                                  : obj.type === "secondary"
                                    ? "text-yellow-400"
                                    : "text-green-400"
                              }`}
                            >
                              {obj.type.charAt(0).toUpperCase() +
                                obj.type.slice(1)}{" "}
                              Objective
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-800 p-4 rounded">
                    <h5 className="text-blue-400 font-medium mb-2">
                      Mission Requirements
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Minimum Level:</span>
                        <span className="text-blue-400">
                          {selectedMission.requirements.minLevel}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Minimum Rank:</span>
                        <span className="text-blue-400">
                          {selectedMission.requirements.minRank}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Clearance Level:</span>
                        <span className="text-purple-400">
                          {selectedMission.requirements.clearanceLevel}
                        </span>
                      </div>
                      {selectedMission.requirements.shipClass && (
                        <div>
                          <span className="text-gray-400">Ship Classes:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedMission.requirements.shipClass.map(
                              (shipClass) => (
                                <Badge
                                  key={shipClass}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {shipClass}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                      {selectedMission.requirements.crewSpecialties && (
                        <div>
                          <span className="text-gray-400">
                            Required Specialists:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedMission.requirements.crewSpecialties.map(
                              (specialty) => (
                                <Badge
                                  key={specialty}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {specialty}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded">
                  <h5 className="text-blue-400 font-medium mb-2">
                    Mission Rewards
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-blue-400 font-bold">
                        {selectedMission.rewards.experience}
                      </div>
                      <div className="text-gray-400">Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-400 font-bold">
                        {selectedMission.rewards.credits}
                      </div>
                      <div className="text-gray-400">Credits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 font-bold">
                        {selectedMission.rewards.reputation}
                      </div>
                      <div className="text-gray-400">Reputation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 font-bold">
                        {selectedMission.rewards.commendations
                          ? selectedMission.rewards.commendations.length
                          : 0}
                      </div>
                      <div className="text-gray-400">Commendations</div>
                    </div>
                  </div>

                  {selectedMission.rewards.commendations &&
                    selectedMission.rewards.commendations.length > 0 && (
                      <div className="mt-3">
                        <span className="text-gray-400 text-sm">
                          Commendations:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedMission.rewards.commendations.map(
                            (commendation) => (
                              <Badge
                                key={commendation}
                                variant="outline"
                                className="text-xs text-green-400 border-green-400"
                              >
                                {commendation}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {selectedMission.rewards.equipment &&
                    selectedMission.rewards.equipment.length > 0 && (
                      <div className="mt-3">
                        <span className="text-gray-400 text-sm">
                          Equipment Rewards:
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedMission.rewards.equipment.map(
                            (equipment) => (
                              <Badge
                                key={equipment}
                                variant="outline"
                                className="text-xs text-blue-400 border-blue-400"
                              >
                                {equipment}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                </div>

                <div className="bg-red-900/20 border border-red-500/30 p-4 rounded">
                  <h5 className="text-red-400 font-medium mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Mission Risks and Hazards
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-red-400 font-bold text-lg">
                        {selectedMission.risks.combat}/10
                      </div>
                      <div className="text-gray-400">Combat Risk</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 font-bold text-lg">
                        {selectedMission.risks.diplomatic}/10
                      </div>
                      <div className="text-gray-400">Diplomatic Risk</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-bold text-lg">
                        {selectedMission.risks.technical}/10
                      </div>
                      <div className="text-gray-400">Technical Risk</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 font-bold text-lg">
                        {selectedMission.risks.environmental}/10
                      </div>
                      <div className="text-gray-400">Environmental Risk</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                  <div className="text-sm text-gray-400">
                    Mission Control: {selectedMission.missionControl.officer} •{" "}
                    {selectedMission.missionControl.frequency}
                  </div>
                  {selectedMission.status === "available" && (
                    <Button
                      onClick={() => {
                        acceptMission(selectedMission);
                        setSelectedMission(null);
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Accept Mission
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default EnhancedMissionSystem;
