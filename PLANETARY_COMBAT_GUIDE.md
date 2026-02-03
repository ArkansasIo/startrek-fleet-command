# Planetary Combat System - Complete Guide

## Overview

The Planetary Combat System implements OGame-style planetary raids, attacks, spies, sabotage, and detailed combat reports. It's a crucial part of the game's PvP mechanics that allows players to attack each other's planets, steal resources, gather intelligence, and destroy infrastructure.

## Mission Types

### 🚀 Raid
**Purpose:** Steal resources from a planet without destroying infrastructure.

**Mechanics:**
- Takes only 10% of normal travel time
- Can steal up to 30% of stored resources
- Limited by fleet cargo capacity
- Lower detection risk than spies
- Damage to defenses (20% reduction)
- Failed if defenses are too strong

**Requirements:**
- Transport fleet with cargo capacity
- Target planet location
- Sufficient travel time

**Success Conditions:**
- Fleet attack power > Planet defense * 0.7
- Escape with stolen goods to your planet

### 🎯 Attack
**Purpose:** Destroy defenses and infrastructure on target planet.

**Mechanics:**
- Full-scale planetary assault
- Damages/destroys defenses
- Can destroy buildings
- High casualty rates
- Takes 100% of normal travel time
- Successful if fleet destroys 80% of defenses

**Requirements:**
- Combat fleet with attack ships
- Target planet location
- Sufficient military strength

**Success Conditions:**
- Fleet attack power > Planet defense * 0.8
- Capture planet control temporarily

### 🕵️ Spy
**Purpose:** Gather intelligence about defenses and resources.

