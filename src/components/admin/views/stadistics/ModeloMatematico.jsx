"use client"

import { useEffect, useRef, useState } from "react"
import "./ModeloMatematico.css"

// Datos de muestra de pacientes
const pacientesMuestra = [
  {
    id: "1",
    nombre: "Juan Pérez",
    lesion: "Ruptura de ligamentos",
    movilidadInicial: 60,
    movilidadK: 84,
    movilidadObjetivo: 108,
    fechaInicial: "2025-01-07",
    fechaK: "2025-01-28",
  },
  {
    id: "2",
    nombre: "María González",
    lesion: "Fractura de tibia",
    movilidadInicial: 45,
    movilidadK: 65,
    movilidadObjetivo: 95,
    fechaInicial: "2025-02-10",
    fechaK: "2025-03-01",
  },
  {
    id: "3",
    nombre: "Carlos Rodríguez",
    lesion: "Tendinitis rotuliana",
    movilidadInicial: 70,
    movilidadK: 85,
    movilidadObjetivo: 110,
    fechaInicial: "2025-01-15",
    fechaK: "2025-02-05",
  },
  {
    id: "4",
    nombre: "Ana Martínez",
    lesion: "Esguince de tobillo",
    movilidadInicial: 50,
    movilidadK: 75,
    movilidadObjetivo: 100,
    fechaInicial: "2025-02-20",
    fechaK: "2025-03-15",
  },
  {
    id: "5",
    nombre: "Roberto Sánchez",
    lesion: "Lesión de menisco",
    movilidadInicial: 55,
    movilidadK: 70,
    movilidadObjetivo: 105,
    fechaInicial: "2025-01-20",
    fechaK: "2025-02-15",
  },
]

