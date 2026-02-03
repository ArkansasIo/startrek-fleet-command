import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Map,
  Navigation,
  Star,
  Globe,
  Zap,
  Target,
  Radar,
  Compass,
  Search,
  Filter,
  AlertTriangle,
  Shield,
  Eye,
  Layers,
  Settings,
  TrendingUp,
  Clock,
} from "lucide-react";

interface StellarObject {
  id: string;
  name: string;
  type:
    | "Star"
    | "Planet"
    | "Nebula"
    | "Station"
    | "Outpost"
    | "Anomaly"
    | "Wormhole";
  coordinates: { x: number; y: number; z: number };
  quadrant: "Alpha" | "Beta" | "Gamma" | "Delta";
  system?: string;
  classification?: string;
  population?: string;
  strategic_value: number;
  threat_level: number;
  federation_presence: "None" | "Outpost" | "Base" | "Major";
  last_updated: string;
  notes?: string;
}

interface NavigationRoute {
  id: string;
  name: string;
  origin: string;
  destination: string;
  waypoints: StellarObject[];
  distance_ly: number;
  travel_time_days: number;
  warp_factor: number;
  safety_rating: number;
  traffic_level: "Low" | "Medium" | "High" | "Extreme";
  hazards: string[];
  recommended_ship_class: string[];
}

interface StellarPhenomena {
  id: string;
  name: string;
  type:
    | "Nebula"
    | "Black Hole"
    | "Pulsar"
    | "Supernova"
    | "Anomaly"
    | "Dark Matter";
  coordinates: { x: number; y: number; z: number };
  size_ly: number;
  intensity: number;
  navigation_impact: "None" | "Minor" | "Major" | "Extreme";
  scientific_interest: number;
  first_discovered: string;
  study_status: "Unexplored" | "Surveying" | "Catalogued" | "Restricted";
}

