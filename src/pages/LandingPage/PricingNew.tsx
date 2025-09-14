import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { BorderBeam } from "../../components/BorderBeam";

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
      "Complete menu-inrichting eenmalig": true,
      "Bestellen via QR": true,
      "Keuken ontvangt bestellingen live": true,
      "Eigen menukaart, foto's & logo": true,
      "Inclusief tablet voor keuken": false,
      "Inzicht in verkoop & omzet": false,
      "Eigen themas": false,
      "Volledig op maat gemaakte applicatie": false,
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
      "Complete menu-inrichting eenmalig": true,
      "Bestellen via QR": true,
      "Keuken ontvangt bestellingen live": true,
      "Eigen menukaart, foto's & logo": true,
      "Inclusief tablet voor keuken": false,
      "Inzicht in verkoop & omzet": true,
      "Eigen themas": false,
      "Volledig op maat gemaakte applicatie": false,
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
      "Complete menu-inrichting eenmalig": true,
      "Bestellen via QR": true,
      "Keuken ontvangt bestellingen live": true,
      "Eigen menukaart, foto's & logo": true,
      "Inclusief tablet voor keuken": true,
      "Inzicht in verkoop & omzet": true,
      "Eigen themas": true,
      "Aangepaste QR-standaards & tafelbordje": true,
      "Volledig op maat gemaakte applicatie": false,
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
      "Complete menu-inrichting eenmalig": true,
      "Bestellen via QR": true,
      "Keuken ontvangt bestellingen live": true,
      "Eigen menukaart, foto's & logo": true,
      "Inclusief tablet voor keuken": true,
      "Inzicht in verkoop & omzet": true,
      "Eigen themas": true,
      "Aangepaste QR-standaards & tafelbordje": true,
      "Volledig op maat gemaakte applicatie": true,
      "Prioriteit bij support": true
    }
  }
];

// Feature list order
const featureOrder = [
  "Complete menu-inrichting eenmalig",
  "Bestellen via QR",
  "Keuken ontvangt bestellingen live",
  "Eigen menukaart, foto's & logo",
  "Inzicht in verkoop & omzet",
  "Inclusief tablet voor keuken",
  "Eigen themas",
  "Aangepaste QR-standaards & tafelbordje",
  "Volledig op maat gemaakte applicatie",
  "Prioriteit bij support"
];

