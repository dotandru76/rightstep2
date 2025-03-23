
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, HeartHandshake } from "lucide-react";
import confetti from "canvas-confetti";

interface UserData {
  name: string;
  age: string;
  sex: string;
  weight: string;
  height: string;
}

const ProfileComplete = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
      
      // Trigger confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      // Redirect to register if no data
      navigate("/register");
    }
  }, [navigate]);

  const handleContinue = () => {
    navigate("/");
  };

  if (!userData) {
    return null; // Loading state or will redirect
  }

  // Calculate daily water intake recommendation (simplified formula)
  // Weight in kg * 0.033 = liters per day
  const weightInKg = parseFloat(userData.weight);
  const recommendedWater = (weightInKg * 0.033).toFixed(1);

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card className="w-full overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-blue-400 to-blue-600" />
        <CardHeader className="text-center pt-0 relative">
          <div className="flex justify-center -mt-14 mb-4">
            {userData.sex === "female" ? (
              <img 
                src="/lovable-uploads/a5b0210c-5524-436c-a9b0-b67703855063.png" 
                alt="Female Character" 
                className="h-32 bg-white rounded-full p-2 border-4 border-white shadow-md"
              />
            ) : (
              <img 
                src="/lovable-uploads/c20310f9-a5a7-4777-975a-39c4fa202879.png" 
                alt="Male Character" 
                className="h-32 bg-white rounded-full p-2 border-4 border-white shadow-md"
              />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-blue-600">
            Congratulations, {userData.name}!
          </CardTitle>
          <CardDescription>
            Your profile is complete and we're ready to begin your hydration journey
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-6">
            <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Droplets className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">Your Daily Water Goal</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Based on your weight, we recommend drinking at least <span className="font-bold">{recommendedWater} liters</span> of water per day.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-green-50 p-4 border border-green-100">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <HeartHandshake className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">Personalized Journey</h3>
                  <p className="text-sm text-green-700 mt-1">
                    We've tailored the Water Balance system just for you. Your journey to better hydration and health starts now!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Button 
            onClick={handleContinue} 
            className="w-full py-6 text-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
          >
            Start My Journey
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileComplete;
