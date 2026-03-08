import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  Calendar, Filter, ChevronLeft, ChevronRight, Activity, Camera, 
  Sun, Moon, Sunrise, Edit3, Plus, Check, X, RotateCcw, User,
  MapPin, Coffee, Wind, Droplets, Star, Clock, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Types for our data structures
interface OnboardingData {
  skinType: string;
  primaryConcerns: string[];
  sunExposure: string;
  pollutionExposure: string;
  dietPattern: string;
  completedAt: string;
}

interface RoutineItem {
  id: string;
  name: string;
  completed: boolean;
  order: number;
}

interface DailyRoutines {
  morning: RoutineItem[];
  evening: RoutineItem[];
  night: RoutineItem[];
}

interface ProgressData {
  date: string;
  adherence: number;
  morningCompleted: number;
  eveningCompleted: number;
  nightCompleted: number;
  totalRoutines: number;
}

// Sample data
const timelineData = [
  { date: 'Dec 1', severity: 85, adherence: 90, note: 'Started new routine' },
  { date: 'Dec 8', severity: 78, adherence: 85, note: '' },
  { date: 'Dec 15', severity: 72, adherence: 95, note: 'Added Niacinamide' },
  { date: 'Dec 22', severity: 65, adherence: 100, note: '' },
  { date: 'Dec 29', severity: 58, adherence: 90, note: 'Holiday break' },
  { date: 'Jan 5', severity: 52, adherence: 80, note: 'Back to routine' },
  { date: 'Jan 12', severity: 45, adherence: 95, note: 'Seeing improvement' },
  { date: 'Today', severity: 42, adherence: 88, note: 'Current' },
];

const progressData: ProgressData[] = [
  { date: 'Jan 1', adherence: 85, morningCompleted: 4, eveningCompleted: 3, nightCompleted: 2, totalRoutines: 9 },
  { date: 'Jan 2', adherence: 90, morningCompleted: 5, eveningCompleted: 4, nightCompleted: 3, totalRoutines: 12 },
  { date: 'Jan 3', adherence: 75, morningCompleted: 3, eveningCompleted: 4, nightCompleted: 2, totalRoutines: 9 },
  { date: 'Jan 4', adherence: 95, morningCompleted: 5, eveningCompleted: 5, nightCompleted: 3, totalRoutines: 13 },
  { date: 'Jan 5', adherence: 80, morningCompleted: 4, eveningCompleted: 3, nightCompleted: 3, totalRoutines: 10 },
  { date: 'Jan 6', adherence: 100, morningCompleted: 5, eveningCompleted: 5, nightCompleted: 4, totalRoutines: 14 },
  { date: 'Jan 7', adherence: 88, morningCompleted: 4, eveningCompleted: 4, nightCompleted: 3, totalRoutines: 11 },
];

const images = [
  { date: 'Dec 1', url: 'https://picsum.photos/seed/face1/300/300', label: 'Baseline' },
  { date: 'Dec 15', url: 'https://picsum.photos/seed/face2/300/300', label: '2 Weeks' },
  { date: 'Jan 1', url: 'https://picsum.photos/seed/face3/300/300', label: '1 Month' },
  { date: 'Today', url: 'https://picsum.photos/seed/face4/300/300', label: 'Current' },
];

const defaultRoutines: DailyRoutines = {
  morning: [
    { id: '1', name: 'Gentle Cleanser', completed: false, order: 1 },
    { id: '2', name: 'Vitamin C Serum', completed: false, order: 2 },
    { id: '3', name: 'Moisturizer', completed: false, order: 3 },
    { id: '4', name: 'SPF 30+ Sunscreen', completed: false, order: 4 },
  ],
  evening: [
    { id: '5', name: 'Oil Cleanser', completed: false, order: 1 },
    { id: '6', name: 'Water-based Cleanser', completed: false, order: 2 },
    { id: '7', name: 'Niacinamide Serum', completed: false, order: 3 },
    { id: '8', name: 'Moisturizer', completed: false, order: 4 },
  ],
  night: [
    { id: '9', name: 'Retinol (3x/week)', completed: false, order: 1 },
    { id: '10', name: 'Hydrating Serum', completed: false, order: 2 },
    { id: '11', name: 'Night Cream', completed: false, order: 3 },
  ],
};