export const PricingNew = () => {
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);
  const tableRef = useRef(null);

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
    <section className="relative min-h-screen bg-gradient-to-b from-[#2C1E1A] via-[#3A2B24] to-[#2C1E1A] overflow-hidden"
             style={{
               padding: 'clamp(2rem, 8vh, 4rem) clamp(1rem, 4vw, 2rem)'
             }}>
      {/* Smooth transition from ContainerScroll */}
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C1E1A] to-transparent"></div>
      </div>
      
      {/* Background removed for cleaner look */}

      <div className="max-w-5xl mx-auto relative z-10 px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mx-auto"
          style={{ marginBottom: 'clamp(3rem, 8vh, 5rem)' }}
        >
          <h1 className="font-bold text-white"
              style={{
                fontSize: 'clamp(1.5rem, 4.5vw, 2.5rem)',
                marginBottom: 'clamp(1.5rem, 4vh, 2.5rem)',
                lineHeight: '1.3'
              }}>
            Kies jouw <span className="bg-gradient-to-r from-[#E86C28] to-[#FFB366] bg-clip-text text-transparent">TableTech</span> pakket
          </h1>
          <p className="text-[#D4B896] mx-auto"
             style={{
               fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
               maxWidth: 'min(80vw, 500px)',
               lineHeight: '1.7'
             }}>
            Transparante prijzen voor elk type restaurant. Start gratis en groei op jouw tempo.
          </p>
        </motion.div>

        {/* Main pricing table container */}
        <motion.div 
          ref={tableRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative backdrop-blur-xl bg-[#3A2B24]/30 border border-[#4A372E]/50 shadow-2xl overflow-hidden"
          style={{
            borderRadius: 'clamp(1rem, 3vw, 1.5rem)',
            maxWidth: '100%',
            width: '100%'
          }}
        >
          {/* BorderBeam animation */}
          <BorderBeam 
            size={250}
            duration={12}
            borderWidth={2}
            anchor={90}
            colorFrom="#E86C28"
            colorTo="#FFB366"
            delay={0}
          />
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
                              <div className="flex items-baseline justify-center gap-1">
                                <span className="text-3xl font-bold text-white">{tier.monthlyFee}</span>
                                {tier.monthlyFee !== "€0" && <span className="text-sm text-[#D4B896]">/maand</span>}
                              </div>
                              {tier.monthlyFee !== "€0" && (
                                <div className="text-xs text-[#D4B896]/80 mt-1">excl. BTW</div>
                              )}
                              {tier.monthlyFee === "€0" && (
                                <div className="text-lg font-semibold text-[#D4B896] mt-1">Voor altijd gratis</div>
                              )}
                              {tier.monthlyFee === "€49,99" && (
                                <div className="text-lg font-semibold text-[#D4B896] mt-1">of €499 per jaar</div>
                              )}
                              {tier.monthlyFee === "€99" && (
                                <div className="text-lg font-semibold text-[#D4B896] mt-1">of €999 per jaar</div>
                              )}
                              {tier.monthlyFee === "€199" && (
                                <div className="text-lg font-semibold text-[#D4B896] mt-1">of €1999 per jaar</div>
                              )}
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
                {featureOrder.map((feature) => (
                  <tr key={feature} className="border-b border-[#4A372E]/20">
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
            <div style={{
              gap: 'clamp(1rem, 4vw, 1.5rem)',
              display: 'flex',
              flexDirection: 'column',
              padding: 'clamp(1rem, 4vw, 1.5rem)'
            }}>
              {pricingTiers.map((tier) => {
                const colors = colorClasses[tier.color as keyof typeof colorClasses];
                return (
                  <div key={tier.id} className="w-full">
                    <div className={`
                      relative backdrop-blur-xl bg-gradient-to-b ${colors.bg} 
                      rounded-2xl border ${colors.border} overflow-hidden
                      ${tier.popular ? 'ring-2 ring-[#E86C28]/50' : ''}
                    `}>
                      {/* BorderBeam for each card */}
                      <BorderBeam 
                        size={200}
                        duration={10 + pricingTiers.indexOf(tier) * 2}
                        borderWidth={1.5}
                        anchor={90}
                        colorFrom={tier.color === 'green' ? '#7A5A48' : tier.color === 'blue' ? '#E86C28' : tier.color === 'purple' ? '#C3561D' : '#E86C28'}
                        colorTo={tier.color === 'green' ? '#D4B896' : tier.color === 'blue' ? '#FFB366' : tier.color === 'purple' ? '#F4A460' : '#FFB366'}
                        delay={pricingTiers.indexOf(tier) * 0.5}
                      />
                      <div style={{ padding: 'clamp(1rem, 5vw, 1.5rem)' }}>
                        <div className="text-center"
                             style={{ marginBottom: 'clamp(1rem, 4vw, 1.5rem)' }}>
                          <div style={{ fontSize: 'clamp(2rem, 8vw, 2.5rem)', marginBottom: 'clamp(0.5rem, 2vw, 1rem)' }}>{tier.icon}</div>
                          <h3 className="font-bold text-white"
                              style={{ fontSize: 'clamp(1.2rem, 5vw, 1.5rem)', marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)' }}>{tier.name}</h3>
                          <p className={colors.text}
                             style={{ fontSize: 'clamp(0.8rem, 3vw, 1rem)' }}>{tier.tagline}</p>
                          <div style={{ marginTop: 'clamp(1rem, 3vw, 1.5rem)' }}>
                            <div className="flex items-baseline justify-center gap-1">
                              <span className="font-bold text-white"
                                    style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)' }}>{tier.monthlyFee}</span>
                              {tier.monthlyFee !== "€0" && <span className="text-[#D4B896]"
                                                                         style={{ fontSize: 'clamp(0.8rem, 3vw, 1rem)' }}>/maand</span>}
                            </div>
                            {tier.monthlyFee !== "€0" && (
                              <div className="text-xs text-[#D4B896]/80 mt-1">excl. BTW</div>
                            )}
                            {tier.monthlyFee === "€0" && (
                              <div className="text-lg font-semibold text-[#D4B896] mt-1">Voor altijd gratis</div>
                            )}
                            {tier.monthlyFee === "€49,99" && (
                              <div className="text-lg font-semibold text-[#D4B896] mt-1">of €499 per jaar</div>
                            )}
                            {tier.monthlyFee === "€99" && (
                              <div className="text-lg font-semibold text-[#D4B896] mt-1">of €999 per jaar</div>
                            )}
                            {tier.monthlyFee === "€199" && (
                              <div className="text-lg font-semibold text-[#D4B896] mt-1">of €1999 per jaar</div>
                            )}
                            <div className={`text-xs mt-1 ${colors.text} font-medium`}>
                              + {tier.transactionFee} per transactie
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
                          {featureOrder.map((feature) => {
                            const hasFeature = tier.features[feature as keyof typeof tier.features];
                            return (
                              <div key={feature} className="flex items-center justify-between"
                                   style={{ fontSize: 'clamp(0.8rem, 3vw, 1rem)' }}>
                                <span className="text-[#D4B896]">{feature}</span>
                                {hasFeature ? (
                                  <Check className={`${colors.text} flex-shrink-0`}
                                         style={{ width: 'clamp(16px, 4vw, 20px)', height: 'clamp(16px, 4vw, 20px)' }} />
                                ) : (
                                  <X className="text-[#4A372E] flex-shrink-0"
                                     style={{ width: 'clamp(16px, 4vw, 20px)', height: 'clamp(16px, 4vw, 20px)' }} />
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
      
      {/* Compact fade transition to ContactSection */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2C1E1A]/50 to-[#2C1E1A]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#2C1E1A]"></div>
      </div>

      {/* Blob animations removed for better performance */}
    </section>
  );
};