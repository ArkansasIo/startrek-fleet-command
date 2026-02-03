import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import {
  Play,
  Pause,
  Square,
  RefreshCw,
  Target,
  Clock,
  Star,
  Trophy,
  AlertTriangle,
  CheckCircle,
  Lock,
  Map,
  Users,
  Zap,
  Shield,
} from "lucide-react";

interface StoryMissionsProps {
  activeSubmenu?: string;
}

interface MissionObjective {
  id: string;
  description: string;
  type: "primary" | "secondary" | "bonus";
  status: "pending" | "in-progress" | "completed" | "failed";
  progress: number;
  maxProgress: number;
  timeLimit?: number;
  requirements: string[];
  rewards: string[];
}

interface MissionChoice {
  id: string;
  text: string;
  consequences: string[];
  requirements?: string[];
  outcomes: {
    success: string;
    failure: string;
  };
}

interface MissionEvent {
  id: string;
  type:
    | "dialogue"
    | "combat"
    | "choice"
    | "exploration"
    | "puzzle"
    | "cutscene";
  title: string;
  description: string;
  characters?: string[];
  location?: string;
  choices?: MissionChoice[];
  timeLimit?: number;
  requiredSkills?: string[];
  difficulty: number;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  act: number;
  episode: number;
  chapter: number;
  type: "story" | "side" | "exploration" | "combat" | "diplomatic";
  status: "locked" | "available" | "in-progress" | "completed" | "failed";
  objectives: MissionObjective[];
  events: MissionEvent[];
  characters: string[];
  locations: string[];
  duration: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  prerequisites: string[];
  rewards: {
    experience: number;
    reputation: number;
    items: string[];
    achievements: string[];
  };
  choices: MissionChoice[];
  currentEvent?: number;
  startTime?: Date;
  score: number;
}

interface ActiveMissionSession {
  id: string;
  mission: Mission;
  currentEventIndex: number;
  status: "playing" | "paused" | "completed";
  startTime: Date;
  playTime: number;
  decisions: { [eventId: string]: string };
  objectiveProgress: { [objectiveId: string]: number };
}

