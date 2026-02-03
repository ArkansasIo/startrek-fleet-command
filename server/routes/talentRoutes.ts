import express from "express";
import { DatabaseManager } from "../database/DatabaseManager";
import { GameEngine } from "../game/GameEngine";
import { Logger } from "../utils/Logger";
import crypto from "crypto";

const router = express.Router();
const logger = new Logger("TalentRoutes");

/**
 * PROFESSIONS AND TALENT TREES
 */

// Get all available professions
router.get("/professions", async (req, res) => {
  try {
    const db = DatabaseManager.getInstance();
    const result = await db.query(`
      SELECT p.*, 
             COUNT(tt.id) as talent_tree_count
      FROM professions p
      LEFT JOIN talent_trees tt ON p.id = tt.profession_id AND tt.is_active = true
      WHERE p.is_active = true
      GROUP BY p.id
      ORDER BY p.profession_name
    `);

    res.json({
      success: true,
      professions: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching professions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get player's profession progression
router.get("/professions/player/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params;

    const db = DatabaseManager.getInstance();
    const gameEngine = new GameEngine(db);

    const talentTrees = await gameEngine.getPlayerTalentTrees(playerId);

    res.json({
      success: true,
      player_professions: talentTrees,
    });
  } catch (error) {
    logger.error("Error fetching player professions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Assign profession to player
router.post("/professions/assign", async (req, res) => {
  try {
    const { playerId, professionId, isPrimary = false } = req.body;

    const db = DatabaseManager.getInstance();

    // Check if player already has this profession
    const existingProfession = await db.query(
      `
      SELECT id FROM player_professions 
      WHERE player_id = $1 AND profession_id = $2
    `,
      [playerId, professionId],
    );

    if (existingProfession.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Player already has this profession" });
    }

    // If setting as primary, remove primary from other professions
    if (isPrimary) {
      await db.query(
        `
        UPDATE player_professions 
        SET is_primary_profession = false 
        WHERE player_id = $1
      `,
        [playerId],
      );
    }

    // Add profession to player
    await db.query(
      `
      INSERT INTO player_professions (
        player_id, profession_id, profession_level, available_talent_points,
        total_talent_points, is_primary_profession
      ) VALUES ($1, $2, 1, 5, 5, $3)
    `,
      [playerId, professionId, isPrimary],
    );

    res.json({
      success: true,
      message: "Profession assigned successfully",
    });
  } catch (error) {
    logger.error("Error assigning profession:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get talent tree with nodes and player progress
router.get("/talent-trees/:treeId/player/:playerId", async (req, res) => {
  try {
    const { treeId, playerId } = req.params;

    const db = DatabaseManager.getInstance();
    const gameEngine = new GameEngine(db);

    // Get tree information
    const treeResult = await db.query(
      `
      SELECT tt.*, p.profession_name, p.profession_code, p.color_scheme,
             pp.available_talent_points, pp.profession_level
      FROM talent_trees tt
      JOIN professions p ON tt.profession_id = p.id
      LEFT JOIN player_professions pp ON p.id = pp.profession_id AND pp.player_id = $1
      WHERE tt.id = $2
    `,
      [playerId, treeId],
    );

    if (treeResult.rows.length === 0) {
      return res.status(404).json({ error: "Talent tree not found" });
    }

    const tree = treeResult.rows[0];

    // Get nodes with player progress
    const nodes = await gameEngine.getTalentTreeNodes(playerId, treeId);

    res.json({
      success: true,
      talent_tree: tree,
      nodes: nodes,
    });
  } catch (error) {
    logger.error("Error fetching talent tree:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Allocate talent points
router.post("/talent-nodes/:nodeId/allocate", async (req, res) => {
  try {
    const { nodeId } = req.params;
    const { playerId, pointsToAllocate = 1 } = req.body;

    const db = DatabaseManager.getInstance();
    const gameEngine = new GameEngine(db);

    const result = await gameEngine.allocateTalentPoints(
      playerId,
      nodeId,
      pointsToAllocate,
    );

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error("Error allocating talent points:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Reset talent tree (respec)
router.post("/talent-trees/:treeId/reset", async (req, res) => {
  try {
    const { treeId } = req.params;
    const { playerId } = req.body;

    const db = DatabaseManager.getInstance();

    await db.transaction(async (client) => {
      // Get total points invested in this tree
      const pointsResult = await client.query(
        `
        SELECT COALESCE(SUM(pt.points_invested), 0) as total_points
        FROM player_talents pt
        JOIN talent_nodes tn ON pt.talent_node_id = tn.id
        WHERE pt.player_id = $1 AND tn.talent_tree_id = $2
      `,
        [playerId, treeId],
      );

      const totalPoints = pointsResult.rows[0].total_points;

      // Remove all talent allocations for this tree
      await client.query(
        `
        DELETE FROM player_talents pt
        USING talent_nodes tn
        WHERE pt.talent_node_id = tn.id 
        AND pt.player_id = $1 
        AND tn.talent_tree_id = $2
      `,
        [playerId, treeId],
      );

      // Return talent points to player
      await client.query(
        `
        UPDATE player_professions pp
        SET available_talent_points = available_talent_points + $1
        FROM talent_trees tt
        WHERE pp.player_id = $2 
        AND pp.profession_id = tt.profession_id 
        AND tt.id = $3
      `,
        [totalPoints, playerId, treeId],
      );
    });

    res.json({
      success: true,
      message: "Talent tree reset successfully",
    });
  } catch (error) {
    logger.error("Error resetting talent tree:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * RESEARCH AND DEVELOPMENT
 */

// Get research categories
router.get("/research/categories", async (req, res) => {
  try {
    const db = DatabaseManager.getInstance();
    const result = await db.query(`
      SELECT rc.*, p.profession_name,
             COUNT(rp.id) as project_count
      FROM research_categories rc
      LEFT JOIN professions p ON rc.required_profession_id = p.id
      LEFT JOIN research_projects rp ON rc.id = rp.category_id
      WHERE rc.is_active = true
      GROUP BY rc.id, p.profession_name
      ORDER BY rc.sort_order, rc.category_name
    `);

    res.json({
      success: true,
      categories: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching research categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get research projects by category
router.get("/research/projects/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { playerId } = req.query;

    let query = `
      SELECT rp.*,
             CASE WHEN pr.id IS NOT NULL THEN pr.status ELSE 'not_started' END as player_status,
             pr.completed_at
      FROM research_projects rp
      LEFT JOIN player_research pr ON rp.id = pr.project_id AND pr.player_id = $2
      WHERE rp.category_id = $1
      ORDER BY rp.tier_level, rp.project_name
    `;

    const params = [categoryId];
    if (playerId) {
      params.push(playerId as string);
    } else {
      query = query.replace("AND pr.player_id = $2", "");
      params.pop();
    }

    const db = DatabaseManager.getInstance();
    const result = await db.query(query, params);

    res.json({
      success: true,
      projects: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching research projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get player's active research projects
router.get("/research/active/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params;

    const db = DatabaseManager.getInstance();
    const result = await db.query(
      `
      SELECT pr.*, rp.project_name, rp.project_description, rp.project_type,
             rc.category_name, rc.color_scheme,
             EXTRACT(EPOCH FROM (pr.estimated_completion - CURRENT_TIMESTAMP)) / 3600 as hours_remaining
      FROM player_research pr
      JOIN research_projects rp ON pr.project_id = rp.id
      JOIN research_categories rc ON rp.category_id = rc.id
      WHERE pr.player_id = $1 AND pr.status = 'in_progress'
      ORDER BY pr.estimated_completion
    `,
      [playerId],
    );

    res.json({
      success: true,
      active_research: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching active research:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start research project
router.post("/research/start", async (req, res) => {
  try {
    const { playerId, projectId, stationId } = req.body;

    const db = DatabaseManager.getInstance();
    const gameEngine = new GameEngine(db);

    const result = await gameEngine.startResearchProject(
      playerId,
      projectId,
      stationId,
    );

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error("Error starting research project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Cancel research project
router.post("/research/:researchId/cancel", async (req, res) => {
  try {
    const { researchId } = req.params;
    const { playerId } = req.body;

    const db = DatabaseManager.getInstance();

    // Check if research belongs to player and is in progress
    const researchResult = await db.query(
      `
      SELECT pr.*, rp.resource_requirements
      FROM player_research pr
      JOIN research_projects rp ON pr.project_id = rp.id
      WHERE pr.id = $1 AND pr.player_id = $2 AND pr.status = 'in_progress'
    `,
      [researchId, playerId],
    );

    if (researchResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Research project not found or not cancellable" });
    }

    const research = researchResult.rows[0];

    await db.transaction(async (client) => {
      // Cancel research
      await client.query(
        `
        UPDATE player_research 
        SET status = 'cancelled', completed_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `,
        [researchId],
      );

      // Return partial resources (50% refund)
      if (research.resource_requirements) {
        for (const [resourceTypeId, amount] of Object.entries(
          research.resource_requirements,
        )) {
          const refundAmount = Math.floor((amount as number) * 0.5);
          if (refundAmount > 0) {
            await client.query(
              `
              INSERT INTO player_resources (player_id, resource_type_id, quantity)
              VALUES ($1, $2, $3)
              ON CONFLICT (player_id, resource_type_id)
              DO UPDATE SET quantity = player_resources.quantity + $3
            `,
              [playerId, resourceTypeId, refundAmount],
            );
          }
        }
      }

      // Update active projects
      await client.query(
        `
        UPDATE active_projects 
        SET status = 'cancelled', actual_completion = CURRENT_TIMESTAMP
        WHERE player_id = $1 AND project_reference_id = $2 AND project_type = 'research'
      `,
        [playerId, research.project_id],
      );
    });

    res.json({
      success: true,
      message: "Research project cancelled successfully",
    });
  } catch (error) {
    logger.error("Error cancelling research project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * TECHNOLOGY TREES
 */

// Get technology categories
router.get("/technology/categories", async (req, res) => {
  try {
    const { era, faction } = req.query;

    let query = `
      SELECT tc.*,
             COUNT(tt.id) as technology_count
      FROM technology_categories tc
      LEFT JOIN technology_tree tt ON tc.id = tt.category_id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (era) {
      query += ` AND tc.era = $${paramIndex}`;
      params.push(era);
      paramIndex++;
    }

    if (faction) {
      query += ` AND tc.faction = $${paramIndex}`;
      params.push(faction);
      paramIndex++;
    }

    query += ` GROUP BY tc.id ORDER BY tc.sort_order, tc.category_name`;

    const db = DatabaseManager.getInstance();
    const result = await db.query(query, params);

    res.json({
      success: true,
      categories: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching technology categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get technologies by category
router.get("/technology/tree/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { playerId } = req.query;

    let query = `
      SELECT tt.*,
             CASE WHEN pt.id IS NOT NULL THEN true ELSE false END as is_unlocked,
             pt.unlocked_at, pt.mastery_level
      FROM technology_tree tt
      LEFT JOIN player_technologies pt ON tt.id = pt.technology_id AND pt.player_id = $2
      WHERE tt.category_id = $1
      ORDER BY tt.tier_level, tt.tech_name
    `;

    const params = [categoryId];
    if (playerId) {
      params.push(playerId as string);
    } else {
      query = query.replace("AND pt.player_id = $2", "");
      params.pop();
    }

    const db = DatabaseManager.getInstance();
    const result = await db.query(query, params);

    res.json({
      success: true,
      technologies: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching technology tree:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get player's unlocked technologies
router.get("/technology/unlocked/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params;
    const { category } = req.query;

    let query = `
      SELECT pt.*, tt.tech_name, tt.tech_description, tt.tech_type,
             tc.category_name, tc.color_scheme
      FROM player_technologies pt
      JOIN technology_tree tt ON pt.technology_id = tt.id
      JOIN technology_categories tc ON tt.category_id = tc.id
      WHERE pt.player_id = $1
    `;

    const params = [playerId];
    if (category) {
      query += ` AND tc.id = $2`;
      params.push(category as string);
    }

    query += ` ORDER BY pt.unlocked_at DESC`;

    const db = DatabaseManager.getInstance();
    const result = await db.query(query, params);

    res.json({
      success: true,
      unlocked_technologies: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching unlocked technologies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * CRAFTING STATIONS
 */

// Get available crafting stations
router.get("/crafting/stations", async (req, res) => {
  try {
    const { stationType } = req.query;

    let query = `
      SELECT * FROM crafting_stations
      WHERE 1=1
    `;

    const params: any[] = [];
    if (stationType) {
      query += ` AND station_type = $1`;
      params.push(stationType);
    }

    query += ` ORDER BY station_name`;

    const db = DatabaseManager.getInstance();
    const result = await db.query(query, params);

    res.json({
      success: true,
      stations: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching crafting stations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get player's crafting stations
router.get("/crafting/stations/player/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params;

    const db = DatabaseManager.getInstance();
    const result = await db.query(
      `
      SELECT pcs.*, cs.station_name, cs.station_type, cs.description,
             cs.efficiency_modifier, cs.max_concurrent_projects
      FROM player_crafting_stations pcs
      JOIN crafting_stations cs ON pcs.station_id = cs.id
      WHERE pcs.player_id = $1 AND pcs.is_active = true
      ORDER BY cs.station_name
    `,
      [playerId],
    );

    res.json({
      success: true,
      player_stations: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching player crafting stations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
