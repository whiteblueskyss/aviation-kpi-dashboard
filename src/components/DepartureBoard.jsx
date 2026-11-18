import { useEffect, useState } from 'react';
import { COURSES } from '../courses.js';
import { useReducedMotion } from '../lib/motion.js';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/** Split-flap style text: letters shuffle briefly, then settle on the real value. */
function FlapText({ text, delay = 0 }) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (reduced) {
      setShown(text);
      return undefined;
    }
    const steps = 16;
    let step = 0;
    let timer;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        step += 1;
        const settled = Math.floor((step / steps) * text.length);
        setShown(
          [...text]
            .map((ch, i) => (i < settled || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
            .join(''),
        );
        if (step >= steps) {
          clearInterval(timer);
          setShown(text);
        }
      }, 40);
    }, delay);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [text, delay, reduced]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </>
  );
}

function useClock() {
  const fmt = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function DepartureBoard() {
  const time = useClock();
  return (
    <section className="board" aria-label="Course departures board">
      <header className="board__head">
        <span className="board__title">
          <span aria-hidden="true">✈</span> Departures
        </span>
        <span className="board__clock" aria-label={`Local time ${time}`}>{time}</span>
      </header>
      <div className="board__cols" aria-hidden="true">
        <span>Flight</span>
        <span>Course</span>
        <span className="board__opt">Gate</span>
        <span>Status</span>
      </div>
      <ol className="board__rows">
        {COURSES.map((c, i) => (
          <li key={c.slug}>
            <a className="board__row" href={c.href}>
              <span className="board__flight">{c.flight}</span>
              <span className="board__course">
                <FlapText text={c.title.toUpperCase()} delay={250 + i * 220} />
                <small>{c.duration} · {c.level}</small>
              </span>
              <span className="board__gate board__opt">{c.gate}</span>
              <span className={`board__status ${i === 0 ? 'is-boarding' : ''}`}>
                {i === 0 ? 'Boarding' : 'On time'}
              </span>
            </a>
          </li>
        ))}
      </ol>
      <p className="board__foot">Pick any flight. Each course works on its own.</p>
    </section>
  );
}
