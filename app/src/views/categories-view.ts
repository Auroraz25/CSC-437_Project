// app/src/views/categories-view.ts
import { View } from "@calpoly/mustang";
import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { Category } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class CategoriesViewElement extends View<Model, Msg> {
  @state()
  get categories(): Category[] {
    return this.model.categories || [];
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
    this.loadCategories();
  }

  loadCategories() {
    this.dispatchMessage(["categories/load", {}]);
  }

  render() {
    if (this.loading) {
      return html`<div class="loading">Loading categories...</div>`;
    }

    if (this.error) {
      return html`<div class="error">Error: ${this.error}</div>`;
    }

    return html`
      <main>
        <div class="page-header">
          <h2>
            <svg class="icon">
              <use href="/icons/book-categories.svg#icon-category" />
            </svg>
            All Categories
          </h2>
          <nav class="breadcrumb">
            <ul>
              <li><a href="/app">Home</a></li>
              <li>Categories</li>
            </ul>
          </nav>
        </div>

        <div class="actions-bar">
          <a href="/app/categories/new" class="btn primary">
            <svg class="icon">
              <use href="/icons/book-categories.svg#icon-add" />
            </svg>
            Add New Category
          </a>
        </div>

        <div class="categories-grid">
          ${this.categories.length === 0 ? html`
            <div class="no-results">
              <p>No categories found.</p>
              <a href="/app/categories/new" class="btn primary">Add Your First Category</a>
            </div>
          ` : ''}
          
          ${this.categories.map(category => html`
            <div class="category-card">
              <a href="/app/categories/${category.id}" class="category-link">
                <div class="category-image" style="${category.iconId ? `background-image: url(${category.iconId}); background-size: cover; background-position: center;` : ''}">
                  ${!category.iconId ? html`
                    <svg class="placeholder-icon">
                      <use href="/icons/book-categories.svg#icon-category" />
                    </svg>
                  ` : ''}
                </div>
                <div class="category-info">
                  <h3 class="category-name">${category.name}</h3>
                  <p class="category-description">${this.truncateDescription(category.description)}</p>
                </div>
              </a>
              <div class="category-actions">
                <a href="/app/categories/${category.id}/edit" class="btn-small secondary">Edit</a>
                <a href="/app/categories/${category.id}" class="btn-small primary">View</a>
              </div>
            </div>
          `)}
        </div>
      </main>
    `;
  }

  truncateDescription(description: string, maxLength: number = 120): string {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength).trim() + '...';
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

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .category-card {
      background-color: var(--color-background-card);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--shadow-light);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .category-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-medium, 0 4px 8px rgba(0,0,0,0.15));
    }

    .category-link {
      display: block;
      text-decoration: none;
      color: inherit;
      padding: 1.5rem;
      padding-bottom: 1rem;
    }

    .category-image {
      width: 100%;
      height: 150px;
      background-color: var(--color-accent-light, #e3f2fd);
      border-radius: 8px;
      margin-bottom: 1rem;
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
      width: 60px;
      height: 60px;
      color: var(--color-accent, #007bff);
      opacity: 0.6;
    }

    .category-info {
      text-align: center;
    }

    .category-name {
      margin: 0 0 0.75rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-text);
      line-height: 1.3;
    }

    .category-description {
      margin: 0;
      color: var(--color-text-light);
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .category-actions {
      display: flex;
      gap: 0.5rem;
      padding: 0 1.5rem 1.5rem;
      justify-content: center;
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
      
      .categories-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .category-link {
        padding: 1rem;
        padding-bottom: 0.5rem;
      }
      
      .category-actions {
        padding: 0 1rem 1rem;
      }
    }
  `;
}