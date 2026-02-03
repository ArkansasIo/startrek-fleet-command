# Planetary Combat - Quick Reference

## Mission Types at a Glance

| Type | Travel Time | Success Rate | Main Benefit | Risk |
|------|-------------|--------------|-------------|------|
| **Raid** | 10% | 70-80% | Steal resources | Low detection |
| **Attack** | 100% | 40-50% | Conquer planet | High casualties |
| **Spy** | 30% | 60-70% | Gather intel | Agent capture |
| **Sabotage** | 20% | 50-60% | Destroy buildings | Fleet loss |
| **Espionage** | 50% | 55-65% | Full intelligence | High detection |
| **Siege** | Continuous | Variable | Blockade planet | Sustained cost |

---

## Core Functions

### Create & Launch Mission
```typescript
import {
  createPlanetaryMission,
  executeRaidMission,
  executeAttackMission,
  executeSpyMission,
  executeSabotageMission,
} from './lib/PlanetaryCombatSystem';

// Create mission
const mission = createPlanetaryMission(
  attackerId,
  defenderId,
  targetPlanetId,
  'raid',
  fleetId,
  travelTimeMs
);

// Execute when arrived
const result = executeRaidMission(
  mission,
  targetDefenses,
  cargoCapacity,
  storedResources
);
```

### Manage Defenses
```typescript
import {
  addPlanetDefense,
  repairDefense,
  upgradeDefense,
  calculateTotalDefenseStrength,
  getPlanetDefenseRating,
} from './lib/PlanetaryCombatSystem';

// Add defense to planet
const cannon = addPlanetDefense(planet, 'cannon', 5);

// Repair damaged defense
repairDefense(cannon, 50);

// Upgrade to next level
upgradeDefense(cannon, upgradeCostResources);

// Check total strength
const strength = calculateTotalDefenseStrength(planet.defenses);
const rating = getPlanetDefenseRating(planet);
```

### Generate Reports
```typescript
import {
  generateCombatReport,
  generateCombatLog,
  getMissionReport,
} from './lib/PlanetaryCombatSystem';

// Create initial report
const report = generateCombatReport(
  'outgoing', // or 'incoming'
  attackerId,
  defenderId,
  targetPlanet,
  'raid',
  true // success
);

// Get full combat log
const log = generateCombatLog(mission);
console.log(log);
```

### Track Mission Status
```typescript
import {
  getMissionETA,
  scheduleArrivalAlarm,
  interceptMission,
} from './lib/PlanetaryCombatSystem';

// Check when mission arrives
const eta = getMissionETA(mission);
console.log(`Mission arriving in: ${eta.timeRemaining}ms`);

// Schedule alarm
const alarm = scheduleArrivalAlarm(mission);

// Try to intercept
const intercept = interceptMission(
  mission,
  defenseFleet,
  availableInterceptors
);
```

---

## Defense Ratings

```
Undefended:    0-99 strength
Vulnerable:    100-499 strength
Light:         500-1,499 strength
Moderate:      1,500-3,499 strength
Strong:        3,500-6,999 strength
Very Strong:   7,000-14,999 strength
Fortress:      15,000+ strength
```

---

## Mission Success Factors

### Raid Success
- Enemy defense < (your attack × 1.4)
- Sufficient cargo capacity
- Escape before counter-attack

### Attack Success
- Enemy defense < (your attack × 1.25)
- Fleet durability sufficient
- Can capture planet

### Spy Success
- Not detected by detectors
- Agents escape
- Return to home

### Sabotage Success
- Reach target building
- Damage exceeds building durability
- Escape with explosives

---

## Defense Types & Costs

| Defense | Strength | Build Time | Best Against |
|---------|----------|-----------|--------------|
| Cannon | 50/level | 2 hours | Small raids |
| Laser | 75/level | 3 hours | Fast ships |
| Missile | 100/level | 4 hours | Large ships |
| Shield | 150/level | 5 hours | All damage |
| Detector | 25/level | 1 hour | Spies |

---

## Combat Report Templates

### Incoming Alert
```
[INCOMING] <MissionType>
Attacker: <PlayerID>
ETA: <TimeRemaining>
Estimated Damage: <DamageLevel>
Fleet Size: <ShipCount>
```

