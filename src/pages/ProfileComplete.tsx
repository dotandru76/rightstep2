
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import RightFootIcon from "@/components/RightFootIcon";

const ProfileComplete = () => {
  const navigate = useNavigate();
  const [dataExists, setDataExists] = useState<boolean>(false);
  
  useEffect(() => {
    // Check for user data on component mount
    const userData = localStorage.getItem("userData");
    if (userData) {
      setDataExists(true);
    } else {
      // If no data exists, redirect to registration
      navigate("/register", { replace: true });
    }
  }, [navigate]);

  const handleContinue = () => {
    // First make sure we have a valid program start date
    const programStartDate = localStorage.getItem('programStartDate');
    if (!programStartDate) {
      // Initialize program start date if it doesn't exist
      const today = new Date().toISOString();
      localStorage.setItem('programStartDate', today);
      localStorage.setItem('lastSeenWeek', '1');
    }
    
    // Force navigation to root with replace to prevent back navigation issues
    navigate("/", { replace: true });
  };

  if (!dataExists) {
    return null; // Don't render anything while checking/redirecting
  }

  return (
    <div className="min-h-screen bg-rightstep-gradient flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full shadow-lg border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex items-center justify-center">
            <RightFootIcon className="h-48 w-48 text-rightstep-green" size={192} />
          </div>
          <CardTitle className="text-xl font-bold text-rightstep-green">Profile Complete!</CardTitle>
          <CardDescription className="text-lg">
            You're all set to begin your journey with RightStep
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-700">
            We've created your personalized plan based on your profile. Track your progress, stay hydrated, and build healthy habits one step at a time.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleContinue} 
            className="w-full bg-rightstep-green hover:bg-rightstep-green-dark"
          >
            Continue to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileComplete;
