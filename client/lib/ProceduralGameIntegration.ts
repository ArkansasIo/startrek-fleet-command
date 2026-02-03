// ProceduralGameIntegration.ts
// Integration layer between procedural systems and existing game logic
// Connects No Man's Sky-style generation with Star Trek game mechanics

import ProceduralUniverse, { 
  UniverseConfig, 
  GalaxyInfo, 
  StarSystemInfo, 
  PlanetInfo 
} from './ProceduralUniverse';
import ProceduralPlanetGenerator, { PlanetSurface, POI } from './ProceduralPlanetGenerator';
import ProceduralEconomy, { TradingStation, TradeRoute, ResourceNode } from './ProceduralEconomy';
import ProceduralDiscoverySystem, { 
  Discovery, 
  SpaceAnomaly, 
  RandomEncounter 
} from './ProceduralDiscoverySystem';
import { SeededRandom } from './SeedGenerator';
import type { Player } from './MMORPGGameEngine';

export interface ProceduralGameState {
  universeSeed: string;
  currentGalaxy: number;
  currentSystem: StarSystemInfo | null;
  currentPlanet: PlanetInfo | null;
  visitedSystems: Set<string>;
  visitedPlanets: Set<string>;
  discoveredAnomalies: Set<string>;
  discoveries: Discovery[];
  tradingStations: Map<string, TradingStation>;
  knownTradeRoutes: TradeRoute[];
}

export interface ExplorationResult {
  type: 'discovery' | 'resource' | 'encounter' | 'anomaly' | 'nothing';
  data: any;
  rewards?: {
    credits?: number;
    resources?: Record<string, number>;
    reputation?: number;
    experience?: number;
  };
}

export class ProceduralGameIntegration {
  private universe: ProceduralUniverse;
  private economy: ProceduralEconomy;
  private discoverySystem: ProceduralDiscoverySystem;
  private gameState: ProceduralGameState;

  constructor(config?: Partial<UniverseConfig>) {
    const seed = config?.seed || `StarTrek-${Date.now()}`;
    
    this.universe = new ProceduralUniverse(config);
    this.economy = new ProceduralEconomy(seed);
    this.discoverySystem = new ProceduralDiscoverySystem(seed);
    
    this.gameState = {
      universeSeed: seed.toString(),
      currentGalaxy: 0,
      currentSystem: null,
      currentPlanet: null,
      visitedSystems: new Set(),
      visitedPlanets: new Set(),
      discoveredAnomalies: new Set(),
      discoveries: [],
      tradingStations: new Map(),
      knownTradeRoutes: []
    };
  }

  /**
   * Initialize player in procedural universe
   */
  initializePlayer(player: Player, startingGalaxy: number = 0): void {
    this.gameState.currentGalaxy = startingGalaxy;
    
    // Generate starting system
    const startSystem = this.universe.generateStarSystem(
      `galaxy-${startingGalaxy}`,
      0, 0, 0
    );
    
    this.setCurrentSystem(startSystem);
    
    // Generate starting planet
    if (startSystem.planetCount > 0) {
      const startPlanet = this.universe.generatePlanet(startSystem, 0);
      this.setCurrentPlanet(startPlanet);
    }
    
    // Give player starting coordinates
    if (!player.position) {
      player.position = { x: 0, y: 0, z: 0 };
    }
  }

  /**
   * Navigate to a star system
   */
  navigateToSystem(x: number, y: number, z: number = 0, player: Player): StarSystemInfo {
    const galaxyId = `galaxy-${this.gameState.currentGalaxy}`;
    const system = this.universe.generateStarSystem(galaxyId, x, y, z);
    
    this.setCurrentSystem(system);
    
    // Update player position
    player.position = { x, y, z };
    
    // Check for encounters
    if (!this.gameState.visitedSystems.has(system.id)) {
      this.gameState.visitedSystems.add(system.id);
      
      // Generate trading station if not already exists
      if (!this.gameState.tradingStations.has(system.id)) {
        const station = this.economy.generateTradingStation(system);
        this.gameState.tradingStations.set(system.id, station);
      }
      
      // Generate anomalies
      const anomalies = this.discoverySystem.generateAnomalies(system);
      anomalies.forEach(a => this.gameState.discoveredAnomalies.add(a.id));
    }
    
    return system;
  }

