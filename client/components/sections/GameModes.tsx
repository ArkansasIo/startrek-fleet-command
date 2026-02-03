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
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Progress } from "../ui/progress";
import {
  Users,
  User,
  Gamepad2,
  Target,
  Globe,
  Zap,
  Shield,
  Trophy,
  Clock,
  Star,
  Settings,
  Play,
  Pause,
} from "lucide-react";

interface GameModesProps {
  activeSubmenu?: string;
}

interface GameMode {
  id: string;
  name: string;
  type: "single" | "multiplayer" | "cooperative";
  category: string;
  description: string;
  objectives: string[];
  features: string[];
  playerCount: {
    min: number;
    max: number;
  };
  timeLimit?: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert" | "Legendary";
  rewards: string[];
  requirements: string[];
}

interface ActiveSession {
  id: string;
  gameMode: GameMode;
  players: Player[];
  status: "waiting" | "in-progress" | "paused" | "completed";
  startTime: Date;
  score: number;
  objectives: { [key: string]: boolean };
}

interface Player {
  id: string;
  name: string;
  rank: string;
  division: string;
  experience: number;
  achievements: string[];
  online: boolean;
}

const gameCategories = [
  "Combat Simulation",
  "Exploration",
  "Diplomacy",
  "Engineering",
  "Command Training",
  "Scientific Research",
  "Tactical Operations",
  "Special Missions",
];

