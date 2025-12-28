// Collections page configuration based on product categories
export const collectiesContent = {
  hero: {
    subtitle: "Explore our curated jewelry collections",
    title: {
      line1: "Signature",
      line2: "Collections"
    },
    cta: "Browse All Collections"
  },

  collections: {
    'engagement-rings': {
      title: "Engagement Rings",
      subtitle: "Timeless symbols of eternal love",
      productCount: 36,
      filters: {
        type: 'Engagement Ring'
      },
      description: "Discover our exquisite collection of engagement rings, each piece crafted to symbolize your unique love story. From classic solitaires to intricate halos, find the perfect ring to begin your forever.",
      sections: [
        {
          type: 'text-image',
          title: 'Your Love Story Begins Here',
          content: [
            "An engagement ring is more than just jewelry—it's a promise, a memory, and a symbol of the journey you're about to embark on together. Our collection features 36 carefully curated designs, each crafted with precision and passion.",
            "Whether you prefer the timeless elegance of a classic solitaire or the romantic allure of a halo setting, our engagement rings are designed to capture the essence of your love story."
          ],
          imageLabel: 'Engagement Ring Collection'
        }
      ]
    },

    'classic-solitaire': {
      title: "Classic Solitaire Rings",
      subtitle: "Timeless elegance, refined simplicity",
      productCount: 8,
      filters: {
        tags: ['solitaire', 'classic']
      },
      description: "The epitome of elegance, our classic solitaire rings showcase a single diamond in all its glory. Each ring is a masterpiece of minimalist design that puts the spotlight on the diamond's natural beauty.",
      sections: [
        {
          type: 'text-image',
          title: 'The Art of Simplicity',
          content: [
            "A classic solitaire ring represents the purest form of diamond jewelry. With nothing to distract from the center stone, every facet, every flash of light, and every moment of brilliance takes center stage.",
            "Our collection of 8 classic solitaire rings features traditional settings that have stood the test of time, perfect for those who appreciate understated elegance."
          ],
          imageLabel: 'Classic Solitaire Collection'
        }
      ]
    },

    'halo-rings': {
      title: "Halo Rings",
      subtitle: "Radiant designs for unforgettable moments",
      productCount: 18,
      filters: {
        tags: ['halo']
      },
      description: "Enhance your center diamond with a brilliant halo of smaller diamonds. Our halo rings create a stunning optical illusion, making the center stone appear larger while adding extra sparkle and dimension.",
      sections: [
        {
          type: 'text-image',
          title: 'Illuminated Beauty',
          content: [
            "Halo settings have captivated hearts for generations, and it's easy to see why. The circle of smaller diamonds surrounding the center stone creates a mesmerizing frame of light, amplifying the beauty and size of the center diamond.",
            "With 18 designs in our halo collection, you'll find everything from vintage-inspired cushion halos to modern round brilliant settings."
          ],
          imageLabel: 'Halo Ring Collection'
        }
      ]
    },

    'lab-grown': {
      title: "Lab-Grown Diamonds",
      subtitle: "Sustainable luxury, brilliant innovation",
      productCount: 38,
      filters: {
        tags: ['lab-grown']
      },
      description: "Embrace the future of fine jewelry with our lab-grown diamond collection. Chemically, physically, and optically identical to natural diamonds, these stones offer exceptional value and ethical peace of mind.",
      sections: [
        {
          type: 'text-image',
          title: 'The Future of Fine Jewelry',
          content: [
            "Lab-grown diamonds represent the perfect marriage of innovation and tradition. Created using cutting-edge technology that replicates natural diamond formation, these stones are identical to mined diamonds in every way that matters.",
            "Our collection of 38 lab-grown diamond pieces offers you the opportunity to own stunning jewelry that's both environmentally conscious and budget-friendly, without compromising on quality or beauty."
          ],
          imageLabel: 'Lab-Grown Diamond Collection'
        }
      ]
    },

    'natural-diamonds': {
      title: "Natural Diamonds",
      subtitle: "Earth's timeless treasures",
      productCount: 34,
      filters: {
        variantTitle: 'Natural Diamond'
      },
      description: "Celebrate nature's most precious gift with our natural diamond collection. Formed over billions of years deep within the Earth, each natural diamond carries a unique story of geological wonder.",
      sections: [
        {
          type: 'text-image',
          title: 'Billions of Years in the Making',
          content: [
            "Natural diamonds are one of nature's most extraordinary creations. Formed under immense pressure and heat deep within the Earth's mantle, each stone has traveled an incredible journey to reach you.",
            "Our collection of 34 natural diamond pieces celebrates this ancient beauty, offering you a connection to the Earth's geological history with every piece you wear."
          ],
          imageLabel: 'Natural Diamond Collection'
        }
      ]
    },

    'necklaces': {
      title: "Necklaces",
      subtitle: "Grace your neckline with elegance",
      productCount: 1,
      filters: {
        type: 'Necklace'
      },
      description: "Complete your look with our stunning necklace collection. From delicate pendants to statement pieces, each necklace is designed to enhance your natural beauty.",
      sections: [
        {
          type: 'text-image',
          title: 'Timeless Elegance',
          content: [
            "A beautiful necklace has the power to transform any outfit. Whether you're dressing up for a special occasion or adding a touch of sparkle to your everyday look, our necklace collection offers versatile pieces that complement any style.",
            "Each necklace in our collection is crafted with meticulous attention to detail, ensuring that every piece becomes a cherished part of your jewelry wardrobe."
          ],
          imageLabel: 'Necklace Collection'
        }
      ]
    },

    'earrings': {
      title: "Earrings",
      subtitle: "Frame your face with brilliance",
      productCount: 1,
      filters: {
        type: 'Earrings'
      },
      description: "Discover earrings that capture the light and draw the eye. Our collection features designs that range from subtle studs to dramatic drops, perfect for any occasion.",
      sections: [
        {
          type: 'text-image',
          title: 'Sparkle with Every Turn',
          content: [
            "Earrings are one of the most versatile pieces of jewelry you can own. They frame your face, catch the light, and add a touch of glamour to any look.",
            "Our earring collection showcases exceptional craftsmanship and timeless design, ensuring that each pair becomes a staple in your jewelry collection."
          ],
          imageLabel: 'Earring Collection'
        }
      ]
    },

    'solitaire-no-side': {
      title: "Solitaire Rings without Side Diamonds",
      subtitle: "Pure, unadorned perfection",
      productCount: 8,
      filters: {
        tags: ['solitaire', 'no-side-diamonds']
      },
      description: "Experience the ultimate in minimalist elegance with our solitaire rings without side diamonds. These designs focus entirely on the center stone, creating a look of pure, refined beauty.",
      sections: [
        {
          type: 'text-image',
          title: 'Minimalist Perfection',
          content: [
            "When you choose a solitaire without side diamonds, you're making a statement about what matters most: the beauty of a single, perfect diamond. These rings feature clean lines and elegant proportions that will never go out of style.",
            "Our collection of 8 solitaire rings without side diamonds offers timeless designs that put the focus where it belongs—on your stunning center stone."
          ],
          imageLabel: 'Solitaire No Side Diamonds'
        }
      ]
    },

    'halo-no-side': {
      title: "Halo Rings without Side Diamonds",
      subtitle: "Focused brilliance, enhanced beauty",
      productCount: 7,
      filters: {
        tags: ['halo', 'no-side-diamonds']
      },
      description: "Enjoy the stunning halo effect while maintaining a cleaner band profile. These rings feature the brilliant halo around the center stone without additional diamonds on the band.",
      sections: [
        {
          type: 'text-image',
          title: 'Streamlined Elegance',
          content: [
            "Our halo rings without side diamonds offer the best of both worlds: the eye-catching brilliance of a halo setting with the sleek simplicity of a plain band. This design choice creates a sophisticated look that's both modern and timeless.",
            "With 7 designs to choose from, you'll find the perfect balance of sparkle and simplicity."
          ],
          imageLabel: 'Halo No Side Diamonds'
        }
      ]
    }
  },

  seo: {
    title: 'Jewelry Collections - Engagement Rings, Diamonds & Fine Jewelry | Diamonds by CS',
    description: 'Browse our curated collections of engagement rings, solitaires, halos, lab-grown diamonds, and natural diamonds. Discover timeless jewelry crafted with precision.',
    keywords: [
      'engagement rings',
      'classic solitaire',
      'halo rings',
      'lab-grown diamonds',
      'natural diamonds',
      'necklaces',
      'earrings',
      'fine jewelry',
      'diamond collections'
    ]
  }
};

export interface CollectionSection {
  type: 'text-image' | 'highlighted' | 'dark' | 'text-only' | 'making-of';
  title?: string;
  content: string[];
  imageLabel?: string;
  centerText?: string;
}

export interface CollectionFilters {
  type?: string;
  tags?: string[];
  variantTitle?: string;
}

export interface Collection {
  title: string;
  subtitle?: string;
  tagline?: string;
  celebration?: string;
  productCount?: number;
  filters?: CollectionFilters;
  description?: string;
  sections: CollectionSection[];
  images?: string[];
}