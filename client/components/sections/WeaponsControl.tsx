import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Crosshair,
  Zap,
  Shield,
  Target,
  AlertTriangle,
  Eye,
  Power,
  Settings,
  RotateCcw,
  Play,
  Square,
  Pause,
  Volume2,
  Radar,
  Activity,
  Thermometer,
  Battery,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Navigation,
  Gauge,
  TrendingUp,
  BarChart3,
  RefreshCw,
} from "lucide-react";

interface WeaponSystem {
  id: string;
  name: string;
  type: "phaser" | "torpedo" | "shield" | "tractor";
  status: "online" | "offline" | "charging" | "firing" | "maintenance";
  power: number;
  charge: number;
  temperature: number;
  accuracy: number;
  range: number;
  ammunition?: number;
  maxAmmunition?: number;
}

interface Target {
  id: string;
  name: string;
  classification: string;
  distance: number;
  bearing: number;
  size: number;
  shieldStrength: number;
  hullIntegrity: number;
  threat: "low" | "medium" | "high" | "critical";
  locked: boolean;
}

interface FireSolution {
  weaponId: string;
  targetId: string;
  power: number;
  spread: number;
  salvo: number;
  delay: number;
}

interface WeaponsControlProps {
  activeSubmenu?: string;
}

export function WeaponsControl({ activeSubmenu }: WeaponsControlProps) {
  const defaultTab = "targeting";
  const [activeTab, setActiveTab] = useState(activeSubmenu || defaultTab);

  useEffect(() => {
    setActiveTab(activeSubmenu || defaultTab);
  }, [activeSubmenu]);
  const [alertCondition, setAlertCondition] = useState<
    "green" | "yellow" | "red"
  >("green");
  const [weaponsSafetyLock, setWeaponsSafetyLock] = useState(true);
  const [powerDistribution, setPowerDistribution] = useState({
    phasers: 75,
    torpedoes: 80,
    shields: 85,
    sensors: 70,
  });

  const [weaponSystems, setWeaponSystems] = useState<WeaponSystem[]>([
    {
      id: "phaser-array-1",
      name: "Forward Phaser Array",
      type: "phaser",
      status: "online",
      power: 95,
      charge: 100,
      temperature: 32,
      accuracy: 94,
      range: 250000,
    },
    {
      id: "phaser-array-2",
      name: "Aft Phaser Array",
      type: "phaser",
      status: "online",
      power: 88,
      charge: 85,
      temperature: 28,
      accuracy: 92,
      range: 200000,
    },
    {
      id: "phaser-array-3",
      name: "Dorsal Phaser Array",
      type: "phaser",
      status: "charging",
      power: 76,
      charge: 45,
      temperature: 24,
      accuracy: 90,
      range: 180000,
    },
    {
      id: "torpedo-launcher-1",
      name: "Forward Torpedo Launcher",
      type: "torpedo",
      status: "online",
      power: 100,
      charge: 100,
      temperature: 20,
      accuracy: 98,
      range: 3500000,
      ammunition: 24,
      maxAmmunition: 30,
    },
    {
      id: "torpedo-launcher-2",
      name: "Aft Torpedo Launcher",
      type: "torpedo",
      status: "online",
      power: 92,
      charge: 100,
      temperature: 18,
      accuracy: 96,
      range: 3200000,
      ammunition: 18,
      maxAmmunition: 25,
    },
    {
      id: "shield-array",
      name: "Deflector Shield Array",
      type: "shield",
      status: "online",
      power: 85,
      charge: 78,
      temperature: 45,
      accuracy: 100,
      range: 50000,
    },
    {
      id: "tractor-beam",
      name: "Tractor Beam Emitter",
      type: "tractor",
      status: "offline",
      power: 0,
      charge: 0,
      temperature: 15,
      accuracy: 85,
      range: 75000,
    },
  ]);

  const [targets, setTargets] = useState<Target[]>([
    {
      id: "target-1",
      name: "Klingon Bird-of-Prey",
      classification: "B'rel Class",
      distance: 15000,
      bearing: 23,
      size: 156,
      shieldStrength: 78,
      hullIntegrity: 95,
      threat: "high",
      locked: false,
    },
    {
      id: "target-2",
      name: "Romulan Warbird",
      classification: "D'deridex Class",
      distance: 45000,
      bearing: 156,
      size: 1353,
      shieldStrength: 92,
      hullIntegrity: 88,
      threat: "critical",
      locked: false,
    },
    {
      id: "target-3",
      name: "Federation Starship",
      classification: "Excelsior Class",
      distance: 89000,
      bearing: 298,
      size: 467,
      shieldStrength: 45,
      hullIntegrity: 62,
      threat: "low",
      locked: false,
    },
  ]);

  const [selectedTarget, setSelectedTarget] = useState<Target | null>(null);
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponSystem | null>(
    null,
  );
  const [fireSolution, setFireSolution] = useState<FireSolution>({
    weaponId: "",
    targetId: "",
    power: 75,
    spread: 0,
    salvo: 1,
    delay: 0,
  });
  const [firingSequence, setFiringSequence] = useState(false);
  const [combatLog, setCombatLog] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWeaponSystems((prev) =>
        prev.map((weapon) => {
          let newWeapon = { ...weapon };

          // Simulate charging
          if (weapon.status === "charging" && weapon.charge < 100) {
            newWeapon.charge = Math.min(100, weapon.charge + Math.random() * 5);
            if (newWeapon.charge >= 100) {
              newWeapon.status = "online";
            }
          }

          // Simulate temperature fluctuations
          if (weapon.status === "online") {
            newWeapon.temperature = Math.max(
              15,
              Math.min(100, weapon.temperature + (Math.random() - 0.5) * 2),
            );
          }

          return newWeapon;
        }),
      );

      // Update target positions
      setTargets((prev) =>
        prev.map((target) => ({
          ...target,
          distance: Math.max(
            1000,
            target.distance + (Math.random() - 0.5) * 1000,
          ),
          bearing: (target.bearing + (Math.random() - 0.5) * 2) % 360,
        })),
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const lockTarget = (target: Target) => {
    setTargets((prev) =>
      prev.map((t) => ({
        ...t,
        locked: t.id === target.id ? !t.locked : false,
      })),
    );
    setSelectedTarget(target);
    setCombatLog((prev) => [
      ...prev,
      `Target lock ${target.locked ? "disengaged" : "acquired"}: ${target.name}`,
    ]);
  };

  const fireWeapon = () => {
    if (!selectedTarget || !selectedWeapon || weaponsSafetyLock) return;

    setFiringSequence(true);
    setWeaponSystems((prev) =>
      prev.map((w) =>
        w.id === selectedWeapon.id
          ? {
              ...w,
              status: "firing",
              charge: Math.max(0, w.charge - 25),
              temperature: w.temperature + 15,
            }
          : w,
      ),
    );

    setCombatLog((prev) => [
      ...prev,
      `${selectedWeapon.name} firing at ${selectedTarget.name} - Power: ${fireSolution.power}%`,
    ]);

    setTimeout(() => {
      setFiringSequence(false);
      setWeaponSystems((prev) =>
        prev.map((w) =>
          w.id === selectedWeapon.id ? { ...w, status: "online" } : w,
        ),
      );

      // Simulate damage to target
      if (selectedTarget) {
        const damage = Math.random() * 30 + 10;
        setTargets((prev) =>
          prev.map((t) =>
            t.id === selectedTarget.id
              ? { ...t, shieldStrength: Math.max(0, t.shieldStrength - damage) }
              : t,
          ),
        );
        setCombatLog((prev) => [
          ...prev,
          `Target hit! Shield strength reduced by ${damage.toFixed(1)}%`,
        ]);
      }
    }, 2000);
  };

  const setAlertStatus = (status: "green" | "yellow" | "red") => {
    setAlertCondition(status);
    if (status === "red") {
      setWeaponsSafetyLock(false);
    }
    setCombatLog((prev) => [
      ...prev,
      `Alert condition set to ${status.toUpperCase()}`,
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400";
      case "offline":
        return "text-red-400";
      case "charging":
        return "text-yellow-400";
      case "firing":
        return "text-orange-400";
      case "maintenance":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case "low":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "high":
        return "text-orange-400";
      case "critical":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const formatDistance = (distance: number) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} km`;
    }
    return `${distance.toFixed(0)} m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          WEAPONS CONTROL
        </h2>
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className={`px-3 py-1 ${
              alertCondition === "green"
                ? "border-green-400 text-green-400"
                : alertCondition === "yellow"
                  ? "border-yellow-400 text-yellow-400"
                  : "border-red-400 text-red-400"
            }`}
          >
            ALERT {alertCondition.toUpperCase()}
          </Badge>
          <Button
            onClick={() => setWeaponsSafetyLock(!weaponsSafetyLock)}
            variant={weaponsSafetyLock ? "outline" : "destructive"}
            className={
              weaponsSafetyLock ? "border-green-400 text-green-400" : ""
            }
          >
            {weaponsSafetyLock ? (
              <Lock className="w-4 h-4 mr-2" />
            ) : (
              <Unlock className="w-4 h-4 mr-2" />
            )}
            WEAPONS {weaponsSafetyLock ? "LOCKED" : "ARMED"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Button
          onClick={() => setAlertStatus("green")}
          variant={alertCondition === "green" ? "default" : "outline"}
          className={
            alertCondition === "green"
              ? "bg-green-600 hover:bg-green-700"
              : "border-green-400 text-green-400 hover:bg-green-400/10"
          }
        >
          Condition Green
        </Button>
        <Button
          onClick={() => setAlertStatus("yellow")}
          variant={alertCondition === "yellow" ? "default" : "outline"}
          className={
            alertCondition === "yellow"
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
          }
        >
          Condition Yellow
        </Button>
        <Button
          onClick={() => setAlertStatus("red")}
          variant={alertCondition === "red" ? "default" : "outline"}
          className={
            alertCondition === "red"
              ? "bg-red-600 hover:bg-red-700"
              : "border-red-400 text-red-400 hover:bg-red-400/10"
          }
        >
          Red Alert
        </Button>
        <Button
          onClick={() => {
            setCombatLog((prev) => [...prev, "All weapons systems reset"]);
            setWeaponSystems((prev) =>
              prev.map((w) => ({
                ...w,
                status: "online",
                charge: 100,
                temperature: 20,
              })),
            );
          }}
          variant="outline"
          className="border-trek-blue text-trek-blue hover:bg-trek-blue/10"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset Systems
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-trek-panel border border-trek-accent">
          <TabsTrigger
            value="targeting"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Targeting
          </TabsTrigger>
          <TabsTrigger
            value="weapons"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Weapons
          </TabsTrigger>
          <TabsTrigger
            value="power"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Power
          </TabsTrigger>
          <TabsTrigger
            value="fire_control"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Fire Control
          </TabsTrigger>
          <TabsTrigger
            value="diagnostics"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Diagnostics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="targeting" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Sensor Contacts
              </h3>
              <div className="space-y-4">
                {targets.map((target) => (
                  <Card
                    key={target.id}
                    className={`bg-trek-dark/50 border transition-all duration-200 ${
                      target.locked
                        ? "border-trek-blue bg-trek-blue/10"
                        : "border-trek-accent/50"
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-trek-blue" />
                          <span className="font-semibold text-trek-text">
                            {target.name}
                          </span>
                          <Badge
                            variant="outline"
                            className={getThreatColor(target.threat)}
                          >
                            {target.threat.toUpperCase()}
                          </Badge>
                          {target.locked && (
                            <Badge
                              variant="outline"
                              className="border-trek-blue text-trek-blue"
                            >
                              <Lock className="w-3 h-3 mr-1" />
                              LOCKED
                            </Badge>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => lockTarget(target)}
                          variant={target.locked ? "default" : "outline"}
                          className={
                            target.locked
                              ? "bg-trek-blue hover:bg-trek-blue/80"
                              : ""
                          }
                        >
                          <Crosshair className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-trek-text/70">
                            Classification:
                          </span>
                          <div className="text-trek-text">
                            {target.classification}
                          </div>
                        </div>
                        <div>
                          <span className="text-trek-text/70">Distance:</span>
                          <div className="text-trek-text">
                            {formatDistance(target.distance)}
                          </div>
                        </div>
                        <div>
                          <span className="text-trek-text/70">Bearing:</span>
                          <div className="text-trek-text">
                            {target.bearing.toFixed(1)}°
                          </div>
                        </div>
                        <div>
                          <span className="text-trek-text/70">Size:</span>
                          <div className="text-trek-text">{target.size}m</div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div>
                          <div className="flex justify-between text-xs">
                            <span className="text-trek-text/70">
                              Shield Strength
                            </span>
                            <span className="text-trek-blue">
                              {target.shieldStrength.toFixed(1)}%
                            </span>
                          </div>
                          <Progress
                            value={target.shieldStrength}
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs">
                            <span className="text-trek-text/70">
                              Hull Integrity
                            </span>
                            <span className="text-trek-blue">
                              {target.hullIntegrity.toFixed(1)}%
                            </span>
                          </div>
                          <Progress
                            value={target.hullIntegrity}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Tactical Display
              </h3>
              <div className="relative bg-trek-dark/50 border border-trek-accent rounded-lg p-4 h-96">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* Ship position (center) */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 bg-trek-blue rounded-full border-2 border-trek-gold"></div>
                      <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-trek-gold">
                        USS Enterprise
                      </span>
                    </div>

                    {/* Targets */}
                    {targets.map((target, index) => {
                      const angle = (target.bearing * Math.PI) / 180;
                      const distance = Math.min(target.distance / 1000, 150); // Scale distance
                      const x = 50 + (distance * Math.cos(angle)) / 3;
                      const y = 50 - (distance * Math.sin(angle)) / 3;

                      return (
                        <div
                          key={target.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                          style={{ left: `${x}%`, top: `${y}%` }}
                          onClick={() => setSelectedTarget(target)}
                        >
                          <div
                            className={`w-3 h-3 rounded-full border-2 ${
                              target.locked
                                ? "bg-trek-blue border-trek-blue"
                                : target.threat === "critical"
                                  ? "bg-red-500 border-red-500"
                                  : target.threat === "high"
                                    ? "bg-orange-500 border-orange-500"
                                    : target.threat === "medium"
                                      ? "bg-yellow-500 border-yellow-500"
                                      : "bg-green-500 border-green-500"
                            }`}
                          ></div>
                          <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-trek-text whitespace-nowrap">
                            {target.name.split(" ")[0]}
                          </span>
                        </div>
                      );
                    })}

                    {/* Range circles */}
                    <div className="absolute inset-0">
                      {[25, 50, 75].map((range) => (
                        <div
                          key={range}
                          className="absolute border border-trek-accent/30 rounded-full"
                          style={{
                            width: `${range * 2}%`,
                            height: `${range * 2}%`,
                            top: `${50 - range}%`,
                            left: `${50 - range}%`,
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {selectedTarget && (
                <div className="mt-4 p-4 bg-trek-dark/50 border border-trek-accent rounded">
                  <h4 className="font-semibold text-trek-blue mb-2">
                    Target Analysis: {selectedTarget.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      Distance: {formatDistance(selectedTarget.distance)}
                    </div>
                    <div>Bearing: {selectedTarget.bearing.toFixed(1)}°</div>
                    <div>
                      Shields: {selectedTarget.shieldStrength.toFixed(1)}%
                    </div>
                    <div>Hull: {selectedTarget.hullIntegrity.toFixed(1)}%</div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weapons" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weaponSystems.map((weapon) => (
              <Card
                key={weapon.id}
                className={`bg-trek-panel border transition-all duration-200 ${
                  selectedWeapon?.id === weapon.id
                    ? "border-trek-blue bg-trek-blue/10"
                    : "border-trek-accent"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {weapon.type === "phaser" && (
                        <Zap className="w-5 h-5 text-trek-warning" />
                      )}
                      {weapon.type === "torpedo" && (
                        <Target className="w-5 h-5 text-red-400" />
                      )}
                      {weapon.type === "shield" && (
                        <Shield className="w-5 h-5 text-trek-blue" />
                      )}
                      {weapon.type === "tractor" && (
                        <Eye className="w-5 h-5 text-green-400" />
                      )}
                      <h3 className="font-semibold text-trek-text">
                        {weapon.name}
                      </h3>
                    </div>
                    <Badge
                      variant="outline"
                      className={getStatusColor(weapon.status)}
                    >
                      {weapon.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-trek-text/70">Power Level</span>
                        <span className="text-trek-blue">{weapon.power}%</span>
                      </div>
                      <Progress value={weapon.power} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-trek-text/70">Charge Level</span>
                        <span className="text-trek-blue">
                          {weapon.charge.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={weapon.charge} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-trek-text/70">Temperature</span>
                        <span
                          className={
                            weapon.temperature > 80
                              ? "text-red-400"
                              : weapon.temperature > 60
                                ? "text-yellow-400"
                                : "text-green-400"
                          }
                        >
                          {weapon.temperature.toFixed(1)}°C
                        </span>
                      </div>
                      <Progress
                        value={weapon.temperature}
                        max={100}
                        className="h-2"
                      />
                    </div>

                    {weapon.ammunition !== undefined && (
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-trek-text/70">Ammunition</span>
                          <span className="text-trek-blue">
                            {weapon.ammunition}/{weapon.maxAmmunition}
                          </span>
                        </div>
                        <Progress
                          value={
                            (weapon.ammunition / (weapon.maxAmmunition || 1)) *
                            100
                          }
                          className="h-2"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-trek-text/70">Accuracy:</span>
                        <div className="text-trek-text">{weapon.accuracy}%</div>
                      </div>
                      <div>
                        <span className="text-trek-text/70">Range:</span>
                        <div className="text-trek-text">
                          {formatDistance(weapon.range)}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        onClick={() => setSelectedWeapon(weapon)}
                        variant={
                          selectedWeapon?.id === weapon.id
                            ? "default"
                            : "outline"
                        }
                        className="flex-1"
                      >
                        Select
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setWeaponSystems((prev) =>
                            prev.map((w) =>
                              w.id === weapon.id
                                ? {
                                    ...w,
                                    status:
                                      w.status === "online"
                                        ? "offline"
                                        : "online",
                                  }
                                : w,
                            ),
                          );
                        }}
                        variant="outline"
                        className={
                          weapon.status === "online"
                            ? "border-red-400 text-red-400"
                            : "border-green-400 text-green-400"
                        }
                      >
                        {weapon.status === "online" ? "Disable" : "Enable"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="power" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Power Distribution
              </h3>
              <div className="space-y-6">
                {Object.entries(powerDistribution).map(([system, power]) => (
                  <div key={system} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {system === "phasers" && (
                          <Zap className="w-4 h-4 text-trek-warning" />
                        )}
                        {system === "torpedoes" && (
                          <Target className="w-4 h-4 text-red-400" />
                        )}
                        {system === "shields" && (
                          <Shield className="w-4 h-4 text-trek-blue" />
                        )}
                        {system === "sensors" && (
                          <Radar className="w-4 h-4 text-green-400" />
                        )}
                        <Label className="text-trek-text capitalize">
                          {system}
                        </Label>
                      </div>
                      <span
                        className={`font-semibold ${
                          power >= 80
                            ? "text-green-400"
                            : power >= 60
                              ? "text-yellow-400"
                              : power >= 40
                                ? "text-orange-400"
                                : "text-red-400"
                        }`}
                      >
                        {power}%
                      </span>
                    </div>
                    <Slider
                      value={[power]}
                      onValueChange={(value) =>
                        setPowerDistribution((prev) => ({
                          ...prev,
                          [system]: value[0],
                        }))
                      }
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-trek-text">
                      Total Power Allocation:
                    </span>
                    <span
                      className={`font-semibold ${
                        Object.values(powerDistribution).reduce(
                          (a, b) => a + b,
                          0,
                        ) > 300
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {Object.values(powerDistribution).reduce(
                        (a, b) => a + b,
                        0,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={Object.values(powerDistribution).reduce(
                      (a, b) => a + b,
                      0,
                    )}
                    max={400}
                    className="h-3"
                  />
                  {Object.values(powerDistribution).reduce((a, b) => a + b, 0) >
                    300 && (
                    <p className="text-red-400 text-sm">
                      ⚠️ Power allocation exceeds recommended levels
                    </p>
                  )}
                </div>
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                System Status
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Battery className="w-4 h-4 text-trek-blue" />
                      <span className="text-trek-text">Main Power</span>
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                      98.7%
                    </div>
                    <div className="text-xs text-trek-text/70">
                      Warp Core Online
                    </div>
                  </div>

                  <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="w-4 h-4 text-orange-400" />
                      <span className="text-trek-text">Core Temp</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-400">
                      2,847°K
                    </div>
                    <div className="text-xs text-trek-text/70">
                      Within Normal Range
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-trek-text">Warp Core Efficiency</span>
                    <span className="text-green-400">96.2%</span>
                  </div>
                  <Progress value={96.2} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-trek-text">Backup Power</span>
                    <span className="text-trek-blue">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-trek-text">Emergency Power</span>
                    <span className="text-trek-blue">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold text-trek-blue">
                    Power Routing
                  </h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Primary Systems</span>
                      <span className="text-trek-text">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">
                        Secondary Systems
                      </span>
                      <span className="text-trek-text">12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Reserve</span>
                      <span className="text-trek-text">3%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fire_control" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Fire Control Settings
              </h3>
              <div className="space-y-6">
                <div>
                  <Label className="text-trek-text mb-2 block">
                    Selected Weapon
                  </Label>
                  <Select
                    value={selectedWeapon?.id || ""}
                    onValueChange={(value) => {
                      const weapon = weaponSystems.find((w) => w.id === value);
                      setSelectedWeapon(weapon || null);
                      setFireSolution((prev) => ({ ...prev, weaponId: value }));
                    }}
                  >
                    <SelectTrigger className="bg-trek-dark border-trek-accent">
                      <SelectValue placeholder="Select weapon system" />
                    </SelectTrigger>
                    <SelectContent>
                      {weaponSystems
                        .filter((w) => w.status === "online")
                        .map((weapon) => (
                          <SelectItem key={weapon.id} value={weapon.id}>
                            {weapon.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-trek-text mb-2 block">Target</Label>
                  <Select
                    value={selectedTarget?.id || ""}
                    onValueChange={(value) => {
                      const target = targets.find((t) => t.id === value);
                      setSelectedTarget(target || null);
                      setFireSolution((prev) => ({ ...prev, targetId: value }));
                    }}
                  >
                    <SelectTrigger className="bg-trek-dark border-trek-accent">
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      {targets.map((target) => (
                        <SelectItem key={target.id} value={target.id}>
                          {target.name} ({formatDistance(target.distance)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-trek-text">
                    Power Setting: {fireSolution.power}%
                  </Label>
                  <Slider
                    value={[fireSolution.power]}
                    onValueChange={(value) =>
                      setFireSolution((prev) => ({ ...prev, power: value[0] }))
                    }
                    max={100}
                    min={1}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-trek-text">
                    Beam Spread: {fireSolution.spread}°
                  </Label>
                  <Slider
                    value={[fireSolution.spread]}
                    onValueChange={(value) =>
                      setFireSolution((prev) => ({ ...prev, spread: value[0] }))
                    }
                    max={15}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-trek-text">
                    Salvo Count: {fireSolution.salvo}
                  </Label>
                  <Slider
                    value={[fireSolution.salvo]}
                    onValueChange={(value) =>
                      setFireSolution((prev) => ({ ...prev, salvo: value[0] }))
                    }
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-trek-text">
                    Firing Delay: {fireSolution.delay}s
                  </Label>
                  <Slider
                    value={[fireSolution.delay]}
                    onValueChange={(value) =>
                      setFireSolution((prev) => ({ ...prev, delay: value[0] }))
                    }
                    max={10}
                    min={0}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Firing Solution
              </h3>
              {selectedWeapon && selectedTarget ? (
                <div className="space-y-4">
                  <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                    <h4 className="font-semibold text-trek-blue mb-2">
                      Engagement Parameters
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-trek-text/70">Weapon:</span>
                        <span className="text-trek-text">
                          {selectedWeapon.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-trek-text/70">Target:</span>
                        <span className="text-trek-text">
                          {selectedTarget.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-trek-text/70">Range:</span>
                        <span className="text-trek-text">
                          {formatDistance(selectedTarget.distance)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-trek-text/70">Bearing:</span>
                        <span className="text-trek-text">
                          {selectedTarget.bearing.toFixed(1)}°
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-trek-text/70">Power:</span>
                        <span className="text-trek-text">
                          {fireSolution.power}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                    <h4 className="font-semibold text-trek-blue mb-2">
                      Hit Probability
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-trek-text/70">
                          Base Accuracy:
                        </span>
                        <span className="text-green-400">
                          {selectedWeapon.accuracy}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-trek-text/70">Range Factor:</span>
                        <span className="text-yellow-400">
                          {Math.max(
                            50,
                            100 - selectedTarget.distance / 1000,
                          ).toFixed(0)}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-trek-text/70">Target Size:</span>
                        <span className="text-yellow-400">
                          {Math.min(100, selectedTarget.size / 5).toFixed(0)}%
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span className="text-trek-text">
                          Total Probability:
                        </span>
                        <span className="text-trek-blue">
                          {Math.min(
                            95,
                            selectedWeapon.accuracy * 0.7 +
                              Math.max(
                                50,
                                100 - selectedTarget.distance / 1000,
                              ) *
                                0.2 +
                              Math.min(100, selectedTarget.size / 5) * 0.1,
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={fireWeapon}
                      disabled={
                        weaponsSafetyLock ||
                        firingSequence ||
                        selectedWeapon.status !== "online"
                      }
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3"
                    >
                      {firingSequence ? (
                        <>
                          <Activity className="w-4 h-4 mr-2 animate-pulse" />
                          FIRING...
                        </>
                      ) : (
                        <>
                          <Target className="w-4 h-4 mr-2" />
                          FIRE
                        </>
                      )}
                    </Button>

                    {weaponsSafetyLock && (
                      <p className="text-yellow-400 text-xs text-center">
                        ⚠️ Weapons safety lock engaged
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-trek-text/50 py-8">
                  Select weapon and target to configure firing solution
                </div>
              )}
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Combat Log
              </h3>
              <div className="bg-trek-dark/50 border border-trek-accent rounded p-4 h-96 overflow-y-auto">
                <div className="space-y-2">
                  {combatLog.length === 0 ? (
                    <div className="text-center text-trek-text/50 py-8">
                      No combat activity
                    </div>
                  ) : (
                    combatLog.slice(-20).map((entry, index) => (
                      <div key={index} className="text-sm">
                        <span className="text-trek-text/70">
                          [{new Date().toLocaleTimeString()}]
                        </span>
                        <span className="text-trek-text ml-2">{entry}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <Button
                onClick={() => setCombatLog([])}
                variant="outline"
                size="sm"
                className="w-full mt-4 border-trek-accent text-trek-text"
              >
                Clear Log
              </Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="diagnostics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                System Diagnostics
              </h3>
              <div className="space-y-4">
                {weaponSystems.map((weapon) => (
                  <div
                    key={weapon.id}
                    className="bg-trek-dark/50 border border-trek-accent rounded p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-trek-text">
                        {weapon.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={getStatusColor(weapon.status)}
                      >
                        {weapon.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div className="text-center">
                        <div
                          className={`text-lg font-semibold ${
                            weapon.power >= 80
                              ? "text-green-400"
                              : weapon.power >= 60
                                ? "text-yellow-400"
                                : "text-red-400"
                          }`}
                        >
                          {weapon.power}%
                        </div>
                        <div className="text-trek-text/70">Power</div>
                      </div>
                      <div className="text-center">
                        <div
                          className={`text-lg font-semibold ${
                            weapon.temperature <= 40
                              ? "text-green-400"
                              : weapon.temperature <= 70
                                ? "text-yellow-400"
                                : "text-red-400"
                          }`}
                        >
                          {weapon.temperature.toFixed(0)}°C
                        </div>
                        <div className="text-trek-text/70">Temp</div>
                      </div>
                      <div className="text-center">
                        <div
                          className={`text-lg font-semibold ${
                            weapon.charge >= 80
                              ? "text-green-400"
                              : weapon.charge >= 60
                                ? "text-yellow-400"
                                : "text-red-400"
                          }`}
                        >
                          {weapon.charge.toFixed(0)}%
                        </div>
                        <div className="text-trek-text/70">Charge</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-trek-text/70">
                          Overall Health
                        </span>
                        <span
                          className={`font-semibold ${
                            weapon.power >= 80 &&
                            weapon.temperature <= 60 &&
                            weapon.charge >= 80
                              ? "text-green-400"
                              : weapon.power >= 60 &&
                                  weapon.temperature <= 80 &&
                                  weapon.charge >= 60
                                ? "text-yellow-400"
                                : "text-red-400"
                          }`}
                        >
                          {weapon.power >= 80 &&
                          weapon.temperature <= 60 &&
                          weapon.charge >= 80
                            ? "OPTIMAL"
                            : weapon.power >= 60 &&
                                weapon.temperature <= 80 &&
                                weapon.charge >= 60
                              ? "NOMINAL"
                              : "DEGRADED"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Performance Metrics
              </h3>
              <div className="space-y-6">
                <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                  <h4 className="font-semibold text-trek-blue mb-3">
                    System Efficiency
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-trek-text/70">
                          Energy Weapons
                        </span>
                        <span className="text-green-400">94.2%</span>
                      </div>
                      <Progress value={94.2} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-trek-text/70">
                          Projectile Systems
                        </span>
                        <span className="text-green-400">98.7%</span>
                      </div>
                      <Progress value={98.7} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-trek-text/70">
                          Targeting Array
                        </span>
                        <span className="text-yellow-400">87.3%</span>
                      </div>
                      <Progress value={87.3} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                  <h4 className="font-semibold text-trek-blue mb-3">
                    Maintenance Schedule
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">
                        Last Maintenance:
                      </span>
                      <span className="text-trek-text">Stardate 98234.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Next Scheduled:</span>
                      <span className="text-trek-text">Stardate 98456.2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Overdue Items:</span>
                      <span className="text-yellow-400">2 components</span>
                    </div>
                  </div>
                </div>

                <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                  <h4 className="font-semibold text-trek-blue mb-3">
                    Combat Readiness
                  </h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      92%
                    </div>
                    <div className="text-sm text-trek-text/70">
                      All systems operational
                    </div>
                    <div className="mt-3 flex justify-center">
                      <Badge
                        variant="outline"
                        className="border-green-400 text-green-400"
                      >
                        READY FOR COMBAT
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
