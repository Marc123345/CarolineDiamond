import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Ruler, Info } from 'lucide-react';
import { 
  ProductFilters, 
  CARAT_WEIGHTS, 
  CLARITY_GRADES, 
  COMMON_CLARITY_GRADES, 
  CERTIFICATIONS 
} from '../../config/filterConfig';
import { getClarityDisplayInfo, getCertificationDisplayInfo } from '../../utils/diamondUtils';

interface ModernFilterUIProps {
  filters: ProductFilters;
  onFiltersChange: (filters: Partial<ProductFilters>) => void;
  productCounts?: Record<string, number>;
  onRequestCustomSize?: () => void;
}

export const ModernFilterUI: React.FC<ModernFilterUIProps> = ({
  filters,
  onFiltersChange,
  productCounts = {},
  onRequestCustomSize,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['carat', 'clarity', 'certification'])
  );
  const [showAllClarity, setShowAllClarity] = useState(false);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const isExpanded = (sectionId: string) => expandedSections.has(sectionId);

  const toggleCaratWeight = (weight: typeof CARAT_WEIGHTS[number]) => {
    const current = filters.caratWeights || [];
    // @ts-ignore
    const exists = current.find(w => w === weight.label); // Adjusted logic: filter stores string labels

    if (exists) {
      onFiltersChange({
        // @ts-ignore
        caratWeights: current.filter(w => w !== weight.label),
      });
    } else {
      onFiltersChange({
        // @ts-ignore
        caratWeights: [...current, weight.label],
      });
    }
  };

  const toggleClarity = (clarity: typeof CLARITY_GRADES[number]) => {
    const current = filters.clarityGrades || [];
    const exists = current.includes(clarity);

    if (exists) {
      onFiltersChange({
        clarityGrades: current.filter(c => c !== clarity),
      });
    } else {
      onFiltersChange({
        clarityGrades: [...current, clarity],
      });
    }
  };

  const toggleCertification = (cert: typeof CERTIFICATIONS[number]) => {
    const current = filters.certifications || [];
    const exists = current.includes(cert);

    if (exists) {
      onFiltersChange({
        certifications: current.filter(c => c !== cert),
      });
    } else {
      onFiltersChange({
        certifications: [...current, cert],
      });
    }
  };

  const isCaratSelected = (weight: typeof CARAT_WEIGHTS[number]) => {
    // @ts-ignore
    return filters.caratWeights?.includes(weight.label) || false;
  };

  const isClaritySelected = (clarity: typeof CLARITY_GRADES[number]) => {
    return filters.clarityGrades?.includes(clarity) || false;
  };

  const isCertificationSelected = (cert: typeof CERTIFICATIONS[number]) => {
    return filters.certifications?.includes(cert) || false;
  };

  const showCustomSizeBanner = filters.diamondOrigin === 'Lab-Grown';

  return (
    <div className="space-y-1">
      {/* Custom Size Banner (Lab-Grown Only) */}
      {showCustomSizeBanner && onRequestCustomSize && (
        <div className="mb-4">
          <div className="bg-gradient-to-r from-Color-Champagne-Gold/10 to-Color-Primary-Beige/20 p-4 rounded-xl border-2 border-Color-Champagne-Gold/30">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-Color-Champagne-Gold rounded-lg flex-shrink-0">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-Color-Netural-Black mb-1">
                  Custom Size Available
                </h4>
                <p className="text-xs text-Color-Gray-700 mb-3">
                  Lab-grown diamonds can be created in any size. Request your perfect specifications!
                </p>
                <button
                  onClick={onRequestCustomSize}
                  className="w-full py-2.5 px-4 bg-Color-Champagne-Gold text-white rounded-lg font-medium hover:bg-Color-Netural-Black transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Ruler className="h-4 w-4" />
                  Request Custom Size
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Carat Weight Section */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('carat')}
          className="w-full flex items-center justify-between py-4 px-1 hover:bg-gray-50 transition-colors rounded"
        >
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-Color-Netural-Black">
              Carat Weight
            </h3>
            {filters.caratWeights && filters.caratWeights.length > 0 && (
              <span className="px-2 py-0.5 bg-Color-Champagne-Gold text-white text-xs rounded-full font-medium">
                {filters.caratWeights.length}
              </span>
            )}
          </div>
          {isExpanded('carat') ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {isExpanded('carat') && (
          <div className="pb-4 px-1 animate-slide-down">
            <p className="text-xs text-gray-500 mb-3">
              Select one or more carat weight ranges
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {CARAT_WEIGHTS.map((weight) => {
                const selected = isCaratSelected(weight);
                const count = productCounts[weight.label] || 0;

                return (
                  <button
                    key={weight.label}
                    onClick={() => toggleCaratWeight(weight)}
                    // disabled={count === 0} // Temporarily enabled for demo
                    className={`
                      relative py-3 px-3.5 rounded-xl border-2 text-sm font-medium
                      transition-all duration-200 text-left group
                      ${selected
                        ? 'border-Color-Champagne-Gold bg-Color-Champagne-Gold/10 text-Color-Netural-Black shadow-sm'
                        : count === 0
                        ? 'border-gray-200 bg-gray-50 text-gray-400 opacity-60' // Less harsh disabled state
                        : 'border-gray-200 text-Color-Netural-Black hover:border-Color-Champagne-Gold/60 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex flex-col pr-6">
                      <span className="font-bold text-sm">{weight.label}</span>
                      {count > 0 && (
                        <span className="text-xs text-gray-500 mt-0.5">
                          {count} {count === 1 ? 'ring' : 'rings'}
                        </span>
                      )}
                    </div>
                    {selected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-Color-Champagne-Gold rounded-full flex items-center justify-center shadow-sm">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Clarity Section */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('clarity')}
          className="w-full flex items-center justify-between py-4 px-1 hover:bg-gray-50 transition-colors rounded"
        >
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-Color-Netural-Black">
              Diamond Clarity
            </h3>
            {filters.clarityGrades && filters.clarityGrades.length > 0 && (
              <span className="px-2 py-0.5 bg-Color-Champagne-Gold text-white text-xs rounded-full font-medium">
                {filters.clarityGrades.length}
              </span>
            )}
          </div>
          {isExpanded('clarity') ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {isExpanded('clarity') && (
          <div className="pb-4 px-1 animate-slide-down">
            <p className="text-xs text-gray-500 mb-3">
              Most popular grades for the best value
            </p>

            {/* Common Clarity Grades */}
            <div className="grid grid-cols-2 gap-2.5 mb-3">
              {COMMON_CLARITY_GRADES.map((clarity) => {
                // @ts-ignore
                const selected = isClaritySelected(clarity);
                const count = productCounts[clarity] || 0;
                // @ts-ignore
                const info = getClarityDisplayInfo(clarity);

                return (
                  <button
                    key={clarity}
                    // @ts-ignore
                    onClick={() => toggleClarity(clarity)}
                    // disabled={count === 0}
                    className={`
                      group relative py-3 px-3 rounded-xl border-2 text-sm
                      transition-all duration-200
                      ${selected
                        ? 'border-Color-Champagne-Gold bg-Color-Champagne-Gold/10 shadow-sm'
                        : count === 0
                        ? 'border-gray-200 bg-gray-50 opacity-60'
                        : 'border-gray-200 hover:border-Color-Champagne-Gold/60 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex flex-col items-start pr-6">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-Color-Netural-Black">{clarity}</span>
                        <div className="relative group/tooltip">
                          <Info className="h-3 w-3 text-gray-400" />
                          <div className="absolute left-0 bottom-full mb-2 w-48 p-2.5 bg-black text-white text-xs rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-10 pointer-events-none">
                            <p className="font-semibold mb-1">{info.fullName}</p>
                            <p className="text-xs opacity-90">{info.description}</p>
                          </div>
                        </div>
                      </div>
                      <span className={`text-xs mt-0.5 ${
                        info.quality === 'Very Good' ? 'text-green-600' : 'text-gray-500'
                      }`}>{info.quality}</span>
                      {count > 0 && (
                        <span className="text-xs text-gray-500 mt-1">
                          ({count})
                        </span>
                      )}
                    </div>
                    {selected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-Color-Champagne-Gold rounded-full flex items-center justify-center shadow-sm">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Show All Clarity Toggle */}
            <button
              onClick={() => setShowAllClarity(!showAllClarity)}
              className="text-xs text-Color-Champagne-Gold hover:text-black font-semibold transition-colors flex items-center gap-1 py-1"
            >
              {showAllClarity ? 'Show Less' : 'Show All Grades'}
              {showAllClarity ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            {/* All Clarity Grades */}
            {showAllClarity && (
              <div className="grid grid-cols-3 gap-2 mt-3 animate-slide-down">
                {CLARITY_GRADES.filter(c => !COMMON_CLARITY_GRADES.includes(c as any)).map((clarity) => {
                  const selected = isClaritySelected(clarity);
                  const count = productCounts[clarity] || 0;
                  const info = getClarityDisplayInfo(clarity);

                  return (
                    <button
                      key={clarity}
                      onClick={() => toggleClarity(clarity)}
                      // disabled={count === 0}
                      className={`
                        relative py-2 px-2 rounded-lg border-2 text-sm
                        transition-all duration-200
                        ${selected
                          ? 'border-Color-Champagne-Gold bg-Color-Champagne-Gold/10'
                          : count === 0
                          ? 'border-gray-200 bg-gray-50 opacity-60'
                          : 'border-gray-200 hover:border-Color-Champagne-Gold/60 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-Color-Netural-Black text-xs">{clarity}</span>
                        <span className="text-xs text-gray-500 truncate">{info.quality}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Certification Section */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('certification')}
          className="w-full flex items-center justify-between py-4 px-1 hover:bg-gray-50 transition-colors rounded"
        >
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-Color-Netural-Black">
              Certification
            </h3>
            {filters.certifications && filters.certifications.length > 0 && (
              <span className="px-2 py-0.5 bg-Color-Champagne-Gold text-white text-xs rounded-full font-medium">
                {filters.certifications.length}
              </span>
            )}
          </div>
          {isExpanded('certification') ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {isExpanded('certification') && (
          <div className="pb-4 px-1 animate-slide-down">
            <p className="text-xs text-gray-500 mb-3">
              Independent certification ensures authenticity
            </p>
            <div className="space-y-2.5">
              {CERTIFICATIONS.map((cert) => {
                const selected = isCertificationSelected(cert);
                const count = productCounts[cert] || 0;
                const info = getCertificationDisplayInfo(cert);

                return (
                  <button
                    key={cert}
                    onClick={() => toggleCertification(cert)}
                    // disabled={count === 0}
                    className={`
                      w-full relative p-4 rounded-xl border-2 text-left
                      transition-all duration-200
                      ${selected
                        ? 'border-Color-Champagne-Gold bg-Color-Champagne-Gold/10 shadow-sm'
                        : count === 0
                        ? 'border-gray-200 bg-gray-50 opacity-60'
                        : 'border-gray-200 hover:border-Color-Champagne-Gold/60 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-8">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-Color-Netural-Black text-base">{info.name}</span>
                          <span className={`
                            text-xs px-2 py-0.5 rounded-full font-medium
                            ${info.reputation === 'Excellent' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                          `}>
                            {info.reputation}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">{info.fullName}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{info.description}</p>
                        {count > 0 && (
                          <p className="text-xs text-Color-Champagne-Gold font-semibold mt-2">
                            {count} {count === 1 ? 'product' : 'products'}
                          </p>
                        )}
                      </div>
                      {selected && (
                        <div className="w-6 h-6 bg-Color-Champagne-Gold rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};