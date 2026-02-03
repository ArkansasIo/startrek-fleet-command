-- =====================================================
-- STAR TREK MMORPG DATABASE SCHEMA
-- Turn-Based RTS with Real-Time Events
-- =====================================================

-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE PLAYER SYSTEM
-- =====================================================

-- Players table - Core user accounts
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    is_banned BOOLEAN DEFAULT false,
    ban_reason TEXT,
    ban_expires_at TIMESTAMP
);

-- Player profiles - Extended character information
CREATE TABLE player_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    display_name VARCHAR(100) NOT NULL,
    rank VARCHAR(50) DEFAULT 'Ensign',
    division VARCHAR(50) DEFAULT 'Command',
    ship_assignment VARCHAR(100) DEFAULT 'USS Enterprise NCC-1701',
    starfleet_id VARCHAR(20) UNIQUE,
    clearance_level INTEGER DEFAULT 1,
    experience_points BIGINT DEFAULT 0,
    level INTEGER DEFAULT 1,
    max_level INTEGER DEFAULT 925,
    credits BIGINT DEFAULT 1000,
    reputation INTEGER DEFAULT 0,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player statistics
CREATE TABLE player_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    battles_won INTEGER DEFAULT 0,
    battles_lost INTEGER DEFAULT 0,
    battles_total INTEGER DEFAULT 0,
    missions_completed INTEGER DEFAULT 0,
    territories_controlled INTEGER DEFAULT 0,
    ships_destroyed INTEGER DEFAULT 0,
    ships_lost INTEGER DEFAULT 0,
    resources_gathered BIGINT DEFAULT 0,
    time_played_minutes BIGINT DEFAULT 0,
    last_battle TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- GAME WORLD SYSTEM
-- =====================================================

-- Galaxies - Top level game worlds
CREATE TABLE galaxies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    max_players INTEGER DEFAULT 1000,
    current_players INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    game_speed FLOAT DEFAULT 1.0, -- Game speed multiplier
    turn_duration_minutes INTEGER DEFAULT 30, -- Real-time minutes per turn
    current_turn BIGINT DEFAULT 1,
    last_turn_processed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sectors - Major regions within galaxies
CREATE TABLE sectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    galaxy_id UUID REFERENCES galaxies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    coordinates_x INTEGER NOT NULL,
    coordinates_y INTEGER NOT NULL,
    coordinates_z INTEGER DEFAULT 0,
    sector_type VARCHAR(50) DEFAULT 'space', -- space, nebula, asteroid_field, wormhole
    security_level VARCHAR(20) DEFAULT 'safe', -- safe, caution, restricted, hostile
    controlling_faction VARCHAR(100),
    resource_modifier FLOAT DEFAULT 1.0,
    defense_modifier FLOAT DEFAULT 1.0,
    is_explorable BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Star systems within sectors
CREATE TABLE star_systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sector_id UUID REFERENCES sectors(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    system_type VARCHAR(50) DEFAULT 'single_star', -- single_star, binary, pulsar, black_hole
    coordinates_x INTEGER NOT NULL,
    coordinates_y INTEGER NOT NULL,
    star_class VARCHAR(10) DEFAULT 'G', -- O, B, A, F, G, K, M
    planets_count INTEGER DEFAULT 0,
    is_colonizable BOOLEAN DEFAULT true,
    discovery_date TIMESTAMP,
    discovered_by UUID REFERENCES players(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Planets and stations
CREATE TABLE celestial_bodies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    system_id UUID REFERENCES star_systems(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    body_type VARCHAR(50) NOT NULL, -- planet, moon, asteroid, station, starbase
    orbit_position INTEGER, -- 1 = closest to star
    planet_class VARCHAR(10), -- M, K, L, etc for planets
    size_class VARCHAR(20) DEFAULT 'medium', -- small, medium, large, huge
    population BIGINT DEFAULT 0,
    max_population BIGINT DEFAULT 1000000,
    infrastructure_level INTEGER DEFAULT 0, -- 0-100
    is_habitable BOOLEAN DEFAULT false,
    is_colonized BOOLEAN DEFAULT false,
    controlling_player_id UUID REFERENCES players(id),
    controlling_faction VARCHAR(100),
    defense_rating INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TERRITORY AND OWNERSHIP SYSTEM
-- =====================================================

-- Territory control - Who owns what
CREATE TABLE territory_control (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    galaxy_id UUID REFERENCES galaxies(id) ON DELETE CASCADE,
    controlled_type VARCHAR(50) NOT NULL, -- sector, system, planet, station
    controlled_id UUID NOT NULL, -- References the controlled entity
    control_strength INTEGER DEFAULT 100, -- 0-100, can be contested
    established_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_reinforced TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_contested BOOLEAN DEFAULT false,
    contested_by UUID REFERENCES players(id),
    INDEX idx_territory_control_type_id (controlled_type, controlled_id),
    INDEX idx_territory_control_player (player_id),
    INDEX idx_territory_control_galaxy (galaxy_id)
);

-- Territory borders and adjacency
CREATE TABLE territory_borders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    territory_from_type VARCHAR(50) NOT NULL,
    territory_from_id UUID NOT NULL,
    territory_to_type VARCHAR(50) NOT NULL,
    territory_to_id UUID NOT NULL,
    border_type VARCHAR(50) DEFAULT 'open', -- open, closed, neutral_zone, contested
    travel_time_minutes INTEGER DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_borders_from (territory_from_type, territory_from_id),
    INDEX idx_borders_to (territory_to_type, territory_to_id)
);

-- =====================================================
-- RESOURCE SYSTEM
-- =====================================================

-- Resource types
CREATE TABLE resource_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    rarity VARCHAR(20) DEFAULT 'common', -- common, uncommon, rare, epic, legendary
    base_value INTEGER DEFAULT 1,
    is_tradeable BOOLEAN DEFAULT true,
    category VARCHAR(50) DEFAULT 'material', -- material, energy, technology, cultural
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player resources
CREATE TABLE player_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    resource_type_id UUID REFERENCES resource_types(id) ON DELETE CASCADE,
    quantity BIGINT DEFAULT 0,
    reserved_quantity BIGINT DEFAULT 0, -- Resources tied up in orders/construction
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, resource_type_id)
);

-- Resource deposits on celestial bodies
CREATE TABLE resource_deposits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    celestial_body_id UUID REFERENCES celestial_bodies(id) ON DELETE CASCADE,
    resource_type_id UUID REFERENCES resource_types(id) ON DELETE CASCADE,
    quantity BIGINT NOT NULL,
    extraction_rate INTEGER DEFAULT 100, -- Per hour
    depletion_rate FLOAT DEFAULT 0.001, -- Percentage per extraction
    quality_modifier FLOAT DEFAULT 1.0,
    is_exploited BOOLEAN DEFAULT false,
    discovered_at TIMESTAMP,
    discovered_by UUID REFERENCES players(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- FLEET AND SHIP SYSTEM
-- =====================================================

-- Ship classes and designs
CREATE TABLE ship_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    class_type VARCHAR(50) NOT NULL, -- frigate, cruiser, battleship, carrier, science, etc
    size_class VARCHAR(20) DEFAULT 'medium', -- small, medium, large, huge
    crew_capacity INTEGER DEFAULT 100,
    cargo_capacity INTEGER DEFAULT 500,
    max_hull_points INTEGER DEFAULT 1000,
    max_shield_points INTEGER DEFAULT 500,
    speed INTEGER DEFAULT 5, -- Warp factor or sublight speed
    maneuverability INTEGER DEFAULT 5, -- 1-10
    sensor_range INTEGER DEFAULT 5, -- Sectors
    construction_cost JSONB, -- {resource_type_id: quantity}
    construction_time_hours INTEGER DEFAULT 24,
    maintenance_cost_per_turn INTEGER DEFAULT 10,
    crew_requirements JSONB, -- {skill_type: quantity}
    special_abilities JSONB, -- Array of special abilities
    era VARCHAR(50) DEFAULT '24th_century',
    faction VARCHAR(100) DEFAULT 'United Federation of Planets',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Individual ships
CREATE TABLE ships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    ship_class_id UUID REFERENCES ship_classes(id),
    name VARCHAR(100) NOT NULL,
    registry VARCHAR(50) UNIQUE,
    current_hull_points INTEGER,
    current_shield_points INTEGER,
    current_location_type VARCHAR(50), -- sector, system, planet, deep_space
    current_location_id UUID,
    destination_type VARCHAR(50),
    destination_id UUID,
    travel_eta TIMESTAMP,
    status VARCHAR(50) DEFAULT 'docked', -- docked, traveling, in_combat, exploring, damaged
    crew_count INTEGER DEFAULT 0,
    cargo_manifest JSONB, -- {resource_type_id: quantity}
    experience_points INTEGER DEFAULT 0,
    battle_victories INTEGER DEFAULT 0,
    upgrades JSONB, -- Array of upgrade IDs
    last_maintenance TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    commissioned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ship equipment and upgrades
CREATE TABLE ship_equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    equipment_type VARCHAR(50) NOT NULL, -- weapon, shield, engine, sensor, special
    equipment_slot VARCHAR(50), -- forward_weapon, aft_weapon, shield_generator, etc
    stats_modifier JSONB, -- {stat_name: modifier_value}
    power_requirement INTEGER DEFAULT 10,
    crew_requirement INTEGER DEFAULT 1,
    installation_cost JSONB, -- {resource_type_id: quantity}
    installation_time_hours INTEGER DEFAULT 1,
    rarity VARCHAR(20) DEFAULT 'common',
    era VARCHAR(50) DEFAULT '24th_century',
    faction VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ship equipment installations
CREATE TABLE ship_equipment_installations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ship_id UUID REFERENCES ships(id) ON DELETE CASCADE,
    equipment_id UUID REFERENCES ship_equipment(id),
    slot_name VARCHAR(50) NOT NULL,
    condition_percentage INTEGER DEFAULT 100, -- 0-100
    installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    installed_by UUID REFERENCES players(id),
    UNIQUE(ship_id, slot_name)
);

-- =====================================================
-- SPACE INFRASTRUCTURE SYSTEM
-- =====================================================

-- Galactic grid coordinate system
CREATE TABLE galactic_coordinates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    galaxy_id UUID REFERENCES galaxies(id) ON DELETE CASCADE,
    sector_x INTEGER NOT NULL,
    sector_y INTEGER NOT NULL,
    sector_z INTEGER NOT NULL,
    subsector_x FLOAT DEFAULT 0.0,
    subsector_y FLOAT DEFAULT 0.0,
    subsector_z FLOAT DEFAULT 0.0,
    coordinate_name VARCHAR(100),
    coordinate_type VARCHAR(50) DEFAULT 'empty_space', -- empty_space, system, anomaly, nebula
    is_explored BOOLEAN DEFAULT false,
    is_navigable BOOLEAN DEFAULT true,
    hazard_level INTEGER DEFAULT 0, -- 0-10
    radiation_level INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(galaxy_id, sector_x, sector_y, sector_z)
);

-- Space stations and starbases
CREATE TABLE space_stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    galaxy_id UUID REFERENCES galaxies(id) ON DELETE CASCADE,
    coordinate_id UUID REFERENCES galactic_coordinates(id),
    owner_id UUID REFERENCES players(id),
    name VARCHAR(100) NOT NULL,
    station_type VARCHAR(50) NOT NULL, -- starbase, space_station, outpost, shipyard, trading_post, research_facility
    station_class VARCHAR(20) DEFAULT 'medium', -- small, medium, large, massive
    hull_points INTEGER DEFAULT 5000,
    max_hull_points INTEGER DEFAULT 5000,
    shield_points INTEGER DEFAULT 2500,
    max_shield_points INTEGER DEFAULT 2500,
    power_output INTEGER DEFAULT 1000,
    crew_capacity INTEGER DEFAULT 500,
    docking_bays INTEGER DEFAULT 10,
    cargo_capacity INTEGER DEFAULT 10000,
    construction_progress INTEGER DEFAULT 100, -- 0-100 percentage
    maintenance_cost_per_turn INTEGER DEFAULT 50,
    defensive_rating INTEGER DEFAULT 100,
    sensor_range INTEGER DEFAULT 10, -- Sectors
    faction VARCHAR(100) DEFAULT 'United Federation of Planets',
    status VARCHAR(50) DEFAULT 'operational', -- under_construction, operational, damaged, destroyed, abandoned
    special_facilities JSONB, -- Array of special facility types
    docked_ships JSONB DEFAULT '[]', -- Array of ship IDs
    station_manifest JSONB DEFAULT '{}', -- {resource_type_id: quantity}
    defensive_weapons JSONB DEFAULT '[]', -- Array of weapon system configurations
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    commissioned_at TIMESTAMP
);

-- Jump gates for FTL travel
CREATE TABLE jump_gates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    galaxy_id UUID REFERENCES galaxies(id) ON DELETE CASCADE,
    coordinate_id UUID REFERENCES galactic_coordinates(id),
    name VARCHAR(100) NOT NULL,
    gate_type VARCHAR(50) DEFAULT 'standard', -- standard, long_range, capital, experimental
    owner_id UUID REFERENCES players(id),
    connected_gate_id UUID REFERENCES jump_gates(id),
    power_requirement INTEGER DEFAULT 100,
    max_ship_size VARCHAR(20) DEFAULT 'large', -- small, medium, large, massive
    travel_time_minutes INTEGER DEFAULT 5,
    activation_cost INTEGER DEFAULT 100, -- Credits per jump
    hull_points INTEGER DEFAULT 2000,
    max_hull_points INTEGER DEFAULT 2000,
    shield_points INTEGER DEFAULT 1000,
    max_shield_points INTEGER DEFAULT 1000,
    is_active BOOLEAN DEFAULT true,
    is_bidirectional BOOLEAN DEFAULT true,
    construction_progress INTEGER DEFAULT 100,
    maintenance_cost_per_turn INTEGER DEFAULT 25,
    faction VARCHAR(100) DEFAULT 'United Federation of Planets',
    status VARCHAR(50) DEFAULT 'operational', -- under_construction, operational, damaged, destroyed, offline
    security_level INTEGER DEFAULT 0, -- 0-10, higher means restricted access
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activated_at TIMESTAMP
);

-- Orbital defense platforms for planets
CREATE TABLE orbital_defense_platforms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    planet_id UUID REFERENCES celestial_bodies(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES players(id),
    platform_name VARCHAR(100) NOT NULL,
    platform_type VARCHAR(50) DEFAULT 'defense_platform', -- defense_platform, weapons_satellite, shield_generator, sensor_array
    orbital_position VARCHAR(50) DEFAULT 'high_orbit', -- low_orbit, high_orbit, lagrange_point, polar_orbit
    hull_points INTEGER DEFAULT 1500,
    max_hull_points INTEGER DEFAULT 1500,
    shield_points INTEGER DEFAULT 750,
    max_shield_points INTEGER DEFAULT 750,
    weapon_systems JSONB DEFAULT '[]', -- Array of weapon configurations
    shield_generators JSONB DEFAULT '[]', -- Array of shield generator configs
    sensor_systems JSONB DEFAULT '[]', -- Array of sensor system configs
    power_output INTEGER DEFAULT 500,
    crew_count INTEGER DEFAULT 50,
    construction_progress INTEGER DEFAULT 100,
    maintenance_cost_per_turn INTEGER DEFAULT 15,
    defensive_rating INTEGER DEFAULT 75,
    detection_range INTEGER DEFAULT 5, -- Sectors
    target_lock_range INTEGER DEFAULT 3, -- Sectors
    faction VARCHAR(100) DEFAULT 'United Federation of Planets',
    status VARCHAR(50) DEFAULT 'operational', -- under_construction, operational, damaged, destroyed, offline
    last_combat_action TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deployed_at TIMESTAMP
);

