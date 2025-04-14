import React from "react";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { CardTitle, CardDescription } from "@/components/ui/card"; // Using these for text styling
import RightFootIcon from "@/components/RightFootIcon";
import { UseFormReturn } from "react-hook-form";
import { useIsMobile } from "@/hooks/use-mobile"; // Ensure this hook is implemented correctly

interface GenderStepProps {
  form: UseFormReturn<any>; // Replace 'any' with your form schema type
}

const GenderStep: React.FC<GenderStepProps> = ({ form }) => {
  const isMobile = useIsMobile();

  // Logo size for this step (using previous agreed size)
  const logoSize = isMobile ? 250 : 350;

  return (
    // Main container for the step
    <div className="flex flex-col items-center justify-center w-full px-4 sm:px-8">

      {/* Logo */}
      <div className="mb-8 mt-6">
        {/* Logo size and classes from previous update */}
        <RightFootIcon className="h-64 w-64 md:h-80 md:w-80 text-white" size={logoSize} color="white" />
      </div>

      {/* Titles */}
      <CardTitle className="text-xl md:text-2xl font-bold text-white mb-2 text-center">
        Hi, {form.getValues().name || 'there'}!
      </CardTitle>
      <CardDescription className="text-white/90 mb-6 text-center">
        Please select your gender to personalize your plan
      </CardDescription>

      {/* Gender Selection Area */}
      {/* Using max-w-lg and gap-4 from user's provided code */}
      <div className="w-full max-w-lg mx-auto">
        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="grid grid-cols-3 gap-4 md:gap-6 w-full">
                  {/* Male Button */}
                  <button
                    type="button"
                    onClick={() => field.onChange('male')}
                    // **MODIFIED:** Increased padding, removed aspect-square, ensure items centered
                    className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-200 ease-in-out hover:opacity-90 ${field.value === 'male' ? 'border-2 border-white ring-2 ring-white ring-offset-2 ring-offset-transparent scale-105 bg-white/10' : 'border-2 border-transparent'}`}
                  >
                    <img
                      src="/lovable-uploads/male-image.png" // Ensure path is correct
                      alt="Male"
                      // **MODIFIED:** Larger explicit image size
                      // w-40 (160px), sm:w-48 (192px) - Adjust if needed
                      className="w-40 h-40 sm:w-48 sm:h-48 object-contain mb-2"
                    />
                    {/* **MODIFIED:** Larger text size */}
                    <span className="text-white text-xl md:text-2xl font-medium text-center">Male</span>
                  </button>

                  {/* Female Button */}
                   <button
                    type="button"
                    onClick={() => field.onChange('female')}
                    // **MODIFIED:** Increased padding, removed aspect-square, ensure items centered
                    className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-200 ease-in-out hover:opacity-90 ${field.value === 'female' ? 'border-2 border-white ring-2 ring-white ring-offset-2 ring-offset-transparent scale-105 bg-white/10' : 'border-2 border-transparent'}`}
                  >
                    <img
                      src="/lovable-uploads/female-image.png" // Ensure path is correct
                      alt="Female"
                      // **MODIFIED:** Larger explicit image size
                      className="w-40 h-40 sm:w-48 sm:h-48 object-contain mb-2"
                    />
                     {/* **MODIFIED:** Larger text size */}
                    <span className="text-white text-xl md:text-2xl font-medium text-center">Female</span>
                  </button>

                  {/* Other Button */}
                  <button
                    type="button"
                    onClick={() => field.onChange('other')}
                    // **MODIFIED:** Increased padding, removed aspect-square, ensure items centered
                    className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-200 ease-in-out hover:opacity-90 ${field.value === 'other' ? 'border-2 border-white ring-2 ring-white ring-offset-2 ring-offset-transparent scale-105 bg-white/10' : 'border-2 border-transparent'}`}
                  >
                    <img
                      src="/lovable-uploads/other-image.png" // Ensure path is correct
                      alt="Other"
                      // **MODIFIED:** Larger explicit image size
                      className="w-40 h-40 sm:w-48 sm:h-48 object-contain mb-2"
                    />
                     {/* **MODIFIED:** Larger text size */}
                    <span className="text-white text-xl md:text-2xl font-medium text-center">Other</span>
                  </button>
                </div>
              </FormControl>
              {/* Centered error message */}
              <FormMessage className="text-center text-red-400 mt-4" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default GenderStep;
