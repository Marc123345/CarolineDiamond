import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Shield, 
  Eye, 
  Lock, 
  UserCheck, 
  Database, 
  Clock, 
  Share2, 
  Cookie,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings,
  Trash2,
  Download,
  Edit,
  Ban
} from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { contactInfo } from '../config/siteConfig';

interface PrivacyPolicyPageProps {
  onNavigate: (page: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const sections = [
    {
      id: 'general',
      title: '1. Algemeen',
      icon: Shield,
      content: [
        'Diamonds by CS hecht veel belang aan de bescherming van uw persoonsgegevens en respecteert de toepasselijke wetgeving, waaronder de Algemene Verordening Gegevensbescherming (GDPR).',
        'In deze privacyverklaring leggen wij uit welke gegevens wij verzamelen, waarom wij dat doen en hoe wij ze gebruiken.',
        'Door gebruik te maken van onze website en diensten, gaat u akkoord met de verwerking van uw persoonsgegevens zoals beschreven in deze verklaring.'
      ]
    },
    {
      id: 'controller',
      title: '2. Verwerkingsverantwoordelijke',
      icon: UserCheck,
      content: [
        'De verantwoordelijke voor de verwerking van uw gegevens is:',
        '',
        'Diamonds by CS',
        'Contactpersoon: Caroline Schreiber',
        `Adres: ${contactInfo.address.street}, ${contactInfo.address.postalCode} ${contactInfo.address.city}`,
        'Ondernemingsnummer: BE 0848.946.770',
        `E-mailadres: ${contactInfo.email}`,
        `Telefoon: ${contactInfo.phone}`
      ]
    },
    {
      id: 'data-collection',
      title: '3. Welke gegevens verzamelen wij?',
      icon: Database,
      content: [
        'Wij kunnen de volgende persoonsgegevens verzamelen en verwerken:',
        '',
        '• Identificatiegegevens: naam, voornaam, adres',
        '• Contactgegevens: e-mailadres, telefoonnummer',
        '• Bestel- en betalingsgegevens',
        '• Accountgegevens (indien u een account aanmaakt)',
        '• Technische gegevens: IP-adres, browser, cookies',
        '• Communicatiegegevens: berichten en correspondentie met onze klantenservice',
        '• Voorkeuren voor juwelen (stijl, materialen, budget)',
        '• Foto\'s van inspiratie (indien gedeeld voor maatwerk)'
      ]
    },
    {
      id: 'purpose',
      title: '4. Waarom verwerken wij deze gegevens?',
      icon: Eye,
      content: [
        'Wij verwerken uw gegevens voor de volgende doeleinden:',
        '',
        '• Administratie en orderbeheer',
        '• Facturatie en betaling',
        '• Solvabiliteitsmonitoring',
        '• Profiling voor gepersonaliseerde dienstverlening',
        '• Marketing (met uw toestemming)',
        '• Klantenservice en ondersteuning',
        '• Het maken van afspraken',
        '• Maatwerk consultaties',
        '• Verbetering van onze diensten'
      ]
    },
    {
      id: 'legal-basis',
      title: '5. Rechtsgrond voor verwerking',
      icon: FileText,
      content: [
        'Wij verwerken persoonsgegevens uitsluitend op basis van:',
        '',
        '• Uw toestemming (bijvoorbeeld voor nieuwsbrieven)',
        '• De uitvoering van een overeenkomst (uw bestelling of afspraak)',
        '• Een wettelijke verplichting (boekhouding, btw)',
        '• Ons gerechtvaardigd belang (verbeteren van diensten, fraudepreventie)',
        '',
        'Voor maatwerk juwelen verwerken wij extra gegevens zoals ontwerpwensen, ringmaten, en persoonlijke voorkeuren op basis van uw expliciete toestemming.'
      ]
    },
    {
      id: 'retention',
      title: '6. Bewaartermijn',
      icon: Clock,
      content: [
        'Wij bewaren uw persoonsgegevens niet langer dan nodig voor de doeleinden waarvoor ze zijn verzameld, tenzij een langere bewaartermijn wettelijk verplicht is:',
        '',
        '• Klantgegevens: 7 jaar na laatste aankoop (boekhoudkundige verplichting)',
        '• Bestelgegevens: 7 jaar (btw-administratie)',
        '• Nieuwsbriefgegevens: tot u zich uitschrijft',
        '• Websitegegevens (cookies): zie ons cookiebeleid',
        '• Maatwerk ontwerpen: 10 jaar (voor eventuele reparaties)',
        '• Communicatie: 3 jaar na laatste contact'
      ]
    },
    {
      id: 'third-parties',
      title: '7. Delen van gegevens',
      icon: Share2,
      content: [
        'Uw gegevens worden alleen binnen de Europese Economische Ruimte verwerkt.',
        'Wij delen uw gegevens uitsluitend met verbonden partners voor de uitvoering van onze diensten.',
        '',
        'Mogelijke ontvangers kunnen zijn:',
        '• Betaaldienstverleners',
        '• Verzendpartners',
        '• IT-dienstverleners',
        '• Boekhoudkundige diensten',
        '',
        'Wij verkopen uw gegevens NOOIT aan derden.',
        'Alle partners zijn contractueel verplicht uw gegevens veilig te behandelen.'
      ]
    },
    {
      id: 'cookies',
      title: '8. Cookies',
      icon: Cookie,
      content: [
        'Onze website maakt gebruik van cookies en soortgelijke technologieën om uw ervaring te verbeteren:',
        '',
        '• Noodzakelijke cookies: essentieel voor website functionaliteit (altijd actief)',
        '• Functionele cookies: verbeteren de gebruikservaring',
        '• Analytische cookies: Google Analytics voor websitestatistieken',
        '• Derde partij cookies: van Google en Facebook voor advertenties',
        '',
        'U kunt uw cookievoorkeuren beheren door op de "Cookie Instellingen" knop onderaan deze pagina te klikken.',
        'U kunt cookies ook beheren via uw browserinstellingen.',
        'Let op: het uitschakelen van bepaalde cookies kan de functionaliteit van de website beperken.',
        'Eerder geïnstalleerde cookies kunt u via uw browser verwijderen.'
      ]
    },
    {
      id: 'rights',
      title: '9. Uw rechten',
      icon: Settings,
      content: [
        'Onder de GDPR heeft u de volgende rechten:',
        '',
        '• Recht op inzage: overzicht van uw gegevens opvragen',
        '• Recht op correctie: onjuiste gegevens laten corrigeren',
        '• Recht op verwijdering: "recht om vergeten te worden"',
        '• Recht op beperking: verwerking laten stoppen',
        '• Recht op bezwaar: tegen bepaalde verwerkingen',
        '• Recht op overdraagbaarheid: uw gegevens in digitaal formaat ontvangen',
        '• Recht op intrekken toestemming: bijvoorbeeld nieuwsbrief uitschrijven',
        '',
        `Een verzoek kan worden ingediend via: ${contactInfo.email}`,
        'Wij reageren binnen 30 dagen op uw verzoek.'
      ]
    },
    {
      id: 'security',
      title: '10. Beveiliging',
      icon: Lock,
      content: [
        'Wij nemen uitgebreide maatregelen om uw persoonsgegevens te beschermen:',
        '',
        '• SSL-versleuteling voor alle datatransmissie',
        '• Beveiligde servers met regelmatige updates',
        '• Toegangscontrole: alleen geautoriseerd personeel',
        '• Regelmatige beveiligingsaudits',
        '• Backup en herstelplannen',
        '• Fysieke beveiliging van onze showroom en systemen',
        '',
        'Ondanks deze maatregelen kunnen wij geen 100% garantie geven tegen alle beveiligingsrisico\'s.',
        'Bij een datalek informeren wij u binnen 72 uur conform GDPR-vereisten.'
      ]
    },
    {
      id: 'international',
      title: '11. Internationale overdrachten',
      icon: Share2,
      content: [
        'Sommige van onze dienstverleners kunnen gevestigd zijn buiten de Europese Unie:',
        '',
        '• Google Analytics (VS) - adequaatheidsbesluit en Privacy Shield',
        '• Cloudflare (VS) - adequaatheidsbesluit voor beveiliging',
        '• E-mail providers - binnen EU of met adequate bescherming',
        '',
        'Alle internationale overdrachten gebeuren conform GDPR-vereisten met adequate beschermingsmaatregelen.'
      ]
    },
    {
      id: 'minors',
      title: '12. Minderjarigen',
      icon: Shield,
      content: [
        'Onze diensten zijn niet gericht op personen onder de 16 jaar.',
        'Wij verzamelen niet bewust persoonsgegevens van kinderen onder de 16 jaar.',
        'Indien u ouder bent en ontdekt dat uw kind ons persoonsgegevens heeft verstrekt, neem dan contact met ons op.',
        'Voor aankopen door minderjarigen is toestemming van ouders/voogd vereist.'
      ]
    },
    {
      id: 'supervisor',
      title: '13. Contactgegevens toezichthouder',
      icon: Eye,
      content: [
        'Indien u klachten heeft over de verwerking van uw persoonsgegevens, kunt u een klacht indienen bij de Privacy Commissie:',
        '',
        'Privacy Commissie',
        'Drukpersstraat 35',
        '1000 Brussel',
        'E-mail: commission@privacycommission.be',
        '',
        'Wij raden u aan om eerst contact met ons op te nemen voordat u een klacht indient bij de toezichthouder.'
      ]
    },
    {
      id: 'changes',
      title: '14. Wijzigingen',
      icon: Edit,
      content: [
        'Wij behouden ons het recht voor om deze privacyverklaring te wijzigen.',
        'Belangrijke wijzigingen zullen wij u meedelen via e-mail of een prominente melding op onze website.',
        'De meest recente versie is steeds beschikbaar op onze website.',
        'Wij raden u aan om deze verklaring regelmatig te raadplegen.'
      ]
    },
    {
      id: 'contact',
      title: '15. Contact',
      icon: Phone,
      content: [
        'Voor vragen over deze privacyverklaring of uw persoonsgegevens kunt u contact opnemen via:',
        '',
        `📧 ${contactInfo.email}`,
        `📞 ${contactInfo.phone}`,
        `📍 ${contactInfo.address.street}, ${contactInfo.address.postalCode} ${contactInfo.address.city}`,
        `🕒 ${contactInfo.hours}`,
        '',
        'Wij streven ernaar binnen 24 uur te reageren op uw vragen over privacy en gegevensbescherming.'
      ]
    }
  ];

  const dataRights = [
    { icon: Eye, title: 'Recht op Inzage', desc: 'Overzicht van uw gegevens opvragen' },
    { icon: Edit, title: 'Recht op Correctie', desc: 'Onjuiste gegevens laten corrigeren' },
    { icon: Trash2, title: 'Recht op Verwijdering', desc: 'Uw gegevens laten verwijderen' },
    { icon: Ban, title: 'Recht op Beperking', desc: 'Verwerking laten stoppen' },
    { icon: Share2, title: 'Recht op Bezwaar', desc: 'Tegen bepaalde verwerkingen' },
    { icon: Download, title: 'Recht op Overdraagbaarheid', desc: 'Gegevens in digitaal formaat ontvangen' }
  ];

  return (
    <div className="bg-Color-Netural-White">
      <PageHero 
        title="Privacyverklaring"
        subtitle="Privacy Policy"
        backgroundImage="https://diamondsbycs.com/images/uploads/upload-660bbaa346b8b.jpg"
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
              transition={{ duration: 0.8, delay: 1 }}
              className="inline-flex items-center justify-center mb-8"
            >
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.8 }}
                className="w-16 h-16 bg-Color-Light-300 rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
              >
                <Shield className="h-8 w-8 text-Color-Netural-White" />
              </motion.div>
            </motion.div>
            
