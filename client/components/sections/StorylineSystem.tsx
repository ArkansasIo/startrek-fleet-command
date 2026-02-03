import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
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
import { Switch } from "../ui/switch";
import {
  Book,
  Play,
  Lock,
  CheckCircle,
  Star,
  Target,
  Users,
  Clock,
  Map,
  BookOpen,
  FileText,
  Award,
} from "lucide-react";

interface StorylineSystemProps {
  activeSubmenu?: string;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  duration: number; // in minutes
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  status: "locked" | "available" | "in-progress" | "completed";
  requirements: string[];
  rewards: string[];
  characters: string[];
  locations: string[];
}

interface Episode {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
  summary: string;
  keyEvents: string[];
  status: "locked" | "available" | "in-progress" | "completed";
}

interface Act {
  id: string;
  title: string;
  description: string;
  episodes: Episode[];
  theme: string;
  majorEvents: string[];
  status: "locked" | "available" | "in-progress" | "completed";
}

interface StoryCharacter {
  id: string;
  name: string;
  role: string;
  species: string;
  affiliation: string;
  description: string;
  relationships: { [characterId: string]: string };
  keyTraits: string[];
  development: string[];
}

const storyCharacters: StoryCharacter[] = [
  {
    id: "captain-nova",
    name: "Captain Elena Nova",
    role: "Starship Captain",
    species: "Human",
    affiliation: "United Federation of Planets",
    description:
      "A seasoned Starfleet captain known for her diplomatic skills and tactical brilliance. Commands the USS Horizon on its mission to explore the Delta Quadrant.",
    relationships: {
      "commander-thresh": "First Officer and trusted friend",
      "dr-kalar": "Chief Medical Officer and confidant",
      "lt-vex": "Science Officer and protégé",
    },
    keyTraits: ["Diplomatic", "Strategic", "Compassionate", "Decisive"],
    development: [
      "Leadership under pressure",
      "Balancing exploration and safety",
      "Building trust with new species",
    ],
  },
  {
    id: "commander-thresh",
    name: "Commander Thresh",
    role: "First Officer",
    species: "Andorian",
    affiliation: "United Federation of Planets",
    description:
      "An experienced Andorian officer with strong tactical instincts and unwavering loyalty to his crew and captain.",
    relationships: {
      "captain-nova": "Captain and close friend",
      "chief-korvak": "Security Chief and sparring partner",
    },
    keyTraits: ["Loyal", "Tactical", "Honorable", "Protective"],
    development: [
      "Learning human customs",
      "Balancing Andorian traditions with Starfleet protocols",
      "Mentoring junior officers",
    ],
  },
  {
    id: "dr-kalar",
    name: "Dr. Kalar Voss",
    role: "Chief Medical Officer",
    species: "Bajoran",
    affiliation: "United Federation of Planets",
    description:
      "A brilliant medical researcher and compassionate healer who survived the Cardassian occupation of Bajor.",
    relationships: {
      "captain-nova": "Captain and close friend",
      "ensign-mora": "Medical protégé",
    },
    keyTraits: ["Compassionate", "Brilliant", "Resilient", "Spiritual"],
    development: [
      "Healing from past trauma",
      "Advancing medical science",
      "Mentoring new doctors",
    ],
  },
  {
    id: "lt-vex",
    name: "Lieutenant Vex",
    role: "Science Officer",
    species: "Vulcan",
    affiliation: "United Federation of Planets",
    description:
      "A young Vulcan scientist with exceptional analytical abilities and a curiosity about emotions.",
    relationships: {
      "captain-nova": "Captain and mentor",
      "dr-kalar": "Research collaborator",
    },
    keyTraits: ["Logical", "Curious", "Analytical", "Evolving"],
    development: [
      "Understanding emotions",
      "Balancing logic with intuition",
      "Leadership development",
    ],
  },
  {
    id: "chief-korvak",
    name: "Chief Korvak",
    role: "Security Chief",
    species: "Klingon",
    affiliation: "United Federation of Planets",
    description:
      "A Klingon warrior who chose Starfleet over the Empire, bringing honor and strength to his new family.",
    relationships: {
      "commander-thresh": "First Officer and sparring partner",
      "captain-nova": "Captain and respected leader",
    },
    keyTraits: ["Honorable", "Strong", "Protective", "Conflicted"],
    development: [
      "Balancing Klingon heritage with Starfleet values",
      "Building bridges between cultures",
      "Finding family in crew",
    ],
  },
  {
    id: "admiral-chen",
    name: "Admiral Sarah Chen",
    role: "Starfleet Command",
    species: "Human",
    affiliation: "United Federation of Planets",
    description:
      "A strategic thinker and political navigator who oversees deep space exploration missions.",
    relationships: {
      "captain-nova": "Commanding officer and mentor",
    },
    keyTraits: ["Strategic", "Political", "Wise", "Demanding"],
    development: [
      "Balancing politics with exploration",
      "Supporting field commanders",
      "Preparing for unknown threats",
    ],
  },
  {
    id: "high-prelate-zarn",
    name: "High Prelate Zarn",
    role: "Spiritual Leader",
    species: "Zakdorn",
    affiliation: "Zakdorn Hierarchy",
    description:
      "An ancient and wise spiritual leader who becomes an unlikely ally in the struggle against the Shadow Coalition.",
    relationships: {
      "captain-nova": "Unlikely ally and guide",
    },
    keyTraits: ["Wise", "Mysterious", "Powerful", "Benevolent"],
    development: [
      "Revealing ancient secrets",
      "Teaching spiritual wisdom",
      "Sacrificing for the greater good",
    ],
  },
  {
    id: "shadow-emperor",
    name: "The Shadow Emperor",
    role: "Primary Antagonist",
    species: "Unknown",
    affiliation: "Shadow Coalition",
    description:
      "A mysterious and powerful entity leading an alliance of dark forces from beyond known space.",
    relationships: {
      "captain-nova": "Primary enemy and philosophical opposite",
    },
    keyTraits: ["Mysterious", "Powerful", "Manipulative", "Ancient"],
    development: [
      "Revealing true nature",
      "Testing heroes",
      "Ultimate confrontation",
    ],
  },
];

