import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { ScrollArrows } from "./ScrollArrows";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacy?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  onOpenPrivacy,
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
              <h2 className="text-2xl font-bold text-[#FFD382]">Algemene voorwaarden</h2>
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
                className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-80px)] scrollbar-hide terms-modal-content"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                data-modal-content="true"
              >
              <div className="prose prose-lg max-w-none">
                <p className="text-[#FFD382]/80 mb-6">
                  <strong className="text-[#FFD382]">Laatst bijgewerkt:</strong> {new Date().toLocaleDateString('nl-NL')}
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">1. Definities</h3>
                <p className="text-white/90 mb-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                  incididunt ut labore et dolore magna aliqua. In deze algemene voorwaarden 
                  wordt verstaan onder:
                </p>
                <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                  <li><strong className="text-[#FFD382]">TableTech:</strong> de aanbieder van restaurantmanagement software</li>
                  <li><strong className="text-[#FFD382]">Klant:</strong> de natuurlijke of rechtspersoon die gebruik maakt van onze diensten</li>
                  <li><strong className="text-[#FFD382]">Diensten:</strong> alle door TableTech aangeboden producten en services</li>
                  <li><strong className="text-[#FFD382]">Platform:</strong> het TableTech software platform</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">2. Toepasselijkheid</h3>
                <p className="text-white/90 mb-6">
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut 
                  aliquip ex ea commodo consequat. Deze algemene voorwaarden zijn van toepassing 
                  op alle overeenkomsten tussen TableTech en de klant betreffende de levering 
                  van producten en/of diensten door TableTech.
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">3. Dienstverlening</h3>
                <p className="text-white/90 mb-6">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                  eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                  sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">4. Verplichtingen van de klant</h3>
                <p className="text-white/90 mb-4">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                  doloremque laudantium. De klant verplicht zich tot:
                </p>
                <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                  <li>Het verstrekken van juiste en volledige informatie</li>
                  <li>Het tijdig betalen van alle verschuldigde bedragen</li>
                  <li>Het naleven van alle toepasselijke wet- en regelgeving</li>
                  <li>Het zorgvuldig omgaan met toegangsgegevens</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">5. Prijzen en betaling</h3>
                <p className="text-white/90 mb-6">
                  Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi 
                  architecto beatae vitae dicta sunt explicabo. Alle prijzen zijn exclusief 
                  BTW en andere heffingen van overheidswege, tenzij anders vermeld.
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">6. Aansprakelijkheid</h3>
                <p className="text-white/90 mb-6">
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
                  sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. 
                  TableTech is niet aansprakelijk voor indirecte schade, gevolgschade, 
                  winstderving of andere immateriële schade.
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">7. Intellectueel eigendom</h3>
                <p className="text-white/90 mb-6">
                  Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, 
                  adipisci velit. Alle intellectuele eigendomsrechten op het platform, de 
                  software en alle daaraan gerelateerde materialen berusten bij TableTech.
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">8. Beëindiging</h3>
                <p className="text-white/90 mb-6">
                  Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
                  laboriosam. Beide partijen kunnen de overeenkomst beëindigen met inachtneming 
                  van de overeengekomen opzegtermijn.
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">9. Toepasselijk recht</h3>
                <p className="text-white/90 mb-6">
                  Op deze overeenkomst is uitsluitend Nederlands recht van toepassing. 
                  Geschillen worden voorgelegd aan de bevoegde rechter in Nederland.
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">10. Contact</h3>
                <p className="text-white/90 mb-6">
                  Voor vragen over deze algemene voorwaarden kunt u contact met ons opnemen:
                </p>
                <div className="bg-gradient-to-r from-amber-600/10 to-amber-700/10 border border-amber-600/30 p-4 rounded-lg mb-12">
                  <p className="text-white/90">
                    <strong className="text-[#FFD382]">TableTech</strong><br />
                    E-mail: <a href="mailto:info@tabletech.nl" className="text-amber-400 hover:text-amber-300 underline">info@tabletech.nl</a><br />
                    Telefoon: <a href="tel:+31853030723" className="text-amber-400 hover:text-amber-300 underline">+31 85 303 07 23</a>
                  </p>
                </div>
              </div>
              </div>
              
              {/* Scroll Arrows - Hidden on mobile */}
              <div className="hidden md:block">
                <ScrollArrows targetSelector=".terms-modal-content" />
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gradient-to-r from-[#2C1E1A] to-[#1a110d] border-t border-amber-600/30 px-6 py-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                {onOpenPrivacy && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPrivacy();
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-transparent border border-amber-600/50 text-[#FFD382] rounded-lg hover:bg-amber-600/10 hover:border-amber-600 hover:scale-105 active:scale-95 transition-all duration-300 transform font-medium shadow-lg hover:shadow-xl text-center"
                  >
                    Privacybeleid
                  </button>
                )}
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