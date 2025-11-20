import React, { useMemo } from 'react';
import { TimerMode } from '../types';
import { MODE_CONFIGS } from '../constants';

interface TimerDisplayProps {
  timeLeft: number;
  totalTime: number;
  mode: TimerMode;
  isActive: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft, totalTime, mode, isActive }) => {
  const radius = 120;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (timeLeft / totalTime) * circumference;
  const size = radius * 2 + 40; // Total size of SVG coordinate space

  const colorConfig = MODE_CONFIGS[mode];
  
  // Format time as MM:SS
  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  return (
    <div className="relative flex items-center justify-center w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] transition-all duration-300">
      {/* Outer Rotating Ring - Decorative */}
      <div className={`absolute inset-0 border border-gray-800 rounded-full border-dashed opacity-30 ${isActive ? 'animate-spin-slow' : ''}`} />
      <div className="absolute inset-4 border border-gray-800 rounded-full opacity-20" />

      {/* SVG Progress Circle */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full rotate-[-90deg] drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
      >
        {/* Track Circle */}
        <circle
          stroke="#1a1a24"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx="50%"
          cy="50%"
        />
        {/* Progress Circle */}
        <circle
          stroke={colorConfig.colors.primary}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ 
            strokeDashoffset, 
            transition: 'stroke-dashoffset 0.5s linear, stroke 0.5s ease',
            filter: `drop-shadow(0 0 8px ${colorConfig.colors.glow})`
          }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx="50%"
          cy="50%"
        />
      </svg>

      {/* Digital Display */}
      <div className="absolute flex flex-col items-center justify-center z-10">
        <span 
          className="text-5xl sm:text-7xl font-mono font-bold tracking-tighter text-white transition-all duration-300"
          style={{ 
            textShadow: `0 0 20px ${colorConfig.colors.glow}`,
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {formattedTime}
        </span>
        <span className="mt-2 text-[10px] sm:text-xs font-display tracking-[0.3em] text-gray-400 uppercase">
          {isActive ? 'Running' : 'Standby'}
        </span>
      </div>

      {/* Decorative tech bits */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-1 h-4 bg-gray-700" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 w-1 h-4 bg-gray-700" />
      <div className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 w-4 h-1 bg-gray-700" />
      <div className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 w-4 h-1 bg-gray-700" />
    </div>
  );
};