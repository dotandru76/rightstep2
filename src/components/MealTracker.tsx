
import React, { useState } from "react";
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
    <div className="p-3 flex items-center justify-between rounded-lg">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center">
          <UtensilsCrossed className="h-4 w-4 text-green-600 mr-1" />
          <span className="text-sm font-medium">Meals: {meals}</span>
        </div>
        <div className="flex items-center">
          <Cookie className="h-4 w-4 text-amber-600 mr-1" />
          <span className="text-sm font-medium">Snacks: {snacks}</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-1">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addMeal}
          className="bg-green-50 hover:bg-green-100 border-green-200"
        >
          <Plus className="h-4 w-4" /> Meal
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addSnack}
          className="bg-amber-50 hover:bg-amber-100 border-amber-200"
        >
          <Plus className="h-4 w-4" /> Snack
        </Button>
      </div>
    </div>
  );
};

export default MealTracker;
