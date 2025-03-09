import { ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function StatCard({ title, value, change, trend, period, icon: Icon }) {
  return (
    <div className="adminDashboard-card">
      <div className="adminDashboard-card-header">
        <h3 className="adminDashboard-card-title">{title}</h3>
        <Icon className="adminDashboard-card-icon" />
      </div>
      <div className="adminDashboard-card-content">
        <div className="adminDashboard-stat-value">{value}</div>
        <p className="adminDashboard-stat-comparison">
          <span className={`adminDashboard-stat-${trend === "up" ? "increase" : "decrease"}`}>
            {trend === "up" ? (
              <ArrowUpRight className="adminDashboard-trend-icon" />
            ) : (
              <ArrowDownRight className="adminDashboard-trend-icon" />
            )}
            {change}
          </span>
          {period}
        </p>
      </div>
    </div>
  )
}

