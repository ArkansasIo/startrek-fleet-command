# Game Systems Implementation Guide

## Overview
This document describes all the game systems that have been implemented for Star Trek Fleet Command Online.

## Implemented Systems

### 1. Fleet Movement System (`FleetMovementSystem.ts`)
**Purpose:** Manages fleet movement, positioning, and patrol routes.

**Key Features:**
- Create and manage fleets with multiple ships
- Calculate fleet speed (limited by slowest ship)
- Order fleet movement to destinations
- Calculate fuel consumption based on distance and fleet composition
- Create patrol routes with waypoints
- Merge and split fleets
- Calculate fleet attack/defense power
- Fleet morale system
- Maintenance costs per turn

**Key Functions:**
- `createFleet()` - Initialize a new fleet
- `orderFleetMovement()` - Send fleet to destination
- `calculateFuelConsumption()` - Determine fuel usage
- `createPatrolRoute()` - Set up automated patrols
- `mergeFleets()` / `splitFleet()` - Manage fleet composition

**Usage Example:**
```typescript
import { createFleet, orderFleetMovement } from './FleetMovementSystem';

const fleet = createFleet(playerId, "Enterprise Fleet", startLocation);
orderFleetMovement(fleet, destinationLocation);
```

---

### 2. PvP Combat System (`PvPCombatSystem.ts`)
**Purpose:** Handles player vs player combat with round-based mechanics.

**Key Features:**
- Round-based combat system
- Multiple action types: Aggressive, Balanced, Defensive
- Defense actions: Hold, Evasive, Counterattack, Retreat
- Damage calculation with modifiers
- Combat skills with cooldowns and costs
- Combat logging
- Combat result generation with loot
- Battle odds calculation
- Morale and crew system

**Combat Skills:**
- Focus Fire - +50% damage
- Evasive Maneuvers - Reduce damage by 40%
- Shield Overload - Reduce incoming damage to 30%
- Tractor Beam - 20% damage reduction with utility

**Key Functions:**
- `initiateCombat()` - Start engagement
- `processCombatRound()` - Resolve single round
- `calculateBattleOdds()` - Predict outcomes
- `generateCombatResult()` - Create final result

**Usage Example:**
```typescript
import { initiateCombat, processCombatRound } from './PvPCombatSystem';

const engagement = initiateCombat(attackerId, defenderId, fleet1, fleet2);
const round = processCombatRound(engagement, attackAction, defendAction);
```

---

### 3. Resource Gathering System (`ResourceGatheringSystem.ts`)
**Purpose:** Manages resource production, gathering, and inventory.

**Key Features:**
- Five resource types: Dilithium, Tritanium, Deuterium, Latinum, Credits
- Resource nodes with difficulty levels
- Harvesting missions with resistance encounters
- Production per turn with bonuses
- Storage management with upgrades
- Resource consumption and validation
- Gathering bonuses (temporary and permanent)
- Efficiency tracking
- Resource conversion/trading

**Key Functions:**
- `startHarvestingMission()` - Begin resource extraction
- `processProductionCycle()` - Generate resources
- `consumeResources()` - Use for construction/research
- `upgradeStorage()` - Increase capacity
- `applyGatheringBonus()` - Add production multipliers

**Usage Example:**
```typescript
import { createResourceProduction, processProductionCycle } from './ResourceGatheringSystem';

const production = createResourceProduction(playerId);
const produced = processProductionCycle(production, 1); // 1 hour
```

---

### 4. Building System (`BuildingSystem.ts`)
**Purpose:** Manages planetary and orbital structures.

**Key Features:**
- 8 building types: Mine, Factory, Lab, Barracks, Spaceport, Defense, Academy, Shipyard
- Progressive construction with time and resource requirements
- Building levels (max 20 for mines, 15 for labs, etc.)
- Construction queue (up to 5 parallel projects)
- Cost multiplier system (costs increase with level)
- Building repair system
- Building damage and efficiency
- Bonuses for specific building types
- Prerequisites and dependencies

