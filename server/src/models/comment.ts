export interface Comment {
  id: string;
  bookId: string;
  userId: string;
  date: Date;
  rating: number;
  content: string;
  favoriteQuote?: string;
}