export default function PrediccionPaciente() {
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(pacientesMuestra[0].id)
  const [movilidadInicial, setMovilidadInicial] = useState(60)
  const [movilidadK, setMovilidadK] = useState(84)
  const [movilidadObjetivo, setMovilidadObjetivo] = useState(108)
  const [fechaInicial, setFechaInicial] = useState("2025-01-07")
  const [fechaK, setFechaK] = useState("2025-01-28")
  const [constanteK, setConstanteK] = useState(null)
  const [tiempoEstimado, setTiempoEstimado] = useState(null)
  const [fechaEstimada, setFechaEstimada] = useState(null)
  const [datosSemanales, setDatosSemanales] = useState([])
  const [activeTab, setActiveTab] = useState("grafica")
  const [patientId, setPatientId] = useState("1")
  const [patientName, setPatientName] = useState("Juan Perez")
  const [patientInjury, setPatientInjury] = useState("Ruptura de ligamentos")

  const canvasRef = useRef(null)

  // Cargar datos del paciente seleccionado
  useEffect(() => {
    const paciente = pacientesMuestra.find((p) => p.id === pacienteSeleccionado)
    if (paciente) {
      setMovilidadInicial(paciente.movilidadInicial)
      setMovilidadK(paciente.movilidadK)
      setMovilidadObjetivo(paciente.movilidadObjetivo)
      setFechaInicial(paciente.fechaInicial)
      setFechaK(paciente.fechaK)
      setPatientId(paciente.id)
      setPatientName(paciente.nombre)
      setPatientInjury(paciente.lesion)
    }
  }, [pacienteSeleccionado])

  const calcularConstanteK = () => {
    const t = (new Date(fechaK) - new Date(fechaInicial)) / (1000 * 60 * 60 * 24 * 7)
    if (t <= 0) return null
    const k = Math.log(movilidadK / movilidadInicial) / t
    return k
  }

  const calcularSemanasParaObjetivo = (k) => {
    const t = Math.log(movilidadObjetivo / movilidadInicial) / k
    return t
  }

  const calcularMovilidad = (t, k) => movilidadInicial * Math.exp(k * t)

  const calcularFechaEstimada = (semanas) => {
    if (semanas === null) return null
    const fechaIni = new Date(fechaInicial)
    const fechaEst = new Date(fechaIni)
    fechaEst.setDate(fechaIni.getDate() + Math.round(semanas * 7))
    return fechaEst.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const generarDatosSemanales = (k) => {
    if (!k) return []

    const maxSemanas = Math.ceil(tiempoEstimado || 10)
    const datos = []

    for (let semana = 0; semana <= maxSemanas; semana++) {
      const movilidad = calcularMovilidad(semana, k)
      const fecha = new Date(fechaInicial)
      fecha.setDate(fecha.getDate() + semana * 7)

      // Ensure consistency with initial and evaluated points
      let movilidadFinal = movilidad
      if (semana === 0) {
        movilidadFinal = movilidadInicial
      } else if (Math.abs((new Date(fechaK) - new Date(fechaInicial)) / (1000 * 60 * 60 * 24 * 7) - semana) < 0.1) {
        movilidadFinal = movilidadK
      }

      datos.push({
        semana,
        fecha: fecha.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        movilidad: movilidadFinal.toFixed(1),
      })
    }

    return datos
  }

  useEffect(() => {
    const k = calcularConstanteK()
    setConstanteK(k)

    if (k) {
      const t = calcularSemanasParaObjetivo(k)
      setTiempoEstimado(t)
      setFechaEstimada(calcularFechaEstimada(t))
      setDatosSemanales(generarDatosSemanales(k))
    } else {
      setTiempoEstimado(null)
      setFechaEstimada(null)
      setDatosSemanales([])
    }
  }, [movilidadInicial, movilidadK, movilidadObjetivo, fechaInicial, fechaK])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !constanteK) return

    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height
    ctx.clearRect(0, 0, width, height)

    const padding = 50
    const graphWidth = width - padding * 2
    const graphHeight = height - padding * 2

    // Background
    ctx.fillStyle = "#f8fafc"
    ctx.fillRect(0, 0, width, height)

    // Grid
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1

    const maxT = Math.ceil(tiempoEstimado || 10) + 1
    const maxM = movilidadObjetivo + 30

    for (let i = 0; i <= maxT; i++) {
      const x = padding + (i / maxT) * graphWidth
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
    }

    for (let i = 0; i <= maxM; i += 10) {
      const y = height - padding - (i / maxM) * graphHeight
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
    }
    ctx.stroke()

    // Axes
    ctx.beginPath()
    ctx.strokeStyle = "#64748b"
    ctx.lineWidth = 2
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Labels
    ctx.fillStyle = "#334155"
    ctx.font = "14px Inter, system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Tiempo (semanas)", width / 2, height - 10)

    ctx.save()
    ctx.translate(15, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText("Movilidad (°)", 0, 0)
    ctx.restore()

    // Axis values
    ctx.font = "12px Inter, system-ui, sans-serif"
    for (let i = 0; i <= maxT; i++) {
      const x = padding + (i / maxT) * graphWidth
      ctx.fillText(i.toString(), x, height - padding + 20)
    }

    for (let i = 0; i <= maxM; i += 10) {
      const y = height - padding - (i / maxM) * graphHeight
      ctx.textAlign = "right"
      ctx.fillText(i + "°", padding - 10, y + 4)
    }

    // Initial and evaluated points
    const x0 = padding
    const y0 = height - padding - (movilidadInicial / maxM) * graphHeight
    const t1 = (new Date(fechaK) - new Date(fechaInicial)) / (1000 * 60 * 60 * 24 * 7)
    const x1 = padding + (t1 / maxT) * graphWidth
    const y1 = height - padding - (movilidadK / maxM) * graphHeight

    // Target point
    const xTarget = padding + (tiempoEstimado / maxT) * graphWidth
    const yTarget = height - padding - (movilidadObjetivo / maxM) * graphHeight

    // Curve
    ctx.beginPath()
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 3
    for (let t = 0; t <= maxT; t += 0.1) {
      const m = calcularMovilidad(t, constanteK)
      const x = padding + (t / maxT) * graphWidth
      const y = height - padding - (m / maxM) * graphHeight
      if (t === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Area under curve
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    for (let t = 0; t <= maxT; t += 0.1) {
      const m = calcularMovilidad(t, constanteK)
      const x = padding + (t / maxT) * graphWidth
      const y = height - padding - (m / maxM) * graphHeight
      ctx.lineTo(x, y)
    }
    ctx.lineTo(padding + graphWidth, height - padding)
    ctx.closePath()
    ctx.fillStyle = "rgba(59, 130, 246, 0.1)"
    ctx.fill()

    // Points
    // Initial point
    ctx.beginPath()
    ctx.arc(x0, y0, 6, 0, Math.PI * 2)
    ctx.fillStyle = "#10b981"
    ctx.fill()
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 2
    ctx.stroke()

    // Evaluated point
    ctx.beginPath()
    ctx.arc(x1, y1, 6, 0, Math.PI * 2)
    ctx.fillStyle = "#f59e0b"
    ctx.fill()
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 2
    ctx.stroke()

    // Target point
    if (tiempoEstimado !== null) {
      ctx.beginPath()
      ctx.arc(xTarget, yTarget, 6, 0, Math.PI * 2)
      ctx.fillStyle = "#ef4444"
      ctx.fill()
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Target line
      ctx.beginPath()
      ctx.setLineDash([5, 5])
      ctx.strokeStyle = "#ef4444"
      ctx.lineWidth = 1
      ctx.moveTo(padding, yTarget)
      ctx.lineTo(xTarget, yTarget)
      ctx.lineTo(xTarget, height - padding)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Legend
    const legendX = width - padding - 150
    const legendY = padding + 20

    ctx.font = "12px Inter, system-ui, sans-serif"
    ctx.textAlign = "left"

    // Initial
    ctx.beginPath()
    ctx.arc(legendX, legendY, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#10b981"
    ctx.fill()
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = "#334155"
    ctx.fillText("Inicial", legendX + 10, legendY + 4)

    // Evaluated
    ctx.beginPath()
    ctx.arc(legendX, legendY + 20, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#f59e0b"
    ctx.fill()
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = "#334155"
    ctx.fillText("Evaluada", legendX + 10, legendY + 24)

    // Target
    ctx.beginPath()
    ctx.arc(legendX, legendY + 40, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#ef4444"
    ctx.fill()
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = "#334155"
    ctx.fillText("Objetivo", legendX + 10, legendY + 44)
  }, [constanteK, tiempoEstimado, movilidadInicial, movilidadK, movilidadObjetivo])

  return (
    <div className="prediccion-container">
      <div className="header">
        <h1>Predicción de Recuperación de Movilidad</h1>
        <p>Modelo matemático para estimar el tiempo de recuperación basado en mediciones de movilidad</p>
      </div>

      <div className="patient-selector">
        <label htmlFor="paciente-select">Seleccionar Paciente:</label>
        <select
          id="paciente-select"
          className="select-paciente"
          value={pacienteSeleccionado}
          onChange={(e) => setPacienteSeleccionado(e.target.value)}
        >
          {pacientesMuestra.map((paciente) => (
            <option key={paciente.id} value={paciente.id}>
              {paciente.id}: {paciente.nombre} - {paciente.lesion}
            </option>
          ))}
        </select>
      </div>

      <div className="main-grid">
        <div className="patient-card">
          <div className="card-header">
            <div className="card-title">
              <span className="icon-activity"></span>
              Datos del Paciente
            </div>
            <div className="card-description">Ingrese los datos de movilidad y fechas de evaluación</div>
          </div>
          <div className="card-content">
            <div className="form-group">
              <label htmlFor="movilidadInicial" className="label-with-badge">
                <span className="badge badge-green">Inicial</span>
                Movilidad Inicial (°)
              </label>
              <input
                id="movilidadInicial"
                type="number"
                value={movilidadInicial}
                onChange={(e) => setMovilidadInicial(Number(e.target.value))}
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fechaInicial" className="label-with-icon">
                <span className="icon-calendar"></span>
                Fecha Inicial
              </label>
              <div className="input-wrapper">
                <input
                  id="fechaInicial"
                  type="date"
                  value={fechaInicial}
                  onChange={(e) => setFechaInicial(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="movilidadK" className="label-with-badge">
                <span className="badge badge-amber">Evaluada</span>
                Movilidad Evaluada (°)
              </label>
              <input
                id="movilidadK"
                type="number"
                value={movilidadK}
                onChange={(e) => setMovilidadK(Number(e.target.value))}
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fechaK" className="label-with-icon">
                <span className="icon-calendar"></span>
                Fecha Evaluada
              </label>
              <div className="input-wrapper">
                <input
                  id="fechaK"
                  type="date"
                  value={fechaK}
                  onChange={(e) => setFechaK(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="movilidadObjetivo" className="label-with-badge">
                <span className="badge badge-red">Objetivo</span>
                Movilidad Objetivo (°)
              </label>
              <input
                id="movilidadObjetivo"
                type="number"
                value={movilidadObjetivo}
                onChange={(e) => setMovilidadObjetivo(Number(e.target.value))}
                className="input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="patientId" className="label-with-icon">
                <span className="icon-user"></span>
                ID del Paciente
              </label>
              <input
                id="patientId"
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="input"
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="patientName" className="label-with-icon">
                <span className="icon-user"></span>
                Nombre del Paciente
              </label>
              <input
                id="patientName"
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="patientInjury" className="label-with-icon">
                <span className="icon-activity"></span>
                Lesión
              </label>
              <input
                id="patientInjury"
                type="text"
                value={patientInjury}
                onChange={(e) => setPatientInjury(e.target.value)}
                className="input"
              />
            </div>

            <div className="results-card">
              <div className="result-item">
                <h3>Constante de recuperación (k)</h3>
                <p className="result-value">{constanteK ? constanteK.toFixed(4) : "No calculada"}</p>
              </div>
              <div className="result-item">
                <h3>Tiempo estimado para {movilidadObjetivo}°</h3>
                <p className="result-value">
                  {tiempoEstimado !== null ? tiempoEstimado.toFixed(2) + " semanas" : "No calculado"}
                </p>
                {fechaEstimada && <p className="result-date">Fecha estimada: {fechaEstimada}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="visualization-card">
          <div className="visualization-header">
            <div className="header-with-tabs">
              <div className="card-title">
                <span className="icon-chart"></span>
                Visualización de Recuperación
              </div>
              <div className="tabs-list">
                <button
                  className={`tab ${activeTab === "grafica" ? "active" : ""}`}
                  onClick={() => setActiveTab("grafica")}
                >
                  Gráfica
                </button>
                <button
                  className={`tab ${activeTab === "tabla" ? "active" : ""}`}
                  onClick={() => setActiveTab("tabla")}
                >
                  Tabla
                </button>
              </div>
            </div>
            <div className="card-description">Proyección de la recuperación de movilidad a lo largo del tiempo</div>
          </div>
          <div className="patient-info-display">
            <div className="patient-info-item">
              <span className="patient-info-label">ID:</span> {patientId}
            </div>
            <div className="patient-info-item">
              <span className="patient-info-label">Nombre:</span> {patientName}
            </div>
            <div className="patient-info-item">
              <span className="patient-info-label">Lesión:</span> {patientInjury}
            </div>
          </div>
          <div className="visualization-content">
            <div className={`tab-content ${activeTab === "grafica" ? "active" : ""}`}>
              <div className="graph-container">
                <canvas ref={canvasRef} width={800} height={500} className="graph-canvas" />
              </div>
              <div className="summary-cards">
                <div className="summary-card">
                  <div className="color-dot green"></div>
                  <div className="summary-text">
                    <p className="summary-label">Movilidad Inicial</p>
                    <p className="summary-value">{movilidadInicial}°</p>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="color-dot amber"></div>
                  <div className="summary-text">
                    <p className="summary-label">Movilidad Evaluada</p>
                    <p className="summary-value">{movilidadK}°</p>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="color-dot red"></div>
                  <div className="summary-text">
                    <p className="summary-label">Movilidad Objetivo</p>
                    <p className="summary-value">{movilidadObjetivo}°</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`tab-content ${activeTab === "tabla" ? "active" : ""}`}>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Semana</th>
                      <th>Fecha</th>
                      <th>Movilidad (°)</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosSemanales.map((dato) => (
                      <tr key={dato.semana}>
                        <td className="cell-semana">{dato.semana}</td>
                        <td>{dato.fecha}</td>
                        <td>{dato.movilidad}°</td>
                        <td>
                          {dato.semana === 0 ? (
                            <span className="badge badge-green">Inicial</span>
                          ) : Number(dato.movilidad) >= movilidadObjetivo ? (
                            <span className="badge badge-blue">Objetivo alcanzado</span>
                          ) : (
                            <span className="badge badge-gray">En progreso</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

