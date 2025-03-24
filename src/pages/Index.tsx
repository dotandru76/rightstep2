
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WaterTracker from "@/components/WaterTracker";
import { toast } from "sonner";
import { useProgram } from "@/contexts/ProgramContext";
import { weeklyProgram } from "@/data/weeklyProgramData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProgramProgressCard from "@/components/dashboard/ProgramProgressCard";
import WeekDetailsDialog from "@/components/dashboard/WeekDetailsDialog";
import MealTracker from "@/components/MealTracker";
import FoodVisualization from "@/components/FoodVisualization";
import FoodLogSummary from "@/components/FoodLogSummary";
import TipsCard from "@/components/TipsCard";
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
  const { currentWeek, maxAccessibleWeek, startProgram, isNewWeek, setIsNewWeekSeen } = useProgram();
  const [showWeekDetails, setShowWeekDetails] = useState(false);
  
  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
      startProgram();
    } else {
      navigate("/register");
    }
  }, [navigate, startProgram]);

  useEffect(() => {
    // Show week details dialog automatically when a new week is unlocked
    if (isNewWeek) {
      setShowWeekDetails(true);
      setIsNewWeekSeen();
    }
  }, [isNewWeek, setIsNewWeekSeen]);

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
  
  const currentWeekData = weeklyProgram.find(program => program.week === maxAccessibleWeek) || weeklyProgram[0];
  const totalWeeks = 13;
  const progressPercentage = (maxAccessibleWeek / totalWeeks) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader onReset={handleReset} />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl flex-grow">
        <ProgramProgressCard 
          maxAccessibleWeek={maxAccessibleWeek} 
          onShowDetails={() => setShowWeekDetails(true)} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <WaterTracker recommendedAmount={parseFloat(recommendedWater)} />
          <MealTracker />
        </div>

        <div className="mt-4">
          <FoodLogSummary />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FoodVisualization />
          <TipsCard />
        </div>
      </main>

      <div className="container mx-auto px-4 pb-8 max-w-4xl">
        <div className="mt-6">
          <div className="flex justify-between mb-1">
            <span className="font-medium">Overall Progress</span>
            <span className="text-sm">{progressPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      <WeekDetailsDialog 
        open={showWeekDetails} 
        onOpenChange={setShowWeekDetails} 
        weekData={currentWeekData} 
      />
    </div>
  );
};

export default Index;
