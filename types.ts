import React from 'react';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  type: 'math' | 'ai';
}

export interface ButtonConfig {
  label: string;
  value: string;
  type: 'number' | 'operator' | 'function' | 'action' | 'scientific';
  className?: string;
  icon?: React.ReactNode;
}

export interface ThemeConfig {
  isDark: boolean;
  toggleTheme: () => void;
}
