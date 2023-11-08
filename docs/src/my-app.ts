import { LitElement, TemplateResult, css, html, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, state } from 'lit/decorators.js';
import page from 'page';
import packageList from './packages.json' assert { type: 'json' };
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import '@justinribeiro/code-block';

import './marked/code-block.js';

@customElement('my-app')
export class MyApp extends LitElement {
  @state() private template: TemplateResult | null = null;

  constructor() {
    super();

    page('/', async () => {
      await import('./components/home-page.js');
      this.template = html`<home-page></home-page>`;
    });

    page('/packages/:name', async (ctx) => {
      try {
        await import (`/node_modules/${ctx.params.name}/lib/${ctx.params.name}.js`);
        const md = await (await fetch(`/node_modules/${ctx.params.name}/docs/${ctx.params.name}.md`)).text();
        const parsedHtml = DOMPurify.sanitize(marked.parse(md), {ADD_TAGS: [ctx.params.name, 'code-block'], ADD_ATTR: ['language']});
        this.template = html`${unsafeHTML(parsedHtml)}`;
      } catch (error) {
        console.error(error);
        await import ('./components/error-404.js');
        this.template = html`<error-404>${ctx.params.name}</error-404>`;
      }
    });

    page('/packages/:namespace/:name', async (ctx) => {
      try {
        await import (`/node_modules/${ctx.params.namespace}/${ctx.params.name}/lib/${ctx.params.name}.js`);
        const md = await (await fetch(`/node_modules/${ctx.params.namespace}/${ctx.params.name}/docs/${ctx.params.name}.md`)).text();
        const parsedHtml = DOMPurify.sanitize(marked.parse(md), {ADD_TAGS: [ctx.params.name, 'code-block'], ADD_ATTR: ['language']});
        this.template = html`${unsafeHTML(parsedHtml)}`;
      } catch (error) {
        console.error(error);
        await import ('./components/error-404.js');
        this.template = html`<error-404>${ctx.params.name}</error-404>`;
      }
    });

    page('*', async () => {
      await import ('./components/error-404.js');
      this.template = html`<error-404>${window.location.pathname}</error-404>`;
    });

    page.start();
  }

  static styles = [
    css`
      :host {
        display: grid;
        grid: 'header header' auto
              'nav main' auto / 2in auto;

        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }
      header {
        grid-area: header;
        position: sticky;
        display: flex;
        flex-direction: row;
        align-items: center;
        top: 0;
        left: 0;
        right: 0;
        height: 0.75in;
        box-shadow: 0 0 0 black;
        padding: 0 0.2in;
      }
      nav {
        grid-area: nav;
        display: grid;
        grid-auto-rows: 0.5in;
      }
      nav > a {
        border-bottom: 1px solid #aaa;
        margin-left: 0.2in;
        display: flex;
        align-items: center;
      }
      main {
        grid-area: main;
        padding: 0 0.2in;
      }
      h1 {
        font-weight: 400;
        font-size: 0.5in;
        line-height: 0.5in;
        margin: 0;
      }
      a,
      a:active,
      a:visited {
        color: rgba(85,119,204,1);
        text-decoration: none;
        position:relative;
      }
      a::after {
        content: ' ';
        transition: left 150ms ease-in-out;
        position:absolute;
        top: 0;
        bottom:0;
        left:100%;
        right:0;
        border-bottom: 0.08em solid currentColor;
      }
      a:hover::after {
        left:0;
      }
    `
  ];

  render = () => html`
    <header>
      <h1><a href="/">Docs</a></h1>
    </header>
    <nav>
      ${packageList.map(item => html`<a href="/packages/${item}">${item}</a>`)}
    </nav>
    <main>
      ${this.template ?? nothing}
    </main>
  `;
}
