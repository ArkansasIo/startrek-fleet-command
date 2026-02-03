import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import {
  Star,
  ChevronRight,
  Play,
  Volume2,
  VolumeX,
  SkipForward,
  Pause,
  Music,
} from "lucide-react";
import {
  useSceneAudio,
  useStarTrekAudio,
  StarTrekAudioControls,
} from "../audio/StarTrekAudioSystem";

interface PrologScene {
  id: string;
  type: "title" | "text" | "dialogue" | "image" | "transition";
  content: string;
  speaker?: string;
  duration: number;
  background?: string;
  music?: string;
  effects?: string[];
}

const prologScenes: PrologScene[] = [
  {
    id: "opening-title",
    type: "title",
    content: "STARFLEET COMMAND: ONLINE",
    duration: 5000,
    background: "stars",
    music: "epic-orchestral",
  },
  {
    id: "subtitle",
    type: "title",
    content: "THE HORIZON CHRONICLES",
    duration: 4000,
    background: "stars",
  },
  {
    id: "subtitle-2",
    type: "title",
    content: "A Star Trek MMORPG Epic",
    duration: 3000,
    background: "stars",
  },
  {
    id: "space-intro",
    type: "text",
    content:
      "Space... the final frontier. These are the voyages of the starship Horizon. Its continuing mission: to explore strange new worlds, to seek out new life and new civilizations. To boldly go where no one has gone before.",
    duration: 9000,
    background: "nebula",
    music: "star-trek-theme",
  },
  {
    id: "stardate",
    type: "text",
    content: "Stardate 2387.156\nDelta Quadrant - Beyond Charted Space\n78,000 Light Years from Earth",
    duration: 5000,
    background: "nebula",
  },
  {
    id: "federation-history",
    type: "text",
    content:
      "Twenty years have passed since the USS Voyager's triumphant return from the Delta Quadrant. The stories they brought back sparked the imagination of the entire Federation.",
    duration: 7000,
    background: "ship-exterior",
  },
  {
    id: "new-mission",
    type: "text",
    content:
      "Now, the United Federation of Planets launches its most ambitious endeavor yet: Project Horizon - a permanent presence in the distant Delta Quadrant, bridging two halves of the galaxy.",
    duration: 8000,
    background: "delta-quadrant-map",
  },
  {
    id: "horizon-unveiled",
    type: "text",
    content:
      "At the heart of this mission stands the USS Horizon - a state-of-the-art Sovereign-class starship, equipped with the latest in Federation technology and crewed by Starfleet's finest officers.",
    duration: 8000,
    background: "ship-exterior",
  },
  {
    id: "nova-intro",
    type: "dialogue",
    content:
      "Captain's Log, Stardate 2387.156. We've successfully traversed the Barzan wormhole and established Deep Space Horizon, our primary base of operations in the Delta Quadrant.",
    speaker: "Captain Elena Nova",
    duration: 8000,
    background: "bridge",
  },
  {
    id: "nova-reflection",
    type: "dialogue",
    content:
      "Following in Captain Janeway's footsteps is both an honor and a tremendous responsibility. Our mission is clear: explore, establish diplomatic relations, and expand the Federation's sphere of knowledge and cooperation.",
    speaker: "Captain Nova",
    duration: 9000,
    background: "bridge",
  },
  {
    id: "crew-unity",
    type: "text",
    content:
      "Captain Nova's crew represents the best of the Federation - diverse, skilled, and united by a common purpose. Together, they stand ready to face the unknown.",
    duration: 7000,
    background: "crew-assembly",
  },
  {
    id: "thresh-intro",
    type: "dialogue",
    content:
      "Captain, I've served under three commanding officers, but none inspire confidence like you do. The crew stands ready for whatever challenges await us in these uncharted regions.",
    speaker: "Commander Thresh - First Officer",
    duration: 8000,
    background: "bridge",
  },
  {
    id: "vex-discovery",
    type: "dialogue",
    content:
      "Captain, our long-range sensors have detected something extraordinary. Energy signatures across twelve sectors exhibiting quantum properties that shouldn't exist according to known physics.",
    speaker: "Lieutenant Vex - Science Officer",
    duration: 9000,
    background: "science-station",
  },
  {
    id: "nova-concern",
    type: "dialogue",
    content:
      "Shouldn't exist, Lieutenant? That's a strong statement. What exactly are we looking at?",
    speaker: "Captain Nova",
    duration: 6000,
    background: "bridge",
  },
  {
    id: "vex-analysis",
    type: "dialogue",
    content:
      "The quantum signatures suggest technology that predates the Iconians - possibly by millions of years. We may have discovered evidence of a civilization that existed when the galaxy was young. The implications are... staggering.",
    speaker: "Lieutenant Vex",
    duration: 11000,
    background: "science-station",
  },
  {
    id: "kalar-warning",
    type: "dialogue",
    content:
      "Captain, the Prophets taught my people that some doors are meant to remain closed. Ancient powers often sleep for good reason. We should proceed with extreme caution.",
    speaker: "Dr. Kalar Voss - Chief Medical Officer",
    duration: 9000,
    background: "bridge",
  },
  {
    id: "korvak-eager",
    type: "dialogue",
    content:
      "With respect, Doctor, a warrior does not fear the unknown. If there are challenges ahead, we will face them with honor! This is why we came to the Delta Quadrant!",
    speaker: "Chief Korvak - Security Chief",
    duration: 9000,
    background: "bridge",
  },
  {
    id: "thresh-alert",
    type: "dialogue",
    content:
      "Captain, I'm detecting massive subspace distortions. They're emanating from the locations Lieutenant Vex identified. Whatever's out there... it's waking up.",
    speaker: "Commander Thresh",
    duration: 8000,
    background: "bridge",
    effects: ["ominous-tone"],
  },
  {
    id: "ancient-awakening",
    type: "text",
    content:
      "Across the vast expanse of the Delta Quadrant, ancient mechanisms buried for eons begin to activate. Systems designed by beings of incomprehensible power stir from their long slumber...",
    duration: 9000,
    background: "dark-space",
    effects: ["ominous-tone"],
  },
  {
    id: "shadow-realm",
    type: "text",
    content:
      "In dimensions beyond normal space, where reality bends and time flows differently, ancient minds awaken. The Shadow Coalition - whispered about in legends across a thousand worlds - begins to rise.",
    duration: 10000,
    background: "shadow-realm",
    effects: ["dark-whispers"],
  },
  {
    id: "emperor-first-words",
    type: "dialogue",
    content:
      "So... the young races have finally found us. How... amusing. After ten million years of silence, they stumble into our domain like children playing in the ruins of gods.",
    speaker: "The Shadow Emperor",
    duration: 10000,
    background: "shadow-throne",
    effects: ["dark-power"],
  },
  {
    id: "emperor-declaration",
    type: "dialogue",
    content:
      "This galaxy was ours before the stars learned to burn. It will be ours again. Let the Federation, the Klingons, the Romulans... let them all tremble. The Age of Shadows returns.",
    speaker: "The Shadow Emperor",
    duration: 10000,
    background: "shadow-throne",
    effects: ["dark-power"],
  },
  {
    id: "distant-warning",
    type: "text",
    content:
      "Meanwhile, across the Delta Quadrant, civilizations that have survived for millennia begin detecting the same disturbances. Ancient prophecies are remembered. Old alliances are tested.",
    duration: 9000,
    background: "galactic-map",
  },
  {
    id: "nova-determination",
    type: "dialogue",
    content:
      "I won't lie to you - we've stumbled onto something that could change everything we know about this galaxy. But we're Starfleet officers. We face the unknown not with fear, but with curiosity and courage.",
    speaker: "Captain Nova",
    duration: 10000,
    background: "bridge",
  },
  {
    id: "nova-resolve",
    type: "dialogue",
    content:
      "Whatever's out there, we'll face it together - with honor, with wisdom, and with the unshakeable belief that understanding and diplomacy can overcome any challenge. That's what it means to wear this uniform.",
    speaker: "Captain Nova",
    duration: 11000,
    background: "bridge",
  },
  {
    id: "mission-scale",
    type: "text",
    content:
      "Your journey begins here, but it will take you across the entire Delta Quadrant. Twelve epic acts await, each containing thirty episodes filled with choices that matter.",
    duration: 8000,
    background: "galactic-map",
  },
  {
    id: "your-role",
    type: "text",
    content:
      "You are not just an observer in this story - you are its author. Every decision, every alliance, every battle will shape not just your destiny, but the fate of billions across the galaxy.",
    duration: 9000,
    background: "decision-moment",
  },
  {
    id: "diplomatic-path",
    type: "text",
    content:
      "Will you seek peaceful solutions, forging alliances with the diverse species of the Delta Quadrant? Form coalitions that span sectors, trade knowledge for friendship, and build a future of cooperation?",
    duration: 10000,
    background: "crew-assembly",
  },
  {
    id: "combat-path",
    type: "text",
    content:
      "Or will you rely on strength and tactical brilliance? Command mighty fleets in epic battles, master advanced weapons systems, and prove that the Federation will defend its ideals at any cost?",
    duration: 9000,
    background: "epic-montage",
  },
  {
    id: "exploration-path",
    type: "text",
    content:
      "Perhaps you'll choose the path of exploration and discovery? Uncover ancient mysteries, study phenomena that defy explanation, and push the boundaries of scientific knowledge to its absolute limits?",
    duration: 10000,
    background: "nebula",
  },
  {
    id: "character-bonds",
    type: "text",
    content:
      "Your crew will grow alongside you. Build trust with Commander Thresh through shared trials. Debate philosophy with Dr. Kalar. Solve impossible puzzles with Lieutenant Vex. Train in combat alongside Chief Korvak.",
    duration: 11000,
    background: "crew-assembly",
  },
  {
    id: "relationships-matter",
    type: "text",
    content:
      "These relationships aren't just story elements - they're the heart of your journey. Your crew's loyalty, their skills, even their survival may depend on the bonds you forge.",
    duration: 9000,
    background: "bridge",
  },
  {
    id: "epic-scope",
    type: "text",
    content:
      "From first contact with species that challenge your understanding of life itself, to political intrigue that spans sectors, to the ultimate confrontation with forces that predate civilization...",
    duration: 10000,
    background: "epic-montage",
  },
  {
    id: "legacy",
    type: "text",
    content:
      "Your actions will echo across the Delta Quadrant. Your name will be remembered - as a peacemaker, a warrior, a explorer, or perhaps all three. The legend you create is yours alone.",
    duration: 9000,
    background: "galactic-map",
  },
  {
    id: "final-moment",
    type: "dialogue",
    content:
      "All hands, this is the Captain. We stand on the threshold of the greatest adventure in Federation history. Our journey will be long, our challenges many, but I believe in each and every one of you.",
    speaker: "Captain Nova",
    duration: 11000,
    background: "bridge",
  },
  {
    id: "final-call",
    type: "dialogue",
    content:
      "Set course for the first anomaly coordinates. Helm, engage at warp eight. It's time to show the Delta Quadrant what Starfleet is made of. Horizon out.",
    speaker: "Captain Nova",
    duration: 9000,
    background: "ship-departure",
  },
  {
    id: "begin-journey",
    type: "title",
    content: "YOUR JOURNEY BEGINS NOW",
    duration: 4000,
    background: "warp-stars",
  },
  {
    id: "engage",
    type: "title",
    content: "ENGAGE",
    duration: 2000,
    background: "warp-stars",
  },
];

