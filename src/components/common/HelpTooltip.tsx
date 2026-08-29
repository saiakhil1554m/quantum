import React, { useState } from 'react';
import { HelpCircle, Info } from 'lucide-react';

interface HelpTooltipProps {
  content: string;
  title?: string;
  variant?: 'circle' | 'info' | 'text';
  children?: React.ReactNode;
  className?: string;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  title,
  variant = 'circle',
  children,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Information tooltip"
        className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors p-0.5 inline-flex items-center"
      >
        {children ? (
          children
        ) : variant === 'info' ? (
          <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600 transition-colors" />
        ) : (
          <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600 transition-colors" />
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-lg border border-slate-700 pointer-events-none animate-in fade-in duration-150">
          {title && <p className="font-semibold text-slate-100 mb-0.5">{title}</p>}
          <p className="text-slate-300 leading-relaxed">{content}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};
