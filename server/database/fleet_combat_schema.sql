-- Fleet Combat Database Schema
-- PostgreSQL schema for persistent storage of fleet combat data

-- ===== CORE TABLES =====

-- Players (assumes player table exists)
-- CREATE TABLE players (
--   id UUID PRIMARY KEY,
--   username VARCHAR(255) UNIQUE NOT NULL,
--   email VARCHAR(255),
--   created_at TIMESTAMP DEFAULT NOW()
-- );

-- Fleet Combats
CREATE TABLE fleet_combats (
  id VARCHAR(255) PRIMARY KEY,
  attacker_id VARCHAR(255) NOT NULL,
  defender_id VARCHAR(255) NOT NULL,
  attack_fleet_id VARCHAR(255) NOT NULL,
  defense_fleet_id VARCHAR(255),
  mission_type VARCHAR(50) NOT NULL,
  transit_method VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  location_x INTEGER,
  location_y INTEGER,
  location_z INTEGER,
  sector_id VARCHAR(255),
  stargate_id VARCHAR(255),
  jumpgate_id VARCHAR(255),
  launched_at BIGINT NOT NULL,
  arrival_time BIGINT NOT NULL,
  engagement_time BIGINT,
  completion_time BIGINT,
  total_rounds INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (attacker_id) REFERENCES players(id),
  FOREIGN KEY (defender_id) REFERENCES players(id),
  INDEX idx_attacker (attacker_id),
  INDEX idx_defender (defender_id),
  INDEX idx_status (status),
  INDEX idx_mission_type (mission_type)
);

-- Combat Rounds
CREATE TABLE combat_rounds (
  id VARCHAR(255) PRIMARY KEY,
  combat_id VARCHAR(255) NOT NULL,
  round_number INTEGER NOT NULL,
  timestamp BIGINT NOT NULL,
  damage_to_attacker DECIMAL(10, 2),
  damage_to_defender DECIMAL(10, 2),
  ships_destroyed_attacker INTEGER DEFAULT 0,
  ships_destroyed_defender INTEGER DEFAULT 0,
  summary TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (combat_id) REFERENCES fleet_combats(id) ON DELETE CASCADE,
  UNIQUE KEY unique_round (combat_id, round_number),
  INDEX idx_combat_id (combat_id)
);

-- Combat Results
CREATE TABLE combat_results (
  id VARCHAR(255) PRIMARY KEY,
  combat_id VARCHAR(255) UNIQUE NOT NULL,
  winner VARCHAR(50),
  success BOOLEAN DEFAULT FALSE,
  attacker_ships_destroyed INTEGER,
  attacker_ships_disabled INTEGER,
  attacker_crew_casualties INTEGER,
  attacker_estimated_loss DECIMAL(15, 2),
  attacker_ships_remaining INTEGER,
  defender_ships_destroyed INTEGER,
  defender_ships_disabled INTEGER,
  defender_crew_casualties INTEGER,
  defender_estimated_loss DECIMAL(15, 2),
  defender_ships_remaining INTEGER,
  attacker_xp_gained INTEGER DEFAULT 0,
  defender_xp_gained INTEGER DEFAULT 0,
  resources_transferred JSON,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (combat_id) REFERENCES fleet_combats(id) ON DELETE CASCADE,
  INDEX idx_winner (winner)
);

-- ===== TRANSIT INFRASTRUCTURE =====

-- Stargates
CREATE TABLE stargates (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  owner_id VARCHAR(255),
  location_x DECIMAL(10, 2),
  location_y DECIMAL(10, 2),
  location_z DECIMAL(10, 2),
  sector_id VARCHAR(255),
  level INTEGER DEFAULT 1,
  capacity INTEGER,
  transit_time INTEGER,
  status VARCHAR(50) DEFAULT 'active',
  health INTEGER DEFAULT 100,
  last_repair BIGINT,
  repair_cost INTEGER,
  control_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (owner_id) REFERENCES players(id),
  INDEX idx_owner (owner_id),
  INDEX idx_status (status),
  INDEX idx_sector (sector_id)
);

