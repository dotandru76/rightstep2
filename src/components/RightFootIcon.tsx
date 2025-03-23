
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
      {/* Main foot outline - simplified to match the image */}
      <path d="M14 19c-3 0.5-6 1-8.5-0.5C3 17 2.5 15.5 3 13.5C3.5 11.5 4.5 8.5 5 6.5C5.5 4.5 7.5 3 9.5 3C11.5 3 14 4 15 5.5C16 7 16.5 9 16.5 10.5C16.5 12 16 14 15 16C14 18 13.5 19 14 19Z" />
      
      {/* Toes - simplified to match the image */}
      <path d="M12.5 4C13 3.5 14 3.5 14.5 4" />
      <path d="M14.5 3.5C15 3 16 3 16.5 3.5" />
      <path d="M16.5 3.5C17 3 18 3 18.5 3.5" />
      <path d="M18.5 4C19 3.5 20 3.5 20.5 4" />
    </svg>
  );
};

export default RightFootIcon;
