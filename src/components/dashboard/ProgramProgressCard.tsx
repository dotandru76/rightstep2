
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { weeklyProgram } from "@/data/weeklyProgramData";

interface ProgramProgressCardProps {
  maxAccessibleWeek: number;
  onShowDetails: () => void;
}

const ProgramProgressCard: React.FC<ProgramProgressCardProps> = ({ 
  maxAccessibleWeek,
  onShowDetails 
}) => {
  const totalWeeks = 13;
  const progressPercentage = (maxAccessibleWeek / totalWeeks) * 100;
  const currentWeekData = weeklyProgram.find(program => program.week === maxAccessibleWeek) || weeklyProgram[0];

  return (
    <Card className="shadow-md mb-6 border-t-4 border-t-rightstep-green">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-rightstep-green">Leptin Program</CardTitle>
            <CardDescription>
              Week {maxAccessibleWeek} of {totalWeeks}
            </CardDescription>
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
