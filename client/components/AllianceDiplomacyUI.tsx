import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  Heart,
  Target,
  AlertTriangle,
  CheckCircle2,
  Shield,
  TrendingUp,
  Swords,
} from "lucide-react";

interface Faction {
  id: string;
  name: string;
  relationship: number;
  status: "allied" | "friendly" | "neutral" | "unfriendly" | "hostile" | "war";
  territory_count: number;
  military_strength: number;
  trade_volume: number;
  active_treaties: string[];
  diplomatic_stance: "aggressive" | "neutral" | "peaceful";
}

interface Treaty {
  id: string;
  faction_id: string;
  type: "trade" | "military" | "research" | "non_aggression" | "peace";
  duration_days: number;
  benefits: string[];
  expiration: Date;
}

export function AllianceDiplomacyUI() {
  const [selectedFactionId, setSelectedFactionId] = useState<string>("faction_001");
  const [playerReputation] = useState<number>(1850);

  const [factions, setFactions] = useState<Faction[]>([
    {
      id: "faction_001",
      name: "United Federation of Planets",
      relationship: 85,
      status: "allied",
      territory_count: 150,
      military_strength: 8500,
      trade_volume: 450000,
      active_treaties: ["trade", "military", "research"],
      diplomatic_stance: "peaceful",
    },
    {
      id: "faction_002",
      name: "Klingon Empire",
      relationship: 45,
      status: "neutral",
      territory_count: 120,
      military_strength: 12000,
      trade_volume: 120000,
      active_treaties: ["non_aggression"],
      diplomatic_stance: "aggressive",
    },
    {
      id: "faction_003",
      name: "Romulan Star Empire",
      relationship: -25,
      status: "unfriendly",
      territory_count: 95,
      military_strength: 9500,
      trade_volume: 0,
      active_treaties: [],
      diplomatic_stance: "aggressive",
    },
    {
      id: "faction_004",
      name: "Ferengi Alliance",
      relationship: 60,
      status: "friendly",
      territory_count: 45,
      military_strength: 3500,
      trade_volume: 280000,
      active_treaties: ["trade"],
      diplomatic_stance: "neutral",
    },
  ]);

  const [treaties] = useState<Treaty[]>([
    {
      id: "treaty_001",
      faction_id: "faction_001",
      type: "military",
      duration_days: 365,
      benefits: ["Military Support", "+10% Fleet Power", "Joint Defense"],
      expiration: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000),
    },
    {
      id: "treaty_002",
      faction_id: "faction_001",
      type: "trade",
      duration_days: 180,
      benefits: ["+15% Trade Profits", "Market Access"],
      expiration: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
    },
  ]);

  const selectedFaction = useMemo(() => {
    return factions.find((f) => f.id === selectedFactionId);
  }, [factions, selectedFactionId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "allied":
        return "bg-green-500";
      case "friendly":
        return "bg-blue-500";
      case "neutral":
        return "bg-gray-500";
      case "unfriendly":
        return "bg-yellow-500";
      case "hostile":
        return "bg-orange-500";
      case "war":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRelationshipColor = (relationship: number) => {
    if (relationship >= 80) return "text-green-500";
    if (relationship >= 50) return "text-blue-500";
    if (relationship >= 20) return "text-gray-500";
    if (relationship >= 0) return "text-yellow-500";
    if (relationship >= -50) return "text-orange-500";
    return "text-red-500";
  };

  const handleDiplomaticAction = (factionId: string, action: string) => {
    setFactions((prev) =>
      prev.map((faction) => {
        if (faction.id !== factionId) return faction;
        let newRelationship = faction.relationship;
        switch (action) {
          case "negotiate":
            newRelationship += 10;
            break;
          case "gift":
            newRelationship += 20;
            break;
          case "threaten":
            newRelationship -= 25;
            break;
          case "trade_agreement":
            newRelationship += 15;
            break;
        }
        newRelationship = Math.max(-100, Math.min(100, newRelationship));
        const newStatus =
          newRelationship >= 80
            ? "allied"
            : newRelationship >= 50
            ? "friendly"
            : newRelationship >= 20
            ? "neutral"
            : newRelationship >= 0
            ? "unfriendly"
            : newRelationship >= -50
            ? "hostile"
            : "war";
        return { ...faction, relationship: newRelationship, status: newStatus as any };
      })
    );
  };

  if (!selectedFaction) {
    return <div className="p-6 text-muted-foreground">No faction selected</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alliance & Diplomacy</h1>
          <p className="text-muted-foreground mt-1">Manage relationships with galactic powers</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Heart className="h-4 w-4 mr-1" />
          {playerReputation} Reputation
        </Badge>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2 flex-wrap">
            {factions.map((faction) => (
              <Button
                key={faction.id}
                variant={selectedFactionId === faction.id ? "default" : "outline"}
                onClick={() => setSelectedFactionId(faction.id)}
              >
                <Users className="h-4 w-4 mr-2" />
                {faction.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Relationship</p>
            <p className={`text-2xl font-bold ${getRelationshipColor(selectedFaction.relationship)}`}>
              {selectedFaction.relationship > 0 ? "+" : ""}
              {selectedFaction.relationship}
            </p>
            <Progress value={(selectedFaction.relationship + 100) / 2} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge className={`${getStatusColor(selectedFaction.status)} text-white mt-2`}>
              {selectedFaction.status.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Military Strength</p>
            <p className="text-2xl font-bold">{selectedFaction.military_strength.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Trade Volume</p>
            <p className="text-2xl font-bold">{(selectedFaction.trade_volume / 1000).toFixed(0)}k</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="relations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="relations">Faction Relations</TabsTrigger>
          <TabsTrigger value="actions">Diplomatic Actions</TabsTrigger>
          <TabsTrigger value="treaties">Active Treaties</TabsTrigger>
        </TabsList>

        <TabsContent value="relations">
          <ScrollArea className="h-[400px]">
            <div className="space-y-3 pr-4">
              {factions.map((faction) => (
                <Card key={faction.id}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{faction.name}</h3>
                        <p className="text-sm text-muted-foreground">{faction.territory_count} territories</p>
                      </div>
                      <Badge className={`${getStatusColor(faction.status)} text-white`}>
                        {faction.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Relationship</span>
                        <span className={getRelationshipColor(faction.relationship)}>
                          {faction.relationship > 0 ? "+" : ""}
                          {faction.relationship}
                        </span>
                      </div>
                      <Progress value={(faction.relationship + 100) / 2} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="actions">
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDiplomaticAction(selectedFaction.id, "negotiate")}
            >
              <Users className="h-4 w-4 mr-2" />
              Negotiate (+10 Relationship)
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDiplomaticAction(selectedFaction.id, "gift")}
            >
              <Heart className="h-4 w-4 mr-2" />
              Present Gift (+20 Relationship)
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDiplomaticAction(selectedFaction.id, "trade_agreement")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Trade Agreement (+15 Relationship)
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={() => handleDiplomaticAction(selectedFaction.id, "threaten")}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Issue Threat (-25 Relationship)
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="treaties">
          <ScrollArea className="h-[400px]">
            <div className="space-y-3 pr-4">
              {treaties
                .filter((t) => t.faction_id === selectedFaction.id)
                .map((treaty) => (
                  <Card key={treaty.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold capitalize">{treaty.type} Treaty</h3>
                          <p className="text-sm text-muted-foreground">
                            Expires: {treaty.expiration.toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Benefits:</p>
                        <ul className="space-y-1">
                          {treaty.benefits.map((benefit, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
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