export default function TimelinePage() {
  const [selectedRange, setSelectedRange] = useState('3m');
  const [sliderValue, setSliderValue] = useState(50);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [routines, setRoutines] = useState<DailyRoutines>(defaultRoutines);
  const [editingRoutine, setEditingRoutine] = useState<string | null>(null);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [addingTo, setAddingTo] = useState<string | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    // Load onboarding data
    const savedOnboarding = localStorage.getItem('onboardingData');
    if (savedOnboarding) {
      setOnboardingData(JSON.parse(savedOnboarding));
    } else {
      // Mock data if not found
      setOnboardingData({
        skinType: 'Combination',
        primaryConcerns: ['Acne & Blemishes', 'Hyperpigmentation', 'Large Pores'],
        sunExposure: 'Moderate',
        pollutionExposure: 'High',
        dietPattern: 'Balanced / Omnivore',
        completedAt: '2024-12-01'
      });
    }

    // Load routines
    const savedRoutines = localStorage.getItem('skinCareRoutines');
    if (savedRoutines) {
      setRoutines(JSON.parse(savedRoutines));
    }

    // Load today's progress
    const today = new Date().toISOString().split('T')[0];
    const todayProgress = localStorage.getItem(`progress_${today}`);
    if (todayProgress) {
      const progress = JSON.parse(todayProgress);
      setRoutines(progress);
    }
  }, []);

  // Save routines to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('skinCareRoutines', JSON.stringify(routines));
    
    // Save today's progress
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`progress_${today}`, JSON.stringify(routines));
  }, [routines]);

  const toggleRoutineCompletion = (routineType: keyof DailyRoutines, itemId: string) => {
    setRoutines(prev => ({
      ...prev,
      [routineType]: prev[routineType].map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const addNewRoutineItem = (routineType: keyof DailyRoutines) => {
    if (!newRoutineName.trim()) return;
    
    const newItem: RoutineItem = {
      id: Date.now().toString(),
      name: newRoutineName.trim(),
      completed: false,
      order: routines[routineType].length + 1
    };

    setRoutines(prev => ({
      ...prev,
      [routineType]: [...prev[routineType], newItem]
    }));

    setNewRoutineName('');
    setAddingTo(null);
  };

  const removeRoutineItem = (routineType: keyof DailyRoutines, itemId: string) => {
    setRoutines(prev => ({
      ...prev,
      [routineType]: prev[routineType].filter(item => item.id !== itemId)
    }));
  };

  const moveRoutineItem = (routineType: keyof DailyRoutines, fromIndex: number, toIndex: number) => {
    setRoutines(prev => {
      const items = [...prev[routineType]];
      const [movedItem] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, movedItem);
      
      // Update order numbers
      const updatedItems = items.map((item, index) => ({
        ...item,
        order: index + 1
      }));

      return {
        ...prev,
        [routineType]: updatedItems
      };
    });
  };

  const calculateDailyAdherence = () => {
    const totalItems = Object.values(routines).flat().length;
    const completedItems = Object.values(routines).flat().filter(item => item.completed).length;
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  const getRoutineIcon = (type: string) => {
    switch (type) {
      case 'morning': return <Sunrise className="w-5 h-5" />;
      case 'evening': return <Sun className="w-5 h-5" />;
      case 'night': return <Moon className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getRoutineColor = (type: string) => {
    switch (type) {
      case 'morning': return 'from-amber-400 to-orange-500';
      case 'evening': return 'from-orange-400 to-red-500';
      case 'night': return 'from-indigo-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  }; 
 return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Skincare Journey</h1>
          <p className="text-slate-500 mt-1">Track your progress, manage routines, and see your transformation.</p>
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

      {/* Onboarding Profile Summary */}
      {onboardingData && (
        <Card className="border-slate-200 shadow-sm bg-gradient-to-r from-slate-50 to-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-slate-600" />
                Your Profile
              </CardTitle>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                Since {new Date(onboardingData.completedAt).toLocaleDateString()}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Droplets className="w-4 h-4" />
                  Skin Type
                </div>
                <p className="text-lg font-semibold text-slate-900">{onboardingData.skinType}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Sun className="w-4 h-4" />
                  Sun Exposure
                </div>
                <p className="text-lg font-semibold text-slate-900">{onboardingData.sunExposure}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Wind className="w-4 h-4" />
                  Environment
                </div>
                <p className="text-lg font-semibold text-slate-900">{onboardingData.pollutionExposure} Pollution</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Coffee className="w-4 h-4" />
                  Diet
                </div>
                <p className="text-lg font-semibold text-slate-900">{onboardingData.dietPattern}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-3">
                <Star className="w-4 h-4" />
                Primary Concerns
              </div>
              <div className="flex flex-wrap gap-2">
                {onboardingData.primaryConcerns.map((concern, index) => (
                  <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                    {concern}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Routines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(routines).map(([routineType, items]) => (
          <Card key={routineType} className="border-slate-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2 capitalize">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getRoutineColor(routineType)} text-white`}>
                    {getRoutineIcon(routineType)}
                  </div>
                  {routineType} Routine
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAddingTo(routineType)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-sm text-slate-500">
                {items.filter(item => item.completed).length} of {items.length} completed
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-all",
                      item.completed 
                        ? "bg-green-50 border-green-200 text-green-800" 
                        : "bg-white border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <button
                      onClick={() => toggleRoutineCompletion(routineType as keyof DailyRoutines, item.id)}
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                        item.completed 
                          ? "bg-green-500 border-green-500 text-white" 
                          : "border-slate-300 hover:border-slate-400"
                      )}
                    >
                      {item.completed && <Check className="w-3 h-3" />}
                    </button>
                    
                    <span className={cn(
                      "flex-1 font-medium",
                      item.completed && "line-through text-green-600"
                    )}>
                      {item.name}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      {index > 0 && (
                        <button
                          onClick={() => moveRoutineItem(routineType as keyof DailyRoutines, index, index - 1)}
                          className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                      )}
                      {index < items.length - 1 && (
                        <button
                          onClick={() => moveRoutineItem(routineType as keyof DailyRoutines, index, index + 1)}
                          className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => removeRoutineItem(routineType as keyof DailyRoutines, item.id)}
                        className="p-1 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {addingTo === routineType && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2"
                >
                  <Input
                    placeholder="Add new routine step..."
                    value={newRoutineName}
                    onChange={(e) => setNewRoutineName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addNewRoutineItem(routineType as keyof DailyRoutines)}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={() => addNewRoutineItem(routineType as keyof DailyRoutines)}
                    disabled={!newRoutineName.trim()}
                  >
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setAddingTo(null);
                      setNewRoutineName('');
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Progress Summary */}
      <Card className="border-slate-200 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-slate-900">{calculateDailyAdherence()}%</span>
            <span className="text-sm text-slate-600">Overall Adherence</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${calculateDailyAdherence()}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            {Object.entries(routines).map(([type, items]) => {
              const completed = items.filter(item => item.completed).length;
              const total = items.length;
              const percentage = total > 0 ? (completed / total) * 100 : 0;
              
              return (
                <div key={type} className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r ${getRoutineColor(type)} flex items-center justify-center text-white`}>
                    {getRoutineIcon(type)}
                  </div>
                  <div className="text-sm font-medium text-slate-900 capitalize">{type}</div>
                  <div className="text-xs text-slate-600">{completed}/{total}</div>
                  <div className="w-full bg-slate-200 rounded-full h-1 mt-1">
                    <div 
                      className={`h-full bg-gradient-to-r ${getRoutineColor(type)} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Progress Chart */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-slate-900">7-Day Progress Overview</CardTitle>
          <p className="text-sm text-slate-500">Your routine adherence and completion trends</p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 12 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 12 }} 
                  domain={[0, 100]} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #E2E8F0', 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)' 
                  }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="adherence"
                  stroke="#3B82F6"
                  fill="url(#adherenceGradient)"
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient id="adherenceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Main Chart */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">Long-term Progress</CardTitle>
            <p className="text-sm text-slate-500 mt-1">Correlation between routine adherence and skin improvement.</p>
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
                <span className="text-xs font-medium bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-600">Dec 1</span>
                <span className="text-xs font-medium bg-slate-900 px-2 py-1 rounded-md text-white">Today</span>
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