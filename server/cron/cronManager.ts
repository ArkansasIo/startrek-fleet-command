import { CronJob } from "cron";
import { v4 as uuidv4 } from "uuid";
import { DatabaseManager } from "../database/DatabaseManager";
import { GameEngine } from "../game/GameEngine";
import { Logger } from "../utils/Logger";

export interface CronJobConfig {
  id: string;
  name: string;
  cronExpression: string;
  handler: () => Promise<void>;
  isActive: boolean;
  maxRuntimeSeconds: number;
  description: string;
}

export interface CronJobExecution {
  id: string;
  jobId: string;
  executionId: string;
  status: "running" | "completed" | "failed" | "timeout";
  startedAt: Date;
  completedAt?: Date;
  runtimeSeconds?: number;
  recordsProcessed: number;
  errorMessage?: string;
  executionLog: string[];
}

export class CronManager {
  private jobs: Map<string, CronJob> = new Map();
  private activeExecutions: Map<string, CronJobExecution> = new Map();
  private db: DatabaseManager;
  private gameEngine: GameEngine;
  private logger: Logger;

  constructor(db: DatabaseManager, gameEngine: GameEngine) {
    this.db = db;
    this.gameEngine = gameEngine;
    this.logger = new Logger("CronManager");
  }

  /**
   * Initialize and start all cron jobs
   */
  async initialize(): Promise<void> {
    this.logger.info("Initializing Cron Manager...");

    // Load job configurations from database
    const jobConfigs = await this.loadJobConfigurations();

    // Register default game mechanics jobs
    this.registerGameJobs();

    // Start all active jobs
    for (const config of jobConfigs) {
      if (config.isActive) {
        await this.startJob(config);
      }
    }

    this.logger.info(`Started ${this.jobs.size} cron jobs`);
  }

