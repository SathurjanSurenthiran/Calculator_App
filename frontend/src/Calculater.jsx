import { useState } from 'react';
import Display from './Display';
import Button from './Button';
import History from './Histroy';
import { useCalculator } from './useCalculater';
import './styles/Calculater.css';

/**
 * Root Calculator component.
 * Wires together Display, Button grid, and History panel.
 */
const Calculator = ({ theme, onThemeToggle }) => {
  const {
    display, expression, history, isLoading, error,
    inputDigit, inputOperator, handleEquals,
    toggleSign, backspace, reset, handleClearHistory,
    activeOperator,
  } = useCalculator();

  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="calc-wrapper">
      {/* ── Header ── */}
      <div className="calc-header">
        <span className="calc-header__logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="3"/>
            <line x1="8" y1="6" x2="16" y2="6"/>
            <line x1="8" y1="10" x2="10" y2="10"/>
            <line x1="14" y1="10" x2="16" y2="10"/>
            <line x1="8" y1="14" x2="10" y2="14"/>
            <line x1="14" y1="14" x2="16" y2="14"/>
            <line x1="8" y1="18" x2="10" y2="18"/>
            <line x1="14" y1="18" x2="16" y2="18"/>
          </svg>
          CalcPro
        </span>
        <div className="calc-header__actions">
          <button
            className={`icon-btn ${showHistory ? 'icon-btn--active' : ''}`}
            onClick={() => setShowHistory(h => !h)}
            title="Toggle history"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
            </svg>
          </button>
          <button
            className="icon-btn"
            onClick={onThemeToggle}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="calc-body">
        {/* ── Main Calculator ── */}
        <div className="calc-main">
          {/* Display */}
          <Display
            expression={expression}
            value={display}
            isLoading={isLoading}
            error={error}
          />

          {/* Error banner */}
          {error && (
            <div className="calc-error-banner">{error}</div>
          )}

          {/* Button Grid */}
          <div className="calc-grid">
            {/* Row 1 */}
            <Button label="C"  variant="action"   onClick={reset} />
            <Button label="+/−" variant="action"  onClick={toggleSign} />
            <Button label="%"  variant="operator" onClick={() => inputOperator('%')} active={activeOperator === '%'} />
            <Button label="÷"  variant="operator" onClick={() => inputOperator('/')} active={activeOperator === '/'} />

            {/* Row 2 */}
            <Button label="7" onClick={() => inputDigit('7')} />
            <Button label="8" onClick={() => inputDigit('8')} />
            <Button label="9" onClick={() => inputDigit('9')} />
            <Button label="×" variant="operator" onClick={() => inputOperator('*')} active={activeOperator === '*'} />

            {/* Row 3 */}
            <Button label="4" onClick={() => inputDigit('4')} />
            <Button label="5" onClick={() => inputDigit('5')} />
            <Button label="6" onClick={() => inputDigit('6')} />
            <Button label="−" variant="operator" onClick={() => inputOperator('-')} active={activeOperator === '-'} />

            {/* Row 4 */}
            <Button label="1" onClick={() => inputDigit('1')} />
            <Button label="2" onClick={() => inputDigit('2')} />
            <Button label="3" onClick={() => inputDigit('3')} />
            <Button label="+" variant="operator" onClick={() => inputOperator('+')} active={activeOperator === '+'} />

            {/* Row 5 */}
            <Button label="⌫" variant="action" onClick={backspace} />
            <Button label="0" onClick={() => inputDigit('0')} />
            <Button label="." onClick={() => inputDigit('.')} />
            <Button label="=" variant="equals" onClick={handleEquals} disabled={isLoading} />
          </div>

          {/* <p className="calc-hint">Tip: Keyboard input is supported ⌨️</p> */}
        </div>

        {/* ── History Panel ── */}
        {showHistory && (
          <History
            entries={history}
            onClear={handleClearHistory}
          />
        )}
      </div>
    </div>
  );
};

export default Calculator;
