
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
    // Use replace: true to prevent back navigation to this page
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
            <div className="flex flex-col items-center">
              <RightFootIcon className="h-32 w-32 text-rightstep-green mb-1" size={128} /> {/* Doubled from h-16 w-16 to h-32 w-32 */}
              <h2 className="text-xl font-bold text-rightstep-green">RightStep</h2>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-rightstep-green">Profile Complete!</CardTitle>
          <CardDescription className="text-lg">
            You're all set to begin your journey with RightStep
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-700">
            We've created your personalized plan based on your profile. Track your progress, stay hydrated, and build healthy habits one step at a time.
          </p>
          <div className="py-4 flex justify-center">
            <img 
              src="/lovable-uploads/d5ce8790-6171-4d07-8e0a-f4ef08542e6d.png" 
              alt="RightStep Journey" 
              className="h-40"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleContinue} className="w-full bg-rightstep-green hover:bg-rightstep-green-dark">
            Continue to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileComplete;
