import { useState } from 'react';

const MODULE_LABELS = [
  'Module 1 · Introduction to aviation quality management',
  'Module 2 · Quality management principles and methodologies',
  'Module 3 · Compliance monitoring and auditing fundamentals',
  'Module 4 · Just Culture and organisational learning',
];
const EASE = ['1 · Very difficult', '2 · Difficult', '3 · Neither easy nor difficult', '4 · Easy', '5 · Very easy'];

/** Always mounted (hidden off-page) so a half-written response survives navigation. */
export default function FeedbackPage({ hidden }) {
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const offline = window.location.protocol === 'file:';

  const onSubmit = async (e) => {
    e.preventDefault();
    if (offline) return;
    const f = e.currentTarget;
    setSending(true);
    setStatus('Sending…');
    try {
      // Netlify Forms: posts url-encoded fields back to the site root.
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(f)).toString(),
      });
      if (!res.ok) throw new Error(res.status);
      f.reset();
      setStatus('Thank you. Your feedback has been sent.');
    } catch (err) {
      setStatus('Sorry, the feedback could not be sent. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section hidden={hidden} id="feedback-panel" className="panel">
      <p>How well did the companion support your independent study? You can respond after any module. Participation is optional and has no effect on your grade.</p>
      <p>
        <strong>About 1 minute.</strong> The form asks for no name or email. Please leave identifying details out of comments.
      </p>
      <form name="cam104-companion-feedback" method="POST" data-netlify="true" netlify-honeypot="bot-field" id="companion-feedback" onSubmit={onSubmit}>
        <input type="hidden" name="form-name" value="cam104-companion-feedback" />
        <p hidden>
          <label>
            Leave empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
          </label>
        </p>
        <fieldset>
          <legend>1. Which modules did you study? (Select all that apply.)</legend>
          {MODULE_LABELS.map((l, i) => (
            <label key={i}>
              <input type="checkbox" name={'module-' + (i + 1)} value="Studied" /> {l}
            </label>
          ))}
        </fieldset>
        <label htmlFor="feedback-ease">
          <b>2. How easy was it to follow the activities on your own?</b>
        </label>
        <select required name="ease" id="feedback-ease" defaultValue="">
          <option value="">Select a rating…</option>
          {EASE.map((t, i) => (
            <option key={i} value={String(i + 1)}>
              {t}
            </option>
          ))}
        </select>
        <label htmlFor="feedback-comment">
          <b>3. What one change would make the companion more useful?</b> (Optional)
        </label>
        <textarea id="feedback-comment" name="suggestion" rows={3} maxLength={2000} placeholder="Mention a module or exercise if relevant."></textarea>
        <p id="feedback-status" role="status" aria-live="polite">
          {status}
        </p>
        <p id="feedback-local" hidden={!offline}>
          Local preview · Open the published course website to send your feedback.
        </p>
        <button id="feedback-send" className="btn primary" type="submit" disabled={offline || sending}>
          Send feedback
        </button>
      </form>
    </section>
  );
}
