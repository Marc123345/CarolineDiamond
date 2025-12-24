import React from 'react';
import { X } from 'lucide-react';

interface MetalColorComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  selectedColors: string[];
}

export const MetalColorComparison: React.FC<MetalColorComparisonProps> = ({
  isOpen,
  onClose,
  selectedColors
}) => {
  if (!isOpen || selectedColors.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Compare Metal Colors</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedColors.map((color) => (
              <div key={color} className="text-center">
                <div className="w-full h-32 bg-gray-200 rounded-lg mb-3" />
                <h3 className="font-medium capitalize">{color}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Beautiful {color} finish
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
