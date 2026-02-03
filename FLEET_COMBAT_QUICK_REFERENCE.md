# Fleet Combat System - Quick Reference

## Quick Start

### 1. Create Fleet Combat
```typescript
const combat = createFleetCombat(
  'attacker_id',
  'defender_id', 
  'fleet_id',
  'attack',
  'stargate',  // or 'jumpgate' or 'hyperspace'
  { x: 1000, y: 2000, z: 500, sectorId: 'Alpha' },
  5000  // travel time ms
);
```

### 2. Transit Fleet
```typescript
// Via Stargate
const result = transitThroughStargate(fleet, stargate, destId, fleetSize);

// Via Jump Gate
const jumpResult = executeJumpGateTransit(fleet, gate, location, size, resources);

// Via Hyperspace
const navResult = navigateHyperspaceRoute(fleet, route, skillLevel);
```

### 3. Execute Combat
```typescript
const result = executeFleetCombat(combat, attacker, defender, 50);
```

### 4. Generate Report
```typescript
const report = generateFleetCombatReport('incoming', from, to, combat, xpA, xpD);
```

---

## Core Functions

### Fleet Combat
| Function | Purpose | Returns |
|----------|---------|---------|
| `createFleetCombat()` | Initialize combat | FleetCombat |
| `executeFleetCombat()` | Run combat rounds | FleetCombat with result |
| `generateFleetCombatReport()` | Create report | FleetCombatReport |
| `generateFleetCombatLog()` | Full log text | String |
| `getFleetCombatStatus()` | Fleet condition | Status type |
| `calculateFleetEngagementStatistics()` | Player stats | Statistics |

### Stargate
| Function | Purpose | Key Params |
|----------|---------|-----------|
| `createStargate()` | Build gate | name, location, level |
| `transitThroughStargate()` | Use gate | fleet, gate, dest, size |
| `repairStargate()` | Fix gate | gate, repairAmount |
| `upgradeStargate()` | Level up | gate |

### Jump Gate
| Function | Purpose | Key Params |
|----------|---------|-----------|
| `createJumpGate()` | Build gate | name, location, range, level |
| `executeJumpGateTransit()` | Jump | fleet, gate, location, size |
| `stabilizeJumpGate()` | Stabilize | gate, amount |

### Hyperspace
| Function | Purpose | Key Params |
|----------|---------|-----------|
| `createHyperspaceRoute()` | Map route | name, start, end |
| `navigateHyperspaceRoute()` | Travel | fleet, route, skill |
| `scoutHyperspaceRoute()` | Scout | route, skill |
| `damageHyperspaceRoute()` | Damage | route, amount |

---

## Mission Types

| Type | Use Case | Bonus |
|------|----------|-------|
| attack | Destroy enemy | +30% damage |
| defend | Protect allies | +20% defense |
| escort | Guard transport | +15% defense |
| blockade | Control area | Persistent pressure |
| patrol | Detect enemies | Early warning |
| intercept | Stop mission | +25% damage vs target |

---

## Transit Methods Comparison

### Stargate Network ⭐
- **Speed**: 1-9 seconds
- **Capacity**: 10-100 ships
- **Reliability**: 100%
- **Cost**: Maintenance
- **Risk**: Low

### Jump Gate ⚡
- **Speed**: Instant (with cooldown)
- **Capacity**: 8-80 ships
- **Reliability**: 50-95%
- **Cost**: Energy
- **Risk**: Overload (5-50%)

### Hyperspace Route 🌌
- **Speed**: 1-20+ minutes
- **Capacity**: Unlimited
- **Reliability**: 50-100%
- **Cost**: None
- **Risk**: Hazards

---

## Combat Mechanics

### Damage Calculation
```
baseDamage × fleetBonus × strategyMultiplier × 
(1 - targetDefense/200) × healthModifier
```

### Ship Losses
```
damagePercent = (100 - healthPercent)
shipsDestroyed = fleetSize × (damagePercent / 100)
```

### Experience Gain
```
attackerXP = targetPower × damageDone / 100
defenderXP = (win) ? attackPower × damageDone / 100 : 0
```

---

## Fleet Status

- **healthy**: < 30% losses
- **damaged**: 30-60% losses
- **critical**: 60-100% losses
- **destroyed**: 100% losses

---

## Stargate Levels

