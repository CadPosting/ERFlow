// Touch target primitive for the kiosk: minimum 88px tall, icon + label.
function BigButton({ icon, label, sublabel, onClick, color, selected = false }) {
  return (
    <button
      type="button"
      className={`big-button ${selected ? 'selected' : ''}`}
      style={color ? { '--big-button-accent': color } : undefined}
      onClick={onClick}
      aria-pressed={selected}
    >
      {icon && <span className="big-button-icon" aria-hidden="true">{icon}</span>}
      <span className="big-button-text">
        <span className="big-button-label">{label}</span>
        {sublabel && <span className="big-button-sublabel">{sublabel}</span>}
      </span>
    </button>
  )
}

export default BigButton
