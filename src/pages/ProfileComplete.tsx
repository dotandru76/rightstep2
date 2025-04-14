import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // Ensure this is imported
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, InfoIcon, CheckCircle } from "lucide-react";
import RightFootIcon from "@/components/RightFootIcon"; // Assuming path is correct
import VoiceButton from "@/components/VoiceButton"; // Assuming path is correct

// --- Helper Functions and Components (Defined outside ProfileComplete) ---

// Helper: Get styling based on BMI category
const getBmiStyle = (category: string): { text: string; bg: string; border: string, iconColor: string } => {
  switch (category) {
    case "Underweight": return { text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", iconColor: "text-blue-500" };
    case "Normal weight": return { text: "text-green-700", bg: "bg-green-50", border: "border-green-200", iconColor: "text-green-500" };
    case "Overweight": return { text: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200", iconColor: "text-yellow-500" };
    case "Obesity": return { text: "text-red-700", bg: "bg-red-50", border: "border-red-200", iconColor: "text-red-500" };
    default: return { text: "text-gray-700", bg: "bg-gray-50", border: "border-gray-200", iconColor: "text-gray-500" };
  }
};

// Component: BMI Linear Scale
interface BmiLinearScaleProps {
  bmi: number;
  minBmi?: number;
  maxBmi?: number;
}
const BmiLinearScale: React.FC<BmiLinearScaleProps> = ({ bmi, minBmi = 15, maxBmi = 40 }) => {
  const totalRange = maxBmi - minBmi;
  const clampedBmi = Math.max(minBmi, Math.min(maxBmi, bmi));
  const markerPositionPercent = ((clampedBmi - minBmi) / totalRange) * 100;
  const categories = [
    { threshold: 18.5, color: 'bg-blue-400', label: 'Underweight' }, { threshold: 25, color: 'bg-green-400', label: 'Normal' },
    { threshold: 30, color: 'bg-yellow-400', label: 'Overweight' }, { threshold: maxBmi, color: 'bg-red-400', label: 'Obese' },
  ];
  let accumulatedWidth = 0;
  const segments = categories.map((cat, index) => {
    const prevThreshold = index === 0 ? minBmi : categories[index - 1].threshold;
    let width = ((cat.threshold - prevThreshold) / totalRange) * 100;
    if (index === categories.length - 1) { width = Math.max(0, 100 - accumulatedWidth); }
    accumulatedWidth += width;
    return { width: `${width}%`, color: cat.color, label: cat.label, start: prevThreshold, threshold: cat.threshold };
  });
  return (
    <div className="w-full px-2 sm:px-4 my-4">
      <div className="relative h-3 rounded-full bg-gray-200 flex overflow-hidden shadow-inner">
        {segments.map((seg, i) => <div key={i} className={`h-full ${seg.color}`} style={{ width: seg.width }} title={`${seg.label}: ${seg.start.toFixed(1)} - ${seg.threshold < maxBmi ? '<' + seg.threshold.toFixed(1) : '>=' + seg.start.toFixed(1)}`} />)}
        <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gray-800 border-2 border-white shadow-lg" style={{ left: `${markerPositionPercent}%`, transition: 'left 0.5s ease-out' }} title={`Your BMI: ${bmi.toFixed(1)}`} />
      </div>
      <div className="relative flex justify-between text-xs text-gray-500 mt-1.5 px-1 h-3">
        <span className="absolute" style={{ left: '0%', transform: 'translateX(0%)' }}>{minBmi}</span>
        {segments.map((seg, i) => {
          if (seg.threshold < maxBmi) {
            const pos = ((seg.threshold - minBmi) / totalRange) * 100;
            const prevPos = i === 0 ? 0 : ((segments[i - 1].threshold - minBmi) / totalRange) * 100;
            if (pos - prevPos < 8 && i > 0) return null;
            return <span key={seg.threshold} className="absolute" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>{seg.threshold.toFixed(0)}</span>;
          } return null;
        })}
        <span className="absolute" style={{ right: '0%', transform: 'translateX(0%)' }}>{maxBmi}</span>
      </div>
    </div>);
};

// *** BmiSvgFigure component and mapRange helper REMOVED ***

// --- Main ProfileComplete Component ---

const ProfileComplete = () => {
  console.log("ProfileComplete component rendering");

  const navigate = useNavigate(); // Hook for navigation
  const [userData, setUserData] = useState<any>(null); // State for user data
  const [isLoading, setIsLoading] = useState(true); // State for loading status

  // Effect Hook: Fetch user data on mount
  useEffect(() => {
    console.log("ProfileComplete useEffect running");
    let isMounted = true;
    try {
      const userDataString = localStorage.getItem("userData");
      console.log("UserData from localStorage:", userDataString);

      if (userDataString) {
        const parsedUserData = JSON.parse(userDataString);
        console.log("Parsed userData:", parsedUserData);
        if (isMounted) {
          setUserData(parsedUserData);
          // Ensure program start date is set
          const programStartDate = localStorage.getItem("programStartDate");
          if (!programStartDate) {
            const today = new Date().toISOString();
            localStorage.setItem("programStartDate", today);
            localStorage.setItem("lastSeenWeek", "1"); // Start at week 1
            console.log("Program start date set:", today);
          }
        }
      } else {
        console.log("No userData found, redirecting to register");
        if (isMounted) navigate("/register"); // Navigate if no data
      }
    } catch (error) {
      console.error("Error in ProfileComplete useEffect:", error);
       if (isMounted) navigate("/register"); // Navigate on error too
    } finally {
      if (isMounted) setIsLoading(false); // Stop loading
    }

    // Cleanup function
    return () => {
      isMounted = false;
      console.log("ProfileComplete component unmounting / useEffect cleanup");
      window.speechSynthesis?.cancel(); // Stop any ongoing speech
    };
  }, [navigate]); // Dependency: navigate function

  // Memoized Hook: Calculate results based on user data
  const results = useMemo(() => {
    if (!userData) return null; // Return null if no user data yet

    console.log("Calculating results");
    const weight = parseInt(userData.weight);
    const height = parseInt(userData.height);
    const gender = userData.sex; // Assuming 'male' or 'female'

    // Basic validation
    if (isNaN(weight) || isNaN(height) || height <= 0 || !gender) {
        console.error("Invalid user data for calculation:", userData);
        return { bmi: "N/A", bmiValue: 0, bmiCategory: "Error", idealWeight: 0, minIdealWeight: 0, maxIdealWeight: 0, currentWeight: 0, weightToChange: 0, shouldGain: false, motivationMessage: "Could not calculate plan due to invalid profile data.", journey: "", bmiStyle: getBmiStyle("Error"), gender: 'unknown' };
    }

    // Calculate BMI
    const bmiValue = weight / (height / 100) ** 2;
    let bmiCategory = "Unknown";
    if (bmiValue < 18.5) bmiCategory = "Underweight";
    else if (bmiValue < 25) bmiCategory = "Normal weight";
    else if (bmiValue < 30) bmiCategory = "Overweight";
    else bmiCategory = "Obesity";

    // Calculate Ideal Weight Range (BMI 18.5 - 24.9)
    const minIdealWeight = 18.5 * (height / 100) ** 2;
    const maxIdealWeight = 24.9 * (height / 100) ** 2;
    const idealWeight = (minIdealWeight + maxIdealWeight) / 2; // Midpoint
    const weightDifference = weight - idealWeight;

    // Generate Messages (12 Weeks)
    let motivationMessage = "";
    let journey = "";
    if (bmiCategory === "Underweight") {
      motivationMessage = "Your journey involves building strength and nourishing your body.";
      journey = "The next 12 weeks focus on healthy weight gain and sustainable energy levels.";
    } else if (bmiCategory === "Normal weight") {
      motivationMessage = "You're maintaining a healthy weight! Your focus is on optimizing wellbeing and vitality.";
      journey = "The next 12 weeks help fine-tune habits for continued health and energy.";
    } else { // Overweight or Obesity
      motivationMessage = `Your journey is about creating balance and enhancing your wellbeing, one step at a time.`;
      journey = "The next 12 weeks guide you toward sustainable habits for gradual progress to your ideal weight range.";
    }

    // Assemble results object
    const calculatedResults = {
      bmi: bmiValue.toFixed(1),
      bmiValue: bmiValue,
      bmiCategory,
      idealWeight: Math.round(idealWeight),
      minIdealWeight: Math.round(minIdealWeight),
      maxIdealWeight: Math.round(maxIdealWeight),
      currentWeight: weight,
      weightToChange: Math.abs(Math.round(weightDifference)),
      shouldGain: weightDifference < 0,
      motivationMessage,
      journey,
      bmiStyle: getBmiStyle(bmiCategory),
      gender: gender?.toLowerCase() || 'unknown', // Keep gender in results for now
    };
    console.log("Results calculated:", calculatedResults);
    return calculatedResults;

  }, [userData]); // Dependency: userData

  // --- Event Handlers ---

  const handleContinue = () => {
    console.log("Continue button clicked, navigating to dashboard");
    navigate("/"); // Navigate to home/dashboard
  };

  const handleReset = () => {
    // Confirmation dialog
    if (window.confirm("Are you sure you want to reset all application data and return to registration? This cannot be undone.")) {
      console.log("Resetting app data");
      window.speechSynthesis?.cancel(); // Stop speech
      localStorage.clear(); // Clear all local storage
      navigate("/register"); // Go back to registration
    }
  };

  const handlePlayWelcome = () => {
      if (!results || !userData) return; // Need data to speak
      console.log("Playing welcome message");
      // Construct the speech text (12 weeks)
      const text = `Hello ${userData.name}! Welcome to your personalized 12-week Leptine plan.
        Based on your profile, your BMI is ${results.bmi}, placing you in the ${results.bmiCategory} category.
        ${results.bmiCategory !== 'Normal weight' ? (results.shouldGain ? `Your goal involves gaining approximately ${results.weightToChange} kilograms towards your ideal weight of around ${results.idealWeight} kilograms.` : `Your goal involves losing approximately ${results.weightToChange} kilograms towards your ideal weight of around ${results.idealWeight} kilograms.`) : ''}
        ${results.motivationMessage}
        Over the next 12 weeks, you'll receive guidance adapted to your progress, helping you develop sustainable, lifelong habits.
        Remember, consistency beats perfection. Focus on progress, not perfection.
        Trust the process, follow the weekly guidance, and celebrate your achievements. We're excited to support you. Let's take the right step!`;

      window.speechSynthesis?.cancel(); // Stop previous speech
      const utterance = new SpeechSynthesisUtterance(text.replace(/\s+/g, ' ').trim()); // Clean up text
      // Voice selection logic (same as before)
      const voices = window.speechSynthesis?.getVoices();
      const femaleVoices = voices?.filter(v => v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('female') || v.name.includes('Samantha') || v.name.includes('Google UK English Female') || v.name.includes('Microsoft Zira') || v.name.includes('Victoria')));
      if (femaleVoices && femaleVoices.length > 0) { utterance.voice = femaleVoices[0]; }
      else { const englishVoice = voices?.find(v => v.lang.startsWith('en')); if (englishVoice) utterance.voice = englishVoice; }
      utterance.rate = 0.95; utterance.pitch = 1.1; utterance.volume = 1;
      window.speechSynthesis?.speak(utterance); // Speak!
  };


  // --- Render Logic ---

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-rightstep-gradient flex items-center justify-center p-4">
        <div className="text-white text-xl animate-pulse">Loading Profile...</div>
      </div>
    );
  }

  // Error/No Data State (if results are null after loading)
  if (!userData || !results) {
    return (
      <div className="min-h-screen bg-rightstep-gradient flex flex-col items-center justify-center gap-6 p-4 text-center">
        <RightFootIcon className="h-20 w-20 text-white opacity-75" />
        <div className="text-white text-xl font-semibold">Profile Data Issue</div>
        <p className="text-white opacity-90">We couldn't load or calculate your profile data. Please try registering again.</p>
        <Button onClick={() => navigate("/register")} variant="secondary" size="lg">
          Go to Registration
        </Button>
      </div>
    );
  }

   // Determine button text based on BMI category
   const journeyButtonText = results.bmiCategory === 'Normal weight'
    ? "Start My Health Plan"
    : "Start My 12-Week Journey";

   console.log("Rendering profile complete UI without figure");

  // Main Content Render
  return (
    <div className="min-h-screen bg-rightstep-gradient flex items-center justify-center px-4 py-12">
      <Card className="max-w-lg w-full shadow-xl border-0 overflow-hidden">
        {/* Card Header */}
        <CardHeader className="text-center space-y-3 relative pb-4 bg-gradient-to-b from-gray-50 to-white">
          {/* Trainer Button */}
          <div className="absolute top-4 right-4 z-10">
             <div className="flex flex-col items-center group">
               <button onClick={handlePlayWelcome} className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-white hover:scale-105 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rightstep-green focus:ring-offset-2" aria-label="Listen to overview">
                 <img src="/lovable-uploads/trainer.png" alt="Trainer" className="w-full h-full object-cover" onError={(e) => { const t = e.target as HTMLImageElement; t.onerror = null; t.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e2e8f0'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='12' fill='%2364748b' text-anchor='middle'%3EImg%3C/text%3E%3Ctext x='50' y='70' font-family='Arial' font-size='12' fill='%2364748b' text-anchor='middle'%3ENot Found%3C/text%3E%3C/svg%3E"; }} />
               </button>
               <span className="text-xs text-center mt-1.5 text-white font-medium bg-rightstep-green px-2.5 py-1 rounded-full shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">Press Me!</span>
             </div>
           </div>
           {/* Header Text */}
          <div className="mx-auto flex items-center justify-center pt-4"><RightFootIcon className="h-20 w-20 text-rightstep-green drop-shadow" size={80} /></div>
          <CardTitle className="text-3xl font-bold text-rightstep-green">Your Journey Begins Now!</CardTitle>
          <CardDescription className="text-base text-gray-600 max-w-md mx-auto">We've created a personalized <span className="font-semibold">12-week</span> plan based on your profile.</CardDescription>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="space-y-6 p-6 bg-white">
          {/* BMI Section */}
          <div className={`rounded-lg border ${results.bmiStyle.border} ${results.bmiStyle.bg} p-5 shadow-sm`}>
             <div className="flex items-center gap-3 mb-2"> {/* Reduced mb slightly */}
                <Activity className={`h-6 w-6 ${results.bmiStyle.iconColor} flex-shrink-0`} />
                <h3 className="text-xl font-semibold text-gray-800">Body Mass Index (BMI)</h3>
             </div>

             {/* *** SVG FIGURE REMOVED *** */}

             {/* BMI Value & Category */}
             <div className="text-center my-4"> {/* Added margin top/bottom */}
                 <p className="text-4xl font-bold text-gray-800">{results.bmi}</p>
                 <p className={`text-lg font-semibold ${results.bmiStyle.text}`}>{results.bmiCategory}</p>
             </div>

             {/* Linear Scale */}
             <BmiLinearScale bmi={results.bmiValue} />

             {/* Weight Goal Info Box */}
             <div className={`mt-6 ${results.bmiStyle.bg} border ${results.bmiStyle.border} p-4 rounded-md`}>
                <div className="flex items-start gap-3">
                    {results.bmiCategory === 'Normal weight' ? <CheckCircle className={`h-5 w-5 ${results.bmiStyle.iconColor} mt-0.5 flex-shrink-0`} aria-hidden="true" /> : <InfoIcon className={`h-5 w-5 ${results.bmiStyle.iconColor} mt-0.5 flex-shrink-0`} aria-hidden="true" />}
                    <div>
                        <p className={`font-medium ${results.bmiStyle.text}`}>Ideal Weight Range: {results.minIdealWeight} - {results.maxIdealWeight} kg <span className="text-xs font-normal">(approx. for your height)</span></p>
                        <p className={`mt-1 text-sm ${results.bmiStyle.text}`}>
                            {results.bmiCategory === 'Normal weight' ? `You're currently within a healthy weight range at ${results.currentWeight} kg.` : (results.shouldGain ? `Your goal involves gaining ~${results.weightToChange} kg towards this range (~${results.idealWeight} kg).` : `Your goal involves losing ~${results.weightToChange} kg towards this range (~${results.idealWeight} kg).`)}
                        </p>
                    </div>
                </div>
             </div>
          </div>
          {/* End BMI Section */}

          {/* Motivation Section */}
           <div className="rounded-lg bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Your 12-Week Journey</h3>
              <p className="text-gray-700 mb-3">{results.motivationMessage}</p>
              <p className="text-gray-700">{results.journey}</p>
              <div className="mt-5 bg-white p-4 rounded-md border border-indigo-100 shadow-inner">
                  <p className="text-gray-800 font-medium mb-2">Your plan includes:</p>
                  <ul className="space-y-1.5 list-disc list-inside text-gray-700 text-sm pl-1">
                    <li>Weekly personalized guidance & tips</li>
                    <li>Focus on sustainable habit formation</li>
                    <li>Progress tracking & plan adjustments</li>
                    <li>Support tailored to your health journey</li>
                  </ul>
              </div>
           </div>
        </CardContent>

        {/* Card Footer */}
        <CardFooter className="flex-col space-y-4 p-6 bg-gray-50 border-t">
           <Button onClick={handleContinue} className="w-full bg-rightstep-green hover:bg-rightstep-green-dark py-3 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200">
             {journeyButtonText}
             <ArrowRight className="ml-2 h-5 w-5" />
           </Button>
           <Button onClick={handleReset} variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 hover:border-red-400 transition-colors">
             Reset App Data & Restart
           </Button>
           <p className="text-xs text-gray-500 text-center pt-2">
             Remember: Consistency over perfection. Small, steady steps lead to lasting change.
           </p>
         </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileComplete; // Export the component