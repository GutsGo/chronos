export enum TimerMode {
  FOCUS = 'FOCUS',
  SHORT_BREAK = 'SHORT_BREAK',
  LONG_BREAK = 'LONG_BREAK',
}

export interface TimerConfig {
  [TimerMode.FOCUS]: number;
  [TimerMode.SHORT_BREAK]: number;
  [TimerMode.LONG_BREAK]: number;
}

export interface ThemeColors {
  primary: string;
  glow: string;
}

export interface SoundConfig {
  muteAll: boolean;
  volume: number;
  enabledSounds: {
    tick: boolean;
    click: boolean;
    start: boolean;
    complete: boolean;
  };
}

export interface HistoryEntry {
  id: string;
  mode: TimerMode;
  duration: number; // stored in seconds
  timestamp: number;
}