// app/src/views/category-view.ts
import { View } from "@calpoly/mustang";
import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { Book, Category } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class CategoryViewElement extends View<Model, Msg> {
  @property()
  category?: string;

  @state()
  get categoryData(): Category | undefined {
    return this.model.category;
  }

  @state()
  get books(): Book[] {
    return this.model.books || [];
  }

  @state()
  get categories(): Category[] {
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
    if (this.category) {
      this.loadCategoryData();
    }
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
      name === "category" &&
      oldValue !== newValue &&
      newValue
    ) {
      this.loadCategoryData();
    }
  }

  loadCategoryData() {
    // Load the category details
    this.dispatchMessage(["category/select", { categoryId: this.category! }]);
    // Load books in this category
    this.dispatchMessage(["books/by-category", { categoryId: this.category! }]);
    // Load all categories for sidebar
    this.dispatchMessage(["categories/load", {}]);
    // Load statuses for displaying book status
    this.dispatchMessage(["statuses/load", {}]);
  }

  mapStatusId(statusId: string): string {
    const status = this.statuses.find(s => s.id === statusId);
    return status ? status.type : statusId;
  }

  getStatusText(statusId: string): string {
    const status = this.statuses.find(s => s.id === statusId);
    return status ? status.name : statusId;
  }

  // Get other categories excluding the current one
  get otherCategories(): Category[] {
    return this.categories.filter(cat => cat.id !== this.category);
  }

  // Get unique authors from books in this category
  get popularAuthors(): Array<{id: string, name: string}> {
    const authorMap = new Map();
    this.books.forEach(book => {
      if (!authorMap.has(book.authorId)) {
        authorMap.set(book.authorId, {
          id: book.authorId,
          name: book.author
        });
      }
    });
    return Array.from(authorMap.values()).slice(0, 5); // Limit to 5 authors
  }

  render() {
    if (this.loading) {
      return html`<div class="loading">Loading category...</div>`;
    }

    if (this.error) {
      return html`<div class="error">Error: ${this.error}</div>`;
    }

    if (!this.categoryData) {
      return html`<div class="empty">Category not found</div>`;
    }

    return html`
      <main>
        <div class="page-header">
          <h2>
            <svg class="icon">
              <use href="/icons/book-categories.svg#icon-category" />
            </svg>
            Category: ${this.categoryData.name}
          </h2>
          <nav class="breadcrumb">
            <ul>
              <li><a href="/app">Home</a></li>
              <li><a href="/app/categories">Categories</a></li>
              <li>${this.categoryData.name}</li>
            </ul>
          </nav>
        </div>
        
        <div class="content-grid">
          <div class="main-content">
            <section class="content-card">
              <div class="category-header">
                <div class="category-image" style="${this.categoryData.iconId ? `background-image: url(${this.categoryData.iconId}); background-size: cover; background-position: center;` : ''}">
                  ${!this.categoryData.iconId ? html`
                    <svg class="placeholder-icon">
                      <use href="/icons/book-categories.svg#icon-category" />
                    </svg>
                  ` : ''}
                </div>
                <div class="category-details">
                  <h3>About this Category</h3>
                  <p>${this.categoryData.description}</p>
                </div>
              </div>
            </section>
            
            <section class="content-card category-icon">
              <h3>
                <svg class="icon">
                  <use href="/icons/book-categories.svg#icon-book" />
                </svg>
                Books in this Category (${this.books.length})
              </h3>
              <div class="books-list">
                ${this.books.length === 0 ? html`
                  <p class="no-books">No books found in this category.</p>
                ` : ''}
                ${this.books.map(book => html`
                  <div class="book-card">
                    <a href="/app/books/${book.id}" class="book-link">
                      <div class="book-cover" style="${book.coverUrl ? `background-image: url(${book.coverUrl}); background-size: cover; background-position: center;` : ''}"></div>
                    </a>
                  </div>
                `)}
              </div>
            </section>
          </div>
          
          <aside class="sidebar">
            <section class="sidebar-card">
              <h3>Other Categories</h3>
              <ul class="category-list">
                ${this.otherCategories.length === 0 ? html`
                  <li>No other categories available</li>
                ` : ''}
                ${this.otherCategories.map(cat => html`
                  <li><a href="/app/categories/${cat.id}">${cat.name}</a></li>
                `)}
              </ul>
            </section>
            
            ${this.popularAuthors.length > 0 ? html`
              <section class="sidebar-card">
                <h3>Authors in this Category</h3>
                <ul class="author-list">
                  ${this.popularAuthors.map(author => html`
                    <li><a href="/app/authors/${author.id}">${author.name}</a></li>
                  `)}
                </ul>
              </section>
            ` : ''}
          </aside>
        </div>
      </main>
    `;
  }

  static styles = css`
    main {
      padding: 2rem;
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

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      margin-top: 2rem;
    }

    .content-card, .sidebar-card {
      background-color: var(--color-background-card);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: var(--shadow-light);
    }

    .content-card h3 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .content-card p {
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .category-header {
      display: flex;
      gap: 1.5rem;
      align-items: flex-start;
    }

    .category-image {
      width: 200px;
      height: 200px;
      background-color: var(--color-accent-light, #e3f2fd);
      border-radius: 8px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .category-image::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
      pointer-events: none;
    }

    .placeholder-icon {
      width: 80px;
      height: 80px;
      color: var(--color-accent, #007bff);
      opacity: 0.6;
    }

    .category-details {
      flex: 1;
    }

    .category-details h3 {
      margin-top: 0;
      margin-bottom: 1rem;
    }

    .books-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .no-books {
      grid-column: 1 / -1;
      text-align: center;
      color: var(--color-text-light);
      font-style: italic;
    }

    .book-card {
      border: 1px solid var(--color-border);
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      background-color: var(--color-background);
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

    .book-info h4 {
      margin: 0 0 0.5rem 0;
      color: var(--color-text);
      line-height: 1.3;
    }

    .book-author {
      margin: 0 0 0.5rem 0;
      color: var(--color-text-light);
      font-size: 0.9rem;
    }

    .book-author a {
      color: var(--color-link);
      text-decoration: none;
    }

    .book-author a:hover {
      text-decoration: underline;
    }

    .book-meta {
      margin: 0 0 0.75rem 0;
      color: var(--color-text-light);
      font-size: 0.85rem;
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

    .sidebar-card h3 {
      margin-bottom: 1rem;
    }

    .category-list, .author-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .category-list li, .author-list li {
      margin-bottom: 0.5rem;
    }

    .category-list a, .author-list a {
      color: var(--color-link);
      text-decoration: none;
      display: block;
      padding: 0.25rem 0;
    }

    .category-list a:hover, .author-list a:hover {
      text-decoration: underline;
    }

    .loading, .error, .empty {
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
      
      .content-grid {
        grid-template-columns: 1fr;
      }
      
      .books-list {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .page-header h2 {
        font-size: 1.25rem;
      }
      
      .book-card {
        margin-bottom: 1rem;
      }
    }
  `;
}