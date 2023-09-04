import { marked } from 'marked';

const escapeTest = /[&<>"']/;
const escapeReplace = new RegExp(escapeTest.source, 'g');
const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, 'g');
const escapeReplacements: Record<string,string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;'
};
const getEscapeReplacement = (ch: string) => escapeReplacements[ch];
function escape(html: string, encode?: boolean) {
  if (encode) {
    if (escapeTest.test(html)) {
      return html.replace(escapeReplace, getEscapeReplacement);
    }
  }
  else {
    if (escapeTestNoEncode.test(html)) {
      return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
    }
  }
  return html;
}

const renderer = {
  code(code: string, infostring: string | undefined, escaped: boolean) {
    const lang = (infostring || '').match(/^\S*/)?.[0];
    code = code.replace(/\n$/, '') + '\n';
    if (!lang) {
      return '<code-block>'
          + (escaped ? code : escape(code, true))
          + '</code-block>\n';
    }
    return '<code-block class="language-'
        + escape(lang)
        + '">'
        + (escaped ? code : escape(code, true))
        + '</code-clock>\n';
  }
};

marked.use({ renderer });