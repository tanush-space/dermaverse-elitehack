import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, ArrowUpRight, Droplets, Sun, Wind, 
  Calendar, ChevronRight, AlertCircle, CheckCircle2, Bot, Heart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useAuth } from '@/hooks/useAuth';

const data = [
  { name: 'Week 1', score: 65 },
  { name: 'Week 2', score: 68 },
  { name: 'Week 3', score: 74 },
  { name: 'Week 4', score: 72 },
  { name: 'Week 5', score: 79 },
  { name: 'Week 6', score: 82 },
  { name: 'Week 7', score: 85 },
  { name: 'Week 8', score: 88 },
];

export default function DashboardHome() {
  const [envData, setEnvData] = React.useState({
  uv: '--',
  aqi: '--',
  humidity: '--',
  city: 'Detecting...'
});
const [derms, setDerms] = React.useState<any[]>([]);
React.useEffect(() => {
  // Function to fetch weather data given lat/lon
  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=8f89e9b51b2d575fdc59c3ab0a27e91a&units=metric`
      );

      if (!weatherRes.ok) {
        throw new Error(`Weather API error: ${weatherRes.status}`);
      }

      const weatherData = await weatherRes.json();

      const airRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=8f89e9b51b2d575fdc59c3ab0a27e91a`
      );

      if (!airRes.ok) {
        throw new Error(`Air pollution API error: ${airRes.status}`);
      }

      const airData = await airRes.json();

      // Validate data before accessing
      const aqi = airData?.list?.[0]?.main?.aqi || '--';
      const humidity = weatherData?.main?.humidity ? weatherData.main.humidity + "%" : '--';
      const city = weatherData?.name || 'Unknown';

      setEnvData({
        uv: "--",
        aqi: aqi,
        humidity: humidity,
        city: city
      });

      // Fetch dermatologists
      const dermRes = await fetch(
        `https://overpass-api.de/api/interpreter?data=[out:json];node["healthcare"="doctor"]["healthcare:speciality"="dermatology"](around:5000,${lat},${lon});out;`
      );
      const dermData = await dermRes.json();
      setDerms(dermData.elements?.slice(0, 5) || []);

    } catch (err) {
      console.error("Error fetching environmental data:", err);
      setEnvData({
        uv: "--",
        aqi: "--",
        humidity: "--",
        city: "Unable to load"
      });
    }
  };

  // Function to fetch location from IP as fallback
  const fetchLocationFromIP = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (!res.ok) throw new Error('IP geolocation failed');
      const data = await res.json();
      console.log("Using IP-based location:", data.city, data.latitude, data.longitude);
      await fetchWeatherData(data.latitude, data.longitude);
    } catch (err) {
      console.error("IP geolocation fallback failed:", err);
      // Set default location (e.g., New Delhi)
      await fetchWeatherData(28.6139, 77.2090);
    }
  };

  // Try geolocation if available
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log("Using GPS location:", lat, lon);
        await fetchWeatherData(lat, lon);
      },
      (error) => {
        console.error("Geolocation error:", error);
        // Fallback to IP-based geolocation
        console.log("Falling back to IP-based geolocation...");
        fetchLocationFromIP();
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 60000
      }
    );
  } else {
    // Geolocation not available, use IP fallback
    console.log("Geolocation not available, using IP-based location...");
    fetchLocationFromIP();
  }

}, []);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#D97757] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const firstName = user?.name?.split(' ')[0] || 'User';
  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-serif text-[#2C2A25] leading-tight">
            Good morning, <span className="italic text-[#5A6B5D]">{firstName}.</span>
          </h1>
          <p className="text-[#5A6B5D] mt-2 text-lg font-light">
            {user?.onboardingCompleted 
              ? "Your skin is looking vibrant today. Let's review your metrics."
              : "Welcome! Complete your onboarding to get personalized insights."
            }
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-[#EDE8E0] shadow-sm">
          <Calendar className="w-4 h-4 text-[#D97757]" />
          <span className="text-sm font-medium text-[#2C2A25] uppercase tracking-widest">{currentDate}</span>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Health Score */}
        <Card className="col-span-1 md:col-span-1 bg-[#5A6B5D] text-[#FDFBF7] border-none overflow-hidden relative shadow-xl shadow-[#5A6B5D]/20">
          <div className="absolute top-0 right-0 p-6 opacity-10 mix-blend-overlay">
            <Heart className="w-40 h-40" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-[#EDE8E0] font-medium text-xs uppercase tracking-widest">Overall Vitality</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-end gap-3">
              <span className="text-7xl font-serif tracking-tighter">88</span>
              <span className="text-xl text-[#EDE8E0] mb-3 font-light">/100</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-[#FDFBF7] font-medium bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-md">
              <ArrowUpRight className="w-4 h-4 text-[#D97757]" />
              <span>+6 pts from last month</span>
            </div>
            <div className="mt-8 h-1 w-full bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#D97757] rounded-full shadow-[0_0_10px_#D97757]"
                initial={{ width: 0 }}
                animate={{ width: '88%' }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Environmental Widget */}
        <Card className="col-span-1 md:col-span-2 flex flex-col justify-between bg-[#F4EBE6] border-none shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium text-[#D97757] uppercase tracking-widest">Local Environment</CardTitle>
              <span className="text-xs font-medium bg-white/60 backdrop-blur-sm text-[#2C2A25] px-3 py-1.5 rounded-full border border-white">{envData.city}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6 h-full items-center">
              <div className="flex flex-col items-center justify-center p-6 rounded-[2rem] bg-white shadow-sm border border-white/50">
                <Sun className="w-8 h-8 text-[#D97757] mb-3" />
                <span className="text-3xl font-serif text-[#2C2A25]">{envData.uv}</span>
                <span className="text-[10px] font-bold text-[#D97757] uppercase tracking-widest mt-2">High UV</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 rounded-[2rem] bg-white shadow-sm border border-white/50">
                <Wind className="w-8 h-8 text-[#5A6B5D] mb-3" />
                <span className="text-3xl font-serif text-[#2C2A25]">{envData.aqi}</span>
                <span className="text-[10px] font-bold text-[#5A6B5D] uppercase tracking-widest mt-2">Good AQI</span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 rounded-[2rem] bg-white shadow-sm border border-white/50">
                <Droplets className="w-8 h-8 text-[#8B7355] mb-3" />
                <span className="text-3xl font-serif text-[#2C2A25]">{envData.humidity}</span>
                <span className="text-[10px] font-bold text-[#8B7355] uppercase tracking-widest mt-2">Humidity</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Charts & Insights */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Insight */}
          <Card className="border-[#D97757]/20 bg-white shadow-sm overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#D97757]" />
            <CardContent className="p-8 flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-[#F4EBE6] flex items-center justify-center shrink-0 border border-[#D97757]/20">
                <Sparkles className="w-6 h-6 text-[#D97757]" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-[#2C2A25] mb-2">Inflammation Reduced</h3>
                <p className="text-[#5A6B5D] text-[15px] leading-relaxed font-light">
                  Your facial erythema (redness) has decreased by 12% since last week. The new niacinamide serum appears to be effective. Maintain current routine, but increase SPF due to high UV index today.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Progress Chart */}
          <Card className="bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-xl font-serif text-[#2C2A25]">8-Week Progress</CardTitle>
              <select className="text-xs font-medium uppercase tracking-widest border border-[#EDE8E0] rounded-full bg-[#FDFBF7] px-4 py-2 outline-none focus:ring-2 focus:ring-[#D97757]/20 text-[#5A6B5D] appearance-none cursor-pointer">
                <option>Overall Score</option>
                <option>Acne Severity</option>
                <option>Hydration</option>
              </select>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: '280px' }} className="mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D97757" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#D97757" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDE8E0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#5A6B5D', fontSize: 12, fontFamily: 'Outfit' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5A6B5D', fontSize: 12, fontFamily: 'Outfit' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', fontFamily: 'Outfit' }}
                      itemStyle={{ color: '#2C2A25', fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#D97757" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions & Appointments */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-[#2C2A25]">Today's Ritual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { time: 'Morning', task: 'Gentle Cleanser + Vit C', done: true },
                { time: 'Morning', task: 'SPF 50 (Reapply at 2PM)', done: false, alert: true },
                { time: 'Evening', task: 'Double Cleanse + Retinol', done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-[1.5rem] border border-[#EDE8E0] bg-[#FDFBF7] hover:border-[#D97757]/30 transition-colors cursor-pointer group">
                  {item.done ? (
                    <div className="w-6 h-6 rounded-full bg-[#5A6B5D] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-[#EDE8E0] shrink-0 mt-0.5 group-hover:border-[#D97757] transition-colors" />
                  )}
                  <div className="flex-1">
                    <p className={cn("text-[15px] font-medium", item.done ? "text-[#5A6B5D] line-through opacity-70" : "text-[#2C2A25]")}>{item.task}</p>
                    <p className="text-[11px] uppercase tracking-widest text-[#5A6B5D] mt-1 font-medium">{item.time}</p>
                  </div>
                  {item.alert && <AlertCircle className="w-5 h-5 text-[#D97757] shrink-0" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Appointment */}
          <Card className="bg-[#2C2A25] text-[#FDFBF7] border-none shadow-xl shadow-[#2C2A25]/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-medium text-[#EDE8E0] uppercase tracking-widest">Next Consultation</CardTitle>
            </CardHeader>
            <CardContent>



idk what to do lol. gimme ready to copy paste stuff
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-[#1A1916] overflow-hidden border-2 border-[#5A6B5D]">
                  <img src="https://picsum.photos/seed/doc/100/100" alt="Doctor" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-serif text-xl text-white">Dr. Priyanka Pandita</p>
                  <p className="text-xs text-[#EDE8E0] uppercase tracking-widest mt-1">Board Certified</p>
                </div>
              </div>
              <div className="bg-[#1A1916] rounded-2xl p-4 flex items-center justify-between mb-6 border border-white/5">
                <div className="flex items-center gap-3 text-sm text-[#FDFBF7]">
                  <Calendar className="w-4 h-4 text-[#D97757]" />
                  <span className="font-medium">March 18, 10:00 AM</span>
                </div>
                <span className="text-[10px] font-bold bg-[#D97757]/20 text-[#D97757] px-3 py-1.5 rounded-full uppercase tracking-widest border border-[#D97757]/30">Telehealth</span>
              </div>
              <Button variant="outline" className="w-full border-white/20 text-[#0e0e0e] hover:bg-white hover:text-[#2C2A25] rounded-full h-12">
                Manage Booking
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

