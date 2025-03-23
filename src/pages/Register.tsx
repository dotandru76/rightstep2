
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";

// Import step components
import NameStep from "@/components/register/NameStep";
import GenderStep from "@/components/register/GenderStep";
import MeasurementsStep from "@/components/register/MeasurementsStep";
import SummaryStep from "@/components/register/SummaryStep";
import ProgressIndicator from "@/components/ProgressIndicator";
import { getFieldsForStep, TOTAL_STEPS } from "@/utils/registerSteps";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.string().refine((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num > 0 && num < 120;
  }, {
    message: "Please enter a valid age between 1-120.",
  }),
  sex: z.enum(["male", "female", "other"], {
    required_error: "Please select your sex.",
  }),
  weight: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0 && num < 500;
  }, {
    message: "Please enter a valid weight (20-500 kg/lbs).",
  }),
  height: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0 && num < 300;
  }, {
    message: "Please enter a valid height (50-300 cm).",
  }),
});

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const isMobile = useIsMobile();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      sex: undefined,
      weight: "",
      height: "",
    },
    mode: "onChange"
  });

  const goToNextStep = async () => {
    const fields = getFieldsForStep(step);
    const isValid = await validateStepFields(fields);
    
    if (isValid) {
      if (step < TOTAL_STEPS) {
        setStep(step + 1);
        window.scrollTo(0, 0);
      } else {
        onSubmit(form.getValues());
      }
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const validateStepFields = async (fields: string[]) => {
    const result = await form.trigger(fields as any);
    return result;
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    localStorage.setItem("userData", JSON.stringify(values));
    toast.success("Profile created successfully!");
    navigate("/profile-complete");
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <NameStep form={form} />;
      case 2:
        return <GenderStep form={form} />;
      case 3:
        return <MeasurementsStep form={form} />;
      case 4:
        return <SummaryStep form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-rightstep-vertical-gradient py-4 md:py-8">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-md">
        <Form {...form}>
          <Card className={cn(
            "w-full shadow-lg border-0",
            "bg-transparent shadow-none"
          )}>
            <CardHeader className="text-center px-4 md:px-6 py-4 md:py-6">
              {renderStepContent()}
            </CardHeader>
            <CardFooter className="flex flex-col gap-3 pb-6">
              <div className="flex w-full gap-2">
                {step > 1 && (
                  <Button 
                    variant="outline" 
                    onClick={goToPreviousStep} 
                    className="flex-1 border-white/30 text-white hover:bg-white/10"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                )}
                <Button 
                  onClick={goToNextStep} 
                  className={`${step === 1 ? 'w-full' : 'flex-1'} bg-rightstep-green hover:bg-rightstep-green-dark rounded-full py-5 md:py-6`}
                >
                  {step === 1 ? 'Get Started' : (step < TOTAL_STEPS ? 'Next Step' : 'Complete')}
                  {step !== 1 && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-center text-white/70">
                Your data is stored locally on your device
              </p>
            </CardFooter>
          </Card>
        </Form>
      </div>
      <ProgressIndicator activeStep={0} />
    </div>
  );
};

export default Register;
