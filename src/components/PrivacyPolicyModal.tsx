import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

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
            <div 
              className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-80px)] scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              data-modal-content="true"
            >
              <div className="prose prose-lg max-w-none">
                <p className="text-[#FFD382]/80 mb-6">
                  <strong className="text-[#FFD382]">Laatst bijgewerkt:</strong> {new Date().toLocaleDateString('nl-NL')}
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">1. Introductie</h3>
                <p className="text-white/90 mb-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                  nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                  eu fugiat nulla pariatur.
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">2. Welke gegevens verzamelen wij?</h3>
                <p className="text-white/90 mb-4">
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                  deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste 
                  natus error sit voluptatem accusantium doloremque laudantium.
                </p>
                <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                  <li>Persoonlijke identificatiegegevens (naam, e-mailadres, telefoonnummer)</li>
                  <li>Bedrijfsgegevens (bedrijfsnaam, functie, branche)</li>
                  <li>Technische gegevens (IP-adres, browser type, apparaatinformatie)</li>
                  <li>Gebruiksgegevens (hoe u onze website gebruikt)</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">3. Hoe gebruiken wij uw gegevens?</h3>
                <p className="text-white/90 mb-6">
                  Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi 
                  architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem 
                  quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur 
                  magni dolores eos qui ratione voluptatem sequi nesciunt.
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">4. Delen van gegevens</h3>
                <p className="text-white/90 mb-6">
                  Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, 
                  adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et 
                  dolore magnam aliquam quaerat voluptatem.
                </p>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">5. Uw rechten</h3>
                <p className="text-white/90 mb-4">
                  Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
                  laboriosam, nisi ut aliquid ex ea commodi consequatur:
                </p>
                <ul className="list-disc pl-6 mb-6 text-white/80 space-y-2 marker:text-amber-500">
                  <li>Het recht op toegang tot uw persoonsgegevens</li>
                  <li>Het recht op rectificatie van onjuiste gegevens</li>
                  <li>Het recht op verwijdering van uw gegevens</li>
                  <li>Het recht op beperking van de verwerking</li>
                  <li>Het recht op gegevensoverdraagbaarheid</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#FFD382] mb-4">6. Contact</h3>
                <p className="text-white/90 mb-6">
                  Voor vragen over dit privacybeleid kunt u contact met ons opnemen:
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