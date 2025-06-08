/**
 * Background Elements Component
 * Handles animated background elements following Single Responsibility Principle
 * - Floating decorative elements
 * - Background dancer image
 * - Garland decorations
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Generic Floating Element Component
 * Reusable component for floating animations
 */
const FloatingElement = ({
  children,
  className = '',
  style = {},
  animationConfig = {},
  moveConfig = {}
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const defaultMoveConfig = {
    xRange: 100,
    yRange: 100,
    duration: 4000,
    variance: 1200,
    ...moveConfig
  };

  useEffect(() => {
    let timeout;
    
    function move() {
      setPosition({
        x: Math.random() * defaultMoveConfig.xRange,
        y: Math.random() * defaultMoveConfig.yRange
      });
      
      timeout = setTimeout(
        move, 
        defaultMoveConfig.duration + Math.random() * defaultMoveConfig.variance
      );
    }
    
    move();
    return () => clearTimeout(timeout);
  }, [defaultMoveConfig.duration, defaultMoveConfig.variance, defaultMoveConfig.xRange, defaultMoveConfig.yRange]);

  const defaultAnimationConfig = {
    animate: { x: position.x, y: position.y, rotate: [0, 10, -12, 0] },
    transition: { 
      x: { duration: 2.8 }, 
      y: { duration: 2.8 }, 
      rotate: { duration: 6.5, repeat: Infinity } 
    },
    ...animationConfig
  };

  return (
    <motion.div
      className={`hidden md:block fixed z-10 opacity-20 blur-xs pointer-events-none select-none ${className}`}
      style={style}
      {...defaultAnimationConfig}
    >
      {children}
    </motion.div>
  );
};

/**
 * Dancer Background Image Component
 * Responsive design: visible on all screen sizes with different positioning
 */
const DancerBackground = () => {
  const imgUrl = 'https://www.tandavalasya.com/static/b6c8c7fa13bb61de3cf6a6c3448d4535/bfa06/0072.webp';
  
  return (
    <img
      src={imgUrl}
      alt="Bharatanatyam dancer pose"
      className="fixed z-10 opacity-20 md:opacity-25 pointer-events-none mix-blend-multiply grayscale contrast-125 blur-[1px] object-cover 
                 right-[-15vw] top-0 h-full w-auto 
                 sm:right-[-12vw] 
                 md:right-[-10vw] 
                 lg:right-[-8vw]"
      style={{
        filter: 'grayscale(1) contrast(1.2) brightness(1.1) blur(1px)',
        WebkitMaskImage: 'radial-gradient(ellipse 60% 80% at 60% 50%, white 80%, transparent 100%)',
        maskImage: 'radial-gradient(ellipse 60% 80% at 60% 50%, white 80%, transparent 100%)',
      }}
    />
  );
};

/**
 * Thoranam Garland Component
 * Decorative garland at the top of the page
 */
const ThoranamGarland = () => {
  const bellCount = 13;
  
  // Helper to get y on the rope path for a given x
  const getRopeY = (x) => {
    if (x <= 650) {
      const t = (x - 30) / (650 - 30);
      return (1 - t) * (1 - t) * 40 + 2 * (1 - t) * t * 140 + t * t * 40;
    } else {
      const t = (x - 650) / (1270 - 650);
      return (1 - t) * (1 - t) * 40 + 2 * (1 - t) * t * -60 + t * t * 40;
    }
  };
  
  // Draw beaded/dashed line along the path
  const beadCount = 40;
  const beads = Array.from({ length: beadCount }).map((_, i) => {
    const x = 30 + i * ((1270 - 30) / (beadCount - 1));
    const y = getRopeY(x);
    return (
      <circle 
        key={i} 
        cx={x} 
        cy={y} 
        r="5.5" 
        fill="#b91c1c" 
        stroke="#fff" 
        strokeWidth="1.5" 
      />
    );
  });

  // Create bell positions
  const bells = Array.from({ length: bellCount }).map((_, i) => {
    const x = 30 + i * ((1270 - 30) / (bellCount - 1));
    const y = getRopeY(x) + 20;
    return { x, y, id: i };
  });

  return (
    <div className="hidden md:block fixed top-0 left-0 w-full h-20 z-10 pointer-events-none opacity-30">
      <svg
        viewBox="0 0 1300 200"
        className="w-full h-full"
        preserveAspectRatio="xMidYMin slice"
      >
        {/* Rope/String */}
        {beads}
        
        {/* Bells */}
        {bells.map((bell) => (
          <motion.g
            key={bell.id}
            animate={{ 
              rotate: [0, 2, -2, 0],
              y: [0, -2, 0, 2, 0]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            style={{ transformOrigin: `${bell.x}px ${bell.y - 10}px` }}
          >
            <circle
              cx={bell.x}
              cy={bell.y}
              r="8"
              fill="#fbbf24"
              stroke="#f59e0b"
              strokeWidth="1"
            />
            <circle
              cx={bell.x}
              cy={bell.y + 3}
              r="2"
              fill="#92400e"
            />
          </motion.g>
        ))}
      </svg>
    </div>
  );
};

/**
 * Main Background Elements Component
 */
const BackgroundElements = () => {
  return (
    <>
      {/* Dancer Background */}
      <DancerBackground />
      
      {/* Thoranam Garland */}
      <ThoranamGarland />
      
      {/* Floating Lotus - Top Right */}
      <FloatingElement
        className=""
        style={{ right: '2vw', top: '6vh', width: '12rem', height: '12rem' }}
        moveConfig={{ xRange: 160, yRange: 120 }}
        animationConfig={{
          transition: { 
            x: { duration: 2.8 }, 
            y: { duration: 2.8 }, 
            rotate: { duration: 7, repeat: Infinity } 
          }
        }}
      >
        <span className="w-full h-full flex items-center justify-center text-8xl">🌸</span>
      </FloatingElement>

      {/* Floating Salangai - Top Left */}
      <FloatingElement
        className=""
        style={{ left: '2vw', top: '7vh', width: '10rem', height: '10rem' }}
        moveConfig={{ xRange: 100, yRange: 100 }}
        animationConfig={{
          transition: { 
            x: { duration: 2.7 }, 
            y: { duration: 2.7 }, 
            rotate: { duration: 6.5, repeat: Infinity } 
          }
        }}
      >
        <span className="w-full h-full flex items-center justify-center text-7xl">🔔</span>
      </FloatingElement>

      {/* Floating Mudra - Bottom Left */}
      <FloatingElement
        className="z-40"
        style={{ left: '8vw', bottom: '6.5rem', width: '11rem', height: '11rem' }}
        moveConfig={{ xRange: 60, yRange: 80, duration: 3500 }}
        animationConfig={{
          transition: { 
            x: { duration: 2.5 }, 
            y: { duration: 2.5 }, 
            rotate: { duration: 6, repeat: Infinity } 
          }
        }}
      >
        <span className="w-full h-full flex items-center justify-center text-7xl">🙏</span>
      </FloatingElement>

      {/* Floating Lamp - Bottom Right */}
      <FloatingElement
        className="z-40"
        style={{ right: '8vw', bottom: '6.5rem', width: '10rem', height: '10rem' }}
        moveConfig={{ xRange: 60, yRange: 60, duration: 4200 }}
        animationConfig={{
          transition: { 
            x: { duration: 2.7 }, 
            y: { duration: 2.7 }, 
            rotate: { duration: 6.5, repeat: Infinity } 
          }
        }}
      >
        <span className="w-full h-full flex items-center justify-center text-7xl">🪔</span>
      </FloatingElement>
    </>
  );
};

export default BackgroundElements; 