-- Stargate Connections
CREATE TABLE stargate_connections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  stargate_id VARCHAR(255) NOT NULL,
  linked_gate_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (stargate_id) REFERENCES stargates(id) ON DELETE CASCADE,
  FOREIGN KEY (linked_gate_id) REFERENCES stargates(id) ON DELETE CASCADE,
  UNIQUE KEY unique_connection (stargate_id, linked_gate_id),
  INDEX idx_stargate (stargate_id),
  INDEX idx_linked_gate (linked_gate_id)
);

-- Jump Gates
CREATE TABLE jump_gates (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  owner_id VARCHAR(255),
  location_x DECIMAL(10, 2),
  location_y DECIMAL(10, 2),
  location_z DECIMAL(10, 2),
  sector_id VARCHAR(255),
  range INTEGER,
  level INTEGER DEFAULT 1,
  status VARCHAR(50) DEFAULT 'active',
  stability INTEGER DEFAULT 100,
  energy_required INTEGER,
  cooldown_time INTEGER,
  last_used BIGINT,
  max_payload INTEGER,
  destabilization_risk DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (owner_id) REFERENCES players(id),
  INDEX idx_owner (owner_id),
  INDEX idx_status (status),
  INDEX idx_sector (sector_id)
);

-- Hyperspace Routes
CREATE TABLE hyperspace_routes (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  discovered_by VARCHAR(255),
  start_x DECIMAL(10, 2),
  start_y DECIMAL(10, 2),
  start_z DECIMAL(10, 2),
  end_x DECIMAL(10, 2),
  end_y DECIMAL(10, 2),
  end_z DECIMAL(10, 2),
  distance DECIMAL(15, 2),
  base_transit_time INTEGER,
  danger_level INTEGER,
  discovered BOOLEAN DEFAULT FALSE,
  passage_health INTEGER DEFAULT 100,
  control_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (discovered_by) REFERENCES players(id),
  INDEX idx_discovered_by (discovered_by),
  INDEX idx_discovered (discovered)
);

-- Hyperspace Hazards
CREATE TABLE hyperspace_hazards (
  id VARCHAR(255) PRIMARY KEY,
  route_id VARCHAR(255) NOT NULL,
  hazard_type VARCHAR(100) NOT NULL,
  severity INTEGER,
  location_x DECIMAL(10, 2),
  location_y DECIMAL(10, 2),
  location_z DECIMAL(10, 2),
  damage_percentage INTEGER,
  avoidance_difficulty INTEGER,
  detection_range DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (route_id) REFERENCES hyperspace_routes(id) ON DELETE CASCADE,
  INDEX idx_route (route_id),
  INDEX idx_type (hazard_type)
);

-- ===== COMBAT REPORTS =====

-- Combat Reports
CREATE TABLE combat_reports (
  id VARCHAR(255) PRIMARY KEY,
  combat_id VARCHAR(255) NOT NULL,
  report_type VARCHAR(50) NOT NULL,
  from_player_id VARCHAR(255) NOT NULL,
  to_player_id VARCHAR(255) NOT NULL,
  location_x INTEGER,
  location_y INTEGER,
  location_z INTEGER,
  sector_id VARCHAR(255),
  mission_type VARCHAR(50),
  transit_method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  total_ships_engaged_attacker INTEGER,
  total_ships_engaged_defender INTEGER,
  total_damage_attacker DECIMAL(10, 2),
  total_damage_defender DECIMAL(10, 2),
  duration_seconds INTEGER,
  initial_report TEXT,
  final_report TEXT,
  read_at BIGINT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (combat_id) REFERENCES fleet_combats(id) ON DELETE CASCADE,
  FOREIGN KEY (from_player_id) REFERENCES players(id),
  FOREIGN KEY (to_player_id) REFERENCES players(id),
  INDEX idx_to_player (to_player_id),
  INDEX idx_from_player (from_player_id),
  INDEX idx_status (status),
  INDEX idx_type (report_type)
);

