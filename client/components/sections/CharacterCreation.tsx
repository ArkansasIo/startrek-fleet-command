import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  Users,
  Star,
  Shield,
  Zap,
  Brain,
  Heart,
  Eye,
  Wrench,
  Target,
  Award,
  Crown,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Download,
  Upload,
  Sparkles,
} from "lucide-react";

interface StarTrekCharacter {
  id: string;
  name: string;
  species: string;
  homeworld: string;
  rank: string;
  division: string;
  position: string;
  ship_assignment: string;
  age: number;
  height: string;
  weight: string;

  // Physical Attributes
  attributes: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };

  // Skills
  skills: {
    command: number;
    piloting: number;
    engineering: number;
    science: number;
    medical: number;
    security: number;
    diplomacy: number;
    tactics: number;
  };

  // Background
  background: {
    birthplace: string;
    family: string;
    education: string;
    service_record: string[];
    commendations: string[];
    specializations: string[];
  };

  // Traits
  traits: {
    positive: string[];
    negative: string[];
    special_abilities: string[];
  };

  // Equipment
  equipment: {
    weapons: string[];
    tools: string[];
    personal_items: string[];
  };

  // Biography
  biography: string;
  goals: string[];
  personality: string;
  appearance: string;
}

interface CharacterCreationProps {
  activeSubmenu?: string;
}

