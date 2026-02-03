import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from "../ui/alert";
import { Input } from "../ui/input";
import {
  Radar,
  Eye,
  Zap,
  Radio,
  Target,
  Satellite,
  Search,
  AlertTriangle,
  Star,
  Globe,
  Rocket,
  Shield,
  MapPin,
  Waves,
  Activity,
  Scan,
  Settings,
  Filter,
  Focus,
  Volume2,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Crosshair,
  Microscope,
} from "lucide-react";

interface SensorsProps {
  activeSubmenu?: string;
}

interface SensorContact {
  id: string;
  name: string;
  type: "ship" | "station" | "planet" | "anomaly" | "debris" | "unknown";
  classification: "friendly" | "neutral" | "hostile" | "unknown";
  distance: number;
  bearing: number;
  size: "small" | "medium" | "large" | "massive";
  composition: string[];
  energy_signature: number;
  last_detected: string;
  threat_level: number;
  shield_status?: number;
  weapon_status?: boolean;
  course?: number;
  speed?: number;
  sensor_ghost: boolean;
}

interface SensorSuite {
  id: string;
  name: string;
  type:
    | "long_range"
    | "short_range"
    | "tactical"
    | "scientific"
    | "passive"
    | "active";
  range: number;
  resolution: number;
  power_usage: number;
  status: "online" | "offline" | "degraded" | "calibrating";
  efficiency: number;
  last_calibration: string;
  scan_modes: string[];
}

interface ScanResult {
  id: string;
  target_id: string;
  scan_type: string;
  completion: number;
  results: {
    composition?: string[];
    energy_readings?: number[];
    life_signs?: number;
    technology_level?: number;
    structural_integrity?: number;
    temporal_variance?: number;
  };
  anomalies_detected: string[];
  time_remaining: number;
}

interface AnomalyReading {
  id: string;
  name: string;
  type:
    | "temporal"
    | "spatial"
    | "subspace"
    | "gravitational"
    | "energy"
    | "quantum";
  intensity: number;
  coordinates: { x: number; y: number; z: number };
  first_detected: string;
  stability: number;
  danger_level: number;
  investigation_status: "pending" | "in_progress" | "completed" | "abandoned";
}