  /**
   * Navigate to a planet
   */
  navigateToPlanet(planetIndex: number, player: Player): PlanetInfo | null {
    if (!this.gameState.currentSystem) return null;
    
    if (planetIndex < 0 || planetIndex >= this.gameState.currentSystem.planetCount) {
      return null;
    }
    
    const planet = this.universe.generatePlanet(this.gameState.currentSystem, planetIndex);
    this.setCurrentPlanet(planet);
    
    if (!this.gameState.visitedPlanets.has(planet.id)) {
      this.gameState.visitedPlanets.add(planet.id);
      
      // Record discovery
      const discovery = this.discoverySystem.recordDiscovery({
        type: 'planet',
        name: planet.name,
        discoveredBy: player.id,
        location: { planetId: planet.id, systemId: planet.systemId },
        scientificValue: planet.habitability,
        credits: Math.floor(planet.habitability * 10),
        description: `${planet.type} planet with ${planet.atmosphere} atmosphere`
      });
      
      this.gameState.discoveries.push(discovery);
    }
    
    return planet;
  }

  /**
   * Explore current planet
   */
  explorePlanet(player: Player, scannerPower: number = 50): ExplorationResult {
    if (!this.gameState.currentPlanet) {
      return { type: 'nothing', data: null };
    }
    
    const rng = new SeededRandom(Date.now());
    const roll = rng.nextInt(1, 100);
    
    // Discovery chance
    if (roll < 15) {
      return this.handleDiscovery(player);
    }
    
    // Resource finding
    if (roll < 40) {
      return this.handleResourceFind(player);
    }
    
    // Random encounter
    if (roll < 55) {
      return this.handleEncounter(player);
    }
    
    // Anomaly detection
    if (roll < 65 && this.gameState.currentPlanet.anomalies.length > 0) {
      return this.handleAnomalyEncounter(player);
    }
    
    // Nothing found
    return {
      type: 'nothing',
      data: { message: 'Scan complete. Nothing unusual detected.' }
    };
  }

  /**
   * Handle discovery
   */
  private handleDiscovery(player: Player): ExplorationResult {
    const planet = this.gameState.currentPlanet!;
    const rng = new SeededRandom(Date.now());
    
    let discoveryType: Discovery['type'] = 'mineral';
    let scientificValue = 0;
    let credits = 0;
    let description = '';
    
    // Check for fauna
    if (planet.fauna.length > 0 && rng.nextBool(0.4)) {
      const species = rng.pick(planet.fauna);
      discoveryType = 'species';
      scientificValue = species.rarity === 'legendary' ? 100 : 
                        species.rarity === 'rare' ? 75 : 50;
      credits = scientificValue * 10;
      description = `New species discovered: ${species.name}`;
    }
    // Check for flora
    else if (planet.flora.length > 0 && rng.nextBool(0.4)) {
      const plant = rng.pick(planet.flora);
      scientificValue = 40;
      credits = 300;
      description = `New plant species: ${plant.name}`;
    }
    // Check for artifacts
    else if (rng.nextBool(0.1)) {
      const artifact = this.discoverySystem.generateArtifact(planet);
      if (artifact) {
        discoveryType = 'artifact';
        scientificValue = artifact.power;
        credits = artifact.power * 100;
        description = `Ancient artifact discovered: ${artifact.name}`;
        
        return {
          type: 'discovery',
          data: { artifact, description },
          rewards: { credits, reputation: 20, experience: 100 }
        };
      }
    }
    
    // Record discovery
    const discovery = this.discoverySystem.recordDiscovery({
      type: discoveryType,
      name: description,
      discoveredBy: player.id,
      location: { planetId: planet.id, systemId: planet.systemId },
      scientificValue,
      credits,
      description
    });
    
    this.gameState.discoveries.push(discovery);
    
    return {
      type: 'discovery',
      data: discovery,
      rewards: { credits, reputation: 10, experience: 50 }
    };
  }

  /**
   * Handle resource finding
   */
  private handleResourceFind(player: Player): ExplorationResult {
    const planet = this.gameState.currentPlanet!;
    const rng = new SeededRandom(Date.now());
    
    if (planet.resources.length === 0) {
      return { type: 'nothing', data: null };
    }
    
    const deposit = rng.pick(planet.resources);
    
    const abundanceMultipliers = {
      'trace': 10,
      'common': 25,
      'abundant': 50,
      'rich': 100,
      'ultra-rich': 200
    };
    
    const amount = Math.floor(
      (deposit.quality / 100) * abundanceMultipliers[deposit.abundance]
    );
    
    return {
      type: 'resource',
      data: {
        resource: deposit.type,
        amount,
        quality: deposit.quality,
        location: deposit.location
      },
      rewards: {
        resources: { [deposit.type]: amount }
      }
    };
  }

  /**
   * Handle encounter
   */
  private handleEncounter(player: Player): ExplorationResult {
    const system = this.gameState.currentSystem!;
    const encounter = this.discoverySystem.generateRandomEncounter({
      systemId: system.id,
      dangerLevel: system.dangerLevel
    });
    
    return {
      type: 'encounter',
      data: encounter
    };
  }

