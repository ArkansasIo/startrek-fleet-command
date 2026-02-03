# Fleet Combat System Guide

## Overview

The Fleet Combat System provides comprehensive fleet-to-fleet combat mechanics with three advanced transit methods: **Stargate**, **Jump Gate**, and **Hyperspace Routes**. Similar to the Planetary Combat System but for spacefaring combat encounters.

**Key Features:**
- Round-based fleet combat (up to 50 rounds)
- 3 transit methods with unique mechanics
- Combat reports (incoming/outgoing)
- Fleet engagement statistics
- 6 fleet mission types
- Real-time combat log generation

---

## Fleet Combat Mechanics

### Creating Fleet Combat

```typescript
// Create a fleet combat mission
const fleetCombat = createFleetCombat(
  'player_1',                    // Attacker ID
  'player_2',                    // Defender ID
  'fleet_attack_001',            // Attack fleet ID
  'attack',                      // Mission type
  'stargate',                    // Transit method
  {
    x: 1000,
    y: 2000,
    z: 500,
    sectorId: 'Alpha-Quadrant'
  },
  5000                          // Travel time in ms
);

// Result:
// {
//   id: "combat_1707123456789_abc123",
//   attackerId: "player_1",
//   defenderId: "player_2",
//   attackFleetId: "fleet_attack_001",
//   status: "pending",
//   missionType: "attack",
//   transitMethod: "stargate",
//   location: { x: 1000, y: 2000, z: 500, sectorId: "Alpha-Quadrant" },
//   launchedAt: 1707123456789,
//   arrivalTime: 1707123461789,
//   rounds: []
// }
```

### Fleet Mission Types

| Type | Purpose | Effects |
|------|---------|---------|
| **attack** | Direct fleet engagement | High damage, destroy enemy ships |
| **defend** | Protect allied fleet | Reduced damage taken, bonuses |
| **escort** | Protect transport fleet | Support role, defensive bonus |
| **blockade** | Prevent movement | Ongoing pressure, no decisive victory |
| **patrol** | Area control | Detection of enemy movements |
| **intercept** | Stop enemy mission | Head-off enemy fleet in transit |

### Executing Fleet Combat

```typescript
const fleet = {
  ships: [
    { class: 'battleship', hp: 100, power: 50 },
    { class: 'cruiser', hp: 50, power: 30 },
    { class: 'fighter', hp: 20, power: 15 }
  ],
  totalPower: 500,
  defenseRating: 60,
  crewCount: 5000,
  totalValue: 500000
};

const combat = executeFleetCombat(
  fleetCombat,
  attackerFleet,
  defenderFleet,
  50  // Max rounds
);

// Combat executes in rounds:
// Round 1-50: Ships exchange fire
// Each round: damage calculation, ship destruction, casualties
// Combat ends when: one fleet destroyed OR max rounds reached
```

### Combat Round Structure

Each combat round contains:

```typescript
interface CombatRound {
  roundNumber: number;              // Which round (1-50)
  timestamp: number;                // When it occurred
  attackerActions: FleetAction[];   // What attacker ships did
  defenderActions: FleetAction[];   // What defender ships did
  damageDealt: {
    toAttacker: number;            // Damage taken by attacker
    toDefender: number;            // Damage taken by defender
  };
  shipsDestroyed: {
    attacker: number;              // Ships destroyed
    defender: number;              // Ships destroyed
  };
  summary: string;                  // Narrative summary
}
```

### Fleet Actions

Each ship class can perform different actions:

```typescript
interface FleetAction {
  type: 'attack' | 'focus_fire' | 'evasive_maneuver' | 'support_fire' | 'defend';
  shipClass: string;               // "battleship", "cruiser", "fighter"
  damage: number;                  // Damage dealt (0-70 per round)
  accuracy: number;                // Hit chance (0.7-1.0)
  shieldsUsed: number;            // Shield strength (0-100)
  armorDamage: number;            // Hull damage (0-30)
}
```

