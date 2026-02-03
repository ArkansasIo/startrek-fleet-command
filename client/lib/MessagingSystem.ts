// MessagingSystem.ts
// Handles player-to-player and system messaging

export interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: number;
  read: boolean;
  guildId?: string; // for guild messages
  admin?: boolean; // for admin/server messages
}

export function createMessage(id: string, from: string, to: string, content: string, opts?: { guildId?: string; admin?: boolean }): Message {
  return {
    id,
    from,
    to,
    content,
    timestamp: Date.now(),
    read: false,
    ...(opts || {}),
  };
}

export function markAsRead(message: Message): Message {
  return { ...message, read: true };
}

export function getUnreadMessages(messages: Message[], playerId: string): Message[] {
  return messages.filter(m => m.to === playerId && !m.read);
}
