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
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 print:hidden transition-colors w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3">
          {/* Logo & Branding */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-700 dark:bg-[#1a2332] text-white dark:text-[#61afef] border border-transparent dark:border-[#2d3a4e] flex items-center justify-center shadow-xs shrink-0">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base sm:text-lg truncate">
                  PortfolioOverlap<span className="text-emerald-700 dark:text-[#56b6c2]">Pro</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-800 dark:text-[#56b6c2] bg-emerald-50 dark:bg-[#152327] px-2 py-0.5 rounded-full border border-emerald-200 dark:border-[#243c44] uppercase tracking-wider hidden md:inline-block">
                  Multi-Fund Analytics
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate">
                Mutual Fund Overlap &bull; Concentration Risk &bull; Redundancy Matrix
              </p>
            </div>
          </div>

          {/* Desktop Controls (Presets, Theme, Install, Export) */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Desktop Presets Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <select
                value={activePresetId || ''}
                onChange={(e) => onSelectPreset(e.target.value)}
                className="text-xs font-semibold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-[#18181b] border border-slate-300 dark:border-[#2e2e38] rounded-lg px-2.5 py-1.5 focus:outline-emerald-600 dark:focus:outline-[#56b6c2] cursor-pointer max-w-[170px] sm:max-w-[210px] truncate"
                aria-label="Select portfolio preset"
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
                className="p-1.5 rounded-lg text-slate-600 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-[#98c379] bg-slate-50 dark:bg-[#1e1e24] hover:bg-emerald-50 dark:hover:bg-[#252530] border border-slate-300 dark:border-[#2e2e38] transition-colors cursor-pointer"
                title="Save current funds as new preset in IndexedDB"
              >
                <Bookmark className="w-3.5 h-3.5" />
              </button>

              {/* Delete Active Custom Preset */}
              {isCurrentPresetCustom && (
                <button
                  type="button"
                  onClick={() => onDeleteCustomPreset(activePresetId!)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-[#e06c75] bg-slate-50 dark:bg-[#1e1e24] border border-slate-300 dark:border-[#2e2e38] transition-colors cursor-pointer"
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
              className="p-1.5 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#1e1e24] hover:bg-slate-50 dark:hover:bg-[#262630] border border-slate-300 dark:border-[#2e2e38] rounded-lg transition-colors cursor-pointer"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#e5c07b]" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Data Sources / Open API Info */}
            <button
              type="button"
              onClick={onOpenDataSources}
              className="text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#1e1e24] hover:bg-slate-50 dark:hover:bg-[#262630] border border-slate-300 dark:border-[#2e2e38] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="View Open APIs and data architecture"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-[#56b6c2]" />
              <span className="hidden md:inline">AMFI API</span>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500">&bull; Sources</span>
            </button>

            {/* Print / Export Report Button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-[#1e1e24] hover:bg-slate-50 dark:hover:bg-[#262630] border border-slate-300 dark:border-[#2e2e38] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Print or Save PDF report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
          </div>

          {/* Mobile Right Controls: Compact utility buttons */}
          <div className="flex sm:hidden items-center gap-1.5 shrink-0">
            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Open API info */}
            <button
              type="button"
              onClick={onOpenDataSources}
              className="p-1.5 text-slate-600 dark:text-zinc-300 bg-white dark:bg-[#1e1e24] border border-slate-300 dark:border-[#2e2e38] rounded-lg cursor-pointer"
              title="Data Sources"
              aria-label="Data Sources"
            >
              <Globe className="w-4 h-4 text-emerald-600 dark:text-[#56b6c2]" />
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 text-slate-600 dark:text-zinc-300 bg-white dark:bg-[#1e1e24] border border-slate-300 dark:border-[#2e2e38] rounded-lg cursor-pointer"
              title={isDark ? 'Light Theme' : 'Dark Theme'}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#e5c07b]" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Preset Selector Bar: Dedicated full-width bar so preset names never truncate or overflow */}
      <div className="sm:hidden border-t border-slate-100 dark:border-[#272731] px-3 py-2 bg-slate-50/70 dark:bg-[#141416]/90 backdrop-blur-xs flex items-center gap-2">
        <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 shrink-0">Preset:</span>
        <select
          value={activePresetId || ''}
          onChange={(e) => onSelectPreset(e.target.value)}
          className="flex-1 min-w-0 text-xs font-semibold text-slate-800 dark:text-slate-100 bg-white dark:bg-[#18181b] border border-slate-300 dark:border-[#2e2e38] rounded-lg px-2.5 py-1.5 focus:outline-emerald-600 dark:focus:outline-[#56b6c2] cursor-pointer truncate"
          aria-label="Select portfolio preset"
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
          className="p-1.5 shrink-0 rounded-lg text-slate-600 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-[#98c379] bg-white dark:bg-[#1e1e24] border border-slate-300 dark:border-[#2e2e38] transition-colors cursor-pointer"
          title="Save current funds as new preset in IndexedDB"
        >
          <Bookmark className="w-3.5 h-3.5" />
        </button>

        {/* Delete Active Custom Preset */}
        {isCurrentPresetCustom && (
          <button
            type="button"
            onClick={() => onDeleteCustomPreset(activePresetId!)}
            className="p-1.5 shrink-0 rounded-lg text-rose-500 dark:text-[#e06c75] bg-white dark:bg-[#1e1e24] border border-slate-300 dark:border-[#2e2e38] transition-colors cursor-pointer"
            title="Delete this custom preset from IndexedDB"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
};
