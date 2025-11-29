import React from 'react';
import { AlbumType } from '../types';
import { LayoutGrid, Calendar, Users, Map, Trees, Filter } from 'lucide-react';

interface AlbumNavProps {
  currentAlbum: AlbumType;
  setAlbum: (album: AlbumType) => void;
  counts: Record<string, number>;
}

export const AlbumNav: React.FC<AlbumNavProps> = ({ currentAlbum, setAlbum, counts }) => {
  const albums: { id: AlbumType; label: string; icon: React.ReactNode }[] = [
    { id: 'All', label: 'All Photos', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'Events', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
    { id: 'People', label: 'People', icon: <Users className="w-4 h-4" /> },
    { id: 'Places', label: 'Places', icon: <Map className="w-4 h-4" /> },
    { id: 'Nature', label: 'Nature', icon: <Trees className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full overflow-x-auto pb-2 mb-6 custom-scrollbar">
      <div className="flex space-x-2 md:justify-center min-w-max px-4">
        {albums.map((album) => (
          <button
            key={album.id}
            onClick={() => setAlbum(album.id)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${currentAlbum === album.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700/50'}
            `}
          >
            {album.icon}
            <span>{album.label}</span>
            <span className={`ml-2 text-xs py-0.5 px-1.5 rounded-full ${currentAlbum === album.id ? 'bg-white/20' : 'bg-black/20'}`}>
              {counts[album.id] || 0}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
