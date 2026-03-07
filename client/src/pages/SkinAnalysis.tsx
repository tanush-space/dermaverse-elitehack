import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, ScanLine, AlertTriangle, CheckCircle2, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SkinAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 4000);
  };

  return (
    <div className="space-y-10 pb-12">
      <div>
        <h1 className="text-5xl font-serif text-[#2C2A25] leading-tight">Clinical Analysis</h1>
        <p className="text-[#5A6B5D] mt-2 text-lg font-light">Upload a clear photo to initiate the neural vision scan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column - Upload Area */}
        <Card className="border-none shadow-xl shadow-[#2C2A25]/5 h-fit bg-white overflow-hidden">
          <CardHeader className="border-b border-[#EDE8E0]/50 pb-6">
            <CardTitle className="text-xl font-serif text-[#2C2A25]">Image Capture</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="border-2 border-dashed border-[#EDE8E0] rounded-[3rem] bg-[#FDFBF7] p-12 flex flex-col items-center justify-center text-center transition-all duration-500 hover:border-[#D97757]/50 hover:bg-[#F4EBE6]/50 cursor-pointer group relative overflow-hidden h-[450px]">
              
              {!isAnalyzing && !showResults && (
                <>
                  <div className="w-24 h-24 rounded-full bg-white shadow-sm border border-[#EDE8E0] flex items-center justify-center mb-8 group-hover:bg-[#F4EBE6] group-hover:border-[#D97757]/30 transition-colors relative z-10">
                    <UploadCloud className="w-10 h-10 text-[#5A6B5D] group-hover:text-[#D97757] transition-colors" />
                  </div>
                  <h3 className="text-2xl font-serif text-[#2C2A25] mb-3 relative z-10">Click or drag image here</h3>
                  <p className="text-[#5A6B5D] max-w-sm mx-auto mb-10 font-light relative z-10">
                    Ensure good lighting, no makeup, and a neutral expression for best AI accuracy.
                  </p>
                  <Button onClick={(e) => { e.stopPropagation(); handleAnalyze(); }} className="bg-[#2C2A25] text-white rounded-full px-10 h-14 text-base hover:bg-[#1A1916] shadow-xl relative z-10">
                    <ScanLine className="w-5 h-5 mr-3 text-[#D97757]" /> Start Analysis
                  </Button>
                </>
              )}

              {isAnalyzing && (
                <div className="absolute inset-0 bg-[#2C2A25] flex flex-col items-center justify-center text-[#FDFBF7] p-8 z-20">
                  <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />
                  <div className="relative w-72 h-72 rounded-full overflow-hidden mb-10 border-4 border-[#5A6B5D]/30 shadow-2xl">
                    <img src="https://picsum.photos/seed/face/400/400" alt="Scanning" referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-60 grayscale" />
                    
                    {/* Organic Scanning Glow */}
                    <motion.div 
                      className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#D97757]/40 to-transparent blur-xl mix-blend-overlay"
                      animate={{ top: ['-100%', '100%', '-100%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    {/* Fake bounding boxes */}
                    <motion.div className="absolute top-1/4 left-1/4 w-16 h-16 border border-[#D97757] rounded-full" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
                    <motion.div className="absolute bottom-1/3 right-1/4 w-12 h-12 border border-[#5A6B5D] rounded-full" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
                  </div>
                  <div className="flex items-center gap-4 text-xl font-serif italic text-[#EDE8E0]">
                    <Sparkles className="w-6 h-6 animate-pulse text-[#D97757]" />
                    Analyzing dermal layers...
                  </div>
                </div>
              )}

              {showResults && (
                <div className="absolute inset-0 bg-[#2C2A25] p-4 z-20">
                  <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />
                  <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative border border-[#5A6B5D]/30 shadow-2xl">
                    <img src="https://picsum.photos/seed/face/400/400" alt="Result" referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-90" />
                    
                    {/* Result overlays */}
                    <div className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-[#D97757] rounded-full bg-[#D97757]/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">Erythema</span>
                    </div>
                    <div className="absolute bottom-1/3 right-1/4 w-12 h-12 border-2 border-[#5A6B5D] rounded-full bg-[#5A6B5D]/20 backdrop-blur-sm" />
                    
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                      <Button variant="outline" className="bg-[#2C2A25]/80 border-white/20 text-white hover:bg-[#1A1916] backdrop-blur-md rounded-full px-8 h-12" onClick={() => setShowResults(false)}>
                        Retake
                      </Button>
                      <div className="bg-[#5A6B5D]/90 text-white px-6 py-3 rounded-full font-medium text-sm backdrop-blur-md flex items-center gap-3 border border-white/20 shadow-xl">
                        <CheckCircle2 className="w-5 h-5 text-[#EDE8E0]" /> Scan Complete
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Results */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-16 border border-[#EDE8E0] border-dashed rounded-[3rem] bg-white/50"
              >
                <div className="w-20 h-20 rounded-full bg-[#FDFBF7] border border-[#EDE8E0] flex items-center justify-center mb-6 shadow-sm">
                  <Sparkles className="w-8 h-8 text-[#5A6B5D]/30" />
                </div>
                <h3 className="text-2xl font-serif text-[#2C2A25] mb-3">Awaiting Image</h3>
                <p className="text-[#5A6B5D] text-base font-light max-w-xs leading-relaxed">Upload an image to see your detailed clinical analysis and personalized recommendations.</p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                {/* Severity Score */}
                <Card className="bg-[#D97757] text-white border-none shadow-xl shadow-[#D97757]/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                  <CardContent className="p-8 relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-[#F4EBE6] text-xs font-bold uppercase tracking-widest mb-2">Current Status</h3>
                        <div className="text-4xl font-serif">Mild Inflammation</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-white/30">
                        Attention Needed
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-[#F4EBE6]">Severity Index</span>
                        <span className="text-white text-lg font-serif">42/100</span>
                      </div>
                      <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-white rounded-full shadow-[0_0_10px_white]" 
                          initial={{ width: 0 }}
                          animate={{ width: '42%' }}
                          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detected Issues */}
                <Card className="border-none shadow-sm bg-white">
                  <CardHeader className="pb-4 border-b border-[#EDE8E0]/50">
                    <CardTitle className="text-xl font-serif text-[#2C2A25]">Detected Biomarkers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    {[
                      { label: 'Erythema (Redness)', value: 'Moderate', color: 'text-[#D97757]', bg: 'bg-[#F4EBE6]', icon: AlertTriangle },
                      { label: 'Post-Inflammatory Hyperpigmentation', value: 'Mild', color: 'text-[#8B7355]', bg: 'bg-[#FDFBF7]', icon: Sparkles },
                      { label: 'Skin Barrier Integrity', value: 'Good', color: 'text-[#5A6B5D]', bg: 'bg-[#E8EFEA]', icon: CheckCircle2 },
                    ].map((issue, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + (i * 0.1) }}
                        className="flex items-center justify-between p-4 rounded-[1.5rem] border border-[#EDE8E0] bg-[#FDFBF7] hover:border-[#D97757]/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shadow-sm", issue.bg)}>
                            <issue.icon className={cn("w-5 h-5", issue.color)} />
                          </div>
                          <span className="font-medium text-[#2C2A25] text-[15px]">{issue.label}</span>
                        </div>
                        <span className={cn("text-xs font-bold uppercase tracking-widest", issue.color)}>{issue.value}</span>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card className="border-[#5A6B5D]/20 bg-[#E8EFEA] shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-serif text-[#2C2A25]">AI Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4 mt-4">
                      <li className="flex items-start gap-4 text-[15px] text-[#2C2A25] font-light leading-relaxed">
                        <div className="w-6 h-6 rounded-full bg-[#5A6B5D] text-white flex items-center justify-center shrink-0 mt-0.5 font-serif text-sm shadow-sm">1</div>
                        <p>Pause active exfoliants (AHA/BHA) for 48 hours to allow barrier recovery.</p>
                      </li>
                      <li className="flex items-start gap-4 text-[15px] text-[#2C2A25] font-light leading-relaxed">
                        <div className="w-6 h-6 rounded-full bg-[#5A6B5D] text-white flex items-center justify-center shrink-0 mt-0.5 font-serif text-sm shadow-sm">2</div>
                        <p>Incorporate a ceramide-rich moisturizer in your evening routine.</p>
                      </li>
                    </ul>
                    <Button className="w-full mt-8 bg-[#2C2A25] hover:bg-[#1A1916] text-white rounded-full h-14 text-base shadow-xl">
                      Update Routine <ArrowRight className="w-5 h-5 ml-3" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
