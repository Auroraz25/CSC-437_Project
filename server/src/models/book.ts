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