// app/src/views/author-edit-view.ts
import { View, History } from "@calpoly/mustang";
import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { Author } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class AuthorEditViewElement extends View<Model, Msg> {
  @property({ attribute: "author-id" })
  authorId?: string;

  @state()
  get author(): Author | undefined {
    return this.model.author;
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
      name === "author-id" &&
      oldValue !== newValue &&
      newValue
    ) {
      this.dispatchMessage([
        "author/select",
        { authorId: newValue }
      ]);
    }
  }

  loadInitialData() {
    // Load author data if editing existing author
    if (this.authorId) {
      this.dispatchMessage(["author/select", { authorId: this.authorId }]);
    }
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const author = Object.fromEntries(formData.entries()) as any;

    // Convert string inputs to numbers where needed
    author.birthYear = parseInt(author.birthYear) || 0;
    if (author.deathYear) {
      author.deathYear = parseInt(author.deathYear);
    } else {
      delete author.deathYear;
    }

    if (this.authorId) {
      // Updating existing author
      this.dispatchMessage([
        "author/save",
        {
          authorId: this.authorId,
          author: author,
          onSuccess: () =>
            History.dispatch(this, "history/navigate", {
              href: `/app/authors/${this.authorId}`
            }),
          onFailure: (error: Error) =>
            console.log("ERROR:", error)
        }
      ]);
    } else {
      // Creating new author
      this.dispatchMessage([
        "author/create",
        {
          author: author,
          onSuccess: (author: Author) =>
            History.dispatch(this, "history/navigate", {
              href: `/app/authors/${author.id}`
            }),
          onFailure: (error: Error) =>
            console.log("ERROR:", error)
        }
      ]);
    }
  }

  render() {
    const isEditing = !!this.authorId;
    const title = isEditing ? "Edit Author" : "Add New Author";

    if (this.loading) {
      return html`<div class="loading">Loading...</div>`;
    }

    return html`
      <main>
        <div class="page-header">
          <h2>
            <svg class="icon">
              <use href="/icons/book-categories.svg#icon-author" />
            </svg>
            ${title}
          </h2>
          <nav class="breadcrumb">
            <ul>
              <li><a href="/app">Home</a></li>
              <li><a href="/app/authors">Authors</a></li>
              <li>${title}</li>
            </ul>
          </nav>
        </div>

        <div class="form-container">
          <form @submit=${this.handleSubmit}>
            <div class="form-grid">
              <div class="form-group full-width">
                <label for="name">Author Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  .value=${this.author?.name || ''}
                  placeholder="Enter author's full name"
                />
              </div>

              <div class="form-group">
                <label for="nationality">Nationality</label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  .value=${this.author?.nationality || ''}
                  placeholder="e.g., American, British, French"
                />
              </div>

              <div class="form-group">
                <label for="birthYear">Birth Year *</label>
                <input
                  type="number"
                  id="birthYear"
                  name="birthYear"
                  required
                  min="1000"
                  max="2100"
                  .value=${this.author?.birthYear || ''}
                  placeholder="1920"
                />
              </div>

              <div class="form-group">
                <label for="deathYear">Death Year</label>
                <input
                  type="number"
                  id="deathYear"
                  name="deathYear"
                  min="1000"
                  max="2100"
                  .value=${this.author?.deathYear || ''}
                  placeholder="Leave empty if still alive"
                />
              </div>

              <div class="form-group full-width">
                <label for="photoUrl">Photo URL</label>
                <input
                  type="url"
                  id="photoUrl"
                  name="photoUrl"
                  .value=${this.author?.photoUrl || ''}
                  placeholder="https://example.com/author-photo.jpg"
                />
              </div>

              <div class="form-group full-width">
                <label for="bio">Biography *</label>
                <textarea
                  id="bio"
                  name="bio"
                  required
                  rows="6"
                  .value=${this.author?.bio || ''}
                  placeholder="Write a brief biography of the author..."
                ></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn primary">
                ${isEditing ? 'Update Author' : 'Add Author'}
              </button>
              <a href="/app/authors" class="btn secondary">
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

        <div class="help-section">
          <div class="help-card">
            <h3>Tips for Adding Authors</h3>
            <ul>
              <li><strong>Author Name:</strong> Use the full name as commonly known (e.g., "Mark Twain" rather than "Samuel Clemens")</li>
              <li><strong>Nationality:</strong> Use the country or cultural identity the author is primarily associated with</li>
              <li><strong>Birth/Death Years:</strong> Use the actual calendar year (e.g., 1835, 1910)</li>
              <li><strong>Biography:</strong> Include key achievements, notable works, and interesting facts about the author</li>
              <li><strong>Photo URL:</strong> Use a publicly accessible image URL that shows the author clearly</li>
            </ul>
          </div>
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
    .form-group textarea {
      padding: 0.75rem;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.25);
    }

    .form-group textarea {
      resize: vertical;
      min-height: 120px;
      line-height: 1.6;
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

    .help-section {
      margin-top: 2rem;
    }

    .help-card {
      background-color: var(--color-background-secondary, #f8f9fa);
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid var(--color-accent, #3498db);
    }

    .help-card h3 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: var(--color-text);
    }

    .help-card ul {
      margin: 0;
      padding-left: 1.5rem;
    }

    .help-card li {
      margin-bottom: 0.75rem;
      line-height: 1.5;
    }

    .help-card strong {
      color: var(--color-accent, #3498db);
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

      .help-card {
        padding: 1rem;
      }

      .help-card li {
        margin-bottom: 0.5rem;
      }
    }
  `;
}