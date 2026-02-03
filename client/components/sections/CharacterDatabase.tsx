import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  Users,
  Star,
  Crown,
  Shield,
  Zap,
  Heart,
  Brain,
  Target,
  MessageCircle,
  Award,
  Calendar,
  MapPin,
  Search,
  Volume2,
  Play,
} from "lucide-react";

interface Character {
  id: string;
  name: string;
  rank?: string;
  position?: string;
  species: string;
  affiliation: string;
  status: "Alive" | "Deceased" | "Missing" | "Unknown";
  era: string;
  show: string;
  description: string;
  personality: string[];
  skills: string[];
  relationships: { [characterId: string]: string };
  notableAchievements: string[];
  stats: {
    leadership: number;
    tactical: number;
    science: number;
    diplomacy: number;
    engineering: number;
    medical: number;
  };
  dialogue: {
    greeting: string[];
    casual: string[];
    mission: string[];
    departure: string[];
    memorable: string[];
  };
  voiceActor?: string;
  appearances: number;
}

const STAR_TREK_CHARACTERS: Character[] = [
  // The Original Series
  {
    id: "kirk",
    name: "James T. Kirk",
    rank: "Captain",
    position: "Commanding Officer",
    species: "Human",
    affiliation: "United Federation of Planets",
    status: "Deceased",
    era: "23rd Century",
    show: "The Original Series",
    description:
      "Legendary Starfleet captain known for his bold leadership and diplomatic skills.",
    personality: [
      "Bold",
      "Charismatic",
      "Decisive",
      "Compassionate",
      "Intuitive",
    ],
    skills: [
      "Starship Command",
      "Hand-to-hand Combat",
      "Diplomacy",
      "Strategic Thinking",
    ],
    relationships: {
      spock: "Best friend and trusted first officer",
      mccoy: "Close friend and chief medical officer",
      scotty: "Trusted chief engineer",
    },
    notableAchievements: [
      "First captain to bring his ship back intact after a five-year mission",
      "Instrumental in Khitomer Peace Conference",
      "Prevented galactic war multiple times",
    ],
    stats: {
      leadership: 98,
      tactical: 95,
      science: 75,
      diplomacy: 90,
      engineering: 70,
      medical: 65,
    },
    dialogue: {
      greeting: [
        "Captain's log, we're encountering something extraordinary.",
        "Mr. Spock, what's our situation?",
        "Bones, what's the medical assessment?",
      ],
      casual: [
        "Sometimes I think we're the only sane people in the galaxy.",
        "There's nothing more dangerous than a wounded animal.",
        "I've always found that a little humor goes a long way.",
      ],
      mission: [
        "We're Starfleet officers. We take risks, that's the job.",
        "The needs of the many outweigh the needs of the few.",
        "I won't leave my crew behind.",
      ],
      departure: [
        "Until we meet again, may fortune favor the brave.",
        "Take care of yourself, old friend.",
        "The bridge is yours, Number One.",
      ],
      memorable: [
        "I don't believe in the no-win scenario.",
        "Risk is our business. That's what this starship is all about.",
        "I have been, and always shall be, your friend.",
      ],
    },
    voiceActor: "William Shatner",
    appearances: 79,
  },
  {
    id: "spock",
    name: "S'chn T'gai Spock",
    rank: "Commander",
    position: "Science Officer / First Officer",
    species: "Half-Vulcan, Half-Human",
    affiliation: "United Federation of Planets",
    status: "Deceased",
    era: "23rd Century",
    show: "The Original Series",
    description:
      "Half-Vulcan science officer known for his logical approach and loyalty to his friends.",
    personality: [
      "Logical",
      "Loyal",
      "Curious",
      "Disciplined",
      "Introspective",
    ],
    skills: [
      "Vulcan Mind Meld",
      "Scientific Analysis",
      "Computer Operations",
      "Logic",
    ],
    relationships: {
      kirk: "Captain and closest friend",
      mccoy: "Friend despite philosophical differences",
      sarek: "Father, complicated relationship",
    },
    notableAchievements: [
      "First Vulcan to serve in Starfleet",
      "Instrumental in founding of New Vulcan",
      "Sacrificed life to save Enterprise crew",
    ],
    stats: {
      leadership: 85,
      tactical: 88,
      science: 99,
      diplomacy: 92,
      engineering: 85,
      medical: 75,
    },
    dialogue: {
      greeting: [
        "Fascinating. This phenomenon defies conventional explanation.",
        "Captain, I am detecting unusual readings.",
        "Logic dictates that we proceed with caution.",
      ],
      casual: [
        "The needs of the many outweigh the needs of the few.",
        "Infinite diversity in infinite combinations.",
        "Live long and prosper.",
      ],
      mission: [
        "I calculate the odds of success at approximately...",
        "The logical course of action would be...",
        "Fascinating. I shall require more data.",
      ],
      departure: [
        "Peace and long life.",
        "Prosperity and longevity.",
        "May your journey be prosperous.",
      ],
      memorable: [
        "The needs of the many outweigh the needs of the few.",
        "I have been, and always shall be, your friend.",
        "Logic is the beginning of wisdom, not the end.",
      ],
    },
    voiceActor: "Leonard Nimoy",
    appearances: 82,
  },

  // The Next Generation
  {
    id: "picard",
    name: "Jean-Luc Picard",
    rank: "Captain",
    position: "Commanding Officer",
    species: "Human",
    affiliation: "United Federation of Planets",
    status: "Alive",
    era: "24th Century",
    show: "The Next Generation",
    description:
      "Distinguished captain known for his diplomatic skills and archaeological interests.",
    personality: [
      "Diplomatic",
      "Intellectual",
      "Principled",
      "Calm",
      "Cultured",
    ],
    skills: ["Diplomacy", "Archaeology", "Leadership", "Strategy", "Languages"],
    relationships: {
      riker: "Trusted first officer",
      data: "Valued officer and friend",
      worf: "Respected security chief",
      beverly: "Close friend and CMO",
    },
    notableAchievements: [
      "Successfully negotiated numerous peace treaties",
      "Survived Borg assimilation",
      "Led exploration of unknown sectors",
    ],
    stats: {
      leadership: 96,
      tactical: 85,
      science: 88,
      diplomacy: 98,
      engineering: 70,
      medical: 65,
    },
    dialogue: {
      greeting: ["Make it so.", "Engage.", "Number One, you have the bridge."],
      casual: [
        "Tea, Earl Grey, hot.",
        "There are four lights!",
        "I prefer to think of this as a new beginning.",
      ],
      mission: [
        "Engage diplomatic protocols.",
        "Sometimes the only way to save a life is to take one.",
        "We are what we choose to be.",
      ],
      departure: [
        "Farewell, my friends.",
        "Until we meet again.",
        "Good luck, Number One.",
      ],
      memorable: [
        "Make it so.",
        "The line must be drawn here!",
        "Seize the time... live now!",
      ],
    },
    voiceActor: "Patrick Stewart",
    appearances: 178,
  },
  {
    id: "data",
    name: "Data",
    rank: "Lieutenant Commander",
    position: "Operations Officer",
    species: "Soong-type Android",
    affiliation: "United Federation of Planets",
    status: "Deceased",
    era: "24th Century",
    show: "The Next Generation",
    description:
      "Unique android officer seeking to understand humanity and emotions.",
    personality: ["Curious", "Analytical", "Loyal", "Innocent", "Dedicated"],
    skills: [
      "Computer Interface",
      "Data Analysis",
      "Multitasking",
      "Precise Calculations",
    ],
    relationships: {
      picard: "Captain and mentor",
      geordi: "Best friend and colleague",
      spot: "Pet cat, emotional anchor",
    },
    notableAchievements: [
      "Achieved emotional growth through emotion chip",
      "Saved Enterprise crew multiple times",
      "Created daughter android Lal",
    ],
    stats: {
      leadership: 80,
      tactical: 92,
      science: 99,
      diplomacy: 85,
      engineering: 95,
      medical: 85,
    },
    dialogue: {
      greeting: [
        "I am curious about this phenomenon.",
        "Fascinating. I require additional data.",
        "I do not understand the reference.",
      ],
      casual: [
        "I believe the appropriate response is...",
        "That is most curious.",
        "I am still learning about human behavior.",
      ],
      mission: [
        "I am programmed in multiple techniques.",
        "Processing... analysis complete.",
        "The probability of success is...",
      ],
      departure: [
        "Until we meet again.",
        "I look forward to our next encounter.",
        "Goodbye, friend.",
      ],
      memorable: [
        "I cannot feel emotions. I wish I could.",
        "In my experience, there is no such thing as luck.",
        "I aspire, sir. I aspire.",
      ],
    },
    voiceActor: "Brent Spiner",
    appearances: 178,
  },

  // Deep Space Nine
  {
    id: "sisko",
    name: "Benjamin L. Sisko",
    rank: "Captain",
    position: "Commanding Officer",
    species: "Human (Prophet-touched)",
    affiliation: "United Federation of Planets",
    status: "Missing",
    era: "24th Century",
    show: "Deep Space Nine",
    description:
      "Emissary to the Prophets and commander of Deep Space Nine during the Dominion War.",
    personality: [
      "Passionate",
      "Spiritual",
      "Determined",
      "Complex",
      "Protective",
    ],
    skills: [
      "Military Strategy",
      "Spiritual Leadership",
      "Baseball",
      "Command Presence",
    ],
    relationships: {
      jake: "Beloved son",
      dax: "Close friend and science officer",
      odo: "Trusted security chief",
      kira: "First officer and friend",
    },
    notableAchievements: [
      "Led Federation forces in Dominion War",
      "Served as Emissary to the Prophets",
      "Prevented Pah-wraith domination",
    ],
    stats: {
      leadership: 94,
      tactical: 92,
      science: 78,
      diplomacy: 88,
      engineering: 75,
      medical: 70,
    },
    dialogue: {
      greeting: [
        "I can live with it.",
        "The Prophets guide us all.",
        "Welcome to Deep Space Nine.",
      ],
      casual: [
        "Baseball. It's the greatest game ever invented.",
        "Sometimes you have to choose sides.",
        "I prefer to see it as a challenge.",
      ],
      mission: [
        "We do what we must to protect Bajor.",
        "The war changes everything.",
        "I won't let the Dominion win.",
      ],
      departure: [
        "I'll be back.",
        "Take care of the station.",
        "The Prophets await.",
      ],
      memorable: [
        "I can live with it.",
        "It's easy to be a saint in paradise.",
        "I will find you!",
      ],
    },
    voiceActor: "Avery Brooks",
    appearances: 173,
  },

  // Voyager
  {
    id: "janeway",
    name: "Kathryn Janeway",
    rank: "Captain",
    position: "Commanding Officer",
    species: "Human",
    affiliation: "United Federation of Planets",
    status: "Alive",
    era: "24th Century",
    show: "Voyager",
    description:
      "First female captain to lead a Star Trek series, stranded in the Delta Quadrant.",
    personality: [
      "Determined",
      "Scientific",
      "Protective",
      "Innovative",
      "Resilient",
    ],
    skills: [
      "Science",
      "Command",
      "Problem Solving",
      "Time Travel",
      "Diplomacy",
    ],
    relationships: {
      chakotay: "First officer and trusted friend",
      tuvok: "Security chief and old friend",
      seven: "Protégé and daughter figure",
    },
    notableAchievements: [
      "Successfully brought Voyager home from Delta Quadrant",
      "Defeated the Borg Queen",
      "Established peaceful contact with numerous Delta Quadrant species",
    ],
    stats: {
      leadership: 95,
      tactical: 88,
      science: 92,
      diplomacy: 90,
      engineering: 82,
      medical: 75,
    },
    dialogue: {
      greeting: [
        "Coffee. Black.",
        "There's coffee in that nebula.",
        "Set a course for home.",
      ],
      casual: [
        "I never met a cup of coffee I didn't like.",
        "Time's up.",
        "I don't like bullies.",
      ],
      mission: [
        "We're Starfleet officers. We keep our promises.",
        "I won't leave anyone behind.",
        "Find another way.",
      ],
      departure: ["Good hunting.", "See you at home.", "Dismissed."],
      memorable: [
        "There's coffee in that nebula.",
        "I don't like bullies.",
        "Time's up.",
      ],
    },
    voiceActor: "Kate Mulgrew",
    appearances: 168,
  },

  // Enterprise
  {
    id: "archer",
    name: "Jonathan Archer",
    rank: "Captain",
    position: "Commanding Officer",
    species: "Human",
    affiliation: "United Earth",
    status: "Alive",
    era: "22nd Century",
    show: "Enterprise",
    description:
      "First captain of Enterprise NX-01, pioneer of deep space exploration.",
    personality: ["Pioneering", "Optimistic", "Curious", "Brave", "Diplomatic"],
    skills: [
      "Exploration",
      "First Contact",
      "Diplomacy",
      "Water Polo",
      "Languages",
    ],
    relationships: {
      tpol: "Science officer and trusted advisor",
      tucker: "Chief engineer and best friend",
      reed: "Tactical officer",
      porthos: "Beloved pet beagle",
    },
    notableAchievements: [
      "First human to achieve Warp 5",
      "Instrumental in founding the Federation",
      "Survived the Temporal Cold War",
    ],
    stats: {
      leadership: 88,
      tactical: 82,
      science: 85,
      diplomacy: 92,
      engineering: 78,
      medical: 70,
    },
    dialogue: {
      greeting: [
        "Glad to meet you.",
        "We come in peace.",
        "This is Enterprise.",
      ],
      casual: [
        "I've been waiting my whole life for this.",
        "Porthos, stay.",
        "We're going to see some amazing things.",
      ],
      mission: [
        "We're explorers. It's what we do.",
        "Sometimes you have to take a leap of faith.",
        "We'll find a way.",
      ],
      departure: ["Good luck out there.", "Safe travels.", "See you around."],
      memorable: [
        "We're going to stumble, make mistakes.",
        "I've been waiting my whole life for this.",
        "Faith of the heart.",
      ],
    },
    voiceActor: "Scott Bakula",
    appearances: 97,
  },

  // Discovery
  {
    id: "burnham",
    name: "Michael Burnham",
    rank: "Captain",
    position: "Commanding Officer",
    species: "Human",
    affiliation: "United Federation of Planets",
    status: "Alive",
    era: "23rd/32nd Century",
    show: "Discovery",
    description:
      "First mutineer in Starfleet history who redeemed herself and became a captain.",
    personality: [
      "Analytical",
      "Emotional",
      "Determined",
      "Complex",
      "Logical",
    ],
    skills: [
      "Xenoanthropology",
      "Vulcan Training",
      "Combat",
      "Science",
      "Leadership",
    ],
    relationships: {
      spock: "Adopted brother",
      sarek: "Adoptive father",
      saru: "Close friend and former captain",
      book: "Love interest and partner",
    },
    notableAchievements: [
      "Ended the Klingon War",
      "Saved the multiverse from Control",
      "Led Discovery to the 32nd century",
    ],
    stats: {
      leadership: 90,
      tactical: 88,
      science: 94,
      diplomacy: 85,
      engineering: 80,
      medical: 75,
    },
    dialogue: {
      greeting: [
        "I have a duty to serve.",
        "Logic and emotion must coexist.",
        "This is the way forward.",
      ],
      casual: [
        "Vulcan hello.",
        "I was raised on Vulcan.",
        "Sometimes the right choice isn't logical.",
      ],
      mission: [
        "We are Starfleet. We serve.",
        "There's always another way.",
        "I believe in redemption.",
      ],
      departure: [
        "Fly safe.",
        "Until we meet again.",
        "LLAP - Live Long and Prosper.",
      ],
      memorable: [
        "I know who I am. I know what I've done.",
        "Logic and emotion must coexist.",
        "We are Starfleet.",
      ],
    },
    voiceActor: "Sonequa Martin-Green",
    appearances: 65,
  },

  // Villains and Notable NPCs
  {
    id: "khan",
    name: "Khan Noonien Singh",
    rank: "None",
    position: "Augment Leader",
    species: "Human (Augment)",
    affiliation: "Independent",
    status: "Deceased",
    era: "23rd Century",
    show: "The Original Series",
    description:
      "Genetically enhanced human from the Eugenics Wars, brilliant and dangerous.",
    personality: ["Brilliant", "Ruthless", "Charismatic", "Proud", "Vengeful"],
    skills: [
      "Genetic Enhancement",
      "Military Strategy",
      "Leadership",
      "Combat",
    ],
    relationships: {
      kirk: "Primary nemesis",
      spock: "Intellectual adversary",
    },
    notableAchievements: [
      "Ruled one-quarter of Earth during Eugenics Wars",
      "Nearly destroyed Enterprise",
      "Created Genesis Planet crisis",
    ],
    stats: {
      leadership: 95,
      tactical: 98,
      science: 85,
      diplomacy: 70,
      engineering: 80,
      medical: 75,
    },
    dialogue: {
      greeting: [
        "I am better.",
        "Superior ability breeds superior ambition.",
        "From Hell's heart, I stab at thee.",
      ],
      casual: [
        "I've done far worse than kill you.",
        "The needs of the one outweigh the needs of the many.",
        "Revenge is a dish best served cold.",
      ],
      mission: [
        "I will have my vengeance.",
        "You cannot escape your past, Kirk.",
        "I am... superior.",
      ],
      departure: [
        "This is not over.",
        "Until we meet again.",
        "I go to my death with honor.",
      ],
      memorable: [
        "KHAN!",
        "From Hell's heart, I stab at thee.",
        "I've done far worse than kill you.",
      ],
    },
    voiceActor: "Ricardo Montalbán",
    appearances: 3,
  },
];

