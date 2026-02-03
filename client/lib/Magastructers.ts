// --- Canonical Star Trek Megastructures (Shows & Movies) ---
// Each entry: name, type/class, description, and sample details
export const CANONICAL_MAGASTRUCTERS: Array<{
  name: string;
  classType: string;
  description: string;
  source: string;
}> = [
  { name: "Dyson Sphere", classType: "Stellar Megastructure", description: "A massive shell built around a star to capture its energy.", source: "TNG: Relics" },
  { name: "V'Ger", classType: "Machine Entity / Megastructure", description: "A vast, sentient machine built around Voyager 6.", source: "Star Trek: The Motion Picture" },
  { name: "Borg Unicomplex", classType: "Borg Megastructure", description: "The central hub of the Borg Collective, spanning thousands of kilometers.", source: "VOY: Unimatrix Zero, Endgame" },
  { name: "Deep Space Nine (Terok Nor)", classType: "Space Station", description: "Cardassian-built, later Federation-operated station near Bajor.", source: "DS9 (series)" },
  { name: "Starbase 1", classType: "Federation Starbase", description: "Primary Federation starbase in Earth orbit.", source: "Multiple" },
  { name: "Earth Spacedock", classType: "Federation Spacedock", description: "Massive orbital station above Earth.", source: "Star Trek III, IV, VI, TNG, DS9" },
  { name: "Regula I", classType: "Federation Research Station", description: "Research station in the Mutara sector.", source: "Star Trek II: The Wrath of Khan" },
  { name: "Jupiter Station", classType: "Federation Research Station", description: "Starfleet research and development facility.", source: "VOY: Life Line" },
  { name: "Caretaker Array", classType: "Nacene Array", description: "Massive array capable of transporting ships across quadrants.", source: "VOY: Caretaker" },
  { name: "The Great Barrier", classType: "Galactic Barrier", description: "Energy barrier at the edge of the galaxy.", source: "TOS: Where No Man Has Gone Before" },
  { name: "Genesis Planet Facility", classType: "Terraforming Megastructure", description: "Terraforming device that created the Genesis Planet.", source: "Star Trek II & III" },
  { name: "The Doomsday Machine", classType: "Planet Killer", description: "Planet-destroying automated machine.", source: "TOS: The Doomsday Machine" },
  { name: "The Whale Probe", classType: "Alien Probe", description: "Enigmatic probe seeking communication with humpback whales.", source: "Star Trek IV: The Voyage Home" },
  { name: "The Crystalline Entity", classType: "Space Entity", description: "Gigantic crystalline lifeform that consumes planets.", source: "TNG: Datalore, Silicon Avatar" },
  { name: "The Nexus Ribbon", classType: "Energy Ribbon", description: "Temporal energy phenomenon with reality-altering properties.", source: "Star Trek: Generations" },
  { name: "The Guardian of Forever", classType: "Temporal Gateway", description: "Ancient time portal on a remote planet.", source: "TOS: The City on the Edge of Forever" },
  { name: "The Sphere Builders' Spheres", classType: "Transdimensional Sphere", description: "Massive spheres altering space-time in the Delphic Expanse.", source: "ENT: The Council" },
  { name: "The Tkon Empire's Portal", classType: "Planetary Defense Megastructure", description: "Ancient defense system of the Tkon Empire.", source: "TNG: The Last Outpost" },
  { name: "The Iconian Gateway", classType: "Gateway Network", description: "Ancient instantaneous travel network.", source: "TNG: Contagion, DS9: To the Death" },
  { name: "The Preserver Obelisk", classType: "Obelisk Megastructure", description: "Obelisk that protected a planet from asteroids.", source: "TOS: The Paradise Syndrome" },
  { name: "The Xindi Weapon", classType: "Superweapon", description: "Planet-destroying Xindi superweapon.", source: "ENT: The Expanse" },
  { name: "The Sh'Raan", classType: "Vulcan Starship Megastructure", description: "Vulcan High Command's flagship.", source: "ENT: The Forge" },
  { name: "The Romulan Star Empire's Starbase", classType: "Romulan Starbase", description: "Massive Romulan military outpost.", source: "TNG, DS9" },
  { name: "The Tholian Web", classType: "Energy Web", description: "Energy web capable of trapping starships.", source: "TOS: The Tholian Web" },
  { name: "The Voth City-Ship", classType: "Mobile City-Ship", description: "Enormous Voth city-ship in the Delta Quadrant.", source: "VOY: Distant Origin" },
  { name: "The Sphere Data Archive", classType: "Ancient Data Archive", description: "Ancient sphere containing vast knowledge.", source: "DIS: An Obol for Charon" },
  { name: "The Krenim Temporal Weapon Ship", classType: "Temporal Weapon Ship", description: "Ship capable of erasing objects from history.", source: "VOY: Year of Hell" },
  { name: "The Obelisk of Sha Ka Ree", classType: "Obelisk Megastructure", description: "Obelisk on the planet Sha Ka Ree.", source: "Star Trek V: The Final Frontier" },
  { name: "The Starbase Yorktown", classType: "Federation Starbase", description: "Massive, advanced starbase in deep space.", source: "Star Trek Beyond" },
  { name: "The Cloud City of Stratos", classType: "Floating City", description: "City floating in the atmosphere of Ardana.", source: "TOS: The Cloud Minders" },
  { name: "The Argus Array", classType: "Sensor Array", description: "Large-scale Federation sensor array.", source: "TNG: The Nth Degree" },
  { name: "The Epsilon IX Station", classType: "Communications Station", description: "Federation communications station.", source: "Star Trek: The Motion Picture" },
  { name: "The Reman Scimitar", classType: "Superweapon Starship", description: "Reman warbird with thalaron weapon.", source: "Star Trek: Nemesis" },
  { name: "The Cardassian Nor-class Station", classType: "Nor-class Station", description: "Cardassian space station design (e.g., Terok Nor).", source: "DS9" },
  { name: "The Bajoran Orbital Weapons Platform", classType: "Weapons Platform", description: "Defensive platforms in orbit of Bajor.", source: "DS9: Call to Arms" },
  { name: "The Starfleet Drydock", classType: "Drydock", description: "Federation starship construction and repair facility.", source: "Multiple" },
  { name: "The Borg Transwarp Hub", classType: "Transwarp Hub", description: "Borg network for instant travel across the galaxy.", source: "VOY: Endgame" },
  { name: "The Romulan Cloaking Device Facility", classType: "Cloaking Facility", description: "Facility for developing cloaking technology.", source: "TOS: The Enterprise Incident" },
  { name: "The Dominion Shipyard", classType: "Shipyard", description: "Massive Dominion ship construction facility.", source: "DS9: Favor the Bold" },
  { name: "The Starfleet Academy Grounds", classType: "Academy Campus", description: "Starfleet's main training facility on Earth.", source: "Multiple" },
  { name: "The Klingon Ty'Gokor", classType: "Klingon Fortress", description: "Heavily fortified Klingon command center.", source: "DS9: Apocalypse Rising" },
  { name: "The Ferengi Tower of Commerce", classType: "Commerce Megastructure", description: "Center of Ferengi business and trade.", source: "DS9: Prophet Motive" },
  { name: "The Starfleet Memory Alpha", classType: "Federation Library Complex", description: "Central library of the Federation.", source: "TOS: The Lights of Zetar" },
  { name: "The Talarian Observation Post", classType: "Observation Post", description: "Talarian border monitoring station.", source: "TNG: Suddenly Human" },
  { name: "The Borg Cube", classType: "Borg Megastructure", description: "Iconic Borg vessel, a mobile megastructure.", source: "TNG, VOY, First Contact" },
  { name: "The Romulan Senate Chamber", classType: "Government Megastructure", description: "Seat of Romulan government.", source: "TNG, DS9, Nemesis" },
  { name: "The Vulcan Science Academy", classType: "Science Academy", description: "Vulcan's premier scientific institution.", source: "TOS, ENT" },
  { name: "The Klingon Monastery at Boreth", classType: "Religious Megastructure", description: "Sacred Klingon monastery.", source: "TNG: Rightful Heir" },
  { name: "The Starfleet Medical Facility", classType: "Medical Megastructure", description: "Federation's advanced medical center.", source: "Multiple" },
  { name: "The Bajoran Temple", classType: "Religious Megastructure", description: "Sacred temple for Bajoran faith.", source: "DS9" },
  { name: "The Genesis Device", classType: "Terraforming Device", description: "Device capable of creating life from lifelessness.", source: "Star Trek II & III" },
  { name: "The Starfleet Headquarters", classType: "Command Megastructure", description: "Federation's main command center on Earth.", source: "Multiple" },
  { name: "The Klingon Great Hall", classType: "Government Megastructure", description: "Seat of Klingon High Council.", source: "TNG, DS9" },
  { name: "The Cardassian Central Command", classType: "Government Megastructure", description: "Cardassian Union's main government center.", source: "DS9" },
  { name: "The Bajoran Wormhole", classType: "Stable Wormhole", description: "Stable wormhole near Bajor, home to the Prophets.", source: "DS9" },
  // ...add more as needed
];

