'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      )}
    </button>
  );
}
