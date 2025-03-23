
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WaterTracker } from "@/components/WaterTracker";
import { WeeklyProgress } from "@/components/WeeklyProgress";
import { DailyHabits } from "@/components/DailyHabits";
import { TipsCard } from "@/components/TipsCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Form } from "@/components/ui/form"; // Import Form provider

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
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Welcome, {userData.name}!</h1>
          <p className="text-gray-600">
            Your target: {recommendedWater} liters of water daily
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset}>
          Reset Profile
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WaterTracker recommendedAmount={parseFloat(recommendedWater)} />
        <WeeklyProgress />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <DailyHabits />
        <TipsCard />
      </div>
    </div>
  );
};

export default Index;
