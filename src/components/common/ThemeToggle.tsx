import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { useTheme, Theme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'compact' | 'segmented' | 'dropdown';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'dropdown',
  className = '',
}) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const getThemeLabel = (t: Theme) => {
    switch (t) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System (Auto)';
    }
  };

  // Segmented Pill selector
  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-lg bg-[#DDE6ED] dark:bg-[#1e2b3c] border border-[#9DB2BF]/60 text-xs font-medium ${className}`}
        role="group"
        aria-label="Theme selection"
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
            theme === 'light'
              ? 'bg-[#27374D] text-white shadow-xs font-semibold'
              : 'text-[#526D82] hover:text-[#27374D]'
          }`}
          title="Light Theme"
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
            theme === 'dark'
              ? 'bg-[#27374D] text-white shadow-xs font-semibold'
              : 'text-[#526D82] hover:text-[#27374D]'
          }`}
          title="Dark Theme"
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Dark</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('system')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
            theme === 'system'
              ? 'bg-[#27374D] text-white shadow-xs font-semibold'
              : 'text-[#526D82] hover:text-[#27374D]'
          }`}
          title="System Theme (Automatic)"
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>System</span>
        </button>
      </div>
    );
  }

  // Header Dropdown Trigger with 3 Options: Light, Dark, System
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-white hover:bg-[#526D82]/40 transition-colors cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        title={`Theme: ${getThemeLabel(theme)} (Click to switch)`}
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="w-3.5 h-3.5 text-[#9DB2BF]" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-[#9DB2BF]" />
        )}
        <span className="hidden sm:inline text-xs">{getThemeLabel(theme)}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#1e2b3c] border border-[#9DB2BF]/80 rounded-xl shadow-lg p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <p className="text-[10px] font-mono font-bold text-[#526D82] uppercase tracking-wider px-2.5 py-1">
            Theme Preference
          </p>

          <div className="space-y-0.5">
            {/* 1. Light Theme */}
            <button
              type="button"
              onClick={() => {
                setTheme('light');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                theme === 'light'
                  ? 'bg-[#27374D] text-white font-semibold'
                  : 'text-[#27374D] dark:text-[#DDE6ED] hover:bg-[#DDE6ED]/60 dark:hover:bg-[#526D82]/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </div>
              {theme === 'light' && <Check className="w-3.5 h-3.5 text-white" />}
            </button>

            {/* 2. Dark Theme */}
            <button
              type="button"
              onClick={() => {
                setTheme('dark');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#27374D] text-white font-semibold'
                  : 'text-[#27374D] dark:text-[#DDE6ED] hover:bg-[#DDE6ED]/60 dark:hover:bg-[#526D82]/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <Moon className="w-3.5 h-3.5 text-[#9DB2BF]" />
                <span>Dark</span>
              </div>
              {theme === 'dark' && <Check className="w-3.5 h-3.5 text-white" />}
            </button>

            {/* 3. System Default (Automatic) */}
            <button
              type="button"
              onClick={() => {
                setTheme('system');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                theme === 'system'
                  ? 'bg-[#27374D] text-white font-semibold'
                  : 'text-[#27374D] dark:text-[#DDE6ED] hover:bg-[#DDE6ED]/60 dark:hover:bg-[#526D82]/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <Laptop className="w-3.5 h-3.5 text-[#526D82]" />
                <span>System (Auto)</span>
              </div>
              {theme === 'system' && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
