import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface GooglyEyesProps {
  className?: string;
  color?: string;
  pupilColor?: string;
  size?: number;
}

export function GooglyEyes({ 
  className = "", 
  color = "#FDFBF7", 
  pupilColor = "#2C2A25",
  size = 60 
}: GooglyEyesProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const calculatePupilOffset = (eyeElement: HTMLDivElement | null) => {
    if (!eyeElement) return { x: 0, y: 0 };
    const rect = eyeElement.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(mousePos.y - eyeCenterY, mousePos.x - eyeCenterX);
    // Max distance pupil can travel from center
    const maxDistance = (rect.width - (size * 0.45)) / 2; 
    const distance = Math.min(
      Math.hypot(mousePos.x - eyeCenterX, mousePos.y - eyeCenterY) / 5, // scale down distance for smoother effect
      maxDistance
    );

    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    };
  };

  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  const leftOffset = calculatePupilOffset(leftEyeRef.current);
  const rightOffset = calculatePupilOffset(rightEyeRef.current);

  return (
    <div className={`flex gap-2 ${className}`} style={{ width: size * 2.2, height: size }}>
      {/* Left Eye */}
      <div 
        ref={leftEyeRef}
        className="relative rounded-full shadow-[inset_0_3px_6px_rgba(0,0,0,0.1)] overflow-hidden flex items-center justify-center border border-black/5"
        style={{ width: size, height: size, backgroundColor: color }}
      >
        <motion.div 
          className="absolute rounded-full"
          style={{ width: size * 0.45, height: size * 0.45, backgroundColor: pupilColor }}
          animate={{ x: leftOffset.x, y: leftOffset.y }}
          transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.5 }}
        >
            {/* Catchlight */}
            <div className="absolute top-[15%] right-[20%] w-[25%] h-[25%] bg-white rounded-full opacity-80" />
        </motion.div>
      </div>
      {/* Right Eye */}
      <div 
        ref={rightEyeRef}
        className="relative rounded-full shadow-[inset_0_3px_6px_rgba(0,0,0,0.1)] overflow-hidden flex items-center justify-center border border-black/5"
        style={{ width: size, height: size, backgroundColor: color }}
      >
        <motion.div 
          className="absolute rounded-full"
          style={{ width: size * 0.45, height: size * 0.45, backgroundColor: pupilColor }}
          animate={{ x: rightOffset.x, y: rightOffset.y }}
          transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.5 }}
        >
            {/* Catchlight */}
            <div className="absolute top-[15%] right-[20%] w-[25%] h-[25%] bg-white rounded-full opacity-80" />
        </motion.div>
      </div>
    </div>
  );
}
