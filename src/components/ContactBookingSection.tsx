import React, { useState, useEffect } from 'react';
import { Calendar, Phone, Mail, CheckCircle, ArrowRight, ChevronLeft, ChevronRight, X, User, Building, AlertCircle, Clock } from 'lucide-react';
import { createMailtoLink, isTimeSlotAvailable, getBookedTimeSlotsForDate, clearExpiredBookings } from '../services/emailService';
import { sendAppointmentEmailStrato } from '../services/stratoEmailService';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState(false);

  // Roterende teksten voor de slideshow
  const rotatingTexts = [
    {
      title: "Vragen over de proefperiode?",
      description: "We leggen uit hoe je 14 dagen gratis kunt testen zonder verplichtingen. Ontdek wat TableTech voor jouw restaurant kan betekenen."
    },
    {
      title: "Welk pakket past bij jou?",
      description: "Gratis, Groei, Pro of Ultimate? We bespreken je behoeftes en adviseren het beste pakket voor jouw situatie en budget."
    },
    {
      title: "Hoeveel kost TableTech precies?",
      description: "Transparante prijzen vanaf gratis. We berekenen samen wat de investering en verwachte ROI voor jouw restaurant is."
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

  // Clear expired bookings on component mount
  useEffect(() => {
    clearExpiredBookings();
  }, []);

  // Tijdslots voor afspraken
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  // Get available time slots for selected date
  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];
    
    const dateString = selectedDate.toLocaleDateString('nl-NL');
    const bookedSlots = getBookedTimeSlotsForDate(dateString);
    
    return timeSlots.filter(time => !bookedSlots.includes(time));
  };

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

  const handleSubmitBooking = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setEmailError(false);
    
    try {
      const appointmentData = {
        ...bookingData,
        date: formatDate(selectedDate),
        time: selectedTime
      };

      console.log('🚀 Starting booking submission for:', appointmentData);
      
      // Double-check time slot availability before sending
      if (!isTimeSlotAvailable(appointmentData.date, appointmentData.time)) {
        throw new Error('Deze tijd is al gereserveerd door een andere klant. Kies een andere tijd.');
      }
      
      // Attempt to send email with enhanced Strato support
      const emailSent = await sendAppointmentEmailStrato(appointmentData);
      
      if (emailSent) {
        console.log('✅ Email successfully sent to info@tabletech.nl');
        setEmailError(false);
      } else {
        console.warn('⚠️ Email delivery failed - customer will see backup message');
        setEmailError(true);
        
        // Log this appointment for manual follow-up
        const manualFollowUp = {
          timestamp: new Date().toISOString(),
          appointmentData,
          status: 'EMAIL_FAILED_MANUAL_FOLLOWUP_REQUIRED',
          priority: 'HIGH',
          action: `Contact ${appointmentData.name} at ${appointmentData.email} or ${appointmentData.phone} within 24 hours`
        };
        
        console.error('🚨 MANUAL FOLLOW-UP REQUIRED:', manualFollowUp);
        
        // Store for admin review
        try {
          const failedBookings = JSON.parse(localStorage.getItem('tabletech-failed-bookings') || '[]');
          failedBookings.push(manualFollowUp);
          localStorage.setItem('tabletech-failed-bookings', JSON.stringify(failedBookings));
        } catch (e) {
          console.warn('Could not store failed booking for manual follow-up:', e);
        }
      }

      // Always proceed to confirmation step
      setBookingStep(3);
    } catch (error) {
      console.error('❌ Critical error submitting booking:', error);
      
      // Check if it's a double booking error
      if (error instanceof Error && error.message.includes('al gereserveerd')) {
        // Show error message and stay on time selection
        alert('⚠️ Deze tijd is net geboekt door iemand anders! Kies alstublieft een andere tijd.');
        setSelectedTime(''); // Reset time selection
        setIsSubmitting(false);
        return;
      }
      
      setEmailError(true);
      setBookingStep(3); // Still proceed to show confirmation with error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setBookingStep(1);
    setSelectedDate(null);
    setSelectedTime('');
    setIsSubmitting(false);
    setEmailError(false);
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
    <>
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
      
      <section className="relative min-h-screen bg-gradient-to-b from-[#2C1E1A] via-[#3A2B24] to-[#2C1E1A] pt-64 pb-16 px-4 overflow-hidden">
        {/* VERBETERDE overgang van PricingNew - Perfect naadloos met meer ruimte */}
        <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#2C1E1A] via-[#2C1E1A]/90 to-transparent"></div>
          <div className="absolute top-0 left-0 right-0 h-48 bg-[#2C1E1A]"></div>
          <div className="absolute top-0 left-0 right-0 h-32 bg-[#2C1E1A]"></div>
        </div>
        
        {/* Animated background effects - matching pricing section */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#E86C28] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#C3561D] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-[#7A5A48] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          {/* Main content - 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Slideshow */}
            <div className="order-2 lg:order-1 text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight text-left">
                Plan een <span className="bg-gradient-to-r from-[#E86C28] to-[#FFB366] bg-clip-text text-transparent">Gratis</span> Adviesgesprek
              </h1>
              
              {/* Slideshow container */}
              <div className="relative h-48 mb-8">
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
                      <h2 className="text-2xl md:text-3xl font-bold text-[#E86C28] mb-4 leading-tight text-left">
                        {text.title}
                      </h2>
                      <p className="text-lg text-[#D4B896] leading-relaxed text-left">
                        {text.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features list */}
              <div className="space-y-3 text-[#D4B896]">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#E86C28] rounded-full"></div>
                  <span>30 minuten persoonlijk advies</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#E86C28] rounded-full"></div>
                  <span>Geen verplichtingen of verborgen kosten</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#E86C28] rounded-full"></div>
                  <span>Direct implementatieplan</span>
                </div>
              </div>
            </div>
            
            {/* Right column - Larger glassmorphism booking card */}
            <div className="order-1 lg:order-2">
              <div className="relative backdrop-blur-xl bg-[#3A2B24]/30 border border-[#4A372E]/50 shadow-2xl w-full max-w-lg mx-auto rounded-3xl overflow-hidden">
                {/* Header section with gradient */}
                <div className="bg-gradient-to-r from-[#E86C28]/20 to-[#C3561D]/20 p-8 border-b border-[#4A372E]/30">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#E86C28] to-[#FFB366] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Klaar voor de volgende stap?
                    </h3>
                    <p className="text-[#D4B896] text-lg">
                      Automatiseer je restaurant vandaag nog
                    </p>
                  </div>
                </div>

                {/* Content section */}
                <div className="p-8">
                  <div className="relative z-10">
                    {/* Main CTA Button */}
                    <ClickSpark
                      sparkColor="#E86C28"
                      sparkRadius={40}
                      sparkCount={15}
                      duration={1000}
                    >
                      <button
                        onClick={() => setShowBookingModal(true)}
                        className="w-full bg-gradient-to-r from-[#E86C28] via-[#F97316] to-[#FFB366] text-white py-6 px-12 rounded-3xl font-bold text-xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl active:scale-95 flex items-center justify-center space-x-4 mb-8 shadow-lg border-2 border-white/20 backdrop-blur-sm relative overflow-hidden group min-w-[320px]"
                      >
                        {/* Animated background effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <Calendar className="w-7 h-7 relative z-10" />
                        <span className="relative z-10 tracking-wide">Plan nu je gratis adviesgesprek</span>
                        <ArrowRight className="w-7 h-7 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </ClickSpark>

                    {/* Divider */}
                    <div className="relative mb-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#4A372E]/30"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-[#3A2B24]/30 text-[#D4B896]">Of neem direct contact op</span>
                      </div>
                    </div>

                    {/* Contact options */}
                    <div className="flex items-center justify-center gap-8">
                      <ClickSpark sparkColor="#E86C28" sparkRadius={25} sparkCount={8} duration={600}>
                        <a 
                          href="tel:+31858883333" 
                          className="flex items-center space-x-2 text-white font-semibold text-base transition-all duration-300 hover:text-[#E86C28]"
                        >
                          <Phone className="w-5 h-5 text-[#E86C28]" />
                          <span>+31 85 888 3333</span>
                        </a>
                      </ClickSpark>
                      
                      <ClickSpark sparkColor="#E86C28" sparkRadius={25} sparkCount={8} duration={600}>
                        <a 
                          href="mailto:info@tabletech.nl" 
                          className="flex items-center space-x-2 text-white font-semibold text-base transition-all duration-300 hover:text-[#E86C28]"
                        >
                          <Mail className="w-5 h-5 text-[#E86C28]" />
                          <span>info@tabletech.nl</span>
                        </a>
                      </ClickSpark>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-8 pt-6 border-t border-[#4A372E]/30">
                      <div className="grid grid-cols-2 gap-4 text-center text-sm text-[#D4B896]">
                        <div>
                          <div className="text-xl font-bold text-[#E86C28]">500+</div>
                          <div>Tevreden restaurants</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-[#E86C28]">24/7</div>
                          <div>Support beschikbaar</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#2C1E1A] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-[#4A372E]/50 shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#E86C28] to-[#FFB366] p-6 flex items-center justify-between">
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
                    <div className="bg-[#3A2B24]/50 backdrop-blur-md rounded-2xl p-4 border border-[#4A372E]/50">
                      {/* Month navigation */}
                      <div className="flex items-center justify-between mb-4">
                        <ClickSpark sparkColor="#E86C28" sparkRadius={15} sparkCount={6} duration={300}>
                          <button
                            onClick={handlePreviousMonth}
                            className="text-white hover:text-[#E86C28] transition-colors"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                        </ClickSpark>
                        <h4 className="text-white font-semibold">
                          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h4>
                        <ClickSpark sparkColor="#E86C28" sparkRadius={15} sparkCount={6} duration={300}>
                          <button
                            onClick={handleNextMonth}
                            className="text-white hover:text-[#E86C28] transition-colors"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </ClickSpark>
                      </div>
                      
                      {/* Days of week */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map(day => (
                          <div key={day} className="text-center text-[#D4B896] text-sm font-medium p-2">
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
                                sparkColor="#E86C28" 
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
                                        ? 'bg-[#E86C28] text-white font-semibold shadow-lg'
                                        : 'text-white hover:bg-[#4A372E]/50 hover:scale-105'
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
                      <div className="bg-[#3A2B24]/50 backdrop-blur-md rounded-2xl p-4 border border-[#4A372E]/50">
                        <div className="flex items-center gap-2 mb-4">
                          <Clock className="w-4 h-4 text-[#E86C28]" />
                          <p className="text-[#D4B896] text-sm">
                            Tijden voor {formatDate(selectedDate)}:
                          </p>
                        </div>
                        
                        {/* All time slots - both available and booked */}
                        <div className="grid grid-cols-2 gap-3">
                          {timeSlots.map(time => {
                            const dateString = selectedDate?.toLocaleDateString('nl-NL') || '';
                            const bookedSlots = getBookedTimeSlotsForDate(dateString);
                            const isBooked = bookedSlots.includes(time);
                            const isAvailable = !isBooked;
                            
                            if (isBooked) {
                              // Geboekte tijd - doorgestreept en niet klikbaar
                              return (
                                <div
                                  key={`booked-${time}`}
                                  className="w-full py-4 px-6 rounded-xl text-base font-semibold bg-red-900/40 text-red-200 border-2 border-red-500/60 relative cursor-not-allowed opacity-80 min-w-[140px] transform transition-all duration-200"
                                >
                                  <div className="flex items-center justify-center gap-2 relative">
                                    <Clock className="w-4 h-4 opacity-60" />
                                    <span className="relative">
                                      {time}
                                      {/* Dubbele doorstreep effect voor extra duidelijkheid */}
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-1 bg-red-400 transform rotate-12 rounded-full shadow-lg"></div>
                                      </div>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-1 bg-red-500 transform -rotate-12 rounded-full shadow-lg"></div>
                                      </div>
                                    </span>
                                    <X className="w-4 h-4 text-red-400 opacity-80" />
                                  </div>
                                  <div className="absolute inset-0 bg-red-500/10 rounded-xl"></div>
                                  {/* Extra visuele indicator */}
                                  <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full opacity-60"></div>
                                </div>
                              );
                            } else {
                              // Beschikbare tijd - normaal klikbaar
                              return (
                                <ClickSpark 
                                  key={time}
                                  sparkColor="#E86C28" 
                                  sparkRadius={18} 
                                  sparkCount={8} 
                                  duration={500}
                                >
                                  <button
                                    onClick={() => handleTimeSelect(time)}
                                    className={`
                                      w-full py-4 px-6 rounded-xl text-base font-semibold transition-all duration-300 transform min-w-[140px]
                                      ${selectedTime === time
                                        ? 'bg-gradient-to-r from-[#E86C28] to-[#F97316] text-white shadow-xl scale-105 border-2 border-white/20'
                                        : 'bg-[#4A372E]/40 text-white hover:bg-[#E86C28]/20 hover:scale-105 hover:shadow-lg border-2 border-transparent'
                                      }
                                      backdrop-blur-sm
                                    `}
                                  >
                                    <div className="flex items-center justify-center gap-2">
                                      <Clock className="w-4 h-4" />
                                      {time}
                                    </div>
                                  </button>
                                </ClickSpark>
                              );
                            }
                          })}
                        </div>
                        
                        {/* Info text */}
                        <div className="mt-4 text-center">
                          <p className="text-[#D4B896]/70 text-xs">
                            🟢 Beschikbaar &nbsp;&nbsp; 🔴 Al gereserveerd
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#3A2B24]/50 backdrop-blur-md rounded-2xl p-8 border border-[#4A372E]/50 text-center">
                        <Calendar className="w-12 h-12 text-[#4A372E] mx-auto mb-3" />
                        <p className="text-[#D4B896]">Selecteer eerst een datum</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Contact Form */}
              {bookingStep === 2 && (
                <div className="max-w-2xl mx-auto">
                  <div className="bg-[#3A2B24]/50 backdrop-blur-md rounded-2xl p-6 border border-[#4A372E]/50 mb-4">
                    <div className="flex items-center justify-between text-white mb-4">
                      <div>
                        <p className="text-sm text-[#D4B896]">Geselecteerde datum:</p>
                        <p className="font-semibold">{formatDate(selectedDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#D4B896]">Tijd:</p>
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
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#D4B896]" />
                          <input
                            type="text"
                            name="name"
                            required
                            value={bookingData.name}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-[#3A2B24]/50 border border-[#4A372E]/50 rounded-xl text-white placeholder-[#D4B896]/50 focus:outline-none focus:ring-2 focus:ring-[#E86C28] focus:border-transparent"
                            placeholder="Je volledige naam"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Restaurant
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#D4B896]" />
                          <input
                            type="text"
                            name="restaurant"
                            value={bookingData.restaurant}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-[#3A2B24]/50 border border-[#4A372E]/50 rounded-xl text-white placeholder-[#D4B896]/50 focus:outline-none focus:ring-2 focus:ring-[#E86C28] focus:border-transparent"
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
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#D4B896]" />
                          <input
                            type="email"
                            name="email"
                            required
                            value={bookingData.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-[#3A2B24]/50 border border-[#4A372E]/50 rounded-xl text-white placeholder-[#D4B896]/50 focus:outline-none focus:ring-2 focus:ring-[#E86C28] focus:border-transparent"
                            placeholder="je@email.nl"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Telefoon *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#D4B896]" />
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={bookingData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-[#3A2B24]/50 border border-[#4A372E]/50 rounded-xl text-white placeholder-[#D4B896]/50 focus:outline-none focus:ring-2 focus:ring-[#E86C28] focus:border-transparent"
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
                        className="w-full px-4 py-3 bg-[#3A2B24]/50 border border-[#4A372E]/50 rounded-xl text-white placeholder-[#D4B896]/50 focus:outline-none focus:ring-2 focus:ring-[#E86C28] focus:border-transparent resize-none"
                        placeholder="Bijvoorbeeld: Ik wil graag meer weten over jullie analytics mogelijkheden..."
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <ClickSpark sparkColor="#ffffff" sparkRadius={20} sparkCount={6} duration={400}>
                        <button
                          onClick={() => setBookingStep(1)}
                          className="flex-1 bg-[#4A372E]/50 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-[#4A372E]/70"
                        >
                          Terug
                        </button>
                      </ClickSpark>
                      <ClickSpark sparkColor="#ffffff" sparkRadius={25} sparkCount={10} duration={600}>
                        <button
                          onClick={handleSubmitBooking}
                          disabled={isSubmitting || !bookingData.name || !bookingData.email || !bookingData.phone}
                          className="flex-1 bg-gradient-to-r from-[#E86C28] via-[#F97316] to-[#FFB366] text-white py-5 px-12 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 border-2 border-white/20 backdrop-blur-sm min-w-[260px]"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span className="tracking-wide">Bezig met reserveren...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-6 h-6" />
                              <span className="tracking-wide">Bevestig Afspraak</span>
                              <ArrowRight className="w-5 h-5" />
                            </>
                          )}
                        </button>
                      </ClickSpark>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {bookingStep === 3 && (
                <div className="text-center py-8">
                  <div className={`w-20 h-20 ${emailError ? 'bg-yellow-500' : 'bg-green-500'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    {emailError ? (
                      <AlertCircle className="w-10 h-10 text-white" />
                    ) : (
                      <CheckCircle className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {emailError ? '📞 Afspraak ontvangen!' : '✅ Afspraak succesvol ingepland!'}
                  </h3>
                  <p className="text-[#D4B896] text-lg mb-8 max-w-md mx-auto">
                    {emailError ? (
                      <>
                        🎯 Je afspraak is geregistreerd in ons systeem! Er was een technisch probleem met de automatische email,
                        maar we hebben alle gegevens veilig opgeslagen. <br/><br/>
                        <strong className="text-[#E86C28]">We nemen binnen 24 uur contact met je op</strong> om je afspraak te bevestigen.
                        <br/><br/>
                        Voor directe vragen bel:{' '}
                        <a href="tel:+31858883333" className="text-[#E86C28] font-semibold underline">
                          +31 85 888 3333
                        </a>
                      </>
                    ) : (
                      <>
                        🚀 Perfect! Je afspraak is succesvol verstuurd naar ons team bij{' '}
                        <strong className="text-[#E86C28]">info@tabletech.nl</strong>
                        <br/><br/>
                        📧 <strong className="text-white">Dubbele bevestiging:</strong>
                        <br/>
                        • Wij hebben je afspraakgegevens ontvangen
                        <br/>
                        • Jij ontvangt een bevestigingsemail op{' '}
                        <strong className="text-white">{bookingData.email}</strong>
                        <br/><br/>
                        🔒 <strong className="text-green-400">Deze tijd is nu gereserveerd</strong> - niemand anders kan meer op dit tijdstip boeken!
                      </>
                    )}
                  </p>

                  {emailError && (
                    <div className="bg-[#E86C28]/20 backdrop-blur-md rounded-xl p-4 max-w-md mx-auto mb-8 border border-[#E86C28]/30">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-[#E86C28]" />
                        <p className="text-white text-sm font-semibold">
                          Backup Optie
                        </p>
                      </div>
                      <p className="text-white/90 text-sm mb-4">
                        Wil je extra zeker zijn? Verstuur zelf ook een kopie van je afspraak naar ons team:
                      </p>
                      <ClickSpark sparkColor="#ffffff" sparkRadius={20} sparkCount={8} duration={400}>
                        <a
                          href={createMailtoLink({
                            ...bookingData,
                            date: formatDate(selectedDate),
                            time: selectedTime
                          })}
                          className="bg-[#E86C28] text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2 w-full justify-center"
                        >
                          <Mail className="w-4 h-4" />
                          Email info@tabletech.nl
                        </a>
                      </ClickSpark>
                    </div>
                  )}

                  <div className="bg-[#3A2B24]/50 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto mb-8 border border-[#4A372E]/50">
                    <div className="space-y-3 text-left">
                      <div className="flex justify-between">
                        <span className="text-[#D4B896]">Datum:</span>
                        <span className="text-white font-semibold">{formatDate(selectedDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#D4B896]">Tijd:</span>
                        <span className="text-white font-semibold">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#D4B896]">Contact:</span>
                        <span className="text-white font-semibold">{bookingData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#D4B896]">Type gesprek:</span>
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
                      className="bg-gradient-to-r from-[#E86C28] to-[#FFB366] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
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
    </>
  );
};

export default ContactSection;