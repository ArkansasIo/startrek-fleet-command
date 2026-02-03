// GameLiveStats.tsx
// Displays live game stats from GameContext

import React from "react";
import { useGameContext } from "../../lib/MMORPGGameEngine";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export const GameLiveStats: React.FC = () => {
  const { player, game } = useGameContext();

  // Handle null player gracefully
  if (!player) {
    return (
      <Card className="bg-trek-panel border-trek-accent mb-4">
        <CardHeader>
          <CardTitle className="text-trek-gold">Game Live Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-trek-text/70 text-center py-4">
            Initializing player data...
          </div>
        </CardContent>
      </Card>
    );
  }

  const researchCount = (() => {
    const maybePlayer = player as unknown as {
      research?: Record<string, number>;
      researches?: Record<string, number>;
    };

    if (maybePlayer.research) {
      return Object.keys(maybePlayer.research).length;
    }

    if (maybePlayer.researches) {
      return Object.keys(maybePlayer.researches).length;
    }

    return 0;
  })();

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
            <div className="text-trek-gold font-bold">{game.turn || 0}</div>
          </div>
          <div>
            <div className="text-xs text-trek-text/70">Credits</div>
            <div className="text-green-400 font-bold">{player.resources?.credits || 0}</div>
          </div>
          <div>
            <div className="text-xs text-trek-text/70">Planets Owned</div>
            <div className="text-trek-blue font-bold">{player.planets?.length || 0}</div>
          </div>
          <div>
            <div className="text-xs text-trek-text/70">Fleet Size</div>
            <div className="text-trek-blue font-bold">{player.fleets ? Object.values(player.fleets).reduce((a, b) => a + b, 0) : 0}</div>
          </div>
          <div>
            <div className="text-xs text-trek-text/70">Buildings</div>
            <div className="text-trek-blue font-bold">{player.buildings ? Object.keys(player.buildings).length : 0}</div>
          </div>
          <div>
            <div className="text-xs text-trek-text/70">Research</div>
            <div className="text-trek-blue font-bold">{researchCount}</div>
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
