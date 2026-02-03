// StarTrekStarships.ts
// Canonical Star Trek starships, types, classes, and motherships from all shows and movies

export type StarshipType =
  | 'Explorer'
  | 'Battlecruiser'
  | 'Science Vessel'
  | 'Scout'
  | 'Transport'
  | 'Warbird'
  | 'Dreadnought'
  | 'Carrier'
  | 'Mothership'
  | 'Freighter'
  | 'Medical'
  | 'Shuttle'
  | 'Runabout'
  | 'Other';

export interface StarTrekStarship {
  name: string;
  registry?: string;
  class: string;
  type: StarshipType;
  faction: string;
  mothership?: string;
  description: string;
  appearances: string;
}

export const STAR_TREK_STARSHIPS: StarTrekStarship[] = [
  {
    name: 'USS Enterprise (NCC-1701)',
    registry: 'NCC-1701',
    class: 'Constitution',
    type: 'Explorer',
    faction: 'Federation',
    description: 'Legendary Federation starship, flagship of Starfleet.',
    appearances: 'TOS, Movies I-VI',
  },
  {
    name: 'USS Enterprise (NCC-1701-D)',
    registry: 'NCC-1701-D',
    class: 'Galaxy',
    type: 'Explorer',
    faction: 'Federation',
    description: 'Flagship of the Federation in the 24th century.',
    appearances: 'TNG, Generations',
  },
  {
    name: 'USS Voyager (NCC-74656)',
    registry: 'NCC-74656',
    class: 'Intrepid',
    type: 'Explorer',
    faction: 'Federation',
    description: 'Starfleet ship stranded in the Delta Quadrant.',
    appearances: 'VOY',
  },
  {
    name: 'USS Defiant (NX-74205)',
    registry: 'NX-74205',
    class: 'Defiant',
    type: 'Battlecruiser',
    faction: 'Federation',
    description: 'Tough, heavily armed escort ship.',
    appearances: 'DS9, First Contact',
  },
  {
    name: 'USS Discovery (NCC-1031)',
    registry: 'NCC-1031',
    class: 'Crossfield',
    type: 'Science Vessel',
    faction: 'Federation',
    description: 'Experimental ship with spore drive.',
    appearances: 'DIS',
  },
  {
    name: 'USS Excelsior (NCC-2000)',
    registry: 'NCC-2000',
    class: 'Excelsior',
    type: 'Explorer',
    faction: 'Federation',
    description: 'Prototype for a new class of starships.',
    appearances: 'Movies III-VI, VOY',
  },
  {
    name: 'USS Reliant (NCC-1864)',
    registry: 'NCC-1864',
    class: 'Miranda',
    type: 'Science Vessel',
    faction: 'Federation',
    description: 'Versatile science and patrol ship.',
    appearances: 'Star Trek II',
  },
  {
    name: 'USS Prometheus (NX-59650)',
    registry: 'NX-59650',
    class: 'Prometheus',
    type: 'Battlecruiser',
    faction: 'Federation',
    description: 'Experimental multi-vector assault ship.',
    appearances: 'VOY: Message in a Bottle',
  },
  {
    name: 'USS Pasteur (NCC-58925)',
    registry: 'NCC-58925',
    class: 'Olympic',
    type: 'Medical',
    faction: 'Federation',
    description: 'Medical ship commanded by Beverly Crusher in an alternate future.',
    appearances: 'TNG: All Good Things...',
  },
  {
    name: 'USS Grissom (NCC-638)',
    registry: 'NCC-638',
    class: 'Oberth',
    type: 'Science Vessel',
    faction: 'Federation',
    description: 'Science survey ship.',
    appearances: 'Star Trek III',
  },
  {
    name: 'Borg Cube',
    class: 'Cube',
    type: 'Mothership',
    faction: 'Borg Collective',
    description: 'Massive, nearly invulnerable Borg vessel.',
    appearances: 'TNG, VOY, First Contact',
  },
  {
    name: 'Borg Sphere',
    class: 'Sphere',
    type: 'Carrier',
    faction: 'Borg Collective',
    mothership: 'Borg Cube',
    description: 'Smaller, fast Borg vessel launched from Cubes.',
    appearances: 'First Contact, VOY',
  },
  {
    name: 'Romulan Warbird',
    class: "D'deridex",
    type: 'Warbird',
    faction: 'Romulan Star Empire',
    description: 'Iconic Romulan capital ship.',
    appearances: 'TNG, DS9',
  },
  {
    name: 'Scimitar',
    class: 'Scimitar',
    type: 'Dreadnought',
    faction: 'Reman',
    description: 'Reman superweapon with thalaron radiation.',
    appearances: 'Star Trek: Nemesis',
  },
  {
    name: 'Klingon Bird-of-Prey',
    class: 'Bird-of-Prey',
    type: 'Scout',
    faction: 'Klingon Empire',
    description: 'Versatile Klingon warship with cloaking device.',
    appearances: 'TOS, Movies, TNG, DS9, VOY',
  },
  {
    name: "IKS Negh'Var",
    class: "Negh'Var",
    type: 'Battlecruiser',
    faction: 'Klingon Empire',
    description: 'Klingon flagship and largest warship.',
    appearances: 'DS9',
  },
  {
    name: "Jem'Hadar Battleship",
    class: 'Battleship',
    type: 'Dreadnought',
    faction: 'Dominion',
    description: 'Massive Dominion warship.',
    appearances: 'DS9',
  },
  {
    name: 'Cardassian Galor-class',
    class: 'Galor',
    type: 'Battlecruiser',
    faction: 'Cardassian Union',
    description: 'Mainstay of the Cardassian fleet.',
    appearances: 'TNG, DS9',
  },
  {
    name: 'Ferengi Marauder',
    class: "D'Kora",
    type: 'Freighter',
    faction: 'Ferengi Alliance',
    description: 'Large, heavily armed Ferengi ship.',
    appearances: 'TNG, DS9',
  },
  {
    name: 'USS Runabout (Rio Grande)',
    class: 'Danube',
    type: 'Runabout',
    faction: 'Federation',
    description: 'Versatile small craft used by DS9 crew.',
    appearances: 'DS9',
  },
  {
    name: 'Type-6 Shuttlecraft',
    class: 'Type-6',
    type: 'Shuttle',
    faction: 'Federation',
    description: 'Standard Starfleet shuttlecraft.',
    appearances: 'TNG, DS9, VOY',
  },
  {
    name: 'USS Franklin (NX-326)',
    registry: 'NX-326',
    class: 'Franklin',
    type: 'Scout',
    faction: 'Federation',
    description: 'Early Federation warp 4 ship.',
    appearances: 'Star Trek Beyond',
  },
  {
    name: 'Narada',
    class: 'Narada',
    type: 'Mothership',
    faction: 'Romulan (Alt Timeline)',
    description: 'Massive mining ship turned superweapon.',
    appearances: 'Star Trek (2009)',
  },
  {
    name: 'USS Shenzhou (NCC-1227)',
    registry: 'NCC-1227',
    class: 'Walker',
    type: 'Explorer',
    faction: 'Federation',
    description: 'Starfleet ship under Captain Georgiou.',
    appearances: 'DIS',
  },
  // ...add more as needed
];
