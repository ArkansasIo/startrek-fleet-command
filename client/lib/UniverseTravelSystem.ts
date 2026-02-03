/**
 * UNIVERSE TRAVEL SYSTEM
 * Real light-year distance calculations for interstellar travel
 * Based on Star Trek canon and realistic astronomical distances
 */

// ============================================================================
// CONSTANTS - Real Astronomical Data
// ============================================================================

/** Speed of light in km/s */
export const SPEED_OF_LIGHT = 299792.458;

/** One light-year in kilometers */
export const LIGHT_YEAR_KM = 9.461e12;

/** One parsec in light-years */
export const PARSEC_LY = 3.26156;

/** One astronomical unit (AU) in kilometers */
export const AU_KM = 1.496e8;

/** One AU in light-years */
export const AU_LY = AU_KM / LIGHT_YEAR_KM;

// ============================================================================
// WARP SPEED CALCULATIONS (Star Trek TNG Scale)
// ============================================================================

/**
 * Warp speed velocity calculations based on Star Trek: The Next Generation
 * Warp 1-9: v = w^(10/3) * c
 * Warp 9+: Exponential curve approaching infinity at Warp 10
 */
export const WARP_SPEED_MULTIPLIERS = {
  1: 1,           // 1x speed of light
  2: 10,          // 10x speed of light
  3: 39,          // 39x speed of light
  4: 102,         // 102x speed of light
  5: 214,         // 214x speed of light
  6: 392,         // 392x speed of light
  7: 656,         // 656x speed of light
  8: 1024,        // 1,024x speed of light
  9: 1516,        // 1,516x speed of light
  9.2: 1649,      // 1,649x speed of light
  9.6: 1909,      // 1,909x speed of light
  9.9: 3053,      // 3,053x speed of light
  9.99: 7912,     // 7,912x speed of light
  9.9999: 199516, // 199,516x speed of light (near infinite)
};

/**
 * Calculate precise warp speed velocity
 * @param warpFactor - Warp factor (1-10)
 * @returns Speed as multiple of light speed
 */
export function calculateWarpVelocity(warpFactor: number): number {
  if (warpFactor < 1) return warpFactor; // Sublight
  if (warpFactor >= 10) return Infinity; // Impossible speed

  // TNG warp scale formula
  if (warpFactor <= 9) {
    return Math.pow(warpFactor, 10 / 3);
  } else {
    // Exponential curve for warp 9-10
    const a = 0.00264;
    const b = 0.0175;
    const c = 0.0;
    return Math.pow(warpFactor - 9, 5) / (a + b * (warpFactor - 9) + c * Math.pow(warpFactor - 9, 2));
  }
}

/**
 * Calculate travel time at warp speed
 * @param distanceLightYears - Distance in light-years
 * @param warpFactor - Warp factor
 * @returns Travel time in days
 */
export function calculateWarpTravelTime(distanceLightYears: number, warpFactor: number): number {
  const velocity = calculateWarpVelocity(warpFactor);
  const travelTimeYears = distanceLightYears / velocity;
  return travelTimeYears * 365.25; // Convert to days
}

/**
 * Calculate optimal warp factor for target travel time
 * @param distanceLightYears - Distance to travel
 * @param targetDays - Desired travel time in days
 * @returns Required warp factor
 */
export function calculateRequiredWarpFactor(distanceLightYears: number, targetDays: number): number {
  const targetYears = targetDays / 365.25;
  const requiredVelocity = distanceLightYears / targetYears;
  
  // Binary search for warp factor
  let low = 1;
  let high = 9.99;
  let iterations = 0;
  const maxIterations = 50;
  
  while (iterations < maxIterations && (high - low) > 0.01) {
    const mid = (low + high) / 2;
    const velocity = calculateWarpVelocity(mid);
    
    if (velocity < requiredVelocity) {
      low = mid;
    } else {
      high = mid;
    }
    iterations++;
  }
  
  return (low + high) / 2;
}

// ============================================================================
// IMPULSE SPEED (Sublight Travel)
// ============================================================================

/**
 * Standard impulse speeds as fractions of light speed
 */
export const IMPULSE_SPEEDS = {
  "quarter": 0.25,     // Quarter impulse
  "half": 0.50,        // Half impulse
  "three-quarter": 0.75, // Three-quarter impulse
  "full": 0.90,        // Full impulse (90% c to avoid relativistic issues)
  "emergency": 0.99,   // Emergency impulse
};

/**
 * Calculate impulse travel time
 * @param distanceAU - Distance in astronomical units
 * @param impulseSpeed - Impulse speed (fraction of light speed)
 * @returns Travel time in hours
 */
