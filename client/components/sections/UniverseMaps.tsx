import { useState, useEffect, useRef } from "react";
import { Player, GameStateArray, createInitialPlayer, processTurnArray } from "../../lib/MMORPGGameEngine.tsx";
import { BUILDINGS, FLEET_UNITS, RESEARCHES } from "../../lib/OGameMechanics";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Progress } from "../ui/progress";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Map,
  Globe,
  Star,
  Navigation,
  Search,
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCw,
  MapPin,
  Crosshair,
  Layers,
  Compass,
  Target,
  AlertTriangle,
  Shield,
  Zap,
  Radio,
  Eye,
  Settings,
  RefreshCw,
  Maximize,
  Move,
  Radar,
  Grid,
  Rocket,
} from "lucide-react";

interface UniverseMapsProps {
  activeSubmenu?: string;
}

interface GalacticQuadrant {
  id: string;
  name: string;
  sectors: number;
  explored: number;
  controlled_territories: Territory[];
  major_powers: string[];
  phenomena: string[];
  threat_level: number;
  coordinates: { x: number; y: number };
}

interface Territory {
  name: string;
  color: string;
  systems: number;
  capital: string;
}

interface Sector {
  id: string;
  name: string;
  quadrant: string;
  grid_coordinates: { x: number; y: number };
  systems: StarSystem[];
  controlled_by: string;
  patrol_routes: PatrolRoute[];
  trade_routes: TradeRoute[];
  strategic_value: number;
  exploration_status: number;
}

interface StarSystem {
  id: string;
  name: string;
  coordinates: { x: number; y: number; z: number };
  star_type: string;
  star_class: string;
  planets: Planet[];
  moons: number;
  asteroids: boolean;
  nebulae: boolean;
  space_stations: SpaceStation[];
  phenomena: string[];
  threat_level: "safe" | "caution" | "dangerous" | "restricted";
  government: string;
  species: string[];
  trade_value: number;
  strategic_importance: number;
  last_surveyed: string;
}

interface Planet {
  id: string;
  name: string;
  class: string;
  type: "terrestrial" | "gas_giant" | "ice_world" | "desert" | "ocean";
  population: number;
  government: string;
  species: string[];
  resources: string[];
  facilities: string[];
  moons: number;
}

interface SpaceStation {
  id: string;
  name: string;
  type: "starbase" | "outpost" | "research" | "mining" | "trading";
  operator: string;
  population: number;
  facilities: string[];
  defense_rating: number;
}

interface PatrolRoute {
  id: string;
  name: string;
  waypoints: string[];
  frequency: string;
  assigned_vessels: string[];
}

interface TradeRoute {
  id: string;
  name: string;
  origin: string;
  destination: string;
  cargo_types: string[];
  frequency: string;
  security_level: string;
}

interface NavBeacon {
  id: string;
  name: string;
  coordinates: { x: number; y: number; z: number };
  type: "navigation" | "warning" | "emergency" | "restricted";
  range: number;
  message: string;
}

