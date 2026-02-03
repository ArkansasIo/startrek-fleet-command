import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  Heart,
  Brain,
  Shield,
  Zap,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  User,
  Briefcase,
  Clock,
  Target,
} from "lucide-react";

interface CrewMember {
  id: string;
  name: string;
  rank: string;
  department: string;
  ship: string;
  experience: number;
  skills: string[];
  morale: number;
  health: number;
  efficiency: number;
  loyalty: number;
  certification: string[];
  status: "active" | "training" | "medical" | "off_duty";
  specialization: string;
}

interface Department {
  name: string;
  crew_count: number;
  avg_morale: number;
  avg_efficiency: number;
  total_exp: number;
  readiness: number;
}

interface TrainingProgram {
  id: string;
  name: string;
  duration_hours: number;
  skill_gained: string;
  crew_enlisted: number;
  completion_rate: number;
  cost: number;
}

export function CrewManagementUI() {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([
    {
      id: "crew_001",
      name: "Captain Jean-Luc Picard",
      rank: "Captain",
      department: "Command",
      ship: "USS Enterprise-D",
      experience: 2500,
      skills: ["Leadership", "Diplomacy", "Tactical Analysis"],
      morale: 95,
      health: 98,
      efficiency: 98,
      loyalty: 100,
      certification: ["Command", "Navigation", "Diplomacy"],
      status: "active",
      specialization: "Starship Operations",
    },
    {
      id: "crew_002",
      name: "Commander William Riker",
      rank: "Commander",
      department: "Operations",
      ship: "USS Enterprise-D",
      experience: 2200,
      skills: ["Tactical", "Bridge Operations", "Leadership"],
      morale: 92,
      health: 95,
      efficiency: 96,
      loyalty: 98,
      certification: ["Command", "Tactical", "Operations"],
      status: "active",
      specialization: "Starship Combat",
    },
    {
      id: "crew_003",
      name: "Lieutenant Commander Data",
      rank: "Lieutenant Commander",
      department: "Operations",
      ship: "USS Enterprise-D",
      experience: 1800,
      skills: ["Data Analysis", "Engineering", "Programming"],
      morale: 88,
      health: 100,
      efficiency: 100,
      loyalty: 96,
      certification: ["Operations", "Engineering", "Science"],
      status: "active",
      specialization: "Artificial Intelligence",
    },
    {
      id: "crew_004",
      name: "Lieutenant Worf",
      rank: "Lieutenant",
      department: "Security",
      ship: "USS Enterprise-D",
      experience: 1600,
      skills: ["Combat", "Security", "Klingon Culture"],
      morale: 85,
      health: 92,
      efficiency: 94,
      loyalty: 94,
      certification: ["Security", "Combat", "Tactical"],
      status: "training",
      specialization: "Security Operations",
    },
    {
      id: "crew_005",
      name: "Dr. Beverly Crusher",
      rank: "Commander",
      department: "Medical",
      ship: "USS Enterprise-D",
      experience: 2100,
      skills: ["Medicine", "Surgery", "Research"],
      morale: 90,
      health: 94,
      efficiency: 97,
      loyalty: 96,
      certification: ["Medical", "Science", "Research"],
      status: "active",
      specialization: "Advanced Medicine",
    },
  ]);

  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([
    {
      id: "prog_1",
      name: "Advanced Tactical Training",
      duration_hours: 40,
      skill_gained: "Advanced Tactical Maneuvers",
      crew_enlisted: 12,
      completion_rate: 75,
      cost: 5000,
    },
    {
      id: "prog_2",
      name: "Medical Certification Course",
      duration_hours: 60,
      skill_gained: "Emergency Medicine",
      crew_enlisted: 8,
      completion_rate: 50,
      cost: 7500,
    },
    {
      id: "prog_3",
      name: "Engineering Excellence Program",
      duration_hours: 50,
      skill_gained: "Advanced Engineering",
      crew_enlisted: 15,
      completion_rate: 85,
      cost: 6000,
    },
  ]);

  const departmentStats = useMemo(() => {
    const depts: { [key: string]: Department } = {};

    crewMembers.forEach(crew => {
      if (!depts[crew.department]) {
        depts[crew.department] = {
          name: crew.department,
          crew_count: 0,
          avg_morale: 0,
          avg_efficiency: 0,
          total_exp: 0,
          readiness: 0,
        };
      }
      depts[crew.department].crew_count++;
      depts[crew.department].avg_morale += crew.morale;
      depts[crew.department].avg_efficiency += crew.efficiency;
      depts[crew.department].total_exp += crew.experience;
    });

    Object.keys(depts).forEach(key => {
      const dept = depts[key];
      dept.avg_morale = Math.round(dept.avg_morale / dept.crew_count);
      dept.avg_efficiency = Math.round(dept.avg_efficiency / dept.crew_count);
      dept.readiness = dept.avg_efficiency;
    });

    return Object.values(depts);
  }, [crewMembers]);

  const fleetStats = useMemo(() => ({
    total_crew: crewMembers.length,
    avg_morale: Math.round(crewMembers.reduce((sum, c) => sum + c.morale, 0) / crewMembers.length),
    avg_efficiency: Math.round(crewMembers.reduce((sum, c) => sum + c.efficiency, 0) / crewMembers.length),
    total_experience: crewMembers.reduce((sum, c) => sum + c.experience, 0),
    active_crew: crewMembers.filter(c => c.status === "active").length,
  }), [crewMembers]);

  const handlePromote = (crewId: string) => {
    setCrewMembers(crew =>
      crew.map(member =>
        member.id === crewId
          ? {
            ...member,
            experience: member.experience + 100,
            efficiency: Math.min(member.efficiency + 2, 100),
            loyalty: Math.min(member.loyalty + 2, 100),
          }
          : member
      )
    );
  };

  const handleBoostMorale = (crewId: string) => {
    setCrewMembers(crew =>
      crew.map(member =>
        member.id === crewId
          ? { ...member, morale: Math.min(member.morale + 5, 100) }
          : member
      )
    );
  };

  const handleStartTraining = (crewId: string, trainingId: string) => {
    setCrewMembers(crew =>
      crew.map(member =>
        member.id === crewId
          ? { ...member, status: "training" as const }
          : member
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "training":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "medical":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "off_duty":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-8 h-8 text-green-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">Crew Management & Development</h1>
          <p className="text-gray-400">Manage crew assignments, training, morale, and performance</p>
        </div>
      </div>

      {/* Fleet Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gray-900/50 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-400 mb-2">Total Crew</div>
            <div className="text-3xl font-bold text-blue-300">{fleetStats.total_crew}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-green-500/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-400 mb-2">Active Personnel</div>
            <div className="text-3xl font-bold text-green-300">{fleetStats.active_crew}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-yellow-500/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-400 mb-2">Avg Morale</div>
            <Progress value={fleetStats.avg_morale} className="mb-2" />
            <div className="text-sm font-bold text-yellow-300">{fleetStats.avg_morale}%</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-purple-500/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-400 mb-2">Avg Efficiency</div>
            <Progress value={fleetStats.avg_efficiency} className="mb-2" />
            <div className="text-sm font-bold text-purple-300">{fleetStats.avg_efficiency}%</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-orange-500/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-400 mb-2">Total Experience</div>
            <div className="text-3xl font-bold text-orange-300">{(fleetStats.total_experience / 1000).toFixed(1)}k</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="crew" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="crew" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Crew Directory
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Departments
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Training
          </TabsTrigger>
        </TabsList>

        {/* Crew Directory Tab */}
        <TabsContent value="crew" className="space-y-4">
          <ScrollArea className="h-[700px] rounded-lg border border-gray-700 p-4">
            <div className="space-y-4 pr-4">
              {crewMembers.map(member => (
                <Card key={member.id} className="bg-gray-900/50 border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-blue-300">{member.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {member.rank} • {member.department} • {member.ship}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status.replace("_", " ").charAt(0).toUpperCase() + member.status.replace("_", " ").slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Specialization */}
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-400">Specialization:</span>
                      <span className="text-blue-300">{member.specialization}</span>
                    </div>

                    {/* Health */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400 flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          Health
                        </span>
                        <span className="text-red-300">{member.health}%</span>
                      </div>
                      <Progress value={member.health} className="h-2" />
                    </div>

                    {/* Morale */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400 flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Morale
                        </span>
                        <span className="text-yellow-300">{member.morale}%</span>
                      </div>
                      <Progress value={member.morale} className="h-2" />
                    </div>

                    {/* Efficiency */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Efficiency
                        </span>
                        <span className="text-green-300">{member.efficiency}%</span>
                      </div>
                      <Progress value={member.efficiency} className="h-2" />
                    </div>

                    {/* Loyalty */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400 flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Loyalty
                        </span>
                        <span className="text-blue-300">{member.loyalty}%</span>
                      </div>
                      <Progress value={member.loyalty} className="h-2" />
                    </div>

                    {/* Skills */}
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Skills</div>
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map(skill => (
                          <Badge key={skill} className="bg-purple-500/20 text-purple-300">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Certifications</div>
                      <div className="flex flex-wrap gap-2">
                        {member.certification.map(cert => (
                          <Badge key={cert} className="bg-green-500/20 text-green-300 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-gray-700">
                      <Button
                        onClick={() => handlePromote(member.id)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Promote
                      </Button>
                      <Button
                        onClick={() => handleBoostMorale(member.id)}
                        size="sm"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        Boost Morale
                      </Button>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Reassign
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {departmentStats.map(dept => (
              <Card key={dept.name} className="bg-gray-900/50 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-300">{dept.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Crew Count */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Personnel</span>
                    <span className="text-blue-300 font-bold">{dept.crew_count}</span>
                  </div>

                  {/* Morale */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Morale</span>
                      <span className="text-yellow-300">{dept.avg_morale}%</span>
                    </div>
                    <Progress value={dept.avg_morale} className="h-2" />
                  </div>

                  {/* Efficiency */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Efficiency</span>
                      <span className="text-green-300">{dept.avg_efficiency}%</span>
                    </div>
                    <Progress value={dept.avg_efficiency} className="h-2" />
                  </div>

                  {/* Experience */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <span className="text-sm text-gray-400">Total Experience</span>
                    <span className="text-purple-300 font-bold">{(dept.total_exp / 1000).toFixed(1)}k</span>
                  </div>

                  {/* Readiness Indicator */}
                  <div className="flex items-center gap-2 mt-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded">
                    <CheckCircle className="w-4 h-4 text-blue-300" />
                    <span className="text-sm text-blue-300">Readiness: {dept.readiness}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-4">
          <ScrollArea className="h-[600px] rounded-lg border border-gray-700 p-4">
            <div className="space-y-4 pr-4">
              {trainingPrograms.map(program => (
                <Card key={program.id} className="bg-gray-900/50 border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-blue-300">{program.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Duration */}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-400">Duration:</span>
                      <span className="text-blue-300">{program.duration_hours} hours</span>
                    </div>

                    {/* Skill Gained */}
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-400">Skill:</span>
                      <span className="text-purple-300">{program.skill_gained}</span>
                    </div>

                    {/* Enrollment */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Crew Enrolled</span>
                        <span className="text-blue-300">{program.crew_enlisted}</span>
                      </div>
                      <Progress value={Math.min(program.crew_enlisted * 10, 100)} className="h-2" />
                    </div>

                    {/* Completion Rate */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Completion Rate</span>
                        <span className="text-green-300">{program.completion_rate}%</span>
                      </div>
                      <Progress value={program.completion_rate} className="h-2" />
                    </div>

                    {/* Cost */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                      <span className="text-sm text-gray-400">Program Cost</span>
                      <span className="text-yellow-300 font-bold">{program.cost.toLocaleString()} credits</span>
                    </div>

                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-2">
                      Start Training
                    </Button>
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
