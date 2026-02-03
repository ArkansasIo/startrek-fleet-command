import { useState, useEffect } from "react";
import { InboxPMSystem } from "./InboxPMSystem";
import { GameLiveStats } from "./GameLiveStats";
import { useGameContext } from "../../lib/MMORPGGameEngine";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Shield,
  Crown,
  Star,
  Plus,
  Search,
  UserPlus,
  UserMinus,
  Settings,
  MessageSquare,
  Calendar,
  Sword,
  HeartHandshake,
  Trophy,
  MapPin,
  Coins,
  Target,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

interface GuildManagementProps {
  activeSubmenu?: string;
}

interface Guild {
  id: string;
  name: string;
  tag: string;
  description: string;
  guild_type: string;
  organization_level: string;
  member_count: number;
  max_members: number;
  guild_wealth: number;
  guild_influence: number;
  guild_reputation: number;
  leader_name: string;
  founder_name: string;
  founded_at: string;
  is_npc_guild: boolean;
  guild_motto: string;
  headquarters_name?: string;
}

interface GuildMember {
  id: string;
  player_id: string;
  display_name: string;
  rank_name: string;
  rank_level: number;
  rank_color: string;
  is_officer_rank: boolean;
  is_leader_rank: boolean;
  joined_at: string;
  last_online: string;
  contribution_score: number;
  member_status: string;
  custom_title?: string;
}

interface GuildRank {
  id: string;
  rank_name: string;
  rank_level: number;
  rank_color: string;
  is_officer_rank: boolean;
  is_leader_rank: boolean;
  can_invite_members: boolean;
  can_kick_members: boolean;
  can_promote_members: boolean;
  can_demote_members: boolean;
  can_edit_guild_info: boolean;
  can_manage_treasury: boolean;
  can_declare_war: boolean;
  can_form_alliances: boolean;
}

interface GuildApplication {
  id: string;
  player_id: string;
  display_name: string;
  level: number;
  reputation: number;
  application_message: string;
  applied_at: string;
  status: string;
}

