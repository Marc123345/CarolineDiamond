import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface CategoryShowcaseProps {
  onNavigate: (page: string) => void;
}

interface Category {
  id: string;
  title: string;
  image: string;
  page: string;
  offsetY: number;
}

const CATEGORIES: Category[] = [
  {
    id: 'rings',
    title: 'Rings',
    image: 'https://diamondsbycs.com/images/uploads/upload-68b5458f5a5cf.jpeg',
    page: '/shop?category=rings',
    offsetY: -64
  },
  {
    id: 'necklaces-earrings',
    title: 'Necklaces & Earrings',
    image: 'https://diamondsbycs.com/images/uploads/upload-68b545a74baf9.jpeg',
    page: '/shop',
    offsetY: 64
  }
];

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onNavigate }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-32"
      aria-labelledby="category-showcase-heading"
    >
      <div className="mx-auto max-w-[1440px] px-8 sm:px-12 lg:px-20">
        {/* Header with Navigation Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex items-center justify-between"
        >
          <h2
            id="category-showcase-heading"
            className="font-serif text-4xl font-light leading-tight text-[#0C0A09] sm:text-5xl lg:text-6xl"
            style={{
              fontSize: '48px',
              fontFamily: 'Noto Serif',
              fontWeight: 300,
              lineHeight: '60.48px'
            }}
          >
            Shop By Category
          </h2>

          {/* Decorative Lines */}
          <div className="flex items-center gap-6">
            <div
              className="h-[13.33px] w-[58.50px] rounded-sm border border-[#A8A29E]"
              aria-hidden="true"
            />
            <div
              className="h-[13.33px] w-[58.50px] rounded-sm border border-[#0C0A09]"
              aria-hidden="true"
            />
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex gap-8 overflow-hidden"
        >
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
              className="flex items-end gap-4"
              style={{
                paddingTop: category.offsetY > 0 ? '64px' : '0',
                paddingBottom: category.offsetY < 0 ? '64px' : '0'
              }}
            >
              {/* Category Label (Rotated) */}
              <div
                className="origin-top-left font-serif text-[#0C0A09] transition-colors hover:text-[#764e3e]"
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: 'top left',
                  fontSize: '48px',
                  fontFamily: 'Noto Serif',
                  fontWeight: 300,
                  lineHeight: '60.48px',
                  whiteSpace: 'nowrap'
                }}
              >
                {category.title}
              </div>

              {/* Category Image */}
              <div
                className="group relative cursor-pointer overflow-hidden"
                style={{ width: '400px', height: '500px' }}
                onClick={() => onNavigate(category.page)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigate(category.page);
                  }
                }}
                aria-label={`Browse ${category.title}`}
              >
                {/* Image with zoom effect */}
                <img
                  src={category.image}
                  alt={category.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                  style={{
                    width: '130%',
                    height: '130%',
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />

                {/* Subtle bottom gradient for depth */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
