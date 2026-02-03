import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  Eye,
  AlertTriangle,
  Star,
  Activity,
  Layers,
  Navigation,
  Search,
  Filter,
  Database,
  Target,
  Crosshair,
  Compass,
  Radar,
  Globe,
  Clock,
  TrendingUp,
  Settings,
  MapPin,
  Thermometer,
  Wind,
  Atom,
} from "lucide-react";

interface SpacePhenomenon {
  id: string;
  name: string;
  type:
    | "Nebula"
    | "Black Hole"
    | "Pulsar"
    | "Supernova"
    | "Anomaly"
    | "Dark Matter"
    | "Subspace"
    | "Quantum"
    | "Stellar"
    | "Gravitational";
  classification:
    | "Natural"
    | "Artificial"
    | "Unknown"
    | "Ancient"
    | "Temporal"
    | "Alien";
  threat_level: number;
  scientific_value: number;
  navigation_impact: "None" | "Minor" | "Major" | "Extreme" | "Prohibitive";
  size_scale: "Local" | "System" | "Sector" | "Quadrant" | "Galactic";
  coordinates: { x: number; y: number; z: number };
  quadrant: "Alpha" | "Beta" | "Gamma" | "Delta" | "Unknown";
  first_discovered: string;
  study_status:
    | "Unexplored"
    | "Surveying"
    | "Catalogued"
    | "Restricted"
    | "Quarantined";
  energy_output: number;
  duration: "Permanent" | "Cyclical" | "Temporary" | "Decaying" | "Unknown";
  description: string;
  hazards: string[];
  scientific_opportunities: string[];
  research_teams_assigned: string[];
  related_incidents: string[];
  containment_protocols?: string[];
  exploitation_potential: number;
  cultural_significance?: string;
  theoretical_implications: string[];
  observation_requirements: string[];
  safety_distance_ly: number;
}

interface PhenomenonCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  phenomena_count: number;
  avg_threat_level: number;
  research_priority: "Low" | "Medium" | "High" | "Critical";
}