**Building Types:**
1. **Dilithium Mine** - Produces dilithium (max level 20)
2. **Tritanium Factory** - Produces tritanium (max level 20)
3. **Research Lab** - Accelerates research (max level 15)
4. **Military Barracks** - Defense and training (max level 15)
5. **Space Station** - Fleet construction hub (max level 10)
6. **Planetary Shield** - Defense against attacks (max level 20)
7. **Starfleet Academy** - Officer training (max level 10)
8. **Advanced Shipyard** - High-tech ship construction (max level 10)

**Key Functions:**
- `startConstruction()` - Begin building project
- `completeConstruction()` - Finish project
- `cancelConstruction()` - Cancel with partial refund
- `addToConstructionQueue()` - Queue multiple projects
- `repairBuilding()` - Restore damaged structures

**Usage Example:**
```typescript
import { startConstruction, createConstructionQueue } from './BuildingSystem';

const project = startConstruction(playerId, 'dilithium_mine', locationId);
const queue = createConstructionQueue(playerId);
addToConstructionQueue(queue, project);
```

---

### 5. Research System (`ResearchSystem.ts`)
**Purpose:** Handles technology advancement and research projects.

**Key Features:**
- 7 research technologies with multiple paths
- 5 tiers of progression (common to legendary rarity)
- Research queue (up to 3 projects)
- Lab bonus system (25% faster per additional lab)
- Cost scaling with multipliers
- Research effects and stat bonuses
- Prerequisites and tech tree
- Temporary and permanent boosts

**Available Research:**
1. **Basic Warp Drive** - +20% ship speed per level
2. **Advanced Weapons** - +15% weapon damage per level
3. **Shield Technology** - +25% shield strength per level
4. **Resource Gathering** - +20% resource production per level
5. **Diplomatic Sciences** - +50% reputation gains per level
6. **Borg Defense** - Complete assimilation resistance
7. **Time Dilation Field** - Double research/construction speed

**Key Functions:**
- `startResearch()` - Begin research project
- `completeResearch()` - Finish and apply effects
- `addToResearchQueue()` - Add to queue
- `applyLabBonus()` - Increase research speed
- `getResearchBonus()` - Calculate active bonuses

**Usage Example:**
```typescript
import { startResearch, createResearchTree } from './ResearchSystem';

const tree = createResearchTree(playerId);
const project = startResearch(playerId, 'basic_warp_drive');
addToResearchQueue(tree, project);
```

---

### 6. Territory System (`TerritorySystem.ts`)
**Purpose:** Manages planets, colonies, and territorial control.

**Key Features:**
- 5 planet types: Terrestrial, Gas Giant, Ice, Desert, Volcanic
- Colony system with 5 maturity levels
- Population and morale management
- Colony buildings with production
- Planetary defenses
- Territory control and tax systems
- Production bonuses from buildings
- Territory conquest mechanics
- Alliance-friendly territories

**Key Functions:**
- `establishColony()` - Colonize a new planet
- `upgradeColony()` - Increase maturity level
- `addBuilding()` - Construct colony buildings
- `calculateColonyProduction()` - Determine output
- `calculateTaxIncome()` - Revenue from territories
- `contestTerritory()` - PvP territory control

**Usage Example:**
```typescript
import { establishColony, calculateColonyProduction } from './TerritorySystem';

const colony = establishColony(playerId, planetId, planetName);
const production = calculateColonyProduction(colony, planet);
```

---

### 7. Marketplace System (`MarketplaceSystem.ts`)
**Purpose:** Handles trading, marketplace, and economy.

**Key Features:**
- Player wallets with credits and latinum
- Market listings for items
- Trade offer system with expiration
- Price history and market statistics
- Supply/demand price adjustments
- Anti-scam fairness validation
- Transaction history
- Escrow system for pending trades

**Key Functions:**
- `createPlayerWallet()` - Initialize player finances
- `listMarketItem()` - Put item for sale
- `buyMarketItem()` - Purchase from marketplace
- `createTradeOffer()` - Propose direct trade
- `acceptTradeOffer()` - Accept trade terms
- `calculateMarketPrice()` - Dynamic pricing
- `getMarketStats()` - View market data

**Usage Example:**
```typescript
import { createPlayerWallet, listMarketItem } from './MarketplaceSystem';

const wallet = createPlayerWallet(playerId, 1000);
const listing = listMarketItem(playerId, item, price, quantity);
```

---

