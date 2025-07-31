import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Star, ChevronDown, ChevronUp, Info, ArrowRight, Zap, Shield, Clock, Truck, Package } from "lucide-react";
import achtergrond2 from "../../assets/afbeeldingen/achtergrond2.png";

// Pricing tiers data
const pricingTiers = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Betaal-naar-gebruik",
    monthlyFee: "€0",
    perTxnMarkup: "0.9% + €0.10",
    hardware: {
      trial: "1 keuken tablet geleend tijdens proefperiode",
      afterTrial: "Eigen tablet of huur via HaaS (€9/mnd)"
    },
    features: [
      "Basis menu editor",
      "1 actief apparaat",
      "Digitale bonnen",
      "In-app ondersteuning"
    ],
    popular: false,
    color: "blue",
    expandedNote: "Opslag wordt toegevoegd bovenop Mollie/PSP kosten"
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "Meest Populair",
    monthlyFee: "€49",
    annualFee: "€499",
    perTxnMarkup: "0.35% + €0.05",
    hardware: {
      included: "Tot 3 tablets inbegrepen via HaaS",
      warranty: "Omruil garantie"
    },
    features: [
      "Alles in Starter +",
      "POS/printer integratie²",
      "Tafel tabs",
      "Fooi prompts",
      "Eenvoudig loyaliteitsprogramma",
      "Verkoop & fooi analyses",
      "Eigen domein"
    ],
    popular: true,
    color: "green",
    expandedNote: "²Locaties leveren eigen printers (Epson/Star LAN of USB)"
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Enterprise Klaar",
    monthlyFee: "€99",
    annualFee: "€999",
    perTxnMarkup: "€0",
    hardware: {
      included: "Onbeperkt tablets via HaaS",
      warranty: "Prioriteit vervangingen"
    },
    features: [
      "Alles in Growth +",
      "Geavanceerde analyses",
      "Multi-locatie dashboard",
      "API & webhooks",
      "White-label branding",
      "Prioriteit SLA"
    ],
    popular: false,
    color: "purple"
  }
];

// Free trial flow steps
const trialSteps = [
  {
    step: 1,
    title: "Aanmelden",
    description: "Locatie voert SEPA machtiging of kaart in (geen kosten vandaag)",
    icon: "📝"
  },
  {
    step: 2,
    title: "Levering",
    description: "Ontvang 10″ Android tablet (vooraf ingesteld in kiosk modus) + QR stickers de volgende dag",
    icon: "📦"
  },
  {
    step: 3,
    title: "Proefperiode gebruik",
    description: "Volledige toegang tot Growth functies gedurende 30 dagen",
    icon: "🚀"
  },
  {
    step: 4,
    title: "Automatisch overstappen op Dag 31",
    description: "Standaard naar Growth tenzij gedowngraded naar Starter",
    icon: "✅"
  },
  {
    step: 5,
    title: "Annuleren & retourneren",
    description: "Annuleer op elk moment vanuit dashboard → vooraf betaald retourlabel automatisch gegenereerd",
    icon: "📮"
  },
  {
    step: 6,
    title: "Tablet houden",
    description: "Alleen als abonnement doorgaat of koop het voor €99",
    icon: "📱"
  }
];

