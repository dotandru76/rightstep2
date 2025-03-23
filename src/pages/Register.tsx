
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
  UserCircle2,
  UserRound,
  ChevronLeft
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";

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
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/f93be550-c758-4f2c-8ceb-2cbe62468624.png" 
                alt="Friendly Coach" 
                className="h-40"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-600">Welcome to Water Balance!</CardTitle>
            <CardDescription>
              Let's set up your profile to personalize your hydration journey.
              First, what should we call you?
            </CardDescription>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" /> Your Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
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
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/f93be550-c758-4f2c-8ceb-2cbe62468624.png" 
                alt="Friendly Coach" 
                className="h-40"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-600">Hi, {form.getValues().name}!</CardTitle>
            <CardDescription>
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
                          <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
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
                          <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
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
                          <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
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
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/f93be550-c758-4f2c-8ceb-2cbe62468624.png" 
                alt="Friendly Coach" 
                className="h-40"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-600">Almost there!</CardTitle>
            <CardDescription>
              Let's finish up with some measurements to personalize your hydration needs.
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
            <div className="flex justify-center mb-4">
              {form.getValues().sex === "female" ? (
                <img 
                  src="/lovable-uploads/a5b0210c-5524-436c-a9b0-b67703855063.png" 
                  alt="Female Character" 
                  className="h-40"
                />
              ) : (
                <img 
                  src="/lovable-uploads/c20310f9-a5a7-4777-975a-39c4fa202879.png" 
                  alt="Male Character" 
                  className="h-40"
                />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-blue-600">Review Your Profile</CardTitle>
            <CardDescription>
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
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Form {...form}>
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mb-4">
              <Progress value={(step / totalSteps) * 100} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Step {step} of {totalSteps}</p>
            </div>
            {getCurrentStepContent()}
          </CardHeader>
          <CardFooter className="flex flex-col gap-3">
            <div className="flex w-full gap-2">
              {step > 1 && (
                <Button variant="outline" onClick={goToPreviousStep} className="flex-1">
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              )}
              <Button onClick={goToNextStep} className={`${step === 1 ? 'w-full' : 'flex-1'}`}>
                {step < totalSteps ? 'Next' : 'Complete Profile'} 
                {step < totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Your data is stored locally on your device
            </p>
          </CardFooter>
        </Card>
      </Form>
    </div>
  );
};

export default Register;
