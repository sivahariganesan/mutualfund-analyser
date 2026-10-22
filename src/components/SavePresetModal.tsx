import React, { useState } from 'react';
import { MutualFund } from '../types/portfolio';
import { CustomPreset, saveCustomPreset } from '../utils/indexedDb';
import { X, Bookmark, Check, Layers } from 'lucide-react';

interface SavePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFunds: MutualFund[];
  onPresetSaved: (preset: CustomPreset) => void;
}

export const SavePresetModal: React.FC<SavePresetModalProps> = ({
  isOpen,
  onClose,
  currentFunds,
  onPresetSaved,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a name for your preset.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      const saved = await saveCustomPreset({
        name: name.trim(),
        description: description.trim(),
        fundIds: currentFunds.map((f) => f.id),
      });
      onPresetSaved(saved);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError('Failed to save to IndexedDB: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200 dark:border-[#2e2e38] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-[#272731] flex items-center justify-between bg-slate-50 dark:bg-[#1e1e24]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-[#162720] text-emerald-700 dark:text-[#98c379] border border-transparent dark:border-[#254232] flex items-center justify-center font-bold">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Save Current Portfolio</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Stores in local IndexedDB offline storage</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-200/60 dark:hover:bg-[#25252e] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
              Preset Name *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My 11-Fund Core Portfolio"
              className="w-full text-xs p-2.5 bg-slate-50 dark:bg-[#141416] border border-slate-300 dark:border-[#2e2e38] text-slate-900 dark:text-zinc-100 rounded-lg focus:outline-emerald-600 dark:focus:outline-[#56b6c2] font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Diversified Flexi, Mid & Small cap allocation"
              className="w-full text-xs p-2.5 bg-slate-50 dark:bg-[#141416] border border-slate-300 dark:border-[#2e2e38] text-slate-900 dark:text-zinc-100 rounded-lg focus:outline-emerald-600 dark:focus:outline-[#56b6c2]"
            />
          </div>

          {/* Included funds preview */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-emerald-600 dark:text-[#56b6c2]" />
              <span>Funds to be saved ({currentFunds.length}):</span>
            </div>
            <div className="max-h-36 overflow-y-auto space-y-1 pr-1 bg-slate-50 dark:bg-[#141416] p-2.5 rounded-lg border border-slate-200/80 dark:border-[#272731] text-xs text-slate-700 dark:text-zinc-300">
              {currentFunds.map((f, idx) => (
                <div key={f.id} className="flex items-center gap-1.5 truncate">
                  <span className="text-[10px] text-slate-400 font-mono w-4 shrink-0">#{idx + 1}</span>
                  <span className="truncate">{f.name.split(' - ')[0]}</span>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 shrink-0">({f.category})</span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-xs text-rose-600 dark:text-[#e06c75] bg-rose-50 dark:bg-[#2b171a] p-2.5 rounded border border-rose-200 dark:border-[#522428]">
              {error}
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-[#272731]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-emerald-700 dark:bg-[#1e2f24] hover:bg-emerald-800 dark:hover:bg-[#273d2f] text-white dark:text-[#98c379] border border-transparent dark:border-[#32523f] font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save to IndexedDB'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
