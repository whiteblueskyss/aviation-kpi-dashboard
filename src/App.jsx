import { COURSES, SITE_NAME, courseBySlug } from './courses.js';
import DepartureBoard from './components/DepartureBoard.jsx';
import BoardingPass from './components/BoardingPass.jsx';
import LoadFactorLab from './components/LoadFactorLab.jsx';
import { useReducedMotion } from './lib/motion.js';
import eavaLogo from '../courses/market-lab/src/assets/eava-logo.png';

const FIRST = COURSES[0];

// Eight ideas that carry most of the three courses. One line of intuition each.
const CHEATSHEET = [
  { term: 'ASK', name: 'Available seat-km', formula: 'seats × km flown', idea: 'Capacity: every seat flown one kilometre, empty or full.', course: 'market-lab' },
  { term: 'RPK', name: 'Revenue passenger-km', formula: 'passengers × km flown', idea: 'Demand: every paying passenger flown one kilometre.', course: 'market-lab' },
  { term: 'PLF', name: 'Passenger load factor', formula: 'RPK ÷ ASK', idea: 'How full the flying was. 80% means 8 of every 10 seat-km were sold.', course: 'market-lab' },
  { term: 'Yield', name: 'Revenue per RPK', formula: 'passenger revenue ÷ RPK', idea: 'The average price of one passenger-kilometre sold.', course: 'kpi-dashboard' },
  { term: 'CASK', name: 'Cost per ASK', formula: 'operating cost ÷ ASK', idea: 'What it costs to fly one seat one kilometre. Short flights cost more per km.', course: 'kpi-dashboard' },
  { term: 'RASK', name: 'Revenue per ASK', formula: 'operating revenue ÷ ASK', idea: 'Compare with CASK: RASK above CASK means the flying makes money.', course: 'kpi-dashboard' },
  { term: 'OTP', name: 'On-time performance', formula: 'arrivals < 15 min late ÷ flights operated', idea: 'Punctuality. Early arrivals count as on time.', course: 'kpi-dashboard' },
  { term: 'PDCA', name: 'Plan · Do · Check · Act', formula: 'plan → do → check → act → repeat', idea: 'The improvement loop at the heart of every quality management system.', course: 'qms-companion' },
];

const CHECKLIST = [
  ['Predict, then check', 'Before you move a filter or slider, guess what will happen. The surprise is where learning sticks.'],
  ['Short blocks', 'Study in 45-minute blocks. Every course is split into small sections you can finish in one sitting.'],
  ['Explain it back', 'Use the workshop tasks and written practice. If you can say it simply, you understand it.'],
  ['Bigger screen for dashboards', 'The charts and tables work on a phone, but a laptop shows more at once.'],
  ['Know what is saved', 'QMS progress is saved in this browser. Market Lab answers clear on reload, so copy anything you want to keep.'],
  ['Know the data', 'Market Lab uses historical IATA data (July 2025). The KPI course uses synthetic figures with real airline names.'],
];

function HeroSky() {
  const reduced = useReducedMotion();
  const route = 'M 60 520 C 360 160, 760 120, 1140 300';
  return (
    <svg className="hero__sky" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="1" />
        </pattern>
        <radialGradient id="glow" cx="75%" cy="20%" r="60%">
          <stop offset="0" stopColor="#2f7fd6" stopOpacity=".55" />
          <stop offset="1" stopColor="#2f7fd6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="600" fill="url(#grid)" />
      <rect width="1200" height="600" fill="url(#glow)" />
      <path d={route} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
      <path d="M 120 560 C 420 300, 820 360, 1180 120" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1.5" strokeDasharray="2 10" strokeLinecap="round" />
      {[[60, 520], [1140, 300], [120, 560], [1180, 120]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="5" fill="#9fd0ff" />
          <circle cx={x} cy={y} r="14" fill="none" stroke="#9fd0ff" strokeOpacity=".35" />
        </g>
      ))}
      <g>
        <path d="M0 -9 L4 -2 L14 2 L14 5 L4 3 L3 10 L6 13 L6 15 L0 13.5 L-6 15 L-6 13 L-3 10 L-4 3 L-14 5 L-14 2 L-4 -2 Z" transform="rotate(90) scale(1.6)" fill="#fff" />
        {reduced ? (
          <animateMotion dur="0.01s" fill="freeze" keyPoints="0.55;0.55" keyTimes="0;1" calcMode="linear" path={route} rotate="auto" />
        ) : (
          <animateMotion dur="16s" repeatCount="indefinite" path={route} rotate="auto" />
        )}
      </g>
    </svg>
  );
}

