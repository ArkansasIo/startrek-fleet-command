import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Rocket,
  Ship,
  Star,
  Shield,
  Zap,
  Wrench,
  Users,
  Package,
  Navigation,
  Radio,
  Eye,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Download,
  Upload,
  Sparkles,
  Target,
  Gauge,
  Settings,
} from "lucide-react";

interface Starship {
  id: string;
  name: string;
  registry: string;
  class_name: string;
  type:
    | "Exploration"
    | "Tactical"
    | "Science"
    | "Support"
    | "Flagship"
    | "Dreadnought"
    | "Escort"
    | "Mothership"
    | "Battlecruiser"
    | "Destroyer"
    | "Frigate"
    | "Transport"
    | "Medical"
    | "Mining"
    | "Diplomatic";
  size: "Small" | "Medium" | "Large" | "Massive";
  era: "TOS" | "TNG" | "DS9" | "VOY" | "ENT" | "DIS" | "PIC" | "Custom";

  // Physical Specifications
  specifications: {
    length: number;
    beam: number;
    height: number;
    mass: number;
    deck_count: number;
    crew_capacity: number;
    max_occupancy: number;
  };

  // Performance
  performance: {
    max_warp: number;
    cruise_warp: number;
    impulse_speed: number;
    maneuverability: number;
    structural_integrity: number;
  };

  // Systems
  systems: {
    power_output: number;
    shield_strength: number;
    sensor_range: number;
    transporter_range: number;
    replicator_efficiency: number;
    computer_core_type: string;
    life_support_capacity: number;
  };

  // Armament
  armament: {
    phaser_arrays: number;
    torpedo_launchers: number;
    defensive_rating: number;
    offensive_rating: number;
    special_weapons: string[];
  };

  // Facilities
  facilities: {
    shuttlebays: number;
    cargo_bays: number;
    science_labs: number;
    medical_facilities: number;
    holodecks: number;
    quarters: number;
    special_facilities: string[];
  };

  // Service Information
  service: {
    commissioning_year: number;
    shipyard: string;
    commanding_officer: string;
    home_port: string;
    mission_profile: string;
    status:
      | "Active"
      | "Under Construction"
      | "Decommissioned"
      | "Destroyed"
      | "Missing"
      | "Mothballed";
  };

  // History
  history: {
    description: string;
    notable_missions: string[];
    battle_honors: string[];
    refit_history: string[];
  };
}

interface StarshipCreationProps {
  activeSubmenu?: string;
}

