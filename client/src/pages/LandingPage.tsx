import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Heart, Droplets, Sun, Wind, Activity, ScanFace, ShieldCheck, Microscope, Award, Users } from 'lucide-react';
import { GooglyEyes } from '@/components/GooglyEyes';
import { LiquidGradient } from '@/components/LiquidGradient';
import { Parallax } from '@/components/Parallax';

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax transforms
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div ref={containerRef} className="bg-[#FDFBF7] text-[#2C2A25] selection:bg-[#D97757]/30 font-sans">
      <div className="fixed inset-0 bg-noise pointer-events-none z-50 mix-blend-overlay opacity-40" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 bg-white/40 backdrop-blur-2xl border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] transition-all">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D97757] flex items-center justify-center shadow-lg shadow-[#D97757]/20">
              <Sparkles className="w-5 h-5 text-[#FDFBF7]" />
            </div>
            <span className="text-2xl font-serif font-medium tracking-tight text-[#2C2A25]">DermaVerse</span>
          </div>
          <div className="hidden md:flex items-center gap-12 text-xs font-medium uppercase tracking-[0.2em] text-[#5A6B5D]">
            <a href="#philosophy" className="hover:text-[#D97757] transition-colors">Philosophy</a>
            <a href="#intelligence" className="hover:text-[#D97757] transition-colors">Intelligence</a>
            <a href="#trust" className="hover:text-[#D97757] transition-colors">Clinical Trust</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="hidden sm:inline-flex uppercase tracking-widest text-xs text-[#5A6B5D] hover:text-[#2C2A25] hover:bg-white/50 backdrop-blur-md">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="uppercase tracking-widest text-xs bg-[#2C2A25] text-[#FDFBF7] hover:bg-[#1A1916] rounded-full px-6 shadow-lg shadow-[#2C2A25]/20">Begin Journey</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative pt-24">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#FDFBF7]">
          <LiquidGradient />
          <Parallax offset={-50} className="relative z-20 text-center px-4 w-full max-w-7xl mx-auto flex flex-col items-center pt-20">
            <motion.div 
              style={{ opacity: opacityHero, scale: scaleHero }}
              className="w-full flex flex-col items-center"
            >
              <motion.h1 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-[12vw] md:text-[10vw] font-serif leading-[0.85] text-[#2C2A25] tracking-tighter mb-8 relative"
              >
              SKINCARE, <br />
              <span className="italic font-light text-[#D97757]">REDEFINED.</span>
              
              {/* Floating Googly Eyes 1 */}
              <motion.div 
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-12 -right-10 md:-right-20 hidden md:block"
              >
                <GooglyEyes size={50} color="#F4EBE6" pupilColor="#D97757" />
              </motion.div>

              {/* Floating Googly Eyes 2 */}
              <motion.div 
                animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-4 -left-12 md:-left-24 hidden md:block"
              >
                <GooglyEyes size={40} color="#E8EFEA" pupilColor="#5A6B5D" />
              </motion.div>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-lg md:text-2xl text-[#5A6B5D] max-w-2xl font-light leading-relaxed mb-12"
            >
              Clinical-grade AI analysis meets personalized dermatology. We track, analyze, and adapt to your unique biology in real-time.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 relative"
            >
              <Link to="/signup">
                <Button size="lg" className="h-16 px-12 text-sm uppercase tracking-[0.2em] bg-[#D97757] text-white hover:bg-[#C26547] transition-all duration-500 rounded-full shadow-xl shadow-[#D97757]/20">
                  Start Your Analysis
                </Button>
              </Link>
              <Link to="#philosophy">
                <Button size="lg" variant="outline" className="h-16 px-12 text-sm uppercase tracking-[0.2em] border-white/50 text-[#5A6B5D] hover:bg-white/60 transition-all duration-500 rounded-full bg-white/30 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
                  Learn More
                </Button>
              </Link>
            </motion.div>
            </motion.div>
          </Parallax>
        </section>

        {/* Marquee Section */}
        <section className="py-8 border-y border-[#EDE8E0] bg-white overflow-hidden flex relative z-20">
          <motion.div 
            className="flex whitespace-nowrap gap-16 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          >
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-16 items-center text-2xl font-serif italic text-[#5A6B5D]">
                <span>Clinical Precision</span>
                <span className="w-2 h-2 rounded-full bg-[#D97757]" />
                <span>Holistic Approach</span>
                <span className="w-2 h-2 rounded-full bg-[#D97757]" />
                <span>Longitudinal Tracking</span>
                <span className="w-2 h-2 rounded-full bg-[#D97757]" />
                <span>Environmental Adaptation</span>
                <span className="w-2 h-2 rounded-full bg-[#D97757]" />
              </div>
            ))}
          </motion.div>
        </section>

        {/* Philosophy Section */}
        <section id="philosophy" className="py-32 md:py-48 px-6 bg-[#FDFBF7] relative z-20">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
              >
                <h2 className="text-5xl md:text-7xl font-serif leading-[1.1] mb-8 text-[#2C2A25]">
                  Beyond the <br />
                  <span className="italic text-[#D97757]">surface.</span>
                </h2>
                <p className="text-xl text-[#5A6B5D] leading-relaxed font-light mb-8">
                  Traditional skincare relies on guesswork and generic routines. DermaVerse introduces a paradigm shift: continuous, data-driven analysis of your skin's evolving needs.
                </p>
                <div className="space-y-6">
                  {[
                    { icon: ScanFace, title: "Micro-level Analysis", desc: "Detecting changes invisible to the naked eye." },
                    { icon: Activity, title: "Longitudinal Tracking", desc: "Understanding your skin's behavior over time." },
                    { icon: ShieldCheck, title: "Clinical Precision", desc: "Dermatologist-grade insights in your pocket." }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#F4EBE6] flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-[#D97757]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-[#2C2A25]">{item.title}</h4>
                        <p className="text-[#5A6B5D]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              <div className="relative h-[600px] rounded-[2rem] overflow-hidden shadow-2xl shadow-[#2C2A25]/5 border border-[#EDE8E0] group">
                <Parallax offset={100} className="absolute inset-0 w-full h-[120%] -top-[10%]">
                  <img 
                    src="https://picsum.photos/seed/skincaremodel/800/1200" 
                    alt="Model" 
                    referrerPolicy="no-referrer" 
                    className="w-full h-full object-cover" 
                  />
                </Parallax>
                
                {/* Peeking Googly Eyes */}
                <div className="absolute top-1/4 -right-8 transition-transform duration-700 group-hover:-translate-x-12 z-10">
                  <GooglyEyes size={35} color="#FDFBF7" pupilColor="#5A6B5D" />
                </div>

                {/* Glassmorphism Overlay */}
                <Parallax offset={-20} className="absolute bottom-8 left-8 right-8 z-20">
                  <div className="bg-white/40 backdrop-blur-2xl border border-white/60 p-6 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#5A6B5D]/80 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wider text-[#2C2A25]">Barrier Health</p>
                        <p className="text-base font-serif text-[#5A6B5D] italic">Improving steadily</p>
                      </div>
                    </div>
                  </div>
                </Parallax>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Clinical Validation Section */}
        <section id="trust" className="py-32 px-6 bg-white border-y border-[#EDE8E0] relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto relative z-10">
            <div className="text-center mb-20">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-[#D97757] text-xs font-bold uppercase tracking-[0.2em] mb-4 block"
              >
                Why Trust Us
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl md:text-6xl font-serif text-[#2C2A25] mb-6"
              >
                Clinically Validated
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-[#5A6B5D] max-w-2xl mx-auto font-light"
              >
                Built by dermatologists, powered by advanced neural networks, and trusted by thousands.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: ScanFace, title: "Dermatologist Developed", desc: "Our algorithms are trained on over 2 million clinically verified images, supervised by board-certified dermatologists." },
                { icon: ShieldCheck, title: "HIPAA Compliant", desc: "Your health data is encrypted end-to-end. We never sell your personal information or images to third parties." },
                { icon: Heart, title: "Evidence-Based", desc: "Every recommendation is backed by peer-reviewed dermatological research and clinical trials." }
              ].map((item, i) => (
                <Parallax key={i} offset={i === 1 ? 40 : 0} className="h-full">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="bg-[#FDFBF7] rounded-[2rem] p-10 border border-[#EDE8E0] hover:shadow-xl hover:shadow-[#2C2A25]/5 transition-all duration-500 h-full"
                  >
                    <div className="w-16 h-16 rounded-full bg-white border border-[#EDE8E0] flex items-center justify-center mb-6 shadow-sm">
                      <item.icon className="w-8 h-8 text-[#5A6B5D]" />
                    </div>
                    <h3 className="text-2xl font-serif text-[#2C2A25] mb-4">{item.title}</h3>
                    <p className="text-[#5A6B5D] leading-relaxed font-light">{item.desc}</p>
                  </motion.div>
                </Parallax>
              ))}
            </div>
          </div>
        </section>

        {/* Intelligence Bento Grid */}
        <section id="intelligence" className="py-32 px-6 bg-[#FDFBF7]">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-24">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-[#D97757] text-xs font-bold uppercase tracking-[0.2em] mb-4 block"
              >
                The Engine
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl md:text-7xl font-serif text-[#2C2A25] mb-6"
              >
                A Symphony of Data
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-[#5A6B5D] max-w-2xl mx-auto font-light"
              >
                We don't just look at your skin. We analyze your environment, your habits, and your history.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">
              {/* Large Feature */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="md:col-span-2 rounded-[2rem] bg-white border border-[#EDE8E0] p-12 relative overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-500"
              >
                <div className="relative z-10 w-full md:w-2/3">
                  <div className="w-14 h-14 rounded-full bg-[#F4EBE6] flex items-center justify-center mb-8 border border-[#D97757]/20">
                    <ScanFace className="w-6 h-6 text-[#D97757]" />
                  </div>
                  <h3 className="text-4xl font-serif text-[#2C2A25] mb-4">Neural Vision Analysis</h3>
                  <p className="text-[#5A6B5D] text-lg leading-relaxed">Our clinical-grade AI detects over 40 distinct biomarkers, from subtle erythema to micro-pigmentation, predicting flare-ups before they surface.</p>
                </div>
                <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-30 group-hover:opacity-60 transition-opacity duration-700 mix-blend-multiply overflow-hidden">
                  <Parallax offset={-40} className="absolute inset-0 w-full h-[120%] -top-[10%]">
                    <img src="https://picsum.photos/seed/abstracttech/600/600" alt="Abstract" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </Parallax>
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
                </div>
                
                {/* Hidden Googly Eyes that appear on hover */}
                <div className="absolute right-12 bottom-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                    <GooglyEyes size={45} color="#FDFBF7" pupilColor="#D97757" />
                </div>
              </motion.div>

              {/* Small Feature 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="rounded-[2rem] bg-[#5A6B5D] p-10 relative overflow-hidden group shadow-sm"
              >
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30 shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
                    <Sun className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-white mb-3">Environmental Sync</h3>
                    <p className="text-white/80 leading-relaxed font-light">Real-time adaptation to local UV, humidity, and AQI affecting your skin barrier.</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>

              {/* Small Feature 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="rounded-[2rem] bg-[#D97757] p-10 relative overflow-hidden group shadow-sm"
              >
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30 shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
                    <Droplets className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-white mb-3">Barrier Tracking</h3>
                    <p className="text-white/90 leading-relaxed font-light">Monitor your stratum corneum health longitudinally with precise hydration metrics.</p>
                  </div>
                </div>
              </motion.div>

              {/* Medium Feature */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="md:col-span-2 rounded-[2rem] bg-[#2C2A25] p-12 text-[#FDFBF7] relative overflow-hidden flex items-center group shadow-sm"
              >
                <div className="w-full md:w-1/2 pr-8 relative z-10">
                  <h3 className="text-4xl font-serif mb-4">Dermatologist Connected</h3>
                  <p className="text-[#EDE8E0] text-lg leading-relaxed mb-8 font-light">Share your rich, longitudinal data directly with board-certified professionals for precise interventions and prescription management.</p>
                  <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white hover:text-[#2C2A25] rounded-full px-8">
                    Explore Network
                  </Button>
                </div>
                <div className="hidden md:block w-1/2 h-full absolute right-0 top-0">
                  <img src="https://picsum.photos/seed/doctorconsult/600/400" alt="Doctor" referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#2C2A25] via-[#2C2A25]/80 to-transparent" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="py-32 px-6 bg-white border-y border-[#EDE8E0] overflow-hidden relative">
          <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none" />
          <div className="max-w-[1400px] mx-auto relative z-10">
            <div className="text-center mb-20">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-[#D97757] text-xs font-bold uppercase tracking-[0.2em] mb-4 block"
              >
                The Protocol
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl md:text-6xl font-serif text-[#2C2A25] mb-6"
              >
                Your Journey to Clarity
              </motion.h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Initial Scan", desc: "Take a guided selfie. Our AI analyzes your skin across 40+ parameters instantly.", icon: ScanFace },
                { step: "02", title: "Contextualize", desc: "Connect your location and lifestyle data for environmental correlation.", icon: Sun },
                { step: "03", title: "Personalized Protocol", desc: "Receive a dynamic routine that adapts daily to your skin's changing needs.", icon: Droplets },
                { step: "04", title: "Track & Refine", desc: "Log progress and let the algorithm optimize your regimen over time.", icon: Activity }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.15, type: "spring", stiffness: 100 }}
                  className="relative group h-full"
                >
                  <div className="bg-[#FDFBF7] rounded-[2rem] p-8 border border-[#EDE8E0] h-full flex flex-col hover:shadow-2xl hover:shadow-[#D97757]/10 transition-all duration-500 relative z-10 overflow-hidden">
                    {/* Background Number */}
                    <Parallax offset={-30} className="absolute -top-6 -right-4 pointer-events-none select-none">
                      <div className="text-[120px] font-serif font-black text-[#EDE8E0] opacity-30 group-hover:text-[#D97757]/10 transition-colors duration-500 leading-none">
                        {item.step}
                      </div>
                    </Parallax>
                    
                    <div className="w-14 h-14 rounded-full bg-white border border-[#EDE8E0] shadow-sm flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform duration-500">
                      <item.icon className="w-6 h-6 text-[#D97757]" />
                    </div>
                    
                    <div className="relative z-10 mt-auto">
                      <h3 className="text-2xl font-serif text-[#2C2A25] mb-3">{item.title}</h3>
                      <p className="text-[#5A6B5D] leading-relaxed font-light text-sm">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stories Section */}
        <section className="py-32 px-6 bg-[#FDFBF7] relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto relative z-10">
            <div className="text-center mb-20">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-[#D97757] text-xs font-bold uppercase tracking-[0.2em] mb-4 block"
              >
                Real Results
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl md:text-6xl font-serif text-[#2C2A25] mb-6"
              >
                Skin Stories
              </motion.h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Elena R.", issue: "Chronic Rosacea", quote: "DermaVerse didn't just give me a routine; it gave me an understanding of my triggers. The environmental sync is a game-changer.", img: "https://picsum.photos/seed/user1/400/400" },
                { name: "Marcus T.", issue: "Barrier Damage", quote: "I was over-exfoliating without realizing it. The micro-level analysis caught the barrier degradation before it became severe.", img: "https://picsum.photos/seed/user2/400/400" },
                { name: "Sarah J.", issue: "Adult Acne", quote: "Finally, a platform that connects my daily logs with my dermatologist. My prescription was adjusted based on real data, not just a 15-minute visit.", img: "https://picsum.photos/seed/user3/400/400" }
              ].map((story, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="bg-white border border-[#EDE8E0] rounded-[2rem] p-8 relative group hover:shadow-xl hover:shadow-[#2C2A25]/5 transition-all duration-500"
                >
                  <Parallax offset={15} className="w-16 h-16 rounded-full overflow-hidden mb-6 border-2 border-[#F4EBE6]">
                    <img src={story.img} alt={story.name} referrerPolicy="no-referrer" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </Parallax>
                  <p className="text-lg font-serif italic text-[#5A6B5D] mb-6 leading-relaxed">"{story.quote}"</p>
                  <div>
                    <h4 className="font-medium text-[#2C2A25]">{story.name}</h4>
                    <p className="text-xs text-[#D97757] uppercase tracking-wider mt-1">{story.issue}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 bg-[#D97757] text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay z-10" />
          <LiquidGradient colors={['bg-[#C26547]/80', 'bg-[#F4EBE6]/30', 'bg-[#2C2A25]/20', 'bg-[#FDFBF7]/40']} opacity={0.8} />
          
          <Parallax offset={-30} className="max-w-[1000px] mx-auto text-center relative z-20">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-16 md:p-24 rounded-[3rem] shadow-2xl overflow-hidden group">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl font-serif leading-[1.1] mb-8 relative z-10"
              >
                Ready to meet <br />
                <span className="italic font-light">your skin?</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-white/90 mb-12 max-w-2xl mx-auto font-light relative z-10"
              >
                Join thousands of members who have transformed their skin health through clinical intelligence.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="relative z-10"
              >
                <Link to="/signup">
                  <Button size="lg" className="h-16 px-12 text-sm uppercase tracking-[0.2em] bg-white text-[#D97757] hover:bg-[#2C2A25] hover:text-white transition-all duration-500 rounded-full shadow-xl">
                    Begin Your Journey
                  </Button>
                </Link>
              </motion.div>

              {/* Hidden Googly Eyes that peek from top on hover */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:top-8 transition-all duration-700 z-0">
                  <GooglyEyes size={60} color="#FDFBF7" pupilColor="#D97757" />
              </div>
            </div>
          </Parallax>
        </section>

        {/* Footer */}
        <footer className="bg-[#2C2A25] text-[#FDFBF7] py-20 px-6">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-16 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#D97757] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-serif font-medium tracking-tight">DermaVerse</span>
              </div>
              <p className="text-[#EDE8E0] max-w-sm font-light leading-relaxed">
                Clinical intelligence for personalized skin health. We bridge the gap between daily care and dermatological expertise.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-[#5A6B5D]">Platform</h4>
              <ul className="space-y-4 text-[#EDE8E0] font-light">
                <li><a href="#intelligence" className="hover:text-white transition-colors">Intelligence</a></li>
                <li><a href="#process" className="hover:text-white transition-colors">How it Works</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-[#5A6B5D]">Legal</h4>
              <ul className="space-y-4 text-[#EDE8E0] font-light">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Medical Disclaimer</a></li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[#5A6B5D] text-sm font-light">
            <p>© {new Date().getFullYear()} DermaVerse Intelligence. All rights reserved.</p>
            <p>Designed for clinical precision.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
