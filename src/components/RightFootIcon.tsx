// src/components/RightFootIcon.tsx - CORRECT VERSION (Displays Image)

import React from "react";

interface RightFootIconProps {
  className?: string;
  size?: number;
  color?: string;
}

const RightFootIcon: React.FC<RightFootIconProps> = ({
  className = "",
  color = "white"
}) => {

  // Updated log message to reflect this is the image version
  console.log("--- Rendering RightFootIcon (IMAGE VERSION) ---");

  return (
    <div
      className={className} // Size controlled by className
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* === Image Tag for the Logo === */}
      <img
        // *** CRITICAL: Verify this path is EXACTLY correct! ***
        // It assumes 'd70c...png' is inside 'public/lovable-uploads/'
        src="/lovable-uploads/d70c16e2-7117-4a45-baf0-63d60781bafa.png"
        alt="Right Step Logo"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: color === "white" ? "brightness(0) invert(1)" : "none"
        }}
        // === onError Handler ===
        onError={(e) => {
          console.error("!!! RightFootIcon Error: Failed to load logo image.", e);
          // Optionally hide the broken image placeholder
          // (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      {/* ============================= */}
    </div>
  );
};

export default RightFootIcon;