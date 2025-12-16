import React, { useState } from "react";
import {
  ChevronDown, Award, ShoppingBag, Heart, Sparkles, Gift, Star,
  User, Newspaper, MapPin, Gem, Diamond, Info, Crown, Clock, Car,
  Phone, Mail, X, ArrowRight, Palette, Wrench, Pencil, Calendar,
  Settings, Ruler, Home, Leaf, HandHeart, BookOpen, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { primaryCategories, staticLinks } from "../config/siteConfig";
import { T } from "./T";

interface FloatingOverlayProps {
  category: {
    id: string;
    title: string;
    icon?: string;
    subcategories?: Array<{ title: string; page: string; icon?: string }>;
  };
  onClose: () => void;
  onNavigate: (page: string) => void;
}

const FloatingOverlay: React.FC<FloatingOverlayProps> = ({ category, onClose, onNavigate }) => {
  const getHeroImage = (categoryId: string) => {
    switch (categoryId) {
      case "shop":
        return "https://ik.imagekit.io/qcvroy8xpd/91b5f5ce-4ccd-4075-8721-f633906d3842.jpeg?updatedAt=1757614528636";
      case "collections":
        return "https://ik.imagekit.io/qcvroy8xpd/b855a677-5d9f-4721-9bd3-446722fa0653.jpeg?updatedAt=1763894042745";
      case "about":
        return "https://diamondsbycs.com/images/uploads/upload-656a00eeec975.png";
      default:
        return "https://ik.imagekit.io/qcvroy8xpd/91b5f5ce-4ccd-4075-8721-f633906d3842.jpeg?updatedAt=1757614528636";
    }
  };

  const getStoryline = (categoryId: string) => {
    switch (categoryId) {
      case "shop":
        return "Discover our handcrafted jewelry collection, where each piece tells a unique story of elegance and timeless beauty.";
      case "collections":
        return "Celebrate life's most precious moments with jewelry designed to mark special occasions and create lasting memories.";
      case "about":
        return "Experience personalized service and expert craftsmanship in the heart of Antwerp's diamond district.";
      default:
        return "Explore our curated collection of fine jewelry, handcrafted with passion and precision.";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/80 z-[55] isolate flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${category.id}-title`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-Color-Light-300
                   max-w-4xl w-full max-h-[85vh] flex overflow-hidden m-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 hover:bg-Color-Netural-White rounded-full transition min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close navigation menu"
        >
          <X className="h-6 w-6 text-Color-Netural-Black" aria-hidden="true" />
        </button>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 flex-1 min-h-0">
          {/* Left: Hero Image (fixed) */}
          <div className="relative overflow-hidden lg:rounded-l-3xl">
            <motion.img
              src={getHeroImage(category.id)}
              alt={category.title}
              className="w-full h-64 lg:h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Floating Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-6 left-6 bg-black/60 px-4 py-1.5 rounded-full"
            >
              <span className="text-white font-medium text-sm">{category.title}</span>
            </motion.div>

            {/* Bottom Story Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-6 left-6 right-6 space-y-2"
            >
              <h3
                className="text-2xl font-bold text-white"
                style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.8)" }}
              >
                Designed for Timeless Elegance
              </h3>
              <p
                className="text-white/90 text-sm leading-relaxed"
                style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.8)" }}
              >
                {getStoryline(category.id)}
              </p>
            </motion.div>
          </div>

          {/* Right: Navigation Content (scrollable) */}
          <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-start overflow-y-auto min-h-0">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Title */}
              <div className="flex items-center gap-4">
                {React.createElement(
                  IconMap[category.icon as keyof typeof IconMap],
                  { className: "h-8 w-8 text-Color-Light-300", 'aria-hidden': 'true' }
                )}
                <h2 id={`${category.id}-title`} className="text-3xl font-bold text-Color-Netural-Black">{category.title}</h2>
              </div>

              <p className="text-base text-Color-Netural-Black leading-relaxed">
                {getStoryline(category.id)}
              </p>

              {/* Subcategories */}
              <div className="space-y-3">
                {category.subcategories?.map((sub, index: number) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 6 }}
                    onClick={() => onNavigate(sub.page)}
                    className="flex items-center justify-between w-full p-4 rounded-xl 
                               bg-gradient-to-r from-Color-Netural-White to-Color-Netural-White hover:from-Color-Netural-White hover:to-Color-Secondary
                               border border-Color-Light-300 hover:border-Color-Light-300 transition group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-Color-Light-300/20 rounded-xl flex items-center justify-center 
                                      group-hover:bg-Color-Light-300 transition">
                        {React.createElement(
                          IconMap[sub.icon as keyof typeof IconMap],
                          { className: "h-6 w-6 text-Color-Light-300 group-hover:text-white transition" }
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-Color-Netural-Black group-hover:text-Color-Light-300 transition">
                          {sub.title}
                        </h4>
                        <p className="text-sm text-Color-Netural-Black">{sub.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-Color-Champagne-Gold group-hover:text-Color-Light-300 transition" />
                  </motion.button>
                ))}
              </div>

              {/* Primary CTA */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05, y: -2 }}
                onClick={() => onNavigate("/shop")}
                className="w-full bg-gradient-to-r from-Color-Light-300 to-Color-Light-300/80 
                           text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl 
                           transition flex items-center justify-center"
              >
                <ShoppingBag className="mr-3 h-5 w-5" />
                Explore All Collections
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface DesktopNavProps {
  onNavigate: (page: string) => void;
  isScrolled?: boolean;
}

const IconMap = {
  Award,
  ShoppingBag,
  Heart,
  Sparkles,
  Gift,
  Star,
  User,
  Newspaper,
  MapPin,
  Gem,
  Diamond,
  Info,
  Crown,
  Clock,
  Car,
  Phone,
  Mail,
  Palette,
  Wrench,
  Pencil,
  Calendar,
  Settings,
  Ruler,
  Home,
  Leaf,
  HandHeart,
  BookOpen,
  Zap
};

export const DesktopNav: React.FC<DesktopNavProps> = ({
  onNavigate,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleNavigation = (page: string) => {
    // Close menu immediately
    setExpandedSection(null);
    // Navigate after a brief delay to allow menu to close
    requestAnimationFrame(() => {
      onNavigate(page);
    });
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSection((prev) => (prev === sectionId ? null : sectionId));
  };

  return (
    <nav
      className="hidden lg:flex items-center justify-center gap-2"
    >
      {/* Primary Categories */}
      {primaryCategories.map((category) => (
        <div key={category.id} className="relative">
          {/* Category Button */}
          <button
            onClick={() => toggleSection(category.id)}
            aria-expanded={expandedSection === category.id}
            aria-haspopup="true"
            className="flex items-center gap-1.5 font-medium py-3 px-4
                       text-black hover:text-Color-Champagne-Gold rounded-lg transition-all duration-300
                       hover:bg-gray-50 text-[15px] group"
          >
            <T className="tracking-wide whitespace-nowrap">{category.title}</T>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-300 opacity-70 group-hover:opacity-100 ${
                expandedSection === category.id ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Floating Overlay */}
          <AnimatePresence>
            {expandedSection === category.id && (
              <FloatingOverlay
                category={category}
                onClose={() => setExpandedSection(null)}
                onNavigate={handleNavigation}
              />
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Standalone Links */}
      {staticLinks.map((link) => (
        <button
          key={link.page}
          onClick={() => onNavigate(link.page)}
          className="font-medium py-3 px-4 text-black hover:text-Color-Champagne-Gold
                     hover:bg-gray-50 rounded-lg transition-all duration-300 text-[15px] whitespace-nowrap"
        >
          <T>{link.label}</T>
        </button>
      ))}
    </nav>
  );
};