**Action Types:**
- **attack**: Direct assault, high damage
- **focus_fire**: Combined fire on single target, increased damage
- **evasive_maneuver**: Dodge incoming fire, reduced damage taken
- **support_fire**: Support allied ships, healing/buffing
- **defend**: Defensive posture, damage reduction

### Combat Result

```typescript
interface FleetCombatResult {
  success: boolean;                // Did attacker win?
  winner: 'attacker' | 'defender' | 'draw';
  timestamp: number;               // When combat ended
  totalRounds: number;             // How many rounds fought
  attackerLosses: FleetLosses;     // Attacker casualties
  defenderLosses: FleetLosses;     // Defender casualties
  resourcesTransferred?: Record<string, number>;
  experienceGained: {
    attacker: number;              // XP for attacker
    defender: number;              // XP for defender
  };
  combatReport: FleetCombatReport; // Detailed report
}

interface FleetLosses {
  shipsDestroyed: number;          // Total ships lost
  shipsDisabled: number;           // Damaged/disabled ships
  crewCasualties: number;          // Crew deaths
  estimatedValue: number;          // ISK/credit value lost
  shipsRemaining: number;          // Surviving ships
}
```

---

## Transit Methods

### 1. Stargate Network

**Characteristics:**
- Instant/near-instant transit (1-9 seconds)
- Network-based (must be connected)
- High capacity (10-100 ships depending on level)
- Requires maintenance

**Creating a Stargate:**

```typescript
const stargate = createStargate(
  'Stargate Alpha',
  {
    x: 0,
    y: 0,
    z: 0,
    sector: 'Alpha-Sector'
  },
  5,                    // Level (1-10)
  ['sg_002', 'sg_003']  // Connected stargates
);

// Result:
// {
//   id: "stargate_1707123456789",
//   name: "Stargate Alpha",
//   location: { x: 0, y: 0, z: 0, sector: "Alpha-Sector" },
//   linkedTo: ["sg_002", "sg_003"],
//   level: 5,
//   capacity: 50,              // 5 * 10
//   transitTime: 5500,         // 5.5 seconds
//   status: "active",
//   maintenance: {
//     health: 100,
//     lastRepair: 1707123456789,
//     repairCost: 25000        // 5 * 5000
//   }
// }
```

**Transiting Through Stargate:**

```typescript
const result = transitThroughStargate(
  'fleet_001',          // Fleet ID
  stargate,             // Source stargate
  'sg_002',             // Destination stargate ID
  15                    // Fleet size (ships)
);

// Success result:
// {
//   success: true,
//   message: "Fleet transiting through Stargate Alpha. ETA: 5s",
//   transitTime: 5500
// }

// Failure result:
// {
//   success: false,
//   message: "Fleet too large for this stargate (15/10 capacity)",
//   transitTime: 0
// }
```

**Stargate Management:**

```typescript
// Repair stargate health
repairStargate(stargate, 20);  // Restore 20 health points
// Returns: Stargate with health = min(100, health + 20)

// Upgrade stargate (increase level)
upgradeStargate(stargate);
// Level 5 → Level 6
// Capacity: 50 → 60
// Transit time: 5500 → 4500 ms
```

**Stargate Levels:**

| Level | Capacity | Transit Time | Repair Cost |
|-------|----------|--------------|-------------|
| 1 | 10 ships | 9 seconds | 5,000 |
| 2 | 20 ships | 8 seconds | 10,000 |
| 3 | 30 ships | 7 seconds | 15,000 |
| 4 | 40 ships | 6 seconds | 20,000 |
| 5 | 50 ships | 5.5 seconds | 25,000 |
| 10 | 100 ships | 1 second | 50,000 |

---

### 2. Jump Gate

**Characteristics:**
- Ranged jumps (up to 5000 units base)
- Single-use with cooldown (2-13 seconds depending on level)
- Risk of destabilization (5-50% depending on level)
- Requires energy/resources
- Can overheat/overload

**Creating a Jump Gate:**

