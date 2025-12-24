import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Quote, Heart, CheckCircle } from 'lucide-react';

interface CustomerStoriesSectionProps {
  onNavigate: (page: string) => void;
}

export const CustomerStoriesSection: React.FC<CustomerStoriesSectionProps> = ({ onNavigate }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const testimonials = [
    {
      name: 'Sarah & Tom',
      rating: 5,
      text: 'Caroline heeft de perfecte verlovingsring voor ons gemaakt. Het proces was magisch en het eindresultaat overtrof al onze verwachtingen!',
      category: 'Verlovingsring',
      date: 'December 2024',
      image: 'https://diamondsbycs.com/images/uploads/upload-68b545a74baf9.jpeg'
    },
    {
      name: 'Emma & David',
      rating: 5,
      text: 'Van verlovingsring tot trouwringen - Caroline begeleidde ons door het hele proces. De persoonlijke service en kwaliteit zijn ongeëvenaard.',
      category: 'Trouwringen Set',
      date: 'December 2024',
      image: 'https://diamondsbycs.com/images/uploads/upload-68b5458f5a5cf.jpeg'
    }
  ];

  return (
    <section className="section-spacing bg-gradient-to-br from-Color-Secondary via-Color-Netural-White to-Color-Secondary silk-texture relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-1/3 w-36 h-36 bg-gradient-to-br from-Color-Light-300/12 to-Color-Light-300/4 rounded-full"
        />
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -8, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-Color-Light-300/10 to-Color-Light-300/3 rounded-full"
        />
      </div>
      
      <div className="content-container container-spacing relative z-10">
        {/* Header */}
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center section-header"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center mb-8 sm:mb-10"
          >
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.8 }}
              className="w-16 sm:w-18 h-16 sm:h-18 bg-Color-Light-300 rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
            >
              <Quote className="h-8 sm:h-9 w-8 sm:w-9 text-Color-Netural-White" />
            </motion.div>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-Color-Dark-500 mb-6 sm:mb-8 relative">
            Customer Stories
          </h2>
          
          {/* Unifying Element */}
          <motion.div 
            initial={{ width: 0 }}
            animate={inView ? { width: "160px" } : { width: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="h-[3px] bg-gradient-to-r from-transparent via-Color-Light-300 to-transparent mx-auto mb-8 sm:mb-10 lg:mb-12"
          />
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl lg:text-3xl text-Color-Gray-700 max-w-5xl mx-auto leading-relaxed px-4"
          >
            Lees de verhalen van koppels die hun droomring bij ons hebben laten maken en ontdek waarom zij kozen voor Diamonds by CS.
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-20"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 80, scale: 0.9 }}
              transition={{ 
                duration: 0.8, 
                delay: 1 + (index * 0.2),
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -10, 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="group"
            >
              <div className="bg-gradient-to-br from-Color-Netural-White to-Color-Secondary/30 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-Color-Light-300/40 overflow-hidden relative p-2 sm:p-4">
                {/* Hover shimmer effect */}
                <motion.div
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                
                {/* Quote Icon */}
                <div className="absolute top-8 right-8 w-14 h-14 bg-Color-Light-300/20 rounded-full flex items-center justify-center">
                  <Quote className="h-7 w-7 text-Color-Light-300" />
                </div>
                
                <div className="p-10 sm:p-12 relative z-10">
                  {/* Customer Info */}
                  <div className="flex items-center mb-8 sm:mb-10">
                    <div className="relative">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-20 sm:w-24 h-20 sm:h-24 rounded-full object-cover shadow-lg border-2 border-Color-Light-300"
                      />
                      {/* Verification Badge */}
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-6 flex-1">
                      <h4 className="text-xl sm:text-2xl text-Color-Dark-500 font-bold group-hover:text-Color-Light-300 transition-colors duration-300 mb-2">
                        {testimonial.name}
                      </h4>
                      <div className="flex items-center mb-2">
                        <div className="flex text-Color-Light-300 mr-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm text-green-600 font-medium">Verified Customer</span>
                      </div>
                      <span className="text-sm text-Color-Gray-700">{testimonial.category}</span>
                    </div>
                  </div>
                  
                  {/* Enhanced Quote */}
                  <div className="relative mb-8 sm:mb-10">
                    <div className="absolute -top-3 -left-3 text-5xl text-Color-Light-300/30 font-serif">"</div>
                    <blockquote className="text-lg sm:text-xl text-Color-Gray-700 italic leading-relaxed pl-8 sm:pl-10 relative">
                      {testimonial.text}
                    </blockquote>
                    <div className="absolute -bottom-3 -right-3 text-5xl text-Color-Light-300/30 font-serif transform rotate-180">"</div>
                  </div>
                  
                  {/* Product Category */}
                  <div className="pt-8 border-t border-Color-Light-300/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm bg-Color-Light-300/20 text-Color-Dark-500 px-4 py-2 rounded-full shadow-md">
                        {testimonial.category}
                      </span>
                      <span className="text-sm text-Color-Gray-700">
                        {testimonial.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-Color-Champagne-Gold to-Color-Champagne-Gold/80 text-Color-Netural-Black p-16 sm:p-20 lg:p-24 rounded-2xl shadow-2xl border border-Color-Champagne-Gold/30 max-w-5xl mx-auto relative overflow-hidden">
            {/* Background Pattern */}
            <motion.div
              animate={{ 
                backgroundPosition: ["0% 0%", "100% 100%"],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 luxury-texture"
            />
            
            <div className="relative z-10">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl text-Color-Netural-Black mb-8 sm:mb-12 font-bold">
                Deel Uw Verhaal
              </h3>
              <p className="text-xl sm:text-2xl text-Color-Netural-Black/80 mb-12 sm:mb-16 max-w-3xl mx-auto font-medium leading-relaxed">
                We horen graag over uw ervaring met Diamonds by CS. Uw verhaal kan anderen inspireren om hun perfecte juweel te vinden.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('/kind-words')}
                  className="bg-Color-Netural-Black text-Color-Netural-White hover:bg-Color-Dark-500 px-10 sm:px-12 py-5 sm:py-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl text-lg"
                >
                  <Star className="mr-4 h-6 w-6" />
                  Lees Meer Verhalen
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('/contact')}
                  className="border-2 border-Color-Netural-Black text-Color-Netural-Black hover:bg-Color-Netural-Black hover:text-Color-Netural-White px-10 sm:px-12 py-5 sm:py-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl text-lg"
                >
                  <Heart className="mr-4 h-6 w-6" />
                  Deel Uw Ervaring
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};