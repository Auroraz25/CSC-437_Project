import { View, History } from "@calpoly/mustang";
import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { Book } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class BookEditViewElement extends View<Model, Msg> {
  @property({ attribute: "book-id" })
  bookId?: string;

  @state()
  get book(): Book | undefined {
    return this.model.book;
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
  get authors() {
    return this.model.authors || [];
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
    if (
      name === "book-id" &&
      oldValue !== newValue &&
      newValue
    ) {
      this.dispatchMessage([
        "book/select",
        { bookId: newValue }
      ]);
    }
  }

  loadInitialData() {
    if (this.bookId) {
      this.dispatchMessage(["book/select", { bookId: this.bookId }]);
    }
    
    this.dispatchMessage(["categories/load", {}]);
    this.dispatchMessage(["statuses/load", {}]);
    this.dispatchMessage(["authors/load", {}]);
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const book = Object.fromEntries(formData.entries()) as any;

    book.published = parseInt(book.published);
    book.pages = parseInt(book.pages);

    if (this.bookId) {
      this.dispatchMessage([
        "book/save",
        {
          bookId: this.bookId,
          book: book,
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
        "book/create",
        {
          book: book,
          onSuccess: (book: Book) =>
            History.dispatch(this, "history/navigate", {
              href: `/app/books/${book.id}`
            }),
          onFailure: (error: Error) =>
            console.log("ERROR:", error)
        }
      ]);
    }
  }

  render() {
    const isEditing = !!this.bookId;
    const title = isEditing ? "Edit Book" : "Add New Book";

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
              <li>${title}</li>
            </ul>
          </nav>
        </div>

        <div class="form-container">
          <form @submit=${this.handleSubmit}>
            <div class="form-grid">
              <div class="form-group">
                <label for="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  .value=${this.book?.title || ''}
                  placeholder="Enter book title"
                />
              </div>


              <div class="form-group">
                <label for="authorId">Author (Select existing)</label>
                <select id="authorId" name="authorId" .value=${this.book?.authorId || ''}>
                  <option value="">Select an author</option>
                  ${this.authors.map(author => html`
                    <option value="${author.id}" ?selected=${this.book?.authorId === author.id}>${author.name}</option>
                  `)}
                </select>
              </div>

              <div class="form-group">
                <label for="isbn">ISBN</label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  .value=${this.book?.isbn || ''}
                  placeholder="Enter ISBN"
                />
              </div>

              <div class="form-group">
                <label for="published">Publication Year *</label>
                <input
                  type="number"
                  id="published"
                  name="published"
                  required
                  min="1000"
                  max="2100"
                  .value=${this.book?.published || ''}
                  placeholder="2024"
                />
              </div>

              <div class="form-group">
                <label for="pages">Pages *</label>
                <input
                  type="number"
                  id="pages"
                  name="pages"
                  required
                  min="1"
                  .value=${this.book?.pages || ''}
                  placeholder="Enter page count"
                />
              </div>

              <div class="form-group">
                <label for="categoryId">Category *</label>
                <select id="categoryId" name="categoryId" required .value=${this.book?.categoryId || ''}>
                  <option value="">Select a category</option>
                  ${this.categories.map(category => html`
                    <option value="${category.id}" ?selected=${this.book?.categoryId === category.id}>${category.name}</option>
                  `)}
                </select>
              </div>

              <div class="form-group">
                <label for="statusId">Reading Status *</label>
                <select id="statusId" name="statusId" required .value=${this.book?.statusId || ''}>
                  <option value="">Select status</option>
                  ${this.statuses.map(status => html`
                    <option value="${status.id}" ?selected=${this.book?.statusId === status.id}>${status.name}</option>
                  `)}
                </select>
              </div>

              <div class="form-group full-width">
                <label for="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  .value=${this.book?.description || ''}
                  placeholder="Enter book description"
                ></textarea>
              </div>

              <div class="form-group full-width">
                <label for="coverUrl">Cover Image URL</label>
                <input
                  type="url"
                  id="coverUrl"
                  name="coverUrl"
                  .value=${this.book?.coverUrl || ''}
                  placeholder="https://example.com/cover.jpg"
                />
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn primary">
                ${isEditing ? 'Update Book' : 'Add Book'}
              </button>
              <a href="/app/books" class="btn secondary">Cancel</a>
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

    .form-container {
      background-color: var(--color-background-card);
      padding: 2rem;
      border-radius: 8px;
      box-shadow: var(--shadow-light);
      margin-top: 2rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group label {
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: var(--color-text);
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.25);
    }

    .form-group textarea {
      resize: vertical;
      min-height: 100px;
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
      
      .form-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `;
}