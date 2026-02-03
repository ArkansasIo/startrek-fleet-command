import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Clock, Award, TrendingUp } from 'lucide-react';
import { ALL_MISSIONS, Mission } from '@/lib/MissionQuestSystemEnhanced';
import { GameState, startMissionForPlayer, completeMissionForPlayer } from '@/lib/ModernGameIntegration';

interface MissionBoardPageProps {
  gameState: GameState;
  onUpdate: (state: GameState) => void;
}

export default function MissionBoardPage({ gameState, onUpdate }: MissionBoardPageProps) {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const handleStartMission = (missionId: string) => {
    const result = startMissionForPlayer(gameState, missionId);
    if (result.success) {
      onUpdate({ ...gameState });
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  const handleCompleteMission = (missionId: string) => {
    const result = completeMissionForPlayer(gameState, missionId);
    if (result.success) {
      onUpdate({ ...gameState });
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  const activeMissionIds = new Set(gameState.activeMissions.map(m => m.missionId));
  const completedMissionIds = new Set(gameState.completedMissions.map(m => m.missionId));
  
  const availableMissions = ALL_MISSIONS.filter(m => 
    !activeMissionIds.has(m.missionId) && 
    !completedMissionIds.has(m.missionId) &&
    gameState.level >= m.level
  );

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'easy': 'bg-green-500',
      'normal': 'bg-blue-500',
      'hard': 'bg-yellow-500',
      'elite': 'bg-orange-500',
      'impossible': 'bg-red-500',
    };
    return colors[difficulty] || 'bg-gray-500';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'explore': 'text-blue-400',
      'combat': 'text-red-400',
      'diplomatic': 'text-green-400',
      'research': 'text-purple-400',
      'trade': 'text-yellow-400',
      'rescue': 'text-orange-400',
      'sabotage': 'text-gray-400',
      'defense': 'text-cyan-400',
    };
    return colors[type] || 'text-gray-400';
  };

  const MissionCard = ({ mission, status }: { mission: Mission; status: 'available' | 'active' | 'completed' }) => (
    <Card 
      className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all cursor-pointer"
      onClick={() => setSelectedMission(mission)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-white">{mission.name}</CardTitle>
            <CardDescription className={`text-xs mt-1 ${getTypeColor(mission.type)}`}>
              {mission.type} • Level {mission.level}
            </CardDescription>
          </div>
          <Badge className={getDifficultyColor(mission.difficulty)}>
            {mission.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{mission.description}</p>
        
        {status === 'active' && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="text-white">{mission.progress}%</span>
            </div>
            <Progress value={mission.progress} className="h-2" />
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <Award className="h-3 w-3" />
          <span>{mission.rewards.credits.toLocaleString()} credits</span>
          <span>•</span>
          <span>{mission.rewards.experience.toLocaleString()} XP</span>
        </div>

        {status === 'available' && (
          <Button 
            size="sm" 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              handleStartMission(mission.missionId);
            }}
          >
            Start Mission
          </Button>
        )}
        
        {status === 'active' && (
          <Button 
            size="sm" 
            className="w-full"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleCompleteMission(mission.missionId);
            }}
          >
            Complete Mission
          </Button>
        )}
        
        {status === 'completed' && (
          <Badge variant="secondary" className="w-full justify-center">
            Completed
          </Badge>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Mission Control</h1>
          <p className="text-red-200">
            {gameState.activeMissions.length} active • {gameState.completedMissions.length} completed
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mission Lists */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger value="active">
                  Active ({gameState.activeMissions.length})
                </TabsTrigger>
                <TabsTrigger value="available">
                  Available ({availableMissions.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({gameState.completedMissions.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-4">
                <div className="grid grid-cols-1 gap-4">
                  {gameState.activeMissions.length === 0 ? (
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="pt-6">
                        <div className="text-center py-12">
                          <Target className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400">No active missions</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    gameState.activeMissions.map(mission => (
                      <MissionCard key={mission.missionId} mission={mission} status="active" />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="available" className="mt-4">
                <div className="grid grid-cols-1 gap-4">
                  {availableMissions.map(mission => (
                    <MissionCard key={mission.missionId} mission={mission} status="available" />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-4">
                <div className="grid grid-cols-1 gap-4">
                  {gameState.completedMissions.length === 0 ? (
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="pt-6">
                        <div className="text-center py-12">
                          <Award className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400">No completed missions yet</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    gameState.completedMissions.map(mission => (
                      <MissionCard key={mission.missionId} mission={mission} status="completed" />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Mission Details Panel */}
          <div className="lg:col-span-1">
            {selectedMission ? (
              <Card className="bg-gray-800 border-gray-700 sticky top-6">
                <CardHeader>
                  <CardTitle className="text-white">{selectedMission.name}</CardTitle>
                  <CardDescription>
                    {selectedMission.type} • {selectedMission.difficulty}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Description</h4>
                    <p className="text-sm text-gray-400">{selectedMission.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Requirements</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Level</span>
                        <span className="text-white">{selectedMission.level}</span>
                      </div>
                      {selectedMission.timeLimit && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Time Limit</span>
                          <span className="text-white">{selectedMission.timeLimit}s</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Objectives</h4>
                    <div className="space-y-2">
                      {selectedMission.objectives.map((obj, index) => (
                        <div key={obj.objectiveId} className="flex items-start gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                            obj.completed ? 'bg-green-500' : 'bg-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-white">{obj.description}</p>
                            <p className="text-xs text-gray-400">
                              {obj.current} / {obj.target}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <h4 className="text-sm font-semibold text-white mb-2">Rewards</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="text-white">{selectedMission.rewards.credits.toLocaleString()} credits</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        <span className="text-white">{selectedMission.rewards.experience.toLocaleString()} XP</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Target className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Select a mission to view details</p>
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
