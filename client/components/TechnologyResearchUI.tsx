import { useState, useMemo, createElement } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FlaskConical, 
  Rocket, 
  Swords, 
  Shield, 
  Radar, 
  Wrench, 
  Heart, 
  Atom, 
  Coins, 
  Zap,
  Clock,
  TrendingUp,
  Lock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { 
  Technology,
  TechCategory,
  TechTier,
  TechRarity,
  TECH_WARP_CORE_BASICS,
  TECH_PHASER_EMITTERS,
  TECH_SHIELD_GENERATORS,
  TECH_SENSOR_ARRAYS,
  TECH_DILITHIUM_REFINING
} from "../lib/TechnologyResearchSystem";

interface ResearchProgress {
  techId: string;
  currentLevel: number;
  progress: number;
  isResearching: boolean;
  timeRemaining: number;
}

export function TechnologyResearchUI() {
  const [activeCategory, setActiveCategory] = useState<TechCategory | "all">("all");
  const [activeTier, setActiveTier] = useState<TechTier | "all">("all");
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);
  const [researchQueue, setResearchQueue] = useState<ResearchProgress[]>([]);
  const [completedTechs, setCompletedTechs] = useState<Set<string>>(new Set());

  // Mock player resources
  const [playerResources] = useState({
    credits: 50000,
    dilithium: 10000,
    tritanium: 8000,
    deuterium: 6000,
    latinum: 1000
  });

  const categories: Array<{ id: TechCategory | "all"; label: string; icon: any }> = [
    { id: "all", label: "All", icon: FlaskConical },
    { id: "propulsion", label: "Propulsion", icon: Rocket },
    { id: "weapons", label: "Weapons", icon: Swords },
    { id: "defense", label: "Defense", icon: Shield },
    { id: "sensors", label: "Sensors", icon: Radar },
    { id: "engineering", label: "Engineering", icon: Wrench },
    { id: "medical", label: "Medical", icon: Heart },
    { id: "science", label: "Science", icon: Atom },
    { id: "economy", label: "Economy", icon: Coins },
    { id: "quantum", label: "Quantum", icon: Zap },
    { id: "temporal", label: "Temporal", icon: Clock }
  ];

  const tiers: Array<{ id: TechTier | "all"; label: string; color: string }> = [
    { id: "all", label: "All Tiers", color: "text-gray-400" },
    { id: "tier1", label: "Tier 1", color: "text-gray-400" },
    { id: "tier2", label: "Tier 2", color: "text-green-400" },
    { id: "tier3", label: "Tier 3", color: "text-blue-400" },
    { id: "tier4", label: "Tier 4", color: "text-purple-400" },
    { id: "tier5", label: "Tier 5", color: "text-yellow-400" }
  ];

  const getRarityColor = (rarity: TechRarity) => {
    switch (rarity) {
      case "common": return "bg-gray-600";
      case "uncommon": return "bg-green-600";
      case "rare": return "bg-blue-600";
      case "epic": return "bg-purple-600";
      case "legendary": return "bg-yellow-600";
      case "mythic": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  const getCategoryIcon = (category: TechCategory) => {
    const cat = categories.find(c => c.id === category);
    if (!cat) return FlaskConical;
    return cat.icon;
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  const canResearch = (tech: Technology): boolean => {
    // Check if already completed
    if (completedTechs.has(tech.id)) return false;

    // Check prerequisites
    if (tech.requirements.previousTech) {
      for (const prereq of tech.requirements.previousTech) {
        if (!completedTechs.has(prereq)) return false;
      }
    }

    // Check resources
    const costs = tech.baseCost;
    for (const [resource, amount] of Object.entries(costs)) {
      if ((playerResources as any)[resource] < amount) return false;
    }

    return true;
  };

  const startResearch = (tech: Technology) => {
    if (!canResearch(tech)) return;

    const newProgress: ResearchProgress = {
      techId: tech.id,
      currentLevel: 1,
      progress: 0,
      isResearching: true,
      timeRemaining: tech.baseResearchTime
    };

    setResearchQueue([...researchQueue, newProgress]);
  };

  // Sample technologies for display
  const sampleTechs: Technology[] = [
    TECH_WARP_CORE_BASICS,
    TECH_PHASER_EMITTERS,
    TECH_SHIELD_GENERATORS,
    TECH_SENSOR_ARRAYS,
    TECH_DILITHIUM_REFINING
  ];

  const filteredTechs = sampleTechs.filter(tech => {
    if (activeCategory !== "all" && tech.category !== activeCategory) return false;
    if (activeTier !== "all" && tech.tier !== activeTier) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FlaskConical className="w-8 h-8 text-purple-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">Technology Research Center</h1>
          <p className="text-gray-400">Research 91+ technologies across 5 tiers and 10 categories</p>
        </div>
      </div>

      {/* Resource Display */}
      <Card className="bg-gray-900/50 border-blue-500/30">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-yellow-400" />
              <div>
                <div className="text-xs text-gray-400">Credits</div>
                <div className="text-lg font-bold text-yellow-400">{playerResources.credits.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-xs text-gray-400">Dilithium</div>
                <div className="text-lg font-bold text-purple-400">{playerResources.dilithium.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-xs text-gray-400">Tritanium</div>
                <div className="text-lg font-bold text-blue-400">{playerResources.tritanium.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Atom className="w-4 h-4 text-green-400" />
              <div>
                <div className="text-xs text-gray-400">Deuterium</div>
                <div className="text-lg font-bold text-green-400">{playerResources.deuterium.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-orange-400" />
              <div>
                <div className="text-xs text-gray-400">Latinum</div>
                <div className="text-lg font-bold text-orange-400">{playerResources.latinum.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Research Queue */}
      {researchQueue.length > 0 && (
        <Card className="bg-gray-900/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Active Research ({researchQueue.length}/3)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {researchQueue.map((research, idx) => {
              const tech = sampleTechs.find(t => t.id === research.techId);
              if (!tech) return null;

              return (
                <div key={idx} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {createElement(getCategoryIcon(tech.category), { className: "w-5 h-5 text-blue-400" })}
                      <div>
                        <div className="font-semibold text-white">{tech.displayName}</div>
                        <div className="text-sm text-gray-400">Level {research.currentLevel}/{tech.maxLevel}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-400">{Math.round(research.progress)}%</div>
                      <div className="text-xs text-gray-400">{formatTime(research.timeRemaining)} remaining</div>
                    </div>
                  </div>
                  <Progress value={research.progress} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <Card className="lg:col-span-1 bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Category</label>
              <ScrollArea className="h-64">
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      variant={activeCategory === cat.id ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      {createElement(cat.icon, { className: "w-4 h-4 mr-2" })}
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Tier Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Tier</label>
              <div className="space-y-1">
                {tiers.map((tier) => (
                  <Button
                    key={tier.id}
                    variant={activeTier === tier.id ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setActiveTier(tier.id)}
                  >
                    <span className={tier.color}>{tier.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technology Grid */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle>Available Technologies</CardTitle>
              <CardDescription>
                Showing {filteredTechs.length} technolog{filteredTechs.length === 1 ? 'y' : 'ies'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTechs.map((tech) => {
                    const isCompleted = completedTechs.has(tech.id);
                    const isResearching = researchQueue.some(r => r.techId === tech.id);
                    const canStart = canResearch(tech);
                    const Icon = getCategoryIcon(tech.category);

                    return (
                      <Card 
                        key={tech.id}
                        className={`bg-gray-800/50 border cursor-pointer transition-all hover:scale-105 ${
                          selectedTech?.id === tech.id ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-700'
                        }`}
                        onClick={() => setSelectedTech(tech)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Icon className="w-5 h-5 text-blue-400" />
                              <div>
                                <CardTitle className="text-base">{tech.displayName}</CardTitle>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant="outline" className={getRarityColor(tech.rarity)}>
                                    {tech.rarity}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {tech.tier.replace('tier', 'T')}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div>
                              {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                              {isResearching && <Clock className="w-5 h-5 text-yellow-400 animate-pulse" />}
                              {!canStart && !isCompleted && !isResearching && <Lock className="w-5 h-5 text-gray-500" />}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-gray-300">{tech.description}</p>
                          
                          {/* Stats */}
                          <div className="space-y-1">
                            {tech.stats.slice(0, 2).map((stat, idx) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <span className="text-gray-400">{stat.name}</span>
                                <span className="text-white font-medium">{stat.value}{stat.unit}</span>
                              </div>
                            ))}
                          </div>

                          {/* Costs */}
                          <div className="flex gap-2 flex-wrap">
                            {Object.entries(tech.baseCost).map(([resource, amount]) => (
                              <Badge key={resource} variant="outline" className="text-xs">
                                {String(amount)} {resource}
                              </Badge>
                            ))}
                          </div>

                          {/* Time */}
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(tech.baseResearchTime)}</span>
                          </div>

                          {/* Action Button */}
                          <Button
                            size="sm"
                            className="w-full"
                            disabled={!canStart || isResearching || isCompleted}
                            onClick={(e) => {
                              e.stopPropagation();
                              startResearch(tech);
                            }}
                          >
                            {isCompleted && "Completed"}
                            {isResearching && "Researching..."}
                            {!isCompleted && !isResearching && (canStart ? "Start Research" : "Locked")}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Selected Technology Details */}
      {selectedTech && (
        <Card className="bg-gray-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {createElement(getCategoryIcon(selectedTech.category), { className: "w-6 h-6 text-purple-400" })}
              {selectedTech.displayName}
            </CardTitle>
            <CardDescription>{selectedTech.longDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tech Info Card */}
            <div className="p-4 rounded-lg bg-purple-900/30 border border-purple-500/30">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-400 text-xs">Tier</div>
                  <div className="text-white font-semibold">{selectedTech.tier.replace('tier', 'Tier ')}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Rarity</div>
                  <div className="text-white font-semibold capitalize">{selectedTech.rarity}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Max Level</div>
                  <div className="text-white font-semibold">{selectedTech.maxLevel}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Research Time</div>
                  <div className="text-white font-semibold">{formatTime(selectedTech.baseResearchTime)}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stats */}
              <div className="space-y-2">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Key Statistics
                </h3>
                <div className="space-y-2">
                  {selectedTech.stats.map((stat, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded bg-gray-800/50 hover:bg-gray-700/50 transition">
                      <span className="text-gray-300">{stat.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-600 rounded overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                            style={{ width: `${Math.min(100, (stat.value / 1000) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-medium whitespace-nowrap">{stat.value}{stat.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Effects */}
              <div className="space-y-2">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Game Effects
                </h3>
                <div className="space-y-2">
                  {selectedTech.effects.map((effect, idx) => (
                    <div key={idx} className="p-3 rounded bg-green-900/20 border border-green-500/30">
                      <div className="flex items-start gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-400 mt-0.5" />
                        <div>
                          <span className="text-green-400 font-medium">
                            +{(effect.modifier * 100).toFixed(0)}% {effect.type}
                          </span>
                          <p className="text-sm text-gray-300 mt-1">{effect.description}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-2 pl-6">
                        Affects: <span className="text-gray-300">{effect.targetAttribute}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Research Costs (Per Level)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(selectedTech.baseCost).map(([resource, amount]) => (
                  <div key={resource} className="p-2 rounded bg-gray-800/50 text-sm">
                    <div className="text-gray-400 text-xs capitalize">{resource}</div>
                    <div className="text-white font-semibold">{String(amount).padStart(5, ' ')}</div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-400 mt-2 p-2 bg-gray-800/50 rounded">
                Cost increases by {((selectedTech.costScaling - 1) * 100).toFixed(0)}% per level
              </div>
            </div>

            {/* Prerequisites */}
            {selectedTech.requirements.previousTech && selectedTech.requirements.previousTech.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Required Prerequisites ({selectedTech.requirements.previousTech.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedTech.requirements.previousTech.map((prereqId) => {
                    const prereqTech = sampleTechs.find(t => t.id === prereqId);
                    const isCompleted = completedTechs.has(prereqId);
                    return (
                      <div 
                        key={prereqId}
                        className={`p-2 rounded flex items-center gap-2 ${
                          isCompleted ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        ) : (
                          <Lock className="w-4 h-4 text-red-400 flex-shrink-0" />
                        )}
                        <span className={isCompleted ? "text-green-400 text-sm" : "text-red-400 text-sm"}>
                          {prereqTech?.displayName || prereqId}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Synergies */}
            {selectedTech.synergiesWith && selectedTech.synergiesWith.length > 0 && (
              <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-500/30">
                <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                  <Atom className="w-4 h-4" />
                  Technology Synergies
                </h4>
                <p className="text-xs text-gray-400">
                  Researching this technology will unlock bonuses when combined with: {selectedTech.synergiesWith.join(", ")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
