import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Cookie, Shield, Eye, Target, Settings, Clock, Share2, Trash2, Chrome, Siren as Firefox, Variable as Safari, Globe, CheckCircle, AlertTriangle, Info, Phone, Mail, Calendar, Database, Lock, UserCheck, RotateCcw } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { contactInfo } from '../config/siteConfig';

interface CookiePolicyPageProps {
  onNavigate: (page: string) => void;
}

export const CookiePolicyPage: React.FC<CookiePolicyPageProps> = ({ onNavigate }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const cookieTypes = [
    {
      id: 'necessary',
      title: 'Strikt Noodzakelijke Cookies',
      icon: Shield,
      color: 'from-green-500 to-green-600',
      status: 'Altijd Actief',
      description: 'Deze cookies zijn essentieel voor de werking van onze website en kunnen niet worden uitgeschakeld.',
      examples: [
        'Winkelwagen functionaliteit',
        'Taalinstellingen',
        'Beveiligingscookies',
        'Sessie-identificatie',
        'GDPR consent status'
      ],
      retention: 'Sessie of 1 jaar'
    },
    {
      id: 'functional',
      title: 'Functionele Cookies',
      icon: Settings,
      color: 'from-blue-500 to-blue-600',
      status: 'Optioneel',
      description: 'Deze cookies helpen ons uw voorkeuren te onthouden voor een betere gebruikerservaring.',
      examples: [
        'Inloggegevens onthouden',
        'Persoonlijke voorkeuren',
        'Taalvoorkeur',
        'Regio-instellingen',
        'Toegankelijkheidsinstellingen'
      ],
      retention: '1 jaar'
    },
    {
      id: 'analytics',
      title: 'Analytische Cookies',
      icon: Eye,
      color: 'from-purple-500 to-purple-600',
      status: 'Optioneel',
      description: 'Deze cookies helpen ons begrijpen hoe bezoekers onze website gebruiken, zodat we deze kunnen verbeteren.',
      examples: [
        'Google Analytics',
        'Paginaweergaven',
        'Gebruikersgedrag',
        'Populaire producten',
        'Website prestaties'
      ],
      retention: '2 jaar'
    },
    {
      id: 'marketing',
      title: 'Marketing Cookies',
      icon: Target,
      color: 'from-orange-500 to-orange-600',
      status: 'Optioneel',
      description: 'Deze cookies worden gebruikt om u relevante advertenties en aanbiedingen te tonen.',
      examples: [
        'Facebook Pixel',
        'Google Ads',
        'Retargeting',
        'Gepersonaliseerde advertenties',
        'Conversie tracking'
      ],
      retention: '1-2 jaar'
    }
  ];

  const thirdPartyCookies = [
    {
      name: 'Google Analytics',
      purpose: 'Website analyse en statistieken',
      privacy: 'https://policies.google.com/privacy',
      retention: '2 jaar'
    },
    {
      name: 'Google Ads',
      purpose: 'Advertenties en conversie tracking',
      privacy: 'https://policies.google.com/privacy',
      retention: '1 jaar'
    },
    {
      name: 'Facebook Pixel',
      purpose: 'Social media marketing en retargeting',
      privacy: 'https://www.facebook.com/privacy/policy',
      retention: '1 jaar'
    },
    {
      name: 'Stripe',
      purpose: 'Veilige betalingsverwerking',
      privacy: 'https://stripe.com/privacy',
      retention: 'Sessie'
    },
    {
      name: 'Shopify',
      purpose: 'E-commerce functionaliteit',
      privacy: 'https://www.shopify.com/legal/privacy',
      retention: '1 jaar'
    }
  ];

  const browserGuides = [
    {
      name: 'Google Chrome',
      icon: Chrome,
      steps: [
        'Klik op de drie puntjes rechtsboven',
        'Ga naar Instellingen > Privacy en beveiliging',
        'Klik op Cookies en andere sitegegevens',
        'Beheer of verwijder cookies'
      ]
    },
    {
      name: 'Mozilla Firefox',
      icon: Firefox,
      steps: [
        'Klik op het menu (drie lijntjes)',
        'Ga naar Instellingen > Privacy & Beveiliging',
        'Scroll naar Cookies en Sitegegevens',
        'Klik op Gegevens beheren'
      ]
    },
    {
      name: 'Safari',
      icon: Safari,
      steps: [
        'Ga naar Safari > Voorkeuren',
        'Klik op het tabblad Privacy',
        'Klik op Websitegegevens beheren',
        'Selecteer en verwijder cookies'
      ]
    }
  ];

  const sections = [
    {
      id: 'what-are-cookies',
      title: '1. Wat zijn cookies?',
      icon: Cookie,
      content: [
        'Cookies zijn kleine tekstbestanden die op uw computer of mobiele apparaat worden geplaatst wanneer u een website bezoekt.',
        'Ze helpen ons om onze website goed te laten werken, het gebruik te analyseren en u een betere gebruikerservaring te bieden.',
        'Cookies bevatten geen persoonlijke informatie die u direct kan identificeren, maar kunnen wel worden gebruikt om u een meer gepersonaliseerde webervaring te bieden.'
      ]
    },
    {
      id: 'consent',
      title: '3. Toestemming',
      icon: UserCheck,
      content: [
        'Bij uw eerste bezoek aan onze website wordt een cookiebanner getoond waar u kunt kiezen:',
        '• ✅ Alles accepteren - Alle cookies worden geplaatst',
        '• ❌ Alleen noodzakelijke - Alleen essentiële cookies',
        '• ⚙️ Voorkeuren beheren - Kies per categorie',
        '',
        'U kunt uw toestemming op elk moment intrekken of wijzigen via de cookie-instellingen in onze footer.',
        'Uw keuzes worden opgeslagen en onthouden voor toekomstige bezoeken.'
      ]
    },
    {
      id: 'retention',
      title: '4. Bewaartermijn',
      icon: Clock,
      content: [
        'Verschillende cookies hebben verschillende bewaartermijnen:',
        '',
        '• Sessie-cookies: Worden automatisch verwijderd na het sluiten van uw browser',
        '• Permanente cookies: Blijven actief totdat hun bewaartermijn verloopt',
        '• Analytische cookies: Meestal 2 jaar',
        '• Marketing cookies: 1-2 jaar',
        '• Functionele cookies: 1 jaar',
        '',
        'U kunt cookies altijd handmatig verwijderen via uw browserinstellingen.'
      ]
    },
    {
      id: 'management',
      title: '6. Hoe cookies beheren?',
      icon: Settings,
      content: [
        'U heeft verschillende opties om cookies te beheren:',
        '',
        '1. Via onze website: Gebruik de cookie-instellingen in de footer',
        '2. Via uw browser: Alle browsers hebben cookie-beheeropties',
        '3. Via externe tools: Sommige organisaties bieden cookie-beheertools',
        '',
        'Let op: Het uitschakelen van bepaalde cookies kan de functionaliteit van onze website beïnvloeden.'
      ]
    },
    {
      id: 'changes',
      title: '7. Wijzigingen',
      icon: RotateCcw,
      content: [
        'Wij behouden ons het recht voor om deze cookieverklaring te wijzigen.',
        'Belangrijke wijzigingen zullen worden gecommuniceerd via onze website.',
        'Controleer regelmatig deze pagina voor de meest recente versie.',
        'De datum van laatste wijziging staat altijd bovenaan deze pagina.'
      ]
    }
  ];

  return (
    <div className="bg-Color-Netural-White">
      <PageHero 
        title="Cookieverklaring"
        subtitle="Cookie Policy"
        backgroundImage="https://diamondsbycs.com/images/uploads/upload-666be9d315beb.jpg"
      />
      
      <section className="py-20 sm:py-32 lg:py-40 xl:py-48 bg-gradient-to-br from-Color-Netural-White via-Color-Secondary/20 to-Color-Netural-White luxury-texture relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            animate={{ 
              y: [0, -25, 0],
              rotate: [0, 15, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-24 left-1/4 w-48 h-48 bg-gradient-to-br from-Color-Light-300/8 to-Color-Light-300/2 rounded-full"
          />
          <motion.div 
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -12, 0],
              scale: [1, 0.85, 1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute bottom-24 right-1/4 w-36 h-36 bg-gradient-to-br from-Color-Light-300/6 to-Color-Light-300/1 rounded-full"
          />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12 relative z-10">
          {/* Header */}
          <motion.div 
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
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
                <Cookie className="h-8 w-8 text-Color-Netural-White" />
              </motion.div>
            </motion.div>
            
            <h1 className="typography-h2 text-Color-Dark-500 mb-6 relative">
              Cookieverklaring
              <motion.div 
                initial={{ width: 0 }}
                animate={inView ? { width: "160px" } : { width: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 h-[4px] bg-gradient-to-r from-transparent via-Color-Light-300/60 to-transparent"
              />
            </h1>
            
            <div className="bg-gradient-to-r from-Color-Light-300/10 to-Color-Light-300/5 p-6 rounded-xl border border-Color-Light-300/30 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-3">
                <Calendar className="h-5 w-5 text-Color-Light-300 mr-2" />
                <span className="typography-body font-semibold text-Color-Dark-500">
                  Laatst bijgewerkt: 6 januari 2025
                </span>
              </div>
              <p className="typography-body text-Color-Gray-700 text-center">
                Transparante informatie over hoe wij cookies gebruiken op onze website
              </p>
            </div>
          </motion.div>

          {/* What are Cookies Section */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-Color-Netural-White to-Color-Secondary/30 rounded-2xl shadow-xl border border-Color-Light-300/40 overflow-hidden relative mb-12"
          >
            <div className="bg-gradient-to-r from-Color-Netural-White to-Color-Secondary/20 p-8 border-b border-Color-Light-300/30">
              <div className="flex items-center">
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 bg-Color-Light-300 rounded-full flex items-center justify-center shadow-lg mr-4"
                >
                  <Cookie className="h-6 w-6 text-Color-Netural-White" />
                </motion.div>
                <h2 className="typography-h4 text-Color-Dark-500 font-bold">
                  1. Wat zijn cookies?
                </h2>
              </div>
            </div>
            
            <div className="p-8">
              <div className="space-y-4">
                <p className="typography-body text-Color-Gray-700 leading-relaxed">
                  Cookies zijn kleine tekstbestanden die op uw computer of mobiele apparaat worden geplaatst wanneer u een website bezoekt. Ze helpen ons om onze website goed te laten werken, het gebruik te analyseren en u een betere gebruikerservaring te bieden.
                </p>
                <p className="typography-body text-Color-Gray-700 leading-relaxed">
                  Cookies bevatten geen persoonlijke informatie die u direct kan identificeren, maar kunnen wel worden gebruikt om u een meer gepersonaliseerde webervaring te bieden.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Cookie Types Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="typography-h3 text-Color-Dark-500 mb-6">
                2. Welke <span className="text-Color-Light-300">Cookies</span> gebruiken wij?
              </h2>
              <p className="typography-body-lg text-Color-Gray-700 max-w-3xl mx-auto">
                Wij gebruiken verschillende categorieën cookies, elk met hun eigen doel en functionaliteit
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {cookieTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gradient-to-br from-Color-Netural-White to-Color-Secondary/30 rounded-xl shadow-lg border border-Color-Light-300/30 overflow-hidden relative"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-Color-Light-300/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <motion.div 
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className={`w-12 h-12 bg-gradient-to-r ${type.color} rounded-full flex items-center justify-center shadow-lg mr-4`}
                        >
                          <type.icon className="h-6 w-6 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="typography-h6 text-Color-Dark-500 font-bold">{type.title}</h3>
                          <span className={`typography-caption px-3 py-1 rounded-full ${
                            type.status === 'Altijd Actief' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {type.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="typography-body text-Color-Gray-700 leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h4 className="typography-body font-semibold text-Color-Dark-500 mb-3">Voorbeelden:</h4>
                    <ul className="space-y-2 mb-4">
                      {type.examples.map((example, i) => (
                        <li key={i} className="flex items-center typography-caption text-Color-Gray-700">
                          <CheckCircle className="h-3 w-3 text-Color-Light-300 mr-2 flex-shrink-0" />
                          {example}
                        </li>
                      ))}
                    </ul>
                    <div className="bg-Color-Light-300/10 p-3 rounded-lg">
                      <span className="typography-caption text-Color-Dark-500 font-medium">
                        Bewaartermijn: {type.retention}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Third Party Cookies */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-Color-Netural-White to-Color-Secondary/30 rounded-2xl shadow-xl border border-Color-Light-300/40 overflow-hidden">
              <div className="bg-gradient-to-r from-Color-Netural-White to-Color-Secondary/20 p-8 border-b border-Color-Light-300/30">
                <div className="flex items-center">
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 bg-Color-Light-300 rounded-full flex items-center justify-center shadow-lg mr-4"
                  >
                    <Share2 className="h-6 w-6 text-Color-Netural-White" />
                  </motion.div>
                  <h2 className="typography-h4 text-Color-Dark-500 font-bold">
                    5. Cookies van derden
                  </h2>
                </div>
              </div>
              
              <div className="p-8">
                <p className="typography-body text-Color-Gray-700 leading-relaxed mb-8">
                  Sommige cookies worden geplaatst door derden om specifieke diensten te leveren. 
                  Deze partijen hebben hun eigen privacy- en cookiebeleid.
                </p>
                
                <div className="grid gap-6">
                  {thirdPartyCookies.map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                      className="bg-Color-Netural-White p-6 rounded-xl border border-Color-Light-300/30 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="typography-h6 text-Color-Dark-500 font-bold">{service.name}</h4>
                        <span className="typography-caption bg-Color-Light-300/20 text-Color-Dark-500 px-3 py-1 rounded-full">
                          {service.retention}
                        </span>
                      </div>
                      <p className="typography-body text-Color-Gray-700 mb-3">{service.purpose}</p>
                      <a 
                        href={service.privacy} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="typography-caption text-Color-Light-300 hover:text-Color-Dark-500 transition-colors duration-200 flex items-center"
                      >
                        <Globe className="h-3 w-3 mr-1" />
                        Privacy Policy
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Browser Management Guide */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h3 className="typography-h3 text-Color-Dark-500 mb-6">
                Browser <span className="text-Color-Light-300">Instellingen</span>
              </h3>
              <p className="typography-body-lg text-Color-Gray-700 max-w-3xl mx-auto">
                Leer hoe u cookies kunt beheren in de meest populaire browsers
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {browserGuides.map((browser, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{ duration: 0.6, delay: 1 + (index * 0.1) }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-Color-Netural-White to-Color-Secondary/30 p-8 rounded-xl shadow-lg border border-Color-Light-300/30 text-center"
                >
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-Color-Light-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <browser.icon className="h-8 w-8 text-Color-Netural-White" />
                  </motion.div>
                  <h4 className="typography-h6 text-Color-Dark-500 font-bold mb-4">{browser.name}</h4>
                  <ol className="typography-caption text-Color-Gray-700 space-y-2 text-left">
                    {browser.steps.map((step, i) => (
                      <li key={i} className="flex items-start">
                        <span className="w-5 h-5 bg-Color-Light-300 text-Color-Netural-White rounded-full flex items-center justify-center mr-3 mt-0.5 text-xs font-bold">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Additional Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 60 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="bg-gradient-to-br from-Color-Netural-White to-Color-Secondary/30 rounded-2xl shadow-xl border border-Color-Light-300/40 overflow-hidden relative"
              >
                {/* Section Header */}
                <div className="bg-gradient-to-r from-Color-Netural-White to-Color-Secondary/20 p-8 border-b border-Color-Light-300/30 relative z-10">
                  <div className="flex items-center">
                    <motion.div 
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-12 h-12 bg-Color-Light-300 rounded-full flex items-center justify-center shadow-lg mr-4"
                    >
                      <section.icon className="h-6 w-6 text-Color-Netural-White" />
                    </motion.div>
                    <h2 className="typography-h4 text-Color-Dark-500 font-bold">
                      {section.title}
                    </h2>
                  </div>
                </div>
                
                {/* Section Content */}
                <div className="p-8 relative z-10">
                  <div className="space-y-4">
                    {section.content.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, delay: 0.2 + (itemIndex * 0.05) }}
                        className={`${item === '' ? 'h-2' : 'flex items-start'}`}
                      >
                        {item !== '' && (
                          <>
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 360 }}
                              transition={{ duration: 0.5 }}
                              className="w-2 h-2 bg-Color-Light-300 rounded-full mt-3 mr-4 flex-shrink-0"
                            />
                            <p className="typography-body text-Color-Gray-700 leading-relaxed">
                              {item}
                            </p>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cookie Management CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-16"
          >
            <div className="bg-gradient-to-r from-Color-Netural-Black to-Color-Dark-500 text-Color-Netural-White p-12 rounded-2xl shadow-2xl border border-Color-Light-300/30 relative overflow-hidden">
              {/* Background Pattern */}
              <motion.div
                animate={{ 
                  backgroundPosition: ["0% 0%", "100% 100%"],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 luxury-texture"
              />
              
              <div className="relative z-10 text-center">
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={inView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                  transition={{ duration: 1, delay: 1.4, type: "spring" }}
                  className="w-20 h-20 bg-Color-Light-300/20 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                  <Settings className="h-10 w-10 text-Color-Light-300" />
                </motion.div>
                
                <h3 className="typography-h3 text-Color-Netural-White mb-6">
                  Beheer Uw Cookie Voorkeuren
                </h3>
                <p className="typography-body-lg text-Color-Light-300 mb-8 max-w-2xl mx-auto">
                  U heeft volledige controle over welke cookies wij mogen gebruiken. 
                  Wijzig uw voorkeuren op elk moment.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      // Trigger cookie settings modal
                      const event = new CustomEvent('openCookieSettings');
                      window.dispatchEvent(event);
                    }}
                    className="btn-secondary px-8 py-4 flex items-center justify-center"
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    Cookie Instellingen
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('/contact')}
                    className="btn-secondary px-8 py-4 flex items-center justify-center"
                  >
                    <Phone className="mr-3 h-5 w-5" />
                    Privacy Vragen
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Important Notices */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mt-16 space-y-8"
          >
            {/* GDPR Notice */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 p-8 rounded-r-xl shadow-lg">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="typography-h6 text-green-800 font-bold mb-3">
                    GDPR Compliant Cookies
                  </h3>
                  <p className="typography-body text-green-700 leading-relaxed">
                    Al onze cookies voldoen aan de GDPR-wetgeving. U heeft volledige controle en transparantie 
                    over welke cookies worden gebruikt en waarvoor.
                  </p>
                </div>
              </div>
            </div>

            {/* Jewelry Specific */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-400 p-8 rounded-r-xl shadow-lg">
              <div className="flex items-start">
                <Info className="h-6 w-6 text-blue-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="typography-h6 text-blue-800 font-bold mb-3">
                    Juwelen Voorkeuren
                  </h3>
                  <p className="typography-body text-blue-700 leading-relaxed">
                    Wij gebruiken cookies om uw juwelen voorkeuren te onthouden (stijl, materialen, budget) 
                    zodat wij u beter kunnen adviseren tijdens consultaties.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};