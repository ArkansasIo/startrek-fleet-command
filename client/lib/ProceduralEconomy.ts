// ProceduralEconomy.ts
// Dynamic economy and trading system with procedurally generated markets
// Inspired by No Man's Sky's economic systems

import { SeededRandom } from './SeedGenerator';
import type { StarSystemInfo } from './ProceduralUniverse';

export interface EconomyType {
  id: string;
  name: string;
  primaryExport: string[];
  primaryImport: string[];
  techLevel: number;
  wealth: 'poor' | 'moderate' | 'wealthy' | 'opulent';
  stability: number; // 0-100
}

export interface MarketItem {
  id: string;
  name: string;
  category: 'resource' | 'technology' | 'trade-good' | 'ship-component' | 'consumable';
  baseValue: number;
  currentPrice: number;
  supply: number;
  demand: number;
  priceVolatility: number;
  description: string;
}

export interface TradingStation {
  id: string;
  systemId: string;
  name: string;
  faction: string;
  economy: EconomyType;
  inventory: MarketItem[];
  buyMultiplier: number; // What station pays for goods
  sellMultiplier: number; // What station charges for goods
  reputation: number; // 0-100
}

export interface TradeRoute {
  id: string;
  fromStation: string;
  toStation: string;
  profitableGoods: string[];
  distance: number;
  profitMargin: number;
  riskLevel: number;
}

export interface ResourceNode {
  id: string;
  type: string;
  quality: 'poor' | 'standard' | 'high' | 'exceptional' | 'perfect';
  quantity: number;
  renewalRate: number; // units per hour
  location: {
    systemId: string;
    planetId?: string;
    coordinates?: { x: number; y: number; z: number };
  };
}

export class ProceduralEconomy {
  private rng: SeededRandom;
  private economyTypes: EconomyType[];
  private resourceTypes: string[];
  private technologyTypes: string[];
  private tradeGoods: string[];

  constructor(seed: number | string) {
    this.rng = new SeededRandom(seed);
    
    this.economyTypes = this.generateEconomyTypes();
    this.resourceTypes = [
      'Dilithium Crystals', 'Tritanium Ore', 'Duranium Alloy', 'Latinum',
      'Deuterium Fuel', 'Antimatter Pods', 'Plasma Coolant', 'Isolinear Chips',
      'Biometric Gel', 'Tetryon Particles', 'Rodinium', 'Pergium',
      'Topaline', 'Zenite Gas', 'Trellium-D', 'Benamite Crystals',
      'Verterium Cortenide', 'Polyferranide', 'Iridium', 'Thoron Radiation'
    ];
    
    this.technologyTypes = [
      'Warp Core Components', 'Shield Generators', 'Phaser Arrays',
      'Photon Torpedoes', 'Tricorder Upgrades', 'Transporter Enhancers',
      'Sensor Arrays', 'Deflector Dishes', 'EPS Conduits', 'ODN Cables',
      'Holo-Emitters', 'Replicator Patterns', 'Medical Supplies',
      'Research Data', 'Ship Schematics', 'Weapon Upgrades'
    ];
    
    this.tradeGoods = [
      'Alien Artifacts', 'Luxury Goods', 'Food Supplies', 'Water',
      'Entertainment Media', 'Art Objects', 'Spices', 'Textiles',
      'Medical Supplies', 'Construction Materials', 'Agricultural Products',
      'Rare Minerals', 'Exotic Matter', 'Cultural Items'
    ];
  }

