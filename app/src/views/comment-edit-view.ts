import { View, History } from "@calpoly/mustang";
import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { Comment, Book } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class CommentEditViewElement extends View<Model, Msg> {
  @property({ attribute: "book-id" })
  bookId?: string;

  @property({ attribute: "comment-id" })
  commentId?: string;

  @state()
  currentRating = 0;

  @state()
  get comment(): Comment | undefined {
    return this.model.comment;
  }

  @state()
  get book(): Book | undefined {
    return this.model.book;
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

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "comment-id" && oldValue !== newValue && newValue) {
      this.dispatchMessage(["comment/select", { commentId: newValue }]);
    }
    if (name === "book-id" && oldValue !== newValue && newValue) {
      this.dispatchMessage(["book/select", { bookId: newValue }]);
    }
  }

  loadInitialData() {
    if (this.bookId) {
      this.dispatchMessage(["book/select", { bookId: this.bookId }]);
    }
    if (this.commentId) {
      this.dispatchMessage(["comment/select", { commentId: this.commentId }]);
    }
  }

  updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);
    if (changedProperties.has('comment') && this.comment) {
      this.currentRating = this.comment.rating || 0;
    }
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const commentData = {
      rating: parseInt(formData.get('rating') as string),
      content: formData.get('content') as string,
      favoriteQuote: formData.get('favoriteQuote') as string || undefined,
      bookId: this.bookId!,
      date: this.commentId ? this.comment!.date : new Date(),
      userId: "current-user-id"
    };

    if (!this.commentId) {
      commentData.id = `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    if (this.commentId) {
      this.dispatchMessage([
        "comment/save",
        {
          commentId: this.commentId,
          comment: { ...commentData, id: this.commentId },
          onSuccess: () =>
            History.dispatch(this, "history/navigate", {
              href: `/app/books/${this.bookId}`
            }),
          onFailure: (error: Error) =>
            console.log("ERROR:", error)
        }
      ]);
    } else {
      this.dispatchMessage([
        "comment/create",
        {
          comment: commentData,
          onSuccess: () =>
            History.dispatch(this, "history/navigate", {
              href: `/app/books/${this.bookId}`
            }),
          onFailure: (error: Error) =>
            console.log("ERROR:", error)
        }
      ]);
    }
  }

  setRating(rating: number) {
    this.currentRating = rating;
    const ratingInput = this.shadowRoot?.querySelector('#rating') as HTMLInputElement;
    if (ratingInput) {
      ratingInput.value = rating.toString();
    }
  }

  renderStars() {
    return Array(5).fill(0).map((_, i) => 
      html`<span 
        class="star ${i < this.currentRating ? 'filled' : ''}" 
        @click=${() => this.setRating(i + 1)}
        @mouseover=${() => this.highlightStars(i + 1)}
        @mouseout=${() => this.highlightStars(0)}
      >★</span>`
    );
  }

  highlightStars(rating: number) {
    const stars = this.shadowRoot?.querySelectorAll('.star');
    stars?.forEach((star, index) => {
      if (rating === 0) {
        star.classList.toggle('highlight', false);
      } else {
        star.classList.toggle('highlight', index < rating);
      }
    });
  }

  render() {
    const isEditing = !!this.commentId;
    const title = isEditing ? "Edit Review" : "Add Review";

    if (this.loading) {
      return html`<div class="loading">Loading...</div>`;
    }

    return html`
      <main>
        <div class="page-header">
          <h2>${title}</h2>
          <nav class="breadcrumb">
            <ul>
              <li><a href="/app">Home</a></li>
              <li><a href="/app/books">Books</a></li>
              ${this.book ? html`
                <li><a href="/app/books/${this.bookId}">${this.book.title}</a></li>
              ` : ''}
              <li>${title}</li>
            </ul>
          </nav>
        </div>

        ${this.book ? html`
          <div class="book-info">
            <div class="book-cover" style="${this.book.coverUrl ? `background-image: url(${this.book.coverUrl}); background-size: cover; background-position: center;` : ''}"></div>
            <div class="book-details">
              <h3>${this.book.title}</h3>
              <p>by ${this.book.author}</p>
            </div>
          </div>
        ` : ''}

        <div class="form-container">
          <form @submit=${this.handleSubmit}>
            <div class="form-group">
              <label for="rating">Rating *</label>
              <div class="rating-input">
                <input
                  type="hidden"
                  id="rating"
                  name="rating"
                  .value=${this.currentRating.toString()}
                  required
                />
                <div class="stars">
                  ${this.renderStars()}
                </div>
                <span class="rating-text">${this.currentRating}/5 stars</span>
              </div>
            </div>

            <div class="form-group">
              <label for="content">Review *</label>
              <textarea
                id="content"
                name="content"
                required
                rows="6"
                .value=${this.comment?.content || ''}
                placeholder="Write your review here..."
              ></textarea>
            </div>

            <div class="form-group">
              <label for="favoriteQuote">Favorite Quote</label>
              <textarea
                id="favoriteQuote"
                name="favoriteQuote"
                rows="3"
                .value=${this.comment?.favoriteQuote || ''}
                placeholder="Share a favorite quote from the book (optional)"
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn primary">
                ${isEditing ? 'Update Review' : 'Add Review'}
              </button>
              <a href="/app/books/${this.bookId}" class="btn secondary">
                Cancel
              </a>
            </div>
          </form>

          ${this.error ? html`
            <div class="error-message">
              <p>Error: ${this.error}</p>
              <button @click=${() => this.dispatchMessage(["error/clear", {}])}>
                Dismiss
              </button>
            </div>
          ` : ''}
        </div>
      </main>
    `;
  }

  static styles = css`
    main {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
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

    .book-info {
      display: flex;
      gap: 1rem;
      background-color: var(--color-background-card);
      padding: 1.5rem;
      border-radius: 8px;
      margin: 2rem 0;
      box-shadow: var(--shadow-light);
    }

    .book-cover {
      width: 80px;
      height: 120px;
      background-color: var(--color-accent-light);
      border-radius: 4px;
      flex-shrink: 0;
    }

    .book-details h3 {
      margin-bottom: 0.5rem;
    }

    .book-details p {
      color: var(--color-text-light);
      margin: 0;
    }

    .form-container {
      background-color: var(--color-background-card);
      padding: 2rem;
      border-radius: 8px;
      box-shadow: var(--shadow-light);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: var(--color-text);
    }

    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
      resize: vertical;
      box-sizing: border-box;
    }

    .form-group textarea:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.25);
    }

    .rating-input {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stars {
      display: flex;
      gap: 0.25rem;
    }

    .star {
      font-size: 1.5rem;
      color: #ddd;
      cursor: pointer;
      transition: color 0.2s;
      user-select: none;
    }

    .star.filled,
    .star.highlight {
      color: #ffd700;
    }

    .star:hover {
      color: #ffd700;
    }

    .rating-text {
      font-size: 0.9rem;
      color: var(--color-text-light);
      min-width: 80px;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid var(--color-border);
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      text-decoration: none;
      cursor: pointer;
      display: inline-block;
      text-align: center;
      transition: background-color 0.2s;
      font-family: inherit;
    }

    .btn.primary {
      background-color: var(--color-primary, #007bff);
      color: white;
    }

    .btn.primary:hover {
      background-color: var(--color-primary-hover, #0056b3);
    }

    .btn.secondary {
      background-color: var(--color-secondary, #6c757d);
      color: white;
    }

    .btn.secondary:hover {
      background-color: #5a6268;
    }

    .error-message {
      background-color: #ffebee;
      border: 1px solid #f44336;
      color: #d32f2f;
      padding: 1rem;
      border-radius: 4px;
      margin-top: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .error-message button {
      background: none;
      border: 1px solid currentColor;
      color: inherit;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      cursor: pointer;
    }

    .loading {
      padding: 2rem;
      text-align: center;
    }

    @media (max-width: 768px) {
      main {
        padding: 1rem;
      }
      
      .book-info {
        flex-direction: column;
        text-align: center;
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .rating-input {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }
  `;
}