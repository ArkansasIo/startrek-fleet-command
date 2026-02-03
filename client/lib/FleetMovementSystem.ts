// FleetMovementSystem.ts
// Handles fleet movement, patrol routes, and positioning

export interface Fleet {
  id: string;
  playerId: string;
  name: string;
  ships: ShipInstance[];
  location: LocationCoordinates;
  destination?: LocationCoordinates;
  status: 'idle' | 'moving' | 'attacking' | 'defending' | 'patrolling' | 'engaged';
  speed: number; // Average fleet speed
  arrivalTime?: number;
  commandShipId?: string; // The flagship
  morale: number; // 0-100
  fuel: number;
  maxFuel: number;
}

export interface ShipInstance {
  id: string;
  shipType: string;
  name: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  crew: number;
  maxCrew: number;
}

export interface LocationCoordinates {
  type: 'system' | 'planet' | 'station' | 'space';
  id: string;
  x: number;
  y: number;
  z: number;
}

export interface PatrolRoute {
  id: string;
  fleetId: string;
  playerId: string;
  waypoints: LocationCoordinates[];
  currentWaypoint: number;
  status: 'active' | 'paused' | 'completed';
  loopRoute: boolean; // Return to start
  createdAt: number;
}

export interface FuelConsumption {
  baseRate: number;
  speedMultiplier: number; // Increases with speed
  distanceMultiplier: number;
}

// Create new fleet
export function createFleet(
  playerId: string,
  name: string,
  location: LocationCoordinates
): Fleet {
  return {
    id: `fleet_${playerId}_${Date.now()}`,
    playerId,
    name,
    ships: [],
    location,
    status: 'idle',
    speed: 0,
    morale: 75,
    fuel: 1000,
    maxFuel: 1000,
  };
}

// Add ship to fleet
export function addShipToFleet(
  fleet: Fleet,
  ship: ShipInstance
): { success: boolean; message: string } {
  if (fleet.ships.length >= 100) {
    return { success: false, message: 'Fleet is at maximum capacity' };
  }

  fleet.ships.push(ship);

  // Update fleet stats
  fleet.speed = calculateFleetSpeed(fleet.ships);

  return { success: true, message: `${ship.name} added to fleet` };
}

// Calculate fleet speed (slowest ship determines speed)
export function calculateFleetSpeed(ships: ShipInstance[]): number {
  if (ships.length === 0) return 0;
  return Math.min(...ships.map((s) => s.speed));
}

// Calculate fleet attack power
export function calculateFleetAttack(ships: ShipInstance[]): number {
  return ships.reduce((sum, ship) => sum + ship.attack, 0);
}

// Calculate fleet defense power
export function calculateFleetDefense(ships: ShipInstance[]): number {
  return ships.reduce((sum, ship) => sum + ship.defense, 0);
}

// Order fleet movement
export function orderFleetMovement(
  fleet: Fleet,
  destination: LocationCoordinates
): { success: boolean; eta?: number; message: string } {
  if (fleet.fuel <= 0) {
    return { success: false, message: 'Fleet out of fuel' };
  }

  if (fleet.status === 'engaged') {
    return { success: false, message: 'Cannot move while engaged in combat' };
  }

  const distance = calculateDistance(fleet.location, destination);
  const travelTime = calculateTravelTime(distance, fleet.speed);

  return {
    success: true,
    eta: Date.now() + travelTime,
    message: `Fleet moving to destination. ETA: ${travelTime / 1000}s`,
  };
}

// Calculate distance between two locations
export function calculateDistance(
  from: LocationCoordinates,
  to: LocationCoordinates
): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dz = to.z - from.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Calculate travel time
export function calculateTravelTime(distance: number, speed: number): number {
  if (speed <= 0) return Infinity;
  return (distance / speed) * 1000; // Convert to milliseconds
}