  /**
   * Generate economy types
   */
  private generateEconomyTypes(): EconomyType[] {
    return [
      {
        id: 'mining',
        name: 'Mining Economy',
        primaryExport: ['Dilithium Crystals', 'Tritanium Ore', 'Rodinium'],
        primaryImport: ['Food Supplies', 'Medical Supplies', 'Technology'],
        techLevel: 6,
        wealth: 'moderate',
        stability: 75
      },
      {
        id: 'industrial',
        name: 'Industrial Economy',
        primaryExport: ['Ship Components', 'Technology', 'Alloys'],
        primaryImport: ['Raw Materials', 'Energy', 'Labor'],
        techLevel: 8,
        wealth: 'wealthy',
        stability: 80
      },
      {
        id: 'agricultural',
        name: 'Agricultural Economy',
        primaryExport: ['Food Supplies', 'Water', 'Organic Materials'],
        primaryImport: ['Technology', 'Equipment', 'Fuel'],
        techLevel: 5,
        wealth: 'moderate',
        stability: 85
      },
      {
        id: 'technology',
        name: 'Technology Hub',
        primaryExport: ['Advanced Technology', 'Research', 'Data'],
        primaryImport: ['Rare Materials', 'Energy', 'Credits'],
        techLevel: 10,
        wealth: 'opulent',
        stability: 70
      },
      {
        id: 'trading',
        name: 'Trading Hub',
        primaryExport: ['Trade Goods', 'Luxury Items', 'Services'],
        primaryImport: ['Everything'],
        techLevel: 7,
        wealth: 'wealthy',
        stability: 90
      },
      {
        id: 'military',
        name: 'Military Outpost',
        primaryExport: ['Weapons', 'Security', 'Mercenaries'],
        primaryImport: ['Supplies', 'Intel', 'Technology'],
        techLevel: 9,
        wealth: 'wealthy',
        stability: 60
      },
      {
        id: 'research',
        name: 'Research Colony',
        primaryExport: ['Scientific Data', 'Patents', 'Prototypes'],
        primaryImport: ['Exotic Materials', 'Funding', 'Equipment'],
        techLevel: 10,
        wealth: 'moderate',
        stability: 75
      },
      {
        id: 'refinery',
        name: 'Refinery Station',
        primaryExport: ['Refined Materials', 'Fuel', 'Chemicals'],
        primaryImport: ['Raw Ores', 'Energy', 'Equipment'],
        techLevel: 7,
        wealth: 'moderate',
        stability: 80
      }
    ];
  }

  /**
   * Generate trading station for a star system
   */
  generateTradingStation(systemInfo: StarSystemInfo, stationIndex: number = 0): TradingStation {
    const stationRng = new SeededRandom(systemInfo.seed + stationIndex);
    
    const economy = this.selectEconomy(stationRng, systemInfo);
    const inventory = this.generateStationInventory(stationRng, economy, systemInfo);
    
    // Faction affects prices
    const factionMultipliers: Record<string, { buy: number; sell: number }> = {
      'Federation': { buy: 0.95, sell: 1.05 },
      'Ferengi Alliance': { buy: 0.70, sell: 1.40 },
      'Klingon Empire': { buy: 0.85, sell: 1.20 },
      'Romulan Star Empire': { buy: 0.80, sell: 1.25 },
      'Independent': { buy: 0.90, sell: 1.10 }
    };
    
    const multipliers = factionMultipliers[systemInfo.faction || 'Independent'] || { buy: 0.90, sell: 1.10 };
    
    return {
      id: `${systemInfo.id}-station-${stationIndex}`,
      systemId: systemInfo.id,
      name: `${systemInfo.name} Trading Post`,
      faction: systemInfo.faction || 'Independent',
      economy,
      inventory,
      buyMultiplier: multipliers.buy,
      sellMultiplier: multipliers.sell,
      reputation: 50
    };
  }

  /**
   * Select economy type based on system properties
   */
  private selectEconomy(rng: SeededRandom, systemInfo: StarSystemInfo): EconomyType {
    // System resources influence economy
    if (systemInfo.resources.some(r => ['Dilithium', 'Tritanium', 'Rodinium'].some(m => r.includes(m)))) {
      return this.economyTypes.find(e => e.id === 'mining') || this.economyTypes[0];
    }
    
    if (systemInfo.dangerLevel > 7) {
      return this.economyTypes.find(e => e.id === 'military') || this.economyTypes[0];
    }
    
    // Otherwise random based on tech level
    const availableTypes = this.economyTypes.filter(e => {
      if (systemInfo.starType === 'O' || systemInfo.starType === 'B') {
        return e.techLevel >= 8; // High-tech systems
      }
      return true;
    });
    
    return rng.pick(availableTypes);
  }

