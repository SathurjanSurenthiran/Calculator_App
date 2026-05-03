import './styles/Button.css';

/**
 * Reusable calculator button component.
 * Variants: 'number', 'operator', 'equals', 'action', 'zero'
 */
const Button = ({ label, onClick, variant = 'number', active = false, disabled = false }) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      // Trigger haptic feedback on mobile if available
      if (navigator.vibrate) navigator.vibrate(10);
      onClick();
    }
  };

  return (
    <button
      className={`calc-btn calc-btn--${variant} ${active ? 'calc-btn--active' : ''} ${disabled ? 'calc-btn--disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
      aria-label={label}
    >
      <span className="calc-btn__inner">{label}</span>
    </button>
  );
};

export default Button;
