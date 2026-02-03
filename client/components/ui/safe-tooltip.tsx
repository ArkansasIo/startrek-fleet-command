import * as React from "react";

// Safe tooltip provider that doesn't cause useRef errors
const SafeTooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Export a safe tooltip system that can be used without errors
export { SafeTooltipProvider };
