import { useState, useCallback, useEffect } from 'react';
import { calculate, getHistory, clearHistory } from './calculaterApi';
 
/**
 * useCalculator — encapsulates all calculator state and logic.
 * Separates concerns from the UI layer.
 */
export const useCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [operand1, setOperand1] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand2, setWaitingForOperand2] = useState(false);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [justCalculated, setJustCalculated] = useState(false);
 
  const fetchHistory = useCallback(async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch {
      // Backend might not be running; silently ignore
    }
  }, []);
 
  // Fetch history on mount
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) fetchHistory();
    });
    return () => {
      cancelled = true;
    };
  }, [fetchHistory]);
 
  /**
   * Handle number / decimal input
   */
  const inputDigit = useCallback((digit) => {
    setError(null);
 
    if (justCalculated && digit !== '.') {
      setDisplay(String(digit));
      setJustCalculated(false);
      return;
    }
 
    if (waitingForOperand2) {
      setDisplay(String(digit));
      setWaitingForOperand2(false);
    } else {
      setDisplay(prev =>
        prev === '0' && digit !== '.' ? String(digit)
          : prev.includes('.') && digit === '.' ? prev
          : prev.length >= 15 ? prev               // cap at 15 chars
          : prev + digit
      );
    }
  }, [waitingForOperand2, justCalculated]);
 
  /**
   * Reset calculator state
   */
  const reset = useCallback((full = true) => {
    if (full) {
      setDisplay('0');
      setExpression('');
      setOperand1(null);
      setOperator(null);
      setWaitingForOperand2(false);
      setJustCalculated(false);
      setError(null);
    }
  }, []);
 
  /**
   * Execute the pending calculation
   */
  const performCalculation = useCallback(async (a, b, op, nextOp = null) => {
    setIsLoading(true);
    const opSymbol = { '+': '+', '-': '−', '*': '×', '/': '÷', '%': '%' }[op];
    setExpression(`${formatDisplay(a)} ${opSymbol} ${formatDisplay(b)} =`);
 
    try {
      const result = await calculate(a, b, op);
 
      if (result.success) {
        const formatted = formatNumber(result.result);
        setDisplay(formatted);
        setOperand1(nextOp ? result.result : null);
        setOperator(nextOp);
        setWaitingForOperand2(nextOp ? true : false);
        setJustCalculated(!nextOp);
        if (nextOp) {
          const nextSymbol = { '+': '+', '-': '−', '*': '×', '/': '÷', '%': '%' }[nextOp];
          setExpression(`${formatted} ${nextSymbol}`);
        }
      } else {
        setError(result.errorMessage || 'Error');
        setDisplay('Error');
        reset(false);
      }
 
      await fetchHistory();
    } catch {
      setError('Backend offline – check Spring Boot server');
      setDisplay('No Server');
    } finally {
      setIsLoading(false);
    }
  }, [fetchHistory, reset]);
 
  /**
   * Handle operator selection (+, -, *, /, %)
   */
  const inputOperator = useCallback((nextOperator) => {
    setError(null);
    setJustCalculated(false);
    const current = parseFloat(display);
 
    if (operand1 !== null && !waitingForOperand2 && operator) {
      // Chain calculations — evaluate immediately
      performCalculation(operand1, current, operator, nextOperator);
    } else {
      setOperand1(current);
      setOperator(nextOperator);
      setWaitingForOperand2(true);
 
      const opSymbol = { '+': '+', '-': '−', '*': '×', '/': '÷', '%': '%' }[nextOperator];
      setExpression(`${formatDisplay(current)} ${opSymbol}`);
    }
  }, [display, operand1, operator, waitingForOperand2, performCalculation]);
 
  /**
   * Equals button
   */
  const handleEquals = useCallback(() => {
    if (operand1 === null || operator === null) return;
    const current = parseFloat(display);
    performCalculation(operand1, current, operator);
  }, [operand1, operator, display, performCalculation]);
 
  /**
   * Toggle positive/negative
   */
  const toggleSign = useCallback(() => {
    setDisplay(prev => String(parseFloat(prev) * -1));
  }, []);
 
  /**
   * Backspace — delete last character
   */
  const backspace = useCallback(() => {
    setDisplay(prev =>
      prev.length > 1 && prev !== 'Error' ? prev.slice(0, -1) : '0'
    );
  }, []);
 
  /**
   * Clear history via API
   */
  const handleClearHistory = useCallback(async () => {
    try {
      await clearHistory();
      setHistory([]);
    } catch {
      setError('Could not clear history');
    }
  }, []);
 
  // Keyboard support 
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
      else if (e.key === '.') inputDigit('.');
      else if (e.key === '+') inputOperator('+');
      else if (e.key === '-') inputOperator('-');
      else if (e.key === '*') inputOperator('*');
      else if (e.key === '/') { e.preventDefault(); inputOperator('/'); }
      else if (e.key === '%') inputOperator('%');
      else if (e.key === 'Enter' || e.key === '=') handleEquals();
      else if (e.key === 'Backspace') backspace();
      else if (e.key === 'Escape') reset();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputDigit, inputOperator, handleEquals, backspace, reset]);
 
  return {
    display, expression, history, isLoading, error,
    inputDigit, inputOperator, handleEquals,
    toggleSign, backspace, reset, handleClearHistory,
    activeOperator: operator,
  };
};
 
//  Helpers
 
function formatNumber(num) {
  if (Number.isInteger(num)) return String(num);
  const str = String(num);
  return str.length > 10 ? parseFloat(num.toPrecision(10)).toString() : str;
}
 
function formatDisplay(num) {
  return Number.isInteger(num) ? String(num) : parseFloat(num.toPrecision(8)).toString();
}