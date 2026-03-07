import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Activity, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authAPI, tokenManager } from '@/lib/api';

const GooglyEye = ({ mouseX, mouseY, isClosed }: { mouseX: number, mouseY: number, isClosed: boolean }) => {
  const eyeRef = useRef<HTMLDivElement>(null);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isClosed || !eyeRef.current) {
      setPupilPos({ x: 0, y: 0 });
      return;
    }
    
    const rect = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
    // Calculate distance, capping it so the pupil stays inside the eye
    const maxDistance = rect.width / 2 - 10; // 10 is half the pupil width
    const distance = Math.min(
      Math.hypot(mouseX - eyeCenterX, mouseY - eyeCenterY) / 15,
      maxDistance
    );
    
    setPupilPos({
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    });
  }, [mouseX, mouseY, isClosed]);

  return (
    <div ref={eyeRef} className="relative w-16 h-16 rounded-full bg-[#F4EBE6] border-2 border-[#E8D5C4] flex items-center justify-center overflow-hidden shadow-lg">
      {isClosed ? (
        <div className="w-full h-1.5 bg-[#D97757] absolute top-1/2 -translate-y-1/2" />
      ) : (
        <motion.div 
          animate={{ x: pupilPos.x, y: pupilPos.y }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="w-6 h-6 bg-[#D97757] rounded-full"
        />
      )}
    </div>
  );
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authAPI.login(formData);
      
      // Save token and user to localStorage
      tokenManager.setToken(response.token);
      tokenManager.setUser(response.user);
      
      // Navigate to dashboard or onboarding based on completion status
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white selection:bg-orange-500/30">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex w-1/2 bg-[#0B1121] relative overflow-hidden items-center justify-center p-12">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 neural-mesh opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1121]/80 via-transparent to-[#0B1121]/90 z-10" />
        
        <div className="relative z-20 max-w-lg">
          {/* Googly Eyes Character */}
          <div className="flex gap-4 mb-8">
            <GooglyEye mouseX={mousePos.x} mouseY={mousePos.y} isClosed={isPasswordFocused && !showPassword} />
            <GooglyEye mouseX={mousePos.x} mouseY={mousePos.y} isClosed={isPasswordFocused && !showPassword} />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Your skin's digital twin, <br />
            <span className="text-orange-400">powered by intelligence.</span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Access your longitudinal skin health data, environmental risk factors, and personalized clinical guidance.
          </p>
          
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B1121] bg-slate-200 overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/skincareuser${i}/100/100`} 
                    alt={`User ${i}`} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-sm font-medium text-slate-400">
              Join 10,000+ early adopters
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <Link to="/" className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
          <Activity className="w-6 h-6 text-slate-900" />
          <span className="font-bold text-slate-900">DermaVerse</span>
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
            <p className="text-slate-500">Enter your credentials to access your dashboard.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-10 text-slate-900 placeholder:text-slate-400 bg-white border-slate-300 focus-visible:ring-orange-500"
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <a href="#" className="text-sm font-medium text-orange-600 hover:text-orange-500">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  id="password" 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="pl-10 pr-10 text-slate-900 placeholder:text-slate-400 bg-white border-slate-300 focus-visible:ring-orange-500"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
              <Label htmlFor="remember" className="font-normal text-slate-600 cursor-pointer">Remember me for 30 days</Label>
            </div>

            <Button type="submit" className="w-full h-12 text-base rounded-xl bg-slate-900 text-white hover:bg-slate-800 hover:text-white" disabled={isLoading}>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign in <ArrowRight className="ml-2 w-4 h-4" /></>
              )}
            </Button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-8">
            <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-orange-600 hover:text-orange-500">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
