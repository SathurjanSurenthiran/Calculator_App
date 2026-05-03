import './styles/Histroy.css';

/**
 * History component — displays the last N calculations.
 */
const History = ({ entries, onClear }) => {
  return (
    <div className="calc-history">
      <div className="calc-history__header">
        <span className="calc-history__title">History</span>
        {entries.length > 0 && (
          <button className="calc-history__clear-btn" onClick={onClear} title="Clear history">
            Clear
          </button>
        )}
      </div>

      <div className="calc-history__list">
        {entries.length === 0 ? (
          <div className="calc-history__empty">No calculations yet</div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className={`calc-history__item ${!entry.success ? 'calc-history__item--error' : ''}`}
            >
              <span className="calc-history__expr">{entry.expression}</span>
              <span className="calc-history__time">{entry.timestamp}</span>
              {!entry.success && (
                <span className="calc-history__err-msg">{entry.errorMessage}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
