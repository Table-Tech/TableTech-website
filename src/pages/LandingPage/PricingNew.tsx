import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Star, ChevronDown, ChevronUp, Info, ArrowRight, Zap, Shield, Clock, Truck, Package } from "lucide-react";

// Pricing tiers data
const pricingTiers = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Pay-as-you-grow",
    monthlyFee: "€0",
    perTxnMarkup: "0.9% + €0.10",
    hardware: {
      trial: "1 kitchen tablet loaned during trial",
      afterTrial: "Bring Your Own tablet or rent via HaaS (€9/mo)"
    },
    features: [
      "Basic menu editor",
      "1 active device",
      "Digital receipts",
      "In-app support"
    ],
    popular: false,
    color: "blue",
    expandedNote: "Markup is added on top of Mollie/PSP fees"
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "Most Popular",
    monthlyFee: "€49",
    annualFee: "€499",
    perTxnMarkup: "0.35% + €0.05",
    hardware: {
      included: "Up to 3 tablets included via HaaS",
      warranty: "Swap-out warranty"
    },
    features: [
      "Everything in Starter +",
      "POS/printer integration²",
      "Table tabs",
      "Tipping prompts",
      "Simple loyalty",
      "Sales & tip analytics",
      "Custom domain"
    ],
    popular: true,
    color: "green",
    expandedNote: "²Venues supply their own printers (Epson/Star LAN or USB)"
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Enterprise Ready",
    monthlyFee: "€99",
    annualFee: "€999",
    perTxnMarkup: "€0",
    hardware: {
      included: "Unlimited tablets via HaaS",
      warranty: "Priority replacements"
    },
    features: [
      "Everything in Growth +",
      "Advanced analytics",
      "Multi-venue dashboard",
      "API & webhooks",
      "White-label branding",
      "Priority SLA"
    ],
    popular: false,
    color: "purple"
  }
];

