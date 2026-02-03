import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  Star,
  Trophy,
  Target,
  Users,
  Globe,
  Zap,
  Shield,
  Book,
  Clock,
  TrendingUp,
  CheckCircle,
  Lock,
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  category:
    | "Combat"
    | "Exploration"
    | "Diplomacy"
    | "Science"
    | "Command"
    | "Engineering";
  points: number;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  unlocked: boolean;
  progress: number;
  max_progress: number;
  unlock_date?: string;
  icon: React.ReactNode;
  prerequisites?: string[];
}

interface Rank {
  id: string;
  name: string;
  insignia: string;
  required_points: number;
  unlocked: boolean;
  unlock_date?: string;
}

interface PlayerStats {
  total_points: number;
  current_rank: string;
  missions_completed: number;
  combat_victories: number;
  diplomatic_successes: number;
  scientific_discoveries: number;
  systems_explored: number;
  time_played_hours: number;
}

export function Achievements() {
  const [activeTab, setActiveTab] = useState<
    "achievements" | "ranks" | "stats"
  >("achievements");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    total_points: 2847,
    current_rank: "Commander",
    missions_completed: 47,
    combat_victories: 23,
    diplomatic_successes: 12,
    scientific_discoveries: 31,
    systems_explored: 89,
    time_played_hours: 156,
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first_command",
      title: "First Command",
      description:
        "Successfully complete your first mission as commanding officer",
      category: "Command",
      points: 100,
      rarity: "Common",
      unlocked: true,
      progress: 1,
      max_progress: 1,
      unlock_date: "2024-01-15",
      icon: <Award className="w-5 h-5" />,
    },
    {
      id: "borg_encounter",
      title: "Resistance is Futile",
      description: "Survive an encounter with a Borg cube",
      category: "Combat",
      points: 500,
      rarity: "Epic",
      unlocked: true,
      progress: 1,
      max_progress: 1,
      unlock_date: "2024-01-20",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      id: "first_contact",
      title: "First Contact Protocol",
      description:
        "Successfully establish peaceful relations with a new species",
      category: "Diplomacy",
      points: 300,
      rarity: "Rare",
      unlocked: true,
      progress: 1,
      max_progress: 1,
      unlock_date: "2024-01-18",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "explorer",
      title: "Strange New Worlds",
      description: "Explore 100 different star systems",
      category: "Exploration",
      points: 250,
      rarity: "Rare",
      unlocked: false,
      progress: 89,
      max_progress: 100,
      icon: <Globe className="w-5 h-5" />,
    },
    {
      id: "scientist",
      title: "Scientific Method",
      description: "Complete 50 scientific discoveries",
      category: "Science",
      points: 400,
      rarity: "Epic",
      unlocked: false,
      progress: 31,
      max_progress: 50,
      icon: <Book className="w-5 h-5" />,
    },
    {
      id: "combat_master",
      title: "Tactical Superiority",
      description: "Win 50 combat encounters",
      category: "Combat",
      points: 350,
      rarity: "Rare",
      unlocked: false,
      progress: 23,
      max_progress: 50,
      icon: <Target className="w-5 h-5" />,
    },
    {
      id: "prime_directive",
      title: "Prime Directive Guardian",
      description: "Complete 20 missions without violating the Prime Directive",
      category: "Diplomacy",
      points: 600,
      rarity: "Legendary",
      unlocked: false,
      progress: 8,
      max_progress: 20,
      icon: <Star className="w-5 h-5" />,
    },
    {
      id: "warp_master",
      title: "Warp Drive Engineer",
      description: "Successfully maintain warp core for 1000 hours",
      category: "Engineering",
      points: 200,
      rarity: "Common",
      unlocked: false,
      progress: 743,
      max_progress: 1000,
      icon: <Zap className="w-5 h-5" />,
    },
    {
      id: "time_warrior",
      title: "Temporal Guardian",
      description:
        "Resolve a temporal paradox without causing timeline contamination",
      category: "Science",
      points: 800,
      rarity: "Legendary",
      unlocked: false,
      progress: 0,
      max_progress: 1,
      icon: <Clock className="w-5 h-5" />,
      prerequisites: ["scientist", "prime_directive"],
    },
    {
      id: "fleet_admiral",
      title: "Fleet Admiral",
      description: "Command a fleet of 10 starships simultaneously",
      category: "Command",
      points: 1000,
      rarity: "Legendary",
      unlocked: false,
      progress: 0,
      max_progress: 1,
      icon: <Trophy className="w-5 h-5" />,
      prerequisites: ["first_command", "combat_master"],
    },
  ]);

  const ranks: Rank[] = [
    {
      id: "ensign",
      name: "Ensign",
      insignia: "●",
      required_points: 0,
      unlocked: true,
      unlock_date: "2024-01-10",
    },
    {
      id: "lieutenant_jg",
      name: "Lieutenant (Junior Grade)",
      insignia: "●●",
      required_points: 500,
      unlocked: true,
      unlock_date: "2024-01-12",
    },
    {
      id: "lieutenant",
      name: "Lieutenant",
      insignia: "●●●",
      required_points: 1000,
      unlocked: true,
      unlock_date: "2024-01-15",
    },
    {
      id: "lt_commander",
      name: "Lieutenant Commander",
      insignia: "●●●●",
      required_points: 2000,
      unlocked: true,
      unlock_date: "2024-01-18",
    },
    {
      id: "commander",
      name: "Commander",
      insignia: "●●●●●",
      required_points: 4000,
      unlocked: false,
      progress: 2847,
    },
    {
      id: "captain",
      name: "Captain",
      insignia: "★★★★",
      required_points: 8000,
      unlocked: false,
      progress: 2847,
    },
    {
      id: "commodore",
      name: "Commodore",
      insignia: "★★★★★",
      required_points: 15000,
      unlocked: false,
      progress: 2847,
    },
    {
      id: "admiral",
      name: "Admiral",
      insignia: "★★★★★★",
      required_points: 25000,
      unlocked: false,
      progress: 2847,
    },
  ];

  const categories = [
    "All",
    "Combat",
    "Exploration",
    "Diplomacy",
    "Science",
    "Command",
    "Engineering",
  ];

  const filteredAchievements =
    selectedCategory === "All"
      ? achievements
      : achievements.filter((a) => a.category === selectedCategory);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return "text-purple-400 border-purple-400 bg-purple-400/20";
      case "Epic":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Rare":
        return "text-blue-400 border-blue-400 bg-blue-400/20";
      case "Common":
        return "text-green-400 border-green-400 bg-green-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Combat":
        return "text-red-400 border-red-400 bg-red-400/20";
      case "Exploration":
        return "text-blue-400 border-blue-400 bg-blue-400/20";
      case "Diplomacy":
        return "text-green-400 border-green-400 bg-green-400/20";
      case "Science":
        return "text-purple-400 border-purple-400 bg-purple-400/20";
      case "Command":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Engineering":
        return "text-orange-400 border-orange-400 bg-orange-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  const currentRank = ranks.find((r) => r.name === playerStats.current_rank);
  const nextRank = ranks.find(
    (r) => !r.unlocked && r.required_points > playerStats.total_points,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          ACHIEVEMENTS & PROGRESSION
        </h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "achievements" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "achievements"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("achievements")}
          >
            <Award className="w-4 h-4 mr-2" />
            Achievements
          </Button>
          <Button
            variant={activeTab === "ranks" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "ranks"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("ranks")}
          >
            <Trophy className="w-4 h-4 mr-2" />
            Ranks
          </Button>
          <Button
            variant={activeTab === "stats" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "stats"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("stats")}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Statistics
          </Button>
        </div>
      </div>

      {/* Player Summary */}
      <Card className="bg-trek-panel border-trek-accent p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-trek-gold">
              {playerStats.total_points.toLocaleString()}
            </div>
            <div className="text-sm text-trek-text/70">Achievement Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-trek-blue">
              {currentRank?.name}
            </div>
            <div className="text-sm text-trek-text/70">Current Rank</div>
            <div className="text-trek-gold text-lg">
              {currentRank?.insignia}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-trek-blue">
              {achievements.filter((a) => a.unlocked).length}/
              {achievements.length}
            </div>
            <div className="text-sm text-trek-text/70">
              Achievements Unlocked
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-trek-blue">
              {playerStats.time_played_hours}h
            </div>
            <div className="text-sm text-trek-text/70">Time Played</div>
          </div>
        </div>

        {nextRank && (
          <div className="mt-4 pt-4 border-t border-trek-accent">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress to {nextRank.name}</span>
              <span className="text-trek-blue">
                {playerStats.total_points}/{nextRank.required_points}
              </span>
            </div>
            <Progress
              value={
                (playerStats.total_points / nextRank.required_points) * 100
              }
            />
          </div>
        )}
      </Card>

      {activeTab === "achievements" && (
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

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`bg-trek-panel border-trek-accent p-4 ${
                  achievement.unlocked ? "border-trek-gold" : "opacity-75"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-2xl ${achievement.unlocked ? "text-trek-gold" : "text-trek-text/40"}`}
                    >
                      {achievement.unlocked ? (
                        achievement.icon
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </span>
                    <div>
                      <h4 className="font-bold text-trek-gold">
                        {achievement.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getCategoryColor(achievement.category)}`}
                        >
                          {achievement.category}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getRarityColor(achievement.rarity)}`}
                        >
                          {achievement.rarity}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {achievement.unlocked && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </div>

                <p className="text-sm text-trek-text/80 mb-3">
                  {achievement.description}
                </p>

                {!achievement.unlocked && achievement.max_progress > 1 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-trek-text/70">Progress</span>
                      <span className="text-trek-blue">
                        {achievement.progress}/{achievement.max_progress}
                      </span>
                    </div>
                    <Progress
                      value={
                        (achievement.progress / achievement.max_progress) * 100
                      }
                      className="h-2"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-trek-gold font-semibold">
                    {achievement.points} pts
                  </span>
                  {achievement.unlock_date && (
                    <span className="text-trek-text/70">
                      Unlocked: {achievement.unlock_date}
                    </span>
                  )}
                </div>

                {achievement.prerequisites && !achievement.unlocked && (
                  <div className="mt-2 pt-2 border-t border-trek-accent">
                    <div className="text-xs text-trek-text/70 mb-1">
                      Prerequisites:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {achievement.prerequisites.map((prereq, i) => {
                        const prereqAchievement = achievements.find(
                          (a) => a.id === prereq,
                        );
                        return (
                          <Badge
                            key={i}
                            variant="outline"
                            className={`text-xs ${
                              prereqAchievement?.unlocked
                                ? "border-green-400 text-green-400"
                                : "border-red-400 text-red-400"
                            }`}
                          >
                            {prereqAchievement?.title}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "ranks" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ranks.map((rank) => (
            <Card
              key={rank.id}
              className={`bg-trek-panel border-trek-accent p-6 ${
                rank.name === playerStats.current_rank
                  ? "border-trek-gold bg-trek-gold/5"
                  : ""
              } ${!rank.unlocked ? "opacity-75" : ""}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl text-trek-gold">
                    {rank.insignia}
                  </span>
                  <div>
                    <h3 className="font-bold text-trek-gold">{rank.name}</h3>
                    <p className="text-sm text-trek-blue">
                      {rank.required_points.toLocaleString()} points required
                    </p>
                  </div>
                </div>

                {rank.unlocked && (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                )}

                {rank.name === playerStats.current_rank && (
                  <Badge
                    variant="secondary"
                    className="bg-trek-gold/20 text-trek-gold border-trek-gold"
                  >
                    Current
                  </Badge>
                )}
              </div>

              {!rank.unlocked && rank.required_points > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="text-trek-blue">
                      {playerStats.total_points}/{rank.required_points}
                    </span>
                  </div>
                  <Progress
                    value={
                      (playerStats.total_points / rank.required_points) * 100
                    }
                  />
                </div>
              )}

              {rank.unlock_date && (
                <div className="text-xs text-trek-text/70 mt-2">
                  Achieved: {rank.unlock_date}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {activeTab === "stats" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-trek-panel border-trek-accent p-6 text-center">
            <Star className="w-8 h-8 text-trek-gold mx-auto mb-2" />
            <div className="text-2xl font-bold text-trek-blue">
              {playerStats.missions_completed}
            </div>
            <div className="text-sm text-trek-text/70">Missions Completed</div>
          </Card>

          <Card className="bg-trek-panel border-trek-accent p-6 text-center">
            <Target className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-trek-blue">
              {playerStats.combat_victories}
            </div>
            <div className="text-sm text-trek-text/70">Combat Victories</div>
          </Card>

          <Card className="bg-trek-panel border-trek-accent p-6 text-center">
            <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-trek-blue">
              {playerStats.diplomatic_successes}
            </div>
            <div className="text-sm text-trek-text/70">
              Diplomatic Successes
            </div>
          </Card>

          <Card className="bg-trek-panel border-trek-accent p-6 text-center">
            <Book className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-trek-blue">
              {playerStats.scientific_discoveries}
            </div>
            <div className="text-sm text-trek-text/70">
              Scientific Discoveries
            </div>
          </Card>

          <Card className="bg-trek-panel border-trek-accent p-6 text-center">
            <Globe className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-trek-blue">
              {playerStats.systems_explored}
            </div>
            <div className="text-sm text-trek-text/70">Systems Explored</div>
          </Card>

          <Card className="bg-trek-panel border-trek-accent p-6 text-center">
            <Clock className="w-8 h-8 text-trek-blue mx-auto mb-2" />
            <div className="text-2xl font-bold text-trek-blue">
              {playerStats.time_played_hours}h
            </div>
            <div className="text-sm text-trek-text/70">Time Played</div>
          </Card>
        </div>
      )}
    </div>
  );
}
