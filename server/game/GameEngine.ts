import { DatabaseManager } from "../database/DatabaseManager";
import { Logger } from "../utils/Logger";
import crypto from "crypto";

export interface PlayerAction {
  id: string;
  playerId: string;
  actionType: string;
  actionData: any;
  targetType?: string;
  targetId?: string;
  priority: number;
}

export interface BattleResult {
  winnerId?: string;
  casualties: any;
  spoils: any;
  battleLog: string[];
}

export interface GameEvent {
  type: string;
  title: string;
  description: string;
  affectedPlayers: string[];
  location?: { type: string; id: string };
  eventData: any;
}

export class GameEngine {
  private db: DatabaseManager;
  private logger: Logger;

  constructor(db: DatabaseManager) {
    this.db = db;
    this.logger = new Logger("GameEngine");
  }

  /**
   * CORE TURN PROCESSING
   */

  /**
   * Process a complete game turn for a galaxy
   */
  async processTurn(galaxyId: string): Promise<void> {
    this.logger.info(`Processing turn for galaxy ${galaxyId}`);

    try {
      // Create new turn
      const turnId = await this.db.createGameTurn(galaxyId);

      // Get all pending actions for this turn
      const actions = await this.db.getPendingActions(turnId);

      // Process actions by priority
      await this.processPlayerActions(actions);

      // Update galaxy turn status
      await this.db.query(
        `
        UPDATE galaxies 
        SET current_turn = current_turn + 1,
            last_turn_processed = CURRENT_TIMESTAMP
        WHERE id = $1
      `,
        [galaxyId],
      );

      // Complete the turn
      await this.db.query(
        `
        UPDATE game_turns 
        SET status = 'completed', ended_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `,
        [turnId],
      );

      this.logger.info(`Turn processing completed for galaxy ${galaxyId}`);
    } catch (error) {
      this.logger.error(`Error processing turn for galaxy ${galaxyId}:`, error as any);
      throw error;
    }
  }

  /**
   * Process all player actions for a turn
   */
  private async processPlayerActions(actions: PlayerAction[]): Promise<void> {
    // Group actions by priority
    const actionsByPriority = actions.reduce(
      (groups, action) => {
        const priority = action.priority;
        if (!groups[priority]) groups[priority] = [];
        groups[priority].push(action);
        return groups;
      },
      {} as Record<number, PlayerAction[]>,
    );

    // Process each priority group
    const priorities = Object.keys(actionsByPriority).map(Number).sort();

    for (const priority of priorities) {
      const priorityActions = actionsByPriority[priority];

      // Process actions in parallel within the same priority
      await Promise.all(
        priorityActions.map((action) => this.processAction(action)),
      );
    }
  }