export function calculateImpulseTravelTime(distanceAU: number, impulseSpeed: number): number {
  const distanceLY = distanceAU * AU_LY;
  const travelTimeYears = distanceLY / impulseSpeed;
  return travelTimeYears * 365.25 * 24; // Convert to hours
}

// ============================================================================
// 3D DISTANCE CALCULATIONS
// ============================================================================

export interface Coordinates3D {
  x: number;
  y: number;
  z: number;
}

/**
 * Calculate Euclidean distance between two 3D points
 * @param from - Starting coordinates
 * @param to - Destination coordinates
 * @returns Distance in same units as input
 */
export function calculateDistance3D(from: Coordinates3D, to: Coordinates3D): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dz = to.z - from.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calculate distance in parsecs (for galactic scale)
 * @param from - Starting coordinates in parsecs
 * @param to - Destination coordinates in parsecs
 * @returns Distance in parsecs
 */
export function calculateDistanceParsecs(from: Coordinates3D, to: Coordinates3D): number {
  return calculateDistance3D(from, to);
}

/**
 * Calculate distance in light-years from parsec coordinates
 * @param from - Starting coordinates in parsecs
 * @param to - Destination coordinates in parsecs
 * @returns Distance in light-years
 */
export function calculateDistanceLightYears(from: Coordinates3D, to: Coordinates3D): number {
  const parsecs = calculateDistanceParsecs(from, to);
  return parsecs * PARSEC_LY;
}

// ============================================================================
// REAL STAR TREK UNIVERSE LOCATIONS
// ============================================================================

export interface KnownLocation {
  name: string;
  coordinates: Coordinates3D; // In parsecs from Sol
  distanceFromEarth: number; // Light-years
  quadrant: "Alpha" | "Beta" | "Gamma" | "Delta";
  sector?: string;
  description?: string;
}

/**
 * Known locations in the Star Trek universe with real astronomical data
 */
export const KNOWN_LOCATIONS: Record<string, KnownLocation> = {
  // Alpha Quadrant - Core Federation Territory
  SOL: {
    name: "Sol System (Earth)",
    coordinates: { x: 0, y: 0, z: 0 },
    distanceFromEarth: 0,
    quadrant: "Alpha",
    sector: "001",
    description: "United Federation of Planets capital",
  },
  PROXIMA_CENTAURI: {
    name: "Proxima Centauri",
    coordinates: { x: 1.30, y: 0, z: 0 },
    distanceFromEarth: 4.24,
    quadrant: "Alpha",
    sector: "001",
    description: "Closest star to Sol",
  },
  ALPHA_CENTAURI: {
    name: "Alpha Centauri (Rigil Kentaurus)",
    coordinates: { x: 1.34, y: 0, z: 0 },
    distanceFromEarth: 4.37,
    quadrant: "Alpha",
    sector: "001",
    description: "Binary star system, nearest stellar neighbor",
  },
  WOLF_359: {
    name: "Wolf 359",
    coordinates: { x: 2.41, y: 0, z: 0 },
    distanceFromEarth: 7.86,
    quadrant: "Alpha",
    sector: "023",
    description: "Site of historic battle with the Borg",
  },
  SIRIUS: {
    name: "Sirius",
    coordinates: { x: 2.64, y: 0, z: 0 },
    distanceFromEarth: 8.6,
    quadrant: "Alpha",
    sector: "001",
    description: "Brightest star in Earth's sky",
  },
  VULCAN: {
    name: "40 Eridani (Vulcan)",
    coordinates: { x: 5.06, y: 0, z: 0 },
    distanceFromEarth: 16.5,
    quadrant: "Alpha",
    sector: "005",
    description: "Homeworld of the Vulcan people",
  },
  ANDORIA: {
    name: "Procyon (Andoria)",
    coordinates: { x: 3.5, y: 0, z: 0 },
    distanceFromEarth: 11.46,
    quadrant: "Alpha",
    sector: "003",
    description: "Homeworld of the Andorians",
  },
  TELLAR: {
    name: "61 Cygni (Tellar Prime)",
    coordinates: { x: 3.5, y: 0, z: 0 },
    distanceFromEarth: 11.4,
    quadrant: "Alpha",
    sector: "004",
    description: "Homeworld of the Tellarites",
  },
  RIGEL: {
    name: "Rigel",
    coordinates: { x: 264, y: 0, z: 0 },
    distanceFromEarth: 860,
    quadrant: "Alpha",
    sector: "042",
    description: "Major trade hub and dilithium source",
  },
  
  // Beta Quadrant - Klingon/Romulan Territory
  QONOS: {
    name: "Qo'noS (Klingon Homeworld)",
    coordinates: { x: 30, y: 15, z: 5 },
    distanceFromEarth: 100,
    quadrant: "Beta",
    sector: "070",
    description: "Capital of the Klingon Empire",
  },
  ROMULUS: {
    name: "Romulus",
    coordinates: { x: 50, y: 25, z: 10 },
    distanceFromEarth: 170,
    quadrant: "Beta",
    sector: "080",
    description: "Capital of the Romulan Star Empire (destroyed 2387)",
  },
  
  // Deep Space Locations
  DEEP_SPACE_NINE: {
    name: "Deep Space Nine",
    coordinates: { x: 75, y: 30, z: 15 },
    distanceFromEarth: 245.7,
    quadrant: "Alpha",
    sector: "127",
    description: "Space station near Bajoran wormhole",
  },
  BAJOR: {
    name: "Bajor",
    coordinates: { x: 75, y: 30, z: 15 },
    distanceFromEarth: 245,
    quadrant: "Alpha",
    sector: "127",
    description: "Homeworld near the Bajoran wormhole",
  },
  
  // Gamma Quadrant - Through Wormhole
  GAMMA_QUADRANT_ENTRY: {
    name: "Gamma Quadrant (via Wormhole)",
    coordinates: { x: 0, y: 0, z: 0 }, // Effective distance via wormhole
    distanceFromEarth: 70000, // Actual distance, but instant via wormhole
    quadrant: "Gamma",
    sector: "Unknown",
    description: "Dominion territory, accessible via Bajoran wormhole",
  },
  
  // Delta Quadrant - Voyager Territory
  DELTA_QUADRANT_STATION: {
    name: "Delta Quadrant - Deep Space Horizon",
    coordinates: { x: -23912, y: 0, z: 0 },
    distanceFromEarth: 78000,
    quadrant: "Delta",
    sector: "Unknown",
    description: "Federation outpost, USS Horizon mission area",
  },
  BORG_SPACE: {
    name: "Borg Space (Delta Quadrant)",
    coordinates: { x: -20000, y: 5000, z: 1000 },
    distanceFromEarth: 68000,
    quadrant: "Delta",
    sector: "Unknown",
    description: "Borg Collective territory",
  },
};