const PricingCard: React.FC<{
  tier: typeof pricingTiers[0];
  isAnnual: boolean;
  onSelectPlan: (tierId: string) => void;
  onCompareFeatures: () => void;
}> = ({ tier, isAnnual, onSelectPlan, onCompareFeatures }) => {
  const [showHaaSOption, setShowHaaSOption] = useState(false);

  const getPrice = () => {
    if (tier.id === "starter") return tier.monthlyFee;
    return isAnnual && tier.annualFee 
      ? `€${parseInt(tier.annualFee.replace('€', '')) / 12}/mo` 
      : tier.monthlyFee;
  };

  const getBillingNote = () => {
    if (tier.id === "starter") return "per locatie";
    return isAnnual && tier.annualFee 
      ? `Jaarlijks gefactureerd (${tier.annualFee}/jaar)` 
      : "per maand per locatie";
  };

  const colorClasses = {
    blue: {
      border: "border-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
      badge: "bg-blue-100 text-blue-800"
    },
    green: {
      border: "border-green-500",
      bg: "bg-green-50", 
      text: "text-green-600",
      button: "bg-green-600 hover:bg-green-700",
      badge: "bg-green-100 text-green-800"
    },
    purple: {
      border: "border-purple-500",
      bg: "bg-purple-50",
      text: "text-purple-600", 
      button: "bg-purple-600 hover:bg-purple-700",
      badge: "bg-purple-100 text-purple-800"
    }
  };

  const colors = colorClasses[tier.color as keyof typeof colorClasses];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-3xl bg-white shadow-2xl border-2 ${
        tier.popular ? 'border-green-500 ring-4 ring-green-500/20 transform scale-105' : 'border-gray-200'
      } hover:shadow-3xl transition-all duration-300 overflow-hidden`}
    >
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 shadow-lg">
            <Star className="w-4 h-4 fill-current" />
            Meest Populair
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{tier.name}</h3>
          <p className={`text-xs ${colors.text} font-medium`}>{tier.tagline}</p>
        </div>

        {/* Pricing */}
        <div className="text-center mb-4">
          <div className="flex items-baseline justify-center mb-1">
            <span className="text-3xl font-bold text-gray-900">{getPrice()}</span>
            {tier.id !== "starter" && (
              <span className="ml-1 text-sm text-gray-600 font-medium">/mnd</span>
            )}
          </div>
          <p className="text-xs text-gray-600 font-medium">{getBillingNote()}</p>
        </div>

        {/* Transaction Fee */}
        <div className={`${colors.bg} rounded-lg p-3 mb-4`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-800">Per transactie:</span>
            <span className={`text-sm font-bold ${colors.text}`}>{tier.perTxnMarkup}</span>
          </div>
          {tier.expandedNote && (
            <p className="text-xs text-gray-600 italic mt-1">¹{tier.expandedNote}</p>
          )}
        </div>

        {/* Hardware */}
        <div className="mb-4 bg-gray-50 rounded-lg p-3">
          <h4 className="text-xs font-bold text-gray-800 mb-2">Hardware:</h4>
          {tier.hardware.trial ? (
            <div className="space-y-1">
              <p className="text-xs text-gray-700">• {tier.hardware.trial}</p>
              <p className="text-xs text-gray-700">• {tier.hardware.afterTrial}</p>
              {tier.id === "starter" && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showHaaSOption}
                      onChange={(e) => setShowHaaSOption(e.target.checked)}
                      className="w-3 h-3 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-xs text-gray-800">Voeg tablet toe (€9/mnd)</span>
                  </label>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-xs text-gray-700">• {tier.hardware.included}</p>
              <p className="text-xs text-gray-700">• {tier.hardware.warranty}</p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-gray-800 mb-2">Functies:</h4>
          <ul className="space-y-1.5">
            {tier.features.slice(0, 4).map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className={`w-3 h-3 ${colors.text} mt-0.5 flex-shrink-0`} />
                <span className="ml-2 text-xs text-gray-700 leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
          {tier.features.length > 4 && (
            <button
              onClick={onCompareFeatures}
              className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium underline"
            >
              + {tier.features.length - 4} meer
            </button>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onSelectPlan(tier.id)}
          className={`w-full py-3 px-4 rounded-lg font-bold text-white text-sm ${colors.button} transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg`}
        >
          Kies {tier.name}
        </button>

        {/* Compare link */}
        <button
          onClick={onCompareFeatures}
          className="w-full mt-3 py-2 text-xs text-gray-600 hover:text-gray-800 font-medium flex items-center justify-center gap-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
        >
          <Info className="w-3 h-3" />
          Vergelijk Functies
        </button>
      </div>
    </motion.div>
  );
};

const FreeTrialSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="backdrop-blur-2xl border-2 border-[#A77B5D]/40 rounded-3xl shadow-[0_8px_32px_rgba(123,79,53,0.12)] backdrop-saturate-150 p-5 md:p-6"
      style={{
        background: 'linear-gradient(135deg, rgba(123,79,53,0.25) 0%, rgba(94,59,41,0.18) 100%)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)'
      }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
            🟩
          </div>
          <div>
            <h3 className="text-lg font-bold text-white drop-shadow-lg">
              Risicovrije 30-dagen proefperiode – tablet & installatie inbegrepen
            </h3>
            <p className="text-white/80 mt-0.5 text-sm">Ontdek hoe onze gratis proefperiode werkt</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-white/60" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white/60" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-5 overflow-hidden"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {trialSteps.map((step, index) => (
                <div key={step.step} className="relative">
                  {index < trialSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-green-200/30 -translate-x-1/2" />
                  )}
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm">
                    <div className="flex items-start gap-2">
                      <div className="text-lg">{step.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                            Stap {step.step}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 text-xs mb-1">
                          {step.title}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid md:grid-cols-3 gap-3">
              <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2 border border-green-400/30">
                <Truck className="w-6 h-6 text-green-300" />
                <div>
                  <p className="font-semibold text-white text-sm">Volgende dag levering</p>
                  <p className="text-xs text-white/80">Tablet komt geconfigureerd aan</p>
                </div>
              </div>
              <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2 border border-green-400/30">
                <Shield className="w-6 h-6 text-green-300" />
                <div>
                  <p className="font-semibold text-white text-sm">Geen risico</p>
                  <p className="text-xs text-white/80">Annuleer op elk moment, gratis retour</p>
                </div>
              </div>
              <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2 border border-green-400/30">
                <Clock className="w-6 h-6 text-green-300" />
                <div>
                  <p className="font-semibold text-white text-sm">30 volle dagen</p>
                  <p className="text-xs text-white/80">Ervaar alle functies</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FeatureComparisonModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const features = [
    { feature: "Basis menu editor", starter: true, growth: true, pro: true },
    { feature: "Digitale bonnen", starter: true, growth: true, pro: true },
    { feature: "In-app ondersteuning", starter: true, growth: true, pro: true },
    { feature: "POS/printer integratie", starter: false, growth: true, pro: true },
    { feature: "Tafel tabs", starter: false, growth: true, pro: true },
    { feature: "Fooi prompts", starter: false, growth: true, pro: true },
    { feature: "Eenvoudig loyaliteitsprogramma", starter: false, growth: true, pro: true },
    { feature: "Verkoop & fooi analyses", starter: false, growth: true, pro: true },
    { feature: "Eigen domein", starter: false, growth: true, pro: true },
    { feature: "Geavanceerde analyses", starter: false, growth: false, pro: true },
    { feature: "Multi-locatie dashboard", starter: false, growth: false, pro: true },
    { feature: "API & webhooks", starter: false, growth: false, pro: true },
    { feature: "White-label branding", starter: false, growth: false, pro: true },
    { feature: "Prioriteit SLA", starter: false, growth: false, pro: true },
    { feature: "Actieve apparaten", starter: "1", growth: "Tot 3", pro: "Onbeperkt" },
    { feature: "Hardware garantie", starter: false, growth: "Omruil", pro: "Prioriteit" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Functies Vergelijking</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-auto max-h-96">
          <table className="w-full">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-4 px-4 font-bold text-gray-900 text-base">Functies</th>
                <th className="text-center py-4 px-4 font-bold text-gray-900 text-base">
                  <div className="bg-blue-50 rounded-lg p-2">
                    Starter
                  </div>
                </th>
                <th className="text-center py-4 px-4 font-bold text-gray-900 text-base">
                  <div className="bg-green-50 rounded-lg p-2 border-2 border-green-500">
                    <div className="flex items-center justify-center gap-1">
                      Growth
                      <Star className="w-4 h-4 text-green-500 fill-current" />
                    </div>
                  </div>
                </th>
                <th className="text-center py-4 px-4 font-bold text-gray-900 text-base">
                  <div className="bg-purple-50 rounded-lg p-2">
                    Pro
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-gray-800 font-medium text-sm">{item.feature}</td>
                  <td className="py-4 px-4 text-center">
                    {typeof item.starter === 'boolean' ? (
                      item.starter ? (
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                          <X className="w-5 h-5 text-gray-400" />
                        </div>
                      )
                    ) : (
                      <span className="text-sm text-gray-700 font-medium bg-gray-100 px-2 py-1 rounded">{item.starter}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {typeof item.growth === 'boolean' ? (
                      item.growth ? (
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                          <X className="w-5 h-5 text-gray-400" />
                        </div>
                      )
                    ) : (
                      <span className="text-sm text-gray-700 font-medium bg-green-100 px-2 py-1 rounded">{item.growth}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {typeof item.pro === 'boolean' ? (
                      item.pro ? (
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                          <X className="w-5 h-5 text-gray-400" />
                        </div>
                      )
                    ) : (
                      <span className="text-sm text-gray-700 font-medium bg-purple-100 px-2 py-1 rounded">{item.pro}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200 hover:scale-105"
            >
              Sluiten
            </button>
            <button className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all duration-200 hover:scale-105 shadow-lg">
              Start 30-Dagen Gratis Proefperiode
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const PricingSectionB2B: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const handleSelectPlan = (tierId: string) => {
    console.log(`Selected plan: ${tierId}`);
    // Handle plan selection - could redirect to signup with plan preselected
  };

  return (
    <section
      id="pricing"
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat py-16"
      style={{ backgroundImage: `url(${achtergrond2})` }}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2C1E1A]/20 via-[#7b4f35]/10 to-[#2C1E1A]/30 z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-1 rounded-full mb-2 backdrop-blur-sm border border-[#D4C0AC]/60 shadow-[0_2px_8px_rgba(212,192,172,0.4)]"
            style={{
              background: 'linear-gradient(90deg, rgba(123,79,53,1) 0%, rgba(167,123,93,0.9) 100%)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
          />
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
            Eenvoudige, transparante prijzen
          </h1>
          <p className="text-base text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Kies het plan dat bij uw locatie past. Alle plannen bevatten tablet-gebaseerd bestellen.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-6">
          <div className="backdrop-blur-2xl border-2 border-[#A77B5D]/40 rounded-xl shadow-[0_8px_32px_rgba(123,79,53,0.12)] backdrop-saturate-150 p-3"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)'
            }}
          >
            <div className="flex items-center space-x-3">
              <span className={`text-sm font-semibold transition-all duration-200 ${!isAnnual ? 'text-white drop-shadow-lg' : 'text-white/60'}`}>
                Maandelijks
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400/30 ${
                  isAnnual ? 'bg-green-500' : 'bg-white/30'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 shadow-lg ${
                    isAnnual ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-semibold transition-all duration-200 ${isAnnual ? 'text-white drop-shadow-lg' : 'text-white/60'}`}>
                Jaarlijks
                <span className="ml-1 text-xs bg-green-400 text-green-900 px-1.5 py-0.5 rounded-full font-bold">
                  Bespaar 15%
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {pricingTiers.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              isAnnual={isAnnual}
              onSelectPlan={handleSelectPlan}
              onCompareFeatures={() => setShowComparison(true)}
            />
          ))}
        </div>

        {/* Free Trial Section */}
        <div className="mb-12">
          <FreeTrialSection />
        </div>


        {/* Feature Comparison Modal */}
        <FeatureComparisonModal 
          isOpen={showComparison} 
          onClose={() => setShowComparison(false)} 
        />
      </div>
    </section>
  );
};