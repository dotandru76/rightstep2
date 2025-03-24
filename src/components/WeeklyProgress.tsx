
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight, LockIcon, Settings } from "lucide-react";
import { useProgram } from "@/contexts/ProgramContext";
import { toast } from "sonner";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const WeeklyProgress = () => {
  const navigate = useNavigate();
  const { maxAccessibleWeek, isNewWeek, setIsNewWeekSeen } = useProgram();
  const [displayedWeek, setDisplayedWeek] = useState(1);
  const [debugMode, setDebugMode] = useState(false);
  const [showDevMenu, setShowDevMenu] = useState(false);
  const totalWeeks = 13;
  const progressPercentage = (maxAccessibleWeek / totalWeeks) * 100;

  // If there's a new week, show it automatically
  useEffect(() => {
    if (isNewWeek) {
      setDisplayedWeek(maxAccessibleWeek);
      setIsNewWeekSeen();
    }
  }, [isNewWeek, maxAccessibleWeek, setIsNewWeekSeen]);

  // Weekly themes based on the Leptine Method
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

  const handlePreviousWeek = () => {
    if (displayedWeek > 1) {
      setDisplayedWeek(displayedWeek - 1);
    }
  };

  const handleNextWeek = () => {
    if (displayedWeek < maxAccessibleWeek || debugMode) {
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
    if (week <= maxAccessibleWeek || debugMode) {
      navigate(`/week/${week}`);
    } else {
      toast.error("Week not unlocked yet", {
        description: "You'll gain access to this week as you progress in real time."
      });
    }
  };

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
    toast(debugMode ? "Developer mode disabled" : "Developer mode enabled", {
      description: debugMode 
        ? "Week restrictions reapplied" 
        : "All weeks are now accessible for testing"
    });
    setShowDevMenu(false);
  };

  const handleWeekSelection = (week: number) => {
    setDisplayedWeek(week);
    setShowDevMenu(false);
  };

  const currentTheme = weeklyThemes.find(theme => theme.week === displayedWeek) || weeklyThemes[0];

  return (
    <Card className="shadow-md border-t-4 border-t-rightstep-green">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-rightstep-green">
              Leptin Program
              {debugMode && <span className="ml-2 text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">Dev Mode</span>}
            </CardTitle>
            <CardDescription>
              Week {maxAccessibleWeek} of {totalWeeks}
            </CardDescription>
          </div>
          <div className="flex gap-2 items-center">
            <Popover open={showDevMenu} onOpenChange={setShowDevMenu}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => setShowDevMenu(true)}
                  title="Developer options"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm">Developer Options</h4>
                    <Button 
                      variant={debugMode ? "default" : "outline"} 
                      size="sm" 
                      className={debugMode ? "bg-green-600 hover:bg-green-700" : ""}
                      onClick={toggleDebugMode}
                    >
                      {debugMode ? "Debug ON" : "Debug OFF"}
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {Array.from({ length: totalWeeks }).map((_, i) => {
                      const weekNum = i + 1;
                      return (
                        <Button 
                          key={i}
                          variant="outline" 
                          size="sm"
                          className={`h-8 min-w-0 ${displayedWeek === weekNum ? "bg-blue-100" : ""}`}
                          onClick={() => handleWeekSelection(weekNum)}
                        >
                          {weekNum}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="icon" onClick={handlePreviousWeek} disabled={displayedWeek === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextWeek} disabled={displayedWeek === totalWeeks}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between mb-1">
            <span className="font-medium">Overall Progress</span>
            <span className="text-sm">{progressPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{currentTheme.title}</h3>
                <p className="text-sm text-gray-600">{currentTheme.description}</p>
              </div>
              <Button 
                size="sm" 
                className="bg-rightstep-green hover:bg-rightstep-green-dark"
                onClick={() => handleGoToWeek(displayedWeek)}
                disabled={displayedWeek > maxAccessibleWeek && !debugMode}
              >
                {displayedWeek <= maxAccessibleWeek || debugMode ? (
                  <>
                    Details
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </>
                ) : (
                  <>
                    Locked
                    <LockIcon className="ml-1 h-3 w-3" />
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mt-4">
            {Array.from({ length: totalWeeks }).map((_, i) => {
              const weekNum = i + 1;
              const isLocked = weekNum > maxAccessibleWeek && !debugMode;
              const isCurrent = weekNum === maxAccessibleWeek;
              
              return (
                <Button 
                  key={i}
                  variant={displayedWeek === weekNum ? "default" : isCurrent ? "secondary" : "outline"}
                  className={`h-10 min-w-0 ${isLocked ? "opacity-60" : ""} ${isCurrent ? "border-2 border-rightstep-green" : ""}`}
                  onClick={() => isLocked ? 
                    toast.error("Week not unlocked yet") : 
                    setDisplayedWeek(weekNum)
                  }
                >
                  {isLocked ? (
                    <LockIcon className="h-3 w-3" />
                  ) : (
                    weekNum
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgress;