  /**
   * Generate station inventory
   */
  private generateStationInventory(rng: SeededRandom, economy: EconomyType, systemInfo: StarSystemInfo): MarketItem[] {
    const inventory: MarketItem[] = [];
    const itemCount = rng.nextInt(15, 40);
    
    // Add resources
    const resourceCount = rng.nextInt(5, 12);
    for (let i = 0; i < resourceCount; i++) {
      const resource = rng.pick(this.resourceTypes);
      inventory.push(this.createMarketItem(rng, resource, 'resource', economy, systemInfo));
    }
    
    // Add technology
    const techCount = rng.nextInt(3, 8);
    for (let i = 0; i < techCount; i++) {
      const tech = rng.pick(this.technologyTypes);
      inventory.push(this.createMarketItem(rng, tech, 'technology', economy, systemInfo));
    }
    
    // Add trade goods
    const goodsCount = itemCount - resourceCount - techCount;
    for (let i = 0; i < goodsCount; i++) {
      const good = rng.pick(this.tradeGoods);
      inventory.push(this.createMarketItem(rng, good, 'trade-good', economy, systemInfo));
    }
    
    return inventory;
  }

  /**
   * Create market item with dynamic pricing
   */
  private createMarketItem(
    rng: SeededRandom,
    name: string,
    category: MarketItem['category'],
    economy: EconomyType,
    systemInfo: StarSystemInfo
  ): MarketItem {
    const baseValue = this.calculateBaseValue(category, name, economy.techLevel);
    
    // Calculate supply and demand
    const isExport = economy.primaryExport.some(e => name.includes(e));
    const isImport = economy.primaryImport.some(i => name.includes(i));
    
    let supply = rng.nextInt(0, 100);
    let demand = rng.nextInt(0, 100);
    
    if (isExport) {
      supply = rng.nextInt(70, 100);
      demand = rng.nextInt(20, 50);
    } else if (isImport) {
      supply = rng.nextInt(20, 50);
      demand = rng.nextInt(70, 100);
    }
    
    // Calculate current price based on supply/demand
    const supplyDemandRatio = demand / (supply + 1);
    const currentPrice = Math.floor(baseValue * supplyDemandRatio);
    
    // Volatility based on economy stability
    const volatility = 100 - economy.stability;
    
    return {
      id: `${name.toLowerCase().replace(/\s+/g, '-')}-${rng.nextInt(1000, 9999)}`,
      name,
      category,
      baseValue,
      currentPrice,
      supply,
      demand,
      priceVolatility: volatility,
      description: this.generateItemDescription(name, category)
    };
  }

  /**
   * Calculate base value for item
   */
  private calculateBaseValue(category: MarketItem['category'], name: string, techLevel: number): number {
    const baseValues: Record<MarketItem['category'], number> = {
      'resource': 100,
      'technology': 500,
      'trade-good': 200,
      'ship-component': 1000,
      'consumable': 50
    };
    
    let value = baseValues[category];
    
    // Rare items are more valuable
    if (name.includes('Rare') || name.includes('Exotic')) value *= 2;
    if (name.includes('Advanced') || name.includes('Prototype')) value *= 1.5;
    if (name.includes('Ancient') || name.includes('Artifact')) value *= 3;
    
    // Tech level affects technology prices
    if (category === 'technology') {
      value *= (techLevel / 5);
    }
    
    return Math.floor(value);
  }

  /**
   * Generate item description
   */
  private generateItemDescription(name: string, category: MarketItem['category']): string {
    const descriptions: Record<MarketItem['category'], string[]> = {
      'resource': ['Essential raw material', 'Refined ore', 'Valuable resource', 'Industrial material'],
      'technology': ['Advanced equipment', 'Cutting-edge tech', 'Reliable hardware', 'State-of-the-art'],
      'trade-good': ['Desirable commodity', 'High-quality goods', 'Popular item', 'Valuable merchandise'],
      'ship-component': ['Ship upgrade', 'Performance enhancer', 'Critical component', 'Superior part'],
      'consumable': ['Limited use item', 'Disposable goods', 'Single-use product', 'Consumable supply']
    };
    
    return this.rng.pick(descriptions[category]);
  }

