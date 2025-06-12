import { View } from "@calpoly/mustang";
import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { Comment, Book } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class CommentViewElement extends View<Model, Msg> {
  @property({ attribute: "book-id" })
  bookId?: string;

  @property({ attribute: "comment-id" })
  commentId?: string;

  @state()
  get comment(): Comment | undefined {
    return this.model.comment;
  }

  @state()
  get book(): Book | undefined {
    return this.model.book;
  }

  @state()
  get comments(): Comment[] {
    return this.model.comments || [];
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
    if (this.bookId && this.commentId) {
      this.loadData();
    }
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
      (name === "book-id" || name === "comment-id") &&
      oldValue !== newValue &&
      newValue
    ) {
      this.loadData();
    }
  }

  loadData() {
    if (this.bookId && this.commentId) {
      this.dispatchMessage(["comment/select", { commentId: this.commentId }]);
      this.dispatchMessage(["book/select", { bookId: this.bookId }]);
      this.dispatchMessage(["comments/load", { bookId: this.bookId }]);
    }
  }

  getOtherComments() {
    return this.comments.filter(c => c.id !== this.commentId).slice(0, 5);
  }

  formatDate(date: Date | string) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  renderStars(rating: number) {
    return Array(5).fill(0).map((_, i) => 
      i < rating ? '★' : '☆'
    ).join('');
  }

  render() {
    if (this.loading) {
      return html`<div class="loading">Loading review...</div>`;
    }

    if (this.error) {
      return html`
        <div class="error">
          <p>Error: ${this.error}</p>
          <button @click=${this.loadData}>Retry</button>
        </div>
      `;
    }

    if (!this.comment) {
      return html`<div class="empty">Review not found</div>`;
    }

    const otherComments = this.getOtherComments();

    return html`
      <main>
        <div class="page-header">
          <h2>Book Review</h2>
          <nav class="breadcrumb">
            <ul>
              <li><a href="/app">Home</a></li>
              <li><a href="/app/books">Books</a></li>
              ${this.book ? html`
                <li><a href="/app/books/${this.bookId}">${this.book.title}</a></li>
              ` : ''}
              <li>Review</li>
            </ul>
          </nav>
        </div>
        
        <div class="content-grid">
          <div class="main-content">
            <article class="content-card review">
              <div class="review-header">
                <h3>My Review</h3>
                <div class="review-meta">
                  <span class="review-date">
                    <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>
                    ${this.formatDate(this.comment.date)}
                  </span>
                  <span class="review-rating">
                    <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    <span class="stars">${this.renderStars(this.comment.rating)}</span>
                    ${this.comment.rating}/5 stars
                  </span>
                </div>
                <div class="review-actions">
                  <a href="/app/books/${this.bookId}/comments/${this.commentId}/edit" class="btn edit">
                    Edit Review
                  </a>
                </div>
              </div>
              
              <div class="review-content">
                <div class="review-text">
                  ${this.comment.content.split('\n').map(paragraph => 
                    html`<p>${paragraph}</p>`
                  )}
                </div>
                
                ${this.comment.favoriteQuote ? html`
                  <blockquote class="favorite-quote">
                    <svg class="quote-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                    </svg>
                    <p>"${this.comment.favoriteQuote}"</p>
                  </blockquote>
                ` : ''}
              </div>
            </article>
          </div>
          
          <aside class="sidebar">
            ${this.book ? html`
              <section class="sidebar-card">
                <h3>Book Information</h3>
                <div class="book-info">
                  <div class="book-cover" style="${this.book.coverUrl ? `background-image: url(${this.book.coverUrl}); background-size: cover; background-position: center;` : ''}"></div>
                  <div class="book-details">
                    <h4><a href="/app/books/${this.bookId}">${this.book.title}</a></h4>
                    <p>by <a href="/app/authors/${this.book.authorId}">${this.book.author}</a></p>
                    <p class="book-meta">${this.book.published} • ${this.book.pages} pages</p>
                  </div>
                </div>
                <div class="book-actions">
                  <a href="/app/books/${this.bookId}" class="btn secondary">View Book Details</a>
                  <a href="/app/books/${this.bookId}/comments/new" class="btn primary">Add Another Review</a>
                </div>
              </section>
            ` : ''}
            
            ${otherComments.length > 0 ? html`
              <section class="sidebar-card">
                <h3>Other Reviews for This Book</h3>
                <ul class="review-list">
                  ${otherComments.map(review => html`
                    <li class="review-item">
                      <a href="/app/books/${this.bookId}/comments/${review.id}">
                        <div class="review-preview">
                          <div class="review-rating-small">
                            ${this.renderStars(review.rating)} ${review.rating}/5
                          </div>
                          <div class="review-excerpt">
                            ${review.content.substring(0, 80)}${review.content.length > 80 ? '...' : ''}
                          </div>
                          <div class="review-date-small">
                            ${this.formatDate(review.date)}
                          </div>
                        </div>
                      </a>
                    </li>
                  `)}
                </ul>
                ${this.comments.length > otherComments.length + 1 ? html`
                  <p class="view-all">
                    <a href="/app/books/${this.bookId}#reviews">View all ${this.comments.length} reviews</a>
                  </p>
                ` : ''}
              </section>
            ` : ''}

            <section class="sidebar-card">
              <h3>Quick Actions</h3>
              <div class="action-list">
                <a href="/app/books/${this.bookId}/comments/${this.commentId}/edit" class="action-item">
                  <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                  Edit This Review
                </a>
                <a href="/app/books/${this.bookId}/comments/new" class="action-item">
                  <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  Add New Review
                </a>
                <a href="/app/books/${this.bookId}" class="action-item">
                  <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  Back to Book
                </a>
              </div>
            </section>
          </aside>
        </div>
      </main>
    `;
  }

  static styles = css`
    main {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header h2 {
      margin-bottom: 1rem;
      color: var(--color-text-primary);
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

    .breadcrumb a:hover {
      text-decoration: underline;
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
      border-radius: 12px;
      margin-bottom: 1.5rem;
      box-shadow: var(--shadow-light);
      border: 1px solid var(--color-border);
    }

    .review-header {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--color-border);
    }

    .review-header h3 {
      margin: 0 0 1rem 0;
      color: var(--color-text-primary);
    }

    .review-meta {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .review-meta span {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: var(--color-text-secondary);
    }

    .icon {
      width: 16px;
      height: 16px;
      opacity: 0.7;
    }

    .review-rating .stars {
      color: #ffd700;
      font-size: 1.1em;
      font-weight: bold;
    }

    .review-actions {
      display: flex;
      gap: 0.5rem;
    }

    .review-content {
      line-height: 1.6;
    }

    .review-text p {
      margin-bottom: 1rem;
      color: var(--color-text-primary);
    }

    .favorite-quote {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-left: 4px solid var(--color-accent);
      padding: 1.5rem;
      margin: 1.5rem 0;
      border-radius: 8px;
      position: relative;
    }

    .quote-icon {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 24px;
      height: 24px;
      opacity: 0.3;
    }

    .favorite-quote p {
      margin: 0;
      font-size: 1.1rem;
      line-height: 1.5;
      font-style: italic;
      color: var(--color-text-primary);
    }

    .sidebar-card h3 {
      margin: 0 0 1rem 0;
      color: var(--color-text-primary);
      font-size: 1.125rem;
    }

    .book-info {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .book-cover {
      width: 60px;
      height: 80px;
      background-color: var(--color-accent-light);
      border-radius: 4px;
      flex-shrink: 0;
    }

    .book-details h4 {
      margin: 0 0 0.5rem 0;
    }

    .book-details a {
      color: var(--color-link);
      text-decoration: none;
    }

    .book-details a:hover {
      text-decoration: underline;
    }

    .book-details p {
      margin: 0 0 0.25rem 0;
      font-size: 0.9rem;
      color: var(--color-text-secondary);
    }

    .book-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      text-decoration: none;
      text-align: center;
      font-weight: 500;
      transition: all 0.2s ease;
      font-size: 0.875rem;
    }

    .btn.primary {
      background-color: var(--color-primary);
      color: white;
      border: 1px solid var(--color-primary);
    }

    .btn.primary:hover {
      background-color: var(--color-primary-hover);
    }

    .btn.secondary {
      background-color: var(--color-background-secondary);
      color: var(--color-text);
      border: 1px solid var(--color-border);
    }

    .btn.secondary:hover {
      background-color: var(--color-border);
    }

    .btn.edit {
      background-color: #28a745;
      color: white;
      border: 1px solid #28a745;
    }

    .btn.edit:hover {
      background-color: #218838;
    }

    .review-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .review-item {
      margin-bottom: 1rem;
    }

    .review-item a {
      display: block;
      text-decoration: none;
      color: inherit;
    }

    .review-preview {
      padding: 1rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .review-preview:hover {
      background-color: var(--color-background-secondary);
      transform: translateY(-1px);
      box-shadow: var(--shadow-light);
    }

    .review-rating-small {
      color: #ffd700;
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
    }

    .review-excerpt {
      font-size: 0.9rem;
      color: var(--color-text-secondary);
      margin-bottom: 0.5rem;
      line-height: 1.4;
    }

    .review-date-small {
      font-size: 0.8rem;
      color: var(--color-text-light);
    }

    .view-all {
      text-align: center;
      margin-top: 1rem;
    }

    .view-all a {
      color: var(--color-link);
      text-decoration: none;
      font-weight: 500;
    }

    .action-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .action-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      text-decoration: none;
      color: var(--color-text);
      transition: all 0.2s ease;
    }

    .action-item:hover {
      background-color: var(--color-background-secondary);
      border-color: var(--color-primary);
    }

    .action-item .icon {
      width: 18px;
      height: 18px;
      color: var(--color-primary);
    }

    .loading, .error, .empty {
      padding: 3rem;
      text-align: center;
      color: var(--color-text-secondary);
    }

    .error {
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

    @media (max-width: 768px) {
      main {
        padding: 1rem;
      }

      .content-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .review-meta {
        font-size: 0.85rem;
      }
      
      .book-info {
        flex-direction: column;
        text-align: center;
        align-items: center;
      }

      .book-actions {
        width: 100%;
      }
    }

    @media (max-width: 480px) {
      .page-header h2 {
        font-size: 1.25rem;
      }
      
      .review-header {
        margin-bottom: 1rem;
        padding-bottom: 0.75rem;
      }

      .favorite-quote {
        padding: 1rem;
        margin: 1rem 0;
      }
    }
  `;
}