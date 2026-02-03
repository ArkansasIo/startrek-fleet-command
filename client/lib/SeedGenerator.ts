// SeedGenerator.ts
// Core seed-based random number generator for procedural generation
// Inspired by No Man's Sky's deterministic universe generation

export class SeededRandom {
  private seed: number;
  private state: number;

  constructor(seed: number | string) {
    // Convert string seeds to numbers (like "Galaxy-Alpha-42")
    if (typeof seed === 'string') {
      this.seed = this.hashString(seed);
    } else {
      this.seed = seed;
    }
    this.state = this.seed;
  }

  /**
   * Hash a string to a numeric seed
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Generate next random number (0-1)
   * Uses a simple LCG (Linear Congruential Generator)
   */
  next(): number {
    this.state = (this.state * 1664525 + 1013904223) & 0xFFFFFFFF;
    return (this.state >>> 0) / 0xFFFFFFFF;
  }

  /**
   * Generate random integer between min and max (inclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Generate random float between min and max
   */
  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  /**
   * Generate random boolean
   */
  nextBool(probability: number = 0.5): boolean {
    return this.next() < probability;
  }

  /**
   * Pick random element from array
   */
  pick<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }

  /**
   * Shuffle array (Fisher-Yates)
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Generate perlin-like noise for terrain
   */
  noise2D(x: number, y: number): number {
    const n = x + y * 57;
    const nn = (n << 13) ^ n;
    const t = (nn * (nn * nn * 15731 + 789221) + 1376312589) & 0x7fffffff;
    return 1.0 - (t / 1073741824.0);
  }

  /**
   * Reset to original seed
   */
  reset(): void {
    this.state = this.seed;
  }

  /**
   * Get current seed
   */
  getSeed(): number {
    return this.seed;
  }

  /**
   * Create a child generator with modified seed
   */
  fork(modifier: string | number): SeededRandom {
    const childSeed = typeof modifier === 'string' 
      ? this.seed + this.hashString(modifier)
      : this.seed + modifier;
    return new SeededRandom(childSeed);
  }
}

/**
 * Coordinate-based seed generator for spatial consistency
 */
export class CoordinateSeedGenerator {
  private baseSeed: number;

  constructor(universeSeed: number | string) {
    this.baseSeed = typeof universeSeed === 'string' 
      ? new SeededRandom(universeSeed).getSeed()
      : universeSeed;
  }

  /**
   * Generate seed for specific coordinates
   */
  getSeedAt(x: number, y: number, z: number = 0): number {
    // Cantor pairing function for unique coordinate mapping
    const pair1 = ((x + y) * (x + y + 1)) / 2 + y;
    const pair2 = ((pair1 + z) * (pair1 + z + 1)) / 2 + z;
    return this.baseSeed ^ pair2;
  }

  /**
   * Generate random for specific coordinates
   */
  getRandomAt(x: number, y: number, z: number = 0): SeededRandom {
    return new SeededRandom(this.getSeedAt(x, y, z));
  }

  /**
   * Get base seed
   */
  getBaseSeed(): number {
    return this.baseSeed;
  }
}

/**
 * Named seed generator for consistent object generation
 */
export class NamedSeedGenerator {
  private baseSeed: number;

  constructor(baseSeed: number | string) {
    this.baseSeed = typeof baseSeed === 'string'
      ? new SeededRandom(baseSeed).getSeed()
      : baseSeed;
  }

  /**
   * Generate seed for named entity
   */
  getSeedFor(name: string): number {
    const nameHash = new SeededRandom(name).getSeed();
    return this.baseSeed ^ nameHash;
  }

  /**
   * Generate random for named entity
   */
  getRandomFor(name: string): SeededRandom {
    return new SeededRandom(this.getSeedFor(name));
  }
}

export default SeededRandom;