### Outgoing Status
```
[OUTGOING] <MissionType>
Target: <PlanetID>
Status: <MissionPhase>
Fleet: <ShipsCount>
ETA: <TimeRemaining>
```

### Combat Results
```
[RESULTS] <MissionType>
Status: <Success/Failure>
Damage Dealt: <DamageAmount>
Resources Stolen: <ResourceList>
Casualties: <KilledCount>
```

---

## Strategy Tips

### Offense
1. **Raid Weak Targets**
   - Low defense planets = guaranteed resources
   - High cargo fleets = more steal

2. **Coordinate Attacks**
   - Multiple simultaneous missions
   - Overwhelm defenses together

3. **Use Intelligence**
   - Scout before attacking
   - Know what defenses exist

### Defense
1. **Layer Defenses**
   - Mix defense types
   - Upgrade continuously

2. **Early Warning**
   - Scanner arrays detect missions
   - Receive alerts 24 hours early

3. **Quick Response**
   - Station interceptor fleet
   - Respond to alerts rapidly

---

## Resource Loot Distribution

**Raid Resources:**
- 30% of stored resources stolen
- Limited by cargo capacity
- Types: Dilithium, Tritanium, Deuterium, Latinum

**Attack Resources:**
- 50% of stored resources gained
- All buildings accessible
- Can occupy planet

**Sabotage Damage:**
- Building destroyed or heavily damaged
- Production halted 5-7 days
- Repair required

---

## Report Archive System

```typescript
// Reports auto-generated and stored
player.incomingReports.push(report);
player.outgoingReports.push(report);

// Can be reviewed later
const pastReports = player.incomingReports.filter(
  r => r.timestamp > weekAgo
);

// Archive old reports
archiveReports(player, olderThan30Days);
```

---

## Interception Mechanics

**Defender Can Intercept If:**
- Detects mission 24+ hours early
- Has fleet available
- Fleet can reach departure point
- 50% success rate base

**Attacker Can Avoid If:**
- Changes course at last moment
- Uses stealth technology
- Splits fleet (multiple routes)
- Uses alternate jump gates

---

## Mission Timeline Example

```
T+0:00    Mission launched
T+0:05    Fleet departs planet
T+1:00    Defender alerted
T+2:00    Defender analyzes threat
T+3:00    Defender decides response
T+12:00   Interceptor fleet departs (if defending)
T+24:00   Last chance to intercept
T+47:59   Fleet arrives at target
T+48:00   Mission executes
T+48:15   Mission completes
T+48:30   Return begins
T+96:00   Fleet arrives home
T+96:05   Full report available
```

---

## Defense Technology Bonuses

| Tech | Bonus | Effect |
|------|-------|--------|
| Planetary Defense I | +5% | All defenses 5% stronger |
| Planetary Defense II | +10% | All defenses 10% stronger |
| Shield Tech I | +10% | Shield generators 10% more effective |
| Counter-Intelligence | +15% | Spy detection 15% better |
| Early Warning System | 24h notice | Attacks detected 24h early |
| Tactical Defense | +20% | Defenses 20% stronger vs raids |

---

## Common Strategies

### Blitzkrieg Raid
- Send 10 transport ships
- Hit undefended planets
- Quick 4-hour mission
- Steal maximum resources

### Strategic Assault
- Scout with spies first
- Plan attack for weakness
- Coordinate fleet movements
- Execute multi-pronged assault

### Espionage Network
- Deploy spy network
- Gather enemy intel
- Share with allies
- Coordinate defenses

### Defense Fortress
- Build 20+ defensive structures
- Mix cannon, laser, missile
- Upgrade continuously
- Maintain interceptor fleet

---

## Common Mistakes to Avoid

❌ **Don't:**
- Attack without scouting
- Overextend your fleet
- Ignore incoming reports
- Leave planet undefended
- Repeat same attacks
- Underestimate enemies

✅ **Do:**
- Scout before attacking
- Keep fleet in reserve
- Check reports regularly
- Build diverse defenses
- Vary attack patterns
- Plan for retaliation

---

**Version:** 2.4.7  
**Last Updated:** February 3, 2026
