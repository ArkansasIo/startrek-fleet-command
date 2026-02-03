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
  Skull,
  Brain,
  Zap,
  Shield,
  Target,
  AlertTriangle,
  Users,
  Star,
  Crown,
  Swords,
  Eye,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Download,
  Upload,
  Sparkles,
  Bot,
  Cpu,
  Database,
  Activity,
} from "lucide-react";

interface Enemy {
  id: string;
  name: string;
  species: string;
  faction: string;
  rank: string;
  class: "Individual" | "Squad" | "Fleet" | "Empire" | "Collective" | "Entity";
  type:
    | "Biological"
    | "Artificial"
    | "Energy"
    | "Cybernetic"
    | "Hybrid"
    | "Unknown";
  threat_level:
    | "Minimal"
    | "Low"
    | "Medium"
    | "High"
    | "Extreme"
    | "Existential";

  // Physical/Mental Attributes
  attributes: {
    strength: number;
    intelligence: number;
    cunning: number;
    ruthlessness: number;
    resources: number;
    technology: number;
    influence: number;
    adaptability: number;
  };

  // Combat Capabilities
  combat: {
    tactical_rating: number;
    fleet_strength: number;
    individual_prowess: number;
    strategic_thinking: number;
    command_ability: number;
  };

  // AI Behavior
  ai_profile: {
    aggression_level: number;
    cooperation_likelihood: number;
    negotiation_willingness: number;
    betrayal_probability: number;
    desperation_threshold: number;
    pride_factor: number;
    fear_factor: number;
  };

  // Capabilities & Weaknesses
  capabilities: string[];
  weaknesses: string[];
  special_abilities: string[];
  technology_advantages: string[];

  // Background
  background: {
    origin: string;
    motivation: string;
    goals: string[];
    allies: string[];
    enemies: string[];
    past_encounters: string[];
  };

  // Tactical Information
  tactics: {
    preferred_strategies: string[];
    known_ships: string[];
    typical_forces: string;
    operational_range: string;
    supply_requirements: string[];
  };

  // AI Decision Matrix
  decision_patterns: {
    when_winning: string[];
    when_losing: string[];
    when_cornered: string[];
    diplomatic_approach: string[];
    military_priorities: string[];
  };
}

interface NemesisSystemProps {
  activeSubmenu?: string;
}