-- Travel routes and navigation data
CREATE TABLE travel_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    galaxy_id UUID REFERENCES galaxies(id) ON DELETE CASCADE,
    route_name VARCHAR(100),
    start_coordinate_id UUID REFERENCES galactic_coordinates(id),
    end_coordinate_id UUID REFERENCES galactic_coordinates(id),
    route_type VARCHAR(50) NOT NULL, -- ftl_direct, jump_gate, sublight, wormhole, transwarp
    travel_time_minutes INTEGER NOT NULL,
    fuel_cost INTEGER DEFAULT 0,
    energy_cost INTEGER DEFAULT 0,
    risk_level INTEGER DEFAULT 0, -- 0-10
    required_technology JSONB, -- Array of required tech IDs
    route_hazards JSONB, -- Array of hazard descriptions
    is_discovered BOOLEAN DEFAULT false,
    discovered_by UUID REFERENCES players(id),
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Starship travel tracking
CREATE TABLE ship_travel_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ship_id UUID REFERENCES ships(id) ON DELETE CASCADE,
    travel_route_id UUID REFERENCES travel_routes(id),
    departure_coordinate_id UUID REFERENCES galactic_coordinates(id),
    destination_coordinate_id UUID REFERENCES galactic_coordinates(id),
    travel_type VARCHAR(50) NOT NULL, -- ftl, sublight, jump_gate, emergency_warp
    departure_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estimated_arrival TIMESTAMP,
    actual_arrival TIMESTAMP,
    fuel_consumed INTEGER DEFAULT 0,
    energy_consumed INTEGER DEFAULT 0,
    distance_traveled FLOAT DEFAULT 0.0, -- In light years
    max_warp_achieved FLOAT, -- Warp factor
    incidents_encountered JSONB, -- Array of incident descriptions
    status VARCHAR(50) DEFAULT 'in_transit', -- in_transit, arrived, delayed, emergency_stop, lost
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FTL jump calculations and restrictions
CREATE TABLE ftl_restrictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    galaxy_id UUID REFERENCES galaxies(id) ON DELETE CASCADE,
    coordinate_id UUID REFERENCES galactic_coordinates(id),
    restriction_type VARCHAR(50) NOT NULL, -- gravity_well, subspace_distortion, radiation_field, interdiction_field
    restriction_level INTEGER DEFAULT 5, -- 1-10, higher means more restrictive
    affected_radius INTEGER DEFAULT 1, -- Sectors
    description TEXT,
    is_permanent BOOLEAN DEFAULT true,
    expires_at TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'natural', -- natural, artificial, alien_technology
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TURN-BASED GAME MECHANICS
-- =====================================================

-- Game turns - Central timing mechanism
CREATE TABLE game_turns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    galaxy_id UUID REFERENCES galaxies(id) ON DELETE CASCADE,
    turn_number BIGINT NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    duration_minutes INTEGER DEFAULT 30,
    status VARCHAR(20) DEFAULT 'active', -- active, processing, completed
    events_processed INTEGER DEFAULT 0,
    players_active INTEGER DEFAULT 0,
    UNIQUE(galaxy_id, turn_number)
);

-- Player actions per turn
CREATE TABLE player_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    galaxy_id UUID REFERENCES galaxies(id) ON DELETE CASCADE,
    turn_id UUID REFERENCES game_turns(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- move_ship, build, research, attack, trade, etc
    action_data JSONB NOT NULL, -- Specific action parameters
    target_type VARCHAR(50), -- What the action targets
    target_id UUID, -- ID of the target
    priority INTEGER DEFAULT 1, -- Execution order within turn
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
    result JSONB, -- Action results
    processing_started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_player_actions_turn (turn_id),
    INDEX idx_player_actions_player_turn (player_id, turn_id),
    INDEX idx_player_actions_status (status)
);

-- Battle system
CREATE TABLE battles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    galaxy_id UUID REFERENCES galaxies(id) ON DELETE CASCADE,
    turn_id UUID REFERENCES game_turns(id),
    battle_type VARCHAR(50) DEFAULT 'ship_combat', -- ship_combat, planetary_siege, station_assault
    location_type VARCHAR(50) NOT NULL,
    location_id UUID NOT NULL,
    status VARCHAR(20) DEFAULT 'ongoing', -- ongoing, completed, retreat
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    winner_player_id UUID REFERENCES players(id),
    battle_log JSONB, -- Detailed battle events
    casualties JSONB, -- Ships/units lost
    spoils JSONB, -- Resources/equipment gained
    INDEX idx_battles_galaxy_turn (galaxy_id, turn_id),
    INDEX idx_battles_location (location_type, location_id)
);

-- Battle participants
CREATE TABLE battle_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    battle_id UUID REFERENCES battles(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    side VARCHAR(20) NOT NULL, -- attacker, defender, neutral
    ships_count INTEGER DEFAULT 0,
    ships_lost INTEGER DEFAULT 0,
    damage_dealt BIGINT DEFAULT 0,
    damage_taken BIGINT DEFAULT 0,
    retreated_at TIMESTAMP,
    UNIQUE(battle_id, player_id)
);

-- =====================================================
-- RESEARCH AND TECHNOLOGY
-- =====================================================

-- Technology tree
CREATE TABLE technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general', -- military, science, engineering, diplomatic
    tier INTEGER DEFAULT 1, -- Technology tier/level
    research_cost JSONB, -- {resource_type_id: quantity}
    research_time_hours INTEGER DEFAULT 24,
    prerequisites JSONB, -- Array of technology IDs required
    unlock_bonuses JSONB, -- Bonuses granted when researched
    unlocks_equipment JSONB, -- Array of equipment IDs unlocked
    unlocks_ships JSONB, -- Array of ship class IDs unlocked
    era VARCHAR(50) DEFAULT '24th_century',
    faction VARCHAR(100),
    is_secret BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player research progress
CREATE TABLE player_research (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started', -- not_started, researching, completed
    progress_percentage INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    estimated_completion TIMESTAMP,
    completed_at TIMESTAMP,
    research_points_invested INTEGER DEFAULT 0,
    UNIQUE(player_id, technology_id)
);

-- =====================================================
-- DIPLOMACY AND ALLIANCES
-- =====================================================

-- Diplomatic relationships
CREATE TABLE diplomatic_relations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_from_id UUID REFERENCES players(id) ON DELETE CASCADE,
    player_to_id UUID REFERENCES players(id) ON DELETE CASCADE,
    relation_type VARCHAR(50) DEFAULT 'neutral', -- war, hostile, neutral, friendly, allied
    trust_level INTEGER DEFAULT 0, -- -100 to +100
    trade_agreement BOOLEAN DEFAULT false,
    non_aggression_pact BOOLEAN DEFAULT false,
    military_alliance BOOLEAN DEFAULT false,
    established_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    UNIQUE(player_from_id, player_to_id),
    CHECK(player_from_id != player_to_id)
);

-- Guild and Alliance Organizations
CREATE TABLE guilds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    tag VARCHAR(10) UNIQUE,
    description TEXT,
    founder_id UUID REFERENCES players(id),
    leader_id UUID REFERENCES players(id),
    member_count INTEGER DEFAULT 1,
    max_members INTEGER DEFAULT 200,
    guild_type VARCHAR(50) DEFAULT 'general', -- general, military, trade, research, diplomatic, mercenary, exploration
    organization_level VARCHAR(20) DEFAULT 'guild', -- guild, alliance, federation, empire
    is_npc_guild BOOLEAN DEFAULT false,
    is_open_recruitment BOOLEAN DEFAULT false,
    requires_application BOOLEAN DEFAULT true,
    min_level_requirement INTEGER DEFAULT 1,
    min_reputation_requirement INTEGER DEFAULT 0,
    entrance_fee INTEGER DEFAULT 0,
    weekly_dues INTEGER DEFAULT 0,
    headquarters_station_id UUID REFERENCES space_stations(id),
    headquarters_coordinate_id UUID REFERENCES galactic_coordinates(id),
    territory_control_points INTEGER DEFAULT 0,
    guild_wealth BIGINT DEFAULT 0,
    guild_influence INTEGER DEFAULT 0,
    guild_reputation INTEGER DEFAULT 0,
    pvp_enabled BOOLEAN DEFAULT false,
    war_declarations_allowed BOOLEAN DEFAULT false,
    diplomacy_enabled BOOLEAN DEFAULT true,
    public_chat_enabled BOOLEAN DEFAULT true,
    recruitment_message TEXT,
    guild_banner_url TEXT,
    guild_motto VARCHAR(200),
    founded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_disbanded BOOLEAN DEFAULT false,
    disbanded_at TIMESTAMP,
    treasury JSONB DEFAULT '{}', -- Shared guild resources
    technologies JSONB DEFAULT '[]', -- Guild-wide technology bonuses
    achievements JSONB DEFAULT '[]' -- Guild achievements
);

-- Guild Rank System
CREATE TABLE guild_ranks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
    rank_name VARCHAR(50) NOT NULL,
    rank_level INTEGER NOT NULL, -- Higher number = higher rank
    rank_icon VARCHAR(100),
    rank_color VARCHAR(7) DEFAULT '#FFFFFF', -- Hex color code
    is_officer_rank BOOLEAN DEFAULT false,
    is_leader_rank BOOLEAN DEFAULT false,
    can_invite_members BOOLEAN DEFAULT false,
    can_kick_members BOOLEAN DEFAULT false,
    can_promote_members BOOLEAN DEFAULT false,
    can_demote_members BOOLEAN DEFAULT false,
    can_edit_guild_info BOOLEAN DEFAULT false,
    can_manage_treasury BOOLEAN DEFAULT false,
    can_declare_war BOOLEAN DEFAULT false,
    can_form_alliances BOOLEAN DEFAULT false,
    can_access_guild_bank BOOLEAN DEFAULT true,
    can_use_guild_chat BOOLEAN DEFAULT true,
    can_see_member_locations BOOLEAN DEFAULT false,
    can_manage_territories BOOLEAN DEFAULT false,
    daily_withdrawal_limit INTEGER DEFAULT 0,
    weekly_withdrawal_limit INTEGER DEFAULT 0,
    permissions JSONB DEFAULT '[]', -- Additional custom permissions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(guild_id, rank_level),
    UNIQUE(guild_id, rank_name)
);

-- Guild Members
CREATE TABLE guild_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    rank_id UUID REFERENCES guild_ranks(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_online TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contribution_score INTEGER DEFAULT 0,
    total_donations BIGINT DEFAULT 0,
    pvp_kills INTEGER DEFAULT 0,
    pvp_deaths INTEGER DEFAULT 0,
    missions_completed INTEGER DEFAULT 0,
    territories_captured INTEGER DEFAULT 0,
    loyalty_points INTEGER DEFAULT 0,
    member_status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended, on_leave
    join_reason TEXT,
    notes TEXT, -- Officer notes about the member
    invited_by UUID REFERENCES players(id),
    promoted_by UUID REFERENCES players(id),
    last_promoted_at TIMESTAMP,
    custom_title VARCHAR(50), -- Special member title
    member_achievements JSONB DEFAULT '[]',
    UNIQUE(player_id) -- Player can only be in one guild
);

-- Guild Alliances (Guild-to-Guild relationships)
CREATE TABLE guild_alliances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guild_from_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
    guild_to_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
    alliance_type VARCHAR(50) DEFAULT 'neutral', -- neutral, friendly, allied, federated, war, hostile
    trust_level INTEGER DEFAULT 0, -- -100 to +100
    trade_agreement BOOLEAN DEFAULT false,
    non_aggression_pact BOOLEAN DEFAULT false,
    military_alliance BOOLEAN DEFAULT false,
    shared_territory BOOLEAN DEFAULT false,
    shared_resources BOOLEAN DEFAULT false,
    established_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    established_by UUID REFERENCES players(id),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    alliance_terms TEXT,
    is_secret BOOLEAN DEFAULT false,
    UNIQUE(guild_from_id, guild_to_id),
    CHECK(guild_from_id != guild_to_id)
);

-- Guild Wars and Conflicts
CREATE TABLE guild_wars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attacking_guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
    defending_guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
    war_type VARCHAR(50) DEFAULT 'territorial', -- territorial, resource, honor, revenge
    declared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    declared_by UUID REFERENCES players(id),
    war_status VARCHAR(20) DEFAULT 'active', -- declared, active, ceasefire, ended
    victory_conditions JSONB, -- Conditions for victory
    attacking_kills INTEGER DEFAULT 0,
    defending_kills INTEGER DEFAULT 0,
    territories_lost_attacking INTEGER DEFAULT 0,
    territories_lost_defending INTEGER DEFAULT 0,
    war_score_attacking INTEGER DEFAULT 0,
    war_score_defending INTEGER DEFAULT 0,
    ended_at TIMESTAMP,
    ended_by VARCHAR(50), -- victory_attacking, victory_defending, ceasefire, draw
    war_summary TEXT,
    is_formal_war BOOLEAN DEFAULT true -- Formal vs skirmish
);

-- Guild Applications
CREATE TABLE guild_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    application_message TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, withdrawn
    reviewed_by UUID REFERENCES players(id),
    reviewed_at TIMESTAMP,
    review_notes TEXT,
    auto_approved BOOLEAN DEFAULT false,
    UNIQUE(guild_id, player_id, status) -- Prevent duplicate pending applications
);

-- Guild Events and Activities
CREATE TABLE guild_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
    event_name VARCHAR(100) NOT NULL,
    event_description TEXT,
    event_type VARCHAR(50) DEFAULT 'meeting', -- meeting, raid, pvp, exploration, ceremony, trade
    organizer_id UUID REFERENCES players(id),
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    max_participants INTEGER,
    location_type VARCHAR(50), -- coordinate, station, planet
    location_id UUID,
    requirements TEXT,
    rewards JSONB, -- Event rewards
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, active, completed, cancelled
    participant_count INTEGER DEFAULT 0,
    is_mandatory BOOLEAN DEFAULT false,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern VARCHAR(50), -- daily, weekly, monthly
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guild Event Participants
CREATE TABLE guild_event_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES guild_events(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    participation_status VARCHAR(20) DEFAULT 'registered', -- registered, attending, absent, completed
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contribution_score INTEGER DEFAULT 0,
    rewards_earned JSONB,
    UNIQUE(event_id, player_id)
);

-- Guild Territories and Holdings
CREATE TABLE guild_territories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
    territory_name VARCHAR(100) NOT NULL,
    coordinate_id UUID REFERENCES galactic_coordinates(id),
    territory_type VARCHAR(50) DEFAULT 'sector', -- sector, system, station, planet, asteroid_field
    control_percentage FLOAT DEFAULT 100.0, -- How much of the territory is controlled
    captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    captured_by UUID REFERENCES players(id),
    defense_rating INTEGER DEFAULT 0,
    resource_income_per_hour JSONB DEFAULT '{}', -- Resources generated
    strategic_value INTEGER DEFAULT 1, -- 1-10 importance rating
    is_contested BOOLEAN DEFAULT false,
    contested_by UUID REFERENCES guilds(id),
    last_attacked TIMESTAMP,
    territory_bonuses JSONB DEFAULT '[]' -- Special bonuses this territory provides
);

