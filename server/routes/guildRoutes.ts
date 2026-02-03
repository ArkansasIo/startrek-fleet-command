import express from "express";
import { DatabaseManager } from "../database/DatabaseManager";
import { GameEngine } from "../game/GameEngine";
import { Logger } from "../utils/Logger";
import crypto from "crypto";

const router = express.Router();
const logger = new Logger("GuildRoutes");

/**
 * GUILD MANAGEMENT
 */

// Get all guilds with filtering options
router.get("/guilds", async (req, res) => {
  try {
    const {
      guildType,
      isNpcGuild,
      isOpenRecruitment,
      minMembers,
      maxMembers,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    let query = `
      SELECT g.*, 
             pp.display_name as leader_name,
             COUNT(gm.id) as actual_member_count
      FROM guilds g
      LEFT JOIN player_profiles pp ON g.leader_id = pp.player_id
      LEFT JOIN guild_members gm ON g.id = gm.guild_id AND gm.member_status = 'active'
      WHERE g.is_disbanded = false
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (guildType) {
      query += ` AND g.guild_type = $${paramIndex}`;
      params.push(guildType);
      paramIndex++;
    }

    if (isNpcGuild !== undefined) {
      query += ` AND g.is_npc_guild = $${paramIndex}`;
      params.push(isNpcGuild === "true");
      paramIndex++;
    }

    if (isOpenRecruitment !== undefined) {
      query += ` AND g.is_open_recruitment = $${paramIndex}`;
      params.push(isOpenRecruitment === "true");
      paramIndex++;
    }

    if (search) {
      query += ` AND (g.name ILIKE $${paramIndex} OR g.tag ILIKE $${paramIndex + 1} OR g.description ILIKE $${paramIndex + 2})`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      paramIndex += 3;
    }

    query += ` GROUP BY g.id, pp.display_name`;

    if (minMembers) {
      query += ` HAVING COUNT(gm.id) >= $${paramIndex}`;
      params.push(parseInt(minMembers as string));
      paramIndex++;
    }

    if (maxMembers) {
      query += ` HAVING COUNT(gm.id) <= $${paramIndex}`;
      params.push(parseInt(maxMembers as string));
      paramIndex++;
    }

    query += ` ORDER BY g.guild_influence DESC, g.member_count DESC`;

    // Add pagination
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit as string), offset);

    const db = DatabaseManager.getInstance();
    const result = await db.query(query, params);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(DISTINCT g.id) as total
      FROM guilds g
      LEFT JOIN guild_members gm ON g.id = gm.guild_id AND gm.member_status = 'active'
      WHERE g.is_disbanded = false
      ${guildType ? `AND g.guild_type = '${guildType}'` : ""}
      ${isNpcGuild !== undefined ? `AND g.is_npc_guild = ${isNpcGuild === "true"}` : ""}
      ${isOpenRecruitment !== undefined ? `AND g.is_open_recruitment = ${isOpenRecruitment === "true"}` : ""}
      ${search ? `AND (g.name ILIKE '%${search}%' OR g.tag ILIKE '%${search}%' OR g.description ILIKE '%${search}%')` : ""}
    `;

    const countResult = await db.query(countQuery);
    const totalGuilds = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      guilds: result.rows,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: totalGuilds,
        totalPages: Math.ceil(totalGuilds / parseInt(limit as string)),
      },
    });
  } catch (error) {
    logger.error("Error fetching guilds:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get specific guild details
router.get("/guilds/:guildId", async (req, res) => {
  try {
    const { guildId } = req.params;

    const db = DatabaseManager.getInstance();

    // Get guild info
    const guildResult = await db.query(
      `
      SELECT g.*, 
             leader_pp.display_name as leader_name,
             founder_pp.display_name as founder_name,
             ss.name as headquarters_name
      FROM guilds g
      LEFT JOIN player_profiles leader_pp ON g.leader_id = leader_pp.player_id
      LEFT JOIN player_profiles founder_pp ON g.founder_id = founder_pp.player_id
      LEFT JOIN space_stations ss ON g.headquarters_station_id = ss.id
      WHERE g.id = $1
    `,
      [guildId],
    );

    if (guildResult.rows.length === 0) {
      return res.status(404).json({ error: "Guild not found" });
    }

    const guild = guildResult.rows[0];

    // Get guild members with ranks
    const membersResult = await db.query(
      `
      SELECT gm.*, 
             pp.display_name,
             pp.rank as player_rank,
             gr.rank_name,
             gr.rank_level,
             gr.rank_color,
             gr.is_officer_rank,
             gr.is_leader_rank
      FROM guild_members gm
      JOIN player_profiles pp ON gm.player_id = pp.player_id
      JOIN guild_ranks gr ON gm.rank_id = gr.id
      WHERE gm.guild_id = $1
      ORDER BY gr.rank_level DESC, gm.joined_at ASC
    `,
      [guildId],
    );

    // Get guild ranks
    const ranksResult = await db.query(
      `
      SELECT * FROM guild_ranks 
      WHERE guild_id = $1 
      ORDER BY rank_level DESC
    `,
      [guildId],
    );

    // Get recent guild events
    const eventsResult = await db.query(
      `
      SELECT ge.*, 
             pp.display_name as organizer_name,
             COUNT(gep.id) as participant_count
      FROM guild_events ge
      LEFT JOIN player_profiles pp ON ge.organizer_id = pp.player_id
      LEFT JOIN guild_event_participants gep ON ge.id = gep.event_id
      WHERE ge.guild_id = $1 AND ge.scheduled_at > CURRENT_TIMESTAMP - INTERVAL '30 days'
      GROUP BY ge.id, pp.display_name
      ORDER BY ge.scheduled_at DESC
      LIMIT 10
    `,
      [guildId],
    );

    res.json({
      success: true,
      guild,
      members: membersResult.rows,
      ranks: ranksResult.rows,
      recent_events: eventsResult.rows,
    });
  } catch (error) {
    logger.error("Error fetching guild details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new guild
router.post("/guilds", async (req, res) => {
  try {
    const {
      founderId,
      guildName,
      guildTag,
      description,
      guildType = "general",
    } = req.body;

    const db = DatabaseManager.getInstance();
    const gameEngine = new GameEngine(db);

    const result = await gameEngine.createGuild(
      founderId,
      guildName,
      guildTag,
      description,
      guildType,
    );

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error("Error creating guild:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Apply to join guild
router.post("/guilds/:guildId/apply", async (req, res) => {
  try {
    const { guildId } = req.params;
    const { playerId, applicationMessage } = req.body;

    const db = DatabaseManager.getInstance();
    const gameEngine = new GameEngine(db);

    const result = await gameEngine.applyToGuild(
      playerId,
      guildId,
      applicationMessage,
    );

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error("Error applying to guild:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get guild applications (for officers)
router.get("/guilds/:guildId/applications", async (req, res) => {
  try {
    const { guildId } = req.params;
    const { status = "pending" } = req.query;

    const db = DatabaseManager.getInstance();
    const result = await db.query(
      `
      SELECT ga.*, 
             pp.display_name,
             pp.level,
             pp.reputation,
             pp.experience_points
      FROM guild_applications ga
      JOIN player_profiles pp ON ga.player_id = pp.player_id
      WHERE ga.guild_id = $1 AND ga.status = $2
      ORDER BY ga.applied_at DESC
    `,
      [guildId, status],
    );

    res.json({
      success: true,
      applications: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching guild applications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Approve/reject guild application
router.post(
  "/guilds/:guildId/applications/:playerId/:action",
  async (req, res) => {
    try {
      const { guildId, playerId, action } = req.params;
      const { reviewerId, reviewNotes } = req.body;

      if (!["approve", "reject"].includes(action)) {
        return res
          .status(400)
          .json({ error: "Invalid action. Use 'approve' or 'reject'" });
      }

      const db = DatabaseManager.getInstance();

      if (action === "approve") {
        const gameEngine = new GameEngine(db);
        const result = await gameEngine.approveGuildApplication(
          guildId,
          playerId,
          reviewerId,
        );

        if (result.success) {
          res.json(result);
        } else {
          res.status(400).json(result);
        }
      } else {
        // Reject application
        await db.query(
          `
        UPDATE guild_applications 
        SET status = 'rejected', reviewed_by = $1, reviewed_at = CURRENT_TIMESTAMP, review_notes = $2
        WHERE guild_id = $3 AND player_id = $4 AND status = 'pending'
      `,
          [reviewerId, reviewNotes, guildId, playerId],
        );

        res.json({
          success: true,
          message: "Application rejected",
        });
      }
    } catch (error) {
      logger.error("Error processing guild application:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Leave guild
router.post("/guilds/:guildId/leave", async (req, res) => {
  try {
    const { guildId } = req.params;
    const { playerId } = req.body;

    const db = DatabaseManager.getInstance();
    const gameEngine = new GameEngine(db);

    const result = await gameEngine.removePlayerFromGuild(
      guildId,
      playerId,
      playerId,
    );

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error("Error leaving guild:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Kick member from guild
router.post("/guilds/:guildId/kick/:playerId", async (req, res) => {
  try {
    const { guildId, playerId } = req.params;
    const { kickedBy, reason } = req.body;

    const db = DatabaseManager.getInstance();
    const gameEngine = new GameEngine(db);

    const result = await gameEngine.removePlayerFromGuild(
      guildId,
      playerId,
      kickedBy,
    );

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error("Error kicking guild member:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GUILD RANK MANAGEMENT
 */

// Get guild ranks
router.get("/guilds/:guildId/ranks", async (req, res) => {
  try {
    const { guildId } = req.params;

    const db = DatabaseManager.getInstance();
    const result = await db.query(
      `
      SELECT * FROM guild_ranks 
      WHERE guild_id = $1 
      ORDER BY rank_level DESC
    `,
      [guildId],
    );

    res.json({
      success: true,
      ranks: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching guild ranks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new guild rank
router.post("/guilds/:guildId/ranks", async (req, res) => {
  try {
    const { guildId } = req.params;
    const {
      rankName,
      rankLevel,
      rankColor = "#FFFFFF",
      permissions = {},
    } = req.body;

    // Check if rank level is unique within guild
    const db = DatabaseManager.getInstance();
    const existingRank = await db.query(
      `
      SELECT id FROM guild_ranks 
      WHERE guild_id = $1 AND (rank_level = $2 OR rank_name = $3)
    `,
      [guildId, rankLevel, rankName],
    );

    if (existingRank.rows.length > 0) {
      return res.status(400).json({
        error: "Rank level or name already exists in this guild",
      });
    }

    const rankId = crypto.randomUUID();
    await db.query(
      `
      INSERT INTO guild_ranks (
        id, guild_id, rank_name, rank_level, rank_color,
        is_officer_rank, is_leader_rank, can_invite_members, can_kick_members,
        can_promote_members, can_demote_members, can_edit_guild_info,
        can_manage_treasury, can_declare_war, can_form_alliances
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    `,
      [
        rankId,
        guildId,
        rankName,
        rankLevel,
        rankColor,
        permissions.isOfficer || false,
        permissions.isLeader || false,
        permissions.canInvite || false,
        permissions.canKick || false,
        permissions.canPromote || false,
        permissions.canDemote || false,
        permissions.canEditInfo || false,
        permissions.canManageTreasury || false,
        permissions.canDeclareWar || false,
        permissions.canFormAlliances || false,
      ],
    );

    res.status(201).json({
      success: true,
      rankId,
      message: "Guild rank created successfully",
    });
  } catch (error) {
    logger.error("Error creating guild rank:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GUILD ALLIANCES
 */

// Get guild alliances
router.get("/guilds/:guildId/alliances", async (req, res) => {
  try {
    const { guildId } = req.params;

    const db = DatabaseManager.getInstance();
    const result = await db.query(
      `
      SELECT ga.*, 
             g_from.name as from_guild_name,
             g_to.name as to_guild_name,
             pp.display_name as established_by_name
      FROM guild_alliances ga
      JOIN guilds g_from ON ga.guild_from_id = g_from.id
      JOIN guilds g_to ON ga.guild_to_id = g_to.id
      LEFT JOIN player_profiles pp ON ga.established_by = pp.player_id
      WHERE ga.guild_from_id = $1 OR ga.guild_to_id = $1
      ORDER BY ga.established_at DESC
    `,
      [guildId],
    );

    res.json({
      success: true,
      alliances: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching guild alliances:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Propose alliance
router.post("/guilds/:guildId/alliances", async (req, res) => {
  try {
    const { guildId } = req.params;
    const {
      targetGuildId,
      allianceType,
      proposedBy,
      allianceTerms,
      tradeAgreement = false,
      nonAggressionPact = false,
      militaryAlliance = false,
    } = req.body;

    if (guildId === targetGuildId) {
      return res.status(400).json({ error: "Cannot form alliance with self" });
    }

    const db = DatabaseManager.getInstance();

    // Check if alliance already exists
    const existingAlliance = await db.query(
      `
      SELECT id FROM guild_alliances 
      WHERE (guild_from_id = $1 AND guild_to_id = $2) 
         OR (guild_from_id = $2 AND guild_to_id = $1)
    `,
      [guildId, targetGuildId],
    );

    if (existingAlliance.rows.length > 0) {
      return res.status(400).json({
        error: "Alliance relationship already exists between these guilds",
      });
    }

    await db.query(
      `
      INSERT INTO guild_alliances (
        guild_from_id, guild_to_id, alliance_type, established_by,
        trade_agreement, non_aggression_pact, military_alliance, alliance_terms
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
      [
        guildId,
        targetGuildId,
        allianceType,
        proposedBy,
        tradeAgreement,
        nonAggressionPact,
        militaryAlliance,
        allianceTerms,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Alliance proposal created successfully",
    });
  } catch (error) {
    logger.error("Error creating guild alliance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GUILD EVENTS
 */

// Get guild events
router.get("/guilds/:guildId/events", async (req, res) => {
  try {
    const { guildId } = req.params;
    const { upcoming = true, past = false } = req.query;

    let timeFilter = "";
    if (upcoming === "true" && past !== "true") {
      timeFilter = "AND ge.scheduled_at > CURRENT_TIMESTAMP";
    } else if (past === "true" && upcoming !== "true") {
      timeFilter = "AND ge.scheduled_at <= CURRENT_TIMESTAMP";
    }

    const db = DatabaseManager.getInstance();
    const result = await db.query(
      `
      SELECT ge.*, 
             pp.display_name as organizer_name,
             COUNT(gep.id) as participant_count
      FROM guild_events ge
      LEFT JOIN player_profiles pp ON ge.organizer_id = pp.player_id
      LEFT JOIN guild_event_participants gep ON ge.id = gep.event_id
      WHERE ge.guild_id = $1 ${timeFilter}
      GROUP BY ge.id, pp.display_name
      ORDER BY ge.scheduled_at ${upcoming === "true" ? "ASC" : "DESC"}
    `,
      [guildId],
    );

    res.json({
      success: true,
      events: result.rows,
    });
  } catch (error) {
    logger.error("Error fetching guild events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create guild event
router.post("/guilds/:guildId/events", async (req, res) => {
  try {
    const { guildId } = req.params;
    const {
      eventName,
      eventDescription,
      eventType,
      organizerId,
      scheduledAt,
      durationMinutes = 60,
      maxParticipants,
      requirements,
      rewards,
      isMandatory = false,
      isRecurring = false,
    } = req.body;

    const eventId = crypto.randomUUID();

    const db = DatabaseManager.getInstance();
    await db.query(
      `
      INSERT INTO guild_events (
        id, guild_id, event_name, event_description, event_type,
        organizer_id, scheduled_at, duration_minutes, max_participants,
        requirements, rewards, is_mandatory, is_recurring
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `,
      [
        eventId,
        guildId,
        eventName,
        eventDescription,
        eventType,
        organizerId,
        scheduledAt,
        durationMinutes,
        maxParticipants,
        requirements,
        JSON.stringify(rewards),
        isMandatory,
        isRecurring,
      ],
    );

    res.status(201).json({
      success: true,
      eventId,
      message: "Guild event created successfully",
    });
  } catch (error) {
    logger.error("Error creating guild event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
