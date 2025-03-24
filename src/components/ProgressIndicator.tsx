
import React, { memo } from 'react';
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  activeStep?: number;
  totalDots?: number;
}

// Using memo to prevent unnecessary re-renders
const ProgressIndicator: React.FC<ProgressIndicatorProps> = memo(({ 
  activeStep = 0,
  totalDots = 4
}) => {
  // Pre-generate the array outside the render function
  const dotsArray = Array.from({ length: totalDots }, (_, i) => i);
  
  return (
    <div className="fixed bottom-4 md:bottom-8 left-0 right-0 flex justify-center">
      <div className="flex gap-1">
        {dotsArray.map((i) => (
          <div 
            key={i} 
            className={cn(
              "h-1.5 md:h-2 w-1.5 md:w-2 rounded-full",
              i === activeStep ? "bg-white" : "bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
});

// Set display name for debugging purposes
ProgressIndicator.displayName = 'ProgressIndicator';

export default ProgressIndicator;
