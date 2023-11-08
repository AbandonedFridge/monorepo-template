import { LitElement, TemplateResult, css, html, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, query, state } from 'lit/decorators.js';
import page from 'page';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

import hljs from 'highlight.js/lib/core';

@customElement('my-app')
export class MyApp extends LitElement {
  @state() private template: TemplateResult | null = null;
  @state() private packages: string[] = [];
  @state() private themes: string[] = [];

  @query('main') main!: HTMLElement;
  @query('link') themeLink!: HTMLLinkElement;

  constructor() {
    super();

    page('/', async () => {
      await import('./components/home-page.js');
      this.template = html`<home-page></home-page>`;
    });

    page('/packages/:name', async (ctx) => {
      try {
        await this.#loadPackage(ctx.params.name);
      } catch (error) {
        await import ('./components/error-404.js');
        this.template = html`<error-404>${ctx.params.name}</error-404>`;
      }
    });

    page('/packages/:namespace/:name', async (ctx) => {
      try {
        await this.#loadPackage(ctx.params.name, ctx.params.namespace);
      } catch (error) {
        await import ('./components/error-404.js');
        this.template = html`<error-404>${ctx.params.namespace}/${ctx.params.name}</error-404>`;
      }
    });

    page('*', async () => {
      await import ('./components/error-404.js');
      this.template = html`<error-404>${window.location.pathname}</error-404>`;
    });

    page.start();
  }

  firstUpdated() {
    this.#loadPackages();
    this.#loadThemes();
    this.#setTheme('atom-one-dark');
  }

  async #loadPackage(name: string, namespace?: string) {
    await import (`/node_modules/${namespace ? `${namespace}/` : ''}${name}/lib/${name}.js`);
    this.template = await this.#loadMarkdown(`/node_modules/${namespace ? `${namespace}/` : ''}${name}/docs/${name}.md`, name);
    await this.updateComplete;
    const codeBlocks = this.shadowRoot?.querySelectorAll('code');
    Array.from(codeBlocks ?? []).map(o => hljs.highlightElement(o));
  }

  async #loadMarkdown(path: string, component: string) {
    const md = await (await fetch(path)).text();
    const languages = Array.from(new Set(Array.from(md.matchAll(/```([a-zA-Z0-9\\-]*)/g)).map(o => o[1] || 'javascript')));
    await this.#loadLanguages(languages);
    const parsedHtml = DOMPurify.sanitize(marked.parse(md), {ADD_TAGS: [component, 'code-block'], ADD_ATTR: ['language', 'theme']});
    return html`${unsafeHTML(parsedHtml)}`;
  }

  async #loadPackages() {
    this.packages = await (await fetch('/lib/packages.json')).json() as string[];
  }
  async #loadThemes() {
    this.themes = await (await fetch('/lib/shared/themes.json')).json() as string[];
  }
  async #loadLanguages(languages: string[]) {
    await Promise.all(languages.map(async (name) => {
      try {
        const language = await import(`/node_modules/highlight.js/lib/languages/${name}.js`);
        hljs.registerLanguage(name, language.default);
      } catch {
        console.error(`No language definition found for ${name}`);
      }
    }));
  }

  async #setTheme(theme: string) {
    this.themeLink.href = `/node_modules/highlight.js/styles/${theme}.css`;
  }

  static styles = [
    // theme,
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

      code {
        border-radius: 8px;
      }
    `
  ];

  render = () => html`
    <link rel="stylesheet" />
    <header>
      <h1><a href="/">Docs</a></h1>
    </header>
    <nav>
      ${this.packages.map(item => html`<a href="/packages/${item}">${item}</a>`)}
    </nav>
    <main>
      ${this.template ?? nothing}
    </main>
  `;
}
