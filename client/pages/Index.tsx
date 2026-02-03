import { useState } from "react";
import { STAR_TREK_MENU_DETAILS } from "@/lib/StarTrekMenuDetails";
import { StarTrekTitleMenu } from "@/components/StarTrekTitleMenu";
import { SplashScreen } from "@/components/SplashScreen";
import { StarTrekAudioProvider } from "@/components/audio/StarTrekAudioSystem";
import { GameDashboard } from "@/components/sections/GameDashboard";
import { AppFooter, DetailedCredits } from "@/components/ui/AppFooter";
import { Button } from "@/components/ui/button";
import { EnhancedStarTrekDashboard } from "@/components/EnhancedStarTrekDashboard";

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
    <StarTrekAudioProvider>
      <div className="min-h-screen bg-trek-dark text-trek-text pb-16 flex">
        {/* Star Trek Lore Sidebar (desktop only, collapsible on mobile) */}
        <aside className="hidden lg:block w-80 bg-trek-panel border-r border-trek-accent p-4 overflow-y-auto">
          <h2 className="text-trek-gold text-xl font-bold mb-4 tracking-wider">STAR TREK LORE</h2>
          <div className="space-y-4">
            {STAR_TREK_MENU_DETAILS.map((item) => (
              <div key={item.id} className="bg-trek-dark/60 border border-trek-accent rounded p-3">
                <div className="text-trek-blue font-semibold text-lg">{item.label}</div>
                <div className="text-trek-text/80 text-sm mb-1">{item.description}</div>
                <div className="text-trek-gold text-xs mb-1">
                  <span className="font-bold">Examples:</span> {item.canonicalExamples.join(", ")}
                </div>
                <div className="text-trek-text/60 text-xs mb-1">
                  <span className="font-bold">Episodes:</span> {item.notableEpisodes.join(", ")}
                </div>
                {item.funFact && (
                  <div className="text-trek-warning text-xs italic">Fun Fact: {item.funFact}</div>
                )}
              </div>
            ))}
          </div>
        </aside>
        {/* Main Content Area */}
        <div className="flex-1">
          <div className="min-h-screen">
            {showSplash ? (
              <SplashScreen onComplete={handleSplashComplete} />
            ) : showProlog ? (
              <StoryProlog
                onComplete={handlePrologComplete}
                onSkip={handleSkipProlog}
              />
            ) : (
              <>
                <StarTrekTitleMenu
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                  currentUser={currentUser}
                  onNewGame={handleNewGame}
                  hasSeenProlog={hasSeenProlog}
                />
                {currentUser ? (
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
                ) : (
                  <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="max-w-md mx-auto p-8 bg-trek-panel border border-trek-accent rounded">
                      <h2 className="text-2xl font-bold text-trek-gold mb-4 text-center">
                        STARFLEET ACCESS REQUIRED
                      </h2>
                      <p className="text-trek-text/80 text-center mb-6">
                        Please log in with your Starfleet credentials to access the
                        command systems.
                      </p>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-trek-blue/20 border-2 border-trek-blue rounded-full flex items-center justify-center mx-auto mb-4">
                          <div className="w-8 h-8 bg-trek-blue rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-sm text-trek-text/70">
                          Authorization Level: Starfleet Personnel Only
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            {/* App Footer - Always visible except during splash and prolog */}
            {!showSplash && !showProlog && (
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
      </div>
    </StarTrekAudioProvider>
  );
}
