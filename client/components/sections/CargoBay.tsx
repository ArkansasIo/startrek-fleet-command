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
  Package,
  Box,
  Truck,
  Search,
  Filter,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Shield,
  Wrench,
  Beaker,
  Users,
  MapPin,
  BarChart3,
  FileText,
  Download,
  Upload,
} from "lucide-react";

interface CargoContainer {
  id: string;
  type:
    | "Standard"
    | "Hazardous"
    | "Refrigerated"
    | "Pressurized"
    | "Quantum"
    | "Biological"
    | "Medical";
  size: "Small" | "Medium" | "Large" | "Extra Large";
  contents: string;
  quantity: number;
  unit: string;
  weight: number;
  volume: number;
  origin: string;
  destination: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status:
    | "Loading"
    | "Stored"
    | "In Transit"
    | "Unloading"
    | "Quarantine"
    | "Processing";
  bay_location: string;
  security_level: "Public" | "Restricted" | "Classified" | "Top Secret";
  expiry_date?: string;
  special_requirements?: string[];
  hazard_class?: string;
  environmental_controls?: {
    temperature: number;
    humidity: number;
    pressure: number;
    atmosphere: string;
  };
}

interface CargoBay {
  id: string;
  name: string;
  ship_class: string;
  capacity_containers: number;
  current_containers: number;
  max_weight: number;
  current_weight: number;
  max_volume: number;
  current_volume: number;
  environmental_systems: string[];
  security_rating: number;
  automated_systems: boolean;
  replicator_access: boolean;
  transporter_access: boolean;
  status: "Operational" | "Maintenance" | "Emergency" | "Offline";
}

interface CargoBayProps {
  activeSubmenu?: string;
}