export function GuildManagement({ activeSubmenu }: GuildManagementProps) {
  // Integrate GameContext for live stats and messaging
  const { player, setPlayer, game, setGame } = useGameContext();

  // Messages state for PM system (use game.logs or add a messages array to game/player as needed)
  const [messages, setMessages] = useState([]);

  // Handler for sending messages (update context or local state)
  const handleSendMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
    // Optionally, update player/game context if messages are stored there
  };
  const normalizeSubmenu = (submenu?: string) => {
    const map: Record<string, string> = {
      overview: "overview",
      members: "members",
      ranks: "ranks",
      applications: "applications",
      events: "events",
      alliances: "alliances",
      browse_guilds: "overview",
    };
    return map[submenu || ""] || "overview";
  };

  const [currentTab, setCurrentTab] = useState(normalizeSubmenu(activeSubmenu));
  // Use player and game context for guild info if available
  const [playerGuild, setPlayerGuild] = useState<Guild | null>(null);
  // TODO: Replace with real members/ranks/applications from context or API
  const [guildMembers, setGuildMembers] = useState<GuildMember[]>([]);
  const [guildRanks, setGuildRanks] = useState<GuildRank[]>([]);
  const [guildApplications, setGuildApplications] = useState<GuildApplication[]>([]);
  const [availableGuilds, setAvailableGuilds] = useState<Guild[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuildType, setSelectedGuildType] = useState("all");
  const [showCreateGuildDialog, setShowCreateGuildDialog] = useState(false);
  const [showJoinGuildDialog, setShowJoinGuildDialog] = useState(false);

  // Form states
  const [newGuildForm, setNewGuildForm] = useState({
    name: "",
    tag: "",
    description: "",
    type: "general",
  });

  const [joinGuildForm, setJoinGuildForm] = useState({
    selectedGuildId: "",
    applicationMessage: "",
  });

  useEffect(() => {
    setCurrentTab(normalizeSubmenu(activeSubmenu));
  }, [activeSubmenu]);

  useEffect(() => {
    if (player?.alliance && !playerGuild) {
      setPlayerGuild({
        id: `guild-${player.alliance.toLowerCase().replace(/\s+/g, "-")}`,
        name: player.alliance,
        tag: player.alliance.slice(0, 3).toUpperCase(),
        description: "",
        guild_type: "general",
        organization_level: "guild",
        member_count: 1,
        max_members: 100,
        guild_wealth: 0,
        guild_influence: 0,
        guild_reputation: 0,
        leader_name: player.name,
        founder_name: player.name,
        founded_at: new Date().toISOString(),
        is_npc_guild: false,
        guild_motto: "",
      });
    }
  }, [player, playerGuild]);

  useEffect(() => {
    loadGuildData();
    loadAvailableGuilds();
  }, []);

  const loadGuildData = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API calls
      // Mock data for now
      setPlayerGuild({
        id: "guild-1",
        name: "Starfleet Academy",
        tag: "SFA",
        description: "Training the next generation of Starfleet officers",
        guild_type: "military",
        organization_level: "guild",
        member_count: 45,
        max_members: 100,
        guild_wealth: 250000,
        guild_influence: 75,
        guild_reputation: 850,
        leader_name: "Captain Picard",
        founder_name: "Admiral Kirk",
        founded_at: "2024-01-15T10:30:00Z",
        is_npc_guild: false,
        guild_motto: "To boldly go where no one has gone before",
      });

      setGuildMembers([
        {
          id: "member-1",
          player_id: "player-1",
          display_name: "Captain Picard",
          rank_name: "Guild Leader",
          rank_level: 5,
          rank_color: "#FFD700",
          is_officer_rank: true,
          is_leader_rank: true,
          joined_at: "2024-01-15T10:30:00Z",
          last_online: "2024-12-10T14:30:00Z",
          contribution_score: 9500,
          member_status: "active",
        },
        {
          id: "member-2",
          player_id: "player-2",
          display_name: "Commander Data",
          rank_name: "Officer",
          rank_level: 3,
          rank_color: "#00AAFF",
          is_officer_rank: true,
          is_leader_rank: false,
          joined_at: "2024-01-20T09:15:00Z",
          last_online: "2024-12-10T12:20:00Z",
          contribution_score: 7200,
          member_status: "active",
        },
      ]);

      setGuildRanks([
        {
          id: "rank-1",
          rank_name: "Cadet",
          rank_level: 1,
          rank_color: "#CCCCCC",
          is_officer_rank: false,
          is_leader_rank: false,
          can_invite_members: false,
          can_kick_members: false,
          can_promote_members: false,
          can_demote_members: false,
          can_edit_guild_info: false,
          can_manage_treasury: false,
          can_declare_war: false,
          can_form_alliances: false,
        },
        {
          id: "rank-2",
          rank_name: "Officer",
          rank_level: 3,
          rank_color: "#00AAFF",
          is_officer_rank: true,
          is_leader_rank: false,
          can_invite_members: true,
          can_kick_members: true,
          can_promote_members: false,
          can_demote_members: false,
          can_edit_guild_info: false,
          can_manage_treasury: false,
          can_declare_war: false,
          can_form_alliances: false,
        },
        {
          id: "rank-3",
          rank_name: "Guild Leader",
          rank_level: 5,
          rank_color: "#FFD700",
          is_officer_rank: true,
          is_leader_rank: true,
          can_invite_members: true,
          can_kick_members: true,
          can_promote_members: true,
          can_demote_members: true,
          can_edit_guild_info: true,
          can_manage_treasury: true,
          can_declare_war: true,
          can_form_alliances: true,
        },
      ]);

      setGuildApplications([
        {
          id: "app-1",
          player_id: "player-3",
          display_name: "Ensign Wesley",
          level: 15,
          reputation: 450,
          application_message:
            "I would like to join Starfleet Academy to learn and grow as an officer.",
          applied_at: "2024-12-09T16:45:00Z",
          status: "pending",
        },
      ]);
    } catch (error) {
      console.error("Error loading guild data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableGuilds = async () => {
    try {
      // Mock data for available guilds
      setAvailableGuilds([
        {
          id: "guild-2",
          name: "Klingon Defense Force",
          tag: "KDF",
          description: "Honor through strength and victory",
          guild_type: "military",
          organization_level: "empire",
          member_count: 89,
          max_members: 150,
          guild_wealth: 500000,
          guild_influence: 92,
          guild_reputation: 750,
          leader_name: "General Martok",
          founder_name: "Kahless",
          founded_at: "2024-01-01T00:00:00Z",
          is_npc_guild: true,
          guild_motto: "Today is a good day to die",
        },
        {
          id: "guild-3",
          name: "Ferengi Trade Consortium",
          tag: "FTC",
          description: "Profit through commerce and negotiation",
          guild_type: "trade",
          organization_level: "alliance",
          member_count: 67,
          max_members: 120,
          guild_wealth: 2000000,
          guild_influence: 68,
          guild_reputation: 400,
          leader_name: "Grand Nagus Zek",
          founder_name: "Gint",
          founded_at: "2024-01-10T12:00:00Z",
          is_npc_guild: true,
          guild_motto: "Profit is the highest virtue",
        },
      ]);
    } catch (error) {
      console.error("Error loading available guilds:", error);
    }
  };

  const handleCreateGuild = async () => {
    try {
      // TODO: API call to create guild
      console.log("Creating guild:", newGuildForm);
      setShowCreateGuildDialog(false);
      setNewGuildForm({ name: "", tag: "", description: "", type: "general" });
      await loadGuildData();
    } catch (error) {
      console.error("Error creating guild:", error);
    }
  };

  const handleJoinGuild = async () => {
    try {
      // TODO: API call to join guild
      console.log("Joining guild:", joinGuildForm);
      setShowJoinGuildDialog(false);
      setJoinGuildForm({ selectedGuildId: "", applicationMessage: "" });
    } catch (error) {
      console.error("Error joining guild:", error);
    }
  };

  const handleApproveApplication = async (playerId: string) => {
    try {
      // TODO: API call to approve application
      console.log("Approving application for player:", playerId);
      await loadGuildData();
    } catch (error) {
      console.error("Error approving application:", error);
    }
  };

  const handleRejectApplication = async (playerId: string) => {
    try {
      // TODO: API call to reject application
      console.log("Rejecting application for player:", playerId);
      await loadGuildData();
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getGuildTypeIcon = (type: string) => {
    switch (type) {
      case "military":
        return <Sword className="w-4 h-4" />;
      case "trade":
        return <Coins className="w-4 h-4" />;
      case "research":
        return <Target className="w-4 h-4" />;
      case "exploration":
        return <MapPin className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const filteredGuilds = availableGuilds.filter((guild) => {
    const matchesSearch =
      guild.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guild.tag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedGuildType === "all" || guild.guild_type === selectedGuildType;
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-trek-text">Loading guild information...</div>
      </div>
    );
  }

  if (!playerGuild) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <Users className="w-16 h-16 mx-auto text-trek-accent" />
          <h2 className="text-2xl font-bold text-trek-gold">Join a Guild</h2>
          <p className="text-trek-text/80 max-w-md mx-auto">
            You are not currently a member of any guild. Join one to access
            exclusive content, collaborate with other players, and participate
            in large-scale activities.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Dialog
            open={showCreateGuildDialog}
            onOpenChange={setShowCreateGuildDialog}
          >
            <DialogTrigger asChild>
              <Button className="bg-trek-gold hover:bg-trek-gold/80 text-trek-dark">
                <Plus className="w-4 h-4 mr-2" />
                Create Guild
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-trek-panel border-trek-accent">
              <DialogHeader>
                <DialogTitle className="text-trek-gold">
                  Create New Guild
                </DialogTitle>
                <DialogDescription className="text-trek-text/80">
                  Establish your own guild and lead other players on epic
                  adventures.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="guild-name" className="text-trek-text">
                    Guild Name
                  </Label>
                  <Input
                    id="guild-name"
                    value={newGuildForm.name}
                    onChange={(e) =>
                      setNewGuildForm({ ...newGuildForm, name: e.target.value })
                    }
                    className="bg-trek-dark border-trek-accent text-trek-text"
                    placeholder="Enter guild name"
                  />
                </div>
                <div>
                  <Label htmlFor="guild-tag" className="text-trek-text">
                    Guild Tag (3-5 characters)
                  </Label>
                  <Input
                    id="guild-tag"
                    value={newGuildForm.tag}
                    onChange={(e) =>
                      setNewGuildForm({
                        ...newGuildForm,
                        tag: e.target.value.toUpperCase(),
                      })
                    }
                    className="bg-trek-dark border-trek-accent text-trek-text"
                    placeholder="TAG"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="guild-type" className="text-trek-text">
                    Guild Type
                  </Label>
                  <Select
                    value={newGuildForm.type}
                    onValueChange={(value) =>
                      setNewGuildForm({ ...newGuildForm, type: value })
                    }
                  >
                    <SelectTrigger className="bg-trek-dark border-trek-accent text-trek-text">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-trek-panel border-trek-accent">
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="military">Military</SelectItem>
                      <SelectItem value="trade">Trade</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="exploration">Exploration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="guild-description" className="text-trek-text">
                    Description
                  </Label>
                  <Textarea
                    id="guild-description"
                    value={newGuildForm.description}
                    onChange={(e) =>
                      setNewGuildForm({
                        ...newGuildForm,
                        description: e.target.value,
                      })
                    }
                    className="bg-trek-dark border-trek-accent text-trek-text"
                    placeholder="Describe your guild's purpose and goals..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateGuildDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateGuild}
                    className="bg-trek-gold hover:bg-trek-gold/80 text-trek-dark"
                    disabled={
                      !newGuildForm.name ||
                      !newGuildForm.tag ||
                      !newGuildForm.description
                    }
                  >
                    Create Guild
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={showJoinGuildDialog}
            onOpenChange={setShowJoinGuildDialog}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-trek-accent text-trek-text hover:bg-trek-accent/20"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Join Guild
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-trek-panel border-trek-accent max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-trek-gold">
                  Join a Guild
                </DialogTitle>
                <DialogDescription className="text-trek-text/80">
                  Browse available guilds and submit an application to join.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search guilds..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-trek-dark border-trek-accent text-trek-text"
                    />
                  </div>
                  <Select
                    value={selectedGuildType}
                    onValueChange={setSelectedGuildType}
                  >
                    <SelectTrigger className="w-48 bg-trek-dark border-trek-accent text-trek-text">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-trek-panel border-trek-accent">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="military">Military</SelectItem>
                      <SelectItem value="trade">Trade</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="exploration">Exploration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {filteredGuilds.map((guild) => (
                      <Card
                        key={guild.id}
                        className="bg-trek-dark/50 border-trek-accent"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {getGuildTypeIcon(guild.guild_type)}
                                <h3 className="font-semibold text-trek-gold">
                                  {guild.name} [{guild.tag}]
                                </h3>
                                {guild.is_npc_guild && (
                                  <Badge
                                    variant="outline"
                                    className="border-trek-warning text-trek-warning"
                                  >
                                    NPC
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-trek-text/80 mb-2">
                                {guild.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-trek-text/60">
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {guild.member_count}/{guild.max_members}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="w-3 h-3" />
                                  {guild.guild_reputation}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Shield className="w-3 h-3" />
                                  {guild.guild_influence}
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() =>
                                setJoinGuildForm({
                                  ...joinGuildForm,
                                  selectedGuildId: guild.id,
                                })
                              }
                              className="bg-trek-blue hover:bg-trek-blue/80"
                              disabled={guild.member_count >= guild.max_members}
                            >
                              {guild.member_count >= guild.max_members
                                ? "Full"
                                : "Select"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>

                {joinGuildForm.selectedGuildId && (
                  <div className="space-y-3 border-t border-trek-accent pt-4">
                    <Label
                      htmlFor="application-message"
                      className="text-trek-text"
                    >
                      Application Message
                    </Label>
                    <Textarea
                      id="application-message"
                      value={joinGuildForm.applicationMessage}
                      onChange={(e) =>
                        setJoinGuildForm({
                          ...joinGuildForm,
                          applicationMessage: e.target.value,
                        })
                      }
                      className="bg-trek-dark border-trek-accent text-trek-text"
                      placeholder="Tell the guild why you want to join..."
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowJoinGuildDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleJoinGuild}
                        className="bg-trek-gold hover:bg-trek-gold/80 text-trek-dark"
                        disabled={!joinGuildForm.applicationMessage}
                      >
                        Submit Application
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live Game Stats */}
      <GameLiveStats />
      {/* PM System Inbox for player/guild/admin messages */}
      <InboxPMSystem
        playerId={player.id}
        guildId={player.alliance}
        messages={messages}
        onSend={handleSendMessage}
      />
      {/* Guild Header */}
      <Card className="bg-trek-panel/80 border-trek-accent">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-trek-blue/20 border-2 border-trek-blue rounded-lg flex items-center justify-center">
                {getGuildTypeIcon(playerGuild.guild_type)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-trek-gold">
                    {playerGuild.name}
                  </h1>
                  <Badge
                    variant="outline"
                    className="border-trek-blue text-trek-blue"
                  >
                    [{playerGuild.tag}]
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-trek-accent text-trek-accent capitalize"
                  >
                    {playerGuild.guild_type}
                  </Badge>
                </div>
                <p className="text-trek-text/80 mb-2">
                  {playerGuild.description}
                </p>
                {playerGuild.guild_motto && (
                  <p className="text-sm italic text-trek-text/60">
                    "{playerGuild.guild_motto}"
                  </p>
                )}
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <div className="text-trek-gold font-semibold">
                    {playerGuild.member_count}
                  </div>
                  <div className="text-trek-text/60">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-trek-blue font-semibold">
                    {playerGuild.guild_influence}
                  </div>
                  <div className="text-trek-text/60">Influence</div>
                </div>
                <div className="text-center">
                  <div className="text-trek-warning font-semibold">
                    {playerGuild.guild_reputation}
                  </div>
                  <div className="text-trek-text/60">Reputation</div>
                </div>
              </div>
              <div className="text-xs text-trek-text/60">
                Founded {formatDate(playerGuild.founded_at)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guild Management Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="bg-trek-dark border border-trek-accent">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-trek-accent"
          >
            <Eye className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="data-[state=active]:bg-trek-accent"
          >
            <Users className="w-4 h-4 mr-2" />
            Members
          </TabsTrigger>
          <TabsTrigger
            value="ranks"
            className="data-[state=active]:bg-trek-accent"
          >
            <Crown className="w-4 h-4 mr-2" />
            Ranks
          </TabsTrigger>
          <TabsTrigger
            value="applications"
            className="data-[state=active]:bg-trek-accent"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Applications
            {guildApplications.length > 0 && (
              <Badge className="ml-2 bg-trek-warning text-trek-dark">
                {guildApplications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="data-[state=active]:bg-trek-accent"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger
            value="alliances"
            className="data-[state=active]:bg-trek-accent"
          >
            <HeartHandshake className="w-4 h-4 mr-2" />
            Alliances
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-trek-panel/50 border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Leadership
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-trek-text/60">Leader</div>
                  <div className="text-trek-text font-semibold">
                    {playerGuild.leader_name}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-trek-text/60">Founder</div>
                  <div className="text-trek-text font-semibold">
                    {playerGuild.founder_name}
                  </div>
                </div>
                {playerGuild.headquarters_name && (
                  <div>
                    <div className="text-sm text-trek-text/60">
                      Headquarters
                    </div>
                    <div className="text-trek-text font-semibold">
                      {playerGuild.headquarters_name}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-trek-panel/50 border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-trek-text/60">Wealth</span>
                  <span className="text-trek-text font-semibold">
                    {playerGuild.guild_wealth.toLocaleString()} EC
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-trek-text/60">Influence</span>
                  <span className="text-trek-blue font-semibold">
                    {playerGuild.guild_influence}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-trek-text/60">Reputation</span>
                  <span className="text-trek-warning font-semibold">
                    {playerGuild.guild_reputation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-trek-text/60">Organization</span>
                  <span className="text-trek-text font-semibold capitalize">
                    {playerGuild.organization_level}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-trek-panel/50 border-trek-accent">
              <CardHeader>
                <CardTitle className="text-trek-gold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="text-trek-text/80">
                    New member joined: Commander Data
                  </div>
                  <div className="text-trek-text/60 text-xs">2 hours ago</div>
                  <div className="text-trek-text/80">
                    Guild event completed: Training Exercise
                  </div>
                  <div className="text-trek-text/60 text-xs">1 day ago</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-trek-gold">
              Guild Members ({guildMembers.length})
            </h3>
            <Button size="sm" className="bg-trek-blue hover:bg-trek-blue/80">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </div>

          <div className="space-y-2">
            {guildMembers.map((member) => (
              <Card
                key={member.id}
                className="bg-trek-dark/50 border-trek-accent"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-trek-panel border border-trek-accent rounded-full flex items-center justify-center">
                        {member.is_leader_rank ? (
                          <Crown
                            className="w-5 h-5"
                            style={{ color: member.rank_color }}
                          />
                        ) : member.is_officer_rank ? (
                          <Shield
                            className="w-5 h-5"
                            style={{ color: member.rank_color }}
                          />
                        ) : (
                          <Users
                            className="w-5 h-5"
                            style={{ color: member.rank_color }}
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-trek-text">
                            {member.display_name}
                          </span>
                          {member.custom_title && (
                            <Badge variant="outline" className="text-xs">
                              {member.custom_title}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-trek-text/60">
                          <span style={{ color: member.rank_color }}>
                            {member.rank_name}
                          </span>
                          <span>•</span>
                          <span>Joined {formatDate(member.joined_at)}</span>
                          <span>•</span>
                          <span>{member.contribution_score} contribution</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          new Date(member.last_online) >
                          new Date(Date.now() - 24 * 60 * 60 * 1000)
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <Button size="sm" variant="outline">
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ranks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-trek-gold">
              Guild Ranks
            </h3>
            <Button size="sm" className="bg-trek-blue hover:bg-trek-blue/80">
              <Plus className="w-4 h-4 mr-2" />
              Create Rank
            </Button>
          </div>

          <div className="space-y-3">
            {guildRanks
              .sort((a, b) => b.rank_level - a.rank_level)
              .map((rank) => (
                <Card
                  key={rank.id}
                  className="bg-trek-dark/50 border-trek-accent"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-8 h-8 rounded border-2 flex items-center justify-center"
                          style={{
                            borderColor: rank.rank_color,
                            color: rank.rank_color,
                          }}
                        >
                          {rank.rank_level}
                        </div>
                        <div>
                          <h4
                            className="font-semibold"
                            style={{ color: rank.rank_color }}
                          >
                            {rank.rank_name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs">
                            {rank.is_leader_rank && (
                              <Badge className="bg-trek-warning text-trek-dark">
                                Leader
                              </Badge>
                            )}
                            {rank.is_officer_rank && !rank.is_leader_rank && (
                              <Badge className="bg-trek-blue text-white">
                                Officer
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        {!rank.is_leader_rank && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-400 border-red-400 hover:bg-red-400/20"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-trek-gold">
              Pending Applications ({guildApplications.length})
            </h3>
          </div>

          {guildApplications.length === 0 ? (
            <Card className="bg-trek-dark/30 border-trek-accent">
              <CardContent className="p-6 text-center">
                <UserPlus className="w-12 h-12 mx-auto text-trek-accent/50 mb-4" />
                <p className="text-trek-text/60">No pending applications</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {guildApplications.map((application) => (
                <Card
                  key={application.id}
                  className="bg-trek-dark/50 border-trek-accent"
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-trek-text">
                            {application.display_name}
                          </h4>
                          <div className="flex items-center gap-3 text-sm text-trek-text/60">
                            <span>Level {application.level}</span>
                            <span>•</span>
                            <span>{application.reputation} reputation</span>
                            <span>•</span>
                            <span>
                              Applied {formatDate(application.applied_at)}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              handleApproveApplication(application.player_id)
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-400 text-red-400 hover:bg-red-400/20"
                            onClick={() =>
                              handleRejectApplication(application.player_id)
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                      <div className="bg-trek-panel/30 p-3 rounded border border-trek-accent/30">
                        <p className="text-sm text-trek-text/80">
                          {application.application_message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-trek-gold">
              Guild Events
            </h3>
            <Button size="sm" className="bg-trek-blue hover:bg-trek-blue/80">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>

          <Card className="bg-trek-dark/30 border-trek-accent">
            <CardContent className="p-6 text-center">
              <Calendar className="w-12 h-12 mx-auto text-trek-accent/50 mb-4" />
              <p className="text-trek-text/60">No scheduled events</p>
              <p className="text-sm text-trek-text/40 mt-2">
                Create events to organize guild activities and raids
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alliances" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-trek-gold">
              Guild Alliances
            </h3>
            <Button size="sm" className="bg-trek-blue hover:bg-trek-blue/80">
              <Plus className="w-4 h-4 mr-2" />
              Propose Alliance
            </Button>
          </div>

          <Card className="bg-trek-dark/30 border-trek-accent">
            <CardContent className="p-6 text-center">
              <HeartHandshake className="w-12 h-12 mx-auto text-trek-accent/50 mb-4" />
              <p className="text-trek-text/60">No active alliances</p>
              <p className="text-sm text-trek-text/40 mt-2">
                Form alliances with other guilds for mutual benefit
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