export default function CharacterDatabase() {
  const [characters, setCharacters] =
    useState<Character[]>(STAR_TREK_CHARACTERS);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAffiliation, setFilterAffiliation] = useState("All");
  const [filterSpecies, setFilterSpecies] = useState("All");
  const [filterShow, setFilterShow] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [activeDialogue, setActiveDialogue] = useState<string | null>(null);

  const affiliations = [...new Set(characters.map((char) => char.affiliation))];
  const species = [...new Set(characters.map((char) => char.species))];
  const shows = [...new Set(characters.map((char) => char.show))];
  const statuses = [...new Set(characters.map((char) => char.status))];

  const filteredCharacters = characters.filter((character) => {
    const matchesSearch =
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAffiliation =
      filterAffiliation === "All" ||
      character.affiliation === filterAffiliation;
    const matchesSpecies =
      filterSpecies === "All" || character.species === filterSpecies;
    const matchesShow = filterShow === "All" || character.show === filterShow;
    const matchesStatus =
      filterStatus === "All" || character.status === filterStatus;

    return (
      matchesSearch &&
      matchesAffiliation &&
      matchesSpecies &&
      matchesShow &&
      matchesStatus
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Alive":
        return "text-green-400";
      case "Deceased":
        return "text-red-400";
      case "Missing":
        return "text-yellow-400";
      case "Unknown":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  const getRankIcon = (rank?: string) => {
    if (!rank) return <Users className="w-4 h-4" />;
    if (rank.includes("Captain"))
      return <Crown className="w-4 h-4 text-yellow-400" />;
    if (rank.includes("Commander"))
      return <Star className="w-4 h-4 text-blue-400" />;
    if (rank.includes("Lieutenant"))
      return <Shield className="w-4 h-4 text-green-400" />;
    return <Users className="w-4 h-4" />;
  };

  const playDialogue = (dialogue: string) => {
    setActiveDialogue(dialogue);
    // In a real implementation, this would trigger text-to-speech
    setTimeout(() => setActiveDialogue(null), 3000);
  };

  const getTopStat = (character: Character) => {
    const stats = character.stats;
    const maxStat = Math.max(...Object.values(stats));
    const statName = Object.keys(stats).find(
      (key) => stats[key as keyof typeof stats] === maxStat,
    );
    return { name: statName, value: maxStat };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-blue-400">CHARACTER DATABASE</h1>
        <p className="text-xl text-gray-300">
          Personnel Files & Starfleet Records
        </p>
      </div>

      <Tabs defaultValue="database" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="database">Character Database</TabsTrigger>
          <TabsTrigger value="dialogue">Dialogue System</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="analytics">Personnel Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="database" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              placeholder="Search characters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800/50 border-blue-500/30"
            />
            <Select
              value={filterAffiliation}
              onValueChange={setFilterAffiliation}
            >
              <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                <SelectValue placeholder="Affiliation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Affiliations</SelectItem>
                {affiliations.map((affiliation) => (
                  <SelectItem key={affiliation} value={affiliation}>
                    {affiliation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterSpecies} onValueChange={setFilterSpecies}>
              <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                <SelectValue placeholder="Species" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Species</SelectItem>
                {species.map((species) => (
                  <SelectItem key={species} value={species}>
                    {species}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterShow} onValueChange={setFilterShow}>
              <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                <SelectValue placeholder="Series" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Series</SelectItem>
                {shows.map((show) => (
                  <SelectItem key={show} value={show}>
                    {show}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-gray-800/50 border-blue-500/30">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCharacters.map((character) => (
              <Card
                key={character.id}
                className="bg-gray-800/30 border-blue-500/30 hover:border-blue-400/50 transition-colors cursor-pointer"
                onClick={() => setSelectedCharacter(character)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-blue-400">
                        {character.name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        {getRankIcon(character.rank)}
                        <span className="text-sm text-gray-400">
                          {character.rank || "Civilian"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <div
                          className={`w-2 h-2 rounded-full ${getStatusColor(character.status).replace("text-", "bg-")}`}
                        ></div>
                        <span
                          className={`text-sm ${getStatusColor(character.status)}`}
                        >
                          {character.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {character.species}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {character.era}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-300">
                    {character.description}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Position:</span>
                    <span className="text-blue-400">
                      {character.position || "Unknown"}
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="text-gray-400">Top Skill:</span>
                    <div className="text-blue-400 font-semibold">
                      {getTopStat(character).name} (
                      {getTopStat(character).value}%)
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {character.personality.slice(0, 3).map((trait, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>

                  <div className="text-xs text-gray-500">
                    From: {character.show} • {character.appearances} appearances
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dialogue" className="space-y-4">
          {selectedCharacter ? (
            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {selectedCharacter.name} - Dialogue System
                </CardTitle>
                {selectedCharacter.voiceActor && (
                  <p className="text-gray-400">
                    Voiced by: {selectedCharacter.voiceActor}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(selectedCharacter.dialogue).map(
                  ([category, lines]) => (
                    <div key={category} className="space-y-3">
                      <h3 className="text-lg font-semibold text-blue-400 capitalize">
                        {category} Lines
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {lines.map((line, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-900/50 rounded border border-blue-500/30"
                          >
                            <span className="text-gray-300 flex-1">
                              "{line}"
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => playDialogue(line)}
                              className="ml-2"
                            >
                              {activeDialogue === line ? (
                                <Volume2 className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardContent className="text-center py-8">
                <MessageCircle className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">
                  Select a character to access their dialogue system.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="relationships" className="space-y-4">
          {selectedCharacter ? (
            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400">
                  {selectedCharacter.name} - Character Relationships
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-400">
                      Personal Relationships
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(selectedCharacter.relationships).map(
                        ([characterId, relationship]) => {
                          const relatedCharacter = characters.find(
                            (char) => char.id === characterId,
                          );
                          return (
                            <div
                              key={characterId}
                              className="p-3 bg-gray-900/50 rounded border border-blue-500/30"
                            >
                              <div className="font-semibold text-blue-400">
                                {relatedCharacter?.name || characterId}
                              </div>
                              <div className="text-sm text-gray-300">
                                {relationship}
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-green-400">
                      Notable Achievements
                    </h3>
                    <div className="space-y-2">
                      {selectedCharacter.notableAchievements.map(
                        (achievement, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <Award className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-300">
                              {achievement}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">
                    Character Stats
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(selectedCharacter.stats).map(
                      ([stat, value]) => (
                        <div key={stat} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="capitalize text-sm">{stat}:</span>
                            <span className="text-blue-400 font-semibold">
                              {value}%
                            </span>
                          </div>
                          <Progress value={value} className="h-2" />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardContent className="text-center py-8">
                <Heart className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">
                  Select a character to view their relationships and
                  achievements.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Personnel Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Characters:</span>
                    <span className="text-blue-400">{characters.length}</span>
                  </div>
                  {statuses.map((status) => (
                    <div key={status} className="flex justify-between text-sm">
                      <span>{status}:</span>
                      <span className={getStatusColor(status)}>
                        {characters.filter((c) => c.status === status).length}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  By Series
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {shows.map((show) => (
                    <div key={show} className="flex justify-between text-sm">
                      <span className="truncate">{show.split(" ")[0]}:</span>
                      <span className="text-blue-400">
                        {characters.filter((c) => c.show === show).length}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  By Species
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {species.slice(0, 6).map((species) => (
                    <div key={species} className="flex justify-between text-sm">
                      <span className="truncate">{species}:</span>
                      <span className="text-green-400">
                        {characters.filter((c) => c.species === species).length}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {activeDialogue && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <Card className="bg-trek-panel border-trek-accent">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-blue-400 animate-pulse" />
                <span className="text-sm text-trek-text">
                  "{activeDialogue}"
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
