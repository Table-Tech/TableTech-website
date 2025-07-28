import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, Star, Phone, Calendar, Mail, ArrowRight, Zap, Shield, Headphones } from "lucide-react";
import achtergrond2 from "../../assets/afbeeldingen/achtergrond2.png";

const pricingData = [
  ["Tablet inbegrepen", "❌ Huur €12/m", "✔ 1 tablet", "✔ 1+ tablets"],
  ["Dashboard & bestellingen", "✔", "✔", "✔"],
  ["QR-menu met logo", "✔", "✔", "✔"],
  ["Online betalingen", "✔", "✔", "✔"],
  ["Onbeperkt aantal tafels", "✔", "✔", "✔"],
  ["Kassa-integratie", "✔", "✔", "✔"],
  ["Printer-integratie", "✔", "✔", "✔"],
  ["Afhaal & bezorgopties", "✔", "✔", "✔"],
  ["Analytics & rapporten", "❌", "✔", "✔ geavanceerd"],
  ["Exportmogelijkheden", "❌", "✔", "✔"],
  ["Meerdere gebruikers", "❌", "✔", "✔"],
  ["Upsell/Cross-sell", "❌", "❌", "✔"],
  ["Volledige branding", "❌", "❌", "✔ (kleur, logo, stijl)"],
  ["Prioriteit support", "❌", "❌", "✔ 24/7"],
  ["Installatie op locatie", "❌", "❌", "✔ inbegrepen"],
  ["Extra vestiging", "€45/m", "€35/m", "Op maat"],
  ["Proefperiode", "14 dagen", "14 dagen", "14 dagen"],
];