-- Guild Messages and Communications
CREATE TABLE guild_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES players(id),
    message_type VARCHAR(50) DEFAULT 'general', -- general, announcement, officer, system
    subject VARCHAR(200),
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    is_official BOOLEAN DEFAULT false,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    edited_at TIMESTAMP,
    edited_by UUID REFERENCES players(id),
    reply_to_message_id UUID REFERENCES guild_messages(id),
    read_by JSONB DEFAULT '[]', -- Array of player IDs who have read
    importance_level VARCHAR(20) DEFAULT 'normal' -- low, normal, high, urgent
);

-- NPC Guild System
CREATE TABLE npc_guilds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guild_id UUID REFERENCES guilds(id) ON DELETE CASCADE,
    ai_personality VARCHAR(50) DEFAULT 'balanced', -- aggressive, peaceful, economic, military, scientific
    ai_difficulty VARCHAR(20) DEFAULT 'normal', -- easy, normal, hard, elite
    behavior_patterns JSONB, -- AI behavior configuration
    relationship_tendencies JSONB, -- How they interact with player guilds
    expansion_rate FLOAT DEFAULT 1.0, -- How quickly they expand
    diplomatic_stance VARCHAR(50) DEFAULT 'neutral', -- isolationist, friendly, aggressive, mercantile
    technology_focus VARCHAR(50) DEFAULT 'balanced', -- military, economic, scientific, exploration
    last_ai_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ai_action_frequency_minutes INTEGER DEFAULT 60, -- How often AI takes actions
    npc_leader_name VARCHAR(100),
    npc_leader_title VARCHAR(50),
    auto_accept_applications BOOLEAN DEFAULT false,
    auto_war_declarations BOOLEAN DEFAULT false,
    max_concurrent_wars INTEGER DEFAULT 2
);

-- =====================================================
-- TALENT TREES AND PROFESSIONS
-- =====================================================

-- Starfleet Professions and Career Paths
CREATE TABLE professions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profession_name VARCHAR(50) UNIQUE NOT NULL,
    profession_code VARCHAR(10) UNIQUE NOT NULL, -- ENG, SCI, MED, TAC, CMD, SEC, DIP
    description TEXT,
    primary_attribute VARCHAR(50), -- intelligence, strength, dexterity, charisma, wisdom
    icon_name VARCHAR(50),
    color_scheme VARCHAR(20) DEFAULT 'blue', -- blue, red, gold, green, purple
    starting_equipment JSONB DEFAULT '[]',
    profession_bonuses JSONB DEFAULT '{}', -- Base bonuses for this profession
    max_talent_points INTEGER DEFAULT 100,
    unlock_level INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Talent Trees within each profession
CREATE TABLE talent_trees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profession_id UUID REFERENCES professions(id) ON DELETE CASCADE,
    tree_name VARCHAR(100) NOT NULL,
    tree_description TEXT,
    tree_type VARCHAR(50) DEFAULT 'specialization', -- specialization, crafting, research, advanced
    unlock_level INTEGER DEFAULT 1,
    max_tier INTEGER DEFAULT 10,
    background_image VARCHAR(200),
    tree_color VARCHAR(20) DEFAULT 'blue',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(profession_id, tree_name)
);

-- Individual talent nodes/skills
CREATE TABLE talent_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    talent_tree_id UUID REFERENCES talent_trees(id) ON DELETE CASCADE,
    node_name VARCHAR(100) NOT NULL,
    node_description TEXT,
    detailed_description TEXT,
    tier_level INTEGER NOT NULL, -- 1-10, higher tiers require more points
    position_x INTEGER NOT NULL, -- X coordinate in tree layout
    position_y INTEGER NOT NULL, -- Y coordinate in tree layout
    max_rank INTEGER DEFAULT 1, -- How many times this can be upgraded
    points_per_rank INTEGER DEFAULT 1, -- Talent points needed per rank
    node_type VARCHAR(50) DEFAULT 'active', -- active, passive, crafting, research
    icon_name VARCHAR(50),
    effects JSONB DEFAULT '{}', -- What this talent does
    prerequisites JSONB DEFAULT '[]', -- Required talent node IDs
    unlock_requirements JSONB DEFAULT '{}', -- Level, quest, item requirements
    is_capstone BOOLEAN DEFAULT false, -- Major talents at end of trees
    is_starter BOOLEAN DEFAULT false, -- Entry talents at beginning
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player talent progression
CREATE TABLE player_talents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    profession_id UUID REFERENCES professions(id),
    talent_node_id UUID REFERENCES talent_nodes(id),
    current_rank INTEGER DEFAULT 0,
    max_rank INTEGER DEFAULT 1,
    points_invested INTEGER DEFAULT 0,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_upgraded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, talent_node_id)
);

-- Player profession progression
CREATE TABLE player_professions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    profession_id UUID REFERENCES professions(id),
    profession_level INTEGER DEFAULT 1,
    experience_points BIGINT DEFAULT 0,
    available_talent_points INTEGER DEFAULT 5, -- Unspent talent points
    total_talent_points INTEGER DEFAULT 5, -- Total earned talent points
    is_primary_profession BOOLEAN DEFAULT false,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, profession_id)
);

-- =====================================================
-- RESEARCH AND DEVELOPMENT SYSTEM
-- =====================================================

-- Research Categories (Star Trek Sciences)
CREATE TABLE research_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(100) UNIQUE NOT NULL,
    category_code VARCHAR(20) UNIQUE NOT NULL, -- PHYS, ENG, MED, TAC, etc.
    description TEXT,
    icon_name VARCHAR(50),
    color_scheme VARCHAR(20) DEFAULT 'blue',
    required_profession_id UUID REFERENCES professions(id),
    unlock_level INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- Research Projects (R&D Projects)
CREATE TABLE research_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES research_categories(id),
    project_name VARCHAR(200) NOT NULL,
    project_description TEXT,
    detailed_description TEXT,
    project_type VARCHAR(50) DEFAULT 'technology', -- technology, equipment, ship_component, facility
    tier_level INTEGER DEFAULT 1, -- 1-15 (representing Mark levels)
    research_time_hours INTEGER DEFAULT 24, -- Base research time
    resource_requirements JSONB DEFAULT '{}', -- Required materials and quantities
    prerequisite_projects JSONB DEFAULT '[]', -- Required completed projects
    prerequisite_talents JSONB DEFAULT '[]', -- Required talent nodes
    unlock_requirements JSONB DEFAULT '{}', -- Level, reputation, etc.
    success_rate FLOAT DEFAULT 1.0, -- 0.0-1.0 chance of success
    critical_success_rate FLOAT DEFAULT 0.1, -- Chance for enhanced results
    failure_penalties JSONB DEFAULT '{}', -- What happens on failure
    rewards JSONB DEFAULT '{}', -- What you get on success
    technology_unlock_id UUID, -- References technology_tree table
    is_repeatable BOOLEAN DEFAULT false,
    max_daily_attempts INTEGER DEFAULT 1,
    project_category VARCHAR(50), -- starship, weapons, equipment, facilities
    rarity VARCHAR(20) DEFAULT 'common', -- common, uncommon, rare, very_rare, ultra_rare
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player research progress
CREATE TABLE player_research (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    project_id UUID REFERENCES research_projects(id),
    status VARCHAR(50) DEFAULT 'in_progress', -- in_progress, completed, failed, paused
    progress_percentage FLOAT DEFAULT 0.0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estimated_completion TIMESTAMP,
    completed_at TIMESTAMP,
    attempts_count INTEGER DEFAULT 1,
    resources_consumed JSONB DEFAULT '{}',
    quality_modifier FLOAT DEFAULT 1.0, -- Affects final results
    research_notes TEXT,
    assigned_crew JSONB DEFAULT '[]', -- Crew members helping with research
    UNIQUE(player_id, project_id, started_at)
);

-- =====================================================
-- TECHNOLOGY TREES AND UNLOCKABLES
-- =====================================================

-- Star Trek Technology Categories
CREATE TABLE technology_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    color_scheme VARCHAR(20) DEFAULT 'blue',
    era VARCHAR(50) DEFAULT '24th_century', -- 22nd, 23rd, 24th, 25th, 26th
    faction VARCHAR(100) DEFAULT 'United Federation of Planets',
    sort_order INTEGER DEFAULT 0
);

-- Individual technologies in the Star Trek universe
CREATE TABLE technology_tree (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES technology_categories(id),
    tech_name VARCHAR(200) NOT NULL,
    tech_description TEXT,
    detailed_description TEXT,
    tech_type VARCHAR(50) DEFAULT 'equipment', -- equipment, ship_system, facility, weapon, shield, propulsion
    tier_level INTEGER DEFAULT 1,
    prerequisite_techs JSONB DEFAULT '[]', -- Required technology IDs
    research_project_id UUID REFERENCES research_projects(id), -- How to unlock this tech
    unlock_cost JSONB DEFAULT '{}', -- Resources needed to unlock
    manufacturing_cost JSONB DEFAULT '{}', -- Cost to build items using this tech
    effects JSONB DEFAULT '{}', -- What this technology enables
    restrictions JSONB DEFAULT '{}', -- Usage restrictions
    era VARCHAR(50) DEFAULT '24th_century',
    faction VARCHAR(100) DEFAULT 'United Federation of Planets',
    rarity VARCHAR(20) DEFAULT 'common',
    is_classified BOOLEAN DEFAULT false, -- Requires special clearance
    classification_level INTEGER DEFAULT 1, -- 1-10 security clearance needed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player technology unlocks
CREATE TABLE player_technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    technology_id UUID REFERENCES technology_tree(id),
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unlock_method VARCHAR(50) DEFAULT 'research', -- research, purchase, quest, found
    mastery_level INTEGER DEFAULT 1, -- How well they understand/use this tech
    usage_count INTEGER DEFAULT 0, -- How many times they've used/built this
    notes TEXT,
    UNIQUE(player_id, technology_id)
);

-- =====================================================
-- CRAFTING AND MANUFACTURING
-- =====================================================

-- Crafting Stations and Facilities
CREATE TABLE crafting_stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_name VARCHAR(100) NOT NULL,
    station_type VARCHAR(50) NOT NULL, -- replicator, fabricator, shipyard, laboratory, workshop
    description TEXT,
    required_technologies JSONB DEFAULT '[]', -- Technology IDs needed
    supported_projects JSONB DEFAULT '[]', -- What can be crafted here
    efficiency_modifier FLOAT DEFAULT 1.0, -- Speed/quality bonus
    max_concurrent_projects INTEGER DEFAULT 1,
    power_requirements INTEGER DEFAULT 100,
    crew_requirements INTEGER DEFAULT 1,
    maintenance_cost_per_hour INTEGER DEFAULT 10,
    location_type VARCHAR(50), -- ship, station, planet, mobile
    upgrade_level INTEGER DEFAULT 1,
    max_upgrade_level INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player-owned crafting stations
CREATE TABLE player_crafting_stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    station_id UUID REFERENCES crafting_stations(id),
    current_level INTEGER DEFAULT 1,
    efficiency_bonus FLOAT DEFAULT 0.0,
    location_type VARCHAR(50), -- ship, station, inventory
    location_id UUID, -- Reference to ship, station, etc.
    is_active BOOLEAN DEFAULT true,
    installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP,
    total_usage_hours INTEGER DEFAULT 0,
    UNIQUE(player_id, station_id, location_id)
);

-- Active crafting/research projects
CREATE TABLE active_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    project_type VARCHAR(50) NOT NULL, -- research, crafting, construction
    project_reference_id UUID NOT NULL, -- ID of research_project or crafting recipe
    crafting_station_id UUID REFERENCES player_crafting_stations(id),
    status VARCHAR(50) DEFAULT 'in_progress',
    progress_percentage FLOAT DEFAULT 0.0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estimated_completion TIMESTAMP,
    actual_completion TIMESTAMP,
    quality_modifier FLOAT DEFAULT 1.0,
    resource_efficiency FLOAT DEFAULT 1.0,
    assigned_crew JSONB DEFAULT '[]',
    project_notes TEXT,
    interruption_count INTEGER DEFAULT 0 -- How many times paused/resumed
);

-- =====================================================
-- LEVELING AND PROGRESSION SYSTEM
-- =====================================================

-- Level progression table with experience requirements
CREATE TABLE level_progression (
    level INTEGER PRIMARY KEY,
    experience_required BIGINT NOT NULL,
    experience_total BIGINT NOT NULL, -- Cumulative experience
    skill_points_gained INTEGER DEFAULT 1,
    talent_points_gained INTEGER DEFAULT 0,
    level_category VARCHAR(20) DEFAULT 'character', -- character, crafting, mastery
    level_tier VARCHAR(20) DEFAULT 'normal', -- normal, veteran, expert, master, grandmaster
    unlocks JSONB DEFAULT '[]', -- What unlocks at this level
    CHECK (level >= 1 AND level <= 925)
);

-- Player level tracking
CREATE TABLE player_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    level_type VARCHAR(50) NOT NULL, -- character, engineering, science, tactical, etc.
    current_level INTEGER DEFAULT 1,
    current_experience BIGINT DEFAULT 0,
    total_experience BIGINT DEFAULT 0,
    skill_points_available INTEGER DEFAULT 5,
    skill_points_spent INTEGER DEFAULT 0,
    last_level_up TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, level_type),
    CHECK (current_level >= 1 AND current_level <= 925)
);

-- =====================================================
-- CRAFTING AND MASTERWORK SYSTEM
-- =====================================================

-- Crafting disciplines (different from professions)
CREATE TABLE crafting_disciplines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discipline_name VARCHAR(100) UNIQUE NOT NULL,
    discipline_code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    color_scheme VARCHAR(20) DEFAULT 'blue',
    max_level INTEGER DEFAULT 725,
    mastery_levels JSONB DEFAULT '{}', -- Different mastery thresholds
    required_profession_id UUID REFERENCES professions(id),
    unlock_level INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- Player crafting levels
CREATE TABLE player_crafting_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    discipline_id UUID REFERENCES crafting_disciplines(id),
    current_level INTEGER DEFAULT 1,
    current_experience BIGINT DEFAULT 0,
    total_experience BIGINT DEFAULT 0,
    tempering_level INTEGER DEFAULT 1, -- Tempering skill 1-725
    masterwork_level INTEGER DEFAULT 1, -- Masterwork skill 1-175
    recipes_known JSONB DEFAULT '[]', -- Array of known recipe IDs
    specializations JSONB DEFAULT '[]', -- Special crafting abilities
    last_level_up TIMESTAMP,
    mastery_points INTEGER DEFAULT 0, -- Points for advanced techniques
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, discipline_id),
    CHECK (current_level >= 1 AND current_level <= 725),
    CHECK (tempering_level >= 1 AND tempering_level <= 725),
    CHECK (masterwork_level >= 1 AND masterwork_level <= 175)
);

