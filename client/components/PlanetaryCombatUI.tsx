import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Target,
  Crosshair,
  Eye,
  Bomb,
  Shield,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  Building2,
  Zap,
  Info
} from "lucide-react";

interface PlanetaryDefense {
  id: string;
  type: 'cannon' | 'laser' | 'missile' | 'shield' | 'detector';
  level: number;
  strength: number;
  durability: number;
  maxDurability: number;
  active: boolean;
}

interface Mission {
  id: string;
  type: 'raid' | 'attack' | 'spy' | 'sabotage' | 'espionage' | 'siege';
  targetPlanet: string;
  fleet: string;
  status: 'pending' | 'in_transit' | 'executing' | 'completed';
  progress: number;
  eta: number;
}

export function PlanetaryCombatUI() {
  const [activeTab, setActiveTab] = useState("missions");
  const [selectedMissionType, setSelectedMissionType] = useState<string>("raid");
  const [selectedPlanet, setSelectedPlanet] = useState<string>("");
  const [selectedFleet, setSelectedFleet] = useState<string>("");
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: "m1",
      type: "raid",
      targetPlanet: "Vulcan Colony Alpha",
      fleet: "Strike Force Delta",
      status: "in_transit",
      progress: 65,
      eta: 3600
    },
    {
      id: "m2",
      type: "spy",
      targetPlanet: "Klingon Outpost 7",
      fleet: "Stealth Squadron",
      status: "executing",
      progress: 90,
      eta: 300
    }
  ]);

  const [defenses, setDefenses] = useState<PlanetaryDefense[]>([
    { id: "d1", type: "cannon", level: 5, strength: 150, durability: 800, maxDurability: 1000, active: true },
    { id: "d2", type: "laser", level: 4, strength: 200, durability: 600, maxDurability: 800, active: true },
    { id: "d3", type: "missile", level: 6, strength: 300, durability: 1000, maxDurability: 1200, active: true },
    { id: "d4", type: "shield", level: 3, strength: 0, durability: 500, maxDurability: 500, active: true },
    { id: "d5", type: "detector", level: 2, strength: 0, durability: 300, maxDurability: 300, active: true }
  ]);

  const missionTypes = [
    { 
      id: "raid", 
      label: "Raid", 
      icon: Target,
      description: "Steal resources from enemy planet",
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10"
    },
    { 
      id: "attack", 
      label: "Attack", 
      icon: Crosshair,
      description: "Direct assault on enemy forces",
      color: "text-red-400",
      bgColor: "bg-red-400/10"
    },
    { 
      id: "spy", 
      label: "Spy", 
      icon: Eye,
      description: "Gather intelligence on enemy",
      color: "text-blue-400",
      bgColor: "bg-blue-400/10"
    },
    { 
      id: "sabotage", 
      label: "Sabotage", 
      icon: Bomb,
      description: "Destroy enemy buildings",
      color: "text-orange-400",
      bgColor: "bg-orange-400/10"
    },
    { 
      id: "espionage", 
      label: "Espionage", 
      icon: Users,
      description: "Deep intelligence gathering",
      color: "text-purple-400",
      bgColor: "bg-purple-400/10"
    },
    { 
      id: "siege", 
      label: "Siege", 
      icon: Shield,
      description: "Blockade enemy planet",
      color: "text-gray-400",
      bgColor: "bg-gray-400/10"
    }
  ];

  const mockPlanets = [
    "Vulcan Colony Alpha",
    "Klingon Outpost 7",
    "Romulan Mining Base",
    "Deep Space Station",
    "Cardassian Shipyard"
  ];

  const mockFleets = [
    "Strike Force Delta",
    "Stealth Squadron",
    "Heavy Assault Fleet",
    "Recon Team Alpha",
    "Siege Brigade"
  ];

  const getDefenseIcon = (type: string) => {
    switch (type) {
      case "cannon": return Crosshair;
      case "laser": return Zap;
      case "missile": return Target;
      case "shield": return Shield;
      case "detector": return Eye;
      default: return Shield;
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const launchMission = () => {
    if (!selectedPlanet || !selectedFleet) return;

    const newMission: Mission = {
      id: `m${Date.now()}`,
      type: selectedMissionType as any,
      targetPlanet: selectedPlanet,
      fleet: selectedFleet,
      status: "pending",
      progress: 0,
      eta: Math.floor(Math.random() * 7200) + 600
    };

    setMissions([...missions, newMission]);
    setSelectedPlanet("");
    setSelectedFleet("");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-8 h-8 text-red-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">Planetary Combat Operations</h1>
          <p className="text-gray-400">Coordinate raids, espionage, and planetary assaults</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="missions">Active Missions</TabsTrigger>
          <TabsTrigger value="launch">Launch Mission</TabsTrigger>
          <TabsTrigger value="defenses">Planetary Defenses</TabsTrigger>
        </TabsList>

        {/* Active Missions Tab */}
        <TabsContent value="missions" className="space-y-4">
          <Card className="bg-gray-900/50 border-blue-500/30">
            <CardHeader>
              <CardTitle>Active Missions ({missions.length})</CardTitle>
              <CardDescription>Monitor ongoing planetary operations</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                {missions.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No active missions</p>
                    <p className="text-sm mt-2">Launch a mission to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4 pr-4">
                    {missions.map((mission) => {
                      const missionType = missionTypes.find(m => m.id === mission.type);
                      const Icon = missionType?.icon || Target;

                      return (
                        <Card key={mission.id} className={`bg-gray-800/50 border ${missionType?.bgColor}`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Icon className={`w-6 h-6 ${missionType?.color}`} />
                                <div>
                                  <CardTitle className="text-base">{missionType?.label} Mission</CardTitle>
                                  <CardDescription className="text-xs">Target: {mission.targetPlanet}</CardDescription>
                                </div>
                              </div>
                              <Badge variant="outline" className={
                                mission.status === "completed" ? "border-green-500 text-green-400" :
                                mission.status === "executing" ? "border-yellow-500 text-yellow-400" :
                                "border-blue-500 text-blue-400"
                              }>
                                {mission.status.replace('_', ' ')}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <Users className="w-4 h-4" />
                              <span>Fleet: {mission.fleet}</span>
                            </div>

                            {mission.status !== "completed" && (
                              <>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Progress</span>
                                    <span className="text-white font-medium">{mission.progress}%</span>
                                  </div>
                                  <Progress value={mission.progress} className="h-2" />
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="w-4 h-4 text-blue-400" />
                                  <span className="text-gray-300">ETA: {formatTime(mission.eta)}</span>
                                </div>

                                {/* Mission Details */}
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="p-2 bg-gray-700/50 rounded">
                                    <span className="text-gray-400">Type</span>
                                    <div className="text-white font-semibold capitalize">{mission.type}</div>
                                  </div>
                                  <div className="p-2 bg-gray-700/50 rounded">
                                    <span className="text-gray-400">Success Rate</span>
                                    <div className="text-white font-semibold">{65 + Math.random() * 30}%</div>
                                  </div>
                                </div>
                              </>
                            )}

                            {mission.status === "completed" && (
                              <div className="p-2 rounded bg-green-900/20 border border-green-500/30">
                                <div className="text-sm text-green-400 font-semibold">Mission Complete</div>
                                <div className="text-xs text-green-300 mt-1">
                                  {mission.type === "raid" ? "Resources acquired successfully" :
                                   mission.type === "spy" ? "Intelligence gathered" :
                                   "Mission objectives achieved"}
                                </div>
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex-1 text-xs">
                                <Info className="w-3 h-3 mr-1" />
                                Report
                              </Button>
                              {mission.status === "in_transit" && (
                                <Button size="sm" variant="destructive" className="flex-1 text-xs">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Recall
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Launch Mission Tab */}
        <TabsContent value="launch" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mission Types */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle>Mission Type</CardTitle>
                <CardDescription>Select the type of operation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {missionTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Card
                        key={type.id}
                        className={`cursor-pointer transition-all hover:scale-105 ${
                          selectedMissionType === type.id 
                            ? `${type.bgColor} border-2` 
                            : 'bg-gray-800/50 border border-gray-700'
                        }`}
                        onClick={() => setSelectedMissionType(type.id)}
                      >
                        <CardContent className="p-4 space-y-2">
                          <Icon className={`w-8 h-8 ${type.color}`} />
                          <h3 className="font-semibold text-white">{type.label}</h3>
                          <p className="text-xs text-gray-400">{type.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Mission Configuration */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle>Mission Configuration</CardTitle>
                <CardDescription>Select target and fleet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Target Planet</label>
                  <Select value={selectedPlanet} onValueChange={setSelectedPlanet}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select target planet" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {mockPlanets.map((planet) => (
                        <SelectItem key={planet} value={planet}>{planet}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Assault Fleet</label>
                  <Select value={selectedFleet} onValueChange={setSelectedFleet}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select fleet" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {mockFleets.map((fleet) => (
                        <SelectItem key={fleet} value={fleet}>{fleet}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedMissionType && selectedPlanet && selectedFleet && (
                  <Card className="bg-gray-800/50 border-blue-500/30">
                    <CardContent className="pt-4 space-y-2">
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-400" />
                        Mission Summary
                      </h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-white">{missionTypes.find(m => m.id === selectedMissionType)?.label}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Target:</span>
                          <span className="text-white">{selectedPlanet}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Fleet:</span>
                          <span className="text-white">{selectedFleet}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Est. Travel:</span>
                          <span className="text-white">{formatTime(Math.floor(Math.random() * 3600) + 300)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button 
                  className="w-full bg-red-600 hover:bg-red-700"
                  size="lg"
                  disabled={!selectedPlanet || !selectedFleet}
                  onClick={launchMission}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Launch Mission
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Planetary Defenses Tab */}
        <TabsContent value="defenses" className="space-y-4">
          <Card className="bg-gray-900/50 border-green-500/30">
            <CardHeader>
              <CardTitle>Planetary Defense Systems</CardTitle>
              <CardDescription>Monitor and upgrade your defensive installations across all colonies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {defenses.map((defense) => {
                  const Icon = getDefenseIcon(defense.type);
                  const healthPercent = (defense.durability / defense.maxDurability) * 100;
                  const getDefenseStats = () => {
                    switch (defense.type) {
                      case "cannon": return { range: "15,000 km", fireRate: "10 shots/min" };
                      case "laser": return { range: "20,000 km", fireRate: "12 shots/min" };
                      case "missile": return { range: "30,000 km", fireRate: "6 shots/min" };
                      case "shield": return { range: "Full Coverage", fireRate: "Continuous" };
                      case "detector": return { range: "50,000 km", fireRate: "Constant Scan" };
                      default: return { range: "Unknown", fireRate: "Unknown" };
                    }
                  };
                  const stats = getDefenseStats();

                  return (
                    <Card key={defense.id} className={`bg-gray-800/50 border-gray-700 hover:border-gray-600 transition ${!defense.active ? "opacity-60" : ""}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-5 h-5 text-blue-400" />
                            <CardTitle className="text-base capitalize">{defense.type}</CardTitle>
                          </div>
                          <Badge variant={defense.active ? "default" : "destructive"} className="text-xs">
                            {defense.active ? "Active" : "Offline"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Key Stats */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 bg-gray-700/50 rounded">
                            <div className="text-gray-400">Level</div>
                            <div className="text-white font-semibold text-lg">{defense.level}</div>
                          </div>
                          <div className="p-2 bg-gray-700/50 rounded">
                            <div className="text-gray-400">Strength</div>
                            <div className="text-white font-semibold text-lg">{defense.strength}</div>
                          </div>
                        </div>

                        {/* System Info */}
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Range:</span>
                            <span className="text-white">{stats.range}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Rate:</span>
                            <span className="text-white">{stats.fireRate}</span>
                          </div>
                        </div>

                        {/* Durability Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Durability</span>
                            <span className={`font-medium ${
                              healthPercent > 70 ? 'text-green-400' :
                              healthPercent > 30 ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {defense.durability}/{defense.maxDurability}
                            </span>
                          </div>
                          <Progress 
                            value={healthPercent} 
                            className={`h-2 ${
                              healthPercent > 70 ? '' : 
                              healthPercent > 30 ? '[&>div]:bg-yellow-500' : 
                              '[&>div]:bg-red-500'
                            }`}
                          />
                          <div className="text-xs text-gray-500">
                            {healthPercent > 70 ? "Operational" :
                             healthPercent > 30 ? "Damaged - Repair Recommended" :
                             "Critical - Immediate Repair Required"}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 flex-col space-y-2">
                          <Button size="sm" variant="outline" className="w-full text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Upgrade (Level {defense.level + 1})
                          </Button>
                          {defense.durability < defense.maxDurability && (
                            <Button size="sm" variant="outline" className="w-full text-xs bg-blue-900/20 border-blue-500/30 hover:bg-blue-900/40">
                              <Zap className="w-3 h-3 mr-1" />
                              Repair ({defense.maxDurability - defense.durability} DMG)
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Defense Summary */}
              <Card className="mt-6 bg-gray-800/50 border-gray-700">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-400" />
                        <h3 className="font-semibold text-white">Total Defense Rating</h3>
                      </div>
                      <div className="text-3xl font-bold text-green-400">
                        {defenses.reduce((sum, d) => sum + (d.active ? d.strength : 0), 0)}
                      </div>
                      <div className="text-xs text-gray-400">Combined defensive power</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        <h3 className="font-semibold text-white">System Status</h3>
                      </div>
                      <div className="text-2xl font-bold text-yellow-400">
                        {defenses.filter(d => d.active).length}/{defenses.length}
                      </div>
                      <div className="text-xs text-gray-400">Active defense systems</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-400" />
                        <h3 className="font-semibold text-white">Overall Health</h3>
                      </div>
                      <div className="text-2xl font-bold text-blue-400">
                        {Math.round(defenses.reduce((sum, d) => sum + (d.durability / d.maxDurability), 0) / defenses.length * 100)}%
                      </div>
                      <div className="text-xs text-gray-400">Average durability</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