export const PricingSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        id="pricing"
        className="relative w-full h-screen bg-cover bg-center bg-no-repeat py-12"
        style={{ backgroundImage: `url(${achtergrond2})` }}
      >
      {/* Glassmorphism overlay with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2C1E1A]/20 via-[#7b4f35]/10 to-[#2C1E1A]/30 z-0" />

      {/* Content */}
      <div className="relative z-10 w-full h-full px-4 sm:px-6 lg:px-12 2xl:px-24 3xl:px-64 flex justify-end items-center">
        <div
          ref={ref}
          className={`max-w-4xl backdrop-blur-2xl border-2 border-[#A77B5D]/40 rounded-3xl shadow-[0_8px_32px_rgba(123,79,53,0.12)] backdrop-saturate-150 p-6 sm:p-8 transform transition-all duration-1000 ease-out relative ${
            visible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95"
          }`}
          style={{
            background: 'linear-gradient(135deg, rgba(123,79,53,0.25) 0%, rgba(94,59,41,0.18) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)'
          }}
        >
          <div className="text-center mb-6">
            <div 
              className="inline-flex items-center justify-center w-12 h-1 rounded-full mb-4 backdrop-blur-sm border border-[#D4C0AC]/60 shadow-[0_2px_8px_rgba(212,192,172,0.4)]"
              style={{
                background: 'linear-gradient(90deg, rgba(123,79,53,1) 0%, rgba(167,123,93,0.9) 100%)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}
            ></div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white drop-shadow-lg">
              Vergelijk onze abonnementen
            </h2>
            <p className="text-white/90 text-sm md:text-base max-w-xl mx-auto leading-relaxed drop-shadow-md">
              Kies het pakket dat perfect bij jouw restaurant past.
            </p>
          </div>

          <div className="relative">
            {/* Scrollable table container */}
            <div 
              ref={tableRef}
              className="max-h-64 overflow-y-auto pr-2 focus:outline-none transition-all duration-200 rounded-2xl backdrop-blur-md border-2 border-[#D4C0AC]/30"
              tabIndex={0}
              style={{
                background: 'linear-gradient(135deg, rgba(123,79,53,0.3) 0%, rgba(94,59,41,0.2) 100%)',
                backdropFilter: 'blur(10px) saturate(150%)',
                WebkitBackdropFilter: 'blur(10px) saturate(150%)'
              }}
            >
              <table className="w-full border-collapse text-white bg-transparent rounded-lg overflow-hidden">
                <thead className="sticky top-0 z-10">
                  <tr 
                    className="text-white font-semibold border-b border-[#D4C0AC]/40 backdrop-blur-xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(123,79,53,0.9) 0%, rgba(167,123,93,0.7) 100%)',
                      backdropFilter: 'blur(15px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(15px) saturate(180%)'
                    }}
                  >
                    <th className="p-3 border-r border-[#D4C0AC]/30 text-left text-sm">Functie</th>
                    <th className="p-3 border-r border-[#D4C0AC]/30 text-center text-sm">
                      Starter<br />
                      <span className="text-xs font-normal opacity-90">€65/m</span>
                    </th>
                    <th className="p-3 border-r border-[#D4C0AC]/30 text-center text-sm">
                      Standaard<br />
                      <span className="text-xs font-normal opacity-90">€70/m</span>
                    </th>
                    <th className="p-3 text-center text-sm">
                      Professional<br />
                      <span className="text-xs font-normal opacity-90">€85/m</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pricingData.map(([feature, starter, standard, pro], i) => (
                    <tr key={i} className="border-b border-[#D4C0AC]/20 hover:bg-[#A77B5D]/10 transition-all duration-300">
                      <td className="p-3 border-r border-[#D4C0AC]/20 text-left font-medium text-sm text-white/95">{feature}</td>
                      <td className="p-3 text-center border-r border-[#D4C0AC]/20 text-sm text-white/90">{starter}</td>
                      <td className="p-3 text-center border-r border-[#D4C0AC]/20 text-sm text-white/90">{standard}</td>
                      <td className="p-3 text-center text-sm text-white/90">{pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Call to action buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button 
              className="text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm border border-white/30 backdrop-blur-xl shadow-[0_4px_16px_rgba(123,79,53,0.3)]"
              style={{
                background: 'linear-gradient(135deg, rgba(123,79,53,0.8) 0%, rgba(94,59,41,0.9) 100%)',
                backdropFilter: 'blur(15px) saturate(180%)',
                WebkitBackdropFilter: 'blur(15px) saturate(180%)'
              }}
            >
              Start gratis proefperiode
            </button>
            <Link
              to="/pricing"
              className="group text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm inline-flex items-center gap-2 border-2 border-[#D4C0AC]/50 backdrop-blur-xl shadow-[0_4px_16px_rgba(212,192,172,0.2)]"
              style={{
                background: 'linear-gradient(135deg, rgba(167,123,93,0.2) 0%, rgba(123,79,53,0.1) 100%)',
                backdropFilter: 'blur(15px) saturate(180%)',
                WebkitBackdropFilter: 'blur(15px) saturate(180%)'
              }}
            >
              Alle prijzen bekijken
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      </section>
    </>
  );
};

// Pricing plans data
const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    price: "65",
    period: "/maand",
    description: "Perfect voor kleine restaurants die willen beginnen",
    popular: false,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    features: [
      { text: "Tablet inbegrepen", included: false, note: "Huur €12/m" },
      { text: "Dashboard & bestellingen", included: true },
      { text: "QR-menu met logo", included: true },
      { text: "Online betalingen", included: true },
      { text: "Onbeperkt aantal tafels", included: true },
      { text: "Kassa-integratie", included: true },
      { text: "Printer-integratie", included: true },
      { text: "Afhaal & bezorgopties", included: true },
      { text: "Analytics & rapporten", included: false },
      { text: "Exportmogelijkheden", included: false },
      { text: "Meerdere gebruikers", included: false },
      { text: "Extra vestiging", included: false, note: "€45/m" },
      { text: "Proefperiode", included: true, note: "14 dagen" }
    ]
  },
  {
    id: "standard",
    name: "Standaard",
    price: "70",
    period: "/maand",
    description: "Ideaal voor groeiende restaurants met meer functionaliteiten",
    popular: true,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    features: [
      { text: "1 tablet inbegrepen", included: true },
      { text: "Dashboard & bestellingen", included: true },
      { text: "QR-menu met logo", included: true },
      { text: "Online betalingen", included: true },
      { text: "Onbeperkt aantal tafels", included: true },
      { text: "Kassa-integratie", included: true },
      { text: "Printer-integratie", included: true },
      { text: "Afhaal & bezorgopties", included: true },
      { text: "Analytics & rapporten", included: true },
      { text: "Exportmogelijkheden", included: true },
      { text: "Meerdere gebruikers", included: true },
      { text: "Extra vestiging", included: false, note: "€35/m" },
      { text: "Proefperiode", included: true, note: "14 dagen" }
    ]
  },
  {
    id: "professional",
    name: "Professional",
    price: "85",
    period: "/maand",
    description: "Voor professionele restaurants die alles willen",
    popular: false,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    features: [
      { text: "1+ tablets inbegrepen", included: true },
      { text: "Dashboard & bestellingen", included: true },
      { text: "QR-menu met logo", included: true },
      { text: "Online betalingen", included: true },
      { text: "Onbeperkt aantal tafels", included: true },
      { text: "Kassa-integratie", included: true },
      { text: "Printer-integratie", included: true },
      { text: "Afhaal & bezorgopties", included: true },
      { text: "Geavanceerde analytics", included: true },
      { text: "Exportmogelijkheden", included: true },
      { text: "Meerdere gebruikers", included: true },
      { text: "Upsell/Cross-sell", included: true },
      { text: "Volledige branding", included: true, note: "kleur, logo, stijl" },
      { text: "Prioriteit support", included: true, note: "24/7" },
      { text: "Installatie op locatie", included: true },
      { text: "Extra vestiging", included: false, note: "Op maat" },
      { text: "Proefperiode", included: true, note: "14 dagen" }
    ]
  }
];

