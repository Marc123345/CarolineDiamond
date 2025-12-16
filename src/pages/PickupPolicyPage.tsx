import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  MapPin, 
  Clock, 
  Car, 
  Package, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Phone,
  Mail,
  Calendar,
  Shield,
  Award,
  FileText,
  Eye,
  Truck,
  CreditCard,
  Star,
  Heart,
  Gem,
  Navigation,
  Train
} from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { contactInfo } from '../config/siteConfig';

interface PickupPolicyPageProps {
  onNavigate: (page: string) => void;
}

export const PickupPolicyPage: React.FC<PickupPolicyPageProps> = ({ onNavigate }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const sections = [
    {
      id: 'pickup-location',
      title: '1. Afhaallocatie',
      icon: MapPin,
      content: [
        'Bestellingen die via onze webshop geplaatst worden, kunnen uitsluitend worden afgehaald in onze showroom:',
        '',
        'Diamonds by CS',
        `${contactInfo.address.street}`,
        `${contactInfo.address.postalCode} ${contactInfo.address.city}`,
        `${contactInfo.hours}`,
        '',
        'Onze showroom bevindt zich in het hart van het Antwerpse diamantkwartier, gemakkelijk bereikbaar met openbaar vervoer en auto.'
      ]
    },
    {
      id: 'pickup-procedure',
      title: '2. Afhaalprocedure',
      icon: Package,
      content: [
        'Volg deze eenvoudige stappen voor het afhalen van uw bestelling:',
        '',
        '1. U plaatst uw bestelling via de webshop en betaalt online via de beschikbare betaalmethodes',
        '2. Wij starten met de productie van uw handgemaakte juweel',
        '3. Zodra uw bestelling gereed is, ontvangt u een e-mail of SMS met de melding dat uw juweel klaarstaat',
        '4. U kunt uw bestelling afhalen tijdens onze openingsuren',
        '5. Breng altijd uw orderbevestiging (digitaal of geprint) en geldig identiteitsbewijs mee',
        '',
        'Voor maatwerk juwelen plannen wij bij afhaling ook een korte controle en eventuele laatste aanpassingen in.'
      ]
    },
    {
      id: 'processing-time',
      title: '3. Verwerkingstijd',
      icon: Clock,
      content: [
        'Verwerkingstijden voor verschillende producttypen:',
        '',
        '• Standaard juwelen op voorraad: 1-3 werkdagen',
        '• Handgemaakte juwelen: 10-14 werkdagen',
        '• Maatwerk en gepersonaliseerde juwelen: 3-4 weken',
        '• Complexe ontwerpen: 4-6 weken',
        '• Reparaties en aanpassingen: 1-2 weken',
        '',
        'U ontvangt altijd een bevestiging zodra de bestelling klaarstaat voor afhaling.',
        'Bij vertraging informeren wij u proactief over de nieuwe verwachte datum.',
        '',
        'Tijdens drukke perioden (Valentijn, kerst, trouwseizoen) kunnen verwerkingstijden langer zijn.'
      ]
    },
    {
      id: 'costs',
      title: '4. Kosten',
      icon: CreditCard,
      content: [
        'Afhalen in onze showroom is altijd gratis:',
        '',
        '• Geen afhaalkosten',
        '• Geen extra servicekosten',
        '• Gratis parkeren bij Lange Herentalsestraat 73 (10 minuten lopen)',
        '• Gratis laatste controle en reiniging bij afhaling',
        '• Gratis advies over onderhoud en verzorging',
        '',
        'Voor bestellingen boven €500 bieden wij ook gratis thuisbezorging aan als alternatief.',
        'Maatwerk consultaties tijdens afhaling zijn altijd gratis inbegrepen.'
      ]
    },
    {
      id: 'uncollected-orders',
      title: '5. Niet afgehaalde bestellingen',
      icon: AlertTriangle,
      content: [
        'Indien een bestelling niet wordt afgehaald binnen de gestelde termijn:',
        '',
        '• Standaard juwelen: 30 dagen na gereedmelding',
        '• Maatwerk juwelen: 60 dagen na gereedmelding (vanwege de persoonlijke aard)',
        '• Na deze termijn sturen wij een herinnering',
        '• Na 90 dagen (standaard) of 120 dagen (maatwerk) zonder reactie behoudt Diamonds by CS zich het recht voor om:',
        '  - De bestelling te annuleren',
        '  - Het aankoopbedrag terug te betalen minus 15% administratiekosten',
        '  - Het product te verkopen (alleen bij standaard juwelen)',
        '',
        'Voor maatwerk juwelen proberen wij altijd eerst persoonlijk contact op te nemen.',
        'Bewaarkosten kunnen in rekening worden gebracht na de gratis bewaarperiode.'
      ]
    },
    {
      id: 'inspection',
      title: '6. Controle bij afhaling',
      icon: Eye,
      content: [
        'Bij afhaling in onze showroom:',
        '',
        '• Controleer uw bestelling samen met ons personeel',
        '• Bekijk de kwaliteit en afwerking',
        '• Controleer eventuele gravures of personalisatie',
        '• Test de pasvorm (bij ringen)',
        '• Ontvang uitleg over onderhoud en verzorging',
        '',
        'Indien er onvolledigheden of problemen zijn:',
        '• Meld dit onmiddellijk aan ons personeel',
        '• Wij lossen problemen direct op in ons atelier',
        '• Kleine aanpassingen kunnen vaak ter plekke',
        '• Voor grotere aanpassingen maken wij een nieuwe afspraak',
        '',
        'Na afhaling en goedkeuring is het product definitief geaccepteerd.'
      ]
    },
    {
      id: 'appointment',
      title: '7. Afspraak maken',
      icon: Calendar,
      content: [
        'Voor een optimale service raden wij aan om een afspraak te maken:',
        '',
        `• Bel ons op ${contactInfo.phone}`,
        `• Stuur een e-mail naar ${contactInfo.email}`,
        '• Gebruik onze online afspraakplanner',
        '• WhatsApp ons voor snelle afspraken',
        '',
        'Voordelen van een afspraak:',
        '• Gegarandeerde beschikbaarheid van Caroline',
        '• Persoonlijke service en advies',
        '• Geen wachttijden',
        '• Mogelijkheid voor laatste aanpassingen',
        '• Uitgebreide uitleg over uw juweel',
        '',
        'Ook zonder afspraak bent u welkom, maar wij kunnen niet garanderen dat Caroline beschikbaar is voor persoonlijke service.'
      ]
    },
    {
      id: 'parking-transport',
      title: '8. Parkeren en Bereikbaarheid',
      icon: Car,
      content: [
        'Bereikbaarheid van onze showroom:',
        '',
        '🚗 Met de auto:',
        `• Gratis parkeren: ${contactInfo.parking.address}`,
        `• ${contactInfo.parking.note}`,
        '• Betaald parkeren in de buurt beschikbaar',
        '• Laat ons vooraf weten dat u komt, dan reserveren wij een parkeerplaats',
        '',
        '🚆 Met openbaar vervoer:',
        '• 10 minuten lopen vanaf Antwerpen Centraal Station',
        '• Tram 2, 6, 15 - halte Groenplaats (5 min lopen)',
        '• Bus 17, 18 - halte Meir (8 min lopen)',
        '',
        '🚶‍♀️ Te voet:',
        '• Centrum Antwerpen: 5-10 minuten lopen',
        '• Meir winkelstraat: 8 minuten lopen',
        '• Grote Markt: 12 minuten lopen'
      ]
    },
    {
      id: 'special-services',
      title: '9. Extra Services bij Afhaling',
      icon: Award,
      content: [
        'Bij afhaling in onze showroom bieden wij extra services:',
        '',
        '• Gratis professionele reiniging van uw nieuwe juweel',
        '• Uitleg over juiste verzorging en onderhoud',
        '• Gratis ringmaat controle en aanpassing indien nodig',
        '• Certificaat uitleg (HRD, GIA, IGI)',
        '• Luxe geschenkverpakking',
        '• Foto\'s van u met uw nieuwe juweel (op verzoek)',
        '',
        'Voor verlovingsringen:',
        '• Advies over het perfecte aanzoek',
        '• Tips voor het bewaren van de ring tot het aanzoek',
        '• Informatie over matching trouwringen',
        '',
        'Voor trouwringen:',
        '• Laatste pasvorm controle',
        '• Gravering controle',
        '• Advies over dagelijks dragen'
      ]
    },
    {
      id: 'contact-pickup',
      title: '10. Contact voor Afhaling',
      icon: Phone,
      content: [
        'Voor alle vragen over afhaling:',
        '',
        `📧 E-mail: ${contactInfo.email}`,
        '   Onderwerp: "Afhaling - [Ordernummer]"',
        '',
        `📞 Telefoon: ${contactInfo.phone}`,
        `   ${contactInfo.hours}`,
        '',
        `📍 Showroom: ${contactInfo.address.street}, ${contactInfo.address.city}`,
        '   Persoonlijke service in het hart van het diamantkwartier',
        '',
        '💬 WhatsApp: Stuur ons een bericht voor snelle vragen',
        '',
        'Wij reageren binnen 24 uur op alle afhaalvragen en helpen u graag bij het plannen van uw bezoek.'
      ]
    }
  ];

  const pickupSteps = [
    {
      step: '1',
      title: 'Online Bestellen',
      description: 'Plaats bestelling en betaal online',
      icon: Package,
      timeframe: '5 minuten'
    },
    {
      step: '2',
      title: 'Productie Start',
      description: 'Wij starten met handmatige productie',
      icon: Gem,
      timeframe: '1 dag'
    },
    {
      step: '3',
      title: 'Kwaliteitscontrole',
      description: 'Uitgebreide controle en afwerking',
      icon: Eye,
      timeframe: '10-14 dagen'
    },
    {
      step: '4',
      title: 'Gereed Melding',
      description: 'E-mail/SMS dat juweel klaarstaat',
      icon: Mail,
      timeframe: 'Direct'
    },
    {
      step: '5',
      title: 'Afspraak Maken',
      description: 'Plan uw showroom bezoek',
      icon: Calendar,
      timeframe: '24 uur'
    },
    {
      step: '6',
      title: 'Afhaling',
      description: 'Persoonlijke overhandiging + service',
      icon: Heart,
      timeframe: '30-60 min'
    }
  ];

  const pickupBenefits = [
    {
      icon: Star,
      title: 'Persoonlijke Service',
      description: 'Caroline ontvangt u persoonlijk in de showroom',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: Award,
      title: 'Gratis Extra Services',
      description: 'Reiniging, controle en advies inbegrepen',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Shield,
      title: 'Veilige Overhandiging',
      description: 'Geen risico van beschadiging tijdens verzending',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Car,
      title: 'Gratis Parkeren',
      description: 'Parkeerplaats gereserveerd op aanvraag',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="bg-Color-Netural-White">
      <PageHero 
        title="Afhaalbeleid"
        subtitle="Pickup Policy"
        backgroundImage="https://diamondsbycs.com/images/uploads/upload-66680b304c4c8.jpg"
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
                <Package className="h-8 w-8 text-Color-Netural-White" />
              </motion.div>
            </motion.div>
            
            <h1 className="typography-h2 text-Color-Dark-500 mb-6 relative">
              Afhaalbeleid
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
                Haal uw handgemaakte juwelen persoonlijk af in ons Antwerpse atelier
              </p>
            </div>
          </motion.div>

          {/* Pickup Process Timeline */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="typography-h3 text-Color-Dark-500 mb-6">
                Afhaal <span className="text-Color-Light-300">Proces</span>
              </h2>
              <p className="typography-body-lg text-Color-Gray-700 max-w-3xl mx-auto">
                Van online bestelling tot persoonlijke overhandiging in ons Antwerpse atelier
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pickupSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-Color-Netural-White to-Color-Secondary/30 p-8 rounded-xl shadow-lg border border-Color-Light-300/30 text-center group relative overflow-hidden"
                >
                  {/* Hover shimmer */}
                  <motion.div
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                  
                  <div className="relative z-10">
                    {/* Step number */}
                    <motion.div 
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-16 h-16 bg-Color-Light-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                    >
                      <span className="typography-h5 text-Color-Netural-White font-bold">{step.step}</span>
                    </motion.div>
                    
                    {/* Icon */}
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="w-12 h-12 bg-Color-Secondary rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <step.icon className="h-6 w-6 text-Color-Light-300" />
                    </motion.div>
                    
                    <h4 className="typography-h6 text-Color-Dark-500 font-bold mb-2 group-hover:text-Color-Light-300 transition-colors duration-300">
                      {step.title}
                    </h4>
                    <p className="typography-body text-Color-Gray-700 mb-3 leading-relaxed">
                      {step.description}
                    </p>
                    <span className="typography-caption bg-Color-Light-300/20 text-Color-Dark-500 px-3 py-1 rounded-full">
                      {step.timeframe}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pickup Benefits */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="typography-h3 text-Color-Dark-500 mb-6">
                Voordelen van <span className="text-Color-Light-300">Afhaling</span>
              </h2>
              <p className="typography-body-lg text-Color-Gray-700 max-w-3xl mx-auto">
                Waarom kiezen voor afhaling in plaats van verzending?
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pickupBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: 1 + (index * 0.1) }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-Color-Netural-White to-Color-Secondary/30 rounded-xl shadow-lg border border-Color-Light-300/30 overflow-hidden text-center"
                >
                  <div className="p-8">
                    <motion.div 
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
                    >
                      <benefit.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    
                    <h4 className="typography-h6 text-Color-Dark-500 font-bold mb-3">
                      {benefit.title}
                    </h4>
                    <p className="typography-body text-Color-Gray-700 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Policy Sections */}
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

          {/* Important Notices */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-16 space-y-8"
          >
            {/* Appointment Recommendation */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 p-8 rounded-r-xl shadow-lg">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="typography-h6 text-green-800 font-bold mb-3">
                    Aanbeveling: Maak een Afspraak
                  </h3>
                  <p className="typography-body text-green-700 leading-relaxed">
                    Voor de beste service raden wij aan om een afspraak te maken voor afhaling. 
                    Zo garanderen wij persoonlijke aandacht van Caroline en kunnen wij uw juweel samen controleren.
                  </p>
                </div>
              </div>
            </div>

            {/* Custom Jewelry Notice */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-400 p-8 rounded-r-xl shadow-lg">
              <div className="flex items-start">
                <Info className="h-6 w-6 text-blue-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="typography-h6 text-blue-800 font-bold mb-3">
                    Maatwerk Juwelen - Speciale Afhaling
                  </h3>
                  <p className="typography-body text-blue-700 leading-relaxed">
                    Voor maatwerk en gepersonaliseerde juwelen plannen wij altijd een persoonlijke afhaalafspraak. 
                    Dit geeft ons de mogelijkheid om laatste aanpassingen te maken en u uitgebreid te adviseren.
                  </p>
                </div>
              </div>
            </div>

            {/* Parking Information */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-400 p-8 rounded-r-xl shadow-lg">
              <div className="flex items-start">
                <Car className="h-6 w-6 text-purple-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="typography-h6 text-purple-800 font-bold mb-3">
                    Gratis Parkeren Beschikbaar
                  </h3>
                  <p className="typography-body text-purple-700 leading-relaxed mb-4">
                    Wij bieden gratis parkeren voor onze klanten. Laat ons vooraf weten dat u komt, 
                    dan reserveren wij een parkeerplaats voor u bij {contactInfo.parking.address}.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => onNavigate('/contact')}
                      className="btn-primary px-6 py-3 flex items-center justify-center"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Maak Afspraak
                    </button>
                    <button
                      onClick={() => window.open(`tel:${contactInfo.phone}`)}
                      className="btn-secondary px-6 py-3 flex items-center justify-center"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Bel Direct
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer CTA */}
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
                  Klaar om Uw Juweel af te Halen?
                </h3>
                <p className="typography-body-lg text-Color-Light-300 mb-8 max-w-2xl mx-auto">
                  Bezoek onze showroom in het hart van Antwerpen voor een persoonlijke afhaalervaring
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('/contact')}
                    className="btn-secondary px-8 py-4 flex items-center justify-center"
                  >
                    <MapPin className="mr-3 h-5 w-5" />
                    Plan Uw Bezoek
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('/shop')}
                    className="btn-secondary px-8 py-4 flex items-center justify-center"
                  >
                    <Gem className="mr-3 h-5 w-5" />
                    Shop Juwelen
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