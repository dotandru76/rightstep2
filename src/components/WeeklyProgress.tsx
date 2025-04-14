import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // <-- Import Input
import { Label } from "@/components/ui/label"; // <-- Import Label (optional, for styling)
import { ChevronLeft, ChevronRight, ArrowRight, LockIcon, Settings, AlertTriangle } from "lucide-react"; // <-- Added AlertTriangle for reset button
import { useProgram } from "@/contexts/ProgramContext"; // <-- Make sure this import path is correct
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const WeeklyProgress = () => {
  const navigate = useNavigate(); // <-- Hook for navigation
  // --- Get context values ---
  const {
    maxAccessibleWeek,
    isNewWeek,
    setIsNewWeekSeen,
    // --- Add functions needed for Dev controls ---
    debugMode: contextDebugMode,   // Renamed to avoid conflict with local state if needed, or just use contextDebugMode directly
    setDebugMode: setContextDebugMode, // Renamed to avoid conflict
    setDebugDay,
    currentDay, // Get currentDay to initialize input if needed
    currentWeek // Get currentWeek to initialize input/state if needed
  } = useProgram();

  // --- Local State ---
  // Use context's currentWeek/Day initially, or 1 if not ready
  const [displayedWeek, setDisplayedWeek] = useState(currentWeek || 1);
  // Local state for the debug mode toggle to control button appearance immediately
  // Sync with context on toggle. Initialize from context.
  const [debugModeActive, setDebugModeActive] = useState(contextDebugMode);
  const [showDevMenu, setShowDevMenu] = useState(false);
  // State for the Day# input field
  const [debugDayInput, setDebugDayInput] = useState<string>(currentDay?.toString() || "1");

  const totalWeeks = 13; // Assuming 13 weeks based on themes
  const progressPercentage = (maxAccessibleWeek / totalWeeks) * 100;

  // Update displayed week if context changes (e.g., on load or when debug turned off)
  useEffect(() => {
      if (!contextDebugMode) { // If debug mode is turned off in context, sync display
          setDisplayedWeek(currentWeek || 1);
      }
      setDebugModeActive(contextDebugMode); // Sync local toggle state with context
      setDebugDayInput(currentDay?.toString() || "1"); // Sync input with context currentDay
  }, [currentWeek, currentDay, contextDebugMode]);


  // Show newly unlocked week automatically
  useEffect(() => {
    if (isNewWeek) {
      setDisplayedWeek(maxAccessibleWeek);
      setIsNewWeekSeen();
    }
  }, [isNewWeek, maxAccessibleWeek, setIsNewWeekSeen]);

  // Weekly themes
  const weeklyThemes = [
      { week: 1, title: "Water and Drinking", description: "Leptin flooding - 3-4 liters per day" },
      { week: 2, title: "Cleansing Vegetables", description: "50% of the plate cleansing vegetables" },
      { week: 3, title: "Leptin Cleansing", description: "Holiday from sugar, flour, and processed foods" },
      { week: 4, title: "Leptin Carbohydrates", description: "Legumes, buckwheat, and quinoa" },
      { week: 5, title: "Fat Limitation", description: "Limiting to 2 tablespoons of concentrated fat per day" },
      { week: 6, title: "Eating Habits", description: "Frequency and form of eating" },
      { week: 7, title: "Frequency Reduction", description: "2-3 meals a day without snacking" },
      { week: 8, title: "Renewed Motivation", description: "Strengthening motivation and developing indifference to kryptonite food" },
      { week: 9, title: "Track Selection", description: "Transition to one of the three tracks" },
      { week: 10, title: "Leptin Deepening", description: "Hormonal balance and energy elevation" },
      { week: 11, title: "Supporting Lifestyle", description: "Breathing, power pose, and sleep habits" },
      { week: 12, title: "Path Precision", description: "Caloric density and clear boundaries" },
      { week: 13, title: "Leptin for Life", description: "Developing the Leptin identity and strategies for persistence" }
    ];


  // --- Handlers ---
  const handlePreviousWeek = () => {
    if (displayedWeek > 1) {
      setDisplayedWeek(displayedWeek - 1);
    }
  };

  const handleNextWeek = () => {
    // Allow next if debug mode is on OR if next week is accessible
    if (debugModeActive || (displayedWeek + 1 <= maxAccessibleWeek)) {
        if (displayedWeek < totalWeeks) {
            setDisplayedWeek(displayedWeek + 1);
        }
    } else if (displayedWeek < totalWeeks) {
      toast.error("Week not unlocked yet", {
        description: "You'll gain access to this week as you progress in real time."
      });
    }
  };

  const handleGoToWeek = (week: number) => {
    if (week <= maxAccessibleWeek || debugModeActive) {
      // Potentially navigate to a detailed week view if needed,
      // or just ensure the context reflects the displayed week if using debug
      if (debugModeActive) {
          // If navigating, also set the debug day to start of selected week
          const firstDayOfWeek = (week - 1) * 7 + 1;
          setDebugDay(firstDayOfWeek);
      } else {
          // Regular navigation or action for unlocked weeks
          console.log(`Navigating or showing details for week ${week}`);
          // Example navigation (if you have week-specific pages):
          // navigate(`/week/${week}`);
      }
    } else {
      toast.error("Week not unlocked yet", {
        description: "You'll gain access to this week as you progress in real time."
      });
    }
  };

  // --- Dev Feature Handlers ---
  const toggleDebugMode = () => {
    const newState = !debugModeActive;
    setContextDebugMode(newState); // Update context state
    setDebugModeActive(newState);  // Update local state immediately for UI feedback
    // Toast logic remains the same
    toast(newState ? "Developer mode enabled" : "Developer mode disabled", {
        description: newState
        ? "Week/Day selection enabled"
        : "Week restrictions reapplied. View reset to current progress."
    });
    // Don't close menu automatically on toggle
  };

  const handleWeekSelection = (week: number) => {
    // When selecting a week in debug mode, also set the day to the start of that week
    const firstDayOfWeek = (week - 1) * 7 + 1;
    setDisplayedWeek(week); // Update local display immediately
    if (debugModeActive) {
        setDebugDay(firstDayOfWeek); // Update context's day via debug function
    }
    // Don't close menu automatically
  };

  const handleSetDebugDay = () => {
    const dayNum = parseInt(debugDayInput, 10);
    const totalDays = totalWeeks * 7;
    if (!isNaN(dayNum) && dayNum > 0 && dayNum <= totalDays) {
       if (!debugModeActive) {
         setContextDebugMode(true); // Turn on debug mode in context
         setDebugModeActive(true); // Turn on local state
         toast.info("Developer mode enabled to set day.");
       }
       setDebugDay(dayNum); // Call the context function
       toast.info(`Set view to Day ${dayNum}`);
       setShowDevMenu(false); // Close popover after setting day
    } else {
       toast.error(`Please enter a valid day number (1-${totalDays}).`);
    }
  };

  const handleResetApp = () => {
    if (window.confirm("Are you sure you want to reset all app data and return to registration? This cannot be undone.")) {
        console.log("Resetting application state...");
        localStorage.removeItem("userData");
        localStorage.removeItem("programStartDate");
        localStorage.removeItem("lastSeenWeek");
        localStorage.removeItem("googleVisionApiKey"); // Also clear API key
        // foodLogService.clearAllEntries(); // Clear food log if using that service

        toast.info("Application reset. Please register again.");
        // Force reload or navigate - navigating might be cleaner
        navigate('/register', { replace: true });
        // Optional: Full reload after a short delay
        // setTimeout(() => window.location.reload(), 100);
        setShowDevMenu(false); // Close popover
    }
  };
  // --- End Dev Feature Handlers ---


  const currentTheme = weeklyThemes.find(theme => theme.week === displayedWeek) || weeklyThemes[0];

  return (
    <Card className="shadow-md border-t-4 border-t-rightstep-green">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-rightstep-green">
              Leptin Program
              {/* Use local debug state for immediate UI feedback */}
              {debugModeActive && <span className="ml-2 text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">Dev Mode</span>}
            </CardTitle>
            <CardDescription>
              {/* Show actual unlocked week / total */}
              Week {maxAccessibleWeek} of {totalWeeks}
            </CardDescription>
          </div>
          <div className="flex gap-2 items-center">
             {/* --- DEV MENU POPOVER --- */}
            <Popover open={showDevMenu} onOpenChange={setShowDevMenu}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  title="Developer options"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end"> {/* Increased width slightly */}
                <div className="space-y-3">
                  {/* Debug Mode Toggle */}
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm">Developer Options</h4>
                    <Button
                      variant={debugModeActive ? "default" : "outline"}
                      size="sm"
                      className={debugModeActive ? "bg-green-600 hover:bg-green-700" : ""}
                      onClick={toggleDebugMode}
                    >
                      {debugModeActive ? "Debug ON" : "Debug OFF"}
                    </Button>
                  </div>

                  {/* Week Selector Grid (Only useful if debug ON) */}
                  <div className="grid grid-cols-4 gap-1">
                    {Array.from({ length: totalWeeks }).map((_, i) => {
                      const weekNum = i + 1;
                      return (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          // Highlight based on displayedWeek, disable if debug off & locked
                          className={`h-8 min-w-0 ${displayedWeek === weekNum ? "bg-blue-100" : ""} ${!debugModeActive && weekNum > maxAccessibleWeek ? "opacity-50 pointer-events-none" : ""}`}
                          onClick={() => handleWeekSelection(weekNum)}
                           // Also disable if debug mode is off and week is locked
                          disabled={!debugModeActive && weekNum > maxAccessibleWeek}
                        >
                          {/* Show lock only if debug mode is OFF and week is locked */}
                          {!debugModeActive && weekNum > maxAccessibleWeek ? <LockIcon className="h-3 w-3" /> : weekNum}
                        </Button>
                      );
                    })}
                  </div>

                  {/* --- Day Selector (Added) --- */}
                  <div className="flex items-center gap-2 pt-3 border-t mt-3">
                    <Label htmlFor="debug-day" className="text-xs whitespace-nowrap">Set Day #:</Label>
                    <Input
                      id="debug-day"
                      type="number"
                      min="1"
                      max={totalWeeks * 7}
                      value={debugDayInput}
                      onChange={(e) => setDebugDayInput(e.target.value)}
                      className="h-8 text-xs w-16"
                      disabled={!debugModeActive} // Only enable if debug mode is on
                    />
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleSetDebugDay}
                        disabled={!debugModeActive} // Only enable if debug mode is on
                    >Set</Button>
                  </div>

                  {/* --- Reset Button (Added) --- */}
                  <div className="pt-3 border-t mt-3">
                     <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleResetApp}
                        className="w-full flex items-center gap-1"
                     >
                         <AlertTriangle className="h-4 w-4"/> Reset App Data
                     </Button>
                  </div>

                </div>
              </PopoverContent>
            </Popover>
            {/* --- END DEV MENU POPOVER --- */}


            {/* Week Navigation Buttons */}
            <Button variant="outline" size="icon" onClick={handlePreviousWeek} disabled={displayedWeek === 1} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextWeek} disabled={displayedWeek === totalWeeks || (!debugModeActive && displayedWeek >= maxAccessibleWeek)} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Progress Bar */}
          <div className="flex justify-between mb-1">
            <span className="font-medium text-sm">Overall Progress</span>
            <span className="text-xs text-muted-foreground">{progressPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />

          {/* Current Displayed Week Theme */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base">{currentTheme.title}</h3>
                <p className="text-xs text-gray-600">{currentTheme.description}</p>
              </div>
              {/* Button to go to week details (only enabled if week <= max or debug ON) */}
              <Button
                size="sm"
                className="bg-rightstep-green hover:bg-rightstep-green-dark h-8 text-xs" // Made button smaller
                onClick={() => handleGoToWeek(displayedWeek)}
                disabled={displayedWeek > maxAccessibleWeek && !debugModeActive}
              >
                {displayedWeek <= maxAccessibleWeek || debugModeActive ? (
                  <> Details <ArrowRight className="ml-1 h-3 w-3" /> </>
                ) : (
                  <> Locked <LockIcon className="ml-1 h-3 w-3" /> </>
                )}
              </Button>
            </div>
          </div>

          {/* Removed the week grid from here, it's now in the Popover */}

        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgress;