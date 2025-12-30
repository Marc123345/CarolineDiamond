// ==========================================
// 💎 BUSINESS LOGIC & DATA NORMALIZATION (FIXED)
// ==========================================

// 1. Jewelry Type Logic
const getJewelryCategory = (product: ProcessedProduct): string | undefined => {
  if (!product || !product.productType) return undefined;
  const type = product.productType.toLowerCase();
  if (type.includes('necklace')) return 'Necklaces';
  if (type.includes('earrings')) return 'Earrings';
  if (type.includes('engagement ring') || type.includes('ring')) return 'Rings';
  return undefined;
};

// 2. Ring Style Logic (Based on Tags)
const getRingStyle = (product: ProcessedProduct): string | undefined => {
  if (!product || !product.tags) return undefined;
  const tags = product.tags;
  
  if (tags.includes('Solitaire + Side Diamonds')) return 'Solitaire with Side Diamonds';
  if (tags.includes('solitaire')) return 'Solitaire';
  if (tags.includes('Halo + Side Diamonds')) return 'Halo with Side Diamonds';
  if (tags.includes('halo')) return 'Halo';
  
  return undefined;
};

// 3. Diamond Shape Logic (Extract from Title)
const getDiamondShape = (product: ProcessedProduct): string | undefined => {
  if (!product || !product.title) return undefined;
  const title = product.title.toLowerCase();
  const shapes = ["Round", "Oval", "Princess", "Pear", "Marquise", "Emerald", "Cushion", "Heart"];
  
  const foundShape = shapes.find(shape => title.includes(shape.toLowerCase()));
  return foundShape;
};

// 4. Metal Color Logic (Standardization)
const getMetalColor = (product: ProcessedProduct): string | undefined => {
  if (!product) return undefined;
  // Safe access to title and tags
  const title = product.title || '';
  const tags = product.tags || [];
  const searchStr = (title + tags.join(' ')).toLowerCase();
  
  if (searchStr.includes('rose gold')) return '18K Rose Gold';
  if (searchStr.includes('yellow gold')) return '18K Yellow Gold';
  if (searchStr.includes('white gold')) return '18K White Gold';
  return undefined;
};

// 5. Carat Weight Logic
const getCaratWeight = (product: ProcessedProduct): string | undefined => {
  if (!product) return undefined;
  // Safe access to title and tags
  const title = product.title || '';
  const tags = product.tags || [];
  const searchStr = (title + tags.join(' ')).toLowerCase();
  
  if (searchStr.includes('0.30') || searchStr.includes('0.3')) return '0.30ct';
  if (searchStr.includes('0.50') || searchStr.includes('0.5')) return '0.50ct';
  if (searchStr.includes('1.00') || searchStr.includes('1.0')) return '1.00ct';
  if (searchStr.includes('1.50') || searchStr.includes('1.5')) return '1.50ct';
  if (searchStr.includes('natural')) return 'Natural Diamond';
  
  return undefined;
};

// 6. Pricing Logic Calculator
export const calculateProductPrice = (product: ProcessedProduct): number | string => {
  if (!product) return 0;
  
  const category = getJewelryCategory(product);
  const tags = product.tags || [];
  const carat = getCaratWeight(product); 
  const isNatural = carat === 'Natural Diamond';
  
  if (isNatural) return 3000; 

  if (category === 'Necklaces') {
    if (carat === '0.50ct') return 750;
    if (carat === '1.00ct') return 1190;
  }

  if (category === 'Earrings') {
    if (carat === '0.30ct') return 490;
    if (carat === '0.50ct') return 590;
    if (carat === '1.00ct') return 890;
  }

  if (category === 'Rings') {
    const hasSideDiamonds = tags.includes('Solitaire + Side Diamonds') || tags.includes('Halo + Side Diamonds');
    const sideDiamondPremium = hasSideDiamonds ? 360 : 0;
    let basePrice = 0;

    if (carat === '0.50ct') basePrice = 790;
    else if (carat === '1.00ct') basePrice = 990;
    else if (carat === '1.50ct') basePrice = 1250;

    if (basePrice > 0) {
      return basePrice + sideDiamondPremium;
    }
  }

  // Fallback
  return product.price?.amount ? parseFloat(product.price.amount) : 0;
};