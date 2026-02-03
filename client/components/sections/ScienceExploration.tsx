import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Microscope,
  Eye,
  Atom,
  Dna,
  Brain,
  Zap,
  Search,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface ResearchProject {
  id: string;
  name: string;
  field:
    | "Physics"
    | "Biology"
    | "Engineering"
    | "Xenobiology"
    | "Temporal Mechanics"
    | "Quantum Physics";
  description: string;
  progress: number;
  duration_days: number;
  researchers_assigned: number;
  scientific_merit: number;
  status: "Active" | "Completed" | "On Hold" | "Failed";
  breakthrough_potential: number;
}

interface Discovery {
  id: string;
  name: string;
  type: "Species" | "Technology" | "Phenomenon" | "Artifact" | "Element";
  stardate: string;
  location: string;
  significance: "Minor" | "Major" | "Revolutionary";
  description: string;
  applications: string[];
}

interface ScanResult {
  id: string;
  target: string;
  scan_type:
    | "Biological"
    | "Geological"
    | "Atmospheric"
    | "Technological"
    | "Temporal";
  completion: number;
  findings: string[];
  anomalies: string[];
}

export function ScienceExploration() {
  const [activeTab, setActiveTab] = useState<
    "research" | "discoveries" | "scans"
  >("research");
  const [selectedProject, setSelectedProject] =
    useState<ResearchProject | null>(null);
  const [activeScan, setActiveScan] = useState<ScanResult | null>(null);

  const [researchProjects, setResearchProjects] = useState<ResearchProject[]>([
    {
      id: "warp1",
      name: "Transwarp Drive Development",
      field: "Physics",
      description:
        "Developing stable transwarp corridors for instantaneous travel across vast distances.",
      progress: 67,
      duration_days: 547,
      researchers_assigned: 15,
      scientific_merit: 95,
      status: "Active",
      breakthrough_potential: 88,
    },
    {
      id: "bio1",
      name: "Borg Nanoprobe Analysis",
      field: "Xenobiology",
      description:
        "Studying Borg nanoprobe technology for potential medical applications.",
      progress: 23,
      duration_days: 234,
      researchers_assigned: 8,
      scientific_merit: 78,
      status: "Active",
      breakthrough_potential: 92,
    },
    {
      id: "temp1",
      name: "Temporal Shielding Matrix",
      field: "Temporal Mechanics",
      description:
        "Creating protective barriers against temporal anomalies and paradoxes.",
      progress: 100,
      duration_days: 456,
      researchers_assigned: 12,
      scientific_merit: 89,
      status: "Completed",
      breakthrough_potential: 76,
    },
    {
      id: "quantum1",
      name: "Quantum Entanglement Communication",
      field: "Quantum Physics",
      description:
        "Instantaneous communication across any distance using quantum mechanics.",
      progress: 45,
      duration_days: 298,
      researchers_assigned: 18,
      scientific_merit: 93,
      status: "Active",
      breakthrough_potential: 95,
    },
  ]);

  const discoveries: Discovery[] = [
    {
      id: "disc1",
      name: "Tachyon Detection Grid",
      type: "Technology",
      stardate: "47892.1",
      location: "Alpha Quadrant Research Station",
      significance: "Major",
      description:
        "Revolutionary sensor technology capable of detecting subspace distortions and cloaked vessels.",
      applications: ["Tactical Systems", "Navigation", "Scientific Research"],
    },
    {
      id: "disc2",
      name: "Crystalline Entity",
      type: "Species",
      stardate: "47845.3",
      location: "Omicron Theta System",
      significance: "Revolutionary",
      description:
        "Silicon-based lifeform capable of consuming organic matter on planetary scales.",
      applications: [
        "Xenobiology Studies",
        "Ecosystem Analysis",
        "Planetary Protection",
      ],
    },
    {
      id: "disc3",
      name: "Omega Molecule",
      type: "Phenomenon",
      stardate: "47832.7",
      location: "Classified",
      significance: "Revolutionary",
      description:
        "Highly unstable molecule with potential for unlimited energy generation.",
      applications: [
        "Energy Production",
        "Warp Drive Enhancement",
        "Weapons Technology",
      ],
    },
  ];

  const [scanResults, setScanResults] = useState<ScanResult[]>([
    {
      id: "scan1",
      target: "Kepler-438b Atmosphere",
      scan_type: "Atmospheric",
      completion: 78,
      findings: [
        "Nitrogen-Oxygen atmosphere",
        "Trace methane deposits",
        "Electromagnetic anomalies",
      ],
      anomalies: [
        "Unusual ionization patterns",
        "Temporal displacement readings",
      ],
    },
    {
      id: "scan2",
      target: "Asteroid Belt Sigma-7",
      scan_type: "Geological",
      completion: 100,
      findings: [
        "Rich dilithium deposits",
        "Metallic ore concentrations",
        "Rare earth elements",
      ],
      anomalies: [],
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setResearchProjects((prev) =>
        prev.map((project) => ({
          ...project,
          progress:
            project.status === "Active" && project.progress < 100
              ? Math.min(100, project.progress + Math.random() * 0.5)
              : project.progress,
        })),
      );

      setScanResults((prev) =>
        prev.map((scan) => ({
          ...scan,
          completion:
            scan.completion < 100
              ? Math.min(100, scan.completion + Math.random() * 2)
              : scan.completion,
        })),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getFieldColor = (field: string) => {
    switch (field) {
      case "Physics":
        return "text-blue-400 border-blue-400 bg-blue-400/20";
      case "Biology":
        return "text-green-400 border-green-400 bg-green-400/20";
      case "Engineering":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Xenobiology":
        return "text-purple-400 border-purple-400 bg-purple-400/20";
      case "Temporal Mechanics":
        return "text-cyan-400 border-cyan-400 bg-cyan-400/20";
      case "Quantum Physics":
        return "text-pink-400 border-pink-400 bg-pink-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  const getFieldIcon = (field: string) => {
    switch (field) {
      case "Physics":
        return <Atom className="w-4 h-4" />;
      case "Biology":
        return <Dna className="w-4 h-4" />;
      case "Engineering":
        return <Zap className="w-4 h-4" />;
      case "Xenobiology":
        return <Microscope className="w-4 h-4" />;
      case "Temporal Mechanics":
        return <Clock className="w-4 h-4" />;
      case "Quantum Physics":
        return <Brain className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case "Revolutionary":
        return "text-trek-gold border-trek-gold bg-trek-gold/20";
      case "Major":
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
      case "Minor":
        return "text-trek-text border-trek-accent bg-trek-accent/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          SCIENCE & EXPLORATION
        </h2>
        <div className="flex gap-2">
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
            <Microscope className="w-4 h-4 mr-2" />
            Research
          </Button>
          <Button
            variant={activeTab === "discoveries" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "discoveries"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("discoveries")}
          >
            <Award className="w-4 h-4 mr-2" />
            Discoveries
          </Button>
          <Button
            variant={activeTab === "scans" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "scans"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("scans")}
          >
            <Eye className="w-4 h-4 mr-2" />
            Active Scans
          </Button>
        </div>
      </div>

      {activeTab === "research" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {researchProjects.map((project) => (
              <Card
                key={project.id}
                className={`bg-trek-panel border-trek-accent p-4 cursor-pointer transition-colors hover:border-trek-blue ${
                  selectedProject?.id === project.id
                    ? "border-trek-blue bg-trek-blue/5"
                    : ""
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-trek-gold">
                      {getFieldIcon(project.field)}
                    </span>
                    <div>
                      <h3 className="font-bold text-trek-gold">
                        {project.name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={`text-xs mt-1 ${getFieldColor(project.field)}`}
                      >
                        {getFieldIcon(project.field)}
                        <span className="ml-1">{project.field}</span>
                      </Badge>
                    </div>
                  </div>

                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      project.status === "Completed"
                        ? "bg-green-400/20 text-green-400 border-green-400"
                        : project.status === "Active"
                          ? "bg-trek-blue/20 text-trek-blue border-trek-blue"
                          : project.status === "Failed"
                            ? "bg-red-400/20 text-red-400 border-red-400"
                            : "bg-yellow-400/20 text-yellow-400 border-yellow-400"
                    }`}
                  >
                    {project.status === "Completed" && (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    )}
                    {project.status === "Active" && (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    )}
                    {project.status === "Failed" && (
                      <AlertTriangle className="w-3 h-3 mr-1" />
                    )}
                    {project.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-trek-text/70">Progress</span>
                      <span className="text-trek-blue">
                        {Math.round(project.progress)}%
                      </span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Researchers:</span>
                      <span className="text-trek-blue">
                        {project.researchers_assigned}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Duration:</span>
                      <span className="text-trek-blue">
                        {project.duration_days}d
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Merit:</span>
                      <span className="text-trek-gold">
                        {project.scientific_merit}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-trek-text/70">Breakthrough:</span>
                      <span className="text-trek-warning">
                        {project.breakthrough_potential}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {selectedProject && (
            <Card className="bg-trek-panel border-trek-blue p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-trek-gold text-2xl">
                  {getFieldIcon(selectedProject.field)}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-trek-gold">
                    {selectedProject.name}
                  </h3>
                  <p className="text-trek-blue">
                    {selectedProject.field} Research
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Project Description
                  </h4>
                  <p className="text-sm text-trek-text/80">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Research Team
                    </div>
                    <div className="text-trek-blue font-semibold">
                      {selectedProject.researchers_assigned} Scientists
                    </div>
                  </div>
                  <div>
                    <div className="text-trek-text/70 text-sm">
                      Project Duration
                    </div>
                    <div className="text-trek-blue font-semibold">
                      {selectedProject.duration_days} Days
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-trek-text/70 text-sm mb-2">
                    Progress Analysis
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion:</span>
                      <span className="text-trek-blue">
                        {Math.round(selectedProject.progress)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Scientific Merit:</span>
                      <span className="text-trek-gold">
                        {selectedProject.scientific_merit}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Breakthrough Potential:</span>
                      <span className="text-trek-warning">
                        {selectedProject.breakthrough_potential}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-trek-accent">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Accelerate Research
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review Data
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === "discoveries" && (
        <div className="space-y-4">
          {discoveries.map((discovery) => (
            <Card
              key={discovery.id}
              className="bg-trek-panel border-trek-accent p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-trek-gold" />
                  <div>
                    <h3 className="font-bold text-trek-gold text-lg">
                      {discovery.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className="text-xs border-trek-blue text-trek-blue"
                      >
                        {discovery.type}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getSignificanceColor(discovery.significance)}`}
                      >
                        {discovery.significance}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="text-right text-sm">
                  <div className="text-trek-text/70">
                    Stardate {discovery.stardate}
                  </div>
                  <div className="text-trek-blue">{discovery.location}</div>
                </div>
              </div>

              <p className="text-trek-text/80 mb-4">{discovery.description}</p>

              <div>
                <h4 className="font-semibold text-trek-gold mb-2">
                  Potential Applications
                </h4>
                <div className="flex flex-wrap gap-1">
                  {discovery.applications.map((app, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="text-xs border-trek-accent text-trek-text"
                    >
                      {app}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "scans" && (
        <div className="space-y-4">
          {scanResults.map((scan) => (
            <Card
              key={scan.id}
              className="bg-trek-panel border-trek-accent p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-trek-blue" />
                  <div>
                    <h3 className="font-bold text-trek-gold">{scan.target}</h3>
                    <Badge
                      variant="secondary"
                      className="text-xs mt-1 border-trek-blue text-trek-blue"
                    >
                      <Search className="w-3 h-3 mr-1" />
                      {scan.scan_type} Scan
                    </Badge>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-trek-blue font-semibold">
                    {Math.round(scan.completion)}%
                  </div>
                  <Progress value={scan.completion} className="w-24 h-2 mt-1" />
                </div>
              </div>

              {scan.completion === 100 && (
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-trek-gold mb-2">
                      Scan Results
                    </h4>
                    <div className="space-y-1">
                      {scan.findings.map((finding, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>{finding}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {scan.anomalies.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-trek-warning mb-2">
                        Anomalies Detected
                      </h4>
                      <div className="space-y-1">
                        {scan.anomalies.map((anomaly, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm"
                          >
                            <AlertTriangle className="w-4 h-4 text-trek-warning" />
                            <span className="text-trek-warning">{anomaly}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
