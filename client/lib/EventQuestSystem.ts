// EventQuestSystem.ts
// Events and Quest system for dynamic gameplay

export type EventType =
  | 'combat'
  | 'exploration'
  | 'diplomacy'
  | 'discovery'
  | 'emergency'
  | 'rare'
  | 'seasonal';
export type QuestStatus = 'available' | 'accepted' | 'in_progress' | 'completed' | 'failed' | 'abandoned';
export type QuestDifficulty = 'trivial' | 'easy' | 'normal' | 'hard' | 'legendary';
export type EventSeverity = 'minor' | 'moderate' | 'major' | 'critical' | 'catastrophic';

export interface Event {
  id: string;
  name: string;
  description: string;
  type: EventType;
  severity: EventSeverity;
  affectedRegions: string[]; // Sector IDs
  startTime: number;
  duration: number; // milliseconds
  effects: {
    damageMultiplier?: number;
    resourceMultiplier?: number;
    combatModifier?: number;
    visibilityChange?: number;
  };
  rewards: {
    credits?: number;
    reputation?: number;
    resources?: Record<string, number>;
  };
  isActive: boolean;
  participantIds: string[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  giver: string; // NPC or faction name
  type: EventType;
  difficulty: QuestDifficulty;
  status: QuestStatus;
  sectorId: string;
  objectives: Objective[];
  rewards: {
    credits: number;
    experience: number;
    reputation: number;
    items?: string[];
    blueprints?: string[];
  };
  penalty?: {
    credits?: number;
    reputation?: number;
  };
  timeLimit?: number; // milliseconds
  acceptedBy?: string;
  acceptedAt?: number;
  completedAt?: number;
  failedAt?: number;
  progress: number; // 0-100
}

export interface Objective {
  id: string;
  description: string;
  type: 'kill' | 'deliver' | 'explore' | 'scan' | 'defend' | 'diplomatic' | 'collect' | 'discover';
  target: string; // Enemy type, location, item, etc.
  count?: number;
  currentCount: number;
  completed: boolean;
}

export interface QuestChain {
  id: string;
  name: string;
  quests: string[]; // Quest IDs in order
  description: string;
  faction: string;
  totalRewards: {
    credits: number;
    reputation: number;
    experience: number;
  };
  currentQuestIndex: number;
  completedQuests: string[];
  completedAt?: number;
}

export interface EventCycle {
  id: string;
  name: string;
  events: string[]; // Event IDs
  rotationPeriod: number; // milliseconds
  currentEventIndex: number;
  nextRotationTime: number;
  isActive: boolean;
}

// Create event
export function createEvent(
  name: string,
  type: EventType,
  severity: EventSeverity,
  affectedRegions: string[],
  duration: number = 3600000
): Event {
  return {
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    description: `A ${severity} ${type} event has occurred.`,
    type,
    severity,
    affectedRegions,
    startTime: Date.now(),
    duration,
    effects: generateEventEffects(severity),
    rewards: generateEventRewards(severity),
    isActive: true,
    participantIds: [],
  };
}

// Generate event effects based on severity
function generateEventEffects(severity: EventSeverity): Event['effects'] {
  const effects: Event['effects'] = {};

  switch (severity) {
    case 'minor':
      effects.resourceMultiplier = 1.1;
      break;
    case 'moderate':
      effects.resourceMultiplier = 1.25;
      effects.combatModifier = 0.95;
      break;
    case 'major':
      effects.resourceMultiplier = 1.5;
      effects.damageMultiplier = 1.2;
      effects.combatModifier = 0.85;
      break;
    case 'critical':
      effects.damageMultiplier = 1.5;
      effects.combatModifier = 0.75;
      effects.visibilityChange = -20;
      break;
    case 'catastrophic':
      effects.damageMultiplier = 2;
      effects.resourceMultiplier = 0.5;
      effects.combatModifier = 0.5;
      effects.visibilityChange = -50;
      break;
  }

  return effects;
}

// Generate event rewards
function generateEventRewards(severity: EventSeverity): Event['rewards'] {
  const baseCredits = {
    minor: 1000,
    moderate: 5000,
    major: 25000,
    critical: 100000,
    catastrophic: 500000,
  };

  return {
    credits: baseCredits[severity],
    reputation: {
      minor: 10,
      moderate: 50,
      major: 250,
      critical: 1000,
      catastrophic: 5000,
    }[severity],
    resources: {
      minerals:
        {
          minor: 100,
          moderate: 500,
          major: 2500,
          critical: 10000,
          catastrophic: 50000,
        }[severity],
    },
  };
}

// Create quest
export function createQuest(
  title: string,
  description: string,
  giver: string,
  type: EventType,
  difficulty: QuestDifficulty,
  sectorId: string,
  objectives: Objective[]
): Quest {
  const difficultyMultiplier = {
    trivial: 0.5,
    easy: 1,
    normal: 2,
    hard: 4,
    legendary: 8,
  }[difficulty];

  return {
    id: `quest_${Date.now()}`,
    title,
    description,
    giver,
    type,
    difficulty,
    status: 'available',
    sectorId,
    objectives,
    rewards: {
      credits: 1000 * difficultyMultiplier,
      experience: 500 * difficultyMultiplier,
      reputation: 50 * difficultyMultiplier,
    },
    progress: 0,
  };
}

// Accept quest
export function acceptQuest(quest: Quest, playerId: string): Quest {
  return {
    ...quest,
    status: 'accepted',
    acceptedBy: playerId,
    acceptedAt: Date.now(),
  };
}

// Update objective progress
export function updateObjectiveProgress(
  quest: Quest,
  objectiveId: string,
  count: number
): Quest {
  const updatedObjectives = quest.objectives.map((obj) => {
    if (obj.id === objectiveId) {
      const target = obj.count || 1;
      const completed = count >= target;
      return {
        ...obj,
        currentCount: Math.min(count, target),
        completed,
      };
    }
    return obj;
  });

  const completedObjectives = updatedObjectives.filter((o) => o.completed).length;
  const totalObjectives = updatedObjectives.length;
  const progress = Math.floor((completedObjectives / totalObjectives) * 100);

  return {
    ...quest,
    objectives: updatedObjectives,
    progress,
  };
}

// Complete quest
export function completeQuest(quest: Quest): Quest {
  return {
    ...quest,
    status: 'completed',
    completedAt: Date.now(),
  };
}

// Fail quest
export function failQuest(quest: Quest): Quest {
  return {
    ...quest,
    status: 'failed',
    failedAt: Date.now(),
  };
}

// Abandon quest
export function abandonQuest(quest: Quest): Quest {
  return {
    ...quest,
    status: 'abandoned',
    failedAt: Date.now(),
  };
}

// Create quest chain
export function createQuestChain(
  name: string,
  questIds: string[],
  faction: string
): QuestChain {
  return {
    id: `chain_${Date.now()}`,
    name,
    quests: questIds,
    description: `A quest chain from ${faction}`,
    faction,
    totalRewards: {
      credits: 50000,
      reputation: 5000,
      experience: 10000,
    },
    currentQuestIndex: 0,
    completedQuests: [],
  };
}

// Progress quest chain
export function progressQuestChain(chain: QuestChain, completedQuestId: string): QuestChain {
  const completedQuests = [...chain.completedQuests, completedQuestId];
  const nextIndex = Math.min(chain.currentQuestIndex + 1, chain.quests.length);

  return {
    ...chain,
    completedQuests,
    currentQuestIndex: nextIndex,
    completedAt: nextIndex >= chain.quests.length ? Date.now() : undefined,
  };
}

// Create event cycle
export function createEventCycle(name: string, eventIds: string[], rotationPeriod: number): EventCycle {
  return {
    id: `cycle_${Date.now()}`,
    name,
    events: eventIds,
    rotationPeriod,
    currentEventIndex: 0,
    nextRotationTime: Date.now() + rotationPeriod,
    isActive: true,
  };
}

// Rotate event cycle
export function rotateEventCycle(cycle: EventCycle): EventCycle {
  const nextIndex = (cycle.currentEventIndex + 1) % cycle.events.length;

  return {
    ...cycle,
    currentEventIndex: nextIndex,
    nextRotationTime: Date.now() + cycle.rotationPeriod,
  };
}

// Add participant to event
export function addEventParticipant(event: Event, playerId: string): Event {
  if (!event.participantIds.includes(playerId)) {
    event.participantIds.push(playerId);
  }
  return event;
}

// Check if event is active
export function isEventActive(event: Event): boolean {
  const elapsed = Date.now() - event.startTime;
  return event.isActive && elapsed < event.duration;
}

// Generate dynamic event
export function generateDynamicEvent(affectedRegions: string[]): Event {
  const types: EventType[] = ['combat', 'exploration', 'discovery', 'emergency', 'rare'];
  const severities: EventSeverity[] = ['minor', 'moderate', 'major', 'critical', 'catastrophic'];

  const type = types[Math.floor(Math.random() * types.length)];
  const severity = severities[Math.floor(Math.random() * severities.length)];

  const eventNames = {
    combat: ['Pirate Incursion', 'Fleet Engagement', 'Border Skirmish', 'Naval Battle'],
    exploration: ['Anomaly Discovered', 'New Territory Found', 'Unknown Signals', 'Spatial Distortion'],
    discovery: ['Ancient Artifact Found', 'Derelict Ship', 'Mysterious Signal', 'Resource Deposit'],
    emergency: ['Distress Signal', 'System Collapse', 'Natural Disaster', 'Equipment Failure'],
    rare: ['Supernova', 'Wormhole', 'Time Distortion', 'Quantum Anomaly'],
    diplomacy: ['Peace Summit', 'Trade Agreement', 'Alliance Formation', 'Negotiation'],
    seasonal: ['Solar Flare Season', 'Meteor Shower', 'Comet Passage', 'Ion Storm'],
  };

  const names = eventNames[type] || ['Unknown Event'];
  const name = names[Math.floor(Math.random() * names.length)];

  return createEvent(name, type, severity, affectedRegions, 1800000 + Math.random() * 3600000);
}

// Calculate quest difficulty rating
export function calculateQuestDifficultyRating(quest: Quest): number {
  const baseRating = {
    trivial: 1,
    easy: 5,
    normal: 10,
    hard: 20,
    legendary: 50,
  }[quest.difficulty];

  const objectiveMultiplier = quest.objectives.length * 0.5;
  const timeLimit = quest.timeLimit ? 1 + quest.timeLimit / 3600000 : 1;

  return baseRating * objectiveMultiplier * timeLimit;
}

// Get available quests for player
export function getAvailableQuests(
  quests: Quest[],
  playerLevel: number
): Quest[] {
  return quests.filter((q) => {
    if (q.status !== 'available') return false;

    const difficultyRating = calculateQuestDifficultyRating(q);
    const levelRange = playerLevel * 0.5;

    return difficultyRating > levelRange - 5 && difficultyRating < levelRange + 10;
  });
}

// Generate quest reward report
export function generateQuestRewardReport(quest: Quest): string {
  return `
╔════════════════════════════════════════════════════════════════╗
║                    QUEST REWARD REPORT                         ║
╚════════════════════════════════════════════════════════════════╝

QUEST: ${quest.title}
Difficulty: ${quest.difficulty.toUpperCase()}
Status: ${quest.status.toUpperCase()}

COMPLETION REWARDS:
  Credits: ${quest.rewards.credits.toLocaleString()}
  Experience: ${quest.rewards.experience}
  Reputation: ${quest.rewards.reputation}

${quest.rewards.items ? `ITEMS: ${quest.rewards.items.join(', ')}` : ''}
${quest.rewards.blueprints ? `BLUEPRINTS: ${quest.rewards.blueprints.join(', ')}` : ''}

${
  quest.penalty
    ? `
FAILURE PENALTY:
  ${quest.penalty.credits ? `Credits: -${quest.penalty.credits}` : ''}
  ${quest.penalty.reputation ? `Reputation: -${quest.penalty.reputation}` : ''}
`
    : ''
}

═══════════════════════════════════════════════════════════════════
`;
}

// Generate quest summary
export function generateQuestSummary(quests: Quest[]): string {
  const active = quests.filter((q) => q.status === 'in_progress').length;
  const completed = quests.filter((q) => q.status === 'completed').length;
  const failed = quests.filter((q) => q.status === 'failed').length;

  return `
╔════════════════════════════════════════════════════════════════╗
║                    QUEST SUMMARY                               ║
╚════════════════════════════════════════════════════════════════╝

Total Quests: ${quests.length}
  Active: ${active}
  Completed: ${completed}
  Failed: ${failed}
  Available: ${quests.filter((q) => q.status === 'available').length}

ACTIVE QUESTS:
${quests
  .filter((q) => q.status === 'in_progress')
  .map((q) => `  • ${q.title} [${q.progress}%]`)
  .join('\n')}

═══════════════════════════════════════════════════════════════════
`;
}