// Consume fuel
export function consumeFuel(fleet: Fleet, distance: number): number {
  const consumption = calculateFuelConsumption(fleet, distance);
  fleet.fuel = Math.max(0, fleet.fuel - consumption);
  return consumption;
}

// Calculate fuel consumption
export function calculateFuelConsumption(fleet: Fleet, distance: number): number {
  const baseConsumption = 1; // Units per distance
  const shipFactor = fleet.ships.length * 0.1; // Each ship adds to consumption
  const speedFactor = (fleet.speed / 10) * 0.5; // Faster = more fuel
  const totalConsumption = baseConsumption + shipFactor + speedFactor;
  return Math.ceil(distance * totalConsumption);
}

// Refuel fleet
export function refuelFleet(fleet: Fleet, amount: number): number {
  const refueled = Math.min(amount, fleet.maxFuel - fleet.fuel);
  fleet.fuel += refueled;
  return refueled;
}

// Create patrol route
export function createPatrolRoute(
  fleetId: string,
  playerId: string,
  waypoints: LocationCoordinates[]
): PatrolRoute {
  return {
    id: `patrol_${fleetId}_${Date.now()}`,
    fleetId,
    playerId,
    waypoints,
    currentWaypoint: 0,
    status: 'active',
    loopRoute: true,
    createdAt: Date.now(),
  };
}

// Update patrol route
export function updatePatrolWaypoint(route: PatrolRoute): LocationCoordinates | null {
  if (route.status !== 'active') return null;

  route.currentWaypoint++;

  if (route.currentWaypoint >= route.waypoints.length) {
    if (route.loopRoute) {
      route.currentWaypoint = 0;
    } else {
      route.status = 'completed';
      return null;
    }
  }

  return route.waypoints[route.currentWaypoint];
}

// Calculate fleet maintenance cost per turn
export function calculateFleetMaintenanceCost(fleet: Fleet): Record<string, number> {
  const cost: Record<string, number> = {
    credits: fleet.ships.length * 10,
    dilithium: fleet.ships.length * 2,
  };

  // Morale below 50 increases cost
  if (fleet.morale < 50) {
    cost.credits *= 1.5;
  }

  return cost;
}

// Update fleet morale
export function updateFleetMorale(fleet: Fleet, change: number): number {
  fleet.morale = Math.max(0, Math.min(100, fleet.morale + change));
  return fleet.morale;
}

// Merge fleets
export function mergeFleets(fleet1: Fleet, fleet2: Fleet): Fleet {
  return {
    ...fleet1,
    ships: [...fleet1.ships, ...fleet2.ships],
    fuel: Math.min(fleet1.maxFuel, fleet1.fuel + fleet2.fuel),
    morale: (fleet1.morale + fleet2.morale) / 2,
    speed: calculateFleetSpeed([...fleet1.ships, ...fleet2.ships]),
  };
}

// Split fleet
export function splitFleet(
  fleet: Fleet,
  shipIds: string[]
): { success: boolean; newFleet?: Fleet; message: string } {
  const shipsToMove = fleet.ships.filter((s) => shipIds.includes(s.id));

  if (shipsToMove.length === 0) {
    return { success: false, message: 'No valid ships selected' };
  }

  if (shipsToMove.length === fleet.ships.length) {
    return { success: false, message: 'Cannot move all ships from fleet' };
  }

  const newFleet = createFleet(fleet.playerId, `${fleet.name} Split`, fleet.location);
  newFleet.ships = shipsToMove;
  newFleet.fuel = Math.floor((newFleet.ships.length / fleet.ships.length) * fleet.fuel);
  newFleet.speed = calculateFleetSpeed(shipsToMove);

  // Remove ships from original fleet
  fleet.ships = fleet.ships.filter((s) => !shipIds.includes(s.id));
  fleet.speed = calculateFleetSpeed(fleet.ships);

  return { success: true, newFleet, message: 'Fleet split successfully' };
}
