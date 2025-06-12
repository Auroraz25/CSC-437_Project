import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import "./mini-book.js";

interface Book {
  id: string;
  title: string;
  author: string;
  href?: string;
  status?: 'read' | 'reading' | 'to-read';
  coverUrl?: string;
}

export class BookListElement extends LitElement {
  @property()
  src?: string;

  @property({ type: Boolean })
  showStatus = true;

  @state()
  books: Array<Book> = [];

  @state()
  loading = false;

  @state()
  error: string | null = null;

  mapStatusId(statusId: string): 'read' | 'reading' | 'to-read' | undefined {
    switch(statusId) {
      case 'status1': return 'read';
      case 'status2': return 'reading';
      case 'status3': return 'to-read';
      default: return undefined;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.src) {
      this.hydrate(this.src);
    }
  }

  async hydrate(src: string) {
    this.loading = true;
    this.error = null;
    
    try {
      const response = await fetch(src);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      
      const json = await response.json();
      
      if (Array.isArray(json)) {
        this.books = json.map((book: any) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          status: this.mapStatusId(book.statusId),
          href: `/app/books/${book.id}`,
          coverUrl: book.coverUrl
        }));
      } else if (json && json.books && Array.isArray(json.books)) {
        this.books = json.books.map((book: any) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          status: this.mapStatusId(book.statusId),
          href: `/app/books/${book.id}`,
          coverUrl: book.coverUrl
        }));
      } else {
        this.error = "Invalid data format";
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Unknown error";
      console.error("Error hydrating book list:", err);
    } finally {
      this.loading = false;
    }
  }

  renderBook(book: Book) {
    return html`
      <mini-book-element
        href="${book.href}"
        author="${book.author}"
        book-status="${book.status || ''}"
        ?show-status="${this.showStatus}"
        .coverUrl="${book.coverUrl}"
      >
        ${book.title}
      </mini-book-element>
    `;
  }

  render() {
    if (this.loading) {
      return html`<div class="loading">Loading books...</div>`;
    }

    if (this.error) {
      return html`<div class="error">Error: ${this.error}</div>`;
    }

    if (!this.books.length) {
      return html`<div class="empty">No books found</div>`;
    }

    return html`
      <div class="book-list-container">
        ${this.books.map(book => this.renderBook(book))}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    .book-list-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--spacing-md, 1rem);
    }
    
    .loading, .error, .empty {
      padding: 1rem;
      text-align: center;
      color: var(--color-text, #333);
      background-color: var(--color-background-subtle, #f5f5f5);
      border-radius: 0.25rem;
      grid-column: 1 / -1;
    }
    
    .error {
      color: var(--color-error, #d32f2f);
      background-color: var(--color-error-subtle, #ffebee);
    }
    
    @media (max-width: 900px) {
      .book-list-container {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }
    }
    
    @media (max-width: 700px) {
      .book-list-container {
        grid-template-columns: 1fr;
      }
    }
    
    @media (min-width: 1400px) {
      .book-list-container {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      }
    }
  `;
}

customElements.define('book-list', BookListElement);