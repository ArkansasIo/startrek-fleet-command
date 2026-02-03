import { Router } from "express";
import { DatabaseManager } from "../database/DatabaseManager";
import { GameEngine } from "../game/GameEngine";
import { Logger } from "../utils/Logger";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export function createPlayerRoutes(
  db: DatabaseManager,
  gameEngine: GameEngine,
): Router {
  const router = Router();
  const logger = new Logger("PlayerRoutes");

  /**
   * Register new player
   */
  router.post("/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Validate input
      if (username.length < 3 || username.length > 50) {
        return res
          .status(400)
          .json({ error: "Username must be 3-50 characters" });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters" });
      }

      // Check if username or email already exists
      const existing = await db.query(
        `
        SELECT id FROM players 
        WHERE username = $1 OR email = $2
      `,
        [username, email],
      );

      if (existing.rows.length > 0) {
        return res
          .status(409)
          .json({ error: "Username or email already exists" });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create player
      const playerId = await db.createPlayer(username, email, passwordHash);

      // Generate JWT token
      const token = jwt.sign(
        { playerId, username },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "7d" },
      );

      res.status(201).json({
        message: "Player registered successfully",
        playerId,
        token,
      });
    } catch (error) {
      logger.error("Error registering player:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  /**
   * Player login
   */
  router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password required" });
      }

      // Get player by username
      const player = await db.getPlayerByUsername(username);

      if (!player) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(
        password,
        player.password_hash,
      );

      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Update last login
      await db.updatePlayerLogin(player.id);

      // Generate JWT token
      const token = jwt.sign(
        { playerId: player.id, username: player.username },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "7d" },
      );

      res.json({
        message: "Login successful",
        player: {
          id: player.id,
          username: player.username,
          displayName: player.display_name,
          rank: player.rank,
          division: player.division,
          level: player.level,
          experiencePoints: player.experience_points,
          credits: player.credits,
        },
        token,
      });
    } catch (error) {
      logger.error("Error during login:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  /**
   * Get player profile
   */
  router.get("/profile/:playerId", async (req, res) => {
    try {
      const { playerId } = req.params;

      const player = await db.getPlayer(playerId);

      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }

      // Remove sensitive information
      delete player.password_hash;
      delete player.email;

      res.json({ player });
    } catch (error) {
      logger.error("Error fetching player profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  /**
   * Update player profile
   */
  router.put("/profile/:playerId", async (req, res) => {
    try {
      const { playerId } = req.params;
      const { displayName, bio, avatarUrl } = req.body;

      await db.query(
        `
        UPDATE player_profiles 
        SET display_name = COALESCE($1, display_name),
            bio = COALESCE($2, bio),
            avatar_url = COALESCE($3, avatar_url),
            updated_at = CURRENT_TIMESTAMP
        WHERE player_id = $4
      `,
        [displayName, bio, avatarUrl, playerId],
      );

      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      logger.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  /**
   * Get player ships
   */
  router.get("/:playerId/ships", async (req, res) => {
    try {
      const { playerId } = req.params;
      const { galaxyId } = req.query;

      const ships = await db.getPlayerShips(playerId, galaxyId as string);
      res.json({ ships });
    } catch (error) {
      logger.error("Error fetching ships:", error);
      res.status(500).json({ error: "Failed to fetch ships" });
    }
  });

  /**
   * Get player resources
   */
  router.get("/:playerId/resources", async (req, res) => {
    try {
      const { playerId } = req.params;

      const resources = await db.getPlayerResources(playerId);
      res.json({ resources });
    } catch (error) {
      logger.error("Error fetching resources:", error);
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  /**
   * Get player statistics
   */
  router.get("/:playerId/stats", async (req, res) => {
    try {
      const { playerId } = req.params;

      const stats = await db.query(
        `
        SELECT * FROM player_stats WHERE player_id = $1
      `,
        [playerId],
      );

      if (stats.rows.length === 0) {
        return res.status(404).json({ error: "Stats not found" });
      }

      res.json({ stats: stats.rows[0] });
    } catch (error) {
      logger.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  /**
   * Get player messages
   */
  router.get("/:playerId/messages", async (req, res) => {
    try {
      const { playerId } = req.params;
      const { limit = 50, offset = 0, type } = req.query;

      let query = `
        SELECT pm.*, p.username as sender_username
        FROM player_messages pm
        LEFT JOIN players p ON pm.from_player_id = p.id
        WHERE pm.to_player_id = $1
      `;
      const params = [playerId];

      if (type) {
        query += ` AND pm.message_type = $${params.length + 1}`;
        params.push(String(type));
      }

      query += ` ORDER BY pm.sent_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(String(limit), String(offset));

      const result = await db.query(query, params);
      res.json({ messages: result.rows });
    } catch (error) {
      logger.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  /**
   * Send message to another player
   */
  router.post("/:playerId/messages", async (req, res) => {
    try {
      const { playerId } = req.params;
      const {
        toPlayerId,
        subject,
        content,
        messageType = "personal",
      } = req.body;

      if (!toPlayerId || !subject || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await db.query(
        `
        INSERT INTO player_messages (from_player_id, to_player_id, message_type, subject, content)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `,
        [playerId, toPlayerId, messageType, subject, content],
      );

      res.json({
        messageId: result.rows[0].id,
        message: "Message sent successfully",
      });
    } catch (error) {
      logger.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  /**
   * Mark message as read
   */
  router.put("/:playerId/messages/:messageId/read", async (req, res) => {
    try {
      const { playerId, messageId } = req.params;

      await db.query(
        `
        UPDATE player_messages 
        SET is_read = true, read_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND to_player_id = $2
      `,
        [messageId, playerId],
      );

      res.json({ message: "Message marked as read" });
    } catch (error) {
      logger.error("Error marking message as read:", error);
      res.status(500).json({ error: "Failed to mark message as read" });
    }
  });

  /**
   * Get player territories
   */
  router.get("/:playerId/territories", async (req, res) => {
    try {
      const { playerId } = req.params;
      const { galaxyId } = req.query;

      let query = `
        SELECT tc.*, 
               CASE tc.controlled_type
                 WHEN 'planet' THEN cb.name
                 WHEN 'system' THEN ss.name
                 WHEN 'sector' THEN s.name
               END as territory_name
        FROM territory_control tc
        LEFT JOIN celestial_bodies cb ON tc.controlled_type = 'planet' AND tc.controlled_id = cb.id
        LEFT JOIN star_systems ss ON tc.controlled_type = 'system' AND tc.controlled_id = ss.id
        LEFT JOIN sectors s ON tc.controlled_type = 'sector' AND tc.controlled_id = s.id
        WHERE tc.player_id = $1
      `;
      const params = [playerId];

      if (galaxyId) {
        query += ` AND tc.galaxy_id = $${params.length + 1}`;
        params.push(String(galaxyId));
      }

      query += " ORDER BY tc.established_at DESC";

      const result = await db.query(query, params);
      res.json({ territories: result.rows });
    } catch (error) {
      logger.error("Error fetching territories:", error);
      res.status(500).json({ error: "Failed to fetch territories" });
    }
  });

  /**
   * Get player achievements
   */
  router.get("/:playerId/achievements", async (req, res) => {
    try {
      const { playerId } = req.params;

      // This would be more complex in a real implementation
      // For now, calculate basic achievements based on stats
      const stats = await db.query(
        `
        SELECT * FROM player_stats WHERE player_id = $1
      `,
        [playerId],
      );

      if (stats.rows.length === 0) {
        return res.json({ achievements: [] });
      }

      const playerStats = stats.rows[0];
      const achievements = [];

      // Battle achievements
      if (playerStats.battles_won >= 1)
        achievements.push({
          name: "First Victory",
          description: "Won your first battle",
        });
      if (playerStats.battles_won >= 10)
        achievements.push({
          name: "Veteran Commander",
          description: "Won 10 battles",
        });
      if (playerStats.battles_won >= 50)
        achievements.push({ name: "War Hero", description: "Won 50 battles" });

      // Exploration achievements
      if (playerStats.missions_completed >= 1)
        achievements.push({
          name: "Explorer",
          description: "Completed your first mission",
        });
      if (playerStats.missions_completed >= 25)
        achievements.push({
          name: "Seasoned Explorer",
          description: "Completed 25 missions",
        });

      // Territory achievements
      if (playerStats.territories_controlled >= 1)
        achievements.push({
          name: "Colony Founder",
          description: "Established your first territory",
        });
      if (playerStats.territories_controlled >= 5)
        achievements.push({
          name: "Empire Builder",
          description: "Control 5 territories",
        });

      res.json({ achievements });
    } catch (error) {
      logger.error("Error fetching achievements:", error);
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  });

  /**
   * Delete player account
   */
  router.delete("/:playerId", async (req, res) => {
    try {
      const { playerId } = req.params;
      const { confirmPassword } = req.body;

      if (!confirmPassword) {
        return res
          .status(400)
          .json({ error: "Password confirmation required" });
      }

      // Get player for password verification
      const player = await db.query(
        `
        SELECT password_hash FROM players WHERE id = $1
      `,
        [playerId],
      );

      if (player.rows.length === 0) {
        return res.status(404).json({ error: "Player not found" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(
        confirmPassword,
        player.rows[0].password_hash,
      );

      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // Soft delete (mark as inactive)
      await db.query(
        `
        UPDATE players 
        SET is_active = false, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `,
        [playerId],
      );

      res.json({ message: "Account deactivated successfully" });
    } catch (error) {
      logger.error("Error deleting account:", error);
      res.status(500).json({ error: "Failed to delete account" });
    }
  });

  return router;
}
