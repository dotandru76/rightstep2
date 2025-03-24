
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Import the default exports correctly
import NameStep from "@/components/register/NameStep";
import GenderStep from "@/components/register/GenderStep";
import MeasurementsStep from "@/components/register/MeasurementsStep";
import SummaryStep from "@/components/register/SummaryStep";
import ProgressIndicator from "@/components/ProgressIndicator";

const registerFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num > 0 && num < 120;
  }, {
    message: "Age must be a valid number between 1 and 119.",
  }),
  sex: z.enum(['male', 'female', 'other'], {
    required_error: "You need to select a gender.",
  }),
  weight: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num > 0 && num < 500;
  }, {
    message: "Weight must be a valid number between 1 and 499.",
  }),
  height: z.string().refine((value) => {
    const num = Number(value);
    return !isNaN(num) && num > 0 && num < 300;
  }, {
    message: "Height must be a valid number between 1 and 299.",
  }),
});

const steps = [
  { id: 1, label: 'Name' },
  { id: 2, label: 'Gender' },
  { id: 3, label: 'Measurements' },
  { id: 4, label: 'Summary' },
];

type RegisterFormValues = z.infer<typeof registerFormSchema>;

const Register: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      age: "",
      sex: "male",
      weight: "",
      height: "",
    },
    mode: "onChange",
  });

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNextStep = () => {
    // Get the current step's field names to validate
    const fieldsToValidate = [];
    if (currentStep === 0) fieldsToValidate.push("name");
    if (currentStep === 1) fieldsToValidate.push("sex", "age");
    if (currentStep === 2) fieldsToValidate.push("weight", "height");

    // Validate the current step's fields
    form.trigger(fieldsToValidate).then((isValid) => {
      if (isValid && currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    });
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: RegisterFormValues) => {
    localStorage.setItem("userData", JSON.stringify(data));
    localStorage.setItem("programStartDate", new Date().toISOString());
    localStorage.setItem("lastSeenWeek", "1");
    toast({
      title: "Registration complete.",
      description: "You will be redirected to the dashboard.",
    });
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-rightstep-vertical-gradient">
      <Card className="w-full max-w-md bg-transparent border-none shadow-none rounded-lg overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {currentStep === 0 && <NameStep form={form} />}
            {currentStep === 1 && <GenderStep form={form} />}
            {currentStep === 2 && <MeasurementsStep form={form} />}
            {currentStep === 3 && <SummaryStep form={form} />}
            <CardFooter className={`flex justify-between items-center p-4 ${isFirstStep ? 'flex-col' : 'bg-transparent border-t border-white/20'}`}>
              {isFirstStep ? (
                <>
                  <Button 
                    type="button"
                    onClick={handleNextStep}
                    className="w-full bg-rightstep-green hover:bg-rightstep-green-dark text-white font-bold py-3 rounded-full text-lg"
                  >
                    Get Started
                  </Button>
                  <p className="text-white text-sm mt-2">Your data is stored locally on your device</p>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handlePrevStep}
                    disabled={isFirstStep}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    type={isLastStep ? "submit" : "button"}
                    onClick={isLastStep ? undefined : handleNextStep}
                  >
                    {isLastStep ? "Complete" : "Next"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
      <ProgressIndicator activeStep={currentStep} totalDots={steps.length} />
      <Toaster />
    </div>
  );
};

export default Register;
