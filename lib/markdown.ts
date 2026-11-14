// Blog posts are written in Markdown (## heading, **bold**, - list, [link](url), ![photo](url)).
// Raw HTML is shown as text, and only http(s), mailto, tel, relative and #anchor links are allowed.
import {Marked} from 'marked';

const marked = new Marked({gfm: true, breaks: true});
marked.use({
  renderer: {
    html(token) {return escape(token.text)},
  },
  walkTokens(token) {
    if ((token.type === 'link' || token.type === 'image') && !/^(https?:|mailto:|tel:|\/|#)/i.test(token.href.trim())) token.href = '#';
  },
});

function escape(s: string) {return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}

export function renderMarkdown(src: string): string {
  const html = marked.parse(src || '', {async: false}) as string;
  // Open outside links in a new tab.
  return html.replace(/<a href="(https?:\/\/(?!domesticstaffprovider\.com)[^"]*)"/g, '<a href="$1" target="_blank" rel="noopener"');
}

export const readingMinutes = (src: string) => Math.max(1, Math.round((src || '').split(/\s+/).length / 200));
