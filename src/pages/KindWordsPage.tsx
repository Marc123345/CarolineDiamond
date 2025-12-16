import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { PageHero } from '../components/PageHero';
import { VideoTestimonial } from '../components/VideoTestimonial';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Heart, Quote } from 'lucide-react';

interface KindWordsPageProps {
  onNavigate: (page: string) => void;
}

export const KindWordsPage: React.FC<KindWordsPageProps> = ({ onNavigate }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const testimonials = [
    {
      id: 'sarah-michael-engagement',
      customerName: 'Sarah & Michael',
      location: 'Antwerpen',
      project: 'Custom Engagement Ring',
      videoSrc: 'https://ik.imagekit.io/qcvroy8xpd/Video_1.mp4?updatedAt=1757326229649',
      videoPoster: 'https://diamondsbycs.com/images/uploads/upload-68b545a74baf9.jpeg',
      duration: '3:45',
      category: 'engagement',
      quote: 'Caroline made our dream ring come true. The whole process was magical and the result exceeded all our expectations!'
    },
    {
      id: 'emma-morse-bracelet',
      customerName: 'Emma',
      location: 'Gent',
      project: 'Morse Code Bracelet',
      videoSrc: 'https://ik.imagekit.io/qcvroy8xpd/Video.mp4?updatedAt=1757326229641',
      videoPoster: 'https://diamondsbycs.com/images/uploads/upload-68b5458f5a5cf.jpeg',
      duration: '2:30',
      category: 'jewelry',
      quote: 'The morse code bracelet with my daughters name is so meaningful. I wear it every day and think of her.'
    },
    {
      id: 'robert-memorial-ring',
      customerName: 'Robert',
      location: 'Brussel',
      project: 'Memorial Ring',
      videoSrc: 'https://ik.imagekit.io/qcvroy8xpd/Video_2.mp4?updatedAt=1757326229630',
      videoPoster: 'https://diamondsbycs.com/images/uploads/upload-68b545cea1ff1.jpeg',
      duration: '4:15',
      category: 'memorial',
      quote: 'Caroline understood exactly what I needed during this difficult time. The memorial ring helps me keep my wife close to my heart.'
    }
  ];

  return (
    <div className="bg-Color-Netural-White">
      <div className="relative">
        <PageHero 
          title="Kind Words"
          subtitle="Real stories from our cherished customers"
          backgroundImage="https://ik.imagekit.io/qcvroy8xpd/envato-labs-ai-8555b3b5-cb34-48c1-a320-9eb1bf8bf453.jpg?updatedAt=1757490770310"
        />
        {/* Breadcrumbs overlay */}
        <div className="absolute top-0 left-0 right-0 z-10 pt-32 sm:pt-40">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12">
            <Breadcrumbs 
              items={[
                { label: 'Customer Reviews', icon: Star }
              ]} 
              onNavigate={onNavigate}
              className="text-white"
            />
          </div>
        </div>
      </div>
      
      {/* Simple Video Testimonials Section */}
      <section className="py-20 sm:py-32 lg:py-40 xl:py-48 bg-gradient-to-br from-Color-Netural-White via-Color-Secondary/20 to-Color-Netural-White luxury-texture relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12">
          {/* Header */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-28 sm:mb-36 lg:mb-44"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center mb-8"
            >
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.8 }}
                className="w-16 h-16 bg-Color-Light-300 rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
              >
                <Quote className="h-8 w-8 text-Color-Netural-White" />
              </motion.div>
            </motion.div>
            
            <h1 className="typography-h2 text-Color-Dark-500 mb-6 relative">
              Customer Stories
            </h1>
            
            {/* Unifying Element */}
            <motion.div 
              initial={{ width: 0 }}
              animate={inView ? { width: "160px" } : { width: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="h-[3px] bg-gradient-to-r from-transparent via-Color-Light-300 to-transparent mx-auto mb-8 sm:mb-10 lg:mb-12"
            />
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="typography-body-xl text-Color-Gray-700 max-w-4xl mx-auto leading-relaxed"
            >
              Hear directly from our customers about their experience creating their dream jewelry with Caroline.
            </motion.p>
          </motion.div>

          {/* Video Testimonials Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-20 lg:gap-24 mb-28 sm:mb-36"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.9 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.8 + (index * 0.2),
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
                <div className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-Color-Light-300/30 overflow-hidden relative">
                  {/* Hover shimmer effect */}
                  <motion.div
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"
                  />
                  
                  <VideoTestimonial
                    id={testimonial.id}
                    customerName={testimonial.customerName}
                    location={testimonial.location}
                    project={testimonial.project}
                    videoSrc={testimonial.videoSrc}
                    videoPoster={testimonial.videoPoster}
                    duration={testimonial.duration}
                    category={testimonial.category}
                    quote={testimonial.quote}
                    featured={true}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Simple CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-Color-Netural-Black to-Color-Dark-500 text-Color-Netural-White p-12 rounded-2xl shadow-2xl border border-Color-Light-300/30 max-w-4xl mx-auto">
              <h3 className="typography-h3 text-Color-Netural-White mb-6">
                Ready to Create Your Story?
              </h3>
              <p className="typography-body-lg text-Color-Light-300 mb-8 max-w-2xl mx-auto">
                Let us help you create a piece of jewelry that will become part of your own beautiful story.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('/contact')}
                  className="bg-Color-Light-300 text-Color-Netural-White font-semibold py-4 px-8 transition-all duration-300 hover:bg-Color-Light-300/90 hover:shadow-lg active:scale-95 rounded-lg flex items-center justify-center min-h-[44px]"
                >
                  <Heart className="mr-3 h-5 w-5" />
                  Start Your Journey
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('/shop')}
                  className="border-2 border-Color-Light-300 text-Color-Light-300 bg-transparent font-semibold py-4 px-8 transition-all duration-300 hover:bg-Color-Light-300 hover:text-Color-Netural-Black hover:shadow-lg active:scale-95 rounded-lg flex items-center justify-center min-h-[44px]"
                >
                  <Star className="mr-3 h-5 w-5" />
                  View Collection
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};