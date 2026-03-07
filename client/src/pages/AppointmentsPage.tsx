import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, Clock, Star, ChevronRight, Video, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CLINICS = [
  {
    id: 1,
    name: 'SkinHealth Institute',
    doctor: 'Dr. Emily Chen',
    specialty: 'Board Certified Dermatologist',
    rating: 4.9,
    reviews: 128,
    distance: '1.2 mi',
    address: '450 Sutter St, San Francisco',
    image: 'https://picsum.photos/seed/clinic1/300/200',
    available: ['Today, 2:00 PM', 'Tomorrow, 10:00 AM'],
    type: 'In-Person'
  },
  {
    id: 2,
    name: 'DermaVerse Telehealth',
    doctor: 'Dr. James Wilson',
    specialty: 'Clinical Dermatologist',
    rating: 4.8,
    reviews: 342,
    distance: 'Online',
    address: 'Virtual Consultation',
    image: 'https://picsum.photos/seed/doc2/300/200',
    available: ['In 15 mins', 'Today, 4:30 PM'],
    type: 'Virtual'
  },
  {
    id: 3,
    name: 'Pacific Dermatology',
    doctor: 'Dr. Sarah Jenkins',
    specialty: 'Cosmetic & Medical Dermatology',
    rating: 4.7,
    reviews: 89,
    distance: '3.5 mi',
    address: '2100 Webster St, San Francisco',
    image: 'https://picsum.photos/seed/clinic3/300/200',
    available: ['Wed, 9:00 AM', 'Thu, 1:00 PM'],
    type: 'In-Person'
  }
];

export default function AppointmentsPage() {
  const [selectedType, setSelectedType] = useState('All');

  const filteredClinics = selectedType === 'All' 
    ? CLINICS 
    : CLINICS.filter(c => c.type === selectedType);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Book Appointment</h1>
          <p className="text-slate-500 mt-1">Connect with board-certified dermatologists.</p>
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
        {/* Left Column - Map Placeholder */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Card className="h-[400px] lg:h-[calc(100vh-12rem)] sticky top-24 overflow-hidden border-slate-200 p-0">
            <div className="w-full h-full bg-slate-100 relative">
              <img src="https://picsum.photos/seed/map/800/1200" alt="Map" referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-60 grayscale" />
              
              {/* Fake Map Pins */}
              <div className="absolute top-1/3 left-1/4">
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg border-2 border-white transform -translate-x-1/2 -translate-y-1/2">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
              <div className="absolute top-1/2 right-1/3">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg border-2 border-white transform -translate-x-1/2 -translate-y-1/2">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <Button size="icon" variant="outline" className="bg-white shadow-sm rounded-xl w-10 h-10">+</Button>
                <Button size="icon" variant="outline" className="bg-white shadow-sm rounded-xl w-10 h-10">-</Button>
              </div>
            </div>
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
                      <Button className="shrink-0 bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-6">
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
    </div>
  );
}