export default function App() {
  return (
    <>
      <a className="skip" href="#courses">
        Skip to courses
      </a>

      <header className="topnav">
        <div className="wrap topnav__inner">
          <a className="logo" href="/" aria-label={`${SITE_NAME} home`}>
            <span className="logo__mark" aria-hidden="true">✈</span>
            {SITE_NAME}
          </a>
          <nav aria-label="Page sections" className="topnav__links">
            <a href="#courses">Courses</a>
            <a href="#flight-plan">Learning path</a>
            <a href="#try">Try it</a>
            <a href="#cheatsheet">Cheat sheet</a>
          </nav>
          <a className="btn btn--small btn--light" href={FIRST.href}>
            Start learning
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <HeroSky />
          <div className="cloud cloud--a" aria-hidden="true" />
          <div className="cloud cloud--b" aria-hidden="true" />
          <div className="wrap hero__inner">
            <div className="hero__copy">
              <p className="eyebrow eyebrow--light">Courses by Dr. Bahtiyar Eren · Eesti Lennuakadeemia · Estonian Aviation Academy</p>
              <h1>
                Learn how airlines <span className="hero__accent">really work.</span>
              </h1>
              <p className="hero__lead">
                Three interactive courses on how airlines are measured, managed and kept safe. You learn by moving the
                numbers yourself, not by memorising definitions.
              </p>
              <div className="hero__cta">
                <a className="btn btn--primary" href={FIRST.href}>
                  Start with course 1 <span aria-hidden="true">→</span>
                </a>
                <a className="btn btn--ghost" href="#courses">
                  See all courses
                </a>
              </div>
              <ul className="hero__stats" aria-label="At a glance">
                <li>
                  <b>3</b> courses
                </li>
                <li>
                  <b>35</b> airline KPIs
                </li>
                <li>
                  <b>4</b> QMS modules
                </li>
                <li>
                  <b>0</b> sign-ups
                </li>
              </ul>
            </div>
            <DepartureBoard />
          </div>
        </section>

        <section id="courses" className="section">
          <div className="wrap">
            <p className="eyebrow">Choose your flight</p>
            <h2>Three courses, one complete picture</h2>
            <p className="section__lead">
              Each course is a self-contained boarding pass. Start anywhere, or follow the recommended order below.
            </p>
            <div className="passes">
              {COURSES.map((c) => (
                <BoardingPass key={c.slug} course={c} total={COURSES.length} />
              ))}
            </div>
          </div>
        </section>

        <section id="flight-plan" className="section section--tint">
          <div className="wrap">
            <p className="eyebrow">Recommended flight plan</p>
            <h2>Market → performance → quality</h2>
            <p className="section__lead">Each leg gives you the vocabulary the next one builds on.</p>
            <ol className="plan">
              <li className="plan__leg">
                <span className="plan__dot">1</span>
                <h3>Learn the language of demand</h3>
                <p>
                  <b>{courseBySlug('market-lab').title}.</b> RPK, ASK and load factor on real IATA market data. You learn to
                  read a market before judging an airline.
                </p>
                <a href={courseBySlug('market-lab').href}>Open leg 1 →</a>
              </li>
              <li className="plan__leg">
                <span className="plan__dot">2</span>
                <h3>Measure an airline’s performance</h3>
                <p>
                  <b>{courseBySlug('kpi-dashboard').title}.</b> Apply those ideas to 5,000 flights and add cost, revenue,
                  punctuality and baggage. Now you can say why one airline beats another.
                </p>
                <a href={courseBySlug('kpi-dashboard').href}>Open leg 2 →</a>
              </li>
              <li className="plan__leg">
                <span className="plan__dot">3</span>
                <h3>Keep it safe and compliant</h3>
                <p>
                  <b>{courseBySlug('qms-companion').title}.</b> Numbers only help if the organisation acts on them. Learn
                  quality management, audits and Just Culture.
                </p>
                <a href={courseBySlug('qms-companion').href}>Open leg 3 →</a>
              </li>
            </ol>
          </div>
        </section>

        <section id="try" className="section">
          <div className="wrap">
            <p className="eyebrow">Try it in 20 seconds</p>
            <h2>Does a full aircraft make money?</h2>
            <p className="section__lead">
              Fill the cabin and change the fare. Watch load factor, cost and profit move together. This is the core idea of
              courses 1 and 2.
            </p>
            <LoadFactorLab />
          </div>
        </section>

        <section id="cheatsheet" className="section section--tint">
          <div className="wrap">
            <p className="eyebrow">Cheat sheet</p>
            <h2>Eight ideas that carry the courses</h2>
            <p className="section__lead">Keep this page open while you study. Each card links to the course that teaches it.</p>
            <div className="cheats">
              {CHEATSHEET.map((c) => {
                const course = courseBySlug(c.course);
                return (
                  <article key={c.term} className="cheat" style={{ '--accent': course.accent }}>
                    <header>
                      <b>{c.term}</b>
                      <span>{c.name}</span>
                    </header>
                    <code>{c.formula}</code>
                    <p>{c.idea}</p>
                    <a href={course.href}>
                      Learn it in course {course.leg} <span aria-hidden="true">→</span>
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <p className="eyebrow">Pre-flight checklist</p>
            <h2>How to get the most out of each course</h2>
            <ul className="checklist">
              {CHECKLIST.map(([title, text]) => (
                <li key={title}>
                  <span className="checklist__tick" aria-hidden="true">✓</span>
                  <div>
                    <b>{title}</b>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="cta-band">
          <div className="wrap cta-band__inner">
            <div>
              <h2>Ready for departure?</h2>
              <p>Course 1 takes under an hour and needs only basic percentages.</p>
            </div>
            <a className="btn btn--primary" href={FIRST.href}>
              Board {FIRST.flight} · {FIRST.title} <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </main>

      <section className="credits" aria-labelledby="credits-title">
        <div className="wrap credits__inner">
          <img src={eavaLogo} alt="Eesti Lennuakadeemia · Estonian Aviation Academy" className="credits__logo" />
          <div>
            <p className="eyebrow">Credits</p>
            <h2 id="credits-title">All credit to Dr. Bahtiyar Eren</h2>
            <p>
              Every course on this site, including the lessons, datasets, exercises, questions and slides, was created by{' '}
              <b>Dr. Bahtiyar Eren</b> of <b>Eesti Lennuakadeemia · Estonian Aviation Academy</b>. The ideas, teaching
              design and course content are entirely his work.
            </p>
            <p className="credits__notice">
              <b>Please note:</b> {SITE_NAME} is an unofficial copy of the courses Dr. Eren shared publicly on LinkedIn,
              collected here for personal study purposes only. It is not an official Eesti Lennuakadeemia (Estonian Aviation Academy) website and is
              not endorsed by Dr. Eren or the Academy. For the original material, please follow his work on LinkedIn.
            </p>
            <a
              className="btn btn--linkedin"
              href="https://www.linkedin.com/in/bahtiyar-eren-6562b616/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
              </svg>
              Dr. Bahtiyar Eren on LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap footer__inner">
          <img src={eavaLogo} alt="Eesti Lennuakadeemia · Estonian Aviation Academy" className="footer__logo" />
          <div className="footer__text">
            <p>
              <b>{SITE_NAME}</b>: all courses, materials and datasets © Dr. Bahtiyar Eren, Eesti Lennuakadeemia · Estonian Aviation Academy. Copied
              from his public LinkedIn posts for study purposes only.{' '}
              <a href="https://www.linkedin.com/in/bahtiyar-eren-6562b616/" target="_blank" rel="noopener noreferrer">
                LinkedIn profile ↗
              </a>
            </p>
            <p className="footer__small">
              Educational use only. The KPI course uses synthetic performance figures; the Market Lab is a historical IATA
              case study (July 2025), not current market reporting.
            </p>
          </div>
          <nav aria-label="Courses" className="footer__nav">
            {COURSES.map((c) => (
              <a key={c.slug} href={c.href}>
                {c.flight} · {c.title}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </>
  );
}
