import React, { useState, useEffect } from 'react';
import { Photo } from '../types';
import { X, Play, Pause, ChevronLeft, ChevronRight, Music, Clock } from 'lucide-react';

interface SlideshowProps {
  photos: Photo[];
  onClose: () => void;
}

export const Slideshow: React.FC<SlideshowProps> = ({ photos, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(3000); // ms
  const [isMusicOn, setIsMusicOn] = useState(false);

  // Auto-advance
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
      }, duration);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, photos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev + 1) % photos.length);
      if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, photos.length]);

  const currentPhoto = photos[currentIndex];

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
      
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-white/80 text-sm font-medium">
          {currentIndex + 1} / {photos.length}
        </div>
        <button 
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center
              ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
            `}
          >
            {/* Background Blur */}
            <div 
              className="absolute inset-0 bg-cover bg-center blur-3xl opacity-30 scale-110"
              style={{ backgroundImage: `url(${photo.url})` }}
            />
            
            {/* Actual Image */}
            <img 
              src={photo.url} 
              alt={photo.aiData?.title || "Slideshow"} 
              className="relative max-w-full max-h-screen object-contain drop-shadow-2xl"
            />
            
            {/* Caption Overlay */}
            {photo.aiData && (
                <div className="absolute bottom-32 md:bottom-24 left-0 right-0 text-center px-4 animate-slideUp">
                    <h2 className="text-2xl md:text-4xl font-bold text-white text-shadow-lg mb-2">{photo.aiData.title}</h2>
                    <p className="text-white/80 max-w-2xl mx-auto text-sm md:text-base text-shadow">{photo.aiData.description}</p>
                </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#0f172a]/90 backdrop-blur-xl border border-slate-700/50 px-6 py-3 rounded-2xl flex items-center gap-6 shadow-2xl z-50">
        
        {/* Navigation */}
        <div className="flex items-center gap-2">
            <button 
            onClick={() => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)}
            className="p-2 hover:text-indigo-400 text-white transition-colors"
            >
            <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white shadow-lg shadow-indigo-500/40 transition-all hover:scale-105"
            >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            <button 
            onClick={() => setCurrentIndex((prev) => (prev + 1) % photos.length)}
            className="p-2 hover:text-indigo-400 text-white transition-colors"
            >
            <ChevronRight className="w-5 h-5" />
            </button>
        </div>

        <div className="w-px h-8 bg-slate-700" />

        {/* Settings */}
        <div className="flex items-center gap-4">
            
            {/* Speed Toggle */}
            <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <select 
                    value={duration} 
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer"
                >
                    <option value={3000} className="bg-slate-800">3s</option>
                    <option value={5000} className="bg-slate-800">5s</option>
                    <option value={10000} className="bg-slate-800">10s</option>
                </select>
            </div>

            {/* Music Toggle (Simulated) */}
            <button 
                onClick={() => setIsMusicOn(!isMusicOn)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors border ${isMusicOn ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                title={isMusicOn ? "Music On" : "Music Off (Simulated)"}
            >
                <Music className="w-4 h-4" />
                <span className="text-xs font-medium hidden sm:inline">{isMusicOn ? 'On' : 'Off'}</span>
            </button>
        </div>
      </div>
    </div>
  );
};
