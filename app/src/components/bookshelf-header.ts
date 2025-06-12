// src/components/bookshelf-header.ts
import { LitElement, css, html } from "lit";
import { state } from "lit/decorators.js";

export class BookshelfHeaderElement extends LitElement {
  @state()
  menuOpen = false;

  @state()
  darkMode = false;

  connectedCallback() {
    super.connectedCallback();
    
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    this.darkMode = savedDarkMode;
    
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    localStorage.setItem('darkMode', this.darkMode.toString());
    
    // Dispatch event for other components
    document.dispatchEvent(new CustomEvent('darkModeChanged', {
      detail: { isDarkMode: this.darkMode }
    }));
  }

  render() {
    return html`
      <header class="main-header">
        <div class="header-container">
          <!-- Logo and title -->
          <div class="logo-section">
            <a href="/app" class="logo-link">
              <svg class="logo-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
              </svg>
              <h1>My Book Collection</h1>
            </a>
          </div>

          <!-- Navigation -->
          <nav class="main-nav ${this.menuOpen ? 'menu-open' : ''}">
            <ul class="nav-list">
              <li><a href="/app" class="nav-link">Home</a></li>
              <li class="nav-dropdown">
                <span class="nav-link">Books</span>
                <ul class="dropdown-menu">
                  <li><a href="/app/books">Browse Books</a></li>
                  <li><a href="/app/books/new">Add Book</a></li>
                </ul>
              </li>
              <li class="nav-dropdown">
                <span class="nav-link">Authors</span>
                <ul class="dropdown-menu">
                  <li><a href="/app/authors">Browse Authors</a></li>
                  <li><a href="/app/authors/new">Add Author</a></li>
                </ul>
              </li>
              <li class="nav-dropdown">
                <span class="nav-link">Categories</span>
                <ul class="dropdown-menu">
                  <li><a href="/app/categories">Browse Categories</a></li>
                  <li><a href="/app/categories/new">Add Category</a></li>
                </ul>
              </li>
            </ul>
          </nav>

          <!-- Header actions -->
          <div class="header-actions">
            <!-- Dark mode toggle -->
            <label class="dark-mode-toggle">
              <input 
                type="checkbox" 
                .checked=${this.darkMode}
                @change=${this.toggleDarkMode}
              />
              <span class="toggle-slider">
                <svg class="icon sun" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
                <svg class="icon moon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              </span>
            </label>

            <!-- Auth component -->
            <header-auth></header-auth>

            <!-- Mobile menu toggle -->
            <button 
              class="menu-toggle" 
              @click=${this.toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>
    `;
  }

  static styles = css`
    .main-header {
      background-color: var(--color-background-primary, white);
      border-bottom: 1px solid var(--color-border, #e1e5e9);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 4rem;
    }

    .logo-section {
      flex-shrink: 0;
    }

    .logo-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: var(--color-text-primary, #2c3e50);
    }

    .logo-icon {
      width: 2rem;
      height: 2rem;
      color: var(--color-accent, #3498db);
    }

    .logo-link h1 {
      margin: 0;
      font-family: 'Libre Baskerville', serif;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .main-nav {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    .nav-list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 2rem;
    }

    .nav-link {
      color: var(--color-text-primary, #2c3e50);
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 0;
      transition: color 0.2s ease;
      cursor: pointer;
    }

    .nav-link:hover {
      color: var(--color-accent, #3498db);
    }

    .nav-dropdown {
      position: relative;
    }

    .nav-dropdown:hover .dropdown-menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      background-color: var(--color-background-primary, white);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      border-radius: 4px;
      min-width: 160px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s ease;
      z-index: 1000;
      list-style: none;
      margin: 0;
      padding: 0.5rem 0;
    }

    .dropdown-menu li {
      margin: 0;
    }

    .dropdown-menu a {
      display: block;
      padding: 0.5rem 1rem;
      color: var(--color-text-primary);
      text-decoration: none;
      transition: background-color 0.2s ease;
    }

    .dropdown-menu a:hover {
      background-color: var(--color-background-secondary, #f8f9fa);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-shrink: 0;
    }

    .dark-mode-toggle {
      position: relative;
      cursor: pointer;
    }

    .dark-mode-toggle input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 3rem;
      height: 1.5rem;
      background-color: var(--color-background-secondary, #e1e5e9);
      border-radius: 1rem;
      position: relative;
      transition: background-color 0.3s ease;
      padding: 0.25rem;
    }

    .dark-mode-toggle input:checked + .toggle-slider {
      background-color: var(--color-accent, #3498db);
    }

    .toggle-slider::before {
      content: '';
      position: absolute;
      width: 1rem;
      height: 1rem;
      background-color: white;
      border-radius: 50%;
      transition: transform 0.3s ease;
      left: 0.25rem;
    }

    .dark-mode-toggle input:checked + .toggle-slider::before {
      transform: translateX(1.5rem);
    }

    .toggle-slider .icon {
      width: 0.75rem;
      height: 0.75rem;
      opacity: 0.6;
      transition: opacity 0.3s ease;
    }

    .toggle-slider .sun {
      color: #ffd700;
    }

    .toggle-slider .moon {
      color: #34495e;
    }

    .dark-mode-toggle input:checked + .toggle-slider .sun {
      opacity: 0.3;
    }

    .dark-mode-toggle input:checked + .toggle-slider .moon {
      opacity: 1;
    }

    .menu-toggle {
      display: none;
      flex-direction: column;
      gap: 3px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
    }

    .menu-toggle span {
      width: 20px;
      height: 2px;
      background-color: var(--color-text-primary, #2c3e50);
      transition: all 0.3s ease;
    }

    @media (max-width: 768px) {
      .header-container {
        padding: 0 1rem;
      }

      .logo-link h1 {
        font-size: 1.25rem;
      }

      .main-nav {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: var(--color-background-primary, white);
        border-top: 1px solid var(--color-border, #e1e5e9);
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .main-nav.menu-open {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }

      .nav-list {
        flex-direction: column;
        gap: 0;
        padding: 1rem;
      }

      .nav-link {
        padding: 1rem 0;
        border-bottom: 1px solid var(--color-border, #e1e5e9);
      }

      .dropdown-menu {
        position: static;
        opacity: 1;
        visibility: visible;
        transform: none;
        box-shadow: none;
        background-color: var(--color-background-secondary, #f8f9fa);
        margin-left: 1rem;
        border-radius: 0;
      }

      .menu-toggle {
        display: flex;
      }

      .header-actions {
        gap: 0.5rem;
      }
    }

    /* Dark mode styles */
    :host-context(body.dark-mode) .main-header {
      background-color: var(--color-background-primary-dark, #2c3e50);
      border-bottom-color: var(--color-border-dark, #34495e);
    }

    :host-context(body.dark-mode) .nav-link {
      color: var(--color-text-primary-dark, #ecf0f1);
    }

    :host-context(body.dark-mode) .dropdown-menu {
      background-color: var(--color-background-primary-dark, #2c3e50);
    }

    :host-context(body.dark-mode) .dropdown-menu a:hover {
      background-color: var(--color-background-secondary-dark, #34495e);
    }
  `;
}