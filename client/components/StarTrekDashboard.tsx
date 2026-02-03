import { useState } from "react";
import { StarTrekNav } from "./StarTrekNav";
import { FleetCommand } from "./sections/FleetCommand";
import { StarshipDatabase } from "./sections/StarshipDatabase";
import { FleetTactical } from "./sections/FleetTactical";
import { Shipyard } from "./sections/Shipyard";
import { GalacticMap } from "./sections/GalacticMap";
import { ShipSystems } from "./sections/ShipSystems";
import { RedAlertSystem } from "./RedAlertSystem";
import { CombatSystem } from "./sections/CombatSystem";
import { TransporterReplicator } from "./sections/TransporterReplicator";
import { Communications } from "./sections/Communications";
import { Holodeck } from "./sections/Holodeck";
import { Achievements } from "./sections/Achievements";
import { PlanetaryExplorer } from "./sections/PlanetaryExplorer";
import { ScienceExploration } from "./sections/ScienceExploration";
import { DiplomaticCorps } from "./sections/DiplomaticCorps";
import { Missions } from "./sections/Missions";
import { Tactical } from "./sections/Tactical";
import { Exploration } from "./sections/Exploration";
import { Crew } from "./sections/Crew";
import { Sensors } from "./sections/Sensors";
import { Engineering } from "./sections/Engineering";
import { Weapons } from "./sections/Weapons";
import { SeasonOperations } from "./sections/SeasonOperations";
import { UniverseMaps } from "./sections/UniverseMaps";
import { StellarCartography } from "./sections/StellarCartography";
import { TemporalMechanics } from "./sections/TemporalMechanics";
import { ThreatAssessment } from "./sections/ThreatAssessment";
import { SpacePhenomena } from "./sections/SpacePhenomena";

export function StarTrekDashboard() {
  const [activeSection, setActiveSection] = useState("fleet");

  const renderSection = () => {
    switch (activeSection) {
      case "fleet":
        return <FleetCommand />;
      case "starships":
        return <StarshipDatabase />;
      case "fleet_tactical":
        return <FleetTactical />;
      case "shipyard":
        return <Shipyard />;
      case "navigation":
        return <GalacticMap />;
      case "systems":
        return <ShipSystems />;
      case "red_alert":
        return <RedAlertSystem />;
      case "combat":
        return <CombatSystem />;
      case "transporter":
        return <TransporterReplicator />;
      case "communications":
        return <Communications />;
      case "holodeck":
        return <Holodeck />;
      case "achievements":
        return <Achievements />;
      case "planetary":
        return <PlanetaryExplorer />;
      case "science":
        return <ScienceExploration />;
      case "diplomatic":
        return <DiplomaticCorps />;
      case "missions":
        return <Missions />;
      case "tactical":
        return <Tactical />;
      case "exploration":
        return <Exploration />;
      case "crew":
        return <Crew />;
      case "sensors":
        return <Sensors />;
      case "engineering":
        return <Engineering />;
      case "weapons":
        return <Weapons />;
      case "season_operations":
        return <SeasonOperations />;
      case "universe_maps":
        return <UniverseMaps />;
      case "stellar_cartography":
        return <StellarCartography />;
      case "temporal_mechanics":
        return <TemporalMechanics />;
      case "threat_assessment":
        return <ThreatAssessment />;
      case "space_phenomena":
        return <SpacePhenomena />;
      default:
        return <FleetCommand />;
    }
  };

  return (
    <div className="min-h-screen bg-trek-dark text-trek-text flex">
      <StarTrekNav
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="flex-1 flex flex-col">
        <header className="bg-trek-panel border-b border-trek-accent p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-trek-gold tracking-wider">
                STARFLEET OPERATIONS
              </h1>
              <p className="text-trek-text/70 text-sm mt-1">
                United Federation of Planets • Stardate{" "}
                {new Date().toISOString().slice(0, 10).replace(/-/g, ".")}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-trek-text/70">Status</div>
                <div className="text-trek-blue font-semibold">
                  ALL SYSTEMS OPERATIONAL
                </div>
              </div>

              <div className="w-16 h-16 bg-trek-blue/20 border-2 border-trek-blue rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-trek-blue rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">{renderSection()}</main>
      </div>
    </div>
  );
}
