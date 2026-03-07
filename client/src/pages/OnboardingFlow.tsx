import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft, UploadCloud, Check, Sun, Wind, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { authAPI } from '@/lib/api';

const SKIN_TYPES = [
  { id: 'Balanced', label: 'Balanced', desc: 'Neither too oily nor too dry' },
  { id: 'Dry', label: 'Dry', desc: 'Flaky, rough, or tight feeling' },
  { id: 'Oily', label: 'Oily', desc: 'Shiny, greasy, prone to breakouts' },
  { id: 'Combination', label: 'Combination', desc: 'Oily T-zone, dry or normal cheeks' },
  { id: 'Sensitive', label: 'Sensitive', desc: 'Prone to redness, itching, or burning' },
];

const CONCERNS = [
  'Acne & Blemishes', 'Hyperpigmentation', 'Fine Lines & Wrinkles', 
  'Redness & Rosacea', 'Dryness & Flaking', 'Sun Damage', 
  'Large Pores', 'Fungal Acne', 'Eczema / Dermatitis'
];

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [skinType, setSkinType] = useState<string | null>(null);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [sunExposure, setSunExposure] = useState('Moderate');
  const [pollutionExposure, setPollutionExposure] = useState('High');
  const [dietPattern, setDietPattern] = useState('Balanced / Omnivore');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSunExposureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value <= 33) setSunExposure('Minimal');
    else if (value <= 66) setSunExposure('Moderate');
    else setSunExposure('High');
  };

  const handlePollutionExposureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPollutionExposure(value <= 50 ? 'Low' : 'High');
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Submit onboarding data
      setIsUploading(true);
      setError('');

      try {
        const formData = new FormData();
        formData.append('skinType', skinType || '');
        formData.append('primaryConcerns', JSON.stringify(concerns));
        formData.append('sunExposure', sunExposure);
        formData.append('pollutionExposure', pollutionExposure);
        formData.append('dietPattern', dietPattern);
        
        if (selectedFile) {
          formData.append('rawPhoto', selectedFile);
        }

        await authAPI.completeOnboarding(formData);
        navigate('/dashboard');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to complete onboarding. Please try again.');
        setIsUploading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleConcern = (concern: string) => {
    setConcerns(prev => 
      prev.includes(concern) ? prev.filter(c => c !== concern) : [...prev, concern]
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex selection:bg-[#D97757]/30">
      <div className="absolute inset-0 bg-noise pointer-events-none z-50 mix-blend-overlay" />
      
      {/* Left Panel - Imagery */}
      <div className="hidden lg:flex w-1/3 bg-[#5A6B5D] relative overflow-hidden flex-col justify-between p-12 text-[#FDFBF7]">
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D97757] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#FDFBF7]" />
          </div>
          <span className="text-2xl font-serif font-medium tracking-tight">DermaVerse</span>
        </div>

        <div className="relative z-10">
          <p className="text-[#EDE8E0] uppercase tracking-widest text-xs font-medium mb-4">Step {step} of 4</p>
          <h2 className="text-5xl font-serif leading-tight mb-6">
            {step === 1 && "Let's establish your baseline."}
            {step === 2 && "What are your primary focuses?"}
            {step === 3 && "How does your environment impact you?"}
            {step === 4 && "Capture your starting point."}
          </h2>
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#D97757]"
              initial={{ width: `${((step - 1) / 4) * 100}%` }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full opacity-30 mix-blend-overlay">
          <img src={`https://picsum.photos/seed/onboard${step}/800/1200`} alt="Texture" referrerPolicy="no-referrer" className="w-full h-full object-cover transition-opacity duration-1000" />
        </div>
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 relative overflow-y-auto">
        <div className="w-full max-w-2xl">
          
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#D97757]" />
              <span className="font-serif font-medium text-xl text-[#2C2A25]">DermaVerse</span>
            </div>
            <span className="text-sm font-medium text-[#5A6B5D]">Step {step}/4</span>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="mb-12">
                  <h1 className="text-4xl lg:text-5xl font-serif text-[#2C2A25] mb-4">How would you describe your skin?</h1>
                  <p className="text-[#5A6B5D] text-lg font-light">This helps our AI calibrate its analysis algorithms.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SKIN_TYPES.map(type => (
                    <Card 
                      key={type.id}
                      className={cn(
                        "p-6 cursor-pointer transition-all duration-300",
                        skinType === type.id 
                          ? "border-[#D97757] bg-[#F4EBE6] shadow-md ring-1 ring-[#D97757]" 
                          : "border-[#EDE8E0] hover:border-[#D97757]/50 hover:shadow-md"
                      )}
                      onClick={() => setSkinType(type.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-serif text-xl text-[#2C2A25]">{type.label}</h3>
                        {skinType === type.id && <Check className="w-5 h-5 text-[#D97757]" />}
                      </div>
                      <p className="text-sm text-[#5A6B5D] leading-relaxed">{type.desc}</p>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="mb-12">
                  <h1 className="text-4xl lg:text-5xl font-serif text-[#2C2A25] mb-4">Select your primary concerns</h1>
                  <p className="text-[#5A6B5D] text-lg font-light">Choose all that apply to personalize your longitudinal tracking.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {CONCERNS.map(concern => (
                    <button
                      key={concern}
                      onClick={() => toggleConcern(concern)}
                      className={cn(
                        "px-6 py-4 rounded-full text-base font-medium transition-all border duration-300",
                        concerns.includes(concern) 
                          ? "bg-[#5A6B5D] text-white border-[#5A6B5D] shadow-md scale-105" 
                          : "bg-white text-[#5A6B5D] border-[#EDE8E0] hover:border-[#5A6B5D]/50"
                      )}
                    >
                      {concern}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="mb-12">
                  <h1 className="text-4xl lg:text-5xl font-serif text-[#2C2A25] mb-4">Lifestyle & Environment</h1>
                  <p className="text-[#5A6B5D] text-lg font-light">External factors heavily influence barrier health.</p>
                </div>
                
                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-serif flex items-center gap-3 text-[#2C2A25]"><Sun className="w-5 h-5 text-[#D97757]" /> Daily Sun Exposure</Label>
                      <span className="text-sm font-medium text-[#D97757] bg-[#F4EBE6] px-3 py-1 rounded-full">{sunExposure}</span>
                    </div>
                    <input 
                      type="range" 
                      className="w-full accent-[#D97757]" 
                      min="0" 
                      max="100" 
                      defaultValue="50" 
                      onChange={handleSunExposureChange}
                    />
                    <div className="flex justify-between text-xs font-medium text-[#5A6B5D] uppercase tracking-widest">
                      <span>Minimal</span>
                      <span>High</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-serif flex items-center gap-3 text-[#2C2A25]"><Wind className="w-5 h-5 text-[#5A6B5D]" /> Urban Pollution Exposure</Label>
                      <span className="text-sm font-medium text-[#5A6B5D] bg-[#E8EFEA] px-3 py-1 rounded-full">{pollutionExposure}</span>
                    </div>
                    <input 
                      type="range" 
                      className="w-full accent-[#5A6B5D]" 
                      min="0" 
                      max="100" 
                      defaultValue="75" 
                      onChange={handlePollutionExposureChange}
                    />
                    <div className="flex justify-between text-xs font-medium text-[#5A6B5D] uppercase tracking-widest">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-lg font-serif flex items-center gap-3 text-[#2C2A25]"><Coffee className="w-5 h-5 text-[#8B7355]" /> Diet Pattern</Label>
                    <select 
                      className="w-full h-14 rounded-2xl border border-[#EDE8E0] bg-white px-6 text-[#2C2A25] focus:ring-2 focus:ring-[#D97757] outline-none font-medium text-lg appearance-none"
                      value={dietPattern}
                      onChange={(e) => setDietPattern(e.target.value)}
                    >
                      <option>Balanced / Omnivore</option>
                      <option>Plant-based / Vegan</option>
                      <option>High Dairy / Sugar</option>
                      <option>Keto / Low Carb</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="mb-12">
                  <h1 className="text-4xl lg:text-5xl font-serif text-[#2C2A25] mb-4">Baseline Analysis</h1>
                  <p className="text-[#5A6B5D] text-lg font-light">Upload a clear, well-lit photo of your face or concern area.</p>
                </div>
                
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="border border-[#EDE8E0] rounded-[3rem] bg-white p-16 flex flex-col items-center justify-center text-center transition-all duration-500 hover:border-[#D97757] hover:shadow-xl cursor-pointer group relative overflow-hidden">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
                  <div className="w-24 h-24 rounded-full bg-[#FDFBF7] border border-[#EDE8E0] flex items-center justify-center mb-8 group-hover:bg-[#F4EBE6] group-hover:border-[#D97757]/30 transition-colors relative z-10">
                    <UploadCloud className="w-10 h-10 text-[#5A6B5D] group-hover:text-[#D97757] transition-colors" />
                  </div>
                  <h3 className="text-2xl font-serif text-[#2C2A25] mb-3 relative z-10">
                    {selectedFile ? selectedFile.name : "Click or drag image here"}
                  </h3>
                  <p className="text-[#5A6B5D] max-w-sm mx-auto mb-8 font-light relative z-10">
                    {selectedFile ? "File selected! Click Continue to proceed." : "Ensure good lighting, no makeup, and a neutral expression for best AI accuracy."}
                  </p>
                  <Button 
                    variant="outline" 
                    className="rounded-full px-10 h-14 text-base relative z-10" 
                    type="button"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    {selectedFile ? "Change File" : "Browse Files"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-16 pt-8 border-t border-[#EDE8E0]">
            <Button 
              variant="ghost" 
              onClick={handleBack} 
              className={cn("text-[#5A6B5D] uppercase tracking-widest text-xs", step === 1 && "invisible")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            
            <Button 
              onClick={handleNext} 
              className="bg-[#2C2A25] hover:bg-[#1A1916] text-[#FDFBF7] rounded-full px-10 h-14 text-base shadow-xl"
              disabled={(step === 1 && !skinType) || (step === 2 && concerns.length === 0) || isUploading}
            >
              {isUploading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </div>
              ) : (
                <>
                  {step === 4 ? 'Complete Setup' : 'Continue'} <ArrowRight className="ml-3 w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
