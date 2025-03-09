import { Clock, Users, FileText, DollarSign } from "lucide-react"
import StatCard from "./statCard"

export default function StatCards() {
  const stats = [
    {
      title: "Citas hoy",
      value: "12",
      change: "+8%",
      trend: "up",
      period: "vs semana pasada",
      icon: Clock,
    },
    {
      title: "Pacientes activos",
      value: "248",
      change: "+12%",
      trend: "up",
      period: "vs mes pasado",
      icon: Users,
    },
    {
      title: "Artículos publicados",
      value: "32",
      change: "-3%",
      trend: "down",
      period: "vs mes pasado",
      icon: FileText,
    },
    {
      title: "Ingresos mensuales",
      value: "$12,450",
      change: "+18%",
      trend: "up",
      period: "vs mes pasado",
      icon: DollarSign,
    },
  ]

  return (
    <div className="adminDashboard-stats-grid">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}