// ============================================================================
// TRAVEL ROUTE CALCULATION
// ============================================================================

export interface TravelRoute {
  origin: string;
  destination: string;
  directDistance: number; // Light-years
  recommendedWarp: number;
  travelTime: {
    days: number;
    hours: number;
    minutes: number;
  };
  fuelRequired: number; // Dilithium crystals
  hazards: string[];
  waypoints?: KnownLocation[];
}

/**
 * Calculate travel route between two known locations
 */
export function calculateTravelRoute(
  originKey: string,
  destinationKey: string,
  shipMaxWarp: number = 9.6,
  preferredWarp?: number
): TravelRoute | null {
  const origin = KNOWN_LOCATIONS[originKey];
  const destination = KNOWN_LOCATIONS[destinationKey];
  
  if (!origin || !destination) return null;
  
  const distance = calculateDistanceLightYears(origin.coordinates, destination.coordinates);
  const warpFactor = preferredWarp || Math.min(shipMaxWarp, 9.6);
  const travelTimeDays = calculateWarpTravelTime(distance, warpFactor);
  
  const hours = (travelTimeDays % 1) * 24;
  const minutes = (hours % 1) * 60;
  
  // Calculate fuel (rough estimate: 1 crystal per 100 ly at warp 9)
  const fuelMultiplier = calculateWarpVelocity(warpFactor) / calculateWarpVelocity(9);
  const baseFuel = distance / 100;
  const fuelRequired = Math.ceil(baseFuel * fuelMultiplier);
  
  return {
    origin: origin.name,
    destination: destination.name,
    directDistance: distance,
    recommendedWarp: warpFactor,
    travelTime: {
      days: Math.floor(travelTimeDays),
      hours: Math.floor(hours),
      minutes: Math.floor(minutes),
    },
    fuelRequired,
    hazards: generateRouteHazards(origin, destination),
  };
}

/**
 * Generate potential hazards for a route
 */
