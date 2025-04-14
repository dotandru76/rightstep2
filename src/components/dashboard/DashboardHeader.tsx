import React from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import RightFootIcon from "@/components/RightFootIcon"; // Your app logo component

interface DashboardHeaderProps {
  onReset: () => void; // Function prop for the reset/settings action
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onReset }) => {
  // **MODIFIED:** Set logo size to 64px
  const logoSize = 64; // Compromise size, larger than original 48px

  return (
    // Header bar with gradient background
    // **MODIFIED:** Added py-2 back to restore original header height/thickness
    <header className="bg-rightstep-gradient text-white py-2 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo container */}
        <div className="flex items-center">
          {/* **MODIFIED:** App Logo using RightFootIcon with updated size */}
          {/* h-16 w-16 corresponds to 64px */}
          <RightFootIcon className="h-16 w-16" size={logoSize} color="white"/>
          {/* You could add app title text here if desired */}
          {/* <span className="text-xl font-bold ml-2">RightStep</span> */}
        </div>

        {/* Settings/Reset Button */}
        <Button
          variant="ghost"
          size="icon" // Make it an icon button for better spacing
          className="text-white hover:bg-white/20 rounded-full" // Make button round
          onClick={onReset}
          aria-label="Settings or Reset" // Add aria-label for accessibility
        >
          <Settings className="h-5 w-5" /> {/* Kept icon size */}
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
