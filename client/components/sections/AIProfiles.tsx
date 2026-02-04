import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Zap, Shield, Target } from "lucide-react";

interface AIProfileProps {
  activeSubmenu?: string;
}

export function AIProfiles({ activeSubmenu }: AIProfileProps) {
  const aiProfiles = [
    {
      id: 1,
      name: "Data",
      type: "Positronic AI",
      intelligence: 99,
      loyalty: 100,
      efficiency: 98,
      specialization: "Multi-tasking & Problem Solving",
    },
    {
      id: 2,
      name: "The Doctor",
      type: "Holographic AI",
      intelligence: 95,
      loyalty: 90,
      efficiency: 92,
      specialization: "Medical & Crisis Management",
    },
    {
      id: 3,
      name: "Seven of Nine",
      type: "Hybrid AI",
      intelligence: 97,
      loyalty: 88,
      efficiency: 96,
      specialization: "Tactical & Engineering",
    },
  ];

  return (
    <div className="space-y-6">
      {/* AI Overview */}
      <Card className="bg-trek-panel border-trek-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-trek-gold">
            <Brain className="w-5 h-5" />
            Active AI Systems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiProfiles.map((ai) => (
              <div
                key={ai.id}
                className="bg-trek-dark/50 p-4 rounded border border-trek-blue/30 space-y-3"
              >
                <div>
                  <div className="font-bold text-trek-gold text-lg">{ai.name}</div>
                  <div className="text-xs text-trek-text/60">{ai.type}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-trek-text/70 text-sm">Intelligence</span>
                    <span className="text-trek-blue font-bold">{ai.intelligence}%</span>
                  </div>
                  <div className="w-full bg-trek-dark rounded h-1.5">
                    <div
                      className="bg-trek-blue h-1.5 rounded"
                      style={{ width: `${ai.intelligence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-trek-text/70 text-sm">Loyalty</span>
                    <span className="text-trek-green font-bold">{ai.loyalty}%</span>
                  </div>
                  <div className="w-full bg-trek-dark rounded h-1.5">
                    <div
                      className="bg-trek-green h-1.5 rounded"
                      style={{ width: `${ai.loyalty}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-trek-text/70 text-sm">Efficiency</span>
                    <span className="text-trek-gold font-bold">{ai.efficiency}%</span>
                  </div>
                  <div className="w-full bg-trek-dark rounded h-1.5">
                    <div
                      className="bg-trek-gold h-1.5 rounded"
                      style={{ width: `${ai.efficiency}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-trek-accent">
                  <div className="text-xs text-trek-text/60 mb-2">Specialization</div>
                  <div className="text-xs text-trek-blue font-semibold">{ai.specialization}</div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-trek-blue text-trek-blue hover:bg-trek-blue/10"
                  >
                    Configure
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-trek-gold text-trek-gold hover:bg-trek-gold/10"
                  >
                    Deploy
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Capabilities */}
      <Card className="bg-trek-panel border-trek-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-trek-gold">
            <Zap className="w-5 h-5" />
            AI Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Combat Analysis", status: "Active" },
            { name: "Resource Optimization", status: "Active" },
            { name: "Fleet Coordination", status: "Standby" },
            { name: "Threat Assessment", status: "Active" },
            { name: "Navigation Planning", status: "Active" },
            { name: "Diplomatic Protocol", status: "Standby" },
          ].map((cap, idx) => (
            <div key={idx} className="bg-trek-dark/50 p-3 rounded border border-trek-blue/30 flex justify-between items-center">
              <span className="text-trek-text">{cap.name}</span>
              <span className={`text-xs font-bold ${cap.status === "Active" ? "text-trek-green" : "text-trek-text/50"}`}>
                {cap.status}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Learning Progress */}
      <Card className="bg-trek-panel border-trek-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-trek-gold">
            <Target className="w-5 h-5" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { skill: "Combat Tactics", progress: 85 },
            { skill: "Diplomacy Protocols", progress: 72 },
            { skill: "Engineering Systems", progress: 91 },
            { skill: "Medical Procedures", progress: 88 },
          ].map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-1">
                <span className="text-trek-text text-sm">{item.skill}</span>
                <span className="text-trek-blue font-bold text-sm">{item.progress}%</span>
              </div>
              <div className="w-full bg-trek-dark rounded h-2">
                <div
                  className="bg-trek-blue h-2 rounded transition-all"
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
