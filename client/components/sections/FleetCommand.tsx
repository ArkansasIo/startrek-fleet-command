import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Rocket,
  Shield,
  Zap,
  Users,
  MapPin,
  Package,
  UserCheck,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface FleetCommandProps {
  activeSubmenu?: string;
}

export function FleetCommand({ activeSubmenu }: FleetCommandProps) {
  const defaultTab = "overview";
  const [activeTab, setActiveTab] = useState(activeSubmenu || defaultTab);

  useEffect(() => {
    setActiveTab(activeSubmenu || defaultTab);
  }, [activeSubmenu]);

  const ships = [
    {
      name: "U.S.S. Enterprise",
      registry: "NCC-1701-D",
      class: "Galaxy-class",
      captain: "Jean-Luc Picard",
      status: "Active",
      location: "Sector 001",
      crew: 1012,
      shields: 100,
      weapons: "Online",
    },
    {
      name: "U.S.S. Voyager",
      registry: "NCC-74656",
      class: "Intrepid-class",
      captain: "Kathryn Janeway",
      status: "Deep Space",
      location: "Delta Quadrant",
      crew: 150,
      shields: 95,
      weapons: "Online",
    },
    {
      name: "U.S.S. Defiant",
      registry: "NX-74205",
      class: "Defiant-class",
      captain: "Benjamin Sisko",
      status: "Patrol",
      location: "Deep Space Nine",
      crew: 47,
      shields: 100,
      weapons: "Armed",
    },
  ];

  const deploymentOrders = [
    {
      id: "OP-2024-001",
      ship: "U.S.S. Enterprise",
      mission: "Diplomatic escort to Risa",
      priority: "High",
      eta: "48 hours",
      status: "In Transit",
    },
    {
      id: "OP-2024-002",
      ship: "U.S.S. Defiant",
      mission: "Border patrol - Cardassian DMZ",
      priority: "Medium",
      eta: "72 hours",
      status: "Active",
    },
    {
      id: "OP-2024-003",
      ship: "U.S.S. Voyager",
      mission: "Deep space exploration",
      priority: "Low",
      eta: "6 months",
      status: "Ongoing",
    },
  ];

  const logistics = [
    {
      category: "Dilithium Reserves",
      current: 2847,
      capacity: 4000,
      percentage: 71,
      status: "Good",
    },
    {
      category: "Antimatter Storage",
      current: 156,
      capacity: 200,
      percentage: 78,
      status: "Good",
    },
    {
      category: "Photon Torpedoes",
      current: 342,
      capacity: 500,
      percentage: 68,
      status: "Adequate",
    },
    {
      category: "Medical Supplies",
      current: 89,
      capacity: 100,
      percentage: 89,
      status: "Excellent",
    },
  ];

  const personnel = [
    {
      name: "Admiral William T. Riker",
      rank: "Admiral",
      position: "Fleet Commander",
      ship: "U.S.S. Titan",
      status: "Active",
    },
    {
      name: "Captain Jean-Luc Picard",
      rank: "Captain",
      position: "Flagship Commander",
      ship: "U.S.S. Enterprise-D",
      status: "Active",
    },
    {
      name: "Captain Kathryn Janeway",
      rank: "Captain",
      position: "Deep Space Commander",
      ship: "U.S.S. Voyager",
      status: "Deep Space",
    },
    {
      name: "Captain Benjamin Sisko",
      rank: "Captain",
      position: "Tactical Operations",
      ship: "U.S.S. Defiant",
      status: "Active",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          FLEET COMMAND CENTER
        </h2>
        <Button className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark font-semibold">
          Deploy New Mission
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-trek-panel border border-trek-accent">
          <TabsTrigger
            value="overview"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Fleet Overview
          </TabsTrigger>
          <TabsTrigger
            value="deployment"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Deployment Orders
          </TabsTrigger>
          <TabsTrigger
            value="logistics"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Fleet Logistics
          </TabsTrigger>
          <TabsTrigger
            value="personnel"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Command Personnel
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ships.map((ship, index) => (
              <Card
                key={index}
                className="bg-trek-panel border-trek-accent p-6 hover:border-trek-blue transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-trek-gold">
                      {ship.name}
                    </h3>
                    <p className="text-trek-text/70 text-sm">{ship.registry}</p>
                    <p className="text-trek-blue text-sm">{ship.class}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`
                      ${ship.status === "Active" ? "bg-trek-blue/20 text-trek-blue border-trek-blue" : ""}
                      ${ship.status === "Deep Space" ? "bg-trek-warning/20 text-trek-warning border-trek-warning" : ""}
                      ${ship.status === "Patrol" ? "bg-trek-gold/20 text-trek-gold border-trek-gold" : ""}
                    `}
                  >
                    {ship.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-trek-gold" />
                    <span className="text-sm">Captain {ship.captain}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-trek-gold" />
                    <span className="text-sm">{ship.location}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="w-4 h-4 text-trek-blue" />
                        <span className="text-xs text-trek-text/70">Crew</span>
                      </div>
                      <div className="text-trek-blue font-semibold">
                        {ship.crew}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Shield className="w-4 h-4 text-trek-blue" />
                        <span className="text-xs text-trek-text/70">
                          Shields
                        </span>
                      </div>
                      <div className="text-trek-blue font-semibold">
                        {ship.shields}%
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Zap className="w-4 h-4 text-trek-blue" />
                        <span className="text-xs text-trek-text/70">
                          Weapons
                        </span>
                      </div>
                      <div className="text-trek-blue font-semibold text-xs">
                        {ship.weapons}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-trek-accent">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Command Ship
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Fleet Status Overview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Active Ships</span>
                  <span className="text-trek-blue font-semibold">47</span>
                </div>
                <div className="flex justify-between">
                  <span>On Mission</span>
                  <span className="text-trek-gold font-semibold">23</span>
                </div>
                <div className="flex justify-between">
                  <span>In Dock</span>
                  <span className="text-trek-text/70">15</span>
                </div>
                <div className="flex justify-between">
                  <span>Deep Space</span>
                  <span className="text-trek-warning font-semibold">9</span>
                </div>
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Recent Commands
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-trek-text/70">15:42</span>
                  <span>U.S.S. Enterprise - Engage warp drive</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-trek-text/70">15:38</span>
                  <span>U.S.S. Defiant - Red Alert status</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-trek-text/70">15:35</span>
                  <span>U.S.S. Voyager - Course correction</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deployment" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-trek-gold">
              Active Deployment Orders
            </h3>
            {deploymentOrders.map((order) => (
              <Card
                key={order.id}
                className="bg-trek-panel border-trek-accent p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h4 className="text-lg font-bold text-trek-gold">
                        {order.id}
                      </h4>
                      <Badge
                        variant="secondary"
                        className={`
                          ${order.priority === "High" ? "bg-red-500/20 text-red-400 border-red-500" : ""}
                          ${order.priority === "Medium" ? "bg-trek-warning/20 text-trek-warning border-trek-warning" : ""}
                          ${order.priority === "Low" ? "bg-trek-blue/20 text-trek-blue border-trek-blue" : ""}
                        `}
                      >
                        {order.priority} Priority
                      </Badge>
                    </div>
                    <p className="text-trek-text mb-2">{order.mission}</p>
                    <div className="flex items-center gap-4 text-sm text-trek-text/70">
                      <span>
                        <Rocket className="w-4 h-4 inline mr-1" />
                        {order.ship}
                      </span>
                      <span>
                        <Clock className="w-4 h-4 inline mr-1" />
                        ETA: {order.eta}
                      </span>
                      <span>
                        <TrendingUp className="w-4 h-4 inline mr-1" />
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                  >
                    Monitor
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logistics" className="mt-6">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-trek-gold">
              Fleet Resource Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {logistics.map((resource) => (
                <Card
                  key={resource.category}
                  className="bg-trek-panel border-trek-accent p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-trek-gold">
                      {resource.category}
                    </h4>
                    <Badge
                      variant="secondary"
                      className={`
                        ${resource.status === "Excellent" ? "bg-green-500/20 text-green-400 border-green-500" : ""}
                        ${resource.status === "Good" ? "bg-trek-blue/20 text-trek-blue border-trek-blue" : ""}
                        ${resource.status === "Adequate" ? "bg-trek-warning/20 text-trek-warning border-trek-warning" : ""}
                        ${resource.status === "Low" ? "bg-red-500/20 text-red-400 border-red-500" : ""}
                      `}
                    >
                      {resource.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current: {resource.current}</span>
                      <span>Capacity: {resource.capacity}</span>
                    </div>
                    <Progress value={resource.percentage} className="h-2" />
                    <div className="text-right text-sm text-trek-text/70">
                      {resource.percentage}% capacity
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="personnel" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-trek-gold">
              Command Personnel Roster
            </h3>
            {personnel.map((officer) => (
              <Card
                key={officer.name}
                className="bg-trek-panel border-trek-accent p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-trek-blue/20 border-2 border-trek-blue rounded-full flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-trek-blue" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-trek-gold">
                        {officer.name}
                      </h4>
                      <p className="text-trek-text/70">
                        {officer.rank} • {officer.position}
                      </p>
                      <p className="text-trek-blue text-sm">{officer.ship}</p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`
                      ${officer.status === "Active" ? "bg-trek-blue/20 text-trek-blue border-trek-blue" : ""}
                      ${officer.status === "Deep Space" ? "bg-trek-warning/20 text-trek-warning border-trek-warning" : ""}
                      ${officer.status === "Off Duty" ? "bg-trek-text/20 text-trek-text border-trek-text" : ""}
                    `}
                  >
                    {officer.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
