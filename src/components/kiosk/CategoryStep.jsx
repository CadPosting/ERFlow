import { useLanguage } from '../../i18n/context.js'
import BigButton from './BigButton.jsx'

// Renders either the venue's categories or, once one is chosen, its
// subcategories — the wizard reducer decides which via `mode`.
function CategoryStep({ venue, mode, categoryId, onPick }) {
  const { t } = useLanguage()

  const options =
    mode === 'category'
      ? venue.categories
      : venue.categories.find((c) => c.id === categoryId)?.subcategories ?? []

  return (
    <div className="kiosk-step">
      <h1 className="kiosk-title">{t(mode === 'category' ? 'kiosk.whatProblem' : 'kiosk.whichBest')}</h1>
      <div className="kiosk-options">
        {options.map((option) => (
          <BigButton
            key={option.id}
            icon={option.icon ?? venue.categories.find((c) => c.id === categoryId)?.icon}
            label={t(option.labelKey)}
            onClick={() => onPick(option.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default CategoryStep
