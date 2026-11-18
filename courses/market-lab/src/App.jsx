import { useEffect, useState } from 'react';
import logo from './assets/eava-logo.png';
import { SECTIONS } from './lib/format';
import StartPage from './pages/StartPage';
import OverviewPage, { DemandPage } from './pages/OverviewPage';
import RegionsPage from './pages/RegionsPage';
import DomesticPage from './pages/DomesticPage';
import RoutesPage from './pages/RoutesPage';
import TimePage from './pages/TimePage';
import LabPage from './pages/LabPage';
import WorkshopPage from './pages/WorkshopPage';
import SourcesPage from './pages/SourcesPage';
import AllCoursesLink from '../../../src/shared/AllCoursesLink.jsx';

const validId = (id) => (SECTIONS.some((s) => s[0] === id) ? id : 'start');
const initialSection = () => validId(window.location.hash.slice(1) || 'start');

export default function App() {
  const [section, setSection] = useState(initialSection);
  const [period, setPeriod] = useState(0);
  const [segment, setSegment] = useState('Total');
  const [regionSegment, setRegionSegment] = useState('Total');
  const [regionSort, setRegionSort] = useState('rpk');
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [regionMessage, setRegionMessage] = useState('');
  const [domSort, setDomSort] = useState('rpk');
  const [selectedDomestic, setSelectedDomestic] = useState([]);
  const [routeGroup, setRouteGroupState] = useState('all');
  const [routeFocus, setRouteFocus] = useState('all');
  const [timeView, setTimeView] = useState('traffic');
  const [search, setSearch] = useState('');
  const [sortState, setSortState] = useState({});
  const [lab, setLab] = useState({ startPlf: 85, rpkGrowth: 4, askGrowth: 6 });

  // Like the original, normalise the URL hash on load (e.g. '' or '#bogus' -> '#start').
  useEffect(() => {
    window.history.replaceState(null, '', '#' + section);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (id) => {
    const next = validId(id);
    setSection(next);
    window.history.replaceState(null, '', '#' + next);
    window.scrollTo(0, 0);
  };

  const onSort = (id, key) =>
    setSortState((prev) => {
      const old = prev[id];
      return { ...prev, [id]: { key, dir: old?.key === key ? -old.dir : 1 } };
    });

  const toggleRegion = (name) => {
    const vals = selectedRegions.includes(name) ? selectedRegions.filter((n) => n !== name) : [...selectedRegions, name];
    if (vals.length > 3) {
      setRegionMessage('Select at most three regions. Clear one selection first.');
      return;
    }
    setSelectedRegions(vals);
    setRegionMessage(vals.length ? vals.length + ' regions selected.' : 'All six regions shown.');
  };
  const clearRegions = () => {
    setSelectedRegions([]);
    setRegionMessage('All six regions shown.');
  };
  const toggleDomestic = (name) =>
    setSelectedDomestic((cur) => (cur.includes(name) ? cur.filter((n) => n !== name) : [...cur, name]));

  const setRouteGroup = (g) => {
    setRouteGroupState(g);
    setRouteFocus('all');
  };

  const resetAll = () => {
    setPeriod(0);
    setSegment('Total');
    setRegionSegment('Total');
    setRegionSort('rpk');
    setDomSort('rpk');
    setSelectedRegions([]);
    setSelectedDomestic([]);
    setRegionMessage('');
    setRouteGroup('all');
    setTimeView('traffic');
    setSearch('');
    setSortState({});
  };

  const c = {
    go, period, setPeriod, segment, setSegment, sortState, onSort, resetAll,
    regionSegment, setRegionSegment, regionSort, setRegionSort, selectedRegions, toggleRegion, clearRegions, regionMessage,
    domSort, setDomSort, selectedDomestic, toggleDomestic,
    routeGroup, setRouteGroup, routeFocus, setRouteFocus,
    timeView, setTimeView, lab, setLab, search, setSearch,
  };

  // Every section stays mounted (just hidden) so lab values, filters and
  // workshop answers survive while you move around the dashboard.
  const pages = {
    start: <StartPage go={go} />,
    overview: <OverviewPage c={c} />,
    demand: <DemandPage c={c} />,
    regions: <RegionsPage c={c} />,
    domestic: <DomesticPage c={c} />,
    routes: <RoutesPage c={c} />,
    time: <TimePage c={c} />,
    lab: <LabPage c={c} />,
    workshop: <WorkshopPage />,
    sources: <SourcesPage c={c} />,
  };

  return (
    <>
      <a className="skip" href="#content">
        Skip to content
      </a>
      <aside>
        <AllCoursesLink current="market-lab" tone="dark" />
        <div className="brand">
          <small>AVIATION / MARKET INTELLIGENCE</small>
          <strong>
            Passenger
            <br />
            Market Lab
          </strong>
          <span>JULY 2025 · TEACHING EDITION</span>
        </div>
        <nav aria-label="Dashboard sections" id="nav">
          {SECTIONS.map(([id, name], i) => (
            <button key={id} data-go={id} onClick={() => go(id)} aria-current={section === id ? 'page' : 'false'}>
              <b>{String(i + 1).padStart(2, '0')}</b>
              {name}
            </button>
          ))}
        </nav>
        <div className="sidefoot">
          Read the evidence.
          <br />
          Explore the relationships.
          <br />
          Defend your decision.
          <br />
          <br />
          Source: IATA
          <br />
          Published 29 August 2025
        </div>
      </aside>
      <main id="content">
        <div className="topline">
          <span className="pill">Independent practice material</span>
          <span>Educational case study · July 2025 data</span>
        </div>
        <header className="mast">
          <div className="mast-copy">
            <div className="eyebrow">Educational case study · Historical July 2025 data</div>
            <h1>
              Air Passenger Market Analysis <span style={{ color: 'var(--teal)' }}>| July 2025</span>
            </h1>
            <div className="subtitle">Prepared by Dr. Bahtiyar Eren | Estonian Aviation Academy</div>
            <p className="small">Based on IATA’s report published 29 August 2025. This is a historical learning resource, not current market analysis.</p>
          </div>
          <img className="eava-logo" src={logo} alt="Eesti Lennuakadeemia — Estonian Aviation Academy" width="447" height="447" />
        </header>
        {SECTIONS.map(([id]) => (
          <section key={id} className="page" id={id} hidden={section !== id}>
            {pages[id]}
          </section>
        ))}
        <footer className="footer">
          IATA source data · Independent educational interpretation · July 2025 historical snapshot
          <br />
          Prepared by Dr. Bahtiyar Eren | Estonian Aviation Academy
        </footer>
      </main>
    </>
  );
}
