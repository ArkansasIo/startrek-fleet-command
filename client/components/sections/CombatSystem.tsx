import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Shield,
  Zap,
  AlertTriangle,
  CrosshairIcon as Crosshair,
  Navigation,
  Radar,
  Clock,
  Activity,
} from "lucide-react";

interface EnemyVessel {
  id: string;
  name: string;
  class: string;
  hull_integrity: number;
  shield_strength: number;
  distance: number;
  bearing: number;
  threat_level: "Low" | "Medium" | "High" | "Critical";
  weapon_types: string[];
  status: "Approaching" | "Engaged" | "Retreating" | "Destroyed";
}

interface WeaponSystem {
  id: string;
  name: string;
  type: "Phaser" | "Photon Torpedo" | "Quantum Torpedo";
  charge_level: number;
  firing_rate: number;
  max_range: number;
  damage_output: number;
  status: "Ready" | "Charging" | "Offline" | "Overheated";
}

interface CombatStatus {
  hull_integrity: number;
  shield_strength: number;
  power_distribution: {
    weapons: number;
    shields: number;
    engines: number;
  };
  alert_condition: "Green" | "Yellow" | "Red";
  evasive_maneuvers: boolean;
}

export function CombatSystem() {
  const [combatActive, setCombatActive] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [combatTimer, setCombatTimer] = useState(0);

  const [enemyVessels, setEnemyVessels] = useState<EnemyVessel[]>([
    {
      id: "borg_cube",
      name: "Borg Cube",
      class: "Borg Tactical Cube",
      hull_integrity: 85,
      shield_strength: 92,
      distance: 15000,
      bearing: 45,
      threat_level: "Critical",
      weapon_types: ["Cutting Beam", "Tractor Beam"],
      status: "Approaching",
    },
    {
      id: "klingon_1",
      name: "I.K.S. Hegh'ta",
      class: "Bird-of-Prey",
      hull_integrity: 78,
      shield_strength: 65,
      distance: 8500,
      bearing: 125,
      threat_level: "High",
      weapon_types: ["Disruptors", "Photon Torpedoes"],
      status: "Engaged",
    },
  ]);

  const [weaponSystems, setWeaponSystems] = useState<WeaponSystem[]>([
    {
      id: "phaser_array_1",
      name: "Forward Phaser Array",
      type: "Phaser",
      charge_level: 100,
      firing_rate: 3,
      max_range: 12000,
      damage_output: 85,
      status: "Ready",
    },
    {
      id: "phaser_array_2",
      name: "Aft Phaser Array",
      type: "Phaser",
      charge_level: 100,
      firing_rate: 3,
      max_range: 12000,
      damage_output: 85,
      status: "Ready",
    },
    {
      id: "torpedo_launcher_1",
      name: "Forward Torpedo Launcher",
      type: "Photon Torpedo",
      charge_level: 95,
      firing_rate: 1,
      max_range: 25000,
      damage_output: 120,
      status: "Ready",
    },
    {
      id: "torpedo_launcher_2",
      name: "Aft Torpedo Launcher",
      type: "Quantum Torpedo",
      charge_level: 88,
      firing_rate: 1,
      max_range: 30000,
      damage_output: 150,
      status: "Charging",
    },
  ]);

  const [combatStatus, setCombatStatus] = useState<CombatStatus>({
    hull_integrity: 98,
    shield_strength: 100,
    power_distribution: {
      weapons: 35,
      shields: 40,
      engines: 25,
    },
    alert_condition: "Red",
    evasive_maneuvers: false,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (combatActive) {
      interval = setInterval(() => {
        setCombatTimer((prev) => prev + 1);

        // Simulate combat dynamics
        setEnemyVessels((prev) =>
          prev.map((enemy) => ({
            ...enemy,
            distance: Math.max(1000, enemy.distance - Math.random() * 500),
            hull_integrity:
              enemy.status === "Engaged"
                ? Math.max(0, enemy.hull_integrity - Math.random() * 2)
                : enemy.hull_integrity,
            shield_strength:
              enemy.status === "Engaged"
                ? Math.max(0, enemy.shield_strength - Math.random() * 3)
                : enemy.shield_strength,
          })),
        );

        // Simulate weapon recharging
        setWeaponSystems((prev) =>
          prev.map((weapon) => ({
            ...weapon,
            charge_level:
              weapon.status === "Charging"
                ? Math.min(100, weapon.charge_level + 5)
                : weapon.charge_level,
            status:
              weapon.status === "Charging" && weapon.charge_level >= 95
                ? "Ready"
                : weapon.status,
          })),
        );
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [combatActive]);

  const fireWeapon = (weaponId: string) => {
    if (!selectedTarget) return;

    setWeaponSystems((prev) =>
      prev.map((weapon) =>
        weapon.id === weaponId
          ? { ...weapon, charge_level: 0, status: "Charging" }
          : weapon,
      ),
    );

    // Damage enemy
    setEnemyVessels((prev) =>
      prev.map((enemy) =>
        enemy.id === selectedTarget
          ? {
              ...enemy,
              shield_strength: Math.max(0, enemy.shield_strength - 15),
              hull_integrity:
                enemy.shield_strength <= 15
                  ? Math.max(0, enemy.hull_integrity - 25)
                  : enemy.hull_integrity,
            }
          : enemy,
      ),
    );
  };

  const adjustPowerDistribution = (
    system: keyof CombatStatus["power_distribution"],
    change: number,
  ) => {
    setCombatStatus((prev) => {
      const current = prev.power_distribution[system];
      const newValue = Math.max(0, Math.min(100, current + change));
      const totalOthers = Object.entries(prev.power_distribution)
        .filter(([key]) => key !== system)
        .reduce((sum, [, value]) => sum + value, 0);

      if (totalOthers + newValue <= 100) {
        return {
          ...prev,
          power_distribution: {
            ...prev.power_distribution,
            [system]: newValue,
          },
        };
      }
      return prev;
    });
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "text-red-500 border-red-500 bg-red-500/20";
      case "High":
        return "text-red-400 border-red-400 bg-red-400/20";
      case "Medium":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Low":
        return "text-green-400 border-green-400 bg-green-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          TACTICAL COMBAT SYSTEMS
        </h2>
        <div className="flex items-center gap-4">
          {combatActive && (
            <div className="flex items-center gap-2 text-red-400">
              <Activity className="w-5 h-5 animate-pulse" />
              <span>COMBAT ACTIVE: {formatTime(combatTimer)}</span>
            </div>
          )}
          <Button
            variant={combatActive ? "destructive" : "default"}
            className={
              combatActive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
            }
            onClick={() => setCombatActive(!combatActive)}
          >
            {combatActive ? "End Combat" : "Initiate Combat"}
          </Button>
        </div>
      </div>

      {/* Ship Status */}
      <Card className="bg-trek-panel border-trek-accent p-6">
        <h3 className="text-xl font-bold text-trek-gold mb-4">Ship Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-trek-text/70">Hull Integrity</span>
              <span className="text-trek-blue">
                {combatStatus.hull_integrity}%
              </span>
            </div>
            <Progress value={combatStatus.hull_integrity} className="mb-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-trek-text/70">Shield Strength</span>
              <span className="text-trek-blue">
                {combatStatus.shield_strength}%
              </span>
            </div>
            <Progress value={combatStatus.shield_strength} className="mb-2" />
          </div>

          <div>
            <Badge
              variant="secondary"
              className={`${
                combatStatus.alert_condition === "Red"
                  ? "bg-red-400/20 text-red-400 border-red-400"
                  : combatStatus.alert_condition === "Yellow"
                    ? "bg-yellow-400/20 text-yellow-400 border-yellow-400"
                    : "bg-green-400/20 text-green-400 border-green-400"
              }`}
            >
              {combatStatus.alert_condition} Alert
            </Badge>

            {combatStatus.evasive_maneuvers && (
              <Badge
                variant="secondary"
                className="mt-2 bg-trek-blue/20 text-trek-blue border-trek-blue"
              >
                Evasive Maneuvers
              </Badge>
            )}
          </div>

          <div>
            <Button
              size="sm"
              variant="outline"
              className="w-full border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
              onClick={() =>
                setCombatStatus((prev) => ({
                  ...prev,
                  evasive_maneuvers: !prev.evasive_maneuvers,
                }))
              }
            >
              <Navigation className="w-4 h-4 mr-2" />
              {combatStatus.evasive_maneuvers
                ? "Cancel Evasive"
                : "Evasive Maneuvers"}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enemy Contacts */}
        <Card className="bg-trek-panel border-trek-accent p-6">
          <h3 className="text-xl font-bold text-trek-gold mb-4">
            Enemy Contacts
          </h3>
          <div className="space-y-3">
            {enemyVessels.map((enemy) => (
              <div
                key={enemy.id}
                className={`p-3 border rounded cursor-pointer transition-colors ${
                  selectedTarget === enemy.id
                    ? "border-red-400 bg-red-400/10"
                    : "border-trek-accent hover:border-red-400/50"
                }`}
                onClick={() => setSelectedTarget(enemy.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-trek-gold">{enemy.name}</h4>
                    <p className="text-sm text-trek-text/70">{enemy.class}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${getThreatColor(enemy.threat_level)}`}
                  >
                    {enemy.threat_level} Threat
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                  <div>
                    <div className="text-trek-text/70">
                      Hull: {enemy.hull_integrity}%
                    </div>
                    <Progress value={enemy.hull_integrity} className="h-1" />
                  </div>
                  <div>
                    <div className="text-trek-text/70">
                      Shields: {enemy.shield_strength}%
                    </div>
                    <Progress value={enemy.shield_strength} className="h-1" />
                  </div>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-trek-text/70">
                    Distance: {enemy.distance.toLocaleString()} km
                  </span>
                  <span className="text-trek-text/70">
                    Bearing: {enemy.bearing}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Weapon Systems */}
        <Card className="bg-trek-panel border-trek-accent p-6">
          <h3 className="text-xl font-bold text-trek-gold mb-4">
            Weapon Systems
          </h3>
          <div className="space-y-3">
            {weaponSystems.map((weapon) => (
              <div
                key={weapon.id}
                className="p-3 border border-trek-accent rounded"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-trek-gold">
                      {weapon.name}
                    </h4>
                    <p className="text-sm text-trek-blue">{weapon.type}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      weapon.status === "Ready"
                        ? "bg-green-400/20 text-green-400 border-green-400"
                        : weapon.status === "Charging"
                          ? "bg-yellow-400/20 text-yellow-400 border-yellow-400"
                          : weapon.status === "Overheated"
                            ? "bg-red-400/20 text-red-400 border-red-400"
                            : "bg-gray-400/20 text-gray-400 border-gray-400"
                    }`}
                  >
                    {weapon.status}
                  </Badge>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-trek-text/70">Charge Level</span>
                    <span className="text-trek-blue">
                      {weapon.charge_level}%
                    </span>
                  </div>
                  <Progress value={weapon.charge_level} className="h-2" />
                </div>

                <div className="flex justify-between text-xs mb-3">
                  <span className="text-trek-text/70">
                    Range: {weapon.max_range.toLocaleString()} km
                  </span>
                  <span className="text-trek-text/70">
                    Damage: {weapon.damage_output}
                  </span>
                </div>

                <Button
                  size="sm"
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                  disabled={weapon.status !== "Ready" || !selectedTarget}
                  onClick={() => fireWeapon(weapon.id)}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Fire
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Power Distribution */}
      <Card className="bg-trek-panel border-trek-accent p-6">
        <h3 className="text-xl font-bold text-trek-gold mb-4">
          Power Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(combatStatus.power_distribution).map(
            ([system, power]) => (
              <div key={system} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-trek-gold capitalize">
                    {system}
                  </span>
                  <span className="text-trek-blue">{power}%</span>
                </div>
                <Progress value={power} className="h-3" />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-400 text-red-400 hover:bg-red-400 hover:text-trek-dark"
                    onClick={() => adjustPowerDistribution(system as any, -5)}
                  >
                    -5%
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-400 text-green-400 hover:bg-green-400 hover:text-trek-dark"
                    onClick={() => adjustPowerDistribution(system as any, +5)}
                  >
                    +5%
                  </Button>
                </div>
              </div>
            ),
          )}
        </div>
      </Card>
    </div>
  );
}
