import React from 'react';

interface WireframeImageProps {
  width?: string;
  height?: string;
  label?: string;
  className?: string;
}

export const WireframeImage: React.FC<WireframeImageProps> = ({ 
  width = "w-full", 
  height = "h-48", 
  label = "Image",
  className = ""
}) => {
  return (
    <div
      className={`${width} ${height} 
        flex items-center justify-center 
        rounded-xl border-2 border-dashed border-Color-Light-300 
        bg-Color-Netural-White text-Color-Champagne-Gold text-sm font-medium 
        ${className}`}
    >
      <span>{label}</span>
    </div>
  );
};
