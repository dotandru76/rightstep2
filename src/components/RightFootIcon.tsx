
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
      {/* Updated foot outline with smoother curves */}
      <path d="M10 3C7.5 3 5.5 4.5 5 6.5C4.5 8.5 3.5 11.5 3 13.5C2.5 15.5 3 17 5.5 18.5C8 20 11 19.5 14 19C14.5 19 15 18 16 16C17 14 17.5 12 17.5 10.5C17.5 9 17 7 16 5.5C15 4 13 3 10 3Z" />
      
      {/* Refined toe shapes */}
      <path d="M11 4C11.5 3.3 12.5 3.3 13 4" />
      <path d="M13.5 3.5C14 2.8 15 2.8 15.5 3.5" />
      <path d="M16 3.5C16.5 2.8 17.5 2.8 18 3.5" />
      <path d="M18.5 4C19 3.3 20 3.3 20.5 4" />
    </svg>
  );
};

export default RightFootIcon;
