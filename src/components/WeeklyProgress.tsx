
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const WeeklyProgress = () => {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(1);
  const totalWeeks = 13;
  const progressPercentage = (currentWeek / totalWeeks) * 100;

  // Weekly themes based on the Leptine Method
  const weeklyThemes = [
    { week: 1, title: "Water and Drinking", description: "Leptin flooding - 3-4 liters per day" },
    { week: 2, title: "Cleansing Vegetables", description: "50% of the plate cleansing vegetables" },
    { week: 3, title: "Leptin Cleansing", description: "Holiday from sugar, flour, and processed foods" },
    { week: 4, title: "Leptin Carbohydrates", description: "Legumes, buckwheat, and quinoa" },
    { week: 5, title: "Fat Limitation", description: "Limiting to 2 tablespoons of concentrated fat per day" },
    { week: 6, title: "Eating Habits", description: "Frequency and form of eating" },
    { week: 7, title: "Frequency Reduction", description: "2-3 meals a day without snacking" },
    { week: 8, title: "Renewed Motivation", description: "Strengthening motivation and developing indifference to kryptonite food" },
    { week: 9, title: "Track Selection", description: "Transition to one of the three tracks" },
    { week: 10, title: "Leptin Deepening", description: "Hormonal balance and energy elevation" },
    { week: 11, title: "Supporting Lifestyle", description: "Breathing, power pose, and sleep habits" },
    { week: 12, title: "Path Precision", description: "Caloric density and clear boundaries" },
    { week: 13, title: "Leptin for Life", description: "Developing the Leptin identity and strategies for persistence" }
  ];

  const handlePreviousWeek = () => {
    if (currentWeek > 1) {
      setCurrentWeek(currentWeek - 1);
    }
  };

  const handleNextWeek = () => {
    if (currentWeek < totalWeeks) {
      setCurrentWeek(currentWeek + 1);
    }
  };
  
  const handleGoToWeek = (week: number) => {
    navigate(`/week/${week}`);
  };

  const currentTheme = weeklyThemes.find(theme => theme.week === currentWeek) || weeklyThemes[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Program Progress</CardTitle>
            <CardDescription>Track your progress in the 13-week program</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handlePreviousWeek} disabled={currentWeek === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextWeek} disabled={currentWeek === totalWeeks}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between mb-1">
            <span className="font-medium">Week {currentWeek} of {totalWeeks}</span>
            <span className="text-sm">{progressPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{currentTheme.title}</h3>
                <p>{currentTheme.description}</p>
              </div>
              <Button 
                size="sm" 
                className="bg-rightstep-green hover:bg-rightstep-green-dark"
                onClick={() => handleGoToWeek(currentWeek)}
              >
                Details
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mt-4">
            {Array.from({ length: totalWeeks }).map((_, i) => (
              <Button 
                key={i}
                variant={currentWeek === i + 1 ? "default" : "outline"}
                className="h-10 min-w-0"
                onClick={() => setCurrentWeek(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgress;
