import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Alert, AlertDescription } from "../ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Zap,
  Shield,
  Heart,
  Cpu,
  Battery,
  AlertTriangle,
  Settings,
  Wrench,
  Radio,
  Thermometer,
  Eye,
  Volume2,
  Navigation,
  Fuel,
} from "lucide-react";

interface SystemStatus {
  name: string;
  status: "optimal" | "nominal" | "degraded" | "critical" | "offline";
  power: number;
  efficiency: number;
  temperature: number;
  lastMaintenance: string;
  nextMaintenance: string;
  icon: any;
}

interface WarpCoreMetrics {
  antimatterFlow: number;
  matterFlow: number;
  plasmaPressure: number;
  magneticConstrictors: number;
  ejectionSystemStatus: "ready" | "charging" | "offline";
  breachRisk: number;
}

interface PowerDistribution {
  warpDrive: number;
  impulseEngines: number;
  shields: number;
  lifeSupport: number;
  weapons: number;
  sensors: number;
  communications: number;
  computers: number;
  transporters: number;
  replicators: number;
}

interface EngineeringProps {
  activeSubmenu?: string;
}

export function Engineering({ activeSubmenu }: EngineeringProps) {
  const normalizeSubmenu = (submenu?: string) => {
    const map: Record<string, string> = {
      warp_core: "warp-core",
      maintenance: "maintenance",
      jefferies: "systems",
      environmental: "power",
    };
    return map[submenu || ""] || "warp-core";
  };

  const [selectedSystem, setSelectedSystem] = useState<string>(
    normalizeSubmenu(activeSubmenu),
  );
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);

  useEffect(() => {
    setSelectedSystem(normalizeSubmenu(activeSubmenu));
  }, [activeSubmenu]);

  const [warpCore, setWarpCore] = useState<WarpCoreMetrics>({
    antimatterFlow: 95,
    matterFlow: 98,
    plasmaPressure: 87,
    magneticConstrictors: 100,
    ejectionSystemStatus: "ready",
    breachRisk: 2,
  });

  const [powerDistribution, setPowerDistribution] = useState<PowerDistribution>(
    {
      warpDrive: 40,
      impulseEngines: 15,
      shields: 20,
      lifeSupport: 8,
      weapons: 10,
      sensors: 3,
      communications: 2,
      computers: 1,
      transporters: 1,
      replicators: 0,
    },
  );

  const [systems, setSystems] = useState<SystemStatus[]>([
    {
      name: "Warp Core",
      status: "optimal",
      power: 100,
      efficiency: 97,
      temperature: 2847,
      lastMaintenance: "2024.045",
      nextMaintenance: "2024.067",
      icon: Zap,
    },
    {
      name: "Deflector Shields",
      status: "nominal",
      power: 85,
      efficiency: 92,
      temperature: 312,
      lastMaintenance: "2024.042",
      nextMaintenance: "2024.065",
      icon: Shield,
    },
    {
      name: "Life Support",
      status: "optimal",
      power: 98,
      efficiency: 99,
      temperature: 295,
      lastMaintenance: "2024.041",
      nextMaintenance: "2024.062",
      icon: Heart,
    },
    {
      name: "Computer Core",
      status: "nominal",
      power: 92,
      efficiency: 94,
      temperature: 278,
      lastMaintenance: "2024.043",
      nextMaintenance: "2024.068",
      icon: Cpu,
    },
    {
      name: "Impulse Engines",
      status: "degraded",
      power: 78,
      efficiency: 82,
      temperature: 1245,
      lastMaintenance: "2024.038",
      nextMaintenance: "2024.060",
      icon: Battery,
    },
    {
      name: "Sensor Array",
      status: "optimal",
      power: 96,
      efficiency: 98,
      temperature: 298,
      lastMaintenance: "2024.044",
      nextMaintenance: "2024.066",
      icon: Eye,
    },
    {
      name: "Communications",
      status: "nominal",
      power: 89,
      efficiency: 91,
      temperature: 301,
      lastMaintenance: "2024.040",
      nextMaintenance: "2024.063",
      icon: Radio,
    },
    {
      name: "Environmental",
      status: "optimal",
      power: 94,
      efficiency: 96,
      temperature: 293,
      lastMaintenance: "2024.042",
      nextMaintenance: "2024.064",
      icon: Thermometer,
    },
  ]);

  const getStatusColor = (status: SystemStatus["status"]) => {
    switch (status) {
      case "optimal":
        return "bg-green-500";
      case "nominal":
        return "bg-blue-500";
      case "degraded":
        return "bg-yellow-500";
      case "critical":
        return "bg-red-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: SystemStatus["status"]) => {
    switch (status) {
      case "optimal":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "nominal":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "degraded":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "offline":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const runDiagnostics = () => {
    setDiagnosticsRunning(true);
    setTimeout(() => {
      setDiagnosticsRunning(false);
      // Simulate some improvements after diagnostics
      setSystems((prev) =>
        prev.map((system) => ({
          ...system,
          efficiency: Math.min(100, system.efficiency + Math.random() * 5),
        })),
      );
    }, 3000);
  };

  const redistributePower = (
    system: keyof PowerDistribution,
    value: number,
  ) => {
    const currentTotal = Object.values(powerDistribution).reduce(
      (sum, val) => sum + val,
      0,
    );
    const difference = value - powerDistribution[system];

    if (currentTotal + difference <= 100) {
      setPowerDistribution((prev) => ({
        ...prev,
        [system]: value,
      }));
    }
  };

  const handleEmergencyShutdown = (systemName: string) => {
    setSystems((prev) =>
      prev.map((system) =>
        system.name === systemName
          ? { ...system, status: "offline", power: 0 }
          : system,
      ),
    );
  };

  const restartSystem = (systemName: string) => {
    setSystems((prev) =>
      prev.map((system) =>
        system.name === systemName
          ? {
              ...system,
              status: "nominal",
              power: Math.floor(Math.random() * 30) + 70,
              efficiency: Math.floor(Math.random() * 20) + 80,
            }
          : system,
      ),
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time fluctuations
      setWarpCore((prev) => ({
        ...prev,
        antimatterFlow: Math.max(
          80,
          Math.min(100, prev.antimatterFlow + (Math.random() - 0.5) * 3),
        ),
        matterFlow: Math.max(
          85,
          Math.min(100, prev.matterFlow + (Math.random() - 0.5) * 2),
        ),
        plasmaPressure: Math.max(
          70,
          Math.min(100, prev.plasmaPressure + (Math.random() - 0.5) * 4),
        ),
        breachRisk: Math.max(
          0,
          Math.min(15, prev.breachRisk + (Math.random() - 0.5) * 0.5),
        ),
      }));

      setSystems((prev) =>
        prev.map((system) => ({
          ...system,
          temperature: Math.max(
            200,
            Math.min(3000, system.temperature + (Math.random() - 0.5) * 10),
          ),
          power:
            system.status === "offline"
              ? 0
              : Math.max(
                  50,
                  Math.min(100, system.power + (Math.random() - 0.5) * 2),
                ),
        })),
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const totalPowerUsed = Object.values(powerDistribution).reduce(
    (sum, val) => sum + val,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          ENGINEERING SYSTEMS
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={runDiagnostics}
            disabled={diagnosticsRunning}
            className="bg-trek-accent hover:bg-trek-accent/80"
          >
            <Settings className="w-4 h-4 mr-2" />
            {diagnosticsRunning ? "Running..." : "Run Diagnostics"}
          </Button>
          <Button
            onClick={() => setEmergencyMode(!emergencyMode)}
            variant={emergencyMode ? "destructive" : "outline"}
            className={
              emergencyMode
                ? ""
                : "border-trek-accent text-trek-gold hover:bg-trek-accent/20"
            }
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Emergency Mode
          </Button>
        </div>
      </div>

      <Tabs value={selectedSystem} onValueChange={setSelectedSystem}>
        <TabsList className="grid grid-cols-4 w-full bg-trek-panel border border-trek-accent">
          <TabsTrigger
            value="warp-core"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-black"
          >
            Warp Core
          </TabsTrigger>
          <TabsTrigger
            value="systems"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-black"
          >
            Ship Systems
          </TabsTrigger>
          <TabsTrigger
            value="power"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-black"
          >
            Power Grid
          </TabsTrigger>
          <TabsTrigger
            value="maintenance"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-black"
          >
            Maintenance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="warp-core" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Warp Core Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-trek-text/80">Antimatter Flow</span>
                      <span className="text-trek-gold">
                        {warpCore.antimatterFlow.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={warpCore.antimatterFlow} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-trek-text/80">Matter Flow</span>
                      <span className="text-trek-gold">
                        {warpCore.matterFlow.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={warpCore.matterFlow} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-trek-text/80">Plasma Pressure</span>
                      <span className="text-trek-gold">
                        {warpCore.plasmaPressure.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={warpCore.plasmaPressure} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-trek-text/80">
                        Magnetic Constrictors
                      </span>
                      <span className="text-trek-gold">
                        {warpCore.magneticConstrictors}%
                      </span>
                    </div>
                    <Progress
                      value={warpCore.magneticConstrictors}
                      className="h-2"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-trek-accent/30">
                  <span className="text-trek-text/80">Ejection System</span>
                  <Badge className={`${getStatusBadge("optimal")}`}>
                    {warpCore.ejectionSystemStatus.toUpperCase()}
                  </Badge>
                </div>

                {warpCore.breachRisk > 10 && (
                  <Alert className="border-red-500 bg-red-500/10">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-400">
                      Warning: Warp core breach risk at{" "}
                      {warpCore.breachRisk.toFixed(1)}%
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold flex items-center gap-2">
                  <Fuel className="w-5 h-5" />
                  Core Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className="bg-trek-accent hover:bg-trek-accent/80 text-black"
                    onClick={() => {
                      setWarpCore((prev) => ({
                        ...prev,
                        antimatterFlow: Math.min(100, prev.antimatterFlow + 5),
                        matterFlow: Math.min(100, prev.matterFlow + 5),
                      }));
                    }}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Optimize Flow
                  </Button>

                  <Button
                    variant="outline"
                    className="border-trek-accent text-trek-gold hover:bg-trek-accent/20"
                    onClick={() => {
                      setWarpCore((prev) => ({
                        ...prev,
                        plasmaPressure: Math.min(100, prev.plasmaPressure + 10),
                        breachRisk: Math.max(0, prev.breachRisk - 2),
                      }));
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Stabilize
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-trek-gold">
                    Emergency Procedures
                  </h4>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to perform an emergency core shutdown?",
                        )
                      ) {
                        setWarpCore((prev) => ({
                          ...prev,
                          antimatterFlow: 0,
                          matterFlow: 0,
                          plasmaPressure: 0,
                          breachRisk: 0,
                        }));
                      }
                    }}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Emergency Shutdown
                  </Button>
                </div>

                <div className="pt-4 border-t border-trek-accent/30">
                  <div className="text-sm text-trek-text/60 space-y-1">
                    <div>Core Temperature: 2,847K</div>
                    <div>Dilithium Matrix: Stable</div>
                    <div>Containment Field: 99.7%</div>
                    <div>Next Maintenance: 2024.067</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="systems" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {systems.map((system) => {
              const IconComponent = system.icon;
              return (
                <Card
                  key={system.name}
                  className="bg-trek-panel border-trek-accent"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4 text-trek-gold" />
                        <span className="text-trek-text">{system.name}</span>
                      </div>
                      <Badge className={getStatusBadge(system.status)}>
                        {system.status.toUpperCase()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-trek-text/60">Power</span>
                        <span className="text-trek-gold">{system.power}%</span>
                      </div>
                      <Progress value={system.power} className="h-1" />

                      <div className="flex justify-between text-xs">
                        <span className="text-trek-text/60">Efficiency</span>
                        <span className="text-trek-gold">
                          {system.efficiency}%
                        </span>
                      </div>
                      <Progress value={system.efficiency} className="h-1" />

                      <div className="flex justify-between text-xs">
                        <span className="text-trek-text/60">Temperature</span>
                        <span className="text-trek-gold">
                          {system.temperature}K
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      {system.status === "offline" ? (
                        <Button
                          size="sm"
                          className="flex-1 bg-trek-accent hover:bg-trek-accent/80 text-black text-xs"
                          onClick={() => restartSystem(system.name)}
                        >
                          Restart
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1 text-xs"
                          onClick={() => handleEmergencyShutdown(system.name)}
                        >
                          Shutdown
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="power" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Battery className="w-5 h-5" />
                    Power Distribution
                  </div>
                  <Badge
                    className={
                      totalPowerUsed > 95
                        ? "bg-red-500/20 text-red-400"
                        : "bg-green-500/20 text-green-400"
                    }
                  >
                    {totalPowerUsed}% Used
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(powerDistribution).map(([system, power]) => (
                  <div key={system} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-trek-text capitalize">
                        {system.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span className="text-trek-gold">{power}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={power} className="flex-1 h-2" />
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="p-1 h-6 w-6 border-trek-accent"
                          onClick={() =>
                            redistributePower(
                              system as keyof PowerDistribution,
                              Math.max(0, power - 5),
                            )
                          }
                        >
                          -
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="p-1 h-6 w-6 border-trek-accent"
                          onClick={() =>
                            redistributePower(
                              system as keyof PowerDistribution,
                              Math.min(50, power + 5),
                            )
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Power Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className="bg-trek-accent hover:bg-trek-accent/80 text-black"
                    onClick={() => {
                      setPowerDistribution({
                        warpDrive: 25,
                        impulseEngines: 20,
                        shields: 15,
                        lifeSupport: 10,
                        weapons: 10,
                        sensors: 8,
                        communications: 5,
                        computers: 4,
                        transporters: 2,
                        replicators: 1,
                      });
                    }}
                  >
                    Balanced Config
                  </Button>

                  <Button
                    variant="outline"
                    className="border-trek-accent text-trek-gold hover:bg-trek-accent/20"
                    onClick={() => {
                      setPowerDistribution({
                        warpDrive: 5,
                        impulseEngines: 5,
                        shields: 40,
                        lifeSupport: 15,
                        weapons: 25,
                        sensors: 5,
                        communications: 2,
                        computers: 2,
                        transporters: 1,
                        replicators: 0,
                      });
                    }}
                  >
                    Combat Mode
                  </Button>

                  <Button
                    variant="outline"
                    className="border-trek-accent text-trek-gold hover:bg-trek-accent/20"
                    onClick={() => {
                      setPowerDistribution({
                        warpDrive: 60,
                        impulseEngines: 10,
                        shields: 10,
                        lifeSupport: 8,
                        weapons: 2,
                        sensors: 5,
                        communications: 3,
                        computers: 1,
                        transporters: 1,
                        replicators: 0,
                      });
                    }}
                  >
                    Travel Mode
                  </Button>

                  <Button
                    variant="outline"
                    className="border-trek-accent text-trek-gold hover:bg-trek-accent/20"
                    onClick={() => {
                      setPowerDistribution({
                        warpDrive: 10,
                        impulseEngines: 10,
                        shields: 5,
                        lifeSupport: 20,
                        weapons: 0,
                        sensors: 25,
                        communications: 15,
                        computers: 10,
                        transporters: 3,
                        replicators: 2,
                      });
                    }}
                  >
                    Science Mode
                  </Button>
                </div>

                <div className="pt-4 border-t border-trek-accent/30">
                  <h4 className="text-sm font-semibold text-trek-gold mb-2">
                    Power Status
                  </h4>
                  <div className="text-sm text-trek-text/60 space-y-1">
                    <div>Total Output: 1,000 TeraWatts</div>
                    <div>Reserve Power: 15%</div>
                    <div>Emergency Batteries: 72 hours</div>
                    <div>Backup Generators: Online</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Maintenance Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systems.map((system) => (
                    <div
                      key={system.name}
                      className="flex items-center justify-between p-3 bg-trek-bg/50 rounded border border-trek-accent/30"
                    >
                      <div>
                        <div className="font-medium text-trek-text">
                          {system.name}
                        </div>
                        <div className="text-sm text-trek-text/60">
                          Last: {system.lastMaintenance} | Next:{" "}
                          {system.nextMaintenance}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            system.nextMaintenance < "2024.050"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-green-500/20 text-green-400"
                          }
                        >
                          {system.nextMaintenance < "2024.050"
                            ? "Due Soon"
                            : "Scheduled"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-trek-accent text-trek-gold"
                        >
                          <Wrench className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert className="border-yellow-500 bg-yellow-500/10">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-400">
                    Impulse engines showing 18% efficiency degradation
                  </AlertDescription>
                </Alert>

                <Alert className="border-blue-500 bg-blue-500/10">
                  <Eye className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-400">
                    Sensor calibration completed successfully
                  </AlertDescription>
                </Alert>

                <Alert className="border-green-500 bg-green-500/10">
                  <Shield className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-400">
                    Deflector array maintenance ahead of schedule
                  </AlertDescription>
                </Alert>

                <div className="pt-4">
                  <Button
                    className="w-full bg-trek-accent hover:bg-trek-accent/80 text-black"
                    onClick={runDiagnostics}
                    disabled={diagnosticsRunning}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {diagnosticsRunning
                      ? "Running Full Diagnostics..."
                      : "Run Full System Diagnostics"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
