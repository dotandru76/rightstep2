
import React from "react";

interface RightFootIconProps {
  className?: string;
  size?: number;
  color?: string;
}

const RightFootIcon: React.FC<RightFootIconProps> = ({ 
  className = "", 
  size = 24,
  color = "white" 
}) => {
  return (
    <div 
      className={className}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <img 
        src="/lovable-uploads/d70c16e2-7117-4a45-baf0-63d60781bafa.png" 
        alt="Right Step Logo"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: color === "white" ? "brightness(0) invert(1)" : "none"
        }}
      />
    </div>
  );
};

export default RightFootIcon;