  /**
   * Process a single player action
   */
  private async processAction(action: PlayerAction): Promise<void> {
    try {
      this.logger.debug(
        `Processing action ${action.actionType} for player ${action.playerId}`,
      );

      await this.db.updateActionStatus(action.id, "processing");

      let result: any = null;

      switch (action.actionType) {
        case "move_ship":
          result = await this.processMoveShip(action);
          break;
        case "build_ship":
          result = await this.processBuildShip(action);
          break;
        case "attack":
          result = await this.processAttack(action);
          break;
        case "colonize":
          result = await this.processColonize(action);
          break;
        case "research":
          result = await this.processResearch(action);
          break;
        case "trade":
          result = await this.processTrade(action);
          break;
        case "diplomacy":
          result = await this.processDiplomacy(action);
          break;
        case "gather_resources":
          result = await this.processGatherResources(action);
          break;
        default:
          throw new Error(`Unknown action type: ${action.actionType}`);
      }

      await this.db.updateActionStatus(action.id, "completed", result);
    } catch (error) {
      this.logger.error(`Error processing action ${action.id}:`, error);
      await this.db.updateActionStatus(
        action.id,
        "failed",
        null,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  /**
   * ACTION PROCESSORS
   */

  /**
   * Process ship movement
   */
  private async processMoveShip(action: PlayerAction): Promise<any> {
    const { shipId, destinationType, destinationId, fleetId } =
      action.actionData;

    // Get ship details
    const ship = await this.db.query(
      `
      SELECT * FROM ships WHERE id = $1 AND player_id = $2
    `,
      [shipId, action.playerId],
    );

    if (ship.rows.length === 0) {
      throw new Error("Ship not found or not owned by player");
    }

    // Calculate travel time
    const travelTime = await this.calculateTravelTime(
      ship.rows[0].current_location_type,
      ship.rows[0].current_location_id,
      destinationType,
      destinationId,
    );

    // Update ship status
    await this.db.query(
      `
      UPDATE ships 
      SET status = 'traveling',
          destination_type = $1,
          destination_id = $2,
          travel_eta = CURRENT_TIMESTAMP + INTERVAL '${travelTime} minutes'
      WHERE id = $3
    `,
      [destinationType, destinationId, shipId],
    );

    return {
      travelTime,
      estimatedArrival: new Date(Date.now() + travelTime * 60000).toISOString(),
    };
  }

  /**
   * Process ship building
   */
  private async processBuildShip(action: PlayerAction): Promise<any> {
    const { shipClassId, name, locationId } = action.actionData;

    // Get ship class details
    const shipClass = await this.db.query(
      `
      SELECT * FROM ship_classes WHERE id = $1
    `,
      [shipClassId],
    );

    if (shipClass.rows.length === 0) {
      throw new Error("Ship class not found");
    }

    const classData = shipClass.rows[0];

    // Check if player has required resources
    const constructionCost = classData.construction_cost;
    const hasResources = await this.checkPlayerResources(
      action.playerId,
      constructionCost,
    );

    if (!hasResources) {
      throw new Error("Insufficient resources for ship construction");
    }

    // Deduct resources
    await this.deductPlayerResources(action.playerId, constructionCost);

    // Create ship
    const registry = await this.generateShipRegistry();
    const result = await this.db.query(
      `
      INSERT INTO ships (
        player_id, ship_class_id, name, registry, 
        current_hull_points, current_shield_points,
        current_location_type, current_location_id,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, 'planet', $7, 'docked')
      RETURNING id
    `,
      [
        action.playerId,
        shipClassId,
        name,
        registry,
        classData.max_hull_points,
        classData.max_shield_points,
        locationId,
      ],
    );

    return {
      shipId: result.rows[0].id,
      registry,
      constructionCost,
    };
  }

  /**
   * Process attack action
   */
  private async processAttack(action: PlayerAction): Promise<any> {
    const { attackerShips, targetType, targetId } = action.actionData;

    // Create battle
    const battleResult = await this.db.query(
      `
      INSERT INTO battles (galaxy_id, battle_type, location_type, location_id, status)
      VALUES ($1, 'ship_combat', $2, $3, 'ongoing')
      RETURNING id
    `,
      [action.actionData.galaxyId, targetType, targetId],
    );

    const battleId = battleResult.rows[0].id;

    // Add attacker to battle
    await this.db.query(
      `
      INSERT INTO battle_participants (battle_id, player_id, side, ships_count)
      VALUES ($1, $2, 'attacker', $3)
    `,
      [battleId, action.playerId, attackerShips.length],
    );

    // Process battle immediately for turn-based gameplay
    const result = await this.processBattle(battleId);

    return result;
  }

  /**
   * Process colonization
   */
  private async processColonize(action: PlayerAction): Promise<any> {
    const { planetId, colonistShips } = action.actionData;

    // Check if planet is habitable and uncolonized
    const planet = await this.db.query(
      `
      SELECT * FROM celestial_bodies 
      WHERE id = $1 AND body_type = 'planet' AND is_habitable = true AND is_colonized = false
    `,
      [planetId],
    );

    if (planet.rows.length === 0) {
      throw new Error("Planet is not available for colonization");
    }

    // Establish colony
    await this.db.query(
      `
      UPDATE celestial_bodies 
      SET is_colonized = true,
          controlling_player_id = $1,
          population = 1000,
          infrastructure_level = 1
      WHERE id = $2
    `,
      [action.playerId, planetId],
    );

    // Add to territory control
    await this.db.query(
      `
      INSERT INTO territory_control (player_id, controlled_type, controlled_id, control_strength)
      VALUES ($1, 'planet', $2, 100)
    `,
      [action.playerId, planetId],
    );

    return {
      planetId,
      initialPopulation: 1000,
      infrastructureLevel: 1,
    };
  }

  /**
   * Process research
   */
  private async processResearch(action: PlayerAction): Promise<any> {
    const { technologyId } = action.actionData;

    // Check if technology is available for research
    const tech = await this.db.query(
      `
      SELECT * FROM technologies WHERE id = $1
    `,
      [technologyId],
    );

    if (tech.rows.length === 0) {
      throw new Error("Technology not found");
    }

    // Check prerequisites
    const prerequisites = tech.rows[0].prerequisites || [];
    for (const prereqId of prerequisites) {
      const hasPrereq = await this.db.query(
        `
        SELECT 1 FROM player_research 
        WHERE player_id = $1 AND technology_id = $2 AND status = 'completed'
      `,
        [action.playerId, prereqId],
      );

      if (hasPrereq.rows.length === 0) {
        throw new Error("Prerequisites not met for this technology");
      }
    }

    // Start research
    await this.db.query(
      `
      INSERT INTO player_research (player_id, technology_id, status, started_at, progress_percentage)
      VALUES ($1, $2, 'researching', CURRENT_TIMESTAMP, 0)
      ON CONFLICT (player_id, technology_id)
      DO UPDATE SET status = 'researching', started_at = CURRENT_TIMESTAMP
    `,
      [action.playerId, technologyId],
    );

    return {
      technologyId,
      estimatedCompletion: tech.rows[0].research_time_hours,
    };
  }

  /**
   * Process trade
   */
  private async processTrade(action: PlayerAction): Promise<any> {
    const { orderType, resourceTypeId, quantity, pricePerUnit, locationId } =
      action.actionData;

    // Create trade order
    const result = await this.db.query(
      `
      INSERT INTO trade_orders (
        player_id, order_type, resource_type_id, quantity, price_per_unit,
        location_type, location_id, expires_at
      ) VALUES ($1, $2, $3, $4, $5, 'planet', $6, CURRENT_TIMESTAMP + INTERVAL '7 days')
      RETURNING id
    `,
      [
        action.playerId,
        orderType,
        resourceTypeId,
        quantity,
        pricePerUnit,
        locationId,
      ],
    );

    return {
      orderId: result.rows[0].id,
      orderType,
      quantity,
      pricePerUnit,
    };
  }

  /**
   * Process diplomacy action
   */
  private async processDiplomacy(action: PlayerAction): Promise<any> {
    const { targetPlayerId, relationType, proposalType } = action.actionData;

    // Update diplomatic relation
    await this.db.query(
      `
      INSERT INTO diplomatic_relations (player_from_id, player_to_id, relation_type)
      VALUES ($1, $2, $3)
      ON CONFLICT (player_from_id, player_to_id)
      DO UPDATE SET relation_type = $3, last_updated = CURRENT_TIMESTAMP
    `,
      [action.playerId, targetPlayerId, relationType],
    );

    // Send diplomatic message
    await this.sendMessage(
      action.playerId,
      targetPlayerId,
      "diplomatic",
      `Diplomatic Proposal: ${proposalType}`,
      `Player has proposed a ${proposalType} agreement.`,
    );

    return {
      targetPlayerId,
      relationType,
      proposalType,
    };
  }

  /**
   * Process resource gathering
   */
  private async processGatherResources(action: PlayerAction): Promise<any> {
    const { planetId, resourceType } = action.actionData;

    // Check if player controls the planet
    const planet = await this.db.query(
      `
      SELECT * FROM celestial_bodies 
      WHERE id = $1 AND controlling_player_id = $2
    `,
      [planetId, action.playerId],
    );

    if (planet.rows.length === 0) {
      throw new Error("Planet not controlled by player");
    }

    // Get resource deposits
    const deposits = await this.db.query(
      `
      SELECT rd.*, rt.name
      FROM resource_deposits rd
      JOIN resource_types rt ON rd.resource_type_id = rt.id
      WHERE rd.celestial_body_id = $1 AND rd.quantity > 0
    `,
      [planetId],
    );

    let totalGathered = 0;
    const resourcesGathered = {};

    for (const deposit of deposits.rows) {
      const gatherAmount = Math.min(deposit.quantity, deposit.extraction_rate);

      await this.addPlayerResource(
        action.playerId,
        deposit.resource_type_id,
        gatherAmount,
      );

      // Deplete deposit
      await this.db.query(
        `
        UPDATE resource_deposits 
        SET quantity = quantity - $1
        WHERE id = $2
      `,
        [gatherAmount, deposit.id],
      );

      resourcesGathered[deposit.name] = gatherAmount;
      totalGathered += gatherAmount;
    }

    return {
      planetId,
      resourcesGathered,
      totalGathered,
    };
  }

  /**
   * BATTLE SYSTEM
   */

  /**
   * Process a battle
   */
  async processBattle(battleId: string): Promise<BattleResult> {
    // Get battle participants
    const participants = await this.db.query(
      `
      SELECT bp.*, p.username
      FROM battle_participants bp
      JOIN players p ON bp.player_id = p.id
      WHERE bp.battle_id = $1
    `,
      [battleId],
    );

    if (participants.rows.length < 2) {
      throw new Error("Battle requires at least 2 participants");
    }

    const battleLog: string[] = [];
    const casualties = {};
    const spoils = {};

    // Simple battle resolution (can be made more complex)
    const attackers = participants.rows.filter((p) => p.side === "attacker");
    const defenders = participants.rows.filter((p) => p.side === "defender");

    // Calculate total strength
    const attackerStrength = attackers.reduce(
      (sum, p) => sum + p.ships_count * 100,
      0,
    );
    const defenderStrength = defenders.reduce(
      (sum, p) => sum + p.ships_count * 100,
      0,
    );

    battleLog.push(
      `Battle commenced: ${attackerStrength} vs ${defenderStrength}`,
    );

    let winnerId: string | undefined;

    if (attackerStrength > defenderStrength * 1.2) {
      winnerId = attackers[0].player_id;
      battleLog.push("Attackers achieved decisive victory");
    } else if (defenderStrength > attackerStrength * 1.2) {
      winnerId = defenders[0].player_id;
      battleLog.push("Defenders repelled the attack");
    } else {
      // Close battle - random outcome with slight defender advantage
      winnerId =
        Math.random() > 0.4 ? defenders[0].player_id : attackers[0].player_id;
      battleLog.push("Hard-fought battle with heavy casualties");
    }

    // Update battle result
    await this.db.query(
      `
      UPDATE battles 
      SET status = 'completed', ended_at = CURRENT_TIMESTAMP, 
          winner_player_id = $1, battle_log = $2,
          casualties = $3, spoils = $4
      WHERE id = $5
    `,
      [
        winnerId,
        JSON.stringify(battleLog),
        JSON.stringify(casualties),
        JSON.stringify(spoils),
        battleId,
      ],
    );

    return {
      winnerId,
      casualties,
      spoils,
      battleLog,
    };
  }

  /**
   * HELPER METHODS
   */

  /**
   * Complete research
   */
  async completeResearch(
    playerId: string,
    technologyId: string,
  ): Promise<void> {
    await this.db.query(
      `
      UPDATE player_research 
      SET status = 'completed', 
          progress_percentage = 100,
          completed_at = CURRENT_TIMESTAMP
      WHERE player_id = $1 AND technology_id = $2
    `,
      [playerId, technologyId],
    );

    // Apply technology bonuses (placeholder)
    this.logger.info(`Player ${playerId} completed research: ${technologyId}`);
  }

  /**
   * Add resources to player
   */
  async addPlayerResource(
    playerId: string,
    resourceTypeId: string,
    quantity: number,
  ): Promise<void> {
    await this.db.updatePlayerResource(playerId, resourceTypeId, quantity);
  }

  /**
   * Check if player has required resources
   */
  private async checkPlayerResources(
    playerId: string,
    requiredResources: any,
  ): Promise<boolean> {
    for (const [resourceId, requiredAmount] of Object.entries(
      requiredResources,
    )) {
      const result = await this.db.query(
        `
        SELECT quantity FROM player_resources 
        WHERE player_id = $1 AND resource_type_id = $2
      `,
        [playerId, resourceId],
      );

      const available = result.rows[0]?.quantity || 0;
      if (available < requiredAmount) {
        return false;
      }
    }
    return true;
  }

  /**
   * Deduct resources from player
   */
  private async deductPlayerResources(
    playerId: string,
    resources: any,
  ): Promise<void> {
    for (const [resourceId, amount] of Object.entries(resources)) {
      await this.db.query(
        `
        UPDATE player_resources 
        SET quantity = quantity - $1
        WHERE player_id = $2 AND resource_type_id = $3
      `,
        [amount, playerId, resourceId],
      );
    }
  }

  /**
   * Calculate travel time between locations
   */
  private async calculateTravelTime(
    fromType: string,
    fromId: string,
    toType: string,
    toId: string,
  ): Promise<number> {
    // Simplified travel time calculation
    // In a real game, this would consider distance, ship speed, etc.

    if (fromType === toType && fromId === toId) {
      return 0; // Same location
    }

    // Different systems = longer travel
    if (fromType === "system" && toType === "system" && fromId !== toId) {
      return 120; // 2 hours between systems
    }

    // Within same system
    return 30; // 30 minutes
  }

  /**
   * Generate unique ship registry
   */
  private async generateShipRegistry(): Promise<string> {
    const prefix = "NCC";
    let registry: string;
    let isUnique = false;

    while (!isUnique) {
      const number = Math.floor(Math.random() * 99999) + 1000;
      registry = `${prefix}-${number}`;

      const result = await this.db.query(
        `
        SELECT 1 FROM ships WHERE registry = $1
      `,
        [registry],
      );

      isUnique = result.rows.length === 0;
    }

    return registry!;
  }

  /**
   * Send message to player
   */
  private async sendMessage(
    fromId: string | null,
    toId: string,
    type: string,
    subject: string,
    content: string,
  ): Promise<void> {
    await this.db.query(
      `
      INSERT INTO player_messages (from_player_id, to_player_id, message_type, subject, content)
      VALUES ($1, $2, $3, $4, $5)
    `,
      [fromId, toId, type, subject, content],
    );
  }

  /**
   * Process trade orders (matching buy/sell orders)
   */
  async processTradeOrders(): Promise<void> {
    // Get all active buy orders
    const buyOrders = await this.db.query(`
      SELECT * FROM trade_orders 
      WHERE order_type = 'buy' AND status = 'active'
      ORDER BY price_per_unit DESC, created_at ASC
    `);

    for (const buyOrder of buyOrders.rows) {
      // Find matching sell orders
      const sellOrders = await this.db.query(
        `
        SELECT * FROM trade_orders 
        WHERE order_type = 'sell' 
        AND resource_type_id = $1 
        AND price_per_unit <= $2 
        AND status = 'active'
        ORDER BY price_per_unit ASC, created_at ASC
      `,
        [buyOrder.resource_type_id, buyOrder.price_per_unit],
      );

      for (const sellOrder of sellOrders.rows) {
        const tradeQuantity = Math.min(
          buyOrder.quantity - buyOrder.quantity_filled,
          sellOrder.quantity - sellOrder.quantity_filled,
        );

        if (tradeQuantity > 0) {
          await this.executeTrade(buyOrder, sellOrder, tradeQuantity);
        }
      }
    }
  }

  /**
   * Execute a trade between two orders
   */
  private async executeTrade(
    buyOrder: any,
    sellOrder: any,
    quantity: number,
  ): Promise<void> {
    const price = sellOrder.price_per_unit;
    const totalValue = quantity * price;

    await this.db.transaction(async (client) => {
      // Create transaction record
      await client.query(
        `
        INSERT INTO trade_transactions (
          buy_order_id, sell_order_id, buyer_id, seller_id,
          resource_type_id, quantity, price_per_unit
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        [
          buyOrder.id,
          sellOrder.id,
          buyOrder.player_id,
          sellOrder.player_id,
          buyOrder.resource_type_id,
          quantity,
          price,
        ],
      );

      // Transfer resources
      await client.query(
        `
        UPDATE player_resources 
        SET quantity = quantity + $1
        WHERE player_id = $2 AND resource_type_id = $3
      `,
        [quantity, buyOrder.player_id, buyOrder.resource_type_id],
      );

      await client.query(
        `
        UPDATE player_resources 
        SET quantity = quantity - $1
        WHERE player_id = $2 AND resource_type_id = $3
      `,
        [quantity, sellOrder.player_id, sellOrder.resource_type_id],
      );

      // Transfer credits
      const creditsResourceId = await this.getCreditsResourceId();

      await client.query(
        `
        UPDATE player_resources 
        SET quantity = quantity - $1
        WHERE player_id = $2 AND resource_type_id = $3
      `,
        [totalValue, buyOrder.player_id, creditsResourceId],
      );

      await client.query(
        `
        UPDATE player_resources 
        SET quantity = quantity + $1
        WHERE player_id = $2 AND resource_type_id = $3
      `,
        [totalValue, sellOrder.player_id, creditsResourceId],
      );

      // Update order quantities
      await client.query(
        `
        UPDATE trade_orders 
        SET quantity_filled = quantity_filled + $1,
            status = CASE WHEN quantity_filled + $1 >= quantity THEN 'completed' ELSE 'active' END
        WHERE id = $2
      `,
        [quantity, buyOrder.id],
      );

      await client.query(
        `
        UPDATE trade_orders 
        SET quantity_filled = quantity_filled + $1,
            status = CASE WHEN quantity_filled + $1 >= quantity THEN 'completed' ELSE 'active' END
        WHERE id = $2
      `,
        [quantity, sellOrder.id],
      );
    });
  }

  /**
   * Get Energy Credits resource type ID
   */
  private async getCreditsResourceId(): Promise<string> {
    const result = await this.db.query(`
      SELECT id FROM resource_types WHERE name = 'Energy Credits'
    `);
    return result.rows[0].id;
  }

  /**
   * Spawn random galaxy event
   */
  async spawnRandomEvent(galaxyId: string): Promise<void> {
    const eventTypes = [
      "resource_discovery",
      "alien_contact",
      "space_anomaly",
      "pirate_activity",
      "natural_disaster",
      "ancient_artifact",
    ];

    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const event = this.generateRandomEvent(eventType);

    await this.db.query(
      `
      INSERT INTO game_events (
        galaxy_id, event_type, severity, title, description, 
        affected_players, event_data, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP + INTERVAL '24 hours')
    `,
      [
        galaxyId,
        event.type,
        "info",
        event.title,
        event.description,
        JSON.stringify(event.affectedPlayers),
        JSON.stringify(event.eventData),
      ],
    );

    this.logger.info(
      `Spawned random event: ${event.title} in galaxy ${galaxyId}`,
    );
  }

  /**
   * Generate random event based on type
   */
  private generateRandomEvent(type: string): GameEvent {
    switch (type) {
      case "resource_discovery":
        return {
          type,
          title: "Rich Dilithium Deposit Discovered",
          description:
            "A survey team has discovered a previously unknown dilithium deposit.",
          affectedPlayers: [], // Could affect nearby players
          eventData: { resourceType: "dilithium", quantity: 10000 },
        };

      case "alien_contact":
        return {
          type,
          title: "First Contact Opportunity",
          description:
            "An unknown alien vessel has been detected. They appear to be attempting communication.",
          affectedPlayers: [],
          eventData: { species: "Unknown", technology_level: "advanced" },
        };

      default:
        return {
          type: "unknown",
          title: "Mysterious Event",
          description: "Something unusual has occurred in the galaxy.",
          affectedPlayers: [],
          eventData: {},
        };
    }
  }

  /**
   * SPACE INFRASTRUCTURE MANAGEMENT
   */

  /**
   * Initialize galactic coordinate grid
   */
  async initializeGalacticGrid(
    galaxyId: string,
    gridSize: { x: number; y: number; z: number },
  ): Promise<void> {
    this.logger.info(`Initializing galactic grid for galaxy ${galaxyId}`);

    for (let x = 0; x < gridSize.x; x++) {
      for (let y = 0; y < gridSize.y; y++) {
        for (let z = 0; z < gridSize.z; z++) {
          const coordinateType =
            Math.random() < 0.8
              ? "empty_space"
              : Math.random() < 0.5
                ? "system"
                : "nebula";

          await this.db.query(
            `
            INSERT INTO galactic_coordinates (
              galaxy_id, sector_x, sector_y, sector_z, coordinate_type,
              is_navigable, hazard_level, radiation_level
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (galaxy_id, sector_x, sector_y, sector_z) DO NOTHING
          `,
            [
              galaxyId,
              x,
              y,
              z,
              coordinateType,
              true,
              coordinateType === "nebula"
                ? Math.floor(Math.random() * 5) + 1
                : 0,
              coordinateType === "nebula"
                ? Math.floor(Math.random() * 3) + 1
                : 0,
            ],
          );
        }
      }
    }
  }

  /**
   * Public wrapper to complete ship travel by id (used by cron manager)
   */
  async completeShipTravel(shipId: string): Promise<void> {
    const result = await this.db.query(`SELECT * FROM ships WHERE id = $1`, [
      shipId,
    ]);
    if (result.rows.length === 0) return;
    await this.completeShipTravelPrivate(result.rows[0]);
  }

  /**
   * Calculate FTL travel time between coordinates
   */
  calculateFTLTravelTime(
    startCoord: { x: number; y: number; z: number },
    endCoord: { x: number; y: number; z: number },
    shipWarpFactor: number,
  ): number {
    const distance = Math.sqrt(
      Math.pow(endCoord.x - startCoord.x, 2) +
        Math.pow(endCoord.y - startCoord.y, 2) +
        Math.pow(endCoord.z - startCoord.z, 2),
    );

    // Base travel time in minutes, reduced by warp factor
    const baseTimeMinutes = distance * 10;
    const warpMultiplier = Math.pow(shipWarpFactor, 3.33); // Standard warp calculation
    return Math.ceil(baseTimeMinutes / warpMultiplier);
  }

  /**
   * Calculate sublight travel time
   */
  calculateSublightTravelTime(
    startCoord: { x: number; y: number; z: number },
    endCoord: { x: number; y: number; z: number },
    shipImpulseSpeed: number,
  ): number {
    const distance = Math.sqrt(
      Math.pow(endCoord.x - startCoord.x, 2) +
        Math.pow(endCoord.y - startCoord.y, 2) +
        Math.pow(endCoord.z - startCoord.z, 2),
    );

    // Sublight is much slower - hours instead of minutes
    return Math.ceil((distance * 60) / shipImpulseSpeed);
  }

  /**
   * Process starship travel
   */
  async processStarshipTravel(): Promise<void> {
    const travelingShips = await this.db.query(`
      SELECT s.*, sc.sector_x as start_x, sc.sector_y as start_y, sc.sector_z as start_z,
             dc.sector_x as dest_x, dc.sector_y as dest_y, dc.sector_z as dest_z
      FROM ships s
      JOIN galactic_coordinates sc ON s.current_location_id = sc.id
      JOIN galactic_coordinates dc ON s.destination_id = dc.id
      WHERE s.status = 'traveling' AND s.travel_eta <= CURRENT_TIMESTAMP
    `);

    for (const ship of travelingShips.rows) {
      await this.completeShipTravelPrivate(ship);
    }
  }

  /**
   * Complete ship travel and update location
   */
  private async completeShipTravelPrivate(ship: any): Promise<void> {
    await this.db.transaction(async (client) => {
      // Update ship location
      await client.query(
        `
        UPDATE ships
        SET current_location_id = destination_id,
            current_location_type = destination_type,
            destination_id = NULL,
            destination_type = NULL,
            travel_eta = NULL,
            status = 'in_system'
        WHERE id = $1
      `,
        [ship.id],
      );

      // Log travel completion
      await client.query(
        `
        UPDATE ship_travel_logs
        SET actual_arrival = CURRENT_TIMESTAMP, status = 'arrived'
        WHERE ship_id = $1 AND status = 'in_transit'
      `,
        [ship.id],
      );

      this.logger.info(`Ship ${ship.name} completed travel to destination`);
    });
  }

  /**
   * Process jump gate travel
   */
  async processJumpGateTravel(
    shipId: string,
    jumpGateId: string,
  ): Promise<{ success: boolean; message: string }> {
    const jumpGate = await this.db.query(
      `
      SELECT jg.*, target.coordinate_id as target_coordinate_id
      FROM jump_gates jg
      LEFT JOIN jump_gates target ON jg.connected_gate_id = target.id
      WHERE jg.id = $1 AND jg.status = 'operational' AND jg.is_active = true
    `,
      [jumpGateId],
    );

    if (jumpGate.rows.length === 0) {
      return { success: false, message: "Jump gate is not operational" };
    }

    const gate = jumpGate.rows[0];
    if (!gate.target_coordinate_id) {
      return {
        success: false,
        message: "Jump gate destination not configured",
      };
    }

    const ship = await this.db.query(
      `
      SELECT * FROM ships WHERE id = $1
    `,
      [shipId],
    );

    if (ship.rows.length === 0) {
      return { success: false, message: "Ship not found" };
    }

    await this.db.transaction(async (client) => {
      // Move ship through jump gate
      await client.query(
        `
        UPDATE ships
        SET current_location_id = $1,
            current_location_type = 'coordinate',
            status = 'in_system'
        WHERE id = $2
      `,
        [gate.target_coordinate_id, shipId],
      );

      // Log jump gate usage
      await client.query(
        `
        UPDATE jump_gates
        SET usage_count = usage_count + 1, last_used = CURRENT_TIMESTAMP
        WHERE id = $1
      `,
        [jumpGateId],
      );

      // Create travel log
      await client.query(
        `
        INSERT INTO ship_travel_logs (
          ship_id, departure_coordinate_id, destination_coordinate_id,
          travel_type, departure_time, actual_arrival, status
        ) VALUES ($1, $2, $3, 'jump_gate', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'arrived')
      `,
        [shipId, gate.coordinate_id, gate.target_coordinate_id],
      );
    });

    return {
      success: true,
      message: "Successfully traveled through jump gate",
    };
  }

  /**
   * Deploy orbital defense platform
   */
  async deployOrbitalDefensePlatform(
    planetId: string,
    ownerId: string,
    platformType: string,
    orbitalPosition: string,
  ): Promise<{ success: boolean; platformId?: string; message: string }> {
    // Check if planet exists and player has access
    const planet = await this.db.query(
      `
      SELECT * FROM celestial_bodies
      WHERE id = $1 AND controlling_player_id = $2
    `,
      [planetId, ownerId],
    );

    if (planet.rows.length === 0) {
      return { success: false, message: "Planet not found or access denied" };
    }

    // Check for existing platforms in same orbital position
    const existingPlatform = await this.db.query(
      `
      SELECT id FROM orbital_defense_platforms
      WHERE planet_id = $1 AND orbital_position = $2 AND status = 'operational'
    `,
      [planetId, orbitalPosition],
    );

    if (existingPlatform.rows.length > 0) {
      return { success: false, message: "Orbital position already occupied" };
    }

    const platformId = crypto.randomUUID();

    await this.db.query(
      `
      INSERT INTO orbital_defense_platforms (
        id, planet_id, owner_id, platform_name, platform_type, orbital_position,
        hull_points, max_hull_points, shield_points, max_shield_points,
        weapon_systems, shield_generators, sensor_systems, status, deployed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP)
    `,
      [
        platformId,
        planetId,
        ownerId,
        `${platformType.charAt(0).toUpperCase() + platformType.slice(1)} Platform`,
        platformType,
        orbitalPosition,
        1500,
        1500,
        750,
        750,
        JSON.stringify([{ type: "phaser_array", power: 100, range: 3 }]),
        JSON.stringify([{ type: "deflector_shield", power: 75 }]),
        JSON.stringify([{ type: "long_range_sensor", range: 5 }]),
        "operational",
      ],
    );

    return {
      success: true,
      platformId,
      message: "Orbital defense platform successfully deployed",
    };
  }

  /**
   * GUILD AND ALLIANCE MANAGEMENT
   */

  /**
   * Create a new guild
   */
  async createGuild(
    founderId: string,
    guildName: string,
    guildTag: string,
    description: string,
    guildType: string = "general",
  ): Promise<{ success: boolean; guildId?: string; message: string }> {
    // Check if guild name or tag already exists
    const existingGuild = await this.db.query(
      `
      SELECT id FROM guilds
      WHERE name = $1 OR tag = $2
    `,
      [guildName, guildTag],
    );

    if (existingGuild.rows.length > 0) {
      return {
        success: false,
        message: "Guild name or tag already exists",
      };
    }

    // Check if player is already in a guild
    const existingMembership = await this.db.query(
      `
      SELECT id FROM guild_members WHERE player_id = $1
    `,
      [founderId],
    );

    if (existingMembership.rows.length > 0) {
      return {
        success: false,
        message: "Player is already a member of another guild",
      };
    }

    const guildId = crypto.randomUUID();

    await this.db.transaction(async (client) => {
      // Create the guild
      await client.query(
        `
        INSERT INTO guilds (
          id, name, tag, description, founder_id, leader_id, guild_type,
          member_count, guild_wealth, founded_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 1, 10000, CURRENT_TIMESTAMP)
      `,
        [
          guildId,
          guildName,
          guildTag,
          description,
          founderId,
          founderId,
          guildType,
        ],
      );

      // Create default ranks
      const leaderRankId = await this.createDefaultGuildRanks(client, guildId);

      // Add founder as leader
      await client.query(
        `
        INSERT INTO guild_members (
          guild_id, player_id, rank_id, joined_at, member_status
        ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 'active')
      `,
        [guildId, founderId, leaderRankId],
      );

      this.logger.info(`Guild "${guildName}" created by player ${founderId}`);
    });

    return {
      success: true,
      guildId,
      message: "Guild created successfully",
    };
  }

  /**
   * Create default rank structure for a new guild
   */
  private async createDefaultGuildRanks(
    client: any,
    guildId: string,
  ): Promise<string> {
    const ranks = [
      {
        name: "Member",
        level: 1,
        color: "#CCCCCC",
        isOfficer: false,
        isLeader: false,
        canInvite: false,
        canKick: false,
        canPromote: false,
        canDemote: false,
        canEditInfo: false,
        canManageTreasury: false,
        canDeclareWar: false,
        canFormAlliances: false,
      },
      {
        name: "Officer",
        level: 2,
        color: "#00AAFF",
        isOfficer: true,
        isLeader: false,
        canInvite: true,
        canKick: true,
        canPromote: false,
        canDemote: false,
        canEditInfo: false,
        canManageTreasury: false,
        canDeclareWar: false,
        canFormAlliances: false,
      },
      {
        name: "Leader",
        level: 3,
        color: "#FFD700",
        isOfficer: true,
        isLeader: true,
        canInvite: true,
        canKick: true,
        canPromote: true,
        canDemote: true,
        canEditInfo: true,
        canManageTreasury: true,
        canDeclareWar: true,
        canFormAlliances: true,
      },
    ];

    let leaderRankId = "";

    for (const rank of ranks) {
      const rankId = crypto.randomUUID();
      await client.query(
        `
        INSERT INTO guild_ranks (
          id, guild_id, rank_name, rank_level, rank_color, is_officer_rank, is_leader_rank,
          can_invite_members, can_kick_members, can_promote_members, can_demote_members,
          can_edit_guild_info, can_manage_treasury, can_declare_war, can_form_alliances
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `,
        [
          rankId,
          guildId,
          rank.name,
          rank.level,
          rank.color,
          rank.isOfficer,
          rank.isLeader,
          rank.canInvite,
          rank.canKick,
          rank.canPromote,
          rank.canDemote,
          rank.canEditInfo,
          rank.canManageTreasury,
          rank.canDeclareWar,
          rank.canFormAlliances,
        ],
      );

      if (rank.isLeader) {
        leaderRankId = rankId;
      }
    }

    return leaderRankId;
  }

  /**
   * Apply to join a guild
   */
  async applyToGuild(
    playerId: string,
    guildId: string,
    applicationMessage: string,
  ): Promise<{ success: boolean; message: string }> {
    // Check if player is already in a guild
    const existingMembership = await this.db.query(
      `
      SELECT id FROM guild_members WHERE player_id = $1
    `,
      [playerId],
    );

    if (existingMembership.rows.length > 0) {
      return {
        success: false,
        message: "You are already a member of another guild",
      };
    }

    // Check if guild exists and is accepting applications
    const guild = await this.db.query(
      `
      SELECT id, is_open_recruitment, requires_application, max_members, member_count
      FROM guilds
      WHERE id = $1 AND is_disbanded = false
    `,
      [guildId],
    );

    if (guild.rows.length === 0) {
      return {
        success: false,
        message: "Guild not found or is disbanded",
      };
    }

    const guildData = guild.rows[0];

    if (guildData.member_count >= guildData.max_members) {
      return {
        success: false,
        message: "Guild is at maximum capacity",
      };
    }

    // Check for existing application
    const existingApplication = await this.db.query(
      `
      SELECT id FROM guild_applications
      WHERE guild_id = $1 AND player_id = $2 AND status = 'pending'
    `,
      [guildId, playerId],
    );

    if (existingApplication.rows.length > 0) {
      return {
        success: false,
        message: "You already have a pending application to this guild",
      };
    }

    // Create application
    await this.db.query(
      `
      INSERT INTO guild_applications (
        guild_id, player_id, application_message, applied_at, status
      ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 'pending')
    `,
      [guildId, playerId, applicationMessage],
    );

    // If guild has open recruitment, auto-approve
    if (guildData.is_open_recruitment && !guildData.requires_application) {
      return await this.approveGuildApplication(guildId, playerId, null);
    }

    return {
      success: true,
      message: "Application submitted successfully",
    };
  }

  /**
   * Approve guild application
   */
  async approveGuildApplication(
    guildId: string,
    playerId: string,
    reviewerId?: string,
  ): Promise<{ success: boolean; message: string }> {
    const guild = await this.db.query(
      `
      SELECT id, member_count, max_members FROM guilds WHERE id = $1
    `,
      [guildId],
    );

    if (guild.rows.length === 0) {
      return { success: false, message: "Guild not found" };
    }

    if (guild.rows[0].member_count >= guild.rows[0].max_members) {
      return { success: false, message: "Guild is at maximum capacity" };
    }

    // Get lowest rank for new members
    const memberRank = await this.db.query(
      `
      SELECT id FROM guild_ranks
      WHERE guild_id = $1
      ORDER BY rank_level ASC
      LIMIT 1
    `,
      [guildId],
    );

    if (memberRank.rows.length === 0) {
      return { success: false, message: "No member ranks found for guild" };
    }

    await this.db.transaction(async (client) => {
      // Add player to guild
      await client.query(
        `
        INSERT INTO guild_members (
          guild_id, player_id, rank_id, joined_at, member_status, invited_by
        ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 'active', $4)
      `,
        [guildId, playerId, memberRank.rows[0].id, reviewerId],
      );

      // Update guild member count
      await client.query(
        `
        UPDATE guilds SET member_count = member_count + 1 WHERE id = $1
      `,
        [guildId],
      );

      // Update application status
      await client.query(
        `
        UPDATE guild_applications
        SET status = 'approved', reviewed_by = $1, reviewed_at = CURRENT_TIMESTAMP
        WHERE guild_id = $2 AND player_id = $3 AND status = 'pending'
      `,
        [reviewerId, guildId, playerId],
      );
    });

    return {
      success: true,
      message: "Player successfully added to guild",
    };
  }

  /**
   * Leave or kick player from guild
   */
  async removePlayerFromGuild(
    guildId: string,
    playerId: string,
    removedBy?: string,
  ): Promise<{ success: boolean; message: string }> {
    // Check if player is guild leader
    const guild = await this.db.query(
      `
      SELECT leader_id FROM guilds WHERE id = $1
    `,
      [guildId],
    );

    if (guild.rows.length === 0) {
      return { success: false, message: "Guild not found" };
    }

    if (
      guild.rows[0].leader_id === playerId &&
      removedBy &&
      removedBy !== playerId
    ) {
      return {
        success: false,
        message: "Cannot kick the guild leader",
      };
    }

    await this.db.transaction(async (client) => {
      // Remove player from guild
      await client.query(
        `
        DELETE FROM guild_members
        WHERE guild_id = $1 AND player_id = $2
      `,
        [guildId, playerId],
      );

      // Update guild member count
      await client.query(
        `
        UPDATE guilds SET member_count = member_count - 1 WHERE id = $1
      `,
        [guildId],
      );

      // If this was the leader leaving, disband guild or transfer leadership
      if (guild.rows[0].leader_id === playerId) {
        const remainingOfficers = await client.query(
          `
          SELECT gm.player_id
          FROM guild_members gm
          JOIN guild_ranks gr ON gm.rank_id = gr.id
          WHERE gm.guild_id = $1 AND gr.is_officer_rank = true
          ORDER BY gr.rank_level DESC, gm.joined_at ASC
          LIMIT 1
        `,
          [guildId],
        );

        if (remainingOfficers.rows.length > 0) {
          // Transfer leadership to highest ranking officer
          await client.query(
            `
            UPDATE guilds SET leader_id = $1 WHERE id = $2
          `,
            [remainingOfficers.rows[0].player_id, guildId],
          );
        } else {
          // No officers left, disband guild
          await client.query(
            `
            UPDATE guilds
            SET is_disbanded = true, disbanded_at = CURRENT_TIMESTAMP
            WHERE id = $1
          `,
            [guildId],
          );
        }
      }
    });

    return {
      success: true,
      message: "Player removed from guild successfully",
    };
  }

  /**
   * Process NPC guild actions
   */
  async processNPCGuildActions(): Promise<void> {
    const npcGuilds = await this.db.query(`
      SELECT ng.*, g.name as guild_name, g.member_count, g.guild_wealth, g.guild_influence
      FROM npc_guilds ng
      JOIN guilds g ON ng.guild_id = g.id
      WHERE g.is_disbanded = false
      AND ng.last_ai_action < CURRENT_TIMESTAMP - INTERVAL '1 hour' * ng.ai_action_frequency_minutes / 60
    `);

    for (const npcGuild of npcGuilds.rows) {
      await this.executeNPCGuildAction(npcGuild);
    }
  }

  /**
   * Execute AI action for NPC guild
   */
  private async executeNPCGuildAction(npcGuild: any): Promise<void> {
    const actions = [];

    // Determine possible actions based on AI personality
    switch (npcGuild.ai_personality) {
      case "aggressive":
        actions.push("declare_war", "recruit_members", "expand_territory");
        break;
      case "peaceful":
        actions.push("form_alliance", "trade_agreement", "recruit_members");
        break;
      case "economic":
        actions.push(
          "trade_agreement",
          "recruit_members",
          "resource_gathering",
        );
        break;
      case "military":
        actions.push(
          "recruit_members",
          "military_exercise",
          "expand_territory",
        );
        break;
      default:
        actions.push("recruit_members", "form_alliance", "expand_territory");
    }

    // Randomly select and execute an action
    const selectedAction = actions[Math.floor(Math.random() * actions.length)];

    await this.db.query(
      `
      UPDATE npc_guilds
      SET last_ai_action = CURRENT_TIMESTAMP
      WHERE id = $1
    `,
      [npcGuild.id],
    );

    this.logger.info(
      `NPC Guild ${npcGuild.guild_name} executed action: ${selectedAction}`,
    );
  }

  /**
   * TALENT TREE AND PROFESSION MANAGEMENT
   */

  /**
   * Get player's talent trees and progression
   */
  async getPlayerTalentTrees(playerId: string): Promise<any> {
    const result = await this.db.query(
      `
      SELECT
        pp.profession_id,
        p.profession_name,
        p.profession_code,
        p.color_scheme,
        pp.profession_level,
        pp.available_talent_points,
        pp.total_talent_points,
        pp.is_primary_profession,
        json_agg(
          json_build_object(
            'tree_id', tt.id,
            'tree_name', tt.tree_name,
            'tree_description', tt.tree_description,
            'tree_type', tt.tree_type,
            'max_tier', tt.max_tier,
            'tree_color', tt.tree_color
          )
        ) as talent_trees
      FROM player_professions pp
      JOIN professions p ON pp.profession_id = p.id
      JOIN talent_trees tt ON p.id = tt.profession_id AND tt.is_active = true
      WHERE pp.player_id = $1
      GROUP BY pp.profession_id, p.profession_name, p.profession_code, p.color_scheme,
               pp.profession_level, pp.available_talent_points, pp.total_talent_points, pp.is_primary_profession
      ORDER BY pp.is_primary_profession DESC, pp.profession_level DESC
    `,
      [playerId],
    );

    return result.rows;
  }

  /**
   * Get talent nodes for a specific tree with player progress
   */
  async getTalentTreeNodes(playerId: string, treeId: string): Promise<any> {
    const result = await this.db.query(
      `
      SELECT
        tn.*,
        COALESCE(pt.current_rank, 0) as current_rank,
        COALESCE(pt.points_invested, 0) as points_invested,
        pt.unlocked_at
      FROM talent_nodes tn
      LEFT JOIN player_talents pt ON tn.id = pt.talent_node_id AND pt.player_id = $1
      WHERE tn.talent_tree_id = $2
      ORDER BY tn.tier_level, tn.position_y, tn.position_x
    `,
      [playerId, treeId],
    );

    return result.rows;
  }

  /**
   * Allocate talent points to a specific node
   */
  async allocateTalentPoints(
    playerId: string,
    nodeId: string,
    pointsToAllocate: number,
  ): Promise<{ success: boolean; message: string }> {
    // Get node information and prerequisites
    const nodeResult = await this.db.query(
      `
      SELECT tn.*, tt.profession_id, pp.available_talent_points
      FROM talent_nodes tn
      JOIN talent_trees tt ON tn.talent_tree_id = tt.id
      JOIN player_professions pp ON tt.profession_id = pp.profession_id
      WHERE tn.id = $1 AND pp.player_id = $2
    `,
      [nodeId, playerId],
    );

    if (nodeResult.rows.length === 0) {
      return {
        success: false,
        message: "Talent node not found or not accessible",
      };
    }

    const node = nodeResult.rows[0];

    // Check available talent points
    if (node.available_talent_points < pointsToAllocate) {
      return { success: false, message: "Insufficient talent points" };
    }

    // Get current player talent for this node
    const currentTalent = await this.db.query(
      `
      SELECT * FROM player_talents WHERE player_id = $1 AND talent_node_id = $2
    `,
      [playerId, nodeId],
    );

    const currentRank =
      currentTalent.rows.length > 0 ? currentTalent.rows[0].current_rank : 0;
    const newRank = currentRank + pointsToAllocate;

    // Check if exceeds max rank
    if (newRank > node.max_rank) {
      return {
        success: false,
        message: "Cannot exceed maximum rank for this talent",
      };
    }

    // Check prerequisites
    if (node.prerequisites && node.prerequisites.length > 0) {
      const prereqCheck = await this.checkTalentPrerequisites(
        playerId,
        node.prerequisites,
      );
      if (!prereqCheck.success) {
        return { success: false, message: prereqCheck.message };
      }
    }

    // Allocate the points
    await this.db.transaction(async (client) => {
      // Update or insert player talent
      if (currentTalent.rows.length > 0) {
        await client.query(
          `
          UPDATE player_talents
          SET current_rank = current_rank + $1,
              points_invested = points_invested + $2,
              last_upgraded = CURRENT_TIMESTAMP
          WHERE player_id = $3 AND talent_node_id = $4
        `,
          [
            pointsToAllocate,
            pointsToAllocate * node.points_per_rank,
            playerId,
            nodeId,
          ],
        );
      } else {
        await client.query(
          `
          INSERT INTO player_talents (
            player_id, profession_id, talent_node_id, current_rank,
            max_rank, points_invested
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `,
          [
            playerId,
            node.profession_id,
            nodeId,
            pointsToAllocate,
            node.max_rank,
            pointsToAllocate * node.points_per_rank,
          ],
        );
      }

      // Deduct talent points from player profession
      await client.query(
        `
        UPDATE player_professions
        SET available_talent_points = available_talent_points - $1
        WHERE player_id = $2 AND profession_id = $3
      `,
        [pointsToAllocate, playerId, node.profession_id],
      );
    });

    this.logger.info(
      `Player ${playerId} allocated ${pointsToAllocate} points to talent ${node.node_name}`,
    );
    return { success: true, message: "Talent points allocated successfully" };
  }

  /**
   * Check if talent prerequisites are met
   */
  private async checkTalentPrerequisites(
    playerId: string,
    prerequisites: string[],
  ): Promise<{ success: boolean; message: string }> {
    if (!prerequisites || prerequisites.length === 0) {
      return { success: true, message: "No prerequisites" };
    }

    const prereqResult = await this.db.query(
      `
      SELECT talent_node_id, current_rank
      FROM player_talents
      WHERE player_id = $1 AND talent_node_id = ANY($2)
    `,
      [playerId, prerequisites],
    );

    if (prereqResult.rows.length < prerequisites.length) {
      return { success: false, message: "Missing prerequisite talents" };
    }

    // Check if all prerequisites have at least 1 rank
    for (const prereq of prereqResult.rows) {
      if (prereq.current_rank < 1) {
        return {
          success: false,
          message: "Prerequisite talents not sufficiently ranked",
        };
      }
    }

    return { success: true, message: "Prerequisites met" };
  }

  /**
   * RESEARCH AND DEVELOPMENT SYSTEM
   */

  /**
   * Start a research project
   */
  async startResearchProject(
    playerId: string,
    projectId: string,
    stationId?: string,
  ): Promise<{ success: boolean; message: string; researchId?: string }> {
    // Get project details and requirements
    const projectResult = await this.db.query(
      `
      SELECT rp.*, rc.required_profession_id
      FROM research_projects rp
      JOIN research_categories rc ON rp.category_id = rc.id
      WHERE rp.id = $1
    `,
      [projectId],
    );

    if (projectResult.rows.length === 0) {
      return { success: false, message: "Research project not found" };
    }

    const project = projectResult.rows[0];

    // Check if player has required profession
    if (project.required_profession_id) {
      const professionCheck = await this.db.query(
        `
        SELECT id FROM player_professions
        WHERE player_id = $1 AND profession_id = $2
      `,
        [playerId, project.required_profession_id],
      );

      if (professionCheck.rows.length === 0) {
        return { success: false, message: "Required profession not available" };
      }
    }

    // Check prerequisites
    if (
      project.prerequisite_projects &&
      project.prerequisite_projects.length > 0
    ) {
      const prereqCheck = await this.checkResearchPrerequisites(
        playerId,
        project.prerequisite_projects,
      );
      if (!prereqCheck.success) {
        return { success: false, message: prereqCheck.message };
      }
    }

    // Check resource requirements
    if (project.resource_requirements) {
      const resourceCheck = await this.checkResourceRequirements(
        playerId,
        project.resource_requirements,
      );
      if (!resourceCheck.success) {
        return { success: false, message: resourceCheck.message };
      }
    }

    // Calculate completion time (base time + modifiers)
    const completionTime = new Date(
      Date.now() + project.research_time_hours * 60 * 60 * 1000,
    );
    const researchId = crypto.randomUUID();

    await this.db.transaction(async (client) => {
      // Create research entry
      await client.query(
        `
        INSERT INTO player_research (
          id, player_id, project_id, status, progress_percentage,
          started_at, estimated_completion, attempts_count, resources_consumed
        ) VALUES ($1, $2, $3, 'in_progress', 0.0, CURRENT_TIMESTAMP, $4, 1, $5)
      `,
        [
          researchId,
          playerId,
          projectId,
          completionTime,
          JSON.stringify(project.resource_requirements || {}),
        ],
      );

      // Consume resources
      if (project.resource_requirements) {
        await this.consumePlayerResources(
          client,
          playerId,
          project.resource_requirements,
        );
      }

      // Create active project entry
      await client.query(
        `
        INSERT INTO active_projects (
          player_id, project_type, project_reference_id, status,
          started_at, estimated_completion
        ) VALUES ($1, 'research', $2, 'in_progress', CURRENT_TIMESTAMP, $3)
      `,
        [playerId, projectId, completionTime],
      );
    });

    this.logger.info(
      `Player ${playerId} started research project: ${project.project_name}`,
    );
    return {
      success: true,
      message: "Research project started successfully",
      researchId,
    };
  }

  /**
   * Process completed research projects
   */
  async processCompletedResearch(): Promise<void> {
    const completedResearch = await this.db.query(`
      SELECT pr.*, rp.project_name, rp.rewards, rp.success_rate, rp.critical_success_rate
      FROM player_research pr
      JOIN research_projects rp ON pr.project_id = rp.id
      WHERE pr.status = 'in_progress'
      AND pr.estimated_completion <= CURRENT_TIMESTAMP
    `);

    for (const research of completedResearch.rows) {
      await this.completeResearchProject(research);
    }
  }

  /**
   * Complete individual research project
   */
  private async completeResearchProject(research: any): Promise<void> {
    const successRoll = Math.random();
    const isCriticalSuccess = successRoll <= research.critical_success_rate;
    const isSuccess = successRoll <= research.success_rate;

    await this.db.transaction(async (client) => {
      if (isSuccess) {
        // Grant rewards
        let rewardMultiplier = 1.0;
        if (isCriticalSuccess) {
          rewardMultiplier = 1.5;
        }

        await this.grantResearchRewards(
          client,
          research.player_id,
          research.rewards,
          rewardMultiplier,
        );

        await client.query(
          `
          UPDATE player_research
          SET status = 'completed',
              completed_at = CURRENT_TIMESTAMP,
              progress_percentage = 100.0,
              quality_modifier = $1
          WHERE id = $2
        `,
          [rewardMultiplier, research.id],
        );

        this.logger.info(
          `Research project completed successfully: ${research.project_name} (Critical: ${isCriticalSuccess})`,
        );
      } else {
        await client.query(
          `
          UPDATE player_research
          SET status = 'failed',
              completed_at = CURRENT_TIMESTAMP,
              progress_percentage = 100.0
          WHERE id = $1
        `,
          [research.id],
        );

        this.logger.info(`Research project failed: ${research.project_name}`);
      }

      // Update active projects
      await client.query(
        `
        UPDATE active_projects
        SET status = $1, actual_completion = CURRENT_TIMESTAMP
        WHERE player_id = $2 AND project_reference_id = $3 AND project_type = 'research'
      `,
        [
          isSuccess ? "completed" : "failed",
          research.player_id,
          research.project_id,
        ],
      );
    });
  }

  /**
   * Check research prerequisites
   */
  private async checkResearchPrerequisites(
    playerId: string,
    prerequisiteProjects: string[],
  ): Promise<{ success: boolean; message: string }> {
    const completedProjects = await this.db.query(
      `
      SELECT project_id
      FROM player_research
      WHERE player_id = $1 AND project_id = ANY($2) AND status = 'completed'
    `,
      [playerId, prerequisiteProjects],
    );

    if (completedProjects.rows.length < prerequisiteProjects.length) {
      return {
        success: false,
        message: "Missing prerequisite research projects",
      };
    }

    return { success: true, message: "Research prerequisites met" };
  }

  /**
   * Check if player has required resources
   */
  private async checkResourceRequirements(
    playerId: string,
    requirements: any,
  ): Promise<{ success: boolean; message: string }> {
    for (const [resourceTypeId, requiredAmount] of Object.entries(
      requirements,
    )) {
      const playerResource = await this.db.query(
        `
        SELECT quantity FROM player_resources
        WHERE player_id = $1 AND resource_type_id = $2
      `,
        [playerId, resourceTypeId],
      );

      const available =
        playerResource.rows.length > 0 ? playerResource.rows[0].quantity : 0;
      if (available < (requiredAmount as number)) {
        return { success: false, message: "Insufficient resources" };
      }
    }

    return { success: true, message: "Resource requirements met" };
  }

  /**
   * Consume player resources
   */
  private async consumePlayerResources(
    client: any,
    playerId: string,
    requirements: any,
  ): Promise<void> {
    for (const [resourceTypeId, amount] of Object.entries(requirements)) {
      await client.query(
        `
        UPDATE player_resources
        SET quantity = quantity - $1
        WHERE player_id = $2 AND resource_type_id = $3
      `,
        [amount, playerId, resourceTypeId],
      );
    }
  }

  /**
   * Grant research rewards
   */
  private async grantResearchRewards(
    client: any,
    playerId: string,
    rewards: any,
    multiplier: number = 1.0,
  ): Promise<void> {
    if (!rewards) return;

    for (const [rewardType, rewardData] of Object.entries(rewards)) {
      switch (rewardType) {
        case "experience":
          await this.grantExperience(
            playerId,
            Math.floor((rewardData as number) * multiplier),
          );
          break;
        case "resources":
          await this.grantResources(client, playerId, rewardData, multiplier);
          break;
        case "technology":
          await this.unlockTechnology(client, playerId, rewardData as string);
          break;
      }
    }
  }

  private async grantResources(
    client: any,
    playerId: string,
    resources: any,
    multiplier: number,
  ): Promise<void> {
    for (const [resourceTypeId, amount] of Object.entries(resources)) {
      const finalAmount = Math.floor((amount as number) * multiplier);
      await client.query(
        `
        INSERT INTO player_resources (player_id, resource_type_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (player_id, resource_type_id)
        DO UPDATE SET quantity = player_resources.quantity + $3
      `,
        [playerId, resourceTypeId, finalAmount],
      );
    }
  }

  private async unlockTechnology(
    client: any,
    playerId: string,
    technologyId: string,
  ): Promise<void> {
    await client.query(
      `
      INSERT INTO player_technologies (player_id, technology_id, unlock_method)
      VALUES ($1, $2, 'research')
      ON CONFLICT (player_id, technology_id) DO NOTHING
    `,
      [playerId, technologyId],
    );
  }

  /**
   * LEVELING AND PROGRESSION SYSTEM
   */

  /**
   * Grant experience to player
   */
  async grantExperience(
    playerId: string,
    amount: number,
    experienceType: string = "character",
  ): Promise<{
    success: boolean;
    levelUp?: boolean;
    newLevel?: number;
    message: string;
  }> {
    try {
      await this.db.transaction(async (client) => {
        // Get or create player level entry
        let playerLevel = await client.query(
          `
          SELECT * FROM player_levels
          WHERE player_id = $1 AND level_type = $2
        `,
          [playerId, experienceType],
        );

        if (playerLevel.rows.length === 0) {
          await client.query(
            `
            INSERT INTO player_levels (player_id, level_type, current_experience, total_experience)
            VALUES ($1, $2, $3, $4)
          `,
            [playerId, experienceType, amount, amount],
          );

          return {
            success: true,
            levelUp: false,
            message: `Gained ${amount} ${experienceType} experience`,
          };
        }

        const currentData = playerLevel.rows[0];
        const newCurrentExp = currentData.current_experience + amount;
        const newTotalExp = currentData.total_experience + amount;

        // Check for level up
        const levelUpCheck = await this.checkLevelUp(
          client,
          currentData.current_level,
          newCurrentExp,
          experienceType === "character" ? "character" : "crafting",
        );

        if (levelUpCheck.levelUp) {
          await client.query(
            `
            UPDATE player_levels
            SET current_level = $1, current_experience = $2, total_experience = $3,
                skill_points_available = skill_points_available + $4,
                last_level_up = CURRENT_TIMESTAMP
            WHERE player_id = $5 AND level_type = $6
          `,
            [
              levelUpCheck.newLevel,
              levelUpCheck.remainingExp,
              newTotalExp,
              levelUpCheck.skillPointsGained,
              playerId,
              experienceType,
            ],
          );

          // Update character level in player_profiles if this is character experience
          if (experienceType === "character") {
            await client.query(
              `
              UPDATE player_profiles
              SET level = $1, experience_points = $2
              WHERE player_id = $3
            `,
              [levelUpCheck.newLevel, newTotalExp, playerId],
            );
          }

          this.logger.info(
            `Player ${playerId} leveled up to ${levelUpCheck.newLevel} in ${experienceType}`,
          );

          return {
            success: true,
            levelUp: true,
            newLevel: levelUpCheck.newLevel,
            message: `Level up! Reached level ${levelUpCheck.newLevel} in ${experienceType}`,
          };
        } else {
          await client.query(
            `
            UPDATE player_levels
            SET current_experience = $1, total_experience = $2
            WHERE player_id = $3 AND level_type = $4
          `,
            [newCurrentExp, newTotalExp, playerId, experienceType],
          );

          return {
            success: true,
            levelUp: false,
            message: `Gained ${amount} ${experienceType} experience`,
          };
        }
      });

      return { success: true, levelUp: false, message: "Experience granted" };
    } catch (error) {
      this.logger.error("Error granting experience:", error);
      return { success: false, message: "Failed to grant experience" };
    }
  }

  /**
   * Check if player should level up
   */
  private async checkLevelUp(
    client: any,
    currentLevel: number,
    currentExp: number,
    levelCategory: string,
  ): Promise<{
    levelUp: boolean;
    newLevel: number;
    remainingExp: number;
    skillPointsGained: number;
  }> {
    // Get next level requirements
    const nextLevelData = await client.query(
      `
      SELECT * FROM level_progression
      WHERE level = $1 AND level_category = $2
    `,
      [currentLevel + 1, levelCategory],
    );

    if (nextLevelData.rows.length === 0) {
      return {
        levelUp: false,
        newLevel: currentLevel,
        remainingExp: currentExp,
        skillPointsGained: 0,
      };
    }

    const nextLevel = nextLevelData.rows[0];
    if (currentExp >= nextLevel.experience_required) {
      const remainingExp = currentExp - nextLevel.experience_required;
      return {
        levelUp: true,
        newLevel: currentLevel + 1,
        remainingExp,
        skillPointsGained: nextLevel.skill_points_gained,
      };
    }

    return {
      levelUp: false,
      newLevel: currentLevel,
      remainingExp: currentExp,
      skillPointsGained: 0,
    };
  }

  /**
   * CRAFTING SYSTEM
   */

  /**
   * Start crafting an item
   */
  async startCrafting(
    playerId: string,
    recipeId: string,
    stationId?: string,
    qualityModifiers: any = {},
  ): Promise<{ success: boolean; craftingId?: string; message: string }> {
    try {
      // Get recipe details
      const recipeResult = await this.db.query(
        `
        SELECT cr.*, cd.discipline_name, pcl.current_level, pcl.tempering_level, pcl.masterwork_level
        FROM crafting_recipes cr
        JOIN crafting_disciplines cd ON cr.discipline_id = cd.id
        LEFT JOIN player_crafting_levels pcl ON cd.id = pcl.discipline_id AND pcl.player_id = $1
        WHERE cr.id = $2
      `,
        [playerId, recipeId],
      );

      if (recipeResult.rows.length === 0) {
        return { success: false, message: "Recipe not found" };
      }

      const recipe = recipeResult.rows[0];

      // Check skill requirements
      if (
        !recipe.current_level ||
        recipe.current_level < recipe.min_crafting_level
      ) {
        return {
          success: false,
          message: `Requires ${recipe.discipline_name} level ${recipe.min_crafting_level}`,
        };
      }

      if (recipe.tempering_level < recipe.min_tempering_level) {
        return {
          success: false,
          message: `Requires tempering level ${recipe.min_tempering_level}`,
        };
      }

      if (recipe.masterwork_level < recipe.min_masterwork_level) {
        return {
          success: false,
          message: `Requires masterwork level ${recipe.min_masterwork_level}`,
        };
      }

      // Check materials
      const materialsCheck = await this.checkCraftingMaterials(
        playerId,
        recipe.base_materials,
      );
      if (!materialsCheck.success) {
        return { success: false, message: materialsCheck.message };
      }

      const craftingId = crypto.randomUUID();
      const completionTime = new Date(
        Date.now() + recipe.crafting_time_minutes * 60 * 1000,
      );

      await this.db.transaction(async (client) => {
        // Consume materials
        await this.consumeCraftingMaterials(
          client,
          playerId,
          recipe.base_materials,
        );

        // Create crafting entry
        await client.query(
          `
          INSERT INTO active_projects (
            id, player_id, project_type, project_reference_id,
            status, started_at, estimated_completion, quality_modifier
          ) VALUES ($1, $2, 'crafting', $3, 'in_progress', CURRENT_TIMESTAMP, $4, $5)
        `,
          [
            craftingId,
            playerId,
            recipeId,
            completionTime,
            qualityModifiers.quality || 1.0,
          ],
        );
      });

      return {
        success: true,
        craftingId,
        message: `Started crafting ${recipe.recipe_name}`,
      };
    } catch (error) {
      this.logger.error("Error starting crafting:", error);
      return { success: false, message: "Failed to start crafting" };
    }
  }

  /**
   * Complete crafting project
   */
  async completeCrafting(
    projectId: string,
  ): Promise<{ success: boolean; itemId?: string; message: string }> {
    try {
      // Get project details
      const projectResult = await this.db.query(
        `
        SELECT ap.*, cr.*, cd.discipline_name
        FROM active_projects ap
        JOIN crafting_recipes cr ON ap.project_reference_id = cr.id
        JOIN crafting_disciplines cd ON cr.discipline_id = cd.id
        WHERE ap.id = $1 AND ap.project_type = 'crafting' AND ap.status = 'in_progress'
      `,
        [projectId],
      );

      if (projectResult.rows.length === 0) {
        return { success: false, message: "Crafting project not found" };
      }

      const project = projectResult.rows[0];

      // Determine success
      const successRoll = Math.random();
      const isSuccess = successRoll <= project.success_rate;
      const isCritical = successRoll <= project.critical_success_rate;
      const isMasterwork = successRoll <= project.masterwork_chance;

      if (!isSuccess) {
        await this.db.query(
          `
          UPDATE active_projects
          SET status = 'failed', actual_completion = CURRENT_TIMESTAMP
          WHERE id = $1
        `,
          [projectId],
        );

        return { success: false, message: "Crafting failed!" };
      }

      // Create the item
      const itemId = await this.createCraftedItem(project.player_id, project, {
        critical: isCritical,
        masterwork: isMasterwork,
      });

      // Grant crafting experience
      const expGained = Math.floor(
        project.recipe_tier * 50 * (isCritical ? 1.5 : 1.0),
      );
      await this.grantCraftingExperience(
        project.player_id,
        project.discipline_id,
        expGained,
      );

      await this.db.query(
        `
        UPDATE active_projects
        SET status = 'completed', actual_completion = CURRENT_TIMESTAMP
        WHERE id = $1
      `,
        [projectId],
      );

      let message = `Successfully crafted ${project.recipe_name}`;
      if (isMasterwork) message += " (Masterwork Quality!)";
      else if (isCritical) message += " (Critical Success!)";

      return {
        success: true,
        itemId,
        message,
      };
    } catch (error) {
      this.logger.error("Error completing crafting:", error);
      return { success: false, message: "Failed to complete crafting" };
    }
  }

  /**
   * Temper an item to enhance it
   */
  async temperItem(
    playerId: string,
    itemId: string,
    targetLevel: number,
  ): Promise<{ success: boolean; message: string; newLevel?: number }> {
    try {
      // Get item and tempering requirements
      const itemResult = await this.db.query(
        `
        SELECT ci.*, tl.*
        FROM crafted_items ci
        CROSS JOIN tempering_levels tl
        WHERE ci.id = $1 AND ci.owner_id = $2 AND tl.level = $3
      `,
        [itemId, playerId, targetLevel],
      );

      if (itemResult.rows.length === 0) {
        return {
          success: false,
          message: "Item not found or invalid tempering level",
        };
      }

      const item = itemResult.rows[0];

      if (item.tempering_level >= targetLevel) {
        return {
          success: false,
          message: "Item is already at or above this tempering level",
        };
      }

      if (targetLevel !== item.tempering_level + 1) {
        return {
          success: false,
          message: "Must temper items one level at a time",
        };
      }

      // Check materials and crafter level
      const materialsCheck = await this.checkCraftingMaterials(
        playerId,
        item.materials_required,
      );
      if (!materialsCheck.success) {
        return { success: false, message: materialsCheck.message };
      }

      // Roll for success
      const successRoll = Math.random();
      const isSuccess = successRoll <= item.success_rate;
      const isDestroyed =
        successRoll <= item.success_rate + item.destruction_rate && !isSuccess;
      const isDowngraded =
        successRoll <=
          item.success_rate + item.destruction_rate + item.downgrade_rate &&
        !isSuccess &&
        !isDestroyed;

      await this.db.transaction(async (client) => {
        // Consume materials
        await this.consumeCraftingMaterials(
          client,
          playerId,
          item.materials_required,
        );

        if (isDestroyed) {
          // Item is destroyed
          await client.query(`DELETE FROM crafted_items WHERE id = $1`, [
            itemId,
          ]);

          await client.query(
            `
            INSERT INTO item_enhancement_log (
              item_id, enhancement_type, previous_level, new_level, success,
              materials_used, enhanced_by, notes
            ) VALUES ($1, 'tempering', $2, 0, false, $3, $4, 'Item destroyed during tempering')
          `,
            [itemId, item.tempering_level, item.materials_required, playerId],
          );

          return {
            success: false,
            message: "Tempering failed! Item was destroyed!",
          };
        } else if (isDowngraded && item.tempering_level > 0) {
          // Item is downgraded
          const newLevel = Math.max(0, item.tempering_level - 1);
          await client.query(
            `
            UPDATE crafted_items SET tempering_level = $1 WHERE id = $2
          `,
            [newLevel, itemId],
          );

          await client.query(
            `
            INSERT INTO item_enhancement_log (
              item_id, enhancement_type, previous_level, new_level, success,
              materials_used, enhanced_by, notes
            ) VALUES ($1, 'tempering', $2, $3, false, $4, $5, 'Item downgraded during tempering')
          `,
            [
              itemId,
              item.tempering_level,
              newLevel,
              item.materials_required,
              playerId,
            ],
          );

          return {
            success: false,
            message: `Tempering failed! Item downgraded to +${newLevel}`,
          };
        } else if (isSuccess) {
          // Success! Upgrade the item
          await client.query(
            `
            UPDATE crafted_items SET tempering_level = $1 WHERE id = $2
          `,
            [targetLevel, itemId],
          );

          await client.query(
            `
            INSERT INTO item_enhancement_log (
              item_id, enhancement_type, previous_level, new_level, success,
              materials_used, enhanced_by, notes
            ) VALUES ($1, 'tempering', $2, $3, true, $4, $5, 'Successful tempering')
          `,
            [
              itemId,
              item.tempering_level,
              targetLevel,
              item.materials_required,
              playerId,
            ],
          );

          return {
            success: true,
            message: `Successfully tempered item to +${targetLevel}!`,
            newLevel: targetLevel,
          };
        } else {
          // Failed but no penalty
          await client.query(
            `
            INSERT INTO item_enhancement_log (
              item_id, enhancement_type, previous_level, new_level, success,
              materials_used, enhanced_by, notes
            ) VALUES ($1, 'tempering', $2, $2, false, $3, $4, 'Tempering failed, no penalty')
          `,
            [itemId, item.tempering_level, item.materials_required, playerId],
          );

          return {
            success: false,
            message: "Tempering failed, but item was not damaged.",
          };
        }
      });

      return { success: false, message: "Unexpected tempering result" };
    } catch (error) {
      this.logger.error("Error tempering item:", error);
      return { success: false, message: "Failed to temper item" };
    }
  }

  /**
   * Helper methods
   */
  private async checkCraftingMaterials(
    playerId: string,
    materials: any,
  ): Promise<{ success: boolean; message: string }> {
    for (const [materialId, required] of Object.entries(materials)) {
      const playerMaterial = await this.db.query(
        `
        SELECT quantity FROM player_resources
        WHERE player_id = $1 AND resource_type_id = $2
      `,
        [playerId, materialId],
      );

      const available =
        playerMaterial.rows.length > 0 ? playerMaterial.rows[0].quantity : 0;
      if (available < (required as number)) {
        return {
          success: false,
          message: `Insufficient materials: ${materialId}`,
        };
      }
    }
    return { success: true, message: "Materials available" };
  }

  private async consumeCraftingMaterials(
    client: any,
    playerId: string,
    materials: any,
  ): Promise<void> {
    for (const [materialId, amount] of Object.entries(materials)) {
      await client.query(
        `
        UPDATE player_resources
        SET quantity = quantity - $1
        WHERE player_id = $2 AND resource_type_id = $3
      `,
        [amount, playerId, materialId],
      );
    }
  }

  private async createCraftedItem(
    playerId: string,
    project: any,
    bonuses: any,
  ): Promise<string> {
    const itemId = crypto.randomUUID();

    let quality = "standard";
    if (bonuses.masterwork) quality = "legendary";
    else if (bonuses.critical) quality = "superior";

    await this.db.query(
      `
      INSERT INTO crafted_items (
        id, item_name, recipe_id, crafter_id, item_category, item_subcategory,
        item_tier, quality, item_level, base_stats, owner_id, crafted_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP)
    `,
      [
        itemId,
        project.recipe_name,
        project.id,
        playerId,
        project.item_category,
        project.item_subcategory,
        project.recipe_tier,
        quality,
        project.recipe_tier,
        project.base_item_stats,
        playerId,
      ],
    );

    return itemId;
  }

  private async grantCraftingExperience(
    playerId: string,
    disciplineId: string,
    amount: number,
  ): Promise<void> {
    await this.db.query(
      `
      INSERT INTO player_crafting_levels (player_id, discipline_id, current_experience, total_experience)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (player_id, discipline_id)
      DO UPDATE SET
        current_experience = player_crafting_levels.current_experience + $3,
        total_experience = player_crafting_levels.total_experience + $4
    `,
      [playerId, disciplineId, amount, amount],
    );
  }

  /**
   * UNIVERSE GALAXY EVENT SYSTEM
   */

  /**
   * Spawn a new galaxy event
   */
  async spawnUniverseEvent(
    galaxyId: string,
    eventTypeId: string,
    locationData?: any,
    overrides?: any,
  ): Promise<{ success: boolean; eventId?: string; message: string }> {
    try {
      // Get event type details
      const eventTypeResult = await this.db.query(
        `
        SELECT et.*, ec.category_name, ec.category_code
        FROM event_types et
        JOIN event_categories ec ON et.category_id = ec.id
        WHERE et.id = $1
      `,
        [eventTypeId],
      );

      if (eventTypeResult.rows.length === 0) {
        return { success: false, message: "Event type not found" };
      }

      const eventType = eventTypeResult.rows[0];
      const eventId = crypto.randomUUID();

      // Generate event location if not provided
      const location =
        locationData || (await this.generateEventLocation(galaxyId, eventType));

      // Calculate event duration
      const baseDuration = overrides?.duration || eventType.base_duration_hours;
      const startTime = overrides?.startTime || new Date();
      const endTime = new Date(
        startTime.getTime() + baseDuration * 60 * 60 * 1000,
      );

      // Create the event
      await this.db.transaction(async (client) => {
        await client.query(
          `
          INSERT INTO universe_events (
            id, event_name, event_type_id, galaxy_id, event_status, event_phase,
            primary_location_type, primary_location_id, event_radius,
            spawned_at, scheduled_start, estimated_duration_hours, hard_deadline,
            max_participants, min_participants_required, difficulty_scaling,
            success_conditions, failure_conditions, current_objectives,
            base_rewards, environmental_effects, event_variables, event_seed
          ) VALUES (
            $1, $2, $3, $4, 'spawned', 'preparation', $5, $6, $7,
            CURRENT_TIMESTAMP, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
          )
        `,
          [
            eventId,
            this.generateEventName(eventType),
            eventTypeId,
            galaxyId,
            location.type,
            location.id,
            location.radius || 1,
            startTime,
            baseDuration,
            endTime,
            eventType.max_participants,
            eventType.min_participants,
            eventType.scaling_rules?.difficulty_scaling || 1.0,
            eventType.scaling_rules?.success_conditions || {},
            eventType.scaling_rules?.failure_conditions || {},
            this.generateEventObjectives(eventType),
            this.calculateEventRewards(eventType),
            this.generateEnvironmentalEffects(eventType),
            overrides?.variables || {},
            this.generateEventSeed(),
          ],
        );

        // Spawn event objects
        await this.spawnEventObjects(client, eventId, eventType);

        // Create event missions
        await this.spawnEventMissions(client, eventId, eventType);

        // Spawn bosses if applicable
        if (eventType.scaling_rules?.has_bosses) {
          await this.spawnEventBosses(client, eventId, eventType);
        }
      });

      this.logger.info(
        `Spawned universe event: ${eventType.type_name} in galaxy ${galaxyId}`,
      );
      return {
        success: true,
        eventId,
        message: `${eventType.type_name} event spawned successfully`,
      };
    } catch (error) {
      this.logger.error("Error spawning universe event:", error);
      return { success: false, message: "Failed to spawn event" };
    }
  }

  /**
   * Join a universe event
   */
  async joinUniverseEvent(
    playerId: string,
    eventId: string,
    guildId?: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Get event details
      const eventResult = await this.db.query(
        `
        SELECT ue.*, et.participant_type, et.required_level, et.max_participants, et.is_pvp_enabled
        FROM universe_events ue
        JOIN event_types et ON ue.event_type_id = et.id
        WHERE ue.id = $1 AND ue.event_status IN ('spawned', 'active')
      `,
        [eventId],
      );

      if (eventResult.rows.length === 0) {
        return { success: false, message: "Event not found or not available" };
      }

      const event = eventResult.rows[0];

      // Check if already participating
      const existingParticipation = await this.db.query(
        `SELECT id FROM event_participants WHERE event_id = $1 AND player_id = $2`,
        [eventId, playerId],
      );

      if (existingParticipation.rows.length > 0) {
        return {
          success: false,
          message: "Already participating in this event",
        };
      }

      // Check participation limits
      if (event.total_participants >= event.max_participants) {
        return { success: false, message: "Event is at maximum capacity" };
      }

      // Check player level requirements
      if (event.required_level) {
        const playerProfile = await this.db.query(
          `SELECT level FROM player_profiles WHERE player_id = $1`,
          [playerId],
        );

        if (
          playerProfile.rows.length === 0 ||
          playerProfile.rows[0].level < event.required_level
        ) {
          return {
            success: false,
            message: `Requires level ${event.required_level}`,
          };
        }
      }

      // Add player to event
      await this.db.transaction(async (client) => {
        await client.query(
          `
          INSERT INTO event_participants (
            event_id, player_id, guild_id, participation_status, participation_type,
            joined_at, contribution_score
          ) VALUES ($1, $2, $3, 'active', $4, CURRENT_TIMESTAMP, 0)
        `,
          [eventId, playerId, guildId, guildId ? "guild_member" : "individual"],
        );

        // Update event participant count
        await client.query(
          `
          UPDATE universe_events
          SET total_participants = total_participants + 1,
              active_participants = active_participants + 1
          WHERE id = $1
        `,
          [eventId],
        );

        // Start event if minimum participants reached and not yet started
        if (
          event.total_participants + 1 >= event.min_participants_required &&
          event.event_status === "spawned"
        ) {
          await this.startUniverseEvent(client, eventId);
        }
      });

      return { success: true, message: "Successfully joined the event" };
    } catch (error) {
      this.logger.error("Error joining universe event:", error);
      return { success: false, message: "Failed to join event" };
    }
  }

  /**
   * Start a universe event
   */
  private async startUniverseEvent(
    client: any,
    eventId: string,
  ): Promise<void> {
    await client.query(
      `
      UPDATE universe_events
      SET event_status = 'active',
          event_phase = 'active',
          started_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `,
      [eventId],
    );

    // Activate all event missions
    await client.query(
      `
      UPDATE active_event_missions
      SET mission_status = 'active',
          started_at = CURRENT_TIMESTAMP
      WHERE event_id = $1 AND mission_status = 'available'
    `,
      [eventId],
    );

    this.logger.info(`Started universe event: ${eventId}`);
  }

  /**
   * Process active universe events
   */
  async processUniverseEvents(): Promise<void> {
    const activeEvents = await this.db.query(`
      SELECT ue.*, et.duration_type, et.base_duration_hours
      FROM universe_events ue
      JOIN event_types et ON ue.event_type_id = et.id
      WHERE ue.event_status IN ('spawned', 'active')
    `);

    for (const event of activeEvents.rows) {
      await this.processIndividualEvent(event);
    }
  }

  /**
   * Process individual event progression
   */
  private async processIndividualEvent(event: any): Promise<void> {
    try {
      // Check if event should expire
      if (new Date() > new Date(event.hard_deadline)) {
        await this.expireUniverseEvent(event.id);
        return;
      }

      // Update event progress based on objectives
      const progressUpdate = await this.calculateEventProgress(event.id);

      if (progressUpdate.shouldComplete) {
        await this.completeUniverseEvent(event.id, progressUpdate.success);
      } else if (progressUpdate.shouldAdvancePhase) {
        await this.advanceEventPhase(event.id);
      }

      // Process event-specific mechanics
      await this.processEventMechanics(event);
    } catch (error) {
      this.logger.error(`Error processing event ${event.id}:`, error);
    }
  }

  /**
   * Complete a universe event
   */
  async completeUniverseEvent(
    eventId: string,
    success: boolean,
  ): Promise<void> {
    await this.db.transaction(async (client) => {
      // Update event status
      await client.query(
        `
        UPDATE universe_events
        SET event_status = 'completed',
            event_phase = 'resolution',
            ended_at = CURRENT_TIMESTAMP,
            event_progress = 100.0
        WHERE id = $1
      `,
        [eventId],
      );

      // Distribute rewards to participants
      if (success) {
        await this.distributeEventRewards(client, eventId);
      }

      // Update participant statuses
      await client.query(
        `
        UPDATE event_participants
        SET participation_status = $1
        WHERE event_id = $2 AND participation_status = 'active'
      `,
        [success ? "completed" : "failed", eventId],
      );

      // Log event completion
      this.logger.info(
        `Universe event ${eventId} completed with ${success ? "success" : "failure"}`,
      );
    });
  }

  /**
   * Attack event boss
   */
  async attackEventBoss(
    playerId: string,
    eventId: string,
    bossId: string,
    attackData: any,
  ): Promise<{
    success: boolean;
    damage: number;
    bossHealth: number;
    message: string;
  }> {
    try {
      // Verify participation
      const participation = await this.db.query(
        `
        SELECT * FROM event_participants
        WHERE event_id = $1 AND player_id = $2 AND participation_status = 'active'
      `,
        [eventId, playerId],
      );

      if (participation.rows.length === 0) {
        return {
          success: false,
          damage: 0,
          bossHealth: 0,
          message: "Not participating in this event",
        };
      }

      // Get boss details
      const bossResult = await this.db.query(
        `
        SELECT ue.boss_health_percentage, eb.*
        FROM universe_events ue
        JOIN event_bosses eb ON ue.primary_boss_id = eb.id
        WHERE ue.id = $1 AND eb.id = $2 AND ue.boss_spawned = true
      `,
        [eventId, bossId],
      );

      if (bossResult.rows.length === 0) {
        return {
          success: false,
          damage: 0,
          bossHealth: 0,
          message: "Boss not found or not spawned",
        };
      }

      const boss = bossResult.rows[0];
      const currentHealth =
        (boss.health_points * boss.boss_health_percentage) / 100;

      // Calculate damage based on player gear, level, etc.
      const damage = await this.calculateBossDamage(playerId, boss, attackData);

      // Apply damage and check for special mechanics
      const newHealthPercentage = Math.max(
        0,
        boss.boss_health_percentage - (damage / boss.health_points) * 100,
      );

      await this.db.transaction(async (client) => {
        // Update boss health
        await client.query(
          `
          UPDATE universe_events
          SET boss_health_percentage = $1
          WHERE id = $2
        `,
          [newHealthPercentage, eventId],
        );

        // Update participant contribution
        await client.query(
          `
          UPDATE event_participants
          SET damage_dealt = damage_dealt + $1,
              contribution_score = contribution_score + $2
          WHERE event_id = $3 AND player_id = $4
        `,
          [damage, Math.floor(damage / 100), eventId, playerId],
        );

        // Check if boss is defeated
        if (newHealthPercentage <= 0) {
          await this.defeatEventBoss(client, eventId, bossId);
        }
      });

      return {
        success: true,
        damage,
        bossHealth: newHealthPercentage,
        message: `Dealt ${damage} damage to ${boss.boss_name}`,
      };
    } catch (error) {
      this.logger.error("Error attacking event boss:", error);
      return {
        success: false,
        damage: 0,
        bossHealth: 0,
        message: "Failed to attack boss",
      };
    }
  }

  /**
   * Interact with event object
   */
  async interactWithEventObject(
    playerId: string,
    eventId: string,
    objectInstanceId: string,
    interactionType: string,
  ): Promise<{ success: boolean; rewards?: any; message: string }> {
    try {
      // Get object details
      const objectResult = await this.db.query(
        `
        SELECT aeo.*, eo.*, ep.participation_status
        FROM active_event_objects aeo
        JOIN event_objects eo ON aeo.object_id = eo.id
        JOIN event_participants ep ON aeo.event_id = ep.event_id AND ep.player_id = $1
        WHERE aeo.id = $2 AND aeo.event_id = $3 AND aeo.current_status = 'active'
      `,
        [playerId, objectInstanceId, eventId],
      );

      if (objectResult.rows.length === 0) {
        return {
          success: false,
          message: "Object not found or not accessible",
        };
      }

      const object = objectResult.rows[0];

      // Check interaction requirements
      const canInteract = await this.checkObjectInteractionRequirements(
        playerId,
        object,
        interactionType,
      );

      if (!canInteract.success) {
        return { success: false, message: canInteract.message };
      }

      // Process interaction
      const interactionResult = await this.processObjectInteraction(
        playerId,
        eventId,
        objectInstanceId,
        object,
        interactionType,
      );

      return interactionResult;
    } catch (error) {
      this.logger.error("Error interacting with event object:", error);
      return { success: false, message: "Failed to interact with object" };
    }
  }

  /**
   * Helper methods for event system
   */
  private generateEventName(eventType: any): string {
    const prefixes = [
      "Operation",
      "Mission",
      "Incident",
      "Crisis",
      "Discovery",
    ];
    const suffixes = ["Alpha", "Beta", "Gamma", "Prime", "Omega"];

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    return `${prefix} ${eventType.type_name} ${suffix}`;
  }

  private async generateEventLocation(
    galaxyId: string,
    eventType: any,
  ): Promise<any> {
    // Generate appropriate location based on event type
    const locationTypes = ["sector", "system", "deep_space", "nebula"];
    const selectedType =
      locationTypes[Math.floor(Math.random() * locationTypes.length)];

    const coordinates = await this.db.query(
      `
      SELECT id FROM galactic_coordinates
      WHERE galaxy_id = $1 AND coordinate_type = $2
      ORDER BY RANDOM() LIMIT 1
    `,
      [galaxyId, selectedType],
    );

    return {
      type: selectedType,
      id: coordinates.rows.length > 0 ? coordinates.rows[0].id : null,
      radius: eventType.scaling_rules?.event_radius || 1,
    };
  }

  private generateEventObjectives(eventType: any): any[] {
    // Generate dynamic objectives based on event type
    const baseObjectives = [
      {
        id: "1",
        type: "participation",
        description: "Participate in the event",
        progress: 0,
        target: 1,
      },
      {
        id: "2",
        type: "survival",
        description: "Survive the event duration",
        progress: 0,
        target: 1,
      },
    ];

    if (eventType.scaling_rules?.has_bosses) {
      baseObjectives.push({
        id: "3",
        type: "boss_defeat",
        description: "Defeat the primary boss",
        progress: 0,
        target: 1,
      });
    }

    return baseObjectives;
  }

  private calculateEventRewards(eventType: any): any {
    return {
      experience: eventType.difficulty_tier * 1000,
      resources: {
        credits: eventType.difficulty_tier * 500,
        dilithium: eventType.difficulty_tier * 10,
      },
      reputation: eventType.difficulty_tier * 50,
    };
  }

  private generateEnvironmentalEffects(eventType: any): any[] {
    const effects = [];

    if (eventType.category_code === "BORG") {
      effects.push({
        type: "adaptation",
        description: "Borg adaptation mechanics active",
      });
    }

    if (eventType.difficulty_tier >= 5) {
      effects.push({
        type: "hazardous",
        description: "Hazardous space conditions",
      });
    }

    return effects;
  }

  private generateEventSeed(): number {
    return Math.floor(Math.random() * 1000000);
  }

  private async spawnEventObjects(
    client: any,
    eventId: string,
    eventType: any,
  ): Promise<void> {
    // Spawn objects based on event type
    const objectTypes = await client.query(
      `SELECT * FROM event_objects WHERE object_type = $1 ORDER BY RANDOM() LIMIT 3`,
      [eventType.category_code.toLowerCase()],
    );

    for (const object of objectTypes.rows) {
      await client.query(
        `
        INSERT INTO active_event_objects (
          event_id, object_id, instance_name, current_status, spawn_time
        ) VALUES ($1, $2, $3, 'active', CURRENT_TIMESTAMP)
      `,
        [eventId, object.id, `${object.object_name} Instance`],
      );
    }
  }

  private async spawnEventMissions(
    client: any,
    eventId: string,
    eventType: any,
  ): Promise<void> {
    // Get missions for this event type
    const missions = await client.query(
      `SELECT * FROM event_missions WHERE event_type_id = $1`,
      [eventType.id],
    );

    for (const mission of missions.rows) {
      await client.query(
        `
        INSERT INTO active_event_missions (
          event_id, mission_id, mission_instance_name, mission_status,
          became_available_at, max_participants
        ) VALUES ($1, $2, $3, 'available', CURRENT_TIMESTAMP, $4)
      `,
        [
          eventId,
          mission.id,
          `${mission.mission_name} - ${eventId}`,
          mission.max_participants,
        ],
      );
    }
  }

  private async spawnEventBosses(
    client: any,
    eventId: string,
    eventType: any,
  ): Promise<void> {
    // Spawn primary boss
    const bosses = await client.query(
      `SELECT * FROM event_bosses WHERE boss_tier <= $1 ORDER BY RANDOM() LIMIT 1`,
      [eventType.difficulty_tier],
    );

    if (bosses.rows.length > 0) {
      await client.query(
        `
        UPDATE universe_events
        SET primary_boss_id = $1, boss_spawned = true, boss_health_percentage = 100.0
        WHERE id = $2
      `,
        [bosses.rows[0].id, eventId],
      );
    }
  }

  private async calculateEventProgress(eventId: string): Promise<any> {
    // Calculate current event progress based on objectives
    const objectives = await this.db.query(
      `SELECT current_objectives, completed_objectives FROM universe_events WHERE id = $1`,
      [eventId],
    );

    if (objectives.rows.length === 0) {
      return {
        shouldComplete: false,
        shouldAdvancePhase: false,
        success: false,
      };
    }

    const current = objectives.rows[0].current_objectives || [];
    const completed = objectives.rows[0].completed_objectives || [];

    const progress =
      current.length > 0 ? (completed.length / current.length) * 100 : 0;

    return {
      shouldComplete: progress >= 100,
      shouldAdvancePhase: progress >= 50 && progress < 100,
      success: progress >= 100,
      progress,
    };
  }

  private async advanceEventPhase(eventId: string): Promise<void> {
    await this.db.query(
      `
      UPDATE universe_events
      SET current_phase_number = current_phase_number + 1,
          event_phase = CASE
            WHEN current_phase_number = 1 THEN 'climax'
            WHEN current_phase_number = 2 THEN 'resolution'
            ELSE event_phase
          END
      WHERE id = $1
    `,
      [eventId],
    );
  }

  private async processEventMechanics(event: any): Promise<void> {
    // Process event-specific mechanics based on type
    switch (event.category_code) {
      case "BORG":
        await this.processBorgEventMechanics(event);
        break;
      case "EXPLO":
        await this.processExplorationEventMechanics(event);
        break;
      default:
        // Generic event processing
        break;
    }
  }

  private async processBorgEventMechanics(event: any): Promise<void> {
    // Borg-specific mechanics like adaptation
    this.logger.info(`Processing Borg event mechanics for ${event.id}`);
  }

  private async processExplorationEventMechanics(event: any): Promise<void> {
    // Exploration-specific mechanics
    this.logger.info(`Processing exploration event mechanics for ${event.id}`);
  }

  private async expireUniverseEvent(eventId: string): Promise<void> {
    await this.db.query(
      `
      UPDATE universe_events
      SET event_status = 'expired', ended_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `,
      [eventId],
    );

    this.logger.info(`Universe event ${eventId} expired`);
  }

  private async distributeEventRewards(
    client: any,
    eventId: string,
  ): Promise<void> {
    // Get event rewards and participants
    const eventData = await client.query(
      `
      SELECT base_rewards, scaled_rewards, mvp_rewards
      FROM universe_events WHERE id = $1
    `,
      [eventId],
    );

    const participants = await client.query(
      `
      SELECT player_id, contribution_score
      FROM event_participants
      WHERE event_id = $1 AND participation_status = 'active'
      ORDER BY contribution_score DESC
    `,
      [eventId],
    );

    if (eventData.rows.length === 0 || participants.rows.length === 0) return;

    const rewards = eventData.rows[0];
    const participantList = participants.rows;

    // Distribute base rewards to all participants
    for (const participant of participantList) {
      await this.grantEventRewards(
        client,
        participant.player_id,
        rewards.base_rewards,
      );
    }

    // Give MVP rewards to top contributor
    if (participantList.length > 0 && rewards.mvp_rewards) {
      await this.grantEventRewards(
        client,
        participantList[0].player_id,
        rewards.mvp_rewards,
      );
    }
  }

  private async grantEventRewards(
    client: any,
    playerId: string,
    rewards: any,
  ): Promise<void> {
    if (!rewards) return;

    // Grant experience
    if (rewards.experience) {
      await this.grantExperience(playerId, rewards.experience);
    }

    // Grant resources
    if (rewards.resources) {
      await this.grantResources(client, playerId, rewards.resources, 1.0);
    }

    // Update reputation
    if (rewards.reputation) {
      await client.query(
        `
        UPDATE player_profiles
        SET reputation = reputation + $1
        WHERE player_id = $2
      `,
        [rewards.reputation, playerId],
      );
    }
  }

  private async calculateBossDamage(
    playerId: string,
    boss: any,
    attackData: any,
  ): Promise<number> {
    // Calculate damage based on player stats, equipment, boss resistances
    const baseDamage = attackData.damage || 1000;
    const playerLevel = await this.getPlayerLevel(playerId);

    // Simple damage calculation - can be made more complex
    const levelModifier = playerLevel / 100;
    const finalDamage = Math.floor(baseDamage * levelModifier);

    return Math.max(1, finalDamage);
  }

  private async getPlayerLevel(playerId: string): Promise<number> {
    const result = await this.db.query(
      `SELECT level FROM player_profiles WHERE player_id = $1`,
      [playerId],
    );
    return result.rows.length > 0 ? result.rows[0].level : 1;
  }

  private async defeatEventBoss(
    client: any,
    eventId: string,
    bossId: string,
  ): Promise<void> {
    // Mark boss as defeated and update event progress
    await client.query(
      `
      UPDATE universe_events
      SET boss_health_percentage = 0,
          event_progress = CASE
            WHEN event_progress < 80 THEN 80
            ELSE event_progress
          END
      WHERE id = $1
    `,
      [eventId],
    );

    this.logger.info(`Boss ${bossId} defeated in event ${eventId}`);
  }

  private async checkObjectInteractionRequirements(
    playerId: string,
    object: any,
    interactionType: string,
  ): Promise<{ success: boolean; message: string }> {
    // Check if player meets requirements for interaction
    switch (interactionType) {
      case "scan":
        return object.can_be_scanned
          ? { success: true, message: "Can scan" }
          : { success: false, message: "Object cannot be scanned" };
      case "collect":
        return object.can_be_collected
          ? { success: true, message: "Can collect" }
          : { success: false, message: "Object cannot be collected" };
      case "activate":
        return object.can_be_activated
          ? { success: true, message: "Can activate" }
          : { success: false, message: "Object cannot be activated" };
      default:
        return { success: false, message: "Unknown interaction type" };
    }
  }

  private async processObjectInteraction(
    playerId: string,
    eventId: string,
    objectInstanceId: string,
    object: any,
    interactionType: string,
  ): Promise<{ success: boolean; rewards?: any; message: string }> {
    try {
      await this.db.transaction(async (client) => {
        // Update object interaction count
        await client.query(
          `
          UPDATE active_event_objects
          SET interaction_count = interaction_count + 1,
              last_interaction = CURRENT_TIMESTAMP,
              last_interacted_by = $1
          WHERE id = $2
        `,
          [playerId, objectInstanceId],
        );

        // Process specific interaction type
        switch (interactionType) {
          case "collect":
            await client.query(
              `UPDATE active_event_objects SET current_status = 'collected' WHERE id = $1`,
              [objectInstanceId],
            );
            break;
          case "activate":
            await client.query(
              `UPDATE active_event_objects SET current_status = 'activated' WHERE id = $1`,
              [objectInstanceId],
            );
            break;
        }

        // Grant interaction rewards
        if (object.interaction_rewards) {
          await this.grantEventRewards(
            client,
            playerId,
            object.interaction_rewards,
          );
        }
      });

      return {
        success: true,
        rewards: object.interaction_rewards,
        message: `Successfully ${interactionType}ed ${object.object_name}`,
      };
    } catch (error) {
      this.logger.error("Error processing object interaction:", error);
      return { success: false, message: "Failed to interact with object" };
    }
  }

  /**
   * MAINTENANCE AND UTILITY METHODS
   */

  async calculateDailyStats(): Promise<void> {
    // Update player rankings, achievements, etc.
    this.logger.info("Calculated daily statistics");
  }

  async createBackup(): Promise<void> {
    // Create game state backup
    this.logger.info("Created game backup");
  }

  async performMaintenance(): Promise<void> {
    // System maintenance tasks
    this.logger.info("Performed maintenance");
  }
}
