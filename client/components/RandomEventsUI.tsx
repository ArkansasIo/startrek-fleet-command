import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
  Shield,
  Heart,
  Flame,
  Wind,
  Wrench,
} from "lucide-react";

type EventType = "combat" | "anomaly" | "encounter" | "disaster" | "opportunity" | "discovery" | "diplomatic" | "technical";
type EventSeverity = "minor" | "moderate" | "major" | "critical";
type EventOutcome = "positive" | "negative" | "neutral" | "choice";

interface RandomEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  severity: EventSeverity;
  outcome: EventOutcome;
  impact: {
    crew?: number;
    hull?: number;
    shields?: number;
    resources?: { [key: string]: number };
    reputation?: number;
  };
  duration_minutes: number;
  choices?: {
    id: string;
    text: string;
    consequence: string;
  }[];
  timestamp: Date;
}

interface EventLog {
  event: RandomEvent;
  resolved: boolean;
  choice_made?: string;
  result: string;
}

export function RandomEventsUI() {
  const [events, setEvents] = useState<RandomEvent[]>([
    {
      id: "evt_001",
      type: "combat",
      title: "Klingon Warbird Detected",
      description: "Long-range sensors have detected a Klingon D7-class warbird approaching on an intercept course.",
      severity: "major",
      outcome: "choice",
      impact: { hull: -500, shields: -1000, crew: -50 },
      duration_minutes: 45,
      choices: [
        {
          id: "choice_1",
          text: "Engage in combat",
          consequence: "High risk, potential victory or defeat",
        },
        {
          id: "choice_2",
          text: "Attempt to flee",
          consequence: "Damage to engines, minor crew casualties",
        },
        {
          id: "choice_3",
          text: "Open diplomatic channel",
          consequence: "Peaceful resolution, gained 50 reputation",
        },
      ],
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
    },
    {
      id: "evt_002",
      type: "anomaly",
      title: "Spatial Distortion Detected",
      description: "Unusual subspace readings indicate a temporal anomaly forming nearby.",
      severity: "moderate",
      outcome: "choice",
      impact: { resources: { "Energy": -200 } },
      duration_minutes: 30,
      choices: [
        {
          id: "choice_1",
          text: "Investigate the anomaly",
          consequence: "Gain scientific data, 1000 research points",
        },
        {
          id: "choice_2",
          text: "Avoid the anomaly",
          consequence: "Safe but miss opportunity",
        },
      ],
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: "evt_003",
      type: "discovery",
      title: "Derelict Vessel Found",
      description: "Sensors indicate an abandoned starship drifting in this sector, possible salvage opportunity.",
      severity: "minor",
      outcome: "positive",
      impact: { resources: { "Dilithium": 150, "Tritanium": 200 }, reputation: 25 },
      duration_minutes: 60,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      id: "evt_004",
      type: "technical",
      title: "Warp Core Fluctuation",
      description: "Unexpected power surges detected in the warp core. Immediate attention required.",
      severity: "critical",
      outcome: "choice",
      impact: { hull: -100, crew: -25 },
      duration_minutes: 20,
      choices: [
        {
          id: "choice_1",
          text: "Manual shutdown procedure",
          consequence: "Safe but loses warp capability for 2 hours",
        },
        {
          id: "choice_2",
          text: "Reroute through secondary systems",
          consequence: "50% success rate, risky",
        },
      ],
      timestamp: new Date(),
    },
  ]);

  const [eventLog, setEventLog] = useState<EventLog[]>([
    {
      event: {
        id: "log_001",
        type: "encounter",
        title: "Friendly Trader Encounter",
        description: "Ferengi merchant vessel requesting trade",
        severity: "minor",
        outcome: "positive",
        impact: { resources: { "Gold Pressed Latinum": 500 }, reputation: 15 },
        duration_minutes: 45,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      resolved: true,
      choice_made: "Trade 10,000 credits for supplies",
      result: "Successful trade completed, gained valuable resources",
    },
    {
      event: {
        id: "log_002",
        type: "disaster",
        title: "Asteroid Field Collision",
        description: "Uncharted asteroid field caused significant damage",
        severity: "major",
        outcome: "negative",
        impact: { hull: -2000, crew: -150, shields: -500 },
        duration_minutes: 120,
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      },
      resolved: true,
      choice_made: "Emergency repairs",
      result: "Managed to escape, significant damage but crew safe",
    },
  ]);

  const [selectedEventId, setSelectedEventId] = useState<string | null>("evt_004");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const selectedEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId);
  }, [events, selectedEventId]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (filterType !== "all" && e.type !== filterType) return false;
      if (filterSeverity !== "all" && e.severity !== filterSeverity) return false;
      return true;
    });
  }, [events, filterType, filterSeverity]);

  const stats = useMemo(() => {
    const active = events.length;
    const resolved = eventLog.length;
    const critical = events.filter((e) => e.severity === "critical").length;

    return { active, resolved, critical };
  }, [events, eventLog]);

  const getSeverityColor = (severity: EventSeverity) => {
    switch (severity) {
      case "minor":
        return "bg-green-500";
      case "moderate":
        return "bg-blue-500";
      case "major":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: EventType) => {
    const icons: Record<EventType, any> = {
      combat: <Zap className="h-5 w-5" />,
      anomaly: <Target className="h-5 w-5" />,
      encounter: <Shield className="h-5 w-5" />,
      disaster: <Flame className="h-5 w-5" />,
      opportunity: <TrendingUp className="h-5 w-5" />,
      discovery: <CheckCircle2 className="h-5 w-5" />,
      diplomatic: <Heart className="h-5 w-5" />,
      technical: <Wrench className="h-5 w-5" />,
    };
    return icons[type] || <Zap className="h-5 w-5" />;
  };

  const handleResolveEvent = (eventId: string, choiceId?: string) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    const newLog: EventLog = {
      event,
      resolved: true,
      choice_made: choiceId
        ? event.choices?.find((c) => c.id === choiceId)?.text
        : "Automatic resolution",
      result: `Event resolved: ${event.title}`,
    };

    setEventLog((prev) => [newLog, ...prev]);
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    if (selectedEventId === eventId) setSelectedEventId(null);
  };

  const handleGenerateEvent = () => {
    const eventTypes: EventType[] = [
      "combat",
      "anomaly",
      "encounter",
      "disaster",
      "opportunity",
      "discovery",
      "diplomatic",
      "technical",
    ];
    const severities: EventSeverity[] = ["minor", "moderate", "major", "critical"];
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const randomSeverity = severities[Math.floor(Math.random() * severities.length)];

    const newEvent: RandomEvent = {
      id: `evt_${Date.now()}`,
      type: randomType,
      title: `Random ${randomType.charAt(0).toUpperCase() + randomType.slice(1)} Event`,
      description: "A new random event has been generated.",
      severity: randomSeverity,
      outcome: "choice",
      impact: {
        crew: Math.floor(Math.random() * -100),
        hull: Math.floor(Math.random() * -500),
      },
      duration_minutes: Math.floor(Math.random() * 120) + 10,
      choices: [
        { id: "choice_1", text: "Option 1", consequence: "Consequence 1" },
        { id: "choice_2", text: "Option 2", consequence: "Consequence 2" },
      ],
      timestamp: new Date(),
    };

    setEvents((prev) => [newEvent, ...prev]);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Random Events System</h1>
          <p className="text-muted-foreground mt-1">
            Dynamic events that impact your fleet during gameplay
          </p>
        </div>
        <Button onClick={handleGenerateEvent}>
          <Zap className="h-4 w-4 mr-2" />
          Generate Random Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Active Events</p>
            <p className="text-2xl font-bold text-yellow-500">{stats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Resolved Events</p>
            <p className="text-2xl font-bold text-green-500">{stats.resolved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Critical Events</p>
            <p className={`text-2xl font-bold ${stats.critical > 0 ? "text-red-500" : "text-green-500"}`}>
              {stats.critical}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Events</TabsTrigger>
          <TabsTrigger value="log">Event Log</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <select
              className="border rounded px-3 py-2"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="combat">Combat</option>
              <option value="anomaly">Anomaly</option>
              <option value="encounter">Encounter</option>
              <option value="disaster">Disaster</option>
              <option value="opportunity">Opportunity</option>
              <option value="discovery">Discovery</option>
              <option value="diplomatic">Diplomatic</option>
              <option value="technical">Technical</option>
            </select>

            <select
              className="border rounded px-3 py-2"
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
            >
              <option value="all">All Severity</option>
              <option value="minor">Minor</option>
              <option value="moderate">Moderate</option>
              <option value="major">Major</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-3 pr-4">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className={`cursor-pointer ${selectedEventId === event.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedEventId(event.id)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-primary/10">{getTypeIcon(event.type)}</div>
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                      </div>
                      <Badge className={`${getSeverityColor(event.severity)} text-white`}>
                        {event.severity.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {event.duration_minutes}m duration
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="log">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3 pr-4">
              {eventLog.map((log, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{log.event.title}</h3>
                        <p className="text-sm text-muted-foreground">{log.result}</p>
                      </div>
                      <Badge className="bg-green-500 text-white">RESOLVED</Badge>
                    </div>
                    {log.choice_made && (
                      <p className="text-xs text-muted-foreground mt-2">
                        <strong>Choice:</strong> {log.choice_made}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {selectedEvent && (
        <Card className="border-2 border-primary">
          <CardContent className="pt-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">{selectedEvent.title}</h2>
              <p className="text-muted-foreground">{selectedEvent.description}</p>
            </div>

            {selectedEvent.impact && (
              <div className="mb-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Impact:</p>
                <div className="space-y-1 text-sm">
                  {selectedEvent.impact.crew && (
                    <p className="text-red-500">Crew: {selectedEvent.impact.crew}</p>
                  )}
                  {selectedEvent.impact.hull && (
                    <p className="text-orange-500">Hull: {selectedEvent.impact.hull}</p>
                  )}
                  {selectedEvent.impact.shields && (
                    <p className="text-blue-500">Shields: {selectedEvent.impact.shields}</p>
                  )}
                  {selectedEvent.impact.reputation && (
                    <p className="text-green-500">Reputation: {selectedEvent.impact.reputation}</p>
                  )}
                </div>
              </div>
            )}

            {selectedEvent.choices && selectedEvent.choices.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Choose an action:</p>
                {selectedEvent.choices.map((choice) => (
                  <Button
                    key={choice.id}
                    variant="outline"
                    className="w-full justify-start h-auto"
                    onClick={() => handleResolveEvent(selectedEvent.id, choice.id)}
                  >
                    <div className="text-left">
                      <p className="font-medium">{choice.text}</p>
                      <p className="text-xs text-muted-foreground">{choice.consequence}</p>
                    </div>
                  </Button>
                ))}
              </div>
            )}

            {!selectedEvent.choices && (
              <Button
                onClick={() => handleResolveEvent(selectedEvent.id)}
                className="w-full"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Resolve Event
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
