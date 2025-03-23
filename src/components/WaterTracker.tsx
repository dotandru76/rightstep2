
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, Plus, Minus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const WaterTracker = () => {
  const [waterGlasses, setWaterGlasses] = useState(0);
  const targetGlasses = 8;
  const progressPercentage = Math.min((waterGlasses / targetGlasses) * 100, 100);

  const addGlass = () => {
    setWaterGlasses(prev => prev + 1);
  };

  const removeGlass = () => {
    setWaterGlasses(prev => Math.max(0, prev - 1));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-500" />
          Water Tracking
        </CardTitle>
        <CardDescription>Leptin Flooding - The Foundation of the Method</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between mb-1">
            <span className="font-medium">{waterGlasses} of {targetGlasses} glasses</span>
            <span className="text-sm">{progressPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="flex justify-between mt-6">
            <Button variant="outline" size="icon" onClick={removeGlass} disabled={waterGlasses === 0}>
              <Minus className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Droplets 
                  key={i}
                  className={`h-5 w-5 ${i < waterGlasses ? 'text-blue-500' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={addGlass}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">Remember: 2 glasses of water before each meal prevents overeating</p>
      </CardFooter>
    </Card>
  );
};

export default WaterTracker;
