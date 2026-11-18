import { COURSES, SITE_NAME } from '../courses.js';
import './all-courses-link.css';

/**
 * Small "back to Aviation Study" link shown at the top of every course's sidebar,
 * so students can always return to the course list.
 * `tone="dark"` is for dark sidebars (Market Lab), the default is for light ones.
 */
export default function AllCoursesLink({ current, tone = 'light' }) {
  const course = COURSES.find((c) => c.slug === current);
  return (
    <a className={`as-home as-home--${tone}`} href="/" title={`Back to all ${SITE_NAME} courses`}>
      <span className="as-home__arrow" aria-hidden="true">←</span>
      <span className="as-home__text">
        <span className="as-home__site">✈ {SITE_NAME}</span>
        <span className="as-home__sub">
          All courses{course ? ` · Course ${course.leg} of ${COURSES.length}` : ''}
        </span>
      </span>
    </a>
  );
}
