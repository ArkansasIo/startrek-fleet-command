// ProceduralPlanetGenerator.ts
// Advanced planet generation with terrain, biomes, and surface features
// Inspired by No Man's Sky's planet generation

import { SeededRandom } from './SeedGenerator';
import type { PlanetInfo, BiomeInfo } from './ProceduralUniverse';

export interface TerrainPoint {
  x: number;
  y: number;
  elevation: number; // 0-1
  temperature: number;
  moisture: number;
  biomeType: string;
}

export interface POI {
  id: string;
  type: 'ruin' | 'outpost' | 'cave' | 'mineral-deposit' | 'artifact' | 'wreckage' | 'settlement' | 'anomaly';
  name: string;
  lat: number;
  lon: number;
  discovered: boolean;
  description: string;
  rewards?: any[];
}

export interface WeatherPattern {
  type: 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'toxic' | 'radiation' | 'extreme';
  intensity: number; // 0-100
  duration: number; // minutes
  hazardLevel: number; // 0-10
}

export interface PlanetSurface {
  resolution: number;
  heightMap: number[][];
  temperatureMap: number[][];
  moistureMap: number[][];
  biomeMap: string[][];
  pois: POI[];
  weather: WeatherPattern[];
}

export class ProceduralPlanetGenerator {
  private rng: SeededRandom;
  private planetInfo: PlanetInfo;

  constructor(planetInfo: PlanetInfo) {
    this.planetInfo = planetInfo;
    this.rng = new SeededRandom(planetInfo.seed);
  }

  /**
   * Generate full planet surface data
   */
  generateSurface(resolution: number = 64): PlanetSurface {
    const heightMap = this.generateHeightMap(resolution);
    const temperatureMap = this.generateTemperatureMap(resolution, heightMap);
    const moistureMap = this.generateMoistureMap(resolution);
    const biomeMap = this.generateBiomeMap(resolution, temperatureMap, moistureMap, heightMap);
    const pois = this.generatePOIs(heightMap, biomeMap);
    const weather = this.generateWeatherPatterns();

    return {
      resolution,
      heightMap,
      temperatureMap,
      moistureMap,
      biomeMap,
      pois,
      weather
    };
  }

  /**
   * Generate height map using multi-octave noise
   */
  private generateHeightMap(resolution: number): number[][] {
    const map: number[][] = [];
    
    for (let y = 0; y < resolution; y++) {
      map[y] = [];
      for (let x = 0; x < resolution; x++) {
        // Multi-octave Perlin noise
        let elevation = 0;
        let amplitude = 1;
        let frequency = 1;
        let maxValue = 0;
        
        // 4 octaves for detail
        for (let octave = 0; octave < 4; octave++) {
          const sampleX = (x / resolution) * frequency;
          const sampleY = (y / resolution) * frequency;
          
          elevation += this.rng.noise2D(sampleX * 10, sampleY * 10) * amplitude;
          maxValue += amplitude;
          
          amplitude *= 0.5; // Persistence
          frequency *= 2; // Lacunarity
        }
        
        // Normalize to 0-1
        map[y][x] = (elevation / maxValue + 1) / 2;
        
        // Apply planet type modifiers
        map[y][x] = this.applyPlanetTypeModifier(map[y][x]);
      }
    }
    
    return map;
  }

  /**
   * Apply planet type specific height modifications
   */
  private applyPlanetTypeModifier(elevation: number): number {
    switch (this.planetInfo.type) {
      case 'oceanic':
        // More water, lower average elevation
        return elevation * 0.7;
      case 'volcanic':
        // Extreme terrain
        return Math.pow(elevation, 0.5);
      case 'barren':
        // Flat with occasional craters
        return elevation * 0.6 + (this.rng.next() < 0.1 ? this.rng.nextFloat(0, 0.4) : 0);
      case 'gas-giant':
      case 'ice-giant':
        // No solid surface
        return 0.5;
      case 'arctic':
        // Smoother terrain
        return elevation * 0.8;
      default:
        return elevation;
    }
  }

  /**
   * Generate temperature map based on latitude and elevation
   */
  private generateTemperatureMap(resolution: number, heightMap: number[][]): number[][] {
    const map: number[][] = [];
    const baseTemp = this.planetInfo.temperature;
    
    for (let y = 0; y < resolution; y++) {
      map[y] = [];
      for (let x = 0; x < resolution; x++) {
        // Latitude effect (cooler at poles)
        const latitude = (y / resolution - 0.5) * 180;
        const latitudeEffect = Math.cos(latitude * Math.PI / 180);
        
        // Elevation effect (cooler at higher elevations)
        const elevationEffect = heightMap[y][x] * -100;
        
        // Random variation
        const variation = this.rng.nextFloat(-20, 20);
        
        map[y][x] = baseTemp * latitudeEffect + elevationEffect + variation;
      }
    }
    
    return map;
  }

