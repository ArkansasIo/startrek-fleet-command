import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

interface CharacterCreationFlowProps {
  onComplete: (character: any) => void;
  onCancel: () => void;
}

const DIVISIONS = [
  { id: "command", name: "Command", description: "Leadership & Strategy", color: "text-trek-gold" },
  { id: "operations", name: "Operations", description: "Ship Systems & Engineering", color: "text-trek-blue" },
  { id: "sciences", name: "Sciences", description: "Research & Discovery", color: "text-trek-green" },
  { id: "security", name: "Security", description: "Tactical & Defense", color: "text-red-400" },
  { id: "medical", name: "Medical", description: "Healing & Support", color: "text-trek-text" },
  { id: "engineering", name: "Engineering", description: "Ships & Technology", color: "text-orange-400" },
];

const EMPIRES = [
  {
    id: "federation",
    name: "United Federation of Planets",
    description: "Explorers & peacekeepers committed to peaceful coexistence.",
    homeworld: "Earth",
    military: 85,
    technology: 90,
    diplomacy: 95,
    fleet_size: 2847,
    special_trait: "Diplomatic Bonus - +15% Alliance Benefits",
    bonuses: ["Research Speed +10%", "Diplomacy +15%", "Crew Morale +10%"],
  },
  {
    id: "klingon",
    name: "Klingon Empire",
    description: "Warriors seeking honor through conquest and battle.",
    homeworld: "Qo'noS",
    military: 95,
    technology: 75,
    diplomacy: 60,
    fleet_size: 1543,
    special_trait: "Combat Mastery - +20% Damage Output",
    bonuses: ["Combat Damage +20%", "Crew Strength +15%", "Hull Armor +10%"],
  },
  {
    id: "romulan",
    name: "Romulan Star Empire",
    description: "Strategic masterminds balancing war and diplomacy.",
    homeworld: "Romulus",
    military: 90,
    technology: 88,
    diplomacy: 75,
    fleet_size: 1821,
    special_trait: "Cloaking Tech - Can Hide Fleet From Scans (30min/day)",
    bonuses: ["Stealth +20%", "Espionage +15%", "Technology +10%"],
  },
  {
    id: "cardassian",
    name: "Cardassian Union",
    description: "Militaristic conquerors expanding their territory.",
    homeworld: "Cardassia Prime",
    military: 92,
    technology: 80,
    diplomacy: 50,
    fleet_size: 1634,
    special_trait: "Occupation Doctrine - +20% Territory Control",
    bonuses: ["Territory Control +20%", "Resource Gathering +15%", "Military Production +10%"],
  },
  {
    id: "ferengi",
    name: "Ferengi Alliance",
    description: "Shrewd merchants pursuing profit and commerce.",
    homeworld: "Ferenginar",
    military: 60,
    technology: 85,
    diplomacy: 80,
    fleet_size: 945,
    special_trait: "Profit Motive - +25% Trading Revenue & Market Influence",
    bonuses: ["Trading Revenue +25%", "Market Influence +20%", "Profit Margin +15%"],
  },
];

