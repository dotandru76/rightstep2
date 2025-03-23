
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { 
  User, 
  Weight, 
  Ruler, 
  CalendarDays, 
  ArrowRight,
  ChevronLeft
} from "lucide-react";
import RightFootIcon from "@/components/RightFootIcon";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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
  const totalSteps = 4;
  
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
      if (step < totalSteps) {
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

  const getFieldsForStep = (currentStep: number) => {
    switch (currentStep) {
      case 1: return ["name"];
      case 2: return ["age", "sex"];
      case 3: return ["weight", "height"];
      case 4: return []; // Review step, no fields to validate
      default: return [];
    }
  };

  const validateStepFields = async (fields: string[]) => {
    const result = await form.trigger(fields as any);
    return result;
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Store user data in localStorage
    localStorage.setItem("userData", JSON.stringify(values));
    
    // Show success message
    toast.success("Profile created successfully!");
    
    // Navigate to profile completion page
    navigate("/profile-complete");
  }

  const getCurrentStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="flex flex-col items-center space-y-8 my-12">
              <div className="flex flex-col items-center">
                <RightFootIcon className="h-24 w-24 text-white mb-2" size={96} />
                <h1 className="text-3xl font-bold text-white">RightStep</h1>
              </div>
              <div className="text-center space-y-2">
                <p className="text-white/80 italic">Werres ac deet Dit by trenfœs</p>
                <div className="inline-block rounded-full bg-white/20 px-4 py-1 text-white my-4 backdrop-blur-sm">
                  #CCAF099
                </div>
              </div>
            </div>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-white">
                      <User className="h-4 w-4" /> Your Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} className="bg-white/10 border-white/20 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </>
        );
      case 2:
        return (
          <>
            <div className="flex justify-center mb-6">
              <RightFootIcon className="h-14 w-14 text-rightstep-green" size={56} />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-rightstep-green">Hi, {form.getValues().name}!</CardTitle>
            <CardDescription className="text-center mb-4">
              Let's get to know you better to customize your plan.
            </CardDescription>
            <CardContent className="pt-6 space-y-6">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" /> Your Age
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Your age" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Biological Sex</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-2"
                      >
                        <FormItem className="flex-1">
                          <FormControl>
                            <RadioGroupItem value="male" className="peer sr-only" />
                          </FormControl>
                          <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-rightstep-green [&:has([data-state=checked])]:border-rightstep-green">
                            <img 
                              src="/lovable-uploads/c20310f9-a5a7-4777-975a-39c4fa202879.png" 
                              alt="Male" 
                              className="mb-3 h-32" 
                            />
                            Male
                          </FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex-1">
                          <FormControl>
                            <RadioGroupItem value="female" className="peer sr-only" />
                          </FormControl>
                          <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-rightstep-green [&:has([data-state=checked])]:border-rightstep-green">
                            <img 
                              src="/lovable-uploads/a5b0210c-5524-436c-a9b0-b67703855063.png" 
                              alt="Female" 
                              className="mb-3 h-32" 
                            />
                            Female
                          </FormLabel>
                        </FormItem>
                        
                        <FormItem className="flex-1">
                          <FormControl>
                            <RadioGroupItem value="other" className="peer sr-only" />
                          </FormControl>
                          <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-rightstep-green [&:has([data-state=checked])]:border-rightstep-green">
                            <User className="mb-3 h-6 w-6 text-purple-500" />
                            Other
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </>
        );
      case 3:
        return (
          <>
            <div className="flex justify-center mb-6">
              <RightFootIcon className="h-14 w-14 text-rightstep-green" size={56} />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-rightstep-green">Almost there!</CardTitle>
            <CardDescription className="text-center mb-4">
              Let's finish up with some measurements to personalize your journey.
            </CardDescription>
            <CardContent className="pt-6 space-y-6">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Weight className="h-4 w-4" /> Weight (kg)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Your weight" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" /> Height (cm)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Your height" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </>
        );
      case 4:
        return (
          <>
            <div className="flex justify-center mb-6">
              <RightFootIcon className="h-14 w-14 text-rightstep-green" size={56} />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-rightstep-green">Ready to Start Your Journey</CardTitle>
            <CardDescription className="text-center mb-4">
              Here's a summary of your information. Everything looks good?
            </CardDescription>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="border rounded-md p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{form.getValues().name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="font-medium">{form.getValues().age} years</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Sex</p>
                      <p className="font-medium capitalize">{form.getValues().sex}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-medium">{form.getValues().weight} kg</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Height</p>
                      <p className="font-medium">{form.getValues().height} cm</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-rightstep-vertical-gradient py-8">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Form {...form}>
          <Card className={cn(
            "w-full shadow-lg border-0",
            step === 1 ? "bg-transparent shadow-none" : "bg-white"
          )}>
            <CardHeader className={cn(
              "text-center",
              step === 1 ? "text-white" : ""
            )}>
              <div className="mb-4">
                <Progress value={(step / totalSteps) * 100} className="h-2 bg-gray-200" />
                <p className={cn(
                  "text-xs mt-1",
                  step === 1 ? "text-white/70" : "text-gray-500"
                )}>Step {step} of {totalSteps}</p>
              </div>
              {getCurrentStepContent()}
            </CardHeader>
            <CardFooter className="flex flex-col gap-3">
              <div className="flex w-full gap-2">
                {step > 1 && (
                  <Button variant="outline" onClick={goToPreviousStep} className="flex-1 border-gray-300">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                )}
                <Button onClick={goToNextStep} className={`${step === 1 ? 'w-full' : 'flex-1'} bg-rightstep-green hover:bg-rightstep-green-dark`}>
                  {step < totalSteps ? 'Next Step' : 'Get Started'} 
                  {step < totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
              <p className={cn(
                "text-xs text-center",
                step === 1 ? "text-white/70" : "text-gray-500"
              )}>
                Your data is stored locally on your device
              </p>
            </CardFooter>
          </Card>
        </Form>
      </div>
      <div className="fixed bottom-8 left-0 right-0 flex justify-center">
        <div className="flex gap-1">
          {[...Array(7)].map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-2 w-2 rounded-full",
                i === 0 ? "bg-white" : "bg-white/50"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Register;
