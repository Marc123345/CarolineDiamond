export function extractAllCaratWeights(product: ProcessedProduct): number[] {
  const carats = new Set<number>();

  // 1. CRITICAL FIX: Check Variants first
  // This detects sizes like "Lab-Grown 0.50ct" inside your variant options
  if (product.variants && product.variants.length > 0) {
    product.variants.forEach(variant => {
      if (variant.selectedOptions) {
        Object.values(variant.selectedOptions).forEach(value => {
          const optionMatch = String(value).match(/(\d+\.?\d*)\s*ct/i);
          if (optionMatch) {
            const val = parseFloat(optionMatch[1]);
            if (!isNaN(val) && val > 0 && val < 10) carats.add(val);
          }
        });
      }
      
      // Fallback: Check the variant title itself
      const titleMatch = variant.title?.match(/(\d+\.?\d*)\s*ct/i);
      if (titleMatch) {
        const val = parseFloat(titleMatch[1]);
        if (!isNaN(val) && val > 0 && val < 10) carats.add(val);
      }
    });
  }

  // 2. Keep existing checks for backward compatibility
  if (product.metafields?.carat) {
    const val = parseFloat(product.metafields.carat);
    if (!isNaN(val)) carats.add(val);
  }

  if (product.tags) {
    product.tags.forEach(tag => {
      const match = tag.match(/(\d+\.?\d*)\s*ct/i);
      if (match) carats.add(parseFloat(match[1]));
    });
  }

  return Array.from(carats).sort((a, b) => a - b);
}