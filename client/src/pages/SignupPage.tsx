import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Activity, ArrowRight, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GooglyEyes } from '@/components/GooglyEyes';
import { authAPI, tokenManager } from '@/lib/api';

export default function SignupPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authAPI.register(formData);
      
      // Save token and user to localStorage
      tokenManager.setToken(response.token);
      tokenManager.setUser(response.user);
      
      // Navigate to onboarding
      navigate('/onboarding');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white selection:bg-orange-500/30">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 neural-mesh opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-transparent to-slate-900/80 z-10" />
        
        <div className="relative z-20 max-w-lg flex flex-col items-center text-center">
          <div className="mb-8">
            <GooglyEyes size={80} color="#FDFBF7" pupilColor="#2C2A25" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Take control of your <br />
            <span className="text-orange-400">skin health journey.</span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed max-w-md">
            Create an account to start tracking, analyzing, and improving your skin with clinical-grade AI.
          </p>
          
          <div className="mt-12 space-y-6 w-full text-left bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10">
            {[
              "Personalized AI analysis",
              "Longitudinal progress tracking",
              "Environmental risk alerts",
              "Dermatologist-approved routines"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                </div>
                <span className="font-medium">{feature}</span>
              </div>
            ))}
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create an account</h1>
            <p className="text-slate-500">Start your preventive dermatology journey today.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  id="name" 
                  name="name"
                  type="text" 
                  placeholder="John Doe" 
                  className="pl-10 text-slate-900" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-10 text-slate-900" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 text-slate-900" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input type="checkbox" id="terms" required className="mt-1 w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
              <Label htmlFor="terms" className="font-normal text-slate-600 text-sm leading-relaxed cursor-pointer">
                I agree to the <a href="#" className="text-orange-600 hover:underline">Terms of Service</a> and <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>, including the processing of health data.
              </Label>
            </div>

            <Button type="submit" className="w-full h-12 text-base rounded-xl bg-orange-500 hover:bg-orange-600 text-white mt-4" disabled={isLoading}>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="ml-2 w-4 h-4" /></>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-slate-900 hover:text-orange-500">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