const PricingCard: React.FC<{ plan: typeof pricingPlans[0] }> = ({ 
  plan
}) => {
  return (
    <div className={`
      relative rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl
      ${plan.popular 
        ? 'bg-white border-3 border-green-400 transform scale-105 shadow-3xl' 
        : 'bg-white/95 backdrop-blur-lg border-2 border-white/20'
      }
    `}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
            <Star className="w-4 h-4 fill-current" />
            Meest populair
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
        <div className="flex items-baseline justify-center mb-4">
          <span className="text-4xl font-bold text-gray-900">€{plan.price}</span>
          <span className="text-gray-600 ml-1">{plan.period}</span>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{plan.description}</p>
      </div>

      <div className="space-y-4 mb-8">
        {plan.features.slice(0, 8).map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            {feature.included ? (
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <X className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-500'}`}>
                {feature.text}
              </span>
              {feature.note && (
                <span className="text-xs text-gray-500 ml-1">({feature.note})</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <button 
        className={`
          w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 
          transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl
          ${plan.popular 
            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
            : `bg-gradient-to-r ${plan.color} hover:opacity-90`
          }
        `}
      >
        Start 14 dagen gratis
      </button>
      
      <p className="text-center text-xs text-gray-500 mt-4">
        Geen setup kosten • Cancel elk moment
      </p>
    </div>
  );
};

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    restaurant: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Contact Info */}
          <div className="bg-gradient-to-br from-[#7b4f35] to-[#5e3b29] p-8 lg:p-12 text-white">
            <h3 className="text-2xl font-bold mb-6">Plan een vrijblijvend gesprek</h3>
            <p className="text-white/90 mb-8 leading-relaxed">
              Ontdek hoe TableTech jouw restaurant kan transformeren. Onze experts helpen je graag verder.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Telefoon</p>
                  <p className="text-white/80">+31 85 888 3333</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-white/80">info@tabletech.nl</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Beschikbaarheid</p>
                  <p className="text-white/80">Ma-Vr 9:00-18:00</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/20">
              <h4 className="font-semibold mb-4">Waarom TableTech?</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm">Setup binnen 24 uur</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-green-300" />
                  <span className="text-sm">100% veilige betalingen</span>
                </div>
                <div className="flex items-center gap-3">
                  <Headphones className="w-4 h-4 text-blue-300" />
                  <span className="text-sm">24/7 Nederlandse support</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="p-8 lg:p-12">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Naam *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7b4f35] focus:border-transparent transition-all duration-200"
                    placeholder="Je volledige naam"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7b4f35] focus:border-transparent transition-all duration-200"
                    placeholder="je@email.nl"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefoon
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7b4f35] focus:border-transparent transition-all duration-200"
                    placeholder="+31 6 1234 5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant naam
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7b4f35] focus:border-transparent transition-all duration-200"
                    placeholder="Naam van je restaurant"
                    value={formData.restaurant}
                    onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bericht
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7b4f35] focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Vertel ons over je restaurant en waar je hulp bij nodig hebt..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-[#7b4f35] to-[#5e3b29] text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                Plan gratis gesprek in
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-center text-xs text-gray-500 mt-6">
              Door dit formulier in te vullen ga je akkoord met onze{' '}
              <a href="/privacy" className="text-[#7b4f35] hover:underline">privacybeleid</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PricingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen py-16 relative"
      style={{
        backgroundImage: `url(${achtergrond2})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2C1E1A]/20 via-[#7b4f35]/10 to-[#2C1E1A]/30 z-0" />
      
      <div className="relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-12 h-1 rounded-full mb-6 bg-gradient-to-r from-[#7b4f35] to-[#A77B5D] shadow-lg"></div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-2xl">
              Transparante prijzen voor elke restaurant
            </h1>
            
            <p className="text-xl text-white/90 mb-8 drop-shadow-lg leading-relaxed max-w-2xl mx-auto">
              Kies het pakket dat perfect past bij jouw restaurant. Alle prijzen zijn per maand, zonder verborgen kosten.
            </p>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span>14 dagen gratis proberen</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span>Geen setup kosten</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span>Cancel elk moment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div 
          ref={ref}
          className={`max-w-7xl mx-auto px-6 mb-20 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.id}
                className="transition-all duration-500"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <PricingCard plan={plan} />
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto px-6 mb-20">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Veelgestelde vragen
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">
                  Kan ik van pakket wisselen?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Ja, je kunt elk moment upgraden of downgraden. Wijzigingen gaan in vanaf de volgende factuurperiode.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">
                  Wat gebeurt er na de proefperiode?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Na 14 dagen wordt automatisch gefactureerd, tenzij je eerder opzegt. Geen verborgen kosten.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">
                  Is er een minimum contract?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Nee, je kunt maandelijks opzeggen. Wij geloven in onze dienst en dwingen geen lange contracten af.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">
                  Krijg ik support bij de installatie?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Ja, bij Professional pakket zelfs on-site. Alle pakketten hebben online support en instructievideo's.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <a 
                href="/contact" 
                className="inline-flex items-center gap-2 text-[#7b4f35] hover:text-[#5e3b29] font-semibold transition-colors"
              >
                Meer vragen? Neem contact op
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
              Nog twijfels? Laten we praten!
            </h2>
            <p className="text-white/90 text-lg drop-shadow">
              Krijg een persoonlijke demonstratie en advies op maat voor jouw restaurant.
            </p>
          </div>
          
          <ContactSection />
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto px-6">
            <div className="bg-gradient-to-r from-[#7b4f35] to-[#5e3b29] rounded-3xl p-8 lg:p-12 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">
                Klaar om te beginnen?
              </h3>
              <p className="text-white/90 mb-8">
                Start vandaag nog met je gratis proefperiode en ontdek waarom meer dan 500+ restaurants voor TableTech kiezen.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-[#7b4f35] px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95">
                  Start gratis proefperiode
                </button>
                <a 
                  href="/demo" 
                  className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-white hover:text-[#7b4f35] hover:scale-105"
                >
                  Bekijk demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;