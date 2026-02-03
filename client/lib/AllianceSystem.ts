// AllianceSystem.ts
// Handles alliances/guilds, diplomacy, and alliance actions

export interface Alliance {
  id: string;
  name: string;
  members: string[]; // player ids
  description: string;
  log: string[];
  diplomacy: { [allianceId: string]: 'ally' | 'war' | 'neutral' };
}

export function createAlliance(id: string, name: string, description = ""): Alliance {
  return {
    id,
    name,
    members: [],
    description,
    log: [],
    diplomacy: {},
  };
}

export function addMember(alliance: Alliance, playerId: string): Alliance {
  if (!alliance.members.includes(playerId)) {
    return { ...alliance, members: [...alliance.members, playerId], log: [...alliance.log, `Player ${playerId} joined.`] };
  }
  return alliance;
}

export function removeMember(alliance: Alliance, playerId: string): Alliance {
  return { ...alliance, members: alliance.members.filter(id => id !== playerId), log: [...alliance.log, `Player ${playerId} left.`] };
}

export function setDiplomacy(alliance: Alliance, targetId: string, status: 'ally' | 'war' | 'neutral'): Alliance {
  return { ...alliance, diplomacy: { ...alliance.diplomacy, [targetId]: status }, log: [...alliance.log, `Diplomacy with ${targetId} set to ${status}`] };
}
