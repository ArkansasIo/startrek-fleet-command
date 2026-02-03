import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  Shield,
  Target,
  Eye,
  Zap,
  Skull,
  Brain,
  Activity,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Database,
  Clock,
  MapPin,
  Users,
  Radar,
  Crosshair,
  Warning,
  AlertCircle,
  XCircle,
  CheckCircle,
} from "lucide-react";

interface ThreatEntity {
  id: string;
  name: string;
  classification:
    | "Species"
    | "Organization"
    | "Technology"
    | "Phenomenon"
    | "Individual"
    | "Artifact";
  threat_level: number;
  fear_factor: number;
  intelligence_level: number;
  military_capability: number;
  territorial_range:
    | "Galactic"
    | "Quadrant"
    | "Sector"
    | "System"
    | "Planetary"
    | "Unknown";
  first_encounter: string;
  last_activity: string;
  status: "Active" | "Dormant" | "Contained" | "Neutralized" | "Unknown";
  primary_fears: string[];
  psychological_profile: {
    aggression: number;
    unpredictability: number;
    intelligence: number;
    technology_level: number;
    biological_threat: number;
  };
  known_weaknesses: string[];
  containment_protocols: string[];
  fear_responses_documented: string[];
  casualties_caused: number;
  ships_destroyed: number;
  civilizations_threatened: number;
  quadrant_location: "Alpha" | "Beta" | "Gamma" | "Delta" | "Unknown";
  strategic_assessment: string;
  recommended_actions: string[];
  starfleet_priority: "Critical" | "High" | "Medium" | "Low" | "Monitor";
}

interface FearProfile {
  id: string;
  species: string;
  fear_name: string;
  description: string;
  trigger_conditions: string[];
  physiological_responses: string[];
  psychological_impact: number;
  survival_instinct_override: number;
  documented_cases: number;
  mitigation_strategies: string[];
  cultural_significance: string;
  evolutionary_basis?: string;
}

interface ThreatIncident {
  id: string;
  incident_name: string;
  threat_entity_id: string;
  stardate: number;
  location: string;
  severity: number;
  casualties: number;
  ships_lost: number;
  description: string;
  fear_responses_observed: string[];
  lessons_learned: string[];
  protocol_changes: string[];
  status: "Resolved" | "Ongoing" | "Under Investigation";
  witnesses: string[];
}