interface StoryPrologProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function StoryProlog({ onComplete, onSkip }: StoryPrologProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [showText, setShowText] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const currentScene = prologScenes[currentSceneIndex];
  const totalScenes = prologScenes.length;

  // Audio hooks
  const { playSceneMusic, playSceneEffects, stopAllAudio } = useSceneAudio();
  const { isGlobalMuted, setGlobalMuted } = useStarTrekAudio();

  useEffect(() => {
    if (!isPlaying) return;

    setShowText(false);
    const showTextTimer = setTimeout(() => setShowText(true), 500);

    // Play scene-specific audio
    if (audioEnabled) {
      playSceneMusic(currentScene.id);
      if (currentScene.effects) {
        playSceneEffects(currentScene.effects);
      }
    }

    const progressInterval = setInterval(() => {
      setSceneProgress((prev) => {
        const newProgress = prev + 100 / (currentScene.duration / 100);
        return Math.min(newProgress, 100);
      });
    }, 100);

    const sceneTimer = setTimeout(() => {
      if (currentSceneIndex < totalScenes - 1) {
        setCurrentSceneIndex((prev) => prev + 1);
        setSceneProgress(0);
        setProgress(((currentSceneIndex + 1) / totalScenes) * 100);
      } else {
        stopAllAudio();
        onComplete();
      }
    }, currentScene.duration);

    return () => {
      clearTimeout(showTextTimer);
      clearTimeout(sceneTimer);
      clearInterval(progressInterval);
    };
  }, [
    currentSceneIndex,
    isPlaying,
    currentScene.duration,
    totalScenes,
    onComplete,
    audioEnabled,
    playSceneMusic,
    playSceneEffects,
    stopAllAudio,
    currentScene.id,
    currentScene.effects,
  ]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentSceneIndex < totalScenes - 1) {
      setCurrentSceneIndex((prev) => prev + 1);
      setSceneProgress(0);
      setProgress(((currentSceneIndex + 1) / totalScenes) * 100);
    } else {
      stopAllAudio();
      onComplete();
    }
  };

  const handleSkip = () => {
    stopAllAudio();
    onSkip();
  };

  const getBackgroundClass = (background?: string) => {
    switch (background) {
      case "stars":
        return "bg-gradient-to-b from-indigo-900 via-purple-900 to-black";
      case "nebula":
        return "bg-gradient-to-br from-purple-800 via-pink-700 to-indigo-900";
      case "ship-exterior":
        return "bg-gradient-to-b from-gray-800 via-blue-900 to-black";
      case "bridge":
        return "bg-gradient-to-b from-blue-900 via-gray-800 to-black";
      case "dark-space":
        return "bg-gradient-to-b from-black via-gray-900 to-purple-900";
      case "shadow-realm":
        return "bg-gradient-to-b from-red-900 via-black to-purple-900";
      case "galactic-map":
        return "bg-gradient-to-br from-blue-800 via-purple-700 to-indigo-900";
      case "warp-stars":
        return "bg-gradient-to-r from-blue-600 via-white to-blue-600";
      default:
        return "bg-gradient-to-b from-gray-900 via-blue-900 to-black";
    }
  };

  const renderSceneContent = () => {
    switch (currentScene.type) {
      case "title":
        return (
          <div className="text-center">
            <h1
              className={`text-6xl md:text-8xl font-bold text-trek-gold tracking-wider transition-all duration-1000 ${
                showText
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform translate-y-8"
              }`}
            >
              {currentScene.content}
            </h1>
            {currentScene.id === "opening-title" && (
              <div className="flex justify-center mt-8">
                <Star className="w-16 h-16 text-trek-blue animate-pulse" />
              </div>
            )}
          </div>
        );

      case "text":
        return (
          <div className="max-w-4xl mx-auto text-center">
            <p
              className={`text-xl md:text-2xl text-trek-text leading-relaxed transition-all duration-1000 ${
                showText
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform translate-y-8"
              }`}
            >
              {currentScene.content.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  {index < currentScene.content.split("\n").length - 1 && (
                    <br />
                  )}
                </span>
              ))}
            </p>
          </div>
        );

      case "dialogue":
        return (
          <div className="max-w-4xl mx-auto">
            <div
              className={`transition-all duration-1000 ${
                showText
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform translate-y-8"
              }`}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-trek-blue mb-2">
                  {currentScene.speaker}
                </h3>
                <div className="w-24 h-0.5 bg-trek-gold mx-auto"></div>
              </div>
              <Card className="bg-trek-panel/80 border-trek-accent">
                <CardContent className="p-6">
                  <p className="text-lg text-trek-text italic leading-relaxed">
                    "{currentScene.content}"
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-all duration-1000 ${getBackgroundClass(currentScene.background)}`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        {currentScene.background === "warp-stars" && (
          <div className="absolute inset-0">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-20 bg-white opacity-70 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Header Controls */}
      <div className="relative z-10 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-trek-gold">
              STARFLEET COMMAND: ONLINE
            </h2>
            <div className="text-sm text-trek-text/70">
              Scene {currentSceneIndex + 1} of {totalScenes}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="border-trek-accent text-trek-text hover:bg-trek-accent"
            >
              <Music className="w-4 h-4 mr-1" />
              {audioEnabled ? "Audio On" : "Audio Off"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setGlobalMuted(!isGlobalMuted)}
              className="border-trek-accent text-trek-text hover:bg-trek-accent"
            >
              {isGlobalMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayPause}
              className="border-trek-accent text-trek-text hover:bg-trek-accent"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              className="border-trek-accent text-trek-text hover:bg-trek-accent"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSkip}
              className="border-trek-accent text-trek-text hover:bg-trek-accent"
            >
              <SkipForward className="w-4 h-4 mr-1" />
              Skip
            </Button>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs text-trek-text/70">
            <span>Overall Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1" />

          <div className="flex justify-between text-xs text-trek-text/70">
            <span>Current Scene</span>
            <span>{Math.round(sceneProgress)}%</span>
          </div>
          <Progress value={sceneProgress} className="h-1" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        {renderSceneContent()}
      </div>

      {/* Footer */}
      <div className="relative z-10 p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-trek-text/50">
            United Federation of Planets • Starfleet Command • MMORPG Alpha Test
          </div>

          {/* Audio Controls */}
          <div className="hidden md:block">
            <StarTrekAudioControls />
          </div>
        </div>
      </div>

      {/* Cinematic Effects */}
      {currentScene.effects?.includes("ominous-tone") && (
        <div className="absolute inset-0 bg-red-900/20 animate-pulse pointer-events-none" />
      )}

      {currentScene.effects?.includes("dark-whispers") && (
        <div className="absolute inset-0">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-red-400/30 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        .stars {
          background-image:
            radial-gradient(2px 2px at 20px 30px, #eee, transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 90px 40px, #fff, transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.6), transparent),
            radial-gradient(2px 2px at 160px 30px, #ddd, transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
          animation: zoom 20s infinite linear;
        }

        @keyframes zoom {
          from {
            transform: scale(1) translateZ(0);
          }
          to {
            transform: scale(1.5) translateZ(0);
          }
        }
      `}</style>
    </div>
  );
}
