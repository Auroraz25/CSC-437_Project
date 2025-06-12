import { Book, Author, Category, Comment, Status, User } from "server/models";

export interface Model {
  user?: User;
  books?: Book[];
  book?: Book;
  author?: Author;
  authors?: Author[];
  category?: Category;
  categories?: Category[];
  comment?: Comment;
  comments?: Comment[];
  statuses?: Status[];
  filteredBooks?: Book[];
  searchQuery?: string;
  filters?: {
    category: string;
    status: string;
    author: string;
    sortBy: string;
  };
  loading?: boolean;
  error?: string;
}

export const init: Model = {};