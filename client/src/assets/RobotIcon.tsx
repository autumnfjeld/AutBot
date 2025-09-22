import React from 'react';

interface RobotIconProps {
  className?: string;
}

const RobotIcon: React.FC<RobotIconProps> = ({ className = "w-5 h-5" }) => {
  return (
    <svg 
      className={`${className} text-lime-700`}
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      {/* Robot head */}
      <rect x="6" y="8" width="12" height="10" rx="2" />
      {/* Antenna */}
      <circle cx="12" cy="6" r="1" />
      <line x1="12" y1="7" x2="12" y2="8" stroke="currentColor" strokeWidth="1" fill="none" />
      {/* Eyes */}
      <circle cx="9" cy="12" r="1.5" fill="white" />
      <circle cx="15" cy="12" r="1.5" fill="white" />
      <circle cx="9" cy="12" r="0.8" fill="currentColor" />
      <circle cx="15" cy="12" r="0.8" fill="currentColor" />
      {/* Mouth */}
      <rect x="10" y="15" width="4" height="1.5" rx="0.5" fill="white" />
    </svg>
  );
};

export default RobotIcon;
