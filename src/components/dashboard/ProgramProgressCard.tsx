import React, { useState, useEffect } from "react"; // Added useEffect
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight, Settings } from "lucide-react";
import { weeklyProgram, TOTAL_PROGRAM_WEEKS, WeekProgram } from "@/data/weeklyProgramData"; // Import WeekProgram type
import { toast } from "sonner";
import { useProgram } from "@/contexts/ProgramContext"; // Assuming this provides setDebugDay and currentDay
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"; // Assuming cn utility exists

interface ProgramProgressCardProps {
  maxAccessibleWeek: number;
  onShowDetails: () => void;
}

const ProgramProgressCard: React.FC<ProgramProgressCardProps> = ({
  maxAccessibleWeek,
  onShowDetails
}) => {
  // Assume useProgram provides these, including setDebugDay and currentDay
  // Ensure 'currentDay' might be initially undefined from the context
  const { debugMode, setDebugMode, setDebugWeek, setDebugDay, currentWeek, currentDay } = useProgram(); // Added currentWeek
  const [showDevMenu, setShowDevMenu] = useState(false);
  // Ensure maxAccessibleWeek is a number before toString
  const [weekInput, setWeekInput] = useState(() =>
      (typeof maxAccessibleWeek === 'number' && !isNaN(maxAccessibleWeek)) ? maxAccessibleWeek.toString() : '1'
  );

  // *** FIX for TypeError at Line 30 ***
  // Initialize dayInput safely using a function that checks currentDay
  // Defaults to '1' if currentDay is not a valid number initially
  const [dayInput, setDayInput] = useState(() =>
      (typeof currentDay === 'number' && !isNaN(currentDay)) ? currentDay.toString() : '1'
  );

  // Sync week input if maxAccessibleWeek changes from context
  useEffect(() => {
      // Ensure maxAccessibleWeek is a number before converting
      if (typeof maxAccessibleWeek === 'number' && !isNaN(maxAccessibleWeek)) {
        setWeekInput(maxAccessibleWeek.toString());
      }
  }, [maxAccessibleWeek]);

  // Sync day input if currentDay changes from context *after* initial render
  useEffect(() => {
      // Only update if currentDay is a valid number and differs from current input
      if (typeof currentDay === 'number' && !isNaN(currentDay) && currentDay.toString() !== dayInput) {
          setDayInput(currentDay.toString());
      }
  }, [currentDay]); // Only depends on currentDay


  const totalWeeks = TOTAL_PROGRAM_WEEKS; // Use constant
  // Ensure maxAccessibleWeek is at least 1 for data lookup
  const weekForDataDisplay = Math.max(1, maxAccessibleWeek);
  const currentWeekData = weeklyProgram.find(program => program.week === weekForDataDisplay); // Use different variable name

  const toggleDebugMode = () => {
    const newDebugMode = !debugMode;
    setDebugMode(newDebugMode); // Toggle debug mode in context
    toast(newDebugMode ? "Developer mode enabled" : "Developer mode disabled", {
      description: newDebugMode
        ? "Week/Day selection enabled"
        : "Week/Day restrictions reapplied"
    });
     // Reset inputs to actual values when turning OFF debug mode
     // Check if currentDay is valid before using toString
     // *** FIX for potential ReferenceError near Line 126 ***
     // Use maxAccessibleWeek and currentDay from context directly here
     const currentDayString = (typeof currentDay === 'number' && !isNaN(currentDay)) ? currentDay.toString() : '1';
     const currentMaxWeekString = (typeof maxAccessibleWeek === 'number' && !isNaN(maxAccessibleWeek)) ? maxAccessibleWeek.toString() : '1';
     if (!newDebugMode) {
        setWeekInput(currentMaxWeekString); // Reset to actual max week
        setDayInput(currentDayString); // Reset to actual current day
     }
  };

  const handleSetWeek = () => {
    const weekNum = parseInt(weekInput);
    if (!isNaN(weekNum) && weekNum >= 1 && weekNum <= totalWeeks) {
      const firstDayOfWeek = (weekNum - 1) * 7 + 1;
      // Update context (assuming these functions exist and handle numbers)
      if(setDebugWeek) setDebugWeek(weekNum);
      if(setDebugDay) setDebugDay(firstDayOfWeek);
      // Update local input states
      setWeekInput(weekNum.toString());
      setDayInput(firstDayOfWeek.toString());
      toast.success(`Debug week set to ${weekNum} (Day ${firstDayOfWeek})`);
    } else {
      toast.error(`Please enter a valid week number (1-${totalWeeks})`);
    }
  };

  // Handler for setting the debug day
  const handleSetDay = () => {
      const dayNum = parseInt(dayInput);
      const totalDays = totalWeeks * 7;
      if (!isNaN(dayNum) && dayNum >= 1 && dayNum <= totalDays) {
          const correspondingWeek = Math.ceil(dayNum / 7);
          // Update context (assuming these functions exist and handle numbers)
          if(setDebugDay) setDebugDay(dayNum);
          if(setDebugWeek) setDebugWeek(correspondingWeek);
          // Update local input states
          setDayInput(dayNum.toString());
          setWeekInput(correspondingWeek.toString());
          toast.success(`Debug day set to ${dayNum} (Week ${correspondingWeek})`);
      } else {
          toast.error(`Please enter a valid day number (1-${totalDays})`);
      }
  };


  return (
    // Main div with plain styling (no card, no border) and padding
    <div className="p-4">

        {/* Header Section */}
        <div className="pb-2 pt-0">
          <div className="flex justify-between items-center relative">
            {/* Centered Title - Use currentWeek from context */}
            <div className="text-center flex-grow">
              <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
                {/* Display current week from context */}
                Week {currentWeek}
                {/* Updated Debug indicator - show actual current values if debug ON */}
                {/* Displaying weekInput/dayInput from state which reflects debug choice */}
                {debugMode && <span className="ml-2 text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full align-middle">Dev (W{weekInput}/D{dayInput})</span>}
              </h2>
            </div>
            {/* Popover for Dev Options */}
            <Popover open={showDevMenu} onOpenChange={setShowDevMenu}>
              <PopoverTrigger asChild>
                {/* Ensure button styling works on the page background */}
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full absolute top-0 right-0 border-gray-300 text-gray-600 hover:bg-gray-100" title="Developer options">
                   <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                 <div className="space-y-4">
                   <div className="flex justify-between items-center"> <h4 className="font-medium text-sm">Developer Options</h4> <Button variant={debugMode ? "default" : "outline"} size="sm" className={cn("h-7 text-xs px-2", debugMode ? "bg-green-600 hover:bg-green-700" : "")} onClick={toggleDebugMode} > {debugMode ? "Debug ON" : "Debug OFF"} </Button> </div>
                   {debugMode && ( <> <div className="pt-3 border-t"> <h4 className="font-medium text-sm mb-1">Set Current Week</h4> <div className="flex space-x-2"> <Input type="number" min="1" max={totalWeeks} value={weekInput} onChange={(e) => setWeekInput(e.target.value)} className="w-16 h-8 text-sm"/> <Button variant="outline" size="sm" onClick={handleSetWeek} className="h-8 text-xs flex-1"> Set Week </Button> </div> </div> <div className="pt-3 border-t"> <h4 className="font-medium text-sm mb-1">Set Current Day</h4> <div className="flex space-x-2"> <Input type="number" min="1" max={totalWeeks * 7} value={dayInput} onChange={(e) => setDayInput(e.target.value)} className="w-16 h-8 text-sm"/> <Button variant="outline" size="sm" onClick={handleSetDay} className="h-8 text-xs flex-1"> Set Day </Button> </div> <p className="text-xs text-muted-foreground mt-1">(Day 1 to {totalWeeks * 7})</p> </div> </> )}
                 </div>
               </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Content Section */}
        <div className="pt-2">
          {/* Inner styled box for week details */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                 {/* Display data for the actual *max accessible* week */}
                <h3 className="font-bold text-lg text-blue-800">{currentWeekData?.title || 'Loading...'}</h3>
                <p className="text-sm text-gray-700 mt-1">{currentWeekData?.subtitle || '...'}</p> {/* Use subtitle here */}
              </div>
              <Button size="sm" className="bg-rightstep-green hover:bg-rightstep-green-light text-white flex-shrink-0" onClick={onShowDetails} > Details <ArrowRight className="ml-1 h-3 w-3" /> </Button>
            </div>
          </div>
        </div>

    </div> // End of main div
  );
};

export default ProgramProgressCard;
