import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Compass,
  MapPin,
  Star,
  Radio,
  Search as SearchIcon,
  Beaker,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Zap,
  Globe,
  Eye,
  Database,
  Award,
  Map,
  Satellite,
  Search,
  Target,
  Package,
} from "lucide-react";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type DiscoveryType = "planet" | "anomaly" | "artifact" | "species" | "resource" | "phenomena" | "derelict" | "nebula";
type ExplorationStatus = "unexplored" | "scanning" | "discovered" | "investigated";
type RarityLevel = "common" | "uncommon" | "rare" | "epic" | "legendary";

interface UnchartedRegion {
  id: string;
  name: string;
  sector: string;
  coordinates: { x: number; y: number };
  danger_level: 1 | 2 | 3 | 4 | 5;
  status: ExplorationStatus;
  scan_progress: number;
  estimated_scan_time_hours: number;
  potential_discoveries: number;
  description: string;
}

interface Discovery {
  id: string;
  name: string;
  type: DiscoveryType;
  rarity: RarityLevel;
  region_id: string;
  discovered_at: Date;
  description: string;
  science_data: {
    classification: string;
    significance: string;
    research_value: number;
  };
  rewards: {
    credits?: number;
    experience?: number;
    research_points?: number;
    resources?: { [key: string]: number };
    technology_unlock?: string;
  };
  lore: string;
}

interface ActiveScan {
  id: string;
  region: UnchartedRegion;
  ship_name: string;
  progress: number;
  started_at: Date;
  estimated_completion: Date;
  crew_skill_bonus: number;
}

interface ExplorationMilestone {
  id: string;
  name: string;
  description: string;
  requirement: number;
  current_progress: number;
  completed: boolean;
  reward: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ExplorationDiscoveryUI() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [playerExperience] = useState<number>(125000);
  const [explorerRank] = useState<string>("Commander");
  const [discoveryCount] = useState<number>(47);

  const [unchartedRegions, setUnchartedRegions] = useState<UnchartedRegion[]>([
    {
      id: "region_001",
      name: "The Paulson Nebula",
      sector: "Beta Quadrant",
      coordinates: { x: 450, y: 320 },
      danger_level: 3,
      status: "unexplored",
      scan_progress: 0,
      estimated_scan_time_hours: 8,
      potential_discoveries: 12,
      description: "A vast stellar nursery with unusual electromagnetic properties. Long-range sensors detect multiple anomalies.",
    },
    {
      id: "region_002",
      name: "Gamma 7 Sector",
      sector: "Gamma Quadrant",
      coordinates: { x: 680, y: 150 },
      danger_level: 5,
      status: "scanning",
      scan_progress: 35,
      estimated_scan_time_hours: 12,
      potential_discoveries: 18,
      description: "Uncharted space near the galactic rim. Reports indicate unusual spatial phenomena and possible ancient ruins.",
    },
    {
      id: "region_003",
      name: "Mutara Sector",
      sector: "Alpha Quadrant",
      coordinates: { x: 220, y: 480 },
      danger_level: 2,
      status: "discovered",
      scan_progress: 100,
      estimated_scan_time_hours: 0,
      potential_discoveries: 8,
      description: "A sector containing several Class-M planets and abundant natural resources. Initial scans completed.",
    },
    {
      id: "region_004",
      name: "The Briar Patch",
      sector: "Alpha Quadrant",
      coordinates: { x: 380, y: 290 },
      danger_level: 4,
      status: "unexplored",
      scan_progress: 0,
      estimated_scan_time_hours: 10,
      potential_discoveries: 15,
      description: "A region of space with metaphasic radiation that interferes with sensors. Potential regenerative properties detected.",
    },
    {
      id: "region_005",
      name: "Uncharted Delta Expanse",
      sector: "Delta Quadrant",
      coordinates: { x: 920, y: 760 },
      danger_level: 5,
      status: "unexplored",
      scan_progress: 0,
      estimated_scan_time_hours: 16,
      potential_discoveries: 25,
      description: "A completely unexplored region far from Federation space. Long-range probes suggest extraordinary discoveries await.",
    },
    {
      id: "region_006",
      name: "The Badlands",
      sector: "Alpha Quadrant",
      coordinates: { x: 305, y: 415 },
      danger_level: 4,
      status: "investigated",
      scan_progress: 100,
      estimated_scan_time_hours: 0,
      potential_discoveries: 10,
      description: "A treacherous region with plasma storms and spatial anomalies. Fully charted but dangerous to navigate.",
    },
  ]);

