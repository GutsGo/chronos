import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { TimerConfig, TimerMode, SoundConfig } from '../types';
import { CyberButton } from './CyberButton';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newDurations: TimerConfig, newSoundConfig: SoundConfig) => void;
  currentDurations: TimerConfig;
  currentSoundConfig: SoundConfig;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  currentDurations, 
  currentSoundConfig 
}) => {
  const [inputs, setInputs] = useState({
    [TimerMode.FOCUS]: 25,
    [TimerMode.SHORT_BREAK]: 5,
    [TimerMode.LONG_BREAK]: 15,
  });
  
  const [soundSettings, setSoundSettings] = useState<SoundConfig>(currentSoundConfig || {
      muteAll: false,
      volume: 0.5,
      enabledSounds: { tick: true, click: true, start: true, complete: true }
  });

  useEffect(() => {
    if (isOpen) {
      if (currentDurations) {
          setInputs({
            [TimerMode.FOCUS]: Math.floor(currentDurations[TimerMode.FOCUS] / 60),
            [TimerMode.SHORT_BREAK]: Math.floor(currentDurations[TimerMode.SHORT_BREAK] / 60),
            [TimerMode.LONG_BREAK]: Math.floor(currentDurations[TimerMode.LONG_BREAK] / 60),
          });
      }
      if (currentSoundConfig) {
          setSoundSettings(currentSoundConfig);
      }
    }
  }, [isOpen, currentDurations, currentSoundConfig]);

  if (!isOpen) return null;

  const handleChange = (mode: TimerMode, value: string) => {
    const numVal = parseInt(value, 10);
    setInputs(prev => ({
      ...prev,
      [mode]: isNaN(numVal) ? 0 : numVal
    }));
  };

  const handleSoundToggle = (key: keyof SoundConfig['enabledSounds']) => {
    setSoundSettings(prev => ({
      ...prev,
      enabledSounds: {
        ...prev.enabledSounds,
        [key]: !prev.enabledSounds[key]
      }
    }));
  };

  const handleSave = () => {
    const newDurations: TimerConfig = {
      [TimerMode.FOCUS]: Math.max(1, inputs[TimerMode.FOCUS]) * 60,
      [TimerMode.SHORT_BREAK]: Math.max(1, inputs[TimerMode.SHORT_BREAK]) * 60,
      [TimerMode.LONG_BREAK]: Math.max(1, inputs[TimerMode.LONG_BREAK]) * 60,
    };
    onSave(newDurations, soundSettings);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="w-full max-w-md bg-[#0a0a12] border border-cyber-primary/30 shadow-[0_0_50px_rgba(0,243,255,0.1)] p-4 sm:p-8 relative overflow-hidden z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Decorative UI Elements */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyber-primary opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyber-primary opacity-50 pointer-events-none" />
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
           <div className="flex flex-col">
             <h2 className="text-xl sm:text-2xl font-display text-white tracking-widest">SYSTEM<span className="text-cyber-primary">.CONFIG</span></h2>
             <span className="text-[10px] font-mono text-gray-500">/root/user/settings</span>
           </div>
           <button onClick={onClose} className="text-gray-500 hover:text-cyber-alert transition-colors">
             <X size={24} />
           </button>
        </div>

        {/* Timer Settings */}
        <div className="space-y-6 mb-8">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-l-2 border-cyber-primary pl-2">Time Allocation</h3>
            {[
              { mode: TimerMode.FOCUS, label: 'FOCUS CYCLE' },
              { mode: TimerMode.SHORT_BREAK, label: 'SHORT RECHARGE' },
              { mode: TimerMode.LONG_BREAK, label: 'HIBERNATION' }
            ].map(({ mode, label }) => (
              <div key={mode} className="group">
                <label className="block text-xs font-mono text-cyber-primary mb-2 tracking-wider flex justify-between">
                    <span>{label}</span>
                    <span className="text-gray-600 text-[10px]">MINUTES</span>
                </label>
                <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="999"
                      value={inputs[mode as TimerMode]}
                      onChange={(e) => handleChange(mode as TimerMode, e.target.value)}
                      className="w-full bg-black/40 border border-gray-700 text-white p-3 font-mono text-lg focus:border-cyber-primary focus:outline-none focus:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all"
                    />
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-gray-800 group-focus-within:bg-cyber-primary transition-colors" />
                </div>
              </div>
            ))}
        </div>

        {/* Sound Settings */}
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-l-2 border-cyber-primary pl-2">Audio Feedback</h3>
            
            <div className="flex items-center justify-between bg-white/5 p-3 border border-white/10">
                <span className="text-xs font-mono text-gray-300">MASTER MUTE</span>
                <button 
                    onClick={() => setSoundSettings(s => ({ ...s, muteAll: !s.muteAll }))}
                    className={`p-2 rounded transition-colors ${!soundSettings.muteAll ? 'text-cyber-primary bg-cyber-primary/10' : 'text-gray-500'}`}
                >
                    {!soundSettings.muteAll ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {(Object.keys(soundSettings.enabledSounds) as Array<keyof SoundConfig['enabledSounds']>).map(key => (
                    <button
                        key={key}
                        onClick={() => handleSoundToggle(key)}
                        disabled={soundSettings.muteAll}
                        className={`
                            flex items-center justify-between p-3 border text-[10px] sm:text-xs font-mono uppercase transition-all
                            ${soundSettings.enabledSounds[key] && !soundSettings.muteAll
                                ? 'border-cyber-primary text-cyber-primary bg-cyber-primary/5' 
                                : 'border-gray-800 text-gray-600 bg-black/20 hover:border-gray-700'}
                            ${soundSettings.muteAll ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                    >
                        <span>{key}</span>
                        <div className={`w-2 h-2 rounded-full ${soundSettings.enabledSounds[key] && !soundSettings.muteAll ? 'bg-cyber-primary shadow-[0_0_5px_cyan]' : 'bg-gray-800'}`} />
                    </button>
                ))}
            </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-4 mt-10 pt-6 border-t border-gray-800/50">
          <CyberButton onClick={handleSave} className="flex-1" active>
            SAVE
          </CyberButton>
          <CyberButton variant="danger" onClick={onClose} className="flex-1">
             CANCEL
          </CyberButton>
        </div>
      </div>
    </div>
  );
};