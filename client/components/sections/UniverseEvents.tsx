import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../../hooks/use-toast";
import {
  Crown,
  Users,
  Clock,
  Target,
  Zap,
  Shield,
  Sword,
  Star,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Trophy,
  Gift,
  MapPin,
  Sparkles,
  Skull,
  Rocket,
  Compass,
  Eye,
  Hand,
  Settings,
  Calendar,
  Medal,
} from "lucide-react";

interface UniverseEventsProps {
  activeSubmenu?: string;
}

interface EventCategory {
  id: string;
  category_name: string;
  category_code: string;
  description: string;
  icon_name: string;
  color_scheme: string;
  risk_level: number;
  reward_tier: number;
  event_types_count: number;
}

interface EventType {
  id: string;
  type_name: string;
  type_code: string;
  description: string;
  event_class: string;
  difficulty_tier: number;
  participant_type: string;
  max_participants: number;
  required_level: number;
  is_pvp_enabled: boolean;
}

interface UniverseEvent {
  id: string;
  event_name: string;
  event_status: string;
  event_phase: string;
  type_name: string;
  event_class: string;
  difficulty_tier: number;
  category_name: string;
  category_code: string;
  color_scheme: string;
  total_participants: number;
  max_participants: number;
  spawned_at: string;
  hard_deadline: string;
  event_progress: number;
  boss_name?: string;
  boss_title?: string;
  boss_health_percentage?: number;
  primary_location_type: string;
  base_rewards: any;
  environmental_effects: any[];
}

interface EventBoss {
  id: string;
  boss_name: string;
  boss_title: string;
  boss_class: string;
  species: string;
  faction: string;
  boss_tier: number;
  health_points: number;
  special_abilities: any[];
  lore_description: string;
}

interface EventObject {
  id: string;
  object_name: string;
  object_type: string;
  object_class: string;
  description: string;
  can_be_scanned: boolean;
  can_be_collected: boolean;
  can_be_activated: boolean;
  current_status: string;
}

interface EventMission {
  id: string;
  mission_name: string;
  mission_type: string;
  mission_category: string;
  description: string;
  mission_status: string;
  primary_objectives: any[];
  completion_rewards: any;
  current_participants: number;
  max_participants: number;
}

