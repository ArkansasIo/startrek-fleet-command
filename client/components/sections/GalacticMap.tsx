import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Navigation,
  Zap,
  MapPin,
  Search,
  AlertTriangle,
  Star,
} from "lucide-react";

interface StarSystem {
  id: string;
  name: string;
  sector: string;
  coordinates: { x: number; y: number; z: number };
  classification: string;
  planets: number;
  population?: string;
  government?: string;
  threat_level: "Safe" | "Caution" | "Dangerous" | "Restricted";
  phenomena?: string[];
  distance_ly: number;
}

interface Sector {
  id: string;
  name: string;
  quadrant: string;
  systems: StarSystem[];
  controlled_by: string;
}

export function GalacticMap() {
  const [selectedSystem, setSelectedSystem] = useState<StarSystem | null>(null);
  const [selectedSector, setSelectedSector] = useState<string>("001");
  const [warpDestination, setWarpDestination] = useState<StarSystem | null>(
    null,
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sectors: Sector[] = [
    {
      id: "001",
      name: "Sector 001",
      quadrant: "Alpha",
      controlled_by: "United Federation of Planets",
      systems: [
        {
          id: "sol",
          name: "Sol System",
          sector: "001",
          coordinates: { x: 0, y: 0, z: 0 },
          classification: "G-type Star",
          planets: 8,
          population: "9.8 Billion",
          government: "United Earth",
          threat_level: "Safe",
          distance_ly: 0,
        },
        {
          id: "proxima",
          name: "Proxima Centauri",
          sector: "001",
          coordinates: { x: 4.24, y: 1.2, z: -0.8 },
          classification: "M-dwarf Star",
          planets: 3,
          population: "2.1 Million",
          government: "Federation Colony",
          threat_level: "Safe",
          distance_ly: 4.24,
        },
        {
          id: "vulcan",
          name: "40 Eridani (Vulcan)",
          sector: "001",
          coordinates: { x: 16.5, y: -2.1, z: 3.4 },
          classification: "K-type Star",
          planets: 7,
          population: "6.2 Billion",
          government: "Vulcan High Command",
          threat_level: "Safe",
          distance_ly: 16.5,
        },
      ],
    },
    {
      id: "023",
      name: "Sector 023",
      quadrant: "Alpha",
      controlled_by: "United Federation of Planets",
      systems: [
        {
          id: "wolf359",
          name: "Wolf 359",
          sector: "023",
          coordinates: { x: 7.86, y: 2.3, z: -1.1 },
          classification: "M-dwarf Star",
          planets: 2,
          threat_level: "Caution",
          phenomena: ["Borg Debris Field", "Spatial Anomalies"],
          distance_ly: 7.86,
        },
        {
          id: "rigel",
          name: "Rigel System",
          sector: "023",
          coordinates: { x: 860, y: 45, z: -12 },
          classification: "B-type Supergiant",
          planets: 12,
          population: "1.8 Billion",
          government: "Rigel Trade Authority",
          threat_level: "Safe",
          distance_ly: 860,
        },
      ],
    },
    {
      id: "441",
      name: "Sector 441",
      quadrant: "Beta",
      controlled_by: "Klingon Empire",
      systems: [
        {
          id: "qonos",
          name: "Qo'noS (Kronos)",
          sector: "441",
          coordinates: { x: 112, y: -23, z: 67 },
          classification: "K-type Star",
          planets: 1,
          population: "5.2 Billion",
          government: "Klingon High Council",
          threat_level: "Dangerous",
          distance_ly: 112,
        },
      ],
    },
  ];

  const currentSector = sectors.find((s) => s.id === selectedSector);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentSector) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars background
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const brightness = Math.random();
      ctx.fillStyle = `rgba(190, 242, 255, ${brightness * 0.8})`;
      ctx.fillRect(x, y, 1, 1);
    }

    // Draw grid
    ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 20; i++) {
      const x = (i / 20) * canvas.width;
      const y = (i / 20) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw systems
    currentSector.systems.forEach((system, index) => {
      const x = 100 + (index % 3) * 120 + Math.random() * 50;
      const y = 100 + Math.floor(index / 3) * 120 + Math.random() * 50;

      // System glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.8)");
      gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(x - 20, y - 20, 40, 40);

      // System star
      ctx.fillStyle =
        system.threat_level === "Dangerous"
          ? "#ef4444"
          : system.threat_level === "Caution"
            ? "#f59e0b"
            : "#3b82f6";
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();

      // System name
      ctx.fillStyle = "#bef2ff";
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.fillText(system.name, x, y + 25);
    });
  }, [currentSector]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          GALACTIC NAVIGATION
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
          >
            <Search className="w-4 h-4 mr-2" />
            Long Range Scan
          </Button>
          <Button
            className="bg-trek-warning hover:bg-trek-warning/80 text-trek-dark font-semibold"
            disabled={!warpDestination}
          >
            <Zap className="w-4 h-4 mr-2" />
            Engage Warp Drive
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sector Selection */}
        <Card className="bg-trek-panel border-trek-accent p-4">
          <h3 className="text-lg font-bold text-trek-gold mb-4">
            Sector Navigation
          </h3>
          <div className="space-y-2">
            {sectors.map((sector) => (
              <Button
                key={sector.id}
                variant="ghost"
                className={`w-full justify-start text-left p-3 ${
                  selectedSector === sector.id
                    ? "bg-trek-blue/20 border border-trek-blue text-trek-blue"
                    : "hover:bg-trek-accent border border-transparent"
                }`}
                onClick={() => setSelectedSector(sector.id)}
              >
                <div>
                  <div className="font-semibold">{sector.name}</div>
                  <div className="text-xs text-trek-text/70">
                    {sector.quadrant} Quadrant
                  </div>
                  <div className="text-xs text-trek-gold">
                    {sector.controlled_by}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </Card>

        {/* Star Map Canvas */}
        <Card className="bg-trek-panel border-trek-accent p-4">
          <h3 className="text-lg font-bold text-trek-gold mb-4">
            Sector {selectedSector} Map
          </h3>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="border border-trek-accent rounded cursor-crosshair"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                console.log(`Clicked at: ${x}, ${y}`);
              }}
            />
            <div className="absolute top-2 left-2 text-xs text-trek-text/70 bg-trek-dark/80 p-1 rounded">
              Click to scan coordinates
            </div>
          </div>
        </Card>

        {/* System Information */}
        <Card className="bg-trek-panel border-trek-accent p-4">
          <h3 className="text-lg font-bold text-trek-gold mb-4">
            System Analysis
          </h3>
          {currentSector && (
            <div className="space-y-4">
              {currentSector.systems.map((system) => (
                <div
                  key={system.id}
                  className={`p-3 border rounded cursor-pointer transition-colors ${
                    selectedSystem?.id === system.id
                      ? "border-trek-blue bg-trek-blue/10"
                      : "border-trek-accent hover:border-trek-blue/50"
                  }`}
                  onClick={() => {
                    setSelectedSystem(system);
                    setWarpDestination(system);
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-trek-gold">
                        {system.name}
                      </h4>
                      <p className="text-xs text-trek-text/70">
                        {system.classification}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        system.threat_level === "Safe"
                          ? "bg-green-500/20 text-green-400 border-green-400"
                          : system.threat_level === "Caution"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-400"
                            : system.threat_level === "Dangerous"
                              ? "bg-red-500/20 text-red-400 border-red-400"
                              : "bg-purple-500/20 text-purple-400 border-purple-400"
                      }`}
                    >
                      {system.threat_level}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Distance:</span>
                      <span className="text-trek-blue">
                        {system.distance_ly} ly
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Planets:</span>
                      <span className="text-trek-blue">{system.planets}</span>
                    </div>
                    {system.population && (
                      <div className="flex justify-between">
                        <span className="text-trek-text/70">Population:</span>
                        <span className="text-trek-blue">
                          {system.population}
                        </span>
                      </div>
                    )}
                    {system.government && (
                      <div className="flex justify-between">
                        <span className="text-trek-text/70">Government:</span>
                        <span className="text-trek-gold text-xs">
                          {system.government}
                        </span>
                      </div>
                    )}
                    {system.phenomena && (
                      <div className="mt-2">
                        <div className="text-trek-text/70 text-xs mb-1">
                          Phenomena:
                        </div>
                        {system.phenomena.map((phenomenon, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs mr-1 mb-1 border-trek-warning text-trek-warning"
                          >
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {phenomenon}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Warp Destination */}
      {warpDestination && (
        <Card className="bg-trek-panel border-trek-blue p-6">
          <div className="flex items-center gap-3 mb-4">
            <Navigation className="w-6 h-6 text-trek-blue" />
            <h3 className="text-xl font-bold text-trek-gold">
              Navigation Computer
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-trek-text/70 text-sm">Destination</div>
              <div className="text-trek-blue font-semibold">
                {warpDestination.name}
              </div>
            </div>
            <div>
              <div className="text-trek-text/70 text-sm">Distance</div>
              <div className="text-trek-blue font-semibold">
                {warpDestination.distance_ly} light years
              </div>
            </div>
            <div>
              <div className="text-trek-text/70 text-sm">ETA at Warp 6</div>
              <div className="text-trek-blue font-semibold">
                {Math.ceil(warpDestination.distance_ly / 216)} days
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
