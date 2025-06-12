// src/components/header-auth.ts
import { LitElement, css, html } from "lit";
import { state } from "lit/decorators.js";
import { Auth } from "@calpoly/mustang";

export class HeaderAuthElement extends LitElement {
  @state()
  user?: Auth.User;

  @state()
  authenticated = false;

  connectedCallback() {
    super.connectedCallback();
    this._checkAuthStatus();
    
    // Listen for auth changes
    this.addEventListener("auth:change", this._handleAuthChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("auth:change", this._handleAuthChange);
  }

  _checkAuthStatus() {
    const token = localStorage.getItem("auth:token");
    if (token) {
      try {
        // Decode JWT token to get user info (basic implementation)
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.user = { username: payload.username };
        this.authenticated = true;
      } catch (error) {
        console.error("Invalid token:", error);
        this._clearAuth();
      }
    }
  }

  _handleAuthChange(event: CustomEvent) {
    const { user, authenticated } = event.detail;
    this.user = user;
    this.authenticated = authenticated;
  }

  _handleSignOut() {
    this._clearAuth();
    
    // Dispatch sign out event
    this.dispatchEvent(
      new CustomEvent("auth:message", {
        bubbles: true,
        composed: true,
        detail: ["auth/signout", {}]
      })
    );

    // Redirect to login
    window.location.href = "/login.html";
  }

  _clearAuth() {
    localStorage.removeItem("auth:token");
    this.user = undefined;
    this.authenticated = false;
  }

  render() {
    if (this.authenticated && this.user) {
      return html`
        <div class="auth-info">
          <span class="welcome">Welcome, ${this.user.username}!</span>
          <button class="sign-out-btn" @click=${this._handleSignOut}>
            Sign Out
          </button>
        </div>
      `;
    }

    return html`
      <div class="auth-actions">
        <a href="/login.html" class="auth-link">Sign In</a>
        <a href="/newuser.html" class="auth-link">Sign Up</a>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    .auth-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .welcome {
      color: var(--color-text);
      font-weight: 500;
    }

    .sign-out-btn {
      padding: 0.5rem 1rem;
      background-color: var(--color-secondary, #6c757d);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background-color 0.2s ease;
    }

    .sign-out-btn:hover {
      background-color: #5a6268;
    }

    .auth-actions {
      display: flex;
      gap: 1rem;
    }

    .auth-link {
      padding: 0.5rem 1rem;
      color: var(--color-primary, #3498db);
      text-decoration: none;
      border: 1px solid var(--color-primary, #3498db);
      border-radius: 4px;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .auth-link:hover {
      background-color: var(--color-primary, #3498db);
      color: white;
    }

    .auth-link:last-child {
      background-color: var(--color-primary, #3498db);
      color: white;
    }

    .auth-link:last-child:hover {
      background-color: var(--color-primary-hover, #2980b9);
    }
  `;
}