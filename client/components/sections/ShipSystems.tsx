import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  Battery,
  Cpu,
  Shield,
  Navigation,
  Radio,
  Thermometer,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
} from "lucide-react";

interface SystemStatus {
  name: string;
  status: "Online" | "Offline" | "Maintenance" | "Critical";
  efficiency: number;
  temperature: number;
  power_usage: number;
  icon: React.ReactNode;
}

export function ShipSystems() {
  const [warpCoreStatus, setWarpCoreStatus] = useState("Stable");
  const [dilithiumLevel, setDilithiumLevel] = useState(87);
  const [antimatterLevel, setAntimatterLevel] = useState(92);
  const [emergencyPower, setEmergencyPower] = useState(false);

  const [systems, setSystems] = useState<SystemStatus[]>([
    {
      name: "Warp Drive",
      status: "Online",
      efficiency: 97,
      temperature: 3847,
      power_usage: 85,
      icon: <Zap className="w-5 h-5" />,
    },
    {
      name: "Impulse Engines",
      status: "Online",
      efficiency: 100,
      temperature: 1250,
      power_usage: 15,
      icon: <Navigation className="w-5 h-5" />,
    },
    {
      name: "Deflector Shields",
      status: "Online",
      efficiency: 100,
      temperature: 895,
      power_usage: 45,
      icon: <Shield className="w-5 h-5" />,
    },
    {
      name: "Life Support",
      status: "Online",
      efficiency: 100,
      temperature: 295,
      power_usage: 25,
      icon: <Cpu className="w-5 h-5" />,
    },
    {
      name: "Communications",
      status: "Online",
      efficiency: 98,
      temperature: 310,
      power_usage: 8,
      icon: <Radio className="w-5 h-5" />,
    },
    {
      name: "Computer Core",
      status: "Online",
      efficiency: 99,
      temperature: 278,
      power_usage: 35,
      icon: <Cpu className="w-5 h-5" />,
    },
    {
      name: "Transporters",
      status: "Maintenance",
      efficiency: 0,
      temperature: 298,
      power_usage: 0,
      icon: <Navigation className="w-5 h-5" />,
    },
    {
      name: "Replicators",
      status: "Online",
      efficiency: 95,
      temperature: 325,
      power_usage: 12,
      icon: <Settings className="w-5 h-5" />,
    },
  ]);

  const totalPowerUsage = systems.reduce(
    (sum, system) => sum + system.power_usage,
    0,
  );
  const availablePower = emergencyPower ? 150 : 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setSystems((prev) =>
        prev.map((system) => ({
          ...system,
          temperature: system.temperature + (Math.random() - 0.5) * 10,
          efficiency:
            system.status === "Online"
              ? Math.max(
                  85,
                  Math.min(100, system.efficiency + (Math.random() - 0.5) * 2),
                )
              : system.efficiency,
        })),
      );

      setDilithiumLevel((prev) => Math.max(0, prev - 0.1));
      setAntimatterLevel((prev) => Math.max(0, prev - 0.05));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online":
        return "text-green-400 border-green-400 bg-green-400/20";
      case "Maintenance":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Critical":
        return "text-red-400 border-red-400 bg-red-400/20";
      case "Offline":
        return "text-gray-400 border-gray-400 bg-gray-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Online":
        return <CheckCircle className="w-4 h-4" />;
      case "Maintenance":
        return <Settings className="w-4 h-4" />;
      case "Critical":
        return <AlertTriangle className="w-4 h-4" />;
      case "Offline":
        return <XCircle className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          SHIP SYSTEMS CONTROL
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className={`border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-trek-dark ${
              emergencyPower ? "bg-yellow-400/20" : ""
            }`}
            onClick={() => setEmergencyPower(!emergencyPower)}
          >
            <Battery className="w-4 h-4 mr-2" />
            Emergency Power
          </Button>
          <Button
            variant="outline"
            className="border-red-400 text-red-400 hover:bg-red-400 hover:text-trek-dark"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Red Alert
          </Button>
        </div>
      </div>

      {/* Warp Core Status */}
      <Card className="bg-trek-panel border-trek-accent p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-trek-gold">Warp Core Status</h3>
          <Badge
            className={`${getStatusColor(warpCoreStatus === "Stable" ? "Online" : "Critical")}`}
          >
            {getStatusIcon(warpCoreStatus === "Stable" ? "Online" : "Critical")}
            <span className="ml-2">{warpCoreStatus}</span>
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-trek-blue" />
              <span className="text-trek-text/70">Dilithium Level</span>
            </div>
            <Progress value={dilithiumLevel} className="mb-2" />
            <div className="text-trek-blue font-semibold">
              {dilithiumLevel.toFixed(1)}%
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Battery className="w-5 h-5 text-trek-blue" />
              <span className="text-trek-text/70">Antimatter</span>
            </div>
            <Progress value={antimatterLevel} className="mb-2" />
            <div className="text-trek-blue font-semibold">
              {antimatterLevel.toFixed(1)}%
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-5 h-5 text-trek-warning" />
              <span className="text-trek-text/70">Core Temperature</span>
            </div>
            <div className="text-trek-warning font-semibold text-xl">
              15,700 K
            </div>
            <div className="text-xs text-trek-text/70">
              Within normal parameters
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-5 h-5 text-trek-blue" />
              <span className="text-trek-text/70">Power Output</span>
            </div>
            <div className="text-trek-blue font-semibold text-xl">4,000 TW</div>
            <div className="text-xs text-trek-text/70">Optimal efficiency</div>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
          >
            Eject Warp Core
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
          >
            Realign Dilithium Matrix
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-trek-warning text-trek-warning hover:bg-trek-warning hover:text-trek-dark"
          >
            Emergency Shutdown
          </Button>
        </div>
      </Card>

      {/* Power Distribution */}
      <Card className="bg-trek-panel border-trek-accent p-6">
        <h3 className="text-xl font-bold text-trek-gold mb-4">
          Power Distribution Grid
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-trek-text/70">Total Power Usage</span>
              <span
                className={`font-semibold ${totalPowerUsage > availablePower ? "text-red-400" : "text-trek-blue"}`}
              >
                {totalPowerUsage}% / {availablePower}%
              </span>
            </div>
            <Progress
              value={(totalPowerUsage / availablePower) * 100}
              className={`mb-4 ${totalPowerUsage > availablePower ? "[&>div]:bg-red-500" : ""}`}
            />

            {emergencyPower && (
              <div className="bg-yellow-400/10 border border-yellow-400 p-3 rounded mb-4">
                <div className="flex items-center gap-2 text-yellow-400 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  Emergency power reserves active
                </div>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-trek-gold font-semibold mb-2">Quick Actions</h4>
            <div className="space-y-2">
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
              >
                Route Power to Shields
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
              >
                Divert Power to Weapons
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
              >
                Boost Engine Power
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* System Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systems.map((system, index) => (
          <Card
            key={index}
            className="bg-trek-panel border-trek-accent p-4 hover:border-trek-blue transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-trek-gold">{system.icon}</span>
                <span className="font-semibold text-sm">{system.name}</span>
              </div>
              <Badge
                variant="secondary"
                className={getStatusColor(system.status)}
              >
                {getStatusIcon(system.status)}
                <span className="ml-1 text-xs">{system.status}</span>
              </Badge>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-trek-text/70">Efficiency</span>
                  <span className="text-trek-blue">{system.efficiency}%</span>
                </div>
                <Progress value={system.efficiency} className="h-2" />
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-trek-text/70">Temperature</span>
                <span
                  className={
                    system.temperature > 1000
                      ? "text-trek-warning"
                      : "text-trek-blue"
                  }
                >
                  {Math.round(system.temperature)}K
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-trek-text/70">Power Draw</span>
                <span className="text-trek-blue">{system.power_usage}%</span>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="w-full mt-3 text-xs border-trek-accent hover:border-trek-blue"
              onClick={() => {
                setSystems((prev) =>
                  prev.map((s, i) =>
                    i === index
                      ? {
                          ...s,
                          status: s.status === "Offline" ? "Online" : "Offline",
                        }
                      : s,
                  ),
                );
              }}
            >
              {system.status === "Offline" ? "Activate" : "Deactivate"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
