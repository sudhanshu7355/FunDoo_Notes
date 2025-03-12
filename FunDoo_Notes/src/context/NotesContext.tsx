
import React, { createContext, useState, ReactNode, useContext } from 'react';

export type Note = {
  id: string;
  title?: string;
  content?: string;
  items?: { text: string; checked: boolean }[];
  drawing?: { points: { x: number; y: number }[]; color: string; width: number }[];
  imageUri?: string;
  type?: 'text' | 'list' | 'drawing' | 'image';
  pinned?: boolean;
  color?: string;
  reminder?: Date;
  timestamp: string;
  archived?: boolean;
  trashed?: boolean;
  labels?: string[];
};

type NotesContextType = {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
};

export const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  return (
    <NotesContext.Provider value={{ notes, setNotes }}>
      {children}
    </NotesContext.Provider>
  );
};


export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};