const generateMission = (
  act: number,
  episode: number,
  chapter: number,
): Mission => {
  const missionTypes = [
    "story",
    "side",
    "exploration",
    "combat",
    "diplomatic",
  ] as const;
  const difficulties = ["Easy", "Medium", "Hard", "Expert"] as const;

  const getDifficulty = () => {
    if (act <= 3) return difficulties[Math.floor(Math.random() * 2)];
    if (act <= 6) return difficulties[1 + Math.floor(Math.random() * 2)];
    if (act <= 9) return difficulties[2 + Math.floor(Math.random() * 2)];
    return difficulties[3];
  };

  const generateObjectives = (): MissionObjective[] => {
    const objectives: MissionObjective[] = [
      {
        id: "primary-1",
        description: `Complete main mission parameters for Act ${act}, Episode ${episode}`,
        type: "primary",
        status: "pending",
        progress: 0,
        maxProgress: 100,
        requirements: ["Mission briefing completed"],
        rewards: ["Experience points", "Story progression"],
      },
      {
        id: "secondary-1",
        description: "Maintain crew morale above 75%",
        type: "secondary",
        status: "pending",
        progress: 0,
        maxProgress: 75,
        requirements: ["Leadership skills"],
        rewards: ["Crew loyalty bonus"],
      },
    ];

    if (Math.random() > 0.6) {
      objectives.push({
        id: "bonus-1",
        description: "Discover hidden location or secret",
        type: "bonus",
        status: "pending",
        progress: 0,
        maxProgress: 1,
        requirements: ["Exploration skills"],
        rewards: ["Bonus experience", "Hidden knowledge"],
      });
    }

    return objectives;
  };

  const generateEvents = (): MissionEvent[] => {
    const eventTypes = [
      "dialogue",
      "combat",
      "choice",
      "exploration",
      "puzzle",
      "cutscene",
    ] as const;
    const events: MissionEvent[] = [];

    for (let i = 0; i < 5 + Math.floor(Math.random() * 5); i++) {
      const eventType =
        eventTypes[Math.floor(Math.random() * eventTypes.length)];

      events.push({
        id: `event-${i + 1}`,
        type: eventType,
        title: generateEventTitle(eventType, i + 1),
        description: generateEventDescription(eventType, act, episode),
        characters: getEventCharacters(eventType),
        location: getEventLocation(act, episode),
        choices: eventType === "choice" ? generateChoices() : undefined,
        timeLimit: eventType === "combat" ? 300 : undefined,
        requiredSkills: getRequiredSkills(eventType),
        difficulty: Math.min(
          100,
          20 + act * 5 + Math.floor(Math.random() * 20),
        ),
      });
    }

    return events;
  };

  const generateChoices = (): MissionChoice[] => [
    {
      id: "choice-1",
      text: "Attempt diplomatic solution",
      consequences: ["Reputation +10", "Potential peaceful resolution"],
      requirements: ["Diplomacy skill level 3+"],
      outcomes: {
        success: "Negotiation successful, conflict avoided",
        failure: "Diplomatic talks break down, combat initiated",
      },
    },
    {
      id: "choice-2",
      text: "Prepare for tactical engagement",
      consequences: ["Combat readiness +25%", "Aggressive stance"],
      requirements: ["Tactical training"],
      outcomes: {
        success: "Strategic advantage gained",
        failure: "Surprise attack vulnerability",
      },
    },
    {
      id: "choice-3",
      text: "Seek more information first",
      consequences: ["Time -10 minutes", "Intelligence +15%"],
      requirements: ["Science or Intelligence skills"],
      outcomes: {
        success: "Critical information discovered",
        failure: "Time wasted, situation escalates",
      },
    },
  ];

  return {
    id: `mission-${act}-${episode}-${chapter}`,
    title: generateMissionTitle(act, episode, chapter),
    description: generateMissionDescription(act, episode, chapter),
    act,
    episode,
    chapter,
    type: missionTypes[Math.floor(Math.random() * missionTypes.length)],
    status:
      act === 1 && episode === 1 && chapter === 1 ? "available" : "locked",
    objectives: generateObjectives(),
    events: generateEvents(),
    characters: ["captain-nova", "commander-thresh", "dr-kalar", "lt-vex"],
    locations: [`Location-${act}-${episode}`, "USS Horizon"],
    duration: 30 + Math.floor(Math.random() * 60),
    difficulty: getDifficulty(),
    prerequisites:
      act === 1 && episode === 1 && chapter === 1
        ? []
        : [`mission-${act}-${episode}-${chapter - 1}`],
    rewards: {
      experience: 100 * act + 50 * episode + 25 * chapter,
      reputation: 10 * act,
      items: [`Item-${act}-${episode}-${chapter}`],
      achievements:
        chapter === 10 ? [`Episode-${act}-${episode}-Complete`] : [],
    },
    choices: generateChoices(),
    score: 0,
  };
};

const generateMissionTitle = (
  act: number,
  episode: number,
  chapter: number,
): string => {
  const prefixes = [
    "Operation",
    "Mission",
    "Objective",
    "Protocol",
    "Assignment",
  ];
  const subjects = [
    "Phoenix",
    "Horizon",
    "Genesis",
    "Omega",
    "Alpha",
    "Delta",
    "Gamma",
    "Beta",
  ];
  const suffixes = [
    "Prime",
    "Alpha",
    "Zero",
    "One",
    "Final",
    "Critical",
    "Emergency",
    "Priority",
  ];

  return `${prefixes[act % prefixes.length]} ${subjects[episode % subjects.length]} ${suffixes[chapter % suffixes.length]}`;
};

const generateMissionDescription = (
  act: number,
  episode: number,
  chapter: number,
): string => {
  return `Critical mission in Act ${act}, Episode ${episode}, Chapter ${chapter}. The crew faces new challenges that will test their skills, resolve, and unity as they continue their journey through the Delta Quadrant.`;
};

const generateEventTitle = (type: string, index: number): string => {
  const titles = {
    dialogue: [
      `First Contact Protocol ${index}`,
      `Diplomatic Exchange ${index}`,
      `Crew Briefing ${index}`,
    ],
    combat: [
      `Hostile Encounter ${index}`,
      `Defensive Action ${index}`,
      `Tactical Engagement ${index}`,
    ],
    choice: [
      `Critical Decision ${index}`,
      `Command Choice ${index}`,
      `Strategic Option ${index}`,
    ],
    exploration: [
      `Survey Mission ${index}`,
      `Reconnaissance ${index}`,
      `Discovery Phase ${index}`,
    ],
    puzzle: [
      `Technical Challenge ${index}`,
      `System Analysis ${index}`,
      `Problem Resolution ${index}`,
    ],
    cutscene: [
      `Mission Briefing ${index}`,
      `Story Development ${index}`,
      `Character Moment ${index}`,
    ],
  };

  return titles[type as keyof typeof titles][0] || `Event ${index}`;
};

