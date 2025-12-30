import React from 'react';
import { Diamond, Circle, Square, Heart, Gem } from 'lucide-react';

interface IconProps {
  size?: number;
  className?: string;
}

export const ShapeIcon: React.FC<{ shape: string } & IconProps> = ({ shape, size = 24, className = '' }) => {
  const shapeNormalized = shape.toLowerCase();

  if (shapeNormalized.includes('round')) {
    return <Circle size={size} className={className} />;
  }
  if (shapeNormalized.includes('princess') || shapeNormalized.includes('square')) {
    return <Square size={size} className={className} />;
  }
  if (shapeNormalized.includes('heart')) {
    return <Heart size={size} className={className} />;
  }
  if (shapeNormalized.includes('emerald') || shapeNormalized.includes('radiant') || shapeNormalized.includes('asscher')) {
    return <Square size={size} className={`${className} rotate-45`} />;
  }

  return <Diamond size={size} className={className} />;
};

export const RingStyleIcon: React.FC<{ style: string } & IconProps> = ({ style, size = 24, className = '' }) => {
  return <Gem size={size} className={className} />;
};
