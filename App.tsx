import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, Volume2, VolumeX, Monitor, History } from 'lucide-react';
import { Background } from './components/Background';
import { TimerDisplay } from './components/TimerDisplay';
import { CyberButton } from './components/CyberButton';
import { SettingsModal } from './components/SettingsModal';
import { HistoryModal } from './components/HistoryModal';
import { TimerMode, TimerConfig, SoundConfig, HistoryEntry } from './types';
import { DEFAULT_TIMES, MODE_CONFIGS } from './constants';
import { playSound } from './utils/audio';

const loadDurations = (): TimerConfig => {
  try {
    const saved = localStorage.getItem('chronos_durations');
    return saved ? JSON.parse(saved) : DEFAULT_TIMES;
  } catch {
    return DEFAULT_TIMES;
  }
};

const loadSoundConfig = (): SoundConfig => {
  try {
    const saved = localStorage.getItem('chronos_sound_config');
    return saved ? JSON.parse(saved) : {
      muteAll: false,
      volume: 0.5,
      enabledSounds: { tick: true, click: true, start: true, complete: true }
    };
  } catch {
    return {
      muteAll: false,
      volume: 0.5,
      enabledSounds: { tick: true, click: true, start: true, complete: true }
    };
  }
};

const loadHistory = (): HistoryEntry[] => {
  try {
    const saved = localStorage.getItem('chronos_history');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const App: React.FC = () => {
  // State
  const [durations, setDurations] = useState<TimerConfig>(loadDurations);
  const [mode, setMode] = useState<TimerMode>(TimerMode.FOCUS);
  const [timeLeft, setTimeLeft] = useState<number>(() => loadDurations()[TimerMode.FOCUS]);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [soundConfig, setSoundConfig] = useState<SoundConfig>(loadSoundConfig);
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // Refs for accurate interval
  const timerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  // Config for current mode
  const currentConfig = MODE_CONFIGS[mode];

  // Sound helper
  const triggerSound = useCallback((type: keyof SoundConfig['enabledSounds']) => {
    if (!soundConfig.muteAll && soundConfig.enabledSounds[type]) {
      playSound(type); // Pass volume if updated audio util supports it
    }
  }, [soundConfig]);

  // History Logic
  const addToHistory = useCallback((completedMode: TimerMode, duration: number) => {
    const newEntry: HistoryEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      mode: completedMode,
      duration: duration,
      timestamp: Date.now(),
    };
    
    setHistory(prev => {
      const updated = [newEntry, ...prev];
      localStorage.setItem('chronos_history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('chronos_history');
    triggerSound('click');
  };

  // Timer Logic
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsActive(false);
  }, []);

  const handleComplete = useCallback(() => {
    stopTimer();
    triggerSound('complete');
    addToHistory(mode, durations[mode]);
  }, [stopTimer, triggerSound, addToHistory, mode, durations]);

  const startTimer = useCallback(() => {
    if (isActive) return;
    
    setIsActive(true);
    triggerSound('start');
    lastTickRef.current = Date.now();

    timerRef.current = window.setInterval(() => {
      const now = Date.now();
      const delta = now - lastTickRef.current;

      if (delta >= 1000) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
           // Subtle tick sound on last 5 seconds
          if (prev <= 6 && prev > 1) triggerSound('tick'); 
          return prev - 1;
        });
        lastTickRef.current = now;
      }
    }, 100);
  }, [isActive, handleComplete, triggerSound]);

  const toggleTimer = () => {
    if (isActive) {
      stopTimer();
      triggerSound('click');
    } else {
      startTimer();
    }
  };

  const resetTimer = () => {
    stopTimer();
    setTimeLeft(durations[mode]);
    triggerSound('click');
  };

  const changeMode = (newMode: TimerMode) => {
    stopTimer();
    setMode(newMode);
    setTimeLeft(durations[newMode]);
    triggerSound('click');
  };

  const handleSaveSettings = (newDurations: TimerConfig, newSoundConfig: SoundConfig) => {
    setDurations(newDurations);
    localStorage.setItem('chronos_durations', JSON.stringify(newDurations));
    
    setSoundConfig(newSoundConfig);
    localStorage.setItem('chronos_sound_config', JSON.stringify(newSoundConfig));
    
    // Apply new settings immediately: reset timer
    stopTimer();
    setMode(mode); // Force re-render context if needed, though setTimeLeft is key
    setTimeLeft(newDurations[mode]);
    setIsSettingsOpen(false);
    triggerSound('click');
  };

  const toggleMute = () => {
    setSoundConfig(prev => {
      const newConfig = { ...prev, muteAll: !prev.muteAll };
      localStorage.setItem('chronos_sound_config', JSON.stringify(newConfig));
      return newConfig;
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 font-sans text-gray-200 select-none overflow-hidden">
      <Background mode={mode} isActive={isActive} />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-4 sm:gap-8">
        
        {/* Header / HUD Top */}
        <div className="w-full flex justify-between items-end border-b border-gray-800 pb-4 mb-2 sm:mb-4">
            <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl font-display font-bold tracking-widest text-white flex items-center gap-2">
                    <Monitor size={24} className="text-cyber-primary hidden sm:block" />
                    <Monitor size={20} className="text-cyber-primary sm:hidden" />
                    CHRONOS<span className="text-cyber-primary">.OS</span>
                </h1>
                <span className="text-[10px] font-mono text-gray-500 tracking-widest">V.3.2.0 // LOGGING_ENABLED</span>
            </div>
            <div className="flex gap-1 sm:gap-2">
                <button 
                    onClick={toggleMute}
                    className={`p-2 rounded hover:bg-white/5 transition-colors ${!soundConfig.muteAll ? 'text-cyber-primary' : 'text-gray-600'}`}
                    title="Toggle Mute"
                >
                    {!soundConfig.muteAll ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
                <button 
                    onClick={() => setIsHistoryOpen(true)}
                    className="p-2 text-gray-500 hover:text-cyber-primary transition-colors"
                    title="View History"
                >
                    <History size={20} />
                </button>
                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2 text-gray-500 hover:text-cyber-primary transition-colors"
                    title="Settings"
                >
                    <Settings size={20} />
                </button>
            </div>
        </div>

        {/* Mode Selectors */}
        <div className="flex gap-2 sm:gap-4 w-full justify-center relative flex-wrap sm:flex-nowrap">
             {/* Decoration Lines - Hidden on small mobile to avoid clutter */}
             <div className="hidden sm:block absolute top-1/2 left-0 w-1/6 lg:w-1/4 h-[1px] bg-gradient-to-r from-transparent to-gray-800" />
             <div className="hidden sm:block absolute top-1/2 right-0 w-1/6 lg:w-1/4 h-[1px] bg-gradient-to-l from-transparent to-gray-800" />

            <CyberButton 
                variant={mode === TimerMode.FOCUS ? 'primary' : undefined} 
                active={mode === TimerMode.FOCUS}
                onClick={() => changeMode(TimerMode.FOCUS)}
                className="text-xs sm:text-sm min-w-[85px] sm:min-w-[100px] flex-1 sm:flex-none"
            >
                FOCUS
            </CyberButton>
            <CyberButton 
                variant="secondary" 
                active={mode === TimerMode.SHORT_BREAK}
                onClick={() => changeMode(TimerMode.SHORT_BREAK)}
                className="text-xs sm:text-sm min-w-[85px] sm:min-w-[100px] flex-1 sm:flex-none"
            >
                SHORT
            </CyberButton>
            <CyberButton 
                variant={mode === TimerMode.LONG_BREAK ? 'primary' : undefined}
                active={mode === TimerMode.LONG_BREAK}
                onClick={() => changeMode(TimerMode.LONG_BREAK)}
                className="text-xs sm:text-sm min-w-[85px] sm:min-w-[100px] !border-emerald-500 !text-emerald-400 shadow-emerald-500/20 flex-1 sm:flex-none"
                style={{ borderColor: mode === TimerMode.LONG_BREAK ? '#10b981' : '' }} 
            >
                LONG
            </CyberButton>
        </div>

        {/* The Core (Timer) */}
        <div className="relative py-4 sm:py-8">
             {/* Holographic projected Label */}
             <div className="absolute -top-2 sm:-top-4 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-mono tracking-[0.5em] text-center w-full opacity-70 whitespace-nowrap" style={{ color: currentConfig.colors.primary }}>
                {currentConfig.label}
             </div>

            <TimerDisplay 
                timeLeft={timeLeft} 
                totalTime={durations[mode]} 
                mode={mode}
                isActive={isActive}
            />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-md">
            <CyberButton 
                onClick={toggleTimer}
                className="w-full flex justify-center"
            >
                {isActive ? <Pause size={24} className="sm:w-6 sm:h-6 w-5 h-5" /> : <Play size={24} className="sm:w-6 sm:h-6 w-5 h-5" />}
                {isActive ? 'HALT' : 'INITIATE'}
            </CyberButton>
            
            <CyberButton 
                variant="danger" 
                onClick={resetTimer}
                className="w-full flex justify-center"
            >
                <RotateCcw size={24} className="sm:w-6 sm:h-6 w-5 h-5" />
                RESET
            </CyberButton>
        </div>

        {/* Footer status line */}
        <div className="mt-4 sm:mt-8 w-full border-t border-gray-800 pt-2 flex justify-between text-[10px] font-mono text-gray-600 uppercase tracking-widest">
            <span className="hidden sm:inline">MEM: 64GB OK</span>
            <span>NET: CONNECTED</span>
            <span className={`${isActive ? 'text-cyber-primary animate-pulse' : ''}`}>
                STATUS: {isActive ? 'PROCESSING' : 'IDLE'}
            </span>
        </div>

      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSave={handleSaveSettings}
        currentDurations={durations}
        currentSoundConfig={soundConfig}
      />

      <HistoryModal 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClear={clearHistory}
      />
    </div>
  );
};

export default App;