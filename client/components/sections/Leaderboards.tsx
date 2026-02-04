import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Zap } from "lucide-react";

interface LeaderboardsProps {
  activeSubmenu?: string;
}

export function Leaderboards({ activeSubmenu }: LeaderboardsProps) {
  const [activeCategory, setActiveCategory] = useState<"combat" | "exploration" | "economy" | "overall">("overall");

  const overallLeaders = [
    { rank: 1, name: "Admiral Picard", level: 87, points: 125430, empire: "Federation" },
    { rank: 2, name: "General Gowron", level: 85, points: 118950, empire: "Klingon" },
    { rank: 3, name: "Praetor Tr'Lek", level: 82, points: 112340, empire: "Romulan" },
    { rank: 4, name: "Legate Dukat", level: 80, points: 105670, empire: "Cardassian" },
    { rank: 5, name: "Daimon Bok", level: 78, points: 98450, empire: "Ferengi" },
  ];

  const combatLeaders = [
    { rank: 1, name: "Worf Son of Mogh", wins: 2847, losses: 342, winRate: 89.3 },
    { rank: 2, name: "James T. Kirk", wins: 2654, losses: 289, winRate: 90.2 },
    { rank: 3, name: "Benjamin Sisko", wins: 1923, losses: 456, winRate: 80.8 },
    { rank: 4, name: "Chakotay", wins: 1654, losses: 512, winRate: 76.4 },
    { rank: 5, name: "Kathryn Janeway", wins: 1876, losses: 398, winRate: 82.5 },
  ];

  const explorationLeaders = [
    { rank: 1, name: "Q", systems: 4892, discoveries: 1247, coverage: 94.2 },
    { rank: 2, name: "Spock", systems: 4231, discoveries: 1089, coverage: 89.5 },
    { rank: 3, name: "Data", systems: 3945, discoveries: 987, coverage: 84.3 },
    { rank: 4, name: "Captain Kirk", systems: 3654, discoveries: 876, coverage: 78.9 },
    { rank: 5, name: "Seven of Nine", systems: 3421, discoveries: 754, coverage: 73.2 },
  ];

  const economyLeaders = [
    { rank: 1, name: "Ferengi Consortium", credits: 9845000, tradingVolume: 125000, profit: 234500 },
    { rank: 2, name: "Federation Trade Commission", credits: 8765000, tradingVolume: 98500, profit: 187600 },
    { rank: 3, name: "Klingon Commerce Guild", credits: 7234000, tradingVolume: 76800, profit: 145300 },
    { rank: 4, name: "Romulan Merchants", credits: 6543000, tradingVolume: 65400, profit: 124200 },
    { rank: 5, name: "Cardassian Trade", credits: 5876000, tradingVolume: 54300, profit: 98700 },
  ];

  const categories = [
    { id: "overall", label: "Overall Rankings", icon: "🏆" },
    { id: "combat", label: "Combat Masters", icon: "⚔️" },
    { id: "exploration", label: "Explorers", icon: "🔭" },
    { id: "economy", label: "Trade Empires", icon: "💰" },
  ];

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`p-3 rounded border transition ${
              activeCategory === cat.id
                ? "bg-trek-gold text-trek-dark border-trek-gold"
                : "bg-trek-panel border-trek-accent text-trek-text hover:border-trek-gold"
            }`}
          >
            <div className="text-xl mb-1">{cat.icon}</div>
            <div className="text-xs font-bold">{cat.label}</div>
          </button>
        ))}
      </div>

      {/* Overall Rankings */}
      {activeCategory === "overall" && (
        <div className="space-y-4">
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-trek-gold">
                <BarChart3 className="w-5 h-5" />
                Top Commanders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {overallLeaders.map((leader) => (
                <div
                  key={leader.rank}
                  className={`p-3 rounded border flex items-center justify-between ${
                    leader.rank === 1
                      ? "bg-trek-gold/10 border-trek-gold"
                      : leader.rank === 2
                      ? "bg-trek-blue/10 border-trek-blue"
                      : leader.rank === 3
                      ? "bg-orange-500/10 border-orange-500"
                      : "bg-trek-dark border-trek-accent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      leader.rank === 1 ? "bg-trek-gold text-trek-dark" :
                      leader.rank === 2 ? "bg-trek-blue text-trek-dark" :
                      leader.rank === 3 ? "bg-orange-500 text-trek-dark" :
                      "bg-trek-panel text-trek-text"
                    }`}>
                      {leader.rank}
                    </div>
                    <div>
                      <div className="font-bold text-trek-gold">{leader.name}</div>
                      <div className="text-xs text-trek-text/60">{leader.empire} • Level {leader.level}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-trek-blue">{leader.points.toLocaleString()}</div>
                    <div className="text-xs text-trek-text/60">points</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Combat Rankings */}
      {activeCategory === "combat" && (
        <div className="space-y-4">
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-500">
                <TrendingUp className="w-5 h-5" />
                Combat Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {combatLeaders.map((leader) => (
                <div key={leader.rank} className="bg-trek-dark/50 p-3 rounded border border-trek-accent">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-trek-gold text-lg w-6">{leader.rank}</span>
                      <span className="font-bold text-trek-blue">{leader.name}</span>
                    </div>
                    <span className={`font-bold text-lg ${leader.winRate >= 85 ? "text-trek-green" : "text-trek-blue"}`}>
                      {leader.winRate}%
                    </span>
                  </div>
                  <div className="text-xs text-trek-text/60 ml-8">
                    {leader.wins} Wins • {leader.losses} Losses
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Exploration Rankings */}
      {activeCategory === "exploration" && (
        <div className="space-y-4">
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-trek-blue">
                <Zap className="w-5 h-5" />
                Exploration Leaders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {explorationLeaders.map((leader) => (
                <div key={leader.rank} className="bg-trek-dark/50 p-3 rounded border border-trek-accent">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-trek-gold text-lg w-6">{leader.rank}</span>
                      <div>
                        <span className="font-bold text-trek-blue">{leader.name}</span>
                        <div className="text-xs text-trek-text/60">{leader.discoveries} Discoveries</div>
                      </div>
                    </div>
                    <span className="font-bold text-trek-green">{leader.coverage}%</span>
                  </div>
                  <div className="text-xs text-trek-text/60 ml-8">
                    {leader.systems} Systems Explored
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Economy Rankings */}
      {activeCategory === "economy" && (
        <div className="space-y-4">
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-trek-gold">
                <Users className="w-5 h-5" />
                Trade Empires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {economyLeaders.map((leader) => (
                <div key={leader.rank} className="bg-trek-dark/50 p-3 rounded border border-trek-accent">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-trek-gold text-lg w-6">{leader.rank}</span>
                      <div>
                        <span className="font-bold text-trek-blue">{leader.name}</span>
                        <div className="text-xs text-trek-text/60">Profit: {leader.profit.toLocaleString()}</div>
                      </div>
                    </div>
                    <span className="font-bold text-trek-green text-lg">{leader.credits.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-trek-text/60 ml-8">
                    Trading Volume: {leader.tradingVolume.toLocaleString()}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Personal Stats */}
      <Card className="bg-trek-panel border-trek-accent">
        <CardHeader>
          <CardTitle className="text-trek-gold">Your Standing</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-trek-dark/50 rounded border border-trek-blue/30">
            <div className="text-trek-text/70 text-sm">Overall Rank</div>
            <div className="text-2xl font-bold text-trek-blue">#247</div>
          </div>
          <div className="text-center p-3 bg-trek-dark/50 rounded border border-trek-blue/30">
            <div className="text-trek-text/70 text-sm">Combat Rank</div>
            <div className="text-2xl font-bold text-red-400">#1,234</div>
          </div>
          <div className="text-center p-3 bg-trek-dark/50 rounded border border-trek-blue/30">
            <div className="text-trek-text/70 text-sm">Exploration Rank</div>
            <div className="text-2xl font-bold text-trek-green">#89</div>
          </div>
          <div className="text-center p-3 bg-trek-dark/50 rounded border border-trek-blue/30">
            <div className="text-trek-text/70 text-sm">Economy Rank</div>
            <div className="text-2xl font-bold text-trek-gold">#567</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
