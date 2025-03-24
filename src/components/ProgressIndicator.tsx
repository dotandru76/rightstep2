
import React from 'react';
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  activeStep?: number;
  totalDots?: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  activeStep = 0,
  totalDots = 4
}) => {
  return (
    <div className="fixed bottom-4 md:bottom-8 left-0 right-0 flex justify-center">
      <div className="flex gap-1">
        {[...Array(totalDots)].map((_, i) => (
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
};

export default ProgressIndicator;
