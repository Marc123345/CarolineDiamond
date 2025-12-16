// Site-wide configuration for Diamonds by CS
// This file contains all shared configuration data used across components

// Unified Navigation configuration - consistent across desktop, mobile, and footer
export const primaryCategories = [
  {
    id: 'shop',
    title: 'Shop',
    icon: 'ShoppingBag',
    subcategories: [
      { title: 'All Jewelry', page: '/shop', icon: 'Sparkles', description: 'Browse our complete collection' },
      { title: 'Engagement Rings', page: '/shop/engagement-rings', icon: 'Heart', description: 'Forever starts here' },
      { title: 'Wedding Rings', page: '/shop/wedding-rings', icon: 'Gem', description: 'Symbols of eternal love' },
      { title: 'Diamond Earrings', page: '/shop/earrings', icon: 'Sparkles', description: 'Elegant studs & drops' },
      { title: 'Diamond Necklaces', page: '/shop/necklaces', icon: 'Diamond', description: 'Timeless pendants' },
      { title: 'Fine Jewelry', page: '/shop/fine-jewelry', icon: 'Zap', description: 'All jewelry pieces' }
    ]
  },
  {
    id: 'collections',
    title: 'Collections',
    icon: 'Palette',
    subcategories: [
      { title: 'All Collections', page: '/collections', icon: 'Sparkles', description: 'Exclusive designs' },
      { title: 'New Arrivals', page: '/collections/new-arrivals', icon: 'Zap', description: 'Latest creations' },
      { title: 'Bestsellers', page: '/collections/bestsellers', icon: 'Award', description: 'Customer favorites' },
      { title: 'Special Collections', page: '/collections/special', icon: 'Crown', description: 'Limited editions' }
    ]
  },
  {
    id: 'about',
    title: 'About',
    icon: 'Info',
    subcategories: [
      { title: 'Our Story', page: '/about', icon: 'User', description: 'Meet Caroline' },
      { title: 'Customer Stories', page: '/kind-words', icon: 'Star', description: 'Video testimonials' }
    ]
  }
];

export const staticLinks = [
  { page: '/contact', label: 'Contact', icon: 'MapPin' }
];

// Mobile menu structure - grouped for better organization
export const mobileMenuGroups = [
  {
    title: 'Shop',
    items: [
      { id: 'shop-all', icon: 'ShoppingBag', label: 'All Jewelry', page: '/shop', tooltip: 'Browse our collection' },
      { id: 'engagement', icon: 'Heart', label: 'Engagement Rings', page: '/shop/engagement-rings', tooltip: 'Forever starts here' },
      { id: 'wedding', icon: 'Gem', label: 'Wedding Rings', page: '/shop/wedding-rings', tooltip: 'Symbols of eternal love' },
      { id: 'earrings', icon: 'Sparkles', label: 'Diamond Earrings', page: '/shop/earrings', tooltip: 'Elegant studs & drops' },
      { id: 'necklaces', icon: 'Diamond', label: 'Diamond Necklaces', page: '/shop/necklaces', tooltip: 'Timeless pendants' },
      { id: 'fine-jewelry', icon: 'Zap', label: 'Fine Jewelry', page: '/shop/fine-jewelry', tooltip: 'All jewelry pieces' }
    ]
  },
  {
    title: 'Discover',
    items: [
      { id: 'collections', icon: 'Palette', label: 'Collections', page: '/collections', tooltip: 'Exclusive designs' },
      { id: 'reviews', icon: 'Star', label: 'Customer Reviews', page: '/kind-words', tooltip: 'Customer stories' }
    ]
  },
  {
    title: 'Get Help',
    items: [
      { id: 'about', icon: 'User', label: 'About Caroline', page: '/about', tooltip: 'Our story' },
      { id: 'contact', icon: 'MapPin', label: 'Contact & Showroom', page: '/contact', tooltip: 'Visit us in Antwerp' }
    ]
  }
];

// Brand assets
export const brandAssets = {
  logo: '/logo.svg',
  logoAlt: 'Diamonds by CS Logo'
};

// Hero content
export const heroContent = {
  asset: {
    src: 'https://ik.imagekit.io/qcvroy8xpd/envato_video_gen_Sep_11_2025_18_25_09%20(1).mp4?updatedAt=1757615170073'
  }
};

// Contact information
export const contactInfo = {
  phone: '+32 471 76 22 98',
  email: 'info@diamondsbycs.com',
  address: {
    street: 'Schupstraat 9 – 11',
    city: 'Antwerpen',
    postalCode: '2018',
    country: 'Belgium'
  },
  coordinates: {
    lat: 51.2194,
    lng: 4.4025
  },
  parking: {
    address: 'Lange Herentalsestraat 73',
    note: '10 min. walking distance from Central Station'
  },
  hours: 'Open every day by appointment, even on Sundays!'
};

// Google Reviews data
export const reviewsInfo = {
  rating: '5.0',
  totalReviews: '133',
  platform: 'Google reviews'
};

// Caroline section content
export const carolineSection = {
  subtitle: 'Meet the artisan behind every piece',
  description: 'With over 15 years of experience in Antwerp\'s diamond district, Caroline Schreiber creates jewelry that tells your unique story. Every piece is handcrafted with passion, precision, and an unwavering commitment to quality.',
  quote: {
    text: 'Jewelry is not just an accessory — it\'s a way to express your deepest emotions and most precious memories.',
    author: 'Caroline Schreiber'
  },
  cta: {
    page: '/about'
  },
  images: {
    workshop: 'https://diamondsbycs.com/images/uploads/upload-66680b304c4c8.jpg',
    portrait: 'https://diamondsbycs.com/images/uploads/upload-666be9d315beb.jpg'
  }
};

// Bestseller products - Updated from Shopify inventory
export const bestsellerProducts = [
  {
    id: 'solitaire-ring-no-side-diamonds',
    name: '18K Gold Lab-Grown Diamond Solitaire Engagement Ring',
    price: 1700,
    image: 'https://cdn.shopify.com/s/files/1/0762/6122/8788/files/image1.png?v=1760005514',
    category: 'Engagement Rings',
    description: 'A timeless solitaire engagement ring showcasing a single D–VS2 lab-grown diamond',
    isCustomizable: true
  },
  {
    id: 'solitaire-ring-emerald-with-side-diamonds',
    name: '18K Gold Emerald-Cut Lab-Grown Diamond Solitaire Engagement Ring with Side Diamonds',
    price: 1700,
    image: 'https://cdn.shopify.com/s/files/1/0762/6122/8788/files/image1_672de5e8-1333-4dca-87bf-1b9fd8089ef7.png?v=1760008492',
    category: 'Engagement Rings',
    description: 'Emerald-cut solitaire with delicate side stones that enhance its sleek geometry',
    isCustomizable: true
  },
  {
    id: 'solitaire-ring-princess-with-side-diamonds',
    name: '18K Gold Princess-Cut Lab-Grown Diamond Solitaire Engagement Ring with Side Diamonds',
    price: 1700,
    image: 'https://cdn.shopify.com/s/files/1/0762/6122/8788/files/image1_29006de2-c4ea-47d1-81ef-524e2e6a95c2.png?v=1760257193',
    category: 'Engagement Rings',
    description: 'Princess-cut solitaire with side accent diamonds for added brilliance',
    isCustomizable: true
  }
];