  /**
   * Register all game-specific cron jobs
   */
  private registerGameJobs(): void {
    const jobs: CronJobConfig[] = [
      {
        id: "process_game_turns",
        name: "Process Game Turns",
        cronExpression: "*/30 * * * *", // Every 30 minutes
        handler: this.processGameTurns.bind(this),
        isActive: true,
        maxRuntimeSeconds: 300,
        description: "Process game turns and player actions",
      },
      {
        id: "generate_resources",
        name: "Generate Resources",
        cronExpression: "*/5 * * * *", // Every 5 minutes
        handler: this.generateResources.bind(this),
        isActive: true,
        maxRuntimeSeconds: 60,
        description: "Generate resources from deposits and colonies",
      },
      {
        id: "update_ship_movements",
        name: "Update Ship Movements",
        cronExpression: "*/1 * * * *", // Every minute
        handler: this.updateShipMovements.bind(this),
        isActive: true,
        maxRuntimeSeconds: 30,
        description: "Update ship travel progress and arrivals",
      },
      {
        id: "process_research",
        name: "Process Research",
        cronExpression: "*/10 * * * *", // Every 10 minutes
        handler: this.processResearch.bind(this),
        isActive: true,
        maxRuntimeSeconds: 120,
        description: "Update research progress for all players",
      },
      {
        id: "execute_trade_orders",
        name: "Execute Trade Orders",
        cronExpression: "*/2 * * * *", // Every 2 minutes
        handler: this.executeTradeOrders.bind(this),
        isActive: true,
        maxRuntimeSeconds: 60,
        description: "Match and execute trade orders",
      },
      {
        id: "process_battles",
        name: "Process Battles",
        cronExpression: "*/3 * * * *", // Every 3 minutes
        handler: this.processBattles.bind(this),
        isActive: true,
        maxRuntimeSeconds: 180,
        description: "Process ongoing battles and combat",
      },
      {
        id: "update_diplomacy",
        name: "Update Diplomacy",
        cronExpression: "0 */6 * * *", // Every 6 hours
        handler: this.updateDiplomacy.bind(this),
        isActive: true,
        maxRuntimeSeconds: 60,
        description: "Update diplomatic relations and treaties",
      },
      {
        id: "spawn_random_events",
        name: "Spawn Random Events",
        cronExpression: "*/15 * * * *", // Every 15 minutes
        handler: this.spawnRandomEvents.bind(this),
        isActive: true,
        maxRuntimeSeconds: 30,
        description: "Generate random galaxy events",
      },
      {
        id: "cleanup_expired_data",
        name: "Cleanup Expired Data",
        cronExpression: "0 2 * * *", // Daily at 2 AM
        handler: this.cleanupExpiredData.bind(this),
        isActive: true,
        maxRuntimeSeconds: 600,
        description: "Clean up expired messages, events, and temporary data",
      },
      {
        id: "calculate_player_stats",
        name: "Calculate Player Stats",
        cronExpression: "0 1 * * *", // Daily at 1 AM
        handler: this.calculatePlayerStats.bind(this),
        isActive: true,
        maxRuntimeSeconds: 300,
        description: "Update player statistics and rankings",
      },
      {
        id: "backup_game_state",
        name: "Backup Game State",
        cronExpression: "0 4 * * 0", // Weekly on Sunday at 4 AM
        handler: this.backupGameState.bind(this),
        isActive: true,
        maxRuntimeSeconds: 1800,
        description: "Create backup of game state",
      },
      {
        id: "maintenance_check",
        name: "Maintenance Check",
        cronExpression: "0 3 * * *", // Daily at 3 AM
        handler: this.performMaintenanceCheck.bind(this),
        isActive: true,
        maxRuntimeSeconds: 300,
        description: "Perform system maintenance checks",
      },
      {
        id: "process_npc_guilds",
        name: "Process NPC Guild Actions",
        cronExpression: "*/30 * * * *", // Every 30 minutes
        handler: this.processNPCGuilds.bind(this),
        isActive: true,
        maxRuntimeSeconds: 180,
        description: "Process AI actions for NPC guilds",
      },
      {
        id: "update_guild_activities",
        name: "Update Guild Activities",
        cronExpression: "*/15 * * * *", // Every 15 minutes
        handler: this.updateGuildActivities.bind(this),
        isActive: true,
        maxRuntimeSeconds: 120,
        description: "Update guild member activities and contributions",
      },
      {
        id: "process_guild_events",
        name: "Process Guild Events",
        cronExpression: "*/5 * * * *", // Every 5 minutes
        handler: this.processGuildEvents.bind(this),
        isActive: true,
        maxRuntimeSeconds: 60,
        description: "Process scheduled guild events and notifications",
      },
      {
        id: "clean_inactive_guilds",
        name: "Clean Inactive Guilds",
        cronExpression: "0 2 * * 0", // Weekly on Sunday at 2 AM
        handler: this.cleanInactiveGuilds.bind(this),
        isActive: true,
        maxRuntimeSeconds: 600,
        description: "Clean up inactive guilds and expired applications",
      },
    ];

    // Store job configurations
    jobs.forEach((job) => {
      this.saveJobConfiguration(job);
    });
  }

  /**
   * Start a specific cron job
   */
  private async startJob(config: CronJobConfig): Promise<void> {
    try {
      const job = new CronJob(
        config.cronExpression,
        async () => {
          await this.executeJob(config);
        },
        null,
        true, // Start immediately
        "UTC",
      );

      this.jobs.set(config.id, job);
      this.logger.info(
        `Started cron job: ${config.name} (${config.cronExpression})`,
      );
    } catch (error) {
      this.logger.error(`Failed to start job ${config.name}:`, error);
    }
  }

