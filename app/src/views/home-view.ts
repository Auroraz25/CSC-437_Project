import { View } from "@calpoly/mustang";
import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { Book, Author, Category, Status } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class HomeViewElement extends View<Model, Msg> {
  @state()
  searchQuery = "";

  @state()
  get books(): Book[] {
    return this.model.books || [];
  }

  @state()
  get categories(): Category[] {
    return this.model.categories || [];
  }

  @state()
  get authors(): Author[] {
    return this.model.authors || [];
  }

  @state()
  get statuses(): Status[] {
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
    this.loadData();
  }

  loadData() {
    this.dispatchMessage(["books/load", {}]);
    this.dispatchMessage(["categories/load", {}]);
    this.dispatchMessage(["authors/load", {}]);
    this.dispatchMessage(["statuses/load", {}]);
  }

  handleSearch(e: Event) {
    e.preventDefault();
    const input = this.shadowRoot?.querySelector('#searchInput') as HTMLInputElement;
    if (input && input.value.trim()) {
      window.location.href = `/app/books?search=${encodeURIComponent(input.value.trim())}`;
    }
  }

  getRecentBooks() {
    return this.books.slice(0, 6);
  }

  getPopularAuthors() {
    const authorCounts = new Map();
    this.books.forEach(book => {
      const count = authorCounts.get(book.authorId) || 0;
      authorCounts.set(book.authorId, count + 1);
    });
    
    return this.authors
      .map(author => ({
        ...author,
        bookCount: authorCounts.get(author.id) || 0
      }))
      .filter(author => author.bookCount > 0)
      .sort((a, b) => b.bookCount - a.bookCount)
      .slice(0, 5);
  }

  getReadingStats() {
    const stats = {
      total: this.books.length,
      read: 0,
      reading: 0,
      toRead: 0
    };

    const readStatus = this.statuses.find(s => s.type === 'read');
    const readingStatus = this.statuses.find(s => s.type === 'reading');
    const toReadStatus = this.statuses.find(s => s.type === 'to-read');

    this.books.forEach(book => {
      if (book.statusId === readStatus?.id) stats.read++;
      else if (book.statusId === readingStatus?.id) stats.reading++;
      else if (book.statusId === toReadStatus?.id) stats.toRead++;
    });

    return stats;
  }

  render() {
    if (this.loading) {
      return html`<div class="loading">Loading your library...</div>`;
    }

    if (this.error) {
      return html`
        <div class="error">
          <p>Error loading data: ${this.error}</p>
          <button @click=${this.loadData}>Retry</button>
        </div>
      `;
    }

    const stats = this.getReadingStats();
    const recentBooks = this.getRecentBooks();
    const popularAuthors = this.getPopularAuthors();

    return html`
      <main>
        <section class="welcome-section">
          <h1>Welcome to Your Book Collection</h1>
          <p>Manage your reading journey and discover new books</p>
        </section>

        <section class="search-section">
          <form @submit=${this.handleSearch} class="search-box">
            <input 
              type="text" 
              id="searchInput"
              placeholder="Search your books..." 
              .value=${this.searchQuery}
              @input=${(e: Event) => this.searchQuery = (e.target as HTMLInputElement).value}
            />
            <button type="submit">Search</button>
          </form>
        </section>

        <section class="stats-section">
          <div class="stats-grid">
            <div class="stat-card">
              <h3>${stats.total}</h3>
              <p>Total Books</p>
            </div>
            <div class="stat-card read">
              <h3>${stats.read}</h3>
              <p>Books Read</p>
            </div>
            <div class="stat-card reading">
              <h3>${stats.reading}</h3>
              <p>Currently Reading</p>
            </div>
            <div class="stat-card to-read">
              <h3>${stats.toRead}</h3>
              <p>Want to Read</p>
            </div>
          </div>
        </section>

        <div class="content-grid">
          <section class="main-content">
            <div class="section-header">
              <h2>Recent Books</h2>
              <a href="/app/books" class="view-all">View All Books</a>
            </div>
            
            ${recentBooks.length > 0 ? html`
              <div class="books-grid">
                ${recentBooks.map(book => html`
                  <div class="book-card">
                    <a href="/app/books/${book.id}" class="book-link">
                      <div class="book-cover" style="${book.coverUrl ? `background-image: url(${book.coverUrl}); background-size: cover; background-position: center;` : ''}"></div>
                      <div class="book-info">
                        <h4>${book.title}</h4>
                        <p>${book.author}</p>
                      </div>
                    </a>
                  </div>
                `)}
              </div>
            ` : html`
              <div class="empty-state">
                <p>No books in your collection yet.</p>
                <a href="/app/books/new" class="btn primary">Add Your First Book</a>
              </div>
            `}
          </section>

          <aside class="sidebar">
            <section class="sidebar-section">
              <h3>Browse by Category</h3>
              ${this.categories.length > 0 ? html`
                <ul class="category-list">
                  ${this.categories.slice(0, 6).map(category => html`
                    <li><a href="/app/categories/${category.id}">${category.name}</a></li>
                  `)}
                  ${this.categories.length > 6 ? html`
                    <li><a href="/app/books" class="view-more">View More...</a></li>
                  ` : ''}
                </ul>
              ` : html`<p class="no-data">No categories found</p>`}
            </section>

            <section class="sidebar-section">
              <h3>Popular Authors</h3>
              ${popularAuthors.length > 0 ? html`
                <ul class="author-list">
                  ${popularAuthors.map(author => html`
                    <li>
                      <a href="/app/authors/${author.id}">
                        ${author.name}
                        <span class="book-count">(${author.bookCount} book${author.bookCount > 1 ? 's' : ''})</span>
                      </a>
                    </li>
                  `)}
                </ul>
              ` : html`<p class="no-data">No authors found</p>`}
            </section>

            <section class="sidebar-section">
              <h3>Quick Actions</h3>
              <ul class="action-list">
                <li><a href="/app/books/new" class="action-link">Add New Book</a></li>
                <li><a href="/app/books?status=reading" class="action-link">Continue Reading</a></li>
                <li><a href="/app/books?status=to-read" class="action-link">Reading List</a></li>
              </ul>
            </section>
          </aside>
        </div>
      </main>

      <footer>
        <div class="footer-content">
          <p>My Book Collection - Your Personal Library</p>
          <nav class="footer-nav">
            <ul>
              <li><a href="/app/about">About</a></li>
              <li><a href="/app/privacy">Privacy</a></li>
              <li><a href="/app/contact">Contact</a></li>
            </ul>
          </nav>
        </div>
      </footer>
    `;
  }

  static styles = css`
    main {
      flex: 1;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 3rem;
    }

    .welcome-section h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: var(--color-text-primary);
    }

    .welcome-section p {
      font-size: 1.125rem;
      color: var(--color-text-secondary);
    }

    .search-section {
      margin-bottom: 3rem;
    }

    .search-box {
      display: flex;
      gap: 1rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .search-box input {
      flex: 1;
      padding: 0.875rem;
      border: 2px solid var(--color-border);
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .search-box input:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .search-box button {
      padding: 0.875rem 1.5rem;
      background-color: var(--color-primary, #007bff);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s ease;
    }

    .search-box button:hover {
      background-color: var(--color-primary-hover, #0056b3);
    }

    .stats-section {
      margin-bottom: 3rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: var(--color-background-card);
      padding: 1.5rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: var(--shadow-light);
      border-left: 4px solid var(--color-primary);
    }

    .stat-card.read {
      border-left-color: #28a745;
    }

    .stat-card.reading {
      border-left-color: #ffc107;
    }

    .stat-card.to-read {
      border-left-color: #17a2b8;
    }

    .stat-card h3 {
      font-size: 2rem;
      margin: 0 0 0.5rem 0;
      color: var(--color-text-primary);
    }

    .stat-card p {
      margin: 0;
      color: var(--color-text-secondary);
      font-weight: 500;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 3rem;
      margin-bottom: 3rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header h2 {
      margin: 0;
      color: var(--color-text-primary);
    }

    .view-all {
      color: var(--color-primary);
      text-decoration: none;
      font-weight: 500;
    }

    .view-all:hover {
      text-decoration: underline;
    }

    .books-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1.5rem;
    }

    .book-card {
      background: var(--color-background-card);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--shadow-light);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .book-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-medium);
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
      background-size: cover;
      background-position: center;
    }

    .book-info {
      padding: 1rem;
    }

    .book-info h4 {
      margin: 0 0 0.5rem 0;
      font-size: 0.9rem;
      line-height: 1.3;
      color: var(--color-text-primary);
    }

    .book-info p {
      margin: 0;
      font-size: 0.8rem;
      color: var(--color-text-secondary);
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--color-text-secondary);
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn.primary {
      background-color: var(--color-primary);
      color: white;
    }

    .btn.primary:hover {
      background-color: var(--color-primary-hover);
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .sidebar-section {
      background: var(--color-background-card);
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: var(--shadow-light);
    }

    .sidebar-section h3 {
      margin: 0 0 1rem 0;
      color: var(--color-text-primary);
      font-size: 1.125rem;
    }

    .category-list,
    .author-list,
    .action-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .category-list li,
    .author-list li,
    .action-list li {
      margin-bottom: 0.75rem;
    }

    .category-list a,
    .author-list a,
    .action-link {
      color: var(--color-link);
      text-decoration: none;
      display: block;
      padding: 0.5rem 0;
      transition: color 0.2s ease;
    }

    .category-list a:hover,
    .author-list a:hover,
    .action-link:hover {
      color: var(--color-primary);
      text-decoration: underline;
    }

    .book-count {
      font-size: 0.85rem;
      color: var(--color-text-secondary);
    }

    .view-more {
      font-style: italic;
      color: var(--color-text-secondary) !important;
    }

    .no-data {
      color: var(--color-text-secondary);
      font-style: italic;
      margin: 0;
    }

    .loading {
      text-align: center;
      padding: 3rem;
      color: var(--color-text-secondary);
    }

    .error {
      text-align: center;
      padding: 3rem;
      color: var(--color-error);
    }

    .error button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background: var(--color-primary);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    footer {
      background-color: var(--color-background-footer, #333);
      color: var(--color-text-inverted, white);
      padding: 1.5rem 2rem;
      margin-top: auto;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-nav ul {
      display: flex;
      list-style: none;
      gap: 1.5rem;
      margin: 0;
      padding: 0;
    }

    .footer-nav a {
      color: var(--color-text-inverted, white);
      text-decoration: none;
    }

    .footer-nav a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      main {
        padding: 1rem;
      }

      .welcome-section h1 {
        font-size: 2rem;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .content-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .books-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      }

      .footer-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  `;
}