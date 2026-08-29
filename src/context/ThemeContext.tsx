import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';
export type ColorPalette = 'slate' | 'indigo' | 'emerald' | 'violet' | 'amber';
export type DensityMode = 'comfortable' | 'compact';
export type RadiusPreset = 'rounded' | 'sharp' | 'pill';

export interface DesignSettings {
  palette: ColorPalette;
  density: DensityMode;
  radius: RadiusPreset;
}

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  design: DesignSettings;
  setDesign: (settings: Partial<DesignSettings>) => void;
  resetDesign: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'gridmind_theme_preference';
const DESIGN_STORAGE_KEY = 'gridmind_design_settings';

const DEFAULT_DESIGN: DesignSettings = {
  palette: 'slate',
  density: 'comfortable',
  radius: 'rounded',
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch {
      // Ignore localStorage errors
    }
    return 'system';
  });

  const [design, setDesignState] = useState<DesignSettings>(() => {
    try {
      const stored = localStorage.getItem(DESIGN_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_DESIGN, ...JSON.parse(stored) };
      }
    } catch {
      // Ignore localStorage errors
    }
    return DEFAULT_DESIGN;
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (typeof window !== 'undefined') {
      if (theme === 'dark') return 'dark';
      if (theme === 'light') return 'light';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      let isDark = false;
      if (theme === 'dark') {
        isDark = true;
      } else if (theme === 'light') {
        isDark = false;
      } else {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setResolvedTheme(isDark ? 'dark' : 'light');

      if (isDark) {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
        root.style.colorScheme = 'light';
      }
    };

    applyTheme();

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore localStorage errors
    }

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        applyTheme();
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Apply design classes to root document
  useEffect(() => {
    const root = document.documentElement;
    
    // Palette attribute
    root.setAttribute('data-palette', design.palette);
    
    // Density attribute
    root.setAttribute('data-density', design.density);
    
    // Radius attribute
    root.setAttribute('data-radius', design.radius);

    try {
      localStorage.setItem(DESIGN_STORAGE_KEY, JSON.stringify(design));
    } catch {
      // Ignore
    }
  }, [design]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  const setDesign = (newSettings: Partial<DesignSettings>) => {
    setDesignState(prev => ({ ...prev, ...newSettings }));
  };

  const resetDesign = () => {
    setDesignState(DEFAULT_DESIGN);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme, design, setDesign, resetDesign }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
