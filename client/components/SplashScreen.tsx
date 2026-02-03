import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Volume2,
  VolumeX,
  Play,
  SkipForward,
  Zap,
  Code,
  Music,
  Heart,
  Github,
  Cpu,
  Palette,
  Headphones,
  Camera,
  Users,
} from "lucide-react";
import { STAR_TREK_MENU_DETAILS } from "@/lib/StarTrekMenuDetails";

interface SplashScreenProps {
  onComplete: () => void;
}

interface CreditsPerson {
  name: string;
  role: string;
  icon: React.ReactNode;
  color: string;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [currentPhase, setCurrentPhase] = useState<
    "engine" | "team" | "complete"
  >("engine");
  const [isSkipped, setIsSkipped] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [loreIndex, setLoreIndex] = useState(() => Math.floor(Math.random() * STAR_TREK_MENU_DETAILS.length));
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const credits: CreditsPerson[] = [
    {
      name: "Stephen",
      role: "Lead Developer & System Architect",
      icon: <Code className="w-5 h-5" />,
      color: "text-trek-gold",
    },
    {
      name: "Starfleet Audio Division",
      role: "Music & Sound Engineering",
      icon: <Music className="w-5 h-5" />,
      color: "text-trek-blue",
    },
    {
      name: "The Federation Council",
      role: "Creative Direction & Lore Accuracy",
      icon: <Star className="w-5 h-5" />,
      color: "text-trek-warning",
    },
    {
      name: "LCARS Design Team",
      role: "User Interface Design",
      icon: <Palette className="w-5 h-5" />,
      color: "text-purple-400",
    },
    {
      name: "Quantum Computing Division",
      role: "Engine Architecture & Performance",
      icon: <Cpu className="w-5 h-5" />,
      color: "text-green-400",
    },
    {
      name: "Paramount Pictures",
      role: "Original Star Trek Universe",
      icon: <Camera className="w-5 h-5" />,
      color: "text-red-400",
    },
    {
      name: "Open Source Community",
      role: "Tools & Frameworks",
      icon: <Github className="w-5 h-5" />,
      color: "text-trek-text",
    },
    {
      name: "React Development Team",
      role: "Frontend Framework",
      icon: <Zap className="w-5 h-5" />,
      color: "text-cyan-400",
    },
  ];

