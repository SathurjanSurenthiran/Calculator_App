import './styles/Display.css';

/**
 * Display component — shows the current expression and input value.
 */
const Display = ({ expression, value, isLoading, error }) => {
  // Dynamically shrink font for long numbers
  const len = String(value).length;
  const fontSize = len > 10 ? '2rem' : len > 7 ? '2.8rem' : '3.6rem';

  return (
    <div className={`calc-display ${error ? 'calc-display--error' : ''}`}>
      {/* Expression / history line */}
      <div className="calc-display__expression">
        {expression || '\u00A0'}
      </div>

      {/* Main value */}
      <div
        className={`calc-display__value ${isLoading ? 'calc-display__value--loading' : ''}`}
        style={{ fontSize }}
        aria-live="polite"
        aria-atomic="true"
      >
        {isLoading ? '…' : (error ? 'Error' : value)}
      </div>
    </div>
  );
};

export default Display;
