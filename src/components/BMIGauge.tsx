import React, { useMemo } from 'react';

interface BMIGaugeProps {
  bmi: number;
  size?: number;
}

const BMIGauge: React.FC<BMIGaugeProps> = ({ bmi, size = 200 }) => {
  // Calculate needle angle based on BMI
  // We'll set the scale from 15 to 40 BMI, mapping to -120 to 120 degrees
  const needleAngle = useMemo(() => {
    const minBMI = 15;
    const maxBMI = 40;
    const minAngle = -120;
    const maxAngle = 120;
    
    // Clamp BMI within our range
    const clampedBMI = Math.max(minBMI, Math.min(maxBMI, bmi));
    
    // Convert BMI to angle
    const angle = minAngle + ((clampedBMI - minBMI) / (maxBMI - minBMI)) * (maxAngle - minAngle);
    
    return angle;
  }, [bmi]);

  return (
    <svg width={size} height={size / 1.5} viewBox="0 0 200 100">
      {/* Gauge background */}
      <path
        d="M10,90 A80,80 0 0,1 190,90"
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="20"
        strokeLinecap="round"
      />
      
      {/* Colored segments */}
      {/* Underweight (blue) */}
      <path
        d="M10,90 A80,80 0 0,1 52.5,40"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="20"
        strokeLinecap="round"
      />
      
      {/* Normal weight (green) */}
      <path
        d="M52.5,40 A80,80 0 0,1 100,30"
        fill="none"
        stroke="#10b981"
        strokeWidth="20"
        strokeLinecap="round"
      />
      
      {/* Overweight (yellow) */}
      <path
        d="M100,30 A80,80 0 0,1 147.5,40"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="20"
        strokeLinecap="round"
      />
      
      {/* Obese (red) */}
      <path
        d="M147.5,40 A80,80 0 0,1 190,90"
        fill="none"
        stroke="#ef4444"
        strokeWidth="20"
        strokeLinecap="round"
      />
      
      {/* Gauge center point */}
      <circle cx="100" cy="90" r="5" fill="#374151" />
      
      {/* Needle */}
      <line
        x1="100"
        y1="90"
        x2="100"
        y2="30"
        stroke="#1f2937"
        strokeWidth="2"
        transform={`rotate(${needleAngle}, 100, 90)`}
        strokeLinecap="round"
      />
      
      {/* Needle center cap */}
      <circle cx="100" cy="90" r="3" fill="#1f2937" />
      
      {/* BMI ranges labels */}
      <text x="25" y="15" fontSize="8" fill="#3b82f6" textAnchor="middle">15</text>
      <text x="75" y="10" fontSize="8" fill="#10b981" textAnchor="middle">20</text>
      <text x="125" y="10" fontSize="8" fill="#f59e0b" textAnchor="middle">30</text>
      <text x="175" y="15" fontSize="8" fill="#ef4444" textAnchor="middle">40</text>
    </svg>
  );
};

export default BMIGauge;