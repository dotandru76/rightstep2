
import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

const RadioGroupItemWithImage = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    imageSrc: string;
    label: string;
  }
>(({ className, imageSrc, label, ...props }, ref) => {
  return (
    <div className="flex-1">
      <RadioGroupPrimitive.Item
        ref={ref}
        className="peer sr-only"
        {...props}
      />
      <label 
        htmlFor={props.id} 
        className="flex flex-col items-center justify-between rounded-md border border-white/30 bg-transparent hover:bg-white/10 hover:border-white peer-data-[state=checked]:border-white [&:has([data-state=checked])]:border-white cursor-pointer text-white h-50"
      >
        <div className="flex justify-center items-center h-full w-full p-2">
          <img 
            src={imageSrc} 
            alt={label} 
            className="object-contain w-full h-47" 
          />
        </div>
        <span className="text-base font-medium pb-2">{label}</span>
      </label>
    </div>
  );
});
RadioGroupItemWithImage.displayName = "RadioGroupItemWithImage";

export { RadioGroup, RadioGroupItem, RadioGroupItemWithImage }