  const [discoveries, setDiscoveries] = useState<Discovery[]>([
    {
      id: "disc_001",
      name: "Ancient Iconian Gateway",
      type: "artifact",
      rarity: "legendary",
      region_id: "region_006",
      discovered_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      description: "A functional Iconian gateway capable of instantaneous transport across vast distances.",
      science_data: {
        classification: "Ancient Technology",
        significance: "Major Archaeological Find",
        research_value: 15000,
      },
      rewards: {
        credits: 500000,
        experience: 10000,
        research_points: 5000,
        technology_unlock: "Gateway Technology",
      },
      lore: "The Iconians were an advanced civilization that vanished 200,000 years ago. Their gateway technology remains one of the most sophisticated achievements in known history.",
    },
    {
      id: "disc_002",
      name: "Protomatter Nebula",
      type: "phenomena",
      rarity: "epic",
      region_id: "region_003",
      discovered_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      description: "A nebula containing high concentrations of protomatter, a rare and unstable substance with incredible energy potential.",
      science_data: {
        classification: "Stellar Phenomenon",
        significance: "Scientific Breakthrough",
        research_value: 8000,
      },
      rewards: {
        credits: 250000,
        experience: 5000,
        research_points: 3000,
        resources: { "Protomatter": 50, "Plasma": 200 },
      },
      lore: "Protomatter was once used in the Genesis Project. While unstable, it could revolutionize energy generation and terraforming.",
    },
    {
      id: "disc_003",
      name: "Uncontacted Species: Tamarians",
      type: "species",
      rarity: "rare",
      region_id: "region_003",
      discovered_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      description: "A spacefaring species that communicates entirely through metaphor and historical allegory.",
      science_data: {
        classification: "Intelligent Species",
        significance: "First Contact",
        research_value: 10000,
      },
      rewards: {
        credits: 150000,
        experience: 8000,
        research_points: 4000,
      },
      lore: "Darmok and Jalad at Tanagra. The Tamarians represent a unique challenge in universal translation and cultural exchange.",
    },
    {
      id: "disc_004",
      name: "Class-M Planet: Eden Prime",
      type: "planet",
      rarity: "uncommon",
      region_id: "region_003",
      discovered_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      description: "A lush, habitable world with Earth-like conditions and no indigenous sapient life.",
      science_data: {
        classification: "Class-M Planet",
        significance: "Colonization Candidate",
        research_value: 3000,
      },
      rewards: {
        credits: 100000,
        experience: 2000,
        research_points: 1000,
      },
      lore: "Class-M planets capable of supporting human life are rare. This world could become a thriving colony.",
    },
    {
      id: "disc_005",
      name: "Derelict Klingon Warship",
      type: "derelict",
      rarity: "rare",
      region_id: "region_006",
      discovered_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      description: "An abandoned D7-class battlecruiser drifting in space. The crew is missing, but the ship is largely intact.",
      science_data: {
        classification: "Salvage Operation",
        significance: "Technology Recovery",
        research_value: 5000,
      },
      rewards: {
        credits: 80000,
        experience: 3000,
        resources: { "Tritanium": 150, "Dilithium": 80 },
      },
      lore: "The ship's logs are corrupted, but evidence suggests the crew abandoned ship after encountering an unknown phenomenon.",
    },
  ]);

  const [activeScans, setActiveScans] = useState<ActiveScan[]>([
    {
      id: "scan_001",
      region: unchartedRegions[1], // Gamma 7 Sector
      ship_name: "USS Voyager",
      progress: 35,
      started_at: new Date(Date.now() - 4 * 60 * 60 * 1000),
      estimated_completion: new Date(Date.now() + 8 * 60 * 60 * 1000),
      crew_skill_bonus: 15,
    },
  ]);

