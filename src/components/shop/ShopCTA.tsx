import React from 'react';

interface ShopCTAProps {
  onNavigate: (page: string) => void;
}

export const ShopCTA: React.FC<ShopCTAProps> = ({ onNavigate }) => {
  return (
    <section className="py-16 bg-Color-Primary-Beige/30">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-Color-Netural-Black mb-4">
          Can't find what you're looking for?
        </h2>
        <p className="text-base sm:text-lg text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
          Caroline would love to design a unique piece of jewelry especially for you.
          Make an appointment for a personal consultation.
        </p>
        <button
          onClick={() => onNavigate('/contact')}
          className="inline-flex items-center bg-Color-Netural-Black text-white px-8 py-4 font-semibold hover:bg-Color-Champagne-Gold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Book Appointment for Custom Work
        </button>
      </div>
    </section>
  );
};