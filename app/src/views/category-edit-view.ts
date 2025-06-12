// app/src/views/category-edit-view.ts
import { View, History } from "@calpoly/mustang";
import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { Category } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";

export class CategoryEditViewElement extends View<Model, Msg> {
  @property({ attribute: "category-id" })
  categoryId?: string;

  @state()
  get category(): Category | undefined {
    return this.model.category;
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
      name === "category-id" &&
      oldValue !== newValue &&
      newValue
    ) {
      this.dispatchMessage([
        "category/select",
        { categoryId: newValue }
      ]);
    }
  }

  loadInitialData() {
    // Load category data if editing existing category
    if (this.categoryId) {
      this.dispatchMessage(["category/select", { categoryId: this.categoryId }]);
    }
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const category = Object.fromEntries(formData.entries()) as any;

    if (this.categoryId) {
      // Updating existing category
      this.dispatchMessage([
        "category/save",
        {
          categoryId: this.categoryId,
          category: category,
          onSuccess: () =>
            History.dispatch(this, "history/navigate", {
              href: `/app/categories/${this.categoryId}`
            }),
          onFailure: (error: Error) =>
            console.log("ERROR:", error)
        }
      ]);
    } else {
      // Creating new category
      this.dispatchMessage([
        "category/create",
        {
          category: category,
          onSuccess: (category: Category) =>
            History.dispatch(this, "history/navigate", {
              href: `/app/categories/${category.id}`
            }),
          onFailure: (error: Error) =>
            console.log("ERROR:", error)
        }
      ]);
    }
  }

  render() {
    const isEditing = !!this.categoryId;
    const title = isEditing ? "Edit Category" : "Add New Category";

    if (this.loading) {
      return html`<div class="loading">Loading...</div>`;
    }

    return html`
      <main>
        <div class="page-header">
          <h2>
            <svg class="icon">
              <use href="/icons/book-categories.svg#icon-category" />
            </svg>
            ${title}
          </h2>
          <nav class="breadcrumb">
            <ul>
              <li><a href="/app">Home</a></li>
              <li><a href="/app/categories">Categories</a></li>
              <li>${title}</li>
            </ul>
          </nav>
        </div>

        <div class="form-container">
          <form @submit=${this.handleSubmit}>
            <div class="form-grid">
              <div class="form-group full-width">
                <label for="name">Category Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  .value=${this.category?.name || ''}
                  placeholder="Enter category name"
                />
              </div>

              <div class="form-group full-width">
                <label for="iconId">Category Image URL</label>
                <input
                  type="url"
                  id="iconId"
                  name="iconId"
                  .value=${this.category?.iconId || ''}
                  placeholder="https://example.com/category-image.jpg"
                />
                <small class="form-help">Enter a URL for an image that represents this category (e.g., book covers, thematic images)</small>
              </div>

              <div class="form-group full-width">
                <label for="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows="4"
                  .value=${this.category?.description || ''}
                  placeholder="Describe this category and what types of books it includes..."
                ></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn primary">
                ${isEditing ? 'Update Category' : 'Add Category'}
              </button>
              <a href="/app/categories" class="btn secondary">
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
            <h3>Tips for Adding Categories</h3>
            <ul>
              <li><strong>Category Name:</strong> Use clear, descriptive names (e.g., "Science Fiction", "Historical Fiction")</li>
              <li><strong>Category Image:</strong> Choose an image that visually represents the category (book covers, thematic imagery, etc.)</li>
              <li><strong>Description:</strong> Explain what types of books belong in this category to help users understand</li>
              <li><strong>Examples:</strong> Consider mentioning example books or authors that would fit in this category</li>
              <li><strong>Image Tips:</strong> Use high-quality images with good contrast, ideally 300x300px or larger</li>
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
      grid-template-columns: 1fr;
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

    .form-help {
      font-size: 0.875rem;
      color: var(--color-text-light);
      margin-top: 0.25rem;
      font-style: italic;
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