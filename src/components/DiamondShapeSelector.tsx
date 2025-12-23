import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export interface DiamondShape {
  value: string;
  label: string;
  icon: string;
}

export const DIAMOND_SHAPES: DiamondShape[] = [
  { value: 'round', label: 'Round', icon: '●' },
  { value: 'princess', label: 'Princess', icon: '■' },
  { value: 'cushion', label: 'Cushion', icon: '◆' },
  { value: 'emerald', label: 'Emerald', icon: '▬' },
  { value: 'oval', label: 'Oval', icon: '◯' },
  { value: 'pear', label: 'Pear', icon: '◐' },
  { value: 'marquise', label: 'Marquise', icon: '◊' },
  { value: 'heart', label: 'Heart', icon: '♥' },
];

interface DiamondShapeSelectorProps {
  selectedShape: string;
  onShapeChange: (shape: string) => void;
  className?: string;
}

export const DiamondShapeSelector: React.FC<DiamondShapeSelectorProps> = ({
  selectedShape,
  onShapeChange,
  className = '',
}) => {
  return (
    <div className={`bg-[#f8f6f3] p-4 sm:p-6 rounded-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm sm:text-base font-semibold text-[#2c2827] flex items-center">
          <span className="mr-2">💎</span>
          Diamond Shape
        </h3>
        {selectedShape && (
          <span className="text-xs sm:text-sm text-Color-Light-300 font-medium">
            Selected: {DIAMOND_SHAPES.find(s => s.value === selectedShape)?.label}
          </span>
        )}
      </div>

      <p className="text-xs text-Color-Rich-Gray mb-4">
        Choose your preferred diamond shape. All shapes are available at no additional cost.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {DIAMOND_SHAPES.map((shape) => {
          const isSelected = selectedShape === shape.value;
          return (
            <motion.button
              key={shape.value}
              type="button"
              onClick={() => onShapeChange(shape.value)}
              className={`relative p-3 sm:p-4 border-2 transition-all duration-200 rounded-lg ${
                isSelected
                  ? 'border-Color-Light-300 bg-Color-Light-300 text-white shadow-lg'
                  : 'border-Color-Light-300/30 hover:border-Color-Light-300 text-Color-Dark-500 bg-white hover:bg-Color-Light-300/5'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl sm:text-3xl">{shape.icon}</span>
                <span className="text-xs sm:text-sm font-medium">{shape.label}</span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 bg-white rounded-full p-0.5"
                  >
                    <Check className="h-3 w-3 text-Color-Light-300" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 mt-4 italic">
        Your shape selection will be included in your order notes for personalized crafting.
      </p>
    </div>
  );
};
