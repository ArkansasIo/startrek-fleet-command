import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Shield,
  Zap,
  Users,
  Navigation,
  Radio,
  Clock,
  Target,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface AlertLevel {
  level: "Green" | "Yellow" | "Red" | "Blue";
  description: string;
  color: string;
  bgColor: string;
  protocols: string[];
}

interface EmergencyProtocol {
  id: string;
  name: string;
  status: "Standby" | "Active" | "Complete";
  description: string;
  required_for: string[];
  duration: number;
}

export function RedAlertSystem() {
  const [currentAlert, setCurrentAlert] = useState<
    "Green" | "Yellow" | "Red" | "Blue"
  >("Green");
  const [alertActive, setAlertActive] = useState(false);
  const [alertTimer, setAlertTimer] = useState(0);
  const [protocols, setProtocols] = useState<EmergencyProtocol[]>([
    {
      id: "shields",
      name: "Raise Shields",
      status: "Standby",
      description: "Activate deflector shields to maximum power",
      required_for: ["Yellow", "Red"],
      duration: 3,
    },
    {
      id: "weapons",
      name: "Arm Weapons",
      status: "Standby",
      description: "Charge phaser arrays and load photon torpedoes",
      required_for: ["Red"],
      duration: 5,
    },
    {
      id: "battlestations",
      name: "All Hands to Battle Stations",
      status: "Standby",
      description: "Crew report to emergency positions",
      required_for: ["Red"],
      duration: 8,
    },
    {
      id: "damage_control",
      name: "Damage Control Teams",
      status: "Standby",
      description: "Deploy repair teams throughout the ship",
      required_for: ["Yellow", "Red"],
      duration: 4,
    },
    {
      id: "secure_decks",
      name: "Secure Lower Decks",
      status: "Standby",
      description: "Lock down non-essential areas and evacuate civilians",
      required_for: ["Red"],
      duration: 6,
    },
    {
      id: "medical",
      name: "Medical Alert",
      status: "Standby",
      description: "Prepare sickbay for casualties",
      required_for: ["Red"],
      duration: 3,
    },
  ]);

  const alertLevels: Record<string, AlertLevel> = {
    Green: {
      level: "Green",
      description: "Normal Operations - No immediate threats detected",
      color: "text-green-400",
      bgColor: "bg-green-400/20 border-green-400",
      protocols: [
        "Standard crew rotations",
        "Normal system operations",
        "Regular patrol duties",
      ],
    },
    Yellow: {
      level: "Yellow",
      description: "Caution - Potential threat or unknown situation",
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/20 border-yellow-400",
      protocols: [
        "Enhanced sensor sweeps",
        "Damage control teams standby",
        "Senior staff on standby",
      ],
    },
    Red: {
      level: "Red",
      description: "Danger - Imminent threat to ship and crew",
      color: "text-red-400",
      bgColor: "bg-red-400/20 border-red-400",
      protocols: [
        "All hands to battle stations",
        "Maximum shields",
        "Weapons armed",
        "Emergency protocols active",
      ],
    },
    Blue: {
      level: "Blue",
      description: "Medical Emergency - Infectious disease protocols",
      color: "text-blue-400",
      bgColor: "bg-blue-400/20 border-blue-400",
      protocols: [
        "Medical isolation procedures",
        "Quarantine protocols",
        "Emergency medical teams",
      ],
    },
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (alertActive && currentAlert !== "Green") {
      interval = setInterval(() => {
        setAlertTimer((prev) => prev + 1);

        // Auto-execute protocols based on alert level
        setProtocols((prev) =>
          prev.map((protocol) => {
            if (
              protocol.required_for.includes(currentAlert) &&
              protocol.status === "Standby"
            ) {
              // Simulate protocol execution with delay
              setTimeout(() => {
                setProtocols((p) =>
                  p.map((prot) =>
                    prot.id === protocol.id
                      ? { ...prot, status: "Active" }
                      : prot,
                  ),
                );

                setTimeout(() => {
                  setProtocols((p) =>
                    p.map((prot) =>
                      prot.id === protocol.id
                        ? { ...prot, status: "Complete" }
                        : prot,
                    ),
                  );
                }, protocol.duration * 1000);
              }, Math.random() * 2000);

              return { ...protocol, status: "Active" };
            }
            return protocol;
          }),
        );
      }, 1000);
    } else {
      setAlertTimer(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [alertActive, currentAlert]);

  const activateAlert = (level: "Green" | "Yellow" | "Red" | "Blue") => {
    setCurrentAlert(level);
    setAlertActive(level !== "Green");

    if (level === "Green") {
      // Reset all protocols
      setProtocols((prev) =>
        prev.map((protocol) => ({ ...protocol, status: "Standby" })),
      );
      setAlertTimer(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getProtocolIcon = (status: string) => {
    switch (status) {
      case "Complete":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "Active":
        return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />;
      default:
        return <XCircle className="w-4 h-4 text-trek-text/40" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          ALERT STATUS CONTROL
        </h2>
        {alertActive && (
          <div className="flex items-center gap-3">
            <div
              className={`animate-pulse px-3 py-1 rounded border ${alertLevels[currentAlert].bgColor}`}
            >
              <span className={`font-bold ${alertLevels[currentAlert].color}`}>
                {currentAlert.toUpperCase()} ALERT
              </span>
            </div>
            <div className="text-trek-text">
              Duration: {formatTime(alertTimer)}
            </div>
          </div>
        )}
      </div>

      {/* Alert Level Controls */}
      <Card
        className={`border-2 transition-colors ${alertLevels[currentAlert].bgColor}`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle
              className={`w-8 h-8 ${alertLevels[currentAlert].color}`}
            />
            <div>
              <h3 className="text-2xl font-bold text-trek-gold">
                {alertLevels[currentAlert].level} Alert
              </h3>
              <p className="text-trek-text/80">
                {alertLevels[currentAlert].description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {Object.entries(alertLevels).map(([key, alert]) => (
              <Button
                key={key}
                variant={currentAlert === key ? "default" : "outline"}
                size="sm"
                className={`${
                  currentAlert === key
                    ? `${alert.bgColor} ${alert.color}`
                    : `border-trek-accent hover:${alert.bgColor} hover:${alert.color}`
                }`}
                onClick={() => activateAlert(key as any)}
              >
                {alert.level} Alert
              </Button>
            ))}
          </div>

          <div>
            <h4 className="font-semibold text-trek-gold mb-2">
              Active Protocols
            </h4>
            <div className="flex flex-wrap gap-1">
              {alertLevels[currentAlert].protocols.map((protocol, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className={`text-xs ${alertLevels[currentAlert].color} border-current`}
                >
                  {protocol}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Emergency Protocols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {protocols.map((protocol) => (
          <Card
            key={protocol.id}
            className="bg-trek-panel border-trek-accent p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getProtocolIcon(protocol.status)}
                <h4 className="font-semibold text-trek-gold">
                  {protocol.name}
                </h4>
              </div>
              <Badge
                variant="secondary"
                className={`text-xs ${
                  protocol.status === "Complete"
                    ? "bg-green-400/20 text-green-400 border-green-400"
                    : protocol.status === "Active"
                      ? "bg-yellow-400/20 text-yellow-400 border-yellow-400"
                      : "bg-trek-accent/20 text-trek-text border-trek-accent"
                }`}
              >
                {protocol.status}
              </Badge>
            </div>

            <p className="text-sm text-trek-text/80 mb-2">
              {protocol.description}
            </p>

            <div className="flex items-center justify-between text-xs">
              <span className="text-trek-text/70">
                Required for: {protocol.required_for.join(", ")} Alert
              </span>
              <span className="text-trek-blue">
                {protocol.duration}s duration
              </span>
            </div>

            {protocol.status === "Active" && (
              <div className="mt-2">
                <div className="w-full bg-trek-accent/20 rounded-full h-1">
                  <div
                    className="bg-yellow-400 h-1 rounded-full animate-pulse"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Quick Response Actions */}
      <Card className="bg-trek-panel border-trek-accent p-6">
        <h3 className="text-xl font-bold text-trek-gold mb-4">
          Emergency Response Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-semibold text-trek-blue mb-2">Defensive</h4>
            <div className="space-y-2">
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
              >
                <Shield className="w-4 h-4 mr-2" />
                Emergency Shield Boost
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Evasive Maneuvers
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-trek-warning mb-2">Offensive</h4>
            <div className="space-y-2">
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start border-trek-warning text-trek-warning hover:bg-trek-warning hover:text-trek-dark"
              >
                <Zap className="w-4 h-4 mr-2" />
                Weapons Free
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start border-trek-warning text-trek-warning hover:bg-trek-warning hover:text-trek-dark"
              >
                <Target className="w-4 h-4 mr-2" />
                Target Enemy Vessels
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-trek-gold mb-2">Communication</h4>
            <div className="space-y-2">
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
              >
                <Radio className="w-4 h-4 mr-2" />
                Distress Signal
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
              >
                <Users className="w-4 h-4 mr-2" />
                Request Reinforcements
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