// Helper: Create a Magastructer instance from canonical data


export function createMagastructerFromCanonical(
  entry: typeof CANONICAL_MAGASTRUCTERS[number],
  overrides?: Partial<{
    stats: MagastructerStats;
    subStats: MagastructerSubStats;
    attributes: MagastructerAttributes;
    features: MagastructerFeatures;
    details: Partial<MagastructerDetails>;
  }>
): Magastructer {
  // Provide some default values, can be customized via overrides
  const stats: MagastructerStats = overrides?.stats || { power: 1000, defense: 800, speed: 100, capacity: 10000 };
  const subStats: MagastructerSubStats = overrides?.subStats || { shield: 500, energyEfficiency: 80, repairRate: 30, stealth: 10 };
  const attributes: MagastructerAttributes = overrides?.attributes || { rarity: 'epic', faction: 'Unknown', location: 'Classified', isActive: false };
  const features: MagastructerFeatures = overrides?.features || { canUpgrade: true, canDefend: true, canRepair: true, canStealth: false };
  const details: MagastructerDetails = {
    name: entry.name,
    description: entry.description,
    level: 1,
    owner: 'Unknown',
    ...(overrides?.details || {})
  };
  return new Magastructer(details, stats, subStats, attributes, features);
}
// Magastructers.ts
// Types and class for Magastructers in Star Trek Fleet Command

