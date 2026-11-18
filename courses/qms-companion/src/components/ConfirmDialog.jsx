import { useEffect, useRef } from 'react';

/** In-page replacement for window.confirm (alertdialog, Esc to cancel). */
export default function ConfirmDialog({ message, yesLabel, onYes, onCancel }) {
  const yes = useRef(null);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    yes.current && yes.current.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);
  return (
    <div id="in-page-confirm" className="ipc-back">
      <div className="ipc" role="alertdialog" aria-modal="true" aria-labelledby="ipc-msg">
        <p id="ipc-msg">{message}</p>
        <div className="row">
          <button type="button" className="btn primary" id="ipc-yes" ref={yes} onClick={onYes}>
            {yesLabel}
          </button>
          <button type="button" className="btn" id="ipc-no" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
