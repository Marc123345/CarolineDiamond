import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Ruler, Info, Check } from 'lucide-react';
import {
  ProductFilters,
  CARAT_WEIGHTS,
  CLARITY_GRADES,
  COMMON_CLARITY_GRADES,
  CERTIFICATIONS
} from '../../config/filterConfig';
import { getClarityDisplayInfo, getCertificationDisplayInfo } from '../../utils/diamondFilterUtils';
import { useTranslate } from '../../hooks/useTranslate';

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
  const t = useTranslate();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['carat', 'clarity', 'certification'])
  );
  const [showAllClarity, setShowAllClarity] = useState(false);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  const isExpanded = (sectionId: string) => expandedSections.has(sectionId);

  // Filter Toggle Handlers
  const handleToggle = (key: keyof ProductFilters, value: any) => {
    const current = (filters[key] as any[]) || [];
    const exists = key === 'caratWeights' 
      ? current.some((w: any) => w.label === value.label)
      : current.includes(value);

    const updated = exists
      ? current.filter((v: any) => (key === 'caratWeights' ? v.label !== value.label : v !== value))
      : [...current, value];

    onFiltersChange({ [key]: updated });
  };

  return (
    <div className="space-y-4">
      {/* 1. Custom Size Banner (Lab-Grown Logic) */}
      {filters.diamondOrigin === 'Lab-Grown Diamond' && onRequestCustomSize && (
        <div className="bg-[#CDBCAB]/5 p-5 rounded-2xl border border-[#CDBCAB]/20">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-[#CDBCAB] rounded-xl shadow-sm">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900 mb-1">{t('Tailor Your Diamond')}</h4>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                {t('Lab-grown diamonds can be crafted to any specification. Request your perfect size and grade.')}
              </p>
              <button
                onClick={onRequestCustomSize}
                className="w-full py-3 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
              >
                <Ruler className="h-4 w-4" />
                {t('Request Custom Size')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Carat Weight Section */}
      <FilterSection 
        id="carat" 
        title={t('Carat Weight')} 
        isOpen={isExpanded('carat')} 
        onToggle={() => toggleSection('carat')}
        badgeCount={filters.caratWeights?.length}
      >
        <div className="grid grid-cols-2 gap-2">
          {CARAT_WEIGHTS.map((weight) => {
            const isSelected = filters.caratWeights?.some(w => w.label === weight.label);
            const count = productCounts[weight.label] || 0;
            return (
              <button
                key={weight.label}
                onClick={() => handleToggle('caratWeights', weight)}
                disabled={count === 0}
                className={`relative p-4 rounded-xl border-2 transition-all text-left group ${
                  isSelected ? 'border-[#CDBCAB] bg-[#CDBCAB]/5' : 'border-gray-50 hover:border-[#CDBCAB]/30'
                } ${count === 0 ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
              >
                <span className="block font-bold text-gray-900">{weight.label}</span>
                {count > 0 && <span className="text-[10px] text-gray-400 uppercase font-bold">{count} {t('options')}</span>}
                {isSelected && <Check className="absolute top-2 right-2 w-4 h-4 text-[#CDBCAB]" />}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* 3. Diamond Clarity Section */}
      <FilterSection 
        id="clarity" 
        title={t('Diamond Clarity')} 
        isOpen={isExpanded('clarity')} 
        onToggle={() => toggleSection('clarity')}
        badgeCount={filters.clarityGrades?.length}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {COMMON_CLARITY_GRADES.map((clarity) => {
              const isSelected = filters.clarityGrades?.includes(clarity as any);
              const info = getClarityDisplayInfo(clarity as any);
              return (
                <button
                  key={clarity}
                  onClick={() => handleToggle('clarityGrades', clarity)}
                  className={`p-4 rounded-xl border-2 transition-all text-left relative ${
                    isSelected ? 'border-[#CDBCAB] bg-[#CDBCAB]/5' : 'border-gray-50 hover:border-[#CDBCAB]/30'
                  }`}
                >
                  <span className="block font-bold text-gray-900">{clarity}</span>
                  <span className="block text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{info.quality}</span>
                  {isSelected && <Check className="absolute top-2 right-2 w-4 h-4 text-[#CDBCAB]" />}
                </button>
              );
            })}
          </div>
          <button 
            onClick={() => setShowAllClarity(!showAllClarity)}
            className="text-[10px] font-bold uppercase tracking-widest text-[#CDBCAB] hover:text-gray-900 transition-colors"
          >
            {showAllClarity ? t('Show popular grades') : t('View all clarity grades')}
          </button>
        </div>
      </FilterSection>

      {/* 4. Certification Section */}
      <FilterSection 
        id="certification" 
        title={t('Certification')} 
        isOpen={isExpanded('certification')} 
        onToggle={() => toggleSection('certification')}
        badgeCount={filters.certifications?.length}
      >
        <div className="space-y-2">
          {CERTIFICATIONS.map((cert) => {
            const isSelected = filters.certifications?.includes(cert as any);
            const info = getCertificationDisplayInfo(cert as any);
            return (
              <button
                key={cert}
                onClick={() => handleToggle('certifications', cert)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                  isSelected ? 'border-[#CDBCAB] bg-[#CDBCAB]/5' : 'border-gray-50 hover:border-[#CDBCAB]/30'
                }`}
              >
                <div>
                  <span className="font-bold text-gray-900 mr-2">{info.name}</span>
                  <span className="text-[10px] text-green-600 font-bold uppercase tracking-tighter">{info.reputation}</span>
                  <p className="text-[10px] text-gray-400 mt-0.5">{info.fullName}</p>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#CDBCAB]" />}
              </button>
            );
          })}
        </div>
      </FilterSection>
    </div>
  );
};

// Reusable Sub-component for Accordion Sections
const FilterSection: React.FC<{ id: string; title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode; badgeCount?: number }> = ({ 
  title, isOpen, onToggle, children, badgeCount 
}) => (
  <div className="border-b border-gray-100 last:border-0 pb-2">
    <button onClick={onToggle} className="w-full flex items-center justify-between py-4 group">
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{title}</h3>
        {badgeCount && badgeCount > 0 && (
          <span className="w-5 h-5 flex items-center justify-center bg-[#CDBCAB] text-white text-[10px] font-bold rounded-full">
            {badgeCount}
          </span>
        )}
      </div>
      {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[800px] opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
      {children}
    </div>
  </div>
);