const generateStoryStructure = (): Act[] => {
  const acts: Act[] = [];

  for (let actNum = 1; actNum <= 12; actNum++) {
    const episodes: Episode[] = [];

    for (let episodeNum = 1; episodeNum <= 30; episodeNum++) {
      const chapters: Chapter[] = [];

      for (let chapterNum = 1; chapterNum <= 10; chapterNum++) {
        const chapter: Chapter = {
          id: `act-${actNum}-ep-${episodeNum}-ch-${chapterNum}`,
          title: generateChapterTitle(actNum, episodeNum, chapterNum),
          description: generateChapterDescription(
            actNum,
            episodeNum,
            chapterNum,
          ),
          objectives: generateObjectives(actNum, episodeNum, chapterNum),
          duration: Math.floor(Math.random() * 30) + 15,
          difficulty: getDifficulty(actNum, chapterNum),
          status:
            actNum === 1 && episodeNum === 1 && chapterNum === 1
              ? "available"
              : "locked",
          requirements: generateRequirements(actNum, episodeNum, chapterNum),
          rewards: generateRewards(actNum, episodeNum, chapterNum),
          characters: getRelevantCharacters(actNum, episodeNum),
          locations: generateLocations(actNum, episodeNum),
        };
        chapters.push(chapter);
      }

      const episode: Episode = {
        id: `act-${actNum}-ep-${episodeNum}`,
        title: generateEpisodeTitle(actNum, episodeNum),
        description: generateEpisodeDescription(actNum, episodeNum),
        chapters,
        summary: generateEpisodeSummary(actNum, episodeNum),
        keyEvents: generateKeyEvents(actNum, episodeNum),
        status: actNum === 1 && episodeNum === 1 ? "available" : "locked",
      };
      episodes.push(episode);
    }

    const act: Act = {
      id: `act-${actNum}`,
      title: getActTitle(actNum),
      description: getActDescription(actNum),
      episodes,
      theme: getActTheme(actNum),
      majorEvents: getActMajorEvents(actNum),
      status: actNum === 1 ? "available" : "locked",
    };
    acts.push(act);
  }

  return acts;
};