```typescript
const jumpGate = createJumpGate(
  'Jump Gate Omega',
  {
    x: 5000,
    y: 3000,
    z: 2000,
    sector: 'Gamma-Sector'
  },
  8000,    // Range (units)
  4        // Level (1-10)
);

// Result:
// {
//   id: "jumpgate_1707123456789",
//   name: "Jump Gate Omega",
//   location: { x: 5000, y: 3000, z: 2000, sector: "Gamma-Sector" },
//   range: 8000,
//   level: 4,
//   maxPayload: 32,              // 4 * 8
//   energyRequired: 400,         // 4 * 100
//   cooldownTime: 11000,         // 11 seconds
//   stability: 100,
//   destabilizationRisk: 35,     // 5 * (11-4)
//   status: "active"
// }
```

**Executing Jump Gate Transit:**

```typescript
const jumpResult = executeJumpGateTransit(
  'fleet_002',
  jumpGate,
  { x: 5200, y: 3100, z: 2050 },  // Target location
  12,                              // Fleet size
  { dilithium: 400 }              // Resource cost
);

// Success:
// {
//   success: true,
//   message: "Jumping to target location. Distance: 173",
//   energyUsed: 400
// }

// Overload failure:
// {
//   success: false,
//   message: "Jump Gate overloaded during transit! Fleet scattered!",
//   energyUsed: 400
// }

// Range failure:
// {
//   success: false,
//   message: "Target out of range (6200/5000)",
//   energyUsed: 0
// }
```

**Jump Gate Mechanics:**

```typescript
// Check cooldown (must wait)
if (Date.now() - jumpGate.lastUsed < jumpGate.cooldownTime) {
  // Gate is on cooldown
}

// Stabilization after overload
stabilizeJumpGate(jumpGate, 25);  // Add 25 stability
// If stability > 70, status becomes "active" again

// Risk factors:
// - Lower level = higher risk
// - Higher destabilizationRisk = more likely to overload
// - Stability affects success rate
```

**Jump Gate Levels:**

| Level | Max Payload | Energy | Cooldown | Overload Risk |
|-------|-------------|--------|----------|---------------|
| 1 | 8 ships | 100 | 13 sec | 50% |
| 2 | 16 ships | 200 | 12 sec | 45% |
| 3 | 24 ships | 300 | 11 sec | 40% |
| 4 | 32 ships | 400 | 11 sec | 35% |
| 5 | 40 ships | 500 | 10 sec | 30% |
| 10 | 80 ships | 1000 | 2 sec | 5% |

---

### 3. Hyperspace Routes

**Characteristics:**
- Travel through dangerous subspace
- Variable transit times based on obstacles
- Can be scouted to reduce danger
- Can degrade/destabilize over time
- Player-discovered and mapped

**Creating Hyperspace Route:**

```typescript
const route = createHyperspaceRoute(
  'Zeta Route',
  { x: 0, y: 0, z: 0 },         // Start
  { x: 2000, y: 1500, z: 1000 } // End
);

// Result:
// {
//   id: "hyperspace_1707123456789",
//   name: "Zeta Route",
//   startLocation: { x: 0, y: 0, z: 0 },
//   endLocation: { x: 2000, y: 1500, z: 1000 },
//   distance: 2550.44,
//   baseTransitTime: 255044 ms,  // ~4.25 minutes
//   dangerLevel: 45,              // 10-70 random
//   discovered: false,
//   controlPoints: 0,
//   passageHealth: 100,
//   knownHazards: [               // Generated based on dangerLevel
//     {
//       id: "hazard_0",
//       type: "asteroid_field",
//       severity: 5,
//       damagePercentage: 18,
//       avoidanceDifficulty: 4
//     },
//     ...
//   ]
// }
```

**Navigating Hyperspace:**