export type MagastructerStats = {
  power: number;
  defense: number;
  speed: number;
  capacity: number;
};

export type MagastructerSubStats = {
  shield: number;
  energyEfficiency: number;
  repairRate: number;
  stealth: number;
};

export type MagastructerAttributes = {
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  faction: string;
  location: string;
  isActive: boolean;
};

export type MagastructerDetails = {
  name: string;
  description: string;
  level: number;
  owner: string;
};

export interface MagastructerFeatures {
  canUpgrade: boolean;
  canDefend: boolean;
  canRepair: boolean;
  canStealth: boolean;
}

export class Magastructer {
  stats: MagastructerStats;
  subStats: MagastructerSubStats;
  attributes: MagastructerAttributes;
  details: MagastructerDetails;
  features: MagastructerFeatures;
  techLevels: Record<string, number>;
  researchLog: string[];

  constructor(
    details: MagastructerDetails,
    stats: MagastructerStats,
    subStats: MagastructerSubStats,
    attributes: MagastructerAttributes,
    features: MagastructerFeatures
  ) {
    this.details = details;
    this.stats = stats;
    this.subStats = subStats;
    this.attributes = attributes;
    this.features = features;
    this.techLevels = {
      "Shield Enhancement": 0,
      "Energy Optimization": 0,
      "Stealth Systems": 0,
      "Repair Automation": 0,
      "Capacity Expansion": 0,
    };
    this.researchLog = [];
  }

  researchTechnology(tech: string) {
    if (this.techLevels[tech] !== undefined) {
      this.techLevels[tech]++;
      this.researchLog.push(`Researched ${tech} to level ${this.techLevels[tech]}`);
      switch (tech) {
        case "Shield Enhancement":
          this.subStats.shield += 50 * this.techLevels[tech];
          break;
        case "Energy Optimization":
          this.subStats.energyEfficiency += 20 * this.techLevels[tech];
          break;
        case "Stealth Systems":
          this.subStats.stealth += 30 * this.techLevels[tech];
          break;
        case "Repair Automation":
          this.subStats.repairRate += 15 * this.techLevels[tech];
          break;
        case "Capacity Expansion":
          this.stats.capacity += 100 * this.techLevels[tech];
          break;
      }
      return true;
    }
    return false;
  }

  upgrade() {
    if (!this.features.canUpgrade) return false;
    this.details.level++;
    this.stats.power += 10;
    this.stats.defense += 5;
    return true;
  }

  defend() {
    if (!this.features.canDefend) return false;
    this.subStats.shield += 20;
    return true;
  }

  repair() {
    if (!this.features.canRepair) return false;
    this.subStats.repairRate += 5;
    return true;
  }

  activateStealth() {
    if (!this.features.canStealth) return false;
    this.subStats.stealth += 15;
    this.attributes.isActive = true;
    return true;
  }

  getSummary() {
    return {
      name: this.details.name,
      level: this.details.level,
      power: this.stats.power,
      defense: this.stats.defense,
      rarity: this.attributes.rarity,
      location: this.attributes.location,
      isActive: this.attributes.isActive,
      techLevels: this.techLevels,
      researchLog: this.researchLog,
    };
  }
}
