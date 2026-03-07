import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring } from 'motion/react';

interface LiquidGradientProps {
  colors?: string[];
  opacity?: number;
}

export function LiquidGradient({ 
  colors = ['#D97757', '#F4EBE6', '#E8D5C4', '#2C2A25'], 
  opacity = 0.8 
}: LiquidGradientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({ 
          x: e.clientX - rect.left, 
          y: e.clientY - rect.top 
        });
      }
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  const springConfig = { damping: 25, stiffness: 120, mass: 1 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    mouseX.set(mousePosition.x);
    mouseY.set(mousePosition.y);
  }, [mousePosition, mouseX, mouseY]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0" style={{ opacity }}>
      <div className="absolute inset-0 w-full h-full blur-[60px] saturate-150">
        {/* Blob 1 */}
        <motion.div
          animate={{
            x: ['0vw', '30vw', '-10vw', '0vw'],
            y: ['0vh', '40vh', '20vh', '0vh'],
            scale: [1, 1.5, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-60"
          style={{ backgroundColor: colors[0] }}
        />
        
        {/* Blob 2 */}
        <motion.div
          animate={{
            x: ['0vw', '-40vw', '20vw', '0vw'],
            y: ['0vh', '30vh', '-20vh', '0vh'],
            scale: [1.2, 1, 1.5, 1.2],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[30%] right-[-10%] w-[55vw] h-[55vw] rounded-full opacity-50"
          style={{ backgroundColor: colors[1] }}
        />

        {/* Blob 3 */}
        <motion.div
          animate={{
            x: ['0vw', '20vw', '-30vw', '0vw'],
            y: ['0vh', '-40vh', '10vh', '0vh'],
            scale: [1.5, 1.2, 1, 1.5],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full opacity-70"
          style={{ backgroundColor: colors[2] }}
        />

        {/* Blob 4 */}
        <motion.div
          animate={{
            x: ['0vw', '-20vw', '30vw', '0vw'],
            y: ['0vh', '20vh', '-30vh', '0vh'],
            scale: [1, 1.3, 1.1, 1],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] left-[40%] w-[40vw] h-[40vw] rounded-full opacity-40"
          style={{ backgroundColor: colors[3] || colors[0] }}
        />

        {/* Interactive Blob following cursor */}
        <motion.div
          style={{
            x: mouseX,
            y: mouseY,
            translateX: '-50%',
            translateY: '-50%',
            backgroundColor: colors[0]
          }}
          className="absolute top-0 left-0 w-[40vw] h-[40vw] rounded-full opacity-70"
        />
      </div>
    </div>
  );
}