  /**
   * Generate resource nodes in a system
   */
  generateResourceNodes(systemInfo: StarSystemInfo, count: number = 5): ResourceNode[] {
    const nodes: ResourceNode[] = [];
    const nodeRng = new SeededRandom(systemInfo.seed + 99999);
    
    for (let i = 0; i < count; i++) {
      const resourceType = nodeRng.pick([...systemInfo.resources, ...this.resourceTypes]);
      const qualities: ResourceNode['quality'][] = ['poor', 'standard', 'high', 'exceptional', 'perfect'];
      const quality = nodeRng.pick(qualities);
      
      // Quality affects quantity
      const qualityMultipliers = { poor: 0.5, standard: 1.0, high: 1.5, exceptional: 2.0, perfect: 3.0 };
      const baseQuantity = nodeRng.nextInt(100, 1000);
      const quantity = Math.floor(baseQuantity * qualityMultipliers[quality]);
      
      nodes.push({
        id: `${systemInfo.id}-node-${i}`,
        type: resourceType,
        quality,
        quantity,
        renewalRate: nodeRng.nextFloat(0, 10),
        location: {
          systemId: systemInfo.id,
          coordinates: {
            x: nodeRng.nextFloat(-1000, 1000),
            y: nodeRng.nextFloat(-1000, 1000),
            z: nodeRng.nextFloat(-100, 100)
          }
        }
      });
    }
    
    return nodes;
  }

  /**
   * Find profitable trade routes
   */
  findTradeRoutes(stations: TradingStation[]): TradeRoute[] {
    const routes: TradeRoute[] = [];
    
    // Compare all station pairs
    for (let i = 0; i < stations.length; i++) {
      for (let j = i + 1; j < stations.length; j++) {
        const route = this.analyzeTradeRoute(stations[i], stations[j]);
        if (route.profitMargin > 10) { // Only profitable routes
          routes.push(route);
        }
      }
    }
    
    // Sort by profit margin
    return routes.sort((a, b) => b.profitMargin - a.profitMargin);
  }

  /**
   * Analyze trade route between two stations
   */
  private analyzeTradeRoute(stationA: TradingStation, stationB: TradingStation): TradeRoute {
    const profitableGoods: string[] = [];
    let totalProfit = 0;
    
    // Check each item in station A
    for (const itemA of stationA.inventory) {
      const itemB = stationB.inventory.find(i => i.name === itemA.name);
      if (!itemB) continue;
      
      // Calculate profit: buy from A, sell to B
      const buyPrice = itemA.currentPrice * stationA.sellMultiplier;
      const sellPrice = itemB.currentPrice * stationB.buyMultiplier;
      const profit = sellPrice - buyPrice;
      
      if (profit > 0) {
        profitableGoods.push(itemA.name);
        totalProfit += profit;
      }
    }
    
    // Calculate distance (simplified)
    const distance = Math.abs(stationA.systemId.length - stationB.systemId.length) * 100;
    
    // Risk based on faction relations
    const riskLevel = this.calculateRouteRisk(stationA.faction, stationB.faction);
    
    return {
      id: `route-${stationA.id}-${stationB.id}`,
      fromStation: stationA.id,
      toStation: stationB.id,
      profitableGoods,
      distance,
      profitMargin: profitableGoods.length > 0 ? totalProfit / profitableGoods.length : 0,
      riskLevel
    };
  }

  /**
   * Calculate route risk
   */
  private calculateRouteRisk(factionA: string, factionB: string): number {
    const hostilePairs = [
      ['Federation', 'Borg Collective'],
      ['Federation', 'Dominion'],
      ['Klingon Empire', 'Romulan Star Empire'],
      ['Klingon Empire', 'Cardassian Union']
    ];
    
    for (const [f1, f2] of hostilePairs) {
      if ((factionA === f1 && factionB === f2) || (factionA === f2 && factionB === f1)) {
        return 8;
      }
    }
    
    return this.rng.nextInt(1, 5);
  }

  /**
   * Update market prices (simulate economy)
   */
  updateMarketPrices(station: TradingStation, timeDelta: number): void {
    for (const item of station.inventory) {
      // Random price fluctuation
      const change = this.rng.nextFloat(-item.priceVolatility / 100, item.priceVolatility / 100);
      item.currentPrice = Math.max(
        Math.floor(item.baseValue * 0.5),
        Math.floor(item.currentPrice * (1 + change))
      );
      
      // Supply/demand shifts
      item.supply = Math.max(0, Math.min(100, item.supply + this.rng.nextInt(-5, 5)));
      item.demand = Math.max(0, Math.min(100, item.demand + this.rng.nextInt(-5, 5)));
      
      // Adjust price based on new supply/demand
      const ratio = item.demand / (item.supply + 1);
      item.currentPrice = Math.floor(item.baseValue * ratio);
    }
  }
}

export default ProceduralEconomy;
