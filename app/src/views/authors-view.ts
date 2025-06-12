// app/src/views/authors-view.ts
import { View } from "@calpoly/mustang";
import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { Author } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class AuthorsViewElement extends View<Model, Msg> {
  @state()
  get authors(): Author[] {
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
    this.loadAuthors();
  }

  loadAuthors() {
    this.dispatchMessage(["authors/load", {}]);
  }

  render() {
    if (this.loading) {
      return html`<div class="loading">Loading authors...</div>`;
    }

    if (this.error) {
      return html`<div class="error">Error: ${this.error}</div>`;
    }

    return html`
      <main>
        <div class="page-header">
          <h2>
            <svg class="icon">
              <use href="/icons/book-categories.svg#icon-author" />
            </svg>
            All Authors
          </h2>
          <nav class="breadcrumb">
            <ul>
              <li><a href="/app">Home</a></li>
              <li>Authors</li>
            </ul>
          </nav>
        </div>

        <div class="actions-bar">
          <a href="/app/authors/new" class="btn primary">
            <svg class="icon">
              <use href="/icons/book-categories.svg#icon-add" />
            </svg>
            Add New Author
          </a>
        </div>

        <div class="authors-grid">
          ${this.authors.length === 0 ? html`
            <div class="no-results">
              <p>No authors found.</p>
              <a href="/app/authors/new" class="btn primary">Add Your First Author</a>
            </div>
          ` : ''}
          
          ${this.authors.map(author => html`
            <div class="author-card">
              <a href="/app/authors/${author.id}" class="author-link">
                <div class="author-photo" style="${author.photoUrl ? `background-image: url(${author.photoUrl}); background-size: cover; background-position: center;` : ''}"></div>
                <div class="author-info">
                  <h3 class="author-name">${author.name}</h3>
                  <p class="author-nationality">${author.nationality}</p>
                  <p class="author-years">
                    ${author.birthYear}${author.deathYear ? ` - ${author.deathYear}` : ' - Present'}
                  </p>
                  <p class="author-bio">${this.truncateBio(author.bio)}</p>
                </div>
              </a>
              <div class="author-actions">
                <a href="/app/authors/${author.id}/edit" class="btn-small secondary">Edit</a>
                <a href="/app/authors/${author.id}" class="btn-small primary">View</a>
              </div>
            </div>
          `)}
        </div>
      </main>
    `;
  }

  truncateBio(bio: string, maxLength: number = 120): string {
    if (bio.length <= maxLength) return bio;
    return bio.substring(0, maxLength).trim() + '...';
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

    .actions-bar {
      display: flex;
      justify-content: flex-end;
      margin: 2rem 0;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      text-decoration: none;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn.primary {
      background-color: var(--color-primary, #007bff);
      color: white;
    }

    .btn.primary:hover {
      background-color: var(--color-primary-hover, #0056b3);
    }

    .btn-small {
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .btn-small.primary {
      background-color: var(--color-primary, #007bff);
      color: white;
    }

    .btn-small.secondary {
      background-color: var(--color-secondary, #6c757d);
      color: white;
    }

    .btn-small:hover {
      opacity: 0.9;
    }

    .authors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .author-card {
      background-color: var(--color-background-card);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--shadow-light);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .author-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-medium, 0 4px 8px rgba(0,0,0,0.15));
    }

    .author-link {
      display: block;
      text-decoration: none;
      color: inherit;
    }

    .author-photo {
      width: 100%;
      height: 200px;
      background-color: var(--color-accent-light);
      background-size: cover;
      background-position: center;
    }

    .author-info {
      padding: 1.5rem;
      padding-bottom: 1rem;
    }

    .author-name {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-text);
      line-height: 1.3;
    }

    .author-nationality {
      margin: 0 0 0.25rem 0;
      color: var(--color-accent);
      font-weight: 500;
      font-size: 0.9rem;
    }

    .author-years {
      margin: 0 0 0.75rem 0;
      color: var(--color-text-light);
      font-size: 0.9rem;
    }

    .author-bio {
      margin: 0;
      color: var(--color-text-light);
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .author-actions {
      display: flex;
      gap: 0.5rem;
      padding: 0 1.5rem 1.5rem;
      justify-content: flex-end;
    }

    .no-results {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
      color: var(--color-text-light);
    }

    .no-results p {
      margin-bottom: 1.5rem;
      font-size: 1.125rem;
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
      
      .actions-bar {
        justify-content: center;
      }
      
      .authors-grid {
        grid-template-columns: 1fr;
      }
      
      .author-actions {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .author-info {
        padding: 1rem;
        padding-bottom: 0.5rem;
      }
      
      .author-actions {
        padding: 0 1rem 1rem;
      }
    }
  `;
}