  /**
   * Handle anomaly encounter
   */
  private handleAnomalyEncounter(player: Player): ExplorationResult {
    const planet = this.gameState.currentPlanet!;
    const rng = new SeededRandom(Date.now());
    const anomaly = rng.pick(planet.anomalies);
    
    return {
      type: 'anomaly',
      data: {
        anomaly,
        description: `Unusual ${anomaly.type} readings detected`,
        dangerLevel: anomaly.dangerLevel
      },
      rewards: {
        experience: anomaly.dangerLevel * 10,
        credits: anomaly.dangerLevel * 50
      }
    };
  }

  /**
   * Generate planet surface for landing
   */
  generatePlanetSurface(resolution: number = 64): PlanetSurface | null {
    if (!this.gameState.currentPlanet) return null;
    
    const generator = new ProceduralPlanetGenerator(this.gameState.currentPlanet);
    return generator.generateSurface(resolution);
  }

  /**
   * Scan for nearby objects
   */
  performSpaceScan(player: Player, scanRange: number = 1000, scanPower: number = 50): any[] {
    const results = this.discoverySystem.performScan(scanRange, scanPower);
    return results;
  }

  /**
   * Get trading station in current system
   */
  getTradingStation(): TradingStation | null {
    if (!this.gameState.currentSystem) return null;
    
    let station = this.gameState.tradingStations.get(this.gameState.currentSystem.id);
    
    if (!station) {
      station = this.economy.generateTradingStation(this.gameState.currentSystem);
      this.gameState.tradingStations.set(this.gameState.currentSystem.id, station);
    }
    
    return station;
  }

  /**
   * Find profitable trade routes from current system
   */
  findTradeRoutes(): TradeRoute[] {
    const stations = Array.from(this.gameState.tradingStations.values());
    
    if (stations.length < 2) return [];
    
    const routes = this.economy.findTradeRoutes(stations);
    this.gameState.knownTradeRoutes = routes;
    
    return routes;
  }

  /**
   * Generate resource nodes in current system
   */
  generateSystemResources(): ResourceNode[] {
    if (!this.gameState.currentSystem) return [];
    
    return this.economy.generateResourceNodes(this.gameState.currentSystem);
  }

  /**
   * Get game state
   */
  getGameState(): ProceduralGameState {
    return { ...this.gameState };
  }

  /**
   * Get universe info
   */
  getUniverseInfo() {
    return {
      seed: this.gameState.universeSeed,
      config: this.universe.getConfig(),
      visitedSystems: this.gameState.visitedSystems.size,
      visitedPlanets: this.gameState.visitedPlanets.size,
      discoveries: this.gameState.discoveries.length
    };
  }

  /**
   * Get current location summary
   */
  getCurrentLocationSummary(): any {
    return {
      galaxy: this.gameState.currentGalaxy,
      system: this.gameState.currentSystem,
      planet: this.gameState.currentPlanet,
      station: this.gameState.currentSystem ? 
        this.gameState.tradingStations.get(this.gameState.currentSystem.id) : null
    };
  }

  /**
   * Set current system
   */
  private setCurrentSystem(system: StarSystemInfo): void {
    this.gameState.currentSystem = system;
    this.gameState.currentPlanet = null;
  }

  /**
   * Set current planet
   */
  private setCurrentPlanet(planet: PlanetInfo): void {
    this.gameState.currentPlanet = planet;
  }

  /**
   * Export save data
   */
  exportSaveData(): string {
    return JSON.stringify({
      universeSeed: this.gameState.universeSeed,
      currentGalaxy: this.gameState.currentGalaxy,
      visitedSystems: Array.from(this.gameState.visitedSystems),
      visitedPlanets: Array.from(this.gameState.visitedPlanets),
      discoveredAnomalies: Array.from(this.gameState.discoveredAnomalies),
      discoveries: this.gameState.discoveries,
      knownTradeRoutes: this.gameState.knownTradeRoutes
    });
  }

  /**
   * Import save data
   */
  importSaveData(saveData: string): void {
    const data = JSON.parse(saveData);
    this.gameState.universeSeed = data.universeSeed;
    this.gameState.currentGalaxy = data.currentGalaxy;
    this.gameState.visitedSystems = new Set(data.visitedSystems);
    this.gameState.visitedPlanets = new Set(data.visitedPlanets);
    this.gameState.discoveredAnomalies = new Set(data.discoveredAnomalies);
    this.gameState.discoveries = data.discoveries;
    this.gameState.knownTradeRoutes = data.knownTradeRoutes;
  }
}

export default ProceduralGameIntegration;
