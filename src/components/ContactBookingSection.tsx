import React, { useState, useEffect } from 'react';
import { Calendar, Phone, Mail, CheckCircle, ArrowRight, ChevronLeft, ChevronRight, X, User, Building } from 'lucide-react';
import GlareHover from './GlareHover';
// Define types for ClickSpark
interface Spark {
  id: number;
  x: number;
  y: number;
  angle: number;
  radius: number;
}
interface ClickSparkProps {
  children: React.ReactNode;
  sparkColor?: string;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
}
// ClickSpark component
const ClickSpark = ({ children, sparkColor = "#ffffff", sparkRadius = 20, sparkCount = 6, duration = 400 }: ClickSparkProps) => {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const createSparks = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
      id: Date.now() + i,
      x: centerX,
      y: centerY,
      angle: (360 / sparkCount) * i,
      radius: sparkRadius,
    }));
    setSparks(newSparks);
    setTimeout(() => setSparks([]), duration);
  };
  return (
    <div onClick={createSparks} style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      {sparks.map((spark) => (
        <div
          key={spark.id}
          style={{
            position: 'fixed',
            left: spark.x,
            top: spark.y,
            width: '4px',
            height: '4px',
            backgroundColor: sparkColor,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9999,
            animation: `sparkAnimation ${duration}ms ease-out forwards`,
            transform: `rotate(${spark.angle}deg)`,
          }}
        />
      ))}
    </div>
  );
};
const ContactSection = () => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookingStep, setBookingStep] = useState(1);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    restaurant: '',
    message: ''
  });
  // Roterende teksten voor de slideshow
  const rotatingTexts = [
    {
      title: "Vragen over de proefperiode?",
      description: "We leggen uit hoe je 14 dagen gratis kunt testen zonder verplichtingen. Ontdek wat TableTech voor jouw restaurant kan betekenen."
    },
    {
      title: "Welk pakket past bij jou?",
      description: "Starter, Standaard of Professional? We bespreken je behoeftes en adviseren het beste pakket voor jouw situatie en budget."
    },
    {
      title: "Hoeveel kost TableTech precies?",
      description: "Transparante prijzen vanaf €65/maand. We berekenen samen wat de investering en verwachte ROI voor jouw restaurant is."
    },
    {
      title: "Hoe werkt de installatie?",
      description: "Van QR-codes tot tablets - we bespreken het complete installatieproces en hoe snel je operationeel kunt zijn."
    },
    {
      title: "Technische vragen of zorgen?",
      description: "Werkt het met jouw kassasysteem? Hoe zit het met training? Alle technische aspecten komen aan bod."
    }
  ];
  // Roteer teksten
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [rotatingTexts.length]);
  // Tijdslots voor afspraken
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];
  // Genereer kalenderdagen
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days: (Date | null)[] = [];
    // Voeg lege dagen toe voor de eerste week
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Voeg alle dagen van de maand toe
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };
  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  const isDateAvailable = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Alleen werkdagen en niet in het verleden
    const dayOfWeek = date.getDay();
    return date >= today && dayOfWeek !== 0 && dayOfWeek !== 6;
  };
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('nl-NL', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  const handleDateSelect = (date: Date | null) => {
    if (date && isDateAvailable(date)) {
      setSelectedDate(date);
    }
  };
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setBookingStep(2);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmitBooking = () => {
    // Hier zou je normaal de data naar een backend sturen
    console.log('Afspraak geboekt:', {
      ...bookingData,
      date: formatDate(selectedDate),
      time: selectedTime
    });
    setBookingStep(3);
  };
  const handleCloseModal = () => {
    setShowBookingModal(false);
    setBookingStep(1);
    setSelectedDate(null);
    setSelectedTime('');
    setBookingData({
      name: '',
      email: '',
      phone: '',
      restaurant: '',
      message: ''
    });
  };
  const monthNames = [
    'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
    'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
  ];
  const dayNames = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];
  return (
    <section className="relative bg-[#2C1E1A] py-12 px-4 overflow-hidden flex items-center min-h-[80vh]">
      {/* VERBETERDE overgang van PricingNew - Perfect naadloos */}
      <div className="absolute top-0 left-0 right-0 h-48 pointer-events-none">
        {/* Meerdere lagen voor een perfecte overgang */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C1E1A] via-[#2C1E1A]/80 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-32 bg-[#2C1E1A]"></div>
        <div className="absolute top-0 left-0 right-0 h-16 bg-[#2C1E1A]"></div>
      </div>
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-[#D4A574]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#C19660]/10 rounded-full blur-3xl"></div>
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Main content - 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left column - Slideshow */}
          <div className="order-2 lg:order-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg">
              Plan een Gratis Adviesgesprek
            </h1>
            {/* Slideshow container */}
            <div className="relative h-40 mb-6">
              <div className="absolute inset-0">
                {rotatingTexts.map((text, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ${
                      index === currentTextIndex 
                        ? 'opacity-100 transform translate-y-0' 
                        : 'opacity-0 transform translate-y-4'
                    }`}
                  >
                    <h2 className="text-xl md:text-2xl font-bold text-[#D4A574] mb-3">
                      {text.title}
                    </h2>
                    <p className="text-base text-white/80 leading-relaxed">
                      {text.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Right column - Clean glassmorphism booking card */}
          <div className="order-1 lg:order-2">
            <GlareHover
              width="100%"
              height="auto"
              background="transparent"
              borderRadius="24px"
              borderColor="rgba(255, 255, 255, 0.2)"
              glareColor="#ffffff"
              glareOpacity={0.15}
              glareAngle={45}
              glareSize={150}
              transitionDuration={800}
              className="max-w-sm mx-auto border-0"
              style={{ border: 'none' }}
            >
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl w-full rounded-3xl overflow-hidden">
                <div className="p-6 lg:p-8">
                  {/* Subtle gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 rounded-3xl pointer-events-none"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-3 text-center">
                      Klaar voor de volgende stap?
                    </h3>
                    <p className="text-white/90 text-center mb-6">
                      Automatiseer je restaurant
                    </p>
                    <ClickSpark
                      sparkColor="#ffffff"
                      sparkRadius={30}
                      sparkCount={10}
                      duration={700}
                    >
                      <button
                        onClick={() => setShowBookingModal(true)}
                        className="w-full bg-white/20 backdrop-blur-md border border-white/30 text-white py-3 rounded-2xl font-bold text-base transition-all duration-300 transform hover:scale-105 hover:bg-white/30 hover:shadow-xl active:scale-95 flex items-center justify-center space-x-2 mb-6"
                      >
                        <Calendar className="w-5 h-5" />
                        <span>Plan nu je gratis adviesgesprek</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </ClickSpark>
                    <div className="text-center">
                      <p className="text-white/80 text-sm mb-3">Liever direct contact?</p>
                      <div className="space-y-3">
                        <ClickSpark sparkColor="#ffffff" sparkRadius={20} sparkCount={8} duration={500}>
                          <a href="tel:+31858883333" className="flex items-center justify-center space-x-2 text-white hover:text-white/80 transition-colors text-sm font-semibold">
                            <Phone className="w-5 h-5" />
                            <span>+31 85 888 3333</span>
                          </a>
                        </ClickSpark>
                        <ClickSpark sparkColor="#ffffff" sparkRadius={20} sparkCount={8} duration={500}>
                          <a href="mailto:info@tabletech.nl" className="flex items-center justify-center space-x-2 text-white hover:text-white/80 transition-colors text-sm font-semibold">
                            <Mail className="w-5 h-5" />
                            <span>info@tabletech.nl</span>
                          </a>
                        </ClickSpark>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlareHover>
          </div>
        </div>
      </div>
      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#2C1E1A] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/20 shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#D4A574] to-[#C19660] p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {bookingStep === 1 && 'Kies datum en tijd'}
                {bookingStep === 2 && 'Jouw gegevens'}
                {bookingStep === 3 && 'Afspraak bevestigd!'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-white hover:text-white/80 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              {/* Step 1: Calendar and Time */}
              {bookingStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Calendar */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Selecteer een datum</h3>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                      {/* Month navigation */}
                      <div className="flex items-center justify-between mb-4">
                        <ClickSpark sparkColor="#D4A574" sparkRadius={15} sparkCount={6} duration={300}>
                          <button
                            onClick={handlePreviousMonth}
                            className="text-white hover:text-[#D4A574] transition-colors"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                        </ClickSpark>
                        <h4 className="text-white font-semibold">
                          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h4>
                        <ClickSpark sparkColor="#D4A574" sparkRadius={15} sparkCount={6} duration={300}>
                          <button
                            onClick={handleNextMonth}
                            className="text-white hover:text-[#D4A574] transition-colors"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </ClickSpark>
                      </div>
                      {/* Days of week */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map(day => (
                          <div key={day} className="text-center text-white/60 text-sm font-medium p-2">
                            {day}
                          </div>
                        ))}
                      </div>
                      {/* Calendar days */}
                      <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(currentMonth).map((date, index) => (
                          <div key={index}>
                            {date ? (
                              <ClickSpark 
                                sparkColor="#D4A574" 
                                sparkRadius={12} 
                                sparkCount={4} 
                                duration={300}
                              >
                                <button
                                  onClick={() => handleDateSelect(date)}
                                  disabled={!isDateAvailable(date)}
                                  className={`
                                    w-full p-2 rounded-lg text-sm transition-all duration-200
                                    ${!isDateAvailable(date) 
                                      ? 'text-white/30 cursor-not-allowed' 
                                      : selectedDate && date && date.toDateString() === selectedDate.toDateString()
                                        ? 'bg-[#D4A574] text-white font-semibold shadow-lg'
                                        : 'text-white hover:bg-white/20 hover:scale-105'
                                    }
                                  `}
                                >
                                  {date.getDate()}
                                </button>
                              </ClickSpark>
                            ) : (
                              <div className="w-full p-2"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Time slots */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Kies een tijd</h3>
                    {selectedDate ? (
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                        <p className="text-white/80 text-sm mb-4">
                          Beschikbare tijden voor {formatDate(selectedDate)}:
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map(time => (
                            <ClickSpark 
                              key={time}
                              sparkColor="#D4A574" 
                              sparkRadius={15} 
                              sparkCount={6} 
                              duration={400}
                            >
                              <button
                                onClick={() => handleTimeSelect(time)}
                                className={`
                                  w-full p-3 rounded-lg text-sm font-medium transition-all duration-200
                                  ${selectedTime === time
                                    ? 'bg-[#D4A574] text-white shadow-lg'
                                    : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'
                                  }
                                `}
                              >
                                {time}
                              </button>
                            </ClickSpark>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                        <Calendar className="w-12 h-12 text-white/40 mx-auto mb-3" />
                        <p className="text-white/60">Selecteer eerst een datum</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Step 2: Contact Form */}
              {bookingStep === 2 && (
                <div className="max-w-2xl mx-auto">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-4">
                    <div className="flex items-center justify-between text-white mb-4">
                      <div>
                        <p className="text-sm text-white/60">Geselecteerde datum:</p>
                        <p className="font-semibold">{formatDate(selectedDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-white/60">Tijd:</p>
                        <p className="font-semibold">{selectedTime}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Naam *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                          <input
                            type="text"
                            name="name"
                            required
                            value={bookingData.name}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                            placeholder="Je volledige naam"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Restaurant
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                          <input
                            type="text"
                            name="restaurant"
                            value={bookingData.restaurant}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                            placeholder="Naam van je restaurant"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                          <input
                            type="email"
                            name="email"
                            required
                            value={bookingData.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                            placeholder="je@email.nl"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Telefoon *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={bookingData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                            placeholder="+31 6 12345678"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Waar wil je het over hebben? (optioneel)
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        value={bookingData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent resize-none"
                        placeholder="Bijvoorbeeld: Ik wil graag meer weten over jullie analytics mogelijkheden..."
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <ClickSpark sparkColor="#ffffff" sparkRadius={20} sparkCount={6} duration={400}>
                        <button
                          onClick={() => setBookingStep(1)}
                          className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-white/20"
                        >
                          Terug
                        </button>
                      </ClickSpark>
                      <ClickSpark sparkColor="#ffffff" sparkRadius={25} sparkCount={10} duration={600}>
                        <button
                          onClick={handleSubmitBooking}
                          className="flex-1 bg-gradient-to-r from-[#D4A574] to-[#C19660] text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                        >
                          Bevestig afspraak
                        </button>
                      </ClickSpark>
                    </div>
                  </div>
                </div>
              )}
              {/* Step 3: Confirmation */}
              {bookingStep === 3 && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Afspraak succesvol ingepland!
                  </h3>
                  <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
                    We hebben je afspraak ontvangen en sturen binnen enkele minuten een bevestiging naar {bookingData.email}
                  </p>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto mb-8 border border-white/20">
                    <div className="space-y-3 text-left">
                      <div className="flex justify-between">
                        <span className="text-white/60">Datum:</span>
                        <span className="text-white font-semibold">{formatDate(selectedDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Tijd:</span>
                        <span className="text-white font-semibold">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Contact:</span>
                        <span className="text-white font-semibold">{bookingData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Type gesprek:</span>
                        <span className="text-white font-semibold">Adviesgesprek (30 min)</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-500/20 backdrop-blur-md rounded-xl p-4 max-w-md mx-auto mb-8 border border-blue-400/30">
                    <p className="text-white/90 text-sm">
                      💡 <strong>Tip:</strong> Bereid je voor door na te denken over je grootste uitdagingen in het restaurant. 
                      Zo kunnen we je tijdens het gesprek het beste helpen!
                    </p>
                  </div>
                  <ClickSpark sparkColor="#ffffff" sparkRadius={25} sparkCount={10} duration={600}>
                    <button
                      onClick={handleCloseModal}
                      className="bg-gradient-to-r from-[#D4A574] to-[#C19660] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      Sluiten
                    </button>
                  </ClickSpark>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* VERBETERDE overgang naar CallToAction - Perfect naadloos */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none">
        {/* Zeer geleidelijke overgang zonder harde lijnen */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2C1E1A]/40 to-[#2C1E1A]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#2C1E1A]"></div>
      </div>
      <style>{`
        @keyframes sparkAnimation {
          0% {
            opacity: 1;
            transform: rotate(var(--angle)) translateY(0);
          }
          100% {
            opacity: 0;
            transform: rotate(var(--angle)) translateY(-20px);
          }
        }
      `}</style>
    </section>
  );
};
export default ContactSection;
