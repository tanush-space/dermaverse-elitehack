import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Calendar, Filter, ChevronLeft, ChevronRight, Activity, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const timelineData = [
  { date: 'Aug 1', severity: 85, adherence: 90, note: 'Started new routine' },
  { date: 'Aug 15', severity: 78, adherence: 85, note: '' },
  { date: 'Sep 1', severity: 72, adherence: 95, note: 'Added Niacinamide' },
  { date: 'Sep 15', severity: 65, adherence: 100, note: '' },
  { date: 'Oct 1', severity: 58, adherence: 90, note: 'Dermatologist visit' },
  { date: 'Oct 15', severity: 45, adherence: 80, note: 'Missed 3 days' },
  { date: 'Nov 1', severity: 42, adherence: 95, note: 'Current' },
];

const images = [
  { date: 'Aug 1', url: 'https://picsum.photos/seed/face1/300/300', label: 'Baseline' },
  { date: 'Sep 1', url: 'https://picsum.photos/seed/face2/300/300', label: 'Month 1' },
  { date: 'Oct 1', url: 'https://picsum.photos/seed/face3/300/300', label: 'Month 2' },
  { date: 'Nov 1', url: 'https://picsum.photos/seed/face4/300/300', label: 'Current' },
];

export default function TimelinePage() {
  const [selectedRange, setSelectedRange] = useState('3m');
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Longitudinal Timeline</h1>
          <p className="text-slate-500 mt-1">Track your progress and treatment efficacy over time.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {['1m', '3m', '6m', '1y'].map(range => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
                selectedRange === range ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">Severity vs. Adherence</CardTitle>
            <p className="text-sm text-slate-500 mt-1">Correlation between routine adherence and acne severity.</p>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Filter className="w-4 h-4 mr-2" /> Filter Data
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Line yAxisId="left" type="monotone" dataKey="severity" name="Severity Score" stroke="#F97316" strokeWidth={3} dot={{ r: 4, fill: '#F97316', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="adherence" name="Routine Adherence %" stroke="#0F172A" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: '#0F172A', strokeWidth: 2, stroke: '#fff' }} />
                
                {/* Event Markers */}
                {timelineData.filter(d => d.note).map((d, i) => (
                  <ReferenceLine key={i} x={d.date} yAxisId="left" stroke="#CBD5E1" strokeDasharray="3 3" label={{ position: 'top', value: d.note, fill: '#64748B', fontSize: 10 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm font-medium text-slate-600">Severity Score (Lower is better)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-900" />
              <span className="text-sm font-medium text-slate-600">Routine Adherence %</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Before / After Slider */}
        <Card className="overflow-hidden border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center justify-between">
              <span>Visual Comparison</span>
              <div className="flex gap-2">
                <span className="text-xs font-medium bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-600">Aug 1</span>
                <span className="text-xs font-medium bg-slate-900 px-2 py-1 rounded-md text-white">Nov 1</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 relative h-[400px] bg-slate-100 select-none">
            {/* Base Image (After) */}
            <div className="absolute inset-0 w-full h-full">
              <img src={images[3].url} alt="Current" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            
            {/* Overlay Image (Before) */}
            <div 
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderValue}%` }}
            >
              <img src={images[0].url} alt="Baseline" referrerPolicy="no-referrer" className="absolute inset-0 w-[100vw] h-full object-cover max-w-none" style={{ width: '100%' }} />
            </div>
            
            {/* Slider Handle */}
            <div 
              className="absolute inset-y-0 flex items-center justify-center w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.3)]"
              style={{ left: `calc(${sliderValue}% - 2px)` }}
            >
              <div className="w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center">
                <div className="flex gap-1">
                  <ChevronLeft className="w-3 h-3 text-slate-600" />
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </div>
              </div>
            </div>
            
            {/* Invisible Range Input for accessibility and easier drag */}
            <input 
              type="range" 
              min="0" max="100" 
              value={sliderValue} 
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
            />
          </CardContent>
        </Card>

        {/* Image Gallery */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-900">Scan History</CardTitle>
              <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {images.map((img, i) => (
                <div key={i} className="group relative rounded-xl overflow-hidden border border-slate-200 aspect-square cursor-pointer">
                  <img src={img.url} alt={img.label} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-medium text-sm">{img.label}</p>
                    <p className="text-slate-300 text-xs flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" /> {img.date}
                    </p>
                  </div>
                  <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
