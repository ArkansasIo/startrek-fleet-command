import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, TrendingUp, Award } from "lucide-react";

interface AnalyticsProps {
  activeSubmenu?: string;
}

export function Analytics({ activeSubmenu }: AnalyticsProps) {
  const sessionStats = {
    playtime: "47h 23m",
    sessionsPlayed: 156,
    avgSessionLength: "18m 12s",
    lastSession: "2 hours ago",
  };

  const combatStats = {
    totalBattles: 247,
    wins: 189,
    losses: 58,
    winRate: 76.5,
    averageDamage: 3847,
    totalDamageDealt: 950203,
  };

  const economyStats = {
    totalCredits: 127450,
    creditsEarned: 450000,
    creditsSpent: 322550,
    profitMargin: 127450,
    tradingTransactions: 1247,
  };

  const progressionStats = {
    currentLevel: 62,
    experience: 847500,
    nextLevelExp: 100000,
    achievementsUnlocked: 34,
    achievementsTotal: 87,
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-trek-panel border-trek-accent">
          <CardContent className="p-4">
            <div className="text-trek-text/70 text-sm mb-2">Play Time</div>
            <div className="text-2xl font-bold text-trek-gold">{sessionStats.playtime}</div>
            <div className="text-xs text-trek-text/60 mt-2">{sessionStats.sessionsPlayed} sessions</div>
          </CardContent>
        </Card>

        <Card className="bg-trek-panel border-trek-accent">
          <CardContent className="p-4">
            <div className="text-trek-text/70 text-sm mb-2">Win Rate</div>
            <div className="text-2xl font-bold text-trek-green">{combatStats.winRate}%</div>
            <div className="text-xs text-trek-text/60 mt-2">{combatStats.wins}W - {combatStats.losses}L</div>
          </CardContent>
        </Card>

        <Card className="bg-trek-panel border-trek-accent">
          <CardContent className="p-4">
            <div className="text-trek-text/70 text-sm mb-2">Net Worth</div>
            <div className="text-2xl font-bold text-trek-gold">{economyStats.totalCredits.toLocaleString()}</div>
            <div className="text-xs text-trek-text/60 mt-2">Credits</div>
          </CardContent>
        </Card>

        <Card className="bg-trek-panel border-trek-accent">
          <CardContent className="p-4">
            <div className="text-trek-text/70 text-sm mb-2">Level</div>
            <div className="text-2xl font-bold text-trek-blue">{progressionStats.currentLevel}</div>
            <div className="text-xs text-trek-text/60 mt-2">
              {progressionStats.experience.toLocaleString()} XP
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <Card className="bg-trek-panel border-trek-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-trek-gold">
            <BarChart3 className="w-5 h-5" />
            Combat Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="font-bold text-trek-blue">Battles</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-trek-text/70">Total</span>
                <span className="font-bold text-trek-blue">{combatStats.totalBattles}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-trek-text/70">Victories</span>
                <span className="font-bold text-trek-green">{combatStats.wins}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-trek-text/70">Defeats</span>
                <span className="font-bold text-red-400">{combatStats.losses}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-trek-blue">Damage</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-trek-text/70">Average</span>
                <span className="font-bold text-trek-gold">{combatStats.averageDamage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-trek-text/70">Total Dealt</span>
                <span className="font-bold text-trek-gold">
                  {(combatStats.totalDamageDealt / 1000).toFixed(1)}K
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-trek-blue">Performance</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-trek-text/70">Win Rate</span>
                <span className="font-bold text-trek-green">{combatStats.winRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-trek-text/70">K/D Ratio</span>
                <span className="font-bold text-trek-blue">3.26</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Economy Statistics */}
      <Card className="bg-trek-panel border-trek-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-trek-gold">
            <TrendingUp className="w-5 h-5" />
            Economy Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="font-bold text-trek-blue">Flow</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-trek-text/70">Earned</span>
                <span className="font-bold text-trek-green">+{economyStats.creditsEarned.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-trek-text/70">Spent</span>
                <span className="font-bold text-red-400">-{economyStats.creditsSpent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-trek-accent">
                <span className="text-trek-text/70">Net</span>
                <span className="font-bold text-trek-gold">+{economyStats.profitMargin.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-trek-blue">Trading</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-trek-text/70">Transactions</span>
                <span className="font-bold text-trek-blue">{economyStats.tradingTransactions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-trek-text/70">Avg. Value</span>
                <span className="font-bold text-trek-blue">
                  {Math.round(economyStats.creditsEarned / economyStats.tradingTransactions)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-trek-blue">Assets</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-trek-text/70">Current Balance</span>
                <span className="font-bold text-trek-gold">{economyStats.totalCredits.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-trek-text/70">Assets Value</span>
                <span className="font-bold text-trek-blue">450,000</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progression Statistics */}
      <Card className="bg-trek-panel border-trek-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-trek-gold">
            <Award className="w-5 h-5" />
            Progression & Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-trek-text">Level {progressionStats.currentLevel}</span>
              <span className="text-trek-text/60 text-sm">
                {progressionStats.experience.toLocaleString()} / {(progressionStats.experience + progressionStats.nextLevelExp).toLocaleString()} XP
              </span>
            </div>
            <div className="w-full bg-trek-dark rounded h-4">
              <div
                className="bg-trek-gold h-4 rounded transition-all"
                style={{ width: `${(progressionStats.experience / (progressionStats.experience + progressionStats.nextLevelExp)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-trek-dark/50 rounded border border-trek-blue/30">
              <div className="text-trek-text/70 text-sm">Achievements</div>
              <div className="text-2xl font-bold text-trek-gold">{progressionStats.achievementsUnlocked}</div>
              <div className="text-xs text-trek-text/60">/ {progressionStats.achievementsTotal}</div>
            </div>
            <div className="text-center p-3 bg-trek-dark/50 rounded border border-trek-blue/30">
              <div className="text-trek-text/70 text-sm">Completion</div>
              <div className="text-2xl font-bold text-trek-green">
                {Math.round((progressionStats.achievementsUnlocked / progressionStats.achievementsTotal) * 100)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
