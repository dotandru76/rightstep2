
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import RightFootIcon from "@/components/RightFootIcon";

interface DashboardHeaderProps {
  onReset: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onReset }) => {
  return (
    <header className="bg-rightstep-gradient text-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <RightFootIcon className="h-12 w-12" size={48} />
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-white/20" 
          onClick={onReset}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
