
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const minSize = 48;
  const maxSize = 120;
  const dropletSize = minSize + Math.round((progressPercentage / 100) * (maxSize - minSize));
  
  // Adjust color intensity based on progress
  const dropletColor = progressPercentage >= 100 
    ? "#1EAEDB" // Bright blue when complete
    : `rgba(30, 174, 219, ${0.3 + (progressPercentage / 100) * 0.7})`; // Gradually intensifying blue

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Water Intake</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="relative flex justify-center items-center h-[140px]">
            <Droplet 
              size={dropletSize}
              fill={dropletColor}
              color={dropletColor}
            />
            <span className="absolute font-bold text-white">{waterGlasses}/{targetGlasses}</span>
          </div>
          
          <div className="flex items-center gap-4 mt-2">
            <Button variant="outline" size="icon" onClick={removeGlass} disabled={waterGlasses === 0}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-sm">{(waterGlasses * glassSize).toFixed(1)}L of {recommendedAmount}L</span>
            <Button variant="outline" size="icon" onClick={addGlass}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterTracker;
