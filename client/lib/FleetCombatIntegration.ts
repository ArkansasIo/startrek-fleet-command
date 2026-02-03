// FleetCombatIntegration.ts
// Example integration of Fleet Combat System with other game systems

import {
  createFleetCombat,
  executeFleetCombat,
  generateFleetCombatReport,
  generateFleetCombatLog,
  calculateFleetEngagementStatistics,
  getFleetCombatStatus,
  createStargate,
  transitThroughStargate,
  repairStargate,
  upgradeStargate,
  createJumpGate,
  executeJumpGateTransit,
  stabilizeJumpGate,
  createHyperspaceRoute,
  navigateHyperspaceRoute,
  scoutHyperspaceRoute,
  damageHyperspaceRoute,
  FleetCombat,
  Stargate,
  JumpGate,
  HyperspaceRoute,
} from './FleetCombatSystem';

// ===== EXAMPLE 1: Basic Fleet Combat =====

export function exampleBasicFleetCombat() {
  console.log('=== EXAMPLE 1: Basic Fleet Combat ===\n');

  // Create attacker fleet
  const attackerFleet = {
    id: 'fleet_001',
    ownerId: 'player_1',
    ships: [
      { id: 'ship_1', class: 'battleship', hp: 100, power: 50 },
      { id: 'ship_2', class: 'cruiser', hp: 60, power: 35 },
      { id: 'ship_3', class: 'fighter', hp: 30, power: 20 },
    ],
    totalPower: 500,
    defenseRating: 65,
    crewCount: 5000,
    totalValue: 500000,
  };

  // Create defender fleet
  const defenderFleet = {
    id: 'fleet_002',
    ownerId: 'player_2',
    ships: [
      { id: 'ship_4', class: 'battleship', hp: 95, power: 48 },
      { id: 'ship_5', class: 'destroyer', hp: 70, power: 40 },
    ],
    totalPower: 480,
    defenseRating: 60,
    crewCount: 4000,
    totalValue: 450000,
  };

  // Create combat mission
  const combat = createFleetCombat(
    'player_1',
    'player_2',
    'fleet_001',
    'attack',
    'normal',
    { x: 1000, y: 2000, z: 500, sectorId: 'Alpha-Quadrant' },
    5000
  );

  console.log(`Combat Created: ${combat.id}`);
  console.log(`Status: ${combat.status}`);
  console.log(`Mission Type: ${combat.missionType}`);
  console.log(`Location: ${combat.location.sectorId}`);

  // Execute combat
  const engagedCombat = executeFleetCombat(combat, attackerFleet, defenderFleet, 50);

  console.log(`\nCombat Executed:`);
  console.log(`Total Rounds: ${engagedCombat.rounds.length}`);
  console.log(`Winner: ${engagedCombat.result?.winner}`);
  console.log(`Attacker Ships Lost: ${engagedCombat.result?.attackerLosses.shipsDestroyed}`);
  console.log(`Defender Ships Lost: ${engagedCombat.result?.defenderLosses.shipsDestroyed}`);

  // Generate report
  const report = generateFleetCombatReport(
    'incoming',
    'player_2',
    'player_1',
    engagedCombat,
    500,
    250
  );

  console.log(`\nReport Generated: ${report.id}`);
  console.log(`Type: ${report.type}`);
  console.log(`Status: ${report.status}`);
  console.log(`Duration: ${report.duration} seconds`);
}

// ===== EXAMPLE 2: Stargate Transit & Combat =====

