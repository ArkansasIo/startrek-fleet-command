# Quick Reference - Game Systems API

## Import All Systems
```typescript
import * as GameSystems from './lib/GameSystems';
import {
  GamePlayer,
  initializeNewPlayer,
  processTurnForAllPlayers,
  initiateFleetAttack,
} from './lib/GameIntegration';
```

## Core Functions by System

### 🚀 Fleet Movement
```typescript
import {
  createFleet,
  addShipToFleet,
  orderFleetMovement,
  createPatrolRoute,
  mergeFleets,
  splitFleet,
  calculateFleetSpeed,
  calculateFleetAttack,
  calculateFleetDefense,
} from './lib/FleetMovementSystem';
```

### ⚔️ Combat
```typescript
import {
  initiateCombat,
  processCombatRound,
  endCombat,
  generateCombatResult,
  calculateBattleOdds,
} from './lib/PvPCombatSystem';
```

### 💎 Resources
```typescript
import {
  createResourceProduction,
  startHarvestingMission,
  executeHarvesting,
  processProductionCycle,
  consumeResources,
  upgradeStorage,
} from './lib/ResourceGatheringSystem';
```

### 🏗️ Buildings
```typescript
import {
  startConstruction,
  completeConstruction,
  cancelConstruction,
  createConstructionQueue,
  addToConstructionQueue,
  repairBuilding,
  calculateBuildingOutput,
} from './lib/BuildingSystem';
```

### 🔬 Research
```typescript
import {
  startResearch,
  completeResearch,
  createResearchTree,
  addToResearchQueue,
  applyLabBonus,
  getAvailableResearch,
  getResearchBonus,
} from './lib/ResearchSystem';
```

### 🌍 Territory
```typescript
import {
  establishColony,
  upgradeColony,
  addBuilding,
  calculateColonyProduction,
  createTerritory,
  calculateTaxIncome,
  contestTerritory,
} from './lib/TerritorySystem';
```

### 💰 Marketplace
```typescript
import {
  createPlayerWallet,
  listMarketItem,
  buyMarketItem,
  createTradeOffer,
  acceptTradeOffer,
  calculateMarketPrice,
  validateTradeFairness,
} from './lib/MarketplaceSystem';
```

### 🤝 Diplomacy
```typescript
import {
  createDiplomacy,
  proposeAlliance,
  proposeNonAggressionPact,
  declareWar,
  proposeCeasefire,
  updateReputation,
  getDiplomaticStance,
} from './lib/DiplomacySystem';
```

### 🏆 Leaderboards
```typescript
import {
  createPlayerStats,
  grantExperience,
  getPlayerRank,
  buildLeaderboards,
  checkAchievements,
  calculateWinRate,
  calculatePowerLevel,
} from './lib/LeaderboardSystem';
```

---

## Common Workflows

### Start a New Game
```typescript
const world = initializeGameWorld();
const player = initializeNewPlayer('player_1', 'CommanderName');
world.players.set(player.id, player);
```

### Build a Structure
```typescript
const project = startConstruction(
  playerId,
  'dilithium_mine',
  'homeworld_planet'
);
addToConstructionQueue(player.constructionQueue, project);
```

### Research Technology
```typescript
const research = startResearch(playerId, 'basic_warp_drive');
addToResearchQueue(player.research, research);
```

### Start Combat
```typescript
const combat = initiateCombat(
  player1.id, player2.id,
  fleet1, fleet2
);

const round = processCombatRound(
  combat,
  { type: 'aggressive', power: 80, riskLevel: 50 },
  { type: 'hold', power: 70 }
);
```

### Process Game Turn
```typescript
await processTurnForAllPlayers(world, 3600); // 1 hour
// All systems update automatically
```

### Manage Diplomacy
```typescript
const alliance = proposeAlliance(player1Id, player2Id);
updateDiplomaticRelations(player1, player2, 'ally');
```

### Trade Resources
```typescript
const listing = listMarketItem(
  playerId,
  { id: 'dil_1', type: 'resource', name: 'Dilithium' },
  100, // price per unit
  500  // quantity
);

const result = buyMarketItem(
  buyerId, listing, 100, buyerWallet
);
```

