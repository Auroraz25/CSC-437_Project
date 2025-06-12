import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";

export class MiniBookElement extends LitElement {
  @property()
  href: string = "#";
  
  @property()
  author: string = "";
  
  @property({ attribute: 'book-status' })
  bookStatus?: 'read' | 'reading' | 'to-read';
  
  @property({ type: Boolean, attribute: 'show-status' })
  showStatus = false;
  
  @property()
  coverUrl?: string;
  
  @property({ type: Boolean })
  darkMode = false;
  
  constructor() {
    super();
    this.darkMode = document.body.classList.contains('dark-mode');
    this.listenForDarkModeChanges();
  }
  
  listenForDarkModeChanges() {
    document.addEventListener('darkModeChanged', ((e: CustomEvent) => {
      this.darkMode = e.detail.isDarkMode;
      this.requestUpdate();
    }) as EventListener);
  }

  render() {
    return html`
      <div class="mini-book-card ${this.darkMode ? 'dark-mode' : ''}">
        <div class="mini-book-cover" style="${this.coverUrl ? `background-image: url(${this.coverUrl}); background-size: cover; background-position: center;` : ''}"></div>
        <div class="mini-book-info">
          <h5><a href="${this.href}"><slot>Book Title</slot></a></h5>
          <p class="book-author">${this.author}</p>
        </div>
        ${this.showStatus && this.bookStatus ? html`
          <p class="book-status ${this.bookStatus}">${this.getStatusText()}</p>
        ` : ''}
      </div>
    `;
  }

  getStatusText() {
    switch(this.bookStatus) {
      case 'read': return 'Read';
      case 'reading': return 'Currently Reading';
      case 'to-read': return 'To Be Read';
      default: return '';
    }
  }

  static styles = css`
    :host {
      display: block;
      font-family: 'Source Sans 3', 'Segoe UI', sans-serif;
    }
    
    .mini-book-card {
      display: flex;
      flex-direction: column;
      padding: var(--spacing-md, 1rem);
      background-color: var(--color-background-card, white);
      border-radius: var(--border-radius-md, 0.5rem);
      box-shadow: var(--shadow-light, 0 2px 4px rgba(0,0,0,0.1));
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      height: 100%;
    }
    
    .mini-book-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-medium, 0 4px 8px rgba(0,0,0,0.15));
    }
    
    .mini-book-cover {
      height: 200px;
      background-color: var(--color-accent-light, #a3cceb);
      margin-bottom: var(--spacing-sm, 0.5rem);
      border-radius: var(--border-radius-sm, 0.25rem);
    }
    
    .mini-book-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    h5 {
      margin: 0 0 var(--spacing-xs, 0.25rem) 0;
      font-size: var(--font-size-medium, 1.125rem);
      font-weight: var(--font-weight-semibold, 600);
    }
    
    p {
      margin: 0;
      font-size: var(--font-size-small, 0.875rem);
      color: var(--color-text-light, #666);
    }
    
    a {
      color: var(--color-accent, #3498db);
      text-decoration: none;
    }
    
    a:hover {
      color: var(--color-accent-dark, #2980b9);
      text-decoration: underline;
    }
    
    .book-status {
      margin-top: auto;
      padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
      border-radius: var(--border-radius-sm, 0.25rem);
      font-size: var(--font-size-small, 0.875rem);
      text-align: center;
    }
    
    .read {
      background-color: #e8f5e9;
      color: #2e7d32;
    }
    
    .reading {
      background-color: #fff8e1;
      color: #f57f17;
    }
    
    .to-read {
      background-color: #e3f2fd;
      color: #1565c0;
    }
    
    .dark-mode {
      background-color: #2c2c2c;
      color: #e0e0e0;
      border-color: #444;
    }
    
    .dark-mode p {
      color: #b0b0b0;
    }
    
    .dark-mode a {
      color: #5dade2;
    }
    
    .dark-mode a:hover {
      color: #7fc4f0;
    }
    
    .dark-mode .read {
      background-color: rgba(46, 125, 50, 0.2);
      color: #81c784;
    }
    
    .dark-mode .reading {
      background-color: rgba(245, 127, 23, 0.2);
      color: #ffb74d;
    }
    
    .dark-mode .to-read {
      background-color: rgba(21, 101, 192, 0.2);
      color: #64b5f6;
    }
  `;
}

customElements.define('mini-book-element', MiniBookElement);