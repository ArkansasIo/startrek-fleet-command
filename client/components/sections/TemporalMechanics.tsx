import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  AlertTriangle,
  Zap,
  Eye,
  Shield,
  Target,
  Calendar,
  GitBranch,
  RotateCcw,
  FastForward,
  Rewind,
  Play,
  Pause,
  History,
  TrendingUp,
  Database,
  Search,
  Filter,
} from "lucide-react";

interface TemporalEvent {
  id: string;
  name: string;
  stardate: number;
  earth_date: string;
  type:
    | "Incursion"
    | "Paradox"
    | "Loop"
    | "Displacement"
    | "Causality"
    | "Natural";
  severity: number;
  timeline_branch: "Prime" | "Mirror" | "Kelvin" | "Alternate" | "Unknown";
  location: string;
  participants: string[];
  description: string;
  resolution_status: "Resolved" | "Ongoing" | "Unresolved" | "Monitored";
  temporal_coordinates: {
    century: number;
    year: number;
    month: number;
    day: number;
  };
  investigation_priority: "Low" | "Medium" | "High" | "Critical";
  department_of_temporal_investigations: boolean;
  chroniton_signature: number;
  causality_violations: string[];
  butterfly_effect_potential: number;
  paradox_classification?: string;
  associated_technology?: string[];
  witnesses: string[];
  temporal_shielding_required: boolean;
}

interface TimelineNode {
  id: string;
  name: string;
  timeline: string;
  year: number;
  description: string;
  major_events: string[];
  divergence_point?: string;
  stability_index: number;
  quantum_flux: number;
  alternate_outcomes: string[];
}

interface TemporalTechnology {
  id: string;
  name: string;
  type:
    | "Travel"
    | "Communication"
    | "Sensor"
    | "Weapon"
    | "Shield"
    | "Detection";
  time_period: string;
  inventor: string;
  risk_level: number;
  temporal_displacement_capability: number;
  precision_rating: number;
  safety_protocols: string[];
  known_side_effects: string[];
  temporal_accord_status: "Banned" | "Restricted" | "Regulated" | "Approved";
  description: string;
}

