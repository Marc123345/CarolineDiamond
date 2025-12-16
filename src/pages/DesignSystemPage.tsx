import React, { useState } from 'react';
import {
  Palette, Type, Square, Component, Copy, Check, Grid, Layers,
  Eye, Heart, ShoppingBag, Star, Sparkles, Crown, Diamond, Play,
  User, Mail, Phone, MapPin, Calendar, Settings, Bell, AlertCircle,
  CheckCircle, Info, X, Menu, ChevronDown, Search, Filter, Zap,
  MousePointer, Smartphone, Tablet, Monitor, Accessibility, Volume2
} from 'lucide-react';

interface DesignSystemPageProps {
  onNavigate: (page: string) => void;
}

export const DesignSystemPage: React.FC<DesignSystemPageProps> = ({ onNavigate }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('foundations');
  const [activeFoundation, setActiveFoundation] = useState('colors');
  const [activeComponent, setActiveComponent] = useState('buttons');
  const [activePattern, setActivePattern] = useState('forms');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const sections = [
    { id: 'foundations', title: 'Foundations', icon: Layers },
    { id: 'components', title: 'Components', icon: Component },
    { id: 'patterns', title: 'Patterns', icon: Grid }
  ];

  const foundations = [
    { id: 'colors', title: 'Color Palette', icon: Palette },
    { id: 'typography', title: 'Typography', icon: Type },
    { id: 'spacing', title: 'Spacing & Layout', icon: Square },
    { id: 'iconography', title: 'Iconography', icon: Star },
    { id: 'imagery', title: 'Imagery & Illustration', icon: Eye },
    { id: 'motion', title: 'Motion & Animation', icon: Zap },
    { id: 'accessibility', title: 'Accessibility', icon: Accessibility }
  ];

  const components = [
    { id: 'buttons', title: 'Buttons', icon: MousePointer },
    { id: 'forms', title: 'Forms', icon: Square },
    { id: 'navigation', title: 'Navigation', icon: Menu },
    { id: 'cards', title: 'Cards & Containers', icon: Component },
    { id: 'data', title: 'Data Display', icon: Grid },
    { id: 'feedback', title: 'Feedback', icon: Bell },
    { id: 'media', title: 'Media Components', icon: Eye }
  ];

  const patterns = [
    { id: 'forms', title: 'Form Patterns', icon: Square },
    { id: 'navigation', title: 'Navigation Flows', icon: Menu },
    { id: 'content', title: 'Content Presentation', icon: Grid },
    { id: 'errors', title: 'Error Handling', icon: AlertCircle },
    { id: 'responsive', title: 'Responsive Design', icon: Smartphone }
  ];

  // Color Palette Data
  const colorPalette = [
    {
      name: 'Primary Colors',
      colors: [
        { name: 'Color-Netural-White', value: '#FDFBF8', description: 'Warm off-white backgrounds', usage: 'Main backgrounds, cards' },
        { name: 'Color-Netural-Black', value: '#0C0A09', description: 'Deep black for contrast', usage: 'Headers, buttons, text' },
        { name: 'Color-Dark-500', value: '#06030A', description: 'Primary text color', usage: 'Headings, body text' }
      ]
    },
    {
      name: 'Brand Accent Colors',
      colors: [
        { name: 'Color-Light-300', value: '#CDBCAB', description: 'Luxury gold accent', usage: 'Buttons, highlights, icons' },
        { name: 'Color-Champagne-Gold', value: '#C9A86A', description: 'Subheader and accent color', usage: 'Subheadings, taglines, accents' },
        { name: 'Color-Rich-Gray', value: '#444444', description: 'Body text color', usage: 'Paragraph text, descriptions' }
      ]
    },
    {
      name: 'Supporting Colors',
      colors: [
        { name: 'Color-Gray-700', value: '#7B7B7B', description: 'Secondary text', usage: 'Captions, metadata' },
        { name: 'Color-Secondary', value: '#F0F0F0', description: 'Light background sections', usage: 'Section backgrounds' },
        { name: 'Color-Light-Dark', value: '#8B7A6A', description: 'Accent text color', usage: 'Links, secondary text' }
      ]
    }
  ];

  // Typography System
  const typographyClasses = [
    { 
      class: 'typography-h1', 
      description: 'Main heading - Playfair Display Light 4-5rem', 
      sample: 'Discover Engagement Rings',
      font: 'Playfair Display',
      usage: 'Hero titles, main page headings'
    },
    { 
      class: 'typography-h2', 
      description: 'Section heading - Playfair Display Light 3-3.5rem', 
      sample: 'About Caroline',
      font: 'Playfair Display',
      usage: 'Section titles, major headings'
    },
    { 
      class: 'typography-h3', 
      description: 'Subsection heading - Playfair Display Normal 2-2.5rem', 
      sample: 'Shop by Category',
      font: 'Playfair Display',
      usage: 'Subsection titles, card headings'
    },
    { 
      class: 'typography-title', 
      description: 'Tagline - Cormorant Garamond Italic 1.125-1.5rem', 
      sample: 'Meet the artisan behind every piece',
      font: 'Cormorant Garamond',
      usage: 'Taglines, quotes, emphasis text'
    },
    { 
      class: 'typography-body-xl', 
      description: 'Large body - Cormorant Garamond 1.125-1.25rem', 
      sample: 'Discover our carefully curated collections, each designed to celebrate life\'s most precious moments.',
      font: 'Cormorant Garamond',
      usage: 'Lead paragraphs, important descriptions'
    },
    { 
      class: 'typography-body-lg', 
      description: 'Medium body - Cormorant Garamond 1-1.125rem', 
      sample: 'With over 15 years of experience in Antwerp\'s diamond district.',
      font: 'Cormorant Garamond',
      usage: 'Standard paragraphs, content blocks'
    },
    { 
      class: 'typography-body', 
      description: 'Standard body - Cormorant Garamond 0.875-1rem', 
      sample: 'Every piece is handcrafted with passion and precision.',
      font: 'Cormorant Garamond',
      usage: 'Body text, descriptions'
    },
    { 
      class: 'typography-caption', 
      description: 'Caption - Cormorant Garamond 0.75-0.875rem', 
      sample: 'Handcrafted in Antwerp',
      font: 'Cormorant Garamond',
      usage: 'Captions, metadata, small text'
    },
    { 
      class: 'typography-price', 
      description: 'Price display - Cormorant Garamond 1.5-2rem', 
      sample: '€1.250',
      font: 'Cormorant Garamond',
      usage: 'Product prices, cost displays'
    },
    { 
      class: 'typography-price-large', 
      description: 'Large price - Cormorant Garamond 2-3rem', 
      sample: '€2.890',
      font: 'Cormorant Garamond',
      usage: 'Featured prices, hero pricing'
    }
  ];

  // Spacing System
  const spacingSystem = [
    { token: 'spacing-xs', size: '4px', class: 'space-xs', usage: 'Tight spacing, borders' },
    { token: 'spacing-sm', size: '8px', class: 'space-sm', usage: 'Small gaps, padding' },
    { token: 'spacing-md', size: '16px', class: 'space-md', usage: 'Standard spacing' },
    { token: 'spacing-lg', size: '24px', class: 'space-lg', usage: 'Section spacing' },
    { token: 'spacing-xl', size: '32px', class: 'space-xl', usage: 'Large gaps' },
    { token: 'spacing-2xl', size: '48px', class: 'space-2xl', usage: 'Section padding' },
    { token: 'spacing-3xl', size: '64px', class: 'space-3xl', usage: 'Major sections' }
  ];

  // Animation System
  const animations = [
    { name: 'luxury-glow', duration: '3s', description: 'Subtle glow effect for premium elements' },
    { name: 'premium-pulse', duration: '2s', description: 'Elegant pulsing for interactive elements' },
    { name: 'diamond-sparkle', duration: '4s', description: 'Sparkle effect for jewelry elements' },
    { name: 'fade-in-up', duration: '0.6s', description: 'Smooth entrance animation' },
    { name: 'elegant-rise', duration: '1s', description: 'Sophisticated reveal animation' },
    { name: 'silk-flow', duration: '4s', description: 'Flowing background animation' }
  ];

  // Responsive Breakpoints
  const breakpoints = [
    { name: 'Mobile', size: '< 640px', description: 'Compact layouts, stacked content' },
    { name: 'Tablet', size: '640px - 768px', description: 'Medium layouts, some columns' },
    { name: 'Desktop', size: '768px - 1024px', description: 'Full layouts, multi-column' },
    { name: 'Large', size: '1024px+', description: 'Wide layouts, maximum content width' }
  ];

  return (
    <div className="min-h-screen bg-Color-Netural-White">
      {/* Enhanced Header */}
      <section className="py-32 bg-gradient-to-br from-Color-Netural-Black via-Color-Dark-500 to-Color-Netural-Black text-Color-Netural-White relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-Color-Light-300/20 to-Color-Light-300/5 rounded-full animate-luxury-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-Color-Light-300/15 to-Color-Light-300/3 rounded-full animate-premium-pulse"></div>
          <div className="absolute top-1/2 right-1/6 w-32 h-32 bg-gradient-to-br from-Color-Light-300/10 to-Color-Light-300/2 rounded-full animate-diamond-sparkle"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center justify-center mb-8">
            <Crown className="h-12 w-12 text-Color-Light-300 mr-4" />
            <span className="typography-caption uppercase tracking-[0.2em] text-Color-Light-300 font-medium">
              Brand Guidelines
            </span>
            <Diamond className="h-12 w-12 text-Color-Light-300 ml-4" />
          </div>
          
          <h1 className="typography-h1 text-Color-Netural-White mb-6 relative">
            Design <span className="text-Color-Light-300">System</span>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 h-[4px] w-32 bg-gradient-to-r from-transparent via-Color-Light-300/60 to-transparent"></div>
          </h1>
          <p className="typography-body-xl text-Color-Light-300 max-w-4xl mx-auto leading-relaxed">
            Complete design system for Diamonds by CS - foundations, components, and patterns that create our luxury jewelry brand experience
          </p>
        </div>
      </section>

      {/* Navigation */}
      <section className="bg-Color-Netural-White py-8 sticky top-24 z-30 border-b border-Color-Light-300/50 shadow-lg backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="flex gap-2 bg-Color-Secondary p-2 rounded-xl shadow-lg">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-6 py-3 flex items-center font-medium transition-all duration-300 rounded-lg ${
                  activeSection === section.id
                    ? 'bg-Color-Netural-Black text-Color-Netural-White shadow-lg'
                    : 'text-Color-Dark-500 hover:bg-Color-Light-300 hover:text-Color-Netural-White'
                }`}
              >
                <section.icon className="h-5 w-5 mr-2" />
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-gradient-to-br from-Color-Netural-White via-Color-Secondary/20 to-Color-Netural-White">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* FOUNDATIONS */}
          {activeSection === 'foundations' && (
            <div className="space-y-12">
              <div className="text-center mb-10">
                <h2 className="typography-h2 text-Color-Dark-500 mb-6">Foundations</h2>
                <div className="h-[3px] w-24 bg-Color-Light-300 mx-auto mb-8"></div>
                <p className="typography-body-xl text-Color-Gray-700 max-w-3xl mx-auto">
                  These are the building blocks that define your brand and visual identity.
                </p>
              </div>

              {/* Foundation Navigation */}
              <div className="flex justify-center mb-12">
                <div className="flex flex-wrap gap-2 bg-Color-Secondary p-2 rounded-xl shadow-lg">
                  {foundations.map((foundation) => (
                    <button
                      key={foundation.id}
                      onClick={() => setActiveFoundation(foundation.id)}
                      className={`px-4 py-2 flex items-center text-sm font-medium transition-all duration-300 rounded-lg ${
                        activeFoundation === foundation.id
                          ? 'bg-Color-Light-300 text-Color-Netural-White shadow-lg'
                          : 'text-Color-Dark-500 hover:bg-Color-Light-300/20'
                      }`}
                    >
                      <foundation.icon className="h-4 w-4 mr-2" />
                      {foundation.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              {activeFoundation === 'colors' && (
                <div className="space-y-16">
                  <div className="text-center">
                    <h3 className="typography-h3 text-Color-Dark-500 mb-4">Color Palette</h3>
                    <p className="typography-body-lg text-Color-Gray-700 max-w-2xl mx-auto">
                      Our sophisticated color palette reflects luxury and elegance, with warm golds and rich neutrals.
                    </p>
                  </div>
                  
                  {colorPalette.map((group, gi) => (
                    <div key={gi} className="space-y-8">
                      <h4 className="typography-h4 text-Color-Dark-500 mb-8 flex items-center">
                        <Sparkles className="h-6 w-6 text-Color-Light-300 mr-3" />
                        {group.name}
                      </h4>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {group.colors.map((color, ci) => (
                          <div
                            key={ci}
                            className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 border border-Color-Light-300/30 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group"
                            onClick={() => copyToClipboard(color.value)}
                          >
                            <div 
                              style={{ backgroundColor: color.value }} 
                              className="h-32 relative group-hover:h-36 transition-all duration-300"
                            >
                              {copied === color.value && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                  <div className="bg-Color-Netural-White px-4 py-2 rounded-lg flex items-center">
                                    <Check className="h-4 w-4 text-green-600 mr-2" />
                                    <span className="typography-caption text-Color-Dark-500">Copied!</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="p-6">
                              <h5 className="typography-body font-bold text-Color-Dark-500 mb-2">{color.name}</h5>
                              <p className="typography-caption text-Color-Light-300 font-medium mb-2">{color.value}</p>
                              <p className="typography-caption text-Color-Gray-700 mb-2">{color.description}</p>
                              <p className="typography-caption text-Color-Light-300 italic">Usage: {color.usage}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Typography */}
              {activeFoundation === 'typography' && (
                <div className="space-y-12">
                  <div className="text-center">
                    <h3 className="typography-h3 text-Color-Dark-500 mb-4">Typography System</h3>
                    <p className="typography-body-lg text-Color-Gray-700 max-w-2xl mx-auto">
                      Elegant typography combining Playfair Display for headings and Cormorant Garamond for body text.
                    </p>
                  </div>
                  
                  <div className="grid gap-8">
                    {typographyClasses.map((typo, i) => (
                      <div key={i} className="bg-gradient-to-r from-Color-Netural-White to-Color-Secondary/30 border border-Color-Light-300/30 p-8 rounded-xl shadow-lg">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                          <div>
                            <div className={`${typo.class} mb-4`}>{typo.sample}</div>
                            <div className="space-y-2">
                              <p className="typography-body text-Color-Gray-700">{typo.description}</p>
                              <p className="typography-caption text-Color-Light-300 font-medium">Font: {typo.font}</p>
                              <p className="typography-caption text-Color-Gray-700">Usage: {typo.usage}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => copyToClipboard(typo.class)}
                              className="btn-secondary flex items-center"
                            >
                              {copied === typo.class ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                              {copied === typo.class ? 'Copied!' : 'Copy class'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Spacing & Layout */}
              {activeFoundation === 'spacing' && (
                <div className="space-y-12">
                  <div className="text-center mb-10">
                    <h3 className="typography-h3 text-Color-Dark-500 mb-4">Spacing & Layout</h3>
                    <p className="typography-body-lg text-Color-Gray-700 max-w-2xl mx-auto">
                      8px-based spacing system with responsive breakpoints for consistent layouts.
                    </p>
                  </div>
                  
                  {/* Spacing Tokens */}
                  <div className="mb-16">
                    <h4 className="typography-h4 text-Color-Dark-500 mb-8">Spacing Tokens</h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {spacingSystem.map((space, i) => (
                        <div key={i} className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 border border-Color-Light-300/30 p-8 rounded-xl shadow-lg">
                          <div className="mb-6">
                            <div
                              style={{ height: space.size }}
                              className="w-full bg-Color-Light-300 rounded-sm shadow-inner"
                            ></div>
                          </div>
                          <div className="space-y-2">
                            <h5 className="typography-body font-bold text-Color-Dark-500">{space.token}</h5>
                            <p className="typography-caption text-Color-Light-300 font-medium">{space.size}</p>
                            <p className="typography-caption text-Color-Gray-700">{space.usage}</p>
                            <button
                              onClick={() => copyToClipboard(space.class)}
                              className="typography-caption text-Color-Light-300 hover:text-Color-Dark-500 transition-colors"
                            >
                              {copied === space.class ? 'Copied!' : `Copy .${space.class}`}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Responsive Breakpoints */}
                  <div>
                    <h4 className="typography-h4 text-Color-Dark-500 mb-8">Responsive Breakpoints</h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {breakpoints.map((bp, i) => (
                        <div key={i} className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 border border-Color-Light-300/30 p-6 rounded-xl shadow-lg text-center">
                          <div className="w-12 h-12 bg-Color-Light-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            {i === 0 && <Smartphone className="h-6 w-6 text-Color-Netural-White" />}
                            {i === 1 && <Tablet className="h-6 w-6 text-Color-Netural-White" />}
                            {i >= 2 && <Monitor className="h-6 w-6 text-Color-Netural-White" />}
                          </div>
                          <h5 className="typography-h6 text-Color-Dark-500 font-bold mb-2">{bp.name}</h5>
                          <p className="typography-caption text-Color-Light-300 font-medium mb-2">{bp.size}</p>
                          <p className="typography-caption text-Color-Gray-700">{bp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Motion & Animation */}
              {activeFoundation === 'motion' && (
                <div className="space-y-12">
                  <div className="text-center mb-10">
                    <h3 className="typography-h3 text-Color-Dark-500 mb-4">Motion & Animation</h3>
                    <p className="typography-body-lg text-Color-Gray-700 max-w-2xl mx-auto">
                      Sophisticated animations that enhance the luxury experience without overwhelming content.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {animations.map((anim, i) => (
                      <div key={i} className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 border border-Color-Light-300/30 p-8 rounded-xl shadow-lg text-center">
                        <div className={`w-16 h-16 bg-Color-Light-300 rounded-full flex items-center justify-center mx-auto mb-6 animate-${anim.name}`}>
                          <Zap className="h-8 w-8 text-Color-Netural-White" />
                        </div>
                        <h5 className="typography-h6 text-Color-Dark-500 font-bold mb-2">{anim.name}</h5>
                        <p className="typography-caption text-Color-Light-300 font-medium mb-2">{anim.duration}</p>
                        <p className="typography-caption text-Color-Gray-700">{anim.description}</p>
                        <button
                          onClick={() => copyToClipboard(`animate-${anim.name}`)}
                          className="mt-4 typography-caption text-Color-Light-300 hover:text-Color-Dark-500 transition-colors"
                        >
                          {copied === `animate-${anim.name}` ? 'Copied!' : 'Copy class'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accessibility */}
              {activeFoundation === 'accessibility' && (
                <div className="space-y-12">
                  <div className="text-center mb-10">
                    <h3 className="typography-h3 text-Color-Dark-500 mb-4">Accessibility Standards</h3>
                    <p className="typography-body-lg text-Color-Gray-700 max-w-2xl mx-auto">
                      WCAG 2.1 AA compliant design tokens and guidelines for inclusive experiences.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 border border-Color-Light-300/30 p-8 rounded-xl shadow-lg">
                      <h4 className="typography-h5 text-Color-Dark-500 mb-6 flex items-center">
                        <Eye className="h-6 w-6 text-Color-Light-300 mr-3" />
                        Contrast Ratios
                      </h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-Color-Dark-500 text-Color-Netural-White rounded-lg">
                          <span>Dark on Light</span>
                          <span className="font-bold">21:1 ✓</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-Color-Light-300 text-Color-Netural-Black rounded-lg">
                          <span>Gold on Black</span>
                          <span className="font-bold">7.2:1 ✓</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-Color-Netural-White text-Color-Rich-Gray rounded-lg border">
                          <span>Gray on White</span>
                          <span className="font-bold">9.7:1 ✓</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 border border-Color-Light-300/30 p-8 rounded-xl shadow-lg">
                      <h4 className="typography-h5 text-Color-Dark-500 mb-6 flex items-center">
                        <MousePointer className="h-6 w-6 text-Color-Light-300 mr-3" />
                        Touch Targets
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="typography-body text-Color-Gray-700">Minimum size</span>
                          <span className="typography-body font-bold text-Color-Dark-500">44px × 44px</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="typography-body text-Color-Gray-700">Recommended</span>
                          <span className="typography-body font-bold text-Color-Dark-500">48px × 48px</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="typography-body text-Color-Gray-700">Spacing between</span>
                          <span className="typography-body font-bold text-Color-Dark-500">8px minimum</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Iconography */}
              {activeFoundation === 'iconography' && (
                <div className="space-y-12">
                  <div className="text-center mb-10">
                    <h3 className="typography-h3 text-Color-Dark-500 mb-4">Iconography</h3>
                    <p className="typography-body-lg text-Color-Gray-700 max-w-2xl mx-auto">
                      Lucide React icons with consistent styling and usage guidelines.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 border border-Color-Light-300/30 p-8 rounded-xl shadow-lg">
                      <h4 className="typography-h5 text-Color-Dark-500 mb-6">Icon Sizes</h4>
                      <div className="space-y-6">
                        {[
                          { size: 'h-4 w-4', label: 'Small (16px)', usage: 'Inline text, captions' },
                          { size: 'h-5 w-5', label: 'Medium (20px)', usage: 'Buttons, navigation' },
                          { size: 'h-6 w-6', label: 'Large (24px)', usage: 'Headers, features' },
                          { size: 'h-8 w-8', label: 'XL (32px)', usage: 'Hero sections, emphasis' }
                        ].map((iconSize, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-Color-Secondary rounded-lg">
                            <div className="flex items-center">
                              <Heart className={`${iconSize.size} text-Color-Light-300 mr-4`} />
                              <div>
                                <span className="typography-body font-medium text-Color-Dark-500">{iconSize.label}</span>
                                <p className="typography-caption text-Color-Gray-700">{iconSize.usage}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => copyToClipboard(iconSize.size)}
                              className="typography-caption text-Color-Light-300 hover:text-Color-Dark-500"
                            >
                              Copy
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 border border-Color-Light-300/30 p-8 rounded-xl shadow-lg">
                      <h4 className="typography-h5 text-Color-Dark-500 mb-6">Common Icons</h4>
                      <div className="grid grid-cols-4 gap-4">
                        {[Heart, ShoppingBag, Star, Crown, Diamond, Sparkles, Eye, User].map((Icon, i) => (
                          <div key={i} className="flex flex-col items-center p-4 bg-Color-Secondary rounded-lg hover:bg-Color-Light-300/20 transition-colors cursor-pointer">
                            <Icon className="h-6 w-6 text-Color-Light-300 mb-2" />
                            <span className="typography-caption text-Color-Gray-700">{Icon.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* COMPONENTS */}
          {activeSection === 'components' && (
            <div className="space-y-12">
              <div className="text-center mb-10">
                <h2 className="typography-h2 text-Color-Dark-500 mb-6">Components</h2>
                <div className="h-[3px] w-24 bg-Color-Light-300 mx-auto mb-8"></div>
                <p className="typography-body-xl text-Color-Gray-700 max-w-3xl mx-auto">
                  Reusable UI components with clear documentation and interaction states.
                </p>
              </div>

              {/* Component Navigation */}
              <div className="flex justify-center mb-12">
                <div className="flex flex-wrap gap-2 bg-Color-Secondary p-2 rounded-xl shadow-lg">
                  {components.map((component) => (
                    <button
                      key={component.id}
                      onClick={() => setActiveComponent(component.id)}
                      className={`px-4 py-2 flex items-center text-sm font-medium transition-all duration-300 rounded-lg ${
                        activeComponent === component.id
                          ? 'bg-Color-Light-300 text-Color-Netural-White shadow-lg'
                          : 'text-Color-Dark-500 hover:bg-Color-Light-300/20'
                      }`}
                    >
                      <component.icon className="h-4 w-4 mr-2" />
                      {component.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              {activeComponent === 'buttons' && (
                <div className="space-y-12">
                  <div className="text-center">
                    <h3 className="typography-h3 text-Color-Dark-500 mb-4">Button System</h3>
                    <p className="typography-body-lg text-Color-Gray-700 max-w-2xl mx-auto">
                      Elegant button styles using Cormorant Garamond for sophisticated interactions.
                    </p>
                  </div>
                  
                  <div className="space-y-12">
                    {/* Primary Buttons */}
                    <div className="bg-gradient-to-r from-Color-Netural-White to-Color-Secondary/30 p-12 rounded-xl border border-Color-Light-300/30 shadow-lg">
                      <h4 className="typography-h4 text-Color-Dark-500 mb-8 flex items-center">
                        <Star className="h-6 w-6 text-Color-Light-300 mr-3" />
                        Primary Buttons
                      </h4>
                      <div className="space-y-8">
                        <div className="flex flex-wrap gap-6 justify-center">
                          <button className="btn-primary">Default State</button>
                          <button className="btn-primary hover:bg-Color-Light-300">Hover State</button>
                          <button className="btn-primary opacity-75 cursor-not-allowed">Disabled State</button>
                        </div>
                        <div className="flex flex-wrap gap-6 justify-center">
                          <button className="btn-primary">
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            With Icon
                          </button>
                          <button className="btn-primary">
                            <Heart className="mr-2 h-5 w-5" />
                            Add to Wishlist
                          </button>
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => copyToClipboard('btn-primary')}
                          className="typography-caption text-Color-Light-300 hover:text-Color-Dark-500 transition-colors"
                        >
                          {copied === 'btn-primary' ? 'Copied!' : 'Copy .btn-primary'}
                        </button>
                      </div>
                    </div>

                    {/* Secondary Buttons */}
                    <div className="bg-gradient-to-r from-Color-Netural-White to-Color-Secondary/30 p-12 rounded-xl border border-Color-Light-300/30 shadow-lg">
                      <h4 className="typography-h4 text-Color-Dark-500 mb-8 flex items-center">
                        <Diamond className="h-6 w-6 text-Color-Light-300 mr-3" />
                        Secondary Buttons
                      </h4>
                      <div className="space-y-8">
                        <div className="flex flex-wrap gap-6 justify-center">
                          <button className="btn-secondary">Default State</button>
                          <button className="btn-secondary hover:bg-Color-Light-300">Hover State</button>
                          <button className="btn-secondary opacity-75 cursor-not-allowed">Disabled State</button>
                        </div>
                        <div className="flex flex-wrap gap-6 justify-center">
                          <button className="btn-secondary">
                            <Eye className="mr-2 h-5 w-5" />
                            View Details
                          </button>
                          <button className="btn-secondary">
                            <Calendar className="mr-2 h-5 w-5" />
                            Book Appointment
                          </button>
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => copyToClipboard('btn-secondary')}
                          className="typography-caption text-Color-Light-300 hover:text-Color-Dark-500 transition-colors"
                        >
                          {copied === 'btn-secondary' ? 'Copied!' : 'Copy .btn-secondary'}
                        </button>
                      </div>
                    </div>

                    {/* Text Buttons */}
                    <div className="bg-gradient-to-r from-Color-Netural-White to-Color-Secondary/30 p-12 rounded-xl border border-Color-Light-300/30 shadow-lg">
                      <h4 className="typography-h4 text-Color-Dark-500 mb-8 flex items-center">
                        <Sparkles className="h-6 w-6 text-Color-Light-300 mr-3" />
                        Text Buttons
                      </h4>
                      <div className="flex flex-wrap gap-6 justify-center">
                        <button className="btn--text">
                          <span>Explore Collection</span>
                        </button>
                        <button className="btn--text">
                          <span>Read More</span>
                        </button>
                        <button className="btn--text">
                          <span>View Details</span>
                        </button>
                      </div>
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => copyToClipboard('btn--text')}
                          className="typography-caption text-Color-Light-300 hover:text-Color-Dark-500 transition-colors"
                        >
                          {copied === 'btn--text' ? 'Copied!' : 'Copy .btn--text'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cards */}
              {activeComponent === 'cards' && (
                <div className="space-y-12">
                  <div className="text-center">
                    <h3 className="typography-h3 text-Color-Dark-500 mb-4">Cards & Containers</h3>
                    <p className="typography-body-lg text-Color-Gray-700 max-w-2xl mx-auto">
                      Flexible card layouts for content presentation and product displays.
                    </p>
                  </div>
                  
                  <div className="grid gap-12">
                    {/* Product Card */}
                    <div className="space-y-6">
                      <h4 className="typography-h4 text-Color-Dark-500">Product Card</h4>
                      <div className="flex justify-center">
                        <div className="w-80 bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 rounded-xl shadow-lg border border-Color-Light-300/30 overflow-hidden">
                          <div className="h-64 bg-Color-Secondary flex items-center justify-center">
                            <img src="https://ik.imagekit.io/qcvroy8xpd/3.Solitaire%20Ring.png?updatedAt=1756887836825" alt="Product" className="w-32 h-32 object-contain" />
                          </div>
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-2">
                              <span className="typography-caption bg-Color-Light-300/20 text-Color-Dark-500 px-2 py-1 rounded-full">Engagement Ring</span>
                              <div className="flex text-Color-Light-300">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-current" />
                                ))}
                              </div>
                            </div>
                            <h5 className="typography-body-lg text-Color-Dark-500 font-semibold mb-2">Solitaire Diamond Ring</h5>
                            <p className="typography-body text-Color-Gray-700 mb-4">Elegant solitaire with certified diamond</p>
                            <div className="typography-price text-Color-Dark-500 font-bold mb-4">€1.250</div>
                            <button className="w-full btn-primary py-3">
                              <ShoppingBag className="mr-2 h-4 w-4" />
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className="space-y-6">
                      <h4 className="typography-h4 text-Color-Dark-500">Content Card</h4>
                      <div className="flex justify-center">
                        <div className="w-96 bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 rounded-xl shadow-lg border border-Color-Light-300/30 p-8">
                          <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-Color-Light-300 rounded-full flex items-center justify-center mr-4">
                              <Crown className="h-6 w-6 text-Color-Netural-White" />
                            </div>
                            <h5 className="typography-h5 text-Color-Dark-500 font-bold">About Caroline</h5>
                          </div>
                          <p className="typography-body text-Color-Gray-700 leading-relaxed">
                            With over 15 years of experience in Antwerp's diamond district, Caroline creates jewelry that tells your unique story.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Forms */}
              {activeComponent === 'forms' && (
                <div className="space-y-12">
                  <div className="text-center">
                    <h3 className="typography-h3 text-Color-Dark-500 mb-4">Form Components</h3>
                    <p className="typography-body-lg text-Color-Gray-700 max-w-2xl mx-auto">
                      Accessible form elements with clear validation states and luxury styling.
                    </p>
                  </div>
                  
                  <div className="max-w-2xl mx-auto space-y-8">
                    {/* Input Fields */}
                    <div className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 border border-Color-Light-300/30 p-8 rounded-xl shadow-lg">
                      <h4 className="typography-h5 text-Color-Dark-500 mb-6">Input Fields</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block typography-body font-medium text-Color-Dark-500 mb-2">Name</label>
                          <input type="text" placeholder="Enter your name" className="w-full px-4 py-3 border-2 border-Color-Light-300/50 rounded-xl focus:ring-2 focus:ring-Color-Light-300 focus:border-Color-Light-300 transition-all duration-300" />
                        </div>
                        <div>
                          <label className="block typography-body font-medium text-Color-Dark-500 mb-2">Email</label>
                          <input type="email" placeholder="your.email@example.com" className="w-full px-4 py-3 border-2 border-Color-Light-300/50 rounded-xl focus:ring-2 focus:ring-Color-Light-300 focus:border-Color-Light-300 transition-all duration-300" />
                        </div>
                        <div>
                          <label className="block typography-body font-medium text-Color-Dark-500 mb-2">Message</label>
                          <textarea rows={4} placeholder="Tell us about your jewelry wishes..." className="w-full px-4 py-3 border-2 border-Color-Light-300/50 rounded-xl focus:ring-2 focus:ring-Color-Light-300 focus:border-Color-Light-300 transition-all duration-300 resize-none"></textarea>
                        </div>
                      </div>
                    </div>

                    {/* Select & Checkbox */}
                    <div className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 border border-Color-Light-300/30 p-8 rounded-xl shadow-lg">
                      <h4 className="typography-h5 text-Color-Dark-500 mb-6">Select & Options</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block typography-body font-medium text-Color-Dark-500 mb-2">Gold Type</label>
                          <select className="w-full px-4 py-3 border-2 border-Color-Light-300/50 rounded-xl focus:ring-2 focus:ring-Color-Light-300 focus:border-Color-Light-300 transition-all duration-300">
                            <option>18k Yellow Gold</option>
                            <option>18k White Gold</option>
                            <option>18k Rose Gold</option>
                          </select>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-3 w-5 h-5 text-Color-Light-300 border-Color-Light-300 rounded focus:ring-Color-Light-300" />
                          <label className="typography-body text-Color-Dark-500">I agree to the terms and conditions</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              {activeComponent === 'navigation' && (
                <div className="space-y-12">
                  <div className="text-center">
                    <h3 className="typography-h3 text-Color-Dark-500 mb-4">Navigation Components</h3>
                    <p className="typography-body-lg text-Color-Gray-700 max-w-2xl mx-auto">
                      Navigation elements for seamless user journeys through the jewelry experience.
                    </p>
                  </div>
                  
                  <div className="space-y-12">
                    {/* Header Navigation */}
                    <div className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 border border-Color-Light-300/30 p-8 rounded-xl shadow-lg">
                      <h4 className="typography-h5 text-Color-Dark-500 mb-6">Header Navigation</h4>
                      <div className="bg-Color-Netural-Black p-6 rounded-xl">
                        <div className="flex items-center justify-between">
                          <img src="/logo.svg" alt="Logo" className="h-12 w-auto" style={{ filter: 'brightness(0) saturate(100%) invert(84%) sepia(18%) saturate(456%) hue-rotate(12deg) brightness(95%) contrast(89%)' }} />
                          <div className="hidden lg:flex items-center space-x-8">
                            <button className="text-Color-Light-300 hover:text-white transition-colors">Shop by Occasion</button>
                            <button className="text-Color-Light-300 hover:text-white transition-colors">Explore All Jewelry</button>
                            <button className="text-Color-Light-300 hover:text-white transition-colors">Collections</button>
                          </div>
                          <div className="flex items-center gap-4">
                            <Heart className="h-6 w-6 text-Color-Light-300" />
                            <ShoppingBag className="h-6 w-6 text-Color-Light-300" />
                            <Menu className="h-6 w-6 text-Color-Light-300 lg:hidden" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Breadcrumbs */}
                    <div className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 border border-Color-Light-300/30 p-8 rounded-xl shadow-lg">
                      <h4 className="typography-h5 text-Color-Dark-500 mb-6">Breadcrumbs</h4>
                      <div className="flex items-center space-x-2 typography-body text-Color-Gray-700">
                        <span>Home</span>
                        <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                        <span>Shop</span>
                        <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                        <span className="text-Color-Dark-500 font-medium">Engagement Rings</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback */}
              {activeComponent === 'feedback' && (
                <div className="space-y-12">
                  <div className="text-center">
                    <h3 className="typography-h3 text-Color-Dark-500 mb-4">Feedback Components</h3>
                    <p className="typography-body-lg text-Color-Gray-700 max-w-2xl mx-auto">
                      User feedback elements including alerts, notifications, and loading states.
                    </p>
                  </div>
                  
                  <div className="space-y-8">
                    {/* Alerts */}
                    <div className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 border border-Color-Light-300/30 p-8 rounded-xl shadow-lg">
                      <h4 className="typography-h5 text-Color-Dark-500 mb-6">Alert Messages</h4>
                      <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                          <span className="typography-body text-green-800">Order successfully placed!</span>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-center">
                          <Info className="h-5 w-5 text-blue-600 mr-3" />
                          <span className="typography-body text-blue-800">Custom jewelry takes 10-14 days to create.</span>
                        </div>
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center">
                          <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                          <span className="typography-body text-red-800">This item is currently out of stock.</span>
                        </div>
                      </div>
                    </div>

                    {/* Loading States */}
                    <div className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 border border-Color-Light-300/30 p-8 rounded-xl shadow-lg">
                      <h4 className="typography-h5 text-Color-Dark-500 mb-6">Loading States</h4>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-Color-Secondary rounded-lg">
                          <div className="animate-spin h-8 w-8 border-b-2 border-Color-Light-300 mx-auto mb-4"></div>
                          <span className="typography-caption text-Color-Gray-700">Loading...</span>
                        </div>
                        <div className="text-center p-6 bg-Color-Secondary rounded-lg">
                          <div className="w-8 h-8 bg-Color-Light-300 rounded-full mx-auto mb-4 animate-luxury-glow"></div>
                          <span className="typography-caption text-Color-Gray-700">Processing...</span>
                        </div>
                        <div className="text-center p-6 bg-Color-Secondary rounded-lg">
                          <div className="flex space-x-1 justify-center mb-4">
                            <div className="w-2 h-2 bg-Color-Light-300 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-Color-Light-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-Color-Light-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="typography-caption text-Color-Gray-700">Uploading...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PATTERNS */}
          {activeSection === 'patterns' && (
            <div className="space-y-12">
              <div className="text-center mb-10">
                <h2 className="typography-h2 text-Color-Dark-500 mb-6">Patterns</h2>
                <div className="h-[3px] w-24 bg-Color-Light-300 mx-auto mb-8"></div>
                <p className="typography-body-xl text-Color-Gray-700 max-w-3xl mx-auto">
                  Higher-level, repeatable solutions for common problems and user flows.
                </p>
              </div>

              {/* Pattern Navigation */}
              <div className="flex justify-center mb-12">
                <div className="flex flex-wrap gap-2 bg-Color-Secondary p-2 rounded-xl shadow-lg">
                  {patterns.map((pattern) => (
                    <button
                      key={pattern.id}
                      onClick={() => setActivePattern(pattern.id)}
                      className={`px-4 py-2 flex items-center text-sm font-medium transition-all duration-300 rounded-lg ${
                        activePattern === pattern.id
                          ? 'bg-Color-Light-300 text-Color-Netural-White shadow-lg'
                          : 'text-Color-Dark-500 hover:bg-Color-Light-300/20'
                      }`}
                    >
                      <pattern.icon className="h-4 w-4 mr-2" />
                      {pattern.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Patterns */}
              {activePattern === 'forms' && (
                <div className="space-y-12">
                  <div className="text-center">
                    <h3 className="typography-h3 text-Color-Dark-500 mb-4">Form Patterns</h3>
                    <p className="typography-body-lg text-Color-Gray-700 max-w-2xl mx-auto">
                      Multi-step forms, validation patterns, and user-friendly input flows.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 border border-Color-Light-300/30 p-8 rounded-xl shadow-lg">
                    <h4 className="typography-h5 text-Color-Dark-500 mb-6">Contact Form Pattern</h4>
                    <div className="max-w-lg mx-auto">
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block typography-body font-medium text-Color-Dark-500 mb-2">First Name *</label>
                            <input type="text" className="w-full px-4 py-3 border-2 border-Color-Light-300/50 rounded-xl focus:ring-2 focus:ring-Color-Light-300 focus:border-Color-Light-300 transition-all duration-300" />
                          </div>
                          <div>
                            <label className="block typography-body font-medium text-Color-Dark-500 mb-2">Last Name *</label>
                            <input type="text" className="w-full px-4 py-3 border-2 border-Color-Light-300/50 rounded-xl focus:ring-2 focus:ring-Color-Light-300 focus:border-Color-Light-300 transition-all duration-300" />
                          </div>
                        </div>
                        <div>
                          <label className="block typography-body font-medium text-Color-Dark-500 mb-2">Subject</label>
                          <select className="w-full px-4 py-3 border-2 border-Color-Light-300/50 rounded-xl focus:ring-2 focus:ring-Color-Light-300 focus:border-Color-Light-300 transition-all duration-300">
                            <option>Engagement Rings</option>
                            <option>Custom Design</option>
                            <option>Consultation</option>
                          </select>
                        </div>
                        <button className="w-full btn-primary py-4">
                          <span>Send Message</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Responsive Design */}
              {activePattern === 'responsive' && (
                <div className="space-y-12">
                  <div className="text-center">
                    <h3 className="typography-h3 text-Color-Dark-500 mb-4">Responsive Design System</h3>
                    <p className="typography-body-lg text-Color-Gray-700 max-w-2xl mx-auto">
                      Mobile-first approach with fluid layouts and touch-friendly interactions.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {breakpoints.map((bp, i) => (
                      <div key={i} className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 border border-Color-Light-300/30 p-8 rounded-xl shadow-lg text-center">
                        <div className="w-16 h-16 bg-Color-Light-300 rounded-full flex items-center justify-center mx-auto mb-6">
                          {i === 0 && <Smartphone className="h-8 w-8 text-Color-Netural-White" />}
                          {i === 1 && <Tablet className="h-8 w-8 text-Color-Netural-White" />}
                          {i >= 2 && <Monitor className="h-8 w-8 text-Color-Netural-White" />}
                        </div>
                        <h5 className="typography-h6 text-Color-Dark-500 font-bold mb-2">{bp.name}</h5>
                        <p className="typography-caption text-Color-Light-300 font-medium mb-2">{bp.size}</p>
                        <p className="typography-caption text-Color-Gray-700">{bp.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Mobile Spacing Adjustments */}
                  <div className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 border border-Color-Light-300/30 p-8 rounded-xl shadow-lg">
                    <h4 className="typography-h5 text-Color-Dark-500 mb-6">Mobile Spacing Adjustments</h4>
                    <div className="bg-Color-Netural-Black p-6 rounded-xl text-Color-Netural-White">
                      <pre className="typography-caption overflow-x-auto">
{`/* Mobile spacing fixes */
@media (max-width: 640px) {
  .py-32 { @apply py-12; }
  .py-24 { @apply py-8; }
  .px-16 { @apply px-4; }
  .gap-16 { @apply gap-6; }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Handling */}
              {activePattern === 'errors' && (
                <div className="space-y-12">
                  <div className="text-center">
                    <h3 className="typography-h3 text-Color-Dark-500 mb-4">Error Handling</h3>
                    <p className="typography-body-lg text-Color-Gray-700 max-w-2xl mx-auto">
                      Graceful error states and empty state patterns for better user experience.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Empty State */}
                    <div className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 border border-Color-Light-300/30 p-8 rounded-xl shadow-lg">
                      <h4 className="typography-h5 text-Color-Dark-500 mb-6">Empty Cart State</h4>
                      <div className="text-center py-12 bg-Color-Secondary rounded-lg">
                        <ShoppingBag className="h-16 w-16 text-Color-Light-300 mx-auto mb-4" />
                        <h5 className="typography-h6 text-Color-Dark-500 mb-2">Your cart is empty</h5>
                        <p className="typography-body text-Color-Gray-700 mb-6">Add some beautiful jewelry to get started</p>
                        <button className="btn-primary">Continue Shopping</button>
                      </div>
                    </div>

                    {/* 404 Error */}
                    <div className="bg-gradient-to-b from-Color-Netural-White to-Color-Secondary/30 border border-Color-Light-300/30 p-8 rounded-xl shadow-lg">
                      <h4 className="typography-h5 text-Color-Dark-500 mb-6">404 Error State</h4>
                      <div className="text-center py-12 bg-Color-Secondary rounded-lg">
                        <AlertCircle className="h-16 w-16 text-Color-Light-300 mx-auto mb-4" />
                        <h5 className="typography-h6 text-Color-Dark-500 mb-2">Page Not Found</h5>
                        <p className="typography-body text-Color-Gray-700 mb-6">The page you're looking for doesn't exist</p>
                        <button className="btn-primary">Back to Shop</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <section className="py-16 bg-gradient-to-r from-Color-Netural-Black to-Color-Dark-500 text-Color-Netural-White">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="typography-h3 text-Color-Netural-White mb-6">
            Design System Guidelines
          </h3>
          <p className="typography-body-lg text-Color-Light-300 mb-8 max-w-2xl mx-auto">
            This comprehensive design system ensures consistency across all touchpoints of the Diamonds by CS brand experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onNavigate('/')}
              className="btn-secondary px-8 py-4 flex items-center justify-center"
            >
              <Crown className="mr-2 h-5 w-5" />
              View Homepage
            </button>
            <button 
              onClick={() => onNavigate('/shop')}
              className="btn-secondary px-8 py-4 flex items-center justify-center"
            >
              <Diamond className="mr-2 h-5 w-5" />
              See in Action
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};