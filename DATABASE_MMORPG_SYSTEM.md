# Star Trek MMORPG Database & Cron System

## Overview

This document describes the comprehensive database and cron job system for the Star Trek Turn-Based RTS MMORPG. The system handles player data, game state, real-time mechanics, and automated game processing.

## Architecture Components

### 1. Database Layer

- **PostgreSQL Database** with comprehensive schema
- **Connection Pooling** for scalable database access
- **Transaction Management** for data consistency
- **Automated Migrations** and schema versioning

### 2. Cron Job System

- **Automated Game Mechanics** processing
- **Real-time Updates** for turn-based gameplay
- **Background Tasks** for resource generation and maintenance
- **Job Monitoring** and failure recovery

### 3. Game Engine

- **Turn Processing** for player actions
- **Battle System** for combat resolution
- **Resource Management** and economy
- **Diplomacy and Alliance** systems

### 4. API Layer

- **RESTful APIs** for game interactions
- **Real-time Polling** for live updates
- **Admin Interface** for system management
- **Player Authentication** and session management

## Database Schema

### Core Tables

#### Players & Accounts

```sql
players              -- Player accounts and authentication
player_profiles      -- Extended character information
player_stats         -- Game statistics and achievements
player_resources     -- Resource inventory per player
player_game_saves    -- Serialized game state saves
```

#### Game World

```sql
galaxies            -- Game instances/worlds
sectors             -- Major regions within galaxies
star_systems        -- Star systems within sectors
celestial_bodies    -- Planets, moons, stations
territory_control   -- Who controls what territories
```

#### Fleet & Ships

```sql
ship_classes        -- Ship designs and specifications
ships               -- Individual ship instances
ship_equipment      -- Weapons, modules, upgrades
ship_equipment_installations -- What's installed on ships
```

#### Game Mechanics

```sql
game_turns          -- Turn-based game timing
player_actions      -- Actions submitted per turn
battles             -- Combat instances
battle_participants -- Who's involved in battles
```

#### Economy & Trade

```sql
resource_types      -- Available resources
resource_deposits   -- Resource locations
trade_orders        -- Buy/sell orders
trade_transactions  -- Completed trades
```

#### Technology & Research

```sql
technologies        -- Research tree
player_research     -- Research progress per player
```

#### Diplomacy & Social

```sql
diplomatic_relations -- Player relationships
alliances           -- Player organizations
alliance_members    -- Alliance membership
player_messages     -- In-game messaging
```

#### Events & Automation

```sql
game_events         -- System-generated events
cron_jobs           -- Scheduled task definitions
cron_job_executions -- Task execution logs
```

## Cron Job System

### Job Categories

#### 1. Core Game Mechanics

- **Turn Processing** (`*/30 * * * *`) - Process player actions every 30 minutes
- **Resource Generation** (`*/5 * * * *`) - Generate resources from deposits every 5 minutes
- **Ship Movement** (`*/1 * * * *`) - Update ship travel progress every minute
- **Research Progress** (`*/10 * * * *`) - Update technology research every 10 minutes

#### 2. Economy & Trade

- **Trade Order Execution** (`*/2 * * * *`) - Match and execute trade orders every 2 minutes
- **Market Price Updates** (`*/15 * * * *`) - Update resource market prices

#### 3. Combat & Events

- **Battle Processing** (`*/3 * * * *`) - Process ongoing battles every 3 minutes
- **Random Events** (`*/15 * * * *`) - Spawn galaxy events every 15 minutes
- **Diplomacy Updates** (`0 */6 * * *`) - Update diplomatic relations every 6 hours

#### 4. Maintenance & Cleanup

- **Data Cleanup** (`0 2 * * *`) - Clean expired data daily at 2 AM
- **Statistics Calculation** (`0 1 * * *`) - Update player stats daily at 1 AM
- **System Backup** (`0 4 * * 0`) - Weekly backup on Sundays at 4 AM
- **Maintenance Check** (`0 3 * * *`) - System health check daily at 3 AM

### Job Monitoring

- **Execution Logging** - All job runs are logged with timing and results
- **Failure Handling** - Failed jobs are retried with exponential backoff
- **Performance Monitoring** - Runtime and resource usage tracking
- **Admin Dashboard** - Real-time job status and manual triggers

## Game Engine Features

### Turn-Based Processing

```typescript
// Each turn processes player actions by priority
async processTurn(galaxyId: string) {
  1. Create new turn record
  2. Collect all pending player actions
  3. Process actions by priority level
  4. Resolve conflicts and interactions
  5. Update game state
  6. Send notifications to players
}
```

### Action Types

- **move_ship** - Move ships between locations
- **build_ship** - Construct new ships
- **attack** - Initiate combat
- **colonize** - Establish colonies
- **research** - Start technology research
- **trade** - Create trade orders
- **diplomacy** - Diplomatic actions
- **gather_resources** - Resource extraction

### Battle System

```typescript
// Combat resolution with multiple participants
async processBattle(battleId: string) {
  1. Calculate combat strength
  2. Apply tactical bonuses
  3. Resolve battle outcome
  4. Apply casualties and rewards
  5. Update territory control
  6. Notify participants
}
```

### Resource Economy

- **Dynamic Pricing** based on supply and demand
- **Resource Depletion** from extraction
- **Trade Routes** between territories
- **Economic Events** affecting markets

## API Endpoints

### Game API (`/api/game`)

