// Helpers that turn the lesson-content HTML strings into the styled markup
// the original companion used. The content strings are static, author-written
// HTML (see src/data/modules.js), rendered with dangerouslySetInnerHTML.

export const esc = (v) =>
  String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const chipHtml = (cls, label) => `<span class="chip ${cls}">${label}</span>`;

export const plain = (h) =>
  String(h)
    .replace(/<\/?(b|strong|em|i|a)\b[^>]*>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export function teaser(h) {
  const t = plain(h);
  const m = t.match(/^(.{20,140}?[.!?])\s/);
  return m ? m[1] : t.length > 120 ? t.slice(0, 117) + '…' : t;
}

export const styleApp = (h) =>
  String(h).replace(
    /<p><b>Aviation application\.<\/b>\s*/g,
    `<p class="app-box">${chipHtml('app', 'Aviation application')} `
  );

export const stylePractice = (h) =>
  String(h)
    .replace(/<h3>Worked example · (.*?)<\/h3>/g, `${chipHtml('concept', 'Worked example')}<h4>$1</h4>`)
    .replace(
      /<h3>(Guided practice|Independent practice) · (.*?)<\/h3>/g,
      (m, a, b) => `${chipHtml('turn', 'Your turn · ' + (a.startsWith('Guided') ? 'guided' : 'independent'))}<h4>${b}</h4>`
    )
    .replace(/<p><b>Worked example\.<\/b>/g, `<p>${chipHtml('concept', 'Worked example')} `)
    .replace(
      /<p><b>(Guided practice|Independent practice)\.<\/b>/g,
      (m, a) => `<p>${chipHtml('turn', 'Your turn · ' + (a.startsWith('Guided') ? 'guided' : 'independent'))} `
    )
    .replace(/<strong>Your turn\.<\/strong>/g, '<strong>Your turn:</strong>');
