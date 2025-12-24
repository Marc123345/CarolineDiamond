// Add these to your config to support the new product lines
export const EARRING_STUD_VARIANTS: NecklaceVariant[] = [
  {
    metalColor: 'White Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '0.30 ct',
    price: 490,
    shopifyHandle: 'timeless-diamond-stud-earrings-18k-gold-0-30ct',
    available: true
  },
  // ... Repeat for 0.50ct (€590) and 1.00ct (€890)
  {
    metalColor: 'White Gold',
    diamondType: 'Natural',
    caratWeight: '0.50 ct',
    price: null, // Price on Request
    shopifyHandle: 'timeless-diamond-earrings',
    available: true
  }
];

export const SOLITAIRE_RING_VARIANTS: NecklaceVariant[] = [
  // 0.50ct (€790), 1.00ct (€990), 1.50ct (€1,250)
  {
    metalColor: 'Yellow Gold',
    diamondType: 'Lab-Grown',
    caratWeight: '0.50 ct',
    price: 790,
    shopifyHandle: '18k-gold-lab-grown-diamond-solitaire-engagement-ring-0-50ct',
    available: true
  },
  {
    metalColor: 'Yellow Gold',
    diamondType: 'Natural',
    caratWeight: '0.50 ct',
    price: null,
    shopifyHandle: 'solitaire-ring-no-side-diamonds',
    available: true
  }
];