export function StellarCartography() {
  const [activeView, setActiveView] = useState<
    "overview" | "navigation" | "phenomena" | "routes"
  >("overview");
  const [selectedObject, setSelectedObject] = useState<StellarObject | null>(
    null,
  );
  const [selectedRoute, setSelectedRoute] = useState<NavigationRoute | null>(
    null,
  );
  const [filterQuadrant, setFilterQuadrant] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");

  const stellarObjects: StellarObject[] = [
    // Alpha Quadrant Core Systems
    {
      id: "sol",
      name: "Sol System",
      type: "Star",
      coordinates: { x: 0, y: 0, z: 0 },
      quadrant: "Alpha",
      system: "Sol",
      classification: "G2V Yellow Dwarf",
      population: "12.8 Billion (Earth + Colonies)",
      strategic_value: 10,
      threat_level: 1,
      federation_presence: "Major",
      last_updated: "2024-01-15",
      notes: "Federation headquarters, Starfleet Command, Earth",
    },
    {
      id: "vulcan_system",
      name: "40 Eridani System",
      type: "Star",
      coordinates: { x: 16.5, y: -2.1, z: 3.4 },
      quadrant: "Beta",
      system: "40 Eridani",
      classification: "K1V Orange Dwarf",
      population: "6.2 Billion (Vulcan)",
      strategic_value: 9,
      threat_level: 2,
      federation_presence: "Major",
      last_updated: "2024-01-12",
      notes: "Vulcan homeworld, founding Federation member",
    },
    {
      id: "andoria_system",
      name: "Andoria System",
      type: "Star",
      coordinates: { x: 23.7, y: 45.2, z: -12.8 },
      quadrant: "Beta",
      system: "Andoria",
      classification: "F5V Yellow-White Star",
      population: "8.9 Billion (Andoria)",
      strategic_value: 8,
      threat_level: 2,
      federation_presence: "Major",
      last_updated: "2024-01-10",
      notes: "Andorian homeworld, founding Federation member",
    },
    {
      id: "tellar_system",
      name: "Tellar System",
      type: "Star",
      coordinates: { x: 61.5, y: 12.1, z: 34.7 },
      quadrant: "Alpha",
      system: "Tellar",
      classification: "G8V Yellow Star",
      population: "12.4 Billion (Tellar Prime)",
      strategic_value: 7,
      threat_level: 1,
      federation_presence: "Major",
      last_updated: "2024-01-08",
      notes: "Tellarite homeworld, founding Federation member",
    },
    // Major Strategic Locations
    {
      id: "ds9",
      name: "Deep Space Nine",
      type: "Station",
      coordinates: { x: 245.7, y: -71.2, z: 91.4 },
      quadrant: "Alpha",
      system: "Bajoran",
      classification: "Cardassian Nor-class Station",
      population: "2,000 (Station)",
      strategic_value: 10,
      threat_level: 6,
      federation_presence: "Base",
      last_updated: "2024-01-14",
      notes: "Bajoran Wormhole guardian, Dominion War strategic point",
    },
    {
      id: "k7",
      name: "Deep Space K-7",
      type: "Station",
      coordinates: { x: 345.6, y: 123.4, z: -456.7 },
      quadrant: "Alpha",
      system: "Sherman's Planet vicinity",
      classification: "Federation Space Station",
      population: "1,800 (Station)",
      strategic_value: 6,
      threat_level: 4,
      federation_presence: "Base",
      last_updated: "2024-01-11",
      notes: "Border station near Klingon space, tribble incident site",
    },
    {
      id: "sb74",
      name: "Starbase 74",
      type: "Station",
      coordinates: { x: 156.3, y: 78.9, z: -234.5 },
      quadrant: "Alpha",
      system: "Tarsas",
      classification: "Spacedock-class Starbase",
      population: "47,000 (Station)",
      strategic_value: 8,
      threat_level: 2,
      federation_presence: "Major",
      last_updated: "2024-01-13",
      notes: "Major Federation starbase, Bynar incident site",
    },
    // Klingon Territory
    {
      id: "qonos_system",
      name: "Qo'noS System",
      type: "Star",
      coordinates: { x: 112.3, y: -23.4, z: 67.8 },
      quadrant: "Beta",
      system: "Qo'noS",
      classification: "K2V Orange Star",
      population: "24.7 Billion (Qo'noS)",
      strategic_value: 9,
      threat_level: 7,
      federation_presence: "None",
      last_updated: "2024-01-09",
      notes: "Klingon Empire capital, First City location",
    },
    // Romulan Territory
    {
      id: "romulus_system",
      name: "Romulus System",
      type: "Star",
      coordinates: { x: 156.7, y: 78.9, z: -45.2 },
      quadrant: "Beta",
      system: "Romulus",
      classification: "G9V Yellow Star",
      population: "18.2 Billion (Romulus + Remus)",
      strategic_value: 9,
      threat_level: 8,
      federation_presence: "None",
      last_updated: "2024-01-07",
      notes: "Romulan Star Empire capital (destroyed in supernova)",
    },
    // Cardassian Territory
    {
      id: "cardassia_system",
      name: "Cardassia System",
      type: "Star",
      coordinates: { x: 234.5, y: -67.3, z: 89.1 },
      quadrant: "Alpha",
      system: "Cardassia",
      classification: "G4V Yellow Star",
      population: "4.6 Billion (Cardassia Prime)",
      strategic_value: 7,
      threat_level: 6,
      federation_presence: "None",
      last_updated: "2024-01-06",
      notes: "Cardassian Union capital, post-Dominion War rebuilding",
    },
    // Bajoran System
    {
      id: "bajor_system",
      name: "Bajor System",
      type: "Star",
      coordinates: { x: 245.7, y: -71.2, z: 91.4 },
      quadrant: "Alpha",
      system: "Bajor",
      classification: "G4V Yellow Star",
      population: "3.2 Billion (Bajor)",
      strategic_value: 9,
      threat_level: 5,
      federation_presence: "Base",
      last_updated: "2024-01-14",
      notes: "Bajoran wormhole system, Celestial Temple",
    },
    // Wormhole
    {
      id: "bajoran_wormhole",
      name: "Bajoran Wormhole",
      type: "Wormhole",
      coordinates: { x: 245.7, y: -71.2, z: 91.4 },
      quadrant: "Alpha",
      system: "Bajor",
      classification: "Stable Artificial Wormhole",
      strategic_value: 10,
      threat_level: 6,
      federation_presence: "Base",
      last_updated: "2024-01-14",
      notes: "70,000 light-year passage to Gamma Quadrant, Prophet-controlled",
    },
    // Ferengi Territory
    {
      id: "ferenginar_system",
      name: "Ferenginar System",
      type: "Star",
      coordinates: { x: 189.3, y: 23.7, z: -134.5 },
      quadrant: "Alpha",
      system: "Ferenginar",
      classification: "K3V Orange Star",
      population: "15.7 Billion (Ferenginar)",
      strategic_value: 6,
      threat_level: 3,
      federation_presence: "Outpost",
      last_updated: "2024-01-05",
      notes: "Ferengi Alliance capital, commerce center",
    },
    // Delta Quadrant (Voyager Route)
    {
      id: "ocampa_system",
      name: "Ocampa System",
      type: "Star",
      coordinates: { x: 70000, y: 0, z: 0 },
      quadrant: "Delta",
      system: "Ocampa",
      classification: "G2V Yellow Star",
      population: "500,000 (Ocampa)",
      strategic_value: 5,
      threat_level: 7,
      federation_presence: "None",
      last_updated: "2371-01-15",
      notes:
        "Caretaker's Array location, Voyager's starting point in Delta Quadrant",
    },
    // Gamma Quadrant
    {
      id: "dominion_capital",
      name: "Founders' Homeworld",
      type: "Planet",
      coordinates: { x: -80000, y: 15000, z: 25000 },
      quadrant: "Gamma",
      system: "Unknown",
      classification: "M-class Ocean World",
      population: "Unknown",
      strategic_value: 10,
      threat_level: 10,
      federation_presence: "None",
      last_updated: "2375-12-31",
      notes: "Dominion capital, Great Link location, heavily defended",
    },
  ];

  const navigationRoutes: NavigationRoute[] = [
    {
      id: "earth_vulcan",
      name: "Earth-Vulcan Route",
      origin: "Sol System",
      destination: "40 Eridani System",
      waypoints: [],
      distance_ly: 16.5,
      travel_time_days: 0.8,
      warp_factor: 6.0,
      safety_rating: 95,
      traffic_level: "High",
      hazards: [],
      recommended_ship_class: ["All Classes"],
    },
    {
      id: "earth_ds9",
      name: "Earth-Deep Space Nine Route",
      origin: "Sol System",
      destination: "Deep Space Nine",
      waypoints: [],
      distance_ly: 245.7,
      travel_time_days: 12.3,
      warp_factor: 6.0,
      safety_rating: 80,
      traffic_level: "High",
      hazards: ["Cardassian Border Patrols", "Badlands Plasma Storms"],
      recommended_ship_class: ["Galaxy", "Intrepid", "Sovereign"],
    },
    {
      id: "ds9_gamma",
      name: "DS9-Gamma Quadrant Route",
      origin: "Deep Space Nine",
      destination: "Gamma Quadrant",
      waypoints: [],
      distance_ly: 70000,
      travel_time_days: 0.01, // Through wormhole
      warp_factor: 0, // Wormhole travel
      safety_rating: 60,
      traffic_level: "Medium",
      hazards: ["Dominion Patrols", "Unknown Species", "Spatial Anomalies"],
      recommended_ship_class: ["Galaxy", "Sovereign", "Defiant"],
    },
    {
      id: "wolf359_route",
      name: "Wolf 359 Memorial Route",
      origin: "Sol System",
      destination: "Wolf 359",
      waypoints: [],
      distance_ly: 7.9,
      travel_time_days: 0.4,
      warp_factor: 6.0,
      safety_rating: 85,
      traffic_level: "Medium",
      hazards: ["Borg Debris Field", "Memorial Traffic"],
      recommended_ship_class: ["All Classes"],
    },
    {
      id: "neutral_zone_patrol",
      name: "Romulan Neutral Zone Patrol",
      origin: "Starbase 173",
      destination: "Outpost 23",
      waypoints: [],
      distance_ly: 45.6,
      travel_time_days: 2.3,
      warp_factor: 6.0,
      safety_rating: 40,
      traffic_level: "Low",
      hazards: ["Romulan Warbirds", "Cloaked Vessels", "Political Tension"],
      recommended_ship_class: ["Galaxy", "Sovereign", "Excelsior"],
    },
  ];

  const stellarPhenomena: StellarPhenomena[] = [
    {
      id: "mutara_nebula",
      name: "Mutara Nebula",
      type: "Nebula",
      coordinates: { x: 45.2, y: 12.1, z: -23.4 },
      size_ly: 3.7,
      intensity: 8,
      navigation_impact: "Major",
      scientific_interest: 9,
      first_discovered: "2285",
      study_status: "Restricted",
    },
    {
      id: "briar_patch",
      name: "Briar Patch",
      type: "Nebula",
      coordinates: { x: 234.5, y: -67.8, z: 145.2 },
      size_ly: 12.4,
      intensity: 6,
      navigation_impact: "Minor",
      scientific_interest: 10,
      first_discovered: "2375",
      study_status: "Catalogued",
    },
    {
      id: "badlands",
      name: "Badlands",
      type: "Nebula",
      coordinates: { x: 189.3, y: 45.6, z: -123.4 },
      size_ly: 45.7,
      intensity: 9,
      navigation_impact: "Extreme",
      scientific_interest: 7,
      first_discovered: "2370",
      study_status: "Catalogued",
    },
    {
      id: "black_cluster",
      name: "Black Cluster",
      type: "Dark Matter",
      coordinates: { x: 567.8, y: 234.5, z: -345.6 },
      size_ly: 8.9,
      intensity: 10,
      navigation_impact: "Extreme",
      scientific_interest: 10,
      first_discovered: "2367",
      study_status: "Restricted",
    },
    {
      id: "galactic_barrier",
      name: "Galactic Barrier",
      type: "Anomaly",
      coordinates: { x: 50000, y: 0, z: 0 },
      size_ly: 1000,
      intensity: 10,
      navigation_impact: "Extreme",
      scientific_interest: 10,
      first_discovered: "2265",
      study_status: "Restricted",
    },
  ];

  const filteredObjects = stellarObjects.filter((obj) => {
    const quadrantMatch =
      filterQuadrant === "All" || obj.quadrant === filterQuadrant;
    const typeMatch = filterType === "All" || obj.type === filterType;
    return quadrantMatch && typeMatch;
  });

  const getThreatColor = (level: number) => {
    if (level <= 3) return "text-green-400 border-green-400 bg-green-400/20";
    if (level <= 6) return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
    if (level <= 8) return "text-orange-400 border-orange-400 bg-orange-400/20";
    return "text-red-400 border-red-400 bg-red-400/20";
  };

  const getStrategicColor = (value: number) => {
    if (value <= 3) return "text-gray-400";
    if (value <= 6) return "text-blue-400";
    if (value <= 8) return "text-purple-400";
    return "text-gold-400";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Star":
        return <Star className="w-5 h-5" />;
      case "Planet":
        return <Globe className="w-5 h-5" />;
      case "Station":
        return <Target className="w-5 h-5" />;
      case "Nebula":
        return <Zap className="w-5 h-5" />;
      case "Wormhole":
        return <Navigation className="w-5 h-5" />;
      case "Anomaly":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Map className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          STELLAR CARTOGRAPHY
        </h2>
        <div className="flex gap-2">
          <Button
            variant={activeView === "overview" ? "default" : "outline"}
            size="sm"
            className={
              activeView === "overview"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveView("overview")}
          >
            <Map className="w-4 h-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeView === "navigation" ? "default" : "outline"}
            size="sm"
            className={
              activeView === "navigation"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveView("navigation")}
          >
            <Navigation className="w-4 h-4 mr-2" />
            Navigation
          </Button>
          <Button
            variant={activeView === "phenomena" ? "default" : "outline"}
            size="sm"
            className={
              activeView === "phenomena"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveView("phenomena")}
          >
            <Eye className="w-4 h-4 mr-2" />
            Phenomena
          </Button>
          <Button
            variant={activeView === "routes" ? "default" : "outline"}
            size="sm"
            className={
              activeView === "routes"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveView("routes")}
          >
            <Navigation className="w-4 h-4 mr-2" />
            Routes
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-trek-text/70">Quadrant:</span>
          <div className="flex gap-1">
            {["All", "Alpha", "Beta", "Gamma", "Delta"].map((quadrant) => (
              <Button
                key={quadrant}
                variant={filterQuadrant === quadrant ? "default" : "outline"}
                size="sm"
                className={
                  filterQuadrant === quadrant
                    ? "bg-trek-blue text-trek-dark"
                    : "border-trek-accent text-trek-text hover:bg-trek-accent"
                }
                onClick={() => setFilterQuadrant(quadrant)}
              >
                {quadrant}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-trek-text/70">Type:</span>
          <div className="flex gap-1">
            {[
              "All",
              "Star",
              "Planet",
              "Station",
              "Nebula",
              "Wormhole",
              "Anomaly",
            ].map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                size="sm"
                className={
                  filterType === type
                    ? "bg-trek-blue text-trek-dark"
                    : "border-trek-accent text-trek-text hover:bg-trek-accent"
                }
                onClick={() => setFilterType(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {activeView === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {filteredObjects.map((obj) => (
              <Card
                key={obj.id}
                className={`bg-trek-panel border-trek-accent p-4 cursor-pointer transition-colors hover:border-trek-blue ${
                  selectedObject?.id === obj.id
                    ? "border-trek-blue bg-trek-blue/5"
                    : ""
                }`}
                onClick={() => setSelectedObject(obj)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-trek-gold text-xl">
                      {getTypeIcon(obj.type)}
                    </span>
                    <div>
                      <h3 className="font-bold text-trek-gold text-lg">
                        {obj.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className="text-xs border-trek-accent text-trek-text"
                        >
                          {obj.quadrant} Quadrant
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getThreatColor(obj.threat_level)}`}
                        >
                          Threat: {obj.threat_level}/10
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-trek-text/70">Strategic Value</div>
                    <div
                      className={`font-semibold ${getStrategicColor(obj.strategic_value)}`}
                    >
                      {obj.strategic_value}/10
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Type:</span>
                    <span className="text-trek-blue">{obj.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Federation:</span>
                    <span className="text-trek-blue">
                      {obj.federation_presence}
                    </span>
                  </div>
                  {obj.population && (
                    <div className="flex justify-between col-span-2">
                      <span className="text-trek-text/70">Population:</span>
                      <span className="text-trek-blue">{obj.population}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {selectedObject && (
            <Card className="bg-trek-panel border-trek-blue p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-trek-gold text-2xl">
                  {getTypeIcon(selectedObject.type)}
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-trek-gold">
                    {selectedObject.name}
                  </h3>
                  <p className="text-trek-blue">
                    {selectedObject.type} • {selectedObject.quadrant} Quadrant
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-trek-text/70 text-sm">Coordinates</div>
                    <div className="text-trek-blue font-semibold">
                      {selectedObject.coordinates.x.toFixed(1)},{" "}
                      {selectedObject.coordinates.y.toFixed(1)},{" "}
                      {selectedObject.coordinates.z.toFixed(1)}
                    </div>
                  </div>
                  {selectedObject.system && (
                    <div>
                      <div className="text-trek-text/70 text-sm">System</div>
                      <div className="text-trek-blue font-semibold">
                        {selectedObject.system}
                      </div>
                    </div>
                  )}
                  {selectedObject.classification && (
                    <div>
                      <div className="text-trek-text/70 text-sm">
                        Classification
                      </div>
                      <div className="text-trek-blue font-semibold">
                        {selectedObject.classification}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Federation Presence
                    </div>
                    <div className="text-trek-blue font-semibold">
                      {selectedObject.federation_presence}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-trek-text/70 text-sm mb-1">
                      Strategic Value
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={getStrategicColor(
                          selectedObject.strategic_value,
                        )}
                      >
                        {selectedObject.strategic_value}/10
                      </span>
                    </div>
                    <Progress
                      value={selectedObject.strategic_value * 10}
                      className="h-2 mt-1"
                    />
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm mb-1">
                      Threat Level
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          getThreatColor(selectedObject.threat_level).split(
                            " ",
                          )[0]
                        }
                      >
                        {selectedObject.threat_level}/10
                      </span>
                    </div>
                    <Progress
                      value={selectedObject.threat_level * 10}
                      className="h-2 mt-1"
                    />
                  </div>
                </div>

                {selectedObject.population && (
                  <div>
                    <div className="text-trek-text/70 text-sm">Population</div>
                    <div className="text-trek-blue font-semibold">
                      {selectedObject.population}
                    </div>
                  </div>
                )}

                {selectedObject.notes && (
                  <div>
                    <div className="text-trek-text/70 text-sm">Notes</div>
                    <div className="text-trek-text/80 text-sm">
                      {selectedObject.notes}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-trek-accent">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                    >
                      <Radar className="w-4 h-4 mr-2" />
                      Detailed Scan
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Plot Course
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {activeView === "routes" && (
        <div className="space-y-4">
          {navigationRoutes.map((route) => (
            <Card
              key={route.id}
              className="bg-trek-panel border-trek-accent p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Navigation className="w-6 h-6 text-trek-gold" />
                  <div>
                    <h3 className="font-bold text-trek-gold text-lg">
                      {route.name}
                    </h3>
                    <p className="text-trek-blue">
                      {route.origin} → {route.destination}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant="secondary"
                    className={`text-xs mb-2 ${
                      route.safety_rating >= 80
                        ? "text-green-400 border-green-400 bg-green-400/20"
                        : route.safety_rating >= 60
                          ? "text-yellow-400 border-yellow-400 bg-yellow-400/20"
                          : "text-red-400 border-red-400 bg-red-400/20"
                    }`}
                  >
                    Safety: {route.safety_rating}%
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-trek-text/70 text-sm">Distance</div>
                  <div className="text-trek-blue font-semibold">
                    {route.distance_ly.toLocaleString()} ly
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm">Travel Time</div>
                  <div className="text-trek-blue font-semibold">
                    {route.travel_time_days} days
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm">Warp Factor</div>
                  <div className="text-trek-blue font-semibold">
                    {route.warp_factor > 0
                      ? `Warp ${route.warp_factor}`
                      : "Wormhole"}
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm">Traffic Level</div>
                  <div className="text-trek-blue font-semibold">
                    {route.traffic_level}
                  </div>
                </div>
              </div>

              {route.hazards.length > 0 && (
                <div className="mb-4">
                  <div className="text-trek-text/70 text-sm mb-2">
                    Known Hazards
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {route.hazards.map((hazard, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs border-trek-warning text-trek-warning"
                      >
                        {hazard}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <div className="text-trek-text/70 text-sm mb-1">
                  Safety Rating
                </div>
                <Progress value={route.safety_rating} className="h-3" />
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Select Route
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Route Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeView === "phenomena" && (
        <div className="space-y-4">
          {stellarPhenomena.map((phenomenon) => (
            <Card
              key={phenomenon.id}
              className="bg-trek-panel border-trek-accent p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-trek-warning" />
                  <div>
                    <h3 className="font-bold text-trek-gold">
                      {phenomenon.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="mt-1 text-xs border-trek-warning text-trek-warning"
                    >
                      {phenomenon.type}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-trek-text/70 text-sm">Study Status</div>
                  <div className="text-trek-blue font-semibold">
                    {phenomenon.study_status}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-trek-text/70 text-sm">Size</div>
                  <div className="text-trek-blue font-semibold">
                    {phenomenon.size_ly} ly
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm">Intensity</div>
                  <div className="text-trek-warning font-semibold">
                    {phenomenon.intensity}/10
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm">
                    Navigation Impact
                  </div>
                  <div
                    className={`font-semibold ${
                      phenomenon.navigation_impact === "None"
                        ? "text-green-400"
                        : phenomenon.navigation_impact === "Minor"
                          ? "text-yellow-400"
                          : phenomenon.navigation_impact === "Major"
                            ? "text-orange-400"
                            : "text-red-400"
                    }`}
                  >
                    {phenomenon.navigation_impact}
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm">
                    Scientific Interest
                  </div>
                  <div className="text-purple-400 font-semibold">
                    {phenomenon.scientific_interest}/10
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Scientific Analysis
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-trek-warning text-trek-warning hover:bg-trek-warning hover:text-trek-dark"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Navigation Warning
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
