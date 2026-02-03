import express from "express";
import { DatabaseManager } from "../database/DatabaseManager";
import { GameEngine } from "../game/GameEngine";
import { Logger } from "../utils/Logger";
import crypto from "crypto";

const router = express.Router();
const logger = new Logger("LevelingRoutes");

/**
 * CHARACTER LEVELING SYSTEM
 */

// Get player's current levels and progression
router.get("/player/:playerId/levels", async (req, res) => {
  try {
    const { playerId } = req.params;

    const db = DatabaseManager.getInstance();
    const result = await db.query(
      `
      SELECT pl.*, lp.level_tier, lp.experience_required, lp.skill_points_gained,
             (lp.experience_required - pl.current_experience) as exp_to_next_level
      FROM player_levels pl
      LEFT JOIN level_progression lp ON pl.current_level = lp.level 
        AND lp.level_category = CASE WHEN pl.level_type = 'character' THEN 'character' ELSE 'crafting' END
      WHERE pl.player_id = $1
      ORDER BY pl.level_type
    `,
      [playerId],
    );

    res.json({
      success: true,
      levels: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching player levels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get level progression chart
router.get("/progression/:levelCategory", async (req, res) => {
  try {
    const { levelCategory } = req.params;
    const { startLevel = 1, endLevel = 50 } = req.query;

    const db = DatabaseManager.getInstance();
    const result = await db.query(
      `
      SELECT level, experience_required, experience_total, level_tier,
             skill_points_gained, talent_points_gained
      FROM level_progression
      WHERE level_category = $1 AND level BETWEEN $2 AND $3
      ORDER BY level
    `,
      [
        levelCategory,
        parseInt(startLevel as string),
        parseInt(endLevel as string),
      ],
    );

    res.json({
      success: true,
      progression: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching level progression:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Grant experience to player
router.post("/player/:playerId/experience", async (req, res) => {
  try {
    const { playerId } = req.params;
    const { amount, experienceType = "character", reason } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid experience amount" });
    }

    const db = DatabaseManager.getInstance();
    const gameEngine = new GameEngine(db);

    const result = await gameEngine.grantExperience(
      playerId,
      amount,
      experienceType,
    );

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error("Error granting experience:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * CRAFTING SYSTEM
 */

// Get crafting disciplines
router.get("/crafting/disciplines", async (req, res) => {
  try {
    const db = DatabaseManager.getInstance();
    const result = await db.query(`
      SELECT cd.*, p.profession_name,
             COUNT(cr.id) as recipe_count
      FROM crafting_disciplines cd
      LEFT JOIN professions p ON cd.required_profession_id = p.id
      LEFT JOIN crafting_recipes cr ON cd.id = cr.discipline_id
      WHERE cd.is_active = true
      GROUP BY cd.id, p.profession_name
      ORDER BY cd.sort_order, cd.discipline_name
    `);

    res.json({
      success: true,
      disciplines: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching crafting disciplines:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get player's crafting levels
router.get("/crafting/player/:playerId/levels", async (req, res) => {
  try {
    const { playerId } = req.params;

    const db = DatabaseManager.getInstance();
    const result = await db.query(
      `
      SELECT pcl.*, cd.discipline_name, cd.discipline_code, cd.color_scheme,
             lp.level_tier, lp.experience_required,
             (lp.experience_required - pcl.current_experience) as exp_to_next_level
      FROM player_crafting_levels pcl
      JOIN crafting_disciplines cd ON pcl.discipline_id = cd.id
      LEFT JOIN level_progression lp ON pcl.current_level = lp.level 
        AND lp.level_category = 'crafting'
      WHERE pcl.player_id = $1
      ORDER BY cd.discipline_name
    `,
      [playerId],
    );

    res.json({
      success: true,
      crafting_levels: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching player crafting levels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get crafting recipes by discipline
router.get("/crafting/recipes/:disciplineId", async (req, res) => {
  try {
    const { disciplineId } = req.params;
    const { playerId, category, tier } = req.query;

    let query = `
      SELECT cr.*, cd.discipline_name,
             CASE WHEN $2::uuid IS NOT NULL THEN 
               CASE WHEN cr.id = ANY(
                 SELECT jsonb_array_elements_text(recipes_known)::uuid 
                 FROM player_crafting_levels 
                 WHERE player_id = $2 AND discipline_id = $1
               ) THEN true ELSE false END
             ELSE false END as is_known
      FROM crafting_recipes cr
      JOIN crafting_disciplines cd ON cr.discipline_id = cd.id
      WHERE cr.discipline_id = $1
    `;

    const params = [disciplineId, playerId || null];
    let paramIndex = 3;

    if (category) {
      query += ` AND cr.item_category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (tier) {
      query += ` AND cr.recipe_tier = $${paramIndex}`;
      params.push(String(parseInt(tier as string)));
      paramIndex++;
    }

    query += ` ORDER BY cr.recipe_tier, cr.recipe_name`;

    const db = DatabaseManager.getInstance();
    const result = await db.query(query, params);

    res.json({
      success: true,
      recipes: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching crafting recipes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start crafting
router.post("/crafting/start", async (req, res) => {
  try {
    const { playerId, recipeId, stationId, qualityModifiers } = req.body;

    const db = DatabaseManager.getInstance();
    const gameEngine = new GameEngine(db);

    const result = await gameEngine.startCrafting(
      playerId,
      recipeId,
      stationId,
      qualityModifiers,
    );

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error("Error starting crafting:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get player's crafted items
router.get("/crafting/items/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params;
    const { category, location, quality } = req.query;

    let query = `
      SELECT ci.*, cr.recipe_name, cd.discipline_name,
             pp.display_name as crafter_name
      FROM crafted_items ci
      LEFT JOIN crafting_recipes cr ON ci.recipe_id = cr.id
      LEFT JOIN crafting_disciplines cd ON cr.discipline_id = cd.id
      LEFT JOIN player_profiles pp ON ci.crafter_id = pp.player_id
      WHERE ci.owner_id = $1
    `;

    const params = [playerId];
    let paramIndex = 2;

    if (category) {
      query += ` AND ci.item_category = $${paramIndex}`;
      params.push(String(category));
      paramIndex++;
    }

    if (location) {
      query += ` AND ci.location_type = $${paramIndex}`;
      params.push(String(location));
      paramIndex++;
    }

    if (quality) {
      query += ` AND ci.quality = $${paramIndex}`;
      params.push(String(quality));
      paramIndex++;
    }

    query += ` ORDER BY ci.crafted_at DESC`;

    const db = DatabaseManager.getInstance();
    const result = await db.query(query, params);

    res.json({
      success: true,
      items: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching crafted items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * TEMPERING SYSTEM
 */

// Get tempering levels and requirements
router.get("/tempering/levels", async (req, res) => {
  try {
    const db = DatabaseManager.getInstance();
    const result = await db.query(`
      SELECT * FROM tempering_levels ORDER BY level
    `);

    res.json({
      success: true,
      tempering_levels: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching tempering levels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Temper an item
router.post("/tempering/enhance", async (req, res) => {
  try {
    const { playerId, itemId, targetLevel } = req.body;

    if (!playerId || !itemId || targetLevel === undefined) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const db = DatabaseManager.getInstance();
    const gameEngine = new GameEngine(db);

    const result = await gameEngine.temperItem(playerId, itemId, targetLevel);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error("Error tempering item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * MASTERWORK SYSTEM
 */

// Get masterwork tiers
router.get("/masterwork/tiers", async (req, res) => {
  try {
    const db = DatabaseManager.getInstance();
    const result = await db.query(`
      SELECT * FROM masterwork_tiers ORDER BY tier
    `);

    res.json({
      success: true,
      masterwork_tiers: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching masterwork tiers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * BUILDING SYSTEM
 */

// Get building types
router.get("/buildings/types", async (req, res) => {
  try {
    const { category, size } = req.query;

    let query = `SELECT * FROM building_types WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND building_category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (size) {
      query += ` AND building_size = $${paramIndex}`;
      params.push(size);
      paramIndex++;
    }

    query += ` ORDER BY building_category, building_name`;

    const db = DatabaseManager.getInstance();
    const result = await db.query(query, params);

    res.json({
      success: true,
      building_types: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching building types:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get player's buildings
router.get("/buildings/player/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params;
    const { locationId, status } = req.query;

    let query = `
      SELECT pb.*, bt.building_name as type_name, bt.building_category,
             gc.sector_x, gc.sector_y, gc.sector_z
      FROM player_buildings pb
      JOIN building_types bt ON pb.building_type_id = bt.id
      LEFT JOIN galactic_coordinates gc ON pb.coordinate_id = gc.id
      WHERE pb.owner_id = $1
    `;

    const params = [playerId];
    let paramIndex = 2;

    if (locationId) {
      query += ` AND pb.location_id = $${paramIndex}`;
      params.push(String(locationId));
      paramIndex++;
    }

    if (status) {
      query += ` AND pb.operational_status = $${paramIndex}`;
      params.push(String(status));
      paramIndex++;
    }

    query += ` ORDER BY pb.construction_started DESC`;

    const db = DatabaseManager.getInstance();
    const result = await db.query(query, params);

    res.json({
      success: true,
      buildings: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching player buildings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start building construction
router.post("/buildings/construct", async (req, res) => {
  try {
    const {
      playerId,
      buildingTypeId,
      buildingName,
      locationType,
      locationId,
      coordinateId,
    } = req.body;

    // Check building requirements
    const db = DatabaseManager.getInstance();
    const buildingType = await db.query(
      `
      SELECT * FROM building_types WHERE id = $1
    `,
      [buildingTypeId],
    );

    if (buildingType.rows.length === 0) {
      return res.status(404).json({ error: "Building type not found" });
    }

    const building = buildingType.rows[0];
    const buildingId = crypto.randomUUID();

    // TODO: Add material and requirement checks here

    await db.query(
      `
      INSERT INTO player_buildings (
        id, building_type_id, owner_id, building_name, location_type,
        location_id, coordinate_id, construction_progress, max_health_points
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 0.0, $8)
    `,
      [
        buildingId,
        buildingTypeId,
        playerId,
        buildingName,
        locationType,
        locationId,
        coordinateId,
        building.max_health_points || 1000,
      ],
    );

    res.status(201).json({
      success: true,
      building_id: buildingId,
      message: "Building construction started",
    });
  } catch (error) {
    logger.error("Error starting building construction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
