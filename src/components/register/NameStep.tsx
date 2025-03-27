
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import RightFootIcon from "@/components/RightFootIcon";
import { UseFormReturn } from "react-hook-form";

interface NameStepProps {
  form: UseFormReturn<any>;
}

const NameStep: React.FC<NameStepProps> = ({ form }) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-2">
        {/* Logo */}
        <div className="text-center mb-4">
          <RightFootIcon className="text-white mx-auto" size={120} color="white" />
          <h1 className="text-3xl font-bold text-white mt-2">RightStep</h1>
        </div>
        
        {/* Motivational text */}
        <h2 className="text-xl font-medium text-white text-center mt-8 mb-6">
          You are taking the Right Step
        </h2>
      </div>
      
      <CardContent className="pb-0">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mb-0">
              <FormLabel className="flex items-center gap-2 text-white">
                <User className="h-4 w-4" /> Your Name
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your name" 
                  {...field} 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50" 
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
