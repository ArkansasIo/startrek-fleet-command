import { useState } from "react";
import { STAR_TREK_MENU_DETAILS } from "@/lib/StarTrekMenuDetails";
import { StarTrekTitleMenu } from "@/components/StarTrekTitleMenu";
import { SplashScreen } from "@/components/SplashScreen";
import { StarTrekAudioProvider } from "@/components/audio/StarTrekAudioSystem";
import { GameDashboard } from "@/components/sections/GameDashboard";
import { AppFooter, DetailedCredits } from "@/components/ui/AppFooter";
import { Button } from "@/components/ui/button";
import { EnhancedStarTrekDashboard } from "@/components/EnhancedStarTrekDashboard";
import { GameProvider } from "@/lib/MMORPGGameEngine";
import { LogIn, Play, Settings, HelpCircle, Zap, Globe, Users, Wifi } from "lucide-react";
import { CharacterCreationFlow } from "./CharacterCreationFlow";

import StoryProlog from "@/components/sections/StoryProlog";

interface StarfleetOfficer {
  id: string;
  username: string;
  name: string;
  rank: string;
  division:
    | "Command"
    | "Operations"
    | "Sciences"
    | "Medical"
    | "Engineering"
    | "Security";
  ship: string;
  clearance_level: number;
  service_record: string[];
  commendations: string[];
  avatar?: string;
}

