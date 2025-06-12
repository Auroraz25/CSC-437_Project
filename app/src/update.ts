// app/src/update.ts
import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Book, Author, Category, Comment, Status } from "server/models";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "books/load":
      loadBooks(message[1], user)
        .then((books) =>
          apply((model) => ({ ...model, books, loading: false }))
        )
        .catch((error) =>
          apply((model) => ({ ...model, error: error.message, loading: false }))
        );
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "book/select":
      loadBook(message[1], user)
        .then((book) =>
          apply((model) => ({ ...model, book, loading: false }))
        )
        .catch((error) =>
          apply((model) => ({ ...model, error: error.message, loading: false }))
        );
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "books/by-author":
      loadBooksByAuthor(message[1], user)
        .then((books) =>
          apply((model) => ({ ...model, books, loading: false }))
        )
        .catch((error) =>
          apply((model) => ({ ...model, error: error.message, loading: false }))
        );
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "books/by-category":
      loadBooksByCategory(message[1], user)
        .then((books) =>
          apply((model) => ({ ...model, books, loading: false }))
        )
        .catch((error) =>
          apply((model) => ({ ...model, error: error.message, loading: false }))
        );
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "books/by-status":
      loadBooksByStatus(message[1], user)
        .then((books) =>
          apply((model) => ({ ...model, books, loading: false }))
        )
        .catch((error) =>
          apply((model) => ({ ...model, error: error.message, loading: false }))
        );
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "authors/load":
      loadAuthors(message[1], user)
        .then((authors) =>
          apply((model) => ({ ...model, authors, loading: false }))
        )
        .catch((error) =>
          apply((model) => ({ ...model, error: error.message, loading: false }))
        );
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "author/select":
      loadAuthor(message[1], user)
        .then((author) =>
          apply((model) => ({ ...model, author, loading: false }))
        )
        .catch((error) =>
          apply((model) => ({ ...model, error: error.message, loading: false }))
        );
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "categories/load":
      loadCategories(message[1], user)
        .then((categories) =>
          apply((model) => ({ ...model, categories, loading: false }))
        )
        .catch((error) =>
          apply((model) => ({ ...model, error: error.message, loading: false }))
        );
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "category/select":
      loadCategory(message[1], user)
        .then((category) =>
          apply((model) => ({ ...model, category, loading: false }))
        )
        .catch((error) =>
          apply((model) => ({ ...model, error: error.message, loading: false }))
        );
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "comments/load":
      loadComments(message[1], user)
        .then((comments) =>
          apply((model) => ({ ...model, comments, loading: false }))
        )
        .catch((error) =>
          apply((model) => ({ ...model, error: error.message, loading: false }))
        );
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "comment/select":
      loadComment(message[1], user)
        .then((comment) =>
          apply((model) => ({ ...model, comment, loading: false }))
        )
        .catch((error) =>
          apply((model) => ({ ...model, error: error.message, loading: false }))
        );
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "comments/by-user":
      loadCommentsByUser(message[1], user)
        .then((comments) =>
          apply((model) => ({ ...model, comments, loading: false }))
        )
        .catch((error) =>
          apply((model) => ({ ...model, error: error.message, loading: false }))
        );
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "statuses/load":
      loadStatuses(message[1], user)
        .then((statuses) =>
          apply((model) => ({ ...model, statuses, loading: false }))
        )
        .catch((error) =>
          apply((model) => ({ ...model, error: error.message, loading: false }))
        );
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "books/filter":
      apply((model) => {
        const { query, filters } = message[1];
        const filteredBooks = filterBooks(model.books || [], query, filters);
        return { 
          ...model, 
          searchQuery: query, 
          filters, 
          filteredBooks 
        };
      });
      break;

    case "error/clear":
      apply((model) => ({ ...model, error: undefined }));
      break;
    
    case "book/save":
      saveBook(message[1], user)
        .then((book) =>
          apply((model) => ({ ...model, book, loading: false }))
        )
        .then(() => {
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          apply((model) => ({ ...model, error: error.message, loading: false }));
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "book/create":
      createBook(message[1], user)
        .then((book) => {
          apply((model) => ({ 
            ...model, 
            book,
            books: model.books ? [...model.books, book] : [book],
            loading: false 
          }));
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess(book);
        })
        .catch((error: Error) => {
          apply((model) => ({ ...model, error: error.message, loading: false }));
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "book/delete":
      deleteBook(message[1], user)
        .then(() => {
          apply((model) => ({ 
            ...model, 
            books: model.books?.filter(b => b.id !== message[1].bookId),
            loading: false 
          }));
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          apply((model) => ({ ...model, error: error.message, loading: false }));
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "comment/save":
      saveComment(message[1], user)
        .then((comment) => {
          apply((model) => ({ 
            ...model, 
            comment,
            comments: model.comments?.map(c => c.id === comment.id ? comment : c),
            loading: false 
          }));
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          apply((model) => ({ ...model, error: error.message, loading: false }));
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "comment/create":
      createComment(message[1], user)
        .then((comment) => {
          apply((model) => ({ 
            ...model, 
            comment,
            comments: model.comments ? [...model.comments, comment] : [comment],
            loading: false 
          }));
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess(comment);
        })
        .catch((error: Error) => {
          apply((model) => ({ ...model, error: error.message, loading: false }));
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;
    case "category/save":
      saveCategory(message[1], user)
        .then((category) =>
          apply((model) => ({ ...model, category, loading: false }))
        )
        .then(() => {
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          apply((model) => ({ ...model, error: error.message, loading: false }));
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "category/create":
      createCategory(message[1], user)
        .then((category) => {
          apply((model) => ({ 
            ...model, 
            category,
            categories: model.categories ? [...model.categories, category] : [category],
            loading: false 
          }));
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess(category);
        })
        .catch((error: Error) => {
          apply((model) => ({ ...model, error: error.message, loading: false }));
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "category/delete":
      deleteCategory(message[1], user)
        .then(() => {
          apply((model) => ({ 
            ...model, 
            categories: model.categories?.filter(c => c.id !== message[1].categoryId),
            loading: false 
          }));
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          apply((model) => ({ ...model, error: error.message, loading: false }));
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "author/save":
      saveAuthor(message[1], user)
        .then((author) =>
          apply((model) => ({ ...model, author, loading: false }))
        )
        .then(() => {
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          apply((model) => ({ ...model, error: error.message, loading: false }));
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "author/create":
      createAuthor(message[1], user)
        .then((author) => {
          apply((model) => ({ 
            ...model, 
            author,
            authors: model.authors ? [...model.authors, author] : [author],
            loading: false 
          }));
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess(author);
        })
        .catch((error: Error) => {
          apply((model) => ({ ...model, error: error.message, loading: false }));
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;

    case "author/delete":
      deleteAuthor(message[1], user)
        .then(() => {
          apply((model) => ({ 
            ...model, 
            authors: model.authors?.filter(a => a.id !== message[1].authorId),
            loading: false 
          }));
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          apply((model) => ({ ...model, error: error.message, loading: false }));
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      apply((model) => ({ ...model, loading: true, error: undefined }));
      break;
    default:
      const unhandled: never = message[0];
      throw new Error(`Unhandled message "${unhandled}"`);
  }
}

// Helper functions for API calls
function loadBooks(
  payload: {},
  user: Auth.User
): Promise<Book[]> {
  return fetch("/api/books", {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to load books: ${response.status}`);
    })
    .then((json: unknown) => {
      if (Array.isArray(json)) {
        return json as Book[];
      }
      throw new Error("Invalid books data format");
    });
}

function loadBook(
  payload: { bookId: string },
  user: Auth.User
): Promise<Book> {
  return fetch(`/api/books/${payload.bookId}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to load book: ${response.status}`);
    })
    .then((json: unknown) => {
      if (json) {
        return json as Book;
      }
      throw new Error("Book not found");
    });
}

function loadBooksByAuthor(
  payload: { authorId: string },
  user: Auth.User
): Promise<Book[]> {
  return fetch(`/api/books/author/${payload.authorId}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to load books by author: ${response.status}`);
    })
    .then((json: unknown) => {
      if (Array.isArray(json)) {
        return json as Book[];
      }
      throw new Error("Invalid books data format");
    });
}

function loadBooksByCategory(
  payload: { categoryId: string },
  user: Auth.User
): Promise<Book[]> {
  return fetch(`/api/books/category/${payload.categoryId}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to load books by category: ${response.status}`);
    })
    .then((json: unknown) => {
      if (Array.isArray(json)) {
        return json as Book[];
      }
      throw new Error("Invalid books data format");
    });
}

function loadBooksByStatus(
  payload: { statusId: string },
  user: Auth.User
): Promise<Book[]> {
  return fetch(`/api/books/status/${payload.statusId}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to load books by status: ${response.status}`);
    })
    .then((json: unknown) => {
      if (Array.isArray(json)) {
        return json as Book[];
      }
      throw new Error("Invalid books data format");
    });
}

function loadAuthors(
  payload: {},
  user: Auth.User
): Promise<Author[]> {
  return fetch("/api/authors", {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to load authors: ${response.status}`);
    })
    .then((json: unknown) => {
      if (Array.isArray(json)) {
        return json as Author[];
      }
      throw new Error("Invalid authors data format");
    });
}

function loadAuthor(
  payload: { authorId: string },
  user: Auth.User
): Promise<Author> {
  return fetch(`/api/authors/${payload.authorId}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to load author: ${response.status}`);
    })
    .then((json: unknown) => {
      if (json) {
        return json as Author;
      }
      throw new Error("Author not found");
    });
}

function loadCategories(
  payload: {},
  user: Auth.User
): Promise<Category[]> {
  return fetch("/api/categories", {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to load categories: ${response.status}`);
    })
    .then((json: unknown) => {
      if (Array.isArray(json)) {
        return json as Category[];
      }
      throw new Error("Invalid categories data format");
    });
}

function loadCategory(
  payload: { categoryId: string },
  user: Auth.User
): Promise<Category> {
  return fetch(`/api/categories/${payload.categoryId}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to load category: ${response.status}`);
    })
    .then((json: unknown) => {
      if (json) {
        return json as Category;
      }
      throw new Error("Category not found");
    });
}

function loadComments(
  payload: { bookId: string },
  user: Auth.User
): Promise<Comment[]> {
  return fetch(`/api/comments/book/${payload.bookId}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to load comments: ${response.status}`);
    })
    .then((json: unknown) => {
      if (Array.isArray(json)) {
        return json as Comment[];
      }
      throw new Error("Invalid comments data format");
    });
}

function loadComment(
  payload: { commentId: string },
  user: Auth.User
): Promise<Comment> {
  return fetch(`/api/comments/${payload.commentId}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to load comment: ${response.status}`);
    })
    .then((json: unknown) => {
      if (json) {
        return json as Comment;
      }
      throw new Error("Comment not found");
    });
}

function loadCommentsByUser(
  payload: { userId: string },
  user: Auth.User
): Promise<Comment[]> {
  return fetch(`/api/comments/user/${payload.userId}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to load user comments: ${response.status}`);
    })
    .then((json: unknown) => {
      if (Array.isArray(json)) {
        return json as Comment[];
      }
      throw new Error("Invalid comments data format");
    });
}

function saveBook(
  payload: { bookId?: string; book: Book },
  user: Auth.User
): Promise<Book> {
  const { bookId, book } = payload;
  const url = bookId ? `/api/books/${bookId}` : `/api/books`;
  const method = bookId ? 'PUT' : 'POST';

  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(book)
  })
    .then((response: Response) => {
      if (response.status === 200 || response.status === 201) {
        return response.json();
      }
      throw new Error(`Failed to save book: ${response.status}`);
    })
    .then((json: unknown) => {
      if (json) {
        return json as Book;
      }
      throw new Error("Invalid response from server");
    });
}

function createBook(
  payload: { book: Omit<Book, 'id'> },
  user: Auth.User
): Promise<Book> {
  return fetch('/api/books', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(payload.book)
  })
    .then((response: Response) => {
      if (response.status === 201) {
        return response.json();
      }
      throw new Error(`Failed to create book: ${response.status}`);
    })
    .then((json: unknown) => {
      if (json) {
        return json as Book;
      }
      throw new Error("Invalid response from server");
    });
}

function deleteBook(
  payload: { bookId: string },
  user: Auth.User
): Promise<void> {
  return fetch(`/api/books/${payload.bookId}`, {
    method: 'DELETE',
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status !== 204) {
        throw new Error(`Failed to delete book: ${response.status}`);
      }
    });
}

function createComment(
  payload: { comment: Omit<Comment, 'id'> },
  user: Auth.User
): Promise<Comment> {
  const commentWithId = {
    ...payload.comment,
    id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    date: new Date()
  };

  return fetch('/api/comments', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(commentWithId)
  })
    .then((response: Response) => {
      if (response.status === 201) {
        return response.json();
      }
      return response.json().then(errorData => {
        throw new Error(errorData.error || `Failed to create comment: ${response.status}`);
      });
    })
    .then((json: unknown) => {
      if (json) {
        return json as Comment;
      }
      throw new Error("Invalid response from server");
    });
}

function saveComment(
  payload: { commentId?: string; comment: Comment },
  user: Auth.User
): Promise<Comment> {
  const { commentId, comment } = payload;
  const url = commentId ? `/api/comments/${commentId}` : `/api/comments`;
  const method = commentId ? 'PUT' : 'POST';

  if (!commentId && !comment.id) {
    comment.id = `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(comment)
  })
    .then((response: Response) => {
      if (response.status === 200 || response.status === 201) {
        return response.json();
      }
      return response.json().then(errorData => {
        throw new Error(errorData.error || `Failed to save comment: ${response.status}`);
      });
    })
    .then((json: unknown) => {
      if (json) {
        return json as Comment;
      }
      throw new Error("Invalid response from server");
    });
}

function loadStatuses(
  payload: {},
  user: Auth.User
): Promise<Status[]> {
  return fetch("/api/statuses", {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(`Failed to load statuses: ${response.status}`);
    })
    .then((json: unknown) => {
      if (Array.isArray(json)) {
        return json as Status[];
      }
      throw new Error("Invalid statuses data format");
    });
}

// Helper function for filtering books
function filterBooks(books: Book[], query: string, filters: any): Book[] {
  let filtered = [...books];

  if (query) {
    const searchQuery = query.toLowerCase();
    filtered = filtered.filter(book => 
      book.title.toLowerCase().includes(searchQuery) ||
      book.author.toLowerCase().includes(searchQuery) ||
      book.description.toLowerCase().includes(searchQuery)
    );
  }

  if (filters.category !== "all") {
    filtered = filtered.filter(book => book.categoryId === filters.category);
  }

  if (filters.status !== "all") {
    filtered = filtered.filter(book => book.statusId === filters.status);
  }

  if (filters.author !== "all") {
    filtered = filtered.filter(book => book.authorId === filters.author);
  }

  // Sort the filtered results
  switch (filters.sortBy) {
    case "title":
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "author":
      filtered.sort((a, b) => a.author.localeCompare(b.author));
      break;
    case "published":
      filtered.sort((a, b) => b.published - a.published);
      break;
    case "pages":
      filtered.sort((a, b) => a.pages - b.pages);
      break;
  }

  return filtered;
}

function createAuthor(
  payload: { author: Omit<Author, 'id'> },
  user: Auth.User
): Promise<Author> {
  return fetch('/api/authors', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(payload.author)
  })
    .then((response: Response) => {
      if (response.status === 201) {
        return response.json();
      }
      throw new Error(`Failed to create author: ${response.status}`);
    })
    .then((json: unknown) => {
      if (json) {
        return json as Author;
      }
      throw new Error("Invalid response from server");
    });
}

function deleteAuthor(
  payload: { authorId: string },
  user: Auth.User
): Promise<void> {
  return fetch(`/api/authors/${payload.authorId}`, {
    method: 'DELETE',
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status !== 204) {
        throw new Error(`Failed to delete author: ${response.status}`);
      }
    });
}

function saveAuthor(
  payload: { authorId?: string; author: Author },
  user: Auth.User
): Promise<Author> {
  const { authorId, author } = payload;
  const url = authorId ? `/api/authors/${authorId}` : `/api/authors`;
  const method = authorId ? 'PUT' : 'POST';

  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(author)
  })
    .then((response: Response) => {
      if (response.status === 200 || response.status === 201) {
        return response.json();
      }
      throw new Error(`Failed to save author: ${response.status}`);
    })
    .then((json: unknown) => {
      if (json) {
        return json as Author;
      }
      throw new Error("Invalid response from server");
    });
}

function saveCategory(
  payload: { categoryId?: string; category: Category },
  user: Auth.User
): Promise<Category> {
  const { categoryId, category } = payload;
  const url = categoryId ? `/api/categories/${categoryId}` : `/api/categories`;
  const method = categoryId ? 'PUT' : 'POST';

  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(category)
  })
    .then((response: Response) => {
      if (response.status === 200 || response.status === 201) {
        return response.json();
      }
      throw new Error(`Failed to save category: ${response.status}`);
    })
    .then((json: unknown) => {
      if (json) {
        return json as Category;
      }
      throw new Error("Invalid response from server");
    });
}

function createCategory(
  payload: { category: Omit<Category, 'id'> },
  user: Auth.User
): Promise<Category> {
  return fetch('/api/categories', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(payload.category)
  })
    .then((response: Response) => {
      if (response.status === 201) {
        return response.json();
      }
      throw new Error(`Failed to create category: ${response.status}`);
    })
    .then((json: unknown) => {
      if (json) {
        return json as Category;
      }
      throw new Error("Invalid response from server");
    });
}

function deleteCategory(
  payload: { categoryId: string },
  user: Auth.User
): Promise<void> {
  return fetch(`/api/categories/${payload.categoryId}`, {
    method: 'DELETE',
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status !== 204) {
        throw new Error(`Failed to delete category: ${response.status}`);
      }
    });
}