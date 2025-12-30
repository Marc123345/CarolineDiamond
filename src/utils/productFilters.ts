import type { ProcessedProduct, ProductVariant } from '../types'; // Adjust path as needed

// ==========================================
// 1. CONFIGURATION & CONSTANTS
// ==========================================

export const FILTER_TAGS = {
  jewelryType: ['necklace', 'earrings', 'engagement-ring'],
  ringStyle: [
    'solitaire',
    'halo',
    'Solitaire + Side Diamonds',
    'Halo + Side Diamonds',
    'no-side-diamonds',
    'with-side-diamonds'
  ],
  diamondShape: [
    'round-diamond',
    'oval-diamond',
    'princess-diamond',
    'pear-diamond',
    'marquise-diamond',
    'emerald-diamond',
    'cushion-diamond',
    'heart-diamond'
  ],
  metalColor: [
    '18K Rose Gold',
    '18K Yellow Gold',
    '18K White Gold'
  ],
  caratWeight: [
    '0.30ct',
    '0.50ct',
    '1.00ct',
    '1.50ct',
    'Natural Diamond'
  ]
};

// Map of values to fix inconsistent data at runtime
const DATA_FIXES: Record<string, string> = {
  '0.50c': '0.50ct',
  'Rose Gold': '18K Rose Gold',
  '18k Rose Gold': '18K Rose Gold',
  'Yellow Gold': '18K Yellow Gold',
  'White Gold': '18K White Gold',
  'Diamond': 'Natural Diamond'
};

export interface FilterState {
  jewelryType: string[];
  ringStyle: string[];
  diamondShape: string[];
  metalColor: string[];
  caratWeight: string[];
  ringSize: string[];
  minPrice?: number;
  maxPrice?: number;
}

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

/**
 * Normalizes a string for comparison (lowercase, trimmed).
 */
const normalize = (str: string): string => str?.toLowerCase().trim() || '';

/**
 * Cleans an option value using the DATA_FIXES map.
 * e.g., "Rose Gold" -> "18K Rose Gold"
 */
export const cleanOptionValue = (value: string): string => {
  const cleanVal = value.trim();
  return DATA_FIXES[cleanVal] || cleanVal;
};

/**
 * Checks if a product's variant option matches a selected filter.
 * Handles partial matches like "Lab-Grown 0.50ct" matching "0.50ct".
 */
const matchesVariantOption = (variantValue: string, filterValue: string): boolean => {
  const cleanVariantVal = normalize(cleanOptionValue(variantValue));
  const cleanFilterVal = normalize(filterValue);
  
  // Exact match (after cleaning)
  if (cleanVariantVal === cleanFilterVal) return true;
  
  // Partial match for "Diamond Type" (e.g. "Lab-Grown 0.50ct" contains "0.50ct")
  // But strictly prevent "1.50ct" from matching "0.50ct"
  if (cleanVariantVal.includes(cleanFilterVal)) {
    // specialized check to ensure 0.50ct doesn't match 1.50ct purely by substring
    // Simple check: is the char before the match a digit?
    const idx = cleanVariantVal.indexOf(cleanFilterVal);
    if (idx > 0) {
      const prevChar = cleanVariantVal[idx - 1];
      if (/[0-9]/.test(prevChar)) return false; // e.g. '1.50ct' contains '0.50ct' but '1' precedes it
    }
    return true;
  }
  
  return false;
};

// ==========================================
// 3. MAIN FILTER LOGIC
// ==========================================

export const filterProducts = (products: ProcessedProduct[], filters: FilterState): ProcessedProduct[] => {
  return products.filter((product) => {
    
    // --- STEP 1: TAG FILTERS (Jewelry Type, Ring Style, Diamond Shape) ---
    // Logic: OR within category (e.g. Necklace OR Earrings), AND across categories
    
    // Jewelry Type
    if (filters.jewelryType.length > 0) {
      const hasType = filters.jewelryType.some(type => 
        product.tags.some(t => normalize(t) === normalize(type))
      );
      if (!hasType) return false;
    }

    // Ring Style
    if (filters.ringStyle.length > 0) {
      const hasStyle = filters.ringStyle.some(style => 
        product.tags.some(t => normalize(t) === normalize(style))
      );
      if (!hasStyle) return false;
    }

    // Diamond Shape
    if (filters.diamondShape.length > 0) {
      const hasShape = filters.diamondShape.some(shape => 
        product.tags.some(t => normalize(t) === normalize(shape))
      );
      if (!hasShape) return false;
    }

    // --- STEP 2: VARIANT FILTERS (Metal Color, Carat Weight, Ring Size) ---
    // Logic: Keep product if AT LEAST ONE variant matches ALL active variant filters.
    
    const activeVariantFilters = {
      metalColor: filters.metalColor.length > 0,
      caratWeight: filters.caratWeight.length > 0,
      ringSize: filters.ringSize.length > 0,
      price: (filters.minPrice !== undefined || filters.maxPrice !== undefined)
    };

    // Optimization: If no variant filters are active, skip this loop
    if (!activeVariantFilters.metalColor && !activeVariantFilters.caratWeight && !activeVariantFilters.ringSize && !activeVariantFilters.price) {
      return true;
    }

    const matchingVariants = product.variants.filter(variant => {
      const options = variant.selectedOptions; // Record<string, string>
      
      // Check Metal Color
      if (activeVariantFilters.metalColor) {
        // Find the option that represents metal (could be "Metal Color")
        const metalVal = options['Metal Color'] || options['Material']; 
        if (!metalVal) return false; // If product doesn't have this option, it fails filter
        
        const matchesMetal = filters.metalColor.some(filterVal => 
          matchesVariantOption(metalVal, filterVal)
        );
        if (!matchesMetal) return false;
      }

      // Check Carat Weight (usually in "Diamond Type" or "Carat")
      if (activeVariantFilters.caratWeight) {
        const caratVal = options['Diamond Type'] || options['Carat'] || options['Size']; // Fallbacks
        if (!caratVal) return false;

        const matchesCarat = filters.caratWeight.some(filterVal => 
          matchesVariantOption(caratVal, filterVal)
        );
        if (!matchesCarat) return false;
      }

      // Check Ring Size
      if (activeVariantFilters.ringSize) {
        const sizeVal = options['Ring Size'] || options['Size'];
        if (!sizeVal) return false;

        // Exact match for size usually
        const matchesSize = filters.ringSize.some(filterVal => 
          cleanOptionValue(sizeVal) === filterVal
        );
        if (!matchesSize) return false;
      }

      // Check Price
      if (activeVariantFilters.price) {
        const price = variant.price;
        if (filters.minPrice !== undefined && price < filters.minPrice) return false;
        if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
      }

      return true;
    });

    return matchingVariants.length > 0;
  });
};

// ==========================================
// 4. UTILITY: GET ACTIVE PRICE
// ==========================================

/**
 * Returns the correct price for a product based on selected filters/options.
 * Useful for updating the UI price display dynamically.
 */
export const getActiveVariant = (
  product: ProcessedProduct, 
  selectedOptions: Record<string, string>
): ProductVariant | undefined => {
  return product.variants.find(variant => {
    return Object.entries(selectedOptions).every(([key, value]) => {
      const variantValue = variant.selectedOptions[key];
      if (!variantValue) return false;
      return cleanOptionValue(variantValue) === cleanOptionValue(value);
    });
  });
};