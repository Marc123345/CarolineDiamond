import React, { memo } from 'react';
import { Gem, ArrowRight } from 'lucide-react';

interface ExpertAdviceCTAProps {
  onContactClick: () => void;
}

export const ExpertAdviceCTA = memo<ExpertAdviceCTAProps>(({ onContactClick }) => {
  return (
    <div className="bg-Color-Dark-500 p-8 flex items-center justify-between group overflow-hidden relative">
      <Gem className="absolute -right-4 -top-4 w-24 h-24 text-white/[0.03] rotate-12" />
      <div className="relative z-10">
        <h4 className="text-white text-lg font-serif italic mb-1">Seek Personal Guidance?</h4>
        <p className="text-Color-Light-300/60 text-xs tracking-widest font-light">
          Consult with our master artisans.
        </p>
      </div>
      <button
        onClick={onContactClick}
        className="relative z-10 w-12 h-12 rounded-full bg-Color-Champagne-Gold flex items-center justify-center hover:bg-white transition-colors duration-500"
        aria-label="Contact us"
      >
        <ArrowRight className="w-5 h-5 text-Color-Dark-500" />
      </button>
    </div>
  );
});

ExpertAdviceCTA.displayName = 'ExpertAdviceCTA';
