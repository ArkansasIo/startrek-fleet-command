import { Router } from "express";
import { DatabaseManager } from "../database/DatabaseManager";
import { GameEngine } from "../game/GameEngine";
import { Logger } from "../utils/Logger";

export function createEventRoutes(
  db: DatabaseManager,
  gameEngine: GameEngine,
): Router {
  const router = Router();
  const logger = new Logger("EventRoutes");

  /**
   * EVENT CATEGORIES AND TYPES
   */

  // Get all event categories
  router.get("/categories", async (req, res) => {
    try {
      const result = await db.query(`
      SELECT 
        ec.*,
        COUNT(et.id) as event_types_count
      FROM event_categories ec
      LEFT JOIN event_types et ON ec.id = et.category_id AND et.id IS NOT NULL
      WHERE ec.is_active = true
      GROUP BY ec.id, ec.category_name, ec.category_code, ec.description, 
               ec.icon_name, ec.color_scheme, ec.risk_level, ec.reward_tier, 
               ec.sort_order, ec.is_active, ec.created_at
      ORDER BY ec.sort_order, ec.category_name
    `);

      res.json({
        success: true,
        categories: result.rows,
      });
    } catch (error) {
      logger.error("Error fetching event categories:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch event categories",
      });
    }
  });

  // Get event types by category
  router.get("/types/:categoryId", async (req, res) => {
    try {
      const { categoryId } = req.params;

      const result = await db.query(
        `
      SELECT 
        et.*,
        ec.category_name,
        ec.category_code,
        ec.color_scheme as category_color
      FROM event_types et
      JOIN event_categories ec ON et.category_id = ec.id
      WHERE et.category_id = $1
      ORDER BY et.difficulty_tier, et.type_name
    `,
        [categoryId],
      );

      res.json({
        success: true,
        eventTypes: result.rows,
      });
    } catch (error) {
      logger.error("Error fetching event types:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch event types",
      });
    }
  });

  // Get all event types with filters
  router.get("/types", async (req, res) => {
    try {
      const { category, difficulty_tier, participant_type, is_pvp_enabled } =
        req.query;

      let query = `
      SELECT 
        et.*,
        ec.category_name,
        ec.category_code,
        ec.color_scheme as category_color
      FROM event_types et
      JOIN event_categories ec ON et.category_id = ec.id
      WHERE 1=1
    `;
      const params: any[] = [];
      let paramIndex = 1;

      if (category) {
        query += ` AND ec.category_code = $${paramIndex}`;
        params.push(category);
        paramIndex++;
      }

      if (difficulty_tier) {
        query += ` AND et.difficulty_tier <= $${paramIndex}`;
        params.push(difficulty_tier);
        paramIndex++;
      }

      if (participant_type) {
        query += ` AND et.participant_type = $${paramIndex}`;
        params.push(participant_type);
        paramIndex++;
      }

      if (is_pvp_enabled !== undefined) {
        query += ` AND et.is_pvp_enabled = $${paramIndex}`;
        params.push(is_pvp_enabled === "true");
        paramIndex++;
      }

      query += ` ORDER BY et.difficulty_tier, et.type_name`;

      const result = await db.query(query, params);

      res.json({
        success: true,
        eventTypes: result.rows,
      });
    } catch (error) {
      logger.error("Error fetching filtered event types:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch event types",
      });
    }
  });

  /**
   * UNIVERSE EVENTS
   */

  // Get active universe events for a galaxy
  router.get("/universe/:galaxyId", async (req, res) => {
    try {
      const { galaxyId } = req.params;
      const { status, category } = req.query;

      let query = `
      SELECT 
        ue.*,
        et.type_name,
        et.event_class,
        et.difficulty_tier,
        et.participant_type,
        et.max_participants,
        et.is_pvp_enabled,
        ec.category_name,
        ec.category_code,
        ec.color_scheme,
        eb.boss_name,
        eb.boss_title,
        eb.boss_class
      FROM universe_events ue
      JOIN event_types et ON ue.event_type_id = et.id
      JOIN event_categories ec ON et.category_id = ec.id
      LEFT JOIN event_bosses eb ON ue.primary_boss_id = eb.id
      WHERE ue.galaxy_id = $1
    `;
      const params: any[] = [galaxyId];
      let paramIndex = 2;

      if (status) {
        query += ` AND ue.event_status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      } else {
        query += ` AND ue.event_status IN ('spawned', 'active')`;
      }

      if (category) {
        query += ` AND ec.category_code = $${paramIndex}`;
        params.push(category);
        paramIndex++;
      }

      query += ` ORDER BY ue.spawned_at DESC`;

      const result = await db.query(query, params);

      res.json({
        success: true,
        events: result.rows,
      });
    } catch (error) {
      logger.error("Error fetching universe events:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch universe events",
      });
    }
  });

  // Get specific universe event details
  router.get("/universe/details/:eventId", async (req, res) => {
    try {
      const { eventId } = req.params;

      // Get main event details
      const eventResult = await db.query(
        `
      SELECT 
        ue.*,
        et.*,
        ec.category_name,
        ec.category_code,
        ec.color_scheme,
        eb.boss_name,
        eb.boss_title,
        eb.boss_class,
        eb.health_points as boss_max_health,
        eb.special_abilities,
        eb.lore_description
      FROM universe_events ue
      JOIN event_types et ON ue.event_type_id = et.id
      JOIN event_categories ec ON et.category_id = ec.id
      LEFT JOIN event_bosses eb ON ue.primary_boss_id = eb.id
      WHERE ue.id = $1
    `,
        [eventId],
      );

      if (eventResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      // Get event participants
      const participantsResult = await db.query(
        `
      SELECT 
        ep.*,
        pp.display_name,
        pp.rank,
        pp.level,
        g.name as guild_name,
        g.tag as guild_tag
      FROM event_participants ep
      JOIN player_profiles pp ON ep.player_id = pp.player_id
      LEFT JOIN guild_members gm ON ep.player_id = gm.player_id
      LEFT JOIN guilds g ON gm.guild_id = g.id
      WHERE ep.event_id = $1
      ORDER BY ep.contribution_score DESC
    `,
        [eventId],
      );

      // Get active event objects
      const objectsResult = await db.query(
        `
      SELECT 
        aeo.*,
        eo.object_name,
        eo.object_type,
        eo.object_class,
        eo.description,
        eo.can_be_scanned,
        eo.can_be_collected,
        eo.can_be_activated
      FROM active_event_objects aeo
      JOIN event_objects eo ON aeo.object_id = eo.id
      WHERE aeo.event_id = $1 AND aeo.current_status = 'active'
    `,
        [eventId],
      );

      // Get active event missions
      const missionsResult = await db.query(
        `
      SELECT 
        aem.*,
        em.mission_name,
        em.mission_type,
        em.mission_category,
        em.description,
        em.primary_objectives,
        em.completion_rewards
      FROM active_event_missions aem
      JOIN event_missions em ON aem.mission_id = em.id
      WHERE aem.event_id = $1
      ORDER BY aem.mission_status, em.mission_type
    `,
        [eventId],
      );

      res.json({
        success: true,
        event: eventResult.rows[0],
        participants: participantsResult.rows,
        objects: objectsResult.rows,
        missions: missionsResult.rows,
      });
    } catch (error) {
      logger.error("Error fetching event details:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch event details",
      });
    }
  });

  // Join a universe event
  router.post("/universe/:eventId/join", async (req, res) => {
    try {
      const { eventId } = req.params;
      const { playerId, guildId } = req.body;

      if (!playerId) {
        return res.status(400).json({
          success: false,
          message: "Player ID is required",
        });
      }

      const result = await gameEngine.joinUniverseEvent(
        playerId,
        eventId,
        guildId,
      );

      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      logger.error("Error joining event:", error);
      res.status(500).json({
        success: false,
        message: "Failed to join event",
      });
    }
  });

  // Leave a universe event
  router.post("/universe/:eventId/leave", async (req, res) => {
    try {
      const { eventId } = req.params;
      const { playerId } = req.body;

      if (!playerId) {
        return res.status(400).json({
          success: false,
          message: "Player ID is required",
        });
      }

      await db.transaction(async (client) => {
        // Update participant status
        await client.query(
          `
        UPDATE event_participants 
        SET participation_status = 'withdrawn'
        WHERE event_id = $1 AND player_id = $2
      `,
          [eventId, playerId],
        );

        // Update event participant count
        await client.query(
          `
        UPDATE universe_events 
        SET active_participants = active_participants - 1
        WHERE id = $1
      `,
          [eventId],
        );
      });

      res.json({
        success: true,
        message: "Successfully left the event",
      });
    } catch (error) {
      logger.error("Error leaving event:", error);
      res.status(500).json({
        success: false,
        message: "Failed to leave event",
      });
    }
  });

  // Get player's event participation
  router.get("/participation/:playerId", async (req, res) => {
    try {
      const { playerId } = req.params;
      const { status } = req.query;

      let query = `
      SELECT 
        ep.*,
        ue.event_name,
        ue.event_status,
        ue.event_phase,
        ue.spawned_at,
        ue.hard_deadline,
        et.type_name,
        et.event_class,
        et.difficulty_tier,
        ec.category_name,
        ec.category_code,
        ec.color_scheme
      FROM event_participants ep
      JOIN universe_events ue ON ep.event_id = ue.id
      JOIN event_types et ON ue.event_type_id = et.id
      JOIN event_categories ec ON et.category_id = ec.id
      WHERE ep.player_id = $1
    `;
      const params: any[] = [playerId];

      if (status) {
        query += ` AND ep.participation_status = $2`;
        params.push(status);
      }

      query += ` ORDER BY ep.joined_at DESC`;

      const result = await db.query(query, params);

      res.json({
        success: true,
        participations: result.rows,
      });
    } catch (error) {
      logger.error("Error fetching player participation:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch participation data",
      });
    }
  });

  /**
   * EVENT BOSSES
   */

  // Get event bosses
  router.get("/bosses", async (req, res) => {
    try {
      const { boss_class, species, tier_min, tier_max } = req.query;

      let query = `
      SELECT * FROM event_bosses WHERE 1=1
    `;
      const params: any[] = [];
      let paramIndex = 1;

      if (boss_class) {
        query += ` AND boss_class = $${paramIndex}`;
        params.push(boss_class);
        paramIndex++;
      }

      if (species) {
        query += ` AND species = $${paramIndex}`;
        params.push(species);
        paramIndex++;
      }

      if (tier_min) {
        query += ` AND boss_tier >= $${paramIndex}`;
        params.push(tier_min);
        paramIndex++;
      }

      if (tier_max) {
        query += ` AND boss_tier <= $${paramIndex}`;
        params.push(tier_max);
        paramIndex++;
      }

      query += ` ORDER BY boss_tier, boss_name`;

      const result = await db.query(query, params);

      res.json({
        success: true,
        bosses: result.rows,
      });
    } catch (error) {
      logger.error("Error fetching event bosses:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch event bosses",
      });
    }
  });

  // Attack event boss
  router.post("/universe/:eventId/boss/:bossId/attack", async (req, res) => {
    try {
      const { eventId, bossId } = req.params;
      const { playerId, attackData } = req.body;

      if (!playerId || !attackData) {
        return res.status(400).json({
          success: false,
          message: "Player ID and attack data are required",
        });
      }

      const result = await gameEngine.attackEventBoss(
        playerId,
        eventId,
        bossId,
        attackData,
      );

      res.json(result);
    } catch (error) {
      logger.error("Error attacking boss:", error);
      res.status(500).json({
        success: false,
        message: "Failed to attack boss",
      });
    }
  });

  /**
   * EVENT OBJECTS
   */

  // Get event objects
  router.get("/objects", async (req, res) => {
    try {
      const { object_type, object_class } = req.query;

      let query = `
      SELECT * FROM event_objects WHERE 1=1
    `;
      const params: any[] = [];
      let paramIndex = 1;

      if (object_type) {
        query += ` AND object_type = $${paramIndex}`;
        params.push(object_type);
        paramIndex++;
      }

      if (object_class) {
        query += ` AND object_class = $${paramIndex}`;
        params.push(object_class);
        paramIndex++;
      }

      query += ` ORDER BY object_type, object_name`;

      const result = await db.query(query, params);

      res.json({
        success: true,
        objects: result.rows,
      });
    } catch (error) {
      logger.error("Error fetching event objects:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch event objects",
      });
    }
  });

  // Interact with event object
  router.post(
    "/universe/:eventId/object/:objectId/interact",
    async (req, res) => {
      try {
        const { eventId, objectId } = req.params;
        const { playerId, interactionType } = req.body;

        if (!playerId || !interactionType) {
          return res.status(400).json({
            success: false,
            message: "Player ID and interaction type are required",
          });
        }

        const result = await gameEngine.interactWithEventObject(
          playerId,
          eventId,
          objectId,
          interactionType,
        );

        res.json(result);
      } catch (error) {
        logger.error("Error interacting with object:", error);
        res.status(500).json({
          success: false,
          message: "Failed to interact with object",
        });
      }
    },
  );

  /**
   * EVENT MISSIONS
   */

  // Get event missions
  router.get("/missions", async (req, res) => {
    try {
      const { event_type_id, mission_type, mission_category } = req.query;

      let query = `
      SELECT 
        em.*,
        et.type_name,
        ec.category_name
      FROM event_missions em
      LEFT JOIN event_types et ON em.event_type_id = et.id
      LEFT JOIN event_categories ec ON et.category_id = ec.id
      WHERE 1=1
    `;
      const params: any[] = [];
      let paramIndex = 1;

      if (event_type_id) {
        query += ` AND em.event_type_id = $${paramIndex}`;
        params.push(event_type_id);
        paramIndex++;
      }

      if (mission_type) {
        query += ` AND em.mission_type = $${paramIndex}`;
        params.push(mission_type);
        paramIndex++;
      }

      if (mission_category) {
        query += ` AND em.mission_category = $${paramIndex}`;
        params.push(mission_category);
        paramIndex++;
      }

      query += ` ORDER BY em.base_difficulty, em.mission_name`;

      const result = await db.query(query, params);

      res.json({
        success: true,
        missions: result.rows,
      });
    } catch (error) {
      logger.error("Error fetching event missions:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch event missions",
      });
    }
  });

  // Get active missions for an event
  router.get("/universe/:eventId/missions", async (req, res) => {
    try {
      const { eventId } = req.params;

      const result = await db.query(
        `
      SELECT 
        aem.*,
        em.mission_name,
        em.mission_type,
        em.mission_category,
        em.description,
        em.detailed_description,
        em.primary_objectives,
        em.secondary_objectives,
        em.completion_rewards,
        em.required_level,
        em.max_participants,
        em.base_difficulty
      FROM active_event_missions aem
      JOIN event_missions em ON aem.mission_id = em.id
      WHERE aem.event_id = $1
      ORDER BY aem.mission_status, em.mission_type, em.base_difficulty
    `,
        [eventId],
      );

      res.json({
        success: true,
        missions: result.rows,
      });
    } catch (error) {
      logger.error("Error fetching active missions:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch active missions",
      });
    }
  });

  // Accept/Start a mission
  router.post(
    "/universe/:eventId/mission/:missionId/accept",
    async (req, res) => {
      try {
        const { eventId, missionId } = req.params;
        const { playerId } = req.body;

        if (!playerId) {
          return res.status(400).json({
            success: false,
            message: "Player ID is required",
          });
        }

        // Check if player is participating in the event
        const participation = await db.query(
          `
      SELECT id FROM event_participants 
      WHERE event_id = $1 AND player_id = $2 AND participation_status = 'active'
    `,
          [eventId, playerId],
        );

        if (participation.rows.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Must be participating in the event to accept missions",
          });
        }

        // Check if mission is available
        const mission = await db.query(
          `
      SELECT * FROM active_event_missions 
      WHERE id = $1 AND event_id = $2 AND mission_status IN ('available', 'active')
    `,
          [missionId, eventId],
        );

        if (mission.rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Mission not found or not available",
          });
        }

        const missionData = mission.rows[0];

        // Check if player is already on this mission
        const existingProgress = await db.query(
          `
      SELECT id FROM player_mission_progress 
      WHERE player_id = $1 AND active_mission_id = $2
    `,
          [playerId, missionId],
        );

        if (existingProgress.rows.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Already participating in this mission",
          });
        }

        // Check participant limits
        if (missionData.current_participants >= missionData.max_participants) {
          return res.status(400).json({
            success: false,
            message: "Mission is at maximum capacity",
          });
        }

        await db.transaction(async (client) => {
          // Add player to mission
          await client.query(
            `
        INSERT INTO player_mission_progress (
          player_id, active_mission_id, mission_status, started_at
        ) VALUES ($1, $2, 'active', CURRENT_TIMESTAMP)
      `,
            [playerId, missionId],
          );

          // Update mission participant count
          await client.query(
            `
        UPDATE active_event_missions 
        SET current_participants = current_participants + 1
        WHERE id = $1
      `,
            [missionId],
          );

          // Update mission status to active if first participant
          if (missionData.current_participants === 0) {
            await client.query(
              `
          UPDATE active_event_missions 
          SET mission_status = 'active', started_at = CURRENT_TIMESTAMP
          WHERE id = $1
        `,
              [missionId],
            );
          }
        });

        res.json({
          success: true,
          message: "Successfully accepted mission",
        });
      } catch (error) {
        logger.error("Error accepting mission:", error);
        res.status(500).json({
          success: false,
          message: "Failed to accept mission",
        });
      }
    },
  );

  // Get player's mission progress
  router.get("/mission/progress/:playerId", async (req, res) => {
    try {
      const { playerId } = req.params;
      const { eventId } = req.query;

      let query = `
      SELECT 
        pmp.*,
        aem.mission_instance_name,
        aem.event_id,
        em.mission_name,
        em.mission_type,
        em.mission_category,
        em.primary_objectives,
        em.completion_rewards,
        ue.event_name
      FROM player_mission_progress pmp
      JOIN active_event_missions aem ON pmp.active_mission_id = aem.id
      JOIN event_missions em ON aem.mission_id = em.id
      JOIN universe_events ue ON aem.event_id = ue.id
      WHERE pmp.player_id = $1
    `;
      const params: any[] = [playerId];

      if (eventId) {
        query += ` AND aem.event_id = $2`;
        params.push(eventId);
      }

      query += ` ORDER BY pmp.started_at DESC`;

      const result = await db.query(query, params);

      res.json({
        success: true,
        missionProgress: result.rows,
      });
    } catch (error) {
      logger.error("Error fetching mission progress:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch mission progress",
      });
    }
  });

  /**
   * EVENT ADMINISTRATION (Admin only routes)
   */

  // Spawn a new event (Admin)
  router.post("/admin/spawn", async (req, res) => {
    try {
      const { galaxyId, eventTypeId, locationData, overrides } = req.body;

      if (!galaxyId || !eventTypeId) {
        return res.status(400).json({
          success: false,
          message: "Galaxy ID and Event Type ID are required",
        });
      }

      const result = await gameEngine.spawnUniverseEvent(
        galaxyId,
        eventTypeId,
        locationData,
        overrides,
      );

      res.json(result);
    } catch (error) {
      logger.error("Error spawning event:", error);
      res.status(500).json({
        success: false,
        message: "Failed to spawn event",
      });
    }
  });

  // Force complete an event (Admin)
  router.post("/admin/:eventId/complete", async (req, res) => {
    try {
      const { eventId } = req.params;
      const { success } = req.body;

      await gameEngine.completeUniverseEvent(eventId, success !== false);

      res.json({
        success: true,
        message: "Event completed successfully",
      });
    } catch (error) {
      logger.error("Error completing event:", error);
      res.status(500).json({
        success: false,
        message: "Failed to complete event",
      });
    }
  });

  // Get event system statistics
  router.get("/admin/statistics", async (req, res) => {
    try {
      const stats = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM universe_events WHERE event_status = 'active') as active_events,
        (SELECT COUNT(*) FROM universe_events WHERE event_status = 'spawned') as spawned_events,
        (SELECT COUNT(*) FROM universe_events WHERE event_status = 'completed') as completed_events,
        (SELECT COUNT(*) FROM event_participants WHERE participation_status = 'active') as active_participants,
        (SELECT COUNT(DISTINCT player_id) FROM event_participants) as unique_participants
    `);

      const categoryStats = await db.query(`
      SELECT 
        ec.category_name,
        ec.category_code,
        COUNT(ue.id) as event_count,
        COUNT(ep.id) as participant_count
      FROM event_categories ec
      LEFT JOIN event_types et ON ec.id = et.category_id
      LEFT JOIN universe_events ue ON et.id = ue.event_type_id
      LEFT JOIN event_participants ep ON ue.id = ep.event_id
      GROUP BY ec.id, ec.category_name, ec.category_code
      ORDER BY event_count DESC
    `);

      res.json({
        success: true,
        statistics: stats.rows[0],
        categoryStatistics: categoryStats.rows,
      });
    } catch (error) {
      logger.error("Error fetching statistics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch statistics",
      });
    }
  });

  return router;
}
