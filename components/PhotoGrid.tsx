import React from 'react';
import { Photo, ViewMode } from '../types';
import { Sparkles, Loader2 } from 'lucide-react';

interface PhotoGridProps {
  photos: Photo[];
  onSelect: (photo: Photo) => void;
  viewMode: ViewMode;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onSelect, viewMode }) => {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Sparkles className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-xl">Your gallery is empty.</p>
        <p className="text-sm mt-2">Upload photos to get started with Gemini AI.</p>
      </div>
    );
  }

  return (
    <div className={`
      w-full p-4 md:p-8 
      ${viewMode === ViewMode.GRID 
        ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6' 
        : 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6'
      }
    `}>
      {photos.map((photo) => (
        <div 
          key={photo.id}
          className={`
            relative group rounded-2xl overflow-hidden cursor-zoom-in break-inside-avoid
            bg-slate-800 border border-slate-700/50 shadow-xl
            transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10
          `}
          onClick={() => onSelect(photo)}
        >
          {/* Image */}
          <img 
            src={photo.url} 
            alt={photo.aiData?.title || "Gallery image"}
            className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Overlay (Visible on Hover) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            
            {photo.isAnalyzing ? (
              <div className="flex items-center text-indigo-300 space-x-2 mb-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-medium">Gemini is thinking...</span>
              </div>
            ) : photo.aiData ? (
               <>
                <h3 className="text-white font-semibold text-lg line-clamp-1">{photo.aiData.title}</h3>
                <p className="text-slate-300 text-xs line-clamp-2 mt-1">{photo.aiData.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {photo.aiData.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full backdrop-blur-md">
                      #{tag}
                    </span>
                  ))}
                </div>
               </>
            ) : (
              <div className="flex items-center text-slate-300 space-x-2">
                 <Sparkles className="w-4 h-4" />
                 <span className="text-sm">Click to analyze</span>
              </div>
            )}
          </div>

          {/* AI Indicator Badge */}
          {photo.aiData && (
            <div className="absolute top-3 right-3 bg-indigo-500/90 text-white p-1.5 rounded-full shadow-lg backdrop-blur-md">
              <Sparkles className="w-3 h-3" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};