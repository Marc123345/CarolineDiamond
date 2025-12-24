import React from 'react';

interface PriceRangeHistogramProps {
  data: Array<{ range: string; count: number; min: number; max: number }>;
  selectedRange?: string;
  onRangeSelect: (range: string) => void;
}

export const PriceRangeHistogram: React.FC<PriceRangeHistogramProps> = ({
  data,
  selectedRange,
  onRangeSelect
}) => {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="space-y-2">
      {data.map((item) => (
        <button
          key={item.range}
          onClick={() => onRangeSelect(item.range)}
          className={`w-full text-left p-2 rounded transition-colors ${
            selectedRange === item.range
              ? 'bg-[#8B7355] text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">{item.range}</span>
            <span className="text-xs text-gray-500">{item.count}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${
                selectedRange === item.range ? 'bg-white' : 'bg-[#8B7355]'
              }`}
              style={{ width: `${(item.count / maxCount) * 100}%` }}
            />
          </div>
        </button>
      ))}
    </div>
  );
};