---

## Configuration Constants

### Resource Types
```typescript
type ResourceType = 'dilithium' | 'tritanium' | 'deuterium' | 'latinum' | 'credits';
```

### Building Types
```typescript
type BuildingType = 'mine' | 'factory' | 'lab' | 'barracks' | 
                    'spaceport' | 'defense' | 'academy' | 'shipyard';
```

### Diplomatic Status
```typescript
type DiplomaticStatus = 'ally' | 'enemy' | 'neutral' | 'vassal' | 'overlord';
```

### Combat Actions
```typescript
type AttackType = 'aggressive' | 'balanced' | 'defensive';
type DefenseType = 'hold' | 'evasive' | 'counterattack' | 'retreat';
```

---

## Performance Tips

1. **Batch Operations** - Process multiple turns at once
2. **Queue Management** - Use construction/research queues
3. **Lazy Evaluation** - Calculate bonuses only when needed
4. **Caching** - Store frequently accessed data
5. **Async Processing** - Process long operations asynchronously

---

## Debug Helpers

### Get Player Status
```typescript
const power = calculatePowerLevel(player.stats);
const rank = getPlayerRank(player.stats);
console.log(`${player.username}: Rank ${rank.name}, Power ${power}`);
```

### Get Fleet Info
```typescript
player.fleets.forEach(fleet => {
  console.log(`Fleet: ${fleet.name}`);
  console.log(`Ships: ${fleet.ships.length}`);
  console.log(`Speed: ${fleet.speed}`);
  console.log(`Fuel: ${fleet.fuel}/${fleet.maxFuel}`);
  console.log(`Morale: ${fleet.morale}%`);
});
```

### Check Resources
```typescript
const efficiency = calculateEfficiency(player.resources);
console.log('Storage Usage:', efficiency);
const warnings = getResourceWarnings(player.resources);
warnings.forEach(w => console.warn(w));
```

### Monitor Construction
```typescript
player.constructionQueue.projects.forEach(proj => {
  console.log(
    `${proj.buildingType}: ${proj.progress}% (ETA: ${proj.completionTime}ms)`
  );
});
```

---

## Error Handling Patterns

```typescript
// Resource Check
const { success, message } = consumeResources(
  player.resources,
  { dilithium: 500, credits: 1000 }
);
if (!success) {
  console.error(`Cannot build: ${message}`);
  return;
}

// Construction
const { success, project, costRequired } = startConstruction(
  playerId, buildingId, locationId
);
if (!success) {
  console.error('Construction failed:', costRequired);
  return;
}

// Combat
const odds = calculateBattleOdds(fleet1Attack, fleet2Attack);
if (odds.attackerWinChance < 30) {
  console.warn('Risky engagement - proceed with caution');
}
```

---

## Data Persistence

### Save State
```typescript
const playerJson = serializePlayerState(player);
// Send to database
await saveToDatabase(playerId, playerJson);
```

### Load State
```typescript
const playerJson = await loadFromDatabase(playerId);
const player = deserializePlayerState(playerJson, playerId, username);
```

---

## Event Hooks (When Implemented)

```typescript
// Combat events
onCombatStart: (combat) => {}
onCombatRound: (combat, round) => {}
onCombatEnd: (combat, result) => {}

// Construction events
onBuildingStarted: (project) => {}
onBuildingCompleted: (building) => {}

// Research events
onResearchStarted: (project) => {}
onResearchCompleted: (research) => {}

// Diplomacy events
onAllianceFormed: (treaty) => {}
onWarDeclared: (war) => {}
onTreatyBreach: (breach) => {}
```

---

## Resources & Documentation

- **Full Guide:** See `GAME_SYSTEMS_GUIDE.md`
- **Implementation Details:** See `IMPLEMENTATION_SUMMARY.md`
- **Type Definitions:** See individual `*.ts` files
- **Integration Example:** See `GameIntegration.ts`

---

**Last Updated:** February 3, 2026  
**Game Version:** 2.4.7
