/**
 * UNIVERSE TRAVEL CALCULATOR
 * Interactive component for calculating real interstellar distances and travel times
 */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  KNOWN_LOCATIONS,
  calculateTravelRoute,
  formatDistance,
  formatTravelTime,
  formatWarpFactor,
  type TravelRoute,
  type KnownLocation,
} from '../../lib/UniverseTravelSystem';
import { Navigation, Rocket, Zap, Fuel, AlertTriangle, MapPin, Clock } from 'lucide-react';

export function UniverseTravelCalculator() {
  const [origin, setOrigin] = useState<string>('SOL');
  const [destination, setDestination] = useState<string>('VULCAN');
  const [warpFactor, setWarpFactor] = useState<number>(9.6);
  const [route, setRoute] = useState<TravelRoute | null>(null);

  const locations = Object.entries(KNOWN_LOCATIONS);

  const calculateRoute = () => {
    const calculatedRoute = calculateTravelRoute(origin, destination, 9.99, warpFactor);
    setRoute(calculatedRoute);
  };

  React.useEffect(() => {
    calculateRoute();
  }, [origin, destination, warpFactor]);

  const originLocation = KNOWN_LOCATIONS[origin];
  const destinationLocation = KNOWN_LOCATIONS[destination];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-trek-panel border-trek-accent">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Navigation className="w-8 h-8 text-trek-blue" />
            <div>
              <CardTitle className="text-2xl text-trek-gold">Universe Travel Calculator</CardTitle>
              <p className="text-trek-text/70 text-sm">
                Calculate real interstellar distances and travel times based on Star Trek TNG warp mechanics
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Origin & Destination Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Origin */}
        <Card className="bg-trek-panel border-trek-accent">
          <CardHeader>
            <CardTitle className="text-lg text-trek-blue flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Origin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-trek-dark border border-trek-accent text-trek-text p-3 rounded focus:outline-none focus:border-trek-blue"
            >
              {locations.map(([key, loc]) => (
                <option key={key} value={key}>
                  {loc.name} ({loc.quadrant} Quadrant)
                </option>
              ))}
            </select>
            {originLocation && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-trek-text/70">Quadrant:</span>
                  <Badge className="bg-trek-blue/20 text-trek-blue border-trek-blue">
                    {originLocation.quadrant}
                  </Badge>
                </div>
                {originLocation.sector && (
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Sector:</span>
                    <span className="text-trek-text">{originLocation.sector}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-trek-text/70">Coordinates:</span>
                  <span className="text-trek-text font-mono text-xs">
                    ({originLocation.coordinates.x.toFixed(2)}, {originLocation.coordinates.y.toFixed(2)}, {originLocation.coordinates.z.toFixed(2)}) pc
                  </span>
                </div>
                {originLocation.description && (
                  <p className="text-trek-text/60 italic text-xs pt-2 border-t border-trek-accent/30">
                    {originLocation.description}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Destination */}
        <Card className="bg-trek-panel border-trek-accent">
          <CardHeader>
            <CardTitle className="text-lg text-trek-gold flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Destination
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-trek-dark border border-trek-accent text-trek-text p-3 rounded focus:outline-none focus:border-trek-gold"
            >
              {locations.map(([key, loc]) => (
                <option key={key} value={key}>
                  {loc.name} ({loc.quadrant} Quadrant)
                </option>
              ))}
            </select>
            {destinationLocation && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-trek-text/70">Quadrant:</span>
                  <Badge className="bg-trek-gold/20 text-trek-gold border-trek-gold">
                    {destinationLocation.quadrant}
                  </Badge>
                </div>
                {destinationLocation.sector && (
                  <div className="flex justify-between">
                    <span className="text-trek-text/70">Sector:</span>
                    <span className="text-trek-text">{destinationLocation.sector}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-trek-text/70">Coordinates:</span>
                  <span className="text-trek-text font-mono text-xs">
                    ({destinationLocation.coordinates.x.toFixed(2)}, {destinationLocation.coordinates.y.toFixed(2)}, {destinationLocation.coordinates.z.toFixed(2)}) pc
                  </span>
                </div>
                {destinationLocation.description && (
                  <p className="text-trek-text/60 italic text-xs pt-2 border-t border-trek-accent/30">
                    {destinationLocation.description}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Warp Factor Control */}
      <Card className="bg-trek-panel border-trek-accent">
        <CardHeader>
          <CardTitle className="text-lg text-trek-blue flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Warp Factor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="9.99"
              step="0.1"
              value={warpFactor}
              onChange={(e) => setWarpFactor(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-trek-dark rounded-lg appearance-none cursor-pointer accent-trek-blue"
            />
            <span className="text-2xl font-bold text-trek-gold min-w-[80px] text-right">
              {warpFactor.toFixed(2)}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[6.0, 7.0, 8.0, 9.0, 9.6, 9.9].map((warp) => (
              <Button
                key={warp}
                onClick={() => setWarpFactor(warp)}
                variant={warpFactor === warp ? 'default' : 'outline'}
                size="sm"
                className={
                  warpFactor === warp
                    ? 'bg-trek-blue text-black'
                    : 'border-trek-accent text-trek-text hover:bg-trek-accent/20'
                }
              >
                {warp}
              </Button>
            ))}
          </div>
          <div className="text-sm text-trek-text/70">
            <p>Standard cruising speed: <span className="text-trek-blue">Warp 6-7</span></p>
            <p>Maximum sustainable: <span className="text-trek-gold">Warp 9.2</span></p>
            <p>Maximum emergency: <span className="text-red-400">Warp 9.6-9.9</span></p>
          </div>
        </CardContent>
      </Card>

      {/* Route Information */}
      {route && (
        <Card className="bg-trek-panel border-trek-gold">
          <CardHeader>
            <CardTitle className="text-xl text-trek-gold flex items-center gap-2">
              <Rocket className="w-6 h-6" />
              Route Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-trek-dark p-4 rounded border border-trek-accent">
                <div className="text-trek-text/70 text-sm mb-1">Direct Distance</div>
                <div className="text-2xl font-bold text-trek-blue">
                  {formatDistance(route.directDistance)}
                </div>
                <div className="text-trek-text/50 text-xs mt-1">
                  {route.directDistance.toLocaleString()} ly
                </div>
              </div>

              <div className="bg-trek-dark p-4 rounded border border-trek-accent">
                <div className="text-trek-text/70 text-sm mb-1 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Travel Time
                </div>
                <div className="text-2xl font-bold text-trek-gold">
                  {route.travelTime.days > 0 ? `${route.travelTime.days}d ` : ''}
                  {route.travelTime.hours}h {route.travelTime.minutes}m
                </div>
                <div className="text-trek-text/50 text-xs mt-1">
                  At {formatWarpFactor(warpFactor)}
                </div>
              </div>

              <div className="bg-trek-dark p-4 rounded border border-trek-accent">
                <div className="text-trek-text/70 text-sm mb-1 flex items-center gap-1">
                  <Fuel className="w-4 h-4" />
                  Fuel Required
                </div>
                <div className="text-2xl font-bold text-trek-text">
                  {route.fuelRequired.toLocaleString()}
                </div>
                <div className="text-trek-text/50 text-xs mt-1">Dilithium crystals</div>
              </div>
            </div>

            {/* Route Hazards */}
            {route.hazards.length > 0 && (
              <div className="bg-yellow-900/20 border border-yellow-600/50 rounded p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <h4 className="text-yellow-500 font-semibold">Route Hazards</h4>
                </div>
                <ul className="space-y-1 text-sm text-trek-text">
                  {route.hazards.map((hazard, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-1">•</span>
                      <span>{hazard}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional Info */}
            <div className="border-t border-trek-accent/30 pt-4 space-y-2 text-sm text-trek-text/70">
              <p>
                <span className="font-semibold text-trek-text">Recommended:</span> Ensure all systems are
                operational before departure. Maintain dilithium crystal reserves at minimum 120% of
                calculated requirement.
              </p>
              {route.directDistance > 1000 && (
                <p className="text-yellow-500">
                  ⚠️ Long-range travel detected. Consider establishing intermediate waypoints for
                  refueling and system diagnostics.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Panel */}
      <Card className="bg-trek-panel border-trek-accent">
        <CardHeader>
          <CardTitle className="text-lg text-trek-text">About Warp Travel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-trek-text/70">
          <p>
            <strong className="text-trek-blue">Warp Drive Technology:</strong> Based on Star Trek: The Next Generation
            warp scale, where warp velocities follow the formula v = w^(10/3) × c for warp factors 1-9.
          </p>
          <p>
            <strong className="text-trek-gold">Distances:</strong> All calculations use real astronomical data
            where available. Coordinates are in parsecs (pc), with 1 parsec = 3.26 light-years.
          </p>
          <p>
            <strong className="text-trek-text">Fuel Consumption:</strong> Dilithium crystal requirements
            scale exponentially with warp factor. Higher speeds dramatically increase fuel consumption.
          </p>
          <div className="bg-trek-dark p-3 rounded border border-trek-accent/50 mt-4">
            <p className="text-xs font-mono text-trek-text">
              Example: Earth to Vulcan (16.5 ly) at Warp 9.6 = {calculateTravelRoute('SOL', 'VULCAN', 9.99, 9.6)?.travelTime.hours || 0} hours
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UniverseTravelCalculator;
