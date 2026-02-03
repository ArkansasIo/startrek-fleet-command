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
    duration: 4000,
    background: "stars",
    music: "epic-orchestral",
  },
  {
    id: "subtitle",
    type: "title",
    content: "A Star Trek Story",
    duration: 3000,
    background: "stars",
  },
  {
    id: "stardate",
    type: "text",
    content: "Stardate 2387.156\nDelta Quadrant - Uncharted Space",
    duration: 4000,
    background: "nebula",
  },
  {
    id: "mission-brief-1",
    type: "text",
    content:
      "The USS Horizon, under the command of Captain Elena Nova, has been tasked with the most ambitious exploration mission in Starfleet history.",
    duration: 6000,
    background: "ship-exterior",
  },
  {
    id: "mission-brief-2",
    type: "text",
    content:
      "Following the footsteps of Voyager's historic journey, the Horizon is to establish a permanent Federation presence in the Delta Quadrant.",
    duration: 6000,
    background: "delta-quadrant-map",
  },
  {
    id: "nova-intro",
    type: "dialogue",
    content:
      "Captain's Log, Stardate 2387.156. We've successfully established our base of operations in the Delta Quadrant. Our mission: to explore strange new worlds, to seek out new life and new civilizations.",
    speaker: "Captain Elena Nova",
    duration: 8000,
    background: "bridge",
  },
  {
    id: "nova-mission",
    type: "dialogue",
    content:
      "But our long-range sensors have detected something unprecedented - energy signatures unlike anything in Federation databases. Something ancient... and powerful.",
    speaker: "Captain Nova",
    duration: 7000,
    background: "bridge",
  },
  {
    id: "thresh-report",
    type: "dialogue",
    content:
      "Captain, I'm reading massive subspace distortions across twelve sectors. Whatever's out there, it's been dormant for millennia.",
    speaker: "Commander Thresh",
    duration: 6000,
    background: "bridge",
  },
  {
    id: "vex-analysis",
    type: "dialogue",
    content:
      "Fascinating. The quantum signatures suggest technology that predates even the Iconians. We may have stumbled upon the remnants of a civilization older than the galaxy itself.",
    speaker: "Lieutenant Vex",
    duration: 8000,
    background: "science-station",
  },
  {
    id: "shadow-awakening",
    type: "text",
    content:
      "Unknown to the crew of the Horizon, their arrival has triggered something that has slumbered for eons...",
    duration: 5000,
    background: "dark-space",
    effects: ["ominous-tone"],
  },
  {
    id: "shadow-stirring",
    type: "text",
    content:
      "In the depths of space, ancient minds begin to stir. The Shadow Coalition, thought to be mere legend, awakens to reclaim what was once theirs.",
    duration: 7000,
    background: "shadow-realm",
    effects: ["dark-whispers"],
  },
  {
    id: "emperor-awakening",
    type: "dialogue",
    content:
      "The time of slumber ends. The young races dare to trespass in our domain. They shall learn why we were feared across the cosmos.",
    speaker: "The Shadow Emperor",
    duration: 6000,
    background: "shadow-throne",
    effects: ["dark-power"],
  },
  {
    id: "nova-determination",
    type: "dialogue",
    content:
      "Whatever challenges await us in the Delta Quadrant, we'll face them as Starfleet officers. With courage, with honor, and with the unshakeable belief that together, we can overcome any obstacle.",
    speaker: "Captain Nova",
    duration: 8000,
    background: "bridge",
  },
  {
    id: "mission-scope",
    type: "text",
    content:
      "Your journey will span 12 acts, each containing 30 episodes with 10 chapters per episode. Every decision you make will shape the fate of the Delta Quadrant.",
    duration: 6000,
    background: "galactic-map",
  },
  {
    id: "character-bonds",
    type: "text",
    content:
      "Build relationships with your crew. Trust in Commander Thresh's tactical expertise, Dr. Kalar's healing wisdom, Lieutenant Vex's scientific brilliance, and Chief Korvak's warrior spirit.",
    duration: 8000,
    background: "crew-assembly",
  },
  {
    id: "choices-matter",
    type: "text",
    content:
      "Your choices in diplomacy, combat, and exploration will determine not just your crew's survival, but the future of countless civilizations.",
    duration: 6000,
    background: "decision-moment",
  },
  {
    id: "epic-scope",
    type: "text",
    content:
      "From first contact with new species to the ultimate confrontation with cosmic forces, your story will become legend.",
    duration: 5000,
    background: "epic-montage",
  },
  {
    id: "final-call",
    type: "dialogue",
    content:
      "All hands, this is the Captain. Prepare for departure. Our destiny awaits in the Delta Quadrant. Horizon out.",
    speaker: "Captain Nova",
    duration: 6000,
    background: "ship-departure",
  },
  {
    id: "begin-journey",
    type: "title",
    content: "BEGIN YOUR JOURNEY",
    duration: 3000,
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
