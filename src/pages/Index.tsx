
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WaterTracker from "@/components/WaterTracker";
import DailyHabits from "@/components/DailyHabits";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Settings, ArrowRight } from "lucide-react";
import RightFootIcon from "@/components/RightFootIcon";
import { useProgram } from "@/contexts/ProgramContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface UserData {
  name: string;
  age: string;
  sex: string;
  weight: string;
  height: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const { currentWeek, maxAccessibleWeek, startProgram } = useProgram();
  
  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
      startProgram();
    } else {
      navigate("/register");
    }
  }, [navigate, startProgram]);

  if (!userData) {
    return null;
  }

  const handleReset = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("programStartDate");
    localStorage.removeItem("lastSeenWeek");
    toast.success("Profile reset! Redirecting to registration...");
    setTimeout(() => {
      navigate("/register");
    }, 1500);
  };
  
  const weightInKg = parseFloat(userData.weight);
  const recommendedWater = (weightInKg * 0.033).toFixed(1);
  
  // Weekly themes for quick reference
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
  
  const currentTheme = weeklyThemes.find(theme => theme.week === maxAccessibleWeek) || weeklyThemes[0];
  const totalWeeks = 13;
  const progressPercentage = (maxAccessibleWeek / totalWeeks) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-rightstep-gradient text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <RightFootIcon className="h-12 w-12" size={48} />
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={handleReset}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="shadow-md mb-6 border-t-4 border-t-rightstep-green">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-rightstep-green">Leptin Program</CardTitle>
                <CardDescription>
                  Week {maxAccessibleWeek} of {totalWeeks}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between mb-1">
                <span className="font-medium">Overall Progress</span>
                <span className="text-sm">{progressPercentage.toFixed(0)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{currentTheme.title}</h3>
                    <p className="text-sm text-gray-600">{currentTheme.description}</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-rightstep-green hover:bg-rightstep-green-dark"
                    onClick={() => navigate(`/week/${maxAccessibleWeek}`)}
                  >
                    Details
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WaterTracker recommendedAmount={parseFloat(recommendedWater)} />
          <DailyHabits currentWeek={maxAccessibleWeek} />
        </div>
      </main>
    </div>
  );
};

export default Index;
