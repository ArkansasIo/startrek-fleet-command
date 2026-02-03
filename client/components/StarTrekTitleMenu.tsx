import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  LogIn,
  LogOut,
  Settings,
  Shield,
  Star,
  Award,
  Crown,
  Zap,
  Eye,
  Lock,
  UserPlus,
  Sparkles,
  Play,
} from "lucide-react";

interface StarfleetOfficer {
  id: string;
  username: string;
  name: string;
  rank: string;
  division:
    | "Command"
    | "Operations"
    | "Sciences"
    | "Medical"
    | "Engineering"
    | "Security";
  ship: string;
  clearance_level: number;
  service_record: string[];
  commendations: string[];
  avatar?: string;
}

interface TitleMenuProps {
  onLogin: (officer: StarfleetOfficer) => void;
  onLogout: () => void;
  currentUser?: StarfleetOfficer;
  onNewGame?: () => void;
  hasSeenProlog?: boolean;
}

export function StarTrekTitleMenu({
  onLogin,
  onLogout,
  currentUser,
  onNewGame,
  hasSeenProlog,
}: TitleMenuProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    name: "",
    rank: "",
    division: "",
    ship: "",
  });

  const starfleetRanks = [
    "Cadet",
    "Ensign",
    "Lieutenant Junior Grade",
    "Lieutenant",
    "Lieutenant Commander",
    "Commander",
    "Captain",
    "Rear Admiral",
    "Vice Admiral",
    "Admiral",
    "Fleet Admiral",
  ];

  const divisions = [
    "Command",
    "Operations",
    "Sciences",
    "Medical",
    "Engineering",
    "Security",
  ];

  const sampleOfficers: StarfleetOfficer[] = [
    {
      id: "picard-001",
      username: "jlpicard",
      name: "Jean-Luc Picard",
      rank: "Captain",
      division: "Command",
      ship: "USS Enterprise NCC-1701-D",
      clearance_level: 10,
      service_record: [
        "Academy Graduate 2327",
        "First Officer USS Stargazer",
        "Captain USS Enterprise",
      ],
      commendations: [
        "Starfleet Medal of Honor",
        "Grankite Order of Tactics",
        "Prantares Ribbon of Commendation",
      ],
    },
    {
      id: "data-002",
      username: "data",
      name: "Data",
      rank: "Lieutenant Commander",
      division: "Operations",
      ship: "USS Enterprise NCC-1701-D",
      clearance_level: 8,
      service_record: [
        "Activation 2338",
        "Academy 2341-2345",
        "Operations Officer Enterprise",
      ],
      commendations: ["Starfleet Decoration for Gallantry", "Medal of Honor"],
    },
    {
      id: "worf-003",
      username: "worf",
      name: "Worf",
      rank: "Lieutenant Commander",
      division: "Security",
      ship: "USS Enterprise NCC-1701-D",
      clearance_level: 7,
      service_record: [
        "Academy Graduate 2361",
        "Security Chief Enterprise",
        "Strategic Operations DS9",
      ],
      commendations: [
        "Klingon Order of Kahless",
        "Starfleet Combat Action Ribbon",
      ],
    },
  ];

  const handleLogin = () => {
    // Simple demo login - in real app would authenticate with backend
    const officer = sampleOfficers.find(
      (o) => o.username === loginForm.username,
    );
    if (officer) {
      onLogin(officer);
      setIsLoginOpen(false);
      setLoginForm({ username: "", password: "" });
    }
  };

  const handleRegister = () => {
    // Simple demo registration
    const newOfficer: StarfleetOfficer = {
      id: `new-${Date.now()}`,
      username: registerForm.username,
      name: registerForm.name,
      rank: registerForm.rank,
      division: registerForm.division as any,
      ship: registerForm.ship,
      clearance_level: 3,
      service_record: [`Academy Graduation ${new Date().getFullYear()}`],
      commendations: ["Academy Honor Roll"],
    };
    onLogin(newOfficer);
    setIsRegisterOpen(false);
    setRegisterForm({
      username: "",
      password: "",
      name: "",
      rank: "",
      division: "",
      ship: "",
    });
  };

  const getDivisionColor = (division: string) => {
    switch (division) {
      case "Command":
        return "text-trek-gold border-trek-gold";
      case "Operations":
        return "text-red-400 border-red-400";
      case "Sciences":
        return "text-trek-blue border-trek-blue";
      case "Medical":
        return "text-green-400 border-green-400";
      case "Engineering":
        return "text-trek-warning border-trek-warning";
      case "Security":
        return "text-red-500 border-red-500";
      default:
        return "text-trek-text border-trek-text";
    }
  };

  const getRankIcon = (rank: string) => {
    if (rank.includes("Admiral")) return <Crown className="w-4 h-4" />;
    if (rank === "Captain") return <Star className="w-4 h-4" />;
    if (rank.includes("Commander")) return <Shield className="w-4 h-4" />;
    return <Award className="w-4 h-4" />;
  };

  return (
    <div className="w-full bg-trek-dark border-b border-trek-accent">
      {/* Main Title Bar */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-6">
          {/* Starfleet Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-trek-blue/20 border-2 border-trek-blue rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-trek-blue" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-trek-gold tracking-wider">
                STARFLEET COMMAND
              </h1>
              <p className="text-trek-text/70 text-sm">
                United Federation of Planets • Stardate{" "}
                {new Date().toISOString().slice(0, 10).replace(/-/g, ".")}
              </p>
            </div>
          </div>

          {/* Quick Access Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            >
              <Eye className="w-4 h-4 mr-2" />
              Bridge View
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-trek-warning text-trek-warning hover:bg-trek-warning hover:text-trek-dark"
            >
              <Zap className="w-4 h-4 mr-2" />
              Red Alert
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-trek-accent text-trek-text hover:bg-trek-accent"
            >
              <Settings className="w-4 h-4 mr-2" />
              Systems
            </Button>
          </div>
        </div>

        {/* User Area */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {getRankIcon(currentUser.rank)}
                    <span className="font-semibold text-trek-gold">
                      {currentUser.rank}
                    </span>
                  </div>
                  <div className="text-trek-text">{currentUser.name}</div>
                  <div className="text-xs text-trek-text/70">
                    {currentUser.ship}
                  </div>
                </div>
                <div className="w-10 h-10 bg-trek-panel border border-trek-accent rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-trek-blue" />
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${getDivisionColor(currentUser.division)}`}
                >
                  {currentUser.division}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs border-trek-gold text-trek-gold"
                >
                  Level {currentUser.clearance_level}
                </Badge>
              </div>

              {/* Settings & Logout */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-trek-accent text-trek-text hover:bg-trek-accent"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              {/* Login Dialog */}
              <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-trek-panel border-trek-accent">
                  <DialogHeader>
                    <DialogTitle className="text-trek-gold">
                      Starfleet Access Terminal
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-trek-text">
                        Username
                      </label>
                      <Input
                        value={loginForm.username}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            username: e.target.value,
                          })
                        }
                        placeholder="Enter Starfleet ID"
                        className="bg-trek-dark border-trek-accent"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-trek-text">
                        Password
                      </label>
                      <Input
                        type="password"
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            password: e.target.value,
                          })
                        }
                        placeholder="Security Code"
                        className="bg-trek-dark border-trek-accent"
                      />
                    </div>
                    <div className="bg-trek-dark/50 border border-trek-accent rounded p-3">
                      <p className="text-sm text-trek-text/70 mb-2">
                        Demo Accounts:
                      </p>
                      <div className="space-y-1 text-xs">
                        <div>
                          • <span className="text-trek-blue">jlpicard</span> -
                          Captain Picard
                        </div>
                        <div>
                          • <span className="text-trek-blue">data</span> - Lt.
                          Commander Data
                        </div>
                        <div>
                          • <span className="text-trek-blue">worf</span> - Lt.
                          Commander Worf
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleLogin}
                        className="flex-1 bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Access Granted
                      </Button>
                      <Button
                        onClick={() => {
                          // Quick demo login as Picard
                          const picard = sampleOfficers[0];
                          onLogin(picard);
                          setIsLoginOpen(false);
                          setLoginForm({ username: "", password: "" });
                        }}
                        className="bg-trek-gold hover:bg-trek-gold/80 text-trek-dark"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Demo
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsLoginOpen(false)}
                        className="border-trek-accent text-trek-text"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Register Dialog */}
              <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-trek-accent text-trek-text hover:bg-trek-accent"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Enlist
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-trek-panel border-trek-accent max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-trek-gold">
                      Starfleet Academy Enrollment
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-trek-text">
                        Username
                      </label>
                      <Input
                        value={registerForm.username}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            username: e.target.value,
                          })
                        }
                        placeholder="Choose ID"
                        className="bg-trek-dark border-trek-accent"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-trek-text">
                        Password
                      </label>
                      <Input
                        type="password"
                        value={registerForm.password}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            password: e.target.value,
                          })
                        }
                        placeholder="Security Code"
                        className="bg-trek-dark border-trek-accent"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-trek-text">
                        Full Name
                      </label>
                      <Input
                        value={registerForm.name}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="Legal Name"
                        className="bg-trek-dark border-trek-accent"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-trek-text">
                        Initial Rank
                      </label>
                      <Select
                        value={registerForm.rank}
                        onValueChange={(value) =>
                          setRegisterForm({ ...registerForm, rank: value })
                        }
                      >
                        <SelectTrigger className="bg-trek-dark border-trek-accent">
                          <SelectValue placeholder="Select Rank" />
                        </SelectTrigger>
                        <SelectContent>
                          {starfleetRanks.slice(0, 4).map((rank) => (
                            <SelectItem key={rank} value={rank}>
                              {rank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-trek-text">
                        Division
                      </label>
                      <Select
                        value={registerForm.division}
                        onValueChange={(value) =>
                          setRegisterForm({ ...registerForm, division: value })
                        }
                      >
                        <SelectTrigger className="bg-trek-dark border-trek-accent">
                          <SelectValue placeholder="Select Division" />
                        </SelectTrigger>
                        <SelectContent>
                          {divisions.map((division) => (
                            <SelectItem key={division} value={division}>
                              {division}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-trek-text">
                        Ship Assignment
                      </label>
                      <Input
                        value={registerForm.ship}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            ship: e.target.value,
                          })
                        }
                        placeholder="USS Enterprise NCC-1701"
                        className="bg-trek-dark border-trek-accent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={handleRegister}
                      className="flex-1 bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Begin Service
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsRegisterOpen(false)}
                      className="border-trek-accent text-trek-text"
                    >
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* New Game Button */}
              {onNewGame && (
                <Button
                  onClick={onNewGame}
                  className="bg-trek-gold hover:bg-trek-gold/80 text-trek-dark font-semibold"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {hasSeenProlog ? "Replay Story" : "New Game"}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Secondary Navigation Bar */}
      {currentUser && (
        <div className="bg-trek-panel/50 border-t border-trek-accent px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-trek-text">
                  All Systems Operational
                </span>
              </div>
              <div className="text-sm text-trek-text/70">
                Current Time: {new Date().toLocaleTimeString()}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-trek-text/70">
                Active Alerts: <span className="text-trek-blue">0</span>
              </div>
              <div className="text-sm text-trek-text/70">
                Fleet Status: <span className="text-green-400">Green</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
