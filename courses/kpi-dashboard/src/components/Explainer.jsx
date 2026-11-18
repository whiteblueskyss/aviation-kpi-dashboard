import { TERM_LABELS } from '../kpi/metrics.js';
import { formatMetric, formatNumber, whyUnavailable } from '../kpi/format.js';

function termText(value) {
  if (value == null) return 'n/a';
  const decimals = Number.isInteger(value) ? 0 : Math.abs(value) >= 1000 ? 0 : Math.abs(value) >= 10 ? 1 : 4;
  return formatNumber(value, decimals);
}

const KIND_NOTE = {
  flow: 'This is a flow: it covers a period, so totals are added up across the months you select.',
  stock: 'This is a stock (a balance at a point in time): the last selected month is used. Never add months together.',
  count: 'This is a count: it grows with airline size and period length. Compare it with a rate before judging performance.',
};

export default function Explainer({ metric, result }) {
  const ok = result.status === 'ok';
  const hasDen = Boolean(metric.den);

  return (
    <section className="panel explainer" aria-live="polite">
      <h2>Understand this KPI</h2>
      <h3>{metric.label}</h3>
      <p>{metric.short}</p>
      <p className="formula">{metric.formula}</p>
      <p>{metric.meaning}</p>
      <p className="caution"><strong>Careful:</strong> {metric.caution}</p>
      <p className="result">
        Selected result: <strong>{formatMetric(metric, result.value)}</strong>
        {!ok && <span className="note"> — {whyUnavailable(result.status)}</span>}
      </p>

      <details>
        <summary>Worked example &amp; practice</summary>
        <div className="worked">
          <p>Using your current filters, the numbers behind this KPI are:</p>
          <ul>
            <li>
              {TERM_LABELS[metric.num]}: <strong>{termText(result.num)}</strong>
            </li>
            {hasDen && (
              <li>
                {TERM_LABELS[metric.den]}: <strong>{termText(result.den)}</strong>
              </li>
            )}
          </ul>
          {ok && hasDen && (
            <p className="formula">
              {termText(result.num)} ÷ {termText(result.den)}
              {metric.scale !== 1 ? ` × ${formatNumber(metric.scale, 0)}` : ''} = {formatMetric(metric, result.value)}
            </p>
          )}
          <p className="note">{KIND_NOTE[metric.kind]}</p>
          <p>
            <strong>Practice:</strong> before changing a filter, predict whether this KPI will go up or down, and why.
            Then change the filter and check your prediction. Ask yourself what the base of this KPI is.
          </p>
        </div>
      </details>
    </section>
  );
}
