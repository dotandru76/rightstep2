
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
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Simple foot outline matching the logo */}
      <path d="M12 6c-1 0-2 0.5-2.5 1.5C9 9 8 13 7.5 15c-0.5 2.5 0 4 2 4.5c2 0.5 3 0 5-1c2-1 2.5-8.5 0.5-11c-0.5-0.5-2-1.5-3-1.5z" />
      
      {/* Simplified toe shapes that look more like the logo */}
      <path d="M10.5 3.5a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1 -1.6 0" />
      <path d="M12.5 3a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1 -1.6 0" />
      <path d="M14.5 3.5a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1 -1.6 0" />
      <path d="M16 4.5a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1 -1.6 0" />
    </svg>
  );
};

export default RightFootIcon;
