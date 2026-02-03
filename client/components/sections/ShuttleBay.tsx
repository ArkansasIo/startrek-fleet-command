import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plane,
  Ship,
  Rocket,
  Navigation,
  Wrench,
  Fuel,
  Shield,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle,
  Settings,
  Radio,
  Target,
  Zap,
  Package,
  FileText,
  Play,
  Pause,
  RefreshCw,
  Eye,
} from "lucide-react";

interface Shuttle {
  id: string;
  name: string;
  type:
    | "Type-6"
    | "Type-7"
    | "Type-8"
    | "Type-9"
    | "Type-11"
    | "Type-15"
    | "Type-18"
    | "Runabout"
    | "Work Bee"
    | "Travel Pod"
    | "Captain's Yacht"
    | "Aeroshuttle"
    | "Delta Flyer"
    | "Argo";
  class:
    | "Personnel Transport"
    | "Cargo Transport"
    | "Reconnaissance"
    | "Combat"
    | "Maintenance"
    | "Emergency"
    | "Diplomatic"
    | "Research"
    | "Mining"
    | "Specialized";
  status:
    | "Docked"
    | "In Flight"
    | "Maintenance"
    | "Mission Ready"
    | "Damaged"
    | "Refueling"
    | "Systems Check"
    | "Departed";
  pilot: string;
  mission: string;
  bay_location: string;
  fuel_level: number;
  hull_integrity: number;
  systems_status: "Green" | "Yellow" | "Red";
  launch_time?: string;
  return_time?: string;
  passenger_capacity: number;
  cargo_capacity: number;
  current_passengers: number;
  current_cargo: number;
  max_range: number;
  max_speed: string;
  armament?: string[];
  special_equipment?: string[];
  last_maintenance: string;
  next_maintenance: string;
  flight_hours: number;
  destination?: string;
}

interface ShuttleBay {
  id: string;
  name: string;
  ship_class: string;
  capacity: number;
  current_shuttles: number;
  bay_type:
    | "Main"
    | "Auxiliary"
    | "Emergency"
    | "Cargo"
    | "Fighter"
    | "Specialized";
  size_class: "Small" | "Medium" | "Large" | "Capital";
  environmental_systems: string[];
  maintenance_facilities: string[];
  docking_ports: number;
  atmospheric_pressure: boolean;
  tractor_beam: boolean;
  force_field_barriers: boolean;
  automated_systems: boolean;
  emergency_launch: boolean;
  status:
    | "Operational"
    | "Maintenance"
    | "Emergency"
    | "Sealed"
    | "Decompressed";
  deck_level: number;
}

interface ShuttleBayProps {
  activeSubmenu?: string;
}