  /**
   * Generate moisture map
   */
  private generateMoistureMap(resolution: number): number[][] {
    const map: number[][] = [];
    
    for (let y = 0; y < resolution; y++) {
      map[y] = [];
      for (let x = 0; x < resolution; x++) {
        // Use different noise for moisture
        const moisture = (this.rng.noise2D(x * 0.05, y * 0.05) + 1) / 2;
        
        // Planet type affects moisture
        let modifier = 1.0;
        switch (this.planetInfo.type) {
          case 'oceanic': modifier = 2.0; break;
          case 'desert': modifier = 0.2; break;
          case 'arctic': modifier = 0.3; break;
          case 'barren': modifier = 0.1; break;
          case 'volcanic': modifier = 0.1; break;
        }
        
        map[y][x] = Math.min(1, moisture * modifier);
      }
    }
    
    return map;
  }

  /**
   * Generate biome map based on temperature and moisture
   */
  private generateBiomeMap(
    resolution: number,
    temperatureMap: number[][],
    moistureMap: number[][],
    heightMap: number[][]
  ): string[][] {
    const map: string[][] = [];
    
    for (let y = 0; y < resolution; y++) {
      map[y] = [];
      for (let x = 0; x < resolution; x++) {
        const temp = temperatureMap[y][x];
        const moisture = moistureMap[y][x];
        const elevation = heightMap[y][x];
        
        map[y][x] = this.determineBiome(temp, moisture, elevation);
      }
    }
    
    return map;
  }

  /** ]
   * Determine biome based on environmental factors
   */
  private determineBiome(temperature: number, moisture: number, elevation: number): string {
    // Water bodies
    if (elevation < 0.3) {
      return temperature < 273 ? 'Ice' : 'Ocean';
    }
    
    // High elevation
    if (elevation > 0.8) {
      return temperature < 273 ? 'Snow Peak' : 'Mountain';
    }
    
    // Temperature-Moisture matrix
    if (temperature < 250) {
      return 'Frozen Wasteland';
    } else if (temperature < 273) {
      return moisture > 0.5 ? 'Tundra' : 'Ice Field';
    } else if (temperature < 290) {
      if (moisture > 0.7) return 'Boreal Forest';
      if (moisture > 0.4) return 'Temperate Forest';
      if (moisture > 0.2) return 'Grassland';
      return 'Cold Desert';
    } else if (temperature < 310) {
      if (moisture > 0.7) return 'Tropical Rainforest';
      if (moisture > 0.4) return 'Tropical Forest';
      if (moisture > 0.2) return 'Savanna';
      return 'Desert';
    } else {
      return moisture > 0.3 ? 'Volcanic Jungle' : 'Scorched Desert';
    }
  }

  /**
   * Generate Points of Interest
   */
  private generatePOIs(heightMap: number[][], biomeMap: string[][]): POI[] {
    const pois: POI[] = [];
    const poiCount = this.rng.nextInt(5, 20);
    const resolution = heightMap.length;
    
    const poiTypes: POI['type'][] = [
      'ruin', 'outpost', 'cave', 'mineral-deposit', 
      'artifact', 'wreckage', 'settlement', 'anomaly'
    ];
    
    for (let i = 0; i < poiCount; i++) {
      const x = this.rng.nextInt(0, resolution - 1);
      const y = this.rng.nextInt(0, resolution - 1);
      
      const lat = (y / resolution - 0.5) * 180;
      const lon = (x / resolution - 0.5) * 360;
      const type = this.rng.pick(poiTypes);
      
      pois.push({
        id: `poi-${i}`,
        type,
        name: this.generatePOIName(type),
        lat,
        lon,
        discovered: false,
        description: this.generatePOIDescription(type),
        rewards: this.generatePOIRewards(type)
      });
    }
    
    return pois;
  }

  /**
   * Generate POI name
   */
  private generatePOIName(type: POI['type']): string {
    const prefixes = ['Ancient', 'Lost', 'Abandoned', 'Hidden', 'Mysterious', 'Forgotten'];
    const names: Record<POI['type'], string[]> = {
      'ruin': ['Temple', 'City', 'Monument', 'Structure'],
      'outpost': ['Station', 'Base', 'Outpost', 'Facility'],
      'cave': ['Cavern', 'Grotto', 'Cave System', 'Underground Complex'],
      'mineral-deposit': ['Vein', 'Deposit', 'Mine', 'Quarry'],
      'artifact': ['Artifact Site', 'Dig Site', 'Archaeological Site'],
      'wreckage': ['Crash Site', 'Wreckage', 'Debris Field'],
      'settlement': ['Settlement', 'Village', 'Colony', 'Habitat'],
      'anomaly': ['Anomaly', 'Rift', 'Distortion', 'Phenomenon']
    };
    
    return `${this.rng.pick(prefixes)} ${this.rng.pick(names[type])}`;
  }

