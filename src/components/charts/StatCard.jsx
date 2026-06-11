function StatCard({ label, value, hint }) {
  return (
    <div className="stat-card glass-card">
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
      {hint && <p className="stat-hint">{hint}</p>}
    </div>
  )
}

export default StatCard
