import express from "express";
import { DatabaseManager } from "../database/DatabaseManager";
import { GameEngine } from "../game/GameEngine";
import { Logger } from "../utils/Logger";
import crypto from "crypto";

const router = express.Router();
const logger = new Logger("SpaceInfrastructureRoutes");

/**
 * GALACTIC COORDINATES MANAGEMENT
 */

// Get galactic coordinates in a region
router.get("/coordinates/:galaxyId", async (req, res) => {
  try {
    const { galaxyId } = req.params;
    const { minX, maxX, minY, maxY, minZ, maxZ } = req.query;

    let query = `
      SELECT gc.*, 
             COUNT(ss.id) as station_count,
             COUNT(jg.id) as jump_gate_count
      FROM galactic_coordinates gc
      LEFT JOIN space_stations ss ON gc.id = ss.coordinate_id AND ss.status = 'operational'
      LEFT JOIN jump_gates jg ON gc.id = jg.coordinate_id AND jg.status = 'operational'
      WHERE gc.galaxy_id = $1
    `;

    const params = [galaxyId];
    let paramIndex = 2;

    if (minX !== undefined && maxX !== undefined) {
      query += ` AND gc.sector_x BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(String(parseInt(minX as string)), String(parseInt(maxX as string)));
      paramIndex += 2;
    }

    if (minY !== undefined && maxY !== undefined) {
      query += ` AND gc.sector_y BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(String(parseInt(minY as string)), String(parseInt(maxY as string)));
      paramIndex += 2;
    }

    if (minZ !== undefined && maxZ !== undefined) {
      query += ` AND gc.sector_z BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(String(parseInt(minZ as string)), String(parseInt(maxZ as string)));
      paramIndex += 2;
    }

    query += ` GROUP BY gc.id ORDER BY gc.sector_x, gc.sector_y, gc.sector_z`;

    const db = DatabaseManager.getInstance();
    const result = await db.query(query, params);

    res.json({
      success: true,
      coordinates: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching galactic coordinates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Explore/scan coordinate
router.post("/coordinates/:coordinateId/explore", async (req, res) => {
  try {
    const { coordinateId } = req.params;
    const { playerId, shipId } = req.body;

    const db = DatabaseManager.getInstance();

    // Check if ship belongs to player and is at the coordinate
    const ship = await db.query(
      `
      SELECT s.*, sc.name as current_location_name
      FROM ships s
      JOIN galactic_coordinates gc ON s.current_location_id = gc.id
      LEFT JOIN space_stations sc ON s.current_location_id = sc.id
      WHERE s.id = $1 AND s.player_id = $2 AND s.current_location_id = $3
    `,
      [shipId, playerId, coordinateId],
    );

    if (ship.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "Ship not found or not at specified coordinate" });
    }

    // Mark coordinate as explored
    await db.query(
      `
      UPDATE galactic_coordinates 
      SET is_explored = true
      WHERE id = $1
    `,
      [coordinateId],
    );

    // Chance to discover something
    const discoveryRoll = Math.random();
    let discovery = null;

    if (discoveryRoll < 0.1) {
      // 10% chance for significant discovery
      discovery = {
        type: "anomaly",
        name: "Subspace Anomaly",
        description: "An unusual subspace distortion has been detected.",
        bonus: "sensor_data",
      };
    } else if (discoveryRoll < 0.2) {
      // 10% chance for resources
      discovery = {
        type: "resource_deposit",
        name: "Asteroid Field",
        description: "Rich mineral deposits detected in nearby asteroids.",
        bonus: "mining_opportunity",
      };
    }

    res.json({
      success: true,
      coordinate_explored: true,
      discovery,
    });
  } catch (error) {
    logger.error("Error exploring coordinate:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * SPACE STATIONS MANAGEMENT
 */

// Get space stations
router.get("/stations/:galaxyId", async (req, res) => {
  try {
    const { galaxyId } = req.params;
    const { ownerId, stationType } = req.query;

    let query = `
      SELECT ss.*, gc.sector_x, gc.sector_y, gc.sector_z,
             pp.display_name as owner_name
      FROM space_stations ss
      JOIN galactic_coordinates gc ON ss.coordinate_id = gc.id
      LEFT JOIN player_profiles pp ON ss.owner_id = pp.player_id
      WHERE ss.galaxy_id = $1
    `;

    const params = [galaxyId];
    let paramIndex = 2;

    if (ownerId) {
      query += ` AND ss.owner_id = $${paramIndex}`;
      params.push(String(ownerId));
      paramIndex++;
    }

    if (stationType) {
      query += ` AND ss.station_type = $${paramIndex}`;
      params.push(String(stationType));
      paramIndex++;
    }

    query += ` ORDER BY ss.name`;

    const db = DatabaseManager.getInstance();
    const result = await db.query(query, params);

    res.json({
      success: true,
      stations: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching space stations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create space station
router.post("/stations", async (req, res) => {
  try {
    const { galaxyId, coordinateId, ownerId, name, stationType, stationClass } =
      req.body;

    const db = DatabaseManager.getInstance();

    // Check if coordinate is available
    const coordinate = await db.query(
      `
      SELECT * FROM galactic_coordinates 
      WHERE id = $1 AND galaxy_id = $2 AND is_navigable = true
    `,
      [coordinateId, galaxyId],
    );

    if (coordinate.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid or non-navigable coordinate" });
    }

    // Check for existing stations at coordinate
    const existingStation = await db.query(
      `
      SELECT id FROM space_stations 
      WHERE coordinate_id = $1 AND status IN ('operational', 'under_construction')
    `,
      [coordinateId],
    );

    if (existingStation.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Coordinate already occupied by another station" });
    }

    const stationId = crypto.randomUUID();

    // Define station stats based on class
    let hullPoints = 5000;
    let shieldPoints = 2500;
    let crewCapacity = 500;
    let dockingBays = 10;
    let cargoCapacity = 10000;

    switch (stationClass) {
      case "small":
        hullPoints = 2500;
        shieldPoints = 1250;
        crewCapacity = 200;
        dockingBays = 5;
        cargoCapacity = 5000;
        break;
      case "large":
        hullPoints = 10000;
        shieldPoints = 5000;
        crewCapacity = 1000;
        dockingBays = 20;
        cargoCapacity = 20000;
        break;
      case "massive":
        hullPoints = 20000;
        shieldPoints = 10000;
        crewCapacity = 2000;
        dockingBays = 50;
        cargoCapacity = 50000;
        break;
    }

    await db.query(
      `
      INSERT INTO space_stations (
        id, galaxy_id, coordinate_id, owner_id, name, station_type, station_class,
        hull_points, max_hull_points, shield_points, max_shield_points,
        crew_capacity, docking_bays, cargo_capacity, status, commissioned_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, CURRENT_TIMESTAMP)
    `,
      [
        stationId,
        galaxyId,
        coordinateId,
        ownerId,
        name,
        stationType,
        stationClass,
        hullPoints,
        hullPoints,
        shieldPoints,
        shieldPoints,
        crewCapacity,
        dockingBays,
        cargoCapacity,
        "operational",
      ],
    );

    res.json({
      success: true,
      station_id: stationId,
      message: "Space station created successfully",
    });
  } catch (error) {
    logger.error("Error creating space station:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * JUMP GATES MANAGEMENT
 */

// Get jump gates
router.get("/jump-gates/:galaxyId", async (req, res) => {
  try {
    const { galaxyId } = req.params;

    const db = DatabaseManager.getInstance();
    const result = await db.query(
      `
      SELECT jg.*, 
             gc.sector_x, gc.sector_y, gc.sector_z,
             target_gc.sector_x as target_x, target_gc.sector_y as target_y, target_gc.sector_z as target_z,
             target_jg.name as target_gate_name,
             pp.display_name as owner_name
      FROM jump_gates jg
      JOIN galactic_coordinates gc ON jg.coordinate_id = gc.id
      LEFT JOIN jump_gates target_jg ON jg.connected_gate_id = target_jg.id
      LEFT JOIN galactic_coordinates target_gc ON target_jg.coordinate_id = target_gc.id
      LEFT JOIN player_profiles pp ON jg.owner_id = pp.player_id
      WHERE jg.galaxy_id = $1
      ORDER BY jg.name
    `,
      [galaxyId],
    );

    res.json({
      success: true,
      jump_gates: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching jump gates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create jump gate
router.post("/jump-gates", async (req, res) => {
  try {
    const { galaxyId, coordinateId, ownerId, name, gateType, connectedGateId } =
      req.body;

    const db = DatabaseManager.getInstance();
    const gameEngine = new GameEngine(db);

    // Check coordinate availability
    const coordinate = await db.query(
      `
      SELECT * FROM galactic_coordinates 
      WHERE id = $1 AND galaxy_id = $2 AND is_navigable = true
    `,
      [coordinateId, galaxyId],
    );

    if (coordinate.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid or non-navigable coordinate" });
    }

    const gateId = crypto.randomUUID();

    await db.query(
      `
      INSERT INTO jump_gates (
        id, galaxy_id, coordinate_id, owner_id, name, gate_type,
        connected_gate_id, status, activated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
    `,
      [
        gateId,
        galaxyId,
        coordinateId,
        ownerId,
        name,
        gateType,
        connectedGateId,
        "operational",
      ],
    );

    res.json({
      success: true,
      gate_id: gateId,
      message: "Jump gate created successfully",
    });
  } catch (error) {
    logger.error("Error creating jump gate:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Use jump gate
router.post("/jump-gates/:gateId/travel", async (req, res) => {
  try {
    const { gateId } = req.params;
    const { shipId, playerId } = req.body;

    const db = DatabaseManager.getInstance();
    const gameEngine = new GameEngine(db);

    // Verify ship ownership and location
    const ship = await db.query(
      `
      SELECT s.*, jg.coordinate_id as gate_coordinate_id
      FROM ships s
      JOIN jump_gates jg ON jg.id = $1
      WHERE s.id = $2 AND s.player_id = $3 AND s.current_location_id = jg.coordinate_id
    `,
      [gateId, shipId, playerId],
    );

    if (ship.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "Ship not found or not at jump gate location" });
    }

    const result = await gameEngine.processJumpGateTravel(shipId, gateId);

    res.json(result);
  } catch (error) {
    logger.error("Error processing jump gate travel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * ORBITAL DEFENSE PLATFORMS
 */

// Get orbital defense platforms for a planet
router.get("/orbital-defense/:planetId", async (req, res) => {
  try {
    const { planetId } = req.params;

    const db = DatabaseManager.getInstance();
    const result = await db.query(
      `
      SELECT odp.*, pp.display_name as owner_name,
             cb.name as planet_name
      FROM orbital_defense_platforms odp
      LEFT JOIN player_profiles pp ON odp.owner_id = pp.player_id
      JOIN celestial_bodies cb ON odp.planet_id = cb.id
      WHERE odp.planet_id = $1
      ORDER BY odp.orbital_position, odp.platform_name
    `,
      [planetId],
    );

    res.json({
      success: true,
      platforms: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching orbital defense platforms:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Deploy orbital defense platform
router.post("/orbital-defense", async (req, res) => {
  try {
    const { planetId, ownerId, platformType, orbitalPosition } = req.body;

    const db = DatabaseManager.getInstance();
    const gameEngine = new GameEngine(db);

    const result = await gameEngine.deployOrbitalDefensePlatform(
      planetId,
      ownerId,
      platformType,
      orbitalPosition,
    );

    res.json(result);
  } catch (error) {
    logger.error("Error deploying orbital defense platform:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * TRAVEL AND NAVIGATION
 */

// Calculate travel route
router.post("/travel/calculate-route", async (req, res) => {
  try {
    const {
      startCoordinateId,
      endCoordinateId,
      shipId,
      travelType, // 'ftl', 'sublight', 'jump_gate'
    } = req.body;

    const db = DatabaseManager.getInstance();
    const gameEngine = new GameEngine(db);

    // Get coordinates
    const startCoord = await db.query(
      `
      SELECT sector_x as x, sector_y as y, sector_z as z FROM galactic_coordinates WHERE id = $1
    `,
      [startCoordinateId],
    );

    const endCoord = await db.query(
      `
      SELECT sector_x as x, sector_y as y, sector_z as z FROM galactic_coordinates WHERE id = $1
    `,
      [endCoordinateId],
    );

    if (startCoord.rows.length === 0 || endCoord.rows.length === 0) {
      return res.status(400).json({ error: "Invalid coordinates" });
    }

    // Get ship capabilities
    const ship = await db.query(
      `
      SELECT s.*, sc.speed, sc.maneuverability
      FROM ships s
      JOIN ship_classes sc ON s.ship_class_id = sc.id
      WHERE s.id = $1
    `,
      [shipId],
    );

    if (ship.rows.length === 0) {
      return res.status(400).json({ error: "Ship not found" });
    }

    let travelTime;
    let fuelCost = 0;
    let energyCost = 0;

    if (travelType === "ftl") {
      travelTime = gameEngine.calculateFTLTravelTime(
        startCoord.rows[0],
        endCoord.rows[0],
        ship.rows[0].speed,
      );
      fuelCost = Math.ceil(travelTime / 10); // 1 fuel per 10 minutes
      energyCost = Math.ceil(travelTime / 5); // 1 energy per 5 minutes
    } else if (travelType === "sublight") {
      travelTime = gameEngine.calculateSublightTravelTime(
        startCoord.rows[0],
        endCoord.rows[0],
        ship.rows[0].maneuverability,
      );
      fuelCost = Math.ceil(travelTime / 60); // 1 fuel per hour
      energyCost = 0; // Sublight uses minimal energy
    }

    res.json({
      success: true,
      travel_time_minutes: travelTime,
      fuel_cost: fuelCost,
      energy_cost: energyCost,
      travel_type: travelType,
    });
  } catch (error) {
    logger.error("Error calculating travel route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Initiate ship travel
router.post("/travel/initiate", async (req, res) => {
  try {
    const { shipId, playerId, destinationCoordinateId, travelType } = req.body;

    const db = DatabaseManager.getInstance();

    // Verify ship ownership
    const ship = await db.query(
      `
      SELECT * FROM ships WHERE id = $1 AND player_id = $2 AND status != 'traveling'
    `,
      [shipId, playerId],
    );

    if (ship.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "Ship not found or already traveling" });
    }

    // Calculate travel time (simplified for this example)
    const travelTime = 30; // 30 minutes default
    const arrivalTime = new Date(Date.now() + travelTime * 60000);

    await db.transaction(async (client) => {
      // Update ship status
      await client.query(
        `
        UPDATE ships 
        SET destination_id = $1,
            destination_type = 'coordinate',
            travel_eta = $2,
            status = 'traveling'
        WHERE id = $3
      `,
        [destinationCoordinateId, arrivalTime, shipId],
      );

      // Create travel log
      await client.query(
        `
        INSERT INTO ship_travel_logs (
          ship_id, departure_coordinate_id, destination_coordinate_id,
          travel_type, departure_time, estimated_arrival, status
        ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5, 'in_transit')
      `,
        [
          shipId,
          ship.rows[0].current_location_id,
          destinationCoordinateId,
          travelType,
          arrivalTime,
        ],
      );
    });

    res.json({
      success: true,
      estimated_arrival: arrivalTime,
      message: "Travel initiated successfully",
    });
  } catch (error) {
    logger.error("Error initiating ship travel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
