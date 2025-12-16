import React from 'react';
import { Search, Sparkles, Mail, Phone } from 'lucide-react';

interface EmptyStateProps {
  searchQuery?: string;
  hasFilters?: boolean;
  onClearAll: () => void;
  onNavigate: (page: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  searchQuery,
  hasFilters,
  onClearAll,
  onNavigate
}) => {
  return (
    <div className="text-center py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Search className="h-24 w-24 text-Color-Champagne-Gold opacity-40" />
            <Sparkles className="h-10 w-10 text-Color-Champagne-Gold absolute -top-2 -right-2 animate-pulse" />
          </div>
        </div>

        <h3 className="text-3xl font-bold text-Color-Netural-Black mb-4">
          {searchQuery ? 'No matches found' : 'No products available'}
        </h3>

        <p className="text-lg text-gray-600 mb-8">
          {searchQuery ? (
            <>
              We couldn't find any jewelry matching <strong>"{searchQuery}"</strong>.
              <br />Try adjusting your search or explore our collections.
            </>
          ) : hasFilters ? (
            <>
              No products match your current filter selection.
              <br />Try removing some filters to see more results.
            </>
          ) : (
            <>
              Our collection is currently being updated.
              <br />Check back soon or contact us for custom designs.
            </>
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={onClearAll}
            className="px-8 py-4 bg-Color-Netural-Black text-white font-semibold rounded-lg hover:bg-Color-Champagne-Gold transition-all duration-300 shadow-md hover:shadow-lg min-h-[48px]"
            aria-label="Clear all filters"
          >
            {searchQuery || hasFilters ? 'Clear Filters & Search' : 'View All Products'}
          </button>

          <button
            onClick={() => onNavigate('/contact')}
            className="px-8 py-4 bg-white border-2 border-Color-Netural-Black text-Color-Netural-Black font-semibold rounded-lg hover:bg-Color-Netural-Black hover:text-white transition-all duration-300 shadow-md hover:shadow-lg min-h-[48px]"
            aria-label="Contact us for custom jewelry"
          >
            Custom Design Request
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12 text-left">
          <div className="bg-Color-Primary-Beige/30 p-6 rounded-xl border border-Color-Champagne-Gold/20">
            <h4 className="text-lg font-bold text-Color-Netural-Black mb-3">Browse Collections</h4>
            <p className="text-gray-600 mb-4">Explore our curated jewelry collections</p>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('/engagement-rings')}
                className="block w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-Color-Champagne-Gold hover:text-white transition-colors text-sm font-medium"
              >
                Engagement Rings
              </button>
              <button
                onClick={() => onNavigate('/wedding-rings')}
                className="block w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-Color-Champagne-Gold hover:text-white transition-colors text-sm font-medium"
              >
                Wedding Rings
              </button>
              <button
                onClick={() => onNavigate('/fine-jewelry')}
                className="block w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-Color-Champagne-Gold hover:text-white transition-colors text-sm font-medium"
              >
                Fine Jewelry
              </button>
            </div>
          </div>

          <div className="bg-Color-Primary-Beige/30 p-6 rounded-xl border border-Color-Champagne-Gold/20">
            <h4 className="text-lg font-bold text-Color-Netural-Black mb-3">Need Help?</h4>
            <p className="text-gray-600 mb-4">Our team is here to assist you</p>
            <div className="space-y-3">
              <a
                href="tel:+32471762298"
                className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg hover:bg-Color-Champagne-Gold hover:text-white transition-colors text-sm font-medium"
              >
                <Phone className="h-4 w-4" />
                <span>+32 471 76 22 98</span>
              </a>
              <a
                href="mailto:info@diamondsbycs.com"
                className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg hover:bg-Color-Champagne-Gold hover:text-white transition-colors text-sm font-medium"
              >
                <Mail className="h-4 w-4" />
                <span>info@diamondsbycs.com</span>
              </a>
              <button
                onClick={() => onNavigate('/contact')}
                className="w-full text-center px-4 py-2 bg-Color-Netural-Black text-white rounded-lg hover:bg-Color-Champagne-Gold transition-colors text-sm font-semibold"
              >
                Book an Appointment
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-gradient-to-r from-Color-Primary-Beige/50 to-Color-Champagne-Gold/20 rounded-xl border border-Color-Champagne-Gold/30">
          <h4 className="text-xl font-bold text-Color-Netural-Black mb-2">Looking for something specific?</h4>
          <p className="text-gray-700 mb-4">
            Caroline specializes in custom-designed jewelry. Let's create your perfect piece together.
          </p>
          <button
            onClick={() => onNavigate('/contact')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-Color-Netural-Black text-white font-semibold rounded-lg hover:bg-Color-Champagne-Gold transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Sparkles className="h-5 w-5" />
            <span>Start Your Custom Design</span>
          </button>
        </div>
      </div>
    </div>
  );
};
