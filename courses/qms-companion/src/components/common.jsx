import { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import { getDraft, saveDraft } from '../lib/storage';

/** <span class="chip …"> label */
export const Chip = ({ cls, children, style }) => (
  <span className={`chip ${cls}`} style={style}>
    {children}
  </span>
);

/**
 * Renders author-written lesson HTML. After each render it
 *  - copies each evidence-table column heading onto its cells (data-heading,
 *    used by the mobile layout), and
 *  - restores saved drafts into any [data-answer] fields inside the markup.
 */
export const RawHtml = forwardRef(function RawHtml({ html, as: Tag = 'div', ...props }, outerRef) {
  const inner = useRef(null);
  const ref = outerRef || inner;
  useLayoutEffect(() => {
    const view = ref.current;
    if (!view) return;
    view.querySelectorAll('[data-answer]').forEach((f) => {
      f.value = getDraft(f.dataset.answer);
    });
    view.querySelectorAll('.evidence').forEach((table) => {
      const heads = table.querySelectorAll('thead th');
      table.querySelectorAll('tbody tr').forEach((row) =>
        row.querySelectorAll('td').forEach((cell, i) => {
          if (heads[i + 1]) cell.dataset.heading = heads[i + 1].textContent;
        })
      );
    });
  }, [html]);
  return <Tag ref={ref} {...props} dangerouslySetInnerHTML={{ __html: html }} />;
});

/** Textarea whose content is auto-saved to localStorage under `draftId`. */
export function DraftField({ id, draftId, rows = 3, style }) {
  const [value, setValue] = useState(() => getDraft(draftId));
  return (
    <textarea
      id={id}
      data-answer={draftId}
      rows={rows}
      style={style}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        saveDraft(draftId, e.target.value);
      }}
    />
  );
}
