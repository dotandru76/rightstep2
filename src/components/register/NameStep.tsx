
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import RightFootIcon from "@/components/RightFootIcon";
import { useIsMobile } from "@/hooks/use-mobile";
import { UseFormReturn } from "react-hook-form";

interface NameStepProps {
  form: UseFormReturn<any>;
}

const NameStep: React.FC<NameStepProps> = ({ form }) => {
  const isMobile = useIsMobile();

  return (
    <>
      <div className="flex flex-col items-center justify-center pt-12 pb-6">
        {/* Logo only - no separate text */}
        <div className="text-center mb-10">
          <RightFootIcon className="text-white" size={960} color="white" />
        </div>
        
        {/* Motivational text moved higher */}
        <h2 className="text-xl font-medium text-white mb-8">You are taking the Right Step</h2>
      </div>
      
      <CardContent className="pt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-white">
                <User className="h-4 w-4" /> Your Name
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your name" 
                  {...field} 
                  className="bg-white/10 border-white/20 text-white" 
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </>
  );
};

export default NameStep;
