const STEPS = ['category', 'subcategory', 'details', 'severity', 'confirm']

function WizardProgress({ step }) {
  const index = STEPS.indexOf(step)
  if (index === -1) return null
  return (
    <div className="wizard-progress" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={index + 1}>
      {STEPS.map((s, i) => (
        <span key={s} className={`wizard-dot ${i <= index ? 'done' : ''}`} />
      ))}
    </div>
  )
}

export default WizardProgress
