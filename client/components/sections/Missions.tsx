import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, Users } from "lucide-react";

export function Missions() {
  const missions = [
    {
      title: "First Contact Protocol",
      description: "Establish diplomatic relations with the Tamarian species",
      stardate: "47622.1",
      priority: "High",
      status: "Active",
      assignedShip: "U.S.S. Enterprise",
      progress: 67,
    },
    {
      title: "Wolf 359 Memorial",
      description: "Investigate unusual readings near the Wolf 359 system",
      stardate: "47623.8",
      priority: "Medium",
      status: "Planning",
      assignedShip: "U.S.S. Defiant",
      progress: 12,
    },
    {
      title: "Borg Incursion Response",
      description: "Coordinate defense against Borg cube in Sector 001",
      stardate: "47624.3",
      priority: "Critical",
      status: "Urgent",
      assignedShip: "Fleet Task Force",
      progress: 89,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          MISSION OPERATIONS
        </h2>
        <Button className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark font-semibold">
          Create New Mission
        </Button>
      </div>

      <div className="space-y-4">
        {missions.map((mission, index) => (
          <Card key={index} className="bg-trek-panel border-trek-accent p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-5 h-5 text-trek-gold" />
                  <h3 className="text-xl font-bold text-trek-gold">
                    {mission.title}
                  </h3>
                  <Badge
                    variant="secondary"
                    className={`
                      ${mission.priority === "Critical" ? "bg-red-500/20 text-red-400 border-red-400" : ""}
                      ${mission.priority === "High" ? "bg-trek-warning/20 text-trek-warning border-trek-warning" : ""}
                      ${mission.priority === "Medium" ? "bg-trek-blue/20 text-trek-blue border-trek-blue" : ""}
                    `}
                  >
                    {mission.priority} Priority
                  </Badge>
                </div>
                <p className="text-trek-text/80 mb-3">{mission.description}</p>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-trek-blue" />
                    <span>Stardate {mission.stardate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-trek-blue" />
                    <span>{mission.assignedShip}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <Badge
                  variant="secondary"
                  className={`
                    ${mission.status === "Active" ? "bg-trek-blue/20 text-trek-blue border-trek-blue" : ""}
                    ${mission.status === "Planning" ? "bg-trek-gold/20 text-trek-gold border-trek-gold" : ""}
                    ${mission.status === "Urgent" ? "bg-red-500/20 text-red-400 border-red-400" : ""}
                  `}
                >
                  {mission.status}
                </Badge>
                <div className="mt-2 text-right">
                  <div className="text-xs text-trek-text/70">Progress</div>
                  <div className="text-trek-blue font-semibold">
                    {mission.progress}%
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
              >
                View Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
              >
                Modify Parameters
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
