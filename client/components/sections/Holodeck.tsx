import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  Square,
  Settings,
  Users,
  Clock,
  Star,
  Target,
  BookOpen,
  Swords,
  Globe,
  Camera,
  Brain,
  Gamepad2,
} from "lucide-react";

interface HoloProgram {
  id: string;
  name: string;
  category:
    | "Recreation"
    | "Training"
    | "Historical"
    | "Adventure"
    | "Educational";
  description: string;
  difficulty: number;
  duration_minutes: number;
  participants: number;
  rating: number;
  safety_protocols: boolean;
  created_by: string;
  icon: React.ReactNode;
  environment: string;
  requirements: string[];
}

interface ActiveSession {
  id: string;
  program: HoloProgram;
  participants: string[];
  start_time: string;
  elapsed_minutes: number;
  status: "Running" | "Paused" | "Initializing";
  holodeck_id: number;
}

interface Holodeck {
  id: number;
  name: string;
  status: "Available" | "Occupied" | "Maintenance" | "Offline";
  current_program?: string;
  safety_level: number;
  power_usage: number;
  last_maintenance: string;
}

export function Holodeck() {
  const [activeTab, setActiveTab] = useState<
    "programs" | "sessions" | "facilities"
  >("programs");
  const [selectedProgram, setSelectedProgram] = useState<HoloProgram | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);

  const [holodecks, setHolodecks] = useState<Holodeck[]>([
    {
      id: 1,
      name: "Holodeck 1",
      status: "Available",
      safety_level: 100,
      power_usage: 0,
      last_maintenance: "2024-01-15",
    },
    {
      id: 2,
      name: "Holodeck 2",
      status: "Occupied",
      current_program: "Dixon Hill Detective Stories",
      safety_level: 100,
      power_usage: 85,
      last_maintenance: "2024-01-14",
    },
    {
      id: 3,
      name: "Holodeck 3",
      status: "Available",
      safety_level: 98,
      power_usage: 0,
      last_maintenance: "2024-01-13",
    },
    {
      id: 4,
      name: "Holodeck 4",
      status: "Maintenance",
      safety_level: 92,
      power_usage: 0,
      last_maintenance: "2024-01-10",
    },
  ]);

  const programs: HoloProgram[] = [
    {
      id: "dixon_hill",
      name: "Dixon Hill Detective Stories",
      category: "Recreation",
      description:
        "1940s San Francisco noir detective adventures. Solve mysteries as private investigator Dixon Hill.",
      difficulty: 3,
      duration_minutes: 60,
      participants: 1,
      rating: 9.2,
      safety_protocols: true,
      created_by: "Jean-Luc Picard",
      icon: <Camera className="w-5 h-5" />,
      environment: "1940s San Francisco",
      requirements: [
        "Period clothing subroutines",
        "Detective scenario database",
      ],
    },
    {
      id: "bridge_simulation",
      name: "Starfleet Bridge Training",
      category: "Training",
      description:
        "Advanced bridge officer training scenarios. Practice command decisions and emergency protocols.",
      difficulty: 8,
      duration_minutes: 120,
      participants: 8,
      rating: 9.8,
      safety_protocols: true,
      created_by: "Starfleet Academy",
      icon: <Target className="w-5 h-5" />,
      environment: "Galaxy-class Bridge",
      requirements: [
        "Command protocols",
        "Emergency scenarios",
        "Multi-user support",
      ],
    },
    {
      id: "sherwood_forest",
      name: "Robin Hood Adventures",
      category: "Adventure",
      description:
        "Medieval England adventures as Robin Hood and his Merry Men. Archery, swordplay, and heroic deeds.",
      difficulty: 5,
      duration_minutes: 90,
      participants: 6,
      rating: 8.7,
      safety_protocols: true,
      created_by: "William Riker",
      icon: <Swords className="w-5 h-5" />,
      environment: "Sherwood Forest, 12th Century",
      requirements: [
        "Medieval weapons",
        "Period characters",
        "Forest environment",
      ],
    },
    {
      id: "ancient_rome",
      name: "Ancient Rome Historical Recreation",
      category: "Historical",
      description:
        "Experience life in ancient Rome. Walk through the Forum, attend gladiator games, meet historical figures.",
      difficulty: 2,
      duration_minutes: 45,
      participants: 4,
      rating: 8.9,
      safety_protocols: true,
      created_by: "Dr. Crusher",
      icon: <Globe className="w-5 h-5" />,
      environment: "Rome, 1st Century AD",
      requirements: [
        "Historical database",
        "Roman architecture",
        "Period costumes",
      ],
    },
    {
      id: "physics_lab",
      name: "Quantum Physics Laboratory",
      category: "Educational",
      description:
        "Interactive quantum physics experiments. Visualize subatomic particles and quantum phenomena.",
      difficulty: 9,
      duration_minutes: 75,
      participants: 3,
      rating: 9.1,
      safety_protocols: true,
      created_by: "Lt. Commander Data",
      icon: <Brain className="w-5 h-5" />,
      environment: "Advanced Physics Laboratory",
      requirements: [
        "Quantum simulation algorithms",
        "Scientific instruments",
        "Safety protocols",
      ],
    },
    {
      id: "bat_leth_training",
      name: "Klingon Bat'leth Combat Training",
      category: "Training",
      description:
        "Master the ancient Klingon weapon. Learn traditional combat forms and warrior philosophy.",
      difficulty: 7,
      duration_minutes: 60,
      participants: 2,
      rating: 8.5,
      safety_protocols: false,
      created_by: "Worf",
      icon: <Swords className="w-5 h-5" />,
      environment: "Klingon Training Grounds",
      requirements: [
        "Klingon weapons database",
        "Combat algorithms",
        "Pain simulation",
      ],
    },
    {
      id: "jazz_club",
      name: "Vic's Las Vegas Lounge",
      category: "Recreation",
      description:
        "1960s Las Vegas nightclub with live jazz music, drinks, and entertainment.",
      difficulty: 1,
      duration_minutes: 120,
      participants: 10,
      rating: 9.0,
      safety_protocols: true,
      created_by: "Julian Bashir",
      icon: <Star className="w-5 h-5" />,
      environment: "1960s Las Vegas",
      requirements: [
        "Period music database",
        "Holographic performers",
        "Casino subroutines",
      ],
    },
    {
      id: "diplomatic_training",
      name: "First Contact Diplomatic Scenarios",
      category: "Training",
      description:
        "Practice first contact protocols with various alien species and diplomatic situations.",
      difficulty: 6,
      duration_minutes: 90,
      participants: 4,
      rating: 9.3,
      safety_protocols: true,
      created_by: "Counselor Troi",
      icon: <Users className="w-5 h-5" />,
      environment: "Various Alien Worlds",
      requirements: [
        "Xenobiology database",
        "Diplomatic protocols",
        "Cultural simulations",
      ],
    },
  ];

  useEffect(() => {
    // Simulate active sessions
    if (activeSessions.length === 0) {
      const session: ActiveSession = {
        id: "session1",
        program: programs.find((p) => p.id === "dixon_hill")!,
        participants: ["Captain Picard", "Counselor Troi"],
        start_time: "14:30",
        elapsed_minutes: 35,
        status: "Running",
        holodeck_id: 2,
      };
      setActiveSessions([session]);
    }

    // Update session timers
    const interval = setInterval(() => {
      setActiveSessions((prev) =>
        prev.map((session) => ({
          ...session,
          elapsed_minutes:
            session.status === "Running"
              ? session.elapsed_minutes + 1
              : session.elapsed_minutes,
        })),
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const filteredPrograms =
    selectedCategory === "All"
      ? programs
      : programs.filter((p) => p.category === selectedCategory);

  const categories = [
    "All",
    "Recreation",
    "Training",
    "Historical",
    "Adventure",
    "Educational",
  ];

  const startProgram = (program: HoloProgram, holodeckId: number) => {
    const newSession: ActiveSession = {
      id: `session_${Date.now()}`,
      program,
      participants: ["Current User"],
      start_time: new Date().toLocaleTimeString().slice(0, 5),
      elapsed_minutes: 0,
      status: "Initializing",
      holodeck_id: holodeckId,
    };

    setActiveSessions((prev) => [...prev, newSession]);

    setHolodecks((prev) =>
      prev.map((deck) =>
        deck.id === holodeckId
          ? {
              ...deck,
              status: "Occupied",
              current_program: program.name,
              power_usage: 75,
            }
          : deck,
      ),
    );

    // Switch to running after initialization
    setTimeout(() => {
      setActiveSessions((prev) =>
        prev.map((session) =>
          session.id === newSession.id
            ? { ...session, status: "Running" }
            : session,
        ),
      );
    }, 3000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Recreation":
        return "text-green-400 border-green-400 bg-green-400/20";
      case "Training":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Historical":
        return "text-purple-400 border-purple-400 bg-purple-400/20";
      case "Adventure":
        return "text-red-400 border-red-400 bg-red-400/20";
      case "Educational":
        return "text-blue-400 border-blue-400 bg-blue-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "text-green-400 border-green-400 bg-green-400/20";
      case "Occupied":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Maintenance":
        return "text-red-400 border-red-400 bg-red-400/20";
      case "Offline":
        return "text-gray-400 border-gray-400 bg-gray-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          HOLODECK RECREATION
        </h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "programs" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "programs"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("programs")}
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            Programs
          </Button>
          <Button
            variant={activeTab === "sessions" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "sessions"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("sessions")}
          >
            <Play className="w-4 h-4 mr-2" />
            Active Sessions
          </Button>
          <Button
            variant={activeTab === "facilities" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "facilities"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("facilities")}
          >
            <Settings className="w-4 h-4 mr-2" />
            Facilities
          </Button>
        </div>
      </div>

      {activeTab === "programs" && (
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className={
                  selectedCategory === category
                    ? "bg-trek-blue text-trek-dark"
                    : "border-trek-accent text-trek-text hover:bg-trek-accent"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {filteredPrograms.map((program) => (
                <Card
                  key={program.id}
                  className={`bg-trek-panel border-trek-accent p-4 cursor-pointer transition-colors hover:border-trek-blue ${
                    selectedProgram?.id === program.id
                      ? "border-trek-blue bg-trek-blue/5"
                      : ""
                  }`}
                  onClick={() => setSelectedProgram(program)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-trek-gold text-xl">
                        {program.icon}
                      </span>
                      <div>
                        <h3 className="font-bold text-trek-gold">
                          {program.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getCategoryColor(program.category)}`}
                          >
                            {program.category}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-trek-gold" />
                            <span className="text-xs text-trek-gold">
                              {program.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-sm">
                      <div className="text-trek-text/70">
                        Difficulty: {program.difficulty}/10
                      </div>
                      <div className="text-trek-blue">
                        {program.duration_minutes}min
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-trek-text/80 mb-2">
                    {program.description}
                  </p>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-trek-blue" />
                        <span>{program.participants} participants</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-trek-blue" />
                        <span>{program.duration_minutes}min</span>
                      </div>
                    </div>

                    {!program.safety_protocols && (
                      <Badge
                        variant="outline"
                        className="text-xs border-red-400 text-red-400"
                      >
                        No Safety Protocols
                      </Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {selectedProgram && (
              <Card className="bg-trek-panel border-trek-blue p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-trek-gold text-2xl">
                    {selectedProgram.icon}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-trek-gold">
                      {selectedProgram.name}
                    </h3>
                    <p className="text-trek-blue">
                      Created by {selectedProgram.created_by}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-trek-gold mb-2">
                      Environment
                    </h4>
                    <p className="text-sm text-trek-text/80">
                      {selectedProgram.environment}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-trek-gold mb-2">
                      Description
                    </h4>
                    <p className="text-sm text-trek-text/80">
                      {selectedProgram.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-trek-text/70 text-sm">
                        Difficulty Level
                      </div>
                      <div className="text-trek-blue font-semibold">
                        {selectedProgram.difficulty}/10
                      </div>
                    </div>
                    <div>
                      <div className="text-trek-text/70 text-sm">
                        Max Participants
                      </div>
                      <div className="text-trek-blue font-semibold">
                        {selectedProgram.participants}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-trek-gold mb-2">
                      Requirements
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedProgram.requirements.map((req, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs border-trek-accent text-trek-text"
                        >
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-trek-accent">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                        onClick={() => {
                          const availableDeck = holodecks.find(
                            (d) => d.status === "Available",
                          );
                          if (availableDeck) {
                            startProgram(selectedProgram, availableDeck.id);
                          }
                        }}
                        disabled={
                          !holodecks.some((d) => d.status === "Available")
                        }
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Program
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === "sessions" && (
        <div className="space-y-4">
          {activeSessions.length === 0 ? (
            <Card className="bg-trek-panel border-trek-accent p-8 text-center">
              <p className="text-trek-text/70">No active holodeck sessions</p>
            </Card>
          ) : (
            activeSessions.map((session) => (
              <Card
                key={session.id}
                className="bg-trek-panel border-trek-accent p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-trek-gold text-xl">
                      {session.program.icon}
                    </span>
                    <div>
                      <h3 className="font-bold text-trek-gold">
                        {session.program.name}
                      </h3>
                      <p className="text-trek-blue">
                        Holodeck {session.holodeck_id}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant="secondary"
                    className={`${
                      session.status === "Running"
                        ? "bg-green-400/20 text-green-400 border-green-400"
                        : session.status === "Paused"
                          ? "bg-yellow-400/20 text-yellow-400 border-yellow-400"
                          : "bg-blue-400/20 text-blue-400 border-blue-400"
                    }`}
                  >
                    {session.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-trek-text/70 text-sm">Started</div>
                    <div className="text-trek-blue font-semibold">
                      {session.start_time}
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Elapsed Time
                    </div>
                    <div className="text-trek-blue font-semibold">
                      {session.elapsed_minutes} minutes
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Participants
                    </div>
                    <div className="text-trek-blue font-semibold">
                      {session.participants.length}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-trek-text/70 text-sm mb-1">
                    Session Progress
                  </div>
                  <Progress
                    value={
                      (session.elapsed_minutes /
                        session.program.duration_minutes) *
                      100
                    }
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                  >
                    {session.status === "Running" ? (
                      <Pause className="w-4 h-4 mr-2" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    {session.status === "Running" ? "Pause" : "Resume"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-400 text-red-400 hover:bg-red-400 hover:text-trek-dark"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    End Program
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Program Settings
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "facilities" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {holodecks.map((deck) => (
            <Card
              key={deck.id}
              className="bg-trek-panel border-trek-accent p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-trek-gold">{deck.name}</h3>
                  {deck.current_program && (
                    <p className="text-sm text-trek-blue">
                      {deck.current_program}
                    </p>
                  )}
                </div>
                <Badge
                  variant="secondary"
                  className={`text-xs ${getStatusColor(deck.status)}`}
                >
                  {deck.status}
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-trek-text/70">Safety Level</span>
                    <span className="text-trek-blue">{deck.safety_level}%</span>
                  </div>
                  <Progress value={deck.safety_level} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-trek-text/70">Power Usage</span>
                    <span className="text-trek-blue">{deck.power_usage}%</span>
                  </div>
                  <Progress value={deck.power_usage} className="h-2" />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-trek-text/70">Last Maintenance</span>
                  <span className="text-trek-blue">
                    {deck.last_maintenance}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-trek-accent">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                    disabled={deck.status !== "Available"}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Diagnostics
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
