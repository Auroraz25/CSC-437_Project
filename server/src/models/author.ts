export interface Author {
  id: string;
  name: string;
  nationality: string;
  birthYear: number;
  deathYear?: number;
  bio: string;
  photoUrl?: string;
}