  /**
   * Generate POI description
   */
  private generatePOIDescription(type: POI['type']): string {
    const descriptions: Record<POI['type'], string[]> = {
      'ruin': ['Ancient civilization remnants', 'Crumbling structures', 'Archaeological significance'],
      'outpost': ['Abandoned facility', 'Operational station', 'Research outpost'],
      'cave': ['Natural formation', 'Unexplored depths', 'Shelter location'],
      'mineral-deposit': ['Rich resources detected', 'Valuable minerals', 'Ore concentration'],
      'artifact': ['Unknown technology', 'Historical artifact', 'Alien origin'],
      'wreckage': ['Ship debris', 'Combat aftermath', 'Emergency beacon'],
      'settlement': ['Inhabited area', 'Trading post', 'Local population'],
      'anomaly': ['Unusual readings', 'Spatial distortion', 'Unknown phenomenon']
    };
    
    return this.rng.pick(descriptions[type]);
  }

  /**
   * Generate POI rewards
   */
  private generatePOIRewards(type: POI['type']): any[] {
    const rewards: any[] = [];
    
    switch (type) {
      case 'ruin':
      case 'artifact':
        rewards.push({ type: 'research', amount: this.rng.nextInt(50, 200) });
        rewards.push({ type: 'reputation', amount: this.rng.nextInt(10, 50) });
        break;
      case 'mineral-deposit':
        rewards.push({ type: 'resources', amount: this.rng.nextInt(100, 500) });
        break;
      case 'wreckage':
        rewards.push({ type: 'salvage', amount: this.rng.nextInt(50, 150) });
        break;
      case 'settlement':
        rewards.push({ type: 'trade', available: true });
        break;
      case 'anomaly':
        rewards.push({ type: 'special', unique: true });
        break;
    }
    
    return rewards;
  }

  /**
   * Generate weather patterns
   */
  private generateWeatherPatterns(): WeatherPattern[] {
    const patterns: WeatherPattern[] = [];
    const count = this.rng.nextInt(1, 5);
    
    const weatherTypes: WeatherPattern['type'][] = [
      'clear', 'cloudy', 'rain', 'storm', 'snow', 'toxic', 'radiation', 'extreme'
    ];
    
    for (let i = 0; i < count; i++) {
      const type = this.selectWeatherType(weatherTypes);
      patterns.push({
        type,
        intensity: this.rng.nextInt(10, 100),
        duration: this.rng.nextInt(5, 120),
        hazardLevel: this.getWeatherHazard(type)
      });
    }
    
    return patterns;
  }

  /**
   * Select weather type based on planet type
   */
  private selectWeatherType(types: WeatherPattern['type'][]): WeatherPattern['type'] {
    const planetWeather: Record<string, WeatherPattern['type'][]> = {
      'terran': ['clear', 'cloudy', 'rain', 'storm'],
      'arctic': ['clear', 'snow', 'storm'],
      'desert': ['clear', 'storm'],
      'oceanic': ['rain', 'storm'],
      'volcanic': ['toxic', 'extreme'],
      'toxic': ['toxic', 'radiation', 'extreme'],
      'barren': ['clear'],
      'gas-giant': ['extreme', 'storm'],
      'ice-giant': ['extreme', 'snow'],
      'exotic': ['radiation', 'extreme', 'toxic']
    };
    
    const validTypes = planetWeather[this.planetInfo.type] || types;
    return this.rng.pick(validTypes);
  }

  /**
   * Get weather hazard level
   */
  private getWeatherHazard(type: WeatherPattern['type']): number {
    const hazardMap: Record<WeatherPattern['type'], number> = {
      'clear': 0, 'cloudy': 0, 'rain': 1, 'snow': 2,
      'storm': 5, 'toxic': 7, 'radiation': 8, 'extreme': 10
    };
    return hazardMap[type] || 0;
  }

  /**
   * Get terrain point at coordinates
   */
  getTerrainAt(surface: PlanetSurface, lat: number, lon: number): TerrainPoint {
    const resolution = surface.resolution;
    const y = Math.floor((lat / 180 + 0.5) * resolution);
    const x = Math.floor((lon / 360 + 0.5) * resolution);
    
    const clampedY = Math.max(0, Math.min(resolution - 1, y));
    const clampedX = Math.max(0, Math.min(resolution - 1, x));
    
    return {
      x: clampedX,
      y: clampedY,
      elevation: surface.heightMap[clampedY][clampedX],
      temperature: surface.temperatureMap[clampedY][clampedX],
      moisture: surface.moistureMap[clampedY][clampedX],
      biomeType: surface.biomeMap[clampedY][clampedX]
    };
  }

  /**
   * Find nearest POI to coordinates
   */
  findNearestPOI(surface: PlanetSurface, lat: number, lon: number, maxDistance: number = 50): POI | null {
    let nearest: POI | null = null;
    let minDistance = maxDistance;
    
    for (const poi of surface.pois) {
      const distance = Math.sqrt(
        Math.pow(poi.lat - lat, 2) + Math.pow(poi.lon - lon, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearest = poi;
      }
    }
    
    return nearest;
  }
}

export default ProceduralPlanetGenerator;