  /**
   * Execute a cron job with monitoring and logging
   */
  private async executeJob(config: CronJobConfig): Promise<void> {
    const executionId = uuidv4();
    const execution: CronJobExecution = {
      id: uuidv4(),
      jobId: config.id,
      executionId,
      status: "running",
      startedAt: new Date(),
      recordsProcessed: 0,
      executionLog: [],
    };

    this.activeExecutions.set(executionId, execution);

    try {
      this.logger.info(
        `Starting job execution: ${config.name} (${executionId})`,
      );
      execution.executionLog.push(
        `Job started at ${execution.startedAt.toISOString()}`,
      );

      // Set timeout for job execution
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(`Job timeout after ${config.maxRuntimeSeconds} seconds`),
          );
        }, config.maxRuntimeSeconds * 1000);
      });

      // Execute the job handler
      await Promise.race([config.handler(), timeoutPromise]);

      // Job completed successfully
      execution.status = "completed";
      execution.completedAt = new Date();
      execution.runtimeSeconds = Math.floor(
        (execution.completedAt.getTime() - execution.startedAt.getTime()) /
          1000,
      );

      execution.executionLog.push(
        `Job completed successfully in ${execution.runtimeSeconds}s`,
      );
      this.logger.info(
        `Job completed: ${config.name} (${execution.runtimeSeconds}s)`,
      );

      // Update job statistics
      await this.updateJobStats(config.id, true, execution.runtimeSeconds);
    } catch (error) {
      // Job failed or timed out
      execution.status = (error as any).message?.includes("timeout")
        ? "timeout"
        : "failed";
      execution.completedAt = new Date();
      execution.runtimeSeconds = Math.floor(
        (execution.completedAt.getTime() - execution.startedAt.getTime()) /
          1000,
      );
      execution.errorMessage = (error as any).message;
      execution.executionLog.push(`Job failed: ${(error as any).message}`);

      this.logger.error(`Job failed: ${config.name}`, error);

      // Update job statistics
      await this.updateJobStats(config.id, false, execution.runtimeSeconds);
    } finally {
      // Save execution log to database
      await this.saveExecutionLog(execution);
      this.activeExecutions.delete(executionId);
    }
  }

  /**
   * GAME MECHANICS HANDLERS
   */

  /**
   * Process game turns - Core turn-based mechanic
   */
  private async processGameTurns(): Promise<void> {
    const galaxies = await this.db.query(`
      SELECT id, current_turn, turn_duration_minutes, last_turn_processed
      FROM galaxies 
      WHERE is_active = true
    `);

    for (const galaxy of galaxies.rows) {
      const lastTurnTime = new Date(galaxy.last_turn_processed);
      const now = new Date();
      const timeSinceLastTurn =
        (now.getTime() - lastTurnTime.getTime()) / 1000 / 60; // minutes

      if (timeSinceLastTurn >= galaxy.turn_duration_minutes) {
        await this.gameEngine.processTurn(galaxy.id);
        this.logger.info(
          `Processed turn ${galaxy.current_turn + 1} for galaxy ${galaxy.id}`,
        );
      }
    }
  }

  /**
   * Generate resources from deposits and colonies
   */
  private async generateResources(): Promise<void> {
    // Generate resources from deposits
    const deposits = await this.db.query(`
      SELECT rd.*, cb.controlling_player_id 
      FROM resource_deposits rd
      JOIN celestial_bodies cb ON rd.celestial_body_id = cb.id
      WHERE rd.is_exploited = true 
      AND cb.controlling_player_id IS NOT NULL
      AND rd.quantity > 0
    `);

    for (const deposit of deposits.rows) {
      const generateAmount = Math.floor(deposit.extraction_rate / 12); // Per 5-minute interval

      if (generateAmount > 0) {
        await this.gameEngine.addPlayerResource(
          deposit.controlling_player_id,
          deposit.resource_type_id,
          generateAmount,
        );

        // Deplete deposit slightly
        const depletionAmount = Math.max(
          1,
          Math.floor(generateAmount * deposit.depletion_rate),
        );
        await this.db.query(
          `
          UPDATE resource_deposits 
          SET quantity = GREATEST(0, quantity - $1)
          WHERE id = $2
        `,
          [depletionAmount, deposit.id],
        );
      }
    }

    this.logger.info(
      `Generated resources for ${deposits.rows.length} deposits`,
    );
  }

  /**
   * Update ship movement progress
   */
  private async updateShipMovements(): Promise<void> {
    const travelingShips = await this.db.query(`
      SELECT id, name, travel_eta, destination_type, destination_id
      FROM ships 
      WHERE status = 'traveling' 
      AND travel_eta <= NOW()
    `);

    for (const ship of travelingShips.rows) {
      await this.gameEngine.completeShipTravel(ship.id);
      this.logger.info(`Ship ${ship.name} arrived at destination`);
    }
  }

  /**
   * Process research progress
   */
  private async processResearch(): Promise<void> {
    const activeResearch = await this.db.query(`
      SELECT pr.*, t.research_time_hours, t.name as tech_name
      FROM player_research pr
      JOIN technologies t ON pr.technology_id = t.id
      WHERE pr.status = 'researching'
    `);

    for (const research of activeResearch.rows) {
      const progressIncrement = (10 / 60 / research.research_time_hours) * 100; // 10 minutes of 1 hour
      const newProgress = Math.min(
        100,
        research.progress_percentage + progressIncrement,
      );

      if (newProgress >= 100) {
        await this.gameEngine.completeResearch(
          research.player_id,
          research.technology_id,
        );
        this.logger.info(
          `Player ${research.player_id} completed research: ${research.tech_name}`,
        );
      } else {
        await this.db.query(
          `
          UPDATE player_research 
          SET progress_percentage = $1
          WHERE id = $2
        `,
          [newProgress, research.id],
        );
      }
    }
  }

  /**
   * Execute pending trade orders
   */
  private async executeTradeOrders(): Promise<void> {
    await this.gameEngine.processTradeOrders();
    this.logger.info("Processed trade orders");
  }

  /**
   * Process ongoing battles
   */
  private async processBattles(): Promise<void> {
    const ongoingBattles = await this.db.query(`
      SELECT id, galaxy_id, location_type, location_id
      FROM battles 
      WHERE status = 'ongoing'
    `);

    for (const battle of ongoingBattles.rows) {
      await this.gameEngine.processBattle(battle.id);
    }

    this.logger.info(`Processed ${ongoingBattles.rows.length} battles`);
  }

  /**
   * Update diplomatic relations
   */
  private async updateDiplomacy(): Promise<void> {
    // Process expiring treaties and agreements
    await this.db.query(`
      UPDATE diplomatic_relations 
      SET relation_type = 'neutral', 
          trade_agreement = false,
          non_aggression_pact = false,
          military_alliance = false
      WHERE expires_at <= NOW()
      AND expires_at IS NOT NULL
    `);

    this.logger.info("Updated diplomatic relations");
  }

  /**
   * Spawn random galaxy events
   */
  private async spawnRandomEvents(): Promise<void> {
    const galaxies = await this.db.query(`
      SELECT id FROM galaxies WHERE is_active = true
    `);

    for (const galaxy of galaxies.rows) {
      // Random chance for event spawning
      if (Math.random() < 0.1) {
        // 10% chance every 15 minutes
        await this.gameEngine.spawnRandomEvent(galaxy.id);
      }
    }
  }

  /**
   * Clean up expired data
   */
  private async cleanupExpiredData(): Promise<void> {
    // Clean up expired messages
    await this.db.query(`
      DELETE FROM player_messages 
      WHERE expires_at <= NOW()
    `);

    // Clean up expired events
    await this.db.query(`
      DELETE FROM game_events 
      WHERE expires_at <= NOW()
    `);

    // Clean up old cron execution logs (keep last 30 days)
    await this.db.query(`
      DELETE FROM cron_job_executions 
      WHERE started_at < NOW() - INTERVAL '30 days'
    `);

    this.logger.info("Cleaned up expired data");
  }

  /**
   * Calculate player statistics
   */
  private async calculatePlayerStats(): Promise<void> {
    // This would involve complex calculations for rankings, achievements, etc.
    await this.gameEngine.calculateDailyStats();
    this.logger.info("Calculated player statistics");
  }

  /**
   * Backup game state
   */
  private async backupGameState(): Promise<void> {
    // This would create backups of critical game data
    await this.gameEngine.createBackup();
    this.logger.info("Created game state backup");
  }

  /**
   * Perform maintenance checks
   */
  private async performMaintenanceCheck(): Promise<void> {
    // Check system health, database performance, etc.
    await this.gameEngine.performMaintenance();
    this.logger.info("Performed maintenance checks");
  }

  /**
   * Process NPC guild actions
   */
  private async processNPCGuilds(): Promise<void> {
    try {
      await this.gameEngine.processNPCGuildActions();
      this.logger.info("Processed NPC guild actions");
    } catch (error) {
      this.logger.error("Error processing NPC guilds:", error);
    }
  }

  /**
   * Update guild activities and member contributions
   */
  private async updateGuildActivities(): Promise<void> {
    try {
      // Update member last online timestamps
      await this.db.query(`
        UPDATE guild_members
        SET last_online = CURRENT_TIMESTAMP
        WHERE player_id IN (
          SELECT id FROM players WHERE last_login > CURRENT_TIMESTAMP - INTERVAL '1 hour'
        )
      `);

      // Update guild activity timestamps
      await this.db.query(`
        UPDATE guilds
        SET last_activity = CURRENT_TIMESTAMP
        WHERE id IN (
          SELECT DISTINCT guild_id
          FROM guild_members
          WHERE last_online > CURRENT_TIMESTAMP - INTERVAL '1 hour'
        )
      `);

      this.logger.info("Updated guild activities");
    } catch (error) {
      this.logger.error("Error updating guild activities:", error);
    }
  }

  /**
   * Process scheduled guild events
   */
  private async processGuildEvents(): Promise<void> {
    try {
      // Start events that are scheduled to begin
      await this.db.query(`
        UPDATE guild_events
        SET status = 'active'
        WHERE status = 'scheduled'
        AND scheduled_at <= CURRENT_TIMESTAMP
      `);

      // End events that have reached their duration
      await this.db.query(`
        UPDATE guild_events
        SET status = 'completed'
        WHERE status = 'active'
        AND scheduled_at + INTERVAL '1 minute' * duration_minutes <= CURRENT_TIMESTAMP
      `);

      // Notify guild members of upcoming events (within 30 minutes)
      const upcomingEvents = await this.db.query(`
        SELECT ge.*, g.name as guild_name
        FROM guild_events ge
        JOIN guilds g ON ge.guild_id = g.id
        WHERE ge.status = 'scheduled'
        AND ge.scheduled_at BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '30 minutes'
        AND ge.scheduled_at > CURRENT_TIMESTAMP + INTERVAL '25 minutes'
      `);

      for (const event of upcomingEvents.rows) {
        // Create notifications for guild members
        await this.db.query(
          `
          INSERT INTO player_messages (from_player_id, to_player_id, message_type, subject, content)
          SELECT
            NULL, gm.player_id, 'system',
            'Guild Event Starting Soon',
            $1
          FROM guild_members gm
          WHERE gm.guild_id = $2 AND gm.member_status = 'active'
        `,
          [
            `The guild event "${event.event_name}" will start in approximately 30 minutes.`,
            event.guild_id,
          ],
        );
      }

      this.logger.info(
        `Processed guild events, ${upcomingEvents.rows.length} notifications sent`,
      );
    } catch (error) {
      this.logger.error("Error processing guild events:", error);
    }
  }

  /**
   * Clean up inactive guilds and expired data
   */
  private async cleanInactiveGuilds(): Promise<void> {
    try {
      // Mark guilds as inactive if no activity for 30 days
      const inactiveGuilds = await this.db.query(`
        UPDATE guilds
        SET is_disbanded = true, disbanded_at = CURRENT_TIMESTAMP
        WHERE last_activity < CURRENT_TIMESTAMP - INTERVAL '30 days'
        AND is_npc_guild = false
        AND is_disbanded = false
        RETURNING id, name
      `);

      // Clean up expired guild applications (older than 7 days)
      await this.db.query(`
        DELETE FROM guild_applications
        WHERE applied_at < CURRENT_TIMESTAMP - INTERVAL '7 days'
        AND status = 'pending'
      `);

      // Clean up old guild messages (older than 90 days)
      await this.db.query(`
        DELETE FROM guild_messages
        WHERE sent_at < CURRENT_TIMESTAMP - INTERVAL '90 days'
        AND is_pinned = false
        AND is_official = false
      `);

      // Archive completed guild events (older than 30 days)
      await this.db.query(`
        DELETE FROM guild_events
        WHERE scheduled_at < CURRENT_TIMESTAMP - INTERVAL '30 days'
        AND status = 'completed'
      `);

      this.logger.info(
        `Cleaned inactive guilds: ${inactiveGuilds.rows.length} guilds disbanded`,
      );
    } catch (error) {
      this.logger.error("Error cleaning inactive guilds:", error);
    }
  }

  /**
   * DATABASE HELPER METHODS
   */

  private async loadJobConfigurations(): Promise<CronJobConfig[]> {
    const result = await this.db.query(`
      SELECT * FROM cron_jobs WHERE is_active = true
    `);

    return result.rows.map((row) => ({
      id: row.id,
      name: row.job_name,
      cronExpression: row.cron_expression,
      handler: async () => {}, // Will be set by job registration
      isActive: row.is_active,
      maxRuntimeSeconds: row.max_runtime_seconds,
      description: row.description,
    }));
  }

  private async saveJobConfiguration(config: CronJobConfig): Promise<void> {
    await this.db.query(
      `
      INSERT INTO cron_jobs (id, job_name, job_type, cron_expression, is_active, max_runtime_seconds, description)
      VALUES ($1, $2, 'game_mechanic', $3, $4, $5, $6)
      ON CONFLICT (job_name) DO UPDATE SET
        cron_expression = $3,
        is_active = $4,
        max_runtime_seconds = $5,
        description = $6,
        updated_at = CURRENT_TIMESTAMP
    `,
      [
        config.id,
        config.name,
        config.cronExpression,
        config.isActive,
        config.maxRuntimeSeconds,
        config.description,
      ],
    );
  }

  private async saveExecutionLog(execution: CronJobExecution): Promise<void> {
    await this.db.query(
      `
      INSERT INTO cron_job_executions (
        id, job_id, execution_id, status, started_at, completed_at, 
        runtime_seconds, records_processed, error_message, execution_log
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `,
      [
        execution.id,
        execution.jobId,
        execution.executionId,
        execution.status,
        execution.startedAt,
        execution.completedAt,
        execution.runtimeSeconds,
        execution.recordsProcessed,
        execution.errorMessage,
        JSON.stringify(execution.executionLog),
      ],
    );
  }

  private async updateJobStats(
    jobId: string,
    success: boolean,
    runtime: number,
  ): Promise<void> {
    const incrementField = success ? "success_count" : "failure_count";
    await this.db.query(
      `
      UPDATE cron_jobs 
      SET run_count = run_count + 1,
          ${incrementField} = ${incrementField} + 1,
          last_run = CURRENT_TIMESTAMP,
          next_run = CURRENT_TIMESTAMP + INTERVAL '1 hour'
      WHERE id = $1
    `,
      [jobId],
    );
  }

  /**
   * PUBLIC API METHODS
   */

  /**
   * Stop all cron jobs
   */
  public async shutdown(): Promise<void> {
    this.logger.info("Shutting down Cron Manager...");

    for (const [id, job] of this.jobs) {
      job.stop();
      this.logger.info(`Stopped job: ${id}`);
    }

    this.jobs.clear();
    this.activeExecutions.clear();
  }

  /**
   * Get status of all jobs
   */
  public async getJobStatus(): Promise<any[]> {
    const result = await this.db.query(`
      SELECT cj.*, 
             cje.status as last_execution_status,
             cje.runtime_seconds as last_runtime
      FROM cron_jobs cj
      LEFT JOIN LATERAL (
        SELECT status, runtime_seconds 
        FROM cron_job_executions 
        WHERE job_id = cj.id 
        ORDER BY started_at DESC 
        LIMIT 1
      ) cje ON true
      ORDER BY cj.job_name
    `);

    return result.rows;
  }

  /**
   * Manually trigger a job
   */
  public async triggerJob(jobName: string): Promise<void> {
    // Find and execute job manually
    const jobConfig = await this.db.query(
      `
      SELECT * FROM cron_jobs WHERE job_name = $1
    `,
      [jobName],
    );

    if (jobConfig.rows.length === 0) {
      throw new Error(`Job not found: ${jobName}`);
    }

    // This would require mapping job names to handlers
    this.logger.info(`Manually triggered job: ${jobName}`);
  }
}
