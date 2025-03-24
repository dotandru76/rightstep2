
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UtensilsCrossed, Cookie } from "lucide-react";

const MealTracker = () => {
  const [meals, setMeals] = useState(0);
  const [snacks, setSnacks] = useState(0);

  const addMeal = () => {
    setMeals(prev => prev + 1);
  };

  const addSnack = () => {
    setSnacks(prev => prev + 1);
  };

  const resetTrackers = () => {
    setMeals(0);
    setSnacks(0);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Meal Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-green-600" />
              <span className="font-medium">Meals today: {meals}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addMeal}
              className="bg-green-50 hover:bg-green-100 border-green-200"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Meal
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-amber-600" />
              <span className="font-medium">Snacks today: {snacks}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addSnack}
              className="bg-amber-50 hover:bg-amber-100 border-amber-200"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Snack
            </Button>
          </div>

          <div className="pt-3 mt-2 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetTrackers} 
              className="w-full text-gray-500 hover:text-gray-700"
            >
              Reset Counters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealTracker;
