import { useMemo, useState } from 'react';

// One illustrative flight. Simple numbers so students can check them by hand.
const SEATS = 180; // a typical A320-size cabin: 30 rows × 6 seats
const ROWS = 30;
const DISTANCE_KM = 1000;
const CASK = 0.07; // € operating cost per available seat-km (close to the KPI course's sample)
const ASK = SEATS * DISTANCE_KM;
const COST = Math.round(ASK * CASK); // €12,600 for the whole flight (rounded: 180000 × 0.07 is not exact in floating point)

const eur = (v) => '€' + Math.round(v).toLocaleString('en-GB');
const num = (v) => Math.round(v).toLocaleString('en-GB');
const pct = (v) => (v * 100).toFixed(1) + '%';

// Fixed "random" boarding order, so seats fill in a natural scattered way.
const BOARDING_ORDER = (() => {
  const order = Array.from({ length: SEATS }, (_, i) => i);
  let seed = 7;
  for (let i = order.length - 1; i > 0; i -= 1) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
})();

function Cabin({ pax }) {
  const taken = useMemo(() => new Set(BOARDING_ORDER.slice(0, pax)), [pax]);
  // Seat index = side block (0: A–C, 1: D–F) * 90 + seat letter * 30 + row.
  const block = (b) => (
    <div className="cabin__block">
      {Array.from({ length: 3 * ROWS }, (_, k) => {
        const idx = b * 3 * ROWS + k;
        return <span key={idx} className={`seat ${taken.has(idx) ? 'is-taken' : ''}`} />;
      })}
    </div>
  );
  return (
    <div className="cabin" role="img" aria-label={`${pax} of ${SEATS} seats occupied`}>
      <span className="cabin__nose" aria-hidden="true" />
      <div className="cabin__body">
        {block(0)}
        <div className="cabin__aisle" aria-hidden="true" />
        {block(1)}
      </div>
      <span className="cabin__tail" aria-hidden="true" />
    </div>
  );
}

export default function LoadFactorLab() {
  const [pax, setPax] = useState(144);
  const [fare, setFare] = useState(90);

  const rpk = pax * DISTANCE_KM;
  const plf = rpk / ASK;
  const revenue = pax * fare;
  const profit = revenue - COST;
  const breakEvenPax = Math.ceil(COST / fare);
  const belf = COST / fare / SEATS; // break-even load factor = CASK ÷ yield
  const yieldPerKm = fare / DISTANCE_KM;
  const profitable = profit >= 0;

  return (
    <div className="lab">
      <div className="lab__controls">
        <Cabin pax={pax} />

        <div className="lab__sliders">
          <label className="slider">
            <span>
              Passengers on board <b>{pax}</b> <small>of {SEATS} seats</small>
            </span>
            <input type="range" min="0" max={SEATS} value={pax} onChange={(e) => setPax(Number(e.target.value))} />
          </label>
          <label className="slider">
            <span>
              Average fare <b>{eur(fare)}</b> <small>per passenger, {num(DISTANCE_KM)} km flight</small>
            </span>
            <input type="range" min="40" max="160" step="5" value={fare} onChange={(e) => setFare(Number(e.target.value))} />
          </label>
        </div>

        <div className="gauge" aria-hidden="true">
          <div className="gauge__fill" style={{ width: `${plf * 100}%` }} />
          {belf <= 1 && (
            <div className="gauge__mark" style={{ left: `${belf * 100}%` }}>
              <span>break-even {pct(belf)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="lab__results" aria-live="polite">
        <dl className="lab__nums">
          <div>
            <dt>ASK <small>seats × km</small></dt>
            <dd>{num(ASK)}</dd>
          </div>
          <div>
            <dt>RPK <small>passengers × km</small></dt>
            <dd>{num(rpk)}</dd>
          </div>
          <div className="is-key">
            <dt>PLF <small>RPK ÷ ASK</small></dt>
            <dd>{pct(plf)}</dd>
          </div>
          <div>
            <dt>Cost <small>ASK × CASK €{CASK}</small></dt>
            <dd>{eur(COST)}</dd>
          </div>
          <div>
            <dt>Revenue <small>passengers × fare</small></dt>
            <dd>{eur(revenue)}</dd>
          </div>
          <div className={profitable ? 'is-good' : 'is-bad'}>
            <dt>Result <small>revenue − cost</small></dt>
            <dd>
              {profit >= 0 ? '+' : '−'}
              {eur(Math.abs(profit))}
            </dd>
          </div>
        </dl>

        <p className={`lab__verdict ${profitable ? 'is-good' : 'is-bad'}`}>
          {belf > 1
            ? `At ${eur(fare)} even a full aircraft loses money: break-even needs ${breakEvenPax} passengers but there are only ${SEATS} seats.`
            : profitable
              ? `Profitable. You needed ${breakEvenPax} passengers (${pct(belf)} load factor) to cover costs; every extra passenger adds ${eur(fare)}.`
              : `Loss-making. ${breakEvenPax - pax} more passenger${breakEvenPax - pax === 1 ? '' : 's'} needed to break even at ${pct(belf)} load factor.`}
        </p>
        <p className="lab__insight">
          <b>The intuition:</b> break-even load factor = CASK ÷ yield ({CASK.toFixed(2)} ÷ {yieldPerKm.toFixed(3)}). Lower the
          fare and the plane must be fuller just to break even. That is why a high PLF on its own does not prove an airline is
          profitable.
        </p>
        <p className="lab__small">Simplified model: one flight, passenger revenue only, illustrative numbers.</p>
      </div>
    </div>
  );
}
