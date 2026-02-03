import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Wrench,
  Ship,
  Clock,
  TrendingUp,
  Package,
  Zap,
  Shield,
  Cpu,
  Target,
  Star,
  CheckCircle,
  Settings,
  Award,
  Building,
} from "lucide-react";

interface ConstructionProject {
  id: string;
  ship_name: string;
  ship_class: string;
  shipyard: string;
  progress: number;
  estimated_completion_days: number;
  construction_crew: number;
  resources_used: {
    duranium: number;
    tritanium: number;
    dilithium: number;
    bioneural_gel: number;
  };
  current_phase:
    | "Hull Construction"
    | "Internal Systems"
    | "Warp Core Installation"
    | "Testing"
    | "Commissioning";
  priority: "Low" | "Normal" | "High" | "Critical";
  budget_allocated: number;
  budget_used: number;
}

interface ShipUpgrade {
  id: string;
  name: string;
  category:
    | "Weapons"
    | "Shields"
    | "Engines"
    | "Sensors"
    | "Computer"
    | "Life Support"
    | "Structural";
  description: string;
  requirements: {
    min_ship_class: string;
    tech_level: number;
    installation_time_days: number;
  };
  effects: {
    combat_rating_bonus: number;
    speed_bonus: number;
    efficiency_bonus: number;
    crew_capacity_change: number;
  };
  cost: {
    duranium: number;
    tritanium: number;
    dilithium: number;
    bioneural_gel: number;
    credits: number;
  };
  availability: "Standard" | "Advanced" | "Experimental" | "Classified";
}

interface Shipyard {
  id: string;
  name: string;
  location: string;
  capacity: number;
  current_projects: number;
  efficiency_rating: number;
  specialization: "Exploration" | "Tactical" | "Science" | "General";
  upgrades_available: string[];
  construction_speed_modifier: number;
  resource_discount: number;
}

interface ResourceInventory {
  duranium: number;
  tritanium: number;
  dilithium: number;
  bioneural_gel: number;
  credits: number;
  antimatter: number;
  quantum_resonators: number;
}

