import React from 'react';
import { X, Trash2, Clock, Calendar } from 'lucide-react';
import { HistoryEntry, TimerMode } from '../types';
import { CyberButton } from './CyberButton';
import { MODE_CONFIGS } from '../constants';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onClear: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onClear }) => {
  if (!isOpen) return null;

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} MIN`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="w-full max-w-md h-[80vh] flex flex-col bg-[#0a0a12] border border-cyber-primary/30 shadow-[0_0_50px_rgba(0,243,255,0.1)] relative overflow-hidden z-10">
        {/* Decorative UI Elements */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyber-primary opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyber-primary opacity-50 pointer-events-none" />
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-800 shrink-0">
           <div className="flex flex-col">
             <h2 className="text-xl sm:text-2xl font-display text-white tracking-widest flex items-center gap-2">
                MISSION_LOG
                <span className="inline-block w-2 h-2 bg-cyber-primary rounded-full animate-pulse" />
             </h2>
             <span className="text-[10px] font-mono text-gray-500">/root/user/history</span>
           </div>
           <button onClick={onClose} className="text-gray-500 hover:text-cyber-alert transition-colors">
             <X size={24} />
           </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
            {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 font-mono text-sm opacity-50">
                    <Calendar size={48} className="mb-4 opacity-20" />
                    <p>NO DATA LOGGED</p>
                    <p className="text-xs mt-2">COMPLETE A CYCLE TO INITIALIZE RECORD</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {history.map((entry) => {
                        const modeConfig = MODE_CONFIGS[entry.mode];
                        return (
                            <div 
                                key={entry.id} 
                                className="group relative border border-gray-800 bg-black/40 hover:bg-white/5 transition-colors p-3 sm:p-4 flex justify-between items-center overflow-hidden"
                            >
                                <div 
                                    className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5"
                                    style={{ backgroundColor: modeConfig.colors.primary }} 
                                />
                                
                                <div className="flex flex-col gap-1 pl-3">
                                    <span className="font-display text-xs sm:text-sm font-bold tracking-wider text-white">
                                        {entry.mode.replace('_', ' ')}
                                    </span>
                                    <span className="font-mono text-[10px] text-gray-500 flex items-center gap-1">
                                        {formatDate(entry.timestamp)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 font-mono text-cyber-primary text-xs sm:text-sm">
                                    <Clock size={12} />
                                    {formatDuration(entry.duration)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-gray-800/50 bg-[#0a0a12] shrink-0">
            {history.length > 0 && (
                <CyberButton 
                    variant="danger" 
                    onClick={onClear} 
                    className="w-full flex justify-center text-sm py-2"
                >
                    <Trash2 size={16} className="mr-2" />
                    PURGE LOGS
                </CyberButton>
            )}
        </div>
      </div>
    </div>
  );
};