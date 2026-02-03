import { Card } from "@/components/ui/card";
import { Map, Compass, Globe, Eye } from "lucide-react";

export function Exploration() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
        EXPLORATION DIVISION
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-trek-panel border-trek-accent p-6">
          <div className="flex items-center gap-3 mb-4">
            <Map className="w-6 h-6 text-trek-blue" />
            <h3 className="text-xl text-trek-gold">Stellar Cartography</h3>
          </div>
          <p className="text-trek-text/80">
            Current mapping operations focus on uncharted regions of the Beta
            Quadrant. 47 new star systems catalogued this stardate.
          </p>
        </Card>

        <Card className="bg-trek-panel border-trek-accent p-6">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-trek-blue" />
            <h3 className="text-xl text-trek-gold">Deep Space Surveys</h3>
          </div>
          <p className="text-trek-text/80">
            Long-range sensor arrays detecting anomalous readings in Sector 437.
            Recommend investigation by science vessel.
          </p>
        </Card>
      </div>
    </div>
  );
}
