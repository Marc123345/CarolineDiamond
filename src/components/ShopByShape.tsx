import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { buildImageKitUrl } from '../utils/imagekit';
import { useTranslation } from '../context/TranslationContext';
import { getCanonicalShape } from '../utils/shapeUtils';

interface ShopByShapeProps {
  onNavigate: (page: string) => void;
}

export const ShopByShape: React.FC<ShopByShapeProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const shapes = [
    {
      name: 'Round',
      imagePath: '20165%201.png',
      description: 'A timeless classic that has symbolized eternal love for centuries.',
      popularity: '45%',
      lifestyle: 'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg'
    },
    {
      name: 'Oval',
      imagePath: '20165%203.png',
      description: 'A top trending shape with surface area that creates the appearance of a larger stone.',
      popularity: '20%',
      lifestyle: 'https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg'
    },
    {
      name: 'Princess',
      imagePath: '20165%208.png',
      description: 'One of the most popular shapes that also shows beautifully in a wide range of ring styles.',
      popularity: '12%',
      lifestyle: 'https://images.pexels.com/photos/1472662/pexels-photo-1472662.jpeg'
    },
    {
      name: 'Pear',
      imagePath: '20165%2012.png',
      description: 'A shape getting lots of love on social media and that makes any ring, especially unique.',
      popularity: '8%',
      lifestyle: 'https://images.pexels.com/photos/1448665/pexels-photo-1448665.jpeg'
    },
    {
      name: 'Marquise',
      imagePath: 'image%201%20(2).png',
      description: 'The distinctive shape that\'s enjoying a resurgence in popularity.',
      popularity: '8%',
      lifestyle: 'https://images.pexels.com/photos/1448665/pexels-photo-1448665.jpeg'
    },
    {
      name: 'Emerald',
      imagePath: '20165%209.png',
      description: 'The embodiment of elegance and sophistication.',
      popularity: '15%',
      lifestyle: 'https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg'
    },
    {
      name: 'Cushion',
      imagePath: '20165%204.png',
      description: 'A cross between a round and princess cut and an especially popular choice for halo rings.',
      popularity: '25%',
      lifestyle: 'https://images.pexels.com/photos/3946630/pexels-photo-3946630.jpeg'
    }
  ];

  return (
    <section className="relative overflow-hidden bg-Color-Netural-White">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <motion.div
          ref={inViewRef}
          initial={{ opacity: 0, y: 100 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <span className="text-Color-Light-300 font-medium tracking-[0.2em] uppercase text-sm">
              {t('Diamond Cuts')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-Color-Dark-500 leading-tight mb-6"
          >
            {t('Find Your')} <span className="text-Color-Light-300 italic">{t('Perfect')}</span> {t('Shape')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4"
          >
            {t('Each diamond cut tells a different story. Discover the shape that reflects your unique style and personality.')}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 max-w-6xl mx-auto">
          {shapes.map((shape, index) => (
            <motion.div
              key={shape.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
              className="flex flex-col items-center cursor-pointer group bg-Color-Secondary/30 p-6 rounded-2xl hover:bg-Color-Secondary/50 transition-all duration-300 hover:shadow-lg"
              onClick={() => {
                const canonicalShape = getCanonicalShape(shape.name);
                onNavigate(`/shop?shape=${canonicalShape.toLowerCase()}`);
              }}
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110">
                <img
                  src={buildImageKitUrl(shape.imagePath, {
                    width: 200,
                    format: 'auto',
                    quality: 'auto',
                    dpr: 'auto',
                  })}
                  srcSet={`
                    ${buildImageKitUrl(shape.imagePath, { width: 100, format: 'auto', quality: 'auto', dpr: 1 })} 100w,
                    ${buildImageKitUrl(shape.imagePath, { width: 200, format: 'auto', quality: 'auto', dpr: 1 })} 200w,
                    ${buildImageKitUrl(shape.imagePath, { width: 200, format: 'auto', quality: 'auto', dpr: 2 })} 400w
                  `}
                  sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 128px"
                  alt={shape.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain filter drop-shadow-2xl"
                  style={{ imageRendering: 'crisp-edges', WebkitImageRendering: 'crisp-edges' }}
                />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-Color-Dark-500 uppercase tracking-wide mb-2 group-hover:text-Color-Light-300 transition-colors duration-300 text-center">
                {t(shape.name)}
              </h3>
              <p className="text-xs sm:text-sm text-Color-Gray-600 text-center leading-relaxed">
                {t(shape.description)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
