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
        
        <!-- 确保按钮总是显示 -->
        <div class="submit-button-container">
          <button type="submit" class="submit-button" ?disabled=${this.loading}>
            ${this.loading ? html`
              <span class="spinner"></span>
              Signing in...
            ` : 'Sign In'}
          </button>
        </div>
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
        } else if (response.status === 401) {
          throw new Error("Invalid username or password");
        } else {
          throw new Error(`Login failed with status ${response.status}`);
        }
      })
      .then((json) => {
        const { token } = json;
        if (token) {
          this._setAuthToken(token);
          this.message = "Login successful! Redirecting...";
          
          // Check for return URL in query parameters
          const urlParams = new URLSearchParams(window.location.search);
          const returnUrl = urlParams.get('return');
          
          // Redirect after a short delay
          setTimeout(() => {
            if (returnUrl) {
              window.location.href = decodeURIComponent(returnUrl);
            } else if (this.redirect) {
              window.location.href = this.redirect;
            } else {
              window.location.href = '/app';
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
    
    // Decode token to get user info
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user = { username: payload.username, token };
      
      // Dispatch auth signin event
      this.dispatchEvent(
        new CustomEvent("auth:message", {
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { user, token }]
        })
      );
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
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

    .submit-button-container {
      margin-top: 1rem;
    }

    .submit-button {
      width: 100%;
      padding: 0.875rem 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .submit-button:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .submit-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .message {
      padding: 0.75rem;
      border-radius: 4px;
      font-weight: 500;
      text-align: center;
      margin: 1rem 0;
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

    /* 确保在slotted内容中的按钮也有样式 */
    ::slotted(.btn) {
      width: 100%;
      padding: 0.875rem 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    ::slotted(.btn:hover) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
  `;
}