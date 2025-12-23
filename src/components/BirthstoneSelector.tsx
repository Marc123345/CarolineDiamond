import React from 'react';
import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';

export interface Birthstone {
  value: string;
  label: string;
  month: string;
  color: string;
  price: number;
}

export const BIRTHSTONES: Birthstone[] = [
  { value: 'none', label: 'No Birthstone', month: '', color: '#transparent', price: 0 },
  { value: 'garnet', label: 'Garnet', month: 'January', color: '#9C1F1F', price: 40 },
  { value: 'amethyst', label: 'Amethyst', month: 'February', color: '#9966CC', price: 40 },
  { value: 'aquamarine', label: 'Aquamarine', month: 'March', color: '#7FFFD4', price: 40 },
  { value: 'diamond', label: 'Diamond', month: 'April', color: '#B9F2FF', price: 40 },
  { value: 'emerald', label: 'Emerald', month: 'May', color: '#50C878', price: 40 },
  { value: 'pearl', label: 'Pearl', month: 'June', color: '#F0EAD6', price: 40 },
  { value: 'ruby', label: 'Ruby', month: 'July', color: '#E0115F', price: 40 },
  { value: 'peridot', label: 'Peridot', month: 'August', color: '#E6E200', price: 40 },
  { value: 'sapphire', label: 'Sapphire', month: 'September', color: '#0F52BA', price: 40 },
  { value: 'opal', label: 'Opal', month: 'October', color: '#A8C3BC', price: 40 },
  { value: 'topaz', label: 'Topaz', month: 'November', color: '#FFC87C', price: 40 },
  { value: 'turquoise', label: 'Turquoise', month: 'December', color: '#40E0D0', price: 40 },
];

interface BirthstoneSelectorProps {
  selectedBirthstone: string;
  onBirthstoneChange: (birthstone: string) => void;
  className?: string;
}

export const BirthstoneSelector: React.FC<BirthstoneSelectorProps> = ({
  selectedBirthstone,
  onBirthstoneChange,
  className = '',
}) => {
  const selectedStone = BIRTHSTONES.find(b => b.value === selectedBirthstone);
  const hasSelection = selectedBirthstone && selectedBirthstone !== 'none';

  return (
    <div className={`bg-[#f8f6f3] p-4 sm:p-6 rounded-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm sm:text-base font-semibold text-[#2c2827] flex items-center">
          <span className="mr-2">🎂</span>
          Birthstone Add-on
          <span className="ml-2 text-xs font-normal text-Color-Light-300">(Optional)</span>
        </h3>
        {hasSelection && selectedStone && (
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-Color-Light-300 font-medium">
              +€{selectedStone.price}
            </span>
          </div>
        )}
      </div>

      <p className="text-xs text-Color-Rich-Gray mb-4">
        Add a meaningful birthstone accent to your jewelry for an extra personal touch. {hasSelection ? '' : 'Each birthstone adds €40.'}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {BIRTHSTONES.map((stone) => {
          const isSelected = selectedBirthstone === stone.value;
          const isNone = stone.value === 'none';

          return (
            <motion.button
              key={stone.value}
              type="button"
              onClick={() => onBirthstoneChange(stone.value)}
              className={`relative p-3 border-2 transition-all duration-200 rounded-lg ${
                isSelected
                  ? 'border-Color-Light-300 bg-Color-Light-300/10 shadow-md'
                  : 'border-Color-Light-300/30 hover:border-Color-Light-300 bg-white hover:bg-Color-Light-300/5'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center gap-1.5">
                {!isNone && (
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: stone.color }}
                  />
                )}
                <span className="text-xs sm:text-sm font-medium text-Color-Dark-500 text-center">
                  {stone.label}
                </span>
                {!isNone && (
                  <span className="text-xs text-Color-Champagne-Gold">
                    {stone.month}
                  </span>
                )}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 bg-Color-Light-300 rounded-full p-1"
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                )}
                {!isNone && !isSelected && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-Color-Light-300/20 rounded-full flex items-center justify-center">
                    <Plus className="h-3 w-3 text-Color-Light-300" />
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {hasSelection && selectedStone && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-Color-Light-300/10 border border-Color-Light-300/30 rounded-lg"
        >
          <p className="text-xs text-Color-Dark-500">
            <strong>{selectedStone.label}</strong> ({selectedStone.month}) has been added for an additional <strong>€{selectedStone.price}</strong>
          </p>
        </motion.div>
      )}

      <p className="text-xs text-gray-500 mt-4 italic">
        Birthstones add a personal, meaningful touch perfect for gifts and special occasions.
      </p>
    </div>
  );
};
