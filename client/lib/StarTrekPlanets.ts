// StarTrekPlanets.ts
// Canonical Star Trek planets, moons, biomes, types, classes, sizes, names, ranks, and details

  | 'Desert'
  | 'Forest'
  | 'Oceanic'
  | 'Arctic'
  | 'Volcanic'
  | 'Gas Giant'
  | 'Rocky'
  | 'City'
  | 'Jungle'
  | 'Swamp'
  | 'Mountain'
  | 'Tundra'
  | 'Savannah'
  | 'Ice'
  | 'Mixed'
  | 'Tropical';

export type PlanetClass =
  | 'M' // Earth-like
  | 'L' // Marginally habitable
  | 'Y' // Demon class
  | 'D' // Small, rocky, barren
  | 'H' // Uninhabitable, harsh
  | 'K' // Adaptable, marginal
  | 'J' // Gas giant
  | 'T' // Gas supergiant
  | 'N' // Reducing atmosphere
  | 'P' // Glaciated
  | 'R' // Rogue
  | 'Other';

export interface StarTrekPlanet {
  name: string;
  type: 'Planet' | 'Moon';
  class: PlanetClass;
  biome: PlanetBiome;
  size: 'Small' | 'Medium' | 'Large' | 'Super';
  rank: 'Common' | 'Notable' | 'Famous' | 'Legendary';
  system: string;
  sector: string;
  description: string;
  appearances: string;
}

export const STAR_TREK_PLANETS: StarTrekPlanet[] = [
  {
    name: 'Earth',
    type: 'Planet',
    class: 'M',
    biome: 'Mixed',
    size: 'Large',
    rank: 'Legendary',
    system: 'Sol',
    sector: 'Sector 001',
    description: 'Homeworld of humanity and founding member of the Federation.',
    appearances: 'All series and movies',
  },
  {
    name: 'Vulcan',
    type: 'Planet',
    class: 'M',
    biome: 'Desert',
    size: 'Large',
    rank: 'Legendary',
    system: '40 Eridani',
    sector: 'Vulcan Sector',
    description: 'Homeworld of the Vulcan species, known for logic and science.',
    appearances: 'TOS, TNG, ENT, Movies',
  },
  {
    name: 'Qo\'noS',
    type: 'Planet',
    class: 'M',
    biome: 'Forest',
    size: 'Large',
    rank: 'Legendary',
    system: 'Qo\'noS System',
    sector: 'Klingon Empire',
    description: 'Homeworld of the Klingon Empire.',
    appearances: 'TOS, TNG, DS9, Movies',
  },
  {
    name: 'Romulus',
    type: 'Planet',
    class: 'M',
    biome: 'Forest',
    size: 'Large',
    rank: 'Legendary',
    system: 'Romulus System',
    sector: 'Romulan Star Empire',
    description: 'Homeworld of the Romulans.',
    appearances: 'TOS, TNG, DS9, Movies',
  },
  {
    name: 'Risa',
    type: 'Planet',
    class: 'M',
    biome: 'Tropical',
    size: 'Medium',
    rank: 'Famous',
    system: 'Epsilon Ceti',
    sector: 'Risa Sector',
    description: 'Resort planet known for pleasure and relaxation.',
    appearances: 'TNG, DS9, ENT',
  },
  {
    name: 'Bajor',
    type: 'Planet',
    class: 'M',
    biome: 'Mixed',
    size: 'Large',
    rank: 'Famous',
    system: 'Bajoran System',
    sector: 'Bajoran Sector',
    description: 'Homeworld of the Bajorans, near the Bajoran Wormhole.',
    appearances: 'DS9',
  },
  {
    name: 'Cardassia Prime',
    type: 'Planet',
    class: 'M',
    biome: 'City',
    size: 'Large',
    rank: 'Famous',
    system: 'Cardassia System',
    sector: 'Cardassian Union',
    description: 'Homeworld of the Cardassians.',
    appearances: 'DS9, TNG',
  },
  {
    name: 'Andoria',
    type: 'Planet',
    class: 'M',
    biome: 'Arctic',
    size: 'Medium',
    rank: 'Famous',
    system: 'Andorian System',
    sector: 'Andorian Sector',
    description: 'Icy homeworld of the Andorians.',
    appearances: 'ENT, TOS, TNG',
  },
  {
    name: 'Delta Vega',
    type: 'Planet',
    class: 'H',
    biome: 'Arctic',
    size: 'Medium',
    rank: 'Notable',
    system: 'Delta Vega System',
    sector: 'Unknown',
    description: 'Remote, icy planet near the galactic barrier.',
    appearances: 'TOS, Star Trek (2009)',
  },
  {
    name: 'Genesis Planet',
    type: 'Planet',
    class: 'M',
    biome: 'Mixed',
    size: 'Medium',
    rank: 'Notable',
    system: 'Mutara Sector',
    sector: 'Mutara Sector',
    description: 'Artificially created planet by the Genesis Device.',
    appearances: 'Star Trek II & III',
  },
  {
    name: 'Wolf 359',
    type: 'Planet',
    class: 'D',
    biome: 'Rocky',
    size: 'Small',
    rank: 'Notable',
    system: 'Wolf 359 System',
    sector: 'Wolf Sector',
    description: 'Site of a major battle with the Borg.',
    appearances: 'TNG: The Best of Both Worlds',
  },
  {
    name: 'Nimbus III',
    type: 'Planet',
    class: 'L',
    biome: 'Desert',
    size: 'Medium',
    rank: 'Notable',
    system: 'Nimbus System',
    sector: 'Neutral Zone',
    description: 'The "Planet of Galactic Peace" in the Neutral Zone.',
    appearances: 'Star Trek V',
  },
  {
    name: 'Luna',
    type: 'Moon',
    class: 'M',
    biome: 'Rocky',
    size: 'Small',
    rank: 'Famous',
    system: 'Sol',
    sector: 'Sector 001',
    description: 'Earth’s moon, home to several Starfleet facilities.',
    appearances: 'TOS, TNG, DS9, VOY',
  },
  {
    name: 'Remus',
    type: 'Moon',
    class: 'H',
    biome: 'Rocky',
    size: 'Medium',
    rank: 'Famous',
    system: 'Romulus System',
    sector: 'Romulan Star Empire',
    description: 'Twin world to Romulus, home to the Remans.',
    appearances: 'Star Trek: Nemesis',
  },
  {
    name: 'Praxis',
    type: 'Moon',
    class: 'D',
    biome: 'Volcanic',
    size: 'Small',
    rank: 'Notable',
    system: 'Qo\'noS System',
    sector: 'Klingon Empire',
    description: 'Klingon moon destroyed in a mining accident.',
    appearances: 'Star Trek VI',
  },
  {
    name: 'Io',
    type: 'Moon',
    class: 'D',
    biome: 'Volcanic',
    size: 'Small',
    rank: 'Notable',
    system: 'Sol',
    sector: 'Sector 001',
    description: 'Volcanic moon of Jupiter.',
    appearances: 'TOS, TNG',
  },
  {
    name: 'Bajor VIII',
    type: 'Moon',
    class: 'M',
    biome: 'Forest',
    size: 'Small',
    rank: 'Notable',
    system: 'Bajoran System',
    sector: 'Bajoran Sector',
    description: 'One of Bajor’s inhabited moons.',
    appearances: 'DS9',
  },
  // ...add more as needed
];
