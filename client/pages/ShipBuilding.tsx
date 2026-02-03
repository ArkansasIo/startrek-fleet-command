import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket, Zap, Shield, Gauge, Search } from 'lucide-react';
import { ALL_SHIP_CLASSES, ShipClass } from '@/lib/ShipBuildingSystem';
import { GameState, buildShipForPlayer } from '@/lib/ModernGameIntegration';

interface ShipBuildingPageProps {
  gameState: GameState;
  onUpdate: (state: GameState) => void;
}

export default function ShipBuildingPage({ gameState, onUpdate }: ShipBuildingPageProps) {
  const [selectedShip, setSelectedShip] = useState<ShipClass | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFaction, setFilterFaction] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [shipName, setShipName] = useState('');

  const handleBuildShip = (classId: string) => {
    const result = buildShipForPlayer(gameState, classId, shipName || undefined);
    if (result.success) {
      onUpdate({ ...gameState });
      setShipName('');
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  const filteredShips = ALL_SHIP_CLASSES.filter(ship => {
    const matchesSearch = ship.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFaction = filterFaction === 'all' || ship.faction === filterFaction;
    const matchesType = filterType === 'all' || ship.type === filterType;
    return matchesSearch && matchesFaction && matchesType;
  });

  const myShipClassIds = new Set(gameState.ships.map(s => s.classId));

  const getFactionColor = (faction: string) => {
    const colors: Record<string, string> = {
      'federation': 'bg-blue-500',
      'klingon': 'bg-red-500',
      'romulan': 'bg-green-500',
      'dominion': 'bg-purple-500',
      'borg': 'bg-gray-500',
      'species_8472': 'bg-yellow-500',
    };
    return colors[faction.toLowerCase()] || 'bg-gray-500';
  };

  const ShipCard = ({ ship }: { ship: ShipClass }) => {
    const owned = myShipClassIds.has(ship.classId);
    
    return (
      <Card 
        className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all cursor-pointer"
        onClick={() => setSelectedShip(ship)}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg text-white">
                {ship.name}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {ship.type}
              </CardDescription>
            </div>
            <Badge className={getFactionColor(ship.faction)}>
              {ship.faction}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span className="text-gray-400">ATK:</span>
              <span className="text-white">{ship.baseStats.attack}</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-blue-500" />
              <span className="text-gray-400">DEF:</span>
              <span className="text-white">{ship.baseStats.defense}</span>
            </div>
            <div className="flex items-center gap-1">
              <Gauge className="h-3 w-3 text-green-500" />
              <span className="text-gray-400">SPD:</span>
              <span className="text-white">{ship.baseStats.speed}</span>
            </div>
            <div className="flex items-center gap-1">
              <Rocket className="h-3 w-3 text-purple-500" />
              <span className="text-gray-400">Crew:</span>
              <span className="text-white">{ship.crewCapacity}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">Cost:</span>
            <span className="text-sm text-yellow-400 font-semibold">
              {ship.buildCost.toLocaleString()} credits
            </span>
          </div>
          {!owned && (
            <Button 
              size="sm" 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                handleBuildShip(ship.classId);
              }}
            >
              Build Ship
            </Button>
          )}
          {owned && (
            <Badge variant="secondary" className="w-full justify-center">
              In Fleet
            </Badge>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Ship Construction Bay</h1>
          <p className="text-purple-200">
            {gameState.ships.length} / {gameState.fleet.capacity} ships in fleet
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters & Search */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search ships..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <select
                    value={filterFaction}
                    onChange={(e) => setFilterFaction(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  >
                    <option value="all">All Factions</option>
                    <option value="federation">Federation</option>
                    <option value="klingon">Klingon</option>
                    <option value="romulan">Romulan</option>
                    <option value="dominion">Dominion</option>
                    <option value="borg">Borg</option>
                  </select>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  >
                    <option value="all">All Types</option>
                    <option value="shuttle">Shuttle</option>
                    <option value="corvette">Corvette</option>
                    <option value="cruiser">Cruiser</option>
                    <option value="battlecruiser">Battlecruiser</option>
                    <option value="capital">Capital Ship</option>
                    <option value="dreadnought">Dreadnought</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ship Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredShips.map(ship => (
                <ShipCard key={ship.classId} ship={ship} />
              ))}
            </div>
          </div>

          {/* Ship Details Panel */}
          <div className="lg:col-span-1">
            {selectedShip ? (
              <Card className="bg-gray-800 border-gray-700 sticky top-6">
                <CardHeader>
                  <CardTitle className="text-white">{selectedShip.name}</CardTitle>
                  <CardDescription>
                    {selectedShip.faction} • {selectedShip.type}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Description</h4>
                    <p className="text-sm text-gray-400">{selectedShip.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Base Stats</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Health</span>
                        <span className="text-white">{selectedShip.baseStats.health}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Attack</span>
                        <span className="text-white">{selectedShip.baseStats.attack}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Defense</span>
                        <span className="text-white">{selectedShip.baseStats.defense}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Speed</span>
                        <span className="text-white">{selectedShip.baseStats.speed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cargo</span>
                        <span className="text-white">{selectedShip.baseStats.cargo}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Capacity</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Crew</span>
                        <span className="text-white">{selectedShip.crewCapacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Component Slots</span>
                        <span className="text-white">
                          W:{selectedShip.componentSlots.weapon} A:{selectedShip.componentSlots.armor} S:{selectedShip.componentSlots.shield}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedShip.specialAbility && (
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Special Ability</h4>
                      <div className="p-2 bg-gray-700 rounded">
                        <p className="text-sm font-semibold text-blue-300">{selectedShip.specialAbility.name}</p>
                        <p className="text-sm text-blue-300">{selectedShip.specialAbility.description}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-700">
                    <Input
                      placeholder="Custom ship name (optional)"
                      value={shipName}
                      onChange={(e) => setShipName(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white mb-3"
                    />
                    <Button 
                      className="w-full"
                      onClick={() => handleBuildShip(selectedShip.classId)}
                    >
                      Build for {selectedShip.buildCost.toLocaleString()} credits
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Rocket className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Select a ship to view details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