// Free trial flow steps
const trialSteps = [
  {
    step: 1,
    title: "Sign-up",
    description: "Venue enters SEPA mandate or card (no charge today)",
    icon: "📝"
  },
  {
    step: 2,
    title: "Delivery",
    description: "Receive 10″ Android tablet (preconfigured in kiosk mode) + QR stickers the next day",
    icon: "📦"
  },
  {
    step: 3,
    title: "Trial usage",
    description: "Full access to Growth features during the 30 days",
    icon: "🚀"
  },
  {
    step: 4,
    title: "Auto-convert on Day 31",
    description: "Default to Growth unless downgraded to Starter",
    icon: "✅"
  },
  {
    step: 5,
    title: "Cancel & return",
    description: "Cancel anytime from dashboard → prepaid return label auto-generated",
    icon: "📮"
  },
  {
    step: 6,
    title: "Keep tablet",
    description: "Only if subscription continues or buy it out for €99",
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
    if (tier.id === "starter") return "per location";
    return isAnnual && tier.annualFee 
      ? `Billed annually (${tier.annualFee}/year)` 
      : "per month per location";
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
      className={`relative rounded-2xl bg-white shadow-xl ${
        tier.popular ? 'ring-2 ring-green-500 transform scale-105' : ''
      } hover:shadow-2xl transition-all duration-300`}
    >
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 shadow-lg">
            <Star className="w-4 h-4 fill-current" />
            Most Popular
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{tier.name}</h3>
          <p className={`text-sm ${colors.text} font-medium`}>{tier.tagline}</p>
        </div>

        {/* Pricing */}
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold text-gray-900">{getPrice()}</span>
            {tier.id !== "starter" && (
              <span className="ml-2 text-sm text-gray-500">/month</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">{getBillingNote()}</p>
        </div>

        {/* Transaction Fee */}
        <div className={`${colors.bg} rounded-lg p-3 mb-6`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Per-transaction fee:</span>
            <span className={`text-sm font-bold ${colors.text}`}>{tier.perTxnMarkup}</span>
          </div>
          {tier.expandedNote && (
            <p className="text-xs text-gray-500 mt-1">¹{tier.expandedNote}</p>
          )}
        </div>

        {/* Hardware */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Hardware Included:</h4>
          {tier.hardware.trial ? (
            <div className="space-y-1">
              <p className="text-sm text-gray-600">• {tier.hardware.trial}</p>
              <p className="text-sm text-gray-600">• {tier.hardware.afterTrial}</p>
              {tier.id === "starter" && (
                <div className="mt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showHaaSOption}
                      onChange={(e) => setShowHaaSOption(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Add tablet via HaaS (€9/mo)</span>
                  </label>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm text-gray-600">• {tier.hardware.included}</p>
              <p className="text-sm text-gray-600">• {tier.hardware.warranty}</p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Features:</h4>
          <ul className="space-y-2">
            {tier.features.slice(0, 5).map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
                <span className="ml-2 text-sm text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
          {tier.features.length > 5 && (
            <button
              onClick={onCompareFeatures}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + {tier.features.length - 5} more features
            </button>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onSelectPlan(tier.id)}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white ${colors.button} transition-all duration-200 hover:scale-105 active:scale-95`}
        >
          Select {tier.name}
        </button>

        {/* Compare link */}
        <button
          onClick={onCompareFeatures}
          className="w-full mt-3 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center justify-center gap-1"
        >
          <Info className="w-4 h-4" />
          Compare Features
        </button>
      </div>
    </motion.div>
  );
};

const FreeTrialSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-green-50 rounded-2xl p-6 md:p-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-2xl">
            🟩
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Risk-free 30-day trial – tablet & setup included
            </h3>
            <p className="text-gray-600 mt-1">Learn how our free trial works</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6 text-gray-400" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 overflow-hidden"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trialSteps.map((step, index) => (
                <div key={step.step} className="relative">
                  {index < trialSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-green-200 -translate-x-1/2" />
                  )}
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{step.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                            Step {step.step}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
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

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="bg-green-100 rounded-lg p-4 flex items-center gap-3">
                <Truck className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Next-day delivery</p>
                  <p className="text-sm text-gray-600">Tablet arrives configured</p>
                </div>
              </div>
              <div className="bg-green-100 rounded-lg p-4 flex items-center gap-3">
                <Shield className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">No risk</p>
                  <p className="text-sm text-gray-600">Cancel anytime, free returns</p>
                </div>
              </div>
              <div className="bg-green-100 rounded-lg p-4 flex items-center gap-3">
                <Clock className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">30 full days</p>
                  <p className="text-sm text-gray-600">Experience all features</p>
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
    { feature: "Basic menu editor", starter: true, growth: true, pro: true },
    { feature: "Digital receipts", starter: true, growth: true, pro: true },
    { feature: "In-app support", starter: true, growth: true, pro: true },
    { feature: "POS/printer integration", starter: false, growth: true, pro: true },
    { feature: "Table tabs", starter: false, growth: true, pro: true },
    { feature: "Tipping prompts", starter: false, growth: true, pro: true },
    { feature: "Simple loyalty", starter: false, growth: true, pro: true },
    { feature: "Sales & tip analytics", starter: false, growth: true, pro: true },
    { feature: "Custom domain", starter: false, growth: true, pro: true },
    { feature: "Advanced analytics", starter: false, growth: false, pro: true },
    { feature: "Multi-venue dashboard", starter: false, growth: false, pro: true },
    { feature: "API & webhooks", starter: false, growth: false, pro: true },
    { feature: "White-label branding", starter: false, growth: false, pro: true },
    { feature: "Priority SLA", starter: false, growth: false, pro: true },
    { feature: "Active devices", starter: "1", growth: "Up to 3", pro: "Unlimited" },
    { feature: "Hardware warranty", starter: false, growth: "Swap-out", pro: "Priority" },
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
            <h2 className="text-2xl font-bold text-gray-900">Feature Comparison</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Features</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Starter</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">
                  <div className="flex items-center justify-center gap-1">
                    Growth
                    <Star className="w-4 h-4 text-green-500 fill-current" />
                  </div>
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Pro</th>
              </tr>
            </thead>
            <tbody>
              {features.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">{item.feature}</td>
                  <td className="py-3 px-4 text-center">
                    {typeof item.starter === 'boolean' ? (
                      item.starter ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )
                    ) : (
                      <span className="text-sm text-gray-600">{item.starter}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {typeof item.growth === 'boolean' ? (
                      item.growth ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )
                    ) : (
                      <span className="text-sm text-gray-600">{item.growth}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {typeof item.pro === 'boolean' ? (
                      item.pro ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )
                    ) : (
                      <span className="text-sm text-gray-600">{item.pro}</span>
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
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
              Start Free Trial
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const PricingNew: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const handleSelectPlan = (tierId: string) => {
    console.log(`Selected plan: ${tierId}`);
    // Handle plan selection - could redirect to signup with plan preselected
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your venue. All plans include our tablet-based ordering system.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-8">
          <span className={`mr-3 ${!isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isAnnual ? 'translate-x-6 bg-green-600' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`ml-3 ${isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            Annual
            <span className="ml-1.5 text-xs text-green-600 font-semibold">Save 15%</span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
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
        <div className="mb-16">
          <FreeTrialSection />
        </div>

        {/* Which plan section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Not sure which plan is right?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Starter</h3>
              <p className="text-sm text-gray-600">Perfect for pop-ups, food trucks, and small cafés testing digital ordering</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Growth</h3>
              <p className="text-sm text-gray-600">Ideal for busy restaurants and cafés ready to scale operations</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Pro</h3>
              <p className="text-sm text-gray-600">Built for chains, franchises, and venues needing advanced features</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Take our quiz
            </button>
            <button className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Contact sales
            </button>
          </div>
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