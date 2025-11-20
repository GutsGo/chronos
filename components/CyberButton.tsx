import React from 'react';
import { playSound } from '../utils/audio';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  active?: boolean;
}

export const CyberButton: React.FC<CyberButtonProps> = ({ 
  children, 
  variant = 'primary', 
  active = false, 
  className = '', 
  onClick,
  ...props 
}) => {
  
  let baseColor = 'border-cyber-primary text-cyber-primary shadow-[0_0_10px_rgba(0,243,255,0.3)] hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] hover:bg-cyber-primary/10';
  let activeStyle = active ? 'bg-cyber-primary/20 shadow-[0_0_25px_rgba(0,243,255,0.5)]' : '';
  
  if (variant === 'secondary') {
    baseColor = 'border-cyber-secondary text-cyber-secondary shadow-[0_0_10px_rgba(112,0,255,0.3)] hover:shadow-[0_0_20px_rgba(112,0,255,0.6)] hover:bg-cyber-secondary/10';
    activeStyle = active ? 'bg-cyber-secondary/20 shadow-[0_0_25px_rgba(112,0,255,0.5)]' : '';
  } else if (variant === 'danger') {
    baseColor = 'border-cyber-alert text-cyber-alert shadow-[0_0_10px_rgba(255,0,60,0.3)] hover:shadow-[0_0_20px_rgba(255,0,60,0.6)] hover:bg-cyber-alert/10';
    activeStyle = active ? 'bg-cyber-alert/20 shadow-[0_0_25px_rgba(255,0,60,0.5)]' : '';
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSound('click');
    if (onClick) onClick(e);
  };

  return (
    <button
      className={`
        relative px-4 py-2 sm:px-6 sm:py-3 font-display font-bold uppercase tracking-widest transition-all duration-300
        border border-opacity-80 backdrop-blur-sm group overflow-hidden
        ${baseColor}
        ${activeStyle}
        ${className}
      `}
      onClick={handleClick}
      {...props}
    >
      {/* Decorative corner markers */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current opacity-70" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-current opacity-70" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-current opacity-70" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current opacity-70" />
      
      {/* Slanted background effect on hover */}
      <div className="absolute inset-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-current opacity-5 -z-10" />

      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};