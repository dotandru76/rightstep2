
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Weight, Ruler, CalendarDays } from "lucide-react";
import RightFootIcon from "@/components/RightFootIcon";
import { useIsMobile } from "@/hooks/use-mobile";
import { UseFormReturn } from "react-hook-form";

interface MeasurementsStepProps {
  form: UseFormReturn<any>;
}

const MeasurementsStep: React.FC<MeasurementsStepProps> = ({ form }) => {
  const isMobile = useIsMobile();

  return (
    <>
      <div className="flex justify-center mb-4 md:mb-6">
        <RightFootIcon className="h-16 w-16 md:h-20 md:w-20 text-rightstep-green" size={isMobile ? 64 : 80} />
      </div>
      <CardTitle className="text-xl md:text-2xl font-bold text-center text-rightstep-green">Almost there!</CardTitle>
      <CardDescription className="text-center mb-3 md:mb-4">
        Let's finish up with some measurements to personalize your journey.
      </CardDescription>
      <CardContent className="pt-4 md:pt-6 space-y-5 md:space-y-6">
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
};

export default MeasurementsStep;
