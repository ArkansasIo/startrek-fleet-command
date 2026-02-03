
import {
  ArrowLeft,
  HelpCircle,
  Book,
  Users,
  Settings,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";

const Help = () => {
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
              Starfleet Training Manual
            </h1>
            <p className="text-trek-text/70">
              Your guide to Starfleet Command: Online
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Quick Start */}
        <Card className="bg-trek-panel border-trek-accent">
          <CardHeader>
            <CardTitle className="text-trek-gold flex items-center gap-2">
              <Zap className="w-6 h-6" />
              Quick Start Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-trek-blue font-semibold">
                  1. Create Your Officer
                </h3>
                <p className="text-trek-text/80 text-sm">
                  Register your Starfleet credentials and customize your officer
                  profile.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-trek-blue font-semibold">
                  2. Choose Your Division
                </h3>
                <p className="text-trek-text/80 text-sm">
                  Select from Command, Operations, Sciences, Medical,
                  Engineering, or Security.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-trek-blue font-semibold">
                  3. Access the Bridge
                </h3>
                <p className="text-trek-text/80 text-sm">
                  Navigate the command interface and familiarize yourself with
                  ship systems.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-trek-blue font-semibold">
                  4. Begin Your Mission
                </h3>
                <p className="text-trek-text/80 text-sm">
                  Start with training scenarios before venturing into deep
                  space.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="bg-trek-panel border-trek-accent">
          <CardHeader>
            <CardTitle className="text-trek-gold flex items-center gap-2">
              <HelpCircle className="w-6 h-6" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="login" className="border-trek-accent">
                <AccordionTrigger className="text-trek-blue hover:text-trek-gold">
                  How do I log in to Starfleet Command?
                </AccordionTrigger>
                <AccordionContent className="text-trek-text/80">
                  Click the "Login" button in the top navigation. You can use
                  demo accounts (jlpicard, data, worf) or create a new Starfleet
                  officer profile by clicking "Enlist".
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="divisions" className="border-trek-accent">
                <AccordionTrigger className="text-trek-blue hover:text-trek-gold">
                  What are the different Starfleet divisions?
                </AccordionTrigger>
                <AccordionContent className="text-trek-text/80">
                  <ul className="space-y-1 list-disc list-inside">
                    <li>
                      <strong>Command:</strong> Ship operations and tactical
                      decisions
                    </li>
                    <li>
                      <strong>Operations:</strong> Technical systems and
                      logistics
                    </li>
                    <li>
                      <strong>Sciences:</strong> Research and exploration
                    </li>
                    <li>
                      <strong>Medical:</strong> Health and biological sciences
                    </li>
                    <li>
                      <strong>Engineering:</strong> Ship maintenance and power
                      systems
                    </li>
                    <li>
                      <strong>Security:</strong> Ship defense and away team
                      protection
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="navigation" className="border-trek-accent">
                <AccordionTrigger className="text-trek-blue hover:text-trek-gold">
                  How do I navigate the command interface?
                </AccordionTrigger>
                <AccordionContent className="text-trek-text/80">
                  Use the main navigation tabs to switch between Command
                  Interface and Game Dashboard. The Command Interface provides
                  system overviews, while the Game Dashboard offers detailed
                  mission and fleet management tools.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="audio" className="border-trek-accent">
                <AccordionTrigger className="text-trek-blue hover:text-trek-gold">
                  How do I control audio settings?
                </AccordionTrigger>
                <AccordionContent className="text-trek-text/80">
                  Audio controls are available in the top-right corner during
                  the splash screen and throughout the application. You can
                  mute/unmute and adjust volume levels for the optimal Star Trek
                  experience.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="missions" className="border-trek-accent">
                <AccordionTrigger className="text-trek-blue hover:text-trek-gold">
                  How do I start missions and explore space?
                </AccordionTrigger>
                <AccordionContent className="text-trek-text/80">
                  After logging in, access the Game Dashboard to view available
                  missions, manage your fleet, and explore star systems. Each
                  mission type offers different challenges and rewards.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="bg-trek-panel border-trek-accent">
          <CardHeader>
            <CardTitle className="text-trek-gold flex items-center gap-2">
              <Users className="w-6 h-6" />
              Contact Starfleet Academy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-trek-text/80">
              Need additional assistance? Contact our development team for
              technical support or game-related questions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-trek-blue font-semibold mb-2">
                  Technical Issues
                </h4>
                <p className="text-trek-text/70 text-sm">
                  Report bugs, performance issues, or system compatibility
                  problems.
                </p>
              </div>
              <div>
                <h4 className="text-trek-blue font-semibold mb-2">
                  Gameplay Questions
                </h4>
                <p className="text-trek-text/70 text-sm">
                  Get help with missions, character development, and game
                  mechanics.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Version Info */}
        <div className="text-center space-y-2 pt-8 border-t border-trek-accent">
          <p className="text-trek-text/60 text-sm">
            Starfleet Command: Online v2.4.7 Beta
          </p>
          <p className="text-trek-text/60 text-sm">
            For the latest updates and patches, check the main dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Help;