export function UniverseMaps({ activeSubmenu }: UniverseMapsProps) {
    // --- MMORPG/OGame Integration ---
    // Demo: single player state (replace with context or backend for real game)
    const [player, setPlayer] = useState<Player>(() => createInitialPlayer("demo", "Captain Demo"));
    const [game, setGame] = useState<GameStateArray>({ players: [player], turn: 1, logs: [], bosses: [], planets: [], });
    const [turnProcessing, setTurnProcessing] = useState(false);
    // Sync player state with game
    useEffect(() => {
      setGame((g) => ({ ...g, players: [player] }));
    }, [player]);

    // Handle turn processing
    const handleProcessTurn = () => {
      setTurnProcessing(true);
      setTimeout(() => {
        const newGame = processTurnArray({ ...game, players: [player] });
        setGame(newGame);
        setPlayer(newGame.players[0]);
        setTurnProcessing(false);
      }, 500);
    };
  const normalizeSubmenu = (
    submenu?: string,
  ): "overview" | "quadrants" | "sectors" | "systems" | "routes" => {
    if (!submenu) return "overview";
    if (["alpha", "beta", "gamma", "delta"].includes(submenu)) {
      return "quadrants";
    }
    return "overview";
  };
  const [activeTab, setActiveTab] = useState<
    "overview" | "quadrants" | "sectors" | "systems" | "routes" | "game"
  >(normalizeSubmenu(activeSubmenu));
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>("alpha");
  const [selectedSector, setSelectedSector] = useState<string>("001");
  const [selectedSystem, setSelectedSystem] = useState<StarSystem | null>(null);
  const [mapMode, setMapMode] = useState<
    "political" | "exploration" | "trade" | "tactical"
  >("political");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Galactic Quadrants
  const quadrants: GalacticQuadrant[] = [
    {
      id: "alpha",
      name: "Alpha Quadrant",
      sectors: 360,
      explored: 78,
      controlled_territories: [
        {
          name: "United Federation of Planets",
          color: "#3b82f6",
          systems: 8000,
          capital: "Earth",
        },
        {
          name: "Klingon Empire",
          color: "#dc2626",
          systems: 4500,
          capital: "Qo'noS",
        },
        {
          name: "Romulan Star Empire",
          color: "#059669",
          systems: 3200,
          capital: "Romulus",
        },
        {
          name: "Cardassian Union",
          color: "#d97706",
          systems: 1800,
          capital: "Cardassia Prime",
        },
      ],
      major_powers: ["Federation", "Klingons", "Romulans", "Cardassians"],
      phenomena: ["Badlands", "Briar Patch", "Azure Nebula", "Mutara Nebula"],
      threat_level: 4,
      coordinates: { x: 0, y: 0 },
    },
    {
      id: "beta",
      name: "Beta Quadrant",
      sectors: 360,
      explored: 65,
      controlled_territories: [
        {
          name: "Klingon Empire",
          color: "#dc2626",
          systems: 6000,
          capital: "Qo'noS",
        },
        {
          name: "Romulan Star Empire",
          color: "#059669",
          systems: 5500,
          capital: "Romulus",
        },
        {
          name: "Gorn Hegemony",
          color: "#7c3aed",
          systems: 800,
          capital: "Gornar",
        },
        {
          name: "Tholian Assembly",
          color: "#f59e0b",
          systems: 600,
          capital: "Tholia",
        },
      ],
      major_powers: ["Klingons", "Romulans", "Gorn", "Tholians"],
      phenomena: ["Great Barrier", "Galactic Core", "Stellar Graveyard"],
      threat_level: 6,
      coordinates: { x: 1, y: 0 },
    },
    {
      id: "gamma",
      name: "Gamma Quadrant",
      sectors: 360,
      explored: 12,
      controlled_territories: [
        {
          name: "Dominion",
          color: "#8b5cf6",
          systems: 10000,
          capital: "Founders' Homeworld",
        },
        {
          name: "Karemma Commerce Ministry",
          color: "#06b6d4",
          systems: 400,
          capital: "Karemma",
        },
        {
          name: "Son'a Command",
          color: "#ef4444",
          systems: 200,
          capital: "Son'a Homeworld",
        },
      ],
      major_powers: ["Dominion", "Karemma", "Son'a"],
      phenomena: [
        "Bajoran Wormhole",
        "Dominion Space",
        "Gamma Quadrant Nebulae",
      ],
      threat_level: 8,
      coordinates: { x: 0, y: 1 },
    },
    {
      id: "delta",
      name: "Delta Quadrant",
      sectors: 360,
      explored: 8,
      controlled_territories: [
        {
          name: "Borg Collective",
          color: "#22c55e",
          systems: 15000,
          capital: "Borg Unicomplex",
        },
        {
          name: "Vidiian Sodality",
          color: "#f97316",
          systems: 1200,
          capital: "Vidiia Prime",
        },
        {
          name: "Kazon Collective",
          color: "#84cc16",
          systems: 800,
          capital: "Kazon Prime",
        },
        {
          name: "Malon Export Authority",
          color: "#a855f7",
          systems: 300,
          capital: "Malon Prime",
        },
      ],
      major_powers: ["Borg", "Vidiians", "Kazon", "Malon"],
      phenomena: [
        "Nekrit Expanse",
        "Void Region",
        "Borg Space",
        "Subspace Corridors",
      ],
      threat_level: 9,
      coordinates: { x: 1, y: 1 },
    },
  ];

  // Sectors with detailed star systems
  const sectors: Sector[] = [
    {
      id: "001",
      name: "Sector 001 (Sol Sector)",
      quadrant: "alpha",
      grid_coordinates: { x: 25, y: 25 },
      controlled_by: "United Federation of Planets",
      strategic_value: 10,
      exploration_status: 100,
      patrol_routes: [
        {
          id: "p001",
          name: "Sol Defense Perimeter",
          waypoints: ["Earth", "Mars", "Jupiter"],
          frequency: "Daily",
          assigned_vessels: ["USS Enterprise", "USS Voyager"],
        },
      ],
      trade_routes: [
        {
          id: "t001",
          name: "Earth-Vulcan Express",
          origin: "Earth",
          destination: "Vulcan",
          cargo_types: ["Technology", "Cultural Exchange"],
          frequency: "Daily",
          security_level: "High",
        },
      ],
      systems: [
        {
          id: "sol",
          name: "Sol System",
          coordinates: { x: 0, y: 0, z: 0 },
          star_type: "G-type Main Sequence",
          star_class: "G2V",
          moons: 146,
          asteroids: true,
          nebulae: false,
          phenomena: ["Heliosphere", "Kuiper Belt", "Oort Cloud"],
          threat_level: "safe",
          government: "United Federation of Planets",
          species: ["Human", "Various"],
          trade_value: 10,
          strategic_importance: 10,
          last_surveyed: "2024.069",
          planets: [
            {
              id: "earth",
              name: "Earth",
              class: "M",
              type: "terrestrial",
              population: 9800000000,
              government: "United Earth",
              species: ["Human"],
              resources: ["Water", "Biomatter", "Rare Earth Elements"],
              facilities: [
                "Starfleet Headquarters",
                "Starfleet Academy",
                "Earth Spacedock",
              ],
              moons: 1,
            },
            {
              id: "mars",
              name: "Mars",
              class: "L",
              type: "terrestrial",
              population: 250000000,
              government: "Mars Colonial Government",
              species: ["Human"],
              resources: ["Iron Ore", "Water Ice", "Minerals"],
              facilities: [
                "Utopia Planitia Fleet Yards",
                "Mars Defense Perimeter",
              ],
              moons: 2,
            },
          ],
          space_stations: [
            {
              id: "earth_spacedock",
              name: "Earth Spacedock",
              type: "starbase",
              operator: "Starfleet",
              population: 50000,
              facilities: [
                "Ship Construction",
                "Repairs",
                "Crew Quarters",
                "Command Center",
              ],
              defense_rating: 9,
            },
          ],
        },
        {
          id: "alpha_centauri",
          name: "Alpha Centauri System",
          coordinates: { x: 4.37, y: 0, z: 0 },
          star_type: "G-type + K-type Binary",
          star_class: "G2V + K1V",
          moons: 8,
          asteroids: false,
          nebulae: false,
          phenomena: ["Binary Star System", "Proxima Centauri"],
          threat_level: "safe",
          government: "United Federation of Planets",
          species: ["Human", "Alpha Centaurian"],
          trade_value: 7,
          strategic_importance: 8,
          last_surveyed: "2024.065",
          planets: [
            {
              id: "proxima_b",
              name: "Proxima Centauri b",
              class: "M",
              type: "terrestrial",
              population: 50000000,
              government: "Alpha Centauri Colonial Authority",
              species: ["Human", "Alpha Centaurian"],
              resources: ["Dilithium", "Duranium", "Agricultural Products"],
              facilities: ["Colonial Administration", "Research Facilities"],
              moons: 0,
            },
          ],
          space_stations: [
            {
              id: "centauri_station",
              name: "Centauri Station",
              type: "outpost",
              operator: "Starfleet",
              population: 5000,
              facilities: ["Communications Array", "Sensor Network"],
              defense_rating: 5,
            },
          ],
        },
      ],
    },
    {
      id: "030",
      name: "Sector 030 (Vulcan Sector)",
      quadrant: "alpha",
      grid_coordinates: { x: 30, y: 22 },
      controlled_by: "United Federation of Planets",
      strategic_value: 9,
      exploration_status: 95,
      patrol_routes: [
        {
          id: "p030",
          name: "Vulcan Border Patrol",
          waypoints: ["Vulcan", "P'Jem", "Andoria"],
          frequency: "Weekly",
          assigned_vessels: ["USS T'Pol", "USS Sarek"],
        },
      ],
      trade_routes: [
        {
          id: "t030",
          name: "Vulcan-Andoria Trade Corridor",
          origin: "Vulcan",
          destination: "Andoria",
          cargo_types: ["Technology", "Minerals"],
          frequency: "Weekly",
          security_level: "Medium",
        },
      ],
      systems: [
        {
          id: "vulcan_system",
          name: "40 Eridani (Vulcan System)",
          coordinates: { x: 16.5, y: -2.1, z: 3.4 },
          star_type: "K-type Main Sequence",
          star_class: "K1V",
          moons: 23,
          asteroids: true,
          nebulae: false,
          phenomena: ["Binary Companion Stars", "Vulcan Asteroid Mining"],
          threat_level: "safe",
          government: "Vulcan High Command",
          species: ["Vulcan"],
          trade_value: 9,
          strategic_importance: 9,
          last_surveyed: "2024.068",
          planets: [
            {
              id: "vulcan",
              name: "Vulcan",
              class: "M",
              type: "desert",
              population: 6200000000,
              government: "Vulcan High Command",
              species: ["Vulcan"],
              resources: ["Trilithium", "Duranium", "Vulcan Minerals"],
              facilities: [
                "Vulcan Science Academy",
                "Vulcan High Command",
                "Mount Seleya",
              ],
              moons: 2,
            },
          ],
          space_stations: [
            {
              id: "vulcan_spaceport",
              name: "Vulcan Orbital Complex",
              type: "starbase",
              operator: "Vulcan High Command",
              population: 25000,
              facilities: [
                "Diplomatic Facilities",
                "Scientific Research",
                "Cultural Exchange",
              ],
              defense_rating: 7,
            },
          ],
        },
      ],
    },
  ];

  // Navigation Beacons
  const navBeacons: NavBeacon[] = [
    {
      id: "nb001",
      name: "Sol Navigation Beacon",
      coordinates: { x: 0, y: 0, z: 0 },
      type: "navigation",
      range: 20,
      message: "Welcome to Sol System - United Federation of Planets",
    },
    {
      id: "nb002",
      name: "Wolf 359 Memorial Beacon",
      coordinates: { x: 7.86, y: 2.3, z: -1.1 },
      type: "warning",
      range: 5,
      message: "Site of Battle of Wolf 359 - Memorial Protected Zone",
    },
    {
      id: "nb003",
      name: "Neutral Zone Marker Alpha",
      coordinates: { x: 50, y: 0, z: 0 },
      type: "restricted",
      range: 10,
      message:
        "Romulan Neutral Zone - Crossing Prohibited Without Authorization",
    },
  ];

  const getCurrentQuadrant = () =>
    quadrants.find((q) => q.id === selectedQuadrant);
  const getCurrentSector = () => sectors.find((s) => s.id === selectedSector);

  const renderQuadrantMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars background
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const brightness = Math.random();
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.6})`;
      ctx.fillRect(x, y, 1, 1);
    }

    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
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
    }

    // Draw quadrants
    quadrants.forEach((quadrant, index) => {
      const baseX = quadrant.coordinates.x * 200 + 100;
      const baseY = quadrant.coordinates.y * 150 + 75;

      // Quadrant territory
      ctx.fillStyle =
        mapMode === "political"
          ? "rgba(59, 130, 246, 0.2)"
          : "rgba(34, 197, 94, 0.2)";
      ctx.fillRect(baseX, baseY, 180, 130);

      // Quadrant border
      ctx.strokeStyle =
        selectedQuadrant === quadrant.id ? "#fbbf24" : "#3b82f6";
      ctx.lineWidth = 2;
      ctx.strokeRect(baseX, baseY, 180, 130);

      // Quadrant name
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(quadrant.name, baseX + 90, baseY - 10);

      // Exploration percentage
      ctx.fillStyle = "#bef2ff";
      ctx.font = "10px Arial";
      ctx.fillText(`${quadrant.explored}% Explored`, baseX + 90, baseY + 145);

      // Major powers
      if (mapMode === "political") {
        quadrant.major_powers.forEach((power, powerIndex) => {
          const powerY = baseY + 20 + powerIndex * 15;
          ctx.fillStyle = "#94a3b8";
          ctx.font = "9px Arial";
          ctx.textAlign = "left";
          ctx.fillText(`• ${power}`, baseX + 10, powerY);
        });
      }

      // Sectors representation
      for (let sx = 0; sx < 6; sx++) {
        for (let sy = 0; sy < 4; sy++) {
          const sectorX = baseX + 15 + sx * 25;
          const sectorY = baseY + 50 + sy * 20;

          ctx.fillStyle =
            mapMode === "exploration"
              ? `rgba(34, 197, 94, ${Math.random() * 0.8})`
              : `rgba(59, 130, 246, ${Math.random() * 0.6})`;
          ctx.fillRect(sectorX, sectorY, 3, 3);
        }
      }
    });

    // Draw selected system if any
    if (selectedSystem) {
      const quadrant = getCurrentQuadrant();
      if (quadrant) {
        const baseX = quadrant.coordinates.x * 200 + 100;
        const baseY = quadrant.coordinates.y * 150 + 75;

        // System indicator
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(baseX + 90, baseY + 65, 20, 0, 2 * Math.PI);
        ctx.stroke();

        // System name
        ctx.fillStyle = "#f59e0b";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(selectedSystem.name, baseX + 90, baseY + 100);
      }
    }
  };

  const renderSectorMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sector = getCurrentSector();
    if (!sector) return;

    // Clear canvas
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars background
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const brightness = Math.random();
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.7})`;
      ctx.fillRect(x, y, 1, 1);
    }

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 40; i++) {
        const x = (i / 40) * canvas.width;
        const y = (i / 40) * canvas.height;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // Draw trade routes
    if (showRoutes && sector.trade_routes.length > 0) {
      ctx.strokeStyle = "rgba(34, 197, 94, 0.6)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      sector.systems.forEach((system, index) => {
        if (index > 0) {
          const prevSystem = sector.systems[index - 1];
          const x1 = 100 + (index - 1) * 150;
          const y1 = 150;
          const x2 = 100 + index * 150;
          const y2 = 150;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      });
      ctx.setLineDash([]);
    }

    // Draw systems
    sector.systems.forEach((system, index) => {
      const x = 100 + index * 150;
      const y = 150;

      // System glow based on type
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
      const glowColor =
        system.threat_level === "dangerous"
          ? "rgba(239, 68, 68, 0.8)"
          : system.threat_level === "caution"
            ? "rgba(245, 158, 11, 0.8)"
            : "rgba(59, 130, 246, 0.8)";
      gradient.addColorStop(0, glowColor);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(x - 30, y - 30, 60, 60);

      // System star
      ctx.fillStyle = system.star_type.includes("G-type")
        ? "#fbbf24"
        : system.star_type.includes("K-type")
          ? "#f97316"
          : system.star_type.includes("M-type")
            ? "#dc2626"
            : "#3b82f6";
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();

      // Planets orbit indicators
      system.planets.forEach((planet, planetIndex) => {
        const orbitRadius = 15 + planetIndex * 8;
        ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, orbitRadius, 0, 2 * Math.PI);
        ctx.stroke();

        // Planet
        const planetAngle = planetIndex * 60 * (Math.PI / 180);
        const planetX = x + Math.cos(planetAngle) * orbitRadius;
        const planetY = y + Math.sin(planetAngle) * orbitRadius;

        ctx.fillStyle =
          planet.class === "M"
            ? "#22c55e"
            : planet.class === "L"
              ? "#f97316"
              : planet.class === "J"
                ? "#8b5cf6"
                : "#64748b";
        ctx.beginPath();
        ctx.arc(planetX, planetY, 2, 0, 2 * Math.PI);
        ctx.fill();
      });

      // Space stations
      system.space_stations.forEach((station, stationIndex) => {
        const stationAngle = (stationIndex * 90 + 45) * (Math.PI / 180);
        const stationX = x + Math.cos(stationAngle) * 35;
        const stationY = y + Math.sin(stationAngle) * 35;

        ctx.fillStyle = "#06b6d4";
        ctx.fillRect(stationX - 2, stationY - 2, 4, 4);
      });

      // System name
      ctx.fillStyle = "#bef2ff";
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(system.name, x, y + 50);

      // System details
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px Arial";
      ctx.fillText(
        `${system.planets.length}P ${system.space_stations.length}S`,
        x,
        y + 65,
      );

      // Selection indicator
      if (selectedSystem?.id === system.id) {
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });

    // Draw navigation beacons
    navBeacons.forEach((beacon) => {
      const beaconX = 200 + beacon.coordinates.x * 10;
      const beaconY = 200 + beacon.coordinates.y * 10;

      ctx.fillStyle =
        beacon.type === "warning"
          ? "#f59e0b"
          : beacon.type === "restricted"
            ? "#dc2626"
            : "#06b6d4";
      ctx.beginPath();
      ctx.arc(beaconX, beaconY, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Beacon range indicator
      ctx.strokeStyle = ctx.fillStyle + "40";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(beaconX, beaconY, beacon.range, 0, 2 * Math.PI);
      ctx.stroke();
    });
  };

  useEffect(() => {
    if (activeTab === "quadrants") {
      renderQuadrantMap();
    } else if (activeTab === "sectors") {
      renderSectorMap();
    }
  }, [
    activeTab,
    selectedQuadrant,
    selectedSector,
    selectedSystem,
    mapMode,
    showGrid,
    showRoutes,
    zoomLevel,
  ]);

  useEffect(() => {
    if (!activeSubmenu) {
      setActiveTab("overview");
      return;
    }

    if (["alpha", "beta", "gamma", "delta"].includes(activeSubmenu)) {
      setSelectedQuadrant(activeSubmenu);
      setActiveTab("quadrants");
      return;
    }

    setActiveTab(normalizeSubmenu(activeSubmenu));
  }, [activeSubmenu]);

  const filteredSystems =
    getCurrentSector()?.systems.filter(
      (system) =>
        system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        system.government.toLowerCase().includes(searchTerm.toLowerCase()) ||
        system.species.some((species) =>
          species.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          UNIVERSE MAPPING SYSTEM
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant={mapMode === "political" ? "default" : "outline"}
              size="sm"
              className={
                mapMode === "political"
                  ? "bg-trek-blue text-trek-dark"
                  : "border-trek-blue text-trek-blue"
              }
              onClick={() => setMapMode("political")}
            >
              <Globe className="w-4 h-4 mr-2" />
              Political
            </Button>
            <Button
              variant={mapMode === "exploration" ? "default" : "outline"}
              size="sm"
              className={
                mapMode === "exploration"
                  ? "bg-trek-blue text-trek-dark"
                  : "border-trek-blue text-trek-blue"
              }
              onClick={() => setMapMode("exploration")}
            >
              <Eye className="w-4 h-4 mr-2" />
              Exploration
            </Button>
            <Button
              variant={mapMode === "trade" ? "default" : "outline"}
              size="sm"
              className={
                mapMode === "trade"
                  ? "bg-trek-blue text-trek-dark"
                  : "border-trek-blue text-trek-blue"
              }
              onClick={() => setMapMode("trade")}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Trade
            </Button>
            <Button
              variant={mapMode === "tactical" ? "default" : "outline"}
              size="sm"
              className={
                mapMode === "tactical"
                  ? "bg-trek-blue text-trek-dark"
                  : "border-trek-blue text-trek-blue"
              }
              onClick={() => setMapMode("tactical")}
            >
              <Shield className="w-4 h-4 mr-2" />
              Tactical
            </Button>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value: any) => setActiveTab(value)}
      >
        <TabsList className="grid grid-cols-6 w-full bg-trek-panel border border-trek-accent">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-trek-dark"
          >
            <Map className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="quadrants"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-trek-dark"
          >
            <Grid className="w-4 h-4 mr-2" />
            Quadrants
          </TabsTrigger>
          <TabsTrigger
            value="sectors"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-trek-dark"
          >
            <Compass className="w-4 h-4 mr-2" />
            Sectors
          </TabsTrigger>
          <TabsTrigger
            value="systems"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-trek-dark"
          >
            <Star className="w-4 h-4 mr-2" />
            Systems
          </TabsTrigger>
          <TabsTrigger
            value="routes"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-trek-dark"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Routes
          </TabsTrigger>

          <TabsTrigger
            value="game"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-trek-dark"
          >
            <Zap className="w-4 h-4 mr-2" />
            Game
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Universe Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader className="pb-3">
                <CardTitle className="text-trek-gold text-sm">
                  Known Systems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-trek-blue mb-2">
                  47,291
                </div>
                <div className="text-xs text-trek-text/60">
                  across all quadrants
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader className="pb-3">
                <CardTitle className="text-trek-gold text-sm">
                  Explored Territory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-trek-blue mb-2">
                  41%
                </div>
                <Progress value={41} className="h-2 mb-2" />
                <div className="text-xs text-trek-text/60">of known galaxy</div>
              </CardContent>
            </Card>

            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader className="pb-3">
                <CardTitle className="text-trek-gold text-sm">
                  Active Routes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-trek-blue mb-2">
                  1,847
                </div>
                <div className="text-xs text-trek-text/60">
                  trade & patrol routes
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader className="pb-3">
                <CardTitle className="text-trek-gold text-sm">
                  Navigation Beacons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-trek-blue mb-2">
                  2,341
                </div>
                <div className="text-xs text-trek-text/60">active beacons</div>
              </CardContent>
            </Card>
          </div>

          {/* Quadrant Overview */}
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-gold flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Galactic Quadrants Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quadrants.map((quadrant) => (
                  <Card
                    key={quadrant.id}
                    className="bg-trek-bg/50 border-trek-accent/30"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-trek-gold">
                            {quadrant.name}
                          </h4>
                          <Badge
                            className={`text-xs ${
                              quadrant.threat_level <= 3
                                ? "text-green-400 border-green-400"
                                : quadrant.threat_level <= 6
                                  ? "text-yellow-400 border-yellow-400"
                                  : "text-red-400 border-red-400"
                            }`}
                          >
                            Threat {quadrant.threat_level}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-trek-text/70">Sectors:</span>
                            <span className="text-trek-blue">
                              {quadrant.sectors}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-trek-text/70">Explored:</span>
                            <span className="text-trek-blue">
                              {quadrant.explored}%
                            </span>
                          </div>
                          <Progress value={quadrant.explored} className="h-2" />
                        </div>

                        <div>
                          <div className="text-xs text-trek-text/70 mb-1">
                            Major Powers
                          </div>
                          <div className="space-y-1">
                            {quadrant.major_powers
                              .slice(0, 3)
                              .map((power, i) => (
                                <div key={i} className="text-xs text-trek-text">
                                  • {power}
                                </div>
                              ))}
                          </div>
                        </div>

                        <Button
                          size="sm"
                          className="w-full bg-trek-accent hover:bg-trek-accent/80 text-trek-dark"
                          onClick={() => {
                            setSelectedQuadrant(quadrant.id);
                            setActiveTab("quadrants");
                          }}
                        >
                          <Map className="w-3 h-3 mr-2" />
                          View Quadrant
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quadrants" className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <Select
              value={selectedQuadrant}
              onValueChange={setSelectedQuadrant}
            >
              <SelectTrigger className="w-[200px] bg-trek-bg border-trek-accent">
                <SelectValue placeholder="Select Quadrant" />
              </SelectTrigger>
              <SelectContent className="bg-trek-panel border-trek-accent">
                {quadrants.map((quadrant) => (
                  <SelectItem key={quadrant.id} value={quadrant.id}>
                    {quadrant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={showGrid ? "default" : "outline"}
                size="sm"
                className={
                  showGrid
                    ? "bg-trek-accent text-trek-dark"
                    : "border-trek-accent text-trek-text"
                }
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid className="w-4 h-4 mr-2" />
                Grid
              </Button>

              <Button
                variant={showRoutes ? "default" : "outline"}
                size="sm"
                className={
                  showRoutes
                    ? "bg-trek-accent text-trek-dark"
                    : "border-trek-accent text-trek-text"
                }
                onClick={() => setShowRoutes(!showRoutes)}
              >
                <Navigation className="w-4 h-4 mr-2" />
                Routes
              </Button>
            </div>

            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                className="border-trek-accent text-trek-text"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-trek-accent text-trek-text"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Canvas */}
            <div className="lg:col-span-2">
              <Card className="bg-trek-panel border-trek-accent">
                <CardHeader>
                  <CardTitle className="text-trek-gold flex items-center gap-2">
                    <Map className="w-5 h-5" />
                    {getCurrentQuadrant()?.name} Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={400}
                      className="border border-trek-accent rounded cursor-crosshair w-full"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        console.log(`Clicked at: ${x}, ${y}`);
                      }}
                    />
                    <div className="absolute top-2 left-2 text-xs text-trek-text/70 bg-trek-dark/80 p-2 rounded">
                      <div>Mode: {mapMode.toUpperCase()}</div>
                      <div>Zoom: {zoomLevel}x</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quadrant Info */}
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold">
                  Quadrant Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getCurrentQuadrant() && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-trek-gold mb-2">
                        Territorial Control
                      </h4>
                      <div className="space-y-2">
                        {getCurrentQuadrant()!.controlled_territories.map(
                          (territory, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-trek-bg/50 rounded"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded`}
                                  style={{ backgroundColor: territory.color }}
                                />
                                <span className="text-sm text-trek-text">
                                  {territory.name}
                                </span>
                              </div>
                              <span className="text-xs text-trek-blue">
                                {territory.systems.toLocaleString()} systems
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-trek-gold mb-2">
                        Notable Phenomena
                      </h4>
                      <div className="space-y-1">
                        {getCurrentQuadrant()!.phenomena.map(
                          (phenomenon, index) => (
                            <div
                              key={index}
                              className="text-sm text-trek-text/80"
                            >
                              • {phenomenon}
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-trek-gold mb-2">
                        Exploration Status
                      </h4>
                      <Progress
                        value={getCurrentQuadrant()!.explored}
                        className="h-3 mb-2"
                      />
                      <div className="text-sm text-trek-blue">
                        {getCurrentQuadrant()!.explored}% Explored
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-[200px] bg-trek-bg border-trek-accent">
                <SelectValue placeholder="Select Sector" />
              </SelectTrigger>
              <SelectContent className="bg-trek-panel border-trek-accent">
                {sectors.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button className="bg-trek-accent hover:bg-trek-accent/80 text-trek-dark">
              <Radar className="w-4 h-4 mr-2" />
              Long Range Scan
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sector Map */}
            <div className="lg:col-span-2">
              <Card className="bg-trek-panel border-trek-accent">
                <CardHeader>
                  <CardTitle className="text-trek-gold flex items-center gap-2">
                    <Compass className="w-5 h-5" />
                    {getCurrentSector()?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className="border border-trek-accent rounded cursor-crosshair w-full"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;

                      // Simple system selection based on click position
                      const sector = getCurrentSector();
                      if (sector) {
                        const systemIndex = Math.floor(x / 150);
                        const system = sector.systems[systemIndex];
                        if (system) {
                          setSelectedSystem(system);
                        }
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sector Details */}
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold">Sector Details</CardTitle>
              </CardHeader>
              <CardContent>
                {getCurrentSector() && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-trek-text/70">Systems</div>
                        <div className="text-trek-blue font-semibold">
                          {getCurrentSector()!.systems.length}
                        </div>
                      </div>
                      <div>
                        <div className="text-trek-text/70">Strategic Value</div>
                        <div className="text-trek-blue font-semibold">
                          {getCurrentSector()!.strategic_value}/10
                        </div>
                      </div>
                      <div>
                        <div className="text-trek-text/70">Exploration</div>
                        <div className="text-trek-blue font-semibold">
                          {getCurrentSector()!.exploration_status}%
                        </div>
                      </div>
                      <div>
                        <div className="text-trek-text/70">Controlled By</div>
                        <div className="text-trek-gold text-xs">
                          {getCurrentSector()!.controlled_by}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-trek-gold mb-2">
                        Patrol Routes
                      </h4>
                      <div className="space-y-2">
                        {getCurrentSector()!.patrol_routes.map(
                          (route, index) => (
                            <div
                              key={index}
                              className="text-sm p-2 bg-trek-bg/50 rounded"
                            >
                              <div className="font-medium text-trek-text">
                                {route.name}
                              </div>
                              <div className="text-xs text-trek-text/70">
                                {route.frequency}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-trek-gold mb-2">
                        Trade Routes
                      </h4>
                      <div className="space-y-2">
                        {getCurrentSector()!.trade_routes.map(
                          (route, index) => (
                            <div
                              key={index}
                              className="text-sm p-2 bg-trek-bg/50 rounded"
                            >
                              <div className="font-medium text-trek-text">
                                {route.name}
                              </div>
                              <div className="text-xs text-trek-text/70">
                                {route.origin} → {route.destination}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="systems" className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <Input
              placeholder="Search star systems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md bg-trek-bg border-trek-accent text-trek-text"
            />
            <Button className="bg-trek-accent hover:bg-trek-accent/80 text-trek-dark">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="space-y-4">
            {filteredSystems.map((system) => (
              <Card
                key={system.id}
                className="bg-trek-panel border-trek-accent"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-trek-gold">
                          {system.name}
                        </h3>
                        <Badge
                          className={`text-xs ${
                            system.threat_level === "safe"
                              ? "text-green-400 border-green-400"
                              : system.threat_level === "caution"
                                ? "text-yellow-400 border-yellow-400"
                                : system.threat_level === "dangerous"
                                  ? "text-red-400 border-red-400"
                                  : "text-purple-400 border-purple-400"
                          }`}
                        >
                          {system.threat_level.toUpperCase()}
                        </Badge>
                        <Badge className="text-xs border-trek-blue text-trek-blue">
                          {system.star_type}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-trek-text/70">
                            Planets
                          </div>
                          <div className="text-trek-blue font-semibold">
                            {system.planets.length}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-trek-text/70">
                            Stations
                          </div>
                          <div className="text-trek-blue font-semibold">
                            {system.space_stations.length}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-trek-text/70">
                            Government
                          </div>
                          <div className="text-trek-gold text-xs">
                            {system.government}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-trek-text/70">
                            Last Survey
                          </div>
                          <div className="text-trek-blue text-xs">
                            {system.last_surveyed}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-semibold text-trek-gold mb-2">
                            Dominant Species
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {system.species.map((species, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs border-trek-accent text-trek-text"
                              >
                                {species}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {system.phenomena.length > 0 && (
                          <div>
                            <div className="text-sm font-semibold text-trek-gold mb-2">
                              Phenomena
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {system.phenomena.map((phenomenon, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs border-trek-warning text-trek-warning"
                                >
                                  {phenomenon}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <div className="text-sm font-semibold text-trek-gold mb-2">
                            Major Planets
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {system.planets.slice(0, 4).map((planet, index) => (
                              <div
                                key={index}
                                className="p-2 bg-trek-bg/50 rounded border border-trek-accent/30"
                              >
                                <div className="font-medium text-trek-text text-sm">
                                  {planet.name}
                                </div>
                                <div className="text-xs text-trek-text/70">
                                  Class {planet.class} •{" "}
                                  {planet.population.toLocaleString()}{" "}
                                  inhabitants
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-trek-accent/30">
                    <Button
                      size="sm"
                      className="bg-trek-accent hover:bg-trek-accent/80 text-trek-dark"
                      onClick={() => setSelectedSystem(system)}
                    >
                      <Eye className="w-3 h-3 mr-2" />
                      Detailed View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-trek-accent text-trek-text"
                      onClick={() => setPlayer((p) => ({
                        ...p,
                        turnActions: [...p.turnActions, { type: "move", fleet: p.fleets, from: "current", to: system.id }],
                        log: [...p.log, `Set course to ${system.name}`],
                      }))}
                      disabled={turnProcessing}
                    >
                      <Navigation className="w-3 h-3 mr-2" />
                      Set Course
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-trek-blue text-trek-blue"
                      onClick={() => setPlayer((p) => ({
                        ...p,
                        turnActions: [...p.turnActions, { type: "gather", planet: system.planets[0]?.id || system.id }],
                        log: [...p.log, `Queued exploration of ${system.name}`],
                      }))}
                      disabled={turnProcessing}
                    >
                      <Radar className="w-3 h-3 mr-2" />
                      Deep Scan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="routes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trade Routes */}
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold flex items-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Trade Routes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sectors
                    .flatMap((sector) => sector.trade_routes)
                    .map((route, index) => (
                      <div
                        key={index}
                        className="p-3 bg-trek-bg/50 rounded border border-trek-accent/30"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-trek-gold text-sm">
                            {route.name}
                          </h4>
                          <Badge
                            className={`text-xs ${
                              route.security_level === "High"
                                ? "text-green-400 border-green-400"
                                : route.security_level === "Medium"
                                  ? "text-yellow-400 border-yellow-400"
                                  : "text-red-400 border-red-400"
                            }`}
                          >
                            {route.security_level}
                          </Badge>
                        </div>
                        <div className="text-sm text-trek-text/80 mb-2">
                          {route.origin} → {route.destination}
                        </div>
                        <div className="text-xs text-trek-text/70">
                          Cargo: {route.cargo_types.join(", ")} •{" "}
                          {route.frequency}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Patrol Routes */}
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Patrol Routes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sectors
                    .flatMap((sector) => sector.patrol_routes)
                    .map((route, index) => (
                      <div
                        key={index}
                        className="p-3 bg-trek-bg/50 rounded border border-trek-accent/30"
                      >
                        <h4 className="font-semibold text-trek-gold text-sm mb-2">
                          {route.name}
                        </h4>
                        <div className="text-sm text-trek-text/80 mb-2">
                          Waypoints: {route.waypoints.join(" → ")}
                        </div>
                        <div className="text-xs text-trek-text/70 mb-2">
                          Frequency: {route.frequency}
                        </div>
                        <div className="text-xs text-trek-blue">
                          Assigned: {route.assigned_vessels.join(", ")}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Beacons */}
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-gold flex items-center gap-2">
                <Radio className="w-5 h-5" />
                Navigation Beacons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {navBeacons.map((beacon) => (
                  <div
                    key={beacon.id}
                    className="p-4 bg-trek-bg/50 rounded border border-trek-accent/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-trek-gold text-sm">
                        {beacon.name}
                      </h4>
                      <Badge
                        className={`text-xs ${
                          beacon.type === "navigation"
                            ? "text-blue-400 border-blue-400"
                            : beacon.type === "warning"
                              ? "text-yellow-400 border-yellow-400"
                              : beacon.type === "emergency"
                                ? "text-red-400 border-red-400"
                                : "text-purple-400 border-purple-400"
                        }`}
                      >
                        {beacon.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs text-trek-text/70 mb-2">
                      Range: {beacon.range} LY
                    </div>
                    <div className="text-xs text-trek-text/80">
                      {beacon.message}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* MMORPG/OGame Game Tab */}
        <TabsContent value="game" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Player Resources */}
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Player Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(player.resources).map(([res, amt]) => (
                    <div key={res} className="flex flex-col items-center">
                      <span className="text-trek-blue font-bold text-lg">{String(amt)}</span>
                      <span className="text-xs text-trek-text/70 capitalize">{res}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Player Buildings */}
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Buildings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {BUILDINGS.map((b) => (
                    <div key={b.id} className="flex items-center justify-between">
                      <span>{b.name}</span>
                      <span className="text-trek-blue font-bold">
                        Lv. {player.buildings[b.id] || 1}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => setPlayer((p) => ({
                          ...p,
                          turnActions: [...p.turnActions, { type: "build", buildingId: b.id }],
                        }))}
                        disabled={turnProcessing}
                        className="bg-trek-accent text-trek-dark"
                      >
                        Build/Upgrade
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Player Fleet */}
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Fleet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {FLEET_UNITS.map((u) => (
                    <div key={u.id} className="flex items-center justify-between">
                      <span>{u.name}</span>
                      <span className="text-trek-blue font-bold">
                        {player.fleets[u.id] || 0}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => setPlayer((p) => ({
                          ...p,
                          turnActions: [...p.turnActions, { type: "train", unitId: u.id, amount: 1 }],
                        }))}
                        disabled={turnProcessing}
                        className="bg-trek-accent text-trek-dark"
                      >
                        Build
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Turn Button and Log */}
          <div className="flex items-center gap-4 mt-6">
            <Button
              size="lg"
              className="bg-trek-gold text-trek-dark font-bold px-8"
              onClick={handleProcessTurn}
              disabled={turnProcessing}
            >
              {turnProcessing ? "Processing..." : `End Turn (Turn ${game.turn})`}
            </Button>
            <span className="text-trek-text/70">Actions queued: {player.turnActions.length}</span>
          </div>
          <div className="mt-4">
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold">Turn Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-trek-text/80 space-y-1 max-h-40 overflow-y-auto">
                  {player.log.slice(-10).map((entry, i) => (
                    <div key={i}>• {entry}</div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
