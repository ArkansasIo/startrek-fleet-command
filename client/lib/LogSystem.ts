// LogSystem.ts
// Handles event, action, and system logs for players and game

export interface LogEntry {
  id: string;
  type: 'system' | 'combat' | 'resource' | 'alliance' | 'message' | 'custom';
  content: string;
  timestamp: number;
  playerId?: string;
}

export function createLogEntry(type: LogEntry['type'], content: string, playerId?: string): LogEntry {
  return {
    id: Math.random().toString(36).slice(2),
    type,
    content,
    timestamp: Date.now(),
    playerId,
  };
}

export function getPlayerLogs(logs: LogEntry[], playerId: string): LogEntry[] {
  return logs.filter(l => l.playerId === playerId);
}

export function getSystemLogs(logs: LogEntry[]): LogEntry[] {
  return logs.filter(l => l.type === 'system');
}
