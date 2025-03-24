
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface WeekData {
  week: number;
  title: string;
  description: string;
  tasks: string[];
  explanation: string;
}

interface WeekDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weekData: WeekData;
}

const WeekDetailsDialog: React.FC<WeekDetailsDialogProps> = ({ 
  open, 
  onOpenChange,
  weekData
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-rightstep-green">
            Week {weekData.week}: {weekData.title}
          </DialogTitle>
          <DialogDescription>
            {weekData.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <p className="text-gray-700">{weekData.explanation}</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-700 mb-2">Weekly Tasks</h3>
            <ul className="space-y-2">
              {weekData.tasks.map((task, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{task}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button className="w-full bg-rightstep-green" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WeekDetailsDialog;
