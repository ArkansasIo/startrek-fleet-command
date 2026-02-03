import { Router } from "express";
import { DatabaseManager } from "../database/DatabaseManager";
import { CronManager } from "../cron/cronManager";
import { Logger } from "../utils/Logger";

export function createAdminRoutes(
  db: DatabaseManager,
  cronManager: CronManager,
): Router {
  const router = Router();
  const logger = new Logger("AdminRoutes");

  // Simple admin authentication middleware (should be more robust in production)
  const requireAdmin = (req: any, res: any, next: any) => {
    const adminKey = req.headers["x-admin-key"];
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  };

  // Apply admin middleware to all routes
  router.use(requireAdmin);

  /**
   * Get system statistics
   */
  router.get("/stats", async (req, res) => {
    try {
      const dbStats = await db.getDatabaseStats();
      const cronStatus = await cronManager.getJobStatus();

      // System metrics
      const systemStats = {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
      };

      res.json({
        system: systemStats,
        database: dbStats,
        cronJobs: cronStatus,
      });
    } catch (error) {
      logger.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  /**
   * Get all players with admin details
   */
  router.get("/players", async (req, res) => {
    try {
      const { limit = 50, offset = 0, active = "true" } = req.query;

      const players = await db.query(
        `
        SELECT p.id, p.username, p.email, p.created_at, p.last_login, 
               p.is_active, p.is_banned, p.ban_reason,
               pp.display_name, pp.rank, pp.level, pp.experience_points,
               ps.battles_total, ps.missions_completed, ps.territories_controlled
        FROM players p
        JOIN player_profiles pp ON p.id = pp.player_id
        LEFT JOIN player_stats ps ON p.id = ps.player_id
        WHERE ($1 = 'all' OR p.is_active = $1::boolean)
        ORDER BY p.created_at DESC
        LIMIT $2 OFFSET $3
      `,
        [active, limit, offset],
      );

      const total = await db.query(
        `
        SELECT COUNT(*) as count FROM players 
        WHERE ($1 = 'all' OR is_active = $1::boolean)
      `,
        [active],
      );

      res.json({
        players: players.rows,
        total: parseInt(total.rows[0].count),
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
    } catch (error) {
      logger.error("Error fetching players:", error);
      res.status(500).json({ error: "Failed to fetch players" });
    }
  });

  /**
   * Ban/unban player
   */
  router.put("/players/:playerId/ban", async (req, res) => {
    try {
      const { playerId } = req.params;
      const { banned, reason, expiresAt } = req.body;

      await db.query(
        `
        UPDATE players 
        SET is_banned = $1, 
            ban_reason = $2, 
            ban_expires_at = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
      `,
        [banned, reason, expiresAt, playerId],
      );

      res.json({
        message: `Player ${banned ? "banned" : "unbanned"} successfully`,
      });
    } catch (error) {
      logger.error("Error updating player ban status:", error);
      res.status(500).json({ error: "Failed to update ban status" });
    }
  });

  /**
   * Get galaxy management data
   */
  router.get("/galaxies", async (req, res) => {
    try {
      const galaxies = await db.query(`
        SELECT g.*,
               COUNT(DISTINCT tc.player_id) as active_players,
               COUNT(DISTINCT s.id) as total_ships,
               AVG(gt.duration_minutes) as avg_turn_duration
        FROM galaxies g
        LEFT JOIN territory_control tc ON g.id = tc.galaxy_id
        LEFT JOIN ships s ON s.current_location_type = 'galaxy' 
        LEFT JOIN game_turns gt ON g.id = gt.galaxy_id AND gt.created_at >= NOW() - INTERVAL '7 days'
        GROUP BY g.id
        ORDER BY g.created_at DESC
      `);

      res.json({ galaxies: galaxies.rows });
    } catch (error) {
      logger.error("Error fetching galaxies:", error);
      res.status(500).json({ error: "Failed to fetch galaxies" });
    }
  });

  /**
   * Create new galaxy
   */
  router.post("/galaxies", async (req, res) => {
    try {
      const { name, description, maxPlayers, turnDurationMinutes } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Galaxy name is required" });
      }

      const result = await db.query(
        `
        INSERT INTO galaxies (name, description, max_players, turn_duration_minutes)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `,
        [name, description, maxPlayers || 1000, turnDurationMinutes || 30],
      );

      res.json({
        galaxyId: result.rows[0].id,
        message: "Galaxy created successfully",
      });
    } catch (error) {
      logger.error("Error creating galaxy:", error);
      res.status(500).json({ error: "Failed to create galaxy" });
    }
  });

  /**
   * Update galaxy settings
   */
  router.put("/galaxies/:galaxyId", async (req, res) => {
    try {
      const { galaxyId } = req.params;
      const { name, description, maxPlayers, turnDurationMinutes, isActive } =
        req.body;

      await db.query(
        `
        UPDATE galaxies 
        SET name = COALESCE($1, name),
            description = COALESCE($2, description),
            max_players = COALESCE($3, max_players),
            turn_duration_minutes = COALESCE($4, turn_duration_minutes),
            is_active = COALESCE($5, is_active)
        WHERE id = $6
      `,
        [
          name,
          description,
          maxPlayers,
          turnDurationMinutes,
          isActive,
          galaxyId,
        ],
      );

      res.json({ message: "Galaxy updated successfully" });
    } catch (error) {
      logger.error("Error updating galaxy:", error);
      res.status(500).json({ error: "Failed to update galaxy" });
    }
  });

  /**
   * Get cron job status and management
   */
  router.get("/cron", async (req, res) => {
    try {
      const jobStatus = await cronManager.getJobStatus();
      res.json({ jobs: jobStatus });
    } catch (error) {
      logger.error("Error fetching cron status:", error);
      res.status(500).json({ error: "Failed to fetch cron status" });
    }
  });

  /**
   * Manually trigger a cron job
   */
  router.post("/cron/:jobName/trigger", async (req, res) => {
    try {
      const { jobName } = req.params;

      await cronManager.triggerJob(jobName);

      res.json({ message: `Job ${jobName} triggered successfully` });
    } catch (error) {
      logger.error("Error triggering cron job:", error);
      res.status(500).json({ error: "Failed to trigger job" });
    }
  });

  /**
   * Get recent system logs
   */
  router.get("/logs", async (req, res) => {
    try {
      const { limit = 100, level = "INFO" } = req.query;

      // This would be more sophisticated in a real system
      // For now, return cron job execution logs as a proxy
      const logs = await db.query(
        `
        SELECT cje.*, cj.job_name, cj.job_type
        FROM cron_job_executions cje
        JOIN cron_jobs cj ON cje.job_id = cj.id
        ORDER BY cje.started_at DESC
        LIMIT $1
      `,
        [limit],
      );

      res.json({ logs: logs.rows });
    } catch (error) {
      logger.error("Error fetching logs:", error);
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  });

  /**
   * Get database performance metrics
   */
  router.get("/database/performance", async (req, res) => {
    try {
      // Get table sizes
      const tableSizes = await db.query(`
        SELECT 
          schemaname,
          tablename,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
          pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY size_bytes DESC
        LIMIT 20
      `);

      // Get query statistics (if pg_stat_statements is available)
      let queryStats = { rows: [] };
      try {
        queryStats = await db.query(`
          SELECT 
            left(query, 50) as query_snippet,
            calls,
            total_time,
            mean_time,
            rows
          FROM pg_stat_statements 
          ORDER BY total_time DESC 
          LIMIT 10
        `);
      } catch (e) {
        // pg_stat_statements extension not available
      }

      // Get connection info
      const connections = await db.query(`
        SELECT 
          state,
          COUNT(*) as count
        FROM pg_stat_activity 
        WHERE datname = current_database()
        GROUP BY state
      `);

      res.json({
        tableSizes: tableSizes.rows,
        queryStats: queryStats.rows,
        connections: connections.rows,
      });
    } catch (error) {
      logger.error("Error fetching database performance:", error);
      res.status(500).json({ error: "Failed to fetch database performance" });
    }
  });

  /**
   * Run database maintenance
   */
  router.post("/database/maintenance", async (req, res) => {
    try {
      const { operation } = req.body;

      switch (operation) {
        case "vacuum":
          await db.query("VACUUM ANALYZE");
          break;
        case "reindex":
          await db.query("REINDEX DATABASE CONCURRENTLY");
          break;
        case "cleanup_old_data":
          // Clean up old execution logs
          await db.query(`
            DELETE FROM cron_job_executions 
            WHERE started_at < NOW() - INTERVAL '30 days'
          `);
          // Clean up old messages
          await db.query(`
            DELETE FROM player_messages 
            WHERE sent_at < NOW() - INTERVAL '90 days' AND is_read = true
          `);
          break;
        default:
          return res
            .status(400)
            .json({ error: "Unknown maintenance operation" });
      }

      res.json({ message: `Database ${operation} completed successfully` });
    } catch (error) {
      logger.error("Error running database maintenance:", error);
      res.status(500).json({ error: "Database maintenance failed" });
    }
  });

  /**
   * Get game balance statistics
   */
  router.get("/balance", async (req, res) => {
    try {
      const stats = await Promise.all([
        // Resource distribution
        db.query(`
          SELECT rt.name, rt.category,
                 COUNT(pr.player_id) as players_with_resource,
                 AVG(pr.quantity) as avg_quantity,
                 SUM(pr.quantity) as total_quantity
          FROM resource_types rt
          LEFT JOIN player_resources pr ON rt.id = pr.resource_type_id
          WHERE pr.quantity > 0
          GROUP BY rt.id, rt.name, rt.category
          ORDER BY total_quantity DESC
        `),

        // Ship class popularity
        db.query(`
          SELECT sc.name, sc.class_type,
                 COUNT(s.id) as ship_count,
                 AVG(s.experience_points) as avg_experience
          FROM ship_classes sc
          LEFT JOIN ships s ON sc.id = s.ship_class_id
          GROUP BY sc.id, sc.name, sc.class_type
          ORDER BY ship_count DESC
        `),

        // Technology research rates
        db.query(`
          SELECT t.name, t.category, t.tier,
                 COUNT(pr.player_id) as players_researching,
                 COUNT(CASE WHEN pr.status = 'completed' THEN 1 END) as completed_count
          FROM technologies t
          LEFT JOIN player_research pr ON t.id = pr.technology_id
          GROUP BY t.id, t.name, t.category, t.tier
          ORDER BY completed_count DESC
        `),
      ]);

      res.json({
        resources: stats[0].rows,
        shipClasses: stats[1].rows,
        technologies: stats[2].rows,
      });
    } catch (error) {
      logger.error("Error fetching balance stats:", error);
      res.status(500).json({ error: "Failed to fetch balance statistics" });
    }
  });

  /**
   * Emergency system controls
   */
  router.post("/emergency/:action", async (req, res) => {
    try {
      const { action } = req.params;
      const { galaxyId, reason } = req.body;

      switch (action) {
        case "pause_galaxy":
          await db.query(
            `
            UPDATE galaxies 
            SET is_active = false 
            WHERE id = $1
          `,
            [galaxyId],
          );
          logger.warn(`Galaxy ${galaxyId} paused by admin. Reason: ${reason}`);
          break;

        case "resume_galaxy":
          await db.query(
            `
            UPDATE galaxies 
            SET is_active = true 
            WHERE id = $1
          `,
            [galaxyId],
          );
          logger.info(`Galaxy ${galaxyId} resumed by admin`);
          break;

        case "emergency_maintenance":
          // This would trigger maintenance mode
          logger.warn(`Emergency maintenance triggered. Reason: ${reason}`);
          break;

        default:
          return res.status(400).json({ error: "Unknown emergency action" });
      }

      res.json({ message: `Emergency action ${action} executed successfully` });
    } catch (error) {
      logger.error("Error executing emergency action:", error);
      res.status(500).json({ error: "Emergency action failed" });
    }
  });

  return router;
}
