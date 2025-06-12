// app/src/views/book-detail-view-mvu.ts
import { View, History } from "@calpoly/mustang";
import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { Book } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class BookDetailViewElement extends View<Model, Msg> {
  @property({ attribute: "book-id" })
  bookId?: string;

  @state()
  get book(): Book | undefined {
    return this.model.book;
  }

  @state()
  get comments() {
    return this.model.comments || [];
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
    if (this.bookId) {
      this.loadBookData();
    }
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
      name === "book-id" &&
      oldValue !== newValue &&
      newValue
    ) {
      this.dispatchMessage([
        "book/select",
        { bookId: newValue }
      ]);
      this.dispatchMessage([
        "comments/load",
        { bookId: newValue }
      ]);
    }
  }

  loadBookData() {
    this.dispatchMessage(["book/select", { bookId: this.bookId! }]);
    this.dispatchMessage(["comments/load", { bookId: this.bookId! }]);
    this.dispatchMessage(["categories/load", {}]);
    this.dispatchMessage(["statuses/load", {}]);
  }

  mapStatusId(statusId: string): string {
    const status = this.statuses.find(s => s.id === statusId);
    return status ? status.type : statusId;
  }

  getStatusText(statusId: string) {
    const status = this.statuses.find(s => s.id === statusId);
    return status ? status.name : statusId;
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  }

  handleDelete() {
    if (confirm(`Are you sure you want to delete "${this.book?.title}"?`)) {
      this.dispatchMessage([
        "book/delete",
        {
          bookId: this.bookId!,
          onSuccess: () =>
            History.dispatch(this, "history/navigate", {
              href: "/app/books"
            }),
          onFailure: (error: Error) =>
            console.log("ERROR:", error)
        }
      ]);
    }
  }

  render() {
    if (this.loading) {
      return html`<div class="loading">Loading book...</div>`;
    }

    if (this.error) {
      return html`<div class="error">Error: ${this.error}</div>`;
    }

    if (!this.book) {
      return html`<div class="empty">Book not found</div>`;
    }

    return html`
      <main>
        <div class="page-header">
          <h2>${this.book.title}</h2>
          <nav class="breadcrumb">
            <ul>
              <li><a href="/app">Home</a></li>
              <li><a href="/app/books">Books</a></li>
              <li>${this.book.title}</li>
            </ul>
          </nav>
        </div>
        
        <div class="book-detail-grid">
          <div class="book-cover-section">
            <div class="book-cover large" style="${this.book.coverUrl ? `background-image: url(${this.book.coverUrl}); background-size: cover; background-position: center;` : ''}"></div>
            <div class="book-actions">
              <a href="/app/books/${this.bookId}/edit" class="btn primary">Edit Book</a>
              <button class="btn secondary" @click=${this.handleDelete}>Delete Book</button>
              <a href="/app/books/${this.bookId}/comments/new" class="btn accent">Add Review</a>
            </div>
          </div>
          
          <div class="book-info-section">
            <h3 class="book-title">${this.book.title}</h3>
            <p class="book-author">By <a href="/app/authors/${this.book.authorId}">${this.book.author}</a></p>
            <div class="book-metadata">
              <div class="metadata-item">
                <span class="label">Published:</span>
                <span class="value">${this.book.published}</span>
              </div>
              <div class="metadata-item">
                <span class="label">Pages:</span>
                <span class="value">${this.book.pages}</span>
              </div>
              <div class="metadata-item">
                <span class="label">ISBN:</span>
                <span class="value">${this.book.isbn}</span>
              </div>
              <div class="metadata-item">
                <span class="label">Category:</span>
                <span class="value"><a href="/app/categories/${this.book.categoryId}">${this.getCategoryName(this.book.categoryId)}</a></span>
              </div>
              <div class="metadata-item">
                <span class="label">Status:</span>
                <span class="value status-${this.mapStatusId(this.book.statusId)}">${this.getStatusText(this.book.statusId)}</span>
              </div>
            </div>
            
            <div class="book-description">
              <h4>Description</h4>
              <p>${this.book.description}</p>
            </div>
          </div>
          
          <aside class="book-sidebar">
            <section class="sidebar-card">
              <h4>Related Information</h4>
              <ul class="related-links">
                <li><a href="/app/authors/${this.book.authorId}">Author: ${this.book.author}</a></li>
                <li><a href="/app/categories/${this.book.categoryId}">Category: ${this.getCategoryName(this.book.categoryId)}</a></li>
              </ul>
            </section>
            
            ${this.comments && this.comments.length ? html`
              <section class="sidebar-card">
                <h4>My Comments</h4>
                <ul class="comment-list">
                  ${this.comments.map(comment => html`
                    <li><a href="/app/books/${this.bookId}/comments/${comment.id}">Rating: ${comment.rating}/5</a></li>
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
      margin-bottom: 1rem;
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

    .book-detail-grid {
      display: grid;
      grid-template-columns: 200px 1fr 250px;
      gap: 2rem;
      margin-top: 2rem;
    }

    .book-cover-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .book-cover.large {
      width: 100%;
      height: 300px;
      background-color: var(--color-accent-light);
      border-radius: 8px;
    }

    .book-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .btn {
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      text-align: center;
      font-size: 0.875rem;
    }

    .btn.primary {
      background-color: var(--color-primary, #007bff);
      color: white;
    }

    .btn.secondary {
      background-color: var(--color-secondary, #6c757d);
      color: white;
    }

    .btn.accent {
      background-color: var(--color-accent, #28a745);
      color: white;
    }

    .book-info-section {
      padding: 0 1rem;
    }

    .book-title {
      margin-bottom: 0.5rem;
      font-size: 1.5rem;
    }

    .book-author {
      margin-bottom: 1.5rem;
      font-size: 1.125rem;
    }

    .book-author a {
      color: var(--color-link);
      text-decoration: none;
    }

    .book-metadata {
      margin-bottom: 2rem;
    }

    .metadata-item {
      display: flex;
      margin-bottom: 0.5rem;
    }

    .metadata-item .label {
      font-weight: 600;
      min-width: 100px;
    }

    .metadata-item .value a {
      color: var(--color-link);
      text-decoration: none;
    }

    .status-read {
      color: #2e7d32;
      font-weight: 600;
    }

    .status-reading {
      color: #f57f17;
      font-weight: 600;
    }

    .status-to-read {
      color: #1565c0;
      font-weight: 600;
    }

    .book-description h4 {
      margin-bottom: 1rem;
    }

    .book-description p {
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .book-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .sidebar-card {
      background-color: var(--color-background-card);
      padding: 1rem;
      border-radius: 8px;
      box-shadow: var(--shadow-light);
    }

    .sidebar-card h4 {
      margin-bottom: 1rem;
    }

    .related-links, .comment-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .related-links li, .comment-list li {
      margin-bottom: 0.5rem;
    }

    .related-links a, .comment-list a {
      color: var(--color-link);
      text-decoration: none;
    }

    .loading, .error, .empty {
      padding: 2rem;
      text-align: center;
    }

    .error {
      color: var(--color-error, #d32f2f);
    }

    @media (max-width: 1024px) {
      .book-detail-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      
      .book-cover-section {
        flex-direction: row;
        align-items: flex-start;
      }
      
      .book-cover.large {
        width: 200px;
        height: 300px;
        flex-shrink: 0;
      }
      
      .book-actions {
        flex: 1;
        margin-left: 1rem;
      }
    }

    @media (max-width: 768px) {
      .book-cover-section {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      
      .book-actions {
        margin-left: 0;
        width: 200px;
      }
    }
  `;
}