export function CargoBay({ activeSubmenu }: CargoBayProps) {
  const defaultTab = "overview";
  const [activeTab, setActiveTab] = useState(activeSubmenu || defaultTab);

  useEffect(() => {
    setActiveTab(activeSubmenu || defaultTab);
  }, [activeSubmenu]);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const cargoBays: CargoBay[] = [
    {
      id: "CB-01",
      name: "Primary Cargo Bay",
      ship_class: "Galaxy-class",
      capacity_containers: 500,
      current_containers: 347,
      max_weight: 50000,
      current_weight: 34700,
      max_volume: 125000,
      current_volume: 86750,
      environmental_systems: [
        "Atmosphere Control",
        "Temperature Regulation",
        "Gravity Control",
        "Containment Fields",
      ],
      security_rating: 8,
      automated_systems: true,
      replicator_access: true,
      transporter_access: true,
      status: "Operational",
    },
    {
      id: "CB-02",
      name: "Secondary Cargo Bay",
      ship_class: "Galaxy-class",
      capacity_containers: 300,
      current_containers: 156,
      max_weight: 30000,
      current_weight: 15600,
      max_volume: 75000,
      current_volume: 39000,
      environmental_systems: [
        "Atmosphere Control",
        "Temperature Regulation",
        "Containment Fields",
      ],
      security_rating: 6,
      automated_systems: true,
      replicator_access: false,
      transporter_access: true,
      status: "Operational",
    },
    {
      id: "CB-03",
      name: "Hazardous Materials Bay",
      ship_class: "Galaxy-class",
      capacity_containers: 50,
      current_containers: 23,
      max_weight: 5000,
      current_weight: 2300,
      max_volume: 12500,
      current_volume: 5750,
      environmental_systems: [
        "Isolation Fields",
        "Radiation Shielding",
        "Hazmat Protocols",
        "Emergency Venting",
      ],
      security_rating: 10,
      automated_systems: true,
      replicator_access: false,
      transporter_access: false,
      status: "Operational",
    },
  ];

  const cargoContainers: CargoContainer[] = [
    {
      id: "CC-2024-001",
      type: "Standard",
      size: "Large",
      contents: "Dilithium Crystals",
      quantity: 500,
      unit: "kg",
      weight: 500,
      volume: 1250,
      origin: "Risa Mining Station",
      destination: "Starfleet Engineering",
      priority: "High",
      status: "Stored",
      bay_location: "CB-01-A7",
      security_level: "Restricted",
      special_requirements: ["Stable Temperature", "Radiation Monitoring"],
    },
    {
      id: "CC-2024-002",
      type: "Medical",
      size: "Medium",
      contents: "Emergency Medical Supplies",
      quantity: 200,
      unit: "units",
      weight: 150,
      volume: 500,
      origin: "Medical Starbase 12",
      destination: "Colony Vega IX",
      priority: "Critical",
      status: "In Transit",
      bay_location: "CB-01-B3",
      security_level: "Public",
      expiry_date: "2024-12-31",
      special_requirements: ["Sterile Environment", "Temperature Control"],
    },
    {
      id: "CC-2024-003",
      type: "Hazardous",
      size: "Small",
      contents: "Antimatter Containment Pods",
      quantity: 12,
      unit: "pods",
      weight: 240,
      volume: 300,
      origin: "Antimatter Production Facility",
      destination: "Deep Space Nine",
      priority: "Critical",
      status: "Quarantine",
      bay_location: "CB-03-X1",
      security_level: "Top Secret",
      hazard_class: "Class IX Explosive",
      special_requirements: [
        "Magnetic Containment",
        "Isolation Protocol",
        "Emergency Ejection Ready",
      ],
    },
    {
      id: "CC-2024-004",
      type: "Biological",
      size: "Medium",
      contents: "Rare Alien Specimens",
      quantity: 50,
      unit: "specimens",
      weight: 75,
      volume: 200,
      origin: "Alpha Centauri Research Station",
      destination: "Vulcan Science Academy",
      priority: "Medium",
      status: "Stored",
      bay_location: "CB-02-C5",
      security_level: "Classified",
      environmental_controls: {
        temperature: -50,
        humidity: 30,
        pressure: 1.2,
        atmosphere: "Nitrogen/Argon Mix",
      },
      special_requirements: [
        "Cryogenic Storage",
        "Bio-Containment",
        "Quarantine Protocols",
      ],
    },
    {
      id: "CC-2024-005",
      type: "Quantum",
      size: "Small",
      contents: "Quantum Phase Discriminators",
      quantity: 24,
      unit: "devices",
      weight: 48,
      volume: 120,
      origin: "Daystrom Institute",
      destination: "USS Voyager",
      priority: "High",
      status: "Processing",
      bay_location: "CB-01-Q2",
      security_level: "Top Secret",
      special_requirements: [
        "Quantum Isolation",
        "Subspace Dampening",
        "Phase Stability Monitoring",
      ],
    },
    {
      id: "CC-2024-006",
      type: "Standard",
      size: "Extra Large",
      contents: "Replicator Raw Materials",
      quantity: 10000,
      unit: "kg",
      weight: 10000,
      volume: 25000,
      origin: "Industrial Replicator Complex",
      destination: "Colony New Berlin",
      priority: "Low",
      status: "Loading",
      bay_location: "CB-01-D1-D5",
      security_level: "Public",
    },
    {
      id: "CC-2024-007",
      type: "Refrigerated",
      size: "Large",
      contents: "Diplomatic Food Supplies",
      quantity: 2000,
      unit: "kg",
      weight: 2000,
      volume: 4000,
      origin: "Earth Culinary Center",
      destination: "Risa Diplomatic Conference",
      priority: "Medium",
      status: "Stored",
      bay_location: "CB-02-R1",
      security_level: "Public",
      expiry_date: "2024-06-15",
      environmental_controls: {
        temperature: 2,
        humidity: 85,
        pressure: 1.0,
        atmosphere: "Standard",
      },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Stored":
        return "bg-trek-blue/20 text-trek-blue border-trek-blue";
      case "In Transit":
        return "bg-trek-warning/20 text-trek-warning border-trek-warning";
      case "Loading":
        return "bg-green-500/20 text-green-400 border-green-500";
      case "Unloading":
        return "bg-purple-500/20 text-purple-400 border-purple-500";
      case "Quarantine":
        return "bg-red-500/20 text-red-400 border-red-500";
      case "Processing":
        return "bg-trek-gold/20 text-trek-gold border-trek-gold";
      default:
        return "bg-trek-text/20 text-trek-text border-trek-text";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500/20 text-red-400 border-red-500";
      case "High":
        return "bg-trek-warning/20 text-trek-warning border-trek-warning";
      case "Medium":
        return "bg-trek-blue/20 text-trek-blue border-trek-blue";
      case "Low":
        return "bg-trek-text/20 text-trek-text border-trek-text";
      default:
        return "bg-trek-text/20 text-trek-text border-trek-text";
    }
  };

  const filteredContainers = cargoContainers.filter((container) => {
    const matchesSearch =
      container.contents.toLowerCase().includes(searchFilter.toLowerCase()) ||
      container.id.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || container.status === statusFilter;
    const matchesType = typeFilter === "all" || container.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const containersByType = cargoContainers.reduce(
    (acc, container) => {
      acc[container.type] = (acc[container.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const containersByStatus = cargoContainers.reduce(
    (acc, container) => {
      acc[container.status] = (acc[container.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          CARGO BAY OPERATIONS
        </h2>
        <div className="flex gap-2">
          <Button className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            Add Container
          </Button>
          <Button
            variant="outline"
            className="border-trek-accent text-trek-text hover:bg-trek-accent"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Manifest
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
            value="containers"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Container Management
          </TabsTrigger>
          <TabsTrigger
            value="manifest"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Cargo Manifest
          </TabsTrigger>
          <TabsTrigger
            value="operations"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Operations
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
            {cargoBays.map((bay) => (
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
                      {bay.id} • {bay.ship_class}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`
                      ${bay.status === "Operational" ? "bg-trek-blue/20 text-trek-blue border-trek-blue" : ""}
                      ${bay.status === "Maintenance" ? "bg-trek-warning/20 text-trek-warning border-trek-warning" : ""}
                      ${bay.status === "Emergency" ? "bg-red-500/20 text-red-400 border-red-500" : ""}
                      ${bay.status === "Offline" ? "bg-trek-text/20 text-trek-text border-trek-text" : ""}
                    `}
                  >
                    {bay.status}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Container Capacity</span>
                      <span>
                        {bay.current_containers}/{bay.capacity_containers}
                      </span>
                    </div>
                    <Progress
                      value={
                        (bay.current_containers / bay.capacity_containers) * 100
                      }
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Weight Capacity</span>
                      <span>
                        {bay.current_weight.toLocaleString()}/
                        {bay.max_weight.toLocaleString()} kg
                      </span>
                    </div>
                    <Progress
                      value={(bay.current_weight / bay.max_weight) * 100}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Volume Capacity</span>
                      <span>
                        {bay.current_volume.toLocaleString()}/
                        {bay.max_volume.toLocaleString()} m³
                      </span>
                    </div>
                    <Progress
                      value={(bay.current_volume / bay.max_volume) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="pt-2 border-t border-trek-accent">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-trek-blue" />
                        <span>Security Level {bay.security_rating}/10</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {bay.automated_systems ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-trek-warning" />
                        )}
                        <span>Automation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {bay.replicator_access ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Minus className="w-4 h-4 text-trek-text/50" />
                        )}
                        <span>Replicator</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {bay.transporter_access ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Minus className="w-4 h-4 text-trek-text/50" />
                        )}
                        <span>Transporter</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
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
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="containers" className="mt-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <Input
                  placeholder="Search containers..."
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
                  <SelectItem value="Stored">Stored</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Loading">Loading</SelectItem>
                  <SelectItem value="Unloading">Unloading</SelectItem>
                  <SelectItem value="Quarantine">Quarantine</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48 bg-trek-panel border-trek-accent">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Hazardous">Hazardous</SelectItem>
                  <SelectItem value="Medical">Medical</SelectItem>
                  <SelectItem value="Biological">Biological</SelectItem>
                  <SelectItem value="Quantum">Quantum</SelectItem>
                  <SelectItem value="Refrigerated">Refrigerated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {filteredContainers.map((container) => (
                <Card
                  key={container.id}
                  className="bg-trek-panel border-trek-accent p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-bold text-trek-gold">
                          {container.id}
                        </h3>
                        <Badge
                          variant="outline"
                          className="border-trek-blue text-trek-blue"
                        >
                          {container.type}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-trek-accent text-trek-text"
                        >
                          {container.size}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(container.status)}
                        >
                          {container.status}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={getPriorityColor(container.priority)}
                        >
                          {container.priority} Priority
                        </Badge>
                      </div>
                      <h4 className="text-trek-text text-lg mb-2">
                        {container.contents}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-trek-text/70">
                        <div>
                          <span className="block font-medium">Quantity</span>
                          <span>
                            {container.quantity} {container.unit}
                          </span>
                        </div>
                        <div>
                          <span className="block font-medium">Weight</span>
                          <span>{container.weight} kg</span>
                        </div>
                        <div>
                          <span className="block font-medium">Volume</span>
                          <span>{container.volume} m³</span>
                        </div>
                        <div>
                          <span className="block font-medium">Location</span>
                          <span>{container.bay_location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-trek-accent text-trek-text hover:bg-trek-accent"
                      >
                        Move Container
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-trek-text/70 mb-1">Route</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-trek-blue" />
                        <span className="text-sm">{container.origin}</span>
                        <span className="text-trek-text/50">→</span>
                        <span className="text-sm">{container.destination}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-trek-text/70 mb-1">
                        Security Level
                      </p>
                      <Badge
                        variant="outline"
                        className={`
                          ${container.security_level === "Public" ? "border-green-500 text-green-400" : ""}
                          ${container.security_level === "Restricted" ? "border-trek-warning text-trek-warning" : ""}
                          ${container.security_level === "Classified" ? "border-red-500 text-red-400" : ""}
                          ${container.security_level === "Top Secret" ? "border-purple-500 text-purple-400" : ""}
                        `}
                      >
                        {container.security_level}
                      </Badge>
                    </div>
                  </div>

                  {container.special_requirements && (
                    <div className="mt-4 pt-4 border-t border-trek-accent">
                      <p className="text-sm text-trek-text/70 mb-2">
                        Special Requirements
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {container.special_requirements.map((req) => (
                          <Badge
                            key={req}
                            variant="outline"
                            className="text-xs border-trek-warning text-trek-warning"
                          >
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {container.environmental_controls && (
                    <div className="mt-4 pt-4 border-t border-trek-accent">
                      <p className="text-sm text-trek-text/70 mb-2">
                        Environmental Controls
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          Temperature:{" "}
                          {container.environmental_controls.temperature}°C
                        </div>
                        <div>
                          Humidity: {container.environmental_controls.humidity}%
                        </div>
                        <div>
                          Pressure: {container.environmental_controls.pressure}{" "}
                          atm
                        </div>
                        <div>
                          Atmosphere:{" "}
                          {container.environmental_controls.atmosphere}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="manifest" className="mt-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-trek-gold">
                Cargo Manifest - USS Enterprise NCC-1701-D
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-trek-accent text-trek-text hover:bg-trek-accent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-trek-accent">
                    <th className="text-left py-2 text-trek-gold">
                      Container ID
                    </th>
                    <th className="text-left py-2 text-trek-gold">Contents</th>
                    <th className="text-left py-2 text-trek-gold">Type</th>
                    <th className="text-left py-2 text-trek-gold">Quantity</th>
                    <th className="text-left py-2 text-trek-gold">Location</th>
                    <th className="text-left py-2 text-trek-gold">Status</th>
                    <th className="text-left py-2 text-trek-gold">Security</th>
                  </tr>
                </thead>
                <tbody>
                  {cargoContainers.map((container) => (
                    <tr
                      key={container.id}
                      className="border-b border-trek-accent/30"
                    >
                      <td className="py-2 text-trek-blue">{container.id}</td>
                      <td className="py-2">{container.contents}</td>
                      <td className="py-2">{container.type}</td>
                      <td className="py-2">
                        {container.quantity} {container.unit}
                      </td>
                      <td className="py-2">{container.bay_location}</td>
                      <td className="py-2">
                        <Badge
                          variant="outline"
                          className={getStatusColor(container.status).replace(
                            /bg-|border-/g,
                            "text-",
                          )}
                        >
                          {container.status}
                        </Badge>
                      </td>
                      <td className="py-2">{container.security_level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Active Operations
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-trek-accent rounded">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="font-medium">Loading Operation</p>
                      <p className="text-sm text-trek-text/70">
                        Container CC-2024-006
                      </p>
                    </div>
                  </div>
                  <Progress value={67} className="w-24 h-2" />
                </div>

                <div className="flex items-center justify-between p-3 border border-trek-accent rounded">
                  <div className="flex items-center gap-3">
                    <Wrench className="w-5 h-5 text-trek-warning" />
                    <div>
                      <p className="font-medium">Quarantine Processing</p>
                      <p className="text-sm text-trek-text/70">
                        Container CC-2024-003
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-trek-warning text-trek-warning"
                  >
                    In Progress
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border border-trek-accent rounded">
                  <div className="flex items-center gap-3">
                    <Beaker className="w-5 h-5 text-trek-blue" />
                    <div>
                      <p className="font-medium">Environmental Monitoring</p>
                      <p className="text-sm text-trek-text/70">
                        Biological Specimens
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-trek-blue text-trek-blue"
                  >
                    Active
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                System Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Transporter Systems</span>
                  <Badge
                    variant="outline"
                    className="border-trek-blue text-trek-blue"
                  >
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Replicator Network</span>
                  <Badge
                    variant="outline"
                    className="border-trek-blue text-trek-blue"
                  >
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Environmental Controls</span>
                  <Badge
                    variant="outline"
                    className="border-trek-blue text-trek-blue"
                  >
                    Nominal
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Security Systems</span>
                  <Badge
                    variant="outline"
                    className="border-trek-blue text-trek-blue"
                  >
                    Armed
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Automated Handlers</span>
                  <Badge
                    variant="outline"
                    className="border-trek-warning text-trek-warning"
                  >
                    Maintenance
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
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Container Types Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(containersByType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span>{type}</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(count / cargoContainers.length) * 100}
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
                Status Overview
              </h3>
              <div className="space-y-3">
                {Object.entries(containersByStatus).map(([status, count]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between"
                  >
                    <span>{status}</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(count / cargoContainers.length) * 100}
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
                Cargo Bay Efficiency Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-trek-blue mb-1">
                    87%
                  </div>
                  <div className="text-sm text-trek-text/70">
                    Space Utilization
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-trek-warning mb-1">
                    12
                  </div>
                  <div className="text-sm text-trek-text/70">
                    Operations/Hour
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    99.2%
                  </div>
                  <div className="text-sm text-trek-text/70">System Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-trek-gold mb-1">
                    4.2
                  </div>
                  <div className="text-sm text-trek-text/70">
                    Avg. Processing Time (hrs)
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
