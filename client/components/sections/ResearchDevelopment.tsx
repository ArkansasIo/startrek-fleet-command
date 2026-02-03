import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Beaker,
  Cpu,
  Zap,
  Rocket,
  Shield,
  Target,
  Radio,
  HeartPulse,
  Cog,
  Database,
  Microscope,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Info,
  Star,
  Award,
  TrendingUp,
  Building,
  Wrench,
  Settings,
  FlaskConical,
  CircuitBoard,
  Atom,
  Users,
  Calendar,
  Timer,
  AlertTriangle,
} from "lucide-react";

interface ResearchDevelopmentProps {
  activeSubmenu?: string;
}

interface ResearchCategory {
  id: string;
  category_name: string;
  category_code: string;
  description: string;
  icon_name: string;
  color_scheme: string;
  required_profession_id: string;
  profession_name: string;
  project_count: number;
}

interface ResearchProject {
  id: string;
  project_name: string;
  project_description: string;
  detailed_description: string;
  project_type: string;
  tier_level: number;
  research_time_hours: number;
  resource_requirements: Record<string, number>;
  prerequisite_projects: string[];
  prerequisite_talents: string[];
  unlock_requirements: Record<string, any>;
  success_rate: number;
  critical_success_rate: number;
  rewards: Record<string, any>;
  rarity: string;
  player_status: string;
  completed_at: string;
}

interface ActiveResearch {
  id: string;
  project_id: string;
  project_name: string;
  project_description: string;
  project_type: string;
  category_name: string;
  color_scheme: string;
  status: string;
  progress_percentage: number;
  started_at: string;
  estimated_completion: string;
  hours_remaining: number;
  quality_modifier: number;
}

interface CraftingStation {
  id: string;
  station_name: string;
  station_type: string;
  description: string;
  efficiency_modifier: number;
  max_concurrent_projects: number;
  power_requirements: number;
  crew_requirements: number;
  current_level: number;
  is_active: boolean;
}

