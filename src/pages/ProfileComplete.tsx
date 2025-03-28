import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Activity, Calendar } from "lucide-react";
import RightFootIcon from "@/components/RightFootIcon";
import VoiceButton from "@/components/VoiceButton";

const ProfileComplete = () => {
  const navigate = useNavigate();
  const [dataExists, setDataExists] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setDataExists(true);
      setUserData(JSON.parse(userData));

      const programStartDate = localStorage.getItem("programStartDate");
      if (!programStartDate) {
        const today = new Date().toISOString();
        localStorage.setItem("programStartDate", today);
        localStorage.setItem("lastSeenWeek", "1");
      }
    } else {
      navigate("/register", { replace: true });
    }
  }, [navigate]);

  const handleContinue = () => {
    navigate("/", { replace: true });
  };

  if (!dataExists || !userData) {
    return null;
  }

  const calculateBMI = (weight: number, height: number) => {
    return weight / ((height / 100) ** 2);
  };

  const generatePlan = (gender: string, age: number, height: number, weight: number) => {
    const bmi = calculateBMI(weight, height);

    let bmiCategory = "";
    if (bmi < 18.5) bmiCategory = "Underweight";
    else if (bmi < 24.9) bmiCategory = "Normal weight";
    else if (bmi < 29.9) bmiCategory = "Overweight";
    else bmiCategory = "Obesity";

    const minIdealWeight = 18.5 * ((height / 100) ** 2);
    const maxIdealWeight = 24.9 * ((height / 100) ** 2);
    const idealWeight = (minIdealWeight + maxIdealWeight) / 2;
    const weightDifference = weight - idealWeight;

    let motivationMessage = "";
    let journey = "";

    if (bmiCategory === "Underweight") {
      motivationMessage = "Your journey is about building strength and improving your overall health.";
      journey = "The next 13 weeks will focus on healthy weight gain and developing sustainable habits.";
    } else if (bmiCategory === "Normal weight") {
      motivationMessage = "You're already at a healthy weight! Your journey is about maintaining and optimizing your health.";
      journey = "The next 13 weeks will help you fine-tune your habits and ensure you continue to thrive.";
    } else {
      motivationMessage = "Your journey is about finding a healthier balance and improving your overall wellbeing.";
      journey = "The next 13 weeks will guide you toward sustainable habits and gradual progress toward your ideal weight.";
    }

    return {
      bmi: bmi.toFixed(1),
      bmiCategory,
      idealWeight: Math.round(idealWeight),
      minIdealWeight: Math.round(minIdealWeight),
      maxIdealWeight: Math.round(maxIdealWeight),
      currentWeight: weight,
      weightToChange: Math.abs(Math.round(weightDifference)),
      shouldGain: weightDifference < 0,
      motivationMessage,
      journey,
      bmiScale: {
        underweight: { min: 0, max: 18.5 },
        normal: { min: 18.5, max: 24.9 },
        overweight: { min: 24.9, max: 29.9 },
        obese: { min: 29.9, max: 40 }
      }
    };
  };

  const results = generatePlan(
    userData.sex,
    parseInt(userData.age),
    parseInt(userData.height),
    parseInt(userData.weight)
  );

  // Calculate BMI positioning for visualizations
  const bmiValue = parseFloat(results.bmi);
  const maxBMI = 40; // Max BMI for visualization
  const bmiPercentage = Math.min((bmiValue / maxBMI) * 100, 100);
  
  // Calculate weight goal positioning
  const weightRange = results.maxIdealWeight - results.minIdealWeight;

  // Define voice texts for each section
  const voiceTexts = {
    bmi: `Your BMI is ${results.bmi}, which falls in the ${results.bmiCategory} category. The ideal BMI range is between 18.5 and 24.9.`,
    
    weightJourney: `Your current weight is ${results.currentWeight} kilograms. Your ideal weight range is between ${results.minIdealWeight} and ${results.maxIdealWeight} kilograms. Your goal is to ${results.shouldGain ? 'gain' : 'lose'} ${results.weightToChange} kilograms to reach your ideal weight of around ${results.idealWeight} kilograms.`,
    
    leptinePlan: `${results.motivationMessage} ${results.journey} Your personalized Leptine plan will guide you through the next 13 weeks with weekly personalized guidance, sustainable habit formation, progress tracking, and support for your unique health journey.`,
    
    // One-minute comprehensive motivation speech
    comprehensiveMotivation: `
      Hello ${userData.name}! Welcome to your personalized 13-week Leptine plan. 
      
      Based on your profile, your BMI is ${results.bmi}, which places you in the ${results.bmiCategory} category.
      
      ${results.shouldGain 
        ? `Your goal is to gain ${results.weightToChange} kilograms to reach your ideal weight of around ${results.idealWeight} kilograms.` 
        : `Your goal is to lose ${results.weightToChange} kilograms to reach your ideal weight of around ${results.idealWeight} kilograms.`}
      
      ${results.motivationMessage}
      
      Over the next 13 weeks, you'll receive personalized guidance that adapts to your progress. Each week builds on the previous one, helping you develop sustainable habits that will last a lifetime.
      
      Remember that consistency is more important than perfection. There may be days when things don't go as planned, but what matters is getting back on track and continuing your journey.
      
      The Leptine plan is designed to work with your body's natural processes, creating balanced, sustainable changes. Trust the process, follow the weekly guidance, and celebrate your victories along the way.
      
      We're excited to support you on this journey toward better health. Let's take this first step together! and make the right step!!! 
    `
  };

  return (
    <div className="min-h-screen bg-rightstep-gradient flex items-center justify-center px-4 py-8">
      <Card className="max-w-3xl w-full shadow-lg border-0">
        <CardHeader className="text-center space-y-2 relative">
          <div className="mx-auto flex items-center justify-center">
            <RightFootIcon className="h-28 w-28 text-rightstep-green" size={112} />
          </div>
          <CardTitle className="text-2xl font-bold text-rightstep-green">Your Journey Begins Now!</CardTitle>
          <CardDescription className="text-lg">
            We've created a personalized 13-week Leptine plan based on your profile
          </CardDescription>
          
          {/* Custom Trainer Button - Direct Implementation */}
          <div className="absolute top-4 right-4">
            <div className="flex flex-col items-center">
              <button
                onClick={() => {
                  // Stop any ongoing speech
                  window.speechSynthesis.cancel();
                  
                  // Create utterance with the comprehensive motivation text
                  const utterance = new SpeechSynthesisUtterance(voiceTexts.comprehensiveMotivation);
                  
                  // Log available voices to troubleshoot
                  const voices = window.speechSynthesis.getVoices();
                  console.log("Available voices:", voices.map(v => v.name));
                  
                  // Try to find a good female voice
                  const femaleVoices = voices.filter(v => 
                    v.name.includes("female") || 
                    v.name.includes("Female") ||
                    v.name.includes("Samantha") ||
                    v.name.includes("Victoria")
                  );
                  
                  if (femaleVoices.length > 0) {
                    utterance.voice = femaleVoices[0];
                    console.log("Using voice:", femaleVoices[0].name);
                  }
                  
                  // Set properties for more feminine voice
                  utterance.rate = 0.85;   // Slightly slower
                  utterance.pitch = 1.4;   // Higher pitch
                  utterance.volume = 1;
                  
                  // Speak
                  window.speechSynthesis.speak(utterance);
                }}
                className="w-24 h-24 rounded-full overflow-hidden shadow-md hover:scale-105 transition-transform"
                aria-label="Listen to overview"
              >
                <img 
                  src="/lovable-uploads/trainer.png" 
                  alt="Trainer" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load (person icon in pink)
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite loop
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'%3E%3Ccircle cx='50' cy='35' r='25' fill='%23f9a8d4'/%3E%3Cpath d='M50 65 C30 65 15 80 15 100 L85 100 C85 80 70 65 50 65 Z' fill='%23f9a8d4'/%3E%3C/svg%3E";
                  }}
                />
              </button>
              <span className="text-sm text-center mt-2 text-white font-medium bg-rightstep-green px-2 py-1 rounded-full">
                Please press on me
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* BMI Visualization */}
          <div className="rounded-lg bg-gradient-to-r from-green-50 to-blue-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-6 w-6 text-rightstep-green" />
              <h3 className="text-xl font-bold text-gray-800">Body Mass Index (BMI)</h3>
              <div className="ml-auto">
                <VoiceButton text={voiceTexts.bmi} />
              </div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
            
            <div className="h-8 w-full bg-gray-200 rounded-full overflow-hidden flex">
              <div className="h-full bg-blue-200" style={{ width: '18.5%' }}></div>
              <div className="h-full bg-green-300" style={{ width: '16.4%' }}></div>
              <div className="h-full bg-yellow-300" style={{ width: '15%' }}></div>
              <div className="h-full bg-red-300" style={{ width: '50.1%' }}></div>
            </div>
            
            {/* BMI Indicator */}
            <div className="relative h-6 mt-1">
              <div className="absolute top-0 transform -translate-x-1/2" style={{ left: `${bmiPercentage}%` }}>
                <div className="flex flex-col items-center">
                  <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-800"></div>
                  <span className="bg-gray-800 text-white px-2 py-1 rounded-md text-sm font-bold whitespace-nowrap">
                    Your BMI: {results.bmi}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Current</p>
                <p className="text-xl font-bold text-gray-800">{results.bmi} <span className="text-sm">({results.bmiCategory})</span></p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Ideal Range</p>
                <p className="text-xl font-bold text-gray-800">18.5 - 24.9</p>
              </div>
            </div>
          </div>
          
          {/* Weight Goals Visualization */}
          <div className="rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-6 w-6 text-orange-500" />
              <h3 className="text-xl font-bold text-gray-800">Your Weight Journey</h3>
              <div className="ml-auto">
                <VoiceButton text={voiceTexts.weightJourney} />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Current Weight</p>
                <p className="text-2xl font-bold text-gray-800">{results.currentWeight} <span className="text-sm">kg</span></p>
              </div>
              <div className="text-center border-l border-r border-gray-200">
                <p className="text-sm font-medium text-gray-600">Ideal Range</p>
                <p className="text-2xl font-bold text-green-600">{results.minIdealWeight}-{results.maxIdealWeight} <span className="text-sm">kg</span></p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">
                  {results.shouldGain ? "Target to Gain" : "Target to Lose"}
                </p>
                <p className="text-2xl font-bold text-orange-500">
                  {results.weightToChange} <span className="text-sm">kg</span>
                </p>
              </div>
            </div>
            
            {/* Weight Visualization */}
            <div className="h-8 w-full bg-gray-200 rounded-full overflow-hidden mb-1 relative">
              <div className="h-full bg-green-300 absolute" 
                style={{ 
                  left: `${(results.minIdealWeight/results.currentWeight*2)*50}%`, 
                  width: `${(weightRange/results.currentWeight*2)*50}%` 
                }}>
              </div>
              <div className="absolute h-full w-4 bg-blue-500 top-0 left-1/2 transform -translate-x-1/2"></div>
              <div className="absolute h-full w-4 bg-orange-500 rounded-full" 
                style={{ left: `${(results.currentWeight/results.currentWeight*2)*50}%` }}>
              </div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>0 kg</span>
              <span>{Math.round(results.currentWeight*2)} kg</span>
            </div>
            
            <div className="mt-6 bg-white p-4 rounded-md border border-orange-100">
              <p className="text-gray-700">
                <span className="font-medium text-orange-600">Your Goal: </span>
                {results.shouldGain 
                  ? `Gain ${results.weightToChange} kg to reach your ideal weight of around ${results.idealWeight} kg` 
                  : `Lose ${results.weightToChange} kg to reach your ideal weight of around ${results.idealWeight} kg`}
              </p>
            </div>
          </div>
          
          {/* 13-Week Program */}
          <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-6 w-6 text-indigo-600" />
              <h3 className="text-xl font-bold text-gray-800">Your 13-Week Leptine Plan</h3>
              <div className="ml-auto">
                <VoiceButton text={voiceTexts.leptinePlan} />
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700 mb-3">{results.motivationMessage}</p>
              <p className="text-gray-700">{results.journey}</p>
            </div>
            
            <div className="flex overflow-hidden h-4 bg-gray-200 rounded-full mt-4">
              {Array.from({ length: 13 }).map((_, i) => (
                <div key={i} className="flex-1 h-full">
                  <div 
                    className={`h-full ${i === 0 ? 'bg-indigo-500' : 'bg-indigo-200'}`}
                    style={{ opacity: i === 0 ? 1 : 0.4 + ((13 - i) * 0.05) }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-600">
              <span>Week 1</span>
              <span>Week 13</span>
            </div>
            
            <div className="mt-6 bg-white p-4 rounded-md border border-indigo-100">
              <p className="text-gray-700 font-medium">
                Your personalized Leptine plan will guide you through the next 13 weeks with:
              </p>
              <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
                <li>Weekly personalized guidance</li>
                <li>Sustainable habit formation</li>
                <li>Progress tracking and adjustments</li>
                <li>Support for your unique health journey</li>
              </ul>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex-col space-y-4">
          <Button
            onClick={handleContinue}
            className="w-full bg-rightstep-green hover:bg-rightstep-green-dark py-6 text-lg"
          >
            Start My 13-Week Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-xs text-gray-500 text-center">
            Remember, this is a marathon, not a sprint. Small consistent steps lead to lasting change.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileComplete;