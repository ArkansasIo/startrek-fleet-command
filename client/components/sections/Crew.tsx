import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Users,
  Award,
  Heart,
  BookOpen,
  Star,
  Shield,
  MapPin,
  Building,
  UserPlus,
  Search,
  Filter,
  TrendingUp,
  Activity,
  Briefcase,
  GraduationCap,
  Zap,
  Settings,
  Globe,
  Rocket,
  Radio,
  Wrench,
  Stethoscope,
  Brain,
  Eye,
  Target,
} from "lucide-react";

interface CrewProps {
  activeSubmenu?: string;
}

interface CrewMember {
  id: string;
  name: string;
  rank: StarfleetRank;
  position: string;
  department: Department;
  species: string;
  homeworld: string;
  experience: number;
  skills: CrewSkill[];
  assignments: Assignment[];
  commendations: string[];
  status:
    | "active"
    | "medical_leave"
    | "training"
    | "away_mission"
    | "shore_leave";
  location: string;
  avatar?: string;
  biography: string;
  specializations: string[];
}

interface StarfleetRank {
  grade: number;
  name: string;
  insignia: string;
  category: "enlisted" | "officer" | "flag_officer";
  color: string;
}

interface Department {
  id: string;
  name: string;
  color: string;
  icon: any;
  head_officer?: string;
  personnel_count: number;
}

interface CrewSkill {
  name: string;
  level: number;
  category: "technical" | "tactical" | "diplomatic" | "medical" | "scientific";
}

interface Assignment {
  id: string;
  title: string;
  location: string;
  start_date: string;
  end_date?: string;
  status: "active" | "completed" | "pending";
}

interface StarbaseBuilding {
  id: string;
  name: string;
  type:
    | "command"
    | "residential"
    | "medical"
    | "engineering"
    | "science"
    | "tactical"
    | "recreational";
  level: number;
  capacity: number;
  current_occupancy: number;
  description: string;
  requirements: string[];
  benefits: string[];
  upgrade_cost: { dilithium: number; duranium: number; time_hours: number };
}

interface Planet {
  name: string;
  location: string;
  quadrant: "Alpha" | "Beta" | "Gamma" | "Delta";
  government: string;
  species: string[];
  classification: string;
  series_appearances: string[];
}

