import React, { useState } from "react";
import {
  FaEnvelope,
  FaWhatsapp,
  FaComments,
  FaTimes,
  FaRobot,
  FaQuestionCircle,
} from "react-icons/fa";

export const SupportChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "email" | "whatsapp">("form");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setResponse("Dankjewel voor je vraag! We nemen zo snel mogelijk contact met je op of je krijgt direct antwoord van onze slimme assistent.");
    // Clear the input after submitting so the user can type a new question
    setQuestion("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-[340px] bg-[#f5efe7]/90 backdrop-blur-lg border border-[#d4c0ac] shadow-2xl rounded-2xl overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#d4c0ac] bg-[#f5efe7] text-[#4e3323] font-semibold text-sm">
            <div className="flex items-center gap-2">
              <FaRobot />
              Klantenservice
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-[#4e3323] hover:text-red-500 transition"
              aria-label="Sluit"
            >
              <FaTimes />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex justify-around border-b border-[#d4c0ac] text-sm font-medium bg-[#f5efe7]/70">
            {[
              { id: "form", icon: <FaQuestionCircle />, label: "Vraag" },
              { id: "email", icon: <FaEnvelope />, label: "E-mail" },
              { id: "whatsapp", icon: <FaWhatsapp />, label: "WhatsApp" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`flex-1 py-2 flex items-center justify-center gap-1 transition ${
                  activeTab === tab.id
                    ? "text-[#7b4f35] bg-white"
                    : "text-[#5f4534]"
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
          <div className="p-4 text-sm text-[#3b2a1d] bg-[#fffdfb]">
            {activeTab === "form" && (
              <form onSubmit={handleAsk} className="space-y-3">
                <textarea
                  placeholder="Stel je vraag hier..."
                  rows={3}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-[#d8c4b1] bg-white placeholder:text-gray-500 resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-[#7b4f35] hover:bg-[#5e3b29] text-white py-2 rounded-md font-medium transition"
                >
                  Verstuur
                </button>
                {response && (
                  <div className="bg-[#fff8f3] mt-3 p-3 rounded-md text-[#4e3a2e] border border-[#e4d4c2] shadow-inner animate-fade-in">
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
                  className="text-[#7b4f35] font-medium underline hover:text-[#5e3b29]"
                >
                  info@tabletech.nl
                </a>
              </div>
            )}

            {activeTab === "whatsapp" && (
              <div className="text-center py-6">
                <p className="mb-2">WhatsApp ons op:</p>
                <a
                  href="https://wa.me/31612345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 font-semibold underline hover:text-green-700"
                >
                  +31 6 12345678
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-[#7b4f35] hover:bg-[#5e3b29] text-white rounded-full p-4 shadow-lg flex items-center justify-center transition"
          aria-label="Open support"
        >
          <FaComments size={20} />
        </button>
      )}
    </div>
  );
};
export default SupportChat;