const gameModes: GameMode[] = [
  {
    id: "bridge-command",
    name: "Bridge Command Simulation",
    type: "multiplayer",
    category: "Command Training",
    description:
      "Take command of a starship bridge with a full crew. Each player takes a station - Captain, Tactical, Engineering, Science, and Operations.",
    objectives: [
      "Complete assigned mission parameters",
      "Maintain crew coordination",
      "Achieve mission objectives within time limit",
      "Minimize casualties and damage",
    ],
    features: [
      "Real-time crew coordination",
      "Voice communication system",
      "Multiple bridge configurations",
      "Dynamic crisis scenarios",
      "Performance analytics",
    ],
    playerCount: { min: 3, max: 7 },
    timeLimit: 45,
    difficulty: "Medium",
    rewards: [
      "Command Experience",
      "Leadership Certification",
      "Crew Coordination Badge",
    ],
    requirements: ["Basic Starfleet Training", "Communication Equipment"],
  },
  {
    id: "borg-encounter",
    name: "Borg Collective Encounter",
    type: "cooperative",
    category: "Combat Simulation",
    description:
      "Face the ultimate test against the Borg Collective. Work together to survive assimilation and protect the Federation.",
    objectives: [
      "Resist Borg assimilation attempts",
      "Protect civilian vessels",
      "Discover Borg vulnerabilities",
      "Coordinate fleet tactics",
    ],
    features: [
      "Adaptive Borg AI",
      "Assimilation mechanics",
      "Fleet coordination",
      "Technology adaptation",
      "Epic boss encounters",
    ],
    playerCount: { min: 2, max: 12 },
    timeLimit: 60,
    difficulty: "Expert",
    rewards: [
      "Borg Resistance Medal",
      "Tactical Innovation Award",
      "Collective Survivor Badge",
    ],
    requirements: [
      "Advanced Combat Training",
      "Team Coordination Certification",
    ],
  },
  {
    id: "exploration-alpha",
    name: "Deep Space Exploration",
    type: "single",
    category: "Exploration",
    description:
      "Lead a solo exploration mission into uncharted space. Discover new worlds, contact alien civilizations, and expand the Federation's knowledge.",
    objectives: [
      "Chart unknown star systems",
      "Establish first contact protocols",
      "Catalog scientific discoveries",
      "Maintain diplomatic relations",
    ],
    features: [
      "Procedurally generated systems",
      "First contact scenarios",
      "Scientific research mini-games",
      "Resource management",
      "Discovery journal",
    ],
    playerCount: { min: 1, max: 1 },
    difficulty: "Medium",
    rewards: [
      "Explorer's Commendation",
      "Scientific Discovery Award",
      "First Contact Ribbon",
    ],
    requirements: ["Science Training", "Diplomatic Protocols Certification"],
  },
  {
    id: "kobayashi-maru",
    name: "Kobayashi Maru Scenario",
    type: "single",
    category: "Command Training",
    description:
      "Face the infamous no-win scenario. Test your character and decision-making under impossible circumstances.",
    objectives: [
      "Attempt rescue of civilian vessel",
      "Navigate impossible tactical situation",
      "Demonstrate leadership under pressure",
      "Accept consequences of decisions",
    ],
    features: [
      "No-win scenario design",
      "Character assessment",
      "Multiple approach options",
      "Psychological evaluation",
      "Leadership analysis",
    ],
    playerCount: { min: 1, max: 1 },
    timeLimit: 30,
    difficulty: "Legendary",
    rewards: [
      "Character Assessment",
      "Leadership Evaluation",
      "Maru Veteran Status",
    ],
    requirements: ["Command Track Enrollment", "Advanced Tactical Training"],
  },
  {
    id: "dominion-war",
    name: "Dominion War Campaign",
    type: "multiplayer",
    category: "Tactical Operations",
    description:
      "Relive the greatest conflict in Federation history. Command fleets in massive battles across multiple fronts.",
    objectives: [
      "Coordinate multi-fleet operations",
      "Secure strategic objectives",
      "Manage resources and supplies",
      "Maintain alliance cohesion",
    ],
    features: [
      "Large-scale fleet battles",
      "Strategic resource management",
      "Multiple faction gameplay",
      "Historical accuracy",
      "Campaign progression",
    ],
    playerCount: { min: 4, max: 20 },
    timeLimit: 120,
    difficulty: "Hard",
    rewards: [
      "War Veteran Status",
      "Fleet Command Badge",
      "Strategic Excellence Award",
    ],
    requirements: [
      "Fleet Command Certification",
      "Strategic Operations Training",
    ],
  },
  {
    id: "peace-negotiations",
    name: "Diplomatic Peace Summit",
    type: "multiplayer",
    category: "Diplomacy",
    description:
      "Navigate complex interstellar politics to broker peace between warring factions. Every word matters.",
    objectives: [
      "Understand faction motivations",
      "Find common ground solutions",
      "Negotiate treaty terms",
      "Prevent diplomatic incidents",
    ],
    features: [
      "Complex dialogue trees",
      "Faction relationship tracking",
      "Cultural sensitivity mechanics",
      "Real-time negotiation",
      "Consequence simulation",
    ],
    playerCount: { min: 3, max: 8 },
    timeLimit: 90,
    difficulty: "Hard",
    rewards: [
      "Diplomatic Excellence Medal",
      "Peace Broker Certification",
      "Cultural Ambassador Badge",
    ],
    requirements: [
      "Diplomatic Corps Training",
      "Cultural Studies Certification",
    ],
  },
  {
    id: "engineering-crisis",
    name: "Engineering Emergency Response",
    type: "cooperative",
    category: "Engineering",
    description:
      "Work together to prevent catastrophic system failures. Time is running out and the stakes are life and death.",
    objectives: [
      "Diagnose critical system failures",
      "Coordinate repair efforts",
      "Prevent cascade failures",
      "Restore full functionality",
    ],
    features: [
      "Real-time system diagnostics",
      "Collaborative problem solving",
      "Technical challenge mini-games",
      "Emergency protocols",
      "Team coordination tools",
    ],
    playerCount: { min: 2, max: 6 },
    timeLimit: 25,
    difficulty: "Hard",
    rewards: [
      "Emergency Response Certification",
      "Engineering Excellence Award",
      "Crisis Management Badge",
    ],
    requirements: ["Engineering Fundamentals", "Emergency Procedures Training"],
  },
  {
    id: "scientific-discovery",
    name: "Quantum Research Project",
    type: "single",
    category: "Scientific Research",
    description:
      "Conduct groundbreaking research into quantum mechanics and temporal anomalies. Push the boundaries of known science.",
    objectives: [
      "Conduct controlled experiments",
      "Analyze quantum data patterns",
      "Develop new theoretical models",
      "Publish research findings",
    ],
    features: [
      "Complex scientific simulations",
      "Research methodology gameplay",
      "Data analysis challenges",
      "Theoretical model building",
      "Peer review system",
    ],
    playerCount: { min: 1, max: 1 },
    timeLimit: 60,
    difficulty: "Expert",
    rewards: [
      "Scientific Breakthrough Award",
      "Research Excellence Medal",
      "Quantum Theory Certification",
    ],
    requirements: [
      "Advanced Science Training",
      "Quantum Mechanics Certification",
    ],
  },
];