  useEffect(() => {
    if (isSkipped) return;

    let progressValue = 0;
    setProgress(0);
    setLoreIndex(Math.floor(Math.random() * STAR_TREK_MENU_DETAILS.length));
    const progressInterval = setInterval(() => {
      progressValue += 2;
      setProgress(progressValue);
      // Change lore every 20%
      if (progressValue % 20 === 0) {
        setLoreIndex((prev) => (prev + 1) % STAR_TREK_MENU_DETAILS.length);
      }
      if (progressValue >= 100) {
        clearInterval(progressInterval);
        setCurrentPhase("team");
        setShowCredits(true);
      }
    }, 60);

    // Phase 2: Credits (8 seconds)
    const creditsTimeout = setTimeout(() => {
      setCurrentPhase("complete");
    }, 8000);

    // Auto-complete after 11 seconds
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 11000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(creditsTimeout);
      clearTimeout(completeTimeout);
    };
  }, [isSkipped, onComplete]);

  useEffect(() => {
    // Initialize audio
    if (audioRef.current) {
      audioRef.current.volume = 0.7;
      audioRef.current.loop = false;

      // Attempt to play the audio (browser may prevent autoplay)
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented, that's okay
          console.log("Audio autoplay prevented");
        });
      }
    }
  }, []);

  const handleSkip = () => {
    setIsSkipped(true);
    onComplete();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleAudioEnded = () => {
    // Audio has ended, proceed to next phase or complete
    if (currentPhase === "engine") {
      setCurrentPhase("team");
      setShowCredits(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-radial from-trek-blue/10 via-transparent to-black">
        {/* Animated stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Moving grid lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,#3b82f6_50%,transparent_51%)] bg-[length:50px_50px] animate-pulse" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_49%,#3b82f6_50%,transparent_51%)] bg-[length:50px_50px] animate-pulse" />
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        preload="auto"
        className="hidden"
      >
        <source src="/audio/custom/splash-intro.mp3" type="audio/mpeg" />
        <source src="/audio/custom/splash-intro.ogg" type="audio/ogg" />
        {/* Fallback - will be silent but won't break */}
      </audio>

      {/* Control Buttons */}
      <div className="absolute top-6 right-6 flex gap-2 z-10">
        <Button
          size="sm"
          variant="outline"
          onClick={toggleMute}
          className="border-trek-accent text-trek-text hover:bg-trek-accent/20"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleSkip}
          className="border-trek-accent text-trek-text hover:bg-trek-accent/20"
        >
          <SkipForward className="w-4 h-4 mr-2" />
          Skip
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-8">
        {currentPhase === "engine" && (
          <div className="flex flex-col items-center justify-center w-full animate-fade-in">
            {/* Main Logo/Engine Name */}
            <div className="space-y-6 text-center">
              <div className="relative">
                <div className="w-32 h-32 mx-auto relative">
                  <div className="absolute inset-0 bg-trek-blue/30 rounded-full animate-pulse"></div>
                  <div className="absolute inset-2 bg-trek-blue/50 rounded-full animate-ping"></div>
                  <div className="absolute inset-4 bg-trek-blue rounded-full flex items-center justify-center">
                    <Star
                      className="w-12 h-12 text-white animate-spin"
                      style={{ animationDuration: "8s" }}
                    />
                  </div>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-trek-gold tracking-wider animate-glow">
                STAR TREK
              </h1>
              <h2 className="text-3xl font-semibold text-trek-blue tracking-wide">
                STARFLEET COMMAND: ONLINE
              </h2>
              <div className="flex items-center justify-center gap-2">
                <Badge
                  variant="outline"
                  className="border-trek-gold text-trek-gold px-4 py-2"
                >
                  v2.4.7 Beta
                </Badge>
                <Badge
                  variant="outline"
                  className="border-trek-blue text-trek-blue px-4 py-2"
                >
                  2025 Edition
                </Badge>
              </div>
              <div className="space-y-2 text-trek-text/80">
                <p className="text-xl">Advanced Star Trek MMORPG Platform</p>
                <p className="text-lg text-trek-text/60">
                  Powered by React • TypeScript • LCARS Framework
                </p>
              </div>
            </div>
            {/* Lore Card */}
            <div className="w-full max-w-lg mx-auto mt-8 mb-4">
              <div className="bg-trek-panel/80 border border-trek-accent rounded-lg p-4 shadow-lg">
                <div className="text-trek-blue font-semibold text-lg mb-1">
                  {STAR_TREK_MENU_DETAILS[loreIndex].label}
                </div>
                <div className="text-trek-text/80 text-sm mb-1">
                  {STAR_TREK_MENU_DETAILS[loreIndex].description}
                </div>
                <div className="text-trek-gold text-xs mb-1">
                  <span className="font-bold">Examples:</span> {STAR_TREK_MENU_DETAILS[loreIndex].canonicalExamples.join(", ")}
                </div>
                <div className="text-trek-text/60 text-xs mb-1">
                  <span className="font-bold">Episodes:</span> {STAR_TREK_MENU_DETAILS[loreIndex].notableEpisodes.join(", ")}
                </div>
                {STAR_TREK_MENU_DETAILS[loreIndex].funFact && (
                  <div className="text-trek-warning text-xs italic">Fun Fact: {STAR_TREK_MENU_DETAILS[loreIndex].funFact}</div>
                )}
              </div>
            </div>
            {/* Loading Bar */}
            <div className="w-64 mx-auto bg-trek-dark/50 border border-trek-accent rounded-full overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-trek-blue to-trek-gold transition-all duration-200"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Zap className="w-5 h-5 text-trek-blue animate-pulse" />
              <span className="text-trek-text/70">
                Initializing Quantum Core...
              </span>
            </div>
          </div>
        )}

        {currentPhase === "team" && (
          <div className="w-full max-w-4xl space-y-8 animate-fade-in">
            {/* Team Credits Header */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-trek-gold">
                DEVELOPMENT TEAM
              </h2>
              <p className="text-xl text-trek-blue">
                StarFleet Command: Online
              </p>
              <div className="w-32 h-0.5 bg-gradient-to-r from-trek-blue to-trek-gold mx-auto"></div>
            </div>

            {/* Credits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {credits.map((person, index) => (
                <div
                  key={person.name}
                  className={`bg-trek-panel/50 border border-trek-accent rounded-lg p-6 space-y-3 
                    animate-slide-up transition-all duration-500 hover:bg-trek-panel/70 hover:border-trek-blue`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`${person.color} bg-trek-dark/50 p-2 rounded-full`}
                    >
                      {person.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${person.color}`}>
                        {person.name}
                      </h3>
                      <p className="text-sm text-trek-text/70">{person.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Special Thanks Section */}
            <div className="text-center space-y-4 mt-12">
              <h3 className="text-2xl font-semibold text-trek-blue">
                Special Thanks
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-trek-text/70">
                <div className="space-y-2">
                  <h4 className="font-semibold text-trek-gold">
                    Original Composers
                  </h4>
                  <div className="space-y-1">
                    <p>Jerry Goldsmith</p>
                    <p>Alexander Courage</p>
                    <p>Dennis McCarthy</p>
                    <p>Jay Chattaway</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-trek-gold">
                    Technology Stack
                  </h4>
                  <div className="space-y-1">
                    <p>React 18.3.1</p>
                    <p>TypeScript 5.0</p>
                    <p>Vite Build System</p>
                    <p>Tailwind CSS</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-trek-gold">Community</h4>
                  <div className="space-y-1">
                    <p>Star Trek Fans Worldwide</p>
                    <p>Open Source Contributors</p>
                    <p>Beta Testers</p>
                    <p>Feedback Providers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="text-center pt-8">
              <Button
                onClick={onComplete}
                className="bg-trek-gold hover:bg-trek-gold/80 text-trek-dark font-semibold px-8 py-3 text-lg animate-pulse"
              >
                <Play className="w-5 h-5 mr-2" />
                Begin Your Journey
              </Button>
            </div>
          </div>
        )}

        {currentPhase === "complete" && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-trek-gold/20 border-2 border-trek-gold rounded-full flex items-center justify-center">
                <Star className="w-10 h-10 text-trek-gold animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold text-trek-gold">
                Ready for Command
              </h2>
              <p className="text-xl text-trek-text/80">
                Welcome to the Final Frontier
              </p>
            </div>
            <Button
              onClick={onComplete}
              className="bg-trek-blue hover:bg-trek-blue/80 text-white font-semibold px-8 py-3 text-lg"
            >
              <Zap className="w-5 h-5 mr-2" />
              Enter Starfleet Command
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-trek-dark/80 border-t border-trek-accent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span className="text-sm text-trek-text/70">
                Made with passion for Star Trek
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-trek-text/50">
              <span>•</span>
              <Users className="w-4 h-4" />
              <span className="text-sm">For fans, by fans</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-trek-text/70">
            <Headphones className="w-4 h-4" />
            <span>Best experienced with headphones</span>
          </div>
        </div>

        {/* Phase Progress */}
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-trek-text/60">
              {currentPhase === "engine" && "Initializing Engine..."}
              {currentPhase === "team" && "Loading Credits..."}
              {currentPhase === "complete" && "Ready for Launch"}
            </span>
          </div>
          <div className="w-full bg-trek-dark border border-trek-accent rounded-full h-1">
            <div
              className="h-1 bg-gradient-to-r from-trek-blue to-trek-gold rounded-full transition-all duration-1000"
              style={{
                width:
                  currentPhase === "engine"
                    ? "33%"
                    : currentPhase === "team"
                      ? "66%"
                      : "100%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glow {
          0%,
          100% {
            text-shadow: 0 0 20px rgba(255, 193, 7, 0.5);
          }
          50% {
            text-shadow: 0 0 30px rgba(255, 193, 7, 0.8);
          }
        }

        @keyframes progress-bar {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-progress-bar {
          animation: progress-bar 3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
