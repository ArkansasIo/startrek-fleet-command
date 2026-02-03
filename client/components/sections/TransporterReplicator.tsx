import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  Users,
  MapPin,
  Coffee,
  Utensils,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Waves,
  Settings,
  RefreshCw,
} from "lucide-react";

interface TransporterPad {
  id: number;
  status: "Ready" | "Occupied" | "In Transit" | "Maintenance" | "Offline";
  occupant?: string;
  destination?: string;
  integrity: number;
  last_used: string;
}

interface BeamLocation {
  id: string;
  name: string;
  coordinates: string;
  safety_rating: "Safe" | "Caution" | "Dangerous";
  distance_km: number;
  interference_level: number;
}

interface ReplicatorItem {
  id: string;
  name: string;
  category: "Food" | "Beverage" | "Tools" | "Medical" | "Components";
  energy_cost: number;
  complexity: number;
  preparation_time: number;
  icon: React.ReactNode;
}

export function TransporterReplicator() {
  const [activeTab, setActiveTab] = useState<"transporter" | "replicator">(
    "transporter",
  );
  const [transporterPads, setTransporterPads] = useState<TransporterPad[]>([
    { id: 1, status: "Ready", integrity: 100, last_used: "14:23" },
    { id: 2, status: "Ready", integrity: 98, last_used: "13:45" },
    { id: 3, status: "Maintenance", integrity: 85, last_used: "12:30" },
    { id: 4, status: "Ready", integrity: 100, last_used: "15:12" },
    { id: 5, status: "Ready", integrity: 95, last_used: "14:56" },
    { id: 6, status: "Ready", integrity: 100, last_used: "15:01" },
  ]);

  const [selectedPad, setSelectedPad] = useState<number | null>(null);
  const [beamInProgress, setBeamInProgress] = useState(false);
  const [beamProgress, setBeamProgress] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<BeamLocation | null>(
    null,
  );
  const [replicatorOrder, setReplicatorOrder] = useState<ReplicatorItem | null>(
    null,
  );
  const [replicationProgress, setReplicationProgress] = useState(0);
  const [energyReserves, setEnergyReserves] = useState(87);

  const beamLocations: BeamLocation[] = [
    {
      id: "bridge",
      name: "Main Bridge",
      coordinates: "Deck 1, Section A",
      safety_rating: "Safe",
      distance_km: 0,
      interference_level: 0,
    },
    {
      id: "engineering",
      name: "Main Engineering",
      coordinates: "Deck 36, Section B",
      safety_rating: "Safe",
      distance_km: 0,
      interference_level: 0,
    },
    {
      id: "sickbay",
      name: "Sickbay",
      coordinates: "Deck 12, Section C",
      safety_rating: "Safe",
      distance_km: 0,
      interference_level: 0,
    },
    {
      id: "planet_surface",
      name: "Planetary Surface",
      coordinates: "28.5°N, 45.2°W",
      safety_rating: "Caution",
      distance_km: 2847,
      interference_level: 15,
    },
    {
      id: "space_station",
      name: "Deep Space Nine",
      coordinates: "Bajoran System",
      safety_rating: "Safe",
      distance_km: 0,
      interference_level: 5,
    },
    {
      id: "away_team",
      name: "Away Team Alpha",
      coordinates: "Unknown Planet",
      safety_rating: "Dangerous",
      distance_km: 15000,
      interference_level: 35,
    },
  ];

  const replicatorItems: ReplicatorItem[] = [
    {
      id: "coffee",
      name: "Coffee, Black",
      category: "Beverage",
      energy_cost: 2,
      complexity: 1,
      preparation_time: 3,
      icon: <Coffee className="w-4 h-4" />,
    },
    {
      id: "tea_earl_grey",
      name: "Tea, Earl Grey, Hot",
      category: "Beverage",
      energy_cost: 2,
      complexity: 2,
      preparation_time: 4,
      icon: <Coffee className="w-4 h-4" />,
    },
    {
      id: "rations",
      name: "Emergency Rations",
      category: "Food",
      energy_cost: 8,
      complexity: 3,
      preparation_time: 12,
      icon: <Package className="w-4 h-4" />,
    },
    {
      id: "pasta",
      name: "Pasta Marinara",
      category: "Food",
      energy_cost: 15,
      complexity: 6,
      preparation_time: 18,
      icon: <Utensils className="w-4 h-4" />,
    },
    {
      id: "tricorder",
      name: "Tricorder",
      category: "Tools",
      energy_cost: 45,
      complexity: 9,
      preparation_time: 35,
      icon: <Settings className="w-4 h-4" />,
    },
    {
      id: "medical_kit",
      name: "Medical Kit",
      category: "Medical",
      energy_cost: 38,
      complexity: 8,
      preparation_time: 28,
      icon: <Package className="w-4 h-4" />,
    },
    {
      id: "isolinear_chip",
      name: "Isolinear Chip",
      category: "Components",
      energy_cost: 25,
      complexity: 7,
      preparation_time: 22,
      icon: <Package className="w-4 h-4" />,
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (beamInProgress) {
      interval = setInterval(() => {
        setBeamProgress((prev) => {
          if (prev >= 100) {
            setBeamInProgress(false);
            setTransporterPads((pads) =>
              pads.map((pad) =>
                pad.id === selectedPad
                  ? {
                      ...pad,
                      status: "Ready",
                      occupant: undefined,
                      destination: undefined,
                    }
                  : pad,
              ),
            );
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [beamInProgress, selectedPad]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (replicatorOrder && replicationProgress < 100) {
      interval = setInterval(() => {
        setReplicationProgress((prev) => {
          if (prev >= 100) {
            setTimeout(() => {
              setReplicatorOrder(null);
              setReplicationProgress(0);
              setEnergyReserves((e) =>
                Math.max(0, e - (replicatorOrder?.energy_cost || 0)),
              );
            }, 1000);
            return 100;
          }
          return prev + 100 / (replicatorOrder?.preparation_time || 1);
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [replicatorOrder]);

  const initiateBeam = () => {
    if (!selectedPad || !selectedLocation) return;

    setBeamInProgress(true);
    setBeamProgress(0);

    setTransporterPads((pads) =>
      pads.map((pad) =>
        pad.id === selectedPad
          ? {
              ...pad,
              status: "In Transit",
              occupant: "Away Team Member",
              destination: selectedLocation.name,
            }
          : pad,
      ),
    );
  };

  const initiateReplication = (item: ReplicatorItem) => {
    if (energyReserves < item.energy_cost) return;

    setReplicatorOrder(item);
    setReplicationProgress(0);
  };

  const getPadStatusColor = (status: string) => {
    switch (status) {
      case "Ready":
        return "text-green-400 border-green-400 bg-green-400/20";
      case "Occupied":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "In Transit":
        return "text-blue-400 border-blue-400 bg-blue-400/20";
      case "Maintenance":
        return "text-red-400 border-red-400 bg-red-400/20";
      case "Offline":
        return "text-gray-400 border-gray-400 bg-gray-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  const getSafetyColor = (rating: string) => {
    switch (rating) {
      case "Safe":
        return "text-green-400 border-green-400 bg-green-400/20";
      case "Caution":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Dangerous":
        return "text-red-400 border-red-400 bg-red-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          TRANSPORTER & REPLICATOR
        </h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "transporter" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "transporter"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("transporter")}
          >
            <Zap className="w-4 h-4 mr-2" />
            Transporter
          </Button>
          <Button
            variant={activeTab === "replicator" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "replicator"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("replicator")}
          >
            <Package className="w-4 h-4 mr-2" />
            Replicator
          </Button>
        </div>
      </div>

      {activeTab === "transporter" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transporter Pads */}
          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-4">
              Transporter Pads
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {transporterPads.map((pad) => (
                <div
                  key={pad.id}
                  className={`p-3 border rounded cursor-pointer transition-colors ${
                    selectedPad === pad.id
                      ? "border-trek-blue bg-trek-blue/10"
                      : "border-trek-accent hover:border-trek-blue/50"
                  } ${pad.status === "Offline" ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() =>
                    pad.status !== "Offline" && setSelectedPad(pad.id)
                  }
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-trek-gold">
                      Pad {pad.id}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getPadStatusColor(pad.status)}`}
                    >
                      {pad.status}
                    </Badge>
                  </div>

                  {pad.occupant && (
                    <div className="text-sm text-trek-text/80 mb-1">
                      Occupant: {pad.occupant}
                    </div>
                  )}

                  {pad.destination && (
                    <div className="text-sm text-trek-blue mb-1">
                      Destination: {pad.destination}
                    </div>
                  )}

                  <div className="flex justify-between text-xs">
                    <span className="text-trek-text/70">
                      Integrity: {pad.integrity}%
                    </span>
                    <span className="text-trek-text/70">
                      Last: {pad.last_used}
                    </span>
                  </div>

                  {beamInProgress && selectedPad === pad.id && (
                    <div className="mt-2">
                      <Progress value={beamProgress} className="h-2" />
                      <div className="text-xs text-trek-blue mt-1">
                        Energizing... {Math.round(beamProgress)}%
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedPad && (
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-trek-gold mb-2">
                    Transport Controls
                  </h4>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                      disabled={!selectedLocation || beamInProgress}
                      onClick={initiateBeam}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Energize
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                    >
                      <Waves className="w-4 h-4 mr-2" />
                      Pattern Buffer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-trek-warning text-trek-warning hover:bg-trek-warning hover:text-trek-dark"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Recalibrate
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Beam Locations */}
          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-4">
              Beam Destinations
            </h3>
            <div className="space-y-2">
              {beamLocations.map((location) => (
                <div
                  key={location.id}
                  className={`p-3 border rounded cursor-pointer transition-colors ${
                    selectedLocation?.id === location.id
                      ? "border-trek-blue bg-trek-blue/10"
                      : "border-trek-accent hover:border-trek-blue/50"
                  }`}
                  onClick={() => setSelectedLocation(location)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-trek-gold">
                        {location.name}
                      </h4>
                      <p className="text-sm text-trek-text/70">
                        {location.coordinates}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getSafetyColor(location.safety_rating)}`}
                    >
                      {location.safety_rating}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-trek-blue" />
                      <span>{location.distance_km} km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Waves className="w-3 h-3 text-trek-warning" />
                      <span>{location.interference_level}% interference</span>
                    </div>
                  </div>

                  {location.interference_level > 20 && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-trek-warning">
                      <AlertTriangle className="w-3 h-3" />
                      <span>High interference - Transport not recommended</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "replicator" && (
        <div className="space-y-6">
          {/* Energy Status */}
          <Card className="bg-trek-panel border-trek-accent p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-trek-gold">
                Replicator Energy Status
              </h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-trek-blue">
                  {energyReserves}%
                </div>
                <div className="text-sm text-trek-text/70">
                  Available Energy
                </div>
              </div>
            </div>
            <Progress value={energyReserves} className="mt-2" />
          </Card>

          {/* Active Replication */}
          {replicatorOrder && (
            <Card className="bg-trek-panel border-trek-blue p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-trek-gold text-2xl">
                  {replicatorOrder.icon}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-trek-gold">
                    Replicating: {replicatorOrder.name}
                  </h3>
                  <p className="text-trek-blue">
                    Energy Cost: {replicatorOrder.energy_cost} units
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="text-trek-blue">
                    {Math.round(replicationProgress)}%
                  </span>
                </div>
                <Progress value={replicationProgress} />

                {replicationProgress === 100 && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Replication complete</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Replicator Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {replicatorItems.map((item) => (
              <Card
                key={item.id}
                className="bg-trek-panel border-trek-accent p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-trek-gold text-xl">{item.icon}</span>
                  <div>
                    <h4 className="font-semibold text-trek-gold">
                      {item.name}
                    </h4>
                    <Badge
                      variant="secondary"
                      className="text-xs mt-1 border-trek-blue text-trek-blue"
                    >
                      {item.category}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1 text-sm mb-3">
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Energy Cost:</span>
                    <span className="text-trek-blue">
                      {item.energy_cost} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Complexity:</span>
                    <span className="text-trek-blue">{item.complexity}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Time:</span>
                    <span className="text-trek-blue">
                      {item.preparation_time}s
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="w-full bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                  disabled={
                    energyReserves < item.energy_cost || !!replicatorOrder
                  }
                  onClick={() => initiateReplication(item)}
                >
                  {energyReserves < item.energy_cost
                    ? "Insufficient Energy"
                    : "Replicate"}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
