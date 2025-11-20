import React from 'react';
import { TimerMode } from '../types';
import { MODE_CONFIGS } from '../constants';

interface BackgroundProps {
  mode: TimerMode;
  isActive: boolean;
}

export const Background: React.FC<BackgroundProps> = ({ mode, isActive }) => {
  const { colors } = MODE_CONFIGS[mode];
  const primaryColor = colors.primary;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-cyber-black transition-colors duration-1000">
      {/* Dynamic Grid Floor */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{
          opacity: isActive ? 0.25 : 0.15,
          backgroundImage: `
            linear-gradient(to right, ${primaryColor}33 1px, transparent 1px),
            linear-gradient(to bottom, ${primaryColor}33 1px, transparent 1px)
          `,
          backgroundSize: isActive ? '60px 60px' : '40px 40px', // Expands when active
          transform: `perspective(500px) rotateX(60deg) translateY(${isActive ? '-50px' : '-100px'}) scale(2)`,
          transformOrigin: 'top center',
        }}
      />

      {/* Ambient Mode Glow */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${primaryColor}1a 0%, transparent 70%)`,
          opacity: isActive ? 1 : 0.4,
        }}
      />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_90%)]" />
      
      {/* Scanline */}
      <div 
        className="absolute inset-0 animate-scanner pointer-events-none h-full w-full transition-all duration-1000"
        style={{
            background: `linear-gradient(to bottom, transparent, ${primaryColor}11, transparent)`,
            animationDuration: isActive ? '2s' : '5s' // Faster scan when active
        }}
      />
      
      {/* Floating Particles */}
      <div 
        className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full animate-pulse transition-all duration-1000"
        style={{ 
          backgroundColor: primaryColor, 
          opacity: isActive ? 0.6 : 0.3,
          boxShadow: `0 0 10px ${primaryColor}`
        }}
      />
      <div 
        className="absolute top-3/4 left-3/4 w-1 h-1 rounded-full animate-pulse delay-700 transition-all duration-1000"
        style={{ 
          backgroundColor: primaryColor, 
          opacity: isActive ? 0.6 : 0.3,
          filter: 'hue-rotate(30deg)'
        }}
      />
      <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-white rounded-full opacity-20 animate-pulse delay-300" />
    </div>
  );
};