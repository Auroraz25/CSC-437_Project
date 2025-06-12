import { Book, Author, Category, Comment, Status } from "server/models";

export type Msg =
  // Books messages
  | ["books/load", {}]
  | ["books/loaded", { books: Book[] }]
  | ["book/select", { bookId: string }]
  | ["book/loaded", { book: Book }]
  | ["books/filter", { query: string; filters: any }]
  | ["books/filtered", { filteredBooks: Book[] }]
  | ["books/by-author", { authorId: string }]
  | ["books/by-category", { categoryId: string }]
  | ["books/by-status", { statusId: string }]
  | ["book/save", { 
      bookId?: string; 
      book: Book; 
      onSuccess?: () => void; 
      onFailure?: (err: Error) => void; 
    }]
  | ["book/create", { 
      book: Omit<Book, 'id'>; 
      onSuccess?: (book: Book) => void; 
      onFailure?: (err: Error) => void; 
    }]
  | ["book/delete", { 
      bookId: string; 
      onSuccess?: () => void; 
      onFailure?: (err: Error) => void; 
    }]

  // Authors messages
  | ["authors/load", {}]
  | ["authors/loaded", { authors: Author[] }]
  | ["author/select", { authorId: string }]
  | ["author/loaded", { author: Author }]
  | ["author/save", { 
      authorId?: string; 
      author: Author; 
      onSuccess?: () => void; 
      onFailure?: (err: Error) => void; 
    }]
  | ["author/create", { 
      author: Omit<Author, 'id'>; 
      onSuccess?: (author: Author) => void; 
      onFailure?: (err: Error) => void; 
    }]

  // Categories messages
  | ["categories/load", {}]
  | ["categories/loaded", { categories: Category[] }]
  | ["category/select", { categoryId: string }]
  | ["category/loaded", { category: Category }]
  
  // Comments messages
  | ["comments/load", { bookId: string }]
  | ["comments/loaded", { comments: Comment[] }]
  | ["comment/select", { commentId: string }]
  | ["comment/loaded", { comment: Comment }]
  | ["comments/by-user", { userId: string }]
  | ["comment/save", { 
      commentId?: string; 
      comment: Comment; 
      onSuccess?: () => void; 
      onFailure?: (err: Error) => void; 
    }]
  | ["comment/create", { 
      comment: Omit<Comment, 'id'>; 
      onSuccess?: (comment: Comment) => void; 
      onFailure?: (err: Error) => void; 
    }]

  // Statuses messages
  | ["statuses/load", {}]
  | ["statuses/loaded", { statuses: Status[] }]
  | ["status/by-type", { type: 'read' | 'reading' | 'to-read' }]
  
  // Loading and error states
  | ["loading/start", { operation: string }]
  | ["loading/end", { operation: string }]
  | ["error/set", { error: string }]
  | ["error/clear", {}]
  | ["categories/load", {}]
  | ["categories/loaded", { categories: Category[] }]
  | ["category/select", { categoryId: string }]
  | ["category/loaded", { category: Category }]
  | ["category/save", { 
      categoryId?: string; 
      category: Category; 
      onSuccess?: () => void; 
      onFailure?: (err: Error) => void; 
    }]
  | ["category/create", { 
      category: Omit<Category, 'id'>; 
      onSuccess?: (category: Category) => void; 
      onFailure?: (err: Error) => void; 
    }]
  | ["category/delete", { 
      categoryId: string; 
      onSuccess?: () => void; 
      onFailure?: (err: Error) => void; 
    }];