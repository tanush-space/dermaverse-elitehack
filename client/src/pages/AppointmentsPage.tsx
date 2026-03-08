import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, Clock, Star, ChevronRight, Video, User, X, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AppointmentsPage() {
  const [selectedType, setSelectedType] = useState('All');
  const [clinics, setClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  
  // Booking modal state
  const [bookingModal, setBookingModal] = useState<{ open: boolean; clinic: any | null }>({ open: false, clinic: null });
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingStep, setBookingStep] = useState<'date' | 'time' | 'confirm'>('date');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Generate 14 dates from today
  const dateOptions = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  // Generate time slots (9 AM to 6 PM, 30-min intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const handleBookingClick = (clinic: any) => {
    setBookingModal({ open: true, clinic });
    setSelectedDate('');
    setSelectedTime('');
    setBookingStep('date');
    setBookingSuccess(false);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime || !bookingModal.clinic) return;

    const appointment = {
      id: Date.now(),
      clinic: bookingModal.clinic.name,
      doctor: bookingModal.clinic.doctor,
      specialty: bookingModal.clinic.specialty,
      date: selectedDate,
      time: selectedTime,
      type: bookingModal.clinic.type,
      bookingDate: new Date().toISOString()
    };

    // Save to localStorage
    const appointments = JSON.parse(localStorage.getItem('dermaverse_appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('dermaverse_appointments', JSON.stringify(appointments));

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingModal({ open: false, clinic: null });
      setBookingSuccess(false);
      setSelectedDate('');
      setSelectedTime('');
    }, 2000);
  };

  useEffect(() => {
    // Function to fetch healthcare facilities by location
    const fetchHealthcareFacilities = async (lat: number, lon: number) => {
      try {
        // Fetch dermatologists and hospitals using Overpass API (20km radius)
        const query = `
          [out:json];
          (
            node["healthcare"="doctor"]["healthcare:speciality"="dermatology"](around:20000,${lat},${lon});
            node["healthcare"="clinic"](around:20000,${lat},${lon});
            node["healthcare"="hospital"](around:20000,${lat},${lon});
          );
          out center;
        `;

        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: `data=${encodeURIComponent(query)}`
        });

        if (!response.ok) throw new Error('Failed to fetch facilities');
        
        const data = await response.json();
        
        // Transform API data into clinic format
        const facilities = data.elements?.map((element: any, idx: number) => ({
          id: element.id,
          name: element.tags?.name || 'Healthcare Facility',
          doctor: element.tags?.['contact:name'] || 'Dr. Available',
          specialty: element.tags?.['healthcare:speciality'] || 'General Healthcare',
          rating: (4.5 + Math.random() * 0.5).toFixed(1),
          reviews: Math.floor(Math.random() * 300) + 20,
          distance: `${Math.floor(Math.random() * 8) + 0.5} mi`,
          address: element.tags?.['addr:full'] || element.tags?.name || 'Location',
          image: `https://picsum.photos/seed/clinic${idx}/300/200`,
          available: ['Today, 2:00 PM', 'Tomorrow, 10:00 AM'],
          type: 'In-Person',
          lat: element.center?.lat || element.lat || lat,
          lon: element.center?.lon || element.lon || lon
        })) || [];

        // Add a virtual option
        const virtualClinic = {
          id: 999,
          name: 'DermaVerse Telehealth',
          doctor: 'Available Dermatologist',
          specialty: 'Virtual Consultation',
          rating: '4.8',
          reviews: 342,
          distance: 'Online',
          address: 'Virtual Consultation',
          image: 'https://picsum.photos/seed/telehealth/300/200',
          available: ['In 15 mins', 'Today, 4:30 PM'],
          type: 'Virtual',
          lat: lat,
          lon: lon
        };

        setUserLocation({ lat, lon });
        setClinics([...facilities.slice(0, 15), virtualClinic]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching healthcare facilities:', err);
        setLoading(false);
        // Fallback to default clinics
        setClinics([
          {
            id: 1,
            name: 'SkinHealth Institute',
            doctor: 'Dr. Priyanka Pandita',
            specialty: 'Board Certified Dermatologist',
            rating: 4.9,
            reviews: 128,
            distance: '1.2 mi',
            address: '450 Jammu',
            image: 'https://picsum.photos/seed/clinic1/300/200',
            available: ['Today, 2:00 PM', 'Tomorrow, 10:00 AM'],
            type: 'In-Person',
            lat: 28.62,
            lon: 77.21
          },
          {
            id: 999,
            name: 'DermaVerse Telehealth',
            doctor: 'Available Dermatologist',
            specialty: 'Virtual Consultation',
            rating: 4.8,
            reviews: 342,
            distance: 'Online',
            address: 'Virtual Consultation',
            image: 'https://picsum.photos/seed/telehealth/300/200',
            available: ['In 15 mins', 'Today, 4:30 PM'],
            type: 'Virtual',
            lat: 28.6139,
            lon: 77.2090
          }
        ]);
        setUserLocation({ lat: 28.6139, lon: 77.2090 });
      }
    };

    // Get user location
    const fetchLocationFromIP = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        await fetchHealthcareFacilities(data.latitude, data.longitude);
      } catch {
        // Fallback to default location
        await fetchHealthcareFacilities(28.6139, 77.2090);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await fetchHealthcareFacilities(position.coords.latitude, position.coords.longitude);
        },
        () => fetchLocationFromIP()
      );
    } else {
      fetchLocationFromIP();
    }
  }, []);

  const filteredClinics = selectedType === 'All' 
    ? clinics 
    : clinics.filter(c => c.type === selectedType);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Book Appointment</h1>
          <p className="text-slate-500 mt-1">{loading ? 'Finding healthcare providers near you...' : 'Connect with board-certified dermatologists in your area.'}</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {['All', 'In-Person', 'Virtual'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
                selectedType === type ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Interactive Map */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Card className="h-[400px] lg:h-[calc(100vh-12rem)] sticky top-24 overflow-hidden border-slate-200 p-0">
            {userLocation ? (
              <div className="w-full h-full relative bg-slate-100">
                {/* Map using OpenStreetMap tile layer */}
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${(userLocation.lon - 0.1).toFixed(4)},${(userLocation.lat - 0.1).toFixed(4)},${(userLocation.lon + 0.1).toFixed(4)},${(userLocation.lat + 0.1).toFixed(4)}&layer=mapnik&marker=${userLocation.lat.toFixed(4)},${userLocation.lon.toFixed(4)}`}
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Overlay Map Pins */}
                <div className="absolute inset-0 pointer-events-none">
                  {clinics.slice(0, 5).map((clinic, idx) => {
                    // Calculate position based on clinic lat/lon relative to user
                    const latDiff = clinic.lat - userLocation.lat;
                    const lonDiff = clinic.lon - userLocation.lon;
                    
                    // Convert to percentage (roughly)
                    const xPercent = 50 + (lonDiff * 500); // Scale factor
                    const yPercent = 50 - (latDiff * 500); // Scale factor
                    
                    return (
                      <div
                        key={clinic.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${Math.max(5, Math.min(95, xPercent))}%`,
                          top: `${Math.max(5, Math.min(95, yPercent))}%`
                        }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg border-2 border-white cursor-pointer"
                        >
                          <MapPin className="w-4 h-4" />
                        </motion.div>
                        <div className="absolute top-10 left-0 bg-white rounded-lg shadow-lg px-2 py-1 text-xs font-medium whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                          {clinic.name}
                        </div>
                      </div>
                    );
                  })}

                  {/* User Location Marker */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
                      <User className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                {/* Map Controls */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2 pointer-events-auto">
                  <a href={`https://www.openstreetmap.org/#map=14/${userLocation.lat}/${userLocation.lon}`} target="_blank" rel="noopener noreferrer">
                    <Button size="icon" variant="outline" className="bg-white shadow-sm rounded-xl w-10 h-10">🔍</Button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full" />
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Clinic List */}
        <div className="lg:col-span-2 order-1 lg:order-2 space-y-4">
          {filteredClinics.map((clinic, i) => (
            <motion.div
              key={clinic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="overflow-hidden border-slate-200 hover:border-orange-500/50 transition-colors group cursor-pointer">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-48 h-48 sm:h-auto relative shrink-0">
                    <img src={clinic.image} alt={clinic.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3">
                      <span className={cn(
                        "px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider backdrop-blur-md border",
                        clinic.type === 'Virtual' 
                          ? "bg-emerald-500/80 text-white border-emerald-400/50" 
                          : "bg-white/80 text-slate-900 border-white/50"
                      )}>
                        {clinic.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{clinic.name}</h3>
                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                          <span className="text-sm font-bold text-slate-700">{clinic.rating}</span>
                          <span className="text-xs text-slate-400">({clinic.reviews})</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-slate-600 text-sm mb-3">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{clinic.doctor}</span>
                        <span className="text-slate-300">•</span>
                        <span>{clinic.specialty}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                        <div className="flex items-center gap-1.5">
                          {clinic.type === 'Virtual' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                          {clinic.distance}
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="truncate">{clinic.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                      <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide">
                        {clinic.available.map((time, j) => (
                          <button key={j} className="whitespace-nowrap px-3 py-1.5 rounded-lg border border-orange-200 bg-orange-50 text-orange-700 text-xs font-semibold hover:bg-orange-100 transition-colors">
                            {time}
                          </button>
                        ))}
                      </div>
                      <Button 
                        onClick={() => handleBookingClick(clinic)}
                        className="shrink-0 bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-6">
                        Book <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModal.open && bookingModal.clinic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-md w-full shadow-2xl"
          >
            {bookingSuccess ? (
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-8 h-8 text-green-600" />
                </motion.div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Appointment Booked!</h2>
                <p className="text-slate-600 mb-2">{bookingModal.clinic.name}</p>
                <p className="text-sm text-slate-500">
                  {selectedDate} at {selectedTime}
                </p>
              </div>
            ) : (
              <>
                <div className="p-8 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Book Appointment</h2>
                    <p className="text-sm text-slate-600 mt-1">{bookingModal.clinic.name}</p>
                  </div>
                  <button
                    onClick={() => setBookingModal({ open: false, clinic: null })}
                    className="text-slate-400 hover:text-slate-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-8 space-y-6">
                  {bookingStep === 'date' && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Select Date
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {dateOptions.map((date, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
                            className={cn(
                              "p-3 rounded-lg text-sm font-medium transition-all border",
                              selectedDate === date.toISOString().split('T')[0]
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'border-slate-200 text-slate-700 hover:border-slate-900'
                            )}
                          >
                            <div className="text-xs opacity-70">
                              {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div>{date.getDate()}</div>
                          </button>
                        ))}
                      </div>
                      <Button
                        onClick={() => {
                          if (selectedDate) setBookingStep('time');
                        }}
                        disabled={!selectedDate}
                        className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl h-11"
                      >
                        Next: Select Time
                      </Button>
                    </div>
                  )}

                  {bookingStep === 'time' && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Select Time
                      </h3>
                      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                        {generateTimeSlots().map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                              "p-2 rounded-lg text-sm font-medium transition-all border",
                              selectedTime === time
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'border-slate-200 text-slate-700 hover:border-slate-900'
                            )}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setBookingStep('date')}
                          variant="outline"
                          className="flex-1 rounded-xl h-11"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={() => {
                            if (selectedTime) setBookingStep('confirm');
                          }}
                          disabled={!selectedTime}
                          className="flex-1 bg-slate-900 text-white hover:bg-slate-800 rounded-xl h-11"
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  )}

                  {bookingStep === 'confirm' && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-900">Confirm Booking</h3>
                      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-medium">Doctor</p>
                          <p className="font-semibold text-slate-900">{bookingModal.clinic.doctor}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-medium">Clinic</p>
                          <p className="font-semibold text-slate-900">{bookingModal.clinic.name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-medium">Date</p>
                            <p className="font-semibold text-slate-900">
                              {new Date(selectedDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-medium">Time</p>
                            <p className="font-semibold text-slate-900">{selectedTime}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setBookingStep('time')}
                          variant="outline"
                          className="flex-1 rounded-xl h-11"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleConfirmBooking}
                          className="flex-1 bg-green-600 text-white hover:bg-green-700 rounded-xl h-11"
                        >
                          Confirm & Book
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
