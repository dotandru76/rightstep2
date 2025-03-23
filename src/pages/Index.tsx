
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WaterTracker from "@/components/WaterTracker";
import WeeklyProgress from "@/components/WeeklyProgress";
import DailyHabits from "@/components/DailyHabits";
import TipsCard from "@/components/TipsCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Footprints, UserCircle } from "lucide-react";

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

  useEffect(() => {
    // Check if user data exists
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    } else {
      // Redirect to registration if no user data
      navigate("/register");
    }
  }, [navigate]);

  if (!userData) {
    return null; // Loading state or will redirect
  }

  const handleReset = () => {
    // Clear user data
    localStorage.removeItem("userData");
    toast.success("Profile reset! Redirecting to registration...");
    setTimeout(() => {
      navigate("/register");
    }, 1500);
  };

  // Calculate daily water intake recommendation based on weight
  const weightInKg = parseFloat(userData.weight);
  const recommendedWater = (weightInKg * 0.033).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-rightstep-gradient text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Footprints className="h-6 w-6" />
            <h1 className="text-xl font-bold">RightStep</h1>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={handleReset}>
            <UserCircle className="mr-2 h-4 w-4" />
            Reset Profile
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-rightstep-green flex items-center gap-2">
            <Footprints className="h-5 w-5" />
            Welcome, {userData.name}!
          </h2>
          <p className="text-gray-600">
            Your target: {recommendedWater} liters of water daily
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WaterTracker recommendedAmount={parseFloat(recommendedWater)} />
          <WeeklyProgress />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <DailyHabits />
          <TipsCard />
        </div>
      </main>
    </div>
  );
};

export default Index;
