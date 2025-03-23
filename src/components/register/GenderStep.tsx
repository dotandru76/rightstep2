
import React from 'react';
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItemWithImage } from "@/components/ui/radio-group";
import RightFootIcon from "@/components/RightFootIcon";
import { UseFormReturn } from "react-hook-form";

interface GenderStepProps {
  form: UseFormReturn<any>;
}

const GenderStep: React.FC<GenderStepProps> = ({ form }) => {
  return (
    <>
      <div className="flex justify-center mb-4">
        <RightFootIcon className="h-20 w-20 text-white" size={80} />
      </div>
      <CardTitle className="text-xl font-bold text-center text-white">Hi, {form.getValues().name}!</CardTitle>
      <CardDescription className="text-center mb-6 text-white/80">
        Please select your gender to personalize your plan
      </CardDescription>
      <CardContent className="pt-4 space-y-5">
        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-3"
                >
                  <RadioGroupItemWithImage 
                    id="male"
                    value="male"
                    imageSrc="/lovable-uploads/64afc05e-9201-4769-b2d3-d44c83480d8a.png"
                    label="Male"
                  />
                  
                  <RadioGroupItemWithImage
                    id="female"
                    value="female"
                    imageSrc="/lovable-uploads/85d23c27-0326-452e-9dae-f3a6b94f05d5.png"
                    label="Female"
                  />
                  
                  <RadioGroupItemWithImage
                    id="other"
                    value="other"
                    imageSrc="/lovable-uploads/6ca3238a-5a6d-46e7-85f0-9dddd40f73b3.png"
                    label="Other"
                  />
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-center text-white" />
            </FormItem>
          )}
        />
      </CardContent>
    </>
  );
};

export default GenderStep;
