import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Rocket, Navigation, Fuel, Clock, AlertTriangle, Info, MapPin, Zap } from "lucide-react";
import { 
  KnownLocation,
  KNOWN_LOCATIONS,
  TravelRoute 
} from "../lib/UniverseTravelSystem";

export function UniverseTravelUI() {
  const [origin, setOrigin] = useState<string>("sol");
  const [destination, setDestination] = useState<string>("vulcan");
  const [warpFactor, setWarpFactor] = useState<number>(9.0);
  const [route, setRoute] = useState<TravelRoute | null>(null);

  const locations = Object.values(KNOWN_LOCATIONS);
  const selectedOrigin = Object.values(KNOWN_LOCATIONS).find(loc => loc.name === origin);
  const selectedDestination = Object.values(KNOWN_LOCATIONS).find(loc => loc.name === destination);

  const calculateRoute = () => {
    if (selectedOrigin && selectedDestination) {
      // Calculate distance
      const dx = selectedDestination.coordinates.x - selectedOrigin.coordinates.x;
      const dy = selectedDestination.coordinates.y - selectedOrigin.coordinates.y;
      const dz = selectedDestination.coordinates.z - selectedOrigin.coordinates.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) * 3.26156; // Convert parsecs to light-years
      
      // Calculate warp speed
      const speedMultiplier = warpFactor <= 9 ? Math.pow(warpFactor, 10 / 3) : Math.pow(warpFactor, 10 / 3) * Math.exp(0.5 * (warpFactor - 9));
      const speedLY = speedMultiplier * 365.25 * 24; // Convert to ly/hour
      const travelTimeHours = distance / speedLY;
      
      const days = Math.floor(travelTimeHours / 24);
      const hours = Math.floor(travelTimeHours % 24);
      const minutes = Math.floor((travelTimeHours * 60) % 60);
      
      // Calculate fuel
      const baseFuel = 100;
      const fuelRequired = Math.floor(baseFuel * distance * Math.pow(warpFactor / 5, 2));
      
      // Generate hazards
      const hazards: string[] = [];
      if (distance > 1000) hazards.push("Extreme Distance");
      if (warpFactor > 9.5) hazards.push("High Warp Stress");
      
      const newRoute: TravelRoute = {
        origin: selectedOrigin.name,
        destination: selectedDestination.name,
        directDistance: distance,
        recommendedWarp: warpFactor,
        travelTime: { days, hours, minutes },
        fuelRequired,
        hazards,
        waypoints: []
      };
      setRoute(newRoute);
    }
  };

  const formatTimeObj = (timeObj: { days: number; hours: number; minutes: number }) => {
    if (timeObj.days > 0) {
      return `${timeObj.days} days${timeObj.hours > 0 ? `, ${timeObj.hours} hours` : ''}`;
    } else if (timeObj.hours > 0) {
      return `${timeObj.hours} hours${timeObj.minutes > 0 ? `, ${timeObj.minutes} min` : ''}`;
    } else {
      return `${timeObj.minutes} minutes`;
    }
  };

  const formatTime = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`;
    } else if (hours < 24) {
      return `${hours.toFixed(1)} hours`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = Math.round(hours % 24);
      return `${days} days${remainingHours > 0 ? `, ${remainingHours} hours` : ''}`;
    }
  };

  const getWarpSpeedMultiplier = (warp: number): number => {
    if (warp < 1) return 1;
    if (warp <= 9) return Math.pow(warp, 10 / 3);
    
    const k = 0.5;
    return Math.pow(warp, 10 / 3) * Math.exp(k * (warp - 9));
  };

  const warpPresets = [
    { factor: 6.0, label: "Warp 6 (Cruise)" },
    { factor: 7.0, label: "Warp 7 (Fast)" },
    { factor: 8.0, label: "Warp 8 (High)" },
    { factor: 9.0, label: "Warp 9 (Maximum)" },
    { factor: 9.6, label: "Warp 9.6 (Emergency)" },
    { factor: 9.9, label: "Warp 9.9 (Extreme)" }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Rocket className="w-8 h-8 text-blue-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">Universe Travel System</h1>
          <p className="text-gray-400">Calculate interstellar travel with real light-year distances</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card className="bg-gray-900/50 border-blue-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              Route Configuration
            </CardTitle>
            <CardDescription>Select origin, destination, and warp speed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Origin Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Origin Location
              </label>
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {locations.map((loc) => (
                    <SelectItem key={loc.name} value={loc.name}>
                      {loc.name} ({loc.quadrant})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedOrigin && (
                <div className="space-y-2 mt-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <h4 className="text-sm font-semibold text-blue-300">{selectedOrigin.name}</h4>
                  <p className="text-xs text-gray-400">{selectedOrigin.description}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div>
                      <span className="text-gray-500">Sector:</span>
                      <div className="text-gray-300 font-medium">{selectedOrigin.sector}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Quadrant:</span>
                      <div className="text-gray-300 font-medium">{selectedOrigin.quadrant}</div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Coordinates:</span>
                      <div className="text-gray-300 font-medium">
                        ({selectedOrigin.coordinates.x.toFixed(2)}, {selectedOrigin.coordinates.y.toFixed(2)}, {selectedOrigin.coordinates.z.toFixed(2)})
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Destination Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Destination Location
              </label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {locations.map((loc) => (
                    <SelectItem key={loc.name} value={loc.name}>
                      {loc.name} ({loc.quadrant})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedDestination && (
                <div className="space-y-2 mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <h4 className="text-sm font-semibold text-green-300">{selectedDestination.name}</h4>
                  <p className="text-xs text-gray-400">{selectedDestination.description}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div>
                      <span className="text-gray-500">Sector:</span>
                      <div className="text-gray-300 font-medium">{selectedDestination.sector}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Quadrant:</span>
                      <div className="text-gray-300 font-medium">{selectedDestination.quadrant}</div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Coordinates:</span>
                      <div className="text-gray-300 font-medium">
                        ({selectedDestination.coordinates.x.toFixed(2)}, {selectedDestination.coordinates.y.toFixed(2)}, {selectedDestination.coordinates.z.toFixed(2)})
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Warp Factor Slider */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Warp Factor: {warpFactor.toFixed(2)} ({getWarpSpeedMultiplier(warpFactor).toFixed(0)}× c)
              </label>
              <Slider
                value={[warpFactor]}
                onValueChange={(value) => setWarpFactor(value[0])}
                min={1}
                max={9.99}
                step={0.01}
                className="w-full"
              />
              <div className="text-xs text-gray-400">
                Speed of light (c) = 299,792 km/s
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Quick Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {warpPresets.map((preset) => (
                  <Button
                    key={preset.factor}
                    variant={Math.abs(warpFactor - preset.factor) < 0.01 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setWarpFactor(preset.factor)}
                    className="text-xs"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              onClick={calculateRoute} 
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Calculate Route
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="bg-gray-900/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Route Analysis
            </CardTitle>
            <CardDescription>Travel time, fuel, and hazard information</CardDescription>
          </CardHeader>
          <CardContent>
            {route ? (
              <div className="space-y-6">
                {/* Distance */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Navigation className="w-4 h-4" />
                    <span className="font-medium">Distance</span>
                  </div>
                  <div className="pl-6 space-y-2">
                    <div className="text-2xl font-bold text-blue-400">
                      {route.directDistance.toFixed(2)} light-years
                    </div>
                    <div className="text-sm text-gray-400">
                      {(route.directDistance * 9.461).toFixed(2)} trillion km ({(route.directDistance / 3.26156).toFixed(2)} parsecs)
                    </div>
                    <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-800/50 rounded">
                      At current technology level, this distance spans approximately {Math.round(route.directDistance / 100)} star sectors
                    </div>
                  </div>
                </div>

                {/* Travel Time */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Travel Time</span>
                  </div>
                  <div className="pl-6 space-y-2">
                    <div className="text-2xl font-bold text-green-400">
                      {formatTimeObj(route.travelTime)}
                    </div>
                    <div className="text-sm text-gray-400">
                      At Warp {route.recommendedWarp.toFixed(2)} ({getWarpSpeedMultiplier(route.recommendedWarp).toFixed(0)}× speed of light)
                    </div>
                    <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-800/50 rounded">
                      Fleet will experience {route.travelTime.days > 30 ? "extreme" : route.travelTime.days > 7 ? "high" : "moderate"} warp stress
                    </div>
                  </div>
                </div>

                {/* Fuel Requirements */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Fuel className="w-4 h-4" />
                    <span className="font-medium">Fuel & Resources</span>
                  </div>
                  <div className="pl-6 space-y-2">
                    <div className="text-2xl font-bold text-purple-400">
                      {route.fuelRequired.toFixed(0)} units
                    </div>
                    <div className="text-sm text-gray-400">
                      Dilithium crystals required
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="p-2 bg-gray-800/50 rounded text-xs">
                        <span className="text-gray-400">Power Output:</span>
                        <div className="text-blue-400 font-semibold">{(route.fuelRequired * 5).toFixed(0)} MW</div>
                      </div>
                      <div className="p-2 bg-gray-800/50 rounded text-xs">
                        <span className="text-gray-400">Efficiency:</span>
                        <div className="text-green-400 font-semibold">{(85 - (route.recommendedWarp - 6) * 2).toFixed(0)}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Route Safety Assessment */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Info className="w-4 h-4" />
                    <span className="font-medium">Route Assessment</span>
                  </div>
                  <div className="pl-6 space-y-2">
                    <div className="p-3 rounded bg-gray-800/50 border border-cyan-500/30">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Traversed Space:</span>
                          <span className="text-white">{route.directDistance > 500 ? "Uncharted Regions" : "Mapped Territory"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Spacial Anomalies:</span>
                          <span className="text-white">{route.directDistance > 1000 ? "Likely" : "Unlikely"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Crew Endurance:</span>
                          <span className={route.travelTime.days > 30 ? "text-orange-400" : "text-green-400"}>
                            {route.travelTime.days > 30 ? "High Stress" : "Manageable"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hazards */}
                {route.hazards.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-yellow-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">Route Hazards ({route.hazards.length})</span>
                    </div>
                    <div className="pl-6 space-y-2">
                      {route.hazards.map((hazard, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Badge 
                            variant="outline" 
                            className={`
                              ${hazard === "Extreme Distance" ? "border-red-500 text-red-400 bg-red-500/10" : ""}
                              ${hazard === "High Warp Stress" ? "border-orange-500 text-orange-400 bg-orange-500/10" : ""}
                              ${hazard === "Uncharted Space" ? "border-yellow-500 text-yellow-400 bg-yellow-500/10" : ""}
                            `}
                          >
                            {hazard}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Waypoints */}
                {route.waypoints.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">Waypoints ({route.waypoints.length})</span>
                    </div>
                    <div className="pl-6 space-y-1">
                      {route.waypoints.map((waypoint, idx) => (
                        <div key={idx} className="text-sm text-gray-400">
                          {idx + 1}. {waypoint.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Crew Considerations */}
                <div className="p-3 rounded bg-blue-500/10 border border-blue-500/30">
                  <h4 className="font-semibold text-blue-400 mb-2">Crew Considerations</h4>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Estimated crew morale impact: {route.travelTime.days > 60 ? "High" : route.travelTime.days > 30 ? "Moderate" : "Low"}</li>
                    <li>• Recommended rest stops: {Math.max(1, Math.floor(route.travelTime.days / 30))}</li>
                    <li>• Medical supply consumption: {route.fuelRequired > 5000 ? "Critical" : "Standard"}</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Navigation className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Configure your route and click Calculate Route</p>
                <p className="text-sm mt-2">to see travel analysis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Warp Speed Reference */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle>Warp Speed Reference (TNG Scale)</CardTitle>
          <CardDescription>Based on Star Trek: The Next Generation warp calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { warp: 1.0, mult: 1, desc: "Speed of Light" },
              { warp: 5.0, mult: 214, desc: "Typical Cruise" },
              { warp: 6.0, mult: 392, desc: "Fast Cruise" },
              { warp: 7.0, mult: 656, desc: "High Speed" },
              { warp: 8.0, mult: 1024, desc: "Very High" },
              { warp: 9.0, mult: 1516, desc: "Maximum" },
              { warp: 9.5, mult: 1649, desc: "Emergency" },
              { warp: 9.6, mult: 1909, desc: "Dangerous" },
              { warp: 9.9, mult: 3053, desc: "Extreme Risk" },
              { warp: 9.99, mult: 7912, desc: "Theoretical Limit" }
            ].map((speed) => (
              <div 
                key={speed.warp}
                className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 transition-colors cursor-pointer"
                onClick={() => setWarpFactor(speed.warp)}
              >
                <div className="text-lg font-bold text-blue-400">Warp {speed.warp.toFixed(1)}</div>
                <div className="text-sm text-gray-300">{speed.mult}× c</div>
                <div className="text-xs text-gray-500 mt-1">{speed.desc}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
