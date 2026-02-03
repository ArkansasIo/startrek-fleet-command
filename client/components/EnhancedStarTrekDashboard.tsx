import { useState } from "react";
import { useGameContext } from "../lib/MMORPGGameEngine";
import { InboxPMSystem } from "./sections/InboxPMSystem";
import { GameLiveStats } from "./sections/GameLiveStats";
import { EnhancedStarTrekNav } from "./EnhancedStarTrekNav";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Home } from "lucide-react";

// Import all existing components
import { FleetCommand } from "./sections/FleetCommand";
import { StarshipDatabase } from "./sections/StarshipDatabase";
import { FleetTactical } from "./sections/FleetTactical";
import { Shipyard } from "./sections/Shipyard";
import { GalacticMap } from "./sections/GalacticMap";
import { ShipSystems } from "./sections/ShipSystems";
import { RedAlertSystem } from "./RedAlertSystem";
import { CombatSystem } from "./sections/CombatSystem";
import { TransporterReplicator } from "./sections/TransporterReplicator";
import { Communications } from "./sections/Communications";
import { Holodeck } from "./sections/Holodeck";
import { Achievements } from "./sections/Achievements";
import { PlanetaryExplorer } from "./sections/PlanetaryExplorer";
import { ScienceExploration } from "./sections/ScienceExploration";
import { DiplomaticCorps } from "./sections/DiplomaticCorps";
import { Missions } from "./sections/Missions";
import { Tactical } from "./sections/Tactical";
import { Exploration } from "./sections/Exploration";
import { Crew } from "./sections/Crew";
import { Sensors } from "./sections/Sensors";
import { Engineering } from "./sections/Engineering";
import { Weapons } from "./sections/Weapons";
import { SeasonOperations } from "./sections/SeasonOperations";
import { UniverseMaps } from "./sections/UniverseMaps";
import { StellarCartography } from "./sections/StellarCartography";
import { TemporalMechanics } from "./sections/TemporalMechanics";
import { ThreatAssessment } from "./sections/ThreatAssessment";
import { SpacePhenomena } from "./sections/SpacePhenomena";
import { CargoBay } from "./sections/CargoBay";
import { ShuttleBay } from "./sections/ShuttleBay";
import { PlanetaryCatalog } from "./sections/PlanetaryCatalog";
import { GalacticTerritories } from "./sections/GalacticTerritories";
import { CharacterCreation } from "./sections/CharacterCreation";
import { StarshipCreation } from "./sections/StarshipCreation";
import { NemesisSystem } from "./sections/NemesisSystem";
import { SystemSettings } from "./sections/SystemSettings";
import WeaponsSystem from "./sections/WeaponsSystem";
import { WeaponsControl } from "./sections/WeaponsControl";
import GameModes from "./sections/GameModes";
import StorylineSystem from "./sections/StorylineSystem";
import StoryMissions from "./sections/StoryMissions";
import StarTrekAudioMenu from "./sections/StarTrekAudioMenu";
import { GuildManagement } from "./sections/GuildManagement";
import { TalentTree } from "./sections/TalentTree";
import { ResearchDevelopment } from "./sections/ResearchDevelopment";
import UniverseEvents from "./sections/UniverseEvents";
import { LevelingCrafting } from "./sections/LevelingCrafting";
import EnhancedMissionSystem from "./sections/EnhancedMissionSystem";

