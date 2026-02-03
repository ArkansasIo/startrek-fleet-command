import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface StarTrekNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function StarTrekNav({
  activeSection,
  onSectionChange,
}: StarTrekNavProps) {
  const navItems: NavItem[] = [
    {
      id: "fleet",
      label: "Fleet Command",
      icon: <Rocket className="w-5 h-5" />,
    },
    {
      id: "starships",
      label: "Starship Database",
      icon: <Star className="w-5 h-5" />,
    },
    {
      id: "fleet_tactical",
      label: "Fleet Tactical",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      id: "shipyard",
      label: "Shipyard",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      id: "navigation",
      label: "Navigation",
      icon: <Navigation className="w-5 h-5" />,
    },
    { id: "systems", label: "Ship Systems", icon: <Cog className="w-5 h-5" /> },
    {
      id: "red_alert",
      label: "Red Alert",
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    { id: "combat", label: "Combat", icon: <Zap className="w-5 h-5" /> },
    {
      id: "transporter",
      label: "Transporter",
      icon: <Package className="w-5 h-5" />,
    },
    {
      id: "communications",
      label: "Communications",
      icon: <Radio className="w-5 h-5" />,
    },
    {
      id: "holodeck",
      label: "Holodeck",
      icon: <Gamepad2 className="w-5 h-5" />,
    },
    {
      id: "achievements",
      label: "Achievements",
      icon: <Star className="w-5 h-5" />,
    },
    {
      id: "planetary",
      label: "Planetary",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      id: "science",
      label: "Science",
      icon: <Microscope className="w-5 h-5" />,
    },
    {
      id: "diplomatic",
      label: "Diplomatic",
      icon: <HeartHandshake className="w-5 h-5" />,
    },
    { id: "missions", label: "Missions", icon: <Star className="w-5 h-5" /> },
    { id: "tactical", label: "Tactical", icon: <Shield className="w-5 h-5" /> },
    {
      id: "exploration",
      label: "Exploration",
      icon: <Search className="w-5 h-5" />,
    },
    { id: "crew", label: "Crew", icon: <Users className="w-5 h-5" /> },
    { id: "sensors", label: "Sensors", icon: <Radar className="w-5 h-5" /> },
    {
      id: "engineering",
      label: "Engineering",
      icon: <Cog className="w-5 h-5" />,
    },
    {
      id: "weapons",
      label: "Weapons",
      icon: <Crosshair className="w-5 h-5" />,
    },
    {
      id: "season_operations",
      label: "Season Operations",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: "universe_maps",
      label: "Universe Maps",
      icon: <Map className="w-5 h-5" />,
    },
    {
      id: "stellar_cartography",
      label: "Stellar Cartography",
      icon: <Compass className="w-5 h-5" />,
    },
    {
      id: "temporal_mechanics",
      label: "Temporal Mechanics",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      id: "threat_assessment",
      label: "Threat Assessment",
      icon: <Brain className="w-5 h-5" />,
    },
    {
      id: "space_phenomena",
      label: "Space Phenomena",
      icon: <Activity className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="w-64 bg-trek-panel border-r border-trek-accent p-4 space-y-2">
      <div className="mb-6">
        <h2 className="text-trek-gold text-xl font-bold tracking-wider">
          STARFLEET COMMAND
        </h2>
        <div className="w-full h-0.5 bg-gradient-to-r from-trek-blue to-trek-gold mt-2"></div>
      </div>

      {navItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 px-3 py-2 h-12 text-left font-medium tracking-wide",
            "border border-transparent transition-all duration-200",
            "hover:border-trek-blue hover:bg-trek-accent/50 hover:text-trek-blue",
            activeSection === item.id &&
              "bg-trek-blue/20 border-trek-blue text-trek-blue shadow-lg shadow-trek-blue/20",
          )}
          onClick={() => onSectionChange(item.id)}
        >
          <span className="text-trek-gold">{item.icon}</span>
          <span className="text-sm uppercase">{item.label}</span>
        </Button>
      ))}
    </nav>
  );
}
