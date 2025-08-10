import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = ({ isDarkMode, onToggle, className = "" }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className={`relative overflow-hidden transition-all duration-300 ${className}`}
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            isDarkMode 
              ? 'rotate-90 scale-0 opacity-0' 
              : 'rotate-0 scale-100 opacity-100'
          }`} 
        />
        <Moon 
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            isDarkMode 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
          }`} 
        />
      </div>
      <span className="sr-only">
        {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </span>
    </Button>
  );
};

export default ThemeToggle;

