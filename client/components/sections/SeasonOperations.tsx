import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Calendar,
  Trophy,
  Star,
  Clock,
  Gift,
  Target,
  Flame,
  Snowflake,
  Sun,
  Leaf,
  Zap,
  Shield,
  Rocket,
  Users,
  MapPin,
  Award,
  Timer,
  CheckCircle,
  Lock,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

interface SeasonEvent {
  id: string;
  name: string;
  description: string;
  type: "exploration" | "combat" | "diplomatic" | "research" | "special";
  season: "spring" | "summer" | "autumn" | "winter" | "special";
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "completed" | "expired";
  rewards: EventReward[];
  objectives: EventObjective[];
  participation: number;
  maxParticipants: number;
  difficulty: "cadet" | "lieutenant" | "commander" | "captain" | "admiral";
  prerequisites: string[];
  repeatable: boolean;
}

interface EventReward {
  id: string;
  type:
    | "experience"
    | "resources"
    | "equipment"
    | "cosmetic"
    | "title"
    | "ship";
  name: string;
  amount?: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  unlocked: boolean;
}

interface EventObjective {
  id: string;
  description: string;
  type: "destroy" | "explore" | "collect" | "interact" | "survive" | "complete";
  target: number;
  current: number;
  completed: boolean;
  rewards: EventReward[];
}

interface SeasonPass {
  id: string;
  name: string;
  season: string;
  tier: number;
  maxTier: number;
  experience: number;
  experienceToNext: number;
  freeTracks: SeasonReward[];
  premiumTracks: SeasonReward[];
  premiumUnlocked: boolean;
  daysRemaining: number;
}

interface SeasonReward {
  tier: number;
  type: "free" | "premium";
  reward: EventReward;
  unlocked: boolean;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  type: "story" | "episodic" | "challenge" | "raid";
  season: string;
  episodes: CampaignEpisode[];
  currentEpisode: number;
  completed: boolean;
  timeRemaining: number;
  rewards: EventReward[];
}

interface CampaignEpisode {
  id: string;
  name: string;
  description: string;
  objectives: EventObjective[];
  unlocked: boolean;
  completed: boolean;
  rewards: EventReward[];
  location: string;
  estimatedTime: number;
}

