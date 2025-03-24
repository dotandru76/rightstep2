
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2, Info, LockIcon } from "lucide-react";
import WaterTracker from "@/components/WaterTracker";
import DailyHabits from "@/components/DailyHabits";
import { Progress } from "@/components/ui/progress";
import RightFootIcon from "@/components/RightFootIcon";
import { useProgram } from "@/contexts/ProgramContext";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Weekly themes based on the Leptine Method (from WeeklyProgress.tsx)
const weeklyProgram = [
  { 
    week: 1, 
    title: "Water and Drinking", 
    description: "Leptin flooding - 3-4 liters per day",
    tasks: [
      "Drink 8 glasses of water daily (2L minimum)",
      "Drink 2 glasses of water before each meal",
      "Track your water intake throughout the day",
      "Reduce sugary drinks and alcohol consumption"
    ],
    explanation: "Water is the foundation of the Leptin Method. Proper hydration helps regulate hunger hormones, flush toxins, and prepare your body for the journey ahead. Drinking water before meals helps reduce caloric intake by creating a feeling of fullness."
  },
  { 
    week: 2, 
    title: "Cleansing Vegetables", 
    description: "50% of the plate cleansing vegetables",
    tasks: [
      "Fill half your plate with cleansing vegetables at each meal",
      "Focus on leafy greens, broccoli, cauliflower, zucchini",
      "Prepare vegetables in advance for easy access",
      "Experiment with herbs and spices for flavor"
    ],
    explanation: "Cleansing vegetables provide essential nutrients while keeping caloric density low. They create physical volume in your stomach, triggering stretch receptors that signal fullness to your brain."
  },
  { 
    week: 3, 
    title: "Leptin Cleansing", 
    description: "Holiday from sugar, flour, and processed foods",
    tasks: [
      "Eliminate added sugars from your diet",
      "Avoid wheat flour and refined grains",
      "Read food labels to identify hidden sugars",
      "Replace processed foods with whole foods"
    ],
    explanation: "Sugar, flour, and processed foods disrupt the leptin signaling system. This cleansing week helps reset your hormone balance and break the dopamine cycle that drives cravings."
  },
  { 
    week: 4, 
    title: "Leptin Carbohydrates", 
    description: "Legumes, buckwheat, and quinoa",
    tasks: [
      "Introduce healthy complex carbohydrates",
      "Include legumes in at least one meal daily",
      "Replace refined grains with buckwheat and quinoa",
      "Balance carbs with protein and vegetables"
    ],
    explanation: "Not all carbohydrates are created equal. Leptin-friendly carbs are slow-digesting, high in fiber, and support stable blood sugar levels while providing sustained energy."
  },
  { 
    week: 5, 
    title: "Fat Limitation", 
    description: "Limiting to 2 tablespoons of concentrated fat per day",
    tasks: [
      "Limit concentrated fats to 2 tablespoons daily",
      "Choose healthy fats: olive oil, avocado, nuts",
      "Be mindful of hidden fats in processed foods",
      "Use measuring tools to control portions"
    ],
    explanation: "While healthy fats are essential, concentrated fats are calorie-dense. This step helps control caloric intake while ensuring you get sufficient essential fatty acids."
  },
  { 
    week: 6, 
    title: "Eating Habits", 
    description: "Frequency and form of eating",
    tasks: [
      "Eat in a calm, seated position without distractions",
      "Chew each bite thoroughly (at least 20 times)",
      "Put utensils down between bites",
      "Practice mindful eating at each meal"
    ],
    explanation: "How you eat is as important as what you eat. Mindful eating improves digestion, reduces overeating, and enhances satisfaction from meals."
  },
  { 
    week: 7, 
    title: "Frequency Reduction", 
    description: "2-3 meals a day without snacking",
    tasks: [
      "Consolidate eating into 2-3 structured meals",
      "Eliminate snacking between meals",
      "Create a consistent eating schedule",
      "Ensure meals are nutritionally complete"
    ],
    explanation: "Constant snacking keeps insulin levels elevated. Reducing meal frequency allows proper hormonal cycling and promotes fat utilization between meals."
  },
  { 
    week: 8, 
    title: "Renewed Motivation", 
    description: "Strengthening motivation and developing indifference to kryptonite food",
    tasks: [
      "Identify your personal 'kryptonite' foods",
      "Practice exposure without consumption",
      "Develop replacement strategies for cravings",
      "Reconnect with your core motivation"
    ],
    explanation: "This week focuses on the psychological aspects of the journey. Building resilience against trigger foods while reinforcing your motivation creates lasting change."
  },
  { 
    week: 9, 
    title: "Track Selection", 
    description: "Transition to one of the three tracks",
    tasks: [
      "Evaluate your progress and needs",
      "Choose your path: maintenance, continued loss, or healing",
      "Set specific goals for your selected track",
      "Adapt previous principles to your chosen track"
    ],
    explanation: "Based on your progress and personal situation, you'll select the track that best serves your needs: maintenance, continued weight loss, or healing specific health conditions."
  },
  { 
    week: 10, 
    title: "Leptin Deepening", 
    description: "Hormonal balance and energy elevation",
    tasks: [
      "Fine-tune your eating window (10-12 hours)",
      "Optimize protein intake for muscle preservation",
      "Address sleep quality and quantity",
      "Integrate gentle movement daily"
    ],
    explanation: "This week focuses on deeper hormonal optimization, enhancing metabolic flexibility, and ensuring sustainable energy levels throughout the day."
  },
  { 
    week: 11, 
    title: "Supporting Lifestyle", 
    description: "Breathing, power pose, and sleep habits",
    tasks: [
      "Practice 142 breathing before meals (1-4-2 ratio)",
      "Hold power poses for 2 minutes daily",
      "Establish a consistent sleep schedule",
      "Create a sleep-promoting environment"
    ],
    explanation: "Lifestyle factors directly impact hormonal function. Breathing techniques reduce stress, power poses affect cortisol/testosterone balance, and quality sleep is essential for leptin regulation."
  },
  { 
    week: 12, 
    title: "Path Precision", 
    description: "Caloric density and clear boundaries",
    tasks: [
      "Understand caloric density of different foods",
      "Establish clear personal boundaries with food",
      "Create strategies for social eating situations",
      "Practice assertive communication about your needs"
    ],
    explanation: "This week focuses on precision and boundaries. Understanding caloric density helps make informed choices, while clear boundaries protect your progress in various situations."
  },
  { 
    week: 13, 
    title: "Leptin for Life", 
    description: "Developing the Leptin identity and strategies for persistence",
    tasks: [
      "Identify as a person who follows the Leptin lifestyle",
      "Create strategies for challenging situations",
      "Develop a maintenance plan for long-term success",
      "Share your experience to solidify your identity"
    ],
    explanation: "The final week transitions from 'doing' the Leptin Method to 'being' a person who naturally lives this way. Identity-based habits are the key to lifelong maintenance."
  }
];