```typescript
const navResult = navigateHyperspaceRoute(
  'fleet_003',
  route,
  65  // Navigation skill (0-100)
);

// Result:
// {
//   success: true,
//   message: `Entering hyperspace route: Zeta Route
// ✓ Navigated around asteroid_field
// ⚠️ Encountered ion_storm! Damage: 12%
// ✓ Navigated around gravitational_anomaly`,
//   damageIncurred: 12,
//   transitTime: 285549 // Adjusted for damage
// }
```

**Hyperspace Hazards:**

| Type | Severity | Effect | Avoidance |
|------|----------|--------|-----------|
| Asteroid Field | 2-10 | 10-20% damage | Low difficulty |
| Ion Storm | 3-10 | 15-25% damage | Medium difficulty |
| Gravitational Anomaly | 4-10 | 12-22% damage | Medium-High |
| Subspace Tear | 5-10 | 20-30% damage | High difficulty |
| Enemy Patrol | 4-10 | 10-30% damage | High difficulty |

**Hyperspace Route Management:**

```typescript
// Scout a route to reduce danger
scoutHyperspaceRoute(route, 75);  // Navigation skill 75
// - Reduces danger level
// - Marks discovered = true
// - Removes ~30% of hazards
// - Result: Safer passage for others

// Damage a route (destabilization)
damageHyperspaceRoute(route, 25);
// - Reduces passage health
// - If health < 30: increases danger level
// - Regenerates known hazards
// - Makes passage more dangerous for all
```

---

## Combat Reports

### Generating Combat Reports

```typescript
const report = generateFleetCombatReport(
  'incoming',          // Type: incoming or outgoing
  'player_2',          // Report recipient
  'player_1',          // Report author
  fleetCombat,         // Combat object
  500,                 // Attacker XP
  250                  // Defender XP
);

// Result:
// {
//   id: "report_1707123456789",
//   type: "incoming",
//   timestamp: 1707123456789,
//   from: "player_1",
//   to: "player_2",
//   combatId: "combat_1707123456789_abc123",
//   location: { x: 1000, y: 2000, z: 500, sector: "Alpha-Quadrant" },
//   missionType: "attack",
//   transitMethod: "stargate",
//   status: "reported",
//   content: {
//     initial: "🚀 FLEET COMBAT REPORT 🚀\n...",
//     final: "═══════════════════════════════════════════════════════════════\nFINAL REPORT:\n..."
//   },
//   totalShipsEngaged: { attacker: 10, defender: 8 },
//   totalDamage: { attacker: 450, defender: 380 },
//   duration: 47  // seconds
// }
```

### Report Format

**Initial Report (Incoming):**
```
🚀 FLEET COMBAT REPORT 🚀
═══════════════════════════════════════════════════════════════

Combat Type: ATTACK
Transit Method: STARGATE
Location: Alpha-Quadrant (1000, 2000, 500)
Time: [timestamp]

INITIAL REPORT:
Attacker Fleet (10 ships) engaged Defender Fleet (8 ships).
Transit Method: Used Stargate Network
Combat Status: ENGAGED
Initial Contact: [number] rounds of combat
```

**Final Report:**
```
═══════════════════════════════════════════════════════════════
FINAL REPORT:
═══════════════════════════════════════════════════════════════

Combat Winner: ATTACKER
Total Rounds: 8
Duration: 47 seconds

ATTACKER LOSSES:
  Ships Destroyed: 3
  Crew Casualties: 450
  Total Damage Taken: 450 points
  Estimated Loss Value: 150000 credits

DEFENDER LOSSES:
  Ships Destroyed: 5
  Crew Casualties: 750
  Total Damage Taken: 380 points
  Estimated Loss Value: 250000 credits

EXPERIENCE GAINED:
  Attacker: +500 XP
  Defender: +250 XP
```

---

## Fleet Statistics & Metrics

### Engagement Statistics

```typescript
const stats = calculateFleetEngagementStatistics(combats);

// Result:
// {
//   totalBattles: 42,
//   wins: 28,
//   losses: 10,
//   draws: 4,
//   averageFleetSize: 12.5,
//   totalShipsLost: 125,
//   totalShipsDestroyed: 210,
//   totalDamageDealt: 18500,
//   totalDamageTaken: 14200,
//   combatEfficiency: 1.30,        // Damage dealt / Damage taken
//   winRate: 66.67                 // (Wins / Total) * 100
// }
```

### Fleet Status

```typescript
const status = getFleetCombatStatus(combat);

