import { NOTICE, SLIDES } from '../lib/constants';

// Slide PDFs live in public/courses/qms-companion/slides/.
export const slidesHref = (i) => import.meta.env.BASE_URL + 'courses/qms-companion/' + SLIDES[i][0];

export default function SlidesCard({ i }) {
  const s = SLIDES[i];
  return (
    <>
      <a className="slides-card" href={slidesHref(i)} download>
        <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#112e54" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="13" rx="2"></rect>
          <path d="M8 21h8M12 17v4"></path>
        </svg>
        <span>
          <b>Module {i + 1} slides</b>
          <span className="small" style={{ display: 'block' }}>
            PDF · {s[1]} slides · download
          </span>
        </span>
      </a>
      <p className="small notice-line">{NOTICE}</p>
    </>
  );
}
