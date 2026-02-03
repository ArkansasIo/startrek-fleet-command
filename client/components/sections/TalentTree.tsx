import { useState, useEffect, useCallback } from "react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Users,
  Star,
  Plus,
  Minus,
  RotateCcw,
  Zap,
  Shield,
  Cog,
  Microscope,
  HeartPulse,
  Crown,
  HeartHandshake,
  Settings,
  Lock,
  Unlock,
  Target,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  Info,
  Sparkles,
  Award,
  TrendingUp,
  BookOpen,
  Wrench,
  Database,
  Cpu,
  Radio,
  Rocket,
} from "lucide-react";

interface Profession {
  id: string;
  profession_name: string;
  profession_code: string;
  description: string;
  primary_attribute: string;
  icon_name: string;
  color_scheme: string;
  max_talent_points: number;
  profession_level: number;
  available_talent_points: number;
  total_talent_points: number;
  is_primary_profession: boolean;
  talent_trees: TalentTree[];
}

interface TalentTree {
  tree_id: string;
  tree_name: string;
  tree_description: string;
  tree_type: string;
  max_tier: number;
  tree_color: string;
}

interface TalentNode {
  id: string;
  node_name: string;
  node_description: string;
  detailed_description: string;
  tier_level: number;
  position_x: number;
  position_y: number;
  max_rank: number;
  points_per_rank: number;
  node_type: string;
  icon_name: string;
  effects: any;
  prerequisites: string[];
  unlock_requirements: any;
  is_capstone: boolean;
  is_starter: boolean;
  current_rank: number;
  points_invested: number;
  unlocked_at: string;
}

interface TalentTreeData {
  talent_tree: {
    id: string;
    tree_name: string;
    tree_description: string;
    tree_type: string;
    max_tier: number;
    tree_color: string;
    profession_name: string;
    profession_code: string;
    color_scheme: string;
    available_talent_points: number;
    profession_level: number;
  };
  nodes: TalentNode[];
}

