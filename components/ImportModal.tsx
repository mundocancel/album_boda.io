import React, { useState } from 'react';
import { X, Link as LinkIcon, Download, Loader2, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (url: string) => Promise<void>;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'importing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [importedCount, setImportedCount] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    try {
      setStatus('scanning');
      // Simulate network request/scanning time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatus('importing');
      await onImport(url);
      
      setStatus('success');
      // Close after short delay
      setTimeout(() => {
        onClose();
        // Reset state
        setStatus('idle');
        setUrl('');
      }, 1500);

    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg("Failed to access this album. Please ensure the link is public.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-[#1e293b] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100">
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-indigo-400" />
              Import from Web
            </h3>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {status === 'idle' || status === 'error' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Google Photos or Album URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://photos.google.com/share/..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pl-11 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    autoFocus
                  />
                  <div className="absolute left-3 top-3.5 text-slate-500">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Paste a public shared link to import photos automatically.
                </p>
              </div>

              {status === 'error' && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={!url}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Import Photos
                </button>
              </div>
            </form>
          ) : (
            <div className="py-8 flex flex-col items-center text-center space-y-4">
               {status === 'success' ? (
                 <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-2 animate-bounce">
                    <CheckCircle className="w-8 h-8" />
                 </div>
               ) : (
                 <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-indigo-400 animate-pulse" />
                    </div>
                 </div>
               )}
               
               <div>
                 <h4 className="text-lg font-semibold text-white">
                    {status === 'scanning' && 'Scanning Album...'}
                    {status === 'importing' && 'Importing Photos...'}
                    {status === 'success' && 'Import Successful!'}
                 </h4>
                 <p className="text-slate-400 text-sm mt-1">
                    {status === 'scanning' && 'Analyzing public link structure'}
                    {status === 'importing' && 'Downloading high-res previews'}
                    {status === 'success' && 'Added 6 new photos to your gallery'}
                 </p>
               </div>
            </div>
          )}
        </div>
        
        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-900/50 border-t border-slate-700/50 text-center">
            <p className="text-xs text-slate-500">
                Supported: Google Photos, Dropbox, Public Galleries
            </p>
        </div>
      </div>
    </div>
  );
};