const getActTitle = (actNum: number): string => {
  const titles = [
    "First Contact",
    "The Unknown Frontier",
    "Shadows in the Void",
    "Ancient Mysteries",
    "The Coalition Forms",
    "Diplomatic Crisis",
    "War Preparations",
    "The Great Battle",
    "Aftermath and Revelation",
    "The Final Alliance",
    "Convergence",
    "Legacy of Heroes",
  ];
  return `Act ${actNum}: ${titles[actNum - 1]}`;
};

const getActDescription = (actNum: number): string => {
  const descriptions = [
    "The USS Horizon begins its mission in the Delta Quadrant, encountering new species and establishing first contact protocols.",
    "Deep exploration reveals ancient artifacts and mysterious signals that hint at a greater threat.",
    "Dark forces emerge from beyond known space, challenging everything the crew believes about the universe.",
    "The crew uncovers ancient civilizations and their warnings about a coming darkness.",
    "Enemy factions unite under a mysterious leader, forming a coalition that threatens the galaxy.",
    "Diplomatic efforts strain as tensions rise between traditional allies and new threats emerge.",
    "The Federation prepares for war while the crew seeks alternative solutions to the growing crisis.",
    "Epic battles rage across multiple fronts as heroes and villains clash in decisive confrontations.",
    "The war ends but revelations about the true nature of the conflict reshape understanding.",
    "Former enemies must work together to face an even greater threat that transcends their conflicts.",
    "All storylines converge as the crew faces their ultimate test and greatest challenge.",
    "The resolution of the crisis and the lasting impact on the characters and the galaxy.",
  ];
  return descriptions[actNum - 1];
};

const getActTheme = (actNum: number): string => {
  const themes = [
    "Discovery and Wonder",
    "Mystery and Exploration",
    "Emerging Threats",
    "Ancient Wisdom",
    "Unity and Division",
    "Diplomacy vs Force",
    "Preparation and Sacrifice",
    "Heroism and Loss",
    "Truth and Consequences",
    "Redemption and Alliance",
    "Ultimate Test",
    "Legacy and Hope",
  ];
  return themes[actNum - 1];
};

const getActMajorEvents = (actNum: number): string[] => {
  const events = [
    [
      "First contact with Zelani Empire",
      "Discovery of ancient probe",
      "Establishment of Delta Base",
    ],
    [
      "Mapping of quantum anomalies",
      "Discovery of Precursor ruins",
      "First Shadow sighting",
    ],
    [
      "Shadow fleet attacks",
      "Loss of contact with Earth",
      "Formation of local alliances",
    ],
    [
      "Precursor awakening",
      "Ancient guardian encounter",
      "Revelation of galactic history",
    ],
    [
      "Shadow Coalition formation",
      "Major species alignment",
      "Diplomatic breakdown",
    ],
    [
      "Peace summit failure",
      "Trade route disruption",
      "Cultural exchange crisis",
    ],
    [
      "Fleet mobilization",
      "Weapon development",
      "Strategic alliance formation",
    ],
    ["Battle of Binary Stars", "Siege of Delta Base", "Hero's sacrifice"],
    [
      "Shadow Emperor revealed",
      "True purpose discovered",
      "Alliance reformation",
    ],
    ["Unlikely partnerships", "Enemy redemption", "Final preparation"],
    ["Ultimate confrontation", "Galactic unity", "Cosmic revelation"],
    ["New era begins", "Heroes honored", "Future secured"],
  ];
  return events[actNum - 1];
};

