import { LitElement, TemplateResult, css, html, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, state } from 'lit/decorators.js';
import page from 'page';
import packageList from './packages.json' assert { type: 'json' };
import { marked } from 'marked';
import DOMPurify from 'dompurify';

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
        const module = await import(`./importers/${ctx.params.name}.js`);
        const md = await (await fetch(`${module.Path.replace('/lib/index.js',`/docs/${ctx.params.name}.md`)}`)).text();
        const parsedHtml = DOMPurify.sanitize(marked.parse(md), {ADD_TAGS: [ctx.params.name]});
        console.log(parsedHtml);
        this.template = html`${unsafeHTML(parsedHtml)}`;
      } catch (error) {
        console.error(error);
        await import ('./components/error-404.js');
        this.template = html`<error-404>${ctx.params.name}</error-404>`;
      }
    });

    page.start();
  }

  static styles = [
    css`
      :host {
        display: block;
        border: 1px solid red;
      }
      header {
        position: sticky;
        display: flex;
        flex-direction: row;
        align-items: center;
        top: 0;
        left: 0;
        right: 0;
        height: 0.75in;
        box-shadow: 0 0 0.1in black;
      }
      h1 {
        font-weight: 400;
        font-size: 0.5in;
        line-height: 0.5in;
        margin: 0;
      }
    `
  ];

  render = () => html`
    <header>
      <h1>Docs</h1>
    </header>
    <app-navigation>
      ${packageList.map(item => html`<a href="/packages/${item}">${item}</a>`)}
    </app-navigation>
    <main>
      ${this.template ?? nothing}
    </main>
  `;
}
