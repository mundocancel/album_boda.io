export interface AIAnalysis {
  title: string;
  description: string;
  tags: string[];
  location?: string;
  mood?: string;
  category: 'Events' | 'People' | 'Places' | 'Nature' | 'Uncategorized';
}

export interface Photo {
  id: string;
  url: string;
  width?: number;
  height?: number;
  dateAdded: number;
  aiData?: AIAnalysis;
  isAnalyzing?: boolean;
}

export enum ViewMode {
  GRID = 'GRID',
  MASONRY = 'MASONRY'
}

export type AlbumType = 'All' | 'Events' | 'People' | 'Places' | 'Nature';
