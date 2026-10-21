import React from 'react';
import { X, Globe, Database, ShieldCheck, CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react';

interface DataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataSourceModal: React.FC<DataSourceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 transition-colors">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Data Architecture &amp; Open APIs</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">How mutual fund listings &amp; stock holdings are sourced</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900">
          {/* Section 1: Fund Listings & AMFI Open API */}
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/30 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Fund Listings: Sourced via AMFI Open API</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs">
              <strong>Yes!</strong> All Indian mutual fund scheme names, official scheme codes, ISINs, and daily NAVs are freely accessible through open APIs. We connect to the public <code className="font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-950/80 px-1 py-0.5 rounded">api.mfapi.in</code> endpoint, which mirrors the <strong>Association of Mutual Funds in India (AMFI)</strong> master database of 10,000+ active schemes.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Live Search &amp; Scheme Lookup Enabled</span>
            </div>
          </div>

          {/* Section 2: Company Stock Holdings */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <FileSpreadsheet className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span>Company Stock Holdings: Regulatory Landscape</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs">
              <strong>Why no free open API exists for stock holdings:</strong>
              <br />
              SEBI requires all 44+ Indian AMCs to disclose full portfolio holdings every month (by the 10th) in separate Excel/PDF files on their respective AMC websites. However, AMFI and SEBI do <em>not</em> provide a unified, free REST API for underlying stock company weights.
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-xs">
              Commercial platforms (like Morningstar, Advisorkhoj, and Trendlyne) parse these monthly disclosures or license proprietary feeds from financial data vendors (Rupeevest, Capitaline, ACE MF).
            </p>
          </div>

          {/* Section 3: How PortfolioOverlap Pro Handles This */}
          <div className="space-y-2 pt-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              How PortfolioOverlap Pro Empowers You:
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-xs list-disc pl-4">
              <li>
                <strong>Preloaded Verified Disclosures:</strong> Top Indian mutual funds come preloaded with verified, up-to-date monthly stock holdings and weights (producing exact overlap calculations matching official monthly factsheets).
              </li>
              <li>
                <strong>Live AMFI Scheme Search:</strong> Search and import any scheme from over 10,000+ AMFI registered funds with its official category and metadata.
              </li>
              <li>
                <strong>Custom Portfolio &amp; Factsheet Paste:</strong> Easily paste or import stock holdings and weights from any AMC monthly factsheet in standard CSV/text format.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
