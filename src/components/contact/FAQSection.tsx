import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  HelpCircle, 
  Clock, 
  Diamond, 
  Palette, 
  Shield, 
  Truck, 
  CreditCard,
  Calendar,
  Star,
  Heart,
  Gem,
  Phone
} from 'lucide-react';

interface FAQSectionProps {
  onNavigate: (page: string) => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onNavigate }) => {
  const [openFAQ, setOpenFAQ] = useState<string | null>('process');

  const faqCategories = [
    {
      id: 'process',
      title: 'Proces & Service',
      icon: Clock,
      questions: [
        {
          id: 'appointment',
          question: 'Hoe maak ik een afspraak?',
          answer: 'U kunt een afspraak maken door ons te bellen op +32 471 76 22 98, een email te sturen naar info@diamondsbycs.com, of via WhatsApp. We zijn open dagelijks op afspraak, zelfs op zondag! Een afspraak duurt meestal 60-90 minuten.'
        },
        {
          id: 'timeline',
          question: 'Hoe lang duurt het maken van een juweel?',
          answer: 'Standaard juwelen: 10-14 werkdagen. Complexe maatwerk stukken: 3-4 weken. Verlovingsringen met speciale diamanten: 2-3 weken. We houden u altijd op de hoogte van de voortgang.'
        },
        {
          id: 'consultation',
          question: 'Wat gebeurt er tijdens een consultatie?',
          answer: 'We bespreken uw wensen, budget en stijl. U ziet voorbeelden van ons werk, we tonen verschillende materialen en diamanten. Voor maatwerk maken we 3D ontwerpen. Alles gebeurt zonder verplichtingen.'
        },
        {
          id: 'location',
          question: 'Waar bevindt zich de showroom?',
          answer: 'Schupstraat 9-11, 2018 Antwerpen - in het hart van het diamantkwartier. Gratis parkeren bij Lange Herentalsestraat 73 (10 minuten lopen). Goed bereikbaar met openbaar vervoer vanaf Centraal Station.'
        }
      ]
    },
    {
      id: 'diamonds',
      title: 'Diamanten & Materialen',
      icon: Diamond,
      questions: [
        {
          id: 'natural-vs-lab',
          question: 'Wat is het verschil tussen natuurlijke en lab-grown diamanten?',
          answer: 'Lab-grown diamanten zijn chemisch, fysisch en optisch identiek aan natuurlijke diamanten. Het verschil: natuurlijke diamanten zijn miljarden jaren oud, lab-grown worden in weken gemaakt. Lab-grown zijn 30-50% voordeliger en milieuvriendelijker. Beide krijgen officiële certificaten.'
        },
        {
          id: 'certificates',
          question: 'Welke certificaten krijg ik bij mijn diamant?',
          answer: 'Natuurlijke diamanten: HRD (Antwerpen) of GIA certificaat. Lab-grown diamanten: IGI certificaat. Alle certificaten bevatten de 4 C\'s: Carat, Color, Clarity, Cut. U krijgt altijd het originele certificaat bij uw juweel.'
        },
        {
          id: 'gold-types',
          question: 'Welke goud opties zijn beschikbaar?',
          answer: 'We werken met 18k goud in drie kleuren: geel goud (klassiek), wit goud (modern), en rosé goud (romantisch). Ook platina is mogelijk voor speciale stukken. Alle goud is conflict-vrij en van de hoogste kwaliteit.'
        },
        {
          id: 'quality',
          question: 'Hoe garandeert u de kwaliteit?',
          answer: '15+ jaar ervaring, alleen gecertificeerde diamanten, 2 jaar garantie op alle juwelen, gratis jaarlijkse controle en reiniging. Elk stuk wordt handgemaakt in ons Antwerpse atelier met de hoogste standaarden.'
        }
      ]
    },
    {
      id: 'customization',
      title: 'Maatwerk & Personalisatie',
      icon: Palette,
      questions: [
        {
          id: 'custom-design',
          question: 'Kan ik een volledig uniek juweel laten maken?',
          answer: 'Absoluut! We specialiseren in maatwerk. Van uw idee maken we 3D ontwerpen, u kiest materialen en diamanten. Elke stap gebeurt in overleg. Prijzen starten vanaf €350 voor eenvoudige stukken.'
        },
        {
          id: 'engraving',
          question: 'Welke gravering opties zijn er?',
          answer: 'Namen, datums, initialen, morse code berichten, vingerafdrukken, handschrift, coördinaten. Gravering is meestal gratis. Morse code met diamanten vanaf €150 extra. Vingerafdruk gravering vanaf €200 extra.'
        },
        {
          id: 'resize-modify',
          question: 'Kan ik bestaande juwelen laten aanpassen?',
          answer: 'Ja! We geven oude juwelen een tweede leven. Ringen kunnen worden vergroot/verkleind, stenen kunnen worden herplaatst, oude sieraden kunnen worden omgesmolten tot nieuwe creaties. Gratis adviesgesprek voor aanpassingen.'
        },
        {
          id: 'inspiration',
          question: 'Ik heb geen idee wat ik wil, kunnen jullie helpen?',
          answer: 'Natuurlijk! Caroline helpt u stap voor stap. We bespreken uw stijl, levensstijl en budget. U ziet voorbeelden, voelt materialen, en samen ontdekken we wat perfect bij u past. Geen druk, alleen inspiratie.'
        }
      ]
    },
    {
      id: 'pricing',
      title: 'Prijzen & Betaling',
      icon: CreditCard,
      questions: [
        {
          id: 'pricing-structure',
          question: 'Hoe werkt de prijsstelling?',
          answer: 'Transparante prijzen: goud + diamant + maakwerk. Lab-grown diamanten zijn 30-50% voordeliger. Maatwerk vanaf €350. Verlovingsringen vanaf €790. Alle prijzen zijn inclusief BTW. Geen verborgen kosten.'
        },
        {
          id: 'payment-options',
          question: 'Welke betaalmogelijkheden zijn er?',
          answer: 'Bankoverschrijving, creditcard (Visa/Mastercard), contant in de showroom. Voor grote bedragen zijn betalingsregelingen mogelijk. 50% aanbetaling bij bestelling, rest bij oplevering.'
        },
        {
          id: 'budget-advice',
          question: 'Wat kan ik verwachten binnen mijn budget?',
          answer: 'Budget €500-1000: Mooie ringen met kleinere diamanten of lab-grown. €1000-2000: Klassieke verlovingsringen met kwaliteitsdiamanten. €2000+: Luxe designs met grote diamanten. We maximaliseren altijd uw budget.'
        },
        {
          id: 'warranty',
          question: 'Welke garantie krijg ik?',
          answer: '2 jaar volledige garantie op vakmanschap en materialen. Gratis jaarlijkse controle en reiniging. Levenslange service voor kleine reparaties. Diamanten zijn verzekerd tijdens het maakproces.'
        }
      ]
    },
    {
      id: 'special',
      title: 'Speciale Collecties',
      icon: Star,
      questions: [
        {
          id: 'memorial-jewelry',
          question: 'Hoe werkt memorial sieraden?',
          answer: 'We bieden vingerafdruk juwelen, morse code met namen, geboortesteen memorial, handschrift gravering. Alles gebeurt met respect en zorg. Persoonlijke consultatie altijd mogelijk, ook thuis. Prijzen vanaf €450.'
        },
        {
          id: 'morse-code',
          question: 'Wat is morse code sieraden?',
          answer: 'Geheime boodschappen in diamanten of edelstenen. Namen, "I love you", datums - alles is mogelijk. Populair voor trouwringen, memorial sieraden, en persoonlijke berichten. Morse code ring vanaf €450.'
        },
        {
          id: 'kim-van-oncen',
          question: 'Wat is de Kim Van Oncen collectie?',
          answer: 'Sterren-thema collectie ter nagedachtenis van sterrenkindjes. Sterren en kruissymbolen in rosé, wit of geel goud. Diamanten in zwart, wit of roze. Mix & match oorbellen. Speciale armband voor sterrenkindjes.'
        }
      ]
    }
  ];

  const toggleFAQ = (categoryId: string) => {
    setOpenFAQ(openFAQ === categoryId ? null : categoryId);
  };

  return (
    <section className="py-20 sm:py-32 lg:py-40 xl:py-48 bg-gradient-to-br from-Color-Secondary via-Color-Netural-White to-Color-Secondary silk-texture relative overflow-hidden">
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
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-12 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.8 }}
            >
              <HelpCircle className="h-8 w-8 text-Color-Light-300 mr-4" />
            </motion.div>
            <span className="typography-caption uppercase tracking-[0.2em] text-Color-Light-300 font-medium">
              Veelgestelde Vragen
            </span>
            <motion.div 
              whileHover={{ rotate: -360, scale: 1.2 }}
              transition={{ duration: 0.8 }}
            >
              <HelpCircle className="h-8 w-8 text-Color-Light-300 ml-4" />
            </motion.div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="typography-h2 text-Color-Dark-500 mb-8 relative"
          >
            Frequently Asked Questions
          </motion.h2>
          
          {/* Unifying Element */}
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "200px" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8 }}
            className="h-[3px] bg-gradient-to-r from-transparent via-Color-Light-300 to-transparent mx-auto mb-8 sm:mb-10 lg:mb-12"
          />
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="typography-body-xl text-Color-Gray-700 max-w-4xl mx-auto leading-relaxed"
          >
            Find answers to the most common questions about our jewelry, services, and process. 
            Can't find what you're looking for? We're here to help personally.
          </motion.p>
        </motion.div>

        {/* FAQ Categories */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="space-y-8"
        >
          {faqCategories.map((category, categoryIndex) => (
            <motion.div 
              key={category.id}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8, 
                delay: 1 + (categoryIndex * 0.2),
                type: "spring",
                stiffness: 100
              }}
              className="bg-gradient-to-br from-Color-Netural-White to-Color-Secondary/30 rounded-2xl shadow-xl border border-Color-Light-300/40 overflow-hidden relative"
            >
              {/* Category Header */}
              <motion.button
                onClick={() => toggleFAQ(category.id)}
                whileHover={{ scale: 1.01 }}
                className="w-full p-8 text-left flex items-center justify-between bg-gradient-to-r from-Color-Netural-White to-Color-Secondary/20 border-b border-Color-Light-300/30 relative overflow-hidden group"
              >
                {/* Hover shimmer effect */}
                <motion.div
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                
                <div className="flex items-center relative z-10">
                  <motion.div 
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: 360,
                      boxShadow: "0 0 20px rgba(205,188,171,0.6)"
                    }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 bg-gradient-to-br from-Color-Light-300 to-Color-Light-300/80 rounded-full flex items-center justify-center shadow-lg mr-4"
                  >
                    <category.icon className="h-6 w-6 text-Color-Netural-White" />
                  </motion.div>
                  <div>
                    <h3 className="typography-h5 text-Color-Dark-500 font-bold group-hover:text-Color-Light-300 transition-colors duration-300">
                      {category.title}
                    </h3>
                    <p className="typography-caption text-Color-Gray-700 group-hover:text-Color-Dark-500 transition-colors duration-300">
                      {category.questions.length} vragen
                    </p>
                  </div>
                </div>
                
                <motion.div
                  animate={{ rotate: openFAQ === category.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <ChevronDown className="h-6 w-6 text-Color-Light-300 group-hover:text-Color-Dark-500 transition-colors duration-300" />
                </motion.div>
              </motion.button>

              {/* Questions */}
              <AnimatePresence>
                {openFAQ === category.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-8 pt-0 space-y-6">
                      {category.questions.map((faq, index) => (
                        <motion.div 
                          key={faq.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="bg-gradient-to-r from-Color-Netural-White to-Color-Secondary/20 p-6 rounded-xl border border-Color-Light-300/30 hover:shadow-lg transition-all duration-300"
                        >
                          <h4 className="typography-h6 text-Color-Dark-500 font-bold mb-3 flex items-start">
                            <motion.div 
                              whileHover={{ scale: 1.2, rotate: 360 }}
                              transition={{ duration: 0.5 }}
                              className="w-6 h-6 bg-Color-Light-300 rounded-full flex items-center justify-center mr-3 mt-1 shadow-md"
                            >
                              <span className="text-Color-Netural-White text-xs font-bold">Q</span>
                            </motion.div>
                            {faq.question}
                          </h4>
                          <div className="ml-9">
                            <p className="typography-body text-Color-Gray-700 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-center mt-10"
        >
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-r from-Color-Netural-Black to-Color-Dark-500 text-Color-Netural-White p-12 rounded-2xl shadow-2xl border border-Color-Light-300/30 max-w-4xl mx-auto relative overflow-hidden"
          >
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
                Nog Vragen?
              </h3>
              <p className="typography-body-lg text-Color-Light-300 mb-8 max-w-2xl mx-auto">
                Staat uw vraag er niet bij? Caroline beantwoordt graag al uw vragen tijdens een persoonlijk gesprek.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('/contact')}
                  className="btn-secondary px-8 py-4 flex items-center justify-center"
                >
                  <Calendar className="mr-3 h-5 w-5" />
                  Maak Afspraak
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open(`tel:${contactInfo.phone}`)}
                  className="btn-secondary px-8 py-4 flex items-center justify-center"
                >
                  <Phone className="mr-3 h-5 w-5" />
                  Bel Direct
                </motion.button>
              </div>
            </div>
            
            {/* Floating Accent Elements */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-6 right-6 w-8 h-8 bg-Color-Light-300/20 rounded-full"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute bottom-6 left-6 w-6 h-6 bg-Color-Light-300/15 rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};