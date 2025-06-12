// app/src/views/books-view-mvu.ts
import { View } from "@calpoly/mustang";
import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { Book } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

interface FilterOptions {
  category: string;
  status: string;
  author: string;
  sortBy: string;
}

export class BooksViewElement extends View<Model, Msg> {
  @state()
  searchQuery = "";

  @state()
  filters: FilterOptions = {
    category: "all",
    status: "all", 
    author: "all",
    sortBy: "title"
  };

  @state()
  authors: Array<{id: string, name: string}> = [];

  @state()
  get books(): Array<Book> {
    return this.model.books || [];
  }

  @state()
  get filteredBooks(): Array<Book> {
    return this.model.filteredBooks || this.books;
  }

  @state()
  get categories() {
    return this.model.categories || [];
  }

  @state()
  get statuses() {
    return this.model.statuses || [];
  }

  @state()
  get loading(): boolean {
    return this.model.loading || false;
  }

  @state()
  get error(): string | undefined {
    return this.model.error;
  }

  constructor() {
    super("bookshelf:model");
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadInitialData();
  }

  loadInitialData() {
    this.dispatchMessage(["books/load", {}]);
    this.dispatchMessage(["categories/load", {}]);
    this.dispatchMessage(["statuses/load", {}]);
  }

  extractAuthors() {
    const authorMap = new Map();
    this.books.forEach(book => {
      if (!authorMap.has(book.authorId)) {
        authorMap.set(book.authorId, {
          id: book.authorId,
          name: book.author
        });
      }
    });
    this.authors = Array.from(authorMap.values());
  }

  mapStatusId(statusId: string): string {
    const status = this.statuses.find(s => s.id === statusId);
    return status ? status.type : statusId;
  }

  getStatusText(statusId: string): string {
    const status = this.statuses.find(s => s.id === statusId);
    return status ? status.name : statusId;
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  }

  handleSearch(e: Event) {
    const input = e.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.applyFilters();
  }

  handleFilterChange(filterType: keyof FilterOptions, value: string) {
    this.filters = { ...this.filters, [filterType]: value };
    this.applyFilters();
  }

  applyFilters() {
    this.dispatchMessage([
      "books/filter", 
      { 
        query: this.searchQuery, 
        filters: this.filters 
      }
    ]);
  }

  clearFilters() {
    this.searchQuery = "";
    this.filters = {
      category: "all",
      status: "all",
      author: "all", 
      sortBy: "title"
    };
    this.applyFilters();
    
    const searchInput = this.shadowRoot?.querySelector('#searchInput') as HTMLInputElement;
    if (searchInput) searchInput.value = "";
  }

  updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);
    if (changedProperties.has('books') && this.books.length > 0) {
      this.extractAuthors();
      this.applyFilters();
    }
  }

  render() {
    if (this.loading) {
      return html`<div class="loading">Loading books...</div>`;
    }

    if (this.error) {
      return html`<div class="error">Error: ${this.error}</div>`;
    }

    return html`
      <main>
        <div class="page-header">
          <h2>
            <svg class="icon">
              <use href="/icons/book-categories.svg#icon-book" />
            </svg>
            All Books
          </h2>
          <nav class="breadcrumb">
            <ul>
              <li><a href="/app">Home</a></li>
              <li>All Books</li>
            </ul>
          </nav>
        </div>

        <div class="controls-section">
          <div class="search-controls">
            <div class="search-box">
              <input 
                type="text" 
                id="searchInput"
                placeholder="Search books, authors, or descriptions..." 
                @input=${this.handleSearch}
              />
              <svg class="search-icon">
                <use href="/icons/book-categories.svg#icon-search" />
              </svg>
            </div>
          </div>

          <div class="filter-controls">
            <div class="filter-group">
              <label for="categoryFilter">Category:</label>
              <select 
                id="categoryFilter" 
                @change=${(e: Event) => this.handleFilterChange('category', (e.target as HTMLSelectElement).value)}
              >
                <option value="all">All Categories</option>
                ${this.categories.map(category => html`
                  <option value="${category.id}">${category.name}</option>
                `)}
              </select>
            </div>

            <div class="filter-group">
              <label for="statusFilter">Status:</label>
              <select 
                id="statusFilter"
                @change=${(e: Event) => this.handleFilterChange('status', (e.target as HTMLSelectElement).value)}
              >
                <option value="all">All Status</option>
                ${this.statuses.map(status => html`
                  <option value="${status.id}">${status.name}</option>
                `)}
              </select>
            </div>

            <div class="filter-group">
              <label for="authorFilter">Author:</label>
              <select 
                id="authorFilter"
                @change=${(e: Event) => this.handleFilterChange('author', (e.target as HTMLSelectElement).value)}
              >
                <option value="all">All Authors</option>
                ${this.authors.map(author => html`
                  <option value="${author.id}">${author.name}</option>
                `)}
              </select>
            </div>

            <div class="filter-group">
              <label for="sortFilter">Sort by:</label>
              <select 
                id="sortFilter"
                @change=${(e: Event) => this.handleFilterChange('sortBy', (e.target as HTMLSelectElement).value)}
              >
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="published">Publication Year</option>
                <option value="pages">Page Count</option>
              </select>
            </div>

            <button class="clear-filters-btn" @click=${this.clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>

        <div class="results-info">
          <p>Showing ${this.filteredBooks.length} of ${this.books.length} books</p>
        </div>

        <div class="books-grid">
          ${this.filteredBooks.length === 0 ? html`
            <div class="no-results">
              <p>No books found matching your criteria.</p>
            </div>
          ` : ''}
          
          ${this.filteredBooks.map(book => html`
            <div class="book-card">
              <a href="/app/books/${book.id}" class="book-link">
                <div class="book-cover" style="${book.coverUrl ? `background-image: url(${book.coverUrl}); background-size: cover; background-position: center;` : ''}"></div>
                <div class="book-info">
                  <h3 class="book-title">${book.title}</h3>
                  <p class="book-author">by ${book.author}</p>
                  <p class="book-meta">${book.published} • ${book.pages} pages</p>
                  <p class="book-category">${this.getCategoryName(book.categoryId)}</p>
                  <span class="book-status status-${this.mapStatusId(book.statusId)}">
                    ${this.getStatusText(book.statusId)}
                  </span>
                </div>
              </a>
            </div>
          `)}
        </div>
      </main>
    `;
  }

  static styles = css`
    main {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header h2 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .icon {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }

    .breadcrumb ul {
      display: flex;
      gap: 1rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .breadcrumb a {
      color: var(--color-link);
      text-decoration: none;
    }

    .controls-section {
      background-color: var(--color-background-card);
      padding: 1.5rem;
      border-radius: 8px;
      margin: 2rem 0;
      box-shadow: var(--shadow-light);
    }

    .search-controls {
      margin-bottom: 1.5rem;
    }

    .search-box {
      position: relative;
      max-width: 500px;
    }

    .search-box input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      font-size: 1rem;
    }

    .search-box input:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.25);
    }

    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      fill: var(--color-text-light);
    }

    .filter-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .filter-group label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text);
    }

    .filter-group select {
      padding: 0.5rem;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      font-size: 0.875rem;
      min-width: 140px;
    }

    .clear-filters-btn {
      padding: 0.5rem 1rem;
      background-color: var(--color-secondary, #6c757d);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      height: fit-content;
    }

    .clear-filters-btn:hover {
      background-color: #5a6268;
    }

    .results-info {
      margin: 1rem 0;
      color: var(--color-text-light);
      font-size: 0.9rem;
    }

    .books-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .book-card {
      background-color: var(--color-background-card);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--shadow-light);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .book-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-medium, 0 4px 8px rgba(0,0,0,0.15));
    }

    .book-link {
      display: block;
      text-decoration: none;
      color: inherit;
    }

    .book-cover {
      width: 100%;
      height: 200px;
      background-color: var(--color-accent-light);
    }

    .book-info {
      padding: 1rem;
    }

    .book-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-text);
      line-height: 1.3;
    }

    .book-author {
      margin: 0 0 0.25rem 0;
      color: var(--color-text-light);
      font-size: 0.9rem;
    }

    .book-meta {
      margin: 0 0 0.5rem 0;
      color: var(--color-text-light);
      font-size: 0.85rem;
    }

    .book-category {
      margin: 0 0 0.75rem 0;
      color: var(--color-accent);
      font-size: 0.85rem;
      font-weight: 500;
    }

    .book-status {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .status-read {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .status-reading {
      background-color: #fff8e1;
      color: #f57f17;
    }

    .status-to-read {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .no-results {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
      color: var(--color-text-light);
    }

    .loading, .error {
      padding: 2rem;
      text-align: center;
    }

    .error {
      color: var(--color-error, #d32f2f);
    }

    @media (max-width: 768px) {
      main {
        padding: 1rem;
      }
      
      .filter-controls {
        flex-direction: column;
        align-items: stretch;
      }
      
      .filter-group {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
      
      .filter-group select {
        min-width: auto;
        flex: 1;
        max-width: 200px;
      }
      
      .books-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .filter-group {
        flex-direction: column;
        align-items: stretch;
      }
      
      .filter-group select {
        max-width: none;
      }
    }
  `;
}