import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Medal, Crown } from "lucide-react";

interface AchievementsProps {
  activeSubmenu?: string;
}

export function Achievements({ activeSubmenu }: AchievementsProps) {
  const [achievements] = useState([
    {
      id: 1,
      name: "First Blood",
      description: "Win your first combat",
      icon: "⚔️",
      unlocked: true,
      date: "2026-01-15",
      rarity: "Common",
    },
    {
      id: 2,
      name: "Explorer",
      description: "Discover 10 new systems",
      icon: "🔭",
      unlocked: true,
      date: "2026-01-20",
      rarity: "Common",
    },
    {
      id: 3,
      name: "Fleet Admiral",
      description: "Build a fleet of 50 ships",
      icon: "🚀",
      unlocked: false,
      progress: 32,
      rarity: "Rare",
    },
    {
      id: 4,
      name: "Legendary Commander",
      description: "Win 100 battles",
      icon: "👑",
      unlocked: false,
      progress: 47,
      rarity: "Epic",
    },
    {
      id: 5,
      name: "Diplomat",
      description: "Form 5 alliances",
      icon: "🤝",
      unlocked: false,
      progress: 2,
      rarity: "Rare",
    },
    {
      id: 6,
      name: "Tech Master",
      description: "Research all technologies",
      icon: "⚙️",
      unlocked: false,
      progress: 18,
      rarity: "Legendary",
    },
  ]);

  const rarityColors = {
    Common: "text-trek-green",
    Rare: "text-trek-blue",
    Epic: "text-trek-gold",
    Legendary: "text-orange-500",
  };

  const rarityBorders = {
    Common: "border-trek-green/50",
    Rare: "border-trek-blue/50",
    Epic: "border-trek-gold/50",
    Legendary: "border-orange-500/50",
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalPoints = unlockedCount * 10 + achievements.filter((a) => !a.unlocked).reduce((sum, a) => sum + (a.progress || 0), 0);

  return (
    <div className="space-y-6">
      {/* Achievement Stats */}
      <Card className="bg-trek-panel border-trek-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-trek-gold">
            <Trophy className="w-5 h-5" />
            Achievement Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-trek-dark/50 rounded border border-trek-blue/30">
            <div className="text-trek-text/70 text-sm">Unlocked</div>
            <div className="text-3xl font-bold text-trek-blue">{unlockedCount}</div>
            <div className="text-xs text-trek-text/60 mt-1">/ {achievements.length}</div>
          </div>
          <div className="text-center p-4 bg-trek-dark/50 rounded border border-trek-blue/30">
            <div className="text-trek-text/70 text-sm">Completion</div>
            <div className="text-3xl font-bold text-trek-gold">{Math.round((unlockedCount / achievements.length) * 100)}%</div>
          </div>
          <div className="text-center p-4 bg-trek-dark/50 rounded border border-trek-blue/30">
            <div className="text-trek-text/70 text-sm">Total Points</div>
            <div className="text-3xl font-bold text-trek-green">{totalPoints}</div>
          </div>
          <div className="text-center p-4 bg-trek-dark/50 rounded border border-trek-blue/30">
            <div className="text-trek-text/70 text-sm">Next Tier</div>
            <div className="text-xl font-bold text-orange-400">Elite</div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`bg-trek-dark border-2 ${
              achievement.unlocked
                ? `border-trek-gold ${rarityBorders[achievement.rarity as keyof typeof rarityBorders]}`
                : "border-trek-accent/50"
            }`}
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="text-4xl">{achievement.icon}</div>
                {achievement.unlocked && <Star className="w-5 h-5 text-trek-gold fill-trek-gold" />}
              </div>

              <div>
                <div className={`font-bold ${achievement.unlocked ? "text-trek-gold" : "text-trek-text"}`}>
                  {achievement.name}
                </div>
                <div className="text-xs text-trek-text/60">{achievement.description}</div>
              </div>

              {achievement.unlocked ? (
                <div className="text-xs text-trek-green">
                  ✓ Unlocked {achievement.date}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-trek-text/70">Progress</span>
                    <span className="text-trek-blue">{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-trek-panel rounded h-1.5">
                    <div
                      className="bg-trek-blue h-1.5 rounded transition-all"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className={`text-xs font-semibold ${rarityColors[achievement.rarity as keyof typeof rarityColors]}`}>
                {achievement.rarity}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievement Categories */}
      <Card className="bg-trek-panel border-trek-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-trek-gold">
            <Medal className="w-5 h-5" />
            Achievement Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { category: "Combat Achievements", unlocked: 3, total: 8 },
            { category: "Exploration Achievements", unlocked: 1, total: 10 },
            { category: "Diplomacy Achievements", unlocked: 0, total: 6 },
            { category: "Science Achievements", unlocked: 2, total: 7 },
            { category: "Building Achievements", unlocked: 0, total: 5 },
            { category: "Event Achievements", unlocked: 0, total: 4 },
          ].map((cat, idx) => (
            <div key={idx} className="bg-trek-dark/50 p-3 rounded border border-trek-blue/30">
              <div className="flex justify-between mb-2">
                <span className="text-trek-text text-sm font-semibold">{cat.category}</span>
                <span className="text-trek-blue font-bold text-sm">
                  {cat.unlocked}/{cat.total}
                </span>
              </div>
              <div className="w-full bg-trek-dark rounded h-2">
                <div
                  className="bg-trek-gold h-2 rounded"
                  style={{ width: `${(cat.unlocked / cat.total) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reward Shop */}
      <Card className="bg-trek-panel border-trek-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-trek-gold">
            <Crown className="w-5 h-5" />
            Reward Shop
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Premium Badge", cost: 100, type: "Cosmetic" },
              { name: "Extra Fleet Slot", cost: 250, type: "Gameplay" },
              { name: "Research Boost", cost: 150, type: "Gameplay" },
            ].map((reward, idx) => (
              <div key={idx} className="bg-trek-dark/50 p-3 rounded border border-trek-gold/30 text-center">
                <div className="font-bold text-trek-gold text-sm mb-1">{reward.name}</div>
                <div className="text-xs text-trek-text/60 mb-3">{reward.type}</div>
                <Button
                  size="sm"
                  className="w-full bg-trek-gold hover:bg-trek-gold/80 text-trek-dark"
                >
                  {reward.cost} Points
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
