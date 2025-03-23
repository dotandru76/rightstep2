
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
        src="/lovable-uploads/f93be550-c758-4f2c-8ceb-2cbe62468624.png" 
        alt="Right Step Logo"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export default RightFootIcon;