export function ShuttleBay({ activeSubmenu }: ShuttleBayProps) {
  const defaultTab = "overview";
  const [activeTab, setActiveTab] = useState(activeSubmenu || defaultTab);

  useEffect(() => {
    setActiveTab(activeSubmenu || defaultTab);
  }, [activeSubmenu]);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const shuttleBays: ShuttleBay[] = [
    {
      id: "SB-01",
      name: "Main Shuttlebay",
      ship_class: "Galaxy-class",
      capacity: 20,
      current_shuttles: 16,
      bay_type: "Main",
      size_class: "Large",
      environmental_systems: [
        "Atmosphere Control",
        "Artificial Gravity",
        "Life Support",
        "Emergency Force Fields",
      ],
      maintenance_facilities: [
        "Repair Bay",
        "Parts Replicator",
        "Diagnostic Systems",
        "Refueling Station",
      ],
      docking_ports: 8,
      atmospheric_pressure: true,
      tractor_beam: true,
      force_field_barriers: true,
      automated_systems: true,
      emergency_launch: true,
      status: "Operational",
      deck_level: 4,
    },
    {
      id: "SB-02",
      name: "Auxiliary Shuttlebay",
      ship_class: "Galaxy-class",
      capacity: 8,
      current_shuttles: 5,
      bay_type: "Auxiliary",
      size_class: "Medium",
      environmental_systems: [
        "Atmosphere Control",
        "Artificial Gravity",
        "Emergency Force Fields",
      ],
      maintenance_facilities: ["Basic Repair", "Refueling Station"],
      docking_ports: 4,
      atmospheric_pressure: true,
      tractor_beam: true,
      force_field_barriers: true,
      automated_systems: false,
      emergency_launch: true,
      status: "Operational",
      deck_level: 12,
    },
    {
      id: "SB-03",
      name: "Emergency Bay",
      ship_class: "Galaxy-class",
      capacity: 4,
      current_shuttles: 2,
      bay_type: "Emergency",
      size_class: "Small",
      environmental_systems: ["Emergency Life Support", "Force Field Barriers"],
      maintenance_facilities: ["Emergency Repair Kit"],
      docking_ports: 2,
      atmospheric_pressure: false,
      tractor_beam: false,
      force_field_barriers: true,
      automated_systems: false,
      emergency_launch: true,
      status: "Operational",
      deck_level: 36,
    },
  ];

  const shuttles: Shuttle[] = [
    {
      id: "NCC-1701D/01",
      name: "Shuttlecraft Galileo",
      type: "Type-6",
      class: "Personnel Transport",
      status: "Mission Ready",
      pilot: "Lt. Commander Data",
      mission: "Diplomatic Transport to Risa",
      bay_location: "SB-01-A1",
      fuel_level: 98,
      hull_integrity: 100,
      systems_status: "Green",
      launch_time: "14:30",
      return_time: "18:45",
      passenger_capacity: 7,
      cargo_capacity: 500,
      current_passengers: 3,
      current_cargo: 150,
      max_range: 50000,
      max_speed: "Warp 2",
      armament: ["Type IV Phaser Array"],
      special_equipment: [
        "Enhanced Communications Array",
        "Diplomatic Protocol Package",
      ],
      last_maintenance: "2024-04-15",
      next_maintenance: "2024-05-15",
      flight_hours: 247,
      destination: "Risa",
    },
    {
      id: "NCC-1701D/02",
      name: "Shuttlecraft Einstein",
      type: "Type-7",
      class: "Reconnaissance",
      status: "In Flight",
      pilot: "Lt. Commander Geordi La Forge",
      mission: "Sensor Survey of Briar Patch",
      bay_location: "In Flight",
      fuel_level: 67,
      hull_integrity: 95,
      systems_status: "Green",
      launch_time: "08:15",
      return_time: "20:30",
      passenger_capacity: 4,
      cargo_capacity: 300,
      current_passengers: 2,
      current_cargo: 75,
      max_range: 75000,
      max_speed: "Warp 3",
      armament: ["Type VI Phaser Array", "Photon Torpedo Launcher"],
      special_equipment: [
        "Long-Range Sensors",
        "Stealth Package",
        "Scientific Equipment",
      ],
      last_maintenance: "2024-04-10",
      next_maintenance: "2024-05-10",
      flight_hours: 189,
      destination: "Briar Patch",
    },
    {
      id: "NCC-1701D/03",
      name: "Shuttlecraft Curie",
      type: "Type-8",
      class: "Research",
      status: "Maintenance",
      pilot: "Dr. Beverly Crusher",
      mission: "Medical Supply Run",
      bay_location: "SB-01-M1",
      fuel_level: 15,
      hull_integrity: 78,
      systems_status: "Yellow",
      passenger_capacity: 6,
      cargo_capacity: 800,
      current_passengers: 0,
      current_cargo: 0,
      max_range: 40000,
      max_speed: "Warp 1.9",
      armament: ["Type IV Phaser Array"],
      special_equipment: [
        "Medical Bay",
        "Bio-Containment Unit",
        "Advanced Life Support",
      ],
      last_maintenance: "2024-04-20",
      next_maintenance: "2024-04-25",
      flight_hours: 356,
    },
    {
      id: "NCC-1701D/04",
      name: "Runabout Rio Grande",
      type: "Runabout",
      class: "Combat",
      status: "Docked",
      pilot: "Lt. Commander Worf",
      mission: "Border Patrol Assignment",
      bay_location: "SB-01-B3",
      fuel_level: 100,
      hull_integrity: 100,
      systems_status: "Green",
      passenger_capacity: 8,
      cargo_capacity: 1200,
      current_passengers: 0,
      current_cargo: 200,
      max_range: 150000,
      max_speed: "Warp 5",
      armament: [
        "Type X Phaser Array",
        "Quantum Torpedo Launcher",
        "Micro Photon Torpedoes",
      ],
      special_equipment: [
        "Enhanced Shields",
        "Tactical Package",
        "Long-Range Communications",
      ],
      last_maintenance: "2024-04-12",
      next_maintenance: "2024-05-12",
      flight_hours: 567,
    },
    {
      id: "NCC-1701D/05",
      name: "Work Bee 1",
      type: "Work Bee",
      class: "Maintenance",
      status: "Systems Check",
      pilot: "Chief Miles O'Brien",
      mission: "External Hull Inspection",
      bay_location: "SB-02-W1",
      fuel_level: 45,
      hull_integrity: 88,
      systems_status: "Yellow",
      passenger_capacity: 1,
      cargo_capacity: 100,
      current_passengers: 0,
      current_cargo: 50,
      max_range: 5000,
      max_speed: "Impulse Only",
      special_equipment: [
        "Industrial Replicator",
        "Plasma Torch",
        "Gravitational Manipulator",
      ],
      last_maintenance: "2024-04-18",
      next_maintenance: "2024-05-01",
      flight_hours: 1247,
    },
    {
      id: "NCC-1701D/06",
      name: "Captain's Yacht Calypso",
      type: "Captain's Yacht",
      class: "Diplomatic",
      status: "Mission Ready",
      pilot: "Captain Jean-Luc Picard",
      mission: "Starfleet Admiralty Meeting",
      bay_location: "Ventral Docking Port",
      fuel_level: 100,
      hull_integrity: 100,
      systems_status: "Green",
      passenger_capacity: 12,
      cargo_capacity: 600,
      current_passengers: 4,
      current_cargo: 100,
      max_range: 80000,
      max_speed: "Warp 4",
      armament: ["Type VI Phaser Array"],
      special_equipment: [
        "Luxury Accommodations",
        "Conference Room",
        "Advanced Communications",
        "Replicator",
      ],
      last_maintenance: "2024-04-08",
      next_maintenance: "2024-05-08",
      flight_hours: 124,
      destination: "Starbase 375",
    },
    {
      id: "NCC-1701D/07",
      name: "Shuttlecraft Tesla",
      type: "Type-9",
      class: "Personnel Transport",
      status: "Refueling",
      pilot: "Ensign Robin Lefler",
      mission: "Personnel Transfer",
      bay_location: "SB-01-F2",
      fuel_level: 23,
      hull_integrity: 92,
      systems_status: "Green",
      passenger_capacity: 4,
      cargo_capacity: 250,
      current_passengers: 0,
      current_cargo: 0,
      max_range: 65000,
      max_speed: "Warp 2.1",
      armament: ["Type IV Phaser Array"],
      last_maintenance: "2024-04-14",
      next_maintenance: "2024-05-14",
      flight_hours: 203,
    },
    {
      id: "NCC-1701D/08",
      name: "Shuttlecraft Hawking",
      type: "Type-15",
      class: "Emergency",
      status: "Docked",
      pilot: "Emergency Assignment",
      mission: "Standby Emergency Response",
      bay_location: "SB-03-E1",
      fuel_level: 100,
      hull_integrity: 100,
      systems_status: "Green",
      passenger_capacity: 2,
      cargo_capacity: 150,
      current_passengers: 0,
      current_cargo: 50,
      max_range: 15000,
      max_speed: "Warp 1.2",
      special_equipment: [
        "Emergency Medical Kit",
        "Search and Rescue Equipment",
      ],
      last_maintenance: "2024-04-16",
      next_maintenance: "2024-05-16",
      flight_hours: 89,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Mission Ready":
        return "bg-trek-blue/20 text-trek-blue border-trek-blue";
      case "Docked":
        return "bg-green-500/20 text-green-400 border-green-500";
      case "In Flight":
        return "bg-trek-warning/20 text-trek-warning border-trek-warning";
      case "Maintenance":
        return "bg-red-500/20 text-red-400 border-red-500";
      case "Damaged":
        return "bg-red-600/20 text-red-500 border-red-600";
      case "Refueling":
        return "bg-purple-500/20 text-purple-400 border-purple-500";
      case "Systems Check":
        return "bg-trek-gold/20 text-trek-gold border-trek-gold";
      case "Departed":
        return "bg-trek-text/20 text-trek-text border-trek-text";
      default:
        return "bg-trek-text/20 text-trek-text border-trek-text";
    }
  };

  const getSystemsColor = (status: string) => {
    switch (status) {
      case "Green":
        return "text-green-400";
      case "Yellow":
        return "text-trek-warning";
      case "Red":
        return "text-red-400";
      default:
        return "text-trek-text";
    }
  };

  const filteredShuttles = shuttles.filter((shuttle) => {
    const matchesSearch =
      shuttle.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      shuttle.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      shuttle.pilot.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || shuttle.status === statusFilter;
    const matchesType = typeFilter === "all" || shuttle.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const shuttlesByType = shuttles.reduce(
    (acc, shuttle) => {
      acc[shuttle.type] = (acc[shuttle.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const shuttlesByStatus = shuttles.reduce(
    (acc, shuttle) => {
      acc[shuttle.status] = (acc[shuttle.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          SHUTTLEBAY OPERATIONS
        </h2>
        <div className="flex gap-2">
          <Button className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark font-semibold">
            <Plane className="w-4 h-4 mr-2" />
            Launch Shuttle
          </Button>
          <Button
            variant="outline"
            className="border-trek-accent text-trek-text hover:bg-trek-accent"
          >
            <Settings className="w-4 h-4 mr-2" />
            Bay Controls
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-trek-panel border border-trek-accent">
          <TabsTrigger
            value="overview"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Bay Overview
          </TabsTrigger>
          <TabsTrigger
            value="shuttles"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Shuttle Fleet
          </TabsTrigger>
          <TabsTrigger
            value="operations"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Flight Operations
          </TabsTrigger>
          <TabsTrigger
            value="maintenance"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Maintenance
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {shuttleBays.map((bay) => (
              <Card
                key={bay.id}
                className="bg-trek-panel border-trek-accent p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-trek-gold">
                      {bay.name}
                    </h3>
                    <p className="text-trek-text/70 text-sm">
                      {bay.id} • Deck {bay.deck_level}
                    </p>
                    <p className="text-trek-blue text-sm">
                      {bay.ship_class} • {bay.bay_type} Bay
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`
                      ${bay.status === "Operational" ? "bg-trek-blue/20 text-trek-blue border-trek-blue" : ""}
                      ${bay.status === "Maintenance" ? "bg-trek-warning/20 text-trek-warning border-trek-warning" : ""}
                      ${bay.status === "Emergency" ? "bg-red-500/20 text-red-400 border-red-500" : ""}
                      ${bay.status === "Sealed" ? "bg-trek-text/20 text-trek-text border-trek-text" : ""}
                    `}
                  >
                    {bay.status}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Shuttle Capacity</span>
                      <span>
                        {bay.current_shuttles}/{bay.capacity}
                      </span>
                    </div>
                    <Progress
                      value={(bay.current_shuttles / bay.capacity) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Ship className="w-4 h-4 text-trek-blue" />
                      <span>{bay.size_class} Class</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-trek-blue" />
                      <span>{bay.docking_ports} Ports</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {bay.atmospheric_pressure ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-trek-warning" />
                      )}
                      <span>Atmosphere</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {bay.tractor_beam ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-trek-text/50" />
                      )}
                      <span>Tractor Beam</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {bay.force_field_barriers ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-trek-text/50" />
                      )}
                      <span>Force Fields</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {bay.automated_systems ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-trek-text/50" />
                      )}
                      <span>Automation</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-trek-accent">
                    <p className="text-xs text-trek-text/70 mb-2">
                      Environmental Systems:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {bay.environmental_systems.map((system) => (
                        <Badge
                          key={system}
                          variant="outline"
                          className="text-xs border-trek-accent text-trek-text"
                        >
                          {system}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-trek-text/70 mb-2">
                      Maintenance Facilities:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {bay.maintenance_facilities.map((facility) => (
                        <Badge
                          key={facility}
                          variant="outline"
                          className="text-xs border-trek-blue text-trek-blue"
                        >
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shuttles" className="mt-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <Input
                  placeholder="Search shuttles..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="bg-trek-panel border-trek-accent"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-trek-panel border-trek-accent">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Docked">Docked</SelectItem>
                  <SelectItem value="In Flight">In Flight</SelectItem>
                  <SelectItem value="Mission Ready">Mission Ready</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Damaged">Damaged</SelectItem>
                  <SelectItem value="Refueling">Refueling</SelectItem>
                  <SelectItem value="Systems Check">Systems Check</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48 bg-trek-panel border-trek-accent">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Type-6">Type-6</SelectItem>
                  <SelectItem value="Type-7">Type-7</SelectItem>
                  <SelectItem value="Type-8">Type-8</SelectItem>
                  <SelectItem value="Type-9">Type-9</SelectItem>
                  <SelectItem value="Runabout">Runabout</SelectItem>
                  <SelectItem value="Work Bee">Work Bee</SelectItem>
                  <SelectItem value="Captain's Yacht">
                    Captain's Yacht
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {filteredShuttles.map((shuttle) => (
                <Card
                  key={shuttle.id}
                  className="bg-trek-panel border-trek-accent p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-bold text-trek-gold">
                          {shuttle.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="border-trek-blue text-trek-blue"
                        >
                          {shuttle.type}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-trek-accent text-trek-text"
                        >
                          {shuttle.class}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(shuttle.status)}
                        >
                          {shuttle.status}
                        </Badge>
                      </div>
                      <p className="text-trek-text/70 text-sm mb-1">
                        {shuttle.id}
                      </p>
                      <p className="text-trek-text mb-2">{shuttle.mission}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-trek-text/70">
                        <div>
                          <span className="block font-medium">Pilot</span>
                          <span>{shuttle.pilot}</span>
                        </div>
                        <div>
                          <span className="block font-medium">Location</span>
                          <span>{shuttle.bay_location}</span>
                        </div>
                        <div>
                          <span className="block font-medium">Max Speed</span>
                          <span>{shuttle.max_speed}</span>
                        </div>
                        <div>
                          <span className="block font-medium">Range</span>
                          <span>{shuttle.max_range.toLocaleString()} km</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {shuttle.status === "Mission Ready" && (
                        <Button
                          size="sm"
                          className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Launch
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Fuel Level</span>
                        <span>{shuttle.fuel_level}%</span>
                      </div>
                      <Progress value={shuttle.fuel_level} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Hull Integrity</span>
                        <span>{shuttle.hull_integrity}%</span>
                      </div>
                      <Progress
                        value={shuttle.hull_integrity}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Systems Status:</span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getSystemsColor(shuttle.systems_status)} border-current`}
                        >
                          {shuttle.systems_status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-trek-text/70 mb-1">
                        Passenger Capacity
                      </p>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-trek-blue" />
                        <span className="text-sm">
                          {shuttle.current_passengers}/
                          {shuttle.passenger_capacity}
                        </span>
                        <Progress
                          value={
                            shuttle.passenger_capacity > 0
                              ? (shuttle.current_passengers /
                                  shuttle.passenger_capacity) *
                                100
                              : 0
                          }
                          className="flex-1 h-2"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-trek-text/70 mb-1">
                        Cargo Capacity
                      </p>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-trek-blue" />
                        <span className="text-sm">
                          {shuttle.current_cargo}/{shuttle.cargo_capacity} kg
                        </span>
                        <Progress
                          value={
                            shuttle.cargo_capacity > 0
                              ? (shuttle.current_cargo /
                                  shuttle.cargo_capacity) *
                                100
                              : 0
                          }
                          className="flex-1 h-2"
                        />
                      </div>
                    </div>
                  </div>

                  {shuttle.destination && (
                    <div className="mt-4 pt-4 border-t border-trek-accent">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-trek-blue" />
                        <span className="text-sm">
                          Destination: {shuttle.destination}
                        </span>
                        {shuttle.launch_time && (
                          <>
                            <Clock className="w-4 h-4 text-trek-warning ml-4" />
                            <span className="text-sm">
                              Launch: {shuttle.launch_time}
                            </span>
                          </>
                        )}
                        {shuttle.return_time && (
                          <>
                            <span className="text-trek-text/50 ml-2">→</span>
                            <span className="text-sm">
                              Return: {shuttle.return_time}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {shuttle.armament && shuttle.armament.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-trek-accent">
                      <p className="text-sm text-trek-text/70 mb-2">Armament</p>
                      <div className="flex flex-wrap gap-1">
                        {shuttle.armament.map((weapon) => (
                          <Badge
                            key={weapon}
                            variant="outline"
                            className="text-xs border-red-500 text-red-400"
                          >
                            {weapon}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {shuttle.special_equipment &&
                    shuttle.special_equipment.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-trek-accent">
                        <p className="text-sm text-trek-text/70 mb-2">
                          Special Equipment
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {shuttle.special_equipment.map((equipment) => (
                            <Badge
                              key={equipment}
                              variant="outline"
                              className="text-xs border-trek-blue text-trek-blue"
                            >
                              {equipment}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Active Flight Operations
              </h3>
              <div className="space-y-4">
                {shuttles
                  .filter(
                    (s) =>
                      s.status === "In Flight" || s.status === "Mission Ready",
                  )
                  .map((shuttle) => (
                    <div
                      key={shuttle.id}
                      className="flex items-center justify-between p-3 border border-trek-accent rounded"
                    >
                      <div className="flex items-center gap-3">
                        <Plane className="w-5 h-5 text-trek-blue" />
                        <div>
                          <p className="font-medium">{shuttle.name}</p>
                          <p className="text-sm text-trek-text/70">
                            {shuttle.mission}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {shuttle.status === "In Flight" && (
                          <Badge
                            variant="outline"
                            className="border-trek-warning text-trek-warning"
                          >
                            In Flight
                          </Badge>
                        )}
                        {shuttle.status === "Mission Ready" && (
                          <Button
                            size="sm"
                            className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                          >
                            Launch
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Bay Control Systems
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Bay Doors</span>
                  <Badge
                    variant="outline"
                    className="border-red-500 text-red-400"
                  >
                    Sealed
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tractor Beam Systems</span>
                  <Badge
                    variant="outline"
                    className="border-trek-blue text-trek-blue"
                  >
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Force Field Barriers</span>
                  <Badge
                    variant="outline"
                    className="border-trek-blue text-trek-blue"
                  >
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Atmospheric Pressure</span>
                  <Badge
                    variant="outline"
                    className="border-trek-blue text-trek-blue"
                  >
                    Normal
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Artificial Gravity</span>
                  <Badge
                    variant="outline"
                    className="border-trek-blue text-trek-blue"
                  >
                    1.0G
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Emergency Systems</span>
                  <Badge
                    variant="outline"
                    className="border-trek-blue text-trek-blue"
                  >
                    Ready
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Flight Control</span>
                  <Badge
                    variant="outline"
                    className="border-trek-blue text-trek-blue"
                  >
                    Operational
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6 lg:col-span-2">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Launch Schedule
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-trek-accent">
                      <th className="text-left py-2 text-trek-gold">Time</th>
                      <th className="text-left py-2 text-trek-gold">Shuttle</th>
                      <th className="text-left py-2 text-trek-gold">Pilot</th>
                      <th className="text-left py-2 text-trek-gold">Mission</th>
                      <th className="text-left py-2 text-trek-gold">
                        Destination
                      </th>
                      <th className="text-left py-2 text-trek-gold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shuttles
                      .filter((s) => s.launch_time)
                      .map((shuttle) => (
                        <tr
                          key={shuttle.id}
                          className="border-b border-trek-accent/30"
                        >
                          <td className="py-2 text-trek-blue">
                            {shuttle.launch_time}
                          </td>
                          <td className="py-2">{shuttle.name}</td>
                          <td className="py-2">{shuttle.pilot}</td>
                          <td className="py-2">{shuttle.mission}</td>
                          <td className="py-2">
                            {shuttle.destination || "N/A"}
                          </td>
                          <td className="py-2">
                            <Badge
                              variant="outline"
                              className={getStatusColor(shuttle.status).replace(
                                /bg-|border-/g,
                                "text-",
                              )}
                            >
                              {shuttle.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Maintenance Schedule
              </h3>
              <div className="space-y-4">
                {shuttles
                  .filter(
                    (s) =>
                      s.status === "Maintenance" ||
                      new Date(s.next_maintenance) <
                        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                  )
                  .map((shuttle) => (
                    <div
                      key={shuttle.id}
                      className="flex items-center justify-between p-3 border border-trek-accent rounded"
                    >
                      <div className="flex items-center gap-3">
                        <Wrench className="w-5 h-5 text-trek-warning" />
                        <div>
                          <p className="font-medium">{shuttle.name}</p>
                          <p className="text-sm text-trek-text/70">
                            {shuttle.status === "Maintenance"
                              ? "Currently in maintenance"
                              : `Due: ${shuttle.next_maintenance}`}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          shuttle.status === "Maintenance"
                            ? "border-red-500 text-red-400"
                            : "border-trek-warning text-trek-warning"
                        }
                      >
                        {shuttle.status === "Maintenance"
                          ? "In Progress"
                          : "Scheduled"}
                      </Badge>
                    </div>
                  ))}
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Maintenance Facilities
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Repair Bay Alpha</span>
                  <Badge
                    variant="outline"
                    className="border-red-500 text-red-400"
                  >
                    Occupied
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Repair Bay Beta</span>
                  <Badge
                    variant="outline"
                    className="border-trek-blue text-trek-blue"
                  >
                    Available
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Parts Replicator</span>
                  <Badge
                    variant="outline"
                    className="border-trek-blue text-trek-blue"
                  >
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Diagnostic Array</span>
                  <Badge
                    variant="outline"
                    className="border-trek-blue text-trek-blue"
                  >
                    Ready
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Refueling Station 1</span>
                  <Badge
                    variant="outline"
                    className="border-trek-warning text-trek-warning"
                  >
                    In Use
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Refueling Station 2</span>
                  <Badge
                    variant="outline"
                    className="border-trek-blue text-trek-blue"
                  >
                    Available
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Shuttle Types Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(shuttlesByType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span>{type}</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(count / shuttles.length) * 100}
                        className="w-32 h-2"
                      />
                      <span className="text-trek-blue font-semibold w-8">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Status Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(shuttlesByStatus).map(([status, count]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between"
                  >
                    <span>{status}</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(count / shuttles.length) * 100}
                        className="w-32 h-2"
                      />
                      <span className="text-trek-blue font-semibold w-8">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6 lg:col-span-2">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Shuttlebay Performance Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-trek-blue mb-1">
                    94%
                  </div>
                  <div className="text-sm text-trek-text/70">
                    Fleet Readiness
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-trek-warning mb-1">
                    8.4
                  </div>
                  <div className="text-sm text-trek-text/70">
                    Avg. Missions/Day
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    98.7%
                  </div>
                  <div className="text-sm text-trek-text/70">
                    Mission Success Rate
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-trek-gold mb-1">
                    2.3
                  </div>
                  <div className="text-sm text-trek-text/70">
                    Avg. Turnaround (hrs)
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
