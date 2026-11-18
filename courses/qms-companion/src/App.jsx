import { useState } from 'react';
import { MODULES } from './data/modules';
import { NOTICE } from './lib/constants';
import { loadProgress, saveProgress } from './lib/storage';
import {
  QUIZ,
  answeredCount,
  attemptsLeft,
  buildAttempt,
  loadRecord,
  saveRecord,
  scoreAttempt,
} from './lib/quiz';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ConfirmDialog from './components/ConfirmDialog';
import StudyModules from './pages/StudyModules';
import ModulePage from './pages/ModulePage';
import QuizPage from './pages/QuizPage';
import PracticePage from './pages/PracticePage';
import SourcesPage from './pages/SourcesPage';
import FeedbackPage from './pages/FeedbackPage';

const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
// Run after React has committed the state update that triggered it.
const afterRender = (fn) => setTimeout(fn, 0);

export default function App() {
  const [page, setPage] = useState('before');
  const [mod, setMod] = useState(0);
  const [stage, setStage] = useState(0);
  const [openSec, setOpenSec] = useState(0);
  const [srcFilter, setSrcFilterState] = useState('All');
  const [progress, setProgress] = useState(loadProgress);
  const [lcState, setLcState] = useState({});
  const [confirm, setConfirm] = useState(null);

  // Readiness-assessment state (kept while you navigate elsewhere, like the original)
  const [record, setRecord] = useState(loadRecord);
  const [selected, setSelected] = useState([]);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(0);

  const ask = (message, yesLabel, onYes) => setConfirm({ message, yesLabel, onYes });

  // ---- navigation ----
  const nav = (p) => {
    setPage(p);
    scrollTop();
  };

  const updateProgress = (fn) =>
    setProgress((prev) => {
      const next = fn(JSON.parse(JSON.stringify(prev)));
      saveProgress(next);
      return next;
    });

  const markDone = (p, mi, si) => {
    const d = (p.done[mi] = p.done[mi] || []);
    if (!d.includes(si)) d.push(si);
  };

  const openModule = (mi, si = 0) => {
    setPage('module');
    setMod(mi);
    setStage(si);
    setOpenSec(0);
    updateProgress((p) => ({ ...p, last: { mod: mi, stage: si } }));
    scrollTop();
  };

  const goStage = (si) => {
    if (si === stage) return;
    const next = Math.max(0, Math.min(5, si));
    updateProgress((p) => {
      markDone(p, mod, stage);
      p.last = { mod, stage: next };
      return p;
    });
    setStage(next);
    afterRender(() => document.getElementById('pageTitle')?.scrollIntoView({ behavior: 'smooth' }));
  };

  const finishModule = () => {
    updateProgress((p) => {
      markDone(p, mod, 5);
      p.last = mod < 3 ? { mod: mod + 1, stage: 0 } : null;
      return p;
    });
    if (mod < 3) openModule(mod + 1, 0);
    else nav('quiz');
  };

  const toggleSec = (j) => {
    setOpenSec((cur) => (cur === j ? -1 : j));
    afterRender(() => document.getElementById('sec-' + j)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
  };

  const goSources = (mi) => {
    setSrcFilterState('M' + (mi + 1));
    nav('sources');
  };

  // ---- learning-check (per-module self-check) ----
  const lc = {
    state: lcState,
    pick: (key, val) => setLcState((s) => ({ ...s, [key]: { sel: val, checked: false } })),
    check: (key) => setLcState((s) => ({ ...s, [key]: { ...(s[key] || {}), checked: true } })),
    toggle: (key) => setLcState((s) => ({ ...s, [key]: { ...(s[key] || {}), show: !(s[key] || {}).show } })),
  };

  // ---- readiness assessment ----
  const startQuiz = () => {
    if (record.passed || attemptsLeft(record) === 0) return;
    ask(
      'This starts attempt ' + (record.attempts + 1) + ' of ' + QUIZ.maxAttempts + '. An attempt counts once it has started, even if you leave it.',
      'Start attempt',
      () => {
        const { selected: sel, nextRecord } = buildAttempt(record);
        setSelected(sel);
        setResponses({});
        setSubmitted(false);
        setResult(null);
        setRecord(nextRecord);
        saveRecord(nextRecord);
        setAttempt(nextRecord.attempts);
      }
    );
  };

  const choose = (i, val) => setResponses((r) => ({ ...r, [i]: val }));
  const chooseMatch = (i, j, val) =>
    setResponses((r) => {
      const v = { ...(r[i] || {}) };
      if (val === '') delete v[j];
      else v[j] = Number(val);
      return { ...r, [i]: v };
    });

  const submitQuiz = () => {
    const doSubmit = () => {
      const out = scoreAttempt(selected, responses, record);
      setSelected(out.selected);
      setResult(out.result);
      setSubmitted(true);
      setRecord(out.record);
      saveRecord(out.record);
      afterRender(() => document.getElementById('view')?.scrollIntoView({ behavior: 'smooth' }));
    };
    const unanswered = selected.length - answeredCount(selected, responses);
    if (unanswered) ask('You have ' + unanswered + ' unanswered or incomplete questions. Submit anyway?', 'Submit anyway', doSubmit);
    else doSubmit();
  };

  const exitQuiz = () => {
    const leave = () => {
      setSelected([]);
      setResponses({});
      setSubmitted(false);
      setResult(null);
    };
    if (selected.length && !submitted)
      ask('Leave this attempt? It still counts as one of your ' + QUIZ.maxAttempts + ' attempts.', 'Leave attempt', leave);
    else leave();
  };

  // ---- page chrome ----
  let crumb = 'CAM.104';
  let title = '';
  let view = null;
  if (page === 'before') {
    crumb = 'CAM.104 · INDEPENDENT STUDY';
    title = 'Study modules';
    view = <StudyModules progress={progress} record={record} openModule={openModule} nav={nav} />;
  } else if (page === 'module') {
    crumb = 'CAM.104 · MODULE ' + (mod + 1) + ' · 45 MINUTES';
    title = MODULES[mod].title;
    view = (
      <ModulePage
        mod={mod}
        stage={stage}
        progress={progress}
        openSec={openSec}
        toggleSec={toggleSec}
        goStage={goStage}
        finishModule={finishModule}
        nav={nav}
        goSources={goSources}
        lc={lc}
      />
    );
  } else if (page === 'quiz') {
    crumb = 'CAM.104 · FORMATIVE';
    title = 'QMS Readiness Assessment';
    view = (
      <QuizPage
        record={record}
        selected={selected}
        responses={responses}
        submitted={submitted}
        result={result}
        attempt={attempt}
        nav={nav}
        startQuiz={startQuiz}
        submitQuiz={submitQuiz}
        exitQuiz={exitQuiz}
        choose={choose}
        chooseMatch={chooseMatch}
        openModule={openModule}
      />
    );
  } else if (page === 'practice') {
    crumb = 'CAM.104 · WRITTEN PRACTICE';
    title = 'Written practice (not scored)';
    view = <PracticePage />;
  } else if (page === 'feedback') {
    crumb = 'CAM.104 · STUDENT EXPERIENCE';
    title = 'Feedback on the QMS Study Companion';
  } else if (page === 'sources') {
    title = 'Sources & AI Disclosure';
    view = <SourcesPage srcFilter={srcFilter} setSrcFilter={setSrcFilterState} />;
  }

  return (
    <>
      <Header />
      <div className="container">
        <Sidebar page={page} nav={nav} />
        <main className="main">
          <div className="toprow">
            <span id="crumb" className="eyebrow">
              {crumb}
            </span>
            <span className="status">Formative self-study</span>
          </div>
          <h2 id="pageTitle">{title}</h2>
          <div id="view">{view}</div>
          <FeedbackPage hidden={page !== 'feedback'} />
          <footer className="foot">
            Prepared for teaching and learning in CAM.104 at the Estonian Aviation Academy.
            <span className="notice">{NOTICE}</span>
          </footer>
        </main>
      </div>
      {confirm && (
        <ConfirmDialog
          message={confirm.message}
          yesLabel={confirm.yesLabel}
          onCancel={() => setConfirm(null)}
          onYes={() => {
            const fn = confirm.onYes;
            setConfirm(null);
            fn();
          }}
        />
      )}
    </>
  );
}
