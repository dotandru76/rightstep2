import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Import the step components
import NameStep from "@/components/register/NameStep";
import GenderStep from "@/components/register/GenderStep";
import MeasurementsStep from "@/components/register/MeasurementsStep";
import SummaryStep from "@/components/register/SummaryStep";
import ProgressIndicator from "@/components/ProgressIndicator";
// **MODIFIED:** Import from data file (ensure path is correct)
// import { TOTAL_PROGRAM_WEEKS } from '@/data/weeklyProgramData';

// Updated schema to use z.number() and appropriate ranges
const registerFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.number({ required_error: "Age is required.", invalid_type_error: "Age must be a number." })
         .min(18, { message: "Must be 18 or older." })
         .max(100, { message: "Age must be 100 or less."}),
  sex: z.enum(['male', 'female', 'other'], { required_error: "You need to select a gender." }),
  weight: z.number({ required_error: "Weight is required.", invalid_type_error: "Weight must be a number." })
            .min(30, { message: "Weight must be at least 30 kg." })
            .max(200, { message: "Weight must be 200 kg or less." }),
  height: z.number({ required_error: "Height is required.", invalid_type_error: "Height must be a number." })
            .min(120, { message: "Height must be at least 120 cm." })
            .max(230, { message: "Height must be 230 cm or less." }),
});

// Define the steps for the progress indicator
const steps = [ { id: 1, label: 'Name' }, { id: 2, label: 'Gender' }, { id: 3, label: 'Measurements' }, { id: 4, label: 'Summary' }, ];
const TOTAL_STEPS = steps.length;

// Infer the form values type from the schema
type RegisterFormValues = z.infer<typeof registerFormSchema>;

// Register component definition
const Register: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize react-hook-form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { name: "", age: 30, sex: undefined, weight: 70, height: 170, },
    mode: "onChange",
  });

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  // Function to handle moving to the next step
  const handleNextStep = async () => {
    const fieldsPerStep: (keyof RegisterFormValues)[][] = [ ["name"], ["sex"], ["age", "weight", "height"], [] ];
    const fieldsToValidate = fieldsPerStep[currentStep];
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid && currentStep < steps.length - 1) { setCurrentStep(currentStep + 1); }
    else if (!isValid) { console.log("Validation Errors:", form.formState.errors); toast({ title: "Please fix the errors", description: "Check the fields marked in red.", variant: "destructive" }); }
  };

  // Function to handle moving to the previous step
  const handlePrevStep = () => { if (currentStep > 0) { setCurrentStep(currentStep - 1); } };

  // Function to handle final form submission
  const onSubmit = (data: RegisterFormValues) => {
    console.log("Form Submitted:", data);
    const dataToSave = { ...data, age: Number(data.age), weight: Number(data.weight), height: Number(data.height) };
    localStorage.setItem("userData", JSON.stringify(dataToSave));
    localStorage.setItem("programStartDate", new Date().toISOString());
    localStorage.setItem("lastSeenWeek", "1");
    toast({ title: "Registration complete!", description: "Your profile has been saved.", variant: "default" });
    
    // Fixed navigation - removed setTimeout and replace:true option
    navigate("/profile-complete");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-rightstep-vertical-gradient p-4">
      {/* Card container with responsive max-width */}
      <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-transparent border-none shadow-none rounded-lg overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
            {/* Render the current step component */}
            {currentStep === 0 && <NameStep form={form} />}
            {currentStep === 1 && <GenderStep form={form} />}
            {currentStep === 2 && <MeasurementsStep form={form} />}
            {currentStep === 3 && <SummaryStep form={form} />}
            {/* Footer with navigation buttons */}
            <CardFooter className={`flex ${isFirstStep ? 'flex-col mt-6' : 'justify-between items-center p-4 md:p-6 mt-4 bg-transparent border-t border-white/20'}`}>
              {isFirstStep ? ( <> <Button type="button" onClick={handleNextStep} className="w-full bg-rightstep-green-darker hover:bg-rightstep-green-dark text-white font-bold py-3 rounded-full text-lg shadow-lg transform transition-transform hover:scale-105"> Get Started </Button> <p className="text-white/80 text-xs mt-3 text-center">Your data is stored locally on this device</p> </> ) : ( <> <Button type="button" variant="secondary" onClick={handlePrevStep} disabled={isFirstStep} className="bg-white/20 hover:bg-white/30 text-white"> <ChevronLeft className="w-4 h-4 mr-2" /> Previous </Button> <Button type={isLastStep ? "submit" : "button"} onClick={isLastStep ? undefined : handleNextStep} className="bg-rightstep-green hover:bg-rightstep-green-light text-white"> {isLastStep ? "Complete" : "Next"} <ChevronRight className="w-4 h-4 ml-2" /> </Button> </> )}
            </CardFooter>
          </form>
        </Form>
      </Card>
      {/* Progress Indicator below the card */}
      <ProgressIndicator activeStep={currentStep} totalDots={TOTAL_STEPS} className="mt-6" />
      <Toaster />
    </div>
  );
};
export default Register;