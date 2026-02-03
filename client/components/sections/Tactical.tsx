import { Card } from "@/components/ui/card";
import { Shield, Zap, Target, AlertTriangle } from "lucide-react";

export function Tactical() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-trek-gold tracking-wider">
        TACTICAL OPERATIONS
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-trek-panel border-trek-accent p-6 text-center">
          <Shield className="w-8 h-8 text-trek-blue mx-auto mb-2" />
          <h3 className="text-trek-gold font-semibold">Shield Status</h3>
          <p className="text-2xl text-trek-blue font-bold">100%</p>
        </Card>

        <Card className="bg-trek-panel border-trek-accent p-6 text-center">
          <Zap className="w-8 h-8 text-trek-warning mx-auto mb-2" />
          <h3 className="text-trek-gold font-semibold">Weapons</h3>
          <p className="text-trek-warning font-semibold">ARMED</p>
        </Card>

        <Card className="bg-trek-panel border-trek-accent p-6 text-center">
          <Target className="w-8 h-8 text-trek-blue mx-auto mb-2" />
          <h3 className="text-trek-gold font-semibold">Targeting</h3>
          <p className="text-trek-blue font-semibold">LOCKED</p>
        </Card>

        <Card className="bg-trek-panel border-trek-accent p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <h3 className="text-trek-gold font-semibold">Alert Status</h3>
          <p className="text-red-400 font-semibold">YELLOW</p>
        </Card>
      </div>

      <Card className="bg-trek-panel border-trek-accent p-6">
        <h3 className="text-xl text-trek-gold mb-4">Tactical Analysis</h3>
        <p className="text-trek-text/80">
          All defensive systems operational. Long-range sensors detect no
          immediate threats. Recommend maintaining current alert status while in
          Federation space.
        </p>
      </Card>
    </div>
  );
}
