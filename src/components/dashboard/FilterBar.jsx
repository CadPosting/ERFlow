import { useLanguage } from '../../i18n/context.js'
import { severities } from '../../data/severities.js'

function FilterBar({ venue, filters, onChange }) {
  const { t } = useLanguage()
  const internalDepartments = venue.departments.filter((d) => !d.external)

  return (
    <div className="filter-bar glass-card">
      <label>
        Department
        <select value={filters.department} onChange={(e) => onChange({ ...filters, department: e.target.value })}>
          <option value="all">All</option>
          {internalDepartments.map((d) => (
            <option key={d.id} value={d.id}>{t(d.nameKey)}</option>
          ))}
        </select>
      </label>

      <label>
        Severity
        <select value={filters.severity} onChange={(e) => onChange({ ...filters, severity: e.target.value })}>
          <option value="all">All</option>
          {severities.map((s) => (
            <option key={s.id} value={s.id}>{t(s.labelKey)}</option>
          ))}
        </select>
      </label>

      <label className="filter-checkbox">
        <input
          type="checkbox"
          checked={filters.showResolved}
          onChange={(e) => onChange({ ...filters, showResolved: e.target.checked })}
        />
        Show resolved
      </label>
    </div>
  )
}

export default FilterBar
