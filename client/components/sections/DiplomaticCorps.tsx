import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  HeartHandshake,
  Scale,
  BookOpen,
  Crown,
  Zap,
  Globe,
} from "lucide-react";

interface Civilization {
  id: string;
  name: string;
  homeworld: string;
  warp_capable: boolean;
  technology_level: number;
  government_type: string;
  relations_status:
    | "Allied"
    | "Neutral"
    | "Hostile"
    | "Unknown"
    | "Under Observation";
  prime_directive_applies: boolean;
  contact_level: "None" | "Limited" | "Open" | "Full Diplomatic";
  threat_assessment: number;
  cultural_traits: string[];
  recent_events: string[];
}

interface DiplomaticMission {
  id: string;
  title: string;
  civilization: string;
  objective: string;
  status: "Planned" | "Active" | "Completed" | "Failed" | "Suspended";
  prime_directive_risk: number;
  cultural_sensitivity: number;
  success_probability: number;
  assigned_diplomat: string;
  duration_days: number;
  ethical_considerations: string[];
}

interface PrimeDirectiveAlert {
  id: string;
  civilization: string;
  violation_type:
    | "Cultural Contamination"
    | "Technology Transfer"
    | "Political Interference"
    | "Religious Interference";
  severity: "Low" | "Medium" | "High" | "Critical";
  description: string;
  recommended_action: string;
  timestamp: string;
}

