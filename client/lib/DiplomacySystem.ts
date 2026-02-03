// DiplomacySystem.ts
// Handles diplomatic relations, treaties, and wars

export type DiplomaticStatus = 'ally' | 'enemy' | 'neutral' | 'vassal' | 'overlord';

export interface DiplomaticRelation {
  id: string;
  player1Id: string;
  player2Id: string;
  status: DiplomaticStatus;
  establishedAt: number;
  lastModified: number;
  treatyId?: string;
  warDebt: number; // Resources owed
}

export interface Treaty {
  id: string;
  name: string;
  signatories: string[]; // Player IDs
  type: 'alliance' | 'non-aggression' | 'trade' | 'mutual-defense' | 'vassal';
  terms: TreatyTerm[];
  startDate: number;
  endDate?: number;
  status: 'active' | 'expired' | 'breached' | 'terminated';
  breachRestrictions?: string[];
}

export interface TreatyTerm {
  id: string;
  type: 'resource_sharing' | 'military_aid' | 'research_sharing' | 'tribute' | 'non-aggression';
  description: string;
  value?: number;
  duration?: number;
  enforced: boolean;
}

export interface DeclaredWar {
  id: string;
  declarerId: string;
  targetId: string;
  startedAt: number;
  endsAt?: number;
  reason: string;
  casualties: { [playerId: string]: number };
  systemsLost: { [playerId: string]: number };
  status: 'active' | 'ceasefire' | 'concluded';
  victoryCondition?: string;
  reparations?: { [playerId: string]: number };
}

export interface Diplomacy {
  playerId: string;
  relations: DiplomaticRelation[];
  treaties: Treaty[];
  wars: DeclaredWar[];
  reputation: number; // -100 to 100
  tributesOwed: Record<string, number>;
  tributesReceived: Record<string, number>;
}

// Create initial diplomacy record
export function createDiplomacy(playerId: string): Diplomacy {
  return {
    playerId,
    relations: [],
    treaties: [],
    wars: [],
    reputation: 0,
    tributesOwed: {},
    tributesReceived: {},
  };
}

// Propose alliance
export function proposeAlliance(
  initiatorId: string,
  targetId: string,
  duration: number = 30 * 24 * 60 * 60 * 1000 // 30 days
): Treaty {
  return {
    id: `treaty_${initiatorId}_${targetId}_${Date.now()}`,
    name: `Alliance between ${initiatorId} and ${targetId}`,
    signatories: [initiatorId, targetId],
    type: 'alliance',
    terms: [
      {
        id: 'mutual_defense',
        type: 'mutual-defense',
        description: 'Signatories will defend each other in war',
        enforced: false,
      },
    ],
    startDate: Date.now(),
    endDate: Date.now() + duration,
    status: 'active',
  };
}

// Propose non-aggression pact
export function proposeNonAggressionPact(
  initiatorId: string,
  targetId: string,
  duration: number = 14 * 24 * 60 * 60 * 1000
): Treaty {
  return {
    id: `nap_${initiatorId}_${targetId}_${Date.now()}`,
    name: `Non-Aggression Pact between ${initiatorId} and ${targetId}`,
    signatories: [initiatorId, targetId],
    type: 'non-aggression',
    terms: [
      {
        id: 'no_attack',
        type: 'non-aggression',
        description: 'Signatories agree not to attack each other',
        enforced: false,
      },
    ],
    startDate: Date.now(),
    endDate: Date.now() + duration,
    status: 'active',
  };
}

// Declare war
export function declareWar(
  declarerId: string,
  targetId: string,
  reason: string,
  duration: number = 7 * 24 * 60 * 60 * 1000
): {
  success: boolean;
  war?: DeclaredWar;
  message: string;
} {
  const war: DeclaredWar = {
    id: `war_${declarerId}_${targetId}_${Date.now()}`,
    declarerId,
    targetId,
    startedAt: Date.now(),
    endsAt: Date.now() + duration,
    reason,
    casualties: { [declarerId]: 0, [targetId]: 0 },
    systemsLost: { [declarerId]: 0, [targetId]: 0 },
    status: 'active',
  };

  return {
    success: true,
    war,
    message: `War declared against ${targetId}. Duration: ${duration / (24 * 60 * 60 * 1000)} days`,
  };
}

// Propose ceasefire
export function proposeCeasefire(
  war: DeclaredWar,
  proposerId: string,
  reparations?: Record<string, number>
): { success: boolean; message: string } {
  if (war.status !== 'active') {
    return { success: false, message: 'War is not active' };
  }

  return {
    success: true,
    message: `Ceasefire proposed with reparations: ${JSON.stringify(reparations || {})}`,
  };
}

// Accept ceasefire
export function acceptCeasefire(war: DeclaredWar): DeclaredWar {
  return {
    ...war,
    status: 'ceasefire',
  };
}

// Update reputation
export function updateReputation(
  diplomacy: Diplomacy,
  change: number,
  reason: string
): number {
  const newReputation = Math.max(-100, Math.min(100, diplomacy.reputation + change));
  return newReputation;
}

// Get diplomatic stance
export function getDiplomaticStance(reputation: number): {
  stance: string;
  modifier: number;
  description: string;
} {
  if (reputation >= 80) {
    return {
      stance: 'Esteemed',
      modifier: 1.5,
      description: 'Allied civilizations offer excellent terms',
    };
  } else if (reputation >= 40) {
    return {
      stance: 'Respected',
      modifier: 1.2,
      description: 'Most civilizations are friendly',
    };
  } else if (reputation >= 0) {
    return {
      stance: 'Neutral',
      modifier: 1.0,
      description: 'Normal relations with other civilizations',
    };
  } else if (reputation >= -40) {
    return {
      stance: 'Disliked',
      modifier: 0.8,
      description: 'Other civilizations are wary',
    };
  } else {
    return {
      stance: 'Despised',
      modifier: 0.5,
      description: 'Most civilizations will attack on sight',
    };
  }
}

// Check treaty breach
export function checkTreatyBreach(
  treaty: Treaty,
  actionType: string
): { breached: boolean; violatedTerms: string[] } {
  const violatedTerms: string[] = [];

  if (treaty.type === 'non-aggression' && actionType === 'attack') {
    violatedTerms.push('non-aggression');
  }

  if (treaty.type === 'alliance' && actionType === 'trade_favor_to_enemy') {
    violatedTerms.push('mutual-defense');
  }

  return {
    breached: violatedTerms.length > 0,
    violatedTerms,
  };
}

// Calculate tribute amount
export function calculateTribute(
  victimIncome: number,
  tributePercentage: number = 10
): number {
  return Math.floor(victimIncome * (tributePercentage / 100));
}

// Request military aid
export function requestMilitaryAid(
  requesterId: string,
  alliedPlayerId: string,
  threat: string
): {
  success: boolean;
  message: string;
} {
  return {
    success: true,
    message: `Military aid request sent to ${alliedPlayerId} regarding threat: ${threat}`,
  };
}
