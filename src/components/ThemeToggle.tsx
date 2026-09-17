import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme, Theme } from '../context/ThemeContext';

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
  variant?: 'compact' | 'full' | 'dropdown';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  showLabel = false, 
  className = '',
  variant = 'compact'
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
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
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (variant === 'full') {
    const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
      { value: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
      { value: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5" /> },
      { value: 'system', label: 'System', icon: <Monitor className="w-3.5 h-3.5" /> },
    ];

    return (
      <div 
        className={`inline-flex items-center p-1 rounded-xl bg-[#F0EDE6] dark:bg-[#16221E] border border-[#DDD7CA] dark:border-[#22332B] ${className}`}
        role="group"
        aria-label="Theme selection"
      >
        {options.map((opt) => {
          const isActive = theme === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTheme(opt.value)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-[#064E3B] text-[#064E3B] dark:text-[#E6F4EA] shadow-xs font-semibold'
                  : 'text-[#65726B] dark:text-[#9DAAA3] hover:text-[#191E1C] dark:hover:text-[#E8EAE8]'
              }`}
              title={`Switch to ${opt.label} theme`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        id="theme-toggle-btn"
        onClick={toggleTheme}
        onContextMenu={(e) => {
          // Right-click or long-press opens system option menu
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className={`relative flex items-center justify-center gap-2 p-2 rounded-lg transition-all cursor-pointer border ${
          resolvedTheme === 'dark'
            ? 'bg-[#16221E] hover:bg-[#1E2E28] text-[#E0EBE4] border-[#25382F] hover:border-[#314A3E]'
            : 'bg-[#F4F2EB] hover:bg-[#EBE7DD] text-[#3E4743] border-[#E3DFD4] hover:border-[#D6D1C4]'
        } ${className}`}
        aria-label={
          resolvedTheme === 'dark' 
            ? 'Switch to light mode (reading mode)' 
            : 'Switch to dark mode (night listening mode)'
        }
        title={
          resolvedTheme === 'dark'
            ? 'Switch to Day Mode (Current: Dark)'
            : 'Switch to Night Mode (Current: Light)'
        }
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="w-4 h-4 text-[#C29B38] animate-in fade-in zoom-in duration-200" />
        ) : (
          <Sun className="w-4 h-4 text-[#C29B38] animate-in fade-in zoom-in duration-200" />
        )}

        {showLabel && (
          <span className="text-xs font-medium">
            {resolvedTheme === 'dark' ? 'Night Mode' : 'Day Mode'}
          </span>
        )}
      </button>

      {/* Quick context dropdown for switching between Light, Dark, and System */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-36 py-1.5 rounded-xl bg-white dark:bg-[#15201C] border border-[#E6E2D8] dark:border-[#22332B] shadow-lg z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-[#88958F] dark:text-[#7A8A82]">
            Theme Mode
          </div>
          {(['light', 'dark', 'system'] as Theme[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setTheme(mode);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
                theme === mode
                  ? 'text-[#064E3B] dark:text-[#34D399] font-semibold bg-[#FAF8F5] dark:bg-[#1E2D27]'
                  : 'text-[#44504A] dark:text-[#B6C2BC] hover:bg-[#F4F1EA] dark:hover:bg-[#1A2621]'
              }`}
            >
              <span className="capitalize flex items-center gap-2">
                {mode === 'light' && <Sun className="w-3.5 h-3.5 text-[#C29B38]" />}
                {mode === 'dark' && <Moon className="w-3.5 h-3.5 text-[#C29B38]" />}
                {mode === 'system' && <Monitor className="w-3.5 h-3.5 text-stone-400" />}
                {mode}
              </span>
              {theme === mode && <Check className="w-3.5 h-3.5 text-[#064E3B] dark:text-[#34D399]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
