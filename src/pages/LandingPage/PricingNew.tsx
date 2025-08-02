import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

// Pricing tiers data
const pricingTiers = [
  {
    id: "gratis",
    name: "Gratis",
    icon: "🟢",
    tagline: "Perfect om te starten",
    monthlyFee: "€0",
    transactionFee: "1,5%",
    color: "green",
    features: {
      "Bestellen via QR": true,
      "Direct online betalen": true,
      "Digitale bon voor klant": true,
      "Keuken ontvangt bestellingen live": true,
      "Eigen menukaart, foto's & logo": true,
      "Inclusief tablet voor keuken": false,
      "Bestellingen aanpassen in keuken": false,
      "Fooien aanzetten bij afrekenen": false,
      "Inzicht in verkoop & omzet": false,
      "Eigen themes": false,
      "Factuur met je eigen BTW-gegevens": false,
      "Instellingen aanpassen zelf": false,
      "Prioriteit bij support": false
    }
  },
  {
    id: "groei",
    name: "Groei",
    icon: "🔵",
    tagline: "Groei zonder zorgen",
    monthlyFee: "€49,99",
    transactionFee: "0,5%",
    color: "blue",
    popular: true,
    features: {
      "Bestellen via QR": true,
      "Direct online betalen": true,
      "Digitale bon voor klant": true,
      "Keuken ontvangt bestellingen live": true,
      "Eigen menukaart, foto's & logo": true,
      "Inclusief tablet voor keuken": false,
      "Bestellingen aanpassen in keuken": true,
      "Fooien aanzetten bij afrekenen": true,
      "Inzicht in verkoop & omzet": true,
      "Eigen themes": false,
      "Factuur met je eigen BTW-gegevens": false,
      "Instellingen aanpassen zelf": false,
      "Prioriteit bij support": false
    }
  },
  {
    id: "pro",
    name: "Pro",
    icon: "🟣",
    tagline: "Voor professionals",
    monthlyFee: "€99",
    transactionFee: "0%",
    color: "purple",
    features: {
      "Bestellen via QR": true,
      "Direct online betalen": true,
      "Digitale bon voor klant": true,
      "Keuken ontvangt bestellingen live": true,
      "Eigen menukaart, foto's & logo": true,
      "Inclusief tablet voor keuken": true,
      "Bestellingen aanpassen in keuken": true,
      "Fooien aanzetten bij afrekenen": true,
      "Inzicht in verkoop & omzet": true,
      "Eigen themes": true,
      "Factuur met je eigen BTW-gegevens": true,
      "Instellingen aanpassen zelf": true,
      "Prioriteit bij support": false
    }
  },
  {
    id: "ultimate",
    name: "Ultimate",
    icon: "🔶",
    tagline: "Alles inclusief",
    monthlyFee: "€199",
    transactionFee: "0%",
    color: "orange",
    features: {
      "Bestellen via QR": true,
      "Direct online betalen": true,
      "Digitale bon voor klant": true,
      "Keuken ontvangt bestellingen live": true,
      "Eigen menukaart, foto's & logo": true,
      "Inclusief tablet voor keuken": true,
      "Bestellingen aanpassen in keuken": true,
      "Fooien aanzetten bij afrekenen": true,
      "Inzicht in verkoop & omzet": true,
      "Eigen themes": true,
      "Factuur met je eigen BTW-gegevens": true,
      "Instellingen aanpassen zelf": true,
      "Prioriteit bij support": true
    }
  }
];

// Feature list order
const featureOrder = [
  "Bestellen via QR",
  "Direct online betalen",
  "Digitale bon voor klant",
  "Keuken ontvangt bestellingen live",
  "Eigen menukaart, foto's & logo",
  "Bestellingen aanpassen in keuken",
  "Fooien aanzetten bij afrekenen",
  "Inzicht in verkoop & omzet",
  "Inclusief tablet voor keuken",
  "Eigen themes",
  "Factuur met je eigen BTW-gegevens",
  "Instellingen aanpassen zelf",
  "Prioriteit bij support"
];

