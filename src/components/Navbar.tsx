import React from 'react';
import { PORTFOLIO_PRESETS } from '../data/mockFunds';
import { CustomPreset } from '../utils/indexedDb';
import { useTheme } from '../context/ThemeContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Layers,
  Printer,
  Sun,
  Moon,
  Bookmark,
  Trash2,
  Globe,
} from 'lucide-react';

interface NavbarProps {
  onSelectPreset: (presetId: string) => void;
  activePresetId?: string;
  totalFunds: number;
  onOpenDataSources: () => void;
  customPresets: CustomPreset[];
  onOpenSavePreset: () => void;
  onDeleteCustomPreset: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectPreset,
  activePresetId,
  totalFunds,
  onOpenDataSources,
  customPresets,
  onOpenSavePreset,
  onDeleteCustomPreset,
}) => {
  const { isDark, toggleTheme } = useTheme();

  const isCurrentPresetCustom = customPresets.some((p) => p.id === activePresetId);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 print:hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base sm:text-lg">
                  PortfolioOverlap<span className="text-emerald-700 dark:text-emerald-500">Pro</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider hidden sm:inline-block">
                  Multi-Fund Analytics
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Mutual Fund Overlap &bull; Concentration Risk &bull; Redundancy Matrix
              </p>
            </div>
          </div>

          {/* Controls: Presets, Theme, Install, Export */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Presets Group */}
            <div className="flex items-center gap-1.5 text-xs">
              <select
                value={activePresetId || ''}
                onChange={(e) => onSelectPreset(e.target.value)}
                className="text-xs font-semibold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-emerald-600 cursor-pointer max-w-[170px] sm:max-w-[210px] truncate"
              >
                <optgroup label="Built-in Portfolios">
                  {PORTFOLIO_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name}
                    </option>
                  ))}
                </optgroup>

                {customPresets.length > 0 && (
                  <optgroup label="My Custom Presets (IndexedDB)">
                    {customPresets.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        ★ {preset.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>

              {/* Save Current Portfolio as Preset */}
              <button
                type="button"
                onClick={onOpenSavePreset}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                title="Save current funds as new preset in IndexedDB"
              >
                <Bookmark className="w-3.5 h-3.5" />
              </button>

              {/* Delete Active Custom Preset */}
              {isCurrentPresetCustom && (
                <button
                  type="button"
                  onClick={() => onDeleteCustomPreset(activePresetId!)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                  title="Delete this custom preset from IndexedDB"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* PWA / TWA Install Button */}
            <PWAInstallButton />

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Data Sources / Open API Info */}
            <button
              type="button"
              onClick={onOpenDataSources}
              className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="View Open APIs and data architecture"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden md:inline">AMFI API</span>
              <span className="text-[10px] text-slate-400">&bull; Sources</span>
            </button>

            {/* Print / Export Report Button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Print or Save PDF report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
