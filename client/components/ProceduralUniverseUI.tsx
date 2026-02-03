import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import ProceduralGameIntegration from '@/lib/ProceduralGameIntegration';
import type { StarSystemInfo, PlanetInfo } from '@/lib/ProceduralUniverse';
import type { Discovery } from '@/lib/ProceduralDiscoverySystem';

interface ProceduralUniverseUIProps {
  gameIntegration: ProceduralGameIntegration;
  player: any;
}

export const ProceduralUniverseUI: React.FC<ProceduralUniverseUIProps> = ({ 
  gameIntegration, 
  player 
}) => {
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [explorationResult, setExplorationResult] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);

  useEffect(() => {
    updateLocation();
    loadDiscoveries();
  }, []);

  const updateLocation = () => {
    const location = gameIntegration.getCurrentLocationSummary();
    setCurrentLocation(location);
  };

  const loadDiscoveries = () => {
    const playerDiscoveries = gameIntegration.getGameState().discoveries;
    setDiscoveries(playerDiscoveries);
  };

  const handleExplore = async () => {
    setScanning(true);
    setTimeout(() => {
      const result = gameIntegration.explorePlanet(player, 70);
      setExplorationResult(result);
      setScanning(false);
      
      if (result.rewards) {
        applyRewards(result.rewards);
      }
      
      loadDiscoveries();
    }, 2000);
  };

  const applyRewards = (rewards: any) => {
    if (rewards.credits) {
      player.credits = (player.credits || 0) + rewards.credits;
    }
    if (rewards.reputation) {
      player.reputation = (player.reputation || 0) + rewards.reputation;
    }
    if (rewards.experience) {
      player.experience = (player.experience || 0) + rewards.experience;
    }
    if (rewards.resources) {
      Object.entries(rewards.resources).forEach(([resource, amount]) => {
        player.resources = player.resources || {};
        player.resources[resource] = (player.resources[resource] || 0) + (amount as number);
      });
    }
  };

  const handleNavigate = (x: number, y: number, z: number = 0) => {
    gameIntegration.navigateToSystem(x, y, z, player);
    updateLocation();
    setExplorationResult(null);
  };

  const handleVisitPlanet = (planetIndex: number) => {
    gameIntegration.navigateToPlanet(planetIndex, player);
    updateLocation();
    setExplorationResult(null);
  };

  const renderSystemInfo = () => {
    if (!currentLocation?.system) return null;

    const system: StarSystemInfo = currentLocation.system;

    return (
      <Card className="bg-slate-900 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <span className="text-2xl">🌟</span>
            {system.name}
          </CardTitle>
          <CardDescription className="text-slate-400">
            Star System - {system.starType} Class Star
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Star Type</p>
              <p className="text-lg font-bold" style={{ color: system.starColor }}>
                {system.starType}-Class
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Temperature</p>
              <p className="text-lg font-bold text-orange-400">
                {system.temperature.toLocaleString()}K
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Planets</p>
              <p className="text-lg font-bold text-blue-400">{system.planetCount}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Danger Level</p>
              <Progress value={system.dangerLevel * 10} className="h-2" />
              <p className="text-sm text-yellow-400">{system.dangerLevel}/10</p>
            </div>
          </div>

          {system.faction && (
            <div>
              <Badge variant="outline" className="text-cyan-400 border-cyan-500">
                {system.faction} Territory
              </Badge>
            </div>
          )}

          {system.resources.length > 0 && (
            <div>
              <p className="text-sm text-slate-400 mb-2">System Resources</p>
              <div className="flex flex-wrap gap-2">
                {system.resources.map((resource, i) => (
                  <Badge key={i} variant="secondary" className="bg-purple-900/30 text-purple-300">
                    {resource}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {system.anomalyPresent && (
            <Badge variant="destructive" className="animate-pulse">
              ⚠️ Anomaly Detected
            </Badge>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderPlanetInfo = () => {
    if (!currentLocation?.planet) return null;

    const planet: PlanetInfo = currentLocation.planet;

    const typeColors: Record<string, string> = {
      'terran': 'text-green-400',
      'arctic': 'text-blue-300',
      'desert': 'text-yellow-400',
      'oceanic': 'text-blue-500',
      'volcanic': 'text-red-500',
      'toxic': 'text-purple-500',
      'barren': 'text-gray-400',
      'gas-giant': 'text-orange-400',
      'ice-giant': 'text-cyan-400',
      'exotic': 'text-pink-500'
    };

    const typeEmojis: Record<string, string> = {
      'terran': '🌍',
      'arctic': '❄️',
      'desert': '🏜️',
      'oceanic': '🌊',
      'volcanic': '🌋',
      'toxic': '☢️',
      'barren': '🌑',
      'gas-giant': '🪐',
      'ice-giant': '🧊',
      'exotic': '✨'
    };

    return (
      <Card className="bg-slate-900 border-green-500/30">
        <CardHeader>
          <CardTitle className={`${typeColors[planet.type]} flex items-center gap-2`}>
            <span className="text-2xl">{typeEmojis[planet.type]}</span>
            {planet.name}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {planet.type.charAt(0).toUpperCase() + planet.type.slice(1)} Planet - {planet.size} size
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Atmosphere</p>
              <p className="text-lg font-bold text-cyan-400">{planet.atmosphere}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Gravity</p>
              <p className="text-lg font-bold text-purple-400">{planet.gravity.toFixed(2)}g</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Temperature</p>
              <p className="text-lg font-bold text-orange-400">{Math.round(planet.temperature)}K</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Habitability</p>
              <Progress value={planet.habitability} className="h-2" />
              <p className="text-sm text-green-400">{planet.habitability}%</p>
            </div>
          </div>

          {planet.biomes.length > 0 && (
            <div>
              <p className="text-sm text-slate-400 mb-2">Biomes</p>
              <div className="flex flex-wrap gap-2">
                {planet.biomes.slice(0, 3).map((biome, i) => (
                  <Badge key={i} variant="outline" className="text-green-300 border-green-500">
                    {biome.type} ({biome.coverage.toFixed(0)}%)
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {planet.fauna.length > 0 && (
            <div>
              <p className="text-sm text-slate-400 mb-2">Fauna Species</p>
              <Badge variant="secondary" className="bg-blue-900/30 text-blue-300">
                🦎 {planet.fauna.length} species detected
              </Badge>
            </div>
          )}

          {planet.civilization && (
            <div>
              <Badge variant="outline" className="text-yellow-400 border-yellow-500">
                👥 Civilization Detected - Tech Level {planet.civilization.techLevel}
              </Badge>
            </div>
          )}

          <Button 
            onClick={handleExplore} 
            disabled={scanning}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            {scanning ? '🔍 Scanning...' : '🔍 Explore Planet'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderExplorationResult = () => {
    if (!explorationResult) return null;

    const resultColors: Record<string, string> = {
      'discovery': 'border-yellow-500',
      'resource': 'border-green-500',
      'encounter': 'border-red-500',
      'anomaly': 'border-purple-500',
      'nothing': 'border-gray-500'
    };

    const resultIcons: Record<string, string> = {
      'discovery': '🎉',
      'resource': '💎',
      'encounter': '⚔️',
      'anomaly': '⚡',
      'nothing': '🔍'
    };

    return (
      <Card className={`bg-slate-900 ${resultColors[explorationResult.type]} border-2 animate-pulse`}>
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <span className="text-2xl">{resultIcons[explorationResult.type]}</span>
            Exploration Result
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {explorationResult.type === 'discovery' && (
            <div>
              <p className="text-lg font-bold text-yellow-400">New Discovery!</p>
              <p className="text-slate-300">{explorationResult.data.description}</p>
            </div>
          )}

          {explorationResult.type === 'resource' && (
            <div>
              <p className="text-lg font-bold text-green-400">Resource Found!</p>
              <p className="text-slate-300">
                Found {explorationResult.data.amount}x {explorationResult.data.resource}
              </p>
              <p className="text-sm text-slate-400">
                Quality: {explorationResult.data.quality}%
              </p>
            </div>
          )}

          {explorationResult.type === 'encounter' && (
            <div>
              <p className="text-lg font-bold text-red-400">{explorationResult.data.title}</p>
              <p className="text-slate-300">{explorationResult.data.description}</p>
              <div className="mt-2 space-y-2">
                {explorationResult.data.choices.map((choice: any) => (
                  <Button 
                    key={choice.id} 
                    variant="outline" 
                    className="w-full text-left justify-start"
                  >
                    {choice.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {explorationResult.type === 'anomaly' && (
            <div>
              <p className="text-lg font-bold text-purple-400">Anomaly Detected!</p>
              <p className="text-slate-300">{explorationResult.data.description}</p>
              <Badge variant="destructive">
                Danger Level: {explorationResult.data.dangerLevel}
              </Badge>
            </div>
          )}

          {explorationResult.type === 'nothing' && (
            <p className="text-slate-400">{explorationResult.data?.message || 'Nothing found.'}</p>
          )}

          {explorationResult.rewards && (
            <div className="pt-4 border-t border-slate-700">
              <p className="text-sm text-slate-400 mb-2">Rewards:</p>
              <div className="flex flex-wrap gap-2">
                {explorationResult.rewards.credits && (
                  <Badge variant="secondary" className="bg-yellow-900/30 text-yellow-300">
                    💰 +{explorationResult.rewards.credits} Credits
                  </Badge>
                )}
                {explorationResult.rewards.reputation && (
                  <Badge variant="secondary" className="bg-blue-900/30 text-blue-300">
                    ⭐ +{explorationResult.rewards.reputation} Reputation
                  </Badge>
                )}
                {explorationResult.rewards.experience && (
                  <Badge variant="secondary" className="bg-green-900/30 text-green-300">
                    📈 +{explorationResult.rewards.experience} XP
                  </Badge>
                )}
              </div>
            </div>
          )}

          <Button 
            onClick={() => setExplorationResult(null)} 
            variant="ghost"
            className="w-full"
          >
            Continue Exploring
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderDiscoveries = () => {
    return (
      <Card className="bg-slate-900 border-yellow-500/30">
        <CardHeader>
          <CardTitle className="text-yellow-400">📜 Discoveries</CardTitle>
          <CardDescription className="text-slate-400">
            Your exploration findings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {discoveries.length === 0 ? (
            <p className="text-slate-400 text-center py-4">
              No discoveries yet. Explore planets to make new findings!
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {discoveries.map((discovery, i) => (
                <div key={i} className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-cyan-400">{discovery.name}</p>
                      <p className="text-sm text-slate-400">{discovery.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="bg-yellow-900/30 text-yellow-300">
                          💰 {discovery.credits} Credits
                        </Badge>
                        <Badge variant="secondary" className="bg-purple-900/30 text-purple-300">
                          🔬 {discovery.scientificValue} Science
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderNavigation = () => {
    return (
      <Card className="bg-slate-900 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400">🗺️ Navigation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-slate-400 mb-2">Quick Jump</p>
            <div className="grid grid-cols-3 gap-2">
              {[-1, 0, 1].map(x => (
                [-1, 0, 1].map(y => (
                  <Button 
                    key={`${x}-${y}`}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const current = player.position || { x: 0, y: 0, z: 0 };
                      handleNavigate(current.x + x, current.y + y, current.z);
                    }}
                    className="text-xs"
                  >
                    {x === 0 && y === 0 ? '📍' : '→'}
                  </Button>
                ))
              ))}
            </div>
          </div>

          {currentLocation?.system && currentLocation.system.planetCount > 0 && (
            <div>
              <p className="text-sm text-slate-400 mb-2">Visit Planets</p>
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: currentLocation.system.planetCount }, (_, i) => (
                  <Button 
                    key={i}
                    variant="outline"
                    size="sm"
                    onClick={() => handleVisitPlanet(i)}
                  >
                    Planet {i + 1}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-cyan-400">
          🌌 Procedural Universe Explorer
        </h1>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Seed: {gameIntegration.getUniverseInfo().seed}
        </Badge>
      </div>

      <Tabs defaultValue="explore" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="explore">Explore</TabsTrigger>
          <TabsTrigger value="discoveries">Discoveries</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
        </TabsList>

        <TabsContent value="explore" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {renderSystemInfo()}
            {renderPlanetInfo()}
          </div>
          {explorationResult && renderExplorationResult()}
        </TabsContent>

        <TabsContent value="discoveries">
          {renderDiscoveries()}
        </TabsContent>

        <TabsContent value="navigation">
          {renderNavigation()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProceduralUniverseUI;