export function EnhancedStarTrekDashboard() {
  const [activeSection, setActiveSection] = useState("fleet");
  const [activeSubmenu, setActiveSubmenu] = useState<string | undefined>();
  const { player } = useGameContext();
  const [messages, setMessages] = useState([]);

  const handleSectionChange = (section: string, submenu?: string) => {
    setActiveSection(section);
    setActiveSubmenu(submenu);
  };

  const getSectionTitle = (section: string, submenu?: string) => {
    const sectionTitles: Record<string, string> = {
      fleet: "Fleet Command",
      starships: "Starship Database",
      fleet_tactical: "Fleet Tactical",
      shipyard: "Shipyard Operations",
      navigation: "Navigation Systems",
      systems: "Ship Systems",
      red_alert: "Red Alert Status",
      combat: "Combat Operations",
      transporter: "Transporter & Replicator",
      communications: "Communications",
      holodeck: "Holodeck Facilities",
      achievements: "Service Record",
      planetary: "Planetary Explorer",
      science: "Science Division",
      diplomatic: "Diplomatic Corps",
      missions: "Mission Operations",
      tactical: "Tactical Systems",
      exploration: "Exploration Division",
      crew: "Crew Management",
      sensors: "Sensor Array",
      engineering: "Engineering Systems",
      weapons: "Weapons Systems",
      season_operations: "Season Operations",
      universe_maps: "Universal Cartography",
      stellar_cartography: "Stellar Cartography",
      temporal_mechanics: "Temporal Mechanics",
      threat_assessment: "Threat Assessment",
      space_phenomena: "Space Phenomena",
      cargo_bay: "Cargo Bay Operations",
      shuttle_bay: "Shuttle Bay Operations",
      planetary_catalog: "Planetary Catalog",
      galactic_territories: "Galactic Territories",
      character_creation: "Character Creation",
      starship_creation: "Starship Creation",
      nemesis_system: "Nemesis System",
      system_settings: "System Settings",
      weapons_system: "Weapons System",
      game_modes: "Game Modes",
      storyline_system: "Storyline System",
      story_missions: "Story Missions",
      audio_menu: "Audio Library",
      guild_management: "Guild Management",
      talent_trees: "Talent Trees",
      research_development: "Research & Development",
      universe_events: "Universe Events",
      leveling_crafting: "Leveling & Crafting",
      pm_systems: "PM Systems Inbox",
    };

    const submenuTitles: Record<string, Record<string, string>> = {
      fleet: {
        overview: "Fleet Overview",
        deployment: "Deployment Orders",
        logistics: "Fleet Logistics",
        personnel: "Command Personnel",
      },
      starships: {
        active: "Active Fleet",
        construction: "Under Construction",
        classes: "Ship Classes",
        decommissioned: "Decommissioned",
      },
      fleet_tactical: {
        formations: "Fleet Formations",
        strategy: "Strategic Planning",
        intelligence: "Tactical Intelligence",
      },
      shipyard: {
        construction: "Construction Bays",
        refit: "Refit Operations",
        design: "Ship Design",
        resources: "Resource Management",
      },
      navigation: {
        current: "Current Position",
        plotting: "Course Plotting",
        hazards: "Navigation Hazards",
      },
      systems: {
        power: "Power Systems",
        life_support: "Life Support",
        propulsion: "Propulsion",
        diagnostics: "System Diagnostics",
      },
      combat: {
        weapons: "Weapons Control",
        shields: "Shield Management",
        tactics: "Combat Tactics",
        damage: "Damage Control",
      },
      transporter: {
        personnel: "Personnel Transport",
        cargo: "Cargo Transport",
        replicator: "Replicator Systems",
        pattern: "Pattern Buffer",
      },
      communications: {
        subspace: "Subspace Communications",
        internal: "Internal Communications",
        universal: "Universal Translator",
        emergency: "Emergency Channels",
      },
      holodeck: {
        programs: "Holographic Programs",
        training: "Training Simulations",
        recreation: "Recreation Programs",
        emergency: "Emergency Medical",
      },
      planetary: {
        federation: "Federation Worlds",
        neutral: "Neutral Zone",
        unexplored: "Unexplored Regions",
        colonies: "Colonies",
      },
      science: {
        research: "Active Research",
        astronomy: "Stellar Astronomy",
        biology: "Xenobiology",
        physics: "Theoretical Physics",
      },
      diplomatic: {
        relations: "Diplomatic Relations",
        negotiations: "Active Negotiations",
        protocols: "Diplomatic Protocols",
        first_contact: "First Contact",
      },
      missions: {
        active: "Active Missions",
        completed: "Mission History",
        classified: "Classified Operations",
      },
      tactical: {
        analysis: "Threat Analysis",
        protocols: "Security Protocols",
        intelligence: "Intelligence Reports",
      },
      exploration: {
        surveys: "Planetary Surveys",
        discoveries: "Recent Discoveries",
        cartography: "Star Charts",
      },
      crew: {
        roster: "Crew Roster",
        assignments: "Duty Assignments",
        medical: "Medical Records",
        evaluations: "Performance Reviews",
      },
      sensors: {
        long_range: "Long Range Sensors",
        short_range: "Short Range Sensors",
        internal: "Internal Sensors",
        specialized: "Specialized Arrays",
      },
      engineering: {
        warp_core: "Warp Core",
        maintenance: "Maintenance",
        jefferies: "Jefferies Tubes",
        environmental: "Environmental",
      },
      weapons: {
        phasers: "Phaser Arrays",
        torpedoes: "Torpedo Launchers",
        targeting: "Targeting Systems",
        inventory: "Weapons Inventory",
      },
      universe_maps: {
        alpha: "Alpha Quadrant",
        beta: "Beta Quadrant",
        gamma: "Gamma Quadrant",
        delta: "Delta Quadrant",
      },
      cargo_bay: {
        overview: "Bay Overview",
        containers: "Container Management",
        manifest: "Cargo Manifest",
        operations: "Operations",
        analytics: "Analytics",
      },
      shuttle_bay: {
        overview: "Bay Overview",
        shuttles: "Shuttle Fleet",
        operations: "Flight Operations",
        maintenance: "Maintenance",
        analytics: "Analytics",
      },
      planetary_catalog: {
        az_catalog: "A-Z Catalog",
        search: "Advanced Search",
        classifications: "Classifications",
        strategic: "Strategic Analysis",
      },
      galactic_territories: {
        overview: "Territory Overview",
        quadrants: "Quadrants",
        sectors: "Sectors",
        systems: "Star Systems",
        facilities: "Facilities",
        phenomena: "Phenomena",
      },
      character_creation: {
        basic: "Basic Info",
        attributes: "Attributes",
        skills: "Skills",
        background: "Background",
        traits: "Traits",
        roster: "Character Roster",
      },
      starship_creation: {
        basic: "Basic Info",
        specs: "Specifications",
        systems: "Systems",
        armament: "Armament",
        service: "Service History",
        fleet: "Fleet Registry",
      },
      nemesis_system: {
        database: "Threat Database",
        create: "Create Enemy",
        ai: "AI Profiles",
        tactics: "Tactical Analysis",
        scenarios: "Combat Scenarios",
        prediction: "Behavior Prediction",
      },
      system_settings: {
        display: "Display",
        audio: "Audio",
        interface: "Interface",
        security: "Security",
        notifications: "Alerts",
        performance: "Performance",
        backup: "Backup",
        advanced: "Advanced",
      },
      weapons_system: {
        database: "Weapons Database",
        create: "Create Weapon",
        compare: "Compare Arsenal",
        analysis: "Tactical Analysis",
      },
      game_modes: {
        modes: "Available Modes",
        sessions: "Active Sessions",
        create: "Create Session",
        statistics: "Statistics",
      },
      storyline_system: {
        overview: "Story Overview",
        acts: "Acts & Episodes",
        characters: "Characters",
        progress: "Progress Tracking",
      },
      story_missions: {
        missions: "Available Missions",
        progress: "Mission Progress",
        achievements: "Achievements",
      },
      audio_menu: {
        library: "Audio Library",
        player: "Audio Player",
        playlist: "Playlist",
        settings: "Audio Settings",
      },
      guild_management: {
        overview: "Guild Overview",
        members: "Guild Members",
        ranks: "Rank Management",
        applications: "Applications",
        events: "Guild Events",
        alliances: "Guild Alliances",
        browse_guilds: "Browse Guilds",
      },
      universe_events: {
        active_events: "Active Events",
        event_bosses: "Event Bosses",
        event_categories: "Event Categories",
        participation_history: "My Participation",
        event_rewards: "Event Rewards",
        event_schedule: "Event Schedule",
      },
      leveling_crafting: {
        character_levels: "Character Levels",
        crafting_disciplines: "Crafting Disciplines",
        tempering_system: "Tempering System",
        masterwork_crafting: "Masterwork Crafting",
        building_construction: "Building Construction",
        progression_tracking: "Progress Tracking",
      },
    };

    const baseTitle = sectionTitles[section] || "Unknown Section";
    if (submenu && submenuTitles[section]?.[submenu]) {
      return `${baseTitle} - ${submenuTitles[section][submenu]}`;
    }
    return baseTitle;
  };

  const renderSection = () => {
    // For sections with existing components that have their own submenu/tab functionality,
    // we'll pass the activeSubmenu as a prop if the component supports it
    const commonProps = { activeSubmenu };

    switch (activeSection) {
      case "fleet":
        return <FleetCommand {...commonProps} />;
      case "starships":
        return <StarshipDatabase {...commonProps} />;
      case "fleet_tactical":
        return <FleetTactical {...commonProps} />;
      case "shipyard":
        return <Shipyard {...commonProps} />;
      case "navigation":
        return <GalacticMap {...commonProps} />;
      case "systems":
        return <ShipSystems {...commonProps} />;
      case "red_alert":
        return <RedAlertSystem />;
      case "combat":
        // If the submenu is weapons, show the WeaponsControl component instead
        if (activeSubmenu === "weapons") {
          return <WeaponsControl {...commonProps} />;
        }
        return <CombatSystem {...commonProps} />;
      case "transporter":
        return <TransporterReplicator {...commonProps} />;
      case "communications":
        return <Communications {...commonProps} />;
      case "holodeck":
        return <Holodeck {...commonProps} />;
      case "achievements":
        return <Achievements />;
      case "planetary":
        return <PlanetaryExplorer {...commonProps} />;
      case "science":
        return <ScienceExploration {...commonProps} />;
      case "diplomatic":
        return <DiplomaticCorps {...commonProps} />;
      case "missions":
        return <EnhancedMissionSystem {...commonProps} />;
      case "tactical":
        return <Tactical {...commonProps} />;
      case "exploration":
        return <Exploration {...commonProps} />;
      case "crew":
        return <Crew {...commonProps} />;
      case "sensors":
        return <Sensors {...commonProps} />;
      case "engineering":
        return <Engineering {...commonProps} />;
      case "weapons":
        return <Weapons {...commonProps} />;
      case "season_operations":
        return <SeasonOperations />;
      case "universe_maps":
        return <UniverseMaps {...commonProps} />;
      case "stellar_cartography":
        return <StellarCartography />;
      case "temporal_mechanics":
        return <TemporalMechanics />;
      case "threat_assessment":
        return <ThreatAssessment />;
      case "space_phenomena":
        return <SpacePhenomena />;
      case "cargo_bay":
        return <CargoBay {...commonProps} />;
      case "shuttle_bay":
        return <ShuttleBay {...commonProps} />;
      case "planetary_catalog":
        return <PlanetaryCatalog {...commonProps} />;
      case "galactic_territories":
        return <GalacticTerritories {...commonProps} />;
      case "character_creation":
        return <CharacterCreation {...commonProps} />;
      case "starship_creation":
        return <StarshipCreation {...commonProps} />;
      case "nemesis_system":
        return <NemesisSystem {...commonProps} />;
      case "system_settings":
        return <SystemSettings {...commonProps} />;
      case "weapons_system":
        return <WeaponsSystem {...commonProps} />;
      case "game_modes":
        return <GameModes {...commonProps} />;
      case "storyline_system":
        return <StorylineSystem {...commonProps} />;
      case "story_missions":
        return <StoryMissions {...commonProps} />;
      case "audio_menu":
        return <StarTrekAudioMenu {...commonProps} />;
      case "guild_management":
        return <GuildManagement {...commonProps} />;
      case "talent_trees":
        return <TalentTree {...commonProps} />;
      case "research_development":
        return <ResearchDevelopment {...commonProps} />;
      case "universe_events":
        return <UniverseEvents {...commonProps} />;
      case "leveling_crafting":
        return <LevelingCrafting {...commonProps} />;
      case "pm_systems":
        // Use real playerId and shared messages state
        return <InboxPMSystem playerId={player.id} messages={messages} onSend={msg => setMessages(prev => [...prev, msg])} />;
      default:
        return <FleetCommand {...commonProps} />;
    }
  };

  const sectionLabel = getSectionTitle(activeSection, activeSubmenu);
  const [mainSection, subSection] = sectionLabel.split(" - ");

  return (
    <div className="min-h-screen bg-trek-dark text-trek-text flex">
      <EnhancedStarTrekNav
        activeSection={activeSection}
        activeSubmenu={activeSubmenu}
        onSectionChange={handleSectionChange}
      />

      <div className="flex-1 flex flex-col">
        <header className="bg-trek-panel border-b border-trek-accent p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-trek-gold tracking-wider">
                STARFLEET OPERATIONS
              </h1>
              <p className="text-trek-text/70 text-sm mt-1">
                United Federation of Planets • Stardate{" "}
                {new Date().toISOString().slice(0, 10).replace(/-/g, ".")}
              </p>

              {/* Breadcrumb Navigation */}
              <div className="mt-3">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href="#"
                        className="text-trek-blue hover:text-trek-gold flex items-center gap-1"
                        onClick={() => handleSectionChange("fleet")}
                      >
                        <Home className="w-3 h-3" />
                        Command
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                      <ChevronRight className="w-3 h-3" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href="#"
                        className="text-trek-blue hover:text-trek-gold"
                        onClick={() => handleSectionChange(activeSection)}
                      >
                        {mainSection}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {subSection && (
                      <>
                        <BreadcrumbSeparator>
                          <ChevronRight className="w-3 h-3" />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                          <span className="text-trek-gold font-medium">
                            {subSection}
                          </span>
                        </BreadcrumbItem>
                      </>
                    )}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-trek-text/70">Status</div>
                <div className="text-trek-blue font-semibold">
                  ALL SYSTEMS OPERATIONAL
                </div>
                <div className="text-xs text-trek-text/50 mt-1">
                  Active Section: {activeSection}
                  {activeSubmenu && ` / ${activeSubmenu}`}
                </div>
              </div>

              <div className="w-16 h-16 bg-trek-blue/20 border-2 border-trek-blue rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-trek-blue rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto pb-20">
          <GameLiveStats />
          <div className="mb-4">
            <h2 className="text-xl text-trek-gold font-semibold tracking-wide">
              {sectionLabel}
            </h2>
            <div className="w-full h-0.5 bg-gradient-to-r from-trek-blue to-trek-gold mt-2 mb-6"></div>
          </div>
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
