import React from "react";
import { Badge } from "./badge";
import { Star, Code, Heart, Github } from "lucide-react";

export function AppFooter() {
  const currentYear = new Date().getFullYear();
  const appVersion = "2.4.7";
  const buildNumber = "2025.0814";
  const buildDate = new Date().toLocaleDateString();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-trek-panel/95 backdrop-blur-sm border-t border-trek-accent">
      <div className="flex items-center justify-between px-4 py-2 text-xs">
        {/* Version Info - Bottom Left */}
        <div className="flex items-center gap-3 text-trek-text/70">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs border-trek-blue text-trek-blue"
            >
              v{appVersion}
            </Badge>
            <span className="hidden sm:inline">Build {buildNumber}</span>
            <span className="hidden md:inline">• {buildDate}</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-trek-text/50">
            <span>•</span>
            <span>StarFleet Command: Online</span>
            <span>•</span>
            <span>React {React.version}</span>
            <span>•</span>
            <span>TypeScript</span>
          </div>
        </div>

        {/* Development Credits - Bottom Right */}
        <div className="flex items-center gap-2 text-trek-text/70">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-trek-text/50">Developed with</span>
            <Heart className="w-3 h-3 text-red-400 fill-current" />
            <span className="text-trek-text/50">by</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Code className="w-3 h-3 text-trek-blue" />
              <span className="font-semibold text-trek-gold">Stephen</span>
              <span className="hidden md:inline text-trek-text/50">
                • Lead Developer
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-trek-text/50">
              <span>•</span>
              <Star className="w-3 h-3 text-trek-gold fill-current" />
              <span>Starfleet Audio Division</span>
            </div>

            <div className="flex items-center gap-1">
              <Github className="w-3 h-3 text-trek-text/50" />
              <span className="hidden sm:inline text-trek-text/50">
                Open Source
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Credits Bar for Larger Screens */}
      <div className="hidden xl:block border-t border-trek-accent/30 px-4 py-1">
        <div className="flex items-center justify-between text-xs text-trek-text/40">
          <div className="flex items-center gap-4">
            <span>Star Trek © Paramount Pictures</span>
            <span>•</span>
            <span>Educational/Fan Project</span>
            <span>•</span>
            <span>Music Credits: Goldsmith, Courage, McCarthy, Russo</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Built with Builder.io</span>
            <span>•</span>
            <span>Powered by React & TypeScript</span>
            <span>•</span>
            <span>LCARS UI Framework</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Responsive Version Info Component
export function VersionBadge() {
  return (
    <div className="fixed bottom-2 left-2 z-50 lg:hidden">
      <Badge
        variant="outline"
        className="text-xs border-trek-blue text-trek-blue bg-trek-panel/95 backdrop-blur-sm"
      >
        v2.4.7
      </Badge>
    </div>
  );
}

// Responsive Credits Component
export function CreditsBadge() {
  return (
    <div className="fixed bottom-2 right-2 z-50 lg:hidden">
      <div className="flex items-center gap-1 text-xs text-trek-text/70 bg-trek-panel/95 backdrop-blur-sm border border-trek-accent rounded px-2 py-1">
        <Code className="w-3 h-3 text-trek-blue" />
        <span className="font-semibold text-trek-gold">Stephen</span>
      </div>
    </div>
  );
}

// Full-screen overlay credits (for special occasions)
export function DetailedCredits({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-trek-panel border border-trek-accent rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-trek-gold mb-2">
              StarTrek - StarFleet Command: Online
            </h2>
            <p className="text-trek-text/70">
              Development Credits & Acknowledgments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-trek-blue mb-2">
                  Lead Development
                </h3>
                <div className="space-y-1 text-trek-text/80">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-trek-blue" />
                    <span className="font-semibold text-trek-gold">
                      Stephen
                    </span>
                    <span className="text-trek-text/60">
                      • Full-Stack Development
                    </span>
                  </div>
                  <div className="ml-6 text-trek-text/60">
                    Frontend Architecture, UI/UX Design, Audio System, Story
                    Development
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-trek-blue mb-2">
                  Audio & Music
                </h3>
                <div className="space-y-1 text-trek-text/80">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-trek-gold" />
                    <span>Starfleet Audio Division</span>
                  </div>
                  <div className="ml-6 text-trek-text/60">
                    Original Compositions, Sound Design, Audio Integration
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-trek-blue mb-2">
                  Technology Stack
                </h3>
                <div className="space-y-1 text-trek-text/80">
                  <div>• React {React.version} with TypeScript</div>
                  <div>• Vite Build System</div>
                  <div>• Tailwind CSS with LCARS Design</div>
                  <div>• Lucide React Icons</div>
                  <div>• Custom Audio Engine</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-trek-blue mb-2">
                  Special Thanks
                </h3>
                <div className="space-y-1 text-trek-text/80">
                  <div>• Gene Roddenberry - Star Trek Creator</div>
                  <div>• Jerry Goldsmith - Musical Inspiration</div>
                  <div>• Alexander Courage - Original Fanfare</div>
                  <div>• Dennis McCarthy - TNG/DS9 Themes</div>
                  <div>• Jeff Russo - Modern Trek Music</div>
                  <div>• Michael Giacchino - Kelvin Timeline</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-trek-blue mb-2">
                  Platform & Tools
                </h3>
                <div className="space-y-1 text-trek-text/80">
                  <div>• Builder.io - Development Platform</div>
                  <div>• GitHub - Version Control</div>
                  <div>• Fly.dev - Hosting & Deployment</div>
                  <div>• ChatGPT/Claude - AI Development Assistant</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-trek-blue mb-2">Legal</h3>
                <div className="space-y-1 text-trek-text/80 text-xs">
                  <div>Star Trek © Paramount Pictures</div>
                  <div>Educational/Fan Project - Non-Commercial</div>
                  <div>Original code & compositions under MIT License</div>
                  <div>Fair use of Star Trek intellectual property</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-trek-accent">
            <div className="text-trek-text/60 mb-4">
              "To boldly code where no one has coded before."
            </div>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-trek-blue hover:bg-trek-blue/80 text-trek-dark h-9 px-3"
            >
              Close Credits
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
