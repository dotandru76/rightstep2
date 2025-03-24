import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WaterTracker from "@/components/WaterTracker";
import WeeklyProgress from "@/components/WeeklyProgress";
import DailyHabits from "@/components/DailyHabits";
import TipsCard from "@/components/TipsCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowRight, UserCircle } from "lucide-react";
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
  
  const handleGoToWeeklyProgram = () => {
    navigate(`/week/${maxAccessibleWeek}`);
  };

  const weightInKg = parseFloat(userData.weight);
  const recommendedWater = (weightInKg * 0.033).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-rightstep-gradient text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <RightFootIcon className="h-16 w-16" size={64} />
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={handleReset}>
            <UserCircle className="mr-2 h-4 w-4" />
            Reset Profile
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-rightstep-green">
                Welcome, {userData.name}!
              </h2>
              <p className="text-gray-600">
                Your target: {recommendedWater} liters of water daily
              </p>
            </div>
            <Button 
              onClick={handleGoToWeeklyProgram}
              className="bg-rightstep-green hover:bg-rightstep-green-dark whitespace-nowrap"
            >
              Current Week's Program
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WaterTracker recommendedAmount={parseFloat(recommendedWater)} />
          <WeeklyProgress />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <DailyHabits currentWeek={maxAccessibleWeek} />
          <TipsCard />
        </div>
      </main>
    </div>
  );
};

export default Index;
