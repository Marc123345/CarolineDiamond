import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (page: string) => void;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate, className = '' }) => {
  // Defensive check: ensure items is an array
  const safeItems = Array.isArray(items) ? items : [];

  // Filter out any invalid items
  const validItems = safeItems.filter(item => item && typeof item.label === 'string' && item.label.trim() !== '');

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": typeof window !== 'undefined' ? window.location.origin + "/" : "/"
      },
      ...validItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": item.path ? (typeof window !== 'undefined' ? window.location.origin + item.path : item.path) : undefined
      }))
    ]
  };

  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <nav
        className={`flex items-center flex-wrap gap-2 text-sm mb-6 ${className.includes('text-white') ? 'text-white' : 'text-Color-Gray-700'} ${className}`}
        aria-label="Breadcrumb"
      >
      {/* Home link */}
      <motion.button
        onClick={() => onNavigate('/')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center transition-colors duration-200 px-2 py-1 min-w-[44px] min-h-[44px] rounded-lg ${
          className.includes('text-white')
            ? 'text-white/90 hover:text-white hover:bg-white/10'
            : 'text-Color-Gray-700 hover:text-Color-Light-300 hover:bg-Color-Light-300/10'
        }`}
        aria-label="Go to home page"
      >
        <Home className="h-4 w-4 mr-2" />
        Home
      </motion.button>

      {/* Dynamic items */}
      {validItems.length > 0 && validItems.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className={`h-4 w-4 ${className.includes('text-white') ? 'text-white/60' : 'text-Color-Gray-700/60'}`} />
          {item.path ? (
            <motion.button
              onClick={() => onNavigate(item.path!)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center transition-colors duration-200 font-medium px-2 py-1 min-w-[44px] min-h-[44px] rounded-lg ${
                className.includes('text-white')
                  ? 'text-white/90 hover:text-white hover:bg-white/10'
                  : 'text-Color-Gray-700 hover:text-Color-Light-300 hover:bg-Color-Light-300/10'
              }`}
              aria-label={`Go to ${item.label}`}
            >
              {item.icon && <item.icon className="h-4 w-4 mr-1" />}
              {item.label}
            </motion.button>
          ) : (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center font-semibold ${
                className.includes('text-white') ? 'text-white' : 'text-Color-Dark-500'
              }`}
              aria-current="page"
            >
              {item.icon && <item.icon className="h-4 w-4 mr-1" />}
              {item.label}
            </motion.span>
          )}
        </React.Fragment>
      ))}
    </nav>
    </>
  );
};
