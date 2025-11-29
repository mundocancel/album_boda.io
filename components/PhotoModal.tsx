import React from 'react';
import { Photo } from '../types';
import { X, Sparkles, MapPin, Tag, BrainCircuit, Loader2 } from 'lucide-react';

interface PhotoModalProps {
  photo: Photo;
  onClose: () => void;
  onAnalyze: (photo: Photo) => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({ photo, onClose, onAnalyze }) => {
  // Close on Escape key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-8">
      
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="flex flex-col lg:flex-row w-full h-full max-w-7xl bg-[#0f172a] rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
        
        {/* Image Section */}
        <div className="flex-1 bg-black flex items-center justify-center relative group">
          <img 
            src={photo.url} 
            alt="Full view" 
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Info / AI Sidebar */}
        <div className="w-full lg:w-[400px] flex flex-col border-l border-slate-800 bg-[#1e293b]">
          
          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
            
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {photo.aiData?.title || "Untitled Photo"}
              </h2>
              <p className="text-slate-400 text-sm">
                Added on {new Date(photo.dateAdded).toLocaleDateString()}
              </p>
            </div>

            {/* AI Analysis Content */}
            {photo.aiData ? (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Mood Badge */}
                {photo.aiData.mood && (
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm">
                        <BrainCircuit className="w-4 h-4" />
                        <span>Mood: {photo.aiData.mood}</span>
                    </div>
                )}

                {/* Description */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <h3 className="text-slate-200 font-semibold mb-2 text-sm uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" /> 
                    Gemini Insight
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-sm">
                    {photo.aiData.description}
                  </p>
                </div>

                {/* Location */}
                {photo.aiData.location && (
                  <div className="flex items-center space-x-3 text-slate-300">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                    <span>{photo.aiData.location}</span>
                  </div>
                )}

                {/* Tags */}
                <div>
                  <h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-3">Detected Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {photo.aiData.tags.map(tag => (
                      <span key={tag} className="flex items-center px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 text-sm transition-colors border border-slate-600">
                        <Tag className="w-3 h-3 mr-2 text-indigo-400" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                <div className="bg-slate-800 p-4 rounded-full mb-4">
                    <Sparkles className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-white font-medium mb-2">Discover Details</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Use Gemini AI to automatically generate a title, description, and tags for this photo.
                </p>
                
                <button
                  onClick={() => onAnalyze(photo)}
                  disabled={photo.isAnalyzing}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2"
                >
                  {photo.isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Analyze with Gemini</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};