import React, { useState } from "react";
import { FaEnvelope, FaWhatsapp, FaComments, FaTimes, FaRobot, FaQuestionCircle } from "react-icons/fa";

export const SupportChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "email" | "whatsapp">("form");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Simuleer AI-reactie
    setResponse("Dankjewel voor je vraag! We nemen zo snel mogelijk contact met je op of je krijgt direct antwoord van onze slimme assistent.");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-[340px] bg-white/80 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/30 bg-white/60">
            <div className="flex items-center gap-2 font-semibold text-blue-800 text-sm">
              <FaRobot />
              Klantenservice
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-600 hover:text-red-500"
              aria-label="Sluit"
            >
              <FaTimes />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex justify-around bg-white/50 border-b border-white/30 text-sm font-medium">
            <button
              className={`flex-1 py-2 flex items-center justify-center gap-1 transition ${
                activeTab === "form" ? "text-blue-600 bg-white" : "text-gray-600"
              }`}
              onClick={() => {
                setActiveTab("form");
                setResponse("");
              }}
            >
              <FaQuestionCircle />
              Vraag
            </button>
            <button
              className={`flex-1 py-2 flex items-center justify-center gap-1 transition ${
                activeTab === "email" ? "text-blue-600 bg-white" : "text-gray-600"
              }`}
              onClick={() => setActiveTab("email")}
            >
              <FaEnvelope />
              E-mail
            </button>
            <button
              className={`flex-1 py-2 flex items-center justify-center gap-1 transition ${
                activeTab === "whatsapp" ? "text-green-600 bg-white" : "text-gray-600"
              }`}
              onClick={() => setActiveTab("whatsapp")}
            >
              <FaWhatsapp />
              WhatsApp
            </button>
          </div>

          {/* Inhoud */}
          <div className="p-4 text-sm text-gray-800">
            {activeTab === "form" && (
              <form onSubmit={handleAsk} className="space-y-3">
                <textarea
                  placeholder="Stel je vraag hier..."
                  rows={3}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-white/40 bg-white/90 placeholder:text-gray-500 resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
                >
                  Verstuur
                </button>
                {response && (
                  <div className="bg-white/80 mt-3 p-3 rounded-md text-gray-700 border border-white/40 shadow-inner">
                    <strong>AI antwoord:</strong>
                    <p className="mt-1">{response}</p>
                  </div>
                )}
              </form>
            )}

            {activeTab === "email" && (
              <div className="text-center py-6">
                <p className="text-sm text-gray-700 mb-2">Stuur ons een e-mail:</p>
                <a
                  href="mailto:info@tabletech.nl"
                  className="text-blue-600 font-medium underline"
                >
                  info@tabletech.nl
                </a>
              </div>
            )}

            {activeTab === "whatsapp" && (
              <div className="text-center py-6">
                <p className="text-sm text-gray-700 mb-2">WhatsApp ons op:</p>
                <span className="text-green-600 font-semibold">-</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition"
          aria-label="Open support"
        >
          <FaComments size={20} />
        </button>
      )}
    </div>
  );
};
