import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Radio,
  Send,
  MessageSquare,
  Phone,
  AlertTriangle,
  Clock,
  CheckCircle2,
  X,
  Info,
  Volume2,
  Archive,
  Trash2,
} from "lucide-react";

type MessageType = "hail" | "distress" | "subspace" | "internal" | "diplomatic" | "emergency";
type MessageStatus = "sent" | "received" | "pending" | "failed";
type Priority = "low" | "normal" | "high" | "critical";

interface CommunicationMessage {
  id: string;
  type: MessageType;
  from: string;
  to: string;
  subject: string;
  content: string;
  timestamp: Date;
  status: MessageStatus;
  priority: Priority;
  encryption: "none" | "standard" | "high" | "maximum";
  frequency: string;
}

interface ActiveChannel {
  id: string;
  channel_name: string;
  parties: string[];
  type: "open" | "encrypted" | "secure";
  signal_strength: number;
  duration_seconds: number;
  status: "active" | "on_hold" | "closed";
}

interface ContactRecord {
  id: string;
  call_sign: string;
  vessel_name: string;
  faction: string;
  last_contact: Date;
  communication_count: number;
  status: "friendly" | "neutral" | "hostile" | "unknown";
}

export function CommunicationHailingUI() {
  const [messages, setMessages] = useState<CommunicationMessage[]>([
    {
      id: "msg_001",
      type: "hail",
      from: "USS Enterprise-D",
      to: "Starfleet Command",
      subject: "Status Report",
      content:
        "Routine status report. All systems nominal. Continuing patrol in designated sector. No hostile contacts.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "sent",
      priority: "normal",
      encryption: "standard",
      frequency: "122.4",
    },
    {
      id: "msg_002",
      type: "diplomatic",
      from: "Klingon Battle Cruiser",
      to: "USS Enterprise-D",
      subject: "First Contact Proposal",
      content:
        "We come as warriors to discuss terms of engagement. Propose diplomatic summit at neutral coordinates.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: "received",
      priority: "high",
      encryption: "high",
      frequency: "121.5",
    },
    {
      id: "msg_003",
      type: "subspace",
      from: "Deep Space Nine",
      to: "USS Enterprise-D",
      subject: "Intelligence Report",
      content:
        "Intelligence reports indicate unusual Dominion activity near the Bajoran sector. Recommend heightened alert status.",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: "received",
      priority: "high",
      encryption: "maximum",
      frequency: "120.8",
    },
    {
      id: "msg_004",
      type: "internal",
      from: "Engineering",
      to: "Captain's Ready Room",
      subject: "Warp Core Status",
      content: "Warp core efficiency at 98%. All systems operating within normal parameters.",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      status: "sent",
      priority: "low",
      encryption: "none",
      frequency: "Internal",
    },
    {
      id: "msg_005",
      type: "distress",
      from: "Federation Colony Outpost 7",
      to: "Starfleet Command",
      subject: "DISTRESS SIGNAL",
      content:
        "MAYDAY MAYDAY. Under attack by unidentified hostile forces. Shields failing. Requesting immediate assistance.",
      timestamp: new Date(),
      status: "received",
      priority: "critical",
      encryption: "standard",
      frequency: "121.5",
    },
  ]);

  const [activeChannels, setActiveChannels] = useState<ActiveChannel[]>([
    {
      id: "ch_001",
      channel_name: "Subspace Relay 1",
      parties: ["USS Enterprise-D", "Starfleet Command"],
      type: "secure",
      signal_strength: 95,
      duration_seconds: 145,
      status: "active",
    },
    {
      id: "ch_002",
      channel_name: "Diplomatic Channel",
      parties: ["USS Enterprise-D", "Klingon Battle Cruiser"],
      type: "encrypted",
      signal_strength: 78,
      duration_seconds: 45,
      status: "active",
    },
  ]);

  const [contacts, setContacts] = useState<ContactRecord[]>([
    {
      id: "con_001",
      call_sign: "Enterprise-D",
      vessel_name: "USS Enterprise-D",
      faction: "Federation",
      last_contact: new Date(Date.now() - 2 * 60 * 60 * 1000),
      communication_count: 128,
      status: "friendly",
    },
    {
      id: "con_002",
      call_sign: "IKC Battle Cruiser",
      vessel_name: "Klingon Battle Cruiser",
      faction: "Klingon",
      last_contact: new Date(Date.now() - 30 * 60 * 1000),
      communication_count: 5,
      status: "neutral",
    },
    {
      id: "con_003",
      call_sign: "Romulan Warbird",
      vessel_name: "Romulan Warbird",
      faction: "Romulan",
      last_contact: new Date(Date.now() - 24 * 60 * 60 * 1000),
      communication_count: 3,
      status: "hostile",
    },
  ]);

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>("msg_005");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [hailMessage, setHailMessage] = useState("");

  const selectedMessage = useMemo(() => {
    return messages.find((m) => m.id === selectedMessageId);
  }, [messages, selectedMessageId]);

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (filterType !== "all" && m.type !== filterType) return false;
      if (filterPriority !== "all" && m.priority !== filterPriority) return false;
      return true;
    });
  }, [messages, filterType, filterPriority]);

  const stats = useMemo(() => {
    const unreadCount = messages.filter((m) => m.status === "received").length;
    const activeChannelCount = activeChannels.filter((c) => c.status === "active").length;
    const friendlyContacts = contacts.filter((c) => c.status === "friendly").length;
    const criticalMessages = messages.filter((m) => m.priority === "critical").length;

    return { unreadCount, activeChannelCount, friendlyContacts, criticalMessages };
  }, [messages, activeChannels, contacts]);

  const getMessageColor = (type: MessageType) => {
    switch (type) {
      case "hail":
        return "bg-blue-500";
      case "distress":
        return "bg-red-500";
      case "subspace":
        return "bg-cyan-500";
      case "internal":
        return "bg-gray-500";
      case "diplomatic":
        return "bg-purple-500";
      case "emergency":
        return "bg-red-600";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "low":
        return "bg-green-500";
      case "normal":
        return "bg-blue-500";
      case "high":
        return "bg-yellow-500";
      case "critical":
        return "bg-red-500";
    }
  };

  const getStatusIcon = (status: "friendly" | "neutral" | "hostile" | "unknown") => {
    switch (status) {
      case "friendly":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "neutral":
        return <Info className="h-4 w-4 text-gray-500" />;
      case "hostile":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "unknown":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const handleSendMessage = (recipient: string) => {
    if (!hailMessage.trim()) return;

    const newMessage: CommunicationMessage = {
      id: `msg_${Date.now()}`,
      type: "hail",
      from: "USS Enterprise-D",
      to: recipient,
      subject: "Transmission",
      content: hailMessage,
      timestamp: new Date(),
      status: "sent",
      priority: "normal",
      encryption: "standard",
      frequency: "122.4",
    };

    setMessages((prev) => [newMessage, ...prev]);
    setHailMessage("");
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    if (selectedMessageId === messageId) setSelectedMessageId(null);
  };

  const handleCloseChannel = (channelId: string) => {
    setActiveChannels((prev) =>
      prev.map((c) => (c.id === channelId ? { ...c, status: "closed" } : c))
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communications & Hailing</h1>
          <p className="text-muted-foreground mt-1">
            Manage inter-ship communications and hailing systems
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Unread Messages</p>
            <p className="text-2xl font-bold text-blue-500">{stats.unreadCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Active Channels</p>
            <p className="text-2xl font-bold text-green-500">{stats.activeChannelCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Critical Messages</p>
            <p className={`text-2xl font-bold ${stats.criticalMessages > 0 ? "text-red-500" : "text-green-500"}`}>
              {stats.criticalMessages}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Friendly Contacts</p>
            <p className="text-2xl font-bold text-cyan-500">{stats.friendlyContacts}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="messages" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="channels">Active Channels</TabsTrigger>
          <TabsTrigger value="contacts">Contact Records</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <select
              className="border rounded px-3 py-2"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="hail">Hail</option>
              <option value="distress">Distress</option>
              <option value="subspace">Subspace</option>
              <option value="internal">Internal</option>
              <option value="diplomatic">Diplomatic</option>
              <option value="emergency">Emergency</option>
            </select>

            <select
              className="border rounded px-3 py-2"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ScrollArea className="lg:col-span-2 h-[600px]">
              <div className="space-y-3 pr-4">
                {filteredMessages.map((message) => (
                  <Card
                    key={message.id}
                    className={`cursor-pointer ${selectedMessageId === message.id ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setSelectedMessageId(message.id)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getMessageColor(message.type)}>
                              {message.type.toUpperCase()}
                            </Badge>
                            <Badge className={getPriorityColor(message.priority)}>
                              {message.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <h3 className="font-semibold">{message.subject}</h3>
                          <p className="text-sm text-muted-foreground">
                            From: {message.from} • To: {message.to}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                        <span>
                          {message.timestamp.toLocaleString()}
                        </span>
                        {message.status === "sent" && <span>✓ Sent</span>}
                        {message.status === "received" && (
                          <span className="text-blue-500">◆ Received</span>
                        )}
                        {message.status === "pending" && (
                          <span className="text-yellow-500">⏳ Pending</span>
                        )}
                        {message.status === "failed" && (
                          <span className="text-red-500">✗ Failed</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            {selectedMessage && (
              <Card className="border-2 border-primary lg:col-span-1">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge className={getMessageColor(selectedMessage.type)}>
                          {selectedMessage.type.toUpperCase()}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground">FROM</p>
                      <p className="text-sm font-semibold">{selectedMessage.from}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground">TO</p>
                      <p className="text-sm font-semibold">{selectedMessage.to}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground">SUBJECT</p>
                      <p className="text-sm font-semibold">{selectedMessage.subject}</p>
                    </div>

                    <div className="bg-muted p-3 rounded">
                      <p className="text-xs font-medium text-muted-foreground mb-2">MESSAGE</p>
                      <p className="text-sm">{selectedMessage.content}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-muted p-2 rounded">
                        <p className="text-muted-foreground">Encryption</p>
                        <p className="font-semibold">{selectedMessage.encryption.toUpperCase()}</p>
                      </div>
                      <div className="bg-muted p-2 rounded">
                        <p className="text-muted-foreground">Frequency</p>
                        <p className="font-semibold">{selectedMessage.frequency}</p>
                      </div>
                    </div>

                    {selectedMessage.type === "hail" && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Type response..."
                          value={hailMessage}
                          onChange={(e) => setHailMessage(e.target.value)}
                          className="w-full border rounded px-3 py-2 text-sm"
                        />
                        <Button
                          className="w-full"
                          onClick={() => handleSendMessage(selectedMessage.from)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send Reply
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="channels">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3 pr-4">
              {activeChannels.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    <Radio className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active communication channels.</p>
                  </CardContent>
                </Card>
              ) : (
                activeChannels.map((channel) => (
                  <Card
                    key={channel.id}
                    className={channel.status === "closed" ? "opacity-50" : ""}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{channel.channel_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {channel.parties.join(" ↔ ")}
                          </p>
                        </div>
                        <Badge
                          className={`${
                            channel.status === "active"
                              ? "bg-green-500"
                              : channel.status === "on_hold"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                          } text-white`}
                        >
                          {channel.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div>
                          <p className="text-muted-foreground">Signal</p>
                          <p className="font-semibold">{channel.signal_strength}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Duration</p>
                          <p className="font-semibold">{channel.duration_seconds}s</p>
                        </div>
                      </div>

                      <Badge variant="outline" className="mb-3">
                        {channel.type.toUpperCase()}
                      </Badge>

                      {channel.status === "active" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="w-full"
                          onClick={() => handleCloseChannel(channel.id)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Close Channel
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="contacts">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3 pr-4">
              {contacts.map((contact) => (
                <Card key={contact.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(contact.status)}
                        <div>
                          <h3 className="font-semibold">{contact.vessel_name}</h3>
                          <p className="text-sm text-muted-foreground">{contact.call_sign}</p>
                        </div>
                      </div>
                      <Badge
                        className={`${
                          contact.status === "friendly"
                            ? "bg-green-500"
                            : contact.status === "neutral"
                              ? "bg-gray-500"
                              : contact.status === "hostile"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                        } text-white`}
                      >
                        {contact.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <p className="text-muted-foreground">Faction</p>
                        <p className="font-semibold">{contact.faction}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Communications</p>
                        <p className="font-semibold">{contact.communication_count}</p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3">
                      Last Contact:{" "}
                      {Math.floor((Date.now() - contact.last_contact.getTime()) / 1000 / 60)} minutes ago
                    </p>

                    <Button size="sm" variant="outline" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Hail
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
