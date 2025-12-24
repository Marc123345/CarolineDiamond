import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, CheckCircle, Circle, Sparkles, Gem, Palette, Ruler } from 'lucide-react';
// Import the carat weights from your config to ensure consistency
import { UNIFIED_PRODUCTS } from '../config/productVariantsConfig';

interface ProgressiveFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilters: {
    shape?: string;
    carat?: string;
    metal?: string;
    setting?: string;
  };
  onFilterChange: (filters: any) => void;
}

export const ProgressiveFilterSidebar: React.FC<ProgressiveFilterSidebarProps> = ({
  isOpen,
  onClose,
  selectedFilters,
  onFilterChange
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: 'Diamond Shape', icon: Gem, description: 'Select your preferred silhouette' },
    { id: 2, title: 'Carat Weight', icon: Ruler, description: 'Choose the size of your center stone' },
    { id: 3, title: 'Metal Color', icon: Palette, description: 'Select your 18K gold preference' },
    { id: 4, title: 'Setting Style', icon: Sparkles, description: 'Choose the ring architecture' }
  ];

  const shapes = [
    { name: 'Round', description: 'Timeless brilliance' },
    { name: 'Oval', description: 'Elongated elegance' },
    { name: 'Princess', description: 'Modern & architectural' },
    { name: 'Pear', description: 'Sophisticated teardrop' }
  ];

  // Dynamically pull carat weights from the Ring configuration
  const carats = UNIFIED_PRODUCTS.rings.variants
    .filter(v => v.diamondType === 'Lab-Grown' && v.metalColor === 'White Gold') // unique carats
    .map(v => ({ value: v.caratWeight, label: v.caratWeight, description: 'Premium selection' }));

  const metals = [
    { name: 'White Gold', description: 'Crisp & contemporary' },
    { name: 'Yellow Gold', description: 'Classic & warm' },
    { name: 'Rose Gold', description: 'Romantic & soft' }
  ];

  const settings = [
    { name: 'Solitaire', description: 'Pure & focused' },
    { name: 'Halo', description: 'Enhanced radiance' },
    { name: 'Pavé', description: 'Sparkling diamond band' }
  ];

  const handleStepComplete = (stepId: number, value: string) => {
    const keys = ['shape', 'carat', 'metal', 'setting'];
    onFilterChange({ ...selectedFilters, [keys[stepId - 1]]: value });
    if (stepId < 4) setCurrentStep(stepId + 1);
  };

  const isStepComplete = (stepId: number) => {
    const keys = ['shape', 'carat', 'metal', 'setting'];
    return !!(selectedFilters as any)[keys[stepId - 1]];
  };

  const renderStepContent = () => {
    const currentData = currentStep === 1 ? shapes : currentStep === 2 ? carats : currentStep === 3 ? metals : settings;
    const currentKey = ['shape', 'carat', 'metal', 'setting'][currentStep - 1];

    return (
      <div className="space-y-3">
        {currentData.map((item: any) => (
          <motion.button
            key={item.name || item.value}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleStepComplete(currentStep, item.name || item.value)}
            className={`w-full p-5 rounded-2xl border-2 transition-all text-left flex items-center justify-between ${
              (selectedFilters as any)[currentKey] === (item.name || item.value)
                ? 'border-[#CDBCAB] bg-[#CDBCAB]/5 shadow-sm'
                : 'border-gray-100 hover:border-[#CDBCAB]/30 bg-white'
            }`}
          >
            <div>
              <div className="font-bold text-gray-900">{item.name || item.label}</div>
              <div className="text-xs text-gray-400 mt-1">{item.description}</div>
            </div>
            {(selectedFilters as any)[currentKey] === (item.name || item.value) && (
              <CheckCircle className="w-5 h-5 text-[#CDBCAB]" />
            )}
          </motion.button>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] lg:hidden overflow-hidden" onClick={onClose}>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute bottom-0 left-0 right-0 h-[90vh] bg-white rounded-t-[40px] shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 max-w-lg mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-gray-900 tracking-tight">Design Your Ring</h2>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Step {currentStep} of 4</p>
            </div>
            <button onClick={onClose} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-10 px-2">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => isStepComplete(step.id) && setCurrentStep(step.id)}
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isStepComplete(step.id) ? 'bg-[#CDBCAB] text-white' : 
                    step.id === currentStep ? 'bg-white border-2 border-[#CDBCAB] text-[#CDBCAB]' : 'bg-gray-100 text-gray-300'
                  }`}
                >
                  {isStepComplete(step.id) ? <CheckCircle className="w-5 h-5" /> : <span className="text-xs font-bold">{step.id}</span>}
                </button>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-[2px] mx-2 ${isStepComplete(steps[idx+1].id) ? 'bg-[#CDBCAB]' : 'bg-gray-100'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step Detail */}
          <div className="mb-8 flex items-center gap-4">
            <div className="w-14 h-14 bg-[#CDBCAB]/10 rounded-2xl flex items-center justify-center">
              {React.createElement(steps[currentStep-1].icon, { className: "w-7 h-7 text-[#CDBCAB]" })}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{steps[currentStep-1].title}</h3>
              <p className="text-sm text-gray-500">{steps[currentStep-1].description}</p>
            </div>
          </div>

          {/* Content Area */}
          {renderStepContent()}

          {/* Summary Card */}
          <div className="mt-10 p-6 bg-gray-50 rounded-3xl border border-gray-100">
            <h4 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4">Ring Configuration</h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {['Shape', 'Carat', 'Metal', 'Setting'].map((label, i) => {
                const val = (selectedFilters as any)[label.toLowerCase()];
                return (
                  <div key={label}>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">{label}</p>
                    <p className={`text-sm font-medium ${val ? 'text-gray-900' : 'text-gray-300 italic'}`}>
                      {val || 'Pending...'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex gap-4">
            {currentStep > 1 && (
              <button onClick={() => setCurrentStep(currentStep - 1)} className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-bold uppercase tracking-widest text-gray-400">
                Back
              </button>
            )}
            {currentStep === 4 && isStepComplete(4) ? (
              <button onClick={onClose} className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl">
                View My Results
              </button>
            ) : (
              isStepComplete(currentStep) && currentStep < 4 && (
                <button onClick={() => setCurrentStep(currentStep + 1)} className="flex-1 py-4 bg-[#CDBCAB] text-white rounded-2xl font-bold uppercase tracking-widest">
                  Continue
                </button>
              )
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};