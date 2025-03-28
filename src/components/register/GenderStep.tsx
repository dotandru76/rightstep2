// GenderStep.tsx - simplified version without navigation buttons
import React from "react";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { CardTitle, CardDescription } from "@/components/ui/card";
import RightFootIcon from "@/components/RightFootIcon";
import { UseFormReturn } from "react-hook-form";

interface GenderStepProps {
  form: UseFormReturn<any>;
}

const GenderStep: React.FC<GenderStepProps> = ({ form }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full px-4 sm:px-8">
      {/* Logo */}
      <div className="mb-12 mt-8">
        <RightFootIcon className="h-32 w-32 text-white" size={128} />
      </div>
      
      <CardTitle className="text-xl font-bold text-white mb-2">
        Hi, {form.getValues().name}!
      </CardTitle>
      <CardDescription className="text-white/90 mb-8">
        Please select your gender to personalize your plan
      </CardDescription>
      
      <div className="w-full max-w-2xl mx-auto">
        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="grid grid-cols-3 gap-8 w-full">
                  <button
                    type="button"
                    onClick={() => field.onChange('male')}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all hover:opacity-90 ${field.value === 'male' ? 'border-2 border-white scale-105' : ''}`}
                  >
                    <img 
                      src="/lovable-uploads/male-image.png" 
                      alt="Male" 
                      className="w-24 h-24 sm:w-28 sm:h-28 object-contain" 
                    />
                    <span className="text-white text-lg mt-2">Male</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => field.onChange('female')}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all hover:opacity-90 ${field.value === 'female' ? 'border-2 border-white scale-105' : ''}`}
                  >
                    <img 
                      src="/lovable-uploads/female-image.png" 
                      alt="Female" 
                      className="w-24 h-24 sm:w-28 sm:h-28 object-contain" 
                    />
                    <span className="text-white text-lg mt-2">Female</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => field.onChange('other')}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all hover:opacity-90 ${field.value === 'other' ? 'border-2 border-white scale-105' : ''}`}
                  >
                    <img 
                      src="/lovable-uploads/other-image.png" 
                      alt="Other" 
                      className="w-24 h-24 sm:w-28 sm:h-28 object-contain" 
                    />
                    <span className="text-white text-lg mt-2">Other</span>
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-center text-white mt-2" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default GenderStep;