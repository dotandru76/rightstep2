
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WaterTracker from "@/components/WaterTracker";
import DailyHabits from "@/components/DailyHabits";
import { toast } from "sonner";
import { useProgram } from "@/contexts/ProgramContext";
import TipsCard from "@/components/TipsCard";
import { weeklyProgram } from "@/data/weeklyProgramData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProgramProgressCard from "@/components/dashboard/ProgramProgressCard";
import WeekDetailsDialog from "@/components/dashboard/WeekDetailsDialog";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onReset={handleReset} />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <ProgramProgressCard 
          maxAccessibleWeek={maxAccessibleWeek} 
          onShowDetails={() => setShowWeekDetails(true)} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WaterTracker recommendedAmount={parseFloat(recommendedWater)} />
          <DailyHabits currentWeek={maxAccessibleWeek} />
        </div>

        <div className="mt-6">
          <TipsCard />
        </div>
      </main>

      <WeekDetailsDialog 
        open={showWeekDetails} 
        onOpenChange={setShowWeekDetails} 
        weekData={currentWeekData} 
      />
    </div>
  );
};

export default Index;
