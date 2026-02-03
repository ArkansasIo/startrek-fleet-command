import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Rocket, Users, Zap, Award, Trophy, 
  ShieldCheck, Target, Coins 
} from 'lucide-react';

// Import all game systems
import { 
  GameState, 
  initializeGame, 
  updateGameState,
  ALL_CREW,
  ALL_SHIP_CLASSES,
  ALL_ACHIEVEMENTS,
  ALL_FACTIONS 
} from '@/lib/ModernGameIntegration';

export default function GameDashboard() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize game state
  useEffect(() => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      setGameState(JSON.parse(savedState));
    } else {
      const newGame = initializeGame('player_' + Date.now());
      setGameState(newGame);
      localStorage.setItem('gameState', JSON.stringify(newGame));
    }
    setIsLoading(false);
  }, []);

  // Game loop - update every second
  useEffect(() => {
    if (!gameState) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        if (!prev) return prev;
        
        const updatedState = { ...prev };
        updateGameState({
          gameState: updatedState,
          deltaTime: 1, // 1 second
          timestamp: Date.now()
        });

        // Save to localStorage
        localStorage.setItem('gameState', JSON.stringify(updatedState));
        
        return updatedState;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  if (isLoading || !gameState) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white">Initializing Star Trek: Fleet Command</h2>
        </div>
      </div>
    );
  }

  const fleetPower = gameState.ships.reduce((sum, ship) => 
    sum + ship.stats.attack + ship.stats.defense, 0
  );

  const totalWealth = gameState.economy.resources.get('credits') || 0;
  const crewCount = gameState.crew.length;
  const achievementProgress = (gameState.achievements.totalUnlocked / ALL_ACHIEVEMENTS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Commander's Dashboard
          </h1>
          <p className="text-blue-200">
            Level {gameState.level} | {gameState.experience} XP
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-200">Fleet Power</p>
                  <h3 className="text-2xl font-bold text-white">{fleetPower.toLocaleString()}</h3>
                </div>
                <Rocket className="h-8 w-8 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900 to-green-800 border-green-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-200">Credits</p>
                  <h3 className="text-2xl font-bold text-white">{totalWealth.toLocaleString()}</h3>
                </div>
                <Coins className="h-8 w-8 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-200">Crew</p>
                  <h3 className="text-2xl font-bold text-white">{crewCount}</h3>
                </div>
                <Users className="h-8 w-8 text-purple-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900 to-yellow-800 border-yellow-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-200">Achievements</p>
                  <h3 className="text-2xl font-bold text-white">{gameState.achievements.totalUnlocked}</h3>
                </div>
                <Trophy className="h-8 w-8 text-yellow-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="fleet">Fleet</TabsTrigger>
            <TabsTrigger value="crew">Crew</TabsTrigger>
            <TabsTrigger value="missions">Missions</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fleet Status */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Fleet Status</CardTitle>
                  <CardDescription>
                    Current formation: {gameState.fleet.formation?.name || 'None'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-300">Ships</span>
                        <span className="text-sm text-white">
                          {gameState.ships.length} / {gameState.fleet.capacity}
                        </span>
                      </div>
                      <Progress 
                        value={(gameState.ships.length / gameState.fleet.capacity) * 100}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-300">Fleet Health</span>
                        <span className="text-sm text-white">
                          {gameState.fleet.morale}%
                        </span>
                      </div>
                      <Progress value={gameState.fleet.morale} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <Badge variant={gameState.fleet.status === 'ready' ? 'default' : 'secondary'}>
                        {gameState.fleet.status.toUpperCase()}
                      </Badge>
                      <Button size="sm" variant="outline">Manage Fleet</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Missions */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Active Missions</CardTitle>
                  <CardDescription>
                    {gameState.activeMissions.length} missions in progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {gameState.activeMissions.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">
                        No active missions. Visit the mission board to start!
                      </p>
                    ) : (
                      gameState.activeMissions.slice(0, 3).map(mission => (
                        <div key={mission.missionId} className="p-3 bg-gray-700 rounded">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-white font-semibold">{mission.name}</h4>
                            <Badge variant="outline">{mission.difficulty}</Badge>
                          </div>
                          <Progress value={mission.progress} className="h-2 mb-2" />
                          <p className="text-xs text-gray-300">
                            {mission.objectives.filter(o => o.completed).length} / {mission.objectives.length} objectives
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Resources Overview */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Resource Production</CardTitle>
                  <CardDescription>Per minute generation rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Array.from(gameState.economy.generators.entries()).slice(0, 5).map(([resource, generator]) => (
                      <div key={resource} className="flex justify-between items-center">
                        <span className="text-sm text-gray-300 capitalize">{resource}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white">
                            {gameState.economy.resources.get(resource as any)?.toLocaleString()}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            +{(generator.baseGeneration * generator.efficiency).toFixed(1)}/min
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Achievements</CardTitle>
                  <CardDescription>
                    {achievementProgress.toFixed(1)}% complete
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={achievementProgress} className="h-2 mb-4" />
                  <div className="space-y-2">
                    {Array.from(gameState.achievements.achievements.values())
                      .filter(a => a.completed)
                      .slice(0, 3)
                      .map(achievement => {
                        const achData = ALL_ACHIEVEMENTS.find(a => a.achievementId === achievement.achievementId);
                        return (
                          <div key={achievement.achievementId} className="flex items-center gap-2 p-2 bg-gray-700 rounded">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-white">{achData?.name}</span>
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {achData?.pointsReward} pts
                            </Badge>
                          </div>
                        );
                      })}
                    {gameState.achievements.totalUnlocked === 0 && (
                      <p className="text-gray-400 text-center py-4 text-sm">
                        Complete objectives to earn achievements!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fleet Tab */}
          <TabsContent value="fleet" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Fleet Management</CardTitle>
                <CardDescription>
                  Manage your ships and formations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Rocket className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Fleet Management</h3>
                  <p className="text-gray-400 mb-4">
                    Build and customize your fleet of starships
                  </p>
                  <Button>Build Ship</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Crew Tab */}
          <TabsContent value="crew" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Crew Roster</CardTitle>
                <CardDescription>
                  {crewCount} crew members assigned
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Crew Management</h3>
                  <p className="text-gray-400 mb-4">
                    Recruit and assign crew members to your ships
                  </p>
                  <Button>Recruit Crew</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Missions Tab */}
          <TabsContent value="missions" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Mission Board</CardTitle>
                <CardDescription>
                  Available missions and quests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Target className="h-16 w-16 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Mission Control</h3>
                  <p className="text-gray-400 mb-4">
                    Accept missions and complete objectives
                  </p>
                  <Button>View Missions</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Resource Management</CardTitle>
                <CardDescription>
                  Economy and trading system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Zap className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Resource Center</h3>
                  <p className="text-gray-400 mb-4">
                    Manage resources and trade with other factions
                  </p>
                  <Button>Open Market</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
