import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { DatabaseManager, DatabaseConfig } from "./database/DatabaseManager";
import { CronManager } from "./cron/cronManager";
import { GameEngine } from "./game/GameEngine";
import { Logger, LogLevel } from "./utils/Logger";
import { createGameRoutes } from "./routes/gameRoutes";
import { createPlayerRoutes } from "./routes/playerRoutes";
import { createAdminRoutes } from "./routes/adminRoutes";
import spaceInfrastructureRoutes from "./routes/spaceInfrastructureRoutes";
import guildRoutes from "./routes/guildRoutes";
import talentRoutes from "./routes/talentRoutes";
import levelingRoutes from "./routes/levelingRoutes";
import { createEventRoutes } from "./routes/eventRoutes";
import magastructerRoutes from "./routes/magastructerRoutes";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

class GameServer {
  private app: express.Application;
  private db: DatabaseManager;
  private cronManager: CronManager;
  private gameEngine: GameEngine;
  private logger: Logger;
  private server: any;

  constructor() {
    this.logger = new Logger("GameServer");
    this.app = express();

    // Initialize components
    this.setupDatabase();
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Setup database connection
   */
  private setupDatabase(): void {
    const dbConfig: DatabaseConfig = {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      database: process.env.DB_NAME || "startrek_mmorpg",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "password",
      ssl: process.env.DB_SSL === "true",
      maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || "20"),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || "30000"),
      connectionTimeoutMillis: parseInt(
        process.env.DB_CONNECTION_TIMEOUT || "5000",
      ),
    };