export function DiplomaticCorps() {
  const [activeTab, setActiveTab] = useState<
    "civilizations" | "missions" | "prime-directive"
  >("civilizations");
  const [selectedCivilization, setSelectedCivilization] =
    useState<Civilization | null>(null);

  const civilizations: Civilization[] = [
    {
      id: "vulcan",
      name: "Vulcan High Command",
      homeworld: "Vulcan (40 Eridani A)",
      warp_capable: true,
      technology_level: 9,
      government_type: "High Command Council",
      relations_status: "Allied",
      prime_directive_applies: false,
      contact_level: "Full Diplomatic",
      threat_assessment: 1,
      cultural_traits: [
        "Logic-based society",
        "Pacifist",
        "Advanced telepathy",
        "Ritual combat traditions",
      ],
      recent_events: [
        "Trade agreement renewed",
        "Joint scientific mission approved",
      ],
    },
    {
      id: "klingon",
      name: "Klingon Empire",
      homeworld: "Qo'noS",
      warp_capable: true,
      technology_level: 8,
      government_type: "Imperial Monarchy",
      relations_status: "Neutral",
      prime_directive_applies: false,
      contact_level: "Full Diplomatic",
      threat_assessment: 7,
      cultural_traits: [
        "Warrior culture",
        "Honor-based society",
        "Aggressive expansion",
        "Clan loyalty",
      ],
      recent_events: [
        "Border dispute in Sector 441",
        "Honor duel between houses",
      ],
    },
    {
      id: "tamarian",
      name: "Children of Tama",
      homeworld: "Sigma Tama IV",
      warp_capable: true,
      technology_level: 7,
      government_type: "Collective Leadership",
      relations_status: "Unknown",
      prime_directive_applies: false,
      contact_level: "Limited",
      threat_assessment: 3,
      cultural_traits: [
        "Metaphorical language",
        "Mythological references",
        "Peaceful",
        "Highly advanced",
      ],
      recent_events: [
        "First contact attempted",
        "Communication breakthrough needed",
      ],
    },
    {
      id: "mintaka",
      name: "Mintakan Proto-Vulcanoids",
      homeworld: "Mintaka III",
      warp_capable: false,
      technology_level: 3,
      government_type: "Bronze Age Tribes",
      relations_status: "Under Observation",
      prime_directive_applies: true,
      contact_level: "None",
      threat_assessment: 0,
      cultural_traits: [
        "Proto-Vulcan genetics",
        "Bronze age technology",
        "Polytheistic",
        "Peaceful",
      ],
      recent_events: [
        "Anthropological study ongoing",
        "Duck blind observation post active",
      ],
    },
  ];

  const diplomaticMissions: DiplomaticMission[] = [
    {
      id: "mission1",
      title: "First Contact Protocol - Children of Tama",
      civilization: "Children of Tama",
      objective: "Establish meaningful communication and peaceful relations",
      status: "Active",
      prime_directive_risk: 25,
      cultural_sensitivity: 95,
      success_probability: 67,
      assigned_diplomat: "Captain Jean-Luc Picard",
      duration_days: 14,
      ethical_considerations: [
        "Respect for metaphorical communication",
        "Avoid cultural contamination",
        "Maintain peaceful intentions",
      ],
    },
    {
      id: "mission2",
      title: "Klingon Border Negotiation",
      civilization: "Klingon Empire",
      objective: "Resolve territorial disputes in Sector 441",
      status: "Planned",
      prime_directive_risk: 5,
      cultural_sensitivity: 85,
      success_probability: 45,
      assigned_diplomat: "Ambassador Sarek",
      duration_days: 30,
      ethical_considerations: [
        "Honor Klingon warrior culture",
        "Maintain Federation principles",
        "Avoid military confrontation",
      ],
    },
    {
      id: "mission3",
      title: "Mintakan Cultural Study",
      civilization: "Mintakan Proto-Vulcanoids",
      objective: "Continue anthropological observation without interference",
      status: "Active",
      prime_directive_risk: 90,
      cultural_sensitivity: 99,
      success_probability: 88,
      assigned_diplomat: "Dr. Barron",
      duration_days: 365,
      ethical_considerations: [
        "Absolute non-interference",
        "Maintain observation secrecy",
        "Protect natural development",
      ],
    },
  ];

  const primeDirectiveAlerts: PrimeDirectiveAlert[] = [
    {
      id: "alert1",
      civilization: "Mintakan Proto-Vulcanoids",
      violation_type: "Cultural Contamination",
      severity: "Medium",
      description:
        "Observation post detected by local population. Risk of altering natural cultural development.",
      recommended_action:
        "Immediate memory modification and relocation of observation post",
      timestamp: "47892.3",
    },
    {
      id: "alert2",
      civilization: "Malcorian Civilization",
      violation_type: "Technology Transfer",
      severity: "High",
      description:
        "Crashed shuttle recovered by pre-warp civilization. Advanced technology exposed.",
      recommended_action:
        "Covert retrieval operation and witness memory modification",
      timestamp: "47887.1",
    },
  ];

  const getRelationColor = (status: string) => {
    switch (status) {
      case "Allied":
        return "text-green-400 border-green-400 bg-green-400/20";
      case "Neutral":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Hostile":
        return "text-red-400 border-red-400 bg-red-400/20";
      case "Unknown":
        return "text-purple-400 border-purple-400 bg-purple-400/20";
      case "Under Observation":
        return "text-blue-400 border-blue-400 bg-blue-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "text-red-500 border-red-500 bg-red-500/20";
      case "High":
        return "text-red-400 border-red-400 bg-red-400/20";
      case "Medium":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Low":
        return "text-green-400 border-green-400 bg-green-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          DIPLOMATIC CORPS
        </h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "civilizations" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "civilizations"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("civilizations")}
          >
            <Globe className="w-4 h-4 mr-2" />
            Civilizations
          </Button>
          <Button
            variant={activeTab === "missions" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "missions"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("missions")}
          >
            <HeartHandshake className="w-4 h-4 mr-2" />
            Missions
          </Button>
          <Button
            variant={activeTab === "prime-directive" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "prime-directive"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("prime-directive")}
          >
            <Scale className="w-4 h-4 mr-2" />
            Prime Directive
          </Button>
        </div>
      </div>

      {activeTab === "civilizations" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {civilizations.map((civ) => (
              <Card
                key={civ.id}
                className={`bg-trek-panel border-trek-accent p-4 cursor-pointer transition-colors hover:border-trek-blue ${
                  selectedCivilization?.id === civ.id
                    ? "border-trek-blue bg-trek-blue/5"
                    : ""
                }`}
                onClick={() => setSelectedCivilization(civ)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-trek-gold" />
                    <div>
                      <h3 className="font-bold text-trek-gold">{civ.name}</h3>
                      <p className="text-sm text-trek-text/70">
                        {civ.homeworld}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getRelationColor(civ.relations_status)}`}
                    >
                      {civ.relations_status}
                    </Badge>
                    {civ.prime_directive_applies && (
                      <Badge
                        variant="secondary"
                        className="text-xs border-trek-warning text-trek-warning"
                      >
                        <Scale className="w-3 h-3 mr-1" />
                        Prime Directive
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Tech Level:</span>
                    <span className="text-trek-blue">
                      {civ.technology_level}/10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Threat:</span>
                    <span
                      className={
                        civ.threat_assessment > 5
                          ? "text-red-400"
                          : "text-green-400"
                      }
                    >
                      {civ.threat_assessment}/10
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Contact:</span>
                    <span className="text-trek-blue text-xs">
                      {civ.contact_level}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Warp:</span>
                    <span
                      className={
                        civ.warp_capable ? "text-green-400" : "text-red-400"
                      }
                    >
                      {civ.warp_capable ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {selectedCivilization && (
            <Card className="bg-trek-panel border-trek-blue p-6">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-8 h-8 text-trek-gold" />
                <div>
                  <h3 className="text-2xl font-bold text-trek-gold">
                    {selectedCivilization.name}
                  </h3>
                  <p className="text-trek-blue">
                    {selectedCivilization.government_type}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-trek-text/70 text-sm">Homeworld</div>
                    <div className="text-trek-blue font-semibold">
                      {selectedCivilization.homeworld}
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Contact Level
                    </div>
                    <div className="text-trek-blue font-semibold">
                      {selectedCivilization.contact_level}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Cultural Traits
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedCivilization.cultural_traits.map((trait, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs border-trek-accent text-trek-text"
                      >
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Recent Events
                  </h4>
                  <div className="space-y-1">
                    {selectedCivilization.recent_events.map((event, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-trek-blue" />
                        <span>{event}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedCivilization.prime_directive_applies && (
                  <div className="bg-trek-warning/10 border border-trek-warning p-3 rounded">
                    <div className="flex items-center gap-2 text-trek-warning mb-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-semibold">
                        Prime Directive Applies
                      </span>
                    </div>
                    <p className="text-sm text-trek-text/80">
                      This civilization is pre-warp. All contact must follow
                      strict non-interference protocols.
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-trek-accent">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                    >
                      <HeartHandshake className="w-4 h-4 mr-2" />
                      Initiate Contact
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Cultural Database
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === "missions" && (
        <div className="space-y-4">
          {diplomaticMissions.map((mission) => (
            <Card
              key={mission.id}
              className="bg-trek-panel border-trek-accent p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <HeartHandshake className="w-6 h-6 text-trek-blue" />
                  <div>
                    <h3 className="font-bold text-trek-gold text-lg">
                      {mission.title}
                    </h3>
                    <p className="text-trek-blue text-sm">
                      {mission.civilization}
                    </p>
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className={`${
                    mission.status === "Active"
                      ? "bg-trek-blue/20 text-trek-blue border-trek-blue"
                      : mission.status === "Completed"
                        ? "bg-green-400/20 text-green-400 border-green-400"
                        : mission.status === "Failed"
                          ? "bg-red-400/20 text-red-400 border-red-400"
                          : mission.status === "Suspended"
                            ? "bg-yellow-400/20 text-yellow-400 border-yellow-400"
                            : "bg-trek-accent/20 text-trek-text border-trek-accent"
                  }`}
                >
                  {mission.status}
                </Badge>
              </div>

              <p className="text-trek-text/80 mb-4">{mission.objective}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-trek-text/70 text-sm mb-1">
                    Prime Directive Risk
                  </div>
                  <Progress
                    value={mission.prime_directive_risk}
                    className="mb-1"
                  />
                  <div className="text-xs text-trek-warning">
                    {mission.prime_directive_risk}%
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm mb-1">
                    Cultural Sensitivity
                  </div>
                  <Progress
                    value={mission.cultural_sensitivity}
                    className="mb-1"
                  />
                  <div className="text-xs text-trek-blue">
                    {mission.cultural_sensitivity}%
                  </div>
                </div>
                <div>
                  <div className="text-trek-text/70 text-sm mb-1">
                    Success Probability
                  </div>
                  <Progress
                    value={mission.success_probability}
                    className="mb-1"
                  />
                  <div className="text-xs text-trek-gold">
                    {mission.success_probability}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-trek-blue" />
                  <span>Assigned: {mission.assigned_diplomat}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-trek-blue" />
                  <span>Duration: {mission.duration_days} days</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-trek-gold mb-2">
                  Ethical Considerations
                </h4>
                <div className="space-y-1">
                  {mission.ethical_considerations.map((consideration, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Scale className="w-4 h-4 text-trek-warning" />
                      <span>{consideration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "prime-directive" && (
        <div className="space-y-6">
          <Card className="bg-trek-panel border-trek-warning p-6">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-8 h-8 text-trek-warning" />
              <div>
                <h3 className="text-xl font-bold text-trek-gold">
                  Prime Directive Monitoring
                </h3>
                <p className="text-trek-text/70">
                  General Order #1 - Non-Interference Directive
                </p>
              </div>
            </div>

            <div className="bg-trek-warning/10 border border-trek-warning p-4 rounded mb-4">
              <h4 className="font-semibold text-trek-warning mb-2">
                Starfleet General Order #1
              </h4>
              <p className="text-sm text-trek-text/80">
                "As the right of each sentient species to live in accordance
                with its normal cultural evolution is considered sacred, no
                Starfleet personnel may interfere with the normal and healthy
                development of alien life and culture."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-trek-blue">12</div>
                <div className="text-sm text-trek-text/70">
                  Civilizations Under Observation
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">0</div>
                <div className="text-sm text-trek-text/70">
                  Current Violations
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">2</div>
                <div className="text-sm text-trek-text/70">Active Alerts</div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-trek-gold">Recent Alerts</h3>
            {primeDirectiveAlerts.map((alert) => (
              <Card
                key={alert.id}
                className="bg-trek-panel border-trek-accent p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-trek-warning" />
                    <div>
                      <h4 className="font-bold text-trek-gold">
                        {alert.civilization}
                      </h4>
                      <p className="text-trek-blue text-sm">
                        {alert.violation_type}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge
                      variant="secondary"
                      className={`text-xs mb-1 ${getSeverityColor(alert.severity)}`}
                    >
                      {alert.severity} Severity
                    </Badge>
                    <div className="text-xs text-trek-text/70">
                      Stardate {alert.timestamp}
                    </div>
                  </div>
                </div>

                <p className="text-trek-text/80 mb-3">{alert.description}</p>

                <div className="bg-trek-blue/10 border border-trek-blue p-3 rounded mb-4">
                  <h5 className="font-semibold text-trek-blue mb-1">
                    Recommended Action
                  </h5>
                  <p className="text-sm">{alert.recommended_action}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                  >
                    Execute Recommendation
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-trek-warning text-trek-warning hover:bg-trek-warning hover:text-trek-dark"
                  >
                    Review Ethics Committee
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
