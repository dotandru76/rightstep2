
import React from 'react';
import { CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import RightFootIcon from "@/components/RightFootIcon";
import { useIsMobile } from "@/hooks/use-mobile";
import { UseFormReturn } from "react-hook-form";

interface SummaryStepProps {
  form: UseFormReturn<any>;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ form }) => {
  const isMobile = useIsMobile();

  return (
    <>
      <div className="flex justify-center mb-4 md:mb-6">
        <RightFootIcon className="h-64 w-64 md:h-72 md:w-72 text-rightstep-green" size={isMobile ? 256 : 288} /> {/* Significantly increased size */}
      </div>
      <CardTitle className="text-xl md:text-2xl font-bold text-center text-rightstep-green">Ready to Start Your Journey</CardTitle>
      <CardDescription className="text-center mb-3 md:mb-4">
        Here's a summary of your information. Everything looks good?
      </CardDescription>
      <CardContent className="pt-4 md:pt-6">
        <div className="space-y-4">
          <div className="border rounded-md p-3 md:p-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-1">
                <p className="text-sm text-yellow-600 font-medium">Name</p>
                <p className="font-medium">{form.getValues().name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-yellow-600 font-medium">Gender</p>
                <p className="font-medium capitalize">{form.getValues().sex}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-yellow-600 font-medium">Age</p>
                <p className="font-medium">{form.getValues().age} years</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-yellow-600 font-medium">Weight</p>
                <p className="font-medium">{form.getValues().weight} kg</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-yellow-600 font-medium">Height</p>
                <p className="font-medium">{form.getValues().height} cm</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default SummaryStep;
