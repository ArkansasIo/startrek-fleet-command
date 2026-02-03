// PlayerAccountSystem.ts
// Handles player registration, login, and progression

import { Player, createInitialPlayer } from "./MMORPGGameEngine";

export interface PlayerAccount extends Player {
  passwordHash: string;
  email?: string;
  createdAt: number;
  lastLogin: number;
}

export function registerPlayer(id: string, name: string, passwordHash: string, email?: string): PlayerAccount {
  const base = createInitialPlayer(id, name);
  return {
    ...base,
    passwordHash,
    email,
    createdAt: Date.now(),
    lastLogin: Date.now(),
  };
}

export function loginPlayer(account: PlayerAccount, passwordHash: string): boolean {
  if (account.passwordHash === passwordHash) {
    account.lastLogin = Date.now();
    return true;
  }
  return false;
}
