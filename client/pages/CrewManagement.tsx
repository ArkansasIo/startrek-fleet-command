import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Star, Zap, TrendingUp, Search } from 'lucide-react';
import { ALL_CREW, CrewMember } from '@/lib/CrewManagementSystem';
import { GameState, recruitCrew } from '@/lib/ModernGameIntegration';

interface CrewManagementPageProps {
  gameState: GameState;
  onUpdate: (state: GameState) => void;
}

export default function CrewManagementPage({ gameState, onUpdate }: CrewManagementPageProps) {
  const [selectedCrew, setSelectedCrew] = useState<CrewMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterTier, setFilterTier] = useState<string>('all');

  const handleRecruit = (crewId: string) => {
    const result = recruitCrew(gameState, crewId);
    if (result.success) {
      onUpdate({ ...gameState });
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  const filteredCrew = ALL_CREW.filter(crew => {
    const matchesSearch = crew.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crew.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || crew.role === filterRole;
    const matchesTier = filterTier === 'all' || crew.tier === filterTier;
    return matchesSearch && matchesRole && matchesTier;
  });

  const myCrewIds = new Set(gameState.crew.map(c => c.crewId));
  const availableCrew = filteredCrew.filter(c => !myCrewIds.has(c.crewId));
  const myCrew = filteredCrew.filter(c => myCrewIds.has(c.crewId));

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'captain': 'bg-yellow-500',
      'engineer': 'bg-blue-500',
      'tactical': 'bg-red-500',
      'science': 'bg-green-500',
      'medical': 'bg-purple-500',
    };
    return colors[role.toLowerCase()] || 'bg-gray-500';
  };

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      'legendary': 'text-yellow-400',
      'epic': 'text-purple-400',
      'rare': 'text-blue-400',
      'uncommon': 'text-green-400',
      'common': 'text-gray-400',
    };
    return colors[tier] || 'text-gray-400';
  };

  const CrewCard = ({ crew, owned }: { crew: CrewMember; owned: boolean }) => (
    <Card 
      className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all cursor-pointer"
      onClick={() => setSelectedCrew(crew)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className={`text-lg ${getTierColor(crew.tier)}`}>
              {crew.name}
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Level {crew.level} {crew.role}
            </CardDescription>
          </div>
          <Badge className={getRoleColor(crew.role)}>
            {crew.role}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-xs mb-3">
          <div>
            <span className="text-gray-400">ATK:</span>
            <span className="text-white ml-1">{crew.stats.attack}</span>
          </div>
          <div>
            <span className="text-gray-400">DEF:</span>
            <span className="text-white ml-1">{crew.stats.defense}</span>
          </div>
          <div>
            <span className="text-gray-400">HP:</span>
            <span className="text-white ml-1">{crew.stats.health}</span>
          </div>
        </div>
        {!owned && (
          <Button 
            size="sm" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              handleRecruit(crew.crewId);
            }}
          >
            Recruit
          </Button>
        )}
        {owned && (
          <Badge variant="secondary" className="w-full justify-center">
            <Users className="h-3 w-3 mr-1" />
            In Roster
          </Badge>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Crew Management</h1>
          <p className="text-blue-200">
            {gameState.crew.length} crew members in your roster
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
                        placeholder="Search crew members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  >
                    <option value="all">All Roles</option>
                    <option value="captain">Captain</option>
                    <option value="engineer">Engineer</option>
                    <option value="tactical">Tactical</option>
                    <option value="science">Science</option>
                    <option value="medical">Medical</option>
                  </select>
                  <select
                    value={filterTier}
                    onChange={(e) => setFilterTier(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  >
                    <option value="all">All Tiers</option>
                    <option value="legendary">Legendary</option>
                    <option value="epic">Epic</option>
                    <option value="rare">Rare</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="common">Common</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="available" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="available">
                  Available ({availableCrew.length})
                </TabsTrigger>
                <TabsTrigger value="roster">
                  My Roster ({myCrew.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="available" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableCrew.map(crew => (
                    <CrewCard key={crew.crewId} crew={crew} owned={false} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="roster" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myCrew.length === 0 ? (
                    <div className="col-span-2 text-center py-12">
                      <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No crew members recruited yet</p>
                    </div>
                  ) : (
                    myCrew.map(crew => (
                      <CrewCard key={crew.crewId} crew={crew} owned={true} />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Crew Details Panel */}
          <div className="lg:col-span-1">
            {selectedCrew ? (
              <Card className="bg-gray-800 border-gray-700 sticky top-6">
                <CardHeader>
                  <CardTitle className={getTierColor(selectedCrew.tier)}>
                    {selectedCrew.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedCrew.role} • Level {selectedCrew.level}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Stats</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Health</span>
                        <span className="text-white">{selectedCrew.stats.health}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Attack</span>
                        <span className="text-white">{selectedCrew.stats.attack}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Defense</span>
                        <span className="text-white">{selectedCrew.stats.defense}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Engineering</span>
                        <span className="text-white">{selectedCrew.stats.engineering}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Science</span>
                        <span className="text-white">{selectedCrew.stats.science}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Leadership</span>
                        <span className="text-white">{selectedCrew.stats.leadership}</span>
                      </div>
                    </div>
                  </div>

                  {selectedCrew.skills && selectedCrew.skills.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Skills</h4>
                      <div className="space-y-2">
                        {selectedCrew.skills.map(skill => (
                          <div key={skill.skillId} className="p-2 bg-gray-700 rounded">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-white">{skill.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                Lv {skill.level}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-400">{skill.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Badge variant="outline" className={`${getRoleColor(selectedCrew.role)} text-white w-full justify-center`}>
                    {selectedCrew.tier.toUpperCase()}
                  </Badge>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Select a crew member to view details</p>
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
