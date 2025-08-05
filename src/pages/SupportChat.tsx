import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FaEnvelope,
  FaWhatsapp,
  FaComments,
  FaTimes,
  FaRobot,
  FaQuestionCircle,
} from "react-icons/fa";

export const SupportChat: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "email" | "whatsapp">("form");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);

  // Check if demo overlay is open
  useEffect(() => {
    const checkDemoOverlay = () => {
      // Look for demo overlay in the DOM
      const demoOverlay = document.querySelector('[class*="fixed inset-0 z-50"]');
      const hasDemoOverlay = !!demoOverlay;
      setIsDemoOpen(hasDemoOverlay);
    };

    // Check immediately
    checkDemoOverlay();

    // Set up observer to watch for DOM changes
    const observer = new MutationObserver(checkDemoOverlay);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Check scroll position for footer proximity
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const footerThreshold = 400; // Hide when 400px from bottom
      
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
      setIsNearFooter(distanceFromBottom < footerThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setResponse("Dankjewel voor je vraag! We nemen zo snel mogelijk contact met je op of je krijgt direct antwoord van onze slimme assistent.");
    // Clear the input after submitting so the user can type a new question
    setQuestion("");
  };

  // Hide chat when demo overlay is open OR on menu-demo page OR when user scrolls near footer
  if (isDemoOpen || location.pathname === '/menu-demo' || isNearFooter) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open ? (
        <div className="w-[340px] bg-[#2C1E1A]/95 backdrop-blur-xl border border-[#FFD382]/30 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#FFD382]/30 bg-[#2C1E1A] text-[#FFD382] font-semibold text-sm">
            <div className="flex items-center gap-2">
              <FaRobot />
              Klantenservice
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-[#FFD382] hover:text-red-400 transition"
              aria-label="Sluit"
            >
              <FaTimes />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex justify-around border-b border-[#FFD382]/30 text-sm font-medium bg-[#2C1E1A]/70">
            {[
              { id: "form", icon: <FaQuestionCircle />, label: "Vraag" },
              { id: "email", icon: <FaEnvelope />, label: "E-mail" },
              { id: "whatsapp", icon: <FaWhatsapp />, label: "WhatsApp" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`flex-1 py-2 flex items-center justify-center gap-1 transition ${
                  activeTab === tab.id
                    ? "text-[#2C1E1A] bg-[#FFD382]"
                    : "text-[#FFD382]/80"
                }`}
                onClick={() => {
                  setActiveTab(tab.id as typeof activeTab);
                  setResponse("");
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Inhoud */}
          <div className="p-4 text-sm text-[#FFD382] bg-[#2C1E1A]/90">
            {activeTab === "form" && (
              <form onSubmit={handleAsk} className="space-y-3">
                <textarea
                  placeholder="Stel je vraag hier..."
                  rows={3}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-[#FFD382]/30 bg-[#3A2B24] text-[#FFD382] placeholder:text-[#FFD382]/60 resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-[#FFD382] hover:bg-[#E6C26B] text-[#2C1E1A] py-2 rounded-md font-medium transition"
                >
                  Verstuur
                </button>
                {response && (
                  <div className="bg-[#3A2B24] mt-3 p-3 rounded-md text-[#FFD382] border border-[#FFD382]/30 shadow-inner animate-fade-in">
                    <strong>AI antwoord:</strong>
                    <p className="mt-1">{response}</p>
                  </div>
                )}
              </form>
            )}

            {activeTab === "email" && (
              <div className="text-center py-6">
                <p className="mb-2">Stuur ons een e-mail:</p>
                <a
                  href="mailto:info@tabletech.nl"
                  className="text-[#FFD382] font-medium underline hover:text-[#E6C26B]"
                >
                  info@tabletech.nl
                </a>
              </div>
            )}

            {activeTab === "whatsapp" && (
              <div className="text-center py-6">
                <p className="mb-2">WhatsApp ons op:</p>
                <a
                  href="https://wa.me/31853030723"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 font-semibold underline hover:text-green-300"
                >
                  +31 85 303 07 23
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-[#2C1E1A]/90 hover:bg-[#2C1E1A] border border-[#FFD382]/30 text-[#FFD382] rounded-full p-3 shadow-lg flex items-center justify-center transition backdrop-blur-sm"
          aria-label="Open support"
        >
          <FaComments size={18} />
        </button>
      )}
    </div>
  );
};
export default SupportChat;
