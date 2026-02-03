import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Trophy,
  Star,
  Award,
  Target,
  Zap,
  TrendingUp,
  Lock,
  Unlock,
  Gift,
  Shield,
  Wrench,
  Lightbulb,
} from "lucide-react";

type AchievementCategory = "combat" | "exploration" | "diplomacy" | "engineering" | "science" | "milestone";
type AchievementTier = "bronze" | "silver" | "gold" | "platinum";

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  tier: AchievementTier;
  icon: any;
  unlocked: boolean;
  progress: number;
  requirement: number;
  reward_credits: number;
  reward_xp: number;
  reward_points: number;
  unlock_date?: Date;
}

interface PlayerLevel {
  level: number;
  current_xp: number;
  xp_to_next: number;
  title: string;
  progression_milestone: string;
}

export function AchievementProgressionUI() {
  const [playerLevel, setPlayerLevel] = useState<PlayerLevel>({
    level: 42,
    current_xp: 7500,
    xp_to_next: 10000,
    title: "Fleet Admiral",
    progression_milestone: "Veteran Commander",
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "ach_001",
      name: "First Blood",
      description: "Win your first space combat encounter",
      category: "combat",
      tier: "bronze",
      icon: <Zap className="h-6 w-6" />,
      unlocked: true,
      progress: 1,
      requirement: 1,
      reward_credits: 1000,
      reward_xp: 500,
      reward_points: 10,
      unlock_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: "ach_002",
      name: "Conqueror",
      description: "Win 50 space combat encounters",
      category: "combat",
      tier: "gold",
      icon: <Shield className="h-6 w-6" />,
      unlocked: true,
      progress: 45,
      requirement: 50,
      reward_credits: 50000,
      reward_xp: 25000,
      reward_points: 100,
      unlock_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: "ach_003",
      name: "Explorer's Spirit",
      description: "Discover 20 new systems",
      category: "exploration",
      tier: "silver",
      icon: <Target className="h-6 w-6" />,
      unlocked: false,
      progress: 12,
      requirement: 20,
      reward_credits: 25000,
      reward_xp: 15000,
      reward_points: 50,
    },
    {
      id: "ach_004",
      name: "Diplomat",
      description: "Establish treaties with 4 factions",
      category: "diplomacy",
      tier: "silver",
      icon: <Trophy className="h-6 w-6" />,
      unlocked: true,
      progress: 4,
      requirement: 4,
      reward_credits: 30000,
      reward_xp: 20000,
      reward_points: 75,
      unlock_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      id: "ach_005",
      name: "Master Engineer",
      description: "Upgrade 100 ship components",
      category: "engineering",
      tier: "platinum",
      icon: <Wrench className="h-6 w-6" />,
      unlocked: false,
      progress: 67,
      requirement: 100,
      reward_credits: 75000,
      reward_xp: 50000,
      reward_points: 150,
    },
    {
      id: "ach_006",
      name: "Science Officer",
      description: "Complete 25 scientific missions",
      category: "science",
      tier: "gold",
      icon: <Lightbulb className="h-6 w-6" />,
      unlocked: true,
      progress: 25,
      requirement: 25,
      reward_credits: 40000,
      reward_xp: 30000,
      reward_points: 100,
      unlock_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "ach_007",
      name: "Century Traveler",
      description: "Travel 100,000 light years",
      category: "exploration",
      tier: "platinum",
      icon: <Star className="h-6 w-6" />,
      unlocked: false,
      progress: 75000,
      requirement: 100000,
      reward_credits: 100000,
      reward_xp: 75000,
      reward_points: 200,
    },
    {
      id: "ach_008",
      name: "Legendary Commander",
      description: "Reach level 50",
      category: "milestone",
      tier: "platinum",
      icon: <Award className="h-6 w-6" />,
      unlocked: false,
      progress: 42,
      requirement: 50,
      reward_credits: 150000,
      reward_xp: 100000,
      reward_points: 250,
    },
  ]);

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedAchievementId, setSelectedAchievementId] = useState<string | null>("ach_001");

  const xpProgress = useMemo(() => {
    return (playerLevel.current_xp / playerLevel.xp_to_next) * 100;
  }, [playerLevel]);

  const selectedAchievement = useMemo(() => {
    return achievements.find((a) => a.id === selectedAchievementId);
  }, [achievements, selectedAchievementId]);

  const filteredAchievements = useMemo(() => {
    return achievements.filter((a) => {
      if (filterCategory !== "all" && a.category !== filterCategory) return false;
      if (filterStatus === "unlocked" && !a.unlocked) return false;
      if (filterStatus === "locked" && a.unlocked) return false;
      return true;
    });
  }, [achievements, filterCategory, filterStatus]);

  const stats = useMemo(() => {
    const unlockedCount = achievements.filter((a) => a.unlocked).length;
    const totalPoints = achievements.reduce((sum, a) => (a.unlocked ? sum + a.reward_points : sum), 0);
    const completionPercentage = Math.round((unlockedCount / achievements.length) * 100);

    return {
      unlockedCount,
      totalCount: achievements.length,
      totalPoints,
      completionPercentage,
    };
  }, [achievements]);

  const getTierColor = (tier: AchievementTier) => {
    switch (tier) {
      case "bronze":
        return "bg-orange-600";
      case "silver":
        return "bg-slate-400";
      case "gold":
        return "bg-yellow-500";
      case "platinum":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleClaimReward = (achievementId: string) => {
    setAchievements((prev) =>
      prev.map((a) =>
        a.id === achievementId
          ? {
              ...a,
              unlocked: true,
              unlock_date: new Date(),
            }
          : a
      )
    );
  };

  const getMilestones = () => {
    const milestones = [
      { level: 10, title: "Ensign", bonus: "5000 credits" },
      { level: 25, title: "Captain", bonus: "25000 credits" },
      { level: 50, title: "Admiral", bonus: "100000 credits" },
      { level: 75, title: "Legend", bonus: "250000 credits" },
    ];
    return milestones;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Achievement & Progression</h1>
          <p className="text-muted-foreground mt-1">
            Track your accomplishments and level progression
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Points</p>
          <p className="text-3xl font-bold text-yellow-500">{stats.totalPoints}</p>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <CardContent className="pt-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-2xl font-bold">{playerLevel.title}</p>
                <p className="text-sm text-muted-foreground">{playerLevel.progression_milestone}</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-cyan-400">Level {playerLevel.level}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Experience to Next Level</span>
                <span>
                  {playerLevel.current_xp.toLocaleString()} / {playerLevel.xp_to_next.toLocaleString()}
                </span>
              </div>
              <Progress value={xpProgress} className="h-3" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{stats.unlockedCount}</p>
              <p className="text-xs text-muted-foreground">Achievements</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{stats.completionPercentage}%</p>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">{playerLevel.level}</p>
              <p className="text-xs text-muted-foreground">Current Level</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">
                {stats.unlockedCount === stats.totalCount ? "100" : "Next"}
              </p>
              <p className="text-xs text-muted-foreground">Milestone</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <select
              className="border rounded px-3 py-2"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="combat">Combat</option>
              <option value="exploration">Exploration</option>
              <option value="diplomacy">Diplomacy</option>
              <option value="engineering">Engineering</option>
              <option value="science">Science</option>
              <option value="milestone">Milestone</option>
            </select>

            <select
              className="border rounded px-3 py-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="unlocked">Unlocked</option>
              <option value="locked">Locked</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ScrollArea className="lg:col-span-2 h-[600px]">
              <div className="space-y-3 pr-4">
                {filteredAchievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={`cursor-pointer ${selectedAchievementId === achievement.id ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setSelectedAchievementId(achievement.id)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded ${getTierColor(achievement.tier)} text-white`}
                          >
                            {achievement.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold flex items-center gap-2">
                              {achievement.name}
                              {!achievement.unlocked && <Lock className="h-4 w-4" />}
                              {achievement.unlocked && <Unlock className="h-4 w-4 text-green-500" />}
                            </h3>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                        </div>
                        <Badge className={`${getTierColor(achievement.tier)} text-white`}>
                          {achievement.tier.toUpperCase()}
                        </Badge>
                      </div>

                      {achievement.progress < achievement.requirement && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>
                              {achievement.progress} / {achievement.requirement}
                            </span>
                          </div>
                          <Progress value={(achievement.progress / achievement.requirement) * 100} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            {selectedAchievement && (
              <Card className="border-2 border-primary lg:col-span-1">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className={`p-4 rounded ${getTierColor(selectedAchievement.tier)} text-white text-center`}>
                      {selectedAchievement.icon}
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">{selectedAchievement.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {selectedAchievement.description}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Tier:</strong>{" "}
                        {selectedAchievement.tier.charAt(0).toUpperCase() +
                          selectedAchievement.tier.slice(1)}
                      </p>
                      <p>
                        <strong>Category:</strong>{" "}
                        {selectedAchievement.category.charAt(0).toUpperCase() +
                          selectedAchievement.category.slice(1)}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span className={selectedAchievement.unlocked ? "text-green-500" : "text-yellow-500"}>
                          {selectedAchievement.unlocked ? "UNLOCKED" : "LOCKED"}
                        </span>
                      </p>
                    </div>

                    <div className="bg-muted p-3 rounded space-y-1">
                      <p className="text-xs font-medium">REWARDS</p>
                      <p className="text-sm text-green-500">
                        {selectedAchievement.reward_credits.toLocaleString()} Credits
                      </p>
                      <p className="text-sm text-blue-500">
                        {selectedAchievement.reward_xp.toLocaleString()} XP
                      </p>
                      <p className="text-sm text-yellow-500">
                        {selectedAchievement.reward_points} Points
                      </p>
                    </div>

                    {!selectedAchievement.unlocked && selectedAchievement.progress >= selectedAchievement.requirement && (
                      <Button
                        onClick={() => handleClaimReward(selectedAchievement.id)}
                        className="w-full"
                      >
                        <Gift className="h-4 w-4 mr-2" />
                        Claim Reward
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="milestones">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4 pr-4">
              {getMilestones().map((milestone) => (
                <Card
                  key={milestone.level}
                  className={milestone.level <= playerLevel.level ? "bg-green-900/20 border-green-500" : ""}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold">Level {milestone.level}</h3>
                        <p className="text-muted-foreground">{milestone.title}</p>
                      </div>

                      <div className="text-right">
                        {milestone.level <= playerLevel.level ? (
                          <div>
                            <p className="text-green-500 text-sm font-semibold">ACHIEVED</p>
                            <p className="text-sm text-muted-foreground">Reward: {milestone.bonus}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-yellow-500 text-sm font-semibold">IN PROGRESS</p>
                            <p className="text-sm text-muted-foreground">
                              {Math.ceil(((milestone.level - playerLevel.level) / milestone.level) * 100)}%
                              {" "}remaining
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Progress
                      value={(Math.min(playerLevel.level, milestone.level) / milestone.level) * 100}
                      className="mt-3"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="rewards">
          <Card>
            <CardHeader>
              <CardTitle>Claim Available Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3 pr-4">
                  {achievements
                    .filter((a) => a.unlocked && !a.unlock_date)
                    .map((achievement) => (
                      <Card key={achievement.id}>
                        <CardContent className="pt-4 flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{achievement.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {achievement.reward_credits.toLocaleString()} credits + {achievement.reward_xp} XP
                            </p>
                          </div>
                          <Button size="sm">Claim</Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
