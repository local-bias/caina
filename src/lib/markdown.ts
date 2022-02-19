import hljs from 'highlight.js/lib/core';
import { Renderer, marked } from 'marked';
import javascript from 'highlight.js/lib/languages/javascript';

const getHighlightRenderer = () => {
  hljs.registerLanguage('javascript', javascript);
  const renderer = new Renderer();
  renderer.code = (code, lang) => {
    code = hljs.highlight(lang || 'bash', code).value;
    return `<code class="hljs language-${lang}"><pre>${code}</pre></code>`;
  };
  return renderer;
};

export const markdownToHtml = async (markdown: string) => {
  const renderer = getHighlightRenderer();
  return marked(markdown, { renderer });
};
