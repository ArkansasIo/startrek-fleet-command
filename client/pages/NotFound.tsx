
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-trek-dark text-trek-text">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto bg-trek-warning/20 border-2 border-trek-warning rounded-full flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-trek-warning" />
          </div>

          <h1 className="text-6xl font-bold text-trek-gold">404</h1>
          <h2 className="text-2xl font-semibold text-trek-blue">
            SECTOR NOT FOUND
          </h2>
          <p className="text-xl text-trek-text/80 max-w-md mx-auto">
            The requested coordinates do not exist in our star charts.
          </p>
          <p className="text-sm text-trek-text/60">
            Route:{" "}
            <span className="font-mono text-trek-warning">
              {location.pathname}
            </span>
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => navigate("/")}
            className="bg-trek-blue hover:bg-trek-blue/80 text-trek-dark font-semibold px-8 py-3"
          >
            <Home className="w-5 h-5 mr-2" />
            Return to Starfleet Command
          </Button>

          <div className="text-xs text-trek-text/50">
            Starfleet Navigation Protocol: Redirect to known coordinates
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
