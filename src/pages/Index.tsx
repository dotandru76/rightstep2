
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WaterTracker from "@/components/WaterTracker";
import WeeklyProgress from "@/components/WeeklyProgress";
import DailyHabits from "@/components/DailyHabits";
import TipsCard from "@/components/TipsCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Settings } from "lucide-react";
import RightFootIcon from "@/components/RightFootIcon";
import { useProgram } from "@/contexts/ProgramContext";

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <WeeklyProgress />
          </div>
          
          <WaterTracker recommendedAmount={parseFloat(recommendedWater)} />
          <DailyHabits currentWeek={maxAccessibleWeek} />
        </div>
        
        <div className="mt-6">
          <TipsCard />
        </div>
      </main>
    </div>
  );
};

export default Index;