export function SeasonOperations() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "events" | "seasonpass" | "campaigns" | "leaderboard"
  >("overview");
  const [currentSeason, setCurrentSeason] = useState("Winter Operations 2024");
  const [timeRemaining, setTimeRemaining] = useState({
    days: 45,
    hours: 12,
    minutes: 30,
  });

  const [seasonEvents, setSeasonEvents] = useState<SeasonEvent[]>([
    {
      id: "winter_borg_incursion",
      name: "Borg Winter Incursion",
      description:
        "The Borg have launched a coordinated assault during the winter months. Defend Federation space and push back the collective.",
      type: "combat",
      season: "winter",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      status: "active",
      participation: 15847,
      maxParticipants: 50000,
      difficulty: "captain",
      prerequisites: ["Complete Tutorial", "Reach Level 25"],
      repeatable: true,
      rewards: [
        {
          id: "borg_tech",
          type: "equipment",
          name: "Borg Technology Cache",
          rarity: "epic",
          unlocked: false,
        },
        {
          id: "winter_badge",
          type: "cosmetic",
          name: "Winter Defender Badge",
          rarity: "rare",
          unlocked: false,
        },
        {
          id: "exp_boost",
          type: "experience",
          name: "Experience Points",
          amount: 50000,
          rarity: "common",
          unlocked: false,
        },
      ],
      objectives: [
        {
          id: "destroy_cubes",
          description: "Destroy 10 Borg Cubes",
          type: "destroy",
          target: 10,
          current: 3,
          completed: false,
          rewards: [],
        },
        {
          id: "save_colonies",
          description: "Defend 5 Federation Colonies",
          type: "interact",
          target: 5,
          current: 1,
          completed: false,
          rewards: [],
        },
        {
          id: "collect_debris",
          description: "Collect 100 Borg Debris",
          type: "collect",
          target: 100,
          current: 23,
          completed: false,
          rewards: [],
        },
      ],
    },
    {
      id: "diplomatic_summit",
      name: "Galactic Peace Summit",
      description:
        "Facilitate diplomatic relations between major powers during this special winter conference.",
      type: "diplomatic",
      season: "winter",
      startDate: "2024-12-15",
      endDate: "2024-12-22",
      status: "upcoming",
      participation: 0,
      maxParticipants: 10000,
      difficulty: "commander",
      prerequisites: [
        "Diplomatic Corps Access",
        "Complete First Contact Protocol",
      ],
      repeatable: false,
      rewards: [
        {
          id: "ambassador_title",
          type: "title",
          name: "Ambassador of Peace",
          rarity: "legendary",
          unlocked: false,
        },
        {
          id: "diplomatic_ship",
          type: "ship",
          name: "Diplomatic Envoy Vessel",
          rarity: "epic",
          unlocked: false,
        },
      ],
      objectives: [
        {
          id: "negotiate_treaties",
          description: "Successfully negotiate 3 peace treaties",
          type: "complete",
          target: 3,
          current: 0,
          completed: false,
          rewards: [],
        },
        {
          id: "resolve_conflicts",
          description: "Mediate 5 territorial disputes",
          type: "complete",
          target: 5,
          current: 0,
          completed: false,
          rewards: [],
        },
      ],
    },
    {
      id: "anomaly_research",
      name: "Temporal Anomaly Research Initiative",
      description:
        "Study mysterious temporal anomalies that have appeared throughout the galaxy during the winter season.",
      type: "research",
      season: "winter",
      startDate: "2024-12-05",
      endDate: "2024-12-25",
      status: "active",
      participation: 8234,
      maxParticipants: 25000,
      difficulty: "lieutenant",
      prerequisites: ["Science Officer Certification"],
      repeatable: true,
      rewards: [
        {
          id: "temporal_device",
          type: "equipment",
          name: "Temporal Stabilizer",
          rarity: "rare",
          unlocked: false,
        },
        {
          id: "research_data",
          type: "resources",
          name: "Temporal Research Data",
          amount: 1000,
          rarity: "uncommon",
          unlocked: false,
        },
      ],
      objectives: [
        {
          id: "scan_anomalies",
          description: "Scan 15 temporal anomalies",
          type: "interact",
          target: 15,
          current: 7,
          completed: false,
          rewards: [],
        },
        {
          id: "collect_samples",
          description: "Collect 50 temporal particle samples",
          type: "collect",
          target: 50,
          current: 18,
          completed: false,
          rewards: [],
        },
      ],
    },
  ]);

  const [seasonPass, setSeasonPass] = useState<SeasonPass>({
    id: "winter_2024",
    name: "Winter Operations Pass",
    season: "Winter 2024",
    tier: 12,
    maxTier: 50,
    experience: 15750,
    experienceToNext: 2250,
    premiumUnlocked: true,
    daysRemaining: 45,
    freeTracks: [
      {
        tier: 1,
        type: "free",
        reward: {
          id: "f1",
          type: "experience",
          name: "Experience Boost",
          amount: 1000,
          rarity: "common",
          unlocked: true,
        },
        unlocked: true,
      },
      {
        tier: 5,
        type: "free",
        reward: {
          id: "f5",
          type: "resources",
          name: "Dilithium Crystals",
          amount: 500,
          rarity: "uncommon",
          unlocked: true,
        },
        unlocked: true,
      },
      {
        tier: 10,
        type: "free",
        reward: {
          id: "f10",
          type: "equipment",
          name: "Winter Combat Armor",
          rarity: "rare",
          unlocked: true,
        },
        unlocked: true,
      },
      {
        tier: 15,
        type: "free",
        reward: {
          id: "f15",
          type: "cosmetic",
          name: "Snowflake Hull Pattern",
          rarity: "rare",
          unlocked: false,
        },
        unlocked: false,
      },
      {
        tier: 20,
        type: "free",
        reward: {
          id: "f20",
          type: "ship",
          name: "Federation Escort",
          rarity: "epic",
          unlocked: false,
        },
        unlocked: false,
      },
    ],
    premiumTracks: [
      {
        tier: 1,
        type: "premium",
        reward: {
          id: "p1",
          type: "resources",
          name: "Premium Resources Pack",
          amount: 2000,
          rarity: "uncommon",
          unlocked: true,
        },
        unlocked: true,
      },
      {
        tier: 5,
        type: "premium",
        reward: {
          id: "p5",
          type: "equipment",
          name: "Advanced Winter Gear",
          rarity: "epic",
          unlocked: true,
        },
        unlocked: true,
      },
      {
        tier: 10,
        type: "premium",
        reward: {
          id: "p10",
          type: "ship",
          name: "Winter Tactical Cruiser",
          rarity: "epic",
          unlocked: true,
        },
        unlocked: true,
      },
      {
        tier: 15,
        type: "premium",
        reward: {
          id: "p15",
          type: "cosmetic",
          name: "Crystalline Ship Skin",
          rarity: "legendary",
          unlocked: false,
        },
        unlocked: false,
      },
      {
        tier: 25,
        type: "premium",
        reward: {
          id: "p25",
          type: "title",
          name: "Winter Admiral",
          rarity: "legendary",
          unlocked: false,
        },
        unlocked: false,
      },
    ],
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "dominion_return",
      name: "The Dominion's Return",
      description:
        "Intelligence reports suggest Dominion forces are massing in the Gamma Quadrant. Investigate and prevent another war.",
      type: "story",
      season: "Winter 2024",
      currentEpisode: 2,
      completed: false,
      timeRemaining: 2592000000, // 30 days in milliseconds
      rewards: [
        {
          id: "dominion_ship",
          type: "ship",
          name: "Captured Dominion Vessel",
          rarity: "legendary",
          unlocked: false,
        },
        {
          id: "war_hero",
          type: "title",
          name: "Defender of the Alpha Quadrant",
          rarity: "epic",
          unlocked: false,
        },
      ],
      episodes: [
        {
          id: "ep1",
          name: "Whispers from the Gamma Quadrant",
          description:
            "Investigate unusual readings coming from the other side of the wormhole.",
          location: "Deep Space Nine",
          estimatedTime: 45,
          unlocked: true,
          completed: true,
          objectives: [
            {
              id: "investigate_ds9",
              description: "Report to Deep Space Nine",
              type: "interact",
              target: 1,
              current: 1,
              completed: true,
              rewards: [],
            },
          ],
          rewards: [
            {
              id: "ep1_exp",
              type: "experience",
              name: "Episode Experience",
              amount: 5000,
              rarity: "common",
              unlocked: true,
            },
          ],
        },
        {
          id: "ep2",
          name: "Shadows in the Wormhole",
          description:
            "Enter the Bajoran Wormhole and investigate Dominion activity.",
          location: "Bajoran Wormhole",
          estimatedTime: 60,
          unlocked: true,
          completed: false,
          objectives: [
            {
              id: "enter_wormhole",
              description: "Navigate through the wormhole",
              type: "complete",
              target: 1,
              current: 0,
              completed: false,
              rewards: [],
            },
            {
              id: "scan_ships",
              description: "Scan 3 unknown vessels",
              type: "interact",
              target: 3,
              current: 1,
              completed: false,
              rewards: [],
            },
          ],
          rewards: [
            {
              id: "ep2_tech",
              type: "equipment",
              name: "Wormhole Navigation System",
              rarity: "rare",
              unlocked: false,
            },
          ],
        },
        {
          id: "ep3",
          name: "The Founder's Gambit",
          description:
            "Confront a Founder who has infiltrated Starfleet Command.",
          location: "Earth Spacedock",
          estimatedTime: 90,
          unlocked: false,
          completed: false,
          objectives: [
            {
              id: "expose_changeling",
              description: "Identify the Changeling infiltrator",
              type: "complete",
              target: 1,
              current: 0,
              completed: false,
              rewards: [],
            },
          ],
          rewards: [
            {
              id: "ep3_device",
              type: "equipment",
              name: "Changeling Detector",
              rarity: "epic",
              unlocked: false,
            },
          ],
        },
      ],
    },
  ]);

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case "spring":
        return <Leaf className="w-5 h-5 text-green-400" />;
      case "summer":
        return <Sun className="w-5 h-5 text-yellow-400" />;
      case "autumn":
        return <Leaf className="w-5 h-5 text-orange-400" />;
      case "winter":
        return <Snowflake className="w-5 h-5 text-blue-400" />;
      default:
        return <Star className="w-5 h-5 text-trek-gold" />;
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "combat":
        return <Shield className="w-4 h-4" />;
      case "exploration":
        return <MapPin className="w-4 h-4" />;
      case "diplomatic":
        return <Users className="w-4 h-4" />;
      case "research":
        return <Star className="w-4 h-4" />;
      case "special":
        return <Flame className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "cadet":
        return "text-green-400 border-green-400";
      case "lieutenant":
        return "text-blue-400 border-blue-400";
      case "commander":
        return "text-yellow-400 border-yellow-400";
      case "captain":
        return "text-orange-400 border-orange-400";
      case "admiral":
        return "text-red-400 border-red-400";
      default:
        return "text-trek-text border-trek-accent";
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-gray-400 border-gray-400";
      case "uncommon":
        return "text-green-400 border-green-400";
      case "rare":
        return "text-blue-400 border-blue-400";
      case "epic":
        return "text-purple-400 border-purple-400";
      case "legendary":
        return "text-yellow-400 border-yellow-400";
      default:
        return "text-trek-text border-trek-accent";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-400/20 border-green-400";
      case "upcoming":
        return "text-blue-400 bg-blue-400/20 border-blue-400";
      case "completed":
        return "text-trek-gold bg-trek-gold/20 border-trek-gold";
      case "expired":
        return "text-red-400 bg-red-400/20 border-red-400";
      default:
        return "text-trek-text bg-trek-panel border-trek-accent";
    }
  };

  const participateInEvent = (eventId: string) => {
    setSeasonEvents((prev) =>
      prev.map((event) =>
        event.id === eventId && event.status === "active"
          ? { ...event, participation: event.participation + 1 }
          : event,
      ),
    );
  };

  const claimReward = (rewardId: string) => {
    // Handle reward claiming logic
    console.log(`Claiming reward: ${rewardId}`);
  };

  const formatTimeRemaining = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => ({
        days:
          prev.minutes === 0 && prev.hours === 0
            ? Math.max(0, prev.days - 1)
            : prev.days,
        hours:
          prev.minutes === 0
            ? prev.hours === 0
              ? 23
              : prev.hours - 1
            : prev.hours,
        minutes: prev.minutes === 0 ? 59 : prev.minutes - 1,
      }));
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
            SEASON OPERATIONS
          </h2>
          {getSeasonIcon("winter")}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-trek-text/70">Current Season</div>
            <div className="text-trek-blue font-semibold">{currentSeason}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-trek-text/70">Time Remaining</div>
            <div className="text-trek-gold font-semibold">
              {timeRemaining.days}d {timeRemaining.hours}h{" "}
              {timeRemaining.minutes}m
            </div>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value: any) => setActiveTab(value)}
      >
        <TabsList className="grid grid-cols-5 w-full bg-trek-panel border border-trek-accent">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-trek-dark"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-trek-dark"
          >
            <Target className="w-4 h-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger
            value="seasonpass"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-trek-dark"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Season Pass
          </TabsTrigger>
          <TabsTrigger
            value="campaigns"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-trek-dark"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-trek-dark"
          >
            <Award className="w-4 h-4 mr-2" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Season Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Active Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-trek-blue mb-2">
                  {seasonEvents.filter((e) => e.status === "active").length}
                </div>
                <div className="text-sm text-trek-text/60">
                  {seasonEvents.filter((e) => e.status === "upcoming").length}{" "}
                  upcoming
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Season Pass
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-trek-blue mb-2">
                  Tier {seasonPass.tier}
                </div>
                <Progress
                  value={(seasonPass.tier / seasonPass.maxTier) * 100}
                  className="h-2 mb-2"
                />
                <div className="text-sm text-trek-text/60">
                  {seasonPass.experienceToNext} XP to next tier
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Season Ends In
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-trek-gold mb-2">
                  {timeRemaining.days}d
                </div>
                <div className="text-sm text-trek-text/60">
                  {timeRemaining.hours}h {timeRemaining.minutes}m remaining
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Featured Event */}
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-gold flex items-center gap-2">
                <Flame className="w-5 h-5" />
                Featured Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              {seasonEvents.filter((e) => e.status === "active")[0] && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-trek-blue">
                        {
                          seasonEvents.filter((e) => e.status === "active")[0]
                            .name
                        }
                      </h3>
                      <p className="text-trek-text/80">
                        {
                          seasonEvents.filter((e) => e.status === "active")[0]
                            .description
                        }
                      </p>
                    </div>
                    <Button
                      className="bg-trek-accent hover:bg-trek-accent/80 text-trek-dark"
                      onClick={() =>
                        participateInEvent(
                          seasonEvents.filter((e) => e.status === "active")[0]
                            .id,
                        )
                      }
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Participate
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {seasonEvents
                      .filter((e) => e.status === "active")[0]
                      .objectives.slice(0, 3)
                      .map((objective) => (
                        <div
                          key={objective.id}
                          className="bg-trek-bg/50 p-3 rounded border border-trek-accent/30"
                        >
                          <div className="text-sm text-trek-text/80 mb-1">
                            {objective.description}
                          </div>
                          <Progress
                            value={(objective.current / objective.target) * 100}
                            className="h-2 mb-1"
                          />
                          <div className="text-xs text-trek-text/60">
                            {objective.current}/{objective.target}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-gold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="border-trek-accent text-trek-text hover:bg-trek-accent/20 h-16 flex-col"
                  onClick={() => setActiveTab("events")}
                >
                  <Target className="w-6 h-6 mb-2 text-trek-gold" />
                  <span className="text-xs">View All Events</span>
                </Button>

                <Button
                  variant="outline"
                  className="border-trek-accent text-trek-text hover:bg-trek-accent/20 h-16 flex-col"
                  onClick={() => setActiveTab("seasonpass")}
                >
                  <Trophy className="w-6 h-6 mb-2 text-trek-gold" />
                  <span className="text-xs">Season Pass</span>
                </Button>

                <Button
                  variant="outline"
                  className="border-trek-accent text-trek-text hover:bg-trek-accent/20 h-16 flex-col"
                  onClick={() => setActiveTab("campaigns")}
                >
                  <Rocket className="w-6 h-6 mb-2 text-trek-gold" />
                  <span className="text-xs">Story Campaigns</span>
                </Button>

                <Button
                  variant="outline"
                  className="border-trek-accent text-trek-text hover:bg-trek-accent/20 h-16 flex-col"
                  onClick={() => setActiveTab("leaderboard")}
                >
                  <Award className="w-6 h-6 mb-2 text-trek-gold" />
                  <span className="text-xs">Leaderboards</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {seasonEvents.map((event) => (
              <Card key={event.id} className="bg-trek-panel border-trek-accent">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getEventTypeIcon(event.type)}
                      <CardTitle className="text-trek-gold">
                        {event.name}
                      </CardTitle>
                    </div>
                    <Badge
                      className={`text-xs ${getStatusColor(event.status)}`}
                    >
                      {event.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-trek-text/80">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSeasonIcon(event.season)}
                      <Badge
                        className={`text-xs ${getDifficultyColor(event.difficulty)}`}
                      >
                        {event.difficulty.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs text-trek-text/60">
                      {event.participation.toLocaleString()}/
                      {event.maxParticipants.toLocaleString()} participants
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-trek-gold">
                      Objectives
                    </h4>
                    {event.objectives.slice(0, 2).map((objective) => (
                      <div key={objective.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-trek-text/80">
                            {objective.description}
                          </span>
                          <span className="text-trek-blue">
                            {objective.current}/{objective.target}
                          </span>
                        </div>
                        <Progress
                          value={(objective.current / objective.target) * 100}
                          className="h-1"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-trek-gold">
                      Rewards
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {event.rewards.slice(0, 3).map((reward) => (
                        <Badge
                          key={reward.id}
                          className={`text-xs ${getRarityColor(reward.rarity)}`}
                        >
                          {reward.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {event.status === "active" && (
                      <Button
                        className="flex-1 bg-trek-accent hover:bg-trek-accent/80 text-trek-dark"
                        onClick={() => participateInEvent(event.id)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Participate
                      </Button>
                    )}
                    {event.status === "upcoming" && (
                      <Button
                        className="flex-1 border-trek-accent text-trek-text"
                        variant="outline"
                        disabled
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Starts {event.startDate}
                      </Button>
                    )}
                    {event.status === "completed" && (
                      <Button className="flex-1 bg-trek-gold hover:bg-trek-gold/80 text-trek-dark">
                        <Gift className="w-4 h-4 mr-2" />
                        Claim Rewards
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="seasonpass" className="space-y-6">
          {/* Season Pass Header */}
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-trek-gold flex items-center gap-2">
                    <Trophy className="w-6 h-6" />
                    {seasonPass.name}
                  </CardTitle>
                  <div className="text-sm text-trek-text/70 mt-1">
                    Tier {seasonPass.tier} of {seasonPass.maxTier} •{" "}
                    {seasonPass.daysRemaining} days remaining
                  </div>
                </div>
                {!seasonPass.premiumUnlocked && (
                  <Button className="bg-trek-gold hover:bg-trek-gold/80 text-trek-dark">
                    <Zap className="w-4 h-4 mr-2" />
                    Unlock Premium
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Season Experience</span>
                    <span className="text-trek-blue">
                      {seasonPass.experience.toLocaleString()} XP
                    </span>
                  </div>
                  <Progress
                    value={(seasonPass.experience % 18000) / 180}
                    className="h-3"
                  />
                  <div className="text-xs text-trek-text/60 mt-1">
                    {seasonPass.experienceToNext.toLocaleString()} XP to next
                    tier
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tier Rewards */}
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-gold">
                Season Pass Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Free Track */}
                <div>
                  <h4 className="text-sm font-semibold text-trek-blue mb-3">
                    Free Track
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {seasonPass.freeTracks.map((track) => (
                      <div key={track.tier} className="relative">
                        <Card
                          className={`bg-trek-bg/50 border ${track.unlocked ? "border-trek-blue" : "border-trek-accent/30"}`}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="text-xs text-trek-text/60 mb-2">
                              Tier {track.tier}
                            </div>
                            <div
                              className={`text-sm font-semibold mb-2 ${getRarityColor(track.reward.rarity).split(" ")[0]}`}
                            >
                              {track.reward.name}
                            </div>
                            {track.reward.amount && (
                              <div className="text-xs text-trek-text/60">
                                {track.reward.amount.toLocaleString()}
                              </div>
                            )}
                            {track.unlocked ? (
                              <CheckCircle className="w-4 h-4 text-green-400 mx-auto mt-2" />
                            ) : (
                              <Lock className="w-4 h-4 text-trek-text/40 mx-auto mt-2" />
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Premium Track */}
                <div>
                  <h4 className="text-sm font-semibold text-trek-gold mb-3">
                    Premium Track
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {seasonPass.premiumTracks.map((track) => (
                      <div key={track.tier} className="relative">
                        <Card
                          className={`bg-trek-bg/50 border ${
                            track.unlocked && seasonPass.premiumUnlocked
                              ? "border-trek-gold"
                              : seasonPass.premiumUnlocked
                                ? "border-trek-accent/30"
                                : "border-trek-accent/10"
                          }`}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="text-xs text-trek-text/60 mb-2">
                              Tier {track.tier}
                            </div>
                            <div
                              className={`text-sm font-semibold mb-2 ${getRarityColor(track.reward.rarity).split(" ")[0]}`}
                            >
                              {track.reward.name}
                            </div>
                            {track.reward.amount && (
                              <div className="text-xs text-trek-text/60">
                                {track.reward.amount.toLocaleString()}
                              </div>
                            )}
                            {track.unlocked && seasonPass.premiumUnlocked ? (
                              <CheckCircle className="w-4 h-4 text-green-400 mx-auto mt-2" />
                            ) : !seasonPass.premiumUnlocked ? (
                              <Lock className="w-4 h-4 text-trek-gold/60 mx-auto mt-2" />
                            ) : (
                              <Lock className="w-4 h-4 text-trek-text/40 mx-auto mt-2" />
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          {campaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className="bg-trek-panel border-trek-accent"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-trek-gold flex items-center gap-2">
                      <Rocket className="w-5 h-5" />
                      {campaign.name}
                    </CardTitle>
                    <div className="text-sm text-trek-text/70 mt-1">
                      {campaign.type.toUpperCase()} • Episode{" "}
                      {campaign.currentEpisode} of {campaign.episodes.length}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-trek-text/70">
                      Time Remaining
                    </div>
                    <div className="text-trek-blue font-semibold">
                      {formatTimeRemaining(campaign.timeRemaining)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-trek-text/80">{campaign.description}</p>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-trek-gold">
                    Campaign Episodes
                  </h4>
                  {campaign.episodes.map((episode, index) => (
                    <div
                      key={episode.id}
                      className={`p-4 rounded border ${
                        episode.completed
                          ? "border-green-400 bg-green-400/10"
                          : episode.unlocked
                            ? "border-trek-blue bg-trek-blue/10"
                            : "border-trek-accent/30 bg-trek-bg/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              episode.completed
                                ? "bg-green-400 text-trek-dark"
                                : episode.unlocked
                                  ? "bg-trek-blue text-trek-dark"
                                  : "bg-trek-accent/30 text-trek-text/60"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-trek-text">
                              {episode.name}
                            </div>
                            <div className="text-xs text-trek-text/60">
                              {episode.location} • ~{episode.estimatedTime}{" "}
                              minutes
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {episode.completed && (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          )}
                          {!episode.unlocked && (
                            <Lock className="w-5 h-5 text-trek-text/40" />
                          )}
                          {episode.unlocked && !episode.completed && (
                            <Button
                              size="sm"
                              className="bg-trek-accent hover:bg-trek-accent/80 text-trek-dark"
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Start
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-trek-text/80 mb-3">
                        {episode.description}
                      </p>

                      {episode.objectives.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-trek-gold">
                            Objectives:
                          </div>
                          {episode.objectives.map((objective) => (
                            <div
                              key={objective.id}
                              className="flex items-center gap-2 text-xs"
                            >
                              {objective.completed ? (
                                <CheckCircle className="w-3 h-3 text-green-400" />
                              ) : (
                                <div className="w-3 h-3 rounded-full border border-trek-accent/50" />
                              )}
                              <span
                                className={
                                  objective.completed
                                    ? "text-green-400"
                                    : "text-trek-text/70"
                                }
                              >
                                {objective.description} ({objective.current}/
                                {objective.target})
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-trek-gold">
                    Campaign Rewards
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {campaign.rewards.map((reward) => (
                      <Badge
                        key={reward.id}
                        className={`${getRarityColor(reward.rarity)}`}
                      >
                        {reward.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-gold flex items-center gap-2">
                <Award className="w-5 h-5" />
                Season Leaderboards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center text-trek-text/60">
                  Leaderboard data will be available during active events
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-trek-bg/50 border-trek-accent/30">
                    <CardContent className="p-4 text-center">
                      <Trophy className="w-8 h-8 text-trek-gold mx-auto mb-2" />
                      <div className="text-sm font-semibold text-trek-gold">
                        Event Points
                      </div>
                      <div className="text-xs text-trek-text/60">
                        Top performers in current events
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-trek-bg/50 border-trek-accent/30">
                    <CardContent className="p-4 text-center">
                      <Star className="w-8 h-8 text-trek-blue mx-auto mb-2" />
                      <div className="text-sm font-semibold text-trek-blue">
                        Season Experience
                      </div>
                      <div className="text-xs text-trek-text/60">
                        Highest season pass progression
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-trek-bg/50 border-trek-accent/30">
                    <CardContent className="p-4 text-center">
                      <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-sm font-semibold text-purple-400">
                        Campaign Progress
                      </div>
                      <div className="text-xs text-trek-text/60">
                        Fastest story completion times
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