export function ResearchDevelopment({
  activeSubmenu,
}: ResearchDevelopmentProps) {
  const normalizeSubmenu = (submenu?: string) => {
    const map: Record<string, string> = {
      research_projects: "research",
      active_research: "active",
      research_stations: "stations",
      technologies: "technologies",
      crafting: "stations",
    };
    return map[submenu || ""] || "research";
  };

  const [activeTab, setActiveTab] = useState(normalizeSubmenu(activeSubmenu));
  const [categories, setCategories] = useState<ResearchCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [activeResearch, setActiveResearch] = useState<ActiveResearch[]>([]);
  const [craftingStations, setCraftingStations] = useState<CraftingStation[]>(
    [],
  );
  const [selectedProject, setSelectedProject] =
    useState<ResearchProject | null>(null);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setActiveTab(normalizeSubmenu(activeSubmenu));
  }, [activeSubmenu]);

  // Mock player ID
  const playerId = "player-1";

  useEffect(() => {
    loadResearchData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadCategoryProjects();
    }
  }, [selectedCategory]);

  const loadResearchData = async () => {
    try {
      setIsLoading(true);

      // Mock research categories
      const mockCategories: ResearchCategory[] = [
        {
          id: "cat-1",
          category_name: "Starship Engineering",
          category_code: "SHIP_ENG",
          description: "Advanced starship systems and propulsion",
          icon_name: "rocket",
          color_scheme: "yellow",
          required_profession_id: "prof-1",
          profession_name: "Engineering",
          project_count: 12,
        },
        {
          id: "cat-2",
          category_name: "Weapons Technology",
          category_code: "WEAPONS",
          description: "Phaser arrays, torpedoes, and defensive systems",
          icon_name: "zap",
          color_scheme: "red",
          required_profession_id: "prof-4",
          profession_name: "Tactical",
          project_count: 8,
        },
        {
          id: "cat-3",
          category_name: "Medical Research",
          category_code: "MEDICAL",
          description: "Biotechnology and advanced medical procedures",
          icon_name: "heart-pulse",
          color_scheme: "cyan",
          required_profession_id: "prof-3",
          profession_name: "Medical",
          project_count: 10,
        },
        {
          id: "cat-4",
          category_name: "Physics Research",
          category_code: "PHYSICS",
          description: "Theoretical and applied physics discoveries",
          icon_name: "atom",
          color_scheme: "blue",
          required_profession_id: "prof-2",
          profession_name: "Science",
          project_count: 15,
        },
        {
          id: "cat-5",
          category_name: "Computer Sciences",
          category_code: "COMP_SCI",
          description: "AI, data processing, and cybernetics",
          icon_name: "cpu",
          color_scheme: "green",
          required_profession_id: "prof-2",
          profession_name: "Science",
          project_count: 9,
        },
      ];

      // Mock active research
      const mockActiveResearch: ActiveResearch[] = [
        {
          id: "active-1",
          project_id: "proj-1",
          project_name: "Enhanced Warp Coils",
          project_description: "Improved efficiency warp coil design",
          project_type: "technology",
          category_name: "Starship Engineering",
          color_scheme: "yellow",
          status: "in_progress",
          progress_percentage: 65,
          started_at: "2024-12-09T10:00:00Z",
          estimated_completion: "2024-12-12T14:00:00Z",
          hours_remaining: 28.5,
          quality_modifier: 1.2,
        },
        {
          id: "active-2",
          project_id: "proj-8",
          project_name: "Quantum Torpedoes Mark VI",
          project_description: "Next generation quantum torpedo warheads",
          project_type: "equipment",
          category_name: "Weapons Technology",
          color_scheme: "red",
          status: "in_progress",
          progress_percentage: 25,
          started_at: "2024-12-10T08:00:00Z",
          estimated_completion: "2024-12-15T20:00:00Z",
          hours_remaining: 132,
          quality_modifier: 1.0,
        },
      ];

      // Mock crafting stations
      const mockStations: CraftingStation[] = [
        {
          id: "station-1",
          station_name: "Industrial Replicator",
          station_type: "replicator",
          description: "Advanced matter synthesis for complex components",
          efficiency_modifier: 1.0,
          max_concurrent_projects: 3,
          power_requirements: 150,
          crew_requirements: 1,
          current_level: 2,
          is_active: true,
        },
        {
          id: "station-2",
          station_name: "Science Laboratory",
          station_type: "laboratory",
          description: "Research and development facility",
          efficiency_modifier: 1.5,
          max_concurrent_projects: 1,
          power_requirements: 100,
          crew_requirements: 3,
          current_level: 3,
          is_active: true,
        },
        {
          id: "station-3",
          station_name: "Engineering Fabricator",
          station_type: "fabricator",
          description: "Precision manufacturing for starship components",
          efficiency_modifier: 1.2,
          max_concurrent_projects: 2,
          power_requirements: 200,
          crew_requirements: 2,
          current_level: 1,
          is_active: false,
        },
      ];

      setCategories(mockCategories);
      setActiveResearch(mockActiveResearch);
      setCraftingStations(mockStations);

      if (mockCategories.length > 0) {
        setSelectedCategory(mockCategories[0].id);
      }
    } catch (error) {
      console.error("Error loading research data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategoryProjects = async () => {
    if (!selectedCategory) return;

    try {
      // Mock projects for the selected category
      const mockProjects: ResearchProject[] = [
        {
          id: "proj-1",
          project_name: "Enhanced Warp Coils",
          project_description: "Improved efficiency warp coil design",
          detailed_description:
            "Development of next-generation warp coils with enhanced field stability and 15% improved efficiency over standard coils.",
          project_type: "technology",
          tier_level: 3,
          research_time_hours: 72,
          resource_requirements: {
            dilithium: 50,
            duranium: 25,
            quantum_resonators: 5,
          },
          prerequisite_projects: ["proj-0"],
          prerequisite_talents: [],
          unlock_requirements: { min_level: 5 },
          success_rate: 0.85,
          critical_success_rate: 0.15,
          rewards: {
            experience: 500,
            technology: "warp_coil_mk3",
            resources: { energy_credits: 1000 },
          },
          rarity: "uncommon",
          player_status: "in_progress",
          completed_at: "",
        },
        {
          id: "proj-2",
          project_name: "Improved EPS Grid",
          project_description: "Enhanced electro-plasma system efficiency",
          detailed_description:
            "Optimization of the ship's electro-plasma system for better power distribution and reduced energy loss.",
          project_type: "ship_component",
          tier_level: 2,
          research_time_hours: 48,
          resource_requirements: {
            plasma: 30,
            isolinear_chips: 10,
          },
          prerequisite_projects: [],
          prerequisite_talents: ["talent-eng-basic"],
          unlock_requirements: {},
          success_rate: 0.9,
          critical_success_rate: 0.1,
          rewards: {
            experience: 300,
            resources: { energy_credits: 750 },
          },
          rarity: "common",
          player_status: "not_started",
          completed_at: "",
        },
        {
          id: "proj-3",
          project_name: "Quantum Phase Discriminator",
          project_description: "Advanced sensor enhancement technology",
          detailed_description:
            "Cutting-edge sensor technology capable of detecting cloaked vessels and phase-shifted phenomena.",
          project_type: "equipment",
          tier_level: 8,
          research_time_hours: 168,
          resource_requirements: {
            quantum_resonators: 25,
            tritanium: 40,
            biomass: 15,
          },
          prerequisite_projects: ["proj-1", "proj-4"],
          prerequisite_talents: ["talent-sci-advanced"],
          unlock_requirements: { min_level: 15, reputation: 8000 },
          success_rate: 0.6,
          critical_success_rate: 0.05,
          rewards: {
            experience: 2000,
            technology: "quantum_sensor_mk5",
            resources: { energy_credits: 5000 },
          },
          rarity: "very_rare",
          player_status: "not_started",
          completed_at: "",
        },
      ];

      setProjects(mockProjects);
    } catch (error) {
      console.error("Error loading category projects:", error);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      rocket: <Rocket className="w-5 h-5" />,
      zap: <Zap className="w-5 h-5" />,
      "heart-pulse": <HeartPulse className="w-5 h-5" />,
      atom: <Atom className="w-5 h-5" />,
      cpu: <Cpu className="w-5 h-5" />,
      shield: <Shield className="w-5 h-5" />,
      radio: <Radio className="w-5 h-5" />,
      microscope: <Microscope className="w-5 h-5" />,
    };
    return iconMap[iconName] || <Beaker className="w-5 h-5" />;
  };

  const getStationIcon = (stationType: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      replicator: <CircuitBoard className="w-5 h-5" />,
      laboratory: <FlaskConical className="w-5 h-5" />,
      fabricator: <Wrench className="w-5 h-5" />,
      workshop: <Settings className="w-5 h-5" />,
      shipyard: <Building className="w-5 h-5" />,
    };
    return iconMap[stationType] || <Cog className="w-5 h-5" />;
  };

  const getColorClass = (
    color: string,
    type: "bg" | "border" | "text" = "bg",
  ) => {
    const colorMap: Record<string, Record<string, string>> = {
      yellow: {
        bg: "bg-yellow-500",
        border: "border-yellow-500",
        text: "text-yellow-500",
      },
      blue: {
        bg: "bg-blue-500",
        border: "border-blue-500",
        text: "text-blue-500",
      },
      red: {
        bg: "bg-red-500",
        border: "border-red-500",
        text: "text-red-500",
      },
      green: {
        bg: "bg-green-500",
        border: "border-green-500",
        text: "text-green-500",
      },
      purple: {
        bg: "bg-purple-500",
        border: "border-purple-500",
        text: "text-purple-500",
      },
      orange: {
        bg: "bg-orange-500",
        border: "border-orange-500",
        text: "text-orange-500",
      },
      cyan: {
        bg: "bg-cyan-500",
        border: "border-cyan-500",
        text: "text-cyan-500",
      },
    };
    return colorMap[color]?.[type] || colorMap.blue[type];
  };

  const getRarityColor = (rarity: string) => {
    const rarityColors: Record<string, string> = {
      common: "text-gray-400",
      uncommon: "text-green-400",
      rare: "text-blue-400",
      very_rare: "text-purple-400",
      ultra_rare: "text-orange-400",
      epic: "text-red-400",
      legendary: "text-yellow-400",
    };
    return rarityColors[rarity] || "text-gray-400";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "paused":
        return <Pause className="w-4 h-4 text-yellow-500" />;
      default:
        return <Play className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimeRemaining = (hours: number): string => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${Math.round(hours)}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return `${days}d ${remainingHours}h`;
  };

  const handleStartProject = async (project: ResearchProject) => {
    try {
      // TODO: Replace with actual API call
      console.log("Starting project:", project.project_name);
      setShowProjectDialog(false);
      // Reload active research
      await loadResearchData();
    } catch (error) {
      console.error("Error starting project:", error);
    }
  };

  const handleCancelResearch = async (researchId: string) => {
    try {
      // TODO: Replace with actual API call
      console.log("Canceling research:", researchId);
      await loadResearchData();
    } catch (error) {
      console.error("Error canceling research:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-trek-text">Loading research data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-trek-panel/80 border-trek-accent">
        <CardHeader>
          <CardTitle className="text-trek-gold flex items-center gap-3">
            <Beaker className="w-6 h-6" />
            Research & Development
          </CardTitle>
          <CardDescription className="text-trek-text/80">
            Advance your knowledge and develop new technologies through
            scientific research
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-trek-dark border border-trek-accent">
          <TabsTrigger
            value="research"
            className="data-[state=active]:bg-trek-accent"
          >
            <Microscope className="w-4 h-4 mr-2" />
            Research Projects
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-trek-accent"
          >
            <Clock className="w-4 h-4 mr-2" />
            Active Research
            {activeResearch.length > 0 && (
              <Badge className="ml-2 bg-trek-blue text-white">
                {activeResearch.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="stations"
            className="data-[state=active]:bg-trek-accent"
          >
            <Building className="w-4 h-4 mr-2" />
            Research Stations
          </TabsTrigger>
          <TabsTrigger
            value="technologies"
            className="data-[state=active]:bg-trek-accent"
          >
            <Database className="w-4 h-4 mr-2" />
            Technologies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="research" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Categories Sidebar */}
            <Card className="bg-trek-panel/50 border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold text-lg">
                  Research Fields
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    className={`w-full justify-start ${
                      selectedCategory === category.id
                        ? `${getColorClass(category.color_scheme)} text-white`
                        : "border-trek-accent text-trek-text hover:bg-trek-accent/20"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {getCategoryIcon(category.icon_name)}
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-sm">
                          {category.category_name}
                        </div>
                        <div className="text-xs opacity-80">
                          {category.project_count} projects
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Projects List */}
            <div className="lg:col-span-3 space-y-4">
              {selectedCategory && (
                <>
                  <Card className="bg-trek-panel/50 border-trek-accent">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-trek-gold">
                            {
                              categories.find((c) => c.id === selectedCategory)
                                ?.category_name
                            }
                          </h3>
                          <p className="text-trek-text/80">
                            {
                              categories.find((c) => c.id === selectedCategory)
                                ?.description
                            }
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-trek-accent text-trek-accent"
                        >
                          {projects.length} Available
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {projects.map((project) => (
                        <Card
                          key={project.id}
                          className="bg-trek-dark/50 border-trek-accent hover:bg-trek-dark/70 transition-colors"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold text-trek-gold">
                                    {project.project_name}
                                  </h4>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${getRarityColor(project.rarity)} border-current`}
                                  >
                                    {project.rarity}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="text-xs border-trek-blue text-trek-blue"
                                  >
                                    Tier {project.tier_level}
                                  </Badge>
                                  {getStatusIcon(project.player_status)}
                                </div>
                                <p className="text-sm text-trek-text/80 mb-2">
                                  {project.project_description}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-trek-text/60">
                                  <span className="flex items-center gap-1">
                                    <Timer className="w-3 h-3" />
                                    {project.research_time_hours}h
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    {Math.round(project.success_rate * 100)}%
                                    success
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    {Math.round(
                                      project.critical_success_rate * 100,
                                    )}
                                    % critical
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedProject(project);
                                    setShowProjectDialog(true);
                                  }}
                                  className="bg-trek-blue hover:bg-trek-blue/80"
                                >
                                  <Info className="w-3 h-3 mr-1" />
                                  Details
                                </Button>
                                {project.player_status === "not_started" && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleStartProject(project)}
                                    className="bg-trek-gold hover:bg-trek-gold/80 text-trek-dark"
                                  >
                                    <Play className="w-3 h-3 mr-1" />
                                    Start
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activeResearch.length === 0 ? (
            <Card className="bg-trek-dark/30 border-trek-accent">
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 mx-auto text-trek-accent/50 mb-4" />
                <p className="text-trek-text/60">No active research projects</p>
                <p className="text-sm text-trek-text/40 mt-2">
                  Start a research project to begin developing new technologies
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeResearch.map((research) => (
                <Card
                  key={research.id}
                  className="bg-trek-panel/50 border-trek-accent"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-trek-gold">
                          {research.project_name}
                        </h3>
                        <p className="text-trek-text/80">
                          {research.project_description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <Badge
                            variant="outline"
                            className={`${getColorClass(research.color_scheme, "border")} ${getColorClass(research.color_scheme, "text")}`}
                          >
                            {research.category_name}
                          </Badge>
                          <span className="text-trek-text/60">
                            {formatTimeRemaining(research.hours_remaining)}{" "}
                            remaining
                          </span>
                          {research.quality_modifier > 1.0 && (
                            <span className="text-green-400 text-xs">
                              +
                              {Math.round(
                                (research.quality_modifier - 1) * 100,
                              )}
                              % quality
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/20"
                        >
                          <Pause className="w-3 h-3 mr-1" />
                          Pause
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-500/20"
                          onClick={() => handleCancelResearch(research.id)}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-trek-text/60">Progress</span>
                        <span className="text-trek-text">
                          {Math.round(research.progress_percentage)}%
                        </span>
                      </div>
                      <Progress
                        value={research.progress_percentage}
                        className="h-2 bg-trek-dark border border-trek-accent"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="stations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {craftingStations.map((station) => (
              <Card
                key={station.id}
                className={`bg-trek-panel/50 border-trek-accent ${!station.is_active ? "opacity-60" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {getStationIcon(station.station_type)}
                    <div>
                      <h3 className="font-semibold text-trek-gold">
                        {station.station_name}
                      </h3>
                      <p className="text-xs text-trek-text/60 capitalize">
                        {station.station_type}
                      </p>
                    </div>
                    {!station.is_active && (
                      <AlertTriangle className="w-4 h-4 text-yellow-500 ml-auto" />
                    )}
                  </div>

                  <p className="text-sm text-trek-text/80 mb-3">
                    {station.description}
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-trek-text/60">Level</span>
                      <span className="text-trek-text">
                        {station.current_level}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/60">Efficiency</span>
                      <span className="text-green-400">
                        +{Math.round((station.efficiency_modifier - 1) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/60">
                        Concurrent Projects
                      </span>
                      <span className="text-trek-text">
                        {station.max_concurrent_projects}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/60">Power Required</span>
                      <span className="text-trek-text">
                        {station.power_requirements}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/60">Crew Required</span>
                      <span className="text-trek-text">
                        {station.crew_requirements}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {!station.is_active ? (
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Activate
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-trek-accent text-trek-text"
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        Configure
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-trek-blue text-trek-blue"
                    >
                      <TrendingUp className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="technologies" className="space-y-4">
          <Card className="bg-trek-dark/30 border-trek-accent">
            <CardContent className="p-6 text-center">
              <Database className="w-12 h-12 mx-auto text-trek-accent/50 mb-4" />
              <p className="text-trek-text/60">
                Technology database coming soon
              </p>
              <p className="text-sm text-trek-text/40 mt-2">
                View and manage unlocked technologies and their applications
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Project Detail Dialog */}
      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
        <DialogContent className="bg-trek-panel border-trek-accent max-w-3xl">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-trek-gold flex items-center gap-3">
                  <Beaker className="w-6 h-6" />
                  {selectedProject.project_name}
                  <Badge
                    variant="outline"
                    className={`${getRarityColor(selectedProject.rarity)} border-current`}
                  >
                    {selectedProject.rarity}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-trek-text/80">
                  {selectedProject.detailed_description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Project Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-trek-blue">
                      {selectedProject.tier_level}
                    </div>
                    <div className="text-xs text-trek-text/60">Tier Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-trek-gold">
                      {selectedProject.research_time_hours}h
                    </div>
                    <div className="text-xs text-trek-text/60">
                      Research Time
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {Math.round(selectedProject.success_rate * 100)}%
                    </div>
                    <div className="text-xs text-trek-text/60">
                      Success Rate
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {Math.round(selectedProject.critical_success_rate * 100)}%
                    </div>
                    <div className="text-xs text-trek-text/60">
                      Critical Rate
                    </div>
                  </div>
                </div>

                {/* Resource Requirements */}
                {Object.keys(selectedProject.resource_requirements).length >
                  0 && (
                  <div>
                    <Label className="text-trek-text">
                      Resource Requirements
                    </Label>
                    <div className="bg-trek-dark/50 p-3 rounded border border-trek-accent/30 mt-1">
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(
                          selectedProject.resource_requirements,
                        ).map(([resource, amount]) => (
                          <div
                            key={resource}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-trek-text/80 capitalize">
                              {resource.replace(/_/g, " ")}
                            </span>
                            <span className="text-trek-text">{amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Prerequisites */}
                {selectedProject.prerequisite_projects.length > 0 && (
                  <div>
                    <Label className="text-trek-text">Prerequisites</Label>
                    <div className="bg-trek-dark/50 p-3 rounded border border-trek-accent/30 mt-1">
                      <div className="text-sm text-trek-text/80">
                        {selectedProject.prerequisite_projects.length}{" "}
                        prerequisite project(s) required
                      </div>
                    </div>
                  </div>
                )}

                {/* Rewards */}
                {selectedProject.rewards &&
                  Object.keys(selectedProject.rewards).length > 0 && (
                    <div>
                      <Label className="text-trek-text">Rewards</Label>
                      <div className="bg-trek-dark/50 p-3 rounded border border-trek-accent/30 mt-1">
                        {Object.entries(selectedProject.rewards).map(
                          ([rewardType, rewardData]) => (
                            <div
                              key={rewardType}
                              className="text-sm text-trek-text/80"
                            >
                              {rewardType === "experience" && (
                                <span className="text-blue-400">
                                  +{rewardData} Experience Points
                                </span>
                              )}
                              {rewardType === "technology" && (
                                <span className="text-yellow-400">
                                  Unlocks: {rewardData}
                                </span>
                              )}
                              {rewardType === "resources" && (
                                <span className="text-green-400">
                                  Resources:{" "}
                                  {Object.entries(
                                    rewardData as Record<string, number>,
                                  )
                                    .map(
                                      ([r, a]) =>
                                        `${a} ${r.replace(/_/g, " ")}`,
                                    )
                                    .join(", ")}
                                </span>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t border-trek-accent/30">
                  <Button
                    variant="outline"
                    onClick={() => setShowProjectDialog(false)}
                  >
                    Close
                  </Button>
                  {selectedProject.player_status === "not_started" && (
                    <Button
                      onClick={() => handleStartProject(selectedProject)}
                      className="bg-trek-gold hover:bg-trek-gold/80 text-trek-dark"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Research
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
