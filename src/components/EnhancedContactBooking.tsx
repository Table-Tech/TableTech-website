import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

interface AppointmentResponse {
  success: boolean;
  referenceNumber?: string;
  message?: string;
  error?: string;
}

const EnhancedContactBooking: React.FC = () => {
  const { t } = useTranslation();
  
  // Form state
  const [formData, setFormData] = useState({
    restaurantName: '',
    contactPerson: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    message: ''
  });

  // UI state
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Start from tomorrow
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  // Fetch available time slots when date changes
  useEffect(() => {
    if (formData.date) {
      fetchAvailableSlots(formData.date);
    }
  }, [formData.date]);

  // Fetch blocked dates for current month
  useEffect(() => {
    const fetchBlockedDates = async () => {
      if (formData.date) {
        const date = new Date(formData.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/v2/appointments/blocked-dates?year=${year}&month=${month}`
          );
          const data = await response.json();
          if (data.success) {
            setBlockedDates(data.blockedDates);
          }
        } catch (error) {
          console.error('Error fetching blocked dates:', error);
        }
      }
    };

    fetchBlockedDates();
  }, [formData.date]);

  const fetchAvailableSlots = async (date: string) => {
    setLoadingSlots(true);
    setFormData(prev => ({ ...prev, time: '' })); // Reset selected time

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/v2/appointments/slots?date=${date}`
      );
      const data = await response.json();

      if (data.success) {
        setAvailableSlots(data.slots);
      } else {
        setAvailableSlots([]);
        setErrorMessage('Geen tijdsloten beschikbaar voor deze datum');
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      setAvailableSlots([]);
      setErrorMessage('Fout bij het ophalen van beschikbare tijden');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errorMessage) setErrorMessage('');
  };

  const handleTimeSelect = (time: string) => {
    setFormData(prev => ({ ...prev, time }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/v2/appointments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Idempotency-Key': `${Date.now()}-${Math.random()}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data: AppointmentResponse = await response.json();

      if (data.success && data.referenceNumber) {
        setSubmitStatus('success');
        setReferenceNumber(data.referenceNumber);
        
        // Reset form
        setFormData({
          restaurantName: '',
          contactPerson: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          message: ''
        });
        setAvailableSlots([]);
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Er is een fout opgetreden');
        
        // If slot is no longer available, refresh slots
        if (data.error?.includes('niet meer beschikbaar')) {
          fetchAvailableSlots(formData.date);
        }
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Netwerkfout. Probeer het later opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  const isDateBlocked = (date: string) => {
    return blockedDates.includes(date);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Plan uw TableTech Demo
      </h2>

      {submitStatus === 'success' && referenceNumber && (
        <div className="mb-6 p-6 bg-green-50 border-2 border-green-300 rounded-lg">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <h3 className="text-xl font-bold text-green-800">Afspraak Bevestigd!</h3>
          </div>
          <p className="text-green-700 mb-3">
            Uw demo afspraak is succesvol ingepland. U ontvangt een bevestigingsmail.
          </p>
          <div className="bg-white p-4 rounded border-2 border-green-200">
            <p className="text-sm text-gray-600 mb-1">Uw referentienummer:</p>
            <p className="text-2xl font-mono font-bold text-green-600">{referenceNumber}</p>
            <p className="text-xs text-gray-500 mt-2">
              Bewaar dit nummer voor uw administratie
            </p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded">
          <div className="flex items-center">
            <XCircle className="w-6 h-6 text-red-500 mr-2" />
            <p className="text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Restaurant Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant Naam *
            </label>
            <input
              type="text"
              name="restaurantName"
              value={formData.restaurantName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Uw restaurant naam"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contactpersoon *
            </label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Uw naam"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="email@voorbeeld.nl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefoon
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="06-12345678"
            />
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Selecteer Datum *
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            min={getMinDate()}
            max={getMaxDate()}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              isDateBlocked(formData.date) ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          {isDateBlocked(formData.date) && (
            <p className="text-sm text-red-600 mt-1">
              Deze datum is niet beschikbaar
            </p>
          )}
        </div>

        {/* Time Slot Selection */}
        {formData.date && !isDateBlocked(formData.date) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline w-4 h-4 mr-1" />
              Selecteer Tijd *
            </label>
            
            {loadingSlots ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <p className="text-gray-600 mt-2">Beschikbare tijden laden...</p>
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => slot.isAvailable && handleTimeSelect(slot.time)}
                    disabled={!slot.isAvailable}
                    className={`
                      relative py-3 px-4 rounded-lg font-medium transition-all duration-200 group
                      ${slot.isAvailable 
                        ? formData.time === slot.time
                          ? 'bg-orange-500 text-white shadow-lg transform scale-105 border-2 border-orange-600'
                          : 'bg-white text-gray-800 border-2 border-gray-300 hover:border-orange-400 hover:shadow-md hover:bg-orange-50'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-300 opacity-60'
                      }
                    `}
                  >
                    <span className="relative z-10">
                      {slot.time}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  Geen tijdsloten beschikbaar voor deze datum
                </p>
              </div>
            )}
          </div>
        )}

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bericht (Optioneel)
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Heeft u specifieke vragen of onderwerpen die u wilt bespreken?"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading || !formData.time || isDateBlocked(formData.date)}
            className={`
              px-8 py-3 rounded-lg font-semibold text-white transition-all
              ${loading || !formData.time || isDateBlocked(formData.date)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                Afspraak wordt ingepland...
              </span>
            ) : (
              'Plan Demo Afspraak'
            )}
          </button>
        </div>
      </form>

      {/* Privacy Notice */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Privacy:</strong> Uw persoonlijke gegevens worden niet opgeslagen in onze database. 
          U ontvangt alleen een uniek referentienummer voor uw afspraak.
        </p>
      </div>
    </div>
  );
};

export default EnhancedContactBooking;