// Returns: "healthy" | "damaged" | "critical" | "destroyed"
// - healthy: < 30% losses
// - damaged: 30-60% losses
// - critical: 60-100% losses
// - destroyed: 100% losses
```

---

## Strategic Tips

### Stargate Advantages
- ✓ Fastest transit method
- ✓ Highest predictability
- ✓ Can be upgraded and maintained
- ✗ Requires network connectivity
- ✗ Fixed routes
- ✗ Controllable by other players

### Jump Gate Advantages
- ✓ Range flexibility
- ✓ Tactical options
- ✓ No network requirements
- ✗ Energy intensive
- ✗ Cooldown penalties
- ✗ Destabilization risk

### Hyperspace Advantages
- ✓ Scout and discover new routes
- ✓ Reduced predictability
- ✓ Can degrade enemy routes
- ✗ Longest transit times
- ✗ Hazard encounters
- ✗ Variable timing

### Combat Tactics
1. **Blockade Strategy**: Control a chokepoint (stargate/jump gate)
2. **Ambush**: Scout hyperspace routes, intercept at hazards
3. **Attrition**: Force enemy through damaged routes
4. **Alliance**: Coordinate multiple fleets for escort
5. **Interception**: Use patrol to detect and intercept

---

## Integration Example

```typescript
// Complete fleet combat flow
import {
  createFleetCombat,
  executeFleetCombat,
  generateFleetCombatReport,
  transitThroughStargate,
  generateFleetCombatLog,
  calculateFleetEngagementStatistics
} from './GameSystems';

// Step 1: Create combat mission
const combat = createFleetCombat(
  'attacker_id',
  'defender_id',
  'fleet_id',
  'attack',
  'stargate',
  targetLocation,
  5000
);

// Step 2: Player transits via stargate
const transitResult = transitThroughStargate(fleet, stargate, destGate, fleetSize);
if (!transitResult.success) {
  console.error(transitResult.message);
  return;
}

// Step 3: Combat engagement
const engagedCombat = executeFleetCombat(
  combat,
  playerFleet,
  enemyFleet,
  50
);

// Step 4: Generate reports
const incomingReport = generateFleetCombatReport(
  'incoming',
  defender_id,
  attacker_id,
  engagedCombat,
  xpGained,
  xpLost
);

// Step 5: Log combat
const combatLog = generateFleetCombatLog(engagedCombat);

// Step 6: Track statistics
const playerStats = calculateFleetEngagementStatistics(playerCombats);

console.log(`Win Rate: ${playerStats.winRate.toFixed(2)}%`);
console.log(`Combat Efficiency: ${playerStats.combatEfficiency.toFixed(2)}`);
console.log(`Ships Destroyed: ${playerStats.totalShipsDestroyed}`);
```

---

## Common Use Cases

### Scenario 1: Fleet Intercept
```
1. Scout detects enemy fleet heading to stargate
2. Defender initiates "intercept" mission
3. Defender's fleet heads to stargate location
4. Combat starts during transit or at gate
5. Winner controls the stargate
```

### Scenario 2: Hyperspace Route Sabotage
```
1. Alliance scouts enemy route
2. Deliberately damages route (destablizes it)
3. Increases danger for enemy
4. Can reduce their fleet efficiency
```

### Scenario 3: Jump Gate Chains
```
1. Player 1 uses Jump Gate to reach Point B
2. Jump Gate overloads (high risk)
3. Fleet scattered across space
4. Must regroup before continuing
```

---

## Performance Metrics

- Combat rounds: Up to 50 per engagement
- Ships per fleet: 1-100+
- Maximum concurrent combats: System dependent
- Report generation: < 100ms
- Statistics calculation: O(n) where n = number of combats

---

**System Version:** 1.0  
**Last Updated:** February 3, 2026  
**Status:** Production Ready
