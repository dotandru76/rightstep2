
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WaterTracker from "@/components/WaterTracker";
import DailyHabits from "@/components/DailyHabits";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Settings, ArrowRight, CheckCircle2 } from "lucide-react";
import RightFootIcon from "@/components/RightFootIcon";
import { useProgram } from "@/contexts/ProgramContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Weekly themes for quick reference
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
  
  const totalWeeks = 13;
  const progressPercentage = (maxAccessibleWeek / totalWeeks) * 100;

  const currentWeekData = weeklyProgram.find(program => program.week === maxAccessibleWeek) || weeklyProgram[0];

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
        <Card className="shadow-md mb-6 border-t-4 border-t-rightstep-green">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-rightstep-green">Leptin Program</CardTitle>
                <CardDescription>
                  Week {maxAccessibleWeek} of {totalWeeks}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between mb-1">
                <span className="font-medium">Overall Progress</span>
                <span className="text-sm">{progressPercentage.toFixed(0)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{currentWeekData.title}</h3>
                    <p className="text-sm text-gray-600">{currentWeekData.description}</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-rightstep-green hover:bg-rightstep-green-dark"
                    onClick={() => setShowWeekDetails(true)}
                  >
                    Details
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WaterTracker recommendedAmount={parseFloat(recommendedWater)} />
          <DailyHabits currentWeek={maxAccessibleWeek} />
        </div>
      </main>

      {/* Week Details Dialog */}
      <Dialog open={showWeekDetails} onOpenChange={setShowWeekDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-rightstep-green">
              Week {maxAccessibleWeek}: {currentWeekData.title}
            </DialogTitle>
            <DialogDescription>
              {currentWeekData.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            <p className="text-gray-700">{currentWeekData.explanation}</p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-700 mb-2">Weekly Tasks</h3>
              <ul className="space-y-2">
                {currentWeekData.tasks.map((task, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button className="w-full bg-rightstep-green" onClick={() => setShowWeekDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
