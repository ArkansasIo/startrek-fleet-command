import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  Shield,
  Zap,
  Map,
  Users,
  Cog,
  Star,
  Radar,
  Rocket,
  Navigation,
  Globe,
  Microscope,
  Settings,
  HeartHandshake,
  Radio,
  Gamepad2,
  AlertTriangle,
  Package,
  Calendar,
  Clock,
  Brain,
  Target,
  Compass,
  Crosshair,
  Search,
  Activity,
  Plane,
  Swords,
  Gamepad,
  Book,
  Play,
  Music,
  Crown,
  Skull,
  Trophy,
  DollarSign,
  Wrench,
  Building2,
  TrendingUp,
  Hammer,
  MapPin,
  Lightbulb,
  Cpu,
  ShoppingCart,
  MessageCircle,
  BarChart3,
} from "lucide-react";

interface SubMenuItem {
  id: string;
  label: string;
  description?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  submenus?: SubMenuItem[];
  category: "command" | "operations" | "science" | "tactical" | "exploration";
}

interface EnhancedStarTrekNavProps {
  activeSection: string;
  activeSubmenu?: string;
  onSectionChange: (section: string, submenu?: string) => void;
}

export function EnhancedStarTrekNav({
  activeSection,
  activeSubmenu,
  onSectionChange,
}: EnhancedStarTrekNavProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const navItems: NavItem[] = [
    // Command Category
    {
      id: "fleet",
      label: "Fleet Command",
      icon: <Rocket className="w-5 h-5" />,
      category: "command",
      submenus: [
        {
          id: "overview",
          label: "Fleet Overview",
          description: "General fleet status",
        },
        {
          id: "deployment",
          label: "Deployment Orders",
          description: "Mission assignments",
        },
        {
          id: "logistics",
          label: "Fleet Logistics",
          description: "Supply and support",
        },
        {
          id: "personnel",
          label: "Command Personnel",
          description: "Officer assignments",
        },
      ],
    },
    {
      id: "starships",
      label: "Starship Database",
      icon: <Star className="w-5 h-5" />,
      category: "command",
      submenus: [
        {
          id: "active",
          label: "Active Fleet",
          description: "Operational vessels",
        },
        {
          id: "construction",
          label: "Under Construction",
          description: "Shipyard projects",
        },
        {
          id: "classes",
          label: "Ship Classes",
          description: "Vessel specifications",
        },
        {
          id: "decommissioned",
          label: "Decommissioned",
          description: "Retired vessels",
        },
      ],
    },
    {
      id: "fleet_tactical",
      label: "Fleet Tactical",
      icon: <Shield className="w-5 h-5" />,
      category: "command",
      submenus: [
        {
          id: "formations",
          label: "Fleet Formations",
          description: "Tactical arrangements",
        },
        {
          id: "strategy",
          label: "Strategic Planning",
          description: "Long-term operations",
        },
        {
          id: "intelligence",
          label: "Tactical Intelligence",
          description: "Enemy analysis",
        },
      ],
    },

    // Operations Category
    {
      id: "shipyard",
      label: "Shipyard",
      icon: <Settings className="w-5 h-5" />,
      category: "operations",
      submenus: [
        {
          id: "construction",
          label: "Construction Bays",
          description: "Active shipbuilding",
        },
        {
          id: "refit",
          label: "Refit Operations",
          description: "Ship maintenance",
        },
        {
          id: "design",
          label: "Ship Design",
          description: "New vessel concepts",
        },
        {
          id: "resources",
          label: "Resource Management",
          description: "Material allocation",
        },
      ],
    },
    {
      id: "navigation",
      label: "Navigation",
      icon: <Navigation className="w-5 h-5" />,
      category: "operations",
      submenus: [
        {
          id: "current",
          label: "Current Position",
          description: "Ship location",
        },
        {
          id: "plotting",
          label: "Course Plotting",
          description: "Navigation planning",
        },
        {
          id: "hazards",
          label: "Navigation Hazards",
          description: "Space dangers",
        },
      ],
    },
    {
      id: "systems",
      label: "Ship Systems",
      icon: <Cog className="w-5 h-5" />,
      category: "operations",
      submenus: [
        {
          id: "power",
          label: "Power Systems",
          description: "Energy distribution",
        },
        {
          id: "life_support",
          label: "Life Support",
          description: "Environmental systems",
        },
        {
          id: "propulsion",
          label: "Propulsion",
          description: "Warp and impulse",
        },
        {
          id: "diagnostics",
          label: "System Diagnostics",
          description: "Health monitoring",
        },
      ],
    },
    {
      id: "red_alert",
      label: "Red Alert",
      icon: <AlertTriangle className="w-5 h-5" />,
      category: "operations",
    },
    {
      id: "combat",
      label: "Combat",
      icon: <Zap className="w-5 h-5" />,
      category: "tactical",
      submenus: [
        {
          id: "weapons",
          label: "Weapons Control",
          description: "Phaser and torpedo systems",
        },
        {
          id: "shields",
          label: "Shield Management",
          description: "Defensive systems",
        },
        {
          id: "tactics",
          label: "Combat Tactics",
          description: "Battle strategies",
        },
        {
          id: "damage",
          label: "Damage Control",
          description: "Repair operations",
        },
      ],
    },
    {
      id: "transporter",
      label: "Transporter",
      icon: <Package className="w-5 h-5" />,
      category: "operations",
      submenus: [
        {
          id: "personnel",
          label: "Personnel Transport",
          description: "Crew beaming",
        },
        {
          id: "cargo",
          label: "Cargo Transport",
          description: "Material transfer",
        },
        {
          id: "replicator",
          label: "Replicator Systems",
          description: "Matter synthesis",
        },
        {
          id: "pattern",
          label: "Pattern Buffer",
          description: "Transport buffer",
        },
      ],
    },
    {
      id: "communications",
      label: "Communications",
      icon: <Radio className="w-5 h-5" />,
      category: "operations",
      submenus: [
        {
          id: "subspace",
          label: "Subspace Comms",
          description: "Long-range communication",
        },
        {
          id: "internal",
          label: "Internal Comms",
          description: "Ship-wide systems",
        },
        {
          id: "universal",
          label: "Universal Translator",
          description: "Language processing",
        },
        {
          id: "emergency",
          label: "Emergency Channels",
          description: "Crisis communication",
        },
      ],
    },

    // Science Category
    {
      id: "holodeck",
      label: "Holodeck",
      icon: <Gamepad2 className="w-5 h-5" />,
      category: "science",
      submenus: [
        {
          id: "programs",
          label: "Holographic Programs",
          description: "Available simulations",
        },
        {
          id: "training",
          label: "Training Simulations",
          description: "Educational content",
        },
        {
          id: "recreation",
          label: "Recreation Programs",
          description: "Entertainment",
        },
        {
          id: "emergency",
          label: "Emergency Medical",
          description: "Medical holography",
        },
      ],
    },
    {
      id: "planetary",
      label: "Planetary",
      icon: <Globe className="w-5 h-5" />,
      category: "exploration",
      submenus: [
        {
          id: "federation",
          label: "Federation Worlds",
          description: "Member planets",
        },
        { id: "neutral", label: "Neutral Zone", description: "Border regions" },
        {
          id: "unexplored",
          label: "Unexplored Regions",
          description: "Unknown space",
        },
        { id: "colonies", label: "Colonies", description: "Settlement worlds" },
      ],
    },
    {
      id: "science",
      label: "Science",
      icon: <Microscope className="w-5 h-5" />,
      category: "science",
      submenus: [
        {
          id: "research",
          label: "Active Research",
          description: "Current projects",
        },
        {
          id: "astronomy",
          label: "Stellar Astronomy",
          description: "Space phenomena",
        },
        {
          id: "biology",
          label: "Xenobiology",
          description: "Alien life forms",
        },
        {
          id: "physics",
          label: "Theoretical Physics",
          description: "Advanced theories",
        },
      ],
    },
    {
      id: "diplomatic",
      label: "Diplomatic",
      icon: <HeartHandshake className="w-5 h-5" />,
      category: "exploration",
      submenus: [
        {
          id: "relations",
          label: "Diplomatic Relations",
          description: "Alliance status",
        },
        {
          id: "negotiations",
          label: "Active Negotiations",
          description: "Current talks",
        },
        {
          id: "protocols",
          label: "Diplomatic Protocols",
          description: "Formal procedures",
        },
        {
          id: "first_contact",
          label: "First Contact",
          description: "New species protocols",
        },
      ],
    },
    {
      id: "guild_management",
      label: "Guild Management",
      icon: <Users className="w-5 h-5" />,
      category: "exploration",
      submenus: [
        {
          id: "overview",
          label: "Guild Overview",
          description: "Guild information and statistics",
        },
        {
          id: "members",
          label: "Guild Members",
          description: "Member roster and management",
        },
        {
          id: "ranks",
          label: "Rank Management",
          description: "Guild hierarchy and permissions",
        },
        {
          id: "applications",
          label: "Applications",
          description: "Review join requests",
        },
        {
          id: "events",
          label: "Guild Events",
          description: "Schedule and manage activities",
        },
        {
          id: "alliances",
          label: "Guild Alliances",
          description: "Inter-guild relationships",
        },
        {
          id: "browse_guilds",
          label: "Browse Guilds",
          description: "Find and join guilds",
        },
      ],
    },
    {
      id: "talent_trees",
      label: "Character Development",
      icon: <Star className="w-5 h-5" />,
      category: "command",
      submenus: [
        {
          id: "professions",
          label: "Professions",
          description: "Choose and develop your career path",
        },
        {
          id: "talents",
          label: "Talent Trees",
          description: "Unlock and upgrade abilities",
        },
        {
          id: "specializations",
          label: "Specializations",
          description: "Advanced skill branches",
        },
        {
          id: "progression",
          label: "Progression Tracking",
          description: "Monitor your development",
        },
      ],
    },
    {
      id: "research_development",
      label: "Research & Development",
      icon: <Microscope className="w-5 h-5" />,
      category: "exploration",
      submenus: [
        {
          id: "research_projects",
          label: "Research Projects",
          description: "Available research opportunities",
        },
        {
          id: "active_research",
          label: "Active Research",
          description: "Ongoing research activities",
        },
        {
          id: "research_stations",
          label: "Research Stations",
          description: "Laboratory and fabrication facilities",
        },
        {
          id: "technologies",
          label: "Technology Database",
          description: "Unlocked technologies and blueprints",
        },
        {
          id: "crafting",
          label: "Crafting & Manufacturing",
          description: "Create equipment and components",
        },
      ],
    },

    // Additional sections
    {
      id: "missions",
      label: "Missions",
      icon: <Target className="w-5 h-5" />,
      category: "command",
      submenus: [
        {
          id: "active",
          label: "Active Missions",
          description: "Current assignments",
        },
        {
          id: "completed",
          label: "Mission History",
          description: "Past operations",
        },
        {
          id: "classified",
          label: "Classified Operations",
          description: "Restricted access",
        },
      ],
    },
    {
      id: "tactical",
      label: "Tactical",
      icon: <Shield className="w-5 h-5" />,
      category: "tactical",
      submenus: [
        {
          id: "analysis",
          label: "Threat Analysis",
          description: "Security assessment",
        },
        {
          id: "protocols",
          label: "Security Protocols",
          description: "Defense procedures",
        },
        {
          id: "intelligence",
          label: "Intelligence Reports",
          description: "Classified data",
        },
      ],
    },
    {
      id: "exploration",
      label: "Exploration",
      icon: <Search className="w-5 h-5" />,
      category: "exploration",
      submenus: [
        {
          id: "surveys",
          label: "Planetary Surveys",
          description: "World exploration",
        },
        {
          id: "discoveries",
          label: "Recent Discoveries",
          description: "New findings",
        },
        {
          id: "cartography",
          label: "Star Charts",
          description: "Navigation maps",
        },
      ],
    },
    {
      id: "crew",
      label: "Crew",
      icon: <Users className="w-5 h-5" />,
      category: "operations",
      submenus: [
        {
          id: "roster",
          label: "Crew Roster",
          description: "Personnel database",
        },
        {
          id: "assignments",
          label: "Duty Assignments",
          description: "Work schedules",
        },
        {
          id: "medical",
          label: "Medical Records",
          description: "Health status",
        },
        {
          id: "evaluations",
          label: "Performance Reviews",
          description: "Officer assessments",
        },
      ],
    },
    {
      id: "sensors",
      label: "Sensors",
      icon: <Radar className="w-5 h-5" />,
      category: "science",
      submenus: [
        {
          id: "long_range",
          label: "Long Range Sensors",
          description: "Deep space scanning",
        },
        {
          id: "short_range",
          label: "Short Range Sensors",
          description: "Local area scan",
        },
        {
          id: "internal",
          label: "Internal Sensors",
          description: "Ship monitoring",
        },
        {
          id: "specialized",
          label: "Specialized Arrays",
          description: "Science sensors",
        },
      ],
    },
    {
      id: "engineering",
      label: "Engineering",
      icon: <Cog className="w-5 h-5" />,
      category: "operations",
      submenus: [
        {
          id: "warp_core",
          label: "Warp Core",
          description: "Antimatter reactor",
        },
        {
          id: "maintenance",
          label: "Maintenance",
          description: "System repairs",
        },
        {
          id: "jefferies",
          label: "Jefferies Tubes",
          description: "Access ways",
        },
        {
          id: "environmental",
          label: "Environmental",
          description: "Life support systems",
        },
      ],
    },
    {
      id: "weapons",
      label: "Weapons",
      icon: <Crosshair className="w-5 h-5" />,
      category: "tactical",
      submenus: [
        {
          id: "phasers",
          label: "Phaser Arrays",
          description: "Energy weapons",
        },
        {
          id: "torpedoes",
          label: "Torpedo Launchers",
          description: "Projectile weapons",
        },
        {
          id: "targeting",
          label: "Targeting Systems",
          description: "Weapon guidance",
        },
        {
          id: "inventory",
          label: "Weapons Inventory",
          description: "Ammunition status",
        },
      ],
    },
    {
      id: "achievements",
      label: "Achievements",
      icon: <Star className="w-5 h-5" />,
      category: "command",
    },
    {
      id: "season_operations",
      label: "Season Operations",
      icon: <Calendar className="w-5 h-5" />,
      category: "command",
    },
    {
      id: "universe_maps",
      label: "Universe Maps",
      icon: <Map className="w-5 h-5" />,
      category: "exploration",
      submenus: [
        {
          id: "alpha",
          label: "Alpha Quadrant",
          description: "Federation space",
        },
        {
          id: "beta",
          label: "Beta Quadrant",
          description: "Klingon/Romulan space",
        },
        {
          id: "gamma",
          label: "Gamma Quadrant",
          description: "Dominion territory",
        },
        { id: "delta", label: "Delta Quadrant", description: "Borg space" },
      ],
    },
    {
      id: "stellar_cartography",
      label: "Stellar Cartography",
      icon: <Compass className="w-5 h-5" />,
      category: "science",
    },
    {
      id: "temporal_mechanics",
      label: "Temporal Mechanics",
      icon: <Clock className="w-5 h-5" />,
      category: "science",
    },
    {
      id: "threat_assessment",
      label: "Threat Assessment",
      icon: <Brain className="w-5 h-5" />,
      category: "tactical",
    },
    {
      id: "space_phenomena",
      label: "Space Phenomena",
      icon: <Activity className="w-5 h-5" />,
      category: "science",
    },
    {
      id: "cargo_bay",
      label: "Cargo Bay",
      icon: <Package className="w-5 h-5" />,
      category: "operations",
      submenus: [
        {
          id: "overview",
          label: "Bay Overview",
          description: "Cargo bay status and capacity",
        },
        {
          id: "containers",
          label: "Container Management",
          description: "Track and manage containers",
        },
        {
          id: "manifest",
          label: "Cargo Manifest",
          description: "Complete cargo documentation",
        },
        {
          id: "operations",
          label: "Operations",
          description: "Loading and unloading",
        },
        {
          id: "analytics",
          label: "Analytics",
          description: "Cargo statistics and metrics",
        },
      ],
    },
    {
      id: "shuttle_bay",
      label: "Shuttle Bay",
      icon: <Plane className="w-5 h-5" />,
      category: "operations",
      submenus: [
        {
          id: "overview",
          label: "Bay Overview",
          description: "Shuttle bay facilities status",
        },
        {
          id: "shuttles",
          label: "Shuttle Fleet",
          description: "Manage shuttle inventory",
        },
        {
          id: "operations",
          label: "Flight Operations",
          description: "Launch and recovery ops",
        },
        {
          id: "maintenance",
          label: "Maintenance",
          description: "Shuttle repair and service",
        },
        {
          id: "analytics",
          label: "Analytics",
          description: "Fleet performance metrics",
        },
      ],
    },
    {
      id: "planetary_catalog",
      label: "Planetary Catalog",
      icon: <Globe className="w-5 h-5" />,
      category: "exploration",
      submenus: [
        {
          id: "az_catalog",
          label: "A-Z Catalog",
          description: "Alphabetical planet directory",
        },
        {
          id: "search",
          label: "Advanced Search",
          description: "Filter and find planets",
        },
        {
          id: "classifications",
          label: "Classifications",
          description: "Planet types and classes",
        },
        {
          id: "strategic",
          label: "Strategic Analysis",
          description: "Political and military data",
        },
      ],
    },
    {
      id: "galactic_territories",
      label: "Galactic Territories",
      icon: <Map className="w-5 h-5" />,
      category: "exploration",
      submenus: [
        {
          id: "overview",
          label: "Territory Overview",
          description: "Comprehensive territorial analysis",
        },
        {
          id: "quadrants",
          label: "Quadrants",
          description: "Alpha, Beta, Gamma, Delta quadrants",
        },
        {
          id: "sectors",
          label: "Sectors",
          description: "Sector divisions and boundaries",
        },
        {
          id: "systems",
          label: "Star Systems",
          description: "Systems and planetary bodies",
        },
        {
          id: "facilities",
          label: "Facilities",
          description: "Stations and installations",
        },
        {
          id: "phenomena",
          label: "Phenomena",
          description: "Nebulae and space anomalies",
        },
      ],
    },
    {
      id: "character_creation",
      label: "Character Creation",
      icon: <Users className="w-5 h-5" />,
      category: "command",
      submenus: [
        {
          id: "basic",
          label: "Basic Info",
          description: "Character identity and background",
        },
        {
          id: "attributes",
          label: "Attributes",
          description: "Physical and mental stats",
        },
        {
          id: "skills",
          label: "Skills",
          description: "Starfleet competencies",
        },
        {
          id: "background",
          label: "Background",
          description: "Personal history",
        },
        {
          id: "traits",
          label: "Traits",
          description: "Character traits and abilities",
        },
        {
          id: "roster",
          label: "Character Roster",
          description: "Saved characters",
        },
      ],
    },
    {
      id: "starship_creation",
      label: "Starship Creation",
      icon: <Rocket className="w-5 h-5" />,
      category: "command",
      submenus: [
        {
          id: "basic",
          label: "Basic Info",
          description: "Ship name and class",
        },
        {
          id: "specs",
          label: "Specifications",
          description: "Physical and performance specs",
        },
        {
          id: "systems",
          label: "Systems",
          description: "Ship systems and facilities",
        },
        {
          id: "armament",
          label: "Armament",
          description: "Weapons and defenses",
        },
        {
          id: "service",
          label: "Service History",
          description: "Operational history",
        },
        { id: "fleet", label: "Fleet Registry", description: "Ship database" },
      ],
    },
    {
      id: "nemesis_system",
      label: "Nemesis System",
      icon: <Brain className="w-5 h-5" />,
      category: "tactical",
      submenus: [
        {
          id: "database",
          label: "Threat Database",
          description: "Known enemy catalog",
        },
        {
          id: "create",
          label: "Create Enemy",
          description: "Add new threat profiles",
        },
        { id: "ai", label: "AI Profiles", description: "Behavioral analysis" },
        {
          id: "tactics",
          label: "Tactical Analysis",
          description: "Combat strategies",
        },
        {
          id: "scenarios",
          label: "Combat Scenarios",
          description: "Battle simulations",
        },
        {
          id: "prediction",
          label: "Behavior Prediction",
          description: "AI decision modeling",
        },
      ],
    },
    {
      id: "system_settings",
      label: "System Settings",
      icon: <Settings className="w-5 h-5" />,
      category: "operations",
      submenus: [
        {
          id: "display",
          label: "Display",
          description: "Theme and visual settings",
        },
        {
          id: "audio",
          label: "Audio",
          description: "Sound and alert settings",
        },
        {
          id: "interface",
          label: "Interface",
          description: "UI behavior settings",
        },
        {
          id: "security",
          label: "Security",
          description: "Access and encryption",
        },
        {
          id: "notifications",
          label: "Alerts",
          description: "Notification preferences",
        },
        {
          id: "performance",
          label: "Performance",
          description: "System optimization",
        },
        { id: "backup", label: "Backup", description: "Data backup and sync" },
        {
          id: "advanced",
          label: "Advanced",
          description: "Developer and debug options",
        },
      ],
    },
    {
      id: "weapons_system",
      label: "Weapons System",
      icon: <Swords className="w-5 h-5" />,
      category: "tactical",
      submenus: [
        {
          id: "database",
          label: "Weapons Database",
          description: "Comprehensive weapons catalog",
        },
        {
          id: "create",
          label: "Create Weapon",
          description: "Design new weapon systems",
        },
        {
          id: "compare",
          label: "Compare Arsenal",
          description: "Weapon comparison analysis",
        },
        {
          id: "analysis",
          label: "Tactical Analysis",
          description: "Performance metrics",
        },
      ],
    },
    {
      id: "game_modes",
      label: "Game Modes",
      icon: <Gamepad className="w-5 h-5" />,
      category: "science",
      submenus: [
        {
          id: "modes",
          label: "Available Modes",
          description: "Single and multiplayer options",
        },
        {
          id: "sessions",
          label: "Active Sessions",
          description: "Current game sessions",
        },
        {
          id: "create",
          label: "Create Session",
          description: "Start new game session",
        },
        {
          id: "statistics",
          label: "Statistics",
          description: "Performance tracking",
        },
      ],
    },
    {
      id: "storyline_system",
      label: "Storyline System",
      icon: <Book className="w-5 h-5" />,
      category: "command",
      submenus: [
        {
          id: "overview",
          label: "Story Overview",
          description: "Campaign structure",
        },
        {
          id: "acts",
          label: "Acts & Episodes",
          description: "Navigate story content",
        },
        {
          id: "characters",
          label: "Characters",
          description: "Character profiles",
        },
        {
          id: "progress",
          label: "Progress Tracking",
          description: "Story advancement",
        },
      ],
    },
    {
      id: "story_missions",
      label: "Story Missions",
      icon: <Play className="w-5 h-5" />,
      category: "command",
      submenus: [
        {
          id: "missions",
          label: "Available Missions",
          description: "Interactive story missions",
        },
        {
          id: "progress",
          label: "Mission Progress",
          description: "Track mission advancement",
        },
        {
          id: "achievements",
          label: "Achievements",
          description: "Mission accomplishments",
        },
      ],
    },
    {
      id: "audio_menu",
      label: "Audio Library",
      icon: <Music className="w-5 h-5" />,
      category: "science",
      submenus: [
        {
          id: "library",
          label: "Audio Library",
          description: "Browse Star Trek music and sounds",
        },
        {
          id: "player",
          label: "Audio Player",
          description: "Music playback controls",
        },
        {
          id: "playlist",
          label: "Playlist",
          description: "Manage your playlist",
        },
        {
          id: "settings",
          label: "Audio Settings",
          description: "Configure audio preferences",
        },
      ],
    },
    {
      id: "universe_events",
      label: "Universe Events",
      icon: <Globe className="w-5 h-5" />,
      category: "command",
      submenus: [
        {
          id: "active_events",
          label: "Active Events",
          description: "Participate in galaxy-wide events",
        },
        {
          id: "event_bosses",
          label: "Event Bosses",
          description: "Face cosmic threats and legendary foes",
        },
        {
          id: "event_categories",
          label: "Event Categories",
          description: "Browse different event types",
        },
        {
          id: "participation_history",
          label: "My Participation",
          description: "Track your event history and achievements",
        },
        {
          id: "event_rewards",
          label: "Event Rewards",
          description: "View available rewards and collections",
        },
        {
          id: "event_schedule",
          label: "Event Schedule",
          description: "Upcoming events and scheduling",
        },
      ],
    },
    {
      id: "leveling_crafting",
      label: "Leveling & Crafting",
      icon: <Crown className="w-5 h-5" />,
      category: "command",
      submenus: [
        {
          id: "character_levels",
          label: "Character Levels",
          description: "Character progression (1-925)",
        },
        {
          id: "crafting_disciplines",
          label: "Crafting Disciplines",
          description: "Crafting skills (1-725)",
        },
        {
          id: "tempering_system",
          label: "Tempering System",
          description: "Item enhancement (0-10)",
        },
        {
          id: "masterwork_crafting",
          label: "Masterwork Crafting",
          description: "Elite crafting (1-175)",
        },
        {
          id: "building_construction",
          label: "Building Construction",
          description: "Construct stations and facilities",
        },
        {
          id: "progression_tracking",
          label: "Progress Tracking",
          description: "Monitor all progression systems",
        },
      ],
    },
    {
      id: "universe_travel",
      label: "Universe Travel",
      icon: <Rocket className="w-5 h-5" />,
      category: "exploration",
    },
    {
      id: "technology_research",
      label: "Technology Research",
      icon: <Microscope className="w-5 h-5" />,
      category: "science",
    },
    {
      id: "planetary_combat",
      label: "Planetary Combat",
      icon: <Target className="w-5 h-5" />,
      category: "tactical",
    },
    {
      id: "fleet_management",
      label: "Fleet Management",
      icon: <Rocket className="w-5 h-5" />,
      category: "command",
    },
    {
      id: "resource_economy",
      label: "Economics & Trading",
      icon: <DollarSign className="w-5 h-5" />,
      category: "operations",
    },
    {
      id: "crew_management",
      label: "Crew Management",
      icon: <Users className="w-5 h-5" />,
      category: "command",
    },
    {
      id: "ship_systems",
      label: "Ship Systems",
      icon: <Wrench className="w-5 h-5" />,
      category: "operations",
    },
    {
      id: "alliance_diplomacy",
      label: "Diplomacy",
      icon: <HeartHandshake className="w-5 h-5" />,
      category: "command",
    },
    {
      id: "procedural_missions",
      label: "Mission Operations",
      icon: <Target className="w-5 h-5" />,
      category: "operations",
    },
    {
      id: "starbase_management",
      label: "Starbase Management",
      icon: <Building2 className="w-5 h-5" />,
      category: "operations",
    },
    {
      id: "ship_construction",
      label: "Ship Construction",
      icon: <Rocket className="w-5 h-5" />,
      category: "operations",
    },
    {
      id: "exploration_discovery",
      label: "Exploration & Discovery",
      icon: <Compass className="w-5 h-5" />,
      category: "exploration",
    },
    {
      id: "random_events",
      label: "Random Events",
      icon: <Zap className="w-5 h-5" />,
      category: "tactical",
    },
    {
      id: "achievement_progression",
      label: "Achievements",
      icon: <TrendingUp className="w-5 h-5" />,
      category: "science",
    },
    {
      id: "resource_mining",
      label: "Mining Operations",
      icon: <Hammer className="w-5 h-5" />,
      category: "operations",
    },
    {
      id: "galaxy_map",
      label: "Galaxy Map",
      icon: <MapPin className="w-5 h-5" />,
      category: "exploration",
    },
    {
      id: "colony_management",
      label: "Colonies",
      icon: <Building2 className="w-5 h-5" />,
      category: "operations",
    },
    {
      id: "communication_hailing",
      label: "Communications",
      icon: <Radio className="w-5 h-5" />,
      category: "command",
    },
    {
      id: "ship_abilities",
      label: "Ship Abilities",
      icon: <Lightbulb className="w-5 h-5" />,
      category: "tactical",
    },
    // NEW SYSTEMS INTEGRATION
    {
      id: "red_alert_system",
      label: "Red Alert System",
      icon: <AlertTriangle className="w-5 h-5" />,
      category: "tactical",
    },
    {
      id: "ai_profiles",
      label: "AI Profiles",
      icon: <Brain className="w-5 h-5" />,
      category: "command",
    },
    {
      id: "achievements_full",
      label: "Achievements",
      icon: <Trophy className="w-5 h-5" />,
      category: "command",
    },
    {
      id: "marketplace",
      label: "Marketplace",
      icon: <ShoppingCart className="w-5 h-5" />,
      category: "operations",
    },
    {
      id: "leaderboards",
      label: "Leaderboards",
      icon: <Crown className="w-5 h-5" />,
      category: "command",
    },
    {
      id: "community_chat",
      label: "Community Chat",
      icon: <MessageCircle className="w-5 h-5" />,
      category: "command",
    },
    {
      id: "analytics",
      label: "Analytics & Stats",
      icon: <BarChart3 className="w-5 h-5" />,
      category: "command",
    },
  ];

  const categorizedNavItems = {
    command: navItems.filter((item) => item.category === "command"),
    operations: navItems.filter((item) => item.category === "operations"),
    tactical: navItems.filter((item) => item.category === "tactical"),
    science: navItems.filter((item) => item.category === "science"),
    exploration: navItems.filter((item) => item.category === "exploration"),
  };

  const renderNavSection = (title: string, items: NavItem[], color: string) => (
    <div className="mb-6">
      <h3
        className={`text-xs font-bold ${color} tracking-wider mb-3 uppercase border-b border-trek-accent/30 pb-1`}
      >
        {title}
      </h3>
      <div className="space-y-1">
        {items.map((item) => (
          <div key={item.id}>
            {item.submenus ? (
              <Collapsible
                open={expandedItems.has(item.id)}
                onOpenChange={() => toggleExpanded(item.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between gap-3 px-3 py-2 h-10 text-left font-medium tracking-wide",
                      "border border-transparent transition-all duration-200",
                      "hover:border-trek-blue hover:bg-trek-accent/50 hover:text-trek-blue",
                      activeSection === item.id &&
                        "bg-trek-blue/20 border-trek-blue text-trek-blue shadow-lg shadow-trek-blue/20",
                    )}
                    onClick={() => onSectionChange(item.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-trek-gold">{item.icon}</span>
                      <span className="text-xs uppercase">{item.label}</span>
                    </div>
                    {expandedItems.has(item.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6 mt-1 space-y-1">
                  {item.submenus.map((submenu) => (
                    <Button
                      key={submenu.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-2 px-3 py-1.5 h-8 text-left text-xs",
                        "border border-transparent transition-all duration-200",
                        "hover:border-trek-blue/50 hover:bg-trek-accent/30 hover:text-trek-blue",
                        activeSubmenu === submenu.id &&
                          activeSection === item.id &&
                          "bg-trek-blue/10 border-trek-blue/50 text-trek-blue",
                      )}
                      onClick={() => onSectionChange(item.id, submenu.id)}
                    >
                      <div className="w-2 h-2 rounded-full bg-trek-gold/60"></div>
                      <div>
                        <div className="font-medium">{submenu.label}</div>
                        {submenu.description && (
                          <div className="text-xs text-trek-text/60">
                            {submenu.description}
                          </div>
                        )}
                      </div>
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 px-3 py-2 h-10 text-left font-medium tracking-wide",
                  "border border-transparent transition-all duration-200",
                  "hover:border-trek-blue hover:bg-trek-accent/50 hover:text-trek-blue",
                  activeSection === item.id &&
                    "bg-trek-blue/20 border-trek-blue text-trek-blue shadow-lg shadow-trek-blue/20",
                )}
                onClick={() => onSectionChange(item.id)}
              >
                <span className="text-trek-gold">{item.icon}</span>
                <span className="text-xs uppercase">{item.label}</span>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <nav className="w-72 bg-trek-panel border-r border-trek-accent p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-trek-gold text-xl font-bold tracking-wider">
          STARFLEET COMMAND
        </h2>
        <div className="w-full h-0.5 bg-gradient-to-r from-trek-blue to-trek-gold mt-2"></div>
      </div>

      {renderNavSection(
        "COMMAND",
        categorizedNavItems.command,
        "text-trek-gold",
      )}
      {renderNavSection(
        "OPERATIONS",
        categorizedNavItems.operations,
        "text-trek-blue",
      )}
      {renderNavSection(
        "TACTICAL",
        categorizedNavItems.tactical,
        "text-red-400",
      )}
      {renderNavSection(
        "SCIENCE",
        categorizedNavItems.science,
        "text-green-400",
      )}
      {renderNavSection(
        "EXPLORATION",
        categorizedNavItems.exploration,
        "text-purple-400",
      )}
    </nav>
  );
}