-- Crafting recipes
CREATE TABLE crafting_recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_name VARCHAR(200) NOT NULL,
    discipline_id UUID REFERENCES crafting_disciplines(id),
    item_category VARCHAR(50) NOT NULL, -- weapon, armor, ship_component, building, consumable
    item_subcategory VARCHAR(50), -- phaser, shield, hull_plating, etc.
    recipe_tier INTEGER DEFAULT 1, -- 1-15 (Mark levels)
    min_crafting_level INTEGER DEFAULT 1,
    min_tempering_level INTEGER DEFAULT 1,
    min_masterwork_level INTEGER DEFAULT 1,
    base_materials JSONB NOT NULL, -- Required base materials
    rare_materials JSONB DEFAULT '{}', -- Optional rare materials for quality
    crafting_time_minutes INTEGER DEFAULT 30,
    energy_cost INTEGER DEFAULT 100,
    skill_difficulty INTEGER DEFAULT 1, -- 1-10
    success_rate FLOAT DEFAULT 1.0,
    critical_success_rate FLOAT DEFAULT 0.1,
    masterwork_chance FLOAT DEFAULT 0.05,
    legendary_chance FLOAT DEFAULT 0.01,
    base_item_stats JSONB DEFAULT '{}', -- Base item statistics
    possible_modifiers JSONB DEFAULT '[]', -- Random modifiers possible
    unlock_requirements JSONB DEFAULT '{}',
    recipe_source VARCHAR(50) DEFAULT 'trainer', -- trainer, drop, quest, research
    is_secret BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crafted items and their properties
CREATE TABLE crafted_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name VARCHAR(200) NOT NULL,
    recipe_id UUID REFERENCES crafting_recipes(id),
    crafter_id UUID REFERENCES players(id),
    item_category VARCHAR(50) NOT NULL,
    item_subcategory VARCHAR(50),
    item_tier INTEGER DEFAULT 1,
    quality VARCHAR(20) DEFAULT 'standard', -- standard, fine, superior, epic, legendary
    item_level INTEGER DEFAULT 1,
    base_stats JSONB DEFAULT '{}', -- Core item statistics
    modifiers JSONB DEFAULT '[]', -- Applied modifiers
    enchantments JSONB DEFAULT '[]', -- Applied enchantments
    tempering_level INTEGER DEFAULT 0, -- 0-10 tempering enhancements
    masterwork_bonus JSONB DEFAULT '{}', -- Masterwork bonuses
    durability_current INTEGER DEFAULT 100,
    durability_max INTEGER DEFAULT 100,
    bind_type VARCHAR(20) DEFAULT 'none', -- none, pickup, equip, account
    owner_id UUID REFERENCES players(id),
    location_type VARCHAR(50) DEFAULT 'inventory', -- inventory, equipped, bank, ship
    location_id UUID, -- Reference to ship, station, etc.
    crafted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_repaired TIMESTAMP,
    repair_count INTEGER DEFAULT 0,
    is_unique BOOLEAN DEFAULT false,
    unique_properties JSONB DEFAULT '{}'
);

-- Tempering system for item enhancement
CREATE TABLE tempering_levels (
    level INTEGER PRIMARY KEY,
    level_name VARCHAR(50) NOT NULL,
    success_rate FLOAT NOT NULL,
    destruction_rate FLOAT DEFAULT 0.0,
    downgrade_rate FLOAT DEFAULT 0.0,
    materials_required JSONB NOT NULL,
    stat_bonus_percentage FLOAT DEFAULT 0.1, -- 10% per level
    cost_multiplier FLOAT DEFAULT 1.0,
    min_crafter_level INTEGER DEFAULT 1,
    CHECK (level >= 0 AND level <= 10)
);

-- Masterwork tiers and bonuses
CREATE TABLE masterwork_tiers (
    tier INTEGER PRIMARY KEY,
    tier_name VARCHAR(50) NOT NULL,
    required_masterwork_level INTEGER NOT NULL,
    creation_chance FLOAT NOT NULL,
    bonus_stats JSONB NOT NULL, -- Additional stats granted
    special_properties JSONB DEFAULT '[]', -- Special effects
    visual_effects JSONB DEFAULT '{}', -- Visual enhancements
    tier_color VARCHAR(20) DEFAULT 'gold',
    CHECK (tier >= 1 AND tier <= 5)
);

-- Item enhancement history
CREATE TABLE item_enhancement_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES crafted_items(id) ON DELETE CASCADE,
    enhancement_type VARCHAR(50) NOT NULL, -- tempering, masterwork, repair, upgrade
    previous_level INTEGER,
    new_level INTEGER,
    success BOOLEAN NOT NULL,
    materials_used JSONB NOT NULL,
    enhanced_by UUID REFERENCES players(id),
    enhancement_cost INTEGER DEFAULT 0,
    enhancement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Building construction system
CREATE TABLE building_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_name VARCHAR(100) NOT NULL,
    building_category VARCHAR(50) NOT NULL, -- station, shipyard, laboratory, defense, utility
    building_size VARCHAR(20) DEFAULT 'medium', -- small, medium, large, massive
    construction_time_hours INTEGER DEFAULT 24,
    required_materials JSONB NOT NULL,
    required_crafting_level INTEGER DEFAULT 1,
    required_engineering_level INTEGER DEFAULT 1,
    power_consumption INTEGER DEFAULT 100,
    crew_requirements INTEGER DEFAULT 5,
    maintenance_cost_per_hour INTEGER DEFAULT 10,
    building_effects JSONB DEFAULT '{}', -- What the building provides
    upgrade_tiers JSONB DEFAULT '[]', -- Possible upgrades
    max_quantity_per_location INTEGER DEFAULT 1,
    unlock_requirements JSONB DEFAULT '{}'
);

-- Player-constructed buildings
CREATE TABLE player_buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_type_id UUID REFERENCES building_types(id),
    owner_id UUID REFERENCES players(id),
    building_name VARCHAR(100),
    location_type VARCHAR(50) NOT NULL, -- planet, asteroid, space_station, ship
    location_id UUID NOT NULL, -- Reference to the location
    coordinate_id UUID REFERENCES galactic_coordinates(id),
    construction_progress FLOAT DEFAULT 0.0, -- 0.0 to 100.0
    current_tier INTEGER DEFAULT 1,
    health_points INTEGER DEFAULT 1000,
    max_health_points INTEGER DEFAULT 1000,
    power_level INTEGER DEFAULT 100,
    crew_assigned INTEGER DEFAULT 0,
    operational_status VARCHAR(20) DEFAULT 'offline', -- offline, online, maintenance, damaged
    construction_quality VARCHAR(20) DEFAULT 'standard',
    masterwork_bonuses JSONB DEFAULT '{}',
    last_maintenance TIMESTAMP,
    construction_started TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    construction_completed TIMESTAMP,
    total_construction_cost JSONB DEFAULT '{}'
);

-- =====================================================
-- TRADE AND ECONOMY
-- =====================================================

-- Trade orders
CREATE TABLE trade_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    order_type VARCHAR(20) NOT NULL, -- buy, sell
    resource_type_id UUID REFERENCES resource_types(id),
    quantity BIGINT NOT NULL,
    price_per_unit INTEGER NOT NULL,
    total_value BIGINT GENERATED ALWAYS AS (quantity * price_per_unit) STORED,
    location_type VARCHAR(50), -- sector, system, planet, station
    location_id UUID,
    status VARCHAR(20) DEFAULT 'active', -- active, partial, completed, cancelled, expired
    quantity_filled BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    completed_at TIMESTAMP,
    INDEX idx_trade_orders_resource (resource_type_id),
    INDEX idx_trade_orders_location (location_type, location_id),
    INDEX idx_trade_orders_status (status)
);

-- Trade transactions
CREATE TABLE trade_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buy_order_id UUID REFERENCES trade_orders(id),
    sell_order_id UUID REFERENCES trade_orders(id),
    buyer_id UUID REFERENCES players(id),
    seller_id UUID REFERENCES players(id),
    resource_type_id UUID REFERENCES resource_types(id),
    quantity BIGINT NOT NULL,
    price_per_unit INTEGER NOT NULL,
    total_value BIGINT GENERATED ALWAYS AS (quantity * price_per_unit) STORED,
    transaction_fee INTEGER DEFAULT 0,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_trade_transactions_buyer (buyer_id),
    INDEX idx_trade_transactions_seller (seller_id),
    INDEX idx_trade_transactions_resource (resource_type_id)
);

-- =====================================================
-- EVENTS AND MESSAGING
-- =====================================================

-- Game events (system-generated events)
CREATE TABLE game_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    galaxy_id UUID REFERENCES galaxies(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- resource_discovery, alien_contact, natural_disaster, etc
    severity VARCHAR(20) DEFAULT 'info', -- info, warning, critical
    title VARCHAR(200) NOT NULL,
    description TEXT,
    affected_players JSONB, -- Array of player IDs
    location_type VARCHAR(50),
    location_id UUID,
    event_data JSONB, -- Event-specific data
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_game_events_galaxy (galaxy_id),
    INDEX idx_game_events_type (event_type),
    INDEX idx_game_events_location (location_type, location_id)
);

-- Player messages and notifications
CREATE TABLE player_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_player_id UUID REFERENCES players(id),
    to_player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    message_type VARCHAR(50) DEFAULT 'personal', -- personal, system, alliance, trade, diplomatic
    subject VARCHAR(200),
    content TEXT,
    is_read BOOLEAN DEFAULT false,
    is_important BOOLEAN DEFAULT false,
    related_entity_type VARCHAR(50), -- Reference to related game entity
    related_entity_id UUID,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    expires_at TIMESTAMP,
    INDEX idx_player_messages_to (to_player_id),
    INDEX idx_player_messages_from (from_player_id),
    INDEX idx_player_messages_type (message_type)
);

-- =====================================================
-- SCHEDULED TASKS AND AUTOMATION
-- =====================================================

-- Cron job definitions
CREATE TABLE cron_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_name VARCHAR(100) UNIQUE NOT NULL,
    job_type VARCHAR(50) NOT NULL, -- turn_processing, resource_generation, maintenance, cleanup
    cron_expression VARCHAR(100) NOT NULL, -- Standard cron expression
    is_active BOOLEAN DEFAULT true,
    last_run TIMESTAMP,
    next_run TIMESTAMP,
    run_count BIGINT DEFAULT 0,
    success_count BIGINT DEFAULT 0,
    failure_count BIGINT DEFAULT 0,
    max_runtime_seconds INTEGER DEFAULT 300,
    timeout_action VARCHAR(20) DEFAULT 'kill', -- kill, continue, retry
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cron job execution log
CREATE TABLE cron_job_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES cron_jobs(id) ON DELETE CASCADE,
    execution_id VARCHAR(100) UNIQUE NOT NULL, -- Unique execution identifier
    status VARCHAR(20) DEFAULT 'running', -- running, completed, failed, timeout
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    runtime_seconds INTEGER,
    records_processed INTEGER DEFAULT 0,
    error_message TEXT,
    execution_log TEXT, -- Detailed execution log
    memory_usage_mb INTEGER,
    cpu_usage_percent FLOAT,
    INDEX idx_cron_executions_job (job_id),
    INDEX idx_cron_executions_status (status),
    INDEX idx_cron_executions_started (started_at)
);

-- =====================================================
-- INDICES FOR PERFORMANCE
-- =====================================================

-- Player indices
CREATE INDEX idx_players_username ON players(username);
CREATE INDEX idx_players_email ON players(email);
CREATE INDEX idx_players_active ON players(is_active);
CREATE INDEX idx_players_last_login ON players(last_login);

-- Game world indices
CREATE INDEX idx_sectors_galaxy ON sectors(galaxy_id);
CREATE INDEX idx_sectors_coordinates ON sectors(coordinates_x, coordinates_y);
CREATE INDEX idx_systems_sector ON star_systems(sector_id);
CREATE INDEX idx_bodies_system ON celestial_bodies(system_id);
CREATE INDEX idx_bodies_controlling_player ON celestial_bodies(controlling_player_id);

-- Fleet indices
CREATE INDEX idx_ships_player ON ships(player_id);
CREATE INDEX idx_ships_location ON ships(current_location_type, current_location_id);
CREATE INDEX idx_ships_status ON ships(status);

-- Resource indices
CREATE INDEX idx_player_resources_player ON player_resources(player_id);
CREATE INDEX idx_resource_deposits_body ON resource_deposits(celestial_body_id);

-- Turn and action indices
CREATE INDEX idx_player_actions_player ON player_actions(player_id);
CREATE INDEX idx_player_actions_turn_status ON player_actions(turn_id, status);

-- Space infrastructure indices
CREATE INDEX idx_galactic_coordinates_galaxy ON galactic_coordinates(galaxy_id);
CREATE INDEX idx_galactic_coordinates_sector ON galactic_coordinates(sector_x, sector_y, sector_z);
CREATE INDEX idx_galactic_coordinates_type ON galactic_coordinates(coordinate_type);

CREATE INDEX idx_space_stations_galaxy ON space_stations(galaxy_id);
CREATE INDEX idx_space_stations_owner ON space_stations(owner_id);
CREATE INDEX idx_space_stations_coordinate ON space_stations(coordinate_id);
CREATE INDEX idx_space_stations_type ON space_stations(station_type);
CREATE INDEX idx_space_stations_status ON space_stations(status);

CREATE INDEX idx_jump_gates_galaxy ON jump_gates(galaxy_id);
CREATE INDEX idx_jump_gates_coordinate ON jump_gates(coordinate_id);
CREATE INDEX idx_jump_gates_owner ON jump_gates(owner_id);
CREATE INDEX idx_jump_gates_connected ON jump_gates(connected_gate_id);
CREATE INDEX idx_jump_gates_status ON jump_gates(status);

CREATE INDEX idx_orbital_platforms_planet ON orbital_defense_platforms(planet_id);

-- =====================================================
-- UNIVERSE GALAXY EVENT SYSTEM
-- =====================================================

-- Event categories and classifications
CREATE TABLE event_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(100) UNIQUE NOT NULL,
    category_code VARCHAR(20) UNIQUE NOT NULL, -- EXPLO, MILI, DIPLO, EMER, BORG, etc.
    description TEXT,
    icon_name VARCHAR(50),
    color_scheme VARCHAR(20) DEFAULT 'blue',
    risk_level INTEGER DEFAULT 1, -- 1-10 danger level
    reward_tier INTEGER DEFAULT 1, -- 1-10 reward potential
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event types within categories
CREATE TABLE event_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES event_categories(id) ON DELETE CASCADE,
    type_name VARCHAR(100) NOT NULL,
    type_code VARCHAR(20) NOT NULL,
    description TEXT,
    detailed_description TEXT,
    event_class VARCHAR(20) DEFAULT 'standard', -- standard, elite, legendary, mythic
    difficulty_tier INTEGER DEFAULT 1, -- 1-15 difficulty tiers
    duration_type VARCHAR(20) DEFAULT 'limited', -- limited, persistent, recurring, seasonal
    base_duration_hours INTEGER DEFAULT 24,
    participant_type VARCHAR(20) DEFAULT 'solo', -- solo, group, fleet, guild, multi_guild
    min_participants INTEGER DEFAULT 1,
    max_participants INTEGER DEFAULT 1,
    required_level INTEGER DEFAULT 1,
    required_technologies JSONB DEFAULT '[]',
    required_reputation JSONB DEFAULT '{}',
    unlock_requirements JSONB DEFAULT '{}',
    scaling_rules JSONB DEFAULT '{}', -- How event scales with participants
    is_pvp_enabled BOOLEAN DEFAULT false,
    allows_alliances BOOLEAN DEFAULT false,
    can_be_interrupted BOOLEAN DEFAULT true,
    respawn_cooldown_hours INTEGER DEFAULT 168, -- Weekly by default
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, type_code)
);

