// GameLiveStats.tsx
// Displays live game stats from GameContext

import React from "react";
import { useGameContext } from "../../lib/MMORPGGameEngine";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export const GameLiveStats: React.FC = () => {
  const { player, game } = useGameContext();

  return (
    <Card className="bg-trek-panel border-trek-accent mb-4">
      <CardHeader>
        <CardTitle className="text-trek-gold">Game Live Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-trek-text/70">Player</div>
            <div className="text-trek-blue font-bold">{player.name}</div>
          </div>
          <div>
            <div className="text-xs text-trek-text/70">Turn</div>
            <div className="text-trek-gold font-bold">{game.turn}</div>
          </div>
          <div>
            <div className="text-xs text-trek-text/70">Credits</div>
            <div className="text-green-400 font-bold">{player.resources.credits}</div>
          </div>
          <div>
            <div className="text-xs text-trek-text/70">Planets Owned</div>
            <div className="text-trek-blue font-bold">{player.planets.length}</div>
          </div>
          <div>
            <div className="text-xs text-trek-text/70">Fleet Size</div>
            <div className="text-trek-blue font-bold">{Object.values(player.fleets).reduce((a, b) => a + b, 0)}</div>
          </div>
          <div>
            <div className="text-xs text-trek-text/70">Buildings</div>
            <div className="text-trek-blue font-bold">{Object.keys(player.buildings).length}</div>
          </div>
          <div>
            <div className="text-xs text-trek-text/70">Research</div>
            <div className="text-trek-blue font-bold">{Object.keys(player.research).length}</div>
          </div>
          <div>
            <div className="text-xs text-trek-text/70">Alliance</div>
            <div className="text-trek-gold font-bold">{player.alliance || "None"}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