const generateEventDescription = (
  type: string,
  act: number,
  episode: number,
): string => {
  const descriptions = {
    dialogue:
      "Engage in critical communication with alien species or crew members.",
    combat:
      "Face hostile forces in tactical combat requiring strategy and skill.",
    choice:
      "Make a crucial decision that will impact the mission and story progression.",
    exploration: "Explore unknown territories and discover new phenomena.",
    puzzle:
      "Solve complex technical or logical challenges using crew expertise.",
    cutscene: "Experience key story moments and character development.",
  };

  return (
    descriptions[type as keyof typeof descriptions] ||
    "Mission event requiring player participation."
  );
};

const getEventCharacters = (type: string): string[] => {
  const baseCharacters = ["captain-nova"];
  if (type === "dialogue" || type === "choice")
    return [...baseCharacters, "commander-thresh", "dr-kalar"];
  if (type === "combat") return [...baseCharacters, "chief-korvak"];
  if (type === "exploration" || type === "puzzle")
    return [...baseCharacters, "lt-vex"];
  return baseCharacters;
};

const getEventLocation = (act: number, episode: number): string => {
  const locations = [
    "USS Horizon Bridge",
    "Alien Homeworld",
    "Space Station",
    "Asteroid Field",
    "Nebula Interior",
    "Ancient Ruins",
    "Diplomatic Chamber",
    "Engineering Section",
  ];

  return locations[Math.floor(Math.random() * locations.length)];
};

const getRequiredSkills = (type: string): string[] => {
  const skills = {
    dialogue: ["Diplomacy", "Cultural Understanding"],
    combat: ["Tactical Analysis", "Weapons Systems"],
    choice: ["Leadership", "Strategic Thinking"],
    exploration: ["Science", "Navigation"],
    puzzle: ["Engineering", "Problem Solving"],
    cutscene: [],
  };

  return skills[type as keyof typeof skills] || [];
};