export function TemporalMechanics() {
  const [activeTab, setActiveTab] = useState<
    "events" | "timelines" | "technology" | "investigations"
  >("events");
  const [selectedEvent, setSelectedEvent] = useState<TemporalEvent | null>(
    null,
  );
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineNode | null>(
    null,
  );
  const [filterSeverity, setFilterSeverity] = useState<string>("All");
  const [filterTimeline, setFilterTimeline] = useState<string>("All");

  const temporalEvents: TemporalEvent[] = [
    {
      id: "enterprise_yesterday",
      name: "Yesterday's Enterprise",
      stardate: 43625.2,
      earth_date: "2366-04-10",
      type: "Incursion",
      severity: 9,
      timeline_branch: "Alternate",
      location: "Narendra III System",
      participants: ["Enterprise-C", "Enterprise-D", "Tasha Yar"],
      description:
        "Enterprise-C emerges from temporal rift, creating alternate timeline where Federation is at war with Klingons",
      resolution_status: "Resolved",
      temporal_coordinates: { century: 24, year: 2344, month: 12, day: 15 },
      investigation_priority: "Critical",
      department_of_temporal_investigations: true,
      chroniton_signature: 95.7,
      causality_violations: [
        "Tasha Yar survival",
        "Federation-Klingon War",
        "Enterprise-D military variant",
      ],
      butterfly_effect_potential: 95,
      paradox_classification: "Grandfather Paradox Variant",
      associated_technology: ["Temporal Rift", "Chroniton Particles"],
      witnesses: ["Jean-Luc Picard", "Geordi La Forge", "Data", "Worf"],
      temporal_shielding_required: true,
    },
    {
      id: "first_contact_borg",
      name: "First Contact Temporal Incursion",
      stardate: 50893.5,
      earth_date: "2373-11-26",
      type: "Incursion",
      severity: 10,
      timeline_branch: "Prime",
      location: "Earth, Montana",
      participants: ["Borg Queen", "Enterprise-E Crew", "Zefram Cochrane"],
      description:
        "Borg attempt to prevent First Contact by assimilating Earth in the past",
      resolution_status: "Resolved",
      temporal_coordinates: { century: 21, year: 2063, month: 4, day: 5 },
      investigation_priority: "Critical",
      department_of_temporal_investigations: true,
      chroniton_signature: 99.8,
      causality_violations: [
        "Borg presence in 21st century",
        "Cochrane exposure to future technology",
      ],
      butterfly_effect_potential: 100,
      paradox_classification: "Bootstrap Paradox",
      associated_technology: ["Borg Temporal Vortex", "Transwarp Technology"],
      witnesses: [
        "Jean-Luc Picard",
        "William Riker",
        "Deanna Troi",
        "Zefram Cochrane",
      ],
      temporal_shielding_required: true,
    },
    {
      id: "city_edge_forever",
      name: "City on the Edge of Forever",
      stardate: 3134.0,
      earth_date: "2267-04-06",
      type: "Displacement",
      severity: 8,
      timeline_branch: "Alternate",
      location: "Guardian Planet",
      participants: ["James T. Kirk", "Spock", "Leonard McCoy", "Edith Keeler"],
      description:
        "McCoy's temporal displacement creates alternate timeline where Nazis win WWII",
      resolution_status: "Resolved",
      temporal_coordinates: { century: 20, year: 1930, month: 10, day: 12 },
      investigation_priority: "High",
      department_of_temporal_investigations: false,
      chroniton_signature: 87.3,
      causality_violations: [
        "Nazi victory in WWII",
        "Delayed space program",
        "Edith Keeler's death",
      ],
      butterfly_effect_potential: 98,
      paradox_classification: "Temporal Causality Loop",
      associated_technology: ["Guardian of Forever"],
      witnesses: ["James T. Kirk", "Spock", "Leonard McCoy"],
      temporal_shielding_required: false,
    },
    {
      id: "temporal_causality_loop",
      name: "Cause and Effect Loop",
      stardate: 45652.1,
      earth_date: "2368-03-23",
      type: "Loop",
      severity: 6,
      timeline_branch: "Prime",
      location: "Typhon Expanse",
      participants: ["Enterprise-D", "USS Bozeman", "Captain Morgan Bateson"],
      description:
        "Enterprise-D trapped in temporal causality loop, repeating destruction for 17.4 days",
      resolution_status: "Resolved",
      temporal_coordinates: { century: 24, year: 2368, month: 3, day: 23 },
      investigation_priority: "Medium",
      department_of_temporal_investigations: true,
      chroniton_signature: 72.4,
      causality_violations: [
        "Repetitive timeline",
        "Memory retention",
        "Déjà vu experiences",
      ],
      butterfly_effect_potential: 15,
      paradox_classification: "Temporal Causality Loop",
      associated_technology: ["Temporal Distortion Field", "Subspace Anomaly"],
      witnesses: ["Data", "Jean-Luc Picard", "William Riker"],
      temporal_shielding_required: false,
    },
    {
      id: "ds9_trials_tribbleations",
      name: "Trials and Tribble-ations",
      stardate: 4523.3,
      earth_date: "2373-11-04",
      type: "Displacement",
      severity: 5,
      timeline_branch: "Prime",
      location: "Deep Space K-7, 2268",
      participants: [
        "Benjamin Sisko",
        "Jadzia Dax",
        "Julian Bashir",
        "Arne Darvin",
      ],
      description:
        "DS9 crew travels to 2268 to prevent Arne Darvin from assassinating Captain Kirk",
      resolution_status: "Resolved",
      temporal_coordinates: { century: 23, year: 2268, month: 8, day: 15 },
      investigation_priority: "Medium",
      department_of_temporal_investigations: true,
      chroniton_signature: 68.9,
      causality_violations: [
        "Future technology exposure",
        "Temporal Prime Directive violations",
      ],
      butterfly_effect_potential: 25,
      associated_technology: ["Orb of Time", "Temporal Transporter"],
      witnesses: [
        "Benjamin Sisko",
        "Jadzia Dax",
        "Julian Bashir",
        "Miles O'Brien",
      ],
      temporal_shielding_required: true,
    },
    {
      id: "voyager_year_hell",
      name: "Year of Hell",
      stardate: 51268.4,
      earth_date: "2374-11-11",
      type: "Incursion",
      severity: 9,
      timeline_branch: "Alternate",
      location: "Delta Quadrant",
      participants: ["Voyager Crew", "Annorax", "Krenim Imperium"],
      description:
        "Krenim weapon ship erases species and events from timeline over 200 years",
      resolution_status: "Resolved",
      temporal_coordinates: { century: 24, year: 2374, month: 11, day: 11 },
      investigation_priority: "Critical",
      department_of_temporal_investigations: false,
      chroniton_signature: 94.2,
      causality_violations: [
        "Species erasure",
        "Timeline manipulation",
        "Temporal weapon usage",
      ],
      butterfly_effect_potential: 99,
      paradox_classification: "Temporal Weapon Paradox",
      associated_technology: ["Temporal Weapon Ship", "Chroniton Torpedoes"],
      witnesses: ["Kathryn Janeway", "Chakotay", "Tom Paris", "Seven of Nine"],
      temporal_shielding_required: true,
    },
    {
      id: "enterprise_temporal_cold_war",
      name: "Temporal Cold War",
      stardate: 0, // Pre-stardate era
      earth_date: "2151-2155",
      type: "Incursion",
      severity: 8,
      timeline_branch: "Prime",
      location: "Various locations, 22nd century",
      participants: [
        "Enterprise NX-01 Crew",
        "Suliban Cabal",
        "Future Guy",
        "Daniels",
      ],
      description:
        "Multi-year conflict involving factions from 28th century manipulating 22nd century timeline",
      resolution_status: "Resolved",
      temporal_coordinates: { century: 22, year: 2151, month: 4, day: 16 },
      investigation_priority: "Critical",
      department_of_temporal_investigations: false,
      chroniton_signature: 88.6,
      causality_violations: [
        "28th century interference",
        "Suliban genetic enhancement",
        "Timeline manipulation",
      ],
      butterfly_effect_potential: 85,
      paradox_classification: "Multi-Temporal Warfare",
      associated_technology: [
        "Temporal Agent Technology",
        "Genetic Enhancement",
        "Temporal Observatories",
      ],
      witnesses: [
        "Jonathan Archer",
        "T'Pol",
        "Charles Tucker III",
        "Malcolm Reed",
      ],
      temporal_shielding_required: true,
    },
    {
      id: "discovery_red_angel",
      name: "Red Angel Temporal Anomaly",
      stardate: 2257.213,
      earth_date: "2257-05-15",
      type: "Displacement",
      severity: 7,
      timeline_branch: "Prime",
      location: "Various locations",
      participants: ["Discovery Crew", "Gabrielle Burnham", "Control AI"],
      description:
        "Time traveler from future attempts to prevent AI apocalypse by manipulating past events",
      resolution_status: "Resolved",
      temporal_coordinates: { century: 23, year: 2257, month: 5, day: 15 },
      investigation_priority: "Critical",
      department_of_temporal_investigations: false,
      chroniton_signature: 91.7,
      causality_violations: [
        "AI apocalypse prevention",
        "Sphere data protection",
        "Future technology transfer",
      ],
      butterfly_effect_potential: 90,
      paradox_classification: "Bootstrap Prevention Paradox",
      associated_technology: [
        "Red Angel Suit",
        "Time Crystals",
        "Quantum Tunneling",
      ],
      witnesses: ["Michael Burnham", "Spock", "Christopher Pike", "Saru"],
      temporal_shielding_required: true,
    },
  ];

  const timelineNodes: TimelineNode[] = [
    {
      id: "prime_timeline",
      name: "Prime Timeline",
      timeline: "Prime",
      year: 2024,
      description:
        "The primary timeline of Star Trek universe, generally unaltered by major temporal incursions",
      major_events: [
        "First Contact with Vulcans (2063)",
        "Formation of United Federation of Planets (2161)",
        "Original Enterprise missions (2265-2270)",
        "Enterprise-D missions (2364-2370)",
        "Dominion War (2373-2375)",
        "Voyager's return from Delta Quadrant (2378)",
      ],
      stability_index: 95,
      quantum_flux: 15,
      alternate_outcomes: [
        "Mirror Universe",
        "Kelvin Timeline",
        "Yesterday's Enterprise Timeline",
      ],
    },
    {
      id: "mirror_universe",
      name: "Mirror Universe",
      timeline: "Mirror",
      year: 2024,
      description:
        "Dark parallel universe where the Terran Empire replaced the Federation",
      major_events: [
        "Terran Empire expansion",
        "Mirror Kirk's crossover (2267)",
        "Terran Empire's fall to Klingon-Cardassian Alliance",
        "Mirror Sisko's rise to power",
        "Terran Rebellion against Alliance",
      ],
      divergence_point: "Unknown ancient divergence",
      stability_index: 78,
      quantum_flux: 35,
      alternate_outcomes: ["Prime Universe", "Reformed Terran Republic"],
    },
    {
      id: "kelvin_timeline",
      name: "Kelvin Timeline",
      timeline: "Kelvin",
      year: 2024,
      description:
        "Alternate timeline created by Nero's time travel and destruction of USS Kelvin",
      major_events: [
        "USS Kelvin destruction (2233)",
        "Vulcan destruction (2258)",
        "Alternate Kirk's Starfleet career",
        "Khan's early awakening (2259)",
        "Alternate five-year mission",
      ],
      divergence_point: "Nero's temporal incursion (2233)",
      stability_index: 82,
      quantum_flux: 28,
      alternate_outcomes: [
        "Prime Timeline",
        "Various Nero-influenced outcomes",
      ],
    },
    {
      id: "yesterday_enterprise",
      name: "Yesterday's Enterprise Timeline",
      timeline: "Alternate",
      year: 2366,
      description:
        "Timeline where Enterprise-C was destroyed at Narendra III, leading to Federation-Klingon war",
      major_events: [
        "Enterprise-C destruction at Narendra III (2344)",
        "Federation-Klingon War continuation",
        "Tasha Yar's survival and military service",
        "Enterprise-D as warship configuration",
        "Timeline correction through Enterprise-C return",
      ],
      divergence_point: "Enterprise-C temporal displacement (2344)",
      stability_index: 45,
      quantum_flux: 85,
      alternate_outcomes: ["Prime Timeline", "Continued war timeline"],
    },
    {
      id: "wolf359_alternate",
      name: "Wolf 359 Alternate Timeline",
      timeline: "Alternate",
      year: 2367,
      description:
        "Timeline where Borg successfully conquered Earth after Wolf 359",
      major_events: [
        "Complete Borg victory at Wolf 359",
        "Earth assimilation",
        "Federation collapse",
        "Alpha Quadrant under Borg control",
        "Resistance movements formation",
      ],
      divergence_point: "Borg tactical superiority at Wolf 359",
      stability_index: 30,
      quantum_flux: 95,
      alternate_outcomes: ["Prime Timeline", "Borg-dominated galaxy"],
    },
    {
      id: "year_of_hell",
      name: "Year of Hell Timeline",
      timeline: "Alternate",
      year: 2374,
      description:
        "Timeline manipulated by Krenim temporal weapon ship over 200 years",
      major_events: [
        "Krenim Imperium restoration",
        "Species erasure from timeline",
        "Voyager's year-long battle for survival",
        "Annorax's 200-year quest",
        "Timeline restoration through weapon ship destruction",
      ],
      divergence_point: "Krenim temporal weapon activation",
      stability_index: 25,
      quantum_flux: 98,
      alternate_outcomes: ["Prime Timeline", "Krenim-dominated Delta Quadrant"],
    },
  ];

  const temporalTechnology: TemporalTechnology[] = [
    {
      id: "guardian_forever",
      name: "Guardian of Forever",
      type: "Travel",
      time_period: "Ancient",
      inventor: "Unknown Ancient Race",
      risk_level: 10,
      temporal_displacement_capability: 100,
      precision_rating: 95,
      safety_protocols: [
        "Temporal Prime Directive",
        "Starfleet General Orders",
      ],
      known_side_effects: [
        "Complete timeline alteration",
        "Causality violations",
      ],
      temporal_accord_status: "Restricted",
      description:
        "Ancient sentient time portal capable of accessing any point in history",
    },
    {
      id: "slingshot_effect",
      name: "Slingshot Effect",
      type: "Travel",
      time_period: "23rd-24th Century",
      inventor: "Starfleet Sciences",
      risk_level: 8,
      temporal_displacement_capability: 85,
      precision_rating: 60,
      safety_protocols: [
        "Precise gravitational calculations",
        "Crew temporal shielding",
      ],
      known_side_effects: [
        "Ship stress damage",
        "Temporal displacement uncertainty",
      ],
      temporal_accord_status: "Restricted",
      description:
        "Use of stellar gravitational fields to achieve time travel through high warp speeds",
    },
    {
      id: "orb_of_time",
      name: "Orb of Time",
      type: "Travel",
      time_period: "Ancient Bajoran",
      inventor: "Bajoran Prophets",
      risk_level: 6,
      temporal_displacement_capability: 75,
      precision_rating: 80,
      safety_protocols: ["Prophet guidance", "Limited exposure time"],
      known_side_effects: ["Temporal psychosis", "Memory alteration"],
      temporal_accord_status: "Regulated",
      description:
        "Bajoran Orb that enables limited time travel and temporal viewing",
    },
    {
      id: "borg_temporal_vortex",
      name: "Borg Temporal Vortex",
      type: "Travel",
      time_period: "24th Century",
      inventor: "Borg Collective",
      risk_level: 9,
      temporal_displacement_capability: 95,
      precision_rating: 85,
      safety_protocols: [
        "Collective consciousness coordination",
        "Temporal assimilation",
      ],
      known_side_effects: ["Timeline corruption", "Temporal paradoxes"],
      temporal_accord_status: "Banned",
      description:
        "Borg technology creating transwarp-based temporal vortex for time travel",
    },
    {
      id: "krenim_temporal_weapon",
      name: "Krenim Temporal Weapon",
      type: "Weapon",
      time_period: "24th Century",
      inventor: "Annorax (Krenim)",
      risk_level: 10,
      temporal_displacement_capability: 100,
      precision_rating: 90,
      safety_protocols: [
        "Temporal core shielding",
        "Precise targeting calculations",
      ],
      known_side_effects: ["Species erasure", "Timeline cascade effects"],
      temporal_accord_status: "Banned",
      description:
        "Weapon capable of erasing matter from timeline without temporal paradox",
    },
    {
      id: "time_crystals",
      name: "Time Crystals",
      type: "Travel",
      time_period: "23rd Century",
      inventor: "Klingon Empire",
      risk_level: 7,
      temporal_displacement_capability: 80,
      precision_rating: 75,
      safety_protocols: [
        "Crystal extraction rituals",
        "Klingon monastery oversight",
      ],
      known_side_effects: ["Fixed timeline viewing", "Temporal energy drain"],
      temporal_accord_status: "Restricted",
      description:
        "Crystalline formations that exist outside normal spacetime, enabling time travel",
    },
    {
      id: "red_angel_suit",
      name: "Red Angel Suit",
      type: "Travel",
      time_period: "33rd Century",
      inventor: "Future Federation",
      risk_level: 8,
      temporal_displacement_capability: 90,
      precision_rating: 85,
      safety_protocols: [
        "Neural interface calibration",
        "Quantum signature masking",
      ],
      known_side_effects: [
        "Neural degradation",
        "Temporal displacement syndrome",
      ],
      temporal_accord_status: "Restricted",
      description:
        "Advanced time travel suit using quantum tunneling and time crystal technology",
    },
    {
      id: "temporal_transporters",
      name: "Temporal Transporters",
      type: "Travel",
      time_period: "28th Century",
      inventor: "Temporal Agents",
      risk_level: 5,
      temporal_displacement_capability: 70,
      precision_rating: 95,
      safety_protocols: [
        "Agent authorization",
        "Temporal Prime Directive compliance",
      ],
      known_side_effects: [
        "Minimal temporal displacement",
        "Brief disorientation",
      ],
      temporal_accord_status: "Approved",
      description:
        "Advanced transporter technology allowing precise temporal displacement",
    },
  ];

  const filteredEvents = temporalEvents.filter((event) => {
    const severityMatch =
      filterSeverity === "All" ||
      (filterSeverity === "Low" && event.severity <= 3) ||
      (filterSeverity === "Medium" &&
        event.severity >= 4 &&
        event.severity <= 6) ||
      (filterSeverity === "High" &&
        event.severity >= 7 &&
        event.severity <= 8) ||
      (filterSeverity === "Critical" && event.severity >= 9);
    const timelineMatch =
      filterTimeline === "All" || event.timeline_branch === filterTimeline;
    return severityMatch && timelineMatch;
  });

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return "text-green-400 border-green-400 bg-green-400/20";
    if (severity <= 6)
      return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
    if (severity <= 8)
      return "text-orange-400 border-orange-400 bg-orange-400/20";
    return "text-red-400 border-red-400 bg-red-400/20";
  };

  const getTimelineBranchColor = (branch: string) => {
    switch (branch) {
      case "Prime":
        return "text-blue-400 border-blue-400 bg-blue-400/20";
      case "Mirror":
        return "text-purple-400 border-purple-400 bg-purple-400/20";
      case "Kelvin":
        return "text-orange-400 border-orange-400 bg-orange-400/20";
      case "Alternate":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      default:
        return "text-gray-400 border-gray-400 bg-gray-400/20";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Incursion":
        return <AlertTriangle className="w-5 h-5" />;
      case "Paradox":
        return <Zap className="w-5 h-5" />;
      case "Loop":
        return <RotateCcw className="w-5 h-5" />;
      case "Displacement":
        return <Clock className="w-5 h-5" />;
      case "Causality":
        return <Target className="w-5 h-5" />;
      case "Natural":
        return <Eye className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          TEMPORAL MECHANICS & INVESTIGATIONS
        </h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "events" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "events"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("events")}
          >
            <Clock className="w-4 h-4 mr-2" />
            Temporal Events
          </Button>
          <Button
            variant={activeTab === "timelines" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "timelines"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("timelines")}
          >
            <GitBranch className="w-4 h-4 mr-2" />
            Timelines
          </Button>
          <Button
            variant={activeTab === "technology" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "technology"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("technology")}
          >
            <Database className="w-4 h-4 mr-2" />
            Technology
          </Button>
          <Button
            variant={activeTab === "investigations" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "investigations"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("investigations")}
          >
            <Search className="w-4 h-4 mr-2" />
            DTI Reports
          </Button>
        </div>
      </div>

      {/* Filters for Events Tab */}
      {activeTab === "events" && (
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-trek-text/70">Severity:</span>
            <div className="flex gap-1">
              {["All", "Low", "Medium", "High", "Critical"].map((severity) => (
                <Button
                  key={severity}
                  variant={filterSeverity === severity ? "default" : "outline"}
                  size="sm"
                  className={
                    filterSeverity === severity
                      ? "bg-trek-blue text-trek-dark"
                      : "border-trek-accent text-trek-text hover:bg-trek-accent"
                  }
                  onClick={() => setFilterSeverity(severity)}
                >
                  {severity}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-trek-text/70">Timeline:</span>
            <div className="flex gap-1">
              {["All", "Prime", "Mirror", "Kelvin", "Alternate", "Unknown"].map(
                (timeline) => (
                  <Button
                    key={timeline}
                    variant={
                      filterTimeline === timeline ? "default" : "outline"
                    }
                    size="sm"
                    className={
                      filterTimeline === timeline
                        ? "bg-trek-blue text-trek-dark"
                        : "border-trek-accent text-trek-text hover:bg-trek-accent"
                    }
                    onClick={() => setFilterTimeline(timeline)}
                  >
                    {timeline}
                  </Button>
                ),
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "events" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className={`bg-trek-panel border-trek-accent p-4 cursor-pointer transition-colors hover:border-trek-blue ${
                  selectedEvent?.id === event.id
                    ? "border-trek-blue bg-trek-blue/5"
                    : ""
                }`}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-trek-gold text-xl">
                      {getTypeIcon(event.type)}
                    </span>
                    <div>
                      <h3 className="font-bold text-trek-gold text-lg">
                        {event.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getSeverityColor(event.severity)}`}
                        >
                          Severity: {event.severity}/10
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getTimelineBranchColor(event.timeline_branch)}`}
                        >
                          {event.timeline_branch}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-trek-text/70">Priority</div>
                    <div
                      className={`font-semibold ${
                        event.investigation_priority === "Critical"
                          ? "text-red-400"
                          : event.investigation_priority === "High"
                            ? "text-orange-400"
                            : event.investigation_priority === "Medium"
                              ? "text-yellow-400"
                              : "text-green-400"
                      }`}
                    >
                      {event.investigation_priority}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Stardate:</span>
                    <span className="text-trek-blue">{event.stardate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Status:</span>
                    <span
                      className={`${
                        event.resolution_status === "Resolved"
                          ? "text-green-400"
                          : event.resolution_status === "Ongoing"
                            ? "text-yellow-400"
                            : event.resolution_status === "Unresolved"
                              ? "text-red-400"
                              : "text-blue-400"
                      }`}
                    >
                      {event.resolution_status}
                    </span>
                  </div>
                  <div className="flex justify-between col-span-2">
                    <span className="text-trek-text/70">Location:</span>
                    <span className="text-trek-blue text-xs">
                      {event.location}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {selectedEvent && (
            <Card className="bg-trek-panel border-trek-blue p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-trek-gold text-2xl">
                  {getTypeIcon(selectedEvent.type)}
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-trek-gold">
                    {selectedEvent.name}
                  </h3>
                  <p className="text-trek-blue">
                    {selectedEvent.type} • {selectedEvent.timeline_branch}{" "}
                    Timeline
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Event Description
                  </h4>
                  <p className="text-sm text-trek-text/80">
                    {selectedEvent.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-trek-text/70 text-sm">Stardate</div>
                    <div className="text-trek-blue font-semibold">
                      {selectedEvent.stardate}
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">Earth Date</div>
                    <div className="text-trek-blue font-semibold">
                      {selectedEvent.earth_date}
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">Location</div>
                    <div className="text-trek-blue font-semibold">
                      {selectedEvent.location}
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      DTI Investigation
                    </div>
                    <div
                      className={`font-semibold ${selectedEvent.department_of_temporal_investigations ? "text-green-400" : "text-red-400"}`}
                    >
                      {selectedEvent.department_of_temporal_investigations
                        ? "Yes"
                        : "No"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-trek-text/70 text-sm mb-1">
                      Severity Level
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          getSeverityColor(selectedEvent.severity).split(" ")[0]
                        }
                      >
                        {selectedEvent.severity}/10
                      </span>
                    </div>
                    <Progress
                      value={selectedEvent.severity * 10}
                      className="h-2 mt-1"
                    />
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm mb-1">
                      Butterfly Effect Potential
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-trek-warning">
                        {selectedEvent.butterfly_effect_potential}%
                      </span>
                    </div>
                    <Progress
                      value={selectedEvent.butterfly_effect_potential}
                      className="h-2 mt-1"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Key Participants
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedEvent.participants.map((participant, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs border-trek-blue text-trek-blue"
                      >
                        {participant}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Causality Violations
                  </h4>
                  <div className="space-y-1">
                    {selectedEvent.causality_violations.map((violation, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-trek-warning" />
                        <span>{violation}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedEvent.associated_technology && (
                  <div>
                    <h4 className="font-semibold text-trek-gold mb-2">
                      Associated Technology
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedEvent.associated_technology.map((tech, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs border-trek-accent text-trek-text"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-trek-accent">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                    >
                      <History className="w-4 h-4 mr-2" />
                      Full Report
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-trek-warning text-trek-warning hover:bg-trek-warning hover:text-trek-dark"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Temporal Shielding
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === "timelines" && (
        <div className="space-y-4">
          {timelineNodes.map((timeline) => (
            <Card
              key={timeline.id}
              className="bg-trek-panel border-trek-accent p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <GitBranch className="w-6 h-6 text-trek-gold" />
                  <div>
                    <h3 className="font-bold text-trek-gold text-lg">
                      {timeline.name}
                    </h3>
                    <p className="text-trek-blue">
                      {timeline.timeline} Timeline • {timeline.year}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-trek-text/70 text-sm">
                    Stability Index
                  </div>
                  <div className="text-trek-blue font-semibold">
                    {timeline.stability_index}%
                  </div>
                </div>
              </div>

              <p className="text-sm text-trek-text/80 mb-4">
                {timeline.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-trek-text/70 text-sm mb-1">
                    Stability Index
                  </div>
                  <Progress value={timeline.stability_index} className="h-3" />
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm mb-1">
                    Quantum Flux
                  </div>
                  <Progress value={timeline.quantum_flux} className="h-3" />
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-trek-gold mb-2">
                  Major Events
                </h4>
                <div className="grid grid-cols-1 gap-1">
                  {timeline.major_events.map((event, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-trek-blue" />
                      <span>{event}</span>
                    </div>
                  ))}
                </div>
              </div>

              {timeline.divergence_point && (
                <div className="mb-4">
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Divergence Point
                  </h4>
                  <p className="text-sm text-trek-warning">
                    {timeline.divergence_point}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                >
                  <GitBranch className="w-4 h-4 mr-2" />
                  Timeline Analysis
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Quantum Calculations
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "technology" && (
        <div className="space-y-4">
          {temporalTechnology.map((tech) => (
            <Card
              key={tech.id}
              className="bg-trek-panel border-trek-accent p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-trek-gold" />
                  <div>
                    <h3 className="font-bold text-trek-gold text-lg">
                      {tech.name}
                    </h3>
                    <p className="text-trek-blue">
                      {tech.type} • {tech.time_period}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      tech.temporal_accord_status === "Banned"
                        ? "text-red-400 border-red-400 bg-red-400/20"
                        : tech.temporal_accord_status === "Restricted"
                          ? "text-orange-400 border-orange-400 bg-orange-400/20"
                          : tech.temporal_accord_status === "Regulated"
                            ? "text-yellow-400 border-yellow-400 bg-yellow-400/20"
                            : "text-green-400 border-green-400 bg-green-400/20"
                    }`}
                  >
                    {tech.temporal_accord_status}
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-trek-text/80 mb-4">
                {tech.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-trek-text/70 text-sm mb-1">
                    Risk Level
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        tech.risk_level <= 3
                          ? "text-green-400"
                          : tech.risk_level <= 6
                            ? "text-yellow-400"
                            : tech.risk_level <= 8
                              ? "text-orange-400"
                              : "text-red-400"
                      }
                    >
                      {tech.risk_level}/10
                    </span>
                  </div>
                  <Progress value={tech.risk_level * 10} className="h-2 mt-1" />
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm mb-1">
                    Displacement Capability
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400">
                      {tech.temporal_displacement_capability}%
                    </span>
                  </div>
                  <Progress
                    value={tech.temporal_displacement_capability}
                    className="h-2 mt-1"
                  />
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm mb-1">
                    Precision Rating
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">
                      {tech.precision_rating}%
                    </span>
                  </div>
                  <Progress
                    value={tech.precision_rating}
                    className="h-2 mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Safety Protocols
                  </h4>
                  <div className="space-y-1">
                    {tech.safety_protocols.map((protocol, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Shield className="w-3 h-3 text-green-400" />
                        <span>{protocol}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Known Side Effects
                  </h4>
                  <div className="space-y-1">
                    {tech.known_side_effects.map((effect, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="w-3 h-3 text-trek-warning" />
                        <span>{effect}</span>
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
                  Technical Specifications
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
            </Card>
          ))}
        </div>
      )}

      {activeTab === "investigations" && (
        <Card className="bg-trek-panel border-trek-accent p-6">
          <div className="flex items-center gap-3 mb-6">
            <Search className="w-8 h-8 text-trek-gold" />
            <div>
              <h3 className="text-2xl font-bold text-trek-gold">
                Department of Temporal Investigations
              </h3>
              <p className="text-trek-blue">
                Protecting the timeline since 2270
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-trek-dark border-trek-blue p-4">
              <h4 className="font-semibold text-trek-blue mb-3">
                Active Investigations
              </h4>
              <div className="text-3xl font-bold text-trek-gold mb-2">
                {
                  filteredEvents.filter(
                    (e) => e.resolution_status === "Ongoing",
                  ).length
                }
              </div>
              <p className="text-sm text-trek-text/70">
                Cases requiring active monitoring
              </p>
            </Card>

            <Card className="bg-trek-dark border-trek-gold p-4">
              <h4 className="font-semibold text-trek-gold mb-3">
                Critical Priority
              </h4>
              <div className="text-3xl font-bold text-trek-warning mb-2">
                {
                  filteredEvents.filter(
                    (e) => e.investigation_priority === "Critical",
                  ).length
                }
              </div>
              <p className="text-sm text-trek-text/70">
                High-priority temporal threats
              </p>
            </Card>

            <Card className="bg-trek-dark border-trek-accent p-4">
              <h4 className="font-semibold text-trek-text mb-3">
                Resolved Cases
              </h4>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {
                  filteredEvents.filter(
                    (e) => e.resolution_status === "Resolved",
                  ).length
                }
              </div>
              <p className="text-sm text-trek-text/70">
                Successfully resolved incidents
              </p>
            </Card>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-trek-gold mb-4">
              Temporal Prime Directive Compliance
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Timeline Integrity</span>
                <span className="text-trek-blue">98.7%</span>
              </div>
              <Progress value={98.7} className="h-3" />

              <div className="flex items-center justify-between">
                <span className="text-sm">Causality Preservation</span>
                <span className="text-trek-blue">97.2%</span>
              </div>
              <Progress value={97.2} className="h-3" />

              <div className="flex items-center justify-between">
                <span className="text-sm">Paradox Prevention</span>
                <span className="text-trek-blue">99.1%</span>
              </div>
              <Progress value={99.1} className="h-3" />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-trek-accent">
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
              >
                <Database className="w-4 h-4 mr-2" />
                Full DTI Archive
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
              >
                <Shield className="w-4 h-4 mr-2" />
                Temporal Protocols
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-trek-warning text-trek-warning hover:bg-trek-warning hover:text-trek-dark"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Emergency Procedures
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