-- Event boss definitions
CREATE TABLE event_bosses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    boss_name VARCHAR(100) NOT NULL,
    boss_title VARCHAR(200),
    boss_class VARCHAR(50) DEFAULT 'standard', -- standard, elite, legendary, cosmic, unique
    species VARCHAR(50), -- Borg, Cardassian, Dominion, Q, Unknown, etc.
    faction VARCHAR(100),
    boss_tier INTEGER DEFAULT 1, -- 1-20 boss power tier
    health_points BIGINT DEFAULT 100000,
    shield_points BIGINT DEFAULT 50000,
    armor_rating INTEGER DEFAULT 100,
    damage_output BIGINT DEFAULT 1000,
    special_abilities JSONB DEFAULT '[]', -- Array of special attack/defense abilities
    immunities JSONB DEFAULT '[]', -- Damage types they're immune to
    resistances JSONB DEFAULT '{}', -- Partial damage resistances
    weaknesses JSONB DEFAULT '{}', -- Vulnerability to certain damage types
    behavior_pattern VARCHAR(50) DEFAULT 'aggressive', -- aggressive, defensive, tactical, chaotic
    ai_intelligence VARCHAR(20) DEFAULT 'normal', -- basic, normal, advanced, genius
    phase_mechanics JSONB DEFAULT '[]', -- Multi-phase boss mechanics
    enrage_triggers JSONB DEFAULT '[]', -- What triggers enrage mode
    loot_table JSONB DEFAULT '{}', -- Possible drops and their chances
    guaranteed_drops JSONB DEFAULT '[]', -- Always dropped items
    rare_drops JSONB DEFAULT '{}', -- Very rare possible drops
    achievement_rewards JSONB DEFAULT '[]', -- Special achievements for defeating
    respawn_conditions JSONB DEFAULT '{}', -- When/how they respawn
    minimum_fleet_size INTEGER DEFAULT 1,
    recommended_fleet_size INTEGER DEFAULT 5,
    defeat_requirements TEXT, -- Special requirements to defeat
    lore_description TEXT,
    visual_appearance JSONB DEFAULT '{}', -- Visual characteristics
    audio_cues JSONB DEFAULT '[]', -- Sound effects and music
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Universe galaxy events (active events)
CREATE TABLE universe_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name VARCHAR(200) NOT NULL,
    event_type_id UUID REFERENCES event_types(id),
    galaxy_id UUID REFERENCES galaxies(id) ON DELETE CASCADE,
    event_status VARCHAR(20) DEFAULT 'spawned', -- spawned, active, completed, failed, expired, cancelled
    event_phase VARCHAR(50) DEFAULT 'preparation', -- preparation, active, climax, resolution, aftermath
    current_phase_number INTEGER DEFAULT 1,
    total_phases INTEGER DEFAULT 1,

    -- Location and scope
    primary_location_type VARCHAR(50), -- sector, system, planet, deep_space, multi_sector
    primary_location_id UUID,
    affected_coordinates JSONB DEFAULT '[]', -- Array of coordinate ranges affected
    event_radius INTEGER DEFAULT 1, -- Sectors affected

    -- Timing
    spawned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    scheduled_start TIMESTAMP,
    estimated_duration_hours INTEGER DEFAULT 24,
    actual_duration_hours INTEGER,
    hard_deadline TIMESTAMP, -- Event force-ends at this time
    ended_at TIMESTAMP,

    -- Participation
    total_participants INTEGER DEFAULT 0,
    active_participants INTEGER DEFAULT 0,
    max_participants INTEGER DEFAULT 100,
    min_participants_required INTEGER DEFAULT 1,
    participation_restricted BOOLEAN DEFAULT false,
    restricted_to_guilds JSONB DEFAULT '[]', -- Array of guild IDs if restricted
    restricted_to_factions JSONB DEFAULT '[]', -- Array of faction names

    -- Progression and scaling
    event_progress FLOAT DEFAULT 0.0, -- 0.0 to 100.0
    difficulty_scaling FLOAT DEFAULT 1.0, -- Multiplier based on participants
    success_conditions JSONB DEFAULT '{}', -- What needs to happen to succeed
    failure_conditions JSONB DEFAULT '{}', -- What causes event failure
    current_objectives JSONB DEFAULT '[]', -- Current active objectives
    completed_objectives JSONB DEFAULT '[]', -- Already completed objectives

    -- Boss encounters
    boss_spawned BOOLEAN DEFAULT false,
    primary_boss_id UUID REFERENCES event_bosses(id),
    secondary_bosses JSONB DEFAULT '[]', -- Array of additional boss IDs
    boss_health_percentage FLOAT DEFAULT 100.0,
    boss_phase_number INTEGER DEFAULT 1,

    -- Rewards and consequences
    base_rewards JSONB DEFAULT '{}', -- Base rewards for completion
    scaled_rewards JSONB DEFAULT '{}', -- Rewards that scale with participation
    failure_penalties JSONB DEFAULT '{}', -- Penalties for failure
    participation_rewards JSONB DEFAULT '{}', -- Rewards just for participating
    mvp_rewards JSONB DEFAULT '{}', -- Extra rewards for top performers

    -- Event state and mechanics
    event_variables JSONB DEFAULT '{}', -- Custom event-specific variables
    environmental_effects JSONB DEFAULT '[]', -- Space hazards, buffs, debuffs
    special_mechanics JSONB DEFAULT '[]', -- Unique mechanics for this event
    narrative_state JSONB DEFAULT '{}', -- Story progression variables

    -- Meta information
    event_seed BIGINT, -- Random seed for procedural aspects
    is_dynamic BOOLEAN DEFAULT true, -- Whether event can change based on actions
    is_instanced BOOLEAN DEFAULT false, -- Whether each participant gets own instance
    instance_data JSONB DEFAULT '{}', -- Instance-specific data if applicable
    event_tags JSONB DEFAULT '[]', -- Tags for searching/filtering
    created_by VARCHAR(50) DEFAULT 'system', -- system, admin, gm
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event participants tracking
CREATE TABLE event_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES universe_events(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    guild_id UUID REFERENCES guilds(id), -- Optional guild participation

    -- Participation details
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    participation_status VARCHAR(20) DEFAULT 'active', -- active, inactive, eliminated, completed, withdrawn
    participation_type VARCHAR(20) DEFAULT 'individual', -- individual, guild_member, ally, mercenary
    role_in_event VARCHAR(50) DEFAULT 'participant', -- participant, leader, coordinator, support

    -- Performance tracking
    contribution_score INTEGER DEFAULT 0,
    damage_dealt BIGINT DEFAULT 0,
    damage_taken BIGINT DEFAULT 0,
    healing_provided BIGINT DEFAULT 0,
    resources_contributed JSONB DEFAULT '{}',
    objectives_completed INTEGER DEFAULT 0,
    special_actions JSONB DEFAULT '[]', -- Special actions taken during event

    -- Rewards and penalties
    base_rewards_earned JSONB DEFAULT '{}',
    bonus_rewards_earned JSONB DEFAULT '{}',
    penalties_applied JSONB DEFAULT '{}',
    achievements_unlocked JSONB DEFAULT '[]',
    experience_gained BIGINT DEFAULT 0,
    reputation_changes JSONB DEFAULT '{}',

    -- Event-specific data
    personal_objectives JSONB DEFAULT '[]', -- Individual objectives
    completed_personal_objectives JSONB DEFAULT '[]',
    event_rank INTEGER, -- Ranking among participants
    participation_percentage FLOAT DEFAULT 0.0, -- How much of event they participated in

    UNIQUE(event_id, player_id)
);

-- Event objects (items, structures, anomalies in events)
CREATE TABLE event_objects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    object_name VARCHAR(100) NOT NULL,
    object_type VARCHAR(50) NOT NULL, -- artifact, station, ship, anomaly, resource_node, portal
    object_class VARCHAR(20) DEFAULT 'standard', -- standard, rare, epic, legendary, unique
    description TEXT,
    detailed_description TEXT,

    -- Physical properties
    size_class VARCHAR(20) DEFAULT 'medium', -- tiny, small, medium, large, huge, massive
    mass_tons BIGINT DEFAULT 1000,
    energy_signature INTEGER DEFAULT 100,
    scan_difficulty INTEGER DEFAULT 1, -- How hard to detect/analyze

    -- Interaction properties
    can_be_scanned BOOLEAN DEFAULT true,
    can_be_collected BOOLEAN DEFAULT false,
    can_be_destroyed BOOLEAN DEFAULT false,
    can_be_activated BOOLEAN DEFAULT false,
    requires_special_equipment BOOLEAN DEFAULT false,
    interaction_range_km INTEGER DEFAULT 10,

    -- Game mechanics
    interaction_effects JSONB DEFAULT '{}', -- What happens when interacted with
    scan_results JSONB DEFAULT '{}', -- Information revealed when scanned
    collection_requirements JSONB DEFAULT '{}', -- Requirements to collect
    destruction_effects JSONB DEFAULT '{}', -- Effects when destroyed
    activation_requirements JSONB DEFAULT '{}', -- Requirements to activate

    -- Rewards and consequences
    interaction_rewards JSONB DEFAULT '{}',
    collection_rewards JSONB DEFAULT '{}',
    destruction_rewards JSONB DEFAULT '{}',
    activation_rewards JSONB DEFAULT '{}',
    interaction_penalties JSONB DEFAULT '{}',

    -- Spawning rules
    spawn_chance FLOAT DEFAULT 1.0, -- Chance to spawn in applicable events
    max_per_event INTEGER DEFAULT 1, -- Maximum number in single event
    spawn_conditions JSONB DEFAULT '{}', -- Conditions required to spawn
    despawn_conditions JSONB DEFAULT '{}', -- Conditions that remove the object

    -- Visual and audio
    visual_effects JSONB DEFAULT '{}',
    audio_effects JSONB DEFAULT '{}',
    icon_name VARCHAR(50),
    model_name VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Active event objects in current events
CREATE TABLE active_event_objects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES universe_events(id) ON DELETE CASCADE,
    object_id UUID REFERENCES event_objects(id),
    instance_name VARCHAR(100), -- Specific name for this instance

    -- Location in event
    coordinate_id UUID REFERENCES galactic_coordinates(id),
    relative_position JSONB DEFAULT '{}', -- Position relative to event center

    -- Current state
    current_status VARCHAR(20) DEFAULT 'active', -- active, interacted, collected, destroyed, expired
    health_percentage FLOAT DEFAULT 100.0,
    last_interaction TIMESTAMP,
    last_interacted_by UUID REFERENCES players(id),
    interaction_count INTEGER DEFAULT 0,

    -- Instance-specific properties
    instance_modifiers JSONB DEFAULT '{}', -- Modifications to base object
    spawn_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    despawn_time TIMESTAMP,

    -- Interaction history
    interaction_log JSONB DEFAULT '[]', -- Log of all interactions
    rewards_distributed JSONB DEFAULT '{}', -- Rewards already given out

    UNIQUE(event_id, object_id, instance_name)
);

-- Event missions and objectives
CREATE TABLE event_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_name VARCHAR(200) NOT NULL,
    event_type_id UUID REFERENCES event_types(id),
    mission_type VARCHAR(50) DEFAULT 'primary', -- primary, secondary, bonus, hidden, personal
    mission_category VARCHAR(50) DEFAULT 'combat', -- combat, exploration, diplomacy, rescue, research
    description TEXT,
    detailed_description TEXT,
    lore_description TEXT,

    -- Mission structure
    is_multi_stage BOOLEAN DEFAULT false,
    total_stages INTEGER DEFAULT 1,
    is_timed BOOLEAN DEFAULT false,
    time_limit_minutes INTEGER,
    is_repeatable BOOLEAN DEFAULT false,
    max_attempts INTEGER DEFAULT 1,

    -- Requirements
    required_level INTEGER DEFAULT 1,
    required_participants INTEGER DEFAULT 1,
    max_participants INTEGER DEFAULT 10,
    required_ship_types JSONB DEFAULT '[]',
    required_equipment JSONB DEFAULT '[]',
    required_technologies JSONB DEFAULT '[]',
    required_reputation JSONB DEFAULT '{}',
    prerequisite_missions JSONB DEFAULT '[]',

    -- Objectives
    primary_objectives JSONB NOT NULL, -- Array of primary objective definitions
    secondary_objectives JSONB DEFAULT '[]', -- Array of secondary objectives
    bonus_objectives JSONB DEFAULT '[]', -- Array of bonus objectives
    hidden_objectives JSONB DEFAULT '[]', -- Array of hidden objectives
    failure_conditions JSONB DEFAULT '[]', -- What causes mission failure

    -- Difficulty and scaling
    base_difficulty INTEGER DEFAULT 1, -- 1-10 base difficulty
    difficulty_scaling JSONB DEFAULT '{}', -- How difficulty scales with participants
    recommended_gear_tier INTEGER DEFAULT 1,
    recommended_fleet_composition JSONB DEFAULT '{}',

    -- Rewards
    completion_rewards JSONB DEFAULT '{}',
    stage_completion_rewards JSONB DEFAULT '{}',
    bonus_completion_rewards JSONB DEFAULT '{}',
    failure_penalties JSONB DEFAULT '{}',
    first_completion_bonus JSONB DEFAULT '{}',
    reputation_rewards JSONB DEFAULT '{}',
    achievement_rewards JSONB DEFAULT '[]',

    -- Mission mechanics
    special_rules JSONB DEFAULT '[]', -- Special rules for this mission
    environmental_hazards JSONB DEFAULT '[]', -- Environmental dangers
    available_support JSONB DEFAULT '[]', -- Support options (reinforcements, etc.)
    intel_available JSONB DEFAULT '{}', -- Intelligence briefing data

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Active event missions
CREATE TABLE active_event_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES universe_events(id) ON DELETE CASCADE,
    mission_id UUID REFERENCES event_missions(id),
    mission_instance_name VARCHAR(200),

    -- Mission state
    mission_status VARCHAR(20) DEFAULT 'available', -- available, active, completed, failed, expired
    current_stage INTEGER DEFAULT 1,
    total_stages INTEGER DEFAULT 1,

    -- Timing
    became_available_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,

    -- Participants
    assigned_participants JSONB DEFAULT '[]', -- Array of player IDs
    max_participants INTEGER DEFAULT 10,
    current_participants INTEGER DEFAULT 0,

    -- Progress tracking
    primary_objectives_completed INTEGER DEFAULT 0,
    secondary_objectives_completed INTEGER DEFAULT 0,
    bonus_objectives_completed INTEGER DEFAULT 0,
    overall_progress FLOAT DEFAULT 0.0,

    -- Instance modifications
    difficulty_modifier FLOAT DEFAULT 1.0,
    reward_modifier FLOAT DEFAULT 1.0,
    instance_variables JSONB DEFAULT '{}',

    -- Objectives state
    objective_states JSONB DEFAULT '{}', -- Current state of each objective
    completed_objectives JSONB DEFAULT '[]',
    failed_objectives JSONB DEFAULT '[]',

    UNIQUE(event_id, mission_id, mission_instance_name)
);

