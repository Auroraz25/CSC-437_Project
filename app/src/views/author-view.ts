// app/src/views/author-view-mvu.ts
import { View } from "@calpoly/mustang";
import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { Author, Book } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class AuthorViewElement extends View<Model, Msg> {
  @property({ attribute: "author-id" })
  authorId?: string;

  @state()
  get author(): Author | undefined {
    return this.model.author;
  }

  @state()
  get books(): Book[] {
    return this.model.books || [];
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
    if (this.authorId) {
      this.loadAuthorData();
    }
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
      this.dispatchMessage([
        "books/by-author",
        { authorId: newValue }
      ]);
    }
  }

  loadAuthorData() {
    this.dispatchMessage(["author/select", { authorId: this.authorId! }]);
    this.dispatchMessage(["books/by-author", { authorId: this.authorId! }]);
    this.dispatchMessage(["statuses/load", {}]);
  }

  getStatusText(statusId: string) {
    const status = this.statuses.find(s => s.id === statusId);
    return status ? status.name : statusId;
  }

  mapStatusId(statusId: string): string {
    const status = this.statuses.find(s => s.id === statusId);
    return status ? status.type : statusId;
  }

  render() {
    if (this.loading) {
      return html`<div class="loading">Loading author...</div>`;
    }

    if (this.error) {
      return html`<div class="error">Error: ${this.error}</div>`;
    }

    if (!this.author) {
      return html`<div class="empty">Author not found</div>`;
    }

    return html`
      <main>
        <div class="page-header">
          <h2>
            <svg class="icon">
              <use href="/icons/book-categories.svg#icon-author" />
            </svg>
            ${this.author.name}
          </h2>
          <nav class="breadcrumb">
            <ul>
              <li><a href="/app">Home</a></li>
              <li><a href="/app/authors">Authors</a></li>
              <li>${this.author.name}</li>
            </ul>
          </nav>
        </div>
        
        <div class="content-grid">
          <div class="main-content">
            <section class="content-card author-profile">
              <div class="author-header">
                <div class="author-photo" style="${this.author.photoUrl ? `background-image: url(${this.author.photoUrl}); background-size: cover; background-position: center;` : ''}"></div>
                <div class="author-info">
                  <h3>Author Details</h3>
                  <p><strong>Name:</strong> ${this.author.name}</p>
                  <p><strong>Nationality:</strong> ${this.author.nationality}</p>
                  <p><strong>Birth Year:</strong> ${this.author.birthYear}</p>
                  ${this.author.deathYear ? html`
                    <p><strong>Death Year:</strong> ${this.author.deathYear}</p>
                  ` : ''}
                </div>
              </div>
              
              <div class="author-bio">
                <h4>Biography</h4>
                <p>${this.author.bio}</p>
              </div>
            </section>
            
            <section class="content-card">
              <h3>
                <svg class="icon">
                  <use href="/icons/book-categories.svg#icon-book" />
                </svg>
                Books by ${this.author.name}
              </h3>
              <div class="books-list">
                ${this.books.length === 0 ? html`
                  <p>No books found for this author.</p>
                ` : ''}
                ${this.books.map(book => html`
                  <div class="book-card">
                    <div class="book-cover" style="${book.coverUrl ? `background-image: url(${book.coverUrl}); background-size: cover; background-position: center;` : ''}"></div>
                    <div class="book-details">
                      <h4><a href="/app/books/${book.id}">${book.title}</a></h4>
                      <p class="book-meta">${book.published} • ${book.pages} pages</p>
                      <p class="book-status status-${this.mapStatusId(book.statusId)}">
                        ${this.getStatusText(book.statusId)}
                      </p>
                    </div>
                  </div>
                `)}
              </div>
            </section>
          </div>
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
      margin-top: 2rem;
    }

    .content-card {
      background-color: var(--color-background-card);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: var(--shadow-light);
    }

    .author-header {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .author-photo {
      width: 100px;
      height: 120px;
      background-color: var(--color-accent-light);
      border-radius: 4px;
      flex-shrink: 0;
    }

    .author-info h3 {
      margin-bottom: 1rem;
    }

    .author-info p {
      margin-bottom: 0.5rem;
    }

    .author-bio h4 {
      margin-bottom: 1rem;
    }

    .author-bio p {
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .content-card h3 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .books-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .book-card {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .book-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-medium, 0 4px 8px rgba(0,0,0,0.15));
    }

    .book-cover {
      width: 60px;
      height: 80px;
      background-color: var(--color-accent-light);
      border-radius: 4px;
      flex-shrink: 0;
    }

    .book-details {
      flex: 1;
    }

    .book-details h4 {
      margin-bottom: 0.5rem;
    }

    .book-details a {
      color: var(--color-link);
      text-decoration: none;
    }

    .book-details a:hover {
      text-decoration: underline;
    }

    .book-meta {
      margin-bottom: 0.5rem;
      color: var(--color-text-light);
      font-size: 0.9rem;
    }

    .book-status {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      display: inline-block;
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
      
      .author-header {
        flex-direction: column;
        text-align: center;
        align-items: center;
      }
      
      .books-list {
        grid-template-columns: 1fr;
      }
      
      .book-card {
        flex-direction: column;
        text-align: center;
      }
      
      .book-cover {
        align-self: center;
      }
    }
  `;
}