export function CharacterCreationFlow({ onComplete, onCancel }: CharacterCreationFlowProps) {
  const [step, setStep] = useState(0);
  const [character, setCharacter] = useState({
    name: "",
    rank: "Ensign",
    division: "command",
    empire: "federation",
    ship: "",
    description: "",
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCharacter({ ...character, name: e.target.value });
  };

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else onComplete(character);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const isStepValid = () => {
    if (step === 0) return character.name.trim().length >= 3;
    if (step === 1) return true;
    if (step === 2) return character.ship.trim().length >= 3;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-trek-dark via-blue-950 to-trek-dark p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-trek-gold mb-2">STARFLEET ACADEMY</h1>
          <p className="text-trek-text/70">Officer Creation & Assignment</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-trek-text/60 mb-2">
            <span>Step {step + 1} of 3</span>
            <span>{Math.round(((step + 1) / 3) * 100)}%</span>
          </div>
          <Progress value={((step + 1) / 3) * 100} className="h-2" />
        </div>

        {/* Step 1: Character Name & Division */}
        {step === 0 && (
          <Card className="bg-trek-panel border-trek-blue mb-6">
            <CardHeader>
              <CardTitle className="text-trek-gold">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-trek-text mb-2 font-semibold">Officer Name</label>
                <Input
                  placeholder="Enter your character name"
                  value={character.name}
                  onChange={handleNameChange}
                  className="bg-trek-dark border-trek-blue text-trek-text"
                  maxLength={30}
                />
                <p className="text-xs text-trek-text/60 mt-1">{character.name.length}/30 characters</p>
              </div>

              <div>
                <label className="block text-trek-text mb-3 font-semibold">Choose Division</label>
                <div className="grid grid-cols-2 gap-3">
                  {DIVISIONS.map((div) => (
                    <button
                      key={div.id}
                      onClick={() => setCharacter({ ...character, division: div.id })}
                      className={`p-4 rounded border-2 text-left transition ${
                        character.division === div.id
                          ? "border-trek-gold bg-trek-gold/10"
                          : "border-trek-blue/50 bg-trek-panel hover:border-trek-gold/50"
                      }`}
                    >
                      <div className={`font-bold ${div.color}`}>{div.name}</div>
                      <div className="text-xs text-trek-text/60">{div.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-trek-text mb-2 font-semibold">Starting Rank</label>
                <select
                  value={character.rank}
                  onChange={(e) => setCharacter({ ...character, rank: e.target.value })}
                  className="w-full bg-trek-dark border border-trek-blue text-trek-text p-2 rounded"
                >
                  <option value="Ensign">Ensign</option>
                  <option value="Lieutenant Junior Grade">Lieutenant Junior Grade</option>
                  <option value="Lieutenant">Lieutenant</option>
                </select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Empire Selection */}
        {step === 1 && (
          <Card className="bg-trek-panel border-trek-blue mb-6">
            <CardHeader>
              <CardTitle className="text-trek-gold">Choose Your Empire</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {EMPIRES.map((empire) => (
                <button
                  key={empire.id}
                  onClick={() => setCharacter({ ...character, empire: empire.id })}
                  className={`p-4 rounded border-2 text-left transition ${
                    character.empire === empire.id
                      ? "border-trek-gold bg-trek-gold/10"
                      : "border-trek-blue/50 bg-trek-panel hover:border-trek-gold/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="font-bold text-trek-gold text-lg">{empire.name}</div>
                      <div className="text-sm text-trek-text/70 mb-2">{empire.description}</div>
                      <div className="text-xs text-trek-text/60">Homeworld: {empire.homeworld}</div>
                    </div>
                    {character.empire === empire.id && (
                      <Check className="w-5 h-5 text-trek-gold mt-1 flex-shrink-0 ml-2" />
                    )}
                  </div>

                  {/* Empire Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-trek-dark/50 p-2 rounded border border-trek-blue/30">
                      <div className="text-xs text-trek-text/60">Military</div>
                      <div className="text-sm font-bold text-red-400">{empire.military}%</div>
                    </div>
                    <div className="bg-trek-dark/50 p-2 rounded border border-trek-blue/30">
                      <div className="text-xs text-trek-text/60">Technology</div>
                      <div className="text-sm font-bold text-trek-blue">{empire.technology}%</div>
                    </div>
                    <div className="bg-trek-dark/50 p-2 rounded border border-trek-blue/30">
                      <div className="text-xs text-trek-text/60">Diplomacy</div>
                      <div className="text-sm font-bold text-trek-green">{empire.diplomacy}%</div>
                    </div>
                  </div>

                  {/* Fleet & Bonuses */}
                  <div className="mb-2">
                    <div className="text-xs text-trek-text/60">Active Fleet: {empire.fleet_size.toLocaleString()} vessels</div>
                    <div className="text-xs font-semibold text-trek-gold mt-1">{empire.special_trait}</div>
                  </div>

                  {/* Stat Bars */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-trek-text/60">Military</span>
                      <div className="flex-1 bg-trek-dark/50 rounded h-1.5">
                        <div
                          className="bg-red-500/70 h-1.5 rounded"
                          style={{ width: `${empire.military}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-trek-text/60">Tech</span>
                      <div className="flex-1 bg-trek-dark/50 rounded h-1.5">
                        <div
                          className="bg-blue-500/70 h-1.5 rounded"
                          style={{ width: `${empire.technology}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-trek-text/60">Diplo</span>
                      <div className="flex-1 bg-trek-dark/50 rounded h-1.5">
                        <div
                          className="bg-green-500/70 h-1.5 rounded"
                          style={{ width: `${empire.diplomacy}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Starship Assignment */}
        {step === 2 && (
          <Card className="bg-trek-panel border-trek-blue mb-6">
            <CardHeader>
              <CardTitle className="text-trek-gold">Ship Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-trek-text mb-2 font-semibold">Commanding Vessel</label>
                <Input
                  placeholder="e.g., USS Enterprise NCC-1701-D"
                  value={character.ship}
                  onChange={(e) => setCharacter({ ...character, ship: e.target.value })}
                  className="bg-trek-dark border-trek-blue text-trek-text"
                  maxLength={50}
                />
                <p className="text-xs text-trek-text/60 mt-1">{character.ship.length}/50 characters</p>
              </div>

              <div>
                <label className="block text-trek-text mb-2 font-semibold">Biography</label>
                <textarea
                  placeholder="Describe your character's background and aspirations..."
                  value={character.description}
                  onChange={(e) => setCharacter({ ...character, description: e.target.value })}
                  className="w-full bg-trek-dark border border-trek-blue text-trek-text p-2 rounded h-32 resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-trek-text/60 mt-1">{character.description.length}/500 characters</p>
              </div>

              {/* Preview */}
              <div className="bg-trek-dark border border-trek-blue/50 rounded p-4 space-y-2">
                <h3 className="font-bold text-trek-gold text-sm">Character Summary</h3>
                <div className="text-sm space-y-1">
                  <p><span className="text-trek-blue">Name:</span> {character.name || "Not entered"}</p>
                  <p><span className="text-trek-blue">Rank:</span> {character.rank}</p>
                  <p><span className="text-trek-blue">Division:</span> {DIVISIONS.find(d => d.id === character.division)?.name}</p>
                  <p><span className="text-trek-blue">Empire:</span> {EMPIRES.find(e => e.id === character.empire)?.name}</p>
                  <p><span className="text-trek-blue">Ship:</span> {character.ship || "Not assigned"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <Button
            onClick={handlePrev}
            disabled={step === 0}
            variant="outline"
            className="border-trek-blue text-trek-blue hover:bg-trek-blue/10"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={onCancel}
            variant="ghost"
            className="text-trek-text/70 hover:text-trek-text"
          >
            Cancel
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="bg-trek-gold hover:bg-trek-gold/90 text-trek-dark font-bold"
          >
            {step === 2 ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Create Officer
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