export function NemesisSystem({ activeSubmenu }: NemesisSystemProps) {
  const defaultTab = "database";
  const [activeTab, setActiveTab] = useState(activeSubmenu || defaultTab);

  useEffect(() => {
    setActiveTab(activeSubmenu || defaultTab);
  }, [activeSubmenu]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [currentEnemy, setCurrentEnemy] = useState<Partial<Enemy>>({
    name: "",
    species: "",
    faction: "",
    rank: "",
    class: "Individual",
    type: "Biological",
    threat_level: "Medium",
    attributes: {
      strength: 5,
      intelligence: 5,
      cunning: 5,
      ruthlessness: 5,
      resources: 5,
      technology: 5,
      influence: 5,
      adaptability: 5,
    },
    combat: {
      tactical_rating: 5,
      fleet_strength: 5,
      individual_prowess: 5,
      strategic_thinking: 5,
      command_ability: 5,
    },
    ai_profile: {
      aggression_level: 5,
      cooperation_likelihood: 5,
      negotiation_willingness: 5,
      betrayal_probability: 5,
      desperation_threshold: 5,
      pride_factor: 5,
      fear_factor: 5,
    },
    capabilities: [],
    weaknesses: [],
    special_abilities: [],
    technology_advantages: [],
    background: {
      origin: "",
      motivation: "",
      goals: [],
      allies: [],
      enemies: [],
      past_encounters: [],
    },
    tactics: {
      preferred_strategies: [],
      known_ships: [],
      typical_forces: "",
      operational_range: "",
      supply_requirements: [],
    },
    decision_patterns: {
      when_winning: [],
      when_losing: [],
      when_cornered: [],
      diplomatic_approach: [],
      military_priorities: [],
    },
  });

  // Predefined enemy database
  const knownEnemies: Enemy[] = [
    {
      id: "borg-001",
      name: "Borg Collective",
      species: "Cybernetic Collective",
      faction: "Borg Collective",
      rank: "Collective Entity",
      class: "Collective",
      type: "Cybernetic",
      threat_level: "Existential",
      attributes: {
        strength: 10,
        intelligence: 9,
        cunning: 3,
        ruthlessness: 10,
        resources: 10,
        technology: 10,
        influence: 8,
        adaptability: 10,
      },
      combat: {
        tactical_rating: 7,
        fleet_strength: 10,
        individual_prowess: 8,
        strategic_thinking: 6,
        command_ability: 9,
      },
      ai_profile: {
        aggression_level: 8,
        cooperation_likelihood: 1,
        negotiation_willingness: 1,
        betrayal_probability: 10,
        desperation_threshold: 1,
        pride_factor: 2,
        fear_factor: 1,
      },
      capabilities: [
        "Adaptation",
        "Assimilation",
        "Collective Intelligence",
        "Advanced Technology",
        "Regeneration",
      ],
      weaknesses: [
        "Predictable Tactics",
        "Vulnerable to Chaos",
        "Dependency on Collective",
      ],
      special_abilities: [
        "Adaptive Shields",
        "Nanoprobes",
        "Transwarp Technology",
      ],
      technology_advantages: [
        "Transwarp Conduits",
        "Adaptive Technology",
        "Regenerative Hulls",
      ],
      background: {
        origin: "Delta Quadrant",
        motivation: "Perfection through Assimilation",
        goals: ["Assimilate all species", "Achieve technological perfection"],
        allies: ["None"],
        enemies: ["All organic species", "Species 8472"],
        past_encounters: [
          "Battle of Wolf 359",
          "Enterprise encounters",
          "Voyager conflicts",
        ],
      },
      tactics: {
        preferred_strategies: [
          "Direct Assault",
          "Technological Adaptation",
          "Overwhelming Force",
        ],
        known_ships: ["Borg Cube", "Borg Sphere", "Tactical Cube"],
        typical_forces: "Multiple cubes with drone complements",
        operational_range: "Galaxy-wide via transwarp",
        supply_requirements: ["Energy", "Raw materials for assimilation"],
      },
      decision_patterns: {
        when_winning: [
          "Press advantage",
          "Adapt to resistance",
          "Expand assimilation",
        ],
        when_losing: [
          "Adapt shields",
          "Call reinforcements",
          "Retreat via transwarp",
        ],
        when_cornered: ["Self-destruct to prevent technology capture"],
        diplomatic_approach: [
          "Demand immediate surrender",
          "Offer assimilation",
        ],
        military_priorities: [
          "Adapt to enemy weapons",
          "Protect collective assets",
        ],
      },
    },
    {
      id: "dominion-001",
      name: "The Dominion",
      species: "Founders/Changelings",
      faction: "Dominion",
      rank: "Galactic Empire",
      class: "Empire",
      type: "Hybrid",
      threat_level: "Extreme",
      attributes: {
        strength: 9,
        intelligence: 9,
        cunning: 10,
        ruthlessness: 9,
        resources: 10,
        technology: 8,
        influence: 9,
        adaptability: 8,
      },
      combat: {
        tactical_rating: 9,
        fleet_strength: 10,
        individual_prowess: 7,
        strategic_thinking: 10,
        command_ability: 10,
      },
      ai_profile: {
        aggression_level: 7,
        cooperation_likelihood: 3,
        negotiation_willingness: 6,
        betrayal_probability: 8,
        desperation_threshold: 4,
        pride_factor: 9,
        fear_factor: 3,
      },
      capabilities: [
        "Shape-shifting",
        "Genetic Engineering",
        "Strategic Planning",
        "Vast Resources",
      ],
      weaknesses: [
        "Overconfidence",
        "Dependence on Order",
        "Limited Adaptability",
      ],
      special_abilities: [
        "Founder Infiltration",
        "Jem'Hadar Breeding",
        "Vorta Cloning",
      ],
      technology_advantages: [
        "Polaron Weapons",
        "Dominion Ships",
        "Ketracel White",
      ],
      background: {
        origin: "Gamma Quadrant",
        motivation: "Order and Control",
        goals: ["Galactic dominance", "Eliminate threats to order"],
        allies: ["Cardassian Union (formerly)", "Breen Confederacy"],
        enemies: [
          "United Federation of Planets",
          "Klingon Empire",
          "Romulan Star Empire",
        ],
        past_encounters: ["Dominion War", "Deep Space Nine conflicts"],
      },
      tactics: {
        preferred_strategies: [
          "Infiltration",
          "Political Manipulation",
          "Overwhelming Force",
        ],
        known_ships: [
          "Dominion Battlecruiser",
          "Jem'Hadar Attack Ship",
          "Dominion Dreadnought",
        ],
        typical_forces: "Massive fleets with Jem'Hadar warriors",
        operational_range: "Gamma Quadrant, expanding to Alpha",
        supply_requirements: ["Ketracel White", "Industrial resources"],
      },
      decision_patterns: {
        when_winning: ["Consolidate gains", "Eliminate remaining resistance"],
        when_losing: [
          "Strategic retreat",
          "Deploy infiltrators",
          "Seek new allies",
        ],
        when_cornered: ["Scorched earth tactics", "Desperate alliances"],
        diplomatic_approach: [
          "Offer limited autonomy",
          "Demand unconditional surrender",
        ],
        military_priorities: ["Protect Founders", "Maintain supply lines"],
      },
    },
    {
      id: "cardassian-001",
      name: "Gul Dukat",
      species: "Cardassian",
      faction: "Cardassian Union",
      rank: "Gul",
      class: "Individual",
      type: "Biological",
      threat_level: "High",
      attributes: {
        strength: 6,
        intelligence: 8,
        cunning: 9,
        ruthlessness: 8,
        resources: 7,
        technology: 7,
        influence: 8,
        adaptability: 7,
      },
      combat: {
        tactical_rating: 8,
        fleet_strength: 6,
        individual_prowess: 6,
        strategic_thinking: 9,
        command_ability: 8,
      },
      ai_profile: {
        aggression_level: 7,
        cooperation_likelihood: 4,
        negotiation_willingness: 7,
        betrayal_probability: 8,
        desperation_threshold: 6,
        pride_factor: 10,
        fear_factor: 4,
      },
      capabilities: [
        "Political Manipulation",
        "Military Command",
        "Strategic Planning",
      ],
      weaknesses: [
        "Excessive Pride",
        "Underestimates Opponents",
        "Emotional Decisions",
      ],
      special_abilities: ["Charismatic Leadership", "Political Connections"],
      technology_advantages: ["Cardassian Ships", "Orbital Weapons Platforms"],
      background: {
        origin: "Cardassia Prime",
        motivation: "Cardassian Supremacy and Personal Glory",
        goals: ["Restore Cardassian Empire", "Defeat Federation"],
        allies: ["Dominion (formerly)", "Cardassian Central Command"],
        enemies: ["Bajoran Resistance", "Federation", "Klingons"],
        past_encounters: [
          "Occupation of Bajor",
          "Dominion War",
          "DS9 conflicts",
        ],
      },
      tactics: {
        preferred_strategies: [
          "Political Intrigue",
          "Surprise Attacks",
          "Psychological Warfare",
        ],
        known_ships: ["Galor-class Cruisers", "Keldon-class Destroyers"],
        typical_forces: "Cardassian military units and allies",
        operational_range: "Alpha Quadrant, primarily Cardassian space",
        supply_requirements: ["Cardassian resources", "Political support"],
      },
      decision_patterns: {
        when_winning: ["Press advantage ruthlessly", "Claim personal credit"],
        when_losing: [
          "Blame subordinates",
          "Seek new alliances",
          "Retreat with dignity",
        ],
        when_cornered: [
          "Desperate gambits",
          "Appeal to pride",
          "Threaten mutual destruction",
        ],
        diplomatic_approach: [
          "Offer face-saving compromises",
          "Demand respect",
        ],
        military_priorities: [
          "Protect Cardassian interests",
          "Maintain command structure",
        ],
      },
    },
  ];

  const specialAbilities = [
    "Telepathy",
    "Shape-shifting",
    "Regeneration",
    "Phase Shifting",
    "Energy Manipulation",
    "Technopathy",
    "Hive Mind",
    "Precognition",
    "Time Manipulation",
    "Matter Conversion",
    "Subspace Manipulation",
    "Quantum Entanglement",
    "Dimensional Travel",
    "Psionic Powers",
    "Nanite Control",
    "Biological Adaptation",
    "Energy Absorption",
    "Holographic Projection",
  ];

  const capabilities = [
    "Advanced Technology",
    "Superior Numbers",
    "Strategic Planning",
    "Infiltration",
    "Political Manipulation",
    "Resource Control",
    "Information Networks",
    "Mobility",
    "Defensive Positions",
    "Specialized Weapons",
    "Elite Forces",
    "Psychological Warfare",
    "Economic Power",
    "Diplomatic Immunity",
    "Temporal Technology",
    "Adaptive Systems",
  ];

  const weaknesses = [
    "Overconfidence",
    "Predictable Tactics",
    "Resource Limitations",
    "Communication Issues",
    "Moral Constraints",
    "Internal Conflicts",
    "Technological Dependencies",
    "Emotional Decisions",
    "Rigid Hierarchy",
    "Supply Line Vulnerabilities",
    "Cultural Blindspots",
    "Isolation",
    "Fear of Specific Threats",
    "Outdated Information",
    "Limited Adaptability",
    "Ego Issues",
  ];

  const updateEnemy = (field: string, value: any) => {
    setCurrentEnemy((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setCurrentEnemy((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const addArrayItem = (parent: string, field: string, value: string) => {
    if (!value.trim()) return;
    setCurrentEnemy((prev) => {
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
    setCurrentEnemy((prev) => {
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

  const saveEnemy = () => {
    const enemy: Enemy = {
      id: `enemy-${Date.now()}`,
      ...(currentEnemy as Enemy),
    };
    setEnemies((prev) => [...prev, enemy]);
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case "Minimal":
        return "text-green-400 border-green-400";
      case "Low":
        return "text-trek-blue border-trek-blue";
      case "Medium":
        return "text-trek-warning border-trek-warning";
      case "High":
        return "text-red-400 border-red-400";
      case "Extreme":
        return "text-red-500 border-red-500";
      case "Existential":
        return "text-red-600 border-red-600";
      default:
        return "text-trek-text border-trek-text";
    }
  };

  const calculateThreatRating = (enemy: Partial<Enemy>) => {
    if (!enemy.attributes || !enemy.combat) return 0;

    const attrTotal = Object.values(enemy.attributes).reduce(
      (sum, val) => sum + val,
      0,
    );
    const combatTotal = Object.values(enemy.combat).reduce(
      (sum, val) => sum + val,
      0,
    );

    return Math.round(((attrTotal + combatTotal) / 13) * 10);
  };

  const predictBehavior = (enemy: Partial<Enemy>, situation: string) => {
    if (!enemy.ai_profile) return "Unknown behavior pattern";

    const { aggression_level, cooperation_likelihood, betrayal_probability } =
      enemy.ai_profile;

    switch (situation) {
      case "negotiation":
        if (cooperation_likelihood > 7)
          return "Likely to negotiate in good faith";
        if (betrayal_probability > 7)
          return "High risk of deception during talks";
        return "Cautious approach to negotiations";
      case "cornered":
        if (aggression_level > 8) return "Extremely dangerous when cornered";
        if (cooperation_likelihood > 6) return "May surrender if offered terms";
        return "Unpredictable when desperate";
      default:
        return "Behavior analysis requires more data";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          NEMESIS SYSTEM
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={saveEnemy}
            className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark font-semibold"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Enemy
          </Button>
          <Button
            variant="outline"
            className="border-trek-accent text-trek-text hover:bg-trek-accent"
          >
            <Bot className="w-4 h-4 mr-2" />
            AI Analysis
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-trek-panel border border-trek-accent">
          <TabsTrigger
            value="database"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Threat Database
          </TabsTrigger>
          <TabsTrigger
            value="create"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Create Enemy
          </TabsTrigger>
          <TabsTrigger
            value="ai"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            AI Profiles
          </TabsTrigger>
          <TabsTrigger
            value="tactics"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Tactical Analysis
          </TabsTrigger>
          <TabsTrigger
            value="scenarios"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Combat Scenarios
          </TabsTrigger>
          <TabsTrigger
            value="prediction"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Behavior Prediction
          </TabsTrigger>
        </TabsList>

        <TabsContent value="database" className="mt-6">
          <div className="space-y-6">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Known Threats Database
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {knownEnemies.map((enemy) => (
                  <Card
                    key={enemy.id}
                    className="bg-trek-dark/50 border-trek-accent p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-trek-gold">
                          {enemy.name}
                        </h4>
                        <p className="text-sm text-trek-text/70">
                          {enemy.species}
                        </p>
                        <p className="text-xs text-trek-blue">
                          {enemy.faction}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getThreatColor(enemy.threat_level)}`}
                      >
                        {enemy.threat_level}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Class:</span>
                        <span className="text-trek-blue">{enemy.class}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="text-trek-text">{enemy.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Threat Rating:</span>
                        <span className="text-trek-warning">
                          {calculateThreatRating(enemy)}/100
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Overall Threat Level</span>
                        <span>{calculateThreatRating(enemy)}%</span>
                      </div>
                      <Progress
                        value={calculateThreatRating(enemy)}
                        className="h-2"
                      />
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Analyze
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        <Target className="w-3 h-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Custom Enemies
              </h3>

              {enemies.length === 0 ? (
                <div className="text-center py-12">
                  <Skull className="w-16 h-16 text-trek-text/50 mx-auto mb-4" />
                  <p className="text-trek-text/70">
                    No custom enemies created yet.
                  </p>
                  <p className="text-sm text-trek-text/50">
                    Use the Create Enemy tab to add new threats.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {enemies.map((enemy) => (
                    <Card
                      key={enemy.id}
                      className="bg-trek-dark/50 border-trek-accent p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-trek-gold">
                            {enemy.name}
                          </h4>
                          <p className="text-sm text-trek-text/70">
                            {enemy.species}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getThreatColor(enemy.threat_level)}`}
                        >
                          {enemy.threat_level}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Rank:</span>
                          <span className="text-trek-blue">{enemy.rank}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Class:</span>
                          <span className="text-trek-text">{enemy.class}</span>
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
          </div>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <div className="space-y-6">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Basic Enemy Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="enemy-name" className="text-trek-text">
                    Name
                  </Label>
                  <Input
                    id="enemy-name"
                    value={currentEnemy.name || ""}
                    onChange={(e) => updateEnemy("name", e.target.value)}
                    placeholder="Enemy name"
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>

                <div>
                  <Label htmlFor="enemy-species" className="text-trek-text">
                    Species
                  </Label>
                  <Input
                    id="enemy-species"
                    value={currentEnemy.species || ""}
                    onChange={(e) => updateEnemy("species", e.target.value)}
                    placeholder="Species or race"
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>

                <div>
                  <Label htmlFor="enemy-faction" className="text-trek-text">
                    Faction
                  </Label>
                  <Input
                    id="enemy-faction"
                    value={currentEnemy.faction || ""}
                    onChange={(e) => updateEnemy("faction", e.target.value)}
                    placeholder="Organization or empire"
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>

                <div>
                  <Label htmlFor="enemy-rank" className="text-trek-text">
                    Rank/Title
                  </Label>
                  <Input
                    id="enemy-rank"
                    value={currentEnemy.rank || ""}
                    onChange={(e) => updateEnemy("rank", e.target.value)}
                    placeholder="Military or political rank"
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>

                <div>
                  <Label htmlFor="enemy-class" className="text-trek-text">
                    Enemy Class
                  </Label>
                  <Select
                    value={currentEnemy.class || ""}
                    onValueChange={(value) => updateEnemy("class", value)}
                  >
                    <SelectTrigger className="bg-trek-dark border-trek-accent">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="Squad">Squad</SelectItem>
                      <SelectItem value="Fleet">Fleet</SelectItem>
                      <SelectItem value="Empire">Empire</SelectItem>
                      <SelectItem value="Collective">Collective</SelectItem>
                      <SelectItem value="Entity">Entity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="enemy-type" className="text-trek-text">
                    Type
                  </Label>
                  <Select
                    value={currentEnemy.type || ""}
                    onValueChange={(value) => updateEnemy("type", value)}
                  >
                    <SelectTrigger className="bg-trek-dark border-trek-accent">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Biological">Biological</SelectItem>
                      <SelectItem value="Artificial">Artificial</SelectItem>
                      <SelectItem value="Energy">Energy</SelectItem>
                      <SelectItem value="Cybernetic">Cybernetic</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="threat-level" className="text-trek-text">
                    Threat Level
                  </Label>
                  <Select
                    value={currentEnemy.threat_level || ""}
                    onValueChange={(value) =>
                      updateEnemy("threat_level", value)
                    }
                  >
                    <SelectTrigger className="bg-trek-dark border-trek-accent">
                      <SelectValue placeholder="Select threat level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Minimal">Minimal</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Extreme">Extreme</SelectItem>
                      <SelectItem value="Existential">Existential</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="origin" className="text-trek-text">
                    Origin
                  </Label>
                  <Input
                    id="origin"
                    value={currentEnemy.background?.origin || ""}
                    onChange={(e) =>
                      updateNestedField("background", "origin", e.target.value)
                    }
                    placeholder="Homeworld or region of origin"
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>

                <div className="md:col-span-3">
                  <Label htmlFor="motivation" className="text-trek-text">
                    Primary Motivation
                  </Label>
                  <Textarea
                    id="motivation"
                    value={currentEnemy.background?.motivation || ""}
                    onChange={(e) =>
                      updateNestedField(
                        "background",
                        "motivation",
                        e.target.value,
                      )
                    }
                    placeholder="What drives this enemy..."
                    className="bg-trek-dark border-trek-accent"
                    rows={3}
                  />
                </div>
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Attributes & Capabilities
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-trek-gold mb-4">
                    Core Attributes
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(currentEnemy.attributes || {}).map(
                      ([attr, value]) => (
                        <div key={attr} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-trek-text capitalize">
                              {attr}
                            </Label>
                            <span className="text-trek-blue font-semibold">
                              {value}/10
                            </span>
                          </div>
                          <Slider
                            value={[value]}
                            onValueChange={(newValue) =>
                              updateNestedField("attributes", attr, newValue[0])
                            }
                            max={10}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-4">
                    Combat Rating
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(currentEnemy.combat || {}).map(
                      ([skill, value]) => (
                        <div key={skill} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-trek-text capitalize">
                              {skill.replace(/_/g, " ")}
                            </Label>
                            <span className="text-trek-blue font-semibold">
                              {value}/10
                            </span>
                          </div>
                          <Slider
                            value={[value]}
                            onValueChange={(newValue) =>
                              updateNestedField("combat", skill, newValue[0])
                            }
                            max={10}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Current Threat Rating
                  </h4>
                  <div className="flex items-center gap-4">
                    <Progress
                      value={calculateThreatRating(currentEnemy)}
                      className="flex-1 h-4"
                    />
                    <span className="text-2xl font-bold text-trek-warning">
                      {calculateThreatRating(currentEnemy)}/100
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Capabilities & Weaknesses
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-trek-text">Known Capabilities</Label>
                  <div className="mt-2 space-y-2">
                    {capabilities.map((capability) => (
                      <div
                        key={capability}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`capability-${capability}`}
                          checked={
                            currentEnemy.capabilities?.includes(capability) ||
                            false
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              const caps = currentEnemy.capabilities || [];
                              setCurrentEnemy((prev) => ({
                                ...prev,
                                capabilities: [...caps, capability],
                              }));
                            } else {
                              const caps = currentEnemy.capabilities || [];
                              setCurrentEnemy((prev) => ({
                                ...prev,
                                capabilities: caps.filter(
                                  (c) => c !== capability,
                                ),
                              }));
                            }
                          }}
                        />
                        <Label
                          htmlFor={`capability-${capability}`}
                          className="text-sm text-trek-text"
                        >
                          {capability}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-trek-text">Known Weaknesses</Label>
                  <div className="mt-2 space-y-2">
                    {weaknesses.map((weakness) => (
                      <div
                        key={weakness}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`weakness-${weakness}`}
                          checked={
                            currentEnemy.weaknesses?.includes(weakness) || false
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              const weak = currentEnemy.weaknesses || [];
                              setCurrentEnemy((prev) => ({
                                ...prev,
                                weaknesses: [...weak, weakness],
                              }));
                            } else {
                              const weak = currentEnemy.weaknesses || [];
                              setCurrentEnemy((prev) => ({
                                ...prev,
                                weaknesses: weak.filter((w) => w !== weakness),
                              }));
                            }
                          }}
                        />
                        <Label
                          htmlFor={`weakness-${weakness}`}
                          className="text-sm text-trek-text"
                        >
                          {weakness}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Label className="text-trek-text">Special Abilities</Label>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {specialAbilities.map((ability) => (
                    <div key={ability} className="flex items-center space-x-2">
                      <Checkbox
                        id={`ability-${ability}`}
                        checked={
                          currentEnemy.special_abilities?.includes(ability) ||
                          false
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            const abilities =
                              currentEnemy.special_abilities || [];
                            setCurrentEnemy((prev) => ({
                              ...prev,
                              special_abilities: [...abilities, ability],
                            }));
                          } else {
                            const abilities =
                              currentEnemy.special_abilities || [];
                            setCurrentEnemy((prev) => ({
                              ...prev,
                              special_abilities: abilities.filter(
                                (a) => a !== ability,
                              ),
                            }));
                          }
                        }}
                      />
                      <Label
                        htmlFor={`ability-${ability}`}
                        className="text-sm text-trek-text"
                      >
                        {ability}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={saveEnemy}
                  className="w-full bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Enemy to Database
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-6">
              AI Behavioral Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(currentEnemy.ai_profile || {}).map(
                ([trait, value]) => (
                  <div key={trait} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-trek-text capitalize">
                        {trait.replace(/_/g, " ")}
                      </Label>
                      <span className="text-trek-blue font-semibold">
                        {value}/10
                      </span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={(newValue) =>
                        updateNestedField("ai_profile", trait, newValue[0])
                      }
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-trek-text/70">
                      {trait === "aggression_level" &&
                        (value <= 3
                          ? "Passive"
                          : value <= 6
                            ? "Moderate"
                            : value <= 8
                              ? "Aggressive"
                              : "Extremely Hostile")}
                      {trait === "cooperation_likelihood" &&
                        (value <= 3
                          ? "Uncooperative"
                          : value <= 6
                            ? "Selective"
                            : value <= 8
                              ? "Cooperative"
                              : "Highly Collaborative")}
                      {trait === "betrayal_probability" &&
                        (value <= 3
                          ? "Trustworthy"
                          : value <= 6
                            ? "Occasionally Deceptive"
                            : value <= 8
                              ? "Untrustworthy"
                              : "Will Always Betray")}
                    </div>
                  </div>
                ),
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                <h4 className="font-semibold text-trek-gold mb-2">
                  Behavioral Prediction
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>In Negotiation:</strong>{" "}
                    {predictBehavior(currentEnemy, "negotiation")}
                  </div>
                  <div>
                    <strong>When Cornered:</strong>{" "}
                    {predictBehavior(currentEnemy, "cornered")}
                  </div>
                  <div>
                    <strong>Overall Risk:</strong>{" "}
                    {calculateThreatRating(currentEnemy) > 80
                      ? "Extreme Caution Required"
                      : calculateThreatRating(currentEnemy) > 60
                        ? "High Risk Engagement"
                        : calculateThreatRating(currentEnemy) > 40
                          ? "Moderate Threat"
                          : "Manageable Risk"}
                  </div>
                </div>
              </div>

              <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                <h4 className="font-semibold text-trek-gold mb-2">
                  AI Recommendations
                </h4>
                <div className="space-y-1 text-sm">
                  {currentEnemy.ai_profile?.aggression_level > 7 && (
                    <div>• Avoid direct confrontation when possible</div>
                  )}
                  {currentEnemy.ai_profile?.betrayal_probability > 7 && (
                    <div>• Never trust agreements or alliances</div>
                  )}
                  {currentEnemy.ai_profile?.cooperation_likelihood < 4 && (
                    <div>• Diplomatic solutions unlikely to succeed</div>
                  )}
                  {currentEnemy.ai_profile?.pride_factor > 7 && (
                    <div>• Exploit ego and overconfidence</div>
                  )}
                  {currentEnemy.ai_profile?.fear_factor > 6 && (
                    <div>• Psychological warfare may be effective</div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="tactics" className="mt-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-6">
              Tactical Analysis
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-trek-gold mb-4">
                  Recommended Strategies
                </h4>
                <div className="space-y-3">
                  {currentEnemy.capabilities?.includes(
                    "Advanced Technology",
                  ) && (
                    <div className="bg-trek-dark/50 border border-trek-accent rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Cpu className="w-4 h-4 text-trek-blue" />
                        <span className="font-medium">
                          Technology Countermeasures
                        </span>
                      </div>
                      <p className="text-sm text-trek-text/80">
                        Deploy adaptive shields and electronic warfare systems.
                      </p>
                    </div>
                  )}

                  {currentEnemy.capabilities?.includes("Superior Numbers") && (
                    <div className="bg-trek-dark/50 border border-trek-accent rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-trek-warning" />
                        <span className="font-medium">Divide and Conquer</span>
                      </div>
                      <p className="text-sm text-trek-text/80">
                        Split enemy forces and engage smaller groups.
                      </p>
                    </div>
                  )}

                  {currentEnemy.weaknesses?.includes("Overconfidence") && (
                    <div className="bg-trek-dark/50 border border-trek-accent rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-green-400" />
                        <span className="font-medium">Exploit Arrogance</span>
                      </div>
                      <p className="text-sm text-trek-text/80">
                        Use enemy's overconfidence to set traps and ambushes.
                      </p>
                    </div>
                  )}

                  {currentEnemy.weaknesses?.includes("Predictable Tactics") && (
                    <div className="bg-trek-dark/50 border border-trek-accent rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-trek-blue" />
                        <span className="font-medium">Pattern Disruption</span>
                      </div>
                      <p className="text-sm text-trek-text/80">
                        Use unconventional tactics to break their patterns.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-trek-gold mb-4">
                  Threat Assessment Matrix
                </h4>
                <div className="space-y-3">
                  <div className="bg-trek-dark/50 border border-trek-accent rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span>Combat Effectiveness</span>
                      <span className="text-trek-blue font-semibold">
                        {(Math.round(
                          Object.values(currentEnemy.combat || {}).reduce(
                            (a, b) => a + b,
                            0,
                          ) / 5,
                        ) /
                          10) *
                          100}
                        %
                      </span>
                    </div>
                    <Progress
                      value={Math.round(
                        Object.values(currentEnemy.combat || {}).reduce(
                          (a, b) => a + b,
                          0,
                        ) / 5,
                      )}
                      className="h-2"
                    />
                  </div>

                  <div className="bg-trek-dark/50 border border-trek-accent rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span>Strategic Threat</span>
                      <span className="text-trek-warning font-semibold">
                        {(Math.round(
                          ((currentEnemy.attributes?.intelligence || 0) +
                            (currentEnemy.attributes?.cunning || 0)) /
                            2,
                        ) /
                          10) *
                          100}
                        %
                      </span>
                    </div>
                    <Progress
                      value={Math.round(
                        ((currentEnemy.attributes?.intelligence || 0) +
                          (currentEnemy.attributes?.cunning || 0)) /
                          2,
                      )}
                      className="h-2"
                    />
                  </div>

                  <div className="bg-trek-dark/50 border border-trek-accent rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span>Resource Capacity</span>
                      <span className="text-trek-gold font-semibold">
                        {((currentEnemy.attributes?.resources || 0) / 10) * 100}
                        %
                      </span>
                    </div>
                    <Progress
                      value={currentEnemy.attributes?.resources || 0}
                      className="h-2"
                    />
                  </div>

                  <div className="bg-trek-dark/50 border border-trek-accent rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span>Negotiation Potential</span>
                      <span className="text-green-400 font-semibold">
                        {((currentEnemy.ai_profile?.cooperation_likelihood ||
                          0) /
                          10) *
                          100}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        currentEnemy.ai_profile?.cooperation_likelihood || 0
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="mt-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-6">
              Combat Scenario Simulator
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-trek-gold mb-4">
                  Scenario Parameters
                </h4>
                <div className="space-y-4">
                  <div>
                    <Label className="text-trek-text">Enemy Force Size</Label>
                    <Select>
                      <SelectTrigger className="bg-trek-dark border-trek-accent">
                        <SelectValue placeholder="Select force size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single Ship</SelectItem>
                        <SelectItem value="squadron">
                          Squadron (3-5 ships)
                        </SelectItem>
                        <SelectItem value="fleet">
                          Fleet (6-20 ships)
                        </SelectItem>
                        <SelectItem value="armada">
                          Armada (20+ ships)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-trek-text">Engagement Type</Label>
                    <Select>
                      <SelectTrigger className="bg-trek-dark border-trek-accent">
                        <SelectValue placeholder="Select engagement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ambush">Ambush</SelectItem>
                        <SelectItem value="frontal">Frontal Assault</SelectItem>
                        <SelectItem value="defensive">
                          Defensive Action
                        </SelectItem>
                        <SelectItem value="pursuit">Pursuit</SelectItem>
                        <SelectItem value="standoff">
                          Long-range Standoff
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-trek-text">
                      Terrain/Environment
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-trek-dark border-trek-accent">
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open Space</SelectItem>
                        <SelectItem value="nebula">Nebula</SelectItem>
                        <SelectItem value="asteroid">Asteroid Field</SelectItem>
                        <SelectItem value="planetary">
                          Planetary System
                        </SelectItem>
                        <SelectItem value="station">
                          Near Space Station
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-trek-blue hover:bg-trek-blue/80 text-trek-dark">
                    <Activity className="w-4 h-4 mr-2" />
                    Run Simulation
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-trek-gold mb-4">
                  Simulation Results
                </h4>
                <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Federation Victory Probability:</span>
                      <span className="text-trek-blue font-semibold">68%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Casualties:</span>
                      <span className="text-trek-warning font-semibold">
                        Moderate
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recommended Approach:</span>
                      <span className="text-green-400 font-semibold">
                        Tactical
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mission Duration:</span>
                      <span className="text-trek-text">4.7 hours</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-trek-accent">
                    <h5 className="font-medium text-trek-gold mb-2">
                      Key Factors
                    </h5>
                    <ul className="space-y-1 text-xs">
                      <li>• Enemy adapts quickly to conventional tactics</li>
                      <li>• Flanking maneuvers show 23% higher success rate</li>
                      <li>• EMP weapons effective against their shields</li>
                      <li>
                        • Avoid prolonged engagement due to reinforcements
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="prediction" className="mt-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-6">
              Behavioral Prediction Engine
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-trek-gold mb-4">
                  Scenario Analysis
                </h4>
                <div className="space-y-4">
                  <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                    <h5 className="font-medium text-trek-blue mb-2">
                      Diplomatic Contact
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Cooperation Likelihood:</span>
                        <span className="text-green-400">
                          {(currentEnemy.ai_profile?.cooperation_likelihood ||
                            0) * 10}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Betrayal Risk:</span>
                        <span className="text-red-400">
                          {(currentEnemy.ai_profile?.betrayal_probability ||
                            0) * 10}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Negotiation Success:</span>
                        <span className="text-trek-warning">
                          {(currentEnemy.ai_profile?.negotiation_willingness ||
                            0) * 10}
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                    <h5 className="font-medium text-trek-blue mb-2">
                      Combat Engagement
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Initial Aggression:</span>
                        <span className="text-red-400">
                          {(currentEnemy.ai_profile?.aggression_level || 0) *
                            10}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Surrender Threshold:</span>
                        <span className="text-trek-blue">
                          {100 -
                            (currentEnemy.ai_profile?.pride_factor || 0) * 10}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Desperation Point:</span>
                        <span className="text-trek-warning">
                          {(currentEnemy.ai_profile?.desperation_threshold ||
                            0) * 10}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-trek-gold mb-4">
                  AI Decision Tree
                </h4>
                <div className="space-y-3">
                  <div className="bg-trek-dark/50 border border-trek-accent rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-4 h-4 text-trek-blue" />
                      <span className="font-medium">
                        Primary Decision Factors
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div>
                        1. Threat Assessment:{" "}
                        {calculateThreatRating(currentEnemy)}% danger level
                      </div>
                      <div>
                        2. Resource Evaluation:{" "}
                        {(currentEnemy.attributes?.resources || 0) * 10}%
                        availability
                      </div>
                      <div>3. Victory Probability: Calculated real-time</div>
                      <div>
                        4. Political Considerations:{" "}
                        {(currentEnemy.attributes?.influence || 0) * 10}% weight
                      </div>
                    </div>
                  </div>

                  <div className="bg-trek-dark/50 border border-trek-accent rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-green-400" />
                      <span className="font-medium">Recommended Responses</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      {currentEnemy.ai_profile?.cooperation_likelihood > 6 && (
                        <div>• Attempt diplomatic solutions first</div>
                      )}
                      {currentEnemy.ai_profile?.betrayal_probability > 7 && (
                        <div>• Prepare for treachery in all interactions</div>
                      )}
                      {currentEnemy.ai_profile?.aggression_level > 8 && (
                        <div>• Maintain defensive posture</div>
                      )}
                      {currentEnemy.ai_profile?.pride_factor > 7 && (
                        <div>• Exploit overconfidence</div>
                      )}
                      {currentEnemy.ai_profile?.fear_factor > 6 && (
                        <div>• Psychological pressure tactics viable</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
