import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Radio,
  Users,
  Clock,
  Send,
  PhoneCall,
  AlertTriangle,
  CheckCircle,
  Volume2,
  VolumeX,
  Signal,
  Globe,
} from "lucide-react";

interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
  priority: "Low" | "Normal" | "High" | "Emergency";
  status: "Sent" | "Delivered" | "Read";
  type: "Text" | "Voice" | "Video" | "Data";
  channel: string;
}

interface CommChannel {
  id: string;
  name: string;
  frequency: string;
  status: "Active" | "Standby" | "Offline" | "Encrypted";
  signal_strength: number;
  encryption_level: number;
  participants: string[];
  last_activity: string;
}

interface IncomingTransmission {
  id: string;
  source: string;
  type: "Hail" | "Distress" | "Data" | "Emergency";
  priority: "Low" | "Normal" | "High" | "Emergency";
  timestamp: string;
  preview: string;
}

export function Communications() {
  const [activeTab, setActiveTab] = useState<
    "messages" | "channels" | "incoming"
  >("messages");
  const [selectedChannel, setSelectedChannel] = useState<string | null>(
    "bridge",
  );
  const [newMessage, setNewMessage] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(true);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg1",
      sender: "Starfleet Command",
      recipient: "U.S.S. Enterprise",
      content:
        "Priority mission briefing scheduled for 1600 hours. All senior staff required.",
      timestamp: "15:42:33",
      priority: "High",
      status: "Read",
      type: "Text",
      channel: "command",
    },
    {
      id: "msg2",
      sender: "Deep Space Nine",
      recipient: "U.S.S. Enterprise",
      content: "Docking clearance approved. Bay 3 assigned. Welcome to DS9.",
      timestamp: "15:38:12",
      priority: "Normal",
      status: "Read",
      type: "Text",
      channel: "station",
    },
    {
      id: "msg3",
      sender: "Engineering",
      recipient: "Bridge",
      content: "Warp core temperature rising. Recommend reducing to Warp 6.",
      timestamp: "15:35:45",
      priority: "High",
      status: "Read",
      type: "Text",
      channel: "bridge",
    },
    {
      id: "msg4",
      sender: "Away Team Alpha",
      recipient: "Bridge",
      content:
        "Landing party has reached coordinates. Beginning survey of ruins.",
      timestamp: "15:28:17",
      priority: "Normal",
      status: "Delivered",
      type: "Voice",
      channel: "bridge",
    },
    {
      id: "msg5",
      sender: "Medical",
      recipient: "Bridge",
      content:
        "Casualties from away mission stabilized. Request immediate transport to sickbay.",
      timestamp: "15:15:22",
      priority: "Emergency",
      status: "Read",
      type: "Text",
      channel: "bridge",
    },
  ]);

  const [channels, setChannels] = useState<CommChannel[]>([
    {
      id: "bridge",
      name: "Bridge Operations",
      frequency: "264.7 MHz",
      status: "Active",
      signal_strength: 98,
      encryption_level: 7,
      participants: ["Bridge", "Engineering", "Security", "Medical"],
      last_activity: "15:42:33",
    },
    {
      id: "command",
      name: "Starfleet Command",
      frequency: "847.2 MHz",
      status: "Encrypted",
      signal_strength: 85,
      encryption_level: 10,
      participants: ["Enterprise", "Starfleet Command"],
      last_activity: "15:42:33",
    },
    {
      id: "station",
      name: "Station Communications",
      frequency: "156.8 MHz",
      status: "Active",
      signal_strength: 92,
      encryption_level: 5,
      participants: ["Enterprise", "Deep Space Nine"],
      last_activity: "15:38:12",
    },
    {
      id: "away_team",
      name: "Away Team Alpha",
      frequency: "419.3 MHz",
      status: "Standby",
      signal_strength: 67,
      encryption_level: 6,
      participants: ["Bridge", "Away Team Alpha", "Transporter Room"],
      last_activity: "15:28:17",
    },
    {
      id: "emergency",
      name: "Emergency Frequencies",
      frequency: "121.5 MHz",
      status: "Standby",
      signal_strength: 100,
      encryption_level: 0,
      participants: ["All Starfleet Vessels"],
      last_activity: "14:15:45",
    },
  ]);

  const [incomingTransmissions, setIncomingTransmissions] = useState<
    IncomingTransmission[]
  >([
    {
      id: "inc1",
      source: "Klingon Bird-of-Prey",
      type: "Hail",
      priority: "High",
      timestamp: "15:45:22",
      preview: "This is Commander Worf. Request permission to come aboard...",
    },
    {
      id: "inc2",
      source: "Freighter Kobayashi Maru",
      type: "Distress",
      priority: "Emergency",
      timestamp: "15:43:15",
      preview: "Mayday! Mayday! We are under attack and losing power...",
    },
    {
      id: "inc3",
      source: "Science Station Epsilon-7",
      type: "Data",
      priority: "Normal",
      timestamp: "15:41:08",
      preview: "Transmitting survey data from pulsar research...",
    },
  ]);

  useEffect(() => {
    // Simulate new incoming messages
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newMsg: Message = {
          id: `msg_${Date.now()}`,
          sender: ["Engineering", "Security", "Medical", "Away Team Beta"][
            Math.floor(Math.random() * 4)
          ],
          recipient: "Bridge",
          content: [
            "Systems nominal, all green across the board.",
            "Security sweep complete, deck 7 cleared.",
            "Medical bay standing by for emergencies.",
            "Away team Beta requesting beam up coordinates.",
          ][Math.floor(Math.random() * 4)],
          timestamp: new Date().toLocaleTimeString().slice(0, 8),
          priority: ["Low", "Normal", "High"][
            Math.floor(Math.random() * 3)
          ] as any,
          status: "Delivered",
          type: "Text",
          channel: "bridge",
        };

        setMessages((prev) => [newMsg, ...prev.slice(0, 9)]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChannel) return;

    const message: Message = {
      id: `msg_${Date.now()}`,
      sender: "Bridge",
      recipient:
        channels.find((c) => c.id === selectedChannel)?.name || "Unknown",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString().slice(0, 8),
      priority: "Normal",
      status: "Sent",
      type: "Text",
      channel: selectedChannel,
    };

    setMessages((prev) => [message, ...prev]);
    setNewMessage("");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Emergency":
        return "text-red-400 border-red-400 bg-red-400/20";
      case "High":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Normal":
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
      case "Low":
        return "text-trek-text border-trek-accent bg-trek-accent/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-400 border-green-400 bg-green-400/20";
      case "Encrypted":
        return "text-trek-gold border-trek-gold bg-trek-gold/20";
      case "Standby":
        return "text-yellow-400 border-yellow-400 bg-yellow-400/20";
      case "Offline":
        return "text-red-400 border-red-400 bg-red-400/20";
      default:
        return "text-trek-blue border-trek-blue bg-trek-blue/20";
    }
  };

  const getTransmissionIcon = (type: string) => {
    switch (type) {
      case "Hail":
        return <PhoneCall className="w-4 h-4" />;
      case "Distress":
        return <AlertTriangle className="w-4 h-4" />;
      case "Data":
        return <Signal className="w-4 h-4" />;
      case "Emergency":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Radio className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          SUBSPACE COMMUNICATIONS
        </h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "messages" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "messages"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("messages")}
          >
            <Send className="w-4 h-4 mr-2" />
            Messages
          </Button>
          <Button
            variant={activeTab === "channels" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "channels"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("channels")}
          >
            <Radio className="w-4 h-4 mr-2" />
            Channels
          </Button>
          <Button
            variant={activeTab === "incoming" ? "default" : "outline"}
            size="sm"
            className={
              activeTab === "incoming"
                ? "bg-trek-blue text-trek-dark"
                : "border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
            }
            onClick={() => setActiveTab("incoming")}
          >
            <PhoneCall className="w-4 h-4 mr-2" />
            Incoming
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`${audioEnabled ? "border-trek-blue text-trek-blue" : "border-red-400 text-red-400"}`}
            onClick={() => setAudioEnabled(!audioEnabled)}
          >
            {audioEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {activeTab === "messages" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message Composition */}
          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-4">
              Send Message
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-trek-text/70 mb-2 block">
                  Channel
                </label>
                <select
                  className="w-full bg-trek-accent border border-trek-accent rounded p-2 text-trek-text"
                  value={selectedChannel || ""}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                >
                  {channels.map((channel) => (
                    <option key={channel.id} value={channel.id}>
                      {channel.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-trek-text/70 mb-2 block">
                  Message
                </label>
                <textarea
                  className="w-full bg-trek-accent border border-trek-accent rounded p-2 text-trek-text h-24 resize-none"
                  placeholder="Enter your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
              </div>

              <Button
                className="w-full bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                onClick={sendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </Card>

          {/* Message History */}
          <div className="lg:col-span-2">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-4">
                Recent Communications
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="border border-trek-accent rounded p-3"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-trek-gold">
                          {message.sender}
                        </span>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getPriorityColor(message.priority)}`}
                        >
                          {message.priority}
                        </Badge>
                        {message.type === "Voice" && (
                          <Badge
                            variant="secondary"
                            className="text-xs border-trek-blue text-trek-blue"
                          >
                            <Volume2 className="w-3 h-3 mr-1" />
                            Voice
                          </Badge>
                        )}
                      </div>

                      <div className="text-right text-xs">
                        <div className="text-trek-text/70">
                          {message.timestamp}
                        </div>
                        <div
                          className={`${
                            message.status === "Read"
                              ? "text-green-400"
                              : message.status === "Delivered"
                                ? "text-yellow-400"
                                : "text-trek-blue"
                          }`}
                        >
                          {message.status}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-trek-text/80 mb-1">
                      To: {message.recipient}
                    </div>

                    <div className="text-trek-text">{message.content}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "channels" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channels.map((channel) => (
            <Card
              key={channel.id}
              className="bg-trek-panel border-trek-accent p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-trek-gold" />
                  <div>
                    <h4 className="font-bold text-trek-gold">{channel.name}</h4>
                    <p className="text-sm text-trek-text/70">
                      {channel.frequency}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-xs ${getStatusColor(channel.status)}`}
                >
                  {channel.status}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-trek-text/70">Signal Strength</span>
                  <span className="text-trek-blue">
                    {channel.signal_strength}%
                  </span>
                </div>
                <div className="w-full bg-trek-accent/20 rounded-full h-2">
                  <div
                    className="bg-trek-blue h-2 rounded-full transition-all"
                    style={{ width: `${channel.signal_strength}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-trek-text/70">Encryption</span>
                  <span className="text-trek-gold">
                    {channel.encryption_level}/10
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-trek-text/70">Last Activity</span>
                  <span className="text-trek-blue">
                    {channel.last_activity}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="font-semibold text-trek-gold mb-2">
                  Participants
                </h5>
                <div className="flex flex-wrap gap-1">
                  {channel.participants.map((participant, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="text-xs border-trek-accent text-trek-text"
                    >
                      {participant}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                >
                  <PhoneCall className="w-4 h-4 mr-2" />
                  Open Channel
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Monitor
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "incoming" && (
        <div className="space-y-4">
          {incomingTransmissions.map((transmission) => (
            <Card
              key={transmission.id}
              className="bg-trek-panel border-trek-accent p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-trek-gold text-xl">
                    {getTransmissionIcon(transmission.type)}
                  </span>
                  <div>
                    <h4 className="font-bold text-trek-gold">
                      {transmission.source}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className="text-xs border-trek-blue text-trek-blue"
                      >
                        {transmission.type}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getPriorityColor(transmission.priority)}`}
                      >
                        {transmission.priority} Priority
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="text-right text-sm">
                  <div className="text-trek-text/70">
                    {transmission.timestamp}
                  </div>
                  <div className="text-trek-blue">Awaiting Response</div>
                </div>
              </div>

              <p className="text-trek-text/80 mb-4">{transmission.preview}</p>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-trek-gold text-trek-gold hover:bg-trek-gold hover:text-trek-dark"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Hold
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-400 text-red-400 hover:bg-red-400 hover:text-trek-dark"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Deny
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
