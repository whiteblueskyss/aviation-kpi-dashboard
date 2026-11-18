import { useState } from 'react';
import AllCoursesLink from '../../../../src/shared/AllCoursesLink.jsx';

const ITEMS = [
  ['before', 'Study modules'],
  ['quiz', 'Readiness Assessment'],
  ['practice', 'Written practice'],
  ['feedback', 'Feedback'],
  ['sources', 'Sources & AI Disclosure'],
];

export default function Sidebar({ page, nav }) {
  const [open, setOpen] = useState(false);
  const current = page === 'module' ? 'before' : page;
  return (
    <aside className="sidebar">
      <AllCoursesLink current="qms-companion" />
      <button id="menuToggle" className="btn mobile-toggle" onClick={() => setOpen((o) => !o)}>
        ☰ Show / hide contents
      </button>
      <nav className={'side-items' + (open ? ' open' : '')} id="sideItems" aria-label="Companion navigation">
        {ITEMS.map(([p, label]) => (
          <button
            key={p}
            className="navbtn"
            data-page={p}
            onClick={() => nav(p)}
            aria-current={current === p ? 'page' : undefined}
          >
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
