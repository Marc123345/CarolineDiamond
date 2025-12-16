import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, CheckCircle, Circle, Sparkles, Gem, Palette, Ruler } from 'lucide-react';

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
    {
      id: 1,
      title: 'Choose Your Shape',
      icon: Gem,
      description: 'Select the diamond shape that speaks to you'
    },
    {
      id: 2,
      title: 'Select Carat Size',
      icon: Ruler,
      description: 'Pick the perfect size for your budget'
    },
    {
      id: 3,
      title: 'Choose Metal Type',
      icon: Palette,
      description: 'Select your preferred metal color'
    },
    {
      id: 4,
      title: 'Select Setting Style',
      icon: Sparkles,
      description: 'Choose how your diamond will be set'
    }
  ];

  const shapes = [
    { name: 'Round', description: 'Classic & timeless' },
    { name: 'Oval', description: 'Elegant & elongated' },
    { name: 'Cushion', description: 'Vintage charm' },
    { name: 'Princess', description: 'Modern square' },
    { name: 'Emerald', description: 'Art deco elegance' },
    { name: 'Pear', description: 'Unique teardrop' }
  ];

  const carats = [
    { value: '0.5-1', label: '0.5 - 1 ct', description: 'Delicate & elegant' },
    { value: '1-1.5', label: '1 - 1.5 ct', description: 'Classic size' },
    { value: '1.5-2', label: '1.5 - 2 ct', description: 'Statement piece' },
    { value: '2+', label: '2+ ct', description: 'Bold & luxurious' }
  ];

  const metals = [
    { name: '18k White Gold', description: 'Modern & sleek' },
    { name: '18k Yellow Gold', description: 'Classic & warm' },
    { name: '18k Rose Gold', description: 'Romantic & trendy' },
    { name: 'Platinum', description: 'Premium & durable' }
  ];

  const settings = [
    { name: 'Solitaire', description: 'Single stone, timeless' },
    { name: 'Halo', description: 'Surrounded by smaller diamonds' },
    { name: 'Three Stone', description: 'Past, present, future' },
    { name: 'Pavé', description: 'Diamond-studded band' }
  ];

  const handleStepComplete = (stepId: number, value: string) => {
    const filterKey =
      stepId === 1 ? 'shape' :
      stepId === 2 ? 'carat' :
      stepId === 3 ? 'metal' :
      'setting';

    onFilterChange({ ...selectedFilters, [filterKey]: value });

    if (stepId < 4) {
      setCurrentStep(stepId + 1);
    }
  };

  const isStepComplete = (stepId: number) => {
    if (stepId === 1) return !!selectedFilters.shape;
    if (stepId === 2) return !!selectedFilters.carat;
    if (stepId === 3) return !!selectedFilters.metal;
    if (stepId === 4) return !!selectedFilters.setting;
    return false;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-2 gap-3">
            {shapes.map((shape) => (
              <motion.button
                key={shape.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStepComplete(1, shape.name)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  selectedFilters.shape === shape.name
                    ? 'border-Color-Light-300 bg-Color-Light-300/10'
                    : 'border-Color-Gray-300 hover:border-Color-Light-300/50'
                }`}
              >
                <div className="font-semibold text-Color-Dark-500 mb-1">{shape.name}</div>
                <div className="text-xs text-Color-Gray-600">{shape.description}</div>
              </motion.button>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="space-y-3">
            {carats.map((carat) => (
              <motion.button
                key={carat.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStepComplete(2, carat.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  selectedFilters.carat === carat.value
                    ? 'border-Color-Light-300 bg-Color-Light-300/10'
                    : 'border-Color-Gray-300 hover:border-Color-Light-300/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-Color-Dark-500 mb-1">{carat.label}</div>
                    <div className="text-xs text-Color-Gray-600">{carat.description}</div>
                  </div>
                  {selectedFilters.carat === carat.value && (
                    <CheckCircle className="w-5 h-5 text-Color-Light-300" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-3">
            {metals.map((metal) => (
              <motion.button
                key={metal.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStepComplete(3, metal.name)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  selectedFilters.metal === metal.name
                    ? 'border-Color-Light-300 bg-Color-Light-300/10'
                    : 'border-Color-Gray-300 hover:border-Color-Light-300/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-Color-Dark-500 mb-1">{metal.name}</div>
                    <div className="text-xs text-Color-Gray-600">{metal.description}</div>
                  </div>
                  {selectedFilters.metal === metal.name && (
                    <CheckCircle className="w-5 h-5 text-Color-Light-300" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-3">
            {settings.map((setting) => (
              <motion.button
                key={setting.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStepComplete(4, setting.name)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  selectedFilters.setting === setting.name
                    ? 'border-Color-Light-300 bg-Color-Light-300/10'
                    : 'border-Color-Gray-300 hover:border-Color-Light-300/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-Color-Dark-500 mb-1">{setting.name}</div>
                    <div className="text-xs text-Color-Gray-600">{setting.description}</div>
                  </div>
                  {selectedFilters.setting === setting.name && (
                    <CheckCircle className="w-5 h-5 text-Color-Light-300" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep - 1];
  const Icon = currentStepData.icon;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] lg:hidden overflow-hidden"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="absolute right-0 top-0 h-full w-[90vw] max-w-[400px] bg-white shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-Color-Gray-200">
            <div>
              <h2 className="text-xl font-bold text-Color-Dark-500">Build Your Ring</h2>
              <p className="text-sm text-Color-Gray-600 mt-1">Step {currentStep} of 4</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-Color-Secondary transition-colors rounded-lg"
              aria-label="Close"
            >
              <X className="h-6 w-6 text-Color-Dark-500" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isStepComplete(step.id)
                          ? 'bg-Color-Light-300 text-white'
                          : step.id === currentStep
                          ? 'bg-Color-Light-300/20 border-2 border-Color-Light-300 text-Color-Light-300'
                          : 'bg-Color-Gray-200 text-Color-Gray-500'
                      }`}
                    >
                      {isStepComplete(step.id) ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${
                      isStepComplete(steps[index + 1].id) ? 'bg-Color-Light-300' : 'bg-Color-Gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Current Step */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-Color-Light-300/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-Color-Light-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-Color-Dark-500">{currentStepData.title}</h3>
                    <p className="text-sm text-Color-Gray-600">{currentStepData.description}</p>
                  </div>
                </div>
              </div>

              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 pt-6 border-t border-Color-Gray-200 flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 btn-secondary py-3"
              >
                Back
              </button>
            )}
            {currentStep < 4 && isStepComplete(currentStep) && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
              >
                Next Step
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            {currentStep === 4 && isStepComplete(4) && (
              <button
                onClick={onClose}
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                View Results
              </button>
            )}
          </div>

          {/* Summary */}
          {(selectedFilters.shape || selectedFilters.carat || selectedFilters.metal || selectedFilters.setting) && (
            <div className="mt-6 p-4 bg-Color-Secondary/50 rounded-xl">
              <h4 className="text-sm font-semibold text-Color-Dark-500 mb-3">Your Selections</h4>
              <div className="space-y-2 text-sm">
                {selectedFilters.shape && (
                  <div className="flex items-center justify-between">
                    <span className="text-Color-Gray-600">Shape:</span>
                    <span className="font-medium text-Color-Dark-500">{selectedFilters.shape}</span>
                  </div>
                )}
                {selectedFilters.carat && (
                  <div className="flex items-center justify-between">
                    <span className="text-Color-Gray-600">Carat:</span>
                    <span className="font-medium text-Color-Dark-500">{selectedFilters.carat}</span>
                  </div>
                )}
                {selectedFilters.metal && (
                  <div className="flex items-center justify-between">
                    <span className="text-Color-Gray-600">Metal:</span>
                    <span className="font-medium text-Color-Dark-500">{selectedFilters.metal}</span>
                  </div>
                )}
                {selectedFilters.setting && (
                  <div className="flex items-center justify-between">
                    <span className="text-Color-Gray-600">Setting:</span>
                    <span className="font-medium text-Color-Dark-500">{selectedFilters.setting}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