    this.db = new DatabaseManager(dbConfig);
    this.gameEngine = new GameEngine(this.db);
    this.cronManager = new CronManager(this.db, this.gameEngine);
  }

  /**
   * Setup Express middleware
   */
  private setupMiddleware(): void {
    // Security middleware
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "ws:", "wss:"],
          },
        },
      }),
    );

    // CORS configuration
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || "*",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      }),
    );

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: process.env.NODE_ENV === "production" ? 100 : 1000, // Limit requests per IP
      message: "Too many requests from this IP, please try again later.",
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use("/api/", limiter);

    // Compression and parsing
    this.app.use(compression());
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Request logging
    this.app.use((req, res, next) => {
      const start = Date.now();
      res.on("finish", () => {
        const duration = Date.now() - start;
        this.logger.info(
          `${req.method} ${req.path} ${res.statusCode} (${duration}ms)`,
        );
      });
      next();
    });

    // Serve static files from the client build
    this.app.use(express.static(path.join(__dirname, "../dist/spa")));
  }

  /**
   * Setup API routes
   */
  private setupRoutes(): void {
    // Health check
    this.app.get("/health", async (req, res) => {
      try {
        let dbHealth = false;
        let stats = null;

        try {
          dbHealth = await this.db.healthCheck();
          stats = await this.db.getDatabaseStats();
        } catch (dbError) {
          this.logger.warn("Database health check failed:", (dbError as any).message);
        }

        res.json({
          status: "healthy",
          timestamp: new Date().toISOString(),
          database: dbHealth ? "connected" : "disconnected",
          stats,
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          environment: process.env.NODE_ENV || "development",
        });
      } catch (error) {
        res.status(500).json({
          status: "unhealthy",
          error: (error as any).message,
        });
      }
    });

    // API routes
    this.app.use("/api/game", createGameRoutes(this.db, this.gameEngine));
    this.app.use("/api/player", createPlayerRoutes(this.db, this.gameEngine));
    this.app.use("/api/admin", createAdminRoutes(this.db, this.cronManager));
    this.app.use("/api/space", spaceInfrastructureRoutes);
    this.app.use("/api/guild", guildRoutes);
    this.app.use("/api/talent", talentRoutes);
    this.app.use("/api/leveling", levelingRoutes);
    this.app.use("/api/events", createEventRoutes(this.db, this.gameEngine));
    this.app.use("/api/magastructers", magastructerRoutes);

    // WebSocket endpoint for real-time updates
    this.setupWebSocket();

    // Serve React app for all other routes
    this.app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../dist/spa/index.html"));
    });

    // Error handling middleware
    this.app.use(
      (
        error: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        this.logger.error("Unhandled request error:", error as any);

        res.status((error as any).status || 500).json({
          error: {
            message: (error as any).message || "Internal Server Error",
            status: (error as any).status || 500,
            timestamp: new Date().toISOString(),
            path: req.path,
          },
        });
      },
    );
  }

  /**
   * Setup WebSocket for real-time game updates
   */
  private setupWebSocket(): void {
    // WebSocket implementation would go here
    // For now, we'll use HTTP polling for game state updates

    this.app.get("/api/realtime/poll/:playerId/:galaxyId", async (req, res) => {
      try {
        const { playerId, galaxyId } = req.params;

        // Get latest game state for player
        const gameState = await this.getPlayerGameState(playerId, galaxyId);

        res.json({
          timestamp: new Date().toISOString(),
          playerId,
          galaxyId,
          gameState,
        });
      } catch (error) {
        this.logger.error("Real-time poll error:", error);
        res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
      }
    });
  }

  /**
   * Get current game state for a player
   */
  private async getPlayerGameState(
    playerId: string,
    galaxyId: string,
  ): Promise<any> {
    const [player, ships, resources, messages, galaxy] = await Promise.all([
      this.db.getPlayer(playerId),
      this.db.getPlayerShips(playerId, galaxyId),
      this.db.getPlayerResources(playerId),
      this.getPlayerMessages(playerId),
      this.db.getGalaxy(galaxyId),
    ]);

    return {
      player,
      ships,
      resources,
      messages,
      galaxy: {
        id: galaxy.id,
        name: galaxy.name,
        currentTurn: galaxy.current_turn,
        lastTurnProcessed: galaxy.last_turn_processed,
        turnDuration: galaxy.turn_duration_minutes,
      },
    };
  }

  /**
   * Get recent messages for a player
   */
  private async getPlayerMessages(playerId: string): Promise<any[]> {
    const result = await this.db.query(
      `
      SELECT pm.*, p.username as sender_username
      FROM player_messages pm
      LEFT JOIN players p ON pm.from_player_id = p.id
      WHERE pm.to_player_id = $1 
      AND pm.sent_at >= NOW() - INTERVAL '24 hours'
      ORDER BY pm.sent_at DESC
      LIMIT 50
    `,
      [playerId],
    );

    return result.rows;
  }

  /**
   * Initialize and start the server
   */
  async start(): Promise<void> {
    try {
      this.logger.info("Starting Star Trek MMORPG Server...");

      // Set log level based on environment
      Logger.setLogLevel(
        process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG,
      );

      // Initialize database (with fallback for development)
      try {
        await this.db.initialize();
        this.logger.info("Database connection established");

        // Initialize cron manager only if database is available
        await this.cronManager.initialize();
        this.logger.info("Cron manager initialized");
      } catch (error) {
        this.logger.warn(
          "Database connection failed, running in mock mode:",
          error instanceof Error ? error.message : String(error),
        );
        // In development, continue without database
        if (process.env.NODE_ENV !== "production") {
          this.logger.info("Continuing in development mode without database");
        } else {
          throw error;
        }
      }

      // Start HTTP server
      const port = parseInt(process.env.PORT || "3000");
      this.server = this.app.listen(port, () => {
        this.logger.info(`Server running on port ${port}`);
        this.logger.info(
          `Environment: ${process.env.NODE_ENV || "development"}`,
        );
        this.logger.info(`Health check: http://localhost:${port}/health`);
      });

      // Handle graceful shutdown
      this.setupGracefulShutdown();

      this.logger.info("Star Trek MMORPG Server started successfully!");
    } catch (error) {
      this.logger.error("Failed to start server:", error);
      process.exit(1);
    }
  }

  /**
   * Setup graceful shutdown handlers
   */
  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      this.logger.info(`Received ${signal}, starting graceful shutdown...`);

      // Stop accepting new requests
      if (this.server) {
        this.server.close(() => {
          this.logger.info("HTTP server closed");
        });
      }

      try {
        // Stop cron jobs
        await this.cronManager.shutdown();
        this.logger.info("Cron manager stopped");

        // Close database connections
        await this.db.close();
        this.logger.info("Database connections closed");

        this.logger.info("Graceful shutdown completed");
        process.exit(0);
      } catch (error) {
        this.logger.error("Error during shutdown:", error);
        process.exit(1);
      }
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

    process.on("uncaughtException", (error) => {
      this.logger.error("Uncaught Exception:", error);
      process.exit(1);
    });

    process.on("unhandledRejection", (reason, promise) => {
      this.logger.error("Unhandled Rejection at:", promise);
      this.logger.error("Reason:", reason);
      process.exit(1);
    });
  }
}

// Start the server if this file is run directly (including via tsx/tsx watch)
const argvEntry = process.argv[1] || "";
const argvScript = process.argv[2] || "";
const isDirectRun =
  import.meta.url === `file://${argvEntry}` ||
  argvEntry.replace(/\\/g, "/").endsWith("/server/index.ts") ||
  argvScript.replace(/\\/g, "/").endsWith("/server/index.ts");

if (isDirectRun) {
  const server = new GameServer();
  server.start().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}

export { GameServer };

// Export createServer function for Vite development integration
export function createServer() {
  const gameServer = new GameServer();
  return gameServer["app"]; // Access the express app
}