const generateEpisodeTitle = (actNum: number, episodeNum: number): string => {
  const prefixes = [
    "The",
    "A",
    "First",
    "Last",
    "Silent",
    "Hidden",
    "Lost",
    "New",
    "Ancient",
    "Final",
  ];
  const subjects = [
    "Alliance",
    "Discovery",
    "Threat",
    "Hope",
    "Mystery",
    "Battle",
    "Journey",
    "Secret",
    "Truth",
    "Legacy",
  ];

  return `${prefixes[episodeNum % prefixes.length]} ${subjects[Math.floor(episodeNum / 3) % subjects.length]}`;
};

const generateEpisodeDescription = (
  actNum: number,
  episodeNum: number,
): string => {
  return `Episode ${episodeNum} of Act ${actNum} continues the epic storyline with new challenges and revelations for the crew of the USS Horizon.`;
};

const generateEpisodeSummary = (actNum: number, episodeNum: number): string => {
  return `A crucial episode that advances the main storyline through character development, plot progression, and universe building.`;
};

const generateKeyEvents = (actNum: number, episodeNum: number): string[] => {
  return [
    "Major plot advancement",
    "Character development moment",
    "Universe expansion",
    "Conflict resolution or escalation",
  ];
};

const generateChapterTitle = (
  actNum: number,
  episodeNum: number,
  chapterNum: number,
): string => {
  const actions = [
    "Investigate",
    "Discover",
    "Confront",
    "Negotiate",
    "Explore",
    "Defend",
    "Rescue",
    "Analyze",
    "Infiltrate",
    "Unite",
  ];
  const objects = [
    "the Signal",
    "New Allies",
    "Hidden Dangers",
    "Ancient Ruins",
    "Enemy Forces",
    "Lost Crew",
    "Strange Phenomenon",
    "Political Crisis",
    "Temporal Anomaly",
    "Final Truth",
  ];

  return `${actions[chapterNum - 1]} ${objects[Math.floor(Math.random() * objects.length)]}`;
};

const generateChapterDescription = (
  actNum: number,
  episodeNum: number,
  chapterNum: number,
): string => {
  return `Chapter ${chapterNum} presents unique challenges that test the crew's skills, values, and unity as they progress through their mission.`;
};

const generateObjectives = (
  actNum: number,
  episodeNum: number,
  chapterNum: number,
): string[] => {
  const baseObjectives = [
    "Complete primary mission parameters",
    "Ensure crew safety and unity",
    "Gather intelligence on threats",
    "Maintain diplomatic relations",
    "Advance scientific understanding",
  ];

  return baseObjectives.slice(0, Math.floor(Math.random() * 3) + 2);
};

const getDifficulty = (
  actNum: number,
  chapterNum: number,
): "Easy" | "Medium" | "Hard" | "Expert" => {
  if (actNum <= 3) return chapterNum <= 3 ? "Easy" : "Medium";
  if (actNum <= 6) return chapterNum <= 3 ? "Medium" : "Hard";
  if (actNum <= 9) return chapterNum <= 3 ? "Hard" : "Expert";
  return "Expert";
};

const generateRequirements = (
  actNum: number,
  episodeNum: number,
  chapterNum: number,
): string[] => {
  const requirements = [
    "Complete previous chapter",
    "Diplomatic training",
    "Scientific analysis skills",
    "Combat readiness",
    "Cultural knowledge",
  ];

  return requirements.slice(0, Math.floor(Math.random() * 2) + 1);
};

const generateRewards = (
  actNum: number,
  episodeNum: number,
  chapterNum: number,
): string[] => {
  const rewards = [
    "Experience points",
    "Character development",
    "Technology advancement",
    "Alliance strength",
    "Story progression",
  ];

  return rewards.slice(0, Math.floor(Math.random() * 3) + 2);
};