const mockPlayers: Player[] = [
  {
    id: "player-1",
    name: "Jean-Luc Picard",
    rank: "Captain",
    division: "Command",
    experience: 2500,
    achievements: ["Diplomat", "Explorer", "Tactician"],
    online: true,
  },
  {
    id: "player-2",
    name: "Data",
    rank: "Lieutenant Commander",
    division: "Science",
    experience: 1800,
    achievements: ["Researcher", "Analyst", "Innovator"],
    online: true,
  },
  {
    id: "player-3",
    name: "Worf",
    rank: "Lieutenant",
    division: "Security",
    experience: 1200,
    achievements: ["Warrior", "Guardian", "Honor Guard"],
    online: false,
  },
  {
    id: "player-4",
    name: "Geordi La Forge",
    rank: "Lieutenant Commander",
    division: "Engineering",
    experience: 1600,
    achievements: ["Engineer", "Problem Solver", "Innovator"],
    online: true,
  },
];

export default function GameModes({ activeSubmenu }: GameModesProps) {
  const normalizeSubmenu = (submenu?: string) => {
    const allowed = new Set(["modes", "sessions", "create", "statistics"]);
    return submenu && allowed.has(submenu) ? submenu : "modes";
  };

  const [activeTab, setActiveTab] = useState(normalizeSubmenu(activeSubmenu));
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [playerCount, setPlayerCount] = useState(1);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [sessionSettings, setSessionSettings] = useState({
    name: "",
    description: "",
    password: "",
    publicSession: true,
    allowSpectators: true,
    recordSession: false,
  });

  useEffect(() => {
    setActiveTab(normalizeSubmenu(activeSubmenu));
  }, [activeSubmenu]);

  const filteredModes = gameModes.filter((mode) => {
    const matchesSearch =
      mode.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mode.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || mode.type === filterType;
    const matchesCategory =
      filterCategory === "All" || mode.category === filterCategory;
    const matchesDifficulty =
      filterDifficulty === "All" || mode.difficulty === filterDifficulty;
    const matchesPlayerCount =
      playerCount >= mode.playerCount.min &&
      playerCount <= mode.playerCount.max;

    return (
      matchesSearch &&
      matchesType &&
      matchesCategory &&
      matchesDifficulty &&
      matchesPlayerCount
    );
  });

  const createSession = (mode: GameMode) => {
    const session: ActiveSession = {
      id: `session-${Date.now()}`,
      gameMode: mode,
      players: selectedPlayers,
      status: "waiting",
      startTime: new Date(),
      score: 0,
      objectives: mode.objectives.reduce(
        (acc, obj, index) => {
          acc[`obj-${index}`] = false;
          return acc;
        },
        {} as { [key: string]: boolean },
      ),
    };

    setActiveSessions([...activeSessions, session]);
    setSelectedMode(null);
    setSelectedPlayers([]);
  };

  const joinSession = (sessionId: string) => {
    setActiveSessions(
      activeSessions.map((session) => {
        if (
          session.id === sessionId &&
          session.players.length < session.gameMode.playerCount.max
        ) {
          return {
            ...session,
            players: [...session.players, mockPlayers[0]], // Add current player
          };
        }
        return session;
      }),
    );
  };

  const startSession = (sessionId: string) => {
    setActiveSessions(
      activeSessions.map((session) =>
        session.id === sessionId
          ? { ...session, status: "in-progress" }
          : session,
      ),
    );
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
      case "Legendary":
        return "text-purple-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "waiting":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "in-progress":
        return <Play className="w-4 h-4 text-green-400" />;
      case "paused":
        return <Pause className="w-4 h-4 text-orange-400" />;
      case "completed":
        return <Trophy className="w-4 h-4 text-blue-400" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-blue-400">GAME MODES SYSTEM</h1>
        <p className="text-xl text-gray-300">
          Single Player & Multiplayer Training Simulations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="modes">Game Modes</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="create">Create Session</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="modes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              placeholder="Search game modes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800/50 border-blue-500/30"
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="single">Single Player</SelectItem>
                <SelectItem value="multiplayer">Multiplayer</SelectItem>
                <SelectItem value="cooperative">Cooperative</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {gameCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterDifficulty}
              onValueChange={setFilterDifficulty}
            >
              <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Difficulties</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
                <SelectItem value="Legendary">Legendary</SelectItem>
              </SelectContent>
            </Select>
            <div className="space-y-2">
              <Label>Players: {playerCount}</Label>
              <Slider
                value={[playerCount]}
                onValueChange={(value) => setPlayerCount(value[0])}
                max={20}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModes.map((mode) => (
              <Card
                key={mode.id}
                className="bg-gray-800/30 border-blue-500/30 hover:border-blue-400/50 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-blue-400">
                      {mode.name}
                    </CardTitle>
                    <div className="flex items-center space-x-1">
                      {mode.type === "single" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Users className="w-4 h-4" />
                      )}
                      <span className="text-xs">
                        {mode.playerCount.min}-{mode.playerCount.max}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {mode.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {mode.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getDifficultyColor(mode.difficulty)}`}
                    >
                      {mode.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-300">{mode.description}</p>

                  {mode.timeLimit && (
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>Time Limit: {mode.timeLimit} minutes</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h5 className="text-sm font-semibold text-blue-400">
                      Objectives
                    </h5>
                    <ul className="text-xs text-gray-300 space-y-1">
                      {mode.objectives.slice(0, 2).map((objective, index) => (
                        <li key={index} className="flex items-start space-x-1">
                          <Target className="w-3 h-3 mt-0.5 text-blue-400 flex-shrink-0" />
                          <span>{objective}</span>
                        </li>
                      ))}
                      {mode.objectives.length > 2 && (
                        <li className="text-blue-400">
                          +{mode.objectives.length - 2} more...
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedMode(mode)}
                    >
                      Details
                    </Button>
                    <Button size="sm" onClick={() => setSelectedMode(mode)}>
                      <Play className="w-3 h-3 mr-1" />
                      Play
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-blue-400">
              Active Game Sessions
            </h3>
            <Badge variant="outline" className="text-blue-400">
              {activeSessions.length} Active
            </Badge>
          </div>

          {activeSessions.length === 0 ? (
            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardContent className="text-center py-8">
                <Gamepad2 className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">
                  No active sessions. Create or join a game to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSessions.map((session) => (
                <Card
                  key={session.id}
                  className="bg-gray-800/30 border-blue-500/30"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg text-blue-400">
                        {session.gameMode.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(session.status)}
                        <span className="text-sm capitalize">
                          {session.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>
                          {session.players.length}/
                          {session.gameMode.playerCount.max}
                        </span>
                      </div>
                      {session.status === "in-progress" && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>Score: {session.score}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <h5 className="text-sm font-semibold text-blue-400">
                        Players
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {session.players.map((player) => (
                          <Badge
                            key={player.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {player.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {session.status === "in-progress" && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-semibold text-blue-400">
                          Objectives Progress
                        </h5>
                        <div className="space-y-1">
                          {session.gameMode.objectives.map(
                            (objective, index) => {
                              const completed =
                                session.objectives[`obj-${index}`];
                              return (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2 text-xs"
                                >
                                  <div
                                    className={`w-3 h-3 rounded-full ${completed ? "bg-green-400" : "bg-gray-600"}`}
                                  />
                                  <span
                                    className={
                                      completed
                                        ? "text-green-400"
                                        : "text-gray-400"
                                    }
                                  >
                                    {objective}
                                  </span>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      {session.status === "waiting" &&
                        session.players.length <
                          session.gameMode.playerCount.max && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => joinSession(session.id)}
                          >
                            Join
                          </Button>
                        )}
                      {session.status === "waiting" &&
                        session.players.length >=
                          session.gameMode.playerCount.min && (
                          <Button
                            size="sm"
                            onClick={() => startSession(session.id)}
                          >
                            Start
                          </Button>
                        )}
                      {session.status === "in-progress" && (
                        <Button size="sm" variant="outline">
                          Spectate
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card className="bg-gray-800/30 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400">
                Create New Game Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session-name">Session Name</Label>
                  <Input
                    id="session-name"
                    value={sessionSettings.name}
                    onChange={(e) =>
                      setSessionSettings({
                        ...sessionSettings,
                        name: e.target.value,
                      })
                    }
                    className="bg-gray-800/50 border-blue-500/30"
                    placeholder="Enter session name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-password">Password (Optional)</Label>
                  <Input
                    id="session-password"
                    type="password"
                    value={sessionSettings.password}
                    onChange={(e) =>
                      setSessionSettings({
                        ...sessionSettings,
                        password: e.target.value,
                      })
                    }
                    className="bg-gray-800/50 border-blue-500/30"
                    placeholder="Leave empty for public session"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-description">Description</Label>
                <Textarea
                  id="session-description"
                  value={sessionSettings.description}
                  onChange={(e) =>
                    setSessionSettings({
                      ...sessionSettings,
                      description: e.target.value,
                    })
                  }
                  className="bg-gray-800/50 border-blue-500/30"
                  placeholder="Describe your session..."
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-blue-400">
                  Session Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="public-session"
                      checked={sessionSettings.publicSession}
                      onCheckedChange={(checked) =>
                        setSessionSettings({
                          ...sessionSettings,
                          publicSession: checked,
                        })
                      }
                    />
                    <Label htmlFor="public-session">Public Session</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allow-spectators"
                      checked={sessionSettings.allowSpectators}
                      onCheckedChange={(checked) =>
                        setSessionSettings({
                          ...sessionSettings,
                          allowSpectators: checked,
                        })
                      }
                    />
                    <Label htmlFor="allow-spectators">Allow Spectators</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="record-session"
                      checked={sessionSettings.recordSession}
                      onCheckedChange={(checked) =>
                        setSessionSettings({
                          ...sessionSettings,
                          recordSession: checked,
                        })
                      }
                    />
                    <Label htmlFor="record-session">Record Session</Label>
                  </div>
                </div>
              </div>

              {selectedMode && (
                <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg border border-blue-500/30">
                  <h4 className="font-semibold text-blue-400">
                    Selected Game Mode
                  </h4>
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-lg text-blue-400">
                        {selectedMode.name}
                      </h5>
                      <p className="text-sm text-gray-300">
                        {selectedMode.description}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <Badge variant="outline">{selectedMode.type}</Badge>
                        <Badge variant="outline">{selectedMode.category}</Badge>
                        <Badge
                          variant="outline"
                          className={getDifficultyColor(
                            selectedMode.difficulty,
                          )}
                        >
                          {selectedMode.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedMode(null)}
                    >
                      ×
                    </Button>
                  </div>

                  {selectedMode.type !== "single" && (
                    <div className="space-y-3">
                      <h5 className="font-semibold text-blue-400">
                        Select Players
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {mockPlayers.map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center space-x-3 p-2 bg-gray-800/30 rounded"
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${player.online ? "bg-green-400" : "bg-red-400"}`}
                            />
                            <div className="flex-1">
                              <div className="text-sm font-semibold">
                                {player.name}
                              </div>
                              <div className="text-xs text-gray-400">
                                {player.rank} - {player.division}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant={
                                selectedPlayers.find((p) => p.id === player.id)
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() => {
                                if (
                                  selectedPlayers.find(
                                    (p) => p.id === player.id,
                                  )
                                ) {
                                  setSelectedPlayers(
                                    selectedPlayers.filter(
                                      (p) => p.id !== player.id,
                                    ),
                                  );
                                } else if (
                                  selectedPlayers.length <
                                  selectedMode.playerCount.max - 1
                                ) {
                                  setSelectedPlayers([
                                    ...selectedPlayers,
                                    player,
                                  ]);
                                }
                              }}
                              disabled={
                                !player.online ||
                                (!selectedPlayers.find(
                                  (p) => p.id === player.id,
                                ) &&
                                  selectedPlayers.length >=
                                    selectedMode.playerCount.max - 1)
                              }
                            >
                              {selectedPlayers.find((p) => p.id === player.id)
                                ? "✓"
                                : "+"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => createSession(selectedMode)}
                    className="w-full"
                    disabled={
                      selectedMode.type !== "single" &&
                      selectedPlayers.length < selectedMode.playerCount.min - 1
                    }
                  >
                    Create Session
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Game Modes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Modes:</span>
                    <span className="text-blue-400">{gameModes.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Single Player:</span>
                    <span className="text-gray-400">
                      {gameModes.filter((m) => m.type === "single").length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Multiplayer:</span>
                    <span className="text-gray-400">
                      {gameModes.filter((m) => m.type === "multiplayer").length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cooperative:</span>
                    <span className="text-gray-400">
                      {gameModes.filter((m) => m.type === "cooperative").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Active Players
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Online Players:</span>
                    <span className="text-green-400">
                      {mockPlayers.filter((p) => p.online).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Players:</span>
                    <span className="text-blue-400">{mockPlayers.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>In Sessions:</span>
                    <span className="text-gray-400">
                      {activeSessions.reduce(
                        (total, session) => total + session.players.length,
                        0,
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Popular Modes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Bridge Command:</span>
                    <span className="text-yellow-400">★★★★★</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Borg Encounter:</span>
                    <span className="text-yellow-400">★★★★☆</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Exploration:</span>
                    <span className="text-yellow-400">★★★☆☆</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kobayashi Maru:</span>
                    <span className="text-yellow-400">★★★★☆</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800/30 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-gray-300">
                    Jean-Luc Picard completed "Deep Space Exploration"
                  </span>
                  <span className="text-gray-500 ml-auto">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-gray-300">
                    New multiplayer session "Enterprise Training" started
                  </span>
                  <span className="text-gray-500 ml-auto">3 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <span className="text-gray-300">
                    Data achieved high score in "Quantum Research Project"
                  </span>
                  <span className="text-gray-500 ml-auto">5 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-gray-300">
                    Worf completed "Kobayashi Maru Scenario"
                  </span>
                  <span className="text-gray-500 ml-auto">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedMode && activeTab === "modes" && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-900 border-blue-500/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-blue-400">
                    {selectedMode.name}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">{selectedMode.type}</Badge>
                    <Badge variant="outline">{selectedMode.category}</Badge>
                    <Badge
                      variant="outline"
                      className={getDifficultyColor(selectedMode.difficulty)}
                    >
                      {selectedMode.difficulty}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedMode(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-300">{selectedMode.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">
                      Mission Objectives
                    </h4>
                    <ul className="space-y-2">
                      {selectedMode.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Target className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                          <span className="text-sm text-gray-300">
                            {objective}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">
                      Features
                    </h4>
                    <ul className="space-y-2">
                      {selectedMode.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Star className="w-4 h-4 mt-0.5 text-yellow-400 flex-shrink-0" />
                          <span className="text-sm text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">
                      Requirements
                    </h4>
                    <ul className="space-y-2">
                      {selectedMode.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Shield className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                          <span className="text-sm text-gray-300">
                            {requirement}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">
                      Rewards
                    </h4>
                    <ul className="space-y-2">
                      {selectedMode.rewards.map((reward, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Trophy className="w-4 h-4 mt-0.5 text-yellow-400 flex-shrink-0" />
                          <span className="text-sm text-gray-300">
                            {reward}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-2">
                      Session Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Players:</span>
                        <span className="text-blue-400">
                          {selectedMode.playerCount.min}-
                          {selectedMode.playerCount.max}
                        </span>
                      </div>
                      {selectedMode.timeLimit && (
                        <div className="flex justify-between">
                          <span>Time Limit:</span>
                          <span className="text-blue-400">
                            {selectedMode.timeLimit} minutes
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Difficulty:</span>
                        <span
                          className={getDifficultyColor(
                            selectedMode.difficulty,
                          )}
                        >
                          {selectedMode.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => {
                    setActiveTab("create");
                    // selectedMode remains set for the create tab
                  }}
                  className="flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Game
                </Button>
                <Button variant="outline" className="flex-1">
                  <Users className="w-4 h-4 mr-2" />
                  Find Players
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
