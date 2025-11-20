import { TimerMode, ThemeColors } from './types';

export const DEFAULT_TIMES = {
  [TimerMode.FOCUS]: 25 * 60,
  [TimerMode.SHORT_BREAK]: 5 * 60,
  [TimerMode.LONG_BREAK]: 15 * 60,
};

export const MODE_CONFIGS: Record<TimerMode, { label: string; colors: ThemeColors }> = {
  [TimerMode.FOCUS]: {
    label: 'SYSTEM: FOCUS',
    colors: { primary: '#00f3ff', glow: 'rgba(0, 243, 255, 0.6)' },
  },
  [TimerMode.SHORT_BREAK]: {
    label: 'SYSTEM: RECHARGE',
    colors: { primary: '#7000ff', glow: 'rgba(112, 0, 255, 0.6)' },
  },
  [TimerMode.LONG_BREAK]: {
    label: 'SYSTEM: HIBERNATE',
    colors: { primary: '#00ff9d', glow: 'rgba(0, 255, 157, 0.6)' },
  },
};