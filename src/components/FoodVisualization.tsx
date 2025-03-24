
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LightbulbIcon, ImageIcon, Utensils } from "lucide-react";
import { toast } from "sonner";

const FoodVisualization = () => {
  const [foodDescription, setFoodDescription] = useState("");
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [hasVisualized, setHasVisualized] = useState(false);

  const visualizationInstructions = [
    "Close your eyes and imagine the food in front of you",
    "Notice the colors, textures, and arrangement",
    "Imagine the aroma coming from the food",
    "Picture yourself taking the first bite",
    "Mentally observe how it would taste and feel",
    "Consider how this food will nourish your body",
  ];

  const handleVisualize = () => {
    if (!foodDescription.trim()) {
      toast.error("Please describe what you plan to eat first");
      return;
    }

    setIsVisualizing(true);
    
    // Set a timeout to simulate the visualization process
    setTimeout(() => {
      setIsVisualizing(false);
      setHasVisualized(true);
      toast.success("Food visualization complete!", {
        description: "You've successfully pictured your meal before eating it."
      });
    }, 10000); // 10 seconds of visualization
  };

  const resetVisualization = () => {
    setFoodDescription("");
    setHasVisualized(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-purple-500" />
          Picture Your Food
        </CardTitle>
        <CardDescription>Visualize what you'll eat before eating it</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isVisualizing ? (
          <div className="bg-purple-50 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-center">Visualizing: {foodDescription}</h3>
            <div className="space-y-2">
              {visualizationInstructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <p>{instruction}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label htmlFor="food-description" className="block text-sm font-medium">
                What are you planning to eat?
              </label>
              <Input
                id="food-description"
                placeholder="Describe your food (e.g., 'grilled chicken with vegetables')"
                value={foodDescription}
                onChange={(e) => setFoodDescription(e.target.value)}
                disabled={hasVisualized}
              />
            </div>

            {hasVisualized && (
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <LightbulbIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Visualization Complete</h4>
                    <p className="text-sm text-gray-600">
                      You've pictured: <span className="font-medium">{foodDescription}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      This mindful practice can help reduce portions and increase satisfaction.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter>
        {isVisualizing ? (
          <Button disabled className="w-full">
            Visualizing... {Math.floor(10 - (Date.now() % 10000) / 1000)}s
          </Button>
        ) : hasVisualized ? (
          <Button variant="outline" onClick={resetVisualization} className="w-full">
            Visualize Another Food
          </Button>
        ) : (
          <Button 
            onClick={handleVisualize} 
            className="w-full bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
          >
            <Utensils className="h-4 w-4" />
            Picture This Food
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FoodVisualization;
