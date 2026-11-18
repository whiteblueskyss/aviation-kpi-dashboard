import { TIME_INDICATORS as T } from '../data/timeIndicators';
import { fmt } from '../lib/format';

const INTRO = {
  traffic: 'June and July growth rates compare each month with the same month a year earlier. A change in YoY growth is not month-on-month traffic growth.',
  schedule: 'August and September are forward-looking schedules as described in this report. They are not realised outcomes, and are not current forecasts. July is also a scheduled-flight measure, not a count of flights actually operated.',
  adjusted: 'The actual traffic level and growth measures are distinct from seasonally adjusted measures. Do not substitute seasonally adjusted YoY growth for unadjusted YoY growth.',
};

export default function TimePage({ c }) {
  const { timeView, setTimeView } = c;
  const rows = timeView === 'traffic' ? T.slice(0, 6) : timeView === 'schedule' ? T.slice(6, 9) : T.slice(9);
  return (
    <>
      <div className="eyebrow">07 / Time and outlook</div>
      <h2>Keep the comparison basis visible</h2>
      <p className="subtitle">Historical snapshot as published on 29 August 2025</p>
      <div className="controls">
        <label>
          View
          <select id="timeView" value={timeView} onChange={(e) => setTimeView(e.target.value)}>
            <option value="traffic">Observed RPK growth</option>
            <option value="schedule">Scheduled flights and outlook</option>
            <option value="adjusted">Actual and seasonally adjusted</option>
          </select>
        </label>
      </div>
      <div id="timeContent">
        <div className="note">{INTRO[timeView]}</div>
        <div className="tablewrap">
          <table>
            <caption>Explicitly stated values only · IATA July 2025 report</caption>
            <thead>
              <tr>
                <th>Indicator</th>
                <th>Period</th>
                <th>Value</th>
                <th>Basis</th>
                <th>Status</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>
                    {fmt(r[2])} {r[3]}
                  </td>
                  <td>{r[4]}</td>
                  <td>{r[5]}</td>
                  <td>{r[6]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="note">
        This single report does not provide a complete numerical monthly database. No values have been estimated from unlabelled chart bars. Scheduled flight counts do not measure ASK, which also depends on seats and distance.
      </div>
    </>
  );
}
