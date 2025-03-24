
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight, Settings } from "lucide-react";
import { weeklyProgram } from "@/data/weeklyProgramData";
import { toast } from "sonner";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ProgramProgressCardProps {
  maxAccessibleWeek: number;
  onShowDetails: () => void;
}

const ProgramProgressCard: React.FC<ProgramProgressCardProps> = ({ 
  maxAccessibleWeek,
  onShowDetails 
}) => {
  const [debugMode, setDebugMode] = useState(false);
  const [showDevMenu, setShowDevMenu] = useState(false);
  const totalWeeks = 13;
  const progressPercentage = (maxAccessibleWeek / totalWeeks) * 100;
  const currentWeekData = weeklyProgram.find(program => program.week === maxAccessibleWeek) || weeklyProgram[0];

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
    toast(debugMode ? "Developer mode disabled" : "Developer mode enabled", {
      description: debugMode 
        ? "Week restrictions reapplied" 
        : "All weeks are now accessible for testing"
    });
    setShowDevMenu(false);
    
    // Store debug mode in sessionStorage to persist it across pages
    sessionStorage.setItem('weekDebugMode', debugMode ? 'false' : 'true');
  };

  return (
    <Card className="shadow-md mb-6 border-t-4 border-t-rightstep-green">
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
                <p className="text-sm text-gray-500">Enable debug mode to access all weeks for testing purposes.</p>
              </div>
            </PopoverContent>
          </Popover>
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
                <h3 className="font-bold text-lg">{currentWeekData.title}</h3>
                <p className="text-sm text-gray-600">{currentWeekData.description}</p>
              </div>
              <Button 
                size="sm" 
                className="bg-rightstep-green hover:bg-rightstep-green-dark"
                onClick={onShowDetails}
              >
                Details
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramProgressCard;
