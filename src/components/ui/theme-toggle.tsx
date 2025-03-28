
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
        "h-9 w-9 rounded-full transition-colors focus:outline-none", 
        theme === 'dark' 
          ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
          : 'hover:bg-primary/20 text-primary',
        className
      )}
    >
      {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
    </Toggle>
  );
}