**Mechanics:**
- Can detect fleet composition
- Reveals resource storage amounts
- Shows building list and levels
- 30% base detection chance (increases with defender's tech)
- If detected, agent is captured
- Can be repeated for updated intel

**Requirements:**
- Spy probes/agents
- Target coordinates
- Information gathering tech

**Success Conditions:**
- Agents not detected
- Return to home planet with intelligence

### 💣 Sabotage
**Purpose:** Destroy or damage specific buildings.

**Mechanics:**
- Target random or specific building
- 60% base success rate
- Destroys if damage > building level * 20
- Takes 20% travel time
- Defender can still defend

**Requirements:**
- Sabotage team
- Building location knowledge
- Technical demolition capability

**Success Conditions:**
- Successfully reach building
- Escape detection and interception

### 🔍 Espionage
**Purpose:** Extended spy mission gathering comprehensive intelligence.

**Mechanics:**
- Gathers all information about planet
- 25% base detection chance
- Longer mission (50% more travel time)
- More detailed intelligence reports
- Can detect ongoing research/construction

**Requirements:**
- Advanced spy technology
- Espionage training
- Encryption breakers

**Success Conditions:**
- Avoid detection during entire mission
- Return with full intelligence package

### ⛓️ Siege
**Purpose:** Blockade planet, cutting off resources.

**Mechanics:**
- Continuous mission (not one-time)
- Prevents resource gathering
- Can reduce morale
- Requires fleet presence
- Can last until intercepted

**Requirements:**
- Large combat fleet
- Sustaining supplies
- Command ship

**Success Conditions:**
- Fleet survives defense attempts
- Maintain position for duration

---

## Combat Reports

### Report Types

#### Incoming Reports
**What the defender sees:**
- Initial alert when mission detected
- Type of mission (raid, attack, spy, etc.)
- Estimated time of arrival
- Estimated attacker fleet size
- Expected damage

**Timing:**
- Received 24 hours before arrival (configurable)
- Updated if new information discovered
- Final report when mission completes

**Example:**
```
[INCOMING ALERT] 2026-02-03 14:32:00
RAID DETECTED
Attacker: Commander_Dax
Target: My_Homeworld
ETA: 2 hours 15 minutes
Expected Damage: Medium
Fleet Detected: 15 transport ships
```

#### Outgoing Reports
**What the attacker sees:**
- Mission status updates
- Fleet travel progress
- Execution phase updates
- Final results and loot

**Timing:**
- Confirmation when launched
- Updates during transit
- Final report at completion

**Example:**
```
[OUTGOING STATUS] 2026-02-03 14:35:00
RAID MISSION
Target: Enemy_Homeworld
Status: IN TRANSIT
ETA: 45 minutes
Fleet Status: All ships intact
Expected Resources: ~1500 dilithium
```

### Report Contents

**Basic Information:**
- Mission ID and timestamp
- Attacker and defender names
- Target planet
- Mission type
- Success/failure status

**Damage Report:**
```
DAMAGE INFLICTED:
  Defense Cannon Level 5: 45 damage
  Defense Laser Level 3: 30 damage
  Defense Shield Level 8: 120 damage
  Fleet Casualties: 3 ships lost
  Total Casualties: 47 personnel
```

**Resource Report (for raids):**
```
RESOURCES STOLEN:
  Dilithium: 2,500 units
  Tritanium: 1,800 units
  Deuterium: 950 units
  Latinum: 200 units
  Total Cargo Used: 5,450 / 10,000
```

**Intelligence Report (for spy missions):**
```
INTELLIGENCE GATHERED:
  Fleet Composition:
    - 12x Cruiser Class
    - 8x Scout Class
    - 4x Dreadnought
  Defense Level: Strong (Rating 4)
  Stored Resources:
    - Dilithium: 15,000
    - Tritanium: 12,000
    - Deuterium: 8,500
  Buildings Present:
    - Dilithium Mine (Level 8)
    - Research Lab (Level 6)
    - Military Barracks (Level 5)
```

**Sabotage Report:**
```
SABOTAGE RESULTS:
  Target Building: Dilithium Mine Level 8
  Status: DESTROYED
  Damage Caused: 160 units
  Building Production Loss: -200/hour
  Reconstruction Time: 48 hours
```

---

## Planetary Defense System

### Defense Types

#### 1. Cannon
- **Base Strength:** 50 per level
- **Cost:** Moderate
- **Effectiveness:** Good vs small fleets
- **Accuracy:** 80%
- **Durability:** 100 per level

#### 2. Laser
- **Base Strength:** 75 per level
- **Cost:** High
- **Effectiveness:** Excellent vs fighters
- **Accuracy:** 90%
- **Durability:** 80 per level

#### 3. Missile
- **Base Strength:** 100 per level
- **Cost:** Very High
- **Effectiveness:** Devastating vs capitals
- **Accuracy:** 70%
- **Durability:** 120 per level

#### 4. Shield Generator
- **Base Strength:** 150 per level
- **Cost:** Extremely High
- **Effectiveness:** Reduces all incoming damage
- **Coverage:** 50% damage reduction per level
- **Durability:** 150 per level

#### 5. Detector Array
- **Base Strength:** 25 per level
- **Cost:** Low
- **Effectiveness:** Increases spy detection
- **Detection Bonus:** 15% per level
- **Durability:** 60 per level

### Defense Calculations

**Total Defense Strength:**
```
Total = Σ(defense.strength × defense.level × bonusMultiplier)
```

**Defense Success Chance:**
```
Success = (defenseStrength / attackStrength) > 0.8
```

**Raid Success Chance:**
```
Success = (raidStrength / defenseStrength) > 1.0 (can steal resources)
```

### Defense Bonuses

**Technology Bonuses:**
- Planetary Defense Tech: +5% per level
- Shield Technology: +10% per level
- Military Science: +3% per level

**Building Bonuses:**
- Military Barracks Level 5+: +20%
- Planetary Shield Generator: +25% (if active)
- Defense Network Building: +15%

**Alliance Bonuses:**
- Ally reinforcements: +variable
- Alliance defense treaty: +10%

---

## Mission Timeline

### Phase 1: Launch (Preparation)
- Fleet assembles at starting planet
- Resources loaded/prepared
- Route calculated
- Mission confirmed

### Phase 2: Travel (Transit)
- Fleet travels to destination
- Can be detected en route
- Fuel consumed
- Progress updates sent

### Phase 3: Execution (Active)
- Arrives at target planet
- Engages defenses
- Performs mission type
- Reports generated

### Phase 4: Return (Retreat)
- Fleet gathers loot/intel
- Escapes planet defenses
- Returns to origin
- Final report delivered

**Travel Times:**
- Raid: 10% normal time
- Attack: 100% normal time
- Spy: 30% normal time
- Sabotage: 20% normal time
- Espionage: 50% normal time
- Siege: Continuous

---

## Interception System

### Defense Fleet Interception

**Mechanics:**
- Defender can send fleet to intercept
- Must arrive before attacker
- 50% chance to prevent mission
- Chance increases with ship count
- Battle occurs at departure point

**Interception Formula:**
```
InterceptionChance = (DefenseShips / AttackShips) × 0.5
```

### Escape Routes

**Attacker can:**
- Change course at last minute
- Use warp gates if available
- Split fleet for multiple routes
- Use stealth technology (if researched)

---

## Mission Failures and Consequences

### Why Missions Fail

**Raid Failures:**
- Defenses too strong (>70% attack power)
- Planet completely empty
- Defenders arrive early

**Attack Failures:**
- Defenses survive (>80% strength remaining)
- Defender reinforcements arrive
- Fleet insufficient for conquest

**Spy Failures:**
- Caught by detection arrays
- Discovered by defender fleet
- Target has counter-intelligence

**Sabotage Failures:**
- Target defended by troops
- Building too small/critical
- Intercepted en route

### Consequences

**Fleet Loss:**
- Ships destroyed: Removed from game
- Survivors: Return but damaged
- Recovery time: 1-5 days

**Capture:**
- Agents/crew captured: Held for ransom
- Intel revealed: Defender learns attacker info
- Reputation loss: -10 points

**Retaliation:**
- Defender can counter-attack
- War declaration possible
- Alliance involvement likely

---

## Combat Report Examples

### Successful Raid Report

```
═══════════════════════════════════════════════════
        RAID MISSION COMPLETE - SUCCESS
═══════════════════════════════════════════════════

Mission ID: mission_atk_1707033600000
Timestamp: 2026-02-03 15:45:32
Duration: 4 hours 23 minutes

COMBATANTS:
  Attacker: Commander_Kirk
  Defender: Captain_Picard
  Target: Picard_Homeworld

RESULTS: ✅ SUCCESSFUL RAID

CARGO STOLEN:
  Dilithium:  2,500 units
  Tritanium: 1,800 units
  Deuterium:   950 units
  Latinum:     200 units
  ─────────────────────────
  Total:     5,450 units (54.5% of cargo capacity used)

DEFENSE ENGAGEMENT:
  Cannons Destroyed: 2
  Lasers Destroyed: 0
  Missiles Hit: 1 (20 damage)
  Shields Absorbed: 150 points
  
  Total Defense Strength: 2,100 (before)
  Remaining Strength: 1,850 (88% intact)

FLEET STATUS:
  Ships Sent: 12
  Ships Returned: 12
  Casualties: 0
  Damage Sustained: Minor (1 ship at 60% health)

ESCAPE:
  Intercepted by defender? No
  Counter-attack launched? No
  Successfully returned? Yes

GAINS:
  Attacker Experience: +250
  Attacker Resources: +5,450
  Defender Loss: -5,450
  Reputation Change: +5

═══════════════════════════════════════════════════
```

### Failed Spy Mission Report

```
═══════════════════════════════════════════════════
        SPY MISSION FAILED - AGENTS CAPTURED
═══════════════════════════════════════════════════

Mission ID: mission_spy_1707034200000
Timestamp: 2026-02-03 16:12:45
Duration: 2 hours 18 minutes

COMBATANTS:
  Spymaster: Commander_Dax
  Target: Commander_Sisko
  Location: Sisko_Research_Station

RESULTS: ❌ MISSION COMPROMISED

DETECTION:
  Detection Chance: 30% base + 15% (enemy tech)
  Detection Roll: 28% (DETECTED)
  Discovery Moment: During infiltration phase
  Discovered By: Planetary Defender Network

AGENT STATUS:
  Agents Sent: 3
  Agents Returned: 0
  Agents Captured: 3
  Status: In Custody

INTELLIGENCE GATHERED:
  Before Discovery: None
  Partial Intercept: Fleet size detected (12 ships)
  Full Data: Not obtained

RANSOM:
  Amount Demanded: 1,000 dilithium
  Payment Deadline: 7 days
  Consequences if unpaid: Agent execution

REPUTATION:
  Attacker Loss: -15 points
  Defender Gain: +5 points
  Diplomatic Incident: Possible

═══════════════════════════════════════════════════
```

### Successful Attack Report

```
═══════════════════════════════════════════════════
        PLANETARY ASSAULT - VICTORY
═══════════════════════════════════════════════════

Mission ID: mission_atk_1707035000000
Timestamp: 2026-02-03 16:45:22
Duration: 8 hours 32 minutes

COMBATANTS:
  Attacker: Warlord_Gul_Dukat
  Defender: Governor_Starling
  Target: Starling_Prime

BATTLE SUMMARY: ✅ PLANET CONQUERED

ENGAGEMENT PHASE 1: Orbital Bombardment
  Incoming Fire: 4,200 damage
  Defense Response: 2,100 damage
  Duration: 12 minutes
  Result: ATTACKER ADVANTAGE

ENGAGEMENT PHASE 2: Ground Assault
  Landing Craft: 8 deployed
  Defense Troops: Routed
  Casualties: 340 defender, 89 attacker
  Duration: 18 minutes
  Result: ATTACKER VICTORY

ENGAGEMENT PHASE 3: Infrastructure Destruction
  Military Barracks: DESTROYED
  Defense Network: DESTROYED
  Research Lab: Heavily damaged (20%)
  Mines: Operational (50% production)
  Duration: 22 minutes

FINAL RESULTS:
  Defender Fleet: Destroyed (6/12 ships)
  Attacker Fleet: Damaged (3/14 ships)
  Control: ATTACKER (48-hour occupation)
  Resource Gain: 2,500 dilithium available for looting
  Building Repair Time: 5-7 days

STRATEGIC VALUE:
  New Territory: +2 systems
  Control Points: +100
  Strategic Advantage: +25%
  
═══════════════════════════════════════════════════
```

---

## Integration with Game Systems

### Resource System Integration
- Stolen resources added to attacker inventory
- Defender loses stored resources
- Production impact calculated for sabotage

### Building System Integration
- Buildings can be damaged/destroyed
- Repair times generated
- Construction disrupted

### Leaderboard Integration
- Successful raids: +1-5 points
- Planetary attacks: +10-50 points
- Defense repels: +5 points
- Spy capture: -10 points

### Diplomacy Integration
- Attacks damage relations
- Failed spies create incidents
- Sieges can trigger alliances
- Retaliation possible

---

## Defense Strategies

### Light Defense (500-1000 strength)
- Suitable for: Resource gathering planets
- Stops: Casual raiders
- Fails against: Coordinated attacks

### Moderate Defense (1500-3000 strength)
- Suitable for: Mid-tier colonies
- Stops: Most raids
- Fails against: Persistent enemies

### Strong Defense (3500-7000 strength)
- Suitable for: Important planets
- Stops: Small fleets
- Requires: Raid forces with prep

### Fortress Defense (7000+ strength)
- Suitable for: Capital worlds
- Stops: Most attacks
- Requires: Coalition forces

---

## Mission Scheduling

**Best Practices:**
1. Schedule raids during opponent offline time
2. Coordinate with allies for simultaneous attacks
3. Space missions to avoid pattern detection
4. Vary mission types to keep opponents guessing

---

**System Version:** 1.0  
**Last Updated:** February 3, 2026  
**Compatibility:** Star Trek Fleet Command v2.4.7+
