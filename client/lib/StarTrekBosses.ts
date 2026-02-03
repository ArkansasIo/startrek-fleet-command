// StarTrekBosses.ts
// Canonical Star Trek bosses, villains, and major antagonists with names, titles, ranks, details, weapons, armors, shields, combat types, and classes

export type BossRank = 'Supreme Commander' | 'Queen' | 'Emperor' | 'General' | 'Admiral' | 'Warlord' | 'Overseer' | 'Leader' | 'Other';
export type BossCombatType = 'Tactical' | 'Psionic' | 'Technological' | 'Biological' | 'Diplomatic' | 'Stealth' | 'Brute Force' | 'Other';
export type BossClass = 'Attack' | 'Defense' | 'Support' | 'Hybrid';

export interface StarTrekBoss {
  name: string;
  title: string;
  rank: BossRank;
  species: string;
  description: string;
  weapons: string[];
  armors: string[];
  shields: string[];
  combatTypes: BossCombatType[];
  class: BossClass;
  appearances: string;
}

export const STAR_TREK_BOSSES: StarTrekBoss[] = [
  {
    name: 'The Borg Queen',
    title: 'Queen of the Borg Collective',
    rank: 'Queen',
    species: 'Borg',
    description: 'Central consciousness and leader of the Borg Collective.',
    weapons: ['Nanoprobes', 'Assimilation Tubules', 'Borg Drones'],
    armors: ['Borg Exoskeleton'],
    shields: ['Adaptive Borg Shields'],
    combatTypes: ['Technological', 'Psionic'],
    class: 'Hybrid',
    appearances: 'First Contact, VOY, PIC',
  },
  {
    name: 'Gul Dukat',
    title: 'Prefect of Bajor',
    rank: 'General',
    species: 'Cardassian',
    description: 'Ambitious Cardassian leader and major DS9 antagonist.',
    weapons: ['Cardassian Phaser', 'Tactical Planning'],
    armors: ['Cardassian Uniform'],
    shields: ['Personal Shield (occasional)'],
    combatTypes: ['Tactical', 'Diplomatic'],
    class: 'Attack',
    appearances: 'DS9',
  },
  {
    name: 'Khan Noonien Singh',
    title: 'Genetic Superhuman',
    rank: 'Warlord',
    species: 'Augment Human',
    description: 'Genetically engineered tyrant from the 20th century.',
    weapons: ['Superior Strength', 'Ceti Eel', 'Starship Reliant'],
    armors: ['Improvised Armor'],
    shields: ['None'],
    combatTypes: ['Brute Force', 'Tactical'],
    class: 'Attack',
    appearances: 'TOS: Space Seed, Star Trek II',
  },
  {
    name: 'Q',
    title: 'Omnipotent Trickster',
    rank: 'Other',
    species: 'Q Continuum',
    description: 'All-powerful being who tests and torments Starfleet crews.',
    weapons: ['Omnipotence', 'Reality Manipulation'],
    armors: ['None'],
    shields: ['Omniversal Shielding'],
    combatTypes: ['Psionic', 'Technological'],
    class: 'Support',
    appearances: 'TNG, DS9, VOY, PIC',
  },
  {
    name: 'General Chang',
    title: 'Klingon General',
    rank: 'General',
    species: 'Klingon',
    description: 'Scheming Klingon general and Shakespeare enthusiast.',
    weapons: ["Bat'leth", 'Disruptor', 'Bird-of-Prey'],
    armors: ['Klingon Battle Armor'],
    shields: ['Klingon Ship Shields'],
    combatTypes: ['Tactical', 'Brute Force'],
    class: 'Attack',
    appearances: 'Star Trek VI',
  },
  {
    name: 'Weyoun',
    title: 'Vorta Administrator',
    rank: 'Overseer',
    species: 'Vorta',
    description: 'Diplomatic and manipulative Dominion leader.',
    weapons: ["Jem'Hadar Guards", 'Disruptor'],
    armors: ['Vorta Uniform'],
    shields: ['Dominion Ship Shields'],
    combatTypes: ['Diplomatic', 'Tactical'],
    class: 'Support',
    appearances: 'DS9',
  },
  {
    name: 'Sela',
    title: 'Commander of the Romulan Military',
    rank: 'Supreme Commander',
    species: 'Romulan-Human',
    description: 'Ambitious Romulan leader, daughter of Tasha Yar.',
    weapons: ['Romulan Disruptor', 'Warbird'],
    armors: ['Romulan Uniform'],
    shields: ['Romulan Ship Shields'],
    combatTypes: ['Tactical', 'Stealth'],
    class: 'Attack',
    appearances: 'TNG',
  },
  {
    name: 'The Founders',
    title: 'Changelings',
    rank: 'Leader',
    species: 'Changeling',
    description: 'Shape-shifting rulers of the Dominion.',
    weapons: ['Shapeshifting', "Jem'Hadar Armies"],
    armors: ['Liquid Form'],
    shields: ['None'],
    combatTypes: ['Stealth', 'Biological'],
    class: 'Defense',
    appearances: 'DS9',
  },
  {
    name: 'Lore',
    title: 'Rogue Android',
    rank: 'Other',
    species: 'Android',
    description: "Data's evil twin, manipulative and dangerous.",
    weapons: ['Superhuman Strength', 'Emotion Chip'],
    armors: ['Android Body'],
    shields: ['None'],
    combatTypes: ['Technological', 'Tactical'],
    class: 'Attack',
    appearances: 'TNG',
  },
  {
    name: "V'Ger",
    title: 'Machine Entity',
    rank: 'Other',
    species: 'Machine',
    description: 'Vast, sentient machine seeking its creator.',
    weapons: ['Energy Cloud', 'Disintegration Beam'],
    armors: ['Energy Field'],
    shields: ['Impenetrable Energy Shield'],
    combatTypes: ['Technological'],
    class: 'Attack',
    appearances: 'Star Trek: The Motion Picture',
  },
  // ...add more as needed
];
