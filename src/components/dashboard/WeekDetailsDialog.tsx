import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// Import icons
import { CheckCircle2, ListChecks, Info, Apple, Ban, NotebookPen, TargetIcon, MinusCircle } from "lucide-react";
// Import the program data structure and food database
import { WeekProgram } from "@/data/weeklyProgramData"; // Adjust path if needed
import { leptinFoodDatabase, FoodItem, FoodCategory, ProgramPhase } from "@/data/foodDatabase"; // Adjust path if needed
import { cn } from "@/lib/utils";

// Update props to use the WeekProgram interface
interface WeekDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weekData: WeekProgram | null; // Allow null
}

/**
 * Determines the current program phase based on the week number.
 * This is a simplified logic; Week 9+ might depend on user's chosen track.
 * @param week - The current week number (1-12).
 * @returns The corresponding ProgramPhase.
 */
const determineCurrentPhase = (week: number): ProgramPhase => {
    if (week >= 9) return 'tracks'; // Or determine specific track if known
    if (week >= 3) return 'cleanse'; // Weeks 3-8 assumed cleanse based on text
    // if (week >= 1) return 'intro'; // Optional phase for weeks 1-2
    return 'all'; // Default or for weeks 1-2 if 'intro' isn't used
};

/**
 * WeekDetailsDialog Component
 * Displays detailed information for a specific week of the Leptin Way program,
 * including phase-specific food guidance filtered from the food database.
 */
