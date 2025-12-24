import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FileText, 
  Shield, 
  CreditCard, 
  Truck, 
  RotateCcw, 
  Award, 
  MessageSquare, 
  Scale,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { contactInfo } from '../config/siteConfig';

interface TermsConditionsPageProps {
  onNavigate: (page: string) => void;
}

export const TermsConditionsPage: React.FC<TermsConditionsPageProps> = ({ onNavigate }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const sections = [
    {
      id: 'identity',
      title: '1. Identiteit van de ondernemer',
      icon: Shield,
      content: [
        'Diamonds by CS',
        'Contactpersoon: Caroline Schreiber',
        `Adres: ${contactInfo.address.street}, ${contactInfo.address.postalCode} ${contactInfo.address.city}`,
        `Telefoon: ${contactInfo.phone}`,
        `E-mailadres: ${contactInfo.email}`,
        'Ondernemingsnummer: BE 0848.946.770',
        'Rechtspersonenregister: RPR Antwerpen, afdeling Antwerpen'
      ]
    },
    {
      id: 'intellectual-property',
      title: '2. Intellectuele eigendomsrechten',
      icon: Shield,
      content: [
        'De inhoud van deze website, waaronder alle merken, logo\'s, tekeningen, data, product- of bedrijfsnamen, teksten, beelden en meer, is beschermd door intellectuele rechten.',
        'Deze inhoud behoort toe aan Diamonds by CS of aan derden die rechten hebben verleend.',
        'Het is niet toegestaan deze inhoud te verveelvoudigen, te wijzigen, openbaar te maken of te verspreiden zonder voorafgaande schriftelijke toestemming van Diamonds by CS.'
      ]
    },
    {
      id: 'liability',
      title: '3. Beperking van aansprakelijkheid',
      icon: AlertTriangle,
      content: [
        'De informatie op deze website is van algemene aard en is niet aangepast aan persoonlijke of specifieke omstandigheden.',
        'Deze informatie kan dus niet beschouwd worden als persoonlijk, professioneel of juridisch advies aan de gebruiker.',
        'Diamonds by CS zal alles in het werk stellen om te zorgen voor correcte en up-to-date informatie op de website.',
        'Ondanks deze inspanningen kan Diamonds by CS niet instaan voor de juistheid, volledigheid of actualiteit van de informatie.',
        'Diamonds by CS kan niet aansprakelijk worden gesteld voor directe of indirecte schade die voortvloeit uit het gebruik van de informatie op deze website.'
      ]
    },
    {
      id: 'website-content',
      title: '4. Website inhoud',
      icon: FileText,
      content: [
        'De website kan te allen tijde zonder voorafgaande kennisgeving of verklaring worden aangepast of gewijzigd.',
        'Diamonds by CS geeft geen garanties voor de goede werking van de website en kan op geen enkele wijze aansprakelijk worden gesteld voor een slechte werking of tijdelijke onbeschikbaarheid.',
        'Diamonds by CS kan in geen geval aansprakelijk worden gesteld voor enigerlei schade die rechtstreeks of onrechtstreeks voortvloeit uit het gebruik van deze website.',
        'De website kan hyperlinks bevatten naar andere websites of pagina\'s van derden. Diamonds by CS heeft geen enkele controle over de inhoud van die websites en kan dus niet aansprakelijk worden gesteld voor de inhoud ervan.'
      ]
    },
    {
      id: 'applicable-law',
      title: '5. Toepasselijk recht',
      icon: Scale,
      content: [
        'Op deze website is het Belgisch recht van toepassing.',
        'In geval van een geschil zijn enkel de rechtbanken van het gerechtelijk arrondissement van de maatschappelijke zetel van Diamonds by CS bevoegd.'
      ]
    },
    {
      id: 'contact',
      title: '6. Contact',
      icon: Phone,
      content: [
        'Voor vragen over deze disclaimer kunt u contact opnemen via:',
        `📧 ${contactInfo.email}`,
        `📞 ${contactInfo.phone}`,
        `📍 ${contactInfo.address.street}, ${contactInfo.address.postalCode} ${contactInfo.address.city}`,
        `🕒 ${contactInfo.hours}`
      ]
    }
  ];

  return (
    <div className="bg-Color-Netural-White">
      <PageHero
        title="Disclaimer"
        subtitle="Disclaimer"
        backgroundImage="https://diamondsbycs.com/images/uploads/upload-6595762730b9f.jpg"
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
              transition={{ duration: 1, delay: 0.6 }}
              className="inline-flex items-center justify-center mb-8"
            >
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.8 }}
                className="w-16 h-16 bg-Color-Light-300 rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
              >
                <FileText className="h-8 w-8 text-Color-Netural-White" />
              </motion.div>
            </motion.div>
            
            <h1 className="typography-h2 text-Color-Dark-500 mb-6 relative">
              Disclaimer
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
                Deze disclaimer beschrijft de wettelijke aspecten en intellectuele eigendomsrechten van deze website
              </p>
            </div>
          </motion.div>

          {/* Terms Sections */}
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
                {/* Hover shimmer effect */}
                <motion.div
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                
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
                        transition={{ duration: 0.5, delay: 0.2 + (itemIndex * 0.1) }}
                        className="flex items-start"
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="w-2 h-2 bg-Color-Light-300 rounded-full mt-3 mr-4 flex-shrink-0"
                        />
                        <p className="typography-body text-Color-Gray-700 leading-relaxed">
                          {item}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Special Notices */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-16 space-y-8"
          >
            {/* Important Notice */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-8 rounded-r-xl shadow-lg">
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-amber-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="typography-h6 text-amber-800 font-bold mb-3">
                    Belangrijke Opmerking
                  </h3>
                  <p className="typography-body text-amber-700 leading-relaxed">
                    Hoewel wij streven naar nauwkeurige en actuele informatie op onze website, kunnen wij niet garanderen dat alle informatie te allen tijde volledig en foutloos is. Gebruik de informatie op deze website dan ook op eigen risico.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-400 p-8 rounded-r-xl shadow-lg">
              <div className="flex items-start">
                <Info className="h-6 w-6 text-blue-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="typography-h6 text-blue-800 font-bold mb-3">
                    Vragen over deze Disclaimer?
                  </h3>
                  <p className="typography-body text-blue-700 leading-relaxed mb-4">
                    Heeft u vragen over deze disclaimer? Neem gerust contact met ons op voor verduidelijking.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => onNavigate('/contact')}
                      className="btn-primary px-6 py-3 flex items-center justify-center"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Opnemen
                    </button>
                    <button
                      onClick={() => window.open(`tel:${contactInfo.phone}`)}
                      className="btn-secondary px-6 py-3 flex items-center justify-center"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Direct Bellen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-center mt-10"
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
              
              <div className="relative z-10">
                <h3 className="typography-h3 text-Color-Netural-White mb-6">
                  Klaar om te Beginnen?
                </h3>
                <p className="typography-body-lg text-Color-Light-300 mb-8 max-w-2xl mx-auto">
                  Nu u onze disclaimer heeft gelezen, kunt u met vertrouwen onze collectie verkennen
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('/shop')}
                    className="btn-secondary px-8 py-4 flex items-center justify-center"
                  >
                    <Award className="mr-3 h-5 w-5" />
                    Shop Juwelen
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('/contact')}
                    className="btn-secondary px-8 py-4 flex items-center justify-center"
                  >
                    <Calendar className="mr-3 h-5 w-5" />
                    Maak Afspraak
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};