
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Droplet, Plus, Minus } from "lucide-react";

interface WaterTrackerProps {
  recommendedAmount?: number;
}

const WaterTracker: React.FC<WaterTrackerProps> = ({ recommendedAmount = 2.5 }) => {
  const [waterGlasses, setWaterGlasses] = useState(0);
  // A glass is typically 250ml or 0.25 liters
  const glassSize = 0.25; 
  const targetGlasses = Math.ceil(recommendedAmount / glassSize);
  const progressPercentage = Math.min((waterGlasses / targetGlasses) * 100, 100);

  const addGlass = () => {
    setWaterGlasses(prev => prev + 1);
  };

  const removeGlass = () => {
    setWaterGlasses(prev => Math.max(0, prev - 1));
  };

  // Calculate the size of the droplet based on percentage
  const minSize = 30;
  const maxSize = 50;
  const dropletSize = minSize + Math.round((progressPercentage / 100) * (maxSize - minSize));
  
  // Adjust color intensity based on progress
  const dropletColor = progressPercentage >= 100 
    ? "#1EAEDB" // Bright blue when complete
    : `rgba(30, 174, 219, ${0.3 + (progressPercentage / 100) * 0.7})`; // Gradually intensifying blue

  return (
    <div className="p-3 flex items-center justify-between rounded-lg">
      <div className="flex items-center">
        <div className="relative flex justify-center items-center h-[60px] w-[60px]">
          <Droplet 
            size={dropletSize}
            fill={dropletColor}
            color={dropletColor}
          />
          <span className="absolute font-bold text-white text-xs">{waterGlasses}/{targetGlasses}</span>
        </div>
        <div className="ml-2">
          <h3 className="text-sm font-medium">Water Intake</h3>
          <span className="text-xs text-gray-600">{(waterGlasses * glassSize).toFixed(1)}L of {recommendedAmount}L</span>
        </div>
      </div>
      
      <div className="flex gap-1">
        <Button variant="outline" size="sm" onClick={addGlass}>
          <Plus className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={removeGlass} disabled={waterGlasses === 0}>
          <Minus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WaterTracker;