-- Player mission progress
CREATE TABLE player_mission_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    active_mission_id UUID REFERENCES active_event_missions(id) ON DELETE CASCADE,

    -- Progress tracking
    mission_status VARCHAR(20) DEFAULT 'active', -- active, completed, failed, abandoned
    current_stage INTEGER DEFAULT 1,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_progress_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,

    -- Objective progress
    primary_objectives_progress JSONB DEFAULT '{}',
    secondary_objectives_progress JSONB DEFAULT '{}',
    bonus_objectives_progress JSONB DEFAULT '{}',
    personal_objectives_progress JSONB DEFAULT '{}',

    -- Performance metrics
    completion_time_minutes INTEGER,
    efficiency_rating FLOAT, -- 0.0-1.0 based on performance
    difficulty_completed VARCHAR(20), -- easy, normal, hard, elite
    deaths_during_mission INTEGER DEFAULT 0,
    resources_consumed JSONB DEFAULT '{}',

    -- Rewards received
    rewards_received JSONB DEFAULT '{}',
    bonus_rewards_received JSONB DEFAULT '{}',
    penalties_applied JSONB DEFAULT '{}',

    UNIQUE(player_id, active_mission_id)
);

-- Event system configuration
CREATE TABLE event_system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    is_global BOOLEAN DEFAULT true,
    galaxy_id UUID REFERENCES galaxies(id), -- NULL for global config
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event occurrence schedule
CREATE TABLE event_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type_id UUID REFERENCES event_types(id),
    galaxy_id UUID REFERENCES galaxies(id),
    schedule_name VARCHAR(100) NOT NULL,

    -- Scheduling rules
    schedule_type VARCHAR(20) DEFAULT 'fixed', -- fixed, random, player_triggered, conditional
    frequency VARCHAR(20) DEFAULT 'weekly', -- hourly, daily, weekly, monthly, seasonal, once
    cron_expression VARCHAR(100), -- For complex scheduling

    -- Timing parameters
    earliest_spawn_time TIME,
    latest_spawn_time TIME,
    preferred_spawn_days JSONB DEFAULT '[]', -- Array of day numbers (0=Sunday)
    cooldown_hours INTEGER DEFAULT 168, -- Hours between spawns

    -- Spawn conditions
    spawn_conditions JSONB DEFAULT '{}', -- Conditions required for spawning
    population_requirements JSONB DEFAULT '{}', -- Galaxy population requirements
    activity_requirements JSONB DEFAULT '{}', -- Player activity requirements
    seasonal_restrictions JSONB DEFAULT '[]', -- Time of year restrictions

    -- Event parameters
    duration_override_hours INTEGER, -- Override default duration
    difficulty_override FLOAT, -- Override default difficulty
    reward_multiplier FLOAT DEFAULT 1.0,

    -- Status
    is_active BOOLEAN DEFAULT true,
    last_spawned TIMESTAMP,
    next_scheduled_spawn TIMESTAMP,
    total_spawns INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- EVENT SYSTEM INDICES
-- =====================================================

-- Event categories and types
CREATE INDEX idx_event_categories_active ON event_categories(is_active);
CREATE INDEX idx_event_types_category ON event_types(category_id);
CREATE INDEX idx_event_types_class ON event_types(event_class);
CREATE INDEX idx_event_types_difficulty ON event_types(difficulty_tier);

-- Event bosses
CREATE INDEX idx_event_bosses_class ON event_bosses(boss_class);
CREATE INDEX idx_event_bosses_tier ON event_bosses(boss_tier);
CREATE INDEX idx_event_bosses_species ON event_bosses(species);
CREATE INDEX idx_event_bosses_faction ON event_bosses(faction);

-- Universe events
CREATE INDEX idx_universe_events_type ON universe_events(event_type_id);
CREATE INDEX idx_universe_events_galaxy ON universe_events(galaxy_id);
CREATE INDEX idx_universe_events_status ON universe_events(event_status);
CREATE INDEX idx_universe_events_phase ON universe_events(event_phase);
CREATE INDEX idx_universe_events_location ON universe_events(primary_location_type, primary_location_id);
CREATE INDEX idx_universe_events_timing ON universe_events(spawned_at, ended_at);
CREATE INDEX idx_universe_events_active ON universe_events(event_status, spawned_at) WHERE event_status IN ('spawned', 'active');

-- Event participants
CREATE INDEX idx_event_participants_event ON event_participants(event_id);
CREATE INDEX idx_event_participants_player ON event_participants(player_id);
CREATE INDEX idx_event_participants_guild ON event_participants(guild_id);
CREATE INDEX idx_event_participants_status ON event_participants(participation_status);
CREATE INDEX idx_event_participants_score ON event_participants(contribution_score DESC);

-- Event objects
CREATE INDEX idx_event_objects_type ON event_objects(object_type);
CREATE INDEX idx_event_objects_class ON event_objects(object_class);
CREATE INDEX idx_active_event_objects_event ON active_event_objects(event_id);
CREATE INDEX idx_active_event_objects_status ON active_event_objects(current_status);
CREATE INDEX idx_active_event_objects_coordinate ON active_event_objects(coordinate_id);

-- Event missions
CREATE INDEX idx_event_missions_type ON event_missions(event_type_id);
CREATE INDEX idx_event_missions_category ON event_missions(mission_category);
CREATE INDEX idx_event_missions_difficulty ON event_missions(base_difficulty);
CREATE INDEX idx_active_event_missions_event ON active_event_missions(event_id);
CREATE INDEX idx_active_event_missions_status ON active_event_missions(mission_status);
CREATE INDEX idx_player_mission_progress_player ON player_mission_progress(player_id);
CREATE INDEX idx_player_mission_progress_mission ON player_mission_progress(active_mission_id);

-- Event system
CREATE INDEX idx_event_system_config_key ON event_system_config(config_key);
CREATE INDEX idx_event_system_config_galaxy ON event_system_config(galaxy_id);
CREATE INDEX idx_event_schedule_type ON event_schedule(event_type_id);
CREATE INDEX idx_event_schedule_galaxy ON event_schedule(galaxy_id);
CREATE INDEX idx_event_schedule_active ON event_schedule(is_active);
CREATE INDEX idx_event_schedule_next_spawn ON event_schedule(next_scheduled_spawn) WHERE is_active = true;
CREATE INDEX idx_orbital_platforms_owner ON orbital_defense_platforms(owner_id);
CREATE INDEX idx_orbital_platforms_type ON orbital_defense_platforms(platform_type);
CREATE INDEX idx_orbital_platforms_status ON orbital_defense_platforms(status);

CREATE INDEX idx_travel_routes_galaxy ON travel_routes(galaxy_id);
CREATE INDEX idx_travel_routes_start ON travel_routes(start_coordinate_id);
CREATE INDEX idx_travel_routes_end ON travel_routes(end_coordinate_id);
CREATE INDEX idx_travel_routes_type ON travel_routes(route_type);

CREATE INDEX idx_ship_travel_logs_ship ON ship_travel_logs(ship_id);
CREATE INDEX idx_ship_travel_logs_route ON ship_travel_logs(travel_route_id);
CREATE INDEX idx_ship_travel_logs_status ON ship_travel_logs(status);

CREATE INDEX idx_ftl_restrictions_galaxy ON ftl_restrictions(galaxy_id);
CREATE INDEX idx_ftl_restrictions_coordinate ON ftl_restrictions(coordinate_id);
CREATE INDEX idx_ftl_restrictions_type ON ftl_restrictions(restriction_type);

-- Guild system indices
CREATE INDEX idx_guilds_name ON guilds(name);
CREATE INDEX idx_guilds_tag ON guilds(tag);
CREATE INDEX idx_guilds_leader ON guilds(leader_id);
CREATE INDEX idx_guilds_founder ON guilds(founder_id);
CREATE INDEX idx_guilds_type ON guilds(guild_type);
CREATE INDEX idx_guilds_npc ON guilds(is_npc_guild);
CREATE INDEX idx_guilds_recruitment ON guilds(is_open_recruitment);
CREATE INDEX idx_guilds_activity ON guilds(last_activity);

CREATE INDEX idx_guild_ranks_guild ON guild_ranks(guild_id);
CREATE INDEX idx_guild_ranks_level ON guild_ranks(rank_level);
CREATE INDEX idx_guild_ranks_name ON guild_ranks(guild_id, rank_name);

CREATE INDEX idx_guild_members_guild ON guild_members(guild_id);
CREATE INDEX idx_guild_members_player ON guild_members(player_id);
CREATE INDEX idx_guild_members_rank ON guild_members(rank_id);
CREATE INDEX idx_guild_members_status ON guild_members(member_status);
CREATE INDEX idx_guild_members_joined ON guild_members(joined_at);
CREATE INDEX idx_guild_members_online ON guild_members(last_online);

CREATE INDEX idx_guild_alliances_from ON guild_alliances(guild_from_id);
CREATE INDEX idx_guild_alliances_to ON guild_alliances(guild_to_id);
CREATE INDEX idx_guild_alliances_type ON guild_alliances(alliance_type);
CREATE INDEX idx_guild_alliances_established ON guild_alliances(established_at);

CREATE INDEX idx_guild_wars_attacking ON guild_wars(attacking_guild_id);
CREATE INDEX idx_guild_wars_defending ON guild_wars(defending_guild_id);
CREATE INDEX idx_guild_wars_status ON guild_wars(war_status);
CREATE INDEX idx_guild_wars_declared ON guild_wars(declared_at);

CREATE INDEX idx_guild_applications_guild ON guild_applications(guild_id);
CREATE INDEX idx_guild_applications_player ON guild_applications(player_id);
CREATE INDEX idx_guild_applications_status ON guild_applications(status);
CREATE INDEX idx_guild_applications_applied ON guild_applications(applied_at);

CREATE INDEX idx_guild_events_guild ON guild_events(guild_id);
CREATE INDEX idx_guild_events_organizer ON guild_events(organizer_id);
CREATE INDEX idx_guild_events_scheduled ON guild_events(scheduled_at);
CREATE INDEX idx_guild_events_type ON guild_events(event_type);
CREATE INDEX idx_guild_events_status ON guild_events(status);

CREATE INDEX idx_guild_event_participants_event ON guild_event_participants(event_id);
CREATE INDEX idx_guild_event_participants_player ON guild_event_participants(player_id);
CREATE INDEX idx_guild_event_participants_status ON guild_event_participants(participation_status);

CREATE INDEX idx_guild_territories_guild ON guild_territories(guild_id);
CREATE INDEX idx_guild_territories_coordinate ON guild_territories(coordinate_id);
CREATE INDEX idx_guild_territories_type ON guild_territories(territory_type);
CREATE INDEX idx_guild_territories_contested ON guild_territories(is_contested);

CREATE INDEX idx_guild_messages_guild ON guild_messages(guild_id);
CREATE INDEX idx_guild_messages_sender ON guild_messages(sender_id);
CREATE INDEX idx_guild_messages_type ON guild_messages(message_type);
CREATE INDEX idx_guild_messages_sent ON guild_messages(sent_at);
CREATE INDEX idx_guild_messages_pinned ON guild_messages(is_pinned);

CREATE INDEX idx_npc_guilds_guild ON npc_guilds(guild_id);
CREATE INDEX idx_npc_guilds_personality ON npc_guilds(ai_personality);
CREATE INDEX idx_npc_guilds_difficulty ON npc_guilds(ai_difficulty);
CREATE INDEX idx_npc_guilds_last_action ON npc_guilds(last_ai_action);

-- Talent and Research system indices
CREATE INDEX idx_professions_code ON professions(profession_code);
CREATE INDEX idx_professions_active ON professions(is_active);

CREATE INDEX idx_talent_trees_profession ON talent_trees(profession_id);
CREATE INDEX idx_talent_trees_type ON talent_trees(tree_type);
CREATE INDEX idx_talent_trees_active ON talent_trees(is_active);

CREATE INDEX idx_talent_nodes_tree ON talent_nodes(talent_tree_id);
CREATE INDEX idx_talent_nodes_tier ON talent_nodes(tier_level);
CREATE INDEX idx_talent_nodes_position ON talent_nodes(position_x, position_y);
CREATE INDEX idx_talent_nodes_type ON talent_nodes(node_type);
CREATE INDEX idx_talent_nodes_capstone ON talent_nodes(is_capstone);

CREATE INDEX idx_player_talents_player ON player_talents(player_id);
CREATE INDEX idx_player_talents_profession ON player_talents(profession_id);
CREATE INDEX idx_player_talents_node ON player_talents(talent_node_id);
CREATE INDEX idx_player_talents_rank ON player_talents(current_rank);

CREATE INDEX idx_player_professions_player ON player_professions(player_id);
CREATE INDEX idx_player_professions_profession ON player_professions(profession_id);
CREATE INDEX idx_player_professions_primary ON player_professions(is_primary_profession);
CREATE INDEX idx_player_professions_level ON player_professions(profession_level);

CREATE INDEX idx_research_categories_code ON research_categories(category_code);
CREATE INDEX idx_research_categories_profession ON research_categories(required_profession_id);
CREATE INDEX idx_research_categories_active ON research_categories(is_active);

CREATE INDEX idx_research_projects_category ON research_projects(category_id);
CREATE INDEX idx_research_projects_type ON research_projects(project_type);
CREATE INDEX idx_research_projects_tier ON research_projects(tier_level);
CREATE INDEX idx_research_projects_repeatable ON research_projects(is_repeatable);
CREATE INDEX idx_research_projects_rarity ON research_projects(rarity);

CREATE INDEX idx_player_research_player ON player_research(player_id);
CREATE INDEX idx_player_research_project ON player_research(project_id);
CREATE INDEX idx_player_research_status ON player_research(status);
CREATE INDEX idx_player_research_completion ON player_research(estimated_completion);

CREATE INDEX idx_technology_categories_era ON technology_categories(era);
CREATE INDEX idx_technology_categories_faction ON technology_categories(faction);

CREATE INDEX idx_technology_tree_category ON technology_tree(category_id);
CREATE INDEX idx_technology_tree_type ON technology_tree(tech_type);
CREATE INDEX idx_technology_tree_tier ON technology_tree(tier_level);
CREATE INDEX idx_technology_tree_era ON technology_tree(era);
CREATE INDEX idx_technology_tree_faction ON technology_tree(faction);
CREATE INDEX idx_technology_tree_classified ON technology_tree(is_classified);

CREATE INDEX idx_player_technologies_player ON player_technologies(player_id);
CREATE INDEX idx_player_technologies_tech ON player_technologies(technology_id);
CREATE INDEX idx_player_technologies_unlocked ON player_technologies(unlocked_at);

CREATE INDEX idx_crafting_stations_type ON crafting_stations(station_type);
CREATE INDEX idx_crafting_stations_location ON crafting_stations(location_type);

CREATE INDEX idx_player_crafting_stations_player ON player_crafting_stations(player_id);
CREATE INDEX idx_player_crafting_stations_station ON player_crafting_stations(station_id);
CREATE INDEX idx_player_crafting_stations_location ON player_crafting_stations(location_type, location_id);
CREATE INDEX idx_player_crafting_stations_active ON player_crafting_stations(is_active);

CREATE INDEX idx_active_projects_player ON active_projects(player_id);
CREATE INDEX idx_active_projects_type ON active_projects(project_type);
CREATE INDEX idx_active_projects_status ON active_projects(status);
CREATE INDEX idx_active_projects_completion ON active_projects(estimated_completion);

-- Leveling and crafting system indices
CREATE INDEX idx_level_progression_category ON level_progression(level_category);
CREATE INDEX idx_level_progression_tier ON level_progression(level_tier);

CREATE INDEX idx_player_levels_player ON player_levels(player_id);
CREATE INDEX idx_player_levels_type ON player_levels(level_type);
CREATE INDEX idx_player_levels_level ON player_levels(current_level);
CREATE INDEX idx_player_levels_experience ON player_levels(current_experience);

