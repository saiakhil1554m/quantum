import React, { useState } from 'react';
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Check,
  RotateCcw,
  Sparkles,
  Maximize2,
  Minimize2,
  Square,
  CircleDot,
  X,
} from 'lucide-react';
import { useTheme, ColorPalette, DensityMode, RadiusPreset } from '../../context/ThemeContext';

interface DesignCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaletteOption {
  id: ColorPalette;
  name: string;
  description: string;
  previewBg: string;
  previewAccent: string;
  textColor: string;
}

const PALETTES: PaletteOption[] = [
  {
    id: 'slate',
    name: 'Executive Slate',
    description: 'Ultra-minimal neutral enterprise gray with deep ink accents',
    previewBg: 'bg-slate-900',
    previewAccent: 'bg-slate-700',
    textColor: 'text-slate-900 dark:text-slate-100',
  },
  {
    id: 'indigo',
    name: 'Cobalt Tech',
    description: 'Modern enterprise indigo with refined high-clarity contrast',
    previewBg: 'bg-indigo-600',
    previewAccent: 'bg-blue-500',
    textColor: 'text-indigo-900 dark:text-indigo-200',
  },
  {
    id: 'emerald',
    name: 'Clean Emerald',
    description: 'Eco-conscious soothing forest green and crisp mint accents',
    previewBg: 'bg-emerald-600',
    previewAccent: 'bg-teal-500',
    textColor: 'text-emerald-900 dark:text-emerald-200',
  },
  {
    id: 'violet',
    name: 'Precision Violet',
    description: 'High-contrast purple tone tailored for intelligent command centers',
    previewBg: 'bg-violet-600',
    previewAccent: 'bg-purple-500',
    textColor: 'text-violet-900 dark:text-violet-200',
  },
  {
    id: 'amber',
    name: 'Industrial Amber',
    description: 'Warm, high-visibility engineering palette with crisp amber edges',
    previewBg: 'bg-amber-600',
    previewAccent: 'bg-orange-500',
    textColor: 'text-amber-900 dark:text-amber-200',
  },
];

export const DesignCustomizerModal: React.FC<DesignCustomizerModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, design, setDesign, resetDesign } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Design & Theme Preferences</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Personalize your interface aesthetics and density</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Section 1: Color Scheme (Light / Dark / System) */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Theme Mode
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => setTheme('light')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 ring-2 ring-slate-900/10 dark:ring-white/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Sun className="w-4 h-4 text-amber-500" />
                  {theme === 'light' && <Check className="w-3.5 h-3.5 text-slate-900 dark:text-white" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Light</span>
                  <span className="text-[10px] text-slate-500">Crisp & bright</span>
                </div>
              </button>

              <button
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 ring-2 ring-slate-900/10 dark:ring-white/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Moon className="w-4 h-4 text-blue-400" />
                  {theme === 'dark' && <Check className="w-3.5 h-3.5 text-slate-900 dark:text-white" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Dark</span>
                  <span className="text-[10px] text-slate-500">Deep enterprise ink</span>
                </div>
              </button>

              <button
                onClick={() => setTheme('system')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                  theme === 'system'
                    ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 ring-2 ring-slate-900/10 dark:ring-white/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Monitor className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  {theme === 'system' && <Check className="w-3.5 h-3.5 text-slate-900 dark:text-white" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">System</span>
                  <span className="text-[10px] text-slate-500">Match OS setting</span>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Color Palette Accent */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Brand & Accent Style
              </label>
              <span className="text-[11px] font-medium text-slate-400">
                Current: {PALETTES.find(p => p.id === design.palette)?.name}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PALETTES.map(p => {
                const isSelected = design.palette === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setDesign({ palette: p.id })}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 ring-2 ring-slate-900/10 dark:ring-white/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1 shrink-0 mt-0.5">
                      <div className={`w-4 h-4 rounded-full ${p.previewBg}`} />
                      <div className={`w-2.5 h-2.5 rounded-full ${p.previewAccent}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{p.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-slate-900 dark:text-white shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {p.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Interface Density & Radius */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Density */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Display Density
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDesign({ density: 'comfortable' })}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    design.density === 'comfortable'
                      ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 ring-2 ring-slate-900/10 dark:ring-white/20 font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs text-slate-900 dark:text-white">Comfortable</span>
                </button>

                <button
                  onClick={() => setDesign({ density: 'compact' })}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    design.density === 'compact'
                      ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 ring-2 ring-slate-900/10 dark:ring-white/20 font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <Minimize2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs text-slate-900 dark:text-white">Compact</span>
                </button>
              </div>
            </div>

            {/* Corner Radius */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Corner Geometry
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setDesign({ radius: 'rounded' })}
                  className={`py-2 px-1.5 rounded-xl border text-center transition-all cursor-pointer text-xs ${
                    design.radius === 'rounded'
                      ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 ring-2 ring-slate-900/10 dark:ring-white/20 font-bold text-slate-900 dark:text-white'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  Rounded
                </button>

                <button
                  onClick={() => setDesign({ radius: 'sharp' })}
                  className={`py-2 px-1.5 rounded-md border text-center transition-all cursor-pointer text-xs ${
                    design.radius === 'sharp'
                      ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 ring-2 ring-slate-900/10 dark:ring-white/20 font-bold text-slate-900 dark:text-white'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  Sharp
                </button>

                <button
                  onClick={() => setDesign({ radius: 'pill' })}
                  className={`py-2 px-1.5 rounded-full border text-center transition-all cursor-pointer text-xs ${
                    design.radius === 'pill'
                      ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 ring-2 ring-slate-900/10 dark:ring-white/20 font-bold text-slate-900 dark:text-white'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  Pill
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={resetDesign}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
