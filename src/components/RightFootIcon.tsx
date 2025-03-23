
import React from "react";

interface RightFootIconProps {
  className?: string;
  size?: number;
}

const RightFootIcon: React.FC<RightFootIconProps> = ({ 
  className = "", 
  size = 24 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Main foot shape */}
      <path d="M6 15c1-1 2-3 2-5.5C8 7 9 5 12 5c4 0 6 3 6 7 0 5-2 5-2 7 0 1 0 3-2 3s-2-1.5-4-1.5S7 22 5 22c-2.5 0-3-5-3-6 0-2 3-1 4-1z" />
      
      {/* Toes */}
      <path d="M14 4.5c.5-.5 1.5-.5 2 0" />
      <path d="M16 4c.5-.5 1.5-.5 2 0" />
      <path d="M12 5c.5-.5 1.5-.5 2 0" />
      <path d="M10 5.5c.5-.5 1.5-.5 2 0" />
      <path d="M8 6c.5-.5 1.5-.5 2 0" />
    </svg>
  );
};

export default RightFootIcon;