export const PricingNew: React.FC = () => {
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const colorClasses = {
    green: {
      bg: "from-[#4A372E]/20 to-[#5A4438]/20",
      border: "border-[#7A5A48]/30",
      glow: "shadow-[#7A5A48]/25",
      text: "text-[#D4B896]",
      headerBg: "from-[#5A4438]/30 to-[#6A5442]/30"
    },
    blue: {
      bg: "from-[#3A2B24]/20 to-[#4A372E]/20",
      border: "border-[#E86C28]/30",
      glow: "shadow-[#E86C28]/25",
      text: "text-[#E86C28]",
      headerBg: "from-[#E86C28]/20 to-[#C3561D]/20"
    },
    purple: {
      bg: "from-[#4A372E]/20 to-[#5A4438]/20",
      border: "border-[#C3561D]/30",
      glow: "shadow-[#C3561D]/25",
      text: "text-[#F4A460]",
      headerBg: "from-[#5A4438]/30 to-[#6A5442]/30"
    },
    orange: {
      bg: "from-[#E86C28]/20 to-[#C3561D]/20",
      border: "border-[#E86C28]/30",
      glow: "shadow-[#E86C28]/25",
      text: "text-[#FFB366]",
      headerBg: "from-[#E86C28]/30 to-[#C3561D]/30"
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#2C1E1A] via-[#3A2B24] to-[#2C1E1A] py-16 px-4 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#E86C28] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#C3561D] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-[#7A5A48] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Kies jouw <span className="bg-gradient-to-r from-[#E86C28] to-[#FFB366] bg-clip-text text-transparent">Table Tech</span> pakket
          </h1>
          <p className="text-xl text-[#D4B896] max-w-3xl mx-auto">
            Transparante prijzen voor elk type restaurant. Start gratis en groei op jouw tempo.
          </p>
        </motion.div>

        {/* Main pricing table container */}
        <motion.div 
          ref={tableRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="backdrop-blur-xl bg-[#3A2B24]/30 rounded-3xl border border-[#4A372E]/50 shadow-2xl overflow-hidden"
        >
          {/* Desktop view */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="sticky left-0 z-20 backdrop-blur-xl bg-[#2C1E1A]/80 border-r border-[#4A372E]/30 w-48"></th>
                  {pricingTiers.map((tier) => {
                    const colors = colorClasses[tier.color as keyof typeof colorClasses];
                    return (
                      <th 
                        key={tier.id} 
                        className="relative p-0"
                        onMouseEnter={() => setHoveredTier(tier.id)}
                        onMouseLeave={() => setHoveredTier(null)}
                      >
                        <div className={`
                          relative p-6 backdrop-blur-xl bg-gradient-to-b ${colors.headerBg} 
                          border-b ${colors.border} transition-all duration-300
                          ${hoveredTier === tier.id ? 'shadow-lg shadow-[#E86C28]/10' : ''}
                          ${tier.popular ? 'ring-2 ring-[#E86C28]/50' : ''}
                        `}>
                          <div className="text-center">
                            <div className="text-4xl mb-2">{tier.icon}</div>
                            <h3 className="text-2xl font-bold text-white mb-1">{tier.name}</h3>
                            <p className={`text-sm ${colors.text}`}>{tier.tagline}</p>
                            <div className="mt-4">
                              <div className="text-3xl font-bold text-white">{tier.monthlyFee}</div>
                              <div className="text-sm text-[#D4B896]">/maand</div>
                              <div className={`text-xs mt-1 ${colors.text} font-medium`}>
                                + {tier.transactionFee} per transactie
                              </div>
                            </div>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {featureOrder.map((feature, index) => (
                  <tr key={feature} className={`border-b border-[#4A372E]/20 ${index % 2 === 0 ? 'bg-[#3A2B24]/10' : ''}`}>
                    <td className="sticky left-0 z-10 px-4 py-4 text-sm font-medium text-[#D4B896] backdrop-blur-xl bg-[#2C1E1A]/80 border-r border-[#4A372E]/30 w-48">
                      {feature}
                    </td>
                    {pricingTiers.map((tier) => {
                      const colors = colorClasses[tier.color as keyof typeof colorClasses];
                      const hasFeature = tier.features[feature as keyof typeof tier.features];
                      return (
                        <td 
                          key={`${tier.id}-${feature}`} 
                          className={`px-6 py-4 text-center transition-all duration-300 ${
                            hoveredTier === tier.id ? 'bg-[#4A372E]/10' : ''
                          }`}
                        >
                          {hasFeature ? (
                            <Check className={`w-6 h-6 ${colors.text} mx-auto`} />
                          ) : (
                            <X className="w-6 h-6 text-[#4A372E] mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile view - vertical stacked cards */}
          <div className="lg:hidden">
            <div className="space-y-6 px-4">
              {pricingTiers.map((tier) => {
                const colors = colorClasses[tier.color as keyof typeof colorClasses];
                return (
                  <div key={tier.id} className="w-full">
                    <div className={`
                      backdrop-blur-xl bg-gradient-to-b ${colors.bg} 
                      rounded-2xl border ${colors.border} overflow-hidden
                      ${tier.popular ? 'ring-2 ring-[#E86C28]/50' : ''}
                    `}>
                      <div className="p-6">
                        <div className="text-center mb-6">
                          <div className="text-4xl mb-2">{tier.icon}</div>
                          <h3 className="text-2xl font-bold text-white mb-1">{tier.name}</h3>
                          <p className={`text-sm ${colors.text}`}>{tier.tagline}</p>
                          <div className="mt-4">
                            <div className="text-3xl font-bold text-white">{tier.monthlyFee}</div>
                            <div className="text-sm text-[#D4B896]">/maand</div>
                            <div className={`text-xs mt-1 ${colors.text} font-medium`}>
                              + {tier.transactionFee} per transactie
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {featureOrder.map((feature) => {
                            const hasFeature = tier.features[feature as keyof typeof tier.features];
                            return (
                              <div key={feature} className="flex items-center justify-between text-sm">
                                <span className="text-[#D4B896]">{feature}</span>
                                {hasFeature ? (
                                  <Check className={`w-5 h-5 ${colors.text} flex-shrink-0`} />
                                ) : (
                                  <X className="w-5 h-5 text-[#4A372E] flex-shrink-0" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </motion.div>


      </div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};