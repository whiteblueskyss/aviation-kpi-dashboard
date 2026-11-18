import { fmt, sign } from '../lib/format';

const PRESETS = { demand: [85, 8, 4], capacity: [85, 4, 8], fall: [85, -3, 2], reset: [85, 4, 6] };

export default function LabPage({ c }) {
  const { lab, setLab } = c;
  const s = lab.startPlf, r = lab.rpkGrowth, a = lab.askGrowth;
  const n = (s * (1 + r / 100)) / (1 + a / 100);
  const change = n - s;
  const explanation =
    n > 100
      ? 'Infeasible under these assumptions: required RPK exceeds available ASK. Increase capacity or reduce the assumed traffic.'
      : change > 0
      ? 'Demand grows faster than capacity, increasing utilisation. This alone does not establish improved profitability.'
      : change < 0
      ? 'Capacity grows faster than demand, reducing utilisation. Investigate fares, costs and route mix before deciding.'
      : 'Demand and capacity change at the same rate, leaving utilisation unchanged.';
  const preset = (key) => {
    const v = PRESETS[key];
    setLab({ startPlf: v[0], rpkGrowth: v[1], askGrowth: v[2] });
  };
  const slider = (id, key, label, out, min, max) => (
    <div className="slider">
      <label htmlFor={id}>
        {label} <output id={id.replace(/(Plf|Growth)$/, '') + 'Val'}>{out}</output>
      </label>
      <input id={id} type="range" min={min} max={max} step=".1" value={lab[key]} onChange={(e) => setLab({ ...lab, [key]: +e.target.value })} />
    </div>
  );
  return (
    <>
      <div className="eyebrow">08 / Load factor laboratory</div>
      <h2>What happens when capacity changes?</h2>
      <p className="subtitle">Illustrative scenario, not an IATA forecast · Suggested learning time: 8–12 min</p>
      <div className="controls">
        <button onClick={() => preset('demand')}>Demand grows faster</button>
        <button onClick={() => preset('capacity')}>Capacity grows faster</button>
        <button onClick={() => preset('fall')}>Demand falls</button>
        <button onClick={() => preset('reset')}>Reset laboratory</button>
      </div>
      <div className="grid">
        <div className="card">
          <h3>Set your assumptions</h3>
          {slider('startPlf', 'startPlf', 'Starting PLF', fmt(s, '%'), 30, 100)}
          {slider('rpkGrowth', 'rpkGrowth', 'RPK growth', sign(r) + '%', -50, 50)}
          {slider('askGrowth', 'askGrowth', 'ASK growth', sign(a) + '%', -50, 50)}
          <div className="formula">New PLF = starting PLF × (1 + RPK growth / 100) ÷ (1 + ASK growth / 100)</div>
          <p className="small">Assumes comparable periods, market coverage and definitions. Growth rates are independent inputs; the model does not simulate prices or demand responses.</p>
        </div>
        <div className="card" aria-live="polite">
          <h3>Resulting passenger load factor</h3>
          <div id="labValue" className="labresult">
            {n.toFixed(2)}%
          </div>
          <div className="meter" aria-hidden="true">
            <div id="labMeter" style={{ width: Math.max(0, Math.min(100, n)) + '%' }}></div>
          </div>
          <p id="labDelta">
            {'PLF change: ' + (change > 0 ? '+' : '') + change.toFixed(2) + ' pp  |  Growth gap: ' + sign(r - a) + ' pp'}
          </p>
          <div id="labExplanation" className={'note' + (n > 100 ? ' warn' : '')}>
            {explanation}
          </div>
          <div id="labFormula" className="formula">
            {`${s.toFixed(1)} × ${(1 + r / 100).toFixed(3)} ÷ ${(1 + a / 100).toFixed(3)} = ${n.toFixed(2)}%`}
          </div>
          <p className="small">The visual meter ends at 100%; the numerical result is never capped.</p>
        </div>
      </div>
      <details>
        <summary>Why doesn’t the growth gap equal the PLF change?</summary>
        <p>
          Starting at 85%, demand growth of 4% and capacity growth of 6% produces 85 × 1.04 ÷ 1.06 = 83.40%. PLF falls by about 1.60 percentage points. The growth gap is −2.0 percentage points. One compares growth rates; the other measures the change in a ratio.
        </p>
      </details>
    </>
  );
}