- `GET /galaxies` - List available game worlds
- `POST /actions` - Submit player actions
- `GET /actions/:playerId/:galaxyId` - Get action history
- `GET /ship-classes` - Available ship designs
- `GET /technologies` - Research tree
- `GET /trade` - Active trade orders
- `GET /battles/:playerId` - Battle history
- `POST /save` - Save game state
- `GET /save/:playerId/:galaxyId/:dataType` - Load game state

### Player API (`/api/player`)

- `POST /register` - Create new account
- `POST /login` - Player authentication
- `GET /profile/:playerId` - Player profile
- `GET /:playerId/ships` - Player fleet
- `GET /:playerId/resources` - Resource inventory
- `GET /:playerId/messages` - In-game messages
- `GET /:playerId/territories` - Controlled territories

### Admin API (`/api/admin`)

- `GET /stats` - System statistics
- `GET /players` - Player management
- `PUT /players/:playerId/ban` - Ban/unban players
- `GET /galaxies` - Galaxy management
- `GET /cron` - Cron job status
- `POST /cron/:jobName/trigger` - Manual job trigger
- `GET /database/performance` - DB metrics

## Data Management

### Save/Load System

```typescript
interface GameSaveData {
  playerId: string;
  galaxyId: string;
  dataType:
    | "player_state"
    | "fleet_state"
    | "territory_state"
    | "research_state";
  data: any;
  version: number;
  checksum: string; // Data integrity verification
}
```

### Real-time Updates

- **Polling Endpoint** - `/api/realtime/poll/:playerId/:galaxyId`
- **State Synchronization** - Incremental updates
- **Conflict Resolution** - Last-write-wins with timestamps
- **Offline Support** - Queue actions when disconnected

## Performance Optimization

### Database Optimization

- **Connection Pooling** - Maximum 20 concurrent connections
- **Query Optimization** - Indexed columns for fast lookups
- **Batch Operations** - Bulk inserts for efficiency
- **Read Replicas** - Separate read/write operations

### Caching Strategy

- **Redis Integration** - Session and temporary data
- **Query Result Caching** - Frequently accessed data
- **Application-level Caching** - Game state in memory
- **CDN Integration** - Static asset delivery

### Scaling Considerations

- **Horizontal Scaling** - Multiple game server instances
- **Load Balancing** - Distribute player connections
- **Database Sharding** - Partition by galaxy
- **Microservices** - Separate game mechanics

## Security Features

### Authentication & Authorization

- **JWT Tokens** - Secure session management
- **Password Hashing** - bcrypt with 12 rounds
- **Rate Limiting** - Prevent API abuse
- **Input Validation** - SQL injection prevention

### Data Protection

- **Encryption at Rest** - Database encryption
- **Secure Communication** - HTTPS/TLS
- **Audit Logging** - Track admin actions
- **Backup Security** - Encrypted backups

## Monitoring & Logging

### Application Monitoring

- **Health Checks** - `/health` endpoint
- **Performance Metrics** - Response times and throughput
- **Error Tracking** - Exception monitoring
- **Resource Usage** - Memory and CPU monitoring

### Game Analytics

- **Player Behavior** - Action patterns and engagement
- **Economic Metrics** - Resource flow and trade volume
- **Balance Analysis** - Game balance and fairness
- **Population Tracking** - Active players per galaxy

## Deployment

### Development Setup

1. **Install Dependencies** - `npm install`
2. **Setup Database** - `npm run db:setup`
3. **Configure Environment** - Copy `.env.example` to `.env`
4. **Start Services** - `npm run dev`

### Production Deployment

1. **Build Application** - `npm run build`
2. **Setup Database** - Run migrations
3. **Configure Environment** - Set production variables
4. **Start Server** - `npm start`
5. **Monitor Services** - Setup monitoring and alerts

### Environment Variables

```bash
# Required
DB_HOST=localhost
DB_PASSWORD=secure_password
JWT_SECRET=secure_jwt_secret
ADMIN_API_KEY=secure_admin_key

# Optional Performance Tuning
DB_MAX_CONNECTIONS=50
RATE_LIMIT_MAX_REQUESTS=200
MAX_CONCURRENT_BATTLES=20
```

## Backup & Recovery

### Automated Backups

- **Daily Database Dumps** - Full schema and data
- **Weekly State Backups** - Complete game world snapshots
- **Transaction Log Backup** - Point-in-time recovery
- **Configuration Backup** - Environment and settings

### Disaster Recovery

- **Recovery Procedures** - Step-by-step restoration
- **Data Validation** - Integrity checks after restore
- **Failover Process** - Switch to backup systems
- **Communication Plan** - Player notification procedures

## Future Enhancements

### Planned Features

- **WebSocket Integration** - Real-time multiplayer updates
- **AI Opponents** - Computer-controlled players
- **Advanced Combat** - Tactical combat system
- **Mobile API** - Native mobile app support
- **Blockchain Integration** - NFT ships and territories

### Scalability Improvements

- **Microservices Architecture** - Service decomposition
- **Event Sourcing** - Immutable event log
- **CQRS Pattern** - Command/Query separation
- **Distributed Caching** - Multi-node cache cluster

## Troubleshooting

### Common Issues

- **Database Connection Errors** - Check connection pool settings
- **Cron Job Failures** - Review execution logs
- **Performance Issues** - Analyze slow queries
- **Memory Leaks** - Monitor heap usage

### Debug Tools

- **Admin Dashboard** - Real-time system monitoring
- **Database Queries** - SQL query analysis
- **Log Analysis** - Structured logging search
- **Performance Profiling** - Application bottlenecks

This comprehensive system provides a solid foundation for a scalable, turn-based RTS MMORPG with automated game mechanics, persistent player progression, and real-time multiplayer features.
