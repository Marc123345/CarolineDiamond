import React from 'react';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (page: string) => void;
  className?: string;
  isLight?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  items, 
  onNavigate, 
  className = '', 
  isLight = false 
}) => {
  const validItems = Array.isArray(items) 
    ? items.filter(item => item?.label?.trim()) 
    : [];

  // Animation variants for the high-end "staggered reveal"
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, x: -5 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  // Structured Data logic remains for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "/" },
      ...validItems.map((item, i) => ({
        "@type": "ListItem",
        "position": i + 2,
        "name": item.label,
        "item": item.path || undefined
      }))
    ]
  };

  const textColor = isLight ? 'text-white' : 'text-Color-Dark-500';
  const secondaryColor = isLight ? 'text-white/40' : 'text-Color-Gray-400';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <motion.nav
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className={`flex items-center flex-wrap gap-x-4 mb-10 ${className}`}
        aria-label="Breadcrumb"
      >
        {/* --- HOME LINK --- */}
        <motion.div variants={itemVars} className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('/')}
            className={`relative group text-[10px] uppercase tracking-[0.4em] font-bold ${textColor} transition-opacity hover:opacity-70`}
          >
            Home
            <motion.div 
              className={`absolute -bottom-1 left-0 w-full h-[1px] ${isLight ? 'bg-white' : 'bg-Color-Champagne-Gold'} origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} 
            />
          </button>
          <span className={`text-[10px] font-light ${secondaryColor} select-none`}>/</span>
        </motion.div>

        {/* --- DYNAMIC ITEMS --- */}
        {validItems.map((item, index) => {
          const isLast = index === validItems.length - 1;

          return (
            <motion.div key={index} variants={itemVars} className="flex items-center gap-4">
              {!isLast && item.path ? (
                <button
                  onClick={() => onNavigate(item.path!)}
                  className={`relative group text-[10px] uppercase tracking-[0.4em] font-bold ${textColor} transition-opacity hover:opacity-70`}
                >
                  {item.label}
                  <motion.div 
                    className={`absolute -bottom-1 left-0 w-full h-[1px] ${isLight ? 'bg-white' : 'bg-Color-Champagne-Gold'} origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} 
                  />
                </button>
              ) : (
                <span className={`text-[10px] uppercase tracking-[0.4em] font-black ${isLast ? 'text-Color-Champagne-Gold' : textColor}`}>
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className={`text-[10px] font-light ${secondaryColor} select-none`}>/</span>
              )}
            </motion.div>
          );
        })}
      </motion.nav>
    </>
  );
};