// Minimal SVG bar chart. `items`: [{ key, label, count, color? }].
// Horizontal bars read well for category names; vertical for short labels
// like weekdays.
function BarChart({ items, orientation = 'horizontal', height = 180 }) {
  const max = Math.max(1, ...items.map((i) => i.count))

  if (orientation === 'vertical') {
    const width = 360
    const barWidth = width / items.length
    return (
      <svg className="bar-chart" viewBox={`0 0 ${width} ${height}`} role="img">
        {items.map((item, i) => {
          const h = (item.count / max) * (height - 48)
          return (
            <g key={item.key}>
              <rect
                x={i * barWidth + barWidth * 0.15}
                y={height - 20 - h}
                width={barWidth * 0.7}
                height={h}
                rx="2"
                fill={item.color ?? 'var(--primary)'}
              />
              <text x={i * barWidth + barWidth / 2} y={height - 6} textAnchor="middle" className="bar-chart-label">
                {item.label}
              </text>
              <text x={i * barWidth + barWidth / 2} y={height - 26 - h} textAnchor="middle" className="bar-chart-value">
                {item.count || ''}
              </text>
            </g>
          )
        })}
      </svg>
    )
  }

  return (
    <div className="bar-chart-rows" role="img">
      {items.map((item) => (
        <div key={item.key} className="bar-chart-row">
          <span className="bar-chart-row-label">{item.label}</span>
          <div className="bar-chart-track">
            <div
              className="bar-chart-fill"
              style={{ width: `${(item.count / max) * 100}%`, background: item.color ?? 'var(--primary)' }}
            />
          </div>
          <span className="bar-chart-row-value">{item.count}</span>
        </div>
      ))}
    </div>
  )
}

export default BarChart
