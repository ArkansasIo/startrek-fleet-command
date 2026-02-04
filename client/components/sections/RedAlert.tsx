import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Zap, Radio, Clock } from "lucide-react";

interface RedAlertProps {
  activeSubmenu?: string;
}

export function RedAlert({ activeSubmenu }: RedAlertProps) {
  const [alertStatus, setAlertStatus] = useState<"green" | "yellow" | "red">("green");
  const [threatLevel, setThreatLevel] = useState(0);
  const [ships, setShips] = useState([
    { id: 1, name: "USS Enterprise-D", status: "Ready", crew: 1014 },
    { id: 2, name: "USS Defiant", status: "Ready", crew: 47 },
    { id: 3, name: "USS Voyager", status: "Ready", crew: 141 },
  ]);

  const handleRedAlert = () => {
    setAlertStatus("red");
    setThreatLevel(100);
  };

  const handleYellowAlert = () => {
    setAlertStatus("yellow");
    setThreatLevel(50);
  };

  const handleGreenAlert = () => {
    setAlertStatus("green");
    setThreatLevel(0);
  };

  const handleStandDown = () => {
    setAlertStatus("green");
    setThreatLevel(0);
  };

  const alertColors = {
    green: "text-trek-green",
    yellow: "text-yellow-400",
    red: "text-red-500",
  };

  const alertBgColors = {
    green: "bg-trek-green/20 border-trek-green",
    yellow: "bg-yellow-400/20 border-yellow-400",
    red: "bg-red-500/20 border-red-500",
  };

  return (
    <div className="space-y-6">
      {/* Alert Status */}
      <Card className={`border-2 ${alertBgColors[alertStatus]}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${alertColors[alertStatus]}`}>
            <AlertTriangle className="w-6 h-6" />
            ALERT STATUS: {alertStatus.toUpperCase()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <span className="text-trek-text/70 text-sm">Threat Level</span>
              <div className="text-3xl font-bold text-trek-gold">{threatLevel}%</div>
            </div>
            <div>
              <span className="text-trek-text/70 text-sm">Ships Ready</span>
              <div className="text-3xl font-bold text-trek-blue">{ships.length}</div>
            </div>
            <div>
              <span className="text-trek-text/70 text-sm">Total Crew</span>
              <div className="text-3xl font-bold text-trek-blue">
                {ships.reduce((sum, s) => sum + s.crew, 0)}
              </div>
            </div>
            <div>
              <span className="text-trek-text/70 text-sm">Defense Status</span>
              <div className="text-xl font-bold text-trek-green">OPTIMAL</div>
            </div>
          </div>

          {/* Alert Controls */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-trek-accent">
            <Button
              onClick={handleGreenAlert}
              className="bg-trek-green hover:bg-trek-green/80 text-trek-dark font-bold"
            >
              Green Alert
            </Button>
            <Button
              onClick={handleYellowAlert}
              className="bg-yellow-500 hover:bg-yellow-600 text-trek-dark font-bold"
            >
              Yellow Alert
            </Button>
            <Button
              onClick={handleRedAlert}
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              Red Alert
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ships Status */}
      <Card className="bg-trek-panel border-trek-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-trek-gold">
            <Radio className="w-5 h-5" />
            Fleet Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ships.map((ship) => (
              <div
                key={ship.id}
                className="bg-trek-dark/50 p-4 rounded border border-trek-blue/30 flex justify-between items-center"
              >
                <div>
                  <div className="font-bold text-trek-blue">{ship.name}</div>
                  <div className="text-xs text-trek-text/60">{ship.crew} crew members</div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-trek-green" />
                  <span className="font-semibold text-trek-green">{ship.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Defense Systems */}
      <Card className="bg-trek-panel border-trek-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-trek-gold">
            <Zap className="w-5 h-5" />
            Defense Systems
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "Deflector Shields", power: 100, status: "Online" },
            { name: "Weapon Systems", power: 98, status: "Armed" },
            { name: "Structural Integrity", power: 95, status: "Nominal" },
            { name: "Engine Power", power: 100, status: "Maximum" },
          ].map((system, idx) => (
            <div key={idx} className="bg-trek-dark/50 p-3 rounded border border-trek-blue/30">
              <div className="flex justify-between mb-2">
                <span className="text-trek-text">{system.name}</span>
                <span className="text-trek-green font-bold">{system.power}%</span>
              </div>
              <div className="w-full bg-trek-dark rounded h-2">
                <div
                  className="bg-trek-green h-2 rounded transition-all"
                  style={{ width: `${system.power}%` }}
                ></div>
              </div>
              <div className="text-xs text-trek-text/60 mt-1">{system.status}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Response Time */}
      <Card className="bg-trek-panel border-trek-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-trek-gold">
            <Clock className="w-5 h-5" />
            Response Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-trek-dark/50 rounded border border-trek-blue/30">
              <div className="text-trek-text/70 text-sm">Red Alert Activation</div>
              <div className="text-2xl font-bold text-trek-blue">45s</div>
            </div>
            <div className="text-center p-4 bg-trek-dark/50 rounded border border-trek-blue/30">
              <div className="text-trek-text/70 text-sm">Shield Activation</div>
              <div className="text-2xl font-bold text-trek-blue">12s</div>
            </div>
            <div className="text-center p-4 bg-trek-dark/50 rounded border border-trek-blue/30">
              <div className="text-trek-text/70 text-sm">Weapons Ready</div>
              <div className="text-2xl font-bold text-trek-blue">8s</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