export function Crew({ activeSubmenu }: CrewProps) {
  const normalizeSubmenu = (
    submenu?: string,
  ): "overview" | "personnel" | "buildings" | "assignments" | "training" => {
    const map: Record<
      string,
      "overview" | "personnel" | "buildings" | "assignments" | "training"
    > = {
      roster: "personnel",
      assignments: "assignments",
      medical: "overview",
      evaluations: "training",
    };
    return map[submenu || ""] || "overview";
  };

  const [activeTab, setActiveTab] = useState<
    "overview" | "personnel" | "buildings" | "assignments" | "training"
  >(normalizeSubmenu(activeSubmenu));

  useEffect(() => {
    setActiveTab(normalizeSubmenu(activeSubmenu));
  }, [activeSubmenu]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRank, setSelectedRank] = useState<string>("all");

  // Starfleet Ranks
  const starfleetRanks: StarfleetRank[] = [
    // Enlisted
    {
      grade: 1,
      name: "Crewman Recruit",
      insignia: "●",
      category: "enlisted",
      color: "text-gray-400",
    },
    {
      grade: 2,
      name: "Crewman Apprentice",
      insignia: "●●",
      category: "enlisted",
      color: "text-gray-400",
    },
    {
      grade: 3,
      name: "Crewman",
      insignia: "●●●",
      category: "enlisted",
      color: "text-gray-400",
    },
    {
      grade: 4,
      name: "Petty Officer 3rd Class",
      insignia: "▲",
      category: "enlisted",
      color: "text-blue-400",
    },
    {
      grade: 5,
      name: "Petty Officer 2nd Class",
      insignia: "▲▲",
      category: "enlisted",
      color: "text-blue-400",
    },
    {
      grade: 6,
      name: "Petty Officer 1st Class",
      insignia: "▲▲▲",
      category: "enlisted",
      color: "text-blue-400",
    },
    {
      grade: 7,
      name: "Chief Petty Officer",
      insignia: "◆",
      category: "enlisted",
      color: "text-blue-300",
    },
    {
      grade: 8,
      name: "Senior Chief Petty Officer",
      insignia: "◆◆",
      category: "enlisted",
      color: "text-blue-300",
    },
    {
      grade: 9,
      name: "Master Chief Petty Officer",
      insignia: "◆◆◆",
      category: "enlisted",
      color: "text-blue-300",
    },

    // Officers
    {
      grade: 10,
      name: "Ensign",
      insignia: "○",
      category: "officer",
      color: "text-yellow-400",
    },
    {
      grade: 11,
      name: "Lieutenant Junior Grade",
      insignia: "○|",
      category: "officer",
      color: "text-yellow-400",
    },
    {
      grade: 12,
      name: "Lieutenant",
      insignia: "○○",
      category: "officer",
      color: "text-yellow-400",
    },
    {
      grade: 13,
      name: "Lieutenant Commander",
      insignia: "○○|",
      category: "officer",
      color: "text-orange-400",
    },
    {
      grade: 14,
      name: "Commander",
      insignia: "○○○",
      category: "officer",
      color: "text-orange-400",
    },
    {
      grade: 15,
      name: "Captain",
      insignia: "○○○○",
      category: "officer",
      color: "text-red-400",
    },

    // Flag Officers
    {
      grade: 16,
      name: "Commodore",
      insignia: "★",
      category: "flag_officer",
      color: "text-red-300",
    },
    {
      grade: 17,
      name: "Rear Admiral",
      insignia: "★★",
      category: "flag_officer",
      color: "text-red-300",
    },
    {
      grade: 18,
      name: "Vice Admiral",
      insignia: "★★★",
      category: "flag_officer",
      color: "text-red-200",
    },
    {
      grade: 19,
      name: "Admiral",
      insignia: "★★★★",
      category: "flag_officer",
      color: "text-red-100",
    },
    {
      grade: 20,
      name: "Fleet Admiral",
      insignia: "★★★★★",
      category: "flag_officer",
      color: "text-gold",
    },
  ];

  // Departments
  const departments: Department[] = [
    {
      id: "command",
      name: "Command",
      color: "text-red-400",
      icon: Star,
      head_officer: "Captain James T. Kirk",
      personnel_count: 45,
    },
    {
      id: "science",
      name: "Sciences",
      color: "text-blue-400",
      icon: Brain,
      head_officer: "Commander Spock",
      personnel_count: 234,
    },
    {
      id: "medical",
      name: "Medical",
      color: "text-blue-300",
      icon: Heart,
      head_officer: "Dr. Leonard McCoy",
      personnel_count: 87,
    },
    {
      id: "engineering",
      name: "Engineering",
      color: "text-yellow-400",
      icon: Wrench,
      head_officer: "Lt. Commander Geordi La Forge",
      personnel_count: 156,
    },
    {
      id: "security",
      name: "Security/Tactical",
      color: "text-yellow-400",
      icon: Shield,
      head_officer: "Lt. Commander Worf",
      personnel_count: 98,
    },
    {
      id: "operations",
      name: "Operations",
      color: "text-yellow-400",
      icon: Settings,
      head_officer: "Lt. Commander Data",
      personnel_count: 134,
    },
    {
      id: "communications",
      name: "Communications",
      color: "text-blue-400",
      icon: Radio,
      head_officer: "Lt. Nyota Uhura",
      personnel_count: 67,
    },
    {
      id: "flight_control",
      name: "Flight Control",
      color: "text-red-400",
      icon: Rocket,
      head_officer: "Lt. Tom Paris",
      personnel_count: 89,
    },
  ];

  // Star Trek Planets and Locations
  const planets: Planet[] = [
    {
      name: "Earth",
      location: "Sol System",
      quadrant: "Alpha",
      government: "United Federation of Planets",
      species: ["Human"],
      classification: "Class M",
      series_appearances: [
        "TOS",
        "TNG",
        "DS9",
        "VOY",
        "ENT",
        "DIS",
        "PIC",
        "SNW",
      ],
    },
    {
      name: "Vulcan",
      location: "40 Eridani A System",
      quadrant: "Alpha",
      government: "Vulcan High Command",
      species: ["Vulcan"],
      classification: "Class M",
      series_appearances: ["TOS", "TNG", "DS9", "VOY", "ENT", "DIS", "SNW"],
    },
    {
      name: "Andoria",
      location: "Andorian System",
      quadrant: "Alpha",
      government: "Andorian Empire",
      species: ["Andorian"],
      classification: "Class P",
      series_appearances: ["TOS", "TNG", "DS9", "ENT", "DIS", "SNW"],
    },
    {
      name: "Tellar Prime",
      location: "Tellar System",
      quadrant: "Alpha",
      government: "Tellarite Government",
      species: ["Tellarite"],
      classification: "Class M",
      series_appearances: ["TOS", "TNG", "ENT", "DIS"],
    },
    {
      name: "Qo'noS",
      location: "Qo'noS System",
      quadrant: "Beta",
      government: "Klingon Empire",
      species: ["Klingon"],
      classification: "Class M",
      series_appearances: ["TOS", "TNG", "DS9", "VOY", "ENT", "DIS", "SNW"],
    },
    {
      name: "Romulus",
      location: "Romulus System",
      quadrant: "Beta",
      government: "Romulan Star Empire",
      species: ["Romulan"],
      classification: "Class M",
      series_appearances: ["TOS", "TNG", "DS9", "VOY", "PIC"],
    },
    {
      name: "Bajor",
      location: "Bajoran System",
      quadrant: "Alpha",
      government: "Bajoran Provisional Government",
      species: ["Bajoran"],
      classification: "Class M",
      series_appearances: ["TNG", "DS9", "VOY", "PIC"],
    },
    {
      name: "Cardassia Prime",
      location: "Cardassian System",
      quadrant: "Alpha",
      government: "Cardassian Union",
      species: ["Cardassian"],
      classification: "Class M",
      series_appearances: ["TNG", "DS9", "VOY"],
    },
    {
      name: "Ferenginar",
      location: "Ferenginar System",
      quadrant: "Alpha",
      government: "Ferengi Alliance",
      species: ["Ferengi"],
      classification: "Class M",
      series_appearances: ["TNG", "DS9", "VOY", "PIC"],
    },
    {
      name: "Betazed",
      location: "Betazed System",
      quadrant: "Alpha",
      government: "Betazed Government",
      species: ["Betazoid"],
      classification: "Class M",
      series_appearances: ["TNG", "DS9", "VOY"],
    },
    {
      name: "Risa",
      location: "Risa System",
      quadrant: "Alpha",
      government: "Risian Hedony",
      species: ["Risian"],
      classification: "Class M",
      series_appearances: ["TNG", "DS9", "ENT"],
    },
    {
      name: "Trill",
      location: "Trill System",
      quadrant: "Alpha",
      government: "Trill Government",
      species: ["Trill"],
      classification: "Class M",
      series_appearances: ["TNG", "DS9"],
    },
    {
      name: "Rura Penthe",
      location: "Klingon Space",
      quadrant: "Beta",
      government: "Klingon Empire",
      species: ["Various"],
      classification: "Class L",
      series_appearances: ["TOS Movies", "VOY"],
    },
    {
      name: "Talos IV",
      location: "Talos System",
      quadrant: "Alpha",
      government: "Talosian Government",
      species: ["Talosian"],
      classification: "Class M",
      series_appearances: ["TOS", "DIS", "SNW"],
    },
    {
      name: "Nimbus III",
      location: "Neutral Zone",
      quadrant: "Beta",
      government: "Joint Colony",
      species: ["Human", "Klingon", "Romulan"],
      classification: "Class L",
      series_appearances: ["TOS Movies"],
    },
    {
      name: "Delta IV",
      location: "Delta Quadrant",
      quadrant: "Delta",
      government: "Deltan Government",
      species: ["Deltan"],
      classification: "Class M",
      series_appearances: ["TOS Movies"],
    },
  ];

  // Character Names from Star Trek
  const starTrekCharacters = [
    // The Original Series
    "James T. Kirk",
    "Spock",
    "Leonard McCoy",
    "Montgomery Scott",
    "Nyota Uhura",
    "Hikaru Sulu",
    "Pavel Chekov",
    "Christopher Pike",
    "Number One",
    "Philip Boyce",
    "José Tyler",
    "Janice Rand",
    "Christine Chapel",

    // The Next Generation
    "Jean-Luc Picard",
    "William T. Riker",
    "Data",
    "Geordi La Forge",
    "Worf",
    "Deanna Troi",
    "Beverly Crusher",
    "Wesley Crusher",
    "Tasha Yar",
    "Pulaski",
    "Ro Laren",
    "Reginald Barclay",
    "Guinan",
    "Miles O'Brien",
    "Keiko O'Brien",

    // Deep Space Nine
    "Benjamin Sisko",
    "Kira Nerys",
    "Odo",
    "Julian Bashir",
    "Jake Sisko",
    "Jadzia Dax",
    "Ezri Dax",
    "Quark",
    "Rom",
    "Nog",
    "Elim Garak",
    "Dukat",
    "Kai Winn",
    "Joseph Sisko",
    "Kasidy Yates",
    "Leeta",

    // Voyager
    "Kathryn Janeway",
    "Chakotay",
    "Tuvok",
    "Tom Paris",
    "B'Elanna Torres",
    "Harry Kim",
    "Seven of Nine",
    "Neelix",
    "Kes",
    "The Doctor",
    "Samantha Wildman",
    "Naomi Wildman",
    "Lon Suder",
    "Michael Jonas",

    // Enterprise
    "Jonathan Archer",
    "T'Pol",
    "Charles Tucker III",
    "Malcolm Reed",
    "Hoshi Sato",
    "Travis Mayweather",
    "Phlox",
    "Porthos",
    "Daniels",
    "Soval",
    "Forrest",
    "Gardner",

    // Discovery
    "Michael Burnham",
    "Saru",
    "Gabriel Lorca",
    "Paul Stamets",
    "Hugh Culber",
    "Sylvia Tilly",
    "Keyla Detmer",
    "Joann Owosekun",
    "Gen Rhys",
    "R.A. Bryce",
    "Christopher Pike",
    "Ash Tyler",
    "L'Rell",

    // Strange New Worlds
    "Una Chin-Riley",
    "La'an Noonien-Singh",
    "Erica Ortegas",
    "Sam Kirk",
    "Joseph M'Benga",
    "Hemmer",

    // Picard
    "Raffi Musiker",
    "Cristóbal Rios",
    "Agnes Jurati",
    "Elnor",
    "Soji Asha",
    "Dahj Asha",
    "Laris",
    "Zhaban",
  ];

  // Crew Members
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([
    {
      id: "crew_001",
      name: "Jean-Luc Picard",
      rank: starfleetRanks[15], // Captain
      position: "Commanding Officer",
      department: departments[0], // Command
      species: "Human",
      homeworld: "Earth",
      experience: 35,
      skills: [
        { name: "Leadership", level: 95, category: "diplomatic" },
        { name: "Starship Command", level: 98, category: "tactical" },
        { name: "Diplomacy", level: 92, category: "diplomatic" },
        { name: "Archaeology", level: 85, category: "scientific" },
      ],
      assignments: [
        {
          id: "assign_001",
          title: "USS Enterprise NCC-1701-D Captain",
          location: "Enterprise",
          start_date: "2364.1",
          status: "active",
        },
      ],
      commendations: [
        "Starfleet Medal of Honor",
        "Federation Peace Medal",
        "Grankite Order of Tactics",
      ],
      status: "active",
      location: "Main Bridge",
      biography:
        "Captain of the USS Enterprise NCC-1701-D, Jean-Luc Picard is one of Starfleet's most decorated officers.",
      specializations: ["Diplomacy", "Archaeology", "Command Strategy"],
    },
    {
      id: "crew_002",
      name: "William T. Riker",
      rank: starfleetRanks[14], // Commander
      position: "First Officer",
      department: departments[0], // Command
      species: "Human",
      homeworld: "Earth",
      experience: 18,
      skills: [
        { name: "Leadership", level: 88, category: "diplomatic" },
        { name: "Tactical Operations", level: 90, category: "tactical" },
        { name: "Piloting", level: 85, category: "technical" },
        { name: "Jazz Trombone", level: 95, category: "diplomatic" },
      ],
      assignments: [
        {
          id: "assign_002",
          title: "USS Enterprise NCC-1701-D First Officer",
          location: "Enterprise",
          start_date: "2364.1",
          status: "active",
        },
      ],
      commendations: [
        "Starfleet Command Decoration",
        "Federation Starship Tactical Award",
      ],
      status: "active",
      location: "Main Bridge",
      biography:
        "First Officer of the USS Enterprise, known for his tactical expertise and command potential.",
      specializations: [
        "Command Operations",
        "Tactical Strategy",
        "Away Team Leadership",
      ],
    },
    {
      id: "crew_003",
      name: "Data",
      rank: starfleetRanks[13], // Lieutenant Commander
      position: "Operations Officer",
      department: departments[5], // Operations
      species: "Android",
      homeworld: "Omicron Theta",
      experience: 26,
      skills: [
        { name: "Computer Operations", level: 100, category: "technical" },
        { name: "Scientific Analysis", level: 98, category: "scientific" },
        { name: "Tactical Systems", level: 95, category: "tactical" },
        {
          name: "Probability Calculations",
          level: 100,
          category: "scientific",
        },
      ],
      assignments: [
        {
          id: "assign_003",
          title: "USS Enterprise NCC-1701-D Operations Officer",
          location: "Enterprise",
          start_date: "2364.1",
          status: "active",
        },
      ],
      commendations: [
        "Starfleet Medal of Commendation",
        "Scientific Achievement Award",
      ],
      status: "active",
      location: "Main Bridge",
      biography:
        "An android officer serving as Operations Officer, Data seeks to understand humanity.",
      specializations: [
        "Computer Systems",
        "Scientific Research",
        "Positronic Networks",
      ],
    },
    {
      id: "crew_004",
      name: "Geordi La Forge",
      rank: starfleetRanks[13], // Lieutenant Commander
      position: "Chief Engineer",
      department: departments[3], // Engineering
      species: "Human",
      homeworld: "Earth",
      experience: 15,
      skills: [
        { name: "Warp Core Engineering", level: 95, category: "technical" },
        { name: "System Diagnostics", level: 92, category: "technical" },
        { name: "Starship Design", level: 88, category: "technical" },
        { name: "Problem Solving", level: 94, category: "scientific" },
      ],
      assignments: [
        {
          id: "assign_004",
          title: "USS Enterprise NCC-1701-D Chief Engineer",
          location: "Engineering",
          start_date: "2365.1",
          status: "active",
        },
      ],
      commendations: [
        "Starfleet Engineering Excellence Award",
        "Federation Innovation Medal",
      ],
      status: "active",
      location: "Main Engineering",
      biography:
        "Chief Engineer of the Enterprise, known for his innovative engineering solutions.",
      specializations: [
        "Warp Drive Technology",
        "System Integration",
        "Emergency Repairs",
      ],
    },
    {
      id: "crew_005",
      name: "Worf",
      rank: starfleetRanks[13], // Lieutenant Commander
      position: "Chief of Security",
      department: departments[4], // Security
      species: "Klingon",
      homeworld: "Qo'noS",
      experience: 12,
      skills: [
        { name: "Combat Tactics", level: 96, category: "tactical" },
        { name: "Security Protocols", level: 92, category: "tactical" },
        { name: "Weapons Systems", level: 94, category: "tactical" },
        { name: "Hand-to-Hand Combat", level: 98, category: "tactical" },
      ],
      assignments: [
        {
          id: "assign_005",
          title: "USS Enterprise NCC-1701-D Security Chief",
          location: "Security",
          start_date: "2364.1",
          status: "active",
        },
      ],
      commendations: [
        "Starfleet Security Commendation",
        "Klingon Order of Kahless",
      ],
      status: "active",
      location: "Security Office",
      biography:
        "First Klingon to serve in Starfleet, serving as Chief of Security with distinction.",
      specializations: [
        "Tactical Operations",
        "Security Protocols",
        "Klingon Culture",
      ],
    },
  ]);

  // Starbase Buildings
  const [buildings, setBuildings] = useState<StarbaseBuilding[]>([
    {
      id: "command_center",
      name: "Command Center",
      type: "command",
      level: 5,
      capacity: 50,
      current_occupancy: 45,
      description:
        "Central command facility for starbase operations and fleet coordination.",
      requirements: [
        "Starfleet Command Authorization",
        "Subspace Communications Array",
      ],
      benefits: [
        "Fleet Coordination Bonus",
        "Strategic Planning Center",
        "Emergency Command Backup",
      ],
      upgrade_cost: { dilithium: 5000, duranium: 3000, time_hours: 72 },
    },
    {
      id: "residential_quarters",
      name: "Residential Quarters",
      type: "residential",
      level: 8,
      capacity: 2000,
      current_occupancy: 1247,
      description:
        "Living quarters for starbase personnel and visiting crew members.",
      requirements: ["Life Support Systems", "Artificial Gravity Generators"],
      benefits: [
        "Crew Morale Boost",
        "Extended Crew Capacity",
        "Visitor Accommodations",
      ],
      upgrade_cost: { dilithium: 2000, duranium: 4000, time_hours: 48 },
    },
    {
      id: "medical_bay",
      name: "Medical Bay",
      type: "medical",
      level: 6,
      capacity: 200,
      current_occupancy: 12,
      description:
        "Advanced medical facility with surgical suites and emergency care units.",
      requirements: ["Medical Equipment Replicators", "Biometric Scanners"],
      benefits: [
        "Advanced Medical Care",
        "Emergency Surgery Capability",
        "Crew Health Monitoring",
      ],
      upgrade_cost: { dilithium: 3500, duranium: 1500, time_hours: 60 },
    },
    {
      id: "engineering_deck",
      name: "Engineering Deck",
      type: "engineering",
      level: 7,
      capacity: 300,
      current_occupancy: 156,
      description:
        "Main engineering facility with warp core maintenance and starship repair bays.",
      requirements: ["Warp Core Assembly", "Industrial Replicators"],
      benefits: [
        "Ship Repair Capabilities",
        "Equipment Manufacturing",
        "Power Distribution",
      ],
      upgrade_cost: { dilithium: 4000, duranium: 5000, time_hours: 96 },
    },
    {
      id: "science_labs",
      name: "Science Laboratories",
      type: "science",
      level: 5,
      capacity: 150,
      current_occupancy: 89,
      description:
        "Advanced research facilities for scientific analysis and experimentation.",
      requirements: ["Scientific Equipment", "Sensor Arrays"],
      benefits: [
        "Research Speed Boost",
        "Advanced Analysis",
        "Discovery Bonuses",
      ],
      upgrade_cost: { dilithium: 3000, duranium: 2000, time_hours: 84 },
    },
    {
      id: "tactical_center",
      name: "Tactical Operations Center",
      type: "tactical",
      level: 4,
      capacity: 80,
      current_occupancy: 67,
      description: "Strategic planning center with defensive systems control.",
      requirements: ["Tactical Displays", "Shield Generators"],
      benefits: [
        "Defense Coordination",
        "Threat Assessment",
        "Fleet Tactical Support",
      ],
      upgrade_cost: { dilithium: 4500, duranium: 2500, time_hours: 78 },
    },
    {
      id: "recreation_deck",
      name: "Recreation Deck",
      type: "recreational",
      level: 3,
      capacity: 500,
      current_occupancy: 123,
      description:
        "Entertainment and relaxation facilities for crew wellbeing.",
      requirements: ["Holographic Projectors", "Recreation Equipment"],
      benefits: [
        "Crew Morale Boost",
        "Stress Relief",
        "Social Interaction Hub",
      ],
      upgrade_cost: { dilithium: 1500, duranium: 1000, time_hours: 36 },
    },
  ]);

  const getDepartmentIcon = (dept: Department) => {
    const IconComponent = dept.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  const getBuildingIcon = (type: string) => {
    switch (type) {
      case "command":
        return <Star className="w-5 h-5" />;
      case "residential":
        return <Building className="w-5 h-5" />;
      case "medical":
        return <Heart className="w-5 h-5" />;
      case "engineering":
        return <Wrench className="w-5 h-5" />;
      case "science":
        return <Brain className="w-5 h-5" />;
      case "tactical":
        return <Shield className="w-5 h-5" />;
      case "recreational":
        return <Users className="w-5 h-5" />;
      default:
        return <Building className="w-5 h-5" />;
    }
  };

  const getBuildingTypeColor = (type: string) => {
    switch (type) {
      case "command":
        return "text-red-400 border-red-400";
      case "residential":
        return "text-blue-400 border-blue-400";
      case "medical":
        return "text-green-400 border-green-400";
      case "engineering":
        return "text-yellow-400 border-yellow-400";
      case "science":
        return "text-purple-400 border-purple-400";
      case "tactical":
        return "text-orange-400 border-orange-400";
      case "recreational":
        return "text-pink-400 border-pink-400";
      default:
        return "text-trek-text border-trek-accent";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-400/20";
      case "medical_leave":
        return "text-yellow-400 bg-yellow-400/20";
      case "training":
        return "text-blue-400 bg-blue-400/20";
      case "away_mission":
        return "text-purple-400 bg-purple-400/20";
      case "shore_leave":
        return "text-cyan-400 bg-cyan-400/20";
      default:
        return "text-trek-text bg-trek-panel";
    }
  };

  const filteredCrew = crewMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.species.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "all" ||
      member.department.id === selectedDepartment;
    const matchesRank =
      selectedRank === "all" || member.rank.name === selectedRank;

    return matchesSearch && matchesDepartment && matchesRank;
  });

  const totalPersonnel = crewMembers.length;
  const activePersonnel = crewMembers.filter(
    (c) => c.status === "active",
  ).length;
  const officerCount = crewMembers.filter(
    (c) => c.rank.category === "officer" || c.rank.category === "flag_officer",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          CREW MANAGEMENT SYSTEM
        </h2>
        <div className="flex items-center gap-4">
          <Button className="bg-trek-accent hover:bg-trek-accent/80 text-trek-dark">
            <UserPlus className="w-4 h-4 mr-2" />
            Recruit Personnel
          </Button>
          <div className="text-right">
            <div className="text-sm text-trek-text/70">Total Personnel</div>
            <div className="text-trek-blue font-semibold">
              {totalPersonnel.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value: any) => setActiveTab(value)}
      >
        <TabsList className="grid grid-cols-5 w-full bg-trek-panel border border-trek-accent">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-trek-dark"
          >
            <Activity className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="personnel"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-trek-dark"
          >
            <Users className="w-4 h-4 mr-2" />
            Personnel
          </TabsTrigger>
          <TabsTrigger
            value="buildings"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-trek-dark"
          >
            <Building className="w-4 h-4 mr-2" />
            Buildings
          </TabsTrigger>
          <TabsTrigger
            value="assignments"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-trek-dark"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Assignments
          </TabsTrigger>
          <TabsTrigger
            value="training"
            className="data-[state=active]:bg-trek-accent data-[state=active]:text-trek-dark"
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Training
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader className="pb-3">
                <CardTitle className="text-trek-gold text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Active Personnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-trek-blue mb-2">
                  {activePersonnel}
                </div>
                <div className="text-xs text-trek-text/60">
                  of {totalPersonnel} total
                </div>
                <Progress
                  value={(activePersonnel / totalPersonnel) * 100}
                  className="h-2 mt-2"
                />
              </CardContent>
            </Card>

            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader className="pb-3">
                <CardTitle className="text-trek-gold text-sm flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Officers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-trek-gold mb-2">
                  {officerCount}
                </div>
                <div className="text-xs text-trek-text/60">
                  commissioned officers
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader className="pb-3">
                <CardTitle className="text-trek-gold text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Departments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-trek-blue mb-2">
                  {departments.length}
                </div>
                <div className="text-xs text-trek-text/60">
                  active departments
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trek-panel border-trek-accent">
              <CardHeader className="pb-3">
                <CardTitle className="text-trek-gold text-sm flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Medical Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-green-400 mb-2">
                  ALL CLEAR
                </div>
                <div className="text-xs text-trek-text/60">
                  no active medical cases
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Overview */}
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-gold flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Department Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {departments.map((dept) => (
                  <Card
                    key={dept.id}
                    className="bg-trek-bg/50 border-trek-accent/30"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`p-2 rounded ${dept.color.replace("text-", "bg-").replace("400", "400/20")}`}
                        >
                          {getDepartmentIcon(dept)}
                        </div>
                        <div>
                          <h4 className={`font-semibold ${dept.color}`}>
                            {dept.name}
                          </h4>
                          <div className="text-xs text-trek-text/60">
                            {dept.personnel_count} personnel
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs text-trek-text/70">
                          Department Head
                        </div>
                        <div className="text-sm font-semibold text-trek-text">
                          {dept.head_officer}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-gold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="border-trek-accent text-trek-text hover:bg-trek-accent/20 h-16 flex-col"
                  onClick={() => setActiveTab("personnel")}
                >
                  <Users className="w-6 h-6 mb-2 text-trek-gold" />
                  <span className="text-xs">View Personnel</span>
                </Button>

                <Button
                  variant="outline"
                  className="border-trek-accent text-trek-text hover:bg-trek-accent/20 h-16 flex-col"
                  onClick={() => setActiveTab("buildings")}
                >
                  <Building className="w-6 h-6 mb-2 text-trek-gold" />
                  <span className="text-xs">Manage Buildings</span>
                </Button>

                <Button
                  variant="outline"
                  className="border-trek-accent text-trek-text hover:bg-trek-accent/20 h-16 flex-col"
                  onClick={() => setActiveTab("assignments")}
                >
                  <MapPin className="w-6 h-6 mb-2 text-trek-gold" />
                  <span className="text-xs">View Assignments</span>
                </Button>

                <Button
                  variant="outline"
                  className="border-trek-accent text-trek-text hover:bg-trek-accent/20 h-16 flex-col"
                  onClick={() => setActiveTab("training")}
                >
                  <GraduationCap className="w-6 h-6 mb-2 text-trek-gold" />
                  <span className="text-xs">Training Programs</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personnel" className="space-y-6">
          {/* Filters */}
          <Card className="bg-trek-panel border-trek-accent">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search personnel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-trek-bg border-trek-accent text-trek-text"
                  />
                </div>

                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger className="w-[180px] bg-trek-bg border-trek-accent">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent className="bg-trek-panel border-trek-accent">
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedRank} onValueChange={setSelectedRank}>
                  <SelectTrigger className="w-[180px] bg-trek-bg border-trek-accent">
                    <SelectValue placeholder="All Ranks" />
                  </SelectTrigger>
                  <SelectContent className="bg-trek-panel border-trek-accent">
                    <SelectItem value="all">All Ranks</SelectItem>
                    {starfleetRanks.map((rank) => (
                      <SelectItem key={rank.name} value={rank.name}>
                        {rank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button className="bg-trek-accent hover:bg-trek-accent/80 text-trek-dark">
                  <Filter className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Personnel List */}
          <div className="space-y-4">
            {filteredCrew.map((member) => (
              <Card
                key={member.id}
                className="bg-trek-panel border-trek-accent"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-trek-accent/20 rounded-lg flex items-center justify-center">
                        <Users className="w-8 h-8 text-trek-gold" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-trek-gold">
                            {member.name}
                          </h3>
                          <Badge className={`${member.rank.color}`}>
                            {member.rank.insignia} {member.rank.name}
                          </Badge>
                          <Badge className={getStatusColor(member.status)}>
                            {member.status.replace("_", " ").toUpperCase()}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-trek-text/70">
                              Position
                            </div>
                            <div className="font-semibold text-trek-text">
                              {member.position}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-trek-text/70">
                              Department
                            </div>
                            <div
                              className={`font-semibold flex items-center gap-2 ${member.department.color}`}
                            >
                              {getDepartmentIcon(member.department)}
                              {member.department.name}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-trek-text/70">
                              Experience
                            </div>
                            <div className="font-semibold text-trek-text">
                              {member.experience} years
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-trek-text/70">
                              Species
                            </div>
                            <div className="text-trek-blue">
                              {member.species}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-trek-text/70">
                              Homeworld
                            </div>
                            <div className="text-trek-blue">
                              {member.homeworld}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-trek-text/70">
                              Current Location
                            </div>
                            <div className="text-trek-blue">
                              {member.location}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="text-sm font-semibold text-trek-gold mb-2">
                              Primary Skills
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {member.skills.slice(0, 4).map((skill, index) => (
                                <div
                                  key={index}
                                  className="bg-trek-bg/50 p-2 rounded"
                                >
                                  <div className="text-xs text-trek-text/80">
                                    {skill.name}
                                  </div>
                                  <Progress
                                    value={skill.level}
                                    className="h-1 mt-1"
                                  />
                                  <div className="text-xs text-trek-blue mt-1">
                                    {skill.level}%
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-semibold text-trek-gold mb-2">
                              Specializations
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {member.specializations.map((spec, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs border-trek-blue text-trek-blue"
                                >
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {member.commendations.length > 0 && (
                            <div>
                              <div className="text-sm font-semibold text-trek-gold mb-2">
                                Commendations
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {member.commendations.map(
                                  (commendation, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs border-trek-gold text-trek-gold"
                                    >
                                      {commendation}
                                    </Badge>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-trek-accent/30">
                    <Button
                      size="sm"
                      className="bg-trek-accent hover:bg-trek-accent/80 text-trek-dark"
                    >
                      <Eye className="w-3 h-3 mr-2" />
                      View Profile
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-trek-accent text-trek-text"
                    >
                      <Settings className="w-3 h-3 mr-2" />
                      Edit Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-trek-blue text-trek-blue"
                    >
                      <Target className="w-3 h-3 mr-2" />
                      Assign Mission
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="buildings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildings.map((building) => (
              <Card
                key={building.id}
                className="bg-trek-panel border-trek-accent"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded ${getBuildingTypeColor(building.type).replace("text-", "bg-").replace("border-", "").replace("400", "400/20")}`}
                      >
                        {getBuildingIcon(building.type)}
                      </div>
                      <div>
                        <CardTitle className="text-trek-gold">
                          {building.name}
                        </CardTitle>
                        <div className="text-sm text-trek-text/70">
                          Level {building.level}
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={`text-xs ${getBuildingTypeColor(building.type)}`}
                    >
                      {building.type.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-trek-text/80">
                    {building.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-trek-text/70">Occupancy</span>
                      <span className="text-trek-blue">
                        {building.current_occupancy.toLocaleString()} /{" "}
                        {building.capacity.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={
                        (building.current_occupancy / building.capacity) * 100
                      }
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-trek-gold mb-2">
                      Benefits
                    </div>
                    <div className="space-y-1">
                      {building.benefits.slice(0, 3).map((benefit, index) => (
                        <div key={index} className="text-xs text-trek-text/80">
                          • {benefit}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-trek-gold mb-2">
                      Upgrade Cost
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-trek-text/70">Dilithium</div>
                        <div className="text-trek-blue">
                          {building.upgrade_cost.dilithium.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-trek-text/70">Duranium</div>
                        <div className="text-trek-blue">
                          {building.upgrade_cost.duranium.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-trek-text/70">Time</div>
                        <div className="text-trek-blue">
                          {building.upgrade_cost.time_hours}h
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-trek-accent hover:bg-trek-accent/80 text-trek-dark"
                    >
                      <TrendingUp className="w-3 h-3 mr-2" />
                      Upgrade
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-trek-accent text-trek-text"
                    >
                      <Eye className="w-3 h-3 mr-2" />
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-gold flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Notable Star Trek Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {planets.slice(0, 12).map((planet, index) => (
                  <Card
                    key={index}
                    className="bg-trek-bg/50 border-trek-accent/30"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-trek-gold">
                            {planet.name}
                          </h4>
                          <Badge className="text-xs text-trek-blue border-trek-blue">
                            {planet.quadrant} Quadrant
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-trek-text/70">
                              Location:{" "}
                            </span>
                            <span className="text-trek-text">
                              {planet.location}
                            </span>
                          </div>
                          <div>
                            <span className="text-trek-text/70">
                              Government:{" "}
                            </span>
                            <span className="text-trek-text">
                              {planet.government}
                            </span>
                          </div>
                          <div>
                            <span className="text-trek-text/70">Class: </span>
                            <span className="text-trek-blue">
                              {planet.classification}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-trek-text/70 mb-1">
                            Dominant Species
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {planet.species.map((species, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs border-trek-accent text-trek-text"
                              >
                                {species}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-trek-text/70 mb-1">
                            Series Appearances
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {planet.series_appearances
                              .slice(0, 4)
                              .map((series, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-xs border-trek-gold text-trek-gold"
                                >
                                  {series}
                                </Badge>
                              ))}
                          </div>
                        </div>

                        <Button
                          size="sm"
                          className="w-full bg-trek-accent hover:bg-trek-accent/80 text-trek-dark"
                        >
                          <MapPin className="w-3 h-3 mr-2" />
                          View Location
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-gold flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Starfleet Academy Training Programs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-trek-bg/50 border-trek-accent/30">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-trek-gold mb-3">
                      Command Track
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>• Starship Command Procedures</div>
                      <div>• Leadership and Management</div>
                      <div>• Tactical Decision Making</div>
                      <div>• Diplomatic Protocol</div>
                      <div>• Emergency Response</div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-4 bg-trek-accent hover:bg-trek-accent/80 text-trek-dark"
                    >
                      Enroll Personnel
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-trek-bg/50 border-trek-accent/30">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-trek-gold mb-3">
                      Engineering Track
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>• Warp Core Maintenance</div>
                      <div>• System Diagnostics</div>
                      <div>• Damage Control</div>
                      <div>• Technology Integration</div>
                      <div>• Safety Protocols</div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-4 bg-trek-accent hover:bg-trek-accent/80 text-trek-dark"
                    >
                      Enroll Personnel
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-trek-bg/50 border-trek-accent/30">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-trek-gold mb-3">
                      Science Track
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>• Advanced Scientific Method</div>
                      <div>• Xenobiology Studies</div>
                      <div>• Astrophysics Research</div>
                      <div>• Laboratory Safety</div>
                      <div>• Data Analysis</div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-4 bg-trek-accent hover:bg-trek-accent/80 text-trek-dark"
                    >
                      Enroll Personnel
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-trek-bg/50 border-trek-accent/30">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-trek-gold mb-3">
                      Medical Track
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>• Emergency Medicine</div>
                      <div>• Xenobiology Medicine</div>
                      <div>• Surgical Procedures</div>
                      <div>• Medical Research</div>
                      <div>• Psychological Care</div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-4 bg-trek-accent hover:bg-trek-accent/80 text-trek-dark"
                    >
                      Enroll Personnel
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Character Database Reference */}
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-gold flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Starfleet Personnel Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-trek-text/80 mb-4">
                Access to personnel records from across Starfleet history. This
                database contains records from:
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-trek-gold mb-2">
                    The Original Series
                  </div>
                  <div className="space-y-1 text-trek-text/70">
                    <div>• Command Division</div>
                    <div>• Science Division</div>
                    <div>• Medical Division</div>
                    <div>• Engineering Division</div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-trek-gold mb-2">
                    Next Generation Era
                  </div>
                  <div className="space-y-1 text-trek-text/70">
                    <div>• Enterprise-D Crew</div>
                    <div>• DS9 Personnel</div>
                    <div>• Voyager Crew</div>
                    <div>• Starfleet Academy</div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-trek-gold mb-2">
                    Enterprise Era
                  </div>
                  <div className="space-y-1 text-trek-text/70">
                    <div>• NX-01 Crew</div>
                    <div>• Earth Starfleet</div>
                    <div>• MACO Units</div>
                    <div>• Early Exploration</div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-trek-gold mb-2">
                    Modern Era
                  </div>
                  <div className="space-y-1 text-trek-text/70">
                    <div>• Discovery Crew</div>
                    <div>• Pike's Enterprise</div>
                    <div>• Picard Era Personnel</div>
                    <div>• New Starfleet</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
