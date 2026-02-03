import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { Logger } from "./utils/Logger";

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || "3000");

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: "disconnected",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Basic API ping endpoint
app.get("/api/ping", (req, res) => {
  res.json({
    message: "pong",
    timestamp: new Date().toISOString(),
  });
});

// Serve static files from the client build (if available)
app.use(express.static(path.join(__dirname, "../dist/spa")));

// Catch-all handler
app.get("*", (req, res) => {
  res.json({
    message: "Star Trek MMORPG Server - Development Mode",
    path: req.path,
    timestamp: new Date().toISOString(),
  });
});

// Start server
const logger = new Logger("minimal-server");

app.listen(port, () => {
  logger.info(`Development server running on port ${port}`);
  logger.info(`Health check: http://localhost:${port}/health`);
  logger.info(`API Ping: http://localhost:${port}/api/ping`);
});