export function Sensors({ activeSubmenu }: SensorsProps) {
  const normalizeSubmenu = (
    submenu?: string,
  ): "overview" | "contacts" | "scans" | "anomalies" | "calibration" => {
    const map: Record<
      string,
      "overview" | "contacts" | "scans" | "anomalies" | "calibration"
    > = {
      long_range: "scans",
      short_range: "contacts",
      internal: "overview",
      specialized: "anomalies",
    };
    return map[submenu || ""] || "overview";
  };

  const [activeTab, setActiveTab] = useState<
    "overview" | "contacts" | "scans" | "anomalies" | "calibration"
  >(normalizeSubmenu(activeSubmenu));
  const [sensorMode, setSensorMode] = useState<
    "passive" | "active" | "deep_scan"
  >("passive");
  const [scanRange, setScanRange] = useState(10); // light years
  const [selectedContact, setSelectedContact] = useState<SensorContact | null>(
    null,
  );
  const [activeScan, setActiveScan] = useState<ScanResult | null>(null);
  const [sensorPower, setSensorPower] = useState(85);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    setActiveTab(normalizeSubmenu(activeSubmenu));
  }, [activeSubmenu]);

  const [sensorSuites, setSensorSuites] = useState<SensorSuite[]>([
    {
      id: "long_range",
      name: "Long Range Sensors",
      type: "long_range",
      range: 20,
      resolution: 75,
      power_usage: 15,
      status: "online",
      efficiency: 94,
      last_calibration: "2024.067",
      scan_modes: ["Passive Scan", "Active Scan", "Deep Space Survey"],
    },
    {
      id: "short_range",
      name: "Short Range Sensors",
      type: "short_range",
      range: 5,
      resolution: 95,
      power_usage: 8,
      status: "online",
      efficiency: 98,
      last_calibration: "2024.068",
      scan_modes: ["Tactical Scan", "Bio Scan", "Geological Survey"],
    },
    {
      id: "tactical",
      name: "Tactical Sensors",
      type: "tactical",
      range: 15,
      resolution: 85,
      power_usage: 12,
      status: "online",
      efficiency: 91,
      last_calibration: "2024.066",
      scan_modes: ["Threat Assessment", "Weapons Scan", "Shield Analysis"],
    },
    {
      id: "scientific",
      name: "Scientific Sensors",
      type: "scientific",
      range: 25,
      resolution: 90,
      power_usage: 20,
      status: "degraded",
      efficiency: 78,
      last_calibration: "2024.052",
      scan_modes: ["Spectral Analysis", "Quantum Scan", "Temporal Scan"],
    },
    {
      id: "subspace",
      name: "Subspace Sensors",
      type: "passive",
      range: 50,
      resolution: 60,
      power_usage: 5,
      status: "online",
      efficiency: 96,
      last_calibration: "2024.069",
      scan_modes: [
        "Subspace Monitoring",
        "Communication Intercept",
        "Distress Signal Detection",
      ],
    },
  ]);

  const [contacts, setContacts] = useState<SensorContact[]>([
    {
      id: "contact_001",
      name: "USS Enterprise NCC-1701-D",
      type: "ship",
      classification: "friendly",
      distance: 2.3,
      bearing: 127,
      size: "large",
      composition: ["Duranium", "Tritanium", "Transparent Aluminum"],
      energy_signature: 95,
      last_detected: "2024.069.14:32",
      threat_level: 0,
      shield_status: 100,
      weapon_status: false,
      course: 180,
      speed: 6.5,
      sensor_ghost: false,
    },
    {
      id: "contact_002",
      name: "Unknown Vessel",
      type: "ship",
      classification: "unknown",
      distance: 8.7,
      bearing: 45,
      size: "medium",
      composition: ["Unknown Alloys", "Energy Matrix"],
      energy_signature: 78,
      last_detected: "2024.069.14:28",
      threat_level: 6,
      shield_status: 85,
      weapon_status: true,
      course: 270,
      speed: 4.2,
      sensor_ghost: false,
    },
    {
      id: "contact_003",
      name: "Spatial Anomaly Sigma-7",
      type: "anomaly",
      classification: "unknown",
      distance: 12.4,
      bearing: 315,
      size: "massive",
      composition: ["Exotic Matter", "Temporal Particles"],
      energy_signature: 156,
      last_detected: "2024.069.14:30",
      threat_level: 8,
      sensor_ghost: false,
    },
    {
      id: "contact_004",
      name: "Risa Prime",
      type: "planet",
      classification: "friendly",
      distance: 15.2,
      bearing: 90,
      size: "large",
      composition: ["Silicates", "Water", "Organic Compounds"],
      energy_signature: 23,
      last_detected: "2024.069.14:25",
      threat_level: 0,
      sensor_ghost: false,
    },
    {
      id: "contact_005",
      name: "Starbase 234",
      type: "station",
      classification: "friendly",
      distance: 6.8,
      bearing: 220,
      size: "massive",
      composition: ["Duranium", "Tritanium", "Shield Generators"],
      energy_signature: 187,
      last_detected: "2024.069.14:35",
      threat_level: 0,
      shield_status: 100,
      weapon_status: false,
      sensor_ghost: false,
    },
    {
      id: "contact_006",
      name: "Sensor Ghost Delta",
      type: "unknown",
      classification: "unknown",
      distance: 4.1,
      bearing: 2,
      size: "small",
      composition: ["Intermittent Readings"],
      energy_signature: 12,
      last_detected: "2024.069.14:31",
      threat_level: 3,
      sensor_ghost: true,
    },
  ]);

  const [anomalies, setAnomalies] = useState<AnomalyReading[]>([
    {
      id: "anomaly_001",
      name: "Temporal Distortion Field",
      type: "temporal",
      intensity: 85,
      coordinates: { x: 12.4, y: -3.7, z: 8.2 },
      first_detected: "2024.069.12:15",
      stability: 60,
      danger_level: 7,
      investigation_status: "in_progress",
    },
    {
      id: "anomaly_002",
      name: "Subspace Rift",
      type: "subspace",
      intensity: 92,
      coordinates: { x: -8.1, y: 15.3, z: -2.4 },
      first_detected: "2024.069.08:42",
      stability: 45,
      danger_level: 9,
      investigation_status: "pending",
    },
    {
      id: "anomaly_003",
      name: "Gravitational Wave Source",
      type: "gravitational",
      intensity: 67,
      coordinates: { x: 20.8, y: 5.1, z: -12.7 },
      first_detected: "2024.068.16:20",
      stability: 78,
      danger_level: 4,
      investigation_status: "completed",
    },
  ]);

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case "ship":
        return <Rocket className="w-4 h-4" />;
      case "station":
        return <Satellite className="w-4 h-4" />;
      case "planet":
        return <Globe className="w-4 h-4" />;
      case "anomaly":
        return <Zap className="w-4 h-4" />;
      case "debris":
        return <Target className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "friendly":
        return "text-green-400 border-green-400 bg-green-400/20";
      case "neutral":
        return "text-blue-400 border-blue-400 bg-blue-400/20";
      case "hostile":
        return "text-red-400 border-red-400 bg-red-400/20";
      case "unknown":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      default:
        return "text-trek-text border-trek-accent bg-trek-panel";
    }
  };

  const getSensorStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400";
      case "degraded":
        return "text-yellow-400";
      case "offline":
        return "text-red-400";
      case "calibrating":
        return "text-blue-400";
      default:
        return "text-trek-text";
    }
  };

  const getThreatLevelColor = (level: number) => {
    if (level === 0) return "text-green-400";
    if (level <= 3) return "text-blue-400";
    if (level <= 6) return "text-yellow-400";
    if (level <= 8) return "text-orange-400";
    return "text-red-400";
  };

  const startDetailedScan = (contactId: string) => {
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) return;

    const scan: ScanResult = {
      id: `scan_${Date.now()}`,
      target_id: contactId,
      scan_type: "detailed_analysis",
      completion: 0,
      results: {},
      anomalies_detected: [],
      time_remaining: 30000, // 30 seconds
    };

    setActiveScan(scan);

    // Simulate scan progress
    const interval = setInterval(() => {
      setActiveScan((prev) => {
        if (!prev || prev.completion >= 100) {
          clearInterval(interval);
          return prev;
        }

        const newCompletion = Math.min(
          100,
          prev.completion + Math.random() * 8 + 2,
        );
        const newTimeRemaining = Math.max(0, prev.time_remaining - 1000);

        // Add results as scan progresses
        const newResults = { ...prev.results };
        if (newCompletion > 25 && !newResults.composition) {
          newResults.composition = contact.composition;
        }
        if (newCompletion > 50 && !newResults.energy_readings) {
          newResults.energy_readings = [
            contact.energy_signature,
            contact.energy_signature * 0.8,
            contact.energy_signature * 1.2,
          ];
        }
        if (
          newCompletion > 75 &&
          contact.type === "ship" &&
          !newResults.life_signs
        ) {
          newResults.life_signs = Math.floor(Math.random() * 1000) + 100;
        }

        return {
          ...prev,
          completion: newCompletion,
          time_remaining: newTimeRemaining,
          results: newResults,
        };
      });
    }, 1000);
  };

  const calibrateSensor = (sensorId: string) => {
    setSensorSuites((prev) =>
      prev.map((sensor) =>
        sensor.id === sensorId
          ? {
              ...sensor,
              status: "calibrating",
              efficiency: Math.min(100, sensor.efficiency + Math.random() * 10),
            }
          : sensor,
      ),
    );

    setTimeout(() => {
      setSensorSuites((prev) =>
        prev.map((sensor) =>
          sensor.id === sensorId
            ? {
                ...sensor,
                status: "online",
                last_calibration: new Date()
                  .toISOString()
                  .slice(0, 10)
                  .replace(/-/g, "."),
              }
            : sensor,
        ),
      );
    }, 3000);
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      contact.type.toLowerCase().includes(searchFilter.toLowerCase()) ||
      contact.classification.toLowerCase().includes(searchFilter.toLowerCase()),
  );

  useEffect(() => {
    // Simulate real-time sensor updates
    const interval = setInterval(() => {
      setContacts((prev) =>
        prev.map((contact) => ({
          ...contact,
          energy_signature: Math.max(
            0,
            Math.min(200, contact.energy_signature + (Math.random() - 0.5) * 5),
          ),
          distance: Math.max(
            0.1,
            contact.distance + (Math.random() - 0.5) * 0.2,
          ),
          bearing: (contact.bearing + (Math.random() - 0.5) * 2) % 360,
        })),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          SENSOR OPERATIONS
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant={sensorMode === "passive" ? "default" : "outline"}
              size="sm"
              className={
                sensorMode === "passive"
                  ? "bg-trek-blue text-trek-dark"
                  : "border-trek-blue text-trek-blue"
              }
              onClick={() => setSensorMode("passive")}
            >
              <Eye className="w-4 h-4 mr-2" />
              Passive
            </Button>
            <Button
              variant={sensorMode === "active" ? "default" : "outline"}
              size="sm"
              className={
                sensorMode === "active"
                  ? "bg-trek-blue text-trek-dark"
                  : "border-trek-blue text-trek-blue"
              }
              onClick={() => setSensorMode("active")}
            >
              <Radar className="w-4 h-4 mr-2" />
              Active
            </Button>
            <Button
              variant={sensorMode === "deep_scan" ? "default" : "outline"}
              size="sm"
              className={
                sensorMode === "deep_scan"
                  ? "bg-trek-blue text-trek-dark"
                  : "border-trek-blue text-trek-blue"
              }
              onClick={() => setSensorMode("deep_scan")}
            >
              <Scan className="w-4 h-4 mr-2" />
              Deep Scan
            </Button>
          </div>
          <div className="text-right">
            <div className="text-sm text-trek-text/70">Sensor Power</div>
            <div className="text-trek-blue font-semibold">{sensorPower}%</div>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value: any) => setActiveTab(value)}
      >
        <TabsList className="grid grid-cols-5 w-full bg-trek-panel border border-trek-accent">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-trek-dark"
          >
            <Activity className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="contacts"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-trek-dark"
          >
            <Target className="w-4 h-4 mr-2" />
            Contacts
          </TabsTrigger>
          <TabsTrigger
            value="scans"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-trek-dark"
          >
            <Scan className="w-4 h-4 mr-2" />
            Active Scans
          </TabsTrigger>
          <TabsTrigger
            value="anomalies"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-trek-dark"
          >
            <Zap className="w-4 h-4 mr-2" />
            Anomalies
          </TabsTrigger>
          <TabsTrigger
            value="calibration"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-trek-dark"
          >
            <Settings className="w-4 h-4 mr-2" />
            Calibration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Sensor Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader className="pb-3">
                <CardTitle className="text-trek-gold text-sm">
                  Sensor Range
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-trek-blue mb-2">
                  {scanRange} LY
                </div>
                <div className="text-xs text-trek-text/60">Light Years</div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={scanRange}
                  onChange={(e) => setScanRange(parseInt(e.target.value))}
                  className="w-full mt-2"
                />
              </CardContent>
            </Card>

            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader className="pb-3">
                <CardTitle className="text-trek-gold text-sm">
                  Active Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-trek-blue mb-2">
                  {contacts.length}
                </div>
                <div className="text-xs text-trek-text/60">
                  {
                    contacts.filter((c) => c.classification === "hostile")
                      .length
                  }{" "}
                  hostile
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader className="pb-3">
                <CardTitle className="text-trek-gold text-sm">
                  Anomalies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-trek-warning mb-2">
                  {anomalies.length}
                </div>
                <div className="text-xs text-trek-text/60">
                  {anomalies.filter((a) => a.danger_level > 7).length} high risk
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader className="pb-3">
                <CardTitle className="text-trek-gold text-sm">
                  Sensor Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-trek-blue mb-2">
                  {Math.round(
                    sensorSuites.reduce((acc, s) => acc + s.efficiency, 0) /
                      sensorSuites.length,
                  )}
                  %
                </div>
                <div className="text-xs text-trek-text/60">
                  Average efficiency
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sensor Suites Status */}
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-gold flex items-center gap-2">
                <Radar className="w-5 h-5" />
                Sensor Suite Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sensorSuites.map((sensor) => (
                  <Card
                    key={sensor.id}
                    className="bg-trek-bg/50 border-trek-accent/30"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-trek-text">
                          {sensor.name}
                        </h4>
                        <Badge
                          className={`text-xs ${getSensorStatusColor(sensor.status)}`}
                        >
                          {sensor.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-trek-text/70">Range:</span>
                          <span className="text-trek-blue">
                            {sensor.range} LY
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-trek-text/70">Resolution:</span>
                          <span className="text-trek-blue">
                            {sensor.resolution}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-trek-text/70">Efficiency:</span>
                          <span className="text-trek-blue">
                            {sensor.efficiency}%
                          </span>
                        </div>
                        <div>
                          <Progress
                            value={sensor.efficiency}
                            className="h-2 mt-1"
                          />
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="w-full mt-3 bg-trek-accent hover:bg-trek-accent/80 text-trek-dark"
                        onClick={() => calibrateSensor(sensor.id)}
                        disabled={sensor.status === "calibrating"}
                      >
                        {sensor.status === "calibrating" ? (
                          <>
                            <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                            Calibrating...
                          </>
                        ) : (
                          <>
                            <Settings className="w-3 h-3 mr-2" />
                            Calibrate
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Detections */}
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-gold flex items-center gap-2">
                <Target className="w-5 h-5" />
                Recent Detections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contacts.slice(0, 3).map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-3 bg-trek-bg/50 rounded border border-trek-accent/30"
                  >
                    <div className="flex items-center gap-3">
                      {getContactTypeIcon(contact.type)}
                      <div>
                        <div className="font-semibold text-trek-text">
                          {contact.name}
                        </div>
                        <div className="text-xs text-trek-text/60">
                          {contact.distance.toFixed(1)} LY • Bearing{" "}
                          {contact.bearing.toFixed(0)}°
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`text-xs ${getClassificationColor(contact.classification)}`}
                      >
                        {contact.classification}
                      </Badge>
                      <div
                        className={`text-sm font-semibold ${getThreatLevelColor(contact.threat_level)}`}
                      >
                        Threat: {contact.threat_level}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search contacts..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="bg-trek-bg border-trek-accent text-trek-text"
              />
            </div>
            <Button
              className="bg-trek-accent hover:bg-trek-accent/80 text-trek-dark"
              onClick={() => setContacts((prev) => [...prev])} // Refresh contacts
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <Card
                key={contact.id}
                className="bg-trek-panel border-trek-accent"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-trek-bg/50 rounded-lg">
                        {getContactTypeIcon(contact.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-trek-gold">
                          {contact.name}
                          {contact.sensor_ghost && (
                            <Badge className="ml-2 text-xs text-yellow-400 border-yellow-400 bg-yellow-400/20">
                              GHOST
                            </Badge>
                          )}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-trek-text/70">
                          <span>{contact.type.toUpperCase()}</span>
                          <span>•</span>
                          <span>{contact.distance.toFixed(1)} LY</span>
                          <span>•</span>
                          <span>Bearing {contact.bearing.toFixed(0)}°</span>
                          <span>•</span>
                          <span className="capitalize">{contact.size}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge
                        className={`${getClassificationColor(contact.classification)}`}
                      >
                        {contact.classification.toUpperCase()}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm text-trek-text/70">
                          Threat Level
                        </div>
                        <div
                          className={`font-bold ${getThreatLevelColor(contact.threat_level)}`}
                        >
                          {contact.threat_level}/10
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <div className="text-sm text-trek-text/70">
                        Energy Signature
                      </div>
                      <div className="text-trek-blue font-semibold">
                        {contact.energy_signature.toFixed(1)} TW
                      </div>
                    </div>
                    {contact.shield_status && (
                      <div>
                        <div className="text-sm text-trek-text/70">
                          Shield Status
                        </div>
                        <div className="text-trek-blue font-semibold">
                          {contact.shield_status}%
                        </div>
                      </div>
                    )}
                    {contact.course !== undefined && (
                      <div>
                        <div className="text-sm text-trek-text/70">
                          Course & Speed
                        </div>
                        <div className="text-trek-blue font-semibold">
                          {contact.course.toFixed(0)}° @ Warp{" "}
                          {contact.speed?.toFixed(1)}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-trek-text/70">
                        Last Detected
                      </div>
                      <div className="text-trek-blue font-semibold">
                        {contact.last_detected}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-sm text-trek-text/70 mb-2">
                      Composition Analysis
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {contact.composition.map((comp, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs border-trek-blue text-trek-blue"
                        >
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-trek-accent/30">
                    <Button
                      size="sm"
                      className="bg-trek-accent hover:bg-trek-accent/80 text-trek-dark"
                      onClick={() => startDetailedScan(contact.id)}
                    >
                      <Scan className="w-3 h-3 mr-2" />
                      Detailed Scan
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-trek-accent text-trek-text"
                      onClick={() => setSelectedContact(contact)}
                    >
                      <Eye className="w-3 h-3 mr-2" />
                      View Details
                    </Button>
                    {contact.classification === "unknown" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-trek-warning text-trek-warning"
                      >
                        <AlertTriangle className="w-3 h-3 mr-2" />
                        Identify
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scans" className="space-y-6">
          {activeScan ? (
            <Card className="bg-trek-panel border-trek-blue">
              <CardHeader>
                <CardTitle className="text-trek-gold flex items-center gap-2">
                  <Scan className="w-5 h-5" />
                  Active Detailed Scan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-trek-blue">
                      {contacts.find((c) => c.id === activeScan.target_id)
                        ?.name || "Unknown Target"}
                    </div>
                    <div className="text-sm text-trek-text/70">
                      Scan Type:{" "}
                      {activeScan.scan_type.replace("_", " ").toUpperCase()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-trek-text/70">
                      Time Remaining
                    </div>
                    <div className="text-trek-blue font-semibold">
                      {Math.ceil(activeScan.time_remaining / 1000)}s
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Scan Progress</span>
                    <span className="text-trek-blue">
                      {activeScan.completion.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={activeScan.completion} className="h-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeScan.results.composition && (
                    <div>
                      <div className="text-sm font-semibold text-trek-gold mb-2">
                        Material Composition
                      </div>
                      <div className="space-y-1">
                        {activeScan.results.composition.map(
                          (material, index) => (
                            <div
                              key={index}
                              className="text-sm text-trek-text/80"
                            >
                              • {material}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {activeScan.results.energy_readings && (
                    <div>
                      <div className="text-sm font-semibold text-trek-gold mb-2">
                        Energy Readings
                      </div>
                      <div className="space-y-1">
                        {activeScan.results.energy_readings.map(
                          (reading, index) => (
                            <div
                              key={index}
                              className="text-sm text-trek-text/80"
                            >
                              Frequency {index + 1}: {reading.toFixed(1)} TW
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {activeScan.results.life_signs && (
                    <div>
                      <div className="text-sm font-semibold text-trek-gold mb-2">
                        Life Signs
                      </div>
                      <div className="text-sm text-trek-text/80">
                        {activeScan.results.life_signs} bio-signatures detected
                      </div>
                    </div>
                  )}

                  {activeScan.results.structural_integrity && (
                    <div>
                      <div className="text-sm font-semibold text-trek-gold mb-2">
                        Structural Integrity
                      </div>
                      <div className="text-sm text-trek-text/80">
                        {activeScan.results.structural_integrity}%
                      </div>
                    </div>
                  )}
                </div>

                {activeScan.completion >= 100 && (
                  <Alert className="border-green-500 bg-green-500/10">
                    <Scan className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-400">
                      Detailed scan completed successfully. All data has been
                      recorded.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-trek-panel border-trek-accent">
              <CardContent className="p-12 text-center">
                <Scan className="w-16 h-16 text-trek-text/40 mx-auto mb-4" />
                <div className="text-trek-text/60">No active scans</div>
                <div className="text-sm text-trek-text/40 mt-2">
                  Select a contact and initiate a detailed scan to begin
                  analysis
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scan History */}
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-gold">
                Recent Scan History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-trek-text/60 text-center py-4">
                  No completed scans to display
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-6">
          <div className="space-y-4">
            {anomalies.map((anomaly) => (
              <Card
                key={anomaly.id}
                className="bg-trek-panel border-trek-accent"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-trek-warning/20 rounded-lg">
                        <Zap className="w-6 h-6 text-trek-warning" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-trek-gold">
                          {anomaly.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-trek-text/70">
                          <span className="capitalize">
                            {anomaly.type.replace("_", " ")}
                          </span>
                          <span>•</span>
                          <span>Detected: {anomaly.first_detected}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-trek-text/70">
                        Danger Level
                      </div>
                      <div
                        className={`font-bold ${getThreatLevelColor(anomaly.danger_level)}`}
                      >
                        {anomaly.danger_level}/10
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <div className="text-sm text-trek-text/70">Intensity</div>
                      <div className="text-trek-warning font-semibold">
                        {anomaly.intensity}%
                      </div>
                      <Progress
                        value={anomaly.intensity}
                        className="h-2 mt-1"
                      />
                    </div>
                    <div>
                      <div className="text-sm text-trek-text/70">Stability</div>
                      <div className="text-trek-blue font-semibold">
                        {anomaly.stability}%
                      </div>
                      <Progress
                        value={anomaly.stability}
                        className="h-2 mt-1"
                      />
                    </div>
                    <div>
                      <div className="text-sm text-trek-text/70">
                        Coordinates
                      </div>
                      <div className="text-trek-text font-mono text-xs">
                        {anomaly.coordinates.x.toFixed(1)},{" "}
                        {anomaly.coordinates.y.toFixed(1)},{" "}
                        {anomaly.coordinates.z.toFixed(1)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-trek-text/70">
                        Investigation
                      </div>
                      <Badge
                        className={`text-xs ${
                          anomaly.investigation_status === "completed"
                            ? "text-green-400 border-green-400"
                            : anomaly.investigation_status === "in_progress"
                              ? "text-blue-400 border-blue-400"
                              : anomaly.investigation_status === "pending"
                                ? "text-yellow-400 border-yellow-400"
                                : "text-red-400 border-red-400"
                        }`}
                      >
                        {anomaly.investigation_status
                          .replace("_", " ")
                          .toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-trek-accent/30">
                    {anomaly.investigation_status === "pending" && (
                      <Button
                        size="sm"
                        className="bg-trek-accent hover:bg-trek-accent/80 text-trek-dark"
                      >
                        <Play className="w-3 h-3 mr-2" />
                        Begin Investigation
                      </Button>
                    )}
                    {anomaly.investigation_status === "in_progress" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-trek-warning text-trek-warning"
                      >
                        <Pause className="w-3 h-3 mr-2" />
                        Pause Investigation
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-trek-accent text-trek-text"
                    >
                      <MapPin className="w-3 h-3 mr-2" />
                      Navigate To
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-trek-blue text-trek-blue"
                    >
                      <Eye className="w-3 h-3 mr-2" />
                      Deep Scan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calibration" className="space-y-6">
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-gold flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Sensor Array Calibration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {sensorSuites.map((sensor) => (
                <Card
                  key={sensor.id}
                  className="bg-trek-bg/50 border-trek-accent/30"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-trek-gold">
                          {sensor.name}
                        </h4>
                        <div className="text-sm text-trek-text/70">
                          {sensor.type.replace("_", " ").toUpperCase()}
                        </div>
                      </div>
                      <Badge
                        className={`${getSensorStatusColor(sensor.status)}`}
                      >
                        {sensor.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-trek-text/70 mb-1">
                          Efficiency
                        </div>
                        <div className="text-2xl font-bold text-trek-blue mb-2">
                          {sensor.efficiency}%
                        </div>
                        <Progress value={sensor.efficiency} className="h-2" />
                      </div>
                      <div>
                        <div className="text-sm text-trek-text/70 mb-1">
                          Power Usage
                        </div>
                        <div className="text-2xl font-bold text-trek-warning mb-2">
                          {sensor.power_usage}%
                        </div>
                        <Progress value={sensor.power_usage} className="h-2" />
                      </div>
                      <div>
                        <div className="text-sm text-trek-text/70 mb-1">
                          Resolution
                        </div>
                        <div className="text-2xl font-bold text-trek-blue mb-2">
                          {sensor.resolution}%
                        </div>
                        <Progress value={sensor.resolution} className="h-2" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-semibold text-trek-gold mb-2">
                          Available Scan Modes
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {sensor.scan_modes.map((mode, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs border-trek-blue text-trek-blue"
                            >
                              {mode}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-trek-text/70">
                          Last Calibration:
                        </span>
                        <span className="text-trek-blue">
                          {sensor.last_calibration}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-trek-text/70">
                          Maximum Range:
                        </span>
                        <span className="text-trek-blue">
                          {sensor.range} Light Years
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-trek-accent/30">
                      <Button
                        className="bg-trek-accent hover:bg-trek-accent/80 text-trek-dark"
                        onClick={() => calibrateSensor(sensor.id)}
                        disabled={sensor.status === "calibrating"}
                      >
                        {sensor.status === "calibrating" ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Calibrating...
                          </>
                        ) : (
                          <>
                            <Settings className="w-4 h-4 mr-2" />
                            Recalibrate
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="border-trek-accent text-trek-text"
                      >
                        <Microscope className="w-4 h-4 mr-2" />
                        Diagnostic
                      </Button>
                      {sensor.status === "degraded" && (
                        <Button
                          variant="outline"
                          className="border-trek-warning text-trek-warning"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Power Management */}
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-gold flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Sensor Power Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Total Sensor Power Allocation</span>
                    <span className="text-trek-blue">{sensorPower}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={sensorPower}
                    onChange={(e) => setSensorPower(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-trek-text/60 mt-1">
                    Higher power allocation improves sensor range and resolution
                    but increases energy consumption
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="border-trek-accent text-trek-text"
                    onClick={() => setSensorPower(40)}
                  >
                    Low Power
                  </Button>
                  <Button
                    variant="outline"
                    className="border-trek-accent text-trek-text"
                    onClick={() => setSensorPower(70)}
                  >
                    Standard
                  </Button>
                  <Button
                    variant="outline"
                    className="border-trek-accent text-trek-text"
                    onClick={() => setSensorPower(95)}
                  >
                    Maximum
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
