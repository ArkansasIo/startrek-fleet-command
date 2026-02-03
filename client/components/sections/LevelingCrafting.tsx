import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Crown, Hammer, Sparkles, TrendingUp } from "lucide-react";

interface LevelingCraftingProps {
  activeSubmenu?: string;
}

export const LevelingCrafting: React.FC<LevelingCraftingProps> = ({
  activeSubmenu,
}) => {
  const sectionMap: Record<
    string,
    "levels" | "crafting" | "enhancement" | "integration"
  > = {
    character_levels: "levels",
    crafting_disciplines: "crafting",
    tempering_system: "enhancement",
    masterwork_crafting: "enhancement",
    building_construction: "integration",
    progression_tracking: "integration",
  };
  const activeSection = activeSubmenu ? sectionMap[activeSubmenu] : undefined;
  const showAll = !activeSection;

  const sectionLabelMap: Record<string, string> = {
    character_levels: "Character Levels",
    crafting_disciplines: "Crafting Disciplines",
    tempering_system: "Tempering System",
    masterwork_crafting: "Masterwork Crafting",
    building_construction: "Building Construction",
    progression_tracking: "Progression Tracking",
  };

  return (
    <div className="min-h-screen bg-black text-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-blue-400">
            <Crown className="inline-block w-8 h-8 mr-3" />
            Leveling & Crafting System
          </h1>
          {activeSubmenu && (
            <p className="text-blue-200">
              Focus: {sectionLabelMap[activeSubmenu] || "Overview"}
            </p>
          )}
          <p className="text-blue-300">
            Character progression (1-925), crafting disciplines (1-725),
            tempering (0-10), and masterwork crafting (1-175)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(showAll || activeSection === "levels") && (
            <Card className="bg-gray-800 border-gray-600">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Character Levels (1-925)
                </CardTitle>
                <CardDescription>
                  Progress through 925 character levels across different
                  categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Advanced character progression system with tier-based leveling
                  from novice to legendary status.
                </p>
              </CardContent>
            </Card>
          )}

          {(showAll || activeSection === "crafting") && (
            <Card className="bg-gray-800 border-gray-600">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Hammer className="w-5 h-5 mr-2" />
                  Crafting Disciplines (1-725)
                </CardTitle>
                <CardDescription>
                  Master various crafting disciplines across 725 skill levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Comprehensive crafting system for items, weapons, armor,
                  starships, and buildings.
                </p>
              </CardContent>
            </Card>
          )}

          {(showAll || activeSection === "enhancement") && (
            <Card className="bg-gray-800 border-gray-600">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Enhancement Systems
                </CardTitle>
                <CardDescription>
                  Tempering (0-10) and Masterwork crafting (1-175)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Advanced item enhancement with tempering levels and masterwork
                  quality crafting.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {(showAll || activeSection === "integration") && (
          <div className="mt-8">
            <Card className="bg-gray-800 border-gray-600">
            <CardHeader>
              <CardTitle className="text-blue-400">
                System Integration
              </CardTitle>
              <CardDescription>
                Complete leveling and crafting implementation with database
                backend
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                This system is fully integrated with the database schema and
                game engine, providing:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>
                  • Experience tracking and level progression calculations
                </li>
                <li>• Crafting material requirements and success rates</li>
                <li>• Item tempering with enhancement risks and rewards</li>
                <li>• Masterwork crafting with quality tiers and bonuses</li>
                <li>• Building construction and upgrade systems</li>
                <li>• Progress tracking across all advancement systems</li>
              </ul>
            </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelingCrafting;