### 8. Diplomacy System (`DiplomacySystem.ts`)
**Purpose:** Manages diplomatic relations, alliances, and wars.

**Key Features:**
- Diplomatic relations with status tracking
- Alliance system with terms
- Non-aggression pacts
- War declaration with duration
- Ceasefire proposals with reparations
- Reputation system (-100 to 100)
- Diplomatic stances with modifiers
- Treaty breach detection
- Tribute system

**Diplomatic Status:**
- **Ally** - Allied faction, bonuses to trade/research
- **Enemy** - Active hostility
- **Neutral** - No special relations
- **Vassal** - Subordinate with tribute payments
- **Overlord** - Dominant with tributary benefits

**Key Functions:**
- `proposeAlliance()` - Start alliance
- `proposeNonAggressionPact()` - Create NAP
- `declareWar()` - Start formal war
- `proposeCeasefire()` - End conflict
- `updateReputation()` - Modify standing
- `getDiplomaticStance()` - Check status effects

**Usage Example:**
```typescript
import { proposeAlliance, declareWar } from './DiplomacySystem';

const treaty = proposeAlliance(playerId, targetId);
const war = declareWar(playerId, enemyId, reason);
```

---

### 9. Leaderboard System (`LeaderboardSystem.ts`)
**Purpose:** Tracks player progress, rankings, and achievements.

**Key Features:**
- Player statistics tracking
- Multiple leaderboards (level, power, battles, etc.)
- Achievement system (5+ achievements)
- Rank progression (5 ranks: Ensign to Admiral)
- Rank perks and salary
- Win rate calculation
- Power level calculation
- Trending indicators

**Achievement Examples:**
- **First Blood** - Win your first battle
- **War Hero** - Win 50 battles
- **Empire Builder** - Control 10 territories
- **Boss Slayer** - Defeat 10 bosses
- **Diplomat** - Form 5 alliances

**Ranks:**
1. **Ensign** - Level 1+
2. **Lieutenant** - Level 10+
3. **Commander** - Level 25+
4. **Captain** - Level 50+
5. **Admiral** - Level 100+

**Key Functions:**
- `createPlayerStats()` - Initialize player statistics
- `grantExperience()` - Award XP and handle level ups
- `getPlayerRank()` - Determine current rank
- `buildLeaderboards()` - Generate ranking lists
- `checkAchievements()` - Find unlocked achievements

**Usage Example:**
```typescript
import { createPlayerStats, grantExperience } from './LeaderboardSystem';

const stats = createPlayerStats(playerId, username);
const result = grantExperience(stats, 1000);
```

---

## System Integration

All systems are coordinated through a unified `GameSystemManager` exported from `GameSystems.ts`:

```typescript
import { createGameSystemManager } from './GameSystems';

const gameManager = createGameSystemManager();
await gameManager.processTurn(); // Processes all systems
await gameManager.saveGameState(); // Persists state
```

## Turn Processing Flow

Each game turn typically follows this sequence:

1. **Resource Production** - Generate resources from colonies and buildings
2. **Fleet Movement** - Execute pending movement orders
3. **Research Progress** - Advance research projects
4. **Construction Progress** - Build/repair structures
5. **Combat Resolution** - Resolve any active battles
6. **Diplomacy Updates** - Update relations and treaties
7. **Leaderboard Updates** - Record achievements and stats
8. **Economy Updates** - Process trades and transactions

## Performance Considerations

- Fleet calculations are optimized for 100+ ships per fleet
- Resource production uses batch processing for efficiency
- Combat rounds are limited to 50 maximum
- Leaderboards update daily, not per turn
- Queue processing is parallel where possible

## Future Enhancements

Potential systems to implement:

1. **Mission System** - Quest chains with rewards
2. **Minigames** - Space hacking, diplomacy puzzles
3. **Seasonal Events** - Limited-time challenges
4. **Guild Wars** - Large-scale alliance combat
5. **Exploration System** - Discovering new systems
6. **Trading Posts** - Permanent marketplace locations
7. **NPC Factions** - Dynamic NPC-controlled civilizations
8. **Salvage System** - Recover resources from destroyed ships

---

**Last Updated:** February 3, 2026
**Game Version:** 2.4.7
