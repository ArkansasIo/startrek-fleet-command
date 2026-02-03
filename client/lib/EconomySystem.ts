// EconomySystem.ts
// Handles trading, market, and resource exchange

import { Player } from "./MMORPGGameEngine";

export interface TradeOffer {
  id: string;
  from: string;
  to: string;
  offer: { [resource: string]: number };
  request: { [resource: string]: number };
  status: 'open' | 'accepted' | 'declined';
}

export function createTradeOffer(from: string, to: string, offer: any, request: any): TradeOffer {
  return {
    id: Math.random().toString(36).slice(2),
    from,
    to,
    offer,
    request,
    status: 'open',
  };
}

export function acceptTrade(offer: TradeOffer, players: Player[]): Player[] {
  const fromPlayer = players.find(p => p.id === offer.from);
  const toPlayer = players.find(p => p.id === offer.to);
  if (!fromPlayer || !toPlayer) return players;
  // Transfer resources
  Object.entries(offer.offer).forEach(([k, v]) => (fromPlayer.resources as any)[k] -= v);
  Object.entries(offer.offer).forEach(([k, v]) => (toPlayer.resources as any)[k] += v);
  Object.entries(offer.request).forEach(([k, v]) => (toPlayer.resources as any)[k] -= v);
  Object.entries(offer.request).forEach(([k, v]) => (fromPlayer.resources as any)[k] += v);
  offer.status = 'accepted';
  return players;
}