export default function Index() {
  const [showSplash, setShowSplash] = useState(false);
  const [showCharacterCreation, setShowCharacterCreation] = useState(false);
  const [currentUser, setCurrentUser] = useState<StarfleetOfficer | undefined>({
    id: "demo-001",
    username: "demo",
    name: "Jean-Luc Picard",
    rank: "Captain",
    division: "Command",
    ship: "USS Enterprise NCC-1701-D",
    clearance_level: 10,
    service_record: [
      "Academy Graduate 2327",
      "First Officer USS Stargazer",
      "Captain USS Enterprise",
    ],
    commendations: ["Starfleet Medal of Honor", "Grankite Order of Tactics"],
  });
  const [showProlog, setShowProlog] = useState(false);
  const [hasSeenProlog, setHasSeenProlog] = useState(false);
  const [showDetailedCredits, setShowDetailedCredits] = useState(false);
  const [currentView, setCurrentView] = useState<"command" | "game">("command");

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleLogin = (officer: StarfleetOfficer) => {
    setCurrentUser(officer);
  };

  const handleLogout = () => {
    setCurrentUser(undefined);
    setShowProlog(false);
    setHasSeenProlog(false);
  };

  const handleNewGame = () => {
    setShowCharacterCreation(true);
  };

  const handleCharacterCreated = (character: any) => {
    setShowCharacterCreation(false);
    setCurrentUser({
      id: `player-${Date.now()}`,
      username: character.name.toLowerCase().replace(/\s+/g, "-"),
      name: character.name,
      rank: character.rank,
      division: character.division,
      ship: character.ship,
      clearance_level: 1,
      service_record: ["Starfleet Academy Graduate"],
      commendations: [],
    });
    setShowProlog(true);
  };

  const handlePrologComplete = () => {
    setShowProlog(false);
    setHasSeenProlog(true);
  };

  const handleSkipProlog = () => {
    setShowProlog(false);
    setHasSeenProlog(true);
  };

  return (
    <GameProvider>
      <StarTrekAudioProvider>
        <div className="min-h-screen bg-trek-dark text-trek-text pb-16">
          <div className="min-h-screen">
            {showCharacterCreation ? (
              <CharacterCreationFlow
                onComplete={handleCharacterCreated}
                onCancel={() => setShowCharacterCreation(false)}
              />
            ) : showSplash ? (
              <SplashScreen onComplete={handleSplashComplete} />
            ) : showProlog ? (
              <StoryProlog
                onComplete={handlePrologComplete}
                onSkip={handleSkipProlog}
              />
            ) : (
              <>
                {!currentUser ? (
                  // ENHANCED TITLE PAGE DESIGN
                  <div className="min-h-screen bg-gradient-to-br from-trek-dark via-blue-950 to-trek-dark relative overflow-hidden">
                    {/* Animated background grid */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0 bg-gradient-to-b from-trek-blue/20 to-transparent"></div>
                      <svg className="w-full h-full" preserveAspectRatio="none">
                        <defs>
                          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-trek-blue opacity-30" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                      </svg>
                    </div>

                    {/* Top Section - Main Title */}
                    <div className="relative z-10 pt-12 px-6">
                      <div className="max-w-5xl mx-auto">
                        <div className="text-center space-y-4 mb-16">
                          <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-trek-gold/20 border-2 border-trek-gold rounded-lg flex items-center justify-center">
                              <Wifi className="w-6 h-6 text-trek-gold animate-pulse" />
                            </div>
                            <span className="text-trek-text/70 text-sm font-mono">STARFLEET ONLINE</span>
                          </div>
                          <h1 className="text-6xl md:text-7xl font-bold text-trek-gold tracking-widest drop-shadow-lg">
                            STARFLEET<br />COMMAND
                          </h1>
                          <p className="text-xl md:text-2xl text-trek-blue font-light tracking-wide">
                            United Federation of Planets
                          </p>
                          <p className="text-trek-text/60 font-mono text-sm">Advanced MMORPG Platform • Live Simulation</p>
                        </div>

                        {/* Quick Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                          <div className="bg-trek-panel/80 border border-trek-blue/50 rounded p-4 backdrop-blur-sm hover:border-trek-gold/50 transition-colors">
                            <Zap className="w-6 h-6 text-trek-gold mb-2" />
                            <p className="text-xs text-trek-text/70">Status</p>
                            <p className="text-sm font-bold text-trek-green">OPERATIONAL</p>
                          </div>
                          <div className="bg-trek-panel/80 border border-trek-blue/50 rounded p-4 backdrop-blur-sm hover:border-trek-gold/50 transition-colors">
                            <Users className="w-6 h-6 text-trek-gold mb-2" />
                            <p className="text-xs text-trek-text/70">Players Online</p>
                            <p className="text-sm font-bold text-trek-blue">2,847</p>
                          </div>
                          <div className="bg-trek-panel/80 border border-trek-blue/50 rounded p-4 backdrop-blur-sm hover:border-trek-gold/50 transition-colors">
                            <Globe className="w-6 h-6 text-trek-gold mb-2" />
                            <p className="text-xs text-trek-text/70">Servers</p>
                            <p className="text-sm font-bold text-trek-blue">12 Quadrants</p>
                          </div>
                          <div className="bg-trek-panel/80 border border-trek-blue/50 rounded p-4 backdrop-blur-sm hover:border-trek-gold/50 transition-colors">
                            <Wifi className="w-6 h-6 text-trek-gold mb-2" />
                            <p className="text-xs text-trek-text/70">Uptime</p>
                            <p className="text-sm font-bold text-trek-green">99.9%</p>
                          </div>
                        </div>

                        {/* Main CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                          <Button
                            onClick={() => setShowSplash(true)}
                            className="bg-trek-gold hover:bg-trek-gold/90 text-trek-dark font-bold py-6 px-8 text-lg rounded border-2 border-trek-gold/50 shadow-lg hover:shadow-trek-gold/50 transition-all hover:scale-105"
                          >
                            <Play className="w-5 h-5 mr-2" />
                            START SIMULATION
                          </Button>
                          <Button
                            onClick={handleNewGame}
                            className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark font-bold py-6 px-8 text-lg rounded border-2 border-trek-blue/50 shadow-lg hover:shadow-trek-blue/50 transition-all hover:scale-105"
                          >
                            <LogIn className="w-5 h-5 mr-2" />
                            NEW OFFICER
                          </Button>
                        </div>

                        {/* Features Section */}
                        <div className="bg-trek-panel/50 border border-trek-blue/30 rounded-lg p-8 backdrop-blur-sm">
                          <h2 className="text-trek-gold text-xl font-bold mb-6 text-center">MISSION BRIEFING</h2>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <h3 className="text-trek-blue font-bold">TACTICAL OPERATIONS</h3>
                              <p className="text-trek-text/70 text-sm">Command your fleet through real-time and turn-based combat scenarios across the galaxy.</p>
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-trek-blue font-bold">EXPLORATION & DISCOVERY</h3>
                              <p className="text-trek-text/70 text-sm">Chart unknown regions, discover alien civilizations, and uncover ancient mysteries.</p>
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-trek-blue font-bold">ALLIANCE & DIPLOMACY</h3>
                              <p className="text-trek-text/70 text-sm">Form alliances, negotiate treaties, and shape the political landscape of the quadrant.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-20 right-10 w-40 h-40 bg-trek-blue/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-40 left-10 w-40 h-40 bg-trek-gold/10 rounded-full blur-3xl"></div>
                  </div>
                ) : (
                  // LOGGED IN VIEW
                  <div>
                    {/* View Toggle */}
                    <div className="bg-trek-panel border-b border-trek-accent p-4">
                      <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button
                            variant={
                              currentView === "command" ? "default" : "outline"
                            }
                            onClick={() => setCurrentView("command")}
                            className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark"
                          >
                            Command Interface
                          </Button>
                          <Button
                            variant={currentView === "game" ? "default" : "outline"}
                            onClick={() => setCurrentView("game")}
                            className="bg-trek-gold hover:bg-trek-gold/80 text-trek-dark"
                          >
                            Game Dashboard
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleLogout()}
                            className="text-trek-text/70 hover:text-trek-text ml-auto"
                          >
                            Logout
                          </Button>
                        </div>
                        <div className="text-trek-text/70 text-sm">
                          Welcome, {currentUser.rank} {currentUser.name}
                        </div>
                      </div>
                    </div>
                    {/* Content Area */}
                    {currentView === "command" ? (
                      <EnhancedStarTrekDashboard />
                    ) : (
                      <GameDashboard currentUser={currentUser} />
                    )}
                  </div>
                )}
              </>
            )}
            {/* App Footer - Always visible except during splash and prolog */}
            {!showSplash && !showProlog && !currentUser && !showCharacterCreation && (
              <div
                className="cursor-pointer"
                onClick={() => setShowDetailedCredits(true)}
                title="Click for detailed credits"
              >
                <AppFooter />
              </div>
            )}
            {/* Detailed Credits Modal */}
            <DetailedCredits
              isOpen={showDetailedCredits}
              onClose={() => setShowDetailedCredits(false)}
            />
          </div>
        </div>
      </StarTrekAudioProvider>
    </GameProvider>
  );
}