const getRelevantCharacters = (
  actNum: number,
  episodeNum: number,
): string[] => {
  const mainCast = ["captain-nova", "commander-thresh", "dr-kalar", "lt-vex"];
  const supporting = ["chief-korvak", "admiral-chen"];
  const antagonists = ["shadow-emperor"];
  const allies = ["high-prelate-zarn"];

  let characters = [...mainCast];
  if (Math.random() > 0.5) characters.push(...supporting.slice(0, 1));
  if (actNum > 6) characters.push(...antagonists);
  if (actNum > 4) characters.push(...allies);

  return characters;
};

const generateLocations = (actNum: number, episodeNum: number): string[] => {
  const locations = [
    "USS Horizon Bridge",
    "Delta Quadrant Space",
    "Alien Homeworld",
    "Ancient Ruins",
    "Space Station",
    "Nebula Anomaly",
    "Diplomatic Conference",
    "Battle Zone",
    "Research Facility",
    "Sacred Temple",
  ];

  return locations.slice(0, Math.floor(Math.random() * 3) + 2);
};

export default function StorylineSystem({
  activeSubmenu,
}: StorylineSystemProps) {
  const normalizeSubmenu = (submenu?: string) => {
    const allowed = new Set(["overview", "acts", "characters", "progress"]);
    return submenu && allowed.has(submenu) ? submenu : "overview";
  };
  const [storyStructure] = useState<Act[]>(generateStoryStructure());
  const [selectedAct, setSelectedAct] = useState<Act | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedCharacter, setSelectedCharacter] =
    useState<StoryCharacter | null>(null);
  const [activeView, setActiveView] = useState<
    "overview" | "acts" | "characters" | "progress"
  >(normalizeSubmenu(activeSubmenu));

  useEffect(() => {
    setActiveView(normalizeSubmenu(activeSubmenu));
  }, [activeSubmenu]);

  const getTotalProgress = () => {
    const totalChapters = storyStructure.reduce(
      (total, act) =>
        total +
        act.episodes.reduce(
          (episodeTotal, episode) => episodeTotal + episode.chapters.length,
          0,
        ),
      0,
    );

    const completedChapters = storyStructure.reduce(
      (total, act) =>
        total +
        act.episodes.reduce(
          (episodeTotal, episode) =>
            episodeTotal +
            episode.chapters.filter((chapter) => chapter.status === "completed")
              .length,
          0,
        ),
      0,
    );

    return Math.round((completedChapters / totalChapters) * 100);
  };

  const getActProgress = (act: Act) => {
    const totalChapters = act.episodes.reduce(
      (total, episode) => total + episode.chapters.length,
      0,
    );
    const completedChapters = act.episodes.reduce(
      (total, episode) =>
        total +
        episode.chapters.filter((chapter) => chapter.status === "completed")
          .length,
      0,
    );

    return Math.round((completedChapters / totalChapters) * 100);
  };

  const getEpisodeProgress = (episode: Episode) => {
    const totalChapters = episode.chapters.length;
    const completedChapters = episode.chapters.filter(
      (chapter) => chapter.status === "completed",
    ).length;

    return Math.round((completedChapters / totalChapters) * 100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "locked":
        return <Lock className="w-4 h-4 text-gray-500" />;
      case "available":
        return <Play className="w-4 h-4 text-blue-400" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <Lock className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400";
      case "Medium":
        return "text-yellow-400";
      case "Hard":
        return "text-orange-400";
      case "Expert":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-blue-400">
          STAR TREK STORYLINE
        </h1>
        <p className="text-xl text-gray-300">
          Epic Campaign: 12 Acts • 360 Episodes • 3,600 Chapters
        </p>
        <div className="flex items-center justify-center space-x-4">
          <span className="text-sm text-gray-400">Overall Progress:</span>
          <Progress value={getTotalProgress()} className="w-48" />
          <span className="text-sm text-blue-400">{getTotalProgress()}%</span>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Story Overview</TabsTrigger>
          <TabsTrigger value="acts">Acts & Episodes</TabsTrigger>
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-gray-800/30 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center">
                <Book className="w-5 h-5 mr-2" />
                StarFleet Command: Online
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Experience epic Star Trek adventures in this comprehensive
                MMORPG storyline spanning 12 acts, each containing 30 episodes
                with 10 chapters per episode, creating a vast narrative universe
                of exploration, diplomacy, conflict, and discovery.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-900/50 p-4 rounded-lg border border-blue-500/30">
                  <h4 className="font-semibold text-blue-400 mb-2">
                    Story Scope
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Acts:</span>
                      <span className="text-blue-400">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Episodes per Act:</span>
                      <span className="text-blue-400">30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chapters per Episode:</span>
                      <span className="text-blue-400">10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Chapters:</span>
                      <span className="text-green-400">3,600</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-lg border border-blue-500/30">
                  <h4 className="font-semibold text-blue-400 mb-2">
                    Story Themes
                  </h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Exploration and Discovery</li>
                    <li>• Diplomacy and First Contact</li>
                    <li>��� Ancient Mysteries</li>
                    <li>• Conflict and Resolution</li>
                    <li>• Character Development</li>
                    <li>• Unity and Sacrifice</li>
                  </ul>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-lg border border-blue-500/30">
                  <h4 className="font-semibold text-blue-400 mb-2">
                    Main Characters
                  </h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Captain Elena Nova</li>
                    <li>• Commander Thresh</li>
                    <li>• Dr. Kalar Voss</li>
                    <li>• Lieutenant Vex</li>
                    <li>• Chief Korvak</li>
                    <li>• The Shadow Emperor</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-blue-400">
                  Story Arc Overview
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {storyStructure.slice(0, 6).map((act, index) => (
                    <div
                      key={act.id}
                      className="bg-gray-900/30 p-3 rounded border border-blue-500/20"
                    >
                      <h5 className="font-semibold text-blue-400 text-sm">
                        {act.title}
                      </h5>
                      <p className="text-xs text-gray-400 mt-1">{act.theme}</p>
                      <Progress
                        value={getActProgress(act)}
                        className="mt-2 h-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acts" className="space-y-4">
          {!selectedAct ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {storyStructure.map((act) => (
                <Card
                  key={act.id}
                  className="bg-gray-800/30 border-blue-500/30 hover:border-blue-400/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedAct(act)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-blue-400">
                          {act.title}
                        </CardTitle>
                        <p className="text-sm text-gray-400 mt-1">
                          {act.theme}
                        </p>
                      </div>
                      {getStatusIcon(act.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-300">{act.description}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Progress</span>
                        <span className="text-xs text-blue-400">
                          {getActProgress(act)}%
                        </span>
                      </div>
                      <Progress value={getActProgress(act)} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-sm font-semibold text-blue-400">
                        Major Events
                      </h5>
                      <ul className="text-xs text-gray-300 space-y-1">
                        {act.majorEvents.slice(0, 2).map((event, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-1"
                          >
                            <Star className="w-3 h-3 mt-0.5 text-yellow-400 flex-shrink-0" />
                            <span>{event}</span>
                          </li>
                        ))}
                        {act.majorEvents.length > 2 && (
                          <li className="text-blue-400">
                            +{act.majorEvents.length - 2} more events...
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{act.episodes.length} Episodes</span>
                      <span>
                        {act.episodes.reduce(
                          (total, ep) => total + ep.chapters.length,
                          0,
                        )}{" "}
                        Chapters
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !selectedEpisode ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => setSelectedAct(null)}>
                  ← Back to Acts
                </Button>
                <h2 className="text-2xl font-bold text-blue-400">
                  {selectedAct.title}
                </h2>
              </div>

              <Card className="bg-gray-800/30 border-blue-500/30">
                <CardContent className="p-4">
                  <p className="text-gray-300 mb-4">
                    {selectedAct.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-2">
                        Theme
                      </h4>
                      <p className="text-sm text-gray-300">
                        {selectedAct.theme}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-2">
                        Progress
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Progress
                          value={getActProgress(selectedAct)}
                          className="flex-1"
                        />
                        <span className="text-sm text-blue-400">
                          {getActProgress(selectedAct)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedAct.episodes.map((episode) => (
                  <Card
                    key={episode.id}
                    className="bg-gray-800/30 border-blue-500/30 hover:border-blue-400/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedEpisode(episode)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg text-blue-400">
                          {episode.title}
                        </CardTitle>
                        {getStatusIcon(episode.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-300">
                        {episode.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">
                            Chapter Progress
                          </span>
                          <span className="text-xs text-blue-400">
                            {getEpisodeProgress(episode)}%
                          </span>
                        </div>
                        <Progress
                          value={getEpisodeProgress(episode)}
                          className="h-2"
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{episode.chapters.length} Chapters</span>
                        <span>
                          {
                            episode.chapters.filter(
                              (ch) => ch.status === "completed",
                            ).length
                          }{" "}
                          Completed
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedEpisode(null)}
                >
                  ← Back to Episodes
                </Button>
                <h2 className="text-2xl font-bold text-blue-400">
                  {selectedEpisode.title}
                </h2>
              </div>

              <Card className="bg-gray-800/30 border-blue-500/30">
                <CardContent className="p-4">
                  <p className="text-gray-300 mb-4">
                    {selectedEpisode.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-2">
                        Summary
                      </h4>
                      <p className="text-sm text-gray-300">
                        {selectedEpisode.summary}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-2">
                        Key Events
                      </h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {selectedEpisode.keyEvents.map((event, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-1"
                          >
                            <Target className="w-3 h-3 mt-0.5 text-blue-400 flex-shrink-0" />
                            <span>{event}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedEpisode.chapters.map((chapter) => (
                  <Card
                    key={chapter.id}
                    className="bg-gray-800/30 border-blue-500/30 hover:border-blue-400/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedChapter(chapter)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-blue-400">
                            {chapter.title}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge
                              variant="outline"
                              className={`text-xs ${getDifficultyColor(chapter.difficulty)}`}
                            >
                              {chapter.difficulty}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {chapter.duration}m
                            </span>
                          </div>
                        </div>
                        {getStatusIcon(chapter.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-300">
                        {chapter.description}
                      </p>

                      <div className="space-y-2">
                        <h5 className="text-sm font-semibold text-blue-400">
                          Objectives
                        </h5>
                        <ul className="text-xs text-gray-300 space-y-1">
                          {chapter.objectives
                            .slice(0, 2)
                            .map((objective, index) => (
                              <li
                                key={index}
                                className="flex items-start space-x-1"
                              >
                                <Target className="w-3 h-3 mt-0.5 text-blue-400 flex-shrink-0" />
                                <span>{objective}</span>
                              </li>
                            ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{chapter.characters.length} Characters</span>
                        <span>{chapter.locations.length} Locations</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="characters" className="space-y-4">
          {!selectedCharacter ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {storyCharacters.map((character) => (
                <Card
                  key={character.id}
                  className="bg-gray-800/30 border-blue-500/30 hover:border-blue-400/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedCharacter(character)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-blue-400">
                      {character.name}
                    </CardTitle>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        {character.role}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {character.species}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-300">
                      {character.description}
                    </p>

                    <div className="space-y-2">
                      <h5 className="text-sm font-semibold text-blue-400">
                        Key Traits
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {character.keyTraits.map((trait, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-gray-400">
                      {character.affiliation}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCharacter(null)}
                >
                  ← Back to Characters
                </Button>
                <h2 className="text-2xl font-bold text-blue-400">
                  {selectedCharacter.name}
                </h2>
              </div>

              <Card className="bg-gray-800/30 border-blue-500/30">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-blue-400">
                        {selectedCharacter.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">
                          {selectedCharacter.role}
                        </Badge>
                        <Badge variant="outline">
                          {selectedCharacter.species}
                        </Badge>
                        <Badge variant="outline">
                          {selectedCharacter.affiliation}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">
                    {selectedCharacter.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">
                          Key Traits
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCharacter.keyTraits.map((trait, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-sm"
                            >
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">
                          Character Development
                        </h4>
                        <ul className="space-y-2">
                          {selectedCharacter.development.map((dev, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <Star className="w-4 h-4 mt-0.5 text-yellow-400 flex-shrink-0" />
                              <span className="text-sm text-gray-300">
                                {dev}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-blue-400 mb-2">
                        Relationships
                      </h4>
                      <div className="space-y-3">
                        {Object.entries(selectedCharacter.relationships).map(
                          ([characterId, relationship]) => {
                            const relatedCharacter = storyCharacters.find(
                              (char) => char.id === characterId,
                            );
                            return (
                              <div
                                key={characterId}
                                className="bg-gray-900/50 p-3 rounded border border-blue-500/30"
                              >
                                <div className="font-semibold text-sm text-blue-400">
                                  {relatedCharacter?.name ||
                                    "Unknown Character"}
                                </div>
                                <div className="text-xs text-gray-300 mt-1">
                                  {relationship}
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">
                      {getTotalProgress()}%
                    </div>
                    <div className="text-sm text-gray-400">
                      Story Completion
                    </div>
                  </div>
                  <Progress value={getTotalProgress()} className="h-3" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-400">
                        0
                      </div>
                      <div className="text-gray-400">Completed Acts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-yellow-400">
                        1
                      </div>
                      <div className="text-gray-400">Current Act</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Character Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {storyCharacters.slice(0, 4).map((character) => (
                    <div key={character.id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">
                          {character.name}
                        </span>
                        <span className="text-xs text-blue-400">Level 1</span>
                      </div>
                      <Progress
                        value={Math.random() * 30 + 10}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">First Contact Specialist</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-400">
                      Diplomatic Excellence
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-400">
                      Shadow Vanquisher
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-400">Galactic Hero</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800/30 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400">
                Act Progress Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {storyStructure.map((act) => (
                  <div
                    key={act.id}
                    className="bg-gray-900/50 p-4 rounded border border-blue-500/30"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-blue-400">
                        {act.title}
                      </h4>
                      {getStatusIcon(act.status)}
                    </div>
                    <Progress
                      value={getActProgress(act)}
                      className="mb-2 h-2"
                    />
                    <div className="text-sm text-gray-400">
                      {getActProgress(act)}% Complete
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedChapter && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-900 border-blue-500/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-blue-400">
                    {selectedChapter.title}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className={getDifficultyColor(selectedChapter.difficulty)}
                    >
                      {selectedChapter.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {selectedChapter.duration} minutes
                    </Badge>
                    {getStatusIcon(selectedChapter.status)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedChapter(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-300">{selectedChapter.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">
                      Objectives
                    </h4>
                    <ul className="space-y-2">
                      {selectedChapter.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Target className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                          <span className="text-sm text-gray-300">
                            {objective}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">
                      Characters
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedChapter.characters.map((characterId) => {
                        const character = storyCharacters.find(
                          (char) => char.id === characterId,
                        );
                        return (
                          <Badge
                            key={characterId}
                            variant="outline"
                            className="text-sm"
                          >
                            {character?.name || characterId}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">
                      Locations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedChapter.locations.map((location, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-sm"
                        >
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">
                      Requirements
                    </h4>
                    <ul className="space-y-2">
                      {selectedChapter.requirements.map(
                        (requirement, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                            <span className="text-sm text-gray-300">
                              {requirement}
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">
                      Rewards
                    </h4>
                    <ul className="space-y-2">
                      {selectedChapter.rewards.map((reward, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Award className="w-4 h-4 mt-0.5 text-yellow-400 flex-shrink-0" />
                          <span className="text-sm text-gray-300">
                            {reward}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {selectedChapter.status === "available" && (
                <div className="flex space-x-4">
                  <Button className="flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    Begin Chapter
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Chapter Notes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