export function exampleStargateTransit() {
  console.log('\n=== EXAMPLE 2: Stargate Transit & Combat ===\n');

  // Create stargate network
  const stargateAlpha = createStargate(
    'Stargate Alpha',
    { x: 0, y: 0, z: 0, sector: 'Alpha-Sector' },
    5,
    ['sg_beta', 'sg_gamma']
  );

  const stargateBeta = createStargate(
    'Stargate Beta',
    { x: 2000, y: 1500, z: 1000, sector: 'Beta-Sector' },
    5,
    ['sg_alpha', 'sg_gamma']
  );

  console.log(`Created Stargate Network:`);
  console.log(`  ${stargateAlpha.name}: Level ${stargateAlpha.level}, Capacity ${stargateAlpha.capacity}`);
  console.log(`  ${stargateBeta.name}: Level ${stargateBeta.level}, Capacity ${stargateBeta.capacity}`);
  console.log(`  Transit Time: ${stargateAlpha.transitTime}ms`);

  // Fleet transits through stargate
  const fleet = {
    id: 'fleet_003',
    ships: Array(15).fill({ class: 'cruiser' }),
    totalPower: 600,
  };

  const transitResult = transitThroughStargate(
    'fleet_003',
    stargateAlpha,
    'sg_beta',
    fleet.ships.length
  );

  if (transitResult.success) {
    console.log(`\nTransit Successful:`);
    console.log(`  Message: ${transitResult.message}`);
    console.log(`  Transit Time: ${transitResult.transitTime}ms`);

    // Stargate health reduced by usage
    console.log(`\nStargate Maintenance:`);
    console.log(`  Health Before: 100`);
    console.log(`  Health After: ${stargateAlpha.maintenance.health}`);

    // Repair stargate
    repairStargate(stargateAlpha, 25);
    console.log(`  After Repair: ${stargateAlpha.maintenance.health}`);
  } else {
    console.log(`Transit Failed: ${transitResult.message}`);
  }

  // Upgrade stargate
  upgradeStargate(stargateAlpha);
  console.log(`\nStargate Upgraded:`);
  console.log(`  New Level: ${stargateAlpha.level}`);
  console.log(`  New Capacity: ${stargateAlpha.capacity}`);
  console.log(`  New Transit Time: ${stargateAlpha.transitTime}ms`);
}

// ===== EXAMPLE 3: Jump Gate Operations =====

export function exampleJumpGateOperations() {
  console.log('\n=== EXAMPLE 3: Jump Gate Operations ===\n');

  // Create jump gate
  const jumpGate = createJumpGate(
    'Jump Gate Omega',
    { x: 5000, y: 3000, z: 2000, sector: 'Gamma-Sector' },
    8000,
    6
  );

  console.log(`Jump Gate Created:`);
  console.log(`  Name: ${jumpGate.name}`);
  console.log(`  Level: ${jumpGate.level}`);
  console.log(`  Max Payload: ${jumpGate.maxPayload} ships`);
  console.log(`  Energy Required: ${jumpGate.energyRequired}`);
  console.log(`  Cooldown: ${jumpGate.cooldownTime}ms`);
  console.log(`  Destabilization Risk: ${jumpGate.destabilizationRisk}%`);

  // Attempt jump
  const targetLocation = { x: 5200, y: 3100, z: 2050 };
  const jumpResult = executeJumpGateTransit(
    'fleet_004',
    jumpGate,
    targetLocation,
    10,
    { dilithium: jumpGate.energyRequired }
  );

  if (jumpResult.success) {
    console.log(`\nJump Successful:`);
    console.log(`  ${jumpResult.message}`);
    console.log(`  Energy Used: ${jumpResult.energyUsed}`);
  } else {
    console.log(`\nJump Failed:`);
    console.log(`  ${jumpResult.message}`);
    console.log(`  Energy Used: ${jumpResult.energyUsed}`);
  }

  // Stabilize if needed
  if (jumpGate.stability < 70) {
    console.log(`\nStabilizing Jump Gate...`);
    stabilizeJumpGate(jumpGate, 30);
    console.log(`  Stability Restored: ${jumpGate.stability}`);
    console.log(`  Status: ${jumpGate.status}`);
  }
}

// ===== EXAMPLE 4: Hyperspace Route Exploration =====

export function exampleHyperspaceRoutes() {
  console.log('\n=== EXAMPLE 4: Hyperspace Route Exploration ===\n');

  // Create hyperspace route
  const route = createHyperspaceRoute(
    'Zeta Route',
    { x: 0, y: 0, z: 0 },
    { x: 2000, y: 1500, z: 1000 }
  );

  console.log(`Hyperspace Route Created:`);
  console.log(`  Name: ${route.name}`);
  console.log(`  Distance: ${Math.floor(route.distance)} units`);
  console.log(`  Base Transit Time: ${Math.floor(route.baseTransitTime / 1000)}s`);
  console.log(`  Danger Level: ${route.dangerLevel}%`);
  console.log(`  Known Hazards: ${route.knownHazards.length}`);

  // Display hazards
  console.log(`\n  Hazards:`);
  for (const hazard of route.knownHazards) {
    console.log(`    - ${hazard.type} (Severity: ${hazard.severity}, Damage: ${hazard.damagePercentage}%)`);
  }

  // Scout the route
  console.log(`\nScouting Route (Skill: 75)...`);
  scoutHyperspaceRoute(route, 75);

  console.log(`  Route Discovered: ${route.discovered}`);
  console.log(`  New Danger Level: ${route.dangerLevel}%`);
  console.log(`  Hazards Remaining: ${route.knownHazards.length}`);

  // Navigate through route
  console.log(`\nNavigating Route (Skill: 65)...`);
  const navResult = navigateHyperspaceRoute('fleet_005', route, 65);

  console.log(`  Success: ${navResult.success}`);
  console.log(`  Damage Incurred: ${navResult.damageIncurred}%`);
  console.log(`  Adjusted Transit Time: ${Math.floor(navResult.transitTime / 1000)}s`);
  console.log(`  Report:\n${navResult.message}`);

  // Sabotage route
  console.log(`\nSabotaging Route...`);
  damageHyperspaceRoute(route, 25);
  console.log(`  Passage Health: ${route.passageHealth}%`);
  console.log(`  New Danger Level: ${route.dangerLevel}%`);
}

