import React from 'react';
import { Camera, Upload, Search, Grid, LayoutDashboard, PlayCircle, Sparkles, Loader2, Link as LinkIcon } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImportClick: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onPlaySlideshow: () => void;
  onAnalyzeAll: () => void;
  isAnalyzingAll: boolean;
  totalPhotos: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  onUpload, 
  onImportClick,
  viewMode, 
  setViewMode,
  searchTerm,
  setSearchTerm,
  onPlaySlideshow,
  onAnalyzeAll,
  isAnalyzingAll,
  totalPhotos
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="bg-indigo-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 hidden sm:block">
            Lumina
          </h1>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-lg relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-full leading-5 bg-slate-800/50 text-slate-200 placeholder-slate-400 focus:outline-none focus:bg-slate-800 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
            placeholder="Search albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
           {/* Analyze All Button */}
           <button
            onClick={onAnalyzeAll}
            disabled={isAnalyzingAll}
            className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${isAnalyzingAll 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'text-indigo-300 hover:bg-indigo-500/10 border border-indigo-500/30'}
            `}
            title="Auto-organize entire album"
          >
            {isAnalyzingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span className="hidden sm:inline">{isAnalyzingAll ? 'Organizing...' : 'Organize'}</span>
          </button>

          {/* Slideshow Button */}
          <button
            onClick={onPlaySlideshow}
            disabled={totalPhotos === 0}
            className="flex items-center space-x-2 text-slate-300 hover:text-white px-3 py-2 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
            title="Play Slideshow"
          >
            <PlayCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Slideshow</span>
          </button>

          {/* View Toggles */}
          <div className="hidden sm:flex bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setViewMode(ViewMode.MASONRY)}
              className={`p-2 rounded-md transition-all ${viewMode === ViewMode.MASONRY ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              title="Masonry View"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode(ViewMode.GRID)}
              className={`p-2 rounded-md transition-all ${viewMode === ViewMode.GRID ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              title="Grid View"
            >
              <Grid className="w-5 h-5" />
            </button>
          </div>

          <div className="h-6 w-px bg-slate-700 mx-2 hidden sm:block" />

          {/* Import Button */}
          <button 
            onClick={onImportClick}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 rounded-full transition-all border border-slate-700"
            title="Import from URL"
          >
            <LinkIcon className="w-5 h-5" />
          </button>

          {/* Upload Button */}
          <label className="cursor-pointer group flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white p-2 sm:px-5 sm:py-2.5 rounded-full transition-all duration-200 shadow-lg shadow-indigo-500/30">
            <Upload className="w-5 h-5 sm:group-hover:-translate-y-0.5 transition-transform" />
            <span className="font-medium hidden sm:inline">Upload</span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              multiple 
              onChange={onUpload} 
            />
          </label>
        </div>
      </div>
    </header>
  );
};