export function SpacePhenomena() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "catalog" | "research" | "alerts"
  >("overview");
  const [selectedPhenomenon, setSelectedPhenomenon] =
    useState<SpacePhenomenon | null>(null);
  const [filterType, setFilterType] = useState<string>("All");
  const [filterThreat, setFilterThreat] = useState<string>("All");
  const [filterQuadrant, setFilterQuadrant] = useState<string>("All");

  const spacePhenomena: SpacePhenomenon[] = [
    // Classic TOS/TNG Nebulae
    {
      id: "mutara_nebula",
      name: "Mutara Nebula",
      type: "Nebula",
      classification: "Natural",
      threat_level: 7,
      scientific_value: 9,
      navigation_impact: "Major",
      size_scale: "System",
      coordinates: { x: 45.2, y: 12.1, z: -23.4 },
      quadrant: "Alpha",
      first_discovered: "2285",
      study_status: "Restricted",
      energy_output: 8,
      duration: "Permanent",
      description:
        "Dense nebula with electromagnetic interference and proto-matter deposits. Site of Genesis Project testing and Enterprise's encounter with Khan.",
      hazards: [
        "Electromagnetic interference",
        "Sensor disruption",
        "Proto-matter instability",
        "Navigation hazards",
      ],
      scientific_opportunities: [
        "Proto-matter research",
        "Stellar formation studies",
        "Energy field analysis",
      ],
      research_teams_assigned: [
        "Starfleet Science Division",
        "Daystrom Institute",
      ],
      related_incidents: [
        "Khan's final battle",
        "Genesis Project testing",
        "USS Reliant incident",
      ],
      exploitation_potential: 6,
      theoretical_implications: [
        "Matter/energy conversion",
        "Genesis technology",
        "Subspace field dynamics",
      ],
      observation_requirements: [
        "Electromagnetic shielding",
        "Long-range sensors",
        "Automated probes",
      ],
      safety_distance_ly: 0.5,
    },
    {
      id: "briar_patch",
      name: "Briar Patch",
      type: "Nebula",
      classification: "Natural",
      threat_level: 5,
      scientific_value: 10,
      navigation_impact: "Minor",
      size_scale: "Sector",
      coordinates: { x: 234.5, y: -67.8, z: 145.2 },
      quadrant: "Alpha",
      first_discovered: "2375",
      study_status: "Catalogued",
      energy_output: 6,
      duration: "Permanent",
      description:
        "Metaphasic radiation field with regenerative properties. Contains dangerous plasma storms but offers unique healing benefits.",
      hazards: [
        "Plasma storms",
        "Radiation exposure",
        "Energy discharges",
        "Gravitational anomalies",
      ],
      scientific_opportunities: [
        "Metaphasic radiation research",
        "Regenerative medicine",
        "Energy field dynamics",
        "Age reversal studies",
      ],
      research_teams_assigned: [
        "Federation Medical Research",
        "Starfleet Science Corps",
      ],
      related_incidents: [
        "Ba'ku evacuation attempt",
        "Son'a collector operations",
        "Enterprise-E mission",
      ],
      exploitation_potential: 9,
      cultural_significance:
        "Sacred to Ba'ku people as source of their longevity",
      theoretical_implications: [
        "Cellular regeneration",
        "Age reversal technology",
        "Metaphasic radiation applications",
      ],
      observation_requirements: [
        "Radiation monitoring",
        "Plasma storm tracking",
        "Medical analysis equipment",
      ],
      safety_distance_ly: 0.1,
    },
    {
      id: "badlands",
      name: "Badlands Plasma Storms",
      type: "Nebula",
      classification: "Natural",
      threat_level: 8,
      scientific_value: 6,
      navigation_impact: "Extreme",
      size_scale: "Sector",
      coordinates: { x: 189.3, y: 45.6, z: -123.4 },
      quadrant: "Alpha",
      first_discovered: "2370",
      study_status: "Catalogued",
      energy_output: 9,
      duration: "Permanent",
      description:
        "Violent plasma storms create hiding places for smugglers and rebels. Navigation extremely hazardous but provides excellent cover.",
      hazards: [
        "Violent plasma storms",
        "Sensor interference",
        "Ship damage",
        "Navigation failure",
      ],
      scientific_opportunities: [
        "Plasma dynamics",
        "Storm formation studies",
        "Energy extraction research",
      ],
      research_teams_assigned: [
        "Cardassian Science Ministry",
        "Bajoran Institute",
      ],
      related_incidents: [
        "Maquis operations",
        "Cardassian pursuits",
        "USS Voyager's journey to Delta Quadrant",
      ],
      exploitation_potential: 4,
      theoretical_implications: [
        "Plasma energy harvesting",
        "Storm prediction models",
        "Sensor masking technology",
      ],
      observation_requirements: [
        "Hardened sensor arrays",
        "Automated monitoring stations",
        "Emergency protocols",
      ],
      safety_distance_ly: 1.0,
    },
    {
      id: "azure_nebula",
      name: "Azure Nebula",
      type: "Nebula",
      classification: "Natural",
      threat_level: 6,
      scientific_value: 8,
      navigation_impact: "Major",
      size_scale: "System",
      coordinates: { x: 345.6, y: 123.4, z: 234.5 },
      quadrant: "Beta",
      first_discovered: "2374",
      study_status: "Catalogued",
      energy_output: 7,
      duration: "Permanent",
      description:
        "Beautiful blue nebula with subspace anomalies. Contains Borg transwarp conduits and unique energy patterns.",
      hazards: [
        "Subspace anomalies",
        "Borg presence",
        "Energy fluctuations",
        "Sensor distortion",
      ],
      scientific_opportunities: [
        "Subspace research",
        "Transwarp technology",
        "Energy field analysis",
        "Borg technology study",
      ],
      research_teams_assigned: [
        "Starfleet Tactical",
        "Advanced Technologies Division",
      ],
      related_incidents: [
        "Borg transwarp network discovery",
        "USS Voyager encounters",
      ],
      exploitation_potential: 8,
      theoretical_implications: [
        "Transwarp technology",
        "Subspace manipulation",
        "Borg collective analysis",
      ],
      observation_requirements: [
        "Subspace sensors",
        "Borg detection equipment",
        "Tactical monitoring",
      ],
      safety_distance_ly: 0.3,
    },
    // Black Holes and Gravitational Phenomena
    {
      id: "veridian_singularity",
      name: "Veridian III Singularity",
      type: "Black Hole",
      classification: "Artificial",
      threat_level: 10,
      scientific_value: 9,
      navigation_impact: "Prohibitive",
      size_scale: "System",
      coordinates: { x: 456.7, y: 789.0, z: -234.5 },
      quadrant: "Alpha",
      first_discovered: "2371",
      study_status: "Restricted",
      energy_output: 10,
      duration: "Permanent",
      description:
        "Collapsed star creating extreme gravitational distortion. Site of Enterprise-D destruction and Picard-Kirk encounter.",
      hazards: [
        "Extreme gravity",
        "Time dilation",
        "Spaghettification",
        "Event horizon",
      ],
      scientific_opportunities: [
        "Gravitational physics",
        "Time dilation studies",
        "Hawking radiation",
        "Spacetime research",
      ],
      research_teams_assigned: [
        "Theoretical Physics Institute",
        "Temporal Studies Division",
      ],
      related_incidents: [
        "Enterprise-D saucer crash",
        "Trilithium weapon deployment",
        "Kirk's death",
      ],
      containment_protocols: [
        "Gravitational monitoring",
        "Navigation warnings",
        "Temporal shielding",
      ],
      exploitation_potential: 3,
      theoretical_implications: [
        "Gravitational manipulation",
        "Time dilation applications",
        "Energy extraction",
      ],
      observation_requirements: [
        "Gravitational sensors",
        "Temporal monitoring",
        "Safe distance maintenance",
      ],
      safety_distance_ly: 2.0,
    },
    {
      id: "black_cluster",
      name: "Black Cluster",
      type: "Dark Matter",
      classification: "Unknown",
      threat_level: 10,
      scientific_value: 10,
      navigation_impact: "Extreme",
      size_scale: "Sector",
      coordinates: { x: 567.8, y: 234.5, z: -345.6 },
      quadrant: "Alpha",
      first_discovered: "2367",
      study_status: "Restricted",
      energy_output: 0,
      duration: "Permanent",
      description:
        "Massive concentration of dark matter creating gravitational anomalies and space-time distortions.",
      hazards: [
        "Gravitational shearing",
        "Space-time distortion",
        "Dark matter exposure",
        "Reality displacement",
      ],
      scientific_opportunities: [
        "Dark matter research",
        "Gravitational physics",
        "Space-time studies",
        "Exotic matter analysis",
      ],
      research_teams_assigned: [
        "Daystrom Institute",
        "Advanced Physics Laboratory",
      ],
      related_incidents: [
        "Enterprise-D investigation",
        "Geordi La Forge's missing time",
      ],
      containment_protocols: [
        "Gravitational monitoring",
        "Reality anchor systems",
        "Emergency evacuation",
      ],
      exploitation_potential: 9,
      theoretical_implications: [
        "Dark matter manipulation",
        "Gravitational control",
        "Space-time engineering",
      ],
      observation_requirements: [
        "Dark matter sensors",
        "Gravitational detectors",
        "Reality monitoring",
      ],
      safety_distance_ly: 5.0,
    },
    // Stellar Phenomena
    {
      id: "amargosa_destruction",
      name: "Amargosa Star Destruction",
      type: "Stellar",
      classification: "Artificial",
      threat_level: 10,
      scientific_value: 8,
      navigation_impact: "Extreme",
      size_scale: "System",
      coordinates: { x: 345.6, y: 567.8, z: -123.4 },
      quadrant: "Alpha",
      first_discovered: "2371",
      study_status: "Quarantined",
      energy_output: 0,
      duration: "Permanent",
      description:
        "Star destroyed by trilithium weapon, creating massive stellar destruction and gravitational chaos.",
      hazards: [
        "Stellar debris",
        "Gravitational instability",
        "Radiation exposure",
        "System collapse",
      ],
      scientific_opportunities: [
        "Stellar physics",
        "Trilithium technology",
        "Gravitational effects",
        "Weapon analysis",
      ],
      research_teams_assigned: [
        "Stellar Cartography",
        "Weapons Research Division",
      ],
      related_incidents: [
        "Soran's plan",
        "Enterprise-D time loop",
        "Nexus ribbon approach",
      ],
      containment_protocols: [
        "System quarantine",
        "Navigation warnings",
        "Debris monitoring",
      ],
      exploitation_potential: 2,
      theoretical_implications: [
        "Stellar manipulation",
        "Trilithium weapons",
        "System destruction",
      ],
      observation_requirements: [
        "Stellar debris tracking",
        "Gravitational monitoring",
        "Radiation shielding",
      ],
      safety_distance_ly: 10.0,
    },
    {
      id: "psr_b1919_21",
      name: "PSR B1919+21 Pulsar",
      type: "Pulsar",
      classification: "Natural",
      threat_level: 6,
      scientific_value: 8,
      navigation_impact: "Major",
      size_scale: "System",
      coordinates: { x: 1919, y: 21, z: 45.7 },
      quadrant: "Beta",
      first_discovered: "2267",
      study_status: "Catalogued",
      energy_output: 9,
      duration: "Permanent",
      description:
        "Neutron star emitting regular radiation pulses. Navigation hazard but useful for positioning and timing.",
      hazards: [
        "Radiation pulses",
        "Magnetic fields",
        "Gravitational effects",
        "Communication interference",
      ],
      scientific_opportunities: [
        "Neutron star physics",
        "Pulsar timing",
        "Magnetic field studies",
        "Navigation reference",
      ],
      research_teams_assigned: [
        "Stellar Physics Division",
        "Navigation Department",
      ],
      related_incidents: [
        "Navigation calibration missions",
        "Scientific surveys",
      ],
      exploitation_potential: 7,
      theoretical_implications: [
        "Neutron star physics",
        "Magnetic field manipulation",
        "Precision timing",
      ],
      observation_requirements: [
        "Radiation monitoring",
        "Magnetic field sensors",
        "Timing equipment",
      ],
      safety_distance_ly: 1.0,
    },
    // Subspace and Quantum Phenomena
    {
      id: "subspace_rupture",
      name: "Hekaras Subspace Rupture",
      type: "Subspace",
      classification: "Artificial",
      threat_level: 8,
      scientific_value: 7,
      navigation_impact: "Major",
      size_scale: "Sector",
      coordinates: { x: 789.0, y: -456.7, z: 123.4 },
      quadrant: "Alpha",
      first_discovered: "2370",
      study_status: "Catalogued",
      energy_output: 6,
      duration: "Decaying",
      description:
        "Tears in subspace fabric threatening local space-time. Risk of expanding catastrophically if not contained.",
      hazards: [
        "Subspace distortion",
        "Warp drive failure",
        "Reality displacement",
        "Expanding rupture",
      ],
      scientific_opportunities: [
        "Subspace physics",
        "Warp drive effects",
        "Space-time research",
        "Damage assessment",
      ],
      research_teams_assigned: [
        "Subspace Physics Laboratory",
        "Environmental Impact Division",
      ],
      related_incidents: [
        "Hekaras II evacuation",
        "Warp speed restrictions",
        "Subspace monitoring",
      ],
      containment_protocols: [
        "Subspace monitoring",
        "Warp speed restrictions",
        "Evacuation procedures",
      ],
      exploitation_potential: 4,
      theoretical_implications: [
        "Subspace manipulation",
        "Warp drive safety",
        "Environmental protection",
      ],
      observation_requirements: [
        "Subspace sensors",
        "Rupture monitoring",
        "Safety protocols",
      ],
      safety_distance_ly: 2.0,
    },
    {
      id: "quantum_fissure",
      name: "Quantum Fissure",
      type: "Quantum",
      classification: "Natural",
      threat_level: 9,
      scientific_value: 10,
      navigation_impact: "Extreme",
      size_scale: "Local",
      coordinates: { x: 123.4, y: 678.9, z: -456.7 },
      quadrant: "Alpha",
      first_discovered: "2370",
      study_status: "Restricted",
      energy_output: 8,
      duration: "Temporary",
      description:
        "Quantum reality breach allowing access to parallel universes. Extremely dangerous but scientifically invaluable.",
      hazards: [
        "Reality displacement",
        "Quantum instability",
        "Parallel universe access",
        "Temporal paradox",
      ],
      scientific_opportunities: [
        "Quantum physics",
        "Parallel universe study",
        "Reality research",
        "Dimensional analysis",
      ],
      research_teams_assigned: [
        "Quantum Physics Institute",
        "Theoretical Sciences",
      ],
      related_incidents: [
        "Worf's parallel universe experience",
        "Multiple Enterprise encounters",
      ],
      containment_protocols: [
        "Quantum stabilization",
        "Reality anchors",
        "Dimensional monitoring",
      ],
      exploitation_potential: 9,
      theoretical_implications: [
        "Parallel universe access",
        "Quantum manipulation",
        "Reality control",
      ],
      observation_requirements: [
        "Quantum sensors",
        "Reality monitoring",
        "Dimensional equipment",
      ],
      safety_distance_ly: 0.1,
    },
    // Temporal Phenomena
    {
      id: "temporal_rift",
      name: "Jankata Temporal Rift",
      type: "Anomaly",
      classification: "Temporal",
      threat_level: 9,
      scientific_value: 10,
      navigation_impact: "Extreme",
      size_scale: "Local",
      coordinates: { x: 78.9, y: -34.2, z: 12.7 },
      quadrant: "Alpha",
      first_discovered: "2371",
      study_status: "Restricted",
      energy_output: 7,
      duration: "Cyclical",
      description:
        "Unstable temporal distortion causing time displacement. Exercise extreme caution during active phases.",
      hazards: [
        "Time displacement",
        "Temporal paradox",
        "Causality violation",
        "Timeline corruption",
      ],
      scientific_opportunities: [
        "Temporal physics",
        "Time travel research",
        "Causality studies",
        "Timeline analysis",
      ],
      research_teams_assigned: [
        "Department of Temporal Investigations",
        "Temporal Physics Laboratory",
      ],
      related_incidents: [
        "Time displacement accidents",
        "Temporal paradox incidents",
      ],
      containment_protocols: [
        "Temporal monitoring",
        "Causality protection",
        "Timeline preservation",
      ],
      exploitation_potential: 8,
      theoretical_implications: [
        "Time travel technology",
        "Temporal manipulation",
        "Causality control",
      ],
      observation_requirements: [
        "Temporal sensors",
        "Chronometer arrays",
        "Causality monitors",
      ],
      safety_distance_ly: 0.5,
    },
    {
      id: "nexus_ribbon",
      name: "Nexus Energy Ribbon",
      type: "Anomaly",
      classification: "Unknown",
      threat_level: 9,
      scientific_value: 10,
      navigation_impact: "Extreme",
      size_scale: "Galactic",
      coordinates: { x: 567.8, y: 234.5, z: -345.6 },
      quadrant: "Alpha",
      first_discovered: "2293",
      study_status: "Restricted",
      energy_output: 9,
      duration: "Cyclical",
      description:
        "Extradimensional energy ribbon creating temporal paradise. Extremely dangerous but alluring to those who experience it.",
      hazards: [
        "Temporal displacement",
        "Reality distortion",
        "Consciousness trap",
        "Ship destruction",
      ],
      scientific_opportunities: [
        "Extradimensional physics",
        "Consciousness research",
        "Temporal studies",
        "Energy analysis",
      ],
      research_teams_assigned: ["Advanced Physics", "Consciousness Studies"],
      related_incidents: [
        "USS Lakul disaster",
        "Enterprise-B rescue",
        "Picard-Kirk encounter",
      ],
      containment_protocols: [
        "Navigation warnings",
        "Emergency evacuation",
        "Consciousness monitoring",
      ],
      exploitation_potential: 6,
      theoretical_implications: [
        "Extradimensional access",
        "Consciousness manipulation",
        "Time perception",
      ],
      observation_requirements: [
        "Dimensional sensors",
        "Consciousness monitors",
        "Emergency protocols",
      ],
      safety_distance_ly: 1.0,
    },
    // Ancient and Alien Phenomena
    {
      id: "galactic_barrier",
      name: "Galactic Barrier",
      type: "Anomaly",
      classification: "Ancient",
      threat_level: 10,
      scientific_value: 10,
      navigation_impact: "Prohibitive",
      size_scale: "Galactic",
      coordinates: { x: 50000, y: 0, z: 0 },
      quadrant: "Unknown",
      first_discovered: "2265",
      study_status: "Restricted",
      energy_output: 10,
      duration: "Permanent",
      description:
        "Energy barrier at galaxy's edge. Enhances ESP abilities, extremely dangerous to traverse. Purpose unknown.",
      hazards: [
        "ESP enhancement",
        "Mental instability",
        "Reality alteration",
        "Ship destruction",
      ],
      scientific_opportunities: [
        "ESP research",
        "Energy field analysis",
        "Ancient technology",
        "Consciousness studies",
      ],
      research_teams_assigned: ["Xenoarchaeology", "ESP Research Division"],
      related_incidents: [
        "USS Enterprise encounters",
        "Gary Mitchell incident",
        "Elizabeth Dehner transformation",
      ],
      containment_protocols: [
        "ESP screening",
        "Mental monitoring",
        "Emergency termination",
      ],
      exploitation_potential: 8,
      theoretical_implications: [
        "ESP enhancement",
        "Ancient technology",
        "Consciousness evolution",
      ],
      observation_requirements: [
        "ESP monitors",
        "Mental health screening",
        "Energy field analysis",
      ],
      safety_distance_ly: 100.0,
    },
    {
      id: "guardian_portal",
      name: "Guardian of Forever",
      type: "Anomaly",
      classification: "Ancient",
      threat_level: 10,
      scientific_value: 10,
      navigation_impact: "Extreme",
      size_scale: "Local",
      coordinates: { x: 234.7, y: 123.4, z: -567.8 },
      quadrant: "Beta",
      first_discovered: "2267",
      study_status: "Quarantined",
      energy_output: 9,
      duration: "Permanent",
      description:
        "Ancient sentient time portal capable of accessing any point in history. Extremely dangerous temporal technology.",
      hazards: [
        "Timeline alteration",
        "Temporal paradox",
        "History corruption",
        "Causality violation",
      ],
      scientific_opportunities: [
        "Time travel",
        "Ancient technology",
        "Historical research",
        "Temporal physics",
      ],
      research_teams_assigned: [
        "Department of Temporal Investigations",
        "Ancient Technologies",
      ],
      related_incidents: [
        "Kirk-Spock time travel",
        "Edith Keeler incident",
        "Timeline restoration",
      ],
      containment_protocols: [
        "Temporal Prime Directive",
        "Access restriction",
        "Timeline monitoring",
      ],
      exploitation_potential: 10,
      cultural_significance:
        "Ancient artifact of unknown origin with godlike temporal powers",
      theoretical_implications: [
        "Time travel mastery",
        "Historical access",
        "Temporal manipulation",
      ],
      observation_requirements: [
        "Temporal monitoring",
        "Access control",
        "Timeline protection",
      ],
      safety_distance_ly: 0.0,
    },
    // Voyager Delta Quadrant Phenomena
    {
      id: "chaotic_space",
      name: "Chaotic Space",
      type: "Anomaly",
      classification: "Unknown",
      threat_level: 9,
      scientific_value: 8,
      navigation_impact: "Extreme",
      size_scale: "Sector",
      coordinates: { x: 73456, y: 7890, z: -1234 },
      quadrant: "Delta",
      first_discovered: "2375",
      study_status: "Catalogued",
      energy_output: 8,
      duration: "Permanent",
      description:
        "Region where physical laws break down. Gravity, time, and space behave unpredictably.",
      hazards: [
        "Physical law breakdown",
        "Gravitational chaos",
        "Time distortion",
        "Spatial anomalies",
      ],
      scientific_opportunities: [
        "Physics research",
        "Law breakdown studies",
        "Anomaly analysis",
        "Reality research",
      ],
      research_teams_assigned: ["Voyager Science Team", "Theoretical Physics"],
      related_incidents: ["USS Voyager transit", "Physical law violations"],
      exploitation_potential: 5,
      theoretical_implications: [
        "Physical law understanding",
        "Reality manipulation",
        "Chaos theory",
      ],
      observation_requirements: [
        "Physical law monitors",
        "Chaos sensors",
        "Emergency protocols",
      ],
      safety_distance_ly: 3.0,
    },
    {
      id: "void_region",
      name: "The Void",
      type: "Anomaly",
      classification: "Natural",
      threat_level: 7,
      scientific_value: 6,
      navigation_impact: "Major",
      size_scale: "Sector",
      coordinates: { x: 71234, y: 5678, z: -9012 },
      quadrant: "Delta",
      first_discovered: "2375",
      study_status: "Catalogued",
      energy_output: 0,
      duration: "Permanent",
      description:
        "Massive empty region of space trapping ships. No stars, planets, or resources. Creates psychological stress.",
      hazards: [
        "Resource depletion",
        "Psychological stress",
        "Navigation difficulty",
        "Communication loss",
      ],
      scientific_opportunities: [
        "Vacuum physics",
        "Psychological studies",
        "Navigation research",
        "Resource management",
      ],
      research_teams_assigned: ["Voyager Crew", "Psychological Studies"],
      related_incidents: [
        "Voyager entrapment",
        "Ship alliances",
        "Resource conflicts",
      ],
      exploitation_potential: 2,
      theoretical_implications: [
        "Vacuum dynamics",
        "Psychological effects",
        "Resource conservation",
      ],
      observation_requirements: [
        "Psychological monitoring",
        "Resource tracking",
        "Navigation aids",
      ],
      safety_distance_ly: 0.0,
    },
    // Discovery Era Phenomena
    {
      id: "mycelial_network",
      name: "Mycelial Network Junction",
      type: "Subspace",
      classification: "Ancient",
      threat_level: 6,
      scientific_value: 10,
      navigation_impact: "None",
      size_scale: "Galactic",
      coordinates: { x: 123.4, y: 456.7, z: 789.0 },
      quadrant: "Alpha",
      first_discovered: "2256",
      study_status: "Restricted",
      energy_output: 7,
      duration: "Permanent",
      description:
        "Connection point to the mycelial network spanning multiple universes. Enables instantaneous travel.",
      hazards: [
        "Dimensional breach",
        "Spore contamination",
        "Network disruption",
        "Tardigrade dependency",
      ],
      scientific_opportunities: [
        "Interdimensional travel",
        "Spore physics",
        "Network analysis",
        "Biological studies",
      ],
      research_teams_assigned: ["USS Discovery", "Spore Drive Division"],
      related_incidents: [
        "Discovery spore drive",
        "Mirror universe access",
        "Tardigrade navigation",
      ],
      containment_protocols: [
        "Spore containment",
        "Network monitoring",
        "Biological protection",
      ],
      exploitation_potential: 9,
      theoretical_implications: [
        "Instantaneous travel",
        "Interdimensional access",
        "Biological navigation",
      ],
      observation_requirements: [
        "Spore sensors",
        "Network monitors",
        "Biological scanners",
      ],
      safety_distance_ly: 0.0,
    },
  ];

  const phenomenonCategories: PhenomenonCategory[] = [
    {
      id: "nebulae",
      name: "Nebulae & Gas Clouds",
      description:
        "Interstellar gas and dust formations with various properties",
      icon: <Zap className="w-6 h-6" />,
      phenomena_count: spacePhenomena.filter((p) => p.type === "Nebula").length,
      avg_threat_level: Math.round(
        spacePhenomena
          .filter((p) => p.type === "Nebula")
          .reduce((sum, p) => sum + p.threat_level, 0) /
          spacePhenomena.filter((p) => p.type === "Nebula").length,
      ),
      research_priority: "High",
    },
    {
      id: "gravitational",
      name: "Gravitational Phenomena",
      description: "Black holes, neutron stars, and gravitational anomalies",
      icon: <Target className="w-6 h-6" />,
      phenomena_count: spacePhenomena.filter(
        (p) =>
          p.type === "Black Hole" ||
          p.type === "Pulsar" ||
          p.type === "Gravitational",
      ).length,
      avg_threat_level: Math.round(
        spacePhenomena
          .filter(
            (p) =>
              p.type === "Black Hole" ||
              p.type === "Pulsar" ||
              p.type === "Gravitational",
          )
          .reduce((sum, p) => sum + p.threat_level, 0) /
          spacePhenomena.filter(
            (p) =>
              p.type === "Black Hole" ||
              p.type === "Pulsar" ||
              p.type === "Gravitational",
          ).length,
      ),
      research_priority: "Critical",
    },
    {
      id: "temporal",
      name: "Temporal Anomalies",
      description: "Time-related phenomena and temporal distortions",
      icon: <Clock className="w-6 h-6" />,
      phenomena_count: spacePhenomena.filter(
        (p) => p.classification === "Temporal",
      ).length,
      avg_threat_level: Math.round(
        spacePhenomena
          .filter((p) => p.classification === "Temporal")
          .reduce((sum, p) => sum + p.threat_level, 0) /
          spacePhenomena.filter((p) => p.classification === "Temporal").length,
      ),
      research_priority: "Critical",
    },
    {
      id: "subspace",
      name: "Subspace Phenomena",
      description: "Subspace distortions and related anomalies",
      icon: <Layers className="w-6 h-6" />,
      phenomena_count: spacePhenomena.filter((p) => p.type === "Subspace")
        .length,
      avg_threat_level: Math.round(
        spacePhenomena
          .filter((p) => p.type === "Subspace")
          .reduce((sum, p) => sum + p.threat_level, 0) /
          spacePhenomena.filter((p) => p.type === "Subspace").length,
      ),
      research_priority: "High",
    },
    {
      id: "quantum",
      name: "Quantum Anomalies",
      description: "Quantum-level phenomena and reality distortions",
      icon: <Atom className="w-6 h-6" />,
      phenomena_count: spacePhenomena.filter((p) => p.type === "Quantum")
        .length,
      avg_threat_level: Math.round(
        spacePhenomena
          .filter((p) => p.type === "Quantum")
          .reduce((sum, p) => sum + p.threat_level, 0) /
          spacePhenomena.filter((p) => p.type === "Quantum").length,
      ),
      research_priority: "Critical",
    },
    {
      id: "ancient",
      name: "Ancient Artifacts",
      description: "Ancient technologies and unexplained phenomena",
      icon: <Star className="w-6 h-6" />,
      phenomena_count: spacePhenomena.filter(
        (p) => p.classification === "Ancient",
      ).length,
      avg_threat_level: Math.round(
        spacePhenomena
          .filter((p) => p.classification === "Ancient")
          .reduce((sum, p) => sum + p.threat_level, 0) /
          spacePhenomena.filter((p) => p.classification === "Ancient").length,
      ),
      research_priority: "Critical",
    },
  ];

  const filteredPhenomena = spacePhenomena.filter((phenomenon) => {
    const typeMatch = filterType === "All" || phenomenon.type === filterType;
    const threatMatch =
      filterThreat === "All" ||
      (filterThreat === "Low" && phenomenon.threat_level <= 3) ||
      (filterThreat === "Medium" &&
        phenomenon.threat_level >= 4 &&
        phenomenon.threat_level <= 6) ||
      (filterThreat === "High" &&
        phenomenon.threat_level >= 7 &&
        phenomenon.threat_level <= 8) ||
      (filterThreat === "Critical" && phenomenon.threat_level >= 9);
    const quadrantMatch =
      filterQuadrant === "All" || phenomenon.quadrant === filterQuadrant;
    return typeMatch && threatMatch && quadrantMatch;
  });

  const getThreatColor = (level: number) => {
    if (level <= 3) return "text-green-400 border-green-400 bg-green-400/20";
    if (level <= 6) return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
    if (level <= 8) return "text-orange-400 border-orange-400 bg-orange-400/20";
    return "text-red-400 border-red-400 bg-red-400/20";
  };

  const getNavigationImpactColor = (impact: string) => {
    switch (impact) {
      case "None":
        return "text-green-400";
      case "Minor":
        return "text-yellow-400";
      case "Major":
        return "text-orange-400";
      case "Extreme":
        return "text-red-400";
      case "Prohibitive":
        return "text-red-600";
      default:
        return "text-gray-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Nebula":
        return <Zap className="w-5 h-5" />;
      case "Black Hole":
        return <Target className="w-5 h-5" />;
      case "Pulsar":
        return <Activity className="w-5 h-5" />;
      case "Supernova":
        return <Star className="w-5 h-5" />;
      case "Anomaly":
        return <AlertTriangle className="w-5 h-5" />;
      case "Dark Matter":
        return <Eye className="w-5 h-5" />;
      case "Subspace":
        return <Layers className="w-5 h-5" />;
      case "Quantum":
        return <Atom className="w-5 h-5" />;
      case "Stellar":
        return <Star className="w-5 h-5" />;
      case "Gravitational":
        return <Target className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "text-red-400";
      case "High":
        return "text-orange-400";
      case "Medium":
        return "text-yellow-400";
      case "Low":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          SPACE PHENOMENA DATABASE
        </h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "overview" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "overview"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("overview")}
          >
            <Database className="w-4 h-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeTab === "catalog" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "catalog"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("catalog")}
          >
            <Eye className="w-4 h-4 mr-2" />
            Catalog
          </Button>
          <Button
            variant={activeTab === "research" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "research"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("research")}
          >
            <Search className="w-4 h-4 mr-2" />
            Research
          </Button>
          <Button
            variant={activeTab === "alerts" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "alerts"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("alerts")}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Alerts
          </Button>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phenomenonCategories.map((category) => (
            <Card
              key={category.id}
              className="bg-trek-panel border-trek-accent p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-trek-gold">{category.icon}</span>
                <div>
                  <h3 className="font-bold text-trek-gold text-lg">
                    {category.name}
                  </h3>
                  <p className="text-trek-blue text-sm">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-trek-text/70">
                    Phenomena Count
                  </span>
                  <span className="text-trek-blue font-semibold">
                    {category.phenomena_count}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-trek-text/70">
                    Avg Threat Level
                  </span>
                  <span
                    className={`font-semibold ${getThreatColor(category.avg_threat_level).split(" ")[0]}`}
                  >
                    {category.avg_threat_level}/10
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-trek-text/70">
                    Research Priority
                  </span>
                  <span
                    className={`font-semibold ${getPriorityColor(category.research_priority)}`}
                  >
                    {category.research_priority}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <Progress
                  value={
                    (category.phenomena_count / spacePhenomena.length) * 100
                  }
                  className="h-3"
                />
                <div className="text-xs text-trek-text/70 mt-1">
                  {Math.round(
                    (category.phenomena_count / spacePhenomena.length) * 100,
                  )}
                  % of total phenomena
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "catalog" && (
        <>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-trek-text/70">Type:</span>
              <div className="flex gap-1">
                {[
                  "All",
                  "Nebula",
                  "Black Hole",
                  "Pulsar",
                  "Anomaly",
                  "Subspace",
                  "Quantum",
                ].map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? "default" : "outline"}
                    size="sm"
                    className={
                      filterType === type
                        ? "bg-trek-blue text-trek-dark"
                        : "border-trek-accent text-trek-text hover:bg-trek-accent"
                    }
                    onClick={() => setFilterType(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-trek-text/70">Threat:</span>
              <div className="flex gap-1">
                {["All", "Low", "Medium", "High", "Critical"].map((threat) => (
                  <Button
                    key={threat}
                    variant={filterThreat === threat ? "default" : "outline"}
                    size="sm"
                    className={
                      filterThreat === threat
                        ? "bg-trek-blue text-trek-dark"
                        : "border-trek-accent text-trek-text hover:bg-trek-accent"
                    }
                    onClick={() => setFilterThreat(threat)}
                  >
                    {threat}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-trek-text/70">Quadrant:</span>
              <div className="flex gap-1">
                {["All", "Alpha", "Beta", "Gamma", "Delta", "Unknown"].map(
                  (quadrant) => (
                    <Button
                      key={quadrant}
                      variant={
                        filterQuadrant === quadrant ? "default" : "outline"
                      }
                      size="sm"
                      className={
                        filterQuadrant === quadrant
                          ? "bg-trek-blue text-trek-dark"
                          : "border-trek-accent text-trek-text hover:bg-trek-accent"
                      }
                      onClick={() => setFilterQuadrant(quadrant)}
                    >
                      {quadrant}
                    </Button>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {filteredPhenomena.map((phenomenon) => (
                <Card
                  key={phenomenon.id}
                  className={`bg-trek-panel border-trek-accent p-4 cursor-pointer transition-colors hover:border-trek-blue ${
                    selectedPhenomenon?.id === phenomenon.id
                      ? "border-trek-blue bg-trek-blue/5"
                      : ""
                  }`}
                  onClick={() => setSelectedPhenomenon(phenomenon)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-trek-gold text-xl">
                        {getTypeIcon(phenomenon.type)}
                      </span>
                      <div>
                        <h3 className="font-bold text-trek-gold text-lg">
                          {phenomenon.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getThreatColor(phenomenon.threat_level)}`}
                          >
                            Threat: {phenomenon.threat_level}/10
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="text-xs border-trek-accent text-trek-text"
                          >
                            {phenomenon.quadrant} Quadrant
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-trek-text/70">Scientific Value</div>
                      <div className="text-purple-400 font-semibold">
                        {phenomenon.scientific_value}/10
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Type:</span>
                      <span className="text-trek-blue">{phenomenon.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Navigation:</span>
                      <span
                        className={getNavigationImpactColor(
                          phenomenon.navigation_impact,
                        )}
                      >
                        {phenomenon.navigation_impact}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Scale:</span>
                      <span className="text-trek-blue">
                        {phenomenon.size_scale}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Status:</span>
                      <span className="text-trek-gold">
                        {phenomenon.study_status}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {selectedPhenomenon && (
              <Card className="bg-trek-panel border-trek-blue p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-trek-gold text-2xl">
                    {getTypeIcon(selectedPhenomenon.type)}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-trek-gold">
                      {selectedPhenomenon.name}
                    </h3>
                    <p className="text-trek-blue">
                      {selectedPhenomenon.type} •{" "}
                      {selectedPhenomenon.classification}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-trek-gold mb-2">
                      Description
                    </h4>
                    <p className="text-sm text-trek-text/80">
                      {selectedPhenomenon.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-trek-text/70 text-sm">
                        First Discovered
                      </div>
                      <div className="text-trek-blue font-semibold">
                        {selectedPhenomenon.first_discovered}
                      </div>
                    </div>
                    <div>
                      <div className="text-trek-text/70 text-sm">
                        Study Status
                      </div>
                      <div className="text-trek-gold font-semibold">
                        {selectedPhenomenon.study_status}
                      </div>
                    </div>
                    <div>
                      <div className="text-trek-text/70 text-sm">Duration</div>
                      <div className="text-trek-blue font-semibold">
                        {selectedPhenomenon.duration}
                      </div>
                    </div>
                    <div>
                      <div className="text-trek-text/70 text-sm">
                        Safe Distance
                      </div>
                      <div className="text-trek-warning font-semibold">
                        {selectedPhenomenon.safety_distance_ly} ly
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-trek-text/70 text-sm mb-1">
                        Threat Level
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            getThreatColor(
                              selectedPhenomenon.threat_level,
                            ).split(" ")[0]
                          }
                        >
                          {selectedPhenomenon.threat_level}/10
                        </span>
                      </div>
                      <Progress
                        value={selectedPhenomenon.threat_level * 10}
                        className="h-2 mt-1"
                      />
                    </div>
                    <div>
                      <div className="text-trek-text/70 text-sm mb-1">
                        Scientific Value
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400">
                          {selectedPhenomenon.scientific_value}/10
                        </span>
                      </div>
                      <Progress
                        value={selectedPhenomenon.scientific_value * 10}
                        className="h-2 mt-1"
                      />
                    </div>
                    <div>
                      <div className="text-trek-text/70 text-sm mb-1">
                        Energy Output
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">
                          {selectedPhenomenon.energy_output}/10
                        </span>
                      </div>
                      <Progress
                        value={selectedPhenomenon.energy_output * 10}
                        className="h-2 mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-trek-gold mb-2">
                      Known Hazards
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedPhenomenon.hazards.map((hazard, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs border-trek-warning text-trek-warning"
                        >
                          {hazard}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-trek-gold mb-2">
                      Scientific Opportunities
                    </h4>
                    <div className="space-y-1">
                      {selectedPhenomenon.scientific_opportunities.map(
                        (opportunity, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Eye className="w-4 h-4 text-purple-400" />
                            <span>{opportunity}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-trek-gold mb-2">
                      Research Teams
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedPhenomenon.research_teams_assigned.map(
                        (team, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs border-trek-blue text-trek-blue"
                          >
                            {team}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>

                  {selectedPhenomenon.theoretical_implications.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-trek-gold mb-2">
                        Theoretical Implications
                      </h4>
                      <div className="space-y-1">
                        {selectedPhenomenon.theoretical_implications.map(
                          (implication, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-sm"
                            >
                              <Eye className="w-4 h-4 text-trek-blue" />
                              <span>{implication}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-trek-accent">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Detailed Study
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-trek-warning text-trek-warning hover:bg-trek-warning hover:text-trek-dark"
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Safety Protocols
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </>
      )}

      {activeTab === "research" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <div className="flex items-center gap-3 mb-6">
              <Search className="w-8 h-8 text-trek-gold" />
              <div>
                <h3 className="text-2xl font-bold text-trek-gold">
                  Active Research Projects
                </h3>
                <p className="text-trek-blue">
                  Current scientific investigations
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-trek-blue rounded">
                <h4 className="font-semibold text-trek-blue mb-2">
                  Metaphasic Radiation Study
                </h4>
                <div className="text-sm space-y-1">
                  <div>• Location: Briar Patch</div>
                  <div>• Team: Federation Medical Research</div>
                  <div>• Progress: 67% Complete</div>
                  <div>• Goal: Age reversal applications</div>
                </div>
                <Progress value={67} className="h-2 mt-2" />
              </div>

              <div className="p-4 border border-trek-warning rounded">
                <h4 className="font-semibold text-trek-warning mb-2">
                  Subspace Rupture Analysis
                </h4>
                <div className="text-sm space-y-1">
                  <div>• Location: Hekaras Corridor</div>
                  <div>• Team: Subspace Physics Laboratory</div>
                  <div>• Progress: 34% Complete</div>
                  <div>• Goal: Rupture prevention technology</div>
                </div>
                <Progress value={34} className="h-2 mt-2" />
              </div>

              <div className="p-4 border border-trek-gold rounded">
                <h4 className="font-semibold text-trek-gold mb-2">
                  Ancient Artifact Investigation
                </h4>
                <div className="text-sm space-y-1">
                  <div>• Location: Guardian Planet</div>
                  <div>• Team: Department of Temporal Investigations</div>
                  <div>• Progress: 12% Complete</div>
                  <div>• Goal: Temporal technology understanding</div>
                </div>
                <Progress value={12} className="h-2 mt-2" />
              </div>
            </div>
          </Card>

          <Card className="bg-trek-panel border-trek-accent p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-8 h-8 text-trek-gold" />
              <div>
                <h3 className="text-2xl font-bold text-trek-gold">
                  Research Statistics
                </h3>
                <p className="text-trek-blue">Scientific progress overview</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-trek-gold mb-3">
                  Phenomena by Study Status
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Catalogued</span>
                    <span className="text-green-400">
                      {
                        spacePhenomena.filter(
                          (p) => p.study_status === "Catalogued",
                        ).length
                      }
                    </span>
                  </div>
                  <Progress
                    value={
                      (spacePhenomena.filter(
                        (p) => p.study_status === "Catalogued",
                      ).length /
                        spacePhenomena.length) *
                      100
                    }
                    className="h-2"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Under Survey</span>
                    <span className="text-yellow-400">
                      {
                        spacePhenomena.filter(
                          (p) => p.study_status === "Surveying",
                        ).length
                      }
                    </span>
                  </div>
                  <Progress
                    value={
                      (spacePhenomena.filter(
                        (p) => p.study_status === "Surveying",
                      ).length /
                        spacePhenomena.length) *
                      100
                    }
                    className="h-2"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Restricted/Quarantined</span>
                    <span className="text-red-400">
                      {
                        spacePhenomena.filter(
                          (p) =>
                            p.study_status === "Restricted" ||
                            p.study_status === "Quarantined",
                        ).length
                      }
                    </span>
                  </div>
                  <Progress
                    value={
                      (spacePhenomena.filter(
                        (p) =>
                          p.study_status === "Restricted" ||
                          p.study_status === "Quarantined",
                      ).length /
                        spacePhenomena.length) *
                      100
                    }
                    className="h-2"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Unexplored</span>
                    <span className="text-gray-400">
                      {
                        spacePhenomena.filter(
                          (p) => p.study_status === "Unexplored",
                        ).length
                      }
                    </span>
                  </div>
                  <Progress
                    value={
                      (spacePhenomena.filter(
                        (p) => p.study_status === "Unexplored",
                      ).length /
                        spacePhenomena.length) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-trek-gold mb-3">
                  Research Priorities
                </h4>
                <div className="space-y-2">
                  <div className="p-3 border border-red-400 rounded">
                    <div className="font-semibold text-red-400">
                      Critical Priority
                    </div>
                    <div className="text-sm">Temporal & quantum phenomena</div>
                  </div>
                  <div className="p-3 border border-orange-400 rounded">
                    <div className="font-semibold text-orange-400">
                      High Priority
                    </div>
                    <div className="text-sm">
                      Subspace & gravitational phenomena
                    </div>
                  </div>
                  <div className="p-3 border border-yellow-400 rounded">
                    <div className="font-semibold text-yellow-400">
                      Medium Priority
                    </div>
                    <div className="text-sm">Stellar & nebula phenomena</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "alerts" && (
        <div className="space-y-4">
          <Card className="bg-trek-panel border-red-400 p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="font-bold text-red-400 text-lg">
                  Critical Alert: Temporal Rift Activity
                </h3>
                <p className="text-trek-blue">
                  Jankata Temporal Rift - Active Phase Detected
                </p>
              </div>
            </div>
            <p className="text-sm text-trek-text/80 mb-4">
              Unusual temporal energy signatures detected in the Jankata system.
              All vessels advised to maintain minimum safe distance of 0.5
              light-years.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-red-400 hover:bg-red-400/80 text-trek-dark"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Emergency Response
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-400 text-red-400"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Navigation Warning
              </Button>
            </div>
          </Card>

          <Card className="bg-trek-panel border-orange-400 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-orange-400" />
              <div>
                <h3 className="font-bold text-orange-400 text-lg">
                  High Alert: Subspace Rupture Expansion
                </h3>
                <p className="text-trek-blue">
                  Hekaras Corridor - Rupture Size Increasing
                </p>
              </div>
            </div>
            <p className="text-sm text-trek-text/80 mb-4">
              Subspace rupture in Hekaras Corridor has expanded by 12% in the
              last 48 hours. Evacuation protocols may be required.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-orange-400 hover:bg-orange-400/80 text-trek-dark"
              >
                <Radar className="w-4 h-4 mr-2" />
                Monitor Expansion
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-orange-400 text-orange-400"
              >
                <Settings className="w-4 h-4 mr-2" />
                Containment Protocols
              </Button>
            </div>
          </Card>

          <Card className="bg-trek-panel border-yellow-400 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-yellow-400" />
              <div>
                <h3 className="font-bold text-yellow-400 text-lg">
                  Medium Alert: Unusual Energy Readings
                </h3>
                <p className="text-trek-blue">
                  Azure Nebula - Anomalous Borg Activity
                </p>
              </div>
            </div>
            <p className="text-sm text-trek-text/80 mb-4">
              Increased transwarp conduit activity detected in Azure Nebula.
              Possible Borg fleet movement anticipated.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-yellow-400 hover:bg-yellow-400/80 text-trek-dark"
              >
                <Target className="w-4 h-4 mr-2" />
                Tactical Assessment
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-yellow-400 text-yellow-400"
              >
                <Database className="w-4 h-4 mr-2" />
                Intelligence Report
              </Button>
            </div>
          </Card>

          <Card className="bg-trek-panel border-trek-accent p-6">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-8 h-8 text-trek-gold" />
              <div>
                <h3 className="text-2xl font-bold text-trek-gold">
                  Alert Statistics
                </h3>
                <p className="text-trek-blue">
                  Current threat assessment summary
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-red-400 font-bold text-2xl">
                  {spacePhenomena.filter((p) => p.threat_level >= 9).length}
                </div>
                <div className="text-trek-text/70 text-sm">
                  Critical Threats
                </div>
              </div>
              <div className="text-center">
                <div className="text-orange-400 font-bold text-2xl">
                  {
                    spacePhenomena.filter(
                      (p) => p.threat_level >= 7 && p.threat_level < 9,
                    ).length
                  }
                </div>
                <div className="text-trek-text/70 text-sm">High Threats</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-bold text-2xl">
                  {
                    spacePhenomena.filter(
                      (p) =>
                        p.study_status === "Restricted" ||
                        p.study_status === "Quarantined",
                    ).length
                  }
                </div>
                <div className="text-trek-text/70 text-sm">
                  Restricted Areas
                </div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-bold text-2xl">
                  {spacePhenomena.filter((p) => p.threat_level <= 3).length}
                </div>
                <div className="text-trek-text/70 text-sm">Safe Phenomena</div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