function generateRouteHazards(origin: KnownLocation, destination: KnownLocation): string[] {
  const hazards: string[] = [];
  const distance = calculateDistanceLightYears(origin.coordinates, destination.coordinates);
  
  if (distance > 500) {
    hazards.push("Long-range navigation challenges");
  }
  if (distance > 1000) {
    hazards.push("Deep space phenomena");
  }
  if (destination.quadrant === "Beta" && origin.quadrant === "Alpha") {
    hazards.push("Neutral Zone crossing");
  }
  if (destination.quadrant === "Gamma") {
    hazards.push("Dominion patrols");
  }
  if (destination.quadrant === "Delta") {
    hazards.push("Unknown space", "Kazon raiders", "Borg territory");
  }
  
  return hazards;
}

// ============================================================================
// SECTOR GRID SYSTEM
// ============================================================================

export interface SectorCoordinates {
  sector: number;
  x: number;
  y: number;
  z: number;
  parsecs: Coordinates3D;
}

/**
 * Convert sector coordinates to parsec coordinates
 * Each sector is approximately 20 light-years (6.13 parsecs) on a side
 */
export function sectorToLightYears(sectorCoords: SectorCoordinates): Coordinates3D {
  const SECTOR_SIZE_LY = 20;
  return {
    x: sectorCoords.x * SECTOR_SIZE_LY,
    y: sectorCoords.y * SECTOR_SIZE_LY,
    z: sectorCoords.z * SECTOR_SIZE_LY,
  };
}

/**
 * Convert light-year coordinates to sector coordinates
 */
export function lightYearsToSector(coords: Coordinates3D): SectorCoordinates {
  const SECTOR_SIZE_LY = 20;
  return {
    sector: Math.floor(Math.sqrt(coords.x * coords.x + coords.y * coords.y + coords.z * coords.z) / SECTOR_SIZE_LY),
    x: Math.floor(coords.x / SECTOR_SIZE_LY),
    y: Math.floor(coords.y / SECTOR_SIZE_LY),
    z: Math.floor(coords.z / SECTOR_SIZE_LY),
    parsecs: {
      x: coords.x / PARSEC_LY,
      y: coords.y / PARSEC_LY,
      z: coords.z / PARSEC_LY,
    },
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format distance for display
 */
export function formatDistance(lightYears: number): string {
  if (lightYears < 0.001) {
    const au = lightYears / AU_LY;
    return `${au.toFixed(2)} AU`;
  } else if (lightYears < 1) {
    return `${lightYears.toFixed(3)} light-years`;
  } else if (lightYears < 1000) {
    return `${lightYears.toFixed(1)} light-years`;
  } else {
    return `${(lightYears / 1000).toFixed(1)}k light-years`;
  }
}

/**
 * Format travel time for display
 */
export function formatTravelTime(days: number): string {
  if (days < 1) {
    const hours = days * 24;
    if (hours < 1) {
      const minutes = hours * 60;
      return `${Math.round(minutes)} minutes`;
    }
    return `${hours.toFixed(1)} hours`;
  } else if (days < 30) {
    return `${days.toFixed(1)} days`;
  } else if (days < 365) {
    return `${(days / 30).toFixed(1)} months`;
  } else {
    return `${(days / 365).toFixed(1)} years`;
  }
}

/**
 * Format warp factor for display
 */
export function formatWarpFactor(warpFactor: number): string {
  if (warpFactor < 1) {
    return `Impulse (${(warpFactor * 100).toFixed(0)}% c)`;
  } else if (warpFactor >= 10) {
    return "Warp 10 (Impossible)";
  } else {
    return `Warp ${warpFactor.toFixed(2)}`;
  }
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/**
 * Calculate example routes
 */
export function getExampleRoutes(): TravelRoute[] {
  const routes: TravelRoute[] = [];
  
  // Local space routes
  const earthToVulcan = calculateTravelRoute("SOL", "VULCAN", 9.6);
  if (earthToVulcan) routes.push(earthToVulcan);
  
  const earthToQonos = calculateTravelRoute("SOL", "QONOS", 9.6);
  if (earthToQonos) routes.push(earthToQonos);
  
  const earthToDS9 = calculateTravelRoute("SOL", "DEEP_SPACE_NINE", 9.6);
  if (earthToDS9) routes.push(earthToDS9);
  
  // Long range route
  const earthToDelta = calculateTravelRoute("SOL", "DELTA_QUADRANT_STATION", 9.975);
  if (earthToDelta) routes.push(earthToDelta);
  
  return routes;
}

export default {
  calculateWarpVelocity,
  calculateWarpTravelTime,
  calculateRequiredWarpFactor,
  calculateDistance3D,
  calculateDistanceLightYears,
  calculateTravelRoute,
  KNOWN_LOCATIONS,
  formatDistance,
  formatTravelTime,
  formatWarpFactor,
};