  const [explorationMilestones] = useState<ExplorationMilestone[]>([
    {
      id: "milestone_001",
      name: "Stellar Cartographer",
      description: "Discover 10 uncharted regions",
      requirement: 10,
      current_progress: 6,
      completed: false,
      reward: "+5000 Research Points",
    },
    {
      id: "milestone_002",
      name: "First Contact Specialist",
      description: "Make first contact with 5 new species",
      requirement: 5,
      current_progress: 3,
      completed: false,
      reward: "Diplomatic Relations Bonus",
    },
    {
      id: "milestone_003",
      name: "Archaeologist",
      description: "Discover 15 ancient artifacts",
      requirement: 15,
      current_progress: 8,
      completed: false,
      reward: "Ancient Technology Research",
    },
    {
      id: "milestone_004",
      name: "Pioneer",
      description: "Explore 50 sectors",
      requirement: 50,
      current_progress: 47,
      completed: false,
      reward: "Explorer's Medal",
    },
    {
      id: "milestone_005",
      name: "Scientific Excellence",
      description: "Accumulate 100,000 research points",
      requirement: 100000,
      current_progress: 78500,
      completed: false,
      reward: "Advanced Science Lab",
    },
  ]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const explorationStats = useMemo(() => {
    const totalRegions = unchartedRegions.length;
    const unexplored = unchartedRegions.filter((r) => r.status === "unexplored").length;
    const scanning = unchartedRegions.filter((r) => r.status === "scanning").length;
    const discovered = unchartedRegions.filter((r) => r.status === "discovered" || r.status === "investigated").length;

    const discoveryTypeCount: { [key in DiscoveryType]: number } = {
      planet: 0,
      anomaly: 0,
      artifact: 0,
      species: 0,
      resource: 0,
      phenomena: 0,
      derelict: 0,
      nebula: 0,
    };

    discoveries.forEach((d) => {
      discoveryTypeCount[d.type]++;
    });

    const totalResearchValue = discoveries.reduce((sum, d) => sum + d.science_data.research_value, 0);

    return {
      totalRegions,
      unexplored,
      scanning,
      discovered,
      discoveryTypeCount,
      totalResearchValue,
      totalDiscoveries: discoveries.length,
    };
  }, [unchartedRegions, discoveries]);

  const selectedRegion = useMemo(() => {
    return unchartedRegions.find((r) => r.id === selectedRegionId);
  }, [selectedRegionId, unchartedRegions]);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const getDangerColor = (level: number) => {
    if (level >= 5) return "text-red-500";
    if (level >= 4) return "text-orange-500";
    if (level >= 3) return "text-yellow-500";
    if (level >= 2) return "text-blue-500";
    return "text-green-500";
  };

  const getStatusColor = (status: ExplorationStatus) => {
    switch (status) {
      case "unexplored":
        return "bg-gray-500";
      case "scanning":
        return "bg-blue-500";
      case "discovered":
        return "bg-green-500";
      case "investigated":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRarityColor = (rarity: RarityLevel) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500";
      case "uncommon":
        return "bg-green-500";
      case "rare":
        return "bg-blue-500";
      case "epic":
        return "bg-purple-500";
      case "legendary":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDiscoveryIcon = (type: DiscoveryType) => {
    const icons: Record<DiscoveryType, any> = {
      planet: <Globe className="h-5 w-5" />,
      anomaly: <Zap className="h-5 w-5" />,
      artifact: <Package className="h-5 w-5" />,
      species: <Eye className="h-5 w-5" />,
      resource: <Database className="h-5 w-5" />,
      phenomena: <Sparkles className="h-5 w-5" />,
      derelict: <Satellite className="h-5 w-5" />,
      nebula: <Star className="h-5 w-5" />,
    };
    return icons[type] || <Star className="h-5 w-5" />;
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleStartScan = (regionId: string) => {
    const region = unchartedRegions.find((r) => r.id === regionId);
    if (!region || region.status !== "unexplored") return;

    const newScan: ActiveScan = {
      id: `scan_${Date.now()}`,
      region: region,
      ship_name: "USS Enterprise",
      progress: 0,
      started_at: new Date(),
      estimated_completion: new Date(Date.now() + region.estimated_scan_time_hours * 60 * 60 * 1000),
      crew_skill_bonus: 10,
    };

    setActiveScans((prev) => [...prev, newScan]);
    setUnchartedRegions((prev) =>
      prev.map((r) => (r.id === regionId ? { ...r, status: "scanning" as ExplorationStatus } : r))
    );
  };

  const handleCompleteScan = (scanId: string) => {
    const scan = activeScans.find((s) => s.id === scanId);
    if (!scan) return;

    // Generate discoveries
    const numDiscoveries = Math.floor(Math.random() * 3) + 1;
    const newDiscoveries: Discovery[] = [];

    const discoveryTypes: DiscoveryType[] = ["planet", "anomaly", "artifact", "species", "resource", "phenomena", "derelict", "nebula"];
    const rarities: RarityLevel[] = ["common", "uncommon", "rare", "epic", "legendary"];

    for (let i = 0; i < numDiscoveries; i++) {
      const type = discoveryTypes[Math.floor(Math.random() * discoveryTypes.length)];
      const rarity = rarities[Math.floor(Math.random() * rarities.length)];

      newDiscoveries.push({
        id: `disc_${Date.now()}_${i}`,
        name: `Discovery in ${scan.region.name}`,
        type,
        rarity,
        region_id: scan.region.id,
        discovered_at: new Date(),
        description: `A ${rarity} ${type} discovered in ${scan.region.name}.`,
        science_data: {
          classification: type.charAt(0).toUpperCase() + type.slice(1),
          significance: "Awaiting Analysis",
          research_value: Math.floor(Math.random() * 5000) + 1000,
        },
        rewards: {
          credits: Math.floor(Math.random() * 100000) + 50000,
          experience: Math.floor(Math.random() * 5000) + 1000,
          research_points: Math.floor(Math.random() * 2000) + 500,
        },
        lore: "Further investigation required to understand the full significance of this discovery.",
      });
    }

    setDiscoveries((prev) => [...newDiscoveries, ...prev]);
    setActiveScans((prev) => prev.filter((s) => s.id !== scanId));
    setUnchartedRegions((prev) =>
      prev.map((r) =>
        r.id === scan.region.id ? { ...r, status: "discovered" as ExplorationStatus, scan_progress: 100 } : r
      )
    );
  };

  const handleCancelScan = (scanId: string) => {
    const scan = activeScans.find((s) => s.id === scanId);
    if (!scan) return;

    setActiveScans((prev) => prev.filter((s) => s.id !== scanId));
    setUnchartedRegions((prev) =>
      prev.map((r) =>
        r.id === scan.region.id ? { ...r, status: "unexplored" as ExplorationStatus, scan_progress: 0 } : r
      )
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exploration & Discovery</h1>
          <p className="text-muted-foreground mt-1">
            Chart uncharted space and make groundbreaking discoveries
          </p>
        </div>
        <div className="flex gap-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Award className="h-4 w-4 mr-1" />
            {explorerRank}
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <TrendingUp className="h-4 w-4 mr-1" />
            {playerExperience.toLocaleString()} XP
          </Badge>
        </div>
      </div>

      {/* EXPLORATION STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Discoveries</p>
                <p className="text-2xl font-bold">{explorationStats.totalDiscoveries}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Scans</p>
                <p className="text-2xl font-bold text-blue-500">{activeScans.length}</p>
              </div>
              <Radio className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Research Value</p>
                <p className="text-2xl font-bold text-purple-500">{explorationStats.totalResearchValue.toLocaleString()}</p>
              </div>
              <Beaker className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unexplored Regions</p>
                <p className="text-2xl font-bold text-gray-500">{explorationStats.unexplored}</p>
              </div>
              <Compass className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MAIN TABS */}
      <Tabs defaultValue="regions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="regions">Uncharted Regions</TabsTrigger>
          <TabsTrigger value="discoveries">Discoveries</TabsTrigger>
          <TabsTrigger value="scans">Active Scans</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>

        {/* UNCHARTED REGIONS TAB */}
        <TabsContent value="regions" className="space-y-4">
          <ScrollArea className="h-[700px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
              {unchartedRegions.map((region) => (
                <Card
                  key={region.id}
                  className={`cursor-pointer transition-all ${
                    selectedRegionId === region.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedRegionId(region.id)}
                >
                  <CardContent className="pt-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{region.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {region.sector} ({region.coordinates.x}, {region.coordinates.y})
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(region.status)} text-white`}>
                        {region.status.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4">{region.description}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 bg-muted rounded">
                        <p className="text-xs text-muted-foreground">Danger Level</p>
                        <p className={`text-sm font-bold ${getDangerColor(region.danger_level)}`}>
                          Level {region.danger_level}
                        </p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <p className="text-xs text-muted-foreground">Scan Time</p>
                        <p className="text-sm font-bold">{region.estimated_scan_time_hours}h</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <p className="text-xs text-muted-foreground">Discoveries</p>
                        <p className="text-sm font-bold">{region.potential_discoveries}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {region.status === "scanning" && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium">Scan Progress</span>
                          <span className="text-xs">{region.scan_progress}%</span>
                        </div>
                        <Progress value={region.scan_progress} className="h-2" />
                      </div>
                    )}

                    {/* Action Button */}
                    {region.status === "unexplored" && (
                      <Button onClick={() => handleStartScan(region.id)} className="w-full">
                        <Search className="h-4 w-4 mr-2" />
                        Begin Scan
                      </Button>
                    )}
                    {region.status === "discovered" && (
                      <Button variant="outline" className="w-full" disabled>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Fully Scanned
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* DISCOVERIES TAB */}
        <TabsContent value="discoveries" className="space-y-4">
          <ScrollArea className="h-[700px]">
            <div className="space-y-4 pr-4">
              {discoveries.map((discovery) => (
                <Card key={discovery.id}>
                  <CardContent className="pt-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          {getDiscoveryIcon(discovery.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{discovery.name}</h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {discovery.type} • {discovery.science_data.classification}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${getRarityColor(discovery.rarity)} text-white`}>
                        {discovery.rarity.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-3">{discovery.description}</p>

                    {/* Science Data */}
                    <div className="mb-4 p-3 bg-muted rounded-lg">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Significance</p>
                          <p className="font-medium">{discovery.science_data.significance}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Research Value</p>
                          <p className="font-medium">{discovery.science_data.research_value.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Rewards */}
                    {discovery.rewards && (
                      <div className="mb-3">
                        <p className="text-xs font-medium mb-2">Rewards:</p>
                        <div className="flex flex-wrap gap-2">
                          {discovery.rewards.credits && (
                            <Badge variant="secondary">+{discovery.rewards.credits.toLocaleString()} Credits</Badge>
                          )}
                          {discovery.rewards.experience && (
                            <Badge variant="secondary">+{discovery.rewards.experience.toLocaleString()} XP</Badge>
                          )}
                          {discovery.rewards.research_points && (
                            <Badge variant="secondary">+{discovery.rewards.research_points.toLocaleString()} Research</Badge>
                          )}
                          {discovery.rewards.technology_unlock && (
                            <Badge variant="secondary" className="bg-purple-500 text-white">
                              Unlocked: {discovery.rewards.technology_unlock}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Lore */}
                    <div className="p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
                      <p className="text-xs font-medium mb-1 flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        Lore Entry
                      </p>
                      <p className="text-xs text-muted-foreground italic">{discovery.lore}</p>
                    </div>

                    {/* Discovery Date */}
                    <p className="text-xs text-muted-foreground mt-3">
                      Discovered: {discovery.discovered_at.toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ACTIVE SCANS TAB */}
        <TabsContent value="scans" className="space-y-4">
          <ScrollArea className="h-[700px]">
            <div className="space-y-4 pr-4">
              {activeScans.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <SearchIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-semibold">No Active Scans</p>
                      <p className="text-sm text-muted-foreground">
                        Start scanning uncharted regions to make new discoveries
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                activeScans.map((scan) => (
                  <Card key={scan.id}>
                    <CardContent className="pt-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{scan.region.name}</h3>
                          <p className="text-sm text-muted-foreground">Scanning Ship: {scan.ship_name}</p>
                        </div>
                        <Badge className="bg-blue-500 text-white">SCANNING</Badge>
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Scan Progress</span>
                          <span className="text-sm">{scan.progress}%</span>
                        </div>
                        <Progress value={scan.progress} className="h-3" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Started: {scan.started_at.toLocaleString()}
                        </p>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-2 bg-muted rounded">
                          <p className="text-xs text-muted-foreground">Crew Skill Bonus</p>
                          <p className="text-sm font-bold">+{scan.crew_skill_bonus}%</p>
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <p className="text-xs text-muted-foreground">Est. Completion</p>
                          <p className="text-sm font-bold">
                            {scan.estimated_completion.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button onClick={() => handleCompleteScan(scan.id)} className="flex-1">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Complete Scan (Simulate)
                        </Button>
                        <Button variant="outline" onClick={() => handleCancelScan(scan.id)}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* MILESTONES TAB */}
        <TabsContent value="milestones" className="space-y-4">
          <ScrollArea className="h-[700px]">
            <div className="space-y-4 pr-4">
              {explorationMilestones.map((milestone) => (
                <Card key={milestone.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{milestone.name}</h3>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </div>
                      {milestone.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <Target className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm">
                          {milestone.current_progress} / {milestone.requirement}
                        </span>
                      </div>
                      <Progress value={(milestone.current_progress / milestone.requirement) * 100} className="h-2" />
                    </div>

                    <div className="p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm font-medium">Reward: {milestone.reward}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
