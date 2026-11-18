/** One course, presented as a boarding pass: main ticket on the left, tear-off stub on the right. */
export default function BoardingPass({ course: c, total }) {
  return (
    <article className="pass" style={{ '--accent': c.accent }} aria-labelledby={`pass-${c.slug}`}>
      <div className="pass__main">
        <header className="pass__head">
          <span>✈ Aviation Study · Boarding pass</span>
          <span>
            Course {c.leg} of {total}
          </span>
        </header>

        <div className="pass__route" aria-label={`From ${c.from.label} to ${c.to.label}`}>
          <div className="pass__port">
            <b>{c.from.code}</b>
            <small>{c.from.label}</small>
          </div>
          <div className="pass__path" aria-hidden="true">
            <span className="pass__dash" />
            <span className="pass__plane">✈</span>
            <span className="pass__dash" />
          </div>
          <div className="pass__port pass__port--to">
            <b>{c.to.code}</b>
            <small>{c.to.label}</small>
          </div>
        </div>

        <h3 id={`pass-${c.slug}`}>{c.title}</h3>
        <p className="pass__sub">{c.subtitle}</p>
        <p className="pass__pitch">{c.pitch}</p>

        <p className="pass__label">After this course you can</p>
        <ul className="pass__learn">
          {c.learn.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>

        <dl className="pass__fields">
          <div>
            <dt>Flight</dt>
            <dd>{c.flight}</dd>
          </div>
          <div>
            <dt>Gate</dt>
            <dd>{c.gate}</dd>
          </div>
          <div>
            <dt>Level</dt>
            <dd>{c.level}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>{c.duration}</dd>
          </div>
        </dl>
      </div>

      <div className="pass__stub">
        <p className="pass__label">On board</p>
        <ul className="pass__facts">
          {c.facts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <p className="pass__saves">{c.saves}</p>
        <div className="pass__barcode" aria-hidden="true" />
        <a className="btn btn--board" href={c.href}>
          Board course {c.leg} <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}
