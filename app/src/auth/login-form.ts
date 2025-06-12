// src/auth/login-form.ts
import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { define, Form } from "@calpoly/mustang";

export class LoginFormElement extends LitElement {
  static uses = define({
    "mu-form": Form.Element,
  });

  @property()
  api?: string;

  @property()
  redirect?: string;

  @state()
  message = "";

  @state()
  loading = false;

  render() {
    return html`
      <mu-form @mu-form:submit=${this._handleSubmit}>
        <slot></slot>
        ${this.message ? html`
          <div class="message ${this.message.includes('Error') ? 'error' : 'success'}">
            ${this.message}
          </div>
        ` : ''}
      </mu-form>
    `;
  }

  _handleSubmit(event: Form.SubmitEvent) {
    if (!this.api) return;

    this.loading = true;
    this.message = "";

    const { username, password } = event.detail;

    fetch(this.api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          return response.json();
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      })
      .then((json) => {
        const { token } = json;
        if (token) {
          this._setAuthToken(token);
          this.message = "Login successful! Redirecting...";
          
          // Redirect after a short delay
          setTimeout(() => {
            if (this.redirect) {
              window.location.href = this.redirect;
            }
          }, 1000);
        } else {
          throw new Error("No token received");
        }
      })
      .catch((error) => {
        console.error("Authentication error:", error);
        this.message = `Error: ${error.message}`;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  _setAuthToken(token: string) {
    // Store token in localStorage for persistence
    localStorage.setItem("auth:token", token);
    
    // Dispatch custom event to notify auth provider
    this.dispatchEvent(
      new CustomEvent("auth:message", {
        bubbles: true,
        composed: true,
        detail: ["auth/signin", { token, redirect: this.redirect }]
      })
    );
  }

  static styles = css`
    :host {
      display: block;
    }

    mu-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    ::slotted(label) {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-weight: 600;
    }

    ::slotted(input) {
      padding: 0.75rem;
      border: 1px solid var(--color-border, #ddd);
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
    }

    ::slotted(input:focus) {
      outline: none;
      border-color: var(--color-accent, #3498db);
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.25);
    }

    button {
      padding: 0.75rem 1.5rem;
      background-color: var(--color-primary, #3498db);
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    button:hover:not(:disabled) {
      background-color: var(--color-primary-hover, #2980b9);
    }

    button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    .message {
      padding: 0.75rem;
      border-radius: 4px;
      font-weight: 500;
      text-align: center;
    }

    .message.success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .message.error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  `;
}