const WeeklyProgram = () => {
  const navigate = useNavigate();
  const { weekNumber } = useParams();
  const { maxAccessibleWeek, isNewWeek, setIsNewWeekSeen } = useProgram();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const totalWeeks = 13;
  
  useEffect(() => {
    // Check if user data exists, if not redirect to registration
    const userData = localStorage.getItem("userData");
    if (!userData) {
      navigate("/register", { replace: true });
      return;
    }
    
    // Set current week based on URL parameter
    if (weekNumber) {
      const week = parseInt(weekNumber);
      if (week >= 1 && week <= maxAccessibleWeek) {
        setCurrentWeek(week);
        
        // Show welcome dialog if this is the current max week and it's new
        if (week === maxAccessibleWeek && isNewWeek) {
          setShowWelcomeDialog(true);
          setIsNewWeekSeen();
        }
      } else if (week > maxAccessibleWeek) {
        // Redirect to max accessible week if requested week is not yet available
        toast.error("That week isn't unlocked yet", {
          description: "You'll gain access as you progress through the program."
        });
        navigate(`/week/${maxAccessibleWeek}`, { replace: true });
      } else {
        // Redirect to week 1 if invalid week number
        navigate("/week/1", { replace: true });
      }
    }
  }, [weekNumber, navigate, maxAccessibleWeek, isNewWeek, setIsNewWeekSeen]);

  // Get the current week's program
  const weekProgram = weeklyProgram.find(w => w.week === currentWeek) || weeklyProgram[0];
  
  // Calculate progress percentage
  const progressPercentage = (maxAccessibleWeek / totalWeeks) * 100;

  const handlePreviousWeek = () => {
    if (currentWeek > 1) {
      navigate(`/week/${currentWeek - 1}`);
    }
  };

  const handleNextWeek = () => {
    if (currentWeek < maxAccessibleWeek) {
      navigate(`/week/${currentWeek + 1}`);
    } else if (currentWeek < totalWeeks) {
      toast.error("Week not unlocked yet", {
        description: "You'll gain access to this week as you progress in real time."
      });
    }
  };

  const handleBackToDashboard = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <header className="bg-rightstep-gradient text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <RightFootIcon className="h-6 w-6" />
            <h1 className="text-xl font-bold">RightStep</h1>
          </div>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20"
            onClick={handleBackToDashboard}
          >
            Back to Dashboard
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-rightstep-green">Week {currentWeek}: {weekProgram.title}</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handlePreviousWeek} disabled={currentWeek === 1}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextWeek} disabled={currentWeek === totalWeeks || currentWeek >= maxAccessibleWeek}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="font-medium">Current: Week {maxAccessibleWeek} of {totalWeeks}</span>
            <span className="text-sm">{progressPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  This Week's Focus
                </CardTitle>
                <CardDescription>{weekProgram.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{weekProgram.explanation}</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Weekly Tasks
                  </h3>
                  <ul className="space-y-2">
                    {weekProgram.tasks.map((task, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handlePreviousWeek} 
                  disabled={currentWeek === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous Week
                </Button>
                <Button 
                  onClick={handleNextWeek} 
                  disabled={currentWeek === totalWeeks || currentWeek >= maxAccessibleWeek}
                  className="flex items-center gap-2"
                >
                  {currentWeek < maxAccessibleWeek ? (
                    <>
                      Next Week
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Locked
                      <LockIcon className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            {currentWeek === 1 && <WaterTracker recommendedAmount={3} />}
          </div>
          
          <div className="space-y-6">
            <DailyHabits currentWeek={currentWeek} />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Week {currentWeek} Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div 
                      key={i}
                      className="h-8 border rounded flex items-center justify-center text-xs bg-gray-50"
                    >
                      Day {i + 1}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-gray-500">Track your daily progress</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      {/* New Week Welcome Dialog */}
      <Dialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-center text-rightstep-green">
              Welcome to Week {currentWeek}!
            </DialogTitle>
            <DialogDescription className="text-center">
              You've unlocked a new week in your journey
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <h3 className="font-bold text-lg">{weekProgram.title}</h3>
            <p className="text-sm">{weekProgram.description}</p>
            <p>{weekProgram.explanation}</p>
          </div>
          <DialogFooter>
            <Button className="w-full bg-rightstep-green" onClick={() => setShowWelcomeDialog(false)}>
              Start Week {currentWeek}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyProgram;
