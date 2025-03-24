"use client"

import { useEffect, useRef, useState } from "react"
import "./ModeloMatematico.css"

export default function PrediccionPaciente() {
  // Estados para los datos del paciente
  const [movilidadActual, setMovilidadActual] = useState(64)
  const [movilidadObjetivo, setMovilidadObjetivo] = useState(90)
  const [movilidadInicial, setMovilidadInicial] = useState(50)
  const [sesionesCompletadas, setSesionesCompletadas] = useState(9)
  const [sesionesProgramadas, setSesionesProgramadas] = useState(48)
  const [idPaciente, setIdPaciente] = useState("P-12345")
  const [tipoLesion, setTipoLesion] = useState("Lesión muscular postquirúrgica")
  const [tratamiento, setTratamiento] = useState("Ejercicios funcionales + Electroestimulación")

  // Constante para la ecuación diferencial (k)
  const [constanteK, setConstanteK] = useState(0.15)

  // Cálculo del tiempo estimado basado en la ecuación diferencial
  const calcularTiempoEstimado = () => {
    // M(t) = 50 + (M0 - 50)(1 - e^(-k*t))
    // Despejando t: t = -ln(1 - (M - 50)/(M0 - 50))/k
    if (movilidadObjetivo <= 50 || movilidadInicial <= 50) return 0

    const numerador = 1 - (movilidadObjetivo - 50) / (movilidadInicial - 50)
    if (numerador <= 0) return 0

    const tiempo = -Math.log(numerador) / constanteK
    return Math.ceil(tiempo)
  }

  const tiempoEstimado = calcularTiempoEstimado()

  // Referencia para el canvas de la gráfica
  const canvasRef = useRef(null)

  // Función para calcular la movilidad en un tiempo dado
  const calcularMovilidad = (tiempoSemanas) => {
    return 50 + (movilidadInicial - 50) * (1 - Math.exp(-constanteK * tiempoSemanas))
  }

  // Dibujar la gráfica
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height)

    // Configuración de la gráfica
    const padding = 40
    const graphWidth = width - padding * 2
    const graphHeight = height - padding * 2

    // Dibujar ejes
    ctx.beginPath()
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 1
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Etiquetas de ejes
    ctx.fillStyle = "#333"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Tiempo (semanas)", width / 2, height - 10)

    ctx.save()
    ctx.translate(15, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textAlign = "center"
    ctx.fillText("Movilidad (%)", 0, 0)
    ctx.restore()

    // Calcular puntos para la curva
    const maxSemanas = Math.max(tiempoEstimado * 1.2, 20)
    const maxMovilidad = Math.max(movilidadObjetivo * 1.1, 120)

    // Dibujar líneas de cuadrícula
    ctx.strokeStyle = "#ddd"
    ctx.lineWidth = 0.5

    // Líneas horizontales
    for (let i = 0; i <= 100; i += 20) {
      const y = height - padding - (i / maxMovilidad) * graphHeight
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
      ctx.fillText(i.toString(), padding - 15, y + 5)
    }

    // Líneas verticales
    for (let i = 0; i <= maxSemanas; i += 4) {
      const x = padding + (i / maxSemanas) * graphWidth
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
      ctx.stroke()
      ctx.fillText(i.toString(), x, height - padding + 15)
    }

    // Dibujar la curva de predicción
    ctx.beginPath()
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2

    for (let i = 0; i <= maxSemanas; i += 0.1) {
      const movilidad = calcularMovilidad(i)
      const x = padding + (i / maxSemanas) * graphWidth
      const y = height - padding - (movilidad / maxMovilidad) * graphHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()

    // Marcar punto inicial
    const xInicial = padding
    const yInicial = height - padding - (movilidadInicial / maxMovilidad) * graphHeight
    ctx.beginPath()
    ctx.arc(xInicial, yInicial, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#3b82f6"
    ctx.fill()

    // Marcar punto actual
    const tiempoActual = -Math.log(1 - (movilidadActual - 50) / (movilidadInicial - 50)) / constanteK
    const xActual = padding + (tiempoActual / maxSemanas) * graphWidth
    const yActual = height - padding - (movilidadActual / maxMovilidad) * graphHeight

    ctx.beginPath()
    ctx.arc(xActual, yActual, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#10b981"
    ctx.fill()

    // Marcar punto objetivo
    const xObjetivo = padding + (tiempoEstimado / maxSemanas) * graphWidth
    const yObjetivo = height - padding - (movilidadObjetivo / maxMovilidad) * graphHeight

    ctx.beginPath()
    ctx.arc(xObjetivo, yObjetivo, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#ef4444"
    ctx.fill()

    // Línea punteada hasta el objetivo
    ctx.beginPath()
    ctx.setLineDash([5, 3])
    ctx.strokeStyle = "#ef4444"
    ctx.moveTo(xActual, yActual)
    ctx.lineTo(xObjetivo, yObjetivo)
    ctx.stroke()
    ctx.setLineDash([])

    // Leyenda
    const leyendaX = width - padding - 150
    const leyendaY = padding + 20

    // Inicial
    ctx.beginPath()
    ctx.arc(leyendaX, leyendaY, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#3b82f6"
    ctx.fill()
    ctx.fillStyle = "#333"
    ctx.textAlign = "left"
    ctx.fillText("Inicio: Movilidad al " + movilidadInicial + "%", leyendaX + 10, leyendaY + 5)

    // Actual
    ctx.beginPath()
    ctx.arc(leyendaX, leyendaY + 20, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#10b981"
    ctx.fill()
    ctx.fillStyle = "#333"
    ctx.fillText("Actual: Movilidad al " + movilidadActual + "%", leyendaX + 10, leyendaY + 25)

    // Objetivo
    ctx.beginPath()
    ctx.arc(leyendaX, leyendaY + 40, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#ef4444"
    ctx.fill()
    ctx.fillStyle = "#333"
    ctx.fillText("Objetivo: Movilidad al " + movilidadObjetivo + "%", leyendaX + 10, leyendaY + 45)
  }, [movilidadActual, movilidadObjetivo, movilidadInicial, constanteK, tiempoEstimado, calcularMovilidad])

  // Calcular porcentaje faltante
  const porcentajeFaltante = movilidadObjetivo - movilidadActual

  // Calcular porcentaje de progreso desde el inicio
  const progresoDesdeInicio = movilidadActual - movilidadInicial

  // Calcular sesiones restantes
  const sesionesRestantes = sesionesProgramadas - sesionesCompletadas

  return (
    <div className="prediccion-container">
      <h1>Predicción de Recuperación del Paciente</h1>
      <p className="subtitle">Modelo predictivo de movilidad usando ecuaciones diferenciales</p>

      <div className="cards-container">
        <div className="card">
          <div className="card-header">
            <h3>Movilidad Actual</h3>
            <span className="icon">📈</span>
          </div>
          <div className="card-value">{movilidadActual}%</div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${movilidadActual}%` }}></div>
          </div>
          <p className="card-detail">+{progresoDesdeInicio}% desde el inicio del tratamiento</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Movilidad Objetivo</h3>
            <span className="icon">🎯</span>
          </div>
          <div className="card-value">{movilidadObjetivo}%</div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${movilidadObjetivo}%` }}></div>
          </div>
          <p className="card-detail">Falta {porcentajeFaltante}% para completar</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Tiempo Estimado</h3>
            <span className="icon">⏱️</span>
          </div>
          <div className="card-value">{tiempoEstimado} semanas</div>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${(tiempoEstimado / 52) * 100 > 100 ? 100 : (tiempoEstimado / 52) * 100}%` }}
            ></div>
          </div>
          <p className="card-detail">Para alcanzar al {movilidadObjetivo}% de movilidad</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Tratamientos</h3>
            <span className="icon">📋</span>
          </div>
          <div className="card-value">
            {sesionesCompletadas}/{sesionesProgramadas}
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(sesionesCompletadas / sesionesProgramadas) * 100}%` }}></div>
          </div>
          <p className="card-detail">{sesionesRestantes} sesiones restantes</p>
        </div>
      </div>

      <div className="main-content">
        <div className="graph-container">
          <h2>Predicción de Evolución de Movilidad</h2>
          <p>La gráfica muestra la evolución real y la predicción basada en el modelo matemático</p>
          <canvas ref={canvasRef} width={800} height={400} className="graph-canvas"></canvas>
        </div>

        <div className="patient-details">
          <h2>Detalles del Paciente</h2>
          <p>Información y parámetros del modelo</p>

          <div className="detail-item">
            <label>ID del Paciente</label>
            <input type="text" value={idPaciente} onChange={(e) => setIdPaciente(e.target.value)} />
          </div>

          <div className="detail-item">
            <label>Tipo de Lesión</label>
            <input type="text" value={tipoLesion} onChange={(e) => setTipoLesion(e.target.value)} />
          </div>

          <div className="detail-item">
            <label>Tratamiento</label>
            <input type="text" value={tratamiento} onChange={(e) => setTratamiento(e.target.value)} />
          </div>

          <div className="detail-item">
            <label>Movilidad Inicial (%)</label>
            <input
              type="number"
              value={movilidadInicial}
              onChange={(e) => setMovilidadInicial(Number(e.target.value))}
              min="0"
              max="100"
            />
          </div>

          <div className="detail-item">
            <label>Movilidad Actual (%)</label>
            <input
              type="number"
              value={movilidadActual}
              onChange={(e) => setMovilidadActual(Number(e.target.value))}
              min="0"
              max="100"
            />
          </div>

          <div className="detail-item">
            <label>Movilidad Objetivo (%)</label>
            <input
              type="number"
              value={movilidadObjetivo}
              onChange={(e) => setMovilidadObjetivo(Number(e.target.value))}
              min="0"
              max="150"
            />
          </div>

          <div className="detail-item">
            <label>Constante de Recuperación (k)</label>
            <input
              type="number"
              value={constanteK}
              onChange={(e) => setConstanteK(Number(e.target.value))}
              min="0.01"
              max="1"
              step="0.01"
            />
          </div>

          <div className="detail-item">
            <label>Sesiones Completadas</label>
            <input
              type="number"
              value={sesionesCompletadas}
              onChange={(e) => setSesionesCompletadas(Number(e.target.value))}
              min="0"
              max={sesionesProgramadas}
            />
          </div>

          <div className="detail-item">
            <label>Sesiones Programadas</label>
            <input
              type="number"
              value={sesionesProgramadas}
              onChange={(e) => setSesionesProgramadas(Number(e.target.value))}
              min="1"
            />
          </div>

          <div className="equation-box">
            <h3>Ecuación aplicada</h3>
            <p className="equation">
              M(t) = 50 + (M₀ - 50)(1 - e<sup>-{constanteK}t</sup>)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

