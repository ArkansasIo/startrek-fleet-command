
import { ArrowLeft, Star, Users, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-trek-dark text-trek-text">
      {/* Header */}
      <div className="bg-trek-panel border-b border-trek-accent p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            size="sm"
            className="border-trek-blue text-trek-blue hover:bg-trek-blue hover:text-trek-dark"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Command
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-trek-gold">
              About Starfleet Command: Online
            </h1>
            <p className="text-trek-text/70">
              Advanced Star Trek MMORPG Platform
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Overview */}
        <Card className="bg-trek-panel border-trek-accent">
          <CardHeader>
            <CardTitle className="text-trek-gold flex items-center gap-2">
              <Star className="w-6 h-6" />
              Mission Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-trek-text/90">
              Starfleet Command: Online is an advanced Star Trek MMORPG platform
              that brings the rich universe of Star Trek to life through
              immersive gameplay, strategic combat, and deep exploration
              mechanics.
            </p>
            <p className="text-trek-text/90">
              Built with cutting-edge technology and faithful to Star Trek lore,
              our platform offers an authentic Starfleet experience where every
              decision matters in the vast expanse of space.
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-blue flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Advanced Combat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-trek-text/80">
                Engage in tactical starship combat with real-time strategy
                elements, managing shields, weapons, and crew assignments.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-blue flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Galaxy Exploration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-trek-text/80">
                Explore thousands of star systems, discover new civilizations,
                and chart unknown regions of space.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-blue flex items-center gap-2">
                <Users className="w-5 h-5" />
                Multiplayer Cooperation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-trek-text/80">
                Form alliances, join fleets, and work together to face galactic
                threats and explore the unknown.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-trek-panel border-trek-accent">
            <CardHeader>
              <CardTitle className="text-trek-blue flex items-center gap-2">
                <Star className="w-5 h-5" />
                Authentic Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-trek-text/80">
                Experience authentic Star Trek storytelling with original
                missions, familiar locations, and beloved characters.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technical Specs */}
        <Card className="bg-trek-panel border-trek-accent">
          <CardHeader>
            <CardTitle className="text-trek-gold">
              Technical Specifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-trek-blue font-semibold">Frontend</div>
                <div className="text-trek-text/70">React 18 + TypeScript</div>
              </div>
              <div>
                <div className="text-trek-blue font-semibold">Styling</div>
                <div className="text-trek-text/70">TailwindCSS + LCARS</div>
              </div>
              <div>
                <div className="text-trek-blue font-semibold">Backend</div>
                <div className="text-trek-text/70">Express + PostgreSQL</div>
              </div>
              <div>
                <div className="text-trek-blue font-semibold">Version</div>
                <div className="text-trek-text/70">v2.4.7 Beta</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2 pt-8 border-t border-trek-accent">
          <p className="text-trek-text/60 text-sm">
            Star Trek and all related marks, logos and characters are solely
            owned by CBS Studios Inc.
          </p>
          <p className="text-trek-text/60 text-sm">
            This is a fan-made project created with respect for the Star Trek
            universe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