const WeekDetailsDialog: React.FC<WeekDetailsDialogProps> = ({
  open,
  onOpenChange,
  weekData
}) => {

  // Determine current phase and filter food lists using useMemo
  const { currentPhase, allowedFoodsThisPhase, discouragedFoodsThisPhase } = useMemo(() => {
    if (!weekData) {
      return { currentPhase: 'all', allowedFoodsThisPhase: [], discouragedFoodsThisPhase: [] };
    }

    const phase = determineCurrentPhase(weekData.week);

    const allowed = leptinFoodDatabase.filter(food => {
      const generallyAllowed = !food.allowedPhases || food.allowedPhases.includes('all');
      const specificallyAllowed = food.allowedPhases?.includes(phase);
      const specificallyDiscouraged = food.discouragedPhases?.includes(phase);
      const generallyDiscouraged = food.discouragedPhases?.includes('all');
      // Simplified: Keep if not specifically discouraged for this phase or generally discouraged
      return !specificallyDiscouraged && !generallyDiscouraged;
      // More complex: return (generallyAllowed || specificallyAllowed) && !specificallyDiscouraged && !generallyDiscouraged;
    });

    const discouraged = leptinFoodDatabase.filter(food =>
      food.discouragedPhases?.includes(phase) || food.discouragedPhases?.includes('all')
    );

    return { currentPhase: phase, allowedFoodsThisPhase: allowed, discouragedFoodsThisPhase: discouraged };
  }, [weekData]);


  // Handle case where weekData might be null or undefined
  if (!weekData) {
    return ( <Dialog open={open} onOpenChange={onOpenChange}> <DialogContent> <DialogHeader> <DialogTitle>Error</DialogTitle> <DialogDescription>Week data not available.</DialogDescription> </DialogHeader> <DialogFooter><Button onClick={() => onOpenChange(false)}>Close</Button></DialogFooter> </DialogContent> </Dialog> );
  }

  // Helper to group foods by category for display
  const groupByCategory = (foods: FoodItem[]) => {
      return foods.reduce((acc, food) => {
          (acc[food.category] = acc[food.category] || []).push(food);
          return acc;
      }, {} as Record<FoodCategory, FoodItem[]>);
  };

  const groupedAllowedFoods = groupByCategory(allowedFoodsThisPhase);
  const groupedDiscouragedFoods = groupByCategory(discouragedFoodsThisPhase);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Allow wider dialog and scrolling */}
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold text-rightstep-green">
            Week {weekData.week}: {weekData.title}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            {weekData.subtitle} (Phase: {currentPhase}) {/* Display current phase */}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content area */}
        <div className="space-y-5 mt-3 flex-grow overflow-y-auto px-1 py-1 pr-3">

          {/* Explanation Section */}
          {weekData.explanation && ( <div> <h3 className="font-semibold text-gray-800 mb-1 text-lg flex items-center gap-2"> <Info className="h-5 w-5 text-indigo-600" /> Explanation </h3> <p className="text-sm text-gray-700 pl-7">{weekData.explanation}</p> </div> )}

          {/* Focus Points Section */}
          {weekData.focusPoints && weekData.focusPoints.length > 0 && ( <div className="pt-4 border-t"> <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2 text-lg"> <TargetIcon className="h-5 w-5 text-blue-600" /> Key Focus Points </h3> <ul className="space-y-1.5 list-none pl-0"> {weekData.focusPoints.map((point, index) => ( <li key={`focus-${index}`} className="flex items-start gap-2 ml-1"> <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" /> <span className="text-sm text-gray-700">{point}</span> </li> ))} </ul> </div> )}

          {/* Daily Tasks Section (Optional) */}
          {weekData.dailyTasks && weekData.dailyTasks.length > 0 && ( <div className="pt-4 border-t"> <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2 text-lg"> <ListChecks className="h-5 w-5 text-purple-600" /> Example Daily Tasks </h3> <ul className="space-y-1.5 list-none pl-0"> {weekData.dailyTasks.map((task, index) => ( <li key={`task-${index}`} className="flex items-start gap-2 ml-1"> <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" /> <span className="text-sm text-gray-700">{task}</span> </li> ))} </ul> </div> )}

          {/* **MODIFIED:** Food Guidance Section using filtered data */}
          <div className="pt-4 border-t">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2 text-lg">
                <NotebookPen className="h-5 w-5 text-orange-600" /> Food Guidance (Week {weekData.week} / Phase: {currentPhase})
              </h3>

              {/* Allowed Foods */}
              {allowedFoodsThisPhase.length > 0 && (
                  <div className="mb-3">
                      <h4 className="font-medium text-green-700 mb-1 flex items-center gap-1"><Apple className="h-4 w-4"/> Emphasize / Allowed</h4>
                      <div className="flex flex-wrap gap-1 text-xs">
                          {Object.entries(groupedAllowedFoods).map(([category, items]) => (
                              <React.Fragment key={category}>
                                  {items.map(item => (
                                      <span key={item.name} className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full border border-green-200">{item.name}{item.notes ? ` (${item.notes})` : ''}</span>
                                  ))}
                              </React.Fragment>
                          ))}
                      </div>
                  </div>
              )}

              {/* Discouraged Foods */}
              {discouragedFoodsThisPhase.length > 0 && (
                  <div>
                      <h4 className="font-medium text-red-700 mb-1 flex items-center gap-1"><Ban className="h-4 w-4"/> Limit / Avoid</h4>
                       <div className="flex flex-wrap gap-1 text-xs">
                          {Object.entries(groupedDiscouragedFoods).map(([category, items]) => (
                              <React.Fragment key={category}>
                                  {items.map(item => (
                                      <span key={item.name} className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full border border-red-200">{item.name}{item.notes ? ` (${item.notes})` : ''}</span>
                                  ))}
                              </React.Fragment>
                          ))}
                      </div>
                  </div>
              )}

              {/* Display original simple food notes if available */}
               {weekData.foodNotes?.general && ( <p className="text-sm text-gray-600 italic mt-3">{weekData.foodNotes.general}</p> )}
               {weekData.foodNotes?.tips && weekData.foodNotes.tips.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-dashed">
                     <h4 className="font-medium text-gray-700 mb-1 text-xs uppercase">Tips:</h4>
                     <ul className="list-disc pl-5 space-y-1 text-sm">
                        {weekData.foodNotes.tips.map((tip, idx) => ( <li key={`tip-${idx}`} className="text-gray-600">{tip}</li> ))}
                     </ul>
                  </div>
                )}
          </div>

        </div> {/* End Scrollable Content */}

        {/* Footer Section */}
        <DialogFooter className="mt-4 flex-shrink-0 pt-4 border-t">
          <Button className="w-full bg-rightstep-green hover:bg-rightstep-green-dark" onClick={() => onOpenChange(false)}>
            Got it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WeekDetailsDialog;