export function CharacterCreation({ activeSubmenu }: CharacterCreationProps) {
  const defaultTab = "basic";
  const [activeTab, setActiveTab] = useState(activeSubmenu || defaultTab);

  useEffect(() => {
    setActiveTab(activeSubmenu || defaultTab);
  }, [activeSubmenu]);
  const [characters, setCharacters] = useState<StarTrekCharacter[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState<
    Partial<StarTrekCharacter>
  >({
    name: "",
    species: "",
    homeworld: "",
    rank: "",
    division: "",
    position: "",
    ship_assignment: "",
    age: 25,
    height: "",
    weight: "",
    attributes: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    skills: {
      command: 5,
      piloting: 5,
      engineering: 5,
      science: 5,
      medical: 5,
      security: 5,
      diplomacy: 5,
      tactics: 5,
    },
    background: {
      birthplace: "",
      family: "",
      education: "",
      service_record: [],
      commendations: [],
      specializations: [],
    },
    traits: {
      positive: [],
      negative: [],
      special_abilities: [],
    },
    equipment: {
      weapons: [],
      tools: [],
      personal_items: [],
    },
    biography: "",
    goals: [],
    personality: "",
    appearance: "",
  });

  const starTrekSpecies = [
    "Human",
    "Vulcan",
    "Klingon",
    "Romulan",
    "Andorian",
    "Tellarite",
    "Betazoid",
    "Bajoran",
    "Cardassian",
    "Ferengi",
    "Trill",
    "Borg",
    "Changeling",
    "Jem'Hadar",
    "Vorta",
    "Gorn",
    "Orion",
    "Pakled",
    "Bolian",
    "Rigelian",
    "Caitian",
    "Edosian",
    "Denobulan",
    "Xindi",
    "Suliban",
    "El-Aurian",
    "Q",
    "Ocampa",
    "Talaxian",
    "Kazon",
    "Vidiian",
    "Hirogen",
    "Malon",
    "Species 8472",
    "Breen",
  ];

  const starfleetRanks = [
    "Cadet",
    "Ensign",
    "Lieutenant Junior Grade",
    "Lieutenant",
    "Lieutenant Commander",
    "Commander",
    "Captain",
    "Rear Admiral",
    "Vice Admiral",
    "Admiral",
    "Fleet Admiral",
  ];

  const divisions = [
    "Command",
    "Operations",
    "Sciences",
    "Medical",
    "Engineering",
    "Security",
    "Intelligence",
  ];

  const positions = {
    Command: ["Captain", "First Officer", "Second Officer", "Bridge Officer"],
    Operations: [
      "Helm Officer",
      "Operations Officer",
      "Communications Officer",
      "Transporter Chief",
    ],
    Sciences: [
      "Science Officer",
      "Stellar Cartographer",
      "Astrobiologist",
      "Theoretical Physicist",
    ],
    Medical: [
      "Chief Medical Officer",
      "Doctor",
      "Nurse",
      "Medical Technician",
      "Counselor",
    ],
    Engineering: [
      "Chief Engineer",
      "Assistant Engineer",
      "Warp Core Specialist",
      "Computer Specialist",
    ],
    Security: [
      "Security Chief",
      "Security Officer",
      "Tactical Officer",
      "Armory Officer",
    ],
    Intelligence: [
      "Intelligence Officer",
      "Analyst",
      "Field Operative",
      "Cryptographer",
    ],
  };

  const starTrekTraits = {
    positive: [
      "Brave",
      "Logical",
      "Diplomatic",
      "Intelligent",
      "Charismatic",
      "Strong-willed",
      "Empathic",
      "Tactical Genius",
      "Natural Leader",
      "Quick Learner",
      "Loyal",
      "Innovative",
      "Calm Under Pressure",
      "Inspiring",
      "Detail-Oriented",
    ],
    negative: [
      "Stubborn",
      "Emotional",
      "Impulsive",
      "Overconfident",
      "Paranoid",
      "Perfectionist",
      "Hot-tempered",
      "Overly Cautious",
      "Distrustful",
      "Workaholic",
      "Pessimistic",
      "Arrogant",
      "Reckless",
      "Indecisive",
      "Obsessive",
    ],
    special: [
      "Telepathic",
      "Empathic",
      "Enhanced Strength",
      "Enhanced Reflexes",
      "Eidetic Memory",
      "Computer Interface",
      "Shapeshifting",
      "Regeneration",
      "Phase Shifting",
      "Temporal Sensitivity",
      "Enhanced Senses",
      "Psionic Abilities",
      "Technopathy",
      "Precognition",
      "Energy Manipulation",
    ],
  };

  const updateCharacter = (field: string, value: any) => {
    setCurrentCharacter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setCurrentCharacter((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const addArrayItem = (parent: string, field: string, value: string) => {
    if (!value.trim()) return;
    setCurrentCharacter((prev) => {
      const parentObj = prev[parent as keyof typeof prev] as any;
      const currentArray = parentObj?.[field] || [];
      return {
        ...prev,
        [parent]: {
          ...parentObj,
          [field]: [...currentArray, value.trim()],
        },
      };
    });
  };

  const removeArrayItem = (parent: string, field: string, index: number) => {
    setCurrentCharacter((prev) => {
      const parentObj = prev[parent as keyof typeof prev] as any;
      const currentArray = parentObj?.[field] || [];
      return {
        ...prev,
        [parent]: {
          ...parentObj,
          [field]: currentArray.filter((_: any, i: number) => i !== index),
        },
      };
    });
  };

  const saveCharacter = () => {
    const character: StarTrekCharacter = {
      id: `char-${Date.now()}`,
      ...(currentCharacter as StarTrekCharacter),
    };
    setCharacters((prev) => [...prev, character]);
    // Reset form
    setCurrentCharacter({
      name: "",
      species: "",
      homeworld: "",
      rank: "",
      division: "",
      position: "",
      ship_assignment: "",
      age: 25,
      height: "",
      weight: "",
      attributes: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      skills: {
        command: 5,
        piloting: 5,
        engineering: 5,
        science: 5,
        medical: 5,
        security: 5,
        diplomacy: 5,
        tactics: 5,
      },
      background: {
        birthplace: "",
        family: "",
        education: "",
        service_record: [],
        commendations: [],
        specializations: [],
      },
      traits: {
        positive: [],
        negative: [],
        special_abilities: [],
      },
      equipment: {
        weapons: [],
        tools: [],
        personal_items: [],
      },
      biography: "",
      goals: [],
      personality: "",
      appearance: "",
    });
  };

  const getDivisionColor = (division: string) => {
    switch (division) {
      case "Command":
        return "text-trek-gold border-trek-gold";
      case "Operations":
        return "text-red-400 border-red-400";
      case "Sciences":
        return "text-trek-blue border-trek-blue";
      case "Medical":
        return "text-green-400 border-green-400";
      case "Engineering":
        return "text-trek-warning border-trek-warning";
      case "Security":
        return "text-red-500 border-red-500";
      case "Intelligence":
        return "text-purple-400 border-purple-400";
      default:
        return "text-trek-text border-trek-text";
    }
  };

  const calculateTotalPoints = (obj: Record<string, number>) => {
    return Object.values(obj).reduce((sum, value) => sum + value, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
          CHARACTER CREATION
        </h2>
        <div className="flex gap-2">
          <Button className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark font-semibold">
            <Save className="w-4 h-4 mr-2" />
            Save Character
          </Button>
          <Button
            variant="outline"
            className="border-trek-accent text-trek-text hover:bg-trek-accent"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-trek-panel border border-trek-accent">
          <TabsTrigger
            value="basic"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Basic Info
          </TabsTrigger>
          <TabsTrigger
            value="attributes"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Attributes
          </TabsTrigger>
          <TabsTrigger
            value="skills"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Skills
          </TabsTrigger>
          <TabsTrigger
            value="background"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Background
          </TabsTrigger>
          <TabsTrigger
            value="traits"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Traits
          </TabsTrigger>
          <TabsTrigger
            value="roster"
            className="text-trek-text data-[state=active]:bg-trek-blue data-[state=active]:text-trek-dark"
          >
            Character Roster
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <h3 className="text-xl font-bold text-trek-gold mb-6">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="name" className="text-trek-text">
                  Name
                </Label>
                <Input
                  id="name"
                  value={currentCharacter.name || ""}
                  onChange={(e) => updateCharacter("name", e.target.value)}
                  placeholder="Enter character name"
                  className="bg-trek-dark border-trek-accent"
                />
              </div>

              <div>
                <Label htmlFor="species" className="text-trek-text">
                  Species
                </Label>
                <Select
                  value={currentCharacter.species || ""}
                  onValueChange={(value) => updateCharacter("species", value)}
                >
                  <SelectTrigger className="bg-trek-dark border-trek-accent">
                    <SelectValue placeholder="Select species" />
                  </SelectTrigger>
                  <SelectContent>
                    {starTrekSpecies.map((species) => (
                      <SelectItem key={species} value={species}>
                        {species}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="homeworld" className="text-trek-text">
                  Homeworld
                </Label>
                <Input
                  id="homeworld"
                  value={currentCharacter.homeworld || ""}
                  onChange={(e) => updateCharacter("homeworld", e.target.value)}
                  placeholder="Enter homeworld"
                  className="bg-trek-dark border-trek-accent"
                />
              </div>

              <div>
                <Label htmlFor="rank" className="text-trek-text">
                  Rank
                </Label>
                <Select
                  value={currentCharacter.rank || ""}
                  onValueChange={(value) => updateCharacter("rank", value)}
                >
                  <SelectTrigger className="bg-trek-dark border-trek-accent">
                    <SelectValue placeholder="Select rank" />
                  </SelectTrigger>
                  <SelectContent>
                    {starfleetRanks.map((rank) => (
                      <SelectItem key={rank} value={rank}>
                        {rank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="division" className="text-trek-text">
                  Division
                </Label>
                <Select
                  value={currentCharacter.division || ""}
                  onValueChange={(value) => updateCharacter("division", value)}
                >
                  <SelectTrigger className="bg-trek-dark border-trek-accent">
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((division) => (
                      <SelectItem key={division} value={division}>
                        {division}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="position" className="text-trek-text">
                  Position
                </Label>
                <Select
                  value={currentCharacter.position || ""}
                  onValueChange={(value) => updateCharacter("position", value)}
                  disabled={!currentCharacter.division}
                >
                  <SelectTrigger className="bg-trek-dark border-trek-accent">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentCharacter.division &&
                      positions[
                        currentCharacter.division as keyof typeof positions
                      ]?.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ship" className="text-trek-text">
                  Ship Assignment
                </Label>
                <Input
                  id="ship"
                  value={currentCharacter.ship_assignment || ""}
                  onChange={(e) =>
                    updateCharacter("ship_assignment", e.target.value)
                  }
                  placeholder="USS Enterprise NCC-1701"
                  className="bg-trek-dark border-trek-accent"
                />
              </div>

              <div>
                <Label htmlFor="age" className="text-trek-text">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={currentCharacter.age || 25}
                  onChange={(e) =>
                    updateCharacter("age", parseInt(e.target.value) || 25)
                  }
                  className="bg-trek-dark border-trek-accent"
                />
              </div>

              <div>
                <Label htmlFor="height" className="text-trek-text">
                  Height
                </Label>
                <Input
                  id="height"
                  value={currentCharacter.height || ""}
                  onChange={(e) => updateCharacter("height", e.target.value)}
                  placeholder="6'2&quot; / 188 cm"
                  className="bg-trek-dark border-trek-accent"
                />
              </div>

              <div>
                <Label htmlFor="weight" className="text-trek-text">
                  Weight
                </Label>
                <Input
                  id="weight"
                  value={currentCharacter.weight || ""}
                  onChange={(e) => updateCharacter("weight", e.target.value)}
                  placeholder="180 lbs / 82 kg"
                  className="bg-trek-dark border-trek-accent"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="appearance" className="text-trek-text">
                  Physical Appearance
                </Label>
                <Textarea
                  id="appearance"
                  value={currentCharacter.appearance || ""}
                  onChange={(e) =>
                    updateCharacter("appearance", e.target.value)
                  }
                  placeholder="Describe physical appearance..."
                  className="bg-trek-dark border-trek-accent"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="personality" className="text-trek-text">
                  Personality
                </Label>
                <Textarea
                  id="personality"
                  value={currentCharacter.personality || ""}
                  onChange={(e) =>
                    updateCharacter("personality", e.target.value)
                  }
                  placeholder="Describe personality traits..."
                  className="bg-trek-dark border-trek-accent"
                  rows={4}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="attributes" className="mt-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-trek-gold">
                Physical & Mental Attributes
              </h3>
              <div className="text-sm text-trek-text">
                Total Points:{" "}
                <span className="text-trek-blue font-semibold">
                  {calculateTotalPoints(currentCharacter.attributes || {})}
                </span>{" "}
                / 90
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(currentCharacter.attributes || {}).map(
                ([attr, value]) => (
                  <div key={attr} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-trek-text capitalize">
                        {attr}
                      </Label>
                      <span className="text-trek-blue font-semibold">
                        {value}
                      </span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={(newValue) =>
                        updateNestedField("attributes", attr, newValue[0])
                      }
                      max={20}
                      min={3}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-trek-text/70">
                      <span>3</span>
                      <span>20</span>
                    </div>
                  </div>
                ),
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                <h4 className="font-semibold text-trek-gold mb-2">
                  Physical Attributes
                </h4>
                <div className="space-y-1 text-sm">
                  <div>
                    • <strong>Strength:</strong> Physical power and muscle
                  </div>
                  <div>
                    • <strong>Dexterity:</strong> Agility and reflexes
                  </div>
                  <div>
                    • <strong>Constitution:</strong> Health and endurance
                  </div>
                </div>
              </div>

              <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                <h4 className="font-semibold text-trek-gold mb-2">
                  Mental Attributes
                </h4>
                <div className="space-y-1 text-sm">
                  <div>
                    • <strong>Intelligence:</strong> Reasoning and learning
                  </div>
                  <div>
                    • <strong>Wisdom:</strong> Intuition and insight
                  </div>
                  <div>
                    • <strong>Charisma:</strong> Social skills and leadership
                  </div>
                </div>
              </div>

              <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                <h4 className="font-semibold text-trek-gold mb-2">
                  Attribute Ranges
                </h4>
                <div className="space-y-1 text-sm">
                  <div>
                    • <strong>3-7:</strong> Below Average
                  </div>
                  <div>
                    • <strong>8-12:</strong> Average
                  </div>
                  <div>
                    • <strong>13-15:</strong> Above Average
                  </div>
                  <div>
                    • <strong>16-20:</strong> Exceptional
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-trek-gold">
                Starfleet Skills
              </h3>
              <div className="text-sm text-trek-text">
                Total Points:{" "}
                <span className="text-trek-blue font-semibold">
                  {calculateTotalPoints(currentCharacter.skills || {})}
                </span>{" "}
                / 160
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(currentCharacter.skills || {}).map(
                ([skill, value]) => (
                  <div key={skill} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-trek-text capitalize">
                        {skill}
                      </Label>
                      <span className="text-trek-blue font-semibold">
                        {value}
                      </span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={(newValue) =>
                        updateNestedField("skills", skill, newValue[0])
                      }
                      max={20}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-trek-text/70">
                      <span>0</span>
                      <span>20</span>
                    </div>
                  </div>
                ),
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                <h4 className="font-semibold text-trek-gold mb-2">
                  Skill Descriptions
                </h4>
                <div className="space-y-1 text-sm">
                  <div>
                    • <strong>Command:</strong> Leadership and management
                  </div>
                  <div>
                    • <strong>Piloting:</strong> Ship and shuttle operation
                  </div>
                  <div>
                    • <strong>Engineering:</strong> Technical systems
                  </div>
                  <div>
                    • <strong>Science:</strong> Research and analysis
                  </div>
                  <div>
                    • <strong>Medical:</strong> Healthcare and biology
                  </div>
                  <div>
                    • <strong>Security:</strong> Combat and protection
                  </div>
                  <div>
                    • <strong>Diplomacy:</strong> Negotiation and relations
                  </div>
                  <div>
                    • <strong>Tactics:</strong> Strategic planning
                  </div>
                </div>
              </div>

              <div className="bg-trek-dark/50 border border-trek-accent rounded p-4">
                <h4 className="font-semibold text-trek-gold mb-2">
                  Skill Levels
                </h4>
                <div className="space-y-1 text-sm">
                  <div>
                    • <strong>0-5:</strong> Novice
                  </div>
                  <div>
                    • <strong>6-10:</strong> Competent
                  </div>
                  <div>
                    • <strong>11-15:</strong> Expert
                  </div>
                  <div>
                    • <strong>16-20:</strong> Master
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="background" className="mt-6">
          <div className="space-y-6">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Personal Background
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="birthplace" className="text-trek-text">
                    Birthplace
                  </Label>
                  <Input
                    id="birthplace"
                    value={currentCharacter.background?.birthplace || ""}
                    onChange={(e) =>
                      updateNestedField(
                        "background",
                        "birthplace",
                        e.target.value,
                      )
                    }
                    placeholder="Earth, San Francisco"
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>

                <div>
                  <Label htmlFor="family" className="text-trek-text">
                    Family
                  </Label>
                  <Input
                    id="family"
                    value={currentCharacter.background?.family || ""}
                    onChange={(e) =>
                      updateNestedField("background", "family", e.target.value)
                    }
                    placeholder="Parents, siblings, etc."
                    className="bg-trek-dark border-trek-accent"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="education" className="text-trek-text">
                    Education
                  </Label>
                  <Textarea
                    id="education"
                    value={currentCharacter.background?.education || ""}
                    onChange={(e) =>
                      updateNestedField(
                        "background",
                        "education",
                        e.target.value,
                      )
                    }
                    placeholder="Starfleet Academy, specializations, honors..."
                    className="bg-trek-dark border-trek-accent"
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="biography" className="text-trek-text">
                    Biography
                  </Label>
                  <Textarea
                    id="biography"
                    value={currentCharacter.biography || ""}
                    onChange={(e) =>
                      updateCharacter("biography", e.target.value)
                    }
                    placeholder="Character's life story and background..."
                    className="bg-trek-dark border-trek-accent"
                    rows={5}
                  />
                </div>
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Service Record
              </h3>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    id="service-record"
                    placeholder="Add service record entry..."
                    className="bg-trek-dark border-trek-accent"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addArrayItem(
                          "background",
                          "service_record",
                          e.currentTarget.value,
                        );
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      const input = document.getElementById(
                        "service-record",
                      ) as HTMLInputElement;
                      addArrayItem("background", "service_record", input.value);
                      input.value = "";
                    }}
                    className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {currentCharacter.background?.service_record?.map(
                    (record, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-trek-dark/50 border border-trek-accent rounded p-2"
                      >
                        <span className="text-sm">{record}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            removeArrayItem(
                              "background",
                              "service_record",
                              index,
                            )
                          }
                          className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Commendations & Specializations
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-trek-text">Commendations</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="commendation"
                      placeholder="Add commendation..."
                      className="bg-trek-dark border-trek-accent"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addArrayItem(
                            "background",
                            "commendations",
                            e.currentTarget.value,
                          );
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        const input = document.getElementById(
                          "commendation",
                        ) as HTMLInputElement;
                        addArrayItem(
                          "background",
                          "commendations",
                          input.value,
                        );
                        input.value = "";
                      }}
                      className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-1 mt-2">
                    {currentCharacter.background?.commendations?.map(
                      (comm, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-trek-dark/50 border border-trek-accent rounded p-2"
                        >
                          <span className="text-sm">{comm}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removeArrayItem(
                                "background",
                                "commendations",
                                index,
                              )
                            }
                            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-trek-text">Specializations</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="specialization"
                      placeholder="Add specialization..."
                      className="bg-trek-dark border-trek-accent"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addArrayItem(
                            "background",
                            "specializations",
                            e.currentTarget.value,
                          );
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        const input = document.getElementById(
                          "specialization",
                        ) as HTMLInputElement;
                        addArrayItem(
                          "background",
                          "specializations",
                          input.value,
                        );
                        input.value = "";
                      }}
                      className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-1 mt-2">
                    {currentCharacter.background?.specializations?.map(
                      (spec, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-trek-dark/50 border border-trek-accent rounded p-2"
                        >
                          <span className="text-sm">{spec}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removeArrayItem(
                                "background",
                                "specializations",
                                index,
                              )
                            }
                            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traits" className="mt-6">
          <div className="space-y-6">
            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Character Traits
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-trek-text">Positive Traits</Label>
                  <div className="space-y-2 mt-2">
                    {starTrekTraits.positive.map((trait) => (
                      <div key={trait} className="flex items-center space-x-2">
                        <Checkbox
                          id={`positive-${trait}`}
                          checked={
                            currentCharacter.traits?.positive?.includes(
                              trait,
                            ) || false
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              addArrayItem("traits", "positive", trait);
                            } else {
                              const index =
                                currentCharacter.traits?.positive?.indexOf(
                                  trait,
                                ) || -1;
                              if (index > -1)
                                removeArrayItem("traits", "positive", index);
                            }
                          }}
                        />
                        <Label
                          htmlFor={`positive-${trait}`}
                          className="text-sm text-trek-text"
                        >
                          {trait}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-trek-text">Negative Traits</Label>
                  <div className="space-y-2 mt-2">
                    {starTrekTraits.negative.map((trait) => (
                      <div key={trait} className="flex items-center space-x-2">
                        <Checkbox
                          id={`negative-${trait}`}
                          checked={
                            currentCharacter.traits?.negative?.includes(
                              trait,
                            ) || false
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              addArrayItem("traits", "negative", trait);
                            } else {
                              const index =
                                currentCharacter.traits?.negative?.indexOf(
                                  trait,
                                ) || -1;
                              if (index > -1)
                                removeArrayItem("traits", "negative", index);
                            }
                          }}
                        />
                        <Label
                          htmlFor={`negative-${trait}`}
                          className="text-sm text-trek-text"
                        >
                          {trait}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-trek-text">Special Abilities</Label>
                  <div className="space-y-2 mt-2">
                    {starTrekTraits.special.map((ability) => (
                      <div
                        key={ability}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`special-${ability}`}
                          checked={
                            currentCharacter.traits?.special_abilities?.includes(
                              ability,
                            ) || false
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              addArrayItem(
                                "traits",
                                "special_abilities",
                                ability,
                              );
                            } else {
                              const index =
                                currentCharacter.traits?.special_abilities?.indexOf(
                                  ability,
                                ) || -1;
                              if (index > -1)
                                removeArrayItem(
                                  "traits",
                                  "special_abilities",
                                  index,
                                );
                            }
                          }}
                        />
                        <Label
                          htmlFor={`special-${ability}`}
                          className="text-sm text-trek-text"
                        >
                          {ability}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-trek-panel border-trek-accent p-6">
              <h3 className="text-xl font-bold text-trek-gold mb-6">
                Equipment & Goals
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-trek-text">Personal Equipment</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="equipment"
                      placeholder="Add equipment..."
                      className="bg-trek-dark border-trek-accent"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addArrayItem(
                            "equipment",
                            "personal_items",
                            e.currentTarget.value,
                          );
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        const input = document.getElementById(
                          "equipment",
                        ) as HTMLInputElement;
                        addArrayItem(
                          "equipment",
                          "personal_items",
                          input.value,
                        );
                        input.value = "";
                      }}
                      className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-1 mt-2">
                    {currentCharacter.equipment?.personal_items?.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-trek-dark/50 border border-trek-accent rounded p-2"
                        >
                          <span className="text-sm">{item}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removeArrayItem(
                                "equipment",
                                "personal_items",
                                index,
                              )
                            }
                            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-trek-text">Personal Goals</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="goals"
                      placeholder="Add goal..."
                      className="bg-trek-dark border-trek-accent"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          const goals = currentCharacter.goals || [];
                          setCurrentCharacter((prev) => ({
                            ...prev,
                            goals: [...goals, e.currentTarget.value.trim()],
                          }));
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        const input = document.getElementById(
                          "goals",
                        ) as HTMLInputElement;
                        const goals = currentCharacter.goals || [];
                        setCurrentCharacter((prev) => ({
                          ...prev,
                          goals: [...goals, input.value.trim()],
                        }));
                        input.value = "";
                      }}
                      className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-1 mt-2">
                    {currentCharacter.goals?.map((goal, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-trek-dark/50 border border-trek-accent rounded p-2"
                      >
                        <span className="text-sm">{goal}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const goals = currentCharacter.goals || [];
                            setCurrentCharacter((prev) => ({
                              ...prev,
                              goals: goals.filter((_, i) => i !== index),
                            }));
                          }}
                          className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={saveCharacter}
                  className="w-full bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Character to Roster
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roster" className="mt-6">
          <Card className="bg-trek-panel border-trek-accent p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-trek-gold">
                Character Roster
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-trek-accent text-trek-text hover:bg-trek-accent"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button
                  variant="outline"
                  className="border-trek-accent text-trek-text hover:bg-trek-accent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {characters.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-trek-text/50 mx-auto mb-4" />
                <p className="text-trek-text/70">No characters created yet.</p>
                <p className="text-sm text-trek-text/50">
                  Create your first character using the tabs above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {characters.map((character) => (
                  <Card
                    key={character.id}
                    className="bg-trek-dark/50 border-trek-accent p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-trek-gold">
                          {character.name}
                        </h4>
                        <p className="text-sm text-trek-text/70">
                          {character.species}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getDivisionColor(character.division)}`}
                      >
                        {character.division}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Rank:</span>
                        <span className="text-trek-blue">{character.rank}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Position:</span>
                        <span className="text-trek-text">
                          {character.position}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ship:</span>
                        <span className="text-trek-gold text-xs">
                          {character.ship_assignment}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
