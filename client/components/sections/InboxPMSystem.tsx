// InboxPMSystem.tsx
// Player Message (PM) System: player-to-player, guild, and admin/server messages

import React, { useState } from "react";
import { Message, createMessage, markAsRead, getUnreadMessages } from "../../lib/MessagingSystem";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface InboxPMSystemProps {
  playerId: string;
  guildId?: string;
  messages: Message[];
  onSend: (msg: Message) => void;
}

export const InboxPMSystem: React.FC<InboxPMSystemProps> = ({ playerId, guildId, messages, onSend }) => {
  const [tab, setTab] = useState<'inbox' | 'guild' | 'admin' | 'compose'>('inbox');
  const [composeTo, setComposeTo] = useState("");
  const [composeContent, setComposeContent] = useState("");

  const playerInbox = messages.filter(m => m.to === playerId && !m.guildId && !m.admin);
  const guildInbox = messages.filter(m => m.guildId === guildId);
  const adminInbox = messages.filter(m => m.to === playerId && m.admin);

  const handleSend = () => {
    if (!composeTo || !composeContent) return;
    const msg = createMessage(Math.random().toString(36).slice(2), playerId, composeTo, composeContent);
    onSend(msg);
    setComposeTo("");
    setComposeContent("");
    setTab('inbox');
  };

  return (
    <Card className="bg-trek-panel border-trek-accent">
      <CardHeader>
        <CardTitle className="text-trek-gold">PM Systems Inbox</CardTitle>
        <div className="flex gap-2 mt-2">
          <Button size="sm" onClick={() => setTab('inbox')}>Inbox</Button>
          <Button size="sm" onClick={() => setTab('guild')}>Guild</Button>
          <Button size="sm" onClick={() => setTab('admin')}>Admin</Button>
          <Button size="sm" onClick={() => setTab('compose')}>Compose</Button>
        </div>
      </CardHeader>
      <CardContent>
        {tab === 'inbox' && (
          <div>
            <h4 className="text-trek-blue mb-2">Player Messages</h4>
            {playerInbox.length === 0 ? <div className="text-trek-text/70">No messages.</div> :
              playerInbox.map(msg => (
                <div key={msg.id} className="mb-2 p-2 border-b border-trek-accent/30">
                  <div className="font-bold text-trek-gold">From: {msg.from}</div>
                  <div className="text-trek-text">{msg.content}</div>
                  <div className="text-xs text-trek-text/60">{new Date(msg.timestamp).toLocaleString()}</div>
                </div>
              ))}
          </div>
        )}
        {tab === 'guild' && (
          <div>
            <h4 className="text-trek-blue mb-2">Guild Messages</h4>
            {guildInbox.length === 0 ? <div className="text-trek-text/70">No guild messages.</div> :
              guildInbox.map(msg => (
                <div key={msg.id} className="mb-2 p-2 border-b border-trek-accent/30">
                  <div className="font-bold text-trek-gold">Guild Message</div>
                  <div className="text-trek-text">{msg.content}</div>
                  <div className="text-xs text-trek-text/60">{new Date(msg.timestamp).toLocaleString()}</div>
                </div>
              ))}
          </div>
        )}
        {tab === 'admin' && (
          <div>
            <h4 className="text-trek-blue mb-2">Admin Messages</h4>
            {adminInbox.length === 0 ? <div className="text-trek-text/70">No admin messages.</div> :
              adminInbox.map(msg => (
                <div key={msg.id} className="mb-2 p-2 border-b border-trek-accent/30">
                  <div className="font-bold text-trek-gold">Admin</div>
                  <div className="text-trek-text">{msg.content}</div>
                  <div className="text-xs text-trek-text/60">{new Date(msg.timestamp).toLocaleString()}</div>
                </div>
              ))}
          </div>
        )}
        {tab === 'compose' && (
          <div>
            <h4 className="text-trek-blue mb-2">Compose Message</h4>
            <Input placeholder="To (Player ID)" value={composeTo} onChange={e => setComposeTo(e.target.value)} className="mb-2" />
            <Input placeholder="Message..." value={composeContent} onChange={e => setComposeContent(e.target.value)} className="mb-2" />
            <Button onClick={handleSend} className="bg-trek-accent text-black">Send</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
