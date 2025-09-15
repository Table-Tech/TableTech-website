import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { ScrollArrows } from "./ScrollArrows";

interface CookiePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export const CookiePolicyModal: React.FC<CookiePolicyModalProps> = ({
  isOpen,
  onClose,
  onOpenPrivacy,
  onOpenTerms,
}: CookiePolicyModalProps) => {
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
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-[#2C1E1A] to-[#1a110d] border-b border-amber-600/30 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#FFD382]">Cookiebeleid</h2>
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
                className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-80px)] scrollbar-hide cookie-modal-content"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                data-modal-content="true"
              >
              <div className="prose prose-lg max-w-none">
                <div className="text-[#FFD382]/80 mb-6">
                  <p><strong className="text-[#FFD382]">Laatst bijgewerkt:</strong> {new Date().toLocaleDateString('nl-NL')}</p>
                  <p><strong className="text-[#FFD382]">Versie:</strong> 2.0 – Uitgebreide cookierichtlijnen</p>
                </div>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">1. Wat zijn cookies?</h3>
                <p className="text-white/90 mb-6">
                  Cookies zijn kleine tekstbestanden die op je apparaat worden opgeslagen wanneer je onze website bezoekt. 
                  Ze helpen ons om je voorkeuren te onthouden, de website te verbeteren en je een betere gebruikerservaring 
                  te bieden. TableTech gebruikt verschillende soorten cookies voor verschillende doeleinden.
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">2. Welke cookies gebruiken wij?</h3>
                
                <h4 className="text-lg font-semibold text-[#FFD382] mb-3">2.1 Noodzakelijke cookies</h4>
                <p className="text-white/90 mb-4">
                  Deze cookies zijn essentieel voor de werking van onze website en kunnen niet worden uitgeschakeld:
                </p>
                <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                  <li><strong className="text-[#FFD382]">Sessiebeheer:</strong> Houden je ingelogd tijdens je bezoek</li>
                  <li><strong className="text-[#FFD382]">Beveiliging:</strong> Beschermen tegen CSRF-aanvallen en andere bedreigingen</li>
                  <li><strong className="text-[#FFD382]">Winkelwagen:</strong> Onthouden je geselecteerde items in restaurant menu's</li>
                  <li><strong className="text-[#FFD382]">Cookie-toestemming:</strong> Onthouden je cookievoorkeuren</li>
                </ul>

                <h4 className="text-lg font-semibold text-[#FFD382] mb-3">2.2 Functionele cookies</h4>
                <p className="text-white/90 mb-4">
                  Deze cookies verbeteren je gebruikerservaring maar zijn niet strikt noodzakelijk:
                </p>
                <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                  <li><strong className="text-[#FFD382]">Taalinstellingen:</strong> Onthouden je voorkeurstaal (Nederlands/Engels)</li>
                  <li><strong className="text-[#FFD382]">Thema-voorkeuren:</strong> Dark/light mode instellingen</li>
                  <li><strong className="text-[#FFD382]">Formuliergegevens:</strong> Onthouden eerder ingevulde contactgegevens</li>
                  <li><strong className="text-[#FFD382]">Regionale instellingen:</strong> Tijdzone en valuta-voorkeuren</li>
                </ul>

                <h4 className="text-lg font-semibold text-[#FFD382] mb-3">2.3 Analytische cookies</h4>
                <p className="text-white/90 mb-4">
                  Deze cookies helpen ons begrijpen hoe bezoekers onze website gebruiken (alleen met je toestemming):
                </p>
                <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                  <li><strong className="text-[#FFD382]">Gebruiksstatistieken:</strong> Welke pagina's het meest bezocht worden</li>
                  <li><strong className="text-[#FFD382]">Prestatiemonitoring:</strong> Hoe snel pagina's laden</li>
                  <li><strong className="text-[#FFD382]">Foutrapportage:</strong> Technische problemen identificeren</li>
                  <li><strong className="text-[#FFD382]">Conversie-tracking:</strong> Effectiviteit van onze call-to-actions</li>
                </ul>

                <h4 className="text-lg font-semibold text-[#FFD382] mb-3">2.4 Marketing cookies</h4>
                <p className="text-white/90 mb-4">
                  Deze cookies worden gebruikt voor gerichte communicatie (alleen met uitdrukkelijke toestemming):
                </p>
                <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                  <li><strong className="text-[#FFD382]">Retargeting:</strong> Relevante aanbiedingen tonen op andere websites</li>
                  <li><strong className="text-[#FFD382]">E-mail personalisatie:</strong> Aangepaste nieuwsbrieven</li>
                  <li><strong className="text-[#FFD382]">Social Media:</strong> Integratie met LinkedIn en andere platforms</li>
                  <li><strong className="text-[#FFD382]">Campagne-tracking:</strong> Meten van advertentie-effectiviteit</li>
                </ul>

                <h4 className="text-lg font-semibold text-[#FFD382] mb-3">2.5 Prestatie cookies</h4>
                <p className="text-white/90 mb-4">
                  Deze cookies optimaliseren de snelheid en prestaties van onze website:
                </p>
                <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                  <li><strong className="text-[#FFD382]">Caching:</strong> Sneller laden van eerder bezochte pagina's</li>
                  <li><strong className="text-[#FFD382]">CDN-optimalisatie:</strong> Content delivery vanaf dichtstbijzijnde server</li>
                  <li><strong className="text-[#FFD382]">Afbeelding-compressie:</strong> Geoptimaliseerde laadtijden voor foto's</li>
                  <li><strong className="text-[#FFD382]">Resource-planning:</strong> Slimme loading van JavaScript en CSS</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">3. Externe dienstverleners</h3>
                <p className="text-white/90 mb-4">
                  Wij werken samen met betrouwbare partners die cookies kunnen plaatsen:
                </p>
                <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                  <li><strong className="text-[#FFD382]">Vercel:</strong> Hosting en prestatie-optimalisatie (EU servers)</li>
                  <li><strong className="text-[#FFD382]">Railway:</strong> API hosting en database services</li>
                  <li><strong className="text-[#FFD382]">Mollie:</strong> Veilige betalingsverwerking (PCI DSS compliant)</li>
                  <li><strong className="text-[#FFD382]">Resend:</strong> E-mailcommunicatie (GDPR compliant)</li>
                  <li><strong className="text-[#FFD382]">Google Fonts:</strong> Web typography (privacy-optimized loading)</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">4. Jouw rechten en controle</h3>
                <p className="text-white/90 mb-4">
                  Je hebt volledige controle over je cookievoorkeuren:
                </p>
                <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                  <li><strong className="text-[#FFD382]">Toestemming intrekken:</strong> Op elk moment via de cookie banner</li>
                  <li><strong className="text-[#FFD382]">Categorieën selecteren:</strong> Kies welke types cookies je accepteert</li>
                  <li><strong className="text-[#FFD382]">Browser-instellingen:</strong> Cookies blokkeren of verwijderen via je browser</li>
                  <li><strong className="text-[#FFD382]">Opt-out tools:</strong> Externe opt-out mogelijkheden gebruiken</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">5. Browser-specifieke instructies</h3>
                <div className="bg-gradient-to-r from-amber-600/10 to-amber-700/10 border border-amber-600/30 p-4 rounded-lg mb-6">
                  <p className="text-white/90 mb-3">
                    <strong className="text-[#FFD382]">Chrome:</strong> Instellingen → Privacy en beveiliging → Cookies en andere sitegegevens
                  </p>
                  <p className="text-white/90 mb-3">
                    <strong className="text-[#FFD382]">Firefox:</strong> Instellingen → Privacy en beveiliging → Cookies en sitegegevens
                  </p>
                  <p className="text-white/90 mb-3">
                    <strong className="text-[#FFD382]">Safari:</strong> Voorkeuren → Privacy → Cookies en websitegegevens
                  </p>
                  <p className="text-white/90">
                    <strong className="text-[#FFD382]">Edge:</strong> Instellingen → Cookies en site-machtigingen → Cookies en sitegegevens
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">6. Bewaartermijnen</h3>
                <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                  <li><strong className="text-[#FFD382]">Sessiecookies:</strong> Worden verwijderd wanneer je de browser sluit</li>
                  <li><strong className="text-[#FFD382]">Permanente cookies:</strong> 1 maand tot 2 jaar, afhankelijk van het doel</li>
                  <li><strong className="text-[#FFD382]">Analytische cookies:</strong> Maximaal 26 maanden</li>
                  <li><strong className="text-[#FFD382]">Marketing cookies:</strong> Maximaal 13 maanden</li>
                  <li><strong className="text-[#FFD382]">Functionele cookies:</strong> Maximaal 12 maanden</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">7. Automatische verwijdering</h3>
                <p className="text-white/90 mb-6">
                  Onze cookies worden automatisch verwijderd na de vastgestelde bewaartermijn. 
                  Je kunt ook handmatig alle cookies verwijderen via je browserinstellingen 
                  of door je toestemming in te trekken via onze cookie banner.
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">8. Geen verkoop van gegevens</h3>
                <p className="text-white/90 mb-6">
                  TableTech verkoopt nooit persoonlijke gegevens die via cookies worden verzameld. 
                  Alle gegevens worden uitsluitend gebruikt voor de doeleinden beschreven in dit 
                  cookiebeleid en ons privacybeleid.
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">9. Updates van dit beleid</h3>
                <p className="text-white/90 mb-6">
                  Dit cookiebeleid kan van tijd tot tijd worden bijgewerkt om nieuwe technologieën 
                  of wettelijke vereisten te reflecteren. Belangrijke wijzigingen worden 
                  aangekondigd via onze website en/of per e-mail.
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">10. Vragen en contact</h3>
                <div className="bg-gradient-to-r from-amber-600/10 to-amber-700/10 border border-amber-600/30 p-4 rounded-lg mb-12">
                  <p className="text-white/90">
                    <strong className="text-[#FFD382]">Cookie-gerelateerde vragen:</strong><br />
                    E-mail: <a href="mailto:privacy@tabletech.nl" className="text-amber-400 hover:text-amber-300 underline">privacy@tabletech.nl</a><br />
                    Telefoon: <a href="tel:+31853030723" className="text-amber-400 hover:text-amber-300 underline">+31 85 303 07 23</a><br />
                    <br />
                    <strong className="text-[#FFD382]">Technische ondersteuning:</strong><br />
                    E-mail: <a href="mailto:support@tabletech.nl" className="text-amber-400 hover:text-amber-300 underline">support@tabletech.nl</a>
                  </p>
                </div>
              </div>
              </div>
              
              {/* Scroll Arrows - Hidden on mobile */}
              <div className="hidden md:block">
                <ScrollArrows targetSelector=".cookie-modal-content" />
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gradient-to-r from-[#2C1E1A] to-[#1a110d] border-t border-amber-600/30 px-6 py-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                <div className="flex gap-3">
                  {onOpenPrivacy && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenPrivacy();
                      }}
                      className="px-4 py-2 bg-transparent border border-amber-600/50 text-[#FFD382] rounded-lg hover:bg-amber-600/10 hover:border-amber-600 hover:scale-105 active:scale-95 transition-all duration-300 transform font-medium shadow-lg hover:shadow-xl text-center"
                    >
                      Privacybeleid
                    </button>
                  )}
                  {onOpenTerms && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenTerms();
                      }}
                      className="px-4 py-2 bg-transparent border border-amber-600/50 text-[#FFD382] rounded-lg hover:bg-amber-600/10 hover:border-amber-600 hover:scale-105 active:scale-95 transition-all duration-300 transform font-medium shadow-lg hover:shadow-xl text-center"
                    >
                      Algemene voorwaarden
                    </button>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 hover:scale-105 active:scale-95 transition-all duration-300 transform font-medium shadow-lg hover:shadow-xl text-center"
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
