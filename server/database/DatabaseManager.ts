import { Pool, PoolClient, QueryResult } from "pg";
import { Logger } from "../utils/Logger";

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
  maxConnections?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

export interface TransactionCallback<T> {
  (client: PoolClient): Promise<T>;
}

export interface GameSaveData {
  playerId: string;
  galaxyId: string;
  data: any;
  dataType:
    | "player_state"
    | "fleet_state"
    | "territory_state"
    | "research_state";
  version: number;
  checksum: string;
}

export class DatabaseManager {
  private pool: Pool;
  private logger: Logger;
  private isInitialized: boolean = false;
  private static _instance: DatabaseManager | null = null;

  constructor(config: DatabaseConfig) {
    this.logger = new Logger("DatabaseManager");

    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      ssl: config.ssl ? { rejectUnauthorized: false } : false,
      max: config.maxConnections || 20,
      idleTimeoutMillis: config.idleTimeoutMillis || 30000,
      connectionTimeoutMillis: config.connectionTimeoutMillis || 5000,
    });

    // Handle pool events
    this.pool.on("connect", (client) => {
      this.logger.debug("New database client connected");
    });

    this.pool.on("error", (err) => {
      this.logger.error("Database pool error:", err);
    });

    this.pool.on("remove", (client) => {
      this.logger.debug("Database client removed from pool");
    });

    // Set singleton instance for legacy callers
    DatabaseManager._instance = this;
  }

  static getInstance(): DatabaseManager {
    if (!DatabaseManager._instance) {
      throw new Error("DatabaseManager not initialized");
    }
    return DatabaseManager._instance;
  }

  /**
   * Initialize database connection and verify schema
   */
  async initialize(): Promise<void> {
    try {
      this.logger.info("Initializing database connection...");

      // Test connection
      const client = await this.pool.connect();
      const result = await client.query("SELECT NOW()");
      client.release();

      this.logger.info(
        `Database connected successfully at ${result.rows[0].now}`,
      );

      // Verify schema exists
      await this.verifySchema();

      this.isInitialized = true;
    } catch (error) {
      this.logger.error("Failed to initialize database:", error);
      throw error;
    }
  }

  /**
   * Verify database schema exists and is up to date
   */
  private async verifySchema(): Promise<void> {
    const requiredTables = [
      "players",
      "player_profiles",
      "player_stats",
      "galaxies",
      "sectors",
      "star_systems",
      "celestial_bodies",
      "ships",
      "ship_classes",
      "resource_types",
      "player_resources",
      "game_turns",
      "player_actions",
      "cron_jobs",
      "cron_job_executions",
    ];

    for (const table of requiredTables) {
      const result = await this.query(
        `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )
      `,
        [table],
      );

      if (!result.rows[0].exists) {
        throw new Error(
          `Required table '${table}' does not exist. Please run schema.sql first.`,
        );
      }
    }

    this.logger.info("Database schema verification completed");
  }

  /**
   * Execute a query with optional parameters
   */
  async query(text: string, params?: any[]): Promise<QueryResult> {
    if (!this.isInitialized) {
      throw new Error("Database not initialized. Call initialize() first.");
    }

    const start = Date.now();
    try {
      const client = await this.pool.connect();
      try {
        const result = await client.query(text, params);
        const duration = Date.now() - start;

        this.logger.debug(
          `Query executed in ${duration}ms: ${text.substring(0, 100)}...`,
        );
        return result;
      } finally {
        client.release();
      }
    } catch (error) {
      const duration = Date.now() - start;
      this.logger.error(`Query failed after ${duration}ms:`, error);
      this.logger.error(`Query: ${text}`);
      this.logger.error(`Params:`, params);
      throw error;
    }
  }

  /**
   * Execute multiple queries in a transaction
   */
  async transaction<T>(callback: TransactionCallback<T>): Promise<T> {
    if (!this.isInitialized) {
      throw new Error("Database not initialized. Call initialize() first.");
    }

    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      this.logger.error("Transaction rolled back due to error:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * GAME-SPECIFIC DATA ACCESS METHODS
   */

  /**
   * Save player game state
   */
  async savePlayerData(saveData: GameSaveData): Promise<void> {
    const query = `
      INSERT INTO player_game_saves (
        id, player_id, galaxy_id, data_type, data, version, checksum, created_at
      ) VALUES (
        uuid_generate_v4(), $1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP
      )
      ON CONFLICT (player_id, galaxy_id, data_type) 
      DO UPDATE SET
        data = $4,
        version = $5,
        checksum = $6,
        updated_at = CURRENT_TIMESTAMP
    `;

    // Create table if it doesn't exist
    await this.query(`
      CREATE TABLE IF NOT EXISTS player_game_saves (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        galaxy_id UUID NOT NULL REFERENCES galaxies(id) ON DELETE CASCADE,
        data_type VARCHAR(50) NOT NULL,
        data JSONB NOT NULL,
        version INTEGER DEFAULT 1,
        checksum VARCHAR(64),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(player_id, galaxy_id, data_type)
      )
    `);

    await this.query(query, [
      saveData.playerId,
      saveData.galaxyId,
      saveData.dataType,
      JSON.stringify(saveData.data),
      saveData.version,
      saveData.checksum,
    ]);

    this.logger.info(
      `Saved ${saveData.dataType} for player ${saveData.playerId}`,
    );
  }

  /**
   * Load player game state
   */
  async loadPlayerData(
    playerId: string,
    galaxyId: string,
    dataType: string,
  ): Promise<any> {
    const result = await this.query(
      `
      SELECT data, version, checksum, updated_at
      FROM player_game_saves
      WHERE player_id = $1 AND galaxy_id = $2 AND data_type = $3
    `,
      [playerId, galaxyId, dataType],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      data: row.data,
      version: row.version,
      checksum: row.checksum,
      lastSaved: row.updated_at,
    };
  }

  /**
   * Create new player account
   */
  async createPlayer(
    username: string,
    email: string,
    passwordHash: string,
  ): Promise<string> {
    return await this.transaction(async (client) => {
      // Create player account
      const playerResult = await client.query(
        `
        INSERT INTO players (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id
      `,
        [username, email, passwordHash],
      );

      const playerId = playerResult.rows[0].id;

      // Create player profile
      await client.query(
        `
        INSERT INTO player_profiles (player_id, display_name, starfleet_id)
        VALUES ($1, $2, $3)
      `,
        [playerId, username, this.generateStarfleetId()],
      );

      // Create player statistics
      await client.query(
        `
        INSERT INTO player_stats (player_id)
        VALUES ($1)
      `,
        [playerId],
      );

      // Give starting resources
      await this.giveStartingResources(client, playerId);

      this.logger.info(`Created new player: ${username} (${playerId})`);
      return playerId;
    });
  }

  /**
   * Get player by ID with full profile
   */
  async getPlayer(playerId: string): Promise<any> {
    const result = await this.query(
      `
      SELECT p.*, pp.*, ps.*
      FROM players p
      JOIN player_profiles pp ON p.id = pp.player_id
      JOIN player_stats ps ON p.id = ps.player_id
      WHERE p.id = $1 AND p.is_active = true
    `,
      [playerId],
    );

    return result.rows[0] || null;
  }

  /**
   * Get player by username
   */
  async getPlayerByUsername(username: string): Promise<any> {
    const result = await this.query(
      `
      SELECT p.*, pp.*
      FROM players p
      JOIN player_profiles pp ON p.id = pp.player_id
      WHERE p.username = $1 AND p.is_active = true
    `,
      [username],
    );

    return result.rows[0] || null;
  }

  /**
   * Update player login time
   */
  async updatePlayerLogin(playerId: string): Promise<void> {
    await this.query(
      `
      UPDATE players 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE id = $1
    `,
      [playerId],
    );
  }

  /**
   * Get player ships in a galaxy
   */
  async getPlayerShips(playerId: string, galaxyId?: string): Promise<any[]> {
    let query = `
      SELECT s.*, sc.name as class_name, sc.class_type, sc.size_class
      FROM ships s
      JOIN ship_classes sc ON s.ship_class_id = sc.id
      WHERE s.player_id = $1
    `;
    const params = [playerId];

    if (galaxyId) {
      query += ` AND s.galaxy_id = $2`;
      params.push(galaxyId);
    }

    query += ` ORDER BY s.created_at`;

    const result = await this.query(query, params);
    return result.rows;
  }

  /**
   * Get player resources
   */
  async getPlayerResources(playerId: string): Promise<any[]> {
    const result = await this.query(
      `
      SELECT pr.*, rt.name, rt.description, rt.category, rt.rarity
      FROM player_resources pr
      JOIN resource_types rt ON pr.resource_type_id = rt.id
      WHERE pr.player_id = $1 AND pr.quantity > 0
      ORDER BY rt.category, rt.name
    `,
      [playerId],
    );

    return result.rows;
  }

  /**
   * Update player resource quantity
   */
  async updatePlayerResource(
    playerId: string,
    resourceTypeId: string,
    quantity: number,
  ): Promise<void> {
    await this.query(
      `
      INSERT INTO player_resources (player_id, resource_type_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (player_id, resource_type_id)
      DO UPDATE SET quantity = player_resources.quantity + $3
    `,
      [playerId, resourceTypeId, quantity],
    );
  }

  /**
   * Get active galaxies
   */
  async getActiveGalaxies(): Promise<any[]> {
    const result = await this.query(`
      SELECT * FROM galaxies 
      WHERE is_active = true 
      ORDER BY created_at
    `);

    return result.rows;
  }

  /**
   * Get galaxy by ID
   */
  async getGalaxy(galaxyId: string): Promise<any> {
    const result = await this.query(
      `
      SELECT * FROM galaxies WHERE id = $1
    `,
      [galaxyId],
    );

    return result.rows[0] || null;
  }

  /**
   * Create new game turn
   */
  async createGameTurn(galaxyId: string): Promise<string> {
    const result = await this.query(
      `
      INSERT INTO game_turns (galaxy_id, turn_number, duration_minutes)
      SELECT $1, COALESCE(MAX(turn_number), 0) + 1, g.turn_duration_minutes
      FROM galaxies g
      LEFT JOIN game_turns gt ON g.id = gt.galaxy_id
      WHERE g.id = $1
      GROUP BY g.turn_duration_minutes
      RETURNING id, turn_number
    `,
      [galaxyId],
    );

    const turn = result.rows[0];
    this.logger.info(`Created turn ${turn.turn_number} for galaxy ${galaxyId}`);
    return turn.id;
  }

  /**
   * Get pending player actions for a turn
   */
  async getPendingActions(turnId: string): Promise<any[]> {
    const result = await this.query(
      `
      SELECT pa.*, p.username
      FROM player_actions pa
      JOIN players p ON pa.player_id = p.id
      WHERE pa.turn_id = $1 AND pa.status = 'pending'
      ORDER BY pa.priority, pa.created_at
    `,
      [turnId],
    );

    return result.rows;
  }

  /**
   * Update action status
   */
  async updateActionStatus(
    actionId: string,
    status: string,
    result?: any,
    errorMessage?: string,
  ): Promise<void> {
    const params = [status, actionId];
    let query = `
      UPDATE player_actions 
      SET status = $1, completed_at = CURRENT_TIMESTAMP
    `;

    if (result) {
      query += `, result = $${params.length + 1}`;
      params.push(JSON.stringify(result));
    }

    if (errorMessage) {
      query += `, error_message = $${params.length + 1}`;
      params.push(errorMessage);
    }

    query += ` WHERE id = $2`;

    await this.query(query, params);
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats(): Promise<any> {
    const stats: any = {};

    // Table row counts
    const tables = [
      "players",
      "galaxies",
      "ships",
      "player_actions",
      "battles",
      "trade_orders",
      "game_turns",
    ];

    for (const table of tables) {
      const result = await this.query(`SELECT COUNT(*) as count FROM ${table}`);
      stats[`${table}_count`] = parseInt(result.rows[0].count);
    }

    // Connection pool stats
    stats.pool_total_connections = this.pool.totalCount;
    stats.pool_idle_connections = this.pool.idleCount;
    stats.pool_waiting_requests = this.pool.waitingCount;

    return stats;
  }

  /**
   * HELPER METHODS
   */

  private generateStarfleetId(): string {
    const prefix = "SF";
    const number = Math.floor(Math.random() * 999999)
      .toString()
      .padStart(6, "0");
    return `${prefix}${number}`;
  }

  private async giveStartingResources(
    client: PoolClient,
    playerId: string,
  ): Promise<void> {
    // Get default resource types
    const resources = await client.query(`
      SELECT id FROM resource_types 
      WHERE name IN ('Energy Credits', 'Duranium', 'Biomass')
    `);

    const startingAmounts = {
      "Energy Credits": 10000,
      Duranium: 1000,
      Biomass: 500,
    };

    for (const resource of resources.rows) {
      const amount = startingAmounts[resource.name] || 100;
      await client.query(
        `
        INSERT INTO player_resources (player_id, resource_type_id, quantity)
        VALUES ($1, $2, $3)
      `,
        [playerId, resource.id, amount],
      );
    }
  }

  /**
   * Close database connections
   */
  async close(): Promise<void> {
    this.logger.info("Closing database connections...");
    await this.pool.end();
    this.isInitialized = false;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query("SELECT 1");
      return result.rows.length > 0;
    } catch (error) {
      this.logger.error("Database health check failed:", error);
      return false;
    }
  }
}