CREATE INDEX idx_crafting_disciplines_code ON crafting_disciplines(discipline_code);
CREATE INDEX idx_crafting_disciplines_profession ON crafting_disciplines(required_profession_id);
CREATE INDEX idx_crafting_disciplines_active ON crafting_disciplines(is_active);

CREATE INDEX idx_player_crafting_levels_player ON player_crafting_levels(player_id);
CREATE INDEX idx_player_crafting_levels_discipline ON player_crafting_levels(discipline_id);
CREATE INDEX idx_player_crafting_levels_level ON player_crafting_levels(current_level);
CREATE INDEX idx_player_crafting_levels_tempering ON player_crafting_levels(tempering_level);
CREATE INDEX idx_player_crafting_levels_masterwork ON player_crafting_levels(masterwork_level);

CREATE INDEX idx_crafting_recipes_discipline ON crafting_recipes(discipline_id);
CREATE INDEX idx_crafting_recipes_category ON crafting_recipes(item_category);
CREATE INDEX idx_crafting_recipes_tier ON crafting_recipes(recipe_tier);
CREATE INDEX idx_crafting_recipes_level ON crafting_recipes(min_crafting_level);
CREATE INDEX idx_crafting_recipes_secret ON crafting_recipes(is_secret);

CREATE INDEX idx_crafted_items_recipe ON crafted_items(recipe_id);
CREATE INDEX idx_crafted_items_crafter ON crafted_items(crafter_id);
CREATE INDEX idx_crafted_items_owner ON crafted_items(owner_id);
CREATE INDEX idx_crafted_items_category ON crafted_items(item_category);
CREATE INDEX idx_crafted_items_quality ON crafted_items(quality);
CREATE INDEX idx_crafted_items_location ON crafted_items(location_type, location_id);
CREATE INDEX idx_crafted_items_level ON crafted_items(item_level);
CREATE INDEX idx_crafted_items_tempering ON crafted_items(tempering_level);

CREATE INDEX idx_item_enhancement_log_item ON item_enhancement_log(item_id);
CREATE INDEX idx_item_enhancement_log_enhancer ON item_enhancement_log(enhanced_by);
CREATE INDEX idx_item_enhancement_log_type ON item_enhancement_log(enhancement_type);
CREATE INDEX idx_item_enhancement_log_date ON item_enhancement_log(enhancement_date);

CREATE INDEX idx_building_types_category ON building_types(building_category);
CREATE INDEX idx_building_types_size ON building_types(building_size);

CREATE INDEX idx_player_buildings_type ON player_buildings(building_type_id);
CREATE INDEX idx_player_buildings_owner ON player_buildings(owner_id);
CREATE INDEX idx_player_buildings_location ON player_buildings(location_type, location_id);
CREATE INDEX idx_player_buildings_coordinate ON player_buildings(coordinate_id);
CREATE INDEX idx_player_buildings_status ON player_buildings(operational_status);

-- =====================================================
-- TRIGGERS FOR DATA CONSISTENCY
-- =====================================================

-- Update timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_player_profiles_updated_at BEFORE UPDATE ON player_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_player_stats_updated_at BEFORE UPDATE ON player_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_player_resources_updated_at BEFORE UPDATE ON player_resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INITIAL DATA SETUP
-- =====================================================

-- Insert default resource types
INSERT INTO resource_types (id, name, description, category, rarity, base_value) VALUES
(uuid_generate_v4(), 'Energy Credits', 'Universal currency of the Federation', 'currency', 'common', 1),
(uuid_generate_v4(), 'Dilithium', 'Essential for warp core operation', 'energy', 'rare', 100),
(uuid_generate_v4(), 'Duranium', 'Primary starship hull material', 'material', 'common', 5),
(uuid_generate_v4(), 'Tritanium', 'Advanced hull reinforcement', 'material', 'uncommon', 15),
(uuid_generate_v4(), 'Latinum', 'Precious trading commodity', 'currency', 'rare', 500),
(uuid_generate_v4(), 'Quantum Resonators', 'Advanced technology components', 'technology', 'epic', 1000),
(uuid_generate_v4(), 'Biomass', 'Organic material for life support', 'material', 'common', 2),
(uuid_generate_v4(), 'Plasma', 'Weapon and power system fuel', 'energy', 'uncommon', 25),
(uuid_generate_v4(), 'Isolinear Chips', 'Computer core components', 'technology', 'uncommon', 50),
(uuid_generate_v4(), 'Antimatter', 'High-energy fuel source', 'energy', 'rare', 200);

-- Insert default cron jobs
INSERT INTO cron_jobs (job_name, job_type, cron_expression, description) VALUES
('process_game_turns', 'turn_processing', '*/30 * * * *', 'Process game turns every 30 minutes'),
('generate_resources', 'resource_generation', '*/5 * * * *', 'Generate resources from deposits every 5 minutes'),
('update_ship_movements', 'ship_movement', '*/1 * * * *', 'Update ship travel progress every minute'),
('process_research', 'research_processing', '*/10 * * * *', 'Update research progress every 10 minutes'),
('execute_trade_orders', 'trade_processing', '*/2 * * * *', 'Match and execute trade orders every 2 minutes'),
('cleanup_expired_data', 'cleanup', '0 2 * * *', 'Clean up expired messages and events daily at 2 AM'),
('calculate_player_stats', 'statistics', '0 1 * * *', 'Update player statistics daily at 1 AM'),
('backup_game_state', 'backup', '0 4 * * 0', 'Create weekly game state backup on Sundays at 4 AM');

-- Create default galaxy
INSERT INTO galaxies (name, description, max_players, turn_duration_minutes) VALUES
('Milky Way Alpha', 'Primary galaxy for new players and exploration', 2000, 30);

-- Create default NPC guilds for the galaxy
DO $$
DECLARE
    default_galaxy_id UUID;
    starfleet_guild_id UUID;
    klingon_guild_id UUID;
    romulan_guild_id UUID;
    cardassian_guild_id UUID;
    ferengi_guild_id UUID;
BEGIN
    -- Get the default galaxy ID
    SELECT id INTO default_galaxy_id FROM galaxies WHERE name = 'Milky Way Alpha';

    -- Create Starfleet Command
    starfleet_guild_id := uuid_generate_v4();
    INSERT INTO guilds (
        id, name, tag, description, guild_type, organization_level,
        is_npc_guild, max_members, guild_wealth, guild_influence, guild_reputation,
        pvp_enabled, war_declarations_allowed, diplomacy_enabled,
        guild_motto, founded_at
    ) VALUES (
        starfleet_guild_id, 'Starfleet Command', 'SFC',
        'The peacekeeping and exploration force of the United Federation of Planets',
        'military', 'federation', true, 10000, 1000000, 950, 900,
        true, true, true,
        'To boldly go where no one has gone before', CURRENT_TIMESTAMP
    );

    -- Create Klingon Defense Force
    klingon_guild_id := uuid_generate_v4();
    INSERT INTO guilds (
        id, name, tag, description, guild_type, organization_level,
        is_npc_guild, max_members, guild_wealth, guild_influence, guild_reputation,
        pvp_enabled, war_declarations_allowed, diplomacy_enabled,
        guild_motto, founded_at
    ) VALUES (
        klingon_guild_id, 'Klingon Defense Force', 'KDF',
        'The mighty military arm of the Klingon Empire',
        'military', 'empire', true, 8000, 800000, 850, 700,
        true, true, true,
        'Today is a good day to die', CURRENT_TIMESTAMP
    );

    -- Create Romulan Star Empire
    romulan_guild_id := uuid_generate_v4();
    INSERT INTO guilds (
        id, name, tag, description, guild_type, organization_level,
        is_npc_guild, max_members, guild_wealth, guild_influence, guild_reputation,
        pvp_enabled, war_declarations_allowed, diplomacy_enabled,
        guild_motto, founded_at
    ) VALUES (
        romulan_guild_id, 'Romulan Star Empire', 'RSE',
        'The secretive and powerful Romulan military intelligence',
        'military', 'empire', true, 6000, 900000, 800, 600,
        true, true, true,
        'Victory through strength and cunning', CURRENT_TIMESTAMP
    );

    -- Create Cardassian Union
    cardassian_guild_id := uuid_generate_v4();
    INSERT INTO guilds (
        id, name, tag, description, guild_type, organization_level,
        is_npc_guild, max_members, guild_wealth, guild_influence, guild_reputation,
        pvp_enabled, war_declarations_allowed, diplomacy_enabled,
        guild_motto, founded_at
    ) VALUES (
        cardassian_guild_id, 'Cardassian Union', 'CU',
        'The militaristic government of the Cardassian people',
        'military', 'alliance', true, 5000, 600000, 700, 500,
        true, true, true,
        'Order through discipline', CURRENT_TIMESTAMP
    );

    -- Create Ferengi Trade Consortium
    ferengi_guild_id := uuid_generate_v4();
    INSERT INTO guilds (
        id, name, tag, description, guild_type, organization_level,
        is_npc_guild, max_members, guild_wealth, guild_influence, guild_reputation,
        pvp_enabled, war_declarations_allowed, diplomacy_enabled,
        guild_motto, founded_at
    ) VALUES (
        ferengi_guild_id, 'Ferengi Trade Consortium', 'FTC',
        'The premier trading organization in the galaxy',
        'trade', 'alliance', true, 4000, 2000000, 750, 400,
        false, false, true,
        'Profit is the highest virtue', CURRENT_TIMESTAMP
    );

    -- Create NPC guild entries
    INSERT INTO npc_guilds (guild_id, ai_personality, ai_difficulty, diplomatic_stance, technology_focus, npc_leader_name, npc_leader_title) VALUES
    (starfleet_guild_id, 'peaceful', 'normal', 'friendly', 'scientific', 'Admiral Jean-Luc Picard', 'Fleet Admiral'),
    (klingon_guild_id, 'aggressive', 'hard', 'aggressive', 'military', 'General Martok', 'Supreme Chancellor'),
    (romulan_guild_id, 'balanced', 'hard', 'neutral', 'military', 'Praetor Shinzon', 'Praetor'),
    (cardassian_guild_id, 'aggressive', 'normal', 'aggressive', 'military', 'Gul Dukat', 'Legate'),
    (ferengi_guild_id, 'economic', 'easy', 'mercantile', 'economic', 'Grand Nagus Zek', 'Grand Nagus');

    -- Create default rank structures for each guild
    -- Starfleet ranks
    INSERT INTO guild_ranks (guild_id, rank_name, rank_level, rank_color, is_officer_rank, is_leader_rank,
                           can_invite_members, can_kick_members, can_promote_members, can_demote_members,
                           can_edit_guild_info, can_manage_treasury, can_declare_war, can_form_alliances) VALUES
    (starfleet_guild_id, 'Cadet', 1, '#CCCCCC', false, false, false, false, false, false, false, false, false, false),
    (starfleet_guild_id, 'Ensign', 2, '#FFFF00', false, false, false, false, false, false, false, false, false, false),
    (starfleet_guild_id, 'Lieutenant', 3, '#FFAA00', false, false, true, false, false, false, false, false, false, false),
    (starfleet_guild_id, 'Lt. Commander', 4, '#FF6600', true, false, true, true, false, false, false, false, false, false),
    (starfleet_guild_id, 'Commander', 5, '#FF3300', true, false, true, true, true, true, false, false, false, false),
    (starfleet_guild_id, 'Captain', 6, '#FF0000', true, false, true, true, true, true, true, true, false, false),
    (starfleet_guild_id, 'Admiral', 7, '#AA0000', true, true, true, true, true, true, true, true, true, true);

    -- Klingon ranks
    INSERT INTO guild_ranks (guild_id, rank_name, rank_level, rank_color, is_officer_rank, is_leader_rank,
                           can_invite_members, can_kick_members, can_promote_members, can_demote_members,
                           can_edit_guild_info, can_manage_treasury, can_declare_war, can_form_alliances) VALUES
    (klingon_guild_id, 'Warrior', 1, '#8B4513', false, false, false, false, false, false, false, false, false, false),
    (klingon_guild_id, 'Sergeant', 2, '#A0522D', false, false, true, false, false, false, false, false, false, false),
    (klingon_guild_id, 'Lieutenant', 3, '#CD853F', true, false, true, true, false, false, false, false, false, false),
    (klingon_guild_id, 'Captain', 4, '#DEB887', true, false, true, true, true, true, false, false, false, false),
    (klingon_guild_id, 'Major', 5, '#D2691E', true, false, true, true, true, true, true, true, false, false),
    (klingon_guild_id, 'General', 6, '#8B0000', true, true, true, true, true, true, true, true, true, true);
END $$;

-- Insert Level Progression Data (1-925)
DO $$
DECLARE
    current_level INTEGER;
    base_exp BIGINT := 100;
    exp_multiplier FLOAT := 1.15;
    total_exp BIGINT := 0;
    level_exp BIGINT;
    skill_points INTEGER;
    talent_points INTEGER;
    tier_name VARCHAR(20);
BEGIN
    FOR current_level IN 1..925 LOOP
        -- Calculate experience required for this level
        level_exp := FLOOR(base_exp * POWER(exp_multiplier, current_level - 1));
        total_exp := total_exp + CASE WHEN current_level = 1 THEN 0 ELSE level_exp END;

        -- Determine skill and talent points
        skill_points := CASE
            WHEN current_level <= 50 THEN 1
            WHEN current_level <= 100 THEN 2
            WHEN current_level <= 200 THEN 3
            WHEN current_level <= 400 THEN 4
            ELSE 5
        END;

        talent_points := CASE
            WHEN current_level % 5 = 0 THEN 1
            WHEN current_level % 25 = 0 THEN 2
            WHEN current_level % 100 = 0 THEN 5
            ELSE 0
        END;

        -- Determine tier
        tier_name := CASE
            WHEN current_level <= 100 THEN 'normal'
            WHEN current_level <= 200 THEN 'veteran'
            WHEN current_level <= 400 THEN 'expert'
            WHEN current_level <= 700 THEN 'master'
            ELSE 'grandmaster'
        END;

        INSERT INTO level_progression (
            level, experience_required, experience_total, skill_points_gained,
            talent_points_gained, level_category, level_tier
        ) VALUES (
            current_level, level_exp, total_exp, skill_points, talent_points, 'character', tier_name
        );
    END LOOP;

    -- Insert crafting level progression (1-725)
    total_exp := 0;
    FOR current_level IN 1..725 LOOP
        level_exp := FLOOR(base_exp * 0.8 * POWER(1.12, current_level - 1));
        total_exp := total_exp + CASE WHEN current_level = 1 THEN 0 ELSE level_exp END;

        tier_name := CASE
            WHEN current_level <= 75 THEN 'apprentice'
            WHEN current_level <= 150 THEN 'journeyman'
            WHEN current_level <= 300 THEN 'artisan'
            WHEN current_level <= 500 THEN 'expert'
            ELSE 'master'
        END;

        INSERT INTO level_progression (
            level, experience_required, experience_total, skill_points_gained,
            talent_points_gained, level_category, level_tier
        ) VALUES (
            current_level, level_exp, total_exp, 0, 0, 'crafting', tier_name
        );
    END LOOP;
END $$;

