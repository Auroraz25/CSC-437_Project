import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

interface AuthorComment {
  id: string;
  title: string;
  content: string[];
  features: string[];
  author: {
    id: string;
    name: string;
    description: string;
  };
  relatedBooks: Array<{
    id: string;
    title: string;
  }>;
}

export class AuthorCommentViewElement extends LitElement {
  @property({ attribute: "author-id" })
  authorId?: string;

  @property({ attribute: "comment-id" })
  commentId?: string;

  @state()
  comment?: AuthorComment;

  @state()
  loading = false;

  @state()
  error?: string;

  connectedCallback() {
    super.connectedCallback();
    if (this.authorId && this.commentId) {
      this.loadCommentData();
    }
  }

  async loadCommentData() {
    this.loading = true;
    this.error = undefined;
    
    try {
      const response = await fetch(`/api/authors/${this.authorId}/comments/${this.commentId}`);
      if (!response.ok) throw new Error('Failed to load comment');
      this.comment = await response.json();
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) {
      return html`<div class="loading">Loading comment...</div>`;
    }

    if (this.error) {
      return html`<div class="error">Error: ${this.error}</div>`;
    }

    if (!this.comment) {
      return html`<div class="empty">Comment not found</div>`;
    }

    return html`
      <main>
        <div class="page-header">
          <h2>${this.comment.title}</h2>
          <nav class="breadcrumb">
            <ul>
              <li><a href="/app">Home</a></li>
              <li><a href="/app/authors/${this.authorId}">${this.comment.author.name}</a></li>
              <li>Author Notes</li>
            </ul>
          </nav>
        </div>
        
        <div class="content-grid">
          <div class="main-content">
            <article class="content-card">
              <h3>Writing Style Observations</h3>
              <div class="note-content">
                ${this.comment.content.map(paragraph => html`<p>${paragraph}</p>`)}
                
                <div class="literary-features">
                  <h4>Key Elements of ${this.comment.author.name}'s Style</h4>
                  <ul>
                    ${this.comment.features.map(feature => html`<li>${feature}</li>`)}
                  </ul>
                </div>
              </div>
            </article>
          </div>
          
          <aside class="sidebar">
            <section class="sidebar-card">
              <h3>Author Information</h3>
              <div class="mini-author-card">
                <div class="mini-author-photo"></div>
                <div class="mini-author-info">
                  <h4><a href="/app/authors/${this.authorId}">${this.comment.author.name}</a></h4>
                  <p>${this.comment.author.description}</p>
                </div>
              </div>
              <ul class="author-actions">
                <li><a href="/app/authors/${this.authorId}" class="btn secondary">View Author Profile</a></li>
              </ul>
            </section>
            
            <section class="sidebar-card">
              <h3>Related Books</h3>
              <ul class="book-list-small">
                ${this.comment.relatedBooks.map(book => html`
                  <li><a href="/app/books/${book.id}">${book.title}</a></li>
                `)}
              </ul>
            </section>
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

    .note-content p {
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .literary-features {
      margin-top: 2rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    .literary-features h4 {
      margin-bottom: 1rem;
    }

    .literary-features ul {
      list-style: disc;
      padding-left: 1.5rem;
    }

    .literary-features li {
      margin-bottom: 0.5rem;
    }

    .mini-author-card {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .mini-author-photo {
      width: 60px;
      height: 75px;
      background-color: var(--color-accent-light);
      border-radius: 4px;
      flex-shrink: 0;
    }

    .mini-author-info h4 {
      margin-bottom: 0.5rem;
    }

    .mini-author-info a {
      color: var(--color-link);
      text-decoration: none;
    }

    .author-actions {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .btn {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      text-decoration: none;
      border: 1px solid;
    }

    .btn.secondary {
      background-color: var(--color-background-secondary, #f8f9fa);
      color: var(--color-text);
      border-color: var(--color-border);
    }

    .book-list-small {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .book-list-small li {
      margin-bottom: 0.5rem;
    }

    .book-list-small a {
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

    @media (max-width: 768px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
}