export function Shipyard() {
  const [activeTab, setActiveTab] = useState<
    "construction" | "upgrades" | "facilities" | "resources"
  >("construction");
  const [selectedProject, setSelectedProject] =
    useState<ConstructionProject | null>(null);
  const [selectedUpgrade, setSelectedUpgrade] = useState<ShipUpgrade | null>(
    null,
  );

  const [resourceInventory, setResourceInventory] = useState<ResourceInventory>(
    {
      duranium: 847000,
      tritanium: 523000,
      dilithium: 12500,
      bioneural_gel: 3200,
      credits: 2847000,
      antimatter: 8900,
      quantum_resonators: 450,
    },
  );

  const constructionProjects: ConstructionProject[] = [
    {
      id: "titan_construction",
      ship_name: "U.S.S. Titan",
      ship_class: "Luna Class",
      shipyard: "Utopia Planitia",
      progress: 73,
      estimated_completion_days: 127,
      construction_crew: 2847,
      resources_used: {
        duranium: 18500,
        tritanium: 12000,
        dilithium: 850,
        bioneural_gel: 400,
      },
      current_phase: "Internal Systems",
      priority: "High",
      budget_allocated: 2400000,
      budget_used: 1752000,
    },
    {
      id: "yorktown_construction",
      ship_name: "U.S.S. Yorktown",
      ship_class: "Sovereign Class",
      shipyard: "San Francisco Fleet Yards",
      progress: 12,
      estimated_completion_days: 892,
      construction_crew: 1956,
      resources_used: {
        duranium: 4200,
        tritanium: 2800,
        dilithium: 180,
        bioneural_gel: 90,
      },
      current_phase: "Hull Construction",
      priority: "Normal",
      budget_allocated: 3800000,
      budget_used: 456000,
    },
    {
      id: "experimental_ship",
      ship_name: "U.S.S. Prometheus",
      ship_class: "Prometheus Class Refit",
      shipyard: "Beta Antares Ship Yards",
      progress: 89,
      estimated_completion_days: 34,
      construction_crew: 1200,
      resources_used: {
        duranium: 16800,
        tritanium: 14200,
        dilithium: 1100,
        bioneural_gel: 580,
      },
      current_phase: "Testing",
      priority: "Critical",
      budget_allocated: 4200000,
      budget_used: 3738000,
    },
  ];

  const shipUpgrades: ShipUpgrade[] = [
    {
      id: "ablative_armor",
      name: "Ablative Armor Generator",
      category: "Shields",
      description:
        "Advanced armor technology that provides superior protection against high-energy weapons and allows ships to withstand extreme conditions.",
      requirements: {
        min_ship_class: "Intrepid",
        tech_level: 8,
        installation_time_days: 45,
      },
      effects: {
        combat_rating_bonus: 2.5,
        speed_bonus: -0.1,
        efficiency_bonus: 0,
        crew_capacity_change: -5,
      },
      cost: {
        duranium: 8500,
        tritanium: 6200,
        dilithium: 450,
        bioneural_gel: 200,
        credits: 850000,
      },
      availability: "Advanced",
    },
    {
      id: "quantum_torpedoes",
      name: "Quantum Torpedo Launchers",
      category: "Weapons",
      description:
        "Next-generation torpedo system with enhanced yield and targeting capabilities, significantly more powerful than photon torpedoes.",
      requirements: {
        min_ship_class: "Galaxy",
        tech_level: 9,
        installation_time_days: 28,
      },
      effects: {
        combat_rating_bonus: 3.2,
        speed_bonus: 0,
        efficiency_bonus: -0.05,
        crew_capacity_change: -2,
      },
      cost: {
        duranium: 4200,
        tritanium: 7800,
        dilithium: 620,
        bioneural_gel: 180,
        credits: 1200000,
      },
      availability: "Advanced",
    },
    {
      id: "bio_neural_computer",
      name: "Bio-Neural Computer Core",
      category: "Computer",
      description:
        "Revolutionary computing system using bio-neural gel packs for enhanced processing speed and decision-making capabilities.",
      requirements: {
        min_ship_class: "Intrepid",
        tech_level: 8,
        installation_time_days: 67,
      },
      effects: {
        combat_rating_bonus: 1.8,
        speed_bonus: 0.15,
        efficiency_bonus: 0.25,
        crew_capacity_change: 0,
      },
      cost: {
        duranium: 2100,
        tritanium: 3400,
        dilithium: 280,
        bioneural_gel: 800,
        credits: 950000,
      },
      availability: "Standard",
    },
    {
      id: "enhanced_warp_coils",
      name: "Enhanced Warp Coils",
      category: "Engines",
      description:
        "Improved warp coil design allowing for higher sustainable warp speeds and better fuel efficiency.",
      requirements: {
        min_ship_class: "Constitution",
        tech_level: 7,
        installation_time_days: 21,
      },
      effects: {
        combat_rating_bonus: 0.5,
        speed_bonus: 0.25,
        efficiency_bonus: 0.15,
        crew_capacity_change: 0,
      },
      cost: {
        duranium: 5600,
        tritanium: 8900,
        dilithium: 750,
        bioneural_gel: 45,
        credits: 680000,
      },
      availability: "Standard",
    },
    {
      id: "temporal_shielding",
      name: "Temporal Shielding Matrix",
      category: "Shields",
      description:
        "Experimental technology providing protection against temporal anomalies and chronoton-based weapons.",
      requirements: {
        min_ship_class: "Sovereign",
        tech_level: 10,
        installation_time_days: 89,
      },
      effects: {
        combat_rating_bonus: 1.5,
        speed_bonus: 0,
        efficiency_bonus: -0.1,
        crew_capacity_change: -8,
      },
      cost: {
        duranium: 12000,
        tritanium: 15000,
        dilithium: 1200,
        bioneural_gel: 600,
        credits: 2400000,
      },
      availability: "Experimental",
    },
    {
      id: "multi_adaptive_shields",
      name: "Multi-Adaptive Shield Array",
      category: "Shields",
      description:
        "Advanced shield technology that automatically adapts to different types of energy weapons and improves resistance over time.",
      requirements: {
        min_ship_class: "Galaxy",
        tech_level: 9,
        installation_time_days: 56,
      },
      effects: {
        combat_rating_bonus: 2.8,
        speed_bonus: 0,
        efficiency_bonus: 0.1,
        crew_capacity_change: -3,
      },
      cost: {
        duranium: 7800,
        tritanium: 9200,
        dilithium: 890,
        bioneural_gel: 340,
        credits: 1450000,
      },
      availability: "Advanced",
    },
  ];

  const shipyards: Shipyard[] = [
    {
      id: "utopia_planitia",
      name: "Utopia Planitia Shipyards",
      location: "Mars Orbit",
      capacity: 12,
      current_projects: 8,
      efficiency_rating: 95,
      specialization: "General",
      upgrades_available: ["Standard", "Advanced"],
      construction_speed_modifier: 1.2,
      resource_discount: 0.85,
    },
    {
      id: "san_francisco",
      name: "San Francisco Fleet Yards",
      location: "Earth Orbit",
      capacity: 8,
      current_projects: 5,
      efficiency_rating: 88,
      specialization: "Exploration",
      upgrades_available: ["Standard", "Advanced", "Experimental"],
      construction_speed_modifier: 1.0,
      resource_discount: 0.9,
    },
    {
      id: "beta_antares",
      name: "Beta Antares Ship Yards",
      location: "Beta Antares System",
      capacity: 6,
      current_projects: 3,
      efficiency_rating: 92,
      specialization: "Tactical",
      upgrades_available: ["Advanced", "Experimental", "Classified"],
      construction_speed_modifier: 1.1,
      resource_discount: 0.95,
    },
    {
      id: "vulcan_shipyards",
      name: "40 Eridani A Shipyards",
      location: "Vulcan System",
      capacity: 6,
      current_projects: 3,
      efficiency_rating: 97,
      specialization: "Science",
      upgrades_available: ["Standard", "Advanced"],
      construction_speed_modifier: 1.15,
      resource_discount: 0.88,
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Weapons":
        return "text-red-400 border-red-400 bg-red-400/20";
      case "Shields":
        return "text-blue-400 border-blue-400 bg-blue-400/20";
      case "Engines":
        return "text-green-400 border-green-400 bg-green-400/20";
      case "Sensors":
        return "text-purple-400 border-purple-400 bg-purple-400/20";
      case "Computer":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Life Support":
        return "text-cyan-400 border-cyan-400 bg-cyan-400/20";
      case "Structural":
        return "text-orange-400 border-orange-400 bg-orange-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Standard":
        return "text-green-400 border-green-400 bg-green-400/20";
      case "Advanced":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Experimental":
        return "text-orange-400 border-orange-400 bg-orange-400/20";
      case "Classified":
        return "text-red-400 border-red-400 bg-red-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "text-red-500 border-red-500 bg-red-500/20";
      case "High":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Normal":
        return "text-green-400 border-green-400 bg-green-400/20";
      case "Low":
        return "text-gray-400 border-gray-400 bg-gray-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  const formatCredits = (amount: number) => {
    return amount.toLocaleString() + " Credits";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          STARFLEET SHIPYARD OPERATIONS
        </h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "construction" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "construction"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("construction")}
          >
            <Ship className="w-4 h-4 mr-2" />
            Construction
          </Button>
          <Button
            variant={activeTab === "upgrades" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "upgrades"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("upgrades")}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Upgrades
          </Button>
          <Button
            variant={activeTab === "facilities" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "facilities"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("facilities")}
          >
            <Building className="w-4 h-4 mr-2" />
            Facilities
          </Button>
          <Button
            variant={activeTab === "resources" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "resources"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("resources")}
          >
            <Package className="w-4 h-4 mr-2" />
            Resources
          </Button>
        </div>
      </div>

      {activeTab === "construction" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-trek-panel border-trek-accent p-4 text-center">
              <Ship className="w-8 h-8 text-trek-blue mx-auto mb-2" />
              <div className="text-2xl font-bold text-trek-blue">
                {constructionProjects.length}
              </div>
              <div className="text-sm text-trek-text/70">Active Projects</div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-4 text-center">
              <Clock className="w-8 h-8 text-trek-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-trek-gold">234</div>
              <div className="text-sm text-trek-text/70">
                Average Days to Complete
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-4 text-center">
              <Award className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">89%</div>
              <div className="text-sm text-trek-text/70">
                On-Time Completion Rate
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {constructionProjects.map((project) => (
              <Card
                key={project.id}
                className="bg-trek-panel border-trek-accent p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Ship className="w-6 h-6 text-trek-gold" />
                    <div>
                      <h3 className="font-bold text-trek-gold text-lg">
                        {project.ship_name}
                      </h3>
                      <p className="text-trek-blue">{project.ship_class}</p>
                      <p className="text-sm text-trek-text/70">
                        {project.shipyard}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge
                      variant="secondary"
                      className={`text-xs mb-2 ${getPriorityColor(project.priority)}`}
                    >
                      {project.priority} Priority
                    </Badge>
                    <div className="text-sm">
                      <div className="text-trek-text/70">Completion</div>
                      <div className="text-trek-blue font-semibold">
                        {project.progress}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Construction Progress
                    </div>
                    <Progress value={project.progress} className="mb-1" />
                    <div className="text-xs text-trek-blue">
                      {project.current_phase}
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Estimated Completion
                    </div>
                    <div className="text-trek-blue font-semibold">
                      {project.estimated_completion_days} days
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Construction Crew
                    </div>
                    <div className="text-trek-blue font-semibold">
                      {project.construction_crew.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">Budget Used</div>
                    <div className="text-trek-gold font-semibold">
                      {(
                        (project.budget_used / project.budget_allocated) *
                        100
                      ).toFixed(0)}
                      %
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4 text-xs">
                  <div className="text-center">
                    <div className="text-trek-text/70">Duranium</div>
                    <div className="text-trek-blue">
                      {project.resources_used.duranium.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-trek-text/70">Tritanium</div>
                    <div className="text-trek-blue">
                      {project.resources_used.tritanium.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-trek-text/70">Dilithium</div>
                    <div className="text-trek-gold">
                      {project.resources_used.dilithium.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-trek-text/70">Bio-neural</div>
                    <div className="text-purple-400">
                      {project.resources_used.bioneural_gel.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Project Details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Accelerate Construction
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-warning text-trek-warning hover:bg-trek-warning hover:text-trek-dark"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Modify Schedule
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "upgrades" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shipUpgrades.map((upgrade) => (
              <Card
                key={upgrade.id}
                className={`bg-trek-panel border-trek-accent p-4 cursor-pointer transition-colors hover:border-trek-blue ${
                  selectedUpgrade?.id === upgrade.id
                    ? "border-trek-blue bg-trek-blue/5"
                    : ""
                }`}
                onClick={() => setSelectedUpgrade(upgrade)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {upgrade.category === "Weapons" && (
                      <Target className="w-5 h-5 text-red-400" />
                    )}
                    {upgrade.category === "Shields" && (
                      <Shield className="w-5 h-5 text-blue-400" />
                    )}
                    {upgrade.category === "Engines" && (
                      <Zap className="w-5 h-5 text-green-400" />
                    )}
                    {upgrade.category === "Computer" && (
                      <Cpu className="w-5 h-5 text-yellow-400" />
                    )}
                    <div>
                      <h4 className="font-bold text-trek-gold">
                        {upgrade.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getCategoryColor(upgrade.category)}`}
                        >
                          {upgrade.category}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getAvailabilityColor(upgrade.availability)}`}
                        >
                          {upgrade.availability}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-trek-text/80 mb-3">
                  {upgrade.description}
                </p>

                <div className="space-y-1 text-xs mb-3">
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Combat Bonus:</span>
                    <span className="text-red-400">
                      +{upgrade.effects.combat_rating_bonus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Speed Bonus:</span>
                    <span
                      className={
                        upgrade.effects.speed_bonus >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {upgrade.effects.speed_bonus > 0 ? "+" : ""}
                      {(upgrade.effects.speed_bonus * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Installation:</span>
                    <span className="text-trek-blue">
                      {upgrade.requirements.installation_time_days} days
                    </span>
                  </div>
                </div>

                <div className="text-xs text-trek-gold">
                  Cost: {formatCredits(upgrade.cost.credits)}
                </div>
              </Card>
            ))}
          </div>

          {selectedUpgrade && (
            <Card className="bg-trek-panel border-trek-blue p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-trek-gold" />
                <div>
                  <h3 className="text-2xl font-bold text-trek-gold">
                    {selectedUpgrade.name}
                  </h3>
                  <p className="text-trek-blue">
                    {selectedUpgrade.category} Upgrade •{" "}
                    {selectedUpgrade.availability}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Description
                  </h4>
                  <p className="text-trek-text/80">
                    {selectedUpgrade.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-trek-gold mb-2">
                      Requirements
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-trek-text/70">
                          Minimum Ship Class:
                        </span>
                        <span className="text-trek-blue">
                          {selectedUpgrade.requirements.min_ship_class}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-trek-text/70">
                          Technology Level:
                        </span>
                        <span className="text-trek-blue">
                          {selectedUpgrade.requirements.tech_level}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-trek-text/70">
                          Installation Time:
                        </span>
                        <span className="text-trek-blue">
                          {selectedUpgrade.requirements.installation_time_days}{" "}
                          days
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-trek-gold mb-2">
                      Performance Effects
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-trek-text/70">
                          Combat Rating:
                        </span>
                        <span className="text-red-400">
                          +{selectedUpgrade.effects.combat_rating_bonus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-trek-text/70">
                          Speed Modifier:
                        </span>
                        <span
                          className={
                            selectedUpgrade.effects.speed_bonus >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {selectedUpgrade.effects.speed_bonus > 0 ? "+" : ""}
                          {(selectedUpgrade.effects.speed_bonus * 100).toFixed(
                            0,
                          )}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-trek-text/70">
                          Efficiency Bonus:
                        </span>
                        <span
                          className={
                            selectedUpgrade.effects.efficiency_bonus >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {selectedUpgrade.effects.efficiency_bonus > 0
                            ? "+"
                            : ""}
                          {(
                            selectedUpgrade.effects.efficiency_bonus * 100
                          ).toFixed(0)}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-trek-text/70">Crew Impact:</span>
                        <span
                          className={
                            selectedUpgrade.effects.crew_capacity_change >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {selectedUpgrade.effects.crew_capacity_change > 0
                            ? "+"
                            : ""}
                          {selectedUpgrade.effects.crew_capacity_change}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Resource Costs
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Duranium:</span>
                      <span className="text-trek-blue">
                        {selectedUpgrade.cost.duranium.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Tritanium:</span>
                      <span className="text-trek-blue">
                        {selectedUpgrade.cost.tritanium.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Dilithium:</span>
                      <span className="text-trek-gold">
                        {selectedUpgrade.cost.dilithium.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Bio-neural Gel:</span>
                      <span className="text-purple-400">
                        {selectedUpgrade.cost.bioneural_gel.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Credits:</span>
                      <span className="text-trek-gold">
                        {formatCredits(selectedUpgrade.cost.credits)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-trek-accent">
                  <div className="flex gap-2">
                    <Button className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Install Upgrade
                    </Button>
                    <Button
                      variant="outline"
                      className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Research Requirements
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === "facilities" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shipyards.map((shipyard) => (
            <Card
              key={shipyard.id}
              className="bg-trek-panel border-trek-accent p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Building className="w-6 h-6 text-trek-gold" />
                  <div>
                    <h3 className="font-bold text-trek-gold text-lg">
                      {shipyard.name}
                    </h3>
                    <p className="text-trek-blue">{shipyard.location}</p>
                    <Badge
                      variant="secondary"
                      className={`text-xs mt-1 ${getCategoryColor(shipyard.specialization)}`}
                    >
                      {shipyard.specialization} Specialist
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-trek-text/70">
                      Capacity Utilization
                    </span>
                    <span className="text-trek-blue">
                      {shipyard.current_projects}/{shipyard.capacity}
                    </span>
                  </div>
                  <Progress
                    value={
                      (shipyard.current_projects / shipyard.capacity) * 100
                    }
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-trek-text/70">Efficiency Rating</span>
                    <span className="text-trek-blue">
                      {shipyard.efficiency_rating}%
                    </span>
                  </div>
                  <Progress
                    value={shipyard.efficiency_rating}
                    className="h-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Speed Bonus:</span>
                    <span className="text-green-400">
                      +
                      {(
                        (shipyard.construction_speed_modifier - 1) *
                        100
                      ).toFixed(0)}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Cost Reduction:</span>
                    <span className="text-green-400">
                      {((1 - shipyard.resource_discount) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Available Upgrades
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {shipyard.upgrades_available.map((upgrade, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className={`text-xs ${getAvailabilityColor(upgrade)}`}
                      >
                        {upgrade}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-trek-accent">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                  >
                    <Ship className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Upgrade Facility
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "resources" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card className="bg-trek-panel border-trek-accent p-4 text-center">
              <Package className="w-8 h-8 text-trek-blue mx-auto mb-2" />
              <div className="text-xl font-bold text-trek-blue">
                {resourceInventory.duranium.toLocaleString()}
              </div>
              <div className="text-sm text-trek-text/70">Duranium (tons)</div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-4 text-center">
              <Package className="w-8 h-8 text-trek-blue mx-auto mb-2" />
              <div className="text-xl font-bold text-trek-blue">
                {resourceInventory.tritanium.toLocaleString()}
              </div>
              <div className="text-sm text-trek-text/70">Tritanium (tons)</div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-4 text-center">
              <Star className="w-8 h-8 text-trek-gold mx-auto mb-2" />
              <div className="text-xl font-bold text-trek-gold">
                {resourceInventory.dilithium.toLocaleString()}
              </div>
              <div className="text-sm text-trek-text/70">
                Dilithium Crystals
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-4 text-center">
              <Cpu className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-purple-400">
                {resourceInventory.bioneural_gel.toLocaleString()}
              </div>
              <div className="text-sm text-trek-text/70">
                Bio-neural Gel (units)
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-4 text-center">
              <Star className="w-8 h-8 text-trek-gold mx-auto mb-2" />
              <div className="text-xl font-bold text-trek-gold">
                {formatCredits(resourceInventory.credits)}
              </div>
              <div className="text-sm text-trek-text/70">
                Federation Credits
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-4 text-center">
              <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-cyan-400">
                {resourceInventory.antimatter.toLocaleString()}
              </div>
              <div className="text-sm text-trek-text/70">Antimatter (pods)</div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-4 text-center">
              <Target className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-orange-400">
                {resourceInventory.quantum_resonators.toLocaleString()}
              </div>
              <div className="text-sm text-trek-text/70">
                Quantum Resonators
              </div>
            </Card>
          </div>

          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-4">
              Resource Acquisition
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-trek-blue mb-3">
                  Mining Operations
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Asteroid Belt Mining</span>
                    <span className="text-trek-blue">+2,400 tons/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Planetary Extraction</span>
                    <span className="text-trek-blue">+1,800 tons/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deep Space Harvesting</span>
                    <span className="text-trek-blue">+950 tons/day</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-trek-blue mb-3">
                  Trade Routes
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Vulcan Trade Consortium</span>
                    <span className="text-trek-gold">+15% efficiency</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Andorian Mining Guild</span>
                    <span className="text-trek-gold">+850 dilithium/week</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tellarite Suppliers</span>
                    <span className="text-trek-gold">-12% costs</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
