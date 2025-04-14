import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import RightFootIcon from "@/components/RightFootIcon";
import { useIsMobile } from "@/hooks/use-mobile";
import { UseFormReturn } from "react-hook-form";

interface NameStepProps {
  form: UseFormReturn<any>;
}

const NameStep: React.FC<NameStepProps> = ({ form }) => {
  const isMobile = useIsMobile();
  // Final logo size for this step
  const logoSize = isMobile ? 330 : 525;

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 pt-4 pb-8">
      <div className="text-center mb-4">
        <RightFootIcon className="text-white" size={logoSize} color="white" />
      </div>
      <div className="text-center mb-10">
        <h2 className="text-xl font-medium text-white"> You are taking the Right Step </h2>
      </div>
      <div className="w-full max-w-sm">
        <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-white mb-2"> <User className="h-4 w-4" /> Your Name </FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-offset-0 focus:ring-0" autoComplete="off" />
              </FormControl>
              <FormMessage className="text-red-400 mt-1" />
            </FormItem> )}
        />
      </div>
    </div>
  );
};
export default NameStep;
