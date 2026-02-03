// MarketplaceSystem.ts
// Handles trading, marketplace, and economy systems

export interface TradeItem {
  id: string;
  name: string;
  type: 'resource' | 'ship' | 'equipment' | 'technology';
  basePrice: number;
  quantity: number;
  sellerId?: string;
  buyerId?: string;
  status: 'listed' | 'sold' | 'pending';
}

export interface TradeOffer {
  id: string;
  offererId: string;
  targetId: string;
  offering: TradeItem[];
  requesting: TradeItem[];
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  expiresAt: number;
}

export interface MarketListing {
  id: string;
  sellerId: string;
  item: TradeItem;
  price: number;
  quantity: number;
  listedAt: number;
  expiresAt: number;
  status: 'active' | 'sold' | 'expired';
}

export interface PlayerWallet {
  playerId: string;
  credits: number;
  latinum: number;
  escrow: number; // For pending trades
  transactionHistory: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'trade' | 'gift';
  amount: number;
  fromPlayerId: string;
  toPlayerId: string;
  itemId?: string;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
}

// Create initial marketplace
export function initializeMarketplace() {
  return {
    listings: [] as MarketListing[],
    tradeOffers: [] as TradeOffer[],
    transactionHistory: [] as Transaction[],
    priceHistory: {} as Record<string, number[]>,
  };
}

// Create player wallet
export function createPlayerWallet(playerId: string, initialCredits: number = 1000): PlayerWallet {
  return {
    playerId,
    credits: initialCredits,
    latinum: 100,
    escrow: 0,
    transactionHistory: [],
  };
}

// List item on marketplace
export function listMarketItem(
  sellerId: string,
  item: TradeItem,
  price: number,
  quantity: number,
  expirationDays: number = 7
): MarketListing {
  return {
    id: `listing_${Date.now()}`,
    sellerId,
    item: { ...item, quantity },
    price,
    quantity,
    listedAt: Date.now(),
    expiresAt: Date.now() + expirationDays * 24 * 60 * 60 * 1000,
    status: 'active',
  };
}

// Buy from marketplace
export function buyMarketItem(
  buyerId: string,
  listing: MarketListing,
  quantity: number,
  wallet: PlayerWallet
): { success: boolean; transaction?: Transaction; message: string } {
  const totalCost = listing.price * quantity;

  if (wallet.credits < totalCost) {
    return { success: false, message: 'Insufficient credits' };
  }

  if (listing.quantity < quantity) {
    return { success: false, message: 'Insufficient quantity available' };
  }

  const transaction: Transaction = {
    id: `txn_${Date.now()}`,
    type: 'buy',
    amount: totalCost,
    fromPlayerId: buyerId,
    toPlayerId: listing.sellerId,
    itemId: listing.item.id,
    timestamp: Date.now(),
    status: 'completed',
  };

  return { success: true, transaction, message: 'Item purchased successfully' };
}

// Make trade offer
export function createTradeOffer(
  offererId: string,
  targetId: string,
  offering: TradeItem[],
  requesting: TradeItem[],
  expirationHours: number = 24
): TradeOffer {
  return {
    id: `offer_${Date.now()}`,
    offererId,
    targetId,
    offering,
    requesting,
    status: 'pending',
    expiresAt: Date.now() + expirationHours * 60 * 60 * 1000,
  };
}

// Accept trade offer
export function acceptTradeOffer(
  offer: TradeOffer,
  accepterId: string
): { success: boolean; message: string } {
  if (offer.targetId !== accepterId) {
    return { success: false, message: 'You are not the target of this offer' };
  }

  if (offer.status !== 'pending') {
    return { success: false, message: 'This offer is no longer available' };
  }

  return { success: true, message: 'Trade offer accepted' };
}

// Calculate dynamic price based on supply/demand
export function calculateMarketPrice(
  basePrice: number,
  supplyLevel: number,
  demandLevel: number
): number {
  // Supply/demand ratio affects price
  const ratio = demandLevel / (supplyLevel || 1);
  const priceMultiplier = Math.max(0.5, Math.min(2.0, ratio));
  return Math.floor(basePrice * priceMultiplier);
}

// Get market statistics
export function getMarketStats(listings: MarketListing[], itemType: string) {
  const relevantListings = listings.filter(
    (l) => l.item.type === itemType && l.status === 'active'
  );

  if (relevantListings.length === 0) {
    return { averagePrice: 0, minPrice: 0, maxPrice: 0, quantity: 0 };
  }

  const prices = relevantListings.map((l) => l.price);
  const totalQuantity = relevantListings.reduce((sum, l) => sum + l.quantity, 0);

  return {
    averagePrice: prices.reduce((a, b) => a + b, 0) / prices.length,
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    quantity: totalQuantity,
  };
}

// Validate trade fairness (anti-scam check)
export function validateTradeFairness(
  offeringValue: number,
  requestingValue: number,
  tolerance: number = 0.2 // Allow 20% variance
): { fair: boolean; ratio: number } {
  const ratio = offeringValue / (requestingValue || 1);
  const fair = ratio >= 1 - tolerance && ratio <= 1 + tolerance;
  return { fair, ratio };
}