const UniverseEvents: React.FC<UniverseEventsProps> = ({ activeSubmenu }) => {
  const normalizeSubmenu = (submenu?: string) => {
    const map: Record<string, string> = {
      active_events: "events",
      event_bosses: "bosses",
      event_categories: "categories",
      participation_history: "participation",
      event_rewards: "events",
      event_schedule: "events",
    };
    return map[submenu || ""] || "events";
  };

  const [activeTab, setActiveTab] = useState(normalizeSubmenu(activeSubmenu));
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<UniverseEvent | null>(
    null,
  );
  const [eventCategories, setEventCategories] = useState<EventCategory[]>([]);
  const [universeEvents, setUniverseEvents] = useState<UniverseEvent[]>([]);
  const [eventBosses, setEventBosses] = useState<EventBoss[]>([]);
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [playerId] = useState("player-1"); // This would come from auth context
  const [galaxyId] = useState("galaxy-1"); // This would come from game context

  useEffect(() => {
    setActiveTab(normalizeSubmenu(activeSubmenu));
  }, [activeSubmenu]);
  const { toast } = useToast();

  useEffect(() => {
    loadEventCategories();
    loadUniverseEvents();
    loadEventBosses();
  }, []);

  const loadEventCategories = async () => {
    try {
      const response = await fetch("/api/events/categories");
      const data = await response.json();
      if (data.success) {
        setEventCategories(data.categories);
      }
    } catch (error) {
      console.error("Error loading event categories:", error);
    }
  };

  const loadUniverseEvents = async () => {
    try {
      setLoading(true);
      const url =
        selectedCategory === "all"
          ? `/api/events/universe/${galaxyId}`
          : `/api/events/universe/${galaxyId}?category=${selectedCategory}`;

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setUniverseEvents(data.events);
      }
    } catch (error) {
      console.error("Error loading universe events:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadEventBosses = async () => {
    try {
      const response = await fetch("/api/events/bosses");
      const data = await response.json();
      if (data.success) {
        setEventBosses(data.bosses);
      }
    } catch (error) {
      console.error("Error loading event bosses:", error);
    }
  };

  const loadEventDetails = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/universe/details/${eventId}`);
      const data = await response.json();
      if (data.success) {
        setEventDetails(data);
      }
    } catch (error) {
      console.error("Error loading event details:", error);
    }
  };

  const joinEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/universe/${eventId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId }),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: data.message });
        loadUniverseEvents();
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join event",
        variant: "destructive",
      });
    }
  };

  const attackBoss = async (eventId: string, bossId: string) => {
    try {
      const response = await fetch(
        `/api/events/universe/${eventId}/boss/${bossId}/attack`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerId,
            attackData: { damage: 1000, weapon_type: "phaser" },
          }),
        },
      );

      const data = await response.json();
      if (data.success) {
        toast({ title: "Attack Successful", description: data.message });
        if (selectedEvent) {
          loadEventDetails(selectedEvent.id);
        }
      } else {
        toast({
          title: "Attack Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to attack boss",
        variant: "destructive",
      });
    }
  };

  const interactWithObject = async (
    eventId: string,
    objectId: string,
    interactionType: string,
  ) => {
    try {
      const response = await fetch(
        `/api/events/universe/${eventId}/object/${objectId}/interact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId, interactionType }),
        },
      );

      const data = await response.json();
      if (data.success) {
        toast({ title: "Interaction Successful", description: data.message });
        if (selectedEvent) {
          loadEventDetails(selectedEvent.id);
        }
      } else {
        toast({
          title: "Interaction Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to interact with object",
        variant: "destructive",
      });
    }
  };

  const getEventStatusIcon = (status: string) => {
    switch (status) {
      case "spawned":
        return <Clock className="w-4 h-4" />;
      case "active":
        return <Play className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      case "expired":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getEventClassColor = (eventClass: string) => {
    switch (eventClass) {
      case "standard":
        return "blue";
      case "elite":
        return "purple";
      case "legendary":
        return "amber";
      case "mythic":
        return "red";
      default:
        return "gray";
    }
  };

  const getCategoryIcon = (categoryCode: string) => {
    switch (categoryCode) {
      case "EXPLO":
        return <Compass className="w-5 h-5" />;
      case "MILI":
        return <Sword className="w-5 h-5" />;
      case "DIPLO":
        return <Users className="w-5 h-5" />;
      case "EMER":
        return <AlertTriangle className="w-5 h-5" />;
      case "BORG":
        return <Skull className="w-5 h-5" />;
      case "SCI":
        return <Star className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  const formatTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-black text-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-blue-400">
            <Globe className="inline-block w-8 h-8 mr-3" />
            Universe Galaxy Events
          </h1>
          <p className="text-blue-300">
            Participate in galaxy-wide events, face cosmic threats, and earn
            legendary rewards
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => {
                setSelectedCategory("all");
                loadUniverseEvents();
              }}
              className="mb-2"
            >
              All Events
            </Button>
            {eventCategories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.category_code
                    ? "default"
                    : "outline"
                }
                onClick={() => {
                  setSelectedCategory(category.category_code);
                  loadUniverseEvents();
                }}
                className="mb-2"
              >
                {getCategoryIcon(category.category_code)}
                <span className="ml-2">{category.category_name}</span>
                <Badge variant="secondary" className="ml-2">
                  {category.event_types_count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-blue-500">
            <TabsTrigger
              value="events"
              className="data-[state=active]:bg-blue-600"
            >
              Active Events
            </TabsTrigger>
            <TabsTrigger
              value="bosses"
              className="data-[state=active]:bg-blue-600"
            >
              Event Bosses
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="data-[state=active]:bg-blue-600"
            >
              Categories
            </TabsTrigger>
            <TabsTrigger
              value="participation"
              className="data-[state=active]:bg-blue-600"
            >
              My Participation
            </TabsTrigger>
          </TabsList>

          {/* Active Events Tab */}
          <TabsContent value="events" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
                <p className="mt-4 text-blue-300">Loading events...</p>
              </div>
            ) : universeEvents.length === 0 ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-8 text-center">
                  <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-300">
                    No Active Events
                  </h3>
                  <p className="text-gray-400">
                    There are currently no active events in this galaxy.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {universeEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="bg-gray-800 border-gray-600 hover:border-blue-500 transition-colors"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getEventStatusIcon(event.event_status)}
                          <Badge
                            variant={
                              event.event_status === "active"
                                ? "default"
                                : event.event_status === "spawned"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {event.event_status}
                          </Badge>
                        </div>
                        <Badge
                          variant="outline"
                          className={`border-${getEventClassColor(event.event_class)}-500 text-${getEventClassColor(event.event_class)}-400`}
                        >
                          {event.event_class}
                        </Badge>
                      </div>
                      <CardTitle className="text-blue-400">
                        {event.event_name}
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        {event.type_name} • {event.category_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Difficulty</span>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < event.difficulty_tier
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Participants</span>
                        <span className="text-blue-400">
                          {event.total_participants}/{event.max_participants}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-blue-400">
                            {Math.round(event.event_progress)}%
                          </span>
                        </div>
                        <Progress
                          value={event.event_progress}
                          className="bg-gray-700"
                        />
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Time Remaining</span>
                        <span className="text-amber-400">
                          {formatTimeRemaining(event.hard_deadline)}
                        </span>
                      </div>

                      {event.boss_name && (
                        <div className="bg-red-900/20 p-3 rounded border border-red-500/30">
                          <div className="flex items-center space-x-2 mb-2">
                            <Skull className="w-4 h-4 text-red-400" />
                            <span className="text-red-400 font-medium">
                              {event.boss_name}
                            </span>
                          </div>
                          {event.boss_title && (
                            <p className="text-red-300 text-sm">
                              {event.boss_title}
                            </p>
                          )}
                          {event.boss_health_percentage !== undefined && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400">
                                  Boss Health
                                </span>
                                <span className="text-red-400">
                                  {event.boss_health_percentage}%
                                </span>
                              </div>
                              <Progress
                                value={event.boss_health_percentage}
                                className="bg-gray-700"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {event.environmental_effects &&
                        event.environmental_effects.length > 0 && (
                          <div className="bg-amber-900/20 p-2 rounded border border-amber-500/30">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="w-4 h-4 text-amber-400" />
                              <span className="text-amber-400 text-sm">
                                Environmental Effects Active
                              </span>
                            </div>
                          </div>
                        )}

                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => {
                                setSelectedEvent(event);
                                loadEventDetails(event.id);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] bg-gray-900 border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-blue-400">
                                {selectedEvent?.event_name}
                              </DialogTitle>
                              <DialogDescription className="text-gray-300">
                                {selectedEvent?.type_name} Event Details
                              </DialogDescription>
                            </DialogHeader>
                            {eventDetails && (
                              <ScrollArea className="h-96">
                                <EventDetailsContent
                                  event={selectedEvent!}
                                  details={eventDetails}
                                  onAttackBoss={attackBoss}
                                  onInteractObject={interactWithObject}
                                />
                              </ScrollArea>
                            )}
                          </DialogContent>
                        </Dialog>

                        {event.event_status === "active" && (
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => joinEvent(event.id)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Join Event
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Event Bosses Tab */}
          <TabsContent value="bosses" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventBosses.map((boss) => (
                <Card
                  key={boss.id}
                  className="bg-gray-800 border-gray-600 hover:border-red-500 transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="border-red-500 text-red-400"
                      >
                        {boss.boss_class}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: boss.boss_tier }, (_, i) => (
                          <Skull key={i} className="w-3 h-3 text-red-400" />
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-red-400">
                      {boss.boss_name}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {boss.boss_title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Species:</span>
                        <p className="text-blue-400">{boss.species}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Faction:</span>
                        <p className="text-blue-400">{boss.faction}</p>
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="text-gray-400">Health Points:</span>
                      <p className="text-green-400">
                        {boss.health_points.toLocaleString()}
                      </p>
                    </div>

                    {boss.special_abilities &&
                      boss.special_abilities.length > 0 && (
                        <div>
                          <span className="text-gray-400 text-sm">
                            Special Abilities:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {boss.special_abilities
                              .slice(0, 3)
                              .map((ability, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {ability.name || `Ability ${index + 1}`}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}

                    {boss.lore_description && (
                      <div className="bg-gray-700/50 p-3 rounded text-sm">
                        <p className="text-gray-300 line-clamp-3">
                          {boss.lore_description}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Event Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventCategories.map((category) => (
                <Card
                  key={category.id}
                  className={`bg-gray-800 border-gray-600 hover:border-${category.color_scheme}-500 transition-colors`}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      {getCategoryIcon(category.category_code)}
                      <div className="flex-1">
                        <CardTitle
                          className={`text-${category.color_scheme}-400`}
                        >
                          {category.category_name}
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                          {category.category_code}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {category.event_types_count} Types
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{category.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Risk Level:</span>
                        <div className="flex items-center space-x-1 mt-1">
                          {Array.from({ length: 10 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < category.risk_level
                                  ? "bg-red-400"
                                  : "bg-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">Reward Tier:</span>
                        <div className="flex items-center space-x-1 mt-1">
                          {Array.from({ length: 10 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < category.reward_tier
                                  ? "bg-green-400"
                                  : "bg-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Participation Tab */}
          <TabsContent value="participation" className="space-y-4">
            <Card className="bg-gray-800 border-gray-600">
              <CardHeader>
                <CardTitle className="text-blue-400">
                  <Trophy className="inline-block w-5 h-5 mr-2" />
                  Your Event History
                </CardTitle>
                <CardDescription>
                  Track your participation in universe events and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-300">
                    No Participation History
                  </h3>
                  <p className="text-gray-400">
                    Join events to start building your participation history!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Event Details Component
interface EventDetailsContentProps {
  event: UniverseEvent;
  details: any;
  onAttackBoss: (eventId: string, bossId: string) => void;
  onInteractObject: (
    eventId: string,
    objectId: string,
    interactionType: string,
  ) => void;
}

const EventDetailsContent: React.FC<EventDetailsContentProps> = ({
  event,
  details,
  onAttackBoss,
  onInteractObject,
}) => {
  const [activeDetailsTab, setActiveDetailsTab] = useState("overview");

  return (
    <div className="space-y-4">
      <Tabs value={activeDetailsTab} onValueChange={setActiveDetailsTab}>
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="objects">Objects</TabsTrigger>
          <TabsTrigger value="missions">Missions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-gray-400">Event Phase:</span>
              <Badge variant="outline">{event.event_phase}</Badge>
            </div>
            <div className="space-y-2">
              <span className="text-gray-400">Location:</span>
              <p className="text-blue-400">{event.primary_location_type}</p>
            </div>
          </div>

          {details.event.base_rewards && (
            <div>
              <h4 className="text-blue-400 font-medium mb-2">Base Rewards</h4>
              <div className="bg-green-900/20 p-3 rounded border border-green-500/30">
                <div className="space-y-1 text-sm">
                  {Object.entries(details.event.base_rewards).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-400 capitalize">{key}:</span>
                        <span className="text-green-400">{String(value)}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}

          {details.event.boss_name && (
            <div>
              <h4 className="text-red-400 font-medium mb-2">Event Boss</h4>
              <Card className="bg-red-900/20 border-red-500/30">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-red-400 font-medium">
                      {details.event.boss_name}
                    </h5>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        onAttackBoss(event.id, details.event.primary_boss_id)
                      }
                    >
                      <Sword className="w-4 h-4 mr-2" />
                      Attack
                    </Button>
                  </div>
                  {details.event.boss_title && (
                    <p className="text-red-300 text-sm mb-2">
                      {details.event.boss_title}
                    </p>
                  )}
                  <Progress
                    value={details.event.boss_health_percentage || 100}
                    className="bg-gray-700"
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="participants" className="space-y-4">
          <div className="space-y-2">
            {details.participants?.length > 0 ? (
              details.participants.map((participant: any) => (
                <Card
                  key={participant.id}
                  className="bg-gray-700 border-gray-600"
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-blue-400 font-medium">
                          {participant.display_name}
                        </span>
                        <span className="text-gray-400 ml-2">
                          ({participant.rank})
                        </span>
                        {participant.guild_name && (
                          <Badge variant="outline" className="ml-2">
                            {participant.guild_name}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-amber-400">
                          Score: {participant.contribution_score}
                        </div>
                        <div className="text-xs text-gray-400">
                          Level {participant.level}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-4 text-gray-400">
                No participants yet
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="objects" className="space-y-4">
          <div className="space-y-2">
            {details.objects?.length > 0 ? (
              details.objects.map((object: EventObject) => (
                <Card key={object.id} className="bg-gray-700 border-gray-600">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-blue-400 font-medium">
                          {object.object_name}
                        </span>
                        <Badge variant="outline" className="ml-2">
                          {object.object_type}
                        </Badge>
                        <Badge variant="secondary" className="ml-2">
                          {object.object_class}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        {object.can_be_scanned && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              onInteractObject(event.id, object.id, "scan")
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        {object.can_be_collected && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              onInteractObject(event.id, object.id, "collect")
                            }
                          >
                            <Hand className="w-4 h-4" />
                          </Button>
                        )}
                        {object.can_be_activated && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              onInteractObject(event.id, object.id, "activate")
                            }
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mt-2">
                      {object.description}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-4 text-gray-400">
                No objects available
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="missions" className="space-y-4">
          <div className="space-y-2">
            {details.missions?.length > 0 ? (
              details.missions.map((mission: EventMission) => (
                <Card key={mission.id} className="bg-gray-700 border-gray-600">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="text-blue-400 font-medium">
                          {mission.mission_name}
                        </span>
                        <Badge variant="outline" className="ml-2">
                          {mission.mission_type}
                        </Badge>
                        <Badge variant="secondary" className="ml-2">
                          {mission.mission_category}
                        </Badge>
                      </div>
                      <Badge
                        variant={
                          mission.mission_status === "active"
                            ? "default"
                            : mission.mission_status === "available"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {mission.mission_status}
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">
                      {mission.description}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>
                        Participants: {mission.current_participants}/
                        {mission.max_participants}
                      </span>
                      {mission.completion_rewards && (
                        <span className="text-green-400">
                          <Gift className="w-3 h-3 inline mr-1" />
                          Rewards Available
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-4 text-gray-400">
                No missions available
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UniverseEvents;
