export default function StartPage({ go }) {
  return (
    <>
      <div className="card hero">
        <div className="eyebrow">01 / Learning journey</div>
        <h2>
          From market indicators
          <br />
          to informed decisions.
        </h2>
        <p>Explore demand, capacity and utilisation. Then test a capacity scenario and build an evidence-based recommendation.</p>
        <div className="flow">
          <span>01 Read</span>
          <span>02 Compare</span>
          <span>03 Experiment</span>
          <span>04 Explain</span>
        </div>
        <button className="primary" onClick={() => go('overview')}>
          Explore the July market →
        </button>
        <svg viewBox="0 0 300 220" aria-hidden="true">
          <path d="M10 190Q150 -60 290 90M10 190Q150 70 290 90M10 190L290 90" fill="none" stroke="white" strokeWidth="3"></path>
          <circle cx="10" cy="190" r="9" fill="white"></circle>
          <circle cx="290" cy="90" r="9" fill="white"></circle>
        </svg>
      </div>
      <div className="grid">
        <div className="card">
          <h3>What you will be able to do</h3>
          <ol className="outcomes">
            <li>Explain RPK, ASK and PLF.</li>
            <li>Compare demand, capacity and utilisation.</li>
            <li>Distinguish growth, size and contribution.</li>
            <li>Calculate a scenario’s effect on load factor.</li>
            <li>Support a recommendation with evidence and limitations.</li>
          </ol>
          <p className="small">Undergraduate level · Basic percentages assumed</p>
        </div>
        <div className="card">
          <h3>Your route through the dashboard</h3>
          <p>Begin with the global overview, compare markets, and then use the laboratory and workshop.</p>
          <p>
            <b>Suggested learning time: 43–65 minutes.</b>
            <br />
            Explore: 15–20 min · Laboratory: 8–12 min · Workshop: 20–33 min.
          </p>
          <p className="small">Timings are flexible guides; take additional time where needed.</p>
          <p className="small">
            The interactive features run in your browser. Your responses remain in this open page only and are cleared when it reloads. No account, tracking or submission service.
          </p>
        </div>
      </div>
      <h3>Metric glossary</h3>
      <details>
        <summary>RPK — Revenue Passenger Kilometres · demand</summary>
        <p>
          Sum of revenue passengers carried multiplied by the distance travelled on each sector. A revenue passenger travelling 1,000 km contributes 1,000 RPK. RPK measures distance-weighted traffic, not the number of passengers.
        </p>
      </details>
      <details>
        <summary>ASK — Available Seat Kilometres · capacity</summary>
        <p>
          Sum of available passenger seats multiplied by sector distance. An aircraft offering 180 seats over 1,000 km provides 180,000 ASK. Flight counts alone do not measure ASK: aircraft size and distance also matter.
        </p>
      </details>
      <details>
        <summary>PLF — Passenger Load Factor · utilisation</summary>
        <p>PLF = RPK ÷ ASK × 100. It describes the proportion of available seat-kilometres used by revenue passengers. A high PLF alone does not establish profitability.</p>
      </details>
      <details>
        <summary>Percent, percentage points and comparison periods</summary>
        <p>
          A PLF increase from 80% to 84% is 4 percentage points, or a 5% relative increase. July YoY compares July 2025 with July 2024. YTD compares January–July 2025 with January–July 2024; it is not an average of monthly growth rates.
        </p>
      </details>
    </>
  );
}
