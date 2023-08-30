import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('error-404')
export class Error404 extends LitElement {
  render = () => html`
    <h1>404 - package "<slot></slot>" not found</h1>
  `;
}