-- Insert Tempering Levels (0-10)
INSERT INTO tempering_levels (level, level_name, success_rate, destruction_rate, downgrade_rate, materials_required, stat_bonus_percentage, min_crafter_level) VALUES
(0, 'Untempered', 1.0, 0.0, 0.0, '{}', 0.0, 1),
(1, 'Basic Enhancement', 0.95, 0.0, 0.05, '{"duranium": 5, "energy_credits": 100}', 0.05, 25),
(2, 'Refined Enhancement', 0.90, 0.0, 0.10, '{"duranium": 10, "tritanium": 5, "energy_credits": 250}', 0.10, 50),
(3, 'Advanced Enhancement', 0.85, 0.05, 0.10, '{"tritanium": 10, "quantum_resonators": 2, "energy_credits": 500}', 0.15, 100),
(4, 'Superior Enhancement', 0.80, 0.10, 0.10, '{"quantum_resonators": 5, "latinum": 1, "energy_credits": 1000}', 0.20, 150),
(5, 'Exceptional Enhancement', 0.75, 0.15, 0.10, '{"quantum_resonators": 10, "latinum": 2, "antimatter": 1, "energy_credits": 2000}', 0.25, 200),
(6, 'Masterwork Enhancement', 0.70, 0.20, 0.10, '{"latinum": 5, "antimatter": 2, "isolinear_chips": 5, "energy_credits": 4000}', 0.30, 300),
(7, 'Legendary Enhancement', 0.65, 0.25, 0.10, '{"antimatter": 5, "isolinear_chips": 10, "biomass": 15, "energy_credits": 8000}', 0.35, 400),
(8, 'Epic Enhancement', 0.60, 0.30, 0.10, '{"isolinear_chips": 20, "biomass": 25, "plasma": 10, "energy_credits": 15000}', 0.40, 500),
(9, 'Transcendent Enhancement', 0.55, 0.35, 0.10, '{"biomass": 50, "plasma": 20, "rare_materials": 10, "energy_credits": 30000}', 0.45, 650),
(10, 'Godlike Enhancement', 0.50, 0.40, 0.10, '{"plasma": 50, "rare_materials": 25, "exotic_matter": 5, "energy_credits": 60000}', 0.50, 725);

-- Insert Masterwork Tiers (1-5)
INSERT INTO masterwork_tiers (tier, tier_name, required_masterwork_level, creation_chance, bonus_stats, special_properties, tier_color) VALUES
(1, 'Fine Craftsmanship', 25, 0.15, '{"all_stats": 0.05, "durability": 0.10}', '["improved_efficiency"]', 'green'),
(2, 'Superior Craftsmanship', 50, 0.10, '{"all_stats": 0.10, "durability": 0.20, "critical_chance": 0.02}', '["improved_efficiency", "enhanced_performance"]', 'blue'),
(3, 'Exceptional Craftsmanship', 100, 0.05, '{"all_stats": 0.15, "durability": 0.30, "critical_chance": 0.05}', '["improved_efficiency", "enhanced_performance", "special_effects"]', 'purple'),
(4, 'Legendary Craftsmanship', 150, 0.02, '{"all_stats": 0.20, "durability": 0.50, "critical_chance": 0.10}', '["improved_efficiency", "enhanced_performance", "special_effects", "unique_abilities"]', 'orange'),
(5, 'Artifact Quality', 175, 0.01, '{"all_stats": 0.30, "durability": 1.00, "critical_chance": 0.15}', '["improved_efficiency", "enhanced_performance", "special_effects", "unique_abilities", "legendary_powers"]', 'red');

-- Insert Star Trek Professions
INSERT INTO professions (profession_name, profession_code, description, primary_attribute, icon_name, color_scheme, max_talent_points) VALUES
('Engineering', 'ENG', 'Masters of starship systems, construction, and technological innovation', 'intelligence', 'cog', 'yellow', 150),
('Science', 'SCI', 'Researchers, analysts, and explorers of the unknown', 'intelligence', 'microscope', 'blue', 150),
('Medical', 'MED', 'Healers and biological experts dedicated to preserving life', 'wisdom', 'heart-pulse', 'cyan', 120),
('Tactical', 'TAC', 'Combat specialists and strategic warfare experts', 'strength', 'sword', 'red', 130),
('Command', 'CMD', 'Leaders who coordinate crews and make critical decisions', 'charisma', 'crown', 'gold', 140),
('Security', 'SEC', 'Protectors and law enforcement specialists', 'dexterity', 'shield', 'orange', 125),
('Diplomatic', 'DIP', 'Negotiators and cultural liaison experts', 'charisma', 'handshake', 'purple', 110),
('Operations', 'OPS', 'Logistics and resource management specialists', 'intelligence', 'settings', 'green', 135);

-- Insert Research Categories
INSERT INTO research_categories (category_name, category_code, description, icon_name, color_scheme, required_profession_id)
SELECT
    category_name, category_code, description, icon_name, color_scheme,
    (SELECT id FROM professions WHERE profession_code = req_prof)
FROM (VALUES
    ('Starship Engineering', 'SHIP_ENG', 'Advanced starship systems and propulsion', 'rocket', 'yellow', 'ENG'),
    ('Weapons Technology', 'WEAPONS', 'Phaser arrays, torpedoes, and defensive systems', 'zap', 'red', 'TAC'),
    ('Medical Research', 'MEDICAL', 'Biotechnology and advanced medical procedures', 'heart-pulse', 'cyan', 'MED'),
    ('Physics Research', 'PHYSICS', 'Theoretical and applied physics discoveries', 'atom', 'blue', 'SCI'),
    ('Computer Sciences', 'COMP_SCI', 'AI, data processing, and cybernetics', 'cpu', 'green', 'SCI'),
    ('Materials Science', 'MATERIALS', 'Advanced alloys and construction materials', 'layers', 'orange', 'ENG'),
    ('Subspace Technology', 'SUBSPACE', 'FTL communication and detection systems', 'radio', 'purple', 'SCI'),
    ('Tactical Systems', 'TACTICAL', 'Combat strategies and battlefield coordination', 'target', 'red', 'TAC')
) AS t(category_name, category_code, description, icon_name, color_scheme, req_prof);

-- Insert Technology Categories
INSERT INTO technology_categories (category_name, description, icon_name, color_scheme, era, faction) VALUES
('Starship Propulsion', 'Warp cores, impulse engines, and exotic propulsion', 'rocket', 'yellow', '24th_century', 'United Federation of Planets'),
('Defensive Systems', 'Shields, armor, and protective technologies', 'shield', 'blue', '24th_century', 'United Federation of Planets'),
('Weapon Systems', 'Phasers, photon torpedoes, and exotic weapons', 'zap', 'red', '24th_century', 'United Federation of Planets'),
('Sensor Technology', 'Long-range sensors, tricorders, and detection arrays', 'radar', 'green', '24th_century', 'United Federation of Planets'),
('Computer Systems', 'LCARS, AI, and data processing technologies', 'cpu', 'cyan', '24th_century', 'United Federation of Planets'),
('Medical Technology', 'Medical tricorders, surgical tools, and life support', 'heart-pulse', 'pink', '24th_century', 'United Federation of Planets'),
('Communication Systems', 'Subspace radio, universal translators, and networks', 'radio', 'purple', '24th_century', 'United Federation of Planets'),
('Transporter Technology', 'Personnel and cargo transport systems', 'move', 'orange', '24th_century', 'United Federation of Planets');

-- Insert Crafting Stations
INSERT INTO crafting_stations (station_name, station_type, description, supported_projects, efficiency_modifier, max_concurrent_projects, power_requirements, crew_requirements) VALUES
('Industrial Replicator', 'replicator', 'Advanced matter synthesis for complex components', '["equipment", "components", "consumables"]', 1.0, 3, 150, 1),
('Engineering Fabricator', 'fabricator', 'Precision manufacturing for starship components', '["ship_systems", "engineering", "materials"]', 1.2, 2, 200, 2),
('Science Laboratory', 'laboratory', 'Research and development facility', '["research", "analysis", "medical"]', 1.5, 1, 100, 3),
('Weapons Workshop', 'workshop', 'Tactical equipment and weapons manufacturing', '["weapons", "tactical", "explosives"]', 1.1, 2, 175, 2),
('Shipyard Bay', 'shipyard', 'Complete starship construction and major repairs', '["starships", "large_construction"]', 2.0, 1, 500, 10),
('Medical Bay Fabricator', 'fabricator', 'Medical equipment and pharmaceutical synthesis', '["medical", "biological", "pharmaceuticals"]', 1.3, 2, 125, 2);

-- Insert Crafting Disciplines
INSERT INTO crafting_disciplines (discipline_name, discipline_code, description, icon_name, color_scheme, required_profession_id)
SELECT
    discipline_name, discipline_code, description, icon_name, color_scheme,
    (SELECT id FROM professions WHERE profession_code = req_prof)
FROM (VALUES
    ('Starship Engineering', 'SHIP_ENG', 'Construction and modification of starship systems', 'rocket', 'yellow', 'ENG'),
    ('Weapons Manufacturing', 'WEAPONS', 'Creation of phasers, torpedoes, and weapon systems', 'zap', 'red', 'TAC'),
    ('Armor Smithing', 'ARMOR', 'Crafting of personal armor and protective equipment', 'shield', 'blue', 'SEC'),
    ('Electronics Engineering', 'ELECTRONICS', 'Advanced computer systems and electronic devices', 'cpu', 'cyan', 'ENG'),
    ('Medical Technology', 'MEDICAL', 'Medical equipment and pharmaceutical creation', 'heart-pulse', 'green', 'MED'),
    ('Structural Engineering', 'STRUCTURE', 'Building construction and facility development', 'building', 'orange', 'ENG'),
    ('Advanced Materials', 'MATERIALS', 'Exotic material synthesis and alloy creation', 'atom', 'purple', 'SCI'),
    ('Warp Technology', 'WARP_TECH', 'Warp core and FTL system manufacturing', 'circle-dot', 'gold', 'ENG')
) AS t(discipline_name, discipline_code, description, icon_name, color_scheme, req_prof);

-- Insert Building Types
INSERT INTO building_types (building_name, building_category, building_size, construction_time_hours, required_materials, required_crafting_level, required_engineering_level, building_effects) VALUES
('Starfleet Outpost', 'station', 'large', 168, '{"duranium": 1000, "tritanium": 500, "isolinear_chips": 100, "energy_credits": 50000}', 300, 200, '{"crew_capacity": 500, "docking_bays": 10, "sensor_range": 15}'),
('Research Laboratory', 'laboratory', 'medium', 72, '{"duranium": 200, "isolinear_chips": 50, "quantum_resonators": 10, "energy_credits": 15000}', 150, 100, '{"research_speed": 1.5, "technology_bonus": 1.2}'),
('Manufacturing Complex', 'facility', 'large', 120, '{"duranium": 800, "tritanium": 300, "energy_credits": 30000}', 250, 150, '{"crafting_speed": 2.0, "resource_efficiency": 1.3}'),
('Shipyard Facility', 'shipyard', 'massive', 336, '{"duranium": 2000, "tritanium": 1000, "quantum_resonators": 50, "energy_credits": 100000}', 500, 400, '{"ship_construction": true, "build_speed": 1.5, "max_ship_size": "capital"}'),
('Defense Platform', 'defense', 'medium', 48, '{"duranium": 300, "tritanium": 150, "plasma": 50, "energy_credits": 20000}', 200, 150, '{"defensive_rating": 200, "weapon_range": 10, "shield_strength": 5000}'),
('Mining Operation', 'utility', 'large', 96, '{"duranium": 500, "machinery": 100, "energy_credits": 25000}', 100, 75, '{"resource_generation": 2.0, "mining_efficiency": 1.5}'),
('Communication Array', 'utility', 'small', 24, '{"duranium": 100, "isolinear_chips": 25, "energy_credits": 10000}', 75, 50, '{"communication_range": 50, "sensor_boost": 1.2}'),
('Replicator Network', 'utility', 'medium', 36, '{"duranium": 150, "isolinear_chips": 30, "energy_credits": 12000}', 125, 75, '{"replication_speed": 1.8, "energy_efficiency": 1.3}');

-- Create sample talent trees for Engineering profession
DO $$
DECLARE
    eng_prof_id UUID;
    starship_tree_id UUID;
    construction_tree_id UUID;
    research_tree_id UUID;
BEGIN
    -- Get Engineering profession ID
    SELECT id INTO eng_prof_id FROM professions WHERE profession_code = 'ENG';

    -- Create Engineering talent trees
    INSERT INTO talent_trees (profession_id, tree_name, tree_description, tree_type, max_tier, tree_color) VALUES
    (eng_prof_id, 'Starship Systems', 'Specialization in starship engineering and maintenance', 'specialization', 8, 'yellow'),
    (eng_prof_id, 'Construction & Fabrication', 'Advanced construction and manufacturing techniques', 'crafting', 6, 'orange'),
    (eng_prof_id, 'Research & Development', 'Innovation and technological advancement', 'research', 10, 'blue')
    RETURNING id INTO starship_tree_id;

    -- Get the tree IDs
    SELECT id INTO starship_tree_id FROM talent_trees WHERE profession_id = eng_prof_id AND tree_name = 'Starship Systems';
    SELECT id INTO construction_tree_id FROM talent_trees WHERE profession_id = eng_prof_id AND tree_name = 'Construction & Fabrication';
    SELECT id INTO research_tree_id FROM talent_trees WHERE profession_id = eng_prof_id AND tree_name = 'Research & Development';

    -- Insert sample talent nodes for Starship Systems tree
    INSERT INTO talent_nodes (talent_tree_id, node_name, node_description, tier_level, position_x, position_y, max_rank, effects, is_starter) VALUES
    (starship_tree_id, 'Basic Engineering', 'Fundamental engineering knowledge', 1, 2, 1, 1, '{"repair_speed": 1.1, "efficiency": 1.05}', true),
    (starship_tree_id, 'Power Systems Expertise', 'Advanced understanding of power distribution', 2, 1, 2, 3, '{"power_efficiency": 1.15, "overload_resistance": 1.1}', false),
    (starship_tree_id, 'Warp Core Specialist', 'Master of warp core operations and maintenance', 3, 1, 3, 5, '{"warp_efficiency": 1.25, "core_stability": 1.2}', false),
    (starship_tree_id, 'Impulse Drive Expert', 'Specialized in impulse engine systems', 3, 3, 3, 3, '{"impulse_speed": 1.15, "maneuverability": 1.1}', false),
    (starship_tree_id, 'Chief Engineer', 'Ultimate engineering leadership and expertise', 5, 2, 5, 1, '{"all_engineering": 1.5, "team_efficiency": 1.3}', false);

    -- Insert sample talent nodes for Construction tree
    INSERT INTO talent_nodes (talent_tree_id, node_name, node_description, tier_level, position_x, position_y, max_rank, effects, is_starter) VALUES
    (construction_tree_id, 'Basic Fabrication', 'Understanding of basic construction techniques', 1, 2, 1, 1, '{"build_speed": 1.1, "resource_efficiency": 1.05}', true),
    (construction_tree_id, 'Advanced Materials', 'Knowledge of exotic materials and alloys', 2, 1, 2, 3, '{"material_bonus": 1.15, "durability": 1.1}', false),
    (construction_tree_id, 'Precision Manufacturing', 'Ability to create high-quality components', 3, 2, 3, 5, '{"quality_bonus": 1.25, "critical_success": 1.2}', false),
    (construction_tree_id, 'Master Craftsman', 'Ultimate construction and fabrication mastery', 4, 2, 4, 1, '{"all_crafting": 1.4, "legendary_chance": 1.1}', false);
END $$;
