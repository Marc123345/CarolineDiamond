import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gem } from 'lucide-react';
import { motion } from 'framer-motion';

interface CaratOption {
  carat: string;
  label: string;
  price: number;
  handle: string;
}

interface CaratWeightSelectorProps {
  currentHandle: string;
  selectedColor?: string;
  productType?: string;
}

const EARRING_CARAT_OPTIONS: CaratOption[] = [
  { carat: '0.30', label: '0.30ct', price: 490, handle: 'timeless-diamond-stud-earrings-18k-gold-0-30ct' },
  { carat: '0.50', label: '0.50ct', price: 590, handle: 'timeless-diamond-stud-earrings-18k-gold-0-50ct' },
  { carat: '1.00', label: '1.00ct', price: 890, handle: 'timeless-diamond-stud-earrings-18k-gold-1-00ct' },
];

const NECKLACE_CARAT_OPTIONS: CaratOption[] = [
  { carat: '0.50', label: '0.50ct', price: 750, handle: 'timeless-diamond-necklace-18k-gold-0-50ct' },
  { carat: '1.00', label: '1.00ct', price: 1190, handle: 'timeless-diamond-necklace-18k-gold-1-00ct' },
];

const SOLITAIRE_CARAT_OPTIONS: CaratOption[] = [
  { carat: '0.50', label: '0.50ct', price: 790, handle: '18k-gold-lab-grown-diamond-solitaire-engagement-ring-0-50ct' },
  { carat: '1.00', label: '1.00ct', price: 990, handle: '18k-gold-lab-grown-diamond-solitaire-engagement-ring-1-00ct' },
  { carat: '1.50', label: '1.50ct', price: 1250, handle: '18k-gold-lab-grown-diamond-solitaire-engagement-ring-1-50ct' },
];

export const CaratWeightSelector: React.FC<CaratWeightSelectorProps> = ({
  currentHandle,
  selectedColor,
  productType = 'earrings'
}) => {
  const navigate = useNavigate();

  const isTimelessEarring = currentHandle?.includes('timeless') &&
    (currentHandle?.includes('earring') || currentHandle?.includes('stud'));

  const isTimelessNecklace = currentHandle?.includes('timeless') &&
    currentHandle?.includes('necklace');

  const isSolitaireRing = currentHandle?.includes('solitaire') &&
    currentHandle?.includes('engagement-ring');

  if (!isTimelessEarring && !isTimelessNecklace && !isSolitaireRing) {
    return null;
  }

  let caratOptions: CaratOption[] = EARRING_CARAT_OPTIONS;
  if (isTimelessNecklace) {
    caratOptions = NECKLACE_CARAT_OPTIONS;
  } else if (isSolitaireRing) {
    caratOptions = SOLITAIRE_CARAT_OPTIONS;
  }

  const currentCaratOption = caratOptions.find(opt =>
    currentHandle?.includes(opt.carat.replace('.', '-'))
  ) || caratOptions.find(opt => currentHandle?.includes(opt.handle)) || (
    isTimelessNecklace && currentHandle === 'timeless-diamond-necklace'
      ? NECKLACE_CARAT_OPTIONS[0]
      : isTimelessEarring && currentHandle === 'timeless-diamond-earrings'
      ? EARRING_CARAT_OPTIONS[0]
      : undefined
  );

  const handleCaratChange = (option: CaratOption) => {
    if (option.handle === currentHandle) return;

    let path = `/product/${option.handle}`;
    if (selectedColor) {
      path += `?color=${encodeURIComponent(selectedColor.toLowerCase())}`;
    }
    navigate(path);
  };

  return (
    <div className="bg-[#f8f6f3] p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
      <h3 className="text-sm sm:text-base font-semibold text-[#2c2827] mb-3 sm:mb-4 flex items-center">
        <Gem className="h-4 sm:h-5 w-4 sm:w-5 text-Color-Light-300 mr-2" />
        Carat Weight
      </h3>
      <p className="text-xs sm:text-sm text-Color-Gray-700 mb-3">
        Select diamond size - larger diamonds have more sparkle and presence
      </p>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {caratOptions.map((option) => {
          const isSelected = currentCaratOption?.carat === option.carat;

          return (
            <motion.button
              key={option.carat}
              onClick={() => handleCaratChange(option)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-3 sm:p-4 border-2 transition-all duration-200 rounded-lg ${
                isSelected
                  ? 'border-Color-Light-300 bg-Color-Light-300 text-Color-Netural-White shadow-lg'
                  : 'border-Color-Light-300/30 hover:border-Color-Light-300 text-Color-Dark-500 bg-white hover:bg-Color-Light-300/5'
              }`}
            >
              <div className="flex flex-col items-center">
                <span className={`text-lg sm:text-xl font-bold ${isSelected ? 'text-white' : 'text-Color-Light-300'}`}>
                  {option.label}
                </span>
                <span className={`text-xs sm:text-sm font-medium mt-1 ${isSelected ? 'text-white/90' : 'text-Color-Gray-700'}`}>
                  €{option.price}
                </span>
              </div>
              {isSelected && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-Color-Light-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {currentCaratOption && (
        <div className="mt-3 p-3 bg-white/50 rounded-lg">
          <p className="text-xs text-Color-Gray-700">
            <span className="font-semibold">Selected:</span> {currentCaratOption.label} diamonds for €{currentCaratOption.price}
          </p>
        </div>
      )}
    </div>
  );
};
