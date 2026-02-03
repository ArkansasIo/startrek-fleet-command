import { Router } from "express";
import { DatabaseManager } from "../database/DatabaseManager";
import { GameEngine } from "../game/GameEngine";
import { Logger } from "../utils/Logger";

export function createGameRoutes(
  db: DatabaseManager,
  gameEngine: GameEngine,
): Router {
  const router = Router();
  const logger = new Logger("GameRoutes");

  /**
   * Get list of available galaxies
   */
  router.get("/galaxies", async (req, res) => {
    try {
      const galaxies = await db.getActiveGalaxies();
      res.json({ galaxies });
    } catch (error) {
      logger.error("Error fetching galaxies:", error);
      res.status(500).json({ error: "Failed to fetch galaxies" });
    }
  });

  /**
   * Get galaxy details
   */
  router.get("/galaxies/:galaxyId", async (req, res) => {
    try {
      const { galaxyId } = req.params;
      const galaxy = await db.getGalaxy(galaxyId);

      if (!galaxy) {
        return res.status(404).json({ error: "Galaxy not found" });
      }

      // Get additional galaxy statistics
      const stats = await db.query(
        `
        SELECT 
          COUNT(DISTINCT p.id) as player_count,
          COUNT(DISTINCT s.id) as ship_count,
          COUNT(DISTINCT cb.id) as colonized_planets
        FROM galaxies g
        LEFT JOIN ships s ON s.current_location_type = 'galaxy' AND s.current_location_id = g.id
        LEFT JOIN players p ON s.player_id = p.id
        LEFT JOIN celestial_bodies cb ON cb.controlling_player_id = p.id AND cb.is_colonized = true
        WHERE g.id = $1
      `,
        [galaxyId],
      );

      res.json({
        galaxy: {
          ...galaxy,
          stats: stats.rows[0],
        },
      });
    } catch (error) {
      logger.error("Error fetching galaxy:", error);
      res.status(500).json({ error: "Failed to fetch galaxy" });
    }
  });

  /**
   * Submit player action for current turn
   */
  router.post("/actions", async (req, res) => {
    try {
      const {
        playerId,
        galaxyId,
        actionType,
        actionData,
        priority = 1,
      } = req.body;

      if (!playerId || !galaxyId || !actionType || !actionData) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Get current turn
      const currentTurn = await db.query(
        `
        SELECT id FROM game_turns 
        WHERE galaxy_id = $1 AND status = 'active'
        ORDER BY turn_number DESC
        LIMIT 1
      `,
        [galaxyId],
      );

      if (currentTurn.rows.length === 0) {
        return res.status(400).json({ error: "No active turn found" });
      }

      const turnId = currentTurn.rows[0].id;

      // Create player action
      const result = await db.query(
        `
        INSERT INTO player_actions (
          player_id, galaxy_id, turn_id, action_type, action_data, priority
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `,
        [
          playerId,
          galaxyId,
          turnId,
          actionType,
          JSON.stringify(actionData),
          priority,
        ],
      );

      res.json({
        actionId: result.rows[0].id,
        turnId,
        message: "Action submitted successfully",
      });
    } catch (error) {
      logger.error("Error submitting action:", error);
      res.status(500).json({ error: "Failed to submit action" });
    }
  });

  /**
   * Get player actions for current turn
   */
  router.get("/actions/:playerId/:galaxyId", async (req, res) => {
    try {
      const { playerId, galaxyId } = req.params;

      const actions = await db.query(
        `
        SELECT pa.*, gt.turn_number, gt.status as turn_status
        FROM player_actions pa
        JOIN game_turns gt ON pa.turn_id = gt.id
        WHERE pa.player_id = $1 AND pa.galaxy_id = $2
        ORDER BY gt.turn_number DESC, pa.priority ASC, pa.created_at ASC
        LIMIT 50
      `,
        [playerId, galaxyId],
      );

      res.json({ actions: actions.rows });
    } catch (error) {
      logger.error("Error fetching actions:", error);
      res.status(500).json({ error: "Failed to fetch actions" });
    }
  });

  /**
   * Get ship classes available for construction
   */
  router.get("/ship-classes", async (req, res) => {
    try {
      const { faction } = req.query;

      let query = "SELECT * FROM ship_classes";
      const params = [];

      if (faction) {
        query += " WHERE faction = $1";
        params.push(faction);
      }

      query += " ORDER BY class_type, name";

      const result = await db.query(query, params);
      res.json({ shipClasses: result.rows });
    } catch (error) {
      logger.error("Error fetching ship classes:", error);
      res.status(500).json({ error: "Failed to fetch ship classes" });
    }
  });

  /**
   * Get technologies available for research
   */
  router.get("/technologies", async (req, res) => {
    try {
      const { category, era } = req.query;

      let query = "SELECT * FROM technologies WHERE 1=1";
      const params = [];

      if (category) {
        query += " AND category = $" + (params.length + 1);
        params.push(category);
      }

      if (era) {
        query += " AND era = $" + (params.length + 1);
        params.push(era);
      }

      query += " ORDER BY tier, name";

      const result = await db.query(query, params);
      res.json({ technologies: result.rows });
    } catch (error) {
      logger.error("Error fetching technologies:", error);
      res.status(500).json({ error: "Failed to fetch technologies" });
    }
  });

  /**
   * Get player research progress
   */
  router.get("/research/:playerId", async (req, res) => {
    try {
      const { playerId } = req.params;

      const research = await db.query(
        `
        SELECT pr.*, t.name, t.description, t.category, t.tier, t.research_time_hours
        FROM player_research pr
        JOIN technologies t ON pr.technology_id = t.id
        WHERE pr.player_id = $1
        ORDER BY pr.started_at DESC
      `,
        [playerId],
      );

      res.json({ research: research.rows });
    } catch (error) {
      logger.error("Error fetching research:", error);
      res.status(500).json({ error: "Failed to fetch research" });
    }
  });

  /**
   * Get active trade orders
   */
  router.get("/trade", async (req, res) => {
    try {
      const { resourceTypeId, orderType, locationId } = req.query;

      let query = `
        SELECT to.*, rt.name as resource_name, p.username as trader_name
        FROM trade_orders to
        JOIN resource_types rt ON to.resource_type_id = rt.id
        JOIN players p ON to.player_id = p.id
        WHERE to.status = 'active'
      `;
      const params = [];

      if (resourceTypeId) {
        query += " AND to.resource_type_id = $" + (params.length + 1);
        params.push(resourceTypeId);
      }

      if (orderType) {
        query += " AND to.order_type = $" + (params.length + 1);
        params.push(orderType);
      }

      if (locationId) {
        query += " AND to.location_id = $" + (params.length + 1);
        params.push(locationId);
      }

      query += " ORDER BY to.created_at DESC LIMIT 100";

      const result = await db.query(query, params);
      res.json({ tradeOrders: result.rows });
    } catch (error) {
      logger.error("Error fetching trade orders:", error);
      res.status(500).json({ error: "Failed to fetch trade orders" });
    }
  });

  /**
   * Get player trade history
   */
  router.get("/trade/history/:playerId", async (req, res) => {
    try {
      const { playerId } = req.params;

      const transactions = await db.query(
        `
        SELECT tt.*, rt.name as resource_name,
               buyer.username as buyer_name,
               seller.username as seller_name
        FROM trade_transactions tt
        JOIN resource_types rt ON tt.resource_type_id = rt.id
        JOIN players buyer ON tt.buyer_id = buyer.id
        JOIN players seller ON tt.seller_id = seller.id
        WHERE tt.buyer_id = $1 OR tt.seller_id = $1
        ORDER BY tt.executed_at DESC
        LIMIT 50
      `,
        [playerId],
      );

      res.json({ transactions: transactions.rows });
    } catch (error) {
      logger.error("Error fetching trade history:", error);
      res.status(500).json({ error: "Failed to fetch trade history" });
    }
  });

  /**
   * Get battles involving a player
   */
  router.get("/battles/:playerId", async (req, res) => {
    try {
      const { playerId } = req.params;

      const battles = await db.query(
        `
        SELECT b.*, 
               bp.side, bp.ships_count, bp.ships_lost,
               winner.username as winner_name
        FROM battles b
        JOIN battle_participants bp ON b.id = bp.battle_id
        LEFT JOIN players winner ON b.winner_player_id = winner.id
        WHERE bp.player_id = $1
        ORDER BY b.started_at DESC
        LIMIT 20
      `,
        [playerId],
      );

      res.json({ battles: battles.rows });
    } catch (error) {
      logger.error("Error fetching battles:", error);
      res.status(500).json({ error: "Failed to fetch battles" });
    }
  });

  /**
   * Get battle details
   */
  router.get("/battles/details/:battleId", async (req, res) => {
    try {
      const { battleId } = req.params;

      const battle = await db.query(
        `
        SELECT * FROM battles WHERE id = $1
      `,
        [battleId],
      );

      if (battle.rows.length === 0) {
        return res.status(404).json({ error: "Battle not found" });
      }

      const participants = await db.query(
        `
        SELECT bp.*, p.username
        FROM battle_participants bp
        JOIN players p ON bp.player_id = p.id
        WHERE bp.battle_id = $1
      `,
        [battleId],
      );

      res.json({
        battle: battle.rows[0],
        participants: participants.rows,
      });
    } catch (error) {
      logger.error("Error fetching battle details:", error);
      res.status(500).json({ error: "Failed to fetch battle details" });
    }
  });

  /**
   * Get diplomacy status for a player
   */
  router.get("/diplomacy/:playerId", async (req, res) => {
    try {
      const { playerId } = req.params;

      const relations = await db.query(
        `
        SELECT dr.*, 
               pf.username as from_player_name,
               pt.username as to_player_name
        FROM diplomatic_relations dr
        JOIN players pf ON dr.player_from_id = pf.id
        JOIN players pt ON dr.player_to_id = pt.id
        WHERE dr.player_from_id = $1 OR dr.player_to_id = $1
        ORDER BY dr.last_updated DESC
      `,
        [playerId],
      );

      res.json({ relations: relations.rows });
    } catch (error) {
      logger.error("Error fetching diplomacy:", error);
      res.status(500).json({ error: "Failed to fetch diplomacy" });
    }
  });

  /**
   * Get game events for a galaxy
   */
  router.get("/events/:galaxyId", async (req, res) => {
    try {
      const { galaxyId } = req.params;
      const { playerId } = req.query;

      let query = `
        SELECT * FROM game_events 
        WHERE galaxy_id = $1 
        AND (expires_at IS NULL OR expires_at > NOW())
      `;
      const params = [galaxyId];

      if (playerId) {
        query += ` AND (affected_players IS NULL OR affected_players::jsonb ? $${params.length + 1})`;
        params.push(String(playerId));
      }

      query += " ORDER BY created_at DESC LIMIT 50";

      const result = await db.query(query, params);
      res.json({ events: result.rows });
    } catch (error) {
      logger.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  /**
   * Get resource types
   */
  router.get("/resources/types", async (req, res) => {
    try {
      const result = await db.query(`
        SELECT * FROM resource_types 
        ORDER BY category, rarity, name
      `);
      res.json({ resourceTypes: result.rows });
    } catch (error) {
      logger.error("Error fetching resource types:", error);
      res.status(500).json({ error: "Failed to fetch resource types" });
    }
  });

  /**
   * Get leaderboards
   */
  router.get("/leaderboards/:galaxyId", async (req, res) => {
    try {
      const { galaxyId } = req.params;

      // Player rankings by various metrics
      const rankings = await Promise.all([
        // Territory control
        db.query(
          `
          SELECT p.username, COUNT(tc.id) as territories_controlled
          FROM players p
          JOIN territory_control tc ON p.id = tc.player_id
          WHERE tc.galaxy_id = $1
          GROUP BY p.id, p.username
          ORDER BY territories_controlled DESC
          LIMIT 10
        `,
          [galaxyId],
        ),

        // Battle victories
        db.query(`
          SELECT p.username, ps.battles_won, ps.battles_total
          FROM players p
          JOIN player_stats ps ON p.id = ps.player_id
          ORDER BY ps.battles_won DESC
          LIMIT 10
        `),

        // Total resources
        db.query(`
          SELECT p.username, SUM(pr.quantity * rt.base_value) as total_wealth
          FROM players p
          JOIN player_resources pr ON p.id = pr.player_id
          JOIN resource_types rt ON pr.resource_type_id = rt.id
          GROUP BY p.id, p.username
          ORDER BY total_wealth DESC
          LIMIT 10
        `),
      ]);

      res.json({
        leaderboards: {
          territory: rankings[0].rows,
          military: rankings[1].rows,
          economic: rankings[2].rows,
        },
      });
    } catch (error) {
      logger.error("Error fetching leaderboards:", error);
      res.status(500).json({ error: "Failed to fetch leaderboards" });
    }
  });

  /**
   * Save game state
   */
  router.post("/save", async (req, res) => {
    try {
      const { playerId, galaxyId, dataType, data } = req.body;

      if (!playerId || !galaxyId || !dataType || !data) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Generate checksum for data integrity
      const checksum = require("crypto")
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex");

      const saveData = {
        playerId,
        galaxyId,
        dataType,
        data,
        version: 1,
        checksum,
      };

      await db.savePlayerData(saveData);

      res.json({
        message: "Game state saved successfully",
        checksum,
      });
    } catch (error) {
      logger.error("Error saving game state:", error);
      res.status(500).json({ error: "Failed to save game state" });
    }
  });

  /**
   * Load game state
   */
  router.get("/save/:playerId/:galaxyId/:dataType", async (req, res) => {
    try {
      const { playerId, galaxyId, dataType } = req.params;

      const saveData = await db.loadPlayerData(playerId, galaxyId, dataType);

      if (!saveData) {
        return res.status(404).json({ error: "Save data not found" });
      }

      res.json(saveData);
    } catch (error) {
      logger.error("Error loading game state:", error);
      res.status(500).json({ error: "Failed to load game state" });
    }
  });

  return router;
}