            <h1 className="typography-h2 text-Color-Dark-500 mb-6 relative">
              Privacyverklaring
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
                Uw privacy is belangrijk voor ons. Deze verklaring legt uit hoe wij uw gegevens beschermen.
              </p>
            </div>
          </motion.div>

          {/* Privacy Sections */}
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

          {/* Your Rights Visual Guide */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-20"
          >
            <div className="text-center mb-12">
              <h3 className="typography-h2 text-Color-Dark-500 mb-6">
                Uw <span className="text-Color-Light-300">Privacy Rechten</span>
              </h3>
              <p className="typography-body-lg text-Color-Gray-700 max-w-3xl mx-auto">
                U heeft volledige controle over uw persoonsgegevens. Hier zijn uw rechten in één overzicht:
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {dataRights.map((right, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: 1.2 + (index * 0.1) }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-Color-Netural-White to-Color-Secondary/30 p-8 rounded-xl shadow-lg border border-Color-Light-300/30 text-center group"
                >
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-Color-Light-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <right.icon className="h-8 w-8 text-Color-Netural-White" />
                  </motion.div>
                  <h4 className="typography-h6 text-Color-Dark-500 font-bold mb-3 group-hover:text-Color-Light-300 transition-colors duration-300">
                    {right.title}
                  </h4>
                  <p className="typography-body text-Color-Gray-700 leading-relaxed">
                    {right.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Special Notices */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mt-16 space-y-8"
          >
            {/* GDPR Compliance */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 p-8 rounded-r-xl shadow-lg">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="typography-h6 text-green-800 font-bold mb-3">
                    GDPR Compliant
                  </h3>
                  <p className="typography-body text-green-700 leading-relaxed">
                    Wij zijn volledig GDPR-compliant en respecteren alle Europese privacywetgeving. 
                    Uw gegevens worden veilig opgeslagen en alleen gebruikt voor de doeleinden die u heeft goedgekeurd.
                  </p>
                </div>
              </div>
            </div>

            {/* Jewelry Specific Notice */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-400 p-8 rounded-r-xl shadow-lg">
              <div className="flex items-start">
                <Info className="h-6 w-6 text-blue-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="typography-h6 text-blue-800 font-bold mb-3">
                    Maatwerk Juwelen - Extra Privacy
                  </h3>
                  <p className="typography-body text-blue-700 leading-relaxed">
                    Voor maatwerk juwelen bewaren wij uw ontwerpwensen en persoonlijke voorkeuren langer (10 jaar) 
                    voor eventuele reparaties of aanpassingen. Deze gegevens worden extra beveiligd opgeslagen.
                  </p>
                </div>
              </div>
            </div>

            {/* Cookie Preferences Management */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-8 rounded-r-xl shadow-lg">
              <div className="flex items-start">
                <Cookie className="h-6 w-6 text-amber-500 mr-4 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="typography-h6 text-amber-800 font-bold mb-3">
                    Cookie Voorkeuren Beheren
                  </h3>
                  <p className="typography-body text-amber-700 leading-relaxed mb-4">
                    U heeft volledige controle over welke cookies u toestaat.
                    Klik op de knop hieronder om uw cookie voorkeuren aan te passen.
                  </p>
                  <button
                    onClick={() => {
                      // Dispatch event to show cookie settings
                      window.dispatchEvent(new CustomEvent('showCookieSettings'));
                    }}
                    className="btn-primary px-6 py-3 flex items-center justify-center"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Cookie Instellingen
                  </button>
                </div>
              </div>
            </div>

            {/* Contact for Privacy Questions */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-400 p-8 rounded-r-xl shadow-lg">
              <div className="flex items-start">
                <Settings className="h-6 w-6 text-purple-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="typography-h6 text-purple-800 font-bold mb-3">
                    Privacy Vragen?
                  </h3>
                  <p className="typography-body text-purple-700 leading-relaxed mb-4">
                    Heeft u vragen over uw privacy of wilt u gebruik maken van uw rechten?
                    Neem gerust contact met ons op voor persoonlijke hulp.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => onNavigate('/contact')}
                      className="btn-primary px-6 py-3 flex items-center justify-center"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Privacy Contact
                    </button>
                    <button
                      onClick={() => window.open(`mailto:${contactInfo.email}?subject=Privacy Verzoek`)}
                      className="btn-secondary px-6 py-3 flex items-center justify-center"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Gegevens Beheren
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
            transition={{ duration: 0.8, delay: 1.6 }}
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
                  Veilig Winkelen bij Diamonds by CS
                </h3>
                <p className="typography-body-lg text-Color-Light-300 mb-8 max-w-2xl mx-auto">
                  Uw privacy en veiligheid staan voorop. Shop met vertrouwen bij Antwerpen's meest vertrouwde juwelier.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('/shop')}
                    className="btn-secondary px-8 py-4 flex items-center justify-center"
                  >
                    <Shield className="mr-3 h-5 w-5" />
                    Veilig Winkelen
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
        </div>
      </section>
    </div>
  );
};