// ===== EXAMPLE 5: Fleet Statistics & Analytics =====

export function exampleFleetStatistics() {
  console.log('\n=== EXAMPLE 5: Fleet Statistics & Analytics ===\n');

  // Simulate multiple combats
  const combats: FleetCombat[] = [];

  for (let i = 0; i < 5; i++) {
    const combat = createFleetCombat(
      'player_1',
      `player_${i + 2}`,
      `fleet_${i}`,
      'attack',
      i % 3 === 0 ? 'stargate' : i % 3 === 1 ? 'jumpgate' : 'hyperspace',
      { x: Math.random() * 5000, y: Math.random() * 5000, z: Math.random() * 5000, sectorId: 'Alpha' },
      Math.random() * 10000
    );

    const attacker = {
      ships: Array(Math.floor(Math.random() * 10) + 5).fill({}),
      totalPower: Math.floor(Math.random() * 500) + 300,
      defenseRating: Math.floor(Math.random() * 50) + 40,
      crewCount: Math.floor(Math.random() * 5000) + 2000,
      totalValue: Math.floor(Math.random() * 500000) + 300000,
    };

    const defender = {
      ships: Array(Math.floor(Math.random() * 10) + 5).fill({}),
      totalPower: Math.floor(Math.random() * 500) + 300,
      defenseRating: Math.floor(Math.random() * 50) + 40,
      crewCount: Math.floor(Math.random() * 5000) + 2000,
      totalValue: Math.floor(Math.random() * 500000) + 300000,
    };

    const engaged = executeFleetCombat(combat, attacker, defender, 50);
    combats.push(engaged);
  }

  // Calculate statistics
  const stats = calculateFleetEngagementStatistics(combats);

  console.log(`Fleet Engagement Statistics:`);
  console.log(`  Total Battles: ${stats.totalBattles}`);
  console.log(`  Wins: ${stats.wins}`);
  console.log(`  Losses: ${stats.losses}`);
  console.log(`  Draws: ${stats.draws}`);
  console.log(`  Win Rate: ${stats.winRate.toFixed(2)}%`);
  console.log(`  Combat Efficiency: ${stats.combatEfficiency.toFixed(2)}`);
  console.log(`  Total Ships Lost: ${stats.totalShipsLost}`);
  console.log(`  Total Ships Destroyed: ${stats.totalShipsDestroyed}`);
  console.log(`  Average Fleet Size: ${stats.averageFleetSize.toFixed(2)} ships`);
  console.log(`  Total Damage Dealt: ${stats.totalDamageDealt.toFixed(0)}`);
  console.log(`  Total Damage Taken: ${stats.totalDamageTaken.toFixed(0)}`);

  // Analyze combat status
  console.log(`\nFleet Combat Status Analysis:`);
  for (const combat of combats) {
    const status = getFleetCombatStatus(combat);
    console.log(`  Combat ${combat.id.substring(0, 15)}...: ${status}`);
  }

  // Generate combat logs
  console.log(`\nCombat Logs:`);
  const log = generateFleetCombatLog(combats[0]);
  console.log(log.substring(0, 500) + '...');
}

// ===== EXAMPLE 6: Complete Campaign Scenario =====

