import React from "react";
import { CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import RightFootIcon from "@/components/RightFootIcon";
import { useIsMobile } from "@/hooks/use-mobile";
import { UseFormReturn } from "react-hook-form";

interface SummaryStepProps {
  form: UseFormReturn<any>;
}

const calculateBMI = (weight: number, height: number) => {
  // Safety check for division by zero
  if (!height || height <= 0) return 0;
  return weight / ((height / 100) ** 2);
};

const calculateBMR = (gender: string, weight: number, height: number, age: number) => {
  // Safety checks
  if (!weight || !height || !age) return 0;
  
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (gender === "female") {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 78; // Average for "other"
  }
};

const calculateCaloricNeeds = (bmr: number, activityLevel: string) => {
  const activityFactors: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };
  return bmr * (activityFactors[activityLevel] || 1.2);
};

const generatePlan = (gender: string, age: number, height: number, weight: number) => {
  try {
    // Safety check for invalid inputs
    if (!height || !weight || height <= 0 || weight <= 0 || !age || age <= 0) {
      console.error("Invalid inputs for plan generation:", { gender, age, height, weight });
      return {
        bmi: "0.00",
        bmiCategory: "Unknown",
        bmr: "0.00",
        caloricNeeds: "0.00",
        plan: "Please provide valid measurements to get personalized recommendations."
      };
    }
    
    const bmi = calculateBMI(weight, height);
    const bmr = calculateBMR(gender, weight, height, age);
    const caloricNeeds = calculateCaloricNeeds(bmr, "moderate"); // Default activity level: moderate

    let bmiCategory = "";
    if (bmi < 18.5) bmiCategory = "Underweight";
    else if (bmi < 24.9) bmiCategory = "Normal weight";
    else if (bmi < 29.9) bmiCategory = "Overweight";
    else bmiCategory = "Obesity";

    let plan = "";
    if (bmiCategory === "Underweight") {
      plan = "Increase caloric intake and focus on strength training.";
    } else if (bmiCategory === "Normal weight") {
      plan = "Maintain your current caloric intake and stay active.";
    } else if (bmiCategory === "Overweight" || bmiCategory === "Obesity") {
      plan = "Reduce caloric intake and focus on cardio and strength training.";
    }

    return {
      bmi: bmi.toFixed(2),
      bmiCategory,
      bmr: bmr.toFixed(2),
      caloricNeeds: caloricNeeds.toFixed(2),
      plan,
    };
  } catch (error) {
    console.error("Error generating plan:", error);
    return {
      bmi: "0.00",
      bmiCategory: "Error",
      bmr: "0.00",
      caloricNeeds: "0.00",
      plan: "An error occurred while generating your plan. Please try again."
    };
  }
};

const SummaryStep: React.FC<SummaryStepProps> = ({ form }) => {
  const isMobile = useIsMobile();

  // Safely get form values with fallbacks
  const getFormValue = (field: string, defaultValue: any = "") => {
    try {
      const value = form.getValues(field);
      return value !== undefined && value !== null ? value : defaultValue;
    } catch (error) {
      console.error(`Error getting form value for ${field}:`, error);
      return defaultValue;
    }
  };

  const userData = {
    gender: getFormValue("sex", "other"),
    age: parseInt(getFormValue("age", "0"), 10),
    height: parseInt(getFormValue("height", "0"), 10),
    weight: parseInt(getFormValue("weight", "0"), 10),
  };

  console.log("User data for calculations:", userData);
  
  const results = generatePlan(userData.gender, userData.age, userData.height, userData.weight);

  return (
    <>
      <div className="flex justify-center mb-4 md:mb-6">
        <RightFootIcon className="h-16 w-16 md:h-20 md:w-20 text-rightstep-green" size={isMobile ? 64 : 80} />
      </div>
      <CardTitle className="text-xl md:text-2xl font-bold text-center text-rightstep-green">
        Ready to Start Your Journey
      </CardTitle>
      <CardDescription className="text-center mb-3 md:mb-4">
        Here's a summary of your information. Everything looks good?
      </CardDescription>
      <CardContent className="pt-4 md:pt-6">
        <div className="space-y-4">
          <div className="border rounded-md p-3 md:p-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-1">
                <p className="text-sm text-yellow-600 font-medium">Name</p>
                <p className="font-medium">{getFormValue("name", "")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-yellow-600 font-medium">Gender</p>
                <p className="font-medium capitalize">{getFormValue("sex", "")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-yellow-600 font-medium">Age</p>
                <p className="font-medium">{getFormValue("age", "")} years</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-yellow-600 font-medium">Weight</p>
                <p className="font-medium">{getFormValue("weight", "")} kg</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-yellow-600 font-medium">Height</p>
                <p className="font-medium">{getFormValue("height", "")} cm</p>
              </div>
            </div>
          </div>

          {/* Display Calculated Results */}
          <div className="border rounded-md p-3 md:p-4 bg-gray-50">
            <h3 className="text-lg font-bold text-rightstep-green mb-2">Your Plan</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">BMI:</span> {results.bmi} ({results.bmiCategory})
              </p>
              <p>
                <span className="font-medium">BMR:</span> {results.bmr} kcal/day
              </p>
              <p>
                <span className="font-medium">Caloric Needs:</span> {results.caloricNeeds} kcal/day
              </p>
              <p>
                <span className="font-medium">Plan:</span> {results.plan}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default SummaryStep;