import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('component-controls')
export class ComponentControls extends LitElement {
  static styles = [
    css`
      :host {
        border: 1px solid purple;
      }
    `
  ];
  render = () => html`<slot></slot>`;
}