export function exampleCompleteCampaign() {
  console.log('\n=== EXAMPLE 6: Complete Campaign Scenario ===\n');

  // Setup: Two players, multiple locations, different transit methods

  console.log('SCENARIO: Border Conflict\n');
  console.log('Player 1 (Attacker) vs Player 2 (Defender)\n');

  // Create infrastructure
  const stargateA = createStargate('Stargate Alpha', { x: 0, y: 0, z: 0, sector: 'Alpha' }, 4, ['sg_b']);
  const stargateB = createStargate('Stargate Beta', { x: 3000, y: 2000, z: 1000, sector: 'Beta' }, 4, ['sg_a']);
  const jumpGate = createJumpGate('JumpGate-1', { x: 1500, y: 1000, z: 500, sector: 'Border' }, 5000, 3);
  const hsRoute = createHyperspaceRoute('Shadow Route', { x: 0, y: 0, z: 0 }, { x: 3000, y: 2000, z: 1000 });

  console.log('Infrastructure Created:');
  console.log(`  Stargates: ${stargateA.name}, ${stargateB.name} (Connected)`);
  console.log(`  Jump Gate: ${jumpGate.name}`);
  console.log(`  Hyperspace Route: ${hsRoute.name}\n`);

  // Phase 1: Stargate Transit
  console.log('PHASE 1: Stargate Transit\n');
  const transitResult = transitThroughStargate('fleet_main', stargateA, 'sg_b', 12);
  console.log(`Transit Result: ${transitResult.success ? 'SUCCESS' : 'FAILED'}`);
  console.log(`Message: ${transitResult.message}\n`);

  // Phase 2: Combat Engagement
  console.log('PHASE 2: Combat Engagement\n');
  const combat = createFleetCombat(
    'player_1',
    'player_2',
    'fleet_main',
    'attack',
    'stargate',
    stargateB.location,
    transitResult.transitTime
  );

  const p1Fleet = {
    ships: Array(12).fill({ class: 'cruiser', hp: 50, power: 30 }),
    totalPower: 600,
    defenseRating: 55,
    crewCount: 3000,
    totalValue: 300000,
  };

  const p2Fleet = {
    ships: Array(10).fill({ class: 'destroyer', hp: 60, power: 35 }),
    totalPower: 550,
    defenseRating: 60,
    crewCount: 2500,
    totalValue: 280000,
  };

  const engagedCombat = executeFleetCombat(combat, p1Fleet, p2Fleet, 50);
  console.log(`Combat Complete:`);
  console.log(`  Rounds: ${engagedCombat.rounds.length}`);
  console.log(`  Winner: ${engagedCombat.result?.winner.toUpperCase()}`);
  console.log(`  P1 Ships Lost: ${engagedCombat.result?.attackerLosses.shipsDestroyed}`);
  console.log(`  P2 Ships Lost: ${engagedCombat.result?.defenderLosses.shipsDestroyed}\n`);

  // Phase 3: Generate Reports
  console.log('PHASE 3: Reports Generated\n');
  const incomingReport = generateFleetCombatReport('incoming', 'player_2', 'player_1', engagedCombat, 450, 300);
  const outgoingReport = generateFleetCombatReport('outgoing', 'player_1', 'player_2', engagedCombat, 450, 300);

  console.log(`Incoming Report (to Player 2): ${incomingReport.id}`);
  console.log(`Outgoing Report (to Player 1): ${outgoingReport.id}\n`);

  // Phase 4: Aftermath
  console.log('PHASE 4: Aftermath\n');
  console.log(`Campaign Summary:`);
  console.log(`  Victor: ${engagedCombat.result?.winner === 'attacker' ? 'Player 1' : 'Player 2'}`);
  console.log(`  Total Experience Gained:`);
  console.log(`    - Player 1: +${engagedCombat.result?.experienceGained.attacker} XP`);
  console.log(`    - Player 2: +${engagedCombat.result?.experienceGained.defender} XP`);
  console.log(`  Stargate Damage:`);
  console.log(`    - Health: ${stargateA.maintenance.health}%`);
  console.log(`    - Repair Cost: ${stargateA.maintenance.repairCost}`);
}

// ===== RUN ALL EXAMPLES =====

export function runAllExamples() {
  console.log('╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                    FLEET COMBAT SYSTEM EXAMPLES                            ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

  exampleBasicFleetCombat();
  exampleStargateTransit();
  exampleJumpGateOperations();
  exampleHyperspaceRoutes();
  exampleFleetStatistics();
  exampleCompleteCampaign();

  console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                       ALL EXAMPLES COMPLETED                                ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');
}

// Export for testing
if (typeof module !== 'undefined' && module.hot) {
  runAllExamples();
}
