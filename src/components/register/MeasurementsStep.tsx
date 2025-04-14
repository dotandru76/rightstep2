import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Weight, Ruler, CalendarDays } from "lucide-react";
import RightFootIcon from "@/components/RightFootIcon";
import { useIsMobile } from "@/hooks/use-mobile";
import { UseFormReturn, FieldValues, FieldPath } from "react-hook-form";
// Removed Tone.js import

interface MeasurementsStepProps {
  form: UseFormReturn<any>;
}

const MeasurementsStep: React.FC<MeasurementsStepProps> = ({ form }) => {
  const isMobile = useIsMobile();
  // Final logo size for this step
  const logoSize = isMobile ? 240 : 320;

  // Handles onChange event for numeric inputs
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>, field: ReturnType<typeof form.register>) => {
    const value = e.target.value;
    if (value === '' || /^\d*$/.test(value)) {
       e.target.value = value;
       field.onChange(value === '' ? '' : Number(value));
    } else {
       e.target.value = String(field.value || '');
    }
  };

  return (
    <>
      {/* Header Section - Compact Layout */}
      <div className="flex justify-center mb-3 md:mb-4">
        {/* Logo with updated size */}
        <RightFootIcon className="h-60 w-60 md:h-80 md:w-80 text-white" size={logoSize} color="white"/>
      </div>
      <CardTitle className="text-xl md:text-2xl font-bold text-center text-white"> Almost there! </CardTitle>
      <CardDescription className="text-center text-white/90 mb-4 md:mb-5 px-4"> Let's finish up with some measurements to personalize your journey. </CardDescription>

      {/* Form Fields Section - Reverted to Inputs, sound removed */}
      <CardContent className="pt-4 md:pt-5 space-y-4 md:space-y-5">
        {/* Age Field */}
        <FormField control={form.control} name="age" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-white mb-1"> <CalendarDays className="h-4 w-4 text-white/80" /> Your Age </FormLabel>
              <FormControl>
                <Input type="number" inputMode="numeric" placeholder="Enter your age (e.g., 35)" {...field} onChange={(e) => handleNumericChange(e, field)} value={field.value === null || field.value === undefined ? '' : String(field.value)} min="18" max="100" className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-offset-0 focus:ring-0" />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem> )}
        />
        {/* Weight Field */}
        <FormField control={form.control} name="weight" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-white mb-1"> <Weight className="h-4 w-4 text-white/80" /> Weight (kg) </FormLabel>
              <FormControl>
                <Input type="number" inputMode="numeric" placeholder="Enter weight in kg (e.g., 70)" {...field} onChange={(e) => handleNumericChange(e, field)} value={field.value === null || field.value === undefined ? '' : String(field.value)} min="30" max="200" className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-offset-0 focus:ring-0" />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem> )}
        />
        {/* Height Field */}
        <FormField control={form.control} name="height" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-white mb-1"> <Ruler className="h-4 w-4 text-white/80" /> Height (cm) </FormLabel>
              <FormControl>
                <Input type="number" inputMode="numeric" placeholder="Enter height in cm (e.g., 175)" {...field} onChange={(e) => handleNumericChange(e, field)} value={field.value === null || field.value === undefined ? '' : String(field.value)} min="120" max="230" className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-offset-0 focus:ring-0" />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem> )}
        />
      </CardContent>
    </>
  );
};
export default MeasurementsStep;