-- ===== PLAYER STATISTICS =====

-- Fleet Combat Statistics
CREATE TABLE player_combat_statistics (
  id VARCHAR(255) PRIMARY KEY,
  player_id VARCHAR(255) UNIQUE NOT NULL,
  total_combats INTEGER DEFAULT 0,
  total_wins INTEGER DEFAULT 0,
  total_losses INTEGER DEFAULT 0,
  total_draws INTEGER DEFAULT 0,
  average_fleet_size DECIMAL(10, 2),
  total_ships_lost INTEGER DEFAULT 0,
  total_ships_destroyed INTEGER DEFAULT 0,
  total_damage_dealt DECIMAL(15, 2) DEFAULT 0,
  total_damage_taken DECIMAL(15, 2) DEFAULT 0,
  combat_efficiency DECIMAL(10, 4),
  win_rate DECIMAL(5, 2),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (player_id) REFERENCES players(id),
  INDEX idx_win_rate (win_rate),
  INDEX idx_efficiency (combat_efficiency)
);

-- Leaderboards
CREATE TABLE combat_leaderboards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id VARCHAR(255) NOT NULL,
  leaderboard_type VARCHAR(100) NOT NULL,
  rank INTEGER,
  score DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (player_id) REFERENCES players(id),
  UNIQUE KEY unique_leaderboard (player_id, leaderboard_type),
  INDEX idx_leaderboard_type (leaderboard_type),
  INDEX idx_rank (rank)
);

-- ===== VIEWS FOR COMMON QUERIES =====

CREATE VIEW player_combat_overview AS
SELECT
  p.id as player_id,
  p.username,
  pcs.total_combats,
  pcs.total_wins,
  pcs.total_losses,
  pcs.win_rate,
  pcs.combat_efficiency,
  COUNT(CASE WHEN fc.attacker_id = p.id AND fc.status = 'completed' THEN 1 END) as active_attacks,
  COUNT(CASE WHEN fc.defender_id = p.id AND fc.status IN ('pending', 'in_transit', 'engaged') THEN 1 END) as incoming_threats
FROM players p
LEFT JOIN player_combat_statistics pcs ON p.id = pcs.player_id
LEFT JOIN fleet_combats fc ON p.id IN (fc.attacker_id, fc.defender_id)
GROUP BY p.id, p.username, pcs.total_combats, pcs.total_wins, pcs.total_losses, pcs.win_rate, pcs.combat_efficiency;

CREATE VIEW infrastructure_control AS
SELECT
  'stargate' as infrastructure_type,
  id,
  name,
  owner_id,
  control_points,
  health,
  status
FROM stargates
UNION ALL
SELECT
  'jumpgate' as infrastructure_type,
  id,
  name,
  owner_id,
  0 as control_points,
  stability as health,
  status
FROM jump_gates;

CREATE VIEW active_combats AS
SELECT
  fc.id,
  fc.attacker_id,
  fc.defender_id,
  fc.mission_type,
  fc.transit_method,
  fc.status,
  fc.sector_id,
  TIMESTAMPDIFF(SECOND, FROM_UNIXTIME(fc.launched_at/1000), NOW()) as elapsed_seconds,
  TIMESTAMPDIFF(SECOND, NOW(), FROM_UNIXTIME(fc.arrival_time/1000)) as time_to_arrival
FROM fleet_combats
WHERE fc.status IN ('pending', 'in_transit', 'engaged');

-- ===== INDEXES FOR PERFORMANCE =====

