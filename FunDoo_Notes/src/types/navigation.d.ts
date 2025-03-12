import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Notes: { savedNote?: Note; deletedId?: string } | undefined;
  TextEditor: { note?: Note } | undefined;
  List: { note?: Note } | undefined;
  Drawing: { note?: Note } | undefined;
  Image: { note?: Note } | undefined;
  Settings: undefined;
  Archive: undefined;
  Trash: undefined;
  Help: undefined;
  Labels: undefined;
  Login: undefined;
  Signup: undefined;
};

export type Note = {
  id: string;
  type: 'text' | 'list' | 'drawing' | 'image';
  title?: string;
  content?: string;
  color?: string;
  pinned?: boolean;
  reminder?: Date;
  items?: Array<{ id: string; text: string }>;
  drawing?: Array<{ points: Array<{ x: number; y: number }>; color: string; width: number }>;
  imageUri?: string;
  timestamp: string;
  archived?: boolean;
  trashed?: boolean;
  labels?: string[];
};

export type NotesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Notes'>;