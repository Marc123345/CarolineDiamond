import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  RotateCcw, 
  Shield, 
  CreditCard, 
  Truck, 
  Package, 
  Award, 
  MessageSquare, 
  Scale,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  Ban,
  FileText,
  Eye,
  Star,
  Heart,
  Gem
} from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { contactInfo } from '../config/siteConfig';

interface ReturnRefundPolicyPageProps {
  onNavigate: (page: string) => void;
}

export const ReturnRefundPolicyPage: React.FC<ReturnRefundPolicyPageProps> = ({ onNavigate }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const sections = [
    {
      id: 'right-to-withdraw',
      title: '1. Herroepingsrecht',
      icon: RotateCcw,
      content: [
        'U heeft het recht om uw bestelling binnen 14 dagen na ontvangst zonder opgave van redenen te herroepen.',
        'De herroepingstermijn verstrijkt 14 dagen na de dag waarop u, of een door u aangewezen derde die niet de vervoerder is, het product fysiek in bezit krijgt.',
        'Om gebruik te maken van uw herroepingsrecht, dient u ons via een ondubbelzinnige verklaring (bijvoorbeeld schriftelijk per post of per e-mail) op de hoogte te stellen van uw beslissing.',
        `U kunt hiervoor contact opnemen via ${contactInfo.email} of ${contactInfo.phone}.`
      ]
    },
    {
      id: 'exceptions',
      title: '2. Uitzonderingen op Herroepingsrecht',
      icon: Ban,
      content: [
        'Het herroepingsrecht is NIET van toepassing op:',
        '',
        '• Producten die volgens uw specificaties zijn vervaardigd of duidelijk gepersonaliseerd:',
        '  - Gegraveerde juwelen (namen, datums, morse code)',
        '  - Vingerafdruk sieraden',
        '  - Handschrift gravering',
        '  - Maatwerk ringen op specifieke ringmaat',
        '  - Geboortesteen sieraden met persoonlijke keuzes',
        '',
        '• Producten die om hygiënische redenen niet kunnen worden teruggestuurd en waarvan de verzegeling na levering is verbroken.',
        '',
        'Deze uitzondering geldt omdat gepersonaliseerde juwelen speciaal voor u worden gemaakt en niet kunnen worden doorverkocht aan andere klanten.'
      ]
    },
    {
      id: 'return-procedure',
      title: '3. Retourprocedure',
      icon: Package,
      content: [
        'Volg deze stappen voor een retour:',
        '',
        '1. Neem binnen 14 dagen contact met ons op via:',
        `   📧 ${contactInfo.email}`,
        `   📞 ${contactInfo.phone}`,
        '   Vermeld uw ordernummer en reden voor retour',
        '',
        '2. U ontvangt van ons:',
        '   - Retourformulier',
        '   - Retouradres',
        '   - Verpakkingsinstructies',
        '',
        '3. Verpak de producten zorgvuldig:',
        '   - Gebruik indien mogelijk de originele verpakking',
        '   - Voeg alle certificaten en documentatie bij',
        '   - Zorg voor adequate bescherming tijdens transport',
        '',
        '4. Stuur de producten terug naar:',
        'Diamonds by CS',
        't.a.v. Retouren',
        `${contactInfo.address.street}`,
        `${contactInfo.address.postalCode} ${contactInfo.address.city}`
      ]
    },
    {
      id: 'return-costs',
      title: '4. Kosten van Retourneren',
      icon: CreditCard,
      content: [
        'De kosten voor het terugsturen van de producten zijn voor rekening van de klant, tenzij:',
        '',
        '• Het product defect is bij levering',
        '• Er een fout is gemaakt door Diamonds by CS',
        '• Het product niet overeenkomt met de bestelling',
        '',
        'Wij adviseren om verzekerde verzending te gebruiken voor waardevolle juwelen.',
        'Bewaar altijd het verzendingsbewijs tot de retour is afgehandeld.',
        '',
        'Retourkosten binnen België: ongeveer €8-15 (afhankelijk van verzendmethode)',
        'Voor internationale retouren: kosten variëren per land en verzendmethode'
      ]
    },
    {
      id: 'refund-process',
      title: '5. Terugbetalingsproces',
      icon: CreditCard,
      content: [
        'Zodra wij de geretourneerde producten hebben ontvangen en gecontroleerd:',
        '',
        '• Terugbetaling binnen 14 dagen na ontvangst retour',
        '• Betaling via dezelfde betaalmethode als oorspronkelijke aankoop',
        '• Volledige aankoopprijs wordt terugbetaald',
        '• Originele verzendkosten worden ook terugbetaald',
        '• UITZONDERING: Extra kosten voor premium verzending worden niet terugbetaald',
        '',
        'Wij mogen wachten met terugbetaling totdat:',
        '• Wij de producten hebben ontvangen, OF',
        '• U heeft aangetoond dat u de producten heeft teruggestuurd',
        '(afhankelijk van welk tijdstip eerst valt)'
      ]
    },
    {
      id: 'product-condition',
      title: '6. Staat van de Producten',
      icon: Eye,
      content: [
        'U bent alleen aansprakelijk voor waardevermindering die het gevolg is van gebruik dat verder gaat dan nodig om de aard, kenmerken en werking vast te stellen.',
        '',
        'Toegestaan bij retour:',
        '• Uitpakken en bekijken van het product',
        '• Kort passen om maat en stijl te controleren',
        '• Controleren van kwaliteit en afwerking',
        '',
        'NIET toegestaan:',
        '• Langdurig dragen van sieraden',
        '• Beschadiging door onzorgvuldig gebruik',
        '• Verwijderen van labels of certificaten',
        '• Aanpassingen aan het product',
        '',
        'Juwelen moeten worden geretourneerd in originele staat met alle bijgeleverde certificaten en verpakking.'
      ]
    },
    {
      id: 'defective-products',
      title: '7. Defecte Producten',
      icon: Shield,
      content: [
        'Indien u een defect product ontvangt:',
        '',
        '1. Neem onmiddellijk contact op (binnen 48 uur na ontvangst)',
        '2. Maak foto\'s van het defect',
        '3. Gebruik het product niet verder',
        '4. Bewaar alle verpakking en documentatie',
        '',
        'Bij defecte producten:',
        '• Gratis retour (wij betalen verzendkosten)',
        '• Volledige terugbetaling of gratis reparatie',
        '• Eventuele extra compensatie in overleg',
        '',
        'Onze 2-jarige garantie dekt alle fabricagefouten en vakmanschap.'
      ]
    },
    {
      id: 'custom-jewelry',
      title: '8. Maatwerk en Gepersonaliseerde Juwelen',
      icon: Gem,
      content: [
        'Voor maatwerk en gepersonaliseerde juwelen gelden speciale voorwaarden:',
        '',
        'GEEN herroepingsrecht voor:',
        '• Gravures (namen, datums, morse code)',
        '• Vingerafdruk sieraden',
        '• Handschrift gravering',
        '• Specifieke ringmaten',
        '• Geboortesteen combinaties',
        '• Volledig maatwerk ontwerpen',
        '',
        'WEL mogelijk:',
        '• Retour bij fabricagefouten',
        '• Aanpassingen indien niet volgens afspraak',
        '• Garantie op vakmanschap (2 jaar)',
        '',
        'Voor maatwerk wordt altijd een definitief ontwerp ter goedkeuring voorgelegd voordat productie start.'
      ]
    },
    {
      id: 'contact-returns',
      title: '9. Contact voor Retouren',
      icon: MessageSquare,
      content: [
        'Voor alle retourvragen en -aanvragen:',
        '',
        `📧 E-mail: ${contactInfo.email}`,
        '   Onderwerp: "Retour - [Ordernummer]"',
        '',
        `📞 Telefoon: ${contactInfo.phone}`,
        `   ${contactInfo.hours}`,
        '',
        `📍 Showroom bezoek: ${contactInfo.address.street}, ${contactInfo.address.city}`,
        '   Voor persoonlijke retourafhandeling',
        '',
        'Wij reageren binnen 24 uur op retourverzoeken en begeleiden u stap voor stap door het proces.'
      ]
    }
  ];

  const returnSteps = [
    {
      step: '1',
      title: 'Contact Opnemen',
      description: 'Binnen 14 dagen na ontvangst',
      icon: Phone,
      timeframe: '14 dagen'
    },
    {
      step: '2',
      title: 'Retourinstructies',
      description: 'Ontvang retourformulier en adres',
      icon: FileText,
      timeframe: '24 uur'
    },
    {
      step: '3',
      title: 'Veilig Verpakken',
      description: 'Originele verpakking + certificaten',
      icon: Package,
      timeframe: '1-2 dagen'
    },
    {
      step: '4',
      title: 'Verzenden',
      description: 'Verzekerde verzending aanbevolen',
      icon: Truck,
      timeframe: '1-3 dagen'
    },
    {
      step: '5',
      title: 'Controle',
      description: 'Wij controleren de staat van het product',
      icon: Eye,
      timeframe: '2-3 dagen'
    },
    {
      step: '6',
      title: 'Terugbetaling',
      description: 'Geld terug via oorspronkelijke betaalmethode',
      icon: CreditCard,
      timeframe: '14 dagen'
    }
  ];

  const productCategories = [
    {
      category: 'Standaard Juwelen',
      icon: Star,
      returnPolicy: '14 dagen herroepingsrecht',
      examples: ['Niet-gepersonaliseerde ringen', 'Standaard kettingen', 'Oorbellen zonder gravering'],
      color: 'from-green-500 to-green-600'
    },
    {
      category: 'Gepersonaliseerde Juwelen',
      icon: Heart,
      returnPolicy: 'GEEN herroepingsrecht',
      examples: ['Gravures', 'Morse code', 'Vingerafdruk', 'Maatwerk'],
      color: 'from-red-500 to-red-600'
    },
    {
      category: 'Defecte Producten',
      icon: Shield,
      returnPolicy: 'Altijd retour mogelijk',
      examples: ['Fabricagefouten', 'Beschadigingen', 'Niet volgens bestelling'],
      color: 'from-blue-500 to-blue-600'
    }
  ];

  return (
    <div className="bg-Color-Netural-White">
      <PageHero 
        title="Retour- & Terugbetalingsbeleid"
        subtitle="Return & Refund Policy"
        backgroundImage="https://diamondsbycs.com/images/uploads/upload-68b545cea1ff1.jpeg"
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
                <RotateCcw className="h-8 w-8 text-Color-Netural-White" />
              </motion.div>
            </motion.div>
            
            <h1 className="typography-h2 text-Color-Dark-500 mb-6 relative">
              Retour- & Terugbetalingsbeleid
              <motion.div 
                initial={{ width: 0 }}
                animate={inView ? { width: "200px" } : { width: 0 }}
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
                Transparante informatie over retouren en terugbetalingen bij Diamonds by CS
              </p>
            </div>
          </motion.div>

          {/* Return Process Timeline */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="typography-h3 text-Color-Dark-500 mb-6">
                Retour <span className="text-Color-Light-300">Proces</span>
              </h2>
              <p className="typography-body-lg text-Color-Gray-700 max-w-3xl mx-auto">
                Eenvoudig stap-voor-stap proces voor het retourneren van uw juwelen
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {returnSteps.map((step, index) => (
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

          {/* Product Categories */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="typography-h3 text-Color-Dark-500 mb-6">
                Retourbeleid per <span className="text-Color-Light-300">Productcategorie</span>
              </h2>
              <p className="typography-body-lg text-Color-Gray-700 max-w-3xl mx-auto">
                Verschillende producttypen hebben verschillende retourvoorwaarden
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {productCategories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: 1 + (index * 0.1) }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-Color-Netural-White to-Color-Secondary/30 rounded-xl shadow-lg border border-Color-Light-300/30 overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-Color-Light-300/30">
                    <div className="flex items-center justify-center mb-4">
                      <motion.div 
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center shadow-lg`}
                      >
                        <category.icon className="h-8 w-8 text-white" />
                      </motion.div>
                    </div>
                    <h3 className="typography-h6 text-Color-Dark-500 font-bold text-center mb-3">
                      {category.category}
                    </h3>
                    <div className={`text-center px-4 py-2 rounded-full typography-caption font-bold ${
                      category.returnPolicy.includes('GEEN') 
                        ? 'bg-red-100 text-red-800' 
                        : category.returnPolicy.includes('Altijd')
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {category.returnPolicy}
                    </div>
                  </div>
                  
                  {/* Examples */}
                  <div className="p-6">
                    <h4 className="typography-body font-semibold text-Color-Dark-500 mb-3">Voorbeelden:</h4>
                    <ul className="space-y-2">
                      {category.examples.map((example, i) => (
                        <li key={i} className="flex items-center typography-caption text-Color-Gray-700">
                          <CheckCircle className="h-3 w-3 text-Color-Light-300 mr-2 flex-shrink-0" />
                          {example}
                        </li>
                      ))}
                    </ul>
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
            {/* Custom Jewelry Notice */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-8 rounded-r-xl shadow-lg">
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-amber-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="typography-h6 text-amber-800 font-bold mb-3">
                    Belangrijke Opmerking - Maatwerk & Personalisatie
                  </h3>
                  <p className="typography-body text-amber-700 leading-relaxed">
                    Gepersonaliseerde juwelen (gravures, morse code, vingerafdruk, maatwerk) vallen NIET onder het 
                    herroepingsrecht vanwege hun unieke en persoonlijke aard. Deze producten worden speciaal voor u gemaakt 
                    en kunnen niet worden doorverkocht. Wel geldt onze 2-jarige garantie op vakmanschap.
                  </p>
                </div>
              </div>
            </div>

            {/* Quality Guarantee */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 p-8 rounded-r-xl shadow-lg">
              <div className="flex items-start">
                <Award className="h-6 w-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="typography-h6 text-green-800 font-bold mb-3">
                    Kwaliteitsgarantie
                  </h3>
                  <p className="typography-body text-green-700 leading-relaxed">
                    Alle juwelen worden handgemaakt in ons Antwerpse atelier met gecertificeerde, conflict-vrije diamanten. 
                    Bij defecten of fabricagefouten bieden wij altijd een oplossing, ook voor gepersonaliseerde stukken.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact for Returns */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-400 p-8 rounded-r-xl shadow-lg">
              <div className="flex items-start">
                <Info className="h-6 w-6 text-blue-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="typography-h6 text-blue-800 font-bold mb-3">
                    Hulp bij Retouren
                  </h3>
                  <p className="typography-body text-blue-700 leading-relaxed mb-4">
                    Heeft u vragen over het retourproces? Ons team helpt u graag persoonlijk bij elke stap.
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
                  Vragen over Retouren?
                </h3>
                <p className="typography-body-lg text-Color-Light-300 mb-8 max-w-2xl mx-auto">
                  Ons team staat klaar om u te helpen met al uw vragen over retouren en terugbetalingen
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('/contact')}
                    className="btn-secondary px-8 py-4 flex items-center justify-center"
                  >
                    <MessageSquare className="mr-3 h-5 w-5" />
                    Stel Uw Vraag
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('/shop')}
                    className="btn-secondary px-8 py-4 flex items-center justify-center"
                  >
                    <Award className="mr-3 h-5 w-5" />
                    Shop met Vertrouwen
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