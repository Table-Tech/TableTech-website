import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { ScrollArrows } from "./ScrollArrows";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTerms?: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  onOpenTerms,
}) => {
  // Block body scroll when modal is open but allow modal content scroll
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle scroll events for modal content
  React.useEffect(() => {
    if (!isOpen) return;

    const handleModalScroll = (e: WheelEvent) => {
      const modalContent = document.querySelector('[data-modal-content="true"]') as HTMLElement;
      
      if (modalContent && modalContent.contains(e.target as Node)) {
        // Always prevent the event from bubbling to prevent background scroll
        e.preventDefault();
        e.stopPropagation();
        
        const deltaY = e.deltaY;
        const scrollTop = modalContent.scrollTop;
        const scrollHeight = modalContent.scrollHeight;
        const clientHeight = modalContent.clientHeight;

        // Check if we can scroll in the direction
        if ((deltaY > 0 && scrollTop + clientHeight < scrollHeight) || 
            (deltaY < 0 && scrollTop > 0)) {
          // Scroll within modal bounds
          modalContent.scrollTop += deltaY;
        }
        // If we can't scroll in that direction, do nothing (don't allow background scroll)
      } else {
        // Prevent any scrolling outside modal
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('wheel', handleModalScroll, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', handleModalScroll);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-gradient-to-br from-[#2C1E1A] to-[#1a110d] rounded-2xl shadow-2xl overflow-hidden border border-amber-600/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-[#2C1E1A] to-[#1a110d] border-b border-amber-600/30 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#FFD382]">Privacybeleid</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-amber-600/20 rounded-full transition-colors duration-200"
                aria-label="Sluiten"
              >
                <IoClose size={24} className="text-[#FFD382]" />
              </button>
            </div>

            {/* Content */}
            <div className="relative">
              <div 
                className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-80px)] scrollbar-hide privacy-modal-content"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                data-modal-content="true"
              >
              <div className="prose prose-lg max-w-none">
                <div className="text-[#FFD382]/80 mb-6">
                  <p><strong className="text-[#FFD382]">Laatst bijgewerkt:</strong> 28 augustus 2025</p>
                  <p><strong className="text-[#FFD382]">Versie:</strong> 1.0 – Geïntegreerde versie (website & applicatie)</p>
                </div>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">1. Inleiding en Contactgegevens</h3>
                <h4 className="text-lg font-semibold text-[#FFD382] mb-3">1.1 Over TableTech</h4>
                <p className="text-white/90 mb-4">
                  TableTech B.V. biedt een digitaal restaurantbestelsysteem waarmee klanten via QR-codes menu's kunnen bekijken en bestellingen kunnen plaatsen. Daarnaast bieden wij een bedrijfswebsite (https://tabletech.nl) voor informatie, afspraken en support.
                </p>
                <p className="text-white/90 mb-6">
                  Wij nemen de bescherming van persoonsgegevens uiterst serieus en verwerken data in lijn met de Algemene Verordening Gegevensbescherming (AVG/GDPR).
                </p>

                <h4 className="text-lg font-semibold text-[#FFD382] mb-3">1.2 Verwerkingsverantwoordelijke</h4>
                <div className="bg-gradient-to-r from-amber-600/10 to-amber-700/10 border border-amber-600/30 p-4 rounded-lg mb-6">
                  <p className="text-white/90">
                    <strong className="text-[#FFD382]">TableTech B.V.</strong><br />
                    E-mail: <a href="mailto:privacy@tabletech.nl" className="text-amber-400 hover:text-amber-300 underline">privacy@tabletech.nl</a><br />
                    Telefoon: <a href="tel:+31858883333" className="text-amber-400 hover:text-amber-300 underline">+31 85 888 3333</a>
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">2. Welke Gegevens Verzamelen Wij</h3>
                <h4 className="text-lg font-semibold text-[#FFD382] mb-3">2.1 Websitebezoekers</h4>
                <ul className="list-disc pl-6 mb-4 text-white/80 space-y-2 marker:text-amber-500">
                  <li>Contact- en afspraakformulieren: naam, e-mail, telefoon, bedrijfsnaam (optioneel), bericht</li>
                  <li>Support chat: gestelde vragen, communicatievoorkeuren (e-mail/WhatsApp)</li>
                  <li>Technische gegevens: IP-adres (gehasht), browserinformatie, apparaattype, sessieduur, klikgedrag</li>
                  <li>E-mailcommunicatie: interacties met nieuwsbrieven of bevestigingsmails (open/klikgedrag)</li>
                  <li>Afspraakbeheer: referentienummers, status en tijdslot van afspraken</li>
                </ul>

                <h4 className="text-lg font-semibold text-[#FFD382] mb-3">2.2 Restaurantklanten (QR-app gebruikers)</h4>
                <ul className="list-disc pl-6 mb-4 text-white/80 space-y-2 marker:text-amber-500">
                  <li>Automatisch: IP-adres, browser/device info, tafelcode/sessie-informatie, tijdstempels</li>
                  <li>Optioneel: naam, e-mail (voor orderbevestigingen)</li>
                  <li>Bestelgegevens: menu-items, hoeveelheden, opmerkingen, modifiers, tafelnummer, besteltijdstip</li>
                </ul>

                <h4 className="text-lg font-semibold text-[#FFD382] mb-3">2.3 Restaurantpersoneel</h4>
                <ul className="list-disc pl-6 mb-4 text-white/80 space-y-2 marker:text-amber-500">
                  <li>Accounts: naam, e-mail, wachtwoord (gehashed), rol (Admin, Chef, Ober etc.)</li>
                  <li>Logs: login-tijden, sessiegegevens, mislukte pogingen</li>
                  <li>Activiteiten: bestellingswijzigingen, menu-updates, exportacties</li>
                </ul>

                <h4 className="text-lg font-semibold text-[#FFD382] mb-3">2.4 Restaurantbedrijven</h4>
                <ul className="list-disc pl-6 mb-4 text-white/80 space-y-2 marker:text-amber-500">
                  <li>Bedrijfsnaam en adres, contactinformatie, BTW-gegevens</li>
                  <li>Menu- en productinformatie, allergenen, prijzen, valuta</li>
                  <li>Afbeeldingen/logo's, voorbereidingstijden</li>
                </ul>

                <h4 className="text-lg font-semibold text-[#FFD382] mb-3">2.5 Betalingsgegevens (via Mollie)</h4>
                <ul className="list-disc pl-6 mb-4 text-white/80 space-y-2 marker:text-amber-500">
                  <li>Orderbedrag, BTW, betaalmethode, transactie-ID, status, timestamps</li>
                  <li>Fraudepreventie-data en verificatietokens</li>
                  <li><strong className="text-[#FFD382]">Belangrijk:</strong> wij slaan géén betaalkaart- of bankgegevens op</li>
                </ul>

                <h4 className="text-lg font-semibold text-[#FFD382] mb-3">2.6 Technische en Auditlogs</h4>
                <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                  <li>Systeemacties met tijdstempels en IP</li>
                  <li>Server- en foutlogs</li>
                  <li>Prestatie- en beveiligingsdata</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">3. Rechtsgrondslagen voor Verwerking</h3>
                <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                  <li><strong className="text-[#FFD382]">Uitvoering van overeenkomst</strong> (Art. 6(1)(b)): bestellingen, betalingen, afspraakbeheer</li>
                  <li><strong className="text-[#FFD382]">Gerechtvaardigd belang</strong> (Art. 6(1)(f)): fraudepreventie, serviceverbetering, analytics</li>
                  <li><strong className="text-[#FFD382]">Wettelijke verplichting</strong> (Art. 6(1)(c)): fiscale bewaarplicht (7 jaar)</li>
                  <li><strong className="text-[#FFD382]">Toestemming</strong> (Art. 6(1)(a)): nieuwsbrieven, marketing, optionele cookies</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">4. Doeleinden van Gegevensverwerking</h3>
                <p className="text-white/90 mb-4">
                  <strong className="text-[#FFD382]">Primaire doeleinden:</strong> orderafhandeling, keukenbeheer, betalingen, afsprakenbeheer, klantenservice.
                </p>
                <p className="text-white/90 mb-6">
                  <strong className="text-[#FFD382]">Secundaire doeleinden:</strong> serviceverbetering, technische optimalisatie, beveiliging, marketing (alleen met toestemming).
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">5. Delen van Gegevens met Derden</h3>
                <ul className="list-disc pl-6 mb-4 text-white/80 space-y-2 marker:text-amber-500">
                  <li><strong className="text-[#FFD382]">Resend:</strong> e-mailcommunicatie (VS, EU-VS Data Privacy Framework)</li>
                  <li><strong className="text-[#FFD382]">Mollie:</strong> betalingen (PCI DSS compliant, EU datacenters)</li>
                  <li><strong className="text-[#FFD382]">Vercel:</strong> hosting (EU/edge datacenters)</li>
                  <li><strong className="text-[#FFD382]">Railway:</strong> API hosting, database (EU/internationaal met SCC's)</li>
                  <li><strong className="text-[#FFD382]">Redis:</strong> caching (tijdelijke sessies)</li>
                </ul>
                <p className="text-white/90 mb-6">
                  Wij verkopen nooit persoonsgegevens aan derden. Alleen wettelijke verzoeken worden gehonoreerd.
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">6. Internationale Gegevensoverdracht</h3>
                <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                  <li>Binnen de EU: standaard verwerking</li>
                  <li>Buiten EU: alleen onder SCC's, adequacy decision of passende waarborgen</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">7. Bewaartermijnen</h3>
                <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                  <li>Bestellingen & transacties: 7 jaar (fiscale verplichting)</li>
                  <li>Afspraakgegevens: 2 jaar</li>
                  <li>Supportgeschiedenis: 1 jaar</li>
                  <li>Technische logs: 30–365 dagen afhankelijk van type</li>
                  <li>Nieuwsbriefdata: tot uitschrijving + 1 jaar</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">8. Beveiligingsmaatregelen</h3>
                <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                  <li>TLS 1.3 encryptie in transit, AES-256 at rest</li>
                  <li>bcrypt hashing voor wachtwoorden</li>
                  <li>Role-based access control (RBAC)</li>
                  <li>Firewalls, rate limiting, DDoS-bescherming</li>
                  <li>Privacy by Design & standaardinstellingen</li>
                  <li>Jaarlijkse audits en penetratietests</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">9. Uw Rechten onder de AVG/GDPR</h3>
                <p className="text-white/90 mb-4">
                  U heeft recht op inzage, rectificatie, verwijdering, beperking, overdraagbaarheid en bezwaar.
                </p>
                <p className="text-white/90 mb-6">
                  Verzoeken: <a href="mailto:privacy@tabletech.nl" className="text-amber-400 hover:text-amber-300 underline">privacy@tabletech.nl</a> – antwoord binnen 30 dagen.
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">10. Cookies en Tracking Technologieën</h3>
                <ul className="list-disc pl-6 mb-4 text-white/80 space-y-2 marker:text-amber-500">
                  <li><strong className="text-[#FFD382]">Essentieel:</strong> sessiebeheer, beveiliging, winkelwagen</li>
                  <li><strong className="text-[#FFD382]">Functioneel:</strong> taalinstellingen, foutmeldingen</li>
                  <li><strong className="text-[#FFD382]">Analytisch</strong> (met toestemming): gebruiksstatistieken, performance monitoring</li>
                  <li>Geen advertentiecookies</li>
                </ul>
                <p className="text-white/90 mb-6">
                  Cookievoorkeuren kunt u beheren via de cookie banner of browserinstellingen.
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">11. Data Breach Procedures</h3>
                <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                  <li>Detectie via 24/7 monitoring</li>
                  <li>Melding aan Autoriteit Persoonsgegevens binnen 72 uur (indien vereist)</li>
                  <li>Betrokkenen worden geïnformeerd bij hoog risico</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">12. Specifieke Verwerkingen</h3>
                <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                  <li>QR-code scanning: lokaal verwerkt, niet opgeslagen</li>
                  <li>Betaalverwerking via Mollie: alleen noodzakelijke orderdata, geen kaartnummers</li>
                  <li>Staff sessions: max. 3 tegelijk, auto-expiry, IP-validatie</li>
                  <li>Menu caching: 5 minuten TTL, enkel functioneel</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">13. Kinderen en Privacy</h3>
                <p className="text-white/90 mb-6">
                  Niet gericht op kinderen &lt;16 jaar. Gebruik onder toezicht van ouders aanbevolen.
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">14. Wijzigingen in dit Privacybeleid</h3>
                <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                  <li>Wijzigingen worden aangekondigd via de website of e-mail</li>
                  <li>Huidige versie: 1.0 (28 augustus 2025)</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">15. Klachten en Toezichthouder</h3>
                <p className="text-white/90 mb-4">
                  <strong className="text-[#FFD382]">Autoriteit Persoonsgegevens</strong><br />
                  Postbus 93374, 2509 AJ Den Haag<br />
                  Website: https://autoriteitpersoonsgegevens.nl
                </p>
                <p className="text-white/90 mb-6">
                  Eerst contact opnemen via: <a href="mailto:privacy@tabletech.nl" className="text-amber-400 hover:text-amber-300 underline">privacy@tabletech.nl</a>
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">16. Contact en Vragen</h3>
                <div className="bg-gradient-to-r from-amber-600/10 to-amber-700/10 border border-amber-600/30 p-4 rounded-lg mb-6">
                  <p className="text-white/90">
                    <strong className="text-[#FFD382]">Privacy Officer:</strong> <a href="mailto:privacy@tabletech.nl" className="text-amber-400 hover:text-amber-300 underline">privacy@tabletech.nl</a><br />
                    <strong className="text-[#FFD382]">Support:</strong> <a href="mailto:support@tabletech.nl" className="text-amber-400 hover:text-amber-300 underline">support@tabletech.nl</a><br />
                    <strong className="text-[#FFD382]">Security:</strong> <a href="mailto:security@tabletech.nl" className="text-amber-400 hover:text-amber-300 underline">security@tabletech.nl</a>
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">17. Bijlage A: Technische Specificaties</h3>
                <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                  <li>Database: PostgreSQL met AES-256</li>
                  <li>Caching: Redis</li>
                  <li>Backups: dagelijks, 30 dagen retentie</li>
                  <li>Authenticatie: JWT, RBAC</li>
                  <li>Logging: Pino, 30 dagen–7 jaar</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">18. Bijlage B: Wijzigingslog</h3>
                <p className="text-white/90 mb-6">
                  Er zijn nog geen aanpassingen geweest aan dit privacybeleid sinds de publicatie van versie 1.0 op 28 augustus 2025.
                </p>

                <div className="text-sm text-white/60 mt-8 mb-12">
                  <p>Dit privacybeleid dekt zowel de website (https://tabletech.nl) als de volledige applicatieomgeving van TableTech.</p>
                  <p>Documentversie: PRIVACY-001-20250828</p>
                  <p>Toepasselijk recht: Nederlands recht</p>
                </div>
              </div>
              </div>
              
              {/* Scroll Arrows */}
              <ScrollArrows targetSelector=".privacy-modal-content" />
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gradient-to-r from-[#2C1E1A] to-[#1a110d] border-t border-amber-600/30 px-6 py-4">
              <div className="flex justify-between items-center">
                {onOpenTerms && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenTerms();
                    }}
                    className="px-4 py-2 bg-transparent border border-amber-600/50 text-[#FFD382] rounded-lg hover:bg-amber-600/10 hover:border-amber-600 hover:scale-105 active:scale-95 transition-all duration-300 transform font-medium shadow-lg hover:shadow-xl"
                  >
                    Algemene voorwaarden
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 hover:scale-105 active:scale-95 transition-all duration-300 transform font-medium shadow-lg hover:shadow-xl"
                >
                  Sluiten
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};