export function ThreatAssessment() {
  const [activeTab, setActiveTab] = useState<
    "threats" | "fears" | "incidents" | "protocols"
  >("threats");
  const [selectedThreat, setSelectedThreat] = useState<ThreatEntity | null>(
    null,
  );
  const [selectedFear, setSelectedFear] = useState<FearProfile | null>(null);
  const [filterThreatLevel, setFilterThreatLevel] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const threatEntities: ThreatEntity[] = [
    {
      id: "borg_collective",
      name: "Borg Collective",
      classification: "Species",
      threat_level: 10,
      fear_factor: 10,
      intelligence_level: 10,
      military_capability: 10,
      territorial_range: "Galactic",
      first_encounter: "2365",
      last_activity: "2378",
      status: "Active",
      primary_fears: [
        "Assimilation",
        "Loss of individuality",
        "Technological adaptation",
        "Collective consciousness",
      ],
      psychological_profile: {
        aggression: 9,
        unpredictability: 7,
        intelligence: 10,
        technology_level: 10,
        biological_threat: 10,
      },
      known_weaknesses: [
        "Individuality concepts",
        "Chaos theory",
        "Hugh virus",
        "Queen dependency",
      ],
      containment_protocols: [
        "Maintain minimum safe distance of 100 light-years",
        "Avoid transmission of technological data",
        "Emergency evacuation protocols for nearby systems",
        "Temporal shielding when possible",
      ],
      fear_responses_documented: [
        "Complete crew panic",
        "Abandonment of strategic positions",
        "Self-destruction rather than capture",
        "Mass evacuation of entire star systems",
      ],
      casualties_caused: 11000,
      ships_destroyed: 39,
      civilizations_threatened: 12,
      quadrant_location: "Delta",
      strategic_assessment:
        "Existential threat to all organic life. Adaptation capabilities make conventional defenses ineffective.",
      recommended_actions: [
        "Develop anti-assimilation technologies",
        "Study individual Borg psychology",
        "Maintain detailed tactical databases",
        "Prepare for inevitable future encounters",
      ],
      starfleet_priority: "Critical",
    },
    {
      id: "dominion_empire",
      name: "Dominion",
      classification: "Organization",
      threat_level: 9,
      fear_factor: 8,
      intelligence_level: 9,
      military_capability: 9,
      territorial_range: "Quadrant",
      first_encounter: "2370",
      last_activity: "2375",
      status: "Contained",
      primary_fears: [
        "Genetic engineering",
        "Absolute loyalty",
        "Shapeshifter infiltration",
        "Ketracel-white dependency",
      ],
      psychological_profile: {
        aggression: 8,
        unpredictability: 6,
        intelligence: 9,
        technology_level: 8,
        biological_threat: 9,
      },
      known_weaknesses: [
        "Founder's virus",
        "Ketracel-white supply",
        "Rigid hierarchy",
        "Overconfidence",
      ],
      containment_protocols: [
        "Maintain Gamma Quadrant monitoring",
        "Screen for shapeshifter infiltration",
        "Monitor Ketracel-white production",
        "Diplomatic relations with former subject races",
      ],
      fear_responses_documented: [
        "Paranoia about shapeshifter infiltration",
        "Fear of genetic manipulation",
        "Concern about absolute loyalty programming",
        "Anxiety over superior military tactics",
      ],
      casualties_caused: 800000,
      ships_destroyed: 2500,
      civilizations_threatened: 8,
      quadrant_location: "Gamma",
      strategic_assessment:
        "Highly organized military threat with genetic engineering capabilities. Peace treaty maintains current containment.",
      recommended_actions: [
        "Maintain wormhole monitoring",
        "Develop shapeshifter detection methods",
        "Support democratic movements in former Dominion space",
        "Prepare for treaty violations",
      ],
      starfleet_priority: "High",
    },
    {
      id: "species_8472",
      name: "Species 8472 (Undine)",
      classification: "Species",
      threat_level: 10,
      fear_factor: 9,
      intelligence_level: 9,
      military_capability: 10,
      territorial_range: "Unknown",
      first_encounter: "2374",
      last_activity: "2374",
      status: "Unknown",
      primary_fears: [
        "Immune to assimilation",
        "Bio-ship technology",
        "Fluidic space origin",
        "Xenophobic extremism",
      ],
      psychological_profile: {
        aggression: 10,
        unpredictability: 8,
        intelligence: 9,
        technology_level: 10,
        biological_threat: 10,
      },
      known_weaknesses: [
        "Negotiation potential",
        "Misunderstanding of Alpha Quadrant",
        "Isolation preference",
      ],
      containment_protocols: [
        "Avoid all contact with fluidic space",
        "Maintain peaceful intentions if encountered",
        "Prepare for immediate retreat",
        "Document all encounters for analysis",
      ],
      fear_responses_documented: [
        "Terror at bio-ship capabilities",
        "Fear of their immune system",
        "Anxiety over fluidic space incursions",
        "Concern about their planet-killing weapons",
      ],
      casualties_caused: 5000,
      ships_destroyed: 15,
      civilizations_threatened: 3,
      quadrant_location: "Delta",
      strategic_assessment:
        "Superior technology and immunity to Borg assimilation. Potential for devastating conflict if misunderstood.",
      recommended_actions: [
        "Develop peaceful communication protocols",
        "Study fluidic space interface technology",
        "Prepare diplomatic solutions",
        "Avoid military confrontation at all costs",
      ],
      starfleet_priority: "Critical",
    },
    {
      id: "q_continuum",
      name: "Q Continuum",
      classification: "Species",
      threat_level: 10,
      fear_factor: 7,
      intelligence_level: 10,
      military_capability: 10,
      territorial_range: "Galactic",
      first_encounter: "2364",
      last_activity: "2378",
      status: "Active",
      primary_fears: [
        "Omnipotent abilities",
        "Reality manipulation",
        "Unpredictable behavior",
        "Moral judgment",
      ],
      psychological_profile: {
        aggression: 5,
        unpredictability: 10,
        intelligence: 10,
        technology_level: 10,
        biological_threat: 0,
      },
      known_weaknesses: [
        "Boredom",
        "Curiosity about humanity",
        "Internal conflicts",
        "Moral development",
      ],
      containment_protocols: [
        "Maintain respectful diplomatic stance",
        "Avoid challenging Q authority directly",
        "Demonstrate humanity's potential for growth",
        "Appeal to Q's better nature when possible",
      ],
      fear_responses_documented: [
        "Helplessness against omnipotent beings",
        "Fear of reality manipulation",
        "Anxiety over moral judgment",
        "Concern about unpredictable tests",
      ],
      casualties_caused: 18,
      ships_destroyed: 0,
      civilizations_threatened: 1,
      quadrant_location: "Unknown",
      strategic_assessment:
        "Omnipotent but generally benevolent. Threat level based on potential rather than intent.",
      recommended_actions: [
        "Maintain diplomatic relations",
        "Study Q psychology and motivations",
        "Prepare for unexpected encounters",
        "Focus on human development and growth",
      ],
      starfleet_priority: "Medium",
    },
    {
      id: "gorn_hegemony",
      name: "Gorn Hegemony",
      classification: "Species",
      threat_level: 6,
      fear_factor: 5,
      intelligence_level: 6,
      military_capability: 7,
      territorial_range: "Sector",
      first_encounter: "2267",
      last_activity: "2293",
      status: "Dormant",
      primary_fears: [
        "Physical superiority",
        "Territorial aggression",
        "Slow but methodical tactics",
        "Cold-blooded logic",
      ],
      psychological_profile: {
        aggression: 7,
        unpredictability: 4,
        intelligence: 6,
        technology_level: 7,
        biological_threat: 6,
      },
      known_weaknesses: [
        "Slow movement",
        "Cold-blooded physiology",
        "Territorial rather than expansionist",
      ],
      containment_protocols: [
        "Respect territorial boundaries",
        "Maintain peaceful trade relations",
        "Avoid Gorn space during territorial disputes",
        "Diplomatic contact through neutral parties",
      ],
      fear_responses_documented: [
        "Fear of superior physical strength",
        "Concern about territorial violations",
        "Anxiety over slow but inevitable pursuit",
        "Respect for their tactical patience",
      ],
      casualties_caused: 127,
      ships_destroyed: 3,
      civilizations_threatened: 0,
      quadrant_location: "Beta",
      strategic_assessment:
        "Territorial but not expansionist. Manageable through diplomatic channels and territorial respect.",
      recommended_actions: [
        "Maintain territorial agreements",
        "Develop peaceful trade opportunities",
        "Study Gorn culture and psychology",
        "Prepare for defensive scenarios only",
      ],
      starfleet_priority: "Low",
    },
    {
      id: "tholian_assembly",
      name: "Tholian Assembly",
      classification: "Species",
      threat_level: 7,
      fear_factor: 6,
      intelligence_level: 8,
      military_capability: 8,
      territorial_range: "Sector",
      first_encounter: "2268",
      last_activity: "2374",
      status: "Active",
      primary_fears: [
        "Tholian web technology",
        "Extreme territorial nature",
        "Perfect punctuality",
        "Crystalline physiology",
      ],
      psychological_profile: {
        aggression: 8,
        unpredictability: 3,
        intelligence: 8,
        technology_level: 8,
        biological_threat: 5,
      },
      known_weaknesses: [
        "Extreme heat requirements",
        "Territorial limitations",
        "Predictable behavior patterns",
      ],
      containment_protocols: [
        "Strict adherence to scheduled meetings",
        "Avoid Tholian space except by appointment",
        "Maintain precise diplomatic protocols",
        "Prepare for web entrapment scenarios",
      ],
      fear_responses_documented: [
        "Terror of Tholian web entrapment",
        "Fear of perfect tactical coordination",
        "Anxiety over extreme territorial violations",
        "Concern about crystalline durability",
      ],
      casualties_caused: 234,
      ships_destroyed: 8,
      civilizations_threatened: 0,
      quadrant_location: "Alpha",
      strategic_assessment:
        "Highly territorial but predictable. Manageable through precise diplomatic protocols.",
      recommended_actions: [
        "Maintain precise diplomatic schedules",
        "Respect all territorial boundaries",
        "Study Tholian web countermeasures",
        "Develop heat-based communication methods",
      ],
      starfleet_priority: "Medium",
    },
    {
      id: "doomsday_machine",
      name: "Doomsday Machine",
      classification: "Artifact",
      threat_level: 10,
      fear_factor: 9,
      intelligence_level: 3,
      military_capability: 10,
      territorial_range: "Galactic",
      first_encounter: "2267",
      last_activity: "2267",
      status: "Neutralized",
      primary_fears: [
        "Planet consumption",
        "Unstoppable advance",
        "Unknown origin",
        "Neutronium hull",
      ],
      psychological_profile: {
        aggression: 10,
        unpredictability: 2,
        intelligence: 3,
        technology_level: 10,
        biological_threat: 0,
      },
      known_weaknesses: [
        "Internal structure vulnerability",
        "Predictable behavior",
        "No adaptation capability",
      ],
      containment_protocols: [
        "Monitor for similar artifacts",
        "Maintain detailed tactical analysis",
        "Prepare anti-neutronium weapons",
        "Emergency evacuation protocols for affected systems",
      ],
      fear_responses_documented: [
        "Complete terror at planet consumption",
        "Helplessness against neutronium hull",
        "Fear of unstoppable mechanical advance",
        "Anxiety over unknown creators",
      ],
      casualties_caused: 4000000000,
      ships_destroyed: 1,
      civilizations_threatened: 15,
      quadrant_location: "Alpha",
      strategic_assessment:
        "Neutralized but represents class of ultimate weapons. Study essential for future encounters.",
      recommended_actions: [
        "Continue studying neutronium composition",
        "Search for similar artifacts",
        "Develop contingency plans",
        "Study ancient weapon technologies",
      ],
      starfleet_priority: "High",
    },
    {
      id: "crystalline_entity",
      name: "Crystalline Entity",
      classification: "Phenomenon",
      threat_level: 8,
      fear_factor: 8,
      intelligence_level: 7,
      military_capability: 9,
      territorial_range: "Galactic",
      first_encounter: "2338",
      last_activity: "2368",
      status: "Neutralized",
      primary_fears: [
        "Life energy consumption",
        "Space-dwelling nature",
        "Crystalline structure",
        "Unknown motivations",
      ],
      psychological_profile: {
        aggression: 8,
        unpredictability: 6,
        intelligence: 7,
        technology_level: 8,
        biological_threat: 10,
      },
      known_weaknesses: [
        "Sonic resonance frequencies",
        "Communication attempts",
        "Energy pattern disruption",
      ],
      containment_protocols: [
        "Monitor for energy signatures",
        "Prepare sonic resonance weapons",
        "Evacuation protocols for affected colonies",
        "Communication attempt procedures",
      ],
      fear_responses_documented: [
        "Terror of life energy drain",
        "Fear of unstoppable space entity",
        "Anxiety over crystalline invulnerability",
        "Helplessness against energy consumption",
      ],
      casualties_caused: 50000,
      ships_destroyed: 12,
      civilizations_threatened: 7,
      quadrant_location: "Alpha",
      strategic_assessment:
        "Neutralized through communication attempt. Represents unknown class of space-dwelling entities.",
      recommended_actions: [
        "Study space-dwelling entity physiology",
        "Develop improved communication protocols",
        "Monitor for similar entities",
        "Prepare sonic resonance defenses",
      ],
      starfleet_priority: "Medium",
    },
  ];

  const fearProfiles: FearProfile[] = [
    {
      id: "human_assimilation",
      species: "Human",
      fear_name: "Borg Assimilation Fear",
      description:
        "Deep-seated terror of losing individual identity and becoming part of a collective consciousness",
      trigger_conditions: [
        "Borg proximity",
        "Assimilation nanoprobes",
        "Collective voices",
        "Cybernetic implants",
      ],
      physiological_responses: [
        "Increased heart rate",
        "Adrenaline surge",
        "Paralysis",
        "Panic attacks",
      ],
      psychological_impact: 9,
      survival_instinct_override: 8,
      documented_cases: 847,
      mitigation_strategies: [
        "Psychological preparation training",
        "Neural dampening fields",
        "Emergency beam-out protocols",
        "Post-encounter counseling",
      ],
      cultural_significance:
        "Represents ultimate loss of human autonomy and individuality",
      evolutionary_basis: "Fear of parasitic takeover and loss of self-control",
    },
    {
      id: "vulcan_emotion_loss",
      species: "Vulcan",
      fear_name: "Emotional Suppression Failure",
      description:
        "Fear of losing emotional control and reverting to pre-Surak violent tendencies",
      trigger_conditions: [
        "Pon farr",
        "Mental manipulation",
        "Psychic attacks",
        "Stress overload",
      ],
      physiological_responses: [
        "Increased body temperature",
        "Heightened strength",
        "Mental instability",
      ],
      psychological_impact: 8,
      survival_instinct_override: 7,
      documented_cases: 234,
      mitigation_strategies: [
        "Meditation techniques",
        "Isolation protocols",
        "Mental disciplines",
        "Emergency sedation",
      ],
      cultural_significance:
        "Threatens the foundation of modern Vulcan society",
      evolutionary_basis: "Genetic memory of pre-logical Vulcan violence",
    },
    {
      id: "klingon_dishonor",
      species: "Klingon",
      fear_name: "Loss of Honor",
      description:
        "Deep fear of bringing dishonor to family name and Klingon heritage",
      trigger_conditions: [
        "Cowardice accusations",
        "Family disgrace",
        "Breaking of oaths",
        "Defeat in combat",
      ],
      physiological_responses: [
        "Rage response",
        "Increased aggression",
        "Self-destructive behavior",
      ],
      psychological_impact: 10,
      survival_instinct_override: 9,
      documented_cases: 156,
      mitigation_strategies: [
        "Honor restoration rituals",
        "Combat trials",
        "Family support",
        "Cultural counseling",
      ],
      cultural_significance: "Central to Klingon identity and social structure",
      evolutionary_basis: "Warrior culture survival mechanisms",
    },
    {
      id: "betazoid_empathic_overload",
      species: "Betazoid",
      fear_name: "Empathic Overload",
      description:
        "Fear of being overwhelmed by intense emotions from multiple sources",
      trigger_conditions: [
        "Crowd exposure",
        "Emotional trauma",
        "Psychic attacks",
        "Mental barriers failure",
      ],
      physiological_responses: [
        "Mental shutdown",
        "Emotional paralysis",
        "Psychic feedback",
      ],
      psychological_impact: 8,
      survival_instinct_override: 6,
      documented_cases: 89,
      mitigation_strategies: [
        "Mental shielding techniques",
        "Isolation chambers",
        "Psychic dampening fields",
        "Meditation practices",
      ],
      cultural_significance: "Threatens the gift that defines Betazoid society",
      evolutionary_basis: "Protection against psychic predators",
    },
    {
      id: "andorian_temperature_fear",
      species: "Andorian",
      fear_name: "Extreme Heat Exposure",
      description:
        "Physiological and psychological fear of high temperatures that can be fatal",
      trigger_conditions: [
        "High temperature environments",
        "Life support failure",
        "Desert conditions",
      ],
      physiological_responses: [
        "Rapid dehydration",
        "Organ failure",
        "Heat shock",
      ],
      psychological_impact: 7,
      survival_instinct_override: 9,
      documented_cases: 203,
      mitigation_strategies: [
        "Environmental suits",
        "Cooling systems",
        "Rapid medical intervention",
        "Temperature monitoring",
      ],
      cultural_significance: "Limits exploration of hot climate worlds",
      evolutionary_basis: "Adaptation to ice world environment",
    },
    {
      id: "ferengi_profit_loss",
      species: "Ferengi",
      fear_name: "Financial Ruin",
      description:
        "Terror of losing all material wealth and social standing in Ferengi society",
      trigger_conditions: [
        "Bad investments",
        "Market crashes",
        "Contract violations",
        "Competition",
      ],
      physiological_responses: [
        "Stress-induced illness",
        "Panic attacks",
        "Sleep disorders",
      ],
      psychological_impact: 9,
      survival_instinct_override: 5,
      documented_cases: 445,
      mitigation_strategies: [
        "Diversified investments",
        "Insurance policies",
        "Family support networks",
        "Career retraining",
      ],
      cultural_significance: "Undermines the foundation of Ferengi culture",
      evolutionary_basis: "Resource scarcity survival mechanisms",
    },
  ];

  const threatIncidents: ThreatIncident[] = [
    {
      id: "wolf359",
      incident_name: "Battle of Wolf 359",
      threat_entity_id: "borg_collective",
      stardate: 44002.3,
      location: "Wolf 359 System",
      severity: 10,
      casualties: 11000,
      ships_lost: 39,
      description:
        "Borg cube destroys fleet of 40 Federation starships in devastating battle",
      fear_responses_observed: [
        "Mass panic across Federation",
        "Abandonment of outer colonies",
        "Crew psychological trauma",
        "Strategic doctrine revision",
      ],
      lessons_learned: [
        "Conventional tactics ineffective against Borg",
        "Need for specialized anti-Borg weapons",
        "Importance of rapid response fleets",
        "Psychological preparation essential",
      ],
      protocol_changes: [
        "Development of anti-Borg task forces",
        "Enhanced tactical training",
        "Psychological support protocols",
        "Emergency evacuation procedures",
      ],
      status: "Resolved",
      witnesses: ["Benjamin Sisko", "Survivors from 40 ships"],
    },
    {
      id: "dominion_war_start",
      incident_name: "Dominion War Declaration",
      threat_entity_id: "dominion_empire",
      stardate: 50564.2,
      location: "Deep Space Nine",
      severity: 9,
      casualties: 0,
      ships_lost: 0,
      description:
        "Dominion officially declares war on the Federation and allies",
      fear_responses_observed: [
        "Alpha Quadrant alliance formation",
        "Military mobilization",
        "Civilian evacuation from border worlds",
        "Psychological warfare impact",
      ],
      lessons_learned: [
        "Importance of early intelligence",
        "Need for strong alliances",
        "Preparation for total war",
        "Understanding enemy psychology",
      ],
      protocol_changes: [
        "Enhanced intelligence gathering",
        "Alliance coordination protocols",
        "War-time command structure",
        "Civilian protection measures",
      ],
      status: "Resolved",
      witnesses: ["Benjamin Sisko", "Kira Nerys", "Odo", "Worf"],
    },
    {
      id: "doomsday_encounter",
      incident_name: "Doomsday Machine Encounter",
      threat_entity_id: "doomsday_machine",
      stardate: 4202.9,
      location: "L-374 System",
      severity: 10,
      casualties: 4000000000,
      ships_lost: 1,
      description:
        "USS Constellation encounters planet-killing machine, USS Enterprise destroys it",
      fear_responses_observed: [
        "Terror at planet consumption",
        "Helplessness against neutronium hull",
        "Fear of unknown creators",
        "Anxiety over more machines",
      ],
      lessons_learned: [
        "Unknown threats still exist",
        "Need for unconventional tactics",
        "Importance of sacrifice for greater good",
        "Ancient weapons pose ongoing threats",
      ],
      protocol_changes: [
        "Deep space monitoring increased",
        "Unconventional weapons research",
        "Evacuation protocols for planets",
        "Ancient technology investigation",
      ],
      status: "Resolved",
      witnesses: [
        "James T. Kirk",
        "Spock",
        "Leonard McCoy",
        "Montgomery Scott",
      ],
    },
  ];

  const filteredThreats = threatEntities.filter((threat) => {
    const threatLevelMatch =
      filterThreatLevel === "All" ||
      (filterThreatLevel === "Low" && threat.threat_level <= 3) ||
      (filterThreatLevel === "Medium" &&
        threat.threat_level >= 4 &&
        threat.threat_level <= 6) ||
      (filterThreatLevel === "High" &&
        threat.threat_level >= 7 &&
        threat.threat_level <= 8) ||
      (filterThreatLevel === "Critical" && threat.threat_level >= 9);
    const statusMatch =
      filterStatus === "All" || threat.status === filterStatus;
    return threatLevelMatch && statusMatch;
  });

  const getThreatColor = (level: number) => {
    if (level <= 3) return "text-green-400 border-green-400 bg-green-400/20";
    if (level <= 6) return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
    if (level <= 8) return "text-orange-400 border-orange-400 bg-orange-400/20";
    return "text-red-400 border-red-400 bg-red-400/20";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-red-400 border-red-400 bg-red-400/20";
      case "Dormant":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Contained":
        return "text-orange-400 border-orange-400 bg-orange-400/20";
      case "Neutralized":
        return "text-green-400 border-green-400 bg-green-400/20";
      default:
        return "text-gray-400 border-gray-400 bg-gray-400/20";
    }
  };

  const getClassificationIcon = (classification: string) => {
    switch (classification) {
      case "Species":
        return <Users className="w-5 h-5" />;
      case "Organization":
        return <Shield className="w-5 h-5" />;
      case "Technology":
        return <Zap className="w-5 h-5" />;
      case "Phenomenon":
        return <Activity className="w-5 h-5" />;
      case "Individual":
        return <Target className="w-5 h-5" />;
      case "Artifact":
        return <Database className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <XCircle className="w-4 h-4" />;
      case "Dormant":
        return <Clock className="w-4 h-4" />;
      case "Contained":
        return <Shield className="w-4 h-4" />;
      case "Neutralized":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          THREAT ASSESSMENT & FEAR ANALYSIS
        </h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "threats" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "threats"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("threats")}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Threat Entities
          </Button>
          <Button
            variant={activeTab === "fears" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "fears"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("fears")}
          >
            <Brain className="w-4 h-4 mr-2" />
            Fear Profiles
          </Button>
          <Button
            variant={activeTab === "incidents" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "incidents"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("incidents")}
          >
            <Skull className="w-4 h-4 mr-2" />
            Major Incidents
          </Button>
          <Button
            variant={activeTab === "protocols" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "protocols"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("protocols")}
          >
            <Shield className="w-4 h-4 mr-2" />
            Protocols
          </Button>
        </div>
      </div>

      {/* Filters for Threats Tab */}
      {activeTab === "threats" && (
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-trek-text/70">Threat Level:</span>
            <div className="flex gap-1">
              {["All", "Low", "Medium", "High", "Critical"].map((level) => (
                <Button
                  key={level}
                  variant={filterThreatLevel === level ? "default" : "outline"}
                  size="sm"
                  className={
                    filterThreatLevel === level
                      ? "bg-trek-blue text-trek-dark"
                      : "border-trek-accent text-trek-text hover:bg-trek-accent"
                  }
                  onClick={() => setFilterThreatLevel(level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-trek-text/70">Status:</span>
            <div className="flex gap-1">
              {[
                "All",
                "Active",
                "Dormant",
                "Contained",
                "Neutralized",
                "Unknown",
              ].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  className={
                    filterStatus === status
                      ? "bg-trek-blue text-trek-dark"
                      : "border-trek-accent text-trek-text hover:bg-trek-accent"
                  }
                  onClick={() => setFilterStatus(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "threats" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {filteredThreats.map((threat) => (
              <Card
                key={threat.id}
                className={`bg-trek-panel border-trek-accent p-4 cursor-pointer transition-colors hover:border-trek-blue ${
                  selectedThreat?.id === threat.id
                    ? "border-trek-blue bg-trek-blue/5"
                    : ""
                }`}
                onClick={() => setSelectedThreat(threat)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-trek-gold text-xl">
                      {getClassificationIcon(threat.classification)}
                    </span>
                    <div>
                      <h3 className="font-bold text-trek-gold text-lg">
                        {threat.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getThreatColor(threat.threat_level)}`}
                        >
                          Threat: {threat.threat_level}/10
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getStatusColor(threat.status)}`}
                        >
                          <span className="mr-1">
                            {getStatusIcon(threat.status)}
                          </span>
                          {threat.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-trek-text/70">Priority</div>
                    <div
                      className={`font-semibold ${
                        threat.starfleet_priority === "Critical"
                          ? "text-red-400"
                          : threat.starfleet_priority === "High"
                            ? "text-orange-400"
                            : threat.starfleet_priority === "Medium"
                              ? "text-yellow-400"
                              : "text-green-400"
                      }`}
                    >
                      {threat.starfleet_priority}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Fear Factor:</span>
                    <span className="text-trek-warning">
                      {threat.fear_factor}/10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Military:</span>
                    <span className="text-red-400">
                      {threat.military_capability}/10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Intelligence:</span>
                    <span className="text-purple-400">
                      {threat.intelligence_level}/10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Range:</span>
                    <span className="text-trek-blue">
                      {threat.territorial_range}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xs text-trek-text/70 mb-1">
                    Casualties Caused:{" "}
                    {threat.casualties_caused.toLocaleString()}
                  </div>
                  <div className="text-xs text-trek-text/70">
                    Ships Destroyed: {threat.ships_destroyed}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {selectedThreat && (
            <Card className="bg-trek-panel border-trek-blue p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-trek-gold text-2xl">
                  {getClassificationIcon(selectedThreat.classification)}
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-trek-gold">
                    {selectedThreat.name}
                  </h3>
                  <p className="text-trek-blue">
                    {selectedThreat.classification} •{" "}
                    {selectedThreat.quadrant_location} Quadrant
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Strategic Assessment
                  </h4>
                  <p className="text-sm text-trek-text/80">
                    {selectedThreat.strategic_assessment}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      First Encounter
                    </div>
                    <div className="text-trek-blue font-semibold">
                      {selectedThreat.first_encounter}
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Last Activity
                    </div>
                    <div className="text-trek-blue font-semibold">
                      {selectedThreat.last_activity}
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Territorial Range
                    </div>
                    <div className="text-trek-blue font-semibold">
                      {selectedThreat.territorial_range}
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Current Status
                    </div>
                    <div
                      className={`font-semibold flex items-center gap-1 ${getStatusColor(selectedThreat.status).split(" ")[0]}`}
                    >
                      {getStatusIcon(selectedThreat.status)}
                      {selectedThreat.status}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Psychological Profile
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Aggression</span>
                        <span className="text-red-400">
                          {selectedThreat.psychological_profile.aggression}/10
                        </span>
                      </div>
                      <Progress
                        value={
                          selectedThreat.psychological_profile.aggression * 10
                        }
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Unpredictability</span>
                        <span className="text-orange-400">
                          {
                            selectedThreat.psychological_profile
                              .unpredictability
                          }
                          /10
                        </span>
                      </div>
                      <Progress
                        value={
                          selectedThreat.psychological_profile
                            .unpredictability * 10
                        }
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Technology Level</span>
                        <span className="text-purple-400">
                          {
                            selectedThreat.psychological_profile
                              .technology_level
                          }
                          /10
                        </span>
                      </div>
                      <Progress
                        value={
                          selectedThreat.psychological_profile
                            .technology_level * 10
                        }
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Biological Threat</span>
                        <span className="text-green-400">
                          {
                            selectedThreat.psychological_profile
                              .biological_threat
                          }
                          /10
                        </span>
                      </div>
                      <Progress
                        value={
                          selectedThreat.psychological_profile
                            .biological_threat * 10
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Primary Fears Induced
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedThreat.primary_fears.map((fear, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs border-trek-warning text-trek-warning"
                      >
                        {fear}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Known Weaknesses
                  </h4>
                  <div className="space-y-1">
                    {selectedThreat.known_weaknesses.map((weakness, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Target className="w-4 h-4 text-green-400" />
                        <span>{weakness}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Casualty Statistics
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-red-400 font-bold text-lg">
                        {selectedThreat.casualties_caused.toLocaleString()}
                      </div>
                      <div className="text-trek-text/70">Casualties</div>
                    </div>
                    <div className="text-center">
                      <div className="text-orange-400 font-bold text-lg">
                        {selectedThreat.ships_destroyed}
                      </div>
                      <div className="text-trek-text/70">Ships Lost</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-400 font-bold text-lg">
                        {selectedThreat.civilizations_threatened}
                      </div>
                      <div className="text-trek-text/70">Civilizations</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Recommended Actions
                  </h4>
                  <div className="space-y-1">
                    {selectedThreat.recommended_actions.map((action, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Crosshair className="w-4 h-4 text-trek-blue" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-trek-accent">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Full Threat Report
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-trek-warning text-trek-warning hover:bg-trek-warning hover:text-trek-dark"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Containment Protocols
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === "fears" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {fearProfiles.map((fear) => (
              <Card
                key={fear.id}
                className={`bg-trek-panel border-trek-accent p-4 cursor-pointer transition-colors hover:border-trek-blue ${
                  selectedFear?.id === fear.id
                    ? "border-trek-blue bg-trek-blue/5"
                    : ""
                }`}
                onClick={() => setSelectedFear(fear)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Brain className="w-6 h-6 text-trek-gold" />
                    <div>
                      <h3 className="font-bold text-trek-gold text-lg">
                        {fear.fear_name}
                      </h3>
                      <p className="text-trek-blue text-sm">
                        {fear.species} Species
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-trek-text/70">Impact</div>
                    <div className="text-trek-warning font-semibold">
                      {fear.psychological_impact}/10
                    </div>
                  </div>
                </div>

                <p className="text-sm text-trek-text/80 mb-3">
                  {fear.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Cases:</span>
                    <span className="text-trek-blue">
                      {fear.documented_cases}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Override:</span>
                    <span className="text-red-400">
                      {fear.survival_instinct_override}/10
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {selectedFear && (
            <Card className="bg-trek-panel border-trek-blue p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-8 h-8 text-trek-gold" />
                <div>
                  <h3 className="text-2xl font-bold text-trek-gold">
                    {selectedFear.fear_name}
                  </h3>
                  <p className="text-trek-blue">
                    {selectedFear.species} Species Fear Profile
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Description
                  </h4>
                  <p className="text-sm text-trek-text/80">
                    {selectedFear.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-trek-text/70 text-sm mb-1">
                      Psychological Impact
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-trek-warning">
                        {selectedFear.psychological_impact}/10
                      </span>
                    </div>
                    <Progress
                      value={selectedFear.psychological_impact * 10}
                      className="h-2 mt-1"
                    />
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm mb-1">
                      Survival Instinct Override
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-400">
                        {selectedFear.survival_instinct_override}/10
                      </span>
                    </div>
                    <Progress
                      value={selectedFear.survival_instinct_override * 10}
                      className="h-2 mt-1"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Trigger Conditions
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedFear.trigger_conditions.map((trigger, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs border-trek-warning text-trek-warning"
                      >
                        {trigger}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Physiological Responses
                  </h4>
                  <div className="space-y-1">
                    {selectedFear.physiological_responses.map((response, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Activity className="w-4 h-4 text-red-400" />
                        <span>{response}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Mitigation Strategies
                  </h4>
                  <div className="space-y-1">
                    {selectedFear.mitigation_strategies.map((strategy, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span>{strategy}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Cultural Significance
                  </h4>
                  <p className="text-sm text-trek-text/80">
                    {selectedFear.cultural_significance}
                  </p>
                </div>

                {selectedFear.evolutionary_basis && (
                  <div>
                    <h4 className="font-semibold text-trek-gold mb-2">
                      Evolutionary Basis
                    </h4>
                    <p className="text-sm text-trek-text/80">
                      {selectedFear.evolutionary_basis}
                    </p>
                  </div>
                )}

                <div className="text-center">
                  <div className="text-trek-text/70 text-sm">
                    Documented Cases
                  </div>
                  <div className="text-trek-blue font-bold text-2xl">
                    {selectedFear.documented_cases}
                  </div>
                </div>

                <div className="pt-4 border-t border-trek-accent">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Psychological Profile
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Treatment Protocols
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === "incidents" && (
        <div className="space-y-4">
          {threatIncidents.map((incident) => (
            <Card
              key={incident.id}
              className="bg-trek-panel border-trek-accent p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Skull className="w-6 h-6 text-trek-warning" />
                  <div>
                    <h3 className="font-bold text-trek-gold text-lg">
                      {incident.incident_name}
                    </h3>
                    <p className="text-trek-blue">
                      Stardate {incident.stardate} • {incident.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${getThreatColor(incident.severity)}`}
                  >
                    Severity: {incident.severity}/10
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-trek-text/80 mb-4">
                {incident.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-red-400 font-bold text-xl">
                    {incident.casualties.toLocaleString()}
                  </div>
                  <div className="text-trek-text/70 text-sm">Casualties</div>
                </div>
                <div className="text-center">
                  <div className="text-orange-400 font-bold text-xl">
                    {incident.ships_lost}
                  </div>
                  <div className="text-trek-text/70 text-sm">Ships Lost</div>
                </div>
                <div className="text-center">
                  <div
                    className={`font-bold text-xl ${
                      incident.status === "Resolved"
                        ? "text-green-400"
                        : incident.status === "Ongoing"
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {incident.status}
                  </div>
                  <div className="text-trek-text/70 text-sm">Status</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Fear Responses Observed
                  </h4>
                  <div className="space-y-1">
                    {incident.fear_responses_observed.map((response, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Brain className="w-3 h-3 text-trek-warning" />
                        <span>{response}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Lessons Learned
                  </h4>
                  <div className="space-y-1">
                    {incident.lessons_learned.map((lesson, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Eye className="w-3 h-3 text-trek-blue" />
                        <span>{lesson}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Full Incident Report
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Updated Protocols
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "protocols" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-trek-gold" />
              <div>
                <h3 className="text-2xl font-bold text-trek-gold">
                  Threat Response Protocols
                </h3>
                <p className="text-trek-blue">
                  Emergency procedures and guidelines
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-trek-blue rounded">
                <h4 className="font-semibold text-trek-blue mb-2">
                  Level 10 Threats (Critical)
                </h4>
                <div className="text-sm space-y-1">
                  <div>• Immediate evacuation of threatened systems</div>
                  <div>• Full military mobilization</div>
                  <div>• Emergency powers activation</div>
                  <div>• Inter-species alliance coordination</div>
                </div>
              </div>

              <div className="p-4 border border-trek-warning rounded">
                <h4 className="font-semibold text-trek-warning mb-2">
                  Level 7-9 Threats (High)
                </h4>
                <div className="text-sm space-y-1">
                  <div>• Enhanced security measures</div>
                  <div>• Starfleet tactical alert</div>
                  <div>• Diplomatic notification protocols</div>
                  <div>• Intelligence gathering increase</div>
                </div>
              </div>

              <div className="p-4 border border-trek-gold rounded">
                <h4 className="font-semibold text-trek-gold mb-2">
                  Level 4-6 Threats (Medium)
                </h4>
                <div className="text-sm space-y-1">
                  <div>• Standard security protocols</div>
                  <div>• Monitoring and surveillance</div>
                  <div>• Diplomatic engagement</div>
                  <div>• Research and analysis</div>
                </div>
              </div>

              <div className="p-4 border border-green-400 rounded">
                <h4 className="font-semibold text-green-400 mb-2">
                  Level 1-3 Threats (Low)
                </h4>
                <div className="text-sm space-y-1">
                  <div>• Routine monitoring</div>
                  <div>• Standard diplomatic channels</div>
                  <div>• Scientific study</div>
                  <div>• Cultural exchange programs</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-trek-panel border-trek-accent p-6">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-8 h-8 text-trek-gold" />
              <div>
                <h3 className="text-2xl font-bold text-trek-gold">
                  Fear Management
                </h3>
                <p className="text-trek-blue">Psychological support systems</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-trek-blue rounded">
                <h4 className="font-semibold text-trek-blue mb-2">
                  Pre-Encounter Preparation
                </h4>
                <div className="text-sm space-y-1">
                  <div>• Psychological conditioning training</div>
                  <div>• Species-specific fear education</div>
                  <div>• Mental resilience building</div>
                  <div>• Simulation exercises</div>
                </div>
              </div>

              <div className="p-4 border border-trek-warning rounded">
                <h4 className="font-semibold text-trek-warning mb-2">
                  During Encounter
                </h4>
                <div className="text-sm space-y-1">
                  <div>• Real-time psychological monitoring</div>
                  <div>• Emergency counseling availability</div>
                  <div>• Command decision support</div>
                  <div>• Crew rotation for stress management</div>
                </div>
              </div>

              <div className="p-4 border border-trek-gold rounded">
                <h4 className="font-semibold text-trek-gold mb-2">
                  Post-Encounter Recovery
                </h4>
                <div className="text-sm space-y-1">
                  <div>• Comprehensive psychological evaluation</div>
                  <div>• PTSD prevention protocols</div>
                  <div>• Group therapy sessions</div>
                  <div>• Long-term monitoring programs</div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-trek-gold mb-3">
                  Current Statistics
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Threats</span>
                    <span className="text-red-400">
                      {
                        threatEntities.filter((t) => t.status === "Active")
                          .length
                      }
                    </span>
                  </div>
                  <Progress
                    value={
                      (threatEntities.filter((t) => t.status === "Active")
                        .length /
                        threatEntities.length) *
                      100
                    }
                    className="h-2"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Contained/Neutralized</span>
                    <span className="text-green-400">
                      {
                        threatEntities.filter(
                          (t) =>
                            t.status === "Contained" ||
                            t.status === "Neutralized",
                        ).length
                      }
                    </span>
                  </div>
                  <Progress
                    value={
                      (threatEntities.filter(
                        (t) =>
                          t.status === "Contained" ||
                          t.status === "Neutralized",
                      ).length /
                        threatEntities.length) *
                      100
                    }
                    className="h-2"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Under Monitoring</span>
                    <span className="text-yellow-400">
                      {
                        threatEntities.filter(
                          (t) =>
                            t.status === "Dormant" || t.status === "Unknown",
                        ).length
                      }
                    </span>
                  </div>
                  <Progress
                    value={
                      (threatEntities.filter(
                        (t) => t.status === "Dormant" || t.status === "Unknown",
                      ).length /
                        threatEntities.length) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
