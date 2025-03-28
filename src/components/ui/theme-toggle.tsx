
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Toggle
      pressed={theme === 'dark'}
      onPressedChange={toggleTheme}
      aria-label="Toggle dark mode"
      className={cn(
        "h-9 w-9 rounded-full transition-all duration-300 focus:outline-none", 
        theme === 'dark' 
          ? 'bg-slate-800 text-blue-400 hover:bg-slate-700 hover:text-blue-300 hover:shadow-glow' 
          : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700',
        className
      )}
    >
      {theme === 'dark' ? 
        <Moon size={18} className="transition-transform duration-300 transform hover:rotate-12" /> : 
        <Sun size={18} className="transition-transform duration-300 transform hover:rotate-12" />
      }
    </Toggle>
  );
}