export function TalentTree() {
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [selectedProfession, setSelectedProfession] = useState<string>("");
  const [selectedTree, setSelectedTree] = useState<string>("");
  const [talentTreeData, setTalentTreeData] = useState<TalentTreeData | null>(
    null,
  );
  const [selectedNode, setSelectedNode] = useState<TalentNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNodeDialog, setShowNodeDialog] = useState(false);
  const [pendingAllocations, setPendingAllocations] = useState<
    Record<string, number>
  >({});

  // Mock player ID - in real app this would come from auth context
  const playerId = "player-1";

  useEffect(() => {
    loadPlayerProfessions();
  }, []);

  useEffect(() => {
    if (selectedTree) {
      loadTalentTree();
    }
  }, [selectedTree]);

  const loadPlayerProfessions = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/talent/professions/player/${playerId}`);
      // const data = await response.json();

      // Mock data for development
      const mockProfessions: Profession[] = [
        {
          id: "prof-1",
          profession_name: "Engineering",
          profession_code: "ENG",
          description:
            "Masters of starship systems, construction, and technological innovation",
          primary_attribute: "intelligence",
          icon_name: "cog",
          color_scheme: "yellow",
          max_talent_points: 150,
          profession_level: 5,
          available_talent_points: 12,
          total_talent_points: 25,
          is_primary_profession: true,
          talent_trees: [
            {
              tree_id: "tree-1",
              tree_name: "Starship Systems",
              tree_description:
                "Specialization in starship engineering and maintenance",
              tree_type: "specialization",
              max_tier: 8,
              tree_color: "yellow",
            },
            {
              tree_id: "tree-2",
              tree_name: "Construction & Fabrication",
              tree_description:
                "Advanced construction and manufacturing techniques",
              tree_type: "crafting",
              max_tier: 6,
              tree_color: "orange",
            },
            {
              tree_id: "tree-3",
              tree_name: "Research & Development",
              tree_description: "Innovation and technological advancement",
              tree_type: "research",
              max_tier: 10,
              tree_color: "blue",
            },
          ],
        },
        {
          id: "prof-2",
          profession_name: "Science",
          profession_code: "SCI",
          description: "Researchers, analysts, and explorers of the unknown",
          primary_attribute: "intelligence",
          icon_name: "microscope",
          color_scheme: "blue",
          max_talent_points: 150,
          profession_level: 3,
          available_talent_points: 8,
          total_talent_points: 15,
          is_primary_profession: false,
          talent_trees: [
            {
              tree_id: "tree-4",
              tree_name: "Physics Research",
              tree_description: "Theoretical and applied physics discoveries",
              tree_type: "research",
              max_tier: 10,
              tree_color: "blue",
            },
            {
              tree_id: "tree-5",
              tree_name: "Sensor Operations",
              tree_description: "Advanced sensor and detection systems",
              tree_type: "specialization",
              max_tier: 8,
              tree_color: "cyan",
            },
          ],
        },
      ];

      setProfessions(mockProfessions);
      if (mockProfessions.length > 0) {
        setSelectedProfession(mockProfessions[0].id);
        if (mockProfessions[0].talent_trees.length > 0) {
          setSelectedTree(mockProfessions[0].talent_trees[0].tree_id);
        }
      }
    } catch (error) {
      console.error("Error loading professions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTalentTree = async () => {
    if (!selectedTree) return;

    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/talent/talent-trees/${selectedTree}/player/${playerId}`);
      // const data = await response.json();

      // Mock talent tree data
      const mockTreeData: TalentTreeData = {
        talent_tree: {
          id: selectedTree,
          tree_name: "Starship Systems",
          tree_description:
            "Specialization in starship engineering and maintenance",
          tree_type: "specialization",
          max_tier: 8,
          tree_color: "yellow",
          profession_name: "Engineering",
          profession_code: "ENG",
          color_scheme: "yellow",
          available_talent_points: 12,
          profession_level: 5,
        },
        nodes: [
          {
            id: "node-1",
            node_name: "Basic Engineering",
            node_description: "Fundamental engineering knowledge",
            detailed_description:
              "Provides a foundation in starship engineering principles, improving repair efficiency and system understanding.",
            tier_level: 1,
            position_x: 2,
            position_y: 1,
            max_rank: 1,
            points_per_rank: 1,
            node_type: "passive",
            icon_name: "cog",
            effects: { repair_speed: 1.1, efficiency: 1.05 },
            prerequisites: [],
            unlock_requirements: {},
            is_capstone: false,
            is_starter: true,
            current_rank: 1,
            points_invested: 1,
            unlocked_at: "2024-12-01T10:00:00Z",
          },
          {
            id: "node-2",
            node_name: "Power Systems Expertise",
            node_description: "Advanced understanding of power distribution",
            detailed_description:
              "Deep knowledge of starship power systems, including EPS grid management and power distribution optimization.",
            tier_level: 2,
            position_x: 1,
            position_y: 2,
            max_rank: 3,
            points_per_rank: 1,
            node_type: "passive",
            icon_name: "zap",
            effects: { power_efficiency: 1.15, overload_resistance: 1.1 },
            prerequisites: ["node-1"],
            unlock_requirements: {},
            is_capstone: false,
            is_starter: false,
            current_rank: 2,
            points_invested: 2,
            unlocked_at: "2024-12-02T14:30:00Z",
          },
          {
            id: "node-3",
            node_name: "Warp Core Specialist",
            node_description: "Master of warp core operations and maintenance",
            detailed_description:
              "Expertise in matter/antimatter reaction systems, including emergency procedures and efficiency optimization.",
            tier_level: 3,
            position_x: 1,
            position_y: 3,
            max_rank: 5,
            points_per_rank: 1,
            node_type: "active",
            icon_name: "rocket",
            effects: { warp_efficiency: 1.25, core_stability: 1.2 },
            prerequisites: ["node-2"],
            unlock_requirements: {},
            is_capstone: false,
            is_starter: false,
            current_rank: 0,
            points_invested: 0,
            unlocked_at: "",
          },
          {
            id: "node-4",
            node_name: "Impulse Drive Expert",
            node_description: "Specialized in impulse engine systems",
            detailed_description:
              "Advanced knowledge of fusion impulse engines and sublight propulsion systems.",
            tier_level: 3,
            position_x: 3,
            position_y: 3,
            max_rank: 3,
            points_per_rank: 1,
            node_type: "passive",
            icon_name: "target",
            effects: { impulse_speed: 1.15, maneuverability: 1.1 },
            prerequisites: ["node-2"],
            unlock_requirements: {},
            is_capstone: false,
            is_starter: false,
            current_rank: 1,
            points_invested: 1,
            unlocked_at: "2024-12-05T09:15:00Z",
          },
          {
            id: "node-5",
            node_name: "Chief Engineer",
            node_description: "Ultimate engineering leadership and expertise",
            detailed_description:
              "The pinnacle of engineering mastery, combining technical expertise with leadership capabilities to maximize team performance.",
            tier_level: 5,
            position_x: 2,
            position_y: 5,
            max_rank: 1,
            points_per_rank: 2,
            node_type: "capstone",
            icon_name: "crown",
            effects: { all_engineering: 1.5, team_efficiency: 1.3 },
            prerequisites: ["node-3", "node-4"],
            unlock_requirements: { min_level: 10, min_spent_points: 15 },
            is_capstone: true,
            is_starter: false,
            current_rank: 0,
            points_invested: 0,
            unlocked_at: "",
          },
        ],
      };

      setTalentTreeData(mockTreeData);
    } catch (error) {
      console.error("Error loading talent tree:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNodeIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      cog: <Cog className="w-6 h-6" />,
      zap: <Zap className="w-6 h-6" />,
      rocket: <Rocket className="w-6 h-6" />,
      target: <Target className="w-6 h-6" />,
      crown: <Crown className="w-6 h-6" />,
      shield: <Shield className="w-6 h-6" />,
      microscope: <Microscope className="w-6 h-6" />,
      heart: <HeartPulse className="w-6 h-6" />,
      handshake: <HeartHandshake className="w-6 h-6" />,
      users: <Users className="w-6 h-6" />,
      cpu: <Cpu className="w-6 h-6" />,
      radio: <Radio className="w-6 h-6" />,
      database: <Database className="w-6 h-6" />,
      wrench: <Wrench className="w-6 h-6" />,
    };
    return iconMap[iconName] || <Star className="w-6 h-6" />;
  };

  const getProfessionIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      cog: <Cog className="w-5 h-5" />,
      microscope: <Microscope className="w-5 h-5" />,
      "heart-pulse": <HeartPulse className="w-5 h-5" />,
      sword: <Target className="w-5 h-5" />,
      crown: <Crown className="w-5 h-5" />,
      shield: <Shield className="w-5 h-5" />,
      handshake: <HeartHandshake className="w-5 h-5" />,
      settings: <Settings className="w-5 h-5" />,
    };
    return iconMap[iconName] || <Star className="w-5 h-5" />;
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

  const isNodeUnlocked = (node: TalentNode): boolean => {
    if (node.is_starter) return true;
    if (node.current_rank > 0) return true;

    // Check prerequisites
    if (node.prerequisites && node.prerequisites.length > 0) {
      return node.prerequisites.every((prereqId) => {
        const prereqNode = talentTreeData?.nodes.find((n) => n.id === prereqId);
        return prereqNode && prereqNode.current_rank > 0;
      });
    }

    return true;
  };

  const canAllocatePoint = (node: TalentNode): boolean => {
    if (!isNodeUnlocked(node)) return false;
    if (node.current_rank >= node.max_rank) return false;
    if (
      !talentTreeData?.talent_tree.available_talent_points ||
      talentTreeData.talent_tree.available_talent_points <= 0
    )
      return false;
    return true;
  };

  const handleNodeClick = (node: TalentNode) => {
    setSelectedNode(node);
    setShowNodeDialog(true);
  };

  const handleAllocatePoint = async (node: TalentNode) => {
    if (!canAllocatePoint(node)) return;

    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/talent/talent-nodes/${node.id}/allocate`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ playerId, pointsToAllocate: 1 })
      // });

      // Optimistic update for demo
      if (talentTreeData) {
        const updatedNodes = talentTreeData.nodes.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              current_rank: n.current_rank + 1,
              points_invested: n.points_invested + 1,
            };
          }
          return n;
        });

        setTalentTreeData({
          ...talentTreeData,
          nodes: updatedNodes,
          talent_tree: {
            ...talentTreeData.talent_tree,
            available_talent_points:
              talentTreeData.talent_tree.available_talent_points - 1,
          },
        });
      }

      setShowNodeDialog(false);
    } catch (error) {
      console.error("Error allocating talent point:", error);
    }
  };

  const selectedProfessionData = professions.find(
    (p) => p.id === selectedProfession,
  );
  const selectedTreeData = selectedProfessionData?.talent_trees.find(
    (t) => t.tree_id === selectedTree,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-trek-text">Loading talent trees...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-trek-panel/80 border-trek-accent">
        <CardHeader>
          <CardTitle className="text-trek-gold flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            Character Development
          </CardTitle>
          <CardDescription className="text-trek-text/80">
            Develop your officer's skills and expertise through specialized
            talent trees
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Profession Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="bg-trek-panel/50 border-trek-accent">
          <CardHeader>
            <CardTitle className="text-trek-gold text-lg">
              Professions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {professions.map((profession) => (
              <Button
                key={profession.id}
                variant={
                  selectedProfession === profession.id ? "default" : "outline"
                }
                className={`w-full justify-start ${
                  selectedProfession === profession.id
                    ? `${getColorClass(profession.color_scheme)} text-white`
                    : "border-trek-accent text-trek-text hover:bg-trek-accent/20"
                }`}
                onClick={() => {
                  setSelectedProfession(profession.id);
                  if (profession.talent_trees.length > 0) {
                    setSelectedTree(profession.talent_trees[0].tree_id);
                  }
                }}
              >
                <div className="flex items-center gap-3 w-full">
                  {getProfessionIcon(profession.icon_name)}
                  <div className="flex-1 text-left">
                    <div className="font-semibold">
                      {profession.profession_name}
                    </div>
                    <div className="text-xs opacity-80">
                      Level {profession.profession_level} •{" "}
                      {profession.available_talent_points} points
                    </div>
                  </div>
                  {profession.is_primary_profession && (
                    <Star className="w-4 h-4 fill-current" />
                  )}
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Talent Tree Content */}
        <div className="lg:col-span-3">
          {selectedProfessionData && (
            <Tabs value={selectedTree} onValueChange={setSelectedTree}>
              <TabsList className="bg-trek-dark border border-trek-accent mb-4">
                {selectedProfessionData.talent_trees.map((tree) => (
                  <TabsTrigger
                    key={tree.tree_id}
                    value={tree.tree_id}
                    className="data-[state=active]:bg-trek-accent"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getColorClass(tree.tree_color)}`}
                      />
                      {tree.tree_name}
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {selectedProfessionData.talent_trees.map((tree) => (
                <TabsContent
                  key={tree.tree_id}
                  value={tree.tree_id}
                  className="space-y-4"
                >
                  {/* Tree Header */}
                  <Card className="bg-trek-panel/50 border-trek-accent">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-trek-gold">
                            {tree.tree_name}
                          </h3>
                          <p className="text-trek-text/80">
                            {tree.tree_description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <Badge
                              variant="outline"
                              className={`${getColorClass(tree.tree_color, "border")} ${getColorClass(tree.tree_color, "text")}`}
                            >
                              {tree.tree_type}
                            </Badge>
                            <span className="text-trek-text/60">
                              Max Tier: {tree.max_tier}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-trek-gold">
                            {talentTreeData?.talent_tree
                              .available_talent_points || 0}
                          </div>
                          <div className="text-sm text-trek-text/60">
                            Available Points
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Talent Tree Grid */}
                  {talentTreeData && (
                    <Card className="bg-trek-panel/30 border-trek-accent">
                      <CardContent className="p-6">
                        <div className="relative">
                          {/* Grid background */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="grid grid-cols-5 gap-4 h-full">
                              {Array.from({ length: 25 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="border border-trek-accent/20"
                                />
                              ))}
                            </div>
                          </div>

                          {/* Talent Nodes */}
                          <div className="relative grid grid-cols-5 gap-4 min-h-96">
                            {talentTreeData.nodes.map((node) => {
                              const unlocked = isNodeUnlocked(node);
                              const canAllocate = canAllocatePoint(node);
                              const isMaxRank =
                                node.current_rank >= node.max_rank;

                              return (
                                <TooltipProvider key={node.id}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className={`
                                          relative col-start-${node.position_x + 1} row-start-${node.position_y}
                                          w-16 h-16 rounded-lg border-2 cursor-pointer transition-all duration-200
                                          flex items-center justify-center
                                          ${
                                            unlocked
                                              ? node.current_rank > 0
                                                ? `${getColorClass(talentTreeData.talent_tree.color_scheme, "bg")} ${getColorClass(talentTreeData.talent_tree.color_scheme, "border")} text-white shadow-lg`
                                                : `bg-trek-panel/50 ${getColorClass(talentTreeData.talent_tree.color_scheme, "border")} text-trek-text hover:bg-trek-panel/80`
                                              : "bg-trek-dark/50 border-gray-600 text-gray-500"
                                          }
                                          ${node.is_capstone ? "ring-4 ring-trek-gold/50" : ""}
                                          ${canAllocate ? "hover:scale-110 hover:shadow-xl" : ""}
                                        `}
                                        onClick={() => handleNodeClick(node)}
                                        style={{
                                          gridColumn: node.position_x + 1,
                                          gridRow: node.position_y,
                                        }}
                                      >
                                        {getNodeIcon(node.icon_name)}

                                        {/* Rank indicator */}
                                        {node.max_rank > 1 && (
                                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-trek-dark border border-trek-accent rounded-full flex items-center justify-center text-xs font-bold">
                                            {node.current_rank}/{node.max_rank}
                                          </div>
                                        )}

                                        {/* Lock/unlock indicator */}
                                        <div className="absolute -top-1 -left-1">
                                          {unlocked ? (
                                            node.current_rank > 0 ? (
                                              <div className="w-3 h-3 bg-green-500 rounded-full border border-white" />
                                            ) : (
                                              <Unlock className="w-3 h-3 text-trek-gold" />
                                            )
                                          ) : (
                                            <Lock className="w-3 h-3 text-gray-500" />
                                          )}
                                        </div>

                                        {/* Capstone indicator */}
                                        {node.is_capstone && (
                                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                            <Crown className="w-4 h-4 text-trek-gold" />
                                          </div>
                                        )}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent
                                      side="top"
                                      className="bg-trek-panel border-trek-accent"
                                    >
                                      <div className="max-w-xs">
                                        <div className="font-semibold text-trek-gold">
                                          {node.node_name}
                                        </div>
                                        <div className="text-sm text-trek-text/80 mt-1">
                                          {node.node_description}
                                        </div>
                                        {node.current_rank > 0 && (
                                          <div className="text-xs text-green-400 mt-1">
                                            Rank {node.current_rank}/
                                            {node.max_rank}
                                          </div>
                                        )}
                                        {!unlocked && (
                                          <div className="text-xs text-red-400 mt-1">
                                            Requires prerequisites
                                          </div>
                                        )}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                            })}
                          </div>

                          {/* Connection lines between nodes */}
                          <svg className="absolute inset-0 pointer-events-none">
                            {talentTreeData.nodes.map((node) => {
                              if (
                                !node.prerequisites ||
                                node.prerequisites.length === 0
                              )
                                return null;

                              return node.prerequisites.map((prereqId) => {
                                const prereqNode = talentTreeData.nodes.find(
                                  (n) => n.id === prereqId,
                                );
                                if (!prereqNode) return null;

                                const startX =
                                  (prereqNode.position_x + 0.5) * 80; // 64px + 16px gap
                                const startY = prereqNode.position_y * 80;
                                const endX = (node.position_x + 0.5) * 80;
                                const endY = node.position_y * 80;

                                return (
                                  <line
                                    key={`${prereqId}-${node.id}`}
                                    x1={startX}
                                    y1={startY}
                                    x2={endX}
                                    y2={endY}
                                    stroke={
                                      prereqNode.current_rank > 0
                                        ? "#FFD700"
                                        : "#666"
                                    }
                                    strokeWidth="2"
                                    strokeDasharray={
                                      prereqNode.current_rank > 0 ? "0" : "5,5"
                                    }
                                  />
                                );
                              });
                            })}
                          </svg>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </div>

      {/* Node Detail Dialog */}
      <Dialog open={showNodeDialog} onOpenChange={setShowNodeDialog}>
        <DialogContent className="bg-trek-panel border-trek-accent max-w-2xl">
          {selectedNode && (
            <>
              <DialogHeader>
                <DialogTitle className="text-trek-gold flex items-center gap-3">
                  {getNodeIcon(selectedNode.icon_name)}
                  {selectedNode.node_name}
                  {selectedNode.is_capstone && (
                    <Crown className="w-5 h-5 text-trek-gold" />
                  )}
                </DialogTitle>
                <DialogDescription className="text-trek-text/80">
                  {selectedNode.detailed_description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Current Progress */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-trek-text">Current Rank</Label>
                    <div className="text-2xl font-bold text-trek-gold">
                      {selectedNode.current_rank} / {selectedNode.max_rank}
                    </div>
                  </div>
                  <div>
                    <Label className="text-trek-text">Points Invested</Label>
                    <div className="text-2xl font-bold text-trek-blue">
                      {selectedNode.points_invested}
                    </div>
                  </div>
                </div>

                {/* Effects */}
                {selectedNode.effects &&
                  Object.keys(selectedNode.effects).length > 0 && (
                    <div>
                      <Label className="text-trek-text">Effects</Label>
                      <div className="bg-trek-dark/50 p-3 rounded border border-trek-accent/30 mt-1">
                        {Object.entries(selectedNode.effects).map(
                          ([effect, value]) => (
                            <div
                              key={effect}
                              className="text-sm text-trek-text/80 flex justify-between"
                            >
                              <span className="capitalize">
                                {effect.replace(/_/g, " ")}
                              </span>
                              <span className="text-green-400">
                                {typeof value === "number"
                                  ? value > 1
                                    ? `+${Math.round((value - 1) * 100)}%`
                                    : `${value}`
                                  : value}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {/* Prerequisites */}
                {selectedNode.prerequisites &&
                  selectedNode.prerequisites.length > 0 && (
                    <div>
                      <Label className="text-trek-text">Prerequisites</Label>
                      <div className="space-y-1 mt-1">
                        {selectedNode.prerequisites.map((prereqId) => {
                          const prereqNode = talentTreeData?.nodes.find(
                            (n) => n.id === prereqId,
                          );
                          if (!prereqNode) return null;

                          return (
                            <div
                              key={prereqId}
                              className="flex items-center gap-2 text-sm"
                            >
                              {prereqNode.current_rank > 0 ? (
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                              ) : (
                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                              )}
                              <span
                                className={
                                  prereqNode.current_rank > 0
                                    ? "text-green-400"
                                    : "text-red-400"
                                }
                              >
                                {prereqNode.node_name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t border-trek-accent/30">
                  <Button
                    variant="outline"
                    onClick={() => setShowNodeDialog(false)}
                  >
                    Close
                  </Button>
                  {canAllocatePoint(selectedNode) && (
                    <Button
                      onClick={() => handleAllocatePoint(selectedNode)}
                      className="bg-trek-gold hover:bg-trek-gold/80 text-trek-dark"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Allocate Point ({selectedNode.points_per_rank} pt)
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