export function StarshipCreation({ activeSubmenu }: StarshipCreationProps) {
  const defaultTab = "basic";
  const [activeTab, setActiveTab] = useState(activeSubmenu || defaultTab);

  useEffect(() => {
    setActiveTab(activeSubmenu || defaultTab);
  }, [activeSubmenu]);
  const [starships, setStarships] = useState<Starship[]>([]);
  const [currentShip, setCurrentShip] = useState<Partial<Starship>>({
    name: "",
    registry: "",
    class_name: "",
    type: "Exploration",
    size: "Medium",
    era: "TNG",
    specifications: {
      length: 600,
      beam: 400,
      height: 120,
      mass: 4500000,
      deck_count: 42,
      crew_capacity: 1000,
      max_occupancy: 6000,
    },
    performance: {
      max_warp: 9.6,
      cruise_warp: 6.0,
      impulse_speed: 0.25,
      maneuverability: 7,
      structural_integrity: 8,
    },
    systems: {
      power_output: 12750,
      shield_strength: 2688000,
      sensor_range: 17,
      transporter_range: 40000,
      replicator_efficiency: 95,
      computer_core_type: "LCARS",
      life_support_capacity: 120,
    },
    armament: {
      phaser_arrays: 12,
      torpedo_launchers: 3,
      defensive_rating: 8,
      offensive_rating: 7,
      special_weapons: [],
    },
    facilities: {
      shuttlebays: 2,
      cargo_bays: 12,
      science_labs: 15,
      medical_facilities: 3,
      holodecks: 16,
      quarters: 850,
      special_facilities: [],
    },
    service: {
      commissioning_year: 2365,
      shipyard: "Utopia Planitia Fleet Yards",
      commanding_officer: "",
      home_port: "Earth",
      mission_profile: "",
      status: "Active",
    },
    history: {
      description: "",
      notable_missions: [],
      battle_honors: [],
      refit_history: [],
    },
  });

  const shipTypes = [
    "Exploration",
    "Tactical",
    "Science",
    "Support",
    "Flagship",
    "Dreadnought",
    "Escort",
    "Mothership",
    "Battlecruiser",
    "Destroyer",
    "Frigate",
    "Transport",
    "Medical",
    "Mining",
    "Diplomatic",
  ];

  const shipSizes = ["Small", "Medium", "Large", "Massive"];
  const eras = ["TOS", "TNG", "DS9", "VOY", "ENT", "DIS", "PIC", "Custom"];

  const starfleetShipyards = [
    "Utopia Planitia Fleet Yards",
    "San Francisco Fleet Yards",
    "40 Eridani A Starfleet Construction Yards",
    "Antares Ship Yards",
    "Beta Antares Ship Yards",
    "Copernicus Ship Yards",
    "McKinley Station",
    "Proxima Maintenance Yards",
    "Riverside Shipyard",
    "Luna Shipyards",
  ];

  const computerCoreTypes = [
    "LCARS",
    "M-5 Multitronic",
    "Duotronic",
    "Isolinear",
    "Bio-neural",
    "Quantum",
    "Positronic",
  ];

  const specialWeapons = [
    "Quantum Torpedoes",
    "Tricobalt Devices",
    "Transphasic Torpedoes",
    "Genesis Device",
    "Red Matter",
    "Thalaron Radiation",
    "Subspace Weapons",
    "Chroniton Torpedoes",
    "Gravimetric Torpedoes",
    "Polaron Beam",
    "Disruptor Cannons",
    "Plasma Cannons",
  ];

  const specialFacilities = [
    "Captain's Yacht",
    "Aeroshuttle",
    "Diplomatic Suites",
    "Cetacean Labs",
    "Stellar Cartography",
    "Astrometrics Lab",
    "Hydroponics Bay",
    "Arboretum",
    "Ten Forward",
    "Holographic Training Center",
    "Emergency Medical Hologram",
    "Temporal Research Lab",
    "Quantum Mechanics Lab",
    "Deflector Control",
    "Battle Bridge",
    "Warp Core Ejection System",
    "Antimatter Storage Pods",
  ];

  const updateShip = (field: string, value: any) => {
    setCurrentShip((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setCurrentShip((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const addArrayItem = (parent: string, field: string, value: string) => {
    if (!value.trim()) return;
    setCurrentShip((prev) => {
      const parentObj = prev[parent as keyof typeof prev] as any;
      const currentArray = parentObj?.[field] || [];
      return {
        ...prev,
        [parent]: {
          ...parentObj,
          [field]: [...currentArray, value.trim()],
        },
      };
    });
  };

  const removeArrayItem = (parent: string, field: string, index: number) => {
    setCurrentShip((prev) => {
      const parentObj = prev[parent as keyof typeof prev] as any;
      const currentArray = parentObj?.[field] || [];
      return {
        ...prev,
        [parent]: {
          ...parentObj,
          [field]: currentArray.filter((_: any, i: number) => i !== index),
        },
      };
    });
  };

  const saveStarship = () => {
    const starship: Starship = {
      id: `ship-${Date.now()}`,
      ...(currentShip as Starship),
    };
    setStarships((prev) => [...prev, starship]);
    // Reset form would go here
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Exploration":
        return "text-trek-blue border-trek-blue";
      case "Tactical":
        return "text-red-400 border-red-400";
      case "Science":
        return "text-green-400 border-green-400";
      case "Support":
        return "text-trek-warning border-trek-warning";
      case "Flagship":
        return "text-trek-gold border-trek-gold";
      case "Medical":
        return "text-green-500 border-green-500";
      case "Diplomatic":
        return "text-purple-400 border-purple-400";
      default:
        return "text-trek-text border-trek-text";
    }
  };

  const generateRegistry = () => {
    const prefixes = ["NCC", "NX", "NAR", "NSP"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(Math.random() * 90000) + 10000;
    const suffix =
      Math.random() > 0.7
        ? String.fromCharCode(65 + Math.floor(Math.random() * 26))
        : "";
    updateShip("registry", `${prefix}-${number}${suffix}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          STARSHIP CREATION
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={saveStarship}
            className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark font-semibold"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Starship
          </Button>
          <Button
            variant="outline"
            className="border-trek-accent text-trek-text hover:bg-trek-accent"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-trek-panel border border-trek-accent">
          <TabsTrigger
            value="basic"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Basic Info
          </TabsTrigger>
          <TabsTrigger
            value="specs"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger
            value="systems"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Systems
          </TabsTrigger>
          <TabsTrigger
            value="armament"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Armament
          </TabsTrigger>
          <TabsTrigger
            value="service"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Service History
          </TabsTrigger>
          <TabsTrigger
            value="fleet"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Fleet Registry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-6">
              Basic Ship Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="ship-name" className="text-trek-text">
                  Ship Name
                </Label>
                <Input
                  id="ship-name"
                  value={currentShip.name || ""}
                  onChange={(e) => updateShip("name", e.target.value)}
                  placeholder="USS Enterprise"
                  className="bg-trek-dark border-trek-accent"
                />
              </div>

              <div>
                <Label htmlFor="registry" className="text-trek-text">
                  Registry Number
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="registry"
                    value={currentShip.registry || ""}
                    onChange={(e) => updateShip("registry", e.target.value)}
                    placeholder="NCC-1701-D"
                    className="bg-trek-dark border-trek-accent"
                  />
                  <Button
                    onClick={generateRegistry}
                    variant="outline"
                    className="border-trek-accent text-trek-text hover:bg-trek-accent"
                  >
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="class-name" className="text-trek-text">
                  Class Name
                </Label>
                <Input
                  id="class-name"
                  value={currentShip.class_name || ""}
                  onChange={(e) => updateShip("class_name", e.target.value)}
                  placeholder="Galaxy-class"
                  className="bg-trek-dark border-trek-accent"
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-trek-text">
                  Ship Type
                </Label>
                <Select
                  value={currentShip.type || ""}
                  onValueChange={(value) => updateShip("type", value)}
                >
                  <SelectTrigger className="bg-trek-dark border-trek-accent">
                    <SelectValue placeholder="Select ship type" />
                  </SelectTrigger>
                  <SelectContent>
                    {shipTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="size" className="text-trek-text">
                  Size Class
                </Label>
                <Select
                  value={currentShip.size || ""}
                  onValueChange={(value) => updateShip("size", value)}
                >
                  <SelectTrigger className="bg-trek-dark border-trek-accent">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {shipSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="era" className="text-trek-text">
                  Era
                </Label>
                <Select
                  value={currentShip.era || ""}
                  onValueChange={(value) => updateShip("era", value)}
                >
                  <SelectTrigger className="bg-trek-dark border-trek-accent">
                    <SelectValue placeholder="Select era" />
                  </SelectTrigger>
                  <SelectContent>
                    {eras.map((era) => (
                      <SelectItem key={era} value={era}>
                        {era}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="mission-profile" className="text-trek-text">
                  Mission Profile
                </Label>
                <Textarea
                  id="mission-profile"
                  value={currentShip.service?.mission_profile || ""}
                  onChange={(e) =>
                    updateNestedField(
                      "service",
                      "mission_profile",
                      e.target.value,
                    )
                  }
                  placeholder="Deep space exploration and diplomatic missions..."
                  className="bg-trek-dark border-trek-accent"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="commanding-officer" className="text-trek-text">
                  Commanding Officer
                </Label>
                <Input
                  id="commanding-officer"
                  value={currentShip.service?.commanding_officer || ""}
                  onChange={(e) =>
                    updateNestedField(
                      "service",
                      "commanding_officer",
                      e.target.value,
                    )
                  }
                  placeholder="Captain Jean-Luc Picard"
                  className="bg-trek-dark border-trek-accent"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                <h4 className="font-semibold text-trek-gold mb-2">
                  Ship Type Descriptions
                </h4>
                <div className="space-y-1 text-sm">
                  <div>
                    • <strong>Exploration:</strong> Long-range scientific
                    missions
                  </div>
                  <div>
                    • <strong>Tactical:</strong> Military and defense operations
                  </div>
                  <div>
                    • <strong>Science:</strong> Research and analysis focused
                  </div>
                  <div>
                    • <strong>Support:</strong> Supply and logistics operations
                  </div>
                  <div>
                    • <strong>Flagship:</strong> Command and control vessels
                  </div>
                </div>
              </div>

              <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                <h4 className="font-semibold text-trek-gold mb-2">
                  Size Classifications
                </h4>
                <div className="space-y-1 text-sm">
                  <div>
                    • <strong>Small:</strong> &lt;200m (Runabouts, Scouts)
                  </div>
                  <div>
                    • <strong>Medium:</strong> 200-500m (Frigates, Destroyers)
                  </div>
                  <div>
                    • <strong>Large:</strong> 500-800m (Cruisers, Battleships)
                  </div>
                  <div>
                    • <strong>Massive:</strong> &gt;800m (Dreadnoughts,
                    Starbases)
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="specs" className="mt-6">
          <div className="space-y-6">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Physical Specifications
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <Label className="text-trek-text">Length (meters)</Label>
                  <Input
                    type="number"
                    value={currentShip.specifications?.length || 0}
                    onChange={(e) =>
                      updateNestedField(
                        "specifications",
                        "length",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>

                <div>
                  <Label className="text-trek-text">Beam (meters)</Label>
                  <Input
                    type="number"
                    value={currentShip.specifications?.beam || 0}
                    onChange={(e) =>
                      updateNestedField(
                        "specifications",
                        "beam",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>

                <div>
                  <Label className="text-trek-text">Height (meters)</Label>
                  <Input
                    type="number"
                    value={currentShip.specifications?.height || 0}
                    onChange={(e) =>
                      updateNestedField(
                        "specifications",
                        "height",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>

                <div>
                  <Label className="text-trek-text">Mass (metric tons)</Label>
                  <Input
                    type="number"
                    value={currentShip.specifications?.mass || 0}
                    onChange={(e) =>
                      updateNestedField(
                        "specifications",
                        "mass",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>

                <div>
                  <Label className="text-trek-text">Deck Count</Label>
                  <Input
                    type="number"
                    value={currentShip.specifications?.deck_count || 0}
                    onChange={(e) =>
                      updateNestedField(
                        "specifications",
                        "deck_count",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>

                <div>
                  <Label className="text-trek-text">Crew Capacity</Label>
                  <Input
                    type="number"
                    value={currentShip.specifications?.crew_capacity || 0}
                    onChange={(e) =>
                      updateNestedField(
                        "specifications",
                        "crew_capacity",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Performance Characteristics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(currentShip.performance || {}).map(
                  ([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-trek-text capitalize">
                          {key.replace(/_/g, " ")}
                        </Label>
                        <span className="text-trek-blue font-semibold">
                          {key.includes("warp")
                            ? `Warp ${value}`
                            : key === "impulse_speed"
                              ? `${(value * 100).toFixed(1)}% light speed`
                              : `${value}/10`}
                        </span>
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={(newValue) =>
                          updateNestedField("performance", key, newValue[0])
                        }
                        max={
                          key.includes("warp")
                            ? 10
                            : key === "impulse_speed"
                              ? 1
                              : 10
                        }
                        min={0}
                        step={
                          key.includes("warp")
                            ? 0.1
                            : key === "impulse_speed"
                              ? 0.01
                              : 1
                        }
                        className="w-full"
                      />
                    </div>
                  ),
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="systems" className="mt-6">
          <div className="space-y-6">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Ship Systems
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-trek-text">Power Output (TW)</Label>
                  <Input
                    type="number"
                    value={currentShip.systems?.power_output || 0}
                    onChange={(e) =>
                      updateNestedField(
                        "systems",
                        "power_output",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>

                <div>
                  <Label className="text-trek-text">Shield Strength (TJ)</Label>
                  <Input
                    type="number"
                    value={currentShip.systems?.shield_strength || 0}
                    onChange={(e) =>
                      updateNestedField(
                        "systems",
                        "shield_strength",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>

                <div>
                  <Label className="text-trek-text">
                    Sensor Range (light years)
                  </Label>
                  <Input
                    type="number"
                    value={currentShip.systems?.sensor_range || 0}
                    onChange={(e) =>
                      updateNestedField(
                        "systems",
                        "sensor_range",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>

                <div>
                  <Label className="text-trek-text">
                    Transporter Range (km)
                  </Label>
                  <Input
                    type="number"
                    value={currentShip.systems?.transporter_range || 0}
                    onChange={(e) =>
                      updateNestedField(
                        "systems",
                        "transporter_range",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>

                <div>
                  <Label className="text-trek-text">Computer Core Type</Label>
                  <Select
                    value={currentShip.systems?.computer_core_type || ""}
                    onValueChange={(value) =>
                      updateNestedField("systems", "computer_core_type", value)
                    }
                  >
                    <SelectTrigger className="bg-trek-dark border-trek-accent">
                      <SelectValue placeholder="Select computer type" />
                    </SelectTrigger>
                    <SelectContent>
                      {computerCoreTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-trek-text">
                    Life Support Capacity (hours)
                  </Label>
                  <Input
                    type="number"
                    value={currentShip.systems?.life_support_capacity || 0}
                    onChange={(e) =>
                      updateNestedField(
                        "systems",
                        "life_support_capacity",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Facilities & Amenities
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(currentShip.facilities || {})
                  .filter(([key]) => key !== "special_facilities")
                  .map(([key, value]) => (
                    <div key={key}>
                      <Label className="text-trek-text capitalize">
                        {key.replace(/_/g, " ")}
                      </Label>
                      <Input
                        type="number"
                        value={value as number}
                        onChange={(e) =>
                          updateNestedField(
                            "facilities",
                            key,
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="bg-trek-dark border-trek-accent"
                      />
                    </div>
                  ))}
              </div>

              <div className="mt-6">
                <Label className="text-trek-text">Special Facilities</Label>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {specialFacilities.map((facility) => (
                    <div key={facility} className="flex items-center space-x-2">
                      <Checkbox
                        id={`facility-${facility}`}
                        checked={
                          currentShip.facilities?.special_facilities?.includes(
                            facility,
                          ) || false
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            addArrayItem(
                              "facilities",
                              "special_facilities",
                              facility,
                            );
                          } else {
                            const index =
                              currentShip.facilities?.special_facilities?.indexOf(
                                facility,
                              ) || -1;
                            if (index > -1)
                              removeArrayItem(
                                "facilities",
                                "special_facilities",
                                index,
                              );
                          }
                        }}
                      />
                      <Label
                        htmlFor={`facility-${facility}`}
                        className="text-sm text-trek-text"
                      >
                        {facility}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="armament" className="mt-6">
          <div className="space-y-6">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Weapons & Defense
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-trek-text">Phaser Arrays</Label>
                  <Input
                    type="number"
                    value={currentShip.armament?.phaser_arrays || 0}
                    onChange={(e) =>
                      updateNestedField(
                        "armament",
                        "phaser_arrays",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>

                <div>
                  <Label className="text-trek-text">Torpedo Launchers</Label>
                  <Input
                    type="number"
                    value={currentShip.armament?.torpedo_launchers || 0}
                    onChange={(e) =>
                      updateNestedField(
                        "armament",
                        "torpedo_launchers",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>

                <div>
                  <Label className="text-trek-text">
                    Defensive Rating (1-10)
                  </Label>
                  <Slider
                    value={[currentShip.armament?.defensive_rating || 5]}
                    onValueChange={(value) =>
                      updateNestedField(
                        "armament",
                        "defensive_rating",
                        value[0],
                      )
                    }
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-center text-trek-blue font-semibold">
                    {currentShip.armament?.defensive_rating || 5}/10
                  </div>
                </div>

                <div>
                  <Label className="text-trek-text">
                    Offensive Rating (1-10)
                  </Label>
                  <Slider
                    value={[currentShip.armament?.offensive_rating || 5]}
                    onValueChange={(value) =>
                      updateNestedField(
                        "armament",
                        "offensive_rating",
                        value[0],
                      )
                    }
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-center text-trek-blue font-semibold">
                    {currentShip.armament?.offensive_rating || 5}/10
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Label className="text-trek-text">Special Weapons</Label>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {specialWeapons.map((weapon) => (
                    <div key={weapon} className="flex items-center space-x-2">
                      <Checkbox
                        id={`weapon-${weapon}`}
                        checked={
                          currentShip.armament?.special_weapons?.includes(
                            weapon,
                          ) || false
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            addArrayItem("armament", "special_weapons", weapon);
                          } else {
                            const index =
                              currentShip.armament?.special_weapons?.indexOf(
                                weapon,
                              ) || -1;
                            if (index > -1)
                              removeArrayItem(
                                "armament",
                                "special_weapons",
                                index,
                              );
                          }
                        }}
                      />
                      <Label
                        htmlFor={`weapon-${weapon}`}
                        className="text-sm text-trek-text"
                      >
                        {weapon}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="service" className="mt-6">
          <div className="space-y-6">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Service Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-trek-text">Commissioning Year</Label>
                  <Input
                    type="number"
                    value={currentShip.service?.commissioning_year || 2365}
                    onChange={(e) =>
                      updateNestedField(
                        "service",
                        "commissioning_year",
                        parseInt(e.target.value) || 2365,
                      )
                    }
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>

                <div>
                  <Label className="text-trek-text">Shipyard</Label>
                  <Select
                    value={currentShip.service?.shipyard || ""}
                    onValueChange={(value) =>
                      updateNestedField("service", "shipyard", value)
                    }
                  >
                    <SelectTrigger className="bg-trek-dark border-trek-accent">
                      <SelectValue placeholder="Select shipyard" />
                    </SelectTrigger>
                    <SelectContent>
                      {starfleetShipyards.map((yard) => (
                        <SelectItem key={yard} value={yard}>
                          {yard}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-trek-text">Home Port</Label>
                  <Input
                    value={currentShip.service?.home_port || ""}
                    onChange={(e) =>
                      updateNestedField("service", "home_port", e.target.value)
                    }
                    placeholder="Earth, Sol System"
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>

                <div>
                  <Label className="text-trek-text">Current Status</Label>
                  <Select
                    value={currentShip.service?.status || ""}
                    onValueChange={(value) =>
                      updateNestedField("service", "status", value)
                    }
                  >
                    <SelectTrigger className="bg-trek-dark border-trek-accent">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Under Construction">
                        Under Construction
                      </SelectItem>
                      <SelectItem value="Decommissioned">
                        Decommissioned
                      </SelectItem>
                      <SelectItem value="Destroyed">Destroyed</SelectItem>
                      <SelectItem value="Missing">Missing</SelectItem>
                      <SelectItem value="Mothballed">Mothballed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6">
                <Label className="text-trek-text">Ship Description</Label>
                <Textarea
                  value={currentShip.history?.description || ""}
                  onChange={(e) =>
                    updateNestedField("history", "description", e.target.value)
                  }
                  placeholder="Describe the ship's design, purpose, and notable features..."
                  className="bg-trek-dark border-trek-accent"
                  rows={4}
                />
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Service History
              </h3>

              <div className="space-y-4">
                <div>
                  <Label className="text-trek-text">Notable Missions</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="mission"
                      placeholder="Add notable mission..."
                      className="bg-trek-dark border-trek-accent"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addArrayItem(
                            "history",
                            "notable_missions",
                            e.currentTarget.value,
                          );
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        const input = document.getElementById(
                          "mission",
                        ) as HTMLInputElement;
                        addArrayItem(
                          "history",
                          "notable_missions",
                          input.value,
                        );
                        input.value = "";
                      }}
                      className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {currentShip.history?.notable_missions?.map(
                      (mission, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-trek-dark/50 border border-trek-accent rounded p-2"
                        >
                          <span className="text-sm">{mission}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removeArrayItem(
                                "history",
                                "notable_missions",
                                index,
                              )
                            }
                            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-trek-text">Battle Honors</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="honor"
                      placeholder="Add battle honor..."
                      className="bg-trek-dark border-trek-accent"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addArrayItem(
                            "history",
                            "battle_honors",
                            e.currentTarget.value,
                          );
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        const input = document.getElementById(
                          "honor",
                        ) as HTMLInputElement;
                        addArrayItem("history", "battle_honors", input.value);
                        input.value = "";
                      }}
                      className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {currentShip.history?.battle_honors?.map((honor, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-trek-dark/50 border border-trek-accent rounded p-2"
                      >
                        <span className="text-sm">{honor}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            removeArrayItem("history", "battle_honors", index)
                          }
                          className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={saveStarship}
                  className="w-full bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Starship to Fleet Registry
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fleet" className="mt-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-trek-gold">
                Fleet Registry
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-trek-accent text-trek-text hover:bg-trek-accent"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button
                  variant="outline"
                  className="border-trek-accent text-trek-text hover:bg-trek-accent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {starships.length === 0 ? (
              <div className="text-center py-12">
                <Ship className="w-16 h-16 text-trek-text/50 mx-auto mb-4" />
                <p className="text-trek-text/70">
                  No starships in registry yet.
                </p>
                <p className="text-sm text-trek-text/50">
                  Create your first starship using the tabs above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {starships.map((ship) => (
                  <Card
                    key={ship.id}
                    className="bg-trek-dark/50 border-trek-accent p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-trek-gold">
                          {ship.name}
                        </h4>
                        <p className="text-sm text-trek-text/70">
                          {ship.registry}
                        </p>
                        <p className="text-xs text-trek-blue">
                          {ship.class_name}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getTypeColor(ship.type)}`}
                      >
                        {ship.type}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Length:</span>
                        <span className="text-trek-blue">
                          {ship.specifications.length}m
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Crew:</span>
                        <span className="text-trek-text">
                          {ship.specifications.crew_capacity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Warp:</span>
                        <span className="text-trek-warning">
                          Warp {ship.performance.max_warp}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="text-green-400">
                          {ship.service.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
