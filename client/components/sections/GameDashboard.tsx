import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useGameState, GameMission, GameAlert } from "../../hooks/useGameState";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Shield,
  Star,
  Target,
  Trophy,
  Users,
  Zap,
  Navigation,
  Rocket,
  Radio,
  Eye,
  MapPin,
  Gauge,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Bell,
  X,
  Award,
  Coins,
  Gem,
  Calendar,
} from "lucide-react";

interface GameDashboardProps {
  currentUser?: any;
}

export const GameDashboard: React.FC<GameDashboardProps> = ({
  currentUser,
}) => {
  const {
    gameState,
    initializePlayer,
    acceptMission,
    updateObjectiveProgress,
    acknowledgeAlert,
    updateSystemStatus,
    setGameMode,
  } = useGameState();

  const [activeTab, setActiveTab] = useState("overview");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Initialize player when user logs in
  useEffect(() => {
    if (currentUser && !gameState.player) {
      initializePlayer(currentUser);
    }
  }, [currentUser, gameState.player, initializePlayer]);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate system fluctuations
  useEffect(() => {
    if (!gameState.player) return;

    const interval = setInterval(() => {
      const fluctuation = Math.random() * 10 - 5; // -5 to +5
      updateSystemStatus({
        shields: Math.max(
          90,
          Math.min(100, gameState.systemStatus.shields + fluctuation),
        ),
        hull: Math.max(
          95,
          Math.min(100, gameState.systemStatus.hull + fluctuation * 0.5),
        ),
        power: Math.max(
          85,
          Math.min(100, gameState.systemStatus.power + fluctuation * 0.3),
        ),
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [gameState.player, updateSystemStatus, gameState.systemStatus]);

  const getStatusColor = (status: string | number) => {
    if (typeof status === "number") {
      if (status >= 90) return "text-green-400";
      if (status >= 70) return "text-yellow-400";
      return "text-red-400";
    }

    switch (status) {
      case "green":
        return "text-green-400";
      case "yellow":
        return "text-yellow-400";
      case "red":
        return "text-red-400";
      case "online":
        return "text-green-400";
      case "offline":
        return "text-red-400";
      case "charging":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const getAlertIcon = (type: GameAlert["type"]) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  const getMissionTypeIcon = (type: GameMission["type"]) => {
    switch (type) {
      case "combat":
        return <Zap className="w-4 h-4" />;
      case "exploration":
        return <Eye className="w-4 h-4" />;
      case "diplomatic":
        return <Users className="w-4 h-4" />;
      case "research":
        return <Activity className="w-4 h-4" />;
      case "trade":
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const formatTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  if (!gameState.player) {
    return (
      <div className="min-h-screen bg-black text-blue-100 p-4 flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-600">
          <CardContent className="p-8 text-center">
            <Rocket className="w-16 h-16 mx-auto mb-4 text-blue-400" />
            <h3 className="text-xl font-semibold mb-2">
              Initializing Starfleet Systems
            </h3>
            <p className="text-gray-400">
              Please log in to access your command dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-blue-400">
                <Activity className="inline-block w-8 h-8 mr-3" />
                Command Dashboard
              </h1>
              <p className="text-blue-300">
                Stardate{" "}
                {currentTime.toISOString().slice(0, 10).replace(/-/g, ".")} •{" "}
                {currentTime.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="text-green-400 border-green-400"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Systems Online
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setGameMode(
                    gameState.gameMode === "story" ? "sandbox" : "story",
                  )
                }
              >
                <Settings className="w-4 h-4 mr-2" />
                {gameState.gameMode === "story" ? "Story Mode" : "Sandbox Mode"}
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Level</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {gameState.player.level}
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Credits</p>
                  <p className="text-2xl font-bold text-green-400">
                    {gameState.player.credits.toLocaleString()}
                  </p>
                </div>
                <Coins className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Reputation</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {gameState.player.reputation}
                  </p>
                </div>
                <Award className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Missions</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {gameState.activeMissions.length}
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-gray-800 border-blue-500">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-blue-600"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="missions"
              className="data-[state=active]:bg-blue-600"
            >
              Missions
            </TabsTrigger>
            <TabsTrigger
              value="fleet"
              className="data-[state=active]:bg-blue-600"
            >
              Fleet Status
            </TabsTrigger>
            <TabsTrigger
              value="alerts"
              className="data-[state=active]:bg-blue-600"
            >
              Alerts ({gameState.alerts.filter((a) => !a.acknowledged).length})
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="data-[state=active]:bg-blue-600"
            >
              Resources
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Status */}
              <Card className="bg-gray-800 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center">
                    <Gauge className="w-5 h-5 mr-2" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Shield Integrity</span>
                      <span
                        className={getStatusColor(
                          gameState.systemStatus.shields,
                        )}
                      >
                        {Math.round(gameState.systemStatus.shields)}%
                      </span>
                    </div>
                    <Progress
                      value={gameState.systemStatus.shields}
                      className="bg-gray-700"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Hull Integrity</span>
                      <span
                        className={getStatusColor(gameState.systemStatus.hull)}
                      >
                        {Math.round(gameState.systemStatus.hull)}%
                      </span>
                    </div>
                    <Progress
                      value={gameState.systemStatus.hull}
                      className="bg-gray-700"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Power Level</span>
                      <span
                        className={getStatusColor(gameState.systemStatus.power)}
                      >
                        {Math.round(gameState.systemStatus.power)}%
                      </span>
                    </div>
                    <Progress
                      value={gameState.systemStatus.power}
                      className="bg-gray-700"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Weapons Status</span>
                    <span
                      className={getStatusColor(gameState.systemStatus.weapons)}
                    >
                      {gameState.systemStatus.weapons}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Current Location */}
              <Card className="bg-gray-800 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Current Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Galaxy:</span>
                      <span className="text-blue-400">
                        {gameState.player.location.galaxy}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sector:</span>
                      <span className="text-blue-400">
                        {gameState.player.location.sector}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">System:</span>
                      <span className="text-blue-400">
                        {gameState.player.location.system}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Active Ship:</span>
                      <span className="text-green-400">
                        {gameState.player.fleet.activeShip}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    <Navigation className="w-4 h-4 mr-2" />
                    Navigation Controls
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Fleet Overview */}
            <Card className="bg-gray-800 border-gray-600">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Rocket className="w-5 h-5 mr-2" />
                  Fleet Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {gameState.fleetStatus.totalShips}
                    </div>
                    <div className="text-gray-400 text-sm">Total Ships</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {gameState.fleetStatus.activeShips}
                    </div>
                    <div className="text-gray-400 text-sm">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {gameState.fleetStatus.inMaintenance}
                    </div>
                    <div className="text-gray-400 text-sm">Maintenance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {gameState.fleetStatus.onMissions}
                    </div>
                    <div className="text-gray-400 text-sm">On Missions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Missions Tab */}
          <TabsContent value="missions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Missions */}
              <Card className="bg-gray-800 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-blue-400">
                    Active Missions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {gameState.activeMissions.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">
                      No active missions
                    </p>
                  ) : (
                    gameState.activeMissions.map((mission) => (
                      <Card
                        key={mission.id}
                        className="bg-gray-700 border-gray-600"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getMissionTypeIcon(mission.type)}
                              <span className="font-medium text-blue-400">
                                {mission.title}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Difficulty {mission.difficulty}
                            </Badge>
                          </div>
                          <p className="text-gray-300 text-sm mb-3">
                            {mission.description}
                          </p>

                          {mission.deadline && (
                            <div className="flex items-center gap-2 mb-3">
                              <Clock className="w-4 h-4 text-amber-400" />
                              <span className="text-amber-400 text-sm">
                                {formatTimeRemaining(mission.deadline)}
                              </span>
                            </div>
                          )}

                          <div className="space-y-2">
                            {mission.objectives.map((obj) => (
                              <div key={obj.id} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-300">
                                    {obj.description}
                                  </span>
                                  <span className="text-blue-400">
                                    {obj.progress}/{obj.target}
                                  </span>
                                </div>
                                <Progress
                                  value={(obj.progress / obj.target) * 100}
                                  className="bg-gray-600 h-2"
                                />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Available Missions */}
              <Card className="bg-gray-800 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-blue-400">
                    Available Missions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {gameState.availableMissions.map((mission) => (
                    <Card
                      key={mission.id}
                      className="bg-gray-700 border-gray-600"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getMissionTypeIcon(mission.type)}
                            <span className="font-medium text-blue-400">
                              {mission.title}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Difficulty {mission.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">
                          {mission.description}
                        </p>

                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <div className="text-green-400">
                              +{mission.rewards.experience} XP
                            </div>
                            <div className="text-yellow-400">
                              +{mission.rewards.credits} Credits
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              acceptMission(mission.id);
                              // Simulate mission progress for demo
                              setTimeout(() => {
                                updateObjectiveProgress(
                                  mission.id,
                                  mission.objectives[0].id,
                                  1,
                                );
                              }, 2000);
                            }}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-4">
            {gameState.alerts.length === 0 ? (
              <Card className="bg-gray-800 border-gray-600">
                <CardContent className="p-8 text-center">
                  <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-300">
                    No Alerts
                  </h3>
                  <p className="text-gray-400">
                    All systems are operating normally.
                  </p>
                </CardContent>
              </Card>
            ) : (
              gameState.alerts.map((alert) => (
                <Alert
                  key={alert.id}
                  className={`bg-gray-800 border-gray-600 ${alert.acknowledged ? "opacity-50" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <AlertTitle className="text-blue-400">
                          {alert.title}
                        </AlertTitle>
                        <AlertDescription className="text-gray-300 mt-1">
                          {alert.message}
                        </AlertDescription>
                        <div className="text-xs text-gray-400 mt-2">
                          {new Date(alert.timestamp).toLocaleString()} •{" "}
                          {alert.category}
                        </div>
                      </div>
                    </div>
                    {!alert.acknowledged && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </Alert>
              ))
            )}
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(gameState.player.resources).map(
                ([resource, amount]) => (
                  <Card key={resource} className="bg-gray-800 border-gray-600">
                    <CardContent className="p-4 text-center">
                      <Gem className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                      <div className="text-2xl font-bold text-blue-400">
                        {amount.toLocaleString()}
                      </div>
                      <div className="text-gray-400 text-sm capitalize">
                        {resource}
                      </div>
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GameDashboard;
