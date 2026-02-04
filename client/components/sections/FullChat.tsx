import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, Send, Trash2 } from "lucide-react";
import { useState } from "react";

interface FullChatProps {
  activeSubmenu?: string;
}

export function FullChat({ activeSubmenu }: FullChatProps) {
  const [activeChannel, setActiveChannel] = useState<"general" | "guild" | "alliance" | "trade">("general");
  const [messages, setMessages] = useState([
    { id: 1, author: "Admiral Picard", channel: "general", text: "Welcome to Starfleet Command!", time: "10:32 AM" },
    { id: 2, author: "Worf", channel: "general", text: "Today is a good day to chat", time: "10:35 AM" },
    { id: 3, author: "Data", channel: "guild", text: "Fascinating analysis of combat tactics", time: "10:40 AM" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const channels = [
    { id: "general", name: "General Chat", icon: "💬", members: 1247 },
    { id: "guild", name: "Guild Chat", icon: "🏰", members: 45 },
    { id: "alliance", name: "Alliance Channel", icon: "🤝", members: 132 },
    { id: "trade", name: "Trade Channel", icon: "💼", members: 324 },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          author: "You",
          channel: activeChannel,
          text: newMessage,
          time: new Date().toLocaleTimeString(),
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full max-h-[85vh]">
      {/* Channel List */}
      <div className="lg:col-span-1 space-y-2">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => setActiveChannel(channel.id as any)}
            className={`w-full text-left p-3 rounded border transition ${
              activeChannel === channel.id
                ? "bg-trek-blue text-trek-dark border-trek-blue"
                : "bg-trek-panel border-trek-accent text-trek-text hover:border-trek-blue"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{channel.icon}</span>
              <div className="flex-1">
                <div className="font-bold text-sm">{channel.name}</div>
                <div className={`text-xs ${activeChannel === channel.id ? "text-trek-dark/70" : "text-trek-text/60"}`}>
                  {channel.members} members
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-3 flex flex-col">
        <Card className="bg-trek-panel border-trek-accent flex-1 flex flex-col">
          <CardHeader className="border-b border-trek-accent">
            <CardTitle className="flex items-center gap-2 text-trek-gold">
              <MessageCircle className="w-5 h-5" />
              {channels.find((c) => c.id === activeChannel)?.name}
            </CardTitle>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages
              .filter((m) => m.channel === activeChannel)
              .map((msg) => (
                <div key={msg.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-trek-gold">{msg.author}</span>
                    <span className="text-xs text-trek-text/50">{msg.time}</span>
                  </div>
                  <div className="bg-trek-dark/50 p-3 rounded border border-trek-blue/30 text-trek-text">
                    {msg.text}
                  </div>
                </div>
              ))}
          </CardContent>

          {/* Input */}
          <div className="border-t border-trek-accent p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 bg-trek-dark border border-trek-blue rounded px-3 py-2 text-trek-text placeholder-trek-text/50 focus:outline-none focus:border-trek-gold"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