export default function StoryMissions({ activeSubmenu }: StoryMissionsProps) {
  const normalizeSubmenu = (submenu?: string) => {
    const allowed = new Set(["missions", "progress", "achievements"]);
    return submenu && allowed.has(submenu) ? submenu : "missions";
  };

  const [activeTab, setActiveTab] = useState(normalizeSubmenu(activeSubmenu));
  const [missions] = useState<Mission[]>(() => {
    const allMissions: Mission[] = [];
    for (let act = 1; act <= 12; act++) {
      for (let episode = 1; episode <= 30; episode++) {
        for (let chapter = 1; chapter <= 10; chapter++) {
          allMissions.push(generateMission(act, episode, chapter));
        }
      }
    }
    return allMissions.slice(0, 50); // Show first 50 for performance
  });

  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [activeSession, setActiveSession] =
    useState<ActiveMissionSession | null>(null);
  const [filterAct, setFilterAct] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setActiveTab(normalizeSubmenu(activeSubmenu));
  }, [activeSubmenu]);

  const filteredMissions = missions.filter((mission) => {
    const matchesSearch =
      mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAct =
      filterAct === "All" || mission.act.toString() === filterAct;
    const matchesType = filterType === "All" || mission.type === filterType;
    const matchesStatus =
      filterStatus === "All" || mission.status === filterStatus;

    return matchesSearch && matchesAct && matchesType && matchesStatus;
  });

  const startMission = (mission: Mission) => {
    const session: ActiveMissionSession = {
      id: `session-${Date.now()}`,
      mission: { ...mission, status: "in-progress" },
      currentEventIndex: 0,
      status: "playing",
      startTime: new Date(),
      playTime: 0,
      decisions: {},
      objectiveProgress: mission.objectives.reduce(
        (acc, obj) => {
          acc[obj.id] = 0;
          return acc;
        },
        {} as { [key: string]: number },
      ),
    };

    setActiveSession(session);
  };

  const pauseMission = () => {
    if (activeSession) {
      setActiveSession({
        ...activeSession,
        status: activeSession.status === "playing" ? "paused" : "playing",
      });
    }
  };

  const endMission = () => {
    setActiveSession(null);
  };

  const makeChoice = (choiceId: string) => {
    if (!activeSession) return;

    const currentEvent =
      activeSession.mission.events[activeSession.currentEventIndex];
    setActiveSession({
      ...activeSession,
      decisions: {
        ...activeSession.decisions,
        [currentEvent.id]: choiceId,
      },
      currentEventIndex: Math.min(
        activeSession.currentEventIndex + 1,
        activeSession.mission.events.length - 1,
      ),
    });
  };

  const updateObjectiveProgress = (objectiveId: string, progress: number) => {
    if (!activeSession) return;

    setActiveSession({
      ...activeSession,
      objectiveProgress: {
        ...activeSession.objectiveProgress,
        [objectiveId]: progress,
      },
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "locked":
        return <Lock className="w-4 h-4 text-gray-500" />;
      case "available":
        return <Play className="w-4 h-4 text-blue-400" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Lock className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400";
      case "Medium":
        return "text-yellow-400";
      case "Hard":
        return "text-orange-400";
      case "Expert":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "story":
        return "text-blue-400";
      case "side":
        return "text-green-400";
      case "exploration":
        return "text-purple-400";
      case "combat":
        return "text-red-400";
      case "diplomatic":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-blue-400">STORY MISSIONS</h1>
        <p className="text-xl text-gray-300">
          Interactive Mission System & Gameplay Engine
        </p>
      </div>

      {!activeSession ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="missions">Available Missions</TabsTrigger>
            <TabsTrigger value="progress">Mission Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="missions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search missions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800/50 border-blue-500/30"
              />
              <Select value={filterAct} onValueChange={setFilterAct}>
                <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                  <SelectValue placeholder="Act" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Acts</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i} value={(i + 1).toString()}>
                      Act {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="side">Side Mission</SelectItem>
                  <SelectItem value="exploration">Exploration</SelectItem>
                  <SelectItem value="combat">Combat</SelectItem>
                  <SelectItem value="diplomatic">Diplomatic</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="locked">Locked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMissions.map((mission) => (
                <Card
                  key={mission.id}
                  className="bg-gray-800/30 border-blue-500/30 hover:border-blue-400/50 transition-colors"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-blue-400">
                          {mission.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Act {mission.act}, Ep {mission.episode}, Ch{" "}
                            {mission.chapter}
                          </Badge>
                        </div>
                      </div>
                      {getStatusIcon(mission.status)}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getTypeColor(mission.type)}`}
                      >
                        {mission.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getDifficultyColor(mission.difficulty)}`}
                      >
                        {mission.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {mission.duration}m
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-300">
                      {mission.description}
                    </p>

                    <div className="space-y-2">
                      <h5 className="text-sm font-semibold text-blue-400">
                        Objectives
                      </h5>
                      <div className="space-y-1">
                        {mission.objectives.slice(0, 2).map((objective) => (
                          <div
                            key={objective.id}
                            className="flex items-center space-x-2 text-xs"
                          >
                            <Target className="w-3 h-3 text-blue-400 flex-shrink-0" />
                            <span className="text-gray-300">
                              {objective.description}
                            </span>
                          </div>
                        ))}
                        {mission.objectives.length > 2 && (
                          <div className="text-xs text-blue-400">
                            +{mission.objectives.length - 2} more objectives
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{mission.events.length} Events</span>
                      <span>{mission.characters.length} Characters</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedMission(mission)}
                      >
                        Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => startMission(mission)}
                        disabled={mission.status !== "available"}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-800/30 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Mission Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Missions:</span>
                      <span className="text-blue-400">{missions.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Available:</span>
                      <span className="text-green-400">
                        {
                          missions.filter((m) => m.status === "available")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Completed:</span>
                      <span className="text-blue-400">
                        {
                          missions.filter((m) => m.status === "completed")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>In Progress:</span>
                      <span className="text-yellow-400">
                        {
                          missions.filter((m) => m.status === "in-progress")
                            .length
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/30 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Experience Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        1,250
                      </div>
                      <div className="text-sm text-gray-400">
                        Total XP Earned
                      </div>
                    </div>
                    <Progress value={65} className="h-3" />
                    <div className="text-sm text-center text-gray-400">
                      Level 5 → Level 6 (350/500 XP)
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/30 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Reputation Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Federation:</span>
                      <span className="text-green-400">Honored</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delta Alliance:</span>
                      <span className="text-blue-400">Friendly</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Klingon Empire:</span>
                      <span className="text-yellow-400">Neutral</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shadow Coalition:</span>
                      <span className="text-red-400">Hostile</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400">
                  Recent Mission Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">
                      Completed "Operation Phoenix Prime" - Act 1, Episode 1,
                      Chapter 1
                    </span>
                    <span className="text-gray-500 ml-auto">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">
                      Started "Mission Horizon Alpha" - Act 1, Episode 1,
                      Chapter 2
                    </span>
                    <span className="text-gray-500 ml-auto">4 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Trophy className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">
                      Earned achievement "First Contact Specialist"
                    </span>
                    <span className="text-gray-500 ml-auto">1 day ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-gray-800/30 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                    First Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">
                    Successfully complete your first diplomatic mission.
                  </p>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-green-400">
                      Completed
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/30 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-gray-500" />
                    Battle Commander
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">
                    Win 10 tactical combat encounters.
                  </p>
                  <div className="mt-2">
                    <Progress value={30} className="h-2 mb-2" />
                    <div className="text-xs text-gray-400">3/10 victories</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/30 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-gray-500" />
                    Explorer Elite
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">
                    Discover 25 new locations in the Delta Quadrant.
                  </p>
                  <div className="mt-2">
                    <Progress value={12} className="h-2 mb-2" />
                    <div className="text-xs text-gray-400">3/25 locations</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/30 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-gray-500" />
                    Shadow Vanquisher
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">
                    Defeat the Shadow Emperor and save the galaxy.
                  </p>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-gray-500">
                      Locked
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/30 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                    Crew Unity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">
                    Maintain maximum crew morale for 5 consecutive missions.
                  </p>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-green-400">
                      Completed
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/30 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-gray-500" />
                    Master Strategist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">
                    Complete all missions in an act with perfect scores.
                  </p>
                  <div className="mt-2">
                    <Progress value={80} className="h-2 mb-2" />
                    <div className="text-xs text-gray-400">
                      8/10 perfect missions
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-400">
                {activeSession.mission.title}
              </h2>
              <p className="text-gray-400">
                Act {activeSession.mission.act}, Episode{" "}
                {activeSession.mission.episode}, Chapter{" "}
                {activeSession.mission.chapter}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={pauseMission}>
                {activeSession.status === "playing" ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              <Button variant="outline" onClick={endMission}>
                <Square className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {activeSession.currentEventIndex <
                activeSession.mission.events.length && (
                <Card className="bg-gray-800/30 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-blue-400">
                      {
                        activeSession.mission.events[
                          activeSession.currentEventIndex
                        ].title
                      }
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {
                          activeSession.mission.events[
                            activeSession.currentEventIndex
                          ].type
                        }
                      </Badge>
                      <Badge variant="outline">
                        Event {activeSession.currentEventIndex + 1} of{" "}
                        {activeSession.mission.events.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300">
                      {
                        activeSession.mission.events[
                          activeSession.currentEventIndex
                        ].description
                      }
                    </p>

                    {activeSession.mission.events[
                      activeSession.currentEventIndex
                    ].choices && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-blue-400">
                          Choose your action:
                        </h4>
                        <div className="space-y-2">
                          {activeSession.mission.events[
                            activeSession.currentEventIndex
                          ].choices!.map((choice) => (
                            <Button
                              key={choice.id}
                              variant="outline"
                              className="w-full text-left justify-start h-auto p-4"
                              onClick={() => makeChoice(choice.id)}
                            >
                              <div>
                                <div className="font-semibold">
                                  {choice.text}
                                </div>
                                <div className="text-sm text-gray-400 mt-1">
                                  {choice.consequences.join(", ")}
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSession.mission.events[
                      activeSession.currentEventIndex
                    ].type === "combat" && (
                      <div className="space-y-4">
                        <div className="bg-red-900/20 p-4 rounded border border-red-500/30">
                          <h4 className="font-semibold text-red-400 mb-2">
                            Combat Engagement
                          </h4>
                          <div className="grid grid-cols-3 gap-4">
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Zap className="w-4 h-4 mr-1" />
                              Attack
                            </Button>
                            <Button size="sm" variant="outline">
                              <Shield className="w-4 h-4 mr-1" />
                              Defend
                            </Button>
                            <Button size="sm" variant="outline">
                              <Target className="w-4 h-4 mr-1" />
                              Tactical
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setActiveSession({
                            ...activeSession,
                            currentEventIndex: Math.max(
                              0,
                              activeSession.currentEventIndex - 1,
                            ),
                          })
                        }
                        disabled={activeSession.currentEventIndex === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          setActiveSession({
                            ...activeSession,
                            currentEventIndex: Math.min(
                              activeSession.mission.events.length - 1,
                              activeSession.currentEventIndex + 1,
                            ),
                          })
                        }
                        disabled={
                          activeSession.currentEventIndex ===
                          activeSession.mission.events.length - 1
                        }
                      >
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <Card className="bg-gray-800/30 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400">
                    Mission Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeSession.mission.objectives.map((objective) => (
                      <div key={objective.id} className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <div
                            className={`mt-1 w-3 h-3 rounded-full ${
                              objective.type === "primary"
                                ? "bg-blue-400"
                                : objective.type === "secondary"
                                  ? "bg-yellow-400"
                                  : "bg-green-400"
                            }`}
                          />
                          <div className="flex-1">
                            <div className="text-sm text-gray-300">
                              {objective.description}
                            </div>
                            <Progress
                              value={
                                (activeSession.objectiveProgress[objective.id] /
                                  objective.maxProgress) *
                                100
                              }
                              className="h-2 mt-1"
                            />
                            <div className="text-xs text-gray-400 mt-1">
                              {activeSession.objectiveProgress[objective.id]}/
                              {objective.maxProgress}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/30 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400">
                    Mission Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Event Progress</span>
                        <span>
                          {activeSession.currentEventIndex + 1}/
                          {activeSession.mission.events.length}
                        </span>
                      </div>
                      <Progress
                        value={
                          ((activeSession.currentEventIndex + 1) /
                            activeSession.mission.events.length) *
                          100
                        }
                      />
                    </div>

                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Mission Time:</span>
                        <span>
                          {Math.floor(activeSession.playTime / 60)}:
                          {(activeSession.playTime % 60)
                            .toString()
                            .padStart(2, "0")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Score:</span>
                        <span className="text-blue-400">
                          {activeSession.mission.score}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {selectedMission && !activeSession && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-900 border-blue-500/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-blue-400">
                    {selectedMission.title}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">Act {selectedMission.act}</Badge>
                    <Badge variant="outline">
                      Episode {selectedMission.episode}
                    </Badge>
                    <Badge variant="outline">
                      Chapter {selectedMission.chapter}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getTypeColor(selectedMission.type)}
                    >
                      {selectedMission.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getDifficultyColor(selectedMission.difficulty)}
                    >
                      {selectedMission.difficulty}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedMission(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-300">{selectedMission.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">
                      Mission Objectives
                    </h4>
                    <div className="space-y-2">
                      {selectedMission.objectives.map((objective) => (
                        <div
                          key={objective.id}
                          className="flex items-start space-x-2"
                        >
                          <div
                            className={`mt-1 w-3 h-3 rounded-full ${
                              objective.type === "primary"
                                ? "bg-blue-400"
                                : objective.type === "secondary"
                                  ? "bg-yellow-400"
                                  : "bg-green-400"
                            }`}
                          />
                          <span className="text-sm text-gray-300">
                            {objective.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">
                      Mission Events
                    </h4>
                    <div className="text-sm text-gray-400">
                      {selectedMission.events.length} interactive events
                      including:
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[
                        ...new Set(selectedMission.events.map((e) => e.type)),
                      ].map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">
                      Characters
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMission.characters.map((characterId) => (
                        <Badge
                          key={characterId}
                          variant="outline"
                          className="text-sm"
                        >
                          {characterId
                            .replace("-", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">
                      Locations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMission.locations.map((location, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-sm"
                        >
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">
                      Rewards
                    </h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <div>
                        Experience: {selectedMission.rewards.experience} XP
                      </div>
                      <div>
                        Reputation: +{selectedMission.rewards.reputation}
                      </div>
                      <div>
                        Items: {selectedMission.rewards.items.join(", ")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => {
                    startMission(selectedMission);
                    setSelectedMission(null);
                  }}
                  className="flex-1"
                  disabled={selectedMission.status !== "available"}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Mission
                </Button>
                <Button variant="outline" className="flex-1">
                  <Map className="w-4 h-4 mr-2" />
                  Mission Briefing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