CREATE INDEX idx_combats_sector ON fleet_combats(sector_id);
CREATE INDEX idx_combats_timestamp ON fleet_combats(launched_at);
CREATE INDEX idx_reports_combat ON combat_reports(combat_id);
CREATE INDEX idx_routes_status ON hyperspace_routes(discovered);
CREATE INDEX idx_stargates_health ON stargates(health);
CREATE INDEX idx_jumpgates_stability ON jump_gates(stability);

-- ===== STORED PROCEDURES =====

DELIMITER $$

-- Update player combat statistics after combat completion
CREATE PROCEDURE update_player_combat_stats(
  IN p_player_id VARCHAR(255),
  IN p_wins INT,
  IN p_losses INT,
  IN p_draws INT,
  IN p_damage_dealt DECIMAL(15, 2),
  IN p_damage_taken DECIMAL(15, 2),
  IN p_ships_destroyed INT,
  IN p_ships_lost INT
)
BEGIN
  INSERT INTO player_combat_statistics 
  (id, player_id, total_combats, total_wins, total_losses, total_draws, 
   total_damage_dealt, total_damage_taken, total_ships_destroyed, total_ships_lost)
  VALUES
  (CONCAT(p_player_id, '_', UNIX_TIMESTAMP()), p_player_id, 
   p_wins + p_losses + p_draws, p_wins, p_losses, p_draws,
   p_damage_dealt, p_damage_taken, p_ships_destroyed, p_ships_lost)
  ON DUPLICATE KEY UPDATE
    total_combats = total_combats + 1,
    total_wins = IF(p_wins > 0, total_wins + 1, total_wins),
    total_losses = IF(p_losses > 0, total_losses + 1, total_losses),
    total_draws = IF(p_draws > 0, total_draws + 1, total_draws),
    total_damage_dealt = total_damage_dealt + p_damage_dealt,
    total_damage_taken = total_damage_taken + p_damage_taken,
    total_ships_destroyed = total_ships_destroyed + p_ships_destroyed,
    total_ships_lost = total_ships_lost + p_ships_lost,
    combat_efficiency = total_damage_dealt / GREATEST(total_damage_taken, 1),
    win_rate = (total_wins / total_combats) * 100,
    updated_at = NOW();
END$$

-- Update stargate health after transit
CREATE PROCEDURE update_stargate_health(
  IN p_stargate_id VARCHAR(255),
  IN p_damage INT
)
BEGIN
  UPDATE stargates
  SET 
    health = GREATEST(0, health - p_damage),
    updated_at = NOW()
  WHERE id = p_stargate_id;
  
  -- Set status to damaged if health < 50
  UPDATE stargates
  SET status = CASE 
    WHEN health < 50 THEN 'damaged'
    WHEN health = 0 THEN 'destroyed'
    ELSE 'active'
  END
  WHERE id = p_stargate_id;
END$$

-- Archive old combat reports (older than 30 days)
CREATE PROCEDURE archive_old_reports()
BEGIN
  UPDATE combat_reports
  SET status = 'archived'
  WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
  AND status = 'reported';
END$$

DELIMITER ;

-- ===== INITIAL DATA =====

-- Create default stargates
INSERT INTO stargates (id, name, location_x, location_y, location_z, sector_id, level, capacity, transit_time, status, health, repair_cost) VALUES
('sg_alpha', 'Stargate Alpha', 0, 0, 0, 'Alpha-Sector', 5, 50, 5500, 'active', 100, 25000),
('sg_beta', 'Stargate Beta', 2000, 1500, 1000, 'Beta-Sector', 5, 50, 5500, 'active', 100, 25000),
('sg_gamma', 'Stargate Gamma', 4000, 3000, 2000, 'Gamma-Sector', 4, 40, 6500, 'active', 100, 20000);

-- Create stargate network connections
INSERT INTO stargate_connections (stargate_id, linked_gate_id) VALUES
('sg_alpha', 'sg_beta'),
('sg_beta', 'sg_alpha'),
('sg_beta', 'sg_gamma'),
('sg_gamma', 'sg_beta');
