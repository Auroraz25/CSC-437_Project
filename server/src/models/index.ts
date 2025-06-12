export interface Book {
  id: string;
  title: string;
  author: string;
  authorId: string;
  published: number;
  pages: number;
  isbn: string;
  categoryId: string;
  statusId: string;
  description: string;
  coverUrl?: string;
}

export interface Author {
  id: string;
  name: string;
  nationality: string;
  birthYear: number;
  deathYear?: number;
  bio: string;
  photoUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  iconId?: string;
}

export interface Comment {
  id: string;
  bookId: string;
  userId: string;
  date: Date;
  rating: number;
  content: string;
  favoriteQuote?: string;
}

export type StatusType = 'read' | 'reading' | 'to-read';

export interface Status {
  id: string;
  name: string;
  type: StatusType;
  description: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string;
}

export interface Credential {
  username: string;
  hashedPassword: string;
}