```
Level 1: 10 cap, 9sec, 5k repair
Level 5: 50 cap, 5.5sec, 25k repair
Level 10: 100 cap, 1sec, 50k repair
```

---

## Jump Gate Levels

```
Level 1: 8 pay, 13sec cd, 50% risk
Level 5: 40 pay, 10sec cd, 30% risk
Level 10: 80 pay, 2sec cd, 5% risk
```

---

## Hyperspace Hazards

| Type | Damage | Difficulty |
|------|--------|-----------|
| Asteroid Field | 10-20% | Low |
| Ion Storm | 15-25% | Medium |
| Gravitational Anomaly | 12-22% | High |
| Subspace Tear | 20-30% | High |
| Enemy Patrol | 10-30% | High |

---

## Combat Statistics

```typescript
stats = calculateFleetEngagementStatistics(combats);

// Returns:
{
  totalBattles,          // Total combats
  wins,                  // Number of wins
  losses,                // Number of losses
  draws,                 // Number of draws
  averageFleetSize,      // Avg ships per combat
  totalShipsLost,        // Total destroyed
  totalShipsDestroyed,   // Enemy destroyed
  totalDamageDealt,      // Outgoing damage
  totalDamageTaken,      // Incoming damage
  combatEfficiency,      // Damage dealt / taken
  winRate                // % wins
}
```

---

## Stargate Network

```typescript
// Create network of gates
const gate1 = createStargate('Gate A', loc1, 5, ['id2', 'id3']);
const gate2 = createStargate('Gate B', loc2, 5, ['id1', 'id3']);
const gate3 = createStargate('Gate C', loc3, 5, ['id1', 'id2']);

// Must be connected to transit
transitThroughStargate(fleet, gate1, gate2Id, 15);
```

---

## Transit Time Calculation

### Stargate
```
Time = Level dependent (1-9 seconds)
```

### Jump Gate
```
Time = Instant
Cooldown = 13 - Level seconds
```

### Hyperspace
```
BaseTime = Distance × 100 ms
Adjusted = BaseTime × (1 + damagePercent/100)
```

---

## Defense Rating

```
- 0-50: Low defense
- 50-100: Medium defense
- 100-150: High defense
- 150+: Very high defense
```

---

## Report Format

### Incoming Report
- Received by: Defender
- Contains: Attacker fleet info, damage, losses
- Timing: Upon completion

### Outgoing Report
- Received by: Attacker
- Contains: Mission success, casualties, gains
- Timing: Upon return

---

## Common Tactics

### Stargate Control
1. Position fleet at gate
2. Intercept incoming enemies
3. Control galactic chokepoints
4. Upgrade gates for advantage

### Jump Gate Tactics
1. Scout destination first
2. Risk vs reward (energy cost)
3. Handle overload consequences
4. Chain jumps for distance

### Hyperspace Strategy
1. Scout routes to reduce danger
2. Sabotage enemy routes
3. Use stealth travel
4. Establish trade routes

---

## Performance Tips

✓ Pre-calculate fleet power ratings  
✓ Cache transit times  
✓ Batch combat report generation  
✓ Optimize hazard detection  
✓ Use statistics for matchmaking  

---

## Error Handling

```typescript
// Check transit success
if (!result.success) {
  console.error(result.message);
  // Handle failure
}

// Check combat completion
if (!combat.result) {
  // Combat still in progress
}

// Check fleet status
const status = getFleetCombatStatus(combat);
if (status === 'destroyed') {
  // Fleet lost
}
```

---

## Integration Checklist

- [ ] Create combat missions
- [ ] Build stargate network
- [ ] Deploy jump gates
- [ ] Discover hyperspace routes
- [ ] Execute combats
- [ ] Generate reports
- [ ] Track statistics
- [ ] Update fleet status
- [ ] Handle transit failures
- [ ] Manage resources

---

## Data Structure Quick Reference

```typescript
// Core objects
FleetCombat
CombatRound
FleetCombatResult
FleetCombatReport
Stargate
JumpGate
HyperspaceRoute
FleetEngagementStatistics

// Enums
FleetMissionType: 'attack' | 'defend' | 'escort' | 'blockade' | 'patrol' | 'intercept'
TransitMethod: 'normal' | 'stargate' | 'jumpgate' | 'hyperspace'
FleetStatusType: 'healthy' | 'damaged' | 'critical' | 'destroyed'
```

---

**Version**: 1.0  
**Category**